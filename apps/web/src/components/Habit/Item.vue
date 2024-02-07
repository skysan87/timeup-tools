<script setup lang="ts">
import { Habit } from '@timeup-tools/core/model'

interface Props {
  habit: Habit
}

const props = defineProps<Props>()

const emit = defineEmits<{
  edit: [id: string]
}>()

const handleEdit = () => {
  emit('edit', props.habit.id)
}
</script>

<template>
  <div>
    <div class="flex items-center w-full">
      <div :title="props.habit.title" class="flex-1 no-wrap text-left p-1">
        {{ props.habit.title }}
      </div>
      <PartIconButton @click.stop.native="handleEdit">
        <fa :icon="['fas', 'edit']" size="xs" />
      </PartIconButton>
    </div>
  </div>
</template>

<style scoped>
.no-wrap {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>