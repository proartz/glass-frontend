<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Zaloguj</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form">
              <p v-if="errs.length">
                <ul>
                  <li
                    v-for="error in errs"
                    :key=error
                    class="text-xs-left error--text"
                  >{{ error }}</li>
                </ul>
              </p>
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
            <v-btn color="primary" @click="login(username, password)">Zaloguj</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import EventBus from '@/event-bus.js';

  export default {
    data: () => ({
      errs: [],
      username: '',
      password: '',
    }),
    props: {
      source: String
    },
    methods: {
      login(username, password) {
        this.clearErrors();
        this.$store.dispatch('login', { username, password })
            .then(response => {
              EventBus.$emit('showSnackbar', "Zalogowano użytkownika '" + this.user.name + "'")
              this.$router.push("/");
            })
            .catch(error => {
              console.log(error);
              this.$refs.form.reset();
              this.errs.push("BŁĄD: Użytkownik lub hasło, jest nieprawidłowe");
            });
      },
      clearErrors() {
        this.errs = [];
      }
    },
    computed: {
      ...mapState([
        'status',
        'token',
        'user',
      ])

    }
  }
</script>