<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid ref="complianceReport">
      <div class="d-flex mb-4">
        <h2>{{ $t("deforestation.eudrForestAssessment") }}</h2> 
        <v-spacer></v-spacer>
        <v-btn @click="$router.go(-1)" outlined color="primary" class="mr-3">
          {{ this.$t("deforestation.back") }}
        </v-btn>
        <v-btn color="primary" dark class="mr-3" @click="downloadCompliancePdf">
          <v-icon class="pr-1"> mdi-tray-arrow-down </v-icon> &nbsp;
          {{ this.$t("deforestation.downloadPDF") }}
        </v-btn>
        <v-btn color="primary" dark class="mr-3" @click="printPage">
          <v-icon class="pr-1"> mdi-printer </v-icon> &nbsp;
          {{ this.$t("deforestation.print") }}
        </v-btn>
      </div>
      <div class="d-flex justify-space-between">
        <div style="max-width: 400px;">
          <h4>{{ $t('deforestation.locationName') }}</h4>
          <p style="font-size: 14px;">{{ complianceDetails.locationName }}</p>
        </div>
        <div>
          <h4>{{ $t("deforestation.assessmentNo") }}
            <v-tooltip top color="black" max-width="350">
                <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on">
                        mdi-information-outline
                    </v-icon>
                </template>
                <span>{{ this.$t('deforestation.tooltip.assessmentNo') }}</span>
            </v-tooltip>
          </h4>
          <p style="font-size: 14px;">{{ complianceDetails.reportGuid }}</p>
        </div>
      </div>

      <v-card elevation="0">
        <v-card-text>
          <v-row>
            <v-col>
              <P class="mb-0">{{ this.$t("deforestation.dimitraFarmId") }}</P>
              <h4 class="black--text">{{ complianceDetails.farmUUID ? complianceDetails.farmUUID : 'N/A' }}</h4>
            </v-col>
            <v-col>
              <P class="mb-0">{{ this.$t("deforestation.farmName") }}</P>
              <h4 class="black--text">{{ complianceDetails.farmName ? complianceDetails.farmName : 'N/A' }}</h4>
            </v-col>
            <v-col>
              <P class="mb-0">{{ this.$t("deforestation.farmRegistrationId") }}</P>
              <h4 class="black--text">{{ complianceDetails?.farm?.registrationNo ? complianceDetails?.farm?.registrationNo : 'N/A' }}</h4>
            </v-col>
            <v-col>
              <P class="mb-0">{{ this.$t("deforestation.farmLocation") }}</P>
              <h4 class="black--text">{{ complianceDetails.locationName ? complianceDetails.locationName : 'N/A'}}</h4>
            </v-col>
            <v-col>
              <P class="mb-0">{{ this.$t("deforestation.dimitraFermerId") }}</P>
              <h4 class="black--text">{{ complianceDetails.farmerUUID ? complianceDetails.farmerUUID : 'N/A'}}</h4>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <P class="mb-0">{{ this.$t("deforestation.farmerName") }}</P>
              <h4 class="black--text">{{ complianceDetails?.farm?.userDdsAssoc?.firstName ?? '' + ' '+ complianceDetails?.farm?.userDdsAssoc?.lastName ?? ''   }}</h4>
            </v-col>
            <v-col>
              <P class="mb-0">{{ this.$t("deforestation.farmerRegistrationId") }}</P>
              <h4 class="black--text">{{ complianceDetails?.farm?.farmerRegId ? complianceDetails?.farm?.farmerRegId : 'N/A'}}</h4>
            </v-col>
            <v-col> </v-col>
            <v-col> </v-col>
            <v-col> </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card elevation="0" class="mt-5">
        <v-card-text>
          <v-row class="fill-height" align="center" justify="center">
            <!-- <v-img src="/img/deforestration-map.png"> </v-img> -->
            <v-col sm="12">
                <div class="google-map" style="width:100%;height:500px; z-index: 0;" id="map"
                    ref="googleMap">
                </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-row>
        <v-col cols="8">
          <v-card elevation="0" class="mt-5">
            <v-card-text>
              <v-data-table
                :headers="headers1"
                :items="probabilityLists"
                :footer-props="{
                  'items-per-page-options': [10, 25, 50],
                }"
                hide-default-footer
                :loading="loading"
                :options.sync="options"
              >
                <template
                  v-if="probabilityLists.length"
                  v-slot:body="{ items }"
                >
                  <tbody>
                    <tr
                      v-for="item in items"
                      :key="item.id"
                      style="position: relative; width: 0; height: 0; "
                      :style="{
                        background: `${item.id == 3 ? '#117443' : ''}`,
                        color: `${item.id == 3 ? 'white' : ''}`
                      }"
                    >
                      <td class="text-truncate">
                        {{ item.deforestationProbability }}
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

                      <td class="text-truncate">
                        {{ item.geofenceArea != null ? convertSizeIntoBaseUnit(item.geofenceArea) : convertSizeIntoBaseUnit(0) }}
                      </td>

                      <td class="text-truncate">
                        {{
                          item.percentageOfGA != null ? item.percentageOfGA : "0"
                        }}
                        %
                      </td>
                    </tr>
                    <tr  class="f-row" :style="{
                        position: 'relative',
                        width: '0',
                        height: '0',
                        ...(isIndonesianClient1 ? {backgroundColor: '#184980'} : isKenyaClient ? {backgroundColor: '#A75300'} : {backgroundColor: '#0EBF67'}),
                        color: '#fff'
                    }">
                        <td colspan="2" class="text-truncate">
                            {{ $t('deforestation.totalGeofenceArea') }}
                        </td>
                        <td class="text-truncate">
                            {{ convertSizeIntoBaseUnit(complianceDetails.totalArea) }}
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

          <v-card elevation="0" class="mt-5">
            <v-card-text>
              <v-data-table
                
                :items="[{}]"
                :footer-props="{
                  'items-per-page-options': [10, 25, 50],
                }"
                hide-default-footer
                :loading="loading"
                :options.sync="options"
                class="overall-probability"
              >
                <template
                  v-if="probabilityLists.length"
                  v-slot:body="{ items }"
                >
                  <tbody style="height: 250px;">
                    <tr
                      v-for="item in items"
                      :key="item.id"
                      style="position: relative; width: 0; height: 0"
                      class="p-10"
                    >
                      <td>
                        <div class="m-4 text-center px-10">
                          {{ $t("deforestation.blockchainCertificateDesc")}}
                        </div>
                      </td>

                      <td>
                        <div class="text-center px-10">
                          <h5>{{ $t("deforestation.blockchainValidation")}}</h5>
                          <h2
                            class="primary--text text-decoration-underline py-3" style="cursor: pointer;"
                            @click = "openLink"
                          >
                          {{ $t("deforestation.openBlockchainPage")}}
                          </h2>
                          <p>
                            {{ $t("deforestation.clickLinkDesc")}}
                          </p>
                        </div>
                      </td>

                      <td>
                        <div class="d-flex flex-column align-start pl-10">
                          <p>
                           {{ $t("deforestation.shareCertificate")}}
                          </p>
                          <div class="d-flex align-center">
                            <div class="qr-code" v-if="complianceDetails.etherScanLink">
                              <qr-code :text="complianceDetails.etherScanLink">  </qr-code>
                            </div>

                            <v-btn icon class="mx-5 px-5" @click="printPage">
                              <v-icon class="primary--text" x-large>
                                mdi-printer-outline
                              </v-icon>
                            </v-btn>

                            <v-btn icon class="mr-5 px-5">
                              <v-icon
                                @click="openQrModel"
                                class="primary--text"
                                x-large
                              >
                                mdi-share
                              </v-icon>
                            </v-btn>
                          </div>
                        </div>
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
          <v-card elevation="0" class="mt-5">
            <v-card-text>
              <v-data-table
                :headers="headers2"
                :items="[{}]"
                :footer-props="{
                  'items-per-page-options': [10, 25, 50],
                }"
                class="overall-probability"
                hide-default-footer
                :loading="loading"
                :options.sync="options"
              >
                <template v-slot:body="{ items }">
                  <tbody>
                    <tr
                      v-for="item in items"
                      :key="item.id"
                      style="position: relative; width: 0; height: 0"
                    >
                      <td class="text-truncate">
                        <v-card
                          height="200px"
                          class="d-flex text-center justify-center align-center"
                          elevation="0"
                        >
                          <v-card-text v-if="typeof(complianceDetails.originalOverallProb || complianceDetails.overallProb) == 'string'">
                              <v-btn small :style="{ color: (complianceDetails.originalOverallProb || complianceDetails.overallProb).toLowerCase().includes('zero') ? '#000000' : complianceDetails.overallProbColorCode }" rounded outlined>
                                {{  $t(`deforestation.${complianceDetails.originalOverallProb || complianceDetails.overallProb}`) }}
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

      <qr-popup
        :dialogI="dialogI"
        :detail="complianceDetails"
        @closeEvent="qrModel"
      >
      </qr-popup>
      <div class="flex w-full justify-center text-center">
        <p class="pt-8 pb-3 " 
        v-if="complianceDetails.modelVersion">Deforestation Model Version {{ complianceDetails.modelVersion }}</p>    
    </div>
    </v-container>
  </div>
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import download from "@/mixins/DownloadMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import DateMixin from "@/mixins/DateMixin";
import DeforestationService from "@/_services/DeforestationService";
import moment from "moment";
import QrPopup from "./QrPopup.vue";
import html2canvas from "html2canvas";
import axios from "axios";
import VueQRCodeComponent from "vue-qrcode-component";
import {convertSizeIntoBaseUnit, currentRoles, isIndonesianClient, isKenyaClient} from "@/utils.js"
import { getGoogleMapsLoader } from '@/mixins/GoogleMapLoaderSingleton';
export default {
  created() {
    const fetchData = async () => {};
    fetchData();
  },
  components: {
    QrPopup,
    ["qr-code"]: VueQRCodeComponent,
  },
  mounted() {
    this.complianceId = parseInt(this.$route.params.id);
    this.getComplianceDetails(this.complianceId);
  },
  computed: {
    isIndonesianClient1() {
        return isIndonesianClient();
     },
     isKenyaClient() {
        return isKenyaClient();
     },
    filterDeforestImage() {
      if (
        this.complianceDetails &&
        this.complianceDetails.sateliteResponse.length
      ) {
        const r = this.complianceDetails.sateliteResponse.filter(
          (x) => x.reportName.toLowerCase() == "deforestation"
        );
        return r.length ? r[0].imagePath : null;
      }
      return null;
    },
  },
  data() {
    return {
      totalGeofenceArea: '',
      dialogI: false,
      complianceId: null,
      probabilityLists: [
       
      ],
      loading: false,
      totalDeforestationComplianceReports: 0,
      tab: 0,
      selectedItem: false,
      options: {},
      search: "",
      from: 0,
      to: 0,
      totalPages: 1,
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
          text:  this.$t('deforestation.percentageOfGeofenceArea'),
          align: "start",
          value: "area",
          class: "black--text",
          sortable: false,
        },
      ],
      headers2: [
        {
          text:  this.$t('deforestation.overallDeforestationProbability'),
          align: "start",
          value: "farmerName",
          class: "black--text",
          sortable: false,
        },
      ],
      headers3: [
        
      ],
     
     
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: false,
          to: { name: "Users" },
          exact: true,
        },
        {
          text: this.$t("deforestation.eudrForestAssessment"),
          disabled: true,
          href: "breadcrumbs_link_1",
        },
      ],

      complianceDetails: {},


      base64OverlayImage: '',
      mapOptions: {
        mapTypeId: "satellite",
        center: {
          lat: null,
          lng: null,
        },
        zoom: 5,
        disableDefaultUI: true,
        fullscreenControl: true,
        mapTypeControl: true,
      },
      polygonCoords: [],
      loader: null,
      google: null,
      polygon: null,
      deforestImage: "",
    };
  },
  methods: {
    convertSizeIntoBaseUnit,
    openLink(){
      window.open(this.complianceDetails.etherScanLink,"_blank");
    },

    async printPage() {
      this.startLoading()
            await new Promise((resolve) => setTimeout(resolve, 100));
            let el = this.$refs.complianceReport;
            console.log(el)
            let canvasRes = await html2canvas(el, 
            { 
              scale: 2, 
              useCORS: true,
              ignoreElements: element => {
                return element.tagName === 'BUTTON';
              }
            });
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
        lng: Number.parseFloat(this.mapOptions.center.lng),
      };
      const geometry = await google.maps.importLibrary("geometry");
      const radius =
        Number.parseFloat(this.complianceDetails.radius) * Math.sqrt(2.0);
      const center = new google.maps.LatLng(centerCoordinates);

      const sw = geometry.spherical.computeOffsetOrigin(center, radius, 45.0);
      const ne = geometry.spherical.computeOffsetOrigin(center, radius, 225.0);
      return [sw, ne];
    },
    async proxyImage() {
      const location = this.filterDeforestImage;
      if (location) {
        return await axios.post(`/proxy-image`, { location: location });
      }
    },
    openQrModel() {
      this.dialogI = true;
    },
    qrModel() {
      this.dialogI = false;
    },
    print() {},

    generateProbabilityList() {
      const list = [];
      if(Array.isArray(this.complianceDetails.metrics)) {
        this.complianceDetails.metrics.forEach((metric) => {
          list.push({
            id: metric.label,
            deforestationProbability: metric.label,
            colorCode: metric.colorCode,
            color: metric.colorName,
            geofenceArea: metric.area,
            percentageOfGA: parseFloat(metric.percent.toFixed(2)),
          })
        })
      }
      return list;
    },

    setHeader3Data(totalArea){
      this.headers3 = [
      {
          text: this.$t("deforestation.totalGeofenceArea"),
          align: "start",
          value: "farmerName",
          class: "black--text",
          sortable: false,
          width: 311
        },
        {
          text: `${convertSizeIntoBaseUnit(totalArea) || 0 }`,
          align: "start",
          value: "farmName",
          class: "black--text",
          sortable: false,
          width: 311
        },

        {
          text: "100%",
          align: "start",
          value: "farmLocation",
          class: "black--text",
          sortable: false,
          width: 10
        },
      ]
    },


    async getComplianceDetails() {
      this.startLoading();
      DeforestationService.getComplianceDetails(
        this.complianceId,
        this.$store.getters.getAuthToken
      )
        .then(async (res) => {
          this.complianceDetails = res.data.deforestation;
          this.setHeader3Data(res.data.deforestation.totalArea)
          this.totalGeofenceArea = res.data.deforestation.totalArea
          this.probabilityLists = this.generateProbabilityList()
          this.mapOptions.center.lat = Number.parseFloat(
            res.data.deforestation.centerLatitude
          );
          this.mapOptions.center.lng = Number.parseFloat(
            res.data.deforestation.centerLongitude
          );
          this.complianceDetails.coordinates = res.data.deforestation.coordinates.map(
            (x) => {
              return {
                lat: x.latitude,
                lng: x.longitude,
              };
            }
          );
          this.polygonCoords = this.complianceDetails.coordinates;
          if(this.filterDeforestImage){
            const data = await this.proxyImage(this.filterDeforestImage);
            this.deforestImage = "data:image/jpeg;base64," + data.data;
          }
          this.stopLoading();
          const loader = getGoogleMapsLoader();
          const google = await loader.load();
          await this.initializeMap(google);
          this.loader = loader;
        })
        .catch((error) => {
          this.stopLoading();
          console.error(error);
        });
    },
    dataURLtoBlob(dataURL) {
      var arr = dataURL.split(",");
      var mime = arr[0].match(/:(.*?);/)[1];
      var bstr = atob(arr[1]);
      var n = bstr.length;
      var u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new Blob([u8arr], { type: mime });
    },

    getPolygonBounds() {
      var paths = this.polygon.getPaths();
      var bounds = new this.google.maps.LatLngBounds();
      paths.forEach(function(path) {
        var ar = path.getArray();
        for (var i = 0, l = ar.length; i < l; i++) {
          bounds.extend(ar[i]);
        }
      });
      return bounds;
    },
    async initializeMap(google) {
      this.google = google;
      const mapContainer = this.$refs.googleMap;
      this.map = await new google.maps.Map(mapContainer, this.mapOptions);
      let bounds;
      if (
        this.complianceDetails.coordinates.length &&
        this.complianceDetails.reportType == "REGISTERED_FARM"
      ) {
        await this.createPolygon();
        bounds = this.getPolygonBounds();
        console.log(JSON.stringify(bounds), "coordinates bounds");
      } else {
        const swne = await this.calculateCoordsForPolygun(google);
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
      const srcImage = this.deforestImage;
      // const srcImage = '/img/logo-green.png';

      const overlay = new USGSOverlay(
        bounds,
        srcImage,
        document.getElementById("map")
      );
      overlay.setMap(this.map);
    },

    async createPolygon() {
      if (this.polygon != null) this.polygon.setMap(null);
      let polygonOption = {}
      if(this.complianceDetails.totalArea <= 0.247105)  { // to handle small overlays, google map api limitation
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
                strokeColor: this.filterDeforestImage ? 'transparent' : '#1F5D51',
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
      return Promise.resolve(true);
    },

    getDateFormat(date) {
      if (date) {
        return moment(date).format("DD MMMM YYYY");
      }
    },
    async downloadCompliancePdf() {
      this.startLoading();
      await new Promise((resolve) => setTimeout(resolve, 100));
      let fileName = `file_${new Date().getTime()}.jpg`;
      let el = this.$refs.googleMap;
      let canvasRes = await html2canvas(el, { scale: 2, useCORS: true });
      let outputDataUrl = canvasRes.toDataURL("image/jpeg");
      var imageBlob = this.dataURLtoBlob(outputDataUrl);
      const formData = new FormData();

      const { totalArea ,highProb, lowProb, zeroProb, veryHighProb, mediumProb, veryLowProb } = this.complianceDetails;
      formData.append("file", imageBlob, fileName);
      formData.append("id", this.complianceId);
      const setting = JSON.parse(localStorage.getItem("gs"));
      if(setting?.areaUnit) {
        formData.append('userUnit', JSON.stringify(setting.areaUnit));
      }
      formData.append("platform","web");
      formData.append("highProb",convertSizeIntoBaseUnit(highProb))
      formData.append("veryHighProb",convertSizeIntoBaseUnit(veryHighProb))
      formData.append("mediumProb",convertSizeIntoBaseUnit(mediumProb))
      formData.append("lowProb",convertSizeIntoBaseUnit(lowProb))
      formData.append("veryLowProb",convertSizeIntoBaseUnit(veryLowProb))
      formData.append("zeroProb",convertSizeIntoBaseUnit(zeroProb))
      formData.append("totalGeofence",convertSizeIntoBaseUnit(totalArea))
      formData.append("roles",currentRoles().join(','));
      const data = await DeforestationService.downloadCompliancePdf(formData);
      console.log(data);
      //await this.downloadBlobFile(data.location);
      const link = document.createElement("a");
      link.target = "_blank";
      link.href = data.data.location;
      link.click();
      this.stopLoading();
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

::v-deep.qr-code img {
  max-height: 140px;
}

.color-box{
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border-radius: 5px;
  margin-left: 10px;
  border: 1px solid #e2e2e2;
}

::v-deep.theme--light.v-data-table.overall-probability > .v-data-table__wrapper > table > thead > tr:last-child > th, ::v-deep.theme--light.v-data-table.overall-probability > .v-data-table__wrapper > table > tbody > tr > td {
  text-align: center !important;
  padding: 0 !important;
}
.qr-box {
  display: flex;
  justify-content: center;
  align-items: center;
}
.qr-box i {
  font-size: 48px !important;
}

.share-b{
  background-color: transparent !important;
  border: none;
  box-shadow: none;
}


.summery {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
}
.summery-card{
  background: #0EBF67;
}

.summery-card p {
    padding: 10px;
    margin-bottom: 0px !important;
    color: #fff;
}

.summery-card .v-card__text{
    padding: 0;
}
::v-deep.f-row{
    background: #0EBF67 !important;
}
::v-deep.f-row td{
    color:#fff;
}

::v-deep.f-row:hover{
    background: #0EBF67 !important; 
}

::v-deep.ptsi-brand {
    background-color: #184980;
}

::v-deep.ptsi-brand td {
    color: #fff;
}

::v-deep.f-row-id {
    background: #184980 !important;
    color: #fff !important;
}

::v-deep.f-row-id:hover {
    background: #184980 !important;
}
</style>
