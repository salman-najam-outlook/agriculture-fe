<template>
    <v-container fluid>
        <!-- Breadcrumbs -->
        <v-breadcrumbs :items="breadcrumbs" class="mb-2" />

        <!-- Header -->
        <div class="d-flex align-center mb-4 px-6">
            <h2 class="font-weight-bold">{{ $t('carbonCredit.plotTreeMapping.request') }} ({{ request.request_id }})</h2>
            <v-spacer />
            <v-btn color="error" outlined class="mr-2" @click="cancelRequest">{{
                $t('carbonCredit.plotTreeMapping.cancelRequest')}}</v-btn>
            <v-btn color="primary" class="mr-2" @click="goBack">{{ $t('back') }}</v-btn>
            <v-btn color="primary" class="mr-2" @click="editRequest">{{ $t('edit') }}</v-btn>
            <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn color="success" outlined class="mr-2" v-bind="attrs" v-on="on">
                        <v-icon left>mdi-download</v-icon> {{ $t('download') }}
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item @click="download('pdf')"><v-list-item-title>Download as
                            PDF</v-list-item-title></v-list-item>
                    <v-list-item @click="download('xls')"><v-list-item-title>Download as
                            XLS</v-list-item-title></v-list-item>
                </v-list>
            </v-menu>
            <v-btn color="primary" @click="markCompleted">MARK AS COMPLETED</v-btn>
        </div>

        <div class="px-6">

            <!-- Expansion Panels for all sections -->
            <v-expansion-panels multiple expand v-model="expandedPanels">
                <!-- Request Detail Card -->
                <v-expansion-panel>
                    <v-expansion-panel-header>
                        <div class="font-weight-bold">Plot Tree Mapping Request Detail</div>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-row>
                            <v-col cols="4">
                                <v-card class="pa-4" color="primary-lighten1" elevation="0">
                                    <p class="font-weight-bold">Start Date <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon v-bind="attrs" v-on="on"
                                                    size="16">mdi-information-outline</v-icon>
                                            </template>
                                            <span>The date when the plot tree mapping request was created.</span>
                                        </v-tooltip></p>
                                    <p class="">{{ formatDate(request.start_date) }}</p>
                                </v-card>
                            </v-col>
                            <v-col cols="4">
                                <v-card class="pa-4" color="primary-lighten1" elevation="0">
                                    <p class="font-weight-bold">Due Date <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon v-bind="attrs" v-on="on"
                                                    size="16">mdi-information-outline</v-icon>
                                            </template>
                                            <span>The date when the plot tree mapping request is due.</span>
                                        </v-tooltip></p>
                                    <p class="">{{ formatDate(request.due_date) }}</p>
                                </v-card>
                            </v-col>
                            <v-col cols="4">
                                <v-card class="pa-4" color="primary-lighten1" elevation="0">
                                    <p class="font-weight-bold">Status <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon v-bind="attrs" v-on="on"
                                                    size="16">mdi-information-outline</v-icon>
                                            </template>
                                            <span>The status of the plot tree mapping request.</span>
                                        </v-tooltip></p>
                                    <p class="">{{ formatStatus(request.status) }}</p>
                                </v-card>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="6">
                                <v-card class="pa-4" color="primary-lighten1" elevation="0">
                                    <p class="font-weight-bold">Farm Location Address <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon v-bind="attrs" v-on="on"
                                                    size="16">mdi-information-outline</v-icon>
                                            </template>
                                            <span>The address of the farm where the plot tree mapping request is
                                                located.</span>
                                        </v-tooltip></p>
                                    <p class="">{{ request.farm?.address || 'N/A' }}</p>
                                </v-card>
                            </v-col>
                            <v-col cols="6">
                                <v-card class="pa-4" color="primary-lighten1" elevation="0">
                                    <p class="font-weight-bold">Description <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon v-bind="attrs" v-on="on"
                                                    size="16">mdi-information-outline</v-icon>
                                            </template>
                                            <span>The description of the plot tree mapping request.</span>
                                        </v-tooltip></p>
                                    <p class="">{{ request.notes || 'N/A' }}</p>
                                </v-card>
                            </v-col>

                            <v-col cols="12" class="mt-4">
                                <v-data-table :headers="plotHeaders" :items="request.plots" class="elevation-0"
                                    hide-default-footer>
                                    <template v-slot:item.coordinates="{ item }">
                                        <div>
                                            <div>{{ item.longitude }}, {{ item.latitude }}</div>
                                        </div>
                                    </template>
                                    <template v-slot:item.radius="{ item }">
                                        <div>{{ item.radius }} m</div>
                                    </template>
                                    <template v-slot:item.status="{ item }">
                                        <v-chip :color="statusColor(item.status)" small outlined>{{ formatStatus(item.status)
                                            }}</v-chip>
                                    </template>
                                    <template v-slot:item.actions="{ item }">
                                        <v-menu offset-y>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn icon v-bind="attrs"
                                                    v-on="on"><v-icon>mdi-dots-vertical</v-icon></v-btn>
                                            </template>
                                            <v-list>
                                                <v-list-item
                                                    @click="viewPlot(item)"><v-list-item-title>View</v-list-item-title></v-list-item>
                                                <v-list-item
                                                    @click="editPlot(item)"><v-list-item-title>Edit</v-list-item-title></v-list-item>
                                                <v-list-item
                                                    @click="deletePlot(item)"><v-list-item-title>Delete</v-list-item-title></v-list-item>
                                            </v-list>
                                        </v-menu>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-content>
                </v-expansion-panel>

                <!-- Assignee -->
                <v-expansion-panel>
                    <v-expansion-panel-header>
                        <div class="font-weight-bold">Assignee</div>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-row v-if="request.assignees && request.assignees.length > 0">
                            <v-col cols="6" v-for="(assignee, index) in request.assignees" :key="index">
                                <v-card class="pa-4" color="primary-lighten1" elevation="0">
                                    <div class="d-flex justify-space-between align-center">
                                        <div>
                                            <p class="font-weight-bold">{{ assignee.assignee_role }} <v-tooltip bottom>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-icon v-bind="attrs" v-on="on"
                                                            size="16">mdi-information-outline</v-icon>
                                                    </template>
                                                    <span>The role of the assignee.</span>
                                                </v-tooltip></p>
                                            <p class="">{{ assignee.assignee.fullName }}</p>
                                       
                                        </div>
                                        <div>
                                            <p class="font-weight-bold primary--text cursor-pointer"
                                                @click="viewAssignee(assignee.assignee)">View
                                            </p>
                                        </div>
                                    </div>
                                </v-card>
                            </v-col>
                        </v-row>
                        <v-row v-else>
                            <v-col cols="12">
                                <v-card class="pa-4" color="primary-lighten1" elevation="0">
                                    <p class="text-grey">No assignees assigned</p>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-content>
                </v-expansion-panel>

                <!-- Farm Information -->
                <v-expansion-panel>
                    <v-expansion-panel-header>
                        <div class="font-weight-bold">Farm Information</div>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-row>
                            <v-col cols="4">
                                <v-card class="pa-4" color="primary-lighten1" elevation="0">
                                    <p class="font-weight-bold">Farm Name <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon v-bind="attrs" v-on="on"
                                                    size="16">mdi-information-outline</v-icon>
                                            </template>
                                            <span>The name of the farm.</span>
                                        </v-tooltip></p>
                                    <p class="">{{ request.farm?.farmName || 'N/A' }}</p>
                                </v-card>
                            </v-col>
                            <v-col cols="4">
                                <v-card class="pa-4" color="primary-lighten1" elevation="0">
                                    <p class="font-weight-bold">Dimitra Farm ID <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon v-bind="attrs" v-on="on"
                                                    size="16">mdi-information-outline</v-icon>
                                            </template>
                                            <span>The ID of the farm.</span>
                                        </v-tooltip></p>
                                    <p class="">{{ request.farm?.dimitraFarmId || 'N/A' }}</p>
                                </v-card>
                            </v-col>
                            <v-col cols="4">
                                <v-card class="pa-4" color="primary-lighten1" elevation="0">
                                    <p class="font-weight-bold">Crop Growing Practices <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon v-bind="attrs" v-on="on"
                                                    size="16">mdi-information-outline</v-icon>
                                            </template>
                                            <span>The registration number of the farm.</span>
                                        </v-tooltip></p>
                                    <p class="">{{ request.farm?.registrationNo || 'N/A' }}</p>
                                </v-card>
                            </v-col>
                            <v-col cols="4">
                                <v-card class="pa-4" color="primary-lighten1" elevation="0">
                                    <p class="font-weight-bold">Status <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon v-bind="attrs" v-on="on"
                                                    size="16">mdi-information-outline</v-icon>
                                            </template>
                                            <span>The status of the farm.</span>
                                        </v-tooltip></p>
                                    <p class="">{{ formatStatus(request.farm?.status) }}</p>
                                </v-card>
                            </v-col>
                            <v-col cols="4">
                                <v-card class="pa-4" color="primary-lighten1" elevation="0">
                                    <p class="font-weight-bold">Farm Geofence <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon v-bind="attrs" v-on="on"
                                                    size="16">mdi-information-outline</v-icon>
                                            </template>
                                            <span>The geofence of the farm.</span>
                                        </v-tooltip></p>
                                    <p class="">{{ request.farm?.farmGeofenceName || 'N/A' }}</p>
                                </v-card>
                            </v-col>
                            <v-col cols="4">
                                <v-card class="pa-4" color="primary-lighten1" elevation="0">
                                    <p class="font-weight-bold">Farm Location Address <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon v-bind="attrs" v-on="on"
                                                    size="16">mdi-information-outline</v-icon>
                                            </template>
                                            <span>The address of the farm.</span>
                                        </v-tooltip></p>
                                    <p class="">{{ request.farm?.address || 'N/A' }}</p>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-content>
                </v-expansion-panel>

                <!-- Farmer Information -->
                <v-expansion-panel>
                    <v-expansion-panel-header>
                        <div class="font-weight-bold">Farmer Information</div>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-row>
                            <v-col cols="3">
                                <v-card class="pa-4" color="primary-lighten1" elevation="0">
                                    <p class="font-weight-bold">Farmer First Name <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon v-bind="attrs" v-on="on"
                                                    size="16">mdi-information-outline</v-icon>
                                            </template>
                                            <span>The first name of the farmer.</span>
                                        </v-tooltip></p>
                                    <p class="">{{ request.farmer?.firstName || 'N/A' }}</p>
                                </v-card>
                            </v-col>
                            <v-col cols="3">
                                <v-card class="pa-4" color="primary-lighten1" elevation="0">
                                    <p class="font-weight-bold">Farmer Middle Name <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon v-bind="attrs" v-on="on"
                                                    size="16">mdi-information-outline</v-icon>
                                            </template>
                                            <span>The middle name of the farmer.</span>
                                        </v-tooltip></p>
                                    <p class="">{{ request.farmer?.middleName || 'N/A' }}</p>
                                </v-card>
                            </v-col>
                            <v-col cols="3">
                                <v-card class="pa-4" color="primary-lighten1" elevation="0">
                                    <p class="font-weight-bold">Farmer Last Name <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon v-bind="attrs" v-on="on"
                                                    size="16">mdi-information-outline</v-icon>
                                            </template>
                                            <span>The last name of the farmer.</span>
                                        </v-tooltip></p>
                                    <p class="">{{ request.farmer?.lastName || 'N/A' }}</p>
                                </v-card>
                            </v-col>
                            <v-col cols="3">
                                <v-card class="pa-4" color="primary-lighten1" elevation="0">
                                    <p class="font-weight-bold">Farmer Registration ID <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon v-bind="attrs" v-on="on"
                                                    size="16">mdi-information-outline</v-icon>
                                            </template>
                                            <span>The registration ID of the farmer.</span>
                                        </v-tooltip></p>
                                    <p class="">{{ request.farmer?.id_number || 'N/A' }}</p>
                                </v-card>
                            </v-col>
                            <v-col cols="3">
                                <v-card class="pa-4" color="primary-lighten1" elevation="0">
                                    <p class="font-weight-bold">Dimitra Farmer ID <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon v-bind="attrs" v-on="on"
                                                    size="16">mdi-information-outline</v-icon>
                                            </template>
                                            <span>The ID of the farmer.</span>
                                        </v-tooltip></p>
                                    <p class="">{{ request.farmer?.id || 'N/A' }}</p>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>

        </div>
        <PlotDetails v-if="showPlotDetailsDialog" :dialog="showPlotDetailsDialog"
            :plot="selectedPlot" :requestId="requestId" @close="showPlotDetailsDialog = false" />

            <confirm-box :title="$t('carbonCredit.plotTreeMapping.deleteRequest')"
        :message="deleteMessage" :cancelBtnText="$t('carbonCredit.plotTreeMapping.cancel')"
        :confirmBtnText="$t('carbonCredit.plotTreeMapping.confirm')" :confirmData="confirmDeleteData"
        :dialog="confirmDeleteDialog" @cancel:action="confirmDeleteDialog = false"
        @continue:action="confirmRemoveProduct" />
    </v-container>
</template>

<script>
import PlotDetails from './PlotDetails.vue';
import CarbonCreditService from '@/_services/CarbonCreditService';
import loadingMixin from '@/mixins/LoadingMixin';
import dateMixin from '@/mixins/DateMixin';
import ConfirmBox from "@/components/ConfirmBox";
export default {
    components: {
        PlotDetails,
        ConfirmBox,
    },
    mixins: [loadingMixin, dateMixin],
    async mounted() {
        await this.getRequest();
    },
    data() {
        return {
            requestId: this.$route.params.id,
            showPlotDetailsDialog: false,
            breadcrumbs: [
                { text: 'Dashboard', disabled: false },
                { text: 'Carbon Credit', disabled: false },
                { text: 'Plot Tree Mapping', disabled: false },
                { text: 'Request Details', disabled: true },
            ],
            request: {
                // Will be populated from API
            },
            plotHeaders: [
                { text: 'Plot Number', value: 'plot_no' },
                { text: 'Longitude / Latitude', value: 'coordinates' },
                { text: 'Plot Radius', value: 'radius' },
                { text: 'Number of Trees', value: 'no_of_trees' },
                { text: 'Status', value: 'status' },
                { text: '', value: 'actions', sortable: false },
            ],
            expandedPanels: [0, 1, 2, 3, 4],
            selectedPlot: null,
            confirmDeleteDialog: false,
            confirmDeleteData: null,
            deleteMessage: '',
        };
    },
    methods: {
        async getRequest() {
            this.startLoading();
            const response = await CarbonCreditService.getPlotTreeMappingRequestById(this.requestId);
            this.request = response.data;
            this.stopLoading();
        },
        statusColor(status) {
            switch (status) {
                case 'completed':
                case 'approved':
                case 'Submitted':
                    return 'success';
                case 'cancelled':
                case 'rejected':
                    return 'error';
                case 'pending':
                case 'Pending':
                    return 'grey';
                case 'partially_submitted':
                case 'Partially Submitted':
                    return 'warning';
                default:
                    return 'grey';
            }
        },
        cancelRequest() {
            // Implement cancel logic
        },
        goBack() {
            this.$router.go(-1);
        },
        editRequest() {
            this.$router.push({ name: 'treePlotAdd', params: { id: this.requestId } });
        },
        async download(type) {
    const mimeMap = {
        pdf: 'application/pdf',
        xls: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };

    const extensionMap = {
        pdf: 'pdf',
        xls: 'xlsx'
    };

    try {
        this.startLoading();
        const response = await CarbonCreditService.downloadReportDetails(this.requestId, type);
        const blob = new Blob([response.data], { type: mimeMap[type] });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `plot-report-details-${this.requestId}.${extensionMap[type]}`);
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }, 100);

        this.$toast.success(`${type.toUpperCase()} downloaded successfully`);
    } catch (error) {
        this.$toast.error(`Failed to download ${type.toUpperCase()}`);
    } finally {
        this.stopLoading();
    }
}
,
        markCompleted() {
            // Implement mark as completed logic
        },
        viewPlot(plot) {
            this.selectedPlot = plot;   
            this.showPlotDetailsDialog = true;
        },
        editPlot(plot) {
            this.$router.push({ name: 'plotLocation', params: { id: plot.id } });
        },
        deletePlot(plot) {
            this.confirmDeleteData = plot;
            this.deleteMessage = 'Are you sure you want to delete this plot?';
            this.confirmDeleteDialog = true;
        },
        viewAssignee(assignee) {
            this.$router.push({ name: 'plotTreeMappingAssignee', params: { id: assignee.id } });
        },
        formatStatus(status) {
            if (!status) return 'N/A';
            const statusMap = {
                'pending': 'Pending',
                'partially_submitted': 'Partially Submitted',
                'completed': 'Completed',
                'cancelled': 'Cancelled',
                'approved': 'Approved',
                'rejected': 'Rejected'
            };
            return statusMap[status] || status;
        },
        async confirmRemoveProduct() {
            this.startLoading();
            await CarbonCreditService.deleteTreePlot(this.confirmDeleteData.id);
            this.stopLoading();
            this.confirmDeleteDialog = false;
            this.getRequest();
        },
    },
};
</script>

<style scoped>
.v-card {
    background: #f9fdfb;
}

.v-card-title {
    font-weight: bold;
    font-size: 16px;
}

.v-text-field,
.v-textarea {
    background: #eafaf3 !important;
}

.v-chip {
    font-weight: 500;
    font-size: 13px;
    text-transform: none;
}

.primary-lighten1 {
    background-color: #eafaf3;
}
</style>
