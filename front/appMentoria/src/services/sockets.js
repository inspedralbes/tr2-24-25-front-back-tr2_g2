import io from 'socket.io-client';

const CHAT_URL = import.meta.env.VITE_URL_BACK_CHAT;

const socket = io(CHAT_URL);

export default socket;