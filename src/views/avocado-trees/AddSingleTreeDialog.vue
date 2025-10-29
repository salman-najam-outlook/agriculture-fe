<template>
  <v-container>
    <template>
      <div>
        <v-dialog v-if="dialogI" v-model="dialog" width="60%" @click:outside="closeModal" :retain-focus="false">
          <v-card class="custom-card" rounded="0">
            <v-toolbar color="primary" class="white--text">
              <v-toolbar-title v-if="tree.id" class="font-weight-bold">
                {{ $t("oma.editTreeGeolocation") }}
              </v-toolbar-title>
              <v-toolbar-title v-else class="font-weight-bold">
                {{ $t("oma.addTreeGeolocation") }}
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon class="white--text" @click="closeModal">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-form class="pa-4" @submit.prevent="addNewTree" ref="addNewTree" lazy-validation autocomplete="off">
              <v-card-text class="black--text">
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <label for="text">
                      {{ $t("farm.farmName") }}
                    </label>
                    <v-text-field disabled v-model="farm.farmName" :placeholder="$t('farm.nameOfTheFarm')" outlined
                      dense required :error-messages="errors.farmName" :rules="farmRules.farmName"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <label for="text">
                      {{ $t("farmerName") }}
                    </label>
                    <v-text-field disabled v-model="farm.farmerFirstName" :placeholder="$t('farmerName')" outlined dense
                      required :error-messages="errors.farmerName" :rules="farmRules.farmerName"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4" class="pr-1">
                    <label for="farmsize">{{ $t("farm.totalFarmSize") }} </label>
                    <v-tooltip top color="black" max-width="220">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on">
                          mdi-information-outline
                        </v-icon>
                      </template>
                      <span>{{ $t("farm.totalFarmSizeInfo") }}</span>
                    </v-tooltip>
                    <v-row class="d-flex" no-gutters>
                      <v-col cols="8">
                        <v-text-field outlined disabled dense :placeholder="$t(`${convertSizeIntoBaseUnit(farm.area)}`)"
                          :rules="farmRules.farmSize">
                        </v-text-field>
                      </v-col>
                      <!-- <v-col cols="4">
                          <v-btn
                            elevation="0"
                            dense
                            block
                            style="margin-left: -1px;height:40px;"
                            color="primary"
                            class="rounded-l-0 report-btn"
                            >{{ $t("Hectare") }}</v-btn
                          >
                        </v-col> -->
                    </v-row>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <label for="text">
                      {{ $t("oma.treeId") }}
                    </label>
                    <v-text-field v-model="tree.clientTreeId" :placeholder="$t('oma.treeId')" outlined dense required
                      :error-messages="errors.clientTreeId" :rules="rules.clientTreeId"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <label for="text">
                      {{ $t("oma.treeName") }}
                    </label>
                    <v-text-field v-model="tree.treeName" :placeholder="$t('oma.treeName')" outlined dense required
                      :error-messages="errors.treeName" :rules="rules.treeName"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <label>{{ $t("oma.plantationDate") }}
                      <v-tooltip right color="black" max-width="320">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on">mdi-help-circle-outline</v-icon>
                        </template>
                        <span>{{
          $t("date")
        }}</span>
                      </v-tooltip></label>
                    <v-menu ref="menu" v-model="menu" :close-on-content-click="false" dense
                      transition="scale-transition" offset-y min-width="auto">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="tree.plantationDate" placeholder="Choose the date"
                          append-icon="mdi-calendar" outlined readonly dense v-bind="attrs" v-on="on"
                          v-on:click:append="menu = true" :error-messages="errors.placeResultData"
                          :rules="rules.plantationDate">
                        </v-text-field>
                      </template>
                      <v-date-picker v-model="tree.plantationDate" no-title scrollabel
                        :min="new Date().toISOString().substr(0, 10)">
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="menu = false">
                          {{ $t("farm.cancel") }}
                        </v-btn>
                        <v-btn text color="primary" @click="$refs.menu.save(tree.plantationDate)">
                          {{ $t("farm.ok") }}
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <label for="text">
                      {{ $t("latitude") }}
                    </label>
                    <v-text-field v-model="tree.latitude" :placeholder="$t('farm.latitude')" outlined dense required
                      :error-messages="errors.latitude" :rules="farmRules.latitude"></v-text-field>
                    <label for="text">
                      {{ $t("longitude") }}
                    </label>
                    <v-text-field v-model="tree.longitude" :placeholder="$t('farm.longitude')" outlined dense required
                      :error-messages="errors.longitude" :rules="rules.longitude"></v-text-field>
                    <label for="text">
                      {{ $t("oma.altitude") }}
                    </label>
                    <v-text-field type="number" v-model="tree.altitude" :placeholder="$t('oma.altitude')" outlined dense required
                      :error-messages="errors.name" :rules="rules.altitude"></v-text-field>
                    <label for="autoLogOff" class="text-subtitle-1">
                      {{ this.$t('oma.notes') }}
                    </label>
                    <v-textarea :rules="rules.notes" v-model="tree.notes" placeholder="Type here" outlined></v-textarea>
                  </v-col>
                  <v-col cols="12" sm="6" md="8">
                    <div>
                      <div class="google-map" style="width:100%;height:50vh; z-index: 1000;" id="map" ref="googleMap">
                      </div>
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <label for="text">
                      {{ $t("oma.uploadTreeImages") }}
                    </label>
                    <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions" 
                      v-on:vdropzone-file-added="fileAdded" v-on:vdropzone-success="fileSuccess"
                      v-on:vdropzone-removed-file="fileRemovedHandler"
                      ></vue-dropzone>
                  </v-col>
                </v-row>
                <v-card-actions class="mt-10" style="padding-right: 0">
                  <v-spacer></v-spacer>
                  <v-btn outlined class="mr-2" right height="44" width="116" depressed color="primary"
                    @click="closeModal">
                    {{ $t("cancel") }}
                  </v-btn>

                  <!-- @click="selectedTree.id ? editTree() : addNewTree()" -->
                  <v-btn right type="submit" class="px-4" color="primary">
                    {{ $t("Submit") }}
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-form>
          </v-card>
        </v-dialog>
      </div>
    </template>
    <!-- <survey-date-selector :dialog="toggleDateSelector" :defaultDate="currentDate" :startDate="tree.scheduledDate"
      @closeDialog="toggleDateSelector = false" @setDate="setScheduleDate" /> -->
    <!-- <SelectSurveyUsersDialog v-if="showSelectSurveyUsersDialog" :dialogI="showSelectSurveyUsersDialog"
      :preCondition="preCondition" :selectedUsers="survey.surveySelectedUsers"
      @closeDialog="showSelectSurveyUsersDialog = false" @userSelected="onUserSelected" /> -->
  </v-container>
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import AvocadoTreesService from "@/_services/AvocadoTreesService";
// import SelectSurveyUsersDialog from "./SelectSurveyUsersDialog.vue";
// import SurveyDateSelector from './SurveyDateSelector.vue';
// import moment from "moment";
import { farmRules } from "@/validations/FarmFormRules.js";
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import { Point, Polygon } from '@flatten-js/core';
import { convertSizeIntoBaseUnit } from "@/utils.js"
import { getGoogleMapsLoader } from '@/mixins/GoogleMapLoaderSingleton';

export default {
  data() {
    return {
      treeImagesArr: [],
      // showSelectSurveyUsersDialog: false,
      preCondition: {},
      toggleDateSelector: false,
      mode: 'start',
      currentDate: '',
      loadingUsers: false,
      tree: {
        farmName: "",
        farmerName: "",
        area: "",
        clientTreeId: "",
        id: "",
        treeName: "",
        plantationDate: "",
        altitude: "",
        notes: "",
        latitude: 0,
        longitude: 0,
        images: null
      },
      menu: '',
      errors: {
        name: "",
        farmType: "",
        farmownershipType: "",
        ownerName: "",
        govRegistrationNo: "",
        contractMating: "",
        productionSystemOptId: "",
        regulatorRepName: "",
        cooperativeID: "",
        licenceNumber: "",
        licenceED: "",
        regulatorName: "",
        lat: "",
        log: "",
        clientTreeId: "",
      },
      farmRules,
      rules: {
        title: [
          v => !!v || this.$t('errors.required'),
          v => (v && v.length < 100) || this.$t("surveyBuilder.surveyTitleLength"),
        ],
        // description: [
        //   v => !!v || this.$t('errors.required')
        // ]
      },
      dropzoneOptions: {
            url: process.env.VUE_APP_BASE_URL.replace("/admin", "") + '/tree-management/uploadSingleTreeImage',
            thumbnailWidth: 200,
            addRemoveLinks: true,
            autoProcessQueue: true,
            paramName: 'treesFile',
           // headers: {
          //   'oauth-token': this.$store.getters.getAuthToken,
          // }
          },
      awss3: {
        signingURL: 'https://dimitra-public-images.s3.amazonaws.com/oma',
        headers: {},
        params: {},
        sendFileToServer: true,
        withCredentials: false
      },
      geofenceCategories: [
        {
          text: "Farm",
          value: "Farm"
        },
        {
          text: "Planted Forest",
          value: "Planted Forest"
        },
        {
          text: "Crop Land",
          value: "Crop Land"
        }
      ],
      farmGeofenceCategory: "",
      farmGeofenceName: "",
      selectedMarkerIndex: 0,
      markersArray: [],
      addressData: null,
      snackbar: false,
      locationEnabled: true,
      areainMeter: 0,
      perimeterInMeter: 0,
      areaUnit: 2,
      area: 0,
      perimeter: 0,
      address: '',
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
      subPolygon: null,
      mapOptions: {
        mapTypeId: 'satellite',
        center: {
        },
        zoom: 18,
        disableDefaultUI: true,
        zoomControl: true,
      },
      breadcrumbs: [
        {
          text: 'Dashboard',
          disabled: false,
          to: '/',
        },
        {
          text: 'Geofence',
          disabled: true,
        },
      ],
      isCrossover: false
    }

  },
  components: {
    // SelectSurveyUsersDialog,
    // SurveyDateSelector,
    vueDropzone: vue2Dropzone,
  },
  computed: {
    dialog() {
      return this.dialogI;
    },
    disableStatus() {
      return !this.tree.id;
    },
    areaToShow() {
      return this.area + ' ' + (this.areaUnit == 1 ? 'A' : 'H')
    },
    perimeterToShow() {
      return this.perimeter + ' ' + (this.areaUnit == 1 ? 'ft' : 'M')
    },
    geofenceNameRules() {
      return [
        v => !!v || 'Geofence Name is required',
        v => (v && v.length <= 20) || 'Geofence Name must be less than 20 characters',
        v => (!v || !/\d/.test(v)) || 'Geofence Name must not contain numbers',
      ];
    },
  },
  props: {
    dialogI: {
      type: Boolean,
      required: true,
    },
    updateData: {},
    farm: {
      type: Object,
      required: true,
    },
    zone: {
      type: Number
    },
    selectedTree: {
      type: Object
    },
  },
  async mounted() {
    try {
      if (this.$props.selectedTree) {
        this.tree = this.$props.selectedTree
      }
      
      if (this.farm) {
        const currentAreaUnit = JSON.parse(localStorage.getItem('gs'))?.areaUnit;

        this.address = this.farm.address || '';
        this.areaUnit = this.farm.areaUomId ?? 2;
        if (currentAreaUnit && currentAreaUnit.abbvr == "ha") {
          this.area = parseFloat(this.farm.area / currentAreaUnit.factor).toFixed(5)
          this.perimeter = parseFloat(this.farm.parameter / 3.28084).toFixed(5)
          this.areaUnit = 2;
        } else {
          this.area = this.farm.area;
          this.perimeter = this.farm.parameter;
        }
        this.farmGeofenceName = this.farm.farmGeofenceName
        this.farmGeofenceCategory = this.farm.farmGeofenceCategory
      }

      var codes = [];
      if (this.farm) {
        if (this.farm.FarmCoordinates && this.farm.FarmCoordinates.length > 0) {
          codes = this.farm.FarmCoordinates.map(function (elm) {
            return { lat: parseFloat(elm['lat']), lng: parseFloat(elm['log']) };
          });
        }
        if (this.farm.coordinates && this.farm.coordinates.length > 0) {
          codes = this.farm.coordinates.map(function (elm) {
            return { lat: parseFloat(elm['lat']), lng: parseFloat(elm['log']) };
          });
        }
        this.parentPolygonCoords = codes;
      }

      if (this.farm && this.farm.lat && this.farm.log) {
        this.latitude = this.farm.lat;
        this.longitude = this.farm.log;
        this.tree.latitude = this.selectedTree.latitude ? this.selectedTree.latitude : this.farm.lat;
        this.tree.longitude = this.selectedTree.longitude ? this.selectedTree.longitude : this.farm.log;
        this.mapOptions.center.lat = this.latitude;
        this.mapOptions.center.lng = this.longitude;
      } else {
        const success = (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.mapOptions.center.lat = this.latitude;
          this.mapOptions.center.lng = this.longitude;
          if (this.map) this.map.setCenter(this.mapOptions.center)
        };
        const error = (err) => {
          console.log('location', err)
          this.locationEnabled = false
          this.snackbar = true
        };

        // This will open permission popup
        navigator.geolocation.getCurrentPosition(success, error);
      }

      const loader = getGoogleMapsLoader();
      const google = await loader.load();
      await this.initializeMap(google);
      this.loader = loader;

    } catch (e) {
      console.log('Loader Error', e);
    }
  },
  methods: {
    fileRemovedHandler(file) {
          if(file?.key) {
            this.treeImagesArr = this.treeImagesArr.filter(image => image.key !== file.key);
          }
        },
        cleanFiles() {
          this.$refs.myVueDropzone.removeAllFiles();
        },
    convertSizeIntoBaseUnit,
    async addNewTree() {
      window.a = this.$refs.myVueDropzone;
      const queuedFiles = this.$refs.myVueDropzone.getQueuedFiles();
      const uploadingFiles = this.$refs.myVueDropzone.getUploadingFiles();
      console.log("asd")
      if(queuedFiles.length || uploadingFiles.length){
        this.$notify({
              title: this.$t("File is still uploading, please wait"),
              type: "error",
            });
        return
      }
      if (!this.$refs.addNewTree.validate()) return;
      if (this.selectedTree?.id) {
        this.editTree();
        return
      }

      this.startLoading();

      this.tree.farmId = this.farm.id ?? null;
      this.tree.zoneId = this.zone ?? null;
      this.tree.images = this.treeImagesArr
      // this.$emit("emitNewTree");
      await AvocadoTreesService.addNewTree(this.tree)
        .then((res) => {
          if (res.success == true) {
            this.stopLoading();
            this.closeModal();
            this.$emit("emitNewTree");
          } else {
            this.stopLoading();
            this.$notify({
              title: res.message.errors[0].msg,
              type: "error",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.stopLoading();
          this.closeModal();
        });
    },
    async openUsersDialog() {

    },
    editTree() {
      if (!this.$refs.addNewTree.validate()) return;
      this.startLoading();
      this.tree.farmId = this.farm.id ?? null;
      this.tree.zoneId = this.zone ?? null;
      this.tree.imagesToInsert = this.treeImagesArr
      AvocadoTreesService.updateTree(this.tree)
        .then(() => {
          this.stopLoading();
          this.closeModal();
          this.$emit("emitNewTree");
        })
        .catch((err) => {
          this.stopLoading();
          console.log(err);
        });
    },

    deleteSelectedVertex() {
      this.parentPolygonCoords.pop()
      this.createPolygon()
    },
    changeAreaUnitM() {
      if (this.areaUnit === 1) {
        this.area = parseFloat(this.area * 2.47105).toFixed(5)
        this.perimeter = parseFloat(this.perimeter * 3.28084).toFixed(5)
      } else {
        this.area = parseFloat(this.area / 2.47105).toFixed(5)
        this.perimeter = parseFloat(this.perimeter / 3.28084).toFixed(5)
      }
    },
    closeWithoutChange() {
      this.$emit('close-without-change');
    },
    async changeAreaUnit() {
      let d = await this.polygon.getPath()
      const path = [];
      for (let i = 0; i < d.getLength(); i++) {
        const xy = d.getAt(i);
        let x = xy.lat();
        let y = xy.lng();
        path.push({ lat: x, lng: y });
      }

      this.areainMeter = await this.google.maps.geometry.spherical.computeArea(path);
      path.push({ ...path[0] })
      this.perimeterInMeter = await this.google.maps.geometry.spherical.computeLength(path);
      this.area = parseFloat(this.areainMeter / (this.areaUnit === 1 ? 4046.86 : 10000)).toFixed(5)
      this.perimeter = this.areaUnit === 1 ? parseFloat(this.perimeterInMeter * 3.28084).toFixed(5) : parseFloat(this.perimeterInMeter).toFixed(5)
      // console.log('aa', this.area, this.perimeter)
      return Promise.resolve(true)
    },
    async gotoCurrentLocation() {
      const success = (position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
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

      navigator.geolocation.getCurrentPosition(success, error);
    },
    removeGeofence() {
      this.removeExistingMarkers()
      if (this.polygon != null) this.polygon.setMap(null);
      // this.parentPolygonCoordsBk = [];
      this.parentPolygonCoords = [];
      this.perimeter = 0
      this.area = 0
    },

    undoGeofence() {
      this.parentPolygonCoords.pop();
      this.createPolygon()
    },

    setPlace(addressData, placeResultData) {
      const latLng = { lat: placeResultData.geometry.location.lat(), lng: placeResultData.geometry.location.lng() };
      this.map.setCenter(latLng)
      this.latitude = latLng.lat;
      this.longitude = latLng.lng;
      this.address = placeResultData.formatted_address
      this.addressData = addressData;
      this.createMarker();
    },
    createMarker() {
      if (this.marker != null) this.marker.setMap(null);
      const latLng = { lat: this.latitude, lng: this.longitude };
      this.tree = { ...this.tree, latitude: this.latitude };
      this.tree = { ...this.tree, longitude: this.longitude };
      this.marker = new this.google.maps.Marker({
        position: latLng,
        draggable: true,
      });

      // To add the marker to the map, call setMap();
      this.marker.setMap(this.map);
      this.marker.addListener('dragend', this.handleDragEvent);
    },
    handleDragEvent(event) {
      this.latitude = event.latLng.lat()
      this.longitude = event.latLng.lng()
      this.createMarker()
    },
    createMarkerArray(latLngArray) {
      this.removeExistingMarkers()
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
          icon: (this.parentPolygonCoords.length - 1) == i ? svgMarkerRed : svgMarker,
          // draggable: true,
        });
        this.markersArray[i].addListener("click", () => {
          let firstIndex = (i + 1)
          this.parentPolygonCoords = this.reArrangeArray(firstIndex, this.parentPolygonCoords)

          this.createMarkerArray(this.parentPolygonCoords)

        });
        this.markersArray[i].addListener('dragend', () => {
          // console.log('ddd', this.parentPolygonCoords)
          var lat = this.markersArray[i].getPosition().lat();
          var lng = this.markersArray[i].getPosition().lng();
          this.parentPolygonCoords[i] = { lat, lng }
          this.createPolygon()
        });

      })
    },
    reArrangeArray(firstIndex = 0, arr) {
      var a = [];
      var b = []
      for (let i = 0; i <= (arr.length - 1); i++) {
        if (i < firstIndex) {
          a.push(arr[i])
        } else {
          b.push(arr[i])
        }
      }
      return b.concat(a)
    },

    removeExistingMarkers() {
      for (let i = 0; i < this.markersArray.length; i++) {
        this.markersArray[i].setMap(null);
      }
      this.markersArray = []
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
        sgt.push(new Point(x, y))
      }
      const ss = new Polygon(sgt);

      return new Promise((resolve) => {
        if (!ss.isValid()) {
          resolve(true)
        } else {
          resolve(false)
        }
      })
    },
    async saveGeoFence() {
      if (!this.$refs.geofenceNameField.validate()) {
        this.$notify({
          title: "Geofence name is required.",
          type: "error",
        });
        return
      }
      // this.$refs.geofenceNameField.validate()

      localStorage.setItem('geofence_zoom', this.map.getZoom())
      if (await this.checkPolygonCrossover()) {
        this.$notify({
          title: "No crossover allowed.",
          type: "error",
        });
      } else {
        if (this.address == '') {
          this.$notify({
            title: "Location is required.",
            type: "error",
          });
          return
        }
        // this.startGeoFence = false;
        this.parentPolygonCoords = [];
        // this.polygon.setEditable(false);
        var updated = [];
        const vertices = this.polygon.getPath();

        for (let i = 0; i < vertices.getLength(); i++) {
          const xy = vertices.getAt(i);
          updated.push({ lat: xy.lat(), lng: xy.lng() });
        }

        this.parentPolygonCoords = updated;
        // const area =  await this.google.maps.geometry.spherical.computeArea(this.polygon.getPath());
        var coodinates = this.parentPolygonCoords.map(function (elm) {
          return { lat: `${elm['lat']}`, log: `${elm['lng']}` };
        });

        var id = '';
        var geofenceId = null;

        if (this.farm && this.farm.id) {
          id = parseInt(this.farm.id);
          geofenceId = this.farm.geofenceId;
        }

        const gdata = {
          id: id,
          lat: this.latitude,
          log: this.longitude,
          farmGeofence: coodinates,
          address: this.address,
          area: parseFloat(this.area),
          parameter: parseInt(this.perimeter),
          areaUomId: this.areaUnit,
          addressData: this.addressData,
          geofenceId: geofenceId,
          farmGeofenceName: this.farmGeofenceName,
          farmGeofenceCategory: this.farmGeofenceCategory
        }

        this.closeModal(gdata);
      }
    },

    async createPolygon() {
      // this.parentPolygonCoordsBk = this.parentPolygonCoords;
      if (this.polygon != null) this.polygon.setMap(null);

      this.polygon = await new this.google.maps.Polygon({
        paths: this.parentPolygonCoords,
        clickable: false,
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
      // this.area = parseFloat(area / (this.areaUnit ===1?4046.86:10000)).toFixed(5)
      return Promise.resolve(true);
    },
    async createCircle(center, radius = 0) {
      this.circle = await new this.google.maps.Circle({
        fillColor: '#FFFFFF',
        fillOpacity: 0.2,
        strokeWeight: 0,
        map: this.map,
        center,
        radius
      });
      this.circle.setMap(this.map);
    },
    closeModal(data = null) {
      //   this.polygon.setMap(null);
      //   this.parentPolygonCoords = [];
      this.$emit('closeDialog', data);
    },
    async markerCoords() {
      const vertices = this.polygon.getPath();
      var updated = [];
      var sgt = [];

      for (let i = 0; i < vertices.getLength(); i++) {
        const xy = vertices.getAt(i);
        let x = xy.lat();
        let y = xy.lng();
        updated.push({ lat: x, lng: y });
        sgt.push(new Point(x, y))
      }

      const ss = new Polygon(sgt);
      // console.log('isvalid',ss.isValid())
      // if(!ss.isValid()){
      //     if(type == 'set_at'){
      //         updated[e] = this.parentPolygonCoordsBk[e];
      //     }else{
      //         updated.splice(e, 1);
      //     }
      //     this.$notify({
      //         title: "No crossover allowed.",
      //         type: "error",
      //     });
      // }else{
      //     // let d = await this.polygon.getPath().Wc
      //     // this.areainMeter =  await this.google.maps.geometry.spherical.computeArea(d).toFixed(5);
      //     // this.perimeterInMeter = await this.google.maps.geometry.spherical.computeLength(d);
      //     // this.perimeter = parseFloat(this.perimeterInMeter).toFixed(5)
      //     // console.log('path', d)
      //     await this.changeAreaUnit();
      //     // this.area = parseFloat(area / (this.areaUnit ===1?4046.86:10000)).toFixed(5)
      // }

      if (!ss.isValid()) {
        this.isCrossover = true
      } else {
        this.isCrossover = false
        await this.changeAreaUnit();
      }

      this.parentPolygonCoords = updated;
      this.createPolygon();
    },

    async initializeMap(google) {
      this.google = google;
      const mapContainer = this.$refs.googleMap
      this.map = await new google.maps.Map(mapContainer, this.mapOptions);

      this.map.addListener("click", async (mapsMouseEvent) => {
        // if (!this.startGeoFence) {
        const latLng = mapsMouseEvent.latLng.toJSON();
        // this.parentPolygonCoords.push(latLng);
        // this.parentPolygonCoords.splice((Number(this.selectedMarkerIndex)+1), 0, latLng);
        // this.createPolygon();
        const geocoder = new this.google.maps.Geocoder();
        geocoder
          .geocode({ location: latLng })
          .then((response) => {
            if (response.results[0]) {
              this.latitude = latLng.lat;
              this.tree.latitude = latLng.lat;
              this.tree.longitude = latLng.lng;
              this.longitude = latLng.lng;
              this.address = response.results[0].formatted_address;
              this.createMarker();
              this.$forceUpdate();
            } else {
              window.alert("No results found");
            }
          })
          .catch((e) => window.alert("Can't fetch location due to: " + e));

        // }
      });
      
      if (this.farm.segments.length > 0 && this.farm.segments[0].geofenceRadius) {
        const farmSegment = this.farm.segments[0];
        await this.createCircle(
          {
            lat: farmSegment.geofenceCenterLat,
            lng: farmSegment.geofenceCenterLog
          },
          farmSegment.geofenceRadius
        );
      } else {
        this.createPolygon();
      }

      this.map.addListener("click", async (mapsMouseEvent) => {
        // if (!this.startGeoFence) {
        const latLng = mapsMouseEvent.latLng.toJSON();
        // this.parentPolygonCoords.push(latLng);
        // this.parentPolygonCoords.splice((Number(this.selectedMarkerIndex)+1), 0, latLng);
        // this.createPolygon();
        const geocoder = new this.google.maps.Geocoder();
        geocoder
          .geocode({ location: latLng })
          .then((response) => {
            if (response.results[0]) {
              this.latitude = latLng.lat;
              this.longitude = latLng.lng;
              console.log(this.tree.longitude, this.tree.latitude)
              this.address = response.results[0].formatted_address;
              this.createMarker();
            } else {
              window.alert("No results found");
            }
          })
          .catch((e) => window.alert("Can't fetch location due to: " + e));

        // }
      });
      this.createMarker();
    },
    s3UploadError(errorMessage) {
      this.$notify({
        title: errorMessage,
        type: "error",
      });
    },
    s3UploadSuccess(s3ObjectLocation) {
      this.$notify({
        title: s3ObjectLocation,
        type: "success",
      });
    },
    fileSuccess(file, response) {
      this.treeImagesArr.push({
        "key": response.data.key,
        "location": response.data.Location,
        "imageName": file.name,
        "timestamp": file.lastModifiedDate || new Date() //todo exif reader, get timestamp of the image uploaded
      });
    },
    async fileAdded1(file) {
      this.tree.images = []
      const formData = new FormData();
      formData.append('treesFile', file);
      let uploadRes = await AvocadoTreesService.uploadSingleTreeImage(formData)
      this.tree.images.push({
        "key": uploadRes.data.key,
        "location": uploadRes.data.Location,
        "imageName": file.name,
        "timestamp": file.lastModifiedDate ||new Date() //todo exif reader, get timestamp of the image uploaded
      })
    },
    async fileAdded(file){
        try {
          if(file.isUploaded) {
            this.treeImagesArr.push({
              key: file.key,
              location: file.location,
              imageName: file.name,
              timestamp: file.timestamp,
            })
          }
        } catch (error) {
          console.log(error);
          this.stopLoading();
        }
      },
  },
  mixins: [loadingMixin],
};
</script>

<style></style>