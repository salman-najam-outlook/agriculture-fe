<template>
  <v-card elevation="0" class="px-5 pb-5 mt-5 user_by_status_chart">
    <v-toolbar flat height="auto">
      <v-toolbar-title class="mt-n3">{{
          $t("reports.usersByStatus")
        }}</v-toolbar-title>
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
        ></v-select>
        <div class="white--text">
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
          ></v-select>
        </div>
      </v-toolbar-items>
    </v-toolbar>

    <v-divider class="mb-4" />

    <div class="card_filters">
      <gender-select @change="genderFilter" v-model="filterParams.gender" />
    </div>

    <v-scale-transition>
      <v-card-text v-if="loading">
        <v-skeleton-loader
            type="text"
        />
      </v-card-text>
    </v-scale-transition>
    <v-card-text class="chart_container">
      <BarGrouped :chartData="chartData" />
    </v-card-text>
  </v-card>
</template>

<script>
import BarGrouped from "./BarGrouped.vue";
import GenderSelect from "@/components/GenderSelect";
import { ChartDownloadIcon } from "@/views/dashboard/components/ChartDownloadIcon.ts";
import {mapGetters} from "vuex";

export default {
  components: {
    BarGrouped,
    GenderSelect,
  },
  async mounted() {
    await this.initialLoad();
  },
  computed: {
    ...mapGetters("filterParams", ["globalGender", "globalCountry"]),
    combinedFilterParams() {
      return {
        ...this.filterParams,
        countryCode: this.globalCountry,
      };
    },
    userDataUrl() {
      let url = "/dashboard/users";
      const params = new URLSearchParams({
        ...this.combinedFilterParams,
      }).toString();
      if (params) {
        url += `?${params}`;
      }
      return url;
    },
  },
  watch: {
    globalCountry: {
      handler() {
        this.filterParams.country = this.globalCountry;
        this.getUsersValidityData();
      },
      deep: true,
    },
    globalGender: {
      handler() {
        this.filterParams.gender = this.globalGender;
      },
      deep: true,
    }
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
        startDate: "",
        endDate: "",
      },
      date: new Date().toISOString().substr(0, 10),
      chartOptions: {
        responsive: true,
        interaction: {
          mode: "index",
          intersect: true,
        },
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },
        chart: {
          toolbar: {
            show: true,
            tools: {
              zoom: false,
              selection: false,
              zoomin: false,
              zoomout: false,
              reset: false,
              pan: false,
              download: ChartDownloadIcon,
            },
          },
        },
      },
      chartData: {
        labels: [
          this.$t("dashboardSection.registered"),
          this.$t("dashboardSection.validMemberships"),
          this.$t("dashboardSection.activeUsers"),
          this.$t("dashboardSection.deactivatedUsers"),
          this.$t("dashboardSection.offlineUsers"),
        ],
        datasets: [
          {
            backgroundColor: "green",
            data: [],
          },
        ],
      },
    };
  },
  methods: {
    initialLoad() {
      this.initializeYears();
      this.getYearData();
    },
    async getUsersValidityData() {
      this.loading = true;
      try {
        const { data } = await this.$http.get(this.userDataUrl);
        this.chartData.datasets[0].data = [
          data.data.registeredUsers,
          data.data.validMemberships,
          data.data.activeUsers,
          data.data.deactivatedUsers,
          data.data.offlineUsers,
        ];
      } catch (e) {
        console.error(e)
        this.chartData.datasets[0].data = [0, 0, 0, 0, 0];
      } finally {
        this.loading = false;
      }
    },
    initializeYears() {
      for (let i = this.year; i > this.year - 10; i--) {
        this.years.push(i);
      }
    },
    genderFilter() {
      this.getUsersValidityData();
    },
    monthFilter() {
      const date = new Date(`${this.filterDateMonth}-01`);
      const firstDay = `${this.filterDateMonth}-01`;
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
          .toISOString()
          .substr(0, 10);
      this.filterParams.startDate = firstDay;
      this.filterParams.endDate = lastDay;
      this.getUsersValidityData();
      this.menu1 = false;
    },
    customFilter() {
      this.filterParams.startDate = this.filterDateCustom[0];
      this.filterParams.endDate = this.filterDateCustom[1];
      this.getUsersValidityData();
      this.menu2 = false;
    },
    weekChange() {
      const curr = new Date(this.filterDateWeek[0]);
      const first = curr.getDate() - curr.getDay();
      const last = first + 6;
      const firstDay = new Date(curr.setDate(first))
          .toISOString()
          .substr(0, 10);
      const lastDay = new Date(curr.setDate(last)).toISOString().substr(0, 10);
      this.filterDateWeek = [firstDay, lastDay];
    },
    weekFilter() {
      this.filterParams.startDate = this.filterDateWeek[0];
      this.filterParams.endDate = this.filterDateWeek[1];
      this.getUsersValidityData();
      this.menu3 = false;
    },
    getYearData() {
      this.filterParams.startDate = `${this.filterDateYear}-01-01`;
      this.filterParams.endDate = `${this.filterDateYear}-12-31`;
      this.getUsersValidityData();
    },
  },
};
</script>
