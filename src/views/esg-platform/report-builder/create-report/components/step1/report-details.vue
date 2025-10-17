<template>
    <v-card flat>
        <v-card-text>
            <v-row>
                <v-col cols="12" sm="6" md="5" lg="4">
                    <div class="d-flex align-center mb-2">
                        <span>{{ $t('Select ESG Protocol') }}</span>
                        <v-tooltip bottom color="#00BD73" max-width="500">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon small class="pl-2" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                    mdi-alert-circle
                                </v-icon>
                            </template>
                            <span>{{ $t('Select ESG Protocol') }}</span>
                        </v-tooltip>
                    </div>
                    <v-autocomplete clearable v-model="selectedProtocol" outlined dense :items="protocols"
                        item-text="title" item-value="id" :placeholder="$t('Select ESG Protocol')"
                        :loading="listofProtocols" :rules="[requiredRule]" hide-details="auto" class="blend-select"
                        @change="onProtocolChange" />
                </v-col>
            </v-row>

            <!-- Protocol Details Display -->
            <div v-if="protocolDetails && !listofProtocols" class="mt-6">
                <div class="d-flex align-start">
                    <v-img :src="protocolDetails.sealUrl || defaultProtocolImage" alt="protocol image" max-width="180"
                        max-height="120" class="mr-6" cover style="border-radius: 8px;" />
                    <div>
                        <div class="text-h6 font-weight-bold mb-2">{{ protocolDetails.title }}</div>
                        <div class="mb-3" style="max-width: 900px;" v-html="protocolDetails.description">
                        </div>
                        <div class="d-flex align-center mt-2">
                            <span class="font-weight-bold mr-2">Standard:</span>
                            <v-img :src="protocolDetails.standardImage || defaultStandardImage" alt="Standard"
                                max-width="32" max-height="32" class="mr-2" cover />
                            <span>{{ protocolDetails.standardName || 'European Sustainability Reporting Standards'
                                }}</span>
                        </div>
                        <div v-if="protocolDetails.isActive !== undefined" class="mt-2">
                            <v-chip :color="protocolDetails.isActive ? 'success' : 'error'" small text-color="white">
                                {{ protocolDetails.isActive ? 'Active' : 'Inactive' }}
                            </v-chip>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Loading Skeleton -->
            <div v-else-if="listofProtocols" class="mt-6">
                <div class="d-flex align-start">
                    <!-- Image skeleton -->
                    <v-skeleton-loader type="image" class="mr-6" style="border-radius: 8px;" width="180" height="120" />
                    <div style="flex:1;">
                        <!-- Title skeleton -->
                        <v-skeleton-loader type="heading" width="320" height="32" class="mb-2" />
                        <!-- Description skeleton (multiple lines) -->
                        <v-skeleton-loader type="text" width="90%" height="18" class="mb-1" />
                        <v-skeleton-loader type="text" width="85%" height="18" class="mb-1" />
                        <v-skeleton-loader type="text" width="80%" height="18" class="mb-3" />
                        <!-- Standard row skeleton -->
                        <div class="d-flex align-center mt-2">
                            <v-skeleton-loader type="text" width="80" height="18" class="mr-2" />
                            <v-skeleton-loader type="image" width="32" height="32" class="mr-2" />
                            <v-skeleton-loader type="text" width="240" height="18" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="selectedProtocol && !protocolDetails" class="mt-6">
                <v-alert type="info" outlined>
                    No details available for the selected protocol.
                </v-alert>
            </div>
        </v-card-text>
    </v-card>
</template>

<script>
import ESGService from "@/_services/EsgService";

export default {
    name: 'ReportDetails',
    mounted() {
        this.fetchESGProtocols();
    },
    data() {
        return {
            selectedProtocol: null,
            protocols: [],
            listofProtocols: false,
            requiredRule: value => !!value || this.$t('blends.createBlends.requiredField'),
            filters: {
                page: 1,
                limit: 100, // Adjust as needed
                search: '',
                sortBy: 'title',
                sortOrder: 'asc'
            },
            defaultProtocolImage: 'https://i.ibb.co/0jQw6wF/abrafrutas.jpg',
            defaultStandardImage: 'https://i.ibb.co/4w1YNhky/featured-image.jpg'
        };
    },
    computed: {
        protocolDetails() {
            if (!this.selectedProtocol) return null;
            return this.protocols.find(p => p.id === this.selectedProtocol) || null;
        },
    },
    methods: {
        async fetchESGProtocols() {
            await this.getEsgProtocols();
        },

        async getEsgProtocols() {
            this.startLoading();
            try {
                const response = await ESGService.getEsgStandards('Protocol', this.filters);

                if (response && response.data && response.data.rows) {
                    this.protocols = response.data.rows.map((item) => ({
                        id: item.id,
                        title: item.title,
                        description: item.description || 'No description available',
                        sealUrl: item.sealUrl,
                        standardId: item.esgStandard?.id,
                        standardName: item.esgStandard?.name || item.esgStandard?.title,
                        standardImage: item.esgStandard?.image || item.esgStandard?.sealUrl,
                        isActive: item.isActive,
                        createdAt: item.createdAt,
                        updatedAt: item.updatedAt,
                        // Additional fields if available
                        version: item.version,
                        category: item.category,
                        tags: item.tags || [],
                        author: item.author,
                        lastModified: item.lastModified
                    }));

                } else {
                    this.protocols = [];
                }
            } catch (error) {
                this.$toast.error('Failed to fetch ESG protocols. Please try again.');
                this.protocols = [];
            } finally {
                this.stopLoading();
            }
        },

        onProtocolChange(protocolId) {
            if (protocolId) {
                // Emit the selected protocol to parent component to send it as payload
                this.$emit('protocol-selected-id', protocolId);
            } else {
                this.$emit('protocol-selected-id', null);
            }
        },

        startLoading() {
            this.listofProtocols = true;
        },

        stopLoading() {
            this.listofProtocols = false;
        },

        // Method to refresh protocols if needed
        async refreshProtocols() {
            await this.getEsgProtocols();
        },

        // Method to search protocols
        async searchProtocols(searchTerm) {
            this.filters.search = searchTerm;
            await this.getEsgProtocols();
        },

        // Method to filter by active status
        async filterByStatus(isActive) {
            this.filters.isActive = isActive;
            await this.getEsgProtocols();
        }
    },
    watch: {
        // Watch for changes in filters and refresh data
        filters: {
            handler() {
                this.getEsgProtocols();
            },
            deep: true
        }
    },
    // Emit selected protocol to parent when component is destroyed
    beforeDestroy() {
        if (this.selectedProtocol) {
            const protocol = this.protocols.find(p => p.id === this.selectedProtocol);
            this.$emit('protocol-selected', protocol);
        }
    }
};
</script>

<style scoped>
.blend-select {
    min-width: 280px;
}

.protocol-details {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
    margin-top: 20px;
}

.protocol-image {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
}

.standard-info {
    background-color: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 12px;
    margin-top: 16px;
}

.protocol-meta {
    color: #666;
    font-size: 0.875rem;
    margin-top: 8px;
}

.protocol-tags {
    margin-top: 12px;
}

.tag-chip {
    margin-right: 8px;
    margin-bottom: 4px;
}
</style>