<template>
  <v-dialog v-model="dialog" max-width="500px" @click:outside="closeDialog">
    <v-card>
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title class="white--text">{{ !productData ? $t('blends.manageProducts.addNewProduct') :
          $t('blends.manageProducts.editProduct') }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-card-text>
          <v-row class="pt-4">
            <v-col cols="12">
              <label class="form-label">{{ $t('blends.manageProducts.productTitle') }}</label>
              <v-text-field :placeholder="$t('blends.manageProducts.typeTitle')" v-model="productTitle" outlined dense
                :rules="[rules.required, rules.noEmptyString]" :disabled="productData?.productType === 'global'"></v-text-field>
            </v-col>

            <v-col cols="12">
              <label class="form-label">{{ $t('blends.manageProducts.hsCode') }}</label>
              <v-text-field :placeholder="$t('blends.manageProducts.typeHSCode')" v-model="hsCode" outlined dense
                :rules="[rules.required, rules.noEmptyString]"></v-text-field>
            </v-col>

            <v-col cols="12">
              <label class="form-label">
                {{ $t('blends.manageProducts.eudrDocumentCode') }}
                <v-tooltip top color="00BD73" max-width="350">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                      mdi-alert-circle
                    </v-icon>
                  </template>
                  <span>{{ $t('blends.manageProducts.selectEudrDocumentCode') }}</span>
                </v-tooltip>
              </label>
              <v-select :placeholder="eudrDocumentCode || $t('blends.manageProducts.makeSelection')"
                v-model="eudrDocumentCode" outlined dense :rules="[rules.required]" @focus="openDocumentCodeDialog"
                readonly></v-select>
            </v-col>

            <v-col cols="12">
              <!-- Progress bar section -->
              <v-row v-if="isUploading" align="center" justify="center">
                <v-col cols="12" class="text-center">
                  <p>{{ $t('activationKey.pleaseWait') }}</p>
                  <v-progress-linear :value="uploadPercentage" height="7" color="primary" />
                  <p>{{ uploadPercentage }}%</p>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12">
              <template>
                <v-row justify="center">
                  <v-col cols="auto" class="text-center">
                    <v-card outlined class="upload-card d-flex align-center justify-center pa-4"
                      style="position: relative;">
                      <div class="text-center">
                        <template v-if="uploadedFileUrl">
                          <img :src="uploadedFileUrl" alt="Uploaded Image"
                            style="width: 200px; height: 160px; object-fit: cover; border-radius: 8px;" />
                          <v-btn icon color="white"
                            style="position: absolute; top: 8px; right: 48px; background-color: #00BD73;"
                            @click="editImage">
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                          <v-btn icon color="white"
                            style="position: absolute; top: 8px; right: 8px; background-color: #f44336;"
                            @click="deleteImage">
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </template>
                        <template v-else>
                          <img src="/img/camera.svg" alt="Camera Logo" />

                          <input type="file" ref="fileInput" accept="image/*" style="display: none"
                            @change="handleFileUpload" />
                          <v-btn class="mx-2" height="44" width="auto" depressed color="primary"
                            @click="triggerFileInput">
                            {{ $t('blends.manageProducts.addImage') }}
                          </v-btn>
                        </template>
                      </div>
                    </v-card>
                    <div class="text-center mt-2" v-if="!uploadedFileUrl">
                      <span>{{ $t('blends.manageProducts.uploadCategoryImage') }}</span>
                    </div>
                  </v-col>
                </v-row>
              </template>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="py-6 px-2" style="padding-right: 0">
          <v-spacer></v-spacer>
          <v-btn outlined class="mr-2" right height="44" width="116" depressed color="primary" @click="closeDialog">
            {{ $t('blends.manageProducts.cancel') }}
          </v-btn>

          <v-btn class="mr-2" right height="44" width="116" depressed color="primary" @click="saveProduct"
            :disabled="isUploading">
            {{ $t('blends.manageProducts.save') }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
    <DocumentCodeSelection v-if="showDocumentCodeDialog" :dialog="showDocumentCodeDialog"
      :selectedEudrCode="eudrDocumentCode" @close="showDocumentCodeDialog = false" @selectCode="setEudrDocumentCode" />
  </v-dialog>
</template>

<script>
import DocumentCodeSelection from './DocumentCodeSelection.vue';
import S3UploadService from '../../../../../../_services/S3UploadService';

export default {
  components: {
    DocumentCodeSelection
  },
  props: {
    dialog: {
      type: Boolean,
      required: true
    },
    productData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      valid: false,
      productTitle: '',
      hsCode: '',
      eudrDocumentCode: null,
      showDocumentCodeDialog: false,
      uploadedFileUrl: null,
      uploadPercentage: 0,
      isUploading: false,
      rules: {
        required: v => !!v || this.$t("blends.manageProducts.fieldRequired"),
        noEmptyString: v => v && v.trim() !== '' || this.$t('blends.manageProducts.fieldRequired'),
      }
    };
  },
  watch: {
    productData: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.productTitle = newVal.name || '';
          this.hsCode = newVal.hsCode || '';
          this.eudrDocumentCode = newVal.eudrDocumentCode || '';
          this.uploadedFileUrl = newVal.s3Key || '';
        }
      }
    }
  },
  methods: {
    openDocumentCodeDialog() {
      this.showDocumentCodeDialog = true;
    },
    closeDocumentCodeDialog() {
      this.documentCodeDialog = false;
    },
    setEudrDocumentCode(selectedCode) {
      this.eudrDocumentCode = selectedCode;
      this.showDocumentCodeDialog = false;
      this.closeDocumentCodeDialog();
    },
    closeDialog() {
      this.$emit('close');
    },
    editImage() {
      this.uploadedFileUrl = null;
    },
    deleteImage() {
      this.uploadedFileUrl = null;
    },
    saveProduct() {
      if (this.$refs.form.validate()) {
        if (!this.uploadedFileUrl) {
          return this.$notify({
            title: this.$t("blends.manageProducts.fileRequired"),
            text: this.$t("blends.manageProducts.fileRequiredMessage"),
            type: "error",
          });
        }

        let productData = {
          name: this.productTitle,
          hsCode: this.hsCode,
          eudrDocumentCode: this.eudrDocumentCode,
          s3Key: this.uploadedFileUrl
        }

        this.$emit('save', !this.productData ? productData : { ...productData, id: this.productData.id });
      }
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    async handleFileUpload(event) {
      const file = event.target.files[0];
      const folder = "manage_product_files";
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      try {
        if (file) {
          if (!allowedTypes.includes(file.type)) {
            this.$notify({
              title: this.$t("blends.manageProducts.fileUploadFailed"),
              text: this.$t("blends.manageProducts.unsupportedFileFormat"),
              type: "error",
            });
            return;
          }
          this.isUploading = true;
          await S3UploadService.imageUpload(file, folder, (progress) => {
            this.uploadPercentage = progress;
          }).then((result) => {
            this.uploadedFileUrl = result.fullPath;
            return result;
          });
        }
      } catch (err) {
        this.$notify({
          title: this.$t("blends.manageProducts.fileUploadFailed"),
          text: this.$t("blends.manageProducts.errorUploadingFile"),
          type: "error",
        });
      } finally {
        this.isUploading = false;
      }
    },
  }
};
</script>

<style scoped>
.v-card {
  border-radius: 8px;
}

.v-btn {
  font-weight: bold;
}

.upload-card {
  width: 200px;
  height: 150px;
  border: 1px dashed #cccccc;
  border-radius: 8px;
  text-align: center;
}

.upload-input .v-input__control {
  text-align: center;
}
</style>
