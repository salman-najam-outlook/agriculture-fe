<template>
  <v-dialog v-model="dialog" persistent max-width="50vw">
    <v-card flat>
      <v-toolbar flat color="secondary">
        <v-toolbar-title class="white--text">
          {{ $t("deforestation.viewGeolocation") }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon class="white--text" @click="cancel">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <div class="d-flex mt-6">
          <h2>{{ $t("deforestation.productionPlace") }}</h2>
          <v-spacer></v-spacer>
          <v-btn v-if="!disableEditGeofence" @click="editGeofenceMap()" color="primary">{{ $t("edit") }}</v-btn>
        </div>

        <v-row>
          <v-col cols="6">
            <h4>{{ $t("deforestation.productionPlace") }}</h4>
            <p class="pt-3">{{ farmDetails.farm.farmName || "" }}</p>
          </v-col>
          <v-col cols="6">
            <h4>{{ $t("deforestation.producerName") }}</h4>
            <p class="pt-3">
              {{ farmDetails.farm.userAssoc.firstName || "" }}
              {{ farmDetails.farm.userAssoc.lastName || "" }}
            </p>
          </v-col>
          <v-col cols="6">
            <h4>{{ $t("deforestation.producerCountry") }}</h4>
            <p class="pt-3">{{ countryName }}</p>
          </v-col>
          <v-col cols="6">
            <h4>{{ $t("farm.area") }}(ha)</h4>
            <p class="pt-3">
              {{
                parseFloat(farmDetails.farm.area * 0.404686).toFixed(4) || ""
              }}
            </p>
          </v-col>
        </v-row>

        <div class="d-flex mt-6">
          <h2>{{ $t("deforestation.geoLocation") }}</h2>
          <v-spacer></v-spacer>
          <v-autocomplete
            outlined
            v-model="geofenceType"
            :items="farmGeofenceType"
            dense
            item-text="label"
            item-value="value"
            style="max-width: 26%;"
          ></v-autocomplete>
        </div>

        <!-- Draw section -->
        <v-row>
          <v-col cols="12">
            <div class="position-relative">
              <div class="search-container">
                <v-row>
                  <v-col cols="12 d-flex">
                    <vue-google-autocomplete
                      id="mapplace"
                      :value="address"
                      classname="form-control location-input"
                      placeholder="Type your location name/address"
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
              ref="googleMap"
            ></div>
          </v-col>
        </v-row>
        <v-row v-if="geofenceType === 'POINT'">
          <v-col cols="6">
            <h4>{{ $t("farm.longitude") }}</h4>
            <p class="pt-3">{{ this.latitude || "" }}</p>
          </v-col>
          <v-col cols="6">
            <h4>{{ $t("farm.latitude") }}</h4>
            <p class="pt-3">{{ this.longitude || "" }}</p>
          </v-col>
          <v-col cols="6">
            <h4>{{ $t("farm.radius") }} (M)</h4>
            <p class="pt-3">{{ this.geofenceRadius || "" }}</p>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green" outlined @click="cancel">{{
            $t("cancel")
          }}</v-btn>
          <v-btn color="green white--text" @click="save">{{
            $t("save")
          }}</v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
    <!-- Edit geolocation components -->
    <EditGeoLocation v-if="showEditGeofenceMap" :dialog="showEditGeofenceMap" :farmDetails="farmDetails"  @closeGeoLocationModal="dismissEditGeoLocationModal"  @saveEditGeoLocation="saveEditGeoLocationModal"/>
  </v-dialog>
</template>

<script>
import generalMixin from "@/mixins/GeneralMixin";
import loading from "@/mixins/LoadingMixin";
import VueGoogleAutocomplete from "vue-google-autocomplete";
import { Point, Polygon } from "@flatten-js/core";
import FarmService from "@/_services/FarmService";
import EditGeoLocation from "./EditGeoLocation.vue";
import { getGoogleMapsLoader } from '@/mixins/GoogleMapLoaderSingleton';

export default {
  props: {
    dialog: {
      type: Boolean,
      required: true,
      searchLocation: "",
    },

    disableEditGeofence: {
      type: Boolean,
      required: false,
      default: false,
    },

    farmDetails: {
      type: Object,
      required: true,
    },
  },
  components: {
    VueGoogleAutocomplete,
    EditGeoLocation,
  },
  data() {
    return {
      showEditGeofenceMap:false,
      geofenceType: this.farmDetails.farmType || "POLYGON",
      polygonPoints: 0,
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
      geofenceRadius: 0,
      farmGeofenceType: [
        {
          label: this.$t("deforestation.Point"),
          value: "POINT",
        },
        {
          label: this.$t("deforestation.Polygon"),
          value: "POLYGON",
        },
      ],
      countries: [],
    };
  },

  computed: {
    countryName() {
      const countryId = this.farmDetails.farm.userAssoc.countryId;
      const country = this.countries.find(
        (country) => country.code === countryId
      );
      return country ? country.name : "";
    },
  },
  async mounted() {
    await this.getCountries();

    this.geofenceType = this.farmDetails?.farmType.toUpperCase();
    this.area = this.farmDetails?.farm?.area ?? 0;
    this.address = this.farmDetails?.farm?.address ?? "";

    if (this.farmDetails?.farmType) {
      this.geofenceType =
        this.farmDetails?.farmType.toUpperCase() === "POLYGON"
          ? "POLYGON"
          : "POINT";
    }
    if (this.farmDetails?.farmType.toUpperCase() === "POINT") {
      if (this.farmDetails?.farm?.GeoFences) {
        const {
          geofenceCenterLat: centerLatitude,
          geofenceCenterLog: centerLongitude,
          geofenceRadius: geofenceRadius,
        } = this.farmDetails?.farm?.GeoFences[0];
        this.latitude = centerLatitude;
        this.longitude = centerLongitude;
        this.geofenceRadius = parseFloat(geofenceRadius);
        this.mapOptions.center = {
          lat: parseFloat(centerLatitude),
          lng: parseFloat(centerLongitude),
        };
      }
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
    }
    await this.loadGoogleMaps();
  },
  watch: {},
  methods: {
    dismissEditGeoLocationModal(){
      this.showEditGeofenceMap = false;
    },

    saveEditGeoLocationModal(){
      // close view geolocation modal
      this.$emit("closeViewGeoLocationModal");
    },
    editGeofenceMap(){
      this.showEditGeofenceMap = true;
    },
    async getCountries() {
      const data = await FarmService.loadCountries();
      this.countries = data.data;
    },
    async loadGoogleMaps() {
      try {
        const loader = getGoogleMapsLoader();
        const google = await loader.load();
        await this.initializeMap(google);
        setTimeout(() => {
          if (this.farmDetails?.farmType.toUpperCase() === "POINT") {
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
              this.createMarker();
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
      this.createMarkerArray(this.parentPolygonCoords);
      this.polygon.setMap(this.map);
      await this.changeAreaUnit();
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
          lat: parseFloat(this.latitude),
          lng: parseFloat(this.longitude),
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

    cancel() {
      this.$emit("closeViewGeoLocationModal");
    },

    async save() {
      this.$emit("saveViewGeoLocation");
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
