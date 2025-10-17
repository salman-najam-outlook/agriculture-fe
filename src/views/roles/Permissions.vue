<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-4">
        <h2>{{ $t('permission') }}</h2>
        <v-spacer></v-spacer>
        <!-- <v-btn
                    color="primary"
                    dark
                    class="mr-3"
                    :to="{ name: 'Departments'}"
                    small
                >
                    Departments
                </v-btn> -->
      </div>
      <v-card elevation="0" class="px-5">
        <v-card-text class="pb-7">
          <div class="d-flex mt-5">
            <!-- <v-select
                            :items="departmentList"
                            item-text="name"
                            item-value="departmentNumber"
                            dense
                            outlined
                            class="shrink mr-2 wdt"
                            v-model="department"
                            placeholder="Select Department"
                            @change="getRoles"
                        ></v-select> -->
            <v-select
              :items="permissionsList"
              item-text="name"
              item-value="id"
              dense
              outlined
              class="shrink mr-2 wdt"
              v-model="role_number"
              :placeholder="$t('selectRole')"
              :loading="roleLoading"
            ></v-select>
            <!-- <v-btn
                            color="gray"
                            height="40"
                            width="40"
                            max-width="40"
                            outlined
                            class="ml-8"
                            @click="goToRole"
                        >
                            <v-icon>mdi-filter-outline</v-icon>
                        </v-btn> -->
          </div>
          <v-form>
            <v-data-table
              :headers="headers"
              :items="permissions"
              hide-default-footer
              :loading="loading"
              loading-text="Loading Data..."
              :items-per-page="-1"
            >
              <template v-slot:no-data v-if="permissions.length < 1">
                {{ $t('noData') }}
              </template>
              <template v-if="permissions.length > 0" v-slot:body="{ items }">
                <tbody>
                  <tr v-for="(item, i) in items" :key="item.moduleId">
                    <td>{{ i + 1 }}.</td>
                    <td width="25%">
                      {{ item.name }}
                    </td>
                    <td v-for="s in item.role_modules_permissions" :key="s.id">
                      <v-checkbox
                        v-model="s.permitted"
                        :label="s.permission_name"
                        color="primary"
                        @change="valueChanged(s)"
                        hide-details
                        :false-value="false"
                        :true-value="true"
                      ></v-checkbox>
                    </td>
                  </tr>
                </tbody>
              </template>
              <template v-slot:footer></template>
            </v-data-table>
          </v-form>
          <p class="mt-10">&nbsp;</p>
          <v-card-actions v-if="this.permissions.length">
            <v-spacer></v-spacer>
            <v-btn
              width="146"
              :to="{ name: 'Roles', params: { department: department } }"
              class=""
              >Cancel</v-btn
            >
            <v-btn width="146" @click="updatePermissions" class="primary"
              >Update</v-btn
            >
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import PermissionsMixin from "@/mixins/PermissionsMixin";
import loadingMixin from "@/mixins/LoadingMixin";
import PermissionsService from "@/_services/PermissionsService";
import _ from "lodash";

export default {
  mounted() {
    document.title = this.$t("permissions");
    // if(this.$route.params.department)
    // this.department = this.$route.params.department
    if (this.$route.params.role_number)
      this.role_number = this.$route.params.role_number;

    const fetchData = async () => {
      // this.startLoading()
      // this.departmentList = await this.getDepartments()
      // if(this.department)
      await this.getPermissions();
      // if(this.department && this.role_number)
      // this.permissions = await this.getRolePermissions('end_user')

      // this.stopLoading()
    };
    fetchData();
  },
  // watch: {
  //     '$route.params': {
  //         handler() {
  //             if(!this.role_number) return
  //             this.routeChanged()
  //         },
  //         deep: true,
  //         immediate: true
  //     },
  // },

  data() {
    return {
      roleLoading: false,
      department: "Admin",
      role_number: "",
      permissions: [],
      orgPermissions: [],
      departmentList: ["Admin"],
      permissionsList: [],
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
        {
          text: "Delete",
          value: "canRead",
          class: "black--text",
          width: "25%",
        },
        { text: "View", value: "canRead", class: "black--text", width: "25%" },
        {
          text: "Create",
          value: "canUpdate",
          class: "black--text",
          width: "25%",
        },
        {
          text: "Update",
          value: "canUpdate",
          class: "black--text",
          width: "25%",
        },
      ],
      breadcrumbs: [
        {
          text: "Permissions",
          disabled: true,
          to: { name: "Roles" },
        },
      ],
    };
  },
  methods: {
    async getPermissions() {
      // this.startLoading()
      this.permissionsList = [];
      this.roleLoading = true;
      this.permissionsList = await this.getRolesList();
      this.orgPermissions = this.permissionsList.slice();

      this.roleLoading = false;
      // this.stopLoading()
    },
    // goToRole(){
    //     this.$router.push({ name: 'Permissions', params: {role_number: this.role_number}})
    // },
    // async routeChanged() {
    //     if(!this.role_number) return
    //     this.startLoading()
    //     this.orgPermissions = await this.allModulesPermissions(this.role_number)
    //     const x = _.find(this.orgPermissions, {id: this.role_number})
    //     this.permissions = x.modules
    //     // this.permissions = [ ...this.orgPermissions ];
    //     console.log('org', this.permissions)
    //     this.stopLoading()
    // },

    async updatePermissions() {
      if (this.permissions == this.orgPermissions) return;
      const data = {
        departmentId: this.department,
        roleId: this.role_number,
        permissions: this.permissions,
      };
      this.startLoading();
      const res = await PermissionsService.updateRolePermissions(data);
      if (res.success) {
        this.$notify({
          title: "Permissions Updated",
          text: res.message,
          type: "success",
        });
      } else {
        this.$notify({
          title: "Permissions not Updated",
          text: "server error",
          type: "error",
        });
      }
      this.stopLoading();
    },
  },
  mixins: [PermissionsMixin, loadingMixin],
};
</script>
<style scoped>
::v-deep .wdt {
  width: 250px;
}
</style>