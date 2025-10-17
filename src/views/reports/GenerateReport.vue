<template>
  <v-dialog v-model="showDialog" width="30%" @click:outside="closeDialog" :retain-focus="false">
    <v-card class="custom-card" rounded="0">
      <v-toolbar color="primary" class="white--text mb-8">
        <v-toolbar-title class="font-weight-bold">
          {{ $t("satelliteReport.selectFarm") }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon class="white--text" @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-form @submit.prevent="generateReport" ref="forms">
        <v-card-text class="black--text">
          <v-row class="mb-4 px-4">
            <label for="chooseFarm">
              <div class="text-body-1">{{ $t("satelliteReport.chooseFarm") }}</div>
            </label>
          </v-row>
          <v-row class="px-4">
            <v-autocomplete id="chooseFarm" :rules="form.selectedFarm" v-model="selectedFarm" :items="farmOptions"
              item-text="farmName" item-value="id" cache-items :search-input.sync="searchFarm" dense hide-no-data
              hide-selected class="mt-1" :placeholder="$t('Select')" outlined return-object :loading="optionsLoading">
            </v-autocomplete>
          </v-row>
          <v-row class="mb-4 px-4">
            <label for="chooseZone">
              <div class="text-body-1">{{ $t("satelliteReport.chooseZone") }}</div>
            </label>
          </v-row>
          <v-row class="px-4">
            <v-autocomplete id="chooseZone" :rules="form.selectedZones" v-model="selectedZones" :items="zoneOptions"
              item-text="geofenceName" item-value="id" :search-input.sync="searchZone" dense multiple
              class="mt-1" :placeholder="$t('Select')" outlined return-object :loading="optionsLoading">
            </v-autocomplete>
          </v-row>
          <v-row class="mb-4 px-4">
            <label for="chooseDateOfInterest">
              <div class="text-body-1">{{ $t('oma.dateOfInterest') }}</div>
            </label>
          </v-row>
          <v-row class="px-4">
            <v-menu v-model="filterByDateMenu" :close-on-content-click="false" :nudge-right="40"
              transition="scale-transition" offset-y min-width="auto">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field append-icon="mdi-calendar" :rules="form.dateOfinterest" v-model="dateOfinterest" outlined
                  dense readonly v-bind="attrs" v-on="on" v-on:click:append="filterByDateMenu = true"
                  placeholder="Select Date"></v-text-field>
              </template>
              <v-date-picker v-model="dateOfinterest" :max="maxDate" placeholder="" @input="filterByDateMenu = false"></v-date-picker>
            </v-menu>
          </v-row>
          <v-row class="mb-4 px-4">
            <label>{{ $t('oma.maximumCloudCoverage') }} </label>
          </v-row>
          <v-row class="px-4">
            <v-select :rules="form.maximumCloudCoverageTollerence" v-model="maximumCloudCoverageTollerence"
              :items="maximumCloudCoverageTollerenceItems" outlined dense item-value="id" item-text="value"
              :placeholder="$t('Select')">
            </v-select>
          </v-row>
          <v-divider></v-divider>
          <v-card-actions class="mt-4">
            <v-spacer></v-spacer>
            <v-btn @click="closeDialog" outlined right height="44" width="116" depressed color="primary">
              {{ $t("cancel") }}
            </v-btn>
            <v-btn type="submit" right height="44" color="primary" class="px-6">
              {{ $t("satelliteReport.genReport") }}
            </v-btn>
          </v-card-actions>
        </v-card-text>
      </v-form>

    </v-card>
  </v-dialog>
</template>
<script>
import ReportService from '@/_services/ReportService'
import loadingMixin from "@/mixins/LoadingMixin";
import moment from 'moment';
export default {
  data() {
    return {
      selectedFarm: '',
      selectedZones: [],
      searchFarm: "",
      searchZone: "",
      filterByDateMenu: false,
      dateOfinterest: '',
      maximumCloudCoverageTollerenceItems: [
        { id: 10, value: 10 },
        { id: 20, value: 20 },
        { id: 50, value: 50 },
        { id: 80, value: 80 }
      ],
      maximumCloudCoverageTollerence: '',
      form: {
        selectedFarm: [(v) => !!v || 'Farm Field is required'],
        dateOfinterest: [(v) => !!v || 'Date Of Interest field is required'],
        selectedZones: [(zones) => {
          if(Array.isArray(zones) && zones.length) {
            const hasGeofence = zones.every(zone => this.zonesWithGeofence.includes(zone));
            console.log(zones, hasGeofence)
            if(!hasGeofence) return 'Some zones does not contain geofence';
            return true;
          }
          return true;
        }]
      },
      maxDate: moment().format('DD-MMM-YYYY'),
    };
  },
  props: {
    farmsWithZonesList: {
      type: Array,
      required: true,
    },
    optionsLoading: {
      type: Boolean,
      required: true,
    },
    showDialog: {
      type: Boolean,
      required: true,
    },
  },
  watch: {
    searchFarm(val) {
      this.searchFarm = val;
    },
    searchZone(val) {
      this.searchZone = val;
    },
    selectedFarm() {
      this.selectedZones = [];
    }
  },
  computed: {
    zonesWithGeofence() {
      if(!this.selectedFarm) return [];
      return this.selectedFarm.segments.filter(segment => {
        return !segment.isPrimary && Array.isArray(segment.geofence_coordinates) && segment.geofence_coordinates.length > 0;
      });
    },
    farmsWithGeofence() {
      return this.farmsWithZonesList.filter(farm => {
        if(Array.isArray(farm.farmCoordinates) && farm.farmCoordinates.length) return true;
        const hasGeofenceOnFarm = farm.segments.some(segment => {
          if(segment.isPrimary && segment.geofenceRadius) return true;
          return false;
        })
        return hasGeofenceOnFarm;
      })
    },
    farmOptions() {
      return this.farmsWithZonesList.filter(farm => {
        if(Array.isArray(farm.farmCoordinates) && farm.farmCoordinates.length) return true;
        const hasGeofenceOnFarmOrZone = farm.segments.some(segment => {
          if(segment.isPrimary && segment.geofenceRadius) return true;
          if(Array.isArray(segment.geofence_coordinates) && segment.geofence_coordinates.length) return true;
        })
        return hasGeofenceOnFarmOrZone;
      })
    },
    zoneOptions() {
      if(!this.selectedFarm) return [];
      const options = this.selectedFarm.segments.filter(segment => {
        return !segment.isPrimary && Array.isArray(segment.geofence_coordinates) && segment.geofence_coordinates.length > 0;
      });
      return options;
    }
  },
  methods: {
    async generateReport() {
      try {
        if (!this.$refs.forms.validate()) return;
        const isRequestedForFarm = !this.selectedZones || this.selectedZones.length === 0;
        if(isRequestedForFarm) {
          const hasFarmGeofence = this.farmsWithGeofence.includes(this.selectedFarm);
          if(!hasFarmGeofence) {
            this.$notify({
              type: 'error',
              text: 'Farm does not have geofence',
            });
            return;
          }
        }
        const payload = {
          dateOfInterest: this.dateOfinterest,
          farmId: this.selectedFarm?.id,
          geofenceIds: Array.isArray(this.selectedZones) ? this.selectedZones.map(zone => zone.id) : [],
          maxCloudCoverage: this.maximumCloudCoverageTollerence
        }
        this.startLoading()
        const responseData = await ReportService.generateSatelliteReport(payload);
        this.stopLoading();
        if(responseData?.success) {
          this.closeDialog();
          this.$refs.forms.reset();
          this.$notify({
            text: responseData.message,
            type: "success",
          });
          this.$emit('reportGenerated');
        } else if(responseData?.message) {
          this.$notify({
            text: responseData.message,
            type: 'error'
          });
        }
      } catch (error) {
        this.stopLoading();
      }
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
  },
  mixins: [loadingMixin]
};
</script>
