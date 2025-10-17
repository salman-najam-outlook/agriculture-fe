<template>
  <v-container fluid>
    <div class="d-flex mb-4">
      <h2>{{ $t("deforestation.eudrForestAssessment") }}</h2>
      <v-spacer></v-spacer>
    </div>

    <v-card elevation="0" class="px-5">
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="filterData"
          :items-per-page="10"
          :footer-props="{
            'items-per-page-options': [10, 25, 50],
          }"
          hide-default-footer
          :loading="loading"
          :options.sync="options"
          :server-items-length="totalDeforestationComplianceReports"
          :loading-text="
            $t('deforestation.loadingDeforestationComplianceReport')
          "
          item-value="id"
        >
          <template v-slot:top>
            <div class="d-flex mt-5">
              <v-text-field
                prepend-inner-icon="mdi-magnify"
                outlined
                height="5px"
                :placeholder="$t('search')"
                dense
                v-model="search"
                @keyup.enter="searchQuery"
                class="shrink"
              ></v-text-field>

              <v-btn class="mx-2" @click="resetSearchOnEmpty">
                <v-icon dark>autorenew</v-icon>
              </v-btn>

              <v-select
                class="mx-2"
                v-model="countryModel"
                item-text="text"
                item-value="val"
                :items="countries"
                :label="$t('deforestation.allCountries')"
                @change="filterData"
                outlined
                dense
              ></v-select>

              <v-select
                class="mx-2"
                v-model="regionModel"
                item-text="text"
                item-value="val"
                :items="allRegions"
                :label="$t('deforestation.allRegions')"
                @change="filterData"
                outlined
                dense
              ></v-select>

              <v-select
                class="mx-2"
                v-model="statusModel"
                item-text="text"
                item-value="val"
                :items="allStatus"
                :label="$t('deforestation.allStatus')"
                @change="filterData"
                outlined
                dense
              ></v-select>

              <v-spacer></v-spacer>
              <div class="py-1 title">
                {{ from }} - {{ to }} {{ $t('of') }}
                {{ totalDeforestationComplianceReports }}
              </div>
              <v-btn
                class="mx-2"
                fab
                small
                outlined
                color="primary"
                :disabled="options.page <= 1"
                @click="pageChange(false)"
              >
                <v-icon dark>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn
                class="mx-2"
                fab
                small
                outlined
                color="primary"
                :disabled="options.page >= totalPages"
                @click="pageChange(true)"
              >
                <v-icon dark>mdi-chevron-right</v-icon>
              </v-btn>
            </div>
          </template>
          <template v-slot:item.createdAt="{ item }">
            {{ formatDate(item.createdAt) }}
          </template>
          <template v-slot:item.status="{ item }">
            <v-chip
              :color="item.status === 'REQUESTED' ? 'primary' : ''"
              outlined
              >{{ getStatusLabel(item.status) }}</v-chip
            >
          </template>
          <template v-slot:item.action="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  x-small
                  fab
                  v-bind="attrs"
                  v-on="on"
                  color="primary"
                  @click="viewReport(item)"
                >
                  <v-icon>mdi-clipboard-text</v-icon>
                </v-btn>
              </template>
              <span>{{ $t("deforestation.view") }}</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";
import download from "@/mixins/DownloadMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import DateMixin from "@/mixins/DateMixin";
import DeforestationService from "@/_services/DeforestationService";

export default {
  mixins: [loadingMixin, download, getPermittedActions, DateMixin],
  data() {
    return {
      countryModel: "",
      statusModel: "",
      regionModel: "",
      countries: [{ text: this.$t("deforestation.allCountries"), val: "" }],
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
      selected: [],
      options: {
        itemsPerPage: 10,
        page: 1,
      },
      search: "",
      from: 0,
      to: 0,
      totalPages: 1,
      headers: [
        {
          text: this.$t("deforestation.farmerName"),
          value: "farmerName",
          class: "black--text",
          sortable: false,
        },
        {
          text: this.$t("deforestation.farmName"),
          value: "farmName",
          class: "black--text",
        },
        {
          text: this.$t("deforestation.farmLocation"),
          value: "locationName",
          class: "black--text",
          sortable: false,
        },
        {
          text: this.$t("deforestation.area"),
          value: "geofenceArea",
          class: "black--text",
          sortable: false,
        },
        {
          text: this.$t("deforestation.dateOfRequest"),
          value: "createdAt",
          class: "black--text",
          sortable: false,
        },
        {
          text: this.$t("deforestation.status"),
          value: "status",
          class: "black--text",
          sortable: false,
        },
        {
          text: "",
          value: "action",
          class: "black--text",
          sortable: false,
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
      initialized: false,
    };
  },
  computed: {
    getCurrentUser() {
      return this.$store.getters.getUser;
    },
    filterData() {
      let data = this.deforestationComplianceReports;
      if (this.search) {
        data = data.filter(
          (item) =>
            item.farmerName.toLowerCase().includes(this.search.toLowerCase()) ||
            item.farmName.toLowerCase().includes(this.search.toLowerCase()) ||
            item.locationName.toLowerCase().includes(this.search.toLowerCase())
        );
      }
      if (this.countryModel) {
        data = data.filter((item) => item.country === this.countryModel);
      }
      if (this.regionModel) {
        data = data.filter((item) => item.state === this.regionModel);
      }
      if (this.statusModel) {
        data = data.filter((item) => item.status === this.statusModel);
      }
      return data;
    },
  },
  watch: {
    options: {
      handler() {
        if (this.initialized) {
          this.getDeforestationEUDR();
        }
      },
      deep: true,
    },
  },
  created() {
    this.getDeforestationEUDR();
  },
  methods: {
    async getDeforestationEUDR() {
      this.loading = true;
      const requestParams = {
        page: this.options.page,
        limit: this.options.itemsPerPage,
        search: this.search,
        isCertified: false,
        organization: this.getCurrentUser.user_organization.id,
      };
      if (this.options.sortBy?.length) {
        requestParams.orderField = this.options.sortBy[0];
        requestParams.order = this.options.sortDesc[0] ? "DESC" : "ASC";
      }
      try {
        const res = await DeforestationService.getEUDRAssementReportsList(
          requestParams
        );
        this.deforestationComplianceReports = res.data.deforestationAdmin.rows;
        this.copyReport = JSON.parse(
          JSON.stringify(res.data.deforestationAdmin.rows)
        );
        this.totalDeforestationComplianceReports =
          res.data.deforestationAdmin.totalCount;
        this.countries = [
          { text: this.$t("deforestation.allCountries"), val: "" },
          ...new Set(
            this.deforestationComplianceReports.map((item) => ({
              text: item.country,
              val: item.country,
            }))
          ),
        ];
        this.allRegions = [
          { text: this.$t("deforestation.allRegions"), val: "" },
          ...new Set(
            this.deforestationComplianceReports.map((item) => ({
              text: item.state,
              val: item.state,
            }))
          ),
        ];
        this.totalPages = Math.ceil(
          this.totalDeforestationComplianceReports / this.options.itemsPerPage
        );
        this.from = (this.options.page - 1) * this.options.itemsPerPage + 1;
        this.to = Math.min(
          this.from + this.options.itemsPerPage - 1,
          this.totalDeforestationComplianceReports
        );
      } catch (err) {
        console.error("Error", err);
      } finally {
        this.loading = false;
      }
    },
    searchQuery() {
      this.getDeforestationEUDR();
    },
    resetSearchOnEmpty() {
      if (!this.search) {
        this.getDeforestationEUDR();
      }
    },
    pageChange(t) {
      if (t) this.options.page = this.options.page + 1;
      else this.options.page = this.options.page - 1;
      this.getDeforestationEUDR();
    },
    deleteSelected() {
      if (!this.selected.length) {
        alert("No rows selected!");
        return;
      }
      this.deforestationComplianceReports =
        this.deforestationComplianceReports.filter(
          (item) => !this.selected.includes(item)
        );
      this.selected = [];
      this.getDeforestationEUDR();
    },
    getStatusLabel(status) {
      switch (status) {
        case "REQUESTED":
          return this.$t("deforestation.assessmentIssued");
        case "CERTIFICATE_READY":
          return this.$t("deforestation.certificateIssued");
        default:
          return status;
      }
    },
    viewReport(item) {
      if (item.status === "REQUESTED") {
        // Navigate to assignment type view
        this.$router.push({
          name: "EudrAssessmentReport",
          params: { id: item.id, type: "assignment" },
        });
      } else {
        // Navigate to certificate type view
        this.$router.push({
          name: "EudrAssessmentReport",
          params: { id: item.id, type: "certificate" },
        });
      }
    },
  },
};
</script>
