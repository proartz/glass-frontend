<template>
    <div>
        <h1 class="subheading grey--text">Positions</h1>

        <v-layout row justify-start class="mb-3">
            <v-flex>
                <v-btn icon @click="refresh" :loading="loading">
                    <v-icon>refresh</v-icon>
                </v-btn>
            </v-flex>
            <v-btn icon @click="groupStatusChange">
                <v-icon>done</v-icon>
            </v-btn>
            <v-flex>
                <v-select :items="operationsItems" v-model="operationsFilter" label="Filtruj gotowe do:"></v-select>
            </v-flex>
        </v-layout>
        <v-container fluid>
            <v-expansion-panel v-model="panel" expand>
                <v-expansion-panel-content expand v-for="order in filteredOrders" :key="order.id">
                    <template v-slot:header class="pa-0 ma-0">
                        <v-layout row wrap :class="`pa-0 ma-0 order ${order.status}`">
                             <v-flex>
                                <v-checkbox v-model="groupOrders[orders.indexOf(order)]" @change="selectAllItems(orders.indexOf(order))">
                                </v-checkbox>
                            </v-flex>
                            <v-flex>
                                <div class="caption grey--text">Zewnętrzny Numer Zlecenia</div>
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
                                <v-checkbox ref="items"
                                            :id="`${item.id}`"
                                            v-model="groupItems[orders.indexOf(order)][order.items.indexOf(item)]">
                                </v-checkbox>
                            </v-flex>
                            <v-flex>
                                <div class="caption grey--text">Id</div>
                                <div>{{ item.id }}</div>
                            </v-flex>
                            <v-flex>
                                <div class="caption grey--text">Materiał:</div>
                                <div>{{ item.material.name }}</div>
                            </v-flex>
                            <v-flex>
                                <div class="caption grey--text">Szerokość:</div>
                                <div>{{ item.width }}</div>
                            </v-flex>
                            <v-flex>
                                <div class="caption grey--text">Wysokość:</div>
                                <div>{{ item.height }}</div>
                            </v-flex>
                            <v-flex>
                                <div class="caption grey--text">Grubość:</div>
                                <div>{{ item.depth }}</div>
                            </v-flex>
                            <v-flex>
                                <div class="caption grey--text">Ilość:</div>
                                <div>{{ item.quantity }}</div>
                            </v-flex>
                            <v-flex>
                                <ViewOperations @refresh='refresh' v-bind:operations="item.operations"/>
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
import ViewOperations from '@/components/ViewOperations'

export default {
    components: {
      ViewOrder,
      ViewOperations
    },
    data() {
        return {
            readyForOperation: false,
            operationsFilter: 'Wszystkie',
            operationsEnum: {
                WSZYSTKIE: 'Wszystkie',
                CIĘCIE: 'Cięcie',
                SZLIFOWANIE: 'Szlifowanie',
                WIERCENIE: 'Wiercenie',
                CNC: 'CNC',
                HARTOWANIE: 'Hartowanie',
                EMALIOWANIE: 'Emaliowanie',
                LAMINOWANIE: 'Laminowanie',
                WYDANIE: 'Wydanie',
                ROZLICZENIE: 'Rozliczenie'
            },
            orderStatusEnum: {
                PRZYJĘTO: 'PRZYJĘTO',
                W_REALIZACJI: 'W_REALIZACJI',
                GOTOWE: 'GOTOWE',
                WYDANE: 'WYDANE',
                ROZLICZONE: 'ROZLICZONE'
            },
            groupItems: [],
            groupOrders: [],
            operationsItems: ['Wszystkie', 'Cięcie', 'Szlifowanie', 'Wiercenie', 'CNC', 'Hartowanie', 'Emaliowanie', 'Laminowanie', 'Wydanie', 'Rozliczenie'],
            materials: [],
            materialsItems: [],
            orderStatusItems: ['PRZYJĘTO', 'W_REALIZACJI', 'GOTOWE', 'WYDANE', 'ROZLICZONE'],
            operationStatusItems: ['ZABLOKOWANE', 'GOTOWE_DO_REALIZACJI' , 'W_REALIZACJI', 'ZROBIONE'],
            operationStatusEnum: {
                ZABLOKOWANE: 'ZABLOKOWANE',
                GOTOWE_DO_REALIZACJI: 'GOTOWE_DO_REALIZACJI',
                W_REALIZACJI: 'W_REALIZACJI',
                ZROBIONE: 'ZROBIONE'
            },
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
                this.initializeGroupItems();
                this.initializeGroupOrders();
                this.ordersFetched = true;
                // this.expandAll();
                this.loading = false;
            }, response => { 
                console.log(response.body);
            });
        },
        initializeGroupItems() {
            // create twodimensional array for a groupItems
            this.groupItems = new Array(this.orders.length);
            var i;
            for(i = 0; i < this.orders.length; i++) {
                this.groupItems[i] = new Array(this.orders[i].items.length);
            }

            // initialize groupItems with false
            for(i = 0; i < this.groupItems.length; i++) {
                var j;
                for(j = 0; j < this.groupItems[i].length; j++) {
                    this.groupItems[i][j] = false;
                }
            }
            console.log(this.groupItems);
        },
        initializeGroupOrders() {
            this.groupOrders = new Array(this.orders.length);
            var i;
            for(i = 0; i < this.groupOrders.length; i++) {
                this.groupOrders[i] = false;
            }
        },
        selectAllItems(orderId) {
            var i;
            for(i = 0; i < this.groupItems[orderId].length; i++) {
                this.groupItems[orderId][i] = !this.groupItems[orderId][i];
            }
        },
        getFilteredItems(items) {
            if(this.operationsFilter != this.operationsEnum.ROZLICZENIE) {
                return items.filter(this.includes);
            } else {
                return items;
            }

        },
        fetchMaterials() {
            this.loading = true;
            this.$http.get('http://' + process.env.VUE_APP_HOST + ':' + process.env.VUE_APP_BACKEND_PORT + '/materials').then(response => {
                this.materials = response.body;
                this.materials.forEach((material) => {
                    this.materialsItems.push(material.name);
                });
                this.loading = false;
            }), response => {
                console.error(response);
            }
        },
        groupStatusChange() {
            if(this.operationsFilter != this.operationsEnum.WSZYSTKIE) {
                var i;
                for(i = 0; i < this.$refs.items.length; i++) {
                    if(this.$refs.items[i]._data.lazyValue) {
                        this.loading = true;
                        var itemId = this.$refs.items[i]._props.id;
                        var item = this.findItem(itemId);
                        var operationId = this.findOperationReadyForRealisation(item);
                        console.log("itemId=" + itemId);
                        console.log("item=");
                        console.log(item);
                        console.log("operationId=" + operationId);

                        const changeStatusDto = {
                            operationId: operationId,
                            newStatus: this.operationStatusEnum.ZROBIONE
                        };

                        console.log(changeStatusDto);

                        this.$http.post('http://' + process.env.VUE_APP_HOST + ':' + process.env.VUE_APP_BACKEND_PORT + '/changeStatus', changeStatusDto,
                        {headers: {'Content-Type': 'application/json;charset=UTF-8'}}).then(response => {
                            console.log(response.status);
                            this.refresh();
                            this.loading = false;
                        }, response => {
                            console.log(response);
                        });
                        // console.log(this.$refs.items[i]._props.id);
                    }
                }
            }
        },
        findItem(itemId) {
            var i;
            for(i = 0; i < this.orders.length; i++) {
                var j;
                for(j = 0; j < this.orders[i].items.length; j++) {
                    if(this.orders[i].items[j].id == itemId) {
                        return this.orders[i].items[j];
                    }
                }
            }
            return null;
        },
        findOperationReadyForRealisation(item) {
            var i;
            for(i = 0; i < item.operations.length; i++) {
                if(item.operations[i].status == this.operationStatusEnum.GOTOWE_DO_REALIZACJI) {
                    return item.operations[i].id;
                }
            }
            return null;
        },
        includesOrder(order) {
            var result = true;
            if(this.operationsFilter != this.operationsEnum.WSZYSTKIE) {
                result = result && this.isOrderReadyForOperation(order);
            }
            return result;
        },
        isOrderReadyForOperation(order) {
            if(this.operationsFilter == this.operationsEnum.ROZLICZENIE) {
                if(order.status == this.orderStatusEnum.WYDANE) {
                    return true;
                }
            } else {
                var i;
                for(i = 0; i < order.items.length; i++) {
                    if(this.isReadyForOperation(order.items[i])) {
                        return true;
                    }
                }
            }
            return false;
        },
        includes(item) {
            var result = true;
            if(this.operationsFilter != this.operationsEnum.WSZYSTKIE) {
                result = result && this.isReadyForOperation(item);
            }
            return result;
        },
        isReadyForOperation(item) {
            var i;
            for(i = 0; i < item.operations.length; i++) {
                if(item.operations[i].name == this.operationsFilter) {
                    var result = item.operations[i].status == this.operationStatusEnum.GOTOWE_DO_REALIZACJI;
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
    watch: {
        filteredOrders: function() {
            this.expandAll();
        },
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

.item.GOTOWE_DO_REALIZACJI{
    border-left: 4px solid blue;
}
.item.W_REALIZACJI{
    border-left: 4px solid red;
}
.item.ZROBIONE{
    border-left: 4px solid green;
}

.v-chip.PRZYJĘTO{
    background: blue;
}
.v-chip.W_REALIZACJI{
    background: red;
}
.v-chip.GOTOWE{
    background: green;
}</style>

