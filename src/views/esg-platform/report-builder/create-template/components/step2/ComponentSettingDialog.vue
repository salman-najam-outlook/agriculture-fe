<template>
    <v-dialog v-model="visible" max-width="700" persistent>
        <v-card>
            <!-- Header -->
            <div class="dialog-header d-flex align-center justify-space-between px-6 py-3">
                <span class="dialog-title medium--text">Component Settings</span>
                <v-btn icon @click="close" class="white--text">
                    <v-icon medium>mdi-close</v-icon>
                </v-btn>
            </div>
            <v-card-text class="pa-6">
                <v-row>
                    <v-col cols="12">
                        <div class="setting-label">Background Color</div>
                        <v-text-field v-model="localSettings.bgColor" prepend-inner-icon="" class="color-input"
                            hide-details outlined :style="{ '--color-box': localSettings.bgColor }">
                            <template v-slot:prepend-inner>
                                <span class="color-box" :style="{ background: localSettings.bgColor }"></span>
                            </template>
                        </v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <div class="setting-label">Font Color</div>
                        <v-text-field v-model="localSettings.fontColor" class="color-input" hide-details outlined
                            :style="{ '--color-box': localSettings.fontColor }">
                            <template v-slot:prepend-inner>
                                <span class="color-box" :style="{ background: localSettings.fontColor }"></span>
                            </template>
                        </v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <div class="setting-label">Font</div>
                        <v-select v-model="localSettings.font" :items="fonts" outlined hide-details />
                    </v-col>
                </v-row>
            </v-card-text>
            <v-divider />
            <v-card-actions class="justify-end px-6 pb-6 pt-4">
                <v-btn outlined color="success" class=" mr-4" @click="close">CANCEL</v-btn>
                <v-btn color="primary"  @click="save">SAVE</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        value: Boolean,
        settings: Object
    },
    data() {
        return {
            visible: false,
            localSettings: {
                bgColor: '#ffffff',
                fontColor: '#101010',
                font: 'Poppins'
            },
            fonts: [
                'Poppins', 'Arial', 'Roboto', 'Oswald', 'Georgia', 'Times New Roman', 'Helvetica'
            ]
        }
    },
    watch: {
        value(val) {
            this.visible = val
            if (val && this.settings) {
                this.localSettings = { ...this.settings }
            }
        }
    },
    methods: {
        close() {
            this.$emit('input', false)
        },
        save() {
            this.$emit('update:settings', this.localSettings)
            this.close()
        }
    }
}
</script>

<style scoped>
.dialog-header {
    background: #117646;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}

.dialog-title {
    color: #fff;
    font-weight: 700;
    letter-spacing: 0.5px;
}

.setting-label {
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 8px;
    color: #222;
}

.color-input {
    font-size: 1rem;
}

.color-box {
    display: inline-block;
    width: 28px;
    height: 28px;
    border-radius: 4px;
    border: 1.5px solid #d1d1d1;
    margin-right: 12px;
    vertical-align: middle;
}
</style>