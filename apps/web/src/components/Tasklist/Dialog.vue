<script setup lang="ts">
import { Tasklist } from '@timeup-tools/core/model'
import { useDialog } from '@/composables/useDialog'

const { dialog, open, cancel, submit } = useDialog()
const { getTasklist, addTasklist, updateTasklist, deleteTasklist } = inject('tasklist') as TasklistStore

const _isCreateMode = ref<boolean>(false)
const tasklist = ref<Tasklist>({} as Tasklist)
const errorMsg = ref<string>('')

type Input = {
  /** 削除ボタンを非表示 */
  isCreateMode: boolean
  tasklistId?: string
}

const openAsync = (input: Input): Promise<{ isSuccess: boolean }> => {
  return open(() => {
    _isCreateMode.value = input.isCreateMode
    if (input.tasklistId) {
      tasklist.value = getTasklist(input.tasklistId!)
    }
  }, (isCancel) => {
    return {
      isSuccess: !isCancel
    }
  })
}

const _submit = async () => {
  errorMsg.value = ''
  try {
    if (null === (tasklist.value.id ?? null)) {
      await addTasklist(tasklist.value)
    } else {
      await updateTasklist(tasklist.value)
    }
    submit()
  } catch (error: any) {
    errorMsg.value = error.message
  }
}

const _delete = async () => {
  await deleteTasklist(tasklist.value.id)
  submit()
}

defineExpose({
  openAsync
})
</script>

<template>
  <dialog ref="dialog" @cancel.prevent class="p-0">
    <div class="flex flex-col py-4" style="height: 83vh;">
      <div class="flex-1 overflow-y-auto pl-4 pr-2">
        <div class="mx-2 mb-6">
          <label class="input-label">プロジェクト名</label>
          <input ref="inputField" v-model="tasklist.title" class="input-text"
            :class="{ 'border border-red-500': errorMsg !== '' }" type="text" placeholder="Add New List Title...">
          <p v-show="(errorMsg !== '')" class="text-red-500 text-xs italic">
            {{ errorMsg }}
          </p>
        </div>

        <div class="mx-2 mb-6">
          <label class="input-label">説明</label>
          <textarea v-model="tasklist.detail" class="input-textarea resize-none" maxlength="2000" rows="6" />
        </div>
      </div>

      <div class="flex-none border-t my-1" />

      <div class="flex-none flex flex-row mt-2 mx-2">
        <button class="btn btn-regular mx-1" @click="_submit">
          OK
        </button>
        <button class="btn btn-outline mx-1" @click="cancel">
          Cancel
        </button>
        <button v-if="!_isCreateMode" class="btn btn-red-outline mx-1" @click="_delete">
          Delete
        </button>
      </div>

    </div>
  </dialog>
</template>