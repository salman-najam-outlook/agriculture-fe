<template>
  <v-card-text>
    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="saveFormData">
      <v-row class="py-0 mb-5">
        <v-col cols="12" class="py-0">
          <h3 class="headline-text-color" v-if="type == 'importer_certificate'">Importer Registration Certificate
          </h3>
          <h3 class="headline-text-color" v-if="type == 'exporter_certificate'">Exporter Registration Certificate
          </h3>
        </v-col>
      </v-row>
      <v-row class="py-0">
        <v-col cols="12" class="py-0">
          <div class="subtitle black--text">
            <h3>Type
              <span class="red--text"><strong>*</strong></span>
            </h3>
          </div>
          <v-checkbox v-model="importer_exporter_certificate.type" label="Flue-Curved" color="success" value="Flue-Cured"
            hide-details></v-checkbox>
          <v-row class="py-0 mt-5">
            <v-col cols="4" class="py-0">
              <div class="subtitle black--text">
                <h4>Estimated Volume to be Produced in the Next 12 Months
                <span class="red--text"><strong>*</strong></span>
                <v-tooltip top color="00BD73" max-width="350">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on">
                      mdi-help-circle-outline
                    </v-icon>
                  </template>
                  <span>{{ $t('animal.healthRecordInfo.purposeTooltip') }}</span>
                </v-tooltip>
              </h4>
              </div>
              <v-text-field :placeholder="'| Type quantity'"
                v-model="importer_exporter_certificate.flue_cured_estimated_volume_next_12_months"
                :rules="formRules.flueCurved"
                outlined dense></v-text-field>
            </v-col>
            <v-col cols="4" class="py-0">
              <div class="subtitle black--text">
                <h4>Total Volume Produced in the past 12 Months
                <span class="red--text"><strong>* </strong></span>
                <v-tooltip top color="00BD73" max-width="350">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on">
                      mdi-help-circle-outline
                    </v-icon>
                  </template>
                  <span>{{ $t('animal.healthRecordInfo.purposeTooltip') }}</span>
                </v-tooltip>
              </h4>
               
              </div>
              <v-text-field :placeholder="'| Type quantity'"
                v-model="importer_exporter_certificate.flue_cured_volume_produced_past_12_months"
                :rules="formRules.flueCurved"
                outlined dense></v-text-field>
            </v-col>

          </v-row>

          <v-checkbox v-model="importer_exporter_certificate.type" label="Non Flue-Curved" color="success"
            value="Non Flue-Curved" hide-details></v-checkbox>
          <div class="ml-10">
            <v-checkbox v-model="importer_exporter_certificate.non_flue_cured" label="Black" color="success" value="Black"
              hide-details></v-checkbox>
            <v-checkbox v-model="importer_exporter_certificate.non_flue_cured" label="Burley" color="success"
              value="Burley" hide-details></v-checkbox>
            <v-checkbox v-model="importer_exporter_certificate.non_flue_cured" label="Other" color="success" value="Other"
              hide-details></v-checkbox>
          </div>

        </v-col>
      </v-row>
      <v-row class="py-0 mt-10">
        <v-col cols="4" class="py-0">
          <div class="subtitle black--text">
          <h4>Estimated Volume to be Produced in the Next 12 Months
            <span class="red--text"><strong>*</strong></span>
            <v-tooltip top color="00BD73" max-width="350">
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on">
                  mdi-help-circle-outline
                </v-icon>
              </template>
              <span>{{ $t('animal.healthRecordInfo.purposeTooltip') }}</span>
            </v-tooltip>
          </h4>
          </div>
          <v-text-field :placeholder="'| Type quantity'"
            v-model="importer_exporter_certificate.non_flue_cured_estimated_volume_next_12_months"
            :rules="formRules.nonFlueCurved"
            outlined dense></v-text-field>
        </v-col>
        <v-col cols="4" class="py-0">
          <div class="subtitle black--text">
          <h4>Total Volume Produced in the past 12 Months
            <span class="red--text"><strong>*</strong></span>
            <v-tooltip top color="00BD73" max-width="350">
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on">
                  mdi-help-circle-outline
                </v-icon>
              </template>
              <span>{{ $t('animal.healthRecordInfo.purposeTooltip') }}</span>
            </v-tooltip>
          </h4>
          </div>
          <v-text-field :placeholder="'| Type quantity'"
            v-model="importer_exporter_certificate.non_flue_cured_volume_produced_past_12_months"
            :rules="formRules.nonFlueCurved"
            outlined dense></v-text-field>
        </v-col>

        <v-col cols="4" class="py-0">
          <div class="subtitle black--text">
          <h4>Expected Jurisdiction Exported from (Province/State/Country)</h4>
          </div>
          <v-select outlined dense
            v-model="importer_exporter_certificate.exported_from" :items="provience" item-value="value" item-text="name"
            placeholder="Make a selection">
          </v-select>
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
      required: true,
    },
    submit: {
      required: true,
    },
  },
  data() {
    return {
      formRules: {
                flueCurved: [
                    v => {
                      if(this.importer_exporter_certificate.type.includes("Flue-Cured")){
                        return !!v || 'This field is required.';
                      }
                      return true;        
                    },
                ],
                nonFlueCurved: [
                    v => {
                      if(this.importer_exporter_certificate.type.includes("Non Flue-Curved")){
                        return !!v || 'This field is required.';
                      }
                      return true;        
                    },
                ],
            },
      valid: false,
      isChecked: false,
      provience: [
        { name: "NSW", value: "NSW" },
        { name: "SYDNEY", value: "SYDNEY" }
      ],
      importer_exporter_certificate: {
        purpose_of_plan_to_produce: [],
        sell_on_ontario_only: "",
        type: [],
        flue_cured_estimated_volume_next_12_months: "",
        flue_cured_volume_produced_past_12_months: "",
        non_flue_cured: [],
        non_flue_cured_estimated_volume_next_12_months: "",
        non_flue_cured_volume_produced_past_12_months: "",
        exported_from: ""

      }
    };
  },
  methods: {

    saveFormData() {
      console.log(this.$refs.form.validate(), "asdasd")
      if (!this.$refs.form.validate()) {
        this.$emit("setSubmit", false);
        return;
      }

      this.$emit("saveData", { importer_exporter_certificate: this.importer_exporter_certificate });

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