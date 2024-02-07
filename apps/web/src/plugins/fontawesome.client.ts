import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { config, library } from '@fortawesome/fontawesome-svg-core'
import {
  faEllipsisV, faEdit, faCircleNotch, faCaretDown, faPlus, faCalendarDay, faArrowLeft,
  faSignOutAlt, faSyncAlt, faTrashCan, faCircleCheck, faCircleInfo, faFloppyDisk
} from '@fortawesome/free-solid-svg-icons'
import { faPlusSquare, faCalendar } from '@fortawesome/free-regular-svg-icons'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'

config.autoAddCss = false

// 利用するアイコンを配列に追加
const solidIcons = [
  faEllipsisV, faEdit, faCircleNotch, faCaretDown, faPlus, faCalendarDay, faArrowLeft,
  faSignOutAlt, faSyncAlt, faTrashCan, faCircleCheck, faCircleInfo, faFloppyDisk
]
const regularIcons = [faPlusSquare, faCalendar]
const bransIcons = [faGoogle]

// 利用するアイコンをlibraryに追加
library.add(...solidIcons, ...regularIcons, ...bransIcons)

// グローバルコンポーネントに登録
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('fa', FontAwesomeIcon)
})