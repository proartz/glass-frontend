<template>
    <v-container>
        <v-layout>
            <v-card tile>
                <v-card-text>
                    <v-form ref="form">
                        <v-text-field
                            v-validate="`required|max:30`"
                            :counter="30"
                            :error-messages="errors.collect('customer')"
                            data-vv-name="customer"
                            label="Klient"
                            v-model="order.customer"
                            @change="isOrderEdited = true"
                        >
                        </v-text-field>
                        <v-text-field
                            v-validate="`max:30`"
                            :counter="30"
                            :error-messages="errors.collect('externalOrderId')"
                            data-vv-name="externalOrderId"
                            label="Zewnętrzny Numer Zlecenia"
                            v-model="order.externalOrderId"
                            @change="isOrderEdited = true"
                        >
                        </v-text-field>
                        <v-text-field
                            v-validate="`max:30`"
                            :counter="30"
                            :error-messages="errors.collect('invoiceNumber')"
                            data-vv-name="invoiceNumber"
                            label="Numer Faktury"
                            v-model="order.invoiceNumber"
                            @change="isOrderEdited = true"
                        >
                        </v-text-field>
                        <v-text-field
                            v-validate="`numeric|max_value:999999999999999999`"
                            :error-messages="errors.collect('price')"
                            data-vv-name="price"
                            label="Cena"
                            v-model="order.price"
                            @change="isOrderEdited = true"
                        >
                        </v-text-field>
                        <v-menu>
                            <v-text-field
                                v-validate="`required`"
                                :error-messages="errors.collect('dueDate')"
                                data-vv-name="dueDate"
                                label="Termin Realizacji"
                                :value="order.dueDate"
                                slot="activator"
                                @change="isOrderEdited = true">
                            </v-text-field>
                            <v-date-picker
                                v-model="order.dueDate"
                                :min="now"
                            >
                            </v-date-picker>
                        </v-menu>
                        <v-text-field
                            v-validate="`max:100`"
                            counter="100"
                            :error-messages="errors.collect('description')"
                            data-vv-name="description"
                            label="Opis"
                            v-model="order.description"
                            @change="isOrderEdited = true"
                        >
                        </v-text-field>
                        <v-chip :class="`${order.status} white--text caption my-2`">{{ order.status }}</v-chip>
                        <v-spacer></v-spacer>
                    </v-form>
                    <v-divider></v-divider>
                    <v-subheader class="pa-0">POZYCJE
                    <AddItem v-if="order.status != orderStatusEnum.ROZLICZONE" @addItem='addItem' v-bind:materialsItems="materialsItems" v-bind:materials="materials" v-bind:operationStatusItems="operationStatusItems"/>
                    </v-subheader>
                    <v-dialog  v-if="itemToDelete" v-model="deleteDialog" width="500">
                        <v-card>
                            <v-card-title class="headline grey lighten-2" primary-title>
                                Usuń Pozycję
                            </v-card-title>
                            <v-card-text>
                                Czy na pewno chcesz usunąć pozycję {{ itemToDelete.material.name }} ?
                            </v-card-text>
                            <v-divider></v-divider>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn flat @click="deleteItem(itemToDelete)">
                                    ok
                                </v-btn>
                                <v-btn flat @click="deleteDialog = false">
                                    anuluj
                                </v-btn>
                            </v-card-actions>
                        </v-card>rE
                    </v-dialog>
                        <v-layout row wrap v-for="item in order.items" :key="item.id" :class="`py-0 item ${item.status}`">
                            <v-flex>
                                <v-btn v-if="isReadyForDelete(item)" icon @click.stop="openDeleteDialog(item)">
                                    <v-icon>delete</v-icon>
                                </v-btn>
                            </v-flex>
                            <v-flex>
                                <div class="caption grey--text">Materiał</div>
                                <div>{{ item.material.name }}</div>
                            </v-flex>
                            <v-flex>
                                <div class="caption grey--text">Szerokość</div>
                                <div>{{ item.width }}</div>
                            </v-flex>
                            <v-flex>
                                <div class="caption grey--text">Wysokość</div>
                                <div>{{ item.height }}</div>
                            </v-flex>
                            <v-flex>
                                <div class="caption grey--text">Grubość</div>
                                <div>{{ item.depth }}</div>
                            </v-flex>
                            <v-flex>
                                <div class="caption grey--text">Ilość</div>
                                <div>{{ item.quantity }}</div>
                            </v-flex>
                            <v-flex>
                                <ViewOperations @refresh='refresh' v-bind:operations="item.operations"/>
                            </v-flex>
                        </v-layout>
                </v-card-text>
            </v-card>
        </v-layout>
    </v-container>
</template>

<script>
import AddItem from '@/components/AddItem';
import ViewOperations from '@/components/ViewOperations';
import EventBus from '@/event-bus.js';

export default {
    components: {
      AddItem,
      ViewOperations
    },
    props: [
        'id',
        'materialsItems',
        'materials',
        'orderId',
        'operationStatusItems'
     ],
    data() {
        return {
            isOrderEdited: false,
            now: '',
            dialog: false,
            panel: [],
            items: [],
            loading: false,
            deleteDialog: false,
            itemToDelete: '',
            orderStatusEnum: {
                PRZYJĘTO: 'PRZYJĘTO',
                W_REALIZACJI: 'W_REALIZACJI',
                GOTOWE: 'GOTOWE',
                WYDANE: 'WYDANE',
                ROZLICZONE: 'ROZLICZONE'
            },
            operationStatusEnum: {
                NIEROBIONE: 'NIEROBIONE',
                ZAPLANOWANE: 'ZAPLANOWANE',
                GOTOWE_DO_REALIZACJI: 'GOTOWE_DO_REALIZACJI',
                ZROBIONE: 'ZROBIONE'
            },

            stageOneOperations: ['Cięcie', 'Szlifowanie', 'Wiercenie', 'CNC'],
            stageTwoOperations: ['Hartowanie', 'Emaliowanie', 'Laminowanie', 'Wydanie'],

            order: {}
        }
    },
    methods: {
        refresh() {
            this.loadOrder(this.id);
        },
        loadOrder(id) {
            this.fetchOrder(id);
        },
        fetchOrder(id) {
            console.log("fetchOrder");
            this.loading = true;
            this.$http.get(process.env.VUE_APP_URL + '/order/' + id).then(response => {
                this.order = response.body;
                console.log(this.order);
                this.loading = false;
            }, response => { 
                console.log(response.body);
            });
        },
        isReadyForDelete(item) {
            // item can be deleted if it have id(it is not a new item, that haven't been added to the database)
            // and operation Cięcie is in status GOTOWE_DO_REALIZACJI
            if(item.id && item.operations[0].status == this.operationStatusEnum.GOTOWE_DO_REALIZACJI) {
                return true;
            }
            return false;
        },
        date() {
            var today = new Date();

            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            this.now = yyyy + '-' + mm + '-' + dd;
        },
        addItem(item) {
            this.order.items.push(item);
        },
        openDeleteDialog(item) {
            this.itemToDelete = item;
            this.deleteDialog = true;
        },
        deleteItem(item) {
            console.log(item);

            this.loading = true;

            const deleteItemDto = {
                id: item.id
            }

          console.log(item.id);

          this.$http.delete(process.env.VUE_APP_URL + '/item', {body: deleteItemDto}).then(response => {
              this.showSnackbar("Pozycja " + item.material.name + " została usunięta.");
              // remove the item from the order in viewOrder
            //   this.order.items.splice(this.items.indexOf(item), 1);
              console.log(response.status);
              this.refresh();
              this.$emit('refresh');
              this.itemToDelete = '';
              this.deleteDialog = false;
              this.loading = false;
          }, response => {
              console.log(response);
          });
        },
        changeStatus(operation, newStatus) {
          this.loading = true;

          const changeStatusDto = {
              operationId: operation.id,
              newStatus: newStatus
          };

          console.log(changeStatusDto);

          this.$http.post(process.env.VUE_APP_URL + '/changeStatus', changeStatusDto,
          {headers: {'Content-Type': 'application/json;charset=UTF-8'}}).then(response => {
              this.order = response.body;
              console.log(response.status);
              this.loading = false;
          }, response => {
              console.log(response);
          });
        },
        submit() {
            console.log("submit");
            this.$validator.validate().then(valid => {
                if(valid){
                    this.loading = true;

                    const order = {
                        id: this.id,
                        items: this.order.items,
                        attachments: [],
                        externalOrderId: this.order.externalOrderId,
                        customer: this.order.customer,
                        invoiceNumber: this.order.invoiceNumber,
                        price: this.order.price,
                        dueDate: this.order.dueDate,
                        status: this.order.status
                    };

                    console.log(order);

                    this.$http.post(process.env.VUE_APP_URL + '/updateOrder', order,
                    {headers: {'Content-Type': 'application/json;charset=UTF-8'}}).then(response => {
                        this.order = response.body;
                        console.log(response.body);
                        this.loading = false;
                        this.isOrderEdited = false;
                    }, response => {
                        console.log(response);
                    });
                }
            });
        },
        showSnackbar(message) {
            EventBus.$emit('showSnackbar', message);
        }
    },
    created() {
        this.date();
        this.loadOrder(this.id);
        EventBus.$on('submit', () => { this.submit() });
        EventBus.$on('refreshOperations', () => { this.refresh() });
    },
    watch: {
        isOrderEdited: function() {
            if(this.isOrderEdited) {
                EventBus.$emit('enableSave');
            }
            else {
                EventBus.$emit('disableSave');
            }
        }
    }
}
</script>
<style>

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
    
    .v-chip.GOTOWE_DO_REALIZACJI{
        background: blue;
    }
    .v-chip.ZROBIONE{
        background: green;
    }
</style>