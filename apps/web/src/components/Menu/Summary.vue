<script setup lang="ts">
import { useMenu } from '@/composables/useMenu'
import { MainPage, TodayPage, TodayPageLabel } from '@/const/page'

const { isSelected } = useMenu()
</script>

<template>
  <div class="mt-5 px-4 flex items-center">
    <div class="font-bold text-lg">
      サマリ
    </div>
  </div>
  <template v-for="page in TodayPage" :key="page">
    <RouterLink :to="`/${MainPage.Today}/${page}`" replace>
      <div
        class="py-1 px-5 cursor-pointer hover:bg-blue-700 hover:opacity-75"
        :class="{ 'bg-blue-700': isSelected(MainPage.Today, page) }"
      >
        # {{ TodayPageLabel[page] }}
      </div>
    </RouterLink>
  </template>

  <RouterLink to="/gantt" replace>
    <div class="py-1 px-5 cursor-pointer hover:bg-blue-700 hover:opacity-75"
      :class="{ 'bg-blue-700': isSelected(MainPage.Gantt, '') }">
      # ガントチャート
    </div>
  </RouterLink>
</template>