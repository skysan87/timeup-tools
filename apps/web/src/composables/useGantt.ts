import { DateUtil, dateFactory } from "@timeup-tools/core/util/DateUtil"
import { GanttViewModel } from '@/viewmodels/GanttViewModel'
import { Task } from "@timeup-tools/core/model"
import { DateNumber, DateRange } from "@timeup-tools/core/value-object"

const BLOCK_SIZE = 20
const TASK_WIDTH = 320
const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土']

export const useGantt = () => {
  const _today = dateFactory().getFirstDayOfMonth()

  let dragging = false
  let leftResizing = false
  let rightResizing = false
  const target = <{
    pageX: number,
    element: HTMLElement | null,
    task: GanttViewModel | null
  }>{
      pageX: 0,
      element: null,
      task: null
    };

  let contentWidth = 0
  let endMonth = _today.add(1, 'month').getEndDayOfMonth()

  const calendarRef = ref<HTMLElement>()
  const blockWidth = ref<number>(BLOCK_SIZE)
  const taskWidth = ref<number>(TASK_WIDTH)
  const viewWidth = ref<number>(0)
  const totalDays = ref<number>(0)
  const calendars = ref<Array<{ title: string, days: Array<{ date: number, dayOfWeek: string }> }>>([])
  const startMonth = ref<DateUtil>(_today)
  const tasks = ref<GanttViewModel[]>([])

  const initView = () => {
    setCalendar()
    totalDays.value = calendars.value.reduce((p, c) => p + c.days.length, 0)
    contentWidth = totalDays.value * blockWidth.value
    viewWidth.value = taskWidth.value + contentWidth
    nextTick(() => {
      calendarRef.value!.scrollLeft = todayPosition.value - TASK_WIDTH
    })
  }

  const getDays = (startMonth: DateUtil) => {
    const days: Array<{ date: number, dayOfWeek: string }> = []
    for (let i = 0; i < startMonth.daysInMonth(); i++) {
      const targetDate = startMonth.addDay(i)
      days.push({
        date: targetDate.get('day'),
        dayOfWeek: dayOfWeek[targetDate.get('dayOfWeek')]
      })
    }
    return days
  }

  const setCalendar = () => {
    calendars.value.length = 0
    const betweenMonth = endMonth.diff(startMonth.value as DateUtil, 'month')
    for (let i = 0; i <= betweenMonth; i++) {
      const targetMonth = startMonth.value.add(i, 'month')
      calendars.value.push({
        title: targetMonth.format('YYYY年MM月'),
        days: getDays(targetMonth)
      })
    }
  }

  const setRange = (id: string, range: DateRange) => {
    const task = tasks.value.find(task => task.id === id)
    if (task) {
      task.startDate = range.start ? dateFactory(range.start) : null
      task.endDate = range.end ? dateFactory(range.end) : null
    }
  }

  const onMouseDown_MoveStart = (e: MouseEvent, task: GanttViewModel) => {
    dragging = true
    target.pageX = e.pageX
    target.element = e.target as HTMLElement
    target.task = task
  }

  const onMouseDown_Moving = (e: MouseEvent) => {
    if (!dragging) { return }

    const realX: number = calcMovePositionX(e.pageX);

    (target.element! as HTMLElement).style.transform = `translateX(${realX}px)`
  }

  const onMouseDown_MoveStop = (e: MouseEvent) => {
    if (!dragging) { return }
    const realX = calcMovePositionX(e.pageX)
    // 日付線にフィットさせる
    const days = Math.round((target.task!.pos.x - realX) / BLOCK_SIZE)

    if (days !== 0) {
      const task = tasks.value.find(task => task.id === target.task!.id)
      if (task) {
        task.startDate = task.startDate!.addDay(-days)
        task.endDate = task.endDate!.addDay(-days)
      }
    } else {
      (target.element! as HTMLElement).style.transform = `translateX(${target.task!.pos.x}px)`
    }

    dragging = false
    target.element = null
    target.task = null
    target.pageX = 0
  }

  const onMouseDown_ResizeStart = (e: MouseEvent, task: GanttViewModel, direction: 'left' | 'right') => {
    if (direction === 'left') {
      leftResizing = true
    } else {
      rightResizing = true
    }
    target.pageX = e.pageX
    target.element = (e.target! as HTMLElement).parentElement as HTMLElement
    target.task = task
  }

  const onMouseDown_Resizing = (e: MouseEvent) => {
    if (leftResizing) {
      const realX = calcResizePositionX(e.pageX)
      const realWidth = calcLeftResizeWidth(e.pageX);
      target.element!.style.transform = `translateX(${realX}px)`
      target.element!.style.width = `${realWidth}px`
    }

    if (rightResizing) {
      const realWidth = calcRightResizeWidth(e.pageX)
      target.element!.style.width = `${realWidth}px`
    }
  }

  const onMouseDown_ResizeStop = (e: MouseEvent) => {
    if (leftResizing) {
      const realX = calcResizePositionX(e.pageX)
      // 日付線にフィットさせる
      const days = Math.round((target.task!.pos.x - realX) / BLOCK_SIZE)

      if (days !== 0) {
        const task = tasks.value.find(task => task.id === target.task!.id)
        if (task) task.startDate = task.startDate!.addDay(-days)
      } else {
        target.element!.style.transform = `translateX(${target.task!.pos.x}px)`
        target.element!.style.width = `${target.task!.pos.width}px`
      }
    }

    if (rightResizing) {
      const realWidth = calcRightResizeWidth(e.pageX)
      // 日付線にフィットさせる
      const days = Math.round((target.task!.pos.width - realWidth) / BLOCK_SIZE)

      if (days !== 0) {
        const task = tasks.value.find(task => task.id === target.task!.id)
        if (task) task.endDate = task.endDate!.addDay(-days)
      } else {
        target.element!.style.width = `${target.task!.pos.width}px`
      }
    }

    leftResizing = false
    rightResizing = false
    target.element = null
    target.task = null
    target.pageX = 0
  }

  const calcMovePositionX = (currentPageX: number): number => {
    const diff = target.pageX - currentPageX

    return keepThreshold(
      target.task!.pos.x - diff
      , 0
      , contentWidth - target.task!.pos.width
    )
  }

  const calcResizePositionX = (currentPageX: number) => {
    const diff = target.pageX - currentPageX

    return keepThreshold(
      target.task!.pos.x - diff
      , 0
      , target.task!.pos.x + target.task!.pos.width - BLOCK_SIZE
    )
  }

  const calcLeftResizeWidth = (currentPageX: number): number => {
    const diff = target.pageX - currentPageX

    return keepThreshold(
      target.task!.pos.width + diff
      , BLOCK_SIZE
      , target.task!.pos.width + target.task!.pos.x
    )
  }

  const calcRightResizeWidth = (currentPageX: number): number => {
    const diff = target.pageX - currentPageX

    return keepThreshold(
      target.task!.pos.width - diff
      , BLOCK_SIZE
      , contentWidth - target.task!.pos.x
    )
  }

  const keepThreshold = (value: number, min: number, max: number): number => {
    if (value <= min) { return min }
    if (value >= max) { return max }
    return value
  }

  const setData = (data: Task[]) => {
    tasks.value.length = 0
    data.forEach(task => {
      tasks.value.push(new GanttViewModel(task))
    })
  }

  const getChangedData = () => {
    return tasks.value
      .filter(task => task.isChanged && !!task.startDate && !!task.endDate)
      .map(task => {
        return {
          id: task.id,
          startDate: task.startDate!.getDateNumber() as DateNumber,
          endDate: task.endDate!.getDateNumber() as DateNumber
        }
      })
  }

  const weekendColor = (dayOfWeek: string): string => {
    switch (dayOfWeek) {
      case '土':
        return 'bg-blue-100'
      case '日':
        return 'bg-red-100'
      default:
        return ''
    }
  }

  const mountEvent = () => {
    initView()
    document.addEventListener('mousemove', onMouseDown_Moving)
    document.addEventListener('mouseup', onMouseDown_MoveStop)
    document.addEventListener('mousemove', onMouseDown_Resizing)
    document.addEventListener('mouseup', onMouseDown_ResizeStop)
  }

  const unmountEvent = () => {
    document.removeEventListener('mousemove', onMouseDown_Moving)
    document.removeEventListener('mouseup', onMouseDown_MoveStop)
    document.removeEventListener('mousemove', onMouseDown_Resizing)
    document.removeEventListener('mouseup', onMouseDown_ResizeStop)
  }

  const changeStartMonth = (e: Event) => {
    const value = (e.currentTarget as HTMLInputElement).value

    if (value === null || value === '') {
      alert('表示する月を設定してください')
      return
    }
    const target = dateFactory(value, 'YYYY-MM').getFirstDayOfMonth()
    startMonth.value = target.getFirstDayOfMonth()
    endMonth = target.add(1, 'month').getEndDayOfMonth()

    initView()
  }

  const taskRows = computed(() => {
    tasks.value.forEach(task =>
      task.draw(BLOCK_SIZE, startMonth.value as DateUtil, endMonth)
    )
    return tasks.value
  })

  const todayPosition = computed(() => {
    const today = dateFactory()
    const diffFuture = today.diff(startMonth.value as DateUtil, 'day')
    const isBetween = today.isBetween(startMonth.value.toDate(), endMonth.toDate(), true)
    return (isBetween && diffFuture >= 0)
      ? diffFuture * BLOCK_SIZE + TASK_WIDTH
      : -1
  })

  return {
    calendarRef,
    blockWidth: readonly(blockWidth),
    taskWidth: readonly(taskWidth),
    viewWidth: readonly(viewWidth),
    totalDays: readonly(totalDays),
    calendars: readonly(calendars),
    startMonth: readonly(startMonth),
    taskRows,
    todayPosition,
    setRange,
    weekendColor,
    setData,
    getChangedData,
    mountEvent,
    unmountEvent,
    onMouseDown_MoveStart,
    onMouseDown_ResizeStart,
    changeStartMonth
  }
}