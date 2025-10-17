<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-4">
        <h2>{{ $t("manageOfflineFarmers") }}</h2>
        <v-spacer></v-spacer>
        <v-menu offset-y v-if="getModulePermittedActions.post">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" outlined small class="mr-2" v-bind="attrs" v-on="on">
              <v-icon small left dark>
                mdi-file-move-outline
              </v-icon>
             {{$t('reports.export')}}
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(item, index) in ['PDF', 'CSV', 'EXCEL']" :key="index" link>
              <v-list-item-title @click="download(item)">{{ item }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn
          color="primary" dark small class="mr-2"
          v-if="getModulePermittedActions.post" @click="openAddOfflineFarmer = true">
          {{$t('addnewOfflineFarmer')}}
        </v-btn>
      </div>
      <v-card elevation="0" class="px-5">
        <v-card-text>
          <v-data-table class="my-awesome-table" :headers="headers" :items="items" :items-per-page="10"
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
            <template v-slot:no-data v-if="items.length < 1">
              {{ $t("userslist.noUser") }}
            </template>
            <template v-if="items.length > 0" v-slot:body="{ items }">
              <tbody>
                <tr v-for="item in items" :key="item.id" @mouseover="selectItem(item)" @mouseleave="unSelectItem()"
                  style="position: relative; width: 0; height: 0">
                  <td>{{ item.farmer.fullName != null ? item.farmer.fullName : "N/A" }}</td>
                  <td>
                    {{ item.farmer.address != null ? item.farmer.address : "N/A" }}
                  </td>
                  <td class="capitlize">
                    {{ item.buyingStation ? item.buyingStation.fullName : "N/A" }}
                  </td>
                  <td class="capitlize">
                    {{ item.dateOfEntry != null ? item.dateOfEntry : "N/A" }}
                  </td>
                  <td>
                    {{ item.coffeeCherryQty ? item.coffeeCherryQty : "N/A" }}
                  </td>
                  <td>
                    {{ item.perKgPrice ? item.perKgPrice : "N/A" }}
                  </td>
                  <td class="capitlize text-center">
                    <div class="font-weight-black primary--text" v-if="item.status">{{ $t(status[item.status]) }}</div>
                    <v-btn v-else x-small rounded min-width="120" depressed class="xxxx" height="34"
                      @click="selectBuyingStation(item)">
                      {{ $t("manageFarmer") }}
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-container>
    <add-offline-user @closeAddOfflineUser="openAddOfflineFarmer = false" :openAddOfflineFarmer="openAddOfflineFarmer"
      @getUsers="getUsers" />
    <manage-farmer :openManageFarmer="openManageFarmer" @closeManageFarmer="openManageFarmer = false" 
      :selectedBuyingStation="selectedStation" :selectedData="selectedData"  @getUsers="getUsers"
    />
  </div>
</template>

<script>
import DownloadMixin from "@/mixins/DownloadMixin";
import loadingMixin from "@/mixins/LoadingMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";

import BuyingStationService from "@/_services/BuyingStationService";
import AddOfflineUser from './components/AddOfflineUser.vue';
import ManageFarmer from './components/ManageFarmer.vue';

export default {
  mounted() {
    document.title = this.$t("manageOfflineFarmers");
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
    AddOfflineUser,
    ManageFarmer,
  },
  methods: {
    selectItem(item) {
      this.selectedItem = item;
    },
    selectBuyingStation(item) {
      this.selectedStation = item.id;
      this.selectedData = {
        buyingStationId: item.buyingStationId,
        farmerId: item.farmerId
      }
      this.openManageFarmer = true;
    },
    unSelectItem() {
      this.selectedItem = false;
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
      try {
        this.loading = true;
        const params = {
          page: this.tableOptions.page,
          limit: this.tableOptions.limit,
          search: this.search,
          order: 'DESC'
        }
        const res = await BuyingStationService.getBuyingStationList(params);
        this.setUsers(res);
        } catch (err) {
        this.loading = false;
        this.items = [];
        console.log(err);
      }
    },

    searchUsers() {
      this.tableOptions.page = 1;
      this.getUsers();
    },

    pageChange(shouldChangeToNextPage) {
      if (shouldChangeToNextPage) {
        this.tableOptions.page = this.tableOptions.page + 1
      } else {
        this.tableOptions.page = this.tableOptions.page - 1;
      }
    },
    async download(type) {
      const params = {
        page: this.tableOptions.page,
        limit: this.tableOptions.limit,
        search: this.search,
        order: 'DESC'
      }
      this.loading = true;
      if (type === 'CSV') {
        await BuyingStationService.exportOffilneFarmer(params, "csv").then((res) => {
          this.downloadBlobFile(res, `manageOfflineFarmer-${Date.now()}.csv`);
          this.loading = false;
        })
      } else {
        const downloadType = type === 'EXCEL' ? 'xlsx' : 'pdf'
        this.$http.get(`/coffee/buying-station/purchase-order/download/${downloadType}`, {
          params,
          responseType: "arraybuffer",
          fileType: "pdf",
        }
        ).then(({ data }) => {
          this.downloadBlobFile(data, `manageOfflineFarmer-${Date.now()}.${downloadType}`);
          this.loading = false;
        })
      }
    },
  },
  data() {
    return {
      openManageFarmer: false,
      openAddOfflineFarmer: false,
      csvData: null,
      from: 0,
      to: 0,
      totalPages: 1,
      showingRows: 0,
      totalUsers: 0,
      tableOptions: {
        limit: 10,
      },
      search: "",
      selected: [],
      items: [],
      selectedItem: false,
      selectedStation: null,
      selectedData: null,
      status: {
        local: 'local',
        global: 'global',
        merged: 'merged',
        new_user: 'newUser',
      },
      loading: false,
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: true,
          to: "/",
        },
        {
          text: this.$t("manageFarmer"),
          disabled: true,
          to: "breadcrumbs_link_1",
        },
      ],
      headers: [
        {
          text: this.$t("name"),
          value: "farmer.fullName",
          align: "left",
          sortable: true,
          class: "text-no-wrap"
        },
        {
          text: this.$t('address'),
          value: "address",
          align: "left",
          sortable: true,
          class: "text-no-wrap"
        },
        {
          text: this.$t('reports.buyingStation'),
          value: "name",
          align: "left",
          sortable: true,
          class: "text-no-wrap"
        },
        {
          text: this.$t('userslist.registrationDate'),
          value: "name",
          align: "left",
          sortable: true,
          class: "text-no-wrap"
        },
        {
          text: this.$t("memberDataSection.quantity"),
          value: "name",
          align: "left",
          sortable: true,
          class: "text-no-wrap"
        },
        {
          text: this.$t("memberDataSection.pricePerKg"),
          value: "name",
          align: "left",
          sortable: true,
          class: "text-no-wrap"
        },
        {
          text: this.$t("status"),
          value: "name",
          align: "center",
          sortable: true,
          class: "text-no-wrap"
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
