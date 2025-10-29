<template>
    <v-app>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div class="d-flex mb-4">
                <h2>{{ $t("Create ESG Template") }}</h2>
                <v-spacer></v-spacer>
                <v-btn color="primary" outlined class="mr-2 btn-outline-primary font-weight-bold mb-2"
                    @click="$router.push({ name: 'esgReportsBuilder' })">
                    {{ $t('close') }}
                </v-btn>
                <v-btn color="primary" dark class="mr-2 mb-2" @click="showTemplateSettings = true">
                    {{ $t('Template Settings') }}
                </v-btn>
                <div v-if="step === 1" class="d-flex align-center">
                    <v-btn color="primary" dark class="mr-2 mb-2" @click="step = 2">
                        {{ $t('Next') }}
                    </v-btn>
                </div>
                <div v-else-if="step === 2" class="d-flex align-center">
                    <v-btn color="primary" dark class="mr-2 mb-2" @click="showSaveConfirmation = true">
                        {{ $t('Save') }}
                    </v-btn>
                </div>
            </div>

            <v-card>
                <v-card-text>
                    <!-- Replace v-stepper with custom stepper -->
                    <CustomStepper :current-step="step" :steps="stepperSteps" @step-changed="handleStepChange"
                        class="mb-4" />

                    <div v-if="step === 1" class="mb-9">
                        <v-card flat>
                            <v-card-text>
                                <label for="templateName">Template Name</label>
                                <div class="my-4">
                                    <v-text-field 
                                        outlined
                                        :placeholder="$t('Name of Template')"
                                        dense 
                                        class="shrink" 
                                        v-model="templateName"
                                    ></v-text-field>
                                </div>
                                <div>
                                    <SectionItem v-for="(section, idx) in sections" :key="idx" :section="section"
                                        :index="idx" @delete-section="deleteSection" />
                                    <AddNewButton color="green" @click="addSection()">Add a New Section
                                    </AddNewButton>
                                </div>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn color="primary" @click="step = 1">{{ $t('Back') }}</v-btn>
                                <v-btn color="primary" @click="step = 2">{{ $t('Next') }}</v-btn>
                            </v-card-actions>
                        </v-card>
                    </div>

                    <div v-else-if="step === 2">
                        <v-card flat>
                            <v-card-text>
                                <h3>{{ $t("Preview Report") }}</h3>
                                <p>{{ $t("This is where the report preview will be displayed.") }}</p>
                            </v-card-text>
                            <PreviewSection :sections="reportSections" />
                            <v-card-actions>
                                <v-btn color="primary" @click="step = 1">{{ $t('Back') }}</v-btn>
                                <v-btn color="primary" @click="close">{{ $t('Finish') }}</v-btn>
                            </v-card-actions>
                        </v-card>
                    </div>
                </v-card-text>
            </v-card>
        </v-container>


        <TemplateSettingsDialog v-model="showTemplateSettings" :settings="templateSettings"
            @save="templateSettings = $event" />
        <ConfirmationDialog :visible="showSaveConfirmation" title="Confirmation"
            message="Are you sure you want to save your changes?" confirm-text="CONFIRM" cancel-text="CANCEL"
            type="warning" @cancel="showSaveConfirmation = false" @close="showSaveConfirmation = false"
            @confirm="handleSaveChanges" />

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
import SectionItem from './components/step2/SectionItem.vue';
import AddNewButton from './components/step2/AddNewButton.vue';
import TemplateSettingsDialog from './components/TemplateSettingDialog.vue';
import PreviewSection from './components/step3/PreviewSection.vue';
import ConfirmationDialog from '../components/Confirmation.vue';
import CustomStepper from '../components/CustomStepperTab.vue';
import EsgService from '@/_services/EsgService';
import LoadingMixin from "@/mixins/LoadingMixin";

export default {
    name: 'CreateReport',
    components: {
        SectionItem,
        AddNewButton,
        TemplateSettingsDialog,
        PreviewSection,
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
    async created() {
        this.templateId = this.$route.query.templateId;

        if (this.templateId) {
            const response = await EsgService.getEsgReportTemplateById(this.templateId);

            if (!response.success) {
                this.$router.back();
                return;
            }

            this.templateName = response.data.templateName;
            this.templateSettings =  response.data.templateSettings;
            this.sections = response.data.sections;

            if (this.$route.query.preview === '1') {
                this.step = 2;
            }
        }
    },
    data() {
        return {
            templateId: null,
            step: 1,
            timeline: ['2024', '2025'], // Changed from string to array for multi-select
            breadcrumbs: [
                { text: 'ESG Platform', to: '/esg-platform/esg-dashboard' },
                { text: 'Report Builder', to: '/esg-platform/esg-reports-builder' },
                { text: 'Manage Templates', to: '/esg-platform/manage-template' },
                { text: 'Create Template', active: true },
            ],
            selectedTemplate: null,
            sections: [],
            templateName: '',
            dialog: false,
            selectedSection: null,
            showTemplateSettings: false,
            templateSettings: {
                bgColor: '#ffffff',
                fontColor: '#101010',
                font: 'Poppins',
                pdfHeaderBg: '#244513',
                pdfHeaderFontColor: '#ffffff',
                pdfHeaderFont: 'Poppins',
                logo: ''
            },
            showDialog: false,
            showPublishConfirmation: false,
            sectionsGetByIndex: [],
            preview: false,
            showDownloadMenu: false,
            showSaveConfirmation: false,
            stepperSteps: [
                { title: 'Create Template', tooltip: 'Add new template' },
                { title: 'Preview', tooltip: 'Preview and save your template' }
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
        async handleSaveChanges() {
            if (this.templateName.length === 0 || this.sections.length === 0) {
                this.$notify({
                    type: "error",
                    text: "Empty template cannot be saved",
                });
            }

            const templatePayload = {
                templateName: this.templateName,
                templateSettings: this.templateSettings,
                sections: this.sections
            };

            let response;

            if (this.templateId) {
                // Update the existing template
                response = await EsgService.updateEsgReportTemplate(this.templateId, templatePayload);
            } else {
                // Create new tempalte
                response = await EsgService.createEsgReportTemplates(templatePayload);
            }
            
            if (!response.success) {
                this.$notify({
                    type: "error",
                    text: "Failed to save template",
                });
                this.showSaveConfirmation = false;
            } else {
                this.$notify({
                    type: "success",
                    text: "Failed to save template",
                });
                this.$router.push({ name: 'manageTemplate' });
            }
        },
        close() {
            this.$router.push('/');
        },
        openEditor(section = null) {
            this.selectedSection = section;
            this.dialog = true;
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
        resetPayloadData() {
            this.timeline = []; // Reset to empty array
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