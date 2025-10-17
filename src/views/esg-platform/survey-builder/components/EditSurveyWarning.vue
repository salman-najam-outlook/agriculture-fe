<template>
  <v-dialog v-model="dialog" max-width="800">
    <v-card>
      <v-toolbar color="success" dark flat>
        <v-toolbar-title>Edit Survey</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="pt-6">
        <div class="text-body-1 mb-4">
          <p>
            Please note that the survey is currently live, and editing a question at this time may impact previous submissions.
            To avoid any issues, you may consider creating a copy of the survey in order to make changes to the questions.
          </p>
          <p>
            <br />
            <a href="#" @click.prevent="createSurveyCopy" class="text--primary font-weight-medium">
              Click Here To Create Survey Copy
            </a>
          </p>
        </div>
      </v-card-text>
      <v-card-actions class="px-5 pb-5">
        <v-spacer></v-spacer>
        <v-btn outlined color="success" @click="close">
          Cancel
        </v-btn>
        <v-btn color="success" dark @click="proceedEdit">
          Continue and Edit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "EditSurveyWarning",
  props: {
    dialog: {
      type: Boolean,
      required: true
    },
    surveyId: {
      type: String,
      required: true
    }
  },
  methods: {
    close() {
      this.$emit("close");
    },
    proceedEdit() {
      this.$emit("proceed");
    },
    createSurveyCopy() {
      this.$emit("copy");
    }
  }
};
</script>

<style scoped>
/* .text-body-1 {
  line-height: 1.6;
} */
</style>