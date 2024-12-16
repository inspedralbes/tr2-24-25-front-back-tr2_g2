<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-5">
    <div class="flex flex-col bg-white shadow-lg rounded-lg px-6 py-8 w-full max-w-lg m-4">
      <img 
        class="mx-auto w-24 h-24 rounded-full shadow-lg" 
        src="https://recursos.marketingnews.es/files/666/31.JPG" 
        alt="App Logo"
      />
      <h2 class="text-2xl font-semibold text-center text-gray-800 mt-6">Inicia sessió</h2>
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-8 flex flex-col sm:flex-row py-6 top-6 justify-center sm:justify-end gap-4">
        <button @click="signInWithGoogle">
          <p class="flex items-center py-3 px-6 bg-white-800 rounded-full shadow-lg shadow-black/30 transition-all duration-500 hover:shadow-gray-100 justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24" stroke="none">
              <path d="M21.805 10.023h-9.71v3.967h5.85c-.25 1.34-.97 2.467-2.07 3.253l-.02.13 3.006 2.327.208.02c1.91-1.755 3.015-4.34 3.015-7.325 0-.733-.085-1.447-.238-2.145z" fill="#4285F4"/>
              <path d="M12.095 22.002c2.703 0 4.974-.895 6.632-2.433l-3.15-2.44c-.876.59-2 1.007-3.482 1.007-2.676 0-4.942-1.804-5.752-4.233l-.117.01-3.086 2.388-.04.115c1.646 3.317 5.01 5.586 8.995 5.586z" fill="#34A853"/>
              <path d="M6.343 14.01a5.924 5.924 0 01-.304-1.92c0-.666.108-1.314.298-1.92l-.005-.128-3.126-2.43-.102.048a9.944 9.944 0 00-.948 4.43c0 1.606.37 3.127 1.022 4.472l3.165-2.432z" fill="#FBBC05"/>
              <path d="M12.095 4.716c1.47 0 2.778.507 3.818 1.502l2.862-2.882c-1.664-1.566-3.93-2.536-6.68-2.536-3.986 0-7.35 2.27-8.996 5.586l3.167 2.432c.807-2.43 3.074-4.234 5.83-4.234z" fill="#EA4335"/>
            </svg>
            Google
          </p>
        </button>
        <button @click="signInWithGithub">
          <p class="flex items-center py-3 px-6 bg-gray-800 text-white rounded-full shadow-lg shadow-black/30 transition-all duration-500 hover:shadow-gray-100 hover:bg-gray-900 justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24" stroke="none">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.304 3.495.997.108-.776.418-1.305.762-1.605-2.665-.305-5.467-1.332-5.467-5.93 0-1.31.47-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.52 11.52 0 013.003-.404c1.02.005 2.045.138 3.003.404 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.62-5.475 5.92.43.372.81 1.102.81 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
            GitHub
          </p>
        </button>
        <button>
          <p class="flex items-center py-3 px-6 bg-indigo-600 text-white rounded-full shadow-lg shadow-black/30 transition-all duration-500 hover:shadow-gray-100 hover:bg-indigo-700 justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mr-2" viewBox="0 0 512 512">
              <path fill="currentColor" d="M464 66.52A50 50 0 0 0 414.12 17L97.64 16A49.65 49.65 0 0 0 48 65.52V392c0 27.3 22.28 48 49.64 48H368l-13-44l109 100ZM324.65 329.81s-8.72-10.39-16-19.32C340.39 301.55 352.5 282 352.5 282a139 139 0 0 1-27.85 14.25a173.3 173.3 0 0 1-35.11 10.39a170 170 0 0 1-62.72-.24a184.5 184.5 0 0 1-35.59-10.4a141.5 141.5 0 0 1-17.68-8.21c-.73-.48-1.45-.72-2.18-1.21c-.49-.24-.73-.48-1-.48c-4.36-2.42-6.78-4.11-6.78-4.11s11.62 19.09 42.38 28.26c-7.27 9.18-16.23 19.81-16.23 19.81c-53.51-1.69-73.85-36.47-73.85-36.47c0-77.06 34.87-139.62 34.87-139.62c34.87-25.85 67.8-25.12 67.8-25.12l2.42 2.9c-43.59 12.32-63.44 31.4-63.44 31.4s5.32-2.9 14.28-6.77c25.91-11.35 46.5-14.25 55-15.21a24 24 0 0 1 4.12-.49a205.6 205.6 0 0 1 48.91-.48a201.6 201.6 0 0 1 72.89 22.95s-19.13-18.15-60.3-30.45l3.39-3.86s33.17-.73 67.81 25.16c0 0 34.87 62.56 34.87 139.62c0-.28-20.35 34.5-73.86 36.19"/>
              <path fill="currentColor" d="M212.05 218c-13.8 0-24.7 11.84-24.7 26.57s11.14 26.57 24.7 26.57c13.8 0 24.7-11.83 24.7-26.57c.25-14.76-10.9-26.57-24.7-26.57m88.38 0c-13.8 0-24.7 11.84-24.7 26.57s11.14 26.57 24.7 26.57c13.81 0 24.7-11.83 24.7-26.57S314 218 300.43 218"/>
            </svg>
            Discord
          </p>
        </button>
      </div>
      <div 
        v-if="message" 
        :class="{
          'bg-green-100 border-green-500 text-green-700': messageType === 'success',
          'bg-red-100 border-red-500 text-red-700': messageType === 'error'
        }" 
        class="border-l-4 p-4 mt-6 rounded-lg"
      >
        <p>{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script>
// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyAC-O_e7tx6EzkuNiW1j7RBjqVr-iNirBM",

  authDomain: "tr2-dam-mentories.firebaseapp.com",

  projectId: "tr2-dam-mentories",

  storageBucket: "tr2-dam-mentories.firebasestorage.app",

  messagingSenderId: "338164475859",

  appId: "1:338164475859:web:e69d1ef2426b26d9e0f126",

  measurementId: "G-KTW22GCCFB"

};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default {
  name: 'LoginPage',
  data() {
    return {
      message: '',
      messageType: ''
    };
  },
  methods: {
    async signInWithGoogle() {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        console.log(result);
        const { displayName, email, photoURL, accessToken } = result.user;
        let userInfo = {
          name: displayName,
          email,
          photoURL,
          token: accessToken
        };
        userInfo = JSON.stringify(userInfo);
        console.log(userInfo);
        this.message = `Benvingut, ${result.user.displayName}`;
        this.messageType = 'success';
      } catch (error) {
        this.message = `Error: ${error.message}`;
        this.messageType = 'error';
      }
    },
    async signInWithGithub() {
      const provider = new GithubAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        console.log(result);
        const { displayName, photoURL, accessToken } = result.user;
        const email = result._tokenResponse.email;
        let userInfo = {
          name: displayName,
          email,
          profile: photoURL,
          token: accessToken
        };
        userInfo = JSON.stringify(userInfo);
        console.log(userInfo);
        this.message = `Benvingut, ${result.user.displayName}`;
        this.messageType = 'success';
      } catch (error) {
        this.message = `Error: ${error.message}`;
        this.messageType = 'error';
      }
    }
  }
};
</script>