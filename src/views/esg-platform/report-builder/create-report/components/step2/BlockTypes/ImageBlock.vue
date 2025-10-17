<template>
    <div class="image-block" v-if="!preview">
        <div class="d-flex justify-space-between align-center mb-2">
            <span class="image-label">Image</span>
            <div class="d-flex align-center">
                <v-btn icon color="primary" class="mr-2" @click="showSettings = true">
                    <v-icon>mdi-cog</v-icon>
                </v-btn>
                <v-btn icon color="error" @click="$emit('delete')">
                    <v-icon>mdi-trash-can</v-icon>
                </v-btn>
            </div>
        </div>

        <div class="image-type-section mb-2">
            <div class="image-type-label">Select Image Type</div>
            <v-radio-group v-model="block.imageType" column>
                <v-radio label="Single Image" value="single" />
                <v-radio label="Image grid" value="grid" />
            </v-radio-group>
        </div>

        <div v-if="block.imageType === 'grid'" class="mb-2">
            <div class="grid-size-label">Grid Size</div>
            <div class="d-flex align-center grid-size-input">
                <v-text-field v-model.number="block.grid[0]" type="number" dense outlined hide-details
                    style="max-width: 60px;" />
                <span class="mx-2">X</span>
                <v-text-field v-model.number="block.grid[1]" type="number" dense outlined hide-details
                    style="max-width: 60px;" />
            </div>
        </div>

        <div class="images-label mb-1">Images</div>
        <!-- Single Image -->
        <div v-if="block.imageType === 'single'">
            <div class="single-upload-box" @click="triggerFileInput">
                <v-icon size="40" color="grey">mdi-camera</v-icon>
                <div class="add-image-btn">Add Image</div>
                <input ref="fileInput" type="file" accept="image/*" class="d-none" @change="onSingleImageChange" />
            </div>
            <div v-if="block.images && block.images.length" class="single-image-preview">
                <v-img :src="block.images[0]" height="120" contain />
                <v-btn icon color="error" class="delete-btn" @click="removeImage(0)">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </div>
        </div>

        <!-- Image Grid -->
         <!-- :style="{ gridTemplateColumns: `repeat(${block.grid[0]}, 1fr)` }" -->
        <div v-else>
            <div class="image-grid" >
                <div v-for="i in totalGrid" :key="i" class="grid-cell">
                    <template v-if="block.images[i - 1]">
                        <v-img :src="block.images[i - 1]" height="100" contain />
                        <v-btn icon color="error" class="delete-btn" @click="removeImage(i - 1)">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </template>
                    <template v-else>
                        <div class="grid-upload-box" @click="triggerGridFileInput(i - 1)">
                            <v-icon size="32" color="#bdbdbd">mdi-camera</v-icon>
                            <div class="add-image-btn">Add Image</div>
                            <input :ref="'gridFileInput' + (i - 1)" type="file" accept="image/*" class="d-none"
                                @change="onGridImageChange($event, i - 1)" />
                        </div>
                    </template>
                </div>
            </div>
        </div>

        <ComponentSettingsDialog v-model="showSettings" :settings="settings" @save="handleSaveSettings" />
    </div>

    <!-- Preview Mode -->
    <div v-else>
        <!-- Single Image Preview -->
        <div v-if="block.imageType === 'single' && block.images && block.images.length" class="preview-single-image">
            <img :src="block.images[0]" alt="Preview Image" class="preview-img-full" />
        </div>
        <!-- Grid Preview -->
        <div v-else-if="block.imageType === 'grid'" class="preview-image-grid"
            :style="{ gridTemplateColumns: `repeat(${block.grid[0]}, 1fr)` }">
            <div v-for="i in totalGrid" :key="i" class="preview-grid-cell">
                <img v-if="block.images[i - 1]" :src="block.images[i - 1]" alt="Grid Image" class="preview-img-grid" />
            </div>
        </div>
    </div>
</template>

<script>
import ComponentSettingsDialog from '../ComponentSettingDialog.vue';

export default {
    props: {
        block: Object,
        preview: {
            type: Boolean,
            default: false
        }
    },
    components: { ComponentSettingsDialog },
    computed: {
        totalGrid() {
            const [cols, rows] = this.block.grid || [5, 3];
            return cols * rows;
        }
    },
    data() {
        return {
            showSettings: false,
            settings: {
                bgColor: '#ffffff',
                fontColor: '#101010',
                font: 'Poppins'
            }
        };
    },
    methods: {
        triggerFileInput() {
            this.$refs.fileInput.click();
        },
        onSingleImageChange(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (evt) => {
                    this.$set(this.block, 'images', [evt.target.result]);
                };
                reader.readAsDataURL(file);
            }
        },
        triggerGridFileInput(idx) {
            this.$refs['gridFileInput' + idx][0].click();
        },
        onGridImageChange(e, idx) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (evt) => {
                    if (!this.block.images) this.$set(this.block, 'images', []);
                    this.$set(this.block.images, idx, evt.target.result);
                };
                reader.readAsDataURL(file);
            }
        },
        removeImage(idx) {
            if (!this.block.images || !this.block.images.length) return;
            this.block.images.splice(idx, 1);
            //this.$set(this.block.images, idx, null);
        },
        handleSaveSettings(newSettings) {
            this.settings = newSettings;
        }
    },
    created() {
        if (!this.block.imageType) this.$set(this.block, 'imageType', 'single');
        if (!this.block.images) this.$set(this.block, 'images', []);
        if (!this.block.grid) this.$set(this.block, 'grid', [5, 3]);
        // Ensure correct images length on create
        const total = this.totalGrid;
        while (this.block.images.length < total) {
            this.block.images.push(null);
        }
        if (this.block.images.length > total) {
            this.block.images.length = total;
        }
    }
};
</script>

<style scoped>
.image-block {
    background: #f8f8f8;
    border-radius: 4px;
    padding: 24px;
    margin-bottom: 16px;
    position: relative;
}

.image-label {
    font-size: 20px;
    font-weight: 700;
    color: #222;
}

.image-type-label,
.grid-size-label,
.images-label {
    font-size: 16px;
    font-weight: 500;
    color: #222;
}

.single-upload-box,
.grid-upload-box {
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
    margin: 12px;
    background: #47bc84;
    color: #fff;
    border-radius: 4px;
    padding: 6px 16px;
    font-size: 16px;
    box-shadow: 0 2px 4px #0001;
}

.single-image-preview {
    position: relative;
    margin-top: 8px;
    width: 260px;
}

.delete-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    background: #fff !important;
    box-shadow: 0 2px 8px #0002;
}

.image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 16px;
}

.grid-cell {
    position: relative;
    min-height: 120px;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
}

.d-none {
    display: none;
}

.grid-size-input {
    max-width: 180px;
}

/* Preview styles */
.preview-single-image {
    width: 100%;
    height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
}

.preview-img-full {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 8px;
    background: #fafbfc;
}

.preview-image-grid {
    display: grid;
    gap: 16px;
    margin-bottom: 16px;
}

.preview-grid-cell {
    background: #fafbfc;
    border-radius: 8px;
    min-height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.preview-img-grid {
    width: 100%;
    height: 100px;
    object-fit: contain;
    border-radius: 8px;
    background: #fff;
}
</style>