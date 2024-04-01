<script setup lang="ts">
import { useMenu } from '@/composables/useMenu'
import { MainPage } from '@/const/page'
import TasklistDialog from '@/components/Tasklist/Dialog.vue'

const { tasklists } = useTasklistStore()
const { isSelected } = useMenu()

const dialog = ref<InstanceType<typeof TasklistDialog>>()

const openListDialog = async () => {
  await dialog.value?.openAsync({ isCreateMode: true })
}
</script>

<template>
  <div class="mt-5 px-4 flex justify-between items-center">
    <div class="font-bold text-lg">
      プロジェクト
    </div>
    <fa :icon="['far', 'plus-square']" class="cursor-pointer" title="プロジェクトを追加する" @click.left="openListDialog" />
  </div>

  <template v-for="tasklist in tasklists" :key="tasklist.id">
    <div
      class="py-1 flex justify-between items-center hover:bg-blue-700 hover:opacity-75"
      :class="{ 'bg-blue-700': isSelected(MainPage.Task, tasklist.id) }"
    >
      <RouterLink :to="`/${MainPage.Task}/${tasklist.id}`" class="px-5 flex-1 cursor-pointer" replace>
        # {{ tasklist.title }}
      </RouterLink>
    </div>
  </template>

  <TasklistDialog ref="dialog" />
</template>