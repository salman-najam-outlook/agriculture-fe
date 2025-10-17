<template>
    <v-app>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container v-if="!reportId" fluid>
            <div class="d-flex mb-4">
                <h2>{{ $t("Create ESG Report") }}</h2>
                <v-spacer></v-spacer>
                <v-btn color="primary" outlined class="mr-2 btn-outline-primary font-weight-bold mb-2"
                    @click="$router.push({ name: 'esgReportsBuilder' })">
                    {{ $t('close') }}
                </v-btn>
                <!-- template setting button for step 2  -->
                <div v-if="step === 2" class="d-flex align-center">
                    <v-btn color="primary" dark class="mr-2 mb-2" @click="showTemplateSettings = true">
                        {{ $t('Template Settings') }}
                    </v-btn>
                    <v-btn color="primary" dark class="mr-2 mb-2" @click="step = 3">
                        {{ $t('Next') }}
                    </v-btn>
                </div>
                <!-- for step 3 -->
                <div v-else-if="step === 3" class="d-flex align-center">
                    <v-btn color="primary" dark class="mr-2 mb-2" @click="showSaveConfirmation = true">
                        {{ $t('Save') }}
                    </v-btn>
                    <v-btn color="primary" dark class="mr-2 mb-2" @click="showPublishConfirmation = true">
                        {{ $t('Publish To Dimitra') }}
                    </v-btn>
                    <v-btn color="primary" dark class="mr-2 mb-2" @click="showDialog = true">
                        {{ $t('Publish To Blockchain') }}
                    </v-btn>
                </div>
            </div>

            <v-card>
                <v-card-text>
                    <!-- Replace v-stepper with custom stepper -->
                    <CustomStepper :current-step="step" :steps="stepperSteps" @step-changed="handleStepChange"
                        class="mb-4" />

                    <!-- Step Content -->
                    <div v-if="step === 1" class="mb-9">
                        <v-card flat>
                            <v-card-text>
                                <report-details :protocol="selectedProtocol" :report-type="reportType"
                                    :timeline="timeline" @update:protocol="selectedProtocol = $event"
                                    @update:report-type="reportType = $event" @update:timeline="timeline = $event"
                                    @protocol-selected-id="handleProtocolSelection"></report-details>
                                <!-- Report Configuration Section -->
                                <v-card class="mt-4 pa-6" elevation="0" flat>
                                    <v-card-text>
                                        <v-row>
                                            <v-col cols="6" md="3">
                                                <h3 class="mb-3">Report Type Selection</h3>
                                                <v-radio-group v-model="reportType"
                                                    @change="$emit('update:report-type', reportType)">
                                                    <v-radio label="Internal Report" value="Internal Report"></v-radio>
                                                    <v-radio label="Public Report" value="Public Report"></v-radio>
                                                </v-radio-group>
                                            </v-col>
                                            <v-col cols="6" md="3">
                                                <h3 class="mb-3">Report Timeline</h3>
                                                <div class="d-flex align-center mb-2">
                                                    <span>Select Timeline</span>
                                                    <v-icon color="green" class="ml-2">mdi-information</v-icon>
                                                </div>
                                                <v-select 
                                                    v-model="timeline" 
                                                    :items="timelineOptions" 
                                                    outlined 
                                                    dense
                                                    multiple
                                                    chips
                                                    deletable-chips
                                                    small-chips
                                                    @change="$emit('update:timeline', timeline)"
                                                ></v-select>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                                <sub-organizations :sub-orgs="subOrganizations" :protocol-id="selectedProtocolId"
                                    @update:sub-orgs="subOrganizations = $event"></sub-organizations>
                                <template-selection :templates="templates"
                                    @update:selected-template="selectedTemplate = $event"></template-selection>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn color="primary" @click="handleCreateEsg()">Nexttt</v-btn>
                            </v-card-actions>
                        </v-card>
                    </div>

                    <!-- Step 2 -->
                    <div v-else-if="step === 2">
                        <v-card flat>
                            <v-card-text>
                                <div>
                                    <SectionItem v-for="(section, idx) in sections" :key="idx" :section="section"
                                        :index="idx" @delete-section="deleteSection" />
                                    <AddNewButton color="green" @click="addSection()">Add a New Section
                                    </AddNewButton>
                                </div>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn color="primary" @click="step = 1">{{ $t('Back') }}</v-btn>
                                <v-btn color="primary" @click="step = 3">{{ $t('Next') }}</v-btn>
                            </v-card-actions>
                        </v-card>
                    </div>

                    <!-- Step 3 -->
                    <div v-else-if="step === 3">
                        <v-card flat>
                            <v-card-text>
                                <h3>{{ $t("Preview Report") }}</h3>
                                <p>{{ $t("This is where the report preview will be displayed.") }}</p>
                            </v-card-text>
                            <PreviewSection :sections="reportSections" />
                            <v-card-actions>
                                <v-btn color="primary" @click="step = 2">{{ $t('Back') }}</v-btn>
                                <v-btn color="primary" @click="close">{{ $t('Finish') }}</v-btn>
                            </v-card-actions>
                        </v-card>
                    </div>
                </v-card-text>
            </v-card>
        </v-container>
        <v-container v-else fluid>
            <div class="d-flex justify-space-between align-center mb-4">

                <h2>{{ $t("ESG Report EP001") }}</h2>
                <div class="d-flex align-center">
                    <!-- v-autocomplete for date -->
                    <v-autocomplete 
                        v-model="timeline" 
                        :items="timelineOptions"
                        label="Select Timeline" 
                        class="mr-4" 
                        hide-details 
                        outlined 
                        dense
                        multiple
                        chips
                        deletable-chips
                        small-chips
                        style="max-width: 200px;"
                    ></v-autocomplete>
                    <v-btn color="primary" outlined class="mr-2 btn-outline-primary font-weight-bold mb-2"
                        @click="$router.push({ name: 'esgReportsBuilder' })">
                        {{ $t('close') }}
                    </v-btn>
                    <!-- download button with multiple dropwown option -->
                    <template>
                        <v-menu v-model="showDownloadMenu" :close-on-content-click="false" offset-y>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn color="primary" dark class="mr-2 mb-2" v-bind="attrs" v-on="on">
                                    {{ $t('Download Report') }}
                                </v-btn>
                            </template>
                            <v-list>
                                <v-list-item @click="downloadReport('pdf')">
                                    <v-list-item-title>{{ $t('Download as PDF') }}</v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="downloadReport('pdf-no-images')">
                                    <v-list-item-title>{{ $t('Download as PDF (without images)') }}</v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="downloadReport('xls')">
                                    <v-list-item-title>{{ $t('Download as XLS') }}</v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="downloadReport('csv')">
                                    <v-list-item-title>{{ $t('Download as CSV') }}</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </template>
                </div>
            </div>
            <v-card>
                <v-card-text>
                    <SectionItem v-for="(section, idx) in sectionsGetByIndex" :key="idx" :section="section" :index="idx"
                        @delete-section="deleteSection" :preview="preview" />
                </v-card-text>
            </v-card>
        </v-container>


        <TemplateSettingsDialog v-model="showTemplateSettings" :settings="templateSettings"
            @save="templateSettings = $event" />
        <PublishingBlockchainDialog :visible="showDialog" :initialProgress="50" @close="showDialog = false"
            @complete="onPublishComplete" />
        <ConfirmationDialog :visible="showPublishConfirmation" title="Confirmation"
            message="Are you sure you want to publish this report? Once published, the ESG report will be available to the public on Dimitra. No further changes can be made to this report after publishing."
            confirm-text="CONFIRM" cancel-text="CANCEL" type="warning" @confirm="handlePublishReport"
            @cancel="showPublishConfirmation = false" @close="showPublishConfirmation = false" />
        <ConfirmationDialog :visible="showSaveConfirmation" title="Confirmation"
            message="Are you sure you want to save your changes?" confirm-text="CONFIRM" cancel-text="CANCEL"
            type="warning" @cancel="showSaveConfirmation = false" @close="showSaveConfirmation = false" />
        <!-- @confirm="handleSaveChanges" -->

        <!-- Add this snackbar component before closing </v-app> -->
        <v-snackbar
            v-model="snackbar.show"
            :color="snackbar.color"
            :timeout="4000"
            bottom
            right
        >
            {{ snackbar.text }}
            <template v-slot:action="{ attrs }">
                <v-btn
                    text
                    v-bind="attrs"
                    @click="snackbar.show = false"
                >
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </v-app>
</template>

<script>
import ReportDetails from './components/step1/report-details.vue';
import SubOrganizations from './components/step1/sub-organization.vue';
import TemplateSelection from './components/step1/template-selection.vue';
import SectionItem from './components/step2/SectionItem.vue';
import AddNewButton from './components/step2/AddNewButton.vue';
import TemplateSettingsDialog from './components/step2/TemplateSettingDialog.vue';
import PreviewSection from './components/step3/PreviewSection.vue';
import PublishingBlockchainDialog from '../components/publishingBlockchainDialog.vue';
import ConfirmationDialog from '../components/Confirmation.vue';
import CustomStepper from '../components/CustomStepperTab.vue'; // Add this import
import EsgService from '@/_services/EsgService';
import LoadingMixin from "@/mixins/LoadingMixin";

export default {
    name: 'CreateReport',
    components: {
        ReportDetails,
        SubOrganizations,
        TemplateSelection,
        SectionItem,
        AddNewButton,
        TemplateSettingsDialog,
        PreviewSection,
        PublishingBlockchainDialog,
        ConfirmationDialog,
        CustomStepper, // Add this component
    },
    computed: {
        reportSections() {
            return this.sections.map(section => ({
                ...section,
                settings: {
                    ...section.settings,
                    backgroundColor: section.settings.backgroundColor || '#ffffff',
                    fontColor: section.settings.fontColor || '#000000',
                    font: section.settings.font || 'Poppins',
                    timeline: section.settings.timeline || '2024 - 2026',
                    locked: section.settings.locked || false
                }
            }));
        },
        getOrganizationId() {
            return this.$store.getters.getUser?.user_organization?.id;
        },
    },
    created() {
        this.reportId = this.$route.query.reportId;
        if (this.reportId) {
            this.step = 3; // Redirect to step 3
            this.loadDummyReportdata(); // Load report details if needed
            this.preview = true; // Set preview mode
        }
    },
    data() {
        return {
            step: 1,
            reportId: 0,
            selectedProtocol: 'Abranfrutas Protocol / Fruit Growers',
            selectedProtocolId: null,
            reportType: 'Internal Report',
            timeline: ['2024', '2025'], // Changed from string to array for multi-select
            subOrganizations: [],
            templates: [
                { id: 1, name: 'Template 1', features: ['About the Report', 'About the Organization', 'ESG Progress', 'ESG Score Card'] },
                { id: 2, name: 'Template 2', features: ['Overview', 'ESG Score Card'] },
                { id: 3, name: 'Template 3', features: ['About the Report', 'About the Organization', 'ESG Progress', 'ESG Score Card'] },
                { id: 4, name: 'Template 4', features: ['About the Report', 'About the Organization', 'ESG Progress', 'ESG Score Card'] },
                { id: 5, name: 'Template 5', features: ['About the Report', 'About the Organization', 'ESG Progress', 'ESG Score Card'] },
            ],
            breadcrumbs: [
                { text: 'ESG Platform', to: '/esg-platform' },
                { text: 'Report Builder', to: '/esg-platform/report-builder' },
                { text: 'Create Report', active: true },
            ],
            selectedTemplate: null,
            sections: [],
            dialog: false,
            selectedSection: null,
            showTemplateSettings: false,
            templateSettings: {},
            showDialog: false,
            showPublishConfirmation: false,
            sectionsGetByIndex: [],
            preview: false,
            showDownloadMenu: false,
            showSaveConfirmation: false,
            stepperSteps: [
                { title: 'Report Details', tooltip: 'Configure report details and settings' },
                { title: 'Customize Report', tooltip: 'Add sections and customize content' },
                { title: 'Preview', tooltip: 'Preview and publish your report' }
            ],
            timelineOptions: [
                '2024',
                '2025', 
                '2026',
                '2027',
                '2028',
                '2029'
            ],
            snackbar: {
                show: false,
                text: '',
                color: 'success'
            },
        };
    },
    methods: {
        close() {
            this.$router.push('/');
        },
        openEditor(section = null) {
            this.selectedSection = section;
            this.dialog = true;
        },
        saveSection(newSection) {
            if (this.selectedSection) {
                const idx = this.sections.indexOf(this.selectedSection);
                this.sections.splice(idx, 1, newSection);
            } else {
                this.sections.push(newSection);
            }
        },
        addSection() {
            const next = this.sections.length + 1;
            this.sections.push({
                title: `Section ${next}`,
                headingSize: 'H1',
                settings: {
                    backgroundColor: '#ffffff',
                    fontColor: '#000000',
                    font: 'Poppins',
                    timeline: '2024 - 2026',
                    locked: false
                },
                blocks: []
            });
        },
        deleteSection(index) {
            this.sections.splice(index, 1);
        },
        openDimtraDialog() {
            this.$emit('open-dimtra-dialog');
        },
        openBlockchainDialog() {
            this.$emit('open-blockchain-dialog');
        },
        handlePublishReport() {
            this.showPublishConfirmation = false;
            this.$emit('publish-report');
        },
        onPublishComplete() {
            this.showDialog = false;
            this.$emit('publish-complete');
        },
        handleProtocolSelection(protocolId) {
            this.selectedProtocolId = protocolId;
        },
        loadDummyReportdata() {
            this.sectionsGetByIndex = [
                {
                    settings: {
                        backgroundColor: '#ffffff',
                        fontColor: '#000000',
                        font: 'Poppins',
                        timeline: '2024 - 2026',
                        locked: false
                    },
                    blocks: [
                        {
                            type: 'heading',
                            text: 'About Dimitra ESG Report, Latest Technology and Innovation',
                            size: 'H1',
                        },
                        {
                            type: 'paragraph',
                            content: 'This is a sample paragraph for the About the Report section. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                        },
                        {
                            type: 'image',
                            images: ['/img/esgscorecard.png'],
                            imageType: 'single'
                        },
                        {
                            type: 'table',
                            headers: ['Header 1', 'Header 2', 'Header 3'],
                            rows: [
                                ['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3'],
                                ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3']
                            ],
                            settings: {
                                backgroundColor: '#cfcf',
                                fontColor: '#000000',
                                font: 'Poppins'
                            }
                        },
                        {
                            type: 'paragraph',
                            content: 'This is a sample paragraph for the About the Organization section.'
                        },
                        {
                            type: 'stakeholders',
                            stakeholders: [
                                { name: 'John Doe', message: 'Lorem ipsum dolor sit amet.', image: '/img/stakeholder1.png' },
                                { name: 'Jane Smith', message: 'Consectetur adipiscing elit.', image: '/img/stakeholder2.png' },
                                { name: 'Alice Johnson', message: 'Sed do eiusmod tempor incididunt.', image: '/img/stakeholder3.png' }
                            ],
                            settings: {
                                backgroundColor: '#ffffff',
                                fontColor: '#000000',
                                font: 'Poppins'
                            }
                        },
                        {
                            type: 'esgProgressLineChart',
                            chartData: {
                                labels: ['2024', '2025', '2026'],
                                datasets: [
                                    {
                                        label: 'Environmental',
                                        data: [75, 80, 85],
                                        borderColor: '#4CAF50',
                                        backgroundColor: 'rgba(76, 175, 80, 0.2)',
                                    },
                                    {
                                        label: 'Social',
                                        data: [60, 65, 70],
                                        borderColor: '#2196F3',
                                        backgroundColor: 'rgba(33, 150, 243, 0.2)',
                                    },
                                    {
                                        label: 'Governance',
                                        data: [80, 85, 90],
                                        borderColor: '#FF9800',
                                        backgroundColor: 'rgba(255, 152, 0, 0.2)',
                                    }
                                ]
                            },
                            settings: {
                                backgroundColor: '#ffffff',
                                fontColor: '#000000',
                                font: 'Poppins'
                            }
                        },
                        {
                            type: 'esgScorecard',
                            scorecardData: [
                                { name: 'Environmental', score: 75 },
                                { name: 'Social', score: 60 },
                                { name: 'Governance', score: 80 }
                            ],
                            settings: {
                                backgroundColor: '#ffffff',
                                fontColor: '#000000',
                                font: 'Poppins'
                            }
                        }, {
                            type: 'image',
                            images: ['/img/esgscorecard.png', '/img/esgscorecard.png', '/img/esgscorecard.png', '/img/esgscorecard.png', '/img/esgscorecard.png', '/img/esgscorecard.png', '/img/esgscorecard.png', '/img/esgscorecard.png', '/img/esgscorecard.png', '/img/esgscorecard.png', '/img/esgscorecard.png', '/img/esgscorecard.png'],
                            imageType: 'grid',
                            grid: [5, 3]

                        }
                    ]
                },
                {
                    title: 'ESG Progress',
                    headingSize: 'H1',
                    settings: {
                        backgroundColor: '#ffffff',
                        fontColor: '#000000',
                        font: 'Poppins',
                        timeline: '2024 - 2026',
                        locked: false
                    },
                    blocks: []
                },
                {
                    title: 'ESG Progress',
                    headingSize: 'H1',
                    settings: {
                        backgroundColor: '#ffffff',
                        fontColor: '#000000',
                        font: 'Poppins',
                        timeline: '2024 - 2026',
                        locked: false
                    },
                    blocks: []
                },
                {
                    title: 'ESG Score Card',
                    headingSize: 'H1',
                    settings: {
                        backgroundColor: '#ffffff',
                        fontColor: '#000000',
                        font: 'Poppins',
                        timeline: '2024 - 2026',
                        locked: false
                    },
                    blocks: []
                }
            ];
        },
        handleStepChange(newStep) {
            this.step = newStep;
        },
        showSuccess(message) {
            this.snackbar = {
                show: true,
                text: message,
                color: 'success'
            };
        },
        showError(message) {
            this.snackbar = {
                show: true,
                text: message,
                color: 'error'
            };
        },
        async handleCreateEsg() {
            try {
                // Validate required fields first
                if (!this.selectedProtocolId) {
                    this.showError('Please select a protocol first');
                    return;
                }

                // suborganizations should not be empty
                if (this.subOrganizations.length === 0) {
                    this.showError('Please select at least one sub-organization');
                    return;
                }

                // Validate timeline selection
                if (this.timeline.length === 0) {
                    this.showError('Please select at least one timeline year');
                    return;
                }

                // Generate a unique report ID
                const reportId = `ESG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                const organizationId = this.getOrganizationId;

                const reportPayload = {
                    reportId: reportId,
                    reportType: this.reportType === 'Internal Report' ? 'private' : 'public',
                    dateGenerated: new Date().toISOString(),
                    status: 'saved',
                    esgProtocolId: this.selectedProtocolId,
                    reportTimeline:  JSON.parse(JSON.stringify(this.timeline)), // Clean the reactive array
                    subOrganizationIds: this.subOrganizations,
                    templateId: '686e2f8594e5f5ba76cc2de0',
                    organizationId: organizationId,
                };

                console.log('ESG Report Payload:', reportPayload);
                this.startLoading();
                const response = await EsgService.createEsgReport(reportPayload);
                console.log('ESG Report Creation Response:', response);

                if (response?.success === true) {
                    this.resetPayloadData();
                    this.step = 2; // Move to next step
                    this.showSuccess('ESG Report created successfully!');
                    this.stopLoading();
                } else {
                    console.error('Error creating ESG Report:', response.message);
                    this.showError('Failed to create ESG Report. Please try again.');
                    this.stopLoading();
                    return;
                }

            } catch (error) {
                console.error('Error creating ESG Report:', error);
                this.showError('An error occurred while creating the report. Please try again.');
                this.stopLoading();
            }
        },
        resetPayloadData() {
            this.selectedProtocol = null;
            this.selectedProtocolId = null;
            this.reportType = 'Internal Report';
            this.timeline = []; // Reset to empty array
            this.subOrganizations = [];
            this.templates = [];
            this.selectedTemplate = null;
            this.sections = [];
        },
    },
      mixins: [ LoadingMixin ],
};
</script>

<style scoped>
.v-stepper {
    box-shadow: none !important;
}

.v-card__text {
    padding: 6px !important;
}

.v-stepper__content {
    padding: 0px !important;
}
</style>