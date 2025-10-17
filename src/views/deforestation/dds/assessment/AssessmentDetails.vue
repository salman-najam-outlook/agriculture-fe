<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-8">
        <div>
          <h2 v-if="selectedSurvey && selectedSurvey.title" class="text-capitalize">
            {{ selectedSurvey.title }}
          </h2>
        </div>
        <v-spacer></v-spacer>
        <v-btn depressed color="primary" dark class="mr-2" @click="goBack()">
          {{ $t("goBack") }}
        </v-btn>
        <v-btn depressed v-if="assessment.assessmentSettings.multiStepType == 'HEADINGS'" color="primary" dark
          class="mr-2" @click="openAddSubheading = true">
          {{ $t("dueDiligence.addSubHeading") }}
        </v-btn>
        <v-btn depressed v-else-if="assessment.assessmentSettings.multiStepType == 'QUESTIONS'" color="primary" dark
          class="mr-2" @click="openQuestionDialog(false)">
          {{ $t("surveyBuilder.addQuestion") }}
        </v-btn>
        <v-btn depressed v-else color="primary" dark
          class="mr-2" @click="openQuestionDialog(false)">
          {{ $t("surveyBuilder.addQuestion") }}
        </v-btn>
        <v-btn depressed color="primary" dark class="mr-2" @click="showSettingDialog = true">
          {{ $t("surveyBuilder.settings") }}
        </v-btn>
      </div>
      <v-card elevation="0" class="px-5 mt-4">
        <div class="pa-4">
          <!-- <v-data-table :headers="headers" :items="questions" :items-per-page="10" :footer-props="{
            'items-per-page-options': [10, 25, 50],
          }" :header-props="headerProps" hide-default-footer :loading="questionLoading" :options.sync="tableOptions"
            :server-items-length=totalQuestions loading-text="Loading Questions...">
            <template v-slot:top="{ }">
              <div class="d-flex mt-5">
                <v-text-field id="assessment-name" prepend-inner-icon="mdi-magnify" outlined height="5px"
                  :placeholder="$t('dueDiligence.searchAssessment')" dense class="shrink mr-4" style="width: 250px"
                  v-model="search" @input="searchAssessment" @click:append="searchAssessment"></v-text-field>
                <v-spacer></v-spacer>
                <div class="py-1 title">
                  {{ from }} - {{ to }} of {{ totalQuestions }}
                </div>
                <v-btn class="mx-2" fab small outlined color="primary" :disabled="tableOptions.page <= 1"
                  @click="pageChange(false)">
                  <v-icon dark> mdi-chevron-left </v-icon>
                </v-btn>
                <v-btn class="mx-2" fab small outlined color="primary" :disabled="tableOptions.page >= totalPages"
                  @click="pageChange(true)"> -->
          <v-data-table :headers="headers" :items="questions" :items-per-page="10" :footer-props="{
            'items-per-page-options': [10, 25, 50],
          }" :header-props="headerProps" hide-default-footer :loading="questionLoading" :options.sync="tableOptions"
            :server-items-length=totalQuestions loading-text="Loading Questions..." :show-expand="true" item-key="id"
            :single-expand="false" item-value="index" :expanded.sync="expanded">

            <template v-slot:top="{ }">
              <div class="d-flex align-end">

                <div>
                  <v-text-field id="assessment-name" prepend-inner-icon="mdi-magnify" outlined height="5px"
                    dense class="shrink mr-4" style="width: 250px" :placeholder="$t('search')"
                    v-model="search" @input="searchAssessment" @click:append="searchAssessment"></v-text-field>
                </div>


                <div v-if="assessment.assessmentSettings.multiStepType == 'HEADINGS'">
                  <label>{{ $t("dueDiligence.subHeading") }}</label>
                  <v-select :items="headingsArray" v-model="selectHeading" item-text="title" item-value="id" dense clearable
                    outlined no-data-text="No heading found">
                  </v-select>
                </div>
                <v-spacer></v-spacer>
                <!-- TODO: QA said to remove it, but we gonna need this later -->
                <!-- <div class="py-1 pb-6 title">
                  {{ from }} - {{ to }} of {{ totalQuestions }}
                </div>
                <v-btn class="mx-2" style="marginBottom: 22px" fab small outlined color="primary"
                  :disabled="tableOptions.page <= 1" @click="pageChange(false)">
                  <v-icon dark> mdi-chevron-left </v-icon>
                </v-btn>
                <v-btn class="mx-2" style="marginBottom: 22px" fab small outlined color="primary"
                  :disabled="tableOptions.page >= totalPages" @click="pageChange(true)">
                  <v-icon dark> mdi-chevron-right </v-icon>
                </v-btn> -->
              </div>
            </template>
            <!-- <template v-if="questions" v-slot:body="{ items }">
              <tbody>
                <tr v-for="item in items" :key="item.id" style="position: relative; width: 0; height: 0"
                  @mouseover="selectItem(item)" @mouseleave="selectItem(item)">
                  <td>{{ item.title }}</td>
                  <td>{{ questionTypeFormat(item.assessmentQuestionType) || "N/A" }}</td>
                  <td class="text-center">
                    {{ item.mandatory ? "Yes" : "No" }}
                  </td>
                  <div v-if="item.id === selectedItem.id &&
                    selectedSurvey.status !== 'Completed'
                    " style="position: absolute; right: 10px; top: 5px">
                    <v-btn x-small fab color="primary" outlined class="ml-2" @click="showDeleteQuestionDialog = true">
                      <v-icon>mdi-trash-can</v-icon>
                    </v-btn>
                    <v-btn x-small fab color="primary" outlined class="ml-2" @click="openQuestionDialog(true)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </div>
                </tr>
              </tbody>
            </template> -->
            <template v-slot:item.title="{ item }">
              <div class="d-flex align-center">
                <v-select :items="createArrayUpTo(absoluteTotalQuestions)" v-model="item.order" filled outlined dense
                  hide-details style="max-width: 70px;"
                  @change="onOrderChange(item, item, assessment.assessmentSettings.multiStepType == 'HEADINGS')"
                  class="mr-4"></v-select>
                {{ item.title }}
              </div>
            </template>
            <template v-slot:item.assessmentQuestionType="{ item }">
              <div v-if="assessment.assessmentSettings.multiStepType != 'HEADINGS'">
                {{ questionTypeFormat(item.assessmentQuestionType) || "N/A" }}
              </div>

            </template>
            <template v-slot:item.isMandatory="{ item }">
              <div class="d-flex align-center justify-space-between">
                <div>
                  <span v-if="assessment.assessmentSettings.multiStepType != 'HEADINGS'">
                    {{ item.isMandatory ? $t('surveyBuilder.yes') : $t('surveyBuilder.no') }}
                  </span>
                </div>
                <div>
                  <v-btn v-if="assessment.assessmentSettings.multiStepType == 'HEADINGS'" x-small fab color="primary"
                    outlined class="ml-2" @click="addQuestionForSubheading(item.id)">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                  <v-btn v-if="assessment.assessmentSettings.multiStepType == 'HEADINGS'" x-small fab color="primary" outlined class="ml-2" @click="triggerDeleteDialog(item.id, 'headings')">
                    <v-icon>mdi-trash-can</v-icon>
                  </v-btn>
                  <v-btn v-else x-small fab color="primary" outlined class="ml-2" @click="triggerDeleteDialog(item.id, 'questions')">
                    <v-icon>mdi-trash-can</v-icon>
                  </v-btn>
                  <v-btn v-if="assessment.assessmentSettings.multiStepType == 'HEADINGS'" x-small fab color="primary" outlined class="ml-2" @click="updateHeading(item, 'headings')">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn v-else x-small fab color="primary" outlined class="ml-2" @click="editQuestion(item.id, 'questions')">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </div>
              </div>
            </template>
            <template  v-slot:expanded-item="{ item }">
              <td :colspan="headers.length" class="expansion">
                <!-- Expansion content -->
                <v-row v-for="subQ in item.assessmentQuestions" :key="subQ.id" class="alternate" dense>
                  <v-col v-for="header in headers" :key="header.text" :cols="header.width">
                    <div v-if="header.value !== 'data-table-expand'" class="d-flex align-center ml-12"
                      style="width: 100%;">
                      <v-select v-if="header.value === 'title'" :items="createArrayUpTo(item.assessmentQuestions.length)"
                        filled outlined dense hide-details v-model="subQ.order" @change="onOrderChange(subQ, item, false)"
                        style="max-width: 70px;" class="mr-4"></v-select>
                      <div v-if="header.value === 'assessmentQuestionType'" class=""
                        style="width: 100%; text-align: center; margin-left: 30%">
                        {{ questionTypeFormat(subQ[header.value])}}
                      </div>
                      <div v-else-if="header.value === 'isMandatory'" class="full-width">
                        <div class="d-flex align-center justify-space-around">
                          <div>
                            {{ subQ[header.value] === "Yes" ? $t('surveyBuilder.yes') : $t('surveyBuilder.no') }}
                          </div>
                          <div>
                            <v-btn x-small fab color="primary" outlined class="ml-2"
                              @click="triggerDeleteDialog(subQ.id, 'questions')">
                              <v-icon>mdi-trash-can</v-icon>
                            </v-btn>
                            <v-btn x-small fab color="primary" outlined class="ml-2" @click="editQuestion(subQ.id, 'questions')">
                              <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                          </div>
                        </div>
                      </div>
                      <div v-else class="">
                        {{ subQ[header.value] }}
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </td>
            </template>
            <template v-slot:footer></template>
          </v-data-table>
        </div>
      </v-card>
      <v-dialog v-model="showDeleteQuestionDialog" width="40%" @click:outside="showDeleteQuestionDialog = false"
        :retain-focus="false">
        <v-card class="custom-card" rounded="0">
          <v-toolbar color="primary" class="white--text">
            <v-toolbar-title class="font-weight-bold">
              {{ $t("surveyBuilder.question") }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon class="white--text" @click="showDeleteQuestionDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-form ref="addNewSurvey" lazy-validation autocomplete="off">
            <v-card-text class="black--text">
              <div>
                {{ $t("surveyBuilder.deleteQuestion") }}
              </div>

              <v-divider class="mt-5"></v-divider>
              <v-card-actions class="mt-10" style="padding-right: 0">
                <v-spacer></v-spacer>
                <v-btn outlined class="px-4 mr-2" right depressed @click="showDeleteQuestionDialog = false"
                  color="primary">
                  {{ $t("cancel") }}
                </v-btn>

                <v-btn right class="px-4" color="primary" @click="deleteQuestion()">
                  {{ $t("delete") }}
                </v-btn>
              </v-card-actions>
            </v-card-text>
          </v-form>
        </v-card>
      </v-dialog>
      <v-dialog v-model="openAddSubheading" width="40%" @click:outside="closeAddHeading()" :retain-focus="false">
        <v-card class="custom-card" rounded="0">
          <v-toolbar color="primary" class="white--text">
            <v-toolbar-title class="font-weight-bold">
            {{ selectedHeadingId? $t('dueDiligence.editSubHeading'): $t('dueDiligence.addSubHeading') }}  
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
      <assessment-question v-if="showAddSurveyQuestionDialog" :dialogI="showAddSurveyQuestionDialog"
        @closeDialog="closeSubheadingDialog" @questionAdded="getQuestions" :selectedQuestion="selectedItem"
        :isEdit="isEdit" :selectedSurvey="selectedSurvey" :headingsArray="headingsArray"/>
      <assessment-settings v-if="showSettingDialog" :dialogI="showSettingDialog" :updateData="selectedSurvey"
        @closeModal="showSettingDialog = false" :hasQuestions="hasQuestions"/>
    </v-container>
  </div>
</template>
<script>
import AssessmentSettings from "./AssessmentSettings.vue";
import AssessmentQuestion from "./AssessmentQuestion.vue";
import loadingMixin from "@/mixins/LoadingMixin";
import DeforestationSurveyBuilderService from "@/_services/DeforestationSurveyBuilderService";

export default {
  components: {
    AssessmentSettings,
    AssessmentQuestion,
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
      return this.questions?.length || 0;
    }
  },
  data() {
    return {
      assessmentId: this.$route.params.id || null,
      heading: "",
      assessment: { assessmentSettings: { multiStepType: 'QUESTIONS' } },
      addNewSurveyHeadingValid: false,
      openAddSubheading: false,
      questions: [],
      search: "",
      from: 0,
      to: 0,
      totalQuestions: 0,
      absoluteTotalQuestions: 0,
      tableOptions: {},
      totalPages: 1,
      questionLoading: false,
      debounce: null,
      selectedSurvey: {
        title: this.$t("loadingData"),
      },
      showAddSurveyQuestionDialog: false,
      showDeleteQuestionDialog: false,
      deleteSelection: null,
      deleteType: null,
      showEditSurveyQuestionDialog: false,
      showSettingDialog: false,
      selectedItem: { id: 0, headingId: null },
      isEdit: false,
      headerProps: {
        "sort-icon": "mdi-menu-up",
      },
      selectHeading: null,
      headingsArray: [],
      expanded: [],
      headers: [
        {
          text: this.$t("surveyBuilder.questions"),
          align: "start",
          value: "title",
          class: "black--text",
          width: 3,
        },
        {
          text: this.$t("surveyBuilder.type"),
          align: "start",
          value: "assessmentQuestionType",
          class: "black--text",
          width: 3,
        },
        {
          text: this.$t("surveyBuilder.mandatory"),
          align: "start",
          value: "isMandatory",
          class: "black--text",
          sortable: false,
          width: 6,
        },
        {
          text: "",
          align: "center",
          value: "data-table-expand",
        },
      ],
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: false,
          to: { name: "eudrDashboard" },
        },
        {
          text: this.$t("dueDiligence.assessment"),
          link: true,
          exact: true,
          disabled: false,
          to: { name: "AssessmentList" },
        },
        {
          text: this.$t("dueDiligence.assessmentDetail"),
          link: true,
          exact: true,
          disabled: false,
        },
      ],
      showAddNewSurveyDialog: false,
      selectedHeadingId: null
    };
  },
  watch: {
    tableOptions: {
      async handler() {
        await this.getQuestions();
      },
      deep: true,
    },
    selectHeading: {
      async handler(v) {
        if (v) {
          await this.changeHeading(v);
        } else {
          this.getQuestions();
        }
        
      },
      deep: true,
    },
    
  },

   created() {
     this.assessmentDetail();
     this.getQuestions();
  },

  methods: {
    addQuestionForSubheading(subheadingId) {
      this.selectedItem.headingId = subheadingId;
      this.showAddSurveyQuestionDialog = true;
    },
    closeSubheadingDialog() {
      this.isEdit = false;
      this.showAddSurveyQuestionDialog = false;
      if(this.selectedItem && this.selectedItem.headingId){
        this.selectedItem.headingId = null;
      }
    },
    changeHeading(headingId) {
      DeforestationSurveyBuilderService.findAllQuestionsOfAssessmentByHeadingId(parseInt(this.assessmentId),parseInt(headingId))
        .then((res) => {
          const questionsData = res.data.findAllQuestionsOfAssessmentByHeadingId.rows;
          this.questions = questionsData;

          this.totalQuestions = res.data.findAllQuestionsOfAssessmentByHeadingId.count;
          this.totalPages = Math.ceil(
            this.totalQuestions / this.tableOptions.itemsPerPage
          );
          this.from = (this.tableOptions.page - 1) * this.tableOptions.itemsPerPage + 1;
          this.to =
            this.tableOptions.page * this.tableOptions.itemsPerPage -
            (this.tableOptions.itemsPerPage -
              res.data.findAllQuestionsOfAssessmentByHeadingId.rows.length);

          this.stopLoading();
        })
        .catch((err) => {
          this.$notify({
            text: err,
            type: "error",
          });
          console.log(err);
          this.stopLoading();
        });
      
      //selectHeading
    },
    onOrderChange(item, assessment, isHeading) {
      this.startLoading();
      if (isHeading) {
        DeforestationSurveyBuilderService.reorderHeading(parseInt(this.assessmentId), item.id, item.order)
          .then(() => {
            this.$notify({
              text: this.$t('deforestaiton.headingOrderSuccessfullyUpdated'),
              type: "success",
            });
            this.getQuestions();
            this.stopLoading();
            this.closeAddHeading();
          })
          .catch((err) => {
            this.$notify({
              text: err,
              type: "error",
            });
            console.log(err);
            this.stopLoading();
          });
      } else {
        DeforestationSurveyBuilderService.reorderQuestion(parseInt(this.assessmentId), item.id, item.order)
          .then(() => {
            this.$notify({
              text: this.$t('deforestation.questionOrderSuccessfullyUpdated'),
              type: "success",
            });
            this.getQuestions();
            this.closeAddHeading();
          })
          .catch((err) => {
            this.$notify({
              text: err,
              type: "error",
            });
            console.log(err);
            this.stopLoading();
          });
      }
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
      this.selectedHeadingId = null;
    },
    addNewSurveyHeading() {
      if (!this.$refs.addNewSurveyHeading.validate()) {
        return false;
      }

      this.startLoading();
      if(this.selectedHeadingId){
        const updateHeadingPayload = {
          headingId: this.selectedHeadingId,
          title: this.heading
        }
        DeforestationSurveyBuilderService.updateQuestionHeading(updateHeadingPayload)
        .then(() => {
          this.$notify({
            text: this.$t("deforestation.headingUpdatedSuccessfully"),
            type: "success",
          });
          this.stopLoading();
          this.closeAddHeading();
        })
        .catch((err) => {
          this.$notify({
            text: err,
            type: "error",
          });
          console.log(err);
          this.stopLoading();
        }).finally(() => {
          this.getQuestions();
        })

      }
      else{
      const createAssessmentQuestionHeadingInput = {
        assessmentId: parseInt(this.assessmentId),
        title: this.heading
      }

      DeforestationSurveyBuilderService.createQuestionHeading(createAssessmentQuestionHeadingInput)
        .then(() => {
          this.$notify({
            text: this.$t("deforestation.headingCreatedSuccessfully"),
            type: "success",
          });
          this.stopLoading();
          this.closeAddHeading();
        })
        .catch((err) => {
          this.$notify({
            text: err,
            type: "error",
          });
          console.log(err);
          this.stopLoading();
        }).finally(() => {
          this.getQuestions();
        })
      }
    },
    assessmentDetail() {
      DeforestationSurveyBuilderService.assessmentDetail(parseInt(this.assessmentId))
        .then((res) => {
          this.assessment = res.data.assessmentDetail;
          this.selectedSurvey = res.data.assessmentDetail;
          this.getQuestions();
        })
        .catch((err) => {
          this.$notify({
            text: err,
            type: "error",
          });
          console.log(err);
        });
    },
    fetchQuestions() {
      DeforestationSurveyBuilderService.findAllQuestionsOfAssessment(this.getAllQuestionListInput)
        .then((res) => {
          this.questions = res.data.findAllQuestionsOfAssessment.rows;
          this.totalQuestions = res.data.findAllQuestionsOfAssessment.count;
          this.absoluteTotalQuestions = res.data.findAllQuestionsOfAssessment.totalCount;
          this.totalPages = Math.ceil(
            this.totalQuestions / this.tableOptions.itemsPerPage
          );
          this.from = (this.tableOptions.page - 1) * this.tableOptions.itemsPerPage + 1;
          this.to =
            this.tableOptions.page * this.tableOptions.itemsPerPage -
            (this.tableOptions.itemsPerPage -
              res.data.findAllQuestionsOfAssessment.rows.length);

          this.stopLoading();
        })
        .catch((err) => {
          this.$notify({
            text: err,
            type: "error",
          });
          console.log(err);
          this.stopLoading();
        });
    },
    getQuestions() {
      this.questionLoading = true;
      // this.startLoading();
      if (this.assessment.assessmentSettings.multiStepType == "QUESTIONS") {
        this.fetchQuestions();
      } else if (this.assessment.assessmentSettings.multiStepType == "HEADINGS") {
        DeforestationSurveyBuilderService.findAllQuestionsOfAssessmentByHeading(this.getAllQuestionListInput)
          .then((res) => {
            const questionsData = res.data.findAllQuestionsOfAssessmentByHeading.rows.map(question => ({
            ...question,
            assessmentQuestions: question.assessmentQuestions.map(assessmentQuestion => ({
              ...assessmentQuestion,
              isMandatory: assessmentQuestion.isMandatory ? 'Yes' : 'No'
            }))
          }));         
          this.questions = questionsData;
            this.totalQuestions = res.data.findAllQuestionsOfAssessmentByHeading.count;
            this.absoluteTotalQuestions = res.data.findAllQuestionsOfAssessmentByHeading.count;
            this.totalPages = Math.ceil(
              this.totalQuestions / this.tableOptions.itemsPerPage
            );
            this.from = (this.tableOptions.page - 1) * this.tableOptions.itemsPerPage + 1;
            this.to =
              this.tableOptions.page * this.tableOptions.itemsPerPage -
              (this.tableOptions.itemsPerPage -
                res.data.findAllQuestionsOfAssessmentByHeading.rows.length);
            this.stopLoading();
          })
          .catch((err) => {
            this.$notify({
              text: err,
              type: "error",
            });
            console.log(err);
            this.stopLoading();
          });

        DeforestationSurveyBuilderService.getAssessmentHeadingList(parseInt(this.assessmentId),this.search,)
          .then((res) => {
            this.headingsArray = res.data.getAssessmentHeadingList;
            this.stopLoading();
          })
          .catch((err) => {
            this.$notify({
              text: err,
              type: "error",
            });
            console.log(err);
            this.stopLoading();
          });
      }
      this.questionLoading = false;

    },
    triggerDeleteDialog(id, type) {
      this.deleteType = type;
      this.deleteSelection = id;
      this.showDeleteQuestionDialog = true;
    },
    searchAssessment() {
      this.tableOptions.page = 1;
      clearTimeout(this.debounce);
      this.debounce = setTimeout(async () => {
        this.getQuestions();
      }, 700)
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
    selectItem(item) {
      this.selectedItem = { ...item };
    },
    closeDeleteDialog() {
      this.showDeleteQuestionDialog = false;
      this.deleteSelection = null;
      this.deleteType = null;
    },
    async deleteQuestion() {
      if (this.deleteType === 'questions') {
        this.startLoading();
        DeforestationSurveyBuilderService.removeAssessmentQuestion(this.deleteSelection).then((res) => {
          if (res.data && !res.data.removeAssessmentQuestion) {
            this.$notify({
              text: this.$t("deforestation.failedToDeleteQuestion"),
              type: "error",
            });
          }
        }).catch((err) => {
          console.error(err);
        }).finally(() => {
          this.closeDeleteDialog();
          this.stopLoading();
          this.getQuestions();
        });
        return;
      }
      if (this.deleteType === 'headings') {
        this.startLoading();
        DeforestationSurveyBuilderService.removeAssessmentHeading(this.deleteSelection).then((res) => {
          if (res.data && !res.data.removeAssessmentHeading) {
            this.$notify({
              text: this.$t("deforestation.failedToDeleteQuestion"),
              type: "error",
            });
          }
        }).catch((err) => {
          console.error(err);
        }).finally(() => {
          this.closeDeleteDialog();
          this.stopLoading();
          this.getQuestions();
        });
        return;
      }
       this.$notify({
          text: this.$t("deforestation.questionTypeNotDefined"),
          type: "error",
        });
    },
    async editQuestion(questionId, type) {

      if(type === 'questions'){
      // Fetching detailed question object
      DeforestationSurveyBuilderService.findQuestionDetail(this.assessmentId, questionId).then((res) => {
        if (res.data && res.data.findQuestionDetail) {
          this.openQuestionDialog(true, res.data.findQuestionDetail);
        }
      })
    }
    },
    updateHeading(item){
    this.selectedHeadingId = item.id;
    this.heading = item.title;
    this.openAddSubheading = true
    },
    openQuestionDialog(open, selection = {}) {
      this.selectedItem = selection;
      this.isEdit = open;
      this.showAddSurveyQuestionDialog = true;
    },
    goBack() {
      this.$router.push({ name: "AssessmentList" });
    },
  },
  mixins: [loadingMixin],
};
</script>
<style lang="scss" scoped>
::v-deep .v-data-table-header__icon {
  color: white !important;
}

::v-deep .v-data-table>.v-data-table__wrapper tbody tr.v-data-table__expanded__content {
  box-shadow: none;
}

.alternate {
  padding: 8px;
}

.full-width {
  width: 80%;
}
</style>
