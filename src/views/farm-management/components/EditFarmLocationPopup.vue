<template>
    <v-dialog
        v-model="dialog"
        persistent
        max-width="50vw"
    >
        <v-card>
            <v-toolbar flat color="secondary">
                <v-toolbar-title class="white--text">
                  {{$t('farm.editFarmLocation')}}
                </v-toolbar-title>
            </v-toolbar>
            <v-row class="mt-5">
                  <v-col cols="6" sm="6" md="6">
                    <label
                      >{{ $t("farm.farmLocationAddress") }}<span>*</span>

                      <v-tooltip top color="black" max-width="220">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on">
                            mdi-information-outline
                          </v-icon>
                        </template>
                        <span>{{ $t("farm.farmLocationAddressInfo") }}</span>
                      </v-tooltip></label
                    >
                    <v-text-field
                      :rules="farmRules.address"
                      readonly
                      @click="showFarmLocation = true"
                      id="dialog-link1"
                      placeholder="Please click to choose location"
                      outlined
                      dense
                      v-model="farmLocation.address"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="6" sm="6" md="6">
                    <label
                      >{{ $t("farm.country") }} <span>*</span>
                      <v-tooltip top color="black" max-width="220">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on">
                            mdi-information-outline
                          </v-icon>
                        </template>                        
                        <span>{{ $t("farm.countryH") }}</span>
                      </v-tooltip></label
                    >
                    <v-select
                      :items="countries"
                      :placeholder="$t('farm.country')"
                      outlined
                      dense
                      v-model="farmLocation.country"
                      item-text="Name"
                      item-value="Name"
                      :rules="farmRules.country"
                    ></v-select>
                  </v-col>

                  <v-col cols="6" sm="6" md="6">
                    <label
                      >{{ $t("farm.provinceState") }}<span>*</span>
                      <v-tooltip top color="black" max-width="220">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on">
                            mdi-information-outline
                          </v-icon>
                        </template>                        
                        <span>{{ $t("farm.provinceStateInfo") }}</span>
                      </v-tooltip>
                    </label>
                    <v-text-field
                      :placeholder="$t('farm.enterHere')"
                      outlined
                      required
                      dense
                      v-model="farmLocation.state"
                      :rules="farmRules.state"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="6" sm="6" md="6">
                    <label
                      >{{ $t("farm.city") }}<span>*</span>
                      <v-tooltip top color="black" max-width="220">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on">
                            mdi-information-outline
                          </v-icon>
                        </template>                        
                        <span>{{ $t("farm.cityInfo") }}</span>
                      </v-tooltip>
                    </label>
                    <v-text-field
                      :placeholder="$t('Enter here')"
                      outlined
                      required
                      dense
                      v-model="farmLocation.city"
                      :rules="farmRules.city"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="6" sm="6" md="6">
                    <label
                      >{{ $t("farm.streetNumber") }}
                      <v-tooltip top color="black" max-width="220">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on">
                            mdi-information-outline
                          </v-icon>
                        </template>
                        <span>{{ $t("farm.streetNumberInfo") }}</span>
                      </v-tooltip>
                    </label>
                    <v-text-field
                      :placeholder="$t('kabale-kisoro Road')"
                      outlined
                      dense
                      v-model="farmLocation.street"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="6" sm="6" md="6">
                    <label
                      >{{ $t("farm.farmNumber") }}
                      <v-tooltip right color="black" max-width="320">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on"
                            >mdi-help-circle-outline</v-icon
                          >
                        </template>                        
                        <span
                          >The postal Number of farm similar to House
                          number.</span
                        >
                      </v-tooltip>
                    </label>
                    <v-text-field
                      :placeholder="$t('farm.farmNumber')"
                      outlined
                      dense
                      v-model="farmLocation.farmNumber"
                    ></v-text-field>
                  </v-col>                
                </v-row>
                <v-row>
                  <v-col cols="6" sm="6" md="6">
                    <v-btn
                      block
                      color="primary"
                      dark
                      depressed
                      outlined
                      @click="showGeofenceTool"
                    >
                      {{ $t("farm.useGeofenceTool") }}
                    </v-btn>
                  </v-col>
                </v-row>
            <div class="mx-4">
                <v-divider ></v-divider>
            </div>
            <v-card-actions class="px-4 py-5 justify-end">
                <v-btn
                    @click="closeWithAction(false)"
                    outlined class="mr-2 px-5" right height="44" depressed color="primary" style="font-weight: 600;"
                >
                    {{  $t('cancel') }}
                </v-btn>
                <v-btn
                    depressed
                    height="44" color="primary" class="px-5" style="font-weight: 600;"
                    @click="closeWithAction(true)"
                >
                    {{  $t('save') }}
                </v-btn>
            </v-card-actions>
        </v-card>
        <FarmLocation
          v-if="showFarmLocation"
          :showMap="showFarmLocation"
          :farm="farmLocation"
          @close-location-modal="farmLocationClosed"
          @close-without-change="closeWithoutChange"
        />
        <location-primary-geofence
          v-if="showMap"
          :showMap="showMap"
          :farm="farmLocation"
          @close-location-modal="locationMapClosed"
          @close-without-change="closeWithoutChange"
        ></location-primary-geofence>
    </v-dialog>
</template>

<script>
import { farmRules } from "@/validations/FarmFormRules.js";
import FarmLocation from "../FarmLocation.vue";
import LocationPrimaryGeofence from "../components/LocationPrimaryGeofence.vue";
import {countries} from "@/constants/countries.js"
import generalMixin from "@/mixins/GeneralMixin";

export default {
    components:{
        FarmLocation,
        LocationPrimaryGeofence
    },
    props: {
        farmId: {
            type: Number,
            required: true,
        },
        dialog: {
            type: Boolean,
            required: true,
        },
        locationDetail: {
          type: Object,
          required: false,
        }
    },mounted() {
        this.farmLocation = this.locationDetail;
    },
    data() {
        return {
            farmRules,
            countries,
            showFarmLocation: false,
            showMap: false,
            farmLocation:{ }
        }
    },
    methods: {
        closeWithAction(action) {
            this.$emit('confirm:action', action, this.farmLocation)
        },
        farmLocationClosed(data) {
            this.showFarmLocation = false;
            this.farmLocation.lat = data.lat;
            this.farmLocation.log = data.log;
            this.farmLocation.address = data.address;
            this.farmLocation.country = data.addressData.country;
            this.farmLocation.city = data.addressData.locality;
            this.farmLocation.state = data.addressData.administrative_area_level_1;
            this.farmLocation.street = data.addressData.route;
        },
        showGeofenceTool() {
            if (this.farmLocation.address) {
                this.showMap = true;
            } else {
                this.$notify({
                text: "Farm Location is required.",
                type: "error",
                });
            }
        },
        locationMapClosed(gdata) {

            this.geofenceValidation = false;
            this.addManually = true;
            this.showMap = false;
            this.farmLocation.lat = gdata.lat;
            this.farmLocation.log = gdata.log;
            this.farmLocation.coordinates = gdata.farmGeofence;
            this.farmLocation.farmGeofence = gdata.farmGeofence;
            this.farmLocation.mainGeofence.geofence_coordinates = gdata.farmGeofence;
            this.farmLocation.area = `${gdata.area}`;
            this.farmLocation.parameter = +gdata.parameter;
            this.farmLocation.areaUomId = gdata.areaUomId;
            this.farmLocation.country = gdata.addressData.country;
            this.farmLocation.city = gdata.addressData.locality;
            this.farmLocation.state = gdata.addressData.administrative_area_level_1;
            this.farmLocation.street = gdata.addressData.route;
            this.farmLocation.geofenceId = gdata.geofenceId;
        },
        closeWithoutChange() {
            this.showMap = false;
            this.showFarmLocation = false;
        },
    },
    mixins: [generalMixin]
}
</script>

<style lang="scss" scoped>
.row {
    margin: 0px !important;
}
#dialog-link1 {
  cursor: pointer !important;
}

#dialog-link1::placeholder {
  color: #002287 !important;
  text-decoration: underline !important;
}
</style>