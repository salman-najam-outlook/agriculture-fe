<template>
  <div>
    <v-data-table
      hide-default-footer
      :headers="headers"
      :items="filteredItems"
      :options.sync="pagination.options"
      :server-items-length="pagination.totalItems"
      :loading="loading"
      disable-sort
    >
      <template #top>
        <v-row class="mt-5 pa-2">
          <v-col cols="12" md="4">
            <v-text-field
              prepend-inner-icon="mdi-magnify"
              @keyup.enter="searchQuery"
              outlined
              v-model="searchPhrase"
              dense
              clearable
              @click:clear="clearSearchValue"
              :placeholder="$t('buySell.searchOrderByID')"
              class="shrink"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="8">
            <v-row no-gutters justify="end">
              <v-col cols="12" md="4" sm="auto">
                <v-select
                  v-model="exportFormat"
                  dense
                  :items="exportOptions"
                  label="Export As"
                  outlined
                  item-text="label"
                  item-value="value"
                  :placeholder="
                    'Export as ' + (exportFormat ? exportFormat : '')
                  "
                  :color="exportFormat ? 'green' : ''"
                  @change="handleExport"
                ></v-select>
              </v-col>
              <v-col cols="12" md="auto" class="d-flex mt-1 pl-3">
                <div class="title">
                  {{ pagination.from }} - {{ pagination.to }} of
                  {{ pagination.totalItems }}
                </div>
                <v-btn
                  class="mx-1"
                  fab
                  x-small
                  outlined
                  color="primary"
                  :disabled="pagination.options.page <= 1"
                  @click="pageChange(false)"
                >
                  <v-icon dark>mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn
                  class="mx-1"
                  fab
                  x-small
                  outlined
                  color="primary"
                  :disabled="pagination.options.page >= pagination.totalPages"
                  @click="pageChange(true)"
                >
                  <v-icon dark>mdi-chevron-right</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </template>
      <template #item.buyerName="{ item }">
        <span>{{ item.buyer.firstName }} {{ item.buyer }}</span>
      </template>
      <template #item.farmerName="{ item }">
        <span>{{ item.farmer.firstName }} {{ item.farmer.lastName }}</span>
      </template>
      <template #item.cacao_weight="{ item }">
        <span>{{ item.cacao_weight }}</span>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { debounce } from 'lodash';

import CacaoDataService from "@/_services/CacaoDataService";
import DownloadMixin from "@/mixins/DownloadMixin";
import loadingMixin from "@/mixins/LoadingMixin";
import {convertWeightIntoBaseUnit} from "@/utils.js"
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
    tab: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      searchPhrase: "",
      exportFormat: null,
      exportOptions: [
        {
          label: "CSV",
          value: "csv",
        },
        {
          label: "Excel",
          value: "xls",
        },
        {
          label: "PDF",
          value: "pdf",
        },
      ],
      pagination: {
        options: {
          page: 1,
          itemsPerPage: 10,
          sortBy: [],
          sortDesc: [],
        },
        totalItems: this.count,
        itemsPerPageOptions: [10, 20, 30],
        from: 1,
        to: Math.min(this.count, 10),
        totalPages: Math.ceil(this.count / 10),
      },
      loading: false,
      headers: [
        {
          text: `${this.tab == 0 ? "Selling " : "Purchasing "}ID`,
          value: "id",
          sortable: true,
        },
        {
          text: this.tab == 0 ? "Buyer Name" : "Farmer Name",
          value: this.tab == 0 ? "buyerName" : "farmerName",
          sortable: false,
        },
        { text: "Weight (KG)", value: "cacao_weight", sortable: false },
        { text: "Purchasing Date", value: "purchasedAt", sortable: false },
        // { text: "Quality", value: "", sortable: false },
        { text: "Unit Price", value: "perKgPrice", sortable: false },
        { text: "Total Price", value: "grandTotal", sortable: false },
      ],
      rows: this.items,
    };
  },
  filters:{
    convertWeight(value){
      return convertWeightIntoBaseUnit(value)
    }
  },
  computed: {
    filteredItems() {
      return this.rows.length === 0 ? this.items : this.rows;
    },
    tabMap() {
      return this.tab === 1 ? "purchaseOrders" : "sellOrders";
    },
    pageAction() {
      return this.tab === 1 ? "Purchasing" : "Selling";
    },
  },
  methods: {
    async handleExport() {
      this.startLoading();
      let params = {
        startDate: this.$route.params.startDate,
        endDate: this.$route.params.endDate,
        orderType: this.tab ? "purchase" : "sell",
        exportType: this.exportFormat,
      };
      const response = await CacaoDataService.downloadCacaoOverviewDetails(
        params,
        this.$route.params.id
      );
      this.downloadBlob(
        response.data,
        "cacao-overview-details." + this.exportFormat
      );
      this.stopLoading();
    },
    async fetchData() {
      try {
        this.loading = true;
        const start =
          (this.pagination.options.page - 1) *
          this.pagination.options.itemsPerPage;
        const end = start + this.pagination.options.itemsPerPage;

        const { data } = await CacaoDataService.getCacaoBuySellDetails(
          {
            page: this.pagination.options.page,
            limit: this.pagination.options.itemsPerPage,
            searchPhrase: this.searchPhrase,
            startDate: this.$route.params.startDate,
            endDate: this.$route.params.endDate,
          },
          this.$route.params.id
        );

        if (data && data[this.tabMap] && data[this.tabMap].rows) {
          this.rows = data[this.tabMap].rows;
          this.pagination.totalItems = data[this.tabMap].count || 0;
        } else {
          this.rows = [];
          this.pagination.totalItems = 0;
        }

        this.pagination.from = start + 1;
        this.pagination.to = Math.min(end, this.pagination.totalItems);
        this.pagination.totalPages = Math.ceil(
          this.pagination.totalItems / this.pagination.options.itemsPerPage
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.loading = false;
      }
    },
    debouncedFetchData: debounce(function () {
      this.fetchData();
    }, 500),
    searchQuery() {
      this.pagination.options.page = 1;
      this.debouncedFetchData();
    },
    clearSearchValue() {
      this.searchPhrase = "";
      this.fetchData();
    },
    pageChange(next) {
      if (next) {
        this.pagination.options.page++;
      } else {
        this.pagination.options.page--;
      }
      this.fetchData();
    },
  },
  watch: {
    items(newItems) {
      this.rows = newItems;
      this.pagination.totalItems = newItems.length;
      this.pagination.totalPages = Math.ceil(
        this.pagination.totalItems / this.pagination.options.itemsPerPage
      );
      this.pagination.from = 1;
      this.pagination.to = Math.min(
        this.pagination.options.itemsPerPage,
        this.pagination.totalItems
      );
    },
    count(newCount) {
      this.pagination.totalItems = newCount;
      this.pagination.totalPages = Math.ceil(
        this.pagination.totalItems / this.pagination.options.itemsPerPage
      );
      this.pagination.from = 1;
      this.pagination.to = Math.min(
        this.pagination.options.itemsPerPage,
        this.pagination.totalItems
      );
    },
    searchPhrase(newVal) {
      if (newVal) {
        this.searchQuery(); 
      }
    }
  },
  mixins: [loadingMixin, DownloadMixin],
};
</script>
