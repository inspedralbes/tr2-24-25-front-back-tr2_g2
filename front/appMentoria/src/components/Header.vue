
<template>
    <header>
      <nav class="bg-blue-700 border-blue-700 px-4 lg:px-6 py-2.5 dark:bg-blue-800">
        <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <div class="flex-1 flex justify-center">
            <div class="flex items-center space-x-5 lg:space-x-40">
              <a href="#" class="text-white hover:text-gray-200 font-medium text-sm lg:text-base">
                Comunitat
              </a>
              <a href="#" class="text-white hover:text-gray-200 font-medium text-sm lg:text-base">
                Mentoria
              </a>
              <a href="#" class="text-white hover:text-gray-200 font-medium text-sm lg:text-base">
                Peticions
              </a>                
              <SubMenu></SubMenu>
            </div>
          </div>
        </div>
      </nav>
    </header>
</template>

<script setup>
import SubMenu from './SubMenu.vue';
</script>
  