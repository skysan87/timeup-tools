<script setup lang="ts">
import TaskDialog from '@/components/Task/Dialog.vue'
import { Task } from '@timeup-tools/core/model'
import { isEmpty } from '@timeup-tools/core/util/StringUtil'
import { dateFactory } from '@timeup-tools/core/util/DateUtil'
import { DateNumber, TaskType } from '@timeup-tools/core/value-object'

type DeadlineType = 'today' | 'tomorrow' | 'later'

const { addTask, currentListId } = useTaskStore()
const { $toast } = useNuxtApp()

const task = ref<Task>({ type: TaskType.TODO, listId: currentListId.value } as Task)
const dialog = ref<InstanceType<typeof TaskDialog>>()
const checkedDeadline = ref<DeadlineType>('later')
const deadlines: Array<{ label: string, value: DeadlineType }> = [
  { label: '今日', value: 'today' },
  { label: '明日', value: 'tomorrow' },
  { label: 'あとで', value: 'later' }
]

const add = async () => {
  if (isEmpty(task.value.title)) return

  try {
    task.value.startdate = task.value.enddate = checkDeadline()
    await addTask(task.value)
  } catch (error) {
    console.error(error)
    $toast.error('失敗しました')
  } finally {
    clearInput()
  }
}

const addDetail = async () => {
  task.value.startdate = task.value.enddate = checkDeadline()
  const result = await dialog.value?.openAsync({ isCreateMode: true, task: task.value })
  if (result?.isSuccess) {
    clearInput()
  }
}

const clearInput = () => {
  task.value.title = ''
}

const checkDeadline = (): DateNumber | null => {
  let deadline: DateNumber | null

  switch (checkedDeadline.value) {
    case 'today':
      deadline = dateFactory().getDateNumber() as DateNumber
      break
    case 'tomorrow':
      deadline = dateFactory().addDay(1).getDateNumber() as DateNumber
      break
    default:
      deadline = null
      break
  }
  return deadline
}
</script>

<template>
  <div class="flex overflow-hidden">
    <div class="w-full">
      <form @submit.prevent="add">
        <input
          v-model="task.title"
          type="text"
          class="input-text appearance-none outline-none"
          placeholder="Add New Task..."
        >
      </form>
      <div class="mt-1 flex flex-row items-center text-white">
        <div class="flex-none block">
          <span class="px-2 font-bold">期限</span>
        </div>
        <div class="flex-1 flex flex-row">
          <label v-for="dl in deadlines" :key="dl.value" class="ml-2 flex items-center">
            <input v-model="checkedDeadline" type="radio" name="deadline" :value="dl.value">
            <span class="ml-2">{{ dl.label }}</span>
          </label>
        </div>
        <div class="flex-none inline-block">
          <button class="btn btn-outline focus:outline-none" @click.left="addDetail">
            詳細
          </button>
          <button class="btn btn-regular focus:outline-none" @click.left="add">
            Add
          </button>
        </div>
      </div>
    </div>
  </div>
  <TaskDialog ref="dialog" />
</template>