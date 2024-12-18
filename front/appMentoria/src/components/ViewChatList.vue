<template>
  <div>
    <div v-if="chats.length === 0">Cargando chats...</div>
    <div v-else>
      <ViewChat :chats="chats" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ViewChat from '@/components/viewInfoChat.vue';

const chats = ref([]);

const fetchChats = async () => {
  try {
    const response = await fetch('/chatDataExample.json');
    if (!response.ok) {
      throw new Error('Error al obtener los chats');
    }
    const data = await response.json();
    console.log('datos:', data); 
    chats.value = data;
  } catch (err) {
    console.error('Error al obtener los chats', err); 
  }
};

onMounted(fetchChats);
</script>