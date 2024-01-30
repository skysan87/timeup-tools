<script setup lang="ts">
import PartInputDialog from '@/components/Part/InputDialog.vue'

const dialog = ref<InstanceType<typeof PartInputDialog>>()

const updateHeaderText = async () => {
  const result = await dialog.value?.openAsync('') // TODO: 編集前の値
  console.log(result)
}

const submit = async (input: string) => {
  // TODO: 更新後の値を保存する
  console.log(input)
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