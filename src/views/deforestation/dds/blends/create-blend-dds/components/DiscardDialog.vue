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
          {{  $t('dueDiligence.confirmation') }}
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
import BlendService from "@/_services/BlendService";

export default {
  async mounted() {
    this.setDiligenceId();
  },
  watch: {
    '$route.params.id': 'setDiligenceId'
  },
  props: {
    dialog: {
      required: false,
      type: Boolean,
    },
  },
  data() {
    return {
      blendId: null,
    };
  },
  methods: {
    setDiligenceId() {
      this.blendId = this.$route.params.id || null;
    },
    closeModal(suc = false) {
      this.$emit("close-modal", suc);
    },
    confirmDiscard() {
      this.startLoading();
      if (!this.blendId) {
        return;
      }
      this.loading = true;
        this.confirmDeleteDialog = false;
        BlendService.deleteBlend(parseInt(this.blendId))
          .then(() => {
            this.$emit("close-modal");
            this.$notify({
              text: this.$t('deforestation.reportDeletedSuccessfully'),
              type: "success",
            });
            this.$router.push({ name: "Blends" });
  
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
          }).finally(() => {
            this.stopLoading();
          });
    },
  },
  mixins: [loading],
};
</script>
