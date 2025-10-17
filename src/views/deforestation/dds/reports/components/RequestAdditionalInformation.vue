<template>
  <v-dialog transition="dialog-top-transition" max-width="600" v-model="dialog">
    <v-card rounded="0">
      <v-toolbar color="primary" class="white--text" flat :elevation="0">
        <v-toolbar-title class="font-weight-bold">
          {{ $t('deforestation.requestAdditionalInformation') }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon class="white--text" @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-form @submit.prevent="sendRequestAdditionalInformation" ref="requestAdditionalInformationForm" lazy-validation
        v-model="sendRequestAdditionalInformationData">
        <v-card-text class="pt-5">
          <div>
            <h3 style="color:black">
            {{ $t('deforestation.requestAdditionalInformationPage.descriptionLabel') }}
            </h3>
            <v-textarea :rules="[v => !!v || 'This field is required.']" class="px-4" :rows="3" v-model="description"
              placeholder="Enter Here"></v-textarea>
          </div>
          <div>
            <p style="color:black">
              {{ $t('deforestation.requestAdditionalInformationPage.shareAccessLabel') }}
            </p>
            <v-radio-group column v-model="shareAccess">
              <v-radio :label="$t('deforestation.requestAdditionalInformationPage.shareCompleteReportLabel')" value="shareCompleteReport"></v-radio>
              <v-radio :label="$t('deforestation.requestAdditionalInformationPage.shareSpecificStepLabel')" value="shareSpecificStep"></v-radio>
            </v-radio-group>
            <v-autocomplete multiple v-if="shareAccess === 'shareSpecificStep'" :items="visibleSelectedTabs" item-text="title" item-value="number"
              v-model="selectedStep" class="selectbox" outlined dense placeholder="Select steps"></v-autocomplete>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn outlined class="mr-2" depressed style="min-width: 150px;" @click="closeModal" color="primary">
            {{ $t("cancel") }}
          </v-btn>
          <v-btn color="primary" style="min-width: 150px;" type="submit">
            {{ $t("send") }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script>
import loading from "@/mixins/LoadingMixin";
import DeforestationService from "@/_services/DeforestationService";

export default {
   watch: {
    dialog: {
      handler() {
        this.resetData();
          this.clearValidation();
      }
    }
  },
  props: {
    dialog: {
      required: false,
      type: Boolean,
    },
    supplierId: {
      required: false,
    },
    visibleSelectedTabs: {
      required: true,
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      sendRequestAdditionalInformationData:false,
      diligenceId: this.$route.params.id || null,
      description: "",
      shareAccess: "shareCompleteReport",
      selectedStep: [],
      steps:[],
      ddrId: this.$route.params.id || null,
    };
  },
  computed: {
    getDiligenceDetails() {
      return this.$store.getters["eudrDDS/getDiligenceDetails"];
    },
    getLatestAdditionalInformation() {
      return this.$store.getters["eudrDDS/ddsAdditionalInformationByDiligenceIdLatest"];
    },
  },
  mounted() {
    if(this.ddrId){
      this.getAdditionalInformationData();
    }
  },
  methods: {
    resetData() {
      this.description = "";
      this.shareAccess = "shareCompleteReport";
      this.selectedStep = [];
    },
    clearValidation() {
      if (this.$refs.requestAdditionalInformationForm) {
        this.$refs.requestAdditionalInformationForm.resetValidation();
      }
    },
    closeModal(success = false) {
      this.$emit("close-modal", success);
      this.resetData();
      this.clearValidation();
    },
    send() {
      this.$emit("send");
    },
    sendRequestAdditionalInformation() {
      if (!this.$refs.requestAdditionalInformationForm.validate()) {
        return false;
      }

      const data = {
        supplierId: parseInt(this.supplierId),
        description: this.description,
        dueDiligenceReportId: parseInt(this.$route.params.id),
        shareAccess: this.shareAccess || "shareCompleteReport",
        selectedStep: JSON.stringify(this.visibleSelectedTabs.filter(tab => this.selectedStep.includes(tab.number))),
        cfUserId: this.getDiligenceDetails.supplier.cf_userid,
      }
      this.startLoading();

      return DeforestationService.requestAdditionalInformation(data).then(res => {
        if (res.errors && res.errors.length > 0) {
          const error = res.errors[0];
          const errorMessage = error.message || this.$t('dueDiligence.anErrorOccured');
          this.$notify({
            text: errorMessage,
            type: "error",
          });
          this.stopLoading();
          return false;
        }

        this.closeModal();
        this.$notify({
          text: "Additional information requested successfully",
          type: "success",
        });
        return true;
      }).catch(err => {
        this.$notify({
          text: err,
          type: "error",
        });
        console.log('Error', err);
        return false;
      }).finally(() => {
        this.stopLoading();
        this.resetData();
      });

    },
    async getAdditionalInformationData() {
      this.startLoading();
      await this.$store.dispatch('eudrDDS/setDDSAdditionalInformationByDiligenceId', {
          ddrId: parseInt(this.diligenceId)
        });
        console.log('this.getLatestAdditionalInformation', this.getLatestAdditionalInformation);
      if (this.getLatestAdditionalInformation) {
        this.description = this.getLatestAdditionalInformation.description;
        this.shareAccess = this.getLatestAdditionalInformation.shareAccess;
        this.selectedStep = JSON.parse(this.getLatestAdditionalInformation.selectedStep);
      }
      this.stopLoading();
    },
  },
  mixins: [loading],
};
</script>
