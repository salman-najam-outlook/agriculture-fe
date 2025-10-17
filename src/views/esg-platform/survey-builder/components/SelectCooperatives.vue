<template>
    <div>
        <v-container>
            <template>
                <div>
                    <v-dialog v-model="dialog" width="1200px" persistent :retain-focus="false">
                        <v-card class="custom-card" rounded="0">
                            <v-toolbar color="primary" class="white--text">
                                <v-toolbar-title class="font-weight-bold">
                                    {{
                                        isEdit
                                            ? "Edit Survey Cooperatives"
                                            : "Select Survey Cooperatives"
                                    }}
                                </v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-btn icon class="white--text" @click="closeModal">
                                    <v-icon>mdi-close</v-icon>
                                </v-btn>
                            </v-toolbar>
                            <v-form class="datafield" lazy-validation autocomplete="off">
                                <v-card-text class="black--text">
                                    <section class="question-footer mt-4">
                                        <v-btn right outlined color="primary" @click="closeModal">
                                            Cancel
                                        </v-btn>
                                        <v-btn right color="primary" @click.prevent="saveSelectedCooperatices">
                                            Continue
                                        </v-btn>
                                    </section>
                                </v-card-text>
                            </v-form>
                        </v-card>
                    </v-dialog>
                </div>
            </template>
        </v-container>
    </div>
</template>
<script>
export default {
    props: {
        isEdit: {
            type: Boolean,
            required: true,
            default: false,
        },
        dialogI: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            selectedCooperatives: []
        }
    },
    computed: {
        dialog() {
            return this.dialogI;
        },
    },
    methods: {
        closeModal() {
            this.$emit("closeDialog");
        },
        saveSelectedCooperatices() {
            this.$emit("cooperativesSelected", this.selectedCooperatives);
        }
    }
}
</script>
<style lang="scss" scoped>
.h3 {
    font-size: 1.2em;
    font-weight: bold;
}

.question-footer {
    display: flex;
    flex-direction: row;
    justify-content: end;
    gap: 20px;
}

::v-deep .v-text-field__details {
    display: none;
}
</style>