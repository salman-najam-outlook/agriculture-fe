<template>
    <div>
        <!-- Edit Mode -->
        <div v-if="!preview">
            <div class="stakeholders-block" v-for="(stakeholder, idx) in block.stakeholders" :key="idx">
                <div v-if="stakeholder" class="mb-6">
                    <div class="d-flex justify-space-between align-center mb-2">
                        <span class="stakeholder-title">Stakeholder {{ idx + 1 }}</span>
                        <div class="d-flex align-center">
                            <v-btn icon color="primary" class="mr-2" @click="editStakeholder(idx)">
                                <v-icon>mdi-cog</v-icon>
                            </v-btn>
                            <v-btn icon color="error" @click="removeStakeholder(idx)">
                                <v-icon>mdi-trash-can</v-icon>
                            </v-btn>
                        </div>
                    </div>
                    <div class="d-flex flex-column mb-3 w-66">
                        <div class="mb-2 stakeholder-label">Name</div>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="stakeholder.name" outlined dense hide-details class="mb-3"
                                    placeholder="Enter here" />
                            </v-col>
                        </v-row>
                    </div>
                    <div class="d-flex flex-column mb-3">
                        <div class="mb-2 stakeholder-label">Message</div>
                        <textarea v-model="stakeholder.message" class="stakeholder-textarea" rows="4"
                            placeholder="Enter message here"></textarea>
                    </div>
                    <div class="mb-2 stakeholder-label">Image</div>
                    <div v-if="stakeholder.image" class="stakeholder-image-preview">
                        <v-img :src="stakeholder.image" max-width="120" max-height="120" contain />
                        <v-btn icon color="primary" class="edit-btn" @click="triggerFileInput(idx)">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon color="error" class="delete-btn" @click="removeImage(idx)">
                            <v-icon>mdi-trash-can</v-icon>
                        </v-btn>
                    </div>
                    <div v-else class="stakeholder-upload-box" @click="triggerFileInput(idx)">
                        <v-icon size="40" color="#bdbdbd">mdi-camera</v-icon>
                        <div class="add-image-btn">Add Image</div>
                    </div>
                    <input :ref="'fileInput' + idx" type="file" accept="image/*" class="d-none"
                        @change="onImageChange($event, idx)" />
                </div>
            </div>
            <div class="pa-6">
                <v-btn v-if="block.stakeholders && block.stakeholders.length" color="primary" outlined class="add-btn "
                    @click="addStakeholder">
                    <v-icon left>mdi-plus</v-icon>
                    Add New Stakeholder
                </v-btn>
            </div>
            <ComponentSettingsDialog v-model="showSettings" :settings.sync="block.settings" />
        </div>
        <div v-else>
            <div class="stakeholders-preview-bg">
                <div class="stakeholders-preview-row">
                    <div class="stakeholder-preview-col" v-for="(stakeholder, idx) in filteredStakeholders" :key="idx">
                        <div class="stakeholder-preview-card">
                            <div class="stakeholder-preview-img-wrap" v-if="stakeholder.image">
                                <img :src="stakeholder.image" class="stakeholder-preview-img" />
                            </div>
                            <div class="stakeholder-preview-name">{{ stakeholder.name }}</div>
                            <div class="stakeholder-preview-message">{{ stakeholder.message }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import ComponentSettingsDialog from '../ComponentSettingDialog.vue'

export default {
    name: 'StakeholdersBlock',
    components: { ComponentSettingsDialog },
    props: {
        block: {
            type: Object,
            required: true
        },
        preview: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            showSettings: false
        }
    },
    created() {
        if (!Array.isArray(this.block.stakeholders) || this.block.stakeholders.length === 0) {
            this.$set(this.block, 'stakeholders', [
                { name: '', message: '', image: '' }
            ])
        }
    },
    computed: {
        filteredStakeholders() {
            return (this.block.stakeholders || []).filter(Boolean);
        }
    },
    methods: {
        addStakeholder() {
            this.block.stakeholders.push({ name: '', message: '', image: '' })
        },
        removeStakeholder(idx) {
            this.block.stakeholders.splice(idx, 1)
            this.block.stakeholders = this.block.stakeholders.filter(Boolean)
        },
        triggerFileInput(idx) {
            this.$refs['fileInput' + idx][0].click()
        },
        onImageChange(e, idx) {
            const file = e.target.files[0]
            if (file) {
                const reader = new FileReader()
                reader.onload = evt => {
                    this.block.stakeholders[idx].image = evt.target.result
                }
                reader.readAsDataURL(file)
            }
        },
        removeImage(idx) {
            this.block.stakeholders[idx].image = ''
        },
        editStakeholder(idx) {
            this.showSettings = true
            console.log("editable idx", idx)
        },
        handleSaveSettings(settings) {
            this.settings = settings
            this.showSettings = false
        }
    }
}
</script>

<style scoped>
.stakeholders-block {
    background: #fafbfc;
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 16px;
    position: relative;
}

.stakeholder-title {
    font-size: 17px;
    font-weight: 700;
    color: #222;
}

.stakeholder-label {
    font-size: 15px;
    font-weight: 500;
    color: #222;
    margin-bottom: 8px;
}

.stakeholder-upload-box {
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
    width: 220px;
    min-height: 120px;
}

.add-image-btn {
    margin-top: 8px;
    background: #4ecb8f;
    color: #fff;
    border-radius: 4px;
    padding: 4px 18px;
    font-weight: 600;
    font-size: 16px;
    box-shadow: 0 2px 4px #0001;
}

.stakeholder-image-preview {
    position: relative;
    width: 120px;
    height: 120px;
    margin-bottom: 8px;
}

.preview-img {
    width: 120px;
    height: 120px;
    object-fit: contain;
    border-radius: 8px;
    background: #fff;
}

.stakeholder-message {
    font-size: 15px;
    color: #222;
    margin-top: 8px;
    margin-bottom: 8px;
    line-height: 1.6;
    background: #fff;
    border-radius: 8px;
    padding: 12px;
    word-break: break-word;
}

.stakeholder-textarea {
    border-radius: 8px;
    border: 1.5px solid #e0e0e0;
    padding: 10px;
    font-size: 15px;
    min-height: 80px;
    resize: vertical;
    background: #fff;
    color: #222;
}

.stakeholders-preview-bg {
    background: #3a9b6c;
    padding: 48px 0;
    border-radius: 12px;
}

.stakeholders-preview-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 32px;
}

.stakeholder-preview-col {
    flex: 1 1 320px;
    max-width: 400px;
    min-width: 280px;
    display: flex;
    justify-content: center;
}

.stakeholder-preview-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    color: #fff;
    padding: 0 12px;
}

.stakeholder-preview-img-wrap {
    width: 180px;
    height: 180px;
    margin-bottom: 28px;
    border-radius: 50%;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.stakeholder-preview-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
}

.stakeholder-preview-name {
    font-size: 1.6rem;
    font-weight: 700;
    margin-bottom: 18px;
    margin-top: 0;
    line-height: 1.2;
    letter-spacing: 0.5px;
}

.stakeholder-preview-message {
    font-size: 1.08rem;
    line-height: 1.7;
    max-width: 340px;
    margin-bottom: 0;
    color: #fff;
    opacity: 0.95;
}

@media (max-width: 900px) {
    .stakeholders-preview-row {
        flex-direction: column;
        align-items: center;
        gap: 40px;
    }

    .stakeholder-preview-col {
        max-width: 100%;
    }
}
</style>