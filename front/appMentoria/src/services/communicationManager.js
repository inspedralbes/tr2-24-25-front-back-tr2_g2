import { ref } from 'vue';
import socket from './sockets';

const CHAT_URL = import.meta.env.VITE_CHATS_URL;

export const fetchMessages = async (chatId) => {
  try {
    const response = await fetch(`${CHAT_URL}getChat/${chatId}`);
    console.log(`${CHAT_URL}getChat/${chatId}`);
    const data = await response.json();
    const chatData = ref({});
    chatData.value = data[0];
    chatData.value.userName = chatData.value.user_one_name || 'User';
    chatData.value.interactions = chatData.value.interactions.map((interaction) => ({
      message: interaction.message,
      userId: interaction.userId,
      timestamp: interaction.timestamp
    }));
    console.log('chatData:', chatData.value);
    return chatData;
  } catch (error) {
    console.error('Error fetching messages:', error);
  }
};

export const sendMessageInMongo = async (chatData, currentUser, messageInput) => {
  console.log('sendMessageInMongo:', chatData, currentUser, messageInput);
  const newMessage = {
    message: messageInput,
    userId: currentUser,
    timestamp: new Date().toISOString()
  };

  try {
    await fetch(`${CHAT_URL}addChat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(chatData)
    });
    if (typeof messageInput === 'object' && messageInput !== null) {
      messageInput.value = ''; // Clear the input if it's an object
    }
    socket.emit('sendMessage', {
      chatId: chatData._id,
      userId: currentUser,
      message: newMessage.message
    });
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

export const fetchChats = async (userId) => {

  const chats = ref([]);
  const chatsInfo = ref(false);
  
  try {
    const response = await fetch(`${CHAT_URL}getChats/${userId}`);
    const data = await response.json();
    chats.value = data;
    chatsInfo.value = true;
  } catch (err) {
    console.error('Error al obtener los chats', err);
    chatsInfo.value = false;
  }
  return { chats: chats.value, chatsInfo: chatsInfo.value };
};