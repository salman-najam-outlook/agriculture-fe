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
        <v-toolbar-title class="font-weight-bold">{{ $t('memberDataSection.registerNewAffiliate') }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon class="white--text" @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="black--text">
        <v-form ref="form" v-model="valid" lazy-validation autocomplete="off">
          <v-row>
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0 field-block">
              <label for="buyingStationName">{{ $t('memberDataSection.affiliateName') }}<span class="red--text">*</span></label>
              <v-text-field 
                v-model="formData.buyingStationName" 
                placeholder="Enter here" 
                outlined 
                dense 
                :rules="buyingStationNameRules" 
                class="custom-field" 
                hide-details="auto"
              />
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0 field-block">
              <label for="email">{{ $t('memberDataSection.primaryEmailAddress') }}<span class="red--text">*</span></label>
              <v-text-field v-model="formData.email" placeholder="Enter here" outlined dense :rules="emailRules" class="custom-field" hide-details="auto" />
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0 field-block">
              <label for="buyingStationNumber">{{ $t('memberDataSection.affiliateNumber') }}</label>
              <v-text-field v-model="formData.buyingStationNumber" placeholder="Enter here" outlined dense class="custom-field" hide-details="auto" />
            </div>
          </v-row>
          <v-card-actions class="mt-10" style="padding: 0 60px 20px 60px !important;">
            <v-spacer></v-spacer>
            <v-btn @click="closeDialog" outlined right height="44" width="116" depressed color="primary">
              {{ $t('cancel') }}
            </v-btn>
            <v-btn @click="submitForm" right height="44" width="116" color="primary" :disabled="!valid">
              {{ $t('submit') }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import UserService from '@/_services/UserService';
import LoadingMixin from '@/mixins/LoadingMixin';
import store from '../../../store';

export default {
  name: 'AddUser',
  mixins: [LoadingMixin],
  props: {
    dialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      valid: false,
      organizationCode: '',
      subOrgUserId: '',
      formData: {
        buyingStationName: '',
      
        email: '',
        buyingStationNumber: ''
      },
      buyingStationNameRules: [
        v => !!v || 'Buying station name is required'
      ],
      emailRules: [
        v => !!v || 'Email is required',
        v => /.+@.+\..+/.test(v) || 'Email must be valid'
      ],
    };
  },
  created() {
    this.setUserDataFromLocalStorage();
  },
  watch: {
    dialog(newVal) {
      if (!newVal) {
        this.resetForm();
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
        buyingStationName: '',
        firstName: '',
        lastName: '',
        email: '',
        buyingStationNumber: ''
      };
      this.valid = false;
      if (this.$refs.form) {
        this.$refs.form.resetValidation();
      }
    },


    async submitForm() {
      if (!this.$refs.form.validate()) {
        return;
      }

      this.startLoading();

      try {
      
        const formData = new FormData();
        formData.append('organizationCode', this.organizationCode);
        formData.append('userData[firstName]', this.formData.buyingStationName);
        formData.append('userData[lastName]', this.formData.lastName || '');
        formData.append('userData[organizationNumber]', this.formData.buyingStationNumber);
        formData.append('userData[email]', this.formData.email);
        formData.append('securityToken', 'dimitra_public_reg_2025_secure_token_123456789');
        formData.append('countryCode', '254');
        formData.append('country', 'Kenya');
        formData.append('subOrgUserId', this.subOrgUserId);

        const response = await UserService.registerSocietyCompanyEstate(formData);
        
        if (response.success) {
          this.$notify({ text: 'Affiliate registered successfully', type: 'success' });
          this.$emit('userAdded', response);
          this.closeDialog();
        } else {
          this.$notify({ text: response.message || 'Registration failed', type: 'error' });
        }
      } catch (error) {
        console.error('Registration error:', error);
        this.$notify({ text: error.response?.data?.message || 'Registration failed. Please try again.', type: 'error' });
      } finally {
        this.stopLoading();
      }
    }
  }
};
</script>

<style scoped>
.custom-card {
  background: #FFFFFF !important;
  box-shadow: 0px 30px 30px rgba(106, 119, 132, 0.41) !important;
}

.custom-card .v-card__text {
  width: 100%;
  padding: 37px 60px !important;
}

.field-block { margin-bottom: 16px; }

.custom-field :deep(.v-input__details) {
  display: none !important;
}

.custom-field :deep(.v-label) {
  font-size: 14px !important;
}

.custom-field :deep(.v-input__control) { min-height: 40px !important; }
.custom-field :deep(.v-input__slot) { min-height: 40px !important; background-color: white !important; }
.custom-field :deep(.v-text-field__slot) { min-height: 40px !important; }
.custom-field :deep(.v-text-field__slot input) { font-size: 14px !important; color: #666 !important; padding: 0 12px !important; height: 100% !important; }
.custom-field.v-text-field--outlined :deep(fieldset) { border-color: #e0e0e0 !important; }

@media (max-width: 600px) {
  .custom-card .v-card__text { padding: 16px !important; }
}
</style>
  