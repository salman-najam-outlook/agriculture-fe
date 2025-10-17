<template>
  <v-card elevation="0" class="mt-4">
    <v-card-title class="font-weight-bold">{{ protocol.title }}</v-card-title>
    <v-card-text>
      <div class="black--text d-flex flex-nowrap flex-column flex-md-row">
        <img :src="protocol.sealUrl" style="width: 240px; height: 160px; object-fit: cover; flex-shrink: 0"
          class="d-block" />
        <div class="ml-4">
          <p class="mb-0" v-html="protocol.description">
          </p>
          <div v-if="protocol.esgStandard" class="mt-4 d-flex flex-nowrap flex-column flex-sm-row align-center">
            <div class="font-weight-bold">Standard:</div>
            <div class="d-flex flex-nowrap flex-row align-center ml-3">
              <img :src="protocol.esgStandard.sealUrl"
                style="height: 32px; width: 48px; object-fit: cover; flex-shrink: 0" class="d-block" />
              <span class="ml-3">{{ protocol.esgStandard.title }}</span>
            </div>
          </div>
          <div class="mt-4 d-flex flex-nowrap flex-column flex-sm-row align-center">
            <div class="d-flex flex-nowrap align-center">
              <div class="font-weight-bold mr-3">Status:</div>
              <v-btn small rounded min-width="150" depressed
                :class="`${getStatusColor(protocol.status ? protocol.status.charAt(0).toUpperCase() + protocol.status.slice(1) : 'Pending')}-button`"
                height="34">
                {{ protocol.status ? protocol.status : 'Pending' }}
              </v-btn>
            </div>
            <div class="ml-6 d-flex flex-nowrap flex-column flex-sm-row align-center">
              <div class="font-weight-bold mr-3">Progress:</div>
              <div class="d-flex align-center">
                <v-progress-linear :color="getProgressColor(protocol.progress)" height="10" style="width: 96px"
                  :value="protocol.progress" rounded>
                </v-progress-linear>
                <span class="ml-2 flex-shrink-0">{{ progressData.overallProgress }}%</span>
              </div>
            </div>
          </div>
          <div class="mt-4" v-if="protocol.status === 'rejected'">
            <div class="font-weight-bold">{{ $t('esgPlatform.reasonForRejection') }}:</div>
            <p class="mb-0">
              {{ protocol.rejectionReason }}
            </p>
          </div>
        </div>
      </div>

      <div v-show="showActions">
        <v-divider class="my-6"></v-divider>
        <div class="text-right">
          <v-btn color="primary ml-4" @click="showDownloadReportDialog">
            <v-icon left>mdi-tray-arrow-down</v-icon>
            {{ $t('esgPlatform.download') }}
          </v-btn>
          <!-- TODO: Ignore comparision for c-->
          <!-- <v-btn color="primary ml-4">{{ $t('esgPlatform.comparision') }}</v-btn> -->
          <v-btn color="primary ml-4"
            :to="{
              name: 'ProtocolMessagesOfSubOrganization',
              params: { protocolId: protocol.id , subOrganizationId },
            }">
              {{ $t('esgPlatform.messages') }}
          </v-btn>
          <v-btn color="primary ml-4" @click="handleValidateData">{{ $t('esgPlatform.validateData') }}</v-btn>
          <v-btn color="primary ml-4" :to="{
            name: 'ProtocolRecommendationsOfSubOrganization',
            params: { id: protocol.id, subOrganizationId },
          }">{{ $t('esgPlatform.recommendations') }}
          </v-btn>
          <v-btn color="primary ml-4" v-if="!isSubUser" @click="showUpdateStatusModal = true">{{ $t('esgPlatform.updateStatus') }}</v-btn>
        </div>
      </div>
    </v-card-text>
    <UpdateStatus :dialog="showUpdateStatusModal" @cancel="onCancel" @confirm="onConfirm" />

    <!-- Download Report Dialog -->
    <DownloadReport v-if="showDownloadReport" :dialog="showDownloadReport" @close="showDownloadReport = false"
      @download="downloadReportPdf" />

    <!-- Downloading Protocol Dialog -->
    <Downloading v-if="showDownloading" :dialog="showDownloading" @close="showDownloading = false" />

  </v-card>
</template>

<script>
import UpdateStatus from '../UpdateStatus.vue';
import LoadingMixin from "@/mixins/LoadingMixin";
import DownloadReport from './DownloadReport.vue';
import Downloading from './Downloading.vue';
import EsgService from '@/_services/EsgService';

export default {
  mixins: [LoadingMixin],
  components: {
    DownloadReport,
    Downloading,
    UpdateStatus
  },
  props: {
    protocol: {
      type: Object,
      required: true,
    },
    subOrganizationId: {
      type: [String, Number],
      required: true,
    },
    showActions: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showUpdateStatusModal: false,
      showDownloadReport: false,
      showDownloading: false,
      progressData: {
        overallProgress: 0,
        environmentalProgress: 0,
        socialProgress: 0,
        governanceProgress: 0
      }
    };
  },
  mounted() {
    if (this.showActions) {
      this.getGoalProgress();
    }
  },
  methods: {
    isSubUser() {
      const user = JSON.parse(localStorage.getItem('user'));
      for (const role of user.user_role_assoc) {
        if (role.id === 'sub_enterprise') return true;
      }
      return false;
    },
    async getProtocolProgress(){
        this.startLoading();
        await EsgService.getProtocolProgress(this.protocol.id).then(response => {
            this.progressData = {
              overallProgress: response.data?.Overall || 0,
              environmentalProgress: response.data?.Environmental || 0,
              socialProgress: response.data?.Social || 0,
              governanceProgress: response.data?.Governance || 0
            }
        }).catch(error => {
            console.error("Error fetching protocol progress:", error);
        }).finally(() => {
            this.stopLoading();
        });
    },
    getGoalProgress() {
      this.startLoading();

      const goalIds = [];

      this.protocol?.esgIssues?.forEach(issue => {
        const ids = issue.esgGoals?.map(goal => goal._id) || [];
        goalIds.push(...ids);
      });

      EsgService.getGoalWiseProgressByGoalIds({
        goalIds,
        subOrganizationId: this.subOrganizationId
      })
        .then(response => {
          this.calculateOverallProgress(response.data || []);
        })
        .catch(error => {
          console.error('Error fetching goal progress:', error);
        })
        .finally(() => {
          this.stopLoading();
        });
    },
    calculateOverallProgress(goalProgress) {
      const totalResponse = goalProgress.reduce((sum, g) => sum + (g.totalResponseScore || 0), 0);
      const totalQuestion = goalProgress.reduce((sum, g) => sum + (g.totalQuestionScore || 0), 0);

      const overall = totalQuestion > 0 ? (totalResponse / totalQuestion) * 100 : 0;

      this.progressData.overallProgress = Number(overall.toFixed(2));
    },
    async showDownloadReportDialog() {
      this.showDownloadReport = true;
    },

    async downloadReportPdf(data) {
      this.showDownloadReport = false;
      this.showDownloading = true;
      try {
        const response = await EsgService.downloadProtocolReport(this.protocol.id, data);

        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `protocol-report-${this.protocol.id}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (err) {
        this.$toast && this.$toast.error('Failed to download PDF');
        console.error(err);
      } finally {
        this.showDownloading = false;
      }
    },

    getProgressColor(value) {
      if (value < 30) return 'red';
      if (value < 70) return 'orange';
      return 'green';
    },
    getStatusColor(status) {
      if (status === 'Pending') return 'gray';
      if (status === 'Approved') return 'green';
      return 'red';
    },
    onCancel() {
      this.showUpdateStatusModal = false;
    },
    async onConfirm({ status, rejectionReason }) {
      try {
        this.startLoading();
        this.isUpdating = true;

        const payload = {
          status: status.toLowerCase(),
          rejectionReason: status === 'Rejected' ? rejectionReason : null
        };

        await EsgService.updateEsgProtocolStatusForRespondent(
          'sub-organization',
          this.$route.params.subOrganizationId,
          this.$route.params.id,
          payload
        );

        this.$emit('status-updated');

      } catch (error) {
        console.error('Update failed:', error);
      } finally {
        this.stopLoading();
        this.showUpdateStatusModal = false;
      }
    },
    handleValidateData() {
      console.log('Validating data of protocol:', this.protocol.id);
      // Here you would typically call a method to validate the data
      
      this.$router.push({
        name: 'validationData',
        params: { id: this.protocol.id, subOrganizationId: this.subOrganizationId },
      });
    },

  },
};
</script>
