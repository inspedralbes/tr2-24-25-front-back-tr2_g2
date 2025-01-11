import { defineStore } from 'pinia'

export const useAppStore = defineStore( 'appStore', {  
  state: () => ({
    user: {},
    accessToken: '',
    refreshToken: ''
  }),
  actions: {
    setUser(user) {
      this.user = user
    },
    getUser() {
      return this.user
    },
    setAccessToken(accessToken) {
      this.accessToken = accessToken
    },
    getAccessToken() {
      return this.accessToken
    },
    setRefreshToken(refreshToken) {
      this.refreshToken = refreshToken
    },
    getRefreshToken() {
      return this.refreshToken
    }
  }
});