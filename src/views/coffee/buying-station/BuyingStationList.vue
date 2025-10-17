<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-4">
        <h2>{{ isNaccuUser ? $t('memberDataSection.affiliates') : $t('memberDataSection.buyingStation') }}</h2>
        <v-spacer></v-spacer>
        <v-btn color="primary" dark class="mr-2 mb-2" @click="handleCreateBuyingStation">
          {{ isNaccuUser ? $t("memberDataSection.registerAffiliate") : $t("memberDataSection.registerBuyingStation") }}
        </v-btn>
      </div>
      <v-card elevation="0" class="px-5 mt-7">
        <v-card-text>
          <v-row style="margin-left:-30px; margin-bottom: 20px; margin-top: 15px;">
            <v-col cols="12">
              <v-data-table :headers="tableHeaders" :items="buyingStations" :items-per-page="10" :footer-props="{
                'items-per-page-options': [5, 10, 25, 50],
              }" item-key="id" hide-default-footer :loading="loading" :options.sync="options"
                :server-items-length="totalBuyingStations" :loading-text="$t('loadingData')
                  ">
                <template v-slot:top="{}">
                  <div class="d-flex align-center">

                    <div class="ml-3" style="width: 220px;">
                      <v-text-field style="width: 280px;" prepend-inner-icon="mdi-magnify" outlined height="5px"
                        :placeholder="isNaccuUser ? $t('memberDataSection.searchAffiliate') : $t('memberDataSection.searchBuyingStation')" dense v-model="search" @input="searchQuery"
                        class="shrink">
                      </v-text-field>
                    </div>


                    <v-spacer></v-spacer>
                    <div class="d-flex align-center mb-3">
                    <div class="py-1 title">
                      {{ fromBuyingStationList }} -
                      {{ toBuyingStationList }} {{ $t('of') }}
                      {{ totalBuyingStations }}
                    </div>
                    <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page <= 1"
                      @click="reportPageChange(false)">
                      <v-icon dark>
                        mdi-chevron-left
                      </v-icon>
                    </v-btn>
                    <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page >= totalPages"
                      @click="reportPageChange(true)">
                      <v-icon dark>
                        mdi-chevron-right
                      </v-icon>
                    </v-btn>
                    <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" left :min-width="417">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn class="mx-2" fab small outlined color="primary" v-bind="attrs" v-on="on">
                          <v-icon dark>mdi-cog-outline </v-icon>
                        </v-btn>
                      </template>
                      <v-card width="417">
                        <v-list>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>{{ $t("deforestation.customization")
                                }}</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                          <v-divider></v-divider>
                          <div class="pl-3 pt-2 font-weight-normal">
                            {{ $t("deforestation.recordsPerpage") }}
                          </div>
                          <v-list-item>
                            <v-list-item-content>
                              <v-slider v-model="itemsPerPageSlider" :tick-labels="itemsPerPageOptions" :max="3"
                                step="1" ticks="always" tick-size="4"></v-slider>
                            </v-list-item-content>
                          </v-list-item>
                          <v-divider class="mt-n3"></v-divider>
                        </v-list>
                        <v-card-text>
                          <v-container fluid>
                            <v-row>
                              <v-col class="mt-n9" cols="6" v-for="header in headers" :key="header.value">
                                <v-checkbox v-if="header.text" v-model="selectedHeaders" :label="header.text"
                                  color="primary" :value="header.text" hide-details
                                  :disabled="header.text == 'ID'"></v-checkbox>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-card-text>
                        <v-layout justify-center>
                          <v-card-actions class="mb-5">
                            <v-spacer></v-spacer>

                            <v-btn outlined color="primary" @click="resetDefault" width="190">
                              <span class="text-truncate" style="max-width:150px">{{ $t("deforestation.restoreDefault")
                                }}</span>
                            </v-btn>
                            <v-btn color="primary" @click="resetTableStructure" width="190">
                              {{ $t("deforestation.apply") }}
                            </v-btn>
                          </v-card-actions>
                        </v-layout>
                      </v-card>
                    </v-menu>

                    <!-- <v-tooltip top color="black" max-width="350">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn class="mx-2" fab small outlined color="primary" v-bind="attrs" v-on="on"
                          @click="exportToPDF">
                          <v-icon dark> mdi-download </v-icon>
                        </v-btn>
                      </template>

                      <span>
                        {{ $t("deforestation.download") }}
                      </span>
                    </v-tooltip>
                    <v-tooltip top color="black" max-width="350">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn class="mx-2" fab small outlined color="primary" v-bind="attrs" v-on="on"
                          @click="printPDF('document')">
                          <v-icon dark> mdi-printer </v-icon>
                        </v-btn>
                      </template>
                      <span>

                        {{ $t("deforestation.print") }}
                      </span>
                    </v-tooltip> -->
                    </div>
                  </div>
                </template>
                <template v-if="buyingStations.length" v-slot:body="{ items }">
                  <tbody>
                    <tr v-for="item in items" :key="item.id" style="position: relative; width: 0; height: 0"
                      @mouseover="selectItem(item)" @mouseleave="selectItem(false)">
                      <template v-for="h in tableHeaders">

                        <td class="text-truncate" :key="h.value + '_nameAndId'"
                          v-if="h.value == 'nameAndId'">
                          {{ item.name ? item.name : item.firstName + ' ' + item.lastName }}
                          <br />
                          {{ item.id_number ? item.id_number : 'N/A' }}
                        </td>

                        <td class="text-truncate" :key="h.value + '_email'"
                          v-else-if="h.value == 'email'">
                          {{ item.email ? item.email : "-" }}
                        </td>

                        <td class="text-truncate" :key="h.value + '_mobileNumber'"
                          v-else-if="h.value == 'mobileNumber'">
                          {{ item.mobileNumber ? item.mobileNumber : item.phoneNumber || "-" }}
                        </td>

                        <td class="text-truncate" :key="h.value + '_role'"
                          v-else-if="h.value == 'role'">
                          {{ item.role ? item.role : (isNaccuUser ? this.$t("memberDataSection.affiliate") : this.$t("memberDataSection.buyingStation")) }}
                        </td>

                        <td class="text-truncate" :key="h.value + '_status'"
                          v-else-if="h.value == 'status'">
                          <v-btn small rounded min-width="100" depressed class="green-button" height="40"
                              v-if="item.status === 'active'">
                              {{ $t("memberDataSection.active") }}
                          </v-btn>
                          <v-btn small rounded min-width="100" depressed class="red-button" height="40"
                              v-else-if="item.status === 'deactivated'">
                              {{ $t("memberDataSection.deactivated") }}
                          </v-btn>
                        </td>
                      </template>
                      
                      <!-- Action menu positioned absolutely -->
                      <div v-show="!hideOnPrint" style="position: absolute; right: -10px; top:10px;">
                        <v-menu location="start">
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn icon v-bind="attrs" v-on="on">
                              <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                          </template>

                          <v-list>
                            <v-list-item @click="viewBuyingStation(item)">
                              <v-list-item-title>{{ $t('memberDataSection.view') }}</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="editBuyingStation(item.id)">
                              <v-list-item-title>{{ $t('memberDataSection.edit') }}</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="activateBuyingStation(item.id)" v-if="item.status === 'deactivated'">
                              <v-list-item-title class="green--text">{{ $t('memberDataSection.activate') }}</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="deactivateBuyingStation(item.id)" v-if="item.status === 'active'">
                              <v-list-item-title class="red--text">{{ $t('memberDataSection.deactivate') }}</v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </div>
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

    <!-- User Selection Modal (for NACCU users) -->
    <UserSelectionModal 
      v-if="isNaccuUser"
      :dialog="userSelectionDialog"
      @close="closeUserSelectionDialog"
      @optionSelected="handleUserOptionSelected"
    />

    <!-- NACCU Single User Dialog -->
    <AddUser 
      v-if="isNaccuUser"
      :dialog="addUserDialog"
      @close="closeNaccuAddUserDialog"
      @userAdded="handleNaccuUserAdded"
    />

    <!-- NACCU Bulk Upload Dialog -->
    <UserBulkUpload 
      v-if="isNaccuUser"
      :dialog="bulkUploadDialog"
      @close="closeBulkUploadDialog"
      @bulkUploadCompleted="handleBulkUploadCompleted"
    />

    <!-- Add App User Dialog (for non-NACCU users) -->
    <AddAppUser 
      v-if="!isNaccuUser"
      :dialogI="addUserDialog" 
      :isMarketPlaceUser="false"
      @closeAddUser="closeAddUserDialog"
      @userAdded="handleUserAdded"
    />

    <!-- Edit App User Dialog -->
    <EditAppUser 
      v-if="editUserDialog && selectedBuyingStation"
      :dialogU="editUserDialog" 
      :user="selectedBuyingStation"
      :isMarketPlaceUser="false"
      @closeUpdateUser="closeEditUserDialog"
      @appUserUpdated="handleUserUpdated"
    />
  </div>


</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import download from "@/mixins/DownloadMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import DateMixin from "@/mixins/DateMixin";
import html2pdf from "html2pdf.js";
import printJS from "print-js";
import moment from 'moment';
import RoleMixin from "@/mixins/RoleMixin";
import { isKenyaClient, isIndonesianClient } from "@/utils";
import AddAppUser from "@/views/user/AddAppUser.vue";
import EditAppUser from "@/views/user/EditAppUser.vue";
import BuyingStationService from "@/_services/BuyingStationService";
import UserSelectionModal from "@/views/user/naccu-user/UserSelectionModal.vue";
import AddUser from "@/views/user/naccu-user/AddUser.vue";
import UserBulkUpload from "@/views/user/naccu-user/UserBulkUpload.vue";

export default {
  components: {
    AddAppUser,
    EditAppUser,
    UserSelectionModal,
    AddUser,
    UserBulkUpload,
  },
  created() {
    this.getBuyingStations();
  },
  async mounted() {
    this.tableHeaders = this.headers;
    this.selectedHeaders = this.allSelectedHeaders;
  },
  watch: {
    options: {
      handler(opt) {
        this.getBuyingStations(opt);
      },
      deep: true,
    },
  },
  computed: {
    isNaccuUser() {
      return isKenyaClient();
    },
    isIndonesianUser() {
      return isIndonesianClient();
    },
    isOwner() {
      return this.getCurrentRoles.some(x => ["operator_owner", "supplier_owner"].includes(x))
    },
    getOrganizationId() {
      return this.$store.getters.getUser?.user_organization?.id;
    },
    reportHeaders() {
      return this.headers.filter(header => this.selectedHeaders.includes(header.text));
    },
    totalPages() {
      return parseInt(Math.ceil(this.totalBuyingStations / 10))
    },
    breadcrumbs() {
      return [
        {
          text: this.$t("dashboard"),
          disabled: false,
          to: "/",
        },
        {
          text: this.isNaccuUser ? this.$t("memberDataSection.affiliates") : this.$t("memberDataSection.buyingStation"),
          disabled: true,
          href: "breadcrumbs_link_1",
        },
      ];
    },
  },
  data() {
    return {
      debounceTimer: null,
      fromBuyingStationList: 0,
      toBuyingStationList: 0,
      search: "",
      copyReport: [],
      loading: true,
      selectedItem: false,
      options: {
        limit: 10,
        page: 1,
        sortBy: ['id'],
        sortDesc: [true],
      },
      headers: [
        {
          text: this.$t("memberDataSection.nameAndId"),
          align: "start",
          value: "nameAndId",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("memberDataSection.email"),
          align: "start",
          value: "email",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("memberDataSection.mobileNumber"),
          align: "start",
          value: "mobileNumber",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("memberDataSection.role"),
          align: "start",
          value: "role",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("memberDataSection.status"),
          align: "start",
          value: "status",
          class: "black--text",
          sortable: true,
        },
      ],
      allSelectedHeaders: [
        this.$t('memberDataSection.nameAndId'),
        this.$t('memberDataSection.email'),
        this.$t('memberDataSection.mobileNumber'),
        this.$t("memberDataSection.role"),
        this.$t("memberDataSection.status"),
      ],
      menu: false,
      buyingStations: [],
      totalBuyingStations: 0,
      totalBuyingStationPages: 0,
      customizeMenu: false,
      customizeMenuAll: false,
      itemsPerPageOptions: [5, 10, 25, 50],
      itemsPerPageSlider: 1,
      selectedHeaders: [],
      tableHeaders: [],
      addUserDialog: false,
      editUserDialog: false,
      selectedBuyingStation: null,
      userSelectionDialog: false,
      bulkUploadDialog: false,
      confirmDeleteDialog: false,
      confirmDelete: {
        title: this.$t("memberDataSection.confirmDialog.delete.title"),
        message: this.$t("memberDataSection.confirmDialog.delete.message"),
        confirmBtnText: this.$t("memberDataSection.confirmDialog.delete.confirmBtn"),
        cancelBtnText: this.$t("cancel"),
        confirmData: {},
      },
      hideOnPrint: false,
    };
  },
  methods: {
    async exportToPDF() {
      const requestParams = {
        page: this.options.page,
        limit: this.options.limit,
        search: this.search,
      };
      const querys = new URLSearchParams(requestParams).toString();
      const token = this.$store.state.auth.token
      this.startLoading()
      const url = process.env.VUE_APP_API_BASE_URL || "https://api.dimitra.dev"
      this.downloadSourceFileWithToken(`${url}/buying-stations/pdf?${querys}`, "application/pdf", token, "buying-stations.pdf")
        .then(() => {
          this.stopLoading()
        }).catch(() => {
          this.stopLoading()
        })
    },

    async printPDF() {
      this.hideOnPrint = true;
      await this.$nextTick();
      const element = document.querySelector(".v-data-table__wrapper");
      let opt = {
        margin: 1,
        filename: "BuyingStationList.pdf",
        image: { type: "jpeg", quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
      };

      try {
        let worker = await html2pdf()
          .set(opt)
          .from(element)
          .toCanvas()
          .outputPdf("blob", "BuyingStationList.pdf");
        let file = new File([worker], "BuyingStationList.pdf", {
          type: "application/pdf",
        });
        var pdfUrl = await URL.createObjectURL(file);
        await printJS({ printable: `${pdfUrl}`, type: "pdf", showModal: true });
      } finally {
        this.hideOnPrint = false;
      }
    },
    async resetDefault() {
      this.tableHeaders = this.headers;
      this.selectedHeaders = this.allSelectedHeaders;
      this.menu = false;
      await this.getBuyingStations();
    },

    async resetTableStructure() {
      this.tableHeaders = this.headers.filter((header) =>
        this.selectedHeaders.includes(header.text)
      );
      this.options.limit = this.itemsPerPageOptions[
        this.itemsPerPageSlider
      ];
      await this.getBuyingStations();
      (this.customizeMenu = false), (this.customizeMenuAll = false);
    },

    getDateFormat(date) {
      return moment(date).format("DD/MM/YYYY");
    },

    viewBuyingStation(item) {
      this.$router.push({
        name: 'buyingStation',
        params: { id: item.id },
      });
    },

    handleCreateBuyingStation() {
      // Check if user is NACCU/Kenyan client
      if (this.isNaccuUser) {
        this.userSelectionDialog = true;
      } else {
        // For non-NACCU users, use the existing AddAppUser flow
        this.addUserDialog = true;
      }
    },
    searchQuery() {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => {
        this.options.page = 1;
        this.getBuyingStations();
      }, 500)
    },
    async getBuyingStations(opt = null) {
      this.loading = true;
      const requestParams = {
        page: this.options.page || 1,
        limit: this.options.limit || 10,
        search: this.search || null,
      };

      const isDesc = Array.isArray(opt?.sortDesc) && opt.sortDesc.length > 0 ? Boolean(opt.sortDesc[0]) : true;
      requestParams.orderField = 'id';
      requestParams.order = isDesc ? 'DESC' : 'ASC';

      try {
        const res = await BuyingStationService.listBuyingStations(requestParams);
        
        // Transform the API response to match the expected format
        const transformedData = res.data.rows.map(station => ({
          id: station.id,
          name: station.fullName || `${station.firstName || ''} ${station.middleName || ''} ${station.lastName || ''}`.trim(),
          firstName: station.firstName,
          middleName: station.middleName,
          lastName: station.lastName,
          id_number: station.id_number,
          email: station.email,
          mobileNumber: station.mobile,
          phoneNumber: station.mobile,
          role: this.isNaccuUser ? this.$t("memberDataSection.affiliate") : this.$t("memberDataSection.buyingStation"),
          status: station.active ? "active" : "deactivated",
          address: station.address
        }));

        this.buyingStations = transformedData;
        this.totalBuyingStations = res.data.totalRows;
        this.totalBuyingStationPages = Math.ceil(this.totalBuyingStations / this.options.limit);

        this.fromBuyingStationList = this.totalBuyingStations > 0
          ? (this.options.page - 1) * this.options.limit + 1
          : 0;
        this.toBuyingStationList = this.options.page * this.options.limit > this.totalBuyingStations
          ? this.totalBuyingStations
          : this.options.page * this.options.limit;

        this.loading = false;
      } catch (err) {
        this.loading = false;
        console.log("Error fetching buying stations:", err);
        this.$notify({
          text: "Error fetching buying stations",
          type: "error",
        });
      }
    },
  
    async editBuyingStation(id) {
      // Fetch full buying station details from the API
      try {
        const response = await BuyingStationService.getBuyingStationDetails(id);
        // API returns an object with { success, code, message, data }
        const station = response && response.data ? response.data : null;

        if (station) {
          // Map API response to EditAppUser expected structure
          this.selectedBuyingStation = {
            id: station.id,
            firstName: station.firstName || "",
            middleName: station.middleName || "",
            lastName: station.lastName || "",
            email: station.email || "",
            mobile: station.mobile || "",
            phoneNumber: station.mobile || "",
            country: station.country || "",
            countryId: station.country || station.countryId || "",
            countryCode: station.countryIsoCode || station.countryCode || "",
            stateId: station.stateId || "",
            district: station.district || "",
            village: station.village || "",
            city: station.city || "",
            address: station.address || "",
            userTribe: station.userTribe || "",
            website: station.website || "",
            id_number: station.id_number || "",
            active: Boolean(station.active),
            user_membership: Array.isArray(station.user_membership) ? station.user_membership : [],
            activation: Array.isArray(station.activation) ? station.activation : [],
          };

          this.editUserDialog = true;
        }
      } catch (err) {
        console.error("Error fetching buying station details:", err);
        this.$notify({
          text: err?.data?.message || "Error fetching buying station details",
          type: "error",
        });
      }
    },

    async activateBuyingStation(id) {
      this.loading = true;
      
      try {
        await BuyingStationService.activateBuyingStation(id);
        this.getBuyingStations();
        this.$notify({
          text: this.isNaccuUser ? this.$t("memberDataSection.affiliateActivatedSuccessfully") : this.$t("memberDataSection.activatedSuccessfully"),
          type: "success",
        });
        this.loading = false;
      } catch (err) {
        this.loading = false;
        this.$notify({
          text: err.response?.data?.message || "Error activating buying station",
          type: "error",
        });
        console.log("Error", err);
      }
    },

    async deactivateBuyingStation(id) {
      this.loading = true;
      
      try {
        await BuyingStationService.deactivateBuyingStation(id);
        this.getBuyingStations();
        this.$notify({
          text: this.isNaccuUser ? this.$t("memberDataSection.affiliateDeactivatedSuccessfully") : this.$t("memberDataSection.deactivatedSuccessfully"),
          type: "success",
        });
        this.loading = false;
      } catch (err) {
        this.loading = false;
        this.$notify({
          text: err.response?.data?.message || "Error deactivating buying station",
          type: "error",
        });
        console.log("Error", err);
      }
    },

    selectItem(item) {
      this.selectedItem = item;
    },
    resetSearchOnEmpty() {
      this.search = "";
      this.options = {
        page: 1,
        limit: 10,
      };
      this.getBuyingStations();
    },
    reportPageChange(t) {
      if (t) this.options.page = this.options.page + 1;
      else this.options.page = this.options.page - 1;
      this.getBuyingStations();
    },

    // Add User Dialog event handlers
    closeAddUserDialog() {
      this.addUserDialog = false;
    },

    handleUserAdded(result) {
      if (result.success) {
        this.getBuyingStations();
      }
    },

    // Edit User Dialog event handlers
    closeEditUserDialog() {
      this.editUserDialog = false;
      this.selectedBuyingStation = null;
    },

    handleUserUpdated(result) {
      if (result.success) {
        this.$notify({
          text: result.message,
          type: "success",
        });
        this.getBuyingStations();
      } else {
        this.$notify({
          text: result.message,
          type: "error",
        });
      }
    },

    // User Selection Modal handlers
    closeUserSelectionDialog() {
      this.userSelectionDialog = false;
    },

    handleUserOptionSelected(option) {
      if (option === 'single') {
        this.addUserDialog = true;
      } else if (option === 'multiple') {
        this.bulkUploadDialog = true;
      }
    },

    // NACCU Single User Dialog handlers
    closeNaccuAddUserDialog() {
      this.addUserDialog = false;
    },

    handleNaccuUserAdded(result) {
      if (result.success) {
        this.getBuyingStations();
      } 
    },

    // Bulk Upload Dialog handlers
    closeBulkUploadDialog() {
      this.bulkUploadDialog = false;
    },

    handleBulkUploadCompleted(result) {
      if (result.success) {
        this.getBuyingStations();
      } 
    },
  },
  mixins: [loadingMixin, download, getPermittedActions, DateMixin, RoleMixin],
};
</script>


<style lang="scss" scoped>
.blue-button {
  background-color: #d0e6fe !important;
  border: 2px solid #002287 !important;
  color: #002287 !important;
}

.orange-button {
  background-color: #fff7ec !important;
  border: 2px solid #ffa826 !important;
  color: #ffa826 !important;
}

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

.gray-button {
  background-color: #e8e8e8 !important;
  border: 2px solid #000000 !important;
  color: #000000 !important;
}

.green-button {
  background-color: #d4edda !important;
  border: 2px solid #28a745 !important;
  color: #28a745 !important;
}

.red-button {
  background-color: #f8d7da !important;
  border: 2px solid #dc3545 !important;
  color: #dc3545 !important;
}

/* Dynamic icon colors for rebranding */
.dynamic-icon-color {
  color: var(--primary-color, #00BD73) !important;
}

/* Indonesian client specific icon color */
[data-theme="indonesian"] .dynamic-icon-color {
  color: #184980 !important;
}

/* Kenya client specific icon color */
[data-theme="kenya"] .dynamic-icon-color {
  color: #A75300 !important;
}

/* Default client icon color */
.dynamic-icon-color {
  color: var(--primary-color, #00BD73) !important;
}
</style>
