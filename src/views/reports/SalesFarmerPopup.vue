<template>
  <v-container>
    <template>
      <div class="text-center">
        <v-dialog v-model="dialogI" width="800" @click:outside="closeModal" :retain-focus="false">
          <v-card rounded="0" class="clrCard">
            <v-icon @click="closeModal" class="cross">mdi-close</v-icon>
            <!-- <v-toolbar
                            flat
                            color="primary"
                            class="white--text"
                        >
                            <v-toolbar-title class="font-weight-bold">{{ $t('userslist.addNewUser')}}</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-btn icon class="white--text" @click="closeModal">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </v-toolbar> -->
            <v-data-table :headers="headers" :items="tableData" hide-default-footer>
              <template v-slot:body="{ items }">
                <tbody>
                  <tr v-for="(item, i) in items" :key="i">
                    <td>{{ newdate }}</td>
                    <td>{{ item.buyingStation }}</td>
                    <td>{{ item.weight }} KG</td>
                    <td>{{ item.quality }}</td>
                    <td>{{
                          globalSettings.currency
                            ? globalSettings.currency.symbol
                            : "Rp"
                        }} {{ item.price }}</td>
                  </tr>
                </tbody>
              </template>
            </v-data-table>
          </v-card>

          <v-card rounded="0" class="pb-5 des">
            <label class="label">{{this.$t("reports.total")}}</label>
            <label class="label">{{ totalWeight }}</label>
            <label class="label">{{ totalPrice }}</label>
          </v-card>

          <v-card rounded="0" class="pop">
            <v-btn block color="primary" rounded outlined @click="downloadAsPDF" :loading="pdfLoading">
              {{$t("reports.downloadPdfReport")}}
            </v-btn>
          </v-card>
        </v-dialog>
      </div>
    </template>
  </v-container>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";
import generalMixin from "@/mixins/GeneralMixin";

import ReportService from "@/_services/ReportService.js";
import DownloadMixin from "../../mixins/DownloadMixin";
import PermissionsService from "@/_services/PermissionsService";

export default {
  created() {
    const fetchData = async () => {
      await this.getReportDataa();
    };
    fetchData();
  },
  computed: {
    dialog() {
      return this.dialogI;
    },
  },

  watch: {
    options: {
      handler() {
        this.getReportData();
      },
      deep: true,
    },
  },
  data() {
    return {
      pdfLoading: false,
      filterType: "month",
      filterDateMonth: `${new Date().getFullYear()}-${(
        "0" +
        (new Date().getMonth() + 1)
      ).slice(-2)}`,
      sort: "asc",
      newdate: null,
      totalWeight: 0,
      totalPrice: 0,
      headers: [
        {
          text: this.$t("reports.date"),
          align: "start",
          sortable: true,
          value: "farmerName",
        },
        {
          text: this.$t("reports.buyingStationName"),
          align: "start",
          sortable: true,
          value: "farmerName",
        },
        {
          text: this.$t("reports.weight"),
          align: "start",
          sortable: false,
          value: "production",
        },
        {
          text: this.$t("reports.quality"),
          align: "start",
          sortable: false,
          value: "production",
        },
        {
          text: this.$t("reports.price"),
          align: "start",
          sortable: false,
          value: "production",
        },
      ],
      tableData: [],
      globalSettings: {},
    };
  },
  async mounted() {
    const globalSettings = await PermissionsService.getGlobalSettings();
    this.globalSettings = globalSettings.data.globalSetting
  },
  methods: {
    closeModal() {
      this.$emit("close-sales");
    },

    async getReportDataa() {
      this.coffeeVarietyLoading = true;
      const filters = {
        filterDate:
          this.filterType == "year" ? this.selectedYear : this.filterDateMonth,
        filterType: this.filterType,
        sort: this.sort,
      };
      try {
        const { data } = await ReportService.getReportDataa(
          "farmer",
          this.log.farmerId,
          filters
        );
        // console.log("d is ----> ", data);
        if (data.code === 200) {
          this.tableData = data.data;
          data.data.forEach((element) => {
            var date = new Date(element.date);
            this.newdate =
              date.getMonth() +
              1 +
              "-" +
              date.getDate() +
              "-" +
              date.getFullYear();
            this.totalWeight = this.totalWeight + element.weight;
            this.totalPrice = this.totalPrice + element.price;
          });
        } else {
          // console.log("else");
        }
      } catch (err) {
        // console.log("e", err);
        // this.coffeeVarietyLoading = false;
      }
    },
    async downloadAsPDF() {
      this.pdfLoading = true;
      const filters = {
        filterDate: "2022-06",
        //   this.filterType == "year" ? this.selectedYear : this.filterDateMonth,
        filterType: "year",
        // sort: this.sort,
      };
      this.startLoading();
      this.$http
        .get(`/coffee/reports/pdf/farmer/${this.log.farmerId}`, {
          params: filters,
          responseType: "arraybuffer",
          fileType: "pdf",
        })
        .then(({ data }) => {
          this.downloadBlobFile(data,  `farmer_report_${this.log.farmer}.pdf`);
          this.stopLoading();
          this.pdfLoading = false;
        })
        .catch(() => {
          // console.log("error", error);
          this.pdfLoading = false;
          this.stopLoading();

        });

    },
  },
  props: {
    dialogI: {
      type: Boolean,
      required: true,
    },
    log: {
      required: true,
      type: Object,
    },
  },
  mixins: [loadingMixin, generalMixin, DownloadMixin]
};
</script>

<style scoped lang="scss">
::v-deep .v-data-table-header tr {
  height: 80px !important;
  min-height: 180px !important;
  background-color: $primary-color  !important;
}

::v-deep .des {
  height: 80px !important;
  min-height: 80px !important;
  background-color: $primary-color  !important;
}

::v-deep .pop {
  padding: 70px;
}

::v-deep .clrCard {
  background-color: $primary-color;
}

::v-deep .cross {
  background-color: $primary-color;
  position: absolute;
  right: 6px;
  padding-top: 6px;
  color: white;
}

::v-deep .label {
  display: inline-block;
  color: white;
  width: 220px;
  text-align: right;
  padding-top: 30px;
}
</style>
