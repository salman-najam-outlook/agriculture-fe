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
                <v-btn dark color="primary" outline
                    @click="handleGenerateCertificate"
                    class="mr-3">
                    {{ this.$t("deforestation.generateCertificate") }}
                </v-btn>
                <v-btn dark color="primary" outline
                    @click="$router.push({ name: 'ComplianceCertificationEudrAssessment', params: { id: eudrDetail.id } })"
                    class="mr-3">
                    {{ this.$t("deforestation.disputeAssessment") }}
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
                                                                    <v-icon v-bind="attrs" v-on="on">
                                                                        mdi-information-outline
                                                                    </v-icon>
                                                                </template>
                                                                <span>{{ this.$t('deforestation.tooltip.dimitraFarmId')
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
                                                                    <v-icon v-bind="attrs" v-on="on">
                                                                        mdi-information-outline
                                                                    </v-icon>
                                                                </template>
                                                                <span>{{ this.$t('deforestation.tooltip.farmName')
                                                                    }}</span>
                                                            </v-tooltip>
                                                        </v-list-item-subtitle>
                                                        <v-list-item-title class="text-h6 mt-2">
                                                            {{ eudrDetail.farmName }}
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
                                                                    <v-icon v-bind="attrs" v-on="on">
                                                                        mdi-information-outline
                                                                    </v-icon>
                                                                </template>
                                                                <span>{{
            this.$t('deforestation.tooltip.farmRegistrationId')
        }}</span>
                                                            </v-tooltip>
                                                        </v-list-item-subtitle>
                                                        <v-list-item-title class="text-h6 mt-2">
                                                            {{ eudrDetail.farmRegistrationId }}
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
                                                                    <v-icon v-bind="attrs" v-on="on">
                                                                        mdi-information-outline
                                                                    </v-icon>
                                                                </template>
                                                                <span>{{ this.$t('deforestation.tooltip.farmLocation')
                                                                    }}</span>
                                                            </v-tooltip>
                                                        </v-list-item-subtitle>
                                                        <v-list-item-title class="text-h6 mt-2">
                                                            {{ eudrDetail.locationName }}
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
                                                                    <v-icon v-bind="attrs" v-on="on">
                                                                        mdi-information-outline
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
                                                                    <v-icon v-bind="attrs" v-on="on">
                                                                        mdi-information-outline
                                                                    </v-icon>
                                                                </template>
                                                                <span>{{ this.$t('deforestation.tooltip.farmerName')
                                                                    }}</span>
                                                            </v-tooltip>
                                                        </v-list-item-subtitle>
                                                        <v-list-item-title class="text-h6 mt-2">
                                                            {{ eudrDetail.farmerName }}
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
                                                                    <v-icon v-bind="attrs" v-on="on">
                                                                        mdi-information-outline
                                                                    </v-icon>
                                                                </template>
                                                                <span>{{
            this.$t('deforestation.tooltip.farmerRegistrationId')
        }}</span>
                                                            </v-tooltip>
                                                        </v-list-item-subtitle>
                                                        <v-list-item-title class="text-h6 mt-2">
                                                            {{ eudrDetail.farmerRegistrationId }}
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
                                                                        {{ item.color }}
                                                                        <div
                                                                            class="color-box"
                                                                            :style="{ background: item.colorCode }"
                                                                        ></div>
                                                                    </div>
                                                                </td>
                                                                <td class="text-truncate text-right">
                                                                    {{ item.geofenceArea }}
                                                                </td>
                                                                <td class="text-truncate text-right">
                                                                    {{ item.percentageArea }}%
                                                                </td>
                                                            </tr>
                                                            <tr class="f-row"
                                                                style="position: relative; width: 0; height: 0">
                                                                <td colspan="2" class="text-truncate">
                                                                    {{ $t('deforestation.totalGeofenceArea') }}
                                                                </td>
                                                                <td class="text-truncate text-right">
                                                                    {{ convertSizeIntoBaseUnit(eudrDetail.totalArea) }}
                                                                </td>
                                                                <td class="text-truncate text-right">
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
import axios from 'axios'
import { convertSizeIntoBaseUnit } from "@/utils.js"
import { getGoogleMapsLoader } from '@/mixins/GoogleMapLoaderSingleton';

export default {
    created() {
        this.getDeforestationEUDR()
    },
    computed: {
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
            if(!Array.isArray(this.eudrDetail.metrics)) return []
            return this.eudrDetail.metrics.map(metric => ({
                id: metric.label,
                probability: metric.label,
                colorCode: metric.colorCode,
                color: metric.colorName,
                geofenceArea: convertSizeIntoBaseUnit(metric.area),
                percentageArea: parseFloat(metric.percent.toFixed(2)),
            }))
        }
    },
    data() {
        return {
            //overallProb:'High Deforestation Probability',
            base64OverlayImage: '',
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
                    align: "end",
                    value: "farmLocation",
                    class: "black--text",
                    sortable: false,
                },
                {
                    text: this.$t('deforestation.percentageOfGeofenceArea'),
                    align: "end",
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
            this.startLoading()
            await new Promise((resolve) => setTimeout(resolve, 100));
            let el = this.$refs.farmsReport;
            console.log(el)
            let canvasRes = await html2canvas(el, { scale: 2, useCORS: true });
            let outputDataUrl = canvasRes.toDataURL('image/jpeg')
            //var imageBlob = this.dataURLtoBlob(outputDataUrl);
            this.stopLoading()
            let mywindow = window.open('', 'PRINT', 'height=1000,width=800');
            mywindow.document.write(`
             <html>
              <head>
                <style>
                  body{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  }
                  img{
                    width:80%;
                  }
                </style>  
              </head>
              <body>
                <img src="${outputDataUrl}" />
             </body>
             </html>
            `)
            mywindow.print();
        },
        async calculateCoordsForPolygun(google) {
            const centerCoordinates = {
                lat: Number.parseFloat(this.mapOptions.center.lat),
                lng: Number.parseFloat(this.mapOptions.center.lng)
            }
            const geometry = await google.maps.importLibrary("geometry");
            const radius = Number.parseFloat(this.eudrDetail.radius) * Math.sqrt(2.0);
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
            DeforestationService.getEUDRAssessmentReportDetail(parseInt(this.$route.params.id), this.$store.getters.getAuthToken).then(async (res) => {
                this.eudrDetail = res.data.deforestation
                this.mapOptions.center.lat = Number.parseFloat(res.data.deforestation.centerLatitude);
                this.mapOptions.center.lng = Number.parseFloat(res.data.deforestation.centerLongitude);
                this.eudrDetail.coordinates = res.data.deforestation.coordinates.map(x => {
                    return {
                        lat: x.latitude,
                        lng: x.longitude
                    }
                })
                //this.eudrDetail.coordinates = this.polygonCoords
                //this.eudrDetail.reportType = 'REGISTERED_FARM'
                //console.log(res.data.deforestation)
                const data = await this.proxyImage(this.filterDeforestImage)
                this.deforestImage = 'data:image/jpeg;base64,' + data.data
                this.polygonCoords = this.eudrDetail.coordinates

                this.stopLoading()
                this.loading = false
                const loader = getGoogleMapsLoader()
                const google = await loader.load()
                await this.initializeMap(google)
                this.loader = loader
            }).catch(err => {
                this.loading = false
                console.log(err)
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
            class USGSOverlay extends google.maps.OverlayView {
                bounds_;
                image_;
                div_;
                constructor(bounds, image) {
                    super();
                    // Initialize all properties.
                    this.bounds_ = bounds;
                    this.image_ = image;
                    // Define a property to hold the image's div. We'll
                    // actually create this div upon receipt of the onAdd()
                    // method so we'll leave it null for now.
                    this.div_ = null;
                }
                /**
                 * onAdd is called when the map's panes are ready and the overlay has been
                 * added to the map.
                 */
                onAdd() {
                    this.div_ = document.createElement("div");
                    this.div_.style.borderStyle = "none";
                    this.div_.style.borderWidth = "0px";
                    this.div_.style.position = "absolute";

                    // Create the img element and attach it to the div.
                    const img = document.createElement("img");

                    img.src = this.image_;

                    // console.log(img, 'img')
                    img.style.width = "100%";
                    img.style.height = "100%";
                    img.style.position = "absolute";
                    this.div_.appendChild(img);

                    // Add the element to the "overlayLayer" pane.
                    const panes = this.getPanes();

                    panes.overlayLayer.appendChild(this.div_);
                }
                draw() {
                    // We use the south-west and north-east
                    // coordinates of the overlay to peg it to the correct position and size.
                    // To do this, we need to retrieve the projection from the overlay.
                    const overlayProjection = this.getProjection();
                    // Retrieve the south-west and north-east coordinates of this overlay
                    // in LatLngs and convert them to pixel coordinates.
                    // We'll use these coordinates to resize the div.
                    const sw = overlayProjection.fromLatLngToDivPixel(
                        this.bounds_.getSouthWest()
                    );
                    // console.log(sw, 'sw')
                    const ne = overlayProjection.fromLatLngToDivPixel(
                        this.bounds_.getNorthEast()
                    );
                    // console.log(ne, 'ne')

                    // Resize the image's div to fit the indicated dimensions.
                    if (this.div_) {
                        this.div_.style.left = sw.x + "px";
                        this.div_.style.top = ne.y + "px";
                        this.div_.style.width = ne.x - sw.x + "px";
                        this.div_.style.height = sw.y - ne.y + "px";
                        // console.log(ne.x - sw.x + "px", 'width')
                        // console.log(sw.y - ne.y + "px", 'height')
                    }

                }
                /**
                 * The onRemove() method will be called automatically from the API if
                 * we ever set the overlay's map property to 'null'.
                 */
                onRemove() {
                    if (this.div_) {
                        this.div_.parentNode.removeChild(this.div_);
                        this.div_ = null;
                    }
                }
            }
            this.map.fitBounds(bounds);
            const srcImage = this.deforestImage
            const overlay = new USGSOverlay(bounds, srcImage, document.getElementById('map'));
            overlay.setMap(this.map);
        },
        async createPolygon() {
            if (this.polygon != null) this.polygon.setMap(null);
            this.polygon = await new this.google.maps.Polygon({
                paths: this.polygonCoords,
                strokeColor: this.filterDeforestImage ? 'transparent' : '#1F5D51',
                strokeOpacity: 0.8,
                strokeWeight: 3,
                fillColor: "#E5F8F1",
                fillOpacity: 0,
                editable: false,
                draggable: false,
                icon: this.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW
            });

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
            this.startLoading()
            await new Promise((resolve) => setTimeout(resolve, 100));
            let fileName = `file_${new Date().getTime()}.jpg`;
            let el = this.$refs.googleMap;
            let canvasRes = await html2canvas(el, { scale: 2, useCORS: true });
            let outputDataUrl = canvasRes.toDataURL('image/jpeg');
            var imageBlob = this.dataURLtoBlob(outputDataUrl);

            const formData = new FormData();
            formData.append('file', imageBlob, fileName);
            formData.append('id', this.eudrDetail.id);
            const setting = JSON.parse(localStorage.getItem("gs"));
            if(setting?.areaUnit) {
                formData.append('userUnit', JSON.stringify(setting.areaUnit));
            }
            formData.append("platform","web");
            const data = await DeforestationService.downloadAssessmentReportPdf(formData);
            
            const link = document.createElement('a');
            link.target = "_blank";
            link.href = data.data.location;

            document.body.appendChild(link);

            link.click();

            this.stopLoading();
        },
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
.color-box{
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border-radius: 5px;
  margin-left: 10px;
  border: 1px solid #e2e2e2;
}

</style>
  
