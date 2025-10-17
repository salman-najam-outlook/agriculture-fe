<template>
  <v-container>
    <breadcrumb :items="breadcrumbs"></breadcrumb>

    <header class="d-flex justify-space-between py-5">
      <h2>Farm Detail</h2>
      <v-btn
        outlined
        color="teal"
        @click="$router.push({ name: 'BuySellOverview' })"
        >Back</v-btn
      >
    </header>

    <v-row class="farm-details mb-4">
      <v-col md="6" cols="12">
        <v-row>
          <v-col
            cols="12"
            sm="6"
            md="6"
            v-for="card in farmCards"
            :key="card.title"
          >
            <v-card>
              <v-card-text>
                <p>{{ card.value }}</p>
              </v-card-text>
              <v-card-subtitle>
                <h3>{{ card.title }}</h3>
              </v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" sm="6" md="6">
        <v-card class="pa-1">
          <apexchart
            type="pie"
            width="380"
            :options="chartOptions"
            :series="chartData"
          ></apexchart>
        </v-card>
      </v-col>
    </v-row>

    <v-tabs v-model="activeTab">
      <v-tab>Sell Order</v-tab>
      <v-tab>Purchase Order</v-tab>

      <v-tab-item>
        <OrderTable
          v-if="activeTab === 0"
          :tab="activeTab"
          :items="sellOrders.rows"
          :count="sellOrders.count"
        />
      </v-tab-item>
      <v-tab-item>
        <OrderTable
          v-if="activeTab === 1"
          :tab="activeTab"
          :items="purchaseOrders.rows"
          :count="purchaseOrders.count"
        />
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import {convertSizeIntoBaseUnit} from "@/utils.js"
import OrderTable from "./OrderTable.vue";
import CacaoDataService from "@/_services/CacaoDataService";
import LoadingMixin from "@/mixins/LoadingMixin";
export default {
  components: {
    apexchart: VueApexCharts,
    OrderTable,
  },
  props: ["id"],
  watch: {
    id: {
      async handler() {
        await this.fetchDetails();
      },
      immediate: true,
    },
  },
  data() {
    return {
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: true,
          to: "/",
        },
        {
          text: "Cacao",
          disabled: true,
          to: "/",
        },
        {
          text: "Buy Sell Overview",
          disabled: true,
          to: "breadcrumbs_link_1",
        },
        {
          text: "Buy Sell Details",
          disabled: true,
          to: "breadcrumbs_link_1",
        },
      ],
      activeTab: null,
      chartOptions: {
        chart: {
          type: "pie",
        },
        labels: ["Buy", "Sell"], // Replace with dynamic labels if needed
      },
      purchaseOrders: {
        count: 0,
        rows: [],
      },
      sellOrders: {
        count: 0,
        rows: [],
      },
      farmDetails: {},
      chartData: [], // Replace with dynamic data if needed
      pagination: {
        options: {
          page: 1,
          itemsPerPage: 10,
          sortBy: [],
          sortDesc: [],
        },
        totalItems: 0,
        itemsPerPageOptions: [10, 20, 30],
        from: 0,
        to: 0,
        totalPages: 0,
      },
    };
  },
  computed: {
    farmCards() {
      return [
        { title: "Farm Name", value: this.farmDetails.farmName },
        { title: "Farm Location", value: this.farmDetails.address },
        { title: "Area Size", value: this.farmDetails.area },
        {
          title: "Farm Registration ID",
          value: this.farmDetails.registrationNo,
        },
      ];
    },
  },
  methods: {
    convertSizeIntoBaseUnit,
    async fetchDetails() {
      // Fetch farm details

      this.startLoading();
      const { data } = await CacaoDataService.getCacaoBuySellDetails(
        {
          page: this.pagination.options.page,
          limit: this.pagination.options.itemsPerPage,
        },
        this.id
      );
      this.assignChartData(data);
      this.assignFarmDetails(data);
      this.assignOrders(data);
      this.stopLoading();
    },
    assignChartData({ totalPO, totalSO }) {
      this.chartData = [totalPO, totalSO];
    },
    assignFarmDetails(data) {
      this.farmDetails = data.farmDetails;
      this.farmDetails.area = convertSizeIntoBaseUnit(this.farmDetails.area);
    },
    assignOrders(data) {
      this.purchaseOrders = data.purchaseOrders || { rows: [], count: 0 };
      this.sellOrders = data.sellOrders || { rows: [], count: 0 };
    },
  },
  mixins: [LoadingMixin],
};
</script>

<style scoped>
/* Your component's CSS styles go here */
</style>
