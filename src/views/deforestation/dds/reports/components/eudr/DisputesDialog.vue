<template>
  <v-container>
    <template>
      <div class="text-center">
        <v-dialog v-model="dialog" width="80%" @click:outside="closeModal">
          <v-dialog v-if="actionDialog" v-model="actionDialog" width="11%" content-class="elevation-0">
            <v-container>
              <v-row class="pa-6">
              <v-col cols="6">
                <v-btn @click="editShape"
                       density="compact"
                       rounded
                       small
                       height="40"
                       variant="text"
                       width="40"
                       border><v-icon>mdi-pencil</v-icon></v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn @click="deleteResolution"
                    density="compact"
                       rounded
                       small
                       height="40"
                       variant="text"
                       width="40"
                       border><v-icon>mdi-trash-can</v-icon></v-btn>
              </v-col>
            </v-row>
            </v-container>
          </v-dialog>
          <v-dialog v-model="disputeDetails" width="25%" @click:outside="closeDispute()">
            <v-card class="rounded-lg">
              <v-toolbar color="white" flat :elevation="0">
                <v-toolbar-title class="font-weight-bold">
                  <small>{{ $t("dueDiligence.disputeDetails") }}</small>
                </v-toolbar-title>

                <v-spacer></v-spacer>

                <v-btn icon @click="closeDispute()">
                  <v-icon style="color:white !important">mdi-close</v-icon>
                </v-btn>
              </v-toolbar>

              <v-card elevation="0">
                <v-card-text>
                  <label class="mb-2" for="disputeReason">
                    {{ $t("dueDiligence.chooseDisputeReason") }}
                  </label>
                  <v-select name="disputeReason" :items="disputeReasons" v-model="disputeReason" outlined>
                    <template v-slot:item="{ item }">
                      <span class="text-wrap">{{ item }}</span>
                    </template>
                  </v-select>
                  <div class="mt-4">
                    <label class="mb-5" for="name">{{ $t("Initial Plantation Date") }}
                      <v-tooltip top color="black" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon color="green" v-bind="attrs" v-on="on">
                            mdi-information
                          </v-icon>
                        </template>
                        <span>{{$t("If the disputed area is currently planted, state the Initial crop planting date.")}}</span>
                      </v-tooltip>
                    </label>
                    <v-menu v-model="initialPlantationDateDropdown" :close-on-content-click="false" :nudge-right="40"
                            transition="scale-transition" offset-y min-width="auto">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field append-icon="mdi-calendar"
                                      v-model="initialPlantationDate" outlined readonly
                                      v-bind="attrs" v-on="on" v-on:click:append="initialPlantationDateDropdown = true"
                                      placeholder="Initial Plantation Date"></v-text-field>
                      </template>
                      <v-date-picker v-model="initialPlantationDate"
                                     placeholder="Initial Plantation Date"
                                     @input="initialPlantationDateDropdown = false"></v-date-picker>
                    </v-menu>
                  </div>
                  <div class="mt-6">
                    <label class="m-4" for="notes">
                      {{ $t("dueDiligence.additionalNotes") }}
                    <v-tooltip top color="black" max-width="350">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon color="green" v-bind="attrs" v-on="on">
                          mdi-information
                        </v-icon>
                      </template>
                      <span>{{$t("Provide any other additional information or evidence that would support your dispute, for example ground truth data such as mobile phone photos, documents that support your claim in the drop down menu in the Additional Notes section below")}}</span>
                    </v-tooltip>
                  </label>
                  <v-textarea id="additionalNotes" v-model="additionalNotes" auto-grow outlined rows="2" row-height="15"
                    append-icon="mdi-attachment" @click:append="triggerFileUpload"></v-textarea>
                  <v-file-input id="attachment" v-model="attachment" style="display: none;"
                    accept="image/*,.pdf"></v-file-input>
                  <article v-if="attachment" class="file-chip ma-0">
                    <v-row>
                      <v-col cols="1">
                        <v-icon large>
                          {{ attachment.type.includes('image') ? 'mdi-file-image-outline' : 'mdi-file-document-outline' }}
                        </v-icon>
                      </v-col>
                      <v-col cols="1">&nbsp;</v-col>
                      <v-col cols="10" class="pl-2">
                        <h4>{{ attachment.name }}</h4>
                        <span>{{ (attachment.size / 1024).toFixed(0) }} KB</span>
                      </v-col>
                    </v-row>
                  </article>
                  </div>
                  <v-checkbox
                    v-model="noAgricultreAgreement"
                  >
                    <template v-slot:label>
                      <small>{{ $t('I acknowledge that the provided information is truthful and accurate.') }}</small>
                    </template>
                  </v-checkbox>

                  <v-card-actions class="mb-4">
                    <v-spacer></v-spacer>
                    <v-btn color="primary" outlined class="mr-2" @click="clearDispute()">
                      {{ $t("cancel") }}
                    </v-btn>
                    <v-btn color="success" class="mr-2" @click="saveDispute()">
                      {{ updateMode ? $t("update") : $t("save") }}
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-card>
          </v-dialog>

          <v-dialog content-class="radius-overlay" :hide-overlay="true" v-model="radiusSetter" width="20%"
            @click:outside="switchToPolygon()">
            <v-card class="rounded-lg">
              <v-toolbar color="primary" flat :elevation="0">
                <v-toolbar-title class="font-weight-bold white--text">
                  <small>{{ $t("dueDiligence.addGeofenceRadius") }}</small>
                </v-toolbar-title>

                <v-spacer></v-spacer>

                <v-btn class="white--text" icon @click="switchToPolygon()">
                  <v-icon style="color:white !important">mdi-close</v-icon>
                </v-btn>
              </v-toolbar>

              <v-card elevation="0">
                <v-card-text>
                  <v-slider thumb-size="24" color="primary" max="1000" min="0" v-model="geofenceRadius"></v-slider>

                  <p class="text-center">{{ $t('dueDiligence.totalGeofenceRadius')}} <b>{{ geofenceRadius }}m</b></p>

                  <v-text-field :value="geofenceRadius" suffix="meters" outlined disabled></v-text-field>
                </v-card-text>
                <v-card-actions class="mb-4">
                  <v-spacer></v-spacer>
                  <v-btn color="primary" outlined class="mr-2" @click="switchToPolygon()">
                    {{ $t("cancel") }}
                  </v-btn>
                  <v-btn color="success" class="mr-2" @click="() => { radiusSetter = false; disputeDetails = true; }">
                    {{ $t("save") }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-card>
          </v-dialog>


          <v-card class="rounded-lg">
            <v-toolbar color="primary" class="white--text" flat :elevation="0">
              <v-toolbar-title class="font-weight-bold">{{
          $t("deforestation.disputeAssessment")
        }}</v-toolbar-title>

              <v-spacer></v-spacer>

              <v-btn icon class="white--text" @click="closeModal">
                <v-icon style="color:white !important">mdi-close</v-icon>
              </v-btn>
            </v-toolbar>

            <v-card elevation="0">
              <v-card-text>
                <h4 v-if="productionPlace" class="my-2 title" style="font-weight: bold;">
                  {{ productionPlace.farm.farmName }} -
                  {{ productionPlace.farm.address }}
                </h4>
                <p class="my-2" style="font-weight: bold">
                  {{
          $t('dueDiligence.disputeDesc')
        }}
                </p>
                <v-btn rounded color="primary" @click="downloadPdf" outlined>{{$t("Download as pdf")}}</v-btn>

                <section :class="isIndonesianClient ? 'map-holder-id mt-4' : 'map-holder mt-4'">
                  <v-row class="fill-height" align="center" justify="center">
                    <v-col sm="12">
                      <div class="deforestation-index">
                        <v-row>
                          <v-col cols="12" sm="3">
                            <p>{{ $t("dueDiligence.geofenceColorCode") }}</p>
                          </v-col>
                          <v-col cols="12" sm="9">
                            <v-row>
                              <v-col cols="12" sm="4" v-for="index in deforestationIndices" :key="index.class">
                                <v-row>
                                  <v-col cols="1" style="align-self: center;">
                                    <div :class="'index-indicator ' + index.class"></div>
                                  </v-col>
                                  <v-col cols="11">
                                    <small>{{ index.label }}</small>
                                  </v-col>
                                </v-row>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                      </div>
                    </v-col>
                    <v-col sm="12">
                      <div class="google-map" style="width:100%;height:500px; z-index: 0;" id="map" ref="googleMap">
                      </div>
                    </v-col>
                  </v-row>
                </section>
              </v-card-text>
              
            </v-card>

            <v-card elevation="0">
              <v-card-text class="pb-0">
                <v-row v-if="disputes.length > 0">
                  <v-col cols="auto" class="pb-0">
                    <h4 class="py-5">{{ $t('dueDiligence.resolutionHistory') }}</h4>
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col cols="auto"  class="pb-0">
                    <v-row class="py-5 pr-5">
                      <v-badge color="warning" inline class="rectangular-badge"></v-badge>
                      <p class="mb-2 ml-1 mr-10" style="font-weight: bold;">
                        {{ "Admin" }}
                      </p>
                      <v-badge color="primary" inline class="rectangular-badge"></v-badge>
                      <p class="mb-2 ml-1" style="font-weight: bold;">
                        {{ userFullName }}
                      </p>
                    </v-row>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <div v-if="disputes.length > 0">
              <div v-for="(dispute, index) in disputes" :key="dispute.id">
                <dispute-history
                  :dispute="dispute"
                  :dispute-index="index + 1"
                  @comment-added="addCommentToDispute"
                  @refresh-get-disputes="getDisputes"
                ></dispute-history>
              </div>
            </div>
            <div v-else>
              <p>{{  $t("dueDiligence.noDisputeHaveSubmitted") }}</p>
            </div>

            <v-card-actions class="mb-4">
              <v-spacer></v-spacer>
              <v-btn color="primary" outlined class="mr-2" @click="closeModal()">
                {{ $t("close") }}
              </v-btn>
              <v-btn color="primary" class="mr-2" @click="assessmentReport()">
                {{ $t("dueDiligence.proceed") }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </template>
    <ConfirmBax
        v-if="deleteconfirm"
        :dialog="deleteconfirm"
        :title="confirmboxinfo.title"
        :message="confirmboxinfo.message"
        confirmBtnText="CONFIRM"
        cancelBtnText="CANCEL"
        :confirmData="itemToDelete"
        @continue:action="deleteConfirmed"
        @cancel:action="deleteconfirm = false"
        cancelBtnOutlined
    />
  </v-container>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";
import generalMixin from "@/mixins/GeneralMixin";
import PermissionsMixin from "@/mixins/PermissionsMixin";
import download from "@/mixins/DownloadMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import moment from "moment";
import axios from "axios";
import DisputeHistory from "@/views/deforestation/components/DisputeHistory.vue";
import S3UploadService from "@/_services/S3UploadService";
import DeforestationService from "@/_services/DeforestationService";
import ConfirmBax from "@/components/ConfirmBox.vue";
import { getGoogleMapsLoader } from '@/mixins/GoogleMapLoaderSingleton';
import { isIndonesianClient } from "@/utils";

export default {
  components: {
    ConfirmBax,
    DisputeHistory: DisputeHistory,
  },
  mounted() {
    this.getDeforestationEUDR();
  },
  async created() {
    await this.getDisputes();
  },
  computed: {
    productionPlace() {
      return this.disputes[0]?.production_place;
    },
    getAttachmentInput() {
      return document.getElementById('attachment');
    },
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
    filterDeforestImage() {
      if (this.eudrDetail && this.eudrDetail.sateliteResponse.length) {
        const r = this.eudrDetail.sateliteResponse.filter(x => x.reportName.toLowerCase() == 'deforestation')
        return r.length ? r[0].imagePath : null
      }
      return null
    },
    currentColorCode() {
      return this.chooseColorCode(this.disputes.length);
    },
    isDocument() {
      const extension = this.dispute.s3Location.split('.')[1];
      return ['docx', 'doc', 'pdf'].includes(extension);
    },
    shortenedFileName() {
      return this.dispute.s3Location.split("/").slice(-2).join("/");
    },
    isIndonesianClient() {
      return isIndonesianClient();
    }
  },
  data() {
    return {
      attachment: null,
      additionalNotes: '',
      disputeReason: '',
      initialPlantationDate: '',
      initialPlantationDateDropdown: false,
      noAgricultreAgreement: false,
      disputeDetails: false,
      radiusSetter: false,
      eudrDetail: {},
      parentPolygonCoords: [],
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
      marker: null,
      map: null,
      loader: null,
      google: null,
      overlayPolygon: null,
      polygon: null,
      circle: null,
      geofenceRadius: 0.0,
      deforestImage: "",
      latitude: 0,
      longitude: 0,
      colorCodes: ["#F06B20", "#00BD73", "#8B0000", "#313191", "#471885"],
      disputes: [],
      drawType: 'POLYGON',
      deforestationIndices: [
        {
          label: this.$t('deforestation.veryHighProbability'),
          class: "v-high"
        },
        {
          label: this.$t('deforestation.highProbability'),
          class: "high"
        },
        {
          label: this.$t('deforestation.mediumProbability'),
          class: "med"
        },
        {
          label: this.$t('deforestation.lowProbability'),
          class: "low"
        },
        {
          label: this.$t('deforestation.veryLowProbability'),
          class: "v-low"
        },
        {
          label: this.$t('deforestation.zeroOrNegligibleProbability'),
          class: "zero"
        }
      ],
      disputeReasons: [
        this.$t("dueDiligence.wildFire"),
        this.$t("dueDiligence.controlledFire"),
        this.$t("dueDiligence.clearingForAgriculture"),
        this.$t("dueDiligence.pestAndDiseases"),
        this.$t("dueDiligence.naturalChangesInCanopy"),
        this.$t("dueDiligence.strongWinds"),
        this.$t("dueDiligence.otherNaturalDisasters"),
        this.$t("dueDiligence.flooding"),
        this.$t("dueDiligence.logging"),
        this.$t("dueDiligence.infrastructure"),
        this.$t("dueDiligence.urbanization"),
        this.$t("dueDiligence.landGrabbingOrPopulationPressure"),
        this.$t("dueDiligence.mining"),
        this.$t("dueDiligence.plantationForestBeforeDeadline"),
        this.$t("dueDiligence.convertedToPlantationForest"),
        this.$t("dueDiligence.cultivatedAreaBeforeDeadline"),
        this.$t("dueDiligence.forestStillPreserved")
      ],
      shapes: [],
      selectedDisputeId: null,
      selectedDisputeIndex: null,
      updateMode: false,
      actionDialog: false,
      deleteconfirm: false,
      confirmboxinfo: {
        title: "",
        message: "",
      },
      itemToDelete:{},
      status: "",
    };
  },
  watch: {
    geofenceRadius: async function (value) {
      const newValue = parseInt(value);
      this.circle && this.circle.setMap(null);

      // Calculating area
      this.circle = await this.createCircle(newValue, {
        lat: this.latitude,
        lng: this.longitude
      }, this.currentColorCode);
      this.circle && this.circle.setMap(this.map);
    }
  },
  methods: {
    chooseColorCode(index) {
      if (index >= this.colorCodes.length) {
        return this.chooseColorCode(index - this.colorCodes.length);
      }

      return this.colorCodes[index];
    },
    assessmentReport() {
      this.$emit('closeDisputeDialog');
    },
    closeModal() {
      this.$emit('closeDisputeDialog');
    },
    triggerFileUpload() {
      this.getAttachmentInput.click();
    },
    async gotoCurrentLocation(lat, lng) {
      const success = () => {
        this.latitude = lat;
        this.longitude = lng;
        this.mapOptions.center.lat = this.latitude;
        this.mapOptions.center.lng = this.longitude;
        if (this.map) this.map.setCenter(this.mapOptions.center)
        const geocoder = new this.google.maps.Geocoder();
        geocoder
          .geocode({ location: { lat: this.latitude, lng: this.longitude } })
          .then((response) => {

            if (response.results[0]) {
              this.address = response.results[0].formatted_address;
              this.createMarker()
              this.stopLoading()
            } else {
              this.$notify({
                type: 'error',
                text: "No results found"
              });
            }
          })
          .catch((err) => {
            this.$notify({
              type: 'error',
              text: "Can't fetch location due to: " + err
            });
          });
        this.address = ""
        this.createMarker();
      };
      const error = (err) => {
        this.$notify({
          type: 'error',
          text: err
        });
      };

      navigator.geolocation.getCurrentPosition(success, error);
    },
    getPolygonBounds() {
      var paths = this.overlayPolygon.getPaths();
      var bounds = new this.google.maps.LatLngBounds();
      paths.forEach(function (path) {
        var ar = path.getArray();
        for (var i = 0, l = ar.length; i < l; i++) {
          bounds.extend(ar[i]);
        }
      });
      return bounds;
    },
    async getDisputes() {
      const params = {
        reportRequestId: Number(this.$props.reportRequestId)
      };
      const disputes = await DeforestationService.findDisputesByQuery(params);

      if (disputes.errros && disputes.errors.length > 0) {
        this.$notify({
          title: "Error creating dispute",
          text: `${disputes.errors[0].message} and ${disputes.errors.length - 1} more...`,
          type: 'error'
        });
        return;
      }

      this.disputes = disputes.data.findProductionPlaceDisputes.rows;
    },
    getDeforestationEUDR() {
      this.startLoading()
      this.loading = true
      DeforestationService.getComplianceDetails(this.$props.reportRequestId).then(async (res) => {
        this.eudrDetail = res.data.deforestation;
        this.mapOptions.center.lat = Number.parseFloat(res.data.deforestation.centerLatitude);
        this.mapOptions.center.lng = Number.parseFloat(res.data.deforestation.centerLongitude);
        this.eudrDetail.coordinates = res.data.deforestation.coordinates.map(x => {
          return {
            lat: x.latitude,
            lng: x.longitude
          }
        })

        const data = await this.proxyImage(this.filterDeforestImage)
        this.deforestImage = 'data:image/jpeg;base64,' + data.data
        this.polygonCoords = this.eudrDetail.coordinates
        this.stopLoading();
        this.loading = false;
        const loader = getGoogleMapsLoader();
        const google = await loader.load();
        await this.initializeMap(google);
        this.loader = loader;
      }).catch(err => {
        this.loading = false;
        this.$notify({
          type: 'error',
          text: err
        });
        this.stopLoading();
      })
    },
    async proxyImage() {
      const location = this.filterDeforestImage
      if (location) {
        return await axios.post(`/proxy-image`, { location: location })
      }
    },
    createMarker() {
      if (this.marker != null) this.marker.setMap(null);
      const latLng = {
        lat: this.latitude,
        lng: this.longitude,
      };
      this.marker = new this.google.maps.Marker({
        position: latLng,
        draggable: true,
      });

      // To add the marker to the map, call setMap();
      this.marker.setMap(this.map);
      this.marker.addListener("click", this.handleMarkerClick);
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
      return [sw, ne];
    },
    async initializeMap(google) {
      this.google = google;
      const mapContainer = this.$refs.googleMap;

      this.map = await new google.maps.Map(
        mapContainer,
        this.mapOptions
      );

      let bounds;

      if (
        this.eudrDetail.coordinates.length &&
        this.eudrDetail.reportType == 'REGISTERED_FARM'
      ) {
        this.overlayPolygon = await this.createPolygon(this.overlayPolygon, this.polygonCoords, false, false, undefined, undefined, "#1F5D51", 3);
        bounds = this.getPolygonBounds();
      } else {
        const swne = await this.calculateCoordsForPolygun(google);
        bounds = new google.maps.LatLngBounds(swne[0], swne[1]);
      }

      this.map.fitBounds(bounds);
      const srcImage = this.deforestImage;

      class CustomOverlay extends google.maps.OverlayView {
        bounds_;
        image_;
        div_;

        constructor(bounds, image) {
          super();
          this.bounds_ = bounds;
          this.image_ = image;
          this.div_ = null;
        }
        onAdd() {
          this.div_ = document.createElement("div");
          this.div_.style.borderStyle = "none";
          this.div_.style.borderWidth = "0px";
          this.div_.style.position = "absolute";

          // Create the img element and attach it to the div.
          const img = document.createElement("img");
          img.src = this.image_;

          img.style.width = "100%";
          img.style.height = "100%";
          img.style.position = "absolute";
          this.div_.appendChild(img);

          const panes = this.getPanes();
          panes.overlayLayer.appendChild(this.div_);
        }
        draw() {
          const overlayProjection = this.getProjection();
          const sw = overlayProjection.fromLatLngToDivPixel(
            this.bounds_.getSouthWest()
            // The custom USGSOverlay object contains the USGS image,
            // the bounds of the image, and a reference to the map.
          );
          const ne = overlayProjection.fromLatLngToDivPixel(
            this.bounds_.getNorthEast()
          );

          // Resize the image's div to fit the indicated dimensions.
          if (this.div_) {
            this.div_.style.left = sw.x + "px";
            this.div_.style.top = ne.y + "px";
            this.div_.style.width = ne.x - sw.x + "px";
            this.div_.style.height = sw.y - ne.y + "px";
            this.div_.pointerEvents = "none";
          }
        }
        onRemove() {
          if (this.div_) {
            this.div_.parentNode.removeChild(this.div_);
            this.div_ = null;
          }
        }
      }

      const overlay = new CustomOverlay(bounds, srcImage, document.getElementById('map'));
      overlay.setMap(this.map);

  // Create the circle button with an SVG icon
  const pointButton = document.createElement("button");
  pointButton.id = "pointButton";
  pointButton.classList.add("mapTypeSelector");
  pointButton.style.position = "absolute";
  pointButton.style.bottom = "100px";
  pointButton.style.right = "20px";
  pointButton.style.backgroundColor = "white";
  pointButton.style.border = "none"; // No border
  pointButton.style.padding = "10px"; // Full button clickable
  pointButton.style.cursor = "pointer"; // Pointer cursor

  pointButton.innerHTML = `<img src="/icons/circle_marker.svg" alt="Draw Circle Geofence" class="button-icon" width="24px" height="24px" style="filter: none;">`;

  // Create the custom tooltip for circle button
  const pointTooltip = document.createElement("div");
  pointTooltip.classList.add("custom-tooltip");
  pointTooltip.innerText = "Draw Circular Geofence";
  document.body.appendChild(pointTooltip);

  // Show/hide tooltip for circle button
  pointButton.addEventListener("mouseenter", () => {
    const rect = pointButton.getBoundingClientRect();
    pointTooltip.style.display = "block";
    pointTooltip.style.left = `${rect.left + window.scrollX + 10}px`;
    pointTooltip.style.top = `${rect.top + window.scrollY - 40}px`;
  });
  pointButton.addEventListener("mouseleave", () => {
    pointTooltip.style.display = "none";
  });

  // Circle button click event
  pointButton.addEventListener('click', (e) => {
    this.drawType = "POINT";
    Array.from(document.getElementsByClassName("mapTypeSelector")).forEach((el) => {
      el.classList.remove("active");
      el.style.backgroundColor = "white";
      const icon = el.querySelector("img");
      if (icon) {
        icon.style.filter = "none"; // Reset the color filter to default for all buttons
      }
    });

    e.target.classList.add("active");
    pointButton.style.backgroundColor = "#28a745"; // Set button bg to green when active
    const icon = pointButton.querySelector("img");
    icon.style.filter = "brightness(0) invert(1)"; // Make the icon white

    this.switchToCircle();

    this.google.maps.event.clearListeners(this.map, "click");
    this.google.maps.event.addListener(this.map, "click", this.circleListener);
  });

  // Create the polygon button with an SVG icon
  const polyButton = document.createElement("button");
  polyButton.id = "polyButton";
  polyButton.classList.add("mapTypeSelector", "active");
  polyButton.style.position = "absolute";
  polyButton.style.bottom = "20px";
  polyButton.style.right = "20px";
  polyButton.style.backgroundColor = "white"; 
  polyButton.style.border = "none";
  polyButton.style.padding = "10px";
  polyButton.style.cursor = "pointer";

  polyButton.innerHTML = `<img src="/icons/polygon_marker.svg" alt="Draw Polygon Geofence" class="button-icon" width="24px" height="24px" style="filter: none">`;

  // Create the custom tooltip for polygon button
  const polyTooltip = document.createElement("div");
  polyTooltip.classList.add("custom-tooltip");
  polyTooltip.innerText = "Draw Polygon Geofence";
  document.body.appendChild(polyTooltip);

  // Show/hide tooltip for polygon button
  polyButton.addEventListener("mouseenter", () => {
    const rect = polyButton.getBoundingClientRect();
    polyTooltip.style.display = "block";
    polyTooltip.style.left = `${rect.left + window.scrollX + 10}px`;
    polyTooltip.style.top = `${rect.top + window.scrollY - 40}px`;
  });
  polyButton.addEventListener("mouseleave", () => {
    polyTooltip.style.display = "none";
  });

  // Polygon button click event
  polyButton.addEventListener('click', (e) => {
    this.drawType = "POLYGON";
    Array.from(document.getElementsByClassName("mapTypeSelector")).forEach((el) => {
      el.classList.remove("active");
      el.style.backgroundColor = "white";
      const icon = el.querySelector("img");
      if (icon) {
        icon.style.filter = "none"; // Reset the color filter to default for all buttons
      }
    });

    e.target.classList.add("active");
    polyButton.style.backgroundColor = "#28a745"; // Set button bg to green when active
    const icon = polyButton.querySelector("img");
    icon.style.filter = "brightness(0) invert(1)"; // Make the icon white

    this.switchToPolygon();

    this.google.maps.event.clearListeners(this.map, "click");
    this.google.maps.event.addListener(this.map, "click", this.polygonListener);
  });

  // Add buttons to the map controls
  this.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(pointButton);
  this.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(polyButton);

  // Add custom styles for tooltips and icons
  const style = document.createElement("style");
  style.innerHTML = `
    .custom-tooltip {
      position: absolute;
      display: none;
      background-color: white;
      color: black;
      border: 1px solid #ccc;
      padding: 5px;
      border-radius: 5px;
      margin-left: -60px;
      box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
      font-size: 12px;
      z-index: 1000;
    }
    .mapTypeSelector.active img {
      filter: brightness(0) invert(1); /* Change the icon to white when active */
    }
  `;

    document.head.appendChild(style);
      this.map.addListener("click", this.polygonListener);

      // Drawing additional polygons and circles
      await this.drawDisputeShapes();
    },
    async drawDisputeShapes() {
      if (this.disputes.length > 0) {
        for (let i = 0; i < this.disputes.length; i++) {
          const { geofence, ...dispute } = this.disputes[i];
          if (!geofence.geofenceCoordinates || geofence.geofenceCoordinates.length === 0) {
            // Draw circular geofence for dispute
            const center = {
              lat: parseFloat(geofence.geofenceCenterLat),
              lng: parseFloat(geofence.geofenceCenterLog)
            };

            const circle = await this.createCircle(geofence.geofenceRadius, center, this.chooseColorCode(i));

            this.shapes[i] = circle;
          } else {
            // Draw Polygon geofence for dispute
            const polygonCoords = geofence.geofenceCoordinates.map((c) => ({
              lat: parseFloat(c.lat),
              lng: parseFloat(c.log)
            }));

            const polygon = await this.createPolygon(null, polygonCoords, true, false, 0.4, this.chooseColorCode(i));
            this.shapes[i] = polygon;
          }

          this.shapes[i].setMap(this.map);
          this.shapes[i].addListener("click", () => {
            // Clearing all polygons/circle on overlap
            this.switchToCircle();
            this.switchToPolygon();

            // Displaying dispute details
            this.updateMode = true;

            // Fill dispute data
            this.selectedDisputeId = dispute.id;
            this.selectedDisputeIndex = i;
            this.disputeReason = dispute.title;
            this.additionalNotes = dispute.description;
            this.initialPlantationDate = dispute.initialPlantationDate;
            this.status = dispute.status;
            this.actionDialog = true;
            // this.disputeDetails = true;
          });
        }
      }
    },
    switchToPolygon() {
      this.radiusSetter = false;

      if (this.circle !== null) {
        this.circle.setMap(null);
        this.geofenceRadius = 0.0;
        this.circle = null;
      }

      if (this.marker !== null) {
        this.marker.setMap(null);
        this.marker = null;
      }
    },
    switchToCircle() {
      if (this.polygon !== null) {
        while (this.parentPolygonCoords.length > 0) {
          this.parentPolygonCoords.pop();
        }
        this.polygon.setMap(null);
        this.polygon = this.createPolygon(this.polygon, this.parentPolygonCoords);
        this.polygon = null;
      }
    },
    testWithinBounds(latLng) {
      if (this.overlayPolygon) {
          if (!this.google.maps.geometry.poly.containsLocation(latLng, this.overlayPolygon)) {
          return false;
        }
      } else {
        if (this.google.maps.geometry.spherical.
        computeDistanceBetween(this.mapOptions.center, latLng) > parseFloat(this.eudrDetail.radius)) {
          return false;
        }
      }

      return true;
    },
    async circleListener(mapsMouseEvent) {
      const latLng = mapsMouseEvent.latLng.toJSON();

      // Exit if polygon outside overlay polygon
      if (!this.testWithinBounds(latLng)) {
        return;
      }

      this.latitude = latLng.lat;
      this.longitude = latLng.lng;

      this.gotoCurrentLocation(this.latitude, this.longitude);

      if (this.circle !== null) this.circle.setCenter(latLng);
      this.createMarker();
      this.radiusSetter = true;
    },
    async polygonListener(mapsMouseEvent) {
      console.log("polygon")
      const latLng = mapsMouseEvent.latLng.toJSON();

      // Exit if polygon outside overlay polygon
      if (!this.testWithinBounds(latLng)) {
        return;
      }

      this.parentPolygonCoords.push(latLng);
      this.polygon = await this.createPolygon(this.polygon, this.parentPolygonCoords, true, true, 0.4, this.currentColorCode);

      this.polygon.addListener("click", () => {
        // Show dispte popup
        this.actionDialog = true;
        // this.disputeDetails = true;
      });

      this.polygon.setMap(this.map);
    },
    async createPolygon(polygon, coords, clickable = false, editable = false, fillOpacity = 0, fillColor = "#FF0000", strokeColor = "#F2F2F2", strokeWeight = 2) {
      if (polygon != null) polygon.setMap(null);
      polygon = await new this.google.maps.Polygon({
        paths: coords,
        strokeColor,
        strokeOpacity: 0.8,
        strokeWeight,
        fillColor,
        fillOpacity,
        editable,
        draggable: false,
        clickable,
        icon: this.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
      });

      return polygon;
    },
    async createCircle(radius = 0, center = null, fillColor = "#ffffff") {
      if (!center) {
        center = {
          lat: this.latitude,
          lng: this.longitude,
        };
      }

      const circle = await new this.google.maps.Circle({
        fillColor,
        fillOpacity: 0.4,
        strokeWeight: 1,
        strokeColor: "#F2F2F2",
        map: this.map,
        center,
        radius,
      });

      return circle;
    },
    getDateFormat(date) {
      if (date) {
        return moment(date).format("DD MMMM YYYY");
      }
    },
    async uploadAttachment() {
      const uploadResponse = await S3UploadService.singleUpload(this.attachment, 'dispute_resolution_attachments');
      return uploadResponse;
    },
    async saveDispute() {
      if (!this.noAgricultreAgreement) {
        this.$notify({
          'type': 'error',
          'text':  this.$t("dueDiligence.agricultureAgreement")
        })
        return;
      }
      
      if (!this.disputeReason) {
        this.$notify({
          'type': 'error',
          'text':  this.$t("dueDiligence.disputeReason")
        })
        return;
      }

      if (!this.updateMode) {
        if (!this.attachment) {
          this.$notify({
            'type': 'error',
            'text': this.$t("dueDiligence.attachDisputeFile")
          })
          return;
        }

        // Attempting file upload
        const result = await this.uploadAttachment();
        const path = this.polygon ? this.polygon.getPath(): this.circle;
        const area = this.google.maps.geometry.spherical.computeArea(path);

        const geofence = {
          userId: this.$store.getters.getUser.id,
          geofenceRadius: this.geofenceRadius,
          geofenceCenterLat: this.latitude,
          geofenceCenterLog: this.longitude,
          geofenceArea: area
        };

        const coordinates = this.parentPolygonCoords.map((coord) => ({
          lat: coord.lat,
          log: coord.lng
        }));

        const createDisputeInput = {
          reportRequestId: Number(this.$props.reportRequestId),
          title: this.disputeReason,
          description: this.additionalNotes,
          initialPlantationDate: this.initialPlantationDate,
          s3Key: result.key,
          s3Location: result.fullPath,
          status: "OPEN",
          geofence,
          coordinates
        };

        this.startLoading();

        DeforestationService.createDispute(createDisputeInput).then((res) => {
          if (res.errors && res.errors.length > 0) {
            this.$notify({
              title: "Error creating dispute",
              text: `${res.errors[0].message} and ${res.errors.length - 1} more...`,
              type: 'error'
            });
            return;
          }

          // this.stopLoading();

          const dispute = res.data.createDispute;
          this.disputes.unshift(dispute);
          this.closeDispute();
          this.clearDispute();
         
          this.parentPolygonCoords = [];
          if (this.polygon) {
            this.polygon.setMap(null);
            this.polygon = null;
          }
          if (this.circle) {
            this.circle.setMap(null);
            this.circle = null;
          }
          this.disputeReason = '';
          this.initialPlantationDate = '';
          this.additionalNotes = '';
          this.noAgricultreAgreement = false;

          this.getDeforestationEUDR();
        });
      } else {
        let updatedAttachment;

        // Updating data
        if (this.attachment) {
          updatedAttachment = await this.uploadAttachment();
        }

        const updateDisputeInput = {
          title: this.disputeReason,
          description: this.additionalNotes,
          initialPlantationDate: this.initialPlantationDate,
          status: this.status
        };

        if (updatedAttachment) {
          updateDisputeInput['s3Key'] = updatedAttachment.key;
          updateDisputeInput['s3Location'] = updatedAttachment.fullPath;
        }

        this.startLoading();

        // Run update Query
        DeforestationService.updateDispute(this.selectedDisputeId, updateDisputeInput).then((res) => {
          const updatedDispute = res.data.updateDispute;
          this.disputes[this.selectedDisputeIndex] = updatedDispute;

          // this.stopLoading();
          this.closeDispute();
          this.disputeReason = '';
          this.initialPlantationDate = '';
          this.additionalNotes = '';
          this.noAgricultreAgreement = false;
          this.updateMode = false;
          
          this.clearDispute();
          this.getDeforestationEUDR();
        });

      }

    },

    async downloadPdf() {
      this.startLoading()
      try {
        this.downloadSourceFile(`${process.env.VUE_APP_DEFORESTRATION_REPORTING_API_BASE_URL}/production-place/dispute/pdf/${this.productionPlace.id}`,"application/pdf", "dispute-report.pdf")
           .then(() => {
            this.stopLoading()
          }).catch(() => {
            this.stopLoading()
          })
      } catch (err) {
        console.log(err)
        this.stopLoading()
      }
    },
    addCommentToDispute(disputeIndex, comment) {
      this.disputes[disputeIndex].comments.push(comment);
    },
    closeDispute() {
      this.updateMode = false;
      this.selectedDisputeId = null;
      this.selectedDisputeIndex = null;
      this.disputeDetails = false;
      this.actionDialog = false;
    },
    clearDispute() {
      this.disputeReason = '';
      this.additionalNotes = '';
      this.attachment = null;
      this.noAgricultreAgreement = null;
      this.circle = null;
      this.polygon = null;
      this.polygonCoords = null;
      this.latitude = 0;
      this.longitude = 0;
      this.geofenceRadius = 0.0;
      this.disputeDetails = false;
    },
    editShape() {
      this.disputeDetails = true;
    },
    deleteResolution() {
      console.log(this.selectedDisputeId);
      if (!this.selectedDisputeId) {
        if (this.circle) {
          this.circle.setMap(null);
          this.circle = null;
          this.geofenceRadius = 0.0;
        }
        if (this.polygon) {
          this.polygon.setMap(null);
          this.polygon = null;
          this.parentPolygonCoords = [];
        }
        this.clearDispute();
        this.deleteconfirm = false;
        this.actionDialog = false;
        this.selectedDisputeId = null;
        return;
      }
      // this.shapes[this.selectedDisputeIndex].setMap(null);
      // this.shapes.splice(this.selectedDisputeIndex, 1);
      this.itemToDelete = { id: this.selectedDisputeId, type: "location" };
      this.deleteconfirm = true;
      this.confirmboxinfo.title = "Confirmation";
      this.confirmboxinfo.message =
          "Are you sure you want to delete this polygon? It will also remove  any information and files attached with it.";
    },
    async deleteConfirmed(action, data) {
      this.deleteconfirm = false;
      this.actionDialog = false;

      if (action) {
        try {
          await DeforestationService.deleteDisputeHistory(data.id);
          
          if (this.shapes[this.selectedDisputeIndex]) {
            this.shapes[this.selectedDisputeIndex].setMap(null);
            this.shapes.splice(this.selectedDisputeIndex, 1);
          }

          this.getDisputes();
          this.disputeReason = '';
          this.initialPlantationDate = '';
          this.additionalNotes = '';
          this.noAgricultreAgreement = false;
          this.updateMode = false;
          this.selectedDisputeId = null;

          this.clearDispute();
          this.getDeforestationEUDR();

        } catch (error) {
          console.error("Failed to delete the dispute:", error);
          this.$notify({
            title: "Error",
            text: "Failed to delete the geofence. Please try again.",
            type: "error",
          });
        }
      }
      this.itemToDelete = { id: null, type: null };
    },
  },
  props: {
    dialogU: {
      type: Boolean,
      required: true,
    },
    reportRequestId: {
      type: [String, Number],
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

<style lang="scss" scoped>
::v-deep .bg .v-input__slot {
  background-color: $primary-color;
  color: #ffffff;
}

::v-deep .v-text-field__details {
  display: none !important;
}

span.text-wrap {
  width: 100%;
  max-width: 400px;
  padding: 10px 0;
  border-bottom: 1px solid lightgrey;
  text-wrap: wrap;
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

.rectangular-badge .v-badge__badge {
  border-radius: 4px !important;
  min-width: 10px !important;
  padding: 4px 10px;
}

section.map-holder {
  border: 4px solid #00bd73;
  border-radius: 18px;
  padding: 12px;
}

section.map-holder-id {
  border: 4px solid #184980;
  border-radius: 18px;
  padding: 12px;
}

.google-map {
  border-radius: 12px !important;
}

.index-indicator {
  min-height: 18px !important;
  min-width: 18px !important;
  border-radius: 4px;

  &.v-high {
    background-color: #FF8F8F;
    border: 1px solid #8B0000;
  }

  &.high {
    background-color: #FFB6B6;
    border: 1px solid #8B0000;
  }

  &.med {
    background-color: #FFCEB3;
    border: 1px solid #F06B20;
  }

  &.low {
    background-color: #FFE8C5;
    border: 1px solid #F06B20;
  }

  &.v-low {
    background-color: #FFFCEC;
    border: 1px solid #F49238;
  }

  &.zero {
    background-color: #E2FFF4;
    border: 1px solid #00BD73;
  }
}

::v-deep .mapTypeSelector {
  width: 40px;
  height: 40px;
  border: 1px solid #00BD73;
  border-radius: 8px;
  color: #00BD73;
  background-color: white;
  font-size: 1.2em;
  margin: 12px;
  font-weight: 900;

  &.active {
    background-color: #00BD73;
    color: white;
  }
}

::v-deep .v-dialog.radius-overlay {
  transform: translate(-120%, 30%) !important;
}

.file-chip {
    max-width: 640px;
    margin: 12px 0;
    padding: 24px;
    border-radius: 12px;
    background-color: rgba(14, 191, 103, 0.2);

    ::v-deep .mdi::before {
        color: green !important;
    }
}
</style>
