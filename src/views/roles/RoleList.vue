<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-4">
        <h2>{{ $t("adminRoles.adminRoles") }}</h2>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          dark
          small
          @click="showAddRole = true"
          v-if="getModulePermittedActions.post"
        >
          {{ $t("adminRoles.createAdminRole") }}
        </v-btn>
      </div>

      <v-card elevation="0" class="px-5">
        <v-card-text>
          <div v-if="!roles" class="text-center" style="padding-top:5%">
            <v-row align="center" justify="center">
              <v-col>
                <v-img
                  max-height="190"
                  max-width="190"
                  src="/icons/nodata.svg"
                  class="img-center"
                ></v-img>
                <h5 class="mt-4 red--text">{{ $t("adminRoles.noRole") }}</h5>
                <p class="text-caption black--text">
                  {{ $t("adminRoles.noRoleMsg") }}
                </p>
              </v-col>
            </v-row>
          </div>

          <div v-if="roles">
            <v-data-table
              :headers="headers"
              :items="roles"
              :items-per-page="10"
              :footer-props="{
                'items-per-page-options': [10, 25, 50],
              }"
              hide-default-footer
              :loading="roleLoading"
              :options.sync="options"
              :server-items-length="totalRoles"
              loading-text="Loading Roles..."
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
                    {{ from }} - {{ to }} {{ $t('of')}} {{ totalRoles }}
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
              <template v-if="roles" v-slot:body="{ items }">
                <tbody>
                  <tr
                    v-for="item in items"
                    :key="item.id"
                    style="position: relative; width: 0; height: 0"
                    @mouseover="selectItem(item)"
                    @mouseleave="selectItem(null)"
                  >
                    <td>{{ item.name }}</td>
                    <td class="text-truncate">
                      {{ item.description || "N/A" }}
                    </td>
                    <td class="text-center">
                      <v-btn
                        x-small
                        plain
                        min-width="120"
                        color="primary"
                        :to="{
                          name: 'AdminPermissions',
                          params: { type: 'admin', id: item.id },
                        }"
                      >
                        {{ $t("adminRoles.viewPermissions") }}
                      </v-btn>
                    </td>
                    <div
                      style="position: absolute; right: 10px; top:5px;"
                      v-if="item === selectedItem && item.editable"
                    >
                      <v-tooltip bottom v-if="getModulePermittedActions.put">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            style="background-color: #00bd73"
                            x-small
                            fab
                            v-bind="attrs"
                            v-on="on"
                            @click="editRole(item)"
                          >
                            <v-icon style="color: white">mdi-pencil</v-icon>
                          </v-btn>
                        </template>
                        <span >{{ $t("edit") }}</span>
                      </v-tooltip>
                      <v-tooltip bottom v-if="getModulePermittedActions.delete">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                          
                            x-small
                            fab
                            v-bind="attrs"
                            v-on="on"
                            class="ml-2"
                            @click="deleteRole(item)"
                          >
                            <v-icon >mdi-trash-can</v-icon>
                          </v-btn>
                        </template>
                        <span>{{ $t("delete") }}</span>
                      </v-tooltip>
                    </div>
                  </tr>
                </tbody>
              </template>
              <template v-slot:footer></template>
            </v-data-table>
          </div>
        </v-card-text>
      </v-card>
    </v-container>
    <add-role
      v-on:role:added="roleAdded"
      v-if="showAddRole"
      :dialogI="showAddRole"
      @closeAddRole="showAddRole = false"
    ></add-role>
    <edit-role
      v-on:role:updated="roleUpdated"
      :role="editedRole"
      v-if="showEditRole"
      :dialogI="showEditRole"
      @closeAddRole="showEditRole = false"
    ></edit-role>
    <confirm-box
      :title="confirmElements.title"
      :message="confirmElements.message"
      :cancelBtnText="confirmElements.cancelBtnText"
      :confirmBtnText="confirmElements.confirmBtnText"
      :confirmData="confirmElements.confirmData"
      :dialog="confirm"
      @confirm:action="confirmDeactivate"
    ></confirm-box>
  </div>
</template>
<script>
import AddRole from "./AddRole.vue";
import EditRole from "./EditRole.vue";
import ConfirmBox from "@/components/ConfirmBox";

import loadingMixin from "@/mixins/LoadingMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";

export default {
  created() {
    const fetchData = async () => {};
    fetchData();
  },
  components: {
    AddRole,
    EditRole,
    ConfirmBox,
  },
  watch: {
    options: {
      handler() {
        this.getRoles();
      },
      deep: true,
    },
  },
  data() {
    return {
      confirm: false,
      confirmElements: {
        title: this.$t("adminRoles.deleteRole"),
        message: this.$t("adminRoles.deleteMsg"),
        confirmBtnText: this.$t('adminRoles.deleteRole'),
        cancelBtnText: this.$t('cancel'),
        confirmData: {},
      },
      editedRole: {},
      showEditRole: false,
      tab: 0,
      tabs: ["Active", "Deactive"],
      selectedItem: false,
      options: {},
      loading: false,
      roleLoading: false,
      showAddRole: false,
      department: "",
      departmentList: [],
      search: "",
      from: 0,
      to: 0,
      totalPages: 1,
      roles: [],
      totalRoles: 0,
      headers: [
        {
          text: this.$t("adminRoles.roleName"),
          align: "start",
          value: "name",
          class: "black--text",
        },
        {
          text: this.$t("adminRoles.description"),
          value: "name",
          class: "black--text",
          sortable: false,
        },
        {
          text: this.$t("permission"),
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
          text: this.$t("adminRoles.adminRoles"),
          disabled: true,
          href: "breadcrumbs_link_1",
        },
      ],
    };
  },
  methods: {
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
          this.getRoles();
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
    async getRoles() {
      this.roleLoading = true;
      try {
        const response = await this.$http.get(
          `/roles?page=${this.options.page}&limit=${this.options.itemsPerPage}&searchPhrase=${this.search}`
        );
        if (response.data.code === 200) {
          // console.log("222", response.data.data.listRes.rows.length);
          this.roles = response.data.data.listRes.rows;
          this.totalRoles = response.data.data.listRes.count;
          this.totalPages = Math.ceil(
            this.totalRoles / this.options.itemsPerPage
          );
          this.from = (this.options.page - 1) * this.options.itemsPerPage + 1;
          this.to =
            this.options.page * this.options.itemsPerPage -
            (this.options.itemsPerPage -
              response.data.data.listRes.rows.length);
          this.roleLoading = false;
        } else {
          console.log(123);
          this.roleLoading = false;
        }
      } catch (err) {
        console.log("e", err);
        this.roleLoading = false;
      }
    },
    selectItem(item) {
      this.selectedItem = item;
    },
    resetSearchOnEmpty() {
      // if(this.search != '') return;
      // this.options.page = 1;
      this.getRoles();
    },
    pageChange(t) {
      if (t) this.options.page = this.options.page + 1;
      else this.options.page = this.options.page - 1;

      this.getRoles();
    },
    editRole(role) {
      this.editedRole = role;
      this.showEditRole = true;
    },
    roleAdded(success) {
      if (success) this.getRoles();
      this.showAddRole = false;
    },
    roleUpdated(suc) {
      if (suc) this.getRoles();
    },
    changeRole() {
      this.options.page = 1;
      this.getRoles();
    },
  },
  mixins: [loadingMixin, getPermittedActions],
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
