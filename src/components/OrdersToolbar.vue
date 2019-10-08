<template>
    <v-layout row justify-start mb-3>
        <v-flex shrink>
            <v-btn icon @click="refresh" :loading="loading">
                <v-icon>refresh</v-icon>
            </v-btn>
        </v-flex>
        <v-flex shrink>
            <!-- add order -->
            <v-btn icon>
                <v-icon>add</v-icon>
            </v-btn>
        </v-flex>
        <v-flex shrink>
            <v-text-field prepend-icon="search"
                            v-model="searchText"
                            solo append-icon="cancel" hide-details single-line>
            </v-text-field>
        </v-flex>
    </v-layout>
</template>

<script>
import EventBus from '@/event-bus.js';

export default {
    data() {
        return {
            loading: false,
            searchText: ''
        }
    },
    methods: {
        refresh() {
            EventBus.$emit('refreshOrders');
        }
    },
}
</script>