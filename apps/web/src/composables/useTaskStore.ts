import { Task } from "@timeup-tools/core/model"
import { DateNumber, TaskState, TaskType } from "@timeup-tools/core/value-object"

export const useTaskStore = () => {
  const { $task } = useNuxtApp()

  const DEFAULT_STATE = [TaskState.Todo, TaskState.InProgress]

  const _tasks = useState<Task[]>('task', () => [])
  const _listId = useState<string>('listId', () => '')

  const selectedState = useState<TaskState[]>('selectedState', () => DEFAULT_STATE)
  const selectedItem = useState<Task | null>('selectedItem', () => null)
  const editMode = useState<boolean>('editMode', () => false)

  const switchEdit = () => {
    editMode.value = !editMode.value
  }

  const checkSelected = () => {
    if (!selectedItem.value) {
      return
    }
    if (!_tasks.value.every(v => v.id === selectedItem.value!.id)) {
      selectedItem.value = null
    }
  }

  const filterdTasks = computed(() => {
    return _tasks.value
      .filter(task => selectedState.value.includes(task.state))
  })

  const getTaskById = (id: string): Task => {
    const item = _tasks.value.find(v => v.id === id)
    return item ? { ...item } as Task : $task.create()
  }

  const getTaskCount = (state?: TaskState): number => {
    return (state === undefined)
      ? _tasks.value.length
      : _tasks.value.filter(task => task.state === state).length
  }

  const create = (data?: Partial<Task>): Task => {
    return $task.create(data)
  }

  const init = async (tasklistId: string) => {
    initTasks(tasklistId, await $task.getCurrentTasks(tasklistId))
    console.log('init TaskStore: ', _tasks.value.length)
  }

  const initNewList = (tasklistId: string) => {
    initTasks(tasklistId, [])
  }

  const selectTask = (taskId: string) => {
    const target = _tasks.value.find(v => v.id === taskId) ?? null
    selectedItem.value = target
  }

  const initTodaylist = async () => {
    initTasks('', await $task.getTodaysTasks())
    console.log('init todaylist', _tasks.value.length)
  }

  const initInProgressList = async () => {
    initTasks('', await $task.getInProgressTasks())
    console.log('init wip')
  }

  const initTasks = (listId: string = '', tasks: Task[]) => {
    _listId.value = listId
    _tasks.value.length = 0
    _tasks.value.push(...tasks)
    selectedState.value = DEFAULT_STATE
    checkSelected()
  }

  const deleteDone = async () => {
    const taskIds: string[] = _tasks.value
      .filter(t => t.state === TaskState.Done)
      .map(t => t.id)

    await deleteTasks(taskIds)
  }

  const deleteTasks = async (taskIds: string[]) => {
    await $task.deleteTasks(taskIds)

    const tmp: Task[] = _tasks.value.filter(t => !taskIds.includes(t.id))
    _tasks.value.length = 0
    _tasks.value.push(...tmp)

    checkSelected()
  }

  const addTask = async (task: Partial<Task>) => {
    const newTask = await $task.addTask(_listId.value, task)
    _tasks.value.push(newTask)
  }

  const updateTask = async (task: Task) => {
    const updated: Task = await $task.updateTask(task.id, task)
    updateArray(updated)
  }

  const deleteTask = async (taskId: string) => {
    const index = _tasks.value.findIndex(t => t.id === taskId)
    if (index > -1) {
      _tasks.value.splice(index, 1)
      await $task.deleteTasks([taskId])
    }
  }

  const setDeadline = async (targets: Array<{ id: string, startdate: DateNumber | null, enddate: DateNumber | null }>) => {
    const updated = await $task.updateDeadlines(targets)
    updated.forEach(task => updateArray(task))
  }

  const changeTasklist = async (listId: string, taskIds: Array<string>) => {
    const updated = await $task.updateListId(listId, taskIds)
    updated.forEach(task => updateArray(task))
  }

  const changeState = async (taskId: string) => {
    const task = await $task.changeState(taskId)
    updateArray(task)
  }

  const updateArray = (task: Task): void => {
    const index = _tasks.value.findIndex(v => v.id === task.id)
    // プロジェクトの変更
    if (_listId.value !== '' && _listId.value !== task.listId) {
      _tasks.value.splice(index, 1)
      return
    }
    Object.assign(_tasks.value[index], task)
  }

  return {
    filterdTasks,
    taskSize: _tasks.value.length,
    editMode: readonly(editMode),
    selectedState,
    currentListId: readonly(_listId),
    selectedItem: readonly(selectedItem),
    create,
    init,
    initNewList,
    initTodaylist,
    initInProgressList,
    addTask,
    updateTask,
    deleteTask,
    deleteTasks,
    deleteDone,
    changeState,
    setDeadline,
    changeTasklist,
    selectTask,
    switchEdit,
    getTaskById,
    getTaskCount
  }
}