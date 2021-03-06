<template>
    <v-container
        fluid
        text-xs-left
        >
        <template v-for="order in filteredOrders">
            <v-card
                :key="'order' + order.id"
                ripple
            >
                <v-layout
                    row
                    wrap
                    justify-start
                    :class="`pa-1 ma-0 order ${order.status}`">
                    <v-flex shrink mr-2>
                        <v-btn
                            small
                            icon
                            height="24"
                            @click="selectAllOrderItems(order)"
                            value="false"
                        >
                            <v-icon>select_all</v-icon>
                        </v-btn>
                    </v-flex>
                    <v-flex shrink mr-4 class="text-xs-left">
                        <div class="caption grey--text text-xs-left">Id</div>
                        <div class="slim">{{ order.id }}</div>
                    </v-flex>
                    <v-flex shrink mr-4>
                        <div class="caption grey--text">Zewnętrzny Numer Zlecenia</div>
                        <div class="slim">{{ order.externalOrderId }}</div>
                    </v-flex>
                </v-layout>
            </v-card>
            <template v-for="item in getFilteredItems(order.items)">
                <v-card
                    :key="item.id"
                >
                    <v-layout
                        row
                        wrap
                        align-center
                        :key="item.id"
                        :class="`pa-1 pl-4 ma-0 item ${item.status}`"
                    >
                        <v-flex shrink ml-3 mr-2>
                            <v-checkbox
                                ref="items"
                                :value="item.id"
                                v-model="itemsSelected"
                            >
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
                </v-card>
            </template>
        </template>
    </v-container>
</template>

<script>
import ViewOrder from '@/components/ViewOrder';
import ViewOperations from '@/components/ViewOperations';
import EventBus from '@/event-bus.js';
import api from '@/api.js';

export default {
    components: {
      ViewOrder,
      ViewOperations
    },
    data() {
        return {
            readyForOperation: false,
            operationsFilter: '',
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
            itemsSelected: [],
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
            api.fetchOrders().then(response => {
                this.orders = response.data;
                this.initializeGroupItems();
                this.initializeGroupOrders();
                this.ordersFetched = true;
                // this.expandAll();
                this.loading = false;
            }).catch( error => { 
                console.log(error);
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
        changeOperationsFilter(value) {
            this.operationsFilter = value;
            this.itemsSelected = [];
        },
        selectAllOrderItems(order) {
            console.log(order);
            order.items.forEach((item) => {
                if(!this.itemsSelected.includes(item.id)) {
                    this.itemsSelected.push(item.id);
                } else {
                    this.itemsSelected.splice(this.itemsSelected.indexOf(item.id), 1);
                }
            });
        },
        selectAllItems() {
            this.filteredOrders.forEach((order) => { this.selectAllOrderItems(order); })
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
            api.fetchMaterials().then(response => {
                this.materials = response.data;
                this.materials.forEach((material) => {
                    this.materialsItems.push(material.name);
                });
                this.loading = false;
            }).catch(error => {
                console.error(error);
            });
        },
        groupStatusChange() {
            if(this.operationsFilter != this.operationsEnum.WSZYSTKIE &&
                this.operationsFilter != '') {
                var i;
                for(i = 0; i < this.itemsSelected.length; i++) {
                    this.loading = true;
                    var itemId = this.itemsSelected[i];
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

                    api.changeStatus(changeStatusDto).then(response => {
                    }).catch(error => {
                        console.log(error);
                    });
                    // console.log(this.$refs.items[i]._props.id);
                }
                this.loading = false;
                this.operationsFilter = '';
                EventBus.$emit('operationsFilterChange', this.operationsFilter);
                this.itemsSelected = [];
                this.refresh();
            } else {
                this.showSnackbar("Nie można grupowo zmienić statusu pozycji przy filtrowaniu 'Wszystkie'. Wybierz inne filtrowanie.");
            }
        },
        showSnackbar(message) {
            EventBus.$emit('showSnackbar', message);
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
            if(this.operationsFilter != this.operationsEnum.WSZYSTKIE &&
                this.operationsFilter != '') {
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
            if(this.operationsFilter != this.operationsEnum.WSZYSTKIE &&
                this.operationsFilter != '') {
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
        EventBus.$on('refreshPositions', () => { this.refresh(); });
        EventBus.$on('operationsFilterInput', (input) => { this.changeOperationsFilter(input); });
        EventBus.$on('groupStatusChange', () => { this.groupStatusChange(); });
        EventBus.$on('refreshOperations', () => { this.refresh(); });
        EventBus.$on('selectAllItems', () => { this.selectAllItems(); })
    },
}
</script>

<style scoped>

/* .v-input--selection-controls{
    margin: 0px !important;
    padding: 0;
}

.v-input__slot {
    margin: 0;
} */

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
    border-left: 4px solid #EB0174;
}
.item.ZROBIONE{
    border-left: 4px solid green;
}

.v-chip.PRZYJĘTO{
    background: blue;
}
.v-chip.W_REALIZACJI{
    background: #EB0174;
}
.v-chip.GOTOWE{
    background: green;
}</style>

