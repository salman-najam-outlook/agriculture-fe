<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid v-if="!errorCode">
      <div class="d-flex mb-8">
        <div v-if="selectedSurvey && selectedSurvey.rows.length" style="width: 60%">
          <h2 class="text-capitalize">
            {{ selectedSurvey.rows[0].survey.title }}
            <span v-if="showView === 'responseDetail'">:
              {{ userSurveyResponse.surveyEntity.users.fullName }}
            </span>
          </h2>
          <small>{{ selectedSurvey.rows[0].survey.description }}</small>
        </div>
        <v-spacer></v-spacer>
        <div>
          <div class="d-flex flex-row-reverse">
            <v-btn depressed color="primary" dark @click="showView = 'responseList'" class="ml-3">
              {{ $t("surveyBuilder.responses") }}
            </v-btn>
            <v-btn
              v-if="selectedSurvey && selectedSurvey.rows[0].survey.status !== 'Completed'"
              depressed
              color="primary"
              dark
              class="ml-3"
              @click="showSettingDialog = true"
            >
              {{ $t("surveyBuilder.settings") }}
            </v-btn>
            <v-btn
              v-if="selectedSurvey && selectedSurvey.rows[0].survey.status !== 'Completed'"
              depressed
              color="primary"
              class="ml-3"
              @click="showAddSurveyQuestionDialog = true"
            >
              {{ $t("surveyBuilder.addQuestion") }}
            </v-btn>
            
            
          </div>
          <div>
            <div class="d-flex mt-3 justify-space-between align-center">
              <div class="text-center">
                <small class="text-uppercase">{{ $t("surveyBuilder.responses") }}</small><br />
                <span class="text-h3 font-weight-bold">{{
                  totalResponse || 0
                }}</span>
              </div>
              <v-btn
                v-ripple
                class="ml-2 py-8 font-weight-bold btn-width"
                color="primary"
                outlined
                dark
                @click="showView = 'responseSummary'"
                > {{ $t("surveyBuilder.allResponses") }} </v-btn
              >
              <v-btn
                class="ml-2 py-8 font-weight-bold btn-width"
                color="primary"
                outlined
                dark
                @click="showView = 'responseByQuestions'"
                >{{ $t("surveyBuilder.responseQuestion") }}</v-btn
              >
            </div>
          </div>
        </div>
      </div>
      <!-- TODO: need to move responseDetail and responseList to separate component -->
      <div v-if="showView === 'responseList'">
        <v-card id="responseDetailRows" v-if="selectedSurvey" flat class="mb-4 pa-4">
          <v-data-table 
            :headers="headers" 
            :items="selectedSurvey.rows" 
            :items-per-page="tableOptions.itemsPerPage" 
            :footer-props="{'items-per-page-options': [10, 25, 50],}"
            hide-default-footer
            :server-items-length="totalResponse"
            loading-text="Loading Responses..."
            :options.sync="tableOptions"
          >
            <template v-slot:top="{}">
              <div class="d-flex mt-5">
                <v-text-field prepend-inner-icon="mdi-magnify" outlined height="5px" :placeholder="$t('search')" dense
                  class="shrink"></v-text-field>
                <v-spacer></v-spacer>
                <div class="py-1 title">{{ from }} - {{ to }} {{ $t('of') }} {{ totalCount }}</div>
                <v-btn class="mx-2" fab small outlined color="primary" :disabled="tableOptions.page <= 1"
                  @click="pageChange(false)">
                  <v-icon dark> mdi-chevron-left </v-icon>
                </v-btn>
                <v-btn class="mx-2" fab small outlined color="primary" :disabled="tableOptions.page >= totalPages"
                  @click="pageChange(true)">
                  <v-icon dark> mdi-chevron-right </v-icon>
                </v-btn>
              </div>
            </template>
            <template v-if="selectedSurvey" v-slot:body="{ items }">
              <tbody>
                <tr v-for="item in items" :key="item.id" style="position: relative; width: 0; height: 0"
                  @mouseover="selectItem(item)" @mouseleave="selectItem(item)">
                  <td>{{ item.surveyEntity.users.fullName }} </td>
                  <td>{{ surveyFarmName(item) }} </td>
                  <td>{{ surveyFarmerName(item)  }} </td>
                  <td>{{ dateSubmitted(item.responseDate) }}</td>
                  <td class="text-center">
                    {{ item.questionAttemptedCount + "/" + item.totalQuestion }}
                  </td>
                  <td class="text-center">{{ item.survey.scoreSum }} </td>
                  <td class="text-center">
                    <div v-if="selectedItem ? selectedItem.id === item.id : false">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            x-small
                            fab
                            v-bind="attrs"
                            v-on="on"
                            class="ml-2"
                            :disabled="!item.responseDate"
                            :loading="detailLoadResponse === item.id"
                            @click="openDetailSurvey('responseDetail', item.uuid)">
                            <v-icon>mdi-magnify</v-icon>
                          </v-btn>
                        </template>
                        <span>{{ $t("view") }}</span>
                      </v-tooltip>
                    </div>
                  </td>
                </tr>
              </tbody>
            </template>
            <template v-slot:footer></template>
          </v-data-table>
        </v-card>
      </div>
      <div v-if="showView === 'responseDetail'">
        <v-card id="responseDetailRows" flat class="mb-4 pa-8">
          <div id="ttle-res" v-if="selectedSurvey && selectedSurvey.rows.length" style="width: 60%;display: none;">
            <h2 class="text-capitalize">
              {{ selectedSurvey.rows[0].survey.title }}
              <span v-if="showView === 'responseDetail'"
                >:
                {{ userSurveyResponse.surveyEntity.users.fullName }} 
              </span>
            </h2>
            <small>{{ selectedSurvey.rows[0].survey.description }}</small>
            <br> <br> 
          </div>
          <div class="d-flex mb-8 align-start">
            <div class="mr-8">
              <span><b>{{ $t("surveyBuilder.dateSubmitted") }}:</b> {{ dateSubmitted(userSurveyResponse.responseDate) }}</span> <br />
              <span><b>{{ $t("surveyBuilder.farm") }}:</b> {{ farmName }}</span> <br />
              <span><b>{{ $t("surveyBuilder.answer") }}:</b> {{ answer }}</span> <br />
            </div>
            <div v-if="totalScore !== null" class="text-center">
              <small>{{ $t("surveyBuilder.totalScore") }}</small><br />
              <span class="text-h3 font-weight-bold">{{ totalScore }}</span>
            </div>
          </div>
          <div
            v-for="survey in userSurveyResponse.survey.surveyQuestions"
            :key="survey.id"
          >
            <div class="d-flex justify-space-between mb-1">
              <div class="d-flex flex-column justify-space-between">
                <b>{{ survey.question }}</b>
                <div>
                  {{
                    survey.questionType === "dynamicFarmer" ? survey.surveyQuestionsResponse.map((r) => r.farm.fullName).join(", ") : ''
                  }}
                  {{
                    survey.questionType === "dynamicGeoFence" ? survey.surveyQuestionsResponse.map((r) => {
                      return r.geofence.geofenceName ? `${r.geofence.farms.farmName} - ${r.geofence.geofenceName}` : `${r.geofence.farms.farmName} - Geofence #${r.geofence.id}`
                    }).join(", ") : ''
                  }}
                  {{
                    survey.questionType === "dynamicCrop" ? survey.surveyQuestionsResponse.map((r) => r.crop.name).join(", ") : ''
                  }}
                  {{
                    survey.questionType === "dynamicEquipment" ? survey.surveyQuestionsResponse.map((r) => r.equipment.name).join(", ") : ''
                  }}
                  {{
                    survey.questionType === "checkbox" ? survey.surveyQuestionsResponse.map((r) => r.option.text || r.text ).join(", ") : ''
                  }}
                  {{
                    survey.questionType === "radio"
                      ? survey.surveyQuestionsResponse[0].option.text
                      : survey.surveyQuestionsResponse[0].text
                  }}
                </div>
              </div>
              <div v-if="survey.isQuestionScore" class="d-flex flex-column text-center">
                <small><b>{{ $t("surveyBuilder.score") }}</b></small>
                <span class="text-h4 font-weight-bold">{{ getScoreOfEachQuestion(survey) }}</span>
              </div>
            </div>
            <v-divider class="mb-6"></v-divider>
          </div>
        </v-card>
      </div>
      <div v-if="showView === 'responseSummary'">
        <response-summary />
      </div>
      <div v-if="showView === 'responseByQuestions'">
        <response-by-questions />
      </div>
      <div
        style="width: 40%; margin: 0px auto"
        v-if="showView === 'responseDetail'"
      >
        <v-btn
          block
          outlined
          depressed
          color="primary"
          dark
          @click="downloadPdf"
          >{{$t("downloadForReport")}}
        </v-btn>
      </div>
      <survey-question-dialog v-if="showAddSurveyQuestionDialog" :dialogI="showAddSurveyQuestionDialog"
        @closeDialog="showAddSurveyQuestionDialog = false" :isEdit="false" :surveyId="surveyId" />
      <add-new-survey-dialog v-if="showSettingDialog" :dialogI="showSettingDialog" :updateData="selectedSurvey"
        @closeDialog="showSettingDialog = false" />
    </v-container>
    <v-container v-else fluid>
      <v-card>
        <div class="py-16 text-center">
            <img src="/icons/nodata.svg" /><br />
            <strong class="red--text" v-if="errorCode === 404">
                {{ $t("noRecordFound") }}
            </strong>
            <strong class="red--text" v-else>
                {{ $t('failed') }}
            </strong>
        </div>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import moment from "moment";
import Breadcrumb from "@/components/core/Breadcrumb";
import loadingMixin from "@/mixins/LoadingMixin";
import DownloadMixin from "@/mixins/DownloadMixin";
import GeneralMixin from "@/mixins/GeneralMixin";
import SurveyBuilderService from "@/_services/SurveyBuilderService";
import SurveyQuestionDialog from "./SurveyQuestionDialog.vue";
import AddNewSurveyDialog from "./AddNewSurveyDialog.vue";
import ResponseSummary from "./ResponseSummary.vue";
import ResponseByQuestions from "./ResponseByQuestions.vue";

export default {
  components: {
    breadcrumb: Breadcrumb,
    SurveyQuestionDialog,
    AddNewSurveyDialog,
    ResponseSummary,
    ResponseByQuestions,
  },
  computed: {
    surveyId() {
      return this.$route.params.id;
    },
    farmName() {
      return (this.userSurveyResponse.farmId && this.userSurveyResponse.farms && this.userSurveyResponse.farms.name) || "No farm linked";
    },
    answer() {
      return `${this.userSurveyResponse.questionAttemptedCount} of ${this.userSurveyResponse.totalQuestion}`;
    },
    totalScore() {
      if(this.userSurveyResponse) {
        let isSurveyScore = false;
        const questions = this.userSurveyResponse.survey.surveyQuestions;
        let score = 0;
        for(let question of questions) {
          if(question.isQuestionScore) isSurveyScore = true;
          const questionScore = this.getScoreOfEachQuestion(question);
          if(questionScore) score += questionScore;
        }
        return isSurveyScore ? score : null;
      }
      return null;
    }
  },
  data() {
    return {
      errorCode: null,
      questions: [],
      from: 0,
      to: 10,
      totalPages: 1,
      totalResponse: 0,
      totalCount: 0,
      selectedSurvey: null,
      showDeleteSurveyDialog: false,
      showEditSurveyDialog: false,
      selectedItem: null,
      showAddSurveyQuestionDialog: false,
      showSettingDialog: false,
      detailLoadResponse: "",
      selectedUuid: '',
      userSurveyResponse: null,
      showView: "responseList",
      tableOptions: { 
        itemsPerPage: 10,
        page: 1,
      },
      headers: [
        {
          text: this.$t("surveyBuilder.userName"),
          align: "start",
          value: "userName",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("surveyBuilder.farmName"),
          align: "start",
          value: "farmName",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("surveyBuilder.farmerName"),
          align: "start",
          value: "farmerName",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("surveyBuilder.responseDate"),
          align: "left",
          value: "responseDate",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("surveyBuilder.question"),
          align: "center",
          value: "question",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("surveyBuilder.scores"),
          align: "center",
          value: "scores",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("surveyBuilder.viewSurvey"),
          align: "center",
          value: "viewSurvey",
          class: "black--text",
          sortable: false,
        },
      ],
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: false,
          to: "/",
        },
        {
          text: this.$t("surveyBuilder.surveyList"),
          link: true,
          exact: true,
          disabled: false,
          to: { name: "SurveyBuilder" },
        },
        {
          text: this.$t("surveyBuilder.surveyDetail"),
          link: true,
          exact: true,
          disabled: false,
          to: {
            name: "SingleSurveyList",
            params: { id: this.$route.params.id },
          },
        },
        {
          text: this.$t("surveyBuilder.surveysSubmitted"),
          link: true,
          exact: true,
          disabled: true,
        },
      ],
      showAddNewSurveyDialog: false,
    };
  },

  async mounted() {
    await this.getResponses();
  },
  watch: {

    'tableOptions.sortDesc':async function(nV, oV) {
      if(this.tableOptions.sortBy?.length && this.tableOptions.sortBy[0] == "scores") {
        this.selectedSurvey.rows = this.sortByNestedProperty(this.selectedSurvey.rows, "survey.scoreSum", (this.tableOptions.sortDesc?.length && this.tableOptions.sortDesc[0]) ? "desc" : "asc")
        return
      }
      else if(nV != oV ) {
        await this.getResponses()
      }
    }
  },
  methods: {
    async getResponses() {
      this.startLoading();
      const requestParams = {
        limit: this.tableOptions.itemsPerPage,
        page: this.tableOptions.page ?? 1,
        orderField: (this.tableOptions.sortBy?.length && this.tableOptions.sortBy[0]),
        order: (this.tableOptions.sortDesc?.length && this.tableOptions.sortDesc[0]) ? "DESC" : "ASC"
      }
      await SurveyBuilderService.getResponse(this.$route.params.id, requestParams).then(
        (res) => {
          if(res.success) {
            this.totalResponse = res?.data?.totalCount;
            this.totalCount = res?.data?.totalCount;
            this.totalPages = Math.ceil(this.totalCount / this.tableOptions.itemsPerPage)
            this.from = (this.tableOptions.page - 1) * this.tableOptions.itemsPerPage + 1
            this.to = (this.tableOptions.page * this.tableOptions.itemsPerPage) - (this.tableOptions.itemsPerPage - res.data.rows.length)
            this.selectedSurvey = res?.data;
          } else {
            this.errorCode = res.code;
          }
          this.stopLoading();
        }
      )
      .catch(() => {
        this.errorCode = 500;
      })
      .finally(() => {
        this.stopLoading();
      })
    },
    selectItem(item) {
      this.selectedItem = { ...item };
    },
    async pageChange(t) {
      if (t) {
        this.tableOptions.page = this.tableOptions.page + 1;
      } else {
        this.tableOptions.page = this.tableOptions.page - 1;
      }
      await this.getResponses();
    },
    async openDetailSurvey(viewName, id) {
      this.detailLoadResponse = id;
      await SurveyBuilderService.getResponseByUser(id, this.$route.params.id)
        .then((res) => {
          this.userSurveyResponse = res?.data?.result;
        })
        .catch((err) => console.error(err))
        .finally(() => {
          this.detailLoadResponse = "";
          this.selectedUuid = id;
          this.showView = viewName;
        });
    },
    dateSubmitted(date) {
      if (date) {
        return moment(date).format("DD/MM/YY") || "loading";
      } else {
        return "Survey in progress";
      }
    },
    surveyFarmName(data) {
      return data?.farms?.farmName || ''
    },
    surveyFarmerName(data) {
      return `${data?.farms?.farmerFirstName || '' } ${data?.farms?.farmerLastName || ''}`
    },
    surveyScore(data) {
      const uuid = data.uuid
      let score = 0
      data?.survey?.surveyQuestions?.forEach(question => {
        if(question.questionType === 'radio' || question.questionType === 'checkbox') {
          question?.surveyQuestionsResponse?.forEach(res => {
          if(res.surveyUserResponseEntityId === uuid) {
            score = score + res?.option?.scores || 0
          }
        })
        } else {
          score = score + question?.scores || 0
        }
        
      })
      return score || 0
    },
    async downloadPdf() {
      this.startLoading()
      await SurveyBuilderService.downloadResponseSurvey(this.selectedUuid)
      .then((res) => {
          this.downloadBlobFile(res, `${this.selectedSurvey.rows[0].survey.title}-${this.userSurveyResponse.surveyEntity.users.fullName}.pdf`)
        })
        .catch((err) => {
          console.error(err);
          this.stopLoading()
        })
      this.stopLoading()
    },
    getScoreOfEachQuestion(question) {
      if(question && question.isQuestionScore) {
        let score = 0;
        if(question.surveyQuestionsResponse && question.surveyQuestionsResponse.length > 0) {
          const isQuestionWithOptions = question.questionType === 'radio' || question.questionType === 'checkbox';
          if(isQuestionWithOptions) {
            for(let response of question.surveyQuestionsResponse) {
              if(response.option.scores) score += response.option.scores;
            }
          } else if(question.scores) {
            score += question.scores * question.surveyQuestionsResponse.length;
          }
        }
        return score;
      }
      return null;
    }
  },
  mixins: [loadingMixin, DownloadMixin, GeneralMixin],
};
</script>
<style lang="scss" scoped>
::v-deep .v-btn__content {
  white-space: normal;
  flex: auto;
}

::v-deep .btn-width {
  width: 140px;
}
</style>
