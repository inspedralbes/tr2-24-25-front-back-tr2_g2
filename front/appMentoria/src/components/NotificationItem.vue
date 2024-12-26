<template>
    <li class="flex items-center p-4 hover:bg-gray-100 cursor-pointer">
      <div class="flex-shrink-0">
        <img :src="avatar" alt="Avatar" class="w-10 h-10 rounded-full" />
      </div>
      <div class="ml-3 flex-1">
        <p class="text-sm font-semibold text-gray-800">{{ name }}</p>
        <p class="text-sm text-gray-600">{{ message }}</p>
      </div>
      <button
        class="ml-auto text-gray-400 hover:text-red-600"
        @click="$emit('remove')"
      >
        <i class="fas fa-times"></i>
      </button>
    </li>
  </template>
  
  <script>
  export default {
    props: {
      name: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      avatar: {
        type: String,
        required: true,
      },
      icon: {
        type: String,
        required: false,
      },
    },
  };
  </script>
  
  <style>
  @import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css";
  </style>
  