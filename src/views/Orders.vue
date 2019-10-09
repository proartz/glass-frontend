<template>
    <v-container fluid>
        <v-expansion-panel
            v-model="panel"
            focusable
        >
            <v-expansion-panel-content
                v-for="order in filteredOrders"
                :key="order.id"
                :class="`order ${order.status}`"
                @input="orderSelected(order.id)"
                
            >
                <template v-slot:header>
                    <v-layout
                        row
                        wrap
                        align-center
                        pr-4
                    >
                        <v-flex lg1 md1 sm1 xs1 mr-4>
                            <div class="caption grey--text">Id</div>
                            <div class="body-1 text-truncate">{{ order.id }}</div>
                        </v-flex>
                        <v-flex lg2 md3 sm2 hidden-xs-only mr-4>
                            <div class="caption grey--text text-truncate">Zewnętrzny Numer Zlecenia</div>
                            <div class="body-1 text-truncate">{{ order.externalOrderId }}</div>
                        </v-flex>
                        <v-flex lg2 md2 xs1 mr-4 hidden-sm-and-down>
                            <div class="caption grey--text">Klient</div>
                            <div class="body-1 text-truncate">{{ order.customer }}</div>
                        </v-flex>
                        <v-flex md2 mr-4 hidden-sm-and-down>
                            <div class="caption grey--text">Termin Realizacji</div>
                            <div class="body-1">{{ order.dueDate }}</div>
                        </v-flex>
                          <v-spacer></v-spacer>
                        <v-flex md2 class="text-xs-right">
                            <v-chip small :class="`${order.status} white--text caption`">{{ order.status }}</v-chip>
                        </v-flex>
                    </v-layout>
                </template>
                <v-divider></v-divider>
                <v-card>
                    <v-layout
                        justify-end
                        align-center
                        row
                        py-1
                        v-for="item in order.items"
                        :key="item.id"
                    >
                        <v-spacer></v-spacer>
                        <v-flex md1>
                            <div class="caption grey--text">Id:</div>
                            <div>{{ item.id }}</div>
                        </v-flex>
                        <v-flex md1>
                            <div class="caption grey--text">Materiał:</div>
                            <div>{{ item.material.name }}</div>
                        </v-flex>
                        <v-flex md1 hidden-sm-and-down>
                            <div class="caption grey--text">Szerokość:</div>
                            <div>{{ item.width }}</div>
                        </v-flex>
                        <v-flex md1  hidden-sm-and-down>
                            <div class="caption grey--text">Wysokość:</div>
                            <div>{{ item.height }}</div>
                        </v-flex>
                        <v-flex md1  hidden-sm-and-down>
                            <div class="caption grey--text">Grubość:</div>
                            <div>{{ item.depth }}</div>
                        </v-flex>
                        <v-flex md1  hidden-sm-and-down>
                            <div class="caption grey--text">Ilość:</div>
                            <div>{{ item.quantity }}</div>
                        </v-flex>
                        <v-flex md4>
                            <ViewOperations @refresh='refresh' v-bind:operations="item.operations"/>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-expansion-panel-content>
        </v-expansion-panel>
    </v-container>
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
        orderSelected(id) {
            console.log("OrderSelected=" + id);
            EventBus.$emit('orderSelected', id);
        },
        sortBy(prop) {
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
    padding-left: 0 ;
    height: 36px; 
} */

/* .theme--light.v-expansion-panel--focusable .v-expansion-panel__container:focus{
    background-color: rgb(117, 169, 238);
} */

.text-truncate{
    line-height: 1.5 !important;
}

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

