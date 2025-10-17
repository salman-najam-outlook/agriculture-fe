<template>
  <v-container>
    <template>
      <div class="text-center">
        <v-dialog v-model="dialog" width="80%" @click:outside="closeModal">
          <v-card class="rounded-lg">
            <v-toolbar color="primary" class="white--text" flat :elevation="0">
              <v-toolbar-title class="font-weight-bold">{{
                $t("deforestation.Disputes")
              }}</v-toolbar-title>

              <v-spacer></v-spacer>

              <v-btn icon class="white--text" @click="closeModal">
                <v-icon style="color:white !important">mdi-close</v-icon>
              </v-btn>
            </v-toolbar>

            <v-card elevation="0" class="mt-5">
              <v-card-text>
                <h4 class="my-2 title" style="font-weight: bold;">
                  {{ productionPlace.farm.farmName }} -
                  {{ productionPlace.farm.address }}
                </h4>
                <h4 class="my-2 title" style="font-weight: bold">
                  {{
                    "Click on one of the dispute requests below to see more details."
                  }}
                </h4>
                <v-row class="fill-height" align="center" justify="center">
                  <!-- <v-img src="/img/deforestration-map.png"> </v-img> -->
                  <v-col sm="12">
                    <div
                      class="google-map"
                      style="width:100%;height:500px; z-index: 0;"
                      id="map"
                      ref="googleMap"
                    ></div>
                  </v-col>
                </v-row>
                <v-row v-if="disputes.length > 0">
                  <v-col cols="auto">
                    <h4 class="py-5">{{ "Resolution history" }}</h4>
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col cols="auto">
                    <v-row class="py-5 pr-5">
                      <v-badge
                        color="warning"
                        inline
                        class="rectangular-badge"
                      ></v-badge>
                      <p class="mb-2 ml-1 mr-10" style="font-weight: bold;">
                        {{ "Admin" }}
                      </p>
                      <v-badge
                        color="success"
                        inline
                        class="rectangular-badge"
                      ></v-badge>
                      <p class="mb-2 ml-1" style="font-weight: bold;">
                        {{ userFullName }}
                      </p>
                    </v-row>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <div v-for="(dispute, index) in disputes" :key="dispute.id">
              <dispute-history
                :dispute="dispute"
                :dispute-index="index + 1"
                :productionPlaceId="productionPlace.id"
              ></dispute-history>
            </div>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                outlined
                medium
                class="mr-2"
                @click="closeModal()"
              >
                {{ $t("cancel") }}
              </v-btn>
              <v-btn
                color="success"
                medium
                class="mr-2"
                @click="handleSubmit()"
              >
                {{ $t("submit") }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
      <OpenChat
        v-if="showChatDialog"
        :dialogU="showChatDialog"
        v-on:closeChat="this.showChatDialog = false"
      ></OpenChat>
    </template>
  </v-container>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";
import generalMixin from "@/mixins/GeneralMixin";
import PermissionsMixin from "@/mixins/PermissionsMixin";
import download from "@/mixins/DownloadMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import moment from "moment";
import OpenChat from "./OpenChat";
// import DeforestationService from "@/_services/DeforestationService";
import { Loader } from "@googlemaps/js-api-loader";
// import PermissionsService from '@/_services/PermissionsService'
import DisputeHistory from "@/views/deforestation/components/DisputeHistory.vue";
import DeforestationService from "@/_services/DeforestationService";

export default {
  components: {
    // SelectSurveyUsersDialog,
    // SurveyDateSelector,
    OpenChat: OpenChat,
    DisputeHistory: DisputeHistory,
  },
  mounted() {
    this.getComplianceDetails(1);
    this.getDisputes();
  },

  created() {
    const fetchData = async () => {
      this.startLoading();

      this.stopLoading();
    };

    fetchData();
  },
  computed: {
    dialog() {
      return this.dialogU;
    },

    userFullName() {
      if (this.disputes.length > 0) {
        const user = this.disputes[0].creating_user;
        return `${user.firstName} ${user.lastName}`;
      }
      return "";
    },
  },
  data() {
    return {
      extenshionError: false,
      select: null,
      dragover: false,
      errorUploading: false,
      successUploaded: false,
      isInvalidData: false,
      showChatDialog: false,
      uploadedFiles: [],
      numRecords: 0,
      uploadId: null,
      uploadPercentage: 0,
      loaded: 0,
      total: 0,
      fileName: "",
      valid: true,
      mailSent: false,
      roleLoading: false,
      error: false,
      jobId: null,
      fileDropped: false,
      base64OverlayImage: "",
      mapOptions: {
        mapTypeId: "satellite",
        center: {
          lat: 25.774,
          lng: -80.19,
        },
        zoom: 5,
        disableDefaultUI: true,
        fullscreenControl: true,
        mapTypeControl: true,
      },
      polygonCoords: [
        { lat: 25.774, lng: -80.19 },
        { lat: 18.466, lng: -66.118 },
        { lat: 32.321, lng: -64.757 },
      ],
      marker: null,
      map: null,
      loader: null,
      google: null,
      polygon: null,
      deforestImage: "",
      latitude: 0,
      longitude: 0,

      disputes: [],
    };
  },
  methods: {
    async getDisputes() {
      this.startLoading();
      const params = {
        productionPlaceId: 76, //Replace this with real id
        // productionPlaceId : this.productionPlace.id,  //Replace this with real id
      };
      DeforestationService.productionPlaceDisputes(params).then((res) => {
        this.disputes = res.data.productionPlacesDisputes;
      });
      this.stopLoading();
    },

    attachFile() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      console.log("Selected file:", file);
    },

    sendMessage() {
      console.log("Sending message:", this.message);
    },
    async getComplianceDetails() {
      // this.startLoading();
      // this.stopLoading();
      this.loader = await new Loader({
        apiKey: "",
        libraries: ["places", "map", "geometry"],
      })
        .load()
        .then(async (google) => {
          await this.initializeMap(google);
        })
        .catch((e) => {
          console.log("Map", e);
        });
      this.createPolygon();
      this.createMarker();
    },
    closeModal() {
      this.$emit("closeBulkUpload");
    },

    createMarker() {
      if (this.marker != null) this.marker.setMap(null);
      const latLng = {
        lat: this.mapOptions.center.lat,
        lng: this.mapOptions.center.lng,
      };
      this.marker = new this.google.maps.Marker({
        position: latLng,
        draggable: true,
      });

      // To add the marker to the map, call setMap();
      this.marker.setMap(this.map);
      this.marker.addListener("click", this.handleMarkerClick);
    },
    handleMarkerClick() {
      // alert('clicked')
      this.showChatDialog = true;
    },
    csvUploaded(data) {
      if (this.uploadedFiles.length > 0) this.uploadedFiles = [];
      this.successUploaded = true;
      this.numRecords = data.data.numRecords;
      this.uploadId = data.data.uploadId;
    },

    onDrop(e) {
      this.isInvalidData = false;
      this.dragover = false;
      this.errorUploading = false;
      this.successUploaded = false;
      if (this.uploadedFiles.length > 0) this.uploadedFiles = [];
      e.dataTransfer.files.forEach((element) =>
        this.uploadedFiles.push(element)
      );
      if (this.uploadedFiles[0].type !== "text/csv") {
        this.extenshionError = true;
        this.uploadedFiles = [];
        return;
      }
      this.fileName = this.uploadedFiles[0].name;
      this.extenshionError = false;
      this.fileDropped = true;
      this.submitCsv();
    },

    fileData(e) {
      this.isInvalidData = false;
      this.errorUploading = false;
      this.successUploaded = false;
      if (this.uploadedFiles.length > 0) this.uploadedFiles = [];
      if (e.target.files[0].type !== "text/csv") {
        this.extenshionError = true;
        this.uploadedFiles = [];
        return;
      }
      this.fileName = e.target.files[0].name;
      this.extenshionError = false;
      this.uploadedFiles.push(e.target.files[0]);
      this.fileDropped = true;
      this.submitCsv();
    },

    submitCsv() {
      if (this.extenshionError || this.uploadedFiles.length < 1) return;
      this.uploadCsv(this.uploadedFiles[0]).then((data) => {
        if (data.success) {
          this.csvUploaded(data);
        } else {
          this.errorUploading = true;
          this.fileDropped = false;
          this.isInvalidData = true;
        }
      });
    },

    sendActivationKeys() {
      if (!this.uploadId) return;
      //   ActivationKeyService.sendKeys({ uploadId: this.uploadId }).then(
      //     (data) => {
      //       if (data.success) {
      //         this.$emit("keysSent", { success: true, message: data.message });
      //       } else {
      //         this.$emit("keysSent", { success: false, message: data.message });
      //       }
      //       this.closeModal();
      //       this.stopLoading();
      //     }
      //   );
    },

    async uploadCsv(file) {
      let formData = new FormData();
      formData.append("activationCsv", file);
      return await this.$http
        .post("/user/activation/csv", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            this.loaded = progressEvent.loaded;
            this.total = progressEvent.total;
            this.uploadPercentage = parseInt(
              Math.round((progressEvent.loaded / progressEvent.total) * 100)
            );
          },
        })
        .then(({ data }) => {
          if (data.success) {
            this.jobId = data.data;
            this.getKeyAssignStatus();
          }
          return data;
        })
        .catch((error) => {
          this.errorUploading = true;
          this.fileDropped = false;
          return Promise.reject(error);
        });
    },

    getKeyAssignStatus() {
      console.log("jobid", this.jobId);
      const int = setInterval(async () => {
        const { data } = await this.$http.get(
          `/user/activation/csv/job/${this.jobId}`
        );
        console.log("res", data);
        console.log("data.data.progress", data.data.progress);
        // if(data.data.progress == "100" || data.data.progress == "fail"){
        clearInterval(int);
        // }
      }, 5000);
    },

    async downloadFile() {
      const { data } = await this.$http.get(
        "/user/activation/download-sample-csv"
      );
      if (!data.data || !data.data.url) return;
      // console.log('dd', data.data.url);
      // let csv = 'Sample,Csv,File,Here\n';
      const anchor = document.createElement("a");
      anchor.href = data.data.url; //'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
      anchor.target = "_blank";
      anchor.download = "sample.csv";
      anchor.click();
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
      this.polygon = await new this.google.maps.Polygon({
        paths: this.polygonCoords,
        //strokeColor: "transparent",
        strokeColor: this.filterDeforestImage ? "transparent" : "#1F5D51", //"#1F5D51",
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: "#FF0000",
        fillOpacity: 0.3,
        editable: false,
        draggable: false,
        icon: this.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
      });

      this.polygon.setMap(this.map);
      return Promise.resolve(true);
    },

    getDateFormat(date) {
      if (date) {
        return moment(date).format("DD MMMM YYYY");
      }
    },
  },
  props: {
    dialogU: {
      type: Boolean,
      required: true,
    },
    productionPlace: {
      type: Object,
      required: true,
    },
  },
  mixins: [
    loadingMixin,
    download,
    getPermittedActions,
    generalMixin,
    PermissionsMixin,
  ],
};
</script>

<style lang="scss">
::v-deep .bg .v-input__slot {
  background-color: $primary-color;
  color: #ffffff;
}

.border-outline {
  background-color: #ffffff !important;
  border: 5px dotted #aaaaaa !important;
  height: 200px;
}

.border-outline-success {
  background-color: #ffffff !important;
  border: 5px dotted #aaaaaa !important;
}

.green-txt {
  color: #00bd73;
  margin-bottom: 34px;
  font-size: 20px;
}
.browse {
  cursor: pointer;
  color: blue;
}
.err {
  color: red;
  padding-left: 40px;
}
.successMsg {
  color: #00bd73;
  padding-left: 40px;
}
.numRecords {
  padding-left: 40px;
  font-size: 12px;
}

.rectangular-badge .v-badge__badge {
  border-radius: 4px !important;
  min-width: 10px !important;
  padding: 4px 10px;
}
</style>
