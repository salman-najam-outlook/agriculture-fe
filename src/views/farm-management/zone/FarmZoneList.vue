<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid v-if="hasFarm">
      <div class="page-title">
        <h2>Farm Zones</h2>
        <v-spacer></v-spacer>
        <v-btn color="primary" dark outlined @click="$router.push({ name: 'EditFarms', params:{farmId:$route.params.id} })" class="mr-2">
          {{ $t('Back') }}
        </v-btn>
        <v-btn :disabled="!farm.coordinates.length" depressed color="primary" @click="$router.push({ name: 'FarmZones',  query: { farmId: $route.params.id}, })">
          {{ $t('Add New Zones') }}
        </v-btn>
      </div>
      <v-card elevation="0" class="px-5">
        <v-card-text v-if="items.length > 0">
          <v-data-table 
            :headers="headers" 
            :items="items" 
            v-model="selected" 
            item-key="farmNumber" 
            :items-per-page="25"
            :loading="loading" 
            loading-text="Loading Farms... Please wait" 
            hide-default-footer :footer-props="{
              'items-per-page-options': [5, 10, 25],
              'show-first-last-page': true,
              'show-current-page': true,
              'items-per-page-text': 'Farms per page',
            }"
          >

            <template v-slot:top>
              <div class="d-flex mt-5">
                <v-spacer></v-spacer>
              </div>
            </template>
            <template v-slot:progress>
              <v-progress-linear color="primary" :height="8" indeterminate></v-progress-linear>
            </template>
            <template v-if="items.length > 0" v-slot:body="{ items }">
              <tbody>
                <tr v-for="item in items" :key="item.id">
                  <td>{{ item.geofenceName }}</td>
                  <td>{{ item.geofenceParameter }} {{ item.geofenceParameterUOMId === 1 ? 'F' : 'M' }}</td>
                  <td>{{ item.geofenceArea }} {{ item.geofenceAreaUOMId === 1 ? 'A' : 'H' }}</td>
                  <td class="text-center">
                    <v-btn depressed plain color="blue" @click="editZone(item)" x-small style="height: 100%;">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn plain color="red" @click="deleteZone(item)" x-small style="height: 100%;">
                      <v-icon>mdi-trash-can</v-icon>
                    </v-btn>
                    <v-btn plain color="red" @click="rowClicked(item)" x-small style="height: 100%;">
                      <v-icon>mdi-eye</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-data-table>
        </v-card-text>

        <div class="text-center white" style="min-height:70vh" v-else>
          <v-row justify="center" align="center">
            <v-col cols="12" sm="4">
              <div class="py-16">
                <img src="/img/Notes.svg" /><br />
                <!-- <strong>No Farm Found</strong><br /> -->
                <div class="pb-4">
                  <small v-if="!farm.coordinates.length" class="red--text">Geofence is required to add zone. Click `Edit Farm` to add Geofence details to your farm.</small>
                  <small v-else
                    >No Zones have been created yet.
                    <br />
                    Please click on Add Zones to create a Zone for this farm.</small>
                </div>
                <v-btn
                  depressed
                  color="primary"
                  @click="$router.push({ name: 'FarmZones',  query: { farmId: $route.params.id}, })"
                  v-if="farm.coordinates.length"
                >
                  {{ $t('Add New Zones') }}
                </v-btn>
                <v-btn
                  v-else
                  depressed
                  color="primary"
                  @click="$router.push({ name: 'EditPrimaryFarm' })"
                >
                  {{ $t('Edit Farm') }}
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </v-container>
    <v-container fluid v-if="!hasFarm && !mixingIsLoading">
      <v-card>
        <div class="py-16 text-center">
          <img src="/icons/nodata.svg" /><br />
          <strong class="red--text">
            {{ $t("noRecordFound") }}
          </strong>
        </div>
      </v-card>
    </v-container>
    <ConfirmBax v-if="deleteconfirm" :dialog="deleteconfirm" :title="confirmboxinfo.title" confirmBtnText="Delete"
      :confirmData="itemToDelete" @confirm:action="deleteConfirmed" />
  </div>
</template>

<script>

import loadingMixin from "@/mixins/LoadingMixin";
import Breadcrumb from "@/components/core/Breadcrumb";
import FarmService from "@/_services/FarmService";
// import { removeSegment } from "@/graphql/Farm.gql"
import ConfirmBax from "@/components/ConfirmBox.vue"
import _ from 'lodash';
export default {
  components: {
    breadcrumb: Breadcrumb,
    ConfirmBax
  },
  watch: {
    tableOptions: {
      handler() {
        this.getfarm();
      },
      deep: true,
    },
  },
  async mounted() {
    this.getPrimaryFarm();
    document.title = this.$t('farm.farms');
    this.selectedHeaders = this.allSelectedHeaders;
  },

  computed: {
    checkBreakPoints() {
      if (this.$vuetify.breakpoint.width <= 980) return true;
      return false;
    },
    hasFarm() {
      return !_.isEmpty(this.farm);
    },
  },
  methods: {
    async getPrimaryFarm() {
      this.startLoading();
      FarmService.getFarm(this.$route.params.id).then(async (data) => {
        console.log('farm', data)
        this.farm = data
        this.items = this.farm.segments.filter(el => {
          return !el?.isPrimary
        });
        this.loading = false;
      }).finally(this.stopLoading);
  
    },
    deleteConfirmed(action, data) {
      if (action) {
        this.removeZone(data)
      }
      this.itemToDelete = null;
      this.deleteconfirm = false;
    },

    deleteZone(item) {
      this.itemToDelete = item;
      this.deleteconfirm = true;
    },
    async removeZone(item) {
      console.log({item})
      this.startLoading()

      await FarmService.deleteSegment(item.id).then((res)=>{
          console.log('res', res)
          this.getPrimaryFarm()
          this.stopLoading()
          this.$notify({
            title: res.message,
            type: "success",
        });
      })
      .catch(e => {
          console.log('error', e)
          this.$notify({
              title: "Something went wrong. Please try after sometime",
              type: "error",
          });
          this.stopLoading()
        })
    },
    editZone(item) {
      this.$router.push({ name: 'FarmEditZone', params: { id: item.id }, query: {farmId: this.$route.params.id} })
    },
    selectItem(item) {
      this.selectedItem = item;
    },
    unSelectItem() {
      this.selectedItem = false;
    },
    goToFarm(frmNum) {
      this.$router.push({ name: "SingleFarm", params: { id: frmNum } });
    },
    pageChange(t) {
      if (t) this.tableOptions.page = this.tableOptions.page + 1;
      else this.tableOptions.page = this.tableOptions.page - 1;

      this.getfarm();
    },
    rowClicked(item) {
      this.$router.push({
        name: "ZoneDetails",
        params: { id: item.id },
        query: {farmId: this.$route.params.id}
      });
    },
  },
  data() {
    return {
      farm: null,
      deleteconfirm: false,
      itemToDelete: null,
      confirmboxinfo: {
        title: "Delete Zone"
      },
      menu: false,
      itemsPerPageSlider: 0,
      itemsPerPageOptions: [5, 10, 25, 50],

      to: "",
      from: "",
      totalPages: "",
      search: "",
      selected: [],
      items: [],
      totalfarms: 1,
      selectedItem: false,
      loading: true,
      length: 0,
      pageCount: 1,
      tableOptions: {},
      tabletTableOptions: { itemsPerPage: 10, page: 1, sortBy: [] },
      loadingText: "$t('dueDiligence.loadingPleaseWait')",
      breadcrumbs: [
        {
          text: this.$t('dashboard'),
          disabled: false,
          to: "/",
        },
        {
          text: this.$t('farm.farms'),
          link: true,
          exact: true,
          disabled: false,
          to: { name: "My farm" },
        },
        {
          text: this.$t('farm.zones'),
          disabled: true,
          to: { name: "ZonesList" },
        }
      ],
      headers: [
        {
          text: this.$t('Zone Name'),
          align: "start",
          value: "farmName",
          class: "black--text",
        },
        {
          text: this.$t('Perimeter'),
          align: "start",
          value: "farmName",
          class: "black--text",
        },
        {
          text: this.$t('Area'),
          value: "govRegistrationNum",
          class: "black--text",
        },
        {
          text: this.$t('Actions'),
          class: "black--text",
          align: 'center center',
          sortable: false
        },
      ],

      selectedHeaders: [],
      oldSelected: [],
      noRecordHeader: [
        this.$t('farm.farmOwner'),
        this.$t('farm.farmType'),
        this.$t('farm.contractMating'),
        this.$t('farm.govtRegistry'),
        this.$t('farm.cooperativeID'),
      ],
      allSelectedHeaders: [
        this.$t('farm.farmId'),
        this.$t('farm.farmOwner'),
        this.$t('farm.farmType'),
        this.$t('farm.contractMating'),
        this.$t('farm.govtRegistry'),
        this.$t('farm.cooperativeID'),
      ],

      // users: [],
    };
  },
  mixins: [loadingMixin],
};
</script>

<style lang="scss" scoped>


::v-deep .v-data-table-header span {
  // text-transform: uppercase !important;
  color: black;
}

::v-deep .v-data-table-header th {
  white-space: nowrap;
}

.table-header-span {
  text-transform: uppercase !important;
  color: black !important;
}
</style>