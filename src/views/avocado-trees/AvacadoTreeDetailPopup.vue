<template>
    <div>
        <v-dialog v-model="showPopup" width="95vw" persistent>
            <v-card>
                <v-toolbar color="secondary" flat class="white--text">
                    <v-toolbar-title class="font-weight-bold">{{
            $t("oma.avocadoTreeDetailPopupTitle")
        }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon class="white--text" @click="close">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-container fluid>
                    <div class="d-flex">
                        <h2 class="text-capitalize">{{ $t("oma.avocadoTreeDetailHeader") }}</h2>
                        <v-spacer></v-spacer>
                        <v-btn depressed color="error" class="mr-5" outlined @click="deleteBtnClick">
                            {{ $t("delete") }}
                        </v-btn>
                        <v-btn depressed color="primary" outlined @click="editBtnClick">
                            {{ $t("edit") }}
                        </v-btn>
                    </div>
                    <v-card elevation="0" class="pb-8 pb-10">
                        <v-card-text>
                            <v-row class="mt-5" width="100%">
                                <v-col lg="4" md="4" sm="6" xs="12">
                                    <v-card class="green2 elevation-0">
                                        <v-list class="green2">
                                            <v-list-item three-line>
                                                <v-list-item-content>
                                                    <v-list-item-subtitle>{{ $t('oma.treeId') }}
                                                        <v-tooltip top color="black" max-width="350">
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-icon v-bind="attrs" v-on="on">
                                                                    mdi-information-outline
                                                                </v-icon>
                                                            </template>
                                                            <span>{{ $t('oma.avocadoDetailCard.treeId') }}</span>
                                                        </v-tooltip>
                                                    </v-list-item-subtitle>
                                                    <v-list-item-title class="text-h6 mt-2">
                                                        {{ tree.clientTreeId }}
                                                    </v-list-item-title>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </v-list>
                                    </v-card>
                                </v-col>
                                <v-col lg="4" md="4" sm="6" xs="12">
                                    <v-card class="green2 elevation-0">
                                        <v-list class="green2">
                                            <v-list-item three-line>
                                                <v-list-item-content>
                                                    <v-list-item-subtitle>{{ $t('oma.avocadoDetailCard.treeName') }}
                                                        <v-tooltip top color="black" max-width="350">
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-icon v-bind="attrs" v-on="on">
                                                                    mdi-information-outline
                                                                </v-icon>
                                                            </template>
                                                            <span>{{ $t('oma.avocadoDetailCard.treeName') }}</span>
                                                        </v-tooltip>
                                                    </v-list-item-subtitle>
                                                    <v-list-item-title class="text-h6 mt-2">
                                                        {{ tree.treeName }}
                                                    </v-list-item-title>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </v-list>
                                    </v-card>
                                </v-col>
                                <v-col lg="4" md="4" sm="6" xs="12">
                                    <v-card class="green2 elevation-0">
                                        <v-list class="green2">
                                            <v-list-item three-line>
                                                <v-list-item-content>
                                                    <v-list-item-subtitle>{{ $t('oma.avocadoDetailCard.zoneId') }}
                                                        <v-tooltip top color="black" max-width="350">
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-icon v-bind="attrs" v-on="on">
                                                                    mdi-information-outline
                                                                </v-icon>
                                                            </template>
                                                            <span>{{ $t('oma.avocadoDetailCard.zoneId') }}</span>
                                                        </v-tooltip>
                                                    </v-list-item-subtitle>
                                                    <v-list-item-title class="text-h6 mt-2">
                                                        {{ tree.zoneId }}
                                                    </v-list-item-title>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </v-list>
                                    </v-card>
                                </v-col>
                                <v-col lg="4" md="4" sm="6" xs="12">
                                    <v-card class="green2 elevation-0">
                                        <v-list class="green2">
                                            <v-list-item three-line>
                                                <v-list-item-content>
                                                    <v-list-item-subtitle>{{ $t('oma.avocadoDetailCard.latitude') }}
                                                        <v-tooltip top color="black" max-width="350">
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-icon v-bind="attrs" v-on="on">
                                                                    mdi-information-outline
                                                                </v-icon>
                                                            </template>
                                                            <span>{{ $t('oma.avocadoDetailCard.latitude') }}</span>
                                                        </v-tooltip>
                                                    </v-list-item-subtitle>
                                                    <v-list-item-title class="text-h6 mt-2">
                                                        {{ tree.latitude }}
                                                    </v-list-item-title>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </v-list>
                                    </v-card>
                                </v-col>
                                <v-col lg="4" md="4" sm="6" xs="12">
                                    <v-card class="green2 elevation-0">
                                        <v-list class="green2">
                                            <v-list-item three-line>
                                                <v-list-item-content>
                                                    <v-list-item-subtitle>{{ $t('oma.avocadoDetailCard.longitude') }}
                                                        <v-tooltip top color="black" max-width="350">
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-icon v-bind="attrs" v-on="on">
                                                                    mdi-information-outline
                                                                </v-icon>
                                                            </template>
                                                            <span>{{ $t('oma.avocadoDetailCard.longitude') }}</span>
                                                        </v-tooltip>
                                                    </v-list-item-subtitle>
                                                    <v-list-item-title class="text-h6 mt-2">
                                                        {{ tree.longitude }}
                                                    </v-list-item-title>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </v-list>
                                    </v-card>
                                </v-col>
                                <v-col lg="4" md="4" sm="6" xs="12">
                                    <v-card class="green2 elevation-0">
                                        <v-list class="green2">
                                            <v-list-item three-line>
                                                <v-list-item-content>
                                                    <v-list-item-subtitle>{{ $t('oma.avocadoDetailCard.altitude') }}
                                                        <v-tooltip top color="black" max-width="350">
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-icon v-bind="attrs" v-on="on">
                                                                    mdi-information-outline
                                                                </v-icon>
                                                            </template>
                                                            <span>{{ $t('oma.avocadoDetailCard.altitude') }}</span>
                                                        </v-tooltip>
                                                    </v-list-item-subtitle>
                                                    <v-list-item-title class="text-h6 mt-2">
                                                        {{ tree.altitude }}
                                                    </v-list-item-title>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </v-list>
                                    </v-card>
                                </v-col>
                            </v-row>
                            <v-row class="mt-5" width="100%">
                                <v-col lg="4" md="4" sm="12" xs="12">
                                    <v-card class="green2 elevation-0 mb-8">
                                        <v-list class="green2">
                                            <v-list-item three-line>
                                                <v-list-item-content>
                                                    <v-list-item-subtitle>{{ $t('oma.avocadoDetailCard.createdAt') }}
                                                        <v-tooltip top color="black" max-width="350">
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-icon v-bind="attrs" v-on="on">
                                                                    mdi-information-outline
                                                                </v-icon>
                                                            </template>
                                                            <span>{{ $t('oma.avocadoDetailCard.dateCreated') }}</span>
                                                        </v-tooltip>
                                                    </v-list-item-subtitle>
                                                    <v-list-item-title class="text-h6 mt-2">
                                                        {{ tree.createdAt.toLocaleString() }}
                                                    </v-list-item-title>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </v-list>
                                    </v-card>
                                    <v-card class="green2 elevation-0 mb-8">
                                        <v-list class="green2">
                                            <v-list-item three-line>
                                                <v-list-item-content>
                                                    <v-list-item-subtitle>{{ $t('oma.avocadoDetailCard.updatedAt') }}
                                                        <v-tooltip top color="black" max-width="350">
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-icon v-bind="attrs" v-on="on">
                                                                    mdi-information-outline
                                                                </v-icon>
                                                            </template>
                                                            <span>{{ $t('oma.avocadoDetailCard.dateUpdated') }}</span>
                                                        </v-tooltip>
                                                    </v-list-item-subtitle>
                                                    <v-list-item-title class="text-h6 mt-2">
                                                        {{ tree.updatedAt.toLocaleString() }}
                                                    </v-list-item-title>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </v-list>
                                    </v-card>
                                    <v-card class="green2 elevation-0 mb-8">
                                        <v-list class="green2">
                                            <v-list-item three-line>
                                                <v-list-item-content>
                                                    <v-list-item-subtitle>{{
            $t('oma.avocadoTreeDetailsTableHeader.noOfImages') }}
                                                        <v-tooltip top color="black" max-width="350">
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-icon v-bind="attrs" v-on="on">
                                                                    mdi-information-outline
                                                                </v-icon>
                                                            </template>
                                                            <span>{{ $t('oma.avocadoTreeDetailsTableHeader.noOfImages')
                                                                }}</span>
                                                        </v-tooltip>
                                                    </v-list-item-subtitle>
                                                    <v-list-item-title class="text-h6 mt-2">
                                                        {{ tree.images.length }}
                                                    </v-list-item-title>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </v-list>
                                    </v-card>
                                    <v-card class="green2 elevation-0 mb-8">
                                        <v-list class="green2">
                                            <v-list-item three-line>
                                                <v-list-item-content>
                                                    <v-list-item-subtitle>{{
            $t('oma.avocadoTreeDetailsTableHeader.notes') }}
                                                        <v-tooltip top color="black" max-width="350">
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-icon v-bind="attrs" v-on="on">
                                                                    mdi-information-outline
                                                                </v-icon>
                                                            </template>
                                                            <span>{{ $t('oma.avocadoTreeDetailsTableHeader.notes')
                                                                }}</span>
                                                        </v-tooltip>
                                                    </v-list-item-subtitle>
                                                    <v-list-item-title class="text-h6 mt-2">
                                                        {{ tree.notes }}
                                                    </v-list-item-title>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </v-list>
                                    </v-card>
                                </v-col>
                                <v-col lg="8" md="8" sm="12" xs="12">
                                    <v-card class="mb-5">
                                        <v-card-text class="py-1">
                                            <v-tabs v-model="selectedTab">
                                                <v-tab class="letterSpacing text-capitalize" value="0"> {{
            $t('oma.avocadoTreeView') }} </v-tab>
                                                <v-tab class="letterSpacing text-capitalize" value="1"> {{
            $t('oma.avocadoFarmView') }} </v-tab>
                                            </v-tabs>
                                        </v-card-text>
                                    </v-card>
                                    <div :class="selectedTab === 0 ? 'show' : 'hide'">
                                        <v-carousel v-model="currentImage">
                                            <v-carousel-item v-for="(image, i) in tree.images" :key="i" :value="i"
                                                :src="image.location" cover>
                                            </v-carousel-item>
                                        </v-carousel>
                                        <div class="d-flex justify-space-between align-center py-4">
                                            <v-col>
                                                <b>Image Name:</b> {{ tree.images[currentImage].imageName }}
                                            </v-col>
                                            <v-col>
                                                <b>Timestamp:</b> {{
            tree.images[currentImage].timestamp?tree.images[currentImage].timestamp.toLocaleString():''
                                                }}
                                            </v-col>
                                            <v-col class="text-right">
                                                <b>{{ currentImage + 1 }}/{{ tree.images.length }} Tree Images</b>
                                            </v-col>
                                        </div>
                                    </div>
                                    <div :class="selectedTab === 1 ? 'show': 'hide'">
                                        <div class="google-map" style="width:100%;height:78vh; z-index: 0;" id="map"
                                            ref="googleMap"></div>
                                    </div>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-container>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";
import FarmService from "@/_services/FarmService";
import AvocadoTreesService from "@/_services/AvocadoTreesService";
import { Point, Polygon } from '@flatten-js/core';
import { getGoogleMapsLoader } from '@/mixins/GoogleMapLoaderSingleton';

export default {
    async mounted() {
        await this.getFarmDetail()
        if (this.tree.farm) {
            this.mapOptions.center.lat = this.tree.latitude;
            this.mapOptions.center.lng = this.tree.longitude;

            let codes = [];

            if (this.tree.farm.zones.length === 0 || !this.tree.farm.zones[0].geofenceRadius) {
                const farm = await FarmService.getFarm(this.tree.farm.id);

                if (farm.FarmCoordinates && farm.FarmCoordinates.length > 0) {
                    codes = farm.FarmCoordinates.map(function (elm) {
                        return { lat: parseFloat(elm['lat']), lng: parseFloat(elm['log']) };
                    });
                }
                
                if (farm.coordinates && farm.coordinates.length > 0) {
                    codes = farm.coordinates.map(function (elm) {
                        return { lat: parseFloat(elm['lat']), lng: parseFloat(elm['log']) };
                    });
                }
                this.parentPolygonCoords = codes;
            }
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

        try {
            const loader = getGoogleMapsLoader();
            const google = await loader.load();
            await this.initializeMap(google);
            this.loader = loader;

        } catch (e) {
            console.log('Loader Error', e);
        }
    },
    computed: {
        areaToShow() {
            return this.area + ' ' + (this.areaUnit == 1 ? 'A' : 'H')
        },
        perimeterToShow() {
            return this.perimeter + ' ' + (this.areaUnit == 1 ? 'ft' : 'M')
        },
    },
    props: {
        showPopup: {
            type: Boolean,
            require: true
        },
        tree: {
            type: Object,
        }
    },

    data() {
        return {
            selectedTab: 0,
            slideIndex: 1,
            currentImage: 0,
            selectedMarkerIndex: 0,
            circle: null,
            polygon: null,
            parentPolygonCoords: [],
            markersArray: [],
            treeMarkers: [],
            addressData: null,
            locationEnabled: true,
            startGeoFence: true,
            loader: null,
            latitude: 0,
            longitude: 0,
            google: null,
            map: null,
            marker: null,
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
            snackbar: false,
            areainMeter: 0,
            perimeterInMeter: 0,
            areaUnit: 2,
            area: 0,
            perimeter: 0,
            address: '',
            subPolygonCoords: [],
            subPolygon: null,
            mapOptions: {
                mapTypeId: 'satellite',
                center: {
                },
                zoom: 18,
                disableDefaultUI: true,
                zoomControl: true,
            },

        }
    },

    methods: {
        async getFarmDetail() {
            let farmView = await AvocadoTreesService.getFarmView(this.tree.farmId);
            this.tree.farm = farmView.data[0];
        },
        close() {
            this.$emit('close');
        },
        createMarkerBlack() {
            const svgMarker = {
                path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
                fillColor: "black",
                fillOpacity: 1,
                strokeWeight: 0,
                rotation: 0,
                scale: 1.5,
                anchor: new this.google.maps.Point(0, 20),
            };

            // if (this.marker != null) this.marker.setMap(null);
            const latLng = { lat: this.tree.latitude, lng: this.tree.longitude };
            this.marker = new this.google.maps.Marker({
                position: latLng,
                icon: svgMarker
            });

            // To add the marker to the map, call setMap();
            this.marker.setMap(this.map);
        },
        removeExistingMarkers() {
            for (let i = 0; i < this.markersArray.length; i++) {
                this.markersArray[i].setMap(null);
            }
            this.markersArray = []
        },
        createMarkerArray(latLngArray) {
            this.removeExistingMarkers()
            const svgMarker = {
                path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
                fillColor: "#00BD73",
                fillOpacity: 0,
                strokeWeight: 0,
                rotation: 0,
                scale: 0.4,
                anchor: new this.google.maps.Point(0, 0),
            };
            const svgMarkerRed = {
                path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
                fillColor: "red",
                fillOpacity: 0,
                strokeWeight: 0,
                rotation: 0,
                scale: 0,
                anchor: new this.google.maps.Point(0, 0),
            };
            latLngArray.forEach((latLng, i) => {
                this.markersArray[i] = new this.google.maps.Marker({
                    position: latLng,
                    map: this.map,
                    icon: (this.parentPolygonCoords.length - 1) == i ? svgMarkerRed : svgMarker,
                });
                
            })
        },
        async changeAreaUnit() {
            let d = await this.polygon.getPath();

            if (!d) {
                return;
            }

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
            this.perimeter = this.areaUnit === 1 ? parseFloat(this.perimeterInMeter * 3.28084).toFixed(5) : parseFloat(this.perimeterInMeter).toFixed(5);
        },
        async createPolygon() {
            if (this.polygon != null) this.polygon.setMap(null);

            this.polygon = await new this.google.maps.Polygon({
                paths: this.parentPolygonCoords,
                clickable:false,
                strokeColor: "#1F5D51",
                strokeOpacity: 0.8,
                strokeWeight: 3,
                fillColor: "#E5F8F1",
                fillOpacity: 0.7,
                editable: false,
                draggable: false,
                icon: this.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW
            });
            
            this.createMarkerArray(this.parentPolygonCoords);
            this.polygon.setMap(this.map);
            await this.changeAreaUnit();
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
            const mapContainer = this.$refs.googleMap;
            this.map = await new google.maps.Map(mapContainer, this.mapOptions);

            if (this.tree.farm && this.tree.farm.zones && this.tree.farm.zones.length > 0 && this.tree.farm.zones[0].geofenceRadius) {
                await this.createCircle({
                    lat: this.tree.farm.zones[0].geofenceCenterLat,
                    lng: this.tree.farm.zones[0].geofenceCenterLog
                }, this.tree.farm.zones[0].geofenceRadius);
            } else {
                this.createPolygon();
            }

            if (this.tree.farm && this.tree.farm.trees && this.tree.farm.trees.length > 0) {
                const svgMarker = {
                    path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
                    fillColor: "white",
                    fillOpacity: 1,
                    strokeWeight: 0,
                    rotation: 0,
                    scale: 1.5,
                    anchor: new this.google.maps.Point(0, 20),
                };

                this.tree.farm.trees.map((tree) => ({
                    lat: tree.latitude,
                    lng: tree.longitude
                })).forEach((treeLoc) => {
                    if (treeLoc.lat !== this.tree.latitude || treeLoc.lng !== this.tree.longitude) {
                        const marker = new this.google.maps.Marker({
                            position: treeLoc,
                            icon: svgMarker,
                            draggable: false,
                            map: this.map
                        });

                        marker.setMap(this.map);

                        this.treeMarkers.push(marker);
                    }
                })
            }
            this.createMarkerBlack();
            // this.createMarker();

        },
        editBtnClick() {
            this.$emit('editBtnClick');
        },
        deleteBtnClick() {
            this.$emit('deleteBtnClick');
        },
    },
    mixins: [loadingMixin]
}

</script>
<style scoped lang="scss">
.show {
    display: block;
}

.hide {
    display: none;
}
</style>