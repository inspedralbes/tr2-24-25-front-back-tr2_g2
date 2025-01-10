<template>
  <div>
    <div v-if="selectedPost" class="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-6 dark:bg-gray-900">
      <button @click="goMain" class="py-2 px-4 fixed top-0 left-0 mt-3 ml-4 z-20">
      <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 1H4L0 5L4 9H5V6H11C12.6569 6 14 7.34315 14 9C14 10.6569 12.6569 12 11 12H4V14H11C13.7614 14 16 11.7614 16 9C16 6.23858 13.7614 4 11 4H5V1Z" fill="#ffffff"></path> </g></svg>
    </button>
      <div v-if="selectedPost.reports === 0">
        <header class="flex items-center p-4 border-b">
          <img :src="getAuthorProfile(selectedPost.user_id)" alt="Avatar" class="w-12 h-12 rounded-full mr-4" />
          <div>
            <h2 class="font-bold text-lg">{{ getAuthorName(selectedPost.user_id) }}</h2>
            <p class="text-gray-500 text-sm dark:text-white">{{ getAuthorHandle(selectedPost.user_id) }} · fa {{ timeSince(selectedPost.created_at) }}</p>
          </div>
        </header>

        <main class="p-4 space-y-4">
          <h1 class="text-xl font-bold">{{ selectedPost.title }}</h1>
          <p class="text-gray-800 text-lg whitespace-pre-line dark:text-gray-300">{{ selectedPost.description }}</p>

          <div v-if="selectedPost.image != null" class="rounded-lg overflow-hidden">
            <img :src="selectedPost.image" alt="Post Image" class="w-full" />
          </div>
        </main>

        <footer class="p-4 border-t">
          <div class="flex justify-around text-gray-500 dark:text-gray-300">
            <button class="flex items-center space-x-1 hover:text-gray-500" @click="showPostWithComments(selectedPost)">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
              </svg>
              <span>{{ getCommentsWithPostId(selectedPost.id).length }}</span>
            </button>
          </div>
        </footer>
      </div>
      <div class="p-4">
        <h3 class="text-lg font-bold">Comments</h3>
        <ul>
          <li v-for="comment in getCommentsWithPostId(selectedPost.id)" :key="comment.id" class="border-b py-2">
            {{ comment.comment }}
          </li>
        </ul>
      </div>
    </div>

    <div v-else>
      <div v-for="post in posts" :key="post.id" class="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-6 dark:bg-gray-900">
        <div v-if="post.reports === 0">
          <header class="flex items-center p-4 border-b">
            <img :src="getAuthorProfile(post.user_id)" alt="Avatar" class="w-12 h-12 rounded-full mr-4" />
            <div>
              <h2 class="font-bold text-lg">{{ getAuthorName(post.user_id) }}</h2>
              <p class="text-gray-500 text-sm dark:text-white">{{ getAuthorHandle(post.user_id) }} · fa {{ timeSince(post.created_at) }}</p>
            </div>
          </header>

          <main class="p-4 space-y-4">
            <h1 class="text-xl font-bold">{{ post.title }}</h1>
            <p class="text-gray-800 text-lg whitespace-pre-line dark:text-gray-300">
              {{ post.description }}
            </p>

            <div v-if="post.image != null" class="rounded-lg overflow-hidden">
              <img :src="post.image" alt="Post Image" class="w-full" />
            </div>
          </main>

          <footer class="p-4 border-t">
            <div class="flex justify-around text-gray-500 dark:text-gray-300">
              <button class="flex items-center space-x-1 hover:text-gray-500" @click="showPostWithComments(post)">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                </svg>
                <span>{{ getCommentsWithPostId(post.id).length }}</span>
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
  import { ref, onMounted, defineProps } from 'vue';
  import { getUsers, getCommunityComments } from '../services/communicationManager';


  const authorAvatar = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/RETRATO_DEL_GRAL._FRANCISCO_FRANCO_BAHAMONDE_%28adjusted_levels%29.jpg/220px-RETRATO_DEL_GRAL._FRANCISCO_FRANCO_BAHAMONDE_%28adjusted_levels%29.jpg';

  const users = ref([]);
  const comments = ref([]);
  const commentsWithPostId = ref([]);
  const selectedPost = ref(null);

  const viewPost = ref({});

  const props = defineProps({
    posts: Array
  });

  const getAuthorName = (userId) => {
    const user = users.value.find(user => user.id === userId);
    return user ? user.name : 'Unknown';
  };  

  const getAuthorHandle = (userId) => {
    const user = users.value.find(user => user.id === userId);
    return user ? user.email.split('@')[0] : 'Unknown';
  };  

  const getAuthorProfile = (userId) => {
    const user = users.value.find(user => user.id === userId);
    return user && user.profile ? user.profile : authorAvatar;
  };

  const getCommentsWithPostId = (postId) => {
    console.log(comments.value.filter(comment => comment.post_id === postId));
    return comments.value.filter(comment => comment.publication_id === postId);
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

  const showPostWithComments = (post) => {
    selectedPost.value = post;
  };

  function goMain() {
    selectedPost.value = null;
  }

  onMounted(async () => {
    users.value = await getUsers();
    comments.value = await getCommunityComments();
    console.log("comments", comments.value);
  });
  </script>