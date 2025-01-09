<template>
  <div class="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
    <div
      class="max-w-screen-xl m-0 sm:m-10 bg-white dark:bg-neutral-600 shadow sm:rounded-lg flex justify-center flex-1">
      <div class="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
        <ToggleDarkMode />
        <div class="mt-12 flex flex-col items-center">
          <div v-if="message" :class="{
            'bg-green-100 border-green-500 text-green-700': messageType == 'success',
            'bg-red-100 border-red-500 text-red-700': messageType == 'error'
          }" class="border-l-4 p-4 mb-3 rounded-lg">
            <p>{{ message }}</p>
          </div>
          <h1 class="text-2xl xl:text-3xl font-extrabold mb-5">
            CONEXUS
          </h1>
          <h2 class="text-xl font-light xl:text-2xl mb-3">
            Correu @inspedralbes.cat
          </h2>
          <div class="w-full flex-1 mt-3">
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

              <!-- <button @click="signInWithDiscord"
                class="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 dark:bg-indigo-400 text-gray-800 dark:text-white flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-5">
                <div class="bg-white p-1 rounded-full">
                  <svg class="w-6" viewBox="0 0 32 32">
                    <path xmlns="http://www.w3.org/2000/svg"
                      d="M23.6361 9.33998C22.212 8.71399 20.6892 8.25903 19.0973 8C18.9018 8.33209 18.6734 8.77875 18.5159 9.13408C16.8236 8.89498 15.1469 8.89498 13.4857 9.13408C13.3283 8.77875 13.0946 8.33209 12.8974 8C11.3037 8.25903 9.77927 8.71565 8.35518 9.3433C5.48276 13.4213 4.70409 17.3981 5.09342 21.3184C6.99856 22.6551 8.84487 23.467 10.66 23.9983C11.1082 23.4189 11.5079 22.8029 11.8523 22.1536C11.1964 21.9195 10.5683 21.6306 9.9748 21.2951C10.1323 21.1856 10.2863 21.071 10.4351 20.9531C14.0551 22.5438 17.9881 22.5438 21.5649 20.9531C21.7154 21.071 21.8694 21.1856 22.0251 21.2951C21.4299 21.6322 20.8 21.9211 20.1442 22.1553C20.4885 22.8029 20.8865 23.4205 21.3364 24C23.1533 23.4687 25.0013 22.6567 26.9065 21.3184C27.3633 16.7738 26.1261 12.8335 23.6361 9.33998ZM12.3454 18.9075C11.2587 18.9075 10.3676 17.9543 10.3676 16.7937C10.3676 15.6331 11.2397 14.6783 12.3454 14.6783C13.4511 14.6783 14.3422 15.6314 14.3232 16.7937C14.325 17.9543 13.4511 18.9075 12.3454 18.9075ZM19.6545 18.9075C18.5678 18.9075 17.6767 17.9543 17.6767 16.7937C17.6767 15.6331 18.5488 14.6783 19.6545 14.6783C20.7602 14.6783 21.6514 15.6314 21.6323 16.7937C21.6323 17.9543 20.7602 18.9075 19.6545 18.9075Z"
                      fill="#5865F2" />
                  </svg>
                </div>
                <span class="ml-4">Accedeix amb Discord</span>
              </button> -->
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
import { ref, reactive } from 'vue';
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import ToggleDarkMode from '@/components/ToggleDarkMode.vue';
import { loginAPI } from '@/services/communicationManager';
import { useAppStore } from '@/stores/index';
import router from '@/router';

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

const userLogin = reactive({
  email: '',
  password: ''
});

const userAPIs = reactive({
  email: '',
  name: '',
  token: '',
  profile: ''
});

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    console.log(result);

    userAPIs.token = result.user.uid;
    userAPIs.email = result.user.email;
    userAPIs.name = result.user.displayName;
    userAPIs.profile = result.user.photoURL;

    console.log(userAPIs);
    validateAndLogin();

  } catch (error) {
    console.log(error.message);
    message.value = `Error al iniciar sessió`;
    messageType.value = 'error';
  }
};

const signInWithGithub = async () => {
  const provider = new GithubAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    console.log(result);

    userAPIs.token = result.user.uid;
    userAPIs.email = result.user.email;
    userAPIs.name = 'GitHub User';
    userAPIs.profile = result.user.photoURL;

    console.log(userAPIs);
    validateAndLogin();

  } catch (error) {
    console.log(error.message);
    message.value = `Error al iniciar sessió`;
    messageType.value = 'error';
  }
};

// const signInWithDiscord = async () => {
//   message.value = 'Aquesta funcionalitat encara no està disponible';
//   messageType.value = 'error';
// };

async function validateAndLogin() {
  let succes = false;
  let profileURL = ref('');
  let bannerURL = ref('');

  console.log('Validating and logging in');

  // if (!userAPIs.email.includes('@inspedralbes.cat')) {
  //   message.value = `No tens permís per accedir a aquesta aplicació`;
  //   messageType.value = 'error';
  //   return;
  // } else {
  // console.log('Usuari vàlid');

  try {
    const response = await loginAPI(userAPIs);

    if (response.error) {
      return;
    } else {
      succes = true;
    }

    
    // useAppStore().setToken(response.token);

    let user = response.userLogin;
    // let profile = user.value.profile;

    // console.log('User - profile: ', user.value.profile);

    console.log('User: ', user.value);

    bannerURL.value = `${import.meta.env.VITE_URL_BACK}${user.value.banner}`;
    if (profile.includes('/upload/', 0)) {
      profileURL.value = `${import.meta.env.VITE_URL_BACK}${user.value.profile}`;
    } else {
      profileURL.value = user.value.profile;
    }

    user.value.profile = profileURL.value;
    user.value.banner = bannerURL.value;

    // useAppStore().setUser(response.userLogin);
    useAppStore().setUser(user.value);

  } catch (error) {
    console.log(error.message);
  } finally {
    if (succes) {
      console.log('Redirecting to main page + info en pinia');
      //console.log('Token: ', useAppStore().getToken());
      console.log('User: ', useAppStore().getUser());
      router.push({ name: 'main' });
    }
  }
  // }
}
</script>