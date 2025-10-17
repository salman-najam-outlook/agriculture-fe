<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-4">
        <h2>{{ $t("oma.weatherAnalysisReport") }}</h2>
        <v-spacer></v-spacer>
        <div class="d-flex mt-1">
          <v-btn color="primary" :to="{name:'WeatherAnalysisGenerateReport'}" dark class="mr-2">
            {{ $t('oma.generateNewReport') }}
          </v-btn>
        </div>
      </div>
      <v-card elevation="0" class="px-5">
        <v-card-text>
          <v-data-table class="my-awesome-table" :headers="headers" :items="items" :items-per-page="10"
                        v-model="selected" :loading="loading" :loading-text="'Seller loading'" :footer-props="{
                            'items-per-page-options': [10, 25, 50],
                            'show-first-last-page': true,
                            'show-current-page': true,
                            'items-per-page-text': 'Land suitbility per page',
                        }" :options.sync="tableOptions" :server-items-length="20" hide-default-footer>
            <template v-slot:top>
              <div class="d-flex mt-5">
                <v-text-field     
                                    v-model="search"
                                    :placeholder="$t('oma.search')"
                                    :disabled="false"
                                    outlined
                                    dense
                                />

               
                <v-select class="mx-3" v-model="country" :items="countries" @change="handleRegions" outlined dense item-value="code"
                          item-text="name" :loading="loading" :placeholder="$t('deforestation.allCountries')">
                </v-select>
                <v-select class="mx-3 mr-5" v-model="region" :items="regions" outlined dense item-value="id"
                          item-text="farmName" :loading="loading" :placeholder="$t('deforestation.allRegions')">
                </v-select>
                <v-menu v-model="filterByDateMenu" :close-on-content-click="false"
                        :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field append-icon="mdi-calendar" v-model="filterByDate" outlined dense readonly
                                  v-bind="attrs" v-on="on"
                                  v-on:click:append="filterByDateMenu = true"
                                  :placeholder="$t('oma.selectDate')"></v-text-field>
                  </template>
                  <v-date-picker v-model="filterByDate" placeholder=""
                                 @input="filterByDateMenu = false"></v-date-picker>
                </v-menu>
                <v-btn @click="handleSearch" class="ml-5">
                                    <v-icon> mdi-filter </v-icon>
                                </v-btn>
                <v-select
                    :items="exportList"
                    v-model="exportAs"
                    item-text="name"
                    item-value="value"
                    class="mx-4"
                    dense
                    outlined
                    flat
                    style="width: 140px;"
                    :loading="loading" :placeholder="$t('exportAs')"
                    @change="exportReport"
                  >
                  </v-select>
                <v-spacer></v-spacer>

                <!-- <div class="py-1 title">{{ $t("filterBy") }}</div>
                <v-btn class="mx-2" icon color="primary" @click="showFilters = true">
                <v-icon dark large>
                    mdi-filter
                </v-icon>
                </v-btn> -->
                <div class="py-1 title">
                  {{ from }} - {{ to }} {{ $t('of') }} {{ totalItems }}
                </div>
                <v-btn class="mx-2" fab small outlined color="primary"
                       :disabled="tableOptions.page <= 1" @click="pageChange(false)">
                  <v-icon dark>
                    mdi-chevron-left
                  </v-icon>
                </v-btn>
                <v-btn class="mx-2" fab small outlined color="primary"
                       :disabled="tableOptions.page >= totalPages" @click="pageChange(true)">
                  <v-icon dark>
                    mdi-chevron-right
                  </v-icon>
                </v-btn>
              </div>
            </template>
            <template v-slot:no-data v-if="items.length < 1">
              No data found.
            </template>
            <template v-if="items.length > 0" v-slot:body="{ items }">
              <tbody>
              <tr v-for="item in items" :key="item.id" @mouseover="selectItem(item)"
                  @mouseleave="unSelectItem()" style="position: relative; width: 0; height: 0">
                <template>
                  <td>
                    {{ item.id }}
                  </td>
                  <td class="capitlize"> {{ item.user ? `${item.user.firstName} ${item.user.lastName}`: null  }}</td>
                  <td class="capitlize"> {{ item.userFarm ? item.userFarm.farmName : null }}</td>
                  <td class="capitlize"> {{ item.country }}</td>
                  <td class="capitlize"> {{ item.latitude }}</td>
                  <td class="capitlize"> {{ item.longitude }}</td>
                  <td class="capitlize"> {{ formatDate(item.issuedDate) }}</td>
                  <td>
                    <div style="position: absolute; right: 10px; top:5px;">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn :to="{name:'WeatherAnalysisGenerateReport', params:{id:item.id}}" x-small fab v-bind="attrs"
                                 v-on="on"
                                 class="green-shadow">
                            <v-icon>mdi-eye</v-icon>
                          </v-btn>
                        </template>
                        <span>{{ $t("show") }}</span>
                      </v-tooltip>
                    </div>
                  </td>
                </template>


              </tr>
              </tbody>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import DownloadMixin from "@/mixins/DownloadMixin";
import loadingMixin from "@/mixins/LoadingMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import LandSuitabilityAndWeatherService from "@/_services/LandSuitabilityAndWeatherService";
import DateMixin from "@/mixins/DateMixin";

export default {
  computed: {},
  mounted() {
    this.loading = false;
    this.allCountries()
  },
  watch: {
    tableOptions: {
      async handler() {
        await this.getWeatherAnalysis()
      },
      deep: true,
    },
  },
  components: {},
  methods: {
    async exportReport(){
      this.startLoading();
      const response = await LandSuitabilityAndWeatherService.exportReport('weather_analysis',this.exportAs);
      this.downloadBlob(response.data,'weatherlist.'+this.exportAs);
      this.stopLoading();
    },
    selectItem(item) {
      this.selectedItem = item;
    },
    unSelectItem() {
      this.selectedItem = false;
    },
    async getUsers() {
      this.loading = false;
    },

    async allCountries() {
      await LandSuitabilityAndWeatherService.getAllCountries().then(res => {
        this.countries = res.data
      })
    },

    async getAllRegions(countryCode){
      this.loadingRegions = true
      await LandSuitabilityAndWeatherService.getAllRegions(countryCode).then(res=>{
        this.regions = res.data
        this.loadingRegions = false
      }).catch(() => {
        this.loadingRegions = false
      })
    },

    handleRegions(){
      this.getAllRegions(this.country)
    },

    async getWeatherAnalysis(){
      this.loading = true;
      await LandSuitabilityAndWeatherService.getWeatherAnalysisLists({
        limit:this.tableOptions.itemsPerPage,
        page:this.tableOptions.page,
        search:this.search,
        filter_date:this.filterByDate,
        country:this.countries.find(item=>item.code == this.country)?.name,
        state:this.region
      }).then(res => {
        this.items = res.data.rows
        this.totalItems = res.data.count
        this.totalPages = Math.ceil(
            this.totalItems / this.tableOptions.itemsPerPage
        );
        this.from = (this.tableOptions.page - 1) * this.tableOptions.itemsPerPage + 1;
        this.to =
            this.tableOptions.page * this.tableOptions.itemsPerPage -
            (this.tableOptions.itemsPerPage - this.items.length);

        this.loading = false;
        
      }).catch(err=>{
        console.log(err)
        this.loading = false;
      })
    },

    handleSearch(){
      this.getWeatherAnalysis()
    },


    searchSeller() {
      // if(this.search == '') return
      this.tableOptions.page = 1;
      this.getUsers();
    },

    resetSearchOnEmpty() {
      if (this.search != "") return;
      this.tableOptions.page = 1;
      this.getUsers();
    },
    downloadCsv() {

    },

    getSearchResult() {
    },

    pageChange(t) {
      if (t) this.tableOptions.page = this.tableOptions.page + 1;
      else this.tableOptions.page = this.tableOptions.page - 1;
    },
    closeFilter() {
      this.showFilters = false;
    },
    clearFilters() {
      this.dataFiltered = false;
      this.closeFilter();
      this.getUsers();
    }
  },
  data() {
    return {
      totalSellers: 3,
      dataFiltered: false,
      showFilters: false,
      tab: 0,
      from: 0,
      to: 0,
      totalPages: 1,
      exportAs: '',
      filterByDateMenu: false,
      countries:[],
      country:null,
      regions:[],
      region:null,
      filterByDate: null,
      tableOptions: {
        page:1,
        itemsPerPage:10
      },
      totalItems:null,
      search: "",
      selected: [],
      exportOptions: [],
      items: [],
      selectedItem: false,
      loading: false,
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: true,
          to: "/",
        },
        {
          text: this.$t("oma.landSuitibility"),
          disabled: true,
          to: "breadcrumbs_link_1",
        },
      ],
      headers: [
        {
          text: this.$t("id"),
          align: "start",
          sortable: true,
          value: "id",
          class: "black--text  text-no-wrap",
        },
        {
          text: this.$t("oma.operatorName"),
          value: "operatorName",
          sortable: true,
          class: "black--text text-no-wrap"
        },
        {
          text: this.$t("deforestation.farmName"),
          value: "farmName",
          sortable: true,
          class: "black--text text-no-wrap"
        },
        {
          text: this.$t("country"),
          value: "country",
          sortable: true,
          class: "black--text text-no-wrap",
        },
        {
          text: this.$t("oma.latitude"),
          value: "latitude",
          align: "center",
          sortable: true,
          class: "black--text text-no-wrap",
          width: "10%",
        },
        {
          text: this.$t("oma.longitude"),
          value: "price",
          align: "center",
          sortable: true,
          class: "black--text text-no-wrap",
          width: "10%",
        },
        {
          text: this.$t("oma.issueDate"),
          value: "issueDate",
          align: "center",
          sortable: true,
          class: "black--text text-no-wrap",
          width: "10%",
        },
        {
          text: this.$t("action"),
          value: "action",
          align: "center",
          sortable: true,
          class: "black--text text-no-wrap",
          width: "10%",
        },
      ],
      exportList: [
        {
          name:this.$t('oma.Export CSV Format'),
          value: 'csv',
        },
        {
          name:this.$t('oma.Export XLSX Format'),
          value: 'xlsx',
        },
        {
          name:this.$t('oma.Export PDF Format'),
          value: 'pdf',
        }
      ],
    };
  },
  mixins: [loadingMixin, getPermittedActions, DownloadMixin, DateMixin]
};
</script>

<style lang="scss" scoped>
.letterSpacing {
  letter-spacing: 0;
}

.my-awesome-table {
  table-layout: fixed;
}

::v-deep .v-tab:hover {
  background-color: #caf1e2;
  color: $primary_color !important;
}

::v-deep .green-shadow:hover {
  background-color: $primary_color;
  color: white;
}

::v-deep .my-custom-dialog {
  position: absolute;
  top: 0;
  min-height: 100%;
  right: 0;
  margin-right: 0px;
  margin-top: 0px;
}

::v-deep .square {
  width: 1vw;
  height: 1vw;
}

::v-deep .xxxx {
  border: 2px solid black;
}

::v-deep .product-name-cl {
  padding: 5px;
}

::v-deep .product-name-cl .product-img {
  display: flex;
  align-items: center;
}

::v-deep .product-img p {
  margin-left: 5px;
}
</style>