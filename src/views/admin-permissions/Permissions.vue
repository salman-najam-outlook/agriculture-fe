<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <v-card class="mb-5">
        <v-card-text class="py-1">
          <v-tabs v-model="tab">
            <v-tab>{{ $t("app_users") }} ({{ appUserCount }})</v-tab>
            <v-tab>{{ $t("admin_users") }} ({{ adminUserCount }})</v-tab>
          </v-tabs>
        </v-card-text>
      </v-card>
      <div class="d-flex mb-4">
        <h2>{{ $t("permission") }}</h2>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          dark
          class="mr-3"
          height="40"
          outlined
          small
          v-if="(changedPerm.length >= 1 && getModulePermittedActions.put)"
          @click="cancelPermissions"
        >
          {{ $t("cancel") }}
        </v-btn>
        <v-btn
          color="primary"
          dark
          height="40"
          class="mr-3"
          @click="updatePermissions"
          small
          v-if="(changedPerm.length >= 1 && getModulePermittedActions.put)"
        >
          {{ $t("permissions.savePermissions") }}
        </v-btn>
      </div>
      <v-card elevation="0" class="px-5">
        <v-card-text class="pb-15">
          <v-tabs-items v-model="tab">
            <v-tab-item :value="0" class="pt-n10">
              <div class="d-flex pt-2">
                <v-text-field
                  prepend-inner-icon="mdi-magnify"
                  outlined
                  height="5px"
                  :placeholder="$t('search')"
                  dense
                  v-model="search"
                  class="shrink"
                  @input="searchModulePermission"
                ></v-text-field>
                <div class="d-inline-flex ml-3">
                  <span class="title black--text text-no-wrap"
                    >{{ $t('membershipPlans') }}</span
                  >
                  <v-select
                    :items="membershipType"
                    v-model="membershipTypeVal"
                    item-text="label"
                    item-value="val"
                    dense
                    outlined
                    class="shrink ml-2 wdt"
                    :placeholder="$t('permissions.selectMembership')"
                    @change="getUserRoles"
                  ></v-select>
                </div>
                <div class="d-inline-flex ml-3" v-if="membershipTypeVal != ''">
                  <span class="title black--text text-no-wrap">{{$t('userRole')}}</span>
                  <v-select
                    :items="appUserRoles"
                    item-text="name"
                    item-value="id"
                    dense
                    outlined
                    class="shrink ml-2 wdt"
                    :placeholder="$t('selectRole')"
                    v-model="appUserRole"
                    @change="getModulePermissionsByMembership"
                    :loading="usreRolesLoading"
                  ></v-select>
                </div>
                <v-spacer></v-spacer>
              </div>

              <div
                v-if="!appPermissions.length"
                class="text-center"
                style="padding-top: 5%"
              >
                <v-row align="center" justify="center">
                  <v-col>
                    <v-img
                      max-height="190"
                      max-width="190"
                      src="/icons/nodata.svg"
                      class="img-center"
                    ></v-img>
                    <h5 class="mt-4 red--text">{{ $t('noData') }}</h5>
                    <p class="text-caption black--text">
                      {{ $t('permissions.noPermMsg') }}
                    </p>
                  </v-col>
                </v-row>
              </div>
              <v-expansion-panels
                v-else
                flat
                focusable
                v-model="panel"
                multiple
              >
                <v-expansion-panel
                  class="mt-5"
                  v-for="p in appPermissions"
                  :key="p.id"
                >
                  <v-expansion-panel-header
                    class="text-h6 font-weight-bold black--text outline borderi"
                    >{{ p.name }}</v-expansion-panel-header
                  >
                  <v-expansion-panel-content class="pt-5">
                    <v-simple-table dense>
                      <template v-slot:default>
                        <thead class="primary white--text" height="50">
                          <tr>
                            <th class="text-left white--text">
                              {{ $t("permissions.moduleName") }}
                            </th>
                            <th class="text-left white--text">
                              {{ $t("permissions.delete") }}
                            </th>
                            <th class="text-left white--text">
                              {{ $t("permissions.view") }}
                            </th>
                            <th class="text-left white--text">
                              {{ $t("permissions.create") }}
                            </th>
                            <th class="text-left white--text">
                              {{ $t("permissions.update") }}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="m in p.modules" :key="m.id">
                            <td>{{ m.name }}</td>
                            <td
                              v-for="s in m.userrole_membership_permissions"
                              :key="s.id"
                            >
                              <!-- :label="s.permission_name" -->
                              <v-checkbox
                                v-model="s.permitted"
                                color="primary"
                                @change="valueChanged(s)"
                                hide-details
                                :false-value="false"
                                :true-value="true"
                                :disabled="!getModulePermittedActions.put"
                              ></v-checkbox>
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-tab-item>
            <v-tab-item :value="1">
              <AdminPermissions :adminRoleProp="adminRoleProp" />
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import PermissionsMixin from "@/mixins/PermissionsMixin";
import loadingMixin from "@/mixins/LoadingMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import PermissionsService from "@/_services/PermissionsService";
import AdminPermissions from "@/views/admin-permissions/AdminPermissions";
import UserService from "@/_services/UserService";
import _ from "lodash";

export default {
  components: {
    AdminPermissions,
  },
  mounted() {
    document.title = this.$t("permission");
    const fetchData = async () => {
      this.getUserData();
      // this.appUserRoles = await UserService.getAppUsersRoles();
    };
    fetchData();
  },
  data() {
    return {
      usreRolesLoading: false,
      appUserRoles: [],
      appUserRole: null,
      changedPerm: [],
      appUserCount: 0,
      adminUserCount: 0,
      panel: [0],
      tab: 0,
      roleLoading: false,
      department: null,
      role_number: null,
      permissions: [],
      appPermissions: [],
      orgPermissions: [],
      departmentList: [],
      rolesList: [],
      search: "",
      loading: false,
      headers: [
        {
          text: "Sr.",
          class: "black--text",
          sortable: false,
          width: "2%",
        },
        {
          text: "Module name",
          align: "start",
          sortable: false,
          value: "module",
          class: "black--text",
        },
        { text: "View", value: "canRead", class: "black--text", width: "15%" },
        {
          text: "Update",
          value: "canUpdate",
          class: "black--text",
          width: "15%",
        },
        {
          text: "Create",
          value: "canUpdate",
          class: "black--text",
          width: "15%",
        },
        {
          text: "Delete",
          value: "canUpdate",
          class: "black--text",
          width: "15%",
        },
      ],
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: false,
          to: "/",
        },
        {
          text: this.$t("permission"),
          disabled: true,
        },
      ],
      membershipTypeVal: "",
      membershipType: [],
      adminRoleProp: "",
    };
  },
  methods: {
    async getUserRoles() {
      this.usreRolesLoading = true;
      this.appUserRole = null;
      this.appPermissions = [];
      this.appUserRoles = [];
      this.appUserRoles = await UserService.getAppUsersRoles(this.membershipTypeVal);
      this.usreRolesLoading = false;
    },
    valueChanged(s) {
      // console.log(s)
      const x = _.find(this.changedPerm, { id: s.id });
      if (x)
        this.changedPerm = this.changedPerm.filter((item) => item.id !== s.id);
      else this.changedPerm.push({ id: s.id, permitted: s.permitted });

      // console.log(this.changedPerm)
    },
    async getUserData() {
      this.appUserCount = await UserService.getUsersConunt("end_user");
      this.adminUserCount = await UserService.getUsersConunt("admin");
    },
    async getPermissions() {
      this.startLoading();
      this.appPermissions = await this.getRolePermissions("app_user");
      this.appPermissions.forEach((prm) => {
        prm.modules.forEach((mdl) => {
          const v = _.find(mdl.role_modules_permissions, {
            permission_id: "get",
          });
          const c = _.find(mdl.role_modules_permissions, {
            permission_id: "post",
          });
          const u = _.find(mdl.role_modules_permissions, {
            permission_id: "put",
          });
          const d = _.find(mdl.role_modules_permissions, {
            permission_id: "delete",
          });
          if (v) mdl.role_modules_permissions[0] = v;
          else mdl.role_modules_permissions[0] = { permission_id: false };

          if (c) mdl.role_modules_permissions[1] = c;
          else mdl.role_modules_permissions[1] = { permission_id: false };

          if (u) mdl.role_modules_permissions[2] = u;
          else mdl.role_modules_permissions[2] = { permission_id: false };

          if (d) mdl.role_modules_permissions[3] = d;
          else mdl.role_modules_permissions[3] = { permission_id: false };
          // mdl.role_modules_permissions.sort( (a,b) => {
          //     const order = ['get', 'post', 'put', 'delete']
          //     const aIndex = order.indexOf(a.permission_id);
          //     const bIndex = order.indexOf(b.permission_id);
          //     if ( aIndex < bIndex ){
          //         return -1;
          //     }
          //     if ( aIndex > bIndex ){
          //         return 1;
          //     }
          //     return 0;
          // })
          // if(mdl.role_modules_permissions.length == 3)
          //     mdl.role_modules_permissions.push({permission_id: false})
        });
      });
      this.stopLoading();
    },
    goToRole() {
      this.$router.push({
        name: "Permissions",
        params: { department: this.department, role_number: this.role_number },
      });
    },
    async updatePermissions() {
      if (this.changedPerm.length < 1) return;

      this.startLoading();
      const res = await PermissionsService.updateAppPermissions({
        modulePermissionUpdates: this.changedPerm,
      });

      if (res.success) {
        this.changedPerm = []
        this.$notify({
          title: this.$t("permissions.permissionsUpdated"),
          type: "success",
        });
      } else {
        this.$notify({
          title: this.$t("permissions.permissionsNotUpdated"),
          text: "server error",
          type: "error",
        });
      }
      this.stopLoading();
    },
    cancelPermissions() {
      this.changedPerm = [];
      this.getModulePermissionsByMembership();
    },
    async getMembershipType() {
      const res = await this.getAllMembershipType();
      this.membershipType = res.map((item) => ({
        val: item.id,
        label: item.membership_type,
      }));
    },
    async getModulePermissionsByMembership() {
      this.startLoading();
      this.appPermissions = await this.getAllModulePermissionsByMembership(
        this.membershipTypeVal,
        this.appUserRole
      );
      this.stopLoading();
      this.appPermissions.forEach((prm) => {
        prm.modules.forEach((mdl) => {
          mdl["role_modules_permissions"] =
            mdl.userrole_membership_permissions.map((item) => ({
              ...item,
              permission_id: item.permissionId,
            }));
          const v = _.find(mdl.role_modules_permissions, {
            permission_id: "get",
          });
          const c = _.find(mdl.role_modules_permissions, {
            permission_id: "post",
          });
          const u = _.find(mdl.role_modules_permissions, {
            permission_id: "put",
          });
          const d = _.find(mdl.role_modules_permissions, {
            permission_id: "delete",
          });
          // console.log(v)
          if (v) mdl.role_modules_permissions[0] = v;
          else mdl.role_modules_permissions[0] = { permission_id: false };

          if (c) mdl.role_modules_permissions[1] = c;
          else mdl.role_modules_permissions[1] = { permission_id: false };

          if (u) mdl.role_modules_permissions[2] = u;
          else mdl.role_modules_permissions[2] = { permission_id: false };

          if (d) mdl.role_modules_permissions[3] = d;
          else mdl.role_modules_permissions[3] = { permission_id: false };
        });
      });
      this.appPermissions.sort((a, b) =>
        a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      );

      // this.stopLoading()
    },
    async searchModulePermission() {
      // this.startLoading()
      this.appPermissions = await this.searchModulePermissionMethod(
        this.membershipTypeVal,
        this.search
      );
      // console.log(this.appPermissions)
      this.appPermissions.forEach((prm) => {
        prm.modules.forEach((mdl) => {
          mdl["userrole_membership_permissions"] =
            mdl.userrole_membership_permissions.map((item) => ({
              ...item,
              permission_id: item.permissionId,
            }));
          const v = _.find(mdl.role_modules_permissions, {
            permission_id: "get",
          });
          const c = _.find(mdl.role_modules_permissions, {
            permission_id: "post",
          });
          const u = _.find(mdl.role_modules_permissions, {
            permission_id: "put",
          });
          const d = _.find(mdl.role_modules_permissions, {
            permission_id: "delete",
          });
          // console.log(v)
          if (v) mdl.role_modules_permissions[0] = v;
          else mdl.role_modules_permissions[0] = { permission_id: false };

          if (c) mdl.role_modules_permissions[1] = c;
          else mdl.role_modules_permissions[1] = { permission_id: false };

          if (u) mdl.role_modules_permissions[2] = u;
          else mdl.role_modules_permissions[2] = { permission_id: false };

          if (d) mdl.role_modules_permissions[3] = d;
          else mdl.role_modules_permissions[3] = { permission_id: false };
        });
      });
      this.appPermissions.sort((a, b) =>
        a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      );
      // console.log(res)
      // this.stopLoading()
    },
  },
  mixins: [PermissionsMixin, loadingMixin, getPermittedActions],
  created() {
    this.getMembershipType();
    if (this.$route.params?.type && this.$route.params.type === "app_user") {
      this.tab = 0;
      this.membershipTypeVal = this.$route.params.id;
      this.getModulePermissionsByMembership();
    } else if (
      this.$route.params?.type &&
      this.$route.params.type === "admin"
    ) {
      this.tab = 1;
      this.adminRoleProp = this.$route.params.id;
    }
  },
};
</script>
<style scoped lang="scss" >
::v-deep .img-center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 40%;
}
::v-deep .wdt {
  width: 250px;
}

::v-deep .borderi {
  border: 2px solid #e5e5e5 !important;
  border-radius: 5px;
}
</style>