<template>
  <v-dialog v-model="showDialog" width="36%" @click:outside="closeModal()"
    :retain-focus="false">
    <v-card class="custom-card" rounded="0">
      <v-toolbar color="primary" class="white--text">
        <v-toolbar-title class="font-weight-bold">
          {{ $t("surveyBuilder.editSurvey") }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon class="white--text" @click="closeModal()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-form ref="addNewSurvey" lazy-validation autocomplete="off">
        <v-card-text class="black--text">
          <div class="mb-4">{{ $t("surveyBuilder.surveyIsLive") }}
          </div>            
          <div class="survey-link" @click="copySurvey">{{ $t("surveyBuilder.clickToCopy") }}</div>
          <v-divider class="mt-5"></v-divider>
          <div class="mt-5">
            <v-row>
              <v-col cols="12" lg="6">
                <v-btn class="font-weight-bold" block max-width="250" outlined color="primary" @click="closeModal">
                  {{ $t("surveyBuilder.cancel") }}
                </v-btn>
              </v-col>
              <v-col cols="12" lg="6">
                <v-btn class="font-weight-bold" block max-width="250" @click="$emit('applyChanges')"
                  color="primary">
                  {{ $t("surveyBuilder.applyChangesNow") }}
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script>

export default {
  props: {
    showDialog: {
      type: Boolean,
      require: true,
      default: false,
    }
  },
  methods: {
    closeModal() {
      this.$emit('closeDialog');
    },
    copySurvey() {
      this.$emit('createCopy')
    }
  }
}
</script>
<style lang="scss" scoped>
.survey-link {
  color: #117443;
  
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>