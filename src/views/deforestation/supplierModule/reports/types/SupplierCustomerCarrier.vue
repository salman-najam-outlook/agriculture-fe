<template>
  <v-card-text>
    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="saveFormData">
      <v-row class="py-0 mb-5">
        <v-col cols="12" class="py-0">
          <h3 class="headline-text-color" v-if="type == 'supplier'">Supplier Information</h3>
          <h3 class="headline-text-color" v-if="type == 'customer'">Customer Information</h3>
          <h3 class="headline-text-color" v-if="type == 'carrier'">Common Carrier Information</h3>
        </v-col>
      </v-row>
      <div v-for="(item, index) in supplier_customer_carrier" :key="index" class="mt-10">
        <v-row class="py-0">
          <v-col cols="4" class="py-0">
            <div class="subtitle black--text" v-if="type == 'supplier'">
              Supplier Name
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
            <div class="subtitle black--text" v-if="type == 'customer'">
              Customer Name
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
            <div class="subtitle black--text" v-if="type == 'carrier'">
              Transporter Name
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

            <v-text-field :placeholder="'Enter name'" 
            :rules="[v => !!v || 'This field is required.']"
            v-model="supplier_customer_carrier[index].name"
             outlined
              dense></v-text-field>
          </v-col>
          <v-col cols="4" class="py-0">
            <div class="subtitle black--text">
              Street Number And Name
              <span class="red--text"><strong>* </strong></span>
            </div>

            <v-text-field :placeholder="'Enter street no'"
            :rules="[v => !!v || 'This field is required.']"
             v-model="supplier_customer_carrier[index].street" 
             outlined
              dense></v-text-field>
          </v-col>
          <v-col cols="4" class="py-0">
            <div class="subtitle black--text">City/Town
              <span class="red--text"><strong>*</strong></span>
            </div>

            <v-text-field :placeholder="'Enter city/town'"
            :rules="[v => !!v || 'This field is required.']"
             v-model="supplier_customer_carrier[index].city_town" outlined
              dense></v-text-field>
          </v-col>
        </v-row>
        <v-row class="py-0 mb-5">
          <v-col cols="4" class="py-0">
            <div class="subtitle black--text">Province/State
              <span class="red--text"><strong>*</strong></span>
            </div>
            <v-select outlined dense 
            :rules="[v => !!v || 'This field is required.']"
            v-model="supplier_customer_carrier[index].province_state" :items="countries"
              item-value="Name" item-text="Name" placeholder="Make a selection">
            </v-select>

          </v-col>
          <v-col cols="4" class="py-0">
            <div class="subtitle black--text">Postal/Zip Code
              <span class="red--text"><strong>*</strong></span>
            </div>
            <v-text-field :placeholder="'Enter zip code'"
            :rules="[v => !!v || 'This field is required.']"
             v-model="supplier_customer_carrier[index].postal_zip_code"
              outlined dense></v-text-field>
          </v-col>
          <v-col cols="4" class="py-0">
            <div class="subtitle black--text">Country
              <span class="red--text"><strong>*</strong></span>
            </div>
            <v-select outlined dense 
            :rules="[v => !!v || 'This field is required.']"
            v-model="supplier_customer_carrier[index].country" :items="countries"
              item-value="Name" item-text="Name" placeholder="Make a selection">
            </v-select>
          </v-col>
        </v-row>
        <v-divider></v-divider>
      </div>
      <v-row class="py-0 mt-5">
        <v-col cols="8" class="py-0">
        </v-col>
        <v-col cols="4" class="py-0">
          <div @click="addNewRecord">
            <v-icon left > mdi-plus-circle-outline </v-icon>Add another Owners, Partners, Officers
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
import countries from "@/constants/countries.js"

export default {
  watch: {
    submit: function (newValue) {
      console.log(newValue, "newValuenewValuenewValue")
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
      valid: false,
      isChecked: false,
      countries,
      supplier_customer_carrier: [
        {
          city_town: "",
          province_state: "",
          postal_zip_code: "",
          name: "",
          street: "",
          country: ""
        }
      ]
    };
  },
  methods: {
    addNewRecord() {
      this.supplier_customer_carrier.push({
        city_town: "",
        province_state: "",
        postal_zip_code: "",
        name: "",
        street: "",
        country: ""
      })
    },
    saveFormData() {
      console.log(this.$refs.form.validate(), "asdasd")
      if (!this.$refs.form.validate()) {
        this.$emit("setSubmit", false);
        return;
      }

      this.$emit("saveData", { supplier_customer_carrier: this.supplier_customer_carrier });

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
}
</style>