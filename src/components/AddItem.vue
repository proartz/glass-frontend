<template>
    <v-dialog v-model="dialog">
        <v-btn slot="activator">Add New Item</v-btn>
        <v-card>
            <v-toolbar card dark color="primary">
                <v-btn icon dark @click="dialog = false">
                <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>Add New Item</v-toolbar-title>
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
                    <v-list-tile v-for="(item, i) in toolbarItems" :key="i" @click="">
                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                    </v-list-tile>
                </v-list>
                </v-menu>
            </v-toolbar>
            <v-card-text>
                <v-form ref="form">
                    <v-select v-model="material" :items="materialsItems" label="Material"></v-select>
                    <v-text-field label="Width" v-model="width"></v-text-field>
                    <v-text-field label="Height" v-model="height"></v-text-field>
                    <v-text-field label="Depth" v-model="depth"></v-text-field>
                    <v-text-field label="Quantity" v-model="quantity"></v-text-field>
                    <v-text-field label="Note" v-model="note"></v-text-field>
                    <v-select v-model="operationsValues" :items="operationsItems" attach chips label="Operations" multiple></v-select>
                    <v-btn @click="addItem">Add Item</v-btn>
                    <v-btn @click="clearForm">Clear</v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: [
        'materialsItems',
        'operationStatusItems'
        ],
    data() {
        return {
            dialog: false,
            toolbarItems: [],
            material: '',
            operationsItems: ['Cutting', 'Sanding', 'Drilling', 'CNC', 'Hardening', 'Enamelling', 'Lamination', 'Release'],
            operationsValues: [],

            id: '',
            materialId: '',
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
        clearForm() {
            // this.material = '';
            // this.operationsValues = [];
            // this.id = '';
            // this.materialId = '';
            // this.width = '';
            // this.height = '';
            // this.depth = '';
            // this.quantity = '';
            // this.note = '';
            this.$refs.form.reset();
            this.operations = [];
        },
        addItem() {
            this.loading = true;
            if(this.$refs.form.validate()){
                this.materialId = (this.materialsItems.indexOf(this.material) + 1);
                this.operationsValues.forEach((value) => {
                    this.operations.push({name: value, status: this.operationStatusItems[0]});
                })

                const item = {
                    id: this.id,
                    materialId: this.materialId,
                    operations: this.operations,
                    width: this.width,
                    height: this.height,
                    depth: this.depth,
                    quantity: this.quantity,
                    status: this.operationStatusItems[0],
                    note: this.note
                }

                console.log(item);
                this.loading = false;
                this.dialog = false;
                this.$emit('addItem', item);
                this.clearForm();
            }
        },
    },
}
</script>

