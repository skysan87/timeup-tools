<script setup lang="ts">
const { checkLogin } = useAuth()
const { init: initTasklist } = useTasklistStore()
const { init: initHabit } = useHabitStore()
const { init: initConfig } = useConfigStore()

if (checkLogin()) {
  await Promise.all([
    initHabit(),
    initTasklist(),
    initConfig()
  ])
}
</script>

<template>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtPage />
  </NuxtLayout>
</template>
