<template>
  <div>
    <v-container>
      <template>
        <div>
          <v-dialog v-model="dialog" width="800px" @click:outside="closeModal" :retain-focus="false">
            <v-card class="custom-card" rounded="0">
              <v-toolbar color="primary" class="white--text">
                <v-toolbar-title class="font-weight-bold">
                  {{ isEdit ? $t("surveyBuilder.editSurveyQuestion") : $t("surveyBuilder.addSurveyQuestion") }} 
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon class="white--text" @click="closeModal">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-toolbar>
              <v-form ref="addNewSurvey" lazy-validation autocomplete="off">
                <v-card-text class="black--text">
                  <v-row>
                    <v-col>
                      <label>{{ $t("surveyBuilder.questionScore") }}</label>
                      <v-switch inset
                        :label="questions.isQuestionScore ? $t('surveyBuilder.enabled') : $t('surveyBuilder.disabled')"
                        v-model="questions.isQuestionScore">
                      </v-switch>
                    </v-col>
                    <v-col>
                      <label>{{ $t("surveyBuilder.mandatory") }}</label>
                      <v-switch inset :label="questions.mandatory ? 'Yes' : 'No'" v-model="questions.mandatory">
                      </v-switch>
                    </v-col>
                  </v-row>
                  <v-card class="mb-2">
                    <v-card-text>
                      <v-row>
                        <v-col>
                          <div class="mr-2">
                            <label>{{ $t("surveyBuilder.type") }}</label>
                            <v-select :items="fieldTypes" v-model="questions.questionType" item-text="name"
                              item-value="type" dense outlined @change="onSelectEventChanged">
                            </v-select>
                          </div>
                        </v-col>
                        <v-col>
                          <label>{{ $t("surveyBuilder.question") }}</label>
                          <v-text-field v-model="questions.question" outlined dense>
                          </v-text-field>
                        </v-col>
                        <v-col
                          v-if="questions.isQuestionScore && !(questions.questionType == 'checkbox' || questions.questionType == 'radio')">
                          <div class="mr-2">
                            <label>{{ $t("surveyBuilder.score") }}</label>
                            <v-text-field v-model="questions.scores" outlined dense>
                            </v-text-field>
                          </div>
                        </v-col>
                      </v-row>
                      <v-row v-if="showSelection(questions.questionType)">
                        <div class="d-flex align-start pl-4">
                          <span class="mr-3">{{ $t("surveyBuilder.singleSelection") }}</span>
                          <v-switch inset dense style="margin: 0px; padding: 0px;"
                            v-model="questions.isMultiSelection"
                          >
                          </v-switch>
                          <span>{{ $t("surveyBuilder.multipleSelection") }}</span>
                        </div>
                      </v-row>
                      <v-row v-if="questions.questionType == 'checkbox' || questions.questionType == 'radio'" no-gutters>
                        <v-col cols="12">
                          <v-row>
                            <v-col>
                              <label>{{ $t("surveyBuilder.options") }}</label>
                              <v-text-field outlined dense v-model="optionsValue" :placeholder="$t('surveyBuilder.typeHere')"
                                :hint="$t('surveyBuilder.optionsHint')">
                              </v-text-field>
                            </v-col>
                            <v-col>
                              <div class="mt-6">
                                <v-btn right color="primary" @click="addAnswer(optionsValue)">
                                  {{ $t("surveyBuilder.add") }}
                                </v-btn>
                              </div>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="12">
                          <v-row v-for="(ans, i) in questions.questionOptions" :key="i">
                            <v-col cols="12" class="mt-6">
                              <v-row style="align-items: baseline;">
                                <v-col>
                                  <div v-if="isEdit">
                                    <v-text-field filled v-model="ans.text" :readOnly="isEditDisabled"
                                      @blur="isEditDisabled = true"></v-text-field>
                                  </div>
                                  <div v-else>
                                    <div class="question-option mt-6 px-4">
                                      {{ ans.text }}
                                    </div>
                                  </div>
                                </v-col>
                                <v-col v-if="questions.isQuestionScore" class="score-container">
                                  <label>{{ $t("surveyBuilder.score") }}</label>
                                  <v-text-field class="mt-6 ml-4" dense outlined type="number"
                                    v-model="ans.scores" min="0" style="width: 50px; height: 0">
                                  </v-text-field>
                                </v-col>
                                <v-col>
                                  <div class="">
                                    <v-btn v-if="!isEdit" class="mr-2" color="primary" height="18.14px" width="18.14px" fab x-small @click="editAnswer(i)">
                                      <v-icon x-small>mdi-pencil</v-icon>
                                    </v-btn>
                                    <v-btn class="mr-2" fab x-small height="18.14px" width="18.14px" @click="deleteAnswer(ans, i)">
                                      <v-icon x-small>mdi-trash-can</v-icon>
                                    </v-btn>
                                    <v-btn fab x-small height="18.14px" width="18.14px" @click="addNestedQuestion(i)">
                                      <v-icon x-small>mdi-plus</v-icon>
                                    </v-btn>
                                  </div>
                                </v-col>
                              </v-row>
                            </v-col>
                            <!-- Nested Question -->
                            <v-col cols="12" v-if="ans.nestedQuestions" class="nested-question">
                              <v-row v-if="ans.nestedQuestions">
                                <v-row>
                                  <v-col>
                                    <div class="mr-2">
                                      <label>{{ $t("surveyBuilder.type") }}</label>
                                      <v-select :items="fieldTypes" v-model="ans.nestedQuestions.questionType"
                                        item-text="name" item-value="type" dense outlined
                                        @change="onSelectEventNestedChanged(i, $event)">
                                      </v-select>
                                    </div>
                                  </v-col>
                                  <v-col>
                                    <label>{{ $t("surveyBuilder.question") }}</label>
                                    <v-text-field v-model="ans.nestedQuestions.question" outlined dense>
                                    </v-text-field>
                                  </v-col>
                                  <v-col
                                    v-if="questions.isQuestionScore && !(ans.nestedQuestions.questionType == 'checkbox' || ans.nestedQuestions.questionType == 'radio')">
                                    <div class="mr-2">
                                      <label>{{ $t("surveyBuilder.score") }}</label>
                                      <v-text-field v-model="ans.nestedQuestions.scores" outlined dense>
                                      </v-text-field>
                                    </div>
                                  </v-col>
                                </v-row>
                              </v-row>
                              <v-row v-if="showSelection(ans.nestedQuestions.questionType)">
                                <div class="d-flex align-start">
                                  <span class="mr-3">{{ $t("surveyBuilder.singleSelection") }}</span>
                                  <v-switch inset dense style="margin: 0px; padding: 0px;"
                                    v-model="ans.nestedQuestions.isMultiSelection"
                                  >
                                  </v-switch>
                                  <span>{{ $t("surveyBuilder.multipleSelection") }}</span>
                                </div>
                              </v-row>
                              <v-row
                                v-if="ans.nestedQuestions.questionType == 'checkbox' || ans.nestedQuestions.questionType == 'radio'">
                                <v-col>
                                  <label>{{ $t("surveyBuilder.options") }}</label>
                                  <v-text-field outlined dense v-model="nestedOptionsValue" :placeholder="$t('surveyBuilder.typeHere')"
                                    :hint="$t('surveyBuilder.optionsHint')">
                                  </v-text-field>
                                  <v-row v-for="(option, index) in ans.nestedQuestions.questionOptions" :key="index"
                                    style="align-items: start;">
                                    <v-col md="5">
                                      <div class="question-option mt-6 px-4">
                                        {{ option.text }}
                                      </div>
                                    </v-col>
                                    <v-col v-if="questions.isQuestionScore" class="score-container">
                                      <label>{{ $t("surveyBuilder.score") }}</label>
                                      <v-text-field class="mt-6 ml-4" dense outlined type="number" v-model="option.scores"
                                        min="0" style="width: 50px; height: 0">
                                      </v-text-field>
                                    </v-col>
                                    <v-col>
                                      <div class="mt-8">
                                        <v-btn x-small class="mr-2" color="primary" fab height="18.14px" width="18.14px"
                                          @click="editNestedAnswer(i, index)">
                                          <v-icon x-small>mdi-pencil</v-icon>
                                        </v-btn>
                                        <v-btn fab x-small height="18.14px" width="18.14px"
                                          @click="deleteNestedAnswer(option, i, index)">
                                          <v-icon x-small>mdi-trash-can</v-icon>
                                        </v-btn>
                                      </div>
                                    </v-col>
                                  </v-row>
                                </v-col>
                                <v-col>
                                  <div class="mt-6">
                                    <v-btn right color="primary" @click="addNestedAnswer(i, nestedOptionsValue)">
                                      {{ $t("surveyBuilder.add") }}
                                    </v-btn>
                                  </div>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                  <v-divider class="mt-5"></v-divider>
                  <v-card-actions class="mt-10">
                    <!-- <v-spacer></v-spacer> -->
                    <v-row>
                      <v-col align="right">
                        <v-btn outlined class="mr-2" height="44" width="116" depressed color="primary" @click="closeModal">
                          {{ $t("cancel") }}
                        </v-btn>

                        <v-btn right height="44" width="116" @click="saveQuestion()" color="primary" :disabled="disableSubmit">
                          {{ isEdit ? $t("save") : $t("submit") }}
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-actions>
                </v-card-text>
              </v-form>
            </v-card>
          </v-dialog>
        </div>
      </template>
    </v-container>
    <edit-survey-question :showDialog="showEditDialog" @closeDialog="showEditDialog = false"
      @editFutureSurvey="showCopySurveyDialog = true" @editLiveSurvey="showEditConfirmDialog = true"
    />
    <edit-survey-confirmation :showDialog="showEditConfirmDialog" @closeDialog="showEditConfirmDialog = false"
      @createCopy="showCopySurveyDialog = true" @applyChanges="editLiveSurvey"
    />
    <survey-copy-dialog :showDialog="showCopySurveyDialog" 
      @closeDialog="showCopySurveyDialog = false" @copySurvey="submitCopySurvey"
      :selectedSurvey="selectedSurvey"
    />
  </div>
</template>
<script>
import moment from "moment";
import loadingMixin from "@/mixins/LoadingMixin";
import SurveyBuilderService from "@/_services/SurveyBuilderService";
import EditSurveyQuestion from './EditSurveyQuestion.vue';
import SurveyCopyDialog from './SurveyCopyDialog.vue';
import EditSurveyConfirmation from './EditSurveyConfirmation.vue';

export default {
  components: {
    EditSurveyQuestion,
    SurveyCopyDialog,
    EditSurveyConfirmation
  },
  data() {
    return {
      fieldTypes: [
        {
          id: 1,
          name: this.$t('surveyBuilder.textField'),
          type: "text",
        },
        {
          id: 2,
          name: this.$t('surveyBuilder.textArea'),
          type: "textarea",
        },
        {
          id: 3,
          name: this.$t('surveyBuilder.textFieldNumeric'),
          type: "number",
        },
        {
          id: 4,
          name: this.$t('surveyBuilder.radioButton'),
          type: "radio",
        },
        {
          id: 5,
          name: this.$t('surveyBuilder.checkBoxes'),
          type: "checkbox",
        },
        {
          id: 6,
          name: this.$t('surveyBuilder.dynamicFarmer'),
          type: "dynamicFarmer",
        },
        {
          id: 7,
          name: this.$t('surveyBuilder.dynamicGeofence'),
          type: "dynamicGeoFence",
        },
        {
          id: 8,
          name: this.$t('surveyBuilder.dynamicCrop'),
          type: "dynamicCrop",
        },
        {
          id: 9,
          name: this.$t('surveyBuilder.dynamicEquipment'),
          type: "dynamicEquipment",
        },
      ],
      questions: {
        answerTempId: null,
        isMultiSelection: false,
        question: null,
        questionType: null,
        isDisabled: false,
        mandatory: false,
        scores: null,
        isQuestionScore: false,
        questionOptions: []
      },
      showEditDialog: false,
      showEditConfirmDialog: false,
      showCopySurveyDialog: false,
      optionsValue: null,
      nestedOptionsValue: null,
      isEditDisabled: true
    };
  },
  computed: {
    dialog() {
      return this.dialogI;
    },
    disableSubmit() {
      if (this.questions.question === null) return true;
      if (this.questions.questionType === null) return true;
      if (this.questions.question === "") return true;
     return false;
    },
  },
  props: {
    isEdit: {
      type: Boolean,
      required: true,
      default: false,
    },
    dialogI: {
      type: Boolean,
      required: true,
    },
    selectedQuestion: {},
    selectedSurvey: {
      type: Object,
      required: false,
    },
    surveyId: {
      type: String,
      required: false,
    }
  },
  created() { },
  mounted() {
    if(this.isEdit) {
      this.questions = this.$props.selectedQuestion;
      this.isEditDisabled = true;
    }
  },
  methods: {
    showSelection(questionType) {
      if (questionType === 'dynamicFarmer' || questionType === 'dynamicGeoFence' ||
          questionType === 'dynamicCrop' || questionType === 'dynamicEquipment'
      ) {
        return true;
      }
      return false;
    },
    addAnswer(value) {
      if (this.optionsValue) {
        this.questions.questionOptions.push({
          text: value,
          scores: null,
          isDisabled: false,
          nestedQuestions: null
        });
        this.optionsValue = null;
      }
    },
    addNestedAnswer(index, value) {
      if (this.nestedOptionsValue) {
        this.questions.questionOptions[index].nestedQuestions.questionOptions.push({
          text: value,
          scores: null,
          isDisabled: false,
        })
      }
      this.nestedOptionsValue = null;
    },
    async deleteNestedAnswer(item, index, optionIndex) {
      if(this.isEdit) {
        this.startLoading();
        if (item.id) {
          await SurveyBuilderService.deleteSurveyQuestionOption(item.id).then(() => {
          this.stopLoading();
        })
          .catch((err) => {
            console.log(err);
            this.stopLoading();
          });
        }
      }
      this.questions.questionOptions[index].nestedQuestions.questionOptions.splice(optionIndex, 1);
    },
    editNestedAnswer(index, a_index) {
      if (!this.nestedOptionsValue) {
        this.nestedOptionsValue = this.questions.questionOptions[index].nestedQuestions.questionOptions[a_index].text;
        this.questions.questionOptions[index].nestedQuestions.questionOptions[a_index].text = this.nestedOptionsValue;
        this.questions.questionOptions[index].nestedQuestions.questionOptions.splice(a_index, 1);
      }
    },
    async deleteAnswer(item, a_index) {
      if(this.isEdit) {
        this.startLoading();
        await SurveyBuilderService.deleteSurveyQuestionOption(item.id).then(() => {
          this.stopLoading();
        })
          .catch((err) => {
            console.log(err);
            this.stopLoading();
          });
        return;
      }
      this.questions.questionOptions.splice(a_index, 1);
    },
    editAnswer(a_index) {
      if (!this.optionsValue) {
        this.optionsValue = this.questions.questionOptions[a_index].text;
        this.questions.questionOptions[a_index].text = this.optionsValue;
        this.questions.questionOptions.splice(a_index, 1);
      }
    },
    async submitSurveyQuestion() {
      this.startLoading();
      if (this.isEdit) {
        let surveyQuestionDto = {
          surveyId: this.$route.params.id,
          data: {
            id: this.questions.id,
            question: this.questions.question,
            isMultiSelection: this.questions.isMultiSelection,
            questionType: this.questions.questionType,
            isQuestionScore: this.questions.isQuestionScore,
            mandatory: this.questions.mandatory,
            questionOptions: this.questions.questionOptions,
            scores: this.questions.scores,
          }
        };
        await SurveyBuilderService.updateSurveyQuestion(surveyQuestionDto)
          .then(() => {
            this.stopLoading();
            this.closeModal();
            this.$emit("questionAdded");
          })
          .catch((err) => {
            console.log(err);
            this.stopLoading();
            this.closeModal();
          });
      } else {
        let surveyQuestionDto = {
          surveyId: this.$route.params.id || this.surveyId, // when surveyId is not available in params
          data: this.questions,
        };
        await SurveyBuilderService.addSurveyQuestion(surveyQuestionDto)
          .then(() => {
            this.stopLoading();
            this.closeModal();
            this.$emit("questionAdded");
          })
          .catch((err) => {
            console.log(err);
            this.stopLoading();
            this.closeModal();
          });
      }
    },
    async submitCopySurvey(a){
      this.startLoading();
      const question = {
        id: this.questions.id,
        question: this.questions.question,
        questionType: this.questions.questionType,
        isQuestionScore: this.questions.isQuestionScore,
        mandatory: this.questions.mandatory,
        options: this.questions.questionOptions,
        surveyId: this.$route.params.id,
      };
      const data = {
        question, 
        title: a.title,
        description: a.description,
        parentId: a.parentId,
      };
      await SurveyBuilderService.futureSurvey(question.id, data)
        .then(() => {
          this.stopLoading();
          this.closeModal();
          this.$emit('questionAdded');
        }).catch((err) => {
            console.log(err);
            this.stopLoading();
            this.closeModal();
        })
    },
    async editLiveSurvey() {
      await this.submitSurveyQuestion();
    },
    async saveQuestion() {
      if (this.isEdit) {
        if (this.selectedSurvey.surveyStatus ) {
          this.showEditDialog = true;
        } else {
          await this.submitSurveyQuestion();
        }
      } else {
        await this.submitSurveyQuestion()
      }
    },
    formatDate(date) {
      return moment(date).format("DD-MMM-YYYY");
    },
    closeModal() {
      this.$emit("closeDialog");
    },
    onSelectEventChanged(e) {
      if (e === 'radio' || e === 'checkbox') {
        this.questions.questionOptions = []
      } else {
        this.questions.questionOptions = null
      }
    },
    onSelectEventNestedChanged(i, e) {
      if (e === 'radio' || e === 'checkbox') {
        this.questions.questionOptions[i].nestedQuestions.scores = null;
        if (this.isEdit && this.questions.questionOptions[i].nestedQuestions.questionOptions) {
          return this.questions.questionOptions[i].nestedQuestions.questionOptions = []
        }
        this.questions.questionOptions[i].nestedQuestions.questionOptions = []
      } else {
        this.questions.questionOptions[i].nestedQuestions.questionOptions = null
      }
    },
    addNestedQuestion(index) {
      this.questions.questionOptions[index].nestedQuestions = {
        answerTempId: null,
        question: null,
        questionType: null,
        isDisabled: false,
        mandatory: this.questions.mandatory,
        isQuestionScore: this.questions.isQuestionScore,
        questionOptions: [],
        scores: null,
      }
    }
  },
  mixins: [loadingMixin],
};
</script>

<style>
.question-option {
  background: #d9d9d9;
  display: flex;
  border-radius: 5px;
  padding: 4px;
  margin-bottom: 5px;
  padding-left: 10px;
  min-height: 40px;
  align-items: center;
}

.score-container {
  display: flex;
  align-items: baseline;
}

.nested-question {
  background-color: #EDECEC;
  padding: 37px 28px;
  gap: 15px;
}
</style>