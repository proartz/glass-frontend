<template>
    <v-layout row justify-start mb-3>
        <v-flex shrink>
            <v-btn icon @click="refreshOrders" :loading="loading">
                <v-icon>refresh</v-icon>
            </v-btn>
        </v-flex>
        <v-flex shrink>
            <router-link to="/orders/add" tag="button">
                <v-icon>add</v-icon>
            </router-link>
        </v-flex>
        <v-flex shrink>
            <v-text-field prepend-icon="search"
                            v-model="searchText"
                            @input="searchTextInput(searchText)"
                            solo append-icon="cancel" hide-details single-line>
            </v-text-field>
        </v-flex>
        <v-flex>
            <v-menu offset-y>
                <template v-slot:activator="{ on }">
                    <v-btn
                    icon
                    v-on="on"
                    >
                        <v-icon>sort</v-icon>
                    </v-btn>
                </template>
                <v-list dense>
                    <v-list-tile class="caption grey--text">Sortuj po:</v-list-tile>
                    <v-divider></v-divider>
                    <v-list-tile
                    v-for="(item, index) in items"
                    :key="index"
                    @click="sortOrders(item.value)"
                    >
                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
        </v-flex>
    </v-layout>
</template>

<script>
import EventBus from '@/event-bus.js';

export default {
    data() {
        return {
            loading: false,
            searchText: '',
            items: [
                { title: 'Zewnętrzny Numer Zlecenia', value: 'externalOrderId'},
                { title: 'Klient', value: 'customer'},
                { title: 'Numer Faktury', value: 'invoiceNumber'},
                { title: 'Cena', value: 'price'},
                { title: 'Termin Realizacji', value: 'dueDate'},
                { title: 'Data Przyjęcia', value: 'createDate'},
                { title: 'Status', value: 'status'}
            ]
        }
    },
    methods: {
        refreshOrders() {
            EventBus.$emit('refreshOrders');
        },
        searchTextInput(input) {
            EventBus.$emit('searchTextInput', this.searchText);
        },
        sortOrders(prop) {
            console.log(prop);
            EventBus.$emit('sortOrders', prop);
        }
    },
}
</script>