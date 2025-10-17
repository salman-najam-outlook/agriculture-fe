<template>
  <v-card-text>
    <v-form ref="form"
      v-model="valid"
      lazy-validation
      @submit.prevent="saveFormData">
      <v-row class="py-0 mb-5">
        <v-col cols="12" class="py-0">
          <h3 class="headline-text-color">
            Contact Person
          </h3>
        </v-col>
      </v-row>
      <div v-for="(item, index) in contact_person" :key="index" class="mt-10">
      <v-row class="py-0">
        <v-col cols="4" class="py-0">
          <div class="subtitle black--text">Name (First, Last Name)
            <span class="red--text"><strong>* </strong></span>
          </div>
          <v-text-field :placeholder="'Enter name'"
          :rules="[v => !!v || 'This field is required.']"
              v-model="contact_person[index].name"
            outlined dense></v-text-field>
        </v-col>
        <v-col cols="4" class="py-0">
          <div class="subtitle black--text">Title
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
          <v-text-field :placeholder="'Enter title'" 
          :rules="[v => !!v || 'This field is required.']"
          v-model="contact_person[index].title"          
          outlined dense></v-text-field>
        </v-col>
        <v-col cols="4" class="py-0">
          <div class="subtitle black--text">(Area Code) Telephone No.
            <span class="red--text"><strong>*</strong></span>
          </div>
          <v-text-field :placeholder="'Enter (area code) telepbone no.'" 
          :rules="[v => !!v || 'This field is required.']"
          v-model="contact_person[index].telephone_number"   
          outlined
            dense></v-text-field>
        </v-col>
      </v-row>
      <v-row class="py-0">
        <v-col cols="4" class="py-0">
          <div class="subtitle black--text">Fax No
            <span class="red--text"><strong>*</strong></span>
          </div>
          <v-text-field :placeholder="'Enter fax no.'"
          :rules="[v => !!v || 'This field is required.']"
          v-model="contact_person[index].fax"   
           outlined dense></v-text-field>
        </v-col>
        <v-col cols="4" class="py-0">
          <div class="subtitle black--text">Email Address
            <span class="red--text"><strong>*</strong></span>
          </div>
          <v-text-field :placeholder="'Enter email address'"
          :rules="[v => !!v || 'This field is required.']"
          v-model="contact_person[index].email"   
            outlined dense></v-text-field>
        </v-col>
        <v-col cols="4" class="py-0">
          <div class="subtitle black--text">Unit/Apt/Suit
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
          <v-text-field :placeholder="'Enter unit/size'" 
          :rules="[v => !!v || 'This field is required.']"
          v-model="contact_person[index].unit_apt_suite"   
           outlined
            dense></v-text-field>
        </v-col>
      </v-row>
      <v-row class="py-0">
        <v-col cols="4" class="py-0">
          <div class="subtitle black--text">Street Number and Name/PO Box/Postal Stn/Rural Route
          <span class="red--text"><strong>* </strong></span>
          </div>
          <v-text-field :placeholder="'| Street number and name/po box'" 
          :rules="[v => !!v || 'This field is required.']"
          v-model="contact_person[index].street_number_name_poBox_postalStn_ruralROute"       
          outlined dense></v-text-field>
        </v-col>
        <v-col cols="4" class="py-0">
          <div class="subtitle black--text">City Town
            <span class="red--text"><strong>* </strong></span>
          </div>
          <v-text-field :placeholder="'| Enter city/town'" 
          :rules="[v => !!v || 'This field is required.']"
          v-model="contact_person[index].city_town"       
          outlined dense></v-text-field>
        </v-col>
        <v-col cols="4" class="py-0">
          <div class="subtitle black--text">Province/State
            <span class="red--text"><strong>*</strong></span>
          </div>
          <v-select outlined dense 
            :rules="[v => !!v || 'This field is required.']"
            v-model="contact_person[index].province_state" :items="provience"
              item-value="value" item-text="name" placeholder="Make a selection">
            </v-select>
  
        </v-col>
      </v-row>
      <v-row class="py-0">
        <v-col cols="4" class="py-0">
          <div class="subtitle black--text">Postal/Zip Code
            <span class="red--text"><strong>* </strong></span>
          </div>
          <v-text-field :placeholder="'| Enter zip code'"
          :rules="[v => !!v || 'This field is required.']"
          v-model="contact_person[index].postal_zip_code"   
          outlined dense></v-text-field>
        </v-col>
      </v-row>
       
      <v-row class="py-0 mb-5">
        <v-col cols="4" class="py-0">
          <div class="subtitle black--text">Document(s) This Contact Person Should Receive.</div>
          <v-checkbox
          v-model="contact_person[index].documents_person_recieve"   
            label="All"
            color="success"
            value="All"
            hide-details
          ></v-checkbox>
          <v-checkbox
          v-model="contact_person[index].documents_person_recieve" 
          label="Applications"
            color="success"
            value="Applications"
            
            hide-details
          ></v-checkbox>
          <v-checkbox
          v-model="contact_person[index].documents_person_recieve"
          label="Assessments"
            color="success"
            value="Assessments"
            hide-details
          ></v-checkbox>
          <v-checkbox
          v-model="contact_person[index].documents_person_recieve"
          label="Renewals"
            color="success"
            value="Renewals"
            hide-details
          ></v-checkbox>
          <v-checkbox
          v-model="contact_person[index].documents_person_recieve"
            label="Returns"
            color="success"
            value="Returns"
            hide-details
          ></v-checkbox>
        </v-col>
        
      </v-row>
      <v-divider></v-divider>
    </div>

    <v-row class="py-0 mt-10">
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
      required: false,
    }, 
    submit: {
      required: true,
    },

  },
  data() {
    return {
      valid:false,
      isChecked:false,
      provience:[
        {name:"NSW", value:"NSW"},
        {name:"SYDNEY", value:"SYDNEY"}
      ],
      contact_person: [
        {
          unit_apt_suite:"",
          title:"",
          city_town:"",
          province_state:"",
          postal_zip_code:"",
          name:"",
          area_code:"",
          telephone_number:"",
          fax:"",
          email:"",
          street_number_name_poBox_postalStn_ruralROute:"",
          documents_person_recieve:[]
        }
      ]
    };
  },
  methods:{
    addNewRecord(){
      this.contact_person.push({
        unit_apt_suite:"",
          title:"",
          city_town:"",
          province_state:"",
          postal_zip_code:"",
          name:"",
          area_code:"",
          telephone_number:"",
          fax:"",
          email:"",
          street_number_name_poBox_postalStn_ruralROute:"",
          documents_person_recieve:[]
        })
    },
    saveFormData() {
      console.log(this.$refs.form.validate(),"asdasd")
      if (!this.$refs.form.validate()){
        this.$emit("setSubmit", false);
        return;
      } 
      
      this.$emit("saveData", {contact_person:this.contact_person});
      
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