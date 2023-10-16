<script setup lang="ts">
import { useTasklistStore } from '~/composables/useTasklistStore'
import { useViewState } from '~/composables/useViewState'

provide('tasklist', useTasklistStore())
provide('viewstate', useViewState())
// TODO: Habit/init
// TODO: Config/init
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
