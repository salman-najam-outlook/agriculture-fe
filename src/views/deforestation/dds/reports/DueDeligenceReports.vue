<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-4">
        <h2>{{ $t("deforestation.eudrDueDeligenceReports") }}</h2>
        <v-spacer></v-spacer>
        <v-btn v-if="isOwner" color="primary" dark class="mr-2 mb-2" @click="handleCreateReport">
          {{ $t("deforestation.createNewReport") }}
        </v-btn>
      </div>
      <v-card elevation="0" class="px-5 mt-7">
        <v-card-text>
          <v-row style="margin-left:-30px; margin-bottom: 20px; margin-top: 15px;">
            <v-col cols="12">
               <div v-if="$vuetify && $vuetify.breakpoint.smAndDown">
              <div class="mobile-controls-bar mb-4">
                <div class="mobile-controls-left">
                  <v-text-field 
                    prepend-inner-icon="mdi-magnify" 
                    outlined 
                    dense
                    :placeholder="$t('search')" 
                    v-model="reportSearch" 
                    @input="searchQuery" 
                    class="mobile-search"
                  />
                  <v-select 
                    v-model="reportCountry" 
                    item-text="name"
                    item-value="name" 
                    :items="countries" 
                    :label="$t('deforestation.allCountries')"
                    @change="filterData" 
                    outlined 
                    dense
                    class="mobile-filter"
                  />
                  <v-select 
                    v-model="reportStatus" 
                    item-text="name"
                    item-value="value" 
                    :items="allStatus" 
                    :label="$t('deforestation.dueDeligenceStatus')" 
                    @change="filterData"
                    outlined 
                    dense
                    class="mobile-filter"
                  />
                </div>
              </div>

              <v-row>
                <v-col cols="12" v-for="item in diligenceReports" :key="item.id">
                  <v-card class="mb-3 pa-4 report-card">
                    <div class="d-flex align-center justify-space-between mb-2">
                      <div class="report-title">
                        <span class="font-weight-bold" style="font-size: 1.2rem;">Internal Reference #:</span>
                        <span class="font-weight-bold" style="font-size: 1.2rem;">{{ item.internalReferenceNumber }}</span>
                      </div>
                      <v-menu location="end">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn icon v-bind="attrs" v-on="on">
                            <v-icon>mdi-dots-vertical</v-icon>
                          </v-btn>
                        </template>
                        <v-list>
                          <v-list-item :disabled="checkDisableReport(item)" @click="navigateReportView(item)">
                            <v-list-item-title>{{ $t('dueDiligence.viewReport') }}</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </div>
                    <v-divider class="mb-2"/>
                    <div class="d-flex align-center justify-space-between py-1 report-row">
                      <span class="font-weight-medium">EUDR Reference #:</span>
                      <span>{{ item.EUDRReferenceNumber  || 'N/A' }}</span>
                    </div>
                    <v-divider class="my-1" />
                    <div class="d-flex align-center justify-space-between py-1 report-row">
                      <span class="font-weight-medium">Supplier:</span>
                      <span>{{ getSupplierFullName(item) }}</span>
                    </div>
                    <v-divider class="my-1" />
                    <div class="d-flex align-center justify-space-between py-1 report-row">
                      <span class="font-weight-medium">Product:</span>
                      <span>{{ item.product_detail ? (item.product_detail.code ? item.product_detail.code + '-' : '') : '' }}{{ item.product_detail ? item.product_detail.name : '' }}</span>
                    </div>
                    <v-divider class="my-1" />
                    <div class="d-flex align-center justify-space-between py-1 report-row">
                      <span class="font-weight-medium">Farms:</span>
                      <span>{{ item.productionPlaceCount }}</span>
                    </div>
                    <v-divider class="my-1" />
                    <div class="d-flex align-center justify-space-between py-1 report-row">
                      <span class="font-weight-medium">Quantity:</span>
                      <span>{{ !isNaN(item.productNetMass) ? parseFloat(getConvertedMass(item.productNetMass)) : 0 }} {{ eudrSettings?.product_mass_unit }}</span>
                    </div>
                    <v-divider class="my-1" />
                    <div class="d-flex align-center justify-space-between py-1 report-row">
                      <span class="font-weight-medium">Country:</span>
                      <span>{{ item.countryOfEntry }}</span>
                    </div>
                    <v-divider class="my-1" />
                    <div class="d-flex align-center justify-space-between py-1 report-row">
                      <span class="font-weight-medium">Last Updated:</span>
                      <span>{{ formatDate(item.updatedAt) }}</span>
                    </div>
                    <v-divider class="my-1" />
                    <div class="d-flex align-center justify-space-between py-2 report-row">
                      <span class="font-weight-medium">Due Diligence Status:</span>
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

                      <v-btn small rounded min-width="160" depressed class="orange-button" height="34"
                        v-if="item.status.toLowerCase() == 'processing farms'">
                        {{ $t("deforestation.processingFarm") }}
                      </v-btn>

                      <v-btn small rounded min-width="160" depressed class="gray-button" height="34"
                        v-if="item.status.toLowerCase() == 'analyzing deforestation'">
                        {{ $t("deforestation.analyzeDeforestation") }}
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
                    </div>
                  </v-card>
                </v-col>
              </v-row>

              <div class="mobile-pagination mt-4">
                <div class="d-flex justify-space-between align-center">
                  <span class="mobile-pagination-label">{{ toDiligenceReports }} of {{ totalDiligenceReports }}</span>
                  <div class="mobile-pagination-controls">
                    <v-btn 
                      fab 
                      small 
                      outlined 
                      color="primary" 
                      :disabled="reportOptions.page <= 1"
                      @click="reportPageChange(false)"
                      class="mr-2"
                    >
                      <v-icon dark>mdi-chevron-left</v-icon>
                    </v-btn>
                    <v-btn 
                      fab 
                      small 
                      outlined 
                      color="primary" 
                      :disabled="reportOptions.page >= totalPages"
                      @click="reportPageChange(true)"
                    >
                      <v-icon dark>mdi-chevron-right</v-icon>
                    </v-btn>
                  </div>
                </div>
              </div>
            </div>

              <v-data-table v-else :headers="tableHeaders" :items="diligenceReports" :items-per-page="10" :footer-props="{
                        'items-per-page-options': [10, 25, 50],
                      }" item-key="id" hide-default-footer :loading="loading" :options.sync="reportOptions" :loading-text="$t('loadingData')
                ">
                <template v-slot:top="{ }">
                  <div class="table-controls-bar">
                    <div class="controls-left">
                      <div class="control search">
                        <label for="text">&nbsp;</label>
                        <v-text-field prepend-inner-icon="mdi-magnify" outlined height="5px"
                          :placeholder="$t('search')" dense v-model="reportSearch" @input="searchQuery" class="shrink" />
                      </div>
                      <div class="control filter">
                        <label for="text">{{ $t("country") }}  <v-tooltip top color="00BD73" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon size="16" class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                              mdi-alert-circle
                            </v-icon>
                          </template>
                          <span>{{ $t("deforestation.EUDRcountry") }}</span>
                        </v-tooltip></label>
                        <v-select v-model="reportCountry" item-text="name"
                          item-value="name" :items="countries" :label="$t('deforestation.allCountries')"
                          @change="filterData" outlined dense />
                      </div>
                      <div class="control filter">
                        <label for="text">{{ $t('deforestation.edurDueDeligenceStatus') }}  <v-tooltip top color="00BD73" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon size="16" class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                              mdi-alert-circle
                            </v-icon>
                          </template>
                          <span>{{ $t("deforestation.EUDRDeforestationStatusTT") }}</span>
                        </v-tooltip></label>
                       
                        <v-select v-model="reportStatus" item-text="name"
                          item-value="value" :items="allStatus" :label="$t('deforestation.dueDeligenceStatus')" @change="filterData"
                          outlined dense />
                      </div>
                      </div>
                    <div class="controls-right">
                      <span class="pagination-label">{{ toDiligenceReports }} of {{ totalDiligenceReports }}</span>
                      <v-btn fab small outlined color="primary" :disabled="reportOptions.page <= 1"
                        @click="reportPageChange(false)">
                        <v-icon dark>mdi-chevron-left</v-icon>
                      </v-btn>
                      <v-btn fab small outlined color="primary" :disabled="reportOptions.page >= totalPages"
                        @click="reportPageChange(true)">
                        <v-icon dark>mdi-chevron-right</v-icon>
                      </v-btn>
                      <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" left :min-width="417">
                          <template v-slot:activator="{ on, attrs }">
                              <v-btn fab small outlined color="primary" v-bind="attrs" v-on="on">
                                  <v-icon dark>mdi-cog-outline</v-icon>
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
                                          <v-slider v-model="itemsPerPageSlider" :tick-labels="itemsPerPageOptions" :max="3" step="1" ticks="always" tick-size="4"></v-slider>
                                      </v-list-item-content>
                                  </v-list-item>
                                  <v-divider class="mt-n3"></v-divider>
                              </v-list>
                              <v-card-text>
                                  <v-container fluid>
                                      <v-row>
                                          <v-col class="mt-n9" cols="6" v-for="header in reportHeaders" :key="header.value">
                                              <v-checkbox v-if="header.value" v-model="selectedHeaders" :label="header.text" color="primary" :value="header.value" hide-details></v-checkbox>
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
                      <v-btn fab small outlined color="primary" @click="exportToPDF">
                        <v-icon dark>mdi-tray-arrow-down</v-icon>
                      </v-btn>
                      <v-btn fab small outlined color="primary" @click="printPDF">
                        <v-icon dark>mdi-printer</v-icon>
                      </v-btn>
                    </div>
                  </div>
                </template>
                <template v-if="diligenceReports.length" v-slot:body="{ items }">
                  <tbody>
                    <tr v-for="item in items" :key="item.id" style="position: relative; width: 0; height: 0"
                      @mouseover="selectItem(item)" @mouseleave="selectItem(false)">
                      <template v-for="h in tableHeaders">

                      <td class="text-truncate" :key="h.value + '_eudrAndInternalRefNo'" v-if="h.value == 'eudrAndInternalRefNo'">
                        {{ item.EUDRReferenceNumber + item.EUDRReferenceNumber?'-' + item.internalReferenceNumber: item.internalReferenceNumber }}
                      </td>
                     
                      <td class="text-truncate" :key="h.value + '_supplier'" v-else-if="h.value == 'supplier.firstName'">
                        {{ getSupplierFullName(item) }}
                      </td>

                      <td class="text-truncate" :key="h.value + '_product'" v-else-if="h.value == 'product'">
                        {{ item.product_detail ? (item.product_detail.code ? item.product_detail.code +'-' : "") : '' }}
                        {{ item.product_detail  ? item.product_detail.name  : '' }}
                      </td>

                      <td class="text-truncate" :key="h.value + '_productionPlaceCount'" v-else-if="h.value == 'productionPlaceCount'">
                      {{ item.productionPlaceCount }} <br />
                      {{ !isNaN(item.productNetMass) ? parseFloat(getConvertedMass(item.productNetMass)) : 0 }} {{ eudrSettings?.product_mass_unit }}
                      </td>
                     
                      <td class="text-truncate" :key="h.value + '_countryOfEntry'" v-else-if="h.value == 'countryOfEntry'">
                        {{ item.countryOfEntry }}
                      </td>

                      <td :key="h.value + '_createdAt'" v-else-if="h.value == 'createdAt'" class="text-truncate">
                        {{ getDateFormat(item.createdAt) }}
                      </td>

                      <td :key="h.value + '_status'" v-else-if="h.value == 'status'">
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
                          <v-tooltip bottom v-if="isDdsExporter">
                            <template v-slot:activator="{ on, attrs }">
                              <div v-bind="attrs" v-on="on">
                                <img class="ml-1" :src="isIndonesianClient ? '/img/id/todo-list.svg' : isKenyaClient ? '/img/ke/todo-list.svg' : '/icons/todo-list.png'" v-if="hideOnPrint===false"
                                  style="width: 34px; height: 34px; border-radius: 50%;cursor:pointer"
                                  @click="redirectToExporterSummary(item.id)" />
                              </div>
                            </template>
                            <span>{{ $t('dueDiligence.viewReport') }}</span>
                          </v-tooltip>
                        
                          <template>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                              <div v-bind="attrs" v-on="on">
                                <img class="ml-1" :src="getStatusLegendIconWithRole(item.statusLegends, isDdsExporter)"
                                  style="width: 34px; height: 34px; border-radius: 50%;cursor:pointer" />
                              </div>
                            </template>
                            <span>{{ getStatusLegendTooltipWithRole(item.statusLegends, isDdsExporter) }}</span>
                          </v-tooltip>
                        </template>
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
                      </td>
                      <td :key="h.value + '_updatedAt'" v-else-if="h.value == 'updatedAt'" class="text-truncate">
                        {{ getDateFormat(item.updatedAt) }}
                      </td>
                      <td :key="h.value + '_action'" v-else-if="h.value == 'action'">
                        <div style="position: absolute; right: 50px; top:10px;">
                            <v-menu location="start">
                                <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                    icon
                                    v-bind="attrs"
                                    v-on="on"
                                >
                                    <v-icon>mdi-dots-vertical</v-icon>
                                </v-btn>
                                </template>
                                <v-list>
                                  
                                  <v-list-item @click="navigateReportView(item)">
                                    <v-list-item-title>{{ $t('dueDiligence.viewReport') }}</v-list-item-title>
                                  </v-list-item>
                                    <v-list-item :disabled="!['Compliant', 'Non-Compliant', 'Processing  Farms'].includes(item.status)" @click="redirectToDDSSUmmary(item.id)">
                                        <v-list-item-title>{{ $t('dueDiligence.viewReportSummary') }}</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item :disabled="item.status.startsWith('Processing') || getCurrentRoles.includes('supplier') || getCurrentRoles.includes('operator')" @click="deleteDiligenceReports(item.id)">
                                      <v-list-item-title>{{ $t('delete') }}</v-list-item-title>
                                  </v-list-item>
                                </v-list>
                            </v-menu>
                            </div>
                      </td>
                    </template>
                    </tr>
                  </tbody>
                </template>

                <template v-slot:footer></template>
              </v-data-table>
                
            <!-- Status Legend for Shipment Creation -->
            <template>
              <StatusLegends :isDdsExporter="isDdsExporter" />
            </template>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

   
    </v-container>

    <ConfirmBox 
      :title="confirmDelete.title"
      :message="confirmDelete.message"
      :cancelBtnText="confirmDelete.cancelBtnText" 
      :confirmBtnText="confirmDelete.confirmBtnText"
      :confirmData="confirmDelete.confirmData" 
      :dialog="confirmDeleteDialog" 
      @cancel:action="confirmDeleteDialog = false"
      @continue:action="confirmDeleteDiligenceReport" />
  </div>

  
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import download from "@/mixins/DownloadMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import DateMixin from "@/mixins/DateMixin";
import DeforestationService from "@/_services/DeforestationService";
import { getCountries } from "country-state-picker";
import html2pdf from "html2pdf.js";
import printJS from "print-js";
import ConfirmBox from "@/components/ConfirmBox";
import moment from 'moment';
//import ProfileService from "@/_services/ProfileService";
import UnitService from "@/_services/UnitService";
import RoleMixin from "@/mixins/RoleMixin";
import { mapGetters } from "vuex";
import { currentRoles } from "@/utils";
import { isIndonesianClient, isDdsExporter, isKenyaClient } from "@/utils";
import tableCustomizationMixin from '@/mixins/tableCustomizationMixin';
import StatusLegends from "../../components/StatusLegends.vue";
export default {
  components:{
    ConfirmBox,
    StatusLegends,
  },
  created() {
    const prefs = this.getTablePrefs('DueDiligenceReportsTable');
    if (prefs) {
      this.selectedHeaders = prefs.selectedHeaders;
      const prefIndex = this.itemsPerPageOptions.indexOf(prefs.itemsPerPage);
      this.itemsPerPageSlider = prefIndex > -1 ? prefIndex : 1;
    } else {
      this.selectedHeaders = this.reportHeaders.map(h => h.value).filter(Boolean);
      this.itemsPerPageSlider = 1; 
    }

    this.reportOptions.itemsPerPage = this.itemsPerPageOptions[this.itemsPerPageSlider];
    this.tableHeaders = this.reportHeaders.filter(header =>
      this.selectedHeaders.includes(header.value)
    );

    this.getDeforestationEUDR();
  },
  async mounted() {
    localStorage.removeItem('DDS_TAB_DATA');
    await this.getEudrSettings()
  },
  watch: {
    options: {
      handler(opt) {
        this.getDeforestationEUDR(opt);
      },
      deep: true,
    },
  },
  computed: {
    ...mapGetters("eudrDDS", ["getDdsUserRole"]),
    isIndonesianClient() {
      return isIndonesianClient();
    },
    isKenyaClient() {
      return isKenyaClient()
    },
    isDdsExporter() {
      return isDdsExporter();
    },
    isSupplierOwner() {
        return [ "supplier_owner", "owner"].includes(
          this.getDdsUserRole
        );
      },
    isOwner() {
      return  this.getCurrentRoles.some(x => ["operator_owner","supplier_owner"].includes(x))
      //return ProfileService.checkRole("operator_owner") || ProfileService.checkRole("supplier_owner");
    },
    getOrganizationId() {
        return this.$store.getters.getUser?.user_organization?.id;
    },
    isOperator() {
      return  this.getCurrentRoles.includes("operator_owner")
    },
    isOperatorOnly(){
      return  this.getCurrentRoles.includes("operator")
    },
    isSupplierOnly(){
      return  this.getCurrentRoles.includes("supplier")
    },
    isSupplier() {
      return  this.getCurrentRoles.some(x => ["supplier_owner","supplier"].includes(x))
    },
    reportHeaders(){
      return this.allReportHeaders.map(x => {
        if(x.value == 'eudrAndInternalRefNo'){
           return {
            text: this.isKenyaClient ? this.$t("deforestation.internalRefNoKenya") : this.$t("deforestation.eudrAndInternalRefNo"),
            align: "start",
            value: "eudrAndInternalRefNo",
            class: "black--text",
            sortable: true,
            roles: ["operator_owner","supplier_owner",'supplier','operator',"dds_exporter"]
           }
        }else{
          return x
        }
      }).filter(header => {
        return !header.roles ||  this.getCurrentRoles.some(x => header.roles.includes(x))
      });
    },
    filteredHeaders(){
      return this.tableHeaders.filter((header)=>this.showActionsColumn || header.value !== "actions")
    },
    getSupplierFullName() {
      return (item) => {
        if(this.isSupplier){
          return `${this.$store.getters.getUser.firstName || ''} ${this.$store.getters.getUser.lastName || ''}`.trim();
        }
        const firstName = item.supplier ? item.supplier?.firstName : '';
        const lastName = item.supplier ? item.supplier.lastName : '';
        return `${firstName || ''} ${lastName || ''}`.trim();
      };
    },

  },
  data() {
    return {
      fromDiligenceReports: 0,
      toDiligenceReports: 0,
      countryModel: "",
      statusModel: "",
      regionModel: "",
      reportSearch: "",
      reportCountry: "",
      reportStatus: "",
      countries: [{ name: "All Countries" }, ...getCountries()],
      allStatus: [
         {
          name: this.$t("deforestation.uploadedToEU"),
          value: "Uploaded to EU Portal",
        },
        { name: this.$t("deforestation.pending"), value: "Pending" },
        { name: this.$t("deforestation.underReview"), value: "Under Review" },
        { name: this.$t("deforestation.nonCompliant"), value: "Non-Compliant" },
        { name: this.$t("deforestation.compliant"), value: "Compliant" },
        { 'name': this.$t("deforestation.mitigationRequired"), value: 'Mitigation Required' },
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
      },
      totalPages: 1,
      search: "",
      from: 0,
      to: 0,
      allReportHeaders: [
        {
          text: this.$t("deforestation.eudrAndInternalRefNo"),
          align: "start",
          value: "eudrAndInternalRefNo",
          class: "black--text",
          sortable: true,
          roles: ["operator_owner","supplier_owner",'supplier','operator',"dds_exporter"]
        },
        {
          text: this.$t("deforestation.supplier"),
          align: "start",
          value: "supplier.firstName",
          class: "black--text",
          sortable: true,
          roles: ["operator_owner","supplier_owner",'supplier','operator',"dds_exporter"]
        },
        {
          text: this.$t("deforestation.product"),
          align: "start",
          value: "product",
          class: "black--text",
          sortable: true,
          roles: ["operator_owner","supplier_owner",'supplier','operator',"dds_exporter"]
        },
        {
          text: this.$t("deforestation.farmsAndQuantity"),
          align: "start",
          value: "productionPlaceCount",
          class: "black--text",
          sortable: true,
          roles: ["operator_owner","supplier_owner",'supplier','operator',"dds_exporter"]
        },
        {
          text: this.$t("deforestation.country"),
          align: "start",
          value: "countryOfEntry",
          class: "black--text",
          sortable: true,
          roles: ["operator_owner","supplier_owner",'supplier','operator',"dds_exporter"]
        },
        {
          text: this.$t("deforestation.submissionDate"),
          align: "start",
          value: "createdAt",
          class: "black--text",
          sortable: true,
          roles: ["operator_owner","supplier_owner",'supplier','operator',"dds_exporter"]
        },
        // {
        //   text: this.$t("deforestation.lastUpdated"),
        //   align: "start",
        //   value: "updatedAt",
        //   class: "black--text",
        //   sortable: true,
        //   roles: ["operator_owner","supplier_owner",'supplier','operator']
        // },
        {
          text: this.$t("deforestation.dueDeligenceStatus"),
          align: "start",
          value: "status",
          class: "black--text",
          sortable: true,
          roles: ["operator_owner","supplier_owner",'supplier','operator',"dds_exporter"]
        },
        {
          text: '',
          align: "center",
          value: "action",
          class: "black--text",
          sortable: false,
          width: "150px",
          roles: ["operator_owner","supplier_owner",'supplier','operator']
        },
      ],
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: false,
          to: { name: "Users" },
          exact: true,
        },
        {
          text: this.$t("deforestation.eudrDueDeligenceReports"),
          disabled: true,
          href: "breadcrumbs_link_1",
        },
      ],
      diligenceReports: [],
      totalDiligenceReports: 0,
      totalDiligenceReportsPages: 0,
      showActionsColumn:true,
      selectedHeaders: [],
      tableHeaders: [],
      itemsPerPageOptions: [5, 10, 25, 50],
      itemsPerPageSlider: 1,
      menu: false,
      hideOnPrint:false,
      options: {
        page: 1,
        limit:10
      },
      confirmDeleteDialog : false,
      confirmDelete: {
        title: this.$t("confirmDialog.dueDiligenceReport.delete.title"),
        message: this.$t("confirmDialog.dueDiligenceReport.delete.message"),
        confirmBtnText: this.$t("confirmDialog.dueDiligenceReport.delete.confirmBtn"),
        cancelBtnText: this.$t("cancel"),
        confirmData: {},
      },
      eudrSettings: {},
    };
  },
  methods: {
    checkDisableReport(item) {
      if (!isIndonesianClient) return false;

      const { isOperatorOnly, checkDisabledStatus } = this;
      const { status, statusLegends, hasAdditionalRequest } = item;
      const isApproved = statusLegends?.toLowerCase() === 'approved';
      
      // For Indonesian clients
      if (isOperatorOnly && checkDisabledStatus(status) && isApproved) {
        return false;
      }
      
      if (!isOperatorOnly && (!checkDisabledStatus(status) || hasAdditionalRequest)) {
        return false;
      }
    },
    checkDisabledStatus(status) {
      return ['Compliant', 'Non-Compliant'].includes(status);
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
    },
    getStatusLegendIconWithRole(statusLegend, isDdsExporter) {
      if (statusLegend && statusLegend.toLowerCase() === 'pending' && !isDdsExporter) {
        return '/icons/dds/sent.svg';
      }

      return this.getStatusLegendIcon(statusLegend);
    },
    getStatusLegendTooltipWithRole(statusLegend, isDdsExporter) {
      if (statusLegend && statusLegend.toLowerCase() === 'pending' && !isDdsExporter) {
        return this.$t("deforestation.sentToExporter");
      }
      return this.getStatusLegendTooltip(statusLegend);
    },
    showAllDownloads() {
      this.$router.push({ name: "DownloadHistory" });
    },
    async handleRefreshDueDiligence(){
       this.getDeforestationEUDR()
    },
    async exportToPDF() {
      const requestParams = {
        page: this.reportOptions.page,
        limit: this.reportOptions.itemsPerPage,
        searchPhrase: this.reportSearch,
        country: this.reportCountry,
        status: this.reportStatus,
      };
      const querys = new URLSearchParams(requestParams).toString();
      const token = this.$store.state.auth.token
      this.startLoading()
      const url = process.env.VUE_APP_DEFORESTRATION_API_BASE_URL  || "http://localhost:4043/api"
      this.downloadSourceFileWithToken(`${url}/diligence-report/diligence-report-pdf?${querys}`, "application/pdf", token,"diligence-reports.pdf")
        .then(() => {
          this.stopLoading()
        }).catch(() => {
          this.stopLoading()
      })
    },
    getConvertedMass(value){
      return this.eudrSettings && UnitService.fromBase.weight(this.eudrSettings.product_mass_unit, value)
    },
    async getEudrSettings() {
        try {
            const { data } = await DeforestationService.getEudrSettings();
            this.eudrSettings = data.eudrSetting;
        } catch (err) {
            this.$notify({
                text: this.$t('deforestation.failedToFetchSettings'),
                type: 'error'
            })
        }
    },
    async printPDF() {
      this.showActionsColumn = false;
      this.hideOnPrint =true;
      await this.$nextTick();
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
          .outputPdf("blob", "Suppliers.pdf");
      let file = new File([worker], "Suppliers.pdf", {
        type: "application/pdf",
      });
      var pdfUrl = await URL.createObjectURL(file);
      await printJS({ printable: `${pdfUrl}`, type: "pdf", showModal: true });

      this.showActionsColumn = true; // restore the column;
      this.hideOnPrint =false;
    },
    async resetDefaut() {
        this.selectedHeaders = this.reportHeaders.map(h => h.value).filter(Boolean);
        this.tableHeaders = this.reportHeaders.filter(h => h.text);
        this.reportOptions.itemsPerPage = 10;
        this.itemsPerPageSlider = 1;
        this.menu = false;
        this.clearTablePrefs('DueDiligenceReportsTable');
        await this.getDeforestationEUDR();
    },
    async resetTableStructure() {
        this.menu = false;
        if (!this.selectedHeaders.length) {
            this.selectedHeaders = this.reportHeaders.map(h => h.value).filter(Boolean);
        }
        this.tableHeaders = this.reportHeaders.filter(header =>
            this.selectedHeaders.includes(header.value)
        );
        const selectedPerPage = this.itemsPerPageOptions[this.itemsPerPageSlider];
        this.reportOptions.itemsPerPage = selectedPerPage;
        this.setTablePrefs('DueDiligenceReportsTable', {
            selectedHeaders: this.selectedHeaders,
            itemsPerPage: selectedPerPage
        });
        await this.getDeforestationEUDR();
    },

    getDateFormat(date) {
        return moment(date).format("DD-MMM-YYYY");
    },

    redirectToDDSSUmmary(reportId){
      this.$router.push({
        name: 'ViewDDSSummary',
        params:{id:reportId}
      })
    },
    redirectToExporterSummary(reportId){
      this.$router.push({
        name: 'ExporterSummaryReport',
        params:{id:reportId}
      })
    },
    handleCreateReport() {
      this.$store.dispatch('SET_DDS_TAB', {
        activeTab: 1
      }).then(() => {
        this.$router.push({ name: 'createDueDiligenceReports' })
      })
    },
    filterData() {
      this.reportOptions.page = 1;
      this.getDeforestationEUDR();
    },
    searchQuery() {
      this.reportOptions.page = 1;
      this.getDeforestationEUDR();
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

      
      if(this.isOperatorOnly){
        requestParams.operatorId = this.$store.getters.getUser.id
      }

      if (opt?.sortBy?.length) {
        requestParams.orderField = opt.sortBy[0];
        requestParams.order = opt.sortDesc[0] ? "DESC" : "ASC";
      }
      if(this.isSupplierOnly){
        requestParams.supplierId = this.$store.getters.getUser.id
      }
      DeforestationService.getDiligenceReports(requestParams)
        .then((res) => {
          this.diligenceReports = res.data.diligenceReports.rows;
          this.totalDiligenceReports = res.data.diligenceReports.totalCount;
          this.totalPages = Math.ceil(this.totalDiligenceReports / this.reportOptions.itemsPerPage)

          this.fromDiligenceReports = (((this.reportOptions.page - 1) * this.reportOptions.itemsPerPage) + 1)
          this.toDiligenceReports = (this.reportOptions.page * this.reportOptions.itemsPerPage) - (this.reportOptions.itemsPerPage - res.data.diligenceReports.rows.length)

          res.data.diligenceReports.rows.forEach(row => {
            if(row.ddsReportExporter){
              row.enableShareReport = true;
            }else{
              row.enableShareReport = false;
            }

            if(row.requestAdditionalInformation && row.requestAdditionalInformation.length > 0){
              row.hasAdditionalRequest = true;
            }else{
              row.hasAdditionalRequest = false;
            }
          });
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          console.log("Error", err);
        });
    },
    async deleteDiligenceReports(id) {
      this.confirmDelete.confirmData = { id };
      this.confirmDeleteDialog = true;
    },
    async confirmDeleteDiligenceReport(action, confirmData){
      this.loading = true;

      DeforestationService.deleteDiligenceReport(parseInt(confirmData.id))
        .then(() => {
          this.getDeforestationEUDR();
          this.$notify({
            text: this.$t("deforestation.reportDeletedSuccessfully"),
            type: "success",
          });
          this.loading = false;
          this.confirmDeleteDialog = false;

        })
        .catch((err) => {
          this.loading = false;
          this.confirmDeleteDialog = false;
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
    navigateReportView(item) {
      let additionalInfoQuery = {};
      if (item?.requestAdditionalInformation) {
        if (this.$store.getters.getUser.id == item?.requestAdditionalInformation?.[0]?.cfUserId) {
          additionalInfoQuery = {
            ddrAdditionalInformationId: item.requestAdditionalInformation[0].id,
          };
          this.$store.dispatch('eudrDDS/setDdsAdditionalInformationData', {
          ddrId: item.id,
          ddrAdditionalInformationId: parseInt(item.requestAdditionalInformation[0].id)
        });
        }
      }
      
      const queryParams = additionalInfoQuery.ddrAdditionalInformationId ? { query: additionalInfoQuery } : {};
      
      if (item.status == 'Pending' || item.status.toLowerCase() == 'under review') {
        this.$router.push({
          name: 'createDueDiligenceReports',
          params: { id: item.id, show: 'show' },
          ...queryParams
        });
      } else if (item.status.toLowerCase() == 'ready to proceed') {
        const tabd = JSON.parse(localStorage.getItem('DDS_TAB_DATA'));
        const activeTb = tabd ? (tabd.activeTab == 2 ? 3 : 4) : Number(item.current_step) || 3;
        if (activeTb) {
          this.$store.dispatch('SET_DDS_TAB', { activeTab: activeTb }).then(() => {
            this.$router.push({
              name: 'createDueDiligenceReports',
              params: { id: item.id, show: 'show' },
              ...queryParams
            });
          });
        } else {
          this.$router.push({
            name: 'createDueDiligenceReports',
            params: { id: item.id, show: 'show' },
            ...queryParams
          });
        }
      } else if (item.status == 'Non-Compliant') {
        
        const finalReportTab = Number(localStorage.getItem('DDS_TAB_LENGTH')) || 6
        this.$store.dispatch('SET_DDS_TAB', { activeTab: finalReportTab }).then(() => {
          this.$router.push({
            name: 'createDueDiligenceReports',
            params: { id: item.id, show: 'non-complaint' },
            ...queryParams
          });
        });
      } else if (item.status == 'Compliant') {
        
        const finalReportTab = Number(localStorage.getItem('DDS_TAB_LENGTH')) || 6
        this.$store.dispatch('SET_DDS_TAB', { activeTab: finalReportTab }).then(() => {
          this.$router.push({
            name: 'createDueDiligenceReports',
            params: { id: item.id, show: 'complaint' },
            ...queryParams
          });
        });
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
  mixins: [loadingMixin, download, getPermittedActions, DateMixin, RoleMixin, tableCustomizationMixin],
};
</script>
<style lang="scss" scoped>
 ::v-deep .v-data-table__wrapper{
    margin-top: -16px !important;
  }

  .download-history{
    padding-bottom: 22px;
  }
.blue-button {
  background-color: #d0e6fe !important;
  /* Green background */
  border: 2px solid #002287 !important;
  /* Red border */
  color: #002287 !important;
}

.orange-button {
  background-color: #fff7ec !important;
  /* Green background */
  border: 2px solid #ffa826 !important;
  /* Red border */
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
  /* Green background */
  border: 2px solid #000000 !important;
  /* Red border */
  color: #000000 !important;
}
.no-pointer {
  pointer-events: none;
  cursor: default;
}
.table-controls-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: nowrap;
  gap: 12px;
  margin-bottom: 12px;
}
.controls-left {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  flex: 1 1 auto;
  min-width: 0;
}
.controls-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
  min-width: 0;
  padding-bottom: 22px;
}
.control {
  min-width: 120px;
  max-width: 220px;
  flex: 1 1 160px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.pagination-label {
  font-size: 14px;
  margin-right: 0.5rem;
  white-space: nowrap;
}
@media (max-width: 1100px) {
  .table-controls-bar {
    flex-wrap: wrap;
  }
  .controls-left, .controls-right {
    flex-wrap: wrap;
    gap: 8px;
  }
  .control {
    max-width: 160px;
    flex: 1 1 120px;
  }
}
@media (max-width: 600px) {
    .v-card {
      padding: 12px !important;
      font-size: 15px;
    }
    .v-card strong {
      font-size: 15px;
    }
  }
  @media (max-width: 400px) {
    .v-card {
      font-size: 13px;
    }
  }
  .dashboard-card {
    min-height: 180px;
    padding: 32px 12px;
    width: 100%;
    max-width: 340px;
  }
  @media (max-width: 900px) {
    .dashboard-card {
      min-height: 140px;
      padding: 20px 8px;
      max-width: 100%;
    }
  }
  .report-card {
    border-radius: 18px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.07);
    font-size: 1rem;
  }
  .report-title {
    font-size: 1.2rem;
    font-weight: bold;
  }

  .report-row:last-child {
    border-bottom: none;
  }
  @media (max-width: 600px) {
    .report-card {
      padding: 12px !important;
      font-size: 15px;
    }
    .report-title {
      font-size: 1.1rem;
    }
  }

  /* Mobile Controls and Pagination Styles */
  .mobile-controls-bar {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
  }

  .mobile-controls-left {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .mobile-search {
    width: 100%;
  }

  .mobile-filter {
    width: 100%;
  }

  .mobile-pagination {
    padding: 16px 0;
    border-top: 1px solid #e0e0e0;
  }

  .mobile-pagination-label {
    font-size: 14px;
    font-weight: 500;
    color: #666;
  }

  .mobile-pagination-controls {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* Responsive adjustments for mobile */
  @media (max-width: 480px) {
    .mobile-controls-bar {
      gap: 8px;
    }
    
    .mobile-controls-left {
      gap: 8px;
    }
    
    .mobile-pagination {
      padding: 12px 0;
    }
    
    .mobile-pagination-label {
      font-size: 13px;
    }
  }

</style>