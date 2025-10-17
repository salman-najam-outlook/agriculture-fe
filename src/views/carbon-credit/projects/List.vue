<template>
  <div>
    <breadcrumb :items="breadcrumbs" />
    <v-container fluid>
      <div class="d-flex mb-8">
        <h2 class="font-weight-bold mb-6">{{ $t('carbonCredit.carbonCreditProjects') }}</h2>
        <v-spacer></v-spacer>
        <div class="d-flex mt-1">
          <v-menu offset-y>
            <template v-slot:activator="props">
              <v-btn class="custom-btn mr-2" v-bind="props.attrs" v-on="props.on">
                {{ $t('carbonCredit.exportAs') }}
                <v-icon right>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="exportAs('csv')">
                <v-list-item-title>{{ $t('carbonCredit.downloadAsCSV') }}</v-list-item-title>
              </v-list-item>
              <v-list-item @click="exportAs('excel')">
                <v-list-item-title>{{ $t('carbonCredit.downloadAsExcel') }}</v-list-item-title>
              </v-list-item>
              <v-list-item disabled>
                <v-list-item-title>{{ $t('carbonCredit.downloadAsPDF') }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-spacer></v-spacer>
           <v-btn v-if="isUserDataReady && isSuperAdmin" color = "primary" dark class="mr-2"
              @click="handleRegisterProject">
                {{ $t('carbonCredit.registerProject') }}
              </v-btn>
        </div>
      </div>
      <!-- Data Table Card -->
      <v-card elevation="0" class="px-5 mt-7">
        <v-card-text>
          <v-row style="margin-left: -30px; margin-bottom: 20px; margin-top: 15px;">
            <v-col cols="12">
              <v-data-table :headers="displayHeaders" :items="projects" :items-per-page="options.limit"
                :footer-props="{ 'items-per-page-options': itemsPerPageOptions }" item-key="id" hide-default-footer
                :loading="loading" :options.sync="options" :server-items-length="totalProjects"
                :loading-text="$t('loadingData')">
                <!-- Table Top Slot: Search, Filters, Pagination, and Actions -->
                <template v-slot:top>
                  <div class="d-flex mt-5">
                    <!-- Search Field -->
                    <div class="ml-3" style="width: 280px;">
                      <label for="text"> </label>
                      <v-text-field prepend-inner-icon="mdi-magnify" outlined :placeholder="$t('carbonCredit.search')"
                        dense v-model="search" @input="searchQuery" class="shrink"></v-text-field>
                    </div>
                    <v-spacer></v-spacer>
                    <!-- Pagination Info -->
                    <div class="py-1 title">
                      {{ fromProjects }} - {{ toProjects }} {{ $t("of") }} {{ totalProjects }}
                    </div>
                    <!-- Pagination Controls -->
                    <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page <= 1"
                      @click="pageChange(false)">
                      <v-icon dark>mdi-chevron-left</v-icon>
                    </v-btn>
                    <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page >= totalPages"
                      @click="pageChange(true)">
                      <v-icon dark>mdi-chevron-right</v-icon>
                    </v-btn>
                    <!-- Customization Menu -->
                    <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" left :min-width="417">
                      <template v-slot:activator="props">
                        <v-btn class="mx-2" fab small outlined color="primary" v-bind="props.attrs" v-on="props.on">
                          <v-icon dark>mdi-cog-outline</v-icon>
                        </v-btn>
                      </template>
                      <v-card width="417">
                        <v-list>
                          <v-list-item>
                            <v-list-item-title>{{ $t("customization") }}</v-list-item-title>
                          </v-list-item>
                          <v-divider></v-divider>
                          <div class="pl-3 pt-2 font-weight-normal">
                            {{ $t("recordsPerPage") }}
                          </div>
                          <v-list-item>
                            <v-slider v-model="itemsPerPageSlider" :tick-labels="itemsPerPageOptions" :max="3" step="1"
                              ticks="always" tick-size="4"></v-slider>
                          </v-list-item>
                          <v-divider class="mt-n3"></v-divider>
                        </v-list>
                        <v-card-text>
                          <v-container fluid>
                            <v-row>
                              <v-col class="mt-n9" cols="6" v-for="header in headers" :key="header.value">
                                <v-checkbox v-if="header.text" v-model="selectedHeaders" :label="header.text"
                                  color="primary" :value="header.text" hide-details></v-checkbox>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-card-text>
                        <v-layout justify-center>
                          <v-card-actions class="mb-5">
                            <v-spacer></v-spacer>
                            <v-btn outlined color="primary" @click="resetDefault" width="190">
                              {{ $t("restoreDefault") }}
                            </v-btn>
                            <v-btn color="primary" @click="resetTableStructure" width="190">
                              {{ $t("apply") }}
                            </v-btn>
                          </v-card-actions>
                        </v-layout>
                      </v-card>
                    </v-menu>
                    <!-- Export and Print Buttons -->
                    <v-tooltip top color="black" max-width="350">
                      <template v-slot:activator="props">
                        <v-btn class="mx-2" fab small outlined color="primary" v-bind="props.attrs" v-on="props.on"
                          @click="exportToPDF">
                          <v-img src="/icons/download.svg"></v-img>
                        </v-btn>
                      </template>
                      <span>{{ $t("download") }}</span>
                    </v-tooltip>
                    <v-tooltip top color="black" max-width="350">
                      <template v-slot:activator="props">
                        <v-btn class="mx-2" fab small outlined color="primary" v-bind="props.attrs" v-on="props.on"
                          @click="printPDF">
                          <v-icon dark>mdi-printer</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t("print") }}</span>
                    </v-tooltip>
                  </div>
                </template>
                <!-- Table Body: Custom Rendering of Rows -->
                <template v-if="projects.length" v-slot:body="{ items }">
                  <tbody>
                    <tr v-for="item in items" :key="item.id" style="position: relative; width: 0; height: 0"
                      @mouseover="selectItem(item)" @mouseleave="selectItem(false)">
                      <template v-for="h in displayHeaders">
                        <td class="text-truncate" :key="h.value + '_projectTitle'" v-if="h.value === 'projectTitle'">
                          {{ item.project_title || '-' }}
                        </td>
                        <td class="text-truncate" :key="h.value + '_projectType'" v-else-if="h.value === 'projectType'">
                          {{ projectType(item.project_type) }}
                        </td>
                        <td class="text-truncate" :key="h.value + '_country'" v-else-if="h.value === 'country'">
                          {{ Array.isArray(item.country) ? item.country.join(', ') : item.country || '-' }}
                        </td>
                        <td class="text-truncate" :key="h.value + '_totalCreditsGenerated'"
                          v-else-if="h.value === 'totalCreditsGenerated'">
                          {{ item.total_credit_generated || 0 }}
                        </td>
                        <td class="text-truncate" :key="h.value + '_status'" v-else-if="h.value === 'status'">
                          <v-btn
                            small
                            rounded
                            min-width="200"
                            depressed
                            :class="getStatusClass(item.status)"
                            height="40"
                          >
                            {{ projectStatusType(item.status) }}
                          </v-btn>
                        </td>
                        <td :key="h.value + '_action'" v-else-if="h.value === 'action'">
                          <div style="position: absolute; right: 10px; top: 10px;">
                            <v-menu location="start">
                              <template v-slot:activator="props">
                                <v-btn icon v-bind="props.attrs" v-on="props.on">
                                  <v-icon>mdi-dots-vertical</v-icon>
                                </v-btn>
                              </template>
                              <v-list>
                                <v-list-item @click="viewProject(item)">
                                  <v-list-item-title>{{ $t("carbonCredit.view") }}</v-list-item-title>
                                </v-list-item>
                                <v-list-item v-if="isUserDataReady && isSuperAdmin" @click="editProject(item)">
                                  <v-list-item-title>{{ $t("carbonCredit.edit") }}</v-list-item-title>
                                </v-list-item>
                                <v-list-item v-if="isUserDataReady && isSuperAdmin" @click="deactivateProject(item.id)">
                                  <v-list-item-title style="color: red;">{{ $t("carbonCredit.deactivate") }}</v-list-item-title>
                                </v-list-item>
                              </v-list>
                            </v-menu>
                          </div>
                        </td>
                      </template>
                    </tr>
                  </tbody>
                </template>
                <template v-slot:footer></template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
    <!-- Confirmation Dialog -->
    <ConfirmBox :title="confirmDeactivate.title" :message="confirmDeactivate.message"
      :cancelBtnText="confirmDeactivate.cancelBtnText" :confirmBtnText="confirmDeactivate.confirmBtnText"
      :confirmData="confirmDeactivate.confirmData" :dialog="confirmDeactivateDialog"
      @cancel:action="confirmDeactivateDialog = false" @continue:action="confirmDeactivateProject" />
  </div>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";
import download from "@/mixins/DownloadMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import DateMixin from "@/mixins/DateMixin";
import CarbonCreditService from "@/_services/CarbonCreditService";
import { getCountries } from "country-state-picker";
import html2pdf from "html2pdf.js";
import printJS from "print-js";
import ConfirmBox from "@/components/ConfirmBox";
import moment from "moment";
import RoleMixin from "@/mixins/RoleMixin";
import { mapGetters } from "vuex";

export default {
  components: {
    ConfirmBox,
  },
  created() {
    // Wait for user data to be available before fetching projects
    this.$nextTick(() => {
      this.fetchProjects();
    });
  },
  async mounted() {
    this.tableHeaders = this.headers;
    this.selectedHeaders = this.allSelectedHeaders;
  },
  watch: {
    options: {
      handler(opt) {
        this.fetchProjects(opt);
      },
      deep: true,
    },
    showActionsColumn() {
      this.updateDisplayHeaders();
    },
  },
  computed: {
    ...mapGetters(["getUser"]),
    isOwner() {
      try {
        return this.getCurrentRoles && Array.isArray(this.getCurrentRoles) && this.getCurrentRoles.some((x) => ["owner"].includes(x));
      } catch (error) {
        return false;
      }
    },
    isSuperAdmin() {
      try {
        // Try both approaches to get user roles
        const userRoles = this.getUserRoles;
        const currentRoles = this.getCurrentRoles;
        
        // Check if super_admin exists in either array
        const isSuperFromVuex = userRoles && Array.isArray(userRoles) && userRoles.some((role) => role === "super_admin");
        const isSuperFromLocal = currentRoles && Array.isArray(currentRoles) && currentRoles.some((role) => role === "super_admin");
        
        return isSuperFromVuex || isSuperFromLocal;
      } catch (error) {
        return false;
      }
    },
    isUserDataReady() {
      // Check both Vuex store and localStorage for user data
      const userFromVuex = this.getUser;
      const rolesFromVuex = this.getUserRoles;
      const rolesFromLocal = this.getCurrentRoles;
      
      const ready = (userFromVuex && rolesFromVuex && Array.isArray(rolesFromVuex)) || 
                   (rolesFromLocal && Array.isArray(rolesFromLocal));
      
      return ready;
    },
    totalPages() {
      return parseInt(Math.ceil(this.totalProjects / this.options.limit));
    },
    displayHeaders() {
      // Always show action column so all users can access the view option
      // Edit and deactivate options are controlled by v-if in the template
      return this.showActionsColumn
        ? this.tableHeaders
        : this.tableHeaders.filter((header) => header.value !== 'action');
    },
  },
  data() {
    return {
      debounceTimer: null,
      fromProjects: 0,
      toProjects: 0,
      search: "",
      countryModel: "",
      projectStatus: "",
      countries: [...getCountries()],
      loading: true,
      selectedItem: false,
      options: {
        limit: 10,
        page: 1,
      },
      headers: [
        {
          text: this.$t("carbonCredit.projectTitle"),
          align: "start",
          value: "projectTitle",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("carbonCredit.projectType"),
          align: "start",
          value: "projectType",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("carbonCredit.country"),
          align: "start",
          value: "country",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("carbonCredit.totalCreditsGenerated"),
          align: "start",
          value: "totalCreditsGenerated",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("carbonCredit.status"),
          align: "center",
          value: "status",
          class: "black--text",
          sortable: true,
        },
        {
          align: "center",
          value: "action",
          class: "black--text",
          sortable: false,
        },
      ],
      allSelectedHeaders: [
        this.$t("carbonCredit.projectTitle"),
        this.$t("carbonCredit.projectType"),
        this.$t("carbonCredit.country"),
        this.$t("carbonCredit.totalCreditsGenerated"),
        this.$t("carbonCredit.status"),
      ],
      menu: false,
      breadcrumbs: [
        {
          text: this.$t("carbonCredit.dashboard"),
          disabled: false,
          href: "/dashboard",
          exact: true,
        },
        {
          text: this.$t("carbonCredit.title"),
          disabled: false,
          href: "/carbon-credit/projects",
        },
        {
          text: this.$t("carbonCredit.projects"),
          disabled: true,
          href: "breadcrumbs_link_2",
          exact: true,
        },
      ],
      projects: [],
      totalProjects: 0,
      itemsPerPageOptions: [5, 10, 25, 50],
      itemsPerPageSlider: 1,
      selectedHeaders: [],
      tableHeaders: [],
      showActionsColumn: true,
      hideOnPrint: false,
      confirmDeactivateDialog: false,
      confirmDeactivate: {
        title: this.$t("carbonCredit.deactivateProject"),
        message: this.$t("carbonCredit.deactivateConfirmation"),
        confirmBtnText: this.$t("carbonCredit.deactivate"),
        cancelBtnText: this.$t("cancel"),
        confirmData: {},
      },
      allStatuses: [
        { name: this.$t("carbonCredit.pending "), value: "planned" },
        { name: this.$t("carbonCredit.active"), value: "operational" },
        { name: this.$t("carbonCredit.deactivated"), value: "inactive" },
      ],
    };
  },
  methods: {
    async exportToPDF() {
      const requestParams = {
        page: this.options.page,
        limit: this.options.limit,
        search: this.search,
        country: this.countryModel,
        status: this.projectStatus,
      };
      const querys = new URLSearchParams(requestParams).toString();
      const token = this.$store.state.auth.token;
      this.startLoading();
      const url = process.env.VUE_APP_API_BASE_URL || "https://api.example.com";
      this.downloadSourceFileWithToken(
        `${url}/projects/pdf?${querys}`,
        "application/pdf",
        token,
        "projects.pdf"
      )
        .then(() => {
          this.stopLoading();
        })
        .catch(() => {
          this.stopLoading();
        });
    },
    async printPDF() {
      this.showActionsColumn = false;
      this.hideOnPrint = true;
      await this.$nextTick(); // Wait for DOM to update
      const element = document.querySelector(".v-data-table__wrapper");
      let opt = {
        margin: 1,
        filename: "ProjectList.pdf",
        image: { type: "jpeg", quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
      };
      let worker = await html2pdf()
        .set(opt)
        .from(element)
        .toCanvas()
        .outputPdf("blob", "Project.pdf");
      let file = new File([worker], "Project.pdf", { type: "application/pdf" });
      var pdfUrl = await URL.createObjectURL(file);
      await printJS({ printable: `${pdfUrl}`, type: "pdf", showModal: true });
      this.showActionsColumn = true;
      this.hideOnPrint = false;
      await this.$nextTick(); // Ensure DOM is updated after restoring
    },
    async resetDefault() {
      this.tableHeaders = this.headers;
      this.selectedHeaders = this.allSelectedHeaders;
      this.menu = false;
      await this.fetchProjects();
    },
    async resetTableStructure() {
      this.tableHeaders = this.headers.filter((header) =>
        (header.text && this.selectedHeaders.includes(header.text)) || 
        (!header.text)
      );
      this.options.limit = this.itemsPerPageOptions[this.itemsPerPageSlider];
      await this.fetchProjects();
      this.menu = false;
    },
    updateDisplayHeaders() {
      this.tableHeaders = this.headers.filter((header) =>
        (header.text && this.selectedHeaders.includes(header.text)) ||
        (this.showActionsColumn && header.value === 'action') ||
        (!header.text && !this.showActionsColumn)
      );
    },
    getDateFormat(date) {
      return moment(date).format("DD/MM/YYYY");
    },
    handleCreateProject() {
      this.$router.push({ name: "createProject" });
    },
    handleProjectSettings() {
      this.$router.push({ name: "projectSettings" });
    },
    filterData() {
      this.options.page = 1;
      this.fetchProjects();
    },
    searchQuery() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.options.page = 1;
        this.fetchProjects();
      }, 500);
    },
    async fetchProjects(opt = null) {
      this.loading = true;
      const requestParams = {
        page: this.options.page || 1,
        limit: this.options.limit || 10,
        search: this.search || null,
      };
      if (opt?.sortBy?.length) {
        requestParams.orderField = opt.sortBy[0];
        requestParams.order = opt.sortDesc[0] ? "DESC" : "ASC";
      }
      try {
        const res = await CarbonCreditService.getCarbonCreditProjects(requestParams);
        this.projects = res.data.rows;
        this.totalProjects = res.data.total;
        this.fromProjects =
          this.totalProjects > 0 ? (this.options.page - 1) * this.options.limit + 1 : 0;
        this.toProjects =
          this.options.page * this.options.limit > this.totalProjects
            ? this.totalProjects
            : this.options.page * this.options.limit;
      } catch (err) {
        console.log("Error", err);
      } finally {
        this.loading = false;
      }
    },
    async deactivateProject(id) {
      this.confirmDeactivate.confirmData = { id };
      this.confirmDeactivateDialog = true;
    },
    async confirmDeactivateProject(action, confirmData) {
      this.loading = true;
      this.confirmDeactivateDialog = false;
      try {
        const response = await CarbonCreditService.deactivateProject(parseInt(confirmData.id));
        if (response.success) {
          this.fetchProjects();
          this.$notify({
            text: this.$t("carbonCredit.projectDeletedSuccessfully"),
            type: "success",
          });
        } else {
          this.$notify({
            text: response.message || this.$t("carbonCredit.deactivateProjectError"),
            type: "error",
          });
        }
      } catch (err) {
        console.error("Error deactivating project:", err);
        this.$notify({
          text: err?.response?.data?.message || this.$t("carbonCredit.deactivateProjectError"),
          type: "error",
        });
      } finally {
        this.loading = false;
      }
    },
    viewProject(item) {
      this.$router.push({ name: "viewProject", params: { id: item.id } });
    },
    editProject(item) {
      this.$router.push({ name: "registerProject", params: { id: item.id } });
    },
    selectItem(item) {
      this.selectedItem = item;
    },
    pageChange(next) {
      if (next) this.options.page += 1;
      else this.options.page -= 1;
      this.fetchProjects();
    },
    projectType(item) {
      if (item === 'avoided_deforestation') {
        return this.$t("carbonCredit.forestry");
      }
      if (item === 'agroforestry') {
        return this.$t("carbonCredit.agroForestry");
      }
      if (item === 'regenerative_agriculture') {
        return this.$t("carbonCredit.regenerativeAgriculture");
      }
      return item || "-";
    },
    projectStatusType(item) {
      if (item === 'planned') {
        return this.$t("carbonCredit.pending");
      }
      if (item === 'operational') {
        return this.$t("carbonCredit.active");
      }
      if (item === 'deactivate') {
        return this.$t("carbonCredit.inactive");
      }
      if (item === 'proposed') {
        return this.$t("carbonCredit.pending");
      }
      if (item === 'in_progress') {
        return this.$t("carbonCredit.pending");
      }
      return item || "-";
    },
    getStatusClass(status) {
      switch (status) {
        case 'operational':
          return 'green-button';
        case ' proposed':
          return 'gray-button';
        case 'in_progress':
          return 'gray-button';
        case 'planned':
          return 'gray-button';
        case 'deactivate':
          return 'red-button';
        default:
          return '';
      }
    },
    handleRegisterProject() {
      this.$router.push('/carbon-credit/projects/register');
    },
    async exportAs(type) {
      if (type === 'csv') {
        this.startLoading();
        try {
          await CarbonCreditService.exportProjectsAsCSV({
            page: this.options.page,
            limit: this.options.limit,
            search: this.search,
            country: this.countryModel,
            status: this.projectStatus,
          });
        } catch (err) {
          this.$notify({
            text: this.$t('carbonCredit.exportFailed'),
            type: 'error',
          });
        } finally {
          this.stopLoading();
        }
      } else if (type === 'excel') {
        this.startLoading();
        try {
          await CarbonCreditService.exportProjectsAsExcel({
            page: this.options.page,
            limit: this.options.limit,
            search: this.search,
            country: this.countryModel,
            status: this.projectStatus,
          });
        } catch (err) {
          this.$notify({
            text: this.$t('carbonCredit.exportFailed'),
            type: 'error',
          });
        } finally {
          this.stopLoading();
        }
      } else if (type === 'pdf') {
        // TODO: Implement PDF export if needed
      }
    },
  },
  mixins: [loadingMixin, download, getPermittedActions, DateMixin, RoleMixin],
};
</script>

<style lang="scss" scoped>
.custom-btn {
  background-color: #FFFFFF !important;
  color: #00BD73 !important;
  border: 2px solid #00BD73 !important;
  box-shadow: none !important;

  &:hover {
    background-color: #e0e0e0 !important;
  }
}

.green-button {
  background-color: #c1ffe7 !important;
  border: 2px solid #00bd73 !important;
  color: #489e16 !important;
}

.red-button {
  background-color: #fdecea !important;
  border: 2px solid #f03737 !important;
  color: #f03737 !important;
}

.gray-button {
  background-color: #e8e8e8 !important;
  border: 2px solid #000000 !important;
  color: #000000 !important;
}

::v-deep .v-data-table-header span {
  text-transform: uppercase !important;
  color: black;
}
</style>