<template>
  <v-dialog v-model="internalDialog" max-width="700px" persistent>
    <v-card>
      <v-toolbar color="primary" dark flat class="sticky-toolbar">
        <v-toolbar-title>{{ isEdit ? $t('approvalFlow.cooperative.edit') : $t('approvalFlow.cooperative.add') }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="handleClose">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-container fluid>
          <v-row>
            <v-col cols="12" md="6">
              <label class="field-label">{{ $t('approvalFlow.cooperative.cooperativeName') }}
                <v-tooltip top color="00BD73" max-width="350">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon size="16" class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                      v-on="on">
                      mdi-alert-circle
                    </v-icon>
                  </template>
                  <span>{{ $t('approvalFlow.cooperative.cooperativeNameTT') }}</span>
                </v-tooltip>
              </label>
              <v-text-field outlined dense :placeholder="$t('approvalFlow.cooperative.enterHere')" v-model="form.name" :rules="[rules.required]" />
            </v-col>
            <v-col cols="12" md="6">
              <label class="field-label">{{ $t('approvalFlow.cooperative.membershipPlan') }} <v-tooltip top color="00BD73" max-width="350">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon size="16" class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                      v-on="on">
                      mdi-alert-circle
                    </v-icon>
                  </template>
                  <span>{{ $t('approvalFlow.cooperative.membershipPlanTT') }}</span>
                </v-tooltip>
              </label>
              <v-text-field outlined dense v-model="DefaultPlan" class="disabled-input" readonly style="pointer-events: none;" />
            </v-col>
          </v-row>

          <div class="section-title">{{ $t('approvalFlow.cooperative.primaryContact') }}</div>
          <v-row>
            <v-col cols="12" md="6">
              <label class="field-label">{{ $t('approvalFlow.cooperative.firstName') }}</label>
              <v-text-field outlined dense :placeholder="$t('approvalFlow.cooperative.enterHere')" v-model="form.firstName"
                :rules="[rules.required]" />
            </v-col>
            <v-col cols="12" md="6">
              <label class="field-label">{{ $t('approvalFlow.cooperative.lastName') }}</label>
              <v-text-field outlined dense :placeholder="$t('approvalFlow.cooperative.enterHere')" style="" v-model="form.lastName" />
            </v-col>
            <v-col cols="12" md="6">
              <label class="field-label">{{ $t('approvalFlow.cooperative.phoneNumber') }}</label>
              <v-text-field outlined dense :placeholder="$t('approvalFlow.cooperative.enterHere')" v-model="form.phone" />
            </v-col>
            <v-col cols="12" md="6">
              <label class="field-label">{{ $t('approvalFlow.cooperative.email') }}</label>
              <v-text-field outlined dense :placeholder="$t('approvalFlow.cooperative.enterHere')" v-model="form.email"
                :rules="[rules.email]" />
            </v-col>
          </v-row>

          <div class="section-title">{{ $t('approvalFlow.cooperative.location') }}</div>
          <v-row>
            <v-col cols="12" md="6">
              <label class="field-label">{{ $t('approvalFlow.cooperative.country') }} <v-tooltip top color="00BD73" max-width="350">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon size="16" class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                      v-on="on">
                      mdi-alert-circle
                    </v-icon>
                  </template>
                  <span>{{ $t('approvalFlow.cooperative.countryTT') }}</span>
                </v-tooltip></label>
              <v-autocomplete outlined dense :items="countries" item-text="name" item-value="name"
                v-model="form.country" :placeholder="$t('approvalFlow.cooperative.select')" />
            </v-col>
            <v-col cols="12" md="6">
              <label class="field-label">{{ $t('approvalFlow.cooperative.provinceState') }} <v-tooltip top color="00BD73" max-width="350">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon size="16" class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                      v-on="on">
                      mdi-alert-circle
                    </v-icon>
                  </template>
                  <span>{{ $t('approvalFlow.cooperative.provinceStateTT') }}</span>
                </v-tooltip></label>
              <v-text-field outlined dense :placeholder="$t('approvalFlow.cooperative.enterHere')" v-model="form.state" />
            </v-col>
            <v-col cols="12" md="6">
              <label class="field-label">{{ $t('approvalFlow.cooperative.regionDistrict') }}</label>
              <v-text-field outlined dense :placeholder="$t('approvalFlow.cooperative.enterHere')" v-model="form.district" />
            </v-col>
            <v-col cols="12" md="6">
              <label class="field-label">{{ $t('approvalFlow.cooperative.villageTownCity') }}</label>
              <v-text-field outlined dense :placeholder="$t('approvalFlow.cooperative.enterHere')" v-model="form.city" />
            </v-col>
            <v-col cols="12">
              <label class="field-label">{{ $t('approvalFlow.cooperative.address') }}</label>
              <v-textarea outlined dense :placeholder="$t('approvalFlow.cooperative.enterHere')" v-model="form.address" rows="2" />
            </v-col>
          </v-row>

          <div class="section-title">{{ $t('approvalFlow.cooperative.businessInformation') }}</div>
          <v-row>
            <v-col cols="12" md="6">
              <label class="field-label">{{ $t('approvalFlow.cooperative.interestedCommodities') }}
                <v-tooltip top color="00BD73" max-width="350">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon size="16" class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                      v-on="on">
                      mdi-alert-circle
                    </v-icon>
                  </template>
                  <span>{{ $t('approvalFlow.cooperative.interestedCommoditiesTT') }}</span>
                </v-tooltip>
              </label>
              <div class="checkbox-group">
                <v-checkbox v-model="form.products.coffee" :label="$t('approvalFlow.cooperative.coffee')" color="primary" hide-details></v-checkbox>
                <v-checkbox v-model="form.products.cacao" :label="$t('approvalFlow.cooperative.cacao')" color="primary" hide-details></v-checkbox>
              </div>
            </v-col>
            <!--  here  -->
            <v-col cols="12" md="6">
              <label class="field-label">{{ $t('approvalFlow.cooperative.landRegistered') }}</label>
              <v-text-field outlined dense :placeholder="$t('approvalFlow.cooperative.enterHere')" v-model="form.landHectares" type="number" />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <label class="field-label">{{ $t('approvalFlow.cooperative.userType') }}
                <v-tooltip top color="00BD73" max-width="350">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon size="16" class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                      v-on="on">
                      mdi-alert-circle
                    </v-icon>
                  </template>
                  <span>{{ $t('approvalFlow.cooperative.userTypeTT') }}</span>
                </v-tooltip>
              </label>
              <v-radio-group v-model="form.userType" hide-details>
                <v-radio :label="$t('approvalFlow.cooperative.exporter')" value="exporter" color="primary"></v-radio>
                <v-radio :label="$t('approvalFlow.cooperative.cooperative')" value="cooperative" color="primary"></v-radio>
                <v-radio :label="$t('approvalFlow.cooperative.bothOfThem')" value="both" color="primary"></v-radio>
              </v-radio-group>
            </v-col>
            <v-col cols="12" md="6">
              <label class="field-label">
                {{ $t('approvalFlow.cooperative.uploadLogo') }}
                <v-tooltip top max-width="350">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon size="16" class="text--primary" style="color:#0EBF67" v-bind="attrs" v-on="on">
                      mdi-alert-circle
                    </v-icon>
                  </template>
                  <span>{{ $t('approvalFlow.cooperative.logoTT') }}</span>
                </v-tooltip>
              </label>

              <!-- Hidden v-file-input (real input) -->
              <v-file-input ref="logoInput" v-model="form.logo" accept="image/*" style="display:none"
                @change="onPicked" />

              <!-- Visual drop zone -->
              <v-sheet class="upload-dropzone" elevation="0" @dragover.prevent @drop.prevent="handleDrop" rounded>
                <div v-if="form.logoPreview" class="logo-preview">
                  <v-img :src="form.logoPreview" max-height="120" max-width="120" contain></v-img>
                  <v-btn small color="error" icon @click="removeLogo" class="remove-btn">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </div>
                <div v-else class="d-flex flex-column align-center justify-center">
                  <v-icon class="upload-icon" size="64" color="#9AA3AF">mdi-camera-outline</v-icon>
                  <v-btn class="upload-btn " color="primary" large rounded @click="openPicker">
                    {{ $t('approvalFlow.cooperative.uploadLogoButton') }}
                  </v-btn>
                </div>
              </v-sheet>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="handleClose">{{ $t('approvalFlow.cooperative.cancel') }}</v-btn>
        <v-btn color="primary" @click="handleSave">{{ isEdit ? $t('approvalFlow.cooperative.update') : $t('approvalFlow.cooperative.save') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { getCountries } from "country-state-picker";
import S3UploadService from '@/_services/S3UploadService';
import loadingMixin from '@/mixins/LoadingMixin';

export default {
  name: 'AddCooprateDialog',
  props: {
    dialog: { type: Boolean, default: false },
    item: { type: Object, default: null },
  },
  data() {
    return {
      internalDialog: false,
      form: this.getInitialForm(this.item),
      DefaultPlan: 'Advanced',
      countries: [{ name: "All Countries" }, ...getCountries()],
      rules: {
        required: v => (!!v || v === 0) || this.$t('approvalFlow.cooperative.required'),
        email: v => (!v || /.+@.+\..+/.test(v)) || this.$t('approvalFlow.cooperative.invalidEmail'),
      },
    };
  },
  computed: {
    isEdit() {
      return !!(this.item && this.item.id);
    },
    fileName() {
      return this.form.logo ? this.form.logo.name : '';
    },
  },
  watch: {
    dialog: {
      immediate: true,
      handler(v) {
        this.internalDialog = v;
        if (v) {
          this.form = this.getInitialForm(this.item);
        }
      },
    },
    item(v) {
      this.form = this.getInitialForm(v);
    },
    internalDialog(v) {
      if (!v) this.$emit('close');
    },
  },
  methods: {
    getInitialForm(item) {
      if (!item) {
        return {
          id: null,
          name: '',
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
            country: 'All Countries',
            state: '',
            district: '',
            city: '',
            address: '',
          products: {
            coffee: false,
            cacao: false,
          },
          userType: 'exporter',
          landHectares: '',
          logo: null,
          logoPreview: null,
          logoUrl: null,
        };
      }
      // Map from parent item to form - Fixed mapping based on actual API response structure
      return {
        id: item.id,
        name: item.subOrg || item.buisnessName || item.fullName || '',
        firstName: item.firstName || '',
        lastName: item.lastName || '',
        phone: item.mobile || '',
        email: item.email || '',
        country: item.country || 'All Countries',
        state: item.stateId || '',
        district: item.district || '',
        city: item.city || item.village || '',
        address: item.address || '',
        products: {
          coffee: item.products?.includes('Coffee') || false,
          cacao: item.products?.includes('Cacao') || false,
        },
        userType: this.mapAPIUserTypeToForm(item.registrationUserType) || 'exporter',
        landHectares: item.NoOfFarmsPlanningtoonboard || '',
        logo: null,
        logoPreview: item.subOrgLogo || item.org?.logo || null,
        logoUrl: item.subOrgLogo || item.org?.logo || null,
      };
    },
    handleClose() {
      this.internalDialog = false;
    },
    async handleSave() {
      // Validation
      if (!this.form.name) {
        this.$notify({
          text: this.$t('approvalFlow.cooperative.cooperativeNameRequired'),
          type: 'error'
        });
        return;
      }
      
      if (!this.form.firstName) {
        this.$notify({
          text: this.$t('approvalFlow.cooperative.firstNameRequired'),
          type: 'error'
        });
        return;
      }
      
      if (!this.form.email) {
        this.$notify({
          text: this.$t('approvalFlow.cooperative.emailRequired'),
          type: 'error'
        });
        return;
      }

      try {
        // Map form data to API payload format
        const payload = {
          id: this.form.id, // Include ID for updates
          firstName: this.form.firstName,
          lastName: this.form.lastName,
          phoneNumber: this.form.phone,
          email: this.form.email,
          countryId: this.form.country,
          stateId: this.form.state,
          city: this.form.city,
          district: this.form.district,
          village: this.form.city, 
          address: this.form.address,
          organizationName: this.form.name,
          organizationLogo: this.form.logoUrl,
          products: this.getSelectedProducts(),
          NoOfFarmsPlanningtoonboard: parseInt(this.form.landHectares) || 0,
          organizationType: this.mapUserTypeToAPI(this.form.userType)
        };

        this.$emit('save', payload);
      } catch (error) {
        console.error('Error preparing payload:', error);
        this.$notify({
          text: this.$t('approvalFlow.cooperative.errorPreparingData'),
          type: 'error'
        });
      }
    },
    openPicker() {
      this.$refs.logoInput.$refs.input.click();
    },
    onPicked(file) {
      if (file) {
        this.handleLogoUpload(file);
      }
    },
    handleDrop(event) {
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        this.handleLogoUpload(files[0]);
      }
    },
    getSelectedProducts() {
      const products = [];
      if (this.form.products.coffee) products.push('Coffee');
      if (this.form.products.cacao) products.push('Cacao');
      return products;
    },
    mapUserTypeToAPI(userType) {
      const mapping = {
        'exporter': 'ekspor',
        'cooperative': 'koperasi',
        'both': 'keduanya'
      };
      return mapping[userType] || 'koperasi';
    },
    mapAPIUserTypeToForm(registrationUserType) {
      if (registrationUserType === 'keduanya') {
        return 'both';
      } else if (registrationUserType === 'koperasi') {
        return 'cooperative';
      } else if (registrationUserType === 'ekspor') {
        return 'exporter';
      } else {
        return 'exporter';
      }
    },
    async handleLogoUpload(file) {
      if (file) {
        this.startLoading();
        if (!file.type.startsWith('image/')) {
          this.$notify({
            title: this.$t("blends.manageProducts.fileUploadFailed"),
            text: this.$t('approvalFlow.cooperative.pleaseUploadValidImage'),
            type: "error",
          });
          this.form.logo = null;
          return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          this.form.logoPreview = e.target.result;
        };
        reader.readAsDataURL(file);

        // Upload to server
        try {
          const folder = "assessment_reports";
          const result = await S3UploadService.imageUpload(file, folder);
          console.log({ result })
          this.form.logoUrl = result.fullPath;
        } catch (error) {
          console.error('Error uploading logo:', error);
          this.$notify({
            title: this.$t("blends.manageProducts.fileUploadFailed"),
            text: this.$t("blends.manageProducts.errorUploadingFile"),
            type: "error",
          });
          this.form.logo = null;
          this.form.logoPreview = null;
        } finally {
          this.stopLoading();
        }
      }
    },
    removeLogo() {
      this.form.logo = null;
      this.form.logoPreview = null;
      this.form.logoUrl = null;
    },
  },
  mixins: [loadingMixin],
};
</script>

<style scoped>
.field-label {
  display: block;
  font-weight: 600;
  margin-bottom: 6px;
}

.section-title {
  font-weight: 700;
  margin-top: 8px;
  margin-bottom: 8px;
}

.checkbox-group {
  margin-top: 8px;
}

.checkbox-group .v-checkbox {
  margin-bottom: 4px;
}

/* Dashed container like the screenshot */
.upload-dropzone {
  min-height: 180px;
  border: 2px dashed #C7CBD1; /* light grey dashed */
  border-radius: 4px;
  display: grid;
  place-items: center;
  padding: 28px 16px;
  background: #fff;
}

/* Subtle glow behind center content (like the faint white halo) */
.upload-dropzone::before {
  content: "";
  position: absolute;
  width: 220px;
  height: 120px;
  border-radius: 999px;
  filter: blur(28px);
  background: rgba(0, 0, 0, 0.03);
  z-index: 0;
}

.upload-icon {
  z-index: 1;
  margin-bottom: 10px;
}

/* Exact blue “UPLOAD LOGO” button look */
.upload-btn {
  z-index: 1;
  font-weight: 700;
  letter-spacing: 0.3px;
  padding: 10px 22px;
  color: white !important;
  box-shadow: none;
}

/* Info icon circular subtle bg */
.icon-with-background {
  width: 20px;
  height: 20px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(14, 191, 103, 0.12);
}

.file-name {
  margin-top: 8px;
  font-size: 12px;
  color: #6B7280;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.logo-preview {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.remove-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  z-index: 1;
}

::v-deep .disabled-input .v-input__control .v-input__slot {
  background-color: #f0f0f0;
}

.sticky-toolbar {
  position: sticky;
  top: 0;
  z-index: 1000;
}

</style>