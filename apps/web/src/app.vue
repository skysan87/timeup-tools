<script setup lang="ts">
provide('tasklist', useTasklistStore())
provide('viewstate', useViewState())
provide('task', useTaskStore())
provide('habit', useHabitStore())
provide('config', useConfigStore())
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
