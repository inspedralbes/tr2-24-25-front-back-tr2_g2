<template>
    <div>
      <div v-for="post in posts" :key="post.id" class="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-6">
        <header class="flex items-center p-4 border-b">
          <img :src="post.authorAvatar" alt="Avatar" class="w-12 h-12 rounded-full mr-4" />
          <div>
            <h2 class="font-bold text-lg">{{ post.authorName }}</h2>
            <p class="text-gray-500 text-sm">@{{ post.authorHandle }} · {{ post.postDate }}</p>
          </div>
        </header>
  
        <main class="p-4 space-y-4">
          <p class="text-gray-800 text-lg whitespace-pre-line">
            {{ post.postContent }}
          </p>
  
          <div v-if="post.postImage" class="rounded-lg overflow-hidden">
            <img :src="post.postImage" alt="Post Image" class="w-full" />
          </div>
        </main>
  
        <footer class="p-4 border-t">
          <div class="flex justify-around text-gray-500">
            <button class="flex items-center space-x-1 hover:text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
              </svg>
              <span>{{ post.comments }}</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  const props = defineProps({
    posts: Array
  });
  </script>