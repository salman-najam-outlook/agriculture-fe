<template>
    <div>
        <v-container fluid>
            <v-card elevation="0" class="px-5">
                <v-row class="d-flex mb-4 mt-10" v-if="showVerification">
                    <v-sheet style="border: 1px solid #ccc; border-radius: 0px;"
                        class="d-flex flex-column align-center justify-center text-center mx-auto px-4" height="200" width="100%"
                        rounded>
                        <div  v-if="progress !== 100" class="d-flex align-center justify-center" style="height:50px;width:100%">
                            <v-progress-linear
                                v-if="progress !== 100"
                                :indeterminate="verifyingLocation"
                                :color="progressColor"
                                style="max-width: 90%;"
                                >
                            </v-progress-linear>
                            <span style="color: var(--primary-color);" class="ml-5">{{ progress }}%</span>
                        </div>
                        <h4 v-if="message" :style="{ color: progress === 100 ? 'primary' : '' }">
                            {{ message }}
                        </h4>
                    </v-sheet>
                </v-row>
                <div class="d-flex mb-4">
                    <h2>{{ $t("deforestation.locationVerification") }}
                        <v-tooltip top color="00BD73" max-width="350">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn icon v-bind="attrs" v-on="on">
                                    <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                                                v-on="on">
                                                mdi-alert-circle
                                            </v-icon>
                                </v-btn>
                            </template>
                            <span>{{ $t("deforestation.locationVerificationTT") }}</span>
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
                <v-row class="align-right mt-5 float-right">
                    <v-btn icon>
                        <v-icon color="blue lighten-1" style="top:-6px" dense size="24px">
                            mdi-checkbox-blank
                        </v-icon>

                    </v-btn>
                    {{ $t('deforestation.Circular')}}
                    <v-btn icon>
                        <v-icon color="purple lighten-1" style="top:-6px" dense size="124x">
                            mdi-checkbox-blank
                        </v-icon>

                    </v-btn>
                    {{ $t('deforestation.Polygon')}}
                    <v-btn icon>
                        <v-icon color="yellow lighten-1" style="top:-6px" dense size="24px">
                            mdi-checkbox-blank
                        </v-icon>

                    </v-btn>
                    {{ $t('warning')}}
                </v-row>
                <div class="d-flex mb-4 mt-10">
                    <h2>{{ $t("deforestation.geolocationPrivacy") }}
                        <v-tooltip top color="00BD73" max-width="350">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                                v-on="on">
                                mdi-alert-circle
                              </v-icon>
                            </template>
                            <span>{{ $t("deforestation.geolocationPrivacyTT") }}</span>
                        </v-tooltip>
                    </h2>
                <v-spacer></v-spacer>
                </div>
                <div>
                    {{ $t("deforestation.geolocationPrivacySubHeading") }}
                </div>
                <div class="d-flex">
                <v-switch inset class="v-input--reverse v-input--expand"
                    @change="updateGeolocationPrivacy"
                    v-model="isGeolocationPrivate"
                    persistent-hint
                    v-bind="getCheckboxProps()">
                    <template #label>
                    {{$t('deforestation.privacyEnabled')}}
                    </template>
                </v-switch>
                </div>
                <div class="d-flex mb-4 mt-10">
                    <h2>{{ $t("deforestation.totals") }}
                        <v-tooltip top color="00BD73" max-width="350">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                                v-on="on">
                                mdi-alert-circle
                              </v-icon>
                            </template>
                            <span>{{ $t("deforestation.totalsTT") }}</span>
                        </v-tooltip>
                    </h2>
                    <v-spacer></v-spacer>
                </div>
                <v-row>
                  <v-col cols="4">
                    <label>{{ $t('dueDiligence.netMassKG') }}</label>
                    <v-text-field height="5px" :placeholder="$t('dueDiligence.netMassKG')" disabled dense
                        v-model="netMass" class="shrink" :loading="!netMass" :suffix="eudrSettings.product_mass_unit" v-bind="getTextFieldProps()">
                    </v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <label>{{ $t('dueDiligence.volumeM') }}</label>
                    <v-text-field height="5px" :placeholder="$t('dueDiligence.volumeM')" disabled dense v-model="netVolume" :loading="!netVolume" :suffix="eudrSettings.volume_unit"
                         class="shrink" v-bind="getTextFieldProps()">
                    </v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <label>{{ $t('dueDiligence.areaInHA') }}</label>
                     <v-text-field height="5px" :placeholder="$t('dueDiligence.areaInHA')" disabled dense v-model="netArea" :loading="!netArea" suffix="ha"
                        class="shrink" v-bind="getTextFieldProps()">
                    </v-text-field>
                  </v-col> 
                </v-row>
                <div class="d-flex mb-4">
                    <h2>{{ $t("deforestation.productionPlaces") }}
                        <v-tooltip top color="00BD73" max-width="350">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                                v-on="on">
                                mdi-alert-circle
                              </v-icon>
                            </template>
                            <span>{{ $t("deforestation.productionPlacesTT") }}</span>
                        </v-tooltip>
                    </h2>
                    <v-spacer></v-spacer>
                </div>
                <v-card-text>
                    <v-data-table :headers="headers" :items="deforestationComplianceReports" :items-per-page="10"  hide-default-footer :loading="loading" :options.sync="options"
                        :loading-text="$t('loadingData')">
                        
                        <template v-slot:top="{ }">
                            <div class="d-flex justify-space-between filter-pro-places">
                                <div class="d-flex align-center">
                                        <label for="text">&nbsp;</label>
                                        <v-text-field prepend-inner-icon="mdi-magnify" height="5px"
                                        :placeholder="$t('search')"  dense v-model="search" @input="filterProductionPlaces"
                                        class="shrink" v-bind="getTextFieldProps()">
                                    </v-text-field>

                                        <v-autocomplete v-model="countryModel" item-text="name" item-value="name"
                                        :items="pcountries" class="mx-2" :label="$t('deforestation.allCountries')" @change="filterProductionPlaces"
                                        dense v-bind="getSelectProps()">
                                    </v-autocomplete>


                                    <!-- <v-select class="mx-2" v-model="producerModel" item-text="fullName" item-value="fullName"


                                        :items="producerLists" :label="$t('deforestation.producer')" @change="filterProducer"
                                        outlined dense>
                                    </v-select> -->
                                    <!-- <div class="d-flex justify-center align-center mb-5">
                                        <v-checkbox :label="$t('dueDiligence.onlyShowFarmsWithIssues')"></v-checkbox>
                                    </div> -->
                                </div>
                                <div class="d-flex mb-5 pagination">
                                    <div class="py-1 title">
                                        {{ from }} - {{ to }} of {{ totalProductionPlaces }}
                                    </div>
                                    <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page <= 1"
                                        @click="pageChange(false)" v-bind="getButtonProps()">
                                        <v-icon dark>
                                            mdi-chevron-left
                                        </v-icon>
                                    </v-btn>
                                    <v-btn class="mx-2" fab small outlined color="primary"
                                        :disabled="options.page >= totalPages" @click="pageChange(true)" v-bind="getButtonProps()">
                                        <v-icon dark>
                                            mdi-chevron-right
                                        </v-icon>
                                    </v-btn>

                                    <v-btn class="mx-2" @click="exportToPDF" fab small outlined color="primary" v-bind="getButtonProps()">
                                            <v-icon dark>
                                                mdi-tray-arrow-down
                                            </v-icon>
                                </v-btn>
                                <v-btn class="mx-2" v-if="productionPlaceCheckbox.length > 0" @click="deleteSelectedProductionPlace" fab small outlined color="primary" v-bind="getButtonProps()">
                                    <v-icon dark>
                                        mdi-delete
                                    </v-icon>
                        </v-btn>
                                </div>
                                <!-- <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page <= 1"
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
                                </v-btn> -->

                               
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
                        <template v-if="deforestationComplianceReports" v-slot:body="{ items }">
                            <tbody>
                                <tr v-for="item in items" :key="item.id" style="position: relative; width: 0; height: 0"
                                    @mouseover="selectItem(item)" @mouseleave="selectItem(false)">
                                    <td class="text-truncate">
                                        <v-checkbox
                                            @change="updateProductionPlaceCheckbox(item.id)"
                                            v-bind="getCheckboxProps()"
                                        ></v-checkbox>
                                    </td>
                                    <td class="text-truncate">
                                        {{ item.farm.farmName || '' }}<br>
                                        {{ item.farmId || '' }}
                                    </td>

                                    <td class="text-truncate">
                                        {{ item.farm?.userDdsAssoc?.firstName || '' }} {{ item.farm?.userDdsAssoc?.lastName || ''
                                        }}
                                    </td>

                                    <td class="text-truncate">
                                        {{ item.farm?.userDdsAssoc?.countryId }}
                                    </td>

                                    <td class="text-truncate" style="max-width: 300px;">
                                        {{ item.farm.address || '' }}
                                    </td>

                                    <td class="text-truncate">
                                        {{ item.farm.area ? parseFloat(item.farm.area * 0.404686).toFixed(5) : '' }}
                                    </td>

                                    <td class="text-truncate">
                                        {{ item.farmType || '' }}
                                    </td>
                                    <td class="d-flex justify-center align-center ga-3">
                                        <div v-if="shouldShowEditButton(item)">
                                            <a @click="editGeofenceMap(item)" class="text-decoration-underline" v-bind="getButtonProps()">{{
                                                $t('deforestation.editGeofence') }}</a>
                                                                </div>
                                        <div v-else>
                                            <a @click="viewGeofenceMap(item)" class="text-decoration-underline" v-bind="getButtonProps()">{{
                                                $t('deforestation.viewGeolocation') }}
                                            </a>
                                        </div>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn x-small fab v-bind="{...attrs, ...getButtonProps()}" v-on="on" color="primary"
                                                    @click="comfirmItemDelete(item)" style="margin-left: 20px;">
                                                    <v-icon style="color: white !important;">mdi-delete</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>{{ $t('delete') }}</span>
                                        </v-tooltip>

                                        <v-tooltip :key="item.id" bottom v-if="checkProductionPlaceWarning(item)">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon class="ml-2" v-bind="attrs" v-on="on" color="warning">mdi-alert</v-icon>
                                            </template>
                                            <span style="white-space-collapse: preserve-breaks">{{ checkProductionPlaceWarning(item) }}</span>
                                        </v-tooltip>
                                        <v-icon :key="item.id+'-check'" v-else>mdi-check</v-icon>

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
        <ViewGeoLocation v-if="showViewGeofenceMap" :dialog="showViewGeofenceMap" :disableEditGeofence="isEditGeofenceForCurrentItemDisabled" :farmDetails="currentItem"
            @closeViewGeoLocationModal="dismissViewGeoLocationModal"
            @saveViewGeoLocation="dismissViewGeoLocationModal" :diligenceReportId="diligenceId" />
        <!-- Edit geolocation components -->
        <EditGeoLocation v-if="showEditGeofenceMap" :dialog="showEditGeofenceMap" :farmDetails="currentItem"
            @closeGeoLocationModal="dismissEditGeoLocationModal" @saveEditGeoLocation="saveEditGeoLocationModal" :diligenceReportId="diligenceId" />

        <ConfirmBox v-if="deleteconfirm" :dialog="deleteconfirm" :title="confirmElements.title"
            :message1="confirmElements.message1" :message2="confirmElements.message2" confirmBtnText="Delete"
            :confirmData="itemToDelete" @continue:action="deleteProductionPlace"
            @cancel:action="deleteconfirm = false" />
         <ConfirmBox v-if="multipleDeleteConfirm" :dialog="multipleDeleteConfirm" :title="confirmElements.title"
            :message1="confirmElements.message1" :message2="confirmElements.message2" confirmBtnText="Delete"
             @continue:action="deleteMultipleProductionPlace"
            @cancel:action="multipleDeleteConfirm = false" />
            <LocationsModified 
            v-if="showLocationModified"
            :dialog="showLocationModified"
            :diligenceId="diligenceId"
            @closeLocationModifiedModal="dismissLocationModifiedModal"
            @confirmLocation="confirmLocation"
            @confirmProceed="confirmProceed"
            @viewGeofenceMap="viewGeofenceMap"
            @comfirmItemDelete="comfirmItemDelete"
            @getDeforestationEUDR="getDeforestationEUDR"
            />
    </div>
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import download from "@/mixins/DownloadMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import DateMixin from '@/mixins/DateMixin';
import UnitService from "@/_services/UnitService";
import DeforestationService from "@/_services/DeforestationService";
import ActivityLogService from "@/_services/ActivityLogService";
import { Point, Polygon } from '@flatten-js/core';
import EditGeoLocation from "../components/location-verification/EditGeoLocation.vue";
import ViewGeoLocation from "../components/location-verification/ViewGeoLocation.vue";
import ConfirmBox from "@/components/ConfirmBox";
import { getCountries } from "country-state-picker";
import LocationsModified from "../components/location-verification/LocationsModified.vue";
import { getGoogleMapsLoader } from '@/mixins/GoogleMapLoaderSingleton';

export default {
    components: {
        // GmapCluster,
        EditGeoLocation,
        ViewGeoLocation,
        ConfirmBox,
        LocationsModified
    },

    props: {
        diligenceId: {
            type: Number,
            required: true,
        },
    },
    async mounted() {
        this.$emit('resetLocationVerification');
        if(this.diligenceId){
            this.$store.dispatch('eudrDDS/setDiligenceData', {
                diligenceId: this.diligenceId
            })
            this.$emit('calculateWarningsForDeforestationAssessment', this.diligenceId);
            const key = `warnings_${this.diligenceId}`;
            const exists = localStorage.getItem(key) !== null;
            if(exists){
                const diligenceKey = Number(key.split('_')[1]);
                if(this.diligenceId == diligenceKey){
                    this.showVerification = false; // already checked overlap
                }
            }
            else{
                this.checkOverlap(); // check geofence overlap
            }
        }
        this.startLoading();
        await this.getEudrSettings();
        await this.getDuediligenceReportsDetail();
        
        await this.getDeforestationEUDR();
        this.stopLoading();
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
        if (this.farm && this.farm.lat && this.farm.log) {
            this.latitude = this.farm.lat;
            this.longitude = this.farm.log;
            this.mapOptions.center.lat = this.parentPolygonCoords.length > 0 ? this.parentPolygonCoords[0].lat : this.latitude;
            this.mapOptions.center.lng = this.parentPolygonCoords.length > 0 ? this.parentPolygonCoords[0].lng : this.longitude;
        } else {
            const productionPlace = this.productionPlaceData ? this.productionPlaceData[0] : null;
            if(productionPlace && productionPlace.latitude && productionPlace.longitude) {
                this.latitude = productionPlace.latitude;
                this.longitude = productionPlace.longitude;
            }
            this.mapOptions.center.lat = this.latitude;
            this.mapOptions.center.lng = this.longitude;

            const latLng = new this.google.maps.LatLng(
                this.mapOptions.center.lat,
                this.mapOptions.center.lng
            );

            if (this.map) this.map.setCenter(latLng);
        }

        this.googleMapLoader()
    },
    computed: {
        pcountries(){
            return [{ name: "All Countries" }, ...getCountries()];
        },
        getOrganizationId() {
            return this.$store.getters.getUser?.user_organization?.id;
        },
        isEditGeofenceForCurrentItemDisabled() {
            
            return this.currentItem?.farm?.GeoFences?.[0]?.generateMethod?.toLowerCase() === 'file';
        },
    },
    watch: {
        productionPlaceData: function (newVal) {
            this.productionPlaceData = newVal;
            this.loadMarkerForProductionPlaceData();
        },
        farmGeofenceType: function (value) {
            console.log(value)
            if (value === 'circular') {
                this.createCircle(this.farmGeofenceRadius);
            } else {
                this.circle && this.circle.setMap(null);
                this.farmGeofenceRadius = null

                this.createPolygon();
                this.createMarker();
                this.google.maps.event.clearListeners(this.map, 'click');
            }
        },
        farmGeofenceRadius: function (value) {
            this.circle.setMap(null);

            // Calculating area
            const areaConversionFactor = this.areaUnit === 1 ?  4046.8564224 : 10000;
            this.area = (Math.PI * Math.pow(value, 2)) / areaConversionFactor;
            this.createCircle(value);
        },
    },
    data() {
        return {
            isGeolocationPrivate: false,
            countryActivity: [],
            countryOfProduction: [],
            productionPlaceWarnings:[],
            productionPlaceCheckbox: [],
            warnings: [],
            showVerification: true,
            progressColor: "green",
            verifyingLocation: false,
            isExpanded: false,
            progress: 0,
            message: '',
            netMass:'',
            netVolume:'',
            netArea:'',
            eudrSettings: {},
            showEditGeofenceMap:false,
            showViewGeofenceMap: false,
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
                { lat: 25.774, lng: -80.190 },
                { lat: 18.466, lng: -66.118 },
                { lat: 32.321, lng: -64.757 }
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
                zoom: 4,
            },
            countryModel: [],
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
                itemsPerPage: 20,
                page: 1
            },
            from: 0,
            to: 0,
            headers: [
                {
                    text: '',
                    align: "start",
                   // class: "black--text",
                    sortable: false,
                },
                {
                    text: this.$t("deforestation.productionPlacesFarmAndFarmId"),
                    align: "start",
                    value: "farm.farmName",
                    class: "black--text",
                    sortable: true,
                },
                {
                    text: this.$t("deforestation.producerName"),
                    align: "start",
                    value: "farm.userDdsAssoc.fullName",
                    class: "black--text",
                    sortable: true,

                },

                {
                    text: this.$t('country'),
                    align: "start",
                    value: "farm.userDdsAssoc.countryId",
                    class: "black--text",
                    sortable: true,

                },

                {
                    text: this.$t("deforestation.addressOfProduction"),
                    align: "start",
                    value: "farm.address",
                    class: "black--text",
                    sortable: true,
                },
                {
                    text: this.$t("deforestation.areaHa"),
                    align: "start",
                    value: "farm.area",
                    class: "black--text",
                    sortable: true,
                },
                {
                    text: this.$t("deforestation.type"),
                    align: "start",
                    value: "farmType",
                    class: "black--text",
                    sortable: true,
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
                filterByDateOfLastReport: null,
                diligenceReportId: null,
            },
            deleteconfirm: false,
            multipleDeleteConfirm: false,
            confirmElements: {
                title: this.$t('dueDiligence.deleteProductionPlaceData'),
                confirmBtnText: this.$t('dueDiligence.areYouSureYouWantToContinueThisAction'),
                cancelBtnText: this.$t("cancel"),
                confirmData: {},
            },
            itemToDelete: {
                digligenceReportId: null,
                farmId: null
            },
            currentItem: null,
            producerLists: [{id:null, fullName:this.$t('deforestation.allProducer')}],
            totalPages: 1,
            productionPlaceData: [],
            producerModel:'',
            search: "",
            isProducerStore:false,
            isProducerFilterMode:false,
            showLocationModified: false,
        };
    },
    methods: {
        async updateGeolocationPrivacy() {
            try {
                await DeforestationService.updateGeolocationPrivacy(this.isGeolocationPrivate, parseInt(this.diligenceId));
                
                // Log geolocation privacy update
                try {
                    const userId = this.$store.getters.getUser?.id;
                    if (userId) {
                        await ActivityLogService.logDDSGeolocationPrivacyUpdated(
                            this.diligenceId,
                            userId,
                            this.isGeolocationPrivate
                        );
                    }
                } catch (logError) {
                    console.error('Error logging geolocation privacy update:', logError);
                }
            } catch (error) {
                console.error('Error updating geolocation privacy:', error);
            }
        },
        updateProductionPlaceCheckbox(itemId) {
            if(this.productionPlaceCheckbox.includes(itemId)) {
                this.productionPlaceCheckbox = this.productionPlaceCheckbox.filter((checkbox) => {
                    return checkbox !== itemId
                });
                return
            }
            this.productionPlaceCheckbox = [...this.productionPlaceCheckbox, itemId]
        },
        deleteSelectedProductionPlace() {
            this.multipleDeleteConfirm = true;
        },
        async deleteMultipleProductionPlace() {
            this.startLoading();
            if(!this.productionPlaceCheckbox || this.productionPlaceCheckbox.length === 0) {
                this.$notify({ title: this.$t('somethingWentWrong'), type: "error" });
            }
            try {
                let itemsToDelete = []
                await Promise.all(this.productionPlaceCheckbox.map((deleteItem) => {
                    let [item] = this.deforestationComplianceReports.filter((deforestationComplianceReport) => deforestationComplianceReport.id == deleteItem);
                    itemsToDelete.push(item);
                    return  DeforestationService.removeFarmFromProductionPlace(Number(this.diligenceId), Number(item.farmId));
                }))
                console.log(itemsToDelete, "itemsToDelete")
                this.stopLoading();
                this.isProducerStore = false,
                this.isProducerFilterMode = false
                await this.getDuediligenceReportsDetail();
                await this.getDeforestationEUDR();
                this.$notify({
                    title: this.$t('deforestation.itemDeletedSuccessfully'),
                    type: 'success'
                })
                
                // Log multiple production places deletion
                try {
                    const userId = this.$store.getters.getUser?.id;
                    if (userId) {
                        await ActivityLogService.logDDSMultipleProductionPlacesDeleted(
                            this.diligenceId,
                            userId,
                            this.productionPlaceCheckbox.length,
                            'User selected deletion'
                        );
                    }
                } catch (logError) {
                    console.error('Error logging multiple production places deletion:', logError);
                }
                
                this.productionPlaceCheckbox = [];
                this.multipleDeleteConfirm = false;
            } catch (err) {
                this.$notify({
                    title: err.message || this.$t("somethingWentWrong"),
                    type: "error",
                });
            }
            finally {
                this.stopLoading();
            }
        },
        async checkOverlap() {
            try {
                this.warnings = [];
                this.showVerification = true;
                this.verifyingLocation = true;

                // Log location overlap check started
                try {
                    const userId = this.$store.getters.getUser?.id;
                    if (userId) {
                        await ActivityLogService.logDDSLocationOverlapCheckStarted(
                            this.diligenceId,
                            userId
                        );
                    }
                } catch (logError) {
                    console.error('Error logging location overlap check start:', logError);
                }

                this.progress = 20;
                this.message = this.$t('deforestation.verifyingLocationsData');
                const response = await DeforestationService.checkPolygonOverlap(this.diligenceId);

                this.progress = 45;
                this.message = this.$t('deforestation.crossCheckingWithProductionPlaces');
                await this.sleep(1000);

                this.progress = 76;
                this.message = this.$t('deforestation.almostTherePleaseHoldOn');
                await this.sleep(1000);

                if (response.data.checkPolygonOverlap.success) {
                    this.progress = 100;
                    this.message = this.$t('deforestation.LocationVerifiedSuccessfully');
                    await this.sleep(1000);
                    this.message = this.$t('deforestation.allProductionPlacesAndLocationsHaveBeenConfirmed');
                    
                    // Log successful location overlap check
                    try {
                        const userId = this.$store.getters.getUser?.id;
                        if (userId) {
                            await ActivityLogService.logDDSLocationOverlapCheckCompleted(
                                this.diligenceId,
                                userId,
                                'Success',
                                this.warnings.length
                            );
                        }
                    } catch (logError) {
                        console.error('Error logging location overlap check completion:', logError);
                    }
                } else {
                    this.showVerification = false;
                    this.progress = 100;
                    this.progressColor = "orange"; 
                    this.warnings.push(response.data.checkPolygonOverlap.message);
                    this.message = response.data.checkPolygonOverlap.message;
                    
                    // Log failed location overlap check
                    try {
                        const userId = this.$store.getters.getUser?.id;
                        if (userId) {
                            await ActivityLogService.logDDSLocationOverlapCheckCompleted(
                                this.diligenceId,
                                userId,
                                'Failed',
                                this.warnings.length
                            );
                        }
                    } catch (logError) {
                        console.error('Error logging location overlap check completion:', logError);
                    }
                }
                this.verifyingLocation = false;
                this.$emit('warningLists',this.warnings);
            } catch (error) {
                this.progress = 100;
                this.progressColor = "red";
                this.verifyingLocation = false;
                this.message = this.$t('deforestation.errorCheckingOverlaps');
                console.error(error);
                
                // Log location overlap check failure
                try {
                    const userId = this.$store.getters.getUser?.id;
                    if (userId) {
                        await ActivityLogService.logDDSLocationOverlapCheckFailed(
                            this.diligenceId,
                            userId,
                            error.message || 'Unknown error'
                        );
                    }
                } catch (logError) {
                    console.error('Error logging location overlap check failure:', logError);
                }
            }
        },
        sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        },
        toggleExpand() {
            this.isExpanded = !this.isExpanded;
        },
        loadMarkerForProductionPlaceData() {
            const polygons = this.productionPlaceData.filter(p => p.farmType == 'polygon');
            const points = this.productionPlaceData.filter(p => p.farmType == 'point');
            polygons.forEach(async (polygon) => {
                if (!isNaN(Number(polygon.latitude)) && !isNaN(Number(polygon.longitude))) {
                    this.createMarker(polygon.latitude, polygon.longitude, 'polygon');
                } else {
                    this.createMarker(Number(polygon.coordinates[0].latitude), Number(polygon.coordinates[0].longitude), 'polygon');
                }
                await this.createPolygon(polygon);
            });

            points.forEach(async (point) => {
                this.createMarker(Number(point.latitude), Number(point.longitude), 'point', point.areaHa);
                await this.createCircle(point.radius, point.latitude, point.longitude, point.areaHa);
            });
        },
        async createPolygon(polygon) {
            if (this.polygon != null) this.polygon.setMap(null);
            this.polygon = await new this.google.maps.Polygon({
                paths: polygon.coordinates.map(x => { return {lat:x.latitude, lng:x.longitude}}),
                strokeColor: "#1F5D51",
                strokeOpacity: 0.8,
                strokeWeight: 3,
                fillColor: "#E5F8F1",
                fillOpacity: 0.7,
                editable: false,
                draggable: false,
                icon: this.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            });
            this.polygon.setMap(this.map);
            return Promise.resolve(true);
        },
        async googleMapLoader(){
            try {
                const loader = getGoogleMapsLoader();
                const google = await loader.load();
                await this.initializeMap(google);
                this.loader = loader;
            } catch (e) {
                console.log('Loader Error', e);
            }
        },
        async triggerSubmit() {
            this.$emit("fetchUpdatedProductionPlaceData", this.productionPlaceData);
            this.$emit('fetchStep3WarningData', this.productionPlaceWarnings)
            return {
                warnings: this.warnings
            }
        },
        getWarningMessage(item) {
            const { farm } = item;
            const areaInHa = farm && farm.area ? farm.area * 0.404686 : 0;
            if (areaInHa > 4 && item.farmType != 'Polygon') {
                return this.$t('deforestation.farmIsBiggerThan4HectaresItNeedsToBeAPolygon');
            } else {
                return '';
            }
        },
        shouldShowWarningIcon(item) {
            return this.shouldShowEditButton(item);
        },
        shouldShowEditButton(item) {
            const { farm, farmType } = item;
            const areaInHa = farm && farm.area ? farm.area * 0.404686 : 0;
            return farmType.toUpperCase() === 'POINT' && areaInHa > 4 && farm.GeoFences?.[0]?.generateMethod?.toLowerCase() !== 'file';
        },
        updateGeolocationData(data) {
            console.log({ data });
        },

        async comfirmItemDelete(item) {
            this.itemToDelete = {
                digligenceReportId: this.diligenceId,
                farmId: item.farmId
            }
            this.deleteconfirm = true;
        },

        async deleteProductionPlace() {
            this.startLoading();
            const deletedItem = this.itemToDelete;
            try {
                if (!deletedItem) {
                    this.$notify({
                        title: this.$t('somethingWentWrong'),
                        type: "error",
                    });
                }
                const res = await DeforestationService.removeFarmFromProductionPlace(this.diligenceId, deletedItem.farmId);

                const { success, message } = res.data.removeFarmFromProductionPlaceList;
                if (success) {
                    // Log the production place deletion
                    try {
                        const userId = this.$store.getters.getUser?.id;
                        if (userId) {
                            await ActivityLogService.logDDSProductionPlaceDeleted(
                                this.diligenceId,
                                userId,
                                deletedItem.farmId,
                                deletedItem.farmName || '',
                                'Location verification deletion'
                            );
                        }
                    } catch (logError) {
                        console.error('Error logging production place deletion:', logError);
                    }

                    // remove stored warnings;
                    const key = `warnings_${this.diligenceId}`;
                    const exists = localStorage.getItem(key) !== null;
                    if(exists){
                        localStorage.removeItem(key);
                    }

                    this.isProducerStore = false,
                    this.isProducerFilterMode = false
                    await this.getDuediligenceReportsDetail();
                    await this.getDeforestationEUDR();
                    if(this.diligenceId){
                        this.$store.dispatch('eudrDDS/setDiligenceData', {
                        diligenceId: this.diligenceId
                        })
                    }
                    this.$notify({
                        title: message || this.$t('deforestation.itemDeletedSuccessfully'),
                        type: 'success'
                    })
                }
                else {
                    this.$notify({
                        title: message || this.$t('somethingWentWrong'),
                        type: 'error'
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

        viewGeofenceMap(item) {
            this.currentItem = item;
            this.showViewGeofenceMap = true;
        },

        dismissViewGeoLocationModal() {
            this.currentItem = null;
            this.showViewGeofenceMap = false;
            this.getDeforestationEUDR();
        },

        dismissEditGeoLocationModal() {
            this.currentItem = null;
            this.showEditGeofenceMap = false;
        },

        editGeofenceMap(item) {
            // remove stored warnings;
            const key = `warnings_${this.diligenceId}`;
            const exists = localStorage.getItem(key) !== null;
            if(exists){
                localStorage.removeItem(key);
            }

            this.currentItem = item;
            this.showEditGeofenceMap = true;
        },
        async saveEditGeoLocationModal() {
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
        
        createMarker(lat, lng, type, area) {
            // if (this.marker != null) this.marker.setMap(null);
            // const latLng = { lat: 41.78500, lng: -87.75133 }
            const iconBlue = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
            const iconPurple = 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png';
            const iconYellow = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
            let icon = type == 'polygon' ? iconPurple : iconBlue;

            // console.log('area', area.toFixed(2))
            if (area && area.toFixed(2) >= 4) {
                icon = iconYellow
            }

            const latLng = new this.google.maps.LatLng(lat, lng);
            this.marker = new this.google.maps.Marker({
                position: latLng,
                icon
            });

            // To add the marker to the map, call setMap();
            this.marker.setMap(this.map);
        },
        createMarkerArray(latLngArray) {
            latLngArray.forEach((latLng, i) => {
                const coords = new this.google.maps.LatLng(latLng.latitude, latLng.longitude);

                this.markersArray[i] = new this.google.maps.Marker({
                    position: coords,
                    map: this.map,
                    // icon: (this.parentPolygonCoords.length - 1) == i ? svgMarkerRed : svgMarker,
                    icon: 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png',
                    // draggable: true,
                });
                this.markersArray[i].setMap(this.map);
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
        async createCircle(radius = 0, lat = null, lng = null, area) {
            this.circle = await new this.google.maps.Circle({
                fillColor: '#ffffff',
                strokeColor: '#ffffff',
                fillOpacity: 0.8,
                strokeWeight: 2,
                map: this.map,
                center: { lat, lng },
                radius
            });
            // this.circle.setMap(this.map);
            this.createMarker(lat, lng, 'point', area);
            return Promise.resolve(true);
        },
        
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
            const mapContainer = this.$refs.googleMap;
            if(!mapContainer) return;
            const center = new this.google.maps.LatLng(this.mapOptions.center.lat, this.mapOptions.center.lng);

            this.map = await new google.maps.Map(mapContainer, {
                mapTypeId: this.mapOptions.mapTypeId,
                zoom: this.mapOptions.zoom,
                center
            });
            this.loadMarkerForProductionPlaceData();
        },
        async getEudrSettings() {
            try {
                const { data } = await DeforestationService.getEudrSettings();
                this.eudrSettings = data.eudrSetting;
            } catch (err) {
                this.$notify({
                    text: this.$t('deforestation.failedToFetchSettings'),
                    type: 'error'
                });
            }
        },
        async getDeforestationEUDR(opt = null) {
            this.loading = true;
            const requestParams = {
                page: this.options.page,
                limit: this.options.itemsPerPage,
                search: this.search,
                isCertified: false,
                organization: this.getOrganizationId,
            }
            if (opt?.sortBy?.length) {
                requestParams.orderField = opt.sortBy[0]
                requestParams.order = opt.sortDesc[0] ? 'DESC' : 'ASC'
            }
            this.productionPlaceInput = { 
                ...this.productionPlaceInput,
                 page: this.options.page, 
                 limit : this.options.itemsPerPage, 
                 diligenceReportId: this.diligenceId,
                 searchPhrase:this.search,
                 farmCountry:this.countryModel
            }

            return DeforestationService.getProductionPlaces(this.productionPlaceInput).then(res => {
                this.googleMapLoader()
                this.deforestationComplianceReports = res.data.productionPlaces.rows
                if(!this.isProducerFilterMode){
                    this.copyReport = res.data.productionPlaces.rows 
                }
                this.totalProductionPlaces = res.data.productionPlaces.totalCount;
                this.totalPages = Math.ceil(this.totalProductionPlaces / this.options.itemsPerPage)
                this.from = (((this.options.page - 1) * this.options.itemsPerPage) + 1)
                this.to = (this.options.page * this.options.itemsPerPage) - (this.options.itemsPerPage - res.data.productionPlaces.rows.length)
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
                        userId: parseInt(item?.farm?.userDdsAssoc?.id),
                        aoiId: parseInt(item?.farm?.id),
                        latitude: parseFloat(item?.farm?.lat),
                        longitude: parseFloat(item?.farm?.log),
                        farmType: 'point',
                        areaHa: item.farm?item.farm.area * 0.404686 :0,
                        generateMethod: item.farm?.GeoFences?.[0]?.generateMethod,
                    };

                    if (item.farmType.toLowerCase() === 'point' && item?.farm?.GeoFences.length > 0) {
                        payloadItem.radius = item?.farm?.GeoFences[0]?.geofenceRadius / 1000; //convert radius from m to km;
                        payloadItem.farmType = 'point';
                        payloadItem.latitude = parseFloat(item?.farm?.lat);
                        payloadItem.longitude = parseFloat(item?.farm?.log);
                    } else if (item.farmType.toLowerCase() === 'polygon' && item?.farm?.FarmCoordinates) {
                        payloadItem.coordinates = item?.farm?.FarmCoordinates?.map((coord) => ({
                            latitude: parseFloat(coord.lat),
                            longitude: parseFloat(coord.log),
                        }));
                        payloadItem.farmType = 'polygon'
                    }
                    if(!this.isProducerStore){
                       this.producerLists.push({
                         id:item.farm.userDdsAssoc.id,
                         fullName:`${item.farm.userDdsAssoc.firstName} ${item.farm.userDdsAssoc.lastName}`
                       })
                    }
                    this.netArea = ((this.deforestationComplianceReports.reduce((a,b) => {
                        return a + parseFloat(b.farm.area)
                    },0)) / 2.47).toFixed(2)  

                    return payloadItem;
                    
                });
                this.loading = false
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
        filterProductionPlaces(){
          setTimeout(() => {
            this.isProducerStore = true
            this.getDeforestationEUDR()
          },1500) 
        },
        getDuediligenceReportsDetail() {
          const id = this.$route.params.id || null
          if(id){
            return DeforestationService.getDiligenceDetail(parseInt(id)).then(res => {
                const { productNetMass, productVolume, countryOfActivity, countryOfProduction, isGeolocationPrivate } = res.data.getDiligenceDetail
                this.netMass = UnitService.fromBase.weight(this.eudrSettings.product_mass_unit, parseFloat(productNetMass))
                this.netVolume = UnitService.fromBase.volume(this.eudrSettings.volume_unit, parseFloat(productVolume))
                this.countryActivity = countryOfActivity
                this.countryOfProduction = countryOfProduction
                this.isGeolocationPrivate = isGeolocationPrivate
                this.$store.commit('eudrDDS/SET_DILIGENCE_DETAILS', res.data.getDiligenceDetail);
            })
          }  
        },
        pageChange(t) {
            if (t) this.options.page = this.options.page + 1;
            else this.options.page = this.options.page - 1;
            this.getDeforestationEUDR();
        },
        filterProducer(){
          setTimeout(() => {
            this.isProducerFilterMode = true
            if(this.producerModel && this.producerModel  !== 'All Producers'){
                const splitName = this.producerModel.split(' ') 
                let firstName = splitName[0];
                let lastName = splitName.length > 1 ? splitName[1] : null;
                
                this.deforestationComplianceReports = this.copyReport.filter(item => {
                    if(firstName && lastName){
                        return item.farm.userDdsAssoc.firstName.includes(firstName) ||  item.farm.userDdsAssoc.lastName.includes(lastName)
                    }
                    if(firstName){
                      return item.farm.userDdsAssoc.firstName.includes(firstName)
                    }
                    if(lastName){
                      return item.farm.userDdsAssoc.lastName.includes(lastName);  
                    }  
                })   
            }else{
                this.deforestationComplianceReports = this.copyReport
            } 
          },1500)
        },
        async exportToPDF() {
            this.productionPlaceInput = { 
                ...this.productionPlaceInput,
                 page: this.options.page, 
                 limit : this.options.itemsPerPage, 
                 diligenceReportId: this.diligenceId,
                 searchPhrase:this.search,
                 farmCountry:this.countryModel
            }
            const querys = new URLSearchParams(this.productionPlaceInput).toString();
            const token = this.$store.state.auth.token
            this.startLoading()
            const url = process.env.VUE_APP_DEFORESTRATION_API_BASE_URL  || "http://localhost:4043/api"
            this.downloadSourceFileWithToken(`${url}/production-place/production-place-without-status-pdf?${querys}`, "application/pdf", token,"production-places.pdf")
                .then(() => {
                this.stopLoading()
                }).catch(() => {
                this.stopLoading()
            })
        },
        dismissLocationModifiedModal() {
            this.showLocationModified = false;
        },
        confirmLocation(val){
            this.$emit('confirmLocationVerification', val);
        },
        confirmProceed(val){
            this.$emit('confirmProceedToNextPage', val);
        },

        getAboveFourHectorFarm(item) {
            if(!item?.farm?.FarmCoordinates.length){
                const ha = item.farm?.area ? parseFloat(item.farm?.area * 0.404686).toFixed(5) : 0
                if(ha > 4) {
                    return true
                } 
            }
            return false
        },

        checkProductionPlaceWarning(item){
          const warnings = item.warnings
          let wr = `` 
          const above4ha = this.getAboveFourHectorFarm(item)
          if(!this.countryOfProduction?.length){
            wr +=`${this.$t('deforestation.farmCountryNotDefined')} \n`;
          }
          if(above4ha){
            wr +=`Circular geofence with area greater than 4 HA \n`;
          }
          if(warnings  && warnings.length){
            warnings.forEach(item => {
                if(item.is_ocean){
                   wr += `${this.$t('deforestation.geofenceIsInOcean')} \n`
                } 
                if(item.country && !this.countryOfProduction?.includes(item.country)){
                    wr += `${ this.$t('deforestation.theGeofencesSupposeToBeIn')} ${this.countryOfProduction.toString()} ${this.$t('deforestation.butItsIn')} ${item.country} \n`
                }
             })
          }
        //   if(!item.warnings){
        //     wr += `Could not verify the geofence yet.`
        //   }
          return wr
        }
    },
    mixins: [loadingMixin, download, getPermittedActions, DateMixin],
};
</script>
<style lang="scss">
.v-input--reverse .v-input__slot {
  flex-direction: row-reverse;
  justify-content: flex-end;
  .v-application--is-ltr & {
    .v-input--selection-controls__input {
      margin-right: 0;
      margin-left: 8px;
    }
  }
  .v-application--is-rtl & {
    .v-input--selection-controls__input {
      margin-left: 0;
      margin-right: 8px;
    }
  }
}
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
::v-deep .v-data-table-header span {
    text-transform: capitalize !important;
    color: black !important;
}
::v-deep .v-data-table-header {
    background-color: #F9A825 !important;
}
.filter-pro-places {
    flex-direction: column;

    @media (min-width: 1689px) {
        flex-direction: row;

    }
}

.pagination {
    align-self: flex-end;
    @media (min-width: 1689px) {
        align-self: center;
    }
}
</style>