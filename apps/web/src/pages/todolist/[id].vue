<script setup lang="ts">
import TaskDialog from '@/components/Task/Dialog.vue'
import { Task } from '@timeup-tools/core/model'
import { dateFactory } from '@timeup-tools/core/util/DateUtil'
import { DateNumber, DateRange } from '@timeup-tools/core/value-object'
import { DatePicker } from 'v-calendar'
import { LayoutKey } from '~~/.nuxt/types/layouts'

const route = useRoute()
const { editMode, filterdTasks, init, setDeadline, deleteTasks, switchEdit, selectTask, changeTasklist } = useTaskStore()
const { $toast } = useNuxtApp()

const dialog = ref<InstanceType<typeof TaskDialog>>()
const selectedIds = ref<string[]>([])
const dateRange = ref<DateRange | null>(null)

const runAsync = async (callback: Function) => {
  try {
    await callback()
    $toast.show('成功しました')
  } catch (error) {
    console.error(error)
    $toast.error('失敗しました')
  }
}

const showInfo = () => {
  alert('選択した項目を一括操作します')
}

const deleteSelected = async () => {
  if (!editMode.value) return

  if (selectedIds.value.length > 0 && confirm('削除しますか？')) {
    await runAsync(() => deleteTasks(selectedIds.value))
  }
}

const changeList = async (listId: string) => {
  await changeTasklist(listId, selectedIds.value)
}

const editTodo = async (taskId: string) => {
  await dialog.value?.openAsync({ isCreateMode: false, task: { id: taskId } as Task })
}

const handleCheck = (taskId: string) => {
  if (!editMode.value) return

  const index = selectedIds.value.findIndex(id => id === taskId)
  if (index >= 0) {
    selectedIds.value.splice(index, 1)
  } else {
    selectedIds.value.push(taskId)
  }
}

const clearSelection = () => {
  selectedIds.value.length = 0
}

const _setDeadline = async (targetDate: DateRange) => {
  if (!editMode.value) return
  // dateRangeの変更で動いてしまうので、除外
  if (!targetDate) return

  if (targetDate !== null && selectedIds.value.length > 0 && confirm('期限を設定しますか？')) {
    const startDateNum = dateFactory(targetDate.start!).getDateNumber() as DateNumber
    const endDateNum = dateFactory(targetDate.end!).getDateNumber() as DateNumber
    const targets = filterdTasks.value
      .filter(t => selectedIds.value.includes(t.id))
      .map((t) => {
        return {
          id: t.id,
          startdate: startDateNum,
          enddate: endDateNum
        }
      })

    await runAsync(() => setDeadline(targets))
    // NOTE: @update:modelValueが動く
    dateRange.value = null
    clearSelection()
  }
}

watch(editMode, (n, _) => {
  // 編集モード終了時に選択を解除する
  if (n === false) {
    clearSelection()
  }
})

definePageMeta({
  layout: computed<LayoutKey>(() => {
    const { isMobile } = useDevice()
    return isMobile ? 'board-mobile' : 'board'
  })
})

onMounted(async () => {
  const tasklistId: string = route.params.id.toString()
  await init(tasklistId)
})
</script>

<template>
  <div class="flex flex-col bg-white h-full">
    <header class="flex-none">
      <TaskHeader show-menu />
      <div class="border-b" />
      <div v-if="editMode" class="w-full flex items-center justify-center flex-wrap p-1 border-b">
        <fa class="mx-0.5 cursor-pointer" :icon="['fas', 'circle-info']" @click="showInfo" />
        <span class="mx-0.5">編集モード:</span>
        <div class="mx-0.5 flex flex items-center">
          <!-- @vue-ignore -->
          <DatePicker v-model.range="dateRange" class="flex-1" :attributes="[{
              key: 'today',
              dot: 'blue',
              dates: [new Date()]
            }]"
            @update:modelValue="_setDeadline"
          >
            <template #default="{ togglePopover }">
              <button class="btn-sm btn-outline block" @click="togglePopover">
                期限の設定
              </button>
            </template>
          </DatePicker>
        </div>
        <button class="btn-sm btn-outline mx-0.5" @click="deleteSelected">
          一括削除
        </button>
        <TaskListChangeDialog @select="changeList" />
        <button class="btn-sm btn-regular mx-0.5" @click="switchEdit">
          キャンセル
        </button>
      </div>
    </header>
    <main class="pt-2 pb-4 flex-1 overflow-y-scroll">
      <div v-if="filterdTasks.length > 0" class="mx-2 overflow-x-hidden flex-grow">
        <div class="list-group">
          <!-- <draggable v-model="filterdTasks" handle=".move-icon" @end="onDragEnd"> -->
            <TaskItem v-for="item in filterdTasks"
              :key="item.id"
              :task="item"
              :option="{ showPointer: editMode, showEdit: editMode }"
              :is-checked="selectedIds.includes(item.id)"
              class="list-group-item list-style"
              @edit="editTodo"
              @select="selectTask"
              @check="handleCheck"
            />
          <!-- </draggable> -->
        </div>
      </div>
      <NoData v-else />
    </main>
    <footer class="px-2 py-2 bg-gray-500 flex-none">
      <TaskInput />
    </footer>
    <TaskDialog ref="dialog" />
  </div>
</template>

<style scoped>
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

/* ステータスラベル */
.status-label {
  margin: 0 5px;
}
</style>