<template>
    <v-dialog v-model="dialog">
        <v-btn slot="activator">Add New Order</v-btn>
        <v-card>
            <v-card-title>
                <h2>Add New Order</h2>
            </v-card-title>
            <v-card-text>
                <v-form ref="form">
                    <v-text-field v-validate="`required|max:30`" :counter="30" :error-messages="errors.collect('customer')" data-vv-name="customer" label="Customer" v-model="customer"></v-text-field>
                    <v-text-field v-validate="`max:30`" :counter="30" :error-messages="errors.collect('externalOrderId')" data-vv-name="externalOrderId"  label="External Order Id" v-model="externalOrderId"></v-text-field>
                    <v-text-field v-validate="`max:30`" :counter="30" :error-messages="errors.collect('invoiceNumber')" data-vv-name="invoiceNumber"  label="Invoice Number" v-model="invoiceNumber"></v-text-field>
                    <v-text-field v-validate="`numeric|max_value:999999999999999999`" :error-messages="errors.collect('price')" data-vv-name="price"   label="Price" v-model="price"></v-text-field>
                    <v-menu>
                        <v-text-field v-validate="`required`" :error-messages="errors.collect('dueDate')" data-vv-name="dueDate" label="Due Date" :value="dueDate" slot="activator"></v-text-field>
                        <v-date-picker v-model="dueDate" :min="now"></v-date-picker>
                    </v-menu>
                    <AddItem @addItem='addItem' v-bind:materialsItems="materialsItems"/>
                    <v-list>
                        <v-subheader class="pa-0">ITEMS</v-subheader>
                        <v-list-tile v-for="item in items" :key="item.id">
                            <v-list-tile-action>
                                <v-btn text icon class="my=2" @click="deleteItem(`${item.id}`)">
                                    <v-icon>delete</v-icon>
                                </v-btn>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title width="0%">{{ materialsItems[item.materialId - 1] }}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                    <v-spacer></v-spacer>
                    <v-btn @click="submit" :loading="loading">Add Order</v-btn>
                    <v-btn @click="clearForm">Clear</v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import AddItem from '@/components/AddItem'

export default {
    props: [ 'materialsItems' ],
    components: { AddItem },
    data() {
        return {
            now: '',
            loading: false,
            dialog: false,
            materialsItems: [],

            items: [],
            attachments: [],
            externalOrderId: '',
            customer: '',
            invoiceNumber: '',
            price: '',
            dueDate: '',
            createDate: '',
            status: 'new',

        }
    },
    methods: {
        date() {
            var today = new Date();

            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            this.now = yyyy + '-' + mm + '-' + dd;
            console.log(this.now);
        },
        clearForm() {
            this.items = [];
            this.attachments = [];
            this.$refs.form.reset();
            this.$validator.reset();
            this.dueDate = '';
            // this.externalOrderId = '';
            // this.customer = '';
            // this.invoiceNumber = '';
            // this.price = '';
            // this.createDate = '';
            // this.status = '';
        },
        addItem(item) {
            item.id = this.items.length;
            this.items.push(item);
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
                        status: 'new'
                    };

                    console.log(order);

                    this.$http.post('http://192.168.1.21:9090/order', order,
                    {headers: {'Content-Type': 'application/json;charset=UTF-8'}}).then(response => {
                        console.log(response.status);
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

