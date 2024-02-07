const MIN_SIDEBAR_WIDTH = 180
const MAX_SIDEBAR_WIDTH_MARGIN = 255

export const useBoard = () => {

  let isDragging = false
  let clientWidth = 0
  const sideWidth = ref(240)

  /**
   * サイドメニュー ドラッグ開始
   */
  const dragStartSidebar = () => {
    isDragging = true
    clientWidth = window.innerWidth
  }

  /**
   * サイドメニュー ドラッグ中
   */
  const draggingSidebar = (ev: MouseEvent) => {
    if (!isDragging) return
    if (ev.pageX > (clientWidth - MAX_SIDEBAR_WIDTH_MARGIN)) {
      sideWidth.value = clientWidth - MAX_SIDEBAR_WIDTH_MARGIN
    } else if (ev.pageX < MIN_SIDEBAR_WIDTH) {
      sideWidth.value = MIN_SIDEBAR_WIDTH
    } else {
      sideWidth.value = ev.pageX
    }
  }

  /**
   * サイドメニュー ドラッグ終了
   */
  const dragEndSidebar = () => {
    isDragging = false
  }

  const resizeSidebar = () => {
    if (sideWidth.value >= window.innerWidth) {
      sideWidth.value = window.innerWidth - MAX_SIDEBAR_WIDTH_MARGIN
    }
  }

  const registerEvents = () => {
    window.addEventListener('mouseup', dragEndSidebar, false)
    window.addEventListener('mousemove', draggingSidebar, false)
    window.addEventListener('resize', resizeSidebar, false)
  }

  const unregisterEvents = () => {
    window.removeEventListener('mouseup', dragEndSidebar, false)
    window.removeEventListener('mousemove', draggingSidebar, false)
    window.removeEventListener('resize', resizeSidebar, false)
  }

  return {
    sideWidth: readonly(sideWidth),
    dragStartSidebar,
    draggingSidebar,
    registerEvents,
    unregisterEvents
  }
}