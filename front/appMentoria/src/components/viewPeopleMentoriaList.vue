<template>
    <div class="px-4 lg:px-40 py-8">
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <view-people-mentoria v-for="user in users" :key="user.id" :user="user" />
        </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import ViewPeopleMentoria from '@/components/viewPeopleMentoria.vue';
  
  const users = ref([]);
  
  const fetchUsers = async () => {
    try {
      const response = await fetch('/users.json');
      if (!response.ok) {
        throw new Error('Error al obtener los usuarios');
      }
      const data = await response.json();
      users.value = data;
    } catch (err) {
      console.error('Error al obtener los usuarios'); 
    }
  };
  
  onMounted(fetchUsers);
  </script>