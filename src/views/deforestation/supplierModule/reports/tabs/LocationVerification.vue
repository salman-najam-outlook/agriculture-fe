<template>
    <div>
        <v-container fluid>
            <v-card elevation="0" class="px-5">
                <div class="d-flex mb-4">
                    <h2>{{ $t("deforestation.locationVerification") }}
                        <v-tooltip top color="black" max-width="220">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn icon v-bind="attrs" v-on="on">
                                    <v-icon color="green lighten-1" style="top:-4px" dense size="16px">
                                        mdi-alert-circle
                                    </v-icon>
                                </v-btn>
                            </template>
                            <span>{{ $t("deforestation.loctionVerification") }}</span>
                        </v-tooltip>
                    </h2>
                    <v-spacer></v-spacer>
                </div>
                <v-row>
                    <v-col>
                        <div class="google-map" style="width:100%;height:50vh; z-index: 0;" id="map" ref="googleMap">
                        </div>
                    </v-col>
                </v-row>
                <div class="d-flex mb-4 mt-10">
                    <h2>{{ $t("deforestation.totals") }}
                        <v-tooltip top color="black" max-width="220">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn icon v-bind="attrs" v-on="on">
                                    <v-icon color="green lighten-1" style="top:-4px" dense size="16px">
                                        mdi-alert-circle
                                    </v-icon>
                                </v-btn>
                            </template>
                            <span>{{ $t("deforestation.totals") }}</span>
                        </v-tooltip>
                    </h2>
                    <v-spacer></v-spacer>
                </div>
                <div class="d-flex mt-5">
                    <v-text-field outlined height="5px" :placeholder="$t('deforestation.netMassKg')" disabled dense
                        v-model="search" @keyup.enter="searchQuery" class="shrink mx-2">
                    </v-text-field>
                    <v-text-field outlined height="5px" :placeholder="$t('deforestation.volumeM3')" disabled dense v-model="search"
                        @keyup.enter="searchQuery" class="shrink mx-2">
                    </v-text-field>
                    <v-text-field outlined height="5px" :placeholder="$t('deforestation.areaHa')" disabled dense v-model="search"
                        @keyup.enter="searchQuery" class="shrink mx-2">
                    </v-text-field>
                </div>
                <div class="d-flex mb-4">
                    <h2>{{ $t("deforestation.productionPlaces") }}
                        <v-tooltip top color="black" max-width="220">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn icon v-bind="attrs" v-on="on">
                                    <v-icon color="green lighten-1" style="top:-4px" dense size="16px">
                                        mdi-alert-circle
                                    </v-icon>
                                </v-btn>
                            </template>
                            <span>{{ $t("deforestation.productionPlaces") }}</span>
                        </v-tooltip>
                    </h2>
                    <v-spacer></v-spacer>
                </div>
                <v-card-text>
                    <v-data-table :headers="headers" :items="filterData" :items-per-page="10" :footer-props="{
            'items-per-page-options': [10, 25, 50],
        }" hide-default-footer :loading="loading" :options.sync="options"
                        :server-items-length="totalProductionPlaces"
                        :loading-text="$t('loadingData')">
                        <template v-slot:top="{ }">
                            <div class="d-flex mt-5">
                                <v-text-field prepend-inner-icon="mdi-magnify" outlined height="5px"
                                    :placeholder="$t('search')" dense v-model="search" @keyup.enter="searchQuery"
                                    class="shrink">
                                </v-text-field>

                                <!-- all countries -->
                                <v-select class="mx-2" v-model="countryModel" item-text="text" item-value="val"
                                    :items="countries" :label="$t('deforestation.allCountries')" @change="filterData"
                                    outlined dense>
                                </v-select>

                                <v-select class="mx-2" v-model="statusModel" item-text="text" item-value="val"
                                    :items="producerLists" :label="$t('deforestation.producer')" @change="filterData"
                                    outlined dense>
                                </v-select>
                                <v-spacer></v-spacer>
                                <div class="py-1 title">
                                    {{ from }} - {{ to }} of {{ totalProductionPlaces }}
                                </div>
                                <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page <= 1"
                                    @click="pageChange(false)">
                                    <v-icon dark>
                                        mdi-chevron-left
                                    </v-icon>
                                </v-btn>
                                <v-btn class="mx-2" fab small outlined color="primary"
                                    :disabled="options.page >= totalPages" @click="pageChange(true)">
                                    <v-icon dark>
                                        mdi-chevron-right
                                    </v-icon>
                                </v-btn>
                                <!-- <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn class="mx-2" fab small outlined v-bind="attrs" v-on="on" color="primary">
                                            <v-icon>settings</v-icon>
                                        </v-btn>
                                    </template>
        <span>{{ $t('deforestation.settings') }}</span>
        </v-tooltip> -->
                            </div>
                        </template>
                        <template v-if="filterData.length" v-slot:body="{ items }">
                            <tbody>
                                <tr v-for="item in items" :key="item.id" style="position: relative; width: 0; height: 0"
                                    @mouseover="selectItem(item)" @mouseleave="selectItem(false)">
                                    <td class="text-truncate">
                                        {{ item.farm.farmName || '' }}<br>
                                        {{ item.farmId || '' }}
                                    </td>

                                    <td class="text-truncate">
                                        {{ item.farm.userAssoc.firstName || '' }} {{ item.farm.userAssoc.lastName || '' }}
                                    </td>

                                    <td class="text-truncate" style="max-width: 300px;">
                                        {{ item.farm.address || '' }}
                                    </td>

                                    <td class="text-truncate">
                                        {{ parseFloat(item.farm.area  * 0.404686).toFixed(4)|| '' }} 
                                    </td>

                                    <td class="text-truncate">
                                        {{ item.farmType || '' }}
                                    </td>
                                    <td class="d-flex justify-center align-center ga-3">
                                        
                                        <div v-if="shouldShowEditButton(item)">
                                            <a @click="editGeofenceMap(item)" class="text-decoration-underline">{{ $t('deforestation.editGeofence') }}</a>
                                        </div>
                                        <div v-else>
                                            
                                            <a @click="viewGeofenceMap(item)" class="text-decoration-underline">{{ $t('View Geolocation') }}</a>
                                        </div>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn x-small fab v-bind="attrs" v-on="on" color="primary"
                                                    @click="comfirmItemDelete(item)"
                                                    style="margin-left: 20px;">
                                                    <v-icon>mdi-delete</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>{{ $t('delete') }}</span>
                                        </v-tooltip>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon  class="ml-2" v-bind="attrs" v-on="on" color="warning" v-if="shouldShowWarningIcon(item)">mdi-alert</v-icon>
                                            </template>
                                            <span>{{ getWarningMessage(item) }}</span>
                                        </v-tooltip>
                                    </td>
                                </tr>
                            </tbody>
                        </template>
                        <template v-slot:footer></template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-container>

        <!-- View Geolocation components -->
        <ViewGeoLocation v-if="showViewGeofenceMap" :dialog="showViewGeofenceMap" :farmDetails="currentItem" :disableEditGeofence="isEditGeofenceForCurrentItemDisabled" @closeViewGeoLocationModal="dismissViewGeoLocationModal" @saveViewGeoLocation="dismissViewGeoLocationModal"/>
        <!-- Edit geolocation components -->
        <EditGeoLocation v-if="showEditGeofenceMap" :dialog="showEditGeofenceMap" :farmDetails="currentItem"  @closeGeoLocationModal="dismissEditGeoLocationModal"  @saveEditGeoLocation="saveEditGeoLocationModal"/>
        <ConfirmBox
            v-if="deleteconfirm"
            :dialog="deleteconfirm"
            :title="confirmElements.title"
            :message1="confirmElements.message1"
            :message2="confirmElements.message2"
            confirmBtnText="Delete"
            :confirmData="itemToDelete"
            @continue:action="deleteProductionPlace"
            @cancel:action="deleteconfirm = false"
        />
    </div>
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import download from "@/mixins/DownloadMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import DateMixin from '@/mixins/DateMixin';
import DeforestationService from "@/_services/DeforestationService";
import { Point, Polygon } from '@flatten-js/core';
import EditGeoLocation from "../components/location-verification/EditGeoLocation.vue";
import ViewGeoLocation from "../components/location-verification/ViewGeoLocation.vue";
import ConfirmBox from "@/components/ConfirmBox";
import { getGoogleMapsLoader } from '@/mixins/GoogleMapLoaderSingleton';

export default {
    components: {
        // GmapCluster,
        EditGeoLocation,
        ViewGeoLocation,
        ConfirmBox
    },
    created() {
        const fetchData = async () => { };
        fetchData();
    },
    async mounted() {
        if (this.farm && !(this.farm?.segments && this.farm?.segments[0]?.geofenceRadius)) {
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
        var codes = this.parentPolygonCoords;
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
        if (this.coordinateArr) {
            if (this.coordinateArr && this.coordinateArr.length > 0) {
                codes = this.coordinateArr.map(function (elm) {
                    return { lat: parseFloat(elm[1]), lng: parseFloat(elm[0]) };
                });
            }

            this.parentPolygonCoords = codes;
        }
        // if (this.farm && this.farm.farmGeofence && this.farm.farmGeofence.length > 0) {
        //     codes = this.farm.farmGeofence.map(function (elm) {
        //         return { lat: parseFloat(elm['lat']), lng: parseFloat(elm['log']) };
        //     });

        //     this.parentPolygonCoords = codes;
        // }
        if (this.farm && this.farm.lat && this.farm.log) {
            this.latitude = this.farm.lat;
            this.longitude = this.farm.log;
            this.mapOptions.center.lat = this.parentPolygonCoords.length > 0 ? this.parentPolygonCoords[0].lat : this.latitude;
            this.mapOptions.center.lng = this.parentPolygonCoords.length > 0 ? this.parentPolygonCoords[0].lng : this.longitude;
        } else {
            const success = () => {
                // this.latitude = position.coords.latitude;
                // this.longitude = position.coords.longitude;
                this.mapOptions.center.lat = this.latitude;
                this.mapOptions.center.lng = this.longitude;
                console.log('mapoptions', this.mapOptions)
                if (this.map) this.map.setCenter(this.mapOptions.center)
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

        } catch (e) {
            console.log('Loader Error', e);
        }
    },
    computed: {
        getCurrentUser() {
            return this.$store.getters.getUser
        },
        filterData() {
            if ((this.countryModel && this.countryModel !== '') || (this.regionModel && this.regionModel !== '') || (this.statusModel && this.statusModel !== '')) {
                return this.deforestationComplianceReports.filter((item) => {
                    return (!this.countryModel || item.country === this.countryModel) &&
                        (!this.regionModel || item.state === this.regionModel) &&
                        (!this.statusModel || item.status === this.statusModel);
                });
            }
            else {
                console.log('compliance report farm',this.deforestationComplianceReports)
                return this.deforestationComplianceReports;
            }

        },
        isEditGeofenceForCurrentItemDisabled() {
            return this.currentItem?.farm?.GeoFences?.[0]?.generateMethod?.toLowerCase() === 'file';
        },
    },
    watch: {
        farmGeofenceType: function (value) {
            console.log('geofence type',value)
            if (value === 'circular') {
               
                // if (this.polygon !== null && !(this.farm?.segments && this.farm?.segments[0]?.geofenceRadius)) {
                //     while (this.parentPolygonCoords.length > 0) {
                //         this.parentPolygonCoords.pop();
                //     }
                //     this.createPolygon();
                //     this.polygon.setMap(null);
                //     this.polygon = null;
                // }
                // this.google.maps.event.clearListeners(this.map, 'click');
                // this.map.addListener("click", async (mapsMouseEvent) => {
                //     const latLng = mapsMouseEvent.latLng.toJSON();
                //     this.latitude = latLng.lat;
                //     this.longitude = latLng.lng;
                //     if (this.circle !== null) this.circle.setCenter(latLng);
                //     this.createMarker();
                //     this.createPolygon();
                // });
                this.createCircle(this.farmGeofenceRadius);
            } else {
                this.createPolygon();
                this.circle && this.circle.setMap(null);
                this.farmGeofenceRadius = null
              
                this.createPolygon();
                this.createMarker();
                this.google.maps.event.clearListeners(this.map, 'click');
                // this.map.addListener("click", async (mapsMouseEvent) => {
                //     // if (!this.startGeoFence) {
                //     const latLng = mapsMouseEvent.latLng.toJSON();
                //     this.parentPolygonCoords.push(latLng);
                //     // this.parentPolygonCoords.splice((Number(this.selectedMarkerIndex)+1), 0, latLng);
                //     this.createPolygon();
                //     // const geocoder = new this.google.maps.Geocoder();
                //     // geocoder
                //     //     .geocode({ location: latLng })
                //     //     .then((response) => {
                //     //         if (response.results[0]) {
                //     //             this.latitude = latLng.lat;
                //     //             this.longitude = latLng.lng;
                //     //             this.address = response.results[0].formatted_address;
                //     //             this.createMarker()
                //     //         } else {
                //     //             window.alert("No results found");
                //     //         }
                //     //     })
                //     //     .catch((e) => window.alert("Can't fetch location due to: " + e));

                //     // }
                // });
            }
        },
        farmGeofenceRadius: function (value) {
            this.circle.setMap(null);

            // Calculating area
            const areaConversionFactor = this.areaUnit === 1 ?  4046.8564224 : 10000;
            this.area = (Math.PI * Math.pow(value, 2)) / areaConversionFactor;
            this.createCircle(value);
        },
        options: {
            handler(opt) {
                this.getDeforestationEUDR(opt);
            },
            deep: true,
        },
    },
    data() {
        return {
            showViewGeofenceMap:false,
            showEditGeofenceMap:false,
            farm: {
                name: "",
                registrationNo: "",
                govRegistrationNo: "",
                farmType: "",
                farmOwner: null,
                lat: "",
                log: "",
                farmOwnershipType: "personal",
                country: "",
                state: "",
                city: "",
                countryId: null,
                stateId: null,
                cityId: null,
                address: "",
                area: "",
                areaUomId: 2,
                parameter: 0,
                parameterUomId: 0,
                street: "",
                farmSize: 0,
                farmSizeUomId: 0,
                farmPerimeter: 0,
                farmPerimeterUomId: 1,
                farmGeofence: [],
                farmingGoalOptId: null,
                productionType: "",
                certifications: [],
                farmingGoalsIds: [],
                farmerFirstName: "",
                farmerMiddleName: "",
                farmerLastName: "",
                isTechnician: false,
                technicianId: null,
                farmerId: "",
                userId: "",
                farmGeofenceName: "",
                farmGeofenceCategory: "",
                farmTitleDocument: "",
                farmTitleDocumentUrl: "",
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
            farmGeofenceType: "circular",
            farmGeofenceName: "",
            farmGeofenceRadius: 500,
            selectedMarkerIndex: 0,
            markersArray: [],
            addressData: null,
            snackbar: false,
            locationEnabled: true,
            areainMeter: 0,
            perimeterInMeter: 0,
            areaUnit: 2,
            area: 20,
            perimeter: 0,
            address: '',
            startGeoFence: true,
            parentPolygonCoords: [
                    {lat: 25.774, lng: -80.190},
                    {lat: 18.466, lng: -66.118},
                    {lat: 32.321, lng: -64.757}
                ]
            ,
            // parentPolygonCoordsBk: [],
            subPolygonCoords: [],
            loader: null,
            latitude: 25.774,
            longitude: -80.190,
            google: null,
            map: null,
            marker: null,
            polygon: null,
            circle: null,
            subPolygon: null,
            mapOptions: {
                    mapTypeId: "satellite",
                    center: {
                    lat: 25.774,
                    lng: -80.190,
                    },
                    zoom: 2,
                },
            countryModel: '',
            statusModel: '',
            regionModel: '',

            countries: [
                { text: this.$t('deforestation.allCountries'), val: '' },
            ],
            allStatus: [
                { text: this.$t('deforestation.select'), val: '' },
                { text: this.$t('deforestation.assessmentIssued'), val: 'REQUESTED' },
                { text: this.$t('deforestation.certificateIssued'), val: 'CERTIFICATE_READY' }
            ],
            allRegions: [
                { text: this.$t('deforestation.allRegions'), val: '' },
            ],


            deforestationComplianceReports: [],
            copyReport: [],
            loading: true,
            totalDeforestationComplianceReports: 0,
            totalProductionPlaces: 0,
            tab: 0,
            selectedItem: false,
            options: {
                itemsPerPage: 10,
                page: 1
            },
            search: "",
            from: 0,
            to: 0,
            headers: [
                {
                    text: this.$t("deforestation.productionPlacesFarmAndFarmId"),
                    align: "start",
                    value: "farmerName",
                    class: "black--text",
                    sortable: false,
                },
                {
                    text: this.$t("deforestation.producerName"),
                    align: "start",
                    value: "farmName",
                    class: "black--text",
                },

                {
                    text: this.$t("deforestation.addressOfProduction"),
                    align: "start",
                    value: "farmLocation",
                    class: "black--text",
                    sortable: false
                },
                {
                    text: this.$t("deforestation.areaHa"),
                    align: "start",
                    value: "area",
                    class: "black--text",
                    sortable: false,
                },
                {
                    text: this.$t("deforestation.type"),
                    align: "start",
                    value: "dateOfRequest",
                    class: "black--text",
                    sortable: false,
                },
                {
                    text: this.$t("deforestation.geofence"),
                    align: "start",
                    value: "",
                    class: "black--text",
                    sortable: false,
                },
            ],
            breadcrumbs: [
                {
                    text: this.$t("deforestation.dueDeligence"),
                    disabled: false,
                    to: { name: "CreateNewDueDeligenceReport" },
                    exact: true,
                },
                {
                    text: this.$t("deforestation.createNewReport"),
                    disabled: true,
                    href: "breadcrumbs_link_1",
                },
            ],
            productionPlaceInput: {
                page: 1,
                limit: 10,
                searchPhrase: "",
                internalRefNum: "",
                farmCountry: "",
                eudrDeforestationStatus: "",
                farmOwner: "",
                filterByDateOfRegister: null,
                filterByDateOfLastReport: null
            },
            deleteconfirm:false,
            confirmElements: {
                title: this.$t('dueDiligence.deleteProductionPlaceData'),
                confirmBtnText: this.$t('dueDiligence.areYouSureYouWantToContinueThisAction'),
                cancelBtnText: this.$t("cancel"),
                confirmData: {},
            },
            itemToDelete:{
                digligenceReportId: null,
                farmId: null
            },
            currentItem: null,
            producerLists:[

            ],
            totalPages: 1,
            productionPlaceData: []
        };
    },
    methods: {
        async triggerSubmit(){
            this.$emit("fetchUpdatedProductionPlaceData",this.productionPlaceData);   
        },
        getWarningMessage(item) {
            const { farm } = item;
            const areaInHa = farm && farm.area ? farm.area * 0.404686 : 0;
            if (areaInHa > 4) {
                return 'Farm is bigger than 4 hectares, it needs to be a polygon';
            }else {
                return '';
            }
        },
        shouldShowWarningIcon(item) {
            return this.shouldShowEditButton(item);
        },
        shouldShowEditButton(item) {
            const { farm, farmType } = item;
            const areaInHa = farm && farm.area ? farm.area * 0.404686 : 0;
            return farmType.toUpperCase() === 'POINT' && areaInHa > 4;
        },
        updateGeolocationData(data){
            console.log({data});
        },
       
        async comfirmItemDelete(item){
            this.itemToDelete = {
                digligenceReportId: item.dueDiligenceReportId,
                farmId:item.farmId
            }
            this.deleteconfirm=true;
        },

        async deleteProductionPlace(){
            this.startLoading();
            const deletedItem = this.itemToDelete;
            try {
                if(!deletedItem){
                this.$notify({
                    title: this.$t('somethingWentWrong'),
                    type: "error",
                });
                }
                const res = await DeforestationService.removeFarmFromProductionPlace(deletedItem.digligenceReportId,deletedItem.farmId);

                const { success, message } = res.data.removeFarmFromProductionPlaceList;
                this.stopLoading();
                if(success){
                await this.getDeforestationEUDR();
                this.$notify({
                    title: message ||"Item deleted successfully.",
                    type:'success'
                })
                }
                else{
                this.$notify({
                    title: message || this.$t('somethingWentWrong'),
                    type:'error'
                })
                }
                this.deleteconfirm = false;
            } catch (err) {
                this.$notify({
                title: err.message || this.$t('somethingWentWrong'),
                type: "error",
                });
            }
            finally {
                this.stopLoading();
            }
        },

        viewGeofenceMap(item){
            this.currentItem = item;
            this.showViewGeofenceMap = true;
        },

        dismissViewGeoLocationModal(){
            this.currentItem = null;
            this.showViewGeofenceMap = false;
        },

        dismissEditGeoLocationModal(){
            this.currentItem = null;
            this.showEditGeofenceMap = false;
        },

        editGeofenceMap(item){
            this.currentItem = item;
            this.showEditGeofenceMap = true;
        },
        async saveEditGeoLocationModal(){
            this.showEditGeofenceMap = false;
            await this.getDeforestationEUDR();
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
            let d = await this.polygon.getPath()
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
            this.areainMeter = await this.google.maps.geometry.spherical.computeArea(path);
            path.push({ ...path[0] })
            this.perimeterInMeter = await this.google.maps.geometry.spherical.computeLength(path);
            this.area = parseFloat(this.areainMeter / (this.areaUnit === 1 ? 4046.86 : 10000)).toFixed(5)
            this.perimeter = this.areaUnit === 1 ? parseFloat(this.perimeterInMeter * 3.28084).toFixed(5) : parseFloat(this.perimeterInMeter).toFixed(5)
            // console.log('aa', this.area, this.perimeter)
            return Promise.resolve(true)
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
        // async updateLocationData() {
        //     const area =  await this.google.maps.geometry.spherical.computeArea(this.polygon.getPath());
        //     var coodinates = this.parentPolygonCoords.map(function(elm) {
        //         return { lat: elm['lat'], log: elm['lng']};
        //     });
        //     const gdata = {
        //         lat: this.latitude,
        //         log: this.longitude,
        //         farmGeofence: coodinates,
        //         area,
        //         address: this.address
        //     }
        //     this.startLoading()
        //     const {data} = await this.$http.put('/farm', gdata);
        //     console.log(data)
        //     this.stopLoading()
        // },
        createMarker() {
            if (this.marker != null) this.marker.setMap(null);
            const latLng = { lat: 41.78500, lng: -87.75133 }
            this.marker = new this.google.maps.Marker({
                position: latLng,
            });

            // To add the marker to the map, call setMap();
            this.marker.setMap(this.map);
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
                    draggable: true,
                });
                this.markersArray[i].addListener("click", () => {
                    let firstIndex = (i + 1)
                    this.parentPolygonCoords = this.reArrangeArray(firstIndex, this.parentPolygonCoords)
                    // this.selectedMarkerIndex = i
                    this.createMarkerArray(this.parentPolygonCoords)
                    // this.markersArray[i].setIcon(svgMarkerRed)
                    // console.log('marker Index', i)
                });
                this.markersArray[i].addListener('dragend', () => {
                    // console.log('ddd', this.parentPolygonCoords)
                    var lat = this.markersArray[i].getPosition().lat();
                    var lng = this.markersArray[i].getPosition().lng();
                    this.parentPolygonCoords[i] = { lat, lng }
                    this.createPolygon()
                    // this.createMarkerArray(this.parentPolygonCoords)
                    // console.log('ccc',lat, lng);
                });
                // this.markersArray[i].setMap(this.map);
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

        //     if (this.address == '') {
        //         this.$notify({
        //             title: "Location is required.",
        //             type: "error",
        //         });
        //         return
        //     }
        //     this.startGeoFence = true;
        //     this.$notify({
        //         title: "Please start drawing geofence on map.",
        //         type: "warning",
        //     });
        //     this.map.addListener("click", (mapsMouseEvent) => {
        //         this.updatePolygon(mapsMouseEvent)
        //     });
        // },
        // async updatePolygon(mapsMouseEvent) {
        //     this.startGeoFence = true;
        //     const latLng = mapsMouseEvent.latLng.toJSON();
        //     this.parentPolygonCoords.push(latLng);
        //     await this.createPolygon();
        //     var sgt = [];
        //     for (let i = 0; i < this.parentPolygonCoords.length; i++) {
        //         const xy = this.parentPolygonCoords[i];
        //         let x = xy.lat;
        //         let y = xy.lng;
        //         sgt.push(new Point(x, y))
        //     }
        //     const ss = new Polygon(sgt);
        // console.log('isvalid',ss.isValid())
        // if(!ss.isValid()){
        //     setTimeout(() => {
        //         this.parentPolygonCoords.pop();
        //         this.$notify({
        //             title: "No crossover allowed.",
        //             type: "error",
        //         });
        //         this.createPolygon();
        //     }, 100)
        // }else{
        //     // let d = await this.polygon.getPath().Wc
        //     // console.log('path', d)
        //     // this.areainMeter =  await this.google.maps.geometry.spherical.computeArea(d);
        //     // this.perimeterInMeter = await this.google.maps.geometry.spherical.computeLength(d);
        //     // this.perimeter = parseFloat(this.perimeterInMeter).toFixed(5)
        //     await this.changeAreaUnit();
        //     // this.area = parseFloat(area / (this.areaUnit ===1?4046.86:10000)).toFixed(5)
        // }
        // if (!ss.isValid()) {
        //     this.isCrossover = true
        // } else {
        //     this.isCrossover = false
        //     await this.changeAreaUnit();
        // }

        // if(this.isAnyCrossover(this.parentPolygonCoords)){
        //     this.parentPolygonCoords.pop();
        //     this.$notify({
        //         title: "No crossover allowed.",
        //         type: "error",
        //     });
        // }
        // },
        async createPolygon() {
            // this.parentPolygonCoordsBk = this.parentPolygonCoords;
            if (this.polygon != null) this.polygon.setMap(null);
            console.log('parent at load',this.parentPolygonCoords)
            this.polygon = await new this.google.maps.Polygon({
                paths: this.parentPolygonCoords,
                strokeColor: "#1F5D51",
                strokeOpacity: 0.8,
                strokeWeight: 3,
                fillColor: "#E5F8F1",
                fillOpacity: 0.7,
                editable: false,
                draggable: false,
                icon: this.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW
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
            // await this.changeAreaUnit();
            // this.area = parseFloat(area / (this.areaUnit ===1?4046.86:10000)).toFixed(5)
            return Promise.resolve(true);

        },
        async createCircle(radius = 0) {
            console.log('circle readuis', radius)
            this.circle = await new this.google.maps.Circle({
                fillColor: '#FF0000',
                fillOpacity: 0.8,
                strokeWeight: 2,
                map: this.map,
                center: { lat: 41.78500, lng: -87.75133 },
                radius
            });
            // this.circle.setMap(this.map);
            return Promise.resolve(true);
        },
        // setAt(e) {
        //     this.markerCoords(e, 'set_at');
        // },
        // insertAt(e) {
        //     this.markerCoords(e, 'insert_at');
        // },

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
        closeModal(data = null) {
            //   this.polygon.setMap(null);
            //   this.parentPolygonCoords = [];
            this.$emit('close-location-modal', data);
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
            // this.parentPolygonCoords = updated;
            this.createPolygon();
        },

        async initializeMap(google) {
            this.google = google;
            const mapContainer = this.$refs.googleMap
            this.map = await new google.maps.Map(mapContainer, this.mapOptions);
            // this.map.addListener("click", async (mapsMouseEvent) => {
            //     // if (!this.startGeoFence) {
            //     const latLng = mapsMouseEvent.latLng.toJSON();
            //     this.parentPolygonCoords.push(latLng)
            //     // this.parentPolygonCoords.splice((Number(this.selectedMarkerIndex)+1), 0, latLng);
            //     this.createPolygon();
            //     // const geocoder = new this.google.maps.Geocoder();
            //     // geocoder
            //     //     .geocode({ location: latLng })
            //     //     .then((response) => {
            //     //         if (response.results[0]) {
            //     //             this.latitude = latLng.lat;
            //     //             this.longitude = latLng.lng;
            //     //             this.address = response.results[0].formatted_address;
            //     //             this.createMarker()
            //     //         } else {
            //     //             window.alert("No results found");
            //     //         }
            //     //     })
            //     //     .catch((e) => window.alert("Can't fetch location due to: " + e));

            //     // }
            // });
            console.log('polygon called')
            this.createPolygon();
            
            this.createMarker();
            this.createCircle(200);
        },
        async getDeforestationEUDR(opt = null) {
            this.loading = true;
            const requestParams = {
                page: this.options.page,
                limit: this.options.itemsPerPage,
                search: this.search,
                isCertified: false,
                organization: this.getCurrentUser.user_organization.id,
            }
            if (opt?.sortBy?.length) {
                requestParams.orderField = opt.sortBy[0]
                requestParams.order = opt.sortDesc[0] ? 'DESC' : 'ASC'
            }
            this.productionPlaceInput = { ...this.productionPlaceInput, page: this.options.page, limit : this.options.itemsPerPage}

            DeforestationService.getProductionPlaces(this.productionPlaceInput).then(res => {
                this.deforestationComplianceReports = res.data.productionPlaces.rows
                this.copyReport = JSON.parse(JSON.stringify(res.data.productionPlaces.rows))
                this.totalProductionPlaces = res.data.productionPlaces.totalCount;
                this.totalPages = Math.ceil(this.totalProductionPlaces/this.options.itemsPerPage)
                this.from = (((this.options.page-1)*this.options.itemsPerPage)+1)
                this.to = (this.options.page*this.options.itemsPerPage)-(this.options.itemsPerPage-res.data.productionPlaces.rows.length)
                const countryLists = this.deforestationComplianceReports.filter(item => item.country).map((item) => {
                    return {
                        text: item.country,
                        val: item.country
                    }
                })
                const stateLists = this.deforestationComplianceReports.filter(item => item.state).map((item) => {
                    return {
                        text: item.state,
                        val: item.state
                    }
                })
                this.countries = [...this.countries, ...countryLists];
                this.allRegions = [... this.allRegions, ...stateLists];
                this.loading = false

                this.productionPlaceData = this.deforestationComplianceReports.map((item) => {
                    let payloadItem = {
                        userId: parseInt(item?.farm?.userAssoc?.id),
                        aoiId: parseInt(item?.farm?.id),
                        latitude: item?.farm?.lat,
                        longitude: item?.farm?.log,
                        generateMethod: item.farm?.GeoFences?.[0]?.generateMethod,
                    };

                    if (item.farmType.toLowerCase() === 'point' && item?.farm?.GeoFences.length > 0) {
                        payloadItem.radius = item?.farm?.GeoFences[0]?.geofenceRadius;
                    } else if (item.farmType.toLowerCase() === 'polygon' && item?.farm?.FarmCoordinates) {
                        payloadItem.coordinates = item?.farm?.FarmCoordinates?.map((coord) => ({
                            latitude: parseFloat(coord.lat),
                            longitude: parseFloat(coord.log),
                        }));
                    }

                    return payloadItem;
                });
            }).catch(err => {
                this.loading = false
                console.log('Error', err)
            })
        },
        selectItem(item) {
            this.selectedItem = item;
        },
        searchQuery() {
            this.getDeforestationEUDR();
        },
        resetSearchOnEmpty() {
            this.search = ''
            this.countryModel = ''
            this.statusModel = ''
            this.regionModelregionModel = ''
            this.options = {
                page: 1,
                limit: 10
            }
            this.getDeforestationEUDR();
        },
        pageChange(t) {
            if (t) this.options.page = this.options.page + 1;
            else this.options.page = this.options.page - 1;
            this.getDeforestationEUDR();
        },
    },
    mixins: [loadingMixin, download, getPermittedActions, DateMixin],
};
</script>
<style lang="scss" scoped>
::v-deep .wdt.v-text-field {
    width: 250px;
}

::v-deep .v-tab:hover {
    background-color: #caf1e2;
    color: $primary_color !important;
}

::v-deep .v-data-table-header span {
    text-transform: uppercase !important;
    color: black;
}

::v-deep .center-content {
    display: flex;
    justify-content: center;
    align-items: center;
}

::v-deep .img-center {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 40%;
}
</style>