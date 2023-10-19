<script setup lang="ts">
import { useTaskStore } from '~/composables/useTaskStore'
import { useTasklistStore } from '~/composables/useTasklistStore'
import { useViewState } from '~/composables/useViewState'

provide('tasklist', useTasklistStore())
provide('viewstate', useViewState())
provide('task', useTaskStore())
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
