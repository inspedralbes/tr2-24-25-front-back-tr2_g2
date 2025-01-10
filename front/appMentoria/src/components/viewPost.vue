<template>
    <div>
      <div v-for="post in posts" :key="post.id" class="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-6">
        <div v-if="post.reports === 0">
          <header class="flex items-center p-4 border-b">
            <img :src="getAuthorProfile(post.user_id)" alt="Avatar" class="w-12 h-12 rounded-full mr-4" />
            <div>
              <h2 class="font-bold text-lg">{{ getAuthorName(post.user_id) }}</h2>
              <p class="text-gray-500 text-sm">{{ getAuthorHandle(post.user_id) }} · fa {{ timeSince(post.created_at) }}</p>
            </div>
          </header>

          <main class="p-4 space-y-4">
              <h1 class="text-xl font-bold">{{ post.title }}</h1>
              <p class="text-gray-800 text-lg whitespace-pre-line">
              {{ post.description }}
              </p>

            <div v-if="post.image != null" class="rounded-lg overflow-hidden">
              <img :src="post.image" alt="Post Image" class="w-full" />
            </div>
          </main>

          <footer class="p-4 border-t">
            <div class="flex justify-around text-gray-500">
              <button class="flex items-center space-x-1 hover:text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                </svg>
                <span>{{ post.reports }}</span>
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, defineProps } from 'vue';
  import { getUsers } from '../services/communicationManager';

  const authorAvatar = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/RETRATO_DEL_GRAL._FRANCISCO_FRANCO_BAHAMONDE_%28adjusted_levels%29.jpg/220px-RETRATO_DEL_GRAL._FRANCISCO_FRANCO_BAHAMONDE_%28adjusted_levels%29.jpg';

  const users = ref([]);

  const props = defineProps({
    posts: Array
  });

  const getAuthorName = (userId) => {
    const user = users.value.find(user => user.id === userId);
    return user ? user.name : 'Unknown';
  };  

  const getAuthorHandle = (userId) => {
    const user = users.value.find(user => user.id === userId);
    return user ? user.id : 'Unknown';
  };  

  const getAuthorProfile = (userId) => {
    const user = users.value.find(user => user.id === userId);
    return user && user.profile ? user.profile : authorAvatar;
  };


  function timeSince(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = [
      { label: 'anys', seconds: 31536000 },
      { label: 'mesos', seconds: 2592000 },
      { label: 'dies', seconds: 86400 },
      { label: 'hores', seconds: 3600 },
      { label: 'minuts', seconds: 60 },
      { label: 'segons', seconds: 1 }
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}`;
      }
    }
    return 'ara mateix';
  }

  onMounted(async () => {
    users.value = await getUsers();
  });
  </script>