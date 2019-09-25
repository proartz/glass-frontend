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
                <v-toolbar-title>Dodaj Nową Pozycję</v-toolbar-title>
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
                    <v-select v-validate="`required`"
                                :error-messages="errors.collect('Material')"
                                data-vv-name="Material"
                                v-model="materialSelected"
                                :items="materialsItems"
                                label="Materiał">
                    </v-select>
                    <v-text-field v-validate="`required|numeric|min_value:1`"
                                    :error-messages="errors.collect('Width')"
                                    data-vv-name="Width"
                                    label="Szerokość"
                                    v-model="width">
                    </v-text-field>
                    <v-text-field v-validate="`required|numeric|min_value:1`"
                                    :error-messages="errors.collect('Height')"
                                    data-vv-name="Height"
                                    label="Wysokość"
                                    v-model="height">
                    </v-text-field>
                    <v-text-field v-validate="`required|numeric|min_value:1`"
                                    :error-messages="errors.collect('Depth')"
                                    data-vv-name="Depth"
                                    label="Grubość" v-model="depth">
                    </v-text-field>
                    <v-text-field v-validate="`required|numeric|min_value:1`"
                                    :error-messages="errors.collect('Quantity')"
                                    data-vv-name="Quantity"
                                    label="Ilość"
                                    v-model="quantity">
                    </v-text-field>
                    <v-text-field v-validate="`max:100`"
                                    counter="100"
                                    :error-messages="errors.collect('Note')"
                                    data-vv-name="Note"
                                    label="Uwagi" v-model="note"></v-text-field>
                    <div class=" grey--text">Operacje</div>
                    <v-container>
                            <v-checkbox v-model="selectAllOperations" label="Wybierz Wszystko"></v-checkbox>
                            <v-checkbox v-for="(operation, i) in operationsItems" :key="i" v-model="operationsSelected[operationsItems.indexOf(operation)]" :label="`${operation}`"></v-checkbox>
                    </v-container>
                    <v-list>
                        <v-list-tile v-for="(error, i) in errors.all()" :key="i">
                            <v-list-tile-title class="red--text caption">{{ error }}</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                    <v-btn @click="addItem">Dodaj Pozycję</v-btn>
                    <v-btn @click="clearForm">Wyczyść</v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: [
        'materials',
        'materialsItems',
        'operationStatusItems'
    ],
    data() {
        return {stageOneOperations: ['Cięcie', 'Szlifowanie', 'Wiercenie', 'CNC'],
            stageTwoOperations: ['Hartowanie', 'Emaliowanie', 'Laminowanie', 'Wydanie'],
            dialog: false,
            toolbarItems: [],
            materialSelected: '',
            operationsItems: ['Cięcie', 'Szlifowanie', 'Wiercenie', 'CNC', 'Hartowanie', 'Emaliowanie', 'Laminowanie'],
            operationsSelected: [false, false, false, false, false, false, false],
            selectAllOperations: false,
            stageOneOperations: ['Cięcie', 'Szlifowanie', 'Wiercenie', 'CNC'],
            stageTwoOperations: ['Hartowanie', 'Emaliowanie', 'Laminowanie', 'Wydanie'],

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
        clearForm() {
            this.$refs.form.reset();
            this.$validator.reset();
            this.operations = [];
        },
        addItem() {
            this.loading = true;
            this.$validator.validate().then(valid => {
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

                    var i;
                    for(i = 0; i < this.operationsSelected.length; i++) {
                        if(this.operationsSelected[i] == true) {
                            this.operations.push({name: this.operationsItems[i], status: this.operationStatusItems[0]});
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

                    console.log(item);
                    this.loading = false;
                    this.dialog = false;
                    this.$emit('addItem', item);
                    this.clearForm();
                }
            })
        },
    },
    watch: {
        selectAllOperations:  function(selected) {
            if(selected) {
                var index;
                for(index = 0; index < this.operationsSelected.length; index++) {
                    this.operationsSelected[index] = true;
                }
            }
            console.log(this.operationsSelected);
        }
    },
}
</script>

