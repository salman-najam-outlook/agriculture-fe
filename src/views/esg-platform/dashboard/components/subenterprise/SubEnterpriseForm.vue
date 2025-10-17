<template>
  <v-dialog v-model="dialog" max-width="700px" @click:outside="closeDialog">
    <v-card>
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title class="white--text">
          {{ isEditMode ? this.enterpriseData.name : $t('esgPlatform.dashboard.registerSubEnterprise')
          }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-card-text>
          <v-row class="pt-4">
            <v-col cols="6">
              <label class="form-label">{{ $t('esgPlatform.dashboard.enterpriseName') }}</label>
              <v-text-field :placeholder="$t('esgPlatform.dashboard.enterpriseNamePlaceholder')" v-model="formData.name" outlined dense
                :rules="[rules.required]"></v-text-field>
            </v-col>

            <v-col cols="6">
              <label class="form-label">{{ $t('esgPlatform.dashboard.enterpriseEmail') }}</label>
              <v-text-field :placeholder="$t('esgPlatform.dashboard.enterpriseEmailPlaceholder')" v-model="formData.email" outlined dense
                :rules="[rules.required, rules.email]"></v-text-field>
            </v-col>

            <v-col cols="6">
              <label class="form-label">{{ $t('esgPlatform.dashboard.enterprisePhoneNumber') }}</label>
              <v-text-field :placeholder="$t('esgPlatform.dashboard.enterprisePhoneNumberPlaceholder')" v-model="formData.mobile" outlined
                dense></v-text-field>
            </v-col>

            <v-col cols="6">
              <label class="form-label">{{ $t('esgPlatform.dashboard.country') }}</label>
              <v-autocomplete :items="countries" :placeholder="$t('esgPlatform.dashboard.countryPlaceholder')"
                v-model="selectedCountry" outlined dense return-object item-text="name" item-value="code"
                @change="handleCountryChange"></v-autocomplete>
            </v-col>

            <v-col cols="6">
              <label class="form-label">{{ $t('esgPlatform.dashboard.province') }}</label>
              <v-text-field :placeholder="$t('esgPlatform.dashboard.provincePlaceholder')" v-model="formData.state" outlined
                dense></v-text-field>
            </v-col>

            <v-col cols="6">
              <label class="form-label">{{ $t('esgPlatform.dashboard.region') }}</label>
              <v-text-field :placeholder="$t('esgPlatform.dashboard.regionPlaceholder')" v-model="formData.region" outlined
                dense></v-text-field>
            </v-col>

            <v-col cols="6">
              <label class="form-label">{{ $t('esgPlatform.dashboard.village') }}</label>
              <v-text-field :placeholder="$t('esgPlatform.dashboard.villagePlaceholder')" v-model="formData.village" outlined
                dense></v-text-field>
            </v-col>

            <v-col cols="6">
              <label class="form-label">{{ $t('esgPlatform.dashboard.address') }}</label>
              <v-text-field :placeholder="$t('esgPlatform.dashboard.addressPlaceholder')" v-model="formData.address" outlined
                dense></v-text-field>
            </v-col>

            <v-col cols="6">
              <label class="form-label">{{ $t('esgPlatform.dashboard.licenseID') }}</label>
              <v-text-field :placeholder="$t('esgPlatform.dashboard.licenseIDPlaceholder')" v-model="formData.licenseId" outlined
                dense></v-text-field>
            </v-col>
<!-- 
            <v-col cols="6">
              <label class="form-label">{{ $t('esgPlatform.dashboard.membershipPlan') }}</label>
              <v-text-field :placeholder="$t('esgPlatform.dashboard.membershipPlanPlaceholder')" outlined dense></v-text-field>
            </v-col> -->

            <v-col cols="6">
              <label class="form-label">{{ $t('esgPlatform.dashboard.dateOfRegistration') }}</label>
              <v-menu ref="registrationDateMenu" v-model="registrationDateMenu" :close-on-content-click="false"
                transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="formData.registrationDate" :placeholder="$t('esgPlatform.dashboard.dateOfRegistrationPlaceholder')"
                    readonly outlined dense v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="formData.registrationDate" no-title
                  @input="registrationDateMenu = false"></v-date-picker>
              </v-menu>
            </v-col>

            <v-col cols="6">
              <label class="form-label">{{ $t('esgPlatform.dashboard.subscriptionUpTo') }}</label>
              <v-menu ref="subscriptionDateMenu" v-model="subscriptionDateMenu" :close-on-content-click="false"
                transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="formData.subscriptionEndDate"
                    :placeholder="$t('esgPlatform.dashboard.subscriptionUpToPlaceholder')" readonly outlined dense v-bind="attrs"
                    v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="formData.subscriptionEndDate" no-title
                  @input="subscriptionDateMenu = false"></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="6">
              <label class="form-label">{{ $t('esgPlatform.dashboard.uploadLogo') }}</label>
              <v-file-input :rules="[rules.required]" v-model="formData.logo"
                :placeholder="$t('esgPlatform.dashboard.uploadLogoPlaceholder')" outlined dense accept="image/*"
                prepend-icon="mdi-camera" @change="handleLogoUpload" :show-size="true" :clearable="true"
                @click:clear="removeLogo">
                <template v-slot:selection="{ text }">
                  <v-chip v-if="formData.logoPreview" small>
                    <v-avatar left>
                      <v-img :src="formData.logoPreview"></v-img>
                    </v-avatar>
                    {{ text }}
                  </v-chip>
                </template>
              </v-file-input>
            </v-col>
            <v-col cols="6">
              <label class="form-label">{{ $t('esgPlatform.dashboard.status') }}</label>
              <v-autocomplete :items="statusOptions" item-text="label" item-value="value"
                :placeholder="$t('esgPlatform.dashboard.statusPlaceholder')" v-model="formData.status" outlined
                dense></v-autocomplete>
            </v-col>

            <v-col cols="6">
              <label class="form-label">{{ $t('esgPlatform.dashboard.linkWithProducts') }}</label>
              <v-autocomplete :items="products" item-text="name" item-value="id" multiple
                :placeholder="$t('esgPlatform.dashboard.linkWithProductsPlaceholder')" v-model="formData.linkedProducts" outlined dense
                :loading="isLoadingProducts" @update:search-input="fetchProducts"></v-autocomplete>
            </v-col>

            <v-col cols="12">
              <label class="form-label">{{ $t('esgPlatform.dashboard.attachInitialAssessmentReport') }}</label>
              <div class="additional-logos-form mb-4">
                <div style="overflow: clip" :class="['dropZone', dragging ? 'dropZone-over' : '']"
                  @dragenter="dragging = true" @dragleave="dragging = false" @dragover.prevent @drop="handleDrop">
                  <div class="dropZone-info">
                    <v-icon size="40" color="info">mdi-cloud-upload</v-icon>
                    <span class="fa fa-cloud-upload dropZone-title"></span>
                    <div class="d-flex-start">
                      <div class="info--text">{{ $t("dueDiligence.selectFileToUploadData") }}</div>
                    </div>
                    <div class="dropZone-upload-limit-info">
                      <div>{{ $t("oma.OrDragDrop") }}</div>
                      <div class="text-caption">(PDF only)</div>
                    </div>
                  </div>
                  <input type="file" accept="application/pdf" @change="handleFileUpload" />
                </div>
                <!-- Progress bar section -->
                <v-row v-if="isUploading" align="center" justify="center">
                  <v-col cols="12" class="text-center">
                    <p>{{ $t('activationKey.pleaseWait') }}</p>
                    <v-progress-linear :value="uploadPercentage" height="7" color="primary" />
                    <p>{{ uploadPercentage }}%</p>
                  </v-col>
                </v-row>
                <span class="red--text" v-if="fileError">{{ fileError }}</span>
                <div v-if="formData.assessmentUrl" class="mt-2">
                  <v-chip close @click:close="removeFile">
                    <v-icon left>mdi-file-pdf-box</v-icon>
                    <a :href="formData.assessmentUrl" target="_blank" class="text-decoration-none">{{ uploadedFileName
                      }}</a>
                  </v-chip>
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

          <v-btn class="mr-2" right height="44" width="116" depressed color="primary" @click="saveSubEnterprise"
            :disabled="isUploading">
            {{ $t('blends.manageProducts.save') }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import S3UploadService from '@/_services/S3UploadService';
import ESGService from "@/_services/EsgService";
import loadingMixin from "@/mixins/LoadingMixin";

export default {
  async mounted() {
    this.startLoading();
    await this.getCountries();
    await this.fetchProducts();

    if (this.enterpriseData) {
      this.selectedCountry = this.countries.find((item) => item.name === this.enterpriseData.country);
      const primaryUser = this.enterpriseData.primaryUser || {};
      this.formData = {
        name: this.enterpriseData.name,
        email: primaryUser.email || '',
        mobile: primaryUser.mobile || '',
        countryId: this.enterpriseData.country,
        countryCode: '',
        country: this.enterpriseData.country,
        state: primaryUser.stateId || '',
        region: primaryUser.district || '',
        village: primaryUser.village || '',
        address: primaryUser.address || '',
        logo: this.enterpriseData.logo,
        logoPreview: this.enterpriseData.logo,
        logoUrl: this.enterpriseData.logo,
        status: this.enterpriseData.status,
        licenseId: this.enterpriseData.licenseId,
        registrationDate: this.enterpriseData.registrationDate
          ? this.enterpriseData.registrationDate.substr(0, 10)
          : new Date().toISOString().substr(0, 10),
        subscriptionEndDate: this.enterpriseData.subscriptionEndDate
          ? this.enterpriseData.subscriptionEndDate.substr(0, 10)
          : '',
        linkedProducts: this.enterpriseData.products.map((product) => product.id),
        assessmentUrl: this.enterpriseData.accessmentReportUrl,
      };
    } else {
      this.formData = {
        name: '',
        email: '',
        mobile: '',
        countryId: '',
        countryCode: '',
        country: '',
        state: '',
        region: '',
        village: '',
        address: '',
        logo: null,
        logoPreview: null,
        logoUrl: null,
        status: 'active',
        licenseId: '',
        registrationDate: new Date().toISOString().substr(0, 10),
        subscriptionEndDate: '',
        linkedProducts: [],
        assessmentUrl: null,
      };
    }

    this.stopLoading();
  },
  components: {
  },
  props: {
    dialog: {
      type: Boolean,
      required: true
    },
    enterpriseData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      registrationDateMenu: false,
      subscriptionDateMenu: false,
      statusOptions: [
        // { label: 'In Progress', value: 'inProgress' },
        { label: 'Active', value: 'active' },
        { label: 'Deactivated', value: 'deactivated' }
      ],
      products: [],
      isLoadingProducts: false,
      formData: {
        name: '',
        email: '',
        mobile: '',
        countryId: '',
        countryCode: '',
        country: '',
        state: '',
        region: '',
        village: '',
        address: '',
        logo: null,
        logoPreview: null,
        logoUrl: null,
        status: 'active',
        licenseId: '',
        registrationDate: new Date().toISOString().substr(0, 10),
        subscriptionEndDate: '',
        linkedProducts: [],
        assessmentUrl: null,
      },
      countries: [],
      selectedCountry: null,
      valid: false,
      isSubmitting: false,
      uploadedFileName: 'Attachment 1',
      fileError: '',
      isUploading: false,
      uploadPercentage: 0,
      dragging: false,
      rules: {
        required: v => !!v || this.$t("blends.manageProducts.fieldRequired"),
        email: v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      }
    };
  },
  watch: {
    enterpriseData: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.formData = { ...newVal };
          if (newVal.logo) {
            this.formData.logoPreview = newVal.logo;
          }
        }
      }
    }
  },
  computed: {
    isEditMode() {
      return !!this.enterpriseData;
    }
  },
  methods: {
    async getCountries() {
      await ESGService.loadCountries()
        .then((res) => {
          this.countries = res.data;
        })
        .catch((err) => {
          console.error("Error fetching countries:", err);
        });
    },
    async fetchProducts() {
      this.isLoadingProducts = true;
      try {
        const response = await ESGService.getProducts({
          paginate: false
        });
        this.products = response.data?.rows;
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        this.isLoadingProducts = false;
      }
    },
    closeDialog() {
      this.$emit('close');
    },
    handleDrop(event) {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file) {
        this.validateAndUpload(file);
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.validateAndUpload(file);
      }
    },
    validateAndUpload(file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        this.fileError = 'Only PDF files are allowed';
        return;
      }

      this.fileError = '';

      this.uploadFile(file);
    },
    async uploadFile(file) {
      const folder = "assessment_reports";
      try {
        this.isUploading = true;
        const result = await S3UploadService.imageUpload(file, folder, (progress) => {
          this.uploadPercentage = progress;
        });
        this.formData.assessmentUrl = result.fullPath;
        this.uploadedFileName = file.name;
      } catch (error) {
        console.error('Error uploading file:', error);
        this.$notify({
          title: this.$t("blends.manageProducts.fileUploadFailed"),
          text: this.$t("blends.manageProducts.errorUploadingFile"),
          type: "error",
        });
      } finally {
        this.isUploading = false;
      }
    },
    removeFile() {
      this.formData.assessmentUrl = null;
      this.uploadedFileName = '';
    },
    async saveSubEnterprise() {
      if (this.$refs.form.validate()) {
        this.startLoading();
        try {
          const payload = { ...this.formData };
          if (this.isEditMode) {
            payload.id = this.enterpriseData.id;
          }
          const response = await await ESGService.saveSubEnterprise(payload);
          this.$emit('save', response.data);
          this.closeDialog();
        } catch (error) {
          console.error('Error saving sub-enterprise:', error);
          this.$notify({
            text: error.message || error.data.message || 'Failed to save sub-enterprise',
            type: "error",
          });
        }
        finally {
          this.stopLoading();
        }
      }
    },
    async handleLogoUpload(file) {
      if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          this.$notify({
            title: this.$t("blends.manageProducts.fileUploadFailed"),
            text: 'Please upload a valid image file',
            type: "error",
          });
          this.formData.logoFile = null;
          return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          this.formData.logoPreview = e.target.result;
        };
        reader.readAsDataURL(file);

        // Upload to server
        try {
          const folder = "enterprise_logos";
          const result = await S3UploadService.imageUpload(file, folder);
          console.log({ result })
          this.formData.logoUrl = result.fullPath;
        } catch (error) {
          console.error('Error uploading logo:', error);
          this.$notify({
            title: this.$t("blends.manageProducts.fileUploadFailed"),
            text: this.$t("blends.manageProducts.errorUploadingFile"),
            type: "error",
          });
          this.formData.logo = null;
          this.formData.logoPreview = null;
        }
      }
    },
    removeLogo() {
      this.formData.logo = null;
      this.formData.logoPreview = null;
    },
    handleCountryChange(country) {
      if (country) {
        this.formData.country = country.name;
        this.formData.countryCode = country.code;
        this.formData.countryId = country.name;
      } else {
        this.formData.country = '';
        this.formData.countryCode = '';
        this.formData.countryId = '';
      }
    },
  },
  mixins: [loadingMixin],
};
</script>

<style lang="scss" scoped>
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

.dropZone {
  width: 100%;
  height: 150px;
  border: 2px dashed #97A8B8;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.dropZone-over {
  border-color: var(--v-primary-base);
}

.dropZone-info {
  text-align: center;
}

.v-chip {
  margin-top: 8px;
}

.dropZone-title {
  color: #787878;
}

.dropZone input {
  position: absolute;
  cursor: pointer;
  top: 0px;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.dropZone-upload-limit-info {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  overflow: clip;
}
</style>
