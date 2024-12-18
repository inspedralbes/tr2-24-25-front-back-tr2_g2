<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted } from 'vue';
import ToggleDarkMode from './components/ToggleDarkMode.vue';

const isDarkMode = ref(false);

onMounted(() => { 
  const darkModePreference = localStorage.getItem('darkMode'); 
  if (darkModePreference == 'enabled') { 
    isDarkMode.value = true; 
    document.documentElement.classList.add('dark'); 
  } else { 
    isDarkMode.value = false; 
    document.documentElement.classList.remove('dark'); 
  } 
});
</script>

<template>
  <div id="app" :class="darkMode ? 'dark' : ''">
    <RouterView class="bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"/>
  </div>
</template>

<style scoped></style>
