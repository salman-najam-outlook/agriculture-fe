<template>
    <v-container fluid>
    <v-dialog v-model="dialog" max-width="600px" persistent>
        <v-card>
            <!-- Header -->
            <v-card-title class="pa-4 white--text primary">
                <span class="text-h6">{{ $t("Confirmation") }}</span>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="closeDialog">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <!-- Content -->
            <v-card-text class="pa-6">
                <p class="text-body-1 mb-6">
                    {{ $t("Please choose the format in which you want to download the report:") }}
                </p>

                <v-radio-group v-model="selectedFormat" class="mt-0">
                    <v-radio value="pdf" class="mb-4">
                        <template v-slot:label>
                            <div>
                                <strong>PDF</strong>
                                <span class="text-body-2 grey--text ml-1">
                                    ({{ $t("Download the report as a PDF file for easy sharing and printing.") }})
                                </span>
                            </div>
                        </template>
                    </v-radio>

                    <v-radio value="xls">
                        <template v-slot:label>
                            <div>
                                <strong>XLS</strong>
                                <span class="text-body-2 grey--text ml-1">
                                    ({{ $t("Download the report as an Excel file for data analysis and customization.")
                                    }})
                                </span>
                            </div>
                        </template>
                    </v-radio>
                </v-radio-group>
            </v-card-text>

            <!-- Actions -->
            <v-card-actions class="pa-6 pt-0">
                <v-spacer></v-spacer>
                <v-btn outlined color="grey" @click="closeDialog" class="mr-3">
                    {{ $t("CANCEL") }}
                </v-btn>
                <v-btn color="primary" @click="handleDownload" :disabled="!selectedFormat">
                    {{ $t("DOWNLOAD") }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    </v-container>
</template>

<script>
export default {
    name: 'DownloadConfirmDialog',
    props: {
        value: {
            type: Boolean,
            default: false
        },
        item: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            selectedFormat: 'pdf' // Default to PDF
        }
    },
    computed: {
        dialog: {
            get() {
                return this.value
            },
            set(value) {
                this.$emit('input', value)
            }
        }
    },
    methods: {
        closeDialog() {
            this.dialog = false
            this.selectedFormat = 'pdf' // Reset to default
        },
        handleDownload() {
            // Emit the download event with selected format and item data
            this.$emit('download', {
                format: this.selectedFormat,
                item: this.item
            })
            this.closeDialog()
        }
    }
}
</script>

<style scoped>
.v-card-title {
    border-radius: 4px 4px 0 0;
}

.v-radio>>>.v-label {
    color: rgba(0, 0, 0, 0.87) !important;
}
</style>