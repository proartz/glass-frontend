<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Login form</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn :href="source" icon large target="_blank" v-on="on">
                      <v-icon large>code</v-icon>
                    </v-btn>
                  </template>
                  <span>Source</span>
                </v-tooltip>
                <v-tooltip right>
                  <template v-slot:activator="{ on }">
                    <v-btn icon large href="https://codepen.io/johnjleider/pen/wyYVVj" target="_blank" v-on="on">
                      <v-icon large>mdi-codepen</v-icon>
                    </v-btn>
                  </template>
                  <span>Codepen</span>
                </v-tooltip>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    prepend-icon="person"
                    name="login"
                    label="Login"
                    type="text"
                    v-model="username"
                  >
                  </v-text-field>
                  <v-text-field
                    id="password"
                    prepend-icon="lock"
                    name="password"
                    label="Password"
                    type="password"
                    v-model="password"
                  >
                  </v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="login(username, password)">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'

const AXIOS = axios.create({
    baseURL: "http://192.168.1.30:9090",
});

  export default {
    data: () => ({
      drawer: null,
      username: '',
      password: '',
    }),
    props: {
      source: String
    },
    methods: {
      login(username, password) {
        console.log(username);
        console.log(password);
        // AXIOS({
        //     method: 'post',
        //     url: '/login',
        //     data: {
        //         username: this.username,
        //         password: this.password
        //     }
        // }).then(response => {
          // console.log(response);
          // console.log(response.data.token);
          // this.$store.commit('setJWT', response.data.token);
          // console.log(this.$store.getters.jwt);
          // console.log(this.$store.getters.jwtData);
          // console.log(this.$store.getters.jwtSubject);
          this.$store.dispatch('login', { username, password })
            .then(response => console.log("Login: Success!"))
      }
    },
    computed: {
      ...mapGetters([
        'jwt',
        'jwtData',
        'jwtSubject'
      ])
    }
  }
</script>