import { ref } from 'vue';
import socket from './sockets';
import { useRouter } from 'vue-router';

const BACK_URL = import.meta.env.VITE_URL_BACK;
const CHAT_URL = import.meta.env.VITE_URL_BACK_CHAT;
const COMMUNITY_URL = import.meta.env.VITE_URL_BACK_COMMUNITY;
const EMPLOYMENTEXCHANGE_URL = import.meta.env.VITE_URL_BACK_EMPLOYMENTEXCHANGE;
const STADISTICS_URL = import.meta.env.VITE_URL_BACK_STADISTICS;

const VITE_URL_BACK_CHAT = import.meta.env.VITE_CHATS_URL;

// Login API firebase
export const loginAPI = async (user) => {
    console.log(user, `communicationManager.js`);
    try {
        const response = await fetch(`${BACK_URL}/loginAPI`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

      if (!response.ok) {
          return { error: `HTTP error! status: ${response.status}` };
      }

      return await response.json();
  } catch (error) {
      console.error('Network error:', error);
      return { error: 'Network error. Please try again later.' };
  }
};


// Create publications
export const postCommunityPublication = async (publication) => {
    try {
        const response = await fetch(`${COMMUNITY_URL}/publications`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(publication),
        });

      console.log(response);
      return response.json();
  } catch (error) {
      console.error(error);
  }
};

// Get Community Publications
export const getCommunityPublication = async () => {
    try {
        const response = await fetch(`${COMMUNITY_URL}/publications`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Network error. Please try again later.' };
    }
};

// Get User Data
export const getUsers = async () => {
    try {
        const response = await fetch(`${BACK_URL}/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Network error. Please try again later.' };
    }
};

//Get Comments in Community Posts
export const getCommunityComments = async () => {
  try {
      const response = await fetch(`${COMMUNITY_URL}/comments`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
      });
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Network error:', error);
      return { error: 'Network error. Please try again later.' };
  }
};

//Post Comments in Community Posts
export const postCommunityComments = async (comment) => {
    try {
        const response = await fetch(`${COMMUNITY_URL}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(comment),
        });
        console.log(response);
        return response.json();
    } catch (error) {
        console.error(error);
    }
};