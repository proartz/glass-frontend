<template>
  <v-app id="inspire">
    <Navbar/>
    <v-content>
      <v-container fluid fill-height>
        <v-layout>
          <v-flex text-xs-center>
            <router-view></router-view>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer class="pl-2" color="indigo" app>
      <span class="white--text">&copy; 2019 OnCode - Glass</span>
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
