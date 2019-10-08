<template>
  <v-app id="inspire">
    <Navbar
      :snackbarText="snackbarText"
      :snackbarWatch="snackbarWatch"
      @refresh="refresh"
    />
    <v-content>
      <v-container fluid fill-height>
        <v-layout>
          <v-flex text-xs-center>
            <router-view :bus="bus" @showSnackbar='showSnackbar'></router-view>
             <!-- <router-view name="navigation"></router-view> -->
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer color="indigo" app>
      <span class="white--text">&copy; 2019 Glass</span>
    </v-footer>
  </v-app>
</template>

<script>
import Navbar from '@/components/Navbar'

export default {
  name: 'App',
  components: { Navbar },
  data () {
    return {
      bus: new Vue(),
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
    refresh() {
      this.bus.$emit('refresh');
    }
  }
}
</script>
