<template>
    <div v-if="survey">
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div class="d-flex mb-8">
                <h2> {{ $t("esgPlatform.surveyOverview") }}</h2>
                <v-spacer></v-spacer>
                <div class="d-flex mt-1">
                    <v-btn color="primary" outlined class="mr-2" @click="goToFarmerProtocol">
                        {{ $t("cancel") }}
                    </v-btn>
                    <v-btn color="primary" dark class="mr-2" @click="goToSurveyOverViewResponse">
                        {{ $t("esgPlatform.startContinueSurvey") }}
                    </v-btn>
                </div>
            </div>
            <v-card elevation="0" class="px-4">
                <div class="ml-6 py-12">
                    <v-row>
                        <label class="font-weight-bold">{{ $t("esgPlatform.surveyTitle") }}:</label>
                        <p class="ml-4">{{ survey.title }}</p>
                    </v-row>
                    <v-row class="mt-4">
                        <label class="font-weight-bold">{{ $t("esgPlatform.surveyCompletionPercentage") }}:</label>
                        <p class="ml-4">{{ progressPercentage }}%</p>
                    </v-row>
                    <v-row class="align-center">
                        <label class="font-weight-bold mr-4">{{ $t("esgPlatform.status") }}:</label>
                        <v-btn small rounded min-width="150" depressed :class="statusClass" height="34">
                            {{ this.scoreInfo.status }}
                        </v-btn>
                    </v-row>
                    <v-row class="mt-8">
                        <label class="font-weight-bold">{{ $t("esgPlatform.surveyProgress") }}:</label>
                        <div class="progress-bar-container">
                            <div class="progress-bar">
                                <template v-for="(step, index) in steps">
                                    <div :key="'circle-' + index"
                                        :class="['step-circle', { completed: step.completed }]">
                                        {{ step.label }}
                                    </div>
                                    <div v-if="index < steps.length - 1" :key="'line-' + index"
                                        :class="['step-line', { completed: step.completed && steps[index + 1].completed }]">
                                    </div>
                                </template>
                            </div>
                            <p class="text-center mt-2">Completed {{ completedSteps }} out of {{ totalSteps }} Steps</p>
                        </div>
                    </v-row>
                    <v-row class="mt-8">
                        <label class="font-weight-bold mb-4">{{ $t("esgPlatform.surveyDescription") }}:</label>
                        <div class="ml-4 px-4">
                            <span class="text-body-1" v-html="survey.description"></span>
                        </div>
                    </v-row>
                    <v-row class="mt-8">
                        <label class="font-weight-bold mb-4">{{ $t("esgPlatform.surveyInstructions") }}:</label>
                        <div class="ml-4 px-4">
                            <span class="text-body-1" v-html="survey.instructions"></span>
                        </div>
                    </v-row>
                </div>
            </v-card>
        </v-container>
    </div>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";
import EsgService from '@/_services/EsgService';

export default {
    name: 'SurveyOverview',
    async mounted() {
        const query = this.$route.query;

        // Set from query if available
        if (query.progress || query.status) {
            this.scoreInfo.progress = parseFloat(query.progress || 0);
            this.scoreInfo.status = query.status || 'not-started';
        }
        await this.getSurveyScore();
        this.getSurvey();
    },
    data() {
        return {
            isLoading: false,
            openSurveySettings: false,
            openConfirmBox: false,
            message: "",
            confirmAction: null,
            survey: null,
            surveyId: this.$route.params.id1,
            goalId: this.$route.params.id2,
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
            steps: [],
            scoreInfo: {
                progress: 0,
                totalQuestionScore: 0,
                totalResponseScore: 0,
                assessmentId: '',
                goalId: '',
                status: 'not-started',
            },
            assessmentQuestions: null,
        };
    },
    watch: {
        surveyId(newId, oldId) {
            if (newId !== oldId) {
                this.getSurvey();
            }
        }
    },
    computed: {
        completedSteps() {
            return this.steps.filter(step => step.completed).length;
        },
        totalSteps() {
            return this.steps.length;
        },
        progressPercentage() {
            return this.scoreInfo.progress;
        },
        statusClass() {
            return this.scoreInfo.status === 'not-started' ? 'red-button' : 'green-button';
        }
    },
    methods: {
        async getSurveyScore() {
            this.startLoading();
            try {
                const response = await EsgService.getSurveyResponsesByAssessmentAndGoal(
                    this.surveyId,
                    this.goalId
                );
                if (response.success && response.score_information) {
                    this.scoreInfo = response.score_information;
                }

                this.assessmentQuestions = response.data;

                const allQuestions = this.assessmentQuestions.flatMap(heading => heading.assessmentQuestions);
                this.steps = allQuestions.map((question, index) => ({
                    label: (index + 1).toString(),
                    completed: question.response !== null
                }));

                return response.data;
            } catch (error) {
                console.error("Error fetching survey score:", error);
                this.$notify({
                    type: "error",
                    text: "Error loading survey score"
                });
            } finally {
                this.stopLoading();
            }
        },

        getProgressColor(progress) {
            if (progress >= 0 && progress <= 24) return "#F03737";  // Red
            if (progress >= 25 && progress <= 74) return "#FFB443"; // Yellow/Orange
            return "#00BD73";  // Green
        },
        goToSurveyOverViewResponse() {
            this.$router.push({ name: "surveyOverviewResponse", params: { id1: this.surveyId, id2: this.goalId }, query: this.$route.query });
        },
        goToFarmerProtocol() {
            this.$router.go(-1);
        },
        handleConfirm() {
            if (this.confirmAction) {
                this.confirmAction();
            }
            this.openConfirmBox = false;
            this.confirmAction = null;
        },
        async getSurvey() {
            try {
                this.startLoading();
                const response = await EsgService.getAssessmentById(this.surveyId);
                this.survey = response.data;
                return Promise.resolve();
            } catch (error) {
                console.error("Error fetching Survey:", error);
                this.$notify({
                    type: "error",
                    text: this.$t("esgPlatform.errorLoadingSurvey"),
                });
                return Promise.reject(error);
            } finally {
                this.stopLoading();
            }
        },
    },
    mixins: [loadingMixin],
};
</script>

<style lang="scss" scoped>
.progress-bar-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
}

.progress-bar {
    display: flex;
    align-items: center;
    width: 80%;
}

.step-circle {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #D3D3D3;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    flex-shrink: 0;
}

.step-circle.completed {
    background-color: #00BD73;
}

.step-line {
    height: 8px;
    background-color: #D3D3D3;
    flex-grow: 1;
    margin: 0 5px;
}

.step-line.completed {
    background-color: #00BD73;
}

.text-center {
    text-align: center;
}

::v-deep .v-data-table-header__icon {
    color: white !important;
}

.red-button {
    background-color: #F03737;
    color: white;
}

.green-button {
    background-color: #00BD73;
    color: white;
}
</style>