<script setup lang="ts">
import { useTaskStore } from '~/composables/useTaskStore'
import { useTasklistStore } from '~/composables/useTasklistStore'
import { useHabitStore } from '~/composables/useHabitStore'
import { useViewState } from '~/composables/useViewState'

provide('tasklist', useTasklistStore())
provide('viewstate', useViewState())
provide('task', useTaskStore())
provide('habit', useHabitStore())
// TODO: Config/init
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
