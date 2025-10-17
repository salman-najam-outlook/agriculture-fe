<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex align-start justify-space-between">
        <div class="d-flex align-start">
          <h2 class="text-capitalize mr-2">
            {{ $t("satelliteReport.satelliteReport") }}
          </h2>
          <v-tooltip bottom color="black" max-width="350">
            <template v-slot:activator="{ on, attrs }">
              <v-icon class="green--text mr-4" style="marginTop: 6px" v-bind="attrs" v-on="on">mdi-help-circle
              </v-icon>
            </template>
            <span>{{ $t("satelliteReport.satelliteReportTooltip") }}</span>
          </v-tooltip>
          <v-autocomplete v-model="globalFarm" :items="farmList" item-text="farmName" item-value="id" cache-items
            :search-input.sync="searchFarm" :loading="fetchingFarm" class="allFarms overflow-hidden" dense chips
            small-chips solo flat multiple :placeholder="$t('satelliteReport.allFarms')" return-object>
            <template v-slot:selection="{ item, index }">
              <v-chip v-if="index === 0">
                <span>{{ item.farmName }}</span>
              </v-chip>
              <span v-if="index === 1" class="grey--text text-caption">
                (+{{ globalFarm.length - 1 }} others)
              </span>
            </template>
          </v-autocomplete>
        </div>
        <div>
          <v-btn depressed color="primary" dark @click="showGenReport = true">
            {{ $t("satelliteReport.generateReport") }}
          </v-btn>
        </div>
      </div>
      <v-card flat class="mb-4">
        <div class="pa-4">
          <v-data-table :headers="headers" :items="reports" :items-per-page="tableOptions.itemsPerPage" :footer-props="{
      'items-per-page-options': [10, 25, 50],
    }" :header-props="headerProps" hide-default-footer :loading="reportsLoading" :options.sync="tableOptions"
            :server-items-length="totalReports" loading-text="Loading reports...">
            <template v-slot:top>
              <div class="d-flex align-start justify-space-between mt-5">
                <div class="d-flex">
                  <v-text-field     
                  v-model="searchString"
                  :placeholder="$t('oma.search')"
                  :disabled="false"
                  outlined
                  dense
                  />
            

                  <v-select :items="countries" v-model="country" item-text="name" item-value="name" class="ml-2"
                    style="width: 150px" dense outlined flat :label="$t('deforestation.allCountries')" return-object @change="getState">
                  </v-select>
                  <v-select :items="states" v-model="state" item-text="name" item-value="value" class="ml-2"
                    style="width: 150px" dense outlined flat return-object :label="$t('deforestation.allRegions')">
                  </v-select>
                  <v-menu class="mt-16" v-model="filterByDate" :close-on-content-click="false">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field class="ml-4 menufieldset" dense outlined :placeholder="$t('oma.filterByDate')"
                      v-on="on" v-bind="attrs"
                      ></v-text-field>
                    </template>
                    <v-card min-width="300">
                     <v-row class="pa-5">
                        <v-col sm="6"> 
                          <v-menu v-model="filterByFromDate" :close-on-content-click="false" :nudge-right="40"
                          transition="scale-transition" offset-y min-width="auto">
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field append-icon="mdi-calendar" outlined v-model="filterByFromDateVal"
                              dense readonly v-bind="attrs" v-on="on" v-on:click:append="filterByFromDate = true"
                              :placeholder="$t('oma.fromDate')"></v-text-field>
                          </template>
                          <v-date-picker v-model="filterByFromDateVal"  @input="filterByFromDate = false"></v-date-picker>
                        </v-menu>
                        </v-col>

                        <v-col sm="6"> 
                          <v-menu v-model="filterByToDate" :close-on-content-click="false" :nudge-right="40"
                          transition="scale-transition" offset-y min-width="auto">
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field append-icon="mdi-calendar" outlined v-model="filterByToDateVal"
                              dense readonly v-bind="attrs" v-on="on" v-on:click:append="filterByToDate = true"
                              :placeholder="$t('oma.toDate')"></v-text-field>
                          </template>
                          <v-date-picker v-model="filterByToDateVal" @input="filterByToDate = false"></v-date-picker>
                        </v-menu>
                        </v-col>
                     </v-row>   
                      <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn variant="text" @click="filterByDate = false">
                          {{ $t('oma.cancel') }}
                        </v-btn>
                        <v-btn color="primary" @click="getReportList" variant="text">
                          {{ $t('save') }}
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-menu>
                  <v-btn @click="searchReports" class="ml-5">
                  <v-icon> mdi-filter </v-icon>
                  </v-btn>
                </div>
                <div class="d-flex">
                  <v-select :items="exportList" v-model="exportFormat" @change="exportAs" item-text="name"
                    item-value="value" class="mr-4" dense outlined flat :label="$t('exportAsCSV')" style="width: 140px">
                  </v-select>
                  <div class="py-1 title">
                    {{ from }} - {{ to }} {{ $t('of') }} {{ totalReports }}
                  </div>
                  <v-btn class="mx-2" fab small outlined color="primary" :disabled="tableOptions.page <= 1"
                    @click="pageChange(false)">
                    <v-icon dark> mdi-chevron-left </v-icon>
                  </v-btn>
                  <v-btn class="mx-2" fab small outlined color="primary" :disabled="tableOptions.page >= totalPages"
                    @click="pageChange(true)">
                    <v-icon dark> mdi-chevron-right </v-icon>
                  </v-btn>
                </div>
              </div>
            </template>
            <template v-if="reports" v-slot:body="{ items }">
              <tbody>
                <tr v-for="item in items" :key="item.id" style="position: relative; width: 0; height: 0"
                  @mouseover="selectItem(item)" @mouseleave="selectItem(item)">
                  <td class="text-left">{{ item.id }}</td>
                  <td class="text-left">
                    {{ item.farm.farmerFirstName }} {{ item.farm.farmerMiddleName }} {{ item.farm.farmerLastName }}
                  </td>
                  <td class="text-left">{{ item.farm.farmName }}</td>
                  <td class="text-left">{{ item.farm.country }}</td>
                  <td class="text-left">{{ item.centerLatitude }}</td>
                  <td class="text-left">{{ item.centerLongitude }}</td>
                  <td class="text-left">{{ formateDate(item.createdAt) }}</td>
                  <td class="text-left">
                    <div v-if="(item.status==='COMPLETED')" class="text-center mt-2">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn x-small fab v-bind="attrs" v-on="on" @click="showDetails">
                            <v-icon color="primary">mdi-eye</v-icon>
                          </v-btn>
                        </template>
                        <span>{{ $t("satelliteReport.viewReport") }}</span>
                      </v-tooltip>
                    </div>
                  </td>
                </tr>
              </tbody>
            </template>
            <template v-slot:footer></template>
          </v-data-table>
        </div>
      </v-card>
    </v-container>
    <generate-report
      :showDialog="showGenReport"
      @closeDialog="showGenReport = false"
      @reportGenerated="getReportList"
      :optionsLoading="fetchingFarm"
      :farmsWithZonesList="farmList"
    />
  </div>
</template>

<script>
import GenerateReport from "./GenerateReport.vue";
import ReportService from "@/_services/ReportService";
import { getCountries, getStates } from "country-state-picker";
import moment from "moment";
import DownloadMixin from "@/mixins/DownloadMixin";
import { getAllFarmWithZones } from '@/_services/OptionService';
// import ExpandableTextField from "../../components/ExpandableTextField.vue"

export default {
  components: { GenerateReport,  },
  name: "SatelliteReports",
  data() {
    return {
      showMagnify: true,
      searchString: '',
      filterByFromDate:false,
      filterByToDate:false,
      filterByFromDateVal:'',
      filterByToDateVal:'',

      showGenReport: false,
      reports: [],
      search: "",
      from: 0,
      to: 10,
      totalReports: 0,
      tableOptions: { itemsPerPage: 10 },
      totalPages: 1,
      reportsLoading: false,
      debounce: null,
      selectedItem: null,
      showDetailReport: false,
      farmList: [],
      fetchingFarm: false,
      searchFarm: "",
      filterByDate:false,
      countries: [],
      country: {},
      states: [],
      state: {},
      zoneList: [
        { name: "Zone1", value: "area69" },
        { name: "RedZone", value: "911" },
        { name: "OZone", value: "2001" },
      ],
      exportList: [
        {
          name: this.$t('oma.Export CSV Format'),
          value: "csv",
        },
        {
          name: this.$t('oma.Export XLSX Format'),
          value: "xlsx",
        },
        {
          name:this.$t('oma.Export PDF Format'),
          value: "pdf",
        },
      ],
      exportFormat: {},
      globalFarm: [],
      expanded: true,
      headerProps: {
        "sort-icon": "mdi-menu-up",
      },
      headers: [
        {
          text: this.$t('id'),
          align: "start",
          class: "black--text",
        },
        {
          text: this.$t("satelliteReport.operatorName"),
          align: "start",
          value: "operatorName",
          class: "black--text",
        },
        {
          text: this.$t("farmName"),
          align: "start",
          value: "farmName",
          class: "black--text",
        },
        {
          text: this.$t("country"),
          align: "start",
          value: "country",
          class: "black--text",
        },
        {
          text: this.$t("oma.latitude"),
          align: "start",
          value: "latitude",
          class: "black--text",
        },
        {
          text: this.$t("oma.longitude"),
          align: "start",
          value: "longitude",
          class: "black--text",
        },
        {
          text: this.$t("satelliteReport.issueDate"),
          align: "start",
          value: "issueDate",
          class: "black--text",
        },
        {
          text: this.$t("activationKey.action"),
          align: "center",
          class: "black--text",
        },
      ],
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: false,
          to: "/",
        },
        {
          text: this.$t("satelliteReport.satelliteReport"),
          link: true,
          exact: true,
          disabled: true,
          to: { name: "SurveyBuilder" },
        },
      ],
    };
  },
  watch: {
    tableOptions: {
      async handler() {
        await this.getReportList()
      },
      deep: true,
    },
  },
  async mounted() {
    this.reportsLoading= false;
    Promise.all([
      await this.getReportList(),
      await this.getCountry(),
      await this.fetchFarmList(),
    ])
  },
  methods: {
    async fetchFarmList() {
      try {
        this.fetchingFarm = true;
        const farmList = await getAllFarmWithZones();
        farmList.forEach(farm => {
          if(!farm.farmName) farm.farmName = `#${farm.id}`;
          if(Array.isArray(farm.segments)) {
            farm.segments.forEach(segment => {
              if(!segment.geofenceName) segment.geofenceName = `#${segment.id}`;
            });
          }
        });
        this.farmList = farmList;
      } catch (error) {
        console.error(error);
      } finally {
        this.fetchingFarm = false;
      }
    },
    async getReportList() {
      this.reportsLoading = true;
      this.filterByDate = false
      const canSort = this.tableOptions.sortBy.length === 1 && this.tableOptions.sortDesc.length === 1;
      const requestParams = {
        limit: this.tableOptions.itemsPerPage,
        page: this.tableOptions.page ?? 1,
        // search: this.search,
        orderBy: canSort ? this.tableOptions.sortBy[0] : null,
        order: canSort ? this.tableOptions.sortDesc[0] ? 'ASC' : 'DESC' : null,
        startDate:this.filterByFromDateVal,
        endDate:this.filterByToDateVal,
        search: this.searchString
      };

      if (this.country && this.country.name) {
        requestParams.countries = [this.country.name];
      }
      if (this.state && Object.keys(this.state).length !== 0) {
        requestParams.regions = [this.state];
      }
      await ReportService.getSatelliteReport(requestParams)
        .then((res) => {
          this.reports = res.data.data.rows;
          this.totalReports = res.data.data.totalNumberOfReportGroups;
          this.totalPages = Math.ceil(this.totalReports / this.tableOptions.itemsPerPage)
          this.from = (this.tableOptions.page - 1) * this.tableOptions.itemsPerPage + 1
          this.to = (this.tableOptions.page * this.tableOptions.itemsPerPage) - (this.tableOptions.itemsPerPage - res.data.data.rows.length)
          this.reportsLoading = false;
        })
        .finally(() => {
          this.reportsLoading = false;
        })
    },
    async exportAs(val) {
      await ReportService.exportSatelliteReport(val)
        .then((res) => {
          this.downloadBlobFile(res, `Satellite_report.${val}`)
        }).finally(() => {
          this.exportFormat = {}
        })
    },
    async searchReports() {
      // clearTimeout(this.debounce);
      // this.debounce = setTimeout(async () => {
      //   this.search = val;
      //   await this.getReportList()
      // }, 700);
      await this.getReportList()
    },
    pageChange(t) {
      if (t) {
        this.tableOptions.page = this.tableOptions.page + 1;
      } else {
        this.tableOptions.page = this.tableOptions.page - 1;
      }
    },
    async selectItem(item) {
      this.selectedItem = item;
    },
    expandTextField() {
      this.expanded = !this.expanded;
    },
    getCountry() {
      this.countries = getCountries();
    },
    getState(val) {
      this.states = getStates(val.code);
      this.country = val;
    },
    showDetails() {
      this.$router.push({
        name: "SatelliteDetailReports",
        params: { id: this.selectedItem.id },
      });
    },
    formateDate(date) {
      return moment(date).format("DD-MMM-YYYY");
    },
  },
  mixins: [DownloadMixin],
};
</script>
<style lang="scss" scoped>
.expanded {
  width: 45px !important;
}

.menufieldset fieldset {
  height: 47px !important;
}
.magnify-class {
  top: 44px;
    left: 36px;
    position: absolute;
}
</style>
