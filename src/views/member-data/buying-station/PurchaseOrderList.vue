<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-4 justify-space-between">
        <h2>{{ title }} {{ $t("memberDataSection.purchaseOrder") }}</h2>
        <div class="d-flex align-center">
          <v-btn class="mx-2" color="primary" @click="showImport = true">
            {{ $t('memberDataSection.pOrder.import') }}
          </v-btn>
          <v-btn-toggle
            v-if="toggleView === 'calendar'"
            active-class="activeView"
            dense
            v-model="toggleTableGraph"
          >
            <v-btn>
              <v-icon :color="toggleTableGraph === 0 ? 'green' : 'grey'">mdi-view-list</v-icon>
            </v-btn>
            <v-btn>
              <v-icon :color="toggleTableGraph === 1 ? 'green' : 'grey'">mdi-poll</v-icon>
            </v-btn>
          </v-btn-toggle>
        </div>
      </div>
      <v-card elevation="0" class="px-5">
        <v-card-text>
          <div v-if="toggleView === 'listView'">
            <v-data-table
              :headers="headers"
              :items="purchaseOrders"
              :items-per-page="10"
              hide-default-footer
              :loading="loading"
              :options.sync="options"
              loading-text="Loading Data..."
            >
              <template v-slot:top>
                <div class="d-flex mt-5">
                  <v-text-field
                    prepend-inner-icon="mdi-magnify"
                    outlined
                    height="5px"
                    :placeholder="$t('search')"
                    dense
                    v-model="search"
                    @input="resetSearchOnEmpty"
                    class="shrink pr-5"
                  ></v-text-field>

                  <v-menu
                    v-model="customFilterMenu"
                    :close-on-content-click="false"
                    transition="scroll-y-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :value="dateRangeCustom"
                        readonly
                        clearable
                        v-bind="attrs"
                        v-on="on"
                        outlined
                        dense
                        style="width:150px"
                        background-color="white"
                        color="black"
                        append-inner-icon="mdi-calendar-month"
                        @click:clear="filterDateCustom = []"
                        :placeholder="$t('memberDataSection.pOrder.selectDateRange')"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="filterDateCustom" range no-title>
                      <v-spacer></v-spacer>
                      <v-btn outlined color="green" @click="customFilter">
                        {{ $t("confirm") }}
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                  <v-spacer></v-spacer>
                  <v-menu background-color="white" offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn outlined color="green" v-bind="attrs" v-on="on">
                        <v-icon class="green--text"
                          >mdi-file-move-outline</v-icon
                        >
                        {{ $t('reports.export') }}
                        <v-icon class="green--text">mdi-chevron-down</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item @click="downloadCsv">
                        <v-btn icon dense>CSV</v-btn>
                      </v-list-item>
                      <v-list-item @click="download('xlsx')">
                        <v-btn icon dense>Excel</v-btn>
                      </v-list-item>
                      <v-list-item @click="download('pdf')">
                        <v-btn icon dense>Pdf</v-btn>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                  <v-btn
                    class="ml-5"
                    outlined
                    color="green"
                    @click="toggleViews"
                  >
                    {{
                      toggleView === "listView"
                        ?  $t('memberDataSection.pOrder.calendarView')
                        : $t('memberDataSection.pOrder.purchaseListView')
                    }}
                  </v-btn>
                  <v-spacer></v-spacer>

                  <div class="py-1 title">
                    {{ from }} {{ $t('of') }} {{ totalPurchaseOrder }}
                  </div>
                  <v-btn
                    class="mx-2"
                    fab
                    small
                    outlined
                    color="primary"
                    :disabled="options.page <= 1"
                    @click="pageChange(false)"
                  >
                    <v-icon dark>
                      mdi-chevron-left
                    </v-icon>
                  </v-btn>
                  <v-btn
                    class="mx-2"
                    fab
                    small
                    outlined
                    color="primary"
                    :disabled="options.page >= totalPages"
                    @click="pageChange(true)"
                  >
                    <v-icon dark>
                      mdi-chevron-right
                    </v-icon>
                  </v-btn>
                </div>
              </template>
              <template v-if="purchaseOrders" v-slot:body="{ items }">
                <tbody>
                  <tr
                    v-for="item in items"
                    :key="item.id"
                    style="position: relative; width: 0; height: 0"
                    @mouseover="selectItem(item)"
                    @mouseleave="selectItem(item)"
                    @click="viewDialog(item)"
                  >
                    <td>{{ item.orderCode }}</td>
                    <td>{{ item.purchasedAt }}</td>
                    <td>
                      {{
                        fullName(item.farmer.firstName, item.farmer.lastName)
                      }}
                    </td>
                    <td class="text-center">{{ item.coffeeCherryQlty }}</td>
                    <td class="text-center">{{ item.coffeeCherryQty }}</td>
                    <td class="text-center">{{ item.perKgPrice }}</td>
                    <div
                      v-if="item.id === selectedItem.id"
                      style="position: absolute; right: 10px; top: 5px"
                    >
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            x-small
                            fab
                            v-bind="attrs"
                            v-on="on"
                            class="ml-2"
                            @click="editPurchaseOrder(item)"
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                        </template>
                        <span>{{ $t("edit") }}</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            x-small
                            fab
                            v-bind="attrs"
                            v-on="on"
                            class="ml-2"
                            @click="deletePurchaseOrder(item)"
                          >
                            <v-icon>mdi-trash-can</v-icon>
                          </v-btn>
                        </template>
                        <span>{{ $t("delete") }}</span>
                      </v-tooltip>
                    </div>
                  </tr>
                </tbody>
              </template>
              <template v-slot:footer></template>
            </v-data-table>
          </div>
          <div v-else-if="toggleView === 'calendar'">
            <v-data-table
              :headers="dynamicHeaderslvl1"
              :items="dynamicData"
              :items-per-page="10"
              hide-default-header
              hide-default-footer
              :loading="loading"
              :options.sync="options"
              loading-text="Loading Data..."
            >
              <template v-slot:top>
                <div class="d-flex mt-5">
                  <v-text-field
                    prepend-inner-icon="mdi-magnify"
                    outlined
                    height="5px"
                    :placeholder="$t('search')"
                    dense
                    v-model="search"
                    @input="resetSearchOnEmpty"
                    class="shrink pr-5"
                  ></v-text-field>

                  <v-menu
                    v-model="customFilterMenu"
                    :close-on-content-click="false"
                    transition="scroll-y-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :value="dateRangeCustom"
                        readonly
                        clearable
                        v-bind="attrs"
                        v-on="on"
                        outlined
                        dense
                        style="width:150px"
                        background-color="white"
                        color="black"
                        append-inner-icon="mdi-calendar-month"
                        @click:clear="filterDateCustom = []"
                        :placeholder="$t('memberDataSection.pOrder.selectDateRange')"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="filterDateCustom" range no-title>
                      <v-spacer></v-spacer>
                      <v-btn outlined color="green" @click="customFilter">
                        {{ $t("confirm") }}
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                  <v-spacer></v-spacer>
                  <v-menu background-color="white" >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn outlined color="green" v-bind="attrs" class="mr-5" v-on="on">
                        <v-icon class="green--text"
                          >mdi-file-move-outline</v-icon
                        >
                        {{ $t('memberDataSection.pOrder.viewBy') }} {{ calendarView }}
                        <v-icon class="green--text">mdi-chevron-down</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item @click="handleCalendarView('date')">
                        <v-btn plain dense>View by Date</v-btn>
                      </v-list-item>
                      <v-list-item @click="handleCalendarView('month')">
                        <v-btn plain dense>View by Month</v-btn>
                      </v-list-item>
                      <v-list-item @click="handleCalendarView('year')">
                        <v-btn plain dense>View by Year</v-btn>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                  <v-menu background-color="white" >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn outlined color="green" v-bind="attrs" v-on="on">
                        <v-icon class="green--text"
                          >mdi-file-move-outline</v-icon
                        >
                        {{ $t('reports.export') }}
                        <v-icon class="green--text">mdi-chevron-down</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item @click="downloadCalendarListCSV">
                        <v-btn icon dense>CSV</v-btn>
                      </v-list-item>
                      <v-list-item @click="downloadCalendarListPDFXlxs('xlsx')">
                        <v-btn icon dense>Excel</v-btn>
                      </v-list-item>
                      <v-list-item @click="downloadCalendarListPDFXlxs('pdf')">
                        <v-btn icon dense>Pdf</v-btn>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                  <v-btn
                    class="ml-5"
                    outlined
                    color="green"
                    @click="toggleViews"
                  >
                    {{
                       toggleView === "listView"
                        ?  $t('memberDataSection.pOrder.calendarView')
                        : $t('memberDataSection.pOrder.purchaseListView')
                    }}
                  </v-btn>
                  <v-spacer></v-spacer>

                  <div class="py-1 title">
                    {{ from }} {{ $t('of') }} {{ totalPurchaseOrder }}
                  </div>
                  <v-btn
                    class="mx-2"
                    fab
                    small
                    outlined
                    color="primary"
                    :disabled="options.page <= 1"
                    @click="pageChange(false)"
                  >
                    <v-icon dark>
                      mdi-chevron-left
                    </v-icon>
                  </v-btn>
                  <v-btn
                    class="mx-2"
                    fab
                    small
                    outlined
                    color="primary"
                    :disabled="options.page >= totalPages"
                    @click="pageChange(true)"
                  >
                    <v-icon dark>
                      mdi-chevron-right
                    </v-icon>
                  </v-btn>
                </div>
              </template>
              <template
                v-if="toggleTableGraph === 0"
                v-slot:header="{ props: { headers } }"
              >
                <thead class="v-data-table-header">
                  <th
                    v-for="(header, i) in headers"
                    :key="i"
                    class="dynamic-header"
                    :colspan="header.colspan"
                  >
                    {{ header.text }}
                  </th>
                </thead>
                <thead class="v-data-table-header-2">
                  <th
                    v-for="(header, j) in dynamicHeaderslvl2"
                    :key="j"
                    class="dynamic-header"
                  >
                    {{ header.text }}
                  </th>
                </thead>
              </template>
              <template v-if="dynamicData" v-slot:body="{ items }">
                <tbody v-if="toggleTableGraph === 0">
                  <tr v-for="(item, key) in items" :key="key">
                    <td>{{ item.farmer.fullName }}</td>
                    <td
                      style="width: 90px;"
                      v-for="(quantity, key) in item.selectedData"
                      :key="key"
                    >
                      {{ quantity }}
                    </td>
                  </tr>
                </tbody>
                <template v-if="toggleTableGraph === 1">
                  <purchase-order-graph
                    :data="dynamicData"
                    :headerTop="dynamicHeaderslvl1"
                    :headerBottom="dynamicHeaderslvl2"
                  />
                </template>
              </template>
              <template v-if="toggleTableGraph === 0" v-slot:footer></template>
            </v-data-table>
          </div>
        </v-card-text>
      </v-card>
    </v-container>
    <PurchaseOrderDialog
      v-if="showPurchaseOrderDialog"
      :dialogI="showPurchaseOrderDialog"
      @updatePurchaseOrder="getBuyingStation"
      @closepurchaseOrderDialog="closePurchaseOrder"
      :purchaseItem="purchaseOrderDialogItem"
    />
    <ViewPurchaseOrderDialog
      v-if="showViewPurchaseOrderDialog"
      :dialogI="showViewPurchaseOrderDialog"
      @closepurchaseOrderDialog="closeViewPurchaseOrder"
      :purchaseItem="selectedItem"
    />
    <import-buying-station
      :showImport="showImport"
      @closeDialog="showImport = false"
      @getBuyingStation="refetchBuyingStation"
    />
  </div>
</template>
<script>
import Breadcrumb from "@/components/core/Breadcrumb";
import PurchaseOrderDialog from "./PurchaseOrderDialog.vue";
import ViewPurchaseOrderDialog from "./ViewPurchaseOrderDialog.vue";
import BuyingStationService from "@/_services/BuyingStationService";
import loadingMixin from "@/mixins/LoadingMixin";
import DownloadMixin from "@/mixins/DownloadMixin";
import ImportBuyingStation from "./ImportBuyingStation.vue";
import moment from "moment";
import PurchaseOrderGraph from "./PurchaseOrderGraph.vue";

export default {
  components: {
    breadcrumb: Breadcrumb,
    PurchaseOrderDialog,
    ViewPurchaseOrderDialog,
    ImportBuyingStation,
    PurchaseOrderGraph,
  },
  watch: {
    options: {
      handler() {
        this.getBuyingStation();
      },
      deep: true,
    },
  },
  computed: {
    dateRangeCustom() {
      return this.filterDateCustom.join(" ~ ");
    },
  },
  data() {
    return {
      showImport: false,
      loading: false,
      showPurchaseOrderDialog: false,
      showViewPurchaseOrderDialog: false,
      totalPurchaseOrder: 0,
      from: 0,
      to: 0,
      totalPages: 1,
      search: "",
      title: "",
      customFilterMenu: false,
      filterDateCustom: [],
      purchaseOrders: [],
      selectedItem: {},
      purchaseOrderDialogItem: {},
      toggleView: "listView",
      calendarView: "date",
      toggleTableGraph: 0,
      dynamicData: [],
      options: {
        page: 1,
        itemsPerPage: 10,
      },
      totalDays: [],
      totalMonths: [],
      dynamicHeaderslvl1: [],
      dynamicHeaderslvl2: [],
      headers: [
        {
          text: this.$t('memberDataSection.pOrder.purchaseId'),
          align: "start",
          value: "orderCode",
        },
        {
          text: this.$t('memberDataSection.pOrder.purchaseDate'),
          align: "start",
          value: "purchasedAt",
        },
        {
          text: this.$t('memberDataSection.pOrder.farmerName'),
          align: "start",
          value: "firstName",
        },
        {
          text: this.$t('memberDataSection.pOrder.quality'),
          align: "center",
          value: "coffeeCherryQlty",
        },
        {
          text: this.$t('memberDataSection.pOrder.quantity'),
          align: "center",
          value: "coffeeCherryQty",
        },
        {
          text: this.$t('memberDataSection.pOrder.pricePerKg'),
          align: "center",
          value: "perKgPrice",
        },
      ],
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: false,
          to: "/",
        },
        {
          text: this.$t("dashboardSection.memberData"),
          disabled: false,
          to: "/",
        },
        {
          text: this.$t("memberDataSection.buyingStation"),
          link: true,
          exact: true,
          disabled: false,
          to: { name: "BuyingStation" },
        },
      ],
    };
  },
  async mounted() {
    // this.getBuyingStation();
  },
  methods: {
    async setHeadersByDate() {
      this.dynamicHeaderslvl1 = [];
      this.dynamicHeaderslvl2 = [];
      this.dynamicData = [];
      this.totalDays = [];
      // generate headers on the basis of date range
      let startDate = moment(this.filterDateCustom[0]);
      let endDate = moment(this.filterDateCustom[1]);
      let startDateClone = startDate.clone();
      let bufferStartDate = startDate.clone();
      let monthsBetween = [];
      let datesBetween = [];
      this.dynamicHeaderslvl1.push({
        text: "Farmer Name",
        align: "start",
      });
      this.dynamicHeaderslvl2.push({
        text: "Date",
        align: "center",
        width: "90px",
      });

      let monthCount = 1;
      while (
        endDate > startDateClone ||
        startDateClone.format("M") === endDate.format("M")
      ) {
        let endOfMonth = startDateClone.endOf("month");
        let daysLeft = endOfMonth.diff(bufferStartDate, "days") + ++monthCount; // including total
        monthsBetween.push({
          month: startDateClone.format("MMMM"),
          lastDayOfMonth: endOfMonth.format("D"),
          endDate: endDate.format("DD-MMM-YYYY"),
          daysLeft,
        });
        startDateClone.add(1, "month");
        bufferStartDate.add(daysLeft, "days");
      }
      while (startDate <= endDate) {
        datesBetween.push(startDate.format("DD-MMM-YYYY"));
        startDate.add(1, "day");
      }
      // generate lvl 1 headers
      monthsBetween.forEach((m) => {
        this.dynamicHeaderslvl1.push({
          text: m.month + "/KG",
          align: "start",
          colspan: m.daysLeft,
        });
      });
      // generate lvl 2 headers
      let c = 0,
        nextDayIndex = 0;
      datesBetween.forEach((d, i) => {
        this.dynamicHeaderslvl2.push({
          text: moment(d).format("D"),
          align: "center",
          width: "90px",
        });
        nextDayIndex = ++i;
        let nextDay = datesBetween[nextDayIndex]
          ? moment(datesBetween[nextDayIndex]).format("D")
          : -1;
        let currentDay = moment(d).format("D");
        c = ++c;
        if (parseInt(currentDay) >= parseInt(nextDay)) {
          this.totalDays.push(c);
          this.dynamicHeaderslvl2.push({
            text: "Total",
            align: "center",
            width: "90px",
          });
        }
      });
    },
    async setHeadersByMonth() {
      this.dynamicHeaderslvl1 = [];
      this.dynamicHeaderslvl2 = [];
      this.dynamicData = [];
      this.totalMonths = [];
      let startDate = moment(this.filterDateCustom[0]).startOf("month");
      let endDate = moment(this.filterDateCustom[1]).endOf("month");
      let startDateClone = startDate.clone();
      let bufferStartDate = startDate.clone();
      let yearBetween = [];
      let monthBetween = [];
      this.dynamicHeaderslvl1.push({
        text: "Farmer Name",
        align: "start",
      });
      this.dynamicHeaderslvl2.push({
        text: "Date",
        align: "center",
        width: "90px",
      });

      let yearCount = 1;
      while (
        endDate > startDateClone ||
        startDateClone.format("YYYY") === endDate.format("YYYY")
      ) {
        let endOfYear = startDateClone.endOf("year");
        let monthsLeft = endOfYear.diff(bufferStartDate, "month") + ++yearCount;
        yearBetween.push({
          year: startDateClone.format("YYYY"),
          monthsLeft,
        });
        startDateClone.add(1, "year");
        bufferStartDate.add(monthsLeft, "month");
      }
      while (startDate <= endDate) {
        monthBetween.push(startDate.format("DD-MMM-YYYY"));
        startDate.add(1, "month");
      }

      //generating lvl 1 headers
      yearBetween.forEach((y) => {
        this.dynamicHeaderslvl1.push({
          text: y.year + "/KG",
          align: "start",
          colspan: y.monthsLeft,
        });
      });
      //generating lvl 2 headers
      let c = 0;
      monthBetween.forEach((m) => {
        this.dynamicHeaderslvl2.push({
          text: moment(m).format("MMM"),
          align: "center",
          width: "90px",
        });
        c = ++c;
        if (moment(m).format("MMM") === "Dec") {
          this.totalMonths.push(c);
          this.dynamicHeaderslvl2.push({
            text: "Total",
            align: "center",
            width: "90px",
          });
        }
      });
      if (
        moment(monthBetween[monthBetween.length - 1]).format("MMM") !== "Dec"
      ) {
        this.totalMonths.push(c);
        this.dynamicHeaderslvl2.push({
          text: "Total",
          align: "center",
          width: "90px",
        });
      }
    },
    async setHeadersByYear() {
      let startDate = moment(this.filterDateCustom[0]).startOf("year");
      let endDate = moment(this.filterDateCustom[1]).endOf("year");
      let startDateClone = startDate.clone();
      let yearBetween = [];

      this.dynamicHeaderslvl1 = [];
      this.dynamicHeaderslvl2 = [];

      this.dynamicData = [];

      this.dynamicHeaderslvl1.push({
        text: "Farmer Name",
        align: "start",
      });
      while (
        endDate > startDateClone ||
        startDateClone.format("YYYY") === endDate.format("YYYY")
      ) {
        yearBetween.push({
          year: startDateClone.format("YYYY"),
        });
        startDateClone.add(1, "year");
      }
      yearBetween.forEach((y) => {
        this.dynamicHeaderslvl1.push({
          text: y.year,
          align: "start",
          colspan: 0,
        });
      });
    },
    async toggleViews() {
      if (this.toggleView === "listView") {
        // Default date range required
        this.filterDateCustom = ["2023-06-25", "2023-07-08"];
        this.options.startDate = this.filterDateCustom[0];
        this.options.endDate = this.filterDateCustom[1];
        this.options.viewBy = "date";
        this.options.toggleView = "calendar";
        this.setHeadersByDate();
        await this.getBuyingStationByFarmer();
        this.toggleView = "calendar";
      } else {
        this.toggleView = "listView";
      }
    },
    fullName(firstName, lastName) {
      if (firstName && lastName) {
        return firstName + " " + lastName;
      } else {
        return firstName;
      }
    },
    closePurchaseOrder() {
      this.showPurchaseOrderDialog = false;
      this.selectedItem = {};
    },
    closeViewPurchaseOrder() {
      this.showViewPurchaseOrderDialog = false;
      this.selectedItem = {};
    },
    viewDialog(item) {
      this.selectedItem = { ...item };
      this.showViewPurchaseOrderDialog = true;
    },
    selectItem(item) {
      this.selectedItem = { ...item };
    },
    refetchBuyingStation() {
      // to offset time to load imported purchase order from backend
      setTimeout(async () => {
        await this.getBuyingStation();
      }, 1500);
    },
    async getBuyingStationByFarmer() {
      this.loading = true;
      await BuyingStationService.getSingleBuyingStationPurchaseOrder(
        this.$route.params.id,
        this.options,
        this.search
      )
        .then((res) => {
          const { rows, totalRows } = res.data;
          rows?.map((m) => {
            let start = 0;
            let tempArr = [...m.selectedData];
            if (this.calendarView === "date") {
              this.totalDays.map((t, i) => {
                let sum = tempArr
                  .slice(start, t)
                  .reduce((a, b) => parseInt(a) + parseInt(b), 0);
                m.selectedData.splice(t + i, 0, sum);
                start = t + 1;
              });
            } else if (this.calendarView === "month") {
              this.totalMonths.map((t, i) => {
                let sum = tempArr
                  .slice(start, t)
                  .reduce((a, b) => parseInt(a) + parseInt(b), 0);
                m.selectedData.splice(t + i, 0, sum);
                start = t + 1;
              });
            }
          });
          this.dynamicData = rows;
          this.totalPurchaseOrder = totalRows;
          this.totalPages = Math.ceil(
            this.totalPurchaseOrder / this.options.itemsPerPage
          );
          this.from =
            this.options.page * this.options.itemsPerPage -
            (this.options.itemsPerPage - this.purchaseOrders.length);
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    async getBuyingStation() {
      this.loading = true;
      await BuyingStationService.getSingleBuyingStationPurchaseOrder(
        this.$route.params.id,
        this.options,
        this.search
      )
        .then((res) => {
          this.title = res.data.buyingStation.fullName;
          this.purchaseOrders = res.data.rows;
          this.totalPurchaseOrder = res.data.totalRows;
          this.totalPages = Math.ceil(
            this.totalPurchaseOrder / this.options.itemsPerPage
          );
          this.from =
            this.options.page * this.options.itemsPerPage -
            (this.options.itemsPerPage - this.purchaseOrders.length);
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    async customFilter() {
      this.totalDays = [];
      this.totalMonths = [];
      this.customFilterMenu = false;
      (this.options.startDate = this.filterDateCustom[0]),
        (this.options.endDate = this.filterDateCustom[1]);
      this.options.viewBy = this.calendarView;
      if (this.calendarView === "date") {
        this.setHeadersByDate();
      } else if (this.calendarView === "month") {
        this.setHeadersByMonth();
      } else if (this.calendarView === "year") {
        this.setHeadersByYear();
      }
      this.options.toggleView = this.toggleView;
      await this.getBuyingStation();
      await this.getBuyingStationByFarmer();
    },
    async handleCalendarView(view) {
      this.calendarView = view;
      if (view === "month") {
        this.options.startDate = this.filterDateCustom[0];
        this.options.endDate = this.filterDateCustom[1];
        this.options.viewBy = "month";
        this.setHeadersByMonth();
        await this.getBuyingStationByFarmer();
      } else if (view === "date") {
        this.options.startDate = this.filterDateCustom[0];
        this.options.endDate = this.filterDateCustom[1];
        this.options.viewBy = "date";
        this.options.toggleView = "calendar";
        this.setHeadersByDate();
        await this.getBuyingStationByFarmer();
      } else if (view === "year") {
        this.options.startDate = this.filterDateCustom[0];
        this.options.endDate = this.filterDateCustom[1];
        this.options.viewBy = "year";
        this.setHeadersByYear();
        await this.getBuyingStationByFarmer();
      }
    },
    resetSearchOnEmpty() {
      this.options.page = 1;
      this.getBuyingStation();
    },
    pageChange(t) {
      if (t) {
        this.options.page = this.options.page + 1;
      } else {
        this.options.page = this.options.page - 1;
      }
      this.getBuyingStation();
    },
    editPurchaseOrder(item) {
      this.purchaseOrderDialogItem.id = item.orderCode;
      this.showPurchaseOrderDialog = true;
    },
    async deletePurchaseOrder(item) {
      await BuyingStationService.deletePurchaseOrder(item.id)
        .then(() => {
          this.$notify({
            title: "Purchase Order Deleted successfully.",
            type: "success",
          });
          this.getBuyingStation();
        })
        .catch((err) => {
          console.log(err);
          this.$notify({
            title: "Purchase Order Delete Failed.",
            type: "error",
          });
        });
    },
    async downloadCsv() {
      await BuyingStationService.getSingleBuyingStationPurchaseOrderExport(
        this.$route.params.id,
        this.options,
        "csv"
      ).then((res) => {
        this.downloadBlobFile(res, "purchaseOrder.csv");
      });
    },
    async download(type) {
      this.$http
        .get(
          `/coffee/buying-station/purchase-order/list/${this.$route.params.id}/${type}`,
          {
            params: {
              startDate: this.filterDateCustom[0],
              endDate: this.filterDateCustom[1],
            },
            responseType: "arraybuffer",
            fileType: "pdf",
          }
        )
        .then(({ data }) => {
          this.downloadBlobFile(data, `purchaseOrder.${type}`);
        });
    },

    async downloadCalendarListCSV(){
      await BuyingStationService.getSingleBuyingStationPurchaseOrderExportByCalendar(
        this.$route.params.id,
        this.options,
        "csv"
      ).then((res) => {
        this.downloadBlobFile(res, `purchaseOrderCalendar.csv`);
      });
    },

    async downloadCalendarListPDFXlxs(type){
      this.options.limit = this.options.itemsPerPage
      this.options.timePeriod = this.options.viewBy
      this.$http
        .get(
          `/coffee/buying-station/purchase-order/calendar-list/${this.$route.params.id}/${type}`,
          {
            params: {
             ...this.options
            },
            responseType: "arraybuffer",
            fileType: "pdf",
          }
        )
        .then(({ data }) => {
          this.downloadBlobFile(data, `purchaseOrderCalendar.${type}`);
        });
    }

  },
  mixins: [loadingMixin, DownloadMixin],
};
</script>
<style>
.activeView {
  background: #f5f5f5 !important;
}
.list {
  max-height: 150px;
  min-height: 150px;
  overflow: auto;
}

.list-items {
  display: flex;
  align-content: center;
  align-items: center;
  margin: 10px;
  justify-content: space-between;
}

.dynamic-header {
  height: 48px;
  font-size: 15px;
  color: white;
  text-align: left;
  padding: 0px 16px;
}

.v-data-table-header-2 {
  background-color: #179557;
}

.add-new {
  cursor: pointer;
}

.export-menu {
  color: #00bd73;
  text-align: center;
  font-size: 14px;
  font-family: Poppins;
  font-style: normal;
  font-weight: 600;
  line-height: 18px;
  text-transform: uppercase;
}

.theme--dark.v-btn.v-btn--disabled.v-btn--has-bg {
  background-color: #4caf4f !important;
  color: #ffffff !important;
}

.v-messages__message {
  hyphens: none !important;
}
</style>
