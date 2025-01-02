<template>
  <div>
    <div v-if="chats.length === 0">Cargando chats...</div>
    <div v-else class="overflow-auto">
      <ViewChat :chats="chats" />
      <div class="h-20"></div>
    </div>
  </div>
</template>

<script setup>
import io from 'socket.io-client';
import { ref, onMounted } from 'vue';
import ViewChat from '@/components/viewInfoChat.vue';

const chatsUrl = import.meta.env.VITE_CHATS_URL;

const userId = "111111";

const chats = ref([]);

const fetchChats = async () => {
  console.log(chatsUrl + 'getChats' + "/" + userId);
  try {
    const response = await fetch(chatsUrl + 'getChats' + "/" + userId);
    const data = await response.json();
    console.log('datos:', data);
    chats.value = data;
  } catch (err) {
    console.error('Error al obtener los chats', err);
  }
};

onMounted(() => {
  const socket = io('http://localhost:3004');
  socket.on('receiveMessage', (newMessage) => {
    fetchChats();
  });
});
onMounted(fetchChats);
</script>