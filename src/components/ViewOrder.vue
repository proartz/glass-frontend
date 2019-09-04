<template>
    <v-dialog ref="showDialog" v-model="dialog" lazy>
         <v-btn slot="activator" @click="loadOrder" text icon color="gray">
            <v-icon>remove_red_eye</v-icon>
        </v-btn>
         <v-card tile>
          <v-toolbar card dark color="primary">
            <v-btn icon dark @click="dialog = false">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Order</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark flat @click="submit" :disabled = "!editMode" :loading="loading">Save</v-btn>
              <v-btn dark flat @click="editMode = !editMode">Edit</v-btn>
            </v-toolbar-items>
            <v-menu bottom right offset-y>
              <template v-slot:activator="{ on }">
                <v-btn dark icon v-on="on">
                  <v-icon>more_vert</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-tile v-for="(item, i) in items" :key="i" @click="">
                  <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form">
                <v-text-field v-validate="`required|max:30`"
                              :counter="30"
                              :error-messages="errors.collect('customer')"
                              data-vv-name="customer"
                              label="Customer"
                              v-model="order.customer"
                              :readonly="!editMode">
                </v-text-field>
                <v-text-field v-validate="`max:30`"
                              :counter="30"
                              :error-messages="errors.collect('externalOrderId')"
                              data-vv-name="externalOrderId"
                              label="External Order Id"
                              v-model="order.externalOrderId"
                              :readonly="!editMode">
                </v-text-field>
                <v-text-field v-validate="`max:30`"
                              :counter="30"
                              :error-messages="errors.collect('invoiceNumber')"
                              data-vv-name="invoiceNumber"
                              label="Invoice Number"
                              v-model="order.invoiceNumber"
                              :readonly="!editMode">
                </v-text-field>
                <v-text-field v-validate="`numeric|max_value:999999999999999999`"
                              :error-messages="errors.collect('price')"
                              data-vv-name="price"
                              label="Price"
                              v-model="order.price"
                              :readonly="!editMode">
                </v-text-field>
                <v-menu>
                    <v-text-field v-validate="`required`"
                                  :error-messages="errors.collect('dueDate')"
                                  data-vv-name="dueDate"
                                  label="Due Date"
                                  :value="order.dueDate"
                                  slot="activator">
                    </v-text-field>
                    <v-date-picker :disabled="!editMode" v-model="order.dueDate"
                                  :min="now">
                    </v-date-picker>
                </v-menu>
                <v-chip :class="`${order.status} white--text caption my-2`">{{ order.status }}</v-chip>
                <v-spacer></v-spacer>
            </v-form>
            <v-divider></v-divider>
            <v-subheader class="pa-0">ITEMS
              <AddItem v-if="editMode" @addItem='addItem' v-bind:materialsItems="materialsItems" v-bind:operationStatusItems="operationStatusItems"/>
            </v-subheader>
            <v-expansion-panel v-model="panel" expand>
                <v-expansion-panel-content v-for="item in order.items" :key="item.id">
                    <template v-slot:header>
                        <v-layout row wrap :class="`py-0 item ${item.status}`">
                            <v-flex>
                                <div class="caption grey--text">Material</div>
                                <div>{{ materialsItems[item.materialId - 1] }}</div>
                            </v-flex>
                            <v-flex>
                                <div class="caption grey--text">Width</div>
                                <div>{{ item.width }}</div>
                            </v-flex>
                            <v-flex>
                                <div class="caption grey--text">Height</div>
                                <div>{{ item.height }}</div>
                            </v-flex>
                            <v-flex>
                                <div class="caption grey--text">Depth</div>
                                <div>{{ item.depth }}</div>
                            </v-flex>
                            <v-flex>
                                <div class="caption grey--text">Quantity</div>
                                <div>{{ item.quantity }}</div>
                            </v-flex>
                            <v-flex>
                                <div class="right">
                                    <v-chip small :class="`status ${item.status} white--text caption my-2`">{{ item.status }}</v-chip>
                                </div>
                            </v-flex>
                        </v-layout>
                    </template>
                    <v-divider></v-divider>
                    <v-container class="py-1 pl-5">
                        <v-layout row v-for="operation in item.operations" :key="operation.id">
                            <v-flex>
                                <div class="caption grey--text">Id:</div>
                                <div>{{ operation.id }}</div>
                            </v-flex>
                            <v-flex>
                                <div class="caption grey--text">Name:</div>
                                <div>{{ operation.name }}</div>
                            </v-flex>
                            <v-flex>
                                <div>
                                  <v-menu offset-y :disabled="`${operation.status}` == operationStatusItems[0] || `${operation.status}` == operationStatusItems[3]">
                                    <template v-slot:activator="{ on }">
                                      <v-chip v-on="on" :class="`status ${operation.status} white--text caption my-2`">
                                        {{ operation.status }}
                                      </v-chip>
                                    </template>
                                    <v-list>
                                      <v-list-tile v-for="(status, index) in operationStatusItems" :key="index" @click="changeStatus(operation, status)">
                                        <v-list-tile-title>{{ status }}</v-list-tile-title>
                                      </v-list-tile>
                                    </v-list>
                                  </v-menu>
                                </div>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import AddItem from '@/components/AddItem'

export default {
    components: {
      AddItem
    },
    props: [ 
        'materialsItems',
        'orderId',
        'operationStatusItems'
     ],
    data() {
        return {
            now: '',
            dialog: false,
            panel: [],
            items: [],
            editMode: false,
            loading: false,

            stageOneOperations: ['Cutting', 'Sanding', 'Drilling', 'CNC'],
            stageTwoOperations: ['Hardening', 'Enamelling', 'Lamination'],

            order: {}
        }
    },
    methods: {
        loadOrder() {
          this.fetchOrder();
        },
        fetchOrder() {
            this.loading = true;
            this.$http.get('http://' + process.env.VUE_APP_HOST + ':' + process.env.VUE_APP_BACKEND_PORT + '/order/' + this.orderId).then(response => {
                this.order = response.body;
                console.log(this.order);
                this.loading = false;
            }, response => { 
                console.log(response.body);
            });
        },
        open() {
            this.$refs.showDialog.value = true;
            console.log("DUPA");
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
        changeStatus(operation, newStatus) {
          this.loading = true;

          const changeStatusDto = {
              operationId: operation.id,
              newStatus: newStatus
          };

          console.log(changeStatusDto);

          this.$http.post('http://' + process.env.VUE_APP_HOST + ':' + process.env.VUE_APP_BACKEND_PORT + '/changeStatus', changeStatusDto,
          {headers: {'Content-Type': 'application/json;charset=UTF-8'}}).then(response => {
              this.order = response.body;
              console.log(response.status);
              this.$emit('refresh');
              this.loading = false;
          }, response => {
              console.log(response);
          });
        },
        submit() {
            this.$validator.validate().then(valid => {
                if(valid){
                    this.loading = true;

                    const order = {
                        id: this.orderId,
                        items: this.order.items,
                        attachments: [],
                        externalOrderId: this.order.externalOrderId,
                        customer: this.order.customer,
                        invoiceNumber: this.order.invoiceNumber,
                        price: this.order.price,
                        dueDate: this.order.dueDate,
                        status: ''
                    };

                    console.log(order);

                    this.$http.post('http://' + process.env.VUE_APP_HOST + ':' + process.env.VUE_APP_BACKEND_PORT + '/updateOrder', order,
                    {headers: {'Content-Type': 'application/json;charset=UTF-8'}}).then(response => {
                        this.order = response.body;
                        console.log(response.body);
                        this.editMode = false;
                        this.loading = false;
                        this.$emit('refresh');
                    }, response => {
                        console.log(response);
                    });
                }
            });
        },
    },
    watch: {
        dialog:  function() {
            if(!this.dialog) {
                this.editMode = false;
                console.log(this.editMode);
            }
        }
    },
    created() {
        this.date();
    }
}
</script>
<style>

    .v-chip.READY_FOR_REALISATION{
        background: blue;
    }
    .v-chip.IN_REALISATION{
        background: red;
    }
    .v-chip.DONE{
        background: green;
    }
    .v-chip.RECEIVED{
        background: blue;
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
    .item.ReadyForRealisation{
        border-left: 4px solid blue;
    }
    .item.InRealisation{
        border-left: 4px solid red;
    }
    .item.Done{
        border-left: 4px solid green;
    }

</style>