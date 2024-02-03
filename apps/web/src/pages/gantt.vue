<script setup lang="ts">
import { TaskStore } from '@/composables/useTaskStore'
import { DatePicker } from 'v-calendar'
import ChartGantt from '@/components/Chart/Gantt.vue'

const { filterdTasks, init } = inject('task') as TaskStore
const { tasklists } = inject('tasklist') as TasklistStore
const { $toast } = useNuxtApp()
const gantt = ref<InstanceType<typeof ChartGantt>>()

const onSelectProject = async (e: Event) => {
  const projectId = (e.currentTarget as HTMLSelectElement).value

  if (!projectId) return

  try {
    await init(projectId)
    gantt.value?.initView(filterdTasks.value)
  } catch (error) {
    console.error(error)
    $toast.error('プロジェクトの読み込みに失敗しました')
  }
}

definePageMeta({
  layout: 'board'
})
</script>

<template>
  <div class="relative h-full w-full">
    <ChartGantt ref="gantt">
      <template #header="{ startMonth, changeStartMonth }">
        <div class="h-8 p-2 flex items-center">
          <select class="block border py-1 px-2 bg-gray-200" @change="onSelectProject">
            <option value="">プロジェクトを選択</option>
            <option v-for="list in tasklists" :key="list.id" :value="list.id">
              {{ list.title }}
            </option>
          </select>
          <span class="ml-4">表示開始月:</span>
          <input type="month" class="block border ml-2 py-1 px-2 bg-gray-200" :value="startMonth.format('YYYY-MM')"
            @change="changeStartMonth">
          <!-- <button v-if="tasks.length > 0" class="btn btn-regular ml-auto" @click="saveAll">保存</button> -->
        </div>
      </template>
    </ChartGantt>
  </div>
</template>