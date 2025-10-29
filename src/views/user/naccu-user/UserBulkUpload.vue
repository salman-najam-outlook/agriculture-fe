<template>
  <v-dialog
    v-model="dialog"
    width="800"
    :retain-focus="false"
    persistent
    @click:outside="closeDialog"
  >
    <v-card class="custom-card" rounded="0">
      <v-toolbar flat color="primary" class="white--text">
        <v-toolbar-title class="font-weight-bold">
          {{ $t('memberDataSection.registerNewAffiliate') }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon class="white--text" @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <!-- Upload Step -->
      <v-card-text v-if="currentStep === 'upload'" class="black--text">
        <v-form ref="form" v-model="valid" lazy-validation autocomplete="off">
          
          <!-- Download Template Section -->
          <div class="template-download-section">
            <v-menu bottom origin="center center" transition="scale-transition">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" v-bind="attrs" v-on="on" dark class="mr-3">
                  <v-icon small class="mr-2">mdi-tray-arrow-down</v-icon>
                  {{ $t("memberDataSection.downloadTemplate") }}
                  <v-icon>mdi-chevron-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <v-list-item-title class="cursor-pointer">
                    <a class="text-decoration-none black--text" download href="/files/affiliates-bulk-registration.csv">
                      {{ $t("memberDataSection.downloadTemplate") }}
                    </a>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <div class="mt-3">
            <span class="red--text">{{ $t("dueDiligence.importantNote") }}</span>:
            {{ $t("memberDataSection.templateInfo") }}
            </div>
          </div>

          <!-- Dropzone -->
          <div
            class="dropzone"
            @dragover.prevent
            @dragenter.prevent
            @drop.prevent="onDrop"
            @click="openFilePicker"
          >
            <div class="dropzone-content">
              <v-icon color="primary" size="64">mdi-upload</v-icon>
              <div class="dropzone-link" @click.stop="openFilePicker">{{ $t("memberDataSection.selectFileToUpload") }}</div>
              <div class="dropzone-sub">{{ $t("memberDataSection.uploadFileOrDragAndDrop") }}</div>
            </div>
            <input ref="fileInput" type="file" class="hidden-input" accept=".csv" @change="onFilePicked" />
          </div>

          <!-- Preview tile -->
          <div v-if="formData.file" class="preview-wrapper">
            <div class="file-tile">
              <div class="file-ext">{{ fileExtension }}</div>
              <v-btn icon x-small class="delete-btn" @click="clearFile">
                <v-icon color="green" size="20">mdi-delete-outline</v-icon>
              </v-btn>
            </div>
            <div class="file-caption">{{ formData.file?.name || 'No file selected' }}</div>
          </div>

          <!-- Important Note -->
          <div class="mt-4">
            <span class="red--text">{{ $t("dueDiligence.importantNote") }}</span>:
            {{ $t("memberDataSection.templateFormat") }}
          </div>
        </v-form>
      </v-card-text>

      <!-- Preview Step -->
      <v-card-text v-if="currentStep === 'preview'" class="black--text pa-0">
        <UserPreviewTable 
          :users="uploadedUsers"
          :loading="previewLoading"
          :submitting="submitting"
          @goBack="goBackToUpload"
          @confirmSubmit="confirmFinalSubmit"
        />
      </v-card-text>

      <!-- Upload Step Actions -->
      <v-card-actions v-if="currentStep === 'upload'" class="actions">
        <v-spacer></v-spacer>
        <v-btn outlined right height="44" width="116" depressed color="primary" @click="closeDialog">{{ $t('cancel') }}</v-btn>
        <v-btn right height="44" width="116" color="primary" class="white--text" @click="submitForm" :disabled="!valid || !formData.file" :loading="loading">{{ $t('submit') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import UserService from '@/_services/UserService';
import UserPreviewTable from './UserPreviewTable.vue';
import store from '../../../store';

export default {
  name: 'UserBulkUpload',
  components: {
    UserPreviewTable
  },
  props: {
    dialog: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    fileExtension() {
      const f = this.formData?.file;
      if (!f?.name) return '';
      const parts = f.name.split('.');
      return parts.length > 1 ? parts.pop().toUpperCase() : '';
    }
  },
  data() {
    return {
      organizationCode: '',
      subOrgUserId: '',
      valid: false,
      loading: false,
      currentStep: 'upload', // 'upload' or 'preview'
      uploadedUsers: [],
      previewLoading: false,
      submitting: false,
      formData: {
        file: null
      },
      fileRules: [
        v => !!v || 'File is required',
        v => {
          if (!v) return true;
          const allowedTypes = [
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          ];
          return allowedTypes.includes(v.type) || 'Please select a valid CSV or Excel file';
        },
        v => {
          if (!v) return true;
          return v.size <= 2 * 1024 * 1024 || 'File size must be less than 2MB';
        }
      ]
    };
  },
  created() {
    this.setUserDataFromLocalStorage();
  },
  watch: {
    dialog(newVal) {
      if (!newVal) {
        this.resetForm();
        this.currentStep = 'upload';
        this.uploadedUsers = [];
      }
    }
  },
  methods: {
    setUserDataFromLocalStorage() {
      try {
        //const userData = JSON.parse(localStorage.getItem('user'));
         let userData = store.getters.getUser;
        if (userData && userData?.subOrg) {
          this.organizationCode = userData?.subOrg?.code;
          this.subOrgUserId = userData?.id.toString();
        }
      } catch (error) {
        console.error('Error getting user data from localStorage:', error);
        // Fallback to default values if needed
        this.organizationCode = '';
        this.subOrgUserId = '';
      }
    },

    closeDialog() {
      this.$emit('close');
    },



    resetForm() {
      this.formData = {
        file: null
      };
      this.valid = false;
      if (this.$refs.form) {
        this.$refs.form.resetValidation();
      }
    },

    openFilePicker() {
      this.$refs.fileInput?.click();
    },

    onDrop(e) {
      const file = e.dataTransfer?.files?.[0];
      if (file) this.validateAndSetFile(file);
    },

    onFilePicked(e) {
      const file = e.target?.files?.[0];
      if (file) this.validateAndSetFile(file);
      e.target.value = null;
    },

    validateAndSetFile(file) {
      // Check file extension
      const fileName = file.name.toLowerCase();
      const extensionStr = fileName.slice(fileName.lastIndexOf('.'));
      
      const allowedExtensions = ['.csv'];
      const allowedTypes = ['text/csv'];
      
      // Validate both extension and MIME type
      if (!allowedExtensions.includes(extensionStr) || !allowedTypes.includes(file.type)) {
        this.$notify({ 
          text: 'Please select a valid CSV file', 
          type: 'error' 
        });
        this.formData.file = null;
        return;
      }
      
      // Additional file size validation (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        this.$notify({ 
          text: 'File size must be less than 10MB', 
          type: 'error' 
        });
        this.formData.file = null;
        return;
      }
      
      this.formData.file = file;
    },

    clearFile() {
      this.formData.file = null;
    },

    async submitForm() {
      if (!this.$refs.form.validate()) {
        return;
      }

      this.loading = true;

      try {
        // Parse the uploaded file to extract user data
        const users = await this.parseUploadedFile(this.formData.file);
        
        if (users && users.length > 0) {
          this.uploadedUsers = users;
          this.currentStep = 'preview';
          this.$notify({
            text: `Successfully parsed ${users.length} records from the file`,
            type: 'success'
          });
        } else {
          this.$notify({
            text: 'No valid data found in the file',
            type: 'error'
          });
        }
      } catch (error) {
        console.error('File parsing error:', error);
        this.$notify({
          text: 'Failed to parse the uploaded file. Please check the file format.',
          type: 'error'
        });
      } finally {
        this.loading = false;
      }
    },

    async confirmFinalSubmit() {
      this.submitting = true;

      try {
        const formData = new FormData();
        
        // Add required fields for bulk upload in the exact order from the API
        formData.append('organizationCode', this.organizationCode);
        formData.append('securityToken', 'dimitra_public_reg_2025_secure_token_123456789');
        formData.append('countryCode', '254');
        formData.append('country', 'Kenya');
        formData.append('subOrgUserId', this.subOrgUserId);

        // Add file for bulk upload
        formData.append('userUploadStage', this.formData.file);

        const response = await UserService.registerSocietyCompanyEstate(formData);

        if (response.success) {
          this.$notify({
            text: 'Bulk upload completed successfully',
            type: 'success'
          });
          this.$emit('bulkUploadCompleted', response);
          this.closeDialog();
        } else {
          this.$notify({
            text: response.message || 'Bulk upload failed',
            type: 'error'
          });
        }
      } catch (error) {
        console.error('Bulk upload error:', error);
        this.$notify({
          text: error.response?.data?.message || 'Bulk upload failed. Please try again.',
          type: 'error'
        });
      } finally {
        this.submitting = false;
      }
    },

    goBackToUpload() {
      this.currentStep = 'upload';
    },

    async parseUploadedFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          try {
            const text = e.target.result;
            const users = this.parseCSVContent(text);
            resolve(users);
          } catch (error) {
            reject(error);
          }
        };
        
        reader.onerror = () => {
          reject(new Error('Failed to read file'));
        };
        
        if (file.type === 'text/csv') {
          reader.readAsText(file);
        } else {
          // For Excel files, we'll need to handle them differently
          // For now, we'll show a simple CSV parsing
          reader.readAsText(file);
        }
      });
    },

    parseCSVContent(csvText) {
      const lines = csvText.split('\n').filter(line => line.trim());
      if (lines.length < 2) {
        throw new Error('File must contain at least a header row and one data row');
      }

      // Auto-detect delimiter
      const firstLine = lines[0];
      let delimiter = '\t'; // Default to tab
      
      if (firstLine.includes('\t')) {
        delimiter = '\t';
      } else if (firstLine.includes(',')) {
        delimiter = ',';
      } else if (firstLine.includes(';')) {
        delimiter = ';';
      }


      const headers = lines[0].split(delimiter).map(h => h.trim().replace(/"/g, ''));
     
      
      const users = [];

      // Map headers to expected fields
      const organizationNameIndex = headers.findIndex(h => 
        h.toLowerCase().includes('organization name') || 
        h.toLowerCase().includes('affiliate name') ||
        h.toLowerCase().includes('name')
      );
      const emailIndex = headers.findIndex(h => h.toLowerCase().includes('email'));
      const organizationNumberIndex = headers.findIndex(h => 
        h.toLowerCase().includes('organization number') || 
        h.toLowerCase().includes('affiliate number') ||
        h.toLowerCase().includes('number')
      );

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(delimiter).map(v => v.trim().replace(/"/g, ''));
        
        if (values.length >= Math.max(organizationNameIndex, emailIndex, organizationNumberIndex) + 1) {
          const user = {
            affiliateName: organizationNameIndex >= 0 ? values[organizationNameIndex] : '',
            primaryEmailAddress: emailIndex >= 0 ? values[emailIndex] : '',
            affiliateNumber: organizationNumberIndex >= 0 ? values[organizationNumberIndex] : ''
          };

          if (user.affiliateName && user.primaryEmailAddress) {
            users.push(user);
          }
        }
      }
      return users;
    }
  }
};
</script>

<style scoped>
.custom-card { background: #FFFFFF !important; box-shadow: 0px 30px 30px rgba(106,119,132,0.41) !important; }
.custom-card .v-card__text { width: 100%; padding: 37px 60px !important; }

.dropzone {
  border: 3px dashed #BDBDBD;
  border-radius: 8px;
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.dropzone-content { text-align: center; }
.dropzone-link { color: #1E66F5; text-decoration: underline; margin-top: 8px; cursor: pointer; }
.dropzone-sub { color: #777; margin-top: 4px; }
.hidden-input { display: none; }

.preview-wrapper { margin-top: 24px; }
.file-tile { width: 50px; height: 60px; background: #EAF6EE; border-radius: 6px; position: relative; display: flex; align-items: center; justify-content: center; }
.file-ext { font-weight: 700; color: #2E7D32; font-size: 12px; }
.delete-btn { position: absolute; top: 0px; right: 0px; }
.file-caption { margin-top: 8px; color: #2E7D32; font-weight: 200; }
.actions { padding: 0 60px 20px 60px !important; }

.template-download-section { 
  margin-bottom: 24px; 
  padding: 4px; 
}
.template-info { 
  color: #666; 
  font-size: 14px; 
  margin-top: 8px; 
}

@media (max-width: 600px) {
  .custom-card .v-card__text { padding: 16px !important; }
}
</style>
