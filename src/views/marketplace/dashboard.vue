<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-4">
        <h2> {{ $t('marketplace.dashboard.title') }}</h2>
        <v-spacer></v-spacer>
      </div>

      <v-card class="pa-8" flat>
        <v-row class="marketplace-cards-holder" dense>
          <minicard :dashboard="dashboardCounts" />
        </v-row>
        <topcard :topCharts="topCharts" />
        <v-row class="d-flex justify-space-between align-start" dense>
          <div class="d-flex align-center">
            <div class="text-h5 font-weight-bold mr-4">
              {{ $t('marketplace.dashboard.localtradevsexport') }}
            </div>
            <v-btn-toggle v-model="toggle_exclusive" dense color="primary" no-caps>
              <v-btn class="time-btn" value="today">
                {{ $t('marketplace.dashboard.today') }}
              </v-btn>
              <v-btn class="time-btn" value="week">
                {{ $t('marketplace.dashboard.week') }}
              </v-btn>
              <v-btn class="time-btn" value="month">
                {{ $t('marketplace.dashboard.month') }}
              </v-btn>
              <v-btn class="time-btn" value="year">
                {{ $t('marketplace.dashboard.year') }}
              </v-btn>
              <v-btn value="custom">
                <v-icon color="primary">mdi-calendar-month</v-icon>
              </v-btn>
            </v-btn-toggle>
          </div>
          <div class="d-flex align-center">
            <v-select :items="items" :placeholder="$t('marketplace.dashboard.selectProductCategory')" class="mr-4"
              outlined color="primary" dense style="width: 250px;"></v-select>
            <v-select :items="items" outlined :placeholder="$t('marketplace.dashboard.export')" dense
              style="width: 100px;"></v-select>
          </div>
        </v-row>
        <v-row>
          <v-col cols="12">
            <apexchart type="line" height="400" :options="chartOptions" :series="series"></apexchart>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
    <confirm-box :title="confirmElements.title" :message="confirmElements.message"
      :cancelBtnText="confirmElements.cancelBtnText" :confirmBtnText="confirmElements.confirmBtnText"
      :confirmData="confirmElements.confirmData" :dialog="confirm"></confirm-box>
  </div>
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import ConfirmBox from "@/components/ConfirmBox";
import Minicard from "./components/dashboard/minicard.vue";
import Topcard from "./components/dashboard/topcart.vue";
import MarketplaceService from "@/_services/MarketplaceService";

export default {
  mounted() {
    this.getDashboardCounts();
    this.getTopChartData();
  },

  components: {
    ConfirmBox,
    Minicard,
    Topcard,
  },
  watch: {},
  data() {
    return {
      dashboardCounts: {},
      toggle_exclusive: "year",
      series: [
        {
          name: this.$t("marketplace.dashboard.export"),
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 45, 23, 15, 67],
        },
        {
          name: this.$t("marketplace.dashboard.trade"),
          data: [148, 91, 69, 62, 49, 51, 35, 41, 10, 89, 34, 23, 45],
        },
      ],
      chartOptions: {
        chart: {
          height: 350,
          type: "line",
          zoom: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
          animations: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
        },
        legend: {
          show: true,
          position: "top",
          horizontalAlign: "right",
        },
        xaxis: {
          categories: [
            "7/12",
            "8/12",
            "9/12",
            "10/12",
            "11/12",
            "12/12",
            "13/12",
            "14/12",
            "15/12",
            "16/12",
            "17/12",
            "18/12",
            "19/12",
          ],
        },
      },
      trees: [
        { text: "Wind Breaker Tree", val: "windbreakertree" },
        { text: "Horticulture Tree", val: "horticulturetree" },
      ],
      tree: null,
      confirm: false,
      confirmElements: {
        title: this.$t("adminRoles.deleteRole"),
        message: "Are you sure you want to delete Supervisor role?",
        confirmBtnText: this.$t("adminRoles.deleteRole"),
        cancelBtnText: "Cancel",
        confirmData: {},
      },
      editedRole: {},
      showEditRole: false,
      tab: 0,
      options: {},
      loading: false,
      search: "",
      from: 0,
      to: 0,
      totalPages: 1,
      roles: [],
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: false,
          exact: true,
        },
      ],
      topCharts: {}

    };
  },
  methods: {
    async getDashboardCounts() {
      const response = await MarketplaceService.getDashboardCounts();
      this.dashboardCounts = response.data || {};
    },
    
    async getTopChartData(){
      const response = await MarketplaceService.getDashboardTopChart();
      console.log(response);
      this.topCharts = response || {};
    }
  },
  mixins: [loadingMixin],
};
</script>
<style scoped>
.marketplace-cards-holder {
  margin-bottom: 40px;
  height: 230px;
  overflow: hidden;
}

.view-all-btn {
  font-weight: bold !important;
}

.time-btn {
  text-transform: unset !important;
}
</style>