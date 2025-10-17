<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-4">
        <h2>{{ $t('roleRequest.roleRequest')}}</h2>
        <v-spacer></v-spacer>
      </div>
      <v-card elevation="0" class="px-5">
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="items"
            v-model="selected"
            hide-default-footer
            :items-per-page="10"
            :loading="loading"
            :options.sync="tableOptions"
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
                  @click:append="searchRoleRequest"
                  @input="searchRoleRequest"
                  class="shrink"
                ></v-text-field>
                <span class="mt-3 ml-3 font-weight-bold mr-1">{{ $t('roleRequest.userRole')}}</span>
                <v-autocomplete
                  :items="roleList"
                  item-text="name"
                  item-value="id"
                  dense
                  outlined
                  v-model="roleRequestType"
                  style="max-width: 175px"
                  class="mr-5"
                  @change="getRoleRequestData"
                >
                <template slot="no-data">
                    {{ $t('noDataAvailable') }}
                  </template>
                </v-autocomplete>
                <span class="mt-3 ml-1 font-weight-bold mr-1">{{ $t('status')}}</span>
                <v-autocomplete
                  :items="[
                    { text: $t('all'), val: '' },
                    { text: $t('pending'), val: 'pending' },
                    { text: $t('memberDataSection.approved'), val: 'approved' },
                    { text: $t('memberDataSection.rejected'), val: 'rejected' },
                  ]"
                  item-text="text"
                  item-value="val"
                  dense
                  outlined
                  v-model="statusType"
                  style="max-width: 175px"
                  class="mr-5"
                  @change="getRoleRequestData"
                ></v-autocomplete>
                <v-spacer></v-spacer>
                <div class="py-1 title">
                  {{ from }} - {{ to }} {{ $t('of') }} {{ totalRecords }}
                </div>
                <v-btn
                  class="mx-2"
                  fab
                  small
                  outlined
                  color="primary"
                  :disabled="tableOptions.page <= 1"
                  @click="pageChange(false)"
                >
                  <v-icon dark> mdi-chevron-left </v-icon>
                </v-btn>
                <v-btn
                  class="mx-2"
                  fab
                  small
                  outlined
                  color="primary"
                  :disabled="tableOptions.page >= totalPages"
                  @click="pageChange(true)"
                >
                  <v-icon dark> mdi-chevron-right </v-icon>
                </v-btn>
              </div>
            </template>
            <template v-slot:progress>
              <v-progress-linear
                color="primary"
                :height="6"
                indeterminate
              ></v-progress-linear>
            </template>
            <template v-slot:no-data v-if="items.length < 1">
              {{ $t("userslist.noUser") }}
            </template>
            <template v-if="items.length > 0" v-slot:body="{ items }">
              <tbody>
                <tr
                  v-for="(item, id) in items"
                  :key="id"
                  style="position: relative; width: 0; height: 0"
                >
                  <td class="capitlize">{{ item.user_assoc.fullName }}</td>
                  <td class="capitlize">{{ item.user_assoc.email }}</td>
                  <td class="capitlize">{{ item.user_assoc.mobile }}</td>
                  <td class="capitlize">
                    {{ item.status == "approved" ? item.requested.name : "" }}
                  </td>
                  <td class="capitlize">{{ item.requested.name }}</td>
                  <td class="capitlize">
                    {{ formatDate(item.requested.createdAt) }}
                  </td>
                  <td class="text-capitlized text-center">
                    <v-btn
                      x-small
                      rounded
                      min-width="120"
                      depressed
                      class="green2 black--text green-border"
                      height="34"
                      @click="editRoleRequest(item)"
                      v-if="item.status == 'pending'"
                    >
                      {{ $t('roleRequest.approve')}}/{{ $t('roleRequest.reject')}}
                    </v-btn>
                    <p
                      v-else
                      class="text-capitalize font-weight-bold"
                      :class="getClass(item.status)"
                    >
                      {{ item.status }}
                    </p>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-container>
    <EditRoleRequest
      v-if="showEditRoleRequest"
      :dialog="showEditRoleRequest"
      :editedData="editedRoleRequest"
      @close-modal="closeRoleRequestModel"
    />
  </div>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";
import GeneralMixin from "@/mixins/GeneralMixin";
import RoleRequest from "@/_services/RoleRequest.js";
import EditRoleRequest from "./EditRoleRequest.vue";

export default {
  mounted() {
    document.title = this.$t("roleRequest.roleRequest");
    const fetchData = async () => {
      await this.getRoleList();
    };
    fetchData();
  },
  watch: {
    tableOptions: {
      async handler() {
        await this.getRoleRequestData();
      },
      deep: true,
    },
  },
  components: {
    EditRoleRequest,
  },
  methods: {
    async getRoleList() {
      try {
        const data = await RoleRequest.getRoleList();
        const d = data.data;
        const insert = (arr, index, newItem) => [
          ...arr.slice(0, index),
          newItem,
          ...arr.slice(index),
        ];

        const newArr = insert(d, 0, {
          id: "",
          name: "All",
        });
        this.roleList = newArr;
      } catch (e) {
        this.roleList = [];
      }
    },
    getClass(s) {
      return s == "rejected" ? "red--text" : "primary--text";
    },
    async getRoleRequestData() {
      this.loading = true;
      try {
        const data = await RoleRequest.getRoleRequestData(
          this.roleRequestType,
          this.statusType,
          this.search,
          this.tableOptions
        );
        if (data.code == 200) {
          // console.log('ddd', data);
          this.items = data.data.response;
          this.totalRecords = data.data.count;
          this.totalPages = Math.ceil(
            this.totalRecords / this.tableOptions.itemsPerPage
          );
          this.from =
            (this.tableOptions.page - 1) * this.tableOptions.itemsPerPage + 1;
          this.to =
            this.tableOptions.page * this.tableOptions.itemsPerPage -
            (this.tableOptions.itemsPerPage - data.data.response.length);
          this.loading = false;
        } else {
          this.loading = false;
          this.items = [];
        }
      } catch (e) {
        this.loading = false;
        this.items = [];
      }
    },

    // changeUserStatusType(type) {
    //     if(this.showStatusType == type) return;
    //     this.$router.push({ name: 'Users', params: { type } })
    // },

    searchRoleRequest() {
      this.tableOptions.page = 1;
      this.getRoleRequestData();
    },

    // resetSearchOnEmpty() {
    //     if(this.search != '') return;
    //     this.tableOptions.page = 1;
    //     this.getRoleRequestData()
    // },

    // async getUserData() {
    //   this.appUserCount = await UserService.getUsersConunt("end_user");
    //   this.adminUserCount = await UserService.getUsersConunt("admin");
    // },

    editRoleRequest(roleRequest) {
      this.editedRoleRequest = roleRequest;
      this.showEditRoleRequest = true;
    },

    pageChange(t) {
      if (t) this.tableOptions.page = this.tableOptions.page + 1;
      else this.tableOptions.page = this.tableOptions.page - 1;
    },

    closeRoleRequestModel(suc) {
      if (suc) this.getRoleRequestData();
      this.editedRoleRequest = null;
      this.showEditRoleRequest = false;
    },
  },
  data() {
    return {
      roleList: [],
      roleRequestType: "",
      statusType: "",
      csvData: null,
      appUserCount: 0,
      adminUserCount: 0,
      tab: 0,
      from: 0,
      to: 0,
      totalPages: 1,
      totalRecords: 0,
      tableOptions: {},
      search: "",
      selected: [],
      items: [],
      selectedItem: false,
      loading: false,
      showAddUser: false,
      showEditRoleRequest: false,
      showEditAppUser: false,
      showUploadUser: false,
      editedRoleRequest: null,
      status:[
            { text: this.$t("memberDataSection.all"), val: 'all'},
            { text: this.$t("memberDataSection.pending"), val: 'pending'},
            { text: this.$t("memberDataSection.approved"), val: 'approved'},
            { text: this.$t("memberDataSection.rejected"), val: 'rejected'},
        ],
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: true,
          to: "/",
        },
        {
          text: this.$t('roleRequest.roleRequest'),
          disabled: true,
          to: "breadcrumbs_link_1",
        },
      ],
      headers: [
        {
          text: this.$t('roleRequest.username'),
          sortable: true,
          value: "fullName",
          class: "black--text",
        },
        {
          text: this.$t('roleRequest.email'),
          value: "email",
          sortable: true,
          class: "black--text",
        },
        {
          text: this.$t('roleRequest.phone'),
          value: "phone",
          sortable: true,
          class: "black--text",
        },
        {
          text: this.$t('roleRequest.roleAssigned'),
          value: "role",
          sortable: false,

          class: "black--text",
        },
        {
          text: this.$t('roleRequest.roleRequested'),
          value: "requestedRole",
          sortable: true,
          class: "black--text",
        },
        {
          text: this.$t('roleRequest.requestedDate'),
          value: "requestedDate",
          sortable: true,
          class: "black--text",
        },
        {
          text: this.$t('status'),
          value: "status",
          class: "black--text",
          align: "center",
        },
      ],
    };
  },
  mixins: [loadingMixin, GeneralMixin],
};
</script>

<style lang="scss" scoped>
::v-deep .v-tab:hover {
  background-color: #caf1e2;
  color: $primary_color !important;
}

::v-deep .green-shadow:hover {
  background-color: $primary_color;
  color: white;
}

::v-deep .green-border {
  border: 2px solid black !important;
  text-transform: capitalize !important;
}
::v-deep .red-border {
  border: 2px solid red !important;
  text-transform: capitalize !important;
}
</style>
