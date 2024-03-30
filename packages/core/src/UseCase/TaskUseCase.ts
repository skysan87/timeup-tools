import { dateFactory } from "../Util/DateUtil"
import { IHabitRepository, IHabitlistRepository, ITaskRepository, ITasklistRepository, ITransaction, ITransactionScope, IUserRepository } from "../Domain/Repository"
import { DateNumber, TaskState, TaskType, UserId } from "../Domain/ValueObject"
import { Habit, Task } from "../Domain/Model"
import { TaskBehavior } from "../Domain/Behavior/TaskBehavior"
import { HabitBehavior } from "../Domain/Behavior/HabitBehavior"
import { TasklistBehavior } from "../Domain/Behavior/TasklistBehavior"

export class TaskUseCase {

  constructor(
    private readonly userRepositpry: IUserRepository,
    private readonly taskRepository: ITaskRepository,
    private readonly tasklistRepository: ITasklistRepository,
    private readonly habitlistRepository: IHabitlistRepository,
    private readonly habitRepository: IHabitRepository,
    private readonly transaction: ITransaction
  ) { }

  private _userId: UserId | null = null

  private get userId(): UserId {
    return this._userId ?? this.userRepositpry.getFromCache().id
  }

  public create(data?: Partial<Task>): Task {
    return new TaskBehavior((data ?? {}) as Task).format()
  }

  public async getCurrentTasks(tasklistId: string): Promise<Task[]> {
    let t: Task[]
    await this.transaction.run(this.userId, async (scope) => {
      t = await this.taskRepository.get(scope, tasklistId)
    })
    return this.sort(t!)
  }

  /**
   * 今日のタスクを取得
   * @description
   * - 期限が今日以前の未完了のタスクを取得する
   * - 習慣を取得し、今日が対象日ならタスクに追加する
   */
  public async getTodaysTasks(): Promise<Task[]> {
    const today = dateFactory().getDateNumber() as DateNumber

    const todaysHabits: Habit[] = []
    const habitTasks: Task[] = []
    await this.transaction.run(this.userId, async scope => {
      // 1. 今日の習慣を取得
      const habitlistId = this.habitlistRepository.getId()
      const result = await this.habitRepository.getFromCache(scope, habitlistId)
      todaysHabits.push(...result.map(h => new HabitBehavior(h).action(() => { }))
        .filter(h => h.isActive && h.isPlanDay))

      // 2. 習慣のToDoをサーバーから取得
      habitTasks.push(...await this.taskRepository.getHabits(scope, today))
    })
    // 3. 1と2を比較して、2が存在しないものは、追加する
    const missinglist = todaysHabits.reduce((pre: Task[], _habit: Habit) => {
      // Habit.id === Todo.listId
      if (habitTasks.findIndex(v => v.listId === _habit.id) < 0) {
        const task = {
          type: TaskType.HABIT
          , listId: _habit.id // habitsのサブコレクションのId
          , userId: _habit.userId
          , title: _habit.title
          , detail: _habit.detail
          , lastActivityDate: _habit.lastActivityDate
          , startdate: today
          , enddate: today
          , orderIndex: _habit.orderIndex
        } as Task
        pre.push(new TaskBehavior(task).format())
      }
      return pre
    }, [])

    const tasks: Task[] = []

    // 習慣タスク
    tasks.push(...habitTasks)

    const addHabits = async (): Promise<Task[]> => {
      const h: Task[] = []
      await this.transaction.runBatch(this.userId, async (scope) => {
        if (missinglist.length > 0) {
          h.push(...await this.taskRepository.saveAll(scope, missinglist))
        }
      })
      return h
    }

    const todayTask = async (): Promise<Task[]> => {
      let h: Task[]
      await this.transaction.run(this.userId, async (scope) => {
        h = await this.taskRepository.getTodaysTasks(scope, today)
      })
      return h!
    }

    const todayDoneTask = async (): Promise<Task[]> => {
      let h: Task[]
      await this.transaction.run(this.userId, async (scope) => {
        h = await this.taskRepository.getTodaysDone(scope, today)
      })
      return h!
    }

    const [newhabitTasks, todaysTasks, todaysDone] = await Promise.all([
      // 新たに追加された習慣タスク
      addHabits(),
      // 今日の残タスク
      todayTask(),
      // 今日完了したタスク
      todayDoneTask()
    ])

    tasks.push(...newhabitTasks, ...todaysTasks, ...todaysDone)

    return this.sort(tasks)
  }

  /**
   * 作業中のタスクを取得
   */
  public async getInProgressTasks(): Promise<Task[]> {
    let result: Task[]
    await this.transaction.run(this.userId, async (scope) => {
      const today = dateFactory().getDateNumber() as DateNumber
      result = await this.taskRepository.getInProgressTasks(scope, today)
    })
    return result!
  }

  /**
   * タスクの追加
   */
  public async addTask(tasklistId: string, task: Partial<Task>): Promise<Task> {
    let result: Task

    await this.transaction.run(this.userId, async (scope) => {
      if (!await this.taskRepository.validateMaxSize(scope, tasklistId)) {
        throw new Error('これ以上登録できません')
      }
      const tasklist = await this.tasklistRepository.getById(scope, tasklistId)
      if (!tasklist) {
        throw new Error('Tasklist does not exist.')
      }

      const updatedTasklist = await new TasklistBehavior(tasklist).actionAsync(async behavior => {
        const newMaxIndex = behavior.get('maxIndex') + 1
        behavior.update({ maxIndex: newMaxIndex })
        await this.tasklistRepository.update(scope, behavior.format())
      })

      task.listId = tasklistId
      task.userId = this.userId
      task.orderIndex = updatedTasklist.maxIndex

      result = await new TaskBehavior(task as Task).actionAsync(async behvior => {
        behvior.update({ stateChangeDate: dateFactory().getDateNumber() as DateNumber } as Task)
        const data = await this.taskRepository.save(scope, behvior.format())
        behvior.update(data)
      })
    })

    return result!
  }

  /**
   * タスクの更新
   * @param taskId
   * @param newTask 更新するタスク
   */
  public async updateTask(taskId: string, newTask: Task): Promise<Task> {
    let result: Task

    await this.transaction.run(this.userId, async (scope) => {
      const oldTask: Task | null = await this.taskRepository.getById(scope, taskId)
      if (!oldTask) {
        throw new Error('task does not exist.')
      }
      if (!this.existsList(scope, newTask)) {
        throw new Error('listId is missing.')
      }

      newTask.stateChangeDate = dateFactory().getDateNumber() as DateNumber

      if (oldTask.listId !== newTask.listId && newTask.type === TaskType.TODO) {
        const tasklist = await this.tasklistRepository.getById(scope, newTask.listId)
        const updated = await new TasklistBehavior(tasklist!).actionAsync(async behavior => {
          const newMaxIndex = behavior.get('maxIndex') + 1
          behavior.update({ maxIndex: newMaxIndex })
          await this.tasklistRepository.update(scope, behavior.format())
        })
        newTask.orderIndex = updated.maxIndex
      }

      result = await this.updateTaskAndHabit(scope, oldTask, newTask)
    })

    return result!
  }

  /**
   * ステータスの更新
   * @param taskId
   * @returns
   */
  public async changeState(taskId: string): Promise<Task> {
    let result: Task

    await this.transaction.run(this.userId, async (scope) => {
      const oldTask: Task | null = await this.taskRepository.getById(scope, taskId)
      if (!oldTask) {
        throw new Error('task does not exist.')
      }

      if (!this.existsList(scope, oldTask)) {
        throw new Error('listId is missing.')
      }

      const newTask: Task = { ...oldTask! }

      switch (oldTask.state) {
        case TaskState.Todo:
          newTask.state = TaskState.InProgress
          break
        case TaskState.InProgress:
          newTask.state = TaskState.Done
          break
        case TaskState.Done:
          newTask.state = TaskState.Todo
          break
      }
      newTask.stateChangeDate = dateFactory().getDateNumber() as DateNumber

      result = await this.updateTaskAndHabit(scope, oldTask, newTask)
    })

    return result!
  }

  private async existsList(scope: ITransactionScope, task: Task): Promise<boolean> {
    if (task.type === TaskType.HABIT) {
      const habitlist = await this.habitlistRepository.get(scope)
      const habit = await this.habitRepository.getById(scope, habitlist!.id, task.listId)
      return habit !== null
    } else {
      const tasklist = await this.tasklistRepository.getById(scope, task.listId)
      return tasklist !== null
    }
  }

  /**
   * 習慣とタスクの更新
   * @description 習慣の場合、完了したら集計する
   * @param oldTask 更新前のタスク
   * @param newTask 更新する状態のタスク
   * @returns
   */
  private async updateTaskAndHabit(scope: ITransactionScope, oldTask: Task, newTask: Task): Promise<Task> {
    if (newTask.type === TaskType.HABIT) {
      const habitlist = await this.habitlistRepository.get(scope)
      const habit = await this.habitRepository.getById(scope, habitlist!.id, newTask.listId)
      if (!habit) {
        throw new Error('対象の習慣はすでに削除されています')
      }
      await new HabitBehavior(habit).actionAsync(async behavior => {
        const habitBehavior = behavior as HabitBehavior
        habitBehavior.calcSummaryFromTask(oldTask, newTask)
        // TODO: 更新した値のみ
        await this.habitRepository.update(scope, habitlist!.id, habitBehavior.format())
      })
    }

    return new TaskBehavior(newTask).actionAsync(async behavior => {
      // TODO: 更新した値のみ
      const updated = await this.taskRepository.update(scope, behavior.format())
      behavior.update(updated)
    })
  }

  /**
   * タスクの削除
   * @param taskIds
   */
  public async deleteTasks(taskIds: string[]): Promise<void> {
    await this.transaction.runBatch(this.userId, async (scope) => {
      this.taskRepository.delete(scope, taskIds)
    })
  }

  /**
   * 期限の設定
   * @param targets
   * @returns
   */
  public async updateDeadlines(targets: Array<{ id: string, startdate: Number, enddate: Number }>): Promise<Task[]> {
    const result: Task[] = []

    if (targets.length === 0) return result

    await this.transaction.runBatch(this.userId, async (scope) => {
      // NOTE: プロジェクト単位でのみ一括変更できるので、1つ目の値のみチェック
      const task: Task | null = await this.taskRepository.getById(scope, targets[0].id)
      if (!await this.existsList(scope, task!)) {
        throw new Error('listId is missing.')
      }

      const data = await this.taskRepository.updateAll(scope, targets.map(item => {
        return {
          id: item.id,
          listId: task?.listId, // 画面側処理で利用
          startdate: item.startdate as DateNumber,
          enddate: item.enddate as DateNumber
        }
      }))
      result.push(...data)
    })

    return result
  }

  /**
   * タスク種別、リスト、表示順で並び替え(昇順)
   * @see https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
   */
  private async sort(tasks: Task[]) {
    const FORWORD = -1
    const BACKWORD = 1

    let tasklistOrder: string[]
    await this.transaction.run(this.userId, async (scope) => {
      // TODO: キャッシュから取得
      tasklistOrder = (await this.tasklistRepository.get(scope)).map(t => t.id)
    })

    return tasks.sort((a, b) => {
      if (a.type === TaskType.HABIT && b.type === TaskType.TODO) return FORWORD
      if (a.type === TaskType.TODO && b.type === TaskType.HABIT) return BACKWORD

      const aListIndex = tasklistOrder.findIndex(t => t === a.listId)
      const bListIndex = tasklistOrder.findIndex(t => t === b.listId)
      if (aListIndex < bListIndex) return FORWORD
      if (aListIndex > bListIndex) return BACKWORD

      if (a.orderIndex < b.orderIndex) return FORWORD
      if (a.orderIndex > b.orderIndex) return BACKWORD
      return 0
    })
  }
}