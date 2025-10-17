<template>
  <div>
    <v-container fluid>
      <div class="d-flex mb-6">
        <h2 class="text-capitalize">
          {{ $t("satelliteReport.satelliteReport") }}
        </h2>
        <v-tooltip bottom color="black" max-width="350">
          <template v-slot:activator="{ on, attrs }">
            <v-icon class="green--text ml-2" v-bind="attrs" v-on="on" small
              >mdi-help-circle
            </v-icon>
          </template>
          <span>{{ $t("satelliteReport.satelliteReportTooltip") }}</span>
        </v-tooltip>
        <v-spacer></v-spacer>
        <v-btn depressed outlined color="primary" dark @click="goBack">
          {{ $t("back") }}
        </v-btn>
      </div>
      <v-divider></v-divider>
      <div class="my-4">
        <span class="text-h6 font-weight-bold"
          >{{ $t("satelliteReport.farmName") }}:
        </span>
        <span
          >{{
            satelliteDetails && satelliteDetails.farm
              ? satelliteDetails.farm.farmName || "-"
              : "-"
          }}
        </span>
      </div>
      <v-card flat rounded-lg>
        <v-row no-gutters class="d-flex align-center">
          <v-col>
            <span class="ml-4"> {{ $t("satelliteReport.zone") }}: </span>
          </v-col>
          <v-col cols="11">
            <v-tabs v-model="tab">
              <v-tab v-for="zone in zoneLists" :key="zone.id">
                {{ zone.name }}
              </v-tab>
            </v-tabs>
          </v-col>
        </v-row>
      </v-card>
      <div class="d-flex my-6">
        <div class="text-h6 text-capitalize">
          {{ $t("satelliteReport.satelliteReport") }}
        </div>
        <v-spacer></v-spacer>
        <v-btn depressed color="primary" dark @click="downloadReport">
          {{ $t("downloadPdfReport") }}
        </v-btn>
      </div>

      <v-row>
        <v-col cols="6">
          <v-card class="mb-6" flat rounded-lg>
            <div
              class="google-map"
              style="width:100%;height:80vh; z-index: 0;"
              id="map"
              ref="googleMap"
            ></div>
          </v-card>
          <v-card
            class="custom-card pa-4 mb-6"
            flat
            rounded-lg
            v-if="reportDetail && reportDetail.metadata"
          >
            <div class="text-h6 text-capitalize mb-4">
              {{ reportDetail.metadata.detail.title || "" }}
            </div>
            {{ reportDetail.metadata.detail.description[0] || "" }}
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-tabs-items v-model="tab" class="mt-5">
            <v-tab-item>
              <!-- Report Type -->
              <v-card class="custom-card pa-4 mb-6" flat rounded-lg>
                <div class="text-h6 text-capitalize mb-4">
                  {{ $t("satelliteReport.selectReportType") }}
                </div>
                <label for="chooseFarm">
                  <div class="text-body-1 mb-2">
                    {{ $t("satelliteReport.report") }}
                  </div>
                </label>
                <v-select
                  outlined
                  id="chooseFarm"
                  :items="getReportListForTab(tab)"
                  v-model="reportType"
                  item-text="name"
                  item-value="value"
                  dense
                  solo
                  flat
                  @change="selectReportType"
                >
                </v-select>
              </v-card>
              <!-- NDVI -->
              <v-card class="custom-card pa-4 mb-6" flat rounded-lg>
                <div class="text-h6 text-capitalize mb-4">
                  {{
                    reportDetail && reportDetail.metadata
                      ? reportDetail.metadata.detail.title
                      : ""
                  }}
                </div>
                <v-row>
                  <v-col cols="8"> {{ $t("satelliteReport.doi") }} : </v-col>
                  <v-col>
                    {{ reportDetail.dateOfInterest || "-" }}
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="8"> {{ $t("area") }} : </v-col>
                  <v-col>
                    {{ convertSizeIntoBaseUnit(reportDetail.areaInAcre) || "-" }}
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="8">
                    {{ $t("satelliteReport.dateOfImage") }} :
                  </v-col>
                  <v-col>
                    {{ reportDetail.ingestionDate || "-" }}
                  </v-col>
                </v-row>
              </v-card>
              <!-- RECI -->
              <v-card class="custom-card pa-4" flat rounded-lg>
                <div class="text-h6 text-capitalize mb-4">
                  {{
                    reportDetail && reportDetail.metadata
                      ? reportDetail.metadata.detail.scaleNote1
                      : "-"
                  }}
                </div>
                <v-img
                  :src="
                    `/img/satellite-reports-color-bars/${reportDetail.reportType}.png`
                  "
                ></v-img>
                <div class="text-subtitle-2 font-weight-bold mt-4">
                  {{
                    reportDetail && reportDetail.metadata
                      ? reportDetail.metadata.detail.scaleNote2
                      : "-"
                  }}
                </div>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import ReportService from "@/_services/ReportService";
import loadingMixin from "@/mixins/LoadingMixin";
import downloadMixin from "@/mixins/DownloadMixin";
import html2canvas from "html2canvas";
import {convertSizeIntoBaseUnit} from "@/utils.js"
import axios from "axios";
import { getGoogleMapsLoader } from '@/mixins/GoogleMapLoaderSingleton';
export default {
  name: "SatelliteDetailReport",
  async mounted() {
    this.satelliteId = this.$route.params.id;
    await this.getSatelliteReportDetail();

    this.loadMapPointer();
  },
  data() {
    return {
      satelliteId: null,
      tab: 0,
      zoneLists: [],
      reportTypeList: [
        // {
        //   name: "Crop Health Index",
        //   value: "cropHealth",
        // },
        // {
        //   name: "Crop Moisture Index",
        //   value: "cropMoisture",
        // },
        // {
        //   name: "Crop Nutrient Index",
        //   value: "cropNutrient",
        // },
        // {
        //   name: "Crop Greenness Index",
        //   value: "cropGreeness",
        // },
        // {
        //   name: "Early Stage Crop Health Index",
        //   value: "earlyStageCropHealth",
        // },
      ],
      reportType: null,
      satelliteDetails: null,
      reportDetail: {},
      coordinates: {
        lat: 30.75539959715465,
        lng: 76.65240861475468,
      },
      mapOptions: {
        mapTypeId: "satellite",
        center: {},
          styles: [
          {
            featureType: "all",
            elementType: "labels",
            stylers: [
              { visibility: "off" }
            ]
          }
        ],
        zoom: 14,
        disableDefaultUI: true,
        zoomControl: true,
      },
      loader: null,
      loadingFarm: false,
      google: null,
      polygon: null,
      deforestImage: "",
      marker: null,
    };
  },
  computed: {
    polygonCoords() {
      return this.reportDetail.coordinates.map((x) => {
        return {
          lat: x.latitude,
          lng: x.longitude,
        };
      });
    },
  },
  methods: {
    convertSizeIntoBaseUnit,
    getReportListForTab(tabIndex) {
      // Ensure tab index is valid
      console.log(tabIndex);
      if (tabIndex >= 0 && tabIndex < this.zoneLists.length) {
        const reportLists = this.reportTypeList[tabIndex];
        return reportLists.reports;
      } else if (this.reportTypeList.length > 0) {
        return this.reportTypeList;
      }
      return []; // Return empty array if tab index is invalid
    },
    async getSatelliteReportDetail() {
      this.startLoading();
      try {
        const { data } = await ReportService.getSatelliteReportDetail(
          this.satelliteId
        );
        if (data.success) {
          this.stopLoading();
          this.satelliteDetails = data.data;

          this.reportType = this.satelliteDetails.reports[0].id;
          this.reportDetail = this.satelliteDetails.reports[0];
          this.coordinates = {
            lat: this.satelliteDetails.centerLatitude,
            log: this.satelliteDetails.centerLongitude,
          };
          
          this.zoneLists = [];
          this.reportTypeList = [];

          data.data.reports.forEach((item) => {
            if (item && item.geofence) {
              const existingZoneIndex = this.zoneLists.findIndex(
                (zone) => zone.id === item.geofence.id
              );

              if (existingZoneIndex === -1) {
                // ADD NEW ZONE;
                this.zoneLists.push({
                  id: item.geofence.id,
                  name: item.geofence.geofenceName,
                });

                // ADD REPORT TYPE TO ZONE
                this.reportTypeList.push({
                  zoneId: item.geofence.id,
                  reports: [
                    {
                      name: item.metadata.reportName,
                      value: item.metadata.reportId,
                    },
                  ],
                });
              } else {
                this.reportTypeList[existingZoneIndex].reports.push({
                  name: item.metadata.reportName,
                  value: item.metadata.reportId,
                });
              }
            } 
            else if (item.metadata?.reportName) {
              this.reportTypeList.push({
                name: item.metadata.reportName,
                value: item.metadata.reportId,
              });
            } else {
              this.reportTypeList = [];
            }
          });

        }
        this.stopLoading();
      } catch (error) {
        this.$notify({
          title: "Error fetching satellite report detail:",
          error,
          type: "error",
        });
        this.stopLoading();
      }
    },

    async downloadReport() {
      this.startLoading();
      await new Promise((resolve) => setTimeout(resolve, 100));
      let fileName = `file_${new Date().getTime()}.jpg`;
      let el = this.$refs.googleMap;
      let canvasRes = await html2canvas(el, { scale: 2, useCORS: true, allowTaint:true });
      let outputDataUrl = canvasRes.toDataURL("image/jpeg");

      var imageBlob = this.dataURLtoBlob(outputDataUrl);

      const formData = new FormData();

      formData.append("mapImage", imageBlob, fileName);
      const response = await ReportService.downloadReport(
        formData,
        this.reportType || this.satelliteId
      );

      this.downloadBlob(response.data, "satellite_report.pdf");
      this.stopLoading();
    },

    async proxyImage(location=null) {
      if (location) {
        return await axios.post(`/proxy-image`, { location: location });
      }
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

    async loadMapPointer() {
      const success = () => {
        this.mapOptions.center.lat = this.coordinates?.lat;
        this.mapOptions.center.lng = this.coordinates?.log;

        if (this.map) this.map.setCenter(this.mapOptions.center);
      };
      const error = () => {
        this.locationEnabled = false;
        this.snackbar = true;
      };
      await navigator.geolocation.getCurrentPosition(success, error);
      try {
        const loader = getGoogleMapsLoader();
        const google = await loader.load();
        await this.initializeMap(google);
        this.loader = loader;
      } catch (e) {
        console.log(e);
      }
    },

    createMarker() {
      if (this.marker != null) this.marker.setMap(null);
      const latLng = { lat: this.coordinates.lat, lng: this.coordinates.log };

      this.marker = new this.google.maps.Marker({
        position: latLng,
        // title:"Hello World!"
      });

      // To add the marker to the map, call setMap();
      this.marker.setMap(this.map);
    },

    async initializeMap(google) {
      console.log(this.mapOptions, this.polygonCoords);

      this.google = google;
      const mapContainer = this.$refs.googleMap;
      this.map = await new google.maps.Map(mapContainer, this.mapOptions);
      await this.createPolygon();
      let bounds = this.getPolygonBounds();
      console.log(JSON.stringify(bounds), "coordinates bounds");
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
      let srcImage = this.reportDetail.pngURL;
      if(srcImage){
        const data = await this.proxyImage(srcImage);
        srcImage = "data:image/jpeg;base64," + data.data;
      }
      // const srcImage =
      //   "https://res.cloudinary.com/demo/image/upload/w_400/sample.jpg";

      const overlay = new USGSOverlay(
        bounds,
        srcImage,
        document.getElementById("map")
      );
      overlay.setMap(this.map);
    },
    async createPolygon() {
      if (this.polygon != null) this.polygon.setMap(null);
      this.polygon = await new this.google.maps.Polygon({
        paths: this.polygonCoords,
        //strokeColor: "transparent",
        strokeColor: "transparent",
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: "#E5F8F1",
        fillOpacity: 0,
        editable: false,
        draggable: false,
        icon: this.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
      });

      this.polygon.setMap(this.map);
      return Promise.resolve(true);
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

    selectReportType() {
      const reportID = this.reportType;
      this.reportDetail = this.satelliteDetails.reports.find(
        (item) => item.id === reportID
      );

      this.loadMapPointer();

    },
    goBack() {
      this.$router.push({
        name: "SatelliteReports",
      });
    },
  },
  mixins: [loadingMixin, downloadMixin],
};
</script>

<style scoped>
.theme--light.v-tabs-items {
  background-color: transparent;
}
</style>
