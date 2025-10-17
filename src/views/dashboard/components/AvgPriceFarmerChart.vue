<template>
  <v-card elevation="0" class="px-5 mt-5 avg_price_farmer_chart">
    <v-toolbar flat height="auto">
      <v-toolbar-title
        >{{ $t("reports.avgPrice") }} ({{ $t("topFive") }})
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-menu
          v-model="menu1"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
          v-if="filterType == 'month'"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="filterDateMonth"
              readonly
              v-bind="attrs"
              v-on="on"
              outlined
              dense
              style="width: 220px"
              background-color="primary"
              color="white"
              :placeholder="$t('selectMonth')"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="filterDateMonth"
            type="month"
            no-title
            :max="new Date().toISOString().split('T')[0]"
          >
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="monthFilter">
              {{ $t("confirm") }}
            </v-btn>
          </v-date-picker>
        </v-menu>
        <v-select
          v-if="filterType == 'year'"
          :items="years"
          item-text="name"
          item-value="value"
          outlined
          dense
          class="text-no-wrap"
          style="width: 140px"
          background-color="primary"
          v-model="filterDateYear"
          @change="getYearData"
        ></v-select>
        <v-select
          :items="[
            { name: this.$t('byMonth'), value: 'month' },
            { name: this.$t('byYear'), value: 'year' },
          ]"
          item-text="name"
          item-value="value"
          outlined
          dense
          class="text-no-wrap"
          style="width: 140px"
          background-color="primary"
          v-model="filterType"
        />
      </v-toolbar-items>
    </v-toolbar>
    <v-divider class="mb-4" />
    <div class="card_filters">
      <GenderSelect v-model="filterParams.gender" @change="getGraphData" />
      <FarmerSelect v-model="filterParams.farmer" @change="getGraphData" />
    </div>
    <v-scale-transition>
      <v-card-text v-if="loading">
        <v-skeleton-loader type="text" />
      </v-card-text>
    </v-scale-transition>
    <BarChart
      :chartData="chartData"
      :chartOptions="chartOptions"
      :isHorizontal="true"
      :xaxisLabel="currency"
      :bottomText="globalWeightUnit"
    />
  </v-card>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";
import DashboardReportService from "@/_services/DashboardReportService";
import BarChart from "./Bar.vue";
import store from "../../../store";
import GenderSelect from "@/components/GenderSelect";
import FarmerSelect from "@/components/FarmerSelect";
import { mapGetters } from "vuex";

export default {
  components: {
    BarChart,
    GenderSelect,
    FarmerSelect,
  },
  async mounted() {
    this.initializeYears();
    await this.fetchInitialData();
  },
  computed: {
    ...mapGetters("filterParams", [
      "globalGender",
      "globalCountry",
      "globalWeightUnit",
    ]),
    ...mapGetters("globalSettings", ["getWeightUnits"]),
    currency() {
      return `Price (${store.getters.getCurrency})`;
    },
    weightConversionFactor() {
      const weightUnits = this.getWeightUnits;
      const selectedUnit = weightUnits.find(
        (unit) => unit.abbvr === this.globalWeightUnit
      );
      return selectedUnit ? selectedUnit.factor : 1;
    },
  },
  data() {
    const currentYear = new Date().getFullYear();

    return {
      loading: true,
      year: currentYear,
      years: Array.from({ length: 10 }, (_, i) => currentYear - i),
      menu1: false,
      filterDateCustom: [],
      filterDateMonth: "",
      filterDateYear: currentYear,
      filterDateWeek: [],
      filterType: "year",
      filterParams: {
        gender: "",
        farmer: "",
        startDate: "",
        endDate: "",
        countryCode: "",
      },
      date: new Date().toISOString().substr(0, 10),
      chartOptions: {
        chart: {
          height: 10,
        },
       
        responsive: true,
        interaction: {
          mode: "index",
          intersect: true,
        },
        stacked: true,
       
      },
      chartData: {
        labels: [],
        datasets: [
          {
            data: [],
          },
        ],
      },
    };
  },
  watch: {
    globalCountry: {
      handler() {
        this.filterParams.countryCode = this.globalCountry;
        this.getGraphData();
      },
      deep: true,
    },
    globalGender: {
      handler() {
        this.filterParams.gender = this.globalGender;
        this.getGraphData();
      },
      deep: true,
    },
    globalWeightUnit: {
      handler() {
        this.updateChartData(this.dashboardData);
      },
    },
  },
  methods: {
    async fetchInitialData() {
      await this.getYearData();
    },
    async getGraphData() {
      this.loading = true;
      try {
        const params = this.getFilterParams();
        const { data } = await DashboardReportService.getAvgPriceFarmer(params);
        this.dashboardData = data.avgFarmerPaidChart; // Store raw data
        this.updateChartData(data.avgFarmerPaidChart);
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    updateChartData(data) {
      const factor = this.weightConversionFactor;
      this.chartData.labels = data.map((item) => item.farmer.fullName || "");
      this.chartData.datasets[0].data = data.map((item) =>
        (parseFloat(item.averageGrandTotal) * factor).toFixed(2)
      );
    },
    setDateRange(startDate, endDate) {
      this.filterParams.startDate = startDate;
      this.filterParams.endDate = endDate;
      this.getGraphData();
    },
    monthFilter() {
      const firstDay = `${this.filterDateMonth}-01`;
      const lastDay = new Date(
        new Date(this.filterDateMonth).getFullYear(),
        new Date(this.filterDateMonth).getMonth() + 1,
        0
      )
        .toISOString()
        .substr(0, 10);
      this.setDateRange(firstDay, lastDay);
      this.menu1 = false;
    },
    getYearData() {
      const startDate = `${this.filterDateYear}-01-01`;
      const endDate = `${this.filterDateYear}-12-31`;
      this.setDateRange(startDate, endDate);
    },
    initializeYears() {
      this.years = Array.from({ length: 10 }, (_, i) => this.year - i);
    },
    getFilterParams() {
      return {
        sDate: this.filterParams.startDate,
        eDate: this.filterParams.endDate,
        gender: this.filterParams.gender,
        farmer: this.filterParams.farmer,
        countryCode: this.filterParams.countryCode,
      };
    },
  },
  mixins: [loadingMixin],
};
</script>
