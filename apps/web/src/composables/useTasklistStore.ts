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
    }
    // addTasklist
    // updateTasklist
    // deleteTasklist
    // changeOrderTasklist
  }
}