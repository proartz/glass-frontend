import Vue from 'vue'
import Vuex from 'vuex'
import api from './api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    status: '',
    token: '',
    user: {
      name: '',
      login: '',
      roles: [],
      permissions: []
    }
  },
  // getters: {
  //   jwt: state => state.currentJWT,
  //   jwtData: (state, getters) => state.currentJWT ? JSON.parse(atob(getters.jwt.split('.')[1])) : null,
  //   login: (state, getters) => getters.jwtData ? getters.jwtData.sub : null,
  //   name: (state, getters) => getters.jwtData ? getters.jwtData.name : null,
  //   roles: (state, getters) => getters.jwtData ? getters.jwtData.roles.split(",") : null,
  //   permissions: (state, getters) => getters.jwtData ? getters.jwtData.permissions.split(",") : null
  // },
  mutations: {
    auth_success(state, token) {
      state.status = 'success';
      state.token = token;

      // parse and save user data
      const data = JSON.parse(atob(token.split('.')[1]));
      state.user.login = data.sub;
      state.user.name = data.name;
      state.user.roles = data.roles.split(",");
      state.user.permissions = data.permissions.split(",");

      // set up authorization header
      api.setHeader(state.token);
    },
    auth_error(state) {
      state.status = 'error';
      state.token = '';
      state.user.name = '';
      state.user.login = '';
      state.user.roles = [],
      state.user.permissions = [];
    },
    logout(state) {
      state.status = '';
      state.token = '';
      state.user.name = '';
      state.user.login = '';
      state.user.roles = [],
      state.user.permissions = [];
    },
  },
  actions: {
    async login ({ commit, getters }, payload) {
      console.log("Logging..");
      try {
        const response = await api.login(payload.username, payload.password);
        commit('auth_success', response.data.token);
        return response;
      } catch ( error ) {
        commit('auth_error');
        throw error;
      }
    },
    logout ({ commit }) {
      commit('logout');
      api.deleteHeader();
    }
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    isAdmin: (state, getters) => getters.isLoggedIn ? state.user.roles.includes("ADMIN") : false
  }
});
