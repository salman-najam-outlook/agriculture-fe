<template>
  <v-dialog v-model="dialog" persistent :max-width="$vuetify.breakpoint.mobile ? '95vw' : '800'">
    <v-card>
      <v-toolbar color="error" elevation="0">
        <v-toolbar-title class="white--text">{{ $t('dueDiligence.rejectionWarningTitle') }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="white" icon @click="closeModal">
          <v-icon style="color:white !important">mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      
      <v-card-text class="pt-5 black--text">
        <div class="mb-4">
          <h4 class="mb-0">{{ $t('dueDiligence.rejectShipmentsConfirmation') }}</h4>
          <h4 class="mb-3">{{ $t('dueDiligence.rejectionNote') }}: {{ $t('dueDiligence.shipmentDataSaved') }}</h4>
          
          <v-divider class="my-4"></v-divider>
          
          <div class="mb-4">
            <label class="font-weight-medium black--text mb-2 d-block">{{ $t('dueDiligence.rejectionReasonLabel') }}</label>
            <v-textarea
              v-model="rejectionReason"
              :placeholder="$t('dueDiligence.rejectionReasonPlaceholder')"
              outlined
              rows="4"
              :rules="[rules.required]"
              class="mt-2"
            ></v-textarea>
          </div>
        </div>
      </v-card-text>
      
      <v-card-actions class="px-6 pb-4">
        <v-spacer></v-spacer>
        <v-btn outlined color="primary" @click="closeModal">
          {{ $t('cancel') }}
        </v-btn>
        <v-btn 
          depressed 
          color="error" 
          @click="confirmRejection"
          :disabled="!rejectionReason.trim()"
        >
          {{ $t('dueDiligence.rejectionConfirmButton') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'RejectionConfirmationModal',
  props: {
    dialog: {
      type: Boolean,
      required: true
    },
    selectedReportsCount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      rejectionReason: '',
      rules: {
        required: value => !!value?.trim() || this.$t('dueDiligence.rejectionReasonRequired')
      }
    }
  },
  methods: {
    closeModal() {
      this.resetForm();
      this.$emit('close');
    },
    confirmRejection() {
      if (!this.rejectionReason.trim()) {
        return;
      }
      
      const rejectionData = {
        reason: this.rejectionReason.trim()
      };
      
      this.$emit('confirm', rejectionData);
      this.closeModal();
    },
    resetForm() {
      this.rejectionReason = '';
    }
  },
  watch: {
    dialog(newVal) {
      if (!newVal) {
        this.resetForm();
      }
    }
  }
}
</script>

<style scoped>
.v-textarea {
  margin-top: 0;
}
</style>