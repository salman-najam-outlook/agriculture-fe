<template>
  <div class="container-fluid mx-4">
    <div class="row mt-4">
      <div class="col-md-6">
        <div class="d-flex">
          <div class="mt-2 mr-4 font-weight-bold">{{ $t('reports.pests.pestReport') }}</div>
          <v-btn-toggle dense class="" borderless color="primary" background-color="white" @change="getReports"
            v-model="filterTopChartDateBy">
            <v-btn :value="0">{{ $t('reports.today') }}</v-btn>
            <v-btn :value="1">{{ $t('reports.week') }}</v-btn>
            <v-btn :value="2">{{ $t('reports.month') }}</v-btn>
            <v-btn :value="3">{{ $t('reports.year') }}</v-btn>
            <v-btn :value="4">{{ $t('reports.all') }}</v-btn>
            <v-btn :value="5">
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
          <v-select color="primary" :items="[{ id: 'land', value: $t('reports.pests.listByLand') }]" item-value="id" item-text="value"
            background-color="white" outlined dense :placeholder="$t('reports.pests.listByLand')" value="land"></v-select>
          <v-text-field class="mx-2" color="primary" outlined dense readonly :placeholder="$t('reports.selectCrop')"
            @click="showCropFilter = true" :value="yieldCropType ? yieldCropType.name : ''"></v-text-field>
          <v-menu background-color="white" offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined color="indigo" v-bind="attrs" v-on="on">
                {{ $t('reports.export') }}
                <v-icon class="gray--text">mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
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
        <CropFilterDialog v-if="showCropFilter" :dialogI="showCropFilter" :cropTypesList="cropTypes"
          @closeDialog="showCropFilter = false" :currentId="yieldCropType ? yieldCropType.id : null"
          @cropFilterDone="cropFilterDone" />
      </div>
    </div>

    <div class="row">
      <div class="col-md-6">
        <v-text-field small :placeholder="$t('reports.search')" outlined dense prepend-inner-icon="mdi-magnify" background-color="white"
          style="width: 20rem"></v-text-field>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">
        <v-card>
          <v-card-text>
            <template v-if="farmersPieChartData.datasets[0].data.length">
              <v-card-subtitle class="font-weight-black">{{ $t('reports.pests.pestStatistics') }}</v-card-subtitle>
              <v-row>
                <v-col>
                  <PieChart :series="farmersPieChartData.datasets[0].data" :chartOptions="farmersPieChartData.options">
                  </PieChart>
                </v-col>
                <v-col>
                  <div class="d-flex">
                    <div class="region mr-5 text-right">
                      <div><strong>{{ farmersData ? farmersData.stats.regions : '' }}</strong></div>
                      <div>{{ $t('reports.pests.regions') }}</div>
                    </div>
                    <div class="region text-right">
                      <div><strong>{{ farmersData ? farmersData.stats.occurrences : '' }}</strong></div>
                      <div>{{ $t('reports.pests.occurrences') }}</div>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </template>

            <v-card-subtitle class="font-weight-black">{{ $t('reports.pests.pestChart') }}</v-card-subtitle>
            <v-row>
              <v-col>
                <BarChart :chartData="farmersChartData" :chartOptions="farmersChartOptions"
                  v-if="farmersChartData.labels.length" />
              </v-col>
            </v-row>

            <v-data-table :headers="regionsHeaders" :items="farmersData.pestsList" :items-per-page="5"
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
                <v-btn rounded color="primary" @click="downloadPdf" outlined>{{ $t('reports.downloadPdfReport') }}</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </div>
</template>
  
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import DashboardReportService from "@/_services/DashboardReportService";
import BarChart from "./Bar.vue";
import PieChart from "./Pie.vue";
import CropFilterDialog from './CropFilterDialog.vue';
import moment from "moment";
import DownloadMixin from "@/mixins/DownloadMixin";

export default {
  components: {
    BarChart,
    CropFilterDialog,
    PieChart,
  },
  data() {
    return {
      farmersData: {},
      filterTopChartDateBy: 4,
      filterDateCustom: [],
      customFilterMenu: false,
      regionsHeaders: [
        {
          text: this.$t('reports.pests.pestName'),
          align: "start",
          sortable: true,
          value: "name",
        },
        { text: this.$t('reports.pests.totalArea'), value: "totalArea" },
        { text: this.$t('reports.pests.regions'), value: "regions" },
        { text: this.$t('reports.pests.crop'), value: "crops" }
      ],
      farmersChartData: {
        labels: [],
        datasets: [
          {
            label: this.$t('reports.pests.totalArea'),
            backgroundColor: "#f87979",
            data: [],
          },
        ],
      },
      farmersChartOptions: {
        chart: {
          id: 'Pest_Report'
        },
        interaction: {
          mode: "index",
          intersect: true,
        },
        stacked: false,
        plugins: {
          title: {
            display: true,
            text: "Farmers Chart",
          },
        },
      },
      farmersPieChartData: {
        labels: ["Large", "Medium", "Small"],
        datasets: [
          {
            label: "Farmers",
            backgroundColor: "#f87979",
            data: [],
          },
        ],
      },
      showCropFilter: false,
      yieldCropType: null,
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
      } else if (this.filterTopChartDateBy === 4) {
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
  },
  methods: {
    async cropFilterDone(val) {
      try {
        this.yieldCropType = this.cropTypes.find(item => item.id === val);
        this.showCropFilter = false;

        await this.getFarmersData();
        console.log(val, 'crop id');
      } catch (error) {
        //
      }
    },
    async getFarmersData() {
      let data = { sDate: this.topChartStartDate, eDate: this.topChartEndDate, cropId: this.yieldCropType?.id };
      await DashboardReportService.getPestReport(data)
        .then((res) => {
          this.farmersChartData = {
            labels: [],
            datasets: [
              {
                label:this.$t('reports.pests.totalArea'),
                backgroundColor: "#f87979",
                data: [],
              },
            ],
          }
          this.farmersChartOptions = {
            chart: {
              id: 'Pest_Report'
            },
            interaction: {
              mode: "index",
              intersect: true,
            },
            stacked: false,
            plugins: {
              title: {
                display: true,
                text: "Farmers Chart",
              },
            },
          }

          this.farmersPieChartData = {
            labels: ["Large", "Medium", "Small"],
            datasets: [
              {
                label: "Farmers",
                backgroundColor: "#f87979",
                data: [],
              },
            ],
          }
          this.farmersData = res.data.data;
          this.farmersData.pestsList =  this.farmersData.pestsList.map(el => {
            el.totalArea = parseFloat(el.totalArea).toFixed(2)
            return el
          })
          const farmers = res.data.data.pestsChart
            .filter((item) => item.name != null)
            .map((item) => item.name);
          this.farmersChartData.labels = farmers;

          const counts = res.data.data.pestsChart
            .filter((item) => item.totalArea != null)
            .map((item) => item.totalArea);
          this.farmersChartData.datasets[0].data = counts;

          this.farmersPieChartData.options = {
            chart: {
              width: 380,
              type: 'pie',
            },
            labels: res.data.data.stats.pieChartData.map(data => data.name),
            responsive: [{
              breakpoint: 480,
              options: {
                chart: {
                  width: 200
                },
                legend: {
                  position: 'bottom'
                }
              }
            }]
          }
          res.data.data.stats.pieChartData.forEach(data => {
            if (data.percentage) {
              this.farmersPieChartData.datasets[0].data.push(data.percentage);
            }
          })
        })
        .catch((err) => {
          console.log(err);
          this.stopLoading();
        });
    },
    async getReports() {
      if (this.filterTopChartDateBy < 5 || this.filterDateCustom.length == 2) {
        this.startLoading();
        await this.getFarmersData();
        this.stopLoading();
      }
    },
    async downloadExcel() {
      this.startLoading();
      try {
        const data = this.farmersData.pestsList;
        const sheetData = data.map(row => ({
          [this.$t('Pest Name')]:row.name,
          [this.$t('Total Area')]:row.totalArea,
          [this.$t('Region')]:row.regions,
          [this.$t('Crop')]:row.crops
        }));
        const { data: blob } = await this.$http.post('/reports/generate-excel', {
          data: sheetData,
        }, { responseType: 'blob' });
        this.downloadBlob(blob, 'pestReport.xlsx');
        this.stopLoading();
      } catch (error) {
        console.error(error);
        this.stopLoading();
      }
    },
    async downloadCsv() {
      this.startLoading()
      try {
        const csvData = this.farmersData.pestsList;
        let csv = `${this.$t('Pest Name')}, ${this.$t('Total Area')}, ${this.$t('Region')}, ${this.$t('Crop')}\n`;
        csvData.forEach((row) => {
          csv += [`"${row.name}"`, row.totalArea, `"${row.regions}"`, `"${row.crops}"`].join(',');
          csv += "\n";
        });
        const anchor = document.createElement('a');
        anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
        anchor.target = '_blank';
        anchor.download = 'pestReport.csv';
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
          title:this.$t('Pest Report'),
          list: this.farmersData.pestsList.map(row => {
            return {
              'Pest Name':row.name,
              'Total Area':row.totalArea,
              'Region':row.regions,
              'Crop':row.crops
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
          this.downloadBlobFile(data, "pestReport.pdf");
          this.stopLoading();
        })
      } catch (err) {
        console.log(err)
        this.stopLoading()
      }
    },
    async customDateFilterSelect() {
      this.customFilterMenu = false;
      await this.getFarmersData();
    }
  },
  mixins: [DownloadMixin, loadingMixin],
  props: {
    cropTypes: {
      required: false,
      type: Array,
      default: () => [],
    }
  },
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