<template>
    <div>
        <h1 class="subheading grey--text">Materiały</h1>

    
        <v-btn icon @click="fetchMaterials" :loading="loading">
            <v-icon>refresh</v-icon>
        </v-btn>
        <AddMaterial @materialAdded="fetchMaterials"/>
        <v-text-field prepend-icon="search"
                v-model="searchText"
                solo append-icon="cancel" hide-details single-line></v-text-field>
        <v-container fluid>
            <v-layout row justify-start class="mb-3">
                <v-subheader class="gray--text font-weight-light caption">Sortuj po:</v-subheader>
                <v-btn small flat color="grey" @click="sortBy('id')">
                    <v-icon small left>folder</v-icon>
                    <span class="caption text-lowercase">Id</span>
                </v-btn>
                <v-btn small flat color="grey" @click="sortBy('name')">
                    <v-icon small left>person</v-icon>
                    <span class="caption text-lowercase">nazwa</span>
                </v-btn>
            </v-layout>
            <v-expansion-panel>
                <v-expansion-panel-content v-for="material in filteredMaterials" :key="material.id">
                    <template v-slot:header>
                        <v-layout row wrap class="pa-3">
                            <v-flex>
                                <div class="caption grey--text">Id</div>
                                <div>{{ material.id }}</div>
                            </v-flex>
                            <v-flex>
                               <ViewMaterial @refresh='fetchMaterials' v-bind:material="material"/>
                            </v-flex>
                            <v-flex>
                                <div class="caption grey--text">Nazwa</div>
                                <div>{{ material.name }}</div>
                            </v-flex>
                        </v-layout>
                    </template>
                    <v-divider></v-divider>
                    <v-container class="py-1 pl-5">
                        <v-layout row>
                            <v-flex>
                                <div class="caption grey--text">Opis:</div>
                                <div>{{ material.description }}</div>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-container>
    </div>
</template>

<script>
import AddMaterial from '@/components/AddMaterial';
import ViewMaterial from '@/components/ViewMaterial';
import EventBus from '@/event-bus.js';

export default {
    components: { 
        AddMaterial,
        ViewMaterial
    },
    data() {
        return {
            searchText: '',
            materials: [],
            editMode: false,
            loading: false,
        }
    },
    methods: {
        fetchMaterials() {
            this.loading = true;
            this.$http.get(process.env.VUE_APP_URL + '/materials').then(response => {
                this.materials = response.body;
                this.loading = false;
            }), response => {
                console.error(response);
            }
        },
        sortBy(prop) {
            this.materials.sort((a, b) => a[prop] < b[prop] ? -1: 1)
        },
        includes(material) {
            return material.name.toLowerCase().includes(this.searchText.toLowerCase())
        },
        showSnackbar(message) {
            EventBus.$emit('showSnackbar', message);
        }
    },
    computed: {
        filteredMaterials() {
            return this.materials.filter(this.includes);
        }
    },
    created() {
        this.fetchMaterials();
    },
}
</script>

<style>
</style>

