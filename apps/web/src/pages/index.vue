<script setup lang="ts">
const { checkLogin } = useAuth()
const config = useRuntimeConfig()

if (checkLogin()) {
  navigateTo(config.public.rootPath, { replace: true })
} else {
  navigateTo('/login', { replace: true })
}
</script>

<template />