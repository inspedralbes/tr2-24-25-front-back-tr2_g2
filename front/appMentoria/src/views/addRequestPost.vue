<template>
    <div class="flex flex-col min-h-screen">
      <Header class="fixed top-0 left-0 right-0 z-10"></Header>
      <main class="flex-grow mt-16 mb-60">
        <RequestPost></RequestPost>
      </main>
    </div>
  </template>



<script setup>

import RequestPost from '@/components/RequestPost.vue';
import Header from '@/components/Header.vue';

</script>