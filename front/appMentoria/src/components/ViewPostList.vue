<template>
    <ViewPost :posts="posts" :users="users" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ViewPost from '@/components/viewPost.vue';
import { getCommunityPublication, getUsers } from '../services/communicationManager';

const posts = ref([]);
const users = ref([]);


const fetchPosts = async () => {
  try {
    posts.value = await getCommunityPublication();
    console.log("post", posts.value);
  } catch (err) {
    console.error('Error al obtener los posts'); 
  }
};

const fetchUsers = async () => {
  try {
    users.value = getUsers();
  } catch (err) {
    console.error('Error al obtener los users'); 
  }
  console.log("users" + users.value);
};

onMounted(() => {
  fetchPosts();
  fetchUsers();
});
</script>