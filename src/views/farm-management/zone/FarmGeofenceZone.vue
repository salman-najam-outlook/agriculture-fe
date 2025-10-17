<template>
    <v-card flat>
        <breadcrumb :items="breadcrumbs" v-if="!popup"></breadcrumb>
        <v-toolbar v-else flat color="secondary">
                <v-toolbar-title class="white--text">
                    {{$t('farm.addNewZone')}}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon class="white--text" @click="closePopup">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
        <v-container v-if="hasFarm" fluid>
            <v-container>
                <v-row class="d-flex">
                    <v-col cols="3">
                        <v-form ref="form">
                            <div class="text-h6 black--text font-weight-bold">{{$t('farm.addZone')}}</div>
                            <div class="mt-4 subtitle-1 black--text ">{{$t('farm.nameOfTheZone')}} </div>
                            <v-text-field outlined dense v-model="geofenceName"
                                :rules="rules.geofenceName"></v-text-field>

                            <div class="text-h6 black--text font-weight-bold">{{$t('farm.zoneDetails')}}</div>

                            <div class=" subtitle-1 black--text mt-2">{{$t('farm.address')}}</div>
                            <vue-google-autocomplete id="mapplace" :value="address" classname="form-control"
                                placeholder="Search Location" v-on:placechanged="setPlace"></vue-google-autocomplete>

                            <div class="mt-4 subtitle-1 black--text">{{$t('farm.perimeter')}}</div>
                            <v-text-field v-model="perimeterToShow" outlined dense readonly
                                hide-details="auto"></v-text-field>

                            <div class=" subtitle-1 mt-2 black--text">{{$t('farm.area')}}</div>
                            <v-text-field v-model="areaToShow" outlined dense readonly
                                hide-details="auto"></v-text-field>


                            <div class=" subtitle-1 black--text">{{$t('farm.areaUnit')}}</div>
                            <v-select v-model="areaUnit" outlined dense item-text="name" item-value="id"
                                :items="[{ id: 1, name: 'Acre' }, { id: 2, name: 'Hectare' }]" @change="changeAreaUnitM"
                                hide-details="auto"></v-select>

                            <v-btn @click="startGeoFenceTool" block color="primary" class="mt-5" depressed
                                :disabled="startGeoFence">{{$t('farm.addZone')}}</v-btn>
                            <v-btn @click="cancelZone" block color="primary" class="mt-5" depressed>{{$t('cancel')}}</v-btn>
                        </v-form>
                    </v-col>
                    <v-col cols="9">
                        <div class="" style="width:100%;height:78vh;">
                            <v-card class="ml-10" flat
                                style="width:60%; z-index: 1;margin-top: 10px;position:absolute;">
                                <v-card-text class="py-2">
                                    <v-row class="d-flex space-between">
                                        <v-col cols="6" class="text-left pl-5"> {{$t('farm.perimeter')}}: {{ perimeterToShow }}</v-col>
                                        <v-col cols="6" class="text-right pr-5"> {{$t('farm.area')}}: {{ areaToShow }}</v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                            <div class="google-map" style="width:100%;height:78vh" id="map" ref="googleMap"></div>
                            <div class="d-flex justify-center mt-n12">
                                <v-btn v-if="startGeoFence" outlined style="background-color:white"
                                    @click="removeGeofence" width="100" color="primary" class="mr-2"
                                    depressed>{{$t('cancel')}}</v-btn>
                                <v-btn v-if="startGeoFence" @click="saveGeoFence" width="100" color="primary" class=""
                                    depressed>{{$t('save')}}</v-btn>
                            </div>
                        </div>
                    </v-col>
                </v-row>
            </v-container>
        </v-container>
        <v-container fluid v-if="!hasFarm && !mixingIsLoading">
            <div class="py-16 text-center">
                <img src="/icons/nodata.svg" /><br />
                <strong class="red--text">
                    {{ $t("noRecordFound") }}
                </strong>
            </div>
        </v-container>
    </v-card>
</template>
<script>
import FarmService from "@/_services/FarmService";
import loadingMixin from "@/mixins/LoadingMixin";
import { Point, Polygon } from '@flatten-js/core';
import VueGoogleAutocomplete from "vue-google-autocomplete";
import { getRandomColor } from '../../../utils';
import _ from 'lodash';
import { getGoogleMapsLoader } from '@/mixins/GoogleMapLoaderSingleton';

export default {
    components: {
        VueGoogleAutocomplete
    },
    async mounted() {
        this.startLoading()
        // console.log('query', this.$route.query)
        if (this.$route.query?.name) { this.geofenceName = this.$route.query.name; }
        FarmService.getFarm(this.$route.query.farmId || this.farmId).then(async (data) => {
            let codes
            this.orgFarm = data;
            this.stopLoading();
            this.latitude = this.orgFarm.lat;
            this.longitude = this.orgFarm.log;
            this.address = this.orgFarm.address;
            this.mapOptions.center.lat = this.locationObj?.lat || this.latitude;
            this.mapOptions.center.lng = this.locationObj?.log || this.longitude;

            if (this.locationObj?.mainGeofence?.geofence_coordinates) {
                 codes = this.locationObj?.mainGeofence?.geofence_coordinates.map(function (elm) {
                    return { lat: parseFloat(elm['lat']), lng: parseFloat(elm['log']) };
                });
                this.parentPolygonCoords = codes;
            }
            
           else if (this.orgFarm.coordinates.length > 0) {
                 codes = this.orgFarm.coordinates.map(function (elm) {
                    return { lat: parseFloat(elm['lat']), lng: parseFloat(elm['log']) };
                });
                this.parentPolygonCoords = codes;
            }

             if (this.zoneList && this.zoneList.length > 0) {
                this.zoneList.forEach((zone) => {
                    var cc = zone.geofence_coordinates.map((elm) => {
                        return { lat: parseFloat(elm['lat']), lng: parseFloat(elm['log']) };
                    });
                    this.oldSegments.push({ geofenceName: zone.geofenceName, coordinates: cc });
                });
            }


            try {
                const loader = getGoogleMapsLoader();
                const google = await loader.load();
                await this.initializeMap(google);
                this.loader = loader;

            } catch (e) {
                console.log(e);
            }
        });
        
    },
    computed: {
        areaToShow() {
            return this.area + ' ' + (this.areaUnit == 1 ? 'A' : 'H')
        },
        perimeterToShow() {
            return this.perimeter + ' ' + (this.areaUnit == 1 ? 'ft' : 'M')
        },
        hasFarm() {
            return !_.isEmpty(this.orgFarm);
        },
    },
    props: {
        showMap: {
            type: Boolean,
            require: false
        },
        popup: {
            type: Boolean,
            default: false
        },
        farmId: {
            type: Number
        },
        locationId: {
            type: Number
        },
        locationObj: {
            type: Object
        },
        zoneList:{
            type:Array
        }
    },

    data() {
        return {
            rules: {
                geofenceName: [
                    v => !!v || 'Name is required'
                ]
            },
            oldSegments: [],
            geofenceName: '',
            geofenceParameter: '',
            address: '',
            areainMeter: 0,
            perimeterInMeter: 0,
            areaUnit: 1,
            area: 0,
            perimeter: 0,
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
                mapTypeId: 'satellite',
                center: {
                    lat: -34.397,
                    lng: 150.644
                },

                zoom: 18,
                disableDefaultUI: true
            },
            breadcrumbs: [
                {
                    text: 'Dashboard',
                    disabled: false,
                    to: '/',
                },
                {
                    text: 'Farm',
                    disabled: true,
                },
                {
                    text: 'Add Zone',
                    disabled: true,
                },
            ],
            isCrossover: false
        }
    },

    methods: {
        closePopup(){
            this.$emit('closeAddZone')
            this.$emit('handleAddZone', false)
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
        removeGeofence() {
            if (this.subPolygon != null) this.subPolygon.setMap(null);
            this.subPolygonCoordsBk = [];
            this.subPolygonCoords = [];
            this.perimeter = 0
            this.area = 0
        },
        async changeAreaUnit() {
            // console.log(this.subPolygon, 'this.subPolygon')
            // console.log(this.subPolygon.getPath())
            // let d = await this.subPolygon.getPath().Vc
            // const path = [];
            // d.forEach((e) => {
            //     // console.log('path', e.lat())
            //     path.push({ lat: e.lat(), lng: e.lng() })
            //     // if (idx === d.length - 1){ 
            //     //     path.push({...path[0]})
            //     // }
            // })
            this.areainMeter = await this.google.maps.geometry.spherical.computeArea(this.subPolygon.getPath());
            // path.push({ ...path[0] })
            this.perimeterInMeter = await this.google.maps.geometry.spherical.computeLength(this.subPolygon.getPath());
            console.log('A', this.areainMeter, 'P', this.perimeterInMeter)
            this.area = parseFloat(this.areainMeter / (this.areaUnit === 1 ? 4046.86 : 10000)).toFixed(5)
            this.perimeter = this.areaUnit === 1 ? parseFloat(this.perimeterInMeter * 3.28084).toFixed(5) : parseFloat(this.perimeterInMeter).toFixed(5)
        },
        cancelZone() {
            if (this.popup) {
                this.$emit('closeAddZone')
            } else {

                this.popup? this.closePopup() :this.$router.push({ name: 'ZonesList', params: { id: parseInt(this.orgFarm.id) } })
                // this.$router.push({name: 'EditPrimaryFarm'})
            }
        },
        setPlace(place) {

            console.log('place==========', place)
            const latitude = place?.geometry?.location?.lat() || place.latitude;
            const longitude = place?.geometry?.location?.lng() || place.longitude;
            const latLng = { lat: latitude, lng: longitude };
            this.map.setCenter(latLng)
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
                // if(this.geofenceName == '') return;
                this.startGeoFence = false;
                this.subPolygonCoords = [];
                this.subPolygon.setEditable(false);
                var updated = [];
                const vertices = this.subPolygon.getPath();
                for (let i = 0; i < vertices.getLength(); i++) {
                    const xy = vertices.getAt(i);
                    updated.push({ lat: `${xy.lat()}`, log: `${xy.lng()}` });
                }

                this.subPolygonCoords = updated;
                this.startLoading();
                const d = {
                    farmId: parseInt(this.orgFarm.id),
                    segments: [
                        {
                            coordinates: this.subPolygonCoords,
                            geofenceName: this.geofenceName,
                            geofenceArea: parseFloat(this.area),
                            geofenceAreaUOMId: this.areaUnit,
                            geofenceParameter: parseFloat(this.perimeter),
                            geofenceParameterUOMId: this.areaUnit,
                            locationId: this.locationId
                        }
                    ],
                };

                await FarmService.createSegment(d).then((data)=>{
                    this.stopLoading();
                    if(data.success){
                        this.$notify({
                            title: data.message,
                            type: "success",
                        });

                        this.popup ? this.closePopup() : this.$router.push({ name: 'ZonesList', params: { id: parseInt(this.orgFarm.id) } })

                    }
                    else{
                        this.stopLoading()
                        this.$notify({
                            title: "Something went wrong. Please try after sometime",
                            type: "error",
                        });
                    }
                });
                // this.$apollo.mutate({
                //     mutation: gql`mutation createSegment($data: CreateSegmentInput!) {
                //                 createSegment(createSegmentInput: $data) {
                //                     success
                //                 }
                //             }`,
                //     variables: {
                //         data: d,
                //     },
                // })
                //     .then(res => {
                //         this.stopLoading()
                //         if ('rres', res.data.createSegment.success) {
                //             this.$emit('zone:added', this.geofenceName);
                //             if (this.popup) {
                //                 this.$emit('closeAddZone')
                //             } else {
                //                 this.$router.push({ name: 'ZonesList', params: { id: parseInt(this.orgFarm.id) } })
                //             }
                //         }
                //     })
                //     .catch(() => {
                //         this.stopLoading()
                //         this.$notify({
                //             title: "Something went wrong. Please try after sometime",
                //             type: "error",
                //         });
                //     })
                // const data = await FarmService.updateFarmSegments(d);
                // this.stopLoading();
                // if(data.success){
                //     this.$emit('zone:added');
                //     if(this.popup){
                //         this.$emit('closeAddZone')
                //     }else{
                //         this.$router.push({name: 'EditPrimaryFarm'})
                //     }
                // }
            }
        },
        startGeoFenceTool() {
            this.startGeoFence = true;
            this.$notify({
                title: "Please start drawing geofence on map.",
                type: "warning",
            });
            this.map.addListener("click", (mapsMouseEvent) => {
                this.updatePolygon(mapsMouseEvent)
            });
            const isCircularFarm = this.orgFarm.segments && this.orgFarm.segments.length > 0 && this.orgFarm.segments[this.orgFarm.segments.length - 1].geofenceRadius;
            if(isCircularFarm) {
                this.circle.addListener('click', this.updatePolygon);
            } else {
                this.polygon.addListener("click", this.updatePolygon);
            }
        },
        async updatePolygon(mapsMouseEvent) {
            if(!this.startGeoFence) return;
            const latLng = mapsMouseEvent.latLng.toJSON();
            this.subPolygonCoords.push(latLng);
            await this.createPolygon();
            var sgt = [];
            for (let i = 0; i < this.subPolygonCoords.length; i++) {
                const xy = this.subPolygonCoords[i];
                let x = xy.lat;
                let y = xy.lng;
                sgt.push(new Point(x, y))
            }
            const ss = new Polygon(sgt);
            // if(!ss.isValid()){
            //     setTimeout(() => {
            //         this.subPolygonCoords.pop();
            //         this.$notify({
            //             title: "No crossover allowed.",
            //             type: "error",
            //         });
            //         this.createPolygon();
            //     }, 100)
            // }else{
            //     // this.areainMeter =  await this.google.maps.geometry.spherical.computeLength(this.subPolygon.getPath()).toFixed(5);
            //     // this.perimeterInMeter = await this.google.maps.geometry.spherical.computeLength(this.subPolygon.getPath());
            //     // this.perimeter = parseFloat(this.perimeterInMeter).toFixed(5)
            //     this.changeAreaUnit();
            //     // this.area = parseFloat(area / (this.areaUnit ===1?4046.86:10000)).toFixed(5)
            // }
            if (!ss.isValid()) {
                this.isCrossover = true
            } else {
                this.isCrossover = false
                this.changeAreaUnit();
            }
        },
        async createPolygon() {
            this.subPolygonCoordsBk = this.subPolygonCoords;
            if (this.subPolygon != null) this.subPolygon.setMap(null);
            this.subPolygon = new this.google.maps.Polygon({
                paths: this.subPolygonCoords,
                strokeColor: "#1F5D51",
                strokeOpacity: 0.8,
                strokeWeight: 4,
                fillColor: "#E5F8F1",
                fillOpacity: 0.7,
                editable: true,
                dragable: true,
                strokePosition: this.google.maps.StrokePosition.INSIDE,
            });

            this.google.maps.event.addListener(this.subPolygon.getPath(), 'set_at', this.setAt);
            this.google.maps.event.addListener(this.subPolygon.getPath(), 'insert_at', this.insertAt);
            // this.google.maps.event.addListener(this.subPolygon.getPath(), 'remove_at', this.markerCoords);
            this.subPolygon.addListener("click", (mapsMouseEvent) => {
                this.updatePolygon(mapsMouseEvent)
            });
            this.subPolygon.setMap(this.map);
            await this.changeAreaUnit()
        },

        async createCircle(center, radius = 0) {
            this.circle = await new this.google.maps.Circle({
                fillColor: '#FFFFFF',
                fillOpacity: 0.2,
                strokeWeight: 0,
                map: this.map,
                center,
                radius,
                clickable: false,
            });
            this.circle.setMap(this.map);
        },

        setAt(e) {
            this.markerCoords(e, 'set_at');
        },
        insertAt(e) {
            this.markerCoords(e, 'insert_at');
        },
        isAnyCrossover(coordinates) {
            // NOTE: this currently returns a crossover coordinate or a null but could just return a true/false
            if (coordinates.length >= 4) {
                // can only have crossover if polygon length >= 4
                for (let i = 0; i < coordinates.length - 2; i++) {
                    for (let j = i + 1; j < coordinates.length - 1; j++) {
                        if (this.doEdgesIntersect(
                            coordinates[i].lat, coordinates[i].lng,
                            coordinates[i + 1].lat, coordinates[i + 1].lng,
                            coordinates[j].lat, coordinates[j].lng,
                            coordinates[j + 1].lat, coordinates[j + 1].lng)) {
                            return true;
                        }
                        if (this.doEdgesIntersect( // wrap around line segment
                            coordinates[coordinates.length - 1].lat, coordinates[coordinates.length - 1].lng,
                            coordinates[0].lat, coordinates[0].lng,
                            coordinates[j].lat, coordinates[j].lng,
                            coordinates[j + 1].lat, coordinates[j + 1].lng)) {
                            return true;
                        }
                    }
                }
            }
            return false; // no crossover detected
        },

        doEdgesIntersect(a, b, c, d, p, q, r, s) {
            let det, gamma, lambda;
            det = (c - a) * (s - q) - (r - p) * (d - b);
            if (det === 0) {
                return false;
            } else {
                lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
                gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
                return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
            }
        },

        closeModal() {
            this.polygon.setMap(null);
            this.parentPolygonCoords = [];
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
                sgt.push(new Point(x, y))
            }
            const ss = new Polygon(sgt);
      
            if (!ss.isValid()) {
                this.isCrossover = true
            } else {
                this.isCrossover = false
                this.changeAreaUnit();
            }
            this.subPolygonCoords = updated;
            this.createPolygon();
        },

        async initializeMap(google) {
            this.google = google;
            const mapContainer = this.$refs.googleMap
            this.map = await new google.maps.Map(mapContainer, this.mapOptions);
            if (this.locationObj?.mainGeofence?.geofenceRadius) {
                const circularFarm = this.locationObj?.mainGeofence
                await this.createCircle({
                    lat: circularFarm.geofenceCenterLat,
                    lng: circularFarm.geofenceCenterLog
                }, circularFarm.geofenceRadius);
            } else {
                this.polygon = new google.maps.Polygon({
                    paths: this.parentPolygonCoords,
                    strokeColor: "#00BD73",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: getRandomColor(),
                    fillOpacity: 0.35,
                });

                this.polygon.setMap(this.map);
            }
          if (this.oldSegments.length > 0) {
            this.oldSegments.forEach((segment) => {
              var pg = new google.maps.Polygon({
                paths: segment.coordinates,
                strokeColor: "#FF0000",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#FF0000",
                fillOpacity: 0.35,
              });

              pg.setMap(this.map)
              var bounds = new this.google.maps.LatLngBounds();
              for (let i = 0; i < segment.coordinates.length; i++) {
                bounds.extend(segment.coordinates[i]);
              }
              new this.google.maps.Marker({
                position: bounds.getCenter(),
                map: this.map,
                icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflagq.png',
                label: { color: 'white', fontWeight: 'bold', fontSize: '16px', text: segment.geofenceName }
              });
            });
          }

            this.map.addListener("click", (mapsMouseEvent) => {
                const latLng = mapsMouseEvent.latLng.toJSON();
                this.latitude = latLng.lat;
                this.longitude = latLng.lng;
            });
        },

    },
    mixins: [loadingMixin]
}

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
    opacity: 0.0 !important;
}

:deep([style*="width: 9px; height: 9px;"]) {
    height: 15px !important;
    width: 15px !important;
    background-color: #00bd73 !important;
    border-color: #00bd73 !important;
    border-radius: 50% !important;
}
</style>