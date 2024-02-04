<script setup lang="ts">
import { useGantt } from '@/composables/useGantt'
import { Task } from '@timeup-tools/core/model'
import { GanttViewModel } from '~/viewmodels/GanttViewModel'
import CalendarDialog from './CalendarDialog.vue'

const dialog = ref<InstanceType<typeof CalendarDialog>>()

const {
  calendarRef,
  blockWidth, taskWidth, viewWidth, totalDays, calendars, startMonth,
  todayPosition, taskRows,
  setData, getChangedData, setRange, weekendColor, mountEvent, unmountEvent, onMouseDown_MoveStart, onMouseDown_ResizeStart, changeStartMonth
} = useGantt()

const emits = defineEmits<{
  (method: 'select-task', taskId: string): void
}>()

/**
 * タスクの選択イベント<br>
 * ただし、外側でデータを変更してもGanttViewModelに反映されない
 * @param taskId
 */
const selectTask = (taskId: string) => {
  emits('select-task', taskId)
}

const editRange = async (taskId: string) => {
  const task = taskRows.value.find(task => task.id === taskId)
  if (!task) return

  const result = await dialog.value?.openAsync(task.startDate?.toDate(),  task.endDate?.toDate())
  if (result?.isSuccess) {
    setRange(taskId, result?.range)
  }
}

const initView = (data: Task[]) => {
  setData(data)
}

onMounted(mountEvent)
onUnmounted(unmountEvent)

defineExpose({
  initView, getChangedData
})
</script>

<template>
  <div class="flex flex-col h-full">
    <div>
      <slot name="header" :start-month="startMonth" :change-start-month="changeStartMonth" />
    </div>

    <div ref="calendarRef" class="flex-1 border-t border-black overflow-auto w-full select-none">
      <div class="top-0 flex z-20 sticky" :style="`width: ${viewWidth}px;`">
        <div class="border-b border-black bg-green-100 flex sticky left-0 top-0" :style="`min-width: ${taskWidth}px;`">
          <div class="py-2 h-full px-2 border-r border-black text-sm" style="width: 120px">
            タスク
          </div>
          <div class="py-2 h-full text-center border-r border-black text-sm" style="width: 90px">
            開始日
          </div>
          <div class="py-2 h-full text-center border-r border-black text-sm" style="width: 90px">
            期限日
          </div>
          <div class="py-2 h-full text-center border-r border-black text-sm" style="width: 20px" />
        </div>

        <div v-for="month of calendars" :key="month.title" class="border-b border-black bg-white"
          :style="`min-width: ${blockWidth * month.days.length}px;`">
          <!-- 年月 -->
          <div class="border-b border-r border-black px-2">
            {{ month.title }}
          </div>
          <!-- 日付 -->
          <div class="flex">
            <div v-for="day of month.days" :key="day.date" class="border-r border-black text-xs text-center"
              :class="weekendColor(day.dayOfWeek)" :style="`min-width: ${blockWidth}px;`">
              {{ day.date }}
            </div>
          </div>
          <!-- 曜日 -->
          <div class="flex">
            <div v-for="day of month.days" :key="day.date" class="border-r border-black text-xs text-center"
              :class="weekendColor(day.dayOfWeek)" :style="`min-width: ${blockWidth}px;`">
              {{ day.dayOfWeek }}
            </div>
          </div>
        </div>
      </div>

      <div class="relative" :style="`width: ${viewWidth}px;`">
        <!-- timeline -->
        <div v-for="i of totalDays" :key="`line-${i}`" class="absolute bg-gray-200 h-full w-px"
          :style="`left: ${i * blockWidth + taskWidth - 1}px;`" />
        <!-- today -->
        <div v-if="todayPosition >= 0" class="absolute bg-red-300 h-full"
          :style="`width: ${blockWidth - 1}px; left: ${todayPosition}px;`" />
        <!-- contents -->
        <div v-for="task of taskRows" :key="`task-${task.id}`" class="h-10 border-b border-black flex">
          <div class="z-10 flex sticky left-0" :style="`min-width: ${taskWidth}px;`"
            :class="[task.isChanged ? 'bg-blue-100' : 'bg-green-100']">
            <div class="omit-text py-2 h-full px-2 border-r border-black text-sm" style="width: 120px"
              @click.stop="selectTask(task.id)">
              {{ task.name }}
            </div>
            <div class="py-2 h-full text-center border-r border-black text-sm" style="width: 90px">
              <span>{{ task.startDateString }}</span>
            </div>
            <div class="py-2 h-full text-center border-r border-black text-sm" style="width: 90px">
              <span>{{ task.endDateString }}</span>
            </div>
            <div class="py-1 h-full text-center border-r border-black text-sm" style="width: 20px">
              <button class="h-full" @click.stop="editRange(task.id)">
                <fa :icon="['fas', 'edit']" size="xs" />
              </button>
            </div>
          </div>
          <div :style="task.style" class="h-10 flex py-2 will-change-transform"
            @mousedown="onMouseDown_MoveStart($event, task as GanttViewModel)">
            <div class="w-2 bg-yellow-200 rounded-l-lg cursor-col-resize"
              @mousedown.stop="onMouseDown_ResizeStart($event, task as GanttViewModel, 'left')" />
            <div class="flex-1 bg-yellow-200 pointer-events-none" />
            <div class="w-2 bg-yellow-200 rounded-r-lg cursor-col-resize"
              @mousedown.stop="onMouseDown_ResizeStart($event, task as GanttViewModel, 'right')" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <CalendarDialog ref="dialog" />
</template>

<style scoped>
.sticky {
  position: sticky;
  position: -webkit-sticky;
}

.will-change-transform {
  will-change: transform;
}

.cursor-col-resize {
  cursor: col-resize;
}

.data-picker {
  background-color: rgba(215, 214, 214, 0.5);
}
</style>