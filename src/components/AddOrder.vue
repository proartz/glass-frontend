<template>
    <v-dialog v-model="dialog">
        <v-btn icon slot="activator">
            <v-icon>add</v-icon>
        </v-btn>
        <v-card>
            <v-toolbar card dark color="primary">
            <v-btn icon dark @click="dialog = false">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Dodaj Nowe Zlecenie</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark flat @click="dialog = false"></v-btn>
            </v-toolbar-items>
            <v-menu bottom right offset-y>
              <template v-slot:activator="{ on }">
                <v-btn dark icon v-on="on">
                  <v-icon>more_vert</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-tile v-for="(item, i) in toolbarItems" :key="i">
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
                                    data-vv-name="customer" label="Klient"
                                    v-model="customer">
                    </v-text-field>
                    <v-text-field v-validate="`max:30`"
                                    :counter="30"
                                    :error-messages="errors.collect('externalOrderId')"
                                    data-vv-name="externalOrderId"
                                    label="Zewnętrzny Numer Zlecenia"
                                    v-model="externalOrderId">
                    </v-text-field>
                    <v-text-field v-validate="`max:30`"
                                    :counter="30"
                                    :error-messages="errors.collect('invoiceNumber')"
                                    data-vv-name="invoiceNumber"
                                    label="Numer Faktury"
                                    v-model="invoiceNumber">
                    </v-text-field>
                    <v-text-field v-validate="`numeric|max_value:999999999999999999`"
                                    :error-messages="errors.collect('price')"
                                    data-vv-name="price"
                                    label="Cena"
                                    v-model="price">
                    </v-text-field>
                    <v-menu>
                        <v-text-field v-validate="`required`"
                                        :error-messages="errors.collect('dueDate')"
                                        data-vv-name="dueDate"
                                        label="Termin Realizacji"
                                        :value="dueDate"
                                        slot="activator">
                        </v-text-field>
                        <v-date-picker v-model="dueDate"
                                        :min="now">
                        </v-date-picker>
                    </v-menu>
                    <v-text-field v-validate="`max:100`"
                                    counter="100"
                                    :error-messages="errors.collect('description')"
                                    data-vv-name="description"
                                    label="Opis"
                                    v-model="description">
                    </v-text-field>
                    <v-list>
                        <v-subheader class="pa-0">
                            POZYCJE
                            <AddItem @addItem='addItem'
                                        v-bind:materialsItems="materialsItems"
                                        v-bind:materials="materials"
                                        v-bind:operationStatusItems="operationStatusItems"/>
                            <v-text-field v-show="false"
                                            v-validate="'min_value:1'"
                                            data-vv-name="itemsCounter"
                                            :disabled="true"
                                            v-model="itemsLength">
                            </v-text-field>
                            <span class="red--text caption">{{ errors.first('itemsCounter') }}</span>
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
                    <v-spacer></v-spacer>
                    <v-btn @click="submit" :loading="loading">Dodaj Zlecenie</v-btn>
                    <v-btn @click="clearForm">Wyczyść</v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import AddItem from '@/components/AddItem'

export default {
    props: [
        'materialsItems',
        'materials',
        'operationStatusItems'
    ],
    components: { AddItem },
    data() {
        return {
            now: '',
            loading: false,
            dialog: false,
            toolbarItems: [],

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
        clearForm() {
            this.items = [];
            this.attachments = [];
            this.$refs.form.reset();
            this.$validator.reset();
            this.itemsLength = 0;
            this.dueDate = '';
        },
        addItem(item) {
            item.id = this.items.length;
            this.items.push(item);
            this.itemsLength++;
        },
        deleteItem(id) {
            for(var i = 0; i < this.items.length; i++) {
                if(this.items[i].id == id) {
                    this.items.splice(i, 1);
                }
            }
        },
        submit() {
            this.$validator.validate().then(valid => {
                if(valid){
                    this.loading = true;

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

                    this.$http.post(process.env.VUE_APP_URL + '/order', order,
                    {headers: {'Content-Type': 'application/json;charset=UTF-8'}}).then(response => {
                        this.loading = false;
                        this.dialog = false;
                        this.$emit('orderAdded');
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
    }
}
</script>

