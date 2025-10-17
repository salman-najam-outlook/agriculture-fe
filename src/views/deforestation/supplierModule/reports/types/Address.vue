<template>
  <v-card-text>
    <v-form ref="form"
      v-model="valid"
      lazy-validation
      @submit.prevent="saveFormData">
      <v-row class="py-0 mb-5">
        <v-col cols="12" class="py-0">
          <h3 class="headline-text-color">
            {{ heading }}
          </h3>
        </v-col>
      </v-row>
      <v-row class="py-0">
        <v-col cols="4" class="py-0">
          <div class="subtitle black--text">Unit/Apt/Suite
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
          <v-text-field 
          :placeholder="'Enter unit/size'"
           v-model="address.unit_apt_suite" 
           :rules="[v => !!v || 'This field is required.']"
           outlined dense></v-text-field>
        </v-col>
        <v-col cols="4" class="py-0">
          <div class="subtitle black--text">Street Number And Name
            <span class="red--text"><strong>* </strong></span>
            <v-tooltip top color="00BD73" max-width="350">
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on">
                  mdi-help-circle-outline
                </v-icon>
              </template>
              <span>{{ $t('animal.healthRecordInfo.purposeTooltip') }}</span>
            </v-tooltip>
          </div>
          <v-text-field :placeholder="'Enter street no'"
           v-model="address.street_number" 
           :rules="[v => !!v || 'This field is required.']"
           outlined dense></v-text-field>

        </v-col>
        <v-col cols="4" class="py-0">
          <div class="subtitle black--text">Lot/Concession/RR No./Postal Stn
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
          <v-text-field :placeholder="'Enter lot/concession/RR No./postal Stn'" 
          v-model="address.lot_concession_rrNo_postalStn"
          :rules="[v => !!v || 'This field is required.']"
           outlined
            dense></v-text-field>
        </v-col>
      </v-row>

      <v-row class="py-0">
        <v-col cols="4" class="py-0">
          <div class="subtitle black--text">City/Town
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
          <v-text-field :placeholder="'Enter city/town'" 
          v-model="address.city_town"
          :rules="[v => !!v || 'This field is required.']"
           outlined dense></v-text-field>
        </v-col>
        <v-col cols="4" class="py-0">
          <div class="subtitle black--text">Province/State
            <span class="red--text"><strong>* </strong></span>
            <v-tooltip top color="00BD73" max-width="350">
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on">
                  mdi-help-circle-outline
                </v-icon>
              </template>
              <span>{{ $t('animal.healthRecordInfo.purposeTooltip') }}</span>
            </v-tooltip>
          </div>
          <v-text-field :placeholder="'Make a selection'" 
          v-model="address.province_state" 
          :rules="[v => !!v || 'This field is required.']"
          outlined dense></v-text-field>
        </v-col>
        <v-col cols="4" class="py-0">
          <div class="subtitle black--text">Country
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
          
          <v-text-field :placeholder="'Make a selection'" 
          v-model="address.country"
          :rules="[v => !!v || 'This field is required.']"
           outlined dense></v-text-field>
        </v-col>
      </v-row>

      <v-row class="py-0">
        <v-col cols="4" class="py-0">
          <div class="subtitle black--text">Postal/Zip Code
            <span class="red--text"><strong>* </strong></span>
            <v-tooltip top color="00BD73" max-width="350">
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on">
                  mdi-help-circle-outline
                </v-icon>
              </template>
              <span>{{ $t('animal.healthRecordInfo.purposeTooltip') }}</span>
            </v-tooltip>
          </div>
          <v-text-field :placeholder="'Enter zip code'"
           v-model="address.postal_zip_code"
           :rules="[v => !!v || 'This field is required.']"
            outlined dense></v-text-field>
        </v-col>
      </v-row>
      <v-row class="py-0">
        <v-col cols="12" class="py-0">
          <v-checkbox label="I confirm that the information provided in this form is accurate." 
          :rules="[v => !!v || 'You must agree to continue!']"
          v-model="isChecked"></v-checkbox>
          
        </v-col>
      </v-row>
    </v-form>
  </v-card-text>
</template>
<script>
//import AnimalService from "@/_services/AnimalService";
// import gql from "graphql-tag";

export default {

  props: {
    type: {
      required: true,
    },
    submit: {
      required: true,
    },
  }, 
  watch: {
        type: function (newValue) {
            console.log(newValue, "newValuenewValuenewValue")
        },
        submit: function (newValue) {
          console.log(newValue, "newValuenewValuenewValue")
          if(newValue){
            this.saveFormData();
          }
        },
    },
  computed:{
    heading(){
      if(this.type == 'business_address'){
        return "Business Office Address";
      }else if(this.type == 'head_office_address'){
        return "Head Office Address";
      }else if(this.type == 'mailing_address'){
        return "Mailing Office Address";
      }
      return "";
    }
  },
  mounted(){
    if(this.type == 'business_address'){
        this.address.type = 'business';
      }else if(this.type == 'head_office_address'){
        this.address.type = 'head_office';
      }else if(this.type == 'mailing_address'){
        this.address.type = 'mailing';
      }
   },
  data() {
    return {
      isChecked:false,
      valid:false,
      address: {
        unit_apt_suite: "",
        street_number: "",
        lot_concession_rrNo_postalStn: "",
        city_town: "",
        province_state: "",
        country: "",
        postal_zip_code: "",
        type: "",
      }
    };
  },
  
  methods:{
    saveFormData() {
      console.log(this.$refs.form.validate(),"asdasd")
      if (!this.$refs.form.validate()){
        this.$emit("setSubmit", false);
        return;
      } 
      this.$emit("saveData", {address:this.address});
    },
  }
};
</script>

<style scoped>

.headline-text-color {
    color: #00BD73 !important;
}

.theme--light.v-icon {
  color: #00BD73 !important;
}</style>