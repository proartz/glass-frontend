<template>
    <div>
        <h1>Orders</h1>

        <v-container>
            
            <v-card v-for="order in orders" :key="order.customer">
                <v-layout row :class="`order ${order.status}`">
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
                        <div class="caption grey--text">Realisation Date</div>
                        <div>{{ order.realisationDate }}</div>
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
export default {
    data() {
        return {
            orders: []
        }
    },
    created() {
        this.$http.get('http://192.168.1.21:9090/orders').then(response => {
            this.orders = response.body;
        }, response => { 
            console.log(response.body);
        });
    }

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

