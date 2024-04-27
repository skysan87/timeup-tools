<script setup lang="ts">
const { tasklists } = useTasklistStore()
const { currentListId } = useTaskStore()

const { dialog, open, cancel, submit } = useDialog()
const selectedListId = ref<string | null>(null)

const emit = defineEmits<{
  select: [id: string]
}>()

const showDialog = () => {
  open(() => {
    selectedListId.value = null
  })
}

const change = async () => {
  if (!selectedListId.value) return
  if (currentListId.value === selectedListId.value) return
  submit()
  emit('select', selectedListId.value)
}
</script>

<template>
  <button class="btn-sm btn-outline mx-0.5" @click="showDialog">
    プロジェクト移動
  </button>
  <dialog ref="dialog" @cancel.prevent class="p-0">
    <div class="flex flex-col py-4" style="max-height: 83vh; min-width: 50vw;">
      <div class="flex-1 overflow-y-auto pl-4 pr-2">
        <div class="modal-body">
          <label v-for="tasklist in tasklists" :key="tasklist.id" :value="tasklist.id" class="flex items-center">
            <input v-model="selectedListId" type="radio" :value="tasklist.id" :disabled="tasklist.id === currentListId">
            <span class="ml-2">{{ tasklist.title }}</span>
          </label>
        </div>
      </div>

      <div class="flex-none border-t my-1" />

      <div class="flex-none flex flex-row mt-2 mx-2">
        <button class="btn btn-regular ml-2" @click="change">
          Save
        </button>
        <button class="btn btn-red-outline ml-2" @click="cancel">
          Close
        </button>
      </div>
    </div>

  </dialog>
</template>