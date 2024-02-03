<script setup lang="ts">
import { dateFactory } from '@timeup-tools/core/util/DateUtil'
import { useBoard } from '@/composables/useBoard'

const { sideWidth, dragStartSidebar, draggingSidebar, registerEvents, unregisterEvents } = useBoard()
const { selectedItem } = inject('task') as TaskStore
const { config } = inject('config') as ConfigStore

const currentDate: string = dateFactory().format('YYYY.M.D(ddd)')

// =========================================
// サイズメニュー幅変更
// =========================================

const TaskView = resolveComponent('TaskView')
const subPanel = computed(() => {
  return selectedItem.value !== null ? TaskView : 'div'
})
const sidebar_width = computed(() => sideWidth.value + 'px')
const sidepanel_width = computed(() => subPanel.value !== 'div' ? '25vw' : '0')
const dragbar_left = computed(() => (sideWidth.value - 3) + 'px')

onMounted(() => {
  registerEvents()
})

onUnmounted(() => {
  unregisterEvents()
})
</script>

<template>
  <div class="app-container select-none">
    <div class="app-top_nav bg-green-400 text-center">
      {{ config.globalMessage ?? '' }}
    </div>
    <div class="app-workspace-layout">
      <div class="app-workspace__sidebar">
        <div class="app-workspace__task_sidebar flex flex-col flex-none bg-gray-800 pt-3 text-white">
          <PartExpandPanel right>
            <template #title>
              <h1 class="font-semibold text-xl leading-tight px-4 pb-1 cursor-pointer">
                <span class="font-mono">{{ currentDate }}</span>
              </h1>
            </template>
            <template #component>
              <div class="flex-none">
                <MenuCommand />
              </div>
            </template>
          </PartExpandPanel>

          <!-- border -->
          <div class="border-b border-gray-600 pt-1" />

          <div class="flex-1 py-4 overflow-y-scroll scrollable-container">

            <MenuSummary />

            <MenuProjects />

            <MenuHabits />

            <MenuConfig />

          </div>
        </div>
      </div>

      <div
        class="dragSidebar h-screen"
        @mousedown="dragStartSidebar"
        @mousemove="draggingSidebar($event)"
      />

      <div class="app-workspace__view">
        <slot />
      </div>

      <div class="app-workspace__view-2">
        <component :is="subPanel" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollable-container {
  /* IE, Edge */
  -ms-overflow-style: none;
  /* Firefox */
  scrollbar-width: none;
}

.scrollable-container::-webkit-scrollbar {
  /* Chrome, Safari */
  display: none;
}

.app-container {
  display: grid;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  grid-template-rows: min-content auto;
  grid-template-areas:
    "app-container__top-nav"
    "app-container__workspace";
}

.app-top_nav {
  grid-area: app-container__top-nav;
}

.app-workspace-layout {
  grid-area: app-container__workspace;
  display: grid;
  overflow: hidden;
  position: relative; /* dragSidebar */
  grid-template-columns: v-bind(sidebar_width) auto v-bind(sidepanel_width);
  grid-template-rows: 100%;
  grid-template-areas:
    "app-workspace__sidebar app-workspace__view app-workspace__view-2";
}

.app-workspace__sidebar {
  grid-area: app-workspace__sidebar;

  display: grid;
  grid-template-columns: auto;
  grid-template-areas:
    "app-workspace__task_sidebar";
  grid-template-rows: auto;
  overflow: hidden;
}

.app-workspace__task_sidebar {
  grid-area: app-workspace__task_sidebar;
  width: 100%;
  min-height: 0;
  height: auto;
}

.app-workspace__view {
  grid-area: app-workspace__view;
  width: calc(100vw - v-bind(sidebar_width) - v-bind(sidepanel_width));
  overflow: auto;
}

.app-workspace__view-2 {
  grid-area: app-workspace__view-2;
  max-width: 30vw;
  min-height: 0;
  height: auto;
  overflow-x: hidden;
  overflow-y: auto;
}

.dragSidebar {
  position: absolute;
  z-index: 2;
  top: 0;
  bottom: 0;
  left: v-bind(dragbar_left);
  width: 6px;
  cursor: col-resize;
  background: transparent;
  transition: background .3s;
  content: '';
  user-select: none;
}

.dragSidebar:hover {
  background: skyblue;
}
</style>