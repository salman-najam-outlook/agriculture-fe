<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <!-- Header Section -->
      <div class="d-flex mb-4 align-center">
        <h2>{{ loading ? (isNaccuUser ? $t('memberDataSection.loadingAffiliate') : $t('memberDataSection.loadingBuyingStation')) : (buyingStationData.name || (isNaccuUser ? 'Affiliate' : 'Buying Station')) }}</h2>
        <v-spacer></v-spacer>
        <div class="d-flex align-center">
          <v-btn color="primary" dark class="mr-2 mb-2" @click="handleAssociatedFarms">
            {{ $t("memberDataSection.associatedFarms") }}
          </v-btn>
          <v-btn color="primary" dark class="mr-2 mb-2" @click="handleEdit">
            {{ $t("memberDataSection.edit") }}
          </v-btn>
          <v-btn color="primary" dark class="mr-2 mb-2" @click="handleBack">
            {{ $t("memberDataSection.back") }}
          </v-btn>
        </div>
      </div>

      <!-- User Details Card -->
      <v-card elevation="0" class="px-5 mb-6">
        <v-card-title class="text-h6 pb-2">
          {{ $t("memberDataSection.userDetails") }}
        </v-card-title>
        <v-card-text>
          <v-row class="mb-4">
            <v-col cols="12" md="3">
              <div class="mb-3">
                <span>{{ $t("memberDataSection.name") }}</span>
                <div class="font-weight-bold mt-3">{{ buyingStationData.name || '-' }}</div>
              </div>
            </v-col>
            <v-col cols="12" md="9">
              <v-row>
                <v-col cols="12" md="4">
                  <div class="mb-3">
                    <span>{{ $t("memberDataSection.email") }}</span>
                    <div class="font-weight-bold mt-3">{{ buyingStationData.email || '-' }}</div>
                  </div>
                </v-col>
                <v-col cols="12" md="4">
                  <div class="mb-3">
                    <span>{{ $t("memberDataSection.phoneNumber") }}</span>
                    <div class="font-weight-bold mt-3">{{ buyingStationData.phoneNumber || '-' }}</div>
                  </div>
                </v-col>
                <v-col cols="12" md="4">
                  <div class="mb-3">
                    <span>{{ $t("memberDataSection.country") }}</span>
                    <div class="font-weight-bold mt-3">{{ buyingStationData.country || '-' }}</div>
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          
          <v-row>
            <v-col cols="12" md="3">
              <div class="mb-3">
                <span>{{ $t("memberDataSection.provinceState") }}</span>
                <div class="font-weight-bold mt-3">{{ provinceOrState || '-' }}</div>
              </div>
            </v-col>
            <v-col cols="12" md="9">
              <v-row>
                <v-col cols="12" md="4">
                  <div class="mb-3">
                    <span>{{ $t("memberDataSection.villageCityTown") }}</span>
                    <div class="font-weight-bold mt-3">{{ villageCityOrTown || '-' }}</div>
                  </div>
                </v-col>
                <v-col cols="12" md="4">
                  <div class="mb-3">
                    <span>{{ $t("memberDataSection.role") }}</span>
                    <div class="font-weight-bold mt-3">{{ buyingStationData.role || (isNaccuUser ? 'Affiliate' : 'Society') }}</div>
                  </div>
                </v-col>
                <v-col cols="12" md="4">
                  <div class="mb-3">
                    <span>{{ $t("memberDataSection.status") }}</span>
                    <div class="mt-2 d-flex align-start">
                      <v-btn x-small rounded min-width="80" depressed class="green-button" height="28"
                          v-if="buyingStationData.status === 'active'">
                          {{ $t("memberDataSection.active") }}
                      </v-btn>
                      <v-btn x-small rounded min-width="80" depressed class="red-button" height="28"
                          v-else-if="buyingStationData.status === 'deactivated'">
                          {{ $t("memberDataSection.deactivated") }}
                      </v-btn>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Purchase Order Section -->
      <v-card elevation="0" class="px-5">
        <v-card-title class="text-h6 pb-2 d-flex align-center">
          {{ $t("memberDataSection.purchaseOrder") }}
          <v-spacer></v-spacer>
          <v-btn color="primary" dark class="mr-2 mb-2" @click="handleAddPurchaseOrder">
            {{ $t("memberDataSection.addPurchaseOrder") }}
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row style="margin-left:-30px; margin-bottom: 20px; margin-top: 15px;">
            <v-col cols="12">
              <v-data-table :headers="tableHeaders" :items="purchaseOrders" :items-per-page="10" :footer-props="{
                'items-per-page-options': [5, 10, 25, 50],
              }" item-key="id" hide-default-footer :loading="loading" :options.sync="options"
                :server-items-length="totalPurchaseOrders" :loading-text="$t('loadingData')">
                <template v-slot:top="{}">
                  <div class="d-flex align-center">

                    <div class="ml-3" style="width: 220px;">
                      <v-text-field style="width: 280px;" prepend-inner-icon="mdi-magnify" outlined height="5px"
                        :placeholder="$t('memberDataSection.search')" dense v-model="search" @input="searchQuery"
                        class="shrink">
                      </v-text-field>
                    </div>

                    <v-spacer></v-spacer>
                    <div class="d-flex align-center mb-3">
                      <div class="py-1 title">
                        {{ fromPurchaseOrderList }} -
                        {{ toPurchaseOrderList }} {{ $t('of') }}
                        {{ totalPurchaseOrders }}
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

                      <!-- <v-tooltip top color="black" max-width="350">
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
                      </v-tooltip> -->
                    </div>
                  </div>
                </template>
                <template v-if="purchaseOrders.length" v-slot:body="{ items }">
                  <tbody>
                    <tr v-for="item in items" :key="item.id" style="position: relative; width: 0; height: 0"
                      @mouseover="selectItem(item)" @mouseleave="selectItem(false)">
                      <template v-for="h in tableHeaders">
                        <td class="text-truncate" :key="h.value + '_orderId'" v-if="h.value == 'orderId'">
                          {{ item.orderCode }}
                        </td>
                        <td class="text-wrap-cell" :key="h.value + '_farmFarmer'" v-else-if="h.value == 'farmFarmer'">
                          <div class="farm-farmer-content">
                            <div class="farm-name">{{ item.userFarms?.farmName || '-' }}</div>
                            <div class="farmer-name">{{ item.farmer?.firstName }} {{ item.farmer?.lastName }}</div>
                          </div>
                        </td>
                        <td class="text-wrap-cell" :key="h.value + '_coffeeSpecies'" v-else-if="h.value == 'coffeeSpecies'">
                          <div class="coffee-species-content">
                            <div class="species-name">{{ item.coffeeSpecies?.name || '-' }}</div>
                            <div class="variety-names">{{ item.coffeeVarietyDirect?.name || item.coffeeVariety?.map(v => v.name).join(', ') || '-' }}</div>
                          </div>
                        </td>
                        <td class="text-truncate" :key="h.value + '_quantityPrice'" v-else-if="h.value == 'quantityPrice'">
                          {{ item.coffeeCherryQty }} kg<br />
                          ${{ item.perKgPrice }}
                        </td>
                        <td class="text-truncate" :key="h.value + '_purchaseDate'" v-else-if="h.value == 'purchaseDate'">
                          {{ getDateFormat(item.purchasedAt) }}
                        </td>
                      </template>
                      
                      <!-- Action menu positioned absolutely -->
                      <div style="position: absolute; right: 10px; top:10px;">
                        <v-menu location="start">
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn icon v-bind="attrs" v-on="on">
                              <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                          </template>
                          <v-list>
                            <v-list-item @click="editPurchaseOrder(item)">
                              <v-list-item-title>{{ $t('memberDataSection.edit') }}</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="deletePurchaseOrder(item.id)">
                              <v-list-item-title class="red--text">{{ $t('memberDataSection.delete') }}</v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </div>
                    </tr>
                  </tbody>
                </template>
                <template v-slot:footer></template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Processing Batch Section -->
      <v-card elevation="0" class="px-5 mt-6">
        <v-card-title class="text-h6 pb-2 d-flex align-center">
          {{ $t("memberDataSection.processingBatch") }}
          <v-spacer></v-spacer>
          <v-btn color="primary" dark class="mr-2 mb-2" @click="handleAddProcessingBatch">
            {{ $t("memberDataSection.addProcessingBatch") }}
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row style="margin-left:-30px; margin-bottom: 20px; margin-top: 15px;">
            <v-col cols="12">
              <v-data-table :headers="processingBatchTableHeaders" :items="processingBatches" :items-per-page="10" :footer-props="{
                'items-per-page-options': [5, 10, 25, 50],
              }" item-key="id" hide-default-footer :loading="processingBatchLoading" :options.sync="processingBatchOptions"
                :server-items-length="totalProcessingBatches" :loading-text="$t('loadingData')">
                <template v-slot:top="{}">
                  <div class="d-flex align-center">

                    <div class="ml-3" style="width: 220px;">
                      <v-text-field style="width: 280px;" prepend-inner-icon="mdi-magnify" outlined height="5px"
                        :placeholder="$t('memberDataSection.search')" dense v-model="processingBatchSearch" @input="processingBatchSearchQuery"
                        class="shrink">
                      </v-text-field>
                    </div>

                    <v-spacer></v-spacer>
                    <div class="d-flex align-center mb-3">
                      <div class="py-1 title">
                        {{ fromProcessingBatchList }} -
                        {{ toProcessingBatchList }} {{ $t('of') }}
                        {{ totalProcessingBatches }}
                      </div>
                      <v-btn class="mx-2" fab small outlined color="primary" :disabled="processingBatchOptions.page <= 1"
                        @click="processingBatchPageChange(false)">
                        <v-icon dark>
                          mdi-chevron-left
                        </v-icon>
                      </v-btn>
                      <v-btn class="mx-2" fab small outlined color="primary" :disabled="processingBatchOptions.page >= processingBatchTotalPages"
                        @click="processingBatchPageChange(true)">
                        <v-icon dark>
                          mdi-chevron-right
                        </v-icon>
                      </v-btn>
                      <v-menu v-model="processingBatchMenu" :close-on-content-click="false" :nudge-width="200" left :min-width="417">
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
                                <v-slider v-model="processingBatchItemsPerPageSlider" :tick-labels="processingBatchItemsPerPageOptions" :max="3"
                                  step="1" ticks="always" tick-size="4"></v-slider>
                              </v-list-item-content>
                            </v-list-item>
                            <v-divider class="mt-n3"></v-divider>
                          </v-list>
                          <v-card-text>
                            <v-container fluid>
                              <v-row>
                                <v-col class="mt-n9" cols="6" v-for="header in processingBatchHeaders" :key="header.value">
                                  <v-checkbox v-if="header.text" v-model="processingBatchSelectedHeaders" :label="header.text"
                                    color="primary" :value="header.text" hide-details
                                    :disabled="header.text == 'ID'"></v-checkbox>
                                </v-col>
                              </v-row>
                            </v-container>
                          </v-card-text>
                          <v-layout justify-center>
                            <v-card-actions class="mb-5">
                              <v-spacer></v-spacer>
                              <v-btn outlined color="primary" @click="processingBatchResetDefault" width="190">
                                <span class="text-truncate" style="max-width:150px">{{ $t("deforestation.restoreDefault") }}</span>
                              </v-btn>
                              <v-btn color="primary" @click="processingBatchResetTableStructure" width="190">
                                {{ $t("deforestation.apply") }}
                              </v-btn>
                            </v-card-actions>
                          </v-layout>
                        </v-card>
                      </v-menu>

                      <!-- <v-tooltip top color="black" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn class="mx-2" fab small outlined color="primary" v-bind="attrs" v-on="on"
                            @click="processingBatchExportToPDF">
                            <v-icon dark> mdi-download </v-icon>
                          </v-btn>
                        </template>
                        <span>{{ $t("deforestation.download") }}</span>
                      </v-tooltip>
                      <v-tooltip top color="black" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn class="mx-2" fab small outlined color="primary" v-bind="attrs" v-on="on"
                            @click="processingBatchPrintPDF('document')">
                            <v-icon dark> mdi-printer </v-icon>
                          </v-btn>
                        </template>
                        <span>{{ $t("deforestation.print") }}</span>
                      </v-tooltip> -->
                    </div>
                  </div>
                </template>
                <template v-if="processingBatches.length" v-slot:body="{ items }">
                  <tbody>
                    <tr v-for="item in items" :key="item.id" style="position: relative; width: 0; height: 0"
                      @mouseover="selectProcessingBatchItem(item)" @mouseleave="selectProcessingBatchItem(false)">
                      <template v-for="h in processingBatchTableHeaders">
                        <td class="text-truncate" :key="h.value + '_batchId'" v-if="h.value == 'batchId'">
                          {{ item.batchCode }}
                        </td>
                        <td class="text-truncate" :key="h.value + '_lots'" v-else-if="h.value == 'lots'">
                          <div v-for="order in item.buyingStationOrder" :key="order.id">{{ order.orderCode }}</div>
                        </td>
                        <td class="text-truncate" :key="h.value + '_totalCoffeeCherry'" v-else-if="h.value == 'totalCoffeeCherry'">
                          {{ item.totalCoffeeCherryQty }} kg
                        </td>
                        <td class="text-truncate" :key="h.value + '_greenCoffeeOut'" v-else-if="h.value == 'greenCoffeeOut'">
                          <div v-if="item.parchmentOut != null">
                            {{ item.parchmentOut }} kg
                          </div>
                          <div v-else-if="!item.parchmentReady">
                            <v-btn 
                              small 
                              rounded 
                              color="primary" 
                              dark
                              class="processing-done-btn"
                              @click="processingDoneDialogOpen(item)"
                            >
                              {{ $t('memberDataSection.processingDone') }}
                            </v-btn>
                          </div>
                          <div v-else>
                            -
                          </div>
                        </td>
                        <td class="text-truncate" :key="h.value + '_startEndDate'" v-else-if="h.value == 'startEndDate'">
                          {{ getDateFormat(item.startDate) }}<br />
                          {{ getDateFormat(item.endDate) }}
                        </td>
                      </template>
                      
                      <!-- Action menu positioned absolutely -->
                      <div style="position: absolute; right: 10px; top:10px;">
                        <v-menu location="start">
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn icon v-bind="attrs" v-on="on">
                              <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                          </template>
                          <v-list>
                            <v-list-item @click="editProcessingBatch(item)">
                              <v-list-item-title>{{ $t('memberDataSection.edit') }}</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="deleteProcessingBatch(item.id)">
                              <v-list-item-title class="red--text">{{ $t('memberDataSection.delete') }}</v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </div>
                    </tr>
                  </tbody>
                </template>
                <template v-slot:footer></template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>

    <!-- Purchase Order Dialog -->
    <PurchaseOrderDialog 
      :dialogI="purchaseOrderDialog" 
      :purchaseItem="selectedPurchaseOrder"
      @closepurchaseOrderDialog="closePurchaseOrderDialog"
      @updatePurchaseOrder="updatePurchaseOrder"
    />

    <!-- Processing Batch Dialog -->
    <ProcessingBatchDialog 
      :dialogI="processingBatchDialog" 
      :batchItem="selectedProcessingBatch"
      :purchaseOrders="purchaseOrders"
      :usedPurchaseOrders="usedPurchaseOrders"
      @closeProcessingBatchDialog="closeProcessingBatchDialog"
      @updateProcessingBatch="updateProcessingBatch"
    />

    <!-- Edit App User Dialog -->
    <EditAppUser 
      v-if="editUserDialog && selectedBuyingStation"
      :dialogU="editUserDialog" 
      :user="selectedBuyingStation"
      :isMarketPlaceUser="false"
      @closeUpdateUser="closeEditUserDialog"
      @appUserUpdated="handleUserUpdated"
    />

    <!-- Processing Done Dialog -->
    <v-dialog v-model="processingDoneDialog" width="800" @click:outside="processingDoneDialog = false">
      <v-card rounded="0">
        <v-toolbar color="primary" class="white--text" flat>
          <v-toolbar-title class="font-weight-bold">{{ $t("memberDataSection.processingDone") }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon class="white--text" @click="processingDoneDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        
        <v-card-text class="black--text mt-8">
          <v-form autocomplete="off" ref="processedCoffeeOutForm" @submit.prevent="updateParchmentOut">
            <v-row>
              <v-col cols="6" class="py-0 px-4">
                <label>{{ $t("memberDataSection.processedCoffeeOut") }} <span class="float-right">KG</span></label>
                <v-text-field outlined dense type="number" v-model="processedCoffeeOut"
                  placeholder="Type quantity" :rules="processedCoffeeOutRule">
                </v-text-field>
              </v-col>
            </v-row>
            
            <v-card-actions class="mt-10">
              <v-spacer></v-spacer>
              <v-btn class="" outlined color="primary" @click="processingDoneDialog = false" width="112">
                {{ $t("cancel") }}
              </v-btn>
              <v-btn width="112" color="primary" type="submit" class="btn-11 btn-22">
                {{ $t("submit") }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
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
import PurchaseOrderDialog from "@/views/member-data/buying-station/PurchaseOrderDialog.vue";
import ProcessingBatchDialog from "@/views/member-data/buying-station/ProcessingBatchDialog.vue";
import EditAppUser from "@/views/user/EditAppUser.vue";
import BuyingStationService from "@/_services/BuyingStationService";

export default {
  components: {
    PurchaseOrderDialog,
    ProcessingBatchDialog,
    EditAppUser,
  },
  created() {
    this.getBuyingStationDetails();
    this.getPurchaseOrders();
    this.getProcessingBatches();
  },
  async mounted() {
    this.tableHeaders = this.headers;
    this.selectedHeaders = this.allSelectedHeaders;
    this.processingBatchTableHeaders = this.processingBatchHeaders;
    this.processingBatchSelectedHeaders = this.processingBatchHeaders.map(h => h.text);
  },
  watch: {
    options: {
      handler(opt) {
        this.getPurchaseOrders(opt);
      },
      deep: true,
    },
    processingBatchOptions: {
      handler(opt) {
        this.getProcessingBatches(opt);
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
      return parseInt(Math.ceil(this.totalPurchaseOrders / 10))
    },
    processingBatchTotalPages() {
      return parseInt(Math.ceil(this.totalProcessingBatches / 10))
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
          to: { name: 'CoffeeBuyingStation' },
        },
      ];
    },
    provinceOrState() {
      return this.buyingStationData.stateId || this.buyingStationData.district || '-';
    },
    villageCityOrTown() {
      return this.buyingStationData.city || this.buyingStationData.village || this.buyingStationData.district || '-';
    },
  },
  data() {
    return {
      debounceTimer: null,
      fromPurchaseOrderList: 0,
      toPurchaseOrderList: 0,
      search: "",
      copyReport: [],
      loading: true,
      selectedItem: false,
      selectedProcessingBatchItem: false,
      selectedBuyingStation: null,
      options: {
        limit: 10,
        page: 1,
      },
      headers: [
        {
          text: this.$t("memberDataSection.orderId"),
          align: "start",
          value: "orderId",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("memberDataSection.farmFarmer"),
          align: "start",
          value: "farmFarmer",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("memberDataSection.coffeeSpeciesVariety"),
          align: "start",
          value: "coffeeSpecies",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("memberDataSection.quantityPrice"),
          align: "start",
          value: "quantityPrice",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("memberDataSection.purchaseDate"),
          align: "start",
          value: "purchaseDate",
          class: "black--text",
          sortable: true,
        },
      ],
      allSelectedHeaders: [
        this.$t('memberDataSection.orderId'),
        this.$t('memberDataSection.farmFarmer'),
        this.$t('memberDataSection.coffeeSpeciesVariety'),
        this.$t("memberDataSection.quantityPrice"),
        this.$t("memberDataSection.purchaseDate"),
      ],
      menu: false,
      buyingStationData: {},
      purchaseOrders: [],
      totalPurchaseOrders: 0,
      totalPurchaseOrderPages: 0,
      customizeMenu: false,
      customizeMenuAll: false,
      itemsPerPageOptions: [5, 10, 25, 50],
      itemsPerPageSlider: 1,
      selectedHeaders: [],
      tableHeaders: [],
      
      // Processing Batch data
      processingBatches: [],
      totalProcessingBatches: 0,
      processingBatchLoading: false,
      processingBatchSearch: "",
      processingBatchOptions: {
        limit: 10,
        page: 1,
      },
      fromProcessingBatchList: 0,
      toProcessingBatchList: 0,
      processingBatchMenu: false,
      processingBatchItemsPerPageOptions: [5, 10, 25, 50],
      processingBatchItemsPerPageSlider: 1,
      processingBatchSelectedHeaders: [],
      processingBatchTableHeaders: [],
      
      // Dialog states
      purchaseOrderDialog: false,
      processingBatchDialog: false,
      editUserDialog: false,
      selectedPurchaseOrder: null,
      selectedProcessingBatch: {},
      usedPurchaseOrders: [],
      
      processingBatchHeaders: [
        {
          text: this.$t("memberDataSection.batchId"),
          align: "start",
          value: "batchId",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("memberDataSection.lots"),
          align: "start",
          value: "lots",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("memberDataSection.totalCoffeeCherry"),
          align: "start",
          value: "totalCoffeeCherry",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("memberDataSection.greenCoffeeOut"),
          align: "start",
          value: "greenCoffeeOut",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("memberDataSection.startEndDate"),
          align: "start",
          value: "startEndDate",
          class: "black--text",
          sortable: true,
        },
      ],
      
      // Processing Done Dialog
      processingDoneDialog: false,
      processedCoffeeOut: '',
      processedCoffeeOutRule: [
        (v) => !!v || this.$t('processedCoffeeOutRequired'), 
        (v) => v <= this.selectedProcessingBatch.totalCoffeeCherryQty || 'Processed Coffee Out value cannot be greater than total coffee quantity.'
      ]
    };
  },
  methods: {
    async exportToPDF() {
      const requestParams = {
        page: this.options.page,
        limit: this.options.limit,
        search: this.search,
        buyingStationId: this.$route.params.id,
      };
      const querys = new URLSearchParams(requestParams).toString();
      const token = this.$store.state.auth.token
      this.startLoading()
      const url = process.env.VUE_APP_API_BASE_URL || "https://api.dimitra.dev"
      this.downloadSourceFileWithToken(`${url}/purchase-orders/pdf?${querys}`, "application/pdf", token, "purchase-orders.pdf")
        .then(() => {
          this.stopLoading()
        }).catch(() => {
          this.stopLoading()
        })
    },

    async printPDF() {
      await this.$nextTick();
      const element = document.querySelector(".v-data-table__wrapper");
      let opt = {
        margin: 1,
        filename: "PurchaseOrderList.pdf",
        image: { type: "jpeg", quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
      };

      let worker = await html2pdf()
        .set(opt)
        .from(element)
        .toCanvas()
        .outputPdf("blob", "PurchaseOrder.pdf");
      let file = new File([worker], "PurchaseOrder.pdf", {
        type: "application/pdf",
      });
      var pdfUrl = await URL.createObjectURL(file);
      await printJS({ printable: `${pdfUrl}`, type: "pdf", showModal: true });
    },

    async resetDefault() {
      this.tableHeaders = this.headers;
      this.selectedHeaders = this.allSelectedHeaders;
      this.menu = false;
      await this.getPurchaseOrders();
    },

    async resetTableStructure() {
      this.tableHeaders = this.headers.filter((header) =>
        this.selectedHeaders.includes(header.text)
      );
      this.options.limit = this.itemsPerPageOptions[
        this.itemsPerPageSlider
      ];
      await this.getPurchaseOrders();
      (this.customizeMenu = false), (this.customizeMenuAll = false);
    },

    getDateFormat(date) {
      if (!date) return '-';
      
      // Try to parse the date with different formats
      let parsedDate;
      
      // First try MM/DD/YYYY format (common in the data)
      if (moment(date, 'MM/DD/YYYY', true).isValid()) {
        parsedDate = moment(date, 'MM/DD/YYYY');
      }
      // Then try ISO format
      else if (moment(date).isValid()) {
        parsedDate = moment(date);
      }
      // If all else fails, return the original date
      else {
        return date;
      }
      
      return parsedDate.format("DD/MM/YYYY");
    },

    handleAssociatedFarms() {
      this.$router.push({
        name: 'associatedFarms',
        params: { 
          id: this.$route.params.id,
          buyingStationName: this.buyingStationData.name || 'Buying Station'
        },
      });
    },

    async handleEdit() {
      try {
        const response = await BuyingStationService.getBuyingStationDetails(this.$route.params.id);
        const station = response && response.data ? response.data : null;

        if (station) {
          // Map API response to EditAppUser expected structure (same as list view)
          this.selectedBuyingStation = {
            id: station.id,
            firstName: station.firstName || "",
            middleName: station.middleName || "",
            lastName: station.lastName || "",
            email: station.email || "",
            mobile: station.mobile || "",
            phoneNumber: station.mobile || "",
            country: station.country || "",
            countryId: station.countryId || "",
            countryCode: station.countryIsoCode || station.countryCode || "",
            stateId: station.stateId || "",
            district: station.district || "",
            village: station.village || "",
            city: station.city || "",
            address: station.address || "",
            userTribe: station.userTribe || "",
            website: station.website || "",
            id_number: station.id_number || "",
            active: Boolean(station.active),
            user_membership: Array.isArray(station.user_membership) ? station.user_membership : [],
            activation: Array.isArray(station.activation) ? station.activation : [],
          };

          this.editUserDialog = true;
        }
      } catch (err) {
        this.$notify({
          text: err?.data?.message || "Error fetching buying station details",
          type: "error",
        });
      }
    },

    handleBack() {
      this.$router.push({ name: 'CoffeeBuyingStation' });
    },

    handleAddPurchaseOrder() {
      this.selectedPurchaseOrder = {
        buyingStationId: parseInt(this.$route.params.id)
      };
      this.purchaseOrderDialog = true;
    },


    editPurchaseOrder(item) {
      this.selectedPurchaseOrder = {
        id: item.orderCode
      };
      this.purchaseOrderDialog = true;
    },

    async deletePurchaseOrder(id) {
      try {
        await BuyingStationService.deletePurchaseOrder(id);
        this.$notify({
          title: "Purchase Order deleted successfully.",
          type: "success",
        });
        this.getPurchaseOrders();
      } catch (err) {
        this.$notify({
          title: "Purchase Order delete failed.",
          type: "error",
        });
      }
    },

    searchQuery() {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => {
        this.options.page = 1;
        this.getPurchaseOrders();
      }, 500)
    },

    async getBuyingStationDetails() {
      this.loading = true;
      const buyingStationId = this.$route.params.id;
      
      try {
        const res = await BuyingStationService.getBuyingStationDetails(buyingStationId);
        
        // Transform the API response to match the expected format
        const stationData = res.data;
        this.buyingStationData = {
          id: stationData.id,
          name: stationData.fullName || `${stationData.firstName || ''} ${stationData.middleName || ''} ${stationData.lastName || ''}`.trim(),
          firstName: stationData.firstName,
          middleName: stationData.middleName,
          lastName: stationData.lastName,
          email: stationData.email,
          phoneNumber: stationData.mobile,
          mobile: stationData.mobile,
          country: stationData.countryId,
          stateId: stationData.stateId,
          city: stationData.city,
          district: stationData.district,
          village: stationData.village,
          role: this.isNaccuUser ? this.$t("memberDataSection.affiliate") : this.$t("memberDataSection.buyingStation"), // Default role for buying stations
          status: stationData.active ? "active" : "deactivated",
          active: stationData.active,
          address: stationData.address,
          id_number: stationData.id_number
        };
        
        this.loading = false;
      } catch (err) {
        this.loading = false;
        this.$notify({
          text: "Error fetching buying station details",
          type: "error",
        });
      }
    },

    async getPurchaseOrders(opt = null) {
      this.loading = true;
      const requestParams = {
        page: this.options.page || 1,
        itemsPerPage: this.options.limit || 10,
        search: this.search || null,
        buyingStationId: this.$route.params.id,
      };

      if (opt?.sortBy?.length) {
        requestParams.orderField = opt.sortBy[0];
        requestParams.order = opt.sortDesc[0] ? "DESC" : "ASC";
      }

      try {
        const res = await BuyingStationService.getSingleBuyingStationPurchaseOrder(
          this.$route.params.id,
          requestParams,
          this.search
        );
        
        this.purchaseOrders = res.data.rows || [];
        this.totalPurchaseOrders = res.data.totalRows || 0;
        this.totalPurchaseOrderPages = Math.ceil(this.totalPurchaseOrders / this.options.limit);

        this.fromPurchaseOrderList = this.totalPurchaseOrders > 0
          ? (this.options.page - 1) * this.options.limit + 1
          : 0;
        this.toPurchaseOrderList = this.options.page * this.options.limit > this.totalPurchaseOrders
          ? this.totalPurchaseOrders
          : this.options.page * this.options.limit;

        this.loading = false;
      } catch (err) {
        this.loading = false;
        this.$notify({
          text: "Error fetching purchase orders",
          type: "error",
        });
      }
    },

    selectItem(item) {
      this.selectedItem = item;
    },

    reportPageChange(t) {
      if (t) this.options.page = this.options.page + 1;
      else this.options.page = this.options.page - 1;
      this.getPurchaseOrders();
    },

    // Processing Batch methods
    handleAddProcessingBatch() {
      this.selectedProcessingBatch = {
        buyingStationId: parseInt(this.$route.params.id)
      };
      this.processingBatchDialog = true;
    },

    async processingBatchExportToPDF() {
      const requestParams = {
        page: this.processingBatchOptions.page,
        limit: this.processingBatchOptions.limit,
        search: this.processingBatchSearch,
        buyingStationId: this.$route.params.id,
      };
      const querys = new URLSearchParams(requestParams).toString();
      const token = this.$store.state.auth.token
      this.startLoading()
      const url = process.env.VUE_APP_API_BASE_URL || "https://api.dimitra.dev"
      this.downloadSourceFileWithToken(`${url}/processing-batches/pdf?${querys}`, "application/pdf", token, "processing-batches.pdf")
        .then(() => {
          this.stopLoading()
        }).catch(() => {
          this.stopLoading()
        })
    },

    async processingBatchPrintPDF() {
      await this.$nextTick();
      const element = document.querySelector(".v-data-table__wrapper");
      let opt = {
        margin: 1,
        filename: "ProcessingBatchList.pdf",
        image: { type: "jpeg", quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
      };

      let worker = await html2pdf()
        .set(opt)
        .from(element)
        .toCanvas()
        .outputPdf("blob", "ProcessingBatch.pdf");
      let file = new File([worker], "ProcessingBatch.pdf", {
        type: "application/pdf",
      });
      var pdfUrl = await URL.createObjectURL(file);
      await printJS({ printable: `${pdfUrl}`, type: "pdf", showModal: true });
    },

    async processingBatchResetDefault() {
      this.processingBatchTableHeaders = this.processingBatchHeaders;
      this.processingBatchSelectedHeaders = this.processingBatchHeaders.map(h => h.text);
      this.processingBatchMenu = false;
      await this.getProcessingBatches();
    },

    async processingBatchResetTableStructure() {
      this.processingBatchTableHeaders = this.processingBatchHeaders.filter((header) =>
        this.processingBatchSelectedHeaders.includes(header.text)
      );
      this.processingBatchOptions.limit = this.processingBatchItemsPerPageOptions[
        this.processingBatchItemsPerPageSlider
      ];
      await this.getProcessingBatches();
      (this.processingBatchCustomizeMenu = false), (this.processingBatchCustomizeMenuAll = false);
    },


    editProcessingBatch(item) {
      this.selectedProcessingBatch = { id: item.batchCode };
      this.processingBatchDialog = true;
    },

    async deleteProcessingBatch(id) {
      try {
        await BuyingStationService.deleteProcessBatch(id);
        this.getProcessingBatches();
      } catch (err) {
        console.log(err)
      }
    },

    processingBatchSearchQuery() {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => {
        this.processingBatchOptions.page = 1;
        this.getProcessingBatches();
      }, 500)
    },

    async getProcessingBatches(opt = null) {
      this.processingBatchLoading = true;
      const requestParams = {
        page: this.processingBatchOptions.page || 1,
        itemsPerPage: this.processingBatchOptions.limit || 10,
        search: this.processingBatchSearch || null,
        buyingStationId: this.$route.params.id,
      };

      if (opt?.sortBy?.length) {
        requestParams.orderField = opt.sortBy[0];
        requestParams.order = opt.sortDesc[0] ? "DESC" : "ASC";
      }

      try {
        const res = await BuyingStationService.getSingleBuyingStationProcessingBatch(
          this.$route.params.id,
          requestParams,
          this.processingBatchSearch
        );
        
        this.processingBatches = res.data.rows || [];
        this.totalProcessingBatches = res.data.totalRows || 0;

        this.fromProcessingBatchList = this.totalProcessingBatches > 0
          ? (this.processingBatchOptions.page - 1) * this.processingBatchOptions.limit + 1
          : 0;
        this.toProcessingBatchList = this.processingBatchOptions.page * this.processingBatchOptions.limit > this.totalProcessingBatches
          ? this.totalProcessingBatches
          : this.processingBatchOptions.page * this.processingBatchOptions.limit;

        this.processingBatchLoading = false;
        this.getUsedPurchaseOrders();
      } catch (err) {
        this.processingBatchLoading = false;
      }
    },

    selectProcessingBatchItem(item) {
      this.selectedProcessingBatchItem = item;
    },

    processingBatchPageChange(t) {
      if (t) this.processingBatchOptions.page = this.processingBatchOptions.page + 1;
      else this.processingBatchOptions.page = this.processingBatchOptions.page - 1;
      this.getProcessingBatches();
    },

    // Dialog event handlers
    closePurchaseOrderDialog() {
      this.purchaseOrderDialog = false;
      this.selectedPurchaseOrder = null;
    },

    closeProcessingBatchDialog() {
      this.processingBatchDialog = false;
      this.selectedProcessingBatch = null;
    },

    updatePurchaseOrder() {
      this.getPurchaseOrders();
    },

    updateProcessingBatch() {
      this.getProcessingBatches();
    },

    // Edit User Dialog event handlers
    closeEditUserDialog() {
      this.editUserDialog = false;
      this.selectedBuyingStation = null;
    },

    handleUserUpdated(result) {
      if (result.success) {
        this.getBuyingStationDetails();
      } 
    },

    // Get used purchase orders for processing batch dialog
    getUsedPurchaseOrders() {
      // Extract order codes from processing batches that are already used
      this.usedPurchaseOrders = this.processingBatches
        .flatMap(batch => batch.lots || [])
        .filter(lot => lot); // Remove any null/undefined values
    },

    // Processing Done Methods

    processingDoneDialogOpen(item) {
      this.processingDoneDialog = true
      this.selectedProcessingBatch = item
      this.processedCoffeeOut = ''
    },

    async updateParchmentOut() {
      if (!this.$refs.processedCoffeeOutForm.validate()) return;
      
      try {
        const res = await this.$http.put(`/coffee/buying-station/processing-batch/${this.selectedProcessingBatch.batchCode || this.selectedProcessingBatch.id}`, {
          parchmentOut: Number(this.processedCoffeeOut)
        });
        
        if (res.data.success) {
          this.processingDoneDialog = false
          this.selectedProcessingBatch = {}
          this.getProcessingBatches()
        } 
      } catch (error) {
        this.$notify({
          title: "Error updating processed coffee out.",
          type: "error",
        });
      }
    },
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

/* Text wrapping styles for long content */
.text-wrap-cell {
  max-width: 400px;
  min-width: 150px;
  word-wrap: break-word;
  word-break: break-word;
  white-space: normal;
  vertical-align: top;
  padding: 8px 12px;
}

/* Processing Done Button Styles */
.processing-done-btn {
  font-size: 0.75rem !important;
  height: 32px !important;
  min-width: 120px !important;
  text-transform: none !important;
  padding: 0 16px !important;
}




</style>