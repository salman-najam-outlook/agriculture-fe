<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-8">
        <div>
          <h2>{{ $t("surveyBuilder.surveyBuilder") }}</h2>
          <p class="mt-4">
            <b>{{ $t("esgPlatform.survey") }}:</b> {{ assessment ? assessment.title : 'Loading' }} <br />
            <br />
            <b v-if="goalTitle">{{ $t("esgPlatform.goalTitle") }}:</b>
            <span v-html="goalTitle"></span>
            <br />
            <b v-if="goalTargetYear">{{ $t("esgPlatform.goalTargetYear") }}:</b> {{ goalTargetYear }}
          </p>
        </div>
        <v-spacer></v-spacer>
        <v-btn depressed color="primary" dark class="mr-2" @click="goBack()">
          {{ $t("goBack") }}
        </v-btn>
        <v-btn depressed color="primary" dark class="mr-2" @click="showSettingDialog = true">
          {{ $t("surveyBuilder.settings") }}
        </v-btn>
        <!-- <v-btn depressed color="primary" dark class="mr-2" @click="showChangeSurveyDialog = true">
          Change Survey
        </v-btn> -->
        <v-btn depressed color="primary" dark
          class="mr-2" @click="openAddSubheading = true">
          {{ $t("dueDiligence.addSubHeading") }}
        </v-btn>
        <v-btn depressed color="primary" dark
          class="mr-2" @click="openQuestionDialog(false)">
          {{ $t("surveyBuilder.addQuestion") }}
        </v-btn>
      </div>
      <v-card elevation="0" class="pa-5 mt-4">
        <div>
          <div class="d-flex mt-5">
            <!-- <span style="width: 250px" class="shrink mr-4"></span> -->
            <span style="width: 250px" class="shrink mr-4">{{ $t("esgPlatform.heading") }}
              <v-tooltip top color="00BD73" max-width="350">
                <template v-slot:activator="{ on, attrs }">
                    <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                    mdi-alert-circle
                    </v-icon>
                </template>
                <span> {{ $t("esgPlatform.selectHeadingTooltip") }}</span>
              </v-tooltip>
            </span>
          </div>
          <!-- TODO -> search functionality -> search by questionHeading -->
          <div class="d-flex mt-5">
            <!-- <v-text-field id="assessment-name" prepend-inner-icon="mdi-magnify" outlined height="5px"
              placeholder="Search" dense class="shrink mr-4" style="width: 250px"
              v-model="search" @input="searchQuestion"></v-text-field> -->
            
            <v-select
              :items="assessment?.questionHeadings"
              placeholder="Select Heading"
              item-text="title"
              item-value="_id"
              dense 
              class="shrink mr-4" 
              outlined
              clearable
              v-model="selectedHeading"
              style="width: 250px"
            ></v-select>
          </div>
        </div>
        <v-card elevation="0" class="options primary mb-5">
          <v-card-title>
            <v-row>
              <v-col class="py-2 pl-15" cols="5">{{ $t("esgPlatform.questions") }}</v-col>
              <v-col class="py-2" cols="3">{{ $t("esgPlatform.type") }}</v-col>
              <v-col class="py-2" cols="3">{{ $t("esgPlatform.mandatory") }}</v-col>
              <v-col class="py-2" cols="1"></v-col>
            </v-row>
          </v-card-title>
        </v-card>
        <div v-if="assessment">
          <article class="heading-section mb-5" v-for="(nheading, i) in assessment.questionHeadings" :key="nheading._id">
            <div v-if="showHeading(nheading._id)">
              <v-card elevation="0" class="options dark mb-5">
                <v-card-text>
                  <v-row>
                    <v-col class="content-col" cols="5">
                      <v-row class="px-0 py-0">
                        <v-col cols="3">
                          <v-select
                            :items="headingOrders"
                            dense
                            class="shrink mr-4 bottomless" 
                            outlined
                            v-model="nheading.order"
                            @change="changeHeadingOrder(nheading)"
                            style="width: 70px;"
                            :disabled="headingOrders.length <= 1"
                          ></v-select>
                        </v-col>
                        <v-col cols="9" class="content-col">{{ nheading.title }}{{ nheading.targetYear ? ` - ${$t('esgPlatform.target')} ${nheading.targetYear}` : '' }}</v-col>
                      </v-row>
                    </v-col>
                    <v-col class="content-col align-right">
                      <v-btn x-small fab color="primary" outlined class="ml-2 bg-white" @click="openQuestionDialog(nheading)">
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                      <v-btn x-small fab color="primary" outlined class="ml-2 bg-white" @click="showEditHeading(nheading)">
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn x-small fab color="primary" outlined class="ml-2 bg-white" @click="openDeleteConfirmation(nheading._id)">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                      <v-btn x-small fab color="grey" elevation="0" class="ml-2 bg-none" @click="expandHeading(i)">
                        <v-icon v-if="headingsCollapsed[i]">mdi-menu-down</v-icon>
                        <v-icon v-else>mdi-menu-up</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <div v-if="!headingsCollapsed[i]">
                <v-card elevation="0" class="options questions mb-2" v-for="question in nheading.questions" v-bind:key="question._id">
                  <v-card-text class="pl-10">
                    <v-row>
                      <v-col class="content-col" cols="5">
                        <v-row class="px-0 py-0">
                          <v-col cols="3">
                            <v-select
                              :items="questionOrders[i]"
                              dense
                              class="shrink mr-4 bottomless" 
                              outlined
                              item-text="label"
                              item-value="value"
                              v-model="question.order"
                              @change="changeQuestionOrder(question)"
                              style="width: 90px;"
                              :disabled="questionOrders.length <= 1"
                            ></v-select>
                          </v-col>
                          <v-col cols="9" class="content-col">{{ question.title }}</v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="3" class="text-capitalize content-col">{{ question.questionType.replace("-", " ") }}</v-col>
                      <v-col cols="2" class="text-capitalize content-col">{{ question.isMandatory ? "Yes": "No" }}</v-col>
                      <v-col class="content-col align-right">
                        <v-btn x-small fab color="primary" outlined class="ml-2 bg-white" @click="showEditQuestion(question._id)">
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn x-small fab color="primary" outlined class="ml-2 bg-white" @click="openDeleteConfirmation(question._id, true)">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </div>
            </div>
          </article>
        </div>
      </v-card>
      <v-dialog v-model="openAddSubheading" width="40%" @click:outside="closeAddHeading()" :retain-focus="false">
        <v-card class="custom-card" rounded="0">
          <v-toolbar color="primary" class="white--text">
            <v-toolbar-title class="font-weight-bold">
              {{ selectedHeadingId ? $t('dueDiligence.editSubHeading'): $t('dueDiligence.addSubHeading') }}  
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon class="white--text" @click="closeAddHeading()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-form class="pa-4" ref="addNewSurveyHeading" lazy-validation autocomplete="off"
            v-model="addNewSurveyHeadingValid" @submit.prevent="addNewSurveyHeading">
            <v-card-text class="black--text">
              <label>{{ $t('dueDiligence.headingTitle') }}</label>
              <v-text-field v-model="heading" :rules="[v => !!v || 'This field is required.']" outlined dense>
              </v-text-field>
              <label>{{ $t('esgPlatform.target') }}</label>
              <v-select
                v-model="targetYear"
                :items="availableYears"
                :label="$t('esgPlatform.target')"
                outlined
                hide-details
                :rules="[
                  v => v !== null || 'Please select a target year',
                  v => parseInt(v) >= new Date().getFullYear() || 'Year must be in the future'
                ]"
              >
              </v-select>
              <v-card-actions class="mt-2" style="padding-right: 0">
                <v-spacer></v-spacer>
                <v-btn outlined class="px-4 mr-2" right depressed @click="closeAddHeading()" color="primary">
                  {{ $t("cancel") }}
                </v-btn>

                <v-btn type="submit" right class="px-4" color="primary">
                  {{ $t("submit") }}
                </v-btn>
              </v-card-actions>
            </v-card-text>
          </v-form>
        </v-card>
      </v-dialog>
      <ConfirmBox
        title="Confirmation"
        :message="headingDeleteConfirmation.text"
        :cancelBtnText="headingDeleteConfirmation.cancel"
        :confirmBtnText="headingDeleteConfirmation.confirm"
        :confirmData="headingDeleteConfirmation.data"
        :dialog="headingDeleteConfirmation.show"
        @cancel:action="clearConfirmation"
        @continue:action="deleteHeading"
      ></ConfirmBox>
      <ConfirmBox
        title="Confirmation"
        :message="questionDeleteConfirmation.text"
        :cancelBtnText="questionDeleteConfirmation.cancel"
        :confirmBtnText="questionDeleteConfirmation.confirm"
        :confirmData="questionDeleteConfirmation.data"
        :dialog="questionDeleteConfirmation.show"
        @cancel:action="clearConfirmation(true)"
        @continue:action="deleteQuestion"
      ></ConfirmBox>
      <EditSurveyWarning
        :dialog="showLiveSurveyEditWarning"
        :surveyId="assessmentId"
        @close="showLiveSurveyEditWarning = false"
        @proceed="proceedWithLiveEdit"
        @copy="duplicateSurvey"
      />
      <SurveyQuestion v-if="showAddSurveyQuestionDialog" :dialogI="showAddSurveyQuestionDialog"
        @closeDialog="closeQuestionDialog" @questionAdded="reloadAssessment" :selectedQuestion="selectedQuestionId"
        :isEdit="isQuestionEdit" :headings="assessment.questionHeadings" :selectedHeading="selectedHeadingForQuestion" :surveyId="assessmentId"/>
      <SurveySettings v-if="showSettingDialog" :dialogI="showSettingDialog" :updateData="assessment"
        @closeModal="showSettingDialog = false" :hasQuestions="hasQuestions"/>
    </v-container>
  </div>
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import SurveySettings from "./components/CreateSurvey.vue";
import SurveyQuestion from "./SurveyQuestion.vue";
import EsgService from "../../../_services/EsgService";
import ConfirmBox from "@/components/ConfirmBox.vue";
import EditSurveyWarning from './components/EditSurveyWarning.vue'

export default {
  components: {
    SurveySettings,
    SurveyQuestion,
    ConfirmBox,
    EditSurveyWarning
  },
  computed: {
    getAllQuestionListInput() {
      return {
        page: this.tableOptions.page,
        limit: this.tableOptions.itemsPerPage,
        search: this.search,
        assessmentId: parseInt(this.assessmentId),
      };
    },
    hasQuestions(){
      for (const h of this.assessment.questionHeadings) {
        if (h.questions.length > 0) {
          return true;
        }
      }

      return false;
    },
    goalName() {
      return this.goal || 'N/A'
    },
    availableYears() {
      const currentYear = new Date().getFullYear();
      const years = [];
      for (let i = currentYear; i <= currentYear + 20; i++) {
        years.push(i);
      }
      return years;
    },
  },
  data() {
    return {
      assessmentId: this.$route.params.id || null,
      goal: this.$route.params.goals || null,
      user: null,
      orgId: null,
      heading: "",
      targetYear: null,
      assessment: null,
      addNewSurveyHeadingValid: false,
      openAddSubheading: false,
      questions: [],
      search: "",
      questionLoading: false,
      showChangeSurveyDialog: false,
      showAddSurveyQuestionDialog: false,
      showEditSurveyQuestionDialog: false,
      showSettingDialog: false,
      isQuestionEdit: false,
      selectedQuestionId: null,
      selectHeading: null,
      headingsCollapsed: [],
      headingOrders: [],
      questionOrders: [],
      goalTitle: this.$route.params.goalTitle ? decodeURIComponent(this.$route.params.goalTitle) : "",
      goalTargetYear: this.$route.params.targetYear || null,
      lastExpandedHeadingId: null,
      breadcrumbs: [
      {
          text: this.$t("dashboard"),
          disabled: false,
          to: { name: "esgAccountDashboard" },
        },
        {
          text: this.$t("esgPlatform.surveyBuilder"),
          link: true,
          exact: true,
          disabled: false,
          to: { name: "ESGSurveyList" },
        },
        {
          text: this.$t("esgPlatform.surveyDetails"),
          link: true,
          exact: true,
          disabled: true,
        },
      ],
      headingDeleteConfirmation: {
        data: null,
        show: false,
        text: "Are you sure you want to delete this heading?",
        cancel: "Cancel",
        confirm: "Confirm"
      },
      questionDeleteConfirmation: {
        data: null,
        show: false,
        text: "Deleting this question will permanently remove all responses submitted by users across the enterprise and sub-enterprises. This will also impact the ESG progress linked to this question. This action cannot be undone. Do you want to proceed?",
        cancel: "Cancel",
        confirm: "Confirm"
      },
      showAddNewSurveyDialog: false,
      selectedHeadingId: null,
      selectedHeading: null,
      selectedHeadingForQuestion: null,
      showLiveSurveyEditWarning: false,
      selectedQuestionToEdit: null,
    };
  },

  created() {
    this.assessmentDetail();

    const user = JSON.parse(localStorage.getItem('user'));
    this.userId = user.id,
    this.orgId = user.user_organization.id;
  },

  watch: {
    '$route.params.id': {
      handler(newVal) {
        this.assessmentId = newVal;
        this.assessmentDetail();
      },
      immediate: true,
    },
    '$route.params.goalTitle': {
      handler(newVal) {
        this.goalTitle = newVal ? decodeURIComponent(newVal) : "";
      },
      immediate: true,
    },
    '$route.params.targetYear': {
      handler(newVal) {
        this.goalTargetYear = newVal || null;
      },
      immediate: true,
    }
  },

  methods: {
    closeQuestionDialog() {
      this.isQuestionEdit = false;
      this.showAddSurveyQuestionDialog = false;
      this.selectedHeadingForQuestion = null;
      this.selectedQuestionId = null;
      this.assessmentDetail(false);
    },
    createArrayUpTo(number) {
      let arr = [];
      for (let i = 1; i <= number; i++) {
        arr.push(i);
      }
      return arr;
    },
    closeAddHeading() {
      this.openAddSubheading = false;
      this.heading = "";
      this.targetYear = null;
      this.selectedHeadingId = null;
    },
    showEsgError(data) {
      this.$notify({
        text: data.message,
        type: "error",
      });
      this.stopLoading();
    },
    handleEsgResponse(data, callback) {
      if (!data.success) {
        this.$notify({
          text: data.message,
          type: "error",
        });
        this.stopLoading();
        return;
      }

      callback(data);
      this.stopLoading();
    },
    addNewSurveyHeading() {
      if (!this.$refs.addNewSurveyHeading.validate()) {
        return false;
      }

      this.startLoading();

      if (!this.assessment || !this.assessment.questionHeadings) {
        this.assessment = { questionHeadings: [] };
      }

      if(this.selectedHeadingId) {
        const updatePayload = {
          title: this.heading,
          targetYear: this.targetYear,
        }

        EsgService.updateQuestionHeading(this.selectedHeadingId, updatePayload)
          .then((data) => this.handleEsgResponse(data, ({ data }) => {
          this.$notify({
            text: `Heading updated: ${data.title}`,
            type: "success",
          });
          this.closeAddHeading();
          for (const heading of this.assessment.questionHeadings) {
            if (heading._id === data._id) {
              heading.title = data.title;
              heading.targetYear = data.targetYear;
            }
          }
          }))
        .catch((error) => {
          console.error('Error updating question sub-heading:', error);
          this.assessment = { questionHeadings: [] };
        })
        .finally(() => {
          this.stopLoading();
        });
      }
      else {
        const headingPayload = {
          esgAssessmentId: this.assessmentId,
          title: this.heading,
          order: this.assessment.questionHeadings.length || 0,
          createdBy: this.userId,
          orgId: this.orgId,
          targetYear: this.targetYear,
        };

        EsgService.createQuestionHeading(headingPayload)
          .then((data) => this.handleEsgResponse(data, (data) => {
          this.$notify({
            text: `Created Heading Successfully: ${data.title}`,
            type: "success",
          });
          this.closeAddHeading();
          this.assessmentDetail();
        }))
        .catch((error) => {
          console.error('Error creating question sub-heading:', error);
          this.assessment = { questionHeadings: [] };
        })
        .finally(() => {
          this.stopLoading();
        });
      }

      this.heading = null;
      this.selectedHeadingId = null;
    },
    assessmentDetail(closeHeading = true) {
      this.assessment = null;
      this.questionOrders = [];
      this.headingOrders = [];
      this.headingsCollapsed = [];

      this.startLoading();
      EsgService.getAssessmentById(this.assessmentId)
        .then((data) => {
          if (!data || !data.data) {
            this.assessment = { questionHeadings: [] };
            return;
          }

          this.handleEsgResponse(data, (data) => {
            this.assessment = data.data || { questionHeadings: [] };

            for (let i = 0; i < this.assessment.questionHeadings.length; i++) {
              this.assessment.questionHeadings[i]['collapsed'] = true;
            }

            if (closeHeading) {
              this.headingsCollapsed = this.assessment.questionHeadings.map(() => true);
            } else {
              this.headingsCollapsed = this.assessment.questionHeadings.map((heading) => {
                return heading._id === this.lastExpandedHeadingId ? false : true;
              });
            }
            this.headingOrders = this.assessment.questionHeadings.map((_, i) => i + 1);
            for (const heading of this.assessment.questionHeadings) {
              this.questionOrders.push(heading.questions?.length > 0 ? heading.questions.map((q) => ({
                label: `${heading.order}.${q.order}`,
                value: q.order
              })) : []);
            }
          });
        })
        .catch((error) => {
          console.error('Error fetching assessment details:', error);
          if (error.data.code === 404) {
            this.$notify({
              text: "Assessment not found for id",
              type: "error",
            });
          }else {
            this.$notify({
              text: "Error fetching assessment details",
              type: "error",
            });
          }
          this.assessment = { questionHeadings: [] };
        })
        .finally(() => {
          this.stopLoading();
        });
    },
    triggerDeleteDialog(id, type) {
      this.deleteType = type;
      this.deleteSelection = id;
      this.showDeleteQuestionDialog = true;
    },
    questionTypeFormat(type) {
      const types = {
        "RADIO_BUTTON": this.$t("surveyBuilder.radioButton"),
        "DROPDOWN_OPTIONS": this.$t("surveyBuilder.dropDown"),
        "TEXT_FIELD":this.$t("surveyBuilder.textField"), 
        "TEXT_FIELD_NUMERIC":this.$t("surveyBuilder.textFieldNumeric"), 
        "TEXT_AREA":this.$t("surveyBuilder.textArea"), 
        "CHECK_BOXES":this.$t("surveyBuilder.checkBoxes"), 
        "FILE_ATTACHMENT":this.$t("surveyBuilder.fileAttachment"), 
        "DIGITAL_SIGNATURE":this.$t("surveyBuilder.digitalSignature"),
      };
      return types[type] || "N/A";
    },
    pageChange(t) {
      if (t) {
        this.tableOptions.page = this.tableOptions.page + 1;
      } else {
        this.tableOptions.page = this.tableOptions.page - 1;
      }
    },
    toSubmittedSurvey() {
      this.$router.push({
        name: "SurveySubmitted",
        params: { id: this.$route.params.id },
      });
    },
    closeDeleteDialog() {
      this.showDeleteQuestionDialog = false;
      this.deleteSelection = null;
      this.deleteType = null;
    },
    deleteQuestion() {
      if (this.questionDeleteConfirmation.data.id) {
        EsgService.deleteAssessmentQuestion(this.questionDeleteConfirmation.data.id)
          .then((data) => this.handleEsgResponse(data, (data) => {
            this.$notify({
              text: `Deleted Heading Successfully: ${data._id}`,
              type: "success",
            });
          }))
        .catch((error) => {
          console.error('Error deleting question:', error);
        })
        .finally(() => {
          this.assessmentDetail();
          this.stopLoading();
        });
      }
      this.clearConfirmation(true);
    },
    updateHeading(item) {
      this.selectedHeadingId = item.id;
      this.heading = item.title;
      this.targetYear = item.targetYear;
      this.openAddSubheading = true
    },
    openQuestionDialog(heading) {
      if (heading) {
        this.selectedHeadingForQuestion = heading._id;
      }
      this.showAddSurveyQuestionDialog = true;
    },
    goBack() {
      this.$router.push({ name: "ESGSurveyList" });
    },
    searchQuestion() {
      console.log("Filtering question...");
    },
    showEditHeading(heading) {
      this.selectedHeadingId = heading._id;
      this.heading = heading.title;
      this.targetYear = heading.targetYear ?? null;
      this.openAddSubheading = true;
    },
    deleteHeading() {
      if (this.headingDeleteConfirmation.data.id) {
        EsgService.deleteQuestionHeading(this.headingDeleteConfirmation.data.id).then((data) => this.handleEsgResponse(data, (data) => {
          this.$notify({
            text: `Deleted Heading Successfully: ${data._id}`,
            type: "success",
          });
        }));
      }
      this.clearConfirmation();
    },
    expandHeading(i) {
      this.headingsCollapsed = this.headingsCollapsed.map(() => true);
      this.$set(this.headingsCollapsed, i, false);
      this.lastExpandedHeadingId = this.assessment.questionHeadings[i]._id;
    },
    openDeleteConfirmation(id, isQuestion) {
      if (isQuestion) {
        this.questionDeleteConfirmation.data = { id };
        this.questionDeleteConfirmation.show = true;
        return;
      }
      this.headingDeleteConfirmation.data = { id };
      this.headingDeleteConfirmation.show = true;
    },
    clearConfirmation(isQuestion) {
      if (isQuestion) {
        this.questionDeleteConfirmation.data = null,
        this.questionDeleteConfirmation.show = false;
      }
      this.headingDeleteConfirmation.data = null;
      this.headingDeleteConfirmation.show = false;
    },
    showEditQuestion(id) {
      this.selectedQuestionToEdit = id;
      this.showLiveSurveyEditWarning = true;
    },
    proceedWithLiveEdit() {
      this.selectedQuestionId = this.selectedQuestionToEdit;
      this.isQuestionEdit = true;
      this.showAddSurveyQuestionDialog = true;
      this.showLiveSurveyEditWarning = false;
    },
    duplicateSurvey() {
      this.showLiveSurveyEditWarning = false;
      this.startLoading();

      const payload = {
        title: `${this.assessment.title} (Copy)`,
      }

      EsgService.duplicateSurvey(this.assessmentId, payload)
        .then((res) => {
          if (res && res.success && res.data && res.data._id) {
            this.$notify({
              text: "Survey duplicated successfully",
              type: "success",
            });

            this.$router.push({
              name: "ESGSurveyDetails",
              params: { 
                id: res.data._id,
                goalTitle: encodeURIComponent(this.goalTitle || ''),
                targetYear: this.goalTargetYear || ''
              }
            });
          } else {
            this.$notify({
              text: "Failed to duplicate survey. Please try again.",
              type: "error",
            });
          }
        })
        .catch((err) => {
          console.error("Error duplicating survey:", err);
          this.$notify({
            text: "Something went wrong while duplicating the survey.",
            type: "error",
          });
        })
        .finally(() => {
          this.stopLoading();
        });
    },
    reloadAssessment() {
      this.showAddSurveyQuestionDialog = false;
      this.isQuestionEdit = false;
      this.selectedQuestionId = null;
      this.selectedHeadingForQuestion = null;
      this.assessmentDetail();
    },
    changeHeadingOrder(heading) {
      const {_id: headingId, order} = heading;
      EsgService.updateQuestionHeading(headingId, { order }).then((data) => this.handleEsgResponse(data, (data) => {
        this.$notify({
          text: `Updated Heading Successfully: ${data.order}`,
          type: "success",
        });
      }));
    },
    changeQuestionOrder(question) {
      const {_id: questionId, order} = question;
      EsgService.updateAssessmentQuestion(questionId, { order }).then((data) => this.handleEsgResponse(data, (data) => {
        this.$notify({
          text: `Updated Question Successfully: ${data.order}`,
          type: "success",
        });
      }));
    },
    showHeading(id) {
      if (this.selectedHeading === null) return true;
      return id === this.selectedHeading;
    }
  },
  mixins: [loadingMixin],
};
</script>
<style lang="scss" scoped>
::v-deep .options .v-card__title {
  font-size: 1em;
  font-weight: 900;
  color: white;
  background-color: $primary-color;
  border-radius: 8px !important;
}

::v-deep .options .v_card__text{
  font-size: 1em;
  border-radius: 8px !important;
}

::v-deep .options.primary .v-card__title {
  background-color: $primary-color;
}

::v-deep .options.dark .v-card__text {
  background-color: #d6d6d6;
}

::v-deep .options.questions:nth-child(odd) .v-card__text {
  background-color: #f3f3f3;
}

::v-deep .options.questions:nth-child(even) .v-card__text {
  background-color: #fff;
}

.content-col {
  display: flex;
  align-items: center;

  &.align-right {
    justify-content: end;
  }
}

.bg-white {
  background-color: white !important;
}

.bg-none {
  background-color: transparent !important;
}

::v-deep .bottomless .v-input__slot {
  margin-bottom: 0 !important;
}

::v-deep .bottomless .v-messages {
  display: none !important;
}

::v-deep .bottomless .v-text-field__details {
  display: none !important;
}
</style>