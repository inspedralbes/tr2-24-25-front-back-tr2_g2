import io from 'socket.io-client';

const CHAT_URL = import.meta.env.VITE_URL_BACK_CHAT;

const URL = import.meta.env.VITE_URL_BACK;

const socket = io(URL);

export default socket;