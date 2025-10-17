<template>
    <v-dialog v-model="dialog" width="20%" @click:outside="closeModal">
        <v-card rounded="lg">
            <v-card-title class="d-flex justify-space-between align-center">
                <div class="text-h5 text-medium-emphasis ps-2">
                    Invite John to connect
                </div>

                <v-btn icon="mdi-close" variant="text"></v-btn>
            </v-card-title>

            <v-divider class="mb-4"></v-divider>

            <v-card-text>
                <div class="text-medium-emphasis mb-4">
                    Invite collaborators to your network and grow your connections.
                </div>

                <div class="mb-2">Message (optional)</div>

                <v-textarea :counter="300" class="mb-2" rows="2" variant="outlined" persistent-counter></v-textarea>

                <v-btn class="text-none font-weight-bold ms-n4" color="primary" text="Retry Premium Free"
                    variant="text"></v-btn>
            </v-card-text>

            <v-divider class="mt-2"></v-divider>

        </v-card>
    </v-dialog>
</template>
<script>
export default {
    computed: {
        dialog() {
            return this.dialogU;
        },
    },
    props: {
        'dialogU': {
            type: Boolean,
            required: true
        },
    },
    methods: {
        closeModal() {
                this.$emit('closeChat')
            },
    },
}
</script>