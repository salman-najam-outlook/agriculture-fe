<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-8">
        <h2>Survey Builder</h2>
        <v-spacer></v-spacer>
        <div class="d-flex mt-1">
          <v-btn color="primary" dark class="mr-2" width="170" @click="openAssessmentSettings = true">
            Create New Survey
          </v-btn>
        </div>
      </div>
      <v-card elevation="0" class="px-5 mt-4">
        <div class="pa-4" v-if="assessments">
          <v-data-table :headers="headers" :items="assessments" :items-per-page="10" :footer-props="{
            'items-per-page-options': [10, 25, 50],
          }" :header-props="headerProps" hide-default-footer :loading="assessmentLoading"
            :options.sync="tableOptions" :server-items-length="totalAssessments" loading-text="Loading Assessments...">
            <template v-slot:top>
              <div class="d-flex mt-5">
                <!-- <span style="width: 250px" class="shrink mr-4"></span> -->
                <span style="width: 250px" class="shrink mr-4">Type
                  <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                        mdi-alert-circle
                        </v-icon>
                    </template>
                    <span>Type of Survey</span>
                  </v-tooltip>
                </span>
                <!-- <span style="width: 250px" class="shrink mr-4">Status
                  <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                        mdi-alert-circle
                        </v-icon>
                    </template>
                    <span>Activation status of the survey</span>
                  </v-tooltip>
                </span> -->
              </div>
              <div class="d-flex mt-5">

                <v-text-field 
                  id="assessment-name" 
                  prepend-inner-icon="mdi-magnify" 
                  outlined 
                  height="5px"
                  placeholder="Search surveys by title..." 
                  dense 
                  class="shrink mr-4" 
                  style="width: 250px"
                  v-model="search" 
                  @input="debouncedSearchAssessment" 
                  clearable
                ></v-text-field>

                <v-spacer></v-spacer>
                <div class="py-1 title">
                  {{ from }} - {{ to }} of {{ totalAssessments }}
                </div>
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
            <template v-if="assessments.length > 0" v-slot:body="{ items }">
              <tbody>
                <tr v-for="item in items" :key="item.id" style="position: relative; width: 0; height: 0">
                  <td class="text-left text-truncate-title">
                    {{ item.title }}
                  </td>
                  <td class="text-truncate-desc text-left">
                    {{ item.type || "N/A" }}
                  </td>
                  <td class="col-question text-center">{{ item.noOfQuestions }}</td>
                  <!-- <td class="col-response text-center">{{ item.noOfResponse }}</td> -->
                  <td :class="`text-left ${item.isDisabled ? 'red--text' : ''}`">
                    <div class="space-between">
                      <v-chip class="" :color="item.isDisabled ? 'red' : 'success'" outlined>
                        {{
                          item.isDisabled ? "Inactive": "Active"
                        }}
                      </v-chip>
                      <v-menu
                        bottom
                        left
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            icon
                            v-bind="attrs"
                            v-on="on"
                          >
                            <v-icon>mdi-dots-vertical</v-icon>
                          </v-btn>
                        </template>

                        <v-list class="py-0">
                          <v-list-item v-for="(action, i) in getDynamicActions(item)" :key="i">
                            <v-list-item-title @click="surveyAction(action, item)">
                              <span :class="'mr-16' + (action === 'Delete' ? ' red--text': '')">{{ action }}</span>
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </div>
                  </td>
                </tr>
              </tbody>
            </template>
            <template v-slot:no-data>
              <h2>No Surveys Found</h2>
            </template>
            <template v-slot:footer></template>
          </v-data-table>
        </div>
      </v-card>
    </v-container>
    <CreateSurvey 
      v-if="openAssessmentSettings" 
      :dialogI="openAssessmentSettings" 
      @closeModal="closeModel"
    />

    <confirm-box 
      :title="confirmDelete.title"
      :message="confirmDelete.message"
      :cancelBtnText="confirmDelete.cancelBtnText" 
      :confirmBtnText="confirmDelete.confirmBtnText"
      :confirmData="confirmDelete.confirmData" 
      :dialog="confirmDeleteDialog" 
      @cancel:action="confirmDeleteDialog = false"
      @continue:action="confirmDeleteAssessment" />
  </div>
</template>

<script>
import DeforestationService from "@/_services/DeforestationService";
import loadingMixin from "@/mixins/LoadingMixin";
import debounce from 'lodash/debounce';
import ConfirmBox from "@/components/ConfirmBox";
import EsgService from "@/_services/EsgService";
import CreateSurvey from './components/CreateSurvey.vue';


export default {
  components: {
    CreateSurvey,
    "confirm-box": ConfirmBox,
  },
  computed: { },
  data() {
    return {
      selectedItem: {},
      openAssessmentSettings: false,
      openEditAssessmentSetting: false,
      openCreateAssessment: false,
      assessments: [],
      search: "",
      type: "ESG_GOAL",
      surveyStatus: "",
      headerProps: {
        "sort-icon": "mdi-menu-up",
      },
      assessmentLoading: false,
      tableOptions: {
        page: 1,
        itemsPerPage: 10,
      },
      totalAssessments: 0,
      countries: [],
      countryOptions: [],
      from: 0,
      to: 0,
      totalPages: 1,
      status: {
        IN_ACTIVE: this.$t('inactive'),
        ACTIVE: this.$t('active'),
      },
      headers: [
        {
          text: "Survey Title",
          align: "start",
          value: "title",
          class: "black--text",
          width: '30%'
        },
        {
          text: "Type",
          align: "start",
          value: "type",
          class: "black--text",
          width: '40%'
        },
        {
          text: "Question",
          align: "center",
          value: "noOfQuestions",
          class: "black--text",
          width: 150,

        },
        {
          text: this.$t("status"),
          align: "left",
          value: "isDisabled",
          class: "black--text",
          width: 250,
        },
      ],
      breadcrumbs: [
        {
          text: this.$t("esgPlatform.esgPlatform"),
          disabled: false,
          to: { name: "esgAccountDashboard" },
        },
        {
          text: this.$t("esgPlatform.surveyBuilder"),
          link: true,
          exact: true,
          disabled: true,
        },
      ],
      confirmDeleteDialog : false,
      confirmDelete: {
        title: this.$t("confirmDialog.assessmentBuilder.delete.title"),
        message: this.$t("confirmDialog.assessmentBuilder.delete.message"),
        confirmBtnText: this.$t("confirmDialog.assessmentBuilder.delete.confirmBtn"),
        cancelBtnText: this.$t("cancel"),
        confirmData: {},
      },
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
      surveyStatuses: [
        {
          label: "Active",
          value: true
        },
        {
          label: "Inactive",
          value: false
        }
      ],
      actions: ['View','Delete',
      // , 'Edit', 'Download', 'Duplicate', 'Delete'
    ]
    };
  },
  created() { },
  mounted() { },
  watch: {
    tableOptions: {
      async handler() {
        await this.getAssessments()
      },
      deep: true,
    },
  },
  methods: {
    async closeModel() {
      this.openAssessmentSettings = false;
      this.openEditAssessmentSetting = false;
      this.getAssessments();
    },
    getDynamicActions() {
      // const dynamicMenuItem = item.isDisabled ? 'Publish Survey': 'End Survey';
      const dynamicMenu = [...this.actions];
      // dynamicMenu.splice(2, 0, dynamicMenuItem);
      return dynamicMenu;
    },
    async getAssessments() {
      this.assessmentLoading = true;
      try {
        let params = {
          page: this.tableOptions.page,
          limit: this.tableOptions.itemsPerPage,
          search: this.search || '',
        };

        const res = await EsgService.getAssessments(params);

        if (!res.success) {
          throw Error("Server Error!");
        }

        // Handle the actual response structure from the API
        let assessmentData = [];
        let totalCount = 0;

        if (res.data && res.data.info && Array.isArray(res.data.info)) {
          // Current API response structure with 'info' array
          assessmentData = res.data.info;
          totalCount = res.data.total || 0;
        } else if (res.data && res.data.data && Array.isArray(res.data.data)) {
          // Alternative structure with 'data' array
          assessmentData = res.data.data;
          totalCount = res.data.total || 0;
        } else if (res.data && Array.isArray(res.data)) {
          // Direct array response (fallback)
          assessmentData = res.data;
          totalCount = res.data.length;
        } else {
          // No data or unexpected structure
          assessmentData = [];
          totalCount = 0;
        }

        this.assessments = assessmentData.map((r) => ({
          ...r,
          type: this.surveyTypes.find((i) => i.value === "ESG_GOAL").label
        }));
        this.totalAssessments = totalCount;
        this.totalPages = Math.ceil(this.totalAssessments / this.tableOptions.itemsPerPage) ?? 0;
        this.from = this.totalAssessments > 0 ? (this.tableOptions.page - 1) * this.tableOptions.itemsPerPage + 1 : 0;
        this.to = Math.min(this.tableOptions.page * this.tableOptions.itemsPerPage, this.totalAssessments);
      } catch (err) {
        console.log(err);
        this.assessments = [];
        this.totalAssessments = 0;
        this.totalPages = 0;
        this.from = 0;
        this.to = 0;
        this.$notify({
          text: 'Cannot get assessments',
          type: "error",
        });
      }
      this.assessmentLoading = false;
    },
    surveyAction(action, survey) {
      const actions = {
        view: (item) => {
          this.$router.push(`/esg-platform/survey-details/${item._id}`);
        },
        edit: (item) => {
          console.log("Edit", item);
        },
        end_survey: (item) => {
          console.log("End Survey", item);
        },
        publish_survey: (item) => {
          console.log("Publish Survey", item);
        },
        download: (item) => {
          console.log("Download", item);
        },
        duplicate: (item) => {
          console.log("Duplicate", item);
        },
        delete: (item) => {
          EsgService.deleteAssessment(item._id).then(res => {
            if (res.success) {
              this.$notify({
                text: 'Assessment deleted successfully',
                type: "success",
              });
              this.getAssessments();
            } else {
              this.$notify({
                text: 'Cannot delete assessment',
                type: "error",
              });
            }
          }).catch(err => {
            console.error(err);
            this.$notify({
              text: 'Error deleting assessment',
              type: "error",
            });
          });
          console.log("Delete", item);
        }
      };

      actions[action.toLowerCase().replaceAll(" ", "_")](survey);
    },
    pageChange(t) {
      if (t) {
        this.tableOptions.page = this.tableOptions.page + 1;
      } else {
        this.tableOptions.page = this.tableOptions.page - 1;
      }
    },
    debouncedSearchAssessment: debounce(function () {
      this.tableOptions.page = 1; // Reset to first page when searching
      this.searchAssessment();
    }, 1000),
    searchAssessment() {
      this.getAssessments()
    },
   async selectedAssessment(type, selectedAssessments) {console.log(selectedAssessments)
      if (type==='new'){
        this.openAssessmentSettings = true;
      }
      if(type === 'existing', selectedAssessments?.length){
        this.startLoading()
        const loggedInUser = localStorage.getItem('user')
        const user = JSON.parse(loggedInUser);
        try{
        const res = await DeforestationService.createFromDefaultAssessment({
          orgId: user.user_organization.id,
          userId: user.id,
          defaultAssessmentIds:selectedAssessments
        });
        console.log(res)
      }
      catch(err){
        console.log(err);
      }
        this.stopLoading()
        this.getAssessments()     
      }

    },
    getDetails(item) {
      this.$router.push({
        name: "AssessmentDetails",
        params: { id: item.id },
      });
    },
    async handleEditAssessmentClick(item) {
      this.selectedItem = item
      this.openEditAssessmentSetting = true;
    },
     removeAssessment(id) {
      this.confirmDelete.confirmData = { id };
      this.confirmDeleteDialog = true;
    },
    async confirmDeleteAssessment (action, confirmData) {
      this.startLoading();
      const removeAssessmentResponse = await DeforestationService.removeAssessment(confirmData.id);
      this.stopLoading()
      this.confirmDeleteDialog = false;

      if (removeAssessmentResponse.data?.removeAssessment === true) {
        await this.getAssessments();
      }
      else {
        this.$notify({
          text: 'Cannot delete assessment',
          type: "error",
        });
      }

    },
    showMenu(item) {
      console.log(item);
    }
  },
  mixins: [loadingMixin],
};
</script>

<style lang="scss" scoped>
::v-deep .v-data-table-header__icon {
  color: white !important;
}

::v-deep .v-list-item {
  cursor: pointer;
  border-bottom: 1px solid #e4e4e4;

  &:hover {
    background-color: #f2f2f2;
  }
}

.space-between {
  display: flex;
  justify-content: space-between;
}
</style>
