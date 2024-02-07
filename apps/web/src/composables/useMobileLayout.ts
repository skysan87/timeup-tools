export const useMobileLayout = () => {
  const isMenuExpanded = ref(false)

  return {
    isMenuExpanded: readonly(isMenuExpanded),
    switchMenu: (): void => {
      isMenuExpanded.value = !isMenuExpanded.value
    },
    close: (): void => {
      isMenuExpanded.value = false
    }
  }
}