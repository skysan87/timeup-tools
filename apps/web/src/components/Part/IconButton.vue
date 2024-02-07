<script setup lang="ts">

interface Props {
  bgColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  bgColor: 'bg-gray-200'
})
</script>

<template>
  <div :class="`py-0 px-2 cursor-pointer rounded-full hover:${props.bgColor}`">
    <slot />
  </div>
</template>