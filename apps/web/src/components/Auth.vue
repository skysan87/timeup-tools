<script setup lang="ts">
const { login, checkLogin } = useAuth()
const { init: initTasklist } = inject('tasklist') as TasklistStore
const { init: initHabit } = inject('habit') as HabitStore
const { init: initConfig } = inject('config') as ConfigStore
const config = useRuntimeConfig()

const isMounted = ref(false)
const isClicked = ref(false)
const isLogin = ref(false)

const navigigate = async () => {
  await Promise.all([
    initHabit(),
    initTasklist(),
    initConfig()
  ])
  isLogin.value = true
  navigateTo(config.public.rootPath)
}

const doLogin = async () => {
  isClicked.value = true
  await login((_user) => {
    navigigate()
  }, (error) => {
    isLogin.value = false
    throw showError(error)
  })
}

onMounted(async () => {
  // ログイン後リダイレクト時
  // FIXME:
  // onMounted is called when there is no active component instance to be associated with.
  // Lifecycle injection APIs can only be used during execution of setup().
  // If you are using async setup(), make sure to register lifecycle hooks before the first await statement.
  const loginSucceeded = await checkLogin()
  if (loginSucceeded) {
    navigigate()
  }
  isMounted.value = true
})
</script>

<template>
  <div class="login-container mx-auto px-4 h-full">
    <div v-if="!isLogin && isMounted" class="flex content-center items-center justify-center h-full">
      <div class="w-full px-4 pt-32">
        <div class="flex flex-col w-full bg-gray-300 border-0">
          <div class="px-6 py-6">
            <div class="text-center mb-3">
              <h6 class="text-gray-600 text-base font-bold">
                <!-- Log in with -->
              </h6>
            </div>
            <div class="text-center login-btn-box">
              <div v-if="isClicked" class="py-2">
                <fa :icon="['fas', 'circle-notch']" size="2x" class="fa-spin" />
              </div>
              <button v-else class="login-button" type="button" @click.once="doLogin">
                <div class="flex">
                  <fa :icon="['fab', 'google']" size="2x" class="mr-2 text-red-500" />
                  <span class="mt-1">Log In</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!isMounted" class="w-full h-full fixed block top-0 left-0 opacity-75 z-50 bg-blue-100">
      <span class="text-green-500 mx-auto block relative w-0 h-0" style="top: 50%;">
        <fa :icon="['fas', 'circle-notch']" size="5x" class="fa-spin" />
      </span>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 480px;
}

.login-btn-box {
  min-height: 60px;
}

.login-button {
  @apply bg-white text-gray-800 px-8 py-2 outline-none shadow inline-flex items-center font-bold justify-center;
}

.login-button:focus {
  @apply outline-none;
}

.login-button:active {
  @apply bg-gray-500;
}

.login-button__disabled {
  @apply bg-gray-500 !important;
}
</style>
