<template>
  <div>
    <!-- <v-select
      v-if="isReportApproved"
      :items="statuses"
      item-text="name"
      item-value="value"
      v-model="selectedStatus"
      @change="updateStatus"
      class="selectbox"
      outlined
      dense
    ></v-select> -->
    <v-select
      v-if="isShowDownloadOption"
      :items="downloadReportOptions"
      item-text="name"
      item-value="value"
      @change="updateDownloadStatus"
      v-model="selectedDownloadOption"
      class="selectbox mr-3"
      outlined
      dense
      :placeholder="$t('memberDataSection.download')"
    ></v-select>
    <v-btn
      v-if="diligenceId && !isReadonlyMode"
      color="#F03737"
      dark
      medium
      class="mr-3"
      @click="discard"
      v-bind="getButtonProps()"
    >
      {{ $t('deforestation.discard')}}
    </v-btn>
    <v-btn
      v-if="diligenceId && !isSupplierOperatorOnly && !isReadonlyMode"
      color="#FFB443"
      dark
      medium
      class="mr-3"
      @click="reject"
      v-bind="getButtonProps()"
    >
      {{ $t('deforestation.reject')}}
    </v-btn>
    <v-btn v-if="showRequestAdditionalInformation && !isReadonlyMode" color="primary" dark medium class="mr-3" @click="requestAdditionalInformation" v-bind="getButtonProps()">
      {{ $t('deforestation.requestAdditionalInformation')}}
    </v-btn>
    <v-btn
      color="primary"
      dark
      medium
      class="mr-3"
      v-if="!isFinalPage && !isReadonlyMode"
      @click="saveAndContinueLater"
      v-bind="getButtonProps()"
    >
      {{ $t('deforestation.saveAndContinueLater')}}
    </v-btn>
    <v-btn v-if="!isFinalPage" color="primary" dark medium class="mr-3" @click="next">
      {{ $t('deforestation.next') }}
    </v-btn>
    <v-btn 
      color="primary" 
      dark 
      medium 
      class="mr-3"
      v-if="isFinalPage && isConcludeState && !isReadonlyMode"
      @click="approveDialog = true"
      v-bind="getButtonProps()"
      >
      {{ $t('deforestation.conclude') }}
    </v-btn>
    <v-btn
        color="primary"
        dark
        medium
        class="mr-3"
        v-if="isFinalPage && isSupplierOnly && isReportComplaintAndNonComplaint && !isIndonesianClient && !shareReportEnabled && !isReadonlyMode"
        @click="sendToOperatorDialog = true"
        >
      {{ $t('deforestation.sendToOperator') }}
    </v-btn>
    <v-btn 
      color="primary" 
      dark 
      medium 
      class="mr-3"
      v-if="isFinalPage && isReportApproved && isOperatorOperatorOwnerOnly && !isReadonlyMode"
      @click="handleEUDRUpload()"
      >
      {{ $t('deforestation.uploadToEudr') }}
    </v-btn>

    <v-btn
      color="primary"
      dark
      medium
      class="mr-3"
      v-if="isFinalPage && isReportComplaintAndNonComplaint && shareReportEnabled && !isOperator && !isReadonlyMode"
      @click="shareReportToExporter"
      >
    >
      {{ isKenyaClient ?  $t('deforestation.shareReportKenya') : $t('deforestation.shareReport')  }}
    </v-btn>

    <SaveAndContinueDialog @confirm-save="confirmSaveAndContinueLater" @close-modal="closeSaveAndContinueDialog" :dialog="saveAndContinueDialog" />
    <confirm-download @confirm="triggerDownload" @close-modal="closeDownloadModel" :dialog="showConfirmation" />
    <RequestAdditionalInformation @close-modal="closeRequestAdditionalInformationDialog" v-if="requestAdditionalInformationDialog" :dialog="requestAdditionalInformationDialog" :supplierId="supplierId" :visibleSelectedTabs="visibleSelectedTabs"/>
    <DiscardDialog @close-modal="closeDiscardDialog" :dialog="discardDialog" />
    <RejectDialog @close-modal="closeRejectDialog" :dialog="rejectDialog" />
    <ApproveDialog @confirm-approval="confirmApproval" @close-modal="closeApproveDialog" :dialog="approveDialog" />
    <SendToOperatorDialog @confirm-send="confirmSend" @close-modal="closeSendToOperatorDialog" :dialog="sendToOperatorDialog" />

    <Seventy2HourConfirmation @finilize="handleFinilize" :dialog="confirmSeventyTwoHourModalOpen" @close-modal="handleWarningCloseModal" />
    <WarningModel :warnings="getWarnings" @handle-finilize="handleConfirmationWithError" @close-modal="handleWarningCloseModal" @gotoTab="handleTabs" :dialog="warningModalOpen" />
    <AfterWithErrorConfirmation :dialog="confirmSeventyTwoHourWithErrorModalOpen" @finilize="handleFinilize" @close-modal="handleWarningCloseModal"/> 

  </div>
</template>

<script>
import DiscardDialog from "./DiscardDialog.vue";
import RejectDialog from "./RejectDialog.vue";
import SendToOperatorDialog from  "./SendToOperatorDialog.vue";
import SaveAndContinueDialog from "./SaveAndContinueDialog.vue";
import ApproveDialog from './ApproveDialog.vue';
import ConfirmDownload from './ConfirmDownload.vue';
import RoleMixin from "@/mixins/RoleMixin";
import reportReadonlyMixin from "@/mixins/reportReadonlyMixin";
import RequestAdditionalInformation from "./RequestAdditionalInformation.vue";

import Seventy2HourConfirmation from './final-conclude/72HourConfirmation.vue'
import WarningModel from './final-conclude/WarningModel.vue'
import AfterWithErrorConfirmation from './final-conclude/AfterWithErrorConfirmation.vue'
import { isIndonesianClient, isKenyaClient } from "@/utils";
export default {
  components: {
    DiscardDialog,
    RejectDialog,
    SaveAndContinueDialog,
    RequestAdditionalInformation,
    ApproveDialog,
    SendToOperatorDialog,
    ConfirmDownload,
    Seventy2HourConfirmation,
    WarningModel,
    AfterWithErrorConfirmation
  },
  props: {
    supplierId: {
      required: false,
    },
    isFinalPage: {
      type: Boolean,
      required: false
    },
    reportStatus: {
      required: false
    },
    tabs: {
      type: Array,
      default: () => [],
    },
    step: {
      type: Number,
      required: false
    },
    shareReportEnabled: {
      type: Boolean,
      required: false
    },
    reportDetails: {
      type: Object,
      required: false
    }
  },
  watch: {
    '$route.params.id'(newVal) {
        if(newVal){
          this.diligenceId = newVal;
        }
      },
    },
  data() {
    return {
      testModelFlag:false,
      warningModalOpen:false,
      confirmSeventyTwoHourModalOpen:false,
      confirmSeventyTwoHourWithErrorModalOpen:false,

      diligenceId: this.$route.params.id || null,
      discardDialog: false,
      requestAdditionalInformationDialog:false,
      rejectDialog: false,
      saveAndContinueDialog:false,
      approveDialog: false,
      sendToOperatorDialog:false,
      selectedFormat: null,
      showConfirmation: false,
      statuses: [
        {
          name: this.$t("dueDiligence.selectStatus"),
          value:''
        },
        {
          name: this.$t('deforestation.compliant'),
          value:'Compliant'
        },
        {
          name:  this.$t('deforestation.nonCompliant'),
          value:'Non-Compliant'
        }
      ],

      reportStatuses: [
        {
          name: this.$t('deforestation.pending'),
          value:'Pending'
        },
        {
          name: this.$t('deforestation.underReview'),
          value:'Under Review'
        }
      ],
      downloadReportOptions:[
        {
          name:  this.$t('dueDiligence.downloadOptions'),
          value: ''
        },
        {
          name:  this.$t('dueDiligence.downloadAsPDF'),
          value: 'pdf'
        },
        {
          name:  this.$t('dueDiligence.downloadAsJSON'),
          value: 'json'
        },
      ],
      selectedDwReport:'',
      selectedStatus: '',
      selectedDownloadOption: '',
      selectedReportStatus: '',
      //selectedAssessments: [] // This will store objects
      visibleSelectedTabs: [],
    };
  },
  computed: {
    isIndonesianClient() {
      return isIndonesianClient();
    },
    isKenyaClient() {
      return isKenyaClient();
    },
    ddsActiveTab() {
      const ddsLocalData = this.$store.getters["getDDSLocalData"];
      return ddsLocalData?.activeTab || 1;
    },
    getddsStoreData(){
      return this.$store.getters["eudrDDS/getDiligenceDetails"]
    },
    currentUpdateStatus(){
      return this.getddsStoreData?.status
    },
    userRole() {
      return this.$store.getters["eudrDDS/getDdsUserRole"];
    },
    isSupplier() {
      return this.userRole === "supplier_owner" || "supplier";
    },
    isSupplierSubUser(){
      return this.userRole === "supplier";
    },
    isOperator() {
      return this.userRole === "operator_owner" || this.userRole == "operator";
    },
    isSupplierOnly(){
      return this.getCurrentRoles.includes("supplier_owner") || this.getCurrentRoles.includes("supplier")
    },
    isSupplierOperatorOnly(){
      return  this.getCurrentRoles.includes("supplier") || this.getCurrentRoles.includes("operator")
    },
    isOperatorOperatorOwnerOnly(){
      return  this.getCurrentRoles.includes("operator_owner") || this.getCurrentRoles.includes("operator")
    },
    isReportApproved() {
      return this.currentUpdateStatus === "Compliant" && !!this.getddsStoreData?.is_report_concluded
    },
    isReportComplaintAndNonComplaint(){
      return this.currentUpdateStatus === "Compliant" ||  this.currentUpdateStatus == 'Non-Compliant';
    },
    isShowDownloadOption(){
      return this.currentUpdateStatus === 'Compliant' || this.currentUpdateStatus == 'Non-Compliant'
    },
    isConcludeState(){
      return (!this.isIndonesianClient && (this.currentUpdateStatus === 'Compliant' || this.currentUpdateStatus == 'Non-Compliant')) || (this.isIndonesianClient && !this.isSupplierOnly)
    },
    showRequestAdditionalInformation(){
      return this.diligenceId && this.isOperatorOperatorOwnerOnly && this.step > 1
    },
    getWarnings()
    {
      return this.$store.getters["eudrDDS/getDetailWarnings"];
    },
    
  },
  mounted() {
    this.selectedStatus = this.currentUpdateStatus;
  },
  methods: {
    closeApproveDialog() {
      this.approveDialog = false;
    },

    closeSendToOperatorDialog(){
      this.sendToOperatorDialog =false;
    },

    discard() {
      this.discardDialog = true;
    },
    closeDiscardDialog() {
      this.discardDialog = false;
    },

    reject() {
      this.rejectDialog = true;
    },
    closeRejectDialog() {
      this.rejectDialog = false;
    },
    requestAdditionalInformation() {
      this.visibleSelectedTabs = this.tabs.slice(1, this.tabs.length - 1);
      this.requestAdditionalInformationDialog = true;
    },
    closeRequestAdditionalInformationDialog() {
      this.requestAdditionalInformationDialog = false;
    },
    closeSaveAndContinueDialog(){
        this.saveAndContinueDialog = false
    },
    saveAndContinueLater() {
      this.saveAndContinueDialog = true;
    },
    confirmSaveAndContinueLater() {
      this.saveAndContinueDialog = false;
      this.$emit("saveAndContinueLater");
    },
    triggerDownload(pdfContent) {
      this.$emit('downloadReportType', this.selectedDownloadOption, pdfContent);
      this.showConfirmation = false;
      this.selectedFormat = null;
    },
    handleChangeDownload() {
      this.showConfirmation = true;
    },
    closeDownloadModel() {
      this.showConfirmation = false;
      this.selectedFormat = null;
    },
    updateStatus() {
      this.$emit("updateStatus", this.selectedStatus);
    },

    updateReportStatus() {
      this.$emit("updateReportStatus", this.selectedReportStatus);
    },

    updateDownloadStatus(){
      if(this.selectedDownloadOption === 'pdf'){
        this.showConfirmation = true;
      }
      else if(this.selectedDownloadOption === 'json'){
        this.$emit('downloadReportType', this.selectedDownloadOption);
      }
    },

    confirmSend(){
      this.sendToOperatorDialog = false;
      setTimeout(() => {
        this.$emit("sendToOperator");
      }, 500);
    },
    next() {
      this.$emit("nextStep");
    },
    handleEUDRUpload(){
      this.$notify({
        type: 'warning',
        title: 'Feature in Progress',
        text: 'This Feature is not available yet!!'
      });
      setTimeout(() => {
        this.$router.push({ name: "deforestation" });
      }, 500);
    },
    handleTabs(tab){
      this.$emit('handleTab',tab)
    },
    confirmApproval() {
      this.approveDialog = false;
      this.showWarningAndConfirmationBox()
    },
    showWarningAndConfirmationBox() {
       if(this.getWarnings?.length){
         this.warningModalOpen = true
         return
       }
       this.confirmSeventyTwoHourModalOpen = true
    },
    handleConfirmationWithError(){
      this.warningModalOpen = false
      this.confirmSeventyTwoHourWithErrorModalOpen = true
    },
    handleFinilize(publishOption){
      this.$emit("approveReport",publishOption);
    },
    handleWarningCloseModal(){
      this.warningModalOpen = false
      this.confirmSeventyTwoHourModalOpen = false
      this.confirmSeventyTwoHourWithErrorModalOpen = false
    },
    shareReportToExporter(){
      this.$emit("shareReportToExporter");
    }
  },
  mixins:[RoleMixin, reportReadonlyMixin]
};
</script>

<style scoped>
.selectbox {
  display: inline-block !important;
  margin-right: 24px !important;
  transform: translateY(2px);
  width: 250px;
}

/* Custom styling for disabled buttons */
.theme--dark.v-btn.v-btn--disabled.v-btn--has-bg {
  background-color: #424242 !important;
  color: rgba(255, 255, 255, 0.5) !important;
  opacity: 0.6 !important;
}

/* Alternative: More specific styling for different button colors */
.theme--dark.v-btn.v-btn--disabled.v-btn--has-bg[color="#F03737"] {
  background-color: #424242 !important;
}

.theme--dark.v-btn.v-btn--disabled.v-btn--has-bg[color="#FFB443"] {
  background-color: #424242 !important;
}

.theme--dark.v-btn.v-btn--disabled.v-btn--has-bg[color="primary"] {
  background-color: #424242 !important;
}
</style>
