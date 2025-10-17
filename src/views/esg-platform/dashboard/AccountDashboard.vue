<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>

            <div class="d-flex">
                <h2>{{ $t('dashboard') }}</h2>
                <v-spacer></v-spacer>
                <div class="gap d-flex align-center" v-if="!isSubEnterprise">
                    <div class="d-flex flex-column mr-4">
                        <label class="mb-1">Select Standards</label>
                        <v-autocomplete :items="standardLists" v-model="selectedStandard" item-text="title"
                            item-value="id" outlined dense style="width: 300px" class="mt-2"></v-autocomplete>
                    </div>
                    <v-btn color="primary" dark @click="navigateToProtocol">
                        {{ $t('esgPlatform.startNewEsgProtocol') }}
                    </v-btn>
                </div>
            </div>
            <v-card elevation="0" class="px-5 py-8 position-relative" style="overflow: hidden;"
                v-if="isSubEnterprise && currentSubOrganization">
                <v-card-title class="text-h5 font-weight-bold justify-center">
                    Initial Maturity Assessment
                </v-card-title>
                <v-card-text class="text-center">
                    Thank you for taking the ESG assessment! We appreciate your commitment to sustainability.
                    Below you find the report which will show your current Environmental, Social, and Governance (ESG)
                    performance. The results are based on the comprehensive questionnaire you answered which is backed
                    by the Task Force on Climate-Related Financial Disclosures and the European Union's Double
                    Materiality Assessment.
                </v-card-text>
                <v-card-actions class="justify-center">
                    <v-btn color="primary" @click="downloadReport">
                        Download Report
                    </v-btn>
                </v-card-actions>

                <v-img src="/img/esg/dashboard-bg.svg" class="background-image" position="bottom" contain></v-img>
            </v-card>

            <template v-if="protocols.length">
                <div v-for="protocol of protocols" :key="protocol._id">
                    <ProtocolCard :protocol="protocol" />
                </div>
                <!-- pagination -->
                <div class="d-flex justify-center" v-if="protocolPagination.totalPages > 1">
                    <v-pagination v-model="protocolPage" :length="protocolPagination.totalPages"
                        :total-visible="7"></v-pagination>
                </div>
            </template>

            <template v-else>
                <NoProtocolCard :selectedStandard="selectedStandard" />
            </template>

            <v-card elevation="0" class="px-5 mt-5" v-if="!isSubEnterprise">
                <v-card-text>
                    <div class="d-flex mb-4">
                        <h2>{{ $t('esgPlatform.dashboard.subEnterprises') }}</h2>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" dark class="mr-2 mb-2" @click="openAddEnterpriseDialog">
                            {{ $t('esgPlatform.dashboard.registerSubEnterprise') }}
                        </v-btn>
                    </div>
                    <v-row style="margin-left:-30px; margin-bottom: 20px; margin-top: 15px;">
                        <v-col cols="12">
                            <v-data-table :headers="subEnterprisesHeader" :items="suborganizations" :items-per-page="10"
                                :footer-props="{
                                    'items-per-page-options': [10, 25, 50],
                                }" item-key="id" hide-default-footer :loading="tableLoading"
                                @update:options="onSortUpdate">
                                <template v-slot:top>
                                    <div class="d-flex mt-5">
                                        <v-text-field prepend-inner-icon="mdi-magnify" outlined height="5px"
                                            :placeholder="$t('search')" dense @change="onSearchInput"
                                            v-model="searchData" class="shrink"></v-text-field>
                                        <v-spacer></v-spacer>
                                        <template>
                                            <v-btn color="primary" height="45" class="mr-4 px-4" outlined
                                                @click="downloadCsv">
                                                <v-img width="25px" src="/icons/pngfile.png"></v-img> <span
                                                    class="ml-2">Export as CSV</span>
                                            </v-btn>
                                            <v-spacer></v-spacer>
                                            <div class="py-1 title">Filter By</div>
                                            <v-btn class="mx-2" icon color="primary" @click="showFilters = true">
                                                <v-icon dark large>
                                                    mdi-filter
                                                </v-icon>
                                            </v-btn>
                                            <v-btn color="primary" height="45" width="175" max-width="175" outlined
                                                class="mr-5" @click="clearFilters" v-if="dataFiltered">
                                                <span class="">{{ $t('activationKey.clearAllFilters') }}</span>
                                            </v-btn>
                                        </template>
                                        <div class="py-1 title">
                                            {{ pagination.from }} - {{ pagination.to }} {{ $t('of') }} {{
                                                pagination.total }}
                                        </div>
                                        <v-btn class="mx-2" fab small outlined color="primary"
                                            :disabled="filterParams.page <= 1" @click="pageChange(false)">
                                            <v-icon dark>
                                                mdi-chevron-left
                                            </v-icon>
                                        </v-btn>
                                        <v-btn class="mx-2" fab small outlined color="primary"
                                            :disabled="pagination.to >= pagination.total" @click="pageChange(true)">
                                            <v-icon dark>
                                                mdi-chevron-right
                                            </v-icon>
                                        </v-btn>
                                    </div>
                                </template>
                                <template v-if="suborganizations && suborganizations.length" v-slot:body="{ items }">
                                    <tbody>
                                        <tr v-for="item in items" :key="item.id" style="cursor: pointer;">
                                            <td>
                                                {{ item.name }}
                                            </td>
                                            <!-- <td> {{ item.licenseId || '-' }}</td> -->
                                            <td>-</td>

                                            <!-- <td>{{ item.activationKeysAllowed }}</td>
                                            <td>{{ item.users.length }}</td> -->

                                            <td>{{ formatDate(item.registrationDate) }}</td>
                                            <td>{{ item.country || '-' }}</td>
                                            <td>
                                                <v-btn small rounded min-width="200" depressed class="green-button"
                                                    height="40" v-if="item.status?.toLowerCase() === 'active'">
                                                    {{ $t("esgPlatform.common.active") }}
                                                </v-btn>
                                                <v-btn small rounded min-width="200" depressed class="red-button"
                                                    height="40" v-else>
                                                    {{ $t("esgPlatform.common.deactivated") }}
                                                </v-btn>
                                            </td>
                                            <td @click.stop>
                                                <v-menu location="start">
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-btn icon v-bind="attrs" v-on="on" @click.stop>
                                                            <v-icon>mdi-dots-vertical</v-icon>
                                                        </v-btn>
                                                    </template>
                                                    <v-list style="min-width: 150px; cursor: pointer;">
                                                        <v-list-item @click="enterpriseViewDialog(item)">
                                                            <v-list-item-title>{{ $t('view') }}</v-list-item-title>
                                                        </v-list-item>
                                                        <v-list-item @click="openEditProductDialog(item)">
                                                            <v-list-item-title>{{ $t('edit') }}</v-list-item-title>
                                                        </v-list-item>
                                                        <v-list-item @click="openDeactivateConfirm(item)">
                                                            <v-list-item-title
                                                                :class="item.status?.toLowerCase() == 'active' ? 'red--text' : 'green--text'">
                                                                {{ item.status?.toLowerCase() == 'active' ?
                                                                    $t('deactivate') : $t('activate') }}
                                                            </v-list-item-title>
                                                        </v-list-item>
                                                        <v-list-item>
                                                            <v-list-item-title class="red--text"
                                                                @click="openConfirmDeleteDialog(item)">{{
                                                                    $t('delete')
                                                                }}</v-list-item-title>
                                                        </v-list-item>
                                                    </v-list>
                                                </v-menu>
                                            </td>
                                        </tr>
                                    </tbody>
                                </template>
                            </v-data-table>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>

            <v-card elevation="0" class="px-5" v-if="!isSubEnterprise">
                <v-card-text>
                    <UserList />
                </v-card-text>
            </v-card>
            <SubEnterpriseForm v-if="showSubEnterpriseAddDialog" :dialog="showSubEnterpriseAddDialog"
                :enterpriseData="selectedData" @close="closeSubEnterpriseDialog" @save="handleSaveEnterprise" />
            <SubEnterpriseView v-if="showSubEnterpriseViewDialog" :dialog="showSubEnterpriseViewDialog"
                :enterpriseData="selectedData" @close="closeSubEnterpriseViewDialog" @save="handleEditEnterprise" />
            <confirm-box v-if="confirmDeleteDialog" :title="$t('esgPlatform.dashboard.deleteAccount')"
                :message="deleteMessage" :cancelBtnText="$t('cancel')" :confirmBtnText="$t('confirm')"
                :confirmData="confirmDeleteData" :dialog="confirmDeleteDialog"
                @cancel:action="confirmDeleteDialog = false" @continue:action="confirmRemoveEnterprise" />

            <confirm-box v-if="confirmDeactivateDialog" :title="confirmDeactivateTitle" :message="deactivateMessage"
                :cancelBtnText="$t('cancel')" :confirmBtnText="$t('confirm')" :confirmData="confirmDeactivateData"
                :dialog="confirmDeactivateDialog" @cancel:action="confirmDeactivateDialog = false"
                @continue:action="confirmDeactivateAccount" />
        </v-container>
    </div>
</template>

<script>
import moment from "moment";
import ConfirmBox from "@/components/ConfirmBox";
import ESGService from "@/_services/EsgService";
import loadingMixin from "@/mixins/LoadingMixin";
import dateMixin from "@/mixins/DateMixin";
import { get } from "lodash";
import { debounce } from 'lodash';
import SubEnterpriseForm from "./components/subenterprise/SubEnterpriseForm.vue";
import SubEnterpriseView from "./components/subenterprise/SubEnterpriseView.vue";
import UserList from './components/subenterprise/EnterpriseUser.vue';
import ProtocolCard from "./components/protocol/ProtocolCard.vue";
import NoProtocolCard from "./components/protocol/NoProtocolCard.vue";
import { mapGetters } from 'vuex';
export default {
    components: {
        UserList,
        SubEnterpriseForm,
        SubEnterpriseView,
        "confirm-box": ConfirmBox,
        ProtocolCard,
        NoProtocolCard
    },
    data() {
        return {
            dataFiltered: false,
            showSubEnterpriseAddDialog: false,
            showSubEnterpriseViewDialog: false,
            selectedData: null,
            breadcrumbs: [
                { text: this.$t('esgPlatform.esgPlatform'), disabled: false },
                { text: this.$t('esgPlatform.esgDashboard'), disabled: false },
            ],
            subEnterprisesHeader: [
                { text: this.$t('esgPlatform.dashboard.enterprise'), align: "start", value: "name" },
                // { text: this.$t('esgPlatform.dashboard.licenseID'), value: "hsCode" },
                { text: this.$t('esgPlatform.dashboard.membershipPlan'), value: "eudrDocumentCode" },
                // { text: this.$t('esgPlatform.dashboard.activationKeys'), value: "subProducts" },
                // { text: this.$t('esgPlatform.dashboard.users'), value: "subProducts" },
                { text: this.$t('esgPlatform.dashboard.registrationDate'), value: "subProducts" },
                { text: this.$t('esgPlatform.dashboard.country'), value: "subProducts" },
                { text: this.$t('esgPlatform.dashboard.status'), align: "center", value: "subProducts", sortable: false, },
                { text: '', value: "actions", sortable: false },
            ],
            suborganizations: [],
            confirmDeleteDialog: false,
            confirmDeleteData: {},
            searchData: "",
            filterParams: {
                search: "",
                page: 1,
                limit: 10,
                sortBy: "createdAt",
                sortOrder: "asc"
            },
            pagination: {
                from: 1,
                to: 10,
                total: 0,
            },
            tableLoading: false,
            deleteMessage: "",
            confirmDeactivateDialog: false,
            confirmDeactivateData: null,
            confirmDeactivateTitle: null,
            deactivateMessage: '',
            standardLists: [],
            selectedStandard: null,
            organizationDetails: [
                { value: 'ABRAFRUTAS' },
                { label: 'Sub Organizations', value: 135 },
                { label: 'Farms', value: 4563 },
                { label: 'Farmers', value: 5200 },
                { label: 'Total Goals', value: 23 },
                { label: 'Evidence Uploaded', value: '4176 files' },
                { label: 'Start Date', value: '23/01/2025' },
                { label: 'Deadline', value: '23/10/2031' },
                { label: 'Standard', value: 'European Sustainability Reporting Standards (ESRS)' }
            ],
            protocols: [],
            currentSubOrganization: null,
            page: 1,
            totalPages: 1,
            protocolPagination: {
                page: 1,
                limit: 10,
                totalItems: 0,
                totalPages: 1,
                currentPage: 1
            },
            protocolPage: 1,
        };
    },
    created() {
        this.debouncedUpdateFilterParams = debounce(this.updateFilterParams, 500);
    },

    computed: {
        fullName() {
            return (user) => {
                if (!user) return 'N/A';
                return `${user.firstName} ${user.lastName}`;
            }
        },
        ...mapGetters(['isSubEnterprise']),
    },
    async mounted() {
        this.startLoading();

        try {
            await Promise.all([
                this.getEsgStandards(),
                this.getEsgProtocols(),
                this.fetchData(),
            ]);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            this.stopLoading();
        }
    },
    watch: {
        filterParams: {
            async handler() {
                await this.fetchData();
            },
            deep: true,
        },
        protocolPage: {
            async handler(newPage, oldPage) {
                // Only trigger if the page actually changed and it's not the initial load
                if (newPage !== oldPage && oldPage !== undefined) {
                    this.protocolPagination.page = newPage;
                    await this.getEsgProtocols();
                }
            }
        },
    },
    methods: {
        async getEsgStandards() {
            this.startLoading();
            try {
                const { data } = await ESGService.getEsgStandards("Standard");
                this.standardLists = data.rows;
            } catch (error) {
                console.error('Error fetching ESG standards:', error);
                this.$notify({
                    type: 'error',
                    text: 'Failed to fetch ESG standards. Please try again.',
                });
            } finally {
                this.stopLoading();
            }
        },

        async getEsgProtocols() {
            this.startLoading();
            try {
                const params = {
                    includeProgress: true,
                    isActive: true,
                    page: this.protocolPagination.page,
                    limit: this.protocolPagination.limit,
                };

                const { data } = await ESGService.getEsgStandards('Protocol', params);

                this.protocols = data.rows;
                this.filteredProtocols = this.protocols;
                this.totalItems = data.totalItems;
                this.totalPages = data.totalPage;
                this.page = data.currentPage;
                this.limit = data.limit;

                // Update protocol pagination data
                this.protocolPagination.totalItems = data.totalItems;
                this.protocolPagination.totalPages = data.totalPage;
                this.protocolPagination.currentPage = data.currentPage;
                this.protocolPage = data.currentPage;
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

        enterpriseViewDialog(item) {
            this.selectedData = item;
            this.showSubEnterpriseViewDialog = true;
        },
        onSortUpdate(sort) {
            this.filterParams.sortBy = get(sort, "sortBy[0]", "createdAt");
            this.filterParams.sortOrder = get(sort, "sortDesc[0]", false) ? "desc" : "asc";
        },
        getDateFormat(date) {
            return moment(date).format("DD-MMM-YYYY");
        },
        goToSubProducts(productId, productName) {
            this.$router.push({ name: "ManageSubProducts", params: { productId, productName } });
        },
        openAddEnterpriseDialog() {
            this.selectedData = null;
            this.showSubEnterpriseAddDialog = true;
        },
        closeSubEnterpriseDialog() {
            this.showSubEnterpriseAddDialog = false;
        },
        closeSubEnterpriseViewDialog() {
            this.showSubEnterpriseViewDialog = false;
        },
        async fetchData() {
            try {
                this.tableLoading = true
                await ESGService.getSubEnterprises(this.filterParams).then((res) => {
                    if (res.data) {
                        this.suborganizations = get(res, 'data.rows', []);
                        this.pagination.total = get(res, 'data.total', 0);
                        this.pagination.from = (this.filterParams.page - 1) * this.filterParams.limit + 1;
                        this.pagination.to = this.filterParams.page * this.filterParams.limit - (this.filterParams.limit - this.suborganizations?.length);

                        if (this.isSubEnterprise) {
                            const currentOrgId = JSON.parse(localStorage.getItem('user'))?.id;
                            this.currentSubOrganization = this.suborganizations.find(item => item.primaryUserId === currentOrgId);
                        }
                    }
                });
            } catch (err) {
                console.log(err);
            } finally {
                this.tableLoading = false
            }
        },
        async downloadCsv() {
            this.startLoading()
            try {
                const data = await ESGService.exportCsvSubOrg();
                const blob = new Blob([data], { type: 'text/csv' });

                // Create download link
                const url = window.URL.createObjectURL(blob);
                const anchor = document.createElement('a');
                anchor.href = url;
                anchor.download = `sub-organizations-${new Date().getTime()}.csv`;

                // Trigger download
                document.body.appendChild(anchor);
                anchor.click();

                // Cleanup
                window.URL.revokeObjectURL(url);
                document.body.removeChild(anchor);

                this.$notify({
                    type: 'success',
                    text: 'CSV downloaded successfully'
                });
            } catch (error) {
                console.error('Error downloading CSV:', error);
                this.$notify({
                    type: 'error',
                    text: 'Failed to download CSV. Please try again.'
                });
            }
            finally {
                this.stopLoading();
            }
        },
        async handleSaveEnterprise() {
            this.showSubEnterpriseAddDialog = false;
            await this.fetchData();
        },
        async handleEditEnterprise(payload) {
            this.selectedData = payload;
            this.showSubEnterpriseViewDialog = false;
            this.showSubEnterpriseAddDialog = true;
        },
        openEditProductDialog(data) {
            this.selectedData = data;
            this.showSubEnterpriseAddDialog = true;
        },
        openConfirmDeleteDialog(product) {
            this.confirmDeleteData = product;
            this.confirmDeleteDialog = true;
            this.deleteMessage = this.$t('esgPlatform.dashboard.deleteMsg');
        },
        async confirmRemoveEnterprise(action, confirmData) {
            try {
                this.startLoading();
                const resp = await ESGService.deleteAccount(confirmData.id);
                if (resp.data) {
                    await this.fetchData();
                    this.$notify({
                        text: "Account deleted successfully.",
                        type: "success",
                    });
                }
            } catch (err) {
                this.$notify({
                    title: this.$t("blends.manageProducts.deleteSubProduct"),
                    text: this.$t("blends.manageProducts.pleaseTryAgain"),
                    type: "error",
                });
            } finally {
                this.stopLoading();
                this.confirmDeleteDialog = false;
            }
        },
        pageChange(t) {
            if (t) this.filterParams.page = this.filterParams.page + 1;
            else this.filterParams.page = this.filterParams.page - 1;
        },
        updateFilterParams() {
            this.filterParams.search = this.searchData;
        },
        onSearchInput() {
            this.searchData = this.searchData.trim();
            this.debouncedUpdateFilterParams();
        },
        openDeactivateConfirm(item) {
            this.deactivateMessage = item.status === 'active' ? this.$t('esgPlatform.dashboard.deactivateMsg') : this.$t('esgPlatform.dashboard.activateMsg');
            this.confirmDeactivateTitle = item.status === 'active' ? this.$t('esgPlatform.dashboard.deactivateAccount') : this.$t('esgPlatform.dashboard.activateAccount');
            this.confirmDeactivateData = item;
            this.confirmDeactivateDialog = true;
        },
        async confirmDeactivateAccount(action, item) {
            this.startLoading();
            try {
                await ESGService.deactivateAccount(item.id);
                this.$notify({
                    type: 'success',
                    text: item.status === 'active' ? 'Account deactivated successfully' : 'Account activated successfully'
                });
                this.confirmDeactivateDialog = false;
                this.fetchData();
            } catch (error) {
                this.$notify({
                    type: 'error',
                    text: 'Failed to deactivate account',
                });
                console.error('Error deactivating account:', error);
            }
            finally {
                this.stopLoading();
            }
        },
        navigateToProtocol() {
            this.$router.push({
                name: 'esgStandardProtocol',
                params: {
                    id: this.selectedStandard
                }
            });
        },
        async downloadReport() {
            this.startLoading();
            try {
                const reportUrl = this.currentSubOrganization?.accessmentReportUrl;
                window.open(reportUrl, '_blank');
            } catch (error) {
                console.error('Error downloading report:', error);
                this.$notify({
                    type: 'error',
                    text: 'Failed to open report'
                });
            } finally {
                this.stopLoading();
            }
        }
    },
    mixins: [loadingMixin, dateMixin],
};
</script>

<style scoped>
.title {
    font-weight: bold;
}

.table-img {
    width: 45px;
    height: 45px;
}

.position-relative {
    position: relative;
}

.background-image {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100px;
    z-index: 0;
    pointer-events: none;
}

.v-card-title,
.v-card-text,
.v-card-actions {
    position: relative;
    z-index: 1;
}

.bg-grey {
    background-color: #F5F5F5;
}

.bg-grey .theme--light.v-sheet {
    background-color: transparent;
}

.circular-progress {
    background-color: #fff !important;
}

.environmental-card {
    background-color: #E4FFF2 !important;
}

.social-card {
    background-color: #E4FBFF !important;
}

.governance-card {
    background-color: #FFF4E8 !important;
}
</style>