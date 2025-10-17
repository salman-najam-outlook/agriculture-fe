<template>
  <v-card-text>
    <v-form ref="form"
      v-model="valid"
      lazy-validation
      @submit.prevent="saveFormData">
      <v-row class="py-0 mb-5">
        <v-col cols="12" class="py-0">
          <h3 class="headline-text-color">
            Raw Leaf Tobacco Registration Certificate(s)
          </h3>
        </v-col>
      </v-row>
      <v-row class="py-0">
        <v-col cols="4" class="py-0">
          <div class="subtitle black--text">Type of Raw Leaf Tobacco Registration Certificate(s) requested:</div>
          <v-checkbox
            v-model="rlt_certificate.certificates"
            label="Producer"
            color="success"
            value="Producer"
            hide-details
          ></v-checkbox>
          <v-checkbox
            v-model="rlt_certificate.certificates"

            label="Processor"
            color="success"
            value="Processor"
            hide-details
          ></v-checkbox>
          <v-checkbox
            v-model="rlt_certificate.certificates"
            label="Dealer"
            color="success"
            value="Dealer"
            hide-details
          ></v-checkbox>
          <v-checkbox
            v-model="rlt_certificate.certificates"
            label="Importer"
            color="success"
            value="Importer"
            hide-details
          ></v-checkbox>
          <v-checkbox
          v-model="rlt_certificate.certificates"
            label="Returns"
            color="success"
            value="Returns"
            hide-details
          ></v-checkbox>
          <v-checkbox
            v-model="rlt_certificate.certificates"
            label="Exporter"
            color="success"
            value="Exporter"
            hide-details
          ></v-checkbox>
        </v-col>
        
      </v-row>

      <v-row class="py-0 mt-10">
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
  watch: {
        submit: function (newValue) {
          console.log(newValue, "newValuenewValuenewValue")
          if(newValue){
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
      valid:false,
      isChecked:false,

      rlt_certificate: {
          certificates:[],
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
      
      this.$emit("saveData", {rlt_certificate:this.rlt_certificate});
      
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