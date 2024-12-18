<!-- <template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-blue-200 dark:bg-blue-950 p-5">
    <div class="flex flex-col bg-white shadow-lg rounded-lg px-6 py-8 w-full max-w-lg m-4">
      <img 
        class="mx-auto w-24 h-24 rounded-full shadow-lg" 
        src="https://recursos.marketingnews.es/files/666/31.JPG" 
        alt="App Logo"
      />
      <h2 class="text-2xl font-semibold text-center text-gray-800 mt-6">Registrar-se</h2>
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
          'bg-green-100 border-green-500 text-green-700': messageType == 'success',
          'bg-red-100 border-red-500 text-red-700': messageType == 'error'
        }" 
        class="border-l-4 p-4 mt-6 rounded-lg"
      >
        <p>{{ message }}</p>
      </div>
    </div>
  </div>
</template> -->

<template>
  <div class="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
    <div class="max-w-screen-xl m-0 sm:m-10 bg-white dark:bg-neutral-600 shadow sm:rounded-lg flex justify-center flex-1">
      <div class="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
        <ToggleDarkMode />
        <div class="mt-12 flex flex-col items-center">
          <h1 class="text-2xl xl:text-3xl font-extrabold">
            Registrat a CONEXUS
          </h1>
          <div class="w-full flex-1 mt-8">
            <div class="flex flex-col items-center">
              <button @click="signInWithGoogle"
                class="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 dark:bg-indigo-400 text-gray-800 dark:text-white flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline">
                <div class="bg-white p-2 rounded-full">
                  <svg class="w-4" viewBox="0 0 533.5 544.3">
                    <path
                      d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                      fill="#4285f4" />
                    <path
                      d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                      fill="#34a853" />
                    <path
                      d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                      fill="#fbbc04" />
                    <path
                      d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                      fill="#ea4335" />
                  </svg>
                </div>
                <span class="ml-4">
                  Accedeix amb Google
                </span>
              </button>

              <button @click="signInWithGithub"
                class="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 dark:bg-indigo-400 text-gray-800 dark:text-white flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-5">
                <div class="bg-white p-1 rounded-full">
                  <svg class="w-6" viewBox="0 0 32 32">
                    <path fill-rule="evenodd"
                      d="M16 4C9.371 4 4 9.371 4 16c0 5.3 3.438 9.8 8.207 11.387.602.11.82-.258.82-.578 0-.286-.011-1.04-.015-2.04-3.34.723-4.043-1.609-4.043-1.609-.547-1.387-1.332-1.758-1.332-1.758-1.09-.742.082-.726.082-.726 1.203.086 1.836 1.234 1.836 1.234 1.07 1.836 2.808 1.305 3.492 1 .11-.777.422-1.305.762-1.605-2.664-.301-5.465-1.332-5.465-5.93 0-1.313.469-2.383 1.234-3.223-.121-.3-.535-1.523.117-3.175 0 0 1.008-.32 3.301 1.23A11.487 11.487 0 0116 9.805c1.02.004 2.047.136 3.004.402 2.293-1.55 3.297-1.23 3.297-1.23.656 1.652.246 2.875.12 3.175.77.84 1.231 1.91 1.231 3.223 0 4.61-2.804 5.621-5.476 5.922.43.367.812 1.101.812 2.219 0 1.605-.011 2.898-.011 3.293 0 .32.214.695.824.578C24.566 25.797 28 21.3 28 16c0-6.629-5.371-12-12-12z" />
                  </svg>
                </div>
                <span class="ml-4">
                  Accedeix amb GitHub
                </span>
              </button>

              <button @click="signInWithDiscord"
                class="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 dark:bg-indigo-400 text-gray-800 dark:text-white flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-5">
                <div class="bg-white p-1 rounded-full">
                  <svg class="w-6" viewBox="0 0 32 32">
                    <path xmlns="http://www.w3.org/2000/svg"
                      d="M23.6361 9.33998C22.212 8.71399 20.6892 8.25903 19.0973 8C18.9018 8.33209 18.6734 8.77875 18.5159 9.13408C16.8236 8.89498 15.1469 8.89498 13.4857 9.13408C13.3283 8.77875 13.0946 8.33209 12.8974 8C11.3037 8.25903 9.77927 8.71565 8.35518 9.3433C5.48276 13.4213 4.70409 17.3981 5.09342 21.3184C6.99856 22.6551 8.84487 23.467 10.66 23.9983C11.1082 23.4189 11.5079 22.8029 11.8523 22.1536C11.1964 21.9195 10.5683 21.6306 9.9748 21.2951C10.1323 21.1856 10.2863 21.071 10.4351 20.9531C14.0551 22.5438 17.9881 22.5438 21.5649 20.9531C21.7154 21.071 21.8694 21.1856 22.0251 21.2951C21.4299 21.6322 20.8 21.9211 20.1442 22.1553C20.4885 22.8029 20.8865 23.4205 21.3364 24C23.1533 23.4687 25.0013 22.6567 26.9065 21.3184C27.3633 16.7738 26.1261 12.8335 23.6361 9.33998ZM12.3454 18.9075C11.2587 18.9075 10.3676 17.9543 10.3676 16.7937C10.3676 15.6331 11.2397 14.6783 12.3454 14.6783C13.4511 14.6783 14.3422 15.6314 14.3232 16.7937C14.325 17.9543 13.4511 18.9075 12.3454 18.9075ZM19.6545 18.9075C18.5678 18.9075 17.6767 17.9543 17.6767 16.7937C17.6767 15.6331 18.5488 14.6783 19.6545 14.6783C20.7602 14.6783 21.6514 15.6314 21.6323 16.7937C21.6323 17.9543 20.7602 18.9075 19.6545 18.9075Z"
                      fill="#5865F2" />
                  </svg>
                </div>
                <span class="ml-4">Accedeix amb Discord</span>
              </button>
            </div>

            <div class="my-12 border-b text-center">
              <div
                class="leading-none px-2 inline-block text-sm text-gray-600 dark:text-white tracking-wide font-medium bg-white dark:bg-neutral-600 transform translate-y-1/2">
                O Inicia sessió
              </div>
            </div>

            <div class="mx-auto max-w-xs">
              <input
                class="w-full px-8 py-4 rounded-lg font-medium dark:bg-gray-900 dark:text-white border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                type="email" placeholder="Correu electrònic" />
              <input
                class="w-full px-8 py-4 rounded-lg font-medium dark:bg-gray-900 dark:text-white border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                type="password" placeholder="Contrasenya" />
              <button
                class="mt-5 tracking-wide font-semibold bg-indigo-500 dark:bg-indigo-700 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                <svg class="w-6 h-6 -ml-2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round">
                  <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <path d="M20 8v6M23 11h-6" />
                </svg>
                <span class="ml-3">
                  Inicia sessió
                </span>
              </button>
              <div v-if="message" :class="{
                'bg-green-100 border-green-500 text-green-700': messageType == 'success',
                'bg-red-100 border-red-500 text-red-700': messageType == 'error'
              }" class="border-l-4 p-4 mt-6 rounded-lg">
                <p>{{ message }}</p>
              </div>
              <p class="mt-6 text-xs text-gray-600 dark:text-gray-100 text-center">
                Projecte realitzat per l'equip de
                <span class="border-b border-gray-500 border-dotted">
                  Conexus
                </span>
                , amb l'ajuda del
                <span class="border-b border-gray-500 border-dotted">
                  Institut Pedralbes
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1 bg-indigo-100 text-center hidden lg:flex">
        <div class="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
          style="background-image: url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg');">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import ToggleDarkMode from '@/components/ToggleDarkMode.vue';

// Firebase configuration 
const firebaseConfig = {
  apiKey: "AIzaSyAC-O_e7tx6EzkuNiW1j7RBjqVr-iNirBM",
  authDomain: "tr2-dam-mentories.firebaseapp.com",
  projectId: "tr2-dam-mentories",
  storageBucket: "tr2-dam-mentories.firebaseapp.com",
  messagingSenderId: "338164475859",
  appId: "1:338164475859:web:e69d1ef2426b26d9e0f126",
  measurementId: "G-KTW22GCCFB"
};

// Initialize Firebase 
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// State and methods 
const message = ref('');
const messageType = ref('');

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    console.log(result);
    const { displayName } = result.user;
    message.value = `Benvingut, ${displayName}`;
    messageType.value = 'success';
  } catch (error) {
    message.value = `Error: ${error.message}`;
    messageType.value = 'error';
  }
};

const signInWithGithub = async () => {
  const provider = new GithubAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    console.log(result);
    const { displayName } = result.user;
    message.value = `Benvingut, ${displayName}`;
    messageType.value = 'success';
  } catch (error) {
    message.value = `Error: ${error.message}`;
    messageType.value = 'error';
  }
}; 

const signInWithDiscord = async () => {
  message.value = 'Aquesta funcionalitat encara no està disponible';
  messageType.value = 'error';
};
</script>