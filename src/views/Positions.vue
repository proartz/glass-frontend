<template>
    <div>
        <h1 class="subheading grey--text">Positions</h1>

        <v-layout row justify-start class="mb-3">
            <v-flex>
                <v-btn icon @click="refresh" :loading="loading">
                    <v-icon>refresh</v-icon>
                </v-btn>
            </v-flex>
            <v-flex>
                <v-checkbox v-model="readyForHardening" label="Ready for hardening"></v-checkbox>
            </v-flex>
        </v-layout>
        <v-container fluid>
            <v-expansion-panel v-model="panel" expand>
                <v-expansion-panel-content expand v-for="order in filteredOrders" :key="order.id">
                    <template v-slot:header class="pa-0 ma-0">
                        <v-layout row wrap :class="`pa-0 ma-0 order ${order.status}`">
                            <v-flex>
                                <div class="caption grey--text">External Order Id</div>
                                <div class="slim">{{ order.externalOrderId }}</div>
                            </v-flex>
                            <v-flex>
                               <ViewOrder @refresh='refresh' v-bind:materialsItems="materialsItems" v-bind:materials="materials" v-bind:orderId="order.id"
                                          v-bind:orderStatusItems="orderStatusItems" v-bind:operationStatusItems="operationStatusItems"/>
                            </v-flex>
                        </v-layout>
                    </template>
                    <v-divider></v-divider>
                    <v-container class="py-1 pl-5">
                        <v-layout row wrap v-for="item in getFilteredItems(order.items)" :key="item.id" :class="`pa-3 item ${item.status}`">
                            <v-flex>
                                <div class="caption grey--text">Id</div>
                                <div>{{ item.id }}</div>
                            </v-flex>
                            <v-flex>
                                <div class="caption grey--text">Material:</div>
                                <div>{{ item.material.name }}</div>
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
                            <v-flex>
                                <div class="right">
                                    <v-chip small :class="`${item.status} white--text caption my-2`">{{ item.status }}</v-chip>
                                </div>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-container>
    </div>
</template>

<script>
import ViewOrder from '@/components/ViewOrder';

export default {
    components: {
      ViewOrder
    },
    data() {
        return {
            readyForHardening: false,
            materials: [],
            materialsItems: [],
            orderStatusItems: ['RECEIVED', 'IN_REALISATION', 'READY', 'DELIVERED', 'PAID'],
            operationStatusItems: ['DISABLED', 'READY_FOR_REALISATION' , 'IN_REALISATION', 'DONE'],
            panel: [],
            loading: false,
            orders: [],
            ordersFetched: false,
        }
    },
    methods: {
        refresh() {
            this.loadData();
        },
        loadData() {
            this.fetchOrders();
            this.fetchMaterials();
        },
        fetchOrders() {
            this.loading = true;
            this.$http.get('http://' + process.env.VUE_APP_HOST + ':' + process.env.VUE_APP_BACKEND_PORT + '/orders').then(response => {
                this.orders = response.body;
                this.ordersFetched = true;
                this.expandAll();
                this.loading = false;
            }, response => { 
                console.log(response.body);
            });
        },
        getFilteredItems(items) {
            return items.filter(this.includes);
        },
        // changeStatus(item, operation, newStatus) {
        //   this.loading = true;

        //   const changeStatusDto = {
        //       operationId: operation.id,
        //       newStatus: newStatus
        //   };

        //   this.$http.post('http://' + process.env.VUE_APP_HOST + ':' + process.env.VUE_APP_BACKEND_PORT + '/changeStatus', changeStatusDto,
        //   {headers: {'Content-Type': 'application/json;charset=UTF-8'}}).then(response => {
        //       const order = response.body;
        //       var index;
        //       for(index = 0; index < order.items.length; index++) {
        //           if(order.items[index].id == item.id) {
        //               const itemId = this.items.indexOf(item);
        //               this.items[itemId].operations = order.items[index].operations;
        //               this.items[itemId].status = order.items[index].status;
        //           }
        //       }
              
        //       this.loading = false;
        //   }, response => {
        //       console.log(response);
        //   });
        // },
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
        includesOrder(order) {
            var result = true;
            if(this.readyForHardening) {
                result = result && this.isOrderReadyForHardening(order);
            }
            return result;
        },
        includes(item) {
            var result = true;
            if(this.readyForHardening) {
                result = result && this.isReadyForHardening(item);
            }
            return result;
        },
        isOrderReadyForHardening(order) {
            var i;
            for(i = 0; i < order.items.length; i++) {
                if(this.isReadyForHardening(order.items[i])) {
                    return true;
                }
            }
            return false;
        },
        isReadyForHardening(item) {
            var i;
            for(i = 0; i < item.operations.length; i++) {
                if(item.operations[i].name == "Hardening") {
                    var result = item.operations[i].status == this.operationStatusItems[1];
                    return result;
                }
            }
            return false;
        },
        expandAll() {
            // expands all items in orders
            this.panel = [...Array(this.orders.length).keys()].map(_ => true);
        }
    },
    computed: {
        filteredOrders() {
            return this.orders.filter(this.includesOrder);
        }
    },
    created() {
        this.loadData();
    },
}
</script>

<style scoped>
.v-expansion-panel__header{
    padding: 0px 0px;

}
.slim{
    margin: auto;
}

.item.READY_FOR_REALISATION{
    border-left: 4px solid blue;
}
.item.IN_REALISATION{
    border-left: 4px solid red;
}
.item.DONE{
    border-left: 4px solid green;
}

.v-chip.RECEIVED{
    background: blue;
}
.v-chip.IN_REALISATION{
    background: red;
}
.v-chip.DONE{
    background: green;
}</style>

