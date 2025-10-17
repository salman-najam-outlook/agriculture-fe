<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <!-- Header Section -->
      <div class="d-flex mb-4 align-center">
        <h2>{{ buyingStationName }}</h2>
        <v-spacer></v-spacer>
        <div class="d-flex align-center">
          <v-btn color="primary" dark class="mr-2 mb-2" @click="handleAddFarm">
            {{ $t("memberDataSection.addFarm") }}
          </v-btn>
          <v-btn color="primary" dark class="mr-2 mb-2" @click="handleBack">
            {{ $t("memberDataSection.back") }}
          </v-btn>
        </div>
      </div>

      <v-card elevation="0" class="px-5">
        <v-card-title class="text-h6" style="margin-left:-20px;">
          {{ $t("memberDataSection.associatedFarms") }}
        </v-card-title>
        <v-card-text>
          <v-row style="margin-left:-35px; margin-bottom: 20px;">
            <v-col cols="12">
                <v-data-table 
                  :headers="tableHeaders" 
                  :items="associatedFarms" 
                  :items-per-page="10" 
                  :footer-props="{
                    'items-per-page-options': [5, 10, 25, 50],
                  }" 
                  item-key="id" 
                  hide-default-footer 
                  :loading="loading" 
                  :options.sync="options"
                  :server-items-length="totalAssociatedFarms" 
                  :loading-text="$t('loadingData')" 
                  class="elevation-1"
                  single-expand
                  show-expand
                >
                <template v-slot:top="{}">
                  <div class="d-flex align-center">

                    <div class="ml-3 mt-6" style="width: 220px;">
                      <v-text-field style="width: 280px;" prepend-inner-icon="mdi-magnify" outlined height="5px"
                        :placeholder="$t('memberDataSection.search')" dense v-model="search" @input="searchQuery"
                        class="shrink">
                      </v-text-field>
                    </div>

                    <div class="ml-3" style="width: 250px;">
                      <label for="text">{{ $t("memberDataSection.eudrDeforestationStatus") }}</label>
                      <v-tooltip top color="00BD73" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                            mdi-alert-circle
                          </v-icon>
                        </template>
                        <span>{{ $t("memberDataSection.eudrDeforestationStatusTT") }}</span>
                      </v-tooltip>
                      <v-autocomplete clearable style="width: 250px;" v-model="deforestationStatusModel" item-text="text" item-value="val"
                        :items="deforestationStatuses" :placeholder="$t('select')" @change="filterData"
                        outlined dense>
                      </v-autocomplete>
                    </div>

                    <v-spacer></v-spacer>
                    <div class="d-flex align-center mb-3">
                      <div class="py-1 title">
                        {{ fromAssociatedFarmsList }} -
                        {{ toAssociatedFarmsList }} {{ $t('of') }}
                        {{ totalAssociatedFarms }}
                      </div>
                      <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page <= 1"
                        @click="reportPageChange(false)">
                        <v-icon dark>
                          mdi-chevron-left
                        </v-icon>
                      </v-btn>
                      <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page >= totalPages"
                        @click="reportPageChange(true)">
                        <v-icon dark>
                          mdi-chevron-right
                        </v-icon>
                      </v-btn>
                      <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" left :min-width="417">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn class="mx-2" fab small outlined color="primary" v-bind="attrs" v-on="on">
                            <v-icon dark>mdi-cog-outline </v-icon>
                          </v-btn>
                        </template>
                        <v-card width="417">
                          <v-list>
                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-title>{{ $t("deforestation.customization") }}</v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                            <v-divider></v-divider>
                            <div class="pl-3 pt-2 font-weight-normal">
                              {{ $t("deforestation.recordsPerpage") }}
                            </div>
                            <v-list-item>
                              <v-list-item-content>
                                <v-slider v-model="itemsPerPageSlider" :tick-labels="itemsPerPageOptions" :max="3"
                                  step="1" ticks="always" tick-size="4"></v-slider>
                              </v-list-item-content>
                            </v-list-item>
                            <v-divider class="mt-n3"></v-divider>
                          </v-list>
                          <v-card-text>
                            <v-container fluid>
                              <v-row>
                                <v-col class="mt-n9" cols="6" v-for="header in headers" :key="header.value">
                                  <v-checkbox v-if="header.text" v-model="selectedHeaders" :label="header.text"
                                    color="primary" :value="header.text" hide-details
                                    :disabled="header.text == 'ID'"></v-checkbox>
                                </v-col>
                              </v-row>
                            </v-container>
                          </v-card-text>
                          <v-layout justify-center>
                            <v-card-actions class="mb-5">
                              <v-spacer></v-spacer>
                              <v-btn outlined color="primary" @click="resetDefault" width="190">
                                <span class="text-truncate" style="max-width:150px">{{ $t("deforestation.restoreDefault") }}</span>
                              </v-btn>
                              <v-btn color="primary" @click="resetTableStructure" width="190">
                                {{ $t("deforestation.apply") }}
                              </v-btn>
                            </v-card-actions>
                          </v-layout>
                        </v-card>
                      </v-menu>

                      <v-tooltip top color="black" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn class="mx-2" fab small outlined color="primary" v-bind="attrs" v-on="on"
                            @click="exportToPDF">
                            <v-icon dark> mdi-download </v-icon>
                          </v-btn>
                        </template>
                        <span>{{ $t("deforestation.download") }}</span>
                      </v-tooltip>
                      <v-tooltip top color="black" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn class="mx-2" fab small outlined color="primary" v-bind="attrs" v-on="on"
                            @click="printPDF('document')">
                            <v-icon dark> mdi-printer </v-icon>
                          </v-btn>
                        </template>
                        <span>{{ $t("deforestation.print") }}</span>
                      </v-tooltip>
                    </div>
                  </div>
                </template>
                <template v-slot:item.farmNameAndId="{ item }">
                  {{ item.farmName }}<br />
                  {{ item.id }}
                </template>
                
                <template v-slot:item.addressOfProduction="{ item }">
                  {{ item.addressLine1 }}<br />
                  {{ item.addressLine2 }}
                </template>
                
                <template v-slot:item.area="{ item }">
                  {{ item.area }}
                </template>
                
                <template v-slot:item.type="{ item }">
                  {{ item.type }}
                </template>
                
                <template v-slot:item.status="{ item }">
                  <v-btn small rounded min-width="100" depressed class="green-button" height="32"
                      v-if="item.status === 'compliant'">
                      {{ $t("memberDataSection.compliant") }}
                  </v-btn>
                  <v-btn small rounded min-width="100" depressed class="red-button" height="32"
                      v-else-if="item.status === 'non-compliant'">
                      {{ $t("memberDataSection.nonCompliant") }}
                  </v-btn>
                  <v-btn small rounded min-width="100" depressed class="gray-button" height="32"
                      v-else>
                      {{ $t("memberDataSection.pending") }}
                  </v-btn>
                </template>
                
                <template v-slot:item.actions="{ item }">
                  <v-menu location="start">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon v-bind="attrs" v-on="on" @click.stop small>
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item @click="editFarm(item.id)">
                        <v-list-item-title>{{ $t('memberDataSection.edit') }}</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="deleteFarm(item.id)">
                        <v-list-item-title class="red--text">{{ $t('memberDataSection.delete') }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </template>
                
                <template v-slot:item.data-table-expand="{ item, expand, isExpanded }">
                  <v-btn icon @click="expand(!isExpanded)" small>
                    <v-icon>{{ isExpanded ? 'mdi-chevron-down' : 'mdi-chevron-right' }}</v-icon>
                  </v-btn>
                </template>

                <template v-slot:expanded-item="{ item, headers }">
                  <td :colspan="headers.length" class="pa-0">
                    <div class="expanded-content">
                      <!-- Top horizontal line -->
                      <div class="horizontal-line"></div>
                      
                      <!-- Two-column layout -->
                      <div class="two-column-layout">
                        <!-- Left Column - EUDR Deforestation Status -->
                        <div class="column-left">
                          <div class="section-header">
                            <h4 class="section-title">{{ $t("memberDataSection.eudrDeforestationStatus") }}</h4>
                          </div>
                          <div class="section-body">
                            <div class="button-with-icon">
                              <v-btn 
                                rounded 
                                depressed 
                                :class="getEudrStatusButtonClass(item.eudrStatus)" 
                                min-width="200" 
                                height="32"
                              >
                                {{ getEudrStatusText(item.eudrStatus) }}
                              </v-btn>
                              <v-tooltip top color="00BD73" max-width="350">
                                <template v-slot:activator="{ on, attrs }">
                                  <img v-bind="attrs" v-on="on" class="ml-2" src="/icons/todo-list.png"
                                    style="width: 34px; height: 34px; border-radius: 50%; cursor: pointer;" 
                                    @click="viewEudrReport(item)" />
                                </template>
                                <span>{{ $t('dueDiligence.viewReport') }}</span>
                              </v-tooltip>
                            </div>
                            <div v-if="item.deforestationData" class="assessment-details">
                              <div class="detail-item">
                                <span class="detail-label">{{ $t("memberDataSection.overallProbability") }}:</span>
                                <span class="detail-value">{{ formatProbability(item.deforestationData.overallProb) }}%</span>
                              </div>
                              <div v-if="item.deforestationData.deforestationArea" class="detail-item">
                                <span class="detail-label">{{ $t("memberDataSection.deforestationArea") }}:</span>
                                <span class="detail-value">{{ item.deforestationData.deforestationArea }} ha</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <!-- Vertical divider -->
                        <div class="vertical-line"></div>
                        
                        <!-- Right Column - Assessments -->
                        <div class="column-right">
                          <div class="section-header">
                            <h4 class="section-title">{{ $t("memberDataSection.assessments") }}</h4>
                          </div>
                          <div class="section-body">
                            <div class="assessment-item">
                              <div class="assessment-label font-weight-bold">
                                {{ $t("memberDataSection.riskAssessment") }}
                              </div>
                              <div class="assessment-value">
                                <div class="button-with-icon">
                                  <v-btn 
                                    rounded 
                                    depressed 
                                    :class="getRiskAssessmentButtonClass(item.riskAssessmentStatus)" 
                                    min-width="150" 
                                    height="32"
                                  >
                                    {{ getRiskAssessmentText(item.riskAssessmentStatus) }}
                                  </v-btn>
                                  <v-tooltip top color="00BD73" max-width="350">
                                    <template v-slot:activator="{ on, attrs }">
                                      <img v-bind="attrs" v-on="on" class="ml-2" src="/icons/todo-list.png"
                                        style="width: 34px; height: 34px; border-radius: 50%; cursor: pointer;" 
                                        @click="viewRiskAssessmentReport(item)" />
                                    </template>
                                    <span>{{ $t('dueDiligence.viewReport') }}</span>
                                  </v-tooltip>
                                </div>
                              </div>
                            </div>
                            <div class="assessment-item">
                              <div class="assessment-label">
                                {{ $t("memberDataSection.dateOfSubmission") }}
                              </div>
                              <div class="assessment-value">
                                {{ item.deforestationData ? formatDate(item.deforestationData.createdAt) : 'N/A' }}
                              </div>
                            </div>
                            <div class="assessment-item">
                              <div class="assessment-label">
                                {{ $t("memberDataSection.dateOfExpiry") }}
                              </div>
                              <div class="assessment-value">
                                {{ item.deforestationData ? formatDate(item.deforestationData.updatedAt) : 'N/A' }}
                              </div>
                            </div>
                            <div v-if="item.deforestationData && item.deforestationData.metrics" class="assessment-item">
                              <div class="assessment-label">
                                {{ $t("memberDataSection.assessmentMetrics") }}
                              </div>
                              <div class="assessment-value">
                                <div v-for="metric in item.deforestationData.metrics.slice(0, 3)" :key="metric.label" class="metric-item">
                                  <span class="metric-label">{{ metric.label }}:</span>
                                  <span class="metric-value">{{ formatProbability(metric.percent) }}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </template>
                
                <template v-slot:footer></template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

    </v-container>

    <!-- Confirm Delete Dialog -->
    <confirm-box 
      :title="confirmElements.title"
      :message="confirmElements.message"
      :cancelBtnText="confirmElements.cancelBtnText" 
      :confirmBtnText="confirmElements.confirmBtnText"
      :confirmData="confirmElements.confirmData" 
      :dialog="confirm" 
      @cancel:action="confirmCancel" 
      @continue:action="confirmDelete"
    />
  </div>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";
import download from "@/mixins/DownloadMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import DateMixin from "@/mixins/DateMixin";
import html2pdf from "html2pdf.js";
import printJS from "print-js";
import moment from 'moment';
import RoleMixin from "@/mixins/RoleMixin";
import { isKenyaClient, isIndonesianClient } from "@/utils";
import BuyingStationService from "@/_services/BuyingStationService";
import FarmService from "@/_services/FarmService";
import DeforestationService from "@/_services/DeforestationService";
import ConfirmBox from "@/components/ConfirmBox";

export default {
  created() {
    // Set initial buying station name from route params if available, otherwise will be fetched from API
    this.buyingStationName = this.$route.params.buyingStationName || (this.isNaccuUser ? 'Affiliate' : 'Buying Station');
    this.getAssociatedFarms();
  },
  async mounted() {
    this.tableHeaders = this.headers;
    this.selectedHeaders = this.allSelectedHeaders;
  },
  watch: {
    options: {
      handler(opt) {
        // Only call getAssociatedFarms if this is not the initial load
        if (this.initialLoadComplete) {
          this.getAssociatedFarms(opt);
        }
      },
      deep: true,
    },
  },
  computed: {
    isNaccuUser() {
      return isKenyaClient();
    },
    isIndonesianUser() {
      return isIndonesianClient();
    },
    isOwner() {
      return this.getCurrentRoles.some(x => ["operator_owner", "supplier_owner"].includes(x))
    },
    getOrganizationId() {
      return this.$store.getters.getUser?.user_organization?.id;
    },
    reportHeaders() {
      return this.headers.filter(header => this.selectedHeaders.includes(header.text));
    },
    totalPages() {
      return parseInt(Math.ceil(this.totalAssociatedFarms / 10))
    },
    breadcrumbs() {
      return [
        {
          text: this.$t("dashboard"),
          disabled: false,
          to: "/",
        },
        {
          text: this.isNaccuUser ? this.$t("memberDataSection.affiliates") : this.$t("memberDataSection.buyingStation"),
          disabled: false,
          to: "/coffee/buying-station",
        },
        {
          text: this.$t("memberDataSection.associatedFarms"),
          disabled: true,
          href: "breadcrumbs_link_2",
        },
      ];
    },
  },
  data() {
    return {
      debounceTimer: null,
      fromAssociatedFarmsList: 0,
      toAssociatedFarmsList: 0,
      search: "",
      deforestationStatusModel: "",
      copyReport: [],
      loading: true,
      selectedItem: false,
      expanded: [],
      buyingStationName: '',
      initialLoadComplete: false,
      options: {
        limit: 10,
        page: 1,
      },
      headers: [
        {
          text: this.$t("memberDataSection.farmNameAndId"),
          align: "start",
          value: "farmNameAndId",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("memberDataSection.addressOfProduction"),
          align: "start",
          value: "addressOfProduction",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("memberDataSection.areaHa"),
          align: "start",
          value: "area",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("memberDataSection.type"),
          align: "start",
          value: "type",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("memberDataSection.status"),
          align: "start",
          value: "status",
          class: "black--text",
          sortable: true,
        },
        {
          text: "",
          value: "actions",
          sortable: false,
          width: "60px",
        },
        {
          text: "",
          value: "data-table-expand",
          sortable: false,
          width: "40px",
        },
      ],
      allSelectedHeaders: [
        this.$t('memberDataSection.farmNameAndId'),
        this.$t('memberDataSection.addressOfProduction'),
        this.$t('memberDataSection.areaHa'),
        this.$t("memberDataSection.type"),
        this.$t("memberDataSection.status"),
        "",
        "",
      ],
      menu: false,
      associatedFarms: [],
      totalAssociatedFarms: 0,
      totalAssociatedFarmPages: 0,
      customizeMenu: false,
      customizeMenuAll: false,
      itemsPerPageOptions: [5, 10, 25, 50],
      itemsPerPageSlider: 1,
      selectedHeaders: [],
      tableHeaders: [],
      deforestationStatuses: [
        { text: this.$t("deforestation.allStatus"), val: ""},
        { text: this.$t("deforestation.veryHighProbability"), val: "Very High Deforestation Probability"},
        { text: this.$t("deforestation.highProbability"), val: "High Deforestation Probability" },
        { text: this.$t("deforestation.mediumProbability"), val: "Medium Deforestation Probability" },
        { text: this.$t("deforestation.lowProbability"), val: "Low Deforestation Probability" },
        { text: this.$t("deforestation.veryLowProbability"), val: "Very Low Deforestation Probability" },
        { text: this.$t("deforestation.zeroOrNegligibleProbability"), val: "Zero/Negligible Deforestation Probability"},
        { text: this.$t("dueDiligence.manualMitigated"), val: "Manually Mitigated" },
      ],
      confirm: false,
      confirmElements: {
        title: this.$t("farm.deleteFarm"),
        message: this.$t("farm.confirmDeleteFarm"),
        confirmBtnText: this.$t("yes"),
        cancelBtnText: this.$t("cancel"),
        confirmData: {},
      },
    };
  },
  methods: {
    async exportToPDF() {
      try {
        this.startLoading();
        
        // For now, we'll use the existing printPDF method since there's no server-side PDF export
        // You might want to implement a client-side PDF generation or create a server endpoint
        await this.printPDF();
        
        this.stopLoading();
      } catch (error) {
        console.error('Error exporting PDF:', error);
        this.stopLoading();
        // Handle error - you might want to show a notification to the user
      }
    },

    async printPDF() {
      await this.$nextTick();
      const element = document.querySelector(".v-data-table__wrapper");
      let opt = {
        margin: 1,
        filename: "AssociatedFarmsList.pdf",
        image: { type: "jpeg", quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
      };

      let worker = await html2pdf()
        .set(opt)
        .from(element)
        .toCanvas()
        .outputPdf("blob", "AssociatedFarms.pdf");
      let file = new File([worker], "AssociatedFarms.pdf", {
        type: "application/pdf",
      });
      var pdfUrl = await URL.createObjectURL(file);
      await printJS({ printable: `${pdfUrl}`, type: "pdf", showModal: true });
    },

    async resetDefault() {
      this.tableHeaders = this.headers;
      this.selectedHeaders = this.allSelectedHeaders;
      this.menu = false;
      await this.getAssociatedFarms();
    },

    async resetTableStructure() {
      this.tableHeaders = this.headers.filter((header) =>
        this.selectedHeaders.includes(header.text)
      );
      this.options.limit = this.itemsPerPageOptions[
        this.itemsPerPageSlider
      ];
      await this.getAssociatedFarms();
      (this.customizeMenu = false), (this.customizeMenuAll = false);
    },

    getDateFormat(date) {
      return moment(date).format("DD/MM/YYYY");
    },

    handleAddFarm() {
      this.$router.push({
        name: 'createFarm',
        params: { 
          buyingStationId: this.$route.params.id,
          buyingStationName: this.buyingStationName
        },
      });
    },

    handleBack() {
      this.$router.push({
        name: 'buyingStation',
        params: { id: this.$route.params.id },
      });
    },


    editFarm(id) {
      this.$router.push({
        name: 'EditFarms',
        params: { farmId: id },
      });
    },

    deleteFarm(id) {
      this.confirmElements.title = this.$t("farm.deleteFarm");
      this.confirmElements.message = this.$t("farm.confirmDeleteFarm");
      this.confirmElements.confirmBtnText = this.$t("yes");
      this.confirmElements.confirmData = { farmId: id };
      this.confirm = true;
    },

    confirmCancel() {
      this.confirm = false;
    },

    async confirmDelete(action, confirmData) {
      if (action) {
        await this.startLoading();
        FarmService.deactiveFarm(confirmData.farmId)
          .then(async (res) => {
            if (res.success) {
              // Stop the initial loading and let getAssociatedFarms handle its own loading
              await this.stopLoading();
              await this.getAssociatedFarms(); // This will handle its own loading state
              this.confirm = false;
              this.$notify({
                title: this.$t("farm.deleted"),
                type: "success",
              });
            } else {
              await this.stopLoading();
              this.confirm = false;
              this.$notify({
                title: this.$t("farm.notDeleted"),
                type: "error",
              });
            }
          })
          .catch(async () => {
            await this.stopLoading();
            this.confirm = false;
            this.$notify({
              title: this.$t("farm.notDeleted"),
              type: "error",
            });
          });
      } else {
        this.confirm = false;
      }
    },

    filterData() {
      this.options.page = 1;
      this.getAssociatedFarms();
    },

    searchQuery() {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => {
        this.options.page = 1;
        this.getAssociatedFarms();
      }, 500)
    },


    async getAssociatedFarms(opt = null) {
      this.loading = true;
      
      try {
        // Fetch both farms and buying station details
        const [farmsResponse, stationResponse] = await Promise.all([
          BuyingStationService.getFarms(this.$route.params.id),
          BuyingStationService.getBuyingStationDetails(this.$route.params.id)
        ]);
        
        // Update buying station name from API response
        if (stationResponse.data) {
          this.buyingStationName = stationResponse.data.fullName || 
            `${stationResponse.data.firstName || ''} ${stationResponse.data.middleName || ''} ${stationResponse.data.lastName || ''}`.trim() ||
            (this.isNaccuUser ? 'Affiliate' : 'Buying Station');
        }
        
        const response = farmsResponse;
        
        // Map the API response to match our table structure
        let farms = (response.data?.info || []).map(farm => ({
          id: farm.id,
          farmName: farm.farmName,
          addressLine1: farm.address || '',
          addressLine2: farm.district || farm.city || '',
          area: farm.area || 0,
          type: this.getFarmType(farm), // Determine type based on segments and coordinates
          status: 'n/a', // Will be updated with EUDR data
          createdAt: farm.createdAt,
          geofence: farm.geofence,
          lat: farm.lat,
          log: farm.log,
          ownerName: farm.ownerName,
          registrationNo: farm.registrationNo,
          farmingActivity: farm.farmingActivity,
          productionSystem: farm.productionSystem,
          segments: farm.segments || [],
          coordinates: farm.coordinates || [],
          eudrStatus: null, // Will be populated with EUDR data
          riskAssessmentStatus: null, // Will be populated with risk assessment data
          deforestationData: null // Will store full deforestation assessment data
        }));
        
        // Fetch EUDR deforestation status for each farm
        await this.fetchEudrStatusForFarms(farms);
        
        // Apply search filter if provided
        if (this.search) {
          farms = farms.filter(farm => 
            farm.farmName?.toLowerCase().includes(this.search.toLowerCase()) ||
            farm.id?.toLowerCase().includes(this.search.toLowerCase()) ||
            farm.addressLine1?.toLowerCase().includes(this.search.toLowerCase()) ||
            farm.ownerName?.toLowerCase().includes(this.search.toLowerCase())
          );
        }
        
        // Apply deforestation status filter if provided
        if (this.deforestationStatusModel) {
          farms = farms.filter(farm => farm.status === this.deforestationStatusModel);
        }
        
        // Apply sorting if provided
        if (opt?.sortBy?.length) {
          const sortField = opt.sortBy[0];
          const sortOrder = opt.sortDesc[0] ? 'desc' : 'asc';
          farms.sort((a, b) => {
            let aVal = a[sortField];
            let bVal = b[sortField];
            
            if (typeof aVal === 'string') {
              aVal = aVal.toLowerCase();
              bVal = bVal.toLowerCase();
            }
            
            if (sortOrder === 'desc') {
              return bVal > aVal ? 1 : -1;
            } else {
              return aVal > bVal ? 1 : -1;
            }
          });
        }
        
        // Client-side pagination
        const startIndex = (this.options.page - 1) * this.options.limit;
        const endIndex = startIndex + this.options.limit;
        
        this.associatedFarms = farms.slice(startIndex, endIndex);
        this.totalAssociatedFarms = farms.length;
        this.totalAssociatedFarmPages = Math.ceil(this.totalAssociatedFarms / this.options.limit);

        this.fromAssociatedFarmsList = this.totalAssociatedFarms > 0
          ? (this.options.page - 1) * this.options.limit + 1
          : 0;
        this.toAssociatedFarmsList = this.options.page * this.options.limit > this.totalAssociatedFarms
          ? this.totalAssociatedFarms
          : this.options.page * this.options.limit;

        this.loading = false;
        this.initialLoadComplete = true; // Mark initial load as complete
      } catch (error) {
        console.error('Error fetching farms:', error);
        this.loading = false;
        this.initialLoadComplete = true; // Mark initial load as complete even on error
        // Handle error - you might want to show a notification to the user
      }
    },

    getFarmType(farm) {
      // Determine type based on segments and coordinates arrays
      const hasSegments = farm.segments && farm.segments.length > 0;
      const hasCoordinates = farm.coordinates && farm.coordinates.length > 0;
      
      // If farm has both segments and coordinates, check which one is more comprehensive
      if (hasSegments && hasCoordinates) {
        // If coordinates array has more than 1 value, it's circular
        if (farm.coordinates.length > 1) {
          return 'Circular';
        } else {
          return 'Point';
        }
      } else if (hasSegments && !hasCoordinates) {
        return 'Point';
      } else if (!hasSegments && hasCoordinates) {
        // If coordinates array has more than 1 value, it's circular
        if (farm.coordinates.length > 1) {
          return 'Circular';
        } else {
          return 'Point';
        }
      } else {
        return 'Unknown';
      }
    },

    async fetchEudrStatusForFarms(farms) {
      // Fetch EUDR production place status for each farm using CF Farm ID API
      const eudrPromises = farms.map(async (farm) => {
        try {
          console.log(`Fetching EUDR status for farm using CF Farm ID: ${farm.id}`);
          const productionPlaceResponse = await DeforestationService.getProductionPlaceByCfFarmId(farm.id);
          const productionPlaceData = productionPlaceResponse.data?.productionPlaceByCfFarmid;
          
          if (productionPlaceData) {
            // Extract EUDR status and risk assessment data from production place
            farm.productionPlaceData = productionPlaceData;
            farm.eudrStatus = this.determineEudrStatusFromProductionPlace(productionPlaceData);
            farm.riskAssessmentStatus = this.determineRiskAssessmentStatusFromProductionPlace(productionPlaceData);
            farm.status = this.determineOverallStatus(farm.eudrStatus, farm.riskAssessmentStatus);
            console.log(`Successfully fetched EUDR status using CF Farm ID for farm: ${farm.id}`);
          } else {
            // No production place data available
            farm.eudrStatus = 'n/a';
            farm.riskAssessmentStatus = 'n/a';
            farm.status = 'n/a';
          }
        } catch (error) {
          console.warn(`Failed to fetch EUDR status for farm ${farm.id} using CF Farm ID:`, error);
          // Set default values if EUDR data fetch fails
          farm.eudrStatus = 'n/a';
          farm.riskAssessmentStatus = 'n/a';
          farm.status = 'n/a';
        }
      });
      
      // Wait for all EUDR status requests to complete
      await Promise.allSettled(eudrPromises);
    },

    determineEudrStatusFromProductionPlace(productionPlaceData) {
      // Extract EUDR status from production place deforestation info
      if (!productionPlaceData) return 'n/a';
      
      // Check productionPlaceDeforestationInfo first
      if (productionPlaceData.productionPlaceDeforestationInfo?.deforestationReport?.overallProb) {
        return productionPlaceData.productionPlaceDeforestationInfo.deforestationReport.overallProb;
      }
      
      // Check diligenceReportProductionPlaceArray deforestation info
      if (productionPlaceData.diligenceReportProductionPlaceArray && productionPlaceData.diligenceReportProductionPlaceArray.length > 0) {
        const firstPlace = productionPlaceData.diligenceReportProductionPlaceArray[0];
        if (firstPlace.productionPlaceDeforestationInfo?.deforestationReport?.overallProb) {
          return firstPlace.productionPlaceDeforestationInfo.deforestationReport.overallProb;
        }
      }
      
      return 'n/a';
    },

    determineRiskAssessmentStatusFromProductionPlace(productionPlaceData) {
      // Extract risk assessment status from production place
      if (!productionPlaceData) return 'n/a';
      
      // Check main production place risk_assessment_status first
      if (productionPlaceData.risk_assessment_status) {
        return productionPlaceData.risk_assessment_status;
      }
      
      // Check diligenceReportProductionPlaceArray assessment
      if (productionPlaceData.diligenceReportProductionPlaceArray && productionPlaceData.diligenceReportProductionPlaceArray.length > 0) {
        const firstPlace = productionPlaceData.diligenceReportProductionPlaceArray[0];
        if (firstPlace.all_risk_assessments && firstPlace.all_risk_assessments.length > 0) {
          return firstPlace.all_risk_assessments[0].riskAssessmentStatus;
        }
      }
      
      // Check all_risk_assessments
      if (productionPlaceData.all_risk_assessments && productionPlaceData.all_risk_assessments.length > 0) {
        return productionPlaceData.all_risk_assessments[0].riskAssessmentStatus;
      }
      
      return 'n/a';
    },

    determineEudrStatus(deforestationData) {
      // Use the overallProb directly as it contains the EUDR deforestation status
      if (!deforestationData || !deforestationData.overallProb) return 'n/a';
      
      return deforestationData.overallProb;
    },

    determineRiskAssessmentStatus(deforestationData) {
      // Determine risk assessment status based on the assessment data
      if (!deforestationData) return 'n/a';
      
      // Check if there are any risk assessment indicators
      const hasRiskData = deforestationData.metrics && deforestationData.metrics.length > 0;
      
      if (hasRiskData) {
        // If we have risk data, determine status based on the metrics
        const highRiskMetrics = deforestationData.metrics.filter(metric => 
          metric.label.toLowerCase().includes('high') || 
          metric.percent > 0.5
        );
        
        if (highRiskMetrics.length === 0) {
          return 'approved';
        } else {
          return 'n/a';
        }
      }
      
      return 'n/a';
    },

    determineOverallStatus(eudrStatus, riskAssessmentStatus) {
      // Determine overall status based on EUDR and risk assessment status
      if (eudrStatus === 'zero-negligible' && riskAssessmentStatus === 'approved') {
        return 'compliant';
      } else if (eudrStatus === 'non-compliant' || riskAssessmentStatus === 'rejected') {
        return 'non-compliant';
      } else {
        return 'n/a';
      }
    },

    getFarmStatus(farm) {
      // This method is now replaced by the EUDR status determination
      // Keep for backward compatibility but use the new status field
      return farm.status || 'n/a';
    },

    selectItem(item) {
      this.selectedItem = item;
    },


    reportPageChange(t) {
      if (t) this.options.page = this.options.page + 1;
      else this.options.page = this.options.page - 1;
      this.getAssociatedFarms();
    },

    viewEudrReport(item) {
      // Navigate to EUDR deforestation report view
      // This should be implemented based on your routing structure
      console.log('Viewing EUDR report for farm:', item.id);
      // Example: this.$router.push({ name: 'EudrReport', params: { farmId: item.id } });
    },

    viewRiskAssessmentReport(item) {
      // Navigate to risk assessment report view
      // This should be implemented based on your routing structure
      console.log('Viewing Risk Assessment report for farm:', item.id);
      // Example: this.$router.push({ name: 'RiskAssessmentReport', params: { farmId: item.id } });
    },

    // Helper methods for EUDR status display
    getEudrStatusText(status) {
      // Handle the actual string values from overallProb
      if (!status || status === 'n/a') return 'N/A';
      
      // Map the actual overallProb values to display text
      if (status.includes('Zero') || status.includes('Negligible')) {
        return this.$t("memberDataSection.zeroNegligibleProbability");
      } else if (status.includes('Low') && !status.includes('Very')) {
        return this.$t("memberDataSection.compliant");
      } else if (status.includes('Medium')) {
        return 'Medium Risk';
      } else if (status.includes('High') || status.includes('Very High')) {
        return this.$t("memberDataSection.nonCompliant");
      }
      
      // Fallback to the original status if no mapping found
      return status;
    },

    getEudrStatusButtonClass(status) {
      // Handle the actual string values from overallProb
      if (!status || status === 'n/a') return 'gray-button';
      
      // Map the actual overallProb values to button classes
      if (status.includes('Zero') || status.includes('Negligible')) {
        return 'green-button';
      } else if (status.includes('Low') && !status.includes('Very')) {
        return 'green-button';
      } else if (status.includes('Medium')) {
        return 'orange-button';
      } else if (status.includes('High') || status.includes('Very High')) {
        return 'red-button';
      }
      
      // Fallback to gray for unknown statuses
      return 'gray-button';
    },

    getRiskAssessmentText(status) {
      const statusMap = {
        'approved': this.$t("memberDataSection.approved"),
        'rejected': this.$t("memberDataSection.rejected"),
        'mitigation_required': this.$t("memberDataSection.mitigationRequired"),
        'n/a': 'N/A'
      };
      return statusMap[status] || 'N/A';
    },

    getRiskAssessmentButtonClass(status) {
      const classMap = {
        'approved': 'green-button',
        'rejected': 'red-button',
        'mitigation_required': 'orange-button',
        'n/a': 'gray-button'
      };
      return classMap[status] || 'gray-button';
    },

    formatProbability(probability) {
      if (probability === null || probability === undefined) return 'N/A';
      return Math.round(probability * 100);
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A';
      return moment(dateString).format('DD-MMM-YYYY');
    },
  },
  components: {
    ConfirmBox,
  },
  mixins: [loadingMixin, download, getPermittedActions, DateMixin, RoleMixin],
};
</script>

<style lang="scss" scoped>
.blue-button {
  background-color: #d0e6fe !important;
  border: 2px solid #002287 !important;
  color: #002287 !important;
}

.orange-button {
  background-color: #fff7ec !important;
  border: 2px solid #ffa826 !important;
  color: #ffa826 !important;
}

::v-deep .wdt.v-text-field {
  width: 250px;
}

::v-deep .v-tab:hover {
  background-color: #caf1e2;
  color: $primary_color !important;
}

::v-deep .v-data-table-header span {
  text-transform: uppercase !important;
  color: black;
}

::v-deep .center-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

::v-deep .img-center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 40%;
}

.gray-button {
  background-color: #e8e8e8 !important;
  border: 2px solid #000000 !important;
  color: #000000 !important;
}

.green-button {
  background-color: #d4edda !important;
  border: 2px solid #28a745 !important;
  color: #28a745 !important;
}

.red-button {
  background-color: #f8d7da !important;
  border: 2px solid #dc3545 !important;
  color: #dc3545 !important;
}

/* Dynamic icon colors for rebranding */
.dynamic-icon-color {
  color: var(--primary-color, #00BD73) !important;
}

/* Indonesian client specific icon color */
[data-theme="indonesian"] .dynamic-icon-color {
  color: #184980 !important;
}

/* Kenya client specific icon color */
[data-theme="kenya"] .dynamic-icon-color {
  color: #A75300 !important;
}

/* Default client icon color */
.dynamic-icon-color {
  color: var(--primary-color, #00BD73) !important;
}

/* Minimize gaps in action and expand columns */
::v-deep .action-cell,
::v-deep .expand-cell {
  padding: 8px 4px !important;
  text-align: center;
}

::v-deep .action-cell .v-btn,
::v-deep .expand-cell .v-btn {
  margin: 0 !important;
  min-width: 32px !important;
  width: 32px !important;
  height: 32px !important;
}

/* Standardize all status buttons */
::v-deep .green-button,
::v-deep .red-button,
::v-deep .gray-button {
  height: 32px !important;
}

/* Reduce padding in status column */
::v-deep td[data-value="status"] {
  padding-right: 8px !important;
}

/* Expanded content styling */
.expanded-content {
  background-color: #f8f9fa;
  padding: 0;
}

.horizontal-line {
  width: 100%;
  height: 1px;
  background-color: #dee2e6;
  margin: 0;
}

.two-column-layout {
  display: flex;
  min-height: 120px;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.column-left {
  flex: 0 0 auto;
  padding: 20px 30px 20px 20px;
  display: flex;
  flex-direction: column;
  min-width: 260px;
  max-width: 320px;
}

.column-right {
  flex: 0 0 auto;
  padding: 20px 20px 20px 30px;
  display: flex;
  flex-direction: column;
  min-width: 260px;
  max-width: 320px;
}

/* Responsive design for mobile and tablet */
@media (max-width: 768px) {
  .two-column-layout {
    flex-direction: column;
  }
  
  .column-left {
    padding: 15px 20px 10px 15px;
    min-width: 100%;
    max-width: 100%;
  }
  
  .column-right {
    padding: 10px 20px 15px 15px;
    min-width: 100%;
    max-width: 100%;
  }
  
  .vertical-line {
    display: none;
  }
  
  .horizontal-line {
    display: block;
    width: 100%;
    height: 1px;
    background-color: #dee2e6;
    margin: 0;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .column-left {
    padding: 18px 25px 18px 18px;
    min-width: 220px;
    max-width: 280px;
  }
  
  .column-right {
    padding: 18px 18px 18px 25px;
    min-width: 220px;
    max-width: 280px;
  }
}

@media (min-width: 1025px) {
  .column-left {
    padding: 20px 30px 20px 20px;
    min-width: 260px;
    max-width: 320px;
  }
  
  .column-right {
    padding: 20px 20px 20px 30px;
    min-width: 260px;
    max-width: 320px;
  }
}

.vertical-line {
  width: 2px;
  background-color: #dee2e6;
  margin: 20px 0;
  flex: 0 0 2px;
}

.section-header {
  margin-bottom: 15px;
}

.section-title {
  color: #28a745;
  font-size: 16px;
  font-weight: bold;
  margin: 0;
  text-align: left;
}

.section-body {
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex: 1;
  text-align: left;
}

.assessment-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  text-align: left;
}

.assessment-label {
  font-weight: normal;
  color: #666;
  font-size: 14px;
  margin-bottom: 5px;
}

.assessment-value {
  font-weight: bold;
  color: #000;
  font-size: 14px;
}

.button-with-icon {
  display: flex;
  align-items: center;
}

.assessment-details {
  margin-top: 10px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e9ecef;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 12px;
}

.detail-label {
  font-weight: bold;
  color: #666;
}

.detail-value {
  color: #000;
  font-weight: normal;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 3px;
  font-size: 11px;
}

.metric-label {
  font-weight: bold;
  color: #666;
}

.metric-value {
  color: #000;
  font-weight: normal;
}
</style>
