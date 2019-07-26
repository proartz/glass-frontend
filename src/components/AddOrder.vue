<template>
    <v-dialog v-model="dialog">
        <v-btn slot="activator">Add New Order</v-btn>
        <v-card>
            <v-card-title>
                <h2>Add New Order</h2>
            </v-card-title>
            <v-card-text>
                <v-form ref="form">
                    <v-text-field label="Customer" v-model="customer"></v-text-field>
                    <v-text-field label="External Order Id" v-model="externalOrderId"></v-text-field>
                    <v-text-field label="Invoice Number" v-model="invoiceNumber"></v-text-field>
                    <v-text-field label="Price" v-model="price"></v-text-field>
                    <v-menu>
                        <v-text-field label="Due Date" :value="dueDate" slot="activator"></v-text-field>
                        <v-date-picker v-model="dueDate"></v-date-picker>
                    </v-menu>
                    <AddItem @addItem='addItem' v-bind:materialsItems="materialsItems"/>
                    <v-list>
                        <v-list-tile v-for="item in items" :key="item.id">
                            <v-list-tile-title>{{ materialsItems[item.materialId - 1] }}</v-list-tile-title>
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
    components: { AddItem },
    data() {
        return {
            loading: false,
            dialog: false,
            materials: [],
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
        clearForm() {
            this.items = [];
            this.attachments = [];
            this.externalOrderId = '';
            this.customer = '';
            this.invoiceNumber = '';
            this.price = '';
            this.dueDate = '';
            this.createDate = '';
            this.status = '';
        },
        addItem(item) {
            item.id = this.items.length;
            this.items.push(item);
        },
        submit() {
            if(this.$refs.form.validate()) {
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

                this.$http.post('http://localhost:9090/order', order,
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
        },
        fetchMaterials() {
            this.loading = true;
            this.$http.get('http://localhost:9090/materials').then(response => {
                this.materials = response.body;
                console.log(this.materials);
                this.materials.forEach((material) => {
                    this.materialsItems.push(material.name);
                })
                console.log(this.materialsItems);
                this.loading = false;
            }), response => {
                console.error(response);
            }
        }
    },
    created() {
        this.fetchMaterials();
    }
}
</script>

