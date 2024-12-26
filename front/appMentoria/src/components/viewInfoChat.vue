<template>
  <div>
    <div v-for="chat in chats" :key="chat.id" class="chat-item">
      <div style="display: flex; align-items: center;">
        <img 
          :src="'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcT-fqsDjRDNUc9JjY89DKQNtvDO9XC6N2Mt1o3jVsINCrclE8GfaCVYVHlugZavO2EdyqoYp6sIZmBIAvDU2KYogQ'" 
          alt="" 
          class="w-10 sm:w-16 h-10 sm:h-16 rounded-full"
        >
        <div style="margin-left: 1rem;">
          <h3>{{ chat.user_one_id }}</h3>
          <p v-if="chat.interactions && chat.interactions.length > 0 && chat.interactions[chat.interactions.length - 1].message !== null">
        {{ chat.interactions[chat.interactions.length - 1].message }}
          </p>
        </div>
      </div>
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