<template>
  <v-card-text>
    <v-form ref="form"
      v-model="valid"
      lazy-validation
      @submit.prevent="saveFormData">
      <v-row class="py-0 mb-5">
        <v-col cols="12" class="py-0">
          <h3 class="headline-text-color">
            List of All Owners, Partners, Officers
          </h3>
        </v-col>
      </v-row>
      <div v-for="(item, index) in list_of_users" :key="index" class="mt-10">
      <v-row class="py-0 mb-5" >
        <v-col cols="4" class="py-0">
          <div class="subtitle black--text">Name (First, Last Name)
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
          <v-text-field :placeholder="'Enter name'"
           v-model="list_of_users[index].name" 
           :rules="[v => !!v || 'This field is required.']"
           outlined dense></v-text-field>
        </v-col>
        <v-col cols="4" class="py-0">
          <div class="subtitle black--text">Title
            <span  class="red--text"><strong>* </strong></span>
            <v-tooltip top color="00BD73" max-width="350">
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on">
                  mdi-help-circle-outline
                </v-icon>
              </template>
              <span>{{ $t('animal.healthRecordInfo.purposeTooltip') }}</span>
            </v-tooltip>
          </div>
          <v-text-field :placeholder="'Enter title'"  
          v-model="list_of_users[index].title" 
          :rules="[v => !!v || 'This field is required.']"
          outlined dense></v-text-field>
        </v-col>
        <v-col cols="4" class="py-0">
          <div class="subtitle black--text">(Area Code) Telephone No.
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
          <v-text-field :placeholder="'Enter (area code) telephone no.'" 
          :rules="[v => !!v || 'This field is required.']"
          v-model="list_of_users[index].telephone_number" 
          outlined
            dense></v-text-field>
            <!-- <v-text-field :placeholder="'Enter (area code) telephone no.'" v-model="list_of_users[index].telephone_number" outlined
            dense></v-text-field> -->
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
        submit: function (newValue) {
          if(newValue){
            this.saveFormData();
          }
        },
    },
  data() {
    return {
      valid:false,
      isChecked:false,
      list_of_users: [
        {
          name:"",
          title:"",
          telephone_number:""
        }
      ]
    };
  },
  methods:{
    addNewRecord(){
      this.list_of_users.push({
          name:"",
          title:"",
          telephone_number:""
        })
    },
    saveFormData() {
      console.log(this.$refs.form.validate(),"asdasd")
      if (!this.$refs.form.validate()){
        this.$emit("setSubmit", false);
        return;
      } 
      
      this.$emit("saveData", {list_of_users:this.list_of_users});
      
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