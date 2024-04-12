import { Tasklist } from "@timeup-tools/core/model"

export const useTasklistStore = () => {
  const { $tasklist, $toast } = useNuxtApp()

  const tasklists = useState<Tasklist[]>('tasklist', () => [])

  return {
    tasklists: readonly(tasklists),

    init: async () => {
      // 初期化
      tasklists.value = await $tasklist.getList()
      console.log('init TasklistStore', tasklists.value.length)
    },

    create: (data?: Partial<Tasklist>): Tasklist => {
      return $tasklist.create(data)
    },

    getTasklist: (tasklistId: string): Tasklist => {
      const item = tasklists.value.find(v => v.id === tasklistId)
      return item ? { ...item } as Tasklist : $tasklist.create()
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