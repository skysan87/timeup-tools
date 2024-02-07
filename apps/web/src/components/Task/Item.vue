<script setup lang="ts">
import { Task } from '@timeup-tools/core/model'
import { dateFactory } from '@timeup-tools/core/util/DateUtil'
import { useStateColor } from '~/composables/useStateColor'
import { TaskStore } from '~/composables/useTaskStore'

const { getStateColor } = useStateColor()
const { changeState } = inject('task') as TaskStore

interface Props {
  task: Task
  option?: {
    showPointer: boolean
    showEdit: boolean
  }
  isChecked?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  option: () => ({ showPointer: true, showEdit: true }),
  isChecked: false
})

const task = ref<Task>(props.task)

const emit = defineEmits<{
  edit: [id: string]
  select: [id: string]
  check: [id: string]
}>()

const isExpired = computed(() => {
  if (!task.value.enddate) {
    return false
  } else {
    return task.value.enddate < dateFactory().getDateNumber()
  }
})

const handleEdit = () => {
  emit('edit', task.value.id)
}

const handleSelect = () => {
  emit('select', task.value.id)
}

const handleCheck = () => {
  emit('check', task.value.id)
}
</script>

<template>
  <div class="box flex items-center w-full" @click.stop="handleSelect">
    <fa v-if="props.option.showPointer" :icon="['fas', 'ellipsis-v']" class="move-icon px-1" />
    <div v-show="props.option.showEdit == false" class="px-1" @click.stop="changeState(task.id)">
      <span :style="getStateColor(task.state)" class="circle-button cursor-pointer" />
    </div>
    <div class="no-wrap flex-1 text-left p-1">
      {{ task.title }}
    </div>
    <span v-show="isExpired" class="text-red-500 px-1 font-bold" title="期限切れ">!</span>
    <PartIconButton v-show="props.option.showEdit == false" @click.stop.native="handleEdit">
      <fa title="編集" :icon="['fas', 'edit']" size="xs" />
    </PartIconButton>
    <PartIconButton v-if="props.option.showEdit" @click.stop.native="handleCheck">
      <fa :icon="['fas', 'circle-check']" :class="{ 'text-gray-300': !props.isChecked }" />
    </PartIconButton>
  </div>
</template>

<style scoped>
.move-icon {
  cursor: move;
}

.no-wrap {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.box:active {
  opacity: 0.4;
}
</style>
