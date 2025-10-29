<template>
    <div class="heading-block" v-if="!preview">
        <div class="d-flex justify-space-between align-center mb-4 w-100">
            <div class="d-flex align-center">
                <span class="heading-label">Heading</span>
            </div>
            <div class="d-flex align-center">
                <v-btn icon color="primary" class="mr-2" @click="showSettings = true">
                    <v-icon>mdi-cog</v-icon>
                </v-btn>
                <v-btn icon color="error" @click="$emit('delete')">
                    <v-icon>mdi-trash-can</v-icon>
                </v-btn>
            </div>
        </div>
        <div column>
            <v-select v-model="block.size" :items="sizes" label="Heading Size" dense outlined class="mb-4" hide-details
                style="max-width: 150px;" @blur="editing = false" />
            <v-text-field v-model="block.text" label="Heading Title" outlined dense hide-details
                placeholder="Overview" />
        </div>
        <ComponentSettingsDialog v-model="showSettings" :settings.sync="block.settings" />
    </div>
    <component v-else :is="headingTag" class="preview-heading" :style="headingStyle">
        {{ block.text }}
    </component>
</template>

<script>
import ComponentSettingsDialog from '../ComponentSettingDialog.vue'

export default {
    props: {
        block: Object,
        preview: {
            type: Boolean,
            default: false
        },
        headingSize: {
            type: String,
            default: ''
        }
    },
    components: {
        ComponentSettingsDialog
    },
    data() {
        return {
            sizes: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
            editing: false,
            showSettings: false
        };
    },
    computed: {
        headingTag() {
            // Use block.size if set, else headingSize prop, else H1
            const size = this.block.size || this.headingSize || 'H1';
            return size.toLowerCase();
        },
        headingStyle() {
            // Optional: Add custom styles for preview headings
            return {};
        }
    },
};
</script>

<style scoped>
.heading-block {
    background: #f8f8f8;
    border-radius: 4px;
    padding: 24px 24px 16px 24px;
    margin-bottom: 16px;
    position: relative;
}

.heading-label {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 8px;
    color: #222;
}

.preview-heading {
    margin-bottom: 16px;
    font-weight: bold;
}
</style>