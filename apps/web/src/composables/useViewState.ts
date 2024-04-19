import { dateFactory } from '@timeup-tools/core/util/DateUtil'

export const useViewState = () => {

  const currentDate = useState<string>('currentDate', () => dateFactory().format('YYYY.M.D(ddd)'))

  return {
    init: () => {
      currentDate.value = dateFactory().format('YYYY.M.D(ddd)')
    },

    currentDate: readonly(currentDate)
  }
}