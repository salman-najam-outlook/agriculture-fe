<template>
  <v-dialog
    transition="dialog-top-transition"
    max-width="600"
    v-model="dialog"
    @click:outside="closeModal"
  >
    <v-card rounded="0">
      <v-toolbar color="primary" class="white--text" flat :elevation="0">
        <v-toolbar-title class="font-weight-bold">
          {{  $t('dueDiligence.confirmationPopup') }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon class="white--text" @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="pt-5">
        <div>
          <h3 style="color:black">
            {{  $t('dueDiligence.confirmationPopupMsg') }}
          </h3>
        </div>
      </v-card-text>
      <v-divider class="mt-5"></v-divider>
      <v-card-actions>
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
          @click="confirmDiscard"
        >
          {{ $t("confirm") }}
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- </template> -->
  </v-dialog>
</template>
<script>
import loading from "@/mixins/LoadingMixin";
import DeforestationService from "@/_services/DeforestationService";

export default {
  async mounted() {},
  props: {
    dialog: {
      required: false,
      type: Boolean,
    },
  },
  data() {
    return {
      diligenceId: this.$route.params.id || null,
    };
  },
  methods: {
    closeModal(suc = false) {
      this.$emit("close-modal", suc);
    },
    confirmDiscard() {
      this.startLoading();
      if (!this.diligenceId) {
        return;
      }

      DeforestationService.deleteDiligenceReport(parseInt(this.diligenceId))
        .then((res) => {
          if (res.errors && res.errors.length > 0) {
            const error = res.errors[0];
            const errorMessage = error.message || this.$t("dueDiligence.anErrorOccurred");

            this.$notify({
              text: errorMessage,
              type: "error",
            });
          } else {
            this.$emit("close-modal");
            this.$notify({
              text: "Report deleted successfully",
              type: "success",
            });
          }
        })
        .catch((err) => {
          let errorMessage = this.$t('deforestation.anErrorOccurredWhileDeletingTheReport');
          if (err.response && err.response.data) {
            errorMessage = err.response.data.message || errorMessage;
          }

          this.$notify({
            text: errorMessage,
            type: "error",
          });
        })
        .finally(() => {
          this.stopLoading();
        });
    },
  },
  mixins: [loading],
};
</script>
