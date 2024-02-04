<script setup lang="ts">
import { useDialog } from '@/composables/useDialog'
import { useSubTask } from '@/composables/useSubTask'
import { Task } from '@timeup-tools/core/model'
import { dateFactory } from '@timeup-tools/core/util/DateUtil';
import { DateNumber, DateRange, TaskState, TaskStateLabel, TaskType } from '@timeup-tools/core/value-object'
import { DatePicker } from 'v-calendar'
import { ValidateError } from '@timeup-tools/core/error'

const { $toast } = useNuxtApp()
const { dialog, open, cancel, submit } = useDialog()
const { subTasks, isNewSubtask, doneCount, addButton, init, addSubTask, updateSubtask, deleteSubtask } = useSubTask()
const { tasklists } = inject('tasklist') as TasklistStore
const { getTaskById, addTask, deleteTask, updateTask, currentListId } = inject('task') as TaskStore

type Input = {
  isCreateMode: boolean
  task: Partial<Task>
}

const isCreateMode = ref(false)

const task = ref<Task>({} as Task)
const range = ref<DateRange>({ start: null, end: null })
const options = Object.values(TaskState)
const errorMsg = ref<string>('')
const forbid = reactive({
  title: false,
  detail: false,
  range: false,
  delete: false,
  addButton: false
})
const footerMsg = ref<string>('')
const calenderAttributes = ref([{
  key: 'today',
  dot: 'blue',
  dates: [new Date()]
}])
const closeButton = ref<HTMLButtonElement>()

const createdDateString = computed(() => {
  const value = task.value.createdAt
  if (!value) return ''
  return dateFactory(value).format('YYYY/MM/DD')
})

const openAsync = (input: Input): Promise<{ isSuccess: boolean }> => {
  return open(() => {
    _init(input)
  }, (isCancel) => {
    return {
      isSuccess: !isCancel
    }
  })
}

const _init = (input: Input) => {
  isCreateMode.value = input.isCreateMode
  if (input.isCreateMode) {
    task.value = { ...input.task, listId: currentListId.value } as Task
  } else {
    task.value = getTaskById(input.task.id!) ?? {} as Task
  }

  init(task.value.subTasks ?? [])

  range.value = {
    start: !task.value.startdate ? null : dateFactory(task.value.startdate.toString()).toDate(),
    end: !task.value.enddate ? null : dateFactory(task.value.enddate.toString()).toDate()
  }

  // 編集の禁止
  if (task.value.type === TaskType.HABIT) {
    forbid.title = true
    forbid.detail = true
    forbid.range = true
    forbid.delete = true
    forbid.addButton = true
    footerMsg.value = '習慣から生成されたタスクはステータスの変更のみ可能です。'
  }

  closeButton.value?.focus()
}

const _submit = async (isUpdate: boolean) => {
  try {
    // reset
    errorMsg.value = ''
    // set fileds
    task.value.subTasks = subTasks.value.concat()
    task.value.startdate = range.value?.start ? dateFactory(range.value.start).getDateNumber() as DateNumber : null
    task.value.enddate = range.value?.end ? dateFactory(range.value.end).getDateNumber() as DateNumber : null
    // data access
    if (isUpdate) {
      await updateTask(task.value)
    } else {
      await addTask(task.value)
    }
    // close
    submit()
  } catch (error: any) {
    if (error instanceof ValidateError) {
      const err = error as ValidateError<Task>
      errorMsg.value = err.get('title')
    } else {
      console.error(error)
      $toast.error(error.message)
    }
  }
}

const _delete = async () => {
  try {
    if (!confirm('削除しますか？')) {
      return
    }
    await deleteTask(task.value.id)
    submit()
  } catch (error: any) {
    console.error(error)
    $toast.error(error.message)
  }
}

const initRange = () => {
  range.value = { start: null, end: null }
}

const setTodayInRange = () => {
  const today = dateFactory()
  range.value = { start: today.toDate(), end: today.toDate() }
}

defineExpose({
  openAsync
})
</script>

<template>
  <dialog ref="dialog" @cancel.prevent class="p-0">
    <div class="flex flex-col py-4" style="height: 83vh; min-width: 50vw;">
      <div class="flex-1 overflow-y-auto pl-4 pr-2">

        <div class="modal-body">
          <label class="input-label">ステータス</label>
          <div class="flex justify-evenly">
            <label v-for="viewOp in options" :key="viewOp" class="flex items-center">
              <input v-model="task.state" type="radio" :value="viewOp">
              <span class="ml-2">{{ TaskStateLabel[viewOp] }}</span>
            </label>
          </div>
        </div>

        <div v-if="task.type === TaskType.TODO" class="modal-body">
          <label class="input-label">プロジェクト</label>
          <select v-model="task.listId" class="input-text">
            <option v-for="list in tasklists" :key="list.id" :value="list.id">
              {{ list.title }}
            </option>
          </select>
        </div>
        <div v-else>
          <span class="output-text text-xs text-gray-600">このタスクは習慣から生成されました。</span>
        </div>

        <div class="modal-body">
          <label class="input-label">タイトル</label>
          <input ref="title" v-model="task.title" class="input-text"
            :class="{ 'border border-red-500': errorMsg !== '', 'btn-disabled': forbid.title }" type="text"
            :disabled="forbid.title">
          <p v-show="(errorMsg !== '')" class="text-red-500 text-xs italic">
            {{ errorMsg }}
          </p>
        </div>
        <div class="modal-body">
          <label class="input-label">説明</label>
          <textarea v-model="task.detail" class="input-textarea resize-none" maxlength="1000" rows="6"
            :class="{ 'btn-disabled': forbid.detail }" :disabled="forbid.detail" />
        </div>
        <div class="modal-body">
          <label class="input-label">期間</label>
          <div class="flex">
            <!-- @vue-ignore -->
            <DatePicker v-model.range="range" class="flex-1" :attributes="calenderAttributes"
              :disabled="forbid.range">
              <template #default="{ inputValue, togglePopover }">
                <div class="flex justify-center items-center">
                  <div class="flex items-center">
                    <button
                      class="py-1 px-2 bg-blue-100 border border-blue-200 hover:bg-blue-200 text-blue-600 focus:bg-blue-500 focus:text-white focus:border-blue-500 focus:outline-none"
                      :disabled="forbid.range" :class="{ 'btn-disabled': forbid.range }" @click="togglePopover()">
                      <fa :icon="['fas', 'calendar-day']" ontouchend="" />
                    </button>
                  </div>
                  <input :value="inputValue.start" class="input-text" readonly>
                  <svg class="w-10 h-8 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <input :value="inputValue.end" class="input-text" readonly>
                </div>
              </template>
            </DatePicker>
            <button type="button" class="btn btn-outline flex-none" tabindex="-1" :disabled="forbid.range"
              :class="{ 'btn-disabled': forbid.range }" @click="initRange">
              Clear
            </button>
          </div>
        </div>

        <div class="modal-body">
          <label class="input-label">チェックリスト ({{ doneCount }}/{{ subTasks.length }})</label>
          <SubTaskItem v-for="subtask in subTasks" :key="subtask.id"
            :inputdata="subtask"
            @update="updateSubtask"
            @delete="deleteSubtask" />
          <!-- アイテム追加ボタン -->
          <button v-if="!isNewSubtask" ref="addButton" :disabled="forbid.addButton" class="btn btn-regular"
            :class="{ 'btn-disabled': forbid.addButton }" @click.stop="isNewSubtask = true">
            追加
          </button>
          <SubTaskItem v-if="isNewSubtask" :is-create-mode="true" @cancel="isNewSubtask = false" @add="addSubTask" />
        </div>

        <div v-if="!isCreateMode" class="modal-body">
          <label class="input-label">詳細情報</label>
          <div class="flex flex-wrap">
            <div class="px-1 m-1 border">
              <span class="text-xs">登録日:</span>
              <span class="text-xs ml-1">{{ createdDateString }}</span>
            </div>
            <div class="px-1 m-1 border">
              <span class="text-xs">更新日:</span>
              <span class="text-xs ml-1">{{ createdDateString }}</span>
            </div>
          </div>
        </div>

        <div v-if="task.type === TaskType.TODO" class="modal-body">
          <label class="input-label">アクション</label>
          <div class="flex flex-wrap">
            <button class="block px-1 m-1 btn btn-outline" @click="setTodayInRange">
              今日の予定に設定
            </button>
          </div>
        </div>
      </div>

      <div class="flex-none border-t my-1" />

      <div class="flex-none flex flex-row mt-2 mx-2">
        <button v-if="isCreateMode" class="btn btn-regular ml-2" @click="_submit(false)">
          Add
        </button>
        <button v-if="!isCreateMode" class="btn btn-regular ml-2" @click="_submit(true)">
          Save
        </button>
        <button ref="closeButton" class="btn btn-outline ml-2" @click="cancel">
          Close
        </button>
        <button v-if="!isCreateMode" class="btn btn-red-outline ml-2" :disabled="forbid.delete"
          :class="{ 'btn-disabled': forbid.delete }" @click="_delete">
          Delete
        </button>
        <span class="text-xs text-gray-600 flex-1">{{ footerMsg }}</span>
      </div>
    </div>
  </dialog>
</template>