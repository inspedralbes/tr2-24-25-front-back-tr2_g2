<template>
    <div class="flex flex-col min-h-screen">
      <div class="h-20"></div>
      <Header class="fixed top-0 left-0 right-0 z-10"></Header>
      <main>
        <ViewChatContent></ViewChatContent>
      </main>
      <NavBar class="fixed bottom-0 left-0 right-0 z-10"></NavBar>
      <div class="h-20"></div> <!-- This div ensures nothing is placed below the NavBar -->
    </div>
  </template>
  
  <script setup>
  import Header from '@/components/Header.vue';
  import ViewChatContent from '@/components/viewChatContent.vue';
  import NavBar from '@/components/NavBar.vue';
  </script>