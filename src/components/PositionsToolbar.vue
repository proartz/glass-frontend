<template>
    <v-layout row>
            <v-flex shrink>
                <v-btn icon @click="refreshPositions" :loading="loading">
                    <v-icon>refresh</v-icon>
                </v-btn>
            </v-flex>
            <v-flex shrink>
                <v-btn icon @click="groupStatusChange">
                    <v-icon>done</v-icon>
                </v-btn>
            </v-flex>
            <v-flex shrink>
                <v-select
                    :items="operationsItems"
                    v-model="operationsFilter"
                    @input="operationsFilterInput(operationsFilter)"
                    label="Filtruj gotowe do:"
                >
                </v-select>
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
            ],
            operationsFilter: 'Wszystkie',
            operationsItems: ['Wszystkie', 'Cięcie', 'Szlifowanie', 'Wiercenie', 'CNC', 'Hartowanie', 'Emaliowanie', 'Laminowanie', 'Wydanie', 'Rozliczenie'],
        }
    },
    methods: {
        refreshPositions() {
            EventBus.$emit('refreshPositions');
        },
        groupStatusChange() {
            EventBus.$emit('groupStatusChange');
        },
        operationsFilterInput(input) {
            EventBus.$emit('operationsFilterInput', input);
        },
        sortOrders(prop) {
            console.log(prop);
            EventBus.$emit('sortOrders', prop);
        },
    },
}
</script>