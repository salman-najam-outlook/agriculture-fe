<template>
  <div v-if="cropTypes" class="px-4">
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-card class="mb-5" flat>
      <v-card-text class="py-1">
        <v-tabs v-model="tab" align-with-title>
          <v-tab v-for="(value) in tabItems" @click="$router.push(
            {
              name: value.to.name, params: value.to.params
            })" :key="value.label" class="text-capitalize">
            {{ value.label }}
          </v-tab>

        </v-tabs>
      </v-card-text>
    </v-card>
    <v-tabs-items v-model="tab">
        <v-tab-item>
          <RegionalReport />
        </v-tab-item>
        <v-tab-item>
          <!-- TODO: fetch globalSettings from state on component itself  -->
          <FarmersReport :globalSettings="globalSettings"/>
        </v-tab-item>
        <v-tab-item>
          <FarmsReport :key="farmPropKey" :globalSettings="globalSettings"/>
        </v-tab-item>
        <v-tab-item>
          <CropsReport :globalSettings="globalSettings"/>
        </v-tab-item>
        <v-tab-item>
          <PestReport :cropTypes="cropTypes" />
        </v-tab-item>
        <v-tab-item>
          <EqipmentReport />
        </v-tab-item>
        <v-tab-item>
          <GoalsReport />
        </v-tab-item>
      </v-tabs-items>
  </div>
</template>

<script>
/* eslint-disable */
import loadingMixin from "@/mixins/LoadingMixin";
import Breadcrumb from "@/components/core/Breadcrumb";
import DashboardReportService from "@/_services/DashboardReportService";
import RegionalReport from "./components/RegionalReport.vue";
import FarmersReport from "./components/FarmersReport.vue";
import FarmsReport from "./components/FarmsReport.vue";
import EqipmentReport from "./components/EquipmentReport.vue";
import PestReport from "./components/PestReport.vue";
import GoalsReport from "./components/GoalsReport.vue";
import CropsReport from "./components/CropsReport.vue";
import PermissionsService from "@/_services/PermissionsService";

export default {
  components: {
    Breadcrumb,
    RegionalReport,
    FarmersReport,
    FarmsReport,
    EqipmentReport,
    PestReport,
    GoalsReport,
    CropsReport

  },
  data() {
    return {
      cropTypes: null,
      regionalData: null,
      tab: null,
      globalSettings: "",
      farmPropKey:0,
      tabsToId: {
        "regions":0 ,
        "farmers":1 ,
        "farms":2 ,
        "crops":3 ,
        "pests":4 ,
        "equipment":5 ,
        "goals-achieved":6 ,
      },
      tabItems: [
        {
          label: this.$t("regions"),
          to: {
            name: 'ReportDetail',
            params: { type: 'regions' },
          }
        },
        {
          label:this.$t("farmers"),
               to: {
              name: 'ReportDetail',
              params: { type: 'farmers' },
            }

        },
        {
          label: this.$t("farms"),
          to: {
              name: 'ReportDetail',
              params: { type: 'farms' },
          }
        },
        {
          label: this.$t("crops"),
               to: {
              name: 'ReportDetail',
              params: { type: 'crops' },
          }
        },
        {
          label:this.$t("pests"),
          to: {
              name: 'ReportDetail',
              params: { type: 'pests' },
          }
        },
        {
          label:this.$t("equipment"),
          to: {
            name: 'ReportDetail',
            params: { type: 'equipment' },
          }
        },
        {
         label: this.$t("goalsAchieved"),
          to: {
            name: 'ReportDetail',
            params: { type: 'goals-achieved' },
          }
        }
      ],
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: true,
          to: "/",
        },
        {
          text: this.$t("dashboardReports.reports"),
          disabled: true,
          to: "/",
        },
      ],
    };
  },
  methods: {
    async getRegionalData() {
      await DashboardReportService.getRegionsReport()
        .then((res) => {
          this.regionalData = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getCropTypes() {
      let res = await DashboardReportService.getCropTypes();

      this.cropTypes = res.data;
    },
    async getSettings() {
      const globalSettings = await PermissionsService.getGlobalSettings();
      if(globalSettings.data.globalSetting){
        this.globalSettings = globalSettings.data.globalSetting;
        this.farmPropKey +=1
      }
    },
  },
  async mounted() {
    this.tab = this.tabsToId[this.$route.params.type]
    await this.getCropTypes();
    await this.getSettings();
  },
  mixins: [loadingMixin],
  watch: {
    '$route.params.type': {
      async handler() {
        this.tab = this.tabsToId[this.$route.params.type]
        await this.getCropTypes();
      },
      deep: true,
      immediate: true,
    }
  }
};
</script>

<style scoped>
/* .v-item-group {
  border: 1px solid #00bd73 !important;
  height: 38px;
} */

.theme--light.v-tabs-items {
  background-color: #e8e8e8;
}
</style>