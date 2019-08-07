<template>
    <div>
        <h1 class="subheading grey--text">Orders</h1>

    
        <v-btn @click="fetchOrders" :loading="loading">Refresh</v-btn>
        <AddOrder @orderAdded="fetchOrders" v-bind:materialsItems="materialsItems"/>
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
                               <ViewOrder v-bind:materialsItems="materialsItems" v-bind:orderId="order.id"/>
                            </v-flex>
                            <v-flex>
                                <v-btn text icon color="gray">
                                    <v-icon>edit</v-icon>
                                </v-btn>
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
            panel: [],
            loading: false,
            orders: []
        }
    },
     methods: {
        fetchOrders() {
            this.loading = true;
            this.$http.get('http://192.168.1.21:9090/orders').then(response => {
                this.orders = response.body;
                this.loading = false;
                console.log(this.orders);
            }, response => { 
                console.log(response.body);
            });
        },
        fetchMaterials() {
            this.loading = true;
            this.$http.get('http://192.168.1.21:9090/materials').then(response => {
                this.materials = response.body;
                console.log(this.materials);
                this.materials.forEach((material) => {
                    this.materialsItems.push(material.name);
                })
                console.log(this.materialsItems);
                this.loading = false;
            }), response => {
                console.error(response);
            }
        },
        fetchItems(id) {
            console.log("Order with id=" + id + " was selected.");
            this.loading = true;
            this.$http.get('http://192.168.1.21:9090/items/' + (id + 1)).then(response => {
                const items = response.body;
                this.orders[id].items = items;
                console.log(this.orders[id].items);
                this.loading = false;
            }, response => { 
                console.log(response.body);
            });
        }
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

.order.new{
    border-left: 4px solid blue;
}

.v-chip.new{
    background: blue;
}

</style>

