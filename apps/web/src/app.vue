<script setup lang="ts">
provide('tasklist', useTasklistStore())
provide('viewstate', useViewState())
provide('task', useTaskStore())
provide('habit', useHabitStore())
provide('config', useConfigStore())
</script>

<template>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtPage />
  </NuxtLayout>
</template>
