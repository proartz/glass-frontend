<template>
    <nav>
        <v-toolbar app>
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
            links: [
                {icon: 'dashboard', text: 'Orders', route: '/orders'},
                {icon: 'folder', text: 'Positions', route: '/positions'},
                {icon: 'person', text: 'Operations', route: '/operations'},
            ]
        }
    }
}
</script>
