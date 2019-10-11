<template>
    <v-toolbar-items>
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn
                    icon @click="groupStatusChange"
                    v-on="on"
                >
                    <v-icon>done</v-icon>
                </v-btn>
            </template>
            <span>Grupowa Zmiana Statusu</span>
        </v-tooltip>
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-select
                    :items="operationsItems"
                    dense
                    v-model="operationsFilter"
                    hint="Filtruj po"
                    @input="operationsFilterInput(operationsFilter)"
                    v-on="on"
                    label="Filtruj Po"
                    solo
                >
                </v-select>
            </template>
            <span>Filtruj po...</span>
        </v-tooltip>
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn
                    icon
                    @click="refreshPositions"
                    :loading="loading"
                    v-on="on"
                >
                    <v-icon>refresh</v-icon>
                </v-btn>
            </template>
            <span>Odśwież</span>
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
                { title: 'Zewnętrzny Numer Zlecenia', value: 'externalOrderId'},
                { title: 'Klient', value: 'customer'},
                { title: 'Numer Faktury', value: 'invoiceNumber'},
                { title: 'Cena', value: 'price'},
                { title: 'Termin Realizacji', value: 'dueDate'},
                { title: 'Data Przyjęcia', value: 'createDate'},
                { title: 'Status', value: 'status'}
            ],
            operationsFilter: '',
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

<style scoped>

.v-input {
    align-items: center !important;
}

</style>