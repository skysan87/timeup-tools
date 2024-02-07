<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

const { logout, getUserName } = useAuth()
const { init: initTasklist } = inject('tasklist') as TasklistStore
const { init: initHabit } = inject('habit') as HabitStore
const { init: initConfig } = inject('config') as ConfigStore

const config = useRuntimeConfig()

const appVersion = config.public.appVersion

const userName = ref<string>('')

const handleLogout = async () => {
  await logout(() => {
    navigateTo('/login', { replace: true })
  })
}

const reload = async () => {
  await Promise.all([
    initHabit(),
    initTasklist(),
    initConfig()
  ])
  navigateTo(config.public.rootPath, { replace: true })
}

const _getUserName = async () => {
  userName.value = await getUserName()
}

onMounted(_getUserName)
</script>

<template>
  <span class="block px-6 pt-1">Ver.{{ appVersion }}</span>
  <span class="block px-6 pt-1">{{ userName }}</span>
  <a class="block px-6 pt-1 hover:bg-blue-800 hover:opacity-75 cursor-pointer" @click.left="reload">
    <fa :icon="['fas', 'sync-alt']" size="lg" />
    <span class="pl-1">リロード</span>
  </a>
  <a class="block px-6 pt-1 hover:bg-blue-800 hover:opacity-75 cursor-pointer" @click.left="handleLogout">
    <fa :icon="['fas', 'sign-out-alt']" size="lg" />
    <span class="pl-1">ログアウト</span>
  </a>
</template>