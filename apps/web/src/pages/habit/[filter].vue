<script setup lang="ts">
definePageMeta({
  layout: 'board'
})

const route = useRoute()
const filter: string = route.params.filter.toString()
</script>

<template>{{ filter  }}</template>