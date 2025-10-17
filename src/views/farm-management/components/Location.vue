<template>
  <v-container grid-list-xl fluid class="pa-5 location-container">
    <v-row>
      <v-spacer></v-spacer>
      <v-btn
        class="mr-3 mt-2"
        depressed
        color="primary"
        dark
        @click="openAddFarmLocation = true"
        v-show="$can($permissions.can_create_farm.value)"
      >
        {{ $t("farm.addNewLocation") }}
      </v-btn>
    </v-row>
    <div
      v-for="(location, index) in locations"
      :key="location.id"
      class="general-information mb-8"
    >
      <v-row v-if="index == 0" class="mb-8 pl-3 location-container">
        <div class="text-h6">{{ $t("farm.primaryLocation") }}</div>
      </v-row>
      <v-row v-if="index == 1" class="mb-8 pl-3 location-container">
        <div class="text-h6">{{ $t("farm.secondaryLocation") }}</div>
      </v-row>
      <v-row>
        <v-col cols="1" class="d-flex align-center justify-center">
          <v-icon @click="toggleCollapse(location.id)">
            {{
              isCollapsed[location.id] ? "mdi-chevron-up" : "mdi-chevron-down"
            }}
          </v-icon>
        </v-col>
        <v-col cols="11">
          <v-row align-content="center" align="center" no-gutters>
            <v-col>
              <div class="ma-1">
                <v-list dense class="green-background">
                  <v-list-item>
                    <v-list-item-content class="green-background">
                      <v-list-item-subtitle
                        >{{ $t("farm.farmAddress") }}
                        <v-tooltip top color="black">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                              mdi-help-circle-outline
                            </v-icon>
                          </template>
                          <span>{{ $t("farm.countryState") }}</span>
                        </v-tooltip>
                      </v-list-item-subtitle>
                      <v-list-item-title class="green-background">
                        <v-tooltip bottom color="black" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <h4
                              v-bind="attrs"
                              v-on="on"
                              class="pt-4 text-capitalize"
                            >
                              {{
                                location.address
                                  ? location.address
                                  : "Not Specified" | truncate(20)
                              }}
                            </h4>
                          </template>
                          <h5 class="pt-4 text-capitalize">
                            {{ location.address || "N/A" }}
                          </h5>
                        </v-tooltip>
                      </v-list-item-title>
                      <!-- <v-list-item-title class="green-background">
                        {{ $t('farm.farmAddress') }}
                        <v-tooltip top color="black">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                              mdi-help-circle-outline
                            </v-icon>
                          </template>
                          <span>{{ $t('farm.countryState') }}</span>
                        </v-tooltip></v-list-item-title>
                      <h5 class="pt-4 text-capitalize">
                        {{ location.address || "N/A" }}
                      </h5> -->
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </div>
            </v-col>
            <v-col>
              <div class="ma-1">
                <v-list dense class="green-background">
                  <v-list-item>
                    <v-list-item-content class="green-background">
                      <v-list-item-title class="green-background">
                        {{ $t("farm.country") }}
                        <v-tooltip top color="black">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                              mdi-help-circle-outline
                            </v-icon>
                          </template>
                          <span>{{ $t("farm.countryState") }}</span>
                        </v-tooltip></v-list-item-title
                      >
                      <h5 class="pt-4 text-capitalize">
                        {{ location.country || "N/A" }}
                      </h5>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </div>
            </v-col>
            <v-col>
              <div class="ma-1">
                <v-list dense class="green-background">
                  <v-list-item>
                    <v-list-item-content class="green-background">
                      <v-list-item-title class="green-background">
                        {{ $t("farm.provinceState") }}
                        <v-tooltip top color="black">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                              mdi-help-circle-outline
                            </v-icon>
                          </template>
                          <span>{{ $t("farm.stateStatement") }}</span>
                        </v-tooltip></v-list-item-title
                      >
                      <h5 class="pt-4 text-capitalize">
                        {{ location.state || "N/A" }}
                      </h5>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </div>
            </v-col>
            <v-col>
              <div class="ma-1">
                <v-list dense class="green-background">
                  <v-list-item>
                    <v-list-item-content class="green-background">
                      <v-list-item-title class="green-background">
                        {{ $t("farm.city") }}
                        <v-tooltip top color="black">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                              mdi-help-circle-outline
                            </v-icon>
                          </template>
                          <span>{{ $t("farm.cityStatement") }}</span>
                        </v-tooltip></v-list-item-title
                      >
                      <h5 class="pt-4 text-capitalize">
                        {{ location.city || "N/A" }}
                      </h5>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </div>
            </v-col>
            <v-col>
              <div class="ma-1">
                <v-list dense class="green-background">
                  <v-list-item>
                    <v-list-item-content class="green-background">
                      <v-list-item-title class="green-background">
                        {{ $t("farm.farmNumber") }}
                        <v-tooltip top color="black">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                              mdi-help-circle-outline
                            </v-icon>
                          </template>
                          <span>{{ $t("farm.farmNumber") }}</span>
                        </v-tooltip></v-list-item-title
                      >
                      <h5 class="mt-1 text-capitalize">
                        {{ location.farmNumber || "N/A" }}
                      </h5>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </div>
            </v-col>
            <v-col>
              <div class="ma-1">
                <v-list dense class="green-background">
                  <v-list-item>
                    <v-list-item-content class="green-background">
                      <v-list-item-title class="green-background">
                        {{ $t("farm.totalFarmSize") }}
                        <v-tooltip top color="black">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                              mdi-help-circle-outline
                            </v-icon>
                          </template>
                          <span>{{ $t("farm.totalFarmSize") }}</span>
                        </v-tooltip></v-list-item-title
                      >
                      <h5 class="mt-1 text-capitalize">
                        {{
                          convertSizeIntoBaseUnit(location.area)
                        }}
                      </h5>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </div>
            </v-col>
            <v-menu
              v-if="!location.isPrimary"
              :close-on-content-click="false"
              offset-y
              :transition="false"
            >
              <template #activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-card class="action-list">
                <v-list>
                  <v-list-item>
                    <v-list-item-content
                      style="cursor: default"
                      @click="editLocation(location)"
                    >
                      <v-list-item-title>
                        <v-icon color="blue">mdi-pencil</v-icon>
                        {{ "Edit" }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item @click="deleteLocation(location)">
                    <v-list-item-content style="cursor: default">
                      <v-list-item-title>
                        <v-icon color="red"> mdi-trash-can </v-icon>
                        {{ "Delete" }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
          </v-row>
        </v-col>
      </v-row>
      <div v-if="isCollapsed[location.id]">
        <zone-table
          :location-id="+location.id"
          :locationObj="location"
          :farm-id="+farm.id"
        ></zone-table>
      </div>
    </div>
    <add-farm-location
      v-if="openAddFarmLocation"
      :dialog="openAddFarmLocation"
      :farm-id="+farm.id"
      @confirm:action="addConfirmed"
    >
    </add-farm-location>
    <edit-farm-location
      v-if="openEditFarmLocation"
      :dialog="openEditFarmLocation"
      :farm-id="+farm.id"
      :location-detail="selectedLocation"
      @confirm:action="editConfirmed"
    >
    </edit-farm-location>

    <ConfirmBax
      v-if="deleteconfirm"
      :dialog="deleteconfirm"
      :title="confirmboxinfo.title"
      :message1="confirmboxinfo.message1"
      :message2="confirmboxinfo.message2"
      confirmBtnText="Delete"
      :confirmData="itemToDelete"
      @confirm:action="deleteConfirmed"
    />
  </v-container>
</template>
<script>
/* eslint-disable */
// import { mapGetters } from "vuex";
import loadingMixin from "@/mixins/LoadingMixin";
import AddFarmLocationPopup from "./AddFarmLocationPopup.vue";
import EditFarmLocationPopup from "./EditFarmLocationPopup.vue";
import ConfirmBax from "@/components/ConfirmBox.vue";
let   removeFarmLocation,
  updateFarmLocation,
  getUserFarmByFarmId;
import ZoneTable from "./ZoneTable.vue";
import _ from "lodash";
import FarmService from "@/_services/FarmService";
import {convertSizeIntoBaseUnit} from "@/utils.js"


export default {
  name: "Location",
  components: {
    "add-farm-location": AddFarmLocationPopup,
    "edit-farm-location": EditFarmLocationPopup,
    "zone-table": ZoneTable,
    ConfirmBax,
  },

  async mounted() {
    console.log("location load")
    this.startLoading();
    let locationRes = await FarmService.getFarmLocationByFarmId(this.$route?.params?.farmId)
    this.locations = locationRes
    this.locations =
    _.orderBy( this.locations, ['isPrimary'],
    ['desc']);
    this.zoneCount = locationRes.length;
    this.totalCount = this.zoneCount;
    this.farmId = Number(this.$route?.params?.farmId);
    this.stopLoading();
  },
  computed: {
    // ...mapGetters(["getfarm"]),
  },
  props: {
    farm: {
      require: true,
    },
  },
  filters: {
    truncate(value, length) {
      if (value.length > length) {
        return value.substring(0, length) + "...";
      } else {
        return value;
      }
    },
  },
  data() {
    return {
      country: "xxxx",
      city: "xxxx",
      state: "xxxx",
      farmLocationList: [],
      openAddFarmLocation: false,
      openEditFarmLocation: false,
      isGeneralInfoFulfilled: true,
      loading: true,
      isCollapsed: {},
      search: "",
      items: [],
      itemsPerPage: 10,
      itemsPerPageSlider: 3,
      itemsPerPageOptions: [10, 25, 50, 100],
      tableOptions: {},
      totalCount: 0,
      zoneCount: 0,
      itemToDelete: { id: null, type: null },
      deleteconfirm: false,
      confirmboxinfo: {
        title: "",
        message1: "",
        message2: "",
      },
      selectedLocationId: 0,
      selectedLocation: {},
      secondaryLocationCount: 4,
      locations: [],
    };
  },
  watch: {
    locations: {
      handler() {
        this.stopLoading();
      },
      deep: true,
    },
  },
  methods: {
    convertSizeIntoBaseUnit,
    async searchZoneByFarmId() {
      const { data } = await this.$apollo.query({
        query: getUserFarmByFarmId,
        fetchPolicy: "no-cache",
        variables: {
          farmId: Number(this.farmId),
        },
      });
      this.stopLoading();
      if (_.isEmpty(data)) {
        return;
      }
      this.farm = data.getUserFarmByFarmId;
    },

    async addConfirmed(action, data) {
      if (action) {
        this.startLoading();
        const d = {
          farmId: parseInt(this.farmId),
          address: data.address,
          area: data.area,
          areaUomId: data.areaUomId,
          country: data.country,
          city: data.city,
          farmLocationGeofence: data.farmGeofence,
          farmNumber: data.farmNumber,
          lat: data.lat,
          log: data.log,
          parameter: data.parameter,
          state: data.state,
          street: data.street,
          geofenceRadius: data.farmGeofenceRadius,
          geofenceCenterLat: data.lat,
          geofenceCenterLog: data.log,
        };
        await FarmService.createFarmLocation(d)
          .then(async res => {
            await this.fetchLocations()
            this.stopLoading();
          })
          .catch(() => {
            this.stopLoading();
            this.$notify({
              title: "Something went wrong. Please try after sometime",
              type: "error",
            });
          });
      }
      this.openAddFarmLocation = false;
    },

    async fetchLocations() {
      let locationRes = await FarmService.getFarmLocationByFarmId(this.$route?.params?.farmId)
      this.locations = locationRes
      this.locations =
    _.orderBy( this.locations, ['isPrimary'],
    ['desc']);
      this.zoneCount = locationRes.length;
      this.totalCount = this.zoneCount;
      this.farmId = Number(this.$route?.params?.farmId);
    },
    async editConfirmed(action, data) {
      if (action) {
        this.startLoading();
        const d = {
          id: parseInt(data.id),
          farmId: parseInt(this.farmId),
          address: data.address,
          area: data.area,
          areaUomId: data.areaUomId,
          country: data.country,
          city: data.city,
          farmNumber: data.farmNumber,
          lat: data.lat,
          log: data.log,
          parameter: data.parameter,
          state: data.state,
          street: data.street,
          farmLocationGeofence: data.farmGeofence,
          geofenceId: parseInt(data.geofenceId),
        };

        FarmService.updateFarmLocation(data.id, data)
          .then(async res => {
            console.log(res);

            this.stopLoading();
            this.$notify({
              title: `Farm updated successfully`,
              text: "success",
              type: "success",
              position: "top right",
            });
          })
          .catch(e => {
            console.log(e);
            this.stopLoading();
            this.$notify({
              title: `Farm cannot be added.`,
              text: "Something went wrong!",
              type: "error",
              position: "top right",
            });
          });
        this.stopLoading();
      }

      this.selectedLocation = {};
      this.openEditFarmLocation = false;
    },

    toggleCollapse(locationId) {
      // Toggle the isCollapsed state for the clicked item
      this.$set(this.isCollapsed, locationId, !this.isCollapsed[locationId]);
      this.selectedLocationId = locationId;
    },

    pageChange(t) {
      if (t) this.tableOptions.page = this.tableOptions.page + 1;
      else this.tableOptions.page = this.tableOptions.page - 1;

      this.$apollo.queries.animals.skip = false;

    },

    editLocation(location) {
      // location.FarmCoordinates = location.isPrimaryFarm
      //   ? location.FarmCoordinates
      //   : location.farmLocationCoordinates;
      // if (!location.FarmCoordinates) {
      //   const geofence = location.GeoFences.find(
      //     item => item.geofenceName == null
      //   );
      //   location.FarmCoordinates = geofence?.geofenceCoordinates;
      //   location.geofenceId = geofence.id;
      // }
      this.selectedLocation = location;
      this.openEditFarmLocation = true;
    },

    deleteLocation(location) {
      this.itemToDelete = { id: location.id, type: "location" };
      this.deleteconfirm = true;
      this.confirmboxinfo.title = "Delete Location";
      this.confirmboxinfo.message1 =
        "Are you sure you want to delete this farm location?";
      this.confirmboxinfo.message2 =
        "Please confirm if you would like to delete this location.";
    },

    deleteConfirmed(action, data) {
      if (action) {
        this.removeLocation(data.id);
      }
      this.itemToDelete = { id: null, type: null };
      this.deleteconfirm = false;
    },

    // async removeLocation(id) {
    //   this.startLoading();
    //   await this.$apollo
    //     .mutate({
    //       mutation: removeFarmLocation,
    //       variables: {
    //         locationId: parseInt(id),
    //         farmId: parseInt(this.farmId),
    //       },
    //     })
    //     .then(async res => {
    //       if (res.data.removeFarmLocation.success) {
    //         this.$apollo.queries.locations.refetch();
    //       }
    //       this.stopLoading();
    //     })
    //     .catch(e => {
    //       console.log("error:", e);
    //       this.stopLoading();
    //     });
    // },
  },
  mixins: [loadingMixin],
};
</script>
<style lang="scss" scoped>
.location-container {
  background-color: #f1f4f7 !important;
}
.v-list {
  height: 100px;
  max-width: 250px;
}
.general-information {
  background: #ffffff;
  border-radius: 5px;
}

.flex.lg5-custom {
  width: 20%;
  max-width: 80%;
  flex-basis: 20%;
}

.green-background {
  border-radius: 3px;
  background-color: #e5f8f1;
}

.container.grid-list-xl .layout .flex {
  padding: 0px 12px 0px 12px;
}

.v-expansion-panel-header {
  height: 70px !important;
}

.v-expansion-panel-header--active {
  background: #fff7ec;
  border: 1px solid #ffb443;
  border-radius: 5px;
  color: #787878;
  font-size: 18px;
}

.plr-25 {
  padding: 0 25px;
}
</style>
