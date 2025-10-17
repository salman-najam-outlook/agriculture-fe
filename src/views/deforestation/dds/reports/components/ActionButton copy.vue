<template>
  <div>
    <v-btn
      v-if="diligenceId"
      color="#F03737"
      dark
      medium
      class="mr-3"
      @click="discard"
    >
      {{ $t('deforestation.discard')}}
    </v-btn>
    <v-btn
      v-if="diligenceId"
      color="#FFB443"
      dark
      medium
      class="mr-3"
      @click="reject"
    >
      {{ $t('deforestation.reject')}}
    </v-btn>
    <v-btn color="primary" dark medium class="mr-3" v-if="diligenceId" @click="requestAdditionalInformation">
      {{ $t('deforestation.requestAdditionalInformation')}}
    </v-btn>
    <v-btn
      color="primary"
      dark
      medium
      class="mr-3"
      @click="saveAndContinueLater"
    >
      {{ $t('deforestation.saveAndContinueLater')}}
    </v-btn>
    <v-btn color="primary" dark medium class="mr-3" @click="next">
      {{ $t('deforestation.next') }}
    </v-btn>

    <SaveAndContinueDialog @confirm-save="confirmSaveAndContinueLater" @close-modal="closeSaveAndContinueDialog" :dialog="saveAndContinueDialog" />
    <RequestAdditionalInformation @close-modal="closeRequestAdditionalInformationDialog" :dialog="requestAdditionalInformationDialog" />

    <DiscardDialog @close-modal="closeDiscardDialog" :dialog="discardDialog" />
    <RejectDialog @close-modal="closeRejectDialog" :dialog="rejectDialog" />

    
  </div>
</template>

<script>
import DiscardDialog from "./DiscardDialog.vue";
import RejectDialog from "./RejectDialog.vue";
import SaveAndContinueDialog from "./SaveAndContinueDialog.vue";

export default {
  components: {
    DiscardDialog,
    RejectDialog,
    SaveAndContinueDialog,
  },
  props: {
  },
  data() {
    return {
      diligenceId: this.$route.params.id || null,
      discardDialog: false,
      requestAdditionalInformationDialog:false,
      rejectDialog: false,
      saveAndContinueDialog:false,
      //selectedAssessments: [] // This will store objects
    };
  },
  methods: {
    
    
    discard() {
      this.discardDialog = true;
    },
    closeDiscardDialog() {
      this.discardDialog = false;
    },

    reject() {
      this.rejectDialog = true;
    },
    closeRejectDialog() {
      this.rejectDialog = false;
    },

    requestAdditionalInformation() {
      this.requestAdditionalInformationDialog = true;
    },
    closeRequestAdditionalInformationDialog() {
      this.requestAdditionalInformationDialog = true;
    },

    

    


   
    closeSaveAndContinueDialog(){
        this.saveAndContinueDialog = false
    },
    saveAndContinueLater() {
      this.saveAndContinueDialog = true;
    },
    confirmSaveAndContinueLater() {
      this.saveAndContinueDialog = false;
      this.$emit("saveAndContinueLater");
    },

    next() {
      this.$emit("nextStep");
    },
  },
};
</script>

<style scoped></style>
