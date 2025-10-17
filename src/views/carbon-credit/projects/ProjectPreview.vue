<template>
    <div>
        <!-- Header Image as Background with Overlayed Content (no avatar) -->
        <div class="project-header-image"
            :style="{ backgroundImage: `url('${form.headerImage || require('../../../assets/img/header-image-default.png')}')` }">
            <div class="header-container">
                <div class="header-overlay"></div>
                <v-btn class="back-btn" outlined @click="$router.go(-1)">
                    <v-icon left>mdi-arrow-left</v-icon>
                    {{ $t('carbonCredit.back') }}
                </v-btn>
                <div class="header-center-content">
                    <h1 class="project-title">{{ form.project_title }}</h1>
                    <div class="header-meta">
                        <span class="carbon-credit-label">
                            <span class="carbon-credit-icon-circle">
                                <img src="@/assets/icons/carbon_factory.png" alt="carbon credit icon" />
                            </span>
                            {{ $t('carbonCredit.title').toUpperCase() }}
                        </span>
                        <span class="country-label">
                            {{ orgCountry || '-' }}
                            <img v-if="orgCountryCode" :src="`https://flagcdn.com/w20/${orgCountryCode.toLowerCase()}.png`" alt="flag" class="country-flag" />
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <!-- End Header Image -->
        <div class="project-container" style="width: 810px;">
            <div>
                <v-row>
                    <v-col cols="12">
                        <div class="d-flex align-center">
                            <label class="view-label">{{ $t('carbonCredit.register.description') }}</label>
                        </div>
                        <div class="view-label multi-line">{{ form.description }}</div>
                    </v-col>
                </v-row>
                <!-- Responsible Dimitra Office Section (Expandable) -->
                <v-expansion-panels flat class="mt-8 mb-4">
                    <v-expansion-panel>
                        <v-expansion-panel-header class="font-weight-medium bordered-expansion">
                            {{ $t('carbonCredit.register.responsibleDimitraOffice') }}
                        </v-expansion-panel-header>
                        <v-expansion-panel-content class="mt-4">
                            <div class="dimitra-office-container">
                                <v-row>
                                    <v-col cols="6">
                                        <div class="dimitra-office-item">
                                            <span class="dimitra-office-label">{{ $t('carbonCredit.register.officeName') }}</span>
                                            <span class="dimitra-office-value">{{ office?.officeName || '-' }}</span>
                                        </div>
                                    </v-col>
                                    <v-col cols="6">
                                        <div class="dimitra-office-item">
                                            <span class="dimitra-office-label">{{ $t('carbonCredit.register.contactPerson') }}</span>
                                            <span class="dimitra-office-value">{{ office?.contactPerson || '-' }}</span>
                                        </div>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="6">
                                        <div class="dimitra-office-item">
                                            <span class="dimitra-office-label">{{ $t('carbonCredit.register.phoneNumber') }}</span>
                                            <span class="dimitra-office-value">{{ office?.phoneNumber || '-' }}</span>
                                        </div>
                                    </v-col>
                                    <v-col cols="6">
                                        <div class="dimitra-office-item">
                                            <span class="dimitra-office-label">{{ $t('carbonCredit.register.email') }}</span>
                                            <span class="dimitra-office-value">{{ office?.email || '-' }}</span>
                                        </div>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="6">
                                        <div class="dimitra-office-item address-item">
                                            <div class="dimitra-office-label-stacked">{{ $t('carbonCredit.register.address') }}</div>
                                            <div class="dimitra-office-value-stacked">{{ office?.address || '-' }}</div>
                                        </div>
                                    </v-col>
                                </v-row>
                            </div>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
                <v-expansion-panels flat class="mb-4">
                    <v-expansion-panel>
                        <v-expansion-panel-header class="font-weight-medium bordered-expansion">
                            {{ $t('carbonCredit.register.organizationDetails') }}
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <div class='mt-4'>
                                <!-- Organizations Table -->
                                <v-data-table 
                                    :headers="orgTableHeaders" 
                                    :items="filteredOrganizations"
                                    :items-per-page="limit" 
                                    hide-default-footer
                                    class="organization-table"
                                >
                                    <template v-slot:body="{ items }">
                                        <tbody>
                                            <template v-for="org in items">
                                                <!-- Parent Organization Row -->
                                                <tr :key="`parent-${org.id}`" class="parent-org-row">
                                                    <td>
                                                        <div class="d-flex align-center">
                                                            <v-btn 
                                                                v-if="org.subOrganizations && org.subOrganizations.length > 0"
                                                                icon 
                                                                small 
                                                                @click="toggleOrgExpansion(org.id)"
                                                                class="mr-2"
                                                            >
                                                                <v-icon>
                                                                    {{ expandedOrgs.includes(org.id) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                                                                </v-icon>
                                                            </v-btn>
                                                            <div v-else class="org-name-spacer mr-2"></div>
                                                            <span>{{ org.name || '' }}</span>
                                                        </div>
                                                    </td>
                                                    <td>{{ org.country || '' }}</td>
                                                    <td>
                                                        <a href="javascript:void(0)" @click="showOrganizationDialog(org)" style="color: #00BD73;">
                                                            {{ $t('carbonCredit.register.viewDetails') }}
                                                        </a>
                                                    </td>
                                                </tr>
                                                
                                                <!-- Sub-Organizations Header (when expanded) -->
                                                <tr v-if="expandedOrgs.includes(org.id) && org.subOrganizations && org.subOrganizations.length > 0" :key="`sub-header-${org.id}`" class="sub-org-header-row">
                                                    <td class="sub-org-header-cell">
                                                        <div class="sub-org-header-text">
                                                            {{ $t('carbonCredit.projectInfo.subOrganizations') }}
                                                        </div>
                                                    </td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                                
                                                <!-- Sub-Organizations List -->
                                                <template v-if="expandedOrgs.includes(org.id) && org.subOrganizations && org.subOrganizations.length > 0">
                                                    <tr v-for="subOrg in org.subOrganizations" :key="`sub-${org.id}-${subOrg.id}`" class="sub-org-row">
                                                        <td class="sub-org-name-cell">
                                                            <div class="d-flex align-center">
                                                                <span>{{ subOrg.name || '' }}</span>
                                                            </div>
                                                        </td>
                                                        <td class="sub-org-country-cell">{{ subOrg.country || '' }}</td>
                                                        <td></td>
                                                    </tr>
                                                </template>
                                            </template>
                                        </tbody>
                                    </template>
                                </v-data-table>
                            </div>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
                <!-- Project Info Section -->
                <v-expansion-panels flat class="mb-4">
                    <v-expansion-panel>
                        <v-expansion-panel-header class="font-weight-medium bordered-expansion">
                            {{ $t('carbonCredit.register.projectInfo') }}
                        </v-expansion-panel-header>
                        <v-expansion-panel-content class="mt-4">
                            <div class="dimitra-office-container">
                                <v-row>
                                    <v-col cols="6">
                                        <div class="dimitra-office-item">
                                            <span class="dimitra-office-label">{{ $t('carbonCredit.register.status') }}</span>
                                            <span class="dimitra-office-value">{{ getStatusLabel(form.status) }}</span>
                                        </div>
                                    </v-col>
                                    <v-col cols="6">
                                        <div class="dimitra-office-item">
                                            <span class="dimitra-office-label">{{ $t('carbonCredit.register.standardMethodology') }}</span>
                                            <span class="dimitra-office-value">{{ form.standard }}</span>
                                        </div>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="6">
                                        <div class="dimitra-office-item">
                                            <span class="dimitra-office-label">{{ $t('carbonCredit.register.creditType') }}</span>
                                            <span class="dimitra-office-value">{{ getCreditTypeLabel(form.creditType) }}</span>
                                        </div>
                                    </v-col>
                                    <v-col cols="6">
                                        <div class="dimitra-office-item">
                                            <span class="dimitra-office-label">{{ $t('carbonCredit.register.validationDocumentation') }}</span>
                                            <span class="dimitra-office-value">
                                                <span v-for="(file, index) in form.validationDocumentation" :key="index" class="mr-3">
                                                    <a :href="file.s3_url" target="_blank" style="color: #333; text-decoration: underline;">{{ file.file_name }}</a>
                                                </span>
                                            </span>
                                        </div>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="6">
                                        <div class="dimitra-office-item">
                                            <span class="dimitra-office-label">{{ $t('carbonCredit.register.creditStart') }}</span>
                                            <span class="dimitra-office-value">{{ form.creditStart }}</span>
                                        </div>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="6">
                                        <div class="dimitra-office-item">
                                            <span class="dimitra-office-label">{{ $t('carbonCredit.register.creditEnd') }}</span>
                                            <span class="dimitra-office-value">{{ form.creditEnd }}</span>
                                        </div>
                                    </v-col>
                                </v-row>
                            </div>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
                <!-- Vintage Section -->
                <v-expansion-panels flat class="mb-4">
                    <v-expansion-panel>
                        <v-expansion-panel-header class="font-weight-medium bordered-expansion">
                            {{ $t('carbonCredit.register.vintage') }}
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-data-table :headers="vintageHeaders" :items="form.vintageRows" item-key="year" class="mt-6"
                                hide-default-footer>
                                <template v-slot:item.year="{ item }">
                                    <span>{{ item.year }}</span>
                                </template>
                                <template v-slot:item.credits="{ item }">
                                    <span>{{ item.credits }}</span>
                                </template>
                                <template v-slot:item.price="{ item }">
                                    <span>{{ item.price }} {{ form.currency }}</span>
                                </template>
                            </v-data-table>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
                <!-- Attachments -->
                <v-expansion-panels flat class="mb-4">
                    <v-expansion-panel>
                        <v-expansion-panel-header class="font-weight-medium bordered-expansion">
                            {{ $t('carbonCredit.register.attachmentTitle') }}
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-row dense class="mt-4">
                                <v-col v-for="file in form.attachmentFile" :key="file.id" cols="auto" class="mr-4 mb-4">
                                    <div class="attachment-thumbnail" @click="openMediaModal(file)"
                                        style="cursor: pointer; width: 138px; height: 104px; display: flex; align-items: center; justify-content: center; border-radius: 6px; border: 1px solid #ddd; overflow: hidden; position: relative;">
                                        <img v-if="file.file_type && file.file_type.startsWith('image')"
                                            :src="file.s3_url" alt="Preview"
                                            style="width: 100%; height: 100%; object-fit: cover;" />
                                        <template v-else-if="file.file_type && file.file_type.startsWith('video')">
                                            <video
                                                :src="file.s3_url"
                                                style="width: 100%; height: 100%; object-fit: cover; background: #000;"
                                                muted playsinline preload="metadata"
                                            ></video>
                                            <v-icon
                                                class="play-overlay"
                                                style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); font-size: 36px; color: white; text-shadow: 0 0 8px #000; pointer-events: none;"
                                                large
                                            >mdi-play-circle</v-icon>
                                        </template>
                                        <v-icon v-else-if="file.file_type && file.file_type.startsWith('audio')"
                                            style="font-size: 40px;">mdi-music</v-icon>
                                        <span v-else class="text-caption text-truncate" style="padding: 4px;">{{
                                            file.file_name
                                        }}</span>
                                    </div>
                                </v-col>
                            </v-row>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
                <!-- SDGs -->
                <v-expansion-panels flat class="mb-4">
                    <v-expansion-panel>
                        <v-expansion-panel-header class="font-weight-medium bordered-expansion">
                            {{ $t('carbonCredit.register.sdgsTitle') }}
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-row>
                                <v-col v-for="sdg in filteredSdgs" :key="sdg.id" cols="12" class="d-flex align-start mt-4 mb-4">
                                    <div class="d-flex flex-column">
                                        <div class="d-flex align-start">
                                            <img :src="sdg.icon" alt="sdg icon" height="80" width="80" class="mr-3"
                                                style="border-radius: 4px; object-fit: cover;" />
                                            <div class="d-flex flex-column">
                                                <span class="text-body-1 font-weight-bold mb-2">{{ sdg.title }}</span>
                                                <div class="sdg-description-text">{{ sdg.description }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </v-col>
                            </v-row>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
                <!-- Data Collection Cycle -->
                <v-expansion-panels flat class="mb-4">
                    <v-expansion-panel>
                        <v-expansion-panel-header class="font-weight-medium bordered-expansion">
                            {{ $t('carbonCredit.register.dataCollectionTitle') }}
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <p class="my-4">
                                {{ $t('carbonCredit.register.dataCollectionInfo') }}
                            </p>
                            <v-data-table :headers="dataCycleHeaders" :items="dataCollectionModules" item-key="name"
                                class="elevation-1" hide-default-footer>
                                <!-- Frequency input + unit select -->
                                <template v-slot:item.recurring="{ item }">
                                    {{ item.frequency }} {{ item.unit }}
                                </template>
                                <!-- Score (read-only) -->
                                <template v-slot:item.score="{ item }">
                                    {{ item.score }}
                                </template>
                                <!-- Approval (read-only) -->
                                <template v-slot:item.approval="{ item }">
                                    {{ item.approval }}
                                </template>
                            </v-data-table>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </div>
        </div>
        
        <MultimediaModal :show.sync="showMultimediaModal" :file="selectedMedia" :allFiles="form.attachmentFile"
            @close="showMultimediaModal = false" @update:media="selectedMedia = $event" />

        <!-- Organization Info Component -->
        <OrganizationInfo 
            :dialogI="showOrgDialog"
            :organizationId="selectedOrganization?.id"
            :project="organizationProjectData"
            @update:dialog="showOrgDialog = $event"
        />
    </div>
</template>

<script>
import loadingMixin from '@/mixins/LoadingMixin';
import MultimediaModal from "./components/MultimediaModal.vue";
import OrganizationInfo from "./components/organizationInfo.vue";
import CarbonCreditService from '../../../_services/CarbonCreditService';
import { getCountries } from 'country-state-picker';

export default {
    mixins: [loadingMixin],
    components: {
        MultimediaModal,
        OrganizationInfo,
    },
    data() {
        return {
            projectId: null,
            breadcrumbs: [
                { text: this.$t('carbonCredit.dashboard'), disabled: false },
                { text: this.$t('carbonCredit.title'), disabled: false },
                { text: this.$t('carbonCredit.projects'), disabled: false },
                { text: this.$t('carbonCredit.view'), disabled: true },
            ],
            form: {
                project_title: '',
                project_type: '',
                description: '',
                status: '',
                creditType: '',
                creditStart: '',
                creditEnd: '',
                standard: '',
                validationDocumentation: [],
                agreement: [
                    {
                        file_name: 'Attachment1.pdf',
                        s3_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                        file_type: 'application/pdf',
                    },
                ],
                headerImage: '',
                country: '',
                country_code: '',
            },
            office: null,
            organizations: [],
            filteredOrganizations: [],
            orgTableHeaders: [
                { text: this.$t('carbonCredit.projectInfo.organizations'), value: 'name' },
                { text: this.$t('carbonCredit.projectInfo.country'), value: 'country' },
                { text: '', value: 'actions', sortable: false },
            ],
            orgPage: 1,
            limit: 5,
            orgFrom: 1,
            orgTo: 5,
            orgTotalPages: 1,
            sdgs: [],
            selectedSdgs: [],
            currencies: ['USD', 'EUR', 'AUD'],
            vintageHeaders: [
                { text: this.$t('carbonCredit.register.vintageYear'), value: 'year' },
                { text: this.$t('carbonCredit.register.estimatedCredit'), value: 'credits' },
                { text: this.$t('carbonCredit.register.pricePerCredit'), value: 'price' }
            ],
            dataCycleHeaders: [
                { text: this.$t('carbonCredit.register.moduleName'), value: 'name' },
                { text: this.$t('carbonCredit.register.futureData'), value: 'recurring' },
                { text: this.$t('carbonCredit.register.score'), value: 'score' },
                { text: this.$t('carbonCredit.register.approval'), value: 'approval' }
            ],
            dataCollectionModules: [],
            showMultimediaModal: false,
            selectedMedia: null,
            allFilesForModal: [],
            expandedOrgId: null,
            orgCountry: '',
            orgCountryCode: '',
            showOrgDialog: false,
            selectedOrganization: null,
            expandedOrgs: [],
        };
    },
    computed: {
        filteredSdgs() {
            return this.sdgs.filter(sdg => this.selectedSdgs.includes(sdg.id));
        },

        organizationProjectData() {
            if (!this.selectedOrganization) return {};
            
            return {
                country: this.selectedOrganization.country || '',
                organization: this.selectedOrganization.name || '',
                address: this.selectedOrganization.address || '',
                blockchain: this.selectedOrganization.blockchain || '',
                creditType: this.getCreditTypeLabel(this.form.creditType) || '',
                projectType: this.getProjectTypeLabel(this.form.project_type) || '',
                subOrganizations: this.selectedOrganization.subOrganizations?.map(subOrg => ({
                    id: subOrg.id,
                    name: subOrg.name,
                    users: subOrg.users || [],
                    registrationDate: subOrg.registrationDate || subOrg.createdAt || ''
                })) || []
            };
        },
    },
    async mounted() {
        this.projectId = this.$route.params.id;
        const d = this.$store.state.project.currentProject;
        if (d) {
            this.form.project_title = d.project_title;
            this.form.project_type = d.project_type;
            this.form.description = d.description;
            this.form.status = d.status;
            this.form.creditType = d.creditType;
            this.form.creditStart = d.creditStart;
            this.form.creditEnd = d.creditEnd;
            this.form.standard = d.standard;
            if (Array.isArray(d.validationDocumentation)) {
                this.form.validationDocumentation = d.validationDocumentation;
            } else if (typeof d.validationDocumentation === 'string' && d.validationDocumentation) {
                this.form.validationDocumentation = [{
                    file_name: d.validationDocumentation.split('/').pop(),
                    s3_url: d.validationDocumentation,
                    file_type: d.validationDocumentation.split('.').pop()
                }];
            } else {
                this.form.validationDocumentation = [];
            }
            // Process organizations and attach sub-organizations based on parent-child relationship
            this.organizations = this.processOrganizationsWithSubs(d.organizations || []);
            let org = this.organizations.find(o => o.code === 'dimitra_internal') || this.organizations[0];
            if (org) {
                this.orgCountry = org.country || '';
                const countryObj = getCountries().find(c => c.name.toLowerCase() === (org.country || '').toLowerCase());
                this.orgCountryCode = countryObj ? countryObj.code : '';
            }
            this.form.vintage = d.vintage_year;
            this.form.currency = d.currency;
            this.form.country = d.country || '';
            this.form.country_code = d.country_code || '';
            this.form.vintageRows = d.vintageRows || [];
            this.form.attachmentFile = d.attachmentFile || [];
            this.selectedSdgs = d.selectedSdgs || [];
            this.dataCollectionModules = d.dataCollectionModules || [];
            this.sdgs = d.sdgs || [];
            this.form.agreement = d.agreement || [];
            this.form.headerImage = d.headerImage || '';
            this.office = d.office || null;
            this.updatePagination();
            this.$store.dispatch('project/clearCurrentProject');
        } else if (this.projectId) {
            try {
                this.startLoading();
                const res = await CarbonCreditService.getCarbonCreditProjectById(this.projectId);
                if (res.success && res.data) {
                    const d = res.data;
                    this.form.project_title = d.project_title;
                    this.form.project_type = d.project_type;
                    this.form.description = d.description;
                    this.form.status = d.status;
                    this.form.creditType = d.credit_type;
                    this.form.creditStart = d.credit_start_date?.split('T')[0];
                    this.form.creditEnd = d.credit_end_date?.split('T')[0];
                    this.form.standard = d.standard_methodology;
                    if (Array.isArray(d.validation_documentation)) {
                        this.form.validationDocumentation = d.validation_documentation;
                    } else if (typeof d.validation_documentation === 'string' && d.validation_documentation) {
                        this.form.validationDocumentation = [{
                            file_name: d.validation_documentation.split('/').pop(),
                            s3_url: d.validation_documentation,
                            file_type: d.validation_documentation.split('.').pop()
                        }];
                    } else {
                        this.form.validationDocumentation = [];
                    }
                    // Process organizations and attach sub-organizations based on parent-child relationship
                    this.organizations = this.processOrganizationsWithSubs(d.organizations || []);
                    let org = this.organizations.find(o => o.code === 'dimitra_internal') || this.organizations[0];
                    if (org) {
                        this.orgCountry = org.country || '';
                        const countryObj = getCountries().find(c => c.name.toLowerCase() === (org.country || '').toLowerCase());
                        this.orgCountryCode = countryObj ? countryObj.code : '';
                    }
                    this.form.vintage = d.vintage_year;
                    this.form.currency = d.vintage_currency;
                    this.form.country = d.country || '';
                    this.form.country_code = d.country_code || '';
                    // Vintage data
                    this.form.vintageRows = d.vintages?.map(v => ({
                        year: v.vintage_year,
                        credits: v.number_of_credits_estimated,
                        price: v.price_per_credit
                    })) || [];
                    this.form.attachmentFile = d.attachments || [];
                    this.selectedSdgs = d.sdgs?.map(s => s.id) || [];
                    // Data Collection Modules
                    this.dataCollectionModules = d.modules?.map(m => ({
                        name: m.module_name,
                        enabled: m.enabled,
                        frequency: m.recurring_time,
                        unit: m.recurring_period === 'M' ? 'Month(s)' : 'Year(s)',
                        score: m.score,
                        approval: `${m.approval}%`
                    })) || [];
                    // SDGs (array of objects with id, icon, title, description)
                    this.sdgs = (d.sdgs || []).map(s => ({
                        id: s.id,
                        icon: s.icon,
                        title: typeof s.title === 'object' ? s.title.msg : s.title,
                        description: typeof s.description === 'object' ? s.description.msg : s.description
                    }));
                    // Add agreement and headerImage from backend if available
                    this.form.agreement = [
                        ...(Array.isArray(d.agreement) ? d.agreement : []),
                        {
                            file_name: 'Attachment1.pdf',
                            s3_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                            file_type: 'application/pdf',
                        },
                    ];
                    this.form.headerImage = d.header_image || '';
                    this.office = d.office || null;
                    this.updatePagination();
                }
            } catch (err) {
                console.error('Failed to load project:', err);
            } finally {
                this.stopLoading();
            }
        }
    },
    methods: {
        filterOrganizations() {
            this.orgPage = 1;
            this.updatePagination();
        },
        changeOrgPage(next) {
            this.orgPage += next ? 1 : -1;
            this.updatePagination();
        },
        getFileIcon(fileType) {
            if (fileType.startsWith('video')) return 'mdi-play-circle';
            if (fileType.startsWith('audio')) return 'mdi-music';
            return 'mdi-file-document';
        },
        openMediaModal(file, allFiles = null) {
            this.selectedMedia = file;
            this.allFilesForModal = allFiles || this.form.attachmentFile;
            this.showMultimediaModal = true;
        },
        updatePagination() {
            const filtered = [...this.organizations];
            this.orgTotalPages = Math.ceil(filtered.length / this.limit);
            const start = (this.orgPage - 1) * this.limit;
            const end = this.orgPage * this.limit;
            this.filteredOrganizations = filtered.slice(start, end);
            this.orgFrom = filtered.length ? start + 1 : 0;
            this.orgTo = Math.min(end, filtered.length);
        },
        previewProject() {
            this.$router.push(`/carbon-credit/projects/preview/${this.projectId}`);
        },
        toggleOrgDetails(orgId) {
            this.expandedOrgId = this.expandedOrgId === orgId ? null : orgId;
        },
        showOrganizationDialog(org) {
            this.selectedOrganization = org;
            this.showOrgDialog = true;
        },
        toggleOrgExpansion(orgId) {
            const index = this.expandedOrgs.indexOf(orgId);
            if (index > -1) {
                this.expandedOrgs.splice(index, 1);
            } else {
                this.expandedOrgs.push(orgId);
            }
        },

        getStatusLabel(value) {
            const statuses = [
                { text: this.$t('carbonCredit.planned'), value: "planned" },
                { text: this.$t('carbonCredit.operational'), value: "operational" },
                { text: this.$t('carbonCredit.deactivated'), value: "deactivate" }
            ];
            const found = statuses.find(status => status.value === value);
            return found ? found.text : value;
        },
        getCreditTypeLabel(value) {
            const creditTypes = [
                { text: this.$t('carbonCredit.register.removal'), value: "removal" },
                { text: this.$t('carbonCredit.register.avoided'), value: "avoided" }
            ];
            const found = creditTypes.find(type => type.value === value);
            return found ? found.text : value;
        },
        getProjectTypeLabel(value) {
            const projectTypes = [
                { text: this.$t('carbonCredit.agroforestry'), value: "agroforestry" },
                { text: this.$t('carbonCredit.regenerative_agriculture'), value: "regenerative_agriculture" },
                { text: this.$t('carbonCredit.forestry'), value: "forestry" }
            ];
            const found = projectTypes.find(type => type.value === value);
            return found ? found.text : value;
        },

        processOrganizationsWithSubs(organizations) {
            try {
                // Separate parent and sub organizations
                const parentOrgs = organizations.filter(org => !org.isSubOrganization);
                const subOrgs = organizations.filter(org => org.isSubOrganization);

                // Process parent organizations and attach their sub-organizations
                const processedOrgs = parentOrgs.map(parentOrg => {
                    // Find sub-organizations for this parent
                    const subOrganizations = subOrgs.filter(subOrg => subOrg.parentId === parentOrg.id);
                    
                    return {
                        ...parentOrg,
                        address: parentOrg.address || '',
                        website: parentOrg.website || '',
                        subOrganizations: subOrganizations.map(sub => ({
                            ...sub,
                            address: sub.address || '',
                            website: sub.website || ''
                        }))
                    };
                });

                return processedOrgs;
            } catch (error) {
                console.error('Error processing organizations with sub-organizations:', error);
                // Fallback: return original organizations
                return organizations.map(org => ({
                    ...org,
                    address: org.address || '',
                    website: org.website || '',
                    subOrganizations: org.subOrganizations || []
                }));
            }
        },

    },
};
</script>

<style scoped>
.view-block {
    background-color: #E5F8F1;
    padding: 1rem;
    border-radius: 6px;
    margin-bottom: 1rem;
}

.view-label {
    font-size: 16px;
    color: #555;
    margin-bottom: 4px;
    display: block;
    font-weight: 300;
}

.view-value {
    font-weight: bold;
    font-size: 1rem;
    color: #333;
}

.multi-line {
    white-space: pre-wrap;
}

.bordered-expansion {
    border: none;
    border-radius: 6px;
    background-color: #f5f5f5;
    box-shadow: none;
}

.gray-expansion-header {
    background-color: #f5f5f5 !important;
    border: none !important;
    box-shadow: none !important;
    border-radius: 6px !important;
    color: #333 !important;
}

.v-data-table {
    /* Remove background and border for organization details table */
    background-color: transparent;
    border-radius: 0;
    border: none;
}

.v-data-table /deep/ th {
    background-color: #00BD73;
    color: white !important;
}

.pdf-box {
    height: 90px;
    width: 90px;
    background-color: #e5f8f1;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    border-radius: 4px;
}

.file-extension {
    font-size: 16px;
    color: #135b00;
    margin: 0;
    line-height: 1;
    font-weight: 600;
}

.file-name {
    display: block;
    font-size: 16px;
    color: #333;
    margin-top: 5px;
    text-align: center;
    word-break: break-all;
    font-weight: 600;
}

.docs-box {
    display: flex;
    justify-content: center;
}

.docs-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.img-item {
    display: flex;
    flex-direction: column;
    align-items: left;
}

.dimitra-office-container {
    padding: 20px;
}

.dimitra-office-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 16px;
    border-bottom: 1px solid #e0e0e0;
}

.dimitra-office-label {
    font-size: 14px;
    color: #757575;
    font-weight: 400;
    text-align: left;
}

.dimitra-office-value {
    font-size: 16px;
    color: #333;
    font-weight: 600;
    text-align: right;
    word-break: break-word;
}

.dimitra-office-item.address-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
}

.dimitra-office-label-stacked {
    font-size: 14px;
    color: #757575;
    font-weight: 400;
    text-align: left;
}

.dimitra-office-value-stacked {
    font-size: 16px;
    color: #333;
    font-weight: 600;
    text-align: left;
    word-break: break-word;
}

.sdg-description-text {
    color: #666;
    font-size: 14px;
    line-height: 1.5;
}

.project-header-image {
    position: relative;
    width: 100vw;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
    height: 420px;
    background-size: cover;
    background-position: center;
    border-radius: 0;
    margin-bottom: 32px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    overflow: hidden;
}

.header-container {
    position: relative;
    width: 100%;
    height: 100%;
    margin-left: 15%;
    margin-top: 5%;
}

.header-center-content {
    position: absolute;
    top: 50%;
    left: 48px;
    transform: translateY(-50%);
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.project-title {
    font-size: 2.8rem;
    font-weight: 700;
    margin-bottom: 18px;
    color: #fff;
    text-align: left;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
}

.header-meta {
    display: flex;
    align-items: center;
    gap: 32px;
    justify-content: flex-start;
}

.carbon-credit-label {
    display: flex;
    align-items: center;
    background: transparent;
    color: white;
    padding: 6px 22px 6px 0;
    border-radius: 24px;
    font-weight: 700;
    font-size: 1.1rem;
    box-shadow: none;
}

.meta-icon {
    margin-right: 8px;
    color: #00BD73;
}

.country-label {
    display: flex;
    align-items: center;
    font-size: 1.1rem;
    font-weight: 600;
    background: transparent;
    color: white;
    padding: 6px 18px;
    border-radius: 24px;
    box-shadow: none;
    min-width: 0;
    overflow: visible;
    white-space: nowrap;
}

.country-flag {
    width: 28px;
    height: 20px;
    margin-left: 10px;
    border-radius: 3px;
    object-fit: cover;
    border: 1px solid #eee;
    flex-shrink: 0;
}

.back-btn {
    position: absolute;
    top: 32px;
    left: 48px;
    z-index: 3;
    background: transparent !important;
    color: #fff !important;
    border-color: #fff !important;
    font-weight: 500;
    font-size: 1.6rem;
    text-transform: none;
    box-shadow: none;
    height: 3rem !important;
}

.back-btn .v-icon {
    color: #fff !important;
}

.carbon-credit-icon-circle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #fff;
    border: 2px solid #00BD73;
    margin-right: 12px;
}

.carbon-credit-icon-circle img {
    width: 22px;
    height: 22px;
    object-fit: contain;
}



/* Organization table styling */
.organization-table .parent-org-row {
    background-color: #ffffff;
    font-weight: 500;
}

.organization-table .sub-org-header-row {
    background-color: #f8f9fa;
    border-top: 1px solid #e0e0e0;
}

.organization-table .sub-org-header-cell {
    padding-left: 48px !important;
    margin-left: 0 !important;
}

.organization-table .sub-org-header-text {
    font-weight: 700;
    color: #333;
    font-size: 14px;
    padding: 8px 0;
    margin-left: 0 !important;
    text-align: left;
}

.organization-table .sub-org-row {
    background-color: #ffffff;
    font-weight: 400;
}

.organization-table .sub-org-name-cell {
    padding-left: 48px;
}

.organization-table .sub-org-country-cell {
    padding-left: 0;
    text-align: left;
}

/* Ensure proper column alignment */
.organization-table .v-data-table__wrapper table {
    table-layout: fixed;
}

.organization-table .v-data-table__wrapper table th,
.organization-table .v-data-table__wrapper table td {
    vertical-align: top;
}

/* Ensure country column alignment */
.organization-table .v-data-table__wrapper table td:nth-child(2) {
    text-align: left;
    padding-left: 16px;
}

.org-name-spacer {
    width: 24px;
    height: 24px;
}

/* Center all table content horizontally */
.organization-table .v-data-table__wrapper table td {
    text-align: center;
    vertical-align: middle;
}

.organization-table .v-data-table__wrapper table th {
    text-align: center;
    vertical-align: middle;
}



.organization-table .v-data-table__wrapper table tbody tr:hover {
    background-color: #e8f5e8 !important;
}

.organization-table .v-data-table__wrapper table thead tr th {
    background-color: #117443;
    color: white !important;
    font-weight: 600;
}


.project-container {
    margin-left: 12%;
    background: #fff;
    padding: 32px 32px 24px 32px;
}

.v-data-table /deep/ th {
    background-color: #117443;
    color: white !important;
}
</style>