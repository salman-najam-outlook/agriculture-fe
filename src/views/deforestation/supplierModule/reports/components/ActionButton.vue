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
    <v-btn color="primary" dark medium class="mr-3">
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

    <DiscardDialog @close-modal="closeDiscardDialog" :dialog="discardDialog" />
    <RejectDialog @close-modal="closeRejectDialog" :dialog="rejectDialog" />
  </div>
</template>

<script>
import DiscardDialog from "./DiscardDialog.vue";
import RejectDialog from "./RejectDialog.vue";

export default {
  components: {
    DiscardDialog,
    RejectDialog,
  },
  props: {},
  data() {
    return {
      diligenceId: this.$route.params.id || null,
      discardDialog: false,
      rejectDialog: false,
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

    saveAndContinueLater() {
      this.$emit("saveAndContinueLater");
    },

    next() {
      this.$emit("nextStep");
    },
  },
};
</script>

<style scoped></style>
