<template>
    <div>
        <h1 class="subheading grey--text">Operacje</h1>

    
        <v-btn icon @click="fetchOperations" :loading="loading">
            <v-icon>refresh</v-icon>
        </v-btn>
        <v-container fluid>
            <v-card v-for="operation in operations" :key="operation.id">
                <v-layout row wrap :class="`pa-3 item ${operation.status}`">
                    <v-flex>
                        <div class="caption grey--text">Id</div>
                        <div>{{ operation.id }}</div>
                    </v-flex>
                    <v-flex>
                        <div class="caption grey--text">Nazwa:</div>
                        <div>{{ operation.name }}</div>
                    </v-flex>
                    <v-flex>
                        <ViewOrder @refresh='fetchOperations' v-bind:materialsItems="materialsItems" v-bind:orderId="operation.orderId"
                                    v-bind:orderStatusItems="orderStatusItems" v-bind:operationStatusItems="operationStatusItems"/>
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
            </v-card>
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
            materials: [],
            materialsItems: [],
            orderStatusItems: ['PRZYJĘTO', 'W_REALIZACJI', 'GOTOWE', 'WYDANE', 'ROZLICZONE'],
            operationStatusItems: ['ZABLOKOWANE', 'GOTOWE_DO_REALIZACJI' , 'W_REALIZACJI', 'ZROBIONE'],
            panel: [],
            loading: false,
            operations: []
        }
    },
    methods: {
        fetchOperations() {
            this.loading = true;
            this.$http.get('http://' + process.env.VUE_APP_HOST + ':' + process.env.VUE_APP_BACKEND_PORT + '/operations').then(response => {
                this.operations = response.body;
                console.log(this.operations);
                this.loading = false;
            }, response => { 
                console.log(response.body);
            });
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
              const order = response.body;
              console.log(order);
              var index;
              for(index = 0; index < order.items.length; index++) {
                  if(order.items[index].id == operation.item.id) {
                        var operationIndex;
                        for(operationIndex = 0; operationIndex < order.items[index].operations.length; operationIndex++) {
                            this.findOperation(order.items[index].operations[operationIndex].id).status = order.items[index].operations[operationIndex].status;
                        }
                  }
              }
              
              console.log(response.status);
              this.loading = false;
          }, response => {
              console.log(response);
          });
        },
        findOperation(operationId) {
            var index;
            for(index = 0; index < this.operations.length; index++) {
                if(this.operations[index].id == operationId) {
                    return this.operations[index];
                }
            }
        },
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
    },
    created() {
        this.fetchOperations();
        this.fetchMaterials();
    },
}
</script>

<style>

.operation.GOTOWE_DO_REALIZACJI{
    border-left: 4px solid blue;
}
.operation.W_REALIZACJI{
    border-left: 4px solid red;
}
.operation.ZROBIONE{
    border-left: 4px solid green;
}

.v-chip.PRZYJĘTO{
    background: blue;
}
.v-chip.W_REALIZACJI{
    background: red;
}
.v-chip.ZROBIONE{
    background: green;
}</style>

