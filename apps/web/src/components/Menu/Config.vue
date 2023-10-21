<script setup lang="ts">
// TODO:
const updateHeaderText = () => {}
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
</template>