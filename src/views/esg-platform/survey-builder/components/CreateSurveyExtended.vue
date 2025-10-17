<template>
    <v-container>
      <template>
        <div>
          <v-dialog
            v-model="dialog"
            width="55%"
            persistent
            :retain-focus="false"
          >
            <v-card class="custom-card" rounded="0">
              <v-toolbar color="primary" class="white--text">
                <v-toolbar-title class="font-weight-bold">
                  Add New Survey
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon class="white--text" @click="closeModal">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-toolbar>
              <v-form
                class="pa-4"
                ref="addNewSurvey"
                lazy-validation
                autocomplete="off" 
              >
                <v-card-text class="black--text">
                  <v-row>
                    <v-col :style="{ marginRight: '30px' }">
                      <label>Survey Type<span class="red--text">*</span>
                      </label>
                      <v-tooltip top color="00BD73" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                              <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                              mdi-alert-circle
                              </v-icon>
                          </template>
                          <span>Type of the Survey</span>
                      </v-tooltip>
                      <v-select
                        :items="surveyTypes"
                        :rules="rules.title"
                        item-text="label"
                        item-value="value"
                        dense
                        outlined
                        v-model="survey.type"
                        disabled
                      ></v-select>
  
                      <label>Survey Title<span class="red--text">*</span>
                      </label>
                      <v-tooltip top color="00BD73" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                              <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                              mdi-alert-circle
                              </v-icon>
                          </template>
                          <span>Title of the Survey</span>
                      </v-tooltip>
                      <v-text-field
                        outlined
                        dense
                        id="dialog-link"
                        v-model="survey.title"
                        :rules="rules.title"
                        placeholder="Survey Title"
                      >
                      </v-text-field>
  
                      <label>Survey Description</label>
                      <v-tooltip top color="00BD73" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                            mdi-alert-circle
                            </v-icon>
                        </template>
                        <span>Detailed description of the survey</span>
                      </v-tooltip>
                      <v-textarea
                        outlined
                        v-model="survey.description"
                        :rules="rules.description"
                        placeholder="Survey Description"
                        name=""
                      >
                      </v-textarea>
  
                      <div class="d-flex align-center justify-space-between">
                        <label>{{ $t("surveyBuilder.enableScheduling") }}
                          <v-tooltip top color="00BD73" max-width="350">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                mdi-alert-circle
                                </v-icon>
                            </template>
                            <span>{{ $t("surveyBuilder.enableSchedulingInfo") }}</span>
                        </v-tooltip>
                        </label>
                        
                        <v-switch inset
                          v-model="survey.assessmentSettings.isScheduled"
                          :label="
                            survey.assessmentSettings.isScheduled
                              ? $t('surveyBuilder.enabled')
                              : $t('surveyBuilder.disabled')
                          "
                        >
                        </v-switch>
                      </div>
                      <div
                        v-if="survey.assessmentSettings.isScheduled"
                        class="d-flex flex-column"
                      >
                        <div class="mb-4 d-flex justify-space-between">
                          <span @click="openDateSelector('start')">
                            <v-icon size="20" color="primary"
                              >mdi-calendar-month</v-icon
                            >
                            {{ $t("surveyBuilder.startDate") }}
                          </span>
                          <span>
                            {{ survey.assessmentSettings.scheduleDate }}
                          </span>
                        </div>
                        <div class="d-flex justify-space-between">
                          <span @click="openDateSelector('end')">
                            <v-icon size="20" color="primary"
                              >mdi-calendar-month</v-icon
                            >
                            {{ $t("surveyBuilder.endDate") }}
                          </span>
                          <span>
                            {{ survey.assessmentSettings.scheduledEndDate }}
                          </span>
                        </div>
                      </div>
                      <div class="d-flex align-center justify-space-between">
                        <label>Link with Farms
                          <v-tooltip top color="00BD73" max-width="350">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                mdi-alert-circle
                                </v-icon>
                            </template>
                            <span>Allow linking with farms</span>
                        </v-tooltip>
                        </label>
                        
                        <v-switch inset
                          v-model="survey.assessmentSettings.isLinkedWithFarms"
                          :label="
                            survey.assessmentSettings.isLinkedWithFarms
                              ? $t('surveyBuilder.enabled')
                              : $t('surveyBuilder.disabled')
                          "
                        >
                        </v-switch>
                      </div>
                    </v-col>
                    <v-col :style="{ marginLeft: '30px' }">
                      <div class="d-flex justify-space-between">
                        <label>{{ $t("dueDiligence.multiStepAssess") }}</label>
                        <v-tooltip top color="black" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon class="green--text" v-bind="attrs" v-on="on"
                              >mdi-information
                            </v-icon>
                          </template>
                          <span>{{
                            $t("dueDiligence.multiStepSurveyDetails")
                          }}</span>
                        </v-tooltip>
                      </div>
                      <v-switch inset
                        :disabled="computedMultiStepValue"
                        :label="$t('surveyBuilder.multiStep')"
                        v-model="this.survey.assessmentSettings.isMultiStep"
                        @change="handleMultiStepChange"
                      >
                      </v-switch>
                      <v-radio-group
                        v-if="this.survey.assessmentSettings.isMultiStep"
                        :disabled="computedMultiStepValue"
                        v-model="survey.assessmentSettings.multiStepType"
                      >
                        <v-radio
                          value="QUESTIONS"
                          :label="$t('dueDiligence.noQuestionEachStep')"
                        >
                          <template v-slot:label>
                            <div class="question-label" style="font-size: 14px;">
                              {{ $t("dueDiligence.multiStepQuestion1") }}
                              <v-text-field
                                type="number"
                                v-model="survey.assessmentSettings.noOfQuestion"
                                outlined
                                dense
                                class="question-input"
                              >
                              </v-text-field>
                            </div>
                            <label style="font-size: 14px;">{{
                              $t("dueDiligence.questions")
                            }}</label>
                            <v-tooltip top color="black" max-width="350">
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon class="green--text" v-bind="attrs" v-on="on"
                                  >mdi-information
                                </v-icon>
                              </template>
                              <span>{{
                                $t("dueDiligence.questionsInfo")
                              }}</span>
                            </v-tooltip>
                          </template>
                        </v-radio>
                        <v-radio value="HEADINGS">
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
                            <v-icon class="green--text" v-bind="attrs" v-on="on"
                              >mdi-information
                            </v-icon>
                          </template>
                          <span>{{
                            $t("surveyBuilder.surveyStatusDetails")
                          }}</span>
                        </v-tooltip>
                      </div>
                      <v-switch inset
                        :label="
                          survey.status
                            ? $t('surveyBuilder.enabled')
                            : $t('surveyBuilder.disabled')
                        "
                        v-model="survey.status"
                        true-value="ACTIVE"
                        false-value="IN_ACTIVE"
                        :disabled="disableStatus"
                      >
                      </v-switch>
  
                      <hr class="soft-hr" />
                      
                      <div class="d-flex justify-space-between pt-4">
                        <label>Survey Score</label>
                        <v-tooltip top color="black" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon class="green--text" v-bind="attrs" v-on="on"
                              >mdi-information
                            </v-icon>
                          </template>
                          <span>Allow scoring survey</span>
                        </v-tooltip>
                      </div>
                      <v-switch inset
                        :label="
                          survey.score === 'ENABLED'
                            ? $t('surveyBuilder.enabled')
                            : $t('surveyBuilder.disabled')
                        "
                        v-model="survey.score"
                        true-value="ENABLED"
                        false-value="DISABLED"
                      >
                      </v-switch>
  
                      <hr class="soft-hr" />
                      
                      <div class="d-flex justify-space-between pt-4">
                        <label>Survey Cooperatives</label>
                        <v-tooltip top color="black" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon class="green--text" v-bind="attrs" v-on="on"
                              >mdi-information
                            </v-icon>
                          </template>
                          <span>Allow selecting cooperatives</span>
                        </v-tooltip>
                      </div>
                      <v-switch inset
                        :label="
                          allowCooperatives
                            ? $t('surveyBuilder.enabled')
                            : $t('surveyBuilder.disabled')
                        "
                        v-model="allowCooperatives"
                      >
                      </v-switch>
  
                      <v-btn
                        class="mr-2"
                        right
                        color="primary"
                        v-if="allowCooperatives"
                        @click="selectCooperativesModal = true"
                      >
                        Select Cooperatives
                      </v-btn>
  
                    </v-col>
                  </v-row>
  
                  <v-divider class="mt-5"></v-divider>
                  <v-card-actions class="mt-10" style="padding-right: 0">
                    <v-spacer></v-spacer>
                    <v-btn
                      outlined
                      class="mr-2"
                      right
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
                      class="px-4"
                      color="primary"
                      @click="editSurvey()"
                      v-if="survey.id"
                    >
                      {{ $t("save") }}
                    </v-btn>
  
                    <v-btn
                      right
                      height="44"
                      width="116"
                      @click="saveNewSurvey()"
                      v-else
                      color="primary"
                    >
                      {{ $t("surveyBuilder.next") }}
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-form>
            </v-card>
          </v-dialog>
        </div>
      </template>
      <survey-date-selector
        :dialog="toggleDateSelector"
        :defaultDate="currentDate"
        :startDate="survey.assessmentSettings.scheduleDate"
        @closeDialog="toggleDateSelector = false"
        @setDate="setScheduleDate"
      />
      <SelectCooperatives
        @closeDialog="selectCooperativesModal = false"
        @cooperativesSelected="setSelectedCooperatives"
        :dialogI="selectCooperativesModal" 
        :isEdit="editSelectedCooperatives"
      />
    </v-container>
  </template>
  <script>
  import loadingMixin from "@/mixins/LoadingMixin";
  import moment from "moment";
  import SurveyDateSelector from "@/views/avocado-trees/SurveyDateSelector.vue";
  import DeforestationService from "@/_services/DeforestationService";
  import SelectCooperatives from "./SelectCooperatives.vue";
  
  export default {
    data() {
      return {
        allowCooperatives: false,
        editSelectedCooperatives: false,
        selectCooperativesModal: false,
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
        survey: {
          orgId: null,
          userId: null,
          title: null,
          countries: [],
          description: null,
          status: "IN_ACTIVE",
          score: "DISABLED",
          type: "ESG_GOAL",
          assessmentSettings: {
            isScheduled: false,
            isLinkedWithFarms: false,
            scheduleDate: null,
            scheduledEndDate: null,
            isMultiStep: false,
            multiStepType: 'QUESTIONS',
            noOfQuestion: 0,
            allowMultipleEntries: "ANY_TIME",
          },
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
        filterParams: {},
      };
    },
    components: {
      SurveyDateSelector,
      SelectCooperatives
    },
    computed: {
      dialog() {
        return this.dialogI;
      },
      disableStatus() {
        return (
          !this.survey.id ||
          this.survey.questions === 0 ||
          this.survey.status === "Completed"
        );
      },
      checkMultiStepEnable() {
        return (
          this.updateData?.assessmentQuestionHeading?.length > 0 ||
          this.updateData?.assessmentQuestions?.length > 0 ||
          this.hasQuestions
        );
      },
      computedMultiStepValue: {
        get() {
          return this.checkMultiStepEnable;
        },
        set(value) {
          this.survey.assessmentSettings.isMultiStep = value;
        }
      }
  
    },
    props: {
      dialogI: {
        type: Boolean,
        required: true,
      },
      updateData: {
        required:false,
        type:Object
      },
      hasQuestions: {
        required: false,
        type: Boolean
      }
    },
    created() {
    },
    mounted() {
      let userInfo = JSON.parse(localStorage.getItem("user"));
      this.loggedInUser = userInfo.id;
      this.orgId = userInfo.user_organization.id;
      this.getCountry();
      if (this.$props.updateData && Object.keys(this.$props.updateData).length && this.$props.updateData.title !== 'Loading...') {
        this.survey = this.$props.updateData;
      }
      this.calculateExpiryTime();
    },
    methods: {
      handleMultiStepChange(isMultiStep) {
        if (!isMultiStep) {
          this.survey.assessmentSettings.isMultiStep = false;
        }
        else{
          this.survey.assessmentSettings.isMultiStep = true;
        }
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
            this.survey.assessmentSettings.isMultiStep &&
            this.survey.assessmentSettings.multiStepType === "QUESTIONS" &&
            this.survey.assessmentSettings.noOfQuestion > 99
          ) {
            this.$notify({
              title: "Question should be less than 100",
              type: "error",
            });
            return;
          }
  
          if (this.survey.assessmentSettings.isScheduled) {
            if (!this.survey.assessmentSettings.scheduleDate) {
              this.$notify({
                title: "Start Date is Required",
                type: "error",
              });
              return;
            }
            if (
              this.survey.assessmentSettings.scheduleDate &&
              !this.survey.assessmentSettings.scheduledEndDate
            ) {
              this.$notify({
                title: "End Date is Required",
                type: "error",
              });
              return;
            }
            if (
              moment(
                this.survey.assessmentSettings.scheduleDate,
                "DD-MMM-YYYY"
              ).isAfter(
                moment(
                  this.survey.assessmentSettings.scheduledEndDate,
                  "DD-MMM-YYYY"
                )
              )
            ) {
              this.$notify({
                title: "End Date must be larger than Start Date",
                type: "error",
              });
              return;
            }
              this.survey.assessmentSettings.scheduleDate = moment(
                  this.survey.assessmentSettings.scheduleDate,
                  "DD-MMM-YYYY"
                )
              this.survey.assessmentSettings.scheduledEndDate = moment(
                  this.survey.assessmentSettings.scheduledEndDate,
                  "DD-MMM-YYYY"
                )
          }
          this.survey = {
            ...this.survey,
            orgId: this.orgId,
            userId: this.loggedInUser,
            assessmentSettings: {
              ...this.survey.assessmentSettings,
              noOfQuestion: +this.survey?.assessmentSettings?.noOfQuestion || 0,
            },
          };
   
          this.startLoading();
          await DeforestationService.createNewAssessment(this.survey)
            .then(({ data }) => {
              this.$router.push({
                name: "AssessmentDetails",
                params: { id: data.createNewAssessment.id },
              });
            })
            .catch((err) => {
              console.error(err);
            })
            .finally(() => {
              this.stopLoading();
            });
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
      async editSurvey() {
        try {
          if (!this.$refs.addNewSurvey.validate()) {
            this.$notify({
              title: "Validation Failed. Add all mandatory fields",
              type: "error",
            });
            return;
          }
          if (
            this.survey.assessmentSettings.isMultiStep &&
            this.survey.assessmentSettings.multiStepType === "QUESTIONS" &&
            this.survey.assessmentSettings.noOfQuestion > 99
          ) {
            this.$notify({
              title: "Question should be less than 100",
              type: "error",
            });
            return;
          }
          if (this.survey.assessmentSettings.isScheduled) {
            if (!this.survey.assessmentSettings.scheduleDate) {
              this.$notify({
                title: "Start Date is Required",
                type: "error",
              });
              return;
            }
            if (
              this.survey.assessmentSettings.scheduleDate &&
              !this.survey.assessmentSettings.scheduledEndDate
            ) {
              this.$notify({
                title: "End Date is Required",
                type: "error",
              });
              return;
            }
            if (
              moment(
                this.survey.assessmentSettings.scheduleDate,
                "DD-MMM-YYYY"
              ).isAfter(
                moment(
                  this.survey.assessmentSettings.scheduledEndDate,
                  "DD-MMM-YYYY"
                )
              )
            ) {
              this.$notify({
                title: "End Date must be larger than Start Date",
                type: "error",
              });
              return;
            }
  
            this.survey.assessmentSettings.scheduleDate = moment(
                  this.survey.assessmentSettings.scheduleDate,
                  "DD-MMM-YYYY"
                )
              this.survey.assessmentSettings.scheduledEndDate = moment(
                  this.survey.assessmentSettings.scheduledEndDate,
                  "DD-MMM-YYYY"
                )
          }
          this.survey = {
            ...this.survey,
            orgId: this.orgId,
            userId: this.loggedInUser,
            assessmentSettings: {
              ...this.survey.assessmentSettings,
              noOfQuestion: +this.survey?.assessmentSettings?.noOfQuestion || 0,
            },
          };
          delete this.survey.noOfQuestions;
          delete this.survey.isDefault;
          delete this.survey.noOfResponse;
          delete this.survey.totalHeadings;
          delete this.survey.totalQuestions;
          delete this.survey.assessmentQuestionHeading;
          delete this.survey.assessmentQuestions;
          this.startLoading();
          await DeforestationService.updateAssessment(this.survey);
          this.stopLoading();
  
          this.$notify({
            text: this.$t('deforestation.assessmentUpdatedSuccessfully'),
            type: "success",
          });
        } catch (err) {
          console.error(err);
          this.$notify({
            title: "Error updating assessment",
            type: "error",
          });
          return;
        }
        this.stopLoading();
  
        this.closeModal();
      },
      closeModal() {
        this.$emit("closeModal");
        this.mode = "start";
      },
      openDateSelector(type) {
        if (type === "start" && this.survey.assessmentSettings.scheduleDate) {
          this.currentDate = this.survey.assessmentSettings.scheduleDate;
        } else if (
          type === "end" &&
          this.survey.assessmentSettings.scheduledEndDate
        ) {
          this.currentDate = this.survey.assessmentSettings.scheduledEndDate;
        } else {
          this.currentDate = "";
        }
        this.mode = type;
        this.toggleDateSelector = true;
      },
      setScheduleDate(a) {
        if (this.mode === "start") {
          this.survey.assessmentSettings.scheduleDate = moment(
                a,
                "DD-MMM-YYYY"
              );
        } else if (this.mode === "end") {
          this.survey.assessmentSettings.scheduledEndDate =  moment(
                a,            
                "DD-MMM-YYYY"
              );
        }
      },
      setSelectedCooperatives(selectedCooperatives) {
        console.log(selectedCooperatives);
        this.selectCooperativesModal = false;
        console.log("Launch Cooperative Selector 3000...");
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
  