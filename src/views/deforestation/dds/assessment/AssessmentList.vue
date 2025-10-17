<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-8">
        <h2>{{ $t("dueDiligence.assessmentsList") }}</h2>
        <v-spacer></v-spacer>
        <div class="d-flex mt-1">
          <v-btn color="primary" dark class="mr-2" width="170" @click="openCreateAssessment = true">
            {{ $t("dueDiligence.createAssessment") }}
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
                <span style="width: 250px" class="shrink mr-4">{{ $t('dueDiligence.assessmentName') }}
                  <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                        mdi-alert-circle
                        </v-icon>
                    </template>
                    <span>{{ $t("dueDiligence.assessmentNameInfo") }}</span>
                </v-tooltip>
                </span>
                <span style="width: 250px" class="shrink mr-4">{{ $t('country') }}</span>
              </div>
              <div class="d-flex mt-5">

                <v-text-field id="assessment-name" prepend-inner-icon="mdi-magnify" outlined height="5px"
                  :placeholder="$t('dueDiligence.searchAssessment')" dense class="shrink mr-4" style="width: 250px"
                  v-model="search" @input="debouncedSearchAssessment" @click:append="searchAssessment"></v-text-field>


                <v-select v-model="countries" multiple :items="countryOptions" @change="getCountryData" item-text="name" 
                  item-value="code" class="shrink mr-4" style="width: 250px"
                  :placeholder="$t('profileSetting.selectCountry')" clearable dense outlined>
                </v-select>

                <v-btn class="shrink primary" @click="resetSearchOnEmpty">
                  {{ $t('reset') }}
                </v-btn>

                <v-spacer></v-spacer>
                <div class="py-1 title">
                  {{ from }} - {{ to }} {{ $t('of') }} {{ totalAssessments }}
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
                    {{ item.description || "N/A" }}
                  </td>
                  <td class="text-truncate-desc text-left">
                      <template v-if="item.countries && item.countries.length > 0">
                        <span v-for="(country, index) in item.countries.slice(0, 3)" :key="country">
                          {{ country !== "ALL" ? getCountryName(country) : "ALL" }}
                          <span v-if="index < Math.min(2, item.countries.length - 1)">, </span>
                        </span>
                        <span v-if="item.countries.length > 3">
                          (+{{ item.countries.length - 3 }} more)
                        </span>
                      </template>
                      <template v-else>
                        N/A
                      </template>
                    </td>
                  <td class="col-question text-center">{{ getTotalQuestion(item) }}</td>
                  <!-- <td class="col-response text-center">{{ item.noOfResponse }}</td> -->
                  <td :class="`text-left ${item.status === 'IN_ACTIVE' ? 'red--text' : ''
                    }`
                    ">
                    <v-chip class="" :color="item.status === 'IN_ACTIVE' ? 'red' : 'success'" outlined>
                      {{
                        item.isScheduled && item.status === "IN_ACTIVE"
                          ? "Scheduled"
                          : status[item.status]
                      }}
                    </v-chip>
                  </td>
                  <div style="position: absolute; right: 10px; top: 5px;  width: 120px; display: flex; justify-content: space-between; " >
                    <v-btn x-small fab color="primary" outlined class="ml-2" @click="getDetails(item)">
                      <v-icon>mdi-eye-outline</v-icon>
                    </v-btn>
                    <v-btn x-small fab color="primary" outlined class="ml-2" @click="handleEditAssessmentClick(item)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn v-if="!item.isDefault" x-small fab color="primary" outlined class="ml-2" @click="removeAssessment(item.id)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </div>
                </tr>
              </tbody>
            </template>
            <template v-slot:footer></template>
          </v-data-table>
        </div>
      </v-card>
    </v-container>
    <create-assessment :dialogI="openCreateAssessment" :countries="countryOptions" @closeModal="openCreateAssessment = false"
      @selectedAssessment="selectedAssessment" />
    <assessment-settings v-if="openAssessmentSettings" :dialogI="openAssessmentSettings" @closeModal="closeModel" />
    <assessment-settings v-if="openEditAssessmentSetting" :dialogI="openEditAssessmentSetting"
      :updateData="selectedItem" @closeModal="closeModel" />

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
import { getCountries } from "country-state-picker";
import CreateAssessment from './CreateAssessment.vue';
import AssessmentSettings from './AssessmentSettings.vue';
import DeforestationService from "@/_services/DeforestationService";
import loadingMixin from "@/mixins/LoadingMixin";
import debounce from 'lodash/debounce';
import ConfirmBox from "@/components/ConfirmBox";


export default {
  components: {
    CreateAssessment,
    AssessmentSettings,
    "confirm-box": ConfirmBox,
  },
  computed: {
    getOrderId() {
      let orderId = this.$route.params.id;
      return orderId;
    },
  },
  data() {
    return {
      selectedItem: {},
      openAssessmentSettings: false,
      openEditAssessmentSetting: false,
      openCreateAssessment: false,
      assessments: [],
      search: "",
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
          text: this.$t("dueDiligence.assessmentName"),
          align: "start",
          value: "title",
          class: "black--text",
          width: '30%'
        },
        {
          text: this.$t("description"),
          align: "start",
          value: "description",
          class: "black--text",
          width: '40%'
        },
        {
          text: this.$t("countries"),
          align: "start",
          value: "countries",
          class: "black--text",
          width: 125,
        },
        {
          text: this.$t("surveyBuilder.questions"),
          align: "center",
          value: "noOfQuestions",
          class: "black--text",
          width: 150,

        },
        // {
        //   text: this.$t("surveyBuilder.responses"),
        //   align: "center",
        //   value: "noOfResponse",
        //   class: "black--text",
        //   width: 140,

        // },
        {
          text: this.$t("status"),
          align: "left",
          value: "status",
          class: "black--text",
          width: 250,
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
    };
  },
  created() { },
  mounted() {
    this.getCountry();
  },
  watch: {
    tableOptions: {
      async handler() {
        await this.getAssessments()
      },
      deep: true,
    },
  },
  methods: {
    getTotalQuestion(item) {
      // if (item.assessmentSettings.isMultiStep && item.assessmentSettings.multiStepType === 'HEADINGS') {
        // return item.assessmentQuestionHeading.length;
      // }
      // if (item.assessmentSettings.isMultiStep && item.assessmentSettings.multiStepType === 'QUESTIONS') {
        return item.assessmentQuestions.length;
      // }
      // return item.assessmentQuestions.length
    },
    async closeModel() {
      this.openAssessmentSettings = false;
      this.openEditAssessmentSetting = false;
      this.getAssessments();
    },
    async getAssessments() {
      this.assessmentLoading = true;
      try {

        const loggedInUser = localStorage.getItem('user')
        const user = JSON.parse(loggedInUser);
        const canSort = this.tableOptions.sortBy.length === 1 && this.tableOptions.sortDesc.length === 1;
        let params = {
          page: this.tableOptions.page,
          limit: 10,
          orgId: user.user_organization.id,
          userId: user.id,
          search: this.search,
          countries: this.countries.includes('ALL') ? null : this.countries,  // If "ALL" is selected, send null to fetch all
          assessmentType: "USER_CUSTOM",
          sortColumn: canSort ? this.tableOptions.sortBy[0] : null,
          sortOrder: canSort ? this.tableOptions.sortDesc[0] ? 'ASC' : 'DESC' : null,
      };

        const res = await DeforestationService.getAllAssessment(params);
        this.assessments = res.data.findAllAssessmentList.rows;
        this.totalAssessments = res.data.findAllAssessmentList.totalCount;
        this.totalPages = Math.ceil(this.totalAssessments / this.tableOptions.itemsPerPage) ?? 0;
        this.from = (this.tableOptions.page - 1) * this.tableOptions.itemsPerPage + 1;
        this.to = (this.tableOptions.page * this.tableOptions.itemsPerPage) - (this.tableOptions.itemsPerPage - res.data.findAllAssessmentList.rows.length)
      } catch (err) {
        console.log(err);
        this.$notify({
          text: 'Cannot get assessment',
          type: "error",
        });
      }
      this.assessmentLoading = false;
    },
    getCountryData(val) {
        this.countries = val.includes('ALL') ? ['ALL'] : val;
        this.getAssessments();
      },
    getCountryName(code) {
      return this.countryOptions.find(c => c.code === code)?.name;
    },
    getCountry() {
      this.countryOptions = getCountries();
    },
    pageChange(t) {
      if (t) {
        this.tableOptions.page = this.tableOptions.page + 1;
      } else {
        this.tableOptions.page = this.tableOptions.page - 1;
      }
    },
    debouncedSearchAssessment: debounce(function () {
      this.searchAssessment();
    }, 1000),
    searchAssessment() {
      this.getAssessments()
    },
   async selectedAssessment(type, selectedAssessments) {
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
    async resetSearchOnEmpty() {
      this.countries = [];
      this.search = '';
      this.tableOptions.page = 1;
      await this.getAssessments();
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
