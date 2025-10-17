<template>
  <div>
    <breadcrumb :items="breadcrumbs" />
    <v-container fluid>
      <div class="d-flex mb-8">
        <h2 class="font-weight-bolder mb-6">{{ $t('carbonCredit.user.title') }}</h2>
        <div class="d-flex ml-auto">
          <v-select v-model="projectType" :items="projectTypeList" item-text="name" item-value="value"
            class="ml-4 mr-2" outlined dense :placeholder="$t('carbonCredit.projectType')" style="width: 250px;"
            clearable></v-select>
          <v-spacer></v-spacer>
          <v-select v-model="organizations" :items="safeOrganizationList" item-text="name" item-value="id"
            class="ml-4 mr-2" outlined dense :placeholder="$t('carbonCredit.user.selectOrganization')"
            @change="filterData" style="width: 250px;" clearable></v-select>
          <v-spacer></v-spacer>
          <v-select v-model="projects" :items="safeProjectList" item-text="project_title" item-value="id"
            class="ml-4 mr-2" outlined dense
            :placeholder="projectType ? $t('carbonCredit.user.selectProject') : $t('carbonCredit.user.selectProjectTypeFirst')"
            @change="filterData" :disabled="!projectType" style="width: 250px;" clearable></v-select>
          <div class="d-flex mt-1">
            <v-spacer></v-spacer>
            <v-btn color="primary" dark class="mr-2" v-bind="attrs" v-on="on" @click="handleRegisterProject">
              {{ $t('carbonCredit.registerProject') }}
            </v-btn>
          </div>
        </div>
      </div>
      <!-- Data Table Card -->
      <v-card elevation="0" class="px-5 mt-7">
        <v-card-text>
          <v-row style="margin-left: -30px; margin-bottom: 20px; margin-top: 15px;">
            <v-col cols="12">
              <v-data-table :headers="tableHeaders" :items="users" :items-per-page="options.limit"
                :footer-props="{ 'items-per-page-options': itemsPerPageOptions }" item-key="id" hide-default-footer
                :loading="loading" :options.sync="options" :server-items-length="totalUsers"
                :loading-text="$t('loadingData')">
                <template v-slot:top>

                  <!-- Filter Summary Cards -->
                  <v-card elevation="0" class="px-3 mb-3">
                    <div v-if="hasActiveFilters" class="mb-6">
                      <v-row>
                        <v-col cols="12" sm="6" md="3" v-if="projectType">
                          <v-card class="filter-card" elevation="2">
                            <v-card-text class="pa-4">
                              <div class="d-flex align-center mb-2">
                                <v-icon small class="mr-2" color="grey">mdi-information-outline</v-icon>
                                <span class="text-caption text-grey">Project Type</span>
                              </div>
                              <div class="text-h6 font-weight-medium">
                                {{ getProjectTypeName(projectType) }}
                              </div>
                            </v-card-text>
                          </v-card>
                        </v-col>


                        <v-col cols="12" sm="4" md="4" v-if="projects">
                          <v-card class="filter-card" elevation="2">
                            <v-card-text class="pa-4">
                              <div class="d-flex align-center mb-2">
                                <span class="text-caption text-grey">Project</span>
                              </div>
                              <div class="text-h6 font-weight-medium">
                                {{ getProjectName(projects) }}
                              </div>
                            </v-card-text>
                          </v-card>
                        </v-col>
                      </v-row>
                    </div>
                  </v-card>

                  <div class="d-flex mt-5">

                    <!-- Search Field -->
                    <div class="ml-3" style="width: 280px;">
                      <label for="text"> </label>
                      <v-text-field prepend-inner-icon="mdi-magnify" outlined :placeholder="$t('carbonCredit.search')"
                        dense v-model="search" @input="searchQuery" class="shrink"></v-text-field>
                    </div>
                    <!-- Status Dropdown -->
                    <div class="ml-3 d-flex align-center">
                      <span class="mr-2 mb-6 text-center text-body-1 font-weight-bold">{{
                        $t('carbonCredit.user.status') }}</span>
                      <v-select v-model="projectStatus" :items="allStatuses" item-text="name" item-value="value"
                        outlined dense :placeholder="$t('carbonCredit.user.allUsers')" @change="handleStatusChange"
                        style="width: 180px;" class="shrink" clearable></v-select>
                    </div>
                    <v-spacer></v-spacer>
                    <!-- Pagination Info -->
                    <div class="py-1 title">
                      {{ fromUsers }} - {{ toUsers }} {{ $t("of") }} {{ totalUsers }}
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
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn class="mx-2" fab small outlined color="primary" v-bind="attrs" v-on="on">
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
                            <v-slider v-model="itemsPerPageSlider" :tick-labels="itemsPerPageOptions" :max="3"
                              step="1" ticks="always" tick-size="4"></v-slider>
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
                      <!-- <template v-slot:activator="{ on, attrs }">
                        <v-btn class="mx-2" fab small outlined color="primary" v-bind="attrs" v-on="on"
                          @click="exportToPDF">
                          <v-img src="/icons/download.svg"></v-img>
                        </v-btn>
                      </template> -->
                      <span>{{ $t("download") }}</span>
                    </v-tooltip>
                    <v-tooltip top color="black" max-width="350">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn class="mx-2" fab small outlined color="primary" v-bind="attrs" v-on="on"
                          @click="printPDF">
                          <v-icon dark>mdi-printer</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t("print") }}</span>
                    </v-tooltip>
                  </div>
                </template>
                <!-- Individual column templates -->
                 <template v-slot:item.userNameAndId="{ item }">
                   <span class="text-truncate">{{ item.userNameAndId || '-' }}</span>
                 </template>
                 <template v-slot:item.email="{ item }">
                   <span class="text-truncate">{{ item.email || '-' }}</span>
                 </template>
                 <template v-slot:item.userRole="{ item }">
                   <span class="text-truncate">{{ item.userRole || '-' }}</span>
                 </template>
                 <template v-slot:item.organizations="{ item }">
                   <span class="text-truncate">{{ item.organizations || '-' }}</span>
                 </template>
                 <template v-slot:item.userRegistrationDate="{ item }">
                   <span class="text-truncate">{{ item.userRegistrationDate || '-' }}</span>
                 </template>
                 <template v-slot:item.status="{ item }">
                   <div class="d-flex align-center">
                     <v-btn small rounded min-width="120" depressed :class="getStatusClass(item.status)" height="40" class="mr-2">
                       {{ getStatusText(item.status) }}
                     </v-btn>
                     <v-icon v-if="item.status === 'active' && !item.verified" color="warning" small>
                       mdi-alert-triangle
                     </v-icon>
                   </div>
                 </template>
                 <template v-slot:item.actions="{ item }">
                   <div class="d-flex justify-center">
                     <v-menu location="start">
                       <template v-slot:activator="{ on, attrs }">
                         <v-btn icon v-bind="attrs" v-on="on" small>
                           <v-icon>mdi-dots-vertical</v-icon>
                         </v-btn>
                       </template>
                       <v-list>
                         <v-list-item @click="viewUser(item)">
                           <v-list-item-title>{{ $t("carbonCredit.user.view") }}</v-list-item-title>
                         </v-list-item>
                         <v-list-item @click="toggleUserStatus(item.id)">
                           <v-list-item-title :style="item.active === true ? 'color: red;' : 'color: green;'">
                            {{ item.active === true ? $t("carbonCredit.user.deactivate") : $t("carbonCredit.user.activate") }}
                           </v-list-item-title>
                         </v-list-item>
                       </v-list>
                     </v-menu>
                   </div>
                 </template>
                <template v-slot:footer></template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
    <!-- Confirmation Dialog -->
    <ConfirmationBox 
      :dialog="confirmDeactivateDialog"
      actionType="reject"
      :message="confirmDeactivate.message"
      :confirmData="confirmDeactivate.confirmData"
      :dialogTitle="confirmDeactivate.title"
      :confirmButtonText="confirmDeactivate.confirmBtnText"
      @close="confirmDeactivateDialog = false" 
      @confirm="confirmDeactivateProjectUser" />
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
import ConfirmationBox from "./components/ConfirmationBox";
import moment from "moment";
import RoleMixin from "@/mixins/RoleMixin";
import { mapGetters } from "vuex";
import OrganizationService from "@/_services/OrganizationService";
import UserService from "@/_services/UserService";
export default {
components: {
  ConfirmationBox,
},
created() {
  this.getUsers();
  this.getOrganizations();
},
async mounted() {
  this.tableHeaders = this.headers;
  this.selectedHeaders = this.allSelectedHeaders;
},
watch: {
  projectType(newVal, oldVal) {
    if (newVal !== oldVal) {
      // Let filterData handle the project type change
      this.filterData();
    }
  },
},
computed: {
  ...mapGetters(["getUser"]),
  isOwner() {
    return this.getCurrentRoles.some((x) => ["owner"].includes(x));
  },
  totalPages() {
    return parseInt(Math.ceil(this.totalUsers / this.options.limit));
  },
  safeProjectList() {
    return Array.isArray(this.projectList) ? this.projectList : [];
  },
  safeOrganizationList() {
    return Array.isArray(this.organizationList) ? this.organizationList : [];
  },
  hasActiveFilters() {
    return this.projectType || this.organizations || this.projects || this.projectStatus;
  },
  filteredHeaders() {
    return this.headers.filter(header => this.selectedHeaders.includes(header.value));
  },
},
data() {
  return {
    debounceTimer: null,
    fromUsers: 0,
    toUsers: 0,
    search: "",
    projectTypeList: [
      { name: this.$t("carbonCredit.forestry"), value: "forestry" },
      { name: this.$t("carbonCredit.agroForestry"), value: "agroforestry" },
      { name: this.$t("carbonCredit.regenerativeAgriculture"), value: "regenerative_agriculture" },
    ],
    projectType: "",
    previousProjectType: "",
    organizationList: [],
    organizations: "",
    projectList: [],
    countryModel: "",
    projectStatus: '',
    countries: [...getCountries()],
    loading: false,
    selectedItem: false,
    options: {
      limit: 10,
      page: 1,
    },
    headers: [
      {
        text: this.$t("carbonCredit.user.userNameAndId"),
        align: "start",
        value: "userNameAndId",
        class: "black--text",
        sortable: true,
      },
      {
        text: this.$t("carbonCredit.user.email"),
        align: "start",
        value: "email",
        class: "black--text",
        sortable: true,
      },
      {
        text: this.$t("carbonCredit.user.userRole"),
        align: "start",
        value: "userRole",
        class: "black--text",
        sortable: true,
      },
      {
        text: this.$t("carbonCredit.user.organizations"),
        align: "start",
        value: "organizations",
        class: "black--text",
        sortable: true,
      },
      {
        text: this.$t("carbonCredit.user.userRegistrationDate"),
        align: "start",
        value: "userRegistrationDate",
        class: "black--text",
        sortable: true,
      },
      {
        text: this.$t("carbonCredit.user.status"),
        align: "start",
        value: "status",
        class: "black--text",
        sortable: true,
      },
      {
        text: this.$t("Actions"),
        align: "center",
        value: "actions",
        class: "black--text",
        sortable: false,
      },
    ],
    allSelectedHeaders: [
      this.$t("carbonCredit.user.userNameAndId"),
      this.$t("carbonCredit.user.email"),
      this.$t("carbonCredit.user.userRole"),
      this.$t("carbonCredit.user.organizations"),
      this.$t("carbonCredit.user.userRegistrationDate"),
      this.$t("carbonCredit.user.status"),
      this.$t("Actions"),
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
    users: [],
    totalUsers: 0,
    itemsPerPageOptions: [5, 10, 25, 50],
    itemsPerPageSlider: 1,
    selectedHeaders: [],
    tableHeaders: [],
    showActionsColumn: true,
    hideOnPrint: false,
    confirmDeactivateDialog: false,
    confirmDeactivate: {
      title: "",
      message: "",
      confirmBtnText: "",
      cancelBtnText: this.$t("cancel"),
      confirmData: {},
    },
    allStatuses: [
      { name: this.$t("carbonCredit.user.allUsers"), value: "" },
      { name: this.$t("carbonCredit.user.active"), value: "active" },
      { name: this.$t("carbonCredit.user.deactivated"), value: "deactivated" },
    ],
    customizeMenu: false,
    customizeMenuAll: false,
  };
},
methods: {

  async getUsers() {
    this.startLoading();
    try {
      const params = {
        page: this.options.page,
        limit: this.options.limit,
        search: this.search,
        organization: this.organizations,
        projectType: this.projectType,
        project: this.projects,
      };

      if (this.projectStatus === 'active') {
        params.active = 1;
      } else if (this.projectStatus === 'deactivated') {
        params.active = 0;
      }

      const response = await CarbonCreditService.getCarbonCreditUsers(params);

      // Handle the API response structure correctly
      const responseData = response.data || response;
      const usersData = responseData.rows || responseData.data || [];
      const totalCount = responseData.count || 0;

      // Ensure usersData is an array
      if (!Array.isArray(usersData)) {
        this.users = [];
        this.totalUsers = 0;
        this.fromUsers = 0;
        this.toUsers = 0;
        return;
      }

      // Map the API response to match table structure
      this.users = usersData.map(user => {
        try {
          return {
            id: user.id,
            userNameAndId: `${user.fullName || user.firstName || 'N/A'} | ${user.id}`,
            email: user.email || 'N/A',
            userRole: this.getUserRole(user.userType, user.registrationUserType),
            organizations: this.getOrganizationName(user.organization) || 'N/A',
            userRegistrationDate: user.createdAt ? this.getUserRegistrationDateFormat(user.createdAt) : 'N/A',
            status: user.active ? 'active' : 'deactivated',
            // Additional fields for actions
            verified: user.verified,
            active: user.active,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          };
        } catch (error) {
          console.error('Error mapping user:', user, error);
          return {
            id: user.id || 'N/A',
            userNameAndId: 'N/A',
            email: 'N/A',
            userRole: 'N/A',
            organizations: 'N/A',
            userRegistrationDate: 'N/A',
            status: 'N/A',
            verified: false,
            active: false,
            createdAt: null,
            updatedAt: null
          };
        }
      });

      this.totalUsers = totalCount;
      this.fromUsers = totalCount > 0 ? (this.options.page - 1) * this.options.limit + 1 : 0;
      this.toUsers = Math.min(this.options.page * this.options.limit, totalCount);

    } catch (error) {
      this.users = [];
      this.totalUsers = 0;
      this.fromUsers = 0;
      this.toUsers = 0;
    } finally {
      this.stopLoading();
    }
  },
  async getOrganizations() {
    try {
      const response = await OrganizationService.getorganization();

      // Handle the single organization object response
      const organizationData = response.data?.data || response.data;

      // If it's a single organization object, wrap it in an array
      if (organizationData && typeof organizationData === 'object' && !Array.isArray(organizationData)) {
        this.organizationList = [organizationData];
      } else if (Array.isArray(organizationData)) {
        this.organizationList = organizationData;
      } else {
        this.organizationList = [];
      }

    } catch (error) {
      this.organizationList = [];
    }
  },
  async getProjects(projectType) {
    try {
      const response = await CarbonCreditService.getCarbonCreditProjects({ type: projectType });

      // Ensure projectList is always an array
      const projectsData = response.data?.rows || response.data || [];
      this.projectList = Array.isArray(projectsData) ? projectsData : [];

    } catch (error) {
      this.projectList = [];
    }
  },
  async resetDefault() {
    this.tableHeaders = this.headers;
    this.selectedHeaders = this.allSelectedHeaders;
    this.options.limit = this.itemsPerPageOptions[this.itemsPerPageSlider];
    this.menu = false;
    await this.getUsers()
  },
  async resetTableStructure() {
    this.tableHeaders = this.headers.filter((header) =>
      this.selectedHeaders.includes(header.text)
    );
    this.options.limit = this.itemsPerPageOptions[
      this.itemsPerPageSlider
    ];
    await this.getUsers();
    (this.customizeMenu = false), (this.customizeMenuAll = false);
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

    // Handle project type changes
    if (this.projectType !== this.previousProjectType) {
      this.previousProjectType = this.projectType;
      this.projects = '';

      if (this.projectType) {
        this.getProjects(this.projectType);
      } else {
        this.projectList = [];
      }
    }
    this.getUsers();
  },
  handleStatusChange() {
    this.options.page = 1;
    this.getUsers();
  },
  searchQuery() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.options.page = 1;
      this.getUsers();
    }, 500);
  },
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
    // Remove action column from the DOM for printing
    const table = document.querySelector('.v-data-table__wrapper table');
    let removedHeader, removedCells = [];
    if (table) {
      // Remove the last th (action column header)
      const headerRow = table.querySelector('thead tr');
      if (headerRow && headerRow.children.length > 0) {
        removedHeader = headerRow.removeChild(headerRow.lastElementChild);
      }
      // Remove the last td in each body row (action column cells)
      const bodyRows = table.querySelectorAll('tbody tr');
      bodyRows.forEach(row => {
        if (row.children.length > 0) {
          removedCells.push(row.removeChild(row.lastElementChild));
        }
      });
    }
    const element = document.querySelector(".v-data-table__wrapper");
    let opt = {
      margin: 1,
      filename: "CarbonCreditUsers.pdf",
      image: { type: "jpeg", quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
    };
    let worker = await html2pdf()
      .set(opt)
      .from(element)
      .toCanvas()
      .outputPdf("blob", "CarbonCreditUsers.pdf");
    let file = new File([worker], "CarbonCreditUsers.pdf", { type: "application/pdf" });
    var pdfUrl = await URL.createObjectURL(file);
    await printJS({ printable: `${pdfUrl}`, type: "pdf", showModal: true });
    // Restore the action column after printing
    if (table && removedHeader) {
      const headerRow = table.querySelector('thead tr');
      if (headerRow) {
        headerRow.appendChild(removedHeader);
      }
      const bodyRows = table.querySelectorAll('tbody tr');
      bodyRows.forEach((row, idx) => {
        if (removedCells[idx]) {
          row.appendChild(removedCells[idx]);
        }
      });
    }
    this.showActionsColumn = true;
    this.hideOnPrint = false;
    await this.$nextTick(); // Ensure DOM is updated after restoring
  },
  selectItem(item) {
    this.selectedItem = item;
  },
  pageChange(next) {
    if (next) this.options.page += 1;
    else this.options.page -= 1;
    this.getUsers();
  },  
  toggleUserStatus(id) {
    // Find the user to get their current status
    const user = this.users.find(user => user.id === id);
    if (!user) {
      console.error('User not found:', id);
      return;
    }

    // Set the confirmation dialog content based on user's current status
    this.confirmDeactivate.title = user.active 
      ? this.$t("carbonCredit.user.deactivateUser") 
      : this.$t("carbonCredit.user.activateUser");
    
    this.confirmDeactivate.message = user.active 
      ? this.$t("carbonCredit.user.deactivateConfirmation") 
      : this.$t("carbonCredit.user.activateConfirmation");
    
    this.confirmDeactivate.confirmBtnText = user.active 
      ? this.$t("carbonCredit.user.deactivate") 
      : this.$t("carbonCredit.user.activate");

    this.confirmDeactivate.confirmData = { id, active: user.active };
    this.confirmDeactivateDialog = true;
  },
  async confirmDeactivateProjectUser(confirmData) {
    this.confirmDeactivateDialog = false;
    try {
      const response = await UserService.toggleUserStatus(confirmData.id);
    
      if (response && response.success) {
        this.getUsers();
        const isActivating = !confirmData.active;
        this.$notify({
          title: isActivating 
            ? this.$t("carbonCredit.user.activatedSuccessfully") 
            : this.$t("carbonCredit.user.deactivatedSuccessfully"),
          type: "success",
        });
      } else {
        throw new Error('API call failed');
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      const isActivating = !confirmData.active;
      this.$notify({
        title: isActivating 
          ? this.$t("carbonCredit.user.activationFailed") 
          : this.$t("carbonCredit.user.deactivationFailed"),
        type: "error",
      });
    }
  },
  viewUser(item) {
    this.$router.push({ name: "userDetails", params: { id: item.id } });
  },
  getStatusText(status) {
    switch (status) {
      case 'active':
        return this.$t('carbonCredit.user.active');
      case 'pending':
        return this.$t('carbonCredit.user.pending');
      case 'deactivated':
        return this.$t('carbonCredit.user.deactivated');
      default:
        return status || 'N/A';
    }
  },
  getOrganizationName(orgId) {
    if (!orgId) return null;
    if (!Array.isArray(this.organizationList)) {
      return `Org ${orgId}`;
    }

    // Try to find organization by id or code
    const org = this.organizationList.find(org =>
      org.id === orgId ||
      org.code === orgId ||
      org.recordId === orgId
    );

    if (org) {
      return org.name || `Org ${orgId}`;
    }

    return `Org ${orgId}`;
  },
  getUserRole(userType, registrationUserType) {
    if (userType === 'offline') {
      return registrationUserType === 'corporate' ? 'Technician' : 'Farmer';
    }
    return userType === 'technician' ? 'Technician' : 'Farmer';
  },
  getUserRegistrationDateFormat(date) {
    return moment(date).format("DD-MMM-YYYY").toUpperCase();
  },
  getProjectTypeName(value) {
    const projectType = this.projectTypeList.find(type => type.value === value);
    return projectType ? projectType.name : value;
  },
  getProjectName(projectId) {
    const project = this.safeProjectList.find(project => project.id === projectId);
    return project ? project.project_title : `Project ${projectId}`;
  },
  getStatusClass(status) {
    switch (status) {
      case 'active':
        return 'green-button';
      case 'pending':
        return 'gray-button';
      case 'deactivated':
        return 'red-button';
      default:
        return 'gray-button';
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

/* Hide the action column when printing */
@media print {
.action-col {
  display: none !important;
}
}

.filter-card {
background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%) !important;
border: 1px solid #e0f2fe !important;
border-radius: 8px !important;
transition: all 0.3s ease;

&:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
}

.v-card__text {
  padding: 16px !important;
}

.text-caption {
  font-size: 12px !important;
  font-weight: 500 !important;
  color: #64748b !important;
}

.text-h6 {
  font-size: 16px !important;
  font-weight: 600 !important;
  color: #1e293b !important;
  line-height: 1.4 !important;
}
}
</style> 