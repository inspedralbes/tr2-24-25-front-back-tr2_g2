<template>
  <div class="flex flex-col h-screen dark:bg-neutral-900">
    <div
      class="flex sm:items-center justify-between py-2 border-b-2 border-gray-200"
    >
      <div class="relative flex items-center space-x-4">
        <div class="relative ps-5">
          <img
            :src="`${BACK_URL}${
              users.find((user) => user.id === userElla)?.profile
            }`"
            alt=""
            class="w-10 sm:w-16 h-10 sm:h-16 rounded-full"
          />
          <!-- <img
            :src="
              `${back_url}${
                users.find((user) => user._id === userElla)?.profile
              }` ||
              'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcT-fqsDjRDNUc9JjY89DKQNtvDO9XC6N2Mt1o3jVsINCrclE8GfaCVYVHlugZavO2EdyqoYp6sIZmBIAvDU2KYogQ'
            "
            alt=""
            class="w-10 sm:w-16 h-10 sm:h-16 rounded-full"
          /> -->
        </div>
        <div class="flex flex-col leading-tight">
          <div class="text-2xl mt-1 flex items-center">
            <span class="text-gray-700 mr-3 dark:text-white">{{
              users.find((user) => user.id === userElla)?.name
            }}</span>
          </div>
          <span class="text-lg text-gray-600 dark:text-white">{{
            users.find((user) => user.id === userElla)?.email.split("@")[0]
          }}</span>
        </div>
      </div>
      <div class="flex items-center space-x-2 pr-4">
        <button
          @click="$emit('closeChat')"
          type="button"
          class="inline-flex items-center justify-center rounded-lg h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 16 16"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M5 1H4L0 5L4 9H5V6H11C12.6569 6 14 7.34315 14 9C14 10.6569 12.6569 12 11 12H4V14H11C13.7614 14 16 11.7614 16 9C16 6.23858 13.7614 4 11 4H5V1Z"
                fill="currentColor"
              ></path>
            </g>
          </svg>
        </button>
      </div>
    </div>

    <div
      id="messages"
      ref="messageContainer"
      class="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex-grow h-full"
    >
      <div
        v-for="(interaction, index) in interactions"
        :key="index"
        class="chat-message"
      >
        <div
          :class="
            Number(interaction.userId) === currentUser
              ? 'flex items-end justify-end'
              : 'flex items-end'
          "
        >
          <div
            :class="
              Number(interaction.userId) === currentUser
                ? 'flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end'
                : 'flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start'
            "
          >
            <div>
              <span
                :class="
                  Number(interaction.userId) === currentUser
                    ? 'px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white'
                    : 'px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600'
                "
              >
                <p>{{ interaction.message }}</p>
                <p>
                  <small>{{ interaction.timestamp }}</small>
                </p>
              </span>
            </div>
          </div>
          <img
            :src="updateProfile(interaction.userId)"
            alt="Profile"
            class="w-6 h-6 rounded-full"
            :class="
              Number(interaction.userId) === currentUser ? 'order-2' : 'order-1'
            "
          />
        </div>
      </div>
    </div>

    <div class="border-t-2 border-gray-200 px-4 p-4 mb-2 sm:mb-0">
      <div class="relative flex">
        <input
          ref="messageInput"
          type="text"
          placeholder="Write your message!"
          class="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-5 pr-20 bg-gray-200 rounded-md py-3 dark:bg-gray-800 dark:text-white"
        />
        <div class="absolute right-0 items-center inset-y-0 flex">
          <button
            @click="sendMessageInMongoNow"
            type="button"
            class="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none mr-4"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="#999999"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M20.7639 12H10.0556M3 8.00003H5.5M4 12H5.5M4.5 16H5.5M9.96153 12.4896L9.07002 15.4486C8.73252 16.5688 8.56376 17.1289 8.70734 17.4633C8.83199 17.7537 9.08656 17.9681 9.39391 18.0415C9.74792 18.1261 10.2711 17.8645 11.3175 17.3413L19.1378 13.4311C20.059 12.9705 20.5197 12.7402 20.6675 12.4285C20.7961 12.1573 20.7961 11.8427 20.6675 11.5715C20.5197 11.2598 20.059 11.0295 19.1378 10.5689L11.3068 6.65342C10.2633 6.13168 9.74156 5.87081 9.38789 5.95502C9.0808 6.02815 8.82627 6.24198 8.70128 6.53184C8.55731 6.86569 8.72427 7.42461 9.05819 8.54246L9.96261 11.5701C10.0137 11.7411 10.0392 11.8266 10.0493 11.9137C10.0583 11.991 10.0582 12.069 10.049 12.1463C10.0387 12.2334 10.013 12.3188 9.96153 12.4896Z"
                  stroke="#999999"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </g>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.scrollbar-w-2::-webkit-scrollbar {
  width: 0.25rem;
  height: 0.25rem;
}

.scrollbar-track-blue-lighter::-webkit-scrollbar-track {
  --bg-opacity: 1;
  background-color: #f7fafc;
  background-color: rgba(247, 250, 252, var(--bg-opacity));
}

.scrollbar-thumb-blue::-webkit-scrollbar-thumb {
  --bg-opacity: 1;
  background-color: #edf2f7;
  background-color: rgba(237, 242, 247, var(--bg-opacity));
}

.scrollbar-thumb-rounded::-webkit-scrollbar-thumb {
  border-radius: 0.25rem;
}
</style>

<script setup>
import { ref, onMounted, defineProps, watch, nextTick } from "vue";
import {
  fetchMessages,
  sendMessageInMongo,
} from "@/services/communicationManager";
import socketChat from "../services/socketChat";

const props = defineProps({
  chatId: {
    type: String,
    required: true,
  },
  users: {
    type: Array,
    required: true,
  },
  userMio: {
    type: String,
    required: true,
  },
  userElla: {
    type: String,
    required: true,
  },
  BACK_URL: {
    type: String,
    required: true,
  },
});

const currentUser = props.userMio;
const userElla = props.userElla;
const users = ref(props.users);
const BACK_URL = props.BACK_URL;

const chatData = ref({});
const interactions = ref([]);

const messageContainer = ref(null);
const messageInput = ref(null);

const scrollToBottom = async () => {
  await nextTick();
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  }
};

const sendMessageInMongoNow = () => {
  const message = messageInput.value.value;
  if (message) {
    sendMessageInMongo(chatData.value, currentUser, message);
    messageInput.value.value = "";
  }
};

const updateProfile = (userId) => {
  const user = users.value.find((user) => user.id === userId);

  if (user && user.profile) {
    if (user.profile.startsWith("/")) {
      return `${BACK_URL}${user.profile}`;
    }
    return user.profile;
  }

  // Devuelve una imagen por defecto si no hay perfil
  return BACK_URL + "/upload/profile_default.png"; // Cambia esta URL a la que prefieras.
};

onMounted(async () => {
  scrollToBottom();
  socketChat.on("receiveMessage", (newMessage) => {
    interactions.value.push(newMessage);
    scrollToBottom();
  });
  chatData.value = await fetchMessages(props.chatId);
  interactions.value = chatData.value._rawValue.interactions;
  scrollToBottom();
});
watch(interactions, () => {
  scrollToBottom();
});
</script>