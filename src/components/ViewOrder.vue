<template>
    <v-dialog v-model="dialog" lazy>
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
              <v-btn dark flat @click="dialog = false">Edit</v-btn>
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
            <v-list two-line>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-sub-title>Customer</v-list-tile-sub-title>
                  <v-list-tile-title>{{ order.customer }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-sub-title>External Order Id</v-list-tile-sub-title>
                  <v-list-tile-title>{{ order.externalOrderId }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-sub-title>Invoice Number</v-list-tile-sub-title>
                  <v-list-tile-title>{{ order.invoiceNumber }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-sub-title>Price</v-list-tile-sub-title>
                  <v-list-tile-title>{{ order.price }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-sub-title>Create Date</v-list-tile-sub-title>
                  <v-list-tile-title>{{ order.createDate }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-sub-title>Due Date</v-list-tile-sub-title>
                  <v-list-tile-title>{{ order.dueDate }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-sub-title>Status</v-list-tile-sub-title>
                  <v-list-tile-title>
                      <v-chip small :class="`${order.status} white--text caption my-2`">{{ order.status }}</v-chip>
                  </v-list-tile-title> 
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-divider></v-divider>
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
                                    <v-chip small :class="`status ${operationStatusValues[operationStatusItems.indexOf(item.status)]} white--text caption my-2`">{{ item.status }}</v-chip>
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
                                      <v-chip v-on="on" :class="`status ${operationStatusValues[operationStatusItems.indexOf(operation.status)]} white--text caption my-2`">
                                        {{ operation.status }}
                                      </v-chip>
                                    </template>
                                    <v-list>
                                      <v-list-tile v-for="(status, index) in operationStatusItems" :key="index" @click="changeStatus(item, operation, status)">
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

export default {
    props: [ 
        'materialsItems',
        'orderId',
        'orderStatusItems',
        'orderStatusValues',
        'operationStatusItems'
     ],
    data() {
        return {
            dialog: false,
            panel: [],
            items: [],
            operationStatusValues: ['Disabled', 'ReadyForRealisation', 'InRealisation', 'Done'],

            stageOneOperations: ['Cutting', 'Sanding', 'Drilling', 'CNC'],
            stageTwoOperations: ['Hardening', 'Enamelling', 'Lamination'],
            stageOneCounter: [],

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
                this.prepareStatuses();
                this.loading = false;
            }, response => { 
                console.log(response.body);
            });
        },
        prepareStatuses() {
          
          var i = 0;
          var item;
          for(item of this.order.items){

            // check if there is any operation from stage one and count them
            this.stageOneCounter.push(0);
            var operation;
            for(operation of item.operations) {
              if(this.stageOneOperations.includes(operation.name)) {
                this.stageOneCounter[i]++;
              }
            }
          };
        },
        changeStatus(item, operation, newStatus) {
          operation.status = newStatus;
          if(newStatus == "In Realisation") {
            this.disableOtherOperationsInStage(item, operation);
          } else if(newStatus == "Done") {
              if(this.stageOneOperations.includes(operation.name)) {
                this.stageOneCounter[this.order.items.indexOf(item)]--;
                if(this.stageOneCounter[this.order.items.indexOf(item)] > 0) {
                  this.enableOtherOperationsInStage(item, operation);
                } else {
                  this.enableStageTwoOperations(item);
                }
              } else {
                this.enableOtherOperationsInStage(item, operation);
              }
          }
        },
        disableOtherOperationsInStage(item, operation) {
          var otherOperation;
          if(this.stageOneOperations.includes(operation.name)) {
            for(otherOperation of item.operations) {
              if(this.stageOneOperations.includes(otherOperation.name) && otherOperation != operation && otherOperation.status != "Done") {
                this.disableOperation(otherOperation);
              }
            }  
          } else {
            for(otherOperation of item.operations) {
              if(this.stageTwoOperations.includes(otherOperation.name) && otherOperation != operation && otherOperation.status != "Done") {
                this.disableOperation(otherOperation);
              }
            }  
          }
        },
        enableOtherOperationsInStage(item, operation) {
          var otherOperation;
          if(this.stageOneOperations.includes(operation.name)) {
            for(otherOperation of item.operations) {
              if(this.stageOneOperations.includes(otherOperation.name) && otherOperation != operation && otherOperation.status == "Disabled") {
                this.enableOperation(otherOperation);
              }
            }  
          } else {
            for(otherOperation of item.operations) {
              if(this.stageTwoOperations.includes(otherOperation.name) && otherOperation != operation && otherOperation.status == "Disabled") {
                this.enableOperation(otherOperation);
              }
            }  
          }
        },
        enableStageTwoOperations(item) {
          var otherOperation;
          for(otherOperation of item.operations) {
            if(this.stageTwoOperations.includes(otherOperation.name)) {
              this.enableOperation(otherOperation);
            }
          }  
        },
        disableOperation(operation) {
            operation.status = this.operationStatusItems[0];
        },
        enableOperation(operation) {
            operation.status = this.operationStatusItems[1];
        }
    },
}
</script>
<style>

  .v-chip.ReadyForRealisation{
      background: blue;
  }
  .v-chip.InRealisation{
      background: red;
  }
  .v-chip.Done{
      background: green;
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