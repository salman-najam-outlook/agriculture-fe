<template>
  <div>
    <div class="d-flex mb-4">
      <h2>{{ $t("Enterprise users") }}</h2>
      <v-spacer></v-spacer>
      <v-btn color="primary" dark class="mr-2" @click="addUser" v-if="showStatusType == 'admin'">
        {{ $t("userslist.addNewAdmin") }}
      </v-btn>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" dark class="mr-2" v-if="showStatusType == 'end_user'" v-bind="attrs" v-on="on">
            {{ $t("userslist.registerUser") }}
            <v-icon class="white--text ml-2">mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="showAddAppUser = true" class="cursor-pointer">
            {{ $t("userslist.singleUser") }}
          </v-list-item>
          <v-list-item @click="showAddMultipleUser = true" class="cursor-pointer">
            {{ $t("userslist.multipleUser") }}
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <div></div>
    <v-card class="my-5">
      <v-card-text class="py-1">
        <v-tabs v-model="tab">
          <v-tab class="letterSpacing text-capitalize" value="end_user" @click="changeUserStatusType('end_user')">
            {{ $t('all') }} ({{ totalUserCount }})</v-tab>
          <v-tab class="letterSpacing text-capitalize" value="end_user" @click="changeUserStatusType('end_user')">{{
            $t("app_users") }} ({{ appUserCount }})</v-tab>
          <v-tab class="letterSpacing text-capitalize" value="end_user" @click="changeUserStatusType('offline_user')">{{
            $t("offline_users") }} ({{ offlineUserCount }})</v-tab>
          <v-tab class="letterSpacing text-capitalize" value="admin" @click="changeUserStatusType('admin')">{{
            $t("admin_users") }} ({{ adminUserCount }})</v-tab>
        </v-tabs>
      </v-card-text>
    </v-card>
    <v-card elevation="0" >
      <v-card-text>
        <v-data-table class="my-awesome-table" :headers="computedHeaders" :items="items" :items-per-page="10"
          v-model="selected" :loading="loading" :loading-text="$t('userslist.userLoading')" :footer-props="{
            'items-per-page-options': [10, 25, 50],
            'show-first-last-page': true,
            'show-current-page': true,
            'items-per-page-text': 'Users per page',
          }" :options.sync="tableOptions" :server-items-length="totalUsers" hide-default-footer>
          <template v-slot:top>
            <div class="d-flex mt-5">
              <v-text-field prepend-inner-icon="mdi-magnify" outlined height="5px" :placeholder="$t('search')" dense
                v-model="search" @click:append="searchUsers" @input="searchUsers" class="shrink"></v-text-field>
              <v-spacer></v-spacer>
              <template v-if="showStatusType == 'end_user'">
                <v-btn color="primary" height="40" class="mr-4 px-4" outlined @click="downloadCsv" small>
                  <v-img width="15px" src="/icons/pngfile.png"></v-img>
                  <span class="ml-2">{{ $t('exportAsCSV') }}</span>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" height="45" width="175" max-width="175" outlined class="mr-5"
                  @click="clearFilters" v-if="dataFiltered">
                  <span class="">{{ $t('activationKey.clearAllFilters') }}</span>
                </v-btn>
              </template>
              <div class="py-1 title">
                {{ from }} - {{ to }} {{ $t('of') }} {{ totalUsers }}
              </div>
              <v-btn class="mx-2" fab small outlined color="primary" :disabled="tableOptions.page <= 1"
                @click="pageChange(false)">
                <v-icon dark>
                  mdi-chevron-left
                </v-icon>
              </v-btn>
              <v-btn class="mx-2" fab small outlined color="primary" :disabled="tableOptions.page >= totalPages"
                @click="pageChange(true)">
                <v-icon dark>
                  mdi-chevron-right
                </v-icon>
              </v-btn>
            </div>
          </template>
          <template v-slot:no-data v-if="items?.length < 1">
            {{ $t("userslist.noUser") }}
          </template>
          <template v-if="items?.length > 0" v-slot:body="{ items }">
            <tbody>
              <tr v-for="item in items" :key="item.id" @mouseover="selectItem(item)" @mouseleave="unSelectItem()"
                style="position: relative; width: 0; height: 0">
                <template v-if="showStatusType == 'end_user'">
                  <td>  <div v-if="item.activation && item.activation?.length" class="square" :style="[
                      !item.activation[0].membership_assoc.membership_duration
                        ? { background: 'red' }
                        : { background: 'green' },
                    ]"></div>
                    <span class="ml-1">{{
                      (item.activation && item.activation?.length)
                        ? `${item.activation[0].membership_assoc.membership_duration}
                      ${item.activation[0].membership_assoc.membership_duration_unit}`
                        : "N/A"
                    }}</span></td>
                  <td>{{ item.fullName != null ? item.fullName : "N/A" }} <br /> {{ item.id }}</td>
                  <td>
                    {{ item.email != null ? item.email : "N/A" }}
                  </td>
                  <td class="capitlize">
                    {{
                      item.user_role_assoc?.length
                        ? item.user_role_assoc[0].name
                        : "N/A"
                    }}
                  </td>
                  <td class="capitlize">
                    {{ item.createdAt != null ? formatDate(item.createdAt) : "N/A" }}
                  </td>
                </template>
                <template v-else>
                  <td>  <div v-if="item.activation && item.activation?.length" class="square" :style="[
                      !item.activation[0].membership_assoc.membership_duration
                        ? { background: 'red' }
                        : { background: 'green' },
                    ]"></div>
                    <span class="ml-1">{{
                      (item.activation && item.activation?.length)
                        ? `${item.activation[0].membership_assoc.membership_duration}
                      ${item.activation[0].membership_assoc.membership_duration_unit}`
                        : "N/A"
                    }}</span></td>
                     <td>{{ item.fullName != null ? item.fullName : "N/A" }} <br /> {{ item.id }}</td>
                  <td>
                    {{ item.email != null ? item.email : "N/A" }}
                  </td>
                  <td class="capitlize">
                    {{
                      item.user_role_assoc?.length
                        ? item.user_role_assoc[0].name
                        : "N/A"
                    }}
                  </td>
                  <td class="capitlize">
                    {{ item.createdAt != null ? formatDate(item.createdAt) : "N/A" }}
                  </td>
                </template>
                <td class="capitlize text-center">
                  <v-btn x-small rounded min-width="120" :color="item.active == '1' ? 'green2' : 'red2'" depressed
                    class="xxxx" :class="item.active == '1' ? 'primary--text' : 'red--text'
                      " height="34">
                    {{ item.active == 1 ? $t("active") : $t("deactivated") }}
                  </v-btn>
                </td>
                <template>
                  <div style="position: absolute; right: 10px; top:5px;" v-if="item === selectedItem">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn x-small fab v-bind="attrs" v-on="on" class="green-shadow" @click="editUser(item)">
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t("edit") }}</span>
                    </v-tooltip>
                    <v-tooltip bottom v-if="item.active == 1">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn x-small fab v-bind="attrs" v-on="on" class="ml-1 green-shadow"
                          @click="changeUserStatus('0', item)">
                          <v-icon>mdi-trash-can</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t("deactivated") }}</span>
                    </v-tooltip>
                    <v-tooltip bottom v-else>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn x-small fab v-bind="attrs" v-on="on" class="ml-1 green-shadow"
                          @click="changeUserStatus('1', item)">
                          <v-icon>mdi-play</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t("activate") }}</span>
                    </v-tooltip>
                  </div>
                </template>
              </tr>
            </tbody>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <add-user v-if="showAddUser" @userAdded="userAdded" @closeAddUser="showAddUser = false"
      :dialogI="showAddUser"></add-user>
    <edit-user v-if="showEditUser" :user="editedUser" @userUpdated="userUpdated" @closeUpdateUser="editUserClosed"
      :dialogU="showEditUser"></edit-user>
    <add-app-user v-if="showAddAppUser" @userAdded="userAdded" @closeAddUser="showAddAppUser = false"
      :dialogI="showAddAppUser"></add-app-user>
    <!-- <add-single-app-user v-if="showAddAppUser" @userAdded="userAdded" @closeAddUser="showAddAppUser = false"
      :dialogI="showAddAppUser"></add-single-app-user> -->
    <add-multiple-app-user v-if="showAddMultipleUser" @userAdded="userAdded" @closeAddUser="showAddMultipleUser = false"
      :dialogI="showAddMultipleUser">
    </add-multiple-app-user>
    <confirm-box :title="confirmElements.title" :message="confirmElements.message"
      :cancelBtnText="confirmElements.cancelBtnText" :confirmBtnText="confirmElements.confirmBtnText"
      :confirmData="confirmElements.confirmData" :dialog="confirm" @confirm:action="confirmDeactivate"
      @continue:action="confirmDeactivate"></confirm-box>
    <edit-app-user v-if="showEditAppUser" :user="editedUser" @appUserUpdated="appUserUpdated"
      @closeUpdateUser="editUserClosed" :dialogU="showEditAppUser"></edit-app-user>
  </div>
</template>
<script>
import DownloadMixin from "@/mixins/DownloadMixin";
import loadingMixin from "@/mixins/LoadingMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";

import AddUser from "@/views/user/AddUser";
import EditUser from "@/views/user/EditUser";
import ConfirmBox from "@/components/ConfirmBox";
import EditAppUser from "@/views/user/EditAppUser";
import UserService from "@/_services/UserService";
import ActivationKeyService from "@/_services/ActivationService.js";
import AddAppUser from "@/views/user/AddAppUser";
// import AddSingleAppUser from './AddSingleAppUser.vue';
import AddMultipleAppUser from './AddMultipleAppUser.vue';
import DateMixin from "@/mixins/DateMixin";
export default {
  computed: {
    computedHeaders() {
      if (this.showStatusType === 'end_user') {
        return this.headers;
      } else {
        return this.headers;
      }
    }
  },
  mounted() {
    // if (!this.$route.params.type) {
    //   this.$router.push({ name: "Users", params: { type: "end_user" } });
    // } else if (this.$route.params.type == "end_user") {
    //   this.showStatusType = "end_user";
    //   this.tab = 0;
    // } else if (this.$route.params.type == "offline_user"){
    //   this.showStatusType = "offline_user";
    //   this.tab = 1;
    // } else {
    //   this.showStatusType = "admin";
    //   this.tab = 2;
    //  }
    document.title = this.$t("users");
    const fetchData = async () => {
      this.getUserData();
      const [mt] = await Promise.all([
        ActivationKeyService.getAllMemberships(),
      ]);
      this.membershipList = mt.data.listRes;
    };
    fetchData();
  },
  watch: {
    tableOptions: {
      async handler() {
        await this.getUsers();
      },
      deep: true,
    },
  },
  components: {
    "add-user": AddUser,
    "add-app-user": AddAppUser,
    "confirm-box": ConfirmBox,
    "edit-user": EditUser,
    EditAppUser,
    // AddSingleAppUser,
    AddMultipleAppUser,
  },
  methods: {
    addUser() {
      this.showAddUser = true;
    },
    uploadUsers() {
      this.showUploadUser = true;
    },
    userAdded(res) {
      if (res.success) {
        this.showAddAppUser = false
        this.getUsers();
        this.getUserData();
        this.$notify({
          title: this.$t("addEdituser.userAdded"),
          type: "success",
        });
      } else {
        this.$notify({
          title: this.$t("addEdituser.userNotAdded"),
          type: "error",
        });
      }
    },
    userUpdated(res) {
      if (res.success) {
        this.getUsers();
        this.$notify({
          title: this.$t("addEdituser.userUpdated"),
          type: "success",
        });
      } else {
        this.$notify({
          title: this.$t("addEdituser.userNotUpdated"),
          type: "error",
        });
      }
    },
    appUserUpdated(res) {
      if (res.success) {
        this.getUsers();
        this.$notify({
          title: this.$t("addEdituser.userUpdated"),
          type: "success",
        });
      } else {
        this.$notify({
          title: this.$t("addEdituser.userNotUpdated"),
          type: "error",
        });
      }
    },
    selectItem(item) {
      this.selectedItem = item;
    },
    unSelectItem() {
      this.selectedItem = false;
    },
    async handleUser(userType) {
      this.selectedUserType = userType;
      this.tableOptions.page = 1;
      this.loading = true;
      await UserService.getUsers(
        this.tableOptions,
        userType,
        this.search,
        this.filterParam
      )
        .then((res) => {
          this.loading = false;
          this.setUsers(res)
        })
        .catch((err) => {
          this.loading = false;
          this.items = [];
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        })
    },
    setUsers(res) {
      if (res.success) {
        this.items = res.data.rows;
        this.items.forEach(element => {
          if (element.createdAt) {
            element.createdAt = element.createdAt.substr(0, 10);
          }
        });
        this.totalUsers = res.data.count;
        this.showingRows = res.data.rows.length;
        this.totalPages = Math.ceil(
          this.totalUsers / this.tableOptions.itemsPerPage
        );
        this.from =
          (this.tableOptions.page - 1) * this.tableOptions.itemsPerPage + 1;
        this.to =
          this.tableOptions.page * this.tableOptions.itemsPerPage -
          (this.tableOptions.itemsPerPage - res.data.rows.length);
        this.loading = false;
      }
    },
    async getUsers() {
      this.loading = true;
      if (this.showStatusType === 'end_user') {
        await UserService.getUsers(
          this.tableOptions,
          this.selectedUserType,
          this.search,
          this.filterParam
        )
          .then((res) => {
            this.setUsers(res)
          })
          .catch((err) => {
            this.loading = false;
            this.items = [];
            console.log(err);
          });
      } else {
        await UserService.getUsers(
          this.tableOptions,
          this.showStatusType,
          this.search,
          this.filterParam
        )
          .then((res) => {
            this.setUsers(res)
          })
          .catch((err) => {
            this.loading = false;
            this.items = [];
            console.log(err);
          });
      }
    },

    async changeUserStatusType(type) {
      if (this.showStatusType === type) return;
      await this.$router.push({ name: "esgAccountDashboard", params: { type } });
      this.showStatusType = type;
      this.tableOptions.page = 1;
      await this.getUsers();
    },

    searchUsers() {
      // if(this.search == '') return
      this.tableOptions.page = 1;
      this.getUsers();
    },

    resetSearchOnEmpty() {
      if (this.search != "") return;
      this.tableOptions.page = 1;
      this.getUsers();
    },

    async getUserData() {
      this.appUserCount = await UserService.getUsersConunt("end_user");
      this.offlineUserCount = await UserService.getUsersConunt("offline_user");
      this.adminUserCount = await UserService.getUsersConunt("admin");
      this.totalUserCount = this.appUserCount + this.adminUserCount + this.offlineUserCount
    },

    editUser(user) {
      // console.log("eeee", user);
      this.editedUser = user;
      if (this.tab === 1) this.showEditUser = true;
      else this.showEditAppUser = true;
    },

    changeUserStatus(status, user) {
      this.confirmElements.title =
        status == "1"
          ? this.$t("addEdituser.activateAct")
          : this.$t("addEdituser.deactivateAct");
      this.confirmElements.confirmBtnText =
        status == "1"
          ? this.$t("addEdituser.activateAct")
          : this.$t("addEdituser.deactivateAct");
      this.confirmElements.confirmData = { user: user, status: status };
      this.confirm = true;
    },

    confirmDeactivate(action, confirmData) {
      if (action) {
        // console.log('cnfDate', confirmData)
        this.startLoading();
        UserService.toggleUserStatus(confirmData.user.id)
          .then((res) => {
            if (res.success) {
              this.getUsers();
              this.getUserData();
              this.stopLoading();
              this.confirm = false;
              this.$notify({
                title:
                  confirmData.status == "1"
                    ? this.$t("addEdituser.userActivated")
                    : this.$t("addEdituser.userDeactivated"),
                type: "success",
              });
            } else {
              this.stopLoading();
              this.confirm = false;
              this.$notify({
                title: this.$t("addEdituser.userNotUpdated"),
                type: "error",
              });
            }
          })
          .catch(() => {
            // console.log(err)
            this.stopLoading();
            this.confirm = false;
          });
      } else {
        this.confirm = false;
      }
    },

    editUserClosed() {
      this.resetEditedUser();
      this.showEditUser = false;
      this.showEditAppUser = false;
    },

    editAppUserClosed() {
      // this.resetEditedUser();
      this.showEditAppUser = false;
    },

    resetEditedUser() {
      this.editedUser = {};
    },
    pageChange(t) {
      if (t) this.tableOptions.page = this.tableOptions.page + 1;
      else this.tableOptions.page = this.tableOptions.page - 1;

      // this.getUsers()
    },
    closeUploadUsers(success) {
      this.showUploadUser = false;
      if (success === true) {
        this.tab = 3;
        this.importKey = this.importKey + 1;
      }
    },
    closeFilter() {
      this.showFilters = false;
    },
    async downloadCsv() {
      this.startLoading();
      try {
        const { data } = await this.$http.get(
          `/userList/${this.showStatusType}`
        );
        this.csvData = data.data.rows;

        let csv = "Name,Email,Mobile,\n";
        this.csvData.forEach((row) => {
          csv += [row.fullName, row.email, row.mobile].join(",");
          csv += "\n";
        });

        const anchor = document.createElement("a");
        anchor.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
        anchor.target = "_blank";
        anchor.download = "users.csv";
        anchor.click();
        this.stopLoading();
      } catch (err) {
        console.log(err);
        this.stopLoading();
      }
    },

    searchWithFilter() {
      this.dataFiltered = true;
      this.closeFilter();
      this.getUsers();
    },
    clearFilters() {
      this.dataFiltered = false;
      this.closeFilter();
      this.filterParam.membership_type = "";
      this.filterParam.membership_validity = "";
      this.filterParam.membershipRemainingDays = null;
      this.getUsers();
    },
    addAppUser() {
      this.showAddAppUser = true;
    },
  },
  data() {
    return {
      totalUserCount: 0,
      offlineUserCount: 0,
      showAddMultipleUser: false,
      dataFiltered: false,
      membershipList: [],
      filterParam: {
        membership_type: "",
        membership_validity: "",
        membershipRemainingDays: 0,
      },
      membershipTypes: [
        { text: this.$t('lessThanOneMonth'), value: "lessThen1Month" },
        { text: this.$t('oneTo8Month'), value: "1-8Months" },
        { text: this.$t('sixTo12Month'), value: "6-12Months" },
        { text: this.$t('moreThanYear'), value: "moreThan1Year" },
        { text: this.$t('membership.validityLength.expired'), value: "expired" },
        { text: this.$t('membership.validityLength.custom'), value: "custom" },
      ],
      csvData: null,
      showFilters: false,
      appUserCount: 0,
      adminUserCount: 0,
      imported: 0,
      importKey: 1,
      tab: 0,
      from: 0,
      to: 0,
      totalPages: 1,
      showingRows: 0,
      transition: true,
      activeUsers: 0,
      deactiveUsers: 0,
      totalUsers: 0,
      importedUsers: 0,
      confirm: false,
      confirmElements: {
        title: this.$t("addEdituser.deactivateUser"),
        message: this.$t("addEdituser.deactivateMsg"),
        confirmBtnText: this.$t("addEdituser.activateAct"),
        cancelBtnText: this.$t("cancel"),
        confirmData: {},
      },
      tableOptions: {
        limit: 10,
      },
      showStatusType: "end_user",
      selectedUserType: "end_user",
      search: "",
      selected: [],
      items: [],
      selectedItem: false,
      loading: false,
      showAddUser: false,
      showEditUser: false,
      showEditAppUser: false,
      showUploadUser: false,
      showAddAppUser: false,
      editedUser: {
        name: "",
        email: "",
        mobile: "",
        password: "",
        department: "administrator",
        role: "manager",
      },
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: true,
          to: "/",
        },
        {
          text: this.$t("users"),
          disabled: true,
          to: "breadcrumbs_link_1",
        },
      ],
      headers: [
        {
          text: this.$t("esgPlatform.activationKey"),
          align: "start",
          sortable: true,
          value: "id",
          class: "black--text  text-no-wrap",
        },
        {
          text: this.$t("esgPlatform.userNameAndId"),
          align: "start",
          sortable: true,
          value: "firstName",
          class: "black--text  text-no-wrap",
          width: "300px",
        },
        {
          text: this.$t("esgPlatform.email"),
          value: "email",
          sortable: true,
          class: "black--text text-no-wrap",
          width: "9%",
        },
        {
          text: this.$t("esgPlatform.userRole"),
          value: "mobile",
          sortable: true,
          class: "black--text text-no-wrap",
          width: "5%",
        },
        {
          text: this.$t("esgPlatform.userRegistrationDate"),
          value: "createdAt",
          sortable: true,
          class: "black--text text-no-wrap",
          width: "5%",
        },
        {
          text: this.$t("status"),
          value: "active",
          align: "center",
          sortable: true,
          class: "black--text text-no-wrap",
          width: "10%",
        },
      ],
      adminHeaders: [
        {
          text: this.$t("logs.userId"),
          align: "start",
          sortable: true,
          value: "id",
          class: "black--text text-no-wrap",
        },
        {
          text: this.$t("name"),
          align: "start",
          sortable: true,
          value: "firstName",
          class: "black--text text-no-wrap",
          width: "20%",
        },
        {
          text: this.$t("email"),
          value: "email",
          sortable: true,
          class: "black--text text-no-wrap",
        },
        {
          text: this.$t("mobileNumber"),
          value: "mobile",
          sortable: true,
          class: "black--text text-no-wrap",
        },
        {
          text: this.$t("role"),
          value: "role",
          sortable: false,
          class: "black--text",
        },
        {
          text: this.$t("department"),
          value: "department",
          sortable: false,
          class: "black--text text-no-wrap",
        },
        {
          text: this.$t("status"),
          value: "active",
          align: "center",
          sortable: true,
          class: "black--text text-no-wrap",
        },
      ],
    };
  },
  mixins: [loadingMixin, getPermittedActions, DownloadMixin, DateMixin]
};
</script>

<style lang="scss" scoped>
.letterSpacing {
  letter-spacing: 0;
}

.my-awesome-table {
  table-layout: fixed;
}

::v-deep .v-tab:hover {
  background-color: #caf1e2;
  color: $primary_color !important;
}

::v-deep .green-shadow:hover {
  background-color: $primary_color;
  color: white;
}

::v-deep .my-custom-dialog {
  position: absolute;
  top: 0;
  min-height: 100%;
  right: 0;
  margin-right: 0px;
  margin-top: 0px;
}

::v-deep .square {
  width: 1vw;
  height: 1vw;
}

::v-deep .xxxx {
  border: 2px solid black;
}
</style>