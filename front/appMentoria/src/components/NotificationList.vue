<template>
  <div class="flex flex-col p-6">
    <div class="relative w-full max-w-md mx-auto bg-white shadow-md rounded-lg">
      <div class="p-4 border-b flex justify-between items-center">
        <h2 class="text-lg font-semibold text-gray-700">Notificacions</h2>
        <div class="flex space-x-2">
          <button
            class="px-3 py-1 text-sm bg-gray-200 rounded-md"
            :class="{ 'bg-gray-400': filter === 'all' }"
            @click="filter = 'all'"
          >
            Totes
          </button>
          <button
            class="px-3 py-1 text-sm bg-blue-200 rounded-md"
            :class="{ 'bg-blue-400': filter === 'chat' }"
            @click="filter = 'chat'"
          >
            Missatges
          </button>
          <button
            class="px-3 py-1 text-sm bg-red-200 rounded-md"
            :class="{ 'bg-red-400': filter === 'report' }"
            @click="filter = 'report'"
          >
            Reportes
          </button>
        </div>
      </div>
      <ul class="divide-y divide-gray-200">
        <NotificationItem
          v-for="notification in filteredNotifications"
          :key="notification.id"
          :name="notification.type"
          :message="notification.description"
          :icon="notification.icon"
          :type="notification.type"
          @remove="removeNotification(notification.id)"
          @markAsRead="markAsRead(notification.id)"
        />
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import NotificationItem from "./NotificationItem.vue";

const notifications = ref([]);
const filter = ref("all");

// Fetch notifications from the server
const fetchNotifications = async () => {
  try {
    const response = await fetch("/notifications.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const rawNotifications = await response.json();

    // Map data from the database to a more readable format
    notifications.value = rawNotifications.map((n) => ({
      id: n.id,
      description: n.description,
      type: getNotificationType(n),
      icon: getNotificationIcon(getNotificationType(n)),
      revised: n.revised,
    }));
  } catch (error) {
    console.error("Error loading notifications:", error);
  }
};

// Determine notification type based on database fields
const getNotificationType = (notification) => {
  if (notification.chat_id) return "chat";
  if (notification.report_id) return "report";
  if (notification.publication_id) return "publication";
  if (notification.comment_id) return "comment";
  return "general";
};

// Map notification type to corresponding icon
const getNotificationIcon = (type) => {
  const icons = {
    chat: "📨",
    report: "🚨",
    publication: "📢",
    comment: "💬",
    general: "📌",
  };
  return icons[type] || "📌";
};

// Filter notifications based on the current filter
const filteredNotifications = computed(() => {
  if (filter.value === "all") return notifications.value;
  return notifications.value.filter((n) => n.type === filter.value);
});

// Remove a notification
const removeNotification = (id) => {
  notifications.value = notifications.value.filter((n) => n.id !== id);
};

// Mark a notification as read
const markAsRead = async (id) => {
  try {
    const response = await fetch(`/notifications/${id}/mark-as-read`, {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error("Failed to mark as read");
    }
    const notification = notifications.value.find((n) => n.id === id);
    if (notification) {
      notification.revised = true;
    }
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
};

onMounted(fetchNotifications);
</script>

<style scoped>
button.bg-gray-400 {
  background-color: #b0b0b0;
}
button.bg-blue-400 {
  background-color: #4a90e2;
}
button.bg-red-400 {
  background-color: #e74c3c;
}
</style>