<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
          <div class="d-flex mb-4">
      <h2>{{ $t("users") }}</h2>
      <v-spacer></v-spacer>
      <v-btn color="primary" dark class="mr-2" @click="addUser"
        v-show="showStatusType == 'admin' ">
        {{ $t("userslist.addNewAdmin") }}
      </v-btn>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" dark class="mr-2" 
            v-show="showStatusType == 'end_user' || showStatusType == 'all_users'" v-bind="attrs" v-on="on">
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
      <v-card class="mb-5">
        <v-card-text class="py-1">
          <v-tabs v-model="tab">
            <v-tab class="letterSpacing text-capitalize" value="all_users" @click="changeUserStatusType('all_users')">
              {{$t('all')}} ({{ totalUserCount }})</v-tab>
            <v-tab class="letterSpacing text-capitalize" value="end_user" @click="changeUserStatusType('end_user')">{{
              $t("app_users") }} ({{ appUserCount }})</v-tab>
              <v-tab class="letterSpacing text-capitalize" value="end_user" @click="changeUserStatusType('offline_user')">{{
              $t("offline_users") }} ({{ offlineUserCount }})</v-tab>
            <v-tab class="letterSpacing text-capitalize" value="admin" @click="changeUserStatusType('admin')">{{
              $t("admin_users") }} ({{ adminUserCount }})</v-tab>
          </v-tabs>
        </v-card-text>
      </v-card>
      <v-card elevation="0" class="px-5">
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
                  <v-btn color="primary" height="40" class="mr-4 px-4" outlined 
                    @click="downloadCsv" small>
                    <v-img width="15px" src="/icons/pngfile.png"></v-img>
                    <span class="ml-2">{{ $t('exportAsCSV') }}</span>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <div class="py-1 title">{{ $t("filterBy") }}</div>
                  <v-btn class="mx-2" icon color="primary" @click="showFilters = true">
                    <v-icon dark large>
                      mdi-filter
                    </v-icon>
                  </v-btn>
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
                <tr v-for="item in items" :key="item.id" style="position: relative; width: 0; height: 0">
                  <template v-if="showStatusType == 'end_user'">
                    <td>{{ item.id }}</td>
                    <td>{{ item.fullName != null ? item.fullName : "N/A" }}</td>
                    <td>
                      {{ item.email != null ? item.email : "N/A" }}
                    </td>
                    <td class="capitlize">
                      {{ item.mobile != null ? item.mobile : "N/A" }}
                    </td>
                    <td class="capitlize">
                      {{ item.createdAt != null ? item.createdAt : "N/A" }}
                    </td>
                    <td class="capitlize">{{ item.stateId != null ? item.stateId : 'N/A' }}</td>
                    <!-- <td class="capitlize">{{ item.village != null ? item.village : 'N/A' }}</td> -->
                    <td class="capitlize">
                      <span class="ml-1">{{
                        (item.activation && item.activation?.length)
                        ? item.activation[0].membership_assoc.membership_type
                        : "N/A"
                      }}</span>
                    </td>
                    <td class="capitlize d-flex align-center">
                      <div v-if="item.activation && item.activation?.length" class="square" :style="[
                        !item.activation[0].membership_assoc.membership_duration
                          ? { background: 'red' }
                          : { background: 'green' },
                      ]"></div>
                      <span class="ml-1">{{
                        (item.activation && item.activation?.length)
                        ? `${item.activation[0].membership_assoc.membership_duration}
                                              ${item.activation[0].membership_assoc.membership_duration_unit}`
                        : "N/A"
                      }}</span>
                    </td>
                    <!-- <td class="capitlize">
                      <div v-if="item.activation && item.activation?.length && item.activation[0].membershipExtendedDays">
                        {{ item.activation[0].membershipExtendedDays + "day(s)" }}

                      </div>
                    </td> -->
                  </template>
                  <template v-else>
                    <td>{{ item.id }}</td>
                    <td>{{ item.fullName != null ? item.fullName : "N/A" }}</td>
                    <td>
                      {{ item.email != null ? item.email : "N/A" }}
                    </td>
                    <td class="capitlize">
                      {{ item.mobile != null ? item.mobile : "N/A" }}
                    </td>
                    <td>
                      {{
                        item.user_role_assoc?.length
                        ? item.user_role_assoc[0].name
                        : "N/A"
                      }}
                    </td>
                    <td>
                      {{
                        (item.user_dept_assoc && item.user_dept_assoc?.length)
                        ? item.user_dept_assoc[0].name
                        : "N/A"
                      }}
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
                    <td>
                      <v-menu location="start">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn icon v-bind="attrs" v-on="on">
                            <v-icon>mdi-dots-vertical</v-icon>
                          </v-btn>
                        </template>
                        <v-list>
                          <v-list-item>
                            <v-list-item-title
                              class="cursor-pointer"
                              @click="editUser(item)"
                            >
                                {{ $t("edit") }}
                              </v-list-item-title
                            >
                          </v-list-item>
                          <v-list-item v-if="item.active == 1">
                            <v-list-item-title
                              class="cursor-pointer"
                              @click="changeUserStatus('0', item)"
                            >
                                {{ $t("deactivate") }}
                              </v-list-item-title
                            >
                          </v-list-item>
                          <v-list-item v-else>
                            <v-list-item-title
                              class="cursor-pointer"
                              @click="changeUserStatus('1', item)"
                            >
                                {{ $t("activate") }}
                              </v-list-item-title
                            >
                          </v-list-item>
                          <v-list-item v-if="showStatusType == 'end_user' && !!item.email?.trim().length">
                            <v-list-item-title
                              class="cursor-pointer"
                              @click="onUpdatePassword(item)"
                            >
                                {{ $t('password.updatePassword') }}
                              </v-list-item-title
                            >
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </td>
                  </template>
                </tr>
              </tbody>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-container>
    <v-dialog v-model="showFilters" width="356" @click:outside="closeFilter" content-class="my-custom-dialog"
      transition="dialog-bottom-transition">
      <v-card min-height="100vh" class="" rounded="0">
        <v-toolbar color="primary" class="white--text" flat :elevation="0">
          <v-toolbar-title class="font-weight-bold">{{
            this.$t("filterBy")
          }}</v-toolbar-title>
          <v-spacer></v-spacer>

          <v-btn icon class="white--text" @click="closeFilter">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pt-5">
          <v-row no-gutters>
            <v-col cols="12">
              <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">{{ this.$t("membershipPlans") }}</label>
              <v-select :items="membershipList" outlined dense :placeholder="$t('select')" item-text="membership_type"
                item-value="id" v-model="filterParam.membership_type"></v-select>
            </v-col>
            <v-col cols="12">
              <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">{{ this.$t("membershipValidity") }}</label>
              <v-select :items="membershipTypes" item-text="text" item-value="value" outlined dense :placeholder="$t('select')"
                v-model="filterParam.membership_validity"></v-select>
            </v-col>

            <v-col cols="12" v-if="filterParam.membership_validity == 'custom'">
              <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">{{ this.$t("membership.remainingDays")
              }}</label>
              <v-text-field outlined min="1" dense type="number" value="" v-model="filterParam.membershipRemainingDays">
              </v-text-field>
            </v-col>

            <v-col cols="12">
              <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">{{ this.$t("regionState") }}</label>
              <v-select :items="['Colorado', '2', '3']" outlined dense :placeholder="$t('comingSoon')"
                disabled></v-select>
            </v-col>

            <v-col cols="12">
              <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">{{ this.$t("cityTown") }}</label>
              <v-select :items="['A City', 'B City', 'C City']" outlined dense :placeholder="$t('comingSoon')"
                disabled></v-select>
            </v-col>
            <v-col></v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="d-flex justify-space-around">
              <v-btn outlined @click="clearFilters" width="130" color="primary">
                {{ this.$t("clearAll") }}
              </v-btn>
              <v-btn width="130" @click="searchWithFilter" color="primary">
                {{ this.$t("search") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
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
      :confirmData="confirmElements.confirmData" :dialog="confirm" @confirm:action="confirmDeactivate"  @cancel:action="confirm = false"       @continue:action="confirmDeactivate"
         ></confirm-box>
    <edit-app-user v-if="showEditAppUser" :user="editedUser" @appUserUpdated="appUserUpdated"
      @closeUpdateUser="editUserClosed" :dialogU="showEditAppUser"></edit-app-user>
    <SetPasswordDialog
      v-model="isUpdatePasswordDialogOpen"
      :userId="selectedUserForUpdatePassword?.id"
      @passwordSet="onPasswordSetFromDialog"
      @cancel="onPasswordSetCancel"
    ></SetPasswordDialog>
    <PasswordSentMessageDialog
      v-model="isPasswordSentMessageDialogOpen"
      :userName="selectedUserForUpdatePassword?.fullName"
      @close="onPasswordSentMessageClose"
    >
    </PasswordSentMessageDialog>
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
import { debounce } from "lodash";
import SetPasswordDialog from './SetPasswordDialog.vue';
import PasswordSentMessageDialog from './PasswordSentMessageDialog.vue';

export default {
  computed: {
    computedHeaders() {
      if (this.showStatusType === 'end_user') {
        return this.headers;
      } else {
        return this.adminHeaders;
      }
    }
  },
  mounted() {
      this.debouncedGetUsers = debounce(this.getUsers, 1000);
      console.log(this.$route.params.type, "route params type");
    if (!this.$route.params.type) {
      this.$router.push({ name: "Users", params: { type: "all_users" } });
    } else if (this.$route.params.type == "all_users") {
      this.showStatusType = "all_users";
      this.tab = 0;
    } else if (this.$route.params.type == "end_user") {
      this.showStatusType = "end_user";
      this.tab = 1;
    }else if (this.$route.params.type == "offline_user"){
      this.showStatusType = "offline_user";
      this.tab = 2;
    } else {
      this.showStatusType = "admin";
      this.tab = 3;
     }
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
    SetPasswordDialog,
    PasswordSentMessageDialog,
    EditAppUser,
    // AddSingleAppUser,
    AddMultipleAppUser,
  },
  methods: {
    onPasswordSetCancel() {
      this.isUpdatePasswordDialogOpen = false;
      this.selectedUserForUpdatePassword = null;
    },
    onUpdatePassword(user) {
      this.selectedUserForUpdatePassword = user;
      this.isUpdatePasswordDialogOpen = true;
    },
    async onPasswordSetFromDialog({ password, userId }) {
      try {
        this.startLoading();
        const response = await UserService.updateUserPassword(userId, password);
        if(response.success) {
          this.$notify({
            title: this.$t("success"),
            type: "success",
          });
          this.isUpdatePasswordDialogOpen = false;
          this.isPasswordSentMessageDialogOpen = true;
        } else {
          this.$notify({
            title: this.$t("failed"),
            type: "error",
          });
        }
      } catch (error) {
        console.error("Error updating password:", error);
        this.$notify({
          title: this.$t("failed"),
          type: "error",
        });
      } finally {
        this.stopLoading();
      }
    },
    onPasswordSentMessageClose() {
      this.selectedUserForUpdatePassword = null;
      this.isPasswordSentMessageDialogOpen = false;
    },
    addUser() {
      this.showAddUser = true;
    },
    uploadUsers() {
      this.showUploadUser = true;
    },
    userAdded(res) {
      if (res.success) {
        this.showAddAppUser = false
        if(res.user?.password) {
          this.isPasswordSentMessageDialogOpen = true;
        }
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
           text: this.$t(res?.message),
          type: "success",
        });
      } else {
        this.$notify({
          title: this.$t("addEdituser.userNotUpdated"),
          text: this.$t(res?.message),
          type: "error",
        });
      }
    },
    appUserUpdated(res) {
      console.log(res,"appUserUpdatedappUserUpdatedappUserUpdated" )
      if (res.success) {
        if(res.user?.password) {
          this.isPasswordSentMessageDialogOpen = true;
        }
        this.getUsers();
        this.$notify({
          title: this.$t("addEdituser.userUpdated"),
          type: "success",
        });
      } else {
        this.$notify({
          title: this.$t("addEdituser.userNotUpdated"),
          text: this.$t(res?.message),
          type: "error",
        });
      }
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
      console.log(this.showStatusType, "showStatusType");
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
    },

    async changeUserStatusType(type) {
            this.loading = true;
      if (this.showStatusType === type) return;
      this.showStatusType = type;
      await this.$router.push({ name: "Users", params: { type } });
      this.tableOptions.page = 1;
      await this.getUsers();
            this.loading = false;
    },

    searchUsers() {
            this.tableOptions.page = 1;
      this.debouncedGetUsers();

    },

    resetSearchOnEmpty() {
      if (this.search != "") return;
      this.tableOptions.page = 1;
      this.getUsers();
    },

    async getUserData() {
      this.totalUserCount = await UserService.getUsersConunt("all_users");
      this.appUserCount = await UserService.getUsersConunt("end_user");
      this.offlineUserCount = await UserService.getUsersConunt("offline_user");
      this.adminUserCount = await UserService.getUsersConunt("admin");
    },

    editUser(user) {
      console.log("eeee", user);
 
      this.editedUser = user;
      if (this.tab === 3){
         this.showEditUser = true;
        
      } else {
        if(user?.user_role_assoc?.length > 0) {
          this.showEditUser = true;
        } else {
          this.showEditAppUser = true;
        }
      }

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
      isUpdatePasswordDialogOpen: false,
      isPasswordSentMessageDialogOpen: false,
      selectedUserForUpdatePassword: null,
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
      showStatusType: "all_users",
      selectedUserType: "all_users",
      search: "",
      selected: [],
      items: [],
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
          text: this.$t("activationKey.logs.userId"),
          align: "start",
          sortable: true,
          value: "id",
          class: "black--text  text-no-wrap",
        },
        {
          text: this.$t("name"),
          align: "start",
          sortable: true,
          value: "firstName",
          class: "black--text  text-no-wrap",
          width: "300px",
        },
        {
          text: this.$t("email"),
          value: "email",
          sortable: true,
          class: "black--text text-no-wrap",
          width: "9%",
        },
        {
          text: this.$t("mobileNumber"),
          value: "mobile",
          sortable: true,
          class: "black--text text-no-wrap",
          width: "5%",
        },
        {
          text: this.$t("userslist.registrationDate"),
          value: "createdAt",
          sortable: true,
          class: "black--text text-no-wrap",
          width: "5%",
        },
        {
          text: this.$t("regionState"),
          value: "stateId",
          sortable: false,
          class: "black--text  text-no-wrap",
          width: "15%",
        },
        // {
        //   text: this.$t("cityTown"),
        //   value: "city",
        //   sortable: false,
        //   class: "black--text",
        //   width: "10%",
        // },
        {
          text: this.$t("membershipPlans"),
          value: "role",
          sortable: false,
          class: "black--text text-no-wrap",
          width: "15%",
        },
        {
          text: this.$t("membershipValidity"),
          value: "role",
          sortable: false,
          class: "black--text text-no-wrap",
          width: "16%",
        },
        // {
        //   text: this.$t("extendedValidity"),
        //   value: "role",
        //   sortable: false,
        //   class: "black--text text-no-wrap",
        // },
        {
          text: this.$t("status"),
          value: "active",
          align: "center",
          sortable: true,
          class: "black--text text-no-wrap",
        },
        {
          text: '',
          align: "start",
          value: "action",
          class: "black--text",
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
        {
          text: '',
          align: "start",
          value: "action",
          class: "black--text",
        },
      ],
    };
  },
  mixins: [loadingMixin, getPermittedActions, DownloadMixin]
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