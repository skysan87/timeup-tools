// @ts-ignore
import { setupCalendar } from 'v-calendar'
import 'v-calendar/style.css'

// グローバルコンポーネントに登録
export default defineNuxtPlugin((nuxtApp) => {
  // https://vcalendar.io/calendar/api.html#defaults
  nuxtApp.vueApp.use(setupCalendar, {
    masks: {
      input: ['YYYY/MM/DD', 'L'],
      title: 'YYYY MMMM'
    }
  })
})
