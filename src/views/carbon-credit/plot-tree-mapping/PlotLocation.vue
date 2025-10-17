<template>
  <v-container fluid>
    <v-card elevation="0">
      <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
      <p class="text-caption primary--text d-flex justify-end align-center pr-4" @click="goBack">
        <v-icon color="primary" size="16">mdi-chevron-left</v-icon> Back
      </p>
      <v-row class="pt-4">
        <!-- Left: Form -->
        <v-col cols="12" md="4">
          <v-card class="pa-6 pt-0" elevation="0">
            <h3 class="font-weight-bold mb-6">{{ $t('carbonCredit.plotTreeMapping.choosePlotLocation') }}</h3>

            <v-form ref="locationForm" v-model="isFormValid">
              <label class="text-caption text-grey-darken-1 mb-1">
                {{ $t('carbonCredit.plotTreeMapping.longitude') }} 
              </label>
              <v-text-field v-model="longitude" outlined dense class="mb-2" :rules="longitudeRules" type="number"
                step="any" :placeholder="$t('carbonCredit.plotTreeMapping.enterLongitude')" />

              <label class="text-caption text-grey-darken-1 mb-1">
                {{ $t('carbonCredit.plotTreeMapping.latitude') }} 
              </label>
              <v-text-field v-model="latitude" outlined dense class="mb-2" :rules="latitudeRules" type="number"
                step="any" :placeholder="$t('carbonCredit.plotTreeMapping.enterLatitude')" />

              <label class="text-caption text-grey-darken-1 mb-1">
                {{ $t('carbonCredit.plotTreeMapping.radius') }} 
              </label>
              <v-text-field v-model="radius" outlined dense class="mb-2" type="number" step="any"
                :placeholder="$t('carbonCredit.plotTreeMapping.enterRadius')" />

              <label class="text-caption text-grey-darken-1 mb-1">
                {{ $t('carbonCredit.plotTreeMapping.additionalNotes') }}
              </label>
              <v-textarea v-model="additionalNotes" outlined dense class="mb-2" :placeholder="$t('enterHere')" />

              <!-- <v-row no-gutters class="d-flex">
                <v-col lg="8" md="8" sm="8" xs="6">
                  <v-text-field v-model="areaSize
                    " type="number" placeholder="1" outlined dense class="rounded-r-0"></v-text-field>
                </v-col>
                <v-col lg="4" md="4" sm="4" xs="6">
                  <v-select :items="areaUnitOptions" item-text="label" item-value="value" dense outlined
                    class="bg rounded-l-0 white--text bg-primary" v-model="areaUnit
                      " hide-details></v-select>
                </v-col>
              </v-row> -->

              <div class="d-flex justify-space-between">
                <v-btn outlined color="primary" class="mr-2" @click="onCancel"
                  style="min-width: 120px">
                  {{ $t('cancel') }}
                </v-btn>
                <v-btn color="primary" dark @click="onSave" style="min-width: 120px">
                  {{ $t('save') }}
                </v-btn>
              </div>
            </v-form>
          </v-card>
        </v-col>

        <!-- Right: Map -->
        <v-col cols="12" md="8" class="pa-0">
          <div class="map-wrapper">
            <div class="search-container">
              <v-text-field 
                ref="searchInput"
                prepend-inner-icon="mdi-magnify" 
                v-model="search"
                :placeholder="$t('carbonCredit.plotTreeMapping.searchAddress')" 
                outlined 
                dense 
                class="map-search"
                @keyup.enter="searchLocation"
                @input="onSearchInput"
                @focus="showAutocomplete = true"
                @blur="handleSearchBlur"
              />
              <!-- Autocomplete dropdown -->
              <v-card v-if="showAutocomplete && autocompleteResults.length > 0" class="autocomplete-list" elevation="5">
                <v-list dense>
                  <v-list-item
                    v-for="(result, index) in autocompleteResults"
                    :key="index"
                    @click="selectAutocompleteResult(result)"
                  >
                    <v-list-item-icon class="mr-3">
                      <v-icon>mdi-map-marker</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>{{ result.description }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </div>
            <div class="map-inner">
              <GmapMap 
                :center="mapCenter" 
                :zoom="18" 
                map-type-id="satellite" 
                style="width: 100%; height: 100%;"
                @click="onMapClick"
                :options="mapOptions"
              >
                <GmapMarker 
                  :position="markerPosition" 
                  :draggable="true" 
                  @dragend="onMarkerDragEnd"
                  :clickable="false"
                />
              </GmapMap>
            </div>
            <v-btn 
              class="mx-2 float-right" 
              fab 
              dark 
              small 
              color="white"
              style="margin-top: -39vh;" 
              @click="gotoCurrentLocation"
            >
              <v-icon dark color="gray">
                mdi-crosshairs-gps
              </v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import CarbonCreditService from '@/_services/CarbonCreditService';
import loadingMixin from "@/mixins/LoadingMixin";

export default {
  name: 'PlotLocation',

  mounted() {
    if (this.$route.params.id) {
      this.loadPlotData(this.$route.params.id);
    } else {
      this.initializeMap();
    }
  },

  data() {
    return {
      isFormValid: false,
      longitude: '',
      latitude: '',
      radius: 0,
      additionalNotes: '',
      search: '',
      mapCenter: { lat: -12.0464, lng: -77.0428 },
      markerPosition: { lat: -12.0464, lng: -77.0428 },
      mapOptions: {
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        gestureHandling: 'cooperative'
      },
      breadcrumbs: [
        { text: 'Dashboard', disabled: true, href: '/' },
        { text: 'Carbon Credit', disabled: true, href: '/carbon-credit' },
        { text: 'Plot Tree Mapping', disabled: true, href: '/carbon-credit/plot-tree-mapping' },
        { text: 'Choose Plot Location', disabled: true, href: '#' },
      ],
      longitudeRules: [
        v => !!v || 'Longitude is required',
        v => !isNaN(v) || 'Longitude must be a number',
        v => (v >= -180 && v <= 180) || 'Longitude must be between -180 and 180'
      ],
      latitudeRules: [
        v => !!v || 'Latitude is required',
        v => !isNaN(v) || 'Latitude must be a number',
        v => (v >= -90 && v <= 90) || 'Latitude must be between -90 and 90'
      ],
      showAutocomplete: false,
      autocompleteResults: [],
      searchTimeout: null
    }
  },

  watch: {
    longitude(newVal) {
      if (newVal && this.latitude) {
        this.updateMarkerPosition();
      }
    },
    latitude(newVal) {
      if (newVal && this.longitude) {
        this.updateMarkerPosition();
      }
    }
  },

  mixins: [loadingMixin],
  methods: {
    goBack() {
      this.$router.go(-1);
    },

    onCancel() {
      this.$router.push({
        name: 'treePlotAdd',
      });
    },

    updateMarkerPosition() {
      if (this.longitude && this.latitude) {
        this.markerPosition = {
          lat: parseFloat(this.latitude),
          lng: parseFloat(this.longitude)
        };
        // Don't update map center - keep it stable
        // this.mapCenter = this.markerPosition;
      }
    },

    onMapClick(event) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      // Update form fields
      this.latitude = lat.toFixed(6);
      this.longitude = lng.toFixed(6);
      
      // Move only the marker, not the map center
      this.markerPosition = { lat, lng };
    },

    onMarkerDragEnd(event) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      // Update form fields
      this.latitude = lat.toFixed(6);
      this.longitude = lng.toFixed(6);
      
      // Update marker position
      this.markerPosition = { lat, lng };
    },

    async searchLocation() {
      if (!this.search.trim()) return;

      this.startLoading();

      try {
        // Wait for Google Maps API to be available
        if (typeof window.google === 'undefined' || !window.google.maps) {
          // If Google Maps API is not loaded, try to load it
          await this.loadGoogleMapsAPI();
        }

        // Create a geocoder instance
        const geocoder = new window.google.maps.Geocoder();
        
        // Search for the address
        geocoder.geocode({ address: this.search }, (results, status) => {
          this.stopLoading();
          
          if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;
            const lat = location.lat();
            const lng = location.lng();
            
            // Update form fields
            this.latitude = lat.toFixed(6);
            this.longitude = lng.toFixed(6);
            
            // Move marker to the searched location
            this.markerPosition = { lat, lng };
            
            // Center the map on the searched location
            this.mapCenter = { lat, lng };
          } else {
            this.$notify({
              title: 'Error',
              text: 'Location not found. Please try a different search term.',
              type: 'error'
            });
          }
        });
      } catch (error) {
        this.stopLoading();
        console.error('Error searching location:', error);
        this.$notify({
          title: 'Error',
          text: 'Error searching location. Please try again.',
          type: 'error'
        });
      }
    },

    loadGoogleMapsAPI() {
      return new Promise((resolve, reject) => {
        // Check if Google Maps API is already loaded
        if (typeof window.google !== 'undefined' && window.google.maps) {
          resolve();
          return;
        }

        // If not loaded, show a message to the user
        this.$notify({
          title: 'Info',
          text: 'Google Maps API is loading. Please try searching again in a moment.',
          type: 'info'
        });
        
        // Wait a bit and try again
        setTimeout(() => {
          if (typeof window.google !== 'undefined' && window.google.maps) {
            resolve();
          } else {
            reject(new Error('Google Maps API not available'));
          }
        }, 2000);
      });
    },

    initializeMap() {
      // Try to get current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // Update map center and marker position
            this.mapCenter = { lat, lng };
            this.markerPosition = { lat, lng };
            
            // Update form fields
            this.latitude = lat.toFixed(6);
            this.longitude = lng.toFixed(6);
          },
          (error) => {
            console.log('Geolocation error:', error);
            // Keep default coordinates if geolocation fails
          }
        );
      }
    },

    async onSave() {
      if (!this.$refs.locationForm.validate()) {
        this.$notify({
          title: 'Error',
          text: 'Please fill in all required fields',
          type: 'error'
        });
        return;
      }

      this.startLoading();

      try {
        const payload = {
          longitude: parseFloat(this.longitude),
          latitude: parseFloat(this.latitude),
          radius: parseFloat(this.radius),
          notes: this.additionalNotes,
        };
        let response;
        if (this.$route.params.id) {
          // Edit mode: update existing plot
          response = await CarbonCreditService.updateTreePlot(this.$route.params.id, payload);
        } else {
          // Add mode: create new plot
          response = await CarbonCreditService.addPlotTreeLocation(payload);
        }
        if (response.success) {
          this.$notify({
            title: 'Success',
            text: response.message || (this.$route.params.id ? 'Location updated successfully!' : 'Location saved successfully!'),
            type: 'success'
          });

          if (this.$route.params.id) {
            this.$router.go(-1);
          } else {
            this.$router.push({ name: 'treePlotAdd' });
          }
        } else {
          this.$notify({
            title: 'Error',
            text: response.message || (this.$route.params.id ? 'Failed to update location' : 'Failed to save location'),
            type: 'error'
          });
        }
      } catch (error) {
        console.log(error);
        this.$notify({
          title: 'Error',
          text: 'An error occurred while saving the location',
          type: 'error'
        });
      } finally {
        this.stopLoading();
      }
    },

    gotoCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // Update map center and marker position
            this.mapCenter = { lat, lng };
            this.markerPosition = { lat, lng };
            
            // Update form fields
            this.latitude = lat.toFixed(6);
            this.longitude = lng.toFixed(6);
          },
          (error) => {
            console.log('Geolocation error:', error);
            this.$notify({
              title: 'Error',
              text: 'Unable to get current location. Please check your browser permissions.',
              type: 'error'
            });
          }
        );
      } else {
        this.$notify({
          title: 'Error',
          text: 'Geolocation is not supported by this browser.',
          type: 'error'
        });
      }
    },

    onSearchInput(value) {
      if (value.length < 3) {
        this.autocompleteResults = [];
        return;
      }

      // Clear previous timeout
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }

      // Debounce the search
      this.searchTimeout = setTimeout(() => {
        this.performAutocompleteSearch(value);
      }, 300);
    },

    handleSearchBlur() {
      // Delay hiding autocomplete to allow for clicks
      setTimeout(() => {
        this.showAutocomplete = false;
      }, 200);
    },

    selectAutocompleteResult(result) {
      this.search = result.description;
      this.showAutocomplete = false;
      
      // Get the place details
      this.getPlaceDetails(result.place_id);
    },

    async performAutocompleteSearch(query) {
      try {
        // Wait for Google Maps API to be available
        if (typeof window.google === 'undefined' || !window.google.maps) {
          await this.loadGoogleMapsAPI();
        }

        const service = new window.google.maps.places.AutocompleteService();
        
        service.getPlacePredictions({
          input: query,
          types: ['geocode', 'establishment'],
          componentRestrictions: { country: [] } // Search worldwide
        }, (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            this.autocompleteResults = predictions;
          } else {
            this.autocompleteResults = [];
          }
        });
      } catch (error) {
        console.error('Autocomplete search error:', error);
        this.autocompleteResults = [];
      }
    },

    async getPlaceDetails(placeId) {
      try {
        const service = new window.google.maps.places.PlacesService(document.createElement('div'));
        
        service.getDetails({
          placeId: placeId,
          fields: ['geometry', 'formatted_address', 'address_components']
        }, (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            
            // Update form fields
            this.latitude = lat.toFixed(6);
            this.longitude = lng.toFixed(6);
            
            // Move marker to the selected location
            this.markerPosition = { lat, lng };
            
            // Center the map on the selected location
            this.mapCenter = { lat, lng };
          }
        });
      } catch (error) {
        console.error('Error getting place details:', error);
        this.$notify({
          title: 'Error',
          text: 'Error getting location details. Please try again.',
          type: 'error'
        });
      }
    },

    async loadPlotData(plotId) {
      this.startLoading();
      try {
        const response = await CarbonCreditService.getTreePlotById(plotId);
        if (response.success) {
          const plot = response.data;
          this.longitude = plot.longitude || '';
          this.latitude = plot.latitude || '';
          this.radius = plot.radius || '';
          this.additionalNotes = plot.notes || '';
          if (plot.latitude && plot.longitude) {
            const lat = parseFloat(plot.latitude);
            const lng = parseFloat(plot.longitude);
            this.mapCenter = { lat, lng };
            this.markerPosition = { lat, lng };
          }
        }
      } catch (error) {
        this.$notify({ title: 'Error', text: 'Failed to load plot location', type: 'error' });
      } finally {
        this.stopLoading();
      }
    }
  }
}
</script>

<style scoped>
.map-wrapper {
  position: relative;
  width: 100%;
  height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.map-search {
  position: absolute;
  top: 14%;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  z-index: 2;
}

.search-container {
  position: absolute;
  width: 100%;
  left: 50%;
  transform: translateX(-50%);
  top: 18%;
  z-index: 3;
}

.map-inner {
  width: 96%;
  height: 100%;
  border-radius: 4px;
  overflow: hidden;
}

::v-deep .v-input__slot {
  background: #fff !important;
  border-radius: 8px !important;
}

::v-deep .v-text-field__details {
  margin-bottom: 8px;
}

::v-deep .v-select__selections {
  padding-top: 8px;
}

::v-deep .v-text-field .v-input__control{
  border-radius: 4px !important;
}

::v-deep .bg-primary .v-input__slot{
  background-color: #03BD72 !important;
  border-color: #03BD72 !important;
}
::v-deep .v-select.v-input--dense .v-select__selection--comma{
  color: #fff !important;
  border-color: #03BD72 !important;
}

::v-deep .bg-primary .v-icon.v-icon{
  color: #fff !important;
}

.autocomplete-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 250px;
  overflow-y: auto;
  z-index: 1000;
  width: 60%;
  margin: auto;
  margin-top: 5%;
}
.autocomplete-list .v-list {
  padding: 0;
}

.autocomplete-item {
  cursor: pointer;
  padding: 8px 16px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
  margin-top: 30px;
}

.autocomplete-item:hover {
  background-color: #f5f5f5;
}

.autocomplete-item:last-child {
  border-bottom: none;
}

.autocomplete-item .v-list-item__content {
  padding: 0;
}

.autocomplete-item .v-list-item__title {
  font-size: 14px;
  color: #333;
  line-height: 1.4;
}
</style>
