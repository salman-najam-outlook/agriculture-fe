<!-- settings page -->
<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <h1>{{ $t("ptsi.settings") }}</h1>
      <v-card class="pa-6 mt-2" elevation="0">
        <div class="mb-8">
          <h2 class="text-h6 font-weight-bold mb-2">{{ $t("ptsi.overdueTimeForDdsReport") }}</h2>
          <p class="text-subtitle-1 text-medium-emphasis mb-6">{{ $t("ptsi.setDefaultDueDateForDdsReport") }}</p>

          <div class="d-flex align-center mb-4">
            <label class="text-body-1 font-weight-medium mr-2">{{ $t("ptsi.approvalExpirationPeriod") }}</label>
            <v-tooltip top color="00BD73" max-width="350">
              <template v-slot:activator="{ on, attrs }">
                <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                  mdi-alert-circle
                </v-icon>
              </template>
              <span>{{ $t("deforestation.producerData.countryInfo") }}</span>
            </v-tooltip>
          </div>

          <div class="d-flex align-center">
            <v-text-field v-model="overdueTime" outlined dense type="number" min="1" class="mr-4"
              style="max-width: 100px" hide-details density="compact"></v-text-field>
            <v-select outlined dense style="max-width: 200px" v-model="overdueTimeUnit" :items="timeUnits"
              variant="outlined" hide-details></v-select>
          </div>
        </div>

        <v-divider class="my-8"></v-divider>

        <!-- Visibility of Document Section -->
        <div>
          <h2 class="text-h6 font-weight-bold mb-2">{{ $t("ptsi.visibilityOfDocument") }}</h2>
          <p class="text-subtitle-1 text-medium-emphasis mb-6">{{
            $t("ptsi.setDefaultSelectionForVisibilityOfDocumentsAttachedOnReport") }}</p>

          <v-radio-group v-model="documentVisibility" class="mt-4">
            <v-radio value="PRIVATE" class="mb-4">
              <template v-slot:label>
                <div>
                  <div class="font-weight-medium">{{ getOrganizationName == 'PT Surveyor Indonesia' ? $t("ptsi.private") : $t("ptsi.privateNaccu") }}</div>
                  <div class="text-body-2 text-medium-emphasis">{{
                    $t("ptsi.visibleOnlyToAdminsHiddenFromAllCooperativesAndUsers") }}</div>
                </div>
              </template>
            </v-radio>

            <v-radio value="COOPERATIVE_AND_PTSI_ONLY" class="mb-4">
              <template v-slot:label>
                <div>
                  <div class="font-weight-medium">{{ getOrganizationName == 'PT Surveyor Indonesia' ? $t("ptsi.cooperativeAndPtsiOnly") : $t("ptsi.cooperativeAndNaccuOnly") }}</div>
                  <div class="text-body-2 text-medium-emphasis">{{
                    $t("ptsi.visibleOnlyToTheAssignedCooperativeAndPlatformAdministrators") }}</div>
                </div>
              </template>
            </v-radio>

            <v-radio value="PUBLIC" class="mb-4">
              <template v-slot:label>
                <div>
                  <div class="font-weight-medium">{{ $t("ptsi.public") }}</div>
                  <div class="text-body-2 text-medium-emphasis">{{
                    $t("ptsi.visibleToEveryoneIncludingAllUsersAndTheGeneralPublic") }}</div>
                </div>
              </template>
            </v-radio>
          </v-radio-group>
        </div>

        <!-- Action Buttons -->
        <div class="d-flex justify-end mt-8">
          <v-btn outlined dense primary @click="goBack" class="mr-2 text-capitalize text-primary">
            {{ $t("cancel") }}
          </v-btn>
          <v-btn color="primary" @click="saveSettings">
            {{ $t("ptsi.saveSettings") }}
          </v-btn>
        </div>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import DeforestationService from '@/_services/DeforestationService';
import loadingMixin from "@/mixins/LoadingMixin";
export default {
  name: 'ApprovalFlowSettings',
  mixins: [loadingMixin],
  data() {
    return {
      breadcrumbs: [
        { text: 'Deforestation', to: '/deforestation' },
        { text: 'Settings' },
      ],
      overdueTime: 0,
      overdueTimeUnit: 'DAYS',
      timeUnits: ['DAYS', 'WEEKS', 'MONTHS'],
      documentVisibility: 'PRIVATE',
      saving: false,
      // Original values for change tracking
      originalOverdueTime: 0,
      originalOverdueTimeUnit: 'DAYS',
      originalDocumentVisibility: 'PRIVATE',
    };
  },
  computed: {
    getApprovalFlowSettingByOrgId() {
      return DeforestationService.getApprovalFlowSettingByOrgId(this.getOrganizationId);
    },
    getOrganizationId() {
      return this.$store.getters.getUser?.user_organization?.id;
    },
    getOrganizationName() {
      return this.$store.getters.getUser?.user_organization?.name;
    },
  },
  async mounted() {
    try {
      const response = await this.getApprovalFlowSettingByOrgId;
      
      if (response.data?.approvalFlowSettingByOrgId) {
        const settings = response.data.approvalFlowSettingByOrgId;
        
        // Populate the form fields with fetched data
        this.overdueTime = settings.approval_expiration_period || 12;
        this.overdueTimeUnit = settings.approval_expiration_unit || 'DAYS';
        this.documentVisibility = settings.document_visibility || 'PRIVATE';
        
        // Store original values for change tracking
        this.originalOverdueTime = this.overdueTime;
        this.originalOverdueTimeUnit = this.overdueTimeUnit;
        this.originalDocumentVisibility = this.documentVisibility;
      }
    } catch (error) {
      this.$notify({
        title: 'Failed to load settings',
        type: 'error',
      });
    }
  },
  methods: {
    async saveSettings() {
      this.startLoading();
      try {
        const settings = {
          approval_expiration_period: parseInt(this.overdueTime) || 12,
          approval_expiration_unit: this.overdueTimeUnit,
          document_visibility: this.documentVisibility,
        };

          const response = await DeforestationService.updateApprovalFlowSettingByOrgId(settings);

          if(response.data) {

            this.$notify({
              title: 'Settings saved successfully',
              type: 'success',
              color: 'primary',
            });
          } else {
            this.$notify({
              title: 'Failed to save settings',
              type: 'error',
              color: 'red',
            });
          }
      } catch (error) {
        this.$notify({
          title: 'Failed to save settings',
          type: 'error',
          color: 'red',
        });
      } finally {
        this.stopLoading();
      }
    },
    goBack() {
      this.$router.push('/approvalFlow');
    },
  },
};

</script>

<style scoped>
.v-radio-group .v-radio {
  margin-bottom: 16px;
}

.v-radio-group .v-radio:last-child {
  margin-bottom: 0;
}
</style>