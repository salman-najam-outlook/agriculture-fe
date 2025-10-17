<template>
  <div class="new">
    <div class="d-flex vv">
      <h2>{{ $t('farmer') }}</h2>
      <v-spacer></v-spacer>
      <div flat class="pb-3">
        <v-select
          v-if="filterType == 'year'"
          :items="years"
          item-text="name"
          item-value="value"
          outlined
          dense
          class="mt-7 text-no-wrap"
          style="max-width: 100px"
          background-color="primary"
          v-model="selectedYear"
          @change="getGraphData"
        ></v-select>
        <v-menu
          v-else
          v-model="menu1"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-x
          left
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark v-bind="attrs" v-on="on">
              {{ filterDateMonth }}
            </v-btn>
            <!-- <v-text-field
              v-model="filterDateMonth"
              readonly
              v-bind="attrs"
              v-on="on"
              outlined
              dense
              style="width:10px"
              background-color="primary"
              color="white"
              placeholder="Select Month"
          ></v-text-field> -->
          </template>
          <v-date-picker
            color="green lighten-1"
            v-model="filterDateMonth"
            type="month"
            no-title
            :max="maxDate"
            min="2021-01"
          >
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="filterDateChanged">
              {{ $t('confirm') }}
            </v-btn>
          </v-date-picker>
        </v-menu>

        <v-menu
          bottom
          origin="center center"
          transition="scale-transition"
          class="ml-5"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark v-bind="attrs" v-on="on" class="ml-5">
              {{ filterBy === "production" ? $t("reports.byProduction") : $t("reports.byName") }}
            </v-btn>
          </template>
          <v-list style="padding-left: 10px; padding-right: 10px">
            <v-radio-group column v-model="filterBy">
              <v-radio
                :label="$t('reports.byProduction')"
                value="production"
              ></v-radio>
              <v-radio :label="$t('reports.byName')" value="name"></v-radio>
            </v-radio-group>
            <hr />
            <v-radio-group column v-model="sort">
              <v-radio :label="$t('reports.descending')" value="desc"></v-radio>
              <v-radio :label="$t('reports.ascending')" value="asc"></v-radio>
            </v-radio-group>
          </v-list>
        </v-menu>
      </div>
    </div>
    <div>
      <div v-if="loading" class="text-center mt-4">
        <v-progress-circular
          :size="70"
          color="#FB896B"
          indeterminate
          class="vertical-center"
          width="7"
        >
        </v-progress-circular>
      </div>

      <v-card v-else class="pa-2 pb-10">
        <div class="d-flex alight-center mt-5">
          <v-text-field
            prepend-inner-icon="mdi-magnify"
            v-model="searchPhrase"
            :search="searchPhrase"
            @input="getGraphData"
            outlined
            dense
            hide-details
            class="mr-4"
          ></v-text-field>
          <v-spacer></v-spacer>
          <div class="py-1 title">{{ from }} - {{ to }} {{ $t('of') }} {{ totalLogs }}</div>
          <v-btn
            class="mx-2"
            fab
            small
            outlined
            color="primary"
            :disabled="page <= 1"
            @click="pageChange(false)"
          >
            <v-icon dark> mdi-chevron-left </v-icon>
          </v-btn>
          <v-btn
            class="mx-2"
            fab
            small
            outlined
            color="primary"
            @click="pageChange(true)"
            :disabled="page >= totalPages"
          >
            <v-icon dark> mdi-chevron-right </v-icon>
          </v-btn>
        </div>
        <v-row no-gutters min-height="200">
          <v-col cols="6">
            <v-card min-height="500" flat>
              <v-toolbar flat class="pb-15">
                <v-toolbar-title class="text-subtitle-1 font-weight-bold"
                  >{{ $t("reports.farmerProdChart") }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text class="pa-5">
                <div v-if="graphLoading" class="text-center">
                  <v-progress-circular
                    :size="70"
                    color="#FB896B"
                    indeterminate
                    class="vertical-center"
                    width="7"
                  >
                  </v-progress-circular>
                </div>
                <BarHorizontal
                  v-if="!graphLoading"
                  :chartdata="chartData"
                  :options="options"
                >
                </BarHorizontal>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="6">
            <v-card flat min-height="500">
              <v-data-table
                :headers="headers"
                :items="tableData"
                hide-default-footer
                @update:sort-by="sortedBy"
                :items-per-page="10"
                :page.sync="page"
              >
                <template v-slot:body="{ items }">
                  <tbody>
                    <tr
                      v-for="(item, i) in items"
                      :key="i"
                      @mouseover="selectItem(item)"
                      @mouseleave="unSelectItem()"
                      style="position: relative; width: 0; height: 0"
                    >
                      <td>{{ item.farmer }}</td>
                      <td>{{ item.production }}</td>
                      <template>
                        <div
                          style="position: absolute; right: 10px; top: 5px"
                          v-if="item === selectedItem"
                        >
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                x-small
                                fab
                                v-bind="attrs"
                                v-on="on"
                                @click="showSales(item)"
                              >
                                <v-icon>mdi-eye</v-icon>
                              </v-btn>
                            </template>
                            <span>{{ $t("reports.view") }}</span>
                          </v-tooltip>
                        </div>
                      </template>
                    </tr>
                  </tbody>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
        <v-row class="mt-10">
          <v-col cols="3"></v-col>
          <v-col cols="6">
            <v-btn
              block
              color="primary"
              rounded
              outlined
              @click="downloadAsPDF"
              :loading="pdfLoading"
              :disabled="!tableData.length"
            >
              {{ $t('activationKey.donwloadAsPdf') }}
            </v-btn>
          </v-col>
          <v-col cols="3"></v-col>
        </v-row>
      </v-card>

      <SalesFarmerPopup
        v-if="salesModal"
        :log="sLog"
        :dialogI="salesModal"
        @close-sales="closeSales"
      />
    </div>
  </div>
</template>
<script>
import BarHorizontal from "../dashboard/BarHorizontal.vue";
import ReportService from "@/_services/ReportService.js";
import DownloadMixin from "@/mixins/DownloadMixin";
import LoadingMixin from "@/mixins/LoadingMixin";
import SalesFarmerPopup from "./SalesFarmerPopup.vue";
// import _ from 'lodash'
export default {
  async mounted() {
    const fetchData = async () => {
      for (var i = this.year; i > this.year - 10; i--) {
        this.years.push(i);
      }
      await this.getGraphData();
    };
    await fetchData();
  },
  components: {
    BarHorizontal,
    SalesFarmerPopup,
  },
  watch: {
    selectedMonth: {
      handler() {
        this.getGraphData();
      },
      deep: true,
    },
    sort(oldVal, newVal) {
      if (oldVal !== newVal) {
        this.getGraphData();
      }
    },
    filterBy(oldVal, newVal) {
      if (oldVal !== newVal) {
        this.getGraphData();
      }
    },
  },
  data() {
    return {
      salesModal: false,
      selectedItem: false,
      searchPhrase: "",
      pdfLoading: false,
      totalLogs: 0,
      from: 0,
      to: 0,
      totalPages: 1,
      page: 1,
      years: [],
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      selectedMonth: "",
      sLog: {},
      loading: false,
      graphLoading: false,
      year: new Date().getFullYear(),
      menu1: false,
      filterDateMonth: `${new Date().getFullYear()}-${(
        "0" +
        (new Date().getMonth() + 1)
      ).slice(-2)}`,
      maxDate: `${new Date().getFullYear()}-${(
        "0" +
        (new Date().getMonth() + 1)
      ).slice(-2)}`,
      filterType: "month",
      filterBy: "production",
      sort: "asc",
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      options: {
        type: "horizontalBar",
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
              ticks: {
                // autoSkip: false,
                maxRotation: 90,
                minRotation: 90,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                stepSize: 5,
              },
              // type: "linear",
            },
          ],
        },
        responsive: true,
        maintainAspectRatio: false,
        usePointStyle: true,
        pointStyle: "circle",
        legend: {
          display: false,
          labels: {
            usePointStyle: true,
            padding: 60,
          },
          position: "bottom",
          align: "center",
        },
      },
      chartData: {
        labels: [],
        datasets: [
          {
            label: "1",
            backgroundColor: [],
            borderColor: "red",
            fill: false,
            data: [],
            barThickness: 30,
            // borderWidth: 2,
            // borderRadius: 20, // This will round the corners
            // borderSkipped: false, // To make all side rounded
          },
        ],
      },
      headers: [
        {
          text: this.$t("reports.farmerName"),
          align: "start",
          sortable: false,
          value: "farmerName",
          class: "white yyyyy",
        },
        {
          text: this.$t("reports.production"),
          align: "start",
          sortable: false,
          value: "production",
          class: "white yyyyy",
        },
        // {
        //     text: 'Quality',
        //     align: 'start',
        //     sortable: false,
        //     value: 'quality',
        //     class: 'white yyyyy'
        // },
      ],
      tableData: [],
    };
  },
  methods: {
    sortedBy(d) {
      if (d.length) {
        this.sort = "desc";
        this.getGraphData();
      } else {
        this.sort = "asc";
        this.getGraphData();
      }
    },
    showSales(log) {
      // console.log("log is -> ", log);
      this.sLog = log;
      this.salesModal = true;
    },
    closeSales() {
      this.sLog = {};
      this.salesModal = false;
    },
    selectItem(item) {
      this.selectedItem = item;
    },
    unSelectItem() {
      this.selectedItem = false;
    },
    filterDateChanged() {
      this.menu1 = false;
      this.getGraphData();
    },
    async getGraphData() {
      this.graphLoading = true;
      const filters = {
        filterDate:
          this.filterType == "year" ? this.selectedYear : this.filterDateMonth,
        filterType: this.filterType,
        sort: this.sort,
        filterBy: this.filterBy,
        search: this.searchPhrase,
      };

      try {
        const colors = [
          "#FABE7A",
          "#F6866A",
          "#59E6F6",
          "#F40A34",
          "#FABE7A",
          "#F6866A",
          "#59E6F6",
        ];
        this.chartData.labels = [];
        this.chartData.datasets.backgroundColor = [];
        this.chartData.datasets[0].data = [];
        const { data } = await ReportService.getReportData("farmer", filters);
        // console.log(data);
        if (data.code == 200) {
          this.tableData = data.data.info;
          this.totalLogs = data.data.totalCount;
          this.totalPages = Math.ceil(this.totalLogs / 10);
          this.setPages();
          data.data.info.forEach((d, i) => {
            this.chartData.datasets[0].backgroundColor.push(colors[i]);
            this.chartData.labels.push(d.farmer);
            this.chartData.datasets[0].data.push(d.production);
          });
        } else {
          // console.log("e", data);
        }
        this.graphLoading = false;
      } catch (error) {
        this.graphLoading = false;
        // console.log("eee", error);
        this.graphLoading = false;
      }
    },

    async downloadAsPDF() {
      console.log("download as pdf")
      this.startLoading();
      this.pdfLoading = true;
      const filters = {
        filterDate:
          this.filterType == "year" ? this.selectedYear : this.filterDateMonth,
        filterType: this.filterType,
        sort: this.sort,
        filterBy: this.filterBy,
        // search: this.searchPhrase
      };
      this.$http
        .get("/coffee/reports/pdf/farmer", {
          params: filters,
          responseType: "arraybuffer",
          fileType: "pdf",
        })
        .then(({ data }) => {
          this.downloadBlobFile(data, "farmerReport.pdf");
          this.pdfLoading = false;
          this.stopLoading();
        })
        .catch(() => {
          // console.log("error", error);
          this.pdfLoading = false;
          this.stopLoading();
        });

      // const { data } = await ReportService.getPdfData('farmer', filters);

      // console.log("pdf data is ----> ", data.data)
      // if (data) {
      // this.downloadSourceFile(data, 'application/pdf', 'file.pdf')
      //     .then(() => {
      //         console.log("done")
      //     }).catch((err) => {
      //         console.log(err)
      //         // this.stopLoading()
      //     });
      // this.$http.get('/coffee/reports/pdf/farmer`, {
    },
    pageChange(t) {
      if (this.page > this.totalPages) {
        this.page = this.totalPages;
        return;
      }
      if (t) this.page = this.page + 1;
      else this.page = this.page - 1;

      this.setPages();
    },
    setPages() {
      if (this.totalLogs < 1) {
        this.from = 0;
        this.to = 0;
        return;
      }
      var s = this.totalLogs % 10;
      var t = this.page * 10;
      // console.log(s, "------------------", t);

      if (t > this.totalLogs) {
        this.to = this.totalLogs;
        this.from = this.to - (s - 1);
      } else {
        this.to = t;
        this.from = this.to - 9;
      }
    },
  },
  mixins: [DownloadMixin, LoadingMixin],
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
  // color: white;
}

::v-deep .v-menu__content.theme--light.menuable__content__active {
  background: white !important;
}

::v-deep .yyyyy {
  span {
    color: black !important;
    text-transform: capitalize !important;
  }

  i {
    color: black !important;
  }
}

::v-deep .v-input__slot {
  width: 300px;
}

:v-deep .v-application .mb-4 {
  margin-bottom: 0px !important;
}

::v-deep .vv {
  background-color: #e8e8e8;
}

::v-deep .new {
  margin-bottom: 20px !important;
}
</style>
