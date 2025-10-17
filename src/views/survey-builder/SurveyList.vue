<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-8">
        <h2 class="text-capitalize">{{ $t("surveyBuilder.surveyList") }}</h2>
        <v-spacer></v-spacer>
        <v-btn
          depressed
          color="primary"
          dark
          @click="showAddNewSurveyDialog = true"
        >
          {{ $t("surveyBuilder.createSurvey") }}
        </v-btn>
      </div>
      <v-card flat class="mb-4">
        <div class="text-center">
          <v-row justify="center" align="center" v-if="!surveys">
            <v-col cols="12" sm="4">
              <div class="py-16">
                <img src="/img/no-survey-list.svg" /><br />
                <strong class="red--text">{{ $t("surveyBuilder.noSurveyFound") }}</strong><br />
                <div class="py-4">
                  <small> {{ $t("surveyBuilder.createNewSurvey") }} </small>
                </div>
              </div>
            </v-col>
          </v-row>
          <div v-if="surveys" class="pa-4">
            <v-data-table
              :headers="headers"
              :items="surveys"
              :items-per-page="10"
              :footer-props="{
                'items-per-page-options': [10, 25, 50],
              }"
              :header-props="headerProps"
              hide-default-footer
              :loading="surveyLoading"
              :options.sync="tableOptions"
              :server-items-length="totalSurvey"
              loading-text="Loading Surveys..."
            >
              <template v-slot:top>
                <div class="d-flex mt-5">
                  <v-text-field
                    prepend-inner-icon="mdi-magnify"
                    outlined
                    height="5px"
                    :placeholder="$t('search')"
                    dense
                    class="shrink"
                    v-model="search"
                    @input="searchSurvey"
                    @click:append="searchSurvey"
                  ></v-text-field>
                  <v-spacer></v-spacer>
                  <div class="py-1 title">{{ from }} - {{ to }} {{$t('of')}} {{ totalSurvey }}</div>
                  <v-btn
                    class="mx-2"
                    fab
                    small
                    outlined
                    color="primary"
                    :disabled="tableOptions.page<=1"
                    @click="pageChange(false)"
                  >
                    <v-icon dark> mdi-chevron-left </v-icon>
                  </v-btn>
                  <v-btn class="mx-2" fab small outlined color="primary"
                    :disabled="tableOptions.page>=totalPages"
                    @click="pageChange(true)">
                    <v-icon dark> mdi-chevron-right </v-icon>
                  </v-btn>
                </div>
              </template>
              <template v-if="surveys" v-slot:body="{ items }">
                <tbody>
                  <tr
                    v-for="item in items"
                    :key="item.id"
                    style="position: relative; width: 0; height: 0"
                    @mouseover="selectItem(item)"
                    @mouseleave="selectItem(item)"
                  >
                    <td class="text-left text-truncate-title">{{ item.title }}</td>
                    <td class="text-truncate-desc text-left">
                      {{ item.description || "N/A" }}
                    </td>
                    <td class="col-question">{{ item.questions }}</td>
                    <td class="col-response">{{ item.responses }}</td>
                    <td :class="`text-left ${(item.status ==='Inactive' && !item.isScheduled) ? 'red--text' : ''}`">
                      {{ item.isScheduled && item.status ==='Inactive' ? $t('scheduled') : item.status === 'Active' ? $t('active') : $t('inactive') }}
                    </td>
                    <div
                      v-if="item === selectedItem"
                      style="position: absolute; right: 10px; top: 5px"
                    >
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          x-small
                          fab
                          color="primary"
                          v-bind="attrs"
                          v-on="on"
                          class="ml-2"
                          @click="$router.push({name:'DownloadSurveyHistory', params:{id:item.id}})"
                        >
                          <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                      </template>
                      <span>{{$t('Download Survey List')}}</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          x-small
                          fab
                          color="primary"
                          v-bind="attrs"
                          v-on="on"
                          class="ml-2"
                          @click="showDownload = true"
                        >
                          <v-icon>mdi-download</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t("surveyBuilder.downloadSurvey") }}</span>
                    </v-tooltip>
                    <v-tooltip v-if="!item.isScheduled && item.status === 'Inactive'" bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            x-small
                            fab
                            color="primary"
                            v-bind="attrs"
                            v-on="on"
                            class="ml-2"
                            :loading="publishingSurvey"
                            @click="publishSurvey(item, 'publish')"
                          >
                            <v-icon>mdi-play-circle</v-icon>
                          </v-btn>
                        </template>
                        <span>{{ $t("surveyBuilder.publishSurvey") }}</span>
                      </v-tooltip>
                      <v-tooltip v-if="!item.isScheduled && item.status === 'Active'" bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            x-small
                            fab
                            color="primary"
                            v-bind="attrs"
                            v-on="on"
                            class="ml-2"
                            :loading="publishingSurvey"
                            @click="publishSurvey(item, 'end')"
                          >
                            <v-icon>mdi-stop-circle</v-icon>
                          </v-btn>
                        </template>
                        <span>{{ $t("surveyBuilder.endSurvey") }}</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            x-small
                            fab
                            color="primary"
                            v-bind="attrs"
                            v-on="on"
                            class="ml-2"
                            @click="showCopySurveyDialog = true"
                          >
                            <v-icon>mdi-content-copy</v-icon>
                          </v-btn>
                        </template>
                        <span>{{ $t("surveyBuilder.copy") }}</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            v-if="item.status !== 'Completed'"
                            x-small
                            fab
                            color="primary"
                            v-bind="attrs"
                            v-on="on"
                            class="ml-2"
                            @click="editSurvey(item)"
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                        </template>
                        <span>{{ $t("edit") }}</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            x-small
                            fab
                            color="primary"
                            v-bind="attrs"
                            v-on="on"
                            @click="gotoSingleSurvey(item.id)"
                            class="ml-2"
                            ><v-icon>mdi-eye</v-icon></v-btn
                          >
                        </template>
                        <span>{{ $t("surveyBuilder.view") }}</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            x-small
                            fab
                            v-bind="attrs"
                            v-on="on"
                            class="ml-2"
                            @click="showDeleteSurveyDialog = true"
                          >
                            <v-icon>mdi-trash-can</v-icon>
                          </v-btn>
                        </template>
                        <span>{{ $t("delete") }}</span>
                      </v-tooltip>
                    </div>
                  </tr>
                </tbody>
              </template>
              <template v-slot:footer></template>
            </v-data-table>
          </div>
        </div>
      </v-card>
    </v-container>
    <v-dialog
      v-model="showErrorModal"
      width="50%"
      @click:outside="showErrorModal = false"
      :retain-focus="false"
    >
      <v-card class="custom-card" rounded="0">
         <v-toolbar dense color="red" class="white--text">
          <v-toolbar-title class="font-weight-bold">
            {{ $t("surveyBuilder.publishSurvey") }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            icon
            class="white--text"
            @click="showErrorModal = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="black--text">
          <div class="text-center mt-5">
            {{ $t("surveyBuilder.cannotPublish") }}
          </div>
          <v-divider class="mt-5"></v-divider>
          <v-card-actions class="mt-2" style="padding-right: 0">
              <v-spacer></v-spacer>
              <v-btn
                outlined
                class="px-4 mr-2"
                right
                depressed
                @click="showErrorModal = false"
              >
                {{ $t("ok") }}
              </v-btn>
            </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="showDeleteSurveyDialog"
      width="50%"
      @click:outside="showDeleteSurveyDialog = false"
      :retain-focus="false"
    >
      <v-card class="custom-card" rounded="0">
        <v-toolbar color="primary" class="white--text">
          <v-toolbar-title class="font-weight-bold">
            {{ $t("surveyBuilder.deleteSurvey") }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            icon
            class="white--text"
            @click="showDeleteSurveyDialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-form ref="addNewSurvey" lazy-validation autocomplete="off">
          <v-card-text class="black--text">
            <div>
              {{ $t("surveyBuilder.deleteSurveyWarn") }}
            </div>

            <v-divider class="mt-5"></v-divider>
            <v-card-actions class="mt-10" style="padding-right: 0">
              <v-spacer></v-spacer>
              <v-btn
                outlined
                class="px-4 mr-2"
                right
                depressed
                @click="showDeleteSurveyDialog = false"
                color="primary"
              >
                {{ $t("cancel") }}
              </v-btn>

              <v-btn right class="px-4" color="primary" @click="deleteSurvey()">
                {{ $t("surveyBuilder.deleteSurvey") }}
              </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-form>
      </v-card>
    </v-dialog>
    <AddNewSurveyListDialog
      v-if="showAddNewSurveyDialog"
      :dialogI="showAddNewSurveyDialog"
      @closeDialog="showAddNewSurveyDialog = false"
      @emitNewSurvey="getSurveys"
    />

    <AddNewSurveyListDialog
      v-if="showEditSurveyDialog"
      :dialogI="showEditSurveyDialog"
      :updateData="updateData"
      @closeDialog="showEditSurveyDialog = false"
      @emitNewSurvey="getSurveys"
    />
    <survey-copy-dialog :showDialog="showCopySurveyDialog" 
      @closeDialog="showCopySurveyDialog = false" @copySurvey="copySurvey"
      :selectedSurvey="selectedItem"
    />
    <survey-download :showDialog="showDownload" @closeDialog="showDownload = false" :selectedSurvey="selectedItem"/>
  </div>
</template>
<script>
import Breadcrumb from "@/components/core/Breadcrumb";
import loadingMixin from "@/mixins/LoadingMixin";
import AddNewSurveyListDialog from "./AddNewSurveyDialog";
import SurveyBuilderService from "@/_services/SurveyBuilderService";
import SurveyCopyDialog from './SurveyCopyDialog.vue';
import SurveyDownload from './SurveyDownload.vue';

export default {
  components: {
    breadcrumb: Breadcrumb,
    AddNewSurveyListDialog,
    SurveyCopyDialog,
    SurveyDownload,
  },
  computed: {},
  data() {
    return {
      surveys: [],
      search: '',
      from: 0,
      to:0,
      totalSurvey: 0,
      tableOptions: {},
      totalPages: 1,
      surveyLoading: false,
      showCopySurveyDialog: false,
      showDeleteSurveyDialog: false,
      showEditSurveyDialog: false,
      selectedItem: null,
      updateData: null,
      showErrorModal: false,
      publishingSurvey: false,
      headerProps: {
        'sort-icon': 'mdi-menu-up'
      },
      headers: [
        {
          text: this.$t("surveyBuilder.surveyName"),
          align: "start",
          value: "title",
          class: "black--text",
        },
        {
          text: this.$t("description"),
          value: "description",
          class: "black--text",
        },
        {
          text: this.$t("surveyBuilder.questions"),
          align: "center",
          value: "questions",
          class: "black--text",
        },
        {
          text: this.$t("surveyBuilder.responses"),
          align: "center",
          value: "responses",
          class: "black--text",
        },
        {
          text: this.$t("surveyBuilder.status"),
          align: "left",
          value: "status",
          class: "black--text",
          width: 400
        },
      ],
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: false,
          to: "/",
        },
        {
          text: this.$t("surveyBuilder.surveyBuilder"),
          link: true,
          exact: true,
          disabled: true,
          to: { name: "SurveyBuilder" },
        },
      ],
      showAddNewSurveyDialog: false,
      showDownload: false,
    };
  },
  watch: {
    tableOptions: {
        async handler () {
          await this.getSurveys()
        },
        deep: true,
      },
  },

  async mounted() {
    // this.getSurveys();
  },

  methods: {
    async publishSurvey(survey, status) {
      if (!survey.surveyStatus) {
        this.showErrorModal = true;
        return;
      }
      this.publishingSurvey = true;
      await SurveyBuilderService.publishSurvey(survey.id, status)
        .then(() => {
          this.getSurveys();
        })
         .catch((err) => {
          console.err(err);
        })
        .finally(() => {
          this.publishingSurvey = false;
        })
    },
    async getSurveys() {
      this.surveyLoading = true;
      const canSort = this.tableOptions.sortBy.length === 1 && this.tableOptions.sortDesc.length === 1;
      const requestParams = {
        limit: this.tableOptions.itemsPerPage,
        page: this.tableOptions.page ?? 1,
        searchPhrase: this.search,
        orderField: canSort ? this.tableOptions.sortBy[0] : null,
        order: canSort ? this.tableOptions.sortDesc[0] ? 'ASC' : 'DESC' : null,
      };
      await SurveyBuilderService.getAllSurveys(requestParams)
        .then((res) => {
          this.surveys = res.data.rows;
          this.totalSurvey = res.data.count
          this.totalPages = Math.ceil(this.totalSurvey/this.tableOptions.itemsPerPage)
          this.from = (this.tableOptions.page-1)*this.tableOptions.itemsPerPage+1
          this.to = (this.tableOptions.page*this.tableOptions.itemsPerPage)-(this.tableOptions.itemsPerPage-res.data.rows.length)
          this.surveyLoading = false;
        })
        .catch((err) => {
          console.err(err);
        }).finally(() => {
          this.surveyLoading = false;
        })
    },
    searchSurvey() {
      // if(this.search != '') return;
      this.tableOptions.page = 1;
      this.getSurveys();
    },
    pageChange(t){
      if(t) {
        this.tableOptions.page = this.tableOptions.page+1
      } else {
        this.tableOptions.page = this.tableOptions.page-1
      }
      // this.getSurveys();
    },
    async selectItem(item) {
      this.selectedItem = item;
    },
    async deleteSurvey() {
      await SurveyBuilderService.deleteSurvey(this.selectedItem)
        .then((res) => {
          if (res.code === 200) {
            this.showDeleteSurveyDialog = false;
            this.getSurveys();
          }
        })
        .catch((err) => {
          err && this.stopLoading();
        });
    },
    editSurvey(item) {
      this.updateData = item;
      this.showEditSurveyDialog = true;
    },
    async copySurvey(survey){
      this.surveyLoading = true;
      await SurveyBuilderService.copySurvey(survey).then(async () => {
        this.surveyLoading = false;
        await this.getSurveys();
      }).catch((err) => {
        const { message } = err;
        console.err(message);
        this.surveyLoading = false;
      })
    },
    gotoSingleSurvey(id) {
      this.$router.push({ name: "SingleSurveyList", params: { id: id } });
    },
  },
  mixins: [loadingMixin],
};
</script>
<style lang="scss" scoped>
::v-deep .v-data-table-header__icon {
  color: white !important;
}
.text-truncate-title{
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.text-truncate-desc{
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.col-question{
  width: 125px;
}
.col-response {
  width: 131px;
}
</style>
