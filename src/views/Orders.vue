<template>
    <div>
        <h1 class="subheading grey--text">Orders</h1>

        <v-container>
            <v-btn @click="fetchOrders" :loading="loading">Refresh</v-btn>
            <AddOrder @orderAdded="fetchOrders"/>
            <v-card v-for="order in orders" :key="order.customer">
                <v-layout row wrap :class="`pa-3 order ${order.status}`">
                    <v-flex>
                        <div class="caption grey--text">External Order Id</div>
                        <div>{{ order.externalOrderId }}</div>
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
                <v-divider></v-divider>
            </v-card>

        </v-container>
    </div>
</template>

<script>
import AddOrder from '@/components/AddOrder'
export default {
    components: { AddOrder },
    data() {
        return {
            loading: false,
            orders: []
        }
    },
     methods: {
        fetchOrders() {
            this.loading = true;
            this.$http.get('http://localhost:9090/orders').then(response => {
            this.orders = response.body;
            this.loading = false;
        }, response => { 
            console.log(response.body);
        });
        }
    },
    created() {
        this.fetchOrders();
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

