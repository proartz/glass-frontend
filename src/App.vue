<template>
  <v-app id="inspire">
    <Navbar/>
    <v-content>
      <v-container fluid fill-height>
        <v-layout>
          <v-flex text-xs-center>
            <router-view></router-view>
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
import Navbar from '@/components/Navbar';
import EventBus from '@/event-bus.js';

export default {
  name: 'App',
  components: { Navbar },
  data () {
    return {
      
    }
  },
}
</script>
