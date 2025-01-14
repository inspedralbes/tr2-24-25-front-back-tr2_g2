import { createRouter, createWebHistory } from 'vue-router';
import { useAppStore } from '@/stores/index'; // Asegúrate de importar tu store de Pinia
import mainPage from '../views/mainPage.vue';
import profilePage from '../views/profilePage.vue';
import profilesPage from '@/views/profilesPage.vue';
import loginPage from '../views/loginRegisterPage.vue';
import addComunityPost from '../views/addComunityPost.vue';
import addRequestPost from '../views/addRequestPost.vue';

// Definir las rutas
const routes = [
  {
    path: '/login',
    name: 'login',
    component: loginPage,
  },
  {
    path: '/',
    name: 'main',
    component: mainPage,
  },
  {
    path: '/myprofile',
    name: 'myprofile',
    component: profilePage,
  },
  {
    path: '/addComunityPost',
    name: 'addComunityPost',
    component: addComunityPost,
  },
  {
    path: '/addRequestPost',
    name: 'addRequestPost',
    component: addRequestPost,
  },
  {
    path: '/profiles',
    name: 'profiles',
    component: profilesPage,
  },
];

// Crear el router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Guardia de navegación para verificar si el usuario está verificado
router.beforeEach((to, from, next) => {
  const store = useAppStore();
  const user = store.user;

  // Si el usuario no está verificado y está intentando acceder a una ruta que no es permitida
  if (user && !user.verified) {
    // Si no está verificado, solo permite acceso a 'myprofile', 'main' y 'login'
    const allowedRoutes = ['login', 'main', 'myprofile'];

    if (allowedRoutes.includes(to.name)) {
      next(); // Permitimos el acceso a las rutas permitidas
    } else {
      next({ name: 'myprofile' }); // Redirigimos al perfil si el usuario no está verificado
    }
  } else {
    next(); // Si está verificado o no hay usuario, permite el acceso
  }
});

export default router;