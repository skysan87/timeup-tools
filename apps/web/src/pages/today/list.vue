<script setup lang="ts">
import TaskDialog from '@/components/Task/Dialog.vue'
import { Task } from '@timeup-tools/core/model'

const { filterdTasks, selectTask, initTodaylist } = inject('task') as TaskStore
const dialog = ref<InstanceType<typeof TaskDialog>>()

const showEditDialog = async (id: string) => {
  await dialog.value?.openAsync({ isCreateMode: false, task: { id } as Task })
}

onMounted(async () => {
  await initTodaylist()
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

<style scoped>
.list-style {
  padding: 0.25rem 0.5rem;
  background-color: #faf9f9;
}

.list-group {
  padding: 0;
}

.list-group-item:first-child {
  border-top: 1px solid #979797;
}

.list-group-item {
  border-left: 1px solid #979797;
  border-right: 1px solid #979797;
  border-bottom: 1px solid #979797;
}

/* ステータスラベル */
.status-label {
  margin: 0 5px;
}
</style>