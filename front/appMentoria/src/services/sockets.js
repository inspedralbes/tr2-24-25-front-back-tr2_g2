import io from 'socket.io-client';

const CHAT_URL = import.meta.env.VITE_CHATS_URL;

const socket = io(CHAT_URL);

export default socket;