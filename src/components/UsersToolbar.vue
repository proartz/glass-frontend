<template>
    <v-toolbar-items>
        <v-tooltip bottom>
            <template v-slot:activator="{ on }"> 
                <v-btn
                    :to = "{ name: 'Dodaj Użytkownika' }"
                    tag="button"
                    flat
                    icon
                    v-on="on">
                    <v-icon>add</v-icon>
                </v-btn>
            </template>
            <span>Dodaj Użytkownika</span>
        </v-tooltip>
    </v-toolbar-items>
</template>

<script>
import EventBus from '@/event-bus.js';

export default {
    data() {
        return {
            loading: false,
        }
    },
}
</script>

<style scoped>
.v-input {
    align-items: center;
}
.div.sort{
    vertical-align: middle;
    align-items: center;
}
</style>