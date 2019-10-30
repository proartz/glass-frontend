import Vue from 'vue'
import Vuex from 'vuex'
import api from './api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    
    currentJWT: '',

  },
  getters: {
    jwt: state => state.currentJWT,
    jwtData: (state, getters) => state.currentJWT ? JSON.parse(atob(getters.jwt.split('.')[1])) : null,
    jwtSubject: (state, getters) => getters.jwtData ? getters.jwtData.sub : null,

  },
  mutations: {
    setJWT(state, jwt) {
      state.currentJWT = jwt;
    },
  },
  actions: {
    async login ({ commit, getters }, payload) {
      console.log("Logging..");
      const response = await api.login(payload.username, payload.password);
      
      console.log(response);
      console.log(response.data.token);
      commit('setJWT', response.data.token);
      console.log(getters.jwt);
      console.log(getters.jwtData);
      console.log(getters.jwtSubject);
    }
  }
});
