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
            <v-toolbar-title>Add New Material</v-toolbar-title>
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
                                    :error-messages="errors.collect('name')"
                                    data-vv-name="name" label="Name"
                                    v-model="name">
                    </v-text-field>
                    <v-text-field v-validate="`max:100`"
                                    :counter="100"
                                    :error-messages="errors.collect('description')"
                                    data-vv-name="description"
                                    label="Description"
                                    v-model="description">
                    </v-text-field>
                    <v-btn @click="submit" :loading="loading">Add Material</v-btn>
                    <v-btn @click="clearForm">Clear</v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    data() {
        return {
            now: '',
            loading: false,
            dialog: false,
            toolbarItems: [],

            name: '',
            description: ''
        }
    },
    methods: {
        clearForm() {
            this.$refs.form.reset();
            this.$validator.reset();
        },
        submit() {
            this.$validator.validate().then(valid => {
                if(valid){
                    this.loading = true;

                    const material = {
                        name: this.name,
                        description: this.description
                    };

                    console.log(material);

                    this.$http.post('http://' + process.env.VUE_APP_HOST + ':' + process.env.VUE_APP_BACKEND_PORT + '/material', material,
                    {headers: {'Content-Type': 'application/json;charset=UTF-8'}}).then(response => {
                        console.log(response.status);
                        this.loading = false;
                        this.dialog = false;
                        this.$emit('showSnackbar', "Material " + material.name + " added.");
                        this.$emit('materialAdded');
                        this.clearForm();
                    }, response => {
                        console.log(response);
                    });
                }
            });
        }
    },
    created() {
    }
}
</script>

