import { Config } from '@timeup-tools/core/model'

export type ConfigStore = ReturnType<typeof useConfigStore>

export const useConfigStore = () => {
  const { $user_config } = useNuxtApp()

  const config = ref<Config>({} as Config)

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
