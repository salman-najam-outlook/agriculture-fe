<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-4">
        <h2>{{ $t("memberDataSection.farmers") }}</h2>
        <v-spacer></v-spacer>
      </div>

      <v-card elevation="0" class="px-5">
        <v-card-text>
          <!-- <div v-if="!farmers.length" class="text-center" style="padding-top:5%">
            <v-row align="center" justify="center">
              <v-col>
                <v-img max-height="190" max-width="190" src="/icons/nodata.svg" class="img-center"></v-img>
                <h5 class="mt-4 red--text">{{ $t("memberDataSection.noFarmers") }}</h5>
                <p class="text-caption black--text">
                  {{ $t("memberDataSection.noFarmers") }}
                </p>
              </v-col>
            </v-row>
          </div> -->
          <div >
            <v-data-table :headers="headers" :items="farmers" :footer-props="{
              'items-per-page-options': [10, 25, 50],
            }" hide-default-footer :server-items-length="farmersCount"
              loading-text="Loading Farmers...">
              <template v-slot:top="{}">
                <div class="d-flex mt-5">
                  
                  <v-text-field prepend-inner-icon="mdi-magnify" outlined height="5px" :placeholder="$t('search')" dense
                    v-model="search" @input="handleSearchByPharse" class="shrink" clearable></v-text-field>
                  
                    <div class="d-inline-flex ml-3">
                    <!-- <span class="title black--text text-no-wrap">{{ $t('status') }}</span> -->
                    <!-- <v-select :items="farmersStatusList" v-model="farmerStatus" item-text="label" item-value="val" dense
                      outlined class="shrink ml-2 wdt" :placeholder="$t('memberData.selectStatus')"
                      @change="handleSearchByStatus"></v-select> -->
                  </div>
                  <v-spacer></v-spacer>
                  
                  <v-btn color="primary" height="40"  class="mr-4 px-4" outlined
                    @click="downloadCsv" small>
                    <v-img width="15px" src="/icons/pngfile.png"></v-img>
                    <span class="ml-2">{{ $t('exportAsCSV') }}</span>
                  </v-btn>

                  <div class="py-1 title">
                    {{ options.page }} - {{ totalPages }} {{ $t('of') }} {{ farmersCount }}
                  </div>
                  
                  <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page <= 1"
                    @click="pageChange(false)">
                    <v-icon dark>
                      mdi-chevron-left
                    </v-icon>
                  </v-btn>
                  
                  <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page >= totalPages"
                    @click="pageChange(true)">
                    <v-icon dark>
                      mdi-chevron-right
                    </v-icon>
                  </v-btn>

                </div>
              </template>
              <template v-if="farmers.length" v-slot:body="{ items }">
                <tbody>
                  <tr v-for="item in items" :key="item.id" style="position: relative; width: 0; height: 0"
                    @mouseover="selectItem(item)" @mouseleave="selectItem(null)">
                    <td>{{ item.userId }}</td>
                    <td> {{ item.firstName }} {{ item.lastName }}</td>

                    <td> {{ item.farms }}</td>

                    <td> {{ item.mobile }}</td>

                    <td> {{ convertSizeIntoBaseUnit(item.farmSize) }}</td>

                    <td> {{ item.cropCount }}</td>

                    <td> {{ item.equipmentCount }}</td>

                    <td> {{ item.createdAt | formatDate }} </td>

                    <td class="text-center">
                      <v-btn x-small :to="{name:'farmers_view', params:{ id:item.userId }}" plain min-width="120" color="primary" class="views-btn">
                        {{ $t("memberDataSection.views") }}
                      </v-btn>
                    </td>

                  </tr>
                </tbody>
              </template>
              <template v-slot:footer></template>
            </v-data-table>
          </div>
        </v-card-text>
      </v-card>
    </v-container>

  </div>
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import DownloadMixin from "@/mixins/DownloadMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import MemberDataService from "@/_services/MemberDataService";
import {mapGetters} from 'vuex'
import _ from 'lodash'
import {convertSizeIntoBaseUnit} from "@/utils.js"

export default {
  mounted() {
    this.fetchFarmers()
  },
  data() {
    return {
      selectedItem: false,
      options: {
          limit:50,
          page:1,
          searchPhrase:'',
          status:'',
          orderType:'DESC'
      },
      search: "",
      farmerStatus: "",
      farmersStatusList: [
        { val: '', label: this.$t('all') },
        { val: 'approved', label: this.$t('memberDataSection.approved') },
        { val: 'rejected', label: this.$t('memberDataSection.rejected') }
      ],
      headers: [
        {
          text: this.$t("logs.userId"),
          align: "start",
          value: "userId",
          class: "black--text",
        },
        {
          text: this.$t("memberDataSection.farmerName"),
          align: "start",
          value: "farmerName",
          class: "black--text",
        },
        {
          text: this.$t("memberDataSection.farms"),
          value: "farms",
          class: "black--text",
          align: "start",
          sortable: true,
        },
        {
          text: this.$t("memberDataSection.phoneNumber"),
          align: "start",
          value: "phoneNumber",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("memberDataSection.farmSize"),
          align: "start",
          value: "farmSize",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("memberDataSection.crops"),
          align: "start",
          value: "crops",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("memberDataSection.equipment"),
          align: "start",
          value: "equipment",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("memberDataSection.date"),
          align: "start",
          value: "date",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("memberDataSection.status"),
          align: "center",
          value: "status",
          class: "black--text",
          sortable: true,
        },
      ],
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: false,
          to: { name: "Users" },
          exact: true,
        },
        {
          text: this.$t("memberDataSection.farmers"),
          disabled: true,
          href: "breadcrumbs_link_1",
        },
      ],
    };
  },
  computed:{
    ...mapGetters({
      'farmers': 'memberData/farmers', 
      'farmersCount':'memberData/farmersCount'
    }),
    totalPages(){
      return this.farmersCount < this.options.limit ? 1 : Math.ceil(this.farmersCount/this.options.limit)
    }
  },
  methods: {
    convertSizeIntoBaseUnit,
    fetchFarmers(){
      this.startLoading()
      this.$store.dispatch('memberData/getFarmers', this.options)
      .then(()=> this.stopLoading()).catch(()=>this.stopLoading())
    },
    handleSearchByPharse:_.debounce(function(){
      this.options.searchPhrase = this.search
      this.fetchFarmers()
    },1000),

    handleSearchByStatus:_.debounce(function(){
      this.options.status = this.farmerStatus
      this.fetchFarmers()
    },1000),

    selectItem(item) {
      this.selectedItem = item;
    },
    downloadCsv() {
        const {DOWNLOAD_FARMERS_CSV_URL} = MemberDataService
        const queryParam = new URLSearchParams(this.options)
        const requestUrl = `${DOWNLOAD_FARMERS_CSV_URL}?${queryParam}`
        this.startLoading()
        this.downloadSourceFile(requestUrl, "text/csv").then(() => this.stopLoading())
    },
    pageChange(t) {
      if (t) this.options.page = this.options.page + 1;
      else this.options.page = this.options.page - 1;
      this.fetchFarmers()
    },
  },
  mixins: [loadingMixin, getPermittedActions, DownloadMixin],
};
</script>
<style lang="scss" scoped>
::v-deep .wdt.v-text-field {
  width: 250px;
}

::v-deep .v-tab:hover {
  background-color: #caf1e2;
  color: $primary_color !important;
}

::v-deep .v-data-table-header span {
  text-transform: uppercase !important;
  color: black;
}

::v-deep .center-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

::v-deep .img-center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 40%;
}

::v-deep .v-data-table-header__icon {
    display: none;
}
</style>
  