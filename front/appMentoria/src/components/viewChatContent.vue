<template>
  <div class="flex flex-col h-screen max-h-[800px]">
    <div class="flex sm:items-center justify-between py-2 border-b-2 border-gray-200">
      <div class="relative flex items-center space-x-4">
        <div class="relative ps-5">
          <img 
            :src="'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcT-fqsDjRDNUc9JjY89DKQNtvDO9XC6N2Mt1o3jVsINCrclE8GfaCVYVHlugZavO2EdyqoYp6sIZmBIAvDU2KYogQ'" 
            alt="" 
            class="w-10 sm:w-16 h-10 sm:h-16 rounded-full"
          >
        </div>
        <div class="flex flex-col leading-tight">
          <div class="text-2xl mt-1 flex items-center">
            <span class="text-gray-700 mr-3">{{ userName }}</span>
          </div>
          <span class="text-lg text-gray-600">Junior Developer</span>
        </div>
      </div>
    </div>

    <div id="messages" ref="messageContainer" class="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex-grow">
      <div 
        v-for="(interaction, index) in interactions" 
        :key="index" 
        class="chat-message"
      >
        <div :class="interaction.userId === currentUser ? 'flex items-end justify-end' : 'flex items-end'">
          <div 
            :class="interaction.userId === currentUser ? 'flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end' : 'flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start'"
          >
            <div>
              <span 
                :class="interaction.userId === currentUser ? 'px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white' : 'px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600'"
              >
              <p>{{ interaction.message }}</p>
              <p><small>{{ interaction.timestamp }}</small></p>
              </span>
            </div>
          </div>
          <img 
            :src="interaction.avatar || 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcT-fqsDjRDNUc9JjY89DKQNtvDO9XC6N2Mt1o3jVsINCrclE8GfaCVYVHlugZavO2EdyqoYp6sIZmBIAvDU2KYogQ'" 
            alt="Profile" 
            class="w-6 h-6 rounded-full" 
            :class="interaction.userId === currentUser ? 'order-2' : 'order-1'"
          >
        </div>
      </div>
    </div>

    <div class="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
      <div class="relative flex">
        <input 
          ref="messageInput"
          type="text" 
          placeholder="Write your message!" 
          class="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-5 pr-20 bg-gray-200 rounded-md py-3"
        >
        <div class="absolute right-0 items-center inset-y-0 flex">
            <button @click="sendMessageInMongo" type="button" class="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none mr-4">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#999999"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20.7639 12H10.0556M3 8.00003H5.5M4 12H5.5M4.5 16H5.5M9.96153 12.4896L9.07002 15.4486C8.73252 16.5688 8.56376 17.1289 8.70734 17.4633C8.83199 17.7537 9.08656 17.9681 9.39391 18.0415C9.74792 18.1261 10.2711 17.8645 11.3175 17.3413L19.1378 13.4311C20.059 12.9705 20.5197 12.7402 20.6675 12.4285C20.7961 12.1573 20.7961 11.8427 20.6675 11.5715C20.5197 11.2598 20.059 11.0295 19.1378 10.5689L11.3068 6.65342C10.2633 6.13168 9.74156 5.87081 9.38789 5.95502C9.0808 6.02815 8.82627 6.24198 8.70128 6.53184C8.55731 6.86569 8.72427 7.42461 9.05819 8.54246L9.96261 11.5701C10.0137 11.7411 10.0392 11.8266 10.0493 11.9137C10.0583 11.991 10.0582 12.069 10.049 12.1463C10.0387 12.2334 10.013 12.3188 9.96153 12.4896Z" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
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

<script>
import io from 'socket.io-client';

let chatData = {};

const userId = "111111";

export default {
  props: ['chatId'],
  data() {
    return {
      socket: null,
      userName: 'User',
      interactions: [],
      currentUser: userId
    };
  },
  mounted() {
    this.socket = io('http://localhost:3004');
    this.socket.on('receiveMessage', (newMessage) => {
      this.interactions.push(newMessage);
      this.scrollToBottom();
    });
    this.fetchMessages();
  },
  methods: {
    async fetchMessages() {
      console.log('http://localhost:3004/getChat/' + this.$parent.selectedChatId);
      try {
        const response = await fetch(`http://localhost:3004/getChat/${this.chatId}`);
        console.log(`http://localhost:3004/getChat/${this.chatId}`);
        const data = await response.json();
        chatData = data[0];
        this.userName = chatData.user_one_name || 'User';
        this.interactions = chatData.interactions.map((interaction) => ({
          message: interaction.message,
          userId: interaction.userId
        }));
        console.log('Interactions:', this.interactions);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    },
    async sendMessageInMongo() {
      console.log(this.$refs.messageInput.value);

      const newMessage = {
        message: this.$refs.messageInput.value,
        userId: this.currentUser,
        timestamp: new Date().toISOString()
      };
      
      // if (chatData) {
      //   chatData.interactions.push(newMessage);
      //   console.log('Chat data:', chatData);
      // }
      
      try {
        await fetch('http://localhost:3004/addChat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(chatData)
        });
        this.$refs.messageInput.value = '';
        this.scrollToBottom();
        this.socket.emit('sendMessage', {
          chatId: chatData._id,
          userId: this.currentUser,
          message: newMessage.message
        });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    },
    scrollToBottom() {
      const container = this.$refs.messageContainer;
      container.scrollTop = container.scrollHeight;
    }
  },
  updated() {
    this.scrollToBottom();
  }
};
</script>