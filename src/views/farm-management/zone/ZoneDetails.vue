<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>

    <v-container fluid v-if="hasFarm">
      <div class="page-title">
        <h4>{{ zoneName }}</h4>
        <v-spacer></v-spacer>
        <v-btn color="primary" dark outlined @click="$router.push({ name: 'ZonesList' ,params: {id: $route.query.farmId}, query: {farmId: $route.query.farmId} })" class="mr-2">
          {{ $t('Cancel') }}
        </v-btn>
        <v-btn outlined color="primary" dark @click="$router.push({ name: 'FarmEditZone', params: { id: $route.params.id }, query: {farmId: $route.query.farmId} })">
          {{ $t('Edit Zone') }}
        </v-btn>
      </div>

      <v-card class="mx-auto" outlined>
        <v-row style="height: 600px;">
          <v-col cols="3">
            <v-list two-line class="ma-8">
              <v-list-item-content class="mb-4">
                <v-list-item-subtitle class="mb-2">Perimeter</v-list-item-subtitle>
                <v-list-item-title class="text--disabled">{{ this.currentObj.geofenceParameter}}  {{ this.currentObj.geofenceParameterUOMId === 1 ? 'F' : 'M' }}</v-list-item-title>
              </v-list-item-content>

              <v-divider></v-divider>

              <v-list-item-content class="mb-4">
                <v-list-item-subtitle class="mb-2">Area</v-list-item-subtitle>
                <v-list-item-title class="text--disabled">{{ this.currentObj.geofenceArea}} {{ this.currentObj.geofenceAreaUOMId === 1 ? 'A' : 'H' }} </v-list-item-title>
              </v-list-item-content>

              <v-divider></v-divider>

              <!-- <v-list-item-content class="mb-4">
                <v-list-item-subtitle class="mb-2">Number of Group</v-list-item-subtitle>
                <v-list-item-title class="text--disabled">(3)</v-list-item-title>
              </v-list-item-content> -->
            </v-list>
          </v-col>

          <v-col cols="9">

            <div class="google-map" style="width:100%;height:560px" id="map" ref="googleMap"></div>

          </v-col>
        </v-row>
      </v-card>
    </v-container>

    <v-container fluid v-if="!hasFarm && !mixingIsLoading">
      <v-card>
        <div class="py-16 text-center">
          <img src="/icons/nodata.svg" /><br />
          <strong class="red--text">
            {{ $t("noRecordFound") }}
          </strong>
        </div>
      </v-card>
  </v-container>
  </div>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";
import Breadcrumb from "@/components/core/Breadcrumb";
import FarmService from "@/_services/FarmService";
import _ from 'lodash';
import { getGoogleMapsLoader } from '@/mixins/GoogleMapLoaderSingleton';

export default {
  components: {
    breadcrumb: Breadcrumb
  },
  mixins: [loadingMixin],
  computed: {
    hasFarm() {
      return !_.isEmpty(this.orgFarm);
    },
    zoneName() {
      if(this.hasFarm) {
        return this.currentObj?.geofenceName;
      }
      return null;
    },
  },
  data() {
    return {
      breadcrumbs: [
        {
          text: this.$t('dashboard'),
          disabled: false,
          to: "/",
        },
        {
          text: this.$t('farm.farms'),
          link: true,
          exact: true,
          disabled: false,
          to: { name: "My farm" },
        },
        {
          text: this.$t('farm.zones'),
          disabled: true,
          to: { name: "ZonesList" },
        }
      ],
      headers: [
        {
          text: "Group Name",
          align: "start",
          sortable: false,
          class: "black--text",
          value: "goal_name",
        },
        {
          text: "Number of Animals",
          value: "userFarmData",
          class: "black--text",
        },
        {
          text: "Status",
          value: "goalSubjectMapData[0].goalSubjectData.subject",
          class: "black--text",
        }
      ],
      mapOptions: {
        mapTypeId: 'satellite',
        center: {
          lat: -34.397,
          lng: 150.644
        },
 
        zoom: 18,
        disableDefaultUI: true,
      },
      oldSegments: [],
      orgFarm: {},
      to: '',
      from: '',
      totalPages: '',
      tableOptions: {},
      search: '',
      currentObj:{},
    }
  },
  methods: {
    async initializeMap(google) {
      this.google = google;
      const mapContainer = this.$refs.googleMap
      this.map = await new google.maps.Map(mapContainer, this.mapOptions);

      this.polygon = new google.maps.Polygon({
        paths: this.parentPolygonCoords,
        strokeColor: "#00BD73",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FFF7EC",
        fillOpacity: 0.35,
      });

      this.polygon.setMap(this.map);

      if (this.oldSegments.length > 0) {
        this.oldSegments.forEach((segment) => {
          var pg = new google.maps.Polygon({
            paths: segment.coordinates,
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
          });

          pg.setMap(this.map)
          var bounds = new this.google.maps.LatLngBounds();
          for (let i = 0; i < segment.coordinates.length; i++) {
            bounds.extend(segment.coordinates[i]);
          }
          new this.google.maps.Marker({
            position: bounds.getCenter(),
            map: this.map,
            icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflagq.png',
            label: { color: 'white', fontWeight: 'bold', fontSize: '16px', text: segment.geofenceName }
          });
        });
      }

      this.map.addListener("click", (mapsMouseEvent) => {
        const latLng = mapsMouseEvent.latLng.toJSON();
        this.latitude = latLng.lat;
        this.longitude = latLng.lng;
      });
    },
  },
  async mounted() {
    this.startLoading()

    if (this.$route.query?.name) { this.geofenceName = this.$route.query.name; }

    await FarmService.getFarm(this.$route.query.farmId).then(async (data) => {
        if(!data) return;
        this.orgFarm = data;

        this.currentObj = this.orgFarm.segments.find((el)=>el.id == this.$route.params.id);

        this.latitude = this.orgFarm.lat;
        this.longitude = this.orgFarm.log;
        this.address = this.orgFarm.address;
        this.mapOptions.center.lat = this.latitude;
        this.mapOptions.center.lng = this.longitude;

        var codes = this.orgFarm.coordinates.map(function (elm) {
          return { lat: parseFloat(elm['lat']), lng: parseFloat(elm['log']) };
        });
        this.parentPolygonCoords = codes;
        
        if (this.orgFarm.segments && this.orgFarm.segments.length > 0) {
          this.orgFarm.segments.forEach((segment) => {
            var cc = segment.coordinates.map((elm) => {
              return { lat: parseFloat(elm['lat']), lng: parseFloat(elm['log']) };
            });
            this.oldSegments.push({ geofenceName: segment.geofenceName, coordinates: cc });
          });
        }
      });
      this.stopLoading();

    try {
      const loader = getGoogleMapsLoader();
      const google = await loader.load();
      await this.initializeMap(google);
      this.loader = loader;

    } catch (e) {
      console.log(e);
    }
  },
}
</script>

<style>

</style>