<script setup>
import { RouterView } from 'vue-router'
import { ref, onMounted } from 'vue';
import { useAppStore } from '@/stores/index';
import router from '@/router';
import { getUserForRefreshLogin } from './services/communicationManager';


const isDarkMode = ref(false);

async function validateLogin() {
  let profileURL = ref('');
  let bannerURL = ref('');

  console.log('hola token local:', localStorage.getItem('accessToken'));
  console.log('hola refresh token local:', localStorage.getItem('refreshToken'));
  console.log('hola user local:', localStorage.getItem('user'));

  if (!localStorage.getItem('accessToken') || !localStorage.getItem('user') || !localStorage.getItem('refreshToken')) {
    console.log('No hay token o user');
    router.push({ name: 'login' });
  } else {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await getUserForRefreshLogin({ email: user });

      if (response.error) {
        console.error('Error al verificar usuario:', response.error);
        router.push({ name: 'login' });
      } else {
        let user = response;
        let profile = user.profile;

        bannerURL.value = `${import.meta.env.VITE_URL_BACK}${user.banner}`;
        if (profile.includes('/upload/', 0)) {
          profileURL.value = `${import.meta.env.VITE_URL_BACK}${user.profile}`;
        } else {
          profileURL.value = user.profile;
        }

        user.profile = profileURL.value;
        user.banner = bannerURL.value;

        console.log('Usuario verificado:', user);

        useAppStore().setUser(user);
        useAppStore().setAccessToken(localStorage.getItem('accessToken'));
        useAppStore().setRefreshToken(localStorage.getItem('refreshToken'));

        console.log('User Pinia:', useAppStore().user);
      }
    } catch (error) {
      console.error('Error inesperado:', error);
      router.push({ name: 'login' });
    }
  }
}

onMounted( async () => {
  const darkModePreference = localStorage.getItem('darkMode');
  if (darkModePreference == 'enabled') {
    isDarkMode.value = true;
    document.documentElement.classList.add('dark');
  } else {
    isDarkMode.value = false;
    document.documentElement.classList.remove('dark');
  }

  await validateLogin();
});
</script>

<template>
  <div id="app" :class="darkMode ? 'dark' : ''">
    <RouterView class="bg-slate-200 dark:bg-neutral-800 text-gray-900 dark:text-white" />
  </div>
</template>

<style scoped></style>