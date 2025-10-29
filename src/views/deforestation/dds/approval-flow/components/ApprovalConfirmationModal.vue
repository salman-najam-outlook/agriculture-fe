<template>
  <v-dialog v-model="dialog" persistent :max-width="$vuetify.breakpoint.mobile ? '95vw' : '800'">
    <v-card>
      <v-toolbar color="primary" elevation="0">
        <v-toolbar-title class="white--text">{{ $t('dueDiligence.confirmation') }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="white" icon @click="closeModal">
          <v-icon style="color:white !important">mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      
      <v-card-text class="pt-5 black--text">
        <div class="mb-4">
          <h3 class="mb-3">{{ $t('dueDiligence.approvalConfirmationMessage') }}</h3>
          
          <div class="mb-4">
            <p class="mb-2 font-weight-medium">{{ $t('dueDiligence.approvalOnceApprovedTitle') }}:</p>
            <ul class="ml-4">
              <li v-if="isKenyaClient">{{ $t('dueDiligence.approvalVerifiedByAgent') }}</li>
              <li v-else>{{ $t('dueDiligence.approvalVerifiedByPtsi') }}</li>
              <li>{{ $t('dueDiligence.approvalVerificationLinks') }}</li>
              <li>{{ $t('dueDiligence.approvalNoFurtherChanges') }}</li>
              <li>{{ $t('dueDiligence.approvalPublishedToBlockchain') }}</li>
            </ul>
          </div>
          
          <v-divider class="my-4"></v-divider>
          
          <div class="mb-4">
            <v-checkbox 
              v-model="isTemporaryApproval" 
              color="primary"
              class="mt-0 pt-0"
            >
              <template v-slot:label>
                <div>
                  <span class="font-weight-medium black--text">{{ $t('dueDiligence.temporaryApprovalLabel') }}</span>
                  <br>
                  <span class="text-caption black--text">{{ $t('dueDiligence.temporaryApprovalDescription') }}</span>
                </div>
              </template>
            </v-checkbox>
          </div>
          
          <div class="mb-4" v-if="isTemporaryApproval">
            <div class="d-flex align-center mb-2">
              <span class="font-weight-medium mr-2">{{ $t('dueDiligence.approvalExpirationPeriod') }}</span>
              <v-tooltip top color="primary" max-width="300">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon size="16" color="primary" v-bind="attrs" v-on="on">
                    mdi-information-outline
                  </v-icon>
                </template>
                <span>{{ $t('dueDiligence.approvalExpirationDays') }}</span>
              </v-tooltip>
            </div>
            
            <v-row no-gutters>
              <v-col cols="4">
                <v-text-field
                  v-model="approvalExpirationValue"
                  type="number"
                  min="1"
                  outlined
                  dense
                  class="mr-2"
                ></v-text-field>
              </v-col>
              <v-col cols="8">
                <v-select
                  v-model="approvalExpirationUnit"
                  :items="expirationUnits"
                  item-text="text"
                  item-value="value"
                  outlined
                  dense
                ></v-select>
              </v-col>
            </v-row>
          </div>
        </div>
      </v-card-text>
      
      <v-card-actions class="px-6 pb-4">
        <v-spacer></v-spacer>
        <v-btn outlined color="primary" @click="closeModal">
          {{ $t('cancel') }}
        </v-btn>
        <v-btn 
          depressed 
          color="primary" 
          @click="confirmApproval"
        >
          {{ $t('dueDiligence.approvalApproveButton') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import DeforestationService from '@/_services/DeforestationService';
import LoadingMixin from '@/mixins/LoadingMixin';
import { ROLES } from '../../../../../constants/roles';
export default {
  name: 'ApprovalConfirmationModal',
  mixins: [LoadingMixin],
  props: {
    dialog: {
      type: Boolean,
      required: true
    },
    selectedReportsCount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isTemporaryApproval: false,
      approvalExpirationValue: 0,
      approvalExpirationUnit: 'days',
      expirationUnits: [
        { text: this.$t('dueDiligence.approvalExpirationDays'), value: 'days' },
        { text: this.$t('dueDiligence.approvalExpirationWeeks'), value: 'weeks' },
        { text: this.$t('dueDiligence.approvalExpirationMonths'), value: 'months' }
      ],
      settings: null
    }
  },
  computed: {
    getOrganizationId() {
      return this.$store.getters.getUser?.user_organization?.id;
    },

    isKenyaClient(){
      const user = JSON.parse(localStorage.getItem('user'));
      if(!user) return false;
      const isKenyaClient = user.user_role_assoc.some(role => role.id === ROLES.kenya_ptsi.value || role.id === ROLES.kenya_ptsi_worker.value);
      console.log("isKenyaClient:", isKenyaClient, user);
      return isKenyaClient;
    },
  },
  methods: {
  
    async fetchSettings() {
      this.startLoading();
      try {
        const response = await DeforestationService.getApprovalFlowSettingByOrgId();
        if (response.data?.approvalFlowSettingByOrgId) {
          this.settings = response.data.approvalFlowSettingByOrgId;
          this.approvalExpirationValue = parseInt(this.settings.approval_expiration_period) || 0;
          this.approvalExpirationUnit = this.settings.approval_expiration_unit?.toLowerCase() || 'days';
        }
      } catch (error) {
        console.error('Failed to fetch approval flow settings:', error);
      } finally {
        this.stopLoading();
      }
    },
    closeModal() {
      this.resetForm();
      this.$emit('close');
    },
    confirmApproval() {
      const approvalData = {
        isTemporaryApproval: this.isTemporaryApproval,
        approvalExpirationValue: this.isTemporaryApproval ? parseInt(this.approvalExpirationValue) || 0 : null,
        approvalExpirationUnit: this.isTemporaryApproval ? this.approvalExpirationUnit : null
      };
      
      this.$emit('confirm', approvalData);
      this.closeModal();
    },
    resetForm() {
      this.isTemporaryApproval = false;
      this.approvalExpirationValue = parseInt(this.settings?.approval_expiration_period) || 0;
      this.approvalExpirationUnit = this.settings?.approval_expiration_unit?.toLowerCase() || 'days';
    }
  },
  watch: {
    dialog(newVal) {
      if (newVal) {
        this.fetchSettings();
      } else {
        this.resetForm();
      }
    },
    approvalExpirationValue(newVal) {
      // Ensure the value is always a number
      if (newVal !== null && newVal !== undefined) {
        this.approvalExpirationValue = parseInt(newVal) || 0;
      }
    }
  }
}
</script>

<style scoped>
.v-input--checkbox .v-input__slot {
  margin-bottom: 0;
}
</style>