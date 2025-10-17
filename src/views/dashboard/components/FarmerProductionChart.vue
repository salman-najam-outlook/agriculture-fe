<template>
  <v-card elevation="0" class="px-5 pb-5 mt-5 farmer_production_chart">
    <v-toolbar flat height="auto">
      <v-toolbar-title
        >{{ $t("reports.farmerProdChart") }} ({{
          $t("topFive")
        }})</v-toolbar-title
      >
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
          <v-date-picker v-model="filterDateMonth" type="month" no-title>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="monthFilter">
              {{ $t("confirm") }}
            </v-btn>
          </v-date-picker>
        </v-menu>
        <v-menu
          v-model="menu2"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
          v-if="filterType == 'custom'"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="filterDateCustom"
              readonly
              v-bind="attrs"
              v-on="on"
              outlined
              dense
              style="width: 220px"
              background-color="primary"
              color="white"
              placeholder="Select Date Range"
            ></v-text-field>
          </template>
          <v-date-picker v-model="filterDateCustom" range no-title>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="customFilter">
              {{ $t("confirm") }}
            </v-btn>
          </v-date-picker>
        </v-menu>
        <v-menu
          v-model="menu3"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
          v-if="filterType == 'week'"
          class="xxxxxy"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="filterDateWeek"
              readonly
              v-bind="attrs"
              v-on="on"
              outlined
              dense
              style="width: 220px"
              background-color="primary"
              color="white"
              class="white--text"
              :placeholder="$t('selectWeek')"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="filterDateWeek"
            @input="weekChange"
            no-title
            range
            show-adjacent-months
            class="xxxxxc"
          >
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="weekFilter" class="mt-n8">
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
        />
        <v-select
          :items="[
            { name: this.$t('byWeek'), value: 'week' },
            { name: this.$t('byMonth'), value: 'month' },
            { name: this.$t('byYear'), value: 'year' },
            { name: this.$t('custom'), value: 'custom' },
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
    <v-card-text>
      <BarChart
        :chartData="chartData"
        :chartOptions="chartOptions"
        :isHorizontal="true"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";
import BarChart from "./Bar.vue";
import GenderSelect from "@/components/GenderSelect";
import FarmerSelect from "@/components/FarmerSelect";
import { mapGetters } from "vuex/dist/vuex.common.js";
export default {
  components: {
    GenderSelect,
    BarChart,
    FarmerSelect,
  },
  async mounted() {
    await this.initialLoad();
  },
  computed: {
    ...mapGetters("filterParams", [
      "globalGender",
      "globalCountry",
      "globalWeightUnit",
    ]),
    ...mapGetters("globalSettings", ["getWeightUnits"]),
    combinedFilterParams() {
      return {
        ...this.filterParams,
        countryCode: this.globalCountry || "",
      };
    },
    graphDataUrl() {
      let url = "/reports/farmers";
      const params = new URLSearchParams({
        ...this.combinedFilterParams,
      }).toString();
      if (params) {
        url += `?${params}`;
      }
      return url;
    },
  },
  data() {
    return {
      dashboardData: [],
      loading: true,
      year: new Date().getFullYear(),
      years: [],
      menu1: false,
      menu2: false,
      menu3: false,
      filterDateCustom: [],
      filterDateMonth: "",
      filterDateYear: new Date().getFullYear(),
      filterDateWeek: [],
      filterType: "year",
      filterParams: {
        gender: "",
        farmer: "",
        startDate: "",
        endDate: "",
      },
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      chartOptions: {
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
        this.getGraphData();
      },
    },
    globalGender: {
      handler() {
        this.filterParams.gender = this.globalGender;
      },
    },
    globalWeightUnit: {
      handler(newVal, oldVal) {
        this.convertDataWeight(newVal, oldVal);
      },
    },
  },
  methods: {
    initialLoad() {
      this.initializeYears();
      this.getYearData();
    },
    initializeYears() {
      for (let i = this.year; i > this.year - 10; i--) {
        this.years.push(i);
      }
    },
    genderFilter() {
      this.getGraphData();
    },
    async getGraphData() {
      this.loading = true;
      try {
        const { data } = await this.$http.get(this.graphDataUrl);
        this.dashboardData = data.data.farmerChart;
        this.prepareChartData();
        this.loading = false;
      } catch (e) {
        console.log(e);
        this.loading = false;
      }
    },

    prepareChartData() {
      const labels = [];
      const dataSet = [];
      for (const item of this.dashboardData) {
        labels.push(item.farmerName || "");
        dataSet.push(item.yield || 0);
      }
      this.chartData.datasets[0].data = dataSet;
      this.chartData.labels = labels;
      this.convertDataWeight(this.globalWeightUnit, "");
    },

    monthFilter() {
      var date = new Date(`${this.filterDateMonth}-01`);
      var firstDay = `${this.filterDateMonth}-01`;
      var lastDayX = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      var lastDay =
        lastDayX.getFullYear() +
        "-" +
        (lastDayX.getMonth() + 1) +
        "-" +
        lastDayX.getDate();
      this.filterParams.startDate = firstDay;
      this.filterParams.endDate = lastDay;
      this.getGraphData();
      this.menu1 = false;
    },
    customFilter() {
      this.filterParams.startDate = this.filterDateCustom[0];
      this.filterParams.endDate = this.filterDateCustom[1];
      this.getGraphData();
      this.menu2 = false;
    },
    weekChange() {
      var curr = new Date(this.filterDateWeek[0]); // get current date
      var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
      var last = first + 6; // last day is the first day + 6

      var firstday = new Date(curr.setDate(first)).toISOString().substr(0, 10);
      var lastday = new Date(curr.setDate(last)).toISOString().substr(0, 10);
      this.filterDateWeek = [firstday, lastday];
    },
    weekFilter() {
      this.filterParams.startDate = this.filterDateWeek[0];
      this.filterParams.endDate = this.filterDateWeek[1];
      this.getGraphData();
      this.menu3 = false;
    },
    getYearData() {
      this.filterParams.startDate = `${this.filterDateYear}-01-01`;
      this.filterParams.endDate = `${this.filterDateYear}-12-31`;
      this.getGraphData();
    },
    convertDataWeight(newUnit, oldUnit) {
      if (oldUnit === newUnit) return;
      const weightUnits = this.getWeightUnits;
      console.log("weightUnits", weightUnits);
      const oldUnitIndex = weightUnits.findIndex(
        (unit) => unit.abbvr === oldUnit
      );
      const newUnitIndex = weightUnits.findIndex(
        (unit) => unit.abbvr === newUnit
      );
      const conversionRate =
        weightUnits[oldUnitIndex].factor / weightUnits[newUnitIndex].factor;

      this.chartData.datasets[0].data = this.chartData.datasets[0].data.map(
        (value) => value * conversionRate
      );
    },
  },
  mixins: [loadingMixin],
};
</script>
