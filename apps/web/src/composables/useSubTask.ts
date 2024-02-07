import { SubTask } from "@timeup-tools/core/model"

export const useSubTask = () => {
  const addButton = ref<HTMLButtonElement>()
  const lists = ref<SubTask[]>([])
  const isNewSubtask = ref(false)

  return {
    subTasks: readonly(lists),
    addButton,
    isNewSubtask,
    doneCount: computed(() => lists.value.filter(t => t.isDone).length),

    init: (value: readonly SubTask[]): void => {
      lists.value = value.map(subtask => {
        return {
          id: subtask.id,
          title: subtask.title,
          isDone: subtask.isDone
        } as SubTask
      })
    },

    addSubTask: (data: SubTask) => {
      data.id = Date.now().toString(16) + Math.floor(Math.random() * 10).toString()
      lists.value.push(data)
      isNewSubtask.value = false

      nextTick(() => addButton.value?.focus())
    },

    updateSubtask: (data: SubTask) => {
      const index = lists.value.findIndex(v => v.id === data.id)
      Object.assign(lists.value[index], data)
    },

    deleteSubtask: (data: SubTask) => {
      const index = lists.value.findIndex(v => v.id === data.id)
      lists.value.splice(index, 1)
    }
  }
}