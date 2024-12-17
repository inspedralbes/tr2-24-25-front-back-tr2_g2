<script setup>
import { RouterLink, RouterView } from 'vue-router'
// import { ref, onMounted } from 'vue';

// // Estado del modo oscuro
// const isDarkMode = ref(false); 

// // Función para alternar el modo oscuro 
// const toggleDarkMode = () => { 
//   isDarkMode.value = !isDarkMode.value; 
//   document.documentElement.classList.toggle('dark', isDarkMode.value); 
// }; 
// // Recupera el estado del modo oscuro al montar el componente (opcional) 
// onMounted(() => { 
//   isDarkMode.value = document.documentElement.classList.contains('dark'); 
// });
</script>

<template>
  <div id="app" :class="darkMode ? 'dark' : ''">
  <!-- <button @click="toggleDarkMode">a</button> -->
    <RouterView />
  </div>
</template>

<style scoped></style>
