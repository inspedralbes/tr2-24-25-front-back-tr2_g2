<template>
  <div>
    <div v-if="chats.length === 0">Cargando chats...</div>
    <div v-else class="max-h-[800px] overflow-auto">
      <ViewChat :chats="chats" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ViewChat from '@/components/viewInfoChat.vue';

const chatsUrl = import.meta.env.VITE_CHATS_URL;

const chats = ref([]);

const fetchChats = async () => {
  console.log(chatsUrl + 'getChats');
  try {
    const response = await fetch(chatsUrl + 'getChats');
    const data = await response.json();
    console.log('datos:', data);
    chats.value = data;
  } catch (err) {
    console.error('Error al obtener los chats', err);
  }
};
onMounted(fetchChats);
</script>