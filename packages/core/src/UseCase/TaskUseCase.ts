import { dateFactory } from "../Util/DateUtil"
import { IHabitRepository, IHabitlistRepository, ITaskRepository, ITasklistRepository, ITransaction, IUserRepository } from "../Domain/Repository"
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

  public async getCurrentTasks(tasklistId: string): Promise<Task[]> {
    return this.taskRepository.get(this.userId, tasklistId)
  }

  /**
   * 今日のタスクを取得
   * @description
   * - 期限が今日以前の未完了のタスクを取得する
   * - 習慣を取得し、今日が対象日ならタスクに追加する
   */
  public async getTodaysTasks(): Promise<Task[]> {
    const today = dateFactory().getDateNumber() as DateNumber

    // 1. 今日の習慣を取得
    const todaysHabits: Habit[] = await this.habitRepository.getTodayListFromCache()
    // 2. 習慣のToDoをサーバーから取得
    const habitTasks: Task[] = await this.taskRepository.getHabits(this.userId, today)
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

    const [newhabitTasks, todaysTasks, todaysDone] = await Promise.all([
      // 新たに追加された習慣タスク
      missinglist.length > 0 ? this.taskRepository.saveAll(this.userId, missinglist) : Promise.resolve([]),
      // 今日の残タスク
      this.taskRepository.getTodaysTasks(this.userId, today),
      // 今日完了したタスク
      this.taskRepository.getTodaysDone(this.userId, today)
    ])

    tasks.push(...newhabitTasks, ...todaysTasks, ...todaysDone)

    return tasks
  }

  /**
   * 作業中のタスクを取得
   */
  public async getInProgressTasks(): Promise<Task[]> {
    const today = dateFactory().getDateNumber() as DateNumber
    return this.taskRepository.getInProgressTasks(this.userId, today)
  }

  /**
   * タスクの追加
   */
  public async addTask(tasklistId: string, task: Partial<Task>): Promise<Task> {
    if (!this.taskRepository.validateMaxSize()) {
      throw new Error('これ以上登録できません')
    }
    let result: Task

    await this.transaction.run(async () => {
      const tasklist = await this.tasklistRepository.getById(this.userId, tasklistId)
      if (!tasklist) {
        throw new Error('Tasklist does not exist.')
      }

      await new TasklistBehavior(tasklist).actionAsync(async behavior => {
        const newMaxIndex = behavior.get('maxIndex') + 1
        behavior.update({ maxIndex: newMaxIndex })
        this.tasklistRepository.update(this.userId, behavior.format())
      })

      task.listId = tasklistId
      result = await new TaskBehavior(task as Task).actionAsync(async behvior => {
        behvior.update({ stateChangeDate: dateFactory().getDateNumber() as DateNumber } as Task)
        const data = await this.taskRepository.save(this.userId, behvior.format())
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

    await this.transaction.run(async () => {
      const oldTask: Task | null = await this.taskRepository.getById(this.userId, taskId)
      if (!oldTask) {
        throw new Error('task does not exist.')
      }
      newTask.stateChangeDate = dateFactory().getDateNumber() as DateNumber

      result = await this.updateTaskAndHabit(oldTask, newTask)
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

    await this.transaction.run(async () => {
      const oldTask: Task | null = await this.taskRepository.getById(this.userId, taskId)
      if (!oldTask) {
        throw new Error('task does not exist.')
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

      result = await this.updateTaskAndHabit(oldTask, newTask)
    })

    return result!
  }

  /**
   * 習慣とタスクの更新
   * @description 習慣の場合、完了したら集計する
   * @param oldTask 更新前のタスク
   * @param newTask 更新する状態のタスク
   * @returns
   */
  private async updateTaskAndHabit(oldTask: Task, newTask: Task): Promise<Task> {
    if (newTask.type === TaskType.HABIT) {
      const habitlist = await this.habitlistRepository.get(this.userId)
      const habit = await this.habitRepository.getById(this.userId, habitlist!.id, newTask.listId)
      if (!habit) {
        throw new Error('対象の習慣はすでに削除されています')
      }
      await new HabitBehavior(habit).actionAsync(async behavior => {
        const habitBehavior = behavior as HabitBehavior
        habitBehavior.calcSummaryFromTask(oldTask, newTask)
        // TODO: 更新した値のみ
        await this.habitRepository.update(this.userId, habitlist!.id, habitBehavior.format())
      })
    }

    return new TaskBehavior(newTask).actionAsync(async behavior => {
      // TODO: 更新した値のみ
      const updated = await this.taskRepository.update(this.userId, behavior.format())
      behavior.update(updated)
    })
  }

  /**
   * タスクの削除
   * @param taskIds
   */
  public async deleteTasks(taskIds: string[]): Promise<void> {
    await this.transaction.run(async () => {
      this.taskRepository.delete(this.userId, taskIds)
    })
  }

  /**
   * 期限の設定
   * @param targets
   * @returns
   */
  public async updateDeadlines(targets: Array<{ id: string, startdate: Number, enddate: Number }>): Promise<Task[]> {
    const result: Task[] = []

    await this.transaction.run(async () => {
      const data = await this.taskRepository.updateAll(this.userId, targets.map(item => {
        return {
          id: item.id,
          startdate: item.startdate as DateNumber,
          enddate: item.enddate as DateNumber
        }
      }))
      result.push(...data)
    })

    return result
  }
}