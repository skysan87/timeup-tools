import { Habit, SubTask, Task, Tasklist } from '@timeup-tools/core/model'
import { TaskState, TaskType } from '@timeup-tools/core/value-object'
import { HabitUseCase, TaskUseCase, TasklistUseCase } from '@timeup-tools/core/usecase'
import {
  InMemoryUserRepository
  , InMemoryTaskRepository
  , InMemoryTasklistRepository
  , InMemoryHabitRepository
  , InMemoryTransaction
  , InMemoryHabitlistRepository
} from '@timeup-tools/inmemory-infra/repository'
import { dateFactory } from '@timeup-tools/core/util/DateUtil'

let usecase: TaskUseCase
let habitUseCase: HabitUseCase
let listId: string

const userRepositpry = new InMemoryUserRepository()

beforeEach(async () => {
  await userRepositpry.login()

  const habitlistRepo = new InMemoryHabitlistRepository()
  const habitRepo = new InMemoryHabitRepository()
  const taskRepo = new InMemoryTaskRepository()
  const tasklistRepo = new InMemoryTasklistRepository()
  const trunsaction = new InMemoryTransaction()

  usecase = new TaskUseCase(
    userRepositpry,
    taskRepo,
    tasklistRepo,
    habitlistRepo,
    habitRepo,
    trunsaction
  )

  habitUseCase = new HabitUseCase(
    userRepositpry,
    habitlistRepo,
    habitRepo,
    trunsaction
  )

  await habitUseCase.init()

  const tasklistUseCase = new TasklistUseCase(userRepositpry, tasklistRepo, trunsaction)
  const tasklist = await tasklistUseCase.addList({ title: 'list_title' } as Tasklist)
  listId = tasklist.id
})

describe('基本動作', () => {
  test('1件登録されること', async () => {
    await usecase.addTask(listId, {
      title: 'タスク1',
      listId
    } as Task)

    const result = await usecase.getCurrentTasks(listId)

    expect(result.length).toBe(1)
  })

  test('タスクが更新されること', async () => {
    const subTasks: SubTask[] = [
      { id: '1', isDone: false, title: 'subtask1' } as SubTask,
      { id: '2', isDone: false, title: 'subtask2' } as SubTask
    ]

    const task = await usecase.addTask(listId, {
      title: 'タスク1',
      listId,
      subTasks: subTasks
    } as Task)

    task.title = 'タスク名更新'
    const result = await usecase.updateTask(task.id, task)

    expect(result.title).toBe('タスク名更新')
  })

  test('ステータス更新:1回で「作業中」になること', async () => {
    const task = await usecase.addTask(listId, {
      title: 'タスク1',
      listId
    } as Task)

    const result: Task = await usecase.changeState(task.id)

    expect(result.state).toBe(TaskState.InProgress)
  })

  test('ステータス更新:2回で「完了」になること', async () => {
    const task = await usecase.addTask(listId, {
      title: 'タスク1',
      listId
    } as Task)

    await usecase.changeState(task.id)
    const result: Task = await usecase.changeState(task.id)

    expect(result.state).toBe(TaskState.Done)
  })

  test('ステータス更新:3回で「未実施」になること', async () => {
    const task = await usecase.addTask(listId, {
      title: 'タスク1',
      listId
    } as Task)

    await usecase.changeState(task.id)
    await usecase.changeState(task.id)
    const result: Task = await usecase.changeState(task.id)

    expect(result.state).toBe(TaskState.Todo)
  })

  test('タスクが削除される', async () => {
    const task = await usecase.addTask(listId, {
      title: 'タスク1',
      listId
    } as Task)

    const task2 = await usecase.addTask(listId, {
      title: 'タスク2',
      listId
    } as Task)

    await usecase.deleteTasks([task.id])

    const result: Task[] = await usecase.getCurrentTasks(listId)
    expect(result.length).toBe(1)
    expect(result[0].id).toBe(task2.id)
  })

  test('習慣タスクを登録して、今日のタスクに登録される', async () => {
    const habit: Habit = await habitUseCase.addHabit({
      title: '毎日のタスク',
      frequency: 'daily'
    } as Habit)

    await habitUseCase.init()
    const tasks: Task[] = await usecase.getTodaysTasks()

    expect(tasks.length).toBe(1)
    expect(tasks[0].state).toBe(TaskState.Todo)
    expect(tasks[0].type).toBe(TaskType.HABIT)
    expect(tasks[0].listId).toBe(habit.id)
  })

  test('明日期限開始のタスクが表示されない', async () => {
    const tomorrow = dateFactory().addDay(1).getDateNumber()
    await usecase.addTask(listId, {
      title: 'タスク1',
      state: TaskState.Todo,
      startdate: tomorrow,
      enddate: tomorrow,
      listId
    } as Task)

    const tasks: Task[] = await usecase.getTodaysTasks()

    expect(tasks.length).toBe(0)
  })
})