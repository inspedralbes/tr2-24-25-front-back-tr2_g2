<template>
  <li class="flex items-center justify-between p-4">
    <div class="flex items-center">
      <span class="text-2xl mr-4">{{ icon }}</span>
      <div>
        <p class="text-sm font-semibold">{{ name }}</p>
        <p class="text-xs text-gray-500">{{ message }}</p>
      </div>
    </div>
    <div class="flex space-x-2">
      <button
        class="px-2 py-1 text-xs bg-green-200 rounded-md"
        @click="$emit('markAsRead')"
      >
        Marcar como leído
      </button>
      <button
        class="px-2 py-1 text-xs bg-red-200 rounded-md"
        @click="$emit('remove')"
      >
        Eliminar
      </button>
    </div>
  </li>
</template>

<script setup>
defineProps({
  name: String,
  message: String,
  icon: String,
  type: String,
});
</script>

<style scoped>
button.bg-green-200 {
  background-color: #a5d6a7;
}
button.bg-red-200 {
  background-color: #ef9a9a;
}
</style>