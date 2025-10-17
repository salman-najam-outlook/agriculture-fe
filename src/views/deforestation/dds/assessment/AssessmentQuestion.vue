<template>
  <div>
    <v-container>
      <template>
        <div>
          <v-dialog
            v-model="dialog"
            width="800px"
            persistent
            :retain-focus="false"
          >
            <v-card class="custom-card" rounded="0">
              <v-toolbar color="primary" class="white--text">
                <v-toolbar-title class="font-weight-bold">
                  {{
                    isEdit
                      ? $t("dueDiligence.editAssessmentDetails")
                      : $t("dueDiligence.addQuestion")
                  }}
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
                      <v-row>
                        <v-col>
                          <label>{{ $t("dueDiligence.assessment") }}</label>
                          <v-switch inset
                            :label="
                              questions.isEnabled
                                ? $t('surveyBuilder.enabled')
                                : $t('surveyBuilder.disabled')
                            "
                            :disabled="enableAssessment(questions.assessmentQuestionType)"
                            v-model="questions.isEnabled"
                          >
                          </v-switch>
                        </v-col>
                        <v-col>
                          <label>{{ $t("surveyBuilder.mandatory") }}</label>
                          <v-switch inset
                            :label="questions.isMandatory ? this.$t('surveyBuilder.yes') :  this.$t('surveyBuilder.no')"
                            v-model="questions.isMandatory"
                          >
                          </v-switch>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col v-if="hasHeading">
                      <label>{{ $t("dueDiligence.heading") }}</label>
                      <v-tooltip top color="00BD73" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon size="medium" class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                            mdi-alert-circle
                            </v-icon>
                        </template>
                        <span>{{ $t("dueDiligence.headingInfo") }}</span>
                      </v-tooltip>
                      <v-select
                        :items="headingList"
                        v-model="questions.heading"
                        item-text="title"
                        item-value="id"
                        dense
                        outlined
                        @change="onSelectEventChanged"
                        clearable
                      >
                      </v-select>
                    </v-col>
                    <v-col v-else>
                    </v-col>
                  </v-row>
                  <v-card class="mb-2 elevation-0">
                    <v-card-text class="p-0">
                      <v-row>
                        <v-col>
                          <div class="mr-2">
                            <label>{{ $t("surveyBuilder.type") }}</label>
                            <v-tooltip top color="00BD73" max-width="350">
                              <template v-slot:activator="{ on, attrs }">
                                  <v-icon size="medium" class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                  mdi-alert-circle
                                  </v-icon>
                              </template>
                              <span>{{ $t("surveyBuilder.typeInfo") }}</span>
                            </v-tooltip>
                            <v-select
                              :items="fieldTypes"
                              v-model="questions.assessmentQuestionType"
                              item-text="name"
                              item-value="type"
                              dense
                              outlined
                              @change="onSelectEventChanged"
                            >
                            </v-select>
                          </div>
                        </v-col>
                        <v-col>
                          <label>{{ $t("surveyBuilder.question") }}</label>
                          <v-tooltip top color="00BD73" max-width="350">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon size="medium" class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                mdi-alert-circle
                                </v-icon>
                            </template>
                            <span>{{ $t("surveyBuilder.questionInfo") }}</span>
                          </v-tooltip>
                          <v-text-field
                            v-model="questions.title"
                            outlined
                            dense
                          >
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row v-if="questions.assessmentQuestionType === 'FILE_ATTACHMENT'">
                        <v-col>
                          <label>{{ $t("dueDiligence.fileType") }}</label>
                          <v-select
                            :items="fileType"
                            v-model="questions.fileTypeAdditionalSettings.allowedFileTypes"
                            dense
                            outlined
                            multiple
                            @change="onSelectEventChanged"
                          >
                          </v-select>
                        </v-col>
                        <v-col> </v-col>
                      </v-row>
                      <v-row v-if="questions.assessmentQuestionType === 'FILE_ATTACHMENT'">
                        <v-col>
                          <v-checkbox
                            v-model="questions.fileTypeAdditionalSettings.allowMultipleAttachments"
                            :label="$t('dueDiligence.allowMultipleFile')"
                          ></v-checkbox>
                          <v-checkbox
                            v-model="questions.fileTypeAdditionalSettings.allowComments"
                            :label="$t('dueDiligence.allowComment')"
                          ></v-checkbox>
                        </v-col>
                        <v-col> </v-col>
                      </v-row>
                      <v-row
                        v-if="questions.assessmentQuestionType === 'DIGITAL_SIGNATURE'"
                      >
                        <v-col>
                          <v-checkbox
                            v-model="questions.digitalSignatureTypeAdditionalSettings.uploadSignatureFile"
                            :label="$t('dueDiligence.uploadSignatureFile')"
                          ></v-checkbox>
                          <v-checkbox
                            v-model="questions.digitalSignatureTypeAdditionalSettings.drawSignature"
                            :label="$t('dueDiligence.drawSignature')"
                          ></v-checkbox>
                        </v-col>
                        <v-col> </v-col>
                      </v-row>
                      <v-row
                        v-if="
                          questions.assessmentQuestionType == 'CHECK_BOXES' ||
                            questions.assessmentQuestionType == 'RADIO_BUTTON'
                        "
                        no-gutters
                      >
                        <v-col cols="12">
                          <v-row>
                            <v-col>
                              <label>{{ $t("surveyBuilder.options") }}</label>
                              <v-text-field
                                outlined
                                dense
                                v-model="optionsValue"
                                :placeholder="$t('surveyBuilder.typeHere')"
                                :hint="$t('surveyBuilder.optionsHint')"
                                @keyup.enter="addAnswer(optionsValue)"
                              >
                              </v-text-field>
                            </v-col>
                            <v-col>
                              <div class="mt-6">
                                <v-btn
                                  right
                                  color="primary"
                                  @click="addAnswer(optionsValue)"
                                >
                                  {{ $t("surveyBuilder.add") }}
                                </v-btn>
                              </div>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="12">
                          <v-row
                            v-for="(ans, i) in questions.questionOptions"
                            :key="i"
                            :id="'option' + i"
                          >
                            <v-col cols="12" class="">
                              <v-row style="align-items: baseline;">
                                <v-col cols="4">
                                  <div v-if="isEdit">
                                    <v-text-field
                                      filled
                                      v-model="ans.text"
                                      :readOnly="isEditDisabled"
                                      @blur="isEditDisabled = true"
                                    ></v-text-field>
                                  </div>
                                  <div v-else>
                                    <div class="question-option mt-6 px-4">
                                      {{ ans.text }}
                                    </div>
                                  </div>
                                </v-col>
                                <v-col
                                  cols="4"
                                  v-if="questions.isCheckPoint"
                                  class="score-container"
                                >
                                  <v-select
                                    :items="assessmentList"
                                    item-text="label"
                                    item-value="value"
                                    dense
                                    outlined
                                    v-model="ans.scores"
                                  ></v-select>
                                </v-col>
                                <v-col cols="4">
                                  <div
                                    class="d-flex align-center justify-space-between"
                                  >
                                    <div
                                      v-if="questions.isCheckPoint"
                                      class="text-decoration-underline pointer green--text font-weight-bold"
                                      @click="showCheckList(i)"
                                    >
                                      {{
                                        questions.questionOptions[i]
                                          .toggleChecklist
                                          ? $t("dueDiligence.hideChecklist")
                                          : $t("dueDiligence.showChecklist")
                                      }}
                                    </div>
                                    <div class="">
                                      <v-btn
                                        v-if="!isEdit"
                                        class="mr-2"
                                        color="primary"
                                        height="18.14px"
                                        width="18.14px"
                                        elevation="0"
                                        fab
                                        outlined
                                        x-small
                                        @click="editAnswer(i)"
                                      >
                                        <v-icon x-small>mdi-pencil</v-icon>
                                      </v-btn>
                                      <v-btn
                                        class="mr-2"
                                        fab
                                        x-small
                                        color="primary"
                                        height="18.14px"
                                        width="18.14px"
                                        elevation="0"
                                        outlined
                                        @click="deleteAnswer(i)"
                                      >
                                        <v-icon x-small>mdi-trash-can</v-icon>
                                      </v-btn>
                                      <v-btn
                                        v-if="!questions.isCheckPoint"
                                        fab
                                        x-small
                                        color="primary"
                                        height="18.14px"
                                        width="18.14px"
                                        elevation="0"
                                        outlined
                                        @click="addNestedQuestion(i)"
                                      >
                                        <v-icon x-small>mdi-plus</v-icon>
                                      </v-btn>
                                    </div>
                                  </div>
                                </v-col>
                              </v-row>
                              <div                
                               v-if="
                                  questions.isCheckPoint &&
                                    questions.questionOptions[i].toggleChecklist
                                ">
                              <div
                                class="checkpoints"
                                v-for="(checkpoints,
                                checkpointIndex) in questions.questionOptions[i]
                                  .checklist"
                                :key="checkpoints"
                              >
                                <v-btn
                                  class="mr-2"
                                  color="error"
                                  height="18.14px"
                                  width="18.14px"
                                  elevation="0"
                                  fab
                                  outlined
                                  x-small
                                  @click="removeChecklist(i, checkpointIndex)"
                                >
                                  <v-icon x-small>mdi-close</v-icon>
                                </v-btn>
                                {{ checkpoints }}
                              </div>
                              <v-row
                                class="question-option"
                
                                style="align-items: baseline;"
                              >
                                <v-col cols="8">
                                  <v-text-field
                                    outlined
                                    dense
                                    v-model="checkListItems[i]"
                                    :placeholder="$t('surveyBuilder.typeHere')"
                                    :hint="$t('surveyBuilder.optionsHint')"
                                    @keyup.enter="addChecklist(i)"
                                  >
                                  </v-text-field>
                                </v-col>
                                <v-col cols="4">
                                  <div class="">
                                    <v-btn
                                      right
                                      color="primary"
                                      @click="addChecklist(i)"
                                    >
                                      {{ $t("surveyBuilder.add") }}
                                    </v-btn>
                                  </div>
                                </v-col>
                              </v-row>
                            </div>
                          </v-col>
                            <!-- Nested Question -->
                            <v-col
                              cols="12"
                              v-if="
                                ans.nestedQuestions && !questions.isCheckPoint
                              "
                              class="nested-question"
                            >
                              <v-row v-if="ans.nestedQuestions">
                                <v-row>
                                  <v-col>
                                    <div class="mr-2">
                                      <label>{{
                                        $t("surveyBuilder.type")
                                      }}</label>
                                      <v-select
                                        :items="fieldTypes"
                                        v-model="
                                          ans.nestedQuestions.assessmentQuestionType
                                        "
                                        item-text="name"
                                        item-value="type"
                                        dense
                                        outlined
                                        @change="
                                          onSelectEventNestedChanged(i, $event)
                                        "
                                      >
                                      </v-select>
                                    </div>
                                  </v-col>
                                  <v-col>
                                    <label>{{
                                      $t("surveyBuilder.question")
                                    }}</label>
                                    <v-text-field
                                      v-model="ans.nestedQuestions.title"
                                      outlined
                                      dense
                                    >
                                    </v-text-field>
                                  </v-col>
                                  <v-col
                                    v-if="
                                      questions.isQuestionScore &&
                                        !(
                                          ans.nestedQuestions.assessmentQuestionType ==
                                            'CHECK_BOXES' ||
                                          ans.nestedQuestions.assessmentQuestionType ==
                                            'RADIO_BUTTON'
                                        )
                                    "
                                  >
                                    <div class="mr-2">
                                      <label>{{
                                        $t("surveyBuilder.score")
                                      }}</label>
                                      <v-text-field
                                        v-model="ans.nestedQuestions.scores"
                                        outlined
                                        dense
                                      >
                                      </v-text-field>
                                    </div>
                                  </v-col>
                                </v-row>
                              </v-row>
                              <v-row
                                v-if="
                                  showSelection(
                                    ans.nestedQuestions.assessmentQuestionType
                                  )
                                "
                              >
                                <div class="d-flex align-start">
                                  <span class="mr-3">{{
                                    $t("surveyBuilder.singleSelection")
                                  }}</span>
                                  <v-switch inset
                                    dense
                                    style="margin: 0px; padding: 0px;"
                                    v-model="
                                      ans.nestedQuestions.isMultiSelection
                                    "
                                  >
                                  </v-switch>
                                  <span>{{
                                    $t("surveyBuilder.multipleSelection")
                                  }}</span>
                                </div>
                              </v-row>
                              <v-row
                                v-if="
                                  ans.nestedQuestions.assessmentQuestionType ==
                                    'CHECK_BOXES' ||
                                    ans.nestedQuestions.assessmentQuestionType == 'RADIO_BUTTON'
                                "
                              >
                                <v-col>
                                  <label>{{
                                    $t("surveyBuilder.options")
                                  }}</label>
                                  <v-text-field
                                    outlined
                                    dense
                                    v-model="nestedOptionsValue"
                                    :placeholder="$t('surveyBuilder.typeHere')"
                                    :hint="$t('surveyBuilder.optionsHint')"
                                    @keyup.enter="
                                      addNestedAnswer(i, nestedOptionsValue)
                                    "
                                  >
                                  </v-text-field>
                                  <v-row
                                    v-for="(option, index) in ans
                                      .nestedQuestions.questionOptions"
                                    :key="index"
                                    style="align-items: start;"
                                  >
                                    <v-col md="5">
                                      <div class="question-option mt-6 px-4">
                                        {{ option.text }}
                                      </div>
                                    </v-col>
                                    <v-col
                                      v-if="questions.isQuestionScore"
                                      class="score-container"
                                    >
                                      <label>{{
                                        $t("surveyBuilder.score")
                                      }}</label>
                                      <v-text-field
                                        class="mt-6 ml-4"
                                        dense
                                        outlined
                                        type="number"
                                        v-model="option.scores"
                                        min="0"
                                        style="width: 50px; height: 0"
                                      >
                                      </v-text-field>
                                    </v-col>
                                    <v-col>
                                      <div class="mt-8">
                                        <v-btn
                                          x-small
                                          class="mr-2"
                                          color="primary"
                                          fab
                                          height="18.14px"
                                          width="18.14px"
                                          @click="editNestedAnswer(i, index)"
                                        >
                                          <v-icon x-small>mdi-pencil</v-icon>
                                        </v-btn>
                                        <v-btn
                                          fab
                                          x-small
                                          height="18.14px"
                                          width="18.14px"
                                          @click="
                                            deleteNestedAnswer(option, i, index)
                                          "
                                        >
                                          <v-icon x-small>mdi-trash-can</v-icon>
                                        </v-btn>
                                      </div>
                                    </v-col>
                                  </v-row>
                                </v-col>
                                <v-col>
                                  <div class="mt-6">
                                    <v-btn
                                      right
                                      color="primary"
                                      @click="
                                        addNestedAnswer(i, nestedOptionsValue)
                                      "
                                    >
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
                        <v-btn
                          outlined
                          class="mr-2"
                          height="44"
                          width="116"
                          depressed
                          color="primary"
                          @click="closeModal"
                        >
                          {{ $t("cancel") }}
                        </v-btn>

                        <v-btn
                          right
                          height="44"
                          width="116"
                          @click="saveQuestion()"
                          color="primary"
                          :disabled="disableSubmit"
                        >
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
    <edit-survey-confirmation
      :showDialog="showEditConfirmDialog"
      @closeDialog="showEditConfirmDialog = false"
    />
  </div>
</template>
<script>
import moment from "moment";
import loadingMixin from "@/mixins/LoadingMixin";
import EditSurveyConfirmation from "@/views/survey-builder/EditSurveyConfirmation.vue";
import DeforestationSurveyBuilderService from "@/_services/DeforestationSurveyBuilderService";
import DeforestationService from "@/_services/DeforestationService";

export default {
  components: {
    EditSurveyConfirmation,
  },
  data() {
    return {
      fieldTypes: [
        {
          id: 1,
          name: this.$t("surveyBuilder.textField"),
          type: "TEXT_FIELD",
        },
        {
          id: 2,
          name: this.$t("surveyBuilder.textArea"),
          type: "TEXT_AREA",
        },
        {
          id: 3,
          name: this.$t("surveyBuilder.textFieldNumeric"),
          type: "TEXT_FIELD_NUMERIC",
        },
        {
          id: 4,
          name: this.$t("surveyBuilder.radioButton"),
          type: "RADIO_BUTTON",
        },
        {
          id: 5,
          name: this.$t("surveyBuilder.checkBoxes"),
          type: "CHECK_BOXES",
        },
        {
          id: 6,
          name: this.$t("dueDiligence.attachFiles"),
          type: "FILE_ATTACHMENT",
        },
        {
          id: 7,
          name: this.$t("dueDiligence.digitalSignature"),
          type: "DIGITAL_SIGNATURE",
        },

        // no need to implement it for now;
        // {
        //   id: 8,
        //   name: this.$t("surveyBuilder.gpsLocation"),
        //   type: "GPS_LOCATION",
        // },
      ],
      checkListItems: [],
      checkListItem: "",
      questions: {
        id: null,
        answerTempId: null,
        isMultiSelection: false,
        heading: null,
        title: null,
        assessmentQuestionType: "TEXT_FIELD",
        allowMultipleFile: false,
        allowComent: false,
        isDigitalSignatureType: false,
        digitalSignatureTypeAdditionalSettings: {
          uploadSignatureFile: false,
          drawSignature: false,
        },
        isFileType: false,
        fileTypeAdditionalSettings: {
          allowedFileTypes: '',
          allowMultipleAttachments: false,
          allowComments: false
        },
        isEnabled: true,
        isMandatory: false,
        isCheckPoint: true,
        questionOptions: [],
      },
      showEditDialog: false,
      showEditConfirmDialog: false,
      optionsValue: null,
      nestedOptionsValue: null,
      isEditDisabled: true,
      eudrSettings: {},
      fileType: ["PDF", "DOC", "XLSX", "JPEG", "PNG"],
    };
  },
  computed: {
    dialog() {
      return this.dialogI;
    },
    disableSubmit() {
      if (this.questions.title === null) return true;
      if (this.questions.assessmentQuestionType === null) return true;
      if (this.questions.title === "") return true;
      return false;
    },
    headingList() {
      return this.headingsArray;
    },
    hasHeading() {
      if (this.selectedSurvey?.assessmentSettings?.multiStepType === 'QUESTIONS') {
        return false;
      }
      return true;
    },
    getOrganizationId() {
      return this.$store.getters.getUser?.user_organization?.id;
    },
    assessmentList() {
      return [
        {
          label: this.$t('dueDiligence.selectStatus'),
          value:''
        },
        {
          label: this.$t('deforestation.veryHigh'),
          value: "very_high",
        },
        {
          label: this.$t('deforestation.high'),
          value: "high",
        },
        {
          label: this.$t('deforestation.medium'),
          value: "medium",
        },
        {
          label: this.$t('deforestation.low'),
          value: "low",
        },
        {
          label: this.$t('deforestation.zeroOrNegligible'),
          value: "zero",
        },
      
      ];
    }
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
    },
    headingsArray: {
      type: Array,
      required: false,
    }
  },
  async created() {
    // await this.getEudrSettings();
  },
  mounted() {
    if (this.isEdit) {
      const { options, hasOptions, ...question } = this.$props.selectedQuestion;

      // Mutating options if available
      this.questions = question;
      this.questions.isCheckPoint = true;
      this.questions.options = hasOptions;
      this.questions.heading = question.headingId;

      if(this.questions.assessmentQuestionType === 'FILE_ATTACHMENT'){
      if (!this.questions.fileTypeAdditionalSettings) {
          this.questions.fileTypeAdditionalSettings = {
            allowedFileTypes: '',
            allowMultipleAttachments: false,
            allowComments: false
          }
        }
      }
      else if (this.questions.assessmentQuestionType === 'DIGITAL_SIGNATURE') {
        if (!this.questions.digitalSignatureTypeAdditionalSettings) {
          this.questions.digitalSignatureTypeAdditionalSettings = {
            uploadSignatureFile: false,
            drawSignature: false,
          }
        }
      }
      if (options && options.length > 0) {
        this.questions.questionOptions = options.map((item) => ({
          checklist: item.checklists,
          text: item.label,
          scores: item.value,
          toggleChecklist: false,
        }));
      }

      this.isEditDisabled = true;
    } else if (this.selectedQuestion?.headingId) {
      this.questions.heading = this.selectedQuestion.headingId;
    }
  },
  methods: {
    async getEudrSettings() {
      try {
        const { data } = await DeforestationService.getEudrSettings();
        this.eudrSettings = data.eudrSetting;
      } catch (err) {
        this.$notify({
            text: this.$t('deforestation.failedToFetchSettings'),
            type: 'error'
        });
      }
    },
    enableAssessment(assessmentQuestionType) {
      if (assessmentQuestionType === "RADIO_BUTTON" || assessmentQuestionType === "CHECK_BOXES") {
        return false;
      }
      return true;
    },
    showSelection(assessmentQuestionType) {
      if (
        assessmentQuestionType === "FILE_ATTACHMENT" ||
        assessmentQuestionType === "DIGITAL_SIGNATURE"
      ) {
        return true;
      }
      return false;
    },
    addAnswer(value) {
      if (this.optionsValue) {
        this.questions.questionOptions.push({
          text: value,
          isEnabled: true,
          nestedQuestions: null,
          toggleChecklist: false,
          checklist: [],
        });
        this.optionsValue = null;
      }
    },
    addNestedAnswer(index, value) {
      if (this.nestedOptionsValue) {
        this.questions.questionOptions[
          index
        ].nestedQuestions.questionOptions.push({
          text: value,
          isEnabled: true,
        });
      }
      this.nestedOptionsValue = null;
    },
    async deleteNestedAnswer(item, index, optionIndex) {
      this.questions.questionOptions[
        index
      ].nestedQuestions.questionOptions.splice(optionIndex, 1);
    },
    editNestedAnswer(index, a_index) {
      if (!this.nestedOptionsValue) {
        this.nestedOptionsValue = this.questions.questionOptions[
          index
        ].nestedQuestions.questionOptions[a_index].text;
        this.questions.questionOptions[index].nestedQuestions.questionOptions[
          a_index
        ].text = this.nestedOptionsValue;
        this.questions.questionOptions[
          index
        ].nestedQuestions.questionOptions.splice(a_index, 1);
      }
    },
    async deleteAnswer(a_index) {
      document.getElementById(`option${a_index}`).remove();
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

      let options = null;
      if (this.questions.questionOptions && this.questions.questionOptions.length > 0) {
        options = this.questions.questionOptions.map((item) => ({
          checklists: item.checklist,
          label: item.text,
          value: item.scores || item.text.toLowerCase()
        }));

        this.questions.options = true;
      }

      let params = {
        assessmentId: this.selectedSurvey.id,
        headingId: this.questions.heading,
        title: this.questions.title,
        assessmentQuestionType: this.questions.assessmentQuestionType,
        isMandatory: this.questions.isMandatory,
        isEnabled: this.questions.isCheckPoint,
        hasOptions: this.questions.options,
        options
      };

      if (this.questions.assessmentQuestionType === 'FILE_ATTACHMENT') {
        params.fileTypeAdditionalSettings = this.questions.fileTypeAdditionalSettings;
      }

      if (this.questions.assessmentQuestionType === 'DIGITAL_SIGNATURE') {
        params.digitalSignatureTypeAdditionalSettings = this.questions.digitalSignatureTypeAdditionalSettings;
      }

      console.log(params);

      if (this.$props.isEdit) {
        await DeforestationSurveyBuilderService.updateAssessmentQuestion(this.questions.id, params);
      } else {
        await DeforestationSurveyBuilderService.createAssessmentQuestion(params);
      }
      
      this.stopLoading();
    },
    async saveQuestion() {
      if (this.isEdit) {
        if (this.selectedSurvey.surveyStatus) {
          this.showEditDialog = true;
        } else {
          await this.submitSurveyQuestion();
        }
      } else {
        await this.submitSurveyQuestion();
      }
      
      this.$emit("questionAdded");
      this.closeModal();
    },
    formatDate(date) {
      return moment(date).format("DD-MMM-YYYY");
    },
    closeModal() {
      this.$emit("closeDialog");
    },
    onSelectEventChanged(e) {
      if (e === "RADIO_BUTTON" || e === "CHECK_BOXES") {
        this.questions.questionOptions = [];
      }
      else if (e === 'FILE_ATTACHMENT') {
        if (!this.questions.fileTypeAdditionalSettings) {
          this.questions.fileTypeAdditionalSettings = {
            allowedFileTypes: '',
            allowMultipleAttachments: false,
            allowComments: false
          }
        }
      }
      else if (e === 'DIGITAL_SIGNATURE') {
        if (!this.questions.digitalSignatureTypeAdditionalSettings) {
          this.questions.digitalSignatureTypeAdditionalSettings = {
            uploadSignatureFile: false,
            drawSignature: false,
          }
        }
      } else {
        this.questions.questionOptions = null;
      }
      this.enableAssessment(e);
    },
    onSelectEventNestedChanged(i, e) {
      if (e === "RADIO_BUTTON" || e === "CHECK_BOXES") {
        this.questions.questionOptions[i].nestedQuestions.scores = null;
        if (
          this.isEdit &&
          this.questions.questionOptions[i].nestedQuestions.questionOptions
        ) {
          return (this.questions.questionOptions[
            i
          ].nestedQuestions.questionOptions = []);
        }
        this.questions.questionOptions[i].nestedQuestions.questionOptions = [];
      } else {
        this.questions.questionOptions[
          i
        ].nestedQuestions.questionOptions = null;
      }
    },
   showCheckList(index) {
        this.$set(
        this.questions.questionOptions[index],
        'toggleChecklist',
        !this.questions.questionOptions[index].toggleChecklist
      );
            // Ensure Vue detects the change
            this.$forceUpdate();

    },
    addChecklist(index) {
      // Ensure the checklist array exists for this index
      if (!this.questions.questionOptions[index].checklist) {
        this.questions.questionOptions[index].checklist = [];
      }

      // Add the new checklist item
      if (this.checkListItems[index]) {
        this.questions.questionOptions[index].checklist.push(this.checkListItems[index]);
        // Clear the input field
        this.$set(this.checkListItems, index, '');
      }
    },
    removeChecklist(index, checkpointIndex) {
      this.questions.questionOptions[index].checklist.splice(
        checkpointIndex,
        1
      );
      this.$forceUpdate();

    },
    addNestedQuestion(index) {
      this.questions.questionOptions[index].nestedQuestions = {
        answerTempId: null,
        question: null,
        assessmentQuestionType: null,
        isEnabled: true,
        isMandatory: this.questions.isMandatory,
        isCheckPoint: this.questions.isCheckPoint,
        questionOptions: [],
      };
    },
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
  margin: 0px 0px 5px 0px;
  padding-left: 10px;
  min-height: 40px;
  align-items: center;
}
.checkpoints {
  background: #d9d9d9;
  display: flex;
  padding: 4px;
  padding-left: 10px;
  min-height: 40px;
  align-items: center;
}

.score-container {
  display: flex;
  align-items: baseline;
}

.nested-question {
  background-color: #edecec;
  padding: 37px 28px;
  gap: 15px;
}

.pointer {
  cursor: pointer;
}

.p-0 {
  padding: 0 !important;
}

::v-deep .v-data-table-header__icon {
  color: white !important;
}
</style>
