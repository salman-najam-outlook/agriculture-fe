<template>
    <div>
      <breadcrumb :items="breadcrumbs"></breadcrumb>
      <v-container fluid>
        <div class="d-flex mb-4">
          <h2>{{ $t('carbonCredit.plotTreeMapping.title') }}</h2>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark class="mr-2 mb-2" @click="addNewRequest">
            {{ $t('carbonCredit.plotTreeMapping.addANewRequest') }}
          </v-btn>
        </div>
        <v-card elevation="0" class="px-5 mt-7">
          <v-card-text>
            <v-row class="mb-4">
              <v-col cols="3">
                <v-text-field
                  v-model="filters.requestId"
                  prepend-inner-icon="mdi-magnify"
                  label="Request ID"
                  dense
                  outlined
                  hide-details
                  @input="onFilterChange"
                />
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="filters.assignedTo"
                  :items="assignedToOptions"
                  label="Assigned To"
                  dense
                  outlined
                  hide-details
                  clearable
                  @change="onFilterChange"
                />
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="filters.status"
                  :items="statusOptions"
                  label="Status"
                  dense
                  outlined
                  hide-details
                  clearable
                  @change="onFilterChange"
                />
              </v-col>
            </v-row>
            <v-data-table
              :headers="headers"
              :items="filteredItems"
              :items-per-page="10"
              hide-default-footer
              class="elevation-0"
              item-key="id"
              :loading="tableLoading"
              loading-text="Loading requests..."
            >
            <template v-slot:item.request_id="{ item }">
                <span class="font-weight-medium">{{ item.request_id }}</span>
            </template>
            <template v-slot:item.assignedTo="{ item }">
                <div v-if="item.assignees && item.assignees.length > 0">
                  <span v-for="(assignee, index) in item.assignees" :key="index">
                    {{ assignee.assignee.fullName || `User ${assignee.assignee.id}` }}
                    <br v-if="index < item.assignees.length - 1">
                  </span>
                </div>
                <span v-else class="text-grey">Not assigned</span>
            </template>
            <template v-slot:item.numberOfPlots="{ item }">
                <span class="font-weight-medium">{{ item.plot_count || 0 }}</span>
            </template>
            <template v-slot:item.farmAddress="{ item }">
                <div>
                  <div class="font-weight-medium">{{ item.farm?.farmName || 'N/A' }}</div>
                  <div class="text-caption text-grey">{{ item.farm?.address || 'No address' }}</div>
                </div>
            </template>
            <template v-slot:item.startDate="{ item }">
                <div>
                  <div>{{ formatDate(item.start_date) }}</div>
                  <div>{{ formatDate(item.due_date) }}
                    <v-tooltip v-if="isOverdue(item.due_date)" bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon color="error" small v-bind="attrs" v-on="on">mdi-alert</v-icon>
                      </template>
                      <span>Overdue</span>
                    </v-tooltip>
                  </div>
                </div>
            </template>
              <template v-slot:item.status="{ item }">
                <v-btn :color="statusColor(item.status)" class="status-chip" small outlined rounded>
                  {{ formatStatus(item.status) }}
                </v-btn>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item @click="viewRequest(item)">
                      <v-list-item-title>View</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="editRequest(item)">
                      <v-list-item-title>Edit</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="openConfirmDeleteDialog(item)">
                      <v-list-item-title class="red--text">Delete Request</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>

        <confirm-box :title="$t('carbonCredit.plotTreeMapping.deleteRequest')"
        :message="deleteMessage" :cancelBtnText="$t('carbonCredit.plotTreeMapping.cancel')"
        :confirmBtnText="$t('carbonCredit.plotTreeMapping.confirm')" :confirmData="confirmDeleteData"
        :dialog="confirmDeleteDialog" @cancel:action="confirmDeleteDialog = false"
        @continue:action="confirmRemoveProduct" />

      </v-container>
    </div>
  </template>
  
  <script>
  import moment from "moment";
  import CarbonCreditService from "@/_services/CarbonCreditService";
  import loadingMixin from "@/mixins/LoadingMixin";
  import ConfirmBox from "@/components/ConfirmBox";
  export default {
    mixins: [loadingMixin],
    components: {
      "confirm-box": ConfirmBox,
    },
    data() {
      return {
        confirmDeleteDialog: false,
        confirmDeleteData: null,
        deleteMessage: '',
        breadcrumbs: [
          { text: this.$t('dashboard'), disabled: false },
          { text: this.$t('carbonCredit.title'), disabled: false },
          { text: this.$t('carbonCredit.plotTreeMapping.title'), disabled: true },
        ],
        tableLoading: false,
        filters: {
          requestId: '',
          assignedTo: null,
          status: null,
        },
        assignedToOptions: [],
        statusOptions: ['pending', 'partially_submitted', 'completed', 'cancelled'],
        headers: [
          { text: 'Request ID', value: 'request_id' },
          { text: 'Assigned To', value: 'assignedTo' },
          { text: 'Number of Plots', value: 'numberOfPlots' },
          { text: 'Farm Address', value: 'farmAddress' },
          { text: 'Start Date / Due Date', value: 'startDate' },
          { text: 'Status', value: 'status' },
          { text: '', value: 'actions', sortable: false },
        ],
        items: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
        },
        isEditMode: false,
        requestId: null,
      };
    },
    async created() {
      this.startLoading();
      this.restoreFormData();

      // Detect edit mode
      this.requestId = this.$route.params.id;
      this.isEditMode = !!this.requestId;

      await this.getTreePlots();
      await this.fetchFarmers();

      // If editing, load the request data
      if (this.isEditMode) {
        await this.loadRequestData();
      }

      this.stopLoading();
    },
    computed: {
      filteredItems() {
        return this.items.filter(item => {
          return (
            (!this.filters.requestId || item.request_id.toLowerCase().includes(this.filters.requestId.toLowerCase())) &&
            (!this.filters.assignedTo || this.hasAssignee(item, this.filters.assignedTo)) &&
            (!this.filters.status || item.status === this.filters.status)
          );
        });
      },
    },
    async mounted() {
      this.startLoading();
      await this.fetchRequests();
      this.stopLoading();
    },
    methods: {
      async fetchRequests() {
        try {
          this.tableLoading = true;
          const response = await CarbonCreditService.getPlotTreeMappingRequests();
          
          if (response.success) {
            this.items = response.data.rows || [];
            this.pagination.total = response.data.count || 0;
            
            // Extract unique assignees for filter options
            this.extractAssignees();
          } else {
            this.$notify({
              type: 'error',
              text: response.message || 'Failed to fetch requests'
            });
          }
        } catch (error) {
          console.error('Error fetching requests:', error);
          this.$notify({
            type: 'error',
            text: 'An error occurred while fetching requests'
          });
        } finally {
          this.tableLoading = false;
        }
      },
      
      extractAssignees() {
        const assignees = new Set();
        this.items.forEach(item => {
          if (item.assignees && item.assignees.length > 0) {
            item.assignees.forEach(assignee => {
              const assigneeText = `${assignee.assignee_role}: ${assignee.assignee.fullName || `User ${assignee.assignee.id}`}`;
              assignees.add(assigneeText);
            });
          }
        });
        this.assignedToOptions = Array.from(assignees);
      },
      
      hasAssignee(item, filterValue) {
        if (!item.assignees || item.assignees.length === 0) return false;
        return item.assignees.some(assignee => {
          const assigneeText = `${assignee.assignee_role}: ${assignee.assignee.fullName || `User ${assignee.assignee.id}`}`;
          return assigneeText.includes(filterValue);
        });
      },
      
      formatDate(dateString) {
        if (!dateString) return 'N/A';
        return moment(dateString).format('DD-MMM-YYYY');
      },
      
      formatStatus(status) {
        const statusMap = {
          'pending': 'Pending',
          'partially_submitted': 'Partially Submitted',
          'completed': 'Completed',
          'cancelled': 'Cancelled'
        };
        return statusMap[status] || status;
      },
      
      isOverdue(dueDate) {
        if (!dueDate) return false;
        return moment(dueDate).isBefore(moment(), 'day');
      },
      
      statusColor(status) {
        switch (status) {
          case 'completed':
            return 'success';
          case 'cancelled':
            return 'error';
          case 'pending':
            return 'grey lighten-1';
          case 'partially_submitted':
            return 'warning';
          default:
            return 'grey';
        }
      },
      
      onFilterChange() {
        // Filters are applied automatically through computed property
        // No additional action needed as filtering is reactive
      },
      
      refreshData() {
        this.fetchRequests();
      },
      
      addNewRequest() {
        this.$router.push({ name: 'treePlotAdd' });
      },
      
      viewRequest(item) {
        this.$router.push({ name: 'viewPlotTreeMapping', params: { id: item.id } });
      },
      
      editRequest(item) {
        this.$router.push({ name: 'treePlotAdd', params: { id: item.id } });
      },

      openConfirmDeleteDialog(item) {
        this.confirmDeleteData = { id: item.id };
        this.deleteMessage = `Are you sure you want to delete request ${item.request_id}?`;
        this.confirmDeleteDialog = true;
      },
      
      async confirmRemoveProduct(action, confirmData) {
        if (!confirmData) return;
        
        try {
          this.startLoading();
          const response = await CarbonCreditService.deletePlotTreeMappingRequest(confirmData.id);
          
          if (response.success) {
            this.$notify({
              type: 'success',
              text: 'Request deleted successfully'
            });
            await this.fetchRequests();
          } else {
            this.$notify({
              type: 'error',
              text: response.message || 'Failed to delete request'
            });
          }
        } catch (error) {
          console.error('Error deleting request:', error);
          this.$notify({
            type: 'error',
            text: 'An error occurred while deleting the request'
          });
        } finally {
          this.stopLoading();
          this.confirmDeleteDialog = false;
        }
      },
      async loadRequestData() {
        try {
          const response = await CarbonCreditService.getPlotTreeMappingRequestById(this.requestId);
          if (response.success) {
            const data = response.data;
            this.selectedFarmerId = data.farmer_id;
            this.selectedFarmId = data.farm_id;
            this.startDate = data.start_date;
            this.dueDate = data.due_date;
            this.notes = data.notes;
            this.selectedPlot = data.plots || [];
            // If you have assignees, set them here as well
            // this.selectedAssignee = ...;
            // this.selectedRole = ...;
            // Load dependent data if needed
            if (this.selectedFarmerId) {
              await this.getFarmsByFarmer();
            }
          }
        } catch (error) {
          this.$notify({ type: 'error', text: 'Failed to load request data' });
        }
      },
      async submitRequest() {
        if (!this.$refs.form.validate()) {
          this.$notify({ type: 'error', text: 'Please fill in all required fields' });
          return;
        }
        if (this.selectedPlot.length === 0) {
          this.$notify({ type: 'error', text: 'Please select at least one plot' });
          return;
        }
        this.isSubmitting = true;
        try {
          const payload = {
            farmer_id: this.selectedFarmerId,
            farm_id: this.selectedFarmId,
            start_date: this.startDate,
            due_date: this.dueDate,
            notes: this.notes,
            plots: this.selectedPlot.map(plot => plot.id)
          };
          let response;
          if (this.isEditMode) {
            // Update existing request
            response = await CarbonCreditService.updatePlotTreeMapping(this.requestId, payload);
          } else {
            // Create new request
            response = await CarbonCreditService.createPlotTreeMapping(payload);
          }
          if (response.success) {
            this.$notify({
              type: 'success',
              text: this.isEditMode
                ? 'Plot tree mapping request updated successfully'
                : 'Plot tree mapping request created successfully'
            });
            this.clearFormData();
            this.$router.push({ name: 'plotTreeMapping' });
          } else {
            this.$notify({
              type: 'error',
              text: response.message || 'Failed to save request'
            });
          }
        } catch (error) {
          this.$notify({
            type: 'error',
            text: error.response?.data?.message || 'An error occurred while saving the request'
          });
        } finally {
          this.isSubmitting = false;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .title {
    font-weight: bold;
  }
  .table-img{
    width: 45px;
    height: 45px;
  }
  .add-request-btn {
    font-weight: bold;
    letter-spacing: 1px;
    border-radius: 6px;
  }
  .status-chip {
    font-weight: 500;
    font-size: 13px;
    text-transform: none;
  }
  .status-chip.success {
    border-color: #00c853;
  }
  .status-chip.error {
    border-color: #ff3d00;
  }
  .status-chip.warning {
    border-color: #ffc107;
  }
  .status-chip.grey {
    border-color: #607d8b;
  }
  </style>
  