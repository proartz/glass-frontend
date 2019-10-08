<template>
    <div>
        <v-container fluid>
            <v-expansion-panel v-model="panel" class="order">
                <v-expansion-panel-content v-for="order in filteredOrders" :key="order.id"  class="order">
                    <template v-slot:header>
                        <v-layout row wrap :class="`order ${order.status}`">
                            <v-flex lg2 md2>
                                <div class="caption grey--text">Zewnętrzny Numer Zlecenia</div>
                                <div class="body-1 text-truncate">{{ order.externalOrderId }}</div>
                            </v-flex>
                            <v-flex shrink>
                                <v-btn
                                    :to = "{
                                        name: 'Zlecenie',
                                        params: {
                                            id: order.id
                                        }
                                    }"
                                    flat
                                    icon
                                >
                                    <v-icon>remove_red_eye</v-icon>
                                </v-btn>
                            </v-flex>
                            <v-flex shrink>
                                <v-btn
                                    :to = "{
                                        name: 'Edytuj Zlecenie',
                                        params: {
                                            id: order.id
                                        }
                                    }"
                                    flat
                                    icon
                                >
                                    <v-icon>edit</v-icon>
                                </v-btn>
                               <!-- <ViewOrder @refresh='refresh' @showSnackbar='showSnackbar'
                                            v-bind:materialsItems="materialsItems"
                                            v-bind:materials="materials"
                                            v-bind:orderId="order.id"
                                            v-bind:orderStatusItems="orderStatusItems"
                                            v-bind:operationStatusItems="operationStatusItems"/> -->
                            </v-flex>           
                            
                            <v-flex lg2 md2>
                                <div class="caption grey--text">Klient</div>
                                <div class="body-1 text-truncate">{{ order.customer }}</div>
                            </v-flex>
                            <v-flex lg2 md2>
                                <div class="caption grey--text">Numer Faktury</div>
                                <div class="body-1 text-truncate">{{ order.invoiceNumber }}</div>
                            </v-flex>
                            <v-flex lg1 md1>
                                <div class="caption grey--text">Cena</div>
                                <div class="body-1">{{ order.price }}</div>
                            </v-flex>
                            <v-flex lg1 md1>
                                <div class="caption grey--text">Termin Realizacji</div>
                                <div class="body-1">{{ order.dueDate }}</div>
                            </v-flex>
                            <v-flex lg1 md1>
                                <div class="caption grey--text">Data Przyjęcia</div>
                                <div class="body-1">{{ order.createDate }}</div>
                            </v-flex>
                            <v-flex lg1 md1>
                                <v-chip small :class="`${order.status} white--text caption my-2`">{{ order.status }}</v-chip>
                            </v-flex>
                        </v-layout>
                    </template>
                    <v-divider></v-divider>
                    <v-card>
                        <v-layout row justify-center v-for="item in order.items" :key="item.id">
                            <v-flex shrink>
                                <div class="caption grey--text">Materiał:</div>
                                <div>{{ item.material.name }}</div>
                            </v-flex>
                            <v-flex shrink>
                                <div class="caption grey--text">Szerokość:</div>
                                <div>{{ item.width }}</div>
                            </v-flex>
                            <v-flex shrink>
                                <div class="caption grey--text">Wysokość:</div>
                                <div>{{ item.height }}</div>
                            </v-flex>
                            <v-flex shrink>
                                <div class="caption grey--text">Grubość:</div>
                                <div>{{ item.depth }}</div>
                            </v-flex>
                            <v-flex shrink>
                                <div class="caption grey--text">Ilość:</div>
                                <div>{{ item.quantity }}</div>
                            </v-flex>
                            <v-flex shrink>
                                <ViewOperations @refresh='refresh' v-bind:operations="item.operations"/>
                            </v-flex>
                        </v-layout>
                    </v-card>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-container>
    </div>
</template>

<script>
import AddOrder from '@/components/AddOrder';
import ViewOrder from '@/components/ViewOrder';
import ViewOperations from '@/components/ViewOperations';
import EventBus from '@/event-bus.js';

export default {
    components: { 
        AddOrder,
        ViewOrder,
        ViewOperations
    },
    data() {
        return {
            searchText: '',
            materials: [],
            materialsItems: [],
            orderStatusItems: ['PRZYJĘTO', 'W_REALIZACJI', 'GOTOWE', 'WYDANE', 'ROZLICZONE'],
            operationStatusItems: ['NIEROBIONE', 'ZAPLANOWANE', 'GOTOWE_DO_REALIZACJI' , 'ZROBIONE'],
            editMode: false,
            panel: [],
            loading: false,
            orders: []
        }
    },
    methods: {
        refresh() {
            console.log("REFRESHING...");
            this.loadData();
        },
        loadData() {
            this.i = 0;
            this.fetchOrders();
            this.fetchMaterials();
        },
        giveIndex() {
            return this.i;
        },
        fetchOrders() {
            this.loading = true;
            this.$http.get('http://' + process.env.VUE_APP_HOST + ':' + process.env.VUE_APP_BACKEND_PORT + '/orders').then(response => {
                this.orders = response.body;
                console.log(this.orders);
                this.loading = false;
            }, response => { 
                console.log(response.body);
            });
        },
        fetchMaterials() {
            this.loading = true;
            this.$http.get('http://' + process.env.VUE_APP_HOST + ':' + process.env.VUE_APP_BACKEND_PORT + '/materials').then(response => {
                this.materials = response.body;
                this.materialsItems = [];
                this.materials.forEach((material) => {
                    this.materialsItems.push(material.name);
                })
                this.loading = false;
            }), response => {
                console.error(response);
            }
        },
        fetchItems(orderIndex) {
            this.loading = true;
            var orderId = this.orders[orderIndex].id;
            this.$http.get('http://' + process.env.VUE_APP_HOST + ':' + process.env.VUE_APP_BACKEND_PORT + '/items/' + orderId).then(response => {
                const items = response.body;
                this.orders[orderIndex].items = items;
                this.loading = false;
            }, response => { 
                console.log(response.body);
            });
        },
        searchTextInput(input) {
            this.searchText = input;
        },
        sortBy(prop) {
            console.log("SortBy=" + prop);
            this.orders.sort((a, b) => a[prop] < b[prop] ? -1: 1)
        },
        includes(order) {
            return order.customer.toLowerCase().includes(this.searchText) ||
                    order.externalOrderId.toLowerCase().includes(this.searchText) ||
                    order.invoiceNumber.toLowerCase().includes(this.searchText) ||
                    order.externalOrderId.toLowerCase().includes(this.searchText) ||
                    order.externalOrderId.toLowerCase().includes(this.searchText) ||
                    order.externalOrderId.toLowerCase().includes(this.searchText);
        },
        showSnackbar(message) {
            EventBus.$emit('showSnackbar', message);
        },
    },
    computed: {
        filteredOrders() {
            this.searchText = this.searchText.toLowerCase();
            return this.orders.filter(this.includes);
        }
    },
    // watch: {
    //     panel:  function(index) {
    //         if(index != null) {
    //             this.fetchItems(index)
    //         }
    //     }
    // },
    created() {
        this.loadData();
        console.log("REFS: ");
        EventBus.$on('refreshOrders', () => {this.refresh()});
        EventBus.$on('searchTextInput', (input) => {this.searchTextInput(input)});
        EventBus.$on('sortOrders', (prop) => {this.sortBy(prop)});
    },
}
</script>

<style>
/* .order {
    min-height: 0;
    height: 36px
} */

/* .v-expansion-panel__header {
    min-height: 0;
    padding: 0;
    height: 36px; 
} */

.order.PRZYJĘTO{
    border-left: 4px solid blue;
}
.order.W_REALIZACJI{
    border-left: 4px solid red;
}
.order.GOTOWE{
    border-left: 4px solid green;
}
.order.WYDANE{
    border-left: 4px solid yellow;
}
.order.ROZLICZONE{
    border-left: 4px solid orange;
}

.v-chip.PRZYJĘTO{
    background: blue;
}
.v-chip.W_REALIZACJI{
    background: red;
}
.v-chip.GOTOWE{
    background: green;
}
.v-chip.WYDANE{
    background: orange;
}
.v-chip.ROZLICZONE{
    background: red;
}

</style>

