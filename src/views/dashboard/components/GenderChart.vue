<template>
  <v-card elevation="0" class="gender_chart px-5 pb-5 mt-5">
    <v-toolbar flat height="auto">
      <v-toolbar-title class="mt-n3">{{ $t('reports.usersByGender') }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-menu v-model="menu1" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                offset-y min-width="auto" v-if="filterType == 'month'">
          <template v-slot:activator="{ on, attrs }">
            <v-text-field v-model="filterDateMonth" readonly v-bind="attrs" v-on="on" outlined dense
                          style="width:220px" background-color="primary" color="white"
                          :placeholder="$t('selectMonth')"></v-text-field>
          </template>
          <v-date-picker v-model="filterDateMonth" type="month" no-title>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="monthFilter">
              {{ $t('confirm') }}
            </v-btn>
          </v-date-picker>
        </v-menu>
        <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                offset-y min-width="auto" v-if="filterType == 'custom'">
          <template v-slot:activator="{ on, attrs }">
            <v-text-field v-model="filterDateCustom" readonly v-bind="attrs" v-on="on" outlined dense
                          style="width:220px" background-color="primary" color="white"
                          placeholder="Select Date Range"></v-text-field>
          </template>
          <v-date-picker v-model="filterDateCustom" range no-title>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="customFilter">
              {{ $t('confirm') }}
            </v-btn>
          </v-date-picker>
        </v-menu>
        <v-menu v-model="menu3" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                offset-y min-width="auto" v-if="filterType == 'week'" class="xxxxxy">
          <template v-slot:activator="{ on, attrs }">
            <v-text-field v-model="filterDateWeek" readonly v-bind="attrs" v-on="on" outlined dense
                          style="width:220px" background-color="primary" color="white" class="white--text"
                          :placeholder="$t('selectWeek')"></v-text-field>
          </template>
          <v-date-picker v-model="filterDateWeek" no-title range show-adjacent-months
                         class="xxxxxc">
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="weekFilter" class="mt-n8">
              {{ $t('confirm') }}
            </v-btn>
          </v-date-picker>
        </v-menu>
        <v-select v-if="filterType == 'year'" :items="years" item-text="name" item-value="value" outlined dense
                  class="text-no-wrap" style="width:140px" background-color="primary" v-model="filterDateYear"
                  @change="getYearData"></v-select>
        <div class="white--text">
          <v-select :items="[
                { name: this.$t('byWeek'), value: 'week' },
                { name: this.$t('byMonth'), value: 'month' },
                { name: this.$t('byYear'), value: 'year' },
                { name: this.$t('custom'), value: 'custom' },
            ]" item-text="name" item-value="value" outlined dense class="text-no-wrap" style="width:140px"
                    background-color="primary" v-model="filterType"></v-select>
        </div>
      </v-toolbar-items>
    </v-toolbar>

    <v-divider class="mb-4"/>
    <v-scale-transition>
      <v-card-text v-if="loading">
        <v-skeleton-loader
            type="text"
        />
      </v-card-text>
    </v-scale-transition>
    <v-card-text class="gender_chart_container">
      <div v-if="emptyState">
        <v-alert type="info" border="left" elevation="2" colored>
          {{ $t('noData') }}
        </v-alert>
      </div>
      <apexcharts
          v-else
          type="pie"
          width="380"
          :series="series"
          :options="chartOptions"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import DashboardReportService from "@/_services/DashboardReportService";
import {ChartDownloadIcon} from "@/views/dashboard/components/ChartDownloadIcon.ts";
import {mapGetters} from "vuex";

export default {
  components: {
    'apexcharts': VueApexCharts,
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
  computed: {
    ...mapGetters("filterParams", ["globalCountry", "globalGender"]),
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
      series: [],
      chartOptions: {
        chart: {
          width: 380,
          type: 'pie',
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
        labels: [],
      },
      emptyState: false,
    };
  },
  watch: {
    globalCountry: {
      handler() {
        this.getCountryWiseData();
      },
      deep: true,
    }
  },
  methods: {
    getCountryWiseData() {
      switch (this.filterType) {
        case 'month':
          this.monthFilter();
          break;
        case 'custom':
          this.customFilter();
          break;
        case 'week':
          this.weekFilter();
          break;
        case 'year':
          this.getYearData();
          break;
      }
    },
    async getGraphData(filterData) {
      this.loading = true;
      try {
        const data = {
          sDate: filterData?.startDate,
          eDate: filterData?.endDate,
          countryCode: this.globalCountry,
        };
        const res = await DashboardReportService.getGenderData(data);

        const responseData = res.data;
        if (
            responseData.male === 0 &&
            responseData.female === 0 &&
            responseData.other === 0
        ) {
          this.emptyState = true;
        } else {
          this.emptyState = false;
        }

        this.series = [...Object.values(responseData)];
        const translatedLabel = Object.keys(responseData).map((g) => {
          return this.$t(`reports.${g}`);
        });
        this.chartOptions = { ...this.chartOptions, labels: translatedLabel };
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    },
    monthFilter() {
      var date = new Date(`${this.filterDateMonth}-01`);
      var firstDay = `${this.filterDateMonth}-01`;
      var lastDayX = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      this.chartOptions.labels = [];
      this.series = [];
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
    getYearData() {
      this.getGraphData({
        startDate: `${this.filterDateYear}-01-01`,
        endDate: `${this.filterDateYear}-12-31`,
      });
    },
    customFilter() {
      const startDate = this.filterDateCustom[0];
      const endDate = this.filterDateCustom[1];
      this.getGraphData({
        startDate: startDate,
        endDate: endDate,
      });
      this.menu2 = false;
    },
    weekFilter() {
      const startDate = this.filterDateWeek[0];
      const endDate = this.filterDateWeek[1];
      this.getGraphData({
        startDate: startDate,
        endDate: endDate,
      });
      this.menu3 = false;
    }
  },
};
</script>

<style lang="scss" scoped>
.gender_chart_container {
  min-height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
