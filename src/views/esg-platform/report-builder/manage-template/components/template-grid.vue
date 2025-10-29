<template>
    <div class="pa-6 fill-height w-100">

        <h3 class="text-h6 mb-4">List of Templates</h3>

        <!-- Search and Pagination Controls -->
        <div class="d-flex">
            <!-- Search -->
            <v-text-field prepend-inner-icon="mdi-magnify" style="width: 300px" outlined height="5px"
                :placeholder="$t('search')" dense v-model="options.searchPhrase" @input="handleSearchByPhrase" class="shrink"
                clearable></v-text-field>

            <!-- Pagination Info and Controls -->
            <v-spacer></v-spacer>
            <div class="py-1 title">
                {{ options.page }} - {{ totalPages }} {{ $t("of") }}
                {{ totalTemplates }}
            </div>
            <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page <= 1"
                @click="pageChange(false)">
                <v-icon dark> mdi-chevron-left </v-icon>
            </v-btn>
            <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page >= totalPages"
                @click="pageChange(true)">
                <v-icon dark> mdi-chevron-right </v-icon>
            </v-btn>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
            <v-progress-circular indeterminate color="success" size="64"></v-progress-circular>
            <p class="text-body-1 mt-4">{{ loadingText }}</p>
        </div>

        <!-- Templates Grid -->
        <v-row v-else-if="paginatedTemplates.length > 0">
            <v-col v-for="template in paginatedTemplates" :key="template._id" cols="12" sm="6" md="4" lg="3"
                class="mb-8">
                <v-card class="fill-height template-card pa-2 custom-radius shadow" outlined hover title="Card title"
                    text="..." variant="tonal">
                    <v-card-text>
                        <div class="text-h5 font-weight-bold mb-2">
                            {{ template.templateName }}
                        </div>
                        <div class="mb-4">
                            <div class="text-subtitle-2 font-weight-bold mb-2">
                                {{ featuresLabel }}:
                            </div>
                            <v-list dense class="pa-0">
                                <v-list-item v-for="(feature, index) in template.sections.slice(0, maxFeaturesDisplay)"
                                    :key="index" class="pa-0 min-height-auto ">
                                    <v-list-item-content class="pa-0">
                                        <v-list-item-title class="text--disabled font-weight-medium">
                                            {{ feature.title }}
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </div>
                    </v-card-text>

                    <v-spacer></v-spacer>

                    <v-card-actions class="pa-4 d-flex justify-end items-center py-3">
                        <v-btn v-for="action in actions" :key="action.name" :outlined="action.outlined"
                            :color="action.color" :class="action.class" small
                            @click.stop="handleAction(action, template)">
                            {{ action.label }}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
            <v-icon size="64" color="grey lighten-1" class="mb-4">
                {{ emptyStateIcon }}
            </v-icon>
            <h3 class="text-h6 font-weight-medium mb-2">{{ emptyStateTitle }}</h3>
            <p class="text-body-1 grey--text mb-6">
                {{ emptyStateMessage }}
            </p>
            <v-btn v-if="showCreateButton" color="success" large @click="$emit('create-new')">
                <v-icon left>mdi-plus</v-icon>
                {{ createButtonText }}
            </v-btn>
        </div>

        <!-- Pagination Footer (Alternative layout) -->
        <!-- <v-row v-if="showFooterPagination && paginatedTemplates.length > 0" justify="center" class="mt-6">
            <v-col cols="12" class="text-center">
                <v-pagination v-model="currentPage" :length="totalPages" :total-visible="7" color="success"
                    @input="onPageChange"></v-pagination>
            </v-col>
        </v-row> -->
    </div>
</template>

<script>
import EsgService from '../../../../../_services/EsgService';


export default {
    name: 'TemplateGrid',
    props: {
        featuresLabel: {
            type: String,
            default: 'Features'
        },
        loadingText: {
            type: String,
            default: 'Loading templates...'
        },
        maxFeaturesDisplay: {
            type: Number,
            default: 4
        },

        // Pagination props
        initialItemsPerPage: {
            type: Number,
            default: 8
        },
        showFooterPagination: {
            type: Boolean,
            default: false
        },
        showCreateButton: {
            type: Boolean,
            default: true
        },

        // Actions configuration
        actions: {
            type: Array,
            default: () => [
                {
                    name: 'preview',
                    label: 'Preview',
                    event: 'preview',
                    outlined: true,
                    color: 'primary',
                    class: ' mr-2 font-weight-bold ',
                    icon: 'mdi-eye',
                    redirectURL: '/esg-platform/create-new-esg-template'
                },
                {
                    name: 'edit',
                    label: 'Edit',
                    event: 'edit',
                    outlined: false,
                    color: 'primary',
                    class: ' font-weight-bold',
                    icon: 'mdi-pencil',
                    redirectURL: '/esg-platform/create-new-esg-template'
                }
            ]
        },

        // Empty state props
        emptyStateIcon: {
            type: String,
            default: 'mdi-file-document-outline'
        },
        emptyStateTitle: {
            type: String,
            default: 'No templates found'
        },
        createButtonText: {
            type: String,
            default: 'CREATE NEW TEMPLATE'
        },

        // Filter options
        statusOptions: {
            type: Array,
            default: () => [
                { text: 'Active', value: 'active' },
                { text: 'Draft', value: 'draft' },
                { text: 'Archived', value: 'archived' }
            ]
        }
    },
    async created() {
        try {
            const { data } = await EsgService.getEsgReportTemplates();
            this.allTemplates = data;
            this.usedTemplates = this.allTemplates;
            this.initializeData();
        } catch (e) {
            this.$notify({
                type: "error",
                text: "Failed to load templates"
            });
        } finally {
            this.loading = false;
        }
    },
    data() {
        return {
            options: {
                limit: 10,
                page: 1,
                searchPhrase: "",
                country: null,
                state: null,
                date: [],
                status: "",
                orderType: "DESC"
            },
            loading: true,
            allTemplates: [],
            usedTemplates: [],
            paginatedTemplates: [],
            totalTemplates: 0,
            totalPages: 0,
            selectedStatus: null
        }
    },
    computed: {
        emptyStateMessage() {
            if (this.searchQuery || this.selectedStatus) {
                return 'Try adjusting your search terms or filters.'
            }
            return 'Get started by creating your first template.'
        }
    },
    methods: {
        initializeData() {
            this.page = 1;
            this.totalTemplates = this.usedTemplates.length;
            this.paginatedTemplates = this.usedTemplates.slice(0, this.options.limit);
            this.totalPages = Math.ceil(this.totalTemplates / this.options.limit);
        },
        handleAction(action, template) {
            if (action.redirectURL) {
                let url = `${action.redirectURL}?templateId=${template._id}`;
                url = action.name === 'preview' ? `${url}&preview=1`: url;

                this.$router.push(url);
            } else {
                this.$emit(action.event, template);
            }
        },
        pageChange(isNext) {
            this.options.page = isNext ? this.options.page + 1: this.options.page - 1;
            const currentIndex = (this.options.page - 1) * this.options.limit;
            this.paginatedTemplates = this.usedTemplates.slice(currentIndex, currentIndex + this.options.limit);
        },
        resetPagination() {
            this.currentPage = 1;
        },
        onItemsPerPageChange() {
            this.resetPagination()
        },

        // Utility methods
        formatDate(dateString) {
            return new Date(dateString).toLocaleDateString()
        },
        getStatusColor(status) {
            const colors = {
                active: 'success',
                draft: 'warning',
                archived: 'grey'
            }
            return colors[status] || 'grey'
        },
        handleSearchByPhrase() {
            this.usedTemplates = this.allTemplates.filter((item) => item.templateName.toLowerCase().includes(this.options.searchPhrase.toLowerCase()));
            this.initializeData();
        }
    }
}
</script>

<style scoped>
.fill-height {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.shadow {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.custom-radius {
    border-radius: 16px !important;
}

.min-height-auto {
    min-height: auto !important;
}

.flex-grow-1 {
    flex-grow: 1;
}

.template-card {
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    cursor: pointer;
}

.template-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

/* Custom responsive adjustments */
@media (max-width: 600px) {
    .d-flex.justify-end {
        justify-content: flex-start !important;
    }

    .template-card {
        margin-bottom: 16px;
    }
}

.w-100 {
    width: 100%;
}
</style>