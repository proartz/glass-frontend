<template>
    <nav>
        <v-navigation-drawer
            v-if="isLoggedIn"
            v-model="drawer"
            fixed
            clipped
            app
        >
            <v-toolbar flat class="transparent">
                <v-list v-if="isLoggedIn" class="pa-0">
                    <v-list-tile avatar>
                        <v-list-tile-avatar>
                            <img src="https://randomuser.me/api/portraits/men/85.jpg">
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                            <v-list-tile-title>{{ username }}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-toolbar>
            <v-list dense>
                <v-list-tile v-for="link in links" :key="link.text" router :to="link.route">
                    <v-list-tile-action>
                        <v-icon>{{ link.icon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{ link.text }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile v-if='isAdmin' router to="/users">
                    <v-list-tile-action>
                        <v-icon>person</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Użytkownicy</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile v-if='isAdmin' router to="/users/add">
                    <v-list-tile-action>
                        <v-icon>add</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Dodaj Użytkownika</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile @click='logout'>
                    <v-list-tile-action>
                        <v-icon>exit_to_app</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Wyloguj</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>

        <!-- Toolbar -->

        <v-toolbar color="primary" dark fixed app>
            <v-toolbar-side-icon v-if="isLoggedIn" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title>{{ this.$router.currentRoute.name }}</v-toolbar-title>
            <v-spacer></v-spacer>

            <!-- ToolbarButtons -->

            <router-view name="navigation"></router-view>
            
        </v-toolbar>
        <v-snackbar v-model="snackbar" :timeout="4000" top>
            <span>{{ snackbarText }}</span>
            <v-btn dark @click="snackbar = false">Close</v-btn>
        </v-snackbar>
    </nav>
</template>

<script>
import EventBus from '@/event-bus.js';
import { mapGetters, mapState } from 'vuex'

export default {
    data() {
        return {
            drawer: false,
            snackbar: false,
            snackbarText: '',
            links: [
                { icon: 'dashboard', text: 'Zlecenia', route: '/orders' },
                { icon: 'add', text: 'Dodaj Zlecenie', route: '/orders/add' },
                { icon: 'folder', text: 'Pozycje', route: '/positions' },
            ],
        }
    },
    methods: {
        showSnackbar(message) {
            this.snackbarText = message;
            this.snackbar = true;
        },
        logout() {
            EventBus.$emit('showSnackbar', "Wylogowano użytkownika '" + this.user.name + "'");
            this.$store.commit('logout');
            this.$router.push('/login');
        }
    },
    watch: {
        snackbarWatch: function() {
            this.snackbar = true;
        }
    },
    computed: {
        username() {
            return this.$store.state.user.name;
        },
        ...mapGetters([
            'isLoggedIn',
            'isAdmin'
        ]),
        ...mapState([
            'user'
        ])
    },
    created() {
        EventBus.$on('showSnackbar', (message) => { this.showSnackbar(message); })
    }
}
</script>
