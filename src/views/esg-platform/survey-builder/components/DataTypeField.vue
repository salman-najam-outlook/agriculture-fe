<template>
  <div>
    <!-- Text Field -->
    <v-text-field v-if="type === 'text-field'"
      :value="value"
      @input="$emit('input', $event)"
      outlined 
      dense
      :rules="mandatory ? [v => !!v || $t('esgPlatform.surveyResponse.fieldRequired')] : []" 
    />

    <!-- Text Area -->
    <v-textarea v-if="type === 'text-area'"
      :value="value"
      @input="$emit('input', $event)"
      outlined 
      auto-grow 
      rows="3"
      :rules="mandatory ? [v => !!v || $t('esgPlatform.surveyResponse.fieldRequired')] : []" 
    />

    <!-- Numeric Field -->
    <v-text-field v-if="type === 'numeric'"
      :value="value"
      @input="$emit('input', Number($event))"
      type="number" 
      outlined 
      dense
      :rules="mandatory ? [v => !!v || $t('esgPlatform.surveyResponse.fieldRequired')] : []" 
    />

    <!-- Date Field -->
    <v-text-field v-if="type === 'date'"
      :value="value"
      @input="$emit('input', $event)"
      type="date" 
      outlined 
      dense
      :rules="mandatory ? [v => !!v || $t('esgPlatform.surveyResponse.fieldRequired')] : []" 
    />

    <!-- File Upload -->
    <div v-if="type === 'attach-file'" class="file-upload-section">
      <div class="upload-document">
        <div
          :class="['dropZone', { 'dropZone-over': isDragging }]"
          @dragenter.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @dragover.prevent
          @drop.prevent="handleDrop"
        >
          <div class="dropZone-info d-flex justify-center align-center">
            <v-icon size="50" color="#0057BD">mdi-tray-arrow-up</v-icon>
            <div class="dropZone-upload-limit-info">
              <h2 class="ml-4 blue-color underline">{{ $t('esgPlatform.surveyResponse.selectFile') }}</h2>
              <p class="gray-color">{{ $t('esgPlatform.surveyResponse.dragDrop') }}</p>
            </div>
          </div>
          <input
            type="file"
            multiple
            :accept="getFileAcceptTypes(allowedTypes)"
            @change="handleFileInputChange"
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer;"
          />
        </div>
      </div>

      <!-- Display uploaded files -->
      <template v-if="displayFiles && displayFiles.length > 0">
        <div class="pdf-docs mt-10 d-flex flex-column flex-sm-row" v-for="(file, index) in displayFiles" :key="index">
          <div class="docs-box mr-4 mb-4 mb-sm-0">
            <div class="docs-preview">
              <div class="img-item">
                <div class="pdf-box">
                <v-btn icon class="file-eye-btn" @click="openFile(value?.fileUrl || value?.
                [0]?.fileUrl)">
                  <v-icon color="#135b00">mdi-eye</v-icon>
                </v-btn>
                  <v-icon class="delete-icon" @click="removeFile(index)">
                    mdi-trash-can-outline
                  </v-icon>
                  <h1 class="file-extension">{{ getFileExtension(file) }}</h1>
                </div>
                <p class="file-name">{{ getFileName(file) }}</p>
              </div>
            </div>
          </div>
        </div>
      </template>

      <div v-if="mandatory && !displayFiles?.length" class="red--text text-caption mt-2">
        {{ $t('esgPlatform.surveyResponse.fieldRequired') }}
      </div>
    </div>

    <!-- Digital Signature -->
    <div v-if="type === 'digital-signature'" class="signature-section mt-4">
      <v-btn color="primary" @click="showSignatureModal = true" class="ml-2">
        {{ $t('dueDiligence.addSignature') }}
      </v-btn>
      <div v-if="value?.s3key || value?.key || value?.attachmentLink" class="mt-2">
        <img :src="value.attachmentLink" alt="Signature" style="max-width: 200px;" />
        <v-btn icon @click="$emit('input', null)" class="ml-2">
          <v-icon>mdi-trash-can-outline</v-icon>
        </v-btn>
      </div>
      <signature-modal
        :value="showSignatureModal"
        @input="showSignatureModal = $event"
        @signature="handleSignature"
      />
    </div>

    <!-- Radio Buttons -->
    <v-radio-group
      v-if="type === 'radio-button'"
      :value="value"
      @change="handleRadioChange"
      :rules="mandatory ? [v => !!v || $t('esgPlatform.surveyResponse.fieldRequired')] : []"
    >
      <v-radio
        v-for="(opt, index) in options"
        :key="opt._id || index"
        :label="opt.label || opt"
        :value="opt.label || opt"
      />
    </v-radio-group>

    <!-- Checkboxes -->
    <div v-if="type === 'check-boxes'">
      <v-checkbox
        v-for="(opt, index) in options"
        :key="opt._id || index"
        v-model="localValue"
        :label="opt.label || opt"
        :value="opt.label || opt"
        :rules="mandatory ? [v => localValue.length > 0 || $t('esgPlatform.surveyResponse.fieldRequired')] : []"
      />
    </div>

    <!-- Measurement Unit -->
    <div v-if="type === 'measurement-unit'" class="d-flex align-center">
      <v-text-field
        :placeholder="$t('esgPlatform.dashboard.enterHere')"
        :value="measurementValue?.value || ''"
        @input="val => emitMeasurement(val, selectedUnitType, selectedUnit)"
        type="number"
        outlined
        dense
        class="mr-2"
        :rules="mandatory ? [v => !!v || $t('esgPlatform.surveyResponse.fieldRequired')] : []"
        style="max-width: 150px"
      />

      <v-select
        :items="Object.keys(unitTypeList)"
        :value="selectedUnitType"
        @change="onUnitTypeChange"
        label="Unit Type"
        outlined
        dense
        class="mr-2"
        style="max-width: 120px"
        :disabled="!allowUnitChange"
      />

      <v-select
        :items="availableUnits"
        :value="selectedUnit"
        @change="onUnitChange"
        label="Unit"
        outlined
        dense
        style="max-width: 100px"
        :disabled="!allowUnitChange"
      />
    </div>
  </div>
</template>

<script>
import SignatureModal from './SignatureModal.vue';
export default {
  name: 'DataTypeField',
  components: { 
    'signature-modal': SignatureModal 
  },
  props: {
    type: {
      type: String,
      required: true
    },
    value: {
      type: [Object, String, Number, Array, null],
      default: null
    },
    mandatory: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      default: () => []
    },
    unitTypeList: {
      type: Object,
      default: () => ({})
    },
    unitMeta: {
      type: Object,
      default: () => ({})
    },
    unitList: {
      type: Array,
      default: () => []
    },
    uploadedFiles: {
      type: Array,
      default: () => []
    },
    allowUnitChange: {
      type: Boolean,
      default: true
    },
    allowedTypes: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      files: [],
      localValue: this.type === 'measurement-unit' ? this.value || null : this.value || [],
      showSignatureModal: false,
      isDragging: false
    };
  },

  computed: {
    measurementValue() {
      if (!this.value) return null;
      if (Array.isArray(this.value)) {
        return this.value[this.value.length - 1];
      }
      return this.value;
    },
    selectedUnitType() {
      return this.measurementValue?.category || Object.keys(this.unitTypeList)[0] || '';
    },
    selectedUnit() {
      return this.measurementValue?.id || this.unitTypeList[this.selectedUnitType]?.[0] || '';
    },
    availableUnits() {
      return this.unitTypeList[this.selectedUnitType] || [];
    },
    displayFiles() {
      if (!this.value) return [];
      
      // If value is an array of files
      if (Array.isArray(this.value)) {
        return this.value;
      }
      
      // If value is a single file object
      if (this.value && typeof this.value === 'object') {
        return [this.value];
      }
      
      return [];
    }
  },

  watch: {
    value(newVal) {
      this.localValue = this.type === 'measurement-unit' ? newVal || null : newVal || [];
    },
    localValue(newVal) {
      this.$emit('input', newVal);
    }
  },

  methods: {
    handleFileInputChange(event) {
      const files = Array.from(event.target.files);
      this.$emit('file-change', files);
    },

    handleDrop(event) {
      event.preventDefault();
      this.isDragging = false;
      const files = Array.from(event.dataTransfer.files);
      this.$emit('file-change', files);
    },

    addFiles(newFiles) {
      if (!newFiles || newFiles.length === 0) return;
      
      // Convert current value to array if it's not already
      let currentFiles = [];
      if (Array.isArray(this.value)) {
        currentFiles = [...this.value];
      } else if (this.value && typeof this.value === 'object') {
        currentFiles = [this.value];
      }
      
      // Add new files to the existing files
      const updatedFiles = [...currentFiles, ...newFiles];
      this.$emit('input', updatedFiles);
      this.$emit('file-change', newFiles);
    },

    removeFile(index) {
      // this.$emit('remove-file', index);
      if (!Array.isArray(this.value)) {
        this.$emit('input', null);
        return;
      }
      
      const updatedFiles = this.value.filter((_, i) => i !== index);
      this.$emit('input', updatedFiles.length > 1 ? updatedFiles : updatedFiles[0] || null);
    },

    handleSignature(signatureData) {
      this.$emit('input', signatureData);
    },

    handleCheckboxChange(option) {
      if (option?.selected) {
        if (!this.localValue.includes(option._id || option.label || option)) {
          this.localValue.push(option._id || option.label || option);
        }
      } else {
        this.localValue = this.localValue.filter(
          v => v !== (option._id || option.label || option)
        );
      }
      this.$emit('input', this.localValue);
      this.$emit('checkbox-change', option);
    },

    handleRadioChange(newValue) {
      this.$emit('input', newValue);
    },

    emitMeasurement(val, unitType, unitId) {
      const unitData = this.unitMeta[unitId] || {
        id: unitId,
        name: unitId,
        abbr: unitId,
        factor: 1,
        category: unitType
      };
      
      const newResponse = { 
        ...unitData,
        value: val 
      };

      this.$emit('input', newResponse);
    },

    onUnitTypeChange(newType) {
      const firstUnit = this.unitTypeList[newType]?.[0] || '';
      const currentValue = this.measurementValue?.value || '';
      this.emitMeasurement(currentValue, newType, firstUnit);
    },

    onUnitChange(newUnit) {
      this.emitMeasurement(this.measurementValue?.value || '', this.selectedUnitType, newUnit);
    },

    isImageFile(fileName) {
      if (!fileName) return false;
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
      const extension = fileName.split('.').pop().toLowerCase();
      return imageExtensions.includes(extension);
    },

    getFileExtension(file) {
      if (!file) return '';
      
      // Handle file objects
      const name = file.name || file.fileName || file.fileUrl || '';
      if (!name) return '';
      
      const parts = name.split('.');
      return parts.length > 1 ? parts.pop().toUpperCase() : '';
    },

    getFileName(file) {
      return file?.name || file?.fileName || file?.fileUrl?.split('/').pop() || 'Unnamed file';
    },

    getFileAcceptTypes(allowedTypes) {
      if (!allowedTypes) return '';
      const typeMap = {
        image: 'image/*',
        video: 'video/*',
        docx: '.doc,.docx',
        pdf: '.pdf'
      };
      return Object.entries(allowedTypes)
        .filter(([allowed]) => allowed)
        .map(([type]) => typeMap[type])
        .join(',');
    },

    openFile(url) {
      window.open(url, '_blank');
    }
  }
};
</script>

<style lang="scss" scoped>
.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.upload-document {
  width: 100%;
}

.dropZone {
  width: 90%;
  height: 175px;
  position: relative;
  border: 2px dashed #97a8b8;
}

.dropZone:hover {
  border: 2px solid #0057BD;
}

.dropZone-over {
  background: #5c5c5c;
  opacity: 0.8;
}

.dropZone-info {
  color: #a8a8a8;
  position: absolute;
  top: 50%;
  width: 100%;
  transform: translate(0, -50%);
  text-align: center;
  font-size: 12px;
}

.blue-color {
  color: #0057BD;
}

.underline {
  text-decoration: underline;
}

.gray-color {
  color: #9e9e9e;
}

.pdf-docs {
  display: flex;
  justify-content: start;
}

.pdf-box {
  height: 90px;
  width: 90px;
  background-color: #e5f8f1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 4px;
}

.delete-icon {
  position: absolute;
  top: 5px;
  right: 5px;
  color: #135b00;
  cursor: pointer;
}

.file-extension {
  font-size: 18px;
  color: #135b00;
  margin: 0;
  padding-top: 16px;
  line-height: 1;
}

.view-button {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  padding: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1;

  &:hover {
    background-color: rgba(255, 255, 255, 1);
    transform: scale(1.1);
  }
}

.file-name {
  display: block;
  font-size: 12px;
  color: #333;
  margin-top: 5px;
  text-align: center;
  word-break: break-all;
}

.file-preview-centered {
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
}

.file-extension-box {
  display: flex;
  align-items: left;
  justify-content: center;
  height: 100px;
  width: 100px;
  background-color: #e5f8f1;
  border-radius: 12px;
  margin-bottom: 8px;
  position: relative;
}

.file-eye-btn {
  position: absolute;
  top: 1px;
  left: 6px;
  z-index: 2;
  border-radius: 50%;
  padding: 2px;
  min-width: 28px;
  min-height: 28px;
}

.file-extension-text {
  color: #135b00;
  margin: 0;
  text-align: center;
}

.file-name-centered {
  display: block;
  font-size: 15px;
  color: #333;
  margin-top: 0;
  text-align: left;
  word-break: break-all;
  font-family: inherit;
}
</style> 