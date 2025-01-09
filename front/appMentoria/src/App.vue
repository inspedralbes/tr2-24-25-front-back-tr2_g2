<script setup>
import { RouterView } from 'vue-router'
import { ref, onMounted } from 'vue';
import { useAppStore } from '@/stores/index';
import router from '@/router';

const isDarkMode = ref(false);

function validateLogin() {
  console.log('hola token pinia:', useAppStore().getToken());
  console.log('hola user pinia:', useAppStore().getUser());
  if (!useAppStore().getToken() || !useAppStore().getUser()) {
    console.log('no hay token o user');
    router.push({ name: 'login' });
  }
}

onMounted(() => { 
  const darkModePreference = localStorage.getItem('darkMode'); 
  if (darkModePreference == 'enabled') { 
    isDarkMode.value = true; 
    document.documentElement.classList.add('dark'); 
  } else { 
    isDarkMode.value = false; 
    document.documentElement.classList.remove('dark'); 
  } 

  validateLogin();
});
</script>

<template>
  <div id="app" :class="darkMode ? 'dark' : ''">
    <RouterView class="bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"/>
  </div>
</template>

<style scoped></style>
