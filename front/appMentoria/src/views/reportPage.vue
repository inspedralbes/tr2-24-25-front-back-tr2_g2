<template>
    <Header class="fixed top-0 left-0 right-0 z-10"></Header>
    <div class="flex-grow mt-20 mb-40">
        <viewReport></viewReport>
    </div>
    <NavBar></NavBar>
</template>

<script setup>
import Header from '@/components/Header.vue';
import NavBar from '@/components/NavBar.vue';
import viewReport from '@/components/viewReport.vue';
</script>