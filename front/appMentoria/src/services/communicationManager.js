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
  const newMessage = {
    message: messageInput.value.value,
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
    messageInput.value.value = '';
    socket.value.emit('sendMessage', {
      socket,
      chatId: chatData._id,
      userId: currentUser,
      message: newMessage.message
    });
  } catch (error) {
    console.error('Error sending message:', error);
  }
};