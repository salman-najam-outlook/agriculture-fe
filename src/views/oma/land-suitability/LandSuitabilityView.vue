<template>
  <div>
    <v-container fluid>
      <div class="d-flex mt-8 mb-6">
        <h2 class="text-capitalize">
          {{ $t("oma.landSuitibility") }}
        </h2>
        <v-spacer></v-spacer>
        <v-btn
            color="primary"
            dark
            class="mr-2"
            outlined
        >
          {{ $t('oma.back') }}
        </v-btn>
      </div>

      <v-divider></v-divider>

      <h2 class="mt-3">{{$t("oma.selectFarm")}}</h2>

      <v-row align="center" class="mt-3">
        <v-col
            class="d-flex"
            cols="12"
            sm="4"
        >
          <v-select
              v-model="selectedItem"
              :items="items"
              label="Select Farm"
              solo
          ></v-select>

          <v-btn
              :color="buttonColor"
              dark
              class="ml-2"
              height="50"
          >
            {{ $t('oma.search') }}
          </v-btn>
        </v-col>
      </v-row>

      <v-row align="center">
        <v-col
            class="d-flex"
            cols="12"
            sm="6"
        >
          <h2>Choose Your Location</h2>
        </v-col>
        <v-col
            class="d-flex"
            cols="12"
            sm="6"
        >

          <v-btn
              :color="buttonColor"
              dark
              class="mb-2"
              height="50"
          >
            {{ $t('oma.getLandEvaluation') }}
          </v-btn>

          <v-btn
              color="gray"
              dark
              @click="openDialog"
              class="ml-2 mb-2"
              height="50"
          >
            {{ $t('oma.downloadPdfReport') }}
          </v-btn>
        </v-col>

      </v-row>

      <v-row>
        <v-col
            class="d-flex"
            cols="12"
            sm="6"
        >

          <GmapMap :center="{ lat: 20.5937, lng: 78.9629 }" :zoom="4" map-type-id="satellite"
                   style="width: 100%; height: 466px">
            />
            <GmapCluster>
              <GmapMarker :icon="{ url: '/icons/map-marker.png' }">
                <gmap-info-window>
                </gmap-info-window>
              </GmapMarker>
            </GmapCluster>
          </GmapMap>
        </v-col>

        <v-col
            class="d-flex"
            cols="12"
            sm="6"
        >

          <v-container v-if="landEvaluation" class="land-evaluation-panel">
            <div class="d-flex mt-4 mb-4">
              <h2 class="text-capitalize">
                {{ $t("oma.landEvaluation") }}
              </h2>
            </div>

            <v-divider></v-divider>
          </v-container>
          <v-container v-else class="d-flex align-center justify-center land-evaluation-panel">
            <v-row>
              <v-col cols="6" offset="3">
                <div class="centered-text">
                  <v-icon size="48" class="mb-2">mdi-circle-off-outline</v-icon>
                  <p class="red--text">{{$t("oma.noRecordAvailable")}}</p>
                  <p>
                    {{$t("oma.pleaseEnterCoordinateText")}}
                  </p>
                </div>
              </v-col>
            </v-row>
          </v-container>


        </v-col>
      </v-row>

      <SoilChemicalProperties :isOpen="dialogOpen" :range-labels="rangeLabels" :modalTitle="modalTitle" :topic="topic"
                              :topicValue="topicValue" :results="resultArray" @close-properties="closeDialog"/>
    </v-container>
  </div>
</template>
<script>

import loadingMixin from "@/mixins/LoadingMixin"
import GmapCluster from "vue2-google-maps/dist/components/cluster";
import SoilChemicalProperties from "@/views/oma/land-suitability/PropertiesPopup.vue";


export default {
  created() {

  },
  components: {SoilChemicalProperties, GmapCluster},

  data() {
    return {
      title: 'Land Suitability',
      items: ['Farm1', 'Farm2', 'Farm3', 'Farm4'],
      selectedItem: null,
      landEvaluation: false,
      dialogOpen: false,
      rangeLabels: {
        unsuitable: 'More than 8.3 or Less than 4.3',
        marginallySuitable: 'Between 4.3-4.5 or 7.5-8.3',
        moderatelySuitable: 'Between 4.5-5 or 6.5 -7.5',
        highlySuitable: 'Between 5-6.5'
      },
      modalTitle: 'Soil Physical Properties',
      topic: 'Soil Texture (USDA Class)',
      topicValue: '1 - Clay',
      resultArray: [
        'Other',
        'Clay',
        'Silty Clay',
        'Sandy Clay',
        'Clay Loam',
        'Silty Clay Loam',
        'Sandy Clay Loam',
        'Loam',
        'Silty Loam',
        'Sandy Loam',
        'Silt',
        'Loamy Sand',
        'Sand'
      ]
    }
  },
  computed: {
    buttonColor() {
      return this.selectedItem ? 'primary' : 'gray';
    }
  },
  methods: {
    openDialog() {
      this.dialogOpen = true;
    },
    closeDialog() {
      this.dialogOpen = false;
    }
  },
  mixins: [loadingMixin]
}
</script>
<style>
.centered-text {
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}

.land-evaluation-panel {
  min-height: 600px;
  width: 100%;
  background-color: white
}

</style>