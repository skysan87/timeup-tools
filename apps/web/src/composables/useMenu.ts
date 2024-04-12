import { MainPage, TodayPage, HabitPage } from '~/const/page'

export const useMenu = () => {

  const isSelected = (pageType: MainPage, subPath: string) => {
    const { path } = useRoute()
    const [, page, subpage,] = path.split('/')

    // メインページ
    if (!(Object.values(MainPage).includes(pageType) && page === pageType)) {
      return false
    }

    // サブページ
    if (pageType === MainPage.Today) {
      return Object.values(TodayPage).includes(subpage as TodayPage) && subpage === subPath
    } else if (pageType === MainPage.Task) {
      return subpage === subPath
    } else if (pageType === MainPage.Habit) {
      return Object.values(HabitPage).includes(subpage as HabitPage) && subpage === subPath
    }
    return true
  }

  return {
    isSelected
  }
}