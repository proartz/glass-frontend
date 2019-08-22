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
                        <v-layout row wrap :class="`py-0 item ${operationStatusValues[operationStatusItems.indexOf(item.status)]}`">
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
                                  <v-menu offset-y>
                                    <template v-slot:activator="{ on }">
                                      <v-chip v-on="on" :class="`status ${operationStatusValues[operationStatusItems.indexOf(operation.status)]} white--text caption my-2`">
                                        {{ operation.status }}
                                      </v-chip>
                                    </template>
                                    <v-list>
                                      <v-list-tile v-for="(status, index) in operationStatusItems" :key="index" @click="operation.status = status">
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
            disabledOperations: [
              [false, true, true, true],
              [false, false, false, true]
            ],

            order: {}
        }
    },
    methods: {
        loadOrder() {
          this.fetchOrder();
          this.prepareStatuses();
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
        prepareStatuses() {
          
          var i = 0;
          this.order.items.forEach(item => {

            // check if there is any operation from stage one and count them
            this.stageOneCounter.push(0);
            for(operation in item.operations) {
              if(this.stageOneOperations.includes(operation)) {
                this.stageOneCounter[i]++;
              }
            }

            // if there are operations in stageone, disable every operation that is in stage two
            if(this.stageOneCounter[i] > 0 ){
              this.disableStageTwoOperations(i);
            }
            i++;
          });
        },
        disableStageTwoOperations(item) {
          for(operation in this.order.items[item]) {
            if(this.stageTwoOperations.includes(operation)) {
              this.disableOperation(operation);
            }
          }
        },
        disableOperation(operation) {

        }
    },
    computed: {
      sortedOperations(item) {
        
      }
    }
    // created() {
    //     this.fetchOrder();
    // }
}
</script>
<style>

  .status.ReadyForRealisation{
      background: blue;
  }
  .status.InRealisation{
      background: red;
  }
  .status.Done{
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