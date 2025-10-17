<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div>
        <div class="top_bar d-flex mb-4 ga-2 flex-wrap">
          <h2 class="mr-lg-0 mr-10">{{ $t("userDashboard") }}</h2>
          <v-spacer></v-spacer>
          <div class="d-flex ga-2 flex-wrap">
            <v-btn
              @click="showConfigureSetting = true"
              variant="plain"
              borderless
              text
            >
              <v-icon>mdi-cog</v-icon
              ><span class="mx-2">{{ $t("dashboardSettings") }}</span
              ><v-icon>mdi-menu-down</v-icon>
            </v-btn>
            <GenderSelect
              class="globalFilterSelect"
              v-model="globalFilters.gender"
              @change="updateGlobalFilter('gender', $event)"
            />
            <WeightSelect
              v-model="globalFilters.weightUnit"
              @change="updateGlobalFilter('weightUnit', $event)"
              class="globalFilterSelect"
            />
            <CountrySelect
              v-model="globalFilters.country"
              @change="updateGlobalFilter('country', $event)"
              class="globalFilterSelect"
            />
            <!-- <CurrencySelect
              v-model="globalFilters.currency"
              @change="updateGlobalFilter('currency', $event)"
              class="globalFilterSelect"
            /> -->
            <div class="d-flex">
              <v-btn
                color="primary"
                dark
                class="rounded-r-0"
                outlined
                @click="dashboardType = 'details'"
              >
                <v-icon
                  :color="dashboardType === 'details' ? 'primary' : 'gray'"
                  >mdi-menu</v-icon
                >
              </v-btn>
              <v-btn
                color="primary"
                dark
                class="rounded-l-0"
                outlined
                style="margin-left: -1px"
                @click="dashboardType = 'chart'"
              >
                <v-icon :color="dashboardType === 'chart' ? 'primary' : 'gray'"
                  >mdi-chart-bar</v-icon
                >
              </v-btn>
            </div>
          </div>
        </div>
        <!-- Graph charts start -->
        <div v-if="dashboardType === 'chart'" class="dashboard_charts">
          <v-row class="" width="100%">
            <v-col
              lg="6"
              md="6"
              sm="12"
              xs="12"
              v-if="showHideConfig.users.show === true"
            >
              <user-list-chart />
            </v-col>
            <v-col
              lg="6"
              md="6"
              sm="12"
              xs="12"
              v-if="showHideConfig.genderChart.show === true"
            >
              <gender-chart />
            </v-col>
          </v-row>
          <v-row class="" width="100%">
            <v-col
              lg="6"
              md="6"
              sm="12"
              xs="12"
              v-if="showHideConfig.farmerProductionChart.show === true"
            >
              <farmer-production-chart />
            </v-col>
            <v-col
              lg="6"
              md="6"
              sm="12"
              xs="12"
              v-if="showHideConfig.buyingStationProductionChart.show === true"
            >
              <buying-station-production-chart />
            </v-col>
          </v-row>

          <v-row class="" width="100%">
            <v-col
              cols="12"
              v-if="showHideConfig.dryMillingProductionChart.show === true"
            >
              <dry-milling-production-chart />
            </v-col>
          </v-row>

          <v-row class="" width="100%">
            <v-col
              lg="6"
              md="6"
              sm="12"
              xs="12"
              v-if="showHideConfig.membershipPlan.show === true"
            >
              <MembershipPlanChart />
            </v-col>
            <v-col
              lg="6"
              md="6"
              sm="12"
              xs="12"
              v-if="showHideConfig.membershipValidity.show === true"
            >
              <MembershipValidityChart />
            </v-col>
          </v-row>
          <v-row class="" width="100%">
            <v-col
              lg="6"
              md="6"
              sm="12"
              xs="12"
              v-if="showHideConfig.avgFarmerLineChart.show === true"
            >
              <avg-price-farmer-chart />
            </v-col>
            <v-col
              lg="6"
              md="6"
              sm="12"
              xs="12"
              v-if="showHideConfig.avgFarmerLineChart.show === true"
            >
              <avg-farmer-line-chart />
            </v-col>
          </v-row>
        </div>
        <!-- graph chart ends -->

        <!-- List View Charts -->
        <div v-if="dashboardType === 'details'">
          <v-row class="" width="100%">
            <v-col
              lg="6"
              md="6"
              sm="12"
              xs="12"
              v-if="showHideConfig.farmerProductionChart.show === true"
            >
              <farmer-production-list />
            </v-col>
            <v-col
              lg="6"
              md="6"
              sm="12"
              xs="12"
              v-if="showHideConfig.buyingStationProductionChart.show === true"
            >
              <buying-station-production-list />
            </v-col>
          </v-row>
          <v-row class="" width="100%">
            <v-col
              cols="12"
              v-if="showHideConfig.dryMillingProductionChart.show === true"
            >
              <dry-milling-production-list />
            </v-col>
            <v-col
              lg="6"
              md="6"
              sm="12"
              xs="12"
              v-if="showHideConfig.users.show === true"
            >
              <user-list-view />
            </v-col>
          </v-row>
          <v-row class="" width="100%">
            <v-col
              lg="6"
              md="6"
              sm="12"
              xs="12"
              v-if="showHideConfig.avgFarmerLineChart.show === true"
            >
              <avg-farmer-line-list />
            </v-col>
            <v-col
              lg="6"
              md="6"
              sm="12"
              xs="12"
              v-if="showHideConfig.avgPriceFarmerChart.show === true"
            >
              <avg-price-farmer-list />
            </v-col>
          </v-row>
          <v-row class="" width="100%">
            <v-col
              lg="6"
              md="6"
              sm="12"
              xs="12"
              v-if="showHideConfig.genderChart.show === true"
            >
              <gender-list />
            </v-col>
          </v-row>
        </div>
        <!-- list view charts start -->
      </div>
      <DashboardSettingDialog
        v-if="showConfigureSetting"
        :showHideConfig="showHideConfig"
        :dialogI="showConfigureSetting"
        @closeDialog="showConfigureSetting = false"
        @configureDone="showHideCharts"
      />
    </v-container>
  </div>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";
import UserListView from "./components/UserListView.vue";
import UserListChart from "./components/UserListChart.vue";
import FarmerProductionList from "./components/FarmerProductionList.vue";
import FarmerProductionChart from "./components/FarmerProductionChart.vue";
import BuyingStationProductionList from "./components/BuyingStationProductionList.vue";
import BuyingStationProductionChart from "./components/BuyingStationProductionChart.vue";
import DryMillingProductionList from "./components/DryMillingProductionList.vue";
import DryMillingProductionChart from "./components/DryMillingProductionChart.vue";
import MembershipPlanChart from "./components/MembershipPlanChart.vue";
import MembershipValidityChart from "./components/MembershipValidityChart.vue";
import DashboardSettingDialog from "./components/DashboardSettingDialog.vue";
import GenderChart from "./components/GenderChart.vue";
import GenderList from "./components/GenderList.vue";
import AvgPriceFarmerChart from "./components/AvgPriceFarmerChart.vue";
import AvgPriceFarmerList from "./components/AvgPriceFarmerList.vue";
import AvgFarmerLineChart from "./components/AvgFarmerLineChart.vue";
import AvgFarmerLineList from "./components/AvgFarmerLineList.vue";
import GenderSelect from "@/components/GenderSelect";
import { mapState, mapActions } from "vuex/dist/vuex.common.js";
import CountrySelect from "@/components/CountrySelect.vue";
// import CurrencySelect from "@/components/CurrencySelect.vue";
import WeightSelect from "@/components/WeightSelect.vue";
export default {
  async mounted() {
    document.title = this.$t("dashboard");
  },
  components: {
    GenderSelect,
    WeightSelect,
    CountrySelect,
    // CurrencySelect,  later to be added when currency filter functionality is ready
    UserListView,
    UserListChart,
    FarmerProductionList,
    FarmerProductionChart,
    BuyingStationProductionList,
    BuyingStationProductionChart,
    DryMillingProductionList,
    DryMillingProductionChart,
    MembershipPlanChart,
    MembershipValidityChart,
    DashboardSettingDialog,
    GenderChart,
    GenderList,
    AvgPriceFarmerChart,
    AvgPriceFarmerList,
    AvgFarmerLineChart,
    AvgFarmerLineList,
  },
  data() {
    return {
      dashboardType: "chart",
      loading: true,
      width: 2,
      radius: 10,
      padding: 8,
      lineCap: "round",
      gradient: ["#f72047", "#ffd200", "#1feaea"],
      value: [0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0],
      gradientDirection: "top",
      fill: false,
      type: "trend",

      autoLineWidth: false,
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: true,
          to: "/",
        },
      ],
      showConfigureSetting: false,
      showHideConfig: {
        farmerProductionChart: {
          label: this.$t("reports.farmerProdChart"),
          show: true,
        },
        buyingStationProductionChart: {
          label: this.$t("reports.buyingStationProdChart"),
          show: true,
        },
        dryMillingProductionChart: {
          label: this.$t("reports.dryMillingProdChart"),
          show: true,
        },
        users: { label: this.$t("users"), show: true },
        membershipPlan: {
          label: this.$t("activationKey.membershipPlan"),
          show: true,
        },
        membershipValidity: {
          label: this.$t("membership.validity"),
          show: true,
        },
        genderChart: { label: this.$t("reports.gender"), show: true },
        avgPriceFarmerChart: {
          label: this.$t("reports.avgPriceFarmer"),
          show: true,
        },
        avgFarmerLineChart: { label: this.$t("reports.avgPrice"), show: true },
      },
      unitChoiceList: [
        { text: this.$t("kg"), value: "kg" },
        { text: this.$t("lbs"), value: "lbs" },
      ],
      countryChoiceList: [
        { text: this.$t("mexico"), value: "mexico" },
        { text: this.$t("usa"), value: "usa" },
        { text: this.$t("canada"), value: "canada" },
      ],
      currencyChoiceList: [
        { text: this.$t("usd"), value: "usd" },
        { text: this.$t("cad"), value: "cad" },
        { text: this.$t("mxn"), value: "mxn" },
      ],
    };
  },
  methods: {
    ...mapActions("filterParams", ["updateGlobalFilter"]),
    showHideCharts(val) {
      this.showConfigureSetting = false;
      this.showHideConfig = val;
    },
  },
  computed: {
    ...mapState("filterParams", {
      globalFilters: (state) => state.filterParams.globalFilters,
    }),
  },
  mixins: [loadingMixin],
};
</script>

<style lang="scss">
.ga-2 {
  gap: 8px;
}
.dashboard_charts {
  .card_filters {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .v-select__selection {
    font-size: 0.875rem;
  }
  .genderFilterSelect {
    max-width: 150px;
  }
  .farmerFilterSelect {
    max-width: 170px;
  }
  .gender_chart {
    height: 97%;
  }
  .v-toolbar {
    padding-top: 1rem !important;
    margin-bottom: 0.5rem;
  }
  .v-toolbar__content {
    padding-inline: 0;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    .v-toolbar__items {
      gap: 8px;
      align-items: center;
    }
    .v-input__control > div[role="button"],
    .v-input__slot {
      margin-bottom: 0;
    }
    .v-text-field__details {
      display: none;
    }
  }
  .apexcharts-toolbar {
    margin-top: -1rem;
    z-index: 4;
    .apexcharts-menu-icon {
      transform: scale(1) !important;
      .chart_download_icon {
        border-radius: 50%;
        width: 2.5rem !important;
        height: 2.5rem !important;
        background: #f5f5f5;
        &:hover {
          background: #e0e0e0;
        }
        display: flex;
        justify-content: center;
        align-items: center;
        svg {
          width: 2rem !important;
          height: 2rem !important;
        }
      }
    }
  }
  .user_by_status_chart {
    .chart_container {
      .apexcharts-canvas {
        width: 100% !important;
        & > svg {
          width: 100% !important;
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.top_bar {
  ::v-deep .v-btn {
    height: 40px;
  }
}
.globalFilterSelect {
  max-width: 120px;
  &.countryFilterSelect,
  &.currencyFilterSelect {
    max-width: 170px;
  }
  ::v-deep .v-select__selection {
    font-size: 0.875rem;
  }
  ::v-deep .v-select__slot > input {
    font-size: 0.875rem;
  }
}
</style>
