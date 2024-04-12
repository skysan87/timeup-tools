<script setup lang="ts">
import { useMenu } from '@/composables/useMenu'
import { MainPage, HabitPage, HabitPageLabel } from '@/const/page'

const { isSelected } = useMenu()
</script>

<template>
  <div class="mt-5 px-4 flex justify-between items-center">
    <div class="font-bold text-lg">
      習慣
    </div>
  </div>
  <template div v-for="page in HabitPage" :key="page">
    <RouterLink :to="`/${MainPage.Habit}/${page}`" replace>
      <div
        class="py-1 px-5 cursor-pointer hover:bg-blue-700 hover:opacity-75"
        :class="{ 'bg-blue-700': isSelected(MainPage.Habit, page) }"
      >
        # {{ HabitPageLabel[page] }}
      </div>
    </RouterLink>
  </template>
</template>