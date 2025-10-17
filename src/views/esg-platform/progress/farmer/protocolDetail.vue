<template>
    <div v-if="standard">
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div class="d-flex mb-8">
                <h2>{{ standard.staticContent.farmerName }}</h2>
                <v-spacer></v-spacer>
                <div class="d-flex mt-1">
                    <v-btn color="primary" dark class="mr-2" @click="goToDashboard">
                        {{ $t("back") }}
                    </v-btn>
                </div>
            </div>
            <v-card elevation="0" class="mt-4 ml-4 px-2">
                <v-row class="ml-2">
                    <v-col cols="12">
                        <h3 class="font-weight-bold">{{ standard.staticContent.protocolTitle }}</h3>
                        <v-row align="center">
                            <v-col cols="2" class="pa-4">
                                <v-img :src="standard.staticContent.sealUrl" cover height="200px" width="250px"></v-img>
                            </v-col>
                            <v-col cols="9">
                                <div class="d-flex flex-column">
                                    <p class="mt-6 text-body-4 black--text text--darken-2 justify-start align-start"
                                        style="text-align: justify !important; vertical-align: top !important;">
                                        {{ standard.staticContent.description }}
                                    </p>
                                    <v-row class="px-3 mt-2" align="center" justify="start" style="gap: 2rem;">
                                        <div class="d-flex align-center">
                                            <label class="font-weight-bold mr-2">
                                                {{ $t("esgPlatform.progress.standard") }}:
                                            </label>
                                            <v-img :src="standard.staticContent.sealUrl" class="mr-2" height="30"
                                                width="40" />
                                            <p class="text-body-4 black--text text--darken-2 mb-0">
                                                {{ standard.staticContent.standardName }}
                                            </p>
                                        </div>
                                    </v-row>
                                    <v-row class="px-3 mt-6" align="center" justify="start" style="gap: 2rem;">
                                        <div class="d-flex align-center">
                                            <label class="font-weight-bold mr-2">
                                                {{ $t("esgPlatform.status") }}:
                                            </label>
                                            <v-btn small rounded min-width="150" depressed class="red-button mr-2"
                                                height="34">
                                                {{ standard.staticContent.statusText }}
                                            </v-btn>
                                        </div>
                                        <div class="d-flex align-center">
                                            <label class="font-weight-bold mr-2">
                                                {{ $t("esgPlatform.progress.progress") }}:
                                            </label>
                                            <v-progress-linear :value="standard.progress" height="10"
                                                class="flex-grow-1" :color="getProgressColor(standard.progress)"
                                                style="width: 100px; margin-right: 10px;" rounded>
                                            </v-progress-linear>
                                            <label class="font-weight-bold">{{ standard.progress }}%</label>
                                        </div>
                                    </v-row>
                                </div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <div class="d-flex flex-wrap mt-4 mb-4 mr-6 ml-auto">
                                <v-btn color="primary" dark class="mr-4 mb-2">
                                    {{ $t("esgPlatform.progress.downloadReport") }}
                                </v-btn>
                                <v-btn color="primary" dark class="mr-4 mb-2">
                                    {{ $t("esgPlatform.progress.comparison") }}
                                </v-btn>
                                <v-btn color="primary" dark class="mr-4 mb-2">
                                    {{ $t("esgPlatform.progress.messages") }}
                                </v-btn>
                                <v-btn color="primary" dark class="mr-4 mb-2">
                                    {{ $t("esgPlatform.progress.validateData") }}
                                </v-btn>
                                <v-btn color="primary" dark class="mr-4 mb-2">
                                    {{ $t("esgPlatform.progress.recommendations") }}
                                </v-btn>
                            </div>
                        </v-row>
                    </v-col>
                </v-row>
            </v-card>
            <v-card elevation="0" class="px-5 mt-6 ml-4 pb-4">
                <div class="item-box pt-4 mb-4">
                    <label for="autoLogOff" class="font-weight-bold" style="font-size: 22px;">
                        {{ $t("esgPlatform.progress.ESRSIssueAndGoals") }}
                    </label>
                    <v-tooltip top color="00BD73" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon class="icon-with-background ml-2" size="2xl"
                                style="color:#0EBF67; margin-bottom: 5px;" v-bind="attrs" v-on="on">
                                mdi-alert-circle
                            </v-icon>
                        </template>
                        <span>{{ standard.staticContent.keyIssuesAndGoalsTooltip }}</span>
                    </v-tooltip>
                </div>
                <div>
                    <PreviewStandard :environmental-issues="standard.environmentalIssues"
                        :social-issues="standard.socialIssues" :governance-issues="standard.governanceIssues"
                        @navigate-survey="handleNavigateSurvey" />
                </div>
            </v-card>
        </v-container>
        <ConfirmBox :dialog="openConfirmBox" @cancel:action="openConfirmBox = false" @continue:action="handleConfirm"
            :message="message" :confirmBtnText="$t('confirm')" :cancelBtnText="$t('cancel')" />
    </div>
</template>

<script>
import ConfirmBox from "../../standards/components/confirmationDialog.vue";
import PreviewStandard from '../components/preview.vue';
import loadingMixin from "@/mixins/LoadingMixin";
import ESGService from "@/_services/EsgService";

export default {
    name: 'FarmerProtocolDetail',
    components: {
        ConfirmBox,
        PreviewStandard
    },

    mounted() {
        this.getStandard()
            .then(() => {
                this.isLoading = false;
            })
            .catch(() => {
                this.isLoading = false;
            });
    },
    data() {
        return {
            isLoading: false,
            openStandardSettings: false,
            openConfirmBox: false,
            message: "",
            confirmAction: null,
            standard: null,
            breadcrumbs: [
                {
                    text: this.$t("esgPlatform.esgCompliance"),
                    link: true,
                    exact: true,
                    disabled: true,
                },
                {
                    text: this.$t("dashboard"),
                    disabled: false,
                    to: { name: "eudrDashboard" },
                },
            ],
            tabs: [
                { number: 1, title: this.$t("esgPlatform.keyIssuesAndGoals") },
                { number: 2, title: this.$t("esgPlatform.preview") },
            ],
            step: 1,
        };
    },
    methods: {
        getProgressColor(progress) {
            if (progress >= 0 && progress <= 24) return "#F03737"; // Red
            if (progress >= 25 && progress <= 74) return "#FFB443"; // Yellow/Orange
            return "#00BD73"; // Green
        },
        goToDashboard() {
            this.$router.push({ name: "eudrDashboard" });
        },
        handleConfirm() {
            if (this.confirmAction) {
                this.confirmAction();
            }
            this.openConfirmBox = false;
            this.confirmAction = null;
        },
        async getStandard() {
            try {
                this.startLoading();
                const protocolId = this.$route.params.id;
                // Fetch data using both protocolId and standardId
                const apiResponse = await ESGService.getEsgStandardDetails(protocolId);

                // Transform the API response to match the template's expected structure
                this.standard = {
                    staticContent: {
                        farmerName: "Unknown Farmer", // Replace with actual data if available
                        protocolTitle: apiResponse.data?.title,
                        description: apiResponse.data?.description,
                        standardName: apiResponse.data?.esgStandard.title,
                        statusText: apiResponse.data?.isActive ? "Active" : "Inactive",
                        keyIssuesAndGoalsTooltip: "Details about key issues and goals for ESG compliance.",
                        sealUrl: apiResponse.data?.sealUrl
                    },
                    progress: apiResponse.data?.esrsProgress || 0,
                    environmentalIssues: apiResponse.data?.esgIssues
                        .filter(issue => issue.type === "Environmental")
                        .map(issue => ({
                            id: issue._id,
                            text: issue.title,
                            type: issue.type,
                            order: issue.order,
                            goals: issue.esgGoals.map(goal => ({
                                id: goal._id,
                                title: goal.title,
                                target: goal.targetYears.toString(),
                                completed: false,
                                surveyId: goal.esgAssessment,
                                noOfQuestions: goal.noOfQuestions,
                                isEditing: false,
                                order: goal.order,
                                progress: 0
                            }))
                        })),
                    socialIssues: apiResponse.data?.esgIssues
                        .filter(issue => issue.type === "Social")
                        .map(issue => ({
                            id: issue._id,
                            text: issue.title,
                            type: issue.type,
                            order: issue.order,
                            goals: issue.esgGoals.map(goal => ({
                                id: goal._id,
                                title: goal.title,
                                target: goal.targetYears.toString(),
                                completed: false,
                                surveyId: goal.esgAssessment,
                                noOfQuestions: goal.noOfQuestions,
                                isEditing: false,
                                order: goal.order,
                                progress: 0
                            }))
                        })),
                    governanceIssues: apiResponse.data?.esgIssues
                        .filter(issue => issue.type === "Governance")
                        .map(issue => ({
                            id: issue._id,
                            text: issue.title,
                            type: issue.type,
                            order: issue.order,
                            goals: issue.esgGoals.map(goal => ({
                                id: goal._id,
                                title: goal.title,
                                target: goal.targetYears.toString(),
                                completed: false,
                                surveyId: goal.esgAssessment,
                                noOfQuestions: goal.noOfQuestions,
                                isEditing: false,
                                order: goal.order,
                                progress: 0
                            }))
                        }))
                };

                return Promise.resolve();
            } catch (error) {
                console.error("Error fetching standard:", error);
                this.$notify({
                    type: "error",
                    text: this.$t("esgPlatform.errorLoadingStandard"),
                });
                return Promise.reject(error);
            } finally {
                this.stopLoading();
            }
        },
        handleNavigateSurvey(surveyId, goalId) {
            this.$router.push({
                name: 'surveyOverview',
                params: { id1: surveyId, id2: goalId }
            });
        },
    },
    mixins: [loadingMixin],
};
</script>

<style lang="scss" scoped>
::v-deep .v-data-table-header__icon {
    color: white !important;
}
</style>