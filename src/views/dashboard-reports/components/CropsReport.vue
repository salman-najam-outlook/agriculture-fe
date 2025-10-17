<template>
  <div v-if="cropsData">
    <div  class="row mt-4">
      <div class="col-md-6">
        <div class="d-flex">
          <div class="mt-2 mr-4 font-weight-bold">{{$t('cropsReport')}}</div>
          <v-btn-toggle
            dense
            class=""
            borderless
            color="primary"
            background-color="white"
            v-model="filterTopChartDateBy"
            @change="getReports"
          >
              <v-btn :value="0"> {{ $t('today') }} </v-btn>
              <v-btn :value="1"> {{ $t('week') }} </v-btn>
              <v-btn :value="2"> {{ $t('month') }} </v-btn>
              <v-btn :value="3"> {{ $t('year') }} </v-btn>
              <v-btn :value="4"> {{ $t('all') }} </v-btn>
              <v-btn :value="5">
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
        <v-text-field
          small
          :placeholder="$t('search')"
          outlined
          dense
          prepend-inner-icon="mdi-magnify"
          background-color="white"
          style="width: 20rem"
        ></v-text-field>
      </div>
      <div class="col-md-6 text-right">
        <!-- <span class="text--disabled">10 of 129</span> -->
        <!-- <v-btn fab small outlined color="primary" class="mx-2"
          ><v-icon>mdi-chevron-left</v-icon></v-btn
        >
        <v-btn fab small outlined color="primary" class="mx-2"
          ><v-icon>mdi-chevron-right</v-icon></v-btn
        > -->
      </div>
    </div>

    <v-card>
      <v-card-text>
        <v-card-subtitle class="font-weight-black">{{ $t('cropsStatistics') }}</v-card-subtitle>
        <v-row v-if="cropsPieChartData.datasets[0].data.length">
          <v-col>
            <PieChart v-show="cropsPieChartData.datasets[0].data.join('') > 0" :series="cropsPieChartData.datasets[0].data" :chartOptions="pieChartOptions"/>
            <h3 v-show="cropsPieChartData.datasets[0].data.join('') == 0">No Yield Data</h3>

          </v-col>
          <v-col>
            <div class="d-flex justify-space-around mb-4 text-right">
              <div>
                <span class="font-weight-bold">{{
                   cropsData.cropStat.cropsCount
                }}</span
                ><br />
                <small>{{ $t('crops') }}</small>
              </div>
              <div>
                <span class="font-weight-bold"
                  >{{ getArea(parseFloat(totalPlantedArea).toFixed(2)) }}</span
                ><br />
                <small>{{ $t('totalPlantedArea') }}</small>
              </div>
            </div>
            <div class="row mt-4">
              <div v-for="cropDet in cropsData.cropStat.cropYieldStat" :key="cropDet.cropName" class="div-md-4 mx-2">
                <div class="d-flex">
                  <div class="text-right">
                    <span class="font-weight-bold">{{
                      cropDet.yield
                    }}</span
                    ><br />
                    <small class="text-capitalize">{{ cropDet.cropName }}</small>
                  </div>
                  <span class="ml-2 mt-4 red-dot"></span>
                </div>
              </div>
              <!-- <div class="div-md-4 mx-2">
                <div class="d-flex">
                  <div class="text-right">
                    <span class="font-weight-bold">{{
                      cropsData.cropYieldStat.yield
                    }}</span
                    ><br />
                    <small class="text-capitalize">Medium Farmers</small>
                  </div>
                  <span class="ml-2 mt-4 red-dot"></span>
                </div>
              </div>
              <div class="div-md-4 mx-2">
                <div class="d-flex">
                  <div class="text-right">
                    <span class="font-weight-bold">{{
                      cropsData.cropYieldStat.yield
                    }}</span
                    ><br />
                    <small class="text-capitalize">Small Farmers</small>
                  </div>
                  <span class="ml-2 mt-4 red-dot"></span>
                </div>
              </div> -->
            </div>
          </v-col>
        </v-row>

        <v-card-subtitle class="font-weight-black">{{ $t('farmersChart') }}</v-card-subtitle>
        <v-row>
          <v-col>
            <BarChart
              :chartData="cropsChartData"
              :chartOptions="farmersChartOptions"
            />
          </v-col>
        </v-row>

        <v-data-table
          :headers="cropsHeaders"
          :items="cropsData.cropChart"
          :items-per-page="5"
          class="elevation-1 mt-6"
          :footer-props="{
            'items-per-page-text': $t('rowsPerPage')
          }"
        >
        <template v-slot:item.plantedArea="{ item }">
            {{ getArea(item.plantedArea) }}
        </template>
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

export default {
  props: {
    globalSettings: {
      type: Object,
      require: false,
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
      totalPlantedArea: 0,
      filterTopChartDateBy: 4, //default '3 - year'
      filterDateCustom: [],
      customFilterMenu: false,
      graphFilterModel:  {
          label: this.$t('listByYield'),
          value: "yield"
        },
      graphFilterOptions: [
        {
          label: this.$t('listByPlantedArea'),
          value: "plantedArea"
        },
        {
          label: this.$t('listByYield'),
          value: "yield"
        }
      ],
      cropsData: null,
      cropsHeaders: [
        {
          text: this.$t('cropsName'),
          align: "start",
          sortable: true,
          value: "cropName",
        },
        { text: this.$t('farmers'), value: "farmersCount" },
        { text: this.$t('farms'), value: "farmsCount" },
        { text: this.$t('planted'), value: "plantedCount" },
        { text: this.$t('plantedArea'), value: "plantedArea" }, 
        { text: this.$t('harvested'), value: "harvestedCount" }, 
        { text: this.$t('yieldAcre'), value: "yield" },
      ],
      cropsChartData: {
        labels: [],
        datasets: [
          {
            label: this.$t('yieldAcre'),
            backgroundColor: "#f87979",
            data: [],
          },
        ],
      },
      farmersChartOptions: {
        chart: {
          id: 'Crop_Report',
          export: {
        },
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
      pieChartOptions:  {
        "chart": {
            "width": 380,
            "type": "pie"
        },
        labels: [
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
      cropsPieChartData: {
        labels: ["onion","safflower","sugarcane"],
        datasets: [
          {
            label: "Farmers",
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
  watch: {
    graphFilterModel: {
      handler(nV) {
        console.log(nV, 'nv')

     if (nV == "plantedArea") {
          const farmers =this.cropsData.cropChart
            .filter((item) => item.cropName != null)
            .map((item) => item.cropName);
          this.cropsChartData.labels = farmers;
          this.pieChartOptions.labels = ["Large", "Medium", "Small"]

          const areas =this.cropsData.cropChart
            .filter((item) => item.cropName != null)
            .map((item) => item.plantedArea);
          this.cropsChartData.datasets[0].data = areas;
          this.cropsChartData.datasets[0].label = 'Planted Area';

        } else if (nV == "yield") {
          const farmers =this.cropsData.cropChart
            .filter((item) => item.cropName != null)
            .map((item) => item.cropName);
          this.cropsChartData.labels = farmers;
          this.pieChartOptions.labels = ["Large", "Medium", "Small"]

          const areas =this.cropsData.cropChart
            .filter((item) => item.cropName != null)
            .map((item) => item.yield);
          this.cropsChartData.datasets[0].data = areas;
          this.cropsChartData.datasets[0].label = 'Yield/Acre';

        }

      
      }
    }
  },
  async mounted() {
    await this.getReports();
    // await this.getCropsData()

    let cropTypeRes = await DashboardReportService.getCropTypes()
    this.cropTypes = cropTypeRes.data
    cropTypeRes.data.forEach(cropEl => {
      this.cropIdToName[cropEl.id] = cropEl.name

    })
  },
  methods: {
    getArea(baseArea) {
      if (!baseArea) return
      const factor = this.globalSettings?.areaUnit?.factor ?? 1;
      return `${(baseArea / factor).toFixed(2)} ${
        this.globalSettings?.areaUnit?.abbvr ?? 'ac'
      }`;
    },
    async getReports() {
      if (this.filterTopChartDateBy < 5 || this.filterDateCustom.length == 2) {
        this.startLoading();
        await this.getCropsData();
        this.stopLoading();
      }

    },
      async cropFilterDone(val) {
          this.startLoading();
      try {
        console.log('crop filter val', val);

        console.log('inside main crop filter');
        this.cropFilterModel = this.cropIdToName[val];

        this.showCropFilter = false;
        this.currentCropFilterId = val;


        await this.getCropsData({ cropType: val });

        console.log(val, 'crop id')
      } catch (error) {
        this.stopLoading();
      }
      this.stopLoading();

    },
    async getCropsData(queryParams) {      
      const data = { sDate: this.topChartStartDate, eDate: this.topChartEndDate, ...queryParams, cropType: this.currentCropFilterId };
      await DashboardReportService.getCropsReport(data)
        .then((res) => {
          this.totalPlantedArea = res.data.cropChart.reduce((total, currentValue) => {
              return total + currentValue.plantedArea;
            }, 0);

            
          this.cropsData = res.data;
          this.cropsData.cropChart =  this.cropsData.cropChart.map(el => {
            el.plantedArea = parseFloat(el.plantedArea).toFixed(2)
            return el
          })
          const farmers = res.data.cropChart
            .filter((item) => item.cropName != null)
            .map((item) => item.cropName);
          this.cropsChartData.labels = farmers;


          const areas = res.data.cropChart
            .filter((item) => item.cropName != null)
            .map((item) => item.yield);
          this.cropsChartData.datasets[0].data = areas;

          res.data.cropStat.cropYieldStat.forEach(el => {
            this.pieChartOptions.labels.push(el.cropName);
            this.cropsPieChartData.labels.push(el.cropName);
            this.cropsPieChartData.datasets[0].data.push(parseInt(el.yield || 0));
           });
           
        })
        .catch((err) => {
          console.log(err);
   
        });
    },
    async resetPieChart(){
      this.pieChartOptions = {
        "chart": {
            "width": 380,
            "type": "pie"
        },
        labels: [
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
      this.cropsPieChartData.labels = ["onion","safflower","sugarcane"];
      this.cropsPieChartData.datasets =  [
          {
            label: "Farmers",
            backgroundColor: "#f87979",
            data: [],
          },
        ];
    },
    async customDateFilterSelect() {
      this.customFilterMenu = false;
      await this.resetPieChart();
      // await this.getCropsData();      
    },
    async downloadExcel() {
      this.startLoading();
      try {
        const data = this.cropsData.cropChart;
        const sheetData = data.map(row => ({
          [this.$t('Crop Name')]: row.cropName,
          [this.$t('Farmers')]: row.farmersCount,
          [this.$t('Farms')]: row.farmsCount,
          [this.$t('Planted')]: row.plantedCount,
          [this.$t('Planted Area')]: this.getArea(row.plantedArea),
          [this.$t('Harvested')]: row.harvestedCount,
          [this.$t('Yield/acre')]: row.yield,
        }));
        const { data: blob } = await this.$http.post('/reports/generate-excel', {
          data: sheetData,
        }, { responseType: 'blob' });
        this.downloadBlob(blob, 'cropsReport.xlsx');
        this.stopLoading();
      } catch (error) {
        console.error(error);
        this.stopLoading();
      }
    },
    async downloadCsv() {
      this.startLoading()
      try {
        const csvData = this.cropsData.cropChart
        let csv = `${this.$t('Crop Name')}, ${this.$t('Farmers')}, ${this.$t('Farms')}, ${this.$t('Planted')}, ${this.$t('Planted Area')}, ${this.$t('Harvested')}, ${this.$t('Yield/acre')}\n`;
        csvData.forEach((row) => {
          csv += [row.cropName, row.farmersCount, row.farmsCount, row.plantedCount, this.getArea(row.plantedArea), row.harvestedCount, row.yield,].join(',');
          csv += "\n";
        });
        const anchor = document.createElement('a');
        anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
        anchor.target = '_blank';
        anchor.download = 'cropsReport.csv';
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
          title: this.$t('Crops Report'),
          list: this.cropsData.cropChart.map(row => {
            return {
              'Crop Name':row.cropName,
              'Farmers':row.farmersCount,
              'Farms':row.farmsCount,
              'Planted':row.plantedCount,
              'Planted Area':this.getArea(row.plantedArea),
              'Harvested':row.harvestedCount,
              'Yield/acre':row.yield
            }
          }),
          startDate: this.topChartStartDate,
          endDate: this.topChartEndDate,
        },
          {
            responseType: "arraybuffer",
          }
        ).then(({ data }) => {
          this.downloadBlobFile(data, "cropsReport.pdf");
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
.red-dot {
  height: 15px;
  width: 15px;
  background-color: red;
  border-radius: 50%;
}
</style>