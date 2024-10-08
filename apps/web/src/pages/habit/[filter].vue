<script setup lang="ts">
import { HabitPage, HabitPageLabel } from '@/const/page'
import HabitDialog from '@/components/Habit/Dialog.vue'
import { Habit } from '@timeup-tools/core/model'
import { LayoutKey } from '~~/.nuxt/types/layouts'

const { currentHabits, currentFilter, initFromCache } = useHabitStore()
const dialog = ref<InstanceType<typeof HabitDialog>>()

const route = useRoute()
const filter: HabitPage = route.params.filter.toString() as HabitPage

const showNewDialog = async () => {
  await dialog.value?.openAsync({ isCreateMode: true, habit: {} as Habit })
}

const showEditDialg = async (id: string) => {
  await dialog.value?.openAsync({ isCreateMode: false, habit: { id } as Habit })
}

onMounted(async () => {
  currentFilter.value = filter
  await initFromCache()
})

definePageMeta({
  layout: computed<LayoutKey>(() => {
    const { isMobile } = useDevice()
    return isMobile ? 'board-mobile' : 'board'
  })
})
</script>

<template>
  <div class="flex flex-col bg-white h-full">
    <header class="border-b flex-none">
      <div class="px-6 py-2 flex flex-row">
        <div class="inline-block flex-1 m-auto">
          <span>フィルター：{{ HabitPageLabel[filter] }} ( {{ currentHabits.length }} )</span>
        </div>
        <button
          type="button"
          class="flex-none add-button focus:outline-none"
          @click="showNewDialog"
        >
          <fa :icon="['fas', 'plus']" size="lg" />
        </button>
      </div>
    </header>
    <main class="pt-2 pb-4 flex-1 overflow-y-scroll">
      <div v-if="currentHabits.length > 0" class="mx-2 overflow-x-hidden">
        <div class="list-group">
          <HabitItem
            v-for="item in currentHabits"
            :key="item.id"
            :habit="item"
            class="list-group-item list-style"
            @edit="showEditDialg"
          />
        </div>
      </div>
      <NoData v-else />
    </main>
    <HabitDialog ref="dialog" />
  </div>
</template>

<style scoped>
.add-button {
  @apply bg-blue-500 text-white p-2 px-4 shadow-md;
}
.add-button:hover {
  @apply bg-blue-700;
}
</style>