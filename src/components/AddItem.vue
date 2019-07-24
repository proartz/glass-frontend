<template>
    <v-dialog v-model="dialog">
        <v-btn slot="activator">Add New Item</v-btn>
        <v-card>
            <v-card-title>
                <h2>Add New Item</h2>
            </v-card-title>
            <v-card-text>
                <v-form ref="form">
                    <v-select v-model="material" :items="materials" label="Material"></v-select>
                    <v-text-field label="Width" v-model="item.width"></v-text-field>
                    <v-text-field label="Height" v-model="item.height"></v-text-field>
                    <v-text-field label="Depth" v-model="item.depth"></v-text-field>
                    <v-text-field label="Quantity" v-model="item.quantity"></v-text-field>
                    <v-text-field label="Note" v-model="item.note"></v-text-field>
                    <v-select v-model="operationsValues" :items="operationsItems" attach chips label="Operations" multiple></v-select>
                    <v-btn @click="addItem">Add Item</v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    data() {
        return {
            dialog: false,
            materials: ['HB140', 'DH320', 'UV330', 'RR147'],
            material: '',
            operationsItems: ['Drilling', 'Cutting', 'Smoothing', 'CNC'],
            operationsValues: [],

            item: {
                id: '',
                materialId: '',
                operations: [],
                width: '',
                height: '',
                depth: '',
                quantity: '',
                note: ''
            }
        }
    },
    methods: {
        addItem() {
            this.loading = true;
            if(this.$refs.form.validate()){
                this.item.materialId = (this.materials.indexOf(this.material) + 1);
                this.operationsValues.forEach((value) => {
                    this.item.operations.push({name: value, status: "new"});
                })
                console.log(this.item);
                this.loading = false;
                this.dialog = false;
                this.$emit('addItem', this.item);
            }
        }
    }
}
</script>

