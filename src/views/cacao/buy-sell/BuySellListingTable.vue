<template>
  <div>
    <v-data-table
      hide-default-footer
      :headers="headers"
      :items="itemsWithAvgValue"
      :server-items-length="pagination.totalItems"
      :loading="loading"
      :options.sync="pagination.options"
      disable-sort
    >
      <template #top>
        <v-row class="mt-5 pa-2">
          <v-col cols="12" md="4">
            <v-text-field
              prepend-inner-icon="mdi-magnify"
              outlined
              v-model="searchPhrase"
              dense
              clearable
              @click:clear="clearSearchValue"
              :placeholder="$t('search')"
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
                  :label="$t('exportAs')"
                  outlined
                  item-text="label"
                  item-value="value"
                  :placeholder="`Export as ${exportFormat || ''}`"
                  :color="exportFormat ? 'green' : ''"
                  @input="handleExport"
                ></v-select>
              </v-col>
              <v-col cols="12" md="auto" class="d-flex mt-1 pl-3">
                <div class="title">
                  {{ pagination.from }} - {{ pagination.to }} {{$t('of')}} {{ pagination.totalItems }}
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
      <template #item.farmName="{ item }">
        <span @click="handleFarmClick(item)" class="clickable">{{
          item.farmName
        }}</span>
      </template>
      <template #item.user.firstName="{ item }">
        <span>{{ item.user.firstName + " " + item.user.lastName }}</span>
      </template>
      <template v-slot:item.cacaoBuyingStationOrders.sellOrder.totalWeight="{ item }">
      <!-- {{ parseFloat(item.cacaoBuyingStationOrders.sellOrder.totalWeight).toFixed(2)}} -->
      {{ item.totalCacaoWeight }}
    
    </template>
      <template v-slot:item.cacaoBuyingStationOrders.purchaseOrder.avgPerKgPrice="{ item }">
      {{ parseFloat(item.cacaoBuyingStationOrders.purchaseOrder.avgPerKgPrice).toFixed(2) }}
    </template>
    </v-data-table>
  </div>
</template>

<script>
import { debounce } from 'lodash';
import CacaoDataService from "@/_services/CacaoDataService";
import DownloadMixin from "@/mixins/DownloadMixin";
import loadingMixin from "@/mixins/LoadingMixin";
import {convertWeightIntoBaseUnitNumberOnly} from "@/utils.js"
export default {
  data() {
    return {
      searchPhrase: "",
      exportFormat: "",
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
      loading: false,
      headers: [
        {
          text: this.$t("farmName"),
          align: "start",
          sortable: true,
          value: "farmName",
          class: "black--text",
        },
        {
          text: this.$t("buySell.farmerName"),
          align: "start",
          sortable: true,
          value: "user.firstName",
          class: "black--text",
        },
        {
          text: this.$t("buySell.gender"),
          align: "start",
          sortable: true,
          value: "user.gender",
          class: "black--text",
        },
        {
          text: this.$t("buySell.country"),
          align: "start",
          sortable: true,
          value: "country",
          class: "black--text",
        },
        {
          text: this.$t("buySell.noOfOrdersSold"),
          value: "cacaoBuyingStationOrders.sellOrder.totalSellOrder",
          sortable: true,
          class: "black--text",
        },
        {
          text: this.$t("buySell.noOfPurchaseOrders"),
          value: "cacaoBuyingStationOrders.purchaseOrder.totalPurchaseOrder",
          sortable: true,
          class: "black--text",
        },
        {
          text: `${this.$t("buySell.totalPurchaseSaleVolume")} (KG)`,
          value: "cacaoBuyingStationOrders.sellOrder.totalWeight",
          sortable: true,
          class: "black--text",
        },
 
        {
          text: this.$t("buySell.sellingAvgValuePerKg"),
          value: "sellingAvgValuePerKg",
          align: "center",
          sortable: true,
          class: "black--text",
        },
               {
          text: this.$t("buySell.purchaseAvgValuePerKg"),
          value: "purchaseAvgValuePerKg",
          align: "center",
          sortable: true,
          class: "black--text",
        },
      ],
      items: [],
      pagination: {
        options: { page: 1 },
        totalItems: 0,
        itemsPerPage: 10,
        from: 0,
        to: 0,
        totalPages: 0,
      },
    };
  },
  props: ["params"],
  filters:{
    convertWeight(value){
      return convertWeightIntoBaseUnitNumberOnly(value)
    }
  },
  computed: {
    itemsWithAvgValue() {
      return this.items.map(item => {
        const sellAvgPrice = item.cacaoBuyingStationOrders.sellOrder.avgPerKgPrice || 0;
        const purchaseAvgPrice = item.cacaoBuyingStationOrders.purchaseOrder.avgPerKgPrice || 0;
        return {
          ...item,
          purchaseAvgValuePerKg: purchaseAvgPrice.toFixed(2),
          sellingAvgValuePerKg : sellAvgPrice.toFixed(2),
        };
      });
    },
  },
  methods: {
    async handleExport() {
      try {
        this.startLoading();
        let params = {
          gender: this.params.gender,
          country: this.params.country,
          startDate: this.params.startDate,
          endDate: this.params.endDate,
          exportType: this.exportFormat,
        };
        const response = await CacaoDataService.downloadCacaoOverview(params);
        this.downloadBlob(response.data, "cacao-overview." + this.exportFormat);
        this.stopLoading();
      } catch (error) {
        console.error(error);
        this.stopLoading();
      } finally {
        this.stopLoading();
      }
    },
    async fetchData() {
      this.loading = true;
      const start =
        (this.pagination.options.page - 1) * this.pagination.itemsPerPage;
      const {
        data: { count, rows },
      } = await CacaoDataService.getCacaoBuySellOverviewList({
        page: this.pagination.options.page,
        limit: this.pagination.itemsPerPage,
        searchPhrase: this.searchPhrase,
        country: this.params.country,
        startDate: this.params.startDate,
        endDate: this.params.endDate,
        gender: this.params.gender,
      });
      this.items = rows;
      this.pagination.totalItems = count;
      this.pagination.from = start + 1;
      this.pagination.to = start + rows.length;
      this.pagination.totalPages = Math.ceil(
        this.pagination.totalItems / this.pagination.itemsPerPage
      );
      this.loading = false;
    },
    debouncedFetchData: debounce(function () {
      this.fetchData();
    }, 700),
    searchQuery() {
      this.pagination.options.page = 1;
      this.debouncedFetchData();
    },
    resetSearchOnEmpty() {
      if (!this.searchPhrase) {
        this.pagination.options.page = 1;
        this.fetchData();
      }
    },
    filterData() {
      this.pagination.options.page = 1;
      this.fetchData();
    },
    pageChange(next) {
      this.pagination.options.page += next ? 1 : -1;
      this.fetchData();
    },
    clearSearchValue() {
      this.searchPhrase = "";
      this.fetchData();
    },
    handleFarmClick(farm) {
      this.$router.push({
        name: "BuySellOverviewDetail",
        params: {
          id: farm.id,
          startDate: this.params.startDate,
          endDate: this.params.endDate,
        },
      });
    },
  },
  async mounted() {
    await this.fetchData();
  },
  watch: {
    params: {
      handler() {
        this.fetchData();
      },
      deep: true,
      immediate: false,
    },
    searchPhrase() {
      
        this.searchQuery(); // Trigger search when searchPhrase changes
      
    }
  },
  mixins: [loadingMixin, DownloadMixin],
};
</script>

<style scoped>
.clickable {
  cursor: pointer;
  color: blue;
  text-decoration: underline;
}
</style>
