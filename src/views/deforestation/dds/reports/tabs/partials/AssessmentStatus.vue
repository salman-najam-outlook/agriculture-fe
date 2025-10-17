<template>
    <v-col class="px-0">
        <div class="d-flex mb-4">
            <h3 style="color:black">
                {{ $t("assessmentStatus.riskAssessmentSummary") }}
                <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                            mdi-alert-circle
                        </v-icon>
                    </template>
                    <span>{{ $t("assessmentStatus.riskAssessmentSummaryTT") }}</span>
                </v-tooltip>
            </h3>
        </div>

        <v-row dense>
            <v-col v-for="metric in assessmentSummaryList" :key="metric[0]" cols="12" sm="6" md="4" lg="3">
                <v-card :class="'status-card ' + metric[0]" outlined>
                    <div class="my-2 text-subtitle-1 font-weight-bold">{{ assessmentSummaryLabels[metric[0]] }}</div>
                    <div class="numberText font-weight-bold text-h5 my-4	">{{ metric[1] }}</div>
                </v-card>
            </v-col>
        </v-row>
    </v-col>
</template>
<script>

import DeforestationSurveyBuilderService from "@/_services/DeforestationSurveyBuilderService";

export default {
    props: {
        diligenceId: {
            type: [String, Number]
        },
        assessmentId: {
            type: [String, Number]
        },
        farmsList: {
            type: Array
        },
    },
    data() {
        return {
            assessmentSummaryLabels: {
                totalNoOfFarms: this.$t('assessmentStatus.totalNoOfFarms'),
                assessmentsCompleted: this.$t('assessmentStatus.assessmentsCompleted'),
                assessmentsPending: this.$t('assessmentStatus.assessmentsPending'),
                requiredMitigation: this.$t('assessmentStatus.requiredMitigation')
            },
            assessmentSummary: {
                totalNoOfFarms: 0,
                assessmentsCompleted: 0,
                assessmentsPending: 0,
                requiredMitigation: 0
            }
        }
    },
    computed: {
        assessmentSummaryList() {
            return Object.entries(this.assessmentSummary);
        }
    },
    async mounted() {
        await this.getAssessmentSummary();
    },
    methods: {
        async getAssessmentSummary() {
            let farmsList = this.farmsList.map(farm => farm.farmId)
            const response = await DeforestationSurveyBuilderService.getAssessmentSummary(parseInt(this.diligenceId), parseInt(this.assessmentId), farmsList);

            if (response) {
                this.assessmentSummary = response.data.getAssessmentSummary;
                this.assessmentSummary.assessmentsPending = this.assessmentSummary.totalNoOfFarms - this.assessmentSummary.assessmentsCompleted;
            }
        },
    }
}
</script>
<style lang="scss" scoped>
::v-deep .status-card {
    padding-left: 1rem;
    border-left-width: 8px !important;
    border-left-style: solid;
    transition: all 0.3s ease-in-out;

    @media (max-width: 600px) {
        font-size: 0.9rem;
    }

    @media (min-width: 600px) and (max-width: 960px) {
        font-size: 1rem;
    }

    &.totalNoOfFarms {
        border-left-color: #117443;
    }

    &.assessmentsCompleted {
        border-left-color: #00bd73;
    }

    &.assessmentsPending {
        border-left-color: #f7970f;
    }

    &.requiredMitigation {
        border-left-color: #f06b20;
    }
}
</style>