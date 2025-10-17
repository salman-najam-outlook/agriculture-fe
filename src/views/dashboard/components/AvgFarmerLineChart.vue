<template>
  <v-card elevation="0" class="px-5 pb-5 mt-5 avg_farmer_line_chart">
    <v-toolbar flat height="auto">
      <v-toolbar-title>{{ $t("reports.avgPriceFarmer") }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-select
          v-if="filterType === 'month'"
          :items="years"
          item-text="name"
          item-value="value"
          outlined
          dense
          class="text-no-wrap"
          style="width: 140px"
          background-color="primary"
          :placeholder="$t('reports.selectYear')"
          v-model="filterDateYear"
          @change="getYearData"
        ></v-select>
        <v-select
          :items="filterOptions"
          item-text="name"
          item-value="value"
          outlined
          dense
          class="text-no-wrap"
          style="width: 140px"
          background-color="primary"
          @change="changeFilter"
          v-model="filterType"
        ></v-select>
      </v-toolbar-items>
    </v-toolbar>
    <v-divider class="mb-4" />
    <div class="card_filters">
      <GenderSelect v-model="filterParams.gender" @change="getGraphData" />
    </div>
    <v-scale-transition>
      <v-card-text v-if="loading">
        <v-skeleton-loader type="text" />
      </v-card-text>
    </v-scale-transition>
    <v-card-text>
      <LineChart :chartData="chartData" :options="chartOptions" />
    </v-card-text>
  </v-card>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";
import LineChart from "./Line.vue";
import DashboardReportService from "@/_services/DashboardReportService";
import GenderSelect from "@/components/GenderSelect";
import { mapGetters } from "vuex";

export default {
  components: {
    LineChart,
    GenderSelect,
  },
  async mounted() {
    this.initializeYears();
    await this.fetchInitialData();
  },
  data() {
    const currentYear = new Date().getFullYear();
    return {
      loading: true,
      year: currentYear,
      years: Array.from({ length: 10 }, (_, i) => currentYear - i),
      menu1: false,
      filterDateMonth: "",
      filterDateYear: currentYear,
      filterType: "month",
      filterParams: {
        gender: "",
        farmer: "",
        startDate: "",
        endDate: "",
        countryCode: "",
      },
      months: [
        this.$t("january"),
        this.$t("february"),
        this.$t("march"),
        this.$t("april"),
        this.$t("may"),
        this.$t("june"),
        this.$t("july"),
        this.$t("august"),
        this.$t("september"),
        this.$t("october"),
        this.$t("november"),
        this.$t("december"),
      ],

      monthLookup: {
        January: this.$t("january"),
        February: this.$t("february"),
        March: this.$t("march"),
        April: this.$t("april"),
        May: this.$t("may"),
        June: this.$t("june"),
        July: this.$t("july"),
        August: this.$t("august"),
        September: this.$t("september"),
        October: this.$t("october"),
        November: this.$t("november"),
        December: this.$t("december"),
      },

      chartOptions: {
        chart: {
          id: "basic-line-chart",
        },
        annotations: {
          yaxis: [],
        },
      },
      chartData: {
        labels: [],
        datasets: [
          {
            backgroundColor: "green",
            data: [],
          },
        ],
      },
      filterOptions: [
        { name: this.$t("byMonth"), value: "month" },
        { name: this.$t("byYear"), value: "year" },
      ],
    };
  },
  computed: {
    ...mapGetters("filterParams", [
      "globalGender",
      "globalCountry",
      "globalWeightUnit",
    ]),
    ...mapGetters("globalSettings", ["getWeightUnits"]),
    weightConversionFactor() {
      const selectedUnit = this.getWeightUnits.find(
        (unit) => unit.abbvr === this.globalWeightUnit
      );
      return selectedUnit ? selectedUnit.factor : 1;
    },
  },
  watch: {
    globalCountry: "handleGlobalChange",
    globalGender: "handleGlobalChange",
    globalWeightUnit: "handleGlobalChange",
  },
  methods: {
    initializeYears() {
      this.years = Array.from({ length: 10 }, (_, i) => this.year - i);
    },
    async fetchInitialData() {
      await this.getYearData();
    },
    async getGraphData() {
      this.loading = true;
      try {
        const params = this.getFilterParams();
        const res = await DashboardReportService.getAvgPriceInterval(params);
        this.dashboardData = res.data.avgFarmerPaidChart;
        this.updateChartData(this.dashboardData);
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    updateChartData(data) {
      const labels = this.filterType === "month" ? this.months : this.years;
      const apiResponseMap = new Map(
        data.map((item) => [
          this.filterType === "month" ?  this.monthLookup[item.month] : item.year,
          parseFloat(item.averagePricePerKg) * this.weightConversionFactor,
        ])
      );
      const resultArray = labels.map((label) => apiResponseMap.get(label) || 0);
      this.chartData.labels = labels;
      this.chartData.datasets[0].data = resultArray;

      const avg = (
        resultArray.reduce((a, b) => a + b, 0) / data.length
      ).toFixed(0);
      if (avg > 0) {
        this.chartOptions.annotations.yaxis = [
          {
            y: avg,
            borderColor: "#00BD73",
            label: {
              borderColor: "#00BD73",
              style: { color: "#fff", background: "#00BD73" },
              text: this.$t("reports.avgPrice") + " : " + avg,
            },
          },
        ];
      }
    },
    setDateRange(startDate, endDate) {
      this.filterParams.startDate = startDate;
      this.filterParams.endDate = endDate;
      this.getGraphData();
    },
    monthFilter() {
      const date = new Date(`${this.filterDateMonth}-01`);
      const firstDay = `${this.filterDateMonth}-01`;
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
        .toISOString()
        .substr(0, 10);
      this.setDateRange(firstDay, lastDay);
      this.menu1 = false;
    },
    changeFilter(filterType) {
      this.filterType = filterType;
      this.getDefaultData();
    },
    getDefaultData() {
      if (this.filterType === "year") {
        const currentDate = new Date();
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setFullYear(currentDate.getFullYear() - 1);
        this.setDateRange(
          twelveMonthsAgo.toISOString().slice(0, 10),
          currentDate.toISOString().slice(0, 10)
        );
      } else {
        this.getYearData();
      }
    },
    getYearData() {
      const startDate = `${this.filterDateYear}-01-01`;
      const endDate = `${this.filterDateYear}-12-31`;
      this.setDateRange(startDate, endDate);
    },
    getFilterParams() {
      return {
        sDate: this.filterParams.startDate,
        eDate: this.filterParams.endDate,
        filterType: this.filterType,
        gender: this.filterParams.gender,
        farmer: this.filterParams.farmer,
        countryCode: this.filterParams.countryCode,
      };
    },
    handleGlobalChange() {
      this.filterParams.countryCode = this.globalCountry;
      this.filterParams.gender = this.globalGender;
      this.getGraphData();
    },
  },
  mixins: [loadingMixin],
};
</script>
