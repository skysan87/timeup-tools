import { Task } from "@timeup-tools/core/model"
import { DateNumber, TaskState } from "@timeup-tools/core/value-object"

export type TaskStore = ReturnType<typeof useTaskStore>

export const useTaskStore = () => {
  const { $task } = useNuxtApp()

  const DEFAULT_STATE = [TaskState.Todo, TaskState.InProgress]

  const _tasks = ref<Task[]>([])
  let _listId = ref<string>('')

  const selectedState = ref<TaskState[]>(DEFAULT_STATE)
  const selectedItem = ref<Task | null>(null)
  const editMode = ref<boolean>(false)

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
    const selectecCount = selectedState.value.length
    const selectAll = Object.values(TaskState).length === selectecCount
    const filterd = (selectAll === false) ?
      _tasks.value.filter(task => selectedState.value.includes(task.state)) :
      _tasks.value.concat()
    return getOrderBy(filterd)
  })

  /**
   * リスト、表示順で並び替え(昇順)
   * @see https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
   */
  const getOrderBy = (array: Task[]): Task[] => {
    const FORWORD = -1
    const BACKWORD = 1
    return array.toSorted((a, b) => {
      if (a.listId < b.listId) return FORWORD
      if (a.listId > b.listId) return BACKWORD
      if (a.orderIndex < b.orderIndex) return FORWORD
      if (a.orderIndex > b.orderIndex) return BACKWORD
      return 0
    })
  }

  const getTaskById = (id: string): Task | null => {
    return _tasks.value.find(v => v.id === id) ?? null
  }

  const getTaskCount = (state?: TaskState): number => {
    return (state! == undefined) ?
      _tasks.value.filter(task =>
        Object.values(TaskState).includes(state!) ? task.state === state : true
      ).length :
      _tasks.value.length
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
    console.log('init todaylist')
  }

  const initInProgressList = async () => {
    initTasks('', await $task.getInProgressTasks())
    console.log('init wip')
  }

  const initTasks = (listId: string = '', tasks: Task[]) => {
    _listId.value = listId
    _tasks.value.length = 0
    _tasks.value.push(...tasks)
    checkSelected()
  }

  // TODO: 並び替えロジックを共通化
  const changeOrderTask = async (oldIndex: number, newIndex: number) => {
    const filtered: Task[] = filterdTasks.value
    const src: Task = structuredClone(filtered[oldIndex])
    const dest: Task = structuredClone(filtered[newIndex])

    const sorted = getOrderBy(_tasks.value)
    const actualNewIndex = sorted.findIndex(v => v.id === dest.id)

    let prevOrderIndex, nextOrderIndex
    if (oldIndex > newIndex) {
      // 上へ移動
      // newIndexにあったアイテムは下に移動する
      if (actualNewIndex > 0) {
        prevOrderIndex = sorted[actualNewIndex - 1].orderIndex
      } else {
        prevOrderIndex = 1
      }
      nextOrderIndex = dest.orderIndex
    } else {
      // 下へ移動
      // newIndexにあったアイテムは上に移動する
      prevOrderIndex = dest.orderIndex
      if (filtered.length - 1 > actualNewIndex) {
        nextOrderIndex = sorted[actualNewIndex + 1].orderIndex
      } else {
        nextOrderIndex = Math.ceil(dest.orderIndex) + 1
      }
    }

    // NOTE: 並び替えは前後のorderから算出
    const newOrderIndex = (prevOrderIndex + nextOrderIndex) / 2

    if (newOrderIndex !== dest.orderIndex) {
      src.orderIndex = newOrderIndex
      const updated = await $task.updateTask(src.id, src)
      updateArray(updated)
    }
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

  const changeFilter = (states: TaskState[]) => {
    selectedState.value = [...states]
  }

  const addTask = async (task: Partial<Task>) => {
    const newTask = await $task.addTask(_listId.value, task)
    _tasks.value.push(newTask)
  }

  const updateTask = async (task: Task) => {
    const updated: Task = await $task.updateTask(task.listId, task)
    updateArray(updated)
  }

  const deleteTask = async (taskId: string) => {
    const index = _tasks.value.findIndex(t => t.id === taskId)
    if (index > -1) {
      _tasks.value.splice(index, 1)
      await $task.deleteTasks([taskId])
    }
  }

  const setDeadline = async (targets: Array<{ id: string, startdate: DateNumber, enddate: DateNumber }>) => {
    const updated = await $task.updateDeadlines(targets)
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
    selectedState: readonly(selectedState),
    currentListId: readonly(_listId),
    selectedItem: readonly(selectedItem),
    init,
    initNewList,
    initTodaylist,
    initInProgressList,
    addTask,
    updateTask,
    deleteTask,
    deleteTasks,
    deleteDone,
    changeOrderTask,
    changeState,
    changeFilter,
    setDeadline,
    selectTask,
    switchEdit,
    getTaskById,
    getTaskCount
  }
}