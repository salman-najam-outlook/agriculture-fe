<template>
  <div>
    <div v-if="loading" class="text-center">
      <v-progress-circular
        :size="70"
        color="#FB896B"
        indeterminate
        class="vertical-center"
        width="7"
      ></v-progress-circular>
    </div>
    <v-card flat v-else>
      <v-toolbar flat class="pt-3">
        <v-toolbar-title class="mt-n3">{{ $t('membershipPlans') }}</v-toolbar-title>
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
              <v-btn text color="primary" @click="monthFilter"> {{ $t('confirm')}} </v-btn>
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
                :placeholder="$t('selectDateRange')"
              ></v-text-field>
            </template>
            <v-date-picker v-model="filterDateCustom" range no-title>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="customFilter">
                {{ $t('confirm')}}
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
                placeholder="Select Week"
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
                {{ $t('confirm')}}
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
              class="ml-3 text-no-wrap"
              style="width: 140px"
              background-color="primary"
              v-model="filterType"
            ></v-select>
          </div>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text class="pa-0 pr-5">
        <bar :chartdata="chartData" :options="options"></bar>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import Bar from "./Bar.vue";
export default {
  async mounted() {
    const fetchData = async () => {
      for (var i = this.year; i > this.year - 10; i--) {
        this.years.push(i);
      }

      await this.getGraphData({
        year: this.year,
      });
    };
    await fetchData();
  },
  components: {
    Bar,
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
      options: {
        tooltips: {
          displayColors: true,
          callbacks: {
            mode: "x",
          },
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false,
              },
              barPercentage: 0.5,
            },
          ],
          yAxes: [
            {
              // stacked: true,
              ticks: {
                stepSize: 1,
              },
              type: "linear",
            },
          ],
        },
        responsive: true,
        maintainAspectRatio: false,
        usePointStyle: true,
        pointStyle: "circle",
        legend: {
          labels: {
            usePointStyle: true,
            padding: 60,
          },
          position: "bottom",
          align: "center",
        },
      },
      chartData: {
        // labels: ['Basic','Intermediate','Advanced','Elite'],
        datasets: [],
      },
    };
  },
  methods: {
    async getGraphData(filterData) {
      this.loading = true;
      try {
        const { data } = await this.$http.post("/dashboard/membershipTypes", {
          filterType: this.filterType,
          data: filterData,
        });
        const colors = ["#FABE7A", "#F6866A", "#59E6F6", "#F40A34"];
        this.chartData.datasets = [];
        data.data.forEach((item, i) => {
          // console.log(i, item)
          let l = {
            label: item.membershipTypes,
            backgroundColor: colors[i],
            borderColor: colors[i],
            fill: false,
            data: [item.count],
            borderRadius: 15,
          };
          this.chartData.datasets.push(l);
        });

        // this.chartData.datasets[0].data = [];
        // const gD = data.data[0]
        // this.chartData.datasets[0].data.push(gD.registeredUsers);
        // this.chartData.datasets[0].data.push(0);
        // this.chartData.datasets[0].data.push(gD.activeUsers);
        // this.chartData.datasets[0].data.push(gD.deactivatedUsers);
        this.loading = false;
      } catch (err) {
        console.log("err", err);
        this.loading = false;
      }
    },
    monthFilter() {
      const x = this.filterDateMonth.split("-");
      // var date = new Date(`${this.filterDateMonth}-01`);
      // var firstDay = `${this.filterDateMonth}-01`;//new Date(date.getFullYear(), date.getMonth(), 1);
      // var lastDayX = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      // var lastDay = lastDayX.getFullYear()  + "-" + (lastDayX.getMonth()+1) + "-" + lastDayX.getDate();
      // console.log('f&l', date, firstDay,lastDay)
      this.getGraphData({
        // startDate: firstDay,
        // endDate: lastDay
        month: x[1],
        year: x[0],
      });
      this.menu1 = false;
    },
    customFilter() {
      // console.log('selected Range', this.filterDateCustom)
      this.getGraphData({
        startDate: this.filterDateCustom[0],
        endDate: this.filterDateCustom[1],
      });
      this.menu2 = false;
    },
    weekChange() {
      // console.log('week Changed', this.filterDateWeek[0])
      var curr = new Date(this.filterDateWeek[0]); // get current date
      var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
      var last = first + 6; // last day is the first day + 6

      var firstday = new Date(curr.setDate(first)).toISOString().substr(0, 10);
      var lastday = new Date(curr.setDate(last)).toISOString().substr(0, 10);
      // console.log('FirstDay', firstday)
      // console.log('Last Day', lastday)
      // var f = `${firstday.getUTCFullYear()}-${firstday.getUTCMonth()+1}-${firstday.getUTCDate()}`;
      // var l = `${lastday.getUTCFullYear()}-${lastday.getUTCMonth()+1}-${lastday.getUTCDate()}`;
      // console.log('f', f,l)
      // this.filterDateWeek = ['2022-05-15', '2022-05-21']
      this.filterDateWeek = [firstday, lastday];
    },
    weekFilter() {
      // console.log('weekFilter', this.filterDateWeek)
      this.getGraphData({
        startDate: this.filterDateWeek[0],
        endDate: this.filterDateWeek[1],
      });

      this.menu3 = false;
    },

    getYearData() {
      this.getGraphData({
        year: this.filterDateYear,
      });
    },
  },
};
</script>
<style scoped lang="scss">
.vertical-center {
  margin: 0;
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}

::v-deep .v-text-field__slot input {
  // color: white !important;
  font-weight: 600;
}

::v-deep .v-select__selection.v-select__selection--comma {
  color: white !important;
  font-weight: 600;
}

::v-deep .v-input__icon.v-input__icon--append i {
  color: white !important;
  font-weight: 600;
}

::v-deep .xxxxxc .v-date-picker-table tbody tr:hover {
  background-color: $primary-color !important;
}

::v-deep .v-text-field__slot input::placeholder {
  //   color: white;
}
</style>