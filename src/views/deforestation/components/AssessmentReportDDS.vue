<template>
    
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div class="d-flex mb-4">
                <h2>{{ $t('deforestation.assessmentReport') }}</h2>
                <v-spacer></v-spacer>
                <v-btn outlined @click="$router.go(-1)" color="primary" class="mr-3">
                    {{ this.$t("deforestation.back") }}
                </v-btn>
                <v-btn dark color="primary"
                    @click="$router.push({ name: 'ComplianceCertificationEudrAssessment', params: { id: eudrDetail.id } })"
                    v-if="pageType == 'certificate'" class="mr-3">
                    <v-icon> mdi-eye </v-icon>
                    {{ this.$t("deforestation.viewCertificate") }}
                </v-btn>
                <v-btn dark color="primary" outlined
                    @click="showDisputeModal = true"
                    class="mr-3">
                    {{ this.$t("deforestation.viewDisputeHistory") }}
                </v-btn>
                <v-btn @click="downloadEudrAssessmentReport" color="primary" dark class="mr-3">
                    <v-icon style="color: white !important;"> mdi-download </v-icon>
                </v-btn>
                <v-btn @click="print" color="primary" dark class="mr-3">
                    <v-icon style="color: white !important;"> mdi-printer </v-icon>
                </v-btn>
            </div>
            <v-card elevation="0">
                <v-card-text v-if="eudrDetail">
                    <div ref="farmsReport">
                        <v-card elevation="0" class="px-5 pb-10">
                            <v-card-title>
                                <span class="text-h5 font-weight-bold">{{ this.$t('deforestation.farmDetails') }}
                                </span>
                            </v-card-title>
                            <v-card-text>
                                <v-row class="mt-5 mb-10">
                                    <v-col sm="3">
                                        <v-card min-height="130" class="pa-2 green2 elevation-0">
                                            <v-list class="green2">
                                                <v-list-item three-line>
                                                    <v-list-item-content>
                                                        <v-list-item-subtitle>{{ this.$t('deforestation.dimitraFarmId')
                                                            }}
                                                            <v-tooltip top color="black" max-width="350">
                                                                <template v-slot:activator="{ on, attrs }">
                                                                    <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                                                    mdi-alert-circle
                                                                    </v-icon>
                                                                </template>
                                                                <span>{{ this.$t('deforestation.tooltip.dimitraFarmId' )
                                                                    }}</span>
                                                            </v-tooltip>
                                                        </v-list-item-subtitle>
                                                        <v-list-item-title class="text-h6 mt-2">
                                                            {{ eudrDetail.farmUUID || 'N/A' }}
                                                        </v-list-item-title>
                                                    </v-list-item-content>
                                                </v-list-item>
                                            </v-list>
                                        </v-card>
                                    </v-col>
                                    <v-col sm="3">
                                        <v-card min-height="130" class="pa-2 green2 elevation-0">
                                            <v-list class="green2">
                                                <v-list-item three-line>
                                                    <v-list-item-content>
                                                        <v-list-item-subtitle> {{ this.$t('deforestation.farmName') }}
                                                            <v-tooltip top color="black" max-width="350">
                                                                <template v-slot:activator="{ on, attrs }">
                                                                    <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                                                    mdi-alert-circle
                                                                    </v-icon>
                                                                </template>
                                                                <span>{{ this.$t('deforestation.tooltip.farmName')
                                                                    }}</span>
                                                            </v-tooltip>
                                                        </v-list-item-subtitle>
                                                        <v-list-item-title class="text-h6 mt-2">
                                                            {{ eudrDetail.farmName || 'N/A'}}
                                                        </v-list-item-title>
                                                    </v-list-item-content>
                                                </v-list-item>
                                            </v-list>
                                        </v-card>
                                    </v-col>
                                    <v-col sm="3">
                                        <v-card min-height="130" class="pa-2 green2 elevation-0">
                                            <v-list class="green2">
                                                <v-list-item three-line>
                                                    <v-list-item-content>
                                                        <v-list-item-subtitle>{{
                                                                this.$t('deforestation.farmRegistrationId') }}
                                                            <v-tooltip top color="black" max-width="350">
                                                                <template v-slot:activator="{ on, attrs }">
                                                                    <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                                                    mdi-alert-circle
                                                                    </v-icon>
                                                                </template>
                                                                <span>{{
                                                                        this.$t('deforestation.tooltip.farmRegistrationId')
                                                                        }}</span>
                                                            </v-tooltip>
                                                        </v-list-item-subtitle>
                                                        <v-list-item-title class="text-h6 mt-2">
                                                            {{ eudrDetail?.farm?.registrationNo || 'N/A' }}
                                                        </v-list-item-title>
                                                    </v-list-item-content>
                                                </v-list-item>
                                            </v-list>
                                        </v-card>
                                    </v-col>
                                    <v-col sm="3">
                                        <v-card min-height="130" class="pa-2 green2 elevation-0">
                                            <v-list class="green2">
                                                <v-list-item three-line>
                                                    <v-list-item-content>
                                                        <v-list-item-subtitle>{{ this.$t('deforestation.farmLocation')
                                                            }}
                                                            <v-tooltip top color="black" max-width="350">
                                                                <template v-slot:activator="{ on, attrs }">
                                                                    <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                                                    mdi-alert-circle
                                                                    </v-icon>
                                                                </template>
                                                                <span>{{ this.$t('deforestation.tooltip.farmLocation')
                                                                    }}</span>
                                                            </v-tooltip>
                                                        </v-list-item-subtitle>
                                                        <v-list-item-title class="text-h6 mt-2">
                                                            {{ eudrDetail.locationName || 'N/A' }}
                                                        </v-list-item-title>
                                                    </v-list-item-content>
                                                </v-list-item>
                                            </v-list>
                                        </v-card>
                                    </v-col>
                                    <v-col sm="3">
                                        <v-card min-height="130" class="pa-2 green2 elevation-0">
                                            <v-list class="green2">
                                                <v-list-item three-line>
                                                    <v-list-item-content>
                                                        <v-list-item-subtitle>{{
            this.$t('deforestation.dimitraFermerId') }}
                                                            <v-tooltip top color="black" max-width="350">
                                                                <template v-slot:activator="{ on, attrs }">
                                                                    <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                                                    mdi-alert-circle
                                                                    </v-icon>
                                                                </template>
                                                                <span>{{
            this.$t('deforestation.tooltip.dimitraFermerId')
        }}</span>
                                                            </v-tooltip>
                                                        </v-list-item-subtitle>
                                                        <v-list-item-title class="text-h6 mt-2">
                                                            {{ eudrDetail.farmerUUID || 'N/A' }}
                                                        </v-list-item-title>
                                                    </v-list-item-content>
                                                </v-list-item>
                                            </v-list>
                                        </v-card>
                                    </v-col>
                                    <v-col sm="3">
                                        <v-card min-height="130" class="pa-2 green2 elevation-0">
                                            <v-list class="green2">
                                                <v-list-item three-line>
                                                    <v-list-item-content>
                                                        <v-list-item-subtitle> {{ this.$t('deforestation.farmerName') }}
                                                            <v-tooltip top color="black" max-width="350">
                                                                <template v-slot:activator="{ on, attrs }">
                                                                    <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                                                    mdi-alert-circle
                                                                    </v-icon>
                                                                </template>
                                                                <span>{{ this.$t('deforestation.tooltip.farmerName')
                                                                    }}</span>
                                                            </v-tooltip>
                                                        </v-list-item-subtitle>
                                                        <v-list-item-title class="text-h6 mt-2">
                                                            {{ `${eudrDetail?.farm?.userDdsAssoc?.firstName} ${eudrDetail?.farm?.userDdsAssoc?.lastName}`}}
                                                        </v-list-item-title>
                                                    </v-list-item-content>
                                                </v-list-item>
                                            </v-list>
                                        </v-card>
                                    </v-col>
                                    <v-col sm="3">
                                        <v-card min-height="130" class="pa-2 green2 elevation-0">
                                            <v-list class="green2">
                                                <v-list-item three-line>
                                                    <v-list-item-content>
                                                        <v-list-item-subtitle>{{
            this.$t('deforestation.farmerRegistrationId')
        }}
                                                            <v-tooltip top color="black" max-width="350">
                                                                <template v-slot:activator="{ on, attrs }">
                                                                    <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                                                    mdi-alert-circle
                                                                    </v-icon>
                                                                </template>
                                                                <span>{{
            this.$t('deforestation.tooltip.farmerRegistrationId')
        }}</span>
                                                            </v-tooltip>
                                                        </v-list-item-subtitle>
                                                        <v-list-item-title class="text-h6 mt-2">
                                                            {{ eudrDetail?.farm?.farmerRegId || 'N/A'}}
                                                        </v-list-item-title>
                                                    </v-list-item-content>
                                                </v-list-item>
                                            </v-list>
                                        </v-card>
                                    </v-col>
                                </v-row>

                                <v-row>
                                    <v-col sm="12">
                                        <div class="google-map" style="width:100%;height:500px; z-index: 0;" id="map"
                                            ref="googleMap">
                                        </div>
                                    </v-col>
                                </v-row>

                                <br>
                                <v-row>
                                    <v-col cols="8">
                                        <v-card elevation="0" class="mt-5">
                                            <v-card-text>
                                                <v-data-table :headers="headers1" :items="deforestReports"
                                                    :footer-props="{
            'items-per-page-options': [10, 25, 50],
        }" class="overall-probability" hide-default-footer :loading="loading"
                                                    :options.sync="options">
                                                    <template v-slot:body="{ items }">
                                                        <tbody>
                                                            <tr v-for="item in items" :key="item.id"
                                                                style="position: relative; width: 0; height: 0">
                                                                <td class="text-truncate">
                                                                    {{ item.probability }}
                                                                </td>
                                                                <td class="text-truncate">
                                                                    <div class="d-flex justify-space-between w-75 mr-16">
                                                                        {{ item.colorName }}
                                                                        <div
                                                                            class="color-box"
                                                                            :style="{ background: item.colorCode }"
                                                                        ></div>
                                                                    </div>
                                                                </td>
                                                                <td class="text-truncate">
                                                                    {{ item.geofenceArea }}
                                                                </td>
                                                                <td class="text-truncate">
                                                                    {{ item.percentageArea }} %
                                                                </td>
                                                            </tr>
                                                            <tr :class="isIndonesianClient ? 'f-row-id' : isKenyaClient ? 'f-row-ke' : 'f-row'"
                                                                style="position: relative; width: 0; height: 0">
                                                                <td colspan="2" class="text-truncate">
                                                                    {{ $t('deforestation.totalGeofenceArea') }}
                                                                </td>
                                                                <td class="text-truncate">
                                                                    {{ convertSizeIntoBaseUnit(eudrDetail.totalArea) }}
                                                                </td>
                                                                <td class="text-truncate">
                                                                    100 %
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </template>
                                                    <template v-slot:footer></template>
                                                </v-data-table>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="4">
                                        <!-- v-if="eudrDetail.overallProb" -->
                                        <v-card elevation="0" class="mt-5">
                                            <v-card-text>
                                                <v-data-table :headers="headers2" :items="[{}]" :footer-props="{
                                                    'items-per-page-options': [10, 25, 50],
                                                }" class="overall-probability" hide-default-footer
                                                    :loading="loading = false" :options.sync="options">
                                                    <template v-slot:body="{ items }">
                                                        <tbody>
                                                            <tr v-for="item in items" :key="item.id"
                                                                style="position: relative; width: 0; height: 0">
                                                                <td class="text-truncate">
                                                                    <v-card height="200px"
                                                                        class="d-flex text-center justify-center align-center"
                                                                        elevation="0">
                                                                        <v-card-text v-if="typeof(eudrDetail.originalOverallProb || eudrDetail.overallProb) == 'string'">
                                                                            <v-btn small :style="{ color: (eudrDetail.originalOverallProb || eudrDetail.overallProb).toLowerCase().includes('zero') ? '#000000' : eudrDetail.overallProbColorCode }" rounded outlined>
                                                                                {{ $t(`deforestation.${eudrDetail.originalOverallProb || eudrDetail.overallProb}`) }}
                                                                            </v-btn>
                                                                        </v-card-text>
                                                                    </v-card>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </template>
                                                    <template v-slot:footer></template>
                                                </v-data-table>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                </v-row>
                                <!-- <v-chip x-small chip label color="error">
                                </v-chip> &nbsp;
                                {{ this.$t("deforestation.forestLoss") }}
                                <v-chip x-small chip label color="primary" dark class="mr-3 ml-3">
                                </v-chip> &nbsp;
                                {{ this.$t("deforestation.forestGain") }}

                                <p> If you have questions about this report or need help understanding it, contact us through
                                    the Help Desk.
                                </p> -->
                            </v-card-text>
                        </v-card>
                    </div>
                </v-card-text>
            </v-card>
            <DisputesDialog v-if="showDisputeModal" :dialogU="showDisputeModal" :reportRequestId="$route.params.reportRequestId"
                @closeDisputeDialog="showDisputeModal = false"></DisputesDialog>

                <div class="flex w-full justify-center text-center">
                    <p class="pt-8 pb-3 " 
                    v-if="eudrDetail?.modelVersion">Deforestation Model Version {{ eudrDetail?.modelVersion }}</p>    
                </div>
        </v-container>
    </div>
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import download from "@/mixins/DownloadMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import DateMixin from '@/mixins/DateMixin';
import DeforestationService from "@/_services/DeforestationService";
import html2canvas from 'html2canvas';
import DisputesDialog from "../dds/reports/components/eudr/DisputesDialog.vue";
import axios from 'axios';
import { convertSizeIntoBaseUnit, currentRoles } from "@/utils.js"
import { getGoogleMapsLoader } from '@/mixins/GoogleMapLoaderSingleton';
import { isIndonesianClient, isKenyaClient } from "@/utils";
export default {
    created() {
        this.getDeforestationEUDR();
        this.targetProductionPlace = {
            id: parseInt(this.$route.params.productionPlaceId),
            farm: {
                id: parseInt(this.$route.params.farmId)
            }
        };
    },
    components: {
        DisputesDialog
    },
    computed: {
        isIndonesianClient() {
            return isIndonesianClient();
        },
        isKenyaClient() {
            return isKenyaClient();
        },
        filterDeforestImage() {
            if (this.eudrDetail && this.eudrDetail.sateliteResponse.length) {
                const r = this.eudrDetail.sateliteResponse.filter(x => x.reportName.toLowerCase() == 'deforestation')
                return r.length ? r[0].imagePath : null
            }
            return null
        },
        pageType() {
            return this.$route.params.type == 'assignment' ? 'assignment' : 'certificate'
        },
        totalDeforestationPercentage() {
            if (!this.eudrDetail) return 'N/A'
            const isAllNumber = this.deforestReports.every(x => typeof x.percentageArea === 'number')
            if (!isAllNumber) return 'N/A'
            return this.deforestReports.map(x => {
                return x.percentageArea
            }).reduce((x, y) => {
                return x + y
            }, 0)

        },
        deforestReports() {
            if (!this.eudrDetail) return []
            return this.eudrDetail.metrics.map((metric, idx) => ({
                id: idx,
                probability: metric.label,
                colorName: metric.colorName,
                colorCode: metric.colorCode,
                geofenceArea: convertSizeIntoBaseUnit(metric.area),
                percentageArea: parseFloat(metric.percent.toFixed(2))
            }));
        }
    },
    data() {
        return {
            //overallProb:'High Deforestation Probability',
            base64OverlayImage: '',
            showDisputeModal: false,
            deforestImage: '',
            mapOptions: {
                mapTypeId: 'satellite',
                center: {
                    lat: null,
                    lng: null
                },
                zoom: 5,
                //mapTypeId: 'satellite',
                disableDefaultUI: true,
            },
            targetProductionPlace: {},
            options: {},
            polygonCoords: [],
            latitude: 24.886,
            longitude: -70.268,
            loader: null,
            google: null,
            eudrDetail: null,
            loading: true,
            polygon: null,
            tab: 0,
            selectedItem: false,
            headers2: [
                {
                    text: this.$t('deforestation.overallDeforestationProbability'),
                    align: "start",
                    value: "farmerName",
                    class: "black--text",
                    sortable: false,
                },
            ],
            headers1: [
                {
                    text: this.$t('deforestation.deforestationProbability'),
                    align: "start",
                    value: "farmerName",
                    class: "black--text",
                    sortable: false,
                },
                {
                    text: this.$t('deforestation.colorCode'),
                    align: "start",
                    value: "farmName",
                    class: "black--text",
                    sortable: false,
                },

                {
                    text: this.$t('deforestation.geofenceArea'),
                    align: "start",
                    value: "farmLocation",
                    class: "black--text",
                    sortable: false,
                },
                {
                    text: this.$t('deforestation.percentageOfGeofenceArea'),
                    align: "start",
                    value: "farmLocation",
                    class: "black--text",
                    sortable: false,
                },
            ],
            breadcrumbs: [
                {
                    text: this.$t("dashboard"),
                    disabled: false,
                    to: { name: "Users" },
                    exact: true,
                },
                {
                    text: this.$t("deforestation.deforestationComplianceReport"),
                    disabled: true,
                    href: "breadcrumbs_link_1",
                },
            ],
        };
    },
    methods: {
        convertSizeIntoBaseUnit,
        async print() {
            this.startLoading();
            await new Promise((resolve) => setTimeout(resolve, 100));

            // Get the element to be printed
            let el = this.$refs.farmsReport;
            let canvasRes = await html2canvas(el, { scale: 2, useCORS: true });
            let outputDataUrl = canvasRes.toDataURL('image/jpeg');
            this.stopLoading();
            let mywindow = window.open('', '_blank', 'height=1000,width=800');
            mywindow.document.write(`
                <html>
                <head>
                    <style>
                        body {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            margin: 0;
                        }
                        img {
                            width: 80%;
                        }
                    </style>  
                </head>
                <body>
                    <img src="${outputDataUrl}" />
                </body>
                </html>
            `);
            mywindow.document.close();
            mywindow.onload = () => {
                mywindow.print();
                mywindow.close();
            };
        },
        async calculateCoordsForPolygun(google) {
            const centerCoordinates = {
                lat: Number.parseFloat(this.mapOptions.center.lat),
                lng: Number.parseFloat(this.mapOptions.center.lng)
            }
            const geometry = await google.maps.importLibrary("geometry");
            const radius = Number.parseFloat(this.eudrDetail?.radius || 0) * Math.sqrt(2.0);
            const center = new google.maps.LatLng(centerCoordinates);

            const sw = geometry.spherical.computeOffsetOrigin(center, radius, 45.0);
            const ne = geometry.spherical.computeOffsetOrigin(center, radius, 225.0);
            return [sw, ne]
        },
        async proxyImage() {
            const location = this.filterDeforestImage
            if (location) {
                return await axios.post(`/proxy-image`, { location: location })
            }
        },
        async getDeforestationEUDR() {
            this.startLoading()
            this.loading = true
            DeforestationService.getComplianceDetails(parseInt(this.$route.params.reportRequestId), this.$store.getters.getAuthToken).then(async (res) => {
                if (!res.data || !res.data.deforestation) {
                    this.$notify({
                    text: 'Deforestation data not found for this farm ID.',
                    type: 'error',
                });
        }
                this.eudrDetail = res.data.deforestation
                this.mapOptions.center.lat = Number.parseFloat(res.data.deforestation?.centerLatitude);
                this.mapOptions.center.lng = Number.parseFloat(res.data.deforestation?.centerLongitude);
                this.eudrDetail.coordinates = res.data.deforestation?.coordinates.map(x => {
                    return {
                        lat: x.latitude,
                        lng: x.longitude
                    }
                })

                const data = await this.proxyImage(this.filterDeforestImage)
                this.deforestImage = 'data:image/jpeg;base64,' + data.data
                this.polygonCoords = this.eudrDetail.coordinates

                this.stopLoading()
                this.loading = false
                const loader = getGoogleMapsLoader()
                const google = await loader.load();
                await this.initializeMap(google);
                this.loader = loader

            }).catch(err => {
                this.loading = false
                console.log(err)
                this.$notify({
                    text: err.mesage,
                    type: 'error',
                });
                this.stopLoading()
            })
        },
        getPolygonBounds() {
            var paths = this.polygon.getPaths();
            var bounds = new this.google.maps.LatLngBounds();
            paths.forEach(function (path) {
                var ar = path.getArray();
                for (var i = 0, l = ar.length; i < l; i++) {
                    bounds.extend(ar[i]);
                }
            });
            return bounds;
        },
        async initializeMap(google) {
            this.google = google;
            const mapContainer = this.$refs.googleMap
            this.map = await new google.maps.Map(mapContainer, this.mapOptions);
            let bounds;
            if (this.eudrDetail.coordinates.length && this.eudrDetail.reportType == 'REGISTERED_FARM') {
                await this.createPolygon()
                bounds = this.getPolygonBounds()
            } else {
                const swne = await this.calculateCoordsForPolygun(google)
                bounds = new google.maps.LatLngBounds(swne[0], swne[1]);
            }
            // The custom USGSOverlay object contains the USGS image,
            // the bounds of the image, and a reference to the map.
            function USGSOverlay(bounds, image) {
                    this.bounds_ = bounds;
                    this.image_ = image;
                    this.div_ = null;
                }
                
                USGSOverlay.prototype = new google.maps.OverlayView();
                
                USGSOverlay.prototype.onAdd = function () {
                    this.div_ = document.createElement("div");
                    this.div_.style.borderStyle = "none";
                    this.div_.style.borderWidth = "0px";
                    this.div_.style.position = "absolute";
                
                    const img = document.createElement("img");
                    img.src = this.image_;
                    img.style.width = "100%";
                    img.style.height = "100%";
                    img.style.position = "absolute";
                    this.div_.appendChild(img);
                
                    const panes = this.getPanes();
                    panes.overlayLayer.appendChild(this.div_);
                
                    // Listen for image load event
                    const self = this;
                    img.onload = function () {
                    self.draw(); // Redraw when image is loaded
                    };
                };
                
                USGSOverlay.prototype.draw = function () {
                    const overlayProjection = this.getProjection();
                    if (!overlayProjection || !this.div_) return;
                
                    const sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
                    const ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());
                
                    this.div_.style.left = sw.x + "px";
                    this.div_.style.top = ne.y + "px";
                    this.div_.style.width = ne.x - sw.x + "px";
                    this.div_.style.height = sw.y - ne.y + "px";
                };
                
                USGSOverlay.prototype.onRemove = function () {
                    if (this.div_ && this.div_.parentNode) {
                    this.div_.parentNode.removeChild(this.div_);
                    this.div_ = null;
                    }
                };
                
                async function createImageOverlay(map, bounds, filterDeforestImage, proxyImageFunction) {
                    try {
                    const data = await proxyImageFunction(filterDeforestImage);
                    const srcImage = 'data:image/jpeg;base64,' + data.data;
                    const overlay = new USGSOverlay(bounds, srcImage);
                    overlay.setMap(map);
                    map.fitBounds(bounds);
                    } catch (error) {
                    console.error("Error creating image overlay:", error);
                    }
                }
                
                // Example usage:
                createImageOverlay(this.map, bounds, this.filterDeforestImage, this.proxyImage);
        },
        async createPolygon() {
            if (this.polygon != null) this.polygon.setMap(null);
            let polygonOption = {}
            if(this.eudrDetail.totalArea <= 0.247105)  { // to handle small overlays, google map api limitation
                polygonOption = {
                paths: this.polygonCoords,
                strokeColor:  '#0000ff',
                strokeOpacity: 1,
                strokeWeight: 1,
                fillColor: "#eb4034",
                fillOpacity: 0,
                zIndex: 100,
                editable: false,
                draggable: false,
                icon: this.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW
            }
            } else {
                polygonOption = {
                paths: this.polygonCoords,
                strokeColor: this.filterDeforestImage ? '#1F5D51' : '#1F5D51',
                strokeOpacity: 0.8,
                strokeWeight: 3,
                fillColor: "#E5F8F1",
                fillOpacity: 0,
                editable: false,
                draggable: false,
                icon: this.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW
            }
            }
            this.polygon = await new this.google.maps.Polygon(polygonOption);

            this.polygon.setMap(this.map);
            return Promise.resolve(true)
        },
        dataURLtoBlob(dataURL) {
            var arr = dataURL.split(',');
            var mime = arr[0].match(/:(.*?);/)[1];
            var bstr = atob(arr[1]);
            var n = bstr.length;
            var u8arr = new Uint8Array(n);

            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], { type: mime });
        },
        async downloadEudrAssessmentReport() {
            this.startLoading();

            // Wait a little before capturing
            await new Promise((resolve) => setTimeout(resolve, 200));

            // Get a reference to the map element
            let el = this.$refs.googleMap;

            // Disable pointer events temporarily to avoid hover effects during the capture
            el.style.pointerEvents = 'none'; 

            // Generate the file name
            let fileName = `file_${new Date().getTime()}.jpg`;

            try {
                // Capture the map as a canvas
                let canvasRes = await html2canvas(el, { scale: 2, useCORS: true });

                // Convert the canvas to a data URL (image format)
                let outputDataUrl = canvasRes.toDataURL('image/jpeg');
                var imageBlob = this.dataURLtoBlob(outputDataUrl);

                // Prepare form data for the file upload
                const formData = new FormData();
                formData.append('file', imageBlob, fileName);
                formData.append('id', this.eudrDetail.id);
                formData.append("platform", "web");
                formData.append("roles", currentRoles())

                // Append user unit settings if available
                const setting = JSON.parse(localStorage.getItem("gs"));
                if (setting?.areaUnit) {
                    formData.append('userUnit', JSON.stringify(setting.areaUnit));
                }

                // Call the service to generate the PDF and get the download link
                const data = await DeforestationService.downloadAssessmentReportPdf(formData);

                // Create a download link and trigger the download
                const link = document.createElement('a');
                link.target = "_blank";
                link.href = data.data.location;
                link.click();
            } catch (error) {
                console.error("Error generating PDF:", error);
            } finally {
                // Re-enable pointer events after capturing
                el.style.pointerEvents = ''; 

                this.stopLoading();
            }
        },

        // async downloadEudrAssessmentReport() {
        //     this.startLoading()
        //     await new Promise((resolve) => setTimeout(resolve, 100));
        //     let fileName = `file_${new Date().getTime()}.jpg`;
        //     let el = this.$refs.googleMap;
        //     let canvasRes = await html2canvas(el, { scale: 2, useCORS: true });
        //     let outputDataUrl = canvasRes.toDataURL('image/jpeg')
        //     var imageBlob = this.dataURLtoBlob(outputDataUrl);
        //     const formData = new FormData()
        //     formData.append('file', imageBlob, fileName);
        //     formData.append('id', this.eudrDetail.id)
        //     formData.append("platform", "web");
        //     const setting = JSON.parse(localStorage.getItem("gs"));
        //     if(setting?.areaUnit) {
        //         formData.append('userUnit', JSON.stringify(setting.areaUnit));
        //     }
        //     const data = await DeforestationService.downloadAssessmentReportPdf(formData)
        //     const link = document.createElement('a');
        //     link.target = "_blank"
        //     link.href = data.data.location
        //     link.click();
        //     this.stopLoading()
        // },
        async handleGenerateCertificate() {
            if(this.eudrDetail.isCertified) {
                this.$router.push({ name: 'ComplianceCertificationEudrAssessment', params: { id: this.eudrDetail.id } });
                return;
            }
            try {
                this.startLoading();
                const response = await DeforestationService.requestComplianceCertificate(this.eudrDetail.id, this.eudrDetail.userId);
                this.stopLoading();
                if(response.errors) {
                    this.$notify({
                        text: response.errors[0]?.message || 'Failed to generate certificate.',
                        type: 'error',
                    });
                } else {
                    this.$router.push({ name: 'ComplianceCertificationEudrAssessment', params: { id: this.eudrDetail.id } });
                }
            } catch(err) {
                this.stopLoading();
                this.$notify({
                    text: err.message || 'Failed to generate certificate.',
                    type: 'error',
                });
                console.error('Failed to generate certificate', err.mesage);
            }
        }
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

.summery {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
}

.summery-card {
    background: #0EBF67;
}

.summery-card p {
    padding: 10px;
    margin-bottom: 0px !important;
    color: #fff;
}

.summery-card .v-card__text {
    padding: 0;
}

.f-row {
    background: #0EBF67;
}

.f-row td {
    color: #fff;
}

.f-row:hover {
    background: #0EBF67 !important;
}

.f-row-id {
    background: #184980 !important;
    color: #fff !important;
}

.f-row-ke {
    background: #A75300 !important;
    color: #fff !important;
}

.f-row-ke:hover {
    background: #A75300 !important;
}

.color-box{
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border-radius: 5px;
  margin-left: 10px;
  border: 1px solid #e2e2e2;
}
.ptsi-brand {
    background-color: #184980;
}

.ptsi-brand td {
    color: #fff;
}

</style>