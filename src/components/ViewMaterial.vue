<template>
    <v-dialog ref="showDialog" v-model="dialog" lazy>
         <v-btn slot="activator" text icon color="gray">
            <v-icon>remove_red_eye</v-icon>
        </v-btn>
         <v-card tile>
          <v-toolbar card dark color="primary">
            <v-btn icon dark @click="dialog = false">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Materiał</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-dialog v-model="deleteDialog" width="500">
                    <template v-slot:activator="{ on }">
                        <v-btn dark flat v-on="on" :disabled = "!editMode">Usuń</v-btn>
                    </template>
                    <v-card>
                        <v-card-title class="headline grey lighten-2" primary-title>
                            Usuń Materiał
                        </v-card-title>
                        <v-card-text>
                            Czy na pewno chcesz usunąć materiał {{ material.name }}?
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn flat @click="deleteMaterial">
                                ok
                            </v-btn>
                            <v-btn flat @click="deleteDialog = false">
                                anuluj
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-btn dark flat @click="saveMaterial" :disabled = "!editMode" :loading="loading">Zapisz</v-btn>
                <v-btn dark flat @click="editMode = !editMode">Edytuj</v-btn>
            </v-toolbar-items>
            <v-menu bottom right offset-y>
              <template v-slot:activator="{ on }">
                <v-btn dark icon v-on="on">
                  <v-icon>more_vert</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-tile v-for="(item, i) in items" :key="i">
                  <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </v-toolbar>
          <v-card-text>
                <v-form ref="form">
                    <v-text-field v-validate="`required|max:30`"
                                    :counter="30"
                                    :error-messages="errors.collect('id')"
                                    data-vv-name="id" label="id"
                                    v-model="material.id"
                                    readonly="true">
                    </v-text-field>
                    <v-text-field v-validate="`required|max:30`"
                                    :counter="30"
                                    :error-messages="errors.collect('name')"
                                    data-vv-name="name" label="Nazwa"
                                    v-model="material.name"
                                    :readonly="!editMode">
                    </v-text-field>
                    <v-text-field v-validate="`max:100`"
                                    :counter="100"
                                    :error-messages="errors.collect('description')"
                                    data-vv-name="description"
                                    label="Opis"
                                    v-model="material.description"
                                    :readonly="!editMode">
                    </v-text-field>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import EventBus from '@/event-bus.js';

export default {
    props: [ 
        'materialsItems',
        'material',
     ],
    data() {
        return {
            dialog: false,
            deleteDialog: false,
            items: [],
            editMode: false,
            loading: false,
        }
    },
    methods: {
        saveMaterial() {
            this.$validator.validate().then(valid => {
                if(valid){
                    this.loading = true;

                    const material = {
                        id: this.material.id,
                        name: this.material.name,
                        description: this.material.description
                    };

                    console.log(material);

                    this.$http.post(process.env.VUE_APP_URL + '/updateMaterial', material,
                    {headers: {'Content-Type': 'application/json;charset=UTF-8'}}).then(response => {
                        console.log(response);
                        EventBus.$emit('showSnackbar', "Materiał " + this.material.name + " zaaktualizowany.");
                        this.$emit('refresh');
                    }, response => {
                        console.log(response);
                    });

                    this.editMode = false;
                    this.loading = false;
                }
            });
        },
        deleteMaterial() {
            this.$validator.validate().then(valid => {
                if(valid){
                    this.loading = true;

                    const material = {
                        id: this.material.id
                    };

                    console.log(material);

                    this.$http.post(process.env.VUE_APP_URL + '/deleteMaterial', material,
                    {headers: {'Content-Type': 'application/json;charset=UTF-8'}}).then(response => {
                        console.log(response);
                        EventBus.$emit('showSnackbar', "Materiał " + this.material.name + " usunięty.");
                        this.$emit('refresh');
                    }, response => {
                        console.log(response);
                        EventBus.$emit('showSnackbar', "Nie można usunąć materiału. Jest on używany przez inne zlecenie.");
                    });
                    this.editMode = false;
                    this.loading = false;
                }
            });

            console.log("Deleting material: " + this.material.name);
            this.deleteDialog = false;
        }
    },
    watch: {
        dialog:  function() {
            if(!this.dialog) {
                this.editMode = false;
            }
        }
    },
}
</script>
<style>
</style>