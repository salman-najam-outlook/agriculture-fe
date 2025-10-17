<template>
    <v-dialog v-model="dialog" width="700">
        <v-card>
            <v-toolbar color="primary" class="white--text" flat :elevation="0">
                <v-toolbar-title class="font-weight-bold">{{ $t('esgPlatform.downloadReport') }}</v-toolbar-title>

                <v-spacer></v-spacer>

                <v-btn icon class="white--text" @click="closeModal">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-card-text>
                <p class="py-4">{{ $t('esgPlatform.chooseTimeFrame') }}</p>

                <v-row>
                    <v-col cols="12" md="6">
                        <v-select 
                            dense 
                            label="Select Year" 
                            :items="years"
                            item-text="text"
                            item-value="value"
                            v-model="selectedYear" 
                            outlined
                        ></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-select dense label="Select Quarter" :items="quarters" v-model="selectedQuarter"
                            outlined></v-select>
                    </v-col>
                </v-row>
            </v-card-text>

            <v-card-actions class="justify-end py-4">
                <v-btn text @click="closeModal" color="primary" outlined>{{ $t('cancel') }}</v-btn>
                <v-btn color="primary" @click="confirmDownload">{{ $t('confirm') }}</v-btn>
            </v-card-actions>
        </v-card>

    </v-dialog>
</template>

<script>
export default {
    props: {
        dialog: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            years: [
                { text: '2024-2025', value: '2024' },
                { text: '2025-2026', value: '2025' },
                { text: '2026-2027', value: '2026' },
                { text: 'All', value: 'All' }
            ],
            quarters: [
                'All',
            ],
            selectedYear: new Date().getFullYear().toString(),
            selectedQuarter: 'All',
        };
    },
    methods: {
        confirmDownload() {
            const payload = {
                year: this.selectedYear === 'All' ? new Date().getFullYear() : parseInt(this.selectedYear),
                quarter: this.selectedQuarter
            };
            this.$emit('download', payload);
        },
        closeModal() {
            this.$emit('close');
        },
    },
};
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>