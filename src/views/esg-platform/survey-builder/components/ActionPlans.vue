<template>
  <v-card outlined class="pa-4">
    <h4 class="mb-3">{{ $t('esgPlatform.surveyResponse.actionPlans') }}</h4>
    <div v-for="plan in plans" :key="plan._id" class="mb-3">
      <p class="text-subtitle-2">{{ plan.title }}</p>
      <div v-if="plan.isFileRequired" class="file-upload-section">
        <div class="upload-document">
          <div
            :class="['dropZone', { 'dropZone-over': plan.isDragging }]"
            @dragenter.prevent="plan.isDragging = true"
            @dragleave.prevent="plan.isDragging = false"
            @dragover.prevent
            @drop.prevent="handleDrop($event, plan)"
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
              :accept="getFileAcceptTypes(plan.allowedTypes)"
              @change="onFileChange($event, plan)"
              style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer;"
            />
          </div>
        </div>
        <template v-if="plan.uploadedFiles && plan.uploadedFiles.length">
          <div class="pdf-docs mt-10 d-flex flex-column flex-sm-row" v-for="(doc, index) in plan.uploadedFiles" :key="index">
            <div class="docs-box mr-4 mb-4 mb-sm-0">
              <div class="docs-preview">
                <div class="img-item">
                  <div class="pdf-box">
                    <v-icon class="delete-icon" @click="$emit('remove-file', { plan, fileIndex: index })">
                      mdi-trash-can-outline
                    </v-icon>
                    <h1 class="file-extension">{{ getFileExtension(doc) }}</h1>
                  </div>
                  <p class="file-name">{{ getFileName(doc) }}</p>
                </div>
              </div>
            </div>
            <!-- <div class="text-box mr-8">
              <v-textarea
                :value="doc.comment"
                @input="newComment => $emit('update-comment', { plan, fileIndex: index, comment: newComment })"
                rows="3.5"
                auto-grow
                placeholder="Comments"
                outlined
              />
            </div> -->
          </div>
        </template>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'ActionPlans',
  
  props: {
    plans: {
      type: Array,
      default: () => []
    }
  },
  
  methods: {
    onFileChange(event, plan) {
      const files = Array.from(event.target.files);
      this.$emit('file-change', files, plan);
    },
    
    handleDrop(event, plan) {
      event.preventDefault();
      plan.isDragging = false;
      const files = Array.from(event.dataTransfer.files);
      this.$emit('file-change', files, plan);
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
        .filter(([  allowed]) => allowed)
        .map(([type]) => typeMap[type])
        .join(',');
    },
    
    getFileExtension(doc) {
      const parts = doc.name?.split('.') || doc.key?.split('.');
      return parts.length > 1 ? parts.pop().toUpperCase() : '';
    },
    
    getFileName(doc) {
      return doc?.name || 'Unnamed file';
    }
  }
};
</script>

<style scoped>
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
  line-height: 1;
}

.file-name {
  display: block;
  font-size: 12px;
  color: #333;
  margin-top: 5px;
  text-align: center;
  word-break: break-all;
}
</style>