<template>
    <div>
        <h1 class="subheading grey--text">Positions</h1>

    
        <v-btn @click="fetchItems" :loading="loading">Refresh</v-btn>
        <v-container fluid>
            <v-expansion-panel v-model="panel" >
                <v-expansion-panel-content v-for="item in items" :key="item.id">
                    <template v-slot:header>
                        <v-layout row wrap :class="`pa-3 item ${item.status}`">
                            <v-flex>
                                <div class="caption grey--text">Id</div>
                                <div>{{ item.id }}</div>
                            </v-flex>
                            <v-flex>
                               <ViewOrder @refresh='fetchItems' v-bind:materialsItems="materialsItems" v-bind:orderId="item.order.id"
                                          v-bind:orderStatusItems="orderStatusItems" v-bind:operationStatusItems="operationStatusItems"/>
                            </v-flex>
                            <v-flex>
                                <div class="caption grey--text">Material:</div>
                                <div>{{ materialsItems[item.materialId - 1] }}</div>
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
            orderStatusItems: ['RECEIVED', 'IN_REALISATION', 'READY', 'DELIVERED', 'PAID'],
            operationStatusItems: ['DISABLED', 'READY_FOR_REALISATION' , 'IN_REALISATION', 'DONE'],
            panel: [],
            loading: false,
            items: []
        }
    },
    methods: {
        fetchItems() {
            this.loading = true;
            this.$http.get('http://' + process.env.VUE_APP_HOST + ':' + process.env.VUE_APP_BACKEND_PORT + '/items').then(response => {
                this.items = response.body;
                console.log(this.items);
                this.loading = false;
            }, response => { 
                console.log(response.body);
            });
        },
        changeStatus(item, operation, newStatus) {
          this.loading = true;

          const changeStatusDto = {
              operationId: operation.id,
              newStatus: newStatus
          };
          console.log(operation);
          console.log(changeStatusDto);
          console.log(item.indexOf);

          this.$http.post('http://' + process.env.VUE_APP_HOST + ':' + process.env.VUE_APP_BACKEND_PORT + '/changeStatus', changeStatusDto,
          {headers: {'Content-Type': 'application/json;charset=UTF-8'}}).then(response => {
              const order = response.body;
              console.log(order);
              var index;
              for(index = 0; index < order.items.length; index++) {
                  if(order.items[index].id == item.id) {
                      const itemId = this.items.indexOf(item);
                      this.items[itemId].operations = order.items[index].operations;
                      this.items[itemId].status = order.items[index].status;
                      console.log(order.items[index]);
                  }
              }
              
              console.log(response.status);
              this.loading = false;
          }, response => {
              console.log(response);
          });
        },
        fetchOperations(itemId) {
            console.log("Item with id=" + itemId + " was selected.");
            this.loading = true;
            this.$http.get('http://' + process.env.VUE_APP_HOST + ':' + process.env.VUE_APP_BACKEND_PORT + '/operations/' + (itemId + 1)).then(response => {
                const operations = response.body;
                this.items[itemId].operations = operations;
                console.log(this.items[itemId].operations);
                this.loading = false;
            }, response => { 
                console.log(response.body);
            });
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
    watch: {
        panel:  function(index) {
            if(index != null) {
                this.fetchOperations(index)
            }
        }
    },
    created() {
        this.fetchItems();
        this.fetchMaterials();
    },
}
</script>

<style>

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

