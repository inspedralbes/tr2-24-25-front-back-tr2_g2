import { createRouter, createWebHistory } from 'vue-router'
import mainPage from '../views/mainPage.vue'
// import profile from '../views/profile.vue'
// import reportPage from '../views/reportPage.vue'
// import validationPage from '../views/validationPage.vue'
// import chatListPage from '../views/chatListPage.vue'
// import chatPage from '../views/chatPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'mainPage',
      component: mainPage,
    }
    // {
    //   path: '/profile',
    //   name: 'profile',
    //   component: profile,
    // },
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