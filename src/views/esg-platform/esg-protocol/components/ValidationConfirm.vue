<template>
  <v-dialog v-model="dialog" width="700">
    <v-card>
      <v-card-title class="primary white--text">
        {{ $t('esgPlatform.validationConfirm') }}
        <v-spacer></v-spacer>
        <v-btn icon @click="cancel">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <p class="py-2">
          {{ $t('esgPlatform.validationConfirmMsg') }}
        </p>
        <label class="font-weight-bold">{{ $t('esgPlatform.validationRejectionReason') }}</label>
        <v-textarea
          v-model="rejectionReason"
          :label="$t('esgPlatform.validationRejectionReasonPlaceholder')"
          outlined
          rows="3"
          class="mt-2"
        ></v-textarea>
      </v-card-text>
      <v-card-actions class="justify-end pb-4">
        <v-btn text @click="cancel">{{ $t('cancel') }}</v-btn>
        <v-btn color="success" @click="confirm">{{ $t('confirm') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      rejectionReason: '',
    };
  },
  watch: {
    dialog(newVal) {
      if (!newVal) {
        this.rejectionReason = ''; // Reset reason when dialog closes
      }
    },
  },
  methods: {
    cancel() {
      this.$emit('cancel');
    },
    confirm() {
      this.$emit('confirm', this.rejectionReason);
    },
  },
};
</script>