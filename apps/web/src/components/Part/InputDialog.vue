<!-- 汎用ダイアログ -->
<script setup lang="ts">
const { dialog, open, cancel, submit } = useDialog()

interface Props {
  title: string
  submitAction: (input: string) => Promise<void>
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  submitAction: () => Promise.resolve()
})

const inputValue = ref<string>('')
const errorMsg = ref<string>('')
const disalbe = ref<boolean>(false)

const _submit = async () => {
  try {
    disalbe.value = true
    errorMsg.value = ''

    if (props.submitAction) {
      await props.submitAction(inputValue.value)
    }

    // close
    submit()
  } catch (err: any) {
    console.error(err)
    errorMsg.value = err.message
  } finally {
    disalbe.value = false
  }
}

const openAsync = (input: string): Promise<{ isSuccess: boolean }> => {
  return open(() => {
    inputValue.value = input ?? ''
  }, (isCancel) => {
    return {
      isSuccess: !isCancel
    }
  })
}

defineExpose({
  openAsync
})
</script>

<template>
  <dialog ref="dialog" @cancel.prevent class="p-0">
    <div class="flex flex-col py-4" style="width: 65vw;" :inert="disalbe">

      <div class="flex-1 pl-4 pr-2">
        <div class="modal-body">
          <label class="input-label">{{ title }}</label>
          <input ref="inputField" v-model="inputValue" class="input-text" type="text">
          <p class="text-red-500 text-xs italic">
            <span>{{ errorMsg }}</span>
          </p>
        </div>
      </div>

      <div class="flex-none flex flex-row mt-2 mx-2">
        <button class="btn btn-regular ml-2" @click="_submit">
          OK
        </button>
        <button class="btn btn-outline ml-2" @click="cancel">
          Cancel
        </button>
      </div>

    </div>
  </dialog>
</template>

<style scoped>
[inert] {
  opacity: 0.3;
}
</style>