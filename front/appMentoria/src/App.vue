<script setup>
import { RouterView } from 'vue-router'
import { ref, onMounted } from 'vue';
import { useAppStore } from '@/stores/index';
import router from '@/router';

const isDarkMode = ref(false);

function validateLogin() {
  console.log('hola token local:', localStorage.getItem('token'));
  console.log('hola user local:', localStorage.getItem('user'));

  if (!localStorage.getItem('token') && !localStorage.getItem('user')) {
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
    <RouterView class="bg-slate-200 dark:bg-neutral-800 text-gray-900 dark:text-white"/>
  </div>
</template>

<style scoped></style>
