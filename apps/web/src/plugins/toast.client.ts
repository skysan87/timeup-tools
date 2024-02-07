// @ts-ignore
import { useToast } from 'tailvue'

interface toast {
  show(message: string): void
  warn(message: string): void
  error(message: string): void
}

// @ts-ignore
declare module '#app' {
  interface NuxtApp {
    $toast: toast
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const { show } = useToast()

  nuxtApp.provide('toast', {
    show: (message: string) => {
      show({
        type: 'info',
        message,
        timeout: 0.8,
        pauseOnHover: false,
        progress: false
      })
    },
    warn: (message: string) => {
      show({
        type: 'warning',
        message,
        timeout: 4,
        pauseOnHover: false
      })
    },
    error: (message: string) => {
      show({
        type: 'danger',
        message,
        timeout: 6,
        pauseOnHover: false
      })
    }
  } as toast)
})