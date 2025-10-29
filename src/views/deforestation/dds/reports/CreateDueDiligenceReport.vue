<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid class="px-6 py-0">
      <div class="d-flex">
        <h2>{{ $t('dueDiligence.dueDiligenceReportCreation') }}</h2>
        <v-spacer></v-spacer>
        <ActionButton :reportStatus="reportStatus" @downloadReportType="downloadFinalReport"
          @updateStatus="updateReportStatus" @updateReportStatus="updateReportStatus"  @approveReport="approveReport" @saveAndContinueLater="saveAndContinueLater"
          @nextStep="nextStep" :supplierId="report && parseInt(report.supplierId) || null"
          :isFinalPage="step == finalReportStep" @sendToOperator="sendToOperator" :tabs="tabs" @handleTab="gotoTab" :step="step" @shareReportToExporter="shareReportToExporter" :shareReportEnabled="!!report?.ddsReportExporter" :reportDetails="report" />
      </div>

      <v-card elevation="0" class="px-5 mt-7">
        <v-card-text>
          <CustomTab @changeStep="changeStep" :tabs="tabs" :activeTab="step"/>
          <v-divider class="mt-5"></v-divider>

          <!-- <WarningBox :warnings="warnings" :diligenceId= "diligenceId" v-if="warnings.length > 0 && step !== 1 && step !== 2" /> -->
          <NewWarningBox :step="step" @gotoTab="gotoTab" :diligenceId= "diligenceId" :highestStepReached="highestStepReached" v-if="report"/>

          <ReportDetails v-if="step == 1" ref="reportDetailsComponent" :diligenceId="diligenceId"
            @updateDiligenceId="setDiligenceId" @updateWhoWillAddPlaceData="setTabs" @updateTabs="updateTabs"
            @getEUDRAssessmentType="updateEUDRAssessmentType" @increaseStep="increaseStep" />

          <ProductionPlace v-if="step == 2" ref="productionPlaceComponent" @updateStep="updateStep"
            :diligenceId="diligenceId" />

          <locationVerification
            v-if="step == 3" 
            ref="locationVerificationComponent" 
            :diligenceId="diligenceId"
            @warningLists="updateWarnings"
            @fetchStep3WarningData="fetchStep3WarningData"
            @fetchUpdatedProductionPlaceData="fetchUpdatedProductionPlaceData"
            @confirmLocationVerification="confirmLocationVerification"
            @confirmProceedToNextPage="confirmProceedToNextPage"
            @resetLocationVerification="resetLocationVerification"
          />

          <EUDRAssessmentReport v-if="step == 4" ref="eudrAssessmentComponent" :diligenceId="diligenceId"
            :updatedProductionPlaces="productionPlaceData" @calculateWarningsForDeforestationAssessment="calculateWarningsForDeforestationAssessment" />

          <RegionalRiskAssessment v-if="report?.enableRegionalRiskAssessment && step == 5" :diligenceId="diligenceId" />
          
          <template v-if="report && report.diligenceReportAssessment.length > 0">
            <template v-for="(assessment, index) in report.diligenceReportAssessment">
              <RiskAssessment :key="index" :ref="`riskAssessmentComponent-${index}`" :diligenceId="diligenceId"
                :report="report" :assessment="assessment" v-if="step == ((report?.enableRegionalRiskAssessment?6:5) + index)" @calculateWarningsForDeforestationAssessment="calculateWarningsForDeforestationAssessment"/>
            </template>
          </template>

          <FinalReport ref="dueDiligenceFinalComponent" :diligenceId="diligenceId" :diligenceStatus="updatedStatus"
            v-if="report && step == finalReportStep" />
        </v-card-text>
      </v-card>

      <v-card elevation="0" class="px-5 mt-7" v-if="step !== finalReportStep">
        <v-card-text>
          <template>
            
            <div class="text-right">
              <ActionButton @approveReport="approveReport" @downloadReportType="downloadFinalReport"
                :reportStatus="reportStatus" @saveAndContinueLater="saveAndContinueLater" @nextStep="nextStep"
                @updateStatus="updateReportStatus" @updateReportStatus="updateReportStatus" :isFinalPage="step == finalReportStep" @handleTab="gotoTab"  :shareReportEnabled="!!report?.ddsReportExporter"/>
            </div>
          </template>
        </v-card-text>
      </v-card>

      <!-- <WarningDialog 
        :dialog="warningDialog" 
        :warnings="warnings" 
        @close-modal="warningDialog = false" 
        @edit-report="editStep"
        @download-report="downloadFinalReport"
        :hideAdditionalActions="hideAdditionalActions"
      /> -->
      <RiskWarningDialog v-if="warningDialog" :dialog="warningDialog" :title="riskWarningElements.title"
          :message="riskWarningElements.content"
          @continue:action="handleRiskWarningAction"
        />
    </v-container>
    <ProcessingDialog
      :dialog="showProcessingDialogForBlockchainWrite"
      :heading="uploading"
      :description="blockchainWriteDesc"
      :showProgress="showBlockchainProgress"
      :progress="blockchainProgress"
      @close="onProcessingDialogForBlockchainClose"
    >
      <img src="/icons/blockchain.svg" />
    </ProcessingDialog>
    <NoWriteDialog
      :dialog="showNoBlockchainWriteDialog"
      @close="showNoBlockchainWriteDialog = false">
    </NoWriteDialog>
    <AlertDialog :heading="successMsg" :dialog="showSuccessDialog" @close="showSuccessDialog = false">
      {{ $t('dueDiligence.eudrUploadedToBlockChain')}}
    </AlertDialog>
    <confirm-box 
      :title="ddsConfirmWithoutRiskAssessment.title"
      :message="ddsConfirmWithoutRiskAssessment.message"
      :cancelBtnText="ddsConfirmWithoutRiskAssessment.cancelBtnText" 
      :confirmBtnText="ddsConfirmWithoutRiskAssessment.confirmBtnText"
      :dialog="ddsConfirmWithoutRiskAssessmentDialog" 
      @cancel:action="ddsConfirmWithoutRiskAssessmentDialog = false"
      @continue:action="confirmDdsWithoutRiskAssessment" />

      <!-- Share Report Dialog -->
      <v-dialog v-model="showShareDialog" max-width="700">
        <v-card>
          <v-card-title class="primary white--text">
            {{ $t('dueDiligence.shareReadOnlyReport') }}
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeShareDialog">
              <v-icon style="color: white !important;">mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="pt-4">
            <p class="text-h6 mb-3">
              {{ isKenyaClient ?  $t('deforestation.shareReportKenya') : $t('deforestation.shareReport')  }}
              :</p>
            
            <div v-if="exporterDetails" class="mt-4 pa-3">
              <v-row class="text-body-2">
                <v-col sm="3"> 
                  <p>{{ $t('deforestation.name')}}</p>
                  <strong>{{ exporterDetails.name }}</strong>
                </v-col>
                <v-col sm="3"> 
                  <p>{{ $t('deforestation.email')}}</p>
                  <strong>{{ exporterDetails.email || "-" }}</strong>
                </v-col>
                <v-col sm="3"> 
                  <p>{{ $t('deforestation.phoneNumber')}}</p>
                  <strong>{{ exporterDetails.phoneNumber || "-" }}</strong>
                </v-col>
                <v-col sm="3"> 
                  <p>{{ $t('deforestation.country')}}</p>
                  <strong>{{ exporterDetails.country || "-" }}</strong>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
          <v-card-actions class="pa-4">
            <v-spacer></v-spacer>
            <v-btn color="primary" outlined @click="closeShareDialog">
              {{ $t('cancel') }}
            </v-btn>
            <v-btn color="primary" @click="confirmShare" :disabled="!exporterDetails">
              {{ $t('confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  </div>
</template>

<script>
import Breadcrumb from "@/components/core/Breadcrumb";
import DownloadMixin from "@/mixins/DownloadMixin";
import ReportDetails from "./tabs/ReportDetails.vue";
import ProductionPlace from "./tabs/ProductionPlace.vue";
import CustomTab from "./components/CustomTab.vue";
import ActionButton from "./components/ActionButton.vue";
// import WarningDialog from "./components/WarningDialog.vue";
import locationVerification from "./tabs/LocationVerification.vue";
import EUDRAssessmentReport from "./tabs/EUDRDeforestationAssessment.vue";
import RiskAssessment from "./tabs/RiskAssessment.vue";
//import DueDiligenceFinalReport from "./tabs/DueDeligenceFinalReport.vue";
import loadingMixin from "@/mixins/LoadingMixin";
import FinalReport from "./tabs/FinalReport.vue";
import DeforestationService from "@/_services/DeforestationService";
import ActivityLogService from "@/_services/ActivityLogService";
import UnitService from "@/_services/UnitService";
// import * as geom from "jsts/org/locationtech/jts/geom";
import * as monkey from "jsts/org/locationtech/jts/monkey";
import RiskWarningDialog from './components/location-verification/RiskWarningDialog.vue';
import { wait, EventBus } from '@/utils.js';
import ProcessingDialog from './components/ProcessingDialog.vue';
import NoWriteDialog from "./components/NoWriteDialog.vue";
import AlertDialog from './components/AlertDialog.vue';
// import WarningBox from './components/WarningBox.vue';
import NewWarningBox from "./components/NewWarningBox.vue";
import { get } from 'lodash';
import RegionalRiskAssessment from "./tabs/RegionalRiskAssessment.vue";
import ConfirmBox from "@/components/ConfirmBox";
import { isIndonesianClient , isKenyaClient} from "@/utils";
import UserService from "@/_services/UserService";

export default {
  components: {
    breadcrumb: Breadcrumb,
    CustomTab,
    ReportDetails,
    ProductionPlace,
    ActionButton,
    locationVerification,
    EUDRAssessmentReport,
    RiskAssessment,
    FinalReport,
    // WarningDialog,
    RiskWarningDialog,
    ProcessingDialog,
    AlertDialog,
    NoWriteDialog,
    // WarningBox,
    NewWarningBox,
    RegionalRiskAssessment,
    "confirm-box": ConfirmBox,
  },
  watch: {
    step(newVal, oldVal) {
      this.hideAdditionalActions = false;
      console.log(oldVal, "watcher changed", newVal)
      this.$store.dispatch('SET_DDS_TAB', {
        activeTab: newVal,
      }).then(() => { })
    }
  },
  async created() {
    this.diligenceId = Number(this.$route.params.id) || null;
    if(this.diligenceId){
      this.$store.dispatch('eudrDDS/setDiligenceData', {
        diligenceId: this.diligenceId
      })
      
      // Note: Removed automatic view logging to avoid duplicate logs
      // View logging is now only done for meaningful actions, not page refreshes
    }
    const isShowReport = this.$route.params.show == 'show' ? true : false
    const ddsTab = JSON.parse(localStorage.getItem('DDS_TAB_DATA'))
    if(ddsTab) {
      this.step = (ddsTab && 'activeTab' in ddsTab) ? ddsTab.activeTab : this.step
    } else {
      if (this.diligenceId && isShowReport) {
        this.$store.dispatch('GET_CURRENT_TAB_FROM_REPORT_ID', this.diligenceId).then(res => {
            this.step = res ? res : 1
        })
      }
    }
    
    if(this.$route.params.show == 'complaint'){
      this.reportStatus = 'Compliant'
    }

    this.dontAskAgain = localStorage.getItem("hideRiskWarning") ?? false;

    if(this.dontAskAgain == 'true'){
      this.handleRiskWarningAction({ action: true})
    }
    EventBus.$on('triggerComplainceRiskWarning', (payload) => {
      if(payload){
        this.$store.dispatch('eudrDDS/setDiligenceData', {
        diligenceId: this.diligenceId
        })
      }
    })
  },
  async mounted() {
    this.startLoading()
    if (this.$route.query?.ddrAdditionalInformationId) {
      this.isRequiredAdditionalInformation = true;
      await this.loadAdditionalInformation();
    }
    await this.getEudrSettings();
    if (this.diligenceId) {
      await this.getProductList();
      await this.getDiligenceDetail(this.diligenceId).then(() => this.stopLoading()).catch(() => this.stopLoading());
      await this.calculateWarningsForDeforestationAssessment(this.diligenceId);
    } else {
      this.setTabs("operator")
      this.stopLoading()
    }
    this.highestStepReached = this.step;
    localStorage.setItem('DDS_TAB_LENGTH', this?.tabs?.length)
    console.log(this.tabs, "this dot tabs")
  },
  computed:{
    isKenyaClient() {
      return isKenyaClient();
    },
    userRole() {
      return this.$store.getters["eudrDDS/getDdsUserRole"];
    },
    isSupplier() {
      return this.userRole === "supplier_owner";
    },
    isOperator() {
      return this.userRole === "operator_owner";
    },
    blockchainWriteDesc() {
      return this.showBlockchainProgress ? this.$t('dueDiligence.blockchainDescs[0]') : this.$t('dueDiligence.blockchainDescs[1]');
    },
    getOrganizationId() {
      return this.$store.getters.getUser?.user_organization?.id;
    },
    dynamicWarnings() {
      return this.fetchedWarnings;
    },
    getLatestAdditionalInformation() {
      return this.$store.getters["eudrDDS/ddsAdditionalInformationByDiligenceIdLatest"];
    },
  },

  data() {
    return {
      fetchedWarnings: [],
      step3Warning:[],
      dontAskAgain: false,
      riskWarningElements: {
          title: this.$t("dueDiligence.compilanceRiskWarning"),
          content: this.$t("dueDiligence.issueIdentifiedOnFarms"),
      },
        ddsConfirmWithoutRiskAssessment: {
        title: this.$t("dueDiligence.createWithoutRiskAssessment.title"),
        message: this.$t("dueDiligence.createWithoutRiskAssessment.message"),
        confirmBtnText: this.$t("dueDiligence.createWithoutRiskAssessment.confirmBtnText"),
        cancelBtnText: this.$t("dueDiligence.createWithoutRiskAssessment.cancelBtnText"),
      },
      ddsConfirmWithoutRiskAssessmentDialog: false,
      ddsContinueWithoutRiskAssessment: false,
      successMsg: this.$t('success'),
      uploading: this.$t('dueDiligence.uploading'),
      showSuccessDialog: false,
      showProcessingDialogForBlockchainWrite: false,
      blockchainDescs: [this.$t('dueDiligence.uploadingToBlockchain'), this.$t('dueDiligence.beingUploadToBlockChain')],
      showBlockchainProgress: true,
      blockchainProgress: 10,
      diligenceId: Number(this.$route.params.id) || null,
      report: null,
      formattedReport: null,
      eudrSettings: null,
      productList: null,
      finalReportStep: -1,
      step: 1,
      reportStatus: '',
      validationDialog: false,
      warningDialog: false,
      hideAdditionalActions: false,
      warnings: [],
      updatedStatus: '',
      breadcrumbs: [
        {
          text: this.$t("deforestation.dueDeligence"),
          to: "/deforestation/due-diligence-reports",
        },
        {
          text: this.$t("dueDiligence.createNewReport"),
          disabled: true,
          to: "/",
        },
      ],
      tabs: [],

      tabsForSupplier: [
        {
          title: this.$t("deforestation.reportDetails"),
          number: 1,
        },
      ],
      tabsForOperator: [
        {
          title: this.$t("deforestation.reportDetails"),
          number: 1,
        },
        {
          title: this.$t("deforestation.productionPlace"),
          number: 2,
        },
        {
          title: this.$t("deforestation.locationVerification"),
          number: 3,
        },
        {
          title: this.$t("deforestation.EUDRDeforestationAssessment"),
          number: 4,
        },
      ],
      tabsForSupplierOnly: [
        {
          title: this.$t("deforestation.reportDetails"),
          number: 1,
        },
        {
          title: this.$t("deforestation.productionPlace"),
          number: 2,
        },
        {
          title: this.$t("deforestation.locationVerification"),
          number: 3,
        },
        {
          title: this.$t("deforestation.EUDRDeforestationAssessment"),
          number: 4,
        },
      ],
      productionPlaceData: [],
      EUDRAssessmentType: "",
      isConfirm: false,
      proceedToNextPage: false,
      showNoBlockchainWriteDialog: false,
      additionalInformationData: {},
      isRequiredAdditionalInformation: false,
      highestStepReached: 2,
      showShareDialog: false,
      exporterDetails: null,
    };
  },
  methods: {
    updateHighestStepReached(step) {
      if (step > this.highestStepReached) {
        this.highestStepReached = step;
      }
    },
    confirmDdsWithoutRiskAssessment() {
      this.ddsContinueWithoutRiskAssessment = true;
      this.ddsConfirmWithoutRiskAssessmentDialog = false;
      this.nextStep();
    },
    updateWarnings(warnings){
      this.warnings = warnings;
    },
    onProcessingDialogForBlockchainClose() {
      console.log("blockchin close button")
      this.showProcessingDialogForBlockchainWrite = false
      //this.$router.push({ name:"dueDiligenceReports" });
    },
    updateStep(step){
      this.step = step;
    },
    editStep(step = 3) {
      this.warningDialog = false;
      this.step = step;
    },
    updateTabs(diligenceId) {
      if (diligenceId) {
        this.getDiligenceDetail(diligenceId).then(() => this.stopLoading()).catch(() => this.stopLoading())
      }
    },
    downloadFinalReport(downloadType, pdfType) {
      const isPtsiRole = isIndonesianClient() ? "ptsi" : this.isKenyaClient ? "naccu" : "non-ptsi";
      this.warningDialog = false;
      if (downloadType == 'pdf') {
        const fileName =  `DDS-Final-Report-${this.report?.internalReferenceNumber || 'n/a'}-${this.report?.containerIds?.join('-')}.pdf`;
        this.startLoading()
        this.downloadSourceFile(`${process.env.VUE_APP_DEFORESTRATION_REPORTING_API_BASE_URL}/diligence-report/final-report-pdf/${this.diligenceId}/${pdfType}/${isPtsiRole}`,"application/pdf", fileName)
           .then(() => {
            this.stopLoading()
          }).catch(() => {
            this.stopLoading()
          })
      }

      if (downloadType == 'json') {
        this.startLoading()
        this.getFormattedJSON()
           .then(() => {
            this.stopLoading()
          }).catch(() => {
            this.stopLoading()
          })
      }
    },
    // testNoOverlaps(productionPlaces) {
    //   let polygons = [];
    //   const geoFactory = new geom.GeometryFactory();

    //   for (const productionPlace of productionPlaces) {
    //     if (productionPlace.farmType.toUpperCase() !== 'POINT') {
    //       const primaryGeofence = productionPlace.farm.GeoFences.filter((gf) => gf.isPrimary)[0].geofenceCoordinates;
    //       polygons.push({
    //         name: productionPlace.farm.farmName,
    //         polygon: primaryGeofence
    //       });
    //     }
    //   }

    //   if (polygons.length <= 1) {
    //     return [true, '', ''];
    //   }

    //   polygons = polygons.map((p) => {
    //     var coordinates = p.polygon.map(function name(coord) {
    //       return new geom.Coordinate(coord.lat, coord.log);
    //     });

    //     if(coordinates[0].compareTo(coordinates[coordinates.length-1]) != 0) 
    //         coordinates.push(coordinates[0]);

    //     var shell = geoFactory.createLinearRing(coordinates);
    //     return {
    //       name: p.name,
    //       polygon: geoFactory.createPolygon(shell)
    //     };
    //   });
      
    //   while(polygons.length > 1) {
    //     const { polygon, name } = polygons.pop();
        
    //     for (const { polygon: p, name: pname } of polygons) {
    //       if (polygon.intersects(p)) {
    //         return [false, name, pname];
    //       }
    //     }
    //   }

    //   return [true, '', ''];
    // },
    testNoDeforestationProbability(productionPlaces) {
      for (const productionPlace of productionPlaces) {
        if (['High Deforestation Probability', 'Very High Deforestation Probability'].includes(productionPlace.eudr_deforestation_status)) {
          return [false, productionPlace.farm.farmName];
        }
      }

      return [true, ''];
    },
    async validateFarms(productionPlaces, checkDeforestation = true, warnings = []) {
      this.warnings = warnings;

      // Testing overlap
      // const [hasNoOverlaps, farmName, ifarmName] = await this.testNoOverlaps(productionPlaces);
      // if (!hasNoOverlaps) {
      //   this.warnings.push(`${farmName}: Geofence overlaps with another farm ${ifarmName}`);
      // }

      // Testing deforestation high probability
      if(checkDeforestation) {
        const [ hasNoHighDeforestationProbability, defFarmName ] = this.testNoDeforestationProbability(productionPlaces);
       
        if(this.report.totalHighDeforestationProductionPlaces > 0) {
          this.warnings.push(`${this.report.totalHighDeforestationProductionPlaces} ${ this.$t('dueDiligence.productionPlacesHighDeforestationProbability')}`);
        }
        else if (!hasNoHighDeforestationProbability) {
          this.warnings.push(`${defFarmName}: ${ this.$t('dueDiligence.geofenceHighDeforestationProbability')}`);
        }
      }
      
      // Log warnings generated
      if (this.warnings.length > 0) {
        try {
          const userId = this.$store.getters.getUser?.id;
          if (userId && this.diligenceId) {
            await ActivityLogService.logDDSWarningGenerated(
              this.diligenceId, 
              userId, 
              'Farm validation', 
              `Found ${this.warnings.length} issue(s)`
            );
          }
        } catch (error) {
          console.error('Failed to log warnings generated:', error);
        }
      }
      
      return this.warnings.length === 0;
    },
    async approveReport(publishOption) {
      if(!publishOption){ return; }
      if(publishOption == '72_hour') {
        console.log(publishOption)
        //Hits 72 hour report update otherwise all ok
        this.startLoading()
        await DeforestationService.updateBlockchainPublishDate(this.diligenceId)
        await this.getDiligenceDetail(this.diligenceId);
        this.stopLoading()
        this.$notify({
          type: 'success',
          text:'Digilence Report will published after 72 hours' 
        });
        return
      }
      this.showProcessingDialogForBlockchainWrite = true;
      this.showBlockchainProgress = true;
      this.blockchainProgress = 10;
      this.hideAdditionalActions = false;
      await this.getDiligenceDetail(this.diligenceId);
      await DeforestationService.getProductionPlaces({
        diligenceReportId: parseInt(this.diligenceId),
        removed: false
      }).then(async (res) => {
        this.blockchainProgress = 15;
        const productionPlaces = res.data.productionPlaces.rows;
        const hasPassed = await this.validateFarms(productionPlaces);
        const isReportZeroWarnings = await this.getReportConcludeWarningsAndIsReportComplaint()
        const complianceStatus = (hasPassed & isReportZeroWarnings) ? 'Compliant': 'Non-Compliant';
        this.blockchainProgress = 20;
        
        // Log report approval
        try {
          const userId = this.$store.getters.getUser?.id;
          if (userId && this.diligenceId) {
            await ActivityLogService.logDDSReportApprovedByUser(this.diligenceId, userId, complianceStatus);
          }
        } catch (error) {
          console.error('Failed to log report approval:', error);
        }
        
        this.updateReportStatus(complianceStatus, hasPassed).then(async () => {
          this.blockchainProgress = 30;
          await this.generateBlockchainData(hasPassed);
        });
      });
    },
    async generateBlockchainData(hasPassed) {
      try {
        // Log blockchain upload started
        try {
          const userId = this.$store.getters.getUser?.id;
          if (userId && this.diligenceId) {
            await ActivityLogService.logDDSBlockchainUploadStarted(this.diligenceId, userId);
          }
        } catch (error) {
          console.error('Failed to log blockchain upload start:', error);
        }
        
        const response = await DeforestationService.generateBlockchainData(parseInt(this.diligenceId));
        let responseData = response.data.generateComplianceByDiligenceReportId;

        if (!responseData.success) {
          throw new Error('Failed to write deforestation data to blockchain, please try again.');
        } else {
          if (responseData.job === null) {
            // No blockchain upload job was started, as no reports available
            this.showBlockchainProgress = false;
            this.showProcessingDialogForBlockchainWrite = false;
            this.showNoBlockchainWriteDialog = true;
            return;
          }
        }
        this.blockchainProgress = 50;
        let job = responseData.job;
        let stopWaiting = false;
        const timeout = setTimeout(() => {
          stopWaiting = true;
          this.showBlockchainProgress = false;
        }, 30000) // 30 seconds to wait befores showing loading screen
        while(!stopWaiting) {
          await wait(5000);
          const response = await DeforestationService.getJob(parseInt(job.id));
          if(!response?.data || response.data?.job.status === 'Failed') {
            throw new Error('Failed to write deforestation data to blockchain, please try again.');
          }
          if(response.data.job.status === 'Completed') {
            clearTimeout(timeout);
            this.blockchainProgress = 80;
            if(this.$refs.dueDiligenceFinalComponent) {
              await this.$refs.dueDiligenceFinalComponent.fetchAllData();
            }
            this.blockchainProgress = 100;
            
            // Log blockchain upload completed
            try {
              const userId = this.$store.getters.getUser?.id;
              if (userId && this.diligenceId) {
                await ActivityLogService.logDDSBlockchainUploadCompleted(this.diligenceId, userId);
              }
            } catch (error) {
              console.error('Failed to log blockchain upload completion:', error);
            }
            
            await wait(1500);
            this.showProcessingDialogForBlockchainWrite = false;
            if (hasPassed) {
              this.showSuccessDialog = hasPassed;
            }
            break;
          }
          job = response.data.job;
          if(stopWaiting) break;
        }
      } catch (error) {
        console.error(error);
        
        // Log blockchain upload failed
        try {
          const userId = this.$store.getters.getUser?.id;
          if (userId && this.diligenceId) {
            await ActivityLogService.logDDSBlockchainUploadFailed(this.diligenceId, userId, error.message);
          }
        } catch (logError) {
          console.error('Failed to log blockchain upload failure:', logError);
        }
        
        this.$notify({
          type: 'error',
          text: this.$t('dueDiligence.failedToWriteDeforestationDataToBlockchain')
        });
      }
    },
    updateReportStatus(complianceStatus) {
      return new Promise((resolve, reject) => {
        this.startLoading()
        DeforestationService.changeStatusOfDiligenceReport({
        id: parseInt(this.diligenceId),
        status: complianceStatus
        }).then(async (response) => {
          if (['Compliant', 'Non-Compliant'].includes(complianceStatus)) {
            try {
              const cleanupResponse = await DeforestationService.removeRequestAdditionalInformationByDiligenceId(parseInt(this.diligenceId));
              console.log('Request additional information cleanup:', cleanupResponse);
            } catch (cleanupError) {
              console.error('Failed to cleanup request additional information:', cleanupError);
            }
          }

          DeforestationService.updateDiligenceReportStage({
            current_stage:4,
            reportId:parseInt(this.diligenceId)
          }).then(() => {
            this.getDiligenceDetail(parseInt(response.data.changeStatusOfDiligenceReport.id)).then(() => this.stopLoading()).catch(() => this.stopLoading())
            this.updatedStatus = complianceStatus;
            resolve(complianceStatus)
            this.$notify({
              text: this.$t('dueDiligence.updatedDueDiligenceStatus'),
              type: 'success'
            });
          }).catch(() => {
            this.stopLoading()
          })
        }).catch(err => {
          reject(err)
        }).finally(() => {
          this.stopLoading()
        });
      })
    },

    async sendToOperator() {
      this.startLoading()
      let status = 'Under Review';
      if(this.reportStatus == 'Compliant'){
        status = 'Compliant';
      }
      
      try {
        await DeforestationService.updateWhoAddsPlaceDataInDiligenceReport({
          id: parseInt(this.diligenceId),
          whoAddPlaceData: 'operator',
          status: status
        });
        
        // Log report sent to operator
        try {
          const userId = this.$store.getters.getUser?.id;
          if (userId && this.diligenceId) {
            await ActivityLogService.logDDSReportSentToOperator(this.diligenceId, userId);
          }
        } catch (error) {
          console.error('Failed to log report sent to operator:', error);
        }
        
        this.$notify({
          text: this.$t('dueDiligence.updatedDueDiligenceReport'),
          type: 'success'
        });
        this.$router.push({name:'dueDiligenceReports'})
      } catch (error) {
        console.error('Failed to send report to operator:', error);
        this.$notify({
          text: this.$t('dueDiligence.failedToSendReportToOperator'),
          type: 'error'
        });
      } finally {
        this.stopLoading()
      }
    },
    updateEUDRAssessmentType(value) {
      this.EUDRAssessmentType = value;
    },
    additionalInformationTabs() {
      const finalReportTab = {
        title: this.$t("deforestation.finalReport"),
        number: this.tabs[this.tabs.length - 1].number,
      };
      if (this.additionalInformationData.shareAccess === "shareSpecificStep") {
        this.tabs = this.tabs.filter((operatorTab, index) =>
          index === 0 || this.additionalInformationData?.selectedStep.some(tab => tab.number === operatorTab.number)
        );
      } else {
        this.tabs = this.tabsForOperator
      }
      this.tabs = [...this.tabs, finalReportTab];
      return this.tabs;
    },
    setTabs(whoAddPlaceData ='operator') {
        if (whoAddPlaceData == 'operator' || this.report?.whoAddPlaceData == null) {
            this.tabs = this.tabsForOperator;
            return this.tabsForOperator;
          } else if (this.userRole == 'supplier') {
            this.tabs = this.tabsForSupplierOnly;
            return this.tabsForSupplierOnly
          } else if (this.report.status == 'Pending' || this.report.status == null) {
            this.tabs = this.tabsForSupplier;
            return this.tabsForSupplier
          }else {
            this.tabs = this.tabsForOperator;
            return this.tabsForOperator
        }
    },

    setDynamicTabValue(initialTabs) {
      if (this.report?.whoAddPlaceData == 'operator' || this.report?.whoAddPlaceData == null || this.report?.whoAddPlaceData=="supplier") {
        let finalNumber = 4;

        if(this.report?.enableRegionalRiskAssessment) {
          finalNumber++;
          initialTabs = [...initialTabs, {
            title: this.$t("deforestation.regionalRiskAssessment"),
            number: finalNumber,
          }]
        }

        const newtabs = this.report.diligenceReportAssessment.map((item, index) => {
          return {
            title: item.assessment.title,
            number: finalNumber + (index + 1)
          };
        });
        this.finalReportStep = finalNumber + (this.report.diligenceReportAssessment.length + 1);
        const finalTab = {
          title: this.$t("deforestation.finalReport"),
          number: finalNumber + this.report.diligenceReportAssessment.length + 1
        }
        if (this.reportStatus === 'Compliant' && this.userRole === 'operator') {
          this.step = this.finalReportStep;
         }
         this.tabs = [...initialTabs, ...newtabs, finalTab];
      }
    },
    
    getProductList() {
      return DeforestationService.getProductList().then(res => {
          const productList = res.data.deforestationProductList;
          this.productList = productList;
      }).catch(err => {
          //this.loading = false
          console.log('Error', err)
      })   
    },

    getEudrSettings() {
      return DeforestationService.getEudrSettings().then(res => {
          this.eudrSettings = res.data.eudrSetting;
      }).catch(() => {
          this.$notify({
              text: this.$t('dueDiligence.failedToFetchSettings'),
              type: 'error',
              duration:10000
          })
      });
    },

    handleEmptyUser(user) {
      return user ?? {
        firstName: 'N/A',
        lastName: '',
        countryId: 'N/A',
        mobile: 'N/A',
        email: 'N/A',
        isoCode: 'N/A',
        eori_number: 'N/A'
      };
    },
    async getFormattedJSON() {
      const {
          totalPolygon,
          totalArea,
          totalPoint,
          totalHighDeforestationCount,
          totalNumberOfFarms,
          lowZeroRiskFarm,
          highRiskFarmArea,
          totalLowZeroFarmArea,
          productionPlaces
      } = await DeforestationService.getSummaryDDS(parseInt(this.diligenceId));

      const {
          totalDeforestationAssessments,
          totalRiskAssessmentCount,
          product,
          productCommonName,
          productScientificName,
          productVolume,
          productNetMass,
          supplier,
          operator,
          activity,
          EUDRReferenceNumber,
          countryOfEntry,
          countryOfActivity,
          status
      } = this.formattedReport;

      const report_summary = {
          total_no_of_polygons: totalPolygon,
          total_no_of_points: totalPoint,
          total_no_of_deforestation_assessments: totalDeforestationAssessments,
          total_no_of_risk_assessments: totalRiskAssessmentCount,
          total_no_of_farms: totalNumberOfFarms,
          total_no_of_high_deforestation_assessments: totalHighDeforestationCount,
          total_no_of_low_and_zero_risk_farms: lowZeroRiskFarm,
          total_area: totalArea,
          average_geofence_area: 'N/A',
          total_area_of_high_risk_farm: highRiskFarmArea,
          total_area_of_low_and_zero_risk_farm: totalLowZeroFarmArea
      };

      const product_details = {
          product_name: product,
          net_mass: productNetMass,
          volume: productVolume,
          common_name: productCommonName,
          scientific_name: productScientificName
      };

      const formattedJSONReport = {
          document_id: 'N/A',
          eudr_reference_number: EUDRReferenceNumber,
          activity: activity,
          country_of_activity: countryOfActivity,
          country_of_entry: countryOfEntry,
          due_diligence_report_status: status,
          container_id: 'N/A',
          supplier_data: supplier,
          operator_data: operator,
          report_summary,
          product_details,
          production_places: productionPlaces
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(formattedJSONReport));
      const reportDownloadElement = document.createElement("a");
      reportDownloadElement.setAttribute("href", dataStr);
      reportDownloadElement.setAttribute("download", `diligence-report-${this.diligenceId}.json`);
      document.body.appendChild(reportDownloadElement);
      reportDownloadElement.click();
      reportDownloadElement.remove();
    },

    async getDiligenceDetail(diligenceId) {
      return new Promise((resolve, reject) => {
        DeforestationService.getDiligenceDetail(parseInt(diligenceId))
          .then(async (res) => {
            if (res.errors && res.errors.length > 0) {
              const error = res.errors[0];
              const errorMessage = error.message || this.$t("dueDiligence.anErrorOccurred");

              this.$notify({
                text: errorMessage,
                type: "error",
              });
            }

            const report = res.data.getDiligenceDetail;

            if(report?.ddsReportExporter?.exporter_cf_id){
              this.getExporterDetailsById(report.ddsReportExporter?.exporter_cf_id)
            }

            let selectedProduct = null;
            if (report.product) {
                selectedProduct = this.productList?.find(p => p.id == report.product)?? 'N/A';
            }

            this.fetchedWarnings = res?.data?.getDiligenceDetail?.riskWarnings || [];

            let reportDetail = {
                //supplier: {},
                whoAddPlaceData: report?.whoAddPlaceData,
                assessment: {
                    selectedCountries: [],
                    assessments: [],
                },

                supplier: this.handleEmptyUser(report.supplier),
                operator: this.handleEmptyUser(report.operator),
                status: report.status,
                statusLegends: report.statusLegends,
                companyID: report.companyID,
                EUDRReferenceNumber: report.EUDRReferenceNumber,
                internalReferenceNumber: report.internalReferenceNumber,
                activity: report.activity,
                countryOfEntry: report.countryOfEntry,
                countryOfActivity: report.countryOfActivity,
                containerIds:report?.containerIds || [],

                product: (report.product) ? selectedProduct.name : 'N/A',
                productDescription: report.productDescription,
                productNetMass: UnitService.fromBase.weight(this.eudrSettings?.product_mass_unit, report?.productNetMass),
                productVolume: UnitService.fromBase.volume(this.eudrSettings?.volume_unit, report?.productVolume),
                productScientificName: report.productScientificName,
                productCommonName: report.productCommonName,
                polygonProductionPlaces: report.polygonProductionPlaces,
                pointProductionPlaces: report.pointProductionPlaces,
                totalArea: report.totalArea,
                totalProductionPlaces: report.totalProductionPlaces,
                totalHighDeforestationProductionPlaces: report.totalHighDeforestationProductionPlaces,
                totalDeforestationAssessments: report.totalDeforestationAssessments,
                is_report_concluded:report?.is_report_concluded,
                is_dds_status_update:report?.is_dds_status_update,
                reportAdditionalInformation: report?.requestAdditionalInformation || [],
            };

            this.selectedAssessments = report.requiredAssessment;
            reportDetail.assessment.assessments = report.requiredAssessment;
            reportDetail.assessment.selectedAssessments = report.requiredAssessment.map(assessment => (assessment.assessment));

            reportDetail.assessment.selectedCountries = report.assessmentCountries;

            const updatedDiligenceDetail = Object.assign({}, this.report, reportDetail);
            this.report = updatedDiligenceDetail;

            const diligenceDetails = report;
            this.report = diligenceDetails;
            this.formattedReport = Object.assign({}, this.report, reportDetail);
            this.reportStatus = this.report.status;

            const tabs = this.setTabs(this.report?.whoAddPlaceData);
            this.setDynamicTabValue(tabs)
            if(this.isRequiredAdditionalInformation) {
              this.additionalInformationTabs();
            } 
            // SET IN VUEX STORE;
            this.$store.commit('eudrDDS/SET_DILIGENCE_DETAILS', diligenceDetails);

            resolve('active')
          })
          .catch((err) => {
            this.$notify({
              text: err,
              type: "error",
            });
            reject('not-loaded')
          })
      })
    },
    setDiligenceId(id) {
      this.diligenceId = parseInt(id);
      this.$router.push({ name: "createDueDiligenceReports", params: { id } });
    },
    fetchUpdatedProductionPlaceData(item) {
      this.productionPlaceData = item;
    },
    fetchStep3WarningData(item){
      this.step3Warning = item
    },

    checkTabFunctionByProductionPlace(reportId) {
      return new Promise((resolve, reject) => {
        DeforestationService.checkProductionPlacesFromDueDiligenceRport(reportId).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    async changeStep(step) {
      if(step > 4) await this.calculateWarningsForDeforestationAssessment(this.diligenceId, step);
      //const currentStep  = this.step
      if (step > 1 && !this.diligenceId) {
        this.$notify({
          type: "error",
          text: this.$t('dueDiligence.pleaseCompleteBeforeProceedingToNext')
        });
        return;
      }
      if (step > 2) {
        this.startLoading()
        this.checkTabFunctionByProductionPlace(this.diligenceId).then((res) => {
          if (res.data.checkProductionPlaceFromReportId.count) {
            this.step = step;
            this.updateHighestStepReached(step); // update highest step reached
          }
          this.stopLoading()
        }).catch(() => {
          this.$notify({
            type: "error",
            text: this.$t('dueDiligence.pleaseAddProductionPlacesData')
          });
          this.stopLoading()
        })
        return
      }

      if (step == 4) {
        return;
      }

      this.step = step;
      this.updateHighestStepReached(step); // update highest step reached
    },


    closeValidationDialog() {
      this.validationDialog = false;
    },
    async saveAndContinueLater() {
      const redirectToDiligenceReportList = async (step) => {
        if (step !== 1) {
          this.$store.dispatch('SET_DDS_CURRENT_TAB_TO_DB', {
            step: step,
            reportId: Number(this.diligenceId)
          }).then(() => { })
        }
        
        // Log progress saved
        try {
          const userId = this.$store.getters.getUser?.id;
          if (userId && this.diligenceId) {
            const stepNames = {
              1: 'Report Details',
              2: 'Production Place',
              3: 'Location Verification',
              4: 'EUDR Assessment',
              5: 'Regional Risk Assessment'
            };
            
            const stepName = stepNames[step] || `Step ${step}`;
            await ActivityLogService.logDDSReportSaved(this.diligenceId, userId, step, stepName);
          }
        } catch (error) {
          console.error('Failed to log progress saved:', error);
        }
        
        this.$router.push({ name: "dueDiligenceReports" })
      }
      
      try {
        if (this.step === 1) {
          const reportDetailsSuccess = await this.$refs.reportDetailsComponent.triggerSubmit('save');
          if (reportDetailsSuccess) {
            await redirectToDiligenceReportList(1);
          }
        } else if (this.step === 2) {
          await this.$refs.productionPlaceComponent.triggerSubmit();
          await redirectToDiligenceReportList(2)
        } else if (this.step === 3) {
          await this.$refs.locationVerificationComponent.triggerSubmit();
          await redirectToDiligenceReportList(3)
        } else if (this.step == 4) {
          await this.$refs.eudrAssessmentComponent.triggerSubmit();
          await redirectToDiligenceReportList(4)
        }
      } catch (error) {
        this.$notify({
          type: "error",
          text: this.$t("dueDiligence.failedSavedProgress"),
        });
      }
    },
    async incrementStepData() {
      if (this.isRequiredAdditionalInformation) {
        const currentIndex = this.tabs.findIndex(tab => tab.number === this.step);
        if (currentIndex >= 0 && currentIndex < this.tabs.length - 1) {
          this.step = this.tabs[currentIndex + 1].number;
        } else if (currentIndex === -1) {
          this.step = this.tabs[this.tabs.length - 1]?.number;
        }
        return;
      }
      
      // Log step completion
      try {
        const userId = this.$store.getters.getUser?.id;
        if (userId && this.diligenceId) {
          const stepNames = {
            1: 'Report Details',
            2: 'Production Place',
            3: 'Location Verification',
            4: 'EUDR Assessment',
            5: 'Regional Risk Assessment'
          };
          
          // Log specific step completion based on the current step
          const currentStepName = stepNames[this.step] || `Step ${this.step}`;
          switch (this.step) {
            case 1:
              // Report creation is logged in ReportDetails.vue when the API call is made
              break;
            case 2:
              await ActivityLogService.logDDSProductionPlaceUpdated(
                this.diligenceId, 
                userId, 
                'Production places', 
                'Production place configuration completed'
              );
              break;
            case 3:
              // Location verification completion is already logged in LocationVerification.vue
              break;
            case 4: {
              // Get issue count from warnings if available
              const issueCount = this.warnings ? this.warnings.length : 0;
              await ActivityLogService.logDDSEUDRDeforestationAnalysisCompleted(
                this.diligenceId, 
                userId, 
                issueCount
              );
              break;
            }
            case 5:
              await ActivityLogService.logDDSRegionalRiskCriteriaUpdated(
                this.diligenceId, 
                userId, 
                'Regional Risk Assessment', 
                'Not configured', 
                'Configured'
              );
              break;
            default:
              // Fallback for any additional steps
              console.log(`Step ${this.step} (${currentStepName}) completed`);
              break;
          }
        }
      } catch (error) {
        console.error('Failed to log step completion:', error);
      }
      
      this.step++;
    },
    async nextStep() {
      if ((this.$refs.reportDetailsComponent?.selectedAssessments.length <= 1) && this.ddsContinueWithoutRiskAssessment === false) {
        this.ddsConfirmWithoutRiskAssessmentDialog = true;
        return;
      }
      this.ddsContinueWithoutRiskAssessment = false;
      try {
        switch (this.step) {
          case 1: {
            const reportDetailsSuccess = await this.$refs.reportDetailsComponent.triggerSubmit();
              if (reportDetailsSuccess) {
                await this.incrementStepData();
              }
            break;
          }
          case 2: {
            const status = await this.$refs.productionPlaceComponent.triggerSubmit();
            if (status) {
              await this.incrementStepData();
            }
            else {
              return;
            }
            break;
          }
          case 3: {
            if (
              !this.eudrSettings || 
              !this.eudrSettings?.dynamicExpiryTime || 
              !this.eudrSettings?.dynamicExpiryTimePeriod || 
              !this.eudrSettings?.product_mass_unit || 
              !this.eudrSettings?.radius_max_limit || 
              !this.eudrSettings?.radius_unit
            ) { 
              this.$notify({
                 title: this.$t("deforestation.failedEudrReportDueSetting"),
                 type: "error",
                 duration: 10000,
                })
                return
            }
            const locationVerificationData = this.$refs?.locationVerificationComponent?.deforestationComplianceReports || [];
            const isDataUpdated = locationVerificationData.some(item =>
              item.diligenceReportProductionPlaceArray.some(place => place.isEdit === true)
            );
            if (isDataUpdated && !this.isConfirm) {
              this.$refs.locationVerificationComponent.showLocationModified = true;
              return;
            }
            const { warnings } = await this.$refs.locationVerificationComponent.triggerSubmit();
            const isRiskWarning = warnings.length > 0 ? true : false;
            this.startLoading();
            const res = await DeforestationService.getProductionPlaces({
              diligenceReportId: parseInt(this.diligenceId),
              removed: false
            });
            
            const productionPlaces = res.data.productionPlaces.rows;
            const hasPassed = await this.validateFarms(productionPlaces, false, warnings);
            this.stopLoading();
            if (!isDataUpdated || (isDataUpdated && this.proceedToNextPage)) {
              if(hasPassed && !isRiskWarning) {
                await this.incrementStepData();
              } else {
                this.hideAdditionalActions = true;
                if(this.dontAskAgain){
                  await this.incrementStepData();
                }
                else if(isRiskWarning ){
                  this.warningDialog = true;
                }
                else{
                  await this.incrementStepData();
                }
              }
          }
          
            break;
          }
          case 4: {
            this.startLoading();
            //await this.handleEudrCompliantStatusUpdate()
            let risk = await this.calculateWarningsForDeforestationAssessment(this.diligenceId)?.totalHighDeforestationProductionPlaces || 0;
              if(risk > 0){
                    this.warningDialog = true;
              }else {
                const status = await this.$refs.eudrAssessmentComponent.triggerSubmit();
                if (status) {
                  await this.incrementStepData();
                }
              }
              this.stopLoading();
            break;
          }
          default: {
            if(this.report?.enableRegionalRiskAssessment && this.step == 5) {
              await this.incrementStepData();
              break;
            }

            // handle dynamic risk assessment steps
            const riskAssessmentIndex = this.step - (this.report?.enableRegionalRiskAssessment ? 6 : 5);
            const riskAssessmentRef = this.$refs[
              `riskAssessmentComponent-${riskAssessmentIndex}`
            ][0];
            if (riskAssessmentRef) {
              if(!riskAssessmentRef.currentRiskAssessmentStatus && (riskAssessmentRef.productionPlaces).length > 0) {
                this.$notify({
                 title: 'Risk Assessment Status is Required',
                 type: "error",
                })
                return
              }
              const riskWarnings = (await this.calculateWarningsForDeforestationAssessment(this.diligenceId, this.step + 1))?.riskWarnings || [];
              const currentAssessment = this.getAssessmentByStep(this.step);
              let risk = 0;
              if (Array.isArray(riskWarnings) && currentAssessment && typeof currentAssessment.id !== 'undefined') {
                risk = riskWarnings.find(warning => warning.id === currentAssessment.id) || 0;
              }
              if(risk && risk.count > 0){
                    this.warningDialog = true;
              }else{
                const riskAssessmentSuccess = await riskAssessmentRef.triggerSubmit();
                if (riskAssessmentSuccess) {
                  await this.incrementStepData();
                }
              }
            }
            break;
          }
        }
      } catch (error) {
        console.error(error);
        this.$notify({
          type: "error",
          text: error.message || this.$t('dueDiligence.unExpectedErrorMsg'),
        });
      }
    },
    increaseStep() {
      this.incrementStepData();
    },
    async handleEudrCompliantStatusUpdate() {
        const isReportZeroWarnings = await this.getReportConcludeWarningsAndIsReportComplaint()
        const complianceStatus = isReportZeroWarnings ? 'Compliant': 'Non-Compliant';
        console.log("status updated",complianceStatus)
        this.updateReportStatus(complianceStatus).then(async () => {
          console.log("status updated")
        });
    },
    async handleRiskWarningAction({ action, dontAskAgain }){
          if (dontAskAgain) {
            localStorage.setItem('hideRiskWarning', 'true');
          }
          if(action){
             await this.incrementStepData();
          }
          this.warningDialog = false;
    },
    confirmLocationVerification(val) {
      if(val && this.$refs.locationVerificationComponent.showLocationModified){
        this.isConfirm = true;
      }else{
        this.isConfirm = false;
      }
      this.nextStep();
    },
    resetLocationVerification() {
      this.isConfirm = false;
    },
    confirmProceedToNextPage(val) {
      this.proceedToNextPage = val;
    },
    async calculateWarningsForDeforestationAssessment(diligenceId, step = this.step) {
      this.startLoading();
      this.warnings = [];
      try {
        const fetchDiligenceDetail = await DeforestationService.getDiligenceDetail(diligenceId);
        const riskAssessments = get(fetchDiligenceDetail, 'data.getDiligenceDetail.requiredAssessment', []);
        if(!riskAssessments.length) this.warnings.push(this.$t('dueDiligence.noAssessmentWarning'));

        const hasPassedEudrDeforestationTab = step >= 4;
        let totalHighDeforestationProductionPlaces = 0;
        if(hasPassedEudrDeforestationTab) {
          totalHighDeforestationProductionPlaces = get(fetchDiligenceDetail, 'data.getDiligenceDetail.totalHighDeforestationProductionPlaces', 0);
          const highDeforestationWarningMessage = `${this.$t('dueDiligence.productionPlacesHighDeforestationProbability')}`;
          const key = `warnings_${diligenceId}`;

          // Remove all past warnings from localStorage
          Object.keys(localStorage).forEach(storageKey => {
            if (storageKey.startsWith('warnings_') && storageKey !== key) {
              localStorage.removeItem(storageKey);
            }
          });

          if (totalHighDeforestationProductionPlaces > 0) {
            this.warnings.push(`${totalHighDeforestationProductionPlaces} ${highDeforestationWarningMessage}`);
          }
          else{
             // Retrieve, filter, and update localStorage to remove only specific warning message
            let storedWarnings = JSON.parse(localStorage.getItem(key)) || [];
            storedWarnings = storedWarnings.filter(warning => !(typeof warning === 'string' && warning.includes(highDeforestationWarningMessage)));
  
            // Update or remove the localStorage item based on remaining warnings
            if (storedWarnings.length > 0) {
              localStorage.setItem(key, JSON.stringify(storedWarnings));
            } else {
              localStorage.removeItem(key);
            }
            this.warnings = this.warnings.filter(warning => !(typeof warning === 'string' && warning.includes(highDeforestationWarningMessage)));
          }
        }

        const nonApprovedWarningMsg = `${this.$t('dueDiligence.riskAssessmentNotApproved')}`;
        const riskWarnings = get(fetchDiligenceDetail, 'data.getDiligenceDetail.riskWarnings', []).map(warning => {
          return {
            ...warning,
            message: `${warning.assessmentName}: ${warning.count} ${nonApprovedWarningMsg}`,
          }
        });
        if(riskWarnings.length) {
          const riskWarningsForCurrentTab = riskWarnings.filter(warning => {
            const warningStep = this.getStepByAssessment(warning.id, get(fetchDiligenceDetail, 'data.getDiligenceDetail'));
            return typeof warningStep === 'number' && step >= warningStep;
          });
          this.warnings.push(...riskWarningsForCurrentTab);
        }

        this.fetchedWarnings = riskWarnings;

        return {
          totalHighDeforestationProductionPlaces,
          riskWarnings,
        };
      } catch (error) {
        console.error('Error calculating warnings for deforestation assessment:', error);
        return 0;
      }
      finally{
        this.stopLoading();
      }
    },

    getAssessmentByStep(step, report = this.report) {
      if(step <= 4) return null;
      return report.requiredAssessment[step - this.report?.enableRegionalRiskAssessment ? 6 : 5];
    },

    getStepByAssessment(assessmentId, report = this.report) {
      const assessmentIdx = report.requiredAssessment.findIndex(assessment => assessment.id == assessmentId);
      if(assessmentIdx !== -1) return assessmentIdx + this.report?.enableRegionalRiskAssessment ? 6 : 5;
      return null;
    },
    gotoTab(tabName) {
      this.step = this.tabs.find(tab => tab.title === tabName).number;
    },
    async loadAdditionalInformation() {

        await this.$store.dispatch('eudrDDS/setDDSAdditionalInformationByDiligenceId', {
          ddrId: parseInt(this.diligenceId)
        });
        const payload = {
          ddrAdditionalInformationId: parseInt(this.getLatestAdditionalInformation?.id, 10),
        };
        await this.$store.dispatch('eudrDDS/setDdsAdditionalInformationData', payload);
        this.additionalInformationData = this.$store.getters["eudrDDS/getDdsAdditionalInformationData"];
    },

    async getReportConcludeWarningsAndIsReportComplaint() {
      const warnings  =  await DeforestationService.concludeDiligenceReportByStatusWarnings(this.diligenceId)
      const warningConclusion = Object.values(warnings.data.concludeDigilienceReportStatus)
      return warningConclusion.every(x => x ==0)
    },
    confirmShare() {
      this.$notify({
        text: this.$t('dueDiligence.reportSharedSuccessfully'),
        type: "success",
      });
      this.closeShareDialog();
      this.$router.push({name:'dueDiligenceReports'})
    },
    
    async shareReportToExporter(){
      this.showShareDialog = true;
      
      // Log report shared with exporter
      try {
        const userId = this.$store.getters.getUser?.id;
        if (userId && this.diligenceId) {
          await ActivityLogService.logDDSReportSharedWithExporter(this.diligenceId, userId);
        }
      } catch (error) {
        console.error('Failed to log report shared with exporter:', error);
      }
    },

    async getExporterDetailsById(exporterId) {
      try {
        const user = await UserService.getUserDetails(exporterId);
        if (user && user.data) {
          this.exporterDetails = {
            id: user.data.id,
            name: user.data.firstName + " " + user.data.lastName,
            email: user.data.email,
            phoneNumber: user.data.mobile || user.data.phoneNumber,
            country: user.data.countryId,
            status: user.data.active ? "Registered" : "Unregistered"
          };
        } else {
          console.error("Exporter details not found");
        }
      } catch (error) {
        console.error("Error fetching exporter details:", error);
        this.$notify({
          text: this.$t('deforestation.errorFetchingExporterDetails'),
          type: "error",
        });
      }
    },
    
    closeExporterDetailsDialog() {
      this.showExporterDetailsDialog = false;
    },
    
    closeShareDialog() {
      this.showShareDialog = false;
    },
  },
  mixins: [loadingMixin, monkey, DownloadMixin],
};
</script>

<style scoped></style>