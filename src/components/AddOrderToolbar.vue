<template>
    <v-toolbar-items>
    </v-toolbar-items>
</template>

<script>
import EventBus from '@/event-bus.js';

export default {
    data() {
        return {
            loading: false
        }
    },
    methods: {
        submit() {
            EventBus.$emit('submit');
        },
        clearForm() {
            EventBus.$emit('clearForm');
        }
    },
    created() {
        EventBus.$on('enableLoading', () => { this.loading = true; });
        EventBus.$on('disableLoading', () => { this.loading = false; });

    }
}
</script>