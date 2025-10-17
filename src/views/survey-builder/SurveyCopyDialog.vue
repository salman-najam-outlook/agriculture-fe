<template>
  <v-dialog
    v-model="showDialog"
    width="50%"
    @click:outside="closeDialog"
    :retain-focus="false"
  >
    <v-card class="custom-card" rounded="0">
      <v-toolbar color="primary" class="white--text">
        <v-toolbar-title class="font-weight-bold">
          {{ $t("surveyBuilder.copySurvey") }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          icon
          class="white--text"
          @click="closeDialog"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-form ref="addNewSurvey" lazy-validation autocomplete="off">
        <v-card-text class="black--text">
          <div class="mb-4">
            {{ $t("surveyBuilder.changeCopySurveyName") }}
          </div>
          <v-row>
            <v-col>
              <label>{{ $t("surveyBuilder.surveyTitle") }}<span class="red--text">*</span></label>
              <v-text-field outlined dense id="dialog-link" v-model="title"
                :placeholder="$t('surveyBuilder.surveyName')">
              </v-text-field>

              <label>{{ $t("surveyBuilder.surveyDescription") }}<span class="red--text">*</span></label>
              <v-textarea outlined v-model="description" :placeholder="$t('surveyBuilder.describeSurvey')"
                name="">
              </v-textarea>
            </v-col>
          </v-row>

          <v-divider class="mt-5"></v-divider>
          <v-card-actions class="mt-10" style="padding-right: 0">
            <v-spacer></v-spacer>
            <v-btn
              outlined
              class="px-4 mr-2"
              right
              depressed
              @click="closeDialog"
              color="primary"
            >
              {{ $t("cancel") }}
            </v-btn>

            <v-btn right class="px-4" :loading="loading" color="primary" @click="copySurvey()">
              {{ $t("surveyBuilder.copySurvey") }}
            </v-btn>
          </v-card-actions>
        </v-card-text>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script>

export default {
  data() {
    return {
      loading: false,
      title: '',
      description: '',
      parentId: ''
      
    }
  },
  props: {
    showDialog: {
      type: Boolean,
      require: true,
    },
    selectedSurvey: {
      type: Object,
      require: true,
    }
  },
  watch: {
    selectedSurvey: {
      handler() {
        this.title = this.selectedSurvey.title + ' copy';
        this.description = this.selectedSurvey.description + ' copy';
        this.parentId = this.selectedSurvey.id;
      }
    }
  },
  mounted() {
    this.title = this.selectedSurvey?.title + ' copy' ?? '';
    this.description = this.selectedSurvey?.description + ' copy' ?? '';
    this.parentId = this.selectedSurvey?.id ?? '';
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog');
    },
    copySurvey() {
      const survey = { 
        title: this.title,
        description: this.description,
        parentId: this.parentId,
      }
      this.$emit('copySurvey', survey);
      this.closeDialog();
    }
  }
}
</script>