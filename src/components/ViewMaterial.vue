<template>
    <v-dialog ref="showDialog" v-model="dialog" lazy>
         <v-btn slot="activator" @click="loadOrder" text icon color="gray">
            <v-icon>remove_red_eye</v-icon>
        </v-btn>
         <v-card tile>
          <v-toolbar card dark color="primary">
            <v-btn icon dark @click="dialog = false">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Order</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark flat @click="submit" :disabled = "!editMode" :loading="loading">Save</v-btn>
              <v-btn dark flat @click="editMode = !editMode">Edit</v-btn>
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
                                    v-model="material.id">
                                    readonly="true">
                    </v-text-field>
                    <v-text-field v-validate="`required|max:30`"
                                    :counter="30"
                                    :error-messages="errors.collect('name')"
                                    data-vv-name="name" label="Name"
                                    v-model="material.name"
                                    :readonly="!editMode">
                    </v-text-field>
                    <v-text-field v-validate="`max:100`"
                                    :counter="100"
                                    :error-messages="errors.collect('description')"
                                    data-vv-name="description"
                                    label="Description"
                                    v-model="material.description"
                                    :readonly="!editMode">
                    </v-text-field>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>

export default {
    props: [ 
        'materialsItems',
        'material',
     ],
    data() {
        return {
            dialog: false,
            items: [],
            editMode: false,
            loading: false,
        }
    },
    methods: {
        submit() {
            this.$validator.validate().then(valid => {
                if(valid){
                    this.loading = true;

                    const material = {
                        name: this.name,
                        description: this.description
                    };

                    console.log(order);

                    this.$http.post('http://' + process.env.VUE_APP_HOST + ':' + process.env.VUE_APP_BACKEND_PORT + '/updateMaterial', order,
                    {headers: {'Content-Type': 'application/json;charset=UTF-8'}}).then(response => {
                        this.material = response.body;
                        console.log(response.body);
                        this.editMode = false;
                        this.loading = false;
                        this.$emit('refresh');
                    }, response => {
                        console.log(response);
                    });
                }
            });
        },
    },
    watch: {
        dialog:  function() {
            if(!this.dialog) {
                this.editMode = false;
                console.log(this.editMode);
            }
        }
    },
}
</script>
<style>
</style>