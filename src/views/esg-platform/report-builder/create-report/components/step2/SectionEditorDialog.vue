<template>
    <v-dialog v-model="visible" max-width="600" persistent>
        <v-card class="pa-0">
            <!-- Header -->
            <div class="dialog-header d-flex align-center justify-space-between px-6 py-4">
                <span class="dialog-title font-weight-bold white--text">Add New</span>
                <v-btn icon @click="close" class="white--text">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </div>

            <!-- Block Type Selection -->
            <v-card-text class="py-4 px-0">
                <v-container fluid>
                    <v-row dense>
                        <v-col cols="12" v-for="item in blockTypes" :key="item.type">
                            <v-btn :class="['block-btn', selectedType === item.type ? 'block-btn--active' : '']" block
                                large depressed color="white" @click="selectType(item.type)">
                                <span class="block-btn-label">{{ item.label }}</span>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>

            <!-- Actions -->
            <v-card-actions class="justify-end px-6 pb-6">
                <v-btn outlined color="primary" class="mr-4" @click="close">CANCEL</v-btn>
                <v-btn color="primary" class="white--text" @click="submit">SUBMIT</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        value: Boolean,
        section: Object,
    },
    data() {
        return {
            visible: false,
            selectedType: 'heading',
            blockTypes: [
                { type: 'heading', label: 'Heading' },
                { type: 'paragraph', label: 'Paragraph' },
                { type: 'image', label: 'Image' },
                { type: 'stakeholders', label: 'Stakeholders' },
                { type: 'table', label: 'Table' },
                { type: 'esgProgressLineChart', label: 'ESG Progress Line Chart' },
                { type: 'esgScorecard', label: 'ESG Scorecard' },
            ],
        };
    },
    watch: {
        value(val) {
            this.visible = val;
        },
    },
    methods: {
        selectType(type) {
            this.selectedType = type;
        },
        close() {
            this.$emit('input', false);
        },
        submit() {
            // Return a new block template
            const templates = {
                heading: { type: 'heading', text: '' },
                paragraph: { type: 'paragraph', text: '' },
                image: { type: 'image', url: '', imageType: 'single' },
                imageGrid: { type: 'imageGrid', urls: [], cardSize: [5, 3] },
                stakeholders: { type: 'stakeholders', stakeholders: [] },
                table: { type: 'table', headers: [], rows: [] },
                esgProgressLineChart: { type: 'esgProgressLineChart', data: [] },
                esgScorecard: { type: 'esgScorecard', scores: [] },
            }
            this.$emit('save', templates[this.selectedType])
            this.close()
        },
    },
};
</script>

<style scoped>
.dialog-header {
    background: #167a3c;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
}

.dialog-title {
    font-size: 20px;
}

.block-btn {
    border: 1.5px dashed #bdbdbd !important;
    border-radius: 12px !important;
    background: #fff !important;
    color: #444 !important;
    font-size: 20px !important;
    font-weight: 500 !important;
    height: 90px !important;
    transition: background 0.2s, color 0.2s;
}

.block-btn--active {
    background: #06c47c !important;
    color: #fff !important;
    border: none !important;
}

.block-btn-label {
    width: 100%;
    text-align: center;
}
</style>