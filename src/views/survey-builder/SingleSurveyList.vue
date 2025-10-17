<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid v-if="selectedSurvey">
      <div class="d-flex mb-8">
        <div>
          <h2
            v-if="selectedSurvey && selectedSurvey.title"
            class="text-capitalize"
          >
            {{ selectedSurvey.title }}
          </h2>
          <p>
            {{ selectedSurvey.description }}
          </p>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          v-if="selectedSurvey.status !== 'Completed'"
          depressed
          color="primary"
          dark
          class="mr-2"
          @click="openQuestionDialog(false)"
        >
          {{ $t("surveyBuilder.addQuestion") }}
        </v-btn>
        <v-btn
          v-if="selectedSurvey.status !== 'Completed'"
          depressed
          color="primary"
          dark
          class="mr-2"
          @click="showSettingDialog = true"
        >
          {{ $t("surveyBuilder.settings") }}
        </v-btn>
        <v-btn v-if="selectedSurvey.responses > 0" depressed color="primary" dark @click="toSubmittedSurvey()">
          {{ $t("surveyBuilder.responses") }}
        </v-btn>
      </div>
      <v-card flat class="mb-4">
        <div class="pa-4">
          <v-row justify="center" align="center" v-if="questions.length === 0">
            <v-col cols="12" sm="4">
              <div class="py-16 text-center">
                <img src="/img/no-survey-list.svg" /><br />
                <strong class="red--text">
                  {{ $t("surveyBuilder.noQuestionFound") }}
                </strong><br />
                <div class="py-4">
                  <small>
                    {{ $t("surveyBuilder.createQuestion") }}
                  </small
                  >
                </div>
              </div>
            </v-col>
          </v-row>

          <v-data-table
            v-else
            :headers="headers"
            :items="questions"
            :items-per-page="10"
            :footer-props="{
              'items-per-page-options': [10, 25, 50],
            }"
            :header-props="headerProps"
            hide-default-footer
            :loading="questionLoading"
            :options.sync="tableOptions"
            :server-items-length="20"
            loading-text="Loading Questions..."
          >
            <template v-slot:top="{}">
              <div class="d-flex mt-5">
                <v-text-field
                  prepend-inner-icon="mdi-magnify"
                  outlined
                  height="5px"
                  :placeholder="$t('search')"
                  dense
                  class="shrink"
                  @input="searchQuestions"
                ></v-text-field>
                <v-spacer></v-spacer>
                <div class="py-1 title">{{ from }} - {{ to }} {{ $t('of') }} {{ totalQuestion }}</div>
                <v-btn class="mx-2" fab small outlined color="primary" 
                    :disabled="tableOptions.page<=1"
                    @click="pageChange(false)">
                  <v-icon dark> mdi-chevron-left </v-icon>
                </v-btn>
                <v-btn class="mx-2" fab small outlined color="primary"
                    :disabled="tableOptions.page>=totalPages"
                    @click="pageChange(true)">
                  <v-icon dark> mdi-chevron-right </v-icon>
                </v-btn>
              </div>
            </template>
            <template v-if="questions" v-slot:body="{ items }">
              <tbody>
                <tr
                  v-for="item in items"
                  :key="item.id"
                  style="position: relative; width: 0; height: 0"
                  @mouseover="selectItem(item)"
                  @mouseleave="selectItem(item)"
                >
                  <td>{{ item.question }}</td>
                  <td class="text-truncate">
                    {{ item.questionType || "N/A" }}
                  </td>
                  <td class="text-center">{{ item.mandatory ? "Yes" : "No" }}</td>
                  <td class="text-center">{{ item.surveyQuestionsResponse.length }}</td>
                  <div v-if="item.id === selectedItem.id && selectedSurvey.status !== 'Completed' " style="position: absolute; right: 10px; top: 5px">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          x-small
                          fab
                          v-bind="attrs"
                          v-on="on"
                          class="ml-2"
                          @click="showDeleteQuestionDialog = true"
                        >
                          <v-icon>mdi-trash-can</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t("delete") }}</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          x-small
                          fab
                          v-bind="attrs"
                          v-on="on"
                          class="ml-2"
                          @click="openQuestionDialog(true)"
                        >
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t("edit") }}</span>
                    </v-tooltip>
                  </div>
                </tr>
              </tbody>
            </template>
            <template v-slot:footer></template>
          </v-data-table>
        </div>
      </v-card>
      <v-dialog
        v-model="showDeleteQuestionDialog"
        width="40%"
        @click:outside="showDeleteQuestionDialog = false"
        :retain-focus="false"
      >
        <v-card class="custom-card" rounded="0">
          <v-toolbar color="primary" class="white--text">
            <v-toolbar-title class="font-weight-bold">
              {{ $t("surveyBuilder.question") }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn
              icon
              class="white--text"
              @click="showDeleteQuestionDialog = false"
            >
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
                <v-btn
                  outlined
                  class="px-4 mr-2"
                  right
                  depressed
                  @click="showDeleteQuestionDialog = false"
                  color="primary"
                >
                  {{ $t("cancel") }}
                </v-btn>

                <v-btn
                  right
                  class="px-4"
                  color="primary"
                  @click="deleteQuestion()"
                >
                  {{ $t("delete") }}
                </v-btn>
              </v-card-actions>
            </v-card-text>
          </v-form>
        </v-card>
      </v-dialog>
      <SurveyQuestionDialog
        v-if="showAddSurveyQuestionDialog"
        :dialogI="showAddSurveyQuestionDialog"
        @closeDialog="showAddSurveyQuestionDialog = false"
        @questionAdded="getResult"
        :selectedQuestion="selectedItem"
        :isEdit="isEdit"
        :selectedSurvey="selectedSurvey"
      />
      <AddNewSurveyDialog
        v-if="showSettingDialog"
        :dialogI="showSettingDialog"
        :updateData="selectedSurvey"
        @closeDialog="showSettingDialog = false"
      />
    </v-container>
    <v-container fluid v-if="!selectedSurvey && !mixingIsLoading">
      <v-card>
        <div class="py-16 text-center">
          <img src="/icons/nodata.svg" /><br />
          <strong class="red--text">
            {{ $t("noRecordFound") }}
          </strong>
        </div>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import Breadcrumb from "@/components/core/Breadcrumb";
import loadingMixin from "@/mixins/LoadingMixin";
import SurveyBuilderService from "@/_services/SurveyBuilderService";
import AddNewSurveyDialog from "./AddNewSurveyDialog.vue";
import SurveyQuestionDialog from "./SurveyQuestionDialog.vue";

export default {
  components: {
    breadcrumb: Breadcrumb,
    AddNewSurveyDialog,
    SurveyQuestionDialog,
  },
  computed: {},
  data() {
    return {
      questions: [],
      search: "",
      from: 0,
      to: 0,
      totalQuestion: 0,
      tableOptions: {
          sortBy: [],
          sortDesc: [],
      },
      totalPages: 1,
      questionLoading: false,
      debounce: null,
      selectedSurvey: null,
      showAddSurveyQuestionDialog: false,
      showDeleteQuestionDialog: false,
      showEditSurveyQuestionDialog: false,
      showSettingDialog: false,
      selectedItem: { id: 0 },
      isEdit: false,
      headerProps: {
        'sort-icon': 'mdi-menu-up'
      },
      headers: [
        {
          text: this.$t("surveyBuilder.questions"),
          align: "start",
          value: "question",
          class: "black--text",
        },
        {
          text: this.$t("surveyBuilder.type"),
          align: "start",
          value: "questionType",
          class: "black--text",
        },
        {
          text: this.$t("surveyBuilder.compulsory"),
          align: "center",
          value: "compulsory",
          class: "black--text",
          sortable: false,
        },
        {
          text: this.$t("surveyBuilder.responses"),
          align: "center",
          value: "responses",
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
          disabled: true,
        },
      ],
      showAddNewSurveyDialog: false,
    };
  },
  watch: {
    tableOptions: {
      async handler () {
        await this.getQuestions()
      },
      deep: true,
    },
  },

  async mounted() {
    this.startLoading();
    await this.getResult();
    this.stopLoading();
  },

  methods: {
    pageChange(t){
      if(t) {
        this.tableOptions.page = this.tableOptions.page+1
      } else {
        this.tableOptions.page = this.tableOptions.page-1
      }
    },
    toSubmittedSurvey() {
      this.$router.push({
        name: "SurveySubmitted",
        params: { id: this.$route.params.id },
      });
    },
    async getResult() {
      await this.getSurvey();
      if (this.selectedSurvey) {
        await this.getQuestions();
      }
    },
    async getSurvey() {
      await SurveyBuilderService.getSurvey(this.$route.params.id)
        .then((res) => {
          this.selectedSurvey = res?.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getQuestions() {
      this.questionLoading = true;
      const canSort = this.tableOptions.sortBy.length === 1 && this.tableOptions.sortDesc.length === 1;
      const requestParams = {
        page: this.tableOptions.page ?? 1,
        limit: this.tableOptions.itemsPerPage,
        search: this.search,
        orderField: canSort ? this.tableOptions.sortBy[0] : null,
        order: canSort ? this.tableOptions.sortDesc[0] ? 'ASC' : 'DESC' : null,
      };
      await SurveyBuilderService.getSurveyQuestions(this.$route.params.id, requestParams)
        .then((res) => {
          this.questions = res.data.rows;
          this.totalQuestion = res.data.count;
          this.totalPages = Math.ceil(this.totalQuestion/this.tableOptions.itemsPerPage)
          this.from = (this.tableOptions.page-1)*this.tableOptions.itemsPerPage+1
          this.to = (this.tableOptions.page*this.tableOptions.itemsPerPage)-(this.tableOptions.itemsPerPage-res.data.rows.length)
        })
        .catch((err) => {
          console.log(err);
        }).finally(() => {
          this.questionLoading = false;
        })
    },
    searchQuestions(val) {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(async () => {
        this.search = val;
        this.startLoading();
        await this.getQuestions();
        this.stopLoading();
      }, 700)
    },
    selectItem(item) {
      this.selectedItem = { ...item };
    },
    async deleteQuestion() {
       SurveyBuilderService.deleteSurveyQuestion(this.selectedItem.id)
        .then(() => {
          this.getResult();
          this.showDeleteQuestionDialog = false;
        })
        .catch(() => {
          this.showDeleteQuestionDialog = false;
          this.$notify({
            'title': 'At least one question is required for published survey',
            type: 'warn',
          })
        });
    },
    async editQuestion() {},
    openQuestionDialog(open) {
      this.isEdit = open;
      this.showAddSurveyQuestionDialog = true;
    },
  },
  mixins: [loadingMixin],
};
</script>
<style lang="scss" scoped>
::v-deep .v-data-table-header__icon {
  color: white !important;
}
</style>
