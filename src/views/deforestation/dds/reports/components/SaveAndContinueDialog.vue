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
            {{  $t('dueDiligence.saveAndConfirmationMessage') }}
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
    confirmSave() {
      this.$emit("confirm-save");
    },
  },
  mixins: [loading],
};
</script>
