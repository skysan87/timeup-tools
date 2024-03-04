export default defineNuxtPlugin(async () => {
  console.log('=== start init auth ===')

  const { init } = useAuth()
  await init()

  console.log('=== end init auth ===')
})