<template>
    <nav>
        <v-snackbar v-model="snackbar" :timeout="4000" top>
            <span>New order added.</span>
            <v-btn @click="snackbar = false">Close</v-btn>
        </v-snackbar>
        <v-toolbar card dark color="primary" app>
            <v-toolbar-side-icon></v-toolbar-side-icon>
            <v-toolbar-title>glass</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items class="hidden-sm-and-down">
                <v-btn flat v-for="link in links" :key="link.text" router :to="link.route">{{ link.text }}</v-btn>
            </v-toolbar-items>
        </v-toolbar>
    </nav>
</template>

<script>
export default {
    data() {
        return {
            snackbar: false,
            links: [
                {icon: 'dashboard', text: 'Orders', route: '/orders'},
                {icon: 'folder', text: 'Positions', route: '/positions'},
                {icon: 'person', text: 'Operations', route: '/operations'},
            ]
        }
    }
}
</script>
