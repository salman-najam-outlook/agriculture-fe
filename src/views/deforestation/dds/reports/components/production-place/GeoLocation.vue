<template>
  <v-dialog v-model="dialog" persistent max-width="50vw">
    <v-card flat>
      <v-toolbar flat color="secondary">
        <v-toolbar-title class="white--text">
          {{ this.geofenceType }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon class="white--text" @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <div class="d-flex mt-6">
          <h2>{{ $t('dueDiligence.addLocation') }}</h2>
          <v-spacer></v-spacer>
          <v-select outlined v-model="geofenceType" :items="farmGeofenceType" dense item-text="label" item-value="value"
            style="max-width: 26%;"></v-select>
        </div>
        <v-divider></v-divider>

        <v-radio-group v-model="dataEntryMethod" row>
          <v-radio :label="$t('deforestation.drawGeofence')" value="draw"></v-radio>
          <v-radio :label="$t('deforestation.uploadFile')" value="upload" v-if="geofenceType === 'POLYGON'"></v-radio>
          <v-radio :label="$t('deforestation.manuallyAddData')" value="manual"
            v-if="geofenceType === 'POLYGON'"></v-radio>
        </v-radio-group>

        <v-row v-if="dataEntryMethod === 'draw'">
          <v-col cols="12">
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

            <div class="google-map" style="width:100%;height:78vh; z-index: 0;" id="map" ref="googleMap"></div>
            <div v-show="generateMethod !== 'FILE'">
              <v-tooltip left>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn class="mx-2 float-right mt-n20" fab small color="white" style="margin-top: -51vh;"
                    @click="removeGeofence" v-bind="attrs" v-on="on">
                    <v-icon dark color="gray">
                      mdi-delete-sweep
                    </v-icon>
                  </v-btn>
                </template>
                <span>{{ $t("farm.clearGeofence") }}</span>
              </v-tooltip>
              <v-tooltip left>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn class="mx-2 float-right" fab dark small color="white" style="margin-top: -45vh;" v-bind="attrs"
                    v-on="on" @click="deleteSelectedVertex">
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
              <label for="longitude" class="text-subtitle-1 font-weight-bold">{{ $t('farm.longitude') }}
              </label>
              <v-text-field v-model="longitude" type="number" outlined dense placeholder="0"
                hide-details="true"></v-text-field>
            </v-col>
            <v-col cols="6">
              <label for="latitude" class="text-subtitle-1 font-weight-bold">{{ $t('farm.latitude') }}
              </label>
              <v-text-field v-model="latitude" type="number" outlined dense placeholder="0"
                hide-details="true"></v-text-field>
            </v-col>

            <v-col cols="6">
              <div class="d-flex">
                <label for="longitude" class="text-subtitle-1 font-weight-bold">{{ $t('farm.radius') }}
                </label>
                <v-spacer></v-spacer>
                <span class="float-right text-subtitle-1 font-weight-bold">{{ this.eudrSettings.radius_unit || "m"
                }}</span>
              </div>

              <v-text-field v-model="geofenceRadius" type="number" @change="limitRadius" outlined dense placeholder="0"
                hide-details="true"></v-text-field>
            </v-col>
          </v-row>
        </v-row>

        <v-row v-if="dataEntryMethod === 'upload' && geofenceType === 'POLYGON'">
          <div class="form pb-4">
            <div v-if="!file">
              <div :class="['dropZone', dragging ? 'dropZone-over' : '']" @dragenter="dragging = true"
                @dragleave="dragging = false">
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
                <input type="file" accept=".csv,.shp,.xlsx" @change="onChange" />
              </div>
              <span class="red--text">{{ fileError }}</span>
            </div>
            <div v-else class="dropZone-uploaded">
              <div class="dropZone-uploaded-info">
                <v-btn class="ma-2 white--text" @click="removeFile" color="red" outlined>
                  {{ $t("oma.removeFile") }}
                  <v-icon right dark> mdi-trash-can </v-icon>
                </v-btn>
              </div>
            </div>
            <v-chip v-if="file" label color="grey lighten-4" class=" mt-4 uploadedFile-info">
              <v-icon left small>
                mdi-file-check
              </v-icon>
              {{ file.name }}
            </v-chip>
          </div>
        </v-row>

        <v-row v-if="dataEntryMethod === 'manual' && geofenceType === 'POLYGON'">
          <v-col cols="12">
            <v-text-field v-model="polygonPoints" label="Number of polygon Points" type="number" outlined></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-data-table :headers="headers" :items="points" item-value="name" hide-default-footer disable-pagination>
              <template v-slot:[`item.lng`]="{ item }">
                <v-text-field v-model="item.lng" type="number" outlined dense class="mt-4">
                </v-text-field>
              </template>
              <template v-slot:[`item.lat`]="{ item }">
                <v-text-field v-model="item.lat" type="number" outlined dense class="mt-4">
                </v-text-field>
              </template>
            </v-data-table>
          </v-col>
        </v-row>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" outlined @click="cancel">{{
            $t("cancel")
          }}</v-btn>
          <v-btn color="primary white--text" @click="handleClick">{{
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
import UnitService from "@/_services/UnitService";
import { Point, Polygon } from "@flatten-js/core";
import * as shapefile from "shapefile";
import * as XLSX from "xlsx";
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
  },
  components: {
    VueGoogleAutocomplete,
  },
  computed: {
    getOrganizationId() {
      return this.$store.getters.getUser?.user_organization?.id;
    },
  },
  data() {
    return {
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
      eudrSettings: {},
      polygonPoints: 0,
      generateMethod: null,
      headers: [
        {
          text: this.$t('deforestation.Circular'),
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
          label: this.$t('deforestation.Circular'),
          value: "POINT",
        },
        {
          label: this.$t('deforestation.Polygon'),
          value: "POLYGON",
        },
      ],
    };
  },
  async created() {

      await this.getEudrSettings();

  },
  async mounted() {
    // this.loadGoogleMaps().then(() => {
    // // Ensure map is centered when the component is mounted
    // this.updateMapCenter();
    // });
    this.address = this.farmDetails.address;
    this.updatePoints(this.polygonPoints);
    if (this.farmDetails?.farmType === "POINT") {
      await this.loadGoogleMaps();
      if (this.farmDetails?.pointCoordinates) {
        const {
          centerLatitude,
          centerLongitude,
          radius,
        } = this.farmDetails?.pointCoordinates;
        this.latitude = centerLatitude;
        this.longitude = centerLongitude;
        this.geofenceRadius =
        UnitService.fromBase.distance('km',  Number(radius))

        if (centerLatitude && centerLongitude) {
          this.mapOptions.center = { lat: centerLatitude, lng: centerLongitude };
        }
      }
    } else if (this.farmDetails?.farmType === "POLYGON") {
      let codes = [];
      if (
        this.farmDetails?.coordinates &&
        this.farmDetails?.coordinates.length > 0
      ) {
        codes = this.farmDetails?.coordinates.map(function (elm) {
          return {
            lat: parseFloat(elm["latitude"]),
            lng: parseFloat(elm["longitude"]),
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


     if (this.dataEntryMethod === "manual") {
      this.resetManualData();
    }
    if (this.farmDetails?.farmType === "POINT") {
      this.setupPointGeofence();
    } else {
      this.setupPolygonGeofence();
    }
    if(this.farmDetails?.dataEntryMethod === 'manual') {
      this.updateDataManualEntry();
    }
  },
  watch: {
    latitude() {
    this.updateMapCenter();
    },
   'points': {
      deep: true,
      handler(newPoints) {
        if (this.dataEntryMethod === 'manual') {
          // Update parentPolygonCoords when points change
          this.parentPolygonCoords = newPoints.map(point => ({
            lat: Number(point.lat),
            lng: Number(point.lng)
          }));
          // Update polygon and area if coordinates are valid
          if (this.parentPolygonCoords.every(coord =>
            coord.lat && !isNaN(coord.lat) &&
            coord.lng && !isNaN(coord.lng)
          )) {
            this.createPolygon();
          }
        }
      }
    },
    longitude() {
      this.updateMapCenter();
    },
    parentPolygonCoords: {
      handler: function (value) {
        if(value && this.dataEntryMethod === 'upload'){
          this.dataEntryMethod = "draw";
        }
        // Recalculate area when coordinates change
        if (value && value.length >= 3) {
          this.recalculateArea();
        }
      },
      deep: true
    },
    geofenceType: function (value) {
      if (value === "POINT") {
        this.setupPointGeofence();
      } else {
        this.setupPolygonGeofence();
      }
    },
    geofenceRadius: function (value) {
      try {
        const newValue = parseInt(value);
      this.circle && this.circle.setMap(null);

      // Calculating area
      const areaConversionFactor = this.areaUnit === 1 ?  4046.8564224 : 10000;
      this.area = (Math.PI * Math.pow(newValue, 2)) / areaConversionFactor;
      this.createCircle(newValue);
      } catch (error) {

        console.error("Error in geofenceRadius watcher:", error);
      }

    },
    polygonPoints(newCount) {
      this.updatePoints(newCount);
    },
    async dataEntryMethod() {
      await this.loadGoogleMaps();
      if (this.farmDetails?.farmType === "POINT") {
        this.setupPointGeofence();
      } else {
        this.setupPolygonGeofence();
      }
       if (this.dataEntryMethod === "manual") {
        this.resetManualData(); // Call reset method when switching to manual
      }
    },
  },
  methods: {
    updateDataManualEntry(){
      this.dataEntryMethod = 'manual';
      this.polygonPoints = this.farmDetails?.coordinates?.length;
      this.points = this.farmDetails?.coordinates.map((point, index) => {
        return {
          point: index + 1,
          lat: point.lat,
          lng: point.lng,
        };
      });
    },
    updateMapCenter() {
     // Ensure latitude and longitude are valid numbers before recentering
      if (this.map && this.latitude && this.longitude && this.latitude !== 0 && this.longitude !== 0) {
        const newCenter = { lat: parseFloat(this.latitude), lng: parseFloat(this.longitude) };
        this.map.setCenter(newCenter);

        // Update the marker's position if it exists
        if (this.marker) {
          this.marker.setPosition(newCenter);
        }

        // If using a circle, update its center
        if (this.circle) {
          this.circle.setCenter(newCenter);
        }
      }
    },
    limitRadius() {
      if (this.eudrSettings && !this.eudrSettings.radius_max_limit) return;
      if (Number(this.geofenceRadius) > Number(this.eudrSettings.radius_max_limit)) this.geofenceRadius = this.eudrSettings.radius_max_limit
    },
    async getEudrSettings() {
      try {
        const eudrSettingsData = this.$store.getters['eudrSettings/get_EUDR_Settings']
        this.eudrSettings = eudrSettingsData
      } catch (err) {
        this.$notify({
          text: this.$t('deforestation.failedToFetchSettings'),
          type: 'error'
        });
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
      if(!mapContainer) return;
      this.map = await new google.maps.Map(mapContainer, this.mapOptions);
      if(this.generateMethod !== 'FILE') {
        this.map.addListener("click", async (mapsMouseEvent) => {
          // if (!this.startGeoFence) {
          const latLng = mapsMouseEvent.latLng.toJSON();
          this.parentPolygonCoords.push(latLng);
          // this.parentPolygonCoords.splice((Number(this.selectedMarkerIndex)+1), 0, latLng);
          this.createPolygon();
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
                console.log("No results found");
              }
            })
            .catch((e) => console.log("Can't fetch location due to: " + e));

          // }
        });
      }
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
      // Check if polygon exists and has a valid path
      if (!this.polygon) {
        this.areainMeter = 0;
        this.perimeterInMeter = 0;
        this.area = "0.00000";
        this.perimeter = "0.00000";
        return Promise.resolve(true);
      }

      let d = await this.polygon.getPath();
      if (!d || d.getLength() < 3) {
        this.areainMeter = 0;
        this.perimeterInMeter = 0;
        this.area = "0.00000";
        this.perimeter = "0.00000";
        return Promise.resolve(true);
      }

      const path = [];
      for (let i = 0; i < d.getLength(); i++) {
        const xy = d.getAt(i);
        let x = xy.lat();
        let y = xy.lng();
        path.push({ lat: x, lng: y });
      }
      
      // Ensure we have at least 3 points for a valid polygon
      if (path.length < 3) {
        this.areainMeter = 0;
        this.perimeterInMeter = 0;
        this.area = "0.00000";
        this.perimeter = "0.00000";
        return Promise.resolve(true);
      }

      try {
        this.areainMeter = await this.google.maps.geometry.spherical.computeArea(path);
        path.push({ ...path[0] });
        this.perimeterInMeter = await this.google.maps.geometry.spherical.computeLength(path);
        
        // Validate the computed values
        if (isNaN(this.areainMeter) || this.areainMeter < 0) {
          this.areainMeter = 0;
        }
        if (isNaN(this.perimeterInMeter) || this.perimeterInMeter < 0) {
          this.perimeterInMeter = 0;
        }
        
        this.area = parseFloat(
          this.areainMeter / (this.areaUnit === 1 ? 4046.86 : 10000)
        ).toFixed(5);
        this.perimeter =
          this.areaUnit === 1
            ? parseFloat(this.perimeterInMeter * 3.28084).toFixed(5)
            : parseFloat(this.perimeterInMeter).toFixed(5);
      } catch (error) {
        this.areainMeter = 0;
        this.perimeterInMeter = 0;
        this.area = "0.00000";
        this.perimeter = "0.00000";
      }
      
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
        this.startLoading()
        const latLng = mapsMouseEvent.latLng.toJSON();
        this.latitude = latLng.lat;
        this.longitude = latLng.lng;

        this.gotoCurrentLocation(this.latitude, this.longitude);

        if (this.circle !== null) this.circle.setCenter(latLng);
        this.createMarker();
        this.createPolygon();

        this.stopLoading();
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
            console.log('formatted response', response, this.latitude, this.longitude)

            if (response.results[0]) {
              console.log('formatted address', response.results[0])
              this.address = response.results[0].formatted_address;
              this.createMarker()
              this.stopLoading()
            } else {
              console.log.alert("No results found");
            }
          })
          .catch((e) => console.log("Can't fetch location due to: " + e));
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

      // Only create polygon if we have enough coordinates
      if (this.parentPolygonCoords && this.parentPolygonCoords.length >= 3) {
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
        
        if(this.generateMethod !== 'FILE') {
          this.createMarkerArray(this.parentPolygonCoords);
        }
        this.polygon.setMap(this.map);
        
        // Calculate area only if polygon was created successfully
        await this.changeAreaUnit();
        
        // Ensure area is calculated properly with fallback
        const calculatedArea = parseFloat(this.areainMeter / (this.areaUnit === 1 ? 4046.86 : 10000));
        this.area = isNaN(calculatedArea) ? "0.00000" : calculatedArea.toFixed(5);
      } else {
        this.area = "0.00000";
      }
      
      return Promise.resolve(true);
    },
    checkAndConvertToBase(radius) {
      return this.eudrSettings.radius_unit !== 'm' ? UnitService.toBase.distance(this.eudrSettings.radius_unit, radius) : radius;
    },
    async createCircle(radius = 0) {
      try {
        // this.checkAndConvertToBase(radius);
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
        this.circle && this.circle.setMap(this.map);
      } catch (error) {

        console.error("Error in createCircle:", error);
      }

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
          this.createMarkerArray(this.parentPolygonCoords)
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

      if (vertices) {
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
      }

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
      this.$emit("closeGeoLocationModal");
    },

    onChange(e) {
      var files = e.target.files || e.dataTransfer.files;

      const file = e.target.files[0];

      //validate file by file name, shapefile doesnt give mimetype apparently
      let extensionStr = file.name.slice(file.name.lastIndexOf('.'));
      if (
        extensionStr !== ".shp" &&
        extensionStr !== ".csv" &&
        extensionStr !== ".xlsx"
      ) {
        this.fileError = this.$t(
          "Invalid file format. Please upload a .shp, .csv, or .xlsx file."
        );
        this.$notify({
          title: this.fileError,
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
      this.fileError = "";
    },

    async handleClick() {
      if (this.dataEntryMethod == "upload") {
        this.generateMethod = 'FILE';
        this.uploadFile();
      } else {
        if(this.dataEntryMethod === 'manual' || this.geofenceType.toUpperCase() === 'POINT') {
          this.generateMethod = null;
        }

        await this.save();
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
          console.log(result.value, "result value");
          await source.read().then(log);
        }

        await source.read().then(log);

        return resultArr;
      } catch (error) {
        this.stopLoading();
        console.error(error.stack);
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
          this.handleShapefile();
        } else if (extensionStr === ".csv") {
          this.handleCSV(file);
        } else if (extensionStr === ".xlsx") {
          this.handleXLSX(file);
        }
        this.file = "";
        // this.dataEntryMethod = "draw";
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

        this.loadGoogleMaps();
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
      reader.onload = async(e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0]; // Assume the first sheet
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Process jsonData as needed
        await this.processXLSXData(jsonData);
      };
      reader.readAsArrayBuffer(file);
    },


    processCSVData(csvData) {
      // Split CSV data into lines
      const lines = csvData.trim().split("\r\n");

      // Initialize an array to store coordinates
      const coordinates = [];

      // Iterate through each line (skipping the header line)
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const values = line.split(",");

        if (values.length >= 2) {
          const latitude = parseFloat(values[0].trim());
          const longitude = parseFloat(values[1].trim());

          // Validate latitude and longitude
          if (!isNaN(latitude) && !isNaN(longitude)) {
            coordinates.push({ lat: latitude, lng: longitude });
          }
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
      // Helper function to find the index of a column using a regular expression
      const findColumnIndex = (headers, regex) => {
        return headers.findIndex(header => regex.test(header));
      };

      // Function to detect the header row
      const detectHeaderRow = (data) => {
        for (let i = 0; i < 5; i++) {
          const headers = data[i];
          const latIndex = findColumnIndex(headers, /^lat/i);
          const lngIndex = findColumnIndex(headers, /^lng|^long/i);
          if (latIndex !== -1 && lngIndex !== -1) {
            return { headers, latIndex, lngIndex, dataRows: data.slice(i + 1) };
          }
        }
        return null;
      };

      const headerInfo = detectHeaderRow(xlsxData);

      if (!headerInfo) {
        this.$notify({
          title: "Latitude or Longitude column not found in the first 5 rows of the Excel file.",
          type: "error",
        });
        return;
      }

      const { headers, latIndex, lngIndex, dataRows } = headerInfo;

      if (latIndex === -1 || lngIndex === -1) {
        this.$notify({
          title: "Latitude or Longitude column not found in the Excel file.",
          type: "error",
        });
        return;
      }

      const codes = dataRows.map((row, index) => {
        const lat = row[latIndex];
        const lng = row[lngIndex];

        // Validate latitude and longitude values
        if (lat === undefined || lng === undefined || isNaN(lat) || isNaN(lng)) {
          return null;
        }

      // Limit the number of log entries
      if (index < 10) {
          console.log(lat, lng);
      }
      this.lat= lat;
      this.lng= lng;
        return { lat: parseFloat(lat), lng: parseFloat(lng) };
      }).filter(Boolean); // Filter out null values

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
      if (this.geofenceType === 'POLYGON' && await this.checkPolygonCrossover()) {
        this.$notify({
          title: "No crossover allowed.",
          type: "error",
        });
      }
      else {
        // Force area recalculation before saving
        await this.recalculateArea();

        // Format the coordinates for polygon farms
        const polygonCoordinates = this.parentPolygonCoords.map((item) => ({
          latitude: item.lat,
          longitude: item.lng,
        }));


        // Format the point coordinates
        const pointCoordinates = {
          centerLatitude: this.latitude,
          centerLongitude: this.longitude,
          radius: this.checkAndConvertToBase(this.geofenceRadius),
        };

        // Create the data object to be emitted
        let data = {
          farmName: this.farmDetails.farmName,
          coordinates: polygonCoordinates,
          pointCoordinates: pointCoordinates,
          farmType: this.geofenceType,
          location: this.address,
          area: this.calculateArea(),
          generateMethod: this.generateMethod,
          dataEntryMethod: this.dataEntryMethod,
        };
        let error = false;

        if (this.dataEntryMethod == "manual") {
          data.coordinates = this.points.map((point) => ({
            latitude: point.lat,
            longitude: point.lng,
          }));


          for (const coor of data.coordinates) {
            if (coor.latitude == "" || !coor.latitude || coor.longitude == "" || !coor.longitude) {
              error = true;
              break;
            }
          }
        }

        if (error) {
          this.$notify({
            title: "Please fill all coordinate fields.",
            type: "error",
          });
        } else {
          this.$emit("saveGeoLocationPoints", data);
          if(this.dataEntryMethod === 'manual') {
            this.dataEntryMethod = 'draw';
          }
          else{
            this.$emit("closeGeoLocationModal");
          }
        }

      }
    },
    resetManualData() {
      // Reset `points` to match `parentPolygonCoords`
      this.polygonPoints = this.parentPolygonCoords.length;
      this.points = this.parentPolygonCoords.map((coord, index) => ({
        point: index + 1,
        lat: coord.lat,
        lng: coord.lng,
      }));
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
    calculateArea() {
      // Safely calculate area with fallback to 0
      const areaValue = parseFloat(this.area);
      if (isNaN(areaValue) || areaValue < 0) {
        return "0.00000";
      }
      return (areaValue * 0.404686).toFixed(5);
    },
    async recalculateArea() {
      // Force recalculation of area when coordinates change
      if (this.parentPolygonCoords && this.parentPolygonCoords.length >= 3) {
        await this.createPolygon();
      } else {
        this.area = "0.00000";
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

::v-deep .theme--light.v-data-table>.v-data-table__wrapper>table>tbody>tr>td {
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