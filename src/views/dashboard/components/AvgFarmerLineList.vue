<template>
  <v-card elevation="0" class="px-5 pb-5 mt-5">
    <v-toolbar flat class="pt-3">
      <v-toolbar-title class="mt-n3">
        {{ $t("reports.avgPrice") }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-select
          v-if="filterType == 'month'"
          :items="years"
          item-text="name"
          item-value="value"
          outlined
          dense
          class="ml-3 text-no-wrap"
          style="width:140px"
          background-color="primary"
          :placeholder="$t('reports.selectYear')"
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
            @change="changeFilter"
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
                    <th lass="text-left">{{ filterType === 'month' ? $t('reports.month') : $t('reports.year') }}</th>
                    <th lass="text-left">{{$t('reports.avgPrice')}}</th>
                </tr>
            </thead>
            <tbody v-for="(item, index) in farmerData" :key="index">
                <tr>
                    <td>{{ Object.keys(item)[0] }}</td>
                    <td>{{ Object.values(item)[0] }}</td>
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
  async mounted() {
    const fetchData = async () => {
      for (let i = this.year - 10; i <= this.year; i++) {
        this.years.push(i);
      }
    };
    fetchData();
    this.getDefault();
  },
  data() {
    return {
      dashboardData: [],
      loading: true,
      year: new Date().getFullYear(),
      months: ['January', 'February','March','April','May','June','July','August','September','October','November','December'],
      years: [],
      menu1: false,
      menu2: false,
      menu3: false,
      filterDateCustom: [],
      filterDateMonth: "",
      filterDateYear: null,
      filterDateWeek: [],
      filterType: "month",
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      farmerData: [],
    };
  },
  methods: {
    async getGraphData(filterData) {
      this.startLoading();
      try {
        const data = { sDate: filterData.startDate, eDate: filterData.endDate, filterType: this.filterType}
        const res = await DashboardReportService.getAvgPriceInterval(data);
        if (this.filterType === 'month') {
          const apiResponseMap = new Map(res.data.avgFarmerPaidChart.map(({ month, averagePricePerKg }) => [month, averagePricePerKg]));
          this.farmerData = this.months.map((month) => {
            let obj = {};
            if (apiResponseMap.has(month)) {
              obj[month] = apiResponseMap.get(month).toFixed(2)
              return obj;
            } else {
              obj[month] = 0
            }
            return obj
          });
        } else if (this.filterType === 'year') {
          const apiResponseMap = new Map(res.data.avgFarmerPaidChart.map(({ year, averagePricePerKg }) => [year, averagePricePerKg]));
          this.farmerData = this.years.map(year => {
            let obj = {};
            if (apiResponseMap.has(year)) {
              obj[year] = apiResponseMap.get(year).toFixed(2)
            } else {
              obj[year] = 0
            }
            return obj;
        });
        }
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
    changeFilter(v) {
      if (v === 'year') {
        const currentDate = new Date();
        const twelveMonthsAgo = new Date(currentDate);
        twelveMonthsAgo.setFullYear(currentDate.getFullYear() - 1)
        const formattedStartDate = twelveMonthsAgo.toISOString().slice(0, 10);
        const formattedEndDate = currentDate.toISOString().slice(0, 10);
        this.getGraphData({
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        });
      } else {
        this.getDefault();
      }
    },
    getDefault() {
      const currentDate = new Date();
      const twelveMonthsAgo = new Date(currentDate);
      twelveMonthsAgo.setMonth(currentDate.getMonth() - 12);
      const formattedStartDate = twelveMonthsAgo.toISOString().slice(0, 10);
      const formattedEndDate = currentDate.toISOString().slice(0, 10);
      this.getGraphData({
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      });
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
