<script setup lang="ts">
import { HabitPage, HabitPageLabel } from '@/const/page'
import { HabitStore } from '@/composables/useHabitStore'
import HabitDialog from '@/components/Habit/Dialog.vue'
import { Habit } from '@timeup-tools/core/model'

const { load } = inject('habit') as HabitStore
const dialog = ref<InstanceType<typeof HabitDialog>>()

const route = useRoute()
const filter: HabitPage = route.params.filter.toString() as HabitPage
const habits = ref<Habit[]>(load(filter))

const showNewDialog = async () => {
  await dialog.value?.openAsync({ isCreateMode: true, habit: {} as Habit })
}

const showEditDialg = async (id: string) => {
  await dialog.value?.openAsync({ isCreateMode: false, habit: { id } as Habit })
}

definePageMeta({
  layout: 'board'
})
</script>

<template>
  <div class="flex flex-col bg-white h-full">
    <header class="border-b flex-none">
      <div class="px-6 py-2 flex flex-row">
        <div class="inline-block flex-1 m-auto">
          <span>フィルター：{{ HabitPageLabel[filter] }} ( {{ habits.length }} )</span>
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
      <div v-if="habits.length > 0" class="mx-2 overflow-x-hidden">
        <div class="list-group">
          <HabitItem
            v-for="item in habits"
            :key="item.id"
            :habit="item"
            class="list-group-item list-style"
            @edit="showEditDialg"
          />
        </div>
      </div>
      <NoData v-else />
    </main>
  </div>
  <HabitDialog ref="dialog" />
</template>

<style scoped>
.add-button {
  @apply bg-blue-500 text-white p-2 px-4 shadow-md;
}
.add-button:hover {
  @apply bg-blue-700;
}

.list-style {
  padding: 0.25rem 0.5rem;
  background-color: #faf9f9;
}

.list-group {
  padding: 0;
}

.list-group-item:first-child {
  border-top: 1px solid #979797;
}

.list-group-item {
  border-left: 1px solid #979797;
  border-right: 1px solid #979797;
  border-bottom: 1px solid #979797;
}

/* ドラッグするアイテム */
.sortable-chosen {
  opacity: 0.3;
}

.sortable-ghost {
  background-color: #979797;
}
</style>