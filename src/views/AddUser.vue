<template>
   <v-container fluid fill-height>
       <v-layout>
           <v-flex>
                <v-stepper v-model="e1">
                    <v-stepper-header>
                        <v-stepper-step :complete="e1 > 1" step="1" editable color="#6f00ff">Dodaj Użytkownika</v-stepper-step>
                    </v-stepper-header>
                    <v-stepper-items>
                        <v-stepper-content step="1">
                            <v-card flat class="pb-4">
                                <v-form ref="form">
                                    <v-layout
                                        row
                                        wrap
                                        justify-space-around
                                        align-end
                                        mb-6
                                    >
                                        <v-flex md5>
                                            <v-text-field 
                                                v-validate="`uniqueUsername|required|max:30`"
                                                :counter="30"
                                                :error-messages="errors.collect('username')"
                                                data-vv-name="username" label="Użytkownik"
                                                v-model="user.username"
                                            >
                                            </v-text-field>
                                        </v-flex>
                                        <v-flex md5>
                                            <v-text-field
                                                v-validate="`required|max:30`"
                                                :counter="30"
                                                :error-messages="errors.collect('password')"
                                                data-vv-name="password"
                                                label="Hasło"
                                                v-model="user.password"
                                                type="password">
                                            </v-text-field>
                                        </v-flex>
                                        <v-flex md5>
                                            <v-text-field
                                                v-validate="`required|max:30`"
                                                :counter="30"
                                                :error-messages="errors.collect('firstname')"
                                                data-vv-name="firstname"
                                                label="Imię"
                                                v-model="user.firstname">
                                            </v-text-field>
                                        </v-flex>
                                        <v-flex md5>
                                            <v-text-field
                                                v-validate="`required|max:30`"
                                                :error-messages="errors.collect('lastname')"
                                                data-vv-name="lastname"
                                                label="Nazwisko"
                                                v-model="user.lastname">
                                            </v-text-field>
                                        </v-flex>
                                         <v-flex md5>
                                            <v-text-field
                                                v-validate="`required|max:100`"
                                                :error-messages="errors.collect('roles')"
                                                data-vv-name="roles"
                                                label="Role"
                                                v-model="user.roles">
                                            </v-text-field>
                                        </v-flex>
                                         <v-flex md5>
                                            <v-text-field
                                                v-validate="`max:30`"
                                                :error-messages="errors.collect('permissions')"
                                                data-vv-name="permissions"
                                                label="Uprawnienia"
                                                v-model="user.permissions">
                                            </v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-form>
                            </v-card>

                            <v-btn
                            color="#6f00ff"
                            @click="addUser"
                            dark
                            >
                                Dodaj Użytkownika
                            </v-btn>

                        </v-stepper-content>
                    </v-stepper-items>
                </v-stepper>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import EventBus from '@/event-bus.js';
import api from '@/api.js';
import { Validator } from 'vee-validate';

export default {
    data() {
        return {
            e1: 0,
            loading: false,

            user: {
                username: '',
                password: '',
                firstname: '',
                lastname: '',
                roles: '',
                permissions: ''
            },
            users: []
        }
    },
    methods: {
        addUsernameValidation() {
            Validator.extend('uniqueUsername', {
                getMessage: field => 'Username already exist.',
                validate: value => {
                    // checking if username already exist in the database
                    for(let user in this.users) {
                        if(this.users[user].username == this.user.username) {
                            return false;
                        }
                    }
                    return true;
                }
            })
        },
        clearForm() {
            this.$refs.form.reset();
            this.$validator.reset();
        },
        async fetchUsers() {
            this.loading = true;
            try {
                const response = await api.fetchUsers();
                this.users = response.data;
            } catch ( error ) {
                console.log("Error: fetchUser " + error);
            }
            this.loading = false;
        },
        addUser(){
            this.enableLoading();
            this.$validator.validate().then(valid => {
                if(valid) {
                    api.addUser(this.user).then(response => {
                        EventBus.$emit('showSnackbar', "Dodano użytkownika " + this.user.username);
                        this.clearForm();
                        this.$router.push({ name: 'Użytkownicy'});
                    }).catch(error => {
                        console.log("Error: addUser" + error);
                    })
                }
            });
            this.disableLoading();
        },
        enableLoading() {
            this.loading = true;
            EventBus.$emit('enableLoading');
        },
        disableLoading(){
            this.loading = false;
            EventBus.$emit('disableLoading');
        },
    },
    created() {
        this.fetchUsers();
        this.addUsernameValidation();
    }
}
</script>

<style scoped>

.layout.row {
    text-align: center;
}
.v-input--selection-controls__input {
    margin-right: 0px !important;
    margin-left: 8px;
}

</style>

