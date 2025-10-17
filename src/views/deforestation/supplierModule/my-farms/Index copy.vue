<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid class="px-6 py-0">
      <div class="d-flex">
        <h2>{{ $t("dueDiligence.listOfFarms") }}</h2>
        <v-spacer></v-spacer>
        <v-btn color="primary" dark class="mr-2 mb-2" @click="addFarmDialog = true">
          {{ $t("Add Farm Geofench Manually") }}
        </v-btn>
        <v-menu bottom origin="center center" transition="scale-transition">
          <!-- <template v-slot:activator="{ on, attrs }">
            <v-btn color="grey" v-bind="attrs" v-on="on" dark class="mr-3">
              {{ $t("Import GeoFenches In Bulk") }}
              <v-icon>mdi-chevron-down</v-iattrscon>
            </v-btn> 
          </template>-->
          <v-list>
            <v-list-item>
              <v-list-item-title class="cursor-pointer">
                {{ $t("Import as XML Format") }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title class="cursor-pointer">
                {{ $t("Import as Geojson Format") }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <v-card elevation="0" class="px-5 mt-7">
        <v-card-text>
          <v-data-table :headers="placesHeaders" :items="filterData" hide-default-footer v-model="selected"
            :server-items-length="totalProductionPlaces" :loading="loading" loading-text="Production Places...">
            <template v-slot:top="{ }">
              <div class="d-flex mt-5">
                <div style="width: 280px;">
                  <label for="text">
                    {{ $t("search") }}
                  </label>
                  <v-text-field prepend-inner-icon="mdi-magnify" outlined height="5px" :placeholder="$t('search')" dense
                    v-model="placeSearch" @input="searchQuery" class="shrink" clearable></v-text-field>
                </div>
                <div class="ml-3" style="width: 280px;">
                  <label for="text">{{ $t("country") }}</label>
                  <v-select :items="countries" v-model="countryModel" item-text="text" item-value="val" dense outlined
                    class="wdt" :placeholder="$t('deforestation.allCountries')" @change="filterData"></v-select>
                </div>

                <div class="ml-3" style="width: 280px;">
                  <label for="text">{{ $t("deforestation.producer") }}</label>
                  <v-select class="wdt" v-model="producerModel" item-text="text" item-value="val" :items="allProducers"
                    :placeholder="$t('deforestation.allProducer')" @change="filterData" outlined dense>
                  </v-select>
                </div>

                <div class="ml-3" style="width: 280px;">
                  <label for="text">{{
                    $t("deforestation.EUDRDeforestationStatus")
                  }}</label>
                  <v-select class="wdt" v-model="statusModel" item-text="text" item-value="val" :items="allStatus"
                    :placeholder="$t('deforestation.EUDRDeforestationStatus')" @change="filterData" outlined dense>
                  </v-select>
                </div>

                <v-spacer></v-spacer>
                <div class="d-flex" style="margin-top: 15px;">
                  <div class="py-1 title">
                    {{ from }} - {{ to }} of {{ totalProductionPlaces }}
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
              </div>
            </template>
            <template v-slot:body="{ items }">
              <tbody>
                <tr v-for="(item, index) in items" :key="index + item.production_places_farm_id"
                  style="position: relative; width: 0; height: 0">

                  <td class="text-truncate">
                    {{ item.farm.farmName || "N/A" }}<br />
                    {{ item.farm.id }}
                  </td>

                  <td class="text-truncate">
                    {{ item.farm.userAssoc.firstName }}
                    {{ item.farm.userAssoc.lastName }}
                  </td>
                  <td class="text-truncate" style="max-width: 300px;">
                    {{ item.farm.address }}
                  </td>

                  <td class="text-truncate">
                    {{ item.farm.area || "N/A" }}
                  </td>
                  <td class="text-truncate">
                    {{ item.farmType }}
                  </td>

                  <td>
                    <div class="d-flex">
                      <template v-if="item.eudr_deforestation_status ===
                        'Very High Probability'
                        ">
                        <v-chip variant="elevated" color="error" outlined>
                          {{ item.eudr_deforestation_status }}
                        </v-chip>
                      </template>
                      <template v-else-if="item.eudr_deforestation_status ===
                        'Manually Mitigated'
                        ">
                        <v-chip variant="elevated" color="success" outlined>
                          {{ item.eudr_deforestation_status }}
                        </v-chip>
                      </template>
                      <template v-else-if="item.eudr_deforestation_status === 'High Probability'
                        ">
                        <v-chip variant="elevated" color="warning" outlined>
                          {{ item.eudr_deforestation_status }}
                        </v-chip>
                      </template>
                      <template v-else-if="item.eudr_deforestation_status ===
                        'Zero/Negligible Probability' ||
                        item.eudr_deforestation_status ==
                        'Low Probability' ||
                        item.eudr_deforestation_status ==
                        'Medium Probability'
                        ">
                        <v-chip variant="elevated" color="warning" outlined>
                          {{ item.eudr_deforestation_status }}
                        </v-chip>
                      </template>
                      <template v-else>
                        N/A
                      </template>
                      <v-spacer></v-spacer>
                      <img class="ml-1" src="/icons/todo-list.png"
                        style="width: 34px; height: 34px; border-radius: 50%;" />
                    </div>
                  </td>
                  <td>
                    <!--                    //TODO: Rewrite this div after getting data for risk assessment status-->
                    <div class="d-flex">
                      <template v-if="item.eudr_deforestation_status ===
                        'Very High Probability'
                        ">
                        <v-chip variant="elevated" color="error" outlined>
                          {{ item.eudr_deforestation_status }}
                        </v-chip>
                      </template>
                      <template v-else-if="item.eudr_deforestation_status ===
                        'Manually Mitigated'
                        ">
                        <v-chip variant="elevated" color="success" outlined>
                          {{ item.eudr_deforestation_status }}
                        </v-chip>
                      </template>
                      <template v-else-if="item.eudr_deforestation_status === 'High Probability'
                        ">
                        <v-chip variant="elevated" color="warning" outlined>
                          {{ item.eudr_deforestation_status }}
                        </v-chip>
                      </template>
                      <template v-else-if="item.eudr_deforestation_status ===
                        'Zero/Negligible Probability' ||
                        item.eudr_deforestation_status ==
                        'Low Probability' ||
                        item.eudr_deforestation_status ==
                        'Medium Probability'
                        ">
                        <v-chip variant="elevated" color="warning" outlined>
                          {{ item.eudr_deforestation_status }}
                        </v-chip>
                      </template>
                      <template v-else>
                        N/A
                      </template>
                      <v-spacer></v-spacer>
                      <img class="ml-1" src="/icons/todo-list.png"
                        style="width: 34px; height: 34px; border-radius: 50%;" />

                      <!-- <v-btn x-small fab v-bind="attrs" v-on="on" @click="removeFarm(item.farm.id)"
                        style="margin-left: 20px;">
                        <v-icon class="ml-1 green-shadow">mdi-trash-can</v-icon>
                      </v-btn> -->
                    </div>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-data-table>
          <!--          <template>-->
          <!--            <div class="d-flex mt-5" style="align-items: center;">-->
          <!--              <v-spacer></v-spacer>-->
          <!--              <img src="/icons/todo-list.png" style="width: 34px; height: 34px; border-radius: 50%;" />-->
          <!--              <span class="ml-2">View Report</span>-->
          <!--              <v-icon class="ml-5 green-shadow">mdi-trash-can</v-icon>-->
          <!--              <span class="ml-2">Delete</span>-->
          <!--            </div>-->
          <!--          </template>-->
        </v-card-text>
      </v-card>

      <v-dialog v-model="addFarmDialog" width="30%" @click:outside="closeModal" :retain-focus="false">
        <template>
          <v-card>
            <v-toolbar color="primary" elevation="0">
              <v-toolbar-title class="white--text">{{ $t('Add Farm Geofence Manually') }}</v-toolbar-title>
            </v-toolbar>

            <v-card-text class="pt-5 black--text">
              Disclaimer: The farm information that will be evaluated for deforestation compliance must be
              same as
              location of production.

              <v-divider class="mt-10"></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" dark class="mr-3" height="40" outlined @click="closeModal">
                  {{ $t('cancel') }}
                </v-btn>

                <v-btn depressed color="primary" @click="addFarmFormOpen">
                  {{ $t('I understand') }}
                </v-btn>
              </v-card-actions>
            </v-card-text>
          </v-card>
        </template>
      </v-dialog>


      <v-dialog v-model="addFarmFormDialog" width="70%" @click:outside="closeModal" :retain-focus="false">
        <template>
          <v-card>
            <v-toolbar color="primary" elevation="0">
              <v-toolbar-title class="white--text">{{ $t('Add Farm Geofence Manually') }}</v-toolbar-title>
            </v-toolbar>

            <v-card-text class="pt-5 black--text">
              Use your cursor or touch screen to draw the boundaries of the geofence on the map. Click or tap to create
              vertices for polygon geofences or define the center and radius for point geofences.


              <p class="mt-5">Choose Geofence Type</p>



              <v-radio-group v-model="geofenceType" row>
                <v-radio label="Point Geofence" value="point"></v-radio>
                <v-radio label="Polygon Geofence" value="polygon" class="ml-5"></v-radio>
              </v-radio-group>


              <v-row>
                <v-col cols="4">
                  <label for="longitude" class="text-subtitle-1">{{ $t('farm.longitude') }}
                  </label>
                  <v-text-field v-model="longitude" type="number" outlined dense placeholder="0"
                    hide-details="true"></v-text-field>
                </v-col>
                <v-col cols="4">
                  <label for="latitude" class="text-subtitle-1">{{ $t('farm.latitude') }}
                  </label>
                  <v-text-field v-model="latitude" type="number" outlined dense placeholder="0"
                    hide-details="true"></v-text-field>
                </v-col>

                <v-col cols="4">
                  <div class="d-flex">
                    <label for="longitude" class="text-subtitle-1">{{ $t('farm.radius') }}
                    </label>
                    <v-spacer></v-spacer>
                    <span class="float-right text-subtitle-1">M</span>
                  </div>

                  <v-text-field v-model="geofenceRadius" type="number" outlined dense placeholder="0"
                    hide-details="true"></v-text-field>
                </v-col>
              </v-row>


              <v-row>
                <v-col cols="4">
                  <div>
                    <label for="Farm Name" class="text-subtitle-1">{{ $t('Farm Name') }}
                    </label>
                    <v-text-field v-model="farmName" outlined dense placeholder="Enter farm name"
                      hide-details="true"></v-text-field>
                  </div>


                  <div class="mt-5">
                    <label for="Farmer Name" class="text-subtitle-1" style="margin-top: 10px !important;">
                      {{ $t('Farmer Name') }}
                    </label>
                    <v-text-field v-model="farmName" outlined dense placeholder="Enter farmer name"
                      hide-details="true"></v-text-field>
                  </div>
                  <div class="mt-5">
                    <label for="Area Size" class="text-subtitle-1">{{ $t('Area Size') }}
                    </label>
                    <v-text-field v-model="area" type="number" outlined dense placeholder="0"
                      hide-details="true"></v-text-field>
                  </div>
                  <div class="mt-5">
                    <label for="Farm Address" class="text-subtitle-1">{{ $t('Farm Address') }}
                    </label>
                    <v-text-field v-model="farmName" outlined dense placeholder="Enter farm address"
                      hide-details="true"></v-text-field>
                  </div>
                  <div class="mt-5">
                    <label for="Country" class="text-subtitle-1">{{ $t('Country') }}
                    </label>
                    <v-autocomplete :items="countries" v-model="producerCountry" item-text="name" item-value="code" dense
                      outlined clearable class="wdt" :placeholder="$t('Select Country')"></v-autocomplete>

                  </div>
                  <div class="mt-5">
                    <label for="City/Town" class="text-subtitle-1">{{ $t('City/Town') }}
                    </label>
                    <v-text-field v-model="farmName" outlined dense placeholder="Enter city name"
                      hide-details="true"></v-text-field>
                  </div>
                  <div class="mt-5">
                    <label for="State/Province" class="text-subtitle-1">{{ $t('State/Province') }}
                    </label>
                    <v-text-field v-model="farmName" outlined dense placeholder="Enter state name"
                      hide-details="true"></v-text-field>
                  </div>
                  <div class="mt-5">
                    <label for="Zip Code/Postal Code" class="text-subtitle-1">{{ $t('Zip Code/Postal Code') }}
                    </label>
                    <v-text-field v-model="farmName" outlined dense placeholder="Enter zip code"
                      hide-details="true"></v-text-field>
                  </div>




                </v-col>
                <v-col cols="8">
                  <div class="position-relative">
                    <div class="search-container">
                      <v-row>
                        <v-col cols="12 d-flex">
                          <vue-google-autocomplete id="mapplace" :value="address" classname="form-control location-input"
                            :placeholder="$t('deforestation.typeyourlocation')"
                            v-on:placechanged="setPlace"></vue-google-autocomplete>
                          <div class="fullscreen-icon" @click="toggleFullScreen">
                            <v-icon size="30">mdi-fullscreen</v-icon>
                          </div>
                        </v-col>
                      </v-row>
                    </div>
                  </div>

                  <!-- MAP section -->
                  <div class="google-map" style="width:100%;height:78vh; z-index: 0;" id="map" ref="googleMap"></div>
                  <div class="">
                    <v-tooltip left>
                      <!-- <template v-slot:activator="{ on, attrs }">
                        <v-btn class="mx-2 float-right mt-n20" fab small color="white" style="margin-top: -51vh;"
                          @click="removeGeofence" v-bind="attrs" v-on="on">
                          <v-icon dark color="gray">
                            mdi-delete-sweep
                          </v-icon>
                        </v-btn>
                      </template> -->
                      <span>{{ $t("farm.clearGeofence") }}</span>
                    </v-tooltip>
                    <v-tooltip left>
                      <!-- <template v-slot:activator="{ on, attrs }">
                        <v-btn class="mx-2 float-right" fab dark small color="white" style="margin-top: -45vh;"
                          v-bind="attrs" v-on="on" @click="deleteSelectedVertex">
                          <v-icon dark color="gray">
                            mdi-trash-can-outline
                          </v-icon>
                        </v-btn>
                      </template> -->
                      <span>{{ $t("farm.deleteSelectedVertex") }}</span>
                    </v-tooltip>
                  </div>
                </v-col>


              </v-row>


              <v-row>
                <v-col cols="4">
                  <label for="Vendor ID" class="text-subtitle-1">{{ $t('Vendor ID') }}
                  </label>
                  <v-text-field v-model="farmName" outlined dense placeholder="Enter Id"
                    hide-details="true"></v-text-field>
                </v-col>
                <v-col cols="4">
                  <label for="Cooperative ID" class="text-subtitle-1">{{ $t('Cooperative ID') }}
                  </label>
                  <v-text-field v-model="farmName" outlined dense placeholder="Enter Id"
                    hide-details="true"></v-text-field>
                </v-col>
                <v-col cols="4">
                  <label for="Producer Name" class="text-subtitle-1">{{ $t('Producer Name') }}
                  </label>
                  <v-text-field v-model="farmName" outlined dense placeholder="Enter producer name"
                    hide-details="true"></v-text-field>
                </v-col>
              </v-row>
              <v-divider class="mt-10"></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" dark class="mr-3" height="40" outlined @click="addFarmFormDialog = false">
                  {{ $t('cancel') }}
                </v-btn>

                <v-btn depressed color="primary">
                  {{ $t('Submit') }}
                </v-btn>
              </v-card-actions>
            </v-card-text>
          </v-card>
        </template>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import Breadcrumb from "@/components/core/Breadcrumb";
import DeforestationService from "@/_services/DeforestationService";
import loadingMixin from "@/mixins/LoadingMixin";
import download from "@/mixins/DownloadMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import DateMixin from "@/mixins/DateMixin";
import { getCountries } from "country-state-picker";
import VueGoogleAutocomplete from "vue-google-autocomplete";
import { Point, Polygon } from "@flatten-js/core";
import { getGoogleMapsLoader } from '@/mixins/GoogleMapLoaderSingleton';

export default {
  components: {
    breadcrumb: Breadcrumb,
    VueGoogleAutocomplete
  },
  computed: {
    totalPages() {
      return parseInt(Math.ceil(this.totalProductionPlaces / 5));
    },
    currentUser() {
      return this.$store.getters.getUser;
    },

    filterData() {

      if (
        (this.countryModel && this.countryModel !== "") ||
        (this.producerModel && this.producerModel !== "") ||
        (this.statusModel && this.statusModel !== "")
      ) {
        const list = this.productionPlaces.filter((item) => {
          return (
            (!this.countryModel ||
              item.farm.userAssoc.countryId === this.countryModel) &&
            (!this.producerModel ||
              item.farm.userAssoc.firstName === this.producerModel) &&
            (!this.statusModel ||
              item.eudr_deforestation_status === this.statusModel)
          );
        });
        return list;
      } else {
        return this.productionPlaces;
      }
    },
  },
  // computed: {
  //   reportTotalPages() {
  //     return parseInt(Math.ceil(this.totalDiligenceReports / 10))
  //   },
  //   getCurrentUser() {
  //     return this.$store.getters.getUser
  //   },

  // },
  watch: {
    geofenceType: function (value) {
      if (value === "POINT") {
        this.setupPointGeofence();
      } else {
        this.setupPolygonGeofence();
      }
    },
    geofenceRadius: function (value) {
      const newValue = parseInt(value);
      this.circle.setMap(null);

      // Calculating area
      const areaConversionFactor = this.areaUnit === 1 ?  4046.8564224 : 10000;
      this.area = (Math.PI * Math.pow(newValue, 2)) / areaConversionFactor;
      this.createCircle(newValue);
    },
    polygonPoints(newCount) {
      this.updatePoints(newCount);
    },
    async dataEntryMethod() {
      this.loadGoogleMaps();
    },
  },
  async mounted() {
    this.updatePoints(this.polygonPoints);

    // if (this.farmDetails?.farmType === "POINT") {
    //   if (this.farmDetails?.pointCoordinates) {
    //     const {
    //       centerLatitude,
    //       centerLongitude,
    //       radius,
    //     } = this.farmDetails?.pointCoordinates;
    //     this.latitude = centerLatitude;
    //     this.longitude = centerLongitude;
    //     this.geofenceRadius = Number(radius);
    //   }
    // } else if (this.farmDetails?.farmType === "POLYGON") {
    //   let codes = [];
    //     if (
    //       this.farmDetails?.coordinates &&
    //       this.farmDetails?.coordinates.length > 0
    //     ) {
    //       codes = this.farmDetails?.coordinates.map(function(elm) {
    //         return {
    //           lat: parseFloat(elm["latitude"]),
    //           lng: parseFloat(elm["longitude"]),
    //         };
    //       });
    //     }

    //     this.parentPolygonCoords = codes;
    //     if (this.parentPolygonCoords.length > 0) {
    //       const { lat, lng } = this.parentPolygonCoords[0];
    //       this.mapOptions.center = { lat, lng };
    //     }
    // }

    await this.loadGoogleMaps();
    this.setupPointGeofence();
    // if (this.farmDetails?.farmType === "POINT") {
    //   this.setupPointGeofence();
    // } else {
    //   this.setupPolygonGeofence();
    // }
  },
  created() {
    this.orgId = this.currentUser.user_organization.id;
    this.getCountry();
    this.getProductionPlaces();
  },

  data() {
    return {


      farmName: "",
      producerCountry: "",
      geofenceType: "point",
      geofenceRadius: 0.0,
      dataEntryMethod: "draw",
      file: "",
      fileError: "",
      progressText: "Uploading...",
      progressColor: "success",
      progressIcon: "mdi-progress-upload",
      responseMessage: "",
      uploadError: false,
      progress: 0,
      link: "",
      linkError: false,
      dragging: false,

      polygonPoints: 0,
      headers: [
        {
          text: this.$t('deforestation.Point'),
          value: "point",
        },
        {
          text: this.$t('farm.longitude'),
          value: "lng",
        },
        {
          text: this.$t('farm.latitude'),
          value: "lat",
        },
      ],
      points: [
        {
          point: 1,
          latitude: null,
          longitude: null,
        },
      ],
      mapOptions: {
        mapTypeId: "satellite",
        center: { lat: 25.774, lng: -80.19 },
          styles: [
          {
            featureType: "all",
            elementType: "labels",
            stylers: [
              { visibility: "off" }
            ]
          }
        ],
        zoom: 18,
        disableDefaultUI: true,
        zoomControl: true,
      },
      locationEnabled: true,
      address: "",
      selectedMarkerIndex: 0,
      markersArray: [],
      addressData: null,
      snackbar: false,
      areainMeter: 0,
      perimeterInMeter: 0,
      areaUnit: 1,
      area: 0,
      perimeter: 0,
      startGeoFence: true,
      parentPolygonCoords: [],
      // parentPolygonCoordsBk: [],
      subPolygonCoords: [],
      loader: null,
      latitude: 0,
      longitude: 0,
      google: null,
      map: null,
      marker: null,
      polygon: null,
      circle: null,
      subPolygon: null,
      isCrossover: false,
      coordinateArray: [],
      extensionStr: null,
      farmGeofenceType: [
        {
          label: "Point",
          value: "POINT",
        },
        {
          label: this.$t('deforestation.Polygon'),
          value: "POLYGON",
        },
      ],









      addFarmDialog: false,
      addFarmFormDialog: false,

      orgId: undefined,
      loading: true,
      countryModel: "",
      statusModel: "",
      producerModel: "",
      countries: [{ text: this.$t("deforestation.allCountries"), val: "" }],
      // allStatus: [
      //   { text: this.$t('All Status'), val: '' },
      //   { text: this.$t('Very High Probability'), val: 'Very High Probability' },
      //   { text: this.$t('High Probability'), val: 'High Probability' },
      //   { text: this.$t('Medium Probability'), val: 'Medium Probability' },
      //   { text: this.$t('Low Probability'), val: 'Low Probability' },
      //   { text: this.$t('Zero/Negligible Probability'), val: 'Zero/Negligible Probability' },
      //   { text: this.$t('Manually Mitigated'), val: 'Manually Mitigated' }
      // ],
      allProducers: [{ text: this.$t("deforestation.allProducer"), val: "" }],
      options: {
        page: 1,
        limit: 10,
      },


      breadcrumbs: [
        {
          text: this.$t("dueDiligence.dueDiligenceNew"),
          disabled: true,
          to: "/",
        },
        {
          text: this.$t("dueDiligence.createNewReport"),
          disabled: true,
          to: "/",
        },
      ],
      selected: [],
      placesHeaders: [
        {
          text: this.$t("dueDiligence.productionPlaceAndFarmID"),
          align: "start",
          sortable: true,
          value: "user",
          class: "black--text",
          width: "150px",
        },
        {
          text: this.$t("deforestation.producerName"),
          align: "start",
          sortable: true,
          value: "user",
          class: "black--text",
          width: "150px",
        },
        {
          text: this.$t("deforestation.addressOfProduction"),
          align: "start",
          sortable: true,
          value: "user",
          class: "black--text",
          width: "150px",
        },
        {
          text: this.$t("deforestation.areaHa"),
          value: "plantation_name",
          sortable: true,
          class: "black--text",
          width: "150px",
        },
        {
          text: `${this.$t("deforestation.type")}`,
          value: "farm",
          sortable: true,
          class: "black--text",
          width: "150px",
        },
        {
          text: `${this.$t("deforestation.EUDRDeforestationStatus")}`,
          value: "farm",
          sortable: true,
          class: "black--text",
          width: "95px",
        },

        {
          text: `${this.$t("dueDiligence.riskAssessment")}`,
          value: "farm",
          sortable: true,
          class: "black--text",
          width: "225px",
        },
      ],
      productionPlaces: [],
      totalProductionPlaces: 0,
      from: 0,
      to: 0,
      farmStatus: "success",
      farmStatusList: [],
      placeSearch: "",


      allStatus: [
        { text: this.$t("All status"), val: "" },
        {
          text: this.$t("Uploaded to EU Portal"),
          val: "Uploaded to EU Portal",
        },
        { text: this.$t("Pending"), val: "Pending" },
        { text: this.$t("Under Review"), val: "Under Review" },
      ],
      allRegions: [{ text: this.$t("deforestation.allRegions"), val: "" }],

    };
  },
  methods: {
    updatePoints(count) {
      if (count < this.points.length) {
        this.points.splice(count);
      } else {
        for (let i = this.points.length; i < count; i++) {
          this.points.push({
            point: i + 1,
            lat: null,
            lng: null,
          });
        }
      }
    },
    async loadGoogleMaps() {
      try {
        const loader = getGoogleMapsLoader();
        const google = await loader.load();
        await this.initializeMap(google);
        this.loader = loader;
      } catch (e) {
        console.log("Loader Error", e);
      }
    },
    async initializeMap(google) {
      this.google = google;
      const mapContainer = this.$refs.googleMap;
      this.map = await new google.maps.Map(mapContainer, this.mapOptions);
      this.map.addListener("click", async (mapsMouseEvent) => {
        // if (!this.startGeoFence) {
        const latLng = mapsMouseEvent.latLng.toJSON();
        this.parentPolygonCoords.push(latLng);
        // this.parentPolygonCoords.splice((Number(this.selectedMarkerIndex)+1), 0, latLng);
        // this.createPolygon();
        const geocoder = new this.google.maps.Geocoder();
        geocoder
          .geocode({ location: latLng })
          .then((response) => {
            if (response.results[0]) {
              this.latitude = latLng.lat;
              this.longitude = latLng.lng;
              this.address = response.results[0].formatted_address;
              this.createMarker()
            } else {
              window.alert("No results found");
            }
          })
          .catch((e) => window.alert("Can't fetch location due to: " + e));

        // }
      });
      this.createPolygon();
      this.createMarker();
    },
    toggleFullScreen() {
      const elem = this.$refs.googleMap;
      if (!document.fullscreenElement) {
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
          // Firefox
          elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
          // Chrome, Safari and Opera
          elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
          // IE/Edge
          elem.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          // Firefox
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          // Chrome, Safari and Opera
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          // IE/Edge
          document.msExitFullscreen();
        }
      }
    },
    async changeAreaUnit() {
      // const vertices = this.polygon.getPath();
      // var updated = [];
      // var sgt = [];
      // for (let i = 0; i < vertices.getLength(); i++) {
      //     const xy = vertices.getAt(i);
      //     let x = xy.lat();
      //     let y = xy.lng();
      //     updated.push({ lat: x, lng: y });
      //     sgt.push(new Point(x, y))
      // }
      // const ss = new Polygon(sgt);
      let d = await this.polygon.getPath();
      const path = [];
      for (let i = 0; i < d.getLength(); i++) {
        const xy = d.getAt(i);
        let x = xy.lat();
        let y = xy.lng();
        path.push({ lat: x, lng: y });
      }
      // d.forEach((e) => {
      // console.log('path', e.lat())
      // path.push({ lat: e.lat(), lng: e.lng() })
      // if (idx === d.length - 1){
      //     path.push({...path[0]})
      // }
      // })
      this.areainMeter = await this.google.maps.geometry.spherical.computeArea(
        path
      );
      path.push({ ...path[0] });
      this.perimeterInMeter = await this.google.maps.geometry.spherical.computeLength(
        path
      );
      this.area = parseFloat(
        this.areainMeter / (this.areaUnit === 1 ? 4046.86 : 10000)
      ).toFixed(5);
      this.perimeter =
        this.areaUnit === 1
          ? parseFloat(this.perimeterInMeter * 3.28084).toFixed(5)
          : parseFloat(this.perimeterInMeter).toFixed(5);
      // console.log('aa', this.area, this.perimeter)
      return Promise.resolve(true);
    },

    setupPointGeofence() {
      if (
        this.polygon !== null &&
        !(this.farm?.segments && this.farm?.segments[0]?.geofenceRadius)
      ) {
        while (this.parentPolygonCoords.length > 0) {
          this.parentPolygonCoords.pop();
        }
        this.createPolygon();
        this.polygon.setMap(null);
        this.polygon = null;
      }
      this.google.maps.event.clearListeners(this.map, "click");
      this.map.addListener("click", async (mapsMouseEvent) => {
        const latLng = mapsMouseEvent.latLng.toJSON();
        this.latitude = latLng.lat;
        this.longitude = latLng.lng;

        this.gotoCurrentLocation(this.latitude, this.longitude);

        if (this.circle !== null) this.circle.setCenter(latLng);
        this.createMarker();
        this.createPolygon();
      });
      this.createCircle(this.geofenceRadius);
    },

    setupPolygonGeofence() {
      this.circle && this.circle.setMap(null);
      this.geofenceRadius = null;
      this.google.maps.event.clearListeners(this.map, "click");
      this.map.addListener("click", async (mapsMouseEvent) => {
        const latLng = mapsMouseEvent.latLng.toJSON();
        this.parentPolygonCoords.push(latLng);
        this.createPolygon();
      });
    },

    async gotoCurrentLocation(lat, lng) {
      const success = () => {
        this.latitude = lat;
        this.longitude = lng;
        this.mapOptions.center.lat = this.latitude;
        this.mapOptions.center.lng = this.longitude;
        if (this.map) this.map.setCenter(this.mapOptions.center)
        const geocoder = new this.google.maps.Geocoder();
        geocoder
          .geocode({ location: { lat: this.latitude, lng: this.longitude } })
          .then((response) => {
            if (response.results[0]) {
              this.address = response.results[0].formatted_address;
              this.createMarker()
            } else {
              window.alert("No results found");
            }
          })
          .catch((e) => window.alert("Can't fetch location due to: " + e));
        this.address = ""
        this.createMarker();
      };
      const error = (err) => {
        console.log(err)
      };

      await navigator.geolocation.getCurrentPosition(success, error);
    },
    async createPolygon() {
      if (this.polygon != null) this.polygon.setMap(null);

      if (this.parentPolygonCoords && this.parentPolygonCoords.length > 0) {
        const { lat, lng } = this.parentPolygonCoords[0];
        this.gotoCurrentLocation(lat, lng);
      }


      this.polygon = await new this.google.maps.Polygon({
        paths: this.parentPolygonCoords,
        strokeColor: "#1F5D51",
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: "#E5F8F1",
        fillOpacity: 0.7,
        editable: false,
        draggable: false,
        icon: this.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
      });
      // this.google.maps.event.addListener(this.polygon.getPath(), 'set_at', this.setAt);
      // this.google.maps.event.addListener(this.polygon.getPath(), 'insert_at', this.insertAt);
      // this.google.maps.event.addListener(this.polygon.getPath(), 'remove_at', this.markerCoords);
      // this.polygon.addListener("click", (mapsMouseEvent) => {
      //     this.updatePolygon(mapsMouseEvent)
      // });
      this.createMarkerArray(this.parentPolygonCoords);
      this.polygon.setMap(this.map);
      // let d = await this.polygon.getPath().Wc
      // console.log('path', d)
      // this.areainMeter =  await this.google.maps.geometry.spherical.computeArea(d);
      // this.perimeterInMeter = await this.google.maps.geometry.spherical.computeLength(d);
      // this.perimeter = parseFloat(this.perimeterInMeter).toFixed(5)
      await this.changeAreaUnit();
      // this.area = parseFloat(area / (this.areaUnit ===1?4046.86:10000)).toFixed(5)
      return Promise.resolve(true);
    },
    async createCircle(radius = 0) {
      console.log({ radius }, this.map);
      this.circle = await new this.google.maps.Circle({
        fillColor: "#FFFFFF",
        fillOpacity: 0.2,
        strokeWeight: 0,
        map: this.map,
        center: {
          lat: this.latitude,
          lng: this.longitude,
        },
        radius,
      });
      this.circle.setMap(this.map);
    },
    createMarker() {
      if (this.marker != null) this.marker.setMap(null);
      const latLng = { lat: this.latitude, lng: this.longitude };
      this.marker = new this.google.maps.Marker({
        position: latLng,
      });

      // To add the marker to the map, call setMap();
      this.marker.setMap(this.map);
    },
    createMarkerArray(latLngArray) {
      this.removeExistingMarkers();
      const svgMarker = {
        path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
        fillColor: "#00BD73",
        fillOpacity: 1,
        strokeWeight: 0,
        rotation: 0,
        scale: 0.4,
        anchor: new this.google.maps.Point(0, 0),
      };
      const svgMarkerRed = {
        path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
        fillColor: "red",
        fillOpacity: 1,
        strokeWeight: 0,
        rotation: 0,
        scale: 0.4,
        anchor: new this.google.maps.Point(0, 0),
      };
      latLngArray.forEach((latLng, i) => {
        this.markersArray[i] = new this.google.maps.Marker({
          position: latLng,
          map: this.map,
          icon:
            this.parentPolygonCoords.length - 1 == i ? svgMarkerRed : svgMarker,
          draggable: true,
        });
        this.markersArray[i].addListener("click", () => {
          let firstIndex = i + 1;
          this.parentPolygonCoords = this.reArrangeArray(
            firstIndex,
            this.parentPolygonCoords
          );
          // this.selectedMarkerIndex = i
          this.createMarkerArray(this.parentPolygonCoords);
          // this.markersArray[i].setIcon(svgMarkerRed)
          // console.log('marker Index', i)
        });
        this.markersArray[i].addListener("dragend", () => {
          // console.log('ddd', this.parentPolygonCoords)
          var lat = this.markersArray[i].getPosition().lat();
          var lng = this.markersArray[i].getPosition().lng();
          this.parentPolygonCoords[i] = { lat, lng };
          this.createPolygon();
          // this.createMarkerArray(this.parentPolygonCoords)
          // console.log('ccc',lat, lng);
        });
        // this.markersArray[i].setMap(this.map);
      });
    },

    removeExistingMarkers() {
      for (let i = 0; i < this.markersArray.length; i++) {
        this.markersArray[i].setMap(null);
      }
      this.markersArray = [];
    },
    async checkPolygonCrossover() {
      const vertices = this.polygon.getPath();
      var updated = [];
      var sgt = [];
      for (let i = 0; i < vertices.getLength(); i++) {
        const xy = vertices.getAt(i);
        let x = xy.lat();
        let y = xy.lng();
        updated.push({ lat: x, lng: y });
        sgt.push(new Point(x, y));
      }
      const ss = new Polygon(sgt);

      return new Promise((resolve) => {
        if (!ss.isValid()) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    },
    removeGeofence() {
      this.removeExistingMarkers();
      if (this.polygon != null) this.polygon.setMap(null);
      // this.parentPolygonCoordsBk = [];
      this.parentPolygonCoords = [];
      this.perimeter = 0;
      this.area = 0;
    },

    undoGeofence() {
      this.parentPolygonCoords.pop();
      this.createPolygon();
    },

    deleteSelectedVertex() {
      this.parentPolygonCoords.pop();
      this.createPolygon();
    },

    setPlace(addressData, placeResultData) {
      console.log(
        placeResultData,
        "placeResultDataplaceResultDataplaceResultData"
      );
      const latLng = {
        lat: placeResultData.geometry.location.lat(),
        lng: placeResultData.geometry.location.lng(),
      };
      this.map.setCenter(latLng);
      this.latitude = latLng.lat;
      this.longitude = latLng.lng;
      this.address = placeResultData.formatted_address;
      this.addressData = addressData;
      this.createMarker();
    },






    closeModal() {
      this.addFarmDialog = false;
    },
    addFarmFormOpen() {
      this.addFarmDialog = false;
      this.addFarmFormDialog = true;
    },



    async getProductionPlaces(opt = null) {
      this.loading = true;
      const requestParams = {
        page: this.options.page,
        limit: this.options.limit,
        orgId: this.orgId,
        removed: false,
        searchPhrase: this.placeSearch,
      };
      if (opt?.sortBy?.length) {
        requestParams.orderField = opt.sortBy[0];
        requestParams.order = opt.sortDesc[0] ? "DESC" : "ASC";
      }
      DeforestationService.getProductionPlaces(requestParams)
        .then((res) => {
          this.productionPlaces = res.data.productionPlaces.rows;
          this.totalProductionPlaces = res.data.productionPlaces.totalCount;
          this.from = (this.options.page - 1) * this.options.limit + 1;
          this.to = this.options.page * this.options.limit;
          if (this.productionPlaces.length > 0) {
            this.to -= this.options.limit - this.productionPlaces.length;
          } else {
            this.to -= this.options.limit;
          }
          const countryLists = this.productionPlaces
            .filter((item) => item.farm.userAssoc.countryId)
            .map((item) => {
              return {
                text: item.farm.userAssoc.countryId,
                val: item.farm.userAssoc.countryId,
              };
            });
          const producerList = this.productionPlaces
            .filter((item) => {
              return item.farm.userAssoc.firstName;
            })
            .map((item) => {
              const fullName = `${item.farm.userAssoc.firstName
                ? item.farm.userAssoc.firstName
                : ""
                } ${item.farm.userAssoc.lastName ? item.farm.userAssoc.lastName : ""
                }`;
              return {
                text: `${fullName}`,
                val: `${item.farm.userAssoc.firstName}`,
              };
            });
          this.countries = [...this.countries, ...countryLists];
          this.allProducers = [...this.allProducers, ...producerList];
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          console.log("Error", err);
        });
    },

    async removeFarm(id) {
      this.startLoading();
      const params = {
        farmId: parseInt(id),
      };
      const res = await DeforestationService.removeProductionPlaceByFarmId(
        params
      );

      const { success, message } = res.data.removeFarmFromProductionPlaceList;
      this.stopLoading();
      if (success) {
        await this.getProductionPlaces();
        this.$notify({
          title: message || "Item deleted successfully.",
          type: "success",
        });
      }
    },

    pageChange(t) {
      if (t) this.options.page = this.options.page + 1;
      else this.options.page = this.options.page - 1;
      this.getProductionPlaces();
    },
    getCountry() {
      this.countries = [{ name: "All Countries" }, ...getCountries()];
    },

    searchQuery() {
      this.getProductionPlaces();
    },


  },

  mixins: [loadingMixin, download, getPermittedActions, DateMixin],
};
</script>

<style scoped>
.blue-button {
  background-color: #d0e6fe !important;
  /* Green background */
  border: 2px solid #002287 !important;
  /* Red border */
  color: #002287 !important;
}

.gray-button {
  background-color: #e8e8e8 !important;
  /* Green background */
  border: 2px solid #000000 !important;
  /* Red border */
  color: #000000 !important;
}

/* .orange-button {
  background-color: rgba(181, 109, 1, 0.2) !important;
  border: 2px solid #B56D01 !important;
  color: #B56D01 !important;
} */

.card-title {
  font-weight: 600;
  font-size: 18px;
  color: #1e1e1e;
}

.card-sub-title {
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 16px;
  color: #787878;
}

.card-price {
  font-weight: 600;
  font-size: 60px;
  color: #2e2f31;
}

.card-sub-price {
  margin-left: 10px;
  font-weight: 600;
  font-size: 16px;
  color: #2e2f31;
}

.usage-limit-card {
  padding: 30px;
  height: 200px;
  width: 494px;
}

.radial-bar-chart {
  margin-top: -20px;
}

.heading-title {
  font-weight: 600;
  font-size: 22px;
  color: #1e1e1e;
}

.main-price {
  display: flex;
  align-items: center;
  margin-top: 25px;
}

.card-content {
  text-align: center;
}

.green-button {
  background-color: #c1ffe7 !important;
  /* Green background */
  border: 2px solid #489e16 !important;
  /* Red border */
  color: #489e16 !important;
}

.green-shadow {
  color: #00bd73 !important;
}

.red-button {
  background-color: #fdebeb !important;
  /* Green background */
  border: 2px solid #da3d3d !important;
  /* Red border */
  color: #da3d3d !important;
}

.orange-button {
  background-color: #fff7ec !important;
  /* Green background */
  border: 2px solid #ffa826 !important;
  /* Red border */
  color: #ffa826 !important;
}
</style>
