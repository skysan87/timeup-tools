<template>
  <div class="flex flex-col justify-center items-center w-screen h-screen">
    <p class="m-2 text-black text-4xl">
      このデバイスには対応していません。
    </p>
    <button
      @click="$router.back()"
      class="rounded mt-7 text-2xl bg-blue-400 px-7 py-4 text-white"
    >
      戻る
    </button>
  </div>
</template>
