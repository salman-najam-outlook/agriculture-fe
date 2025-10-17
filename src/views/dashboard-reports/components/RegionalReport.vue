<template>
  <div v-if="!isLoading">
    <div class="row mt-4">
      <div class="col-md-6">
        <div class="d-flex">
          <div class="mt-2 mr-4 font-weight-bold">{{ $t('reports.regions.regionalReport') }}</div>
          <v-btn-toggle dense class="" borderless color="primary" background-color="white" @change="getReports"
            v-model="filterTopChartDateBy">
            <v-btn :value="0">{{ $t('reports.today') }}</v-btn>
            <v-btn :value="1">{{ $t('reports.week') }}</v-btn>
            <v-btn :value="2">{{ $t('reports.month') }}</v-btn>
            <v-btn :value="3">{{ $t('reports.year') }}</v-btn>
            <v-btn :value="4">{{ $t('reports.all') }}</v-btn>
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
            :items="graphFilterOptions" item-text="label" item-value="value" :placeholder="$t('reports.regions.listByFarm')"></v-select>
            <v-text-field class="mx-2" color="primary" outlined dense readonly :placeholder="$t('reports.selectCrop')"
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
        <v-text-field small :placeholder="$t('reports.search')" outlined dense prepend-inner-icon="mdi-magnify"
          background-color="white" style="width: 20rem"></v-text-field>
      </div>
    </div>

    <v-card>
      <v-card-text>
        <v-card-subtitle class="font-weight-black">{{ $t('reports.regions.regionalStatistics') }}</v-card-subtitle>
        <v-row>
          <v-col>
            <PieChart :series="regionalChartData.datasets[0].data" :chartOptions="pieChartOptions" v-if="this.regionalChartData.datasets[0].data.length" />
          </v-col>
          <v-col>
            <div class="d-flex justify-space-around mb-4 text-right">
              <div>
                <span class="font-weight-bold">{{
    regionalData && regionalData.regionalStat.country
}}</span><br />
                <small>{{ $t('reports.regions.countries') }}</small>
              </div>
              <div>
                <span class="font-weight-bold">{{
    regionalData && regionalData.regionalStat.state
}}</span><br />
                <small>{{ $t('reports.regions.states') }}</small>
              </div>
              <div>
                <span class="font-weight-bold">{{
    regionalData && regionalData.regionalStat.city
}}</span><br />
                <small>{{ $t('reports.regions.city') }}</small>
              </div>
            </div>
            <div  v-if="regionalData" class="row mt-4">
              <div class="div-md-4 mx-2 pb-2" v-for="(farm, key) in regionalData.regionalList" :key="key">
                <div class="d-flex">
                  <div class="text-right">
                    <span class="font-weight-bold">{{ farm.farmCount }}</span><br />
                    <small class="text-capitalize">{{ $t('reports.regions.farmsIn') }} {{ farm.country }}</small>
                  </div>
                  <span class="ml-2 mt-4" style="height: 15px;
                      width: 15px;
                      background-color: red;
                      border-radius: 50%;
                    "></span>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
        <v-card-subtitle class="font-weight-black">{{ $t('reports.regions.regionalChart') }}</v-card-subtitle>
        <v-row>
          <v-col>
            <BarChart :chartData="regionalChartData" :chartOptions="regionalChartOptions" />
          </v-col>
        </v-row>

        <v-data-table :headers="regionsHeaders" v-if="regionalData" :items="regionalData.regionalList" :items-per-page="5"
          class="elevation-1 mt-6" 
          :footer-props="{
            'items-per-page-text': $t('rowsPerPage'),
            'show-current-page': true,
          }">
          <template v-slot:no-data>
            {{ $t('noDataAvailable') }}
          </template>
          <template v-slot:footer.page-text="{ pageStart, pageStop, itemsLength }">
            {{ pageStart }}-{{ pageStop }} {{ $t('of') }} {{ itemsLength }}
          </template>
        </v-data-table>

        <v-row class="mt-6">
          <v-col class="text-center">
            <v-btn @click="downloadPdf" rounded color="primary" outlined>{{ $t('reports.downloadPdfReport') }}</v-btn>
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
import BarChart from "./Bar.vue";
import PieChart from "./Pie.vue";
import DashboardReportService from "@/_services/DashboardReportService";
import moment from "moment";
import CropFilterDialog from "../components/CropFilterDialog.vue";

export default {
  components: {
    BarChart,
    PieChart,
    CropFilterDialog
  },
  data() {
    return {
      cropFilterModel: null,
      currentCropFilterId: null,
      showCropFilter: false,
      cropIdToName: {},
      graphFilterModel: {
        label: "List by Farms",
        value: "farm"
      },
      graphFilterOptions: [
        {
          label: this.$t("reports.regions.listByFarm"),
          value: "farm"
        },
        {
          label: this.$t("reports.regions.listByFarmers"),
          value: "farmer"
        },
        {
          label: this.$t("reports.regions.listByYield"),
          value: "yield"
        }
      ],
      filterTopChartDateBy: 4, //default '3 - year'
      filterDateCustom: [],
      customFilterMenu: false,
      isLoading: false,
      regionalData: null,
      regionsHeaders: [
        {
          text: this.$t('reports.regions.regionName'),
          align: "start",
          sortable: true,
          value: "country",
        },
        { text: this.$t('reports.regions.farmers'), value: "farmersCount" },
        { text: this.$t('reports.regions.farms'), value: "farmCount" },
        { text: this.$t('reports.regions.yield'), value: "yield" },
      ],
      regionalChartData: {
        labels: [],
        datasets: [
          {
            label: this.$t('farms'),
            backgroundColor: "#f87979",
            data: [],
          },
        ],
      },
      regionalChartOptions: {
        chart: {
          id: 'Regional_Report',
        },
        interaction: {
          mode: "index",
          intersect: true,
        },
        stacked: false,
        plugins: {
          title: {
            display: true,
            text: "Regional Chart",
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
      }
    };
  },
  watch: {
    graphFilterModel: {
      handler(nV) {
        console.log(nV, 'nv')

        if (nV == "farm") {
          const farmers = this.regionalData.regionalList
            .filter((item) => item.country != null)
            .map((item) => item.country);
          this.regionalChartData.labels = farmers;


          const areas = this.regionalData.regionalList
            .filter((item) => item.country != null)
            .map((item) => item.farmCount);
          this.regionalChartData.datasets[0].data = areas;
          this.regionalChartData.datasets[0].label = this.$('reports.regions.farms');

        } else if (nV == "farmer") {
          const farmers = this.regionalData.regionalList
            .filter((item) => item.country != null)
            .map((item) => item.country);
          this.regionalChartData.labels = farmers;

          const areas = this.regionalData.regionalList
            .filter((item) => item.country != null)
            .map((item) => item.farmersCount);
          this.regionalChartData.datasets[0].data = areas;
          this.regionalChartData.datasets[0].label = this.$('reports.regions.farmers');

        } else if (nV == "yield") {
          const farmers = this.regionalData.regionalList
            .filter((item) => item.country != null)
            .map((item) => item.country);
          console.log(farmers, 'farmers 123')
          this.regionalChartData.labels = farmers;


          const areas = this.regionalData.regionalList
            .filter((item) => item.country != null)
            .map((item) => item.yield || 0);
          console.log(areas, 'areas 123')
          this.regionalChartData.datasets[0].data = areas;
          this.regionalChartData.datasets[0].label = this.$('reports.regions.yield');

        }


      }
    }
  },
  async mounted() {
    await this.getReports();
    let cropTypeRes = await DashboardReportService.getCropTypes()
    this.cropTypes = cropTypeRes.data
    cropTypeRes.data.forEach(cropEl => {
      this.cropIdToName[cropEl.id] = cropEl.name

    })

 
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
        return null
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
  methods: {    
    async cropFilterDone(val) {
          this.startLoading();
      try {
        console.log('crop filter val', val);

        console.log('inside main crop filter');
        this.cropFilterModel = this.cropIdToName[val];

        this.showCropFilter = false;
        this.currentCropFilterId = val;


        await this.getRegionalData({ cropType: val });

        console.log(val, 'crop id')
      } catch (error) {
        this.stopLoading();
      }
      this.stopLoading();

    },
    async getRegionalData(queryParams) {
      const data = { sDate: this.topChartStartDate, eDate: this.topChartEndDate, ...queryParams, cropType: this.currentCropFilterId };
      await DashboardReportService.getRegionsReport(data)
        .then((res) => {
          this.regionalData = res.data;
          const regions = res.data.regionalList
            .filter((item) => item.country != null)
            .map((item) => item.country);
          this.regionalChartData.labels = regions;
          this.pieChartOptions.labels = regions

          const farms = res.data.regionalList
            .filter((item) => item.country != null)
            .map((item) => parseInt(item.farmCount || 0));
          this.regionalChartData.datasets[0].data = farms;


        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getReports() {
      if (this.filterTopChartDateBy < 5 || this.filterDateCustom.length == 2) {
        this.startLoading();
        await this.getRegionalData();
        this.stopLoading();
      }

    },
    async customDateFilterSelect() {
      this.customFilterMenu = false;
      await this.getRegionalData();
    },
    async downloadExcel() {
      this.startLoading();
      try {
        const data = this.regionalData.regionalList;
        const sheetData = data.map(row => ({
          [this.$t('Region Name')]: row.country,
          [this.$t('Farmers')]: row.farmersCount,
          [this.$t('Farms')]: row.farmCount,
          [this.$t('Yield/acre')]: row.yield,
        }));
        const { data: blob } = await this.$http.post('/reports/generate-excel', {
          data: sheetData,
        }, { responseType: 'blob' });
        this.downloadBlob(blob, 'regionalReport.xlsx');
        this.stopLoading();
      } catch (error) {
        console.error(error);
        this.stopLoading();
      }
    },
    async downloadCsv() {
      this.startLoading()
      try {
        const csvData = this.regionalData.regionalList

        let csv = `${this.$t('Region Name')}, ${this.$t('Farmers')}, ${this.$t('Farms')}, ${this.$t('Yield/acre')}\n`;
        csvData.forEach((row) => {
          csv += [row.country, row.farmersCount, row.farmCount, row.yield].join(',');
          csv += "\n";
        });

        const anchor = document.createElement('a');
        anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
        anchor.target = '_blank';
        anchor.download = 'regionalReport.csv';
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
          title: this.$t('Regional Report'),
          list: this.regionalData.regionalList.map(x => {
            return {
              "Region Name":x.country,
              "Farmers":x.farmersCount,
              "Farmers":x.farmCount,
              "Yield/acre":x.yield
              }
          }),
          startDate: this.topChartStartDate,
          endDate: this.topChartEndDate,
        },
          {
            responseType: "arraybuffer",
          }
        ).then(({ data }) => {
          this.downloadBlobFile(data, "regionalReport.pdf");
          this.stopLoading();
        })
      } catch (err) {
        console.log(err)
        this.stopLoading()
      }
    },
  },
  mixins: [loadingMixin, DownloadMixin],
};
</script>

<style scoped>
/* ::v-deep .v-data-table-header {
  background-color: #ffffff !;
} */
</style>