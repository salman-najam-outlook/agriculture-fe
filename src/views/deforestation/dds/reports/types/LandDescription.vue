<template>
  <v-card-text>
    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="saveFormData">
      <v-row class="py-0 mb-5">
        <v-col cols="12" class="py-0">
          <h3 class="headline-text-color">Description/Location of All Lands/Buildings and/or Fixtures in Which Raw Leaf
            Tobacco Can Be Grown, Cured or Stored.
          </h3>
        </v-col>
      </v-row>
      <div v-for="(item, index) in location_descriptions" :key="index" class="mt-10">
        <v-row class="py-0">
          <v-col cols="" class="py-0">
            <div class="subtitle black--text">
              Description
              <span class="red--text"><strong>* </strong></span>
            </div>
            <v-textarea name="input-7-1" outline label="| Enter description" auto-grow shaped
              :rules="[v => !!v || 'This field is required.']"
              v-model="location_descriptions[index].description"></v-textarea>
          </v-col>
        </v-row>

        <v-row class="py-0">
          <v-col cols="4" class="py-0">
            <div class="subtitle black--text">Location
              <span class="red--text"><strong>*</strong></span>
              <v-tooltip top color="00BD73" max-width="350">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-bind="attrs" v-on="on">
                    mdi-help-circle-outline
                  </v-icon>
                </template>
                <span>{{ $t('animal.healthRecordInfo.purposeTooltip') }}</span>
              </v-tooltip>
            </div>
            <v-text-field :placeholder="'Enter location'" :rules="[v => !!v || 'This field is required.']"
              v-model="location_descriptions[index].location" outlined dense></v-text-field>
          </v-col>
          <v-col cols="4" class="py-0">
            <div class="subtitle black--text">Lot No.
              <span class="red--text"><strong>*</strong></span>
            </div>
            <v-text-field :placeholder="'Enter lot#'" :rules="[v => !!v || 'This field is required.']"
              v-model="location_descriptions[index].lot_number" outlined dense></v-text-field>
          </v-col>
          <v-col cols="4" class="py-0">
            <div class="subtitle black--text">Township
              <span class="red--text"><strong>*</strong></span>
            </div>
            <v-text-field :placeholder="'Enter township'" :rules="[v => !!v || 'This field is required.']"
              v-model="location_descriptions[index].township" outlined dense></v-text-field>
          </v-col>
        </v-row>

        <v-row class="py-0">
          <v-col cols="4" class="py-0">
            <div class="subtitle black--text">911 Address
              <span class="red--text"><strong>*</strong></span>
            </div>
            <v-text-field :placeholder="'| Enter address'" :rules="[v => !!v || 'This field is required.']"
              v-model="location_descriptions[index].address_911" outlined dense></v-text-field>
          </v-col>
        </v-row>
        <v-row class="py-0">
          <v-col cols="4" class="py-0">
            <div class="subtitle black--text">Owned or Leased
              <span class="red--text"><strong>*</strong></span>
            </div>
            <v-radio-group :rules="[v => !!v || 'This field is required.']"
              v-model="location_descriptions[index].owned_or_leased">
              <v-radio label="Owned" value="owned"></v-radio>
              <v-radio label="Leased from Others" value="leased_from_other"></v-radio>
              <v-radio label="Leased to Others" value="leased_to_other"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row class="py-0">
          <v-col cols="4" class="py-0">
            <div class="subtitle black--text">Name of Land Owner
              <span class="red--text"><strong>*</strong></span>
            </div>
            <v-text-field :placeholder="'Enter name of land owner'" :rules="[v => !!v || 'This field is required.']"
              v-model="location_descriptions[index].owner_name" outlined dense></v-text-field>
          </v-col>
        </v-row>
        <v-row class="py-0">
          <v-col cols="4" class="py-0">
            <div class="subtitle black--text">Purpose of Land/Building/Fixture
              <span class="red--text"><strong>*</strong></span>
            </div>
            <v-radio-group :rules="[v => !!v || 'This field is required.']"
              v-model="location_descriptions[index].purpose">
              <v-radio label="Growing" value="Growing"></v-radio>
              <v-radio label="Curing" value="Curing"></v-radio>
              <v-radio label="Storage" value="Storage"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row class="py-0 mb-5">
          <v-col cols="12" class="py-0">
            <div class="subtitle black--text">
              <h3 class="marker-block"><span class="marker"></span>Mark Land Location</h3>
              <!-- <h3><img src="/img/marker.png" width="20px"/>Mark Land Location</h3> -->
              <div class="google-map mt-5" style="width:100%;height:550px; z-index: 0;" id="map" :ref="'googleMap' + index">
              </div>
              <!-- <v-text-field :placeholder="'Enter name of land owner'" :rules="[v => !!v || 'This field is required.']"
                v-model="location_descriptions[index].geofench" outlined dense></v-text-field> -->
            </div>
          </v-col>
        </v-row>
        <v-divider></v-divider>
      </div>
      <v-row class="py-0 mt-5">
        <v-col cols="8" class="py-0">
        </v-col>
        <v-col cols="4" class="py-0">
          <div @click="addNewRecord">
            <v-icon left> mdi-plus-circle-outline </v-icon>Add another Owners, Partners, Officers
          </div>
        </v-col>
      </v-row>

      <v-row class="py-0">
        <v-col cols="12" class="py-0">
          <v-checkbox label="I confirm that the information provided in this form is accurate."
            :rules="[v => !!v || 'You must agree to continue!']" v-model="isChecked"></v-checkbox>
        </v-col>

      </v-row>
    </v-form>
  </v-card-text>
</template>
<script>
//import AnimalService from "@/_services/AnimalService";
// import gql from "graphql-tag";
//import VueGoogleAutocomplete from "vue-google-autocomplete";
import { getGoogleMapsLoader } from '@/mixins/GoogleMapLoaderSingleton';


export default {
  watch: {
    submit: function (newValue) {
      if (newValue) {
        this.saveFormData();
      }
    },
  },
  props: {
    type: {
      required: false,
    },
    submit: {
      required: true,
    },

  },
  data() {
    return {
      addressData: null,
      loader: null,
      latitude: 27.700769,
      longitude: 85.300140,
      google: [],
      map: [],
      marker: [],
      polygon: null,
      subPolygon: null,
      mapOptions: {
        mapTypeId: 'satellite',
        center: { lat: 27.700769, lng: 85.300140 },
 
        zoom: 18,
        disableDefaultUI: true,
        zoomControl: true,
      },
      address: '',


      valid: false,
      isChecked: false,
      location_descriptions: [{
        description: "",
        location: "",
        lot_number: "",
        township: "",
        address_911: "",
        owned_or_leased: "",
        owner_name: "",
        purpose: "",
        geofench: "",
      }]
    };
  },
  methods: {
    addNewRecord() {
      this.location_descriptions.push({
        description: "",
        location: "",
        lot_number: "",
        township: "",
        address_911: "",
        owned_or_leased: "",
        owner_name: "",
        purpose: "",
        geofench: "",
      })
      let self = this;
      setTimeout(() => {
        console.log(self.location_descriptions.length - 1, "asdsd")
        self.initializeMap(self.google, self.location_descriptions.length - 1)
      }, 500)
    },
    saveFormData() {
      console.log(this.$refs.form.validate(), "asdasd")
      if (!this.$refs.form.validate()) {
        this.$emit("setSubmit", false);
        return;
      }

      console.log(this.location_descriptions,"this.location_descriptionsthis.location_descriptionsthis.location_descriptions")
      this.$emit("saveData", { location_descriptions: this.location_descriptions });

    },
    async initializeMap(google, index) {
      this.google[index] = google;
      const mapContainer = this.$refs['googleMap' + index];
      this.map[index] = new google.maps.Map(mapContainer[0], this.mapOptions);

      this.map[index].addListener("click", async (mapsMouseEvent) => {
        const latLng = mapsMouseEvent.latLng.toJSON();
        this.createMarker(index,latLng);
      });
      // this.createPolygon(false);
      this.createMarker(index);
    },
    createMarker(index, latLng=null) {
      if (this.marker[index] != null) this.marker[index].setMap(null);
      if(!latLng){
        latLng = { lat: this.latitude, lng: this.longitude };
      }
      this.marker[index] = new this.google[index].maps.Marker({
        position: latLng,
        // title:"Hello World!"
      });

      this.location_descriptions[index].geofench = JSON.stringify(latLng);
      // To add the marker to the map, call setMap();
      this.marker[index].setMap(this.map[index]);
    },
  },
  async mounted() {
    try {
      const loader = getGoogleMapsLoader();
      const google = await loader.load();
      await this.initializeMap(google);
      this.loader = loader;

    } catch (e) {
      console.log(e);
    }
  }

};
</script>

<style scoped>

.marker-block{
  display: flex;
  align-items: center;
}

.marker {
    background-image: url('/img/marker.png');
    background-size: 30px 30px;
    background-repeat: no-repeat;
    background-position: center;
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }


.headline-text-color {
  color: #00BD73 !important;
}

.theme--light.v-icon {
  color: #00BD73 !important;
}
</style>