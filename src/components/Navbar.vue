<template>
    <nav>
        <v-navigation-drawer
            v-model="drawer"
            fixed
            clipped
            app
        >
            <v-toolbar flat class="transparent">
                <v-list class="pa-0">
                    <v-list-tile avatar>
                        <v-list-tile-avatar>
                            <img src="https://randomuser.me/api/portraits/men/85.jpg">
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                            <v-list-tile-title>John Leider</v-list-tile-title>
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
            </v-list>
        </v-navigation-drawer>

        <!-- Toolbar -->

        <v-toolbar color="indigo" dark fixed app>
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
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
import { EventBus } from '@/event-bus.js';

export default {
    props: [
        'snackbarText',
        'snackbarWatch'
    ],
    data() {
        return {
            drawer: false,
            snackbar: false,
            links: [
                { icon: 'dashboard', text: 'Zlecenia', route: '/orders' },
                { icon: 'folder', text: 'Pozycje', route: '/positions' },
            ],
        }
    },
    methods: {
        
    },
    watch: {
        snackbarWatch: function() {
            this.snackbar = true;
        }
    }
}
</script>
