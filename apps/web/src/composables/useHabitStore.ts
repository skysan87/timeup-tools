import { Habit } from "@timeup-tools/core/model"
import { HabitPage } from "@/const/page"
import { Frequnecy, MonthlyType } from "@timeup-tools/core/value-object"

export type HabitStore = ReturnType<typeof useHabitStore>

export const useHabitStore = () => {
  const { $habit } = useNuxtApp()

  const _habits = ref<Habit[]>([])

  const setFrequencyOptions = (habit: Habit) => {
    switch (habit.frequency) {
      case Frequnecy.DAILY:
        habit.weekdays = []
        habit.monthlyType = null
        habit.planDays = []
        habit.planWeek = null
        break
      case Frequnecy.WEEKLY:
        habit.monthlyType = null
        habit.planDays = []
        habit.planWeek = null
        break
      case Frequnecy.MONTHLY:
        habit.weekdays = []
        switch (habit.monthlyType) {
          case MonthlyType.DAY:
            habit.planWeek = null
            break
          case MonthlyType.WEEK:
            habit.planDays = []
            break
          case MonthlyType.END:
          default:
            habit.planDays = []
            habit.planWeek = null
            break
        }
        break
      default:
        break
    }
  }

  const init = async () => {
    _habits.value.push(...await $habit.init())
  }

  const load = (filter: HabitPage) => {
    switch (filter) {
      case HabitPage.Today:
        return _habits.value.filter(h => h.isActive && h.isPlanDay)
      case HabitPage.Active:
        return _habits.value.filter(h => h.isActive)
      case HabitPage.All:
      default:
        return _habits.value.concat()
    }
  }

  const getHabitById = (habitId: string) => {
    const item = _habits.value.find(h => h.id === habitId)
    return item ? { ...item } as Habit : null
  }

  const addHabit = async (habit: Partial<Habit>) => {
    setFrequencyOptions(habit as Habit)
    const newHabit = await $habit.addHabit(habit)
    _habits.value.push(newHabit)
  }

  const updateHabit = async (habit: Habit) => {
    setFrequencyOptions(habit)
    const updated = await $habit.updateHabit(habit)
    _updateArray(updated)
  }

  const deleteHabit = async (habitId: string) => {
    const index = _habits.value.findIndex(t => t.id === habitId)
    if (index > -1) {
      _habits.value.splice(index, 1)
      await $habit.deleteHabit(habitId)
    }
  }

  const _updateArray = (habit: Habit): void => {
    const index = _habits.value.findIndex(v => v.id === habit.id)
    Object.assign(_habits.value[index], habit)
  }

  return {
    init,
    load,
    getHabitById,
    addHabit,
    updateHabit,
    deleteHabit
  }
}