<script setup lang="ts">
import PartInputDialog from '@/components/Part/InputDialog.vue'

const dialog = ref<InstanceType<typeof PartInputDialog>>()
const { config, updateMessage } = useConfigStore()
const { $toast } = useNuxtApp()

const updateHeaderText = async () => {
  const result = await dialog.value?.openAsync(config.value?.globalMessage ?? '')
  if (result?.isSuccess) {
    $toast.show('更新しました')
  }
}

const submit = async (input: string) => {
  await updateMessage(input)
}
</script>

<template>
  <div class="mt-5 px-4 flex justify-between items-center">
    <div class="font-bold text-lg">
      設定
    </div>
  </div>
  <div
    class="py-1 px-5 cursor-pointer text-sm hover:bg-blue-700 hover:opacity-75"
    @click.left="updateHeaderText"
  >
    ヘッダーメッセージ
  </div>
  <PartInputDialog ref="dialog" title="ヘッダーメッセージを変更" :submit-action="submit" />
</template>