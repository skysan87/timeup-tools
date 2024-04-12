import type { NuxtError } from "@nuxt/types"
import type { User } from "@timeup-tools/core/model"

export const useAuth = () => {
  const { $auth } = useNuxtApp()

  return {
    init: async () => {
      await $auth.initalize()
      console.log('init Auth')
    },
    login: async (onSuccess = (credential: User) => { }, onError = (error: NuxtError) => { }) => {
      try {
        const user = await $auth.login()
        onSuccess(user)
      } catch (error) {
        onError(createError(error as NuxtError))
      }
    },
    checkLogin: (): boolean => {
      return $auth.authenticated()
    },
    logout: async (onSuccess = () => { }, onError = (error: NuxtError) => { }) => {
      try {
        await $auth.logout()
        onSuccess()
      } catch (error) {
        onError(createError(error as NuxtError))
      }
    },
    getUserName: async () => {
      const user = await $auth.getUser()
      return user.displayName ?? ''
    }
  }
}