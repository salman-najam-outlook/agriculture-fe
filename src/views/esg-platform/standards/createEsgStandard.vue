<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div class="d-flex mb-8">
                <h2>{{ $t("esgPlatform.createNewEsgStandard") }}</h2>
                <v-spacer></v-spacer>
                <div class="d-flex mt-1">
                    <v-btn color="primary" outlined class="mr-2" @click="closeCreateStandard">
                        {{ $t("back") }}
                    </v-btn>
                    <v-btn v-if="!isPreviewMode" color="primary" dark class="mr-2" @click="handleStandardSettings">
                        {{ $t("esgPlatform.settings") }}
                    </v-btn>
                    <v-btn color="primary" dark class="mr-2"
                        @click="isPreviewMode ? confirmActivateStandard() : changeStep(2)">
                        {{ isPreviewMode ? $t("esgPlatform.activate") : $t("esgPlatform.next") }}
                    </v-btn>
                </div>
            </div>
            <v-card elevation="0" class="mt-4 ml-4">
                <v-row class="ml-2">
                    <v-col cols="12">
                        <h3 class="font-weight-bold">{{ this.standards?.title }}</h3>
                        <v-row align="center">
                            <v-col cols="2">
                                <v-img :src="this.standards?.sealUrl" contain height="160px" width="250px"
                                    class="rounded-lg"></v-img>
                            </v-col>
                            <v-col cols="9">
                                <p class="text-body-4 black--text text--darken-2 justify-start align-start"
                                    style="text-align: justify !important; vertical-align: top !important;"
                                    v-html="this.standards?.description">
                                </p>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-card>
            <v-card elevation="0" class="px-5 mt-8 ml-4">
                <CustomTab @changeStep="changeStep" :tabs="tabs" :activeTab="step">
                </CustomTab>
            </v-card>
            <v-card v-if="step === 1" elevation="0" class="px-5 mt-6 ml-4 pb-4">
                <div class="item-box pt-4">
                    <label for="autoLogOff" class="font-weight-bold" style="font-size: 22px;">
                        {{ $t("esgPlatform.keyIssuesAndGoals") }}
                    </label>
                    <v-tooltip top color="00BD73" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon class="icon-with-background ml-2" size="2xl"
                                style="color:#0EBF67; margin-bottom: 5px;" v-bind="attrs" v-on="on">
                                mdi-alert-circle
                            </v-icon>
                        </template>
                        <span>{{ $t("esgPlatform.keyIssuesAndGoalsTT") }}</span>
                    </v-tooltip>
                </div>
                <add-issue v-model="environmentalIssues" section-type="environmental"
                    @delete-issue="confirmDeleteIssue('environmental', $event)"
                    @create-goal="createGoal($event, $event)" @delete-goal="confirmDeleteGoal('environmental', $event)"
                    @update-goal="updateGoal($event.id, $event)" @navigate-survey="navigateSurveyView"
                    @reorder-goals="reorderGoals" @create-issue="createIssue($event, 'environmental')"
                    @reorder-issues="reorderIssues" @update-issue-title="updateIssueTitle($event.id, $event.title)">
                </add-issue>
                <add-issue v-model="socialIssues" section-type="social"
                    @delete-issue="confirmDeleteIssue('social', $event)" @create-goal="createGoal($event, $event)"
                    @update-goal="updateGoal($event.id, $event)" @delete-goal="confirmDeleteGoal('social', $event)"
                    @reorder-goals="reorderGoals" @navigate-survey="navigateSurveyView"
                    @create-issue="createIssue($event, 'social')" @reorder-issues="reorderIssues"
                    @update-issue-title="updateIssueTitle($event.id, $event.title)">
                </add-issue>
                <add-issue v-model="governanceIssues" section-type="governance"
                    @delete-issue="confirmDeleteIssue('governance', $event)" @create-goal="createGoal($event, $event)"
                    @update-goal="updateGoal($event.id, $event)" @delete-goal="confirmDeleteGoal('governance', $event)"
                    @reorder-goals="reorderGoals" @navigate-survey="navigateSurveyView"
                    @create-issue="createIssue($event, 'governance')" @reorder-issues="reorderIssues"
                    @update-issue-title="updateIssueTitle($event.id, $event.title)">
                </add-issue>
            </v-card>
            <v-card v-if="step === 2" elevation="0" class="px-5 mt-6 ml-4 pb-4">
                <div class="item-box pt-4">
                    <label for="autoLogOff" class="font-weight-bold" style="font-size: 22px;">
                        {{ $t("esgPlatform.keyIssuesAndGoals") }}
                    </label>
                    <v-tooltip top color="00BD73" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon class="icon-with-background ml-2" size="2xl"
                                style="color:#0EBF67; margin-bottom: 5px;" v-bind="attrs" v-on="on">
                                mdi-alert-circle
                            </v-icon>
                        </template>
                        <span>{{ $t("esgPlatform.keyIssuesAndGoalsTT") }}</span>
                    </v-tooltip>
                </div>
                <div v-if="isPreviewMode">
                    <PreviewStandard :environmental-issues="environmentalIssues" :social-issues="socialIssues"
                        :governance-issues="governanceIssues" @confirmActivateStandard="confirmActivateStandard" @navigate-survey="navigateSurveyView" />
                </div>
            </v-card>
        </v-container>
        <StandardSettings :dialogI="openStandardSettings" @closeModal="openStandardSettings = false" />
        <ConfirmBox :dialog="openConfirmBox" @cancel:action="openConfirmBox = false" @continue:action="handleConfirm"
            :message="message" :confirmBtnText="$t('confirm')" :cancelBtnText="$t('cancel')" />
    </div>
</template>
<script>
import ConfirmBox from "./components/confirmationDialog.vue"
import StandardSettings from './components/standardSettingsDialog.vue';
import AddIssue from './components/addIssue.vue';
import CustomTab from './components/customTab.vue';
import PreviewStandard from './components/preview.vue';
import ESGService from "@/_services/EsgService";
import loadingMixin from "@/mixins/LoadingMixin";
export default {
    name: 'CreateEsgStandard',
    components: {
        ConfirmBox,
        StandardSettings,
        AddIssue,
        CustomTab,
        PreviewStandard
    },
    mounted() {
        this.setPreviewMode();
        this.getStandard().then(() => {
            this.isLoading = false;
        }).catch(() => {
            this.isLoading = false;
        });
    },
    data() {
        return {
            isLoading: true,
            openStandardSettings: false,
            openConfirmBox: false,
            message: "",
            confirmAction: null,
            standardId: this.$route.params.id,
            environmentalIssues: [],
            socialIssues: [],
            governanceIssues: [],
            currentSection: null,
            selectedIssueIndex: null,
            selectedGoalIndices: { issueIndex: null, goalIndex: null },
            standards: null,
            breadcrumbs: [
                {
                    text: this.$t("esgPlatform.esgPlatform"),
                    link: true,
                    exact: true,
                    disabled: true,
                },
                {
                    text: this.$t("esgPlatform.standards"),
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
    computed: {
        isPreviewMode() {
            return (this.$route.query.mode === 'preview');
        },
    },
    methods: {
        handleStandardSettings() {
            this.openStandardSettings = true;
        },
        handleConfirm() {
            if (this.confirmAction) {
                this.confirmAction();
            }
            this.openConfirmBox = false;
            this.confirmAction = null;
        },
        closeCreateStandard() {
            this.$router.push({ name: "esgPlatformStandards" });
        },
        async createIssue(payload, sectionType) {
            try {
                this.startLoading();
                const response = await ESGService.createEsgIssues(payload);
                const newIssue = {
                    id: response.id,
                    text: payload.title,
                    goals: [],
                };
                switch (sectionType) {
                    case 'environmental':
                        this.environmentalIssues.push(newIssue);
                        break;
                    case 'social':
                        this.socialIssues.push(newIssue);
                        break;
                    case 'governance':
                        this.governanceIssues.push(newIssue);
                        break;
                }
                await this.getStandard();
                this.stopLoading();
                this.$notify({
                    type: "success",
                    text: this.$t('esgPlatform.issueCreatedSuccessfully')
                });
            } catch (error) {
                console.error('Error creating issue:', error);
                this.$notify({
                    type: "error",
                    text: this.$t('esgPlatform.errorCreatingIssue')
                });
            }
        },
        confirmDeleteIssue(section, issueId) { // Change parameter to issueId for clarity
            this.currentSection = section;
            const issuesArray = this.getIssuesArray(section);
            this.selectedIssueIndex = issuesArray.findIndex(issue => issue.id === issueId); // Find index by ID
            if (this.selectedIssueIndex === -1) {
                console.error('Issue not found in array:', issueId);
                this.$notify({
                    type: "error",
                    text: this.$t('Issue Not Found')
                });
                return;
            }
            this.message = this.$t("esgPlatform.deleteIssueConfirmation");
            this.confirmAction = this.deleteIssue;
            this.openConfirmBox = true;
        },
        async deleteIssue() {
            try {
                this.startLoading();
                const issuesArray = this.getIssuesArray(this.currentSection);

                // Check if issuesArray exists and selectedIssueIndex is valid
                if (!issuesArray || !Array.isArray(issuesArray) || this.selectedIssueIndex === null || this.selectedIssueIndex < 0 || this.selectedIssueIndex >= issuesArray.length) {
                    throw new Error('Invalid issue index or empty issues array');
                }

                const issueId = issuesArray[this.selectedIssueIndex].id;
                if (!issueId) {
                    throw new Error('Issue ID is missing');
                }

                await ESGService.deleteEsgIssue(issueId);
                issuesArray.splice(this.selectedIssueIndex, 1);
                this.selectedIssueIndex = null;
                this.currentSection = null; // Reset section as well
                this.$notify({
                    type: "success",
                    text: this.$t('esgPlatform.issueDeletedSuccessfully')
                });
            } catch (error) {
                console.error('Error deleting issue:', error);
                this.$notify({
                    type: "error",
                    text: this.$t('esgPlatform.errorDeletingIssue')
                });
                // Optionally refresh state to ensure consistency
                await this.getStandard();
            } finally {
                this.stopLoading();
            }
        },
        getIssuesArray(section) {
            switch (section) {
                case 'environmental': return this.environmentalIssues || [];
                case 'social': return this.socialIssues || [];
                case 'governance': return this.governanceIssues || [];
                default: return [];
            }
        },
        changeStep(step) {
            if (step === 2) {
                this.$router.push({ name: "previewEsgStandard", query: { mode: 'preview' } });
            }
            if (step === 1) {
                this.$router.push({ name: "editEsgStandard", params: { id: this.standardId } });
            }
            this.step = step;
        },
        setPreviewMode() {
            if (this.isPreviewMode) {
                this.step = 2;
            }
        },
        confirmActivateStandard() {
            this.message = "Are you sure you want to activate the ESG standard “Corporate Sustainability Reporting Directive (CSRD)”? ";
            this.confirmAction = this.activateStandard;
            this.openConfirmBox = true;
        },
        async activateStandard() {
            this.startLoading();
            await ESGService.updateEsgStandardStatus(this.standardId, { isActive: true });
            this.stopLoading();
            this.$notify({
                type: "success",
                text: this.$t('esgPlatform.standardActivatedSuccessfully')
            });
            this.$router.push({ name: "esgPlatformStandards" });
        },
        async getStandard() {
            try {
                this.startLoading()
                const response = await ESGService.getEsgStandardDetails(this.$route.params.id);
                this.standards = response.data;
                if (this.standards.esgIssues && this.standards.esgIssues.length > 0) {
                    this.environmentalIssues = [];
                    this.socialIssues = [];
                    this.governanceIssues = [];
                    this.standards.esgIssues.forEach(issue => {
                        const formattedIssue = {
                            id: issue._id,
                            text: issue.title,
                            goals: [],
                            type: issue.type,
                            order: issue.order,
                        };
                        if (issue.esgGoals && issue.esgGoals.length > 0) {
                            formattedIssue.goals = issue.esgGoals.map(goal => ({
                                id: goal._id,
                                title: goal.title,
                                target: goal.targetYears,
                                completed: goal.completed || false,
                                surveyId: goal.esgAssessment || null,
                                noOfQuestions: goal.noOfQuestions || 0,
                                isEditing: false,
                                order: goal.order,
                            }));
                        }
                        switch (issue.type.toLowerCase()) {
                            case 'environmental':
                                this.environmentalIssues.push(formattedIssue);
                                break;
                            case 'social':
                                this.socialIssues.push(formattedIssue);
                                break;
                            case 'governance':
                                this.governanceIssues.push(formattedIssue);
                                break;
                        }
                        this.environmentalIssues.sort((a, b) => a.order - b.order);
                        this.socialIssues.sort((a, b) => a.order - b.order);
                        this.governanceIssues.sort((a, b) => a.order - b.order);
                    });
                } else {
                    console.log("No issues found in the standard");
                }
            } catch (error) {
                console.error("Error fetching standard:", error);
                this.$notify({
                    type: "error",
                    text: this.$t("esgPlatform.errorLoadingStandard"),
                });
            }
            finally{
                this.stopLoading()
            }
        },
        async updateIssueTitle(issueId, newTitle) {
            try {
                const updateData = {
                    title: newTitle
                };
                this.startLoading();
                const response = await ESGService.updateEsgIssue(issueId, updateData);
                this.stopLoading();
                this.$notify({
                    type: "success",
                    text: this.$t('esgPlatform.issueTitleUpdatedSuccessfully')
                });
                return response;
            } catch (error) {
                console.error('Error updating issue title:', error);
                this.$notify({
                    type: "error",
                    text: this.$t('esgPlatform.errorUpdatingIssueTitle')
                });
                throw error;
            }
        },
        async reorderIssues(payload) {
            try {
                this.startLoading();
                const response = await ESGService.reorderEsgIssues(payload.issues);
                this.stopLoading();
                return response;
            } catch (error) {
                console.error('Error reordering issues:', error);
                this.$notify({
                    type: "error",
                    text: this.$t('esgPlatform.errorReorderingIssues')
                });
            }
        },
        async reorderGoals(payload) {
            try {
                this.startLoading();
                console.log("Reordering goals:", payload.goals);
                const response = await ESGService.reorderEsgGoals(payload.goals);
                this.stopLoading();
                return response;
            } catch (error) {
                console.error('Error reordering issues:', error);
                this.$notify({
                    type: "error",
                    text: this.$t('esgPlatform.errorReorderingIssues')
                });
                await this.getStandard();
            }
        },
        async createGoal(payload, { issueIndex, goalIndex }) {
            this.startLoading();
            try {
                // Ensure payload matches the required structure
                const correctedPayload = {
                    title: payload.title,
                    targetYears: parseInt(payload.targetYears || 0),
                    order: payload.order || goalIndex, // Use provided order or fallback to goalIndex
                    issueId: payload.issueId,
                    ...(payload.esgAssessmentId && { esgAssessmentId: payload.esgAssessmentId })
                };
                const response = await ESGService.createEsgGoals(correctedPayload);
                const issueType = this.getIssueType(issueIndex);
                const issuesArray = this.getIssuesArray(issueType);
                if (issuesArray && issueIndex !== null && issuesArray[issueIndex]) {
                    const newGoal = {
                        id: response.id,
                        title: correctedPayload.title,
                        target: correctedPayload.targetYears,
                        completed: false,
                        surveyId: correctedPayload.esgAssessmentId, // Match local state to API field
                        noOfQuestions: response.noOfQuestions || 0, // If API returns it
                        isEditing: false,
                        order: correctedPayload.order
                    };
                    if (!issuesArray[issueIndex].goals) {
                        this.$set(issuesArray[issueIndex], 'goals', []);
                    }
                    if (goalIndex !== null && issuesArray[issueIndex].goals[goalIndex]) {
                        this.$set(issuesArray[issueIndex].goals, goalIndex, newGoal);
                    } else {
                        issuesArray[issueIndex].goals.push(newGoal);
                    }
                }
                await this.getStandard();
                this.stopLoading();
                this.$notify({
                    type: "success",
                    text: this.$t('esgPlatform.goalCreatedSuccessfully')
                });
                return response;
            } catch (error) {
                console.error('Error creating goal:', error);
                //  refresh state to ensure consistency
                await this.getStandard()
                this.stopLoading();
                this.$notify({
                    type: "error",
                    text: this.$t('esgPlatform.errorCreatingGoal')
                });
                throw error;
            }
        },
        getIssueType(issueIndex) {
            if (issueIndex < this.environmentalIssues.length) {
                return 'environmental';
            } else if (issueIndex < this.environmentalIssues.length + this.socialIssues.length) {
                return 'social';
            } else {
                return 'governance';
            }
        },
        async deleteGoal(goalId) {
            try {
                this.startLoading();
                await ESGService.deleteEsgGoal(goalId);
                this.$notify({
                    type: "success",
                    text: this.$t('esgPlatform.goalDeletedSuccessfully')
                });
                this.removeGoalFromLocalState(goalId);
                this.stopLoading();
            } catch (error) {
                console.error('Error deleting goal:', error);
                this.$notify({
                    type: "error",
                    text: this.$t('esgPlatform.errorDeletingGoal')
                });
            }
        },
        removeGoalFromLocalState(goalId) {
            const sections = ['environmental', 'social', 'governance'];
            sections.forEach(section => {
                const issuesArray = this[`${section}Issues`];
                if (issuesArray) {
                    issuesArray.forEach(issue => {
                        if (issue.goals) {
                            const goalIndex = issue.goals.findIndex(goal => goal.id === goalId);
                            if (goalIndex !== -1) {
                                issue.goals.splice(goalIndex, 1);
                            }
                        }
                    });
                }
            });
        },
        confirmDeleteGoal(section, { issueIndex, goalIndex }) {
            const issue = this[`${section}Issues`][issueIndex];
            if (!issue || !issue.goals) {
                console.error('Issue or goals not found');
                return;
            }
            const goalId = issue.goals[goalIndex]?.id;
            if (!goalId) {
                console.error('Goal ID not found');
                return;
            }
            this.message = this.$t("esgPlatform.deleteGoalConfirmation");
            this.confirmAction = () => this.deleteGoal(goalId);
            this.openConfirmBox = true;
        },
        async updateGoal(goalId, event) {
            try {
                this.startLoading();
                const updateData = {
                    title: event.title,
                    targetYears: event.targetYears,
                    completed: event.completed,
                    noOfQuestions: event.noOfQuestions || 0, // Use noOfQuestions from payload
                };
                if (event.esgAssessmentId) {
                    updateData.esgAssessmentId = event.esgAssessmentId; // Include survey ID
                }
                const response = await ESGService.updateEsgGoal(goalId, updateData);
                this.stopLoading();
                this.$notify({
                    type: "success",
                    text: this.$t('esgPlatform.goalUpdatedSuccessfully')
                });
                return response;
            } catch (error) {
                console.error('Error updating goal:', error);
                this.$notify({
                    type: "error",
                    text: this.$t('esgPlatform.errorUpdatingGoal')
                });
                throw error;
            }
        },
        navigateSurveyView(surveyId, goalTitle, targetYear) {
            console.log(goalTitle, targetYear)
            this.$router.push({
                name: 'ESGSurveyDetails',
                params: { 
                  id: surveyId,
                  goalTitle: encodeURIComponent(goalTitle || ''),
                  targetYear: targetYear || ''
                }
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