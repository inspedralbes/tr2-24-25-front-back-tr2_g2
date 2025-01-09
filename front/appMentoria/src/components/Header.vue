<template>
  <header>
    <nav class="bg-blue-700 border-blue-700 px-4 lg:px-6 py-2.5 dark:bg-blue-800">
      <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
        <div class="flex-1 flex justify-center">
          <div class="flex items-center space-x-5 lg:space-x-40">
            <tempate v-if="isAdminPage">
              <div class="flex space-x-10 lg:space-x-40">
                <a @click="$router.push('/report')"
              class="text-white hover:text-gray-200 font-medium text-sm lg:text-base">
                Report
              </a>
              <a @click="$router.push('/validation')"
                class="text-white hover:text-gray-200 font-medium text-sm lg:text-base">
                Validation
              </a>
              </div>
            </tempate>
            <template v-else>
              <a @click="$router.push('/')" class="text-white hover:text-gray-200 font-medium text-sm lg:text-base">
                Comunitat
              </a>
              <a @click="$router.push('/profilesPage')"
                class="text-white hover:text-gray-200 font-medium text-sm lg:text-base">
                Mentors
              </a>
              <a href="#" class="text-white hover:text-gray-200 font-medium text-sm lg:text-base">
                Peticions
              </a>
            </template>
            <SubMenu></SubMenu>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import SubMenu from './SubMenu.vue';

const route = useRoute();


const isAdminPage = computed(() => {
  return route.path.startsWith('/admin');
});
</script>