<template>
  <div>
    <div class="row mt-4">
      <div class="col-md-6">
        <div class="d-flex">
          <div class="mt-2 mr-4 font-weight-bold">{{ $t('equipmentReport') }}</div>
          <v-btn-toggle
                  dense
                  class=""
                  borderless
                  color="primary"
                  background-color="white"
                  @change="getReports"
                  v-model="filterTopChartDateBy"
                >
                  <v-btn :value="0"> {{ $t('today') }} </v-btn>
                  <v-btn :value="1"> {{ $t('week') }} </v-btn>
                  <v-btn :value="2"> {{ $t('month') }} </v-btn>
                  <v-btn :value="3"> {{ $t('year') }} </v-btn>
                  <v-btn :value="4"> {{ $t('all') }} </v-btn>
                  <v-btn>
                    <v-menu 
                        v-model="customFilterMenu" 
                        :close-on-content-click="false"
                        transition="scale-transition" 
                        min-width="auto"
                        left 
                        origin="top right">
                        <template v-slot:activator="{ on, attrs }">
                             <v-btn
                                v-bind="attrs" 
                                v-on="on" 
                                icon
                            >
                                <v-icon size="20" color="primary">mdi-calendar-month</v-icon>
                            </v-btn>
                        </template>
                        <v-date-picker v-model="filterDateCustom" range>
                          <v-spacer></v-spacer>
                          <v-btn text color="primary" @click="customDateFilterSelect">
                            {{ $t('confirm') }}
                          </v-btn>
                        </v-date-picker>
                    </v-menu>
                  </v-btn>
                </v-btn-toggle>
        </div>
      </div>
      <div class="col-md-6">
        <div class="d-flex justify-space-around">
          <v-select
            color="primary"
            :items="[{id:'farmer', value:$t('listByFarmer')}]"
            v-model="filterBy"
            item-value="id"
            item-text="value"
            background-color="white"
            outlined
            dense
            :placeholder="$t('listByFarmer')"
          ></v-select>
          <v-select
            class="mx-2"
            :items="farmersData.farmers"
            v-model="farmerId"
            item-value="id"
            :item-text="item => item.firstName +' '+ item.lastName"
            color="primary"
            background-color="white"
            outlined
            dense
            @change="debouncedGetReports"
            :placeholder="$t('selectFarmer')"
            v-if="filterBy === 'farmer'"
          ></v-select>
          <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn outlined color="indigo" v-bind="attrs" v-on="on">
                      {{ $t('reports.export') }}
                      <v-icon class="gray--text">mdi-chevron-down</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <!-- <v-list-item @click="$router.replace({name: 'profile'});">Profile</v-list-item>
                        <v-divider></v-divider> -->
                    <v-list-item @click="downloadCsv">
                      <v-btn icon dense><v-img src="/img/reports/csv-file.svg" /></v-btn>
                    </v-list-item>
                    <v-list-item @click="downloadExcel">
                      <v-btn icon dense><v-img src="/img/reports/excel-file.svg" /></v-btn>
                    </v-list-item>
                    <v-list-item @click="downloadPdf">
                      <v-btn icon dense><v-img src="/img/reports/pdf-file.svg" /></v-btn>
                    </v-list-item>
                  </v-list>
        </v-menu>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6">
        <v-text-field
          small
          :placeholder="$t('search')"
          outlined
          dense
          v-model="search"
          @input="handleSearch"
          prepend-inner-icon="mdi-magnify"
          background-color="white"
          style="width: 20rem"
        ></v-text-field>
      </div>
      <!-- <div class="col-md-6 text-right">
        <span class="text--disabled">10 of 129</span>
        <v-btn fab small outlined color="primary" class="mx-2"
          ><v-icon>mdi-chevron-left</v-icon></v-btn
        >
        <v-btn fab small outlined color="primary" class="mx-2"
          ><v-icon>mdi-chevron-right</v-icon></v-btn
        >
      </div> -->
    </div>

    <v-card>
      <v-card-text>
        <v-card-subtitle class="font-weight-black">{{ $t('equipmentChart') }}</v-card-subtitle>
        <v-row>
          <v-col>
            <BarChart
              :chartData="farmersChartData"
              :chartOptions="farmersChartOptions"
              v-if="farmersChartData.labels.length"
            />
          </v-col>
        </v-row>

        <v-data-table
          :headers="farmerId?farmerHeaders:regionsHeaders"
          :items="farmersData.equipmentList"
          :items-per-page="5"
          class="elevation-1 mt-6"
          :footer-props="{
            'items-per-page-text': $t('rowsPerPage')
          }"
        >
        </v-data-table>

        <v-row class="mt-6">
          <v-col class="text-center">
            <v-btn rounded color="primary" @click="downloadPdf" outlined>{{$t("reports.downloadPdfReport")}}</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>
  
  <script>
import loadingMixin from "@/mixins/LoadingMixin";
import DownloadMixin from "@/mixins/DownloadMixin";
import DashboardReportService from "@/_services/DashboardReportService";
import BarChart from "./Bar.vue";
import moment from "moment";

export default {
  components: {
    BarChart
  },
  data() {
    return {
      farmersData: {},
      filterTopChartDateBy: 4, //default '3 - year'
      filterDateCustom: [],
      customFilterMenu: false,
      search: '',
      filterBy: 'farmer',
      farmerId: null,
      debouncedGetReports: null,
      regionsHeaders: [
        {
          text: this.$t('equipmentName'),
          align: "start",
          sortable: true,
          value: "equipmentName",
        },
        { text: this.$t('region'), value: "region" },
        { text: this.$t('farmer'), value: "farmerCount" },
        { text: this.$t('counts'), value: "equipmentCount" }
      ],
      farmerHeaders: [
        {
          text: this.$t('equipmentName'),
          align: "start",
          sortable: true,
          value: "equipmentName",
        },
        { text: this.$t('counts'), value: "equipmentCount" }
      ],
      farmersChartData: {
        labels: [],
        datasets: [
          {
            label: this.$t('farmers'),
            backgroundColor: "#f87979",
            data: [],
          },
        ],
      },
      farmersChartOptions: {
        chart: {
          id: 'Equipment_Report',
        },
        interaction: {
          mode: "index",
          intersect: true,
        },
        stacked: false,
        plugins: {
          title: {
            display: true,
            text: this.$t('equipmentChart'),
          },
        },
      },
      farmersPieChartData: {
        labels: [
        this.$t('large'), 
        this.$t('medium'),
        this.$t('small'),
        ],
        datasets: [
          {
            label: this.$t('farmers'),
            backgroundColor: "#f87979",
            data: [],
          },
        ],
      },
    };
  },
  computed: {
    topChartStartDate() {
      if (this.filterTopChartDateBy === 0) {
        return moment(new Date()).format("DD-MMM-YYYY");
      } else if (this.filterTopChartDateBy === 1) {
        return moment().startOf('week').format("DD-MMM-YYYY");
      } else if (this.filterTopChartDateBy === 2) {
        return moment().startOf('month').format("DD-MMM-YYYY");
      }
      else if (this.filterTopChartDateBy === 3) {
        return moment().startOf('year').format("DD-MMM-YYYY");
      }
      else if (this.filterTopChartDateBy === 4) {
        return null;
      }
      else if (this.filterTopChartDateBy > 3 && this.filterDateCustom.length == 2) {
        return moment(new Date(this.filterDateCustom[0]).getTime()).format("DD-MMM-YYYY");
      }
      else {
        return moment(new Date()).format("DD-MMM-YYYY");
      }
    },
    topChartEndDate() {
      if (this.filterTopChartDateBy === 1) {
        return moment().endOf('week').format("DD-MMM-YYYY");
      } else if (this.filterTopChartDateBy === 2) {
        return moment().endOf('month').format("DD-MMM-YYYY");
      }else if (this.filterTopChartDateBy === 3) {
        return moment().endOf('year').format("DD-MMM-YYYY");
      }
      else if (this.filterTopChartDateBy === 4) {
        return null;
      }
      else if (this.filterTopChartDateBy > 3 && this.filterDateCustom.length == 2) {
        return moment(new Date(this.filterDateCustom[1]).getTime()).format("DD-MMM-YYYY");
      }
      else{
        return moment(new Date()).format("DD-MMM-YYYY");
      }
    },
  },
  async mounted() {
    await this.getReports();
    this.debouncedGetReports = this.debounce(this.getReports, 500);
  },
  methods: {
    debounce(func, wait) {
      let timeout;
      return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          func.apply(this, args);
        }, wait);
      };
    },
    async getFarmersData() {
      let data = {sDate: this.topChartStartDate, eDate: this.topChartEndDate};
      if(this.search != '' && this.search.length > 2){
        data.search = this.search;
      }
      if(this.farmerId != null){
        data.farmerId = this.farmerId;
      }
      await DashboardReportService.getEquipmentReport(data)
        .then((res) => {
          this.farmersData = res.data.data;
          console.log(this.farmersData, 'farmdata fdsfdsdsf');
          const equipments = res.data.data.equipmentCount
            .filter((item) => item.name != null)
            .map((item) => item.name);
          this.farmersChartData.labels = equipments;

          const counts = res.data.data.equipmentCount
            .filter((item) => item.count != null)
            .map((item) => item.count);
          this.farmersChartData.datasets[0].data = counts;
        })
        .catch((err) => {
          console.log(err);
          this.stopLoading();
        });
    },
    async getReports(){
      if(this.filterTopChartDateBy < 5 || this.filterDateCustom.length == 2){
        this.startLoading();
        await this.getFarmersData();
        this.stopLoading();  
      }
     
    },
    async handleSearch(){
        await this.getFarmersData();
         
    },
    async customDateFilterSelect() {
      this.customFilterMenu = false;
      await this.getFarmersData();
    },
    async downloadExcel() {
      this.startLoading();
      try {
        const data = this.farmersData.equipmentList;
        const sheetData = data.map(row => ({
          [this.$t('Equipment Name')]: row.equipmentName,
          [this.$t('Region')]: row.region,
          [this.$t('Farmer')]: row.farmerCount,
          [this.$t('Counts')]: row.equipmentCount,
        }));
        const { data: blob } = await this.$http.post('/reports/generate-excel', {
          data: sheetData,
        }, { responseType: 'blob' });
        this.downloadBlob(blob, 'equipmentReport.xlsx');
        this.stopLoading();
      } catch (error) {
        console.error(error);
        this.stopLoading();
      }
    },
    async downloadCsv() {
      this.startLoading()
      try {
        const csvData = this.farmersData.equipmentList
        let csv = `${this.$t('Equipment Name')}, ${this.$t('Region')}, ${this.$t('Farmer')}, ${this.$t('Counts')}\n`;
        csvData.forEach((row) => {
          csv += [row.equipmentName, `"${row.region}"`, row.farmerCount, row.equipmentCount].join(',');
          csv += "\n";
        });

        const anchor = document.createElement('a');
        anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
        anchor.target = '_blank';
        anchor.download = 'equipmentReport.csv';
        anchor.click();
        this.stopLoading()
      } catch (err) {
        console.log(err)
        this.stopLoading()
      }
    },
    async downloadPdf() {
      this.startLoading()
      try {
        await this.$http.post(`/reports/pdfs`, {
          title: this.$t('Equipment Report'),
          list: this.farmersData.equipmentList.map(row => {
            return {
              'Equipment Name':row.equipmentName,
              'Region':row.region,
              'Farmer':row.farmerCount,
              'Counts':row.equipmentCount
            }
          }),
          startDate: this.topChartStartDate,
          endDate: this.topChartEndDate,
        },
          {
            responseType: "arraybuffer",
          }
        ).then(({ data }) => {
          console.log(data)
          this.downloadBlobFile(data, "equipmentReport.pdf");
          this.stopLoading();
        })
      } catch (err) {
        console.log(err)
        this.stopLoading()
      }
    },
  },
  mixins: [loadingMixin,DownloadMixin],
};
</script>
  
  <style scoped>
.red-dot {
  height: 15px;
  width: 15px;
  background-color: red;
  border-radius: 50%;
}
</style>