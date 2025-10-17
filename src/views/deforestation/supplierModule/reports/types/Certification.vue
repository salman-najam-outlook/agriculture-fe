<template>
  <v-card-text>
    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="saveFormData">
      <v-row class="py-0 mb-5">
        <v-col cols="12" class="py-0">
          <h3 class="headline-text-color">Certification</h3>
        </v-col>
      </v-row>
      <v-row class="py-0" v-for="(item, index) in certification.business_controllers" :key="index">
        <v-col cols="4" class="py-0">
          <div class="subtitle black--text">The Person or Group of Persons Who Control the Business
            <span class="red--text"><strong>*</strong></span>
          </div>
          <v-text-field :placeholder="'Enter name'" :rules="[v => !!v || 'This field is required.']"
            v-model="certification.business_controllers[index]" outlined dense></v-text-field>
        </v-col>
        <v-col cols="8" class="py-0"> </v-col>
      </v-row>
      <v-row class="py-0 mb-10">
        <v-col cols="4" class="py-0">
          <div @click="addNewRecord">
            <v-icon left> mdi-plus-circle-outline </v-icon>Add another Owners, Partners, Officers
          </div>
        </v-col>
        <v-col cols="8" class="py-0"></v-col>
      </v-row>

      <v-row class="py-0">
        <v-col cols="4" class="py-0">
          <div class="subtitle black--text">Name First and Last Name
            <span class="red--text"><strong>*</strong></span>
          </div>
          <v-text-field :placeholder="'| Enter name'" v-model="certification.name"
            :rules="[v => !!v || 'This field is required.']" outlined dense></v-text-field>
        </v-col>
        <v-col cols="4" class="py-0">
          <div class="subtitle black--text">Title
            <span class="red--text"><strong>*</strong></span>
          </div>
          <v-text-field :placeholder="'| Enter title'" v-model="certification.title"
            :rules="[v => !!v || 'This field is required.']" outlined dense></v-text-field>
        </v-col>
        <v-col cols="4" class="py-0">
          <div class="subtitle black--text">Date
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

          <v-text-field readonly :placeholder="'10 Jun 2023'" v-model="certification.date"
            :rules="[v => !!v || 'This field is required.']" outlined dense></v-text-field>
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
import moment from "moment";

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
      valid: false,
      isChecked: false,

      certification: {
        name: "",
        title: "",
        business_controllers: [""],
        date: this.getToday()
      }
    };
  },
  methods: {

    getToday(){
      const today = moment();
      const formattedDate = today.format("DD MMM YYYY");
      return formattedDate;
    },
    addNewRecord() {
      this.certification.business_controllers.push("")
    },
    saveFormData() {
      console.log(this.$refs.form.validate(), "asdasd")
      if (!this.$refs.form.validate()) {
        this.$emit("setSubmit", false);
        return;
      }

      this.$emit("saveData", { certification: this.certification });

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