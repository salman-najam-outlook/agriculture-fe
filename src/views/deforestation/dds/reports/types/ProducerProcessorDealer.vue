<template>
  <v-card-text>
    <v-form ref="form"
      v-model="valid"
      lazy-validation
      @submit.prevent="saveFormData">
      <v-row class="py-0">
        <v-col cols="12" class="py-0">
          <h3 class="headline-text-color" v-if="type == 'producer'">Producer</h3>
          <h3 class="headline-text-color" v-if="type == 'processor'">Processor</h3>
          <h3 class="headline-text-color" v-if="type == 'dealer'">Dealer</h3>
        </v-col>
      </v-row>
     
      <v-row class="py-0" v-if="type == 'producer'">
        <v-col cols="12" class="py-0">
          <v-checkbox
            v-model="processor_dealer_producer.purpose_of_plan_to_produce"
            color="success"
            value="To Sell"
            hide-details
          >  
          <template slot="label">
            <h4 style="color: rgb(0, 0, 0)">
              To Sell
            </h4>
          </template>
        </v-checkbox>

        <div class="ml-10 mt-5">
          <div class="subtitle black--text" >Will you sell only the raw leaf tobacco you produce and will you sell the raw leaf tobacco in Ontario only?
            <span class="red--text"><strong>*</strong></span>
          </div>
          <v-radio-group
            :rules="formRules.sellOntarioOnly"
            v-model="processor_dealer_producer.sell_on_ontario_only">
              <v-radio label="Yes" value="true"></v-radio>
              <v-radio label="No" value="false"></v-radio>
          </v-radio-group>  
        </div>
          <v-checkbox
          v-model="processor_dealer_producer.purpose_of_plan_to_produce"
            label="Own Use(For Manufacture Of Tobacco Products)"
            color="success"
            value="Own Use"
            hide-details
          ></v-checkbox>
          <v-checkbox
          v-model="processor_dealer_producer.purpose_of_plan_to_produce"
            label="Agronomic Research"
            color="success"
            value="Agronomic Research"
            hide-details
          ></v-checkbox>
        </v-col>
      </v-row>

      <v-row class="py-0 mt-5"  v-if="type == 'producer'">
        <v-col cols="4" class="py-0">
          <div class="subtitle black--text">
            <h4>Purpose of Research
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
          <v-text-field :placeholder="'| Enter reason'" 
          v-model="processor_dealer_producer.purpose_of_research"
          :rules="formRules.agronomicResearch"
          outlined dense></v-text-field>
        </v-col>

        <v-col cols="4" class="py-0">
          <div class="subtitle black--text">
          <h4>
          Person(s)/Company research is being performed for
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
          <v-text-field :placeholder="'| Enter person(s)/company'"
          v-model="processor_dealer_producer.research_performed_for"
          :rules="formRules.agronomicResearch"
           outlined dense></v-text-field>
        </v-col>
      
      </v-row>

      
      <v-row class="py-0">
        <v-col cols="12" class="py-0">
          <div class="subtitle black--text">
            <h3>Type
              <span class="red--text"><strong>*</strong></span>
            </h3>
          </div>
          <v-checkbox v-model="processor_dealer_producer.type" label="Flue-Curved" color="success" value="Flue-Cured"
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
                v-model="processor_dealer_producer.flue_cured_estimated_volume_next_12_months"
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
                v-model="processor_dealer_producer.flue_cured_volume_produced_past_12_months"
                :rules="formRules.flueCurved"
                 outlined dense></v-text-field>
            </v-col>

          </v-row>

          <v-checkbox v-model="processor_dealer_producer.type" label="Non Flue-Curved" color="success"
            value="Non Flue-Curved" hide-details></v-checkbox>
          <div class="ml-10">
            <v-checkbox v-model="processor_dealer_producer.non_flue_cured" label="Black" color="success" value="Black"
              hide-details></v-checkbox>
            <v-checkbox v-model="processor_dealer_producer.non_flue_cured" label="Burley" color="success"
              value="Burley" hide-details></v-checkbox>
            <v-checkbox v-model="processor_dealer_producer.non_flue_cured" label="Other" color="success" value="Other"
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
            v-model="processor_dealer_producer.non_flue_cured_estimated_volume_next_12_months"
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
            v-model="processor_dealer_producer.non_flue_cured_volume_produced_past_12_months"
            :rules="formRules.nonFlueCurved"
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
      formRules: {
                sellOntarioOnly: [
                    v => {
                      if(this.processor_dealer_producer.purpose_of_plan_to_produce.includes("To Sell")){
                        return !!v || 'This field is required.';
                      }
                      return true;        
                    },
                ],
                agronomicResearch: [
                    v => {
                      if(this.processor_dealer_producer.purpose_of_plan_to_produce.includes("Agronomic Research")){
                        return !!v || 'This field is required.';
                      }
                      return true;        
                    },
                ],
                flueCurved: [
                    v => {
                      if(this.processor_dealer_producer.type.includes("Flue-Cured")){
                        return !!v || 'This field is required.';
                      }
                      return true;        
                    },
                ],
                nonFlueCurved: [
                    v => {
                      if(this.processor_dealer_producer.type.includes("Non Flue-Curved")){
                        return !!v || 'This field is required.';
                      }
                      return true;        
                    },
                ],
            },

      valid:false,
      isChecked:false,

      processor_dealer_producer: {
        purpose_of_plan_to_produce:[],
        sell_on_ontario_only:"",
        purpose_of_research:"",
        research_performed_for:"",
        type:[],
        flue_cured_estimated_volume_next_12_months:"",
        flue_cured_volume_produced_past_12_months:"",
        non_flue_cured:[],
        non_flue_cured_estimated_volume_next_12_months:"",
        non_flue_cured_volume_produced_past_12_months:""

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
      
      if(this.type == 'processor' || this.type == 'dealer'){
        delete this.processor_dealer_producer.purpose_of_plan_to_produce
        delete this.processor_dealer_producer.sell_on_ontario_only
       
        delete this.processor_dealer_producer.purpose_of_research
        delete this.processor_dealer_producer.research_performed_for

        this.$emit("saveData", {processor_dealer:this.processor_dealer_producer});
      }else if(this.type == 'producer'){
        this.$emit("saveData", {producer:this.processor_dealer_producer});
      }
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