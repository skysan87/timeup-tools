<script setup lang="ts">
import { TaskStore } from '@/composables/useTaskStore'
import GanttChart from '@/components/Gantt/Chart.vue'

const { filterdTasks, init, setDeadline } = inject('task') as TaskStore
const { tasklists } = inject('tasklist') as TasklistStore
const { $toast } = useNuxtApp()
const gantt = ref<InstanceType<typeof GanttChart>>()

const projectId = ref<string>('')

const onSelectProject = async (e: Event) => {
  projectId.value = (e.currentTarget as HTMLSelectElement).value ?? ''

  if (!projectId.value) {
    gantt.value?.initView([])
    return
  }

  try {
    await init(projectId.value)
    gantt.value?.initView(filterdTasks.value)
  } catch (error) {
    console.error(error)
    $toast.error('プロジェクトの読み込みに失敗しました')
  }
}

const saveAll = async () => {
  try {
    if (!confirm('期限を変更しますか？')) {
      return
    }

    const data = gantt.value?.getChangedData()

    if (data!.length === 0) {
      return
    }

    await setDeadline(data!.map(item => {
      return {
        id: item.id,
        startdate: item.startDate,
        enddate: item.endDate
      }
    }))
    gantt.value?.initView(filterdTasks.value)
    $toast.show('変更しました')
  } catch (error) {
    console.error(error)
    $toast.error('変更に失敗しました')
  }
}

definePageMeta({
  layout: 'board'
})
</script>

<template>
  <div class="relative h-full w-full">
    <GanttChart ref="gantt">
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
          <button v-if="projectId !== ''" class="btn btn-regular ml-auto" @click="saveAll">保存</button>
        </div>
      </template>
    </GanttChart>
  </div>
</template>