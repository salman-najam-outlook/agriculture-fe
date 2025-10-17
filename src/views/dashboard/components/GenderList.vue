<template>
  <v-card elevation="0" class="px-5 pb-5 mt-5">
    <v-toolbar flat class="pt-3">
      <v-toolbar-title class="mt-n3">{{
        $t("reports.gender")
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
              style="width:220px"
              background-color="primary"
              color="white"
              :placeholder="$t('selectMonth')"
            ></v-text-field>
          </template>
          <v-date-picker v-model="filterDateMonth" type="month" no-title :max="new Date().toISOString().split('T')[0]">
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
          class="ml-3 text-no-wrap"
          style="width:140px"
          background-color="primary"
          v-model="filterDateYear"
          @change="getYearData"
        ></v-select>
        <div class="white--text">
          <v-select
            :items="[
              { name: this.$t('byMonth'), value: 'month' },
              { name: this.$t('byYear'), value: 'year' },
            ]"
            item-text="name"
            item-value="value"
            outlined
            dense
            class="ml-3 text-no-wrap"
            style="width:140px"
            background-color="primary"
            v-model="filterType"
          ></v-select>
        </div>
      </v-toolbar-items>
    </v-toolbar>
    <v-card-text>
      <v-simple-table>
          <template v-slot:default>
            <thead>
                <tr>
                    <th lass="text-left">{{$t('reports.gen')}}</th>
                    <th lass="text-left">{{$t('reports.total')}}</th>
                </tr>
            </thead>
            <tbody v-for="(gender, index) in Object.keys(genderData)" :key="index">
                <tr>
                    <td>{{ $t(`reports.${gender}`) }}</td>
                    <td>{{ genderData[gender] }}</td>
                </tr>
            </tbody>
          </template>
      </v-simple-table>
    </v-card-text>
  </v-card>
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import DashboardReportService from "@/_services/DashboardReportService";

export default {
  components: {
  },
  async mounted() {
    const fetchData = async () => {
      for (let i = this.year; i > this.year - 10; i--) {
        this.years.push(i);
      }
      this.getYearData();
    };
    fetchData();
  },
  data() {
    return {
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
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      genderData: {},
    };
  },
  methods: {
    async getGraphData(filterData) {
      this.startLoading();
      try {
        const data = { sDate: filterData.startDate, eDate: filterData.endDate}
        const res = await DashboardReportService.getGenderData(data);
        this.genderData = res.data;
        this.stopLoading();
      } catch (e) {
        console.log(e);
        this.stopLoading();
      }
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
      this.getGraphData({
        startDate: firstDay,
        endDate: lastDay,
      });
      this.menu1 = false;
    },
    customFilter() {
      this.getGraphData({
        startDate: this.filterDateCustom[0],
        endDate: this.filterDateCustom[1],
      });
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
      this.getGraphData({
        startDate: this.filterDateWeek[0],
        endDate: this.filterDateWeek[1],
      });

      this.menu3 = false;
    },

    getYearData() {
      this.getGraphData({
        startDate: `${this.filterDateYear}-01-01`,
        endDate: `${this.filterDateYear}-12-31`,
      });
    },
  },
  mixins: [loadingMixin],
};
</script>
