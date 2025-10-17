<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid class="px-6 py-0">
      <div class="d-flex">
        <h2>{{ $t('dueDiligence.dueDiligenceReportCreation') }}</h2>
        <v-spacer></v-spacer>
        <ActionButton
          @saveAndContinueLater="saveAndContinueLater"
          @nextStep="nextStep"
        />
      </div>

      <v-card elevation="0" class="px-5 mt-7">
        <v-card-text>
          <CustomTab @changeStep="changeStep" :tabs="tabs" :activeTab="step" />
          <v-divider class="mt-5"></v-divider>
          <ReportDetails
            ref="reportDetailsComponent"
            :diligenceId="diligenceId"
            v-if="step == 1"
          />
          <ProductionPlace
            ref="productionPlaceComponent"
            :diligenceId="diligenceId"
            v-if="step == 2"
          />
          <locationVerification
            ref="locationVerificationComponent"
            :diligenceId="diligenceId"
            v-if="step == 3"
            @fetchUpdatedProductionPlaceData="fetchUpdatedProductionPlaceData"
          />

          <EUDRAssessmentReport
            ref="eudrAssessmentComponent"
            :diligenceId="diligenceId"
            :updatedProductionPlaces="productionPlaceData"
            v-if="step == 4"
          />

          <RiskAssessment
            ref="riskAssessmentComponent"
            :diligenceId="diligenceId"
            v-if="step == 5"
          />

          <DueDiligenceFinalReport
            ref="dueDiligenceFinalComponent"
            :diligenceId="diligenceId"
            v-if="step == 7"
          />
        </v-card-text>
      </v-card>

      <v-card elevation="0" class="px-5 mt-7">
        <v-card-text>
          <template>
            <div class="text-right">
              <ActionButton
                @saveAndContinueLater="saveAndContinueLater"
                @nextStep="nextStep"
              />
            </div>
          </template>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import Breadcrumb from "@/components/core/Breadcrumb";
import ReportDetails from "./tabs/ReportDetails.vue";
import ProductionPlace from "./tabs/ProductionPlace.vue";
import CustomTab from "./components/CustomTab.vue";
import ActionButton from "./components/ActionButton.vue";
import locationVerification from "./tabs/LocationVerification.vue";
import EUDRAssessmentReport from "./tabs/EUDRDeforestationAssessment.vue";
import RiskAssessment from "./tabs/RiskAssessment.vue";
import DueDiligenceFinalReport from "./tabs/DueDeligenceFinalReport.vue";
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
    DueDiligenceFinalReport,
  },
  computed: {},
  watch: {},
  async mounted() {
    this.diligenceId = Number(this.$route.params.id) || null;
  },

  data() {
    return {
      diligenceId: Number(this.$route.params.id) || null,
      step: 1,
      validationDialog: false,
      breadcrumbs: [
        {
          text: this.$t("deforestation.dueDeligence"),
          disabled: true,
          to: "/",
        },
        {
          text: this.$t("dueDiligence.createNewReport"),
          disabled: true,
          to: "/",
        },
      ],

      tabs: [
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
        {
          title: this.$t("deforestation.riskAssessment"),
          number: 5,
        },
        {
          title: this.$t("deforestation.legalInformation"),
          number: 6,
        },
        {
          title: this.$t("deforestation.finalReport"),
          number: 7,
        },
      ],
      productionPlaceData:[]
    };
  },
  methods: {
    setDiligenceId(id) {
      this.diligenceId = parseInt(id);
      this.$router.push({ name: "createDueDiligenceReports", params: { id } });
    },
    fetchUpdatedProductionPlaceData(item){
      this.productionPlaceData = item;
    },
    changeStep(step) {
      if (step > 1 && !this.diligenceId) {
        this.$notify({
          type: "error",
          text: this.$t('dueDiligence.pleaseCompleteBeforeProceedingToNext')
        });
        return;
      }
      if(step == 4){ // disabled the tab for EUDR deforestation tab;
        return;
      }
      this.step = step;
    },
    closeValidationDialog() {
      this.validationDialog = false;
    },
    async saveAndContinueLater() {
      try {
        if (this.step === 1) {
          await this.$refs.reportDetailsComponent.triggerSubmit();
        } else if (this.step === 2) {
          await this.$refs.productionPlaceComponent.triggerSubmit();
        }
        this.$notify({
          type: "success",
          text: this.$t('dueDiligence.progressSavedSuccessMsg'),
        });
      } catch (error) {
        this.$notify({
          type: "error",
          text: this.$t("dueDiligence.failedSavedProgress"),
        });
      }
    },

    async nextStep() {
      try {
        switch (this.step) {
          case 1: {
            const reportDetailsSuccess = await this.$refs.reportDetailsComponent.triggerSubmit();
            if (reportDetailsSuccess) {
              this.diligenceId = Number(this.$route.params.id);
              this.step++;
            } else {
              this.$notify({
                type: "error",
                text: this.$t("dueDiligence.failedToCreateReportDetails"),
              });
            }
            break;
          }
          case 2: {
            if (this.diligenceId) {
              const status = await this.$refs.productionPlaceComponent.triggerSubmit();
              if(!status){
                return;
              }
              this.step++;
            }
            break;
          }
          case 3: {
            if (this.diligenceId) {
              await this.$refs.locationVerificationComponent.triggerSubmit();
              this.step++;
            }
            break;
          }
          default: {
            this.step++;
            break;
          }
        }
      } catch (error) {
        this.$notify({
          type: "error",
          text: error.message || this.$t('dueDiligence.unExpectedErrorMsg'),
        });
      }
    },
  },
};
</script>

<style scoped></style>
