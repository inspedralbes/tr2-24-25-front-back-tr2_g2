<template>
    <ViewPost :posts="posts" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ViewPost from '@/components/viewPost.vue';
import { getCommunityPublication, getUsers } from '../services/communicationManager';

const posts = ref([]);


const fetchPosts = async () => {
  try {
    posts.value = await getCommunityPublication();
    console.log("post", posts.value);
  } catch (err) {
    console.error('Error al obtener los posts'); 
  }
};

onMounted(() => {
  fetchPosts();
});
</script>