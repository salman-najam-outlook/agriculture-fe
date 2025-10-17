<template>
  <v-container>
    <template>
      <div>
        <v-dialog v-model="dialog" width="55%" persistent :retain-focus="false">
          <v-card class="custom-card" rounded="0">
            <v-toolbar color="primary" class="white--text">
              <v-toolbar-title v-if="survey.id" class="font-weight-bold">
                {{ $t("surveyBuilder.surveySettings") }}
              </v-toolbar-title>
              <v-toolbar-title v-else class="font-weight-bold">
                {{ $t("surveyBuilder.addNewSurvey") }}
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
                    <label>{{ $t("surveyBuilder.surveyTitle") }}<span class="red--text">*</span></label>
                    <v-text-field outlined dense id="dialog-link" v-model="survey.title" :rules="rules.title"
                      :placeholder="$t('surveyBuilder.surveyName')">
                    </v-text-field>

                    <label>{{ $t("surveyBuilder.surveyDescription") }}<span class="red--text">*</span></label>
                    <v-textarea outlined v-model="survey.description" :rules="rules.description"
                      :placeholder="$t('surveyBuilder.describeSurvey')" name="">
                    </v-textarea>

                    <div class="d-flex align-center justify-space-between">
                      <label>{{ $t("surveyBuilder.enableScheduling") }}</label>
                      <v-switch inset v-model="survey.isScheduled" :label="survey.isScheduled
                          ? $t('surveyBuilder.enabled')
                          : $t('surveyBuilder.disabled')">
                      </v-switch>
                    </div>
                    <div v-if="survey.isScheduled" class="d-flex flex-column">
                      <div class="mb-4 d-flex justify-space-between">
                        <span @click="openDateSelector('start')">
                          <v-icon size="20" color="primary">mdi-calendar-month</v-icon> {{ $t("surveyBuilder.startDate")
                          }}
                        </span>
                        <span>
                          {{ survey.scheduledDate }}
                        </span>
                      </div>
                      <div class="d-flex justify-space-between">
                        <span @click="openDateSelector('end')">
                          <v-icon size="20" color="primary">mdi-calendar-month</v-icon> {{ $t("surveyBuilder.endDate") }}
                        </span>
                        <span>
                          {{ survey.scheduledEndDate }}
                        </span>
                      </div>
                    </div>
                  </v-col>
                  <v-col :style="{ marginLeft: '30px' }">
                    <div class="d-flex justify-space-between">
                      <label>{{ $t("surveyBuilder.multiStepSurvey") }}</label>
                      <v-tooltip top color="black" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon class="green--text" v-bind="attrs" v-on="on">mdi-help-circle
                          </v-icon>
                        </template>
                        <span>{{ $t("surveyBuilder.multiStepSurveyDetails") }}</span>
                      </v-tooltip>
                    </div>
                    <v-switch inset :label="$t('surveyBuilder.multiStep')" v-model="survey.isMultistep">
                    </v-switch>
                    <div v-if="survey.isMultistep" class="d-flex justify-space-between">
                      <label>{{
                        $t("surveyBuilder.noQuestionEachStep")
                      }}</label>
                      <div :style="{ width: '20%' }">
                        <v-text-field type="number" :min="0" :rules="[
                          v => !!v || '',
                          v => v > 0 || '',
                        ]" v-model="survey.questionForEachStep" outlined>
                        </v-text-field>
                      </div>
                    </div>
                    <hr />
                    <div class="d-flex justify-space-between pt-4">
                      <label>{{ $t("surveyBuilder.surveyStatus") }}</label>
                      <v-tooltip top color="black" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon class="green--text" v-bind="attrs" v-on="on">mdi-help-circle
                          </v-icon>
                        </template>
                        <span>{{ $t("surveyBuilder.surveyStatusDetails") }}</span>
                      </v-tooltip>
                    </div>
                    <v-switch inset :label="survey.surveyStatus
                        ? $t('surveyBuilder.enabled')
                        : $t('surveyBuilder.disabled')
                      " v-model="survey.surveyStatus" :disabled="disableStatus">
                    </v-switch>
                    <hr />
                    <div class="mb-4">
                      <div class="d-flex justify-space-between pt-4">
                        <label>{{ $t("surveyBuilder.selectUsers") }}</label>
                        <v-tooltip top color="black" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon class="green--text" v-bind="attrs" v-on="on">
                              mdi-help-circle
                            </v-icon>
                          </template>
                          <span>{{ $t("surveyBuilder.selectUsersDetails") }}</span>
                        </v-tooltip>
                      </div>
                      <v-switch inset :label="survey.isSelectedUsers
                          ? $t('surveyBuilder.enabled')
                          : $t('surveyBuilder.disabled')
                        " v-model="survey.isSelectedUsers" :disabled="disableUser">
                      </v-switch>
                      <v-btn color="primary" v-if="survey.isSelectedUsers" @click="openUsersDialog"
                      :disabled="disableUser"
                        :loading="loadingUsers">
                        {{ $t("surveyBuilder.selectUsers") }}
                      </v-btn>
                    </div>
                    <hr />
                    <div class="d-flex justify-space-between pt-4">
                      <label>{{ $t("surveyBuilder.linkWithFarms") }}</label>
                      <v-tooltip top color="black" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon class="green--text" v-bind="attrs" v-on="on">
                            mdi-help-circle
                          </v-icon>
                        </template>
                        <span>{{ $t("surveyBuilder.linkWithFarmsDetails") }}</span>
                      </v-tooltip>
                    </div>
                    <v-switch inset :label="survey.linkedWithFarms
                        ? $t('surveyBuilder.enabled')
                        : $t('surveyBuilder.disabled')
                      " v-model="survey.linkedWithFarms">
                    </v-switch>
                  </v-col>
                </v-row>

                <v-divider class="mt-5"></v-divider>
                <v-card-actions class="mt-10" style="padding-right: 0">
                  <v-spacer></v-spacer>
                  <v-btn outlined class="mr-2" right height="44" width="116" depressed color="primary"
                    @click="closeModal">
                    {{ $t("cancel") }}
                  </v-btn>

                  <v-btn right class="px-4" color="primary" @click="editSurvey()" v-if="survey.id">
                    {{ $t("save") }}
                  </v-btn>

                  <v-btn right height="44" width="116" @click="saveNewSurvey()" v-else color="primary" :disabled=" survey.isSelectedUsers && !survey.surveySelectedUsers.length">
                    {{ $t("surveyBuilder.next") }}
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-form>
          </v-card>
        </v-dialog>
      </div>
    </template>
    <survey-date-selector :dialog="toggleDateSelector" :defaultDate="currentDate" :startDate="survey.scheduledDate"
      @closeDialog="toggleDateSelector = false" @setDate="setScheduleDate" />
    <SelectSurveyUsersDialog v-if="showSelectSurveyUsersDialog" :dialogI="showSelectSurveyUsersDialog"
      :preCondition="preCondition" :selectedUsers="survey.surveySelectedUsers"
      @closeDialog="showSelectSurveyUsersDialog = false" @userSelected="onUserSelected" />
  </v-container>
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import SurveyBuilderService from "@/_services/SurveyBuilderService";
import SelectSurveyUsersDialog from "./SelectSurveyUsersDialog.vue";
import SurveyDateSelector from './SurveyDateSelector.vue';
import moment from "moment";

export default {
  data() {
    return {
      showSelectSurveyUsersDialog: false,
      preCondition: {},
      toggleDateSelector: false,
      mode: 'start',
      currentDate: '',
      loadingUsers: false,
      survey: {
        title: null,
        description: null,
        isScheduled: false,
        scheduledDate: null,
        scheduledEndDate: null,
        isMultistep: false,
        questionForEachStep: null,
        surveyStatus: false,
        isSelectedUsers: false,
        linkWithFarms: false,
        surveySelectedUsers: [],
        users: [],
        linkedWithFarms: false,
      },
      rules: {
        title: [
          v => !!v || this.$t('errors.required'),
          v => (v && v.length < 100) || this.$t("surveyBuilder.surveyTitleLength"),
        ],
        description: [
          v => !!v || this.$t('errors.required')
        ]
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
  computed: {
    dialog() {
      return this.dialogI;
    },
    disableStatus() {
      return !this.survey.id || this.survey.questions === 0 || this.survey.status === 'Completed';
    },
    disableUser() {
      return this.survey.status === 'Completed' || this.survey.status === 'Active';
    }
  },
  props: {
    dialogI: {
      type: Boolean,
      required: true,
    },
    updateData: {},
  },
  created() { },
  mounted() {
    if (this.$props.updateData) {
      this.survey = this.$props.updateData;
    }
  },
  methods: {
    async saveNewSurvey() {
      if (!this.$refs.addNewSurvey.validate()) return;
      if (this.survey.isScheduled) {
        if (!this.survey.scheduledDate) {
          return this.$notify({
            title: "Start Date is Required",
            type: "error",
          });
        }
        if (this.survey.scheduledDate && !this.survey.scheduledEndDate) {
          return this.$notify({
            title: "End Date is Required",
            type: "error",
          });
        }
        if (moment(this.survey.scheduledDate, 'YYYY-MM-DD').isAfter(moment(this.survey.scheduledEndDate, 'YYYY-MM-DD'))) {
          this.$notify({
            title: "End Date must be larger than Start Date",
            type: "error",
          });
        }
      }
      if (this.isfFilteredUserSelected) {
        this.survey = {
          ...this.survey,
          isfFilteredUserSelected: this.isfFilteredUserSelected,
          unselectedUser: this.unselectedUser,
          filterParams: this.filterParams,
        }
      }
      this.startLoading();
      await SurveyBuilderService.createNewSurvey(this.survey)
        .then((res) => {
          if (res.success == true) {
            this.stopLoading();
            this.closeModal();
            this.$emit("emitNewSurvey");
          } else {
            this.stopLoading();
            this.$notify({
              title: res.message.errors[0].msg,
              type: "error",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.stopLoading();
          this.closeModal();
        });
    },
    async openUsersDialog() {
      try {
        this.loadingUsers = true;
        const res = await SurveyBuilderService.getSurveyUserAutoConditon();
        this.preCondition['id'] = res.data.id;
        this.preCondition['membership_type'] = res.data.membershipTypeId;
        this.preCondition['user_id'] = res.data.user_id;
        this.preCondition['membership_validity'] = res.data.membershipValidity;
        this.preCondition['account_progress'] = res.data.accountProgress;
        this.preCondition['membershipRemainingDays'] = res.data.remainingDays;
        this.preCondition['condtionStatus'] = res.data.condtionStatus;
        this.showSelectSurveyUsersDialog = true;
      } catch (err) {
        console.err(err)
      } finally {
        this.loadingUsers = false;
      }
    },
    editSurvey() {
      if (!this.$refs.addNewSurvey.validate()) return;
      if (this.survey.isScheduled) {
        if (!this.survey.scheduledDate) {
          return this.$notify({
            title: "Start Date is Required",
            type: "error",
          });
        }
        if (this.survey.scheduledDate && !this.survey.scheduledEndDate) {
          return this.$notify({
            title: "End Date is Required",
            type: "error",
          });
        }
        if (moment(this.survey.scheduledDate, 'YYYY-MM-DD').isAfter(moment(this.survey.scheduledEndDate, 'YYYY-MM-DD'))) {
          this.$notify({
            title: "End Date must be larger than Start Date",
            type: "error",
          });
        }
      }
      this.startLoading();
      SurveyBuilderService.updateSurvey(this.survey)
        .then((res) => {
          console.log(res);
          this.stopLoading();
          this.closeModal();
          this.$emit("emitNewSurvey");
        })
        .catch((err) => {
          this.stopLoading();
          console.log(err);
        });
    },
    onUserSelected(value, allFlag, unselectedFilteredUser, filterParams) {
      this.showSelectSurveyUsersDialog = false;
      if (value != null) {
        const userIds = value.map((item) => item.id);
        this.survey.users = userIds;
        this.survey.surveySelectedUsers = value
      } else {
        this.survey.users = [];
      }
      this.isfFilteredUserSelected = allFlag;
      this.unselectedUser = unselectedFilteredUser;
      this.filterParams = filterParams;
    },
    closeModal() {
      this.$emit("closeDialog");
      this.mode = "start";
    },
    openDateSelector(type) {
      if (type === 'start' && this.survey.scheduledDate) {
        this.currentDate = this.survey.scheduledDate;
      } else if (type === 'end' && this.survey.scheduledEndDate) {
        this.currentDate = this.survey.scheduledEndDate;
      } else {
        this.currentDate = '';
      }
      this.mode = type;
      this.toggleDateSelector = true;
    },
    setScheduleDate(a) {
      if (this.mode === 'start') {
        this.survey.scheduledDate = a;
      } else if (this.mode === 'end') {
        this.survey.scheduledEndDate = a;
      }
    }
  },
  mixins: [loadingMixin],
};
</script>
  
<style></style>
  