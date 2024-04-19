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
  <NuxtPwaManifest/>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>