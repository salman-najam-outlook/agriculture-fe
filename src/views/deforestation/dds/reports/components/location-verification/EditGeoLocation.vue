<template>
  <v-dialog v-model="dialog" persistent max-width="50vw">
    <v-card flat>
      <v-toolbar flat color="secondary">
        <v-toolbar-title class="white--text">
          {{ $t("deforestation.editGeolocation") }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon class="white--text" @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <div class="d-flex mt-6">
          <h2>{{ $t("deforestation.productionPlace") }}</h2>
        </div>

        <v-row>
          <v-col cols="6">
            <h4>{{ $t("deforestation.productionPlace") }}</h4>
            <v-text-field
              class="custom-input"
              v-model="geolocation.farm.farmName"
              :placeholder="$t('deforestation.productionPlace')"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <h4>{{ $t("deforestation.producerName") }}</h4>
            <v-text-field
              class="custom-input"
              v-model="geolocation.producerName"
              :placeholder="$t('deforestation.producerName')"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <h4>{{ $t("deforestation.producerCountry") }}</h4>
            <v-autocomplete
              :items="countries"
              v-model="geolocation.producerCountry"
              item-text="name"
              item-value="name"
              dense
              outlined
              clearable
              class="wdt"
              :placeholder="$t('deforestation.allCountries')"
            ></v-autocomplete>
          </v-col>
          <v-col cols="6">
            <div class="d-flex">
              <label for="longitude" class="text-subtitle-1 font-weight-bold"
                >{{ $t("area") }}
              </label>
              <v-spacer></v-spacer>
              <span class="float-right text-subtitle-1 font-weight-bold"
                >ha</span
              >
            </div>
            <v-text-field
              class="custom-input"
              v-model="area"
              placeholder="0"
              outlined
              dense
              :disabled="disableEditGeofence"
            ></v-text-field>
          </v-col>
        </v-row>

        <div class="d-flex mt-6">
          <h2>{{ $t("deforestation.editGeolocation") }}</h2>
          <v-spacer></v-spacer>
          <v-autocomplete
            outlined
            v-model="geofenceType"
            :items="farmGeofenceType"
            dense
            item-text="label"
            item-value="value"
            style="max-width: 26%;"
            :disabled="disableEditGeofence"
          ></v-autocomplete>
        </div>

        <div v-if="geofenceType === 'POLYGON'">
          <v-divider></v-divider>

          <v-radio-group v-model="dataEntryMethod" row >
            <v-radio
              :label="$t('deforestation.drawGeofence')"
              value="draw"
            ></v-radio>
            <v-radio
            :disabled="disableEditGeofence"

              :label="$t('deforestation.uploadFile')"
              value="upload"
              v-if="geofenceType === 'POLYGON'"
            ></v-radio>
            <v-radio
            :disabled="disableEditGeofence"
              :label="$t('deforestation.manuallyAddData')"
              value="manual"
              v-if="geofenceType === 'POLYGON'"
            ></v-radio>
          </v-radio-group>
        </div>
        <!-- Draw section -->
        <v-row v-if="dataEntryMethod === 'draw'">
          <v-col cols="12">
            <div class="position-relative">
              <div class="search-container">
                <v-row>
                  <v-col cols="12 d-flex">
                    <vue-google-autocomplete
                      id="editmapplace"
                      :value="address"
                      classname="form-control location-input"
                      :placeholder="$t('deforestation.typeyourlocation')"
                      v-on:placechanged="setPlace"
                    ></vue-google-autocomplete>
                    <div class="fullscreen-icon" @click="toggleFullScreen">
                      <v-icon size="30">mdi-fullscreen</v-icon>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </div>

            <!-- MAP section -->
            <div
              class="google-map"
              style="width:100%;height:78vh; z-index: 0;"
              id="map"
              ref="googleMapEdit"
            ></div>
            <div v-show="generateMethod !== 'FILE'">
              <v-tooltip left>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    class="mx-2 float-right mt-n20"
                    fab
                    small
                    color="white"
                    style="margin-top: -51vh;"
                    @click="removeGeofence"
                    v-bind="attrs"
                    v-on="on"
                    :disabled="disableEditGeofence"

                  >
                    <v-icon dark color="gray">
                      mdi-delete-sweep
                    </v-icon>
                  </v-btn>
                </template>
                <span>{{ $t("farm.clearGeofence") }}</span>
              </v-tooltip>
              <v-tooltip left>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    class="mx-2 float-right"
                    fab
                    dark
                    small
                    color="white"
                    style="margin-top: -45vh;"
                    v-bind="attrs"
                    v-on="on"
                    :disabled="disableEditGeofence"
                    @click="deleteSelectedVertex"
                  >
                    <v-icon dark color="gray">
                      mdi-trash-can-outline
                    </v-icon>
                  </v-btn>
                </template>
                <span>{{ $t("farm.deleteSelectedVertex") }}</span>
              </v-tooltip>
            </div>
          </v-col>

          <v-row v-show="geofenceType === 'POINT'">
            <v-col cols="6">
              <label for="longitude" class="text-subtitle-1 font-weight-bold"
                >{{ $t("farm.longitude") }}
              </label>
              <v-text-field
                v-model="longitude"
                type="number"
                outlined
                dense
                placeholder="0"
                hide-details="true"
                :disabled="disableEditGeofence"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <label for="latitude" class="text-subtitle-1 font-weight-bold"
                >{{ $t("farm.latitude") }}
              </label>
              <v-text-field
                v-model="latitude"
                type="number"
                outlined
                dense
                placeholder="0"
                hide-details="true"
                :disabled="disableEditGeofence"
              ></v-text-field>
            </v-col>

            <v-col cols="6">
              <div class="d-flex">
                <label for="longitude" class="text-subtitle-1 font-weight-bold"
                  >{{ $t("farm.radius") }}
                </label>
                <v-spacer></v-spacer>
                <span class="float-right text-subtitle-1 font-weight-bold"
                  >KM</span
                >
              </div>

              <v-text-field
                v-model="geofenceRadius"
                type="number"
                outlined
                dense
                placeholder="0"
                hide-details="true"
                
                :disabled="disableEditGeofence"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-row>

        <!-- Upload file section -->
        <v-row
          v-if="dataEntryMethod === 'upload' && geofenceType === 'POLYGON'"
        >
          <div class="form pb-4">
            <div v-if="!file">
              <div
                :class="['dropZone', dragging ? 'dropZone-over' : '']"
                @dragenter="dragging = true"
                @dragleave="dragging = false"
              >
                <div class="dropZone-info" @drag="onChange">
                  <v-icon size="40" color="info">mdi-cloud-upload</v-icon>
                  <span class="fa fa-cloud-upload dropZone-title"></span>
                  <div class="d-flex-start">
                    <div class="info--text text-decoration-underline">
                      {{ $t("deforestation.selectFileToUploadData") }}
                    </div>
                  </div>
                  <div class="dropZone-upload-limit-info">
                    <div>{{ $t("oma.OrDragDrop") }}</div>
                  </div>
                </div>
                <input
                  type="file"
                  accept=".csv,.shp,.xlsx"
                  @change="onChange"
                />
              </div>
              <span class="red--text">{{ fileError }}</span>
            </div>
            <div v-else class="dropZone-uploaded">
              <div class="dropZone-uploaded-info">
                <v-btn
                  class="ma-2 white--text"
                  @click="removeFile"
                  color="red"
                  outlined
                >
                  {{ $t("oma.removeFile") }}
                  <v-icon right dark> mdi-trash-can </v-icon>
                </v-btn>
              </div>
            </div>
            <v-chip
              v-if="file"
              label
              color="grey lighten-4"
              class=" mt-4 uploadedFile-info"
            >
              <v-icon left small>
                mdi-file-check
              </v-icon>
              {{ file.name }}
            </v-chip>
          </div>
        </v-row>

        <!-- Manual section -->
        <v-row
          v-if="dataEntryMethod === 'manual' && geofenceType === 'POLYGON'"
        >
          <v-col cols="12">
            <v-text-field
              v-model="polygonPoints"
              :label="$t('deforestation.numberOfPoints')"
              type="number"
              outlined
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-data-table
              :headers="headers"
              :items="points"
              item-value="name"
              hide-default-footer
              disable-pagination
            >
              <template v-slot:[`item.lng`]="{ item }">
                <v-text-field
                  v-model="item.lng"
                  type="number"
                  outlined
                  dense
                  class="mt-4"
                  
                >
                </v-text-field>
              </template>
              <template v-slot:[`item.lat`]="{ item }">
                <v-text-field
                  v-model="item.lat"
                  type="number"
                  outlined
                  dense
                  class="mt-4"
                >
                </v-text-field>
              </template>
            </v-data-table>
          </v-col>
        </v-row>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green" outlined @click="cancel">{{
            $t("cancel")
          }}</v-btn>
          <v-btn color="green white--text" @click="handleClick">{{
            dataEntryMethod == "upload" ? $t("upload") : $t("save")
          }}</v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import generalMixin from "@/mixins/GeneralMixin";
import loading from "@/mixins/LoadingMixin";
import VueGoogleAutocomplete from "vue-google-autocomplete";
import { Point, Polygon } from "@flatten-js/core";
import * as shapefile from "shapefile";
import * as XLSX from "xlsx";
import FarmService from "@/_services/FarmService";
import DeforestationService from "@/_services/DeforestationService";
import {hactareToAcre} from "../../../../../../_services/UnitService"
import { getGoogleMapsLoader } from '@/mixins/GoogleMapLoaderSingleton';

export default {
  props: {
    dialog: {
      type: Boolean,
      required: true,
      searchLocation: "",
    },

    farmDetails: {
      type: Object,
      required: true,
    },

    diligenceReportId: {
      type: [String, Number],
      required: true,
    }
  },
  components: {
    VueGoogleAutocomplete,
  },
  data() {
    return {
      disableEditGeofence:false,
      newFarmdetails: null,
      geofenceType: this.farmDetails.farmType || "POLYGON",
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
      loading: false,

      polygonPoints: 0,
      generateMethod: null,
      headers: [
        {
          text: this.$t("deforestation.Circular"),
          value: "point",
        },
        {
          text: this.$t("farm.Longitude"),
          value: "lng",
        },
        {
          text: this.$t("farm.latitude"),
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
          label: this.$t("deforestation.Circular"),
          value: "POINT",
        },
        {
          label: this.$t("deforestation.Polygon"),
          value: "POLYGON",
        },
      ],
      geolocation: {
        producerName: null,
        producerCountry: null,
        farm: {
          farmName: null,
          area: 0,
          location: null,
        },
      },
      countries: [],
    };
  },

  async mounted() {
    await this.getCountries();
    this.geofenceType = this.farmDetails?.farmType.toUpperCase();

    this.area = this.farmDetails?.farm?.area ? parseFloat((this.farmDetails.farm.area * 0.404686   ) ).toFixed(5) : ''
    console.log(" this.area ",  this.area );
    this.address = this.farmDetails?.farm?.address ?? "";

    // farm?.GeoFences?.[0]?.generateMethod
    this.updatePoints(this.polygonPoints);

    if (this.farmDetails?.farmType.toUpperCase() === "POINT") {
    
      if (this.farmDetails?.farm?.GeoFences.length) {
        const {
          geofenceCenterLat: centerLatitude,
          geofenceCenterLog: centerLongitude,
          geofenceRadius: geofenceRadius,
        } = this.farmDetails?.farm?.GeoFences[0];
        this.latitude = centerLatitude;
        this.longitude = centerLongitude;
        this.geofenceRadius = geofenceRadius / 1000; // because we save in meters in backend

        this.mapOptions.center = {
          lat: parseFloat(centerLatitude),
          lng: parseFloat(centerLongitude),
        };
      }
      await this.loadGoogleMaps();
    } else if (this.farmDetails?.farmType.toUpperCase() === "POLYGON") {
      let codes = [];
      if (
        this.farmDetails?.farm?.FarmCoordinates &&
        this.farmDetails?.farm?.FarmCoordinates.length > 0
      ) {
        codes = this.farmDetails?.farm?.FarmCoordinates.map(function(elm) {
          return {
            lat: parseFloat(elm["lat"]),
            lng: parseFloat(elm["log"]),
          };
        });
      }

      this.parentPolygonCoords = codes;
      if (this.parentPolygonCoords.length > 0) {
        const { lat, lng } = this.parentPolygonCoords[0];
        this.mapOptions.center = { lat, lng };
      }
      await this.loadGoogleMaps();
    }


    // if (this.farmDetails?.farmType.toUpperCase() === "POINT") {
    //   this.setupPointGeofence();
    // } else {
    //   this.setupPolygonGeofence();
    // }

    this.updateGeolocation();
  },
  watch: {
    disableEditGeofence(newValue) {
    if (newValue) {
      this.setupDisabledState();
    } else {
      this.setupEnabledState();
    }
  },
    geofenceType: function(value) {
      if (value === "POINT") {
        this.setupPointGeofence();
      } else {
        this.setupPolygonGeofence();
      }
    },
    geofenceRadius: function(value) {
    const newValue = parseInt(value);
    this.circle?.setMap(null);
        // Calculating area
        
    // const areaConversionFactor = this.areaUnit === 1 ?  4046.8564224 : 10000;
    this.area = (Math.PI * Math.pow(newValue, 2)) * 100;

      if ((this.geofenceType || this.farmDetails?.farmType) === "POINT"){
        this.createCircle(newValue);
      }
    },
    polygonPoints(newCount) {
      this.updatePoints(newCount);
    },
    async dataEntryMethod() {
      await this.loadGoogleMaps();
      if ((this.geofenceType || this.farmDetails?.farmType) === "POINT") {
        this.setupPointGeofence();
      } else {
        this.setupPolygonGeofence();
      }
    },
    setupDisabledState() {
    if (this.map) {
      this.google.maps.event.clearListeners(this.map, 'click');
    }
    if (this.polygon) {
      this.polygon.setEditable(false);
      this.polygon.setDraggable(false);
    }
    if (this.marker) {
      this.marker.setDraggable(false);
    }
    this.markersArray.forEach(marker => {
      marker.setDraggable(false);
    });
  },
  setupEnabledState() {
    // Re-enable editing features here
    this.setupPolygonGeofence(); // or setupPointGeofence() depending on the current type
  }
  },
  methods: {
    async getCountries() {
      const data = await FarmService.loadCountries();
      this.countries = data.data;
    },
    updateGeolocation() {
      this.geolocation = {
        producerName:
          `${this.farmDetails?.farm?.userDdsAssoc?.firstName || ''} ${this.farmDetails?.farm?.userDdsAssoc?.lastName || ''}`.trim(),
        producerCountry: this.farmDetails?.farm?.userDdsAssoc?.countryId || "",
        farm: {
          farmName: this.farmDetails?.farm?.farmName,
          area: this.farmDetails?.farm?.area,
          farmType: this.farmDetails?.farmType,
          location: this.farmDetails?.farm?.address,
        },
      };
    },
    async loadGoogleMaps() {
      try {
        const loader =getGoogleMapsLoader();
        const google = await loader.load();
        await this.initializeMap(google);
        setTimeout(() => {
            if ((this.geofenceType || this.farmDetails?.farmType.toUpperCase()) === "POINT") {
              this.setupPointGeofence();
            } else {
              this.setupPolygonGeofence();
            }
          }, 0);
        this.loader = loader;
      } catch (e) {
        console.log("Loader Error", e);
      }
    },
    async initializeMap(google) {
      this.google = google;
      const mapContainer = this.$refs.googleMapEdit;
      if(!mapContainer) return;
      this.map = await new google.maps.Map(mapContainer, this.mapOptions);
      if(this.generateMethod !== 'FILE') {
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
                this.createMarker();
              } else {
                window.alert("No results found");
              }
            })
            .catch((e) => window.alert("Can't fetch location due to: " + e));

          // }
        });
      }
      this.createPolygon();
      this.createMarker();
      if(this.disableEditGeofence)
{      google.maps.event.clearListeners(this.map, 'click');
}
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
      if (!d) return;
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
        this.areainMeter * 100
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
      this.circle && this.circle?.setMap(null);
      this.geofenceRadius = null;
      this.google?.maps?.event.clearListeners(this.map, "click");
      this.map?.addListener("click", async (mapsMouseEvent) => {
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
        if (this.map) this.map.setCenter(this.mapOptions.center);
        const geocoder = new this.google.maps.Geocoder();
        geocoder
          .geocode({ location: { lat: this.latitude, lng: this.longitude } })
          .then((response) => {
            if (response.results[0]) {
              this.address = response.results[0].formatted_address;
              this.createMarker();
            } else {
              window.alert("No results found");
            }
          })
          .catch((e) => window.alert("Can't fetch location due to: " + e));
        this.address = "";
        this.createMarker();
      };
      const error = (err) => {
        console.log(err);
      };

      await navigator.geolocation.getCurrentPosition(success, error);
    },
    async createPolygon() {
      if (this.polygon != null) this.polygon.setMap(null);

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
      if(this.generateMethod !== 'FILE') {
        this.createMarkerArray(this.parentPolygonCoords);
      }
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
      this.circle = await new this.google.maps.Circle({
        fillColor: "#FFFFFF",
        fillOpacity: 0.2,
        strokeWeight: 0,
        map: this.map,
        center: {
          lat: parseFloat(this.latitude),
          lng: parseFloat(this.longitude),
        },
        radius,
      });
      this.circle.setMap(this.map);
    },
    createMarker() {
      if (this.marker != null) this.marker.setMap(null);
      const latLng = { lat: parseFloat(this.latitude), lng: parseFloat(this.longitude) };
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
            draggable: !this.disableEditGeofence,
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
        if (!this.disableEditGeofence) {
          this.markersArray[i].addListener("dragend", () => {
          // console.log('ddd', this.parentPolygonCoords)
          var lat = this.markersArray[i].getPosition().lat();
          var lng = this.markersArray[i].getPosition().lng();
          this.parentPolygonCoords[i] = { lat, lng };
          this.createPolygon();
          // this.createMarkerArray(this.parentPolygonCoords)
          // console.log('ccc',lat, lng);
        });
      }
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
      var sgt = [];
      for (let i = 0; i < vertices.getLength(); i++) {
        const xy = vertices.getAt(i);
        let x = xy.lat();
        let y = xy.lng();
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
        "placeResultDataplaceResultDataplaceResultData",
        placeResultData,
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
      this.$emit("closeGeoLocationModal");
    },

    onChange(e) {
      var files = e.target.files || e.dataTransfer.files;

      const file = e.target.files[0];

      //validate file by file name, shapefile doesnt give mimetype apparently
      let extensionStr = file.name.slice(file.name.lastIndexOf("."));
      if (
        extensionStr !== ".shp" &&
        extensionStr !== ".csv" &&
        extensionStr !== "xlsx"
      ) {
        this.$notify({
          title: this.$t(
            "Invalid file format. Please upload a .shp, .csv, or .xlsx file."
          ),
          type: "error",
        });
        return;
      }

      this.extensionStr = extensionStr;

      if (!files.length) {
        this.dragging = false;
        return;
      }
      this.createFile(files[0]);
    },

    handleClick() {
      if (this.dataEntryMethod == "upload"  ) {
        this.generateMethod = 'FILE';
        this.uploadFile();
      } else {
        if (this.disableEditGeofence) {
          this.generateMethod  = this.farmDetails?.farm?.GeoFences?.[0]?.generateMethod
        }
        else if (this.dataEntryMethod === 'manual' || this.geofenceType.toUpperCase() === 'POINT') {
          this.generateMethod = null;
        }
    
        this.save();
      }
    },

    createFile(file) {
      this.file = file;
      this.dragging = false;
    },

    removeFile() {
      this.file = "";
    },

    fileToArrayBuffer(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          resolve(reader.result);
        };

        reader.onerror = () => {
          reject(reader.error);
        };

        reader.readAsArrayBuffer(file);
      });
    },

    async readShapefile(shapeArrayBuff) {
      try {
        const source = await shapefile.open(shapeArrayBuff);

        const resultArr = [];
        /* eslint-disable */
        async function log(result) {
          if (result.done) return;
          resultArr.push(result.value);
          await source.read().then(log);
        }

        await source.read().then(log);

        return resultArr;
      } catch (error) {
        this.stopLoading();
        this.$notify({
          title: this.$t("Corrupted file"),
          type: "error",
        });
      }
    },

    async uploadFile() {
      this.startLoading();
      try {
        const extensionStr = this.extensionStr;
        const file = this.file;
        // Handle different file types
        if (extensionStr === ".shp") {
          await this.handleShapefile();
        } else if (extensionStr === ".csv") {
          await this.handleCSV(file);
        } else if (extensionStr === "xlsx") {
          await this.handleXLSX(file);
        }
        this.file = "";
        this.dataEntryMethod = "draw";
      } catch (error) {
        console.error("Upload File Error:", error);
      } finally {
        this.stopLoading();
      }
    },

    async handleShapefile() {
      const shapeArrayBuff = await this.fileToArrayBuffer(this.file);
      const resultArr = await this.readShapefile(shapeArrayBuff);
      this.coordinateArray = resultArr
        .flatMap((res) => res.geometry.coordinates)
        .flat();

      if (this.coordinateArray.length > 0) {
        const codes = this.coordinateArray.map(([lng, lat]) => ({
          lat: parseFloat(lat),
          lng: parseFloat(lng),
        }));
        this.parentPolygonCoords = codes;

        if (this.parentPolygonCoords.length > 0) {
          const { lat, lng } = this.parentPolygonCoords[0];
          this.mapOptions.center = { lat, lng };
        }
      }
    },

    async handleCSV(file) {
      // Handle CSV file logic
      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target.result;
        this.processCSVData(csv);
      };

      reader.readAsText(file);
    },

    async handleXLSX(file) {
      // Handle XLSX (Excel) file logic
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0]; // Assume the first sheet
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Process jsonData as needed
        this.processXLSXData(jsonData);
      };
      reader.readAsArrayBuffer(file);
    },

    processCSVData(csvData) {
      // Normalize line endings and split the CSV into lines
        const lines = csvData.trim().split(/\r?\n/);

        // Get the headers (assumes the first row contains headers)
        const headers = lines[0].split(",").map(header => header.trim().toLowerCase());

        // Find the indices for latitude and longitude
        const latIndex = headers.indexOf("latitude");
        const lngIndex = headers.indexOf("longitude");

        if (latIndex === -1 || lngIndex === -1) {
          throw new Error("CSV does not contain Latitude and Longitude columns.");
        }

        // Initialize an array to store coordinates
        const coordinates = [];

        // Process each line after the header
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(",").map(value => value.trim());

          // Extract latitude and longitude
          const latitude = parseFloat(values[latIndex]);
          const longitude = parseFloat(values[lngIndex]);

          // Validate and push if valid
          if (!isNaN(latitude) && !isNaN(longitude)) {
            coordinates.push({ lat: latitude, lng: longitude });
          }
        }
      // Update coordinateArray and parentPolygonCoords
      this.coordinateArray = coordinates
        .map(({ lat, lng }) => [lng, lat])
        .flat();
      this.parentPolygonCoords = coordinates;

      if (this.parentPolygonCoords.length > 0) {
        const { lat, lng } = this.parentPolygonCoords[0];
        this.mapOptions.center = { lat, lng };
      }
    },

    processXLSXData(xlsxData) {
      const headers = xlsxData[0];
      const dataRows = xlsxData.slice(1);

      const codes = dataRows.map((row) => {
        const [lng, lat] = row;
        return { lat: parseFloat(lat), lng: parseFloat(lng) };
      });

      // Update coordinateArray and parentPolygonCoords
      this.coordinateArray = codes.map(({ lat, lng }) => [lng, lat]).flat();
      this.parentPolygonCoords = codes;

      // Additional logic (e.g., setting map center)
      if (this.parentPolygonCoords.length > 0) {
        const { lat, lng } = this.parentPolygonCoords[0];
        this.mapOptions.center = { lat, lng };
      }
    },

    cancel() {
      this.$emit("closeGeoLocationModal");
    },

    async save() {
      if (
        this.dataEntryMethod === "draw" && this.geofenceType === "POLYGON" &&
        (await this.checkPolygonCrossover())
      ) {
        this.$notify({
          title: "No crossover allowed.",
          type: "error",
        });
      } else {
        this.startLoading();
        
        
        let payloadData = {
          id: this.farmDetails.id,
          producerName: this.geolocation.producerName,
          producerCountry: this.geolocation.producerCountry,
          dueDiligenceReportId: this.diligenceReportId,
          farms: {
            farmName: this.geolocation.farm.farmName,
            area:
             hactareToAcre(parseFloat(this.area) ?? parseFloat(this.geolocation.farm.area)),
            farmType: this.geofenceType.toUpperCase(),
            generateMethod: null,
            location: this.address ?? this.geolocation.farm.location,
            pointCoordinates:
              this.geofenceType === "POINT"
                ? {
                    centerLatitude: this.latitude.toString(),
                    centerLongitude: this.longitude.toString(),
                    radius: (this.geofenceRadius * 1000).toString() ?? "0", // convert to meters
                  }
                : {},
            coordinates:
              this.geofenceType === "POLYGON"
                ? this.parentPolygonCoords.map((coord) => ({
                    latitude: coord["lat"].toString(),
                    longitude: coord["lng"].toString(),
                  }))
                : [],
          },
          isEdit: true,
        };

        if (this.dataEntryMethod == "manual") {
          payloadData.coordinates = this.points.map((point) => ({
            latitude: point.lat.toString(),
            longitude: point.lng.toString(),
          }));
        }

        DeforestationService.updateDueDiligenceReport(payloadData)
          .then((res) => {
            const { success, message } = res?.data?.updateDueDiligenceReport;
            if (success) {
              this.addProductionPlaces = [];
              this.$notify({
                title: message,
                type: "success",
              });
            } else {
              this.$notify({
                title: this.$t('somethingWentWrong'),
                type: "error",
              });
            }
          })
          .catch((err) => {
            this.$notify({
              title: err.message || this.$t('somethingWentWrong'),
              type: "error",
            });
          })
          .finally(() => {
            this.stopLoading();
            this.$emit("saveEditGeoLocation");
          });
      }
    },

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
  },
  mixins: [loading, generalMixin],
};
</script>

<style lang="scss" scoped>
.position-relative {
  position: relative;
}
::v-deep .search-container {
  position: absolute;
  top: 0;
  align-items: center;
  margin-top: 10px;
  width: 98%;
  left: 0;
  z-index: 9999 !important;
  left: 10px;
}

::v-deep .location-input {
  background-color: #fff;
  flex: 1;
  padding: 10px;
  border: none;
  outline: none;
  font-size: 16px;
  background: white;
  padding: 8px 20px;
  border-radius: 4px;
  width: 89%;
}
::v-deep .search-icon {
  position: absolute;
  right: 10px;
  pointer-events: none;
  color: #757575;
}

.fullscreen-icon {
  background-color: #fff;
  margin-left: 10px;
  height: 50px;
  width: 50px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

::v-deep
  .theme--light.v-data-table
  > .v-data-table__wrapper
  > table
  > tbody
  > tr
  > td {
  border: 0px !important;
}

.row {
  margin: 0px !important;
}
#dialog-link1 {
  cursor: pointer !important;
}

#dialog-link1::placeholder {
  color: #002287 !important;
  text-decoration: underline !important;
}
.form {
  width: 100%;
}
.progress-bar {
  display: flex;
  justify-content: center;
  align-items: center;
}

.progress-num {
  display: flex;
  justify-content: flex-end;
  font-weight: bold;
}

.uploadedFile-info {
  width: 100%;
  padding: 18px;
}

.dropZone {
  width: 100%;
  height: 150px;
  position: relative;
  border: 2px dashed #97a8b8;
  padding: 100px 0;
}

.dropZone:hover {
  border: 2px solid $primary-color;
}

.dropZone:hover .dropZone-title {
  color: $primary-color;
}

.dropZone-info {
  color: #a8a8a8;
  position: absolute;
  top: 50%;
  width: 100%;
  transform: translate(0, -50%);
  text-align: center;
}

.dropZone-title {
  color: #787878;
}

.dropZone input {
  position: absolute;
  cursor: pointer;
  top: 0px;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.dropZone-upload-limit-info {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
}

.dropZone-over {
  background: #5c5c5c;
  opacity: 0.8;
}

.dropZone-uploaded {
  width: 100%;
  height: 150px;
  position: relative;
  border: 2px solid $primary-color;
  // border-radius: 10px;
}

.dropZone-uploaded-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #a8a8a8;
  position: absolute;
  top: 50%;
  width: 100%;
  transform: translate(0, -50%);
  text-align: center;
}

.removeFile {
  width: 200px;
}

.link-input {
  border-radius: 8px;
  background-color: rgba(209, 209, 209, 0.15);
  padding: 8px;

  .link-text {
    background: none;
    border: none;
    padding: 8px;
    width: 80%;

    &:focus {
      outline: none;
    }
  }

  .link-btn {
    width: 20%;
    background-color: white;
  }
}
</style>
