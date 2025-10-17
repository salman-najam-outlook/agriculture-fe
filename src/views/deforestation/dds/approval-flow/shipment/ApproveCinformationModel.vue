<template>
    <v-dialog v-model="dialog" persistent :max-width="$vuetify.breakpoint.mobile ? '95vw' : '700'">
      <v-card class="approval-confirmation-modal">
        <!-- Dark blue header -->
        <div class="modal-header primary">
          <h2 class="header-title">{{ $t('dueDiligence.confirmation') }}</h2>
          <v-btn icon class="close-btn" @click="closeModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        
        <!-- White content area -->
        <div class="modal-content">
          <div class="confirmation-question">
            {{ $t('dueDiligence.approvalConfirmationMessageShipment') }}
          </div>
          
          <div class="approval-consequences">
            <div class="consequences-title">{{ $t('dueDiligence.approvalOnceApprovedTitle') }}:</div>
            <ul class="consequences-list">
              <li>{{ $t('dueDiligence.approvalVerifiedByShipment') }}</li>
              <li>{{ $t('dueDiligence.allAssociatedReportsWillBeApprovedShipment') }}</li>
              <li>{{ $t('dueDiligence.approvalVerificationLinksShipment') }}</li>
              <li>{{ $t('dueDiligence.approvalNoFurtherChangesShipment') }}</li>
              <li>{{ $t('dueDiligence.approvalPublishedToBlockchainShipment') }}</li>
            </ul>
          </div>
        </div>
        
        <!-- Action buttons -->
        <div class="modal-actions">
          <v-btn outlined class="cancel-btn" @click="closeModal">
            {{ $t('cancel') }}
          </v-btn>
          <v-btn depressed class="approve-btn" @click="confirmApproval">
            {{ $t('dueDiligence.approvalApproveButton') }}
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import DeforestationService from '@/_services/DeforestationService';
  import LoadingMixin from '@/mixins/LoadingMixin';
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
  .approval-confirmation-modal {
    border-radius: 8px;
    overflow: hidden;
  }
  
  .modal-header {
    color: white;
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .header-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    color: white;
  }
  
  .close-btn {
    color: white !important;
    background: transparent !important;
  }
  
  .close-btn:hover {
    background: rgba(255, 255, 255, 0.1) !important;
  }
  
  .modal-content {
    background: white;
    padding: 24px;
    color: #333;
  }
  
  .confirmation-question {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 20px;
    color: #333;
  }
  
  .approval-consequences {
    margin-bottom: 20px;
  }
  
  .consequences-title {
    font-weight: 500;
    margin-bottom: 12px;
    color: #333;
  }
  
  .consequences-list {
    margin: 0;
    padding-left: 20px;
    list-style-type: disc;
  }
  
  .consequences-list li {
    margin-bottom: 8px;
    color: #555;
    line-height: 1.4;
  }
  
  .modal-actions {
    background: white;
    padding: 16px 24px;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    border-top: 1px solid #e0e0e0;
  }
  
  .cancel-btn {
    border-color: #1976d2 !important;
    color: #1976d2 !important;
    text-transform: none;
    font-weight: 500;
    padding: 8px 24px;
  }
  
  .cancel-btn:hover {
    background: rgba(25, 118, 210, 0.04) !important;
  }
  
  .approve-btn {
    background: #1976d2 !important;
    color: white !important;
    text-transform: none;
    font-weight: 500;
    padding: 8px 24px;
  }
  
  .approve-btn:hover {
    background: #1565c0 !important;
  }
  
  /* Override Vuetify dialog styles */
  .v-dialog .v-card {
    border-radius: 8px;
    overflow: hidden;
  }
  </style>