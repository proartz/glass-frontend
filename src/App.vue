<template>
  <v-app>
    <Navbar v-bind:snackbarText="snackbarText" v-bind:snackbarWatch="snackbarWatch"/>
    <v-content class="mx-4 my-4">
      <router-view @showSnackbar='showSnackbar'></router-view>
    </v-content>
  </v-app>
</template>

<script>
import Navbar from '@/components/Navbar'

export default {
  name: 'App',
  components: { Navbar },
  data () {
    return {
      snackbarText: '',
      snackbarWatch: false,
    }
  },
  methods: {
    showSnackbar(message) {
      console.log("showSnackbar() invoked");
      this.snackbarText = message;
      this.snackbarWatch = !this.snackbarWatch;
    },
  }
}
</script>
