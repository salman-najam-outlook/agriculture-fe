<template>
  <div>
    <v-dialog v-model="pickupLocationsAddDialog" width="85%" persistent>
      <v-card>
        <v-toolbar color="secondary" flat class="white--text">
          <v-toolbar-title class="font-weight-bold">
            {{ $t("marketplace.settings.addPickupLocationBtn") }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon class="white--text" @click="closeWithoutChange">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container fluid>
          <v-container>
            <v-row class="d-flex mb-5">
              <v-col cols="3" style="height: 540px">
                <v-radio-group v-model="type" column>
                  <v-radio
                    label="Current Location"
                    value="currentLocation"
                    @click="gotoCurrentLocation"
                  ></v-radio>
                  <v-radio label="Pin Location" value="pinLocation"></v-radio>
                </v-radio-group>
                <template v-if="address">
                  <v-divider></v-divider>
                  <v-icon>mdi-map-marker</v-icon>
                  {{ address }}
                  <v-btn
                    @click="saveLocation"
                    block
                    color="primary"
                    class="mt-5"
                    depressed
                    >{{ $t("marketplace.settings.addThisAddress") }}</v-btn
                  >
                </template>
              </v-col>
              <v-col cols="9" class="main-map">
                <v-card class="location-finder" flat>
                  <v-row class="gmap-wrapper" no-gutters>
                    <v-col cols="12" class="mx-4 mr-8">
                      <vue-google-autocomplete
                        id="mapplace"
                        types=""
                        v-model="address"
                        classname="form-control"
                        :placeholder="$t('marketplace.settings.searchLocation')"
                        v-on:placechanged="setPlace"
                      >
                      </vue-google-autocomplete>
                    </v-col>
                  </v-row>
                  <div class="gmap-lan-lat pa-4">
                    <v-row class="lat-lang-maper py-2" no-gutters>
                      <v-col cols="6">
                        <v-text-field
                          class="mr-2"
                          v-model="latitude"
                          label="Latitude"
                          outlined
                          dense
                          @input="createMarker"
                          hide-details
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          class="ml-2"
                          v-model="longitude"
                          label="Longitude"
                          outlined
                          dense
                          @input="createMarker"
                          hide-details
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </div>
                </v-card>
                <div v-if="mapLoading" class="image-loader"></div>
                <div
                  v-show="!mapLoading"
                  class="google-map"
                  style="width: 100%; height: 540px; z-index: 0"
                  id="map"
                  ref="googleMap"
                ></div>
                <v-btn
                  class="mx-2 float-right"
                  fab
                  dark
                  small
                  color="white"
                  style="margin-top: -39vh"
                  @click="gotoCurrentLocation"
                >
                  <v-icon dark color="gray">mdi-crosshairs-gps</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-container>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :multi-line="true">
      Your location is disabled. Please search your location from left menus.
      <template v-slot:action="{ attrs }">
        <v-btn
          color="red"
          text
          v-bind="attrs"
          @click="snackbar = false"
          :timeout="5000"
        >
          $t("close")
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import VueGoogleAutocomplete from "vue-google-autocomplete"
import loadingMixin from "@/mixins/LoadingMixin"
import { getGoogleMapsLoader } from "@/mixins/GoogleMapLoaderSingleton"

export default {
  components: {
    VueGoogleAutocomplete,
  },

  mixins: [loadingMixin],

  props: {
    pickupLocationsAddDialog: {
      type: Boolean,
      require: true,
      default: true,
    },
  },

  data() {
    return {
      type: "",
      addressData: null,
      snackbar: false,
      locationEnabled: true,
      address: "",
      loader: null,
      latitude: 0,
      longitude: 0,
      google: null,
      map: null,
      marker: null,
      mapOptions: {
        mapTypeId: "satellite",
        center: {},
        zoom: 18,
        disableDefaultUI: true,
        zoomControl: true,
      },
      pickupLocation: {
        name: "",
        lat: "",
        log: "",
        address: "",
      },
      mapLoading: true,
    }
  },

  async mounted() {
    if (this.pickupLocation) {
      this.address = this.pickupLocation.address || ""
      if (this.pickupLocation?.lat && this.pickupLocation?.log) {
        this.latitude = this.pickupLocation.lat
        this.longitude = this.pickupLocation.log
        this.mapOptions.center.lat = this.latitude
        this.mapOptions.center.lng = this.longitude
      } else {
        await this.getCurrentPosition()
      }
    }

    try {
      const loader = getGoogleMapsLoader()
      const google = await loader.load()
      this.google = google
      await this.initializeMap(google)
      this.loader = loader
    } catch (e) {
      console.log(e)
    }
  },

  methods: {
    getCurrentPosition() {
      return new Promise((resolve, reject) => {
        const success = (position) => {
          this.latitude = position.coords.latitude
          this.longitude = position.coords.longitude
          this.mapOptions.center.lat = this.latitude
          this.mapOptions.center.lng = this.longitude
          if (this.map) this.map.setCenter(this.mapOptions.center)
          resolve(position)
        }

        const error = (err) => {
          console.log("location", err)
          this.locationEnabled = false
          this.snackbar = true
          reject(err)
        }

        navigator.geolocation.getCurrentPosition(success, error)
      })
    },

    closeWithoutChange() {
      this.$emit("closeWithoutChange")
    },

    async gotoCurrentLocation() {
      await this.getCurrentPosition()
      const geocoder = new this.google.maps.Geocoder()
      try {
        const response = await geocoder.geocode({
          location: { lat: this.latitude, lng: this.longitude },
        })
        if (response.results[0]) {
          this.address = response.results[0].formatted_address
          this.createMarker()
        }
      } catch (e) {
        console.error("Can't fetch location:", e)
      }
    },

    setPlace(addressData, placeResultData) {
      const latLng = {
        lat: placeResultData.geometry.location.lat(),
        lng: placeResultData.geometry.location.lng(),
      }
      this.map.setCenter(latLng)
      this.latitude = latLng.lat
      this.longitude = latLng.lng
      this.address = placeResultData.formatted_address
      this.addressData = addressData
      this.createMarker()
    },

    createMarker() {
      if (this.marker != null) this.marker.setMap(null)
      const latLng = {
        lat: parseFloat(this.latitude),
        lng: parseFloat(this.longitude),
      }
      this.marker = new this.google.maps.Marker({
        position: latLng,
      })
      this.marker.setMap(this.map)
    },

    async saveLocation() {
      if (!this.address) {
        this.$notify({
          title: "Location is required.",
          type: "error",
        })
        return
      }

      const locationData = {
        id: this.pickupLocation?.id ? parseInt(this.pickupLocation.id) : "",
        lat: Number(this.latitude),
        log: Number(this.longitude),
        address: this.address,
        addressData: this.addressData,
      }

      this.closeModal(locationData)
    },

    closeModal(data = null) {
      this.$emit("close-location-modal", data)
    },

    async initializeMap(google) {
      this.google = google
      const mapContainer = this.$refs.googleMap
      this.map = new google.maps.Map(mapContainer, this.mapOptions)
      this.mapLoading = false
      this.map.addListener("click", async (mapsMouseEvent) => {
        const latLng = mapsMouseEvent.latLng.toJSON()
        const geocoder = new this.google.maps.Geocoder()
        try {
          const response = await geocoder.geocode({ location: latLng })
          if (response.results[0]) {
            const adData = {}
            response.results[0].address_components.forEach((comp) => {
              adData[comp.types[0]] = comp.long_name
            })
            this.addressData = adData
            this.latitude = latLng.lat
            this.longitude = latLng.lng
            this.address = response.results[0].formatted_address
            this.createMarker()
          }
        } catch (e) {
          console.error("Can't fetch location:", e)
        }
      })

      this.createMarker()
    },
  },
}
</script>

<style scoped lang="scss">
::v-deep .pac-target-input {
  border: 1px solid #898989;
  border-radius: 3px;
  min-height: 40px;
  width: 100%;
  padding: 0px 12px;
  caret-color: #00bd73;
}

::v-deep .pac-target-input:focus-visible {
  border: 1px solid #00bd73;
  outline: none;
}

.v-dialog__content {
  z-index: 9999 !important;
}

.main-map {
  position: relative;
  .location-finder {
    top: 0;
    z-index: 999;
    width: 100%;
    .gmap-wrapper {
      z-index: 999;
      position: relative;
      background: white;
    }
    .lat-lang-maper {
      background: white;
    }
  }
}
.image-loader {
  height: 540px;
  width: 100%;
  background-color: #e0e0e0;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(140, 99, 37, 0) 0%,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(140, 99, 37, 0) 100%
    );
    animation: shimmer 1.5s infinite;
  }
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}
</style>
