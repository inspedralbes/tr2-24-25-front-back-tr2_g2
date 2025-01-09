import { defineStore } from 'pinia'

export const useAppStore = defineStore( 'appStore', {  
  state: () => ({
    user: {},
    token: '',
  }),
  actions: {
    setUser(user) {
      this.user = user
    },
    setToken(token) {
      this.token = token
    },

    getToken() {
      return this.token
    },
    getUser() {
      return this.user
    },
    getTypeUser() {
      return this.user.typesUsers_id
    },
  }
});