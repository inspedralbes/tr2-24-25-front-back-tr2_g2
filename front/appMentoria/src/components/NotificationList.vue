<template>
     <Header class="fixed top-0 left-0 right-0 z-10 py-5"></Header>
    <div class="flex flex-col p-6">
        <div class="relative w-full max-w-md mx-auto bg-white shadow-md rounded-lg">
      <div class="p-4 border-b">
        <h2 class="text-lg font-semibold text-gray-700">Notificacions</h2>
      </div>
      <ul class="divide-y divide-gray-200">
        <NotificationItem
          v-for="(notification, index) in notifications"
          :key="index"
          :name="notification.name"
          :message="notification.message"
          :avatar="notification.avatar"
          :icon="notification.icon"
          @remove="removeNotification(index)"
        />
      </ul>
    </div>
    </div>
  </template>
  
  <script>
  import NotificationItem from "./NotificationItem.vue";
  
  export default {
    components: {
      NotificationItem,
    },
    data() {
      return {
        notifications: [],
      };
    },
    async mounted() {
      try {
        const response = await fetch("/notifications.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        this.notifications = await response.json();
      } catch (error) {
        console.error("Error loading notifications:", error);
      }
    },
    methods: {
      removeNotification(index) {
        this.notifications.splice(index, 1);
      },
    },
  };
  </script>
  