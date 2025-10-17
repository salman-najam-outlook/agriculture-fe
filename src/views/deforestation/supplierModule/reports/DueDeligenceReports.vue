<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-4">
        <h2>{{ $t("deforestation.eudrDueDeligenceReports") }}</h2>
        <v-spacer></v-spacer>
      </div>
      <v-card elevation="0" class="px-5 mt-7">
        <v-card-text>
          <v-row style="margin-left:-30px; margin-bottom: 20px; margin-top: 15px;">
            <v-col cols="12">
              <v-data-table :headers="reportHeaders" :items="diligenceReports" :items-per-page="10" :footer-props="{
                'items-per-page-options': [10, 25, 50],
              }" hide-default-footer :loading="loading" :options.sync="reportOptions"
                :server-items-length="totalDiligenceReports" :loading-text="$t('deforestation.loadingDeforestationComplianceReport')
                  ">
                <template v-slot:top="{}">
                  <div class="d-flex mt-5">
                    <v-text-field style="width: 290px; " prepend-inner-icon="mdi-magnify" outlined height="5px"
                      :placeholder="$t('search')" dense v-model="reportSearch" @input="searchQuery" class="shrink">
                    </v-text-field>

                    <v-select style="width: 260px; " class="mx-2" v-model="reportCountry" item-text="name"
                      item-value="name" :items="countries" :label="$t('deforestation.allCountries')"
                      @change="filterData" outlined dense>
                    </v-select>

                    <v-select style="width: 260px; " class="mx-2" v-model="reportStatus" item-text="text"
                      item-value="val" :items="allStatus" :label="$t('Due Diligence Status')" @change="filterData"
                      outlined dense>
                    </v-select>

                    <v-spacer></v-spacer>
                    <div class="py-1 title">
                      {{ fromDiligenceReports }} -
                      {{ toDiligenceReports }} of
                      {{ totalDiligenceReports }}
                    </div>
                    <v-btn class="mx-2" fab small outlined color="primary" :disabled="reportOptions.page <= 1"
                      @click="reportPageChange(false)">
                      <v-icon dark>
                        mdi-chevron-left
                      </v-icon>
                    </v-btn>
                    <v-btn class="mx-2" fab small outlined color="primary"
                      :disabled="reportOptions.page >= totalDiligenceReportsPages" @click="reportPageChange(true)">
                      <v-icon dark>
                        mdi-chevron-right
                      </v-icon>
                    </v-btn>
                  </div>
                </template>
                <template v-if="diligenceReports.length" v-slot:body="{ items }">
                  <tbody>
                    <tr v-for="item in items" :key="item.id" style="position: relative; width: 0; height: 0"
                      @mouseover="selectItem(item)" @mouseleave="selectItem(false)">
                      <td class="text-truncate">
                        {{ item.EUDRReferenceNumber }}
                      </td>
                      <td class="text-truncate">
                        {{ item.operator && item.operator.firstName || "" }}
                        {{ item.operator && item.operator.lastName || "" }}
                      </td>
                      <td class="text-truncate">
                        {{ item.internalReferenceNumber }}
                      </td>
                      <td class="text-truncate">
                        {{ item.countryOfEntry }}
                      </td>
                      <td class="text-truncate">
                        {{ item.product }}
                      </td>
                      <td class="text-truncate">
                        {{ item.dueDiligenceProductionPlaces.length }}
                      </td>
                      <td class="text-truncate">{{ item.productNetMass }}Kg</td>
     
                      <td class="text-truncate">
                        {{ getLocalTimeFromUTC(item.updatedAt) }}
                      </td>
                      <td>
                        <div class="d-flex">
                          <v-btn small rounded min-width="200" depressed class="blue-button" height="34"
                            v-if="item.status == 'Uploaded to EU Portal'">
                            <!-- getModulePermittedActions.put -->
                            {{ $t("Uploaded to EU Portal") }}
                          </v-btn>

                          <v-btn small rounded min-width="200" depressed class="gray-button" height="34"
                            v-if="item.status == 'Pending'">
                            <!-- getModulePermittedActions.put -->
                            {{ $t("Pending") }}
                          </v-btn>

                          <v-btn small rounded min-width="200" depressed class="orange-button" height="34"
                            v-if="item.status == 'Under Review'">
                            <!-- getModulePermittedActions.put -->
                            {{ $t("Under Review") }}
                          </v-btn>
                          <v-spacer></v-spacer>
                          <img class="ml-1" src="/icons/todo-list.png"
                            style="width: 34px; height: 34px; border-radius: 50%;" />
                        </div>
                      </td>
                      <td>
                        <div class="d-flex">
                          <v-btn :disabled="item.status === 'Pending'" x-small fab v-bind="attrs" v-on="on"
                            color="primary" @click="
                              $router.push({
                                name: 'EudrAssessmentReport',
                                params: { id: item.id, type: 'assignment' },
                              })
                              ">
                            <!-- @click="$router.push({name: 'ActivationKeyGroupList',params: { groupId: item.id },})" -->
                            <v-icon>mdi-share</v-icon>
                          </v-btn>
                          <v-btn class="ml-2" x-small fab v-bind="attrs" v-on="on" color="primary"
                            @click="duplicateDiligenceReports(item.id)">
                            <!-- @click="$router.push({name: 'ActivationKeyGroupList',params: { groupId: item.id },})" -->
                            <v-icon>mdi-content-duplicate</v-icon>
                          </v-btn>
                          <v-btn class="ml-2" x-small fab v-bind="attrs" v-on="on" color="primary"
                            @click="deleteDiligenceReports(item.id)">
                            <v-icon>mdi-trash-can</v-icon>
                          </v-btn>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </template>
                <template v-slot:footer></template>
              </v-data-table>
              <template>
                <div class="d-flex mt-5" style="align-items: center;">
                  <v-spacer></v-spacer>
                  <img src="/icons/todo-list.png" style="width: 34px; height: 34px; border-radius: 50%;" />
                  <span class="ml-2">{{ $t("dueDiligence.viewReport") }}</span>

                  <v-icon class="ml-5 green-shadow">mdi-share</v-icon>
                  <span class="ml-2">{{ $t("dueDiligence.share") }}</span>


                  <v-icon class="ml-5 green-shadow">mdi-trash-can</v-icon>
                  <span class="ml-2">{{ $t("delete") }}</span>
                </div>
              </template>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import download from "@/mixins/DownloadMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import DateMixin from "@/mixins/DateMixin";
import DeforestationService from "@/_services/DeforestationService";
import { getCountries } from "country-state-picker";

export default {
  created() {
    this.getDeforestationEUDR();
  },
  computed: {
    getCurrentUser() {
      return this.$store.getters.getUser
    },
  },
  watch: {
    options: {
      handler(opt) {
        this.getDeforestationEUDR(opt);
      },
      deep: true,
    },
  },
  data() {
    return {
      countryModel: "",
      statusModel: "",
      regionModel: "",
      reportSearch:"",
      reportCountry:"",
      reportStatus:"",
      countries: [{ name: "All Countries" }, ...getCountries()],
      allStatus: [
        { text: this.$t("deforestation.allStatus"), val: "" },
        { text: this.$t("deforestation.assessmentIssued"), val: "REQUESTED" },
        {
          text: this.$t("deforestation.certificateIssued"),
          val: "CERTIFICATE_READY",
        },
      ],
      allRegions: [{ text: this.$t("deforestation.allRegions"), val: "" }],

      deforestationComplianceReports: [],
      copyReport: [],
      loading: true,
      totalDeforestationComplianceReports: 0,
      tab: 0,
      selectedItem: false,
      reportOptions: {
        itemsPerPage: 10,
        page: 1,
      },
      fromDiligenceReports: 1,
      toDiligenceReports: 10,
      search: "",
      from: 0,
      to: 0,
      reportHeaders: [
        {
          text: this.$t("deforestation.eudrRefNo"),
          align: "start",
          value: "farmerName",
          class: "black--text",
          sortable: false,
          width: "150px",
        },
        {
          text: this.$t("deforestation.operator"),
          align: "start",
          value: "farmLocation",
          class: "black--text",
          sortable: false,
        },
        {
          text: this.$t("deforestation.eoriNumber"),
          align: "start",
          value: "farmName",
          class: "black--text",
          width: "150px",
        },
        {
          text: this.$t("deforestation.country"),
          align: "start",
          value: "status",
          class: "black--text",
          sortable: false,
        },
        {
          text: this.$t("deforestation.product"),
          align: "start",
          value: "area",
          class: "black--text",
          sortable: false,
        },
        {
          text: this.$t("deforestation.noOfFarms"),
          align: "start",
          value: "dateOfRequest",
          class: "black--text",
          sortable: false,
        },
        {
          text: this.$t("deforestation.quantity"),
          align: "start",
          value: "",
          class: "black--text",
          sortable: false,
        },
        {
          text: this.$t("deforestation.lastUpdated"),
          align: "start",
          value: "status",
          class: "black--text",
          sortable: false,
        },
        {
          text: this.$t("deforestation.dueDeligenceStatus"),
          align: "start",
          value: "status",
          class: "black--text",
          sortable: false,
        },
        {
          text: "Actions",
          align: "center",
          value: "status",
          class: "black--text",
          sortable: false,
          width: "150px",
        },
      ],
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: false,
          to: { name: "Users" },
          exact: true,
        },
        {
          text: this.$t("deforestation.eudrForestAssessment"),
          disabled: true,
          href: "breadcrumbs_link_1",
        },
      ],
      diligenceReports: [],
      totalDiligenceReports: 0,
      totalDiligenceReportsPages: 0,
    };
  },
  methods: {
    filterData() {
      this.reportOptions.page = 1;
      this.getDeforestationEUDR();
    },
    searchQuery() {
      this.reportOptions.page = 1;
      this.getDeforestationEUDR();
    },
    async getDeforestationEUDR(opt = null) {
      this.loading = true;
      const requestParams = {
        page: this.reportOptions.page,
        limit: this.reportOptions.itemsPerPage,
        searchPhrase: this.reportSearch,
        country: this.reportCountry,
        status: this.reportStatus,
        // supplierId: this.getCurrentUser.id
        supplierId: 124693

      };

      if (opt?.sortBy?.length) {
        requestParams.orderField = opt.sortBy[0];
        requestParams.order = opt.sortDesc[0] ? "DESC" : "ASC";
      }
      DeforestationService.getDiligenceReports(requestParams)
        .then((res) => {
          this.diligenceReports = res.data.diligenceReports.rows;
          this.totalDiligenceReports = res.data.diligenceReports.totalCount;

          this.totalDiligenceReportsPages = Math.ceil(
            this.totalDiligenceReports / this.reportOptions.itemsPerPage
          );
          this.fromDiligenceReports =
            (this.reportOptions.page - 1) * this.reportOptions.itemsPerPage + 1;
          this.toDiligenceReports =
            this.reportOptions.page * this.reportOptions.itemsPerPage -
            (this.reportOptions.itemsPerPage -
              res.data.diligenceReports.rows.length);
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          console.log("Error", err);
        });
    },
    async deleteDiligenceReports(id) {
      this.loading = true;

      DeforestationService.deleteDiligenceReport(parseInt(id))
        .then(() => {
          this.getDeforestationEUDR();
          this.$notify({
            text: this.$t('deforestation.reportDeletedSuccessfully'),
            type: "success",
          });
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.$notify({
            text: err,
            type: "error",
          });
          console.log("Error", err);
        });
    },

    async duplicateDiligenceReports(id) {
      this.loading = true;
      DeforestationService.duplicateDiligenceReport(parseInt(id))
        .then(() => {
          this.getDeforestationEUDR();
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.$notify({
            text: err,
            type: "error",
          });
          console.log("Error", err);
        });
    },

    selectItem(item) {
      this.selectedItem = item;
    },
    resetSearchOnEmpty() {
      this.search = "";
      this.countryModel = "";
      this.statusModel = "";
      this.regionModelregionModel = "";
      this.options = {
        page: 1,
        limit: 10,
      };
      this.getDeforestationEUDR();
    },
    reportPageChange(t) {
      if (t) this.reportOptions.page = this.reportOptions.page + 1;
      else this.reportOptions.page = this.reportOptions.page - 1;
      this.getDeforestationEUDR();
    },
  },
  mixins: [loadingMixin, download, getPermittedActions, DateMixin],
};
</script>
<style lang="scss" scoped>
::v-deep .wdt.v-text-field {
  width: 250px;
}

::v-deep .v-tab:hover {
  background-color: #caf1e2;
  color: $primary_color !important;
}

::v-deep .v-data-table-header span {
  text-transform: uppercase !important;
  color: black;
}

::v-deep .center-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

::v-deep .img-center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 40%;
}
</style>
