<template>
    <v-dialog v-model="dialog">
        <v-btn slot="activator">Add New Order</v-btn>
        <v-card>
            <v-card-title>
                <h2>Add a New Order</h2>
            </v-card-title>
            <v-card-text>
                <v-form ref="form">
                    <v-text-field label="Customer" v-model="customer"></v-text-field>
                    <v-text-field label="External Order Id" v-model="externalOrderId"></v-text-field>
                    <v-text-field label="Invoice Number" v-model="invoiceNumber"></v-text-field>
                    <v-text-field label="price" v-model="price"></v-text-field>
                    <v-menu>
                        <v-text-field label="Realisation Date" :value="realisationDate" slot="activator"></v-text-field>
                        <v-date-picker v-model="realisationDate"></v-date-picker>
                    </v-menu>
                    <v-spacer></v-spacer>
                    <v-btn @click="submit" :loading="loading">Add Order</v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    data() {
        return {
            loading: false,
            dialog: false,
            customer: '',
            externalOrderId: '',
            invoiceNumber: '',
            realisationDate: '',
            price: 0
        }
    },
    methods: {
        submit() {
            if(this.$refs.form.validate()) {
                this.loading = true;

                const order = {
                    items: [],
                    attachments: [],
                    externalOrderId: this.externalOrderId,
                    customer: this.customer,
                    invoiceNumber: this.invoiceNumber,
                    price: this.price,
                    realisationDate: this.realisationDate,
                    status: 'new'
                };

                console.log(order);

                this.$http.post('http://localhost:9090/order', order,
                {headers: {'Content-Type': 'application/json;charset=UTF-8'}}).then(response => {
                    console.log(response.status);
                    this.loading = false;
                    this.dialog = false;
                    this.$emit('orderAdded');
                }, response => {
                    console.log(response);
                });
            }
        }
    }
}
</script>

