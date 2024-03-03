<script setup lang="ts">
provide('tasklist', useTasklistStore())
provide('viewstate', useViewState())
provide('task', useTaskStore())
provide('habit', useHabitStore())
provide('config', useConfigStore())
const { init: initAuth } = useAuth()

// アプリケーション実行時に1回だけ実行したい非同期処理
// TIPS: middlewareの処理が先行(auth.global.ts)
// TODO: 処理中画面が真っ白
await initAuth()
</script>

<template>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtPage />
  </NuxtLayout>
</template>
