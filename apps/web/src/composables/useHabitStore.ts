import { Habit } from "@timeup-tools/core/model"
import { HabitPage } from "@/const/page"

export const useHabitStore = () => {
  const { $habit } = useNuxtApp()

  const _habits = useState<Habit[]>('habit', () => [])

  const currentFilter = ref<HabitPage | ''>('')

  const init = async () => {
    _habits.value = await $habit.init()
    console.log('init HabitStore')
  }

  const initFromCache = async () => {
    _habits.value = await $habit.getFromCache()
  }

  const currentHabits = computed(() => {
    switch (currentFilter.value) {
      case HabitPage.Today:
        return _habits.value.filter(h => h.isActive && h.isPlanDay)
      case HabitPage.Active:
        return _habits.value.filter(h => h.isActive)
      case HabitPage.All:
      default:
        return _habits.value.concat()
    }
  })

  const create = () => {
    return $habit.create()
  }

  const getHabitById = (habitId: string) => {
    const item = _habits.value.find(h => h.id === habitId)
    return item ? { ...item } as Habit : $habit.create()
  }

  const addHabit = async (habit: Partial<Habit>) => {
    const newHabit = await $habit.addHabit(habit)
    _habits.value.push(newHabit)
  }

  const updateHabit = async (habit: Habit) => {
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
    currentFilter,
    currentHabits,
    init,
    initFromCache,
    create,
    getHabitById,
    addHabit,
    updateHabit,
    deleteHabit
  }
}