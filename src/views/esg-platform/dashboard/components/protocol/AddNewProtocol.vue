<template>
  <v-dialog v-model="dialog" max-width="700px" @click:outside="closeDialog">
    <v-card>
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title class="white--text">
          {{ $t('esgPlatform.addNewProtocol') }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-card-text>
          <v-row class="pt-4">
            <v-col cols="12">
              <h3>{{ selectedProtocol ? selectedProtocol.title : '' }}</h3>
            </v-col>
            <v-col cols="12">
              <label class="form-label">{{ $t('esgPlatform.protocolTitle') }} <v-tooltip top color="00BD73"
                  max-width="350">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon class="icon-with-background" style="color:#0EBF67;font-size: 18px;" v-bind="attrs"
                      v-on="on">
                      mdi-alert-circle
                    </v-icon>
                  </template>
                  <span>{{ $t('esgPlatform.protocolTitle') }}</span>
                </v-tooltip> </label>
              <v-text-field :placeholder="$t('esgPlatform.dashboard.enterHere')" v-model="formData.title" outlined dense
                :rules="[rules.required]"></v-text-field>
            </v-col>

            <v-col cols="12">
              <label class="form-label">{{ $t('esgPlatform.shortCode') }} <v-tooltip top color="00BD73" max-width="350">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon class="icon-with-background" style="color:#0EBF67;font-size: 18px;" v-bind="attrs"
                      v-on="on">
                      mdi-alert-circle
                    </v-icon>
                  </template>
                  <span> {{ $t('esgPlatform.shortCode') }}</span>
                </v-tooltip> </label>
              <v-text-field :placeholder="$t('esgPlatform.dashboard.enterHere')" v-model="formData.shortCode" outlined
                dense :rules="[rules.required]"></v-text-field>
            </v-col>

            <v-col cols="12">
              <label class="form-label">{{ $t('esgPlatform.standardDescription') }} <v-tooltip top color="00BD73"
                  max-width="350">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon class="icon-with-background" style="color:#0EBF67;font-size: 18px;" v-bind="attrs"
                      v-on="on">
                      mdi-alert-circle
                    </v-icon>
                  </template>
                  <span> {{ $t('esgPlatform.standardDescription') }}</span>
                </v-tooltip> </label>
              <!-- <v-textarea :placeholder="$t('esgPlatform.dashboard.enterHere')" v-model="formData.description" outlined
                dense :rules="[rules.required]"></v-textarea> -->
                <v-card outlined class="mb-5">
                  <quill-editor
                    v-model="formData.description"
                    ref="quillEditor"
                    :options="quillOptions($t('esgPlatform.dashboard.enterHere'))"
                  />
                </v-card>
            </v-col>

            <v-col cols="12">

              <!-- Upload Section -->
              <div class="upload-container mt-4">
                <div class="upload-header d-flex align-center">
                  <span class="font-weight-medium">{{ $t('esgPlatform.seal') }}</span>
                  <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon class="icon-with-background" style="color:#0EBF67;font-size: 18px;" v-bind="attrs"
                        v-on="on">
                        mdi-alert-circle
                      </v-icon>
                    </template>
                    <span> {{ $t('esgPlatform.seal') }}</span>
                  </v-tooltip>
                </div>

                <div class="upload-box d-flex flex-column align-center justify-center" @click="triggerFileInput">
                  <v-img v-if="imageUrl" :src="imageUrl" class="preview-image" contain></v-img>

                  <div v-else class="upload-placeholder">
                    <v-icon size="28" color="green">mdi-upload</v-icon>
                    <span class="upload-text">Upload</span>
                  </div>

                  <input type="file" ref="fileInput" accept="image/*" class="d-none" @change="handleFileUpload" />
                </div>
              </div>

            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="py-6 px-2" style="padding-right: 0">
          <v-spacer></v-spacer>
          <v-btn outlined class="mr-2" right height="44" width="116" depressed color="primary" @click="closeDialog">
            {{ $t('blends.manageProducts.cancel') }}
          </v-btn>

          <v-btn class="mr-2" right height="44" width="116" depressed color="primary" @click="saveProtocol"
            :disabled="isUploading">
            {{ $t('blends.manageProducts.save') }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import ESGService from "@/_services/EsgService";
import loadingMixin from "@/mixins/LoadingMixin";
import FileService from '@/_services/FileService';
import axios from 'axios';

import { quillEditor } from 'vue-quill-editor';

export default {
  async mounted() {
  },
  components: {
    'quill-editor': quillEditor
  },
  props: {
    dialog: {
      type: Boolean,
      required: true
    },
    selectedProtocol: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      imageUrl: null,
      isUploading: false,
      formData: {
        title: '',
        shortCode: '',
        description: '',
        type: "Protocol",
        sealKey: "",
        standardId: this.selectedProtocol?.id,
        requiresMandatoryScoreForGovernanceScore: false,
        requiresMandatoryScoreForSocialScore: false,
        requiresMandatoryScoreForEnvironmentalScore: false,
        approvalMethod: "Manual",
        environmentalScore: 0,
        socialScore: 0,
        governanceScore: 0,
        overallScore: 0,
        isActive: true,
      },
      rules: {
        required: v => !!v || this.$t("blends.manageProducts.fieldRequired"),
      }
    };
  },
  watch: {
    enterpriseData: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.formData = { ...newVal };
        }
      }
    }
  },
  methods: {
    quillOptions(placeholder) {
      return {
        theme: 'snow',
        placeholder,
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ header: [1, 2, 3, false] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ color: [] }, { background: [] }],
            ['clean']
          ]
        }
      }
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.uploadImageToS3(file);
      }
    },

    async uploadImageToS3(file) {
      if (!file) return;

      this.startLoading();
      this.isUploading = true;

      try {
        // Step 1: Get the pre-signed URL
        //const token = localStorage.getItem('token');
        const { data } = await FileService.uploadFile( file, true, 'esg');
        const { url, key } = data;

        // Step 2: Upload the file using the pre-signed URL
        const uploadResponse = await axios.put(url, file, {
          headers: {
            'Content-Type': file.type,
          },
        });

        if (uploadResponse.status === 200) {
          const publicUrl = await FileService.getObjectURL(key, true);

          this.formData.sealKey = key;
          this.imageUrl = publicUrl?.data;
        } else {
          throw new Error(this.$t('esgPlatform.failedToUploadFileToS3'));
        }
      } catch (error) {
        this.$notify({
          type: 'error',
          text: this.$t('esgPlatform.failedToUploadFile'),
        });
      } finally {
        this.stopLoading();
        this.isUploading = false;
      }
    },

    async saveProtocol() {
      if (this.$refs.form.validate()) {
        this.startLoading();
        try {
          const payload = { ...this.formData };
          const data = await ESGService.createEsgStandard(payload);

          if (data && data.success) {
            this.$emit('save');
            this.closeDialog();
          } else {
            const errorMessage = data.message.errors[0]?.msg || 'Failed to save protocol. Please try again.';
            
            this.$notify({
              type: 'error',
              text: errorMessage,
            });
          }
        } catch (error) {
          this.$notify({
            type: 'error',
            text: 'An unexpected error occurred. Please try again.',
          });
          console.error('Error creating protocol:', error);
        }
        finally {
          this.stopLoading();
        }
      }
    },

    closeDialog() {
      this.$emit('close');
    },
  },
  mixins: [loadingMixin],
};
</script>

<style lang="scss" scoped>
/* Upload Section */
.upload-container {
  width: 100%;
}

.upload-header {
  font-size: 16px;
  margin-bottom: 8px;
}

/* Upload Box */
.upload-box {
  width: 180px;
  height: 130px;
  border: 2px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background: #f9f9f9;
}

/* Upload Placeholder */
.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #4caf50;
}

/* Image Preview */
.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
