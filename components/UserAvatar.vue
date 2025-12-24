<template>
  <div class="relative inline-flex">
    <img
      v-if="src && !showFallback"
      :src="src"
      :alt="alt"
      class="w-8 h-8 rounded-full object-cover"
      @error="handleError"
    >
    <div
      v-else
      class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center font-semibold text-primary-700"
    >
      {{ fallback }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  src?: string
  alt: string
  fallback: string
}>()

const showFallback = ref(!props.src)

const handleError = () => {
  showFallback.value = true
}
</script>