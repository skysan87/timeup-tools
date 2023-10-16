<script setup lang="ts">
import { useTaskStore } from '@/composables/useTaskStore'

provide('task', useTaskStore())
</script>

<template>
  <TaskToday />
</template>