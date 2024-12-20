// import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore( 'appStore', {  
  state: () => ({
    user: {},
    token: ''
  }),
  actions: {
    setUser(user) {
      this.user = user
    },
    setToken(token) {
      this.token = token
    }
  }
});