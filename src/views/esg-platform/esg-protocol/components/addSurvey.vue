<template>
    <v-dialog v-model="dialog" width="800" @click:outside="closeModal" :retain-focus="false">
      <v-card class="custom-card" rounded="0">
        <v-toolbar flat color="primary" class="white--text">
          <v-toolbar-title class="font-weight-bold">{{ $t("esgPlatform.surveyQuestionForTheGoal") }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon class="white--text" @click="closeModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-form ref="form" @submit.prevent="submitForm">
          <v-card-text class="pa-4">
            <div class="item-box px-6 mt-4" style="align-items: center;">
              <v-row>
                <label for="survey" class="text-subtitle-1 font-weight-bold">
                  {{ $t('esgPlatform.selectExistingESGSurveyOrCreateNew') }}
                </label>
              </v-row>
              <v-row>
                <v-autocomplete dense v-model="survey" :items="existingSurvey" outlined :rules="[rules.required]" required
                  :placeholder="$t('esgPlatform.selectExistingESGSurveyOrCreateNew')"
                  @change="handleSurveyChange"></v-autocomplete>
              </v-row>
            </div>
          </v-card-text>
          <v-card-actions class="pa-4">
            <v-spacer></v-spacer>
            <v-btn color="primary" outlined class="mr-2" @click="closeModal">
              {{ $t("cancel") }}
            </v-btn>
            <v-btn color="primary" @click="createNewSurvey">
              {{ $t("esgPlatform.createnewSurvey") }}
            </v-btn>
            <v-btn color="primary" @click="submitForm">
              {{ $t("save") }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
      <CreateSurvey v-if="openCreateSurvey" :dialogI="openCreateSurvey" :fromAddGoals="true"
        @closeModal="closeSurveyModel" @surveyCreated="handleSurveyCreated" />
  
    </v-dialog>
  </template>
  
  <script>
  import ESGService from "@/_services/EsgService";
  import CreateSurvey from '../../survey-builder/components/CreateSurvey.vue';
  
  export default {
    props: {
      selectedSurvey: {
        type: [String, null],
        default: null
      },
      dialogI: Boolean
    },
    data() {
      return {
        existingSurvey: [],
        survey: null, // Will be initialized with selectedSurvey when dialog opens
        questionCount: 0,
        openCreateSurvey: false,
        errors: {
          survey: [],
        },
        rules: {
          required: v => !!v || this.$t("esgPlatform.thisfieldIsRequired"),
        },
      };
    },
    components: {
      CreateSurvey
    },
    computed: {
      dialog() {
        return this.dialogI;
      },
    },
    watch: {
      dialogI(newVal) {
        if (newVal) {
          // Initialize survey with selectedSurvey when dialog opens
          this.survey = this.selectedSurvey;
          this.getAssessmentQuestions();
        }
      },
      selectedSurvey(newVal) {
        // Keep survey in sync with selectedSurvey if it changes
        this.survey = newVal;
      },
      survey(newSurvey) {
        const selectedSurvey = this.existingSurvey.find(s => s.value === newSurvey);
        this.questionCount = selectedSurvey ? selectedSurvey.questionCount : 0;
      },
    },
    mounted() {
      this.getAssessmentQuestions();
    },
    methods: {
      async getAssessmentQuestions() {
        try {
          // Use getAssessments with pagination parameters to get all data
          const response = await ESGService.getAssessments({
            page: 1,
            limit: 1000 // Set a high limit to get all assessments
          });
          if (response.success) {
            // Fix: Access response.data.info instead of response.data directly
            const assessments = response.data.info || response.data || [];
            this.existingSurvey = assessments.map(assessment => ({
              text: assessment.title,
              value: assessment._id,
              questionCount: assessment.noOfQuestions || 0
            }));
          } else {
            console.error("Failed to fetch assessments:", response.message);
          }
        } catch (error) {
          console.error("Error fetching assessments:", error);
        }
      },
      handleSurveyChange() {
        const selectedSurvey = this.existingSurvey.find(s => s.value === this.survey);
        this.questionCount = selectedSurvey ? selectedSurvey.questionCount : 0;
      },
      handleSurveyCreated({ surveyId }) {
        if (surveyId) {
          this.closeSurveyModel(surveyId);
        } else {
          this.openCreateSurvey = false;
          this.getAssessmentQuestions();
        }
      },
      closeModal() {
        this.$emit('closeModal');
      },
      createNewSurvey() {
        this.openCreateSurvey = true;
      },
      async closeSurveyModel(newSurveyId = null) {
        this.openCreateSurvey = false;
  
        if (newSurveyId) {
          try {
            // Fetch the complete survey details to get title and other info
            const response = await ESGService.getAssessmentById(newSurveyId);
            if (response.success) {
              const newSurvey = response.data;
  
              // Add the new survey to the existingSurvey list if it's not already there
              if (!this.existingSurvey.some(s => s.value === newSurveyId)) {
                this.existingSurvey.push({
                  text: newSurvey.title,
                  value: newSurveyId,
                  questionCount: newSurvey.noOfQuestions || 0
                });
              }
  
              // Select the new survey
              this.survey = newSurveyId;
              this.questionCount = newSurvey.noOfQuestions || 0;
  
              // Notify parent component
              this.$emit('surveySelected', {
                survey: newSurveyId,
                questionCount: this.questionCount
              });
            } else {
              console.error("Failed to fetch new survey details:", response.message);
              // Still select the survey by ID even if details fetch failed
              this.survey = newSurveyId;
            }
          } catch (error) {
            console.error("Error fetching new survey details:", error);
            // Still select the survey by ID even if request failed
            this.survey = newSurveyId;
          }
        } else {
          // If no new survey, just refresh the list
          await this.getAssessmentQuestions();
        }
      },
      submitForm() {
        if (this.$refs.form.validate()) {
          const selectedSurvey = this.existingSurvey.find(s => s.value === this.survey);
          this.$emit("surveySelected", {
            survey: this.survey,
            questionCount: selectedSurvey ? selectedSurvey.questionCount : 0,
          });
          this.closeModal(); // Closes the dialog
        } else {
          this.$notify({
            type: "error",
            text: this.$t("esgPlatform.pleaseFillRequiredFields"),
          });
        }
      },
      clearErrors() {
        this.errors = { survey: [] };
      },
      resetComponent() {
        // Preserve survey instead of resetting it
        this.survey = this.selectedSurvey;
        this.questionCount = 0;
        this.clearErrors();
        if (this.$refs.form) {
          this.$refs.form.resetValidation(); // Reset validation state only
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .spaced {
    justify-content: space-between;
  }
  </style>