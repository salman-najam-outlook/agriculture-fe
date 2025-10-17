<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div class="d-flex mb-4">
                <h2>{{ $t("memberDataSection.geofence") }} </h2>
                <v-spacer></v-spacer>
            </div>
        </v-container>
        <template v-if="hasFarmer">
            <div class="d-inline-flex ml-3">
                <span class="title black--text text-no-wrap">{{ $t('memberDataSection.farm') }}</span>
                <v-select :items="farms" v-model="farmId" item-text="farmName" item-value="id" dense outlined
                    class="shrink ml-2 wdt" :placeholder="$t('memberDataSection.selectFarm')" @change="handleFarm"></v-select>
            </div>
            <v-row class="ml-2">
                <v-col cols="6">
                    <v-card class="pa-3 color-card">
                        <div class="geofence-header">
                            <svg width="36" height="38" viewBox="0 0 36 38" fill="none" xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink">
                                <rect width="36" height="38" fill="url(#pattern0)" />
                                <defs>
                                    <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                                        <use xlink:href="#image0_51360_215686"
                                            transform="matrix(0.00406504 0 0 0.00385109 0 -0.00449294)" />
                                    </pattern>
                                    <image id="image0_51360_215686" width="246" height="262"
                                        xlink:href="data:image/png;base64,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" />
                                </defs>
                            </svg>
                            <h4> {{ viewFarmOnMap.farmName }} </h4>
                        </div>
                        <v-divider class="mt-5"></v-divider>
                        <div class="farm-info mt-5">
                            <div class="farm-el">
                                <p class="mb-2 neutral-c"> {{ $t('memberDataSection.dateOfEntry')}} </p>
                                <p class="font-weight-bold mb-2"> {{ viewFarmOnMap.createdAt }} </p>
                            </div>
    
                            <div class="farm-el">
                                <p class="mb-2 neutral-c"> {{  $t('memberDataSection.farmID') }} </p>
                                <p class="font-weight-bold mb-2"> {{ viewFarmOnMap.id }} </p>
                            </div>
    
                            <div class="farm-el">
                                <p class="mb-2 neutral-c"> {{  $t('memberDataSection.ownershipType') }} </p>
                                <p class="font-weight-bold mb-2"> {{ viewFarmOnMap.farmOwnershipType }} </p>
                            </div>
    
                            <div class="farm-el">
                                <p class="mb-2 neutral-c"> {{  $t('memberDataSection.totalSize') }}</p>
                                <p class="font-weight-bold mb-2"> {{ convertSizeIntoBaseUnit(viewFarmOnMap.area) }} </p>
                            </div>
    
                            <div class="farm-el">
                                <p class="mb-2 neutral-c"> {{  $t('memberDataSection.locationAddress') }} </p>
                                <p class="font-weight-bold mb-2"> {{ viewFarmOnMap.address }} </p>
                            </div>
    
                            <div class="farm-el">
                                <p class="mb-2 neutral-c"> {{  $t('memberDataSection.goalType') }} </p>
                                <ul v-if="viewFarmOnMap.farmGoals.length">
                                    <li v-for="(goal,index) in viewFarmOnMap.farmGoals" :key="index">
                                        <p class="font-weight-bold mb-2" > {{goal.farmingGoal }} </p>
                                    </li>
                                </ul>
                            </div>
                            <div class="farm-el">
                                <p class="mb-2 neutral-c"> {{  $t('memberDataSection.productionType') }} </p>
                                <p class="font-weight-bold mb-2"> {{
                                    viewFarmOnMap.productionType }} </p>
                            </div>
                            <div class="farm-el">
                                <p class="mb-2 neutral-c"> {{  $t('memberDataSection.certifications') }} </p>
                                <ul v-if="viewFarmOnMap.farmCertifications.length">
                                    <li v-for="(certificate,index) in viewFarmOnMap.farmCertifications" :key="index">
                                        <p class="font-weight-bold mb-2" > {{certificate.name }} </p>
                                    </li>
                                </ul>
                               
                            </div>
                        </div>
                        <v-divider class="mt-5"></v-divider>
                        <div class="zone-lifestock mt-4">
                            <h4> {{  $t('memberDataSection.geofences') }}  </h4>
                            <p class="font-weight-bold mb-2"> {{
                                    viewFarmOnMap.farmGeofenceName }} </p>
                        </div>
                        <!-- <v-divider class="mt-5"></v-divider>
                        <div class="zone-lifestock mt-4">
                            <h4> Livestock </h4>
                            <div class="farm-info mt-5">
                                <div class="farm-el" v-for="(livestock, key) in viewFarmOnMap.farmLivestocks" :key="key">
                                    <p class="mb-2 neutral-c"> Livestock {{ key + 1 }} </p>
                                    <p class="font-weight-bold mb-2"> {{ livestock }}</p>
                                </div>
                            </div>
                        </div> -->
    
    
                    </v-card>
                </v-col>
                <v-col cols="6" v-if="center && farmCoordinate.length">
                    <GmapMap :center="center" :zoom="15" map-type-id="satellite" style="width: 100%; height: 800px;">
                        />
                        <GmapPolygon v-if="farmCoordinate.length" :path="farmCoordinate" :options="options"
                        @mouseover="showInfoWindow(farmCoordinate)" @mouseout="hideInfoWindow" 
                            ref="polyline-farm" />
                        <!-- <GmapPolygon v-for="(path, key) in paths" :path="path.coordinates" :key="key" :ref="path.name" :options="polygonOptions"
                            @mouseover="showInfoWindow(path)" @mouseout="hideInfoWindow" /> -->
                        <GmapInfoWindow :position="infoWindowPosition" :opened="infoWindowOpened">
                            <div v-if="infoWindowOpened">
                                <div v-html="infoWindowContent"></div>
                            </div>
                        </GmapInfoWindow>
                    </GmapMap>
                </v-col>
            </v-row>
        </template>
        <v-container fluid v-if="!hasFarmer && !mixingIsLoading">
            <v-card>
                <div class="py-16 text-center">
                <img src="/icons/nodata.svg" /><br />
                <strong class="red--text">
                    {{ $t("noRecordFound") }}
                </strong>
                </div>
            </v-card>
        </v-container>
    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import loadingMixin from "@/mixins/LoadingMixin";
import {convertSizeIntoBaseUnit} from "@/utils.js"
import _ from 'lodash';

export default {
    computed: {
        ...mapGetters({ farmer: 'memberData/farmerDetail'}),
        ...mapGetters({ viewFarmOnMap: 'memberData/farmViewOnMap' }),
        ...mapState({
            farms: state => state.memberData.farmers.farmerViewAllFarms.farms,
        }),
        hasFarmer() {
            return !_.isEmpty(this.farmer);
        },
    },
    mounted() {
        this.startLoading()
        this.$store.dispatch('memberData/getFarmerDetail', {
            userId:this.$route.params.farmerId
        })

        this.$store.dispatch('memberData/getFarmOnMapView', {
            farmId: this.$route.params.farmId
        }).then(() => {
            this.farmId = this.$route.params.farmId
            this.getFarmCoordinate()
            this.getPath()
            this.findCenter(this.farmCoordinate)
            this.$store.dispatch('memberData/getFarmersViewAllFarms', {
                userId: this.viewFarmOnMap.userId
            }).then(() => this.stopLoading()).catch(() => this.stopLoading())
            this.stopLoading()
        }).catch(() => this.stopLoading())
    },
    methods: {
        convertSizeIntoBaseUnit,
        getFarmCoordinate() {
            const cor = this.viewFarmOnMap.farmCoordinates.map(x => {
                return {
                    lat: Number(x.lat),
                    lng: Number(x.log)
                }
            })
            this.farmCoordinate = cor
        },
        getPath() {
            const inir = this.viewFarmOnMap.zones.map(x => {
                return {
                    id: x.id,
                    name: x.geofenceName,
                    coordinates: x.coordinates.map(x => {
                        return {
                            lat: Number(x.lat),
                            lng: Number(x.log)
                        }
                    })
                }
            })
            this.paths = inir
        },
        getMiddle(prop, markers) {
            let values = markers.map(m => m[prop]);
            let min = Math.min(...values);
            let max = Math.max(...values);
            if (prop === 'lng' && (max - min > 180)) {
                values = values.map(val => val < max - 180 ? val + 360 : val);
                min = Math.min(...values);
                max = Math.max(...values);
            }
            let result = (min + max) / 2;
            if (prop === 'lng' && result > 180) {
                result -= 360
            }
            return result;
        },

        findCenter(markers) {
            this.center = {
                lat: this.getMiddle('lat', markers),
                lng: this.getMiddle('lng', markers)
            }
        },

        handleFarm() {
            this.startLoading()

            this.$store.dispatch('memberData/getFarmOnMapView', {
                farmId: this.farmId
            }).then(() => {
                this.getFarmCoordinate()
                this.getPath()
                this.findCenter(this.farmCoordinate)
                this.stopLoading()
            }).catch(() => this.stopLoading())
        },
        calculateCenter(coordinates) {
            if (coordinates.length === 0) {
                return null;
            }

            let totalLat = 0;
            let totalLng = 0;

            coordinates.forEach(coord => {
                totalLat += coord.lat;
                totalLng += coord.lng;
            });

            const avgLat = totalLat / coordinates.length;
            const avgLng = totalLng / coordinates.length;

            return { lat: avgLat, lng: avgLng };
        },
        showInfoWindow(coordinates) {
            console.log(coordinates)
            this.infoWindowOpened = true;
            this.infoWindowPosition = this.calculateCenter(coordinates);
            this.infoWindowContent =
             `
             Farm Name: ${ this.viewFarmOnMap.farmName } <br/>
             Farmer Name: ${ this.farmer?.user?.firstName} ${ this.farmer?.user?.lastName} <br />
             Geofence : ${this.viewFarmOnMap?.farmGeofenceName}
             `
        },
        hideInfoWindow() {
            this.infoWindowOpened = false;
        },
    },
    data() {
        return {
            farmCoordinate: [],
            infoWindowOpened: false,
            infoWindowPosition: null,
            infoWindowContent: '',
            paths: [],
            farmId: null,
            center: null,
            options: {
                strokeOpacity: 0.8,
                strokeWeight: 2,
                strokeColor: '#FFB443',
                fillColor: '#FFB443',
                fillOpacity: 0.4
            },
            polygonOptions: {
                strokeOpacity: 0.8,
                strokeWeight: 2,
                strokeColor: '#32CD32',
                fillColor: '#32CD32',
                fillOpacity: 0.4
            },
            breadcrumbs: [
                {
                    text: this.$t("dashboard"),
                    disabled: false,
                    to: { name: "Users" },
                    exact: true,
                },
                {
                    text: this.$t("memberDataSection.farmers"),
                    disabled: true,
                    href: "breadcrumbs_link_1",
                },
                {
                    text: this.$t("memberDataSection.map_views"),
                    disabled: true,
                    href: "breadcrumbs_link_1",
                },
            ],
        }
    },
    mixins: [loadingMixin]
}

</script>

<style scoped lang="scss">
::v-deep .geofence-header svg {
    height: 36px;
    width: 38px;
    margin-right: 16px;
}

::v-deep .geofence-header {
    display: flex;
    align-items: center;
}

::v-deep .farm-info {
    display: flex;
    flex-wrap: wrap;
}

::v-deep .farm-el {
    flex: 0 0 24%;
    margin-right: 4px;
}

::v-deep .neutral-c {
    color: #787878;
}

::v-deep .color-card {
    border: 2px solid #0EBF67;
    background: #E5F8F1;
}
</style>