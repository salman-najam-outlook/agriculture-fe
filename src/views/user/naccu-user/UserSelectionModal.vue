<template>
  <v-dialog
    v-model="dialog"
    width="800"
    :retain-focus="false"
    persistent
    @click:outside="closeDialog"
  >
    <v-card class="custom-card" rounded="0">
      <v-toolbar flat color="primary" class="white--text">
        <v-toolbar-title class="font-weight-bold">{{ $t('memberDataSection.registerNewAffiliate') }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon class="white--text" @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="black--text">
        <v-form ref="selectionForm" v-model="valid" lazy-validation>
          <v-row>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 py-0">
              <label for="createType">
                <h3>{{ $t('memberDataSection.selectHowYouWantToProceed') }}</h3>
              </label>
              <v-radio-group v-model="selectedOption">
                <v-radio
                  dense
                  v-for="n in userTypeArray"
                  :key="n.value"
                  :label="`${n.label} ${$t('memberDataSection.user')}`"
                  :value="n.value"
                ></v-radio>
              </v-radio-group>
            </div>
          </v-row>
          <v-card-actions class="mt-6">
            <v-spacer></v-spacer>
            <v-btn @click="closeDialog" outlined right height="44" width="116" depressed color="primary">
              {{ $t('memberDataSection.cancel') }}
            </v-btn>
            <v-btn @click="proceedWithSelection" right height="44" width="116" color="primary" :disabled="!selectedOption">
              {{ $t('memberDataSection.continue') }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'UserSelectionModal',
  props: {
    dialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedOption: null,
      valid: true,
      userTypeArray: [
        { label: this.$t('memberDataSection.single'), value: 'single' },
        { label: this.$t('memberDataSection.multiple'), value: 'multiple' },
      ]
    };
  },
  watch: {
    dialog(newVal) {
      if (!newVal) {
        this.selectedOption = null;
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close');
    },
    proceedWithSelection() {
      if (this.selectedOption) {
        this.$emit('optionSelected', this.selectedOption);
        this.closeDialog();
      }
    }
  }
};
</script>

<style scoped>
.selection-modal {
  border-radius: 8px;
  overflow: hidden;
}

.selection-content {
  padding: 24px;
  background-color: white;
}

/* Responsive design */
@media (max-width: 600px) {
  .selection-content {
    padding: 16px;
  }
}
</style>
