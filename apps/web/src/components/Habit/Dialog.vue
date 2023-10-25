<script setup lang="ts">
import { useDialog } from '@/composables/useDialog'
import { HabitStore } from '@/composables/useHabitStore'
import { ValidateError } from '@timeup-tools/core/error'
import { Habit } from '@timeup-tools/core/model'
import { Weekday, MonthlyType, WeekdaysLabel, Weekdays, Frequnecy } from '@timeup-tools/core/value-object'
import { Calendar } from 'v-calendar'
import { Page } from 'v-calendar/dist/types/src/utils/page.js';

const { $toast } = useNuxtApp()
const { dialog, open, cancel, submit } = useDialog()
const { getHabitById, addHabit, updateHabit, deleteHabit } = inject('habit') as HabitStore

type Input = {
  isCreateMode: boolean
  habit: Partial<Habit>
}

const isCreateMode = ref(false)

const habit = ref<Habit>({} as Habit)
const errorMsg = reactive({
  title: '',
  frequency: ''
})

const monthlyType = ref<MonthlyType>()
// TODO: 複数日対応
const planDays = ref<Weekday>(Weekdays.SUNDAY)
const planWeek = ref< {index: number, day: Weekday}>({ index: 1, day: Weekdays.SUNDAY })
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
  if (!input.isCreateMode) {
    habit.value = getHabitById(input.habit.id!) ?? {} as Habit
  }

  if (habit.value.planDays?.length > 0) {
    planDays.value = habit.value.planDays[0]
  }

  // TODO:
  // if (!habit.value?.planWeek) {
  //   planWeek.value =  structuredClone(habit.value.planWeek!)
  // }

  initErrorMsg()
  initCalendar()
}

const _submit = async () => {
  try {
    // reset
    initErrorMsg()
    if (isCreateMode.value) {
      await addHabit(habit.value)
    } else {
      await updateHabit(habit.value)
    }
    // close
    submit()
  } catch (error: any) {
    if (error instanceof ValidateError) {
      // TODO: 項目を取得できるようにする
      errorMsg.title = error.message
      errorMsg.frequency = error.message
    } else {
      console.error(error)
      $toast.error(error.message)
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
    $toast.error(error.message)
  }
}

const initCalendar = () => {
  const today = new Date()
  setCalendar(today.getFullYear(), today.getMonth())
}

// TODO:
const updateCalendar = (page: Page) => {
  console.log(page)
  // setCalendar(page.year, page.month - 1)
}

const setCalendar = (year: number, month: number) => {
  calenderAttributes.value = [
    {
      key: 'plan', // 実施予定
      dot: 'blue',
      dates: [] // TODO: core/utilityに用意: getResultDaysOfMonth
    },
    {
      key: 'result', // 実績
      highlight: { color: 'blue', fillMode: 'light' },
      dates: [] // TODO: core/utilityに用意: getResultDaysOfMonth
    }
  ]
}

const initErrorMsg = () => {
  errorMsg.title = ''
  errorMsg.frequency = ''
}

defineExpose({
  openAsync
})
</script>

<template>
  <dialog ref="dialog" @cancel.prevent class="p-0">
    <div class="flex flex-col py-4" style="height: 83vh;">
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
              <span>毎日</span>
            </label>
          </div>
          <div>
            <label>
              <input v-model="habit.frequency" name="frequency" type="radio" :value="Frequnecy.WEEKLY">
              <span>毎週</span>
            </label>
            <label v-for="id in Weekdays" v-show="habit.frequency === Frequnecy.WEEKLY" :key="id" class="mx-1">
              <input v-model="habit.weekdays" type="checkbox" :value="id">
              <span class="p-1 align-middle">{{ WeekdaysLabel[id] }}</span>
            </label>
          </div>
          <div>
            <label>
              <input v-model="habit.frequency" name="frequency" type="radio" :value="Frequnecy.MONTHLY">
              <span>毎月</span>
            </label>
            <span v-show="habit.frequency === Frequnecy.MONTHLY" class="flex flex-col">
              <div>
                <label class="ml-4 my-1">
                  <input v-model="monthlyType" type="radio" :value="MonthlyType.DAY">
                  <span>日付で指定</span>
                </label>
                <!-- TODO: 複数日対応 -->
                <select v-model="planDays" class="ml-4 px-1 bg-gray-200">
                  <option v-for="day of 31" :key="day" :value="day">{{ day }}</option>
                </select>
              </div>
              <div>
                <label class="ml-4 my-1">
                  <input v-model="monthlyType" type="radio" :value="MonthlyType.WEEK">
                  <span>週と曜日</span>
                </label>
                <div class="inline-block ml-4">
                  <span>第</span>
                  <select v-model="planWeek.index" class="px-1 bg-gray-200">
                    <option v-for="id of 4" :key="id" :value="id">{{ id }}</option>
                  </select>
                  <select v-model="planWeek.day" class="px-1 bg-gray-200">
                    <option v-for="id of Weekdays" :key="id" :value="id">{{ WeekdaysLabel[id] }}</option>
                  </select>
                  <span>曜日</span>
                </div>
              </div>
              <div>
                <label class="ml-4 my-1">
                  <input v-model="monthlyType" type="radio" :value="MonthlyType.END">
                  <span>月末</span>
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
            <Calendar is-expanded :attributes="calenderAttributes" @update:pages="updateCalendar" />
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
        <span v-if="!isCreateMode" class="text-xs text-gray-600 flex-1">
          変更や削除は明日以降のタスクに反映されます。
        </span>
      </div>
    </div>
  </dialog>
</template>