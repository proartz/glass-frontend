<template>
   <v-container fluid fill-height>
       <v-stepper
            v-model="e1"
        >
    <v-stepper-header>
      <v-stepper-step :complete="e1 > 1" step="1" editable>Podstawowe Informacje</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="e1 > 2" step="2" editable>Dodaj Pozycje</v-stepper-step>

      <v-divider></v-divider> 

      <v-stepper-step step="3" editable>Podsumowanie</v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
    <v-stepper-content step="1">
        <v-card flat class="pb-4">
            <v-form ref="form1" data-vv-scope="form1">
                <v-layout
                    row
                    wrap
                    justify-space-around
                    align-end
                    mb-6
                >
                    <v-flex md5>{
                        <v-text-field 
                            v-validate="`required|max:30`"
                            :counter="30"
                            :error-messages="errors.collect('form1.customer')"
                            data-vv-name="customer" label="Klient"
                            v-model="customer"
                        >
                        </v-text-field>
                    </v-flex>
                    <v-flex md5>
                        <v-text-field
                            v-validate="`max:30`"
                            :counter="30"
                            :error-messages="errors.collect('form1.externalOrderId')"
                            data-vv-name="externalOrderId"
                            label="Zewnętrzny Numer Zlecenia"
                            v-model="externalOrderId">
                        </v-text-field>
                    </v-flex>
                    <v-flex md5>
                        <v-text-field
                            v-validate="`max:30`"
                            :counter="30"
                            :error-messages="errors.collect('form1.invoiceNumber')"
                            data-vv-name="invoiceNumber"
                            label="Numer Faktury"
                            v-model="invoiceNumber">
                        </v-text-field>
                    </v-flex>
                    <v-flex md5>
                        <v-text-field
                            v-validate="`numeric|max_value:999999999999999999`"
                            :error-messages="errors.collect('form1.price')"
                            data-vv-name="price"
                            label="Cena"
                            v-model="price">
                        </v-text-field>
                    </v-flex>
                    <v-flex md5>
                        <v-textarea
                            v-validate="`max:100`"
                            counter="100"
                            :error-messages="errors.collect('form1.description')"
                            data-vv-name="description"
                            label="Opis"
                            v-model="description">
                        </v-textarea>
                    </v-flex>
                    <v-flex md5 class="text-xs-left">
                        <v-menu>
                            <v-text-field
                                v-validate="`required`"
                                :error-messages="errors.collect('form1.dueDate')"
                                data-vv-name="dueDate"
                                label="Termin Realizacji"
                                :value="dueDate"
                                slot="activator">
                            </v-text-field>
                            <v-date-picker v-model="dueDate"
                                            :min="now">
                            </v-date-picker>
                        </v-menu>
                    </v-flex>
                </v-layout>
            </v-form>
        </v-card>

        <v-btn
          color="primary"
          @click="stage1Next"
        >
            Dalej
        </v-btn>

      </v-stepper-content>

      <v-stepper-content step="2">
        <v-card>
            <v-form ref="form2" data-vv-scope="form2">
                <v-layout
                    row
                    wrap
                    align-end
                    mb-6
                >
                    <v-flex md2 mx-3>
                        <v-select
                            v-validate="`required`"
                            :error-messages="errors.collect('form2.Material')"
                            data-vv-name="Material"
                            v-model="materialSelected"
                            :items="materialsItems"
                            label="Materiał">
                        </v-select>
                    </v-flex>
                    <v-flex md2 mx-3>
                        <v-text-field
                            v-validate="`required|numeric|min_value:1`"
                            :error-messages="errors.collect('form2.Width')"
                            data-vv-name="Width"
                            label="Szerokość"
                            v-model="width">
                        </v-text-field>
                    </v-flex>
                    <v-flex md2 mx-3>
                        <v-text-field
                            v-validate="`required|numeric|min_value:1`"
                            :error-messages="errors.collect('form2.Height')"
                            data-vv-name="Height"
                            label="Wysokość"
                            v-model="height">
                        </v-text-field>
                    </v-flex>
                    <v-flex md2 mx-3>
                        <v-text-field
                            v-validate="`required|numeric|min_value:1`"
                            :error-messages="errors.collect('form2.Depth')"
                            data-vv-name="Depth"
                            label="Grubość" v-model="depth">
                        </v-text-field>
                    </v-flex>
                    <v-flex md2 mx-3>
                        <v-text-field
                            v-validate="`required|numeric|min_value:1`"
                            :error-messages="errors.collect('form2.Quantity')"
                            data-vv-name="Quantity"
                            label="Ilość"
                            v-model="quantity">
                        </v-text-field>
                    </v-flex>
                    <v-flex md6 mx-3>            
                        <v-textarea
                            v-validate="`max:100`"
                            counter="100"
                            :error-messages="errors.collect('form2.Note')"
                            data-vv-name="Note"
                            label="Uwagi"
                            v-model="note">
                        </v-textarea>
                    </v-flex>
                    <v-spacer></v-spacer>
                    <v-flex mx-3>
                        <v-layout
                            row
                            justify-center
                        >
                            <v-flex
                                text-xs-center
                                shrink
                                mx-2
                                v-for="(value, propertyName) in operationAbbreviationsEnum"
                                :key="propertyName"
                            >
                                <span class="caption grey--text">{{ value }}</span>
                                <v-checkbox
                                    v-bind:checked="operationsSelected[propertyName].selected"
                                    v-model="operationsSelected[propertyName].selected"
                                    :disabled="operationsSelected[propertyName].required"
                                >
                                </v-checkbox>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-form>
            <v-btn  mt-4 @click="addItem">Dodaj Pozycję</v-btn>
            <v-btn @click="clearForm2">Wyczyść</v-btn>
            <v-list>
                    <v-subheader class="pa-0">
                        POZYCJE
                        <span v-if="itemCounterError" class="red--text caption">Nie dodano żadnej pozycji</span>
                    </v-subheader>
                    <v-list-tile v-for="item in items" :key="item.id">
                        <v-list-tile-action>
                            <v-btn text icon class="my-2" @click="deleteItem(`${item.id}`)">
                                <v-icon>delete</v-icon>
                            </v-btn>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title width="0%">{{ item.material.name }}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
        </v-card>

        <v-btn
          color="primary"
          @click="stage2Next"
        >
          Continue
        </v-btn>

        <v-btn flat>Cancel</v-btn>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-card
          class="mb-5"
          color="grey lighten-1"
          height="200px"
        ></v-card>

        <v-btn
          color="primary"
          @click="e1 = 1"
        >
          Continue
        </v-btn>

        <v-btn flat>Cancel</v-btn>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
    </v-container>
</template>

<script>
import AddItem from '@/components/AddItem';
import EventBus from '@/event-bus.js';

export default {
    components: { AddItem },
    data() {
        return {
            itemCounterError: false,
            e1: 2,
            now: '',
            loading: false,
            dialog: false,
            toolbarItems: [],
            materials: [],
            materialsItems: [],
            operationStatusItems: ['NIEROBIONE', 'ZAPLANOWANE', 'GOTOWE_DO_REALIZACJI' , 'ZROBIONE'],

            materialSelected: '',
            operationAbbreviationsEnum: {
                Cięcie: 'C',
                Szlifowanie: 'SZ',
                Wiercenie: 'WI',
                CNC: 'CNC',
                Hartowanie: 'H',
                Emaliowanie: 'E',
                Laminowanie: 'L',
                Wydanie: 'WY'
            },
            operationsSelected: {
                Cięcie:         {selected: true, required: true},
                Szlifowanie:    {selected: false, required: false},
                Wiercenie:      {selected: false, required: false},
                CNC:            {selected: false, required: false},
                Hartowanie:     {selected: false, required: false},
                Emaliowanie:    {selected: false, required: false},
                Laminowanie:    {selected: false, required: false},
                Wydanie:        {selected: true, required: true},
            },
            operationsItems: ['Cięcie', 'Szlifowanie', 'Wiercenie', 'CNC', 'Hartowanie', 'Emaliowanie', 'Laminowanie', 'Wydanie'],
            // operationsSelected: [false, false, false, false, false, false, false, false],
            selectAllOperations: false,
            stageOneOperations: ['Cięcie', 'Szlifowanie', 'Wiercenie', 'CNC'],
            stageTwoOperations: ['Hartowanie', 'Emaliowanie', 'Laminowanie', 'Wydanie'],
            operationStatusEnum: {
                NIEROBIONE: 'NIEROBIONE',
                ZAPLANOWANE: 'ZAPLANOWANE',
                GOTOWE_DO_REALIZACJI: 'GOTOWE_DO_REALIZACJI',
                ZROBIONE: 'ZROBIONE'
            },

            // order
            items: [],
            itemsLength: 0,
            attachments: [],
            externalOrderId: '',
            customer: '',
            invoiceNumber: '',
            price: '',
            dueDate: '',
            description: '',
            createDate: '',
            status: '',

            //item
            material: '',
            operations: [],
            width: '',
            height: '',
            depth: '',
            quantity: '',
            status: '',
            note: ''

        }
    },
    methods: {
        date() {
            var today = new Date();

            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            this.now = yyyy + '-' + mm + '-' + dd;
        },
        prepareData() {
            var operation;
            for(operation in this.operationsSelected) {
                this.operationsSelected[operation].selected = this.operationsSelected[operation].required;
            }
        },
        clearForm2() {
            // this.$refs.form2.reset();
            this.$validator.reset();
            this.materialSelected = '';
            this.width = '';
            this.height = '';
            this.depth = '';
            this.quantity = '';
            this.note = '';
            this.operations = [];
            this.prepareData();
        },
        clearForm1() {
            // this.items = [];
            this.attachments = [];
            this.$refs.form2.reset();
            this.$validator.reset();
            // this.itemsLength = 0;
            this.dueDate = '';
        },
        fetchMaterials() {
            this.loading = true;
            this.$http.get('http://' + process.env.VUE_APP_HOST + ':' + process.env.VUE_APP_BACKEND_PORT + '/materials').then(response => {
                this.materials = response.body;
                this.materialsItems = [];
                this.materials.forEach((material) => {
                    this.materialsItems.push(material.name);
                })
                this.loading = false;
            }), response => {
                console.error(response);
            }
        },
        addItem() {
            this.loading = true;
            this.$validator.validateAll('form2').then(valid => {
                console.log(valid);
                if(valid){
                    // this.materialId = (this.materialsItems.indexOf(this.materialSelected) + 1);

                    //find material in materials with the same name
                    console.log(this.materialSelected);
                    var index;
                    for(index = 0; index < this.materials.length; index++) {
                        if(this.materials[index].name == this.materialSelected) {
                            this.material = this.materials[index];
                        }
                    }

                    // var i;
                    // for(i = 0; i < this.operationsSelected.length; i++) {
                    //     if(this.operationsSelected[i] == true) {
                    //         this.operations.push({name: this.operationsItems[i], status: this.operationStatusEnum.ZAPLANOWANE});
                    //     }
                    // }
                    var operation;
                    for(operation in this.operationsSelected) {
                        if(this.operationsSelected[operation].selected) {
                            this.operations.push({ name: operation, status: this.operationStatusEnum.ZAPLANOWANE });
                        }
                    }

                    const item = {
                        id: '',
                        material: this.material,
                        operations: this.operations,
                        width: this.width,
                        height: this.height,
                        depth: this.depth,
                        quantity: this.quantity,
                        status: this.operationStatusItems[1],
                        note: this.note
                    }

                    item.id = this.items.length;
                    this.items.push(item);
                    this.itemsLength++;

                    console.log(item);
                    this.loading = false;
                    this.clearForm2();
                }
            })
        },
        // addItem(item) {
        //     item.id = this.items.length;
        //     this.items.push(item);
        //     this.itemsLength++;
        // },
        deleteItem(id) {
            for(var i = 0; i < this.items.length; i++) {
                if(this.items[i].id == id) {
                    this.items.splice(i, 1);
                }
            }
        },
        stage1Next() {
            this.$validator.validateAll('form1')
                .then(valid => {
                    console.log(valid);
                    if(valid) {

                        this.e1 = 2
                    }
                });
        },
        stage2Next() {
            if(this.itemsLength) {
                this.e1 = 3
            } else {
                this.itemCounterError = true;
                EventBus.$emit('showSnackbar', "Nie dodano żadnej pozycji.");
            }
        },
        submit() {
            this.$validator.validate().then(valid => {
                if(valid){
                    this.loading = true;
                    EventBus.$emit('disableLoading');

                    const order = {
                        items: this.items,
                        attachments: [],
                        externalOrderId: this.externalOrderId,
                        customer: this.customer,
                        invoiceNumber: this.invoiceNumber,
                        price: this.price,
                        dueDate: this.dueDate,
                        description: this.description,
                        status: ''
                    };

                    console.log(order);

                    this.$http.post('http://' + process.env.VUE_APP_HOST + ':' + process.env.VUE_APP_BACKEND_PORT + '/order', order,
                    {headers: {'Content-Type': 'application/json;charset=UTF-8'}}).then(response => {
                        this.loading = false;
                        EventBus.$emit('enableLoading');
                        this.clearForm();
                    }, response => {
                        console.log(response);
                    });
                }
            });
        }
    },
    created() {
        this.date();
        this.fetchMaterials();
        this.prepareData();
        EventBus.$on('submit', () => { this.submit(); });
        EventBus.$on('clearForm', () => { this.clearForm(); });
    }
}
</script>

<style scoped>

.layout.row {
    text-align: center;
}

</style>

