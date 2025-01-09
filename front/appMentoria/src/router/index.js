import { createRouter, createWebHistory } from 'vue-router'
import mainPage from '../views/mainPage.vue'
import profilePage from '../views/profilePage.vue'
import profilesPage from '@/views/profilesPage.vue'
// import reportPage from '../views/reportPage.vue'
// import validationPage from '../views/validationPage.vue'
// import chatListPage from '../views/chatListPage.vue'
// import chatPage from '../views/chatPage.vue'
import loginPage from '../views/loginRegisterPage.vue'
import addComunityPost from '../views/addComunityPost.vue'
import addRequestPost from '../views/addRequestPost.vue'
import adminPanel from '../views/adminPanel.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
    {
      path: '/admin',
      name: 'admin',
      component: adminPanel,
    }
    // {
    //   path: '/report',
    //   name: 'reportPage',
    //   component: reportPage,
    // },
    // {
    //   path: '/validation',
    //   name: 'validationPage',
    //   component: validationPage,
    // },
    // {
    //   path: '/chatList',
    //   name: 'chatListPage',
    //   component: chatListPage,
    // },
    // {
    //   path: '/chat',
    //   name: 'chatPage',
    //   component: chatPage, 
    // },
  ],
})

export default router