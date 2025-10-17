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
            <span  v-if="supplierId">
              {{  $t('dueDiligence.supplierNotRegisterContent') }}
            </span>
            <span  v-else-if="operatorId">
              {{  $t('The Operator is not registered. Do you want to send a notification to operator to join the platform via email?') }}
            </span>
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
          @click="confirmSave"
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
    supplierId: {
      required: false,
    },

    operatorId:{
      required: false
    }
    
  },
  data() {
    return {
    };
  },
  methods: {
    closeModal(suc = false) {
      this.$emit("close-modal", suc);
    },
    confirmSave() {
      this.startLoading();
      DeforestationService.sendEmailToSupplierOrOperator(this.supplierId, this.operatorId)
        .then((res) => {
          if (res.errors && res.errors.length > 0) {
            const error = res.errors[0];
            const errorMessage = error.message || this.$t("dueDiligence.anErrorOccurred");

            this.$notify({
              text: errorMessage,
              type: "error",
            });
          } else {
            this.$emit("confirm");
            this.$notify({
              text: this.$t('emailSentSuccessfully'),
              type: "success",
            });
          }
        })
        .catch((err) => {
          this.$notify({
            text: err,
            type: "error",
          });
          console.log("Error", err);
        })
        .finally(() => {
          this.stopLoading();
        });

      //this.$emit('confirm-discard', suc)
    
      //this.$emit("confirm");
    },
  },
  mixins: [loading],
};
</script>
