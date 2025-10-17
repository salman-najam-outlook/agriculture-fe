<template>
  <div>
    <div v-if="(countryOfActivity && countryOfActivity.length > 0)">
      <RegionalRiskSummary 
        :countryOfActivity="countryOfActivity" 
        :enableRiskAssessmentCriteria="enableRiskAssessmentCriteria"
        :diligenceId="diligenceId"
        :disregardSegmentData="disregardSegmentData"
        @update-enable-criteria="updateEnableCriteria"
        @update-enable-protected="updateEnableProtected"
      />
    </div>
    <div v-if="enableProtectedAndIndigenousAreas && (countryOfActivity && countryOfActivity.length > 0)" >
      <IndigenousAndProtectedAreas :diligenceId="diligenceId" :countryOfActivity="countryOfActivity"  />
    </div>
  </div>
</template>

<script>
import IndigenousAndProtectedAreas from "./partials/IndigenousAndProtectedAreas.vue";
import RegionalRiskSummary from "./partials/RegionalRiskSummary.vue";
import loading from "@/mixins/LoadingMixin";
import DeforestationService from "@/_services/DeforestationService";
import ActivityLogService from "@/_services/ActivityLogService";

export default {
  components: {
    RegionalRiskSummary,
    IndigenousAndProtectedAreas,
  },
  props: {
    diligenceId: {
      required: true,
    },
  },

  async mounted() {
    this.startLoading();
    if (this.diligenceId) {
      await this.getDiligenceDetail(this.diligenceId);
    }
    this.stopLoading();
  },

  data() {
    return {
      countryOfActivity: null,
      enableRiskAssessmentCriteria: true,
      enableProtectedAndIndigenousAreas: true,
      disregardSegmentData: [],
    };
  },

  methods: {
    async getDiligenceDetail(diligenceId) {
      try {
        const res = await DeforestationService.getDiligenceDetail(parseInt(diligenceId));
        if (res.errors && res.errors.length > 0) {
          const error = res.errors[0];
          const errorMessage = error.message || this.$t("dueDiligence.anErrorOccurred");
          this.$notify({
            text: errorMessage,
            type: "error",
          });
          return;
        }

        if (res.data.getDiligenceDetail) {
          const detail = res.data.getDiligenceDetail;
          this.countryOfActivity = detail.countryOfProduction || null;
          this.enableRiskAssessmentCriteria = detail.enableRiskAssessmentCriteria;
          this.enableProtectedAndIndigenousAreas = detail.enableProtectedAndIndigenousAreas;

          this.disregardSegmentData = [
            { enableRiskAssessmentCriteria: this.enableRiskAssessmentCriteria },
            { enableProtectedAndIndigenousAreas: this.enableProtectedAndIndigenousAreas },
          ];
        }
      } catch (err) {
        this.$notify({
          text: err.message || this.$t("dueDiligence.anErrorOccurred"),
          type: "error",
        });
      }
    },
    async updateEnableCriteria(value) {
      this.enableRiskAssessmentCriteria = value;
      this.disregardSegmentData[0].enableRiskAssessmentCriteria = value;
      
      // Log regional risk criteria update
      try {
        const userId = this.$store.getters.getUser?.id;
        if (userId) {
          await ActivityLogService.logDDSRegionalRiskCriteriaUpdated(
            this.diligenceId,
            userId,
            'Risk Assessment Criteria',
            value
          );
        }
      } catch (logError) {
        console.error('Error logging regional risk criteria update:', logError);
      }
    },
    async updateEnableProtected(value) {
      this.enableProtectedAndIndigenousAreas = value;
      this.disregardSegmentData[1].enableProtectedAndIndigenousAreas = value;
      
      // Log protected areas criteria update
      try {
        const userId = this.$store.getters.getUser?.id;
        if (userId) {
          await ActivityLogService.logDDSProtectedAreasCriteriaUpdated(
            this.diligenceId,
            userId,
            value
          );
        }
      } catch (logError) {
        console.error('Error logging protected areas criteria update:', logError);
      }
    },
  },
  mixins: [loading],
};
</script>
