<script setup lang="ts">
import { SubTask } from '@timeup-tools/core/model'
import { onMounted, onUnmounted } from 'vue';

interface Props {
  inputdata?: SubTask
  isCreateMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isCreateMode: false
})

const subTask = ref<SubTask>({ id: '', isDone: false, title: '' } as SubTask)
if (props.inputdata) {
  subTask.value = { ...props.inputdata } as SubTask
}
const editMode = ref<boolean>(props.isCreateMode)
const inputtext = ref<HTMLInputElement>()

let focusTimerId: any = null

const emit = defineEmits<{
  add: [id: SubTask]
  update: [id: SubTask]
  cancel: []
  delete: [id: SubTask]
}>()

const onEditMode = () => {
  editMode.value = true
  nextTick(() => inputtext.value?.focus())
}

const cancel = () => {
  editMode.value = false
  subTask.value = props.inputdata!
  emit('cancel')
}

const updateState = () => {
  subTask.value.isDone = !subTask.value.isDone
  emit('update', subTask.value)
}

const update = () => {
  editMode.value = false
  if (props.isCreateMode) {
    emit('add', subTask.value)
  } else {
    emit('update', subTask.value)
  }
}

const deleteData = () => {
  emit('delete', subTask.value)
}

const handleFocusout = () => {
  if (!editMode.value) return
  // コンポーネントからフォーカスアウト時にキャンセル
  // NOTE: focusout/focusinのバブリングを利用
  focusTimerId = setTimeout(cancel, 100)
}

const handleFocusin = () => {
  if (!editMode.value) return
  clearTimeout(focusTimerId)
}

onMounted(() => {
  nextTick(() => {
    if (props.isCreateMode) {
      inputtext.value?.focus()
    }
  })
})

onUnmounted(() => {
  clearTimeout(focusTimerId)
})
</script>

<template>
    <div class="mb-1 hover:bg-gray-200" @focusout="handleFocusout" @focusin="handleFocusin">
    <div v-if="!editMode" class="flex items-center">
      <div class="flex-1">
        <label class="flex items-center">
          <input type="checkbox" class="pl-1 flex-none" :checked="subTask.isDone" @change="updateState">
          <span class="break-all flex-1 text-left px-1">{{ subTask.title }}</span>
        </label>
      </div>
      <div class="px-1" @click.left.stop="onEditMode">
        <fa :icon="['fas', 'edit']" size="xs" class="cursor-pointer" />
      </div>
      <div class="todo-x-pointer px-1" @click.left.stop="deleteData">
        <span class="cursor-pointer">×</span>
      </div>
    </div>

    <div v-if="editMode" class="flex items-center">
      <input type="checkbox" class="px-1" :checked="subTask.isDone" disabled>
      <div class="w-full px-1">
        <form @submit.prevent="update">
          <input
            ref="inputtext"
            v-model="subTask.title"
            type="text"
            class="input-text flex-1 apperance-none outline-none"
            placeholder="Add New Sub-Task..."
          >
        </form>
      </div>
      <div class="px-1">
        <button class="text-blue-500" @click.left.stop="update">◯</button>
      </div>
      <div class="px-1">
        <button class="text-pink-500" @click.left.stop="cancel">×</button>
      </div>
    </div>
  </div>
</template>