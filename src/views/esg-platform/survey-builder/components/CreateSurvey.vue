<template>
  <v-container>
    <template>
      <div>
        <v-dialog v-model="dialog" width="55%" persistent :retain-focus="false">
          <v-card class="custom-card" rounded="0">
            <v-toolbar color="primary" class="white--text">
              <v-toolbar-title class="font-weight-bold">
                {{ $t("esgPlatform.addNewSurvey") }}
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon class="white--text" @click="closeModal">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-form class="pa-4" ref="addNewSurvey" lazy-validation autocomplete="off">
              <v-card-text class="black--text">
                <v-row>
                  <v-col :style="{ marginRight: '30px' }">
                    <label>{{ $t("esgPlatform.surveyType") }}<span class="red--text">*</span></label>
                    <v-tooltip top color="00BD73" max-width="350">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                          mdi-alert-circle
                        </v-icon>
                      </template>
                      <span>{{ $t("esgPlatform.typeOfTheSurvey") }}</span>
                    </v-tooltip>
                    <v-select :items="surveyTypes" :rules="rules.title" item-text="label" item-value="value" dense
                      outlined v-model="survey.type" disabled></v-select>

                    <label>{{ $t("esgPlatform.surveyTitle") }}<span class="red--text">*</span></label>
                    <v-tooltip top color="00BD73" max-width="350">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                          mdi-alert-circle
                        </v-icon>
                      </template>
                      <span>{{ $t("esgPlatform.surveyTitleTT") }}</span>
                    </v-tooltip>
                    <v-text-field outlined dense id="dialog-link" v-model="survey.title" :rules="rules.title"
                      placeholder="Survey Title">
                    </v-text-field>

                    <label>{{ $t("esgPlatform.surveyDescription") }}</label>
                    <v-tooltip top color="00BD73" max-width="350">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                          mdi-alert-circle
                        </v-icon>
                      </template>
                      <span>{{ $t("esgPlatform.surveyDescriptionTT") }}</span>
                    </v-tooltip>
                    <!-- <v-textarea outlined v-model="survey.description" :rules="rules.description"
                      placeholder="Write Description" name="">
                      <template v-slot:textarea="{ attrs, listeners }">
                        <textarea
                          v-bind="attrs"
                          v-on="listeners"
                          class="rich-textarea"
                        ></textarea>
                      </template>
                    </v-textarea> -->

                    <v-card outlined class="mb-5">
                      <quill-editor
                        v-model="survey.description"
                        ref="quillEditor"
                        :options="quillOptions('Write description')"
                      />
                    </v-card>

                    <label>{{ $t("esgPlatform.surveyInstructions") }}</label>
                    <v-tooltip top color="00BD73" max-width="350">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                          mdi-alert-circle
                        </v-icon>
                      </template>
                      <span>{{ $t("esgPlatform.surveyInstructionsTT") }}</span>
                    </v-tooltip>
                    <!-- <v-textarea outlined v-model="survey.instructions" :rules="rules.instructions"
                      placeholder="Write Instructions" name="">
                    </v-textarea> -->
                    <v-card outlined class="mb-5">
                      <quill-editor
                        v-model="survey.instructions"
                        ref="quillEditor"
                        :options="quillOptions('Write instructions')"
                      />
                    </v-card>

                  </v-col>
                  <v-col :style="{ marginLeft: '30px' }">
                    <div class="d-flex justify-space-between">
                      <label>{{ $t("dueDiligence.multiStepAssess") }}</label>
                      <v-tooltip top color="black" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon class="green--text" v-bind="attrs" v-on="on">mdi-information
                          </v-icon>
                        </template>
                        <span>{{
                          $t("dueDiligence.multiStepSurveyDetails")
                        }}</span>
                      </v-tooltip>
                    </div>
                    <v-switch inset :label="$t('surveyBuilder.multiStep')" v-model="multiStepSettings.isMultiStep"
                      @change="handleMultiStepChange">
                    </v-switch>
                    <v-radio-group v-if="multiStepSettings.isMultiStep" :disabled="computedMultiStepValue"
                      v-model="multiStepSettings.multiStepType">
                      <v-radio value="Question" :label="$t('dueDiligence.noQuestionEachStep')">
                        <template v-slot:label>
                          <div class="question-label" style="font-size: 14px;">
                            {{ $t("dueDiligence.multiStepQuestion1") }}
                            <v-text-field type="number" v-model="multiStepSettings.noOfQuestion" outlined dense
                              class="question-input">
                            </v-text-field>
                          </div>
                          <label style="font-size: 14px;">{{
                            $t("dueDiligence.questions")
                          }}</label>
                          <v-tooltip top color="black" max-width="350">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon class="green--text" v-bind="attrs" v-on="on">mdi-information
                              </v-icon>
                            </template>
                            <span>{{
                              $t("dueDiligence.questionsInfo")
                            }}</span>
                          </v-tooltip>
                        </template>
                      </v-radio>
                      <v-radio value="Heading">
                        <template v-slot:label>
                          <span style="font-size: 14px;">
                            {{ $t("dueDiligence.mutiStepHeadingLable") }}
                          </span>
                        </template>
                      </v-radio>
                    </v-radio-group>

                    <hr class="soft-hr" />

                    <div class="d-flex justify-space-between pt-4">
                      <label>{{ $t("dueDiligence.assessmentStatus") }}</label>
                      <v-tooltip top color="black" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon class="green--text" v-bind="attrs" v-on="on">mdi-information
                          </v-icon>
                        </template>
                        <span>{{
                          $t("surveyBuilder.surveyStatusDetails")
                        }}</span>
                      </v-tooltip>
                    </div>
                    <v-switch inset :label="!survey.isDisabled
                      ? $t('surveyBuilder.enabled')
                      : $t('surveyBuilder.disabled')
                      " v-model="enabled" @change="flipDisabled">
                    </v-switch>

                    <hr class="soft-hr" />

                    <div class="d-flex justify-space-between pt-4">
                      <label>{{ $t("esgPlatform.surveyScore") }}</label>
                      <v-tooltip top color="black" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon class="green--text" v-bind="attrs" v-on="on">mdi-information
                          </v-icon>
                        </template>
                        <span>{{ $t("esgPlatform.surveyScoreTT") }}</span>
                      </v-tooltip>
                    </div>
                    <v-switch inset :label="score
                      ? $t('surveyBuilder.enabled')
                      : $t('surveyBuilder.disabled')
                      " v-model="score">
                    </v-switch>

                    <hr class="soft-hr" />

                    <label>{{ $t("esgPlatform.whoWillAnswerThisSurvey") }}</label>
                    <v-tooltip top color="00BD73" max-width="350">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                          mdi-alert-circle
                        </v-icon>
                      </template>
                      <span>{{ $t("esgPlatform.whoWillAnswerThisSurveyTT") }}</span>
                    </v-tooltip>
                    <v-select :items="respondentTypes" dense outlined v-model="survey.respondentType"
                      @change="fetchSupplierServiceType" placeholder="Select Respondents"></v-select>

                    <div v-if="survey.respondentType === 'Supplier'">
                      <hr class="soft-hr" />

                      <label>Supplier Service Type
                      </label>
                      <v-tooltip top color="00BD73" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                            mdi-alert-circle
                          </v-icon>
                        </template>
                        <span>Select the Supplier Service Type.</span>
                      </v-tooltip>
                      <v-select :items="supplierServiceTypes" dense outlined v-model="survey.supplierServiceType"
                        placeholder="Select Service Type"></v-select>
                    </div>

                  </v-col>
                </v-row>

                <v-divider class="mt-5"></v-divider>
                <v-card-actions class="mt-10" style="padding-right: 0">
                  <v-spacer></v-spacer>
                  <v-btn outlined class="mr-2" right height="44" width="116" depressed color="primary"
                    @click="closeModal">
                    {{ $t("cancel") }}
                  </v-btn>

                  <v-btn right height="44" width="116" @click="saveNewSurvey()" color="primary">
                    {{ updateData?._id ? $t("save") : $t("surveyBuilder.next") }}
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-form>
          </v-card>
        </v-dialog>
      </div>
    </template>
  </v-container>
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import EsgService from "@/_services/EsgService";

import { quillEditor } from 'vue-quill-editor';

export default {
  data() {
    return {
      preCondition: {},
      toggleDateSelector: false,
      mode: "start",
      currentDate: "",
      orgId: null,
      loggedInUser: null,
      surveyTypes: [
        {
          label: "Standard Survey",
          value: "STANDARD"
        },
        {
          label: "Risk Assessment Survey",
          value: "RISK_ASSESSMENT"
        },
        {
          label: "ESG Goal Survey",
          value: "ESG_GOAL"
        },
        {
          label: "RWA Survey",
          value: "RWA"
        }
      ],
      respondentTypes: [
        "Farmer (Single response for all farms)",
        "Farmer (Separate response for each farm)",
        "Sub-Organization",
        "Supplier"
      ],
      supplierServiceTypes: [],
      enabled: false,
      score: false,
      survey: {
        orgId: null,
        userId: null,
        title: null,
        description: null,
        instructions: null,
        isDisabled: true,
        isScoreEnabled: false,
        type: "ESG_GOAL",
        respondentType: null,
        supplierServiceType: null,
        multiStepType: null,
        multiStepQuestionCount: null
      },
      multiStepSettings: {
        isMultiStep: false,
        multiStepType: 'Question',
        noOfQuestion: 0
      },
      rules: {
        title: [
          (v) => !!v || this.$t("errors.required"),
          (v) => (v && v.trim().length > 0) || this.$t("errors.required"),
          (v) => (v && v.length < 100) || this.$t("surveyBuilder.surveyTitleLength"),
        ],
        type: [
          (v) => !!v || this.$t("errors.required"),
          (v) => (v && v.trim().length > 0) || this.$t("errors.required"),
          (v) => this.surveyTypes.map((i) => i.value).includes(v)
        ]
      },
      unselectedUesg_goal_surveyser: [],
      filterParams: {}
    };
  },
  components: {
    'quill-editor': quillEditor
  },
  computed: {
    dialog() {
      return this.dialogI;
    },
    computedMultiStepValue: {
      get() {
        return this.checkMultiStepEnable;
      },
      set(value) {
        this.multiStepSettings.isMultiStep = value;
      }
    }
  },
  props: {
    dialogI: {
      type: Boolean,
      required: true,
    },
    updateData: {
      required: false,
      type: Object
    },
    hasQuestions: {
      required: false,
      type: Boolean
    },
    fromAddGoals: {
      required: false,
      type: Boolean
    }
  },
  created() { },
  mounted() {
    let userInfo = JSON.parse(localStorage.getItem("user"));
    this.loggedInUser = userInfo.id;
    this.orgId = userInfo.user_organization.id;
    if (this.$props.updateData && Object.keys(this.$props.updateData).length && this.$props.updateData.title !== 'Loading...') {
      this.survey = this.$props.updateData;
    }

    if (this.updateData) {
      this.survey.type = "ESG_GOAL"; // Static field, Remove later
      this.enabled = !this.updateData.isDisabled;
      this.score = this.updateData.isScoreEnabled;
      this.multiStepSettings.isMultiStep = this.updateData.multiStepType !== null;
      this.multiStepSettings.multiStepType = this.updateData.multiStepType;
      this.multiStepSettings.noOfQuestion = this.updateData.multiStepQuestionCount;
    }
  },
  methods: {
    quillOptions(placeholder) {
      return {
        theme: 'snow',
        placeholder,
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ header: [1, 2, 3, false] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ color: [] }, { background: [] }],
            ['clean']
          ]
        }
      }
    },
    flipDisabled() {
      this.survey.isDisabled = !this.enabled;
    },
    handleMultiStepChange(isMultiStep) {
      this.multiStepSettings.isMultiStep = isMultiStep;
    },
    async saveNewSurvey() {
      try {
        if (!this.$refs.addNewSurvey.validate()) {
          this.$notify({
            title: "Validation Failed. Add all mandatory fields",
            type: "error",
          });
          return;
        }

        if (
          this.multiStepSettings.isMultiStep &&
          this.multiStepSettings.multiStepType === "Question" &&
          this.multiStepSettings.noOfQuestion > 99
        ) {
          this.$notify({
            title: "Question should be less than 100",
            type: "error",
          });
          return;
        }

        this.survey = {
          ...this.survey,
          isScoreEnabled: this.score,
          orgId: this.orgId,
          createdBy: this.loggedInUser
        };

        if (this.multiStepSettings.isMultiStep) {
          this.survey.multiStepType = this.multiStepSettings.multiStepType;
          this.survey.multiStepQuestionCount = this.multiStepSettings.noOfQuestion;
        }

        this.startLoading();

        if (this.updateData) {
          const { _id, __v, ...payload } = this.survey;
          EsgService.updateAssessment(this.updateData._id, payload).then((data) => {
            if (!data.success) {
              console.error(data.message);
              this.$notify({
                title: "Error creating assessment",
                type: "error",
              });
              this.stopLoading();
              return;
            }

            this.$notify({
              title: "Updated survey successfully!",
              type: "success",
            });
            this.$router.push({
              name: "ESGSurveyDetails",
              params: { id: data.data._id },
            });
            this.stopLoading();
          }).catch((err) => {
            console.error(err);
            this.$notify({
              title: "Error creating assessment",
              type: "error",
            });
            this.stopLoading();
            return;
          });
        } else {
          EsgService.createAssessment(this.survey).then((data) => {
            if (!data.success) {
              console.error(data.message);
              this.$notify({
                title: "Error creating assessment",
                type: "error",
              });
              this.stopLoading();
              return;
            }

            if (this.fromAddGoals) {
              this.$emit("surveyCreated", { surveyId: data.data._id });
              this.$emit("closeModal");
            } else {
              this.$router.push({
                name: "ESGSurveyDetails",
                params: { id: data.data._id },
              });
            }
            this.stopLoading();
          }).catch((err) => {
            console.error(err);
            this.$notify({
              title: "Error creating assessment",
              type: "error",
            });
            this.stopLoading();
            return;
          })
        }

      } catch (err) {
        console.error(err);
        this.$notify({
          title: "Error creating assessment",
          type: "error",
        });
        this.stopLoading();

        return;
      }
      this.closeModal();
    },
    fetchSupplierServiceType() {
      if (this.survey.respondentType === "Supplier") {
        EsgService.getSupplierServiceTypes().then((data) => {
          if (!data.success) {
            this.$notify({
              title: "Failed to fetch supplier service type",
              type: "error",
            });
            return;
          }

          this.supplierServiceTypes = data.data;
        });
      }
    },
    closeModal() {
      this.$emit("closeModal");
      this.mode = "start";
    },
  },
  mixins: [loadingMixin],
};
</script>

<style scoped lang="scss">
.question-label {
  display: flex;
  align-items: center;
  width: 80%;
}

.question-input {
  width: 20%;
  align-items: center;
  margin-left: 10px;
  margin-right: 20px;
}

.soft-hr {
  color: #eee0;
  background-color: #eee;
  margin: 1rem 0;
}
</style>
