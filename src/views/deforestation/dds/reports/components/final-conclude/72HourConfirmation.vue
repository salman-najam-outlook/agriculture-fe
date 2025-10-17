<template>
    <v-dialog v-model="dialog" persistent max-width="800">
      <v-card>
        <v-toolbar color="primary" elevation="0">
          <v-toolbar-title class="white--text">  {{ $t('dueDiligence.confirmation') }} </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="white" icon @click="closeModal()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pt-5 black--text">
            Are you sure you want to finalize this report? You can still make edits afterward. 
            Once finalized, you can submit the report to EUDR and optionally publish it on the blockchain immediately, 
            or wait for the EUDR reference ID and update instructions if necessary.

            <v-radio-group v-model="confirmStatus">
                <v-radio :label="'Publish the Report to Blockchain after 72 hours (Recommended)'" :value="concludeConditions.seventyTwoHour"
                ></v-radio>
                <p class="p-mar-30"> 
                    EUDR provides a 72-hour window to edit a submitted Due Diligence Statement after it has been submitted to EUDR. Any amendments or cancellations must be made within this 72-hour period before the report is published on the blockchain. After this window, the blockchain hash will be generated.
                    Publish on Blockchain Now
                </p> 

                <v-radio :label="'Publish on Blockchain Now'" :value="concludeConditions.now"
                ></v-radio>
                <p class="p-mar-30"> The Due Diligence Statement will be published immediately on the blockchain. Should any modifications be requested after submission, an additional fee of $50 will be required to publish a new hash on the blockchain following the modifications.
                    Cancel 
                </p> 
            </v-radio-group>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              outlined
              @click="closeModal"
            >
             {{ $t("Cancel") }}
            </v-btn>
            <v-btn depressed color="primary" @click="finilize">
              {{$t('Confirm & Finalize')}}
            </v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
  </template>

  <style scoped>
     .p-mar-30{
        margin-left:30px;
     }
  </style>
  
  <script>
  import { EventBus } from '@/utils.js'
  export default {
    props: {
      dialog: {
        type: Boolean,
        required: true,
      }
    },
    data() {
      return {
          concludeConditions:{
            seventyTwoHour:'72_hour',
            now:'now'
          },
          confirmStatus:'now',
      };
    },
    methods: {
      closeModal(){
         this.$emit('close-modal',false)
      },
      finilize(){
        this.$emit('close-modal')
        EventBus.$emit('diligence-detail-load',true)
        this.$emit('finilize',this.confirmStatus)
      }
    },
  };
  </script>
  