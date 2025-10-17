<template>
    <div>
        <div class="header">
            <div class="app-bar-title">
                <a href="https://dimitra.io">
                    <img  src="https://dimitra.io/wp-content/themes/dimitra/assets/imgs/dimitralogo2023.svg"/>
                </a>
            </div>

            <div class="header-title">
                <img src="/img/eu.png" class="eu-img">
                <span>EUDR Due Diligence Compliance</span>
            </div>
        </div>

        <v-container fluid class="hero-bg">
            <v-container class="hero">
                <v-row style="max-width: 100%;">
                    <v-col cols="6" sm="8" md="8" class="large-text-box">
                        <h1 class="large-text">Verified <br> Compliance for a <br> Sustainable Future</h1>
                    </v-col>
                    <v-col cols="6" sm="6"  md="4">
                        <v-img class="hero-img" :src="logo"></v-img>
                    </v-col>
                </v-row>
            </v-container>

            <div class="compliance-sticker" v-if="report.status.toLowerCase() === 'compliant'">
                <v-img src="/img/eudr-dds/eudr-compliant.png"></v-img>
            </div>
        </v-container>

        <v-container class="conceal-overflow">
            <v-row>
                <v-col cols="12" sm="12" xs="12" md="6">
                    <v-card class="card">
                        <v-card-title class="card-title">
                            DUE DILIGENCE REPORT INFORMATION
                        </v-card-title>
                        <v-card-text class="card-text">
                            <v-row class="reportLine" v-for="info in reportInformation" v-bind:key="info.value">
                                <v-col style="text-align: left;">{{ info.title }}</v-col>
                                <v-col style="text-align: right; font-weight: 900">{{ report[info.value] || "N/A" }}</v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" sm="12" xs="12" md="6">
                    <v-card class="card">
                        <v-card-title class="card-title">
                            Commodities affected by eudr
                        </v-card-title>
                        <v-card-text>
                            <div class="commodity-tiles">
                                <v-card :class="(tile === report.type?.toLowerCase()) ? 'commodity-tile active': 'commodity-tile'" v-for="tile in tiles" :key="tile">
                                    <v-img :src="'/img/eudr-dds/eudr-' + tile + '.png'"></v-img>
                                    <p style="text-transform: capitalize;">{{ tile }}</p>
                                </v-card>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <div v-if="report.transaction">
                <div class="lined-header"><span>Blockchain Verification</span></div>

                <v-row class="pa-2rem">
                    <v-col cols="12" md="4" sm="12">
                        <qrcode :text="report.transaction.link"></qrcode>
                    </v-col>
                    <v-col cols="12" md="6" sm="12" class="blockchain-text">
                        <p>Scan this QR code to view the EUDR Due Diligence Report on the blockchain.</p>
                        <p><a :href="report.transaction.link">Click Here to View Report on Blockchain</a></p>
                        <p style="word-break: break-all">{{ report.transaction.transactionHash }}</p>
                    </v-col>
                </v-row>
            </div>

            <div class="lined-header"><span>Farm Locations</span></div>

            <v-row>
                <v-col>
                    <div class="google-map" style="width:100%;height:50vh; z-index: 0;" id="map" ref="googleMap">
                    </div>
                </v-col>
            </v-row>

            <div class="lined-header"><span>Download Farm Geofences</span></div>

            <v-card class="card" style="cursor: pointer;" @click="downloadGeoJSON">
                <v-row>
                    <v-col>
                        <p>Farm Geofence Geojson File</p>
                    </v-col>
                    <v-col style="text-align: right;">
                        <v-icon color="primary">mdi-download</v-icon>
                    </v-col>
                </v-row>
            </v-card>

            <div class="lined-header"><span>EUDR Due Diligence Report Summary</span></div>

            <v-row>
                <v-col cols="12" md="4" sm="12" v-for="(metric, i) in metricCards" v-bind:key="i">
                    <v-card class="status-card">
                        <v-card-title class="word-break">{{ metric.label }}</v-card-title>
                        <v-card-text>{{ metric.value }}</v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" md="4" sm="12" v-for="(metric, i) in deforestationCards" v-bind:key="i">
                    <v-card :class="'status-card ' + metric.color">
                        <v-card-title class="word-break">{{ metric.label }}</v-card-title>
                        <v-card-text>
                            <v-row justify="space-between">
                                <v-col cols="6">
                                    <small class="metric-label">Total Farms</small>
                                    <h3 class="metric-text">{{ metric.farms }}</h3>
                                </v-col>
                                <v-col cols="6">
                                    <small class="metric-label">Total Area</small>
                                    <h3 class="metric-text">{{  (metric.area / 2.47105).toFixed(4) }} ha</h3>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <!-- Commented until futhter logic is defined and implemented -->
            <!-- <div class="lined-header"><span>EUDR Protocol Verification Report</span></div>

            <v-row justify="space-between">
                <v-col cols="6" v-for="protocol in protocols" v-bind:key="protocol">
                    <v-card class="protocol-card">
                        <v-row>
                            <v-col cols="1">
                                <v-icon :class="report.status === 'Compliant' ? 'green': 'red'">
                                    {{ report.status === 'Compliant' ? 'mdi-check-circle': 'mdi-close-circle' }}
                                </v-icon>
                            </v-col>
                            <v-col cols="11" style="font-weight: 900;">{{ protocol }}</v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row> -->
        </v-container>

        <v-footer padless class="footer">
            <v-container>

                <v-row>
                    <v-col cols="12" md="9" sm="12">
                        <p class="footer-title">Company</p>
                     <v-row>
                      <v-col cols="12" xs="12" md="4" v-for="(links, i) in footer" v-bind:key="i">
                            <p v-for="link in links" v-bind:key="link.label">
                                <a :href="link.href">{{ link.label }}</a>
                            </p>
                        </v-col>
                      </v-row>  
                    </v-col>

                    <v-col cols="12" md="3" sm="12">
                        <p class="footer-title mrb-20">Community</p>
                        <p>
                            <a href="social.link" class="social" v-for="social in socials" v-bind:key="social.icon">
                                <v-icon class="white">{{ 'mdi-' + social.icon }}</v-icon>
                            </a>
                        </p>
                        <p>
                            <a href="https://dimitra.io/news/">News</a>
                        </p>
                    </v-col>
                </v-row>
                <v-row no-gutters justify="start">
                    <v-col cols="12" md="12">
                        <p><a href="#">&copy; Dimitra Incorporated</a></p>
                    </v-col>
                </v-row>
            </v-container>
        </v-footer>
    </div>
</template>

<script>
import DeforestationService from '@/_services/DeforestationService';
import DownloadMixin from '@/mixins/DownloadMixin';
import { countries } from '@/constants/countries.js'
import LoadingMixin from '@/mixins/LoadingMixin'
import { getGoogleMapsLoader } from '@/mixins/GoogleMapLoaderSingleton';

export default {
    computed: {
        reportEncId() {
            return encodeURIComponent(this.pageParams[0]);
        },
        logo() {
            return "https://dimitra-prod-public-images.s3.amazonaws.com/org/" + this.pageParams[1].replace("_", ".");
        },
        pageParams() {
            return this.$route.params.reportEncId.split("___");
        }
    },
    async mounted() {
        await this.fetchReportData()
        // Loading google map and geofences
        try {
            const loader = getGoogleMapsLoader();
            const google = await loader.load();
            await this.initializeMap(google);
            this.productionPlaces.forEach(({ farm: { GeoFences: geofences } }) => {
                geofences.forEach((geofence) => {
                    const radius = geofence.geofenceRadius;

                    if (radius !== null) {
                        // Circle
                        this.createCircle(
                            Number.parseFloat(radius), 
                            geofence.geofenceCenterLat, 
                            geofence.geofenceCenterLog
                        );
                    } else {
                        // Polygon
                        this.createPolygon(
                            geofence.geofenceCoordinates
                        );
                    }
                });
            });
           
            this.loader = loader;
        } catch (e) {
            console.log('Loader Error', e);
        }
    },
    methods: {
        async fetchReportData(){
            try{
                this.startLoading()
                const data = await DeforestationService.fetchPublicReport(this.reportEncId);
                this.report = data.report;
                this.metrics = data.metrics;
                this.productionPlaces = data.productionPlaces;

                const user = data.report?.operator || data.report?.user || data.report.supplier
                this.report.eoriNumber = user.eori_number;


                // Get operator name
                if (this.report.operator) {
                    this.report.operator = `${this.report.operator.firstName} ${this.report.operator.lastName}`;
                }else{
                    this.report.operator = `${this.report?.user.firstName} ${this.report?.user.lastName}`;
                }

                if (data.report.countryOfActivity instanceof Array) {
                    this.report.countryOfActivity = data.report.countryOfActivity[0];
                }

                if (data?.report?.transactions.length) {
                    this.report.transaction = data?.report?.transactions[0] 
                    this.report.transaction.link = data.blockchainLink;
                }

                if (data?.report?.transaction) {
                    this.report.transaction.link = data.blockchainLink;
                }


                this.report.type = this.report.product_detail.name;

                this.metricCards = [
                    {
                        label: "Total Number of Farms",
                        value: this.metrics.totalProductionPlaces
                    },
                    {
                        label: "Total Area",
                        value: `${this.metrics.totalArea} ha`
                    },
                    {
                        label: "Total No. of Geofence Polygons",
                        value: this.metrics.polygonProductionPlaces
                    },
                    {
                        label: "Total No. of Geofence Points",
                        value: this.metrics.pointProductionPlaces
                    },
                    {
                        label: "Total No. of Geofence Assessments",
                        value: this.metrics.totalDeforestationAssessments
                    },
                    {
                        label: "Total No. of Risk Assessments",
                        value: this.report.requiredAssessment.length
                    }
                ];

                this.deforestationCards = [
                    {
                        label: "Very High Deforestation Probability",
                        color: "very-high"
                    },
                    {
                        label: "High Deforestation Probability",
                        color: "high"
                    },
                    {
                        label: "Medium Deforestation Probability",
                        color: "medium"
                    },
                    {
                        label: "Low Deforestation Probability",
                        color: "low"
                    },
                    {
                        label: "Very Low Deforestation Probability",
                        color: "very-low"
                    },
                    {
                        label: "Zero/Negligible Deforestation Probability",
                        color: "zero"
                    },
                    {
                        label: "Manually Mitigated",
                        color: "zero"
                    },
                ].map((card) => {
                    const details = data.deforestationDetails[card.label];
                    return {
                        ...card,
                        ...details
                    };
                }); 
                this.stopLoading()
            }catch(e){
                this.stopLoading()
            }
        },
        roundUpToXixDecimal(input){
            return Math.ceil(Number(input) * 1e6) / 1e6; 
        },
        acreToHectare(acreValue){
            const hect = Number(acreValue) / 2.471
            return hect.toFixed(6)
        },
        removeDuplicateCoordinatesForPolygon(coordinates) {
            if (coordinates.length < 3) {
                return coordinates;
            }

            const uniqueCoordinates = [];
            const seenCoordinates = new Set();

            
            uniqueCoordinates.push(coordinates[0]);
            seenCoordinates.add(`${coordinates[0][0]},${coordinates[0][1]}`);

            
            for (let i = 1; i < coordinates.length - 1; i++) {
                const [lat, lon] = coordinates[i];
                const key = `${lat},${lon}`;
                if (!seenCoordinates.has(key)) {
                    seenCoordinates.add(key);
                    uniqueCoordinates.push([lat, lon]);
                }
            }
            uniqueCoordinates.push(coordinates[coordinates.length - 1]);
            return uniqueCoordinates;
        },
        createMarker(lat, lng, type) {
            const iconBlue = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
            const iconPurple = 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png';
            let icon = type == 'polygon' ? iconPurple : iconBlue;

            const latLng = new this.google.maps.LatLng(lat, lng);
            const marker = new this.google.maps.Marker({
                position: latLng,
                map: this.map,
                icon
            });

            this.markers.push(marker);
            return marker;
        },
        createPolygon(paths) {
            const polygon = new this.google.maps.Polygon({
                paths: paths.map(x => { return {lat: Number.parseFloat(x.lat), lng: Number.parseFloat(x.log)}}),
                strokeColor: "#A93EEA",
                strokeOpacity: 0.8,
                strokeWeight: 3,
                map: this.map,
                fillColor: "#A93EEA",
                fillOpacity: 0.5,
                editable: false,
                draggable: false
            });

            this.createMarker(paths[0].lat, paths[0].log, 'polygon');
            this.polygons.push(polygon);
        },
        createCircle(radius = 0, lat = null, lng = null) {
            const circle = new this.google.maps.Circle({
                fillColor: '#566DE3',
                strokeColor: '#566DE3',
                fillOpacity: 0.8,
                strokeOpacity: 1,
                strokeWeight: 2,
                map: this.map,
                radius,
                editable: false,
                draggable: false
            });

            const marker = this.createMarker(lat, lng, 'point');
            circle.bindTo('center', marker, 'position');
            this.circles.push(circle);
        },
        downloadGeoJSON() {
            const geoJSON = {
                type: "FeatureCollection",
                features: []
            }
            this.productionPlaces.forEach(item => {
                const {farm} = item
                const feature = {
                        type: "Feature",
                        geometry: {},
                        properties:{}
                }

                const countryISO2Code = countries.filter(x => 
                    x.Code.toLowerCase() == farm?.userDdsAssoc?.countryId?.toLowerCase() || 
                    x.Name.toLowerCase() == farm?.userDdsAssoc?.countryId?.toLowerCase()
                ) 
                feature.properties["ProducerName"] = `${farm?.userDdsAssoc?.firstName} ${farm?.userDdsAssoc?.lastName}`
                feature.properties["ProducerCountry"] = countryISO2Code.length ? countryISO2Code[0].Code : ""
                if(farm?.farmName && farm?.farmName?.trim()){
                    feature.properties["ProductionPlace"] = farm?.farmName  
                }

                if(item.farmType.toLowerCase() == 'point'){
                   feature.geometry["type"] = 'Point'
                   feature.geometry["coordinates"] = [
                     this.roundUpToXixDecimal(farm?.log),
                     this.roundUpToXixDecimal(farm?.lat)
                    ]
                    //Tempory fix for now
                    if(Number(farm?.area) != 9.8842){
                       feature.properties["Area"] = this.acreToHectare(farm?.area)
                    }
                }else{
                    feature.geometry["type"] = 'Polygon' 
                    const coordinates = farm?.FarmCoordinates?.map(x  => {
                        return [
                            this.roundUpToXixDecimal(x.log),
                            this.roundUpToXixDecimal(x.lat)
                        ]
                    })
                    feature.geometry["coordinates"] = [this.removeDuplicateCoordinatesForPolygon(coordinates)]
                }
                
                geoJSON.features.push(feature)
            })
            this.downloadObject(JSON.stringify(geoJSON), `dimitra-geojson-${this.report.type}-${Date.now()}`, '.geojson');
        },
        initializeMap(google) {
            this.google = google;
            const mapContainer = this.$refs.googleMap;
            if (!mapContainer) return;
            const center = new this.google.maps.LatLng(this.mapOptions.center.lat, this.mapOptions.center.lng);

            this.map = new google.maps.Map(mapContainer, {
                mapTypeId: this.mapOptions.mapTypeId,
                zoom: this.mapOptions.zoom,
                center
            });
        },
    },
    data() {
        return {
            circle: null,
            google: null,
            map: null,
            loader: null,
            mapOptions: {
                mapTypeId: "satellite",
                center: {
                 lat: -2.5489, lng: 118.0149
                },
                zoom: 4,
            },
            metricCards: [],
            deforestationCards: [],
            productionPlaces: [],
            metrics: [],
            protocols: [
                "Farm Location Verification",
                "Farm Size and Geofence Verification",
                "EUDR Deforestation Assessment",
                "Regional Risk Assessment",
                "Risk Assessment & Mitigation",
                "Protected & Indigenous Area Verification",
                "No Invasion of Protected Areas",
                "Habitat and Species Management Area Verification",
                "Strict Natural Reserve Verification",
                "Protected Area with Sustainable Use of Natural Resources Verification",
                "Verification in Registry of Employers with slavery-like conditions",
                "Verification in Registration of Environmental Assessments and Embargoes"
            ],
            footer: [
                [
                    {
                        label: "Contact Us",
                        href: "https://dimitra.io/contact-us/"
                    },
                    {
                        label: "Case Studies",
                        href: "https://dimitra.io/case-studies"
                    }
                ],
                [
                    {
                        label: "Business",
                        href: "https://dimitra.io/?page_id=303"
                    },
                    {
                        label: "Careers",
                        href: "https://dimitra.io/careers/"
                    }
                ],
                [
                    {
                        label: "Terms and Conditions",
                        href: "https://dimitra.io/careers/"
                    },
                    {
                        label: "Privacy Policy",
                        href: "https://dimitra.io/privacy-policy-2/"
                    },
                    {
                        label: "FAQ",
                        href: "#"
                    }
                ]
            ],
            socials: [
                {
                    icon: "facebook",
                    link: "https://www.facebook.com/dimitratech"
                },
                {
                    icon: "send",
                    link: "https://t.me/dimitraofficialgroup"
                },
                {
                    icon: "twitter",
                    link: "https://twitter.com/dimitratech"
                },
                {
                    icon: "instagram",
                    link: "https://www.instagram.com/dimitratech/"
                },
                {
                    icon: "linkedin",
                    link: "https://www.linkedin.com/company/dimitra-technology"
                },
                {
                    icon: "facebook-workplace",
                    link: "https://coinmarketcap.com/currencies/dimitra/"
                }
            ],
            reportInformation: [
                {
                    title: "EUDR Reference Number",
                    value: 'EUDRReferenceNumber'
                },
                {
                    title: "Internal Reference Number",
                    value: 'internalReferenceNumber'
                },
                {
                    title: "Activity",
                    value: 'activity'
                },
                {
                    title: "Country of Activity",
                    value: 'countryOfActivity'
                },
                {
                    title: "Country of Entry",
                    value: 'countryOfEntry'
                },
                {
                    title: "Operator Name",
                    value: 'operator'
                },
                {
                    title: "EORI Number",
                    value: 'eoriNumber'
                },
                {
                    title: "Product",
                    value: 'type'
                },
                {
                    title: "Status",
                    value: 'status'
                },
            ],
            report: {
                EUDRReferenceNumber: "N/A",
                internalReferenceNumber: "N/A",
                activity: "N/A",
                countryOfActivity: "N/A",
                countryOfEntry: "N/A",
                operator: "N/A",
                eoriNumber: "",
                product: "N/A",
                status: "N/A",
                type: "N/A"
            },
            tiles: ['coffee', 'cattle', 'cocoa', 'soya', 'wood', 'palm-oil', 'rubber'],
            polygons: [],
            circles: [],
            markers: []
        }
    },
    mixins: [ DownloadMixin,LoadingMixin ]
}
</script>

<style lang="scss" scoped>
$primary: rgb(22,79,36);

* {
  font-family: "Poppins", sans-serif;
}

::v-deep .card-title {
  word-break: normal !important;
  white-space: normal !important;
  overflow-wrap: break-word !important;
  hyphens: none !important;
}

.mrb-20{
    margin-bottom: 20px !important;
}

@font-face {
	font-family: pop_light;
	src: url('/font/Poppins-Light.ttf');
}
@font-face {
	font-family: pop_regular;
	src: url('/font/Poppins-Regular.ttf');
}
@font-face {
	font-family: Poppins-Medium;
	src: url('/font/Poppins-Medium.ttf');
}
@font-face {
	font-family: pop_semiBold;
	src: url('/font/Poppins-SemiBold.ttf');
}
::v-deep .v-app-bar-title__content {
    width: auto;
}
.white{
    color:#fff;
}
::v-deep .header {
    padding: 2rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
}

::v-deep .eu-img {
    height: 50px;
    width: 50px;
}

::v-deep .hero-img {
    width: 40%;
    height: auto;
    margin: auto;
}

::v-deep .hero-bg {
    position: relative;
    background: 
        linear-gradient(rgba(86, 86, 86, 0.5), rgba(184, 184, 184, 0.5)), /* dark overlay */
        url(/img/eudr-dds/public-nkg-header.png);              /* actual image */
    background-size: cover;
    background-position: center;
    margin-bottom: 4rem;
}

::v-deep .hero {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 600px;
}

::v-deep .card-title {
    color: $primary;
    font-weight: bolder;
    text-transform: uppercase;
    font-size: 32px;
    justify-content: center;
    margin-bottom: 24px;
}

::v-deep .card-text {
    font-size: 1.2em;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    height: 80%;
    margin-top: 10%;
}

::v-deep .v-icon {
    &.green {
        color: #00BD73;
    }

    &.red {
        color: #DA0005;
    }
}

::v-deep .card {
    padding: 2rem;
    height: 100%;
    border-radius: 24px;
}

::v-deep .protocol-card {
    margin-bottom: 12px;
    padding: 16px;
}

::v-deep .status-card {
    padding-left: 1rem;
    border-radius: 12px;
    border-left-width: 8px !important;
    border-left-style: solid;

    &.very-high {
        border-left-color: #8B0000;
    }

    &.high {
        border-left-color: #DA0005;
    }

    &.medium {
        border-left-color: #F06B20;
    }

    &.low {
        border-left-color: #F7970F;
    }

    &.very-low {
        border-left-color: #F6CE2F;
    }

    &.zero {
        border-left-color: #00BD73;
    }
}

::v-deep .blockchain-text {
    font-size: 1.5em;
    font-weight: bold;

    & > p {
        margin-bottom: 16px;
    }
}

::v-deep .conceal-overflow {
    overflow: hidden;
}

.commodity-tiles {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 2rem 5%;
}

.word-break {
  word-break: normal !important;
  white-space: normal !important;
  overflow-wrap: break-word !important;
  hyphens: none !important;
}

::v-deep .commodity-tile {
    flex-grow: 0;
    padding: 1.5rem 2.5rem;
    border-radius: 24px;

    &.active {
        background-color: #469d16;
    }

    p {
        padding-top: 24px;
        text-align: center;
        font-size: 1.2em;
        font-weight: bolder;
    }
}

::v-deep .centered-row {
    margin: 0 300px;
}

.header-title {
    color: green;
    font-size: 36px;
    padding-left: 50px;
    margin-left: 50px;
    border-left: 4px solid green;
    display: flex;
    flex-direction: row;
    gap: 20px;
    font-weight: bolder;
}

.large-text {
    color: white;
    font-size: 4rem;
    font-weight: bolder;
}
.compliance-sticker {
    position: absolute;
    right: 0;
    bottom: 10%;
    padding: 0 2rem 1rem 1rem;
    background-color: white;
}

.lined-header {
  line-height: 0.5;
  text-align: center;
  margin: 8rem 0 6rem 0;
  color: $primary;
}
.lined-header span {
  display: inline-block;
  position: relative;
  font-size: 3em;
  line-height: 3rem;
  font-weight: bolder;
  text-transform: uppercase
}

.lined-header span:before,
.lined-header span:after {
  content: "";
  position: absolute;
  height: 5px;
  border-bottom: 3px solid lightgray;
  top: 8px;
  width: calc(100vw);
}

.lined-header span:before {
  right: 100%;
  margin-right: 30px;
}

.lined-header span:after {
  left: 100%;
  margin-left: 30px;
}

.footer {
    background: #0EBF67;
    background: linear-gradient(269.28deg, #0E693C -7.07%, #0EBF67 85.48%);
    padding: 5rem 0;
    margin-top: 4rem;

    .social {
        margin-right: 5px;
    }

    p {
        margin: 12px 0;

        a {
            color: white;
            text-decoration: none;
        }
    }

    .footer-title {
        color: white;
        font-weight: bolder;
        font-size: 1.2em;
    }
}

.pa-2rem{
  padding: 0 2rem;
}

@media (max-width:1120px) {
    ::v-deep .header {
    justify-content: center;
  }  
  
  ::v-deep .header-title {
    border-left: none !important;
    margin-left: 0;
  }
  ::v-deep .large-text {
    font-size: 3rem;
  }
}
@media (max-width:600px) {
   ::v-deep .header-title{
   font-size: 1.5rem !important;
  }
  ::v-deep .large-text{
    font-size: 2.5rem;
  }
  ::v-deep .lined-header span{
    font-size: 2rem;
    line-height: 2.3rem;
  }
}

@media (max-width:410px) {
    ::v-deep .header-title{
        margin-left: 0;
    }
    ::v-deep .large-text-box {
        margin-bottom: 2rem;
    }
}
@media(max-width:390px){
::v-deep .compliance-sticker{
    bottom: 7%; 
}
}
</style>