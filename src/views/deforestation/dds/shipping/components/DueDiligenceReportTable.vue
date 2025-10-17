<template>
  <v-row>
    <v-col cols="12">
      <v-data-table :headers="tableHeaders" :items="diligenceReports" item-key="id"
        :items-per-page="reportOptions.itemsPerPage" :footer-props="{
          'items-per-page-options': itemsPerPageOptions,
        }" yellow hide-default-footer :loading="loading" :options.sync="reportOptions" :loading-text="$t('deforestation.loadingDeforestationComplianceReport')
          ">
        <template v-slot:top="{}">
          <div class="d-flex mt-5">
            <div>
              <p class="text-subtitle-1 font-weight-bold mb-2"> {{ $t('deforestation.eudrRefNo') }} 
                <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                        mdi-alert-circle
                        </v-icon>
                    </template>
                    <span>{{ $t("deforestation.eudrRefNoInfo") }}</span>
                </v-tooltip>
              </p>
              <v-text-field style="width: 290px;" prepend-inner-icon="mdi-magnify" outlined height="5px"
                :placeholder="$t('search')" dense v-model="reportSearch" @input="searchQuery" class="shrink">
              </v-text-field>
            </div>
            <div>
              <p class="text-subtitle-1 font-weight-bold mb-2"> {{ $t('status') }}
                <v-tooltip top color="00BD73" max-width="350">
                  <template v-slot:activator="{ on, attrs }">
                      <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                      mdi-alert-circle
                      </v-icon>
                  </template>
                  <span>{{ $t("deforestation.statusInfo") }}</span>
              </v-tooltip>
              </p>
              <v-select style="width: 260px; " class="mx-2" v-model="reportStatus" item-text="text" item-value="val"
                :items="allStatus" :label="$t('deforestation.dueDeligenceStatus')" @change="filterData" outlined dense>
              </v-select>
            </div>

            <v-spacer></v-spacer>
            <div class="py-1 title">
              {{ reportOptions.page }} -
              {{ totalDiligenceReportsPages }} {{ $t('of') }}
              {{ totalDiligenceReports }}
            </div>
            <v-btn class="mx-2" fab small outlined color="primary" :disabled="reportOptions.page <= 1"
              @click="reportPageChange(false)">
              <v-icon dark>
                mdi-chevron-left
              </v-icon>
            </v-btn>
            <v-btn class="mx-2" fab small outlined color="primary"
              :disabled="reportOptions.page >= totalDiligenceReportsPages" @click="reportPageChange(true)">
              <v-icon dark>
                mdi-chevron-right
              </v-icon>
            </v-btn>
            <v-menu v-model="document" :close-on-content-click="false" :nudge-width="200" left :min-width="417">
              <template v-slot:activator="{ on, attrs }">
                <v-btn class="mx-2" fab small outlined color="primary" v-bind="attrs" v-on="on">
                  <v-icon dark> mdi-cog-outline </v-icon>
                </v-btn>
              </template>

              <v-card width="417">
                <v-list>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>{{
                        $t("deforestation.customization")
                      }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider></v-divider>
                  <div class="pl-3 pt-2 font-weight-normal">
                    {{ $t("deforestation.recordsPerpage") }}
                  </div>
                  <v-list-item>
                    <v-list-item-content>
                      <v-slider v-model="itemsPerPageSlider" :tick-labels="itemsPerPageOptions" :max="3" step="1"
                        ticks="always" tick-size="4"></v-slider>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider class="mt-n3"></v-divider>
                </v-list>
                <v-card-text>
                  <v-container fluid>
                    <v-row>
                      <v-col class="mt-n9" cols="12" v-for="header in reportHeaders" :key="header.value">
                        <v-checkbox v-if="header.text" v-model="selectedHeaders" :label="header.text" color="primary"
                          :value="header.text" hide-details>
                        </v-checkbox>
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

            <v-tooltip top color="black" max-width="350">
              <template v-slot:activator="{ on, attrs }">
                <v-btn class="mx-2" fab small outlined color="primary" v-bind="attrs" v-on="on"
                  @click="exportToPDF('document')">
                 <v-icon color="primary">mdi-download</v-icon>
                </v-btn>
              </template>

              <span>
                {{ $t("deforestation.download") }}
              </span>
            </v-tooltip>
            <v-tooltip top color="black" max-width="350">
              <template v-slot:activator="{ on, attrs }">
                <v-btn class="mx-2" fab small outlined color="primary" v-bind="attrs" v-on="on"
                  @click="printPDF('document')">
                  <v-icon dark> mdi-printer </v-icon>
                </v-btn>
              </template>
              <span>
                {{ $t("deforestation.print") }}
              </span>
            </v-tooltip>
          </div>
        </template>

        <template v-slot:item.status="{ item }">
          <div class="d-flex">
              
              <v-btn small rounded min-width="160" depressed class="blue-button" height="34"
                v-if="item.status == 'Uploaded to EU Portal'">
                {{ $t("deforestation.uploadedToEU") }}
              </v-btn>

              <v-btn small rounded min-width="160" depressed class="gray-button" height="34"
                v-if="item.status == 'Pending'">
                {{ $t("deforestation.pending") }}
              </v-btn>
              <v-btn small rounded min-width="160" depressed class="orange-button" height="34"
                v-if="item.status == 'Under Review'">
                {{ $t("deforestation.underReview") }}
              </v-btn>

              <v-btn small rounded min-width="160" depressed class="green-button" height="34"
                v-if="item.status == 'Compliant'">
                {{ $t("deforestation.compliant") }}
              </v-btn>

              <div class="status-with-action d-flex" v-if="item.status.toLowerCase() == 'processing farms'">
                <v-btn small rounded min-width="160" depressed class="orange-button" height="34">
                  {{ $t("deforestation.processingFarm") }}
                </v-btn>
                &nbsp;
                <v-btn  v-on:click="handleRefreshDueDiligence" color="primary" fab outlined small>
                  <v-icon  dark>mdi mdi-sync</v-icon>
                </v-btn>
              </div>

              <div class="d-flex" v-if="item.status.toLowerCase() == 'analyzing deforestation'">
                <v-btn small rounded min-width="160" depressed class="orange-button" height="34"
                  >
                  {{ $t("deforestation.analyzeDeforestation") }}
                </v-btn>
                  &nbsp;
                  <v-btn  v-on:click="handleRefreshDueDiligence" color="primary" fab outlined small>
                    <v-icon  dark>mdi mdi-sync</v-icon>
                  </v-btn>
                </div>

              <v-btn small rounded min-width="160" depressed class="orange-button" height="34"
                v-if="item.status.toLowerCase() == 'writing to blockchain'">
                {{ $t("dueDiligence.writingToBlockchain") }}
              </v-btn>

              <v-btn small rounded min-width="160" depressed class="blue-button" height="34"
                  v-if="item.status.toLowerCase() == 'ready to proceed'">
                  {{ $t("deforestation.readyToProceed") }}
                </v-btn>


              <v-btn small rounded min-width="160" depressed class="red-button" height="34"
                v-if="item.status == 'Non-Compliant'">
                {{ $t("deforestation.nonCompliant") }}
              </v-btn>

              <v-btn small rounded min-width="160" depressed class="green-button" height="34"
                v-if="item.status == 'Mitigation Required'">
                {{ $t("deforestation.mitigationRequired") }}
              </v-btn>

              <!-- <v-spacer></v-spacer> -->
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <div v-bind="attrs" v-on="on">
                    <img class="ml-1" :src="isIndonesianClient ? '/img/id/todo-list.svg' : isKenyaClient ? '/img/ke/todo-list.svg' : '/icons/todo-list.png'" v-if="hideOnPrint===false"
                      style="width: 34px; height: 34px; border-radius: 50%;cursor:pointer"
                      @click="redirectToExporterSummary(item.id)" />
                  </div>
                </template>
                <span>{{ $t('dueDiligence.viewReport') }}</span>
              </v-tooltip>

               <!-- Shipment Indicator -->
               <v-tooltip bottom v-if="isReportInShipment(item)">
                  <template v-slot:activator="{ on, attrs }">
                    <div v-bind="attrs" v-on="on">
                      <img class="ml-1" src="/icons/dds/shipment.svg" 
                            style="width: 34px; height: 34px; border-radius: 50%;cursor:pointer"
                            @click="viewShipmentDetails(item)" />
                    </div>
                  </template>
                  <span>{{ $t('deforestation.shipmentInProcess') }}</span>
                </v-tooltip>
            </div>
          <!-- <div class="d-flex">
            <v-btn small rounded min-width="200" depressed class="blue-button" height="34">
              {{ $t(item.status) }}
            </v-btn>
          </div>
          <div class="d-flex align-center justify-center">
            <v-tooltip bottom v-if="isReportInShipment(item)">
              <template v-slot:activator="{ on, attrs }">
                <div v-bind="attrs" v-on="on" class="d-flex align-center">
                  <img src="/icons/dds/shipment.svg" 
                       style="width: 24px; height: 24px; border-radius: 50%; cursor: pointer;"
                       @click="viewShipmentDetails(item)" />
                  <span class="ml-2 text-caption">{{ $t('deforestation.shipmentInProcess') }}</span>
                </div>
              </template>
              <span>{{ $t('dueDiligence.alreadyInShipment') }}</span>
            </v-tooltip>
          </div> -->
        </template>
        


        <template v-slot:item.sn="{ item }">
          <v-tooltip bottom v-if="isReportInShipment(item)">
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
                <v-checkbox 
                  multiple 
                  v-model="selected" 
                  :value="item" 
                  style="margin:0px;padding:0px" 
                  hide-details
                  :disabled="true"
                  @change="handleCheckboxChange" 
                />
              </div>
            </template>
            <span>{{ $t('dueDiligence.alreadyInShipment') }}</span>
          </v-tooltip>
          <v-checkbox 
            v-else
            multiple 
            v-model="selected" 
            :value="item" 
            style="margin:0px;padding:0px" 
            hide-details
            @change="handleCheckboxChange" 
          />
        </template>


        <template v-slot:item.internalReferenceNumber="{ item }">
          <div>
            {{ item.internalReferenceNumber }}
          </div>
        </template>

        <!--        <template v-slot:item.noOfFarms="{ item }">-->
        <!--          <div>-->
        <!--            {{ item.productionPlaceCount }}-->
        <!--          </div>-->
        <!--        </template>-->


        <template v-slot:item.action="{ item }">
          <div class="d-flex justify-center">
            <!--            <v-btn :disabled="item.status === 'Pending'" x-small fab color="primary" @click="-->
            <!--        $router.push({-->
            <!--          name: 'EudrAssessmentReport',-->
            <!--          params: { id: item.id, type: 'assignment' },-->
            <!--        })-->
            <!--        ">-->
            <!--              &lt;!&ndash; @click="$router.push({name: 'ActivationKeyGroupList',params: { groupId: item.id },})" &ndash;&gt;-->
            <!--              <v-icon>mdi-share</v-icon>-->
            <!--            </v-btn>-->
            <v-btn class="ml-2" x-small fab color="primary" @click="duplicateDiligenceReports(item.id)">
              <!-- @click="$router.push({name: 'ActivationKeyGroupList',params: { groupId: item.id },})" -->
              <v-icon style="color: #fff !important">mdi-content-duplicate</v-icon>
            </v-btn>
            <v-btn class="ml-2" x-small fab color="primary" v-if="!isIndonesianClient" @click="deleteDiligenceReports(item.id)">
              <v-icon style="color: #fff !important">mdi-trash-can</v-icon>
            </v-btn>
          </div>
        </template>

        <template v-slot:footer></template>
      </v-data-table>
      <template>
        <div class="d-flex mt-5" style="align-items: center;">
          <v-spacer></v-spacer>
          <img :src="isIndonesianClient ? '/img/id/todo-list.svg' : isKenyaClient ? '/img/ke/todo-list.svg' : '/icons/todo-list-en.png'" style="width: 34px; height: 34px; border-radius: 50%;" />
          <span class="ml-2">{{ $t("dueDiligence.viewReport") }}</span>

          <!--          <v-icon class="ml-5 green-shadow">m-icon>mdi-share</v-icon>-->
          <!--          <span class="ml-2">{{ $t("dueDiligence.share") }}</span>-->

          <v-icon class="ml-5 green-shadow primary--text">mdi-content-duplicate</v-icon>
          <span class="ml-2">{{ $t("dueDiligence.copy") }}</span>

          <v-icon class="ml-5 green-shadow primary--text">mdi-trash-can</v-icon>
          <span class="ml-2">{{ $t("delete") }}</span>
        </div>
      </template>
      
      <!-- Status Legend for Shipment Creation -->
      <template v-if="isIndonesianClient || isDdsExporter || isSupplierOwner">
            <StatusLegends :isDdsExporter="isDdsExporter" />
          </template>
    </v-col>
  </v-row>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";
import download from "@/mixins/DownloadMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import DateMixin from "@/mixins/DateMixin";
import DeforestationService from "@/_services/DeforestationService";
import { getCountries } from "country-state-picker";
import printJS from "print-js";
import html2pdf from "html2pdf.js";
import { currentRoles, isIndonesianClient, isKenyaClient, isDdsExporter } from "@/utils";
import StatusLegends from "../../../components/StatusLegends.vue";
export default {
  created() {
    this.getDeforestationEUDR();
  },
  watch: {
    options: {
      handler(opt) {
        this.getDeforestationEUDR(opt);
      },
      deep: true,
    },
  },
  components: {
    StatusLegends
  },
  mounted() {
    this.tableHeaders = this.reportHeaders;
  },
  computed: {
    isDdsExporter() {
      return isDdsExporter();
    },
    isIndonesianClient() {
      return isIndonesianClient();
    },
    isKenyaClient() {
      return isKenyaClient();
    },
    getCurrentUser() {
      return this.$store.getters.getUser
    },
    // Filter out reports that are already in shipments
    availableReports() {
      return this.diligenceReports.filter(report => !this.isReportInShipment(report));
    },
  },
  data() {
    return {
      sortBy: [],
      sortDesc: [],
      menu: false,
      document: "",
      countryModel: "",
      statusModel: "",
      regionModel: "",
      countries: [{ name: "All Countries" }, ...getCountries()],
      allStatus: [
        { text: this.$t("deforestation.allStatus"), val: "" },
        { text: this.$t("deforestation.assessmentIssued"), val: "REQUESTED" },
        {
          text: this.$t("deforestation.certificateIssued"),
          val: "CERTIFICATE_READY",
        },
      ],
      allRegions: [{ text: this.$t("deforestation.allRegions"), val: "" }],

      deforestationComplianceReports: [],
      copyReport: [],
      loading: true,
      totalDeforestationComplianceReports: 0,
      tab: 0,
      selectedItem: false,
      reportOptions: {
        itemsPerPage: 10,
        page: 1,
        sortBy: [],
        sortDesc: [],
      },
      itemsPerPageOptions: [5, 10, 25, 50],
      itemsPerPageSlider: 10,
      search: "",
      reportSearch: "",
      reportCountry: "",
      reportStatus: "",
      from: 0,
      to: 0,
      reportHeaders: [
        {
          text: this.$t('deforestation.check'),
          unique: 'eudr-1',
          align: "start",
          value: "sn",
          class: "black--text",
          sortable: false,
          width: "10px",
        },
        {
          text: isKenyaClient ? this.$t("deforestation.internalRefNoKenya"):  this.$t("deforestation.eudrRefNo"),
          align: "start",
          unique: 'eudr-2',
          value: "EUDRReferenceNumber",
          class: "black--text",
          sortable: false,
          width: "160px",
        },
        {
          text: this.$t("deforestation.internalRefNo"),
          align: "start",
          value: "internalReferenceNumber",
          unique: 'eudr-3',
          sortable: false,
          class: "black--text",
          width: "200px",
        },
        {
          text: this.$t("deforestation.activity"),
          align: "start",
          value: "activity",
          unique: 'eudr-5',
          class: "black--text",
          sortable: true,
          width: "110px",
        },

        {
          text: this.$t("deforestation.product"),
          align: "start",
          value: "product",
          unique: 'eudr-5',
          class: "black--text",
          sortable: true,
          width: "110px",
        },
        {
          text: this.$t("deforestation.noOfFarms"),
          align: "start",
          value: "noOfFarms",
          class: "black--text",
          unique: 'eudr-6',
          sortable: true,
          width: "150px",
        },
        {
          text: this.$t("deforestation.quantity"),
          align: "start",
          value: "productNetMass",
          unique: 'eudr-7',
          class: "black--text",
          sortable: true,
          width: "100px",
        },
        // {
        //   text: this.$t("deforestation.country"),
        //   align: "start",
        //   value: "countryOfEntry",
        //   unique: 'eudr-8',
        //   class: "black--text",
        //   sortable: true,
        //   width: "100px",
        // },
        {
          text: this.$t("deforestation.submissionDate"),
          align: "center",
          value: "createdAt",
          unique: 'eudr-9',
          class: "black--text",
          sortable: true,
          width: "100px",
        },
        {
          text: this.$t("deforestation.status"),
          align: "center",
          value: "status",
          unique: 'eudr-10',
          class: "black--text",
          sortable: false,
          width: "150px",
        },
        {
          text: this.$t('dueDiligence.actions'),
          align: "center",
          unique: 'eudr-11',
          value: "action",
          class: "black--text",
          sortable: false,
          width: "150px",
        },
      ],
      tableHeaders: [],
      selectedHeaders: [],
      selected: [],
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: false,
          to: { name: "Users" },
          exact: true,
        },
        {
          text: this.$t("deforestation.eudrForestAssessment"),
          disabled: true,
          href: "breadcrumbs_link_1",
        },
      ],
      diligenceReports: [],
      totalDiligenceReports: 0,
      totalDiligenceReportsPages: 0,
      reportTotalPages: 0,
      customizeMenu: false,
      customizeMenuAll: false,
    };
  },
  methods: {
    async resetDefaut() {
      this.tableHeaders = this.reportHeaders;
      this.selectedHeaders = this.allSelectedHeaders;
      this.reportOptions.itemsPerPage = 10
      this.menu = false;
      await this.getDeforestationEUDR()
    },
    async resetTableStructure() {
      this.reportOptions.itemsPerPage = this.itemsPerPageOptions[this.itemsPerPageSlider];
      if (this.selectedHeaders.length) {
        this.tableHeaders = this.reportHeaders.filter((header) =>
          this.selectedHeaders.includes(header.text)
        );
      }
      await this.getDeforestationEUDR();
      this.customizeMenu = false
      this.customizeMenuAll = false;
    },
    visibleCheck(param) {
      const isParams = this.tableHeaders.filter(x => x.unique == param)
      return isParams.length ? true : false
    },
    async exportToPDF() {
      this.startLoading();
      const element = document.querySelector(".v-data-table__wrapper");
      html2pdf(element, {
        margin: 1,
        filename: "DiligenceReport.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { dpi: 200, letterRendering: true },
        jsPDF: {
          unit: "in",
          format: "letter",
          orientation: "landscape",
          compress: false,
        },
      });
      this.stopLoading();
    },
    async printPDF() {
      const element = document.querySelector(".v-data-table__wrapper");
      let opt = {
        margin: 1,
        filename: "DiligenceReport.pdf",
        image: { type: "jpeg", quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
      };

      let worker = await html2pdf()
        .set(opt)
        .from(element)
        .toCanvas()
        .outputPdf("blob", "DiligenceReport.pdf");
      let file = new File([worker], "DiligenceReport.pdf", {
        type: "application/pdf",
      });
      var pdfUrl = await URL.createObjectURL(file);
      await printJS({ printable: `${pdfUrl}`, type: "pdf", showModal: true });
    },

    filterData() {
      this.reportOptions.page = 1;
      this.getDeforestationEUDR();
    },
    searchQuery() {
      this.reportOptions.page = 1;
      this.getDeforestationEUDR();
    },
    sanitizeIncommingData(rows) {
      const newArray = rows.map(x => {
        return {
          id: x.id,
          EUDRReferenceNumber: x.EUDRReferenceNumber,
          internalReferenceNumber: x.internalReferenceNumber,
          product: x.product_detail.name,
          activity: x.activity,
          noOfFarms: x.productionPlaceCount,
          geofenceArea: x.geofenceArea,
          countryOfEntry: x.countryOfEntry,
          productNetMass: `${x.productNetMass} kg`,
          createdAt: this.getLocalTimeSlashFormat(x.createdAt),
          status: x.status,
          shipment: x.shipment,
        }
      })
      return newArray
    },
    async getDeforestationEUDR(opt = null) {
      this.loading = true;
      const requestParams = {
        page: this.reportOptions.page,
        limit: this.reportOptions.itemsPerPage,
        searchPhrase: this.reportSearch,
        country: this.reportCountry,
        status: this.reportStatus,
        cfroles:currentRoles()
      };

      if (opt?.sortBy?.length) {
        requestParams.orderField = opt.sortBy[0];
        requestParams.order = opt.sortDesc[0] ? "DESC" : "ASC";
      }
      DeforestationService.getDiligenceReports(requestParams)
        .then((res) => {
          this.diligenceReports = this.sanitizeIncommingData(res.data.diligenceReports.rows);
          this.totalDiligenceReports = res.data.diligenceReports.totalCount;

          this.totalDiligenceReportsPages = Math.ceil(
            this.totalDiligenceReports / this.reportOptions.itemsPerPage
          );
          this.fromDiligenceReports =
            (this.reportOptions.page - 1) * this.reportOptions.itemsPerPage + 1;
          this.toDiligenceReports =
            this.reportOptions.page * this.reportOptions.itemsPerPage -
            (this.reportOptions.itemsPerPage -
              res.data.diligenceReports.rows.length);
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          console.log("Error", err);
        });
    },
    async deleteDiligenceReports(id) {
      this.loading = true;

      DeforestationService.deleteDiligenceReport(parseInt(id))
        .then(() => {
          this.getDeforestationEUDR();
          this.$notify({
            text: this.$t('deforestation.reportDeletedSuccessfully'),
            type: "success",
          });
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.$notify({
            text: err,
            type: "error",
          });
          console.log("Error", err);
        });
    },

    async duplicateDiligenceReports(id) {
      this.loading = true;
      DeforestationService.duplicateDiligenceReport(parseInt(id))
        .then(() => {
          this.getDeforestationEUDR();
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.$notify({
            text: err,
            type: "error",
          });
          console.log("Error", err);
        });
    },

    selectItem(item) {
      this.selectedItem = item;
    },
    resetSearchOnEmpty() {
      this.search = "";
      this.countryModel = "";
      this.statusModel = "";
      this.regionModelregionModel = "";
      this.options = {
        page: 1,
        limit: 10,
      };
      this.getDeforestationEUDR();
    },
    reportPageChange(t) {
      if (t) this.reportOptions.page = this.reportOptions.page + 1;
      else this.reportOptions.page = this.reportOptions.page - 1;
      this.getDeforestationEUDR();
    },
    handleCheckboxChange(item) {
      const poupItem = item.map(x => {
        return { due_deligence_report_id: parseInt(x.id) }
      })
      this.$emit('handleCheckboxChange', poupItem)
    },
    navigateReportView(item) {
      if (item.status == 'Pending') {
        this.$router.push({ name: 'createDueDiligenceReports', params: { id: item.id, show: 'show' } })
      }
    },
    
    // Check if a report is already in a shipment
    isReportInShipment(item) {
      return item.shipment && item.shipment.length > 0;
    },
    
    // View shipment details for a report
    viewShipmentDetails(item) {
      if (item.shipment && item.shipment.length > 0) {
        const shipmentId = item.shipment[0].id;
        this.$router.push({ 
          name: 'shipmentDetail', 
          params: { id: shipmentId } 
        });
      }
    }
  },
  mixins: [loadingMixin, download, getPermittedActions, DateMixin],
};
</script>

<style lang="scss" scoped>
// ::v-deep .v-data-table-header {
//   background-color: #FFB443 !important;
// }

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
</style>