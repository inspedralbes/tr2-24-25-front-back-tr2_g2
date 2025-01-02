<template>
  <div>
    <div v-if="selectedChatId === false" v-for="chat in chats" :key="chat.id" class="chat-item overflow-y-auto">
      <div style="display: flex; align-items: center;">
        <img 
          :src="'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcT-fqsDjRDNUc9JjY89DKQNtvDO9XC6N2Mt1o3jVsINCrclE8GfaCVYVHlugZavO2EdyqoYp6sIZmBIAvDU2KYogQ'" 
          alt="" 
          class="w-10 sm:w-16 h-10 sm:h-16 rounded-full"
        >
        <div style="margin-left: 1rem;" @click="selectChat(chat._id)">
          <h3>{{ chat.user_one_id }}</h3>
          <p v-if="chat.interactions && chat.interactions.length > 0 && chat.interactions[chat.interactions.length - 1].message !== null">
            {{ chat.interactions[chat.interactions.length - 1].message }}
          </p>
        </div>
      </div>
    </div>
    <viewChatContent v-if="selectedChatId !== false" :chatId="selectedChatId" @closeChat="selectedChatId = false" class="overlay" />
  </div>
</template>

  <script setup>
  
  import { ref, onMounted } from 'vue';
  import { defineProps } from 'vue';
  import viewChatContent from './viewChatContent.vue';

  const props = defineProps({
    chats: {
    type: Array,
    required: true
    }
  });

  const selectedChatId = ref(false);

  console.log('selectedChatId:', selectedChatId.value);


  const selectChat = (chatId) => {
    selectedChatId.value = chatId;
    console.log('selectedChatId:', selectedChatId.value);
  };

  onMounted(() => {
    selectedChatId.value = false;
  });

  </script>

  <style scoped>
  .chat-item {
    margin-bottom: 1rem;
    padding: 1rem;
    border: 1px solid #ccc;
    scriptder-radius: 8px;
    cursor: pointer;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: white;
    z-index: 10;
  }
  </style>style