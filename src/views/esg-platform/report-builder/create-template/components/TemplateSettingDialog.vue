<template>
    <v-dialog v-model="visible" max-width="650" persistent>
        <v-card>
            <!-- Header -->
            <div class="dialog-header d-flex align-center justify-space-between px-6 py-3">
                <span class="dialog-title">Template Settings</span>
                <v-btn icon @click="close" class="white--text">
                    <v-icon medium>mdi-close</v-icon>
                </v-btn>
            </div>
            <v-card-text class="px-6 py-4">
                <!-- Main Colors/Font -->
                <v-row>
                    <v-col cols="12" md="6">
                        <div class="setting-label">Background Color</div>
                        <v-text-field v-model="local.bgColor" outlined hide-details class="color-input"
                            :style="{ '--color-box': local.bgColor }">
                            <template v-slot:prepend-inner>
                                <span class="color-box" :style="{ background: local.bgColor }"></span>
                            </template>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" md="6" small>
                        <div class="setting-label">Font Color</div>
                        <v-text-field v-model="local.fontColor" outlined hide-details class="color-input"
                            :style="{ '--color-box': local.fontColor }">
                            <template v-slot:prepend-inner>
                                <span class="color-box" :style="{ background: local.fontColor }"></span>
                            </template>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <div class="setting-label">Font</div>
                        <v-select v-model="local.font" :items="fonts" outlined hide-details />
                    </v-col>
                </v-row>
                <v-divider class="my-6" />
                <!-- PDF Header -->
                <div class="pdf-header-label mb-2">PDF Header</div>
                <v-row>
                    <v-col cols="12" md="6">
                        <div class="setting-label">Background Color</div>
                        <v-text-field v-model="local.pdfHeaderBg" outlined hide-details class="color-input"
                            :style="{ '--color-box': local.pdfHeaderBg }">
                            <template v-slot:prepend-inner>
                                <span class="color-box" :style="{ background: local.pdfHeaderBg }"></span>
                            </template>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <div class="setting-label">Font Color</div>
                        <v-text-field v-model="local.pdfHeaderFontColor" outlined hide-details class="color-input"
                            :style="{ '--color-box': local.pdfHeaderFontColor }">
                            <template v-slot:prepend-inner>
                                <span class="color-box" :style="{ background: local.pdfHeaderFontColor }"></span>
                            </template>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <div class="setting-label">Font</div>
                        <v-select v-model="local.pdfHeaderFont" :items="fonts" outlined hide-details />
                    </v-col>
                </v-row>
                <v-divider class="my-6" />
                <!-- Report Header Logo -->
                <div class="pdf-header-label mb-2">Report Header Logo</div>
                <div class="setting-label mb-1">Upload Logo</div>
                <div class="logo-upload-box mb-4" @click="triggerFileInput">
                    <v-icon size="40" color="#bdbdbd">mdi-camera</v-icon>
                    <div class="add-image-btn">Add Image</div>
                    <input ref="fileInput" type="file" accept="image/*" class="d-none" @change="onLogoChange" />
                </div>
                <div class="setting-label mb-1">Default Logo</div>
                <v-img v-if="local.logo" :src="local.logo" max-width="220" max-height="60" contain class="mb-2" />
                <v-img v-else src="https://www.abrafrutas.org/wp-content/uploads/2021/07/Logo-Abrafrutas-2021.png"
                    max-width="220" max-height="60" contain class="mb-2" />
            </v-card-text>
            <v-card-actions class="justify-end px-6 pb-6 pt-4">
                <v-btn outlined color="primary" class="mr-4" @click="close">CANCEL</v-btn>
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
            local: {
                bgColor: '#ffffff',
                fontColor: '#101010',
                font: 'Poppins',
                pdfHeaderBg: '#244513',
                pdfHeaderFontColor: '#ffffff',
                pdfHeaderFont: 'Poppins',
                logo: ''
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
                this.local = { ...this.local, ...this.settings }
            }
        }
    },
    methods: {
        close() {
            this.$emit('input', false)
        },
        save() {
            this.$emit('save', { ...this.local })
            this.close()
        },
        triggerFileInput() {
            this.$refs.fileInput.click()
        },
        onLogoChange(e) {
            const file = e.target.files[0]
            if (file) {
                const reader = new FileReader()
                reader.onload = evt => {
                    this.local.logo = evt.target.result
                }
                reader.readAsDataURL(file)
            }
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
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.5px;
}

.setting-label {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 8px;
    color: #222;
}

.pdf-header-label {
    font-size: 16px;
    font-weight: 700;
    color: #222;
    margin-bottom: 8px;
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

.logo-upload-box {
    border: 2px dashed #bdbdbd;
    border-radius: 8px;
    padding: 24px 0 12px 0;
    text-align: center;
    cursor: pointer;
    color: #888;
    background: #fff;
    margin-bottom: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.add-image-btn {
    margin-top: 8px;
    background: #4ecb8f;
    color: #fff;
    border-radius: 4px;
    padding: 6px 22px;
    font-size: 16px;
    box-shadow: 0 2px 4px #0001;
}

.d-none {
    display: none;
}
</style>