<template>
  <div>
    <div v-for="chat in chats" :key="chat.id" class="chat-item">
      <h3>{{ chat.user_one_id }}</h3>
      <p>{{ chat.interactions[chat.interactions.length - 1].message }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  chats: {
    type: Array,
    required: true
  }
});
</script>

<style scoped>
.chat-item {
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}
</style>