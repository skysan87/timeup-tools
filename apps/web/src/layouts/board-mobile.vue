<script setup lang="ts">
import { dateFactory } from '@timeup-tools/core/util/DateUtil'

const { isMenuExpanded, switchMenu, close } = useMobileLayout()

const route = useRoute()

const currentDate: string = dateFactory().format('YYYY.M.D(ddd)')
const { config } = useConfigStore()

watch(
  () => route.path,
  () => {
    close()
  }
)

</script>

<template>
  <div class="app-container">
    <!-- header -->
    <div class="z-30">
      <header class="mx-auto text-white">
        <div class="flex justify-between items-center bg-gray-800 px-2 h-10">
          <h1 class="font-semibold text-xl leading-tight">
            <span class="font-mono">{{ currentDate }}</span>
          </h1>
          <button class="outline-none" @click.left="switchMenu">
            <svg class="h-6 w-6 fill-current" viewBox="0 0 24 24">
              <path v-show="!isMenuExpanded" d="M24 6h-24v-4h24v4zm0 4h-24v4h24v-4zm0 8h-24v4h24v-4z" />
              <path v-show="isMenuExpanded"
                d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" />
            </svg>
          </button>
        </div>

        <div v-show="isMenuExpanded" class="fixed pb-20 w-full bg-gray-800 h-full overflow-y-scroll">
          <MenuCommand />

          <MenuSummary />

          <MenuProjects />

          <MenuHabits />

          <MenuConfig />
        </div>

      </header>
    </div>

    <!-- message -->
    <div class="text-center bg-green-400">
      {{ config.globalMessage }}
    </div>

    <!-- contents -->
    <div class="h-full overflow-auto">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: grid;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  grid-template:
    "header" 40px
    "message" min-content
    "contents" auto;
}
</style>