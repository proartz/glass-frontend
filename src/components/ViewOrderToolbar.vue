<template>
    <v-toolbar-items>
        <v-btn
            :to = "{
                name: 'Edytuj Zlecenie',
                params: {
                    id: id
                }
            }"
            flat
            icon
        >
            <v-icon>edit</v-icon>
        </v-btn>
    </v-toolbar-items>
</template>

<script>
import EventBus from '@/event-bus.js';

export default {
    props: ['id'],
    data() {
        return {
            loading: false,
            editMode: false   
        }
    },
    methods: {
        
    },
}
</script>

<style scoped>
</style>