<template>
    <div>
        <h1 class="subheading grey--text">Orders</h1>

    
        <v-btn icon @click="fetchOrders" :loading="loading">
            <v-icon>refresh</v-icon>
        </v-btn>
        <AddOrder @orderAdded="fetchOrders" v-bind:materialsItems="materialsItems" v-bind:operationStatusItems="operationStatusItems"/>
        <v-container fluid>
            <v-expansion-panel v-model="panel" >
                <v-expansion-panel-content v-for="order in orders" :key="order.customer">
                    <template v-slot:header>
                        <v-layout row wrap :class="`pa-3 order ${order.status}`">
                            <v-flex>
                                <div class="caption grey--text">External Order Id</div>
                                <div>{{ order.externalOrderId }}</div>
                            </v-flex>
                            <v-flex>
                               <ViewOrder @refresh='fetchOrders' v-bind:materialsItems="materialsItems" v-bind:orderId="order.id"
                                          v-bind:orderStatusItems="orderStatusItems" v-bind:operationStatusItems="operationStatusItems"/>
                            </v-flex>
                            <v-flex>
                                <div class="caption grey--text">Customer</div>
                                <div>{{ order.customer }}</div>
                            </v-flex>
                            <v-flex>
                                <div class="caption grey--text">Invoice Number</div>
                                <div>{{ order.invoiceNumber }}</div>
                            </v-flex>
                            <v-flex>
                                <div class="caption grey--text">Price</div>
                                <div>{{ order.price }}</div>
                            </v-flex>
                            <v-flex>
                                <div class="caption grey--text">Due Date</div>
                                <div>{{ order.dueDate }}</div>
                            </v-flex>
                            <v-flex>
                                <div class="caption grey--text">Create Date</div>
                                <div>{{ order.createDate }}</div>
                            </v-flex>
                            <v-flex>
                                <div class="right">
                                    <v-chip small :class="`${order.status} white--text caption my-2`">{{ order.status }}</v-chip>
                                </div>
                            </v-flex>
                        </v-layout>
                    </template>
                    <v-divider></v-divider>
                    <v-container class="py-1 pl-5">
                        <v-layout row v-for="item in order.items" :key="item.id">
                            <v-flex>
                                <div class="caption grey--text">Material:</div>
                                <div>{{ materialsItems[item.materialId - 1] }}</div>
                            </v-flex>
                            <v-flex>
                                <div class="caption grey--text">Width:</div>
                                <div>{{ item.width }}</div>
                            </v-flex>
                            <v-flex>
                                <div class="caption grey--text">Height:</div>
                                <div>{{ item.height }}</div>
                            </v-flex>
                            <v-flex>
                                <div class="caption grey--text">Depth:</div>
                                <div>{{ item.depth }}</div>
                            </v-flex>
                            <v-flex>
                                <div class="caption grey--text">Quantity:</div>
                                <div>{{ item.quantity }}</div>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-container>
    </div>
</template>

<script>
import AddOrder from '@/components/AddOrder';
import ViewOrder from '@/components/ViewOrder';

export default {
    components: { 
        AddOrder,
        ViewOrder
    },
    data() {
        return {
            materials: [],
            materialsItems: [],
            orderStatusItems: ['RECEIVED', 'IN_REALISATION', 'READY', 'DELIVERED', 'PAID'],
            operationStatusItems: ['DISABLED', 'READY_FOR_REALISATION' , 'IN_REALISATION', 'DONE'],
            editMode: false,
            panel: [],
            loading: false,
            orders: []
        }
    },
    methods: {
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
                this.materials.forEach((material) => {
                    this.materialsItems.push(material.name);
                })
                this.loading = false;
            }), response => {
                console.error(response);
            }
        },
        fetchItems(id) {
            console.log("Order with id=" + id + " was selected.");
            this.loading = true;
            this.$http.get('http://' + process.env.VUE_APP_HOST + ':' + process.env.VUE_APP_BACKEND_PORT + '/items/' + (id + 1)).then(response => {
                const items = response.body;
                this.orders[id].items = items;
                console.log(this.orders[id].items);
                this.loading = false;
            }, response => { 
                console.log(response.body);
            });
        },
    },
    watch: {
        panel:  function(index) {
            if(index != null) {
                this.fetchItems(index)
            }
        }
    },
    created() {
        this.fetchOrders();
        this.fetchMaterials();
    },
}
</script>

<style>

.order.RECEIVED{
    border-left: 4px solid blue;
}
.order.IN_REALISATION{
    border-left: 4px solid red;
}
.order.READY{
    border-left: 4px solid green;
}
.order.DELIVERED{
    border-left: 4px solid yellow;
}
.order.PAID{
    border-left: 4px solid orange;
}

.v-chip.RECEIVED{
    background: blue;
}
.v-chip.IN_REALISATION{
    background: red;
}
.v-chip.READY{
    background: green;
}
.v-chip.DELIVERED{
    background: orange;
}
.v-chip.PAID{
    background: red;
}

</style>

