<template>
    <v-dialog v-model="dialog" width="800" @click:outside="closeModal" :retain-focus="false">
        <v-card class="custom-card" rounded="0">
            <v-toolbar flat color="primary" class="white--text">
                <v-toolbar-title class="font-weight-bold">{{
                    (!disregardSegmentData[0].enableRiskAssessmentCriteria && !disregardSegmentData[1].enableProtectedAndIndigenousAreas)
                     ? $t("regionalRiskAssessment.addConfirmTitle") : $t("regionalRiskAssessment.disregardConfirmTitle")
                    }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon class="white--text" @click="closeModal">
                    <v-icon style="color:white !important">mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-form ref="disregard" lazy-validation autocomplete="off">
                <v-card-text class="black--text">
                    <v-row>
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 pa-4">
                            <label for="createType">
                                <h3>{{ (!disregardSegmentData[0].enableRiskAssessmentCriteria && !disregardSegmentData[1].enableProtectedAndIndigenousAreas)
                                    ? $t("regionalRiskAssessment.deselectToAddSegment") : $t("regionalRiskAssessment.selectSegment") }}</h3>
                            </label>
                        </div>
                        <v-col cols="12" class="pa-4">
                            <v-checkbox v-model="selectedSegments" :label="segment.label" :value="segment.value"
                                v-for="segment in segments" :key="segment.value"></v-checkbox>
                        </v-col>

                    </v-row>
                    <v-card-actions class="mt-5">
                        <v-spacer></v-spacer>
                        <v-btn @click="closeModal" outlined right height="44" width="116" depressed color="primary">
                            {{ $t("cancel") }}
                        </v-btn>
                        <v-btn @click="onConfirm" right height="44" width="116" color="primary">
                            {{ $t("confirm") }}
                        </v-btn>
                    </v-card-actions>
                </v-card-text>
            </v-form>

        </v-card>
        <ConfirmBox :title="$t('regionalRiskAssessment.confirmation')" :message="removeSegmentMessage"
            :cancelBtnText="$t('regionalRiskAssessment.cancel')" :confirmBtnText="$t('regionalRiskAssessment.confirm')"
            :confirmData="confirmDeleteData" :dialog="confirmDeleteDialog" @cancel:action="confirmDeleteDialog = false"
            @continue:action="confirmRemoveSegment" />
    </v-dialog>

</template>
<script>
import ConfirmBox from "@/components/ConfirmBox.vue";
import DeforestationService from "@/_services/DeforestationService";
import loadingMixin from "@/mixins/LoadingMixin";

export default {
    components: {
        ConfirmBox,
    },
    computed: {
        dialog() {
            return this.dialogI;
        },
    },
    mounted() {
        this.selectedSegments = this.segments
            .filter(segment =>
                this.disregardSegmentData.some(data => data[segment.value] === false)
            )
            .map(segment => segment.value);
    },
    data() {
        return {
            headerProps: {
                "sort-icon": "mdi-menu-up",
            },
            country: null,
            segments: [
                {
                    label: this.$t("regionalRiskAssessment.riskAssessmentCriteria"),
                    value: "enableRiskAssessmentCriteria",
                },
                {
                    label: this.$t("regionalRiskAssessment.protectedAreas"),
                    value: "enableProtectedAndIndigenousAreas",
                },
            ],
            confirmDeleteDialog: false,
            removeSegmentMessage: "",
            selectedSegments: [],
            confirmDeleteData: null
        }
    },
    methods: {
        closeModal() {
            this.newAssessmentType = "new";
            this.$emit('closeModal');
        },
        onConfirm() {
            this.confirmDeleteDialog = true;
            if (this.selectedSegments.length === 0) {
                this.removeSegmentMessage = this.$t("regionalRiskAssessment.bothSegmentsMessage");
            } else if (this.selectedSegments.length === 1) {
                const selected = this.selectedSegments[0];
                const message =
                    selected === "enableRiskAssessmentCriteria"
                        ? this.$t("regionalRiskAssessment.singleRiskAssessmentCriteriaMessage")
                        : this.$t("regionalRiskAssessment.singleProtectedAreasMessage");
                this.removeSegmentMessage = message;
            } else if (this.selectedSegments.length === 2) {
                this.removeSegmentMessage = this.$t(
                    "regionalRiskAssessment.bothSegmentsMessage"
                );
            }
        },
        async confirmRemoveSegment() {
            this.confirmDeleteDialog = false;

            try {
                this.startLoading();
                const enableRiskAssessmentCriteria = this.selectedSegments.includes(
                "enableRiskAssessmentCriteria"
                );
                const enableProtectedAndIndigenousAreas = this.selectedSegments.includes(
                "enableProtectedAndIndigenousAreas"
                );

                const response = await DeforestationService.disregardSummarySegment(
                this.diligenceId,
                !enableRiskAssessmentCriteria,
                !enableProtectedAndIndigenousAreas
                );

                if (response.data) {
                    this.$notify({
                        text: this.$t("regionalRiskAssessment.segmentsUpdatedSuccessfully"),
                        type: "success",
                    });

                    this.$emit("update-enable-criteria", !enableRiskAssessmentCriteria);
                    this.$emit("update-enable-protected", !enableProtectedAndIndigenousAreas);
                    this.$emit('closeModal');
                }
            } catch (error) {
                console.error("Mutation Error:", error);
                this.$notify({
                text: error.message || this.$t("regionalRiskAssessment.updateFailed"),
                type: "error",
                });
            }finally {
                this.stopLoading();
            }
        },
    },
    props: {
        'dialogI': {
            type: Boolean,
            required: true
        },
        diligenceId: {
          required: true
        },
      disregardSegmentData: {
          required: true
      },
    },
    mixins: [loadingMixin]
}
</script>

<style scoped>
.spaced {
    justify-content: space-between;
}
</style>