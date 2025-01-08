<template>
  <div>
    <div v-if="chats.length === 0 && chatsInfo" class="flex items-center justify-center h-full">
      <p class="text-gray-500">No hi tens chats</p>
    </div>
    <div v-if="!chatsInfo" class="flex items-center justify-center h-full">
      <p class="text-gray-500">Error</p>
    </div>
    <div v-else class="overflow-auto">
      <ViewChat :chats="chats" />
      <div class="h-20"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ViewChat from '@/components/viewInfoChat.vue';
import socket from '../services/sockets.js';
const chatsUrl = import.meta.env.VITE_CHATS_URL;
const userId = "111111";

const chats = ref([]);
const chatsInfo = ref(false);

const fetchChats = async () => {
  try {
    const response = await fetch(`${chatsUrl}getChats/${userId}`);
    const data = await response.json();
    chats.value = data;
    chatsInfo.value = true;
  } catch (err) {
    console.error('Error al obtener los chats', err);
    chatsInfo.value = false;
  }
};

onMounted(() => {
  socket.on('receiveMessage', fetchChats);
  fetchChats();
});
</script>
