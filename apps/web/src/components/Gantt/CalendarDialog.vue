<script setup lang="ts">
import { DatePicker } from 'v-calendar'
import { dateFactory } from '@timeup-tools/core/util/DateUtil'
import type { DateRange } from '@timeup-tools/core/value-object'

const { dialog, open, cancel, submit } = useDialog()

const datepickRange = ref<DateRange | null>(null)
const calenderAttributes = ref<{ key: string, dot?: string, bar?: string, dates: Date[] | DateRange }[]>([])
const datepicker = ref<any>()

const clearDatePicker = () => {
  datepickRange.value = null
  submit()
}

const init = async (range: DateRange) => {
  datepickRange.value = null
  calenderAttributes.value.length = 0

  calenderAttributes.value.push({
    key: 'today',
    dot: 'blue',
    dates: [new Date()]
  })

  let targetDate = new Date()
  // 編集前の値
  if (range.start && range.end) {
    // NOTE:
    //  datepickerのvalueに値を設定するとイベントが発動し制御できないため、
    //  表示のみにとどめる
    calenderAttributes.value.push({
      key: 'range',
      bar: 'green',
      dates: range
    })
    targetDate = range.start
  }

  await datepicker.value?.move(targetDate)
}

const openAsync = (start?: Date, end?: Date): Promise<{ isSuccess: boolean, range: DateRange }> => {
  return open(() => {
    init({ start: start ?? null, end: end ?? null } as DateRange)
  }, (isCancel) => {
    return {
      isSuccess: !isCancel,
      range: { start: datepickRange.value?.start ?? null, end: datepickRange.value?.end ?? null }
    }
  })
}

defineExpose({
  openAsync
})
</script>

<template>
  <dialog ref="dialog" @cancel.prevent class="p-0">
    <div class="flex flex-col py-4">
      <div class="flex-1 overflow-y-auto pl-4 pr-2">

        <div class="modal-body">
          <!-- @vue-ignore -->
          <DatePicker ref="datepicker" v-model.range="datepickRange" :attributes="calenderAttributes" />
        </div>
      </div>

      <div class="flex-none border-t my-1" />

      <div class="flex-none flex flex-row mt-2 mx-2">
        <button class="btn btn-regular ml-2" @click="submit">
          OK
        </button>
        <button class="btn btn-outline ml-2" @click="cancel">
          Close
        </button>
        <button class="btn btn-red-outline ml-2" @click="clearDatePicker">
          Clear
        </button>
      </div>
    </div>
  </dialog>
</template>