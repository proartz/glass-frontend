<template>
    <v-toolbar-items>
    </v-toolbar-items>
</template>

<script>
import EventBus from '@/event-bus.js';

export default {
    props: ['id'],
    data() {
        return {
            isOrderEdited: false,
            loading: false,
            editMode: false   
        }
    },
    methods: {
        submit() {
            EventBus.$emit('submit');
        }
    },
    created() {
        EventBus.$on('enableSave', () => { this.isOrderEdited = true; })
        EventBus.$on('disableSave', () => { this.isOrderEdited = false; })
    }
}
</script>

<style scoped>
</style>