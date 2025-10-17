<template>
  <div>
    <v-card elevation="0" class="">
      <v-card-text class="px-0">
        <v-data-table
          :headers="tableHeaders"
          :items="shipments"
          :items-per-page="10"
          class="yellow-table"
          :footer-props="{ 'items-per-page-options': [10, 25, 50] }"
          hide-default-footer
          :loading="loading"
          :options.sync="options"
          :server-items-length="totalShipments"
          :loading-text="$t('deforestation.loading')"
          show-select
          v-model="selectedShipments"
          item-key="id"
        >
          <!-- TOP BAR (filters + buttons + pagination/tools) -->
          <template v-slot:top="{ }">
            <div class="table-controls-container">
              <!-- Filters row -->
              <div class="filters-row">
                <div class="control search">
                  <label for="text">&nbsp;</label>
                  <v-text-field
                    prepend-inner-icon="mdi-magnify"
                    outlined
                    height="5px"
                    :placeholder="$t('search')"
                    type="text"
                    dense
                    v-model="search"
                    @input="searchQuery"
                    class="shrink"
                  />
                </div>

                <div class="control filter" v-if="$can($permissions.assign.value)" style="min-width: 180px;">
                  <label>{{ $t('deforestation.assignTo') }}</label>
                  <v-select
                    v-model="selectedAssignedTo"
                    item-text="name"
                    item-value="value"
                    :items="filteredAssignedToOptions"
                    :label="$t('select')"
                    @change="filterShipments"
                    outlined
                    dense
                    clearable
                    multiple
                    chips
                    no-filter
                  >
                    <template v-slot:prepend-item>
                      <v-list-item @click="toggleAssignedToMe">
                        <v-list-item-action>
                          <v-checkbox v-model="isAssignedToMeSelected" color="primary"></v-checkbox>
                        </v-list-item-action>
                        <v-list-item-content>
                          <v-list-item-title>Assigned to me</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider></v-divider>
                      <v-list-item>
                        <v-list-item-content>
                          <v-text-field
                            v-model="assignedToSearch"
                            :placeholder="$t('search')"
                            prepend-inner-icon="mdi-magnify"
                            dense
                            outlined
                            hide-details
                            class="ma-2"
                            @keydown.stop
                            @click.stop
                          />
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider></v-divider>
                      <v-list-item @click="selectAllAssignedTo">
                        <v-list-item-action>
                          <v-checkbox v-model="allAssignedToSelected" color="primary"></v-checkbox>
                        </v-list-item-action>
                        <v-list-item-content>
                          <v-list-item-title>{{ $t('all') }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                    <template v-slot:selection="{ item, index }">
                      <v-chip v-if="allAssignedToSelected && index === 0" small>
                          {{ $t('all') }}
                      </v-chip>
                      <v-chip v-else-if="!allAssignedToSelected" small>
                        {{ item.name }}
                      </v-chip>
                    </template>
                  </v-select>
                </div>

                <div class="control filter" style="min-width: 180px;">
                  <label>{{ $t('status') }}</label>
                  <v-select
                    v-model="statusFilter"
                    :items="statusOptions"
                    item-text="text"
                    item-value="value"
                    :label="$t('select')"
                    outlined
                    dense
                    clearable
                    @change="filterShipments"
                  />
                </div>

                <v-spacer></v-spacer>
              </div>

              <!-- Buttons + pagination/tools row -->
              <div class="buttons-row pb-4">
                <div class="action-buttons">
                    <v-btn color="primary" v-if="$can($permissions.assign.value)" class="mr-2" @click="handleAssignShipments">{{ $t('dueDiligence.assignReports') }}
                  </v-btn>
                  <v-btn color="primary" v-if="$can($permissions.approve.value)" class="mr-2" @click="handleApproveShipments">{{ $t('dueDiligence.approveReports') }}
                  </v-btn>
                  <v-btn color="error" class="mr-2" @click="handleRejectShipments">{{ $t('dueDiligence.rejectReports') }}
                  </v-btn>

                  <div v-if="selectedShipments.length" class="selection-indicator d-flex align-center ml-2">
                    <span class="selection-text">{{ selectedShipments.length }} {{ $t('dueDiligence.reportsSelected') }}</span>
                    <v-btn icon small class="ml-1" @click="clearSelection">
                      <v-icon small>mdi-close</v-icon>
                    </v-btn>
                  </div>
                </div>

                <div class="pagination-controls">
                  <span class="pagination-label">
                    {{ options.page }} - {{ totalShipmentPages }} {{ $t('of') }} {{ totalShipment }}
                  </span>

                  <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page <= 1" @click="pageChange(false)">
                    <v-icon dark>mdi-chevron-left</v-icon>
                  </v-btn>
                  <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page >= totalShipmentPages" @click="pageChange(true)">
                    <v-icon dark>mdi-chevron-right</v-icon>
                  </v-btn>

                  <!-- Cog -->
                  <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" left :min-width="417">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn class="mx-2" fab small outlined color="primary" v-bind="attrs" v-on="on">
                        <v-icon dark>mdi-cog-outline</v-icon>
                      </v-btn>
                    </template>
                    <v-card width="417">
                      <v-list>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title>{{ $t('deforestation.customization') }}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <div class="pl-3 pt-2 font-weight-normal">
                          {{ $t('deforestation.recordsPerpage') }}
                        </div>
                        <v-list-item>
                          <v-list-item-content>
                            <v-slider
                              v-model="itemsPerPageSlider"
                              :tick-labels="itemsPerPageOptions"
                              :max="3"
                              step="1"
                              ticks="always"
                              tick-size="4"
                            />
                          </v-list-item-content>
                        </v-list-item>
                        <v-divider class="mt-n3"></v-divider>
                      </v-list>
                      <v-card-text>
                        <v-container fluid>
                          <v-row>
                            <v-col class="mt-n9" cols="6" v-for="header in headers" :key="header.value">
                              <v-checkbox
                                v-if="header.text"
                                v-model="selectedHeaders"
                                :label="header.text"
                                color="primary"
                                :value="header.text"
                                hide-details
                                :disabled="header.text == 'ID'"
                              />
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>
                      <v-layout justify-center>
                        <v-card-actions class="mb-5">
                          <v-spacer></v-spacer>
                          <v-btn outlined color="primary" @click="resetDefaut" width="190">
                            {{ $t('deforestation.restoreDefault') }}
                          </v-btn>
                          <v-btn color="primary" @click="resetTableStructure" width="190">
                            {{ $t('deforestation.apply') }}
                          </v-btn>
                        </v-card-actions>
                      </v-layout>
                    </v-card>
                  </v-menu>

                  <!-- Download -->
                  <!-- <v-tooltip top color="black" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn class="mx-2" fab small outlined color="primary" v-bind="attrs" v-on="on" @click="exportToPDF">
                        <v-icon dark>mdi-tray-arrow-down</v-icon>
                      </v-btn>
                    </template>
                    <span>{{ $t('deforestation.download') }}</span>
                  </v-tooltip> -->

                  <!-- Print -->
                  <!-- <v-tooltip top color="black" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn class="mx-2" fab small outlined color="primary" v-bind="attrs" v-on="on" @click="printPDF('document')">
                        <v-icon dark>mdi-printer</v-icon>
                      </v-btn>
                    </template>
                    <span>{{ $t('deforestation.print') }}</span>
                  </v-tooltip> -->
                </div>
              </div>
            </div>
          </template>

          <!-- Row rendering with manual checkbox when body is overridden -->
          <template v-if="shipments.length" v-slot:item="{ item, isSelected, select }">
            <tr style="position: relative; width: 0; height: 0">
              <!-- selection cell (since we override item slot) -->
              <td>
                <v-simple-checkbox :value="isSelected" @input="select($event)" color="primary" />
              </td>

              <td v-if="appliedSelectedHeaders.includes($t('dueDiligence.shipmentID'))">
                SH-{{ item.id }}
              </td>
              <td v-if="appliedSelectedHeaders.includes($t('dueDiligence.noOfReports'))">
                {{ item.reportCount }}
              </td>
              <td v-if="appliedSelectedHeaders.includes($t('dueDiligence.noOfFarms'))">
                {{ item.farmCount }}
              </td>
              <td v-if="appliedSelectedHeaders.includes($t('deforestation.quantity'))">
                {{ item.weight }}
              </td>
              <td v-if="appliedSelectedHeaders.includes($t('deforestation.assignedTo'))">
                <span v-if="item.assignedToUser">
                  {{ item.assignedToUser.firstName }} {{ item.assignedToUser.lastName }}
                </span>
                <span v-else class="text--disabled">-</span>
              </td>
              <td v-if="appliedSelectedHeaders.includes($t('status'))">
                <div class="d-flex align-center">
                    <v-chip v-if="item.status == 'Delivered'" variant="elevated" color="primary" outlined>
                      Delivered
                    </v-chip>
                    <v-chip v-else-if="item.status == 'En Route'" variant="elevated" color="yellow" outlined>
                      En Route
                    </v-chip>
                  
                  <!-- Status Legend Icon -->
                  <div v-if="item.statusLegends" class="ml-2">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <img
                          :src="getStatusLegendIcon(item.statusLegends)"
                          style="width: 20px; height: 20px; cursor: pointer;"
                          v-bind="attrs"
                          v-on="on"
                          :alt="item.statusLegends"
                        />
                      </template>
                      <span>{{ getStatusLegendTooltip(item.statusLegends) }}</span>
                    </v-tooltip>
                  </div>
                </div>
              </td>
              <td
                class="d-flex justify-center align-center"
                v-if="appliedSelectedHeaders.includes($t('deforestation.actions'))"
              >
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn x-small fab v-bind="attrs" v-on="on" @click="viewShipment(item.id)" color="primary" outlined>
                      <v-icon>mdi-eye</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('deforestation.view') }}</span>
                </v-tooltip>
              </td>
            </tr>
          </template>

          <template v-slot:footer></template>
        </v-data-table>

        <!-- Status Legend Section -->
        <div class="status-legend-section mt-6 mb-4 pa-4">
          <div class="legend-title font-weight-bold mr-3">
            {{ $t("deforestation.statusLegend") }}
            <v-tooltip top color="00BD73" max-width="350">
              <template v-slot:activator="{ on, attrs }">
                <v-icon size="16" class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                  mdi-information
                </v-icon>
              </template>
              <span>{{ $t("deforestation.statusLegendInfo") }}</span>
            </v-tooltip>
          </div>
          <div class="legend-item d-inline-flex align-center mr-4 mt-2">
          <template>
            <div class="legend-item d-inline-flex align-center mr-4" v-if="isPtsiApproval">
              <img src="/icons/dds/pending.svg" style="width: 20px; height: 20px; margin-right: 5px;" />
              <span>{{ $t("deforestation.pendingOrNewlyReceived") }} </span>
            </div>
            <div class="legend-item d-inline-flex align-center mr-4" v-else>
              <img src="/icons/dds/sent.svg" style="width: 20px; height: 20px; margin-right: 5px;" />
              <span>{{ $t("deforestation.sentToExporter") }}</span>
            </div>
            <span class="legend-item d-inline-flex align-center mr-4">
              <img src="/icons/dds/overdue.svg" style="width: 20px; height: 20px; margin-right: 5px;" /> {{
                $t("deforestation.overdue") }}
            </span>
          </template>
          <span class="legend-item d-inline-flex align-center mr-4">
            <img src="/icons/dds/updaterequired.svg" style="width: 20px; height: 20px; margin-right: 5px;" /> {{
              $t("deforestation.updateRequired") }}
          </span>
          <span class="legend-item d-inline-flex align-center mr-4">
            <img src="/icons/dds/pendingApproval.svg" style="width: 20px; height: 20px; margin-right: 5px;" /> {{
              $t("deforestation.pendingApproval") }}
          </span>
          <span class="legend-item d-inline-flex align-center mr-4">
            <img src="/icons/dds/ptsiapproved.svg" style="width: 20px; height: 20px; margin-right: 5px;" /> {{
              $t("deforestation.approved") }}
          </span>
          <span class="legend-item d-inline-flex align-center mr-4">
            <img src="/icons/dds/temporaryApproved.svg" style="width: 20px; height: 20px; margin-right: 5px;" /> {{
              $t("deforestation.temporaryApproved") }}
          </span>
          <span class="legend-item d-inline-flex align-center mr-4">
            <img src="/icons/dds/rejected.svg" style="width: 20px; height: 20px; margin-right: 5px;" /> {{
              $t("deforestation.rejected") }}
          </span>
        </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Modals -->
    <AssignShipmentModal
      :dialog="showAssignModal"
      :selectedReportsCount="selectedShipments.length"
      :userOptions="assignedToOptions"
      @close="closeAssignModal"
      @confirm="confirmAssignment"
    />

    <ApproveShipmentModal
      :dialog="showApproveModal"
      :selectedReportsCount="selectedShipments.length"
      :selectedShipmentIds="selectedShipments.map(s => parseInt(s.id, 10))"
      @close="closeApproveModal"
      @error="handleApprovalError"
      @confirmApproval="handleApprovalSuccess"
    />

    <RejectShipmentModal
      :dialog="showRejectModal"
      :selectedReportsCount="selectedShipments.length"
      @close="closeRejectModal"
      @confirm="confirmRejection"
    />
    <ProcessingModal :dialog="showPocessingModal" @close="showPocessingModal = false" />
  </div>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";
import UserListService from "@/_services/UserListService";
import download from "@/mixins/DownloadMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import DateMixin from '@/mixins/DateMixin';
import DeforestationService from "@/_services/DeforestationService";
import html2pdf from "html2pdf.js";
import printJS from "print-js";
import AssignShipmentModal from "./modals/AssignShipmentModal.vue";
import ApproveShipmentModal from "./modals/ApproveShipmentModal.vue";
import RejectShipmentModal from "./modals/RejectShipmentModal.vue";
import { isPtsiApproval, currentRoles, wait } from "@/utils";
import ProcessingModal from "./modals/ProcessingModal.vue";
export default {
  components: {
    AssignShipmentModal,
    ApproveShipmentModal,
    RejectShipmentModal,
    ProcessingModal
  },
  props: {
    heroSearchData: {
      type: Object,
      default: () => ({})
    },
    cooperativeId: {
      type: [String, Number],
      default: null
    }
  },
  created() {
    this.tableHeaders = this.headers;
    this.selectedHeaders = this.allSelectedHeaders;
    this.appliedSelectedHeaders = this.allSelectedHeaders;
    this.fetchData();
  },
  computed: {
    isPtsiApproval() {
      return isPtsiApproval();
    },
    isWorkerOnly(){
       const roles = currentRoles()
       if(roles?.length == 1 && roles.includes('indonesia_ptsi_worker')) {
        return true
       }
       return false
    },
    totalPages() {
      return 1
    },
    getCurrentUser() {
      return this.$store.getters.getUser
    },
    filteredAssignedToOptions() {
      if (!this.assignedToSearch) {
        return this.assignedToOptions;
      }
      return this.assignedToOptions.filter(option =>
        option.name.toLowerCase().includes(this.assignedToSearch.toLowerCase())
      );
    },
  },
  watch: {
    options: {
      async handler() {
        await this.fetchData();
      },
      deep: true,
    },
    heroSearchData: {
      handler(newData) {
        if (newData.isShipmentId) {
          // extract sh- from the value  convert lowercase  and trim
          newData.value = newData.value.toLowerCase().trim();
          newData.value = newData.value.replace('sh-', '');
          this.handleHeroSearch(newData);
        }
      },
      immediate: true
    },
    cooperativeId: {
      handler(newCooperativeId) {
        // Only fetch data if cooperativeId is valid and not null/undefined
        if (newCooperativeId && newCooperativeId !== null && newCooperativeId !== undefined) {
          this.fetchData();
        }
      },
      immediate: false
    }
  },
  data() {
    return {
      shipments: [],
      selectedShipments: [],
      showPocessingModal:false,
      // filters
      statusFilter: null,
      selectedAssignedTo: [],
      assignedToOptions: [],
      assignedToSearch: '',
      allAssignedToSelected: false,
      isAssignedToMeSelected: false,
      // Modal states
      showAssignModal: false,
      showApproveModal: false,
      showRejectModal: false,
      statusOptions: [
        { text: 'En Route', value: 'En Route' },
        { text: 'Delivered', value: 'Delivered' }
      ],

      debounceTimer: null,
      totalShipmentPages: null,
      totalShipment: null,
      loading: false,
      totalShipments: 2,
      tab: 0,
      selectedItem: false,
      options: {
        itemsPerPage: 25,
        page: 1
      },
      search: "",
      validSearch: "",
      from: 0,
      document: "",
      to: 0,
      headers: [
        { text: this.$t('dueDiligence.shipmentID'), align: "start", value: "shipmentID", class: "black--text", sortable: true },
        { text: this.$t('dueDiligence.noOfReports'), align: "start", value: "noOfReport", class: "black--text", sortable: false },
        { text: this.$t('dueDiligence.noOfFarms'), align: "start", value: "noOfFarms", class: "black--text", sortable: false },
        { text: this.$t("deforestation.quantity"), align: "start", value: "quanitity", class: "black--text", sortable: false },
        { text: this.$t('deforestation.assignedTo'), align: "start", value: "assignedTo", class: "black--text", sortable: false },
        { text: this.$t('status'), align: "start", value: "status", class: "black--text", sortable: false },
        { text: this.$t('deforestation.actions'), align: "center", value: "actions", class: "black--text", sortable: false },
      ],
      breadcrumbs: [
        { text: this.$t("dashboard"), disabled: false, exact: true },
        { text: this.$t("deforestation.shipmentList"), disabled: true, href: "breadcrumbs_link_1" },
      ],
      customizeMenu: false,
      customizeMenuAll: false,
      itemsPerPageOptions: [5, 10, 25, 50],
      itemsPerPageSlider: 2,
      selectedHeaders: [],
      appliedSelectedHeaders: [],
      tableHeaders: [],
      allSelectedHeaders: [
        this.$t('dueDiligence.shipmentID'),
        this.$t('dueDiligence.noOfReports'),
        this.$t('dueDiligence.noOfFarms'),
        this.$t("deforestation.quantity"),
        this.$t('deforestation.assignedTo'),
        this.$t("status"),
        this.$t('deforestation.actions')
      ],
      menu: false,
      shipmentsOrder: 'DESC'
    };
  },
  methods: {
    // top-bar actions
    clearSelection() {
      this.selectedShipments = [];
    },
    handleAssignShipments() {
      if (!this.selectedShipments.length) {
        this.$notify?.({ text: 'Please select reports to assign', type: 'warning' });
        return;
      }
      this.showAssignModal = true;
    },
    handleApproveShipments() {
      if (!this.selectedShipments.length) {
        this.$notify?.({ text: 'Please select reports to approve', type: 'warning' });
        return;
      }
      this.showApproveModal = true;
    },
    handleRejectShipments() {
      if (!this.selectedShipments.length) {
        this.$notify?.({ text: 'Please select reports to reject', type: 'warning' });
        return;
      }
      this.showRejectModal = true;
    },
    filterShipments() {
      this.options.page = 1;
      this.fetchData();
    },
    toggleAssignedToMe() {
      this.isAssignedToMeSelected = !this.isAssignedToMeSelected;
      if (this.isAssignedToMeSelected) {
        // Add current user to selected assigned to if not already present
        const currentUserId = this.getCurrentUser?.id;
        if (currentUserId && !this.selectedAssignedTo.includes(currentUserId)) {
          this.selectedAssignedTo.push(currentUserId);
        }
      } else {
        // Remove current user from selected assigned to
        const currentUserId = this.getCurrentUser?.id;
        this.selectedAssignedTo = this.selectedAssignedTo.filter(id => id !== currentUserId);
      }
      this.filterShipments();
    },
    selectAllAssignedTo() {
      this.allAssignedToSelected = !this.allAssignedToSelected;
      if (this.allAssignedToSelected) {
        this.selectedAssignedTo = this.assignedToOptions.map(option => option.value);
        const currentUserId = this.getCurrentUser?.id;
        if (currentUserId && !this.selectedAssignedTo.includes(currentUserId)) {
          this.selectedAssignedTo.push(currentUserId);
        }
        this.isAssignedToMeSelected = true;
      } else {
        this.selectedAssignedTo = [];
        this.isAssignedToMeSelected = false;
      }
      this.filterShipments();
     },
     // Modal management methods
     closeAssignModal() {
       this.showAssignModal = false;
     },
     closeApproveModal() {
       this.showApproveModal = false;
     },
     closeRejectModal() {
       this.showRejectModal = false;
     },
     async confirmAssignment(assignmentData) {
       try {
         this.loading = true;
         
         const input = {
          shipmentIds: this.selectedShipments.map(s => parseInt(s.id, 10)),
          assignedTo: parseInt(assignmentData.selectedUserId, 10),
        };
        
        const response = await DeforestationService.bulkAssignShipments(input);
        
        if (response && response.data && response.data.bulkAssignShipments) {
          if (response.data.bulkAssignShipments.success) {
            this.$notify({
              text: response.data.bulkAssignShipments.message || `Successfully assigned ${response.data.bulkAssignShipments.processedCount} shipment(s)`,
              type: 'success'
            });
            
            if (response.data.bulkAssignShipments.failedReportIds && response.data.bulkAssignShipments.failedReportIds.length > 0) {
              this.$notify({
                text: `Failed to assign ${response.data.bulkAssignShipments.failedReportIds.length} shipments`,
                type: 'warning'
              });
            }
          } else {
            this.$notify({
              text: response.data.bulkAssignShipments.message || 'Failed to assign shipments',
              type: 'error'
            });
          }
         }
         
         this.closeAssignModal();
         this.selectedShipments = [];
         await this.fetchData();
       } catch (error) {
         console.error('Assignment failed:', error);
         this.$notify({
           text: 'An error occurred while assigning shipments',
           type: 'error'
         });
       } finally {
         this.loading = false;
       }
     },
     async handleApprovalSuccess(data) {
      const { isTemporaryApproval, approvalExpirationValue, approvalExpirationUnit } = data;
       this.loading = true;
        try {
        const input = {
          shipmentIds: this.selectedShipments.map(s => parseInt(s.id, 10)),
          isTemporaryApproval:isTemporaryApproval ,
          approvalExpirationValue: isTemporaryApproval ? parseInt(approvalExpirationValue) || 0 : null,
          approvalExpirationUnit: isTemporaryApproval ? approvalExpirationUnit : null
        };
        console.log('Approval Input:', input);
        // Add expiration fields only if it's a temporary approval
        const response = await DeforestationService.bulkApproveShipments(input);
        const responseData = response?.data.bulkApproveShipments
        console.log('Bulk approve response:', responseData);

        if(responseData?.jobs?.length){
          this.$notify({
            text: 'The approval has been successfully completed. Writing to blockchain may take a few minutes.',
            type: 'info'
          });
          await this.fetchData();
          this.loading = false;
        }

        let job = responseData.jobs;
        let stopWaiting = false;
        this.showPocessingModal = true;

        const timeout = setTimeout(() => {
          stopWaiting = true;
          this.showPocessingModal = false;
          this.$notify({
            text: 'Writing deforestation data to blockchain is taking longer than expected. You can continue working and check the status later in the Job History section.',
            type: 'warning'
          });
        }, 100000); // 80 seconds

        while (!stopWaiting && this.showPocessingModal) {
          await wait(8000);
          const jobIDS = job.map(j => parseInt(j.id)); 
          const response = await DeforestationService.getJobs(jobIDS);

          if (!response?.data?.getJobs?.length) {
            this.$notify({
              text: 'Failed to write deforestation data to blockchain, please try again.',
              type: 'error'
            });
          }

          const allCompleted = response.data.getJobs.every(j => j.status === 'Completed' || j.status === 'Failed');
          if (allCompleted) {
            clearTimeout(timeout);
            await wait(1500);
            this.showPocessingModal = false;
            await this.fetchData();
            this.$notify({
              text: 'Report Successfully Approved & Written to Blockchain',
              type: 'success'
            });
            break;
          }
          // if modal was closed manually during wait, stop the loop
          if (!this.showPocessingModal) break;
        }
        clearTimeout(timeout);
      } catch (error) {
        console.error('Error approving reports:', error);
        this.$notify({
          text: 'An error occurred while approving reports',
          type: 'error'
        });
      } finally {
        this.loading = false;
        // Close modal and clear selection
        this.showApprovalModal = false;
        this.selectedReports = [];
      }
     },
     handleApprovalError(errorMessage) {
       this.$notify({
         text: errorMessage || 'An error occurred while approving shipments',
         type: 'error'
       });
       this.closeApproveModal();
     },
     async confirmRejection(rejectionData) {
       try {
         this.loading = true;
         const input = {
          shipmentIds: this.selectedShipments.map(s => parseInt(s.id, 10)),
          reason: rejectionData.reason || ''
        };
        
        const response = await DeforestationService.bulkRejectShipments(input);
        
        if (response && response.data && response.data.bulkRejectShipments) {
          if (response.data.bulkRejectShipments.success) {
            this.$notify({
              text: response.data.bulkRejectShipments.message || `Successfully rejected ${response.data.bulkRejectShipments.processedCount} shipment(s)`,
              type: 'success'
            });
            
            if (response.data.bulkRejectShipments.failedReportIds && response.data.bulkRejectShipments.failedReportIds.length > 0) {
              this.$notify({
                text: `Failed to reject ${response.data.bulkRejectShipments.failedReportIds.length} shipments`,
                type: 'warning'
              });
            }
          } else {
            this.$notify({
              text: response.data.bulkRejectShipments.message || 'Failed to reject shipments',
              type: 'error'
            });
          }
         }
         
         this.closeRejectModal();
         this.selectedShipments = [];
         await this.fetchData();
       } catch (error) {
         console.error('Rejection failed:', error);
         this.$notify({
           text: 'An error occurred while rejecting shipments',
           type: 'error'
         });
       } finally {
         this.loading = false;
       }
     },
 
     async exportToPDF() {
      const params = {
        page: this.options.page,
        search: this.search,
        limit: this.options.itemsPerPage,
        assignedTo: this.selectedAssignedTo.length ? this.selectedAssignedTo.join(',') : '',
        status: this.statusFilter || ''
      }
      const querys = new URLSearchParams(params).toString();
      const token = this.$store.state.auth.token
      this.startLoading()
      const url = process.env.VUE_APP_DEFORESTRATION_API_BASE_URL || "http://localhost:4043/api"
      this.downloadSourceFileWithToken(`${url}/shipment/shipment-pdf?${querys}`, "application/pdf", token, "shipments.pdf")
        .then(() => this.stopLoading())
        .catch(() => this.stopLoading())
    },
    async printPDF() {
      const element = document.querySelector(".v-data-table__wrapper");
      let opt = {
        margin: 1,
        filename: "Shipments.pdf",
        image: { type: "jpeg", quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
      };
      let worker = await html2pdf().set(opt).from(element).toCanvas().outputPdf("blob", "Shipments.pdf");
      let file = new File([worker], "Shipments.pdf", { type: "application/pdf" });
      var pdfUrl = await URL.createObjectURL(file);
      await printJS({ printable: `${pdfUrl}`, type: "pdf", showModal: true });
    },
    async resetDefaut() {
      this.tableHeaders = this.headers;
      this.selectedHeaders = this.allSelectedHeaders;
      this.appliedSelectedHeaders = this.allSelectedHeaders;
      this.itemsPerPageSlider = 1;
      this.options.itemsPerPage = 10;
      this.menu = false;
      await this.fetchData()
    },
    async resetTableStructure() {
      this.menu = false;
      this.tableHeaders = this.headers.filter((header) => this.selectedHeaders.includes(header.text));
      this.appliedSelectedHeaders = this.selectedHeaders
      this.options.itemsPerPage = this.itemsPerPageOptions[this.itemsPerPageSlider];
      await this.fetchData();
      (this.customizeMenu = false), (this.customizeMenuAll = false);
    },
    viewShipment(id) {
      if(this.isPtsiApproval) {
        this.$router.push({ name: 'approvalShipmentDetails', params: { id: id } })
      } else {
        this.$router.push({ name:'approvalShipmentDetails', params:{id:id} })
      }
    },
    createNewShipment() {
      this.$router.push({ name: "shipmentCreate" })
    },
    selectItem(item) {
      this.selectedItem = item;
    },
    searchQuery() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        const extractedNumber = this.search.match(/\d+/g)?.[0];
        this.validSearch = extractedNumber;
        this.options.page = 1;
        this.fetchData();
      }, 500);
    },
    resetSearchOnEmpty() {
      this.search = ''
      this.selectedAssignedTo = []
      this.statusFilter = null
      this.allAssignedToSelected = false
      this.isAssignedToMeSelected = false
      this.assignedToSearch = ''
      this.options = { page: 1, limit: 10 }
    },
    pageChange(t) {
      if (t) this.options.page = this.options.page + 1;
      else this.options.page = this.options.page - 1;
    },
    handleHeroSearch(searchData) {
      console.log('Shipments handleHeroSearch called with:', searchData);
      this.search = searchData.value;
      // For shipment search, we want to use the value directly since it's already extracted as shipmentId
      this.validSearch = searchData.value;
      this.options.page = 1;
      this.fetchData();
    },
    async fetchData() {
      const params = {
        page: this.options.page,
        search: this.validSearch,
        limit: this.options.itemsPerPage,
        cfroles:currentRoles(),
        cooperativeId: this.cooperativeId
      }
      console.log('Shipments fetchData called with params:', params);
      // sorting
      if (this.options) {
        params.orderField = this.options.sortBy?.length ? this.options.sortBy[0] : "shipmentID";
        this.shipmentsOrder = this.shipmentsOrder === 'ASC' ? 'DESC' : 'ASC';
        params.order = this.shipmentsOrder;
      }
      // filters
      if (this.selectedAssignedTo.length) {
        if (this.selectedAssignedTo.length === 1) {
          params.assignedTo = this.selectedAssignedTo[0];
        } else {
          params.assignedToIds = this.selectedAssignedTo;
        }
      }
      if (this.statusFilter) params.status = this.statusFilter;

      this.loading = true
      const res = await DeforestationService.getShipments(params);
      this.shipments = await this.sanitizeShipmentResult(res.data.getShipmentList.rows)
      this.totalShipment = res.data.getShipmentList.count;
      this.totalShipmentPages = Math.ceil(this.totalShipment / this.options.itemsPerPage);
      this.loading = false;
    },
    async sanitizeShipmentResult(payload) {
      return payload.map(item => {
        return {
          id: item.id,
          status: item.status,
          statusLegends: item.statusLegends || null,
          assignedTo: item.assignedTo || null,
          assignedToUser: item.assignedToUser || null,
          farmCount: item.shipmentReports.reduce((shipmentTotal, report) => {
            if (report.dueDeligenceReport && report.dueDeligenceReport.dueDiligenceProductionPlaces) {
              const count = report.dueDeligenceReport.dueDiligenceProductionPlaces.reduce(
                (placeAcc, place) => place.removed === false ? placeAcc + 1 : placeAcc, 0);
              return shipmentTotal + count;
            }
            return shipmentTotal;
          }, 0),
          reportCount: (item.shipmentReports).length,
          weight: item.shipmentReports.reduce((a, b) => {
            return a + parseFloat(b.dueDeligenceReport?.productNetMass || 0)
          }, 0)
        }
      })
    },
    async fetchAssignedToList() {
      try {
        const response = await UserListService.getAssignedToList();
        const data = response?.data?.rows || [];
        if (data && Array.isArray(data)) {
          this.assignedToOptions = data.map(user => ({
            name: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            value: user.id,
            cf_userid: user.cf_userid,
            user: user // Store full user object for access to cf_userid
          }));
        }
      } catch (error) {
        console.error('Error fetching assigned to list:', error);
        this.$notify({
          text: 'Failed to fetch assigned users list',
          type: 'error'
        });
      }
    },
    getStatusLegendIcon(statusLegend) {
      const iconMap = {
        'pending': '/icons/dds/pending.svg',
        'overdue': '/icons/dds/overdue.svg',
        'update_required': '/icons/dds/updaterequired.svg',
        'pending_approval': '/icons/dds/pendingApproval.svg',
        'approved': '/icons/dds/ptsiapproved.svg',
        'temporary_approved': '/icons/dds/temporaryApproved.svg',
        'rejected': '/icons/dds/rejected.svg'
      };

      return iconMap[statusLegend] || iconMap[statusLegend?.toLowerCase()] || '/icons/dds/pending.svg';
    },
    getStatusLegendTooltip(statusLegend) {
      const tooltipMap = {
        'pending': this.$t("deforestation.pendingOrNewlyReceived"),
        'overdue': this.$t("deforestation.overdue"),
        'update_required': this.$t("deforestation.updateRequired"),
        'pending_approval': this.$t("deforestation.pendingApproval"),
        'approved': this.$t("deforestation.approved"),
        'temporary_approved': this.$t("deforestation.temporaryApproved"),
        'rejected': this.$t("deforestation.rejected")
      };

      return tooltipMap[statusLegend] || tooltipMap[statusLegend?.toLowerCase()] || this.$t("deforestation.pendingOrNewlyReceived");
    }
  },
  async mounted() {
    await this.fetchAssignedToList();
  },
  mixins: [loadingMixin, download, getPermittedActions, DateMixin],
};
</script>

<style lang="scss" scoped>
::v-deep .wdt.v-text-field { width: 250px; }
::v-deep .v-tab:hover { background-color: #caf1e2; color: $primary_color !important; }
::v-deep .v-data-table-header span { text-transform: uppercase !important; color: black; }
::v-deep .center-content { display: flex; justify-content: center; align-items: center; }
::v-deep .img-center { display: block; margin-left: auto; margin-right: auto; width: 40%; }

.table-controls-container { display: flex; flex-direction: column; margin-top: 16px; }
.filters-row { display: flex; align-items: flex-end; gap: 12px; flex-wrap: wrap; width: 100%; }
.buttons-row { display: flex; justify-content: space-between; align-items: center; width: 100%; flex-wrap: wrap; margin-top: 10px; }
.action-buttons { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.pagination-controls { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.control { display: flex; flex-direction: column; justify-content: flex-end; }
.control.search { min-width: 200px; max-width: 300px; flex: 1 1 200px; }
.pagination-label { font-size: 14px; white-space: nowrap; }

.status-legend-inline { font-size: 14px; flex-wrap: wrap; }
.legend-label { color: #222; }
.legend-item { white-space: nowrap; font-size: 14px; }
.status-legend-section { background: #f8f9fa; border-radius: 10px; flex-wrap: wrap; font-size: 15px; }
.legend-title { color: #222; }

/* Responsive */
@media (max-width: 1400px) {
  .buttons-row { flex-direction: column; align-items: stretch; gap: 12px; }
  .action-buttons { width: 100%; justify-content: flex-start; }
  .pagination-controls { width: 100%; justify-content: flex-end; }
}
@media (max-width: 768px) {
  .filters-row { flex-direction: column; align-items: stretch; }
  .control { max-width: none; width: 100%; }
  .buttons-row { flex-direction: column; align-items: stretch; }
  .action-buttons, .pagination-controls { justify-content: center; }
}
</style>
