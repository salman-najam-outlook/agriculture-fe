<template>
<v-dialog
      v-model="dialog"
      persistent
      max-width="75vw"
    >
      <v-card>
        <v-toolbar flat color="secondary">
          <v-toolbar-title class="white--text">
            {{$t('farm.zoneDetails')}}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon class="white--text" @click="closeModal">
              <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <div>
          <v-container fluid>
            <div class="page-title">
             <h1>{{ zoneDetail.geofenceName }}</h1>
             <v-spacer></v-spacer>
              <v-btn color="red" dark outlined @click="deleteZone" class="mr-2">
                {{ $t('delete') }}
              </v-btn>
              <v-btn outlined color="primary" dark @click="editZoneModal">
                {{ $t('farm.editZone') }}
              </v-btn>
            </div>
            <v-card class="mx-auto" outlined>
              <v-row style="height: 600px;">
                <v-col cols="3">
                  <v-list two-line class="ma-8">
                    <v-list-item-content class="mb-4">
                      <v-list-item-subtitle class="mb-2">{{$t('farm.perimeter')}}</v-list-item-subtitle>
                      <v-list-item-title class="text--disabled">{{zoneDetail.geofenceParameter}} M</v-list-item-title>
                    </v-list-item-content>
      
                    <v-divider></v-divider>
      
                    <v-list-item-content class="mb-4">
                      <v-list-item-subtitle class="mb-2">{{$t('farm.area')}}</v-list-item-subtitle>
                      <v-list-item-title class="text--disabled">{{ zoneDetail.geofenceArea + ' ' + (zoneDetail.areaUomId == 1 ? 'Acre' : 'Hectare') }}</v-list-item-title>
                    </v-list-item-content>
      
                    <v-divider></v-divider>
      
                    <v-list-item-content class="mb-4">
                      <v-list-item-subtitle class="mb-2">{{$t('farm.numberOfTrees')}}</v-list-item-subtitle>
                      <v-list-item-title class="text--disabled">{{ this.treeCount }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list>
                </v-col>
      
                <v-col cols="9">
      
                  <div class="google-map" style="width:100%;height:560px" id="map" ref="googleMap"></div>
      
                </v-col>
              </v-row>
            </v-card>
<!--       
            <v-toolbar class="bdr secondary2light my-8" :elevation="0" outlined>
              <v-toolbar-title class="grey--text text--darken-2" style="font-size: 18px">
                {{ $t("farm.group") }}
              </v-toolbar-title>
            </v-toolbar> -->
      
            <!-- <v-card elevation="10" class="px-5">
              <v-card-text>
                <v-data-table :headers="headers" :items="groupList" item-key="id" :items-per-page="10"
                  :hide-default-footer="true" :options.sync="tableOptions">
                  <template v-slot:top>
                    <div class="d-flex mt-5">
                      <v-text-field prepend-inner-icon="mdi-magnify" outlined height="5px" :placeholder="$t('search')" dense
                        v-model="search" class="shrink"></v-text-field>
                      <v-btn :disabled="search.length < 1" color="primary" height="40" width="40" max-width="40" outlined
                        class="ml-8">
                        <v-icon>mdi-filter-outline</v-icon>
                      </v-btn>
                      <v-spacer></v-spacer>
                      <div class="py-1 title">
                        {{
                        (tableOptions.page - 1) * tableOptions.limit + 1
                        }}
                        -
                        {{
                        tableOptions.page * tableOptions.limit -
                        (tableOptions.limit - groupCount)
                        }}
                        of {{ totalCount }}
                      </div>
                      <v-btn class="mx-2" fab small outlined color="primary" :disabled="tableOptions.page <= 1"
                        @click="pageChange(false)">
                        <v-icon dark> mdi-chevron-left </v-icon>
                      </v-btn>
                      <v-btn class="mx-2" fab small outlined color="primary" :disabled="(tableOptions.page - 1) * tableOptions.itemsPerPage +
                                count >=
                                totalCount
                                " 
                        @click="pageChange(true)">
                        <v-icon dark> mdi-chevron-right </v-icon>
                      </v-btn>
                      <v-btn class="mx-2" fab small outlined color="primary">
                        <v-icon dark>
                          mdi-cog-outline
                        </v-icon>
                      </v-btn>
                    </div>
                  </template>
                  <template v-if="groupList.length" v-slot:body="{ items }">
                    <tbody>
                      <tr v-for="item in items" :key="item.id">
                        <td>{{ item.name }}</td>
                        <td>{{ item.animalCounts }}</td>
                        <td>{{ item.status }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card> -->
      
          </v-container>
        </div>        
      </v-card>
    </v-dialog>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";
import FarmService from "@/_services/FarmService";
import {getRandomColor} from "@/utils";
import { getGoogleMapsLoader } from '@/mixins/GoogleMapLoaderSingleton';


export default {
  mixins: [loadingMixin],
    props: {
      dialog: {
        type: Boolean,
        required: true,
      },
      zoneDetail: {
          required: true,
      },
      locationId: {
        type: Number, 
        required: true,
      },
      farmId: {
        type: Number,
        required: true,
      },
      zoneId:{
        type:Number,
        required:true,
      },
      zoneList:{
        type:Array,
      },
      locationObj: {
        type: Object
      },
    },
    apollo: {
        groups: {
            query: `query findGroupsByZoneId($zoneId: Int!, $search: String, $page: Int, $limit: Int) {
                findGroupsByZoneId(zoneId: $zoneId, search: $search, page: $page, limit: $limit) {
                  rows { 
                    id
                    animalCounts
                    name
                    status
                  }
                  totalCount
              }
            }`,
            variables() {
                return {
                  zoneId: parseInt(this.zoneDetail.id),
                    page: this.tableOptions.page,
                    limit: this.tableOptions.limit,
                    search: this.search
                }
            },
            result({ data }) {
              this.groupList = data.findGroupsByZoneId.rows;
              this.totalCount = data.findGroupsByZoneId.totalCount;
              this.groupCount = this.groupList.length;
            },
            fetchPolicy: 'network-only',
        }
    },
  data() {
    return {
      headers: [
        {
          text: this.$t("farm.zoneName"),
          align: "start",
          sortable: false,
          class: "black--text",
          value: "goal_name",
        },
        {
          text: this.$t("farm.numberOfTrees"),
          value: "userFarmData",
          class: "black--text",
        },
        {
          text: this.$t("farm.status"),
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
      tableOptions: { page: 1, limit: 10 },
      search: '',
      groupList: [],
      groupCount: 0,
      totalCount: 0,
      treeCount:0,
    }
  },
  methods: {

    async fetchZoneDetail(){
        try{
            this.zoneDetail = await FarmService.getZoneGeofence(+this.zoneId);

            if(this.zoneDetail){
              this.treeCount = this.zoneDetail.tree_details.length ?? 0
            }
        }
        catch(error){
          console.error(error)
        }
    },

    async fetchFarmDetails(){
      FarmService.getFarm(this.farmId).then(async (data) => {
        let codes
        this.orgFarm = data;
        this.stopLoading();
        this.latitude = this.orgFarm.lat;
        this.longitude = this.orgFarm.log;
        this.address = this.orgFarm.address;
        this.mapOptions.center.lat = this.locationObj?.lat || this.latitude;
        this.mapOptions.center.lng = this.locationObj?.log || this.longitude;

        if (this.locationObj?.mainGeofence?.geofence_coordinates) {
          codes = this.locationObj?.mainGeofence?.geofence_coordinates.map(function (elm) {
            return { lat: parseFloat(elm['lat']), lng: parseFloat(elm['log']) };
          });
          this.parentPolygonCoords = codes;
        }

        else if (this.orgFarm.coordinates.length > 0) {
          codes = this.orgFarm.coordinates.map(function (elm) {
            return { lat: parseFloat(elm['lat']), lng: parseFloat(elm['log']) };
          });
          this.parentPolygonCoords = codes;
        }

        if (this.zoneList && this.zoneList.length > 0) {
          this.zoneList.forEach((zone) => {
            var cc = zone.geofence_coordinates.map((elm) => {
              return { lat: parseFloat(elm['lat']), lng: parseFloat(elm['log']) };
            });
            this.oldSegments.push({ geofenceName: zone.geofenceName, coordinates: cc });
          });
        }


        try {
          const loader = getGoogleMapsLoader();
          const google = await loader.load();
          await this.initializeMap(google);
          this.loader = loader;

        } catch (e) {
          console.log(e);
        }
      });
    },

    async createCircle(center, radius = 0) {
      this.circle = await new this.google.maps.Circle({
        fillColor: '#FFFFFF',
        fillOpacity: 0.2,
        strokeWeight: 0,
        map: this.map,
        center,
        radius,
        clickable: false,
      });
      this.circle.setMap(this.map);
    },

    async initializeMap(google) {
      this.google = google;
      const mapContainer = this.$refs.googleMap
      this.map = await new google.maps.Map(mapContainer, this.mapOptions);

      if (this.locationObj?.mainGeofence?.geofenceRadius) {
        const circularFarm = this.locationObj?.mainGeofence
        await this.createCircle({
          lat: circularFarm.geofenceCenterLat,
          lng: circularFarm.geofenceCenterLog
        }, circularFarm.geofenceRadius);
      } else {
        this.polygon = new google.maps.Polygon({
          paths: this.parentPolygonCoords,
          strokeColor: "#00BD73",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: getRandomColor(),
          fillOpacity: 0.35,
        });

        this.polygon.setMap(this.map);
      }

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

  deleteZone(){
    const item = {id: this.zoneDetail.id}
    this.$emit("deleteZone", item,false)
  },
  closeModal(){
    this.$emit("rowClicked",null, false);
  },
  
  editZoneModal(){
    const item = {id: this.zoneDetail.id}
    this.$emit("editZoneFromDetail",item, false);
  }
  },
  async mounted() {
    this.startLoading()

    await this.fetchZoneDetail();

    await this.fetchFarmDetails()

  }
}
</script>

<style>

</style>