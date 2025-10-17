<template>
  <v-dialog
    transition="dialog-top-transition"
    max-width="600"
    v-model="dialog"
    @click:outside="closeModal"
  >
    <v-card>
      <v-toolbar color="primary" dark flat dense>
        <v-toolbar-title class="font-weight-bold">{{
          $t("dueDiligence.addMoreAssessments")
        }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon class="white--text" @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-form @submit.prevent="addAssessment">
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <h3 style="color:black">{{ $t('dueDiligence.selectAssessment') }}</h3>
              <v-checkbox
                v-for="assessment in assessments"
                :key="assessment.id"
                :input-value="isSelected(assessment)"
                @change="toggleSelection(assessment)"
                :label="assessment.title"
                color="success"
                hide-details
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="justify-end py-5">
          <v-btn outlined color="primary" @click="closeModal">{{
            $t("cancel")
          }}</v-btn>
          <v-btn color="primary" type="submit">{{ $t("confirm") }}</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import loading from "@/mixins/LoadingMixin";

export default {
  props: {
    dialog: {
      required: false,
      type: Boolean,
    },
    assessments: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedAssessments: [], // This will store objects
    };
  },
  methods: {
    isSelected(assessment) {
      return this.selectedAssessments.some((a) => a.id === assessment.id);
    },
    toggleSelection(assessment) {
      const index = this.selectedAssessments.findIndex(
        (a) => a.id === assessment.id
      );
      if (index === -1) {
        this.selectedAssessments.push(assessment);
      } else {
        this.selectedAssessments.splice(index, 1);
      }
    },
    async addAssessment() {
      console.log(this.selectedAssessments);
      this.$emit("selectedAssessments", this.selectedAssessments);
    },
    closeModal(suc = false) {
      this.$emit("close-modal", suc);
    },
  },
  mixins: [loading],
};
</script>
