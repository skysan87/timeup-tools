<script setup lang="ts">
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
</script>

<template>
  <details>
    <summary>
      <div class="flex items-center">
        <fa v-if="isLeftVisible" :icon="['fas', 'caret-down']" class="mr-1 rotate" />
        <slot name="title" />
        <fa v-if="isRightVisible" :icon="['fas', 'caret-down']" class="ml-1 rotate" />
      </div>
    </summary>
    <slot name="component" />
  </details>
</template>

<style scoped>
details[open] summary .rotate {
  transform: rotate(180deg);
}

/* デフォルトの矢印を非表示 */
summary {
  display: block;
  list-style: none;
}

/* デフォルトの矢印を非表示 safari */
summary::-webkit-details-marker {
  display: none;
}

</style>