<template>
  <div v-if="farmsData">
    <div class="row mt-4">
      <div class="col-md-6">
        <div class="d-flex">
          <div class="mt-2 mr-4 font-weight-bold">{{ $t('farmsReport') }}</div>
          <v-btn-toggle dense class="" borderless color="primary" background-color="white" @change="getReports"
            v-model="filterTopChartDateBy">
            <v-btn :value="0"> {{ $t('today') }} </v-btn>
            <v-btn :value="1"> {{ $t('week') }} </v-btn>
            <v-btn :value="2"> {{ $t('month') }} </v-btn>
            <v-btn :value="3"> {{ $t('year') }} </v-btn>
            <v-btn :value="4"> {{ $t('all') }} </v-btn>
            <v-btn>
              <v-menu v-model="customFilterMenu" :close-on-content-click="false" transition="scale-transition"
                min-width="auto" left origin="top right">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" icon>
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
          <v-select color="primary" background-color="white" outlined dense v-model="graphFilterModel"
            :items="graphFilterOptions" item-text="label" item-value="value" placeholder="List By Land"></v-select>
            <v-text-field class="mx-2" color="primary" outlined dense readonly :placeholder="$t('selectCrop')"
            @click="showCropFilter = true" v-model="cropFilterModel"></v-text-field>
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
        <v-text-field small :placeholder="$t('search')" outlined dense prepend-inner-icon="mdi-magnify"
          background-color="white" style="width: 20rem"></v-text-field>
      </div>
      <div class="col-md-6 text-right">
        <!-- <span class="text--disabled">10 of 129</span>
        <v-btn fab small outlined color="primary" class="mx-2"><v-icon>mdi-chevron-left</v-icon></v-btn>
        <v-btn fab small outlined color="primary" class="mx-2"><v-icon>mdi-chevron-right</v-icon></v-btn> -->
      </div>
    </div>

    <v-card>
      <v-card-text>
        <v-card-subtitle class="font-weight-black">{{ $t('farmStatistics') }}</v-card-subtitle>
        <v-row>
          <v-col>
            <PieChart :series="farmersPieChartData.datasets[0].data" :chartOptions="pieChartOptions" />

          </v-col>
          <v-col>
            <div class="d-flex justify-space-around mb-4 text-right">
              <div>
                <span class="font-weight-bold">{{
    farmsData.farmStat.farmCount
}}</span><br />
                <small>{{ $t('farms') }}</small>
              </div>
              <div>
                <span class="font-weight-bold">{{ getArea(parseFloat(farmsData.farmStat.avgFarmLand).toFixed(2)) }}</span><br />
                <small>{{ $t('totalFarmerLand') }}</small>
              </div>
            </div>
            <div class="row mt-4">
              <div class="div-md-4 mx-2">
                <div class="d-flex">
                  <div class="text-right">
                    <span class="font-weight-bold">{{
    farmsData.farmStat.largeFarmCount
}}</span><br />
                    <small class="text-capitalize">{{ $t('large') }}</small>
                  </div>
                  <span class="ml-2 mt-4 blue-dot"></span>
                </div>
              </div>
              <div class="div-md-4 mx-2">
                <div class="d-flex">
                  <div class="text-right">
                    <span class="font-weight-bold">{{
    farmsData.farmStat.mediumFarmCount
}}</span><br />
                    <small class="text-capitalize">{{ $t('medium') }}</small>
                  </div>
                  <span class="ml-2 mt-4 green-dot"></span>
                </div>
              </div>
              <div class="div-md-4 mx-2">
                <div class="d-flex">
                  <div class="text-right">
                    <span class="font-weight-bold">{{
    farmsData.farmStat.smallFarmCount
}}</span><br />
                    <small class="text-capitalize">{{ $t('small') }}</small>
                  </div>
                  <span class="ml-2 mt-4 yellow-dot"></span>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>

        <v-card-subtitle class="font-weight-black">{{ $t('memberDataSection.farmsChart') }}</v-card-subtitle>
        <v-row>
          <v-col>
            <BarChart :chartData="farmsChartData" :chartOptions="farmersChartOptions" />
          </v-col>
        </v-row>

        <v-data-table 
          :headers="farmsHeaders" 
          :items="farmsData.farmList" 
          :items-per-page="5" 
          class="elevation-1 mt-6"
          :footer-props="{
            'items-per-page-text': $t('rowsPerPage')
          }"
        >
        <template v-slot:item.farmArea="{ item }">
            {{ convertSizeIntoBaseUnit(item.farmArea) }}
        </template>
        </v-data-table>

        <v-row class="mt-6">
          <v-col class="text-center">
            <v-btn rounded color="primary" @click="downloadPdf" outlined>{{$t("reports.downloadPdfReport")}}</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
        <CropFilterDialog v-if="showCropFilter" :dialogI="showCropFilter" :cropTypesList="cropTypes"
            @closeDialog="showCropFilter = false" :currentId="currentCropFilterId"  @cropFilterDone="cropFilterDone"
          />
    
  </div>
</template>
  
<script>
/* eslint-disable */
import loadingMixin from "@/mixins/LoadingMixin";
import DownloadMixin from "@/mixins/DownloadMixin";
import DashboardReportService from "@/_services/DashboardReportService";
import BarChart from "./Bar.vue";
import PieChart from "./Pie.vue";
import moment from "moment";
import CropFilterDialog from "../components/CropFilterDialog.vue";
import {convertSizeIntoBaseUnit} from "@/utils.js"


export default {
  props: {
    globalSettings: {
      type: Object | String,
      require: true,
    },
  },
  components: {
    BarChart,
    PieChart,
        CropFilterDialog
    
  },
  data() {
    return {
      cropTypes: [],
      cropFilterModel: null,
      currentCropFilterId: null,
      showCropFilter: false,
      cropIdToName: {},
      graphFilterModel: {
        label: this.$t('listByLand'),
        value: "land"
      },
      graphFilterOptions: [
        {
          label: this.$t('listByLand'),
          value: "land"
        },
        {
          label: this.$t('listbyCrop'),
          value: "crop"
        },
        {
          label: this.$t('listbyZone'),
          value: "zone"
        }
      ],
      farmsData: null,
      filterTopChartDateBy: 4, //default '3 - year'
      filterDateCustom: [],
      customFilterMenu: false,
      farmsHeaders: [
        {
          text: this.$t('farmName'),
          align: "start",
          sortable: true,
          value: "farmName",
        },
        // { text: "Farms", value: "farmCount" },
        { text: this.$t('zones'), value: "zoneCount" },
        { text: this.$t('crops'), value: "cropTypeCount" },
        { text: this.$t('area'), value: "farmArea" },
        { text: this.$t('reports.farmerName'), value: "farmerName" },
        { text: this.$t('farm.country'), value: "country" },
        { text: this.$t('farm.state'), value: "state" },
        { text: this.$t('farm.gpsLocation'), value: "address" },
        { text: this.$t('farm.latitude'), value: "lat" },
        { text: this.$t('farm.longitude'), value: "log" },
      ],
      farmsChartData: {
        labels: [],
        datasets: [
          {
            label: this.$t('area'),
            backgroundColor: "#f87979",
            data: [],
          },
        ],
      },
      farmersChartOptions: {
        chart: {
          id: 'Farm_Report',
        },
        interaction: {
          mode: "index",
          intersect: true,
        },
        stacked: false,
        plugins: {
          title: {
            display: true,
            text: this.$t('memberDataSection.farmsChart'),
          },
        },
      },
      pieChartOptions: {
        "chart": {
          "width": 380,
          "type": "pie"
        },
        "labels": [
        ],
        "responsive": [
          {
            "breakpoint": 480,
            "options": {
              "chart": {
                "width": 200
              },
              "legend": {
                "position": "bottom"
              }
            }
          }
        ]
      },
      farmersPieChartData: {
        labels: [
          this.$t('large'), 
          this.$t('medium'),
          this.$t('small'),
        ],
        datasets: [
          {
            label: "Farms",
            backgroundColor: "#f87979",
            data: [],
          },
        ],
      },
    };
  },
  watch: {
    graphFilterModel: {
      handler(nV) {
        console.log(nV, 'nv')

        if (nV == "land") {
          const farmers = this.farmsData.farmChart
            .filter((item) => item.farmName != null)
            .map((item) => item.farmName);
          this.farmsChartData.labels = farmers;
          this.pieChartOptions.labels = [
            this.$t('large'), 
            this.$t('medium'),
            this.$t('small'),
          ]

          const areas = this.farmsData.farmChart
            .filter((item) => item.farmName != null)
            .map((item) => this.getAreaWithNoAbbr(parseFloat(item.farmArea).toFixed(2)));
          this.farmsChartData.datasets[0].data = areas;
          this.farmsChartData.datasets[0].label = 'Area';

        } else if (nV == "zone") {
          const farmers = this.farmsData.farmChart
            .filter((item) => item.farmName != null)
            .map((item) => item.farmName);
          this.farmsChartData.labels = farmers;
          this.pieChartOptions.labels = [
            this.$t('large'), 
            this.$t('medium'),
            this.$t('small'),
          ]

          const areas = this.farmsData.farmChart
            .filter((item) => item.farmName != null)
            .map((item) => item.zoneCount);
          this.farmsChartData.datasets[0].data = areas;
          this.farmsChartData.datasets[0].label = 'Zones';

        } else if (nV == "crop") {
          const farmers = this.farmsData.farmChart
            .filter((item) => item.farmName != null)
            .map((item) => item.farmName);
          this.farmsChartData.labels = farmers;
          this.pieChartOptions.labels = [
            this.$t('large'), 
            this.$t('medium'),
            this.$t('small'),
          ]

          const areas = this.farmsData.farmChart
            .filter((item) => item.farmName != null)
            .map((item) => item.cropTypeCount);
          this.farmsChartData.datasets[0].data = areas;
          this.farmsChartData.datasets[0].label = 'Crops';

        }


      }
    }
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
      } else if (this.filterTopChartDateBy === 3) {
        return moment().endOf('year').format("DD-MMM-YYYY");
      }
      else if (this.filterTopChartDateBy === 4) {
        return null;
      }
      else if (this.filterTopChartDateBy > 3 && this.filterDateCustom.length == 2) {
        return moment(new Date(this.filterDateCustom[1]).getTime()).format("DD-MMM-YYYY");
      }
      else {
        return moment(new Date()).format("DD-MMM-YYYY");
      }
    },
  },
  async mounted() {
    await this.getReports();
        let cropTypeRes = await DashboardReportService.getCropTypes()
    this.cropTypes = cropTypeRes.data
    cropTypeRes.data.forEach(cropEl => {
      this.cropIdToName[cropEl.id] = cropEl.name

    })
  },
  methods: {
    convertSizeIntoBaseUnit,
    getAreaWithNoAbbr(baseArea){
      const factor = this.globalSettings?.areaUnit?.factor ?? 1;
      return `${(baseArea / factor).toFixed(2)}`
    },
    getArea(baseArea) {
      const factor = this.globalSettings?.areaUnit?.factor ?? 1;
      return `${(baseArea / factor).toFixed(2)} ${
        this.globalSettings?.areaUnit?.abbvr ?? 'ac'
      }`;
    },

    async cropFilterDone(val) {
          this.startLoading();
      try {
        this.cropFilterModel = this.cropIdToName[val];
        this.showCropFilter = false;
        this.currentCropFilterId = val;

        await this.resetPieChart();
        await this.getFarmsData({ cropType: val });
        
      } catch (error) {
        this.stopLoading();
      }
      this.stopLoading();

    },
    async getFarmsData(queryParams) {
      const data = { sDate: this.topChartStartDate, eDate: this.topChartEndDate, ...queryParams, cropType: this.currentCropFilterId };
      await DashboardReportService.getFarmsReport(data)
        .then((res) => {
          this.farmsData = res.data;
          this.farmsData.farmList =  this.farmsData.farmList.map(el => {
            el.farmArea = el.farmArea ? parseFloat(el.farmArea).toFixed(2) : 0;
            return el
          })
          const farmers = res.data.farmChart
            .filter((item) => item.farmName != null)
            .map((item) => item.farmName);
          this.farmsChartData.labels = farmers;
          this.pieChartOptions.labels = [
            this.$t('large'), 
            this.$t('medium'),
            this.$t('small'),
          ]

          const areas = res.data.farmChart
            .filter((item) => item.farmName != null)
            .map((item) => this.getAreaWithNoAbbr(parseFloat(item.farmArea).toFixed(2)));
          
          this.farmsChartData.datasets[0].data = areas;

          this.farmersPieChartData.datasets[0].data.push(
            res.data.farmStat.largeFarmCount,
            res.data.farmStat.mediumFarmCount,
            res.data.farmStat.smallFarmCount
          );
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getReports() {
      if (this.filterTopChartDateBy < 5 || this.filterDateCustom.length == 2) {
        this.startLoading();
        await this.getFarmsData();
        this.stopLoading();
      }

    },
    async customDateFilterSelect() {
      this.customFilterMenu = false;
      await this.resetPieChart();
      // await this.getFarmsData();
    },
    async downloadExcel() {
      this.startLoading();
      try {
        const data = this.farmsData.farmList;
        const sheetData = data.map(row => ({
          [this.$t('Farm Name')]: row.farmName,
          [this.$t('Zones')]: row.zoneCount,
          [this.$t('Crops')]: row.cropTypeCount,
          [this.$t('Area')]: this.getArea(row.farmArea),
          [this.$t('Farmer Name')]: row.farmerName,
          [this.$t('Country')]: row.country,
          [this.$t('State')]: row.state,
          [this.$t('GPS Location')]: row.address,
          [this.$t('Latitude')]: row.lat,
          [this.$t('Longitude')]: row.log,
        }));
        const { data: blob } = await this.$http.post('/reports/generate-excel', {
          data: sheetData,
        }, { responseType: 'blob' });
        this.downloadBlob(blob, 'farmsReport.xlsx');
        this.stopLoading();
      } catch (error) {
        console.error(error);
        this.stopLoading();
      }
    },
    async downloadCsv() {
      this.startLoading()
      try {
        const csvData = this.farmsData.farmList;
        let csv = `${this.$t('Farm Name')}, ${this.$t('Zones')}, ${this.$t('Crops')}, ${this.$t('Area')}, ${this.$t('Farmer Name')}, ${this.$t('Country')}, ${this.$t('State')}, ${this.$t('GPS Location')}, ${this.$t('Latitude')}, ${this.$t('Longitude')}\n`;
        csvData.forEach((row) => {
          csv += [row.farmName, row.zoneCount, row.cropTypeCount, this.getArea(row.farmArea), row.farmerName, row.country, row.state, `"${row.address}"`, row.lat, row.log].join(',');
          csv += "\n";
        });

        const anchor = document.createElement('a');
        anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
        anchor.target = '_blank';
        anchor.download = 'farmsReport.csv';
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
          title: 'Farms Report',
          list: this.farmsData.farmList.map(x => {
            return {
              'Farm Name':x.farmName,
              'Zones':x.zoneCount,
              'Crops':x.cropTypeCount,
              'Area':this.getArea(x.farmArea),
              'Farmer Name':x.farmerName,
              'Country':x.country,
              'State':x.state,
              'GPS Location':x.address,
              'Latitude':x.lat,
              'Longitude':x.log
            }
          }),
          startDate: this.topChartStartDate,
          endDate: this.topChartEndDate,
          timeFrame: this.topChartStartDate && this.topChartEndDate ? null : this.$t('all'),
        },
          {
            responseType: "arraybuffer",
          }
        ).then(({ data }) => {
          console.log(data)
          this.downloadBlobFile(data, "farmsReport.pdf");
          this.stopLoading();
        })
      } catch (err) {
        console.log(err)
        this.stopLoading()
      }
    },
    async resetPieChart(){
      this.pieChartOptions.labels = ["Large", "Medium", "Small"];
      this.farmersPieChartData = {
        labels: ["Large", "Medium", "Small"],
        datasets: [
          {
            label: "Farms",
            backgroundColor: "#f87979",
            data: [],
          },
        ],
      }
    }
  },
  mixins: [loadingMixin, DownloadMixin],
};
</script>
  
<style scoped>
.red-dot {
  height: 15px;
  width: 15px;
  background-color: red;
  border-radius: 50%;
}
.blue-dot{
  background-color:rgb(0, 143, 251) !important;
  height: 15px;
  width: 15px;
  border-radius: 50%;
}

.yellow-dot{
  background-color:rgb(254, 176, 25) !important;
  height: 15px;
  width: 15px;
  border-radius: 50%;
}

.green-dot{
  background-color:rgb(0, 227, 150) !important;
  height: 15px;
  width: 15px;
  border-radius: 50%;
}
</style>