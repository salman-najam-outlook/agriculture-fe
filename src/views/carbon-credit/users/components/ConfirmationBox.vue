<template>
    <v-dialog v-model="dialog" persistent max-width="500">
        <v-card>
            <!-- Header with dynamic color based on action type -->
            <v-toolbar 
                color= '#00BD73' 
                elevation="0"
                class="white--text"
            >
                <v-toolbar-title class="white--text font-weight-bold">
                    {{ dialogTitle }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn color="white" icon @click="closeDialog">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <!-- Content Area -->
            <v-card-text class="pt-5 black--text">
                <div class="text-body-1 mb-4">
                    {{ message }}
                </div>
                
                <v-divider class="mt-4 mb-4"></v-divider>

                <!-- Action Buttons -->
                <v-card-actions class="pa-0">
                    <v-spacer></v-spacer>
                    <v-btn 
                        color="#00BD73"
                        outlined
                        @click="closeDialog"
                        class="mr-3"
                        style="text-transform: uppercase; font-weight: bold;"
                    >
                        {{ $t('carbonCredit.cancel') }}
                    </v-btn>
                    <v-btn 
                        color="#00BD73"
                        class="white--text font-weight-bold"
                        @click="confirmAction"
                        style="text-transform: uppercase;"
                    >
                            {{ confirmButtonText }}
                    </v-btn>
                </v-card-actions>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'ConfirmationBox',
    props: {
        dialog: {
            type: Boolean,
            required: true
        },
        actionType: {
            type: String,
            required: false,
            default: 'reject',
            validator: value => ['reject', 'accept'].includes(value)
        },
        message: {
            type: String,
            required: true
        },
        confirmData: {
            type: Object,
            required: false,
            default: () => ({})
        },
        dialogTitle: {
            type: String,
            required: false,
            default: null
        },
        confirmButtonText: {
            type: String,
            required: false,
            default: null
        }
    },
    methods: {
        closeDialog() {
            this.$emit('close')
        },
        confirmAction() {
            this.$emit('confirm', this.confirmData)
        }
    }
}
</script>

<style scoped>
.v-toolbar {
    border-radius: 0;
}

.v-card {
    border-radius: 8px;
    overflow: hidden;
}

.v-btn {
    border-radius: 4px;
    font-weight: 600;
}
</style> 