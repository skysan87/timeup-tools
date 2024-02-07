<script setup lang="ts">
const { isMobile } = useDevice()

const visible = ref(false)

const width = isMobile ? '100%' : '30%'
const open = () => visible.value = true
const close = () => visible.value = false
</script>

<template>
  <div>
    <slot name="activator" :open="open" />
    <transition name="menu">
      <div v-show="visible" class="menu px-4">
        <div>
          <button class="btn btn-outline" @click="close">
            閉じる
          </button>
        </div>
        <div class="mt-2">
          <slot name="content" :close="close" />
        </div>
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
@keyframes right-to-left {
  0% {
    transform: translateX(v-bind(width));
  }

  100% {
    transform: translateX(0);
  }
}

.menu {
  background-color: rgb(197, 197, 197);
  z-index: 30;
  padding: 10px;
  position: fixed;
  height: 80rem;
  width: v-bind(width);
  top: 0;
  right: 0;

  &-enter-active {
    animation: right-to-left .4s;
  }

  &-leave-active {
    animation: right-to-left .4s reverse;
  }
}
</style>
