<template>
   <v-container fluid fill-height>
       <v-layout>
           <v-flex>
                <v-stepper v-model="e1">
                    <v-stepper-header>
                        <v-stepper-step :complete="e1 > 1" step="1" editable color="#6f00ff">Podstawowe Informacje</v-stepper-step>
                        <v-divider></v-divider>
                        <v-stepper-step :complete="e1 > 2" step="2" editable color="#6f00ff">Dodaj Pozycje</v-stepper-step>
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
                                        <v-flex md5>
                                            <v-text-field 
                                                v-validate="`required|max:30`"
                                                :counter="30"
                                                :error-messages="errors.collect('form1.customer')"
                                                data-vv-name="customer" label="Klient"
                                                v-model="order.customer"
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
                                                v-model="order.externalOrderId">
                                            </v-text-field>
                                        </v-flex>
                                        <v-flex md5>
                                            <v-text-field
                                                v-validate="`max:30`"
                                                :counter="30"
                                                :error-messages="errors.collect('form1.invoiceNumber')"
                                                data-vv-name="invoiceNumber"
                                                label="Numer Faktury"
                                                v-model="order.invoiceNumber">
                                            </v-text-field>
                                        </v-flex>
                                        <v-flex md5>
                                            <v-text-field
                                                v-validate="`numeric|max_value:999999999999999999`"
                                                :error-messages="errors.collect('form1.price')"
                                                data-vv-name="price"
                                                label="Cena"
                                                v-model="order.price">
                                            </v-text-field>
                                        </v-flex>
                                        <v-flex md5>
                                            <v-textarea
                                                v-validate="`max:100`"
                                                counter="100"
                                                :error-messages="errors.collect('form1.description')"
                                                data-vv-name="description"
                                                label="Opis"
                                                v-model="order.description">
                                            </v-textarea>
                                        </v-flex>
                                        <v-flex md5 class="text-xs-left">
                                            <v-menu>
                                                <v-text-field
                                                    v-validate="`required`"
                                                    :error-messages="errors.collect('form1.dueDate')"
                                                    data-vv-name="dueDate"
                                                    label="Termin Realizacji"
                                                    :value="order.dueDate"
                                                    slot="activator">
                                                </v-text-field>
                                                <v-date-picker v-model="order.dueDate"
                                                                :min="now">
                                                </v-date-picker>
                                            </v-menu>
                                        </v-flex>
                                    </v-layout>
                                </v-form>
                            </v-card>

                            <v-btn
                            color="#6f00ff"
                            dark
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
                                        class="mb-5"
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
                                                v-model="item.width">
                                            </v-text-field>
                                        </v-flex>
                                        <v-flex md2 mx-3>
                                            <v-text-field
                                                v-validate="`required|numeric|min_value:1`"
                                                :error-messages="errors.collect('form2.Height')"
                                                data-vv-name="Height"
                                                label="Wysokość"
                                                v-model="item.height">
                                            </v-text-field>
                                        </v-flex>
                                        <v-flex md2 mx-3>
                                            <v-text-field
                                                v-validate="`required|numeric|min_value:1`"
                                                :error-messages="errors.collect('form2.Depth')"
                                                data-vv-name="Depth"
                                                label="Grubość" v-model="item.depth">
                                            </v-text-field>
                                        </v-flex>
                                        <v-flex md2 mx-3>
                                            <v-text-field
                                                v-validate="`required|numeric|min_value:1`"
                                                :error-messages="errors.collect('form2.Quantity')"
                                                data-vv-name="Quantity"
                                                label="Ilość"
                                                v-model="item.quantity">
                                            </v-text-field>
                                        </v-flex>
                                        <v-flex md6 mx-3>            
                                            <v-textarea
                                                v-validate="`max:100`"
                                                counter="100"
                                                :error-messages="errors.collect('form2.Note')"
                                                data-vv-name="Note"
                                                label="Uwagi"
                                                v-model="item.note">
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
                                                        class="ml-2"
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
                                <v-btn @click="addItem" color="#6f00ff" dark>Dodaj Pozycję</v-btn>
                                <v-btn @click="clearForm2">Wyczyść</v-btn>
                                <v-subheader>POZYCJE</v-subheader>
                                <span v-if="itemCounterError" class="red--text caption text-xs-left">BŁĄD: Nie dodano żadnej pozycji</span>
                                <v-layout
                                    justify-center
                                    row
                                    py-1
                                    v-for="item in order.items"
                                    :key="item.id"
                                >
                                    <v-flex md1>
                                        <v-btn text icon @click="deleteItem(item.id)">
                                            <v-icon>delete</v-icon>
                                        </v-btn>
                                    </v-flex>
                                    <v-flex md1>
                                        <div class="caption grey--text">Id:</div>
                                        <div>{{ item.id }}</div>
                                    </v-flex>
                                    <v-flex md1>
                                        <div class="caption grey--text">Materiał:</div>
                                        <div>{{ item.material.name }}</div>
                                    </v-flex>
                                    <v-flex md1 hidden-sm-and-down>
                                        <div class="caption grey--text">Szerokość:</div>
                                        <div>{{ item.width }}</div>
                                    </v-flex>
                                    <v-flex md1  hidden-sm-and-down>
                                        <div class="caption grey--text">Wysokość:</div>
                                        <div>{{ item.height }}</div>
                                    </v-flex>
                                    <v-flex md1  hidden-sm-and-down>
                                        <div class="caption grey--text">Grubość:</div>
                                        <div>{{ item.depth }}</div>
                                    </v-flex>
                                    <v-flex md1  hidden-sm-and-down>
                                        <div class="caption grey--text">Ilość:</div>
                                        <div>{{ item.quantity }}</div>
                                    </v-flex>
                                    <v-flex md4>
                                        <ViewOperations v-bind:operations="item.operations"/>
                                    </v-flex>
                                </v-layout>
                            </v-card>

                            <v-btn
                            color="#6f00ff"
                            dark
                            @click="finish"
                            >
                            Dodaj Zlecenie
                            </v-btn>

                            <v-btn >Anuluj</v-btn>
                        </v-stepper-content>
                    </v-stepper-items>
                </v-stepper>
            </v-flex>
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
    data() {
        return {
            itemCounterError: false,
            e1: 0,
            now: '',
            loading: false,
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
            operationStatusEnum: {
                NIEROBIONE: 'NIEROBIONE',
                ZAPLANOWANE: 'ZAPLANOWANE',
                GOTOWE_DO_REALIZACJI: 'GOTOWE_DO_REALIZACJI',
                ZROBIONE: 'ZROBIONE'
            },
            itemStatusEnum: {
                NOWA: 'NOWA',
                USUNIĘTA: 'USUNIĘTA'
            },


            order: {
                items: [],
                attachments: [],
                externalOrderId: '',
                customer: '',
                invoiceNumber: '',
                price: '',
                dueDate: '',
                description: '',
                createDate: '',
                status: ''
            },

            item: {
                material: '',
                operations: [],
                width: '',
                height: '',
                depth: '',
                quantity: '',
                status: '',
                note: ''
            }
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
            this.item.width = '';
            this.item.height = '';
            this.item.depth = '';
            this.item.quantity = '';
            this.item.note = '';
            this.item.operations = [];
            this.prepareData();
        },
        clearForm1() {
            this.order.attachments = [];
            this.$refs.form1.reset();
            this.$validator.reset();
            this.order.dueDate = '';
        },
        fetchMaterials() {
            this.loading = true;operationsItems:
            this.$http.get(process.env.VUE_APP_URL + '/materials').then(response => {
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

                    //find material in materials with the same name
                    console.log(this.materialSelected);
                    var index;
                    for(index = 0; index < this.materials.length; index++) {
                        if(this.materials[index].name == this.materialSelected) {
                            this.item.material = this.materials[index];
                        }
                    }

                    // add operations to the item
                    var operation;
                    for(operation in this.operationsSelected) {
                        if(this.operationsSelected[operation].selected) {
                            this.item.operations.push({ name: operation, status: this.operationStatusEnum.ZAPLANOWANE });
                        }
                    }

                    const item = {
                        id: '',
                        material: this.item.material,
                        operations: this.item.operations,
                        width: this.item.width,
                        height: this.item.height,
                        depth: this.item.depth,
                        quantity: this.item.quantity,
                        status: this.itemStatusEnum.NOWA,
                        note: this.item.note
                    }

                    item.id = this.order.items.length;
                    this.order.items.push(item);

                    console.log(item);
                    this.loading = false;
                    this.clearForm2();
                }
            })
        },
        deleteItem(id) {
            for(var i = 0; i < this.items.length; i++) {
                if(this.order.items[i].id == id) {
                    this.order.items.splice(i, 1);
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
        finish() {
            if(this.order.items.length) {
                this.submit();
            } else {
                this.itemCounterError = true;
                setTimeout(() => {
                    this.itemCounterError = false;
                }, 5000);
                EventBus.$emit('showSnackbar', "BŁĄD: Nie dodano żadnej pozycji.");
            }
        },
        submit() {
            this.loading = true;
            EventBus.$emit('enableLoading');

            const order = {
                items: this.order.items,
                attachments: [],
                externalOrderId: this.order.externalOrderId,
                customer: this.order.customer,
                invoiceNumber: this.order.invoiceNumber,
                price: this.order.price,
                dueDate: this.order.dueDate,
                description: this.order.description,
                status: ''
            };

            console.log(order);

            this.$http.post(process.env.VUE_APP_URL + '/order', order,
            {headers: {'Content-Type': 'application/json;charset=UTF-8'}}).then(response => {
                const id = response.body;
                this.loading = false;
                EventBus.$emit('disableLoading');
                EventBus.$emit('showSnackbar', "Dodano nowe zlecenie. Id = " + id)
                this.$router.push({ name: 'Zlecenie', params: {id: id }});
                // this.clearForm();
            }, response => {
                console.log(response);
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
.v-input--selection-controls__input {
    margin-right: 0px !important;
    margin-left: 8px;
}

</style>

