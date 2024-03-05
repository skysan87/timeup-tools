import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { checkLogin } = useAuth()

  console.log(`RouteChange(auth: ${checkLogin()}): ${from.path} --> ${to.path}`)

  if (!checkLogin() && to.path !== '/login') {
    return navigateTo('/login', { replace: true })
  }
})