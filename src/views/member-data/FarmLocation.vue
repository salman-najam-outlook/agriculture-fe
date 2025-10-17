<template>
    <div>
        <v-dialog
			v-model="showMap"
			width="85%"
            persistent
		>
        <v-card>
            <v-toolbar color="secondary" flat class="white--text">
                <v-toolbar-title class="font-weight-bold">
                    {{ $t("Farm Location") }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon class="white--text" @click="closeWithoutChange">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container fluid>
                <v-container>
                    <v-row class="d-flex mb-5">
                        <v-col cols="3" style="height: 540px;">
                            <div class="text-h5 black--text font-weight-bold">Farm Location</div>
                                <div class="gmap-wrapper">
                                    <vue-google-autocomplete id="mapplace" types="" v-model="address" classname="form-control" placeholder="Search Location" v-on:placechanged="setPlace"></vue-google-autocomplete>
                                </div>
                            <div class="mt-4 subtitle-1 black--text font-weight-bold">Address </div>

                            <div class="text-h5 black--text font-weight-bold">Geographic Location</div>

                            <div class="mt-4 subtitle-1 black--text font-weight-bold">Latitude  </div>
                            <v-text-field
                                v-model="latitude"
                                outlined
                                dense
                                readonly
                            ></v-text-field>

                            <div class=" subtitle-1 black--text font-weight-bold">Longitude</div>
                            <v-text-field
                                v-model="longitude"
                                outlined
                                dense
                                readonly
                            ></v-text-field>


                    
                            <v-btn @click="saveLocation" block color="primary" class="mt-5" depressed>Save</v-btn>
                            <v-btn @click="closeWithoutChange" block outlined color="primary" class="mt-5" depressed>Cancel</v-btn>
                        </v-col>
                        <v-col cols="9">
                            <div class="google-map" style="width:100%;height:540px; z-index: 0;"  id="map" ref="googleMap"></div>
                            <v-btn class="mx-2 float-right" fab dark small color="white"
                                    style="margin-top: -39vh;" @click="gotoCurrentLocation">
                                    <v-icon dark color="gray">
                                        mdi-crosshairs-gps
                                    </v-icon>
                                </v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-container>
        </v-card>
        </v-dialog>
        <v-snackbar
            v-model="snackbar"
            :multi-line="true"
        >
            Your location is disabled. Please search your location from left menus.

            <template v-slot:action="{ attrs }">
                <v-btn
                    color="red"
                    text
                    v-bind="attrs"
                    @click="snackbar = false"
                    :timeout="5000"
                >
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script>

    import VueGoogleAutocomplete from "vue-google-autocomplete";
    // import FarmService from "@/_services/farmService";
    import loadingMixin from "@/mixins/LoadingMixin";
    import {Point, Polygon} from '@flatten-js/core';
import { getGoogleMapsLoader } from '@/mixins/GoogleMapLoaderSingleton';
    export default {
        components: {
            VueGoogleAutocomplete
        },
        async mounted() {
            // console.log('farm', this.farm)
            if(this.farm ){
                this.address = this.farm.address || '';
                // this.areaUnit = this.farm.areaUomId
                // this.area = this.farm.area
                // this.perimeter =  this.farm.parameter
            }
            // var codes = [];
            // if(this.farm && this.farm.coordinates && this.farm.coordinates.length > 0){
            //     codes = this.farm.coordinates.map(function(elm) {
            //         return { lat: parseFloat(elm['lat']), lng: parseFloat(elm['log'])};
            //     });
               
            //     this.parentPolygonCoords = codes;
            // }
            // if(this.farm && this.farm.farmGeofence && this.farm.farmGeofence.length > 0){
            //     codes = this.farm.farmGeofence.map(function(elm) {
            //         return { lat: parseFloat(elm['lat']), lng: parseFloat(elm['log'])};
            //     });
               
            //     this.parentPolygonCoords = codes;
            // }
            if(this.farm && this.farm?.lat && this.farm?.log){
                    this.latitude  = this.farm.lat;
                    this.longitude = this.farm.log;
                    this.mapOptions.center.lat = this.latitude;
                    this.mapOptions.center.lng = this.longitude;
            }else{
                const success = (position) => {
                    this.latitude  = position.coords.latitude;
                    this.longitude = position.coords.longitude;
                    this.mapOptions.center.lat = this.latitude;
                    this.mapOptions.center.lng = this.longitude;
                    if(this.map) this.map.setCenter(this.mapOptions.center)
                };
                const error = (err) => {
                    console.log('location', err)
                    this.locationEnabled = false
                    this.snackbar = true
                };
        
                // This will open permission popup
                await navigator.geolocation.getCurrentPosition(success, error);
            }
            
    
            try {
                const loader = getGoogleMapsLoader();
                const google = await loader.load();
                await this.initializeMap(google);
                this.loader = loader;
            
            }catch(e) {
                console.log(e);
            }
        },
        computed: {
            // areaToShow() {
            //         return this.area + ' ' +(this.areaUnit == 1 ? 'A' : 'H')
            //     },
            // perimeterToShow() {
            //     return this.perimeter + ' ' +(this.areaUnit == 1 ? 'ft' : 'M')
            // }
        },
        props: {
            showMap: {
                type: Boolean,
                require: true
            },
            farm: {
                type: Object,
            }
        },
    
        data() {
            return {
                addressData: null,
                snackbar: false,
                locationEnabled: true,
                areainMeter: 0,
                perimeterInMeter: 0,
                areaUnit:1,
                area: 0,
                perimeter: 0,
                address: '',
                startGeoFence: false,
                parentPolygonCoords: [],
                parentPolygonCoordsBk: [],
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
            }
        },
    
        methods: {
            // changeAreaUnitM() {
            //     if(this.areaUnit === 1){
            //         this.area = parseFloat(this.area * 2.47105).toFixed(5)
            //         this.perimeter = parseFloat(this.perimeter * 3.28084).toFixed(5)
            //     }else{
            //         this.area = parseFloat(this.area / 2.47105).toFixed(5)
            //         this.perimeter = parseFloat(this.perimeter / 3.28084).toFixed(5)
            //     }
            // },
            closeWithoutChange(){
                this.$emit('close-without-change');
            },
            changeAreaUnit() {
                this.area = parseFloat(this.areainMeter / (this.areaUnit ===1?4046.86:10000)).toFixed(5)
                this.perimeter = this.areaUnit ===1 ? parseFloat(this.perimeterInMeter* 3.28084).toFixed(5) : parseFloat(this.perimeterInMeter).toFixed(5)
            },
            async gotoCurrentLocation() {
                const success = (position) => {
                    this.latitude  = position.coords.latitude;
                    this.longitude = position.coords.longitude;
                    this.mapOptions.center.lat = this.latitude;
                    this.mapOptions.center.lng = this.longitude;
                    if(this.map) this.map.setCenter(this.mapOptions.center)
                    const geocoder = new this.google.maps.Geocoder();
                        geocoder
                        .geocode({ location: {lat: this.latitude, lng: this.longitude} })
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
            removeGeofence() {
                if(this.polygon != null) this.polygon.setMap(null);
                this.parentPolygonCoordsBk = [];
                this.parentPolygonCoords = [];
                this.perimeter = 0
                this.area = 0
            },
            async updateLocationData() {
                const area =  await this.google.maps.geometry.spherical.computeArea(this.polygon.getPath());
                var coodinates = this.parentPolygonCoords.map(function(elm) {
                    return { lat: elm['lat'], log: elm['lng']};
                });
                const gdata = {
                    lat: this.latitude,
                    log: this.longitude,
                    farmGeofence: coodinates,
                    area,
                    address: this.address
                }
                this.startLoading()
                const {data} = await this.$http.put('/farm', gdata);
                console.log(data)
                this.stopLoading()
            },
            setPlace(addressData, placeResultData) {
                // console.log('sdljflds', addressData, placeResultData);
                const latLng = {lat: placeResultData.geometry.location.lat(), lng: placeResultData.geometry.location.lng()};
                this.map.setCenter(latLng)
                this.latitude = latLng.lat;
                this.longitude = latLng.lng;
                this.address = placeResultData.formatted_address
                this.addressData = addressData;
                this. createMarker()
                // console.log('set place', place)
                // this.marker = new this.google.maps.Marker({
                //     position: latLng,
                //     title:"Hello World!"
                // });

                // To add the marker to the map, call setMap();
                // this.marker.setMap(this.map);
    
            },
            createMarker() {
                if(this.marker!=null) this.marker.setMap(null);
                const latLng = {lat: this.latitude, lng: this.longitude};
                this.marker = new this.google.maps.Marker({
                    position: latLng,
                    // title:"Hello World!"
                });

                // To add the marker to the map, call setMap();
                this.marker.setMap(this.map);
            },
            async saveLocation() {
                if(this.address == ''){
                    this.$notify({
                        title: "Location is required.",
                        type: "error",
                    });
                    return
                }
                // this.startGeoFence = false;
                // this.parentPolygonCoords = [];
                // this.polygon.setEditable(false);
                // var updated = [];
                // const vertices = this.polygon.getPath();
                // for (let i = 0; i < vertices.getLength(); i++) {
                //     const xy = vertices.getAt(i);
                //     updated.push({lat: xy.lat() , lng: xy.lng()});
                // }
    
                // this.parentPolygonCoords = updated;
                // const area =  await this.google.maps.geometry.spherical.computeArea(this.polygon.getPath());
                // var coodinates = this.parentPolygonCoords.map(function(elm) {
                //     return { lat: `${elm['lat']}`, log: `${elm['lng']}`};
                // });
                var id = '';
                if(this.farm?.id){
                    id = parseInt(this.farm.id);
                }
                const gdata = {
                    id: id,
                    lat: Number(this.latitude),
                    log: Number(this.longitude),
                    address: this.address,
                    addressData: this.addressData
                }

                this.closeModal(gdata)
                // this.startLoading()
                // const {data} = await this.$http.put('/farm', gdata);
                // console.log(data)
                // this.stopLoading()
                // this.$router.push({name: 'My farm'})
            },
            
            startGeoFenceTool() {
                if(this.address == ''){
                    this.$notify({
                        title: "Location is required.",
                        type: "error",
                    });
                    return
                }
                this.startGeoFence = true;
                this.$notify({
                    title: "Please start drawing geofence on map.",
                    type: "warning",
                });
                this.map.addListener("click", (mapsMouseEvent) => {
                    this.updatePolygon(mapsMouseEvent)
                });
            },
            async updatePolygon(mapsMouseEvent) {
                this.startGeoFence = true;
                const latLng = mapsMouseEvent.latLng.toJSON();
                this.parentPolygonCoords.push(latLng);
                await this.createPolygon();
                var sgt = [];
                for (let i = 0; i < this.parentPolygonCoords.length; i++) {
                    const xy = this.parentPolygonCoords[i];
                    let x = xy.lat;
                    let y = xy.lng;
                    sgt.push(new Point(x, y))
                }
                const ss = new Polygon(sgt);
                // console.log('isvalid',ss.isValid())
                if(!ss.isValid()){
                    setTimeout(() => {
                        this.parentPolygonCoords.pop();
                        this.$notify({
                            title: "No crossover allowed.",
                            type: "error",
                        });
                        this.createPolygon();
                    }, 100)
                }else{
                    this.areainMeter =  await this.google.maps.geometry.spherical.computeArea(this.polygon.getPath());
                    this.perimeterInMeter = await this.google.maps.geometry.spherical.computeLength(this.polygon.getPath());
                    this.perimeter = parseFloat(this.perimeterInMeter).toFixed(5)
                    this.changeAreaUnit();
                    // this.area = parseFloat(area / (this.areaUnit ===1?4046.86:10000)).toFixed(5)
                }

                // if(this.isAnyCrossover(this.parentPolygonCoords)){
                //     this.parentPolygonCoords.pop();
                //     this.$notify({
                //         title: "No crossover allowed.",
                //         type: "error",
                //     });
                // }
            },
            async createPolygon(editable=true) {
                this.parentPolygonCoordsBk = this.parentPolygonCoords;
                if(this.polygon != null) this.polygon.setMap(null);
                this.polygon = await  new this.google.maps.Polygon({
                    paths: this.parentPolygonCoords,
                    strokeColor: "#1F5D51",
                    strokeOpacity: 0.8,
                    strokeWeight: 3,
                    fillColor: "#E5F8F1",
                    fillOpacity: 0.7,
                    editable: editable,
                    draggable: false,
                    icon: this.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW
                });
                this.google.maps.event.addListener(this.polygon.getPath(), 'set_at',   this.setAt);
                this.google.maps.event.addListener(this.polygon.getPath(), 'insert_at', this.insertAt);
                // this.google.maps.event.addListener(this.polygon.getPath(), 'remove_at', this.markerCoords);
                this.polygon.addListener("click", (mapsMouseEvent) => {
                    this.updatePolygon(mapsMouseEvent)
                });
                this.polygon.setMap(this.map);
                this.areainMeter =  await this.google.maps.geometry.spherical.computeArea(this.polygon.getPath());
                this.perimeterInMeter = await this.google.maps.geometry.spherical.computeLength(this.polygon.getPath());
                this.perimeter = parseFloat(this.perimeterInMeter).toFixed(5)
                this.changeAreaUnit()
                // this.area = parseFloat(area / (this.areaUnit ===1?4046.86:10000)).toFixed(5)
                return Promise.resolve(true)

            },
            setAt(e) {
                this.markerCoords(e, 'set_at');
            },
            insertAt(e) {
                this.markerCoords(e, 'insert_at');
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
            closeModal(data=null) {
                //   this.polygon.setMap(null);
                //   this.parentPolygonCoords = [];
                this.$emit('close-location-modal', data);
            },
    
            // async markerCoords(e, type) {
            //     const vertices = this.polygon.getPath();
            //     var updated = [];
            //     var sgt = [];
            //     for (let i = 0; i < vertices.getLength(); i++) {
            //         const xy = vertices.getAt(i);
            //         let x = xy.lat();
            //         let y = xy.lng();
            //         updated.push({lat: x , lng: y});
            //         sgt.push(new Point(x, y))
            //     }
            //     const ss = new Polygon(sgt);
            //     // console.log('isvalid',ss.isValid())
            //     if(!ss.isValid()){
            //         if(type == 'set_at'){
            //             updated[e] = this.parentPolygonCoordsBk[e];
            //         }else{
            //             updated.splice(e, 1);
            //         }
            //         this.$notify({
            //             title: "No crossover allowed.",
            //             type: "error",
            //         });
            //     }else{
            //         this.areainMeter =  await this.google.maps.geometry.spherical.computeLength(this.polygon.getPath()).toFixed(5);
            //         this.perimeterInMeter = await this.google.maps.geometry.spherical.computeLength(this.polygon.getPath());
            //         this.perimeter = parseFloat(this.perimeterInMeter).toFixed(5)
            //         this.changeAreaUnit();
            //         // this.area = parseFloat(area / (this.areaUnit ===1?4046.86:10000)).toFixed(5)
            //     }
            //     this.parentPolygonCoords = updated;
            //     this.createPolygon();
            // },
    
            async initializeMap(google) {
                this.google = google;
                
                const mapContainer = this.$refs.googleMap
                this.map = await new google.maps.Map(mapContainer, this.mapOptions);
                this.map.addListener("click", async (mapsMouseEvent) => {
                    // if(!this.startGeoFence) {
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
                            this.createMarker()
                        } else {
                            window.alert("No results found");
                        }
                    })
                    .catch((e) => window.alert("Can't fetch location due to: " + e));
                       
                    // }
                });
                // this.createPolygon(false);
                this.createMarker();
            },
    
        },
        mixins: [loadingMixin]
    }
    
    </script>
<style scoped lang="scss">
    :deep(.pac-target-input) {
        border: 1px solid #898989;
        border-radius: 3px;
        min-height: 40px;
        width: 100%;
        padding: 0px 12px;
        caret-color: #00bd73;
        }
    :deep(.pac-target-input:focus-visible) {
        border:1px solid #00bd73;
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

    .v-dialog__content{
        z-index: 9999 !important;
    }

    
</style>
