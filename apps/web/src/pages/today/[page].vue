<script setup lang="ts">
import TaskDialog from '@/components/Task/Dialog.vue'
import { Task } from '@timeup-tools/core/model'
import { TodayPage } from '~/const/page'
import { LayoutKey } from '~~/.nuxt/types/layouts'

const { filterdTasks, selectTask, initTodaylist, initInProgressList } = useTaskStore()
const dialog = ref<InstanceType<typeof TaskDialog>>()

const showEditDialog = async (id: string) => {
  await dialog.value?.openAsync({ isCreateMode: false, task: { id } as Task })
}

const route = useRoute()
const page: string = route.params.page.toString()

onMounted(async () => {
  if (page === TodayPage.List) {
    await initTodaylist()
  } else if (page === TodayPage.InProgress) {
    await initInProgressList()
  }
})

definePageMeta({
  layout: computed<LayoutKey>(() => {
    const { isMobile } = useDevice()
    return isMobile ? 'board-mobile' : 'board'
  })
})
</script>

<template>
  <div class="flex flex-col bg-white h-full">
    <header class="border-b flex-none">
      <TaskHeader />
    </header>
    <main class="pt-2 pb-4 flex-1 overflow-y-scroll">
      <div v-if="filterdTasks.length > 0" class="mx-2 overflow-x-hidden">
        <div class="list-group">
          <TaskItem
            v-for="item in filterdTasks"
            :key="item.id"
            :task="item"
            :option="{ showPointer: false, showEdit: false }"
            class="list-group-item list-style"
            @edit="showEditDialog(item.id)"
            @select="selectTask"
          />
        </div>
      </div>
      <NoData v-else />
    </main>
    <TaskDialog ref="dialog" />
  </div>
</template>