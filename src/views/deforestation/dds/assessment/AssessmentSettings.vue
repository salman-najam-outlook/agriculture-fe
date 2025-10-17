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
              <v-toolbar-title v-if="survey.id" class="font-weight-bold">
                {{ $t("dueDiligence.assessSettings") }}
              </v-toolbar-title>
              <v-toolbar-title v-else class="font-weight-bold">
                {{ $t("dueDiligence.assessSettings") }}
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
                    <label
                      >{{ $t("dueDiligence.assessmentTitle")
                      }}<span class="red--text">*</span></label
                    >
                    <v-tooltip top color="00BD73" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                            mdi-alert-circle
                            </v-icon>
                        </template>
                        <span>{{ $t("dueDiligence.assessmentTitleInfo") }}</span>
                    </v-tooltip>
                    <v-text-field
                      outlined
                      dense
                      id="dialog-link"
                      v-model="survey.title"
                      :rules="rules.title"
                      :placeholder="$t('dueDiligence.assessmentTitle')"
                    >
                    </v-text-field>

                    <label>{{ $t("dueDiligence.assessDescription") }} </label>
                    <v-tooltip top color="00BD73" max-width="350">
                      <template v-slot:activator="{ on, attrs }">
                          <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                          mdi-alert-circle
                          </v-icon>
                      </template>
                      <span>{{ $t("dueDiligence.assessDescriptionInfo") }}</span>
                  </v-tooltip>
                    <v-textarea
                      outlined
                      v-model="survey.description"
                      :rules="rules.description"
                      :placeholder="$t('dueDiligence.describeAsessment')"
                      name=""
                    >
                    </v-textarea>

                    <label>{{ $t("profileSetting.selectCountry") }}</label>
                    <v-tooltip top color="00BD73" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                            mdi-alert-circle
                            </v-icon>
                        </template>
                        <span>{{ $t("profileSetting.selectCountryInfo") }}</span>
                    </v-tooltip>
                    <v-select v-model="survey.countries" :items="countryDropdownItems" multiple
                        @change="handleCountrySelection" item-text="name" item-value="code" class="shrink"
                        :placeholder="$t('profileSetting.selectCountry')" clearable dense outlined>
                        <template v-slot:selection="{ item, index }">
                          <template v-if="index < 3">
                            <v-chip :key="item.code" small class="mr-2">
                              {{ item.name }}
                            </v-chip>
                          </template>
                          <template v-else-if="index === 3">
                            <span class="text-grey text-caption ml-2">
                              (+{{ survey.countries.length - 3 }} more)
                            </span>
                          </template>
                        </template>
                      </v-select>
                    <label>{{ $t("dueDiligence.expiryTime") }}</label>
                    <v-tooltip top color="00BD73" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                            mdi-alert-circle
                            </v-icon>
                        </template>
                        <span>{{ $t("dueDiligence.expiryTimeInfo") }}</span>
                    </v-tooltip>
                    <v-row no-gutters class="d-flex">
                      <v-col lg="7" md="7" sm="7" xs="6">
                        <v-text-field
                          v-model="expiryTime"
                          type="number"
                          placeholder="1"
                          outlined
                          dense
                          class="rounded-r-0"
                        ></v-text-field>
                      </v-col>
                      <v-col lg="5" md="5" sm="5" xs="6">
                        <v-select
                          :items="[
                           { id: 'days', text: $t('days') },
                           { id: 'months', text: $t('months') },
                          ]"
                          item-text="text"
                          item-value="id"
                          dense
                          outlined
                          class="bg rounded-l-0 white--text"
                          v-model="expiryTimePeriod"
                          hide-details
                        ></v-select>
                      </v-col>
                    </v-row>

                    <div class="d-flex align-center justify-space-between">
                      <label>{{ $t("surveyBuilder.enableScheduling") }}
                        <v-tooltip top color="00BD73" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                              <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
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
                  </v-col>
                  <v-col :style="{ marginLeft: '30px' }">
                    <div class="d-flex justify-space-between">
                      <label>{{ $t("dueDiligence.multiStepAssess") }}</label>
                      <v-tooltip top color="black" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon class="icon-with-background primary--text" v-bind="attrs" v-on="on"
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
                              <v-icon class="icon-with-background primary--text" v-bind="attrs" v-on="on"
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
                    <hr />
                    <div class="d-flex justify-space-between pt-4">
                      <label>{{ $t("dueDiligence.assessmentStatus") }}</label>
                      <v-tooltip top color="black" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon class="icon-with-background primary--text" v-bind="attrs" v-on="on"
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
                    <hr />
                    <div class="mb-4">
                      <div class="d-flex justify-space-between pt-4">
                        <label>{{ $t("surveyBuilder.selectUsers") }}</label>
                        <v-tooltip top color="black" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon
                              class="icon-with-background primary--text"
                              v-bind="attrs"
                              v-on="on"
                            >
                              mdi-information
                            </v-icon>
                          </template>
                          <span>{{
                            $t("surveyBuilder.selectUsersDetails")
                          }}</span>
                        </v-tooltip>
                      </div>
                      <v-switch inset
                        :label="
                          survey.isApplicableToSelectedUsersOnly
                            ? $t('surveyBuilder.enabled')
                            : $t('surveyBuilder.disabled')
                        "
                        v-model="survey.isApplicableToSelectedUsersOnly"
                        :disabled="disableUser"
                      >
                      </v-switch>
                      <v-btn
                        color="primary"
                        v-if="survey.isApplicableToSelectedUsersOnly"
                        @click="openUsersDialog"
                        :disabled="disableUser"
                        :loading="loadingUsers"
                      >
                        {{ $t("surveyBuilder.selectUsers") }}
                      </v-btn>
                    </div>
                    <hr />
                    <div class="d-flex justify-space-between pt-4">
                      <label>{{ $t("dueDiligence.allowAssessment") }}</label>
                      <v-tooltip top color="black" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon class="icon-with-background primary--text" v-bind="attrs" v-on="on">
                            mdi-information
                          </v-icon>
                        </template>
                        <span>{{
                          $t("surveyBuilder.linkWithFarmsDetails")
                        }}</span>
                      </v-tooltip>
                    </div>
                    <v-radio-group
                      v-model="survey.assessmentSettings.allowMultipleEntries"
                    >
                      <v-radio
                        :label="$t('dueDiligence.onlyIfExpired')"
                        color="primary"
                        value="AFTER_EXPIRY"
                        hide-details
                      ></v-radio>
                      <v-radio
                        :label="$t('dueDiligence.atAnyTime')"
                        color="primary"
                        value="ANY_TIME"
                        hide-details
                      ></v-radio>
                    </v-radio-group>
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
                    :disabled="
                      survey.isApplicableToSelectedUsersOnly &&
                        !surveySelectedUsers.length
                    "
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
    <select-survey-users-dialog
      v-if="showSelectSurveyUsersDialog"
      :dialogI="showSelectSurveyUsersDialog"
      :preCondition="preCondition"
      :selectedUsers="surveySelectedUsers"
      @closeDialog="showSelectSurveyUsersDialog = false"
      @userSelected="onUserSelected"
    />
  </v-container>
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import SurveyBuilderService from "@/_services/SurveyBuilderService";
import moment from "moment";
import SelectSurveyUsersDialog from "../../../survey-builder/SelectSurveyUsersDialog.vue";
import SurveyDateSelector from "@/views/avocado-trees/SurveyDateSelector.vue";
import { getCountries } from "country-state-picker";
import DeforestationService from "@/_services/DeforestationService";

export default {
  data() {
    return {
      allowToAnswer: "ifExpired",
      countryOptions: [],
      expiryTime: null,
      expiryTimePeriod: "months",
      showSelectSurveyUsersDialog: false,
      preCondition: {},
      toggleDateSelector: false,
      mode: "start",
      currentDate: "",
      loadingUsers: false,
      orgId: null,
      loggedInUser: null,
      survey: {
        orgId: null,
        userId: null,
        title: null,
        countries: [],
        description: null,
        status: "IN_ACTIVE",
        isApplicableToSelectedUsersOnly: false,
        assessmentSelectedUsers: [],
        assessmentSettings: {
          expiryDate: moment()
            .add(this.expiryTime, this.expiryTimePeriod)
            .format("DD-MMM-YYYY HH:mm:ss"),
          isScheduled: false,
          scheduleDate: null,
          scheduledEndDate: null,
          isMultiStep: false,
          multiStepType: 'QUESTIONS',
          noOfQuestion: 0,
          allowMultipleEntries: "ANY_TIME",
        },
      },
      surveySelectedUsers: [],
      rules: {
        title: [
          (v) => !!v || this.$t("errors.required"),
          (v) => (v && v.trim().length > 0) || this.$t("errors.required"),
          (v) => (v && v.length < 100) || this.$t("surveyBuilder.surveyTitleLength"),
        ],
      },
      isfFilteredUserSelected: false,
      unselectedUser: [],
      filterParams: {},
    };
  },
  components: {
    SelectSurveyUsersDialog,
    SurveyDateSelector,
  },
  watch: {
      'survey.countries'() { 
        this.$forceUpdate();
      }
    },
  computed: {
    countrySelectAllText() {
        return this.allCountriesSelected ? 'Deselect All' : 'Select All';
      },
      allCountriesSelected() {
        const allCountryCodes = this.countryOptions.map(c => c.code);
        return allCountryCodes.every(code => this.survey.countries.includes(code));
      },
      countryDropdownItems() {
        return [{ name: this.countrySelectAllText, code: 'ALL' }, ...this.countryOptions];
      },
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
    disableUser() {
      return (
        this.survey.status === "Completed" || this.survey.status === "Active"
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
      this.survey.assessmentSelectedUsers = this.$props.updateData.assessmentSelectedUsers.map(a => typeof a === 'object' ? a.userId : a).filter(Boolean);
      this.surveySelectedUsers = this.survey.assessmentSelectedUsers.map(a=>{return {id:a}})
    }
    this.calculateExpiryTime();
  },
  methods: {
    handleCountrySelection(selected) {
      const isAllClicked = selected.includes('ALL'); const allCountryCodes = this.countryOptions.map(c => c.code); if (isAllClicked) {
          if (this.allCountriesSelected) {
            this.survey.countries = []; // Deselect all 
          } else {
            this.survey.countries = allCountryCodes; // Select all 
          }
        } else {
          this.survey.countries = selected.filter(code => code !== 'ALL');
        } 
  },
    getCountryData(val) {
      this.survey.countries = val;
    },
    getCountry() {
      this.countryOptions = getCountries();
    },
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
        if ((this.expiryTime > 12 && this.expiryTimePeriod  === 'months') || (this.expiryTime > 365 && this.expiryTimePeriod  === 'days')) {
          this.$notify({
            title: "Expiry time should not be greater than 12 months or 365 days.",
            type: "error",
          });
          return;
        }
        this.survey.assessmentSettings.expiryDate = moment()
          .add(this.expiryTime, this.expiryTimePeriod)
          .format("DD-MMM-YYYY HH:mm:ss");
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
    async openUsersDialog() {
      try {
        this.loadingUsers = true;
        const res = await SurveyBuilderService.getSurveyUserAutoConditon();
        this.preCondition["id"] = res.data.id;
        this.preCondition["membership_type"] = res.data.membershipTypeId;
        this.preCondition["user_id"] = res.data.user_id;
        this.preCondition["membership_validity"] = res.data.membershipValidity;
        this.preCondition["account_progress"] = res.data.accountProgress;
        this.preCondition["membershipRemainingDays"] = res.data.remainingDays;
        this.preCondition["condtionStatus"] = res.data.condtionStatus;
        this.showSelectSurveyUsersDialog = true;
      } catch (err) {
        console.err(err);
      } finally {
        this.loadingUsers = false;
      }
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
        if ((this.expiryTime > 12 && this.expiryTimePeriod  === 'months') || (this.expiryTime > 365 && this.expiryTimePeriod  === 'days')) {
          this.$notify({
            title: "Expiry time should not be greater than 12 months or 365 days.",
            type: "error",
          });

          return;
        }
        this.survey.assessmentSettings.expiryDate = moment.utc()
          .add(this.expiryTime, this.expiryTimePeriod)
          .format("DD-MMM-YYYY HH:mm:ss");
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
    onUserSelected(value, allFlag, unselectedFilteredUser, filterParams) {
      this.showSelectSurveyUsersDialog = false;
      if (value != null) {
        const userIds = value.map((item) => item.id).filter(Boolean);
        this.survey.assessmentSelectedUsers = userIds;
        this.surveySelectedUsers = value;
      } else {
        this.survey.assessmentSelectedUsers = [];
      }
      this.isfFilteredUserSelected = allFlag;
      this.unselectedUser = unselectedFilteredUser;
      this.filterParams = filterParams;
    },
    closeModal() {
      this.$emit("closeModal");
      this.mode = "start";
      this.survey.isApplicableToSelectedUsersOnly = false;
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
    calculateExpiryTime() {
      if (this.survey.assessmentSettings.expiryDate) {
        const expiryDate = moment(this.survey.assessmentSettings.expiryDate);
        const currentDate = moment();

        const monthsDiff = expiryDate.diff(currentDate, 'months', true);
        const daysDiff = expiryDate.diff(currentDate, 'days');

        const roundedMonths = Math.round(monthsDiff);

        if (roundedMonths > 0 && Math.abs(monthsDiff - roundedMonths) < 0.1) {
          this.expiryTime = roundedMonths;
          this.expiryTimePeriod = 'months';
        } else {
          this.expiryTime = daysDiff + 1;
          this.expiryTimePeriod = 'days';
        }
      }
    }

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
</style>
