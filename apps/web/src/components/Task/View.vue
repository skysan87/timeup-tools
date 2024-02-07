<script setup lang="ts">
import { dateFactory } from '@timeup-tools/core/util/DateUtil'
import { DateNumber, TaskState, TaskStateLabel, TaskType } from '@timeup-tools/core/value-object'

const { selectedItem: task, selectTask } = inject('task') as TaskStore
const { getTasklistName } = inject('tasklist') as TasklistStore
const options = Object.values(TaskState)

const dtFormat = (value: DateNumber | null) => {
  if (!value) return ''
  return dateFactory(value).format('YYYY/MM/DD')
}

const hasDeadline = computed(() => {
  const { startdate, enddate } = task.value!
  return startdate !== null && enddate !== null
})
</script>

<template>
  <div>
    <button class="btn-sm btn-outline" @click="selectTask('')">閉じる</button>
  </div>

  <div v-if="task !== null" class="p-2 select-text">

    <div class="mt-4">
      <label class="input-label">ステータス</label>
      <div class="flex justify-evenly flex-wrap">
        <label v-for="viewOp in options" :key="viewOp" class="flex items-center">
          <input v-model="task.state" type="radio" :value="viewOp" disabled>
          <span class="ml-2">{{ TaskStateLabel[viewOp] }}</span>
        </label>
      </div>
    </div>

    <div v-if="task.type === TaskType.TODO" class="mt-4">
      <label class="input-label">プロジェクト</label>
      <div>
        <span class="input-text">{{ getTasklistName(task.listId) }}</span>
      </div>
    </div>

    <div class="mt-4">
      <label class="input-label">タイトル</label>
      <div>
        <span class="input-text break-all">{{ task.title }}</span>
      </div>
    </div>

    <PartExpandPanel class="mt-4" right>
      <template #title>
        <label class="input-label">説明</label>
      </template>
      <template #component>
        <span class="input-text whitespace-pre-wrap break-all">{{ task.detail }}</span>
      </template>
    </PartExpandPanel>

    <div v-if="hasDeadline" class="mt-4">
      <label class="input-label">期限</label>
      <div class="flex flex-wrap justify-between items-center border py-1 px-2 bg-gray-200">
        <span class="block">{{ dtFormat(task!.startdate) }}</span>
        <svg
          class="w-10 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
        <span class="block">{{ dtFormat(task!.enddate) }}</span>
      </div>
    </div>

    <div class="mt-4">
      <label class="input-label">チェックリスト ({{ task.subTasks.length }})</label>
      <div
        v-for="subtask in task.subTasks"
        :key="subtask.id"
        class="flex items-center"
      >
        <label class="flex items-center">
          <input
            disabled
            :checked="subtask.isDone"
            type="checkbox"
            class="pl-1 flex-none"
          >
          <span class="break-all text-left px-1 flex-1">{{ subtask.title }}</span>
        </label>
      </div>
    </div>
  </div>
</template>