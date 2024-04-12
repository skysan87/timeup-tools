import { Config } from '@timeup-tools/core/model'

export const useConfigStore = () => {
  const { $user_config } = useNuxtApp()

  const config = useState<Config>('config', () => $user_config.create())

  return {
    config: readonly(config),

    init: async () => {
      config.value = await $user_config.getConfig()
      console.log('init User-Config')
    },

    updateMessage: async (message: string) => {
      const newValue = await $user_config.updateMessage(message)
      config.value = newValue
    }
  }
}
