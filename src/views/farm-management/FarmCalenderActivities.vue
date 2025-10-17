<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="page-title">
        <!-- <v-btn color="primary" @click="goBack" density="compact" icon="mdi-chevron-left">      <v-icon>mdi-chevron-left</v-icon></v-btn> -->
        <h2 class="text-capitalize">{{ $t('farm.farmActivities') }}</h2>
        <v-spacer></v-spacer>
        <div class="view-toggle">
          <v-btn
            :color="activeView === 'list' ? 'primary' : ''"
            @click="setView('list')"
          >
            {{ $t('farm.listView') }}
          </v-btn>
          <v-tooltip top color="black" max-width="350">
          <template v-slot:activator="{ on }">
            <span v-on="on">
              <v-btn
              :disabled="!farmId"
              class="ml-4"
                :color="activeView === 'calendar' ? 'primary' : ''"
                @click="setView('calendar')"
              >
            {{ $t('farm.calendarView') }}
          </v-btn>
            </span>
          </template>
          <span>{{ this.$t('farm.selectFarmToEnableCalenderView') }}</span>
      </v-tooltip>
        </div>
      </div>
      <div v-if="activeView === 'list'" class="table-section">
        <v-tabs v-model="activeTab">
          <v-tab @click="setActivityType('scheduled')"
            >{{ $t('farm.scheduledActivities') }}</v-tab
          >
          <v-tab @click="setActivityType('completed')"
            >{{ $t('farm.completedActivities') }}</v-tab
          >
        </v-tabs>

        <v-tabs-items v-model="activeTab">
          <v-tab-item>
            <FarmActivitiesTable :activity="scheduledActivity" @setFarmId="setFarmId"/>
          </v-tab-item>
          <v-tab-item>
            <FarmActivitiesTable :activity="scheduledActivity" @setFarmId="setFarmId"/>
          </v-tab-item>
        </v-tabs-items>
      </div>
      <div v-else-if="activeView == 'calendar'">
        <CalendarView :farmId="farmId"/>
      </div>
    </v-container>
  </div>
</template>


<script>
import FarmActivitiesTable from "./components/FarmActivitiesTable.vue";
import CalendarView from "./FarmActivitiesCalendarView.vue";
import loadingMixin from "@/mixins/LoadingMixin";
import moment from "moment";
export default {
  name: "FarmCalenderActivities",
  components: {
    FarmActivitiesTable,
    CalendarView
  },
  data() {
    return {
      farmId: null,
      title: "Farm Calender Activities",
      activeView: "list",
      dateMenu: false,
      scheduledActivity: "scheduled",
      activeTab: "scheduled",
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: false,
          to: { name: "Users" },
          exact: true,
        },
        {
          text: this.$t("memberDataSection.farmActivities"),
          disabled: true,
          href: "breadcrumbs_link_1",
        },
      ],
    };
  },
  methods: {
    setFarmId(farmId) {
      this.farmId = farmId
    },
    setView(view) {
      this.activeView = view;
    },
    setActivityType(type) {
      this.scheduledActivity = type;
    },
  },
  filters: {
    formatDate(value) {
      return moment(value).format("DD-MMM-YYYY");
    },
  },
  computed: {},
  created() {},
  mounted() {
  },
  mixins: [loadingMixin],
};
</script>

<style lang="scss" scoped></style>
