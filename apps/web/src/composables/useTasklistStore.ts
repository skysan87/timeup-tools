import { Tasklist } from "@timeup-tools/core/model"

export type TasklistStore = ReturnType<typeof useTasklistStore>

export const useTasklistStore = () => {
  const { $tasklist, $toast } = useNuxtApp()

  const tasklists = ref<Tasklist[]>([])

  return {
    tasklists: readonly(tasklists),

    init: async () => {
      // 初期化
      tasklists.value = await $tasklist.getList()
      console.log('init TasklistStore', tasklists.value.length)
    },

    getTasklist: (tasklistId: string): Tasklist => {
      const index = tasklists.value.findIndex(v => v.id === tasklistId)
      return structuredClone(tasklists.value[index])
    },

    getTasklistName: (tasklistId: string): string => {
      return tasklists.value.find(v => v.id === tasklistId)?.title ?? ''
    },

    addTasklist: async (data: Partial<Tasklist>) => {
      const newData = await $tasklist.addList(data)
      tasklists.value.push(newData)
    },

    updateTasklist: async (data: Tasklist) => {
      const newData = await $tasklist.updateList(data)
      tasklists.value.push(newData)
      const index = tasklists.value.findIndex(v => v.id === newData.id)
      Object.assign(tasklists.value[index], newData)
    },

    deleteTasklist: async (tasklistId: string) => {
      await $tasklist.deleteList(tasklistId)
      const index = tasklists.value.findIndex(v => v.id === tasklistId)
      tasklists.value.splice(index, 1)
    },

    changeOrderTasklist: async (oldIndex: number, newIndex: number) => {
      // TODO: 並び替え
    }
  }
}