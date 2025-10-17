<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-4">
        <h2>{{ $t('deforestation.farmList.title') }}</h2>
        <v-spacer></v-spacer>
        <v-btn class="primary mx-2" >{{ $t('deforestation.farmList.addFarmGeofenceManually') }}</v-btn>
        <v-btn outlined color="primary" class=" mx-2  import-btn">
          <v-icon left>mdi-download</v-icon>
          {{ $t('deforestation.farmList.importGeofenceInBulk') }}
        </v-btn>
      </div>

      <v-card elevation="0" class="px-5">
        <v-card-text>
          <v-data-table :headers="tableHeaders" :items="farms" :items-per-page="10" v-model="selected" show-select
                        show-expand item-key="id"
                        :single-expand="true" item-value="index" :expanded.sync="expanded"
                        :footer-props="{
            'items-per-page-options': [10, 25, 50],
        }" hide-default-footer :loading="loading" :options.sync="options"
                        :server-items-length="totalProductionPlaces" :loading-text="$t('deforestation.farmList.loadingFarms')">
            <template v-slot:top="{ }">
              <div class="d-flex mt-5">
                <div class="srch">
                  <v-text-field prepend-inner-icon="mdi-magnify" outlined height="5px"
                                :placeholder="$t('deforestation.farmList.searchPlaceHolder')" dense v-model="search" @input="searchQuery"
                                class="shrink mx-2" style="width: 300px">
                  </v-text-field>
                </div>

                <v-btn outlined class="mx-2" color="grey" @click="showFilters= true" style="min-width: 40px; padding: 0;">
                  <v-icon>mdi-filter-outline</v-icon>
                </v-btn>


                <v-spacer></v-spacer>
                <!-- <v-btn class="primary mx-2" disabled >{{ $t('deforestation.farmList.generateCertificate') }}</v-btn>
                <v-btn class="primary mx-2" disabled >{{ $t('deforestation.farmList.requestAssementReport') }}
                </v-btn> -->
                <div class="py-1 title">
                  {{ from }} - {{ to }} {{ $t('of') }} {{ totalProductionPlaces }}
                </div>
                <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page <= 1"
                       @click="pageChange(false)">
                  <v-icon dark>
                    mdi-chevron-left
                  </v-icon>
                </v-btn>
                <v-btn class="mx-2" fab small outlined color="primary"
                       :disabled="to >= totalProductionPlaces" @click="pageChange(true)">
                  <v-icon dark>
                    mdi-chevron-right
                  </v-icon>
                </v-btn>
                <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" left
                        :min-width="417">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn class="mx-2" fab small outlined color="primary" v-bind="attrs" v-on="on">
                      <v-icon dark> mdi-cog-outline</v-icon>
                    </v-btn>
                  </template>
                  <v-card width="417">
                    <v-list>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>{{
                              $t("deforestation.customization")
                            }}
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider></v-divider>
                      <div class="pl-3 pt-2 font-weight-normal">
                        {{ $t("deforestation.recordsPerpage") }}
                      </div>
                      <v-list-item>
                        <v-list-item-content>
                          <v-slider v-model="itemsPerPageSlider"
                                    :tick-labels="itemsPerPageOptions" :max="3" step="1"
                                    ticks="always" tick-size="4"></v-slider>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider class="mt-n3"></v-divider>
                    </v-list>
                    <v-card-text>
                      <v-container fluid>
                        <v-row>
                          <v-col class="mt-n9" cols="6" v-for="header in headers"
                                 :key="header.value">
                            <v-checkbox v-if="header.text" v-model="selectedHeaders"
                                        :label="header.text" color="primary" :value="header.text"
                                        hide-details :disabled="header.text == 'ID'"></v-checkbox>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-layout justify-center>
                      <v-card-actions class="mb-5">
                        <v-spacer></v-spacer>

                        <v-btn outlined color="primary" @click="resetDefaut" width="190">
                          {{ $t("deforestation.restoreDefault") }}
                        </v-btn>
                        <v-btn color="primary" @click="resetTableStructure" width="190">
                          {{ $t("deforestation.apply") }}
                        </v-btn>
                      </v-card-actions>
                    </v-layout>
                  </v-card>
                </v-menu>

                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn class="mx-2" fab small outlined color="primary" v-bind="attrs" v-on="on">
                      <v-icon>mdi-download</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item v-for="option in downloadOptions" :key="option.value">
                      <v-list-item-title @click="download(option.value)" class="cursor-pointer">{{ option.text }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <v-tooltip top color="black" max-width="350">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn class="mx-2" fab small outlined color="primary" v-bind="attrs" v-on="on"
                           @click="printPDF('document')">
                      <v-icon dark> mdi-printer</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t("deforestation.restoreDefault") }}</span>
                </v-tooltip>
              </div>
            </template>


            <template v-slot:item.eudrDeforestationStatus="{ item }">
              <div class="d-flex align-center">
                <v-chip small rounded min-width="200" depressed
                        :class="getEUDRDeforestationStatus(item.eudrDeforestationStatus).class" height="34"
                        v-if="getEUDRDeforestationStatus(item.eudrDeforestationStatus).text !== 'N/A'">
                  {{ getEUDRDeforestationStatus(item.eudrDeforestationStatus).text }}
                </v-chip>
                <span v-else>N/A</span>
                <v-spacer></v-spacer>
                <v-tooltip top color="00BD73" max-width="350">
                  <template v-slot:activator="{ on, attrs }">
                    <img v-bind="attrs" v-on="on" :src="isIndonesianClient ? '/img/id/todo-list.svg' : '/icons/todo-list.png'" class="ml-2"
                         style="width: 34px; height: 34px; border-radius: 50%;"
                         @click="navigateAssessmentReportView(item)"/>

                  </template>
                  <span>{{ $t('viewDeforestationDetails') }}</span>
                </v-tooltip>
              </div>
            </template>
            <template v-slot:item.riskAssessmentStatus="{ item }">
              <div class="d-flex align-center">
                <v-chip small rounded min-width="200" depressed
                        :class="getRiskAssessmentStatus(item.riskAssessmentStatus).class" height="34"
                        v-if="getRiskAssessmentStatus(item.riskAssessmentStatus).text !== 'N/A'">
                  {{ getRiskAssessmentStatus(item.riskAssessmentStatus).text }}
                </v-chip>
                <span v-else>N/A</span>
                <v-spacer class="mx-2"></v-spacer>
                <v-tooltip top color="00BD73" max-width="350">
                  <template v-slot:activator="{ on, attrs }">
                    <img
                        v-if="item.assessment.length===1"
                        v-bind="attrs"
                        v-on="on"
                        class="ml-9"
                        :src="isIndonesianClient ? '/img/id/todo-list.svg' : '/icons/todo-list.png'"
                        style="width: 34px; height: 34px; border-radius: 50%; cursor: pointer;"
                        @click="navigateRiskAssessmentView(item) "
                    />
                  </template>
                  <span>{{ $t('dueDiligence.viewAssessment') }}</span>
                </v-tooltip>
              </div>
            </template>
            <template v-slot:item.actions="{ item }">
              <div class="d-flex">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn class="ml-2" x-small fab v-bind="attrs" v-on="on" color="primary"
                           @click="viewFarmDetails(item)">
                      <v-icon style="color: white !important;">mdi-eye</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('view') }}</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn class="ml-2" x-small fab v-bind="attrs" v-on="on" color="primary"
                           @click="deleteFarm(item)">
                      <v-icon style="color: white !important;">mdi-trash-can</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('delete') }}</span>
                </v-tooltip>
              </div>
            </template>


            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length">
                <v-data-table
                    v-if="item.assessment"
                    :headers="assessmentHeaders"
                    :items="item.assessment"
                    item-key="id"
                    hide-default-footer
                    class="elevation-0 custom-expanded-table"
                >
                  <template v-slot:item.status="{ item }">
                    <div class="d-flex align-center">
                      <v-chip small rounded min-width="200" depressed
                              :class="getRiskAssessmentStatus(item.riskAssessmentStatus).class" height="34"
                              v-if="getRiskAssessmentStatus(item.riskAssessmentStatus).text !== 'N/A'">
                        {{ getRiskAssessmentStatus(item.riskAssessmentStatus).text }}
                      </v-chip>
                      <span v-else>N/A</span>
                      <v-spacer class="mx-2"></v-spacer>
                      <v-tooltip top color="00BD73" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                          <img
                              v-bind="attrs"
                              v-on="on"
                              class="ml-9"
                              :src="isIndonesianClient ? '/img/id/todo-list.svg' : '/icons/todo-list.png'"
                              style="width: 34px; height: 34px; border-radius: 50%; cursor: pointer;"
                              @click="navigateRiskAssessmentView(item)"
                          />
                        </template>
                        <span>{{ $t('dueDiligence.viewAssessment') }}</span>
                      </v-tooltip>
                    </div>
                  </template>
                </v-data-table>
                <p v-else class="d-flex justify-center align-center">{{ $t('dueDiligence.noAssessment') }}</p>
              </td>
            </template>


            <template v-slot:footer></template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-container>
    
    <v-dialog v-model="showFilters" width="356"  @click:outside="closeFilter" content-class="my-custom-dialog"  max-height = "100vh"  
      transition="dialog-bottom-transition">
      <v-card min-height="100vh"  class="" rounded="0">
        <v-toolbar color="primary" class="white--text" flat :elevation="0">
          <v-toolbar-title class="font-weight-bold">{{
            this.$t("filterBy")
          }}</v-toolbar-title>
          <v-spacer></v-spacer>

          <v-btn icon class="white--text" @click="closeFilter">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pt-5">
          <v-row no-gutters>
            <v-col cols="12">
              <label for="text">{{
                        $t("deforestation.allProducer")
                      }}</label>
              <v-select  v-model="producerModel" item-text="text" item-value="val" :items="allProducers"
                        :placeholder="$t('deforestation.allProducer')" @change="filterData" outlined dense>
                      </v-select>
             
            </v-col> 
            <v-col cols="12">
              <label for="text">{{
                        $t("deforestation.EUDRDeforestationStatus")
                      }}</label>
                      <v-select v-model="reportStatus" item-text="text" item-value="val" :items="deforestationStatus"
                        :placeholder="$t('deforestation.EUDRDeforestationStatus')" @change="filterData" outlined dense>
                      </v-select>
            </v-col>

            <v-col cols="12" >
              <label for="text">{{ $t("country") }}</label>
              <v-select :items="countries" v-model="reportCountry" item-text="name" item-value="name" dense outlined
                 :placeholder="$t('deforestation.allCountries')" @change="filterData"></v-select>
            </v-col>

                  
          </v-row>
          <v-row>
            <v-col cols="12" class="d-flex justify-space-around">
              <v-btn outlined @click="clearFilters" width="130" color="primary">
                {{ this.$t("clearAll") }}
              </v-btn>
              <v-btn width="130" @click="searchWithFilter" color="primary">
                {{ this.$t("search") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <confirm-box
      :title="farmConfirmDelete.title"
      :message="farmConfirmDelete.message"
      :cancelBtnText="farmConfirmDelete.cancelBtnText"
      :confirmBtnText="farmConfirmDelete.confirmBtnText"
      :confirmData="farmConfirmDelete.confirmData"
      :dialog="farmConfirmDeleteDialog"
      @cancel:action="farmConfirmDeleteDialog = false"
      @continue:action="confirmRemoveFarm" />
  </div>

  
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import download from "@/mixins/DownloadMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import DateMixin from '@/mixins/DateMixin';
import tableCustomizationMixin from '@/mixins/tableCustomizationMixin'
import DeforestationService from "@/_services/DeforestationService";
import ActivityLogService from "@/_services/ActivityLogService";
import html2pdf from "html2pdf.js";
import printJS from "print-js";
import { getRiskAssessmentStatus} from "@/utils";
import ConfirmBox from "@/components/ConfirmBox";
import { getCountries } from "country-state-picker";
import { isIndonesianClient } from "@/utils";

export default {
  components:{    "confirm-box": ConfirmBox,
},
  async created() {
    const prefs = this.getTablePrefs('FarmTable');
    if (prefs) {
      this.selectedHeaders = prefs.selectedHeaders;
      this.itemsPerPageSlider = this.itemsPerPageOptions.indexOf(prefs.itemsPerPage);
    } else {
      this.selectedHeaders = this.headers.map(h => h.text);
      this.itemsPerPageSlider = 1;
    }
    this.options.itemsPerPage = this.itemsPerPageOptions[this.itemsPerPageSlider];
    this.tableHeaders = this.headers.filter(header => this.selectedHeaders.includes(header.text));
    await this.getCountry();
  },
  computed: {
    isIndonesianClient() {
      return isIndonesianClient();
    },
    totalPages() {
      return 1
    },
    orgId() {
      return this.$store.getters.getUser.user_organization.id
    },
  },
 async mounted() {
    await this.fetchallProducers();
  },
  watch: {
    options: {
      async handler() {
        await this.fetchData();
      },
      deep: true,
    },
  },
  data() {
    return {
      options: {
        page: 1,
        itemsPerPage : 10,
      },
      selected: [],
      expanded: [],
      farms: [],
      headers: [
        {text: this.$t('deforestation.farmList.producer'), value: 'producer', class: "black--text", align: "start", sortable: true},
        {text: this.$t('deforestation.farmList.farmNameAndId'), value: 'farmName', class: "black--text", align: "start", sortable: true},
        {text: this.$t('deforestation.farmList.addressOfProduction'), value: 'address', class: "black--text", align: "start", sortable: true},
        {text: this.$t('deforestation.farmList.registrationDate'), value: 'registrationDate', class: "black--text", align: "start", sortable: true},
        {text: this.$t('deforestation.farmList.eudrDeforestationStatus'), value: 'eudrDeforestationStatus', class: "black--text", align: "center"},
        {text: this.$t('deforestation.farmList.riskAssessmentStatus'), value: 'riskAssessmentStatus', class: "black--text", align: "start"},
        {text: '', value: 'actions', sortable: false, class: "black--text", align: "start"},
        {text: '', value: 'data-table-expand'},
      ],
      assessmentHeaders: [
        {text: this.$t('deforestation.farmList.assessmentTitle'), value: 'title'},
        {text: this.$t('deforestation.farmList.assessmentDescription'), value: 'description'},
        {text: this.$t('deforestation.farmList.submissionDate'), value: 'submission_date'},
        {text: this.$t('deforestation.farmList.expiryDate'), value: 'expiry_date'},
        {text: this.$t('deforestation.farmList.assessmentStatus'), value: 'status'},
      ],
      downloadOptions: [
        // {text: this.$t('deforestation.farmList.downloadAsKmx'),value:'KMX'},
        // {text: this.$t('deforestation.farmList.downloadAsKml'),value:'KML'},
        // {text: this.$t('deforestation.farmList.downloadAsShp'),value:'SHP'},
        // {text: this.$t('deforestation.farmList.downloadAsCsv'),value:'CSV'},
        // {text: this.$t('deforestation.farmList.downloadAsExcel'),value:'EXCEL'},
        // {text: this.$t('deforestation.farmList.downloadAsPdf'),value:'PDF'},
        {text: this.$t('deforestation.farmList.downloadAsGeoJson'),value:'GeoJSON'},
      ],
      totalShipment: 10,
      loading: false,
      totalProductionPlaces: 0,
      tab: 0,
      selectedItem: false,
      search: "",
      from: 0,
      document: "",
      to: 0,
      reportCountry: 'All Countries',
      reportStatus: '',
      supplierModel: '',
      countries: [{ text: this.$t("deforestation.allCountries"), val: "" }],
      allProducers: [{ text: this.$t("deforestation.allProducer"), val: "" }],

      deforestationStatus:[
          { text: this.$t("deforestation.allStatus"), val: "All Status" },
          { text: this.$t("deforestation.veryHighDeforestationProbability"), val: "Very High Deforestation Probability" },
          { text: this.$t("deforestation.highDeforestationProbability"), val: "High Deforestation Probability" },
          { text: this.$t("deforestation.mediumDeforestationProbability"), val: "Medium Deforestation Probability" },
          { text: this.$t("deforestation.lowDeforestationProbability"), val: "Low Deforestation Probability" },
          { text: this.$t("deforestation.veryLowDeforestationProbability"), val: "Very Low Deforestation Probability" },
          { text: this.$t("deforestation.zeroNegligibleDeforestationProbability"), val: "Zero/Negligible Deforestation Probability" },
          { text: this.$t("deforestation.manuallyMitigated"), val: "Manually Mitigated" },
        ],
        

      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: false,
          exact: true,
        },
        {
          text: this.$t("dueDiligence.manageFarms"),
          disabled: true,
          href: "breadcrumbs_link_1",
        },
      ],
      customizeMenu: false,
      customizeMenuAll: false,
      itemsPerPageOptions: [5, 10, 25, 50],
      itemsPerPageSlider: 1,
      selectedHeaders: [],
      tableHeaders: [],
      allSelectedHeaders: [
        this.$t('Producer'),
        this.$t('Farm Name & ID'),
        this.$t('Address of Production'),
        this.$t('Registration Date'),
        this.$t('EUDR Deforestation Status'),
        this.$t('Risk Assessment Status')
      ],
      menu: false,
      farmConfirmDeleteDialog : false,
      farmConfirmDelete: {
        title: this.$t("confirmDialog.farm.delete.title"),
        message: this.$t("confirmDialog.farm.delete.message"),
        confirmBtnText: this.$t("confirmDialog.farm.delete.confirmBtn"),
        cancelBtnText: this.$t("cancel"),
        confirmData: {},
      },
      showFilters: false,
      producerModel: '',
    };
  },
  methods: {
    filterData() {},
    getEUDRDeforestationStatus(status) {
         switch (status) {
            case 'Zero/Negligible Deforestation Probability':
            case 'Zero/Negligible Probability':
                return { class: 'green-button', text: this.$t("deforestation.zeroOrNegligibleProbability") };
            case 'Very High Deforestation Probability':
            case 'Very High Probability':
                return { class: 'very-high-button', text:  this.$t("deforestation.veryHighProbability") };
            case 'Very Low Deforestation Probability':
            case 'Very Low Probability':
                return { class: 'very-low-button', text: this.$t("deforestation.veryLowProbability") };
            case 'High Deforestation Probability':
            case 'High Probability':
                return { class: 'red-button', text: this.$t("deforestation.highProbability") };
            case 'Low Deforestation Probability':
            case 'Low Probability':
                return { class: 'orange-button', text: this.$t("deforestation.lowProbability") };
            case 'Medium Deforestation Probability':
            case 'Medium Probability':
                return { class: 'medium-button', text: this.$t("deforestation.mediumProbability") };
            case 'Manually Deforestation Mitigated':
            case 'Manually Mitigated':
                return { class: 'manually-button', text: this.$t("deforestation.manualMitigated") };
            default:
                return { class: '', text: 'N/A' };
          }
      },
    getRiskAssessmentStatus,
    download(type){
      switch (type){
        case 'KMX':

          break;
        case 'KML':

          break;
        case 'SHP':

          break;
        case 'CSV':

          break;
        case 'Excel':

          break;
        case 'PDF':

          break;
        case 'GeoJSON':
            if(this.selected.length >0){
              DeforestationService.downloadForSelectedFarms(this.selected)
                  .catch(() => {
                    this.$notify({
                      title: "Error downloading GeoJSON",
                      type: "error",
                    });
                  });
            }else{
              DeforestationService.downloadForAllFarms(this.orgId )
                  .then((res) =>{
                    this.$notify({
                      title: res.data.message || "Your file is currently being processed!",
                      type: "success",
                    });
                  })
                  .catch(() => {
                    this.$notify({
                      title:  "Error downloading GeoJSON",
                      type: "error",
                    });
                  });
            }
          break;

      }

    },
    clearFilters() {
      this.reportCountry = '';
      this.reportStatus = '';
      this.producerModel = '';
      this.options.page = 1;
      this.fetchData();
    },
    searchWithFilter(){
   
      console.log(this.options,this.country,this.producerModel,this.reportStatus, 'searchWithFilter');

      this.fetchData();
      this.showFilters = false;
    },
    async fetchallProducers() {
      try {
        const res = await DeforestationService.getProductionPlaces({
          page: 1,
          limit: 500, // Adjust limit as needed
          removed: false,
        });
        const producers = res.data.productionPlaces?.rows
          .filter(item => item.farm?.userDdsAssoc?.firstName)
          .map(item => ({
            text: `${item.farm?.userDdsAssoc?.firstName || ''} ${item.farm?.userDdsAssoc?.lastName || ''}`.trim(),
            val: item.farm?.userDdsAssoc?.firstName
          }));
        this.allProducers = [...this.allProducers, ...producers];
      } catch (error) {
        console.error("Error fetching all producers:", error);
      }
    },
    async fetchData(opt = null) {
      this.loading = true;
      const requestParams = {
        page: this.options.page,
        limit: this.options.itemsPerPage,
        orgId: this.orgId,
        removed: false,
        searchPhrase: this.search,
        farmCountry: this.reportCountry,
        farmerCountry: this.reportCountry,
        farmOwner: this.producerModel,
        eudrDeforestationStatus: this.reportStatus

      };
      if (opt?.sortBy?.length) {
        requestParams.orderField = opt.sortBy[0];
        requestParams.order = opt.sortDesc[0] ? "DESC" : "ASC";
      }
      DeforestationService.getProductionPlaces(requestParams)
          .then((res) => {
            this.productionPlaces = res.data.productionPlaces.rows;
            return this.sanitizeShipmentResult(res.data.productionPlaces.rows).then((sanitizedResult) => {
              
              this.farms = sanitizedResult;
              this.totalProductionPlaces = res.data.productionPlaces?.totalCount;
              this.from = (this.options.page - 1) * this.options.itemsPerPage + 1;
              this.to = this.options.page * this.options.itemsPerPage;
              if (this.farms.length > 0) {
                this.to -= this.options.itemsPerPage - this.farms.length;
              } else {
                this.to -= this.options.itemsPerPage;
              }
              this.loading = false;
              const countryLists = this.productionPlaces
              .filter((item) => item.farm?.userDdsAssoc?.countryId)
              .map((item) => {
                return {
                  text: item.farm?.userDdsAssoc?.countryId,
                  val: item.farm?.userDdsAssoc?.countryId,
                };
              });
              const producersList = this.productionPlaces
              .filter((item) => {
                return item.farm?.userDdsAssoc?.firstName;})
              .map((item) => {
                const fullName = `${item.farm?.userDdsAssoc?.firstName
                  ? item.farm?.userDdsAssoc?.firstName
                  : ""
                  } ${item.farm?.userDdsAssoc?.lastName ? item.farm?.userDdsAssoc?.firstName : ""
                  }`;
                return {
                  text: `${fullName}`,
                  val: `${item.farm?.userDdsAssoc?.firstName}`,
                };
              });
              this.countries = [...this.countries, ...countryLists];           
              this.allProducers = [...this.allProducers, ...producersList];
            });

          })
          .catch((error) => {
            console.error(error);
            this.loading = false;
          });
    },
    async deleteFarm(item) {
  this.farmConfirmDelete.confirmData = { id:item.id };
  this.farmConfirmDeleteDialog = true;
 },
    async confirmRemoveFarm(action, confirmData) {
      this.startLoading();
      const params = {
        production_place_id: parseInt(confirmData.id),
      };
      const res = await DeforestationService.removeFarmFromProductionPlaceListByProductionPlaceId(params);
      const {success, message} = res.data.removeFarmFromProductionPlaceList;
      this.stopLoading();
      if (success) {
        // Log the production place deletion
        try {
          const userId = this.$store.getters.getUser?.id;
          if (userId) {
            await ActivityLogService.logDDSProductionPlaceDeleted(
              null, // diligenceId not available in this context
              userId,
              confirmData.id,
              '',
              'Manage farms deletion'
            );
          }
        } catch (logError) {
          console.error('Error logging production place deletion:', logError);
        }
        
        this.farmConfirmDeleteDialog = false;
        await this.fetchData();
        this.$notify({
          title: message || this.$t("deforestation.itemDeletedSuccessfully"),
          type: "success",
        });
      }
      this.stopLoading();
    },



    navigateAssessmentReportView(item) {
      this.$router.push({
        name: 'EudrAssessmentReportDDS',
        params: { type: 'assignment', reportRequestId: item.productionPlaceDeforestationInfo.deforestationReportRequestId }
      })
    },
    viewFarmDetails(item) {
      this.$router.push({
        name: 'EudrAssessmentReportDDS',
        params: { type: 'assignment', reportRequestId: item.productionPlaceDeforestationInfo.deforestationReportRequestId }
      })
    },

    navigateRiskAssessmentView(item) {
      this.$router.push({
        name: 'createDueDiligenceReports',
        params: {id: item.diligenceId, show: 'show'}
      })
    },

    async exportToPDF() {
      const element = document.querySelector(".v-data-table__wrapper");
      html2pdf(element, {
        margin: 1,
        filename: "Farms.pdf",
        image: {type: "jpeg", quality: 0.98},
        html2canvas: {dpi: 200, letterRendering: true},
        jsPDF: {
          unit: "in",
          format: "letter",
          orientation: "landscape",
          compress: false,
        },
      });
    },
    async printPDF() {
      const element = document.querySelector(".v-data-table__wrapper");
      let opt = {
        margin: 1,
        filename: "Farms.pdf",
        image: {type: "jpeg", quality: 0.95},
        html2canvas: {scale: 2, useCORS: true},
        jsPDF: {unit: "in", format: "a4", orientation: "landscape"},
      };

      let worker = await html2pdf()
          .set(opt)
          .from(element)
          .toCanvas()
          .outputPdf("blob", "Farms.pdf");
      let file = new File([worker], "Shipments.pdf", {
        type: "application/pdf",
      });
      var pdfUrl = await URL.createObjectURL(file);
      await printJS({printable: `${pdfUrl}`, type: "pdf", showModal: true});
    },
    async resetDefaut() {
      this.selectedHeaders = this.headers.map(h => h.text);
      this.tableHeaders = this.headers;
      this.options.itemsPerPage = 10;
      this.itemsPerPageSlider = 1;

      this.clearTablePrefs('FarmTable');
      await this.fetchData();
    },
    async resetTableStructure() {
      this.menu = false;

      if (!this.selectedHeaders.length) {
        this.selectedHeaders = this.headers.map(header => header.text);
      }

      this.tableHeaders = this.headers.filter(header =>
        this.selectedHeaders.includes(header.text)
      );

      const selectedPerPage = this.itemsPerPageOptions[this.itemsPerPageSlider];
      this.options.itemsPerPage = selectedPerPage;

      this.setTablePrefs('FarmTable', {
        selectedHeaders: this.selectedHeaders,
        itemsPerPage: selectedPerPage
      });

      await this.fetchData();
    },


    selectItem(item) {
      this.selectedItem = item;
    },
    searchQuery() {
      this.options.page = 1;
      this.fetchData();
    },
    resetSearchOnEmpty() {
      this.search = ''
      this.reportCountry = ''
      this.reportStatus = ''
      this.producerModel = ''
      this.options = {
        page: 1,
        itemsPerPage: 10
      }
    },
    pageChange(t) {
      if (t) this.options.page = this.options.page + 1;
      else this.options.page = this.options.page - 1;
    },
    closeFilter() {
      this.showFilters = false;
    },
    getCountry() {
        this.countries = [{ name: this.$t("deforestation.allCountries") }, ...getCountries()];
      },

    async sanitizeShipmentResult(payload) {
      return payload.map(item => {
        const diligenceId = item.diligenceReports[0].id;
        return {
          id: item.id,
          farmId: item.farmId,
          cf_id: item.farmId,
          producer: `${item.farm.userDdsAssoc?.firstName ?? ''} ${item.farm.userDdsAssoc?.lastName ?? ''}`,
          farmName: `${item.farm.farmName} ${item.farm.id}`,
          address: item.farm.address,
          registrationDate: this.getLocalTimeSlashFormat(item.farm.createdAt),
          productionPlaceDeforestationInfo: item.productionPlaceDeforestationInfo,
          eudrDeforestationStatus: item.productionPlaceDeforestationInfo?.deforestationStatus,
          riskAssessmentStatus: item.productionPlaceDeforestationInfo?.riskAssessmentStatus,
          diligenceId:diligenceId,
          assessment : item.diligenceReports[0].diligenceReportAssessment.map(item => {
            return {
              assessment_id: item.assessment.id,
              title : item.assessment.title,
              description: item.assessment.description,
              submission_date: '',
              expiry_date: '',
              riskAssessmentStatus: item.assessment.status,
              diligenceId:diligenceId
            }
          })
        }
      })
    }
  },
  mixins: [tableCustomizationMixin, loadingMixin, download, getPermittedActions, DateMixin],
};
</script>
<style lang="scss" scoped>
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

::v-deep .custom-expanded-table .v-data-table-header {
  background-color: #D9D9D9 !important;
  color: #1E1E1E;
}

::v-deep .custom-expanded-table .v-data-table-header span {
  color: #1E1E1E !important;
}

::v-deep .custom-expanded-table v-data-table {
  border-collapse: collapse !important;
}

.import-btn {
  background-color: #ffffff;
}

.green-button {
  background-color: #c1ffe7 !important;
  /* Green background */
  border: 2px solid #489e16 !important;
  /* Red border */
  color: #489e16 !important;
}

.green-shadow {
  color: #00bd73 !important;
}

.red-button {
  background-color: #fdebeb !important;
  /* Green background */
  border: 2px solid #da3d3d !important;
  /* Red border */
  color: #da3d3d !important;
}

.orange-button {
  background-color: #fff7ec !important;
  /* Green background */
  border: 2px solid #ffa826 !important;
  /* Red border */
  color: #ffa826 !important;
}
::v-deep .my-custom-dialog {
  position: absolute;
  top: 0;
  min-height: 100%;
  right: 0;
  margin-right: 0px;
  margin-top: 0px;
}


</style>