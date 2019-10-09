<template>
    <v-toolbar-items>
        <v-btn
            @click="submit"
            :loading="loading"
            dark
            flat
        >
        Dodaj Zlecenie
        </v-btn>
        <v-btn
            @click="clearForm"
            dark
            flat
        >
        Wyczyść
        </v-btn>
    </v-toolbar-items>
</template>

<script>
import EventBus from '@/event-bus.js';

export default {
    data() {
        return {
            loading: false
        }
    },
    methods: {
        submit() {
            EventBus.$emit('submit');
        },
        clearForm() {
            EventBus.$emit('clearForm');
        }
    },
    created() {
        EventBus.$on('enableLoading', () => { this.loading = true; });
        EventBus.$on('disableLoading', () => { this.loading = false; });

    }
}
</script>