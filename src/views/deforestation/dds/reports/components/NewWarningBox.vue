<template>
  <v-card outlined class="pa-2 my-4" style="background-color: #fff8e1" v-if="showWarningBox()"> 
    <v-row class="warning-header" align="center" @click="toggleExpand">
      <v-col cols="auto" class="mx-3">
        <h2 style="color:black;">
          {{ $t("deforestation.complianceRiskWarnings") }} ({{ warningCount }})
          <v-tooltip top color="00BD73" max-width="350">
            <template v-slot:activator="{ on, attrs }">
              <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                mdi-alert-circle
              </v-icon>
            </template>
            <span>{{ $t("deforestation.complianceRiskWarningsInfo") }}</span>
          </v-tooltip>
        </h2>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="auto">
        <v-btn icon>
          <v-icon>{{ isExpanded ? "mdi-menu-up" : "mdi-menu-down" }}</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-expand-transition>
      <div v-show="isExpanded">
        <ul class="ma-3">
          <li v-for="(warning, index) in getWarnings" :key="index">
            <p> <span class="warning-title" @click="gotoTab(warning.assessmentName)">{{ warningTitle(warning.assessmentName) }}
                :</span> <span>{{ warning.count }}</span> <span>{{ $t("deforestation.issueFound") }}</span></p>
          </li>
        </ul>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>
export default {
  props: {
    step: {
      type: Number,
      required: true,
    },
    highestStepReached:{
      type:Number,
      required:true
    },
    diligenceId: {
      required: false,
      type: Number,
    }
  },
  computed: {
    warningCount() {
      return this.getWarnings?.reduce((acc, warning) => acc + warning.count, 0);
    },
    currentReportDetail(){
      return this.$store.getters["eudrDDS/getDiligenceDetails"]
    },
    getWarnings() {
      const warnings = this.currentReportDetail?.riskWarnings;
      let filteredWarnings = [];
      const stepToCheck = Math.max(this.step, this.highestStepReached);

      for (let step = 2; step <= stepToCheck; step++) {
        const stepWarnings = warnings?.filter(warning => warning.currentStep === step);
        if (stepWarnings?.length > 0) {
          filteredWarnings = filteredWarnings?.concat(stepWarnings.slice(0, 1));
        }
      }
      // Check if the actual step is in the filtered warnings
      const actualStepInWarnings = filteredWarnings?.some(warning => warning.currentStep === this.step);
      if (!actualStepInWarnings) {
        filteredWarnings = filteredWarnings?.filter(warning => warning.currentStep <= stepToCheck);
      }
      return filteredWarnings;
    }
  },
  data() {
    return {
      isExpanded: false,
    };
  },

  methods: {
     showWarningBox() {
      return this.getWarnings && this.getWarnings?.length > 0 && this.step !== 1 && this.step !== 2 && this.currentReportDetail?.enableOnScreenRiskWarnings;
    },
    warningTitle(assessmentName) {
      if(assessmentName === 'Location Verification'){
        return this.$t(`deforestation.locationVerification`);
      } else if(assessmentName === 'EUDR Deforestation Assessment'){
        return this.$t(`deforestation.EUDRDeforestationAssessment`);
      }
      return assessmentName;
    },
    toggleExpand() {
      this.isExpanded = !this.isExpanded;
    },

    getWarningMessage(warning) {
      if(typeof warning === 'object') return warning.message;
      return warning;
    },
    gotoTab(tabName) {
      this.$emit('gotoTab', tabName);
    }
  },
};
</script>
<style scoped lang="scss">
.warning-title {
  font-size: 16px;
  font-weight: 700;
  text-decoration: underline ;
  color: var(--primary-color);
  text-transform: capitalize;
  cursor: pointer;
}
.warning-header{
  cursor: pointer;
}
.info-icon{
  margin-left: 10px;
  margin-bottom: 10px;
}
</style>