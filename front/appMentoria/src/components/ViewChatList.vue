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
const userId = "111111";

import { fetchChats } from '@/services/communicationManager';

const chats = ref([]);
const chatsInfo = ref(false);

onMounted(() => {
  socket.on('receiveMessage', () => fetchChatsNow(userId));
  fetchChatsNow(userId);
});

const fetchChatsNow = async (userId) => {
  try {
    const result = await fetchChats(userId);
    chats.value = result.chats;
    chatsInfo.value = result.chatsInfo;
    console.log(chats.value);
  } catch (error) {
    console.log(error);
  }
};
</script>
