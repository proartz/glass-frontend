<template>
    <v-toolbar-items>
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-text-field
                    prepend-icon="search"
                    v-model="searchText"
                    @input="searchTextInput(searchText)"
                    solo
                    hide-details
                    single-line
                    clearable
                    v-on="on"
                    >
                    </v-text-field>
            </template>
            <span>Filtruj Zlecenia</span>
        </v-tooltip>

        <v-menu>
            <template #activator="{ on: menu }">
                <v-tooltip bottom>
                <template #activator="{ on: tooltip }">
                    <v-btn
                        icon
                        v-on="{ ...tooltip, ...menu }"
                    >
                        <v-icon>sort</v-icon>
                    </v-btn>
                </template>
                <span>Sortuj Zlecenia</span>
                </v-tooltip>
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

        <v-tooltip bottom>
            <template v-slot:activator="{ on }"> 
                <v-btn
                    :to = "{
                        name: 'Zlecenie',
                        params: {
                            id: orderId
                        }
                    }"
                    flat
                    icon
                    :disabled="!orderId"
                    v-on="on"
                >
                    <v-icon>remove_red_eye</v-icon>
                </v-btn>
            </template>
            <span>Otwórz Zlecenie</span>
        </v-tooltip>
        
        <v-tooltip bottom>
            <template v-slot:activator="{ on }"> 
                <v-btn
                    :to = "{ name: 'Dodaj Zlecenie' }"
                    tag="button"
                    flat
                    icon
                    v-on="on">
                    <v-icon>add</v-icon>
                </v-btn>
            </template>
            <span>Dodaj Nowe Zlecenie</span>
        </v-tooltip>
        <v-tooltip bottom>
            <template v-slot:activator="{ on }"> 
                <v-btn
                    icon
                    @click="refreshOrders"
                    :loading="loading"
                    v-on="on"
                >
                    <v-icon>refresh</v-icon>
                </v-btn>
            </template>
            <span>Odśwież Widok</span>
        </v-tooltip>

    </v-toolbar-items>
</template>

<script>
import EventBus from '@/event-bus.js';

export default {
    data() {
        return {
            loading: false,
            searchText: '',
            items: [
                { title: 'Id', value: 'id'},
                { title: 'Zewnętrzny Numer Zlecenia', value: 'externalOrderId'},
                { title: 'Klient', value: 'customer'},
                // { title: 'Numer Faktury', value: 'invoiceNumber'},
                // { title: 'Cena', value: 'price'},
                { title: 'Termin Realizacji', value: 'dueDate'},
                { title: 'Data Przyjęcia', value: 'createDate'},
                { title: 'Status', value: 'status'}
            ],
            orderId: ''
        }
    },
    methods: {
        refreshOrders() {
            EventBus.$emit('refreshOrders');
        },
        searchTextInput(input) {
            if(input == null) {
                this.searchText = '';
                input = '';
            }
            EventBus.$emit('searchTextInput', input);
        },
        sortOrders(prop) {
            console.log(prop);
            EventBus.$emit('sortOrders', prop);
        }
    },
    created() {
        EventBus.$on('orderSelected', (id) => { this.orderId = id; });
    }
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