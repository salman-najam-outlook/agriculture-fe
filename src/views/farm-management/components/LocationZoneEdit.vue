<template>
     <v-dialog v-model="dialog" persistent max-width="75vw">
    <v-card flat>
      <v-toolbar flat color="secondary">
        <v-toolbar-title class="white--text">
          {{$t('farm.zoneDetails')}}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon class="white--text" @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid>
        <v-container>
          <v-row class="d-flex">
            <v-col cols="3">
              <v-form ref="form">
                <div class="text-h5 black--text font-weight-bold">{{$t('farm.editZone')}}</div>
                <div class="mt-4 subtitle-1 black--text">{{$t('farm.nameOfTheZone')}}</div>
                <v-text-field outlined dense v-model="geofenceName" :rules="rules.geofenceName"></v-text-field>

                <div class="text-h5 black--text font-weight-bold">
                  {{$t('farm.zoneDetails')}}
                </div>

                <div class="subtitle-1 black--text mt-2">{{$t('farm.address')}}</div>
                <!-- <gmap-autocomplete readonly :value="address" @place_changed="setPlace" ></gmap-autocomplete> -->
                <vue-google-autocomplete id="mapplace" :value="address" classname="form-control"
                  placeholder="Search Location" v-on:placechanged="setPlace"></vue-google-autocomplete>

                <div class="mt-2 subtitle-1 black--text">{{$t('farm.perimeter')}}</div>
                <v-text-field v-model="perimeterToShow" outlined dense readonly></v-text-field>

                <div class="subtitle-1 mt-n5 black--text">{{$t('farm.area')}}</div>
                <v-text-field v-model="areaToShow" outlined dense readonly></v-text-field>
                <div class="subtitle-1 black--text">{{$t('farm.areaUnit')}}</div>
                <v-select v-model="areaUnit" outlined dense item-text="name" item-value="id" :items="[
                  { id: 1, name: 'Acre' },
                  { id: 2, name: 'Hectare' },
                ]" @change="changeAreaUnitM"></v-select>

                <!-- <v-btn @click="startGeoFenceTool" block color="primary" class="mt-5" depressed :disabled="startGeoFence">Add Subsection</v-btn> -->
                <v-btn @click="closeModal" block color="primary" class="mt-5" depressed>{{$t('cancel')}}</v-btn>
              </v-form>
            </v-col>
            <v-col cols="9">
              <div class="" style="width:100%;height:540px;">
                <v-card class="ml-10" flat style="width:60%; z-index: 1;margin-top: 10px;position:absolute;">
                  <v-card-text class="py-2">
                    <v-row class="d-flex space-between">
                      <v-col cols="6" class="text-left pl-5"> {{$t('farm.perimeter')}}: {{ perimeterToShow }}</v-col>
                      <v-col cols="6" class="text-right pr-5"> {{$t('farm.area')}}: {{ areaToShow }}</v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
                <div class="google-map" style="width: 100%; height: 78vh" id="map" ref="googleMap"></div>
                <div class="">
                  <v-tooltip left>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn class="mx-2 float-right mt-n20" fab small color="white" style="margin-top: -25rem;"
                        @click="removeGeofence" v-bind="attrs" v-on="on">
                        <v-icon dark color="gray">
                          mdi-delete-sweep
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Clear Geofence</span>
                  </v-tooltip>
                  <v-tooltip left>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn class="mx-2 float-right" fab dark small color="white" style="margin-top: -22rem;"
                        v-bind="attrs" v-on="on" @click="deleteSelectedVertex">
                        <v-icon dark color="gray">
                          mdi-trash-can-outline
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Delete Selected Vertex</span>
                  </v-tooltip>
                </div>
                <div class="d-flex justify-center mt-n12">
                  <v-btn v-if="(startGeoFence && subPolygonCoords.length >= 3)" @click="saveGeoFence" width="200"
                    color="primary" class="" depressed>Save</v-btn>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-container>
      <prompt-dialog @closeDialog="showPromptDialog = false" @saveData="saveFormData" :dialogI="showPromptDialog"
        v-if="showPromptDialog" />
    </v-card>
  </v-dialog>
  </template>
  <script>
  /* eslint-disable */
  import FarmService from "@/_services/FarmService";
  import loadingMixin from "@/mixins/LoadingMixin";
  import _ from "lodash";
  import { Point, Polygon } from "@flatten-js/core";
  import VueGoogleAutocomplete from "vue-google-autocomplete";
  // import gql from "graphql-tag";
  import PromptDialog from "../../common/PromptDialog.vue";
import { getGoogleMapsLoader } from '@/mixins/GoogleMapLoaderSingleton';
  
  export default {
    components: {
      "prompt-dialog": PromptDialog,
      VueGoogleAutocomplete,
    },
    async mounted() {
      this.startLoading();
  
      if(this.popup) {
          let farmLocationRes= await FarmService.getFarmLocation(this.locationId);
          this.location = farmLocationRes;
          const zoneData = await FarmService.getZoneGeofence(+this.zoneId);
          this.latitude = this.location.lat;
          this.longitude = this.location.log;
          this.address = this.location.address;
          this.areaUnit = this.location.areaUomId;
          console.log(this.location, "this.location")
          var codes = this.location.mainGeofence?.geofence_coordinates.map(function (elm) {
            return { lat: parseFloat(elm["lat"]), lng: parseFloat(elm["log"]) };
          });
          this.parentPolygonCoords = codes;
          let segment = zoneData ? zoneData : _.find(this.location.mainGeofence, { id: this.zoneId });
          if (!segment) return this.$router.push({ name: "My farm" });
          this.editedSegment = segment;
          this.mapOptions.center.lat = +segment.geofence_coordinates[0].lat;
          this.mapOptions.center.lng = +segment.geofence_coordinates[0].log;
          this.geofenceName = segment.geofenceName;
          this.geofenceParameter = segment.geofenceParameter;
          this.address = this.location.address;
          this.area = segment.geofenceArea;
          var cc = segment.geofence_coordinates.map((elm) => {
            return { lat: parseFloat(elm["lat"]), lng: parseFloat(elm["log"]) };
          });
          this.subPolygonCoords = cc;
          this.stopLoading();
      } else {
          FarmService.getFarm(this.$route.query.farmId || this.farmId).then(async (data) => {
            this.orgFarm = data;
            console.log("sjflskdj", this.orgFarm);
            this.latitude = this.orgFarm.lat;
            this.longitude = this.orgFarm.log;
            this.address = this.orgFarm.address;
            this.mapOptions.center.lat = this.latitude;
            this.mapOptions.center.lng = this.longitude;
            this.areaUnit = this.orgFarm.areaUomId ?? 1;
            var codes = this.orgFarm.coordinates.map(function (elm) {
              return { lat: parseFloat(elm["lat"]), lng: parseFloat(elm["log"]) };
            });
            this.parentPolygonCoords = codes;
            let segment = _.find(this.orgFarm.segments, { id: parseInt(this.$route.params.id) });
            console.log({segment},this.orgFarm.segments,this.$route.params.id);
            // if (!segment) return this.$router.push({ name: "EditFarms",params: {farmId: this.$route.query.farmId }});
            this.editedSegment = segment;
            this.geofenceName = segment.geofenceName;
            this.geofenceParameter = segment.geofenceParameter;
            this.address = this.orgFarm.address;
            this.area = segment.geofenceArea;
            var cc = segment.coordinates.map((elm) => {
              return { lat: parseFloat(elm["lat"]), lng: parseFloat(elm["log"]) };
            });
            this.subPolygonCoords = cc;
          });
      }
  
      
      this.stopLoading();
  
      try {
      const loader = getGoogleMapsLoader();
      const google = await loader.load();
      await this.initializeMap(google);
      this.loader = loader;
    } catch (e) {
      console.log('error',e);
    }
    },
    props: {
      dialog: {
        type: Boolean,
      },
      showMap: {
        type: Boolean,
        require: true,
      },
      popup: {
        type: Boolean
      },
      farmId: {
        type: Number,
      },
      locationId: {
        type: Number,
      },
      zoneId: {
        type: Number,
      },
    },
    computed: {
      hasChanged() {
        return true;
      },
      areaToShow() {
        return this.area + ' ' + (this.areaUnit == 1 ? 'A' : 'H')
      },
      perimeterToShow() {
        return this.geofenceParameter + ' ' + (this.areaUnit == 1 ? 'ft' : 'M')
      }
    },
    beforeRouteLeave(to, from, next) {
      if (this.promptNextRoute) {
        next();
      } else {
        if (this.hasChanged) {
          this.promptToRoute = to;
          this.showPromptDialog = true;
        } else {
          next();
        }
      }
    },
    data() {
      return {
        markersArray: [],
        areaUnit: 2,
        rules: {
          geofenceName: [(v) => !!v || "Name is required"],
        },
        editedSegment: {},
        oldSegments: null,
        geofenceName: "",
        geofenceParameter: 0,
        address: "",
        area: 0,
        orgFarm: {},
        startGeoFence: false,
        parentPolygonCoords: [],
        subPolygonCoords: [],
        subPolygonCoordsBk: [],
        loader: null,
        latitude: 0,
        longitude: 0,
        google: null,
        map: null,
        marker: null,
        polygon: null,
        subPolygon: null,
        mapOptions: {
          mapTypeId: "satellite",
          center: {
            lat: -34.397,
            lng: 150.644,
          },
          zoom: 18,
          disableDefaultUI: true,
        },
        breadcrumbs: [
          {
            text: "Dashboard",
            disabled: false,
            to: "/",
          },
          {
            text: "Farm",
            disabled: true,
          },
          {
            text: "Zone",
            disabled: true,
          },
        ],
        showPromptDialog: false,
        promptToRoute: null,
        promptNextRoute: false,
        defaultData: {},
        isCrossover: false
      };
    },
  
    methods: {
        reArrangeArray(firstIndex = 0, arr) {
      var a = [];
      var b = [];
      for (let i = 0; i <= (arr.length - 1); i++) {
        if (i < firstIndex) {
          a.push(arr[i]);
        } else {
          b.push(arr[i]);
        }
      }
      return b.concat(a);
    },
    removeExistingMarkers() {
      for (let i = 0; i < this.markersArray.length; i++) {
        this.markersArray[i].setMap(null);
      }
      this.markersArray = [];
    },
    removeGeofence() {
      this.removeExistingMarkers();
      if (this.subPolygon != null) this.subPolygon.setMap(null);
      // this.subPolygonCoordsBk = [];
      this.subPolygonCoords = [];
      this.perimeter = 0;
      this.area = 0;
    },
    deleteSelectedVertex() {
      this.subPolygonCoords.pop();
      this.createPolygon();
    },
    closeModal() {
    this.$emit("editZone", null, false);
    },
      saveFormData(answer) {
        this.showPromptDialog = false;
        if (!answer) {
          this.promptNextRoute = true;
          this.$router.push(this.promptToRoute);
        }
      },
      changeAreaUnitM() {
        if (this.areaUnit === 1) {
          this.area = parseFloat(this.area * 2.47105).toFixed(5);
          this.geofenceParameter = parseFloat(
            this.geofenceParameter * 3.28084
          ).toFixed(5);
        } else {
          this.area = parseFloat(this.area / 2.47105).toFixed(5);
          this.geofenceParameter = parseFloat(
            this.geofenceParameter / 3.28084
          ).toFixed(5);
        }
      },
      async changeAreaUnit() {
        // let d = await this.subPolygon.getPath().Vc
        // const path = [];
        // d.forEach((e) => {
        //   // console.log('path', e.lat())
        //   path.push({ lat: e.lat(), lng: e.lng() })
        //   // if (idx === d.length - 1){ 
        //   //     path.push({...path[0]})
        //   // }
        // })
        this.areainMeter = await this.google.maps.geometry.spherical.computeArea(this.subPolygon.getPath());
        // path.push({ ...path[0] })
        this.perimeterInMeter = await this.google.maps.geometry.spherical.computeLength(this.subPolygon.getPath());
        this.area = parseFloat(
          this.areainMeter / (this.areaUnit === 1 ? 4046.86 : 10000)
        ).toFixed(5);
        this.geofenceParameter =
          this.areaUnit === 1
            ? parseFloat(this.perimeterInMeter * 3.28084).toFixed(5)
            : parseFloat(this.perimeterInMeter).toFixed(5);
      },
      setPlace(place, ac) {
        console.log("place", place, ac);
        const latLng = {
          lat: ac.geometry.location.lat(),
          lng: ac.geometry.location.lng(),
        };
        this.map.setCenter(latLng);
        this.latitude = latLng.lat;
        this.longitude = latLng.lng;
        // console.log('set place', latLng)
      },
      async saveGeoFence() {
        if (this.isCrossover) {
          this.$notify({
            title: "No crossover allowed.",
            type: "error",
          });
        } else {
          if (!this.$refs.form.validate()) return;
          this.startGeoFence = false;
          this.subPolygonCoords = [];
          this.subPolygon.setEditable(false);
          var updated = [];
          // var coor= [];
          const vertices = this.subPolygon.getPath();
          for (let i = 0; i < vertices.getLength(); i++) {
            const xy = vertices.getAt(i);
            updated.push({ lat: `${xy.lat()}`, log: `${xy.lng()}` });
          }
  
          this.startLoading();
          const d = {
            id: parseInt(this.editedSegment.id),
            farmId: parseInt(this.orgFarm.id ?? this.editedSegment?.farmId),
            coordinates: updated,
            geofenceName: this.geofenceName,
            geofenceArea: parseFloat(this.area),
            geofenceAreaUOMId: this.areaUnit,
            geofenceParameter: parseFloat(this.geofenceParameter),
            geofenceParameterUOMId: this.areaUnit,
          };
  
  
          await FarmService.updateSegment(d).then((data)=>{
              console.log({data});
              this.stopLoading();
              if(data.success){
         
                       this.closeModal()
                  this.$notify({
                      title: data.message,
                      type: "success",
                  });
              }
              else{
                       this.closeModal()
                  this.stopLoading()
                  this.$notify({
                      title: "Something went wrong. Please try after sometime",
                      type: "error",
                  });
              }
          });
        }
      },
      startGeoFenceTool() {
        this.startGeoFence = true;
        this.map.addListener("click", (mapsMouseEvent) => {
          this.updatePolygon(mapsMouseEvent);
        });
        this.polygon.addListener("click", (mapsMouseEvent) => {
          this.updatePolygon(mapsMouseEvent);
        });
      },
      async updatePolygon(mapsMouseEvent) {
        const latLng = mapsMouseEvent.latLng.toJSON();
        console.log("lll", latLng);
        this.subPolygonCoords.push(latLng);
        await this.createPolygon();
        var sgt = [];
        for (let i = 0; i < this.subPolygonCoords.length; i++) {
          const xy = this.subPolygonCoords[i];
          let x = xy.lat;
          let y = xy.lng;
          sgt.push(new Point(x, y));
        }
        const ss = new Polygon(sgt);
        // if (!ss.isValid()) {
        //   setTimeout(() => {
        //     this.subPolygonCoords.pop();
        //     this.$notify({
        //       title: "No crossover allowed.",
        //       type: "error",
        //     });
        //     this.createPolygon();
        //   }, 100);
        // } else {
        //   // this.areainMeter = await this.google.maps.geometry.spherical
        //   //   .computeLength(this.subPolygon.getPath())
        //   //   .toFixed(5);
        //   // this.perimeterInMeter =
        //   //   await this.google.maps.geometry.spherical.computeLength(
        //   //     this.subPolygon.getPath()
        //   //   );
        //   // this.perimeter = parseFloat(this.perimeterInMeter).toFixed(5);
        //   this.changeAreaUnit();
        //   // this.area = parseFloat(area / (this.areaUnit ===1?4046.86:10000)).toFixed(5)
        // }
        if (!ss.isValid()) {
          this.isCrossover = true
        } else {
          this.isCrossover = false
          this.changeAreaUnit();
        }
      },
      async createPolygon() {
        // this.subPolygonCoordsBk = this.subPolygonCoords;
        if (this.subPolygon != null) this.subPolygon.setMap(null);
        this.subPolygon = new this.google.maps.Polygon({
          paths: this.subPolygonCoords,
          strokeColor: "#1F5D51",
          strokeOpacity: 0.8,
          strokeWeight: 4,
          fillColor: "#E5F8F1",
          fillOpacity: 0.7,
          editable: false,
          draggable:false,
          icon: this.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW
  
        });
        // this.google.maps.event.addListener(
        //   this.subPolygon.getPath(),
        //   "set_at",
        //   this.setAt
        // );
        // this.google.maps.event.addListener(
        //   this.subPolygon.getPath(),
        //   "insert_at",
        //   this.insertAt
        // );
        this.createMarkerArray(this.subPolygonCoords);
        this.subPolygon.setMap(this.map);
        await this.changeAreaUnit();
        return Promise.resolve(true);
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
          icon: (this.subPolygonCoords.length - 1) == i ? svgMarkerRed : svgMarker,
          draggable: true,
        });
        this.markersArray[i].addListener("click", () => {
          let firstIndex = (i + 1);
          this.subPolygonCoords = this.reArrangeArray(firstIndex, this.subPolygonCoords);
          // this.selectedMarkerIndex = i
          this.createMarkerArray(this.subPolygonCoords);
          // this.markersArray[i].setIcon(svgMarkerRed)
          // console.log('marker Index', i)
        });
        this.markersArray[i].addListener('dragend', () => {
          // console.log('ddd', this.parentPolygonCoords)
          var lat = this.markersArray[i].getPosition().lat();
          var lng = this.markersArray[i].getPosition().lng();
          this.subPolygonCoords[i] = { lat, lng };
            this.createPolygon();
            this.createMarkerArray(this.subPolygonCoords);
        });
        // this.markersArray[i].setMap(this.map);
      });
    },
      // isAnyCrossover(coordinates) {
      //     // NOTE: this currently returns a crossover coordinate or a null but could just return a true/false
      //     if (coordinates.length >= 4) {
      //         // can only have crossover if polygon length >= 4
      //         for (let i = 0; i < coordinates.length-2; i++) {
      //             for (let j = i+1; j < coordinates.length-1; j++) {
      //                 if (this.doEdgesIntersect(
      //                 coordinates[i].lat,   coordinates[i].lng,
      //                 coordinates[i+1].lat, coordinates[i+1].lng,
      //                 coordinates[j].lat,   coordinates[j].lng,
      //                 coordinates[j+1].lat, coordinates[j+1].lng)) {
      //                     return true;
      //                 }
      //                 if (this.doEdgesIntersect( // wrap around line segment
      //                 coordinates[coordinates.length-1].lat, coordinates[coordinates.length-1].lng,
      //                 coordinates[0].lat,                    coordinates[0].lng,
      //                 coordinates[j].lat,                    coordinates[j].lng,
      //                 coordinates[j+1].lat,                  coordinates[j+1].lng)) {
      //                     return true;
      //                 }
      //             }
      //         }
      //     }
      //     return false; // no crossover detected
      // },
  
      // doEdgesIntersect(a,b,c,d,p,q,r,s) {
      //     let det, gamma, lambda;
      //     det = (c - a) * (s - q) - (r - p) * (d - b);
      //     if (det === 0) {
      //         return false;
      //     } else {
      //         lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
      //         gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
      //         return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
      //     }
      // },
  
      // closeModal() {
      //   this.polygon.setMap(null);
      //   this.parentPolygonCoords = [];
      // },
  
      setAt(e) {
        this.markerCoords(e, "set_at");
      },
      insertAt(e) {
        this.markerCoords(e, "insert_at");
      },
  
      async markerCoords() {
        const vertices = this.subPolygon.getPath();
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
        // if (!ss.isValid()) {
        //   if (type == "set_at") {
        //     updated[e] = this.subPolygonCoordsBk[e];
        //   } else {
        //     updated.splice(e, 1);
        //   }
        //   this.$notify({
        //     title: "No crossover allowed.",
        //     type: "error",
        //   });
        // } else {
        //   // this.areainMeter = await this.google.maps.geometry.spherical
        //   //   .computeLength(this.subPolygon.getPath())
        //   //   .toFixed(5);
        //   // this.perimeterInMeter =
        //   //   await this.google.maps.geometry.spherical.computeLength(
        //   //     this.subPolygon.getPath()
        //   //   );
        //   // this.perimeter = parseFloat(this.perimeterInMeter).toFixed(5);
        //   this.changeAreaUnit();
        //   // this.area = parseFloat(area / (this.areaUnit ===1?4046.86:10000)).toFixed(5)
        // }
        if (!ss.isValid()) {
          this.isCrossover = true
        } else {
          this.isCrossover = false
          this.changeAreaUnit();
        }
        this.subPolygonCoords = updated;
        this.createPolygon();
      },
      createMarker() {
        if (this.marker != null) this.marker.setMap(null);
        const latLng = { lat: this.latitude, lng: this.longitude };
        this.marker = new this.google.maps.Marker({
            position: latLng,
            // title:"Hello World!"
        });
  
        // To add the marker to the map, call setMap();
        this.marker.setMap(this.map);
      },
      
      async initializeMap(google) {
        this.google = google;
        const mapContainer = this.$refs.googleMap;
  
        console.log('map',this.mapOptions)
        this.map = await new google.maps.Map(mapContainer, this.mapOptions);
        this.map.addListener("click", async (mapsMouseEvent) => {
          const latLng = mapsMouseEvent.latLng.toJSON();
          const geocoder = new this.google.maps.Geocoder();
              geocoder
              .geocode({ location: latLng })
              .then((response) => {
                  var adData = {}
                  if (response.results[0]) {
                      response.results[0].address_components.forEach(comp => {
                          adData[comp.types[0]] = comp.long_name
                      })
                      this.addressData = {...adData}
                      this.latitude = latLng.lat;
                      this.longitude = latLng.lng;
                      this.address = response.results[0].formatted_address;
              
                  } else {
                      window.alert("No results found");
                  }
              })
              .catch((e) => window.alert("Can't fetch location due to: " + e));
          });
        this.polygon = new google.maps.Polygon({
          paths: this.parentPolygonCoords,
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35,
        });
  
        this.polygon.setMap(this.map);
        this.createPolygon();
        this.startGeoFenceTool();
      },
    },
    mixins: [loadingMixin],
  };
  </script>
  <style scoped lang="scss">
  .pac-target-input {
    border: 1px solid #898989;
    border-radius: 3px;
    min-height: 40px;
    width: 100%;
    padding: 0px 12px;
    caret-color: #00bd73;
  }
  
  .pac-target-input:focus-visible {
    border: 1px solid #00bd73;
    outline: none;
  }
  
  :deep([style*="opacity: 0.5"]) {
    opacity: 0 !important;
  }
  
  :deep([style*="width: 9px; height: 9px;"]) {
    height: 15px !important;
    width: 15px !important;
    background-color: #00bd73 !important;
    border-color: #00bd73 !important;
    border-radius: 50% !important;
  }
  </style>
  