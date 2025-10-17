<template>
    <div>
        <!-- Header -->
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div class="d-flex mb-4">
                <h2>{{ $t("ESG Report Templates") }}</h2>
                <v-spacer></v-spacer>
                <v-btn color="primary" class="mr-2 mb-2" @click="$router.push({ name: 'esgReportsBuilder' })">
                    {{ $t("Back") }}
                </v-btn>
                <v-btn color="primary" dark class="mr-2 mb-2" @click="$router.push({ name: 'createNewEsgReport' })">
                    {{ $t('Create New Template') }}
                </v-btn>
            </div>

            <v-card elevation="0" class="px-5">
                <v-row v-if="paginatedTemplates.length > 0" class="mt-4 mb-10">
                    <TemplateGrid :templates="paginatedTemplates" :total-templates="totalTemplates"
                        :current-page="currentPage" :items-per-page="itemsPerPage" @preview-template="previewTemplate"
                        @edit-template="editTemplate" />
                </v-row>

                <!-- Empty State -->
                <v-row v-else justify="center">
                    <v-col cols="12" class="text-center py-12">
                        <v-icon size="64" color="grey lighten-1" class="mb-4">
                            mdi-file-document-outline
                        </v-icon>
                        <h3 class="text-h6 font-weight-medium mb-2">No templates found</h3>
                        <p class="text-body-1 grey--text mb-6">
                            {{ searchQuery ? 'Try adjusting your search terms.' : 'Get started by creating your first'
                            }}
                        </p>
                        <v-btn color="success" large @click="createNewTemplate">
                            CREATE NEW TEMPLATE
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card>

            <!-- Loading State -->
            <v-row v-if="loading" justify="center">
                <v-col cols="12" class="text-center py-12">
                    <v-progress-circular indeterminate color="success" size="64"></v-progress-circular>
                    <p class="text-body-1 mt-4">Loading templates...</p>
                </v-col>
            </v-row>
        </v-container>

        <!-- Snackbar for notifications -->
        <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout" bottom>
            {{ snackbar.message }}
            <template v-slot:action="{ attrs }">
                <v-btn text v-bind="attrs" @click="snackbar.show = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script>
import TemplateGrid from './components/template-grid.vue';

export default {
    name: 'ESGTemplateManager',
    components: {
        TemplateGrid
    },
    data() {
        return {
            searchQuery: '',
            currentPage: 1,
            itemsPerPage: 8,
            loading: false,
            snackbar: {
                show: false,
                message: '',
                color: 'success',
                timeout: 3000
            },
            breadcrumbs: [
                {
                    text: 'ESG Compliance',
                    disabled: false,
                    href: '#'
                },
                {
                    text: 'Dashboard',
                    disabled: true,
                    href: '#'
                }
            ],
            templates: [
                {
                    id: 1,
                    name: 'Dimitra Template 1',
                    features: ['Overview', 'About the Report', 'About the Organization', 'ESG Progress', 'ESG Score Card'],
                    createdAt: '2024-01-15',
                    lastModified: '2024-01-20',
                    status: 'active'
                },
                {
                    id: 2,
                    name: 'Dimitra Template 2',
                    features: ['Overview', 'ESG Score Card', 'Environmental Impact', 'Social Responsibility', 'Governance Structure'],
                    createdAt: '2024-01-10',
                    lastModified: '2024-01-18',
                    status: 'active'
                },
                {
                    id: 3,
                    name: 'Template 3',
                    features: ['Overview', 'About the Report', 'About the Organization', 'ESG Progress', 'ESG Score Card'],
                    createdAt: '2024-01-08',
                    lastModified: '2024-01-16',
                    status: 'active'
                },
                {
                    id: 4,
                    name: 'Template 4',
                    features: ['Overview', 'About the Report', 'About the Organization', 'ESG Progress', 'ESG Score Card'],
                    createdAt: '2024-01-05',
                    lastModified: '2024-01-14',
                    status: 'draft'
                },
                {
                    id: 5,
                    name: 'Template 5',
                    features: ['Overview', 'About the Report', 'About the Organization', 'ESG Progress', 'ESG Score Card'],
                    createdAt: '2024-01-03',
                    lastModified: '2024-01-12',
                    status: 'active'
                },
                {
                    id: 6,
                    name: 'Sustainability Report Template',
                    features: ['Executive Summary', 'Environmental Metrics', 'Social Impact', 'Governance Framework', 'Future Goals'],
                    createdAt: '2024-01-01',
                    lastModified: '2024-01-10',
                    status: 'active'
                },
                {
                    id: 7,
                    name: 'Corporate ESG Template',
                    features: ['Company Overview', 'ESG Strategy', 'Performance Indicators', 'Stakeholder Engagement', 'Risk Management'],
                    createdAt: '2023-12-28',
                    lastModified: '2024-01-08',
                    status: 'active'
                },
                {
                    id: 8,
                    name: 'Annual ESG Report',
                    features: ['Year in Review', 'ESG Highlights', 'Data Tables', 'Third-party Verification', 'Appendices'],
                    createdAt: '2023-12-25',
                    lastModified: '2024-01-06',
                    status: 'draft'
                },
                {
                    id: 9,
                    name: 'Quarterly ESG Update',
                    features: ['Performance Summary', 'Key Metrics', 'Progress Updates', 'Upcoming Initiatives'],
                    createdAt: '2023-12-20',
                    lastModified: '2024-01-04',
                    status: 'active'
                },
                {
                    id: 10,
                    name: 'ESG Compliance Report',
                    features: ['Regulatory Overview', 'Compliance Status', 'Risk Assessment', 'Remediation Plans'],
                    createdAt: '2023-12-15',
                    lastModified: '2024-01-02',
                    status: 'active'
                }
            ]
        }
    },
    computed: {
        filteredTemplates() {
            if (!this.searchQuery) return this.templates

            return this.templates.filter(template =>
                template.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                template.features.some(feature =>
                    feature.toLowerCase().includes(this.searchQuery.toLowerCase())
                )
            )
        },
        totalTemplates() {
            return this.filteredTemplates.length
        },
        totalPages() {
            return Math.ceil(this.totalTemplates / this.itemsPerPage)
        },
        startIndex() {
            if (this.totalTemplates === 0) return 0
            return (this.currentPage - 1) * this.itemsPerPage + 1
        },
        paginatedTemplates() {
            const start = (this.currentPage - 1) * this.itemsPerPage
            const end = start + this.itemsPerPage
            return this.filteredTemplates.slice(start, end)
        }
    },
    watch: {
        searchQuery() {
            this.currentPage = 1
        }
    },
    mounted() {
        this.showSnackbar('ESG Template Manager loaded successfully', 'success')
    },
    methods: {
        previousPage() {
            if (this.currentPage > 1) {
                this.currentPage--
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++
            }
        },
        goBack() {
            this.showSnackbar('Navigating back...', 'info')
            // Implement navigation logic
            this.$router.go(-1)
        },
        createNewTemplate() {
            this.showSnackbar('Opening template creation...', 'info')
            // Implement create template logic
            this.$router.push('/templates/create')
        },
        previewTemplate(template) {
            this.showSnackbar(`Previewing ${template.name}`, 'info')
            // Implement preview logic
            this.$router.push(`/templates/${template.id}/preview`)
        },
        editTemplate(template) {
            this.showSnackbar(`Editing ${template.name}`, 'info')
            // Implement edit logic
            this.$router.push(`/templates/${template.id}/edit`)
        },
        showSnackbar(message, color = 'success') {
            this.snackbar.message = message
            this.snackbar.color = color
            this.snackbar.show = true
        },
        loadTemplates() {
            this.loading = true
            // Simulate API call
            setTimeout(() => {
                this.loading = false
                this.showSnackbar(`Loaded ${this.templates.length} templates`, 'success')
            }, 1000)
        }
    }
}
</script>

<style scoped>
.fill-height {
    height: 100%;
}

.min-height-auto {
    min-height: auto !important;
}

.flex-grow-1 {
    flex-grow: 1;
}

/* Custom responsive adjustments */
@media (max-width: 600px) {
    .text-right {
        text-align: left !important;
    }
}
</style>