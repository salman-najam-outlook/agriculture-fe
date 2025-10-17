<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-4">
        <h2>{{ $t('activationKey.activationKey') }}</h2>
        <v-spacer></v-spacer>
        <v-btn color="primary" dark small class="mr-3" @click="goToCSVfiles" v-if="!fromAppUser">
          {{ this.$t("activationKey.viewAllUplFiles") }}
        </v-btn>
        <!-- Removed ActivationKeyList permission module check, there is no such module -->
        <v-btn
          color="primary"
          dark
          small
          class="mr-3"
          @click="showBulkUploadUser = true"
          v-if="!fromAppUser"
        >
          {{ this.$t("activationKey.bulkUploadUsers") }}
        </v-btn>
        <v-btn
          color="primary"
          dark
          small
          class="mr-3"
          @click="generateActivationKey = true"
        >
          {{ this.$t("activationKey.generateActKey") }}
        </v-btn>
      </div>

      <v-card elevation="0" class="px-5">
        <v-card-text>
          <div
            v-if="!activationKeys"
            class="text-center"
            style="padding-top:5%"
          >
            <v-row align="center" justify="center">
              <v-col>
                <v-img
                  max-height="190"
                  max-width="190"
                  src="/icons/nodata.svg"
                  class="img-center"
                ></v-img>
                <h5 class="mt-4 red--text">{{ this.$t("activationKey.noActivationKeyFound") }}</h5>
                <p class="text-caption black--text">
                  {{ this.$t("activationKey.pleaseCreateAdminRole") }} <br />
                  {{ this.$t("activationKey.btnCreateAdmin") }} 
                </p>
              </v-col>
            </v-row>
          </div>

          <v-data-table
            :headers="headers"
            :items="activationKeys"
            :items-per-page="10"
            :footer-props="{
              'items-per-page-options': [10, 25, 50],
            }"
            hide-default-footer
            :loading="keysLoading"
            :options.sync="options"
            :server-items-length="totalActivationKeys"
            loading-text="Loading Activation Keys..."
          >
            <template v-slot:top="{}">
              <div class="d-flex mt-5">
                <v-text-field
                  prepend-inner-icon="mdi-magnify"
                  outlined
                  height="5px"
                  :placeholder="$t('search')"
                  dense
                  v-model="search"
                  @input="resetSearchOnEmpty"
                  class="shrink"
                ></v-text-field>
                <v-spacer></v-spacer>
                <div class="py-1 title">
                  {{ from }} - {{ to }} {{ $t('of') }} {{ totalActivationKeys }}
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
                  <v-icon dark>
                    mdi-chevron-left
                  </v-icon>
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
                  <v-icon dark>
                    mdi-chevron-right
                  </v-icon>
                </v-btn>
              </div>
            </template>
            <template v-if="activationKeys.length" v-slot:body="{ items }">
              <tbody>
                <tr
                  v-for="item in items"
                  :key="item.id"
                  style="position: relative; width: 0; height: 0"
                  @mouseover="selectItem(item)"
                  @mouseleave="selectItem(false)"
                >
                  <td>{{ getLocalTimeFromUTC(item.createdAt) }}</td>
                  <td class="text-truncate">
                    {{ item.generated_assoc.fullName || "N/A" }}
                  </td>
                  <td class="text-truncate">
                    {{ item.role_assoc.name || "N/A" }}
                  </td>
                  <td class="text-truncate">
                    {{ item.number_of_keys || "N/A" }}
                  </td>
                  <td class="text-truncate">
                    {{
                      item.membership_assoc
                        ? item.membership_assoc.membership_type
                        : "N/A"
                    }}
                  </td>
                  <td class="text-truncate">
                    {{
                      item.sales_manager_assoc
                        ? item.sales_manager_assoc.fullName
                        : "N/A"
                    }}
                  </td>
                  <td class="text-center">
                    <v-menu
                      transition="slide-x-transition"
                      left
                      absolute
                      offset-x
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          x-small
                          rounded
                          min-width="120"
                          color="primary"
                          filled
                          @click="showBulkUploadUser = true"
                          v-if="fromAppUser"
                        >
                         Upload Users
                        </v-btn>
                        <v-btn
                          x-small
                          plain
                          min-width="120"
                          color="primary"
                          v-bind="attrs"
                          v-on="on"
                          v-else
                        >
                          <v-icon>mdi-format-align-left</v-icon>
                        </v-btn>
                      </template>

                      <v-list>
                        <v-list-item @click="downloadCSV(item)">
                          <v-list-item-title>{{ $t("activationKey.donwloadAsCsv") }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="downloadPDF(item)">
                          <v-list-item-title>{{ $t("activationKey.donwloadAsPdf") }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="assignSalesManager(item)">
                          <v-list-item-title
                            >{{ $t("activationKey.assignSalesManager") }}</v-list-item-title
                          >
                        </v-list-item>
                        <v-list-item @click="sendViaEmail(item)">
                          <v-list-item-title>{{ $t("activationKey.shareViaEmail") }}</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </td>
                  <div
                    style="position: absolute; right: 10px; top:5px;"
                    v-if="item === selectedItem"
                  >
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          x-small
                          fab
                          v-bind="attrs"
                          v-on="on"
                          @click="
                            $router.push({
                              name: 'ActivationKeyGroupList',
                              params: { groupId: item.id },
                            })
                          "
                        >
                          <v-icon>mdi-eye</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t("activationKey.viewActKey") }}</span>
                    </v-tooltip>
                    <!--  <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn 
                                                    x-small 
                                                    fab
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    class="ml-2"
                                                    @click="deleteRole(item)"
                                                >
                                                    <v-icon>mdi-trash-can-outline</v-icon> 
                                                </v-btn>
                                            </template>
                                            <span>Delete</span>
                                        </v-tooltip> -->
                  </div>
                </tr>
              </tbody>
            </template>
            <template v-slot:footer></template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-container>
    <send-mail
      v-if="showSendMail"
      :generatedKey="generatedKey"
      :dialogU="showSendMail"
      @closeSendEmail="closeSendEmail"
    ></send-mail>
    <assign-manager
      v-if="showAssignManager"
      :generatedKey="generatedKey"
      :dialogU="showAssignManager"
      @closeAssignSalesManager="closeAssignSalesManager"
    ></assign-manager>
    <GenerateKey
      v-if="generateActivationKey"
      @keysGenerated="keysGenerated"
      @closeGenerateKeys="closeActivationKey"
      :dialogU="generateActivationKey"
    />
    <bulk-upload-user
      v-on:mail:sent="usersUploaded"
      v-if="showBulkUploadUser"
      :dialogU="showBulkUploadUser"
      @closeBulkUpload="showBulkUploadUser = false"
    ></bulk-upload-user>
  </div>
</template>
<script>
import SendMail from "./SendMail.vue";
import AssignManager from "./AssignManager.vue";
import loadingMixin from "@/mixins/LoadingMixin";
import GenerateKey from "./GenerateKey.vue";
import BulkUploadUser from "./BulkUploadUsers.vue";
import download from "@/mixins/DownloadMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import DateMixin from '@/mixins/DateMixin';

export default {
  created() {
    const fetchData = async () => {};
    fetchData();
  },
  components: {
    SendMail,
    AssignManager,
    GenerateKey,
    BulkUploadUser,
  },
  watch: {
    options: {
      handler(opt) {
        this.getActivationKey(opt);
      },
      deep: true,
    },
  },
  data() {
    return {
      generatedKey: null,
      generateActivationKey: false,
      showBulkUploadUser: false,
      confirm: false,
      confirmElements: {
        title: this.$t('adminRoles.deleteRole'),
        message: "Are you sure you want to delete Supervisor role?",
        confirmBtnText: this.$t('adminRoles.deleteRole'),
        cancelBtnText: "Cancel",
        confirmData: {},
      },
      editedRole: {},
      showEditRole: false,
      tab: 0,
      tabs: ["Active", "Deactive"],
      selectedItem: false,
      options: {},
      keysLoading: true,
      showSendMail: false,
      showAssignManager: false,
      department: "",
      departmentList: [],
      search: "",
      from: 0,
      to: 0,
      totalPages: 1,
      activationKeys: [],
      totalActivationKeys: 0,
      fromAppUser:this.$route.query.app_user,
      headers: [
        {
          text: this.$t("logs.time"),
          align: "start",
          value: "createdAt",
          class: "black--text",
        },
        {
          text: this.$t("activationKey.generatedBy"),
          value: "name",
          class: "black--text",
          sortable: false,
        },
        {
          text: this.$t("adminRoles.adminRoles"),
          align: "center",
          value: "status",
          class: "black--text",
          sortable: false,
        },
        {
          text: this.$t("activationKey.numberOfKeys"),
          align: "center",
          value: "status",
          class: "black--text",
          sortable: false,
        },
        {
          text: this.$t("activationKey.membershipPlan"),
          align: "center",
          value: "status",
          class: "black--text",
          sortable: false,
        },
        {
          text: this.$t("activationKey.salesManager"),
          align: "center",
          value: "status",
          class: "black--text",
          sortable: false,
        },
        {
          text: this.$t("activationKey.action"),
          align: "center",
          value: "status",
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
          text: this.$t("activationKey.activationKey"),
          disabled: true,
          href: "breadcrumbs_link_1",
        },
      ],
    };
  },
  methods: {
    closeActivationKey() {
      this.generateActivationKey = false;
    },
    keysGenerated(res) {
      if (res) this.getActivationKey();
      this.generateActivationKey = false;
    },
    async confirmDeactivate(res, role) {
      if (res) {
        this.startLoading();
        const response = await this.$http.delete(`roles/${role.id}`);
        if (response.data.code == 200) {
          this.$notify({
            title: response.data.message,
            type: "error",
          });
          this.confirm = false;
          this.getActivationKey();
          this.stopLoading();
        } else {
          this.$notify({
            title: response.data.message,
            type: "error",
          });
          this.stopLoading();
        }
        // console.log('d-res', response)
      } else {
        this.confirm = false;
      }
    },
    deleteRole(role) {
      this.confirmElements.confirmData = role;
      this.confirm = true;
    },
    async getActivationKey(opt) {
      this.keysLoading = true;
      const requestParams = {
        page: this.options.page,
        limit:this.options.itemsPerPage,
        searcPhrase: this.search
      }
        if (opt?.sortBy?.length) {
          requestParams.orderField = opt.sortBy[0]
          requestParams.order = opt.sortDesc[0] ? 'DESC' : 'ASC'
        }
      try {
        const response = await this.$http.get('/user/activation/generatedKeys', {
          params: requestParams
        })
        if (response.data.code === 200) {
          // console.log('222', response.data.data.listRes.rows.length)
          this.activationKeys = response.data.data.listRes.rows;
          this.totalActivationKeys = response.data.data.listRes.count;
          this.totalPages = Math.ceil(
            this.totalActivationKeys / this.options.itemsPerPage
          );
          this.from = (this.options.page - 1) * this.options.itemsPerPage + 1;
          this.to =
            this.options.page * this.options.itemsPerPage -
            (this.options.itemsPerPage -
              response.data.data.listRes.rows.length);
          this.keysLoading = false;
        } else {
          console.log(123);
          this.keysLoading = false;
        }
      } catch (err) {
        console.log("e", err);
        this.keysLoading = false;
      }
    },
    selectItem(item) {
      this.selectedItem = item;
    },
    resetSearchOnEmpty() {
      // if(this.search != '') return;
      // this.options.page = 1;
      this.getActivationKey();
    },
    pageChange(t) {
      if (t) this.options.page = this.options.page + 1;
      else this.options.page = this.options.page - 1;

      this.getActivationKey();
    },
    editRole(role) {
      this.editedRole = role;
      this.showEditRole = true;
    },
    closeSendEmail() {
      this.generatedKey = null;
      this.showSendMail = false;
    },
    managerAssigned() {
      this.showAssignManager = false;
    },
    usersUploaded() {
      this.showBulkUploadUser = false;
    },
    assignSalesManager(item) {
      this.generatedKey = item;
      this.showAssignManager = true;
    },
    closeAssignSalesManager() {
      this.generatedKey = null;
      this.showAssignManager = false;
      this.getActivationKey();
    },
    goToCSVfiles() {
      this.$router.push({ name: "ActivationKeyFiles" });
    },
    downloadCSV(item) {
      this.startLoading();
      this.$http
        .post(
          "/user/activation/download-report",
          {
            generatedKeyId: item.id,
            fileType: "csv",
          },
          {
            responseType: "arraybuffer",
          }
        )
        .then(({ data }) => {
          this.downloadBlobFile(data, "activation.csv");
          this.stopLoading();
        })
        .catch((error) => {
          console.log("error", error);
          this.stopLoading();
        });
    },

    downloadPDF(item) {
      this.startLoading();
      this.$http
        .post(
          "/user/activation/download-report",
          {
            generatedKeyId: item.id,
            fileType: "pdf",
          },
          {
            responseType: "arraybuffer",
          }
        )
        .then(({ data }) => {
          this.downloadBlobFile(data, "activationkey.pdf");
          // const blob = new Blob([data], { type: 'application/octet-stream' });
          // const link = document.createElement('a');
          // link.href = window.URL.createObjectURL(blob);
          // link.download = 'activationkey.pdf';
          // link.click();
          // window.URL.revokeObjectURL(link.href);
          this.stopLoading();
        })
        .catch((error) => {
          console.log("error", error);
          this.stopLoading();
        });
    },

    sendViaEmail(item) {
      this.generatedKey = item.id;
      this.showSendMail = true;
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
