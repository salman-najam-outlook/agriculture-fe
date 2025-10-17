<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div class="d-flex mb-8">
                <h2>{{ $t("esgPlatform.myProtocols") }}</h2>
                <v-spacer></v-spacer>
                <div class="d-flex mt-1">
                    <v-btn color="primary" class="mr-3" outlined dark
                        @click="$router.push({ name: 'esgAccountDashboard' })">
                        {{ $t('back') }}
                    </v-btn>
                    <v-btn color="primary" dark class="mr-2" @click="showAddProtocolDialog = true">
                        {{ $t("esgPlatform.createNewProtocol") }}
                    </v-btn>
                </div>
            </div>
            <v-card elevation="0" class="mt-4 ml-4">
                <v-row class="ml-2">
                    <v-col cols="3">
                        <label class="mb-1">Select Standard</label>
                        <v-autocomplete :items="standards" v-model="filters.standardId" item-text="title"
                            item-value="id" outlined dense style="width: 300px" class="mt-2" @change="handleFilters"
                            clearable></v-autocomplete>
                    </v-col>
                    <v-col cols="3">
                        <label class="mb-1">Country</label>
                        <v-autocomplete :items="countries" v-model="filters.country" item-text="name" item-value="id"
                            multiple outlined dense style="width: 300px" class="mt-2" @change="handleFilters"
                            clearable></v-autocomplete>
                    </v-col>
                    <v-col cols="3">
                        <label class="mb-1">Product</label>
                        <v-autocomplete :items="products" v-model="filters.product" item-text="name" item-value="id"
                            multiple outlined dense :loading="loading" :disabled="loading" style="width: 300px"
                            class="mt-2" @change="handleFilters" clearable></v-autocomplete>
                    </v-col>

                    <v-col cols="1" class="d-flex align-center">
                        <v-btn color="primary" outlined @click="clearFilters" :disabled="!hasActiveFilters">
                            Clear
                        </v-btn>
                    </v-col>
                </v-row>

                <v-divider></v-divider>
                <v-row v-for="item in protocols" :key="item.id" class="ml-2 mt-3">
                    <v-col cols="12">
                        <!-- Title -->
                        <h3 class="font-weight-bold">{{ item.title }}</h3>

                        <v-row class="mt-2">
                            <!-- Image Section -->
                            <v-col cols="2">
                                <v-img :src="item.sealUrl" cover height="160px" width="250px" class="rounded-lg">
                                </v-img>
                            </v-col>

                            <!-- Content Section -->
                            <v-col cols="9">

                                <!-- Description -->
                                <p class="text-body-4 black--text text--darken-2 justify-start align-start"
                                    style="text-align: justify !important; vertical-align: top !important; "
                                    v-html="item.description">
                                </p>

                            </v-col>

                        </v-row>
                        <v-row class="px-4" align="center" style="margin-top: 0px;">
                            <!-- Status -->
                            <div class="d-flex align-center ">

                                <span class="font-weight-bold mr-2"> {{ $t('esgPlatform.status') }}:</span>
                                <v-btn small rounded min-width="150" depressed class="red-button" height="34"
                                    v-if="item.isActive === false">
                                    {{ $t("inactive") }}
                                </v-btn>
                                <v-btn small rounded min-width="150" depressed class="green-button" height="34"
                                    v-if="item.isActive === true">
                                    {{ $t("active") }}
                                </v-btn>
                            </div>
                            <!-- Action Buttons -->
                            <v-col class="d-flex justify-end align-center">
                                <v-btn x-small fab color="primary" outlined class="ml-2"
                                    @click="getDetailProtocol(item.id)">
                                    <v-icon>mdi-eye-outline</v-icon>
                                </v-btn>

                                <v-btn x-small fab color="primary" outlined class="ml-2"
                                    @click="handleEditProtocol(item)">
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                                <v-btn v-if="!item.isDefault" x-small fab color="primary" outlined class="ml-2"
                                    @click="removeProtocolConfirmation(item)">
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                        <v-divider class="mt-4"></v-divider>

                    </v-col>
                </v-row>
                <v-row v-if="!loading && protocols.length === 0" class="ml-2 mt-3">
                    <v-col cols="12" class="text-center">
                        <p class="grey--text text--darken-1">
                            {{ $t('No Sustainability Guide Found') }}
                        </p>
                    </v-col>
                </v-row>

                <!-- Pagination -->
                <div class="d-flex justify-center py-4" v-if="pagination.totalPages > 1">
                    <v-pagination v-model="pagination.page" :length="pagination.totalPages" :total-visible="7"
                        @input="handlePageChange"></v-pagination>
                </div>
            </v-card>
        </v-container>
        <confirm-box :title="confirmDelete.title" :message="confirmDelete.message"
            :cancelBtnText="confirmDelete.cancelBtnText" :confirmBtnText="confirmDelete.confirmBtnText"
            :dialog="confirmDeleteDialog" @cancel:action="confirmDeleteDialog = false"
            @continue:action="removeProtocol" />

        <AddNewProtocol v-if="showAddProtocolDialog" :selectedProtocol="selectedStandardDetails"
            :dialog="showAddProtocolDialog" @close="closeAddProtocolDialog" @save="handleSaveProtocol" />
    </div>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";
import ConfirmBox from "@/components/ConfirmBox";
import ESGService from "@/_services/EsgService";
import { get } from "lodash";
import AddNewProtocol from "../dashboard/components/protocol/AddNewProtocol.vue";

export default {
    components: {
        "confirm-box": ConfirmBox,
        AddNewProtocol,
    },
    computed: {
        hasActiveFilters() {
            return (
                this.filters.standardId !== null ||
                this.filters.country.length > 0 ||
                this.filters.product.length > 0 ||
                this.filters.isActive !== null
            );
        },
    },
    data() {
        return {
            showAddProtocolDialog: false,
            selectedStandardDetails: null,
            selectedItem: null,
            standards: [],
            protocols: [],
            products: [],
            countries: [],
            loading: false,
            filters: {
                standardId: null,
                country: [],
                product: [],
            },
            confirmDeleteDialog: false,
            confirmDelete: {
                title: this.$t("esgPlatform.confirmation"),
                message: this.$t("esgPlatform.protocolDeleteConfirmation"),
                confirmBtnText: this.$t("confirm"),
                cancelBtnText: this.$t("cancel"),
                confirmData: null,
            },
            breadcrumbs: [
                {
                    text: this.$t("esgPlatform.esgPlatform"),
                    link: true,
                    exact: true,
                    disabled: true,
                },
                {
                    text: this.$t("esgPlatform.myProtocols"),
                    disabled: false,
                    to: { name: "MyProtocols" },
                },
            ],
            pagination: {
                page: 1,
                limit: 10,
                totalItems: 0,
                totalPages: 1,
                currentPage: 1
            },
        };
    },
    created() { },
    async mounted() {
        this.startLoading();
        try {
            await Promise.all([
                this.fetchStandards(),
                this.fetchProducts(),
                this.loadCountries(),
            ]);

            this.initializeFiltersFromUrl();

            // Get protocols after filters are initialized
            await this.getEsgProtocols();
        } catch (error) {
            console.error('Error initializing data:', error);

        } finally {
            this.stopLoading();
        }
    },
    watch: {
        filters: {
            deep: true,
            handler(newFilters) {
                const query = {};
                if (newFilters.standardId) query.standardId = newFilters.standardId;
                if (newFilters.country?.length) query.country = newFilters.country.join(',');
                if (newFilters.product?.length) query.product = newFilters.product.join(',');

                // Prevent unnecessary route updates
                const currentQuery = this.$route.query;
                const isQueryDifferent = JSON.stringify(query) !== JSON.stringify(currentQuery);

                if (isQueryDifferent) {
                    this.$router.replace({
                        query: Object.keys(query).length ? query : undefined,
                    });
                }
            },
        },
    },
    methods: {
        async fetchProducts() {
            try {
                const response = await ESGService.getProducts();
                if (response.success) {
                    this.products = get(response, 'data.rows', []).map(product => ({
                        id: product.id,
                        name: product.name || product.title,
                    }));
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                this.$notify({
                    type: 'error',
                    text: 'Failed to fetch products.',
                });
            }
        },

        async loadCountries() {
            try {
                const response = await ESGService.loadCountries();
                if (response.success) {
                    this.countries = get(response, 'data', []).map(country => ({
                        id: country.id,
                        name: country.name || country.title,
                    }));
                }
            } catch (error) {
                console.error('Error loading countries:', error);

            }
        },

        async getEsgProtocols() {
            this.startLoading();
            try {
                const params = {
                    ...this.filters,
                    page: this.pagination.page,
                    limit: this.pagination.limit,
                };

                const { data } = await ESGService.getEsgStandards('Protocol', params);

                this.protocols = data.rows?.map((item) => ({
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    sealUrl: item.sealUrl,
                    standardId: item.esgStandard?.id,
                    isActive: item.isActive,
                }));

                // Update pagination data
                this.pagination.totalItems = data.totalItems || 0;
                this.pagination.totalPages = data.totalPage || 1;
                this.pagination.currentPage = data.currentPage || 1;
            } catch (error) {
                console.error('Error fetching ESG protocols:', error);
                this.$notify({
                    type: 'error',
                    text: 'Failed to fetch ESG protocols. Please try again.',
                });
            } finally {
                this.stopLoading();
            }
        },


        async fetchStandards() {
            this.startLoading();
            try {
                const response = await ESGService.getEsgStandards('Standard');
                this.standards = response.data?.rows || [];
            } catch (error) {
                console.error('Error fetching standards:', error);
                this.$notify({
                    type: 'error',
                    text: 'Failed to fetch standards.',
                });
            } finally {
                this.stopLoading();
            }
        },
        getDetailProtocol(id) {
            this.$router.push({ name: "startEsgProtocol", params: { id } });
        },
        handleEditProtocol(item) {
            this.$router.push({
                name: "startEsgProtocol",
                params: { id: item.id },
            });
        },
        removeProtocolConfirmation(item) {
            this.selectedItem = item;
            this.confirmDeleteDialog = true;
        },
        async removeProtocol() {
            this.startLoading();
            try {
                await ESGService.deleteEsgStandard(this.selectedItem.id);
                this.$notify({
                    title: this.$t("esgPlatform.protocolDeletedSuccessfully"),
                    type: "success",
                });
            }
            catch (error) {
                console.error(error);
            }
            finally {
                this.stopLoading();
                this.getEsgProtocols();
                this.confirmDeleteDialog = false;
            }
        },
        handleFilters() {
            this.getEsgProtocols();
        },
        clearFilters() {
            this.filters = {
                standardId: null,
                country: [],
                product: [],
            };
            this.getEsgProtocols();

            this.$router.replace({ query: {} });
        },
        initializeFiltersFromUrl() {
            const query = this.$route.query;

            this.filters = {
                standardId: query.standardId || null,
                country: this.parseQueryArray(query.country),
                product: parseInt(this.parseQueryArray(query.product)),
            };

            if (this.hasActiveFilters) {
                this.getEsgProtocols();
            }
        },
        parseQueryArray(param) {
            if (!param) return [];
            if (Array.isArray(param)) return param;
            if (typeof param === 'string') return param.split(',');
            return [];
        },
        closeAddProtocolDialog() {
            this.showAddProtocolDialog = false;
        },
        async handleSaveProtocol() {
            this.showAddProtocolDialog = false;
            this.$notify({
                text: this.$t('esgPlatform.protocolAddedMsg'),
                type: "success",
            });
            await this.getEsgProtocols();
        },
        handlePageChange(page) {
            this.pagination.page = page;
            this.getEsgProtocols();
        }
    },
    mixins: [loadingMixin],
};
</script>

<style lang="scss" scoped>
::v-deep .v-data-table-header__icon {
    color: white !important;
}

.filter-section {
    background-color: #f5f5f5;
    padding: 16px;
    border-radius: 4px;
    margin-bottom: 16px;
}
</style>
