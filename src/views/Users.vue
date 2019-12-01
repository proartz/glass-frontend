<template>
   <v-container
        fluid
        text-xs-left
        >
        <template v-for="user in users">
            <v-card
                :key="'user' + user.id"
                ripple
            >
                <v-layout
                    row
                    wrap
                    justify-start
                    :class="`pa-3 ma-1`">
                    <v-flex md1 class="text-xs-left">
                      <v-btn
                              small
                              icon
                              height="24"
                              @click="deleteUser(user)"
                              value="false"
                          >
                              <v-icon color="#6f00ff">delete</v-icon>
                        </v-btn>
                    </v-flex>
                    <v-flex shrink md1 class="text-xs-left">
                        <div class="caption grey--text text-xs-left">Id</div>
                        <div class="slim">{{ user.id }}</div>
                    </v-flex>
                    <v-flex md2>
                        <div class="caption grey--text">Nazwa Użytkownika</div>
                        <div class="slim">{{ user.username }}</div>
                    </v-flex>
                     <v-flex md1>
                        <div class="caption grey--text">Imię</div>
                        <div class="slim">{{ user.firstname }}</div>
                    </v-flex>
                     <v-flex md2>
                        <div class="caption grey--text">Nazwisko</div>
                        <div class="slim">{{ user.lastname }}</div>
                    </v-flex>
                     <v-flex md1>
                        <div class="caption grey--text">Role</div>
                        <div class="slim">{{ user.roles }}</div>
                    </v-flex>
                     <v-flex md2>
                        <div class="caption grey--text">Uprawnienia</div>
                        <div class="slim">{{ user.permissions }}</div>
                    </v-flex>
                     <v-flex md1>
                        <div class="caption grey--text">Aktywny</div>
                        <div class="slim">{{ user.active }}</div>
                    </v-flex>
                </v-layout>
            </v-card>
        </template>
   </v-container>
</template>

<script>
import EventBus from '@/event-bus.js';
import api from '@/api.js';

export default {
  data() {
    return {
      loading: false,
      users: []
    }
  },
  methods: {
    async fetchUsers() {
            this.loading = true;
            try {
                const response = await api.fetchUsers();
                this.users = response.data;
            } catch ( error ) {
                console.log("Error: fetchUser " + error);
            }
            this.loading = false;
    },
    deleteUser(user) {
      api.deleteUser(user).then(response => {
        EventBus.$emit('showSnackbar', "Usunięto użytkownika " + user.username);
        this.fetchUsers();
      }).catch(error => {
        console.log("Error: deleteUser " + error);
      })
    }
  },
  created() {
        this.fetchUsers();
  }
}
</script>
