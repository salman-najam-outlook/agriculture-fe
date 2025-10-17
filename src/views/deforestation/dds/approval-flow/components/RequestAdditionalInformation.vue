<template>
  <v-dialog transition="dialog-top-transition" max-width="800" v-model="dialog" persistent>
    <v-card rounded="0">
      <v-toolbar color="primary" class="white--text" flat :elevation="0">
        <v-toolbar-title class="font-weight-bold">
          {{ $t('deforestation.requestAdditionalInformation') }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon class="white--text" @click="closeModal">
          <v-icon style="color: white !important;">mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-form @submit.prevent="sendRequestAdditionalInformation" ref="requestAdditionalInformationForm" lazy-validation
        v-model="sendRequestAdditionalInformationData">
        <v-card-text class="pt-5">
          <div class="mb-4">
            <h3 class="font-weight-medium mb-2" style="color:black">
              {{ $t('deforestation.requestAdditionalInformationPage.descriptionLabel') }}
            </h3>
            <v-textarea 
              :rules="[v => !!v || $t('This field is required')]" 
              class="py-4" 
              :rows="4" 
              v-model="description"
              :placeholder="$t('Enter specific comments or instructions here')"
              outlined
              dense
              counter="1000"
              maxlength="1000"
            ></v-textarea>
          </div>
        </v-card-text>
        
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn 
            outlined 
            class="mr-2" 
            depressed 
            style="min-width: 150px;" 
            @click="closeModal" 
            color="primary"
          >
            {{ $t("cancel") }}
          </v-btn>
          <v-btn 
            color="primary" 
            style="min-width: 150px;" 
            type="submit"
            :disabled="!description.trim()"
          >
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
      handler(newVal) {
        if (newVal) {
          this.resetData();
          this.clearValidation();
          this.loadExistingData();
        }
      },
      immediate: true
    },
    shareAccess: {
      handler(newVal) {
        if (newVal === 'shareCompleteReport') {
          this.selectedStep = [];
        }
      }
    }
  },
  props: {
    dialog: {
      required: false,
      type: Boolean,
      default: false
    },
    supplierId: {
      required: false,
      type: [String, Number],
      default: null
    },
    visibleSelectedTabs: {
      required: true,
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      sendRequestAdditionalInformationData: false,
      diligenceId: this.$route.params.id || null,
      description: "",
      shareAccess: "shareCompleteReport",
      selectedStep: [],
      steps: [],
      ddrId: this.$route.params.id || null,
      errorMessage: "",
    };
  },
  computed: {
    getDiligenceDetails() {
      return this.$store.getters["eudrDDS/getDiligenceDetails"];
    },
    getLatestAdditionalInformation() {
      return this.$store.getters["eudrDDS/ddsAdditionalInformationByDiligenceIdLatest"];
    },
    isFormValid() {
      if (!this.description.trim()) return false;
      if (this.shareAccess === 'shareSpecificStep' && (!this.selectedStep || this.selectedStep.length === 0)) {
        return false;
      }
      return true;
    }
  },
  mounted() {
    if (this.ddrId) {
      this.getAdditionalInformationData();
    }
  },
  methods: {
    resetData() {
      this.description = "";
      this.shareAccess = "shareCompleteReport";
      this.selectedStep = [];
      this.errorMessage = "";
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
    async loadExistingData() {
      if (this.ddrId) {
        await this.getAdditionalInformationData();
      }
    },
    async sendRequestAdditionalInformation() {
      // Clear previous error
      this.errorMessage = "";

      // Additional validation
      if (!this.description.trim()) {
        this.errorMessage = this.$t('Description is required');
        return false;
      }

      const data = {
        supplierId: parseInt(this.supplierId),
        description: this.description.trim(),
        dueDiligenceReportId: parseInt(this.$route.params.id),
        shareAccess: this.shareAccess || "shareCompleteReport",
        cfUserId: this.getDiligenceDetails?.supplier?.cf_userid,
        isPtsiApproval: true,
      };

      this.startLoading();

      try {
        const res = await DeforestationService.requestAdditionalInformation(data);
        
        if (res.errors && res.errors.length > 0) {
          const error = res.errors[0];
          const errorMessage = error.message || this.$t('dueDiligence.anErrorOccured');
          this.errorMessage = errorMessage;
          return false;
        }

        if (res.data && res.data.requestAdditionalInformation) {
          const result = res.data.requestAdditionalInformation;
          if (result.success) {
            this.$notify({
              text: this.$t('Additional information request sent successfully'),
              type: 'success'
            });
            this.closeModal(true);
            return true;
          } else {
            this.errorMessage = result.message || this.$t('Failed to request additional information');
            return false;
          }
        }
      } catch (err) {
        console.error('Error requesting additional information:', err);
        this.errorMessage = err.message || this.$t('An error occurred while sending the request');
        this.$notify({
          text: this.errorMessage,
          type: "error",
        });
        return false;
      } finally {
        this.stopLoading();
      }
    },
    async getAdditionalInformationData() {
      if (!this.diligenceId) return;
      
      this.startLoading();
      try {
        await this.$store.dispatch('eudrDDS/setDDSAdditionalInformationByDiligenceId', {
          ddrId: parseInt(this.diligenceId)
        });
        
        if (this.getLatestAdditionalInformation) {
          this.description = this.getLatestAdditionalInformation.description || "";
          this.shareAccess = this.getLatestAdditionalInformation.shareAccess || "shareCompleteReport";
          
          if (this.getLatestAdditionalInformation.selectedStep) {
            try {
              const parsedSteps = JSON.parse(this.getLatestAdditionalInformation.selectedStep);
              this.selectedStep = Array.isArray(parsedSteps) ? parsedSteps : [];
            } catch (e) {
              console.warn('Error parsing selected steps:', e);
              this.selectedStep = [];
            }
          }
        }
      } catch (error) {
        console.error('Error loading additional information data:', error);
        this.errorMessage = this.$t('Failed to load existing data');
      } finally {
        this.stopLoading();
      }
    },
  },
  mixins: [loading],
};
</script>

<style lang="scss" scoped>
.v-dialog {
  .v-card {
    border-radius: 8px;
  }
  
  .v-toolbar {
    border-radius: 8px 8px 0 0;
  }
}

.v-textarea {
  .v-input__control {
    min-height: 120px;
  }
}

.v-autocomplete {
  .v-select__selections {
    min-height: 40px;
  }
}

.v-radio-group {
  .v-radio {
    margin-bottom: 8px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}

.v-alert {
  border-radius: 4px;
}

.v-btn {
  text-transform: none;
  font-weight: 500;
  
  &.v-btn--disabled {
    opacity: 0.6;
  }
}

.selectbox {
  .v-select__selections {
    .v-chip {
      margin: 2px;
    }
  }
}

// Responsive design
@media (max-width: 600px) {
  .v-dialog {
    margin: 16px;
  }
  
  .v-card-actions {
    flex-direction: column;
    
    .v-btn {
      margin: 4px 0;
      width: 100%;
    }
  }
}
</style>
