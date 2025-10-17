<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div class="d-flex mb-8">
                <h2>{{ $t("esgPlatform.startEsgProtocol") }}</h2>
                <v-spacer></v-spacer>
                <div class="d-flex mt-1">
                    <v-btn color="primary" outlined class="mr-2" @click="closeCreateStandard">
                        {{ $t("esgPlatform.close") }}
                    </v-btn>

                    <template v-if="step !== 3">
                        <v-btn color="primary" dark class="mr-2" @click="handleProtocolSettings">
                            {{ $t("esgPlatform.settings") }}
                        </v-btn>
                        <v-btn color="primary" dark class="mr-2" @click="handleProtocolEdit">
                            {{ isEditing ? $t("cancel") : $t("edit") }}
                        </v-btn>
                        <v-btn color="primary" dark class="mr-2"
                            @click="isPreviewMode ? confirmActivateStandard() : changeStep(2)">
                            {{ isPreviewMode ? $t("esgPlatform.activate") : $t("esgPlatform.next") }}
                        </v-btn>
                    </template>

                    <template v-if="step === 3">
                        <v-btn color="primary" dark class="mr-2" @click="handleOpenActivityDialog">
                            {{ $t("esgPlatform.activityLog") }}
                        </v-btn>
                        <v-btn color="primary" dark class="mr-2" @click="handleActivateProtocol">
                            {{ $t("esgPlatform.activate") }}
                        </v-btn>
                    </template>
                </div>
            </div>
            <v-card elevation="0" class="mt-4 ml-4">

                <v-row class="ml-2">
                    <v-col cols="12" v-if="protocol">
                        <!-- Title -->
                        <h3 class="font-weight-bold">{{ protocol.title }} <v-btn @click="editProtocolDialog = true"
                                class="ma-2" outlined x-small fab color="primary">
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn></h3>
                        <v-row align="center">
                            <!-- Image Section -->
                            <v-col cols="2" v-if="protocol && protocol.sealUrl">
                                <v-img :src="protocol.sealUrl" contain height="160px" width="250px"
                                    class="rounded-lg"></v-img>
                            </v-col>
                            <!-- Content Section -->
                            <v-col cols="8">
                                <p class="text-body-4 black--text text--darken-2 justify-start align-start"
                                    style="text-align: justify !important; vertical-align: top !important;"
                                    v-html="protocol.description">
                                </p>
                                <div class="d-flex flex-row align-start gap-4 align-center">
                                    <h4 class="mb-2">Standard:</h4>
                                    <div class="d-flex align-center" v-if="protocol && protocol.esgStandard">
                                        <v-img :src="protocol.esgStandard.sealUrl" contain height="30px" width="60px"
                                            class="rounded-lg mr-2"></v-img>
                                        <div class="subtitle-1">{{ protocol.esgStandard.title }}</div>
                                    </div>
                                </div>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-card>
            <v-card elevation="0" class="px-5 mt-8 ml-4">
                <CustomTab @changeStep="changeStep" :tabs="tabs" :activeTab="step">
                </CustomTab>
            </v-card>

            <v-card class="pb-5" v-if="step === 1">
                <div v-if="!isEditing && step === 1" elevation="0" class="px-5 mt-6 ml-4 pb-4">
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
                    <IssueGoals :environmental-issues="environmentalIssues" :social-issues="socialIssues"
                        :governance-issues="governanceIssues" @confirmActivateStandard="confirmActivateStandard" />
                </div>

                <div v-if="isEditing && step === 1" elevation="0" class="px-5 mt-6 ml-4 pb-4">
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
                        @create-goal="createGoal($event, $event)"
                        @delete-goal="confirmDeleteGoal('environmental', $event)"
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
                        @delete-issue="confirmDeleteIssue('governance', $event)"
                        @create-goal="createGoal($event, $event)" @update-goal="updateGoal($event.id, $event)"
                        @delete-goal="confirmDeleteGoal('governance', $event)" @reorder-goals="reorderGoals"
                        @navigate-survey="navigateSurveyView" @create-issue="createIssue($event, 'governance')"
                        @reorder-issues="reorderIssues" @update-issue-title="updateIssueTitle($event.id, $event.title)">
                    </add-issue>
                </div>
                <div class="d-flex flex-end mt-5">
                    <v-btn class="mr-2">
                        {{ $t('cancel') }}
                    </v-btn>
                    <v-btn color="primary" dark class="mr-2" @click="step = 2">
                        {{ $t("esgPlatform.next") }}
                    </v-btn>
                </div>
            </v-card>


            <v-card v-if="step === 2" elevation="0" class="px-5 mt-6 ml-4 pb-4">
                <EsgProtocolSubOrganizationSync @cancel="step = 1" @next="handleNextStep" />
            </v-card>


            <div v-if="step === 3" class="p-4 ml-4 mt-6 pb-4">
                <v-card class="px-4" elevation="0">
                    <template>
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
                        <IssueGoals :environmental-issues="environmentalIssues" :social-issues="socialIssues"
                            :governance-issues="governanceIssues" @confirmActivateStandard="confirmActivateStandard" />
                    </template>
                </v-card>


                <v-card class="px-4 py-2" elevation="0">
                    <h2 class="pb-5 pt-4">{{ $t('esgPlatform.subOrgs') }}</h2>
                    <p>{{ $t('esgPlatform.selectSubOrgMsg') }}</p>

                    <div class="data-table mb-10">
                        <v-data-table :headers="organizationHeaders" :items="selectedSubOrganizations"
                            :items-per-page="tableOptions.itemsPerPage" hide-default-footer :loading="loading"
                            :loading-text="$t('loadingData')">
                            <template v-slot:top>
                                <div class="d-flex mt-5 mb-2">
                                    <v-spacer></v-spacer>
                                    <div class="d-flex justify-center align-center">
                                        <div class="py-1 title">
                                            {{ from }} - {{ to }} {{ $t('of') }} {{ totalSubOrganization }}
                                        </div>
                                        <v-btn class="mx-2" fab small outlined color="primary"
                                            :disabled="tableOptions.page <= 1" @click="pageChange(false)">
                                            <v-icon dark>mdi-chevron-left</v-icon>
                                        </v-btn>
                                        <v-btn class="mx-2" fab small outlined color="primary"
                                            :disabled="tableOptions.page >= totalPages" @click="pageChange(true)">
                                            <v-icon dark>mdi-chevron-right</v-icon>
                                        </v-btn>
                                    </div>
                                </div>
                            </template>
                            <template v-slot:item.product="{ item }">
                                {{ item?.product?.length ? item?.product?.map(x => x.name).join(', ') : '' }}
                            </template>
                            <template v-slot:item.status="{ item }">
                                <v-btn small rounded min-width="200" depressed class="green-button" height="40"
                                    v-if="item.status">
                                    {{ $t("esgPlatform.common.active") }}
                                </v-btn>
                                <v-btn small rounded min-width="200" depressed class="red-button" height="40" v-else>
                                    {{ $t("esgPlatform.common.deactivated") }}
                                </v-btn>
                            </template>
                        </v-data-table>
                    </div>
                </v-card>

                <div class="d-flex flex-end mt-5">
                    <v-btn class="mr-2" @click="step = 2">
                        {{ $t('cancel') }}
                    </v-btn>
                    <v-btn color="primary" dark class="mr-2" @click="handleActivateProtocol">
                        {{ $t("esgPlatform.activate") }}
                    </v-btn>
                </div>
            </div>


        </v-container>

        <ProtocolSettings :dialogI="openProtocolSettings" @closeModal="openProtocolSettings = false" />
        <EditProtocol v-if="editProtocolDialog" :selectedProtocol="protocol" :dialog="editProtocolDialog"
            @close="closeAddProtocolDialog" @save="handleSaveProtocol" />
        <ConfirmBox v-if="openConfirmBox" :dialog="openConfirmBox" @cancel:action="openConfirmBox = false" @continue:action="handleConfirm"
            :message="message" :confirmBtnText="$t('confirm')" :cancelBtnText="$t('cancel')" />

        <ActivityLog v-if="openActivityLog" :dialog="openActivityLog" :activityData="protocol" @closeModal="openActivityLog = false"/>
    </div>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";
import ConfirmBox from "./components/confirmationDialog.vue"
import CustomTab from '../standards/components/customTab.vue';
import IssueGoals from './components/IssueGoals.vue';
import ESGService from "@/_services/EsgService";
import ProtocolSettings from "./components/ProtocolSettings.vue";
import AddIssue from './components/addIssue.vue';
import EditProtocol from "./components/EditProtocol.vue";

import EsgProtocolSubOrganizationSync from './components/EsgProtocolSubOrganizationSync.vue'
import ActivityLog from "./components/ActivityLog.vue";
export default {
    name: 'CreateEsgStandard',
    components: {
        ConfirmBox,
        CustomTab,
        IssueGoals,
        ProtocolSettings,
        AddIssue,
        EditProtocol,
        EsgProtocolSubOrganizationSync,
        ActivityLog
    },
    async mounted() {
        await this.fetchProtocolDetails();
    },
    props: {
        id: {
            type: String,
            required: true
        }
    },
    watch: {
        step(newStep) {
            if (newStep === 3) {
                this.getSelectedSubOrganizations();
            }
        }
    },
    data() {
        return {
            openActivityLog: false,
            openProtocolSettings: false,
            openConfirmBox: false,
            message: "",
            confirmAction: null,
            standardId: this.$route.params.id,
            // Separate issue arrays for each section
            environmentalIssues: [
            ],
            socialIssues: [
            ],
            governanceIssues: [
            ],

            // Track which section and indices we're working with
            currentSection: null,
            selectedIssueIndex: null,
            selectedGoalIndices: { issueIndex: null, goalIndex: null },

            protocol: null,
            breadcrumbs: [
                {
                    text: this.$t("esgPlatform.esgPlatform"),
                    disabled: false,
                    to: { name: "eudrDashboard" },
                },
                {
                    text: this.$t("esgPlatform.myProtocol"),
                    link: true,
                    exact: true,
                    disabled: true,
                }
            ],
            tabs: [
                { number: 1, title: this.$t("esgPlatform.keyIssuesAndGoals") },
                { number: 2, title: this.$t("esgPlatform.subOrganization") },
                { number: 3, title: this.$t("esgPlatform.preview") },
            ],
            step: 1,
            isEditing: false,
            editProtocolDialog: false,
            selectedProtocolDetails: null,

            organizationHeaders: [
                {
                    text: 'Sub-Organization',
                    align: "start",
                    value: "name",
                    class: "black--text",
                    width: "200px",
                },
                {
                    text: 'License ID',
                    align: "start",
                    value: "lincense_id",
                    class: "black--text",
                },
                {
                    text: this.$t('esgPlatform.dashboard.country'),
                    align: "start",
                    value: "country",
                    class: "black--text",
                    sortable: true,
                },
                {
                    text: this.$t('esgPlatform.dashboard.products'),
                    align: "start",
                    value: "product",
                    class: "black--text",
                },
                {
                    text: this.$t('status'),
                    align: "start",
                    value: "status",
                    class: "black--text",
                },
            ],
            totalPages: null,
            totalSubOrganization: 0,
            from: 0,
            to: 0,
            loading: false,
            tableOptions: {
                itemsPerPage: 10,
                limit: 10,
                page: 1,
            },
            subOrganizations: [],
            selectedSubOrganizations: [],
        };
    },
    computed: {
        isPreviewMode() {
            return (this.$route.query.mode === 'preview');
        },

    },
    methods: {
        async getSelectedSubOrganizations() {
            try {
                const response = await ESGService.getSelectedSubOrganization(this.id);
                this.selectedSubOrganizations = response.data;
                this.updatePagination();
            } catch (error) {
                console.error('Error fetching selected sub-organizations:', error);
            }
        },

        closeAddProtocolDialog() {
            this.editProtocolDialog = false;
        },

        async handleSaveProtocol() {
            await this.fetchProtocolDetails();
            this.editProtocolDialog = false;
            this.$notify({
                type: "success",
                text: this.$t('esgPlatform.protocolUpdatedSuccessfully')
            });
        },

        handleOpenActivityDialog() {
            this.openActivityLog = true;
        },

        async fetchProtocolDetails() {
            const response = await ESGService.getEsgStandardDetails(this.id);
            this.protocol = response.data;
            if (this.protocol.esgIssues && this.protocol.esgIssues.length > 0) {
                this.environmentalIssues = [];
                this.socialIssues = [];
                this.governanceIssues = [];
                this.protocol.esgIssues.forEach(issue => {
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
                await this.fetchProtocolDetails();
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
                await this.fetchProtocolDetails();
            } finally {
                this.stopLoading();
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
                await this.fetchProtocolDetails();
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
                await this.fetchProtocolDetails();
                this.stopLoading();
                this.$notify({
                    type: "success",
                    text: this.$t('esgPlatform.goalCreatedSuccessfully')
                });
                return response;
            } catch (error) {
                console.error('Error creating goal:', error);
                //  refresh state to ensure consistency
                await this.fetchProtocolDetails()
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
        navigateSurveyView(surveyId) {
            this.$router.push({
                name: 'surveyView', // Replace with your actual survey route name
                params: { id: surveyId }
            });
        },
        handleProtocolSettings() {
            this.openProtocolSettings = true;
        },
        handleProtocolEdit() {
            this.isEditing = !this.isEditing;
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

        async handleActivateProtocol() {
            this.startLoading();
            await ESGService.updateEsgStandardStatus(this.id, { isActive: true });
            this.stopLoading();
            this.$notify({
                type: "success",
                text: this.$t('esgPlatform.protocolActivatedSuccessfully')
            });
            this.$router.push({ name: "esgStandardProtocol" });
        },


        // Helper to get the correct issues array based on section
        getIssuesArray(section) {
            switch (section) {
                case 'environmental': return this.environmentalIssues || [];
                case 'social': return this.socialIssues || [];
                case 'governance': return this.governanceIssues || [];
                default: return [];
            }
        },

        changeStep(step) {
            // If trying to navigate to the Preview tab (step 2)
            // if (step === 3) {
            //     // Check if there's at least one issue with at least one goal in any category
            //     const hasValidData = this.validateIssuesAndGoals();
            //     if (!hasValidData) {
            //         // Show error notification
            //         this.$notify({
            //             type: "error",
            //             text: this.$t('esgPlatform.pleaseAddAtLeastOneIssueAndGoal')
            //         });
            //         return; // Prevent navigation
            //     }
            // }
            //this.$router.push({ name: "previewEsgStandard", query: { mode: 'preview' } });
            // If validation passes or moving to another tab, proceed
            this.step = step;
        },

        validateIssuesAndGoals() {
            // Check environmental issues
            const hasEnvironmentalIssueWithGoal = this.environmentalIssues.some(issue =>
                issue.goals && issue.goals.length > 0
            );

            // Check social issues
            const hasSocialIssueWithGoal = this.socialIssues.some(issue =>
                issue.goals && issue.goals.length > 0
            );

            // Check governance issues
            const hasGovernanceIssueWithGoal = this.governanceIssues.some(issue =>
                issue.goals && issue.goals.length > 0
            );

            // Return true if any category has at least one issue with at least one goal
            return hasEnvironmentalIssueWithGoal || hasSocialIssueWithGoal || hasGovernanceIssueWithGoal;
        },
        // Confirmation method for activate standard
        confirmActivateStandard() {
            this.message = "Are you sure you want to activate the ESG standard “Corporate Sustainability Reporting Directive (CSRD)”? ";
            this.confirmAction = this.activateStandard;
            this.openConfirmBox = true;
        },
        activateStandard() {
            // Here you would implement the logic to save the standard
            console.log("Saving standard with data:", {
                environmental: this.environmentalIssues,
                social: this.socialIssues,
                governance: this.governanceIssues
            });

            // Show success notification
            this.$notify({
                type: "success",
                text: this.$t('esgPlatform.standardSavedSuccessfully')
            });

            // Redirect to standards list or another appropriate page
            this.$router.push({ name: "esgPlatformStandards" });
        },
        handleNextStep(selectedSubOrganizations) {
            this.selectedSubOrganizations = selectedSubOrganizations;
            this.updatePagination();
            this.step = 3;
        },
        updatePagination() {
            this.totalSubOrganization = this.selectedSubOrganizations.length;
            this.from = (this.tableOptions.page - 1) * this.tableOptions.itemsPerPage + 1;
            this.to = Math.min(
                this.tableOptions.page * this.tableOptions.itemsPerPage,
                this.totalSubOrganization
            );
        },
        pageChange(isNext) {
            if (isNext) {
                this.tableOptions.page += 1;
            } else {
                this.tableOptions.page -= 1;
            }
            this.updatePagination();
        },
    },
    mixins: [loadingMixin],
};
</script>

<style lang="scss" scoped>
::v-deep .v-data-table-header__icon {
    color: white !important;
}


::v-deep .flex-end {
    justify-content: flex-end;
}
</style>