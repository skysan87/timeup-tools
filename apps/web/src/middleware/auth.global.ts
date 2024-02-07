import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware(async (to) => {
  const { checkLogin } = useAuth()
  const authenticated = await checkLogin()

  if (!authenticated && to.path !== '/login') {
    return navigateTo('/login', { replace: true })
  }
})