<template>
    <ViewPost :posts="posts" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ViewPost from '@/components/viewPost.vue';

const posts = ref([]);

const fetchPosts = async () => {
  try {
    const response = await fetch('/posts.json');
    if (!response.ok) {
      throw new Error('Error al obtener los posts');
    }
    const data = await response.json();
    console.log('datos:', data); 
    posts.value = data;
  } catch (err) {
    console.error('Error al obtener los posts'); 
  }
};

onMounted(fetchPosts);
</script>