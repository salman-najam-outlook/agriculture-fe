<template>
  <div v-if="farmersData">
    <div class="row mt-4">
      <div class="col-md-6">
        <div class="d-flex">
          <div class="mt-2 mr-4 font-weight-bold">{{ $t('farmersReport') }}</div>
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
          <v-select
            color="primary"
            background-color="white"
            outlined
            dense
            item-text="label"
            item-value="value"
            v-model="graphFilterModel"
            :items="graphFilterOptions"
          ></v-select>
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
        <!-- <span class="text--disabled">10 of 129</span> -->
        <!-- <v-btn fab small outlined color="primary" class="mx-2"><v-icon>mdi-chevron-left</v-icon></v-btn> -->
        <!-- <v-btn fab small outlined color="primary" class="mx-2"><v-icon>mdi-chevron-right</v-icon></v-btn> -->
      </div>
    </div>

    <v-card>
      <v-card-text>
        <v-card-subtitle class="font-weight-black">{{ $t('farmersStatistics') }}</v-card-subtitle>
        <v-row>
          <v-col>
            <PieChart :series="farmersPieChartData.datasets[0].data" :chartOptions="pieChartOptions" />

          </v-col>
          <v-col>
            <div class="d-flex justify-space-around mb-4 text-right">
              <div>
                <span class="font-weight-bold">{{
    farmersData.farmerStat.farmerCount
}}</span><br />
                <small>{{ $t('farmers') }}</small>
              </div>
              <div>
                <span class="font-weight-bold">{{ convertSizeIntoBaseUnit(farmersData.farmerStat.avgFarmLand) }}</span><br />
                <small>{{ $t('averageFarmerLand') }}</small>
              </div>
            </div>
            <div class="row mt-4">
              <div class="div-md-4 mx-2">
                <div class="d-flex">
                  <div class="text-right">
                    <span class="font-weight-bold">{{
    farmersData.farmerStat.largeFarmerCount
}}</span><br />
                    <small class="text-capitalize">{{ $t('largeFarmers') }}</small>
                  </div>
                  <span class="ml-2 mt-4 red-dot"></span>
                </div>
              </div>
              <div class="div-md-4 mx-2">
                <div class="d-flex">
                  <div class="text-right">
                    <span class="font-weight-bold">{{
    farmersData.farmerStat.mediumFarmerCount
}}</span><br />
                    <small class="text-capitalize">{{ $t('mediumFarmers') }}</small>
                  </div>
                  <span class="ml-2 mt-4 red-dot"></span>
                </div>
              </div>
              <div class="div-md-4 mx-2">
                <div class="d-flex">
                  <div class="text-right">
                    <span class="font-weight-bold">{{
    farmersData.farmerStat.smallFarmerCount
}}</span><br />
                    <small class="text-capitalize">{{ $t('smallFarmers') }}</small>
                  </div>
                  <span class="ml-2 mt-4 red-dot"></span>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>

        <v-card-subtitle class="font-weight-black">{{ $t('farmersChart') }}</v-card-subtitle>
        <v-row>
          <v-col>
            <BarChart :chartData="farmersChartData" :chartOptions="farmersChartOptions" />
          </v-col>
        </v-row>

        <v-data-table 
          :headers="regionsHeaders" 
          :items="farmersData.farmerList" 
          :items-per-page="5"
          class="elevation-1 mt-6"
          :footer-props="{
            'items-per-page-text': $t('rowsPerPage')
          }"
          >
          <template v-slot:footer.page-text="{ pageStart, pageStop, itemsLength }">
            {{ pageStart }}-{{ pageStop }} {{ $t('of') }} {{ itemsLength }}
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
import loadingMixin from "@/mixins/LoadingMixin";
import DownloadMixin from "@/mixins/DownloadMixin";
import DashboardReportService from "@/_services/DashboardReportService";
import BarChart from "./Bar.vue";
import PieChart from "./Pie.vue";
import moment from "moment";
import CropFilterDialog from "../components/CropFilterDialog.vue";
import {convertSizeIntoBaseUnit,convertSizeIntoBaseUnitNumberOnly} from "@/utils.js"
const areaUnitName = JSON.parse(localStorage.getItem("gs"))?.areaUnit.name;
export default {
  components: {
    BarChart,
    PieChart,
    CropFilterDialog
  },
  props: {
    globalSettings: {
      type: Object,
      require: false,
    },
  },
  data() {
    return {
      currentAreaUnit: this.$t(JSON.parse(localStorage.getItem("gs"))?.areaUnit?.name || "Avg Area in Acres"),
      cropFilterModel: null,
      currentCropFilterId: null,
      showCropFilter: false,
      cropIdToName: {},
      graphFilterModel:  {
          label: "List by Land",
          value: "land"
        },
      graphFilterOptions: [
        {
          label:  this.$t('listByLand'),
          value: "land"
        },
        {
          label:  this.$t('listByFarm'),
          value: "farm"
        },
        {
          label: this.$t('listByYield'),
          value: "yield"
        }
      ],
      farmersData: null,
      filterTopChartDateBy: 4, //default '3 - year'
      filterDateCustom: [],
      customFilterMenu: false,
      regionsHeaders: [
        {
          text: this.$t('reports.farmerName'),
          align: "start",
          sortable: true,
          value: "farmerName",
        },
        { text: this.$t('farms'), value: "farmCount" },
        { text: this.$t('reports.avgAreaPerUnit', { unit: areaUnitName }), value: "farmArea" },
        { text: this.$t('crops'), value: "cropTypeCount" },
        { text: this.$t('reports.yieldPerUnit', { unit: areaUnitName }), value: "yield" },
      ],
      farmersChartData: {
        labels: [],
        datasets: [
          {
            label: this.$t( "Avg Area in " +  JSON.parse(localStorage.getItem("gs"))?.areaUnit.name),
            backgroundColor: "#f87979",
            data: [],
          },
        ],
      },
      farmersChartOptions: {
        chart: {
          id: 'Farmer_Report',
        },
        interaction: {
          mode: "index",
          intersect: true,
        },
        stacked: false,
        plugins: {
          title: {
            display: true,
            text: this.$t('farmersChart'),
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
            label: this.$t('farmers'),
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

        if(nV == "land") {
          const farmers =this.farmersData.farmerChart
            .filter((item) => item.farmerName != null)
            .map((item) => item.farmerName);
          this.farmersChartData.labels = farmers;
          this.pieChartOptions.labels = [
            this.$t('large'), 
            this.$t('medium'),
            this.$t('small'),
          ]

          const areas =this.farmersData.farmerChart
            .filter((item) => item.farmerName != null)
            .map((item) => parseFloat(item.farmArea).toFixed(2));
          this.farmersChartData.datasets[0].data = areas;
          this.farmersChartData.datasets[0].label =   this.$t("Avg Area in " +  JSON.parse(localStorage.getItem("gs"))?.areaUnit.name);

        } else if (nV == "farm") {
          const farmers =this.farmersData.farmerChart
            .filter((item) => item.farmerName != null)
            .map((item) => item.farmerName);
          this.farmersChartData.labels = farmers;
          this.pieChartOptions.labels = [
            this.$t('large'), 
            this.$t('medium'),
            this.$t('small'),
          ]

          const areas =this.farmersData.farmerChart
            .filter((item) => item.farmerName != null)
            .map((item) => item.farmCount);
          this.farmersChartData.datasets[0].data = areas;
          this.farmersChartData.datasets[0].label = 'Farms';

        } else if (nV == "yield") {
          const farmers =this.farmersData.farmerChart
            .filter((item) => item.farmerName != null)
            .map((item) => item.farmerName);
          this.farmersChartData.labels = farmers;
          this.pieChartOptions.labels = [
            this.$t('large'), 
            this.$t('medium'),
            this.$t('small'),
          ]

          const areas =this.farmersData.farmerChart
            .filter((item) => item.farmerName != null)
            .map((item) => item.yield);
          this.farmersChartData.datasets[0].data = areas;
          this.farmersChartData.datasets[0].label = 'Yield/Acre';

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
        return null
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
    this.currentAreaUnit = this.$t("Avg Area in " +  JSON.parse(localStorage.getItem("gs"))?.areaUnit.name)
    await this.getReports();
    let cropTypeRes = await DashboardReportService.getCropTypes()
    this.cropTypes = cropTypeRes.data
    cropTypeRes.data.forEach(cropEl => {
      this.cropIdToName[cropEl.id] = cropEl.name

    })

  },
  methods: {
    convertSizeIntoBaseUnit,
    convertSizeIntoBaseUnitNumberOnly,
    getArea(baseArea) {
      const factor = this.globalSettings?.areaUnit?.factor ?? 1;
      return `${(baseArea / factor).toFixed(2)} ${
        this.globalSettings?.areaUnit?.abbvr ?? 'ac'
      }`;
    },
    async cropFilterDone(val) {
          this.startLoading();
      try {
        console.log('crop filter val', val);

        console.log('inside main crop filter');
        this.cropFilterModel = this.cropIdToName[val];

        this.showCropFilter = false;
        this.currentCropFilterId = val;


        await this.getFarmersData({ cropType: val });

        console.log(val, 'crop id')
      } catch (error) {
        this.stopLoading();
      }
      this.stopLoading();

    },
    async getFarmersData(queryParams) {
      const data = { sDate: this.topChartStartDate, eDate: this.topChartEndDate, ...queryParams, cropType: this.currentCropFilterId };
      await DashboardReportService.getFarmersReport(data)
        .then((res) => {
          this.farmersData = res.data;
          this.farmersData.farmerList =  this.farmersData.farmerList.map(el => {
            el.farmArea = this.convertSizeIntoBaseUnitNumberOnly(el.farmArea)
            return el
          })
          const farmers = res.data.farmerChart
            .filter((item) => item.farmerName != null)
            .map((item) => item.farmerName);
          this.farmersChartData.labels = farmers;
          this.pieChartOptions.labels = [
            this.$t('large'), 
            this.$t('medium'),
            this.$t('small'),
          ]

          const areas = res.data.farmerChart
            .filter((item) => item.farmerName != null)
            .map((item) => this.convertSizeIntoBaseUnitNumberOnly(item.farmArea));
          this.farmersChartData.datasets[0].data = areas;

          this.farmersPieChartData.datasets[0].data.push(
            res.data.farmerStat.largeFarmerCount,
            res.data.farmerStat.mediumFarmerCount,
            res.data.farmerStat.smallFarmerCount
          );
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getReports() {
      if (this.filterTopChartDateBy < 5 || this.filterDateCustom.length == 2) {
        this.startLoading();
        await this.getFarmersData();
        this.stopLoading();
      }

    },
    async customDateFilterSelect() {
      this.customFilterMenu = false;
      await this.resetPieChart();
      // await this.getFarmersData();
    },
    async downloadExcel() {
      this.startLoading();
      try {
        const unitName = JSON.parse(localStorage.getItem("gs"))?.areaUnit?.name || 'Acre';
        const data = this.farmersData.farmerList;
        const sheetData = data.map(row => ({
          [this.$t('Farmer Name')]: row.farmerName,
          [this.$t('Farms')]: row.farmCount,
          [this.$t(`Avg. land/${unitName}`)]: row.farmArea,
          [this.$t('Crops')]: row.cropTypeCount || null,
          [this.$t(`Yield/${unitName}`)]: row.yield,
        }));
        const { data: blob } = await this.$http.post('/reports/generate-excel', {
          data: sheetData,
        }, { responseType: 'blob' });
        this.downloadBlob(blob, 'farmersReport.xlsx');
        this.stopLoading();
      } catch (error) {
        console.error(error);
        this.stopLoading();
      }
    },
    async downloadCsv() {
      this.startLoading()
      try {
        const unitName = JSON.parse(localStorage.getItem("gs"))?.areaUnit?.name || 'Acre';
        const csvData = this.farmersData.farmerList
        let csv = `${this.$t('Farmer Name')}, ${this.$t('Farms')}, ${this.$t(`Avg. lang/${unitName}`)}, ${this.$t('Crops')}, ${this.$t(`Yield/${unitName}`)}\n`;
        csvData.forEach((row) => {
          csv += [row.farmerName, row.farmCount, row.farmArea, row.cropTypeCount, row.yield,].join(',');
          csv += "\n";
        });

        const anchor = document.createElement('a');
        anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
        anchor.target = '_blank';
        anchor.download = 'farmersReport.csv';
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
        const unitName = JSON.parse(localStorage.getItem("gs"))?.areaUnit?.name || 'Acre';
        await this.$http.post(`/reports/pdfs`, {
          title: this.$t('Farmers Report'),
          reportType:'farmer',
          list: this.farmersData.farmerList.map(x => {
            return {
              "Farmer Name": x.farmerName,
              "Farms": x.farmCount,
              [`Avg. land/${unitName}`]: x.farmArea,
              "Crops": null,
              [`Yield/${unitName}`]: x.yield,
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
          this.downloadBlobFile(data, "farmersReport.pdf");
          this.stopLoading();
        })
      } catch (err) {
        console.log(err)
        this.stopLoading()
      }
    },
    async resetPieChart(){
      this.pieChartOptions = {
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
      };
      this.farmersPieChartData.labels = ["Large", "Medium", "Small"];
      this.farmersPieChartData.datasets = [
          {
            label: "Farmers",
            backgroundColor: "#f87979",
            data: [],
          },
        ];
        this.pieChartOptions.labels =  ["Large", "Medium", "Small"];
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
</style>