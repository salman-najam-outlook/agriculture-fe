<template>
    <div>
        <breadcrumb :items="breadcrumbs" data-html2canvas-ignore="true"></breadcrumb>
        <div class="d-flex px-3" data-html2canvas-ignore="true">
            <h2>{{ cooperative.subOrg || cooperative.fullName || $t('approvalFlow.cooperative.cooperativeDetails') }}</h2>
            <v-spacer></v-spacer>
            <div class="d-flex mt-1">
                <!-- <v-btn color="error" class="mr-2 font-weight-bold white--text"
                    @click="deleteCooperative(cooperative.id)">
                    {{ $t('approvalFlow.cooperative.delete') }}
                </v-btn> -->
                <v-btn color="error" class="mr-2 font-weight-bold white--text"
                    @click="deactivateCooperativeMethod(cooperative.id, cooperative.active)">
                    {{ $t(cooperative.active ? 'approvalFlow.cooperative.deactivate' : 'approvalFlow.cooperative.activate') }}
                </v-btn>
                <!-- <v-btn color="primary" class="mr-2 font-weight-bold white--text" @click="editCooperative">
                    {{ $t('approvalFlow.cooperative.edit') }}
                </v-btn> -->
                <v-btn color="primary" class="mr-2 font-weight-bold white--text" @click="goBackToCooperativeList">
                    {{ $t('approvalFlow.cooperative.back') }}
                </v-btn>
            </div>
        </div>

        <!-- Error State -->
        <div v-if="error" class="d-flex justify-center align-center" style="height: 200px;">
            <v-alert type="error" outlined>
                {{ error }}
            </v-alert>
        </div>

        <!-- Cooperative Details Section -->
        <div v-else class="cooperative-details-container">
            <div class="details-section">
                <div class="details-grid">
                    <div class="detail-item">
                        <div class="detail-label">
                            <span class="label-text">{{ $t('approvalFlow.cooperative.cooperativeName') }}</span>
                            <v-tooltip top color="00BD73" max-width="350">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon size="16" class="icon-with-background primary--text" style="color:#0EBF67"
                                        v-bind="attrs" v-on="on">
                                        mdi-alert-circle
                                    </v-icon>
                                </template>
                                <span>{{ $t('approvalFlow.cooperative.cooperativeNameTT') }}</span>
                            </v-tooltip>
                        </div>
                        <div class="detail-value">{{ cooperative.subOrg || cooperative.fullName || 'N/A' }}</div>
                    </div>

                    <div class="detail-item">
                        <div class="detail-label">
                            <span class="label-text">{{ $t('approvalFlow.cooperative.membershipPlan') }}</span>
                            <v-tooltip top color="00BD73" max-width="350">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon size="16" class="icon-with-background primary--text" style="color:#0EBF67"
                                        v-bind="attrs" v-on="on">
                                        mdi-alert-circle
                                    </v-icon>
                                </template>
                                <span>{{ $t('approvalFlow.cooperative.membershipPlanTT') }}</span>
                            </v-tooltip>
                        </div>
                        <div class="detail-value">{{ $t('approvalFlow.cooperative.advanced') }}</div>
                    </div>

                    <div class="detail-item">
                        <div class="detail-label">
                            <span class="label-text">{{ $t('approvalFlow.cooperative.commoditiesProducts') }}</span>
                            <v-tooltip top color="00BD73" max-width="350">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon size="16" class="icon-with-background primary--text" style="color:#0EBF67"
                                        v-bind="attrs" v-on="on">
                                        mdi-alert-circle
                                    </v-icon>
                                </template>
                                <span>{{ $t('approvalFlow.cooperative.interestedCommoditiesTT') }}</span>
                            </v-tooltip>
                        </div>
                        <div class="detail-value">{{ cooperative.products ? cooperative.products.join(', ') :
                            'N/A' }}</div>
                    </div>

                    <div class="detail-item">
                        <div class="detail-label">
                            <span class="label-text">{{ $t('approvalFlow.cooperative.userType') }}</span>
                            <v-tooltip top color="00BD73" max-width="350">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon size="16" class="icon-with-background primary--text" style="color:#0EBF67"
                                        v-bind="attrs" v-on="on">
                                        mdi-alert-circle
                                    </v-icon>
                                </template>
                                <span>{{ $t('approvalFlow.cooperative.userTypeTT') }}</span>
                            </v-tooltip>
                        </div>
                        <div class="detail-value">{{ cooperative.userType || 'N/A' }}</div>
                    </div>

                    <div class="detail-item">
                        <div class="detail-label">
                            <span class="label-text">{{ $t('approvalFlow.cooperative.cooperativeEmail') }}</span>
                        </div>
                        <div class="detail-value">{{ cooperative.email || 'N/A' }}</div>
                    </div>

                    <div class="detail-item">
                        <div class="detail-label">
                            <span class="label-text">{{ $t('approvalFlow.cooperative.cooperativePhoneNumber') }}</span>
                        </div>
                        <div class="detail-value">{{ cooperative.mobile || 'N/A' }}</div>
                    </div>

                    <div class="detail-item ">
                        <div class="detail-label">
                            <span class="label-text">{{ $t('approvalFlow.cooperative.logo') }}</span>
                            <v-tooltip top color="00BD73" max-width="350">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon size="16" class="icon-with-background primary--text" style="color:#0EBF67"
                                        v-bind="attrs" v-on="on">
                                        mdi-alert-circle
                                    </v-icon>
                                </template>
                                <span>{{ $t('approvalFlow.cooperative.logoTT') }}</span>
                            </v-tooltip>
                        </div>
                        <div class="detail-value">
                            <div class="logo-image" height="100px" width="100px">
                                <img v-if="cooperative.profilePicUrl || cooperative.subOrgLogo" :src="cooperative.profilePicUrl || cooperative.subOrgLogo" height="40px"
                                    width="40px" />
                                <span v-else class="text-muted">No Logo</span>
                            </div>
                        </div>
                    </div>

                    <div class="detail-item">
                        <div class="detail-label">
                            <span class="label-text">{{ $t('approvalFlow.cooperative.status') }}</span>
                            <v-tooltip top color="00BD73" max-width="350">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon size="16" class="icon-with-background primary--text" style="color:#0EBF67"
                                        v-bind="attrs" v-on="on">
                                        mdi-alert-circle
                                    </v-icon>
                                </template>
                                <span>{{ $t('approvalFlow.cooperative.statusTT') }}</span>
                            </v-tooltip>
                        </div>
                        <div class="status-container">
                            <v-btn small rounded min-width="100" depressed class="green-button" height="32"
                                v-if="cooperative.active">
                                {{ $t("approvalFlow.cooperative.active") }}
                            </v-btn>
                            <v-btn small rounded min-width="100" depressed class="red-button" height="32" v-else>
                                {{ $t("approvalFlow.cooperative.deactivated") }}
                            </v-btn>
                        </div>
                    </div>
                </div>
            </div>

            <hr class="my-4 opacity-50">
            <!-- Primary Contact Section -->
            <div class="details-section">
                <div class="section-header">
                    <h3 class="section-title">{{ $t('approvalFlow.cooperative.primaryContact') }}</h3>
                    <v-tooltip top color="00BD73" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon size="16" class="icon-with-background primary--text" style="color:#0EBF67"
                                v-bind="attrs" v-on="on">
                                mdi-alert-circle
                            </v-icon>
                        </template>
                        <span>{{ $t('approvalFlow.cooperative.primaryContactTT') }}</span>
                    </v-tooltip>
                </div>

                <div class="details-grid">
                    <div class="detail-item">
                        <div class="detail-label">
                            <span class="label-text">{{ $t('approvalFlow.cooperative.firstName') }}</span>
                        </div>
                        <div class="detail-value">{{ cooperative.firstName || 'N/A' }}</div>
                    </div>

                    <div class="detail-item">
                        <div class="detail-label">
                            <span class="label-text">{{ $t('approvalFlow.cooperative.lastName') }}</span>
                        </div>
                        <div class="detail-value">{{ cooperative.lastName || 'N/A' }}</div>
                    </div>

                    <div class="detail-item">
                        <div class="detail-label">
                            <span class="label-text">{{ $t('approvalFlow.cooperative.email') }}</span>
                        </div>
                        <div class="detail-value">{{ cooperative.email || 'N/A' }}</div>
                    </div>

                    <div class="detail-item">
                        <div class="detail-label">
                            <span class="label-text">{{ $t('approvalFlow.cooperative.phoneNumber') }}</span>
                        </div>
                        <div class="detail-value">{{ cooperative.mobile || 'N/A' }}</div>
                    </div>
                </div>
            </div>

            <hr class="my-4 opacity-25">
            <!-- Location Section -->
            <div class="details-section">
                <div class="section-header">
                    <h3 class="section-title">{{ $t('approvalFlow.cooperative.location') }}</h3>
                    <v-tooltip top color="00BD73" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon size="16" class="icon-with-background primary--text" style="color:#0EBF67"
                                v-bind="attrs" v-on="on">
                                mdi-alert-circle
                            </v-icon>
                        </template>
                        <span>{{ $t('approvalFlow.cooperative.locationTT') }}</span>
                    </v-tooltip>
                </div>

                <div class="details-grid">
                    <div class="detail-item">
                        <div class="detail-label">
                            <span class="label-text">{{ $t('approvalFlow.cooperative.country') }}</span>
                            <v-tooltip top color="00BD73" max-width="350">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon size="16" class="icon-with-background primary--text" style="color:#0EBF67"
                                        v-bind="attrs" v-on="on">
                                        mdi-alert-circle
                                    </v-icon>
                                </template>
                                <span>{{ $t('approvalFlow.cooperative.countryTT') }}</span>
                            </v-tooltip>
                        </div>
                        <div class="detail-value">{{ cooperative.country || 'N/A' }}</div>
                    </div>

                    <div class="detail-item">
                        <div class="detail-label">
                            <span class="label-text">{{ $t('approvalFlow.cooperative.provinceState') }}</span>
                            <v-tooltip top color="00BD73" max-width="350">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon size="16" class="icon-with-background primary--text" style="color:#0EBF67"
                                        v-bind="attrs" v-on="on">
                                        mdi-alert-circle
                                    </v-icon>
                                </template>
                                <span>{{ $t('approvalFlow.cooperative.provinceStateTT') }}</span>
                            </v-tooltip>
                        </div>
                        <div class="detail-value">{{ cooperative.stateId || 'N/A' }}</div>
                    </div>

                    <div class="detail-item">
                        <div class="detail-label">
                            <span class="label-text">{{ $t('approvalFlow.cooperative.regionDistrict') }}</span>
                            <v-tooltip top color="00BD73" max-width="350">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon size="16" class="icon-with-background primary--text" style="color:#0EBF67"
                                        v-bind="attrs" v-on="on">
                                        mdi-alert-circle
                                    </v-icon>
                                </template>
                                <span>{{ $t('approvalFlow.cooperative.regionDistrictTT') }}</span>
                            </v-tooltip>
                        </div>
                        <div class="detail-value">{{ cooperative.district || 'N/A' }}</div>
                    </div>

                    <div class="detail-item">
                        <div class="detail-label">
                            <span class="label-text">{{ $t('approvalFlow.cooperative.villageTownCity') }}</span>
                            <v-tooltip top color="00BD73" max-width="350">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon size="16" class="icon-with-background primary--text" style="color:#0EBF67"
                                        v-bind="attrs" v-on="on">
                                        mdi-alert-circle
                                    </v-icon>
                                </template>
                                <span>{{ $t('approvalFlow.cooperative.villageTownCityTT') }}</span>
                            </v-tooltip>
                        </div>
                        <div class="detail-value">{{ cooperative.city || cooperative.village || 'N/A' }}</div>
                    </div>

                    <div class="detail-item full-width">
                        <div class="detail-label">
                            <span class="label-text">{{ $t('approvalFlow.cooperative.address') }}</span>
                            <v-tooltip top color="00BD73" max-width="350">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon size="16" class="icon-with-background primary--text" style="color:#0EBF67"
                                        v-bind="attrs" v-on="on">
                                        mdi-alert-circle
                                    </v-icon>
                                </template>
                                <span>{{ $t('approvalFlow.cooperative.addressTT') }}</span>
                            </v-tooltip>
                        </div>
                        <div class="detail-value">{{ cooperative.address || 'N/A' }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- card section with two tabls  -->
        <v-container fluid class="pt-0">
            <v-card class="mt-4" elevation="0">
                <v-card-text>
                    <v-tabs v-model="currentTab">
                        <v-tab href="#tab-reports" class="text-capitalize font-weight-bold">
                            {{ $t('dueDiligence.dueDiligenceReports') }}
                        </v-tab>
                        <v-tab href="#tab-shipments" class="text-capitalize font-weight-bold">
                            {{ $t('dueDiligence.shipments') }}
                        </v-tab>
                    </v-tabs>
                    <v-tabs-items v-model="currentTab" class="black--text">
                        <v-tab-item value="tab-reports">
                            <div class="px-4 py-6">
                                <div class="d-flex align-center mb-2">
                                    <h3 class="font-weight-bold mr-2">{{ $t('dueDiligence.dueDiligenceReports') }}</h3>
                                    <v-icon color="primary">mdi-information</v-icon>
                                </div>
                                <AdminDueDiligenceReports 
                                    v-if="cooperative.subOrgId" 
                                    :heroSearchData="heroSearchData" 
                                    :cooperativeId="cooperative.subOrgId" 
                                />
                                <div v-else class="text-center py-4">
                                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                                    <p class="mt-2">{{ $t('common.loading') }}</p>
                                </div>
                            </div>
                        </v-tab-item>
                        <v-tab-item value="tab-shipments">
                            <div class="px-4 py-6">
                                <div class="d-flex align-center mb-2">
                                    <h3 class="font-weight-bold mr-2">{{ $t('dueDiligence.shipments') }}</h3>
                                    <v-icon color="primary">mdi-information</v-icon>
                                </div>
                                <Shipments 
                                    v-if="cooperative.subOrgId" 
                                    :heroSearchData="shipmentSearchData" 
                                    :cooperativeId="cooperative.subOrgId"
                                />
                                <div v-else class="text-center py-4">
                                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                                    <p class="mt-2">{{ $t('common.loading') }}</p>
                                </div>
                            </div>
                        </v-tab-item>
                    </v-tabs-items>
                </v-card-text>
            </v-card>
        </v-container>

        <!-- Edit Dialog -->
        <AddCooprateDialog :dialog="addEditDialog" :item="editingItem" @close="onCloseDialog" @save="onSaveCooperative" />
    </div>
</template>

<script>
import AdminDueDiligenceReports from '../../components/AdminDueDiligenceReportsComponent.vue';
import Shipments from '../../components/Shipments.vue';
import AddCooprateDialog from './AddCooprateDialog.vue';
import ApprovalFlowService from '@/_services/ApprovalFlowService';
import loadingMixin from "@/mixins/LoadingMixin"

export default {
    name: 'CorporativeDetails',
    components: {
        AdminDueDiligenceReports,
        Shipments,
        AddCooprateDialog,
    },
    props: {
        id: {
            type: [String, Number],
            required: false,
            default: null
        }
    },
    mounted() {
        this.getCooperativeDetails();
    },
    data() {
        return {
            breadcrumbs: [
                {
                    text: this.$t("Cooperatives"),
                    disabled: false,
                    href: "/approval-flow/cooperatives"
                },
                {
                    text: this.$t("View Cooperative"),
                    disabled: true,
                }
            ],
            currentTab: 'tab-reports',
            heroSearchData: {},
            shipmentSearchData: {},
            cooperative: {},
            status: false,
            error: null,
            addEditDialog: false,
            editingItem: null
        }
    },
    computed: {
        cooperativeId() {
            // Get ID from URL path: /approval-flow/cooperatives/view/192336
            const pathSegments = this.$route.path.split('/');
            const viewIndex = pathSegments.indexOf('view');
            const idFromPath = viewIndex !== -1 && pathSegments[viewIndex + 1] ? pathSegments[viewIndex + 1] : null;
            
            return this.id || this.$route.params.id || idFromPath;
        }
    },
    methods: {
        async getCooperativeDetails() {
            if (!this.cooperativeId) {
                this.error = 'No cooperative ID provided';
                this.stopLoading();
                return;
            }
            
            try {
                this.startLoading();
                this.error = null;
                const response = await ApprovalFlowService.getCooperativeDetails(this.cooperativeId);

                if (response.success && response.data) {
                    this.cooperative = {
                        id: response.data.id,
                        fullName: response.data.fullName || '',
                        firstName: response.data.firstName || '',
                        middleName: response.data.middleName || '',
                        lastName: response.data.lastName || '',
                        email: response.data.email || '',
                        mobile: response.data.mobile || '',
                        profilePicUrl: response.data.profilePicUrl || '',
                        address: response.data.address || '',
                        country: response.data.country || '',
                        stateId: response.data.stateId || '',
                        city: response.data.city || '',
                        district: response.data.district || '',
                        village: response.data.village || '',
                        verified: response.data.verified || false,
                        active: response.data.active || false,
                        userType: response.data.userType || '',
                        buisnessName: response.data.buisnessName || '',
                        createdAt: response.data.createdAt || '',
                        organization: response.data.organization || null,
                        org: response.data.org || {
                            name: '',
                            id: null,
                            code: '',
                            logo: '',
                            status: '',
                            country: '',
                            products: []
                        },
                        subOrg: response.data.subOrg || '',
                        subOrgLogo: response.data.subOrgLogo || '',
                        subOrgId: response.data.subOrgId || '',
                        products: response.data.products || [],
                        NoOfFarmsPlanningtoonboard: response.data.NoOfFarmsPlanningtoonboard || '',
                    };
                }
            } catch (error) {
                console.error('Error fetching cooperative details:', error);
                this.error = 'Failed to load cooperative details';
            } finally {
                this.stopLoading();
            }
        },
        goBackToCooperativeList() {
            this.$router.push('/approval-flow/cooperatives');
        },
        editCooperative() {
            this.editingItem = this.cooperative;
            this.addEditDialog = true;
        },
        async deleteCooperative(id) {
            try {
                this.startLoading();
                const response = await ApprovalFlowService.deleteCooperative(id);
                if (response.success) {
                    this.$notify({
                        text: this.$t('approvalFlow.cooperative.cooperativeDeletedSuccessfully'),
                        type: 'success'
                    });
                    // Navigate back to the cooperative list after successful deletion
                    this.$router.push('/approval-flow/cooperatives');
                }
            } catch (error) {
                console.error('Error deleting cooperative:', error);
                this.$notify({
                    text: this.$t('approvalFlow.cooperative.errorDeletingCooperative'),
                    type: 'error'
                });
            } finally {
                this.stopLoading();
            }
        },
        async deactivateCooperativeMethod(id, status) {
            // just to toggle status
            this.status = status;
            try {
                this.startLoading();
                this.status = status ? 'deactivate' : 'activate';
                const response = await ApprovalFlowService.deactivateCooperative(id, this.status);
                if (response.success) {
                    this.$notify({
                        text: this.$t('Cooperative deactivated successfully'),
                        type: 'success'
                    });
                }
                await this.getCooperativeDetails();
            } catch (error) {
                console.error('Error deactivating cooperative:', error);
                this.$notify({
                    text: this.$t('Error deactivating cooperative'),
                    type: 'error'
                });
            } finally {
                this.stopLoading();
            }
        },
        onCloseDialog() {
            this.addEditDialog = false;
            this.editingItem = null;
        },
        async onSaveCooperative(payload) {
            try {
                this.startLoading();
                let response;
                if (payload.id) {
                    response = await ApprovalFlowService.updateCooperative(payload.id, payload);
                } else {
                    response = await ApprovalFlowService.addCooperative(payload);
                }

                if (response.success) {
                    await this.getCooperativeDetails();
                    this.$notify({
                        text: payload.id ? this.$t('Updated successfully') : this.$t('Created successfully'),
                        type: 'success'
                    });
                    this.onCloseDialog();
                } else {
                    throw new Error(response.message || 'Failed to save cooperative');
                }
            } catch (error) {
                console.error('Error saving cooperative:', error);
                this.$notify({
                    text: error.message || this.$t('Error saving cooperative'),
                    type: 'error'
                });
            } finally {
                this.stopLoading();
            }
        },
    },
    mixins: [loadingMixin],
}

</script>

<style scoped>
.cooperative-details-container {
    background: white;
    padding: 24px;
    margin: 16px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.details-section {
    margin-bottom: 32px;
}

.details-section:last-child {
    margin-bottom: 0;
}

.section-header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
}

.section-title {
    font-weight: bold;
    font-size: 18px;
    color: #333;
    margin: 0;
    margin-right: 8px;
}

.info-icon {
    color: #2196F3;
    font-size: 16px;
}

.details-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
}

.detail-item {
    display: flex;
    flex-direction: column;
}

.detail-item.full-width {
    grid-column: 1 / -1;
}

.detail-label {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
}

.label-text {
    font-weight: bold;
    font-size: 12px;
    color: #666;
    margin-right: 6px;
}

.detail-value {
    font-weight: bold;
    font-size: 14px;
    color: #333;
    line-height: 1.4;
}

.status-section {
    grid-column: span 2;
}




.status-container {
    display: flex;
    align-items: center;
}

.status-chip {
    background-color: #E8F5E8 !important;
    color: #2E7D32 !important;
    font-weight: bold;
    padding: 8px 16px;
    border-radius: 20px;
}

.blue-button {
    background-color: #d0e6fe !important;
    /* Blue background */
    border: 2px solid #002287 !important;
    /* Blue border */
    color: #002287 !important;
}

.orange-button {
    background-color: #fff7ec !important;
    /* Orange background */
    border: 2px solid #ffa826 !important;
    /* Orange border */
    color: #ffa826 !important;
}

.green-button {
    background-color: #e8f5e8 !important;
    /* Green background */
    border: 2px solid #50b053 !important;
    /* Green border */
    color: #4caf50 !important;
}

.red-button {
    background-color: #ffeaea !important;
    /* Red background */
    border: 2px solid #f44336 !important;
    /* Red border */
    color: #f44336 !important;
}

/* Responsive design */
@media (max-width: 1200px) {
    .details-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 900px) {
    .details-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .logo-section,
    .status-section {
        grid-column: span 1;
    }
}

@media (max-width: 600px) {
    .details-grid {
        grid-template-columns: 1fr;
    }

    .logo-section,
    .status-section {
        grid-column: span 1;
    }

    .cooperative-details-container {
        padding: 16px;
        margin: 8px;
    }
}

.border-color-grey {
    border-color: #e0e0e0;
}
</style>