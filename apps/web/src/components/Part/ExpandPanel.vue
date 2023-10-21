<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  left?: boolean
  right?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  left: false,
  right: false
})

// デフォルトは左ボタン優先
const isLeftVisible = props.left || !props.right
const isRightVisible = !(props.left || !props.right)
const isExpanded = ref<boolean>(false)

const handleSwitch = () => isExpanded.value = !isExpanded.value
</script>

<template>
  <div>
    <div class="flex items-center" @click.left="handleSwitch">
      <fa v-if="isLeftVisible" :icon="['fas', 'caret-down']" :class="{'fa-rotate-180': isExpanded}" class="mr-1" />
      <slot name="title" />
      <fa v-if="isRightVisible" :icon="['fas', 'caret-down']" :class="{'fa-rotate-180': isExpanded}" class="ml-1" />
    </div>
    <div v-show="isExpanded">
      <slot name="component" />
    </div>
  </div>
</template>
