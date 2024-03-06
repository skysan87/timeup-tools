<script setup lang="ts">
import { useDialog } from '@/composables/useDialog'
import { ValidateError } from '@timeup-tools/core/error'
import { Habit } from '@timeup-tools/core/model'
import { Weekday, MonthlyType, WeekdaysLabel, Weekdays, Frequnecy, FullYear } from '@timeup-tools/core/value-object'
import { getTargetMonth } from '@timeup-tools/core/util/ZippedDataUtil'
import { Calendar } from 'v-calendar'
import { Page } from 'v-calendar/dist/types/src/utils/page.js'

const { dialog, open, cancel, submit } = useDialog()
const { create, getHabitById, addHabit, updateHabit, deleteHabit } = useHabitStore()

type Input = {
  isCreateMode: boolean
  habit: Partial<Habit>
}

const isCreateMode = ref(false)

const habit = ref<Habit>({} as Habit)
const errorMsg = reactive({
  common: '',
  title: '',
  frequency: ''
})

const defaultPlanWeek = { index: 1, day: Weekdays.SUNDAY }

// TODO: 複数日対応
const planDays = ref<number>(1)
const planWeek = ref<{ index: number, day: Weekday }>({ ...defaultPlanWeek })

const activityRate = computed(() => {
  if (!habit.value.totalActivityCount || !habit.value.totalActivityCount) return 0
  return Math.floor(habit.value.totalActivityCount / habit.value.totalCount * 100)
})
// カレンダーの設定
const calenderAttributes = ref<any[]>([])

const openAsync = (input: Input): Promise<{ isSuccess: boolean }> => {
  return open(() => {
    _init(input)
  }, (isCancel) => {
    return {
      isSuccess: !isCancel
    }
  })
}

const _init = (input: Input) => {
  isCreateMode.value = input.isCreateMode
  habit.value = input.isCreateMode ? create() : getHabitById(input.habit.id!)

  switch (habit.value.monthlyType) {
    case MonthlyType.DAY:
      if (habit.value.planDays?.length > 0) {
        planDays.value = habit.value.planDays[0]
      }
      break;
    case MonthlyType.WEEK:
      planWeek.value.index = habit.value.planWeek?.index ?? defaultPlanWeek.index
      planWeek.value.day = habit.value.planWeek?.day ?? defaultPlanWeek.day
      break;
    case MonthlyType.END:
    default:
      planDays.value = 1
      planWeek.value.index = defaultPlanWeek.index
      planWeek.value.day = defaultPlanWeek.day
      break;
  }

  initErrorMsg()
  initCalendar()
}

const _submit = async () => {
  try {
    // reset
    initErrorMsg()
    // set
    habit.value.planWeek = { ...planWeek.value }
    habit.value.planDays = [planDays.value]
    if (isCreateMode.value) {
      await addHabit(habit.value)
    } else {
      await updateHabit(habit.value)
    }
    // close
    submit()
  } catch (error: any) {
    if (error instanceof ValidateError) {
      const err = error as ValidateError<Habit>
      errorMsg.title = err.get('title')
      errorMsg.frequency = err.get('frequency')
    } else {
      console.error(error)
      errorMsg.common = error.message
    }
  }
}

const _delete = async () => {
  try {
    if (!confirm('削除しますか？')) {
      return
    }
    await deleteHabit(habit.value.id)
    submit()
  } catch (error: any) {
    console.error(error)
    errorMsg.common = error.message
  }
}

const initCalendar = () => {
  const today = new Date()
  setCalendar(today.getFullYear(), today.getMonth())
}

const updateCalendar = (pages: Page[]) => {
  if (pages.length > 0) {
    setCalendar(pages[0].year, pages[0].month - 1)
  }
}

const setCalendar = (year: number, month: number) => {
  if (isCreateMode.value) {
    return
  }
  calenderAttributes.value = [
    {
      key: 'plan', // 実施予定
      dot: 'blue',
      dates: getTargetMonth(habit.value.plan, year as FullYear, month)
    },
    {
      key: 'result', // 実績
      highlight: { color: 'blue', fillMode: 'light' },
      dates: getTargetMonth(habit.value.result, year as FullYear, month)
    }
  ]
}

const initErrorMsg = () => {
  errorMsg.common = ''
  errorMsg.title = ''
  errorMsg.frequency = ''
}

defineExpose({
  openAsync
})
</script>

<template>
  <dialog ref="dialog" @cancel.prevent class="p-0">
    <div class="flex flex-col py-4" style="height: 83vh; min-width: 75vw;">
      <div class="flex-1 overflow-y-auto pl-4 pr-2">

        <div class="modal-body">
          <label class="input-label">タイトル</label>
          <input ref="refTitle" v-model="habit.title" class="input-text"
            :class="{ 'border border-red-500': errorMsg.title !== '' }" type="text">
          <p class="text-red-500 text-xs italic">
            <span>{{ errorMsg.title }}</span>
          </p>
        </div>

        <div class="modal-body">
          <label class="input-label">説明</label>
          <textarea v-model="habit.detail" class="input-textarea resize-none" maxlength="1000" rows="6" />
        </div>

        <div class="modal-body">
          <label class="input-label">繰り返し設定</label>
          <div>
            <label>
              <input v-model="habit.frequency" name="frequency" type="radio" :value="Frequnecy.DAILY">
              <span class="mx-1">毎日</span>
            </label>
          </div>
          <div class="flex items-center">
            <label>
              <input v-model="habit.frequency" name="frequency" type="radio" :value="Frequnecy.WEEKLY">
              <span class="mx-1">毎週</span>
            </label>
            <label v-for="id in Weekdays" v-show="habit.frequency === Frequnecy.WEEKLY" :key="id" class="ml-1 flex items-center">
              <input v-model="habit.weekdays" type="checkbox" :value="id">
              <span class="p-1 align-middle">{{ WeekdaysLabel[id] }}</span>
            </label>
          </div>
          <div>
            <label>
              <input v-model="habit.frequency" name="frequency" type="radio" :value="Frequnecy.MONTHLY">
              <span class="mx-1">毎月</span>
            </label>
            <span v-show="habit.frequency === Frequnecy.MONTHLY" class="flex flex-col">
              <div>
                <label class="ml-4 my-1">
                  <input v-model="habit.monthlyType" type="radio" :value="MonthlyType.DAY">
                  <span class="ml-1">日付で指定</span>
                </label>
                <!-- TODO: 複数日対応 -->
                <select v-model="planDays" class="ml-4 bg-gray-200">
                  <option v-for="day of 31" :key="day" :value="day">{{ day }}</option>
                </select>
              </div>
              <div>
                <label class="ml-4 my-1">
                  <input v-model="habit.monthlyType" type="radio" :value="MonthlyType.WEEK">
                  <span class="ml-1">週と曜日</span>
                </label>
                <div class="inline-block ml-4">
                  <span>第</span>
                  <select v-model="planWeek.index" class="ml-1 bg-gray-200">
                    <option v-for="id of 4" :key="id" :value="id">{{ id }}</option>
                  </select>
                  <select v-model="planWeek.day" class="ml-1 bg-gray-200">
                    <option v-for="id of Weekdays" :key="id" :value="id">{{ WeekdaysLabel[id] }}</option>
                  </select>
                  <span>曜日</span>
                </div>
              </div>
              <div>
                <label class="ml-4 my-1">
                  <input v-model="habit.monthlyType" type="radio" :value="MonthlyType.END">
                  <span class="ml-1">月末</span>
                </label>
              </div>
            </span>
          </div>
          <p class="text-red-500 text-xs italic">
            <span>{{ errorMsg.frequency }}</span>
          </p>
        </div>

        <div class="modal-body">
          <label class="input-label">有効</label>
          <input v-model="habit.isActive" type="checkbox">
        </div>

        <div v-if="!isCreateMode" class="modal-body">
          <label class="input-label">実績</label>
          <div>
            <Calendar expanded :attributes="calenderAttributes" @did-move="updateCalendar" />
          </div>
          <div>
            <span class="pr-4">継続期間 {{ habit.duration }}</span>
            <span class="pr-4">最大継続期間 {{ habit.maxduration }}</span>
            <span class="pr-4">通算 {{ habit.totalActivityCount }}</span>
            <span class="pr-4">実行率 {{ activityRate }}％</span>
          </div>
        </div>

      </div>

      <div class="flex-none border-t my-1" />

      <div class="flex-none px-2">
        <span class="text-red-500 text-xs italic">{{ errorMsg.common }}</span>
      </div>

      <div class="flex-none flex flex-row mt-2 mx-2">
        <button class="btn btn-regular ml-2" @click="_submit">
          OK
        </button>
        <button class="btn btn-outline ml-2" @click="cancel">
          Cancel
        </button>
        <button v-if="!isCreateMode" class="btn btn-red-outline ml-2" @click="_delete">
          Delete
        </button>
        <span v-if="!isCreateMode" class="ml-2 text-xs text-gray-600 flex-1">
          変更や削除は明日以降のタスクに反映されます。
        </span>
      </div>
    </div>
  </dialog>
</template>