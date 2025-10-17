<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div id="shippingDetails">
        <div class="d-flex mb-4">
          <h2>Shipment: SHP-{{ getShippmentNo }}</h2>
          <v-spacer></v-spacer>
          <div data-html2canvas-ignore="true" class="status ml-10 mt-n6">
            <label>
              {{ $t("deforestation.shipmentStatus") }}
            </label> &nbsp;
            <v-select :items="shipmentStatus" :placeholder="$t('select')" item-text="text" item-value="val" dense
              outlined v-model="statusModel" style="max-width:175px" class="mr-5 "
              @change="handleStatusChange"></v-select>
          </div>
          <v-btn data-html2canvas-ignore="true" color="primary" @click="$router.go(-1)" outlined class="mr-2">
            {{ $t('back') }}
          </v-btn>
          <v-btn data-html2canvas-ignore="true" class="primary" dark @click="downloadDetailsPage">
            <v-icon left style="color: #fff !important;">mdi-download</v-icon>
            <span>
              {{ $t("deforestation.download") }}
            </span>
            <v-icon right style="color: #fff !important;">mdi-menu-down</v-icon>
          </v-btn>
        </div>
        <v-card elevation="0" class="px-5 mb-5">
          <v-card-text>
            <v-row class="mb-5">
              <v-col class="d-flex flex-column" style="flex: 1 1 20%;">
                <div>{{ $t('deforestation.exporter') }}</div>
                <div class="value">{{ shipment.exporter }}</div>
              </v-col>
              <v-col class="d-flex flex-column" style="flex: 1 1 20%;">
                <div>{{ $t('deforestation.importer') }}</div>
                <div class="value">{{ shipment.importer }}</div>
              </v-col>
              <v-col class="d-flex flex-column" style="flex: 1 1 20%;">
                <div>{{ $t('deforestation.shipmentReferenceNo') }}</div>
                <div class="value">{{ shipment.shipment_refrence_number }}</div>
              </v-col>
              <v-col class="d-flex flex-column" style="flex: 1 1 20%;">
                <div>{{ $t('deforestation.ownerShipType') }}</div>
                <div class="value">{{ shipment.ownership_type }}</div>
              </v-col>
              <v-col class="d-flex flex-column" style="flex: 1 1 20%;">
                <div>{{ $t('deforestation.buyer') }}</div>
                <div class="value">{{ shipment.buyer }}</div>
              </v-col>
            </v-row>
            <v-row class="mb-5">
              <v-col class="d-flex flex-column" style="flex: 1 1 20%;">
                <div>{{ $t('deforestation.port_of_origin') }}</div>
                <div class="value">{{ shipment.part_of_origin }}</div>
              </v-col>
              <v-col class="d-flex flex-column" style="flex: 1 1 20%;">
                <div>{{ $t('deforestation.port_of_destination') }}</div>
                <div class="value">{{ shipment.part_of_destination }}</div>
              </v-col>
              <v-col class="d-flex flex-column" style="flex: 1 1 20%;">
                <div>{{ $t('deforestation.no_of_stops') }}</div>
                <div class="value">
                  {{ noOfStops }}
                  <a style="text-decoration: underline; font-size: 14px" class="ml-5" @click="showStops">
                    {{ $t('deforestation.viewStops') }}
                  </a>
                </div>
              </v-col>
              <v-col class="d-flex flex-column" style="flex: 1 1 20%;">
                <div>{{ $t('deforestation.shipping_line') }}</div>
                <div class="value">{{ shipment.shipping_line }}</div>
              </v-col>
              <v-col class="d-flex flex-column" style="flex: 1 1 20%;">
                <div>{{ $t('deforestation.expected_arrival_date') }}</div>
                <div class="value">{{ formatDate(shipment.expected_arrival_date) }}</div>
              </v-col>
            </v-row>
            <v-row class="mb-5">
              <v-col class="d-flex flex-column" style="flex: 1 1 20%;">
                <div>{{ $t('deforestation.container_id') }}</div>
                <div class="value">{{ shipment.container_id }}</div>
              </v-col>
              <v-col class="d-flex flex-column" style="flex: 1 1 20%;">
                <div>{{ $t('deforestation.container_type') }}</div>
                <div class="value">{{ shipment.container_type }}</div>
              </v-col>
              <v-col class="d-flex flex-column" style="flex: 1 1 20%;">
                <div>{{ $t('deforestation.container_size') }}</div>
                <div class="value">{{ shipment.container_size }}</div>
              </v-col>
              <v-col class="d-flex flex-column" style="flex: 1 1 20%;">
                <div>{{ $t('deforestation.container_capacity') }}</div>
                <div class="value">{{ shipment.container_capacity }}</div>
              </v-col>
              <v-col class="d-flex flex-column" style="flex: 1 1 20%;">
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-card elevation="0" class="px-5">
          <v-card-text>
            <div class="d-flex" style="margin-top: 20px;">
              <p class="heading-title">
                {{ $t('dueDiligence.dueDiligenceReports') }}
                <v-tooltip top color="00BD73" max-width="350">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                      mdi-alert-circle
                    </v-icon>
                  </template>
                  <span>{{ $t('dueDiligence.dueDiligenceReports') }}</span>
                </v-tooltip>
              </p>
              <v-spacer></v-spacer>
            </div>








            <v-data-table :headers="tableHeaders" :items="diligenceReports" :items-per-page="10" :footer-props="{
              'items-per-page-options': [10, 25, 50],
            }" hide-default-footer :loading="loading" :header-props="headerProps" :options.sync="reportOptions"
              :server-items-length="totalDiligenceReports" :loading-text="$t('loadingData')
                ">
              <template v-slot:top="{}">
                <div data-html2canvas-ignore="true" class="d-flex mt-5">
                  <div class="ml-3" style="width: 280px;">
                    <label>{{ $t("deforestation.eudr_reference_number") }}</label>
                    <v-tooltip top color="00BD73" max-width="350">
                      <template v-slot:activator="{ on, attrs }">
                          <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                          mdi-alert-circle
                          </v-icon>
                      </template>
                      <span>{{ $t("deforestation.eudrRefNoInfo") }}</span>
                  </v-tooltip>
                    <v-text-field style="width: 290px; " prepend-inner-icon="mdi-magnify" outlined height="5px"
                      :placeholder="$t('search')" dense v-model="reportSearch" @input="searchQuery">
                    </v-text-field>
                  </div>

                  <div class="ml-3" style="width: 280px;">
                    <label for="text">{{ $t('status') }}</label>
                    <v-tooltip top color="00BD73" max-width="350">
                      <template v-slot:activator="{ on, attrs }">
                          <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                          mdi-alert-circle
                          </v-icon>
                      </template>
                      <span>{{ $t("deforestation.statusInfo") }}</span>
                  </v-tooltip>
                    <v-select v-model="reportStatus" item-text="text" item-value="val" :items="allStatus"
                      @change="filterData" outlined dense>
                    </v-select>
                  </div>


                  <v-spacer></v-spacer>
                  <div class="py-1 title">
                    {{ from }} - {{ to }} of
                    {{ totalDiligenceReports }}
                  </div>
                  <v-btn class="mx-2" fab small outlined color="primary" :disabled="reportOptions.page <= 1"
                    @click="reportPageChange(false)">
                    <v-icon dark>
                      mdi-chevron-left
                    </v-icon>
                  </v-btn>
                  <v-btn class="mx-2" fab small outlined color="primary"
                    :disabled="reportOptions.page >= reportTotalPages" @click="reportPageChange(true)">
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
                            <v-col class="mt-n9" cols="6" v-for="header in reportHeaders" :key="header.value">
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
                        <v-icon dark> mdi-download </v-icon>
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

              <template v-slot:[`item.noOfFarms`]="{ item }">
                {{ item.dueDiligenceProductionPlaces.length }}
              </template>
              <template v-slot:[`item.productNetMass`]="{ item }">
                {{ item.productNetMass }} kg
              </template>

              <template v-slot:[`item.createdAt`]="{ item }">
                {{ getLocalTimeSlashFormat(item.createdAt) }}
              </template>

              <template v-slot:[`item.dueDeligenceStatus`]="{ item }">
                <div class="d-flex">
                  <v-btn small rounded min-width="200" depressed class="blue-button" height="34">
                    {{ $t(item.status) }}
                  </v-btn>
                </div>
              </template>

              <template v-slot:[`item.id`]="{ item }">
                <div class="d-flex">
                  <img class="ml-1" :src="isIndonesianClient ? '/img/id/todo-list.svg' : '/icons/todo-list.png'" style="width: 34px; height: 34px; border-radius: 50%;"
                    @click="viewReport(item.id)" />
                </div>
              </template>

              <template v-slot:footer></template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </div>

      <v-dialog width="40%" @click:outside="hideStops" :retain-focus="false" v-model="showStopModal">
        <v-card class="custom-card" rounded="0">
          <v-toolbar color="primary" class="white--text">
            <v-toolbar-title class="font-weight-bold">
              Stops
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon class="white--text" @click="hideStops">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>

          <v-card-text class="black--text">
            <div class="my-8 ">
              <h2 class="font-weight-bold">Total Stops: {{ noOfStops }}</h2>
            </div>






            <v-row>
              <v-col cols="12" v-for="(stop, index) in stops" :key="index">
                <v-sheet class="stop-items">
                  <v-list-item>
                    <v-list-item-avatar>
                      <v-avatar color="green" size="40">
                        <span class="white--text">{{ index + 1 }}</span>
                      </v-avatar>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title class="font-weight-bold">{{ stop.title }}</v-list-item-title>
                      <v-list-item-subtitle>{{ stop.address }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-sheet>
              </v-col>
            </v-row>





            <v-card-actions class="mt-10" style="padding-right: 0">
              <v-spacer></v-spacer>
              <v-btn class="mr-2" right height="44" width="116" depressed color="primary" @click="hideStops">
                {{ $t("close") }}
              </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import download from "@/mixins/DownloadMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import DateMixin from '@/mixins/DateMixin';
import DeforestationService from "@/_services/DeforestationService";
import printJS from "print-js";
import html2pdf from "html2pdf.js";
import { isIndonesianClient, isKenyaClient, currentRoles } from "@/utils";
export default {
  created() {
    this.fetchData()
  },
  computed: {
    totalPages() {
      return 1
    },
    getCurrentUser() {
      return this.$store.getters.getUser
    },
    getShippmentNo() {
      return parseInt(this.$route.params.id)
    },
    isIndonesianClient() {
      return isIndonesianClient()
    },
    isKenyaClient() {
      return isKenyaClient()
    },
  },

  mounted() {
    this.tableHeaders = this.reportHeaders;
    this.selectedHeaders = this.allSelectedHeaders;
  },
  watch: {
    reportOptions: {
      async handler() {
        await this.getDeforestationEUDR()
      },
      deep: true,
    },
  },

  data() {
    return {
      shipment: null,
      headerProps: {
        'sort-icon': 'mdi-menu-up'
      },
      stops: [],
      noOfStops: 0,
      shipmentInput: null,
      shipment_status: null,
      id: null,
      shipment_id: null,
      showStopModal: false,
      loading: false,
      totalShipments: 2,
      tab: 0,
      selectedItem: false,
      options: {
        itemsPerPage: 10,
        page: 1
      },
      search: "",
      from: 0,
      to: 0,
      totalDiligenceReports: 0,
      totalDiligenceReportsPages: 0,
      selectedHeaders: [],
      diligenceReports: [],
      tableHeaders: [],
      reportStatus: "",
      reportSearch: "",
      reportHeaders: [
        {
          text: isKenyaClient ? this.$t("deforestation.internalRefNoKenya"): this.$t("deforestation.eudrReferenceNo"),
          align: "start",
          value: "EUDRReferenceNumber",
          class: "black--text",
          sortable: true,
          width: "150px",
        },
        {
          text: this.$t("deforestation.internalReferenceNo"),
          align: "start",
          value: "internalReferenceNumber",
          class: "black--text",
          width: "150px",
          sortable: true,
        },

        {
          text: this.$t("deforestation.activity"),
          align: "start",
          value: "activity",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("deforestation.product"),
          align: "start",
          value: "product",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("deforestation.noOfFarms"),
          align: "start",
          value: "noOfFarms",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("deforestation.quantity"),
          align: "start",
          value: "productNetMass",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("deforestation.submissionDate"),
          align: "start",
          value: "createdAt",
          class: "black--text",
          sortable: false,
        },
        {
          text: this.$t("deforestation.status"),
          align: "center",
          value: "dueDeligenceStatus",
          class: "black--text",
          sortable: false,
        },
        {
          text: "",
          align: "start",
          value: "id",
          class: "black--text",
          sortable: false,
        },
      ],
      reportOptions: {
        itemsPerPage: 10,
        page: 1,
      },
      allStatus: [
        { text: this.$t("deforestation.allStatus"), val: "" },
        {
          text: this.$t("deforestation.uploadedToEU"),
          val: "Uploaded to EU Portal",
        },
        { text: this.$t("deforestation.pending"), val: "Pending" },
        { text: this.$t("deforestation.underReview"), val: "Under Review" },
      ],

      shipmentStatus: [
        {
          text: this.$t("deforestation.enRoute"),
          val: "En Route",
        },
        { text: this.$t("deforestation.delivered"), val: "Delivered" },
      ],
      statusModel: '',
      reportTotalPages: null,
      document: '',
      toDiligenceReports: 0,
      fromDiligenceReports: 0,
      customizeMenu: false,
      customizeMenuAll: false,
      itemsPerPageOptions: [5, 10, 25, 50],
      itemsPerPageSlider: 10,
      allSelectedHeaders: [
        this.$t("deforestation.eudrRefNo"),
        this.$t("deforestation.internalRefNo"),
        this.$t("deforestation.supplier"),
        this.$t("deforestation.product"),
        this.$t("deforestation.noOfFarms"),
        this.$t("deforestation.quantity"),
        this.$t("deforestation.country"),
        this.$t("deforestation.lastUpdated"),
        this.$t("deforestation.dueDeligenceStatus"),
        this.$t('deforestation.actions'),
      ],
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: false,
          exact: true,
        },
        {
          text: this.$t("listOfShipments"),
          disabled: true,
          href: "breadcrumbs_link_1",
        },
        {
          text: this.$t("viewShipment"),
          disabled: true,
          href: "breadcrumbs_link_2",
        },
      ],
    };
  },
  methods: {
    async downloadDetailsPage() {
      this.startLoading();
      const element = document.querySelector("#shippingDetails");
      html2pdf(element, {
        margin: 0,
        filename: "ShippingDetails.pdf",
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 3, letterRendering: true },
        jsPDF: {
          unit: "in",
          format: "letter",
          orientation: "landscape",
          compress: false,
        },
      });
      this.stopLoading();
    },
    async handleStatusChange() {
      try {
        let input = {
          id: parseInt(this.$route.params.id),
          status: this.statusModel
        }
        await DeforestationService.updateStatus(input).then(() => {
          this.fetchData();
        })
      } catch (err) {
        this.error = err.message || this.$t('somethingWentWrong');
        this.$notify({
          title: this.error,
          type: "error",
        });
      }
    },
    async fetchData() {
      await this.getShipmentDetails()
      await this.getDeforestationEUDR()
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
    async resetDefaut() {
      this.tableHeaders = this.reportHeaders;
      this.selectedHeaders = this.allSelectedHeaders;
      this.menu = false;
      await this.getDeforestationEUDR()
    },
    async resetTableStructure() {
      this.tableHeaders = this.reportHeaders.filter((header) =>
        this.selectedHeaders.includes(header.text)
      );
      this.reportOptions.itemsPerPage = this.itemsPerPageOptions[
        this.itemsPerPageSlider
      ];
      await this.getDeforestationEUDR();
      (this.customizeMenu = false), (this.customizeMenuAll = false);
    },

    async getShipmentDetails() {
      try {
        this.startLoading();
        this.id = parseInt(this.$route.params.id);
        this.shipmentInput = { id: this.id, shipment_status: this.shipment_status }
        const res = await DeforestationService.shipmentDetail(this.shipmentInput);
        this.shipment = res.data.shipmentDetail;
        this.shipment_id = this.shipment.id
        this.stops = res.data.shipmentDetail.shipment_stops;
        this.noOfStops = this.stops.length
        this.statusModel = this.shipment.status;
      } catch (err) {
        this.error = err.message || this.$t('somethingWentWrong');
        this.$notify({
          title: this.error,
          type: "error",
        });
      } finally {
        this.stopLoading();
      }
    },

    async getDeforestationEUDR() {
      this.loading = true;
      const requestParams = {
        page: this.reportOptions.page,
        limit: this.reportOptions.itemsPerPage,
        searchPhrase: this.reportSearch,
        country: this.reportCountry,
        status: this.reportStatus,
        shipment_id: parseInt(this.shipment_id),
        cfroles:currentRoles()
      };


      if (this.reportOptions) {
        requestParams.orderField = this.reportOptions.sortBy.length ? this.reportOptions.sortBy[0] : "createdAt";
        requestParams.order = this.reportOptions.sortDesc.length && this.reportOptions.sortDesc[0] ? "DESC" : "ASC";
      }
      DeforestationService.getDiligenceReportsByShipment(requestParams)
        .then((res) => {
          this.diligenceReports = res.data.diligenceReportsByShipment.rows;
          console.dir(this.diligenceReports)
          this.totalDiligenceReports = res.data.diligenceReportsByShipment.totalCount;

          this.totalDiligenceReportsPages = Math.ceil(
            this.totalDiligenceReports / this.reportOptions.itemsPerPage
          );
          this.from = this.totalDiligenceReports > 0
            ? (this.reportOptions.page - 1) * this.reportOptions.itemsPerPage + 1
            : 0;
          this.to = this.reportOptions.page * this.reportOptions.itemsPerPage > this.totalDiligenceReports
            ? this.totalDiligenceReports
            : this.reportOptions.page * this.reportOptions.itemsPerPage;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          console.log("Error", err);
        });
    },

    filterData() {
      this.getDeforestationEUDR();
    },

    reportPageChange(t) {
      if (t) this.reportOptions.page = this.reportOptions.page + 1;
      else this.reportOptions.page = this.reportOptions.page - 1;
      this.getDeforestationEUDR()
    },

    showStops() {
      this.showStopModal = true
    },
    hideStops() {
      this.showStopModal = false
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    },


    selectItem(item) {
      this.selectedItem = item;
    },
    searchQuery() {
      this.getDeforestationEUDR();
    },
    resetSearchOnEmpty() {
      this.search = ''
      this.countryModel = ''
      this.statusModel = ''
      this.regionModelregionModel = ''
      this.options = {
        page: 1,
        limit: 10
      }
    },
    pageChange(t) {
      if (t) this.options.page = this.options.page + 1;
      else this.options.page = this.options.page - 1;
      console.log("true")
    },

    viewReport(id) {
      this.$router.push({ name: 'createDueDiligenceReports', params: { id: id, show: 'show' } })
    }

  },
  mixins: [loadingMixin, download, getPermittedActions, DateMixin],
};
</script>
<style lang="scss" scoped>
.value {
  font-size: 18px;
  font-weight: 700;
  line-height: 22px;
  text-align: left;
  color: #1E1E1E;
  margin-top: 5px;
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

// ::v-deep .v-data-table-header {
//   background-color: #FFB443 !important;
//   color: #1E1E1E;
// }

// ::v-deep .v-data-table-header span {
//   color: #1E1E1E !important;
// }

.heading-title {
  font-weight: 600;
  font-size: 22px;
  color: #1e1e1e;
}

.v-avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
}

.font-weight-bold {
  font-weight: bold !important;
}

.mt-5 {
  margin-top: 20px;
}

.stop-items {
  border: none;
  border-bottom: 1px solid #E1E1E1;
  box-shadow: none;
  padding: 10px 0;
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

.blue-button {
  background-color: #d0e6fe !important;
  /* Green background */
  border: 2px solid #002287 !important;
  /* Red border */
  color: #002287 !important;
}

.gray-button {
  background-color: #e8e8e8 !important;
  /* Green background */
  border: 2px solid #000000 !important;
  /* Red border */
  color: #000000 !important;
}
</style>
