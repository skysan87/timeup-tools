const CLOSE_REASON_OK = ''
const CLOSE_REASON_CANCEL = 'cancel'

export const useDialog = () => {
  const dialog = ref<HTMLDialogElement>()
  const { isMobile } = useDevice()

  return {
    dialog,
    open: (onOpen: () => void = () => { }, onClose: (isCancel: boolean) => any = () => null) => {
      if (!dialog.value) {
        throw new Error('dialog is empty')
      }
      if (isMobile) {
        dialog.value.classList.add('--mobile')
      } else {
        dialog.value.classList.remove('--mobile')
      }
      return new Promise<any>(async (resolve, reject) => {
        try {
          dialog.value!.showModal()
          await onOpen()
        } catch (error) {
          reject(error)
        }
        dialog.value!.addEventListener('close', async () => {
          try {
            const isCancel = dialog.value!.returnValue === CLOSE_REASON_CANCEL
            const returnValue = await onClose(isCancel)
            resolve(returnValue)
          } catch (error) {
            reject(error)
          }
        }, { once: true })
      })
    },
    cancel: () => {
      dialog.value?.close(CLOSE_REASON_CANCEL)
    },
    submit: () => {
      dialog.value?.close(CLOSE_REASON_OK)
    }
  }
}