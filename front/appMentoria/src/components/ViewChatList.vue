<template>
  <div>
    <div
      v-if="chats.length === 0 && chatsInfo"
      class="flex items-center justify-center h-full"
    >
      <p class="text-gray-500">No hi tens chats</p>
    </div>
    <div v-if="!chatsInfo" class="flex items-center justify-center h-full">
      <p class="text-gray-500">Error</p>
    </div>
    <div v-else class="overflow-auto">
      <ViewChat :chats="chats" :users="users" />
      <div class="h-20"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import ViewChat from "@/components/viewInfoChat.vue";
import socketChat from "../services/socketChat";
import { useAppStore } from "@/stores/index";
import { getUsers, fetchChats } from "../services/communicationManager";

const users = ref([]);
const chats = ref([]);
const chatsInfo = ref(false);

const myUser = useAppStore().getUser();
const userId = myUser.id;

const fetchChatsNow = async (userId) => {
  try {
    const result = await fetchChats(userId);
    chats.value = result.chats;
    chatsInfo.value = result.chatsInfo;
  } catch (error) {}
};

onMounted(async () => {
  users.value = await getUsers();
  socketChat.on("receiveMessage", async (newMessage) => {
    await fetchChatsNow(userId);
  });
  await fetchChatsNow(userId);
});

watch(chats, (newChats) => {
  console.log("Chats actualizados", newChats);
});
</script>
