<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-4">
        <h2>{{ $t('marketplace.sellers.sellers') }}</h2>
        <v-spacer></v-spacer>
        <div class="d-flex mt-1">
          <v-btn @click="gotoAddUser" color="primary" dark large class="mr-2">
            {{ $t('marketplace.sellers.addSeller') }}
          </v-btn>
        </div>
      </div>
      <v-card elevation="0" class="px-5">
        <v-card-text>
          <v-data-table class="my-awesome-table" :headers="headers" :items="items" :items-per-page="10"
            v-model="selected" :loading="tableLoading" :loading-text="'Seller loading'" :footer-props="{
              'items-per-page-options': [10, 25, 50],
              'show-first-last-page': true,
              'show-current-page': true,
              'items-per-page-text': 'Seller per page',
            }" :options.sync="tableOptions" :server-items-length="20" hide-default-footer>
            <template v-slot:top>
              <div class="d-flex mt-5">
                <v-text-field prepend-inner-icon="mdi-magnify" outlined width="1500px"
                  :placeholder="$t('marketplace.sellers.searchBySeller')" dense v-model="search"
                  @click:append="searchSeller" @input="debouncedSearchSeller" class="shrink search-input"
                  clearable></v-text-field>
                <v-spacer></v-spacer>
                <div class="py-1 title">{{ $t("filterBy") }}</div>
                <v-btn class="mx-2" icon color="primary" @click="showFilters = true">
                  <v-icon dark large>
                    mdi-filter
                  </v-icon>
                </v-btn>
                <div class="py-1 title">
                  {{ from }} - {{ to }} {{ $t("marketplace.sellers.filter.of") }} {{ totalSellers }}
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
              <div class="empty-table">
                <img src="../../assets/img/no-data.png" alt="No data" class="no-data-img">
                <p>
                  <span class="no-data-found">{{ $t('marketplace.sellers.noDataFound') }}</span> <br>
                  <span>{{ $t('marketplace.sellers.youHaveNotAddedAnySellerYet') }}</span> <br>
                  <span>{{ $t('marketplace.sellers.pleaseAddTheSellersToStart') }}</span> <br>
                </p>
              </div>
            </template>
            <template v-if="items.length > 0" v-slot:body="{ items }">
              <tbody>
                <tr v-for="item in items" :key="item.id" @mouseover="selectItem(item)" @mouseleave="unSelectItem()"
                  style="position: relative; width: 0; height: 0">
                  <template>
                    <td> {{ item.full_name }} </td>
                    <td> {{ item.total_products }} </td>
                    <td class="capitlize"> {{ item.total_completed_orders }} </td>
                    <td class="capitlize"> {{ item.email }} </td>
                    <td class="capitlize"> {{ item.city }} </td>
                    <td class="capitlize"> {{ item.country }} </td>
                    <td>
                      <v-chip class="chips-table" outlined :color="item.is_active ?  'primary': 'red'"> {{ !item.is_active ?
                        $t('marketplace.sellers.deactivated') : $t('marketplace.sellers.active') }} </v-chip>
                    </td>
                    <td>
                      <v-menu location="start">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn icon v-bind="attrs" v-on="on">
                            <v-icon>mdi-dots-vertical</v-icon>
                          </v-btn>
                        </template>

                        <v-list>
                          <v-list-item class="show-pointer" @click="editUser(item)">
                            <v-list-item-title>{{ $t('edit') }}</v-list-item-title>
                          </v-list-item>
                          <v-list-item class="show-pointer" @click="showActivateDeactivateModal(item)">
                            <v-list-item-title>{{
                              $t('marketplace.sellers.activateDeactivate') }}</v-list-item-title>
                          </v-list-item>
                          <v-list-item @click="confirmDeleteModal(item)">
                            <v-list-item-title>{{ $t('remove') }}</v-list-item-title>
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
      <v-dialog v-model="showFilters" width="382" @click:outside="closeFilter" content-class="my-custom-dialog"
        transition="dialog-bottom-transition">
        <v-card min-height="100vh" class="" rounded="0">
          <v-toolbar color="primary" class="white--text" flat :elevation="0">
            <v-toolbar-title class="font-weight-bold">{{ this.$t('filterBy') }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon class="white--text" @click="closeFilter">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text class="pt-5">
            <v-row no-gutters>
              <v-col cols="12">
                <v-expansion-panels v-model="panel" multiple flat>
                  <v-expansion-panel>
                    <v-expansion-panel-header>
                      {{ $t("marketplace.sellers.filter.product") }}
                      <hr class="filter-hr">
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-autocomplete :items="products" v-model="filterData.selectedProducts" item-text="name"
                        item-value="id" outlined dense :label="$t('marketplace.sellers.filter.selectProduct')" multiple
                        chips clearable></v-autocomplete>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                  <!-- <v-expansion-panel>
                    <v-expansion-panel-header>
                      {{ $t("marketplace.sellers.filter.category") }}
                      <hr class="filter-hr">
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-autocomplete :items="categories" v-model="filterData.selectedCategories" item-text="name"
                        item-value="id" outlined dense :placeholder="$t('selectCategory')" multiple chips
                        clearable></v-autocomplete>
                      <v-autocomplete :items="subCategories" v-model="filterData.selectedSubCategories" item-text="name"
                        item-value="id" outlined dense :placeholder="$t('selectSubCategory')" multiple chips
                        clearable></v-autocomplete>
                    </v-expansion-panel-content>
                  </v-expansion-panel> -->
                  <v-expansion-panel>
                    <v-expansion-panel-header>
                      {{ $t("marketplace.sellers.filter.countries") }}
                      <hr class="filter-hr">
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-container fluid>
                        <div class="list-countries">
                          <v-col cols="12" class="ma-0 pa-0" v-for="country in countries" :key="country.id">
                            <v-checkbox v-model="filterData.selectedCountries" :label="country.name"
                              :value="country.name"></v-checkbox>

                          </v-col>
                        </div>
                      </v-container>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                  <v-expansion-panel>
                    <v-expansion-panel-header>
                      {{ $t("marketplace.sellers.filter.noOfProducts") }}
                      <hr class="filter-hr">
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-row>
                        <v-col>
                          <v-text-field v-model="filterData.minProducts" :label="$t('marketplace.sellers.filter.from')"
                            outlined dense></v-text-field>
                        </v-col>
                        <v-col>
                          <v-text-field v-model="filterData.maxProducts" :label="$t('marketplace.sellers.filter.to')"
                            outlined dense></v-text-field>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                  <v-expansion-panel>
                    <v-expansion-panel-header>
                      {{ $t("marketplace.sellers.filter.noOfOrders") }}
                      <hr class="filter-hr">
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-row>
                        <v-col>
                          <v-text-field v-model.number="filterData.orderFrom" type="number"
                            :label="$t('marketplace.sellers.filter.from')" outlined dense></v-text-field>
                        </v-col>
                        <v-col>
                          <v-text-field v-model.number="filterData.maxOrders" type="number"
                            :label="$t('marketplace.sellers.filter.to')" outlined dense></v-text-field>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                  <v-expansion-panel>
                    <v-expansion-panel-header>
                      {{ $t("marketplace.sellers.filter.sellerStatus") }}
                      <hr class="filter-hr">
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-container fluid>
                        <v-checkbox v-model.number="filterData.selectedStatus" type="number"
                          :label="$t('marketplace.sellers.active')" value="active"></v-checkbox>
                        <v-checkbox v-model.number="filterData.selectedStatus" type="number"
                          :label="$t('marketplace.sellers.deactivated')" value="deactivated"></v-checkbox>
                      </v-container>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="d-flex justify-space-around">
                <v-btn outlined width="130" color="primary" @click="clearFilters" :disabled="!hasActiveFilters">
                  {{ $t('clearAll') }}
                </v-btn>
                <v-btn width="130" color="primary" @click="applyFilters" :loading="searchLoading">
                  {{ $t('search') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog width="560" v-if="showActivateDeactivate" v-model="showActivateDeactivate">
        <activate-deactivate :selectedUser="selectedUser" :showActivateDeactivate="showActivateDeactivate"
          @closeModel="closeModel" @successResponse="userActivationResponse"></activate-deactivate>
      </v-dialog>
      <add-app-user v-if="showAddAppUser" @userAdded="userAdded" @closeAddUser="showAddAppUser = false"
        :dialogI="showAddAppUser" :isMarketPlaceUser="true"></add-app-user>
      <edit-app-user v-if="showEditAppUser" :user="editedUser" @appUserUpdated="appUserUpdated"
        @closeUpdateUser="editUserClosed" :dialogU="showEditAppUser" :isMarketPlaceUser="true"></edit-app-user>
      <confirm-box :dialog="confirmDelete" :title="confirmElements.title" :message="confirmElements.message"
        :cancelBtnText="confirmElements.cancelBtnText" :confirmBtnText="confirmElements.confirmBtnText"
        :confirmData="confirmElements.confirmData"
        @cancel:action="handleCancel" @continue:action="confirmDeactivate"></confirm-box>
    </v-container>
  </div>
</template>

<script>
import DownloadMixin from "@/mixins/DownloadMixin";
import loadingMixin from "@/mixins/LoadingMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import marketplaceService from "@/_services/MarketplaceService"
import activateDeactivate from "./components/seller/activate-deactivate.vue";
import { debounce } from "lodash";
import AddAppUser from "@/views/user/AddAppUser";
import EditAppUser from "@/views/user/EditAppUser";
import ProfileService from "@/_services/ProfileService";
import UserService from "@/_services/UserService";
import ConfirmBox from "@/components/ConfirmBox";

export default {
  computed: {
    products() {
      return this.$store.getters["marektPlace/getProducts"];
    },
    categories() {
      return this.$store.getters["marektPlace/getCategories"];
    },
    subCategories() {
      return this.$store.getters["marektPlace/getSubCategories"];
    },
    countries() {
      return this.$store.getters["marektPlace/getCountries"];
    },
    hasActiveFilters() {
      return Object.values(this.filterData).some(value => {
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === 'object')
          return Object.values(value).some(v => v !== "");
        return value !== "";
      });
    },
  },
  created() {
    this.debouncedSearchSeller = debounce(this.searchSeller, 500);
  },
  mounted() {
    this.loading = false;
    this.$store.dispatch("marektPlace/fetchProducts");
    this.$store.dispatch("marektPlace/fetchCategories");
    this.$store.dispatch("marektPlace/fetchCountries");
  },
  watch: {
    'filterData.selectedCategories': {
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          const payload = {
            categoryIds: newVal
          };
          this.$store.dispatch("marektPlace/fetchgetCategoriesSubCategories", payload);
        } else {
          this.filterData.selectedSubCategories = [];
        }
      }
    },
    tableOptions: {
      async handler() {
        await this.getUsers();
      },
      deep: true,
    },
  },
  components: {
    activateDeactivate,
    AddAppUser,
    EditAppUser,
    ConfirmBox
  },
  methods: {
    selectItem(item) {
      this.selectedItem = item;
    },
    unSelectItem() {
      this.selectedItem = false;
    },
    async getUsers(params = {}) {
      try {
        this.tableLoading = true;
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Merge search params with filter params
        const searchParams = this.search ? { full_name: this.search } : {};
        console.log('searchParams', this.tableOptions.sortBy, this.tableOptions.sortDesc )
        const sortingParams = this.tableOptions.sortBy
      ? { orderField: this.tableOptions.sortBy[0] || 'full_name', order: this.tableOptions.sortDesc[0] ? 'DESC' : 'ASC' }
      : {};
        const finalParams = {
          ...params,
          ...searchParams,
          ...sortingParams,
          page: this.tableOptions.page,
          limit: this.tableOptions.limit
        };

        const response = await marketplaceService.getUsers(finalParams);

        this.items = response.items;
        this.totalSellers = response.totalItems;
        this.from = ((this.tableOptions.page - 1) * this.tableOptions.limit) + 1;
        this.to = Math.min(this.tableOptions.page * this.tableOptions.limit,
          response.totalCurrentItems + this.from - 1);
        this.totalPages = response.totalPages;
      } catch (error) {
        this.$notify({
            title: this.$t("Failed to fetch sellers data"),
            type: "error",
          });
        console.error('Error fetching users:', error);
      } finally {
        this.tableLoading = false;
      }
    },
    searchSeller() {
      if (this.search == '') return
      this.tableOptions.page = 1;
      this.getUsers({ full_name: this.search });
    },

    resetSearchOnEmpty() {
      if (this.search != "") return;
      this.tableOptions.page = 1;
      this.getUsers();
    },

    pageChange(t) {
      if (t) this.tableOptions.page = this.tableOptions.page + 1;
      else this.tableOptions.page = this.tableOptions.page - 1;
    },
    closeFilter() {
      this.showFilters = false;
    },
    clearFilters() {
      this.filterData = {
        selectedProducts: [],
        selectedCategories: [],
        selectedSubCategories: [],
        selectedCountries: [],
        selectedStatus: [],
        noOfProducts: {
          from: "",
          to: "",
        },
        noOfOrders: {
          from: "",
          to: "",
        },
      };
      this.dataFiltered = false;
      this.getUsers();
    },
    validateFilters() {
      // Validate product range
      const { from: pFrom, to: pTo } = this.filterData.noOfProducts;
      if (pFrom && pTo && parseInt(pFrom) > parseInt(pTo)) {
        this.$notify({
            title: this.$t("Invalid product range"),
            type: "error",
          });
        return false;
      }

      // Validate order range
      const { from: oFrom, to: oTo } = this.filterData.noOfOrders;
      if (oFrom && oTo && parseInt(oFrom) > parseInt(oTo)) {
        this.$notify({
            title: this.$t("Invalid order range"),
            type: "error",
          });
        return false;
      }

      return true;
    },

    async applyFilters() {
      if (!this.validateFilters()) return;
      const formatValue = (value) => (value == 0 || value === undefined ? null : value);

      const filters = {
        product_ids: this.filterData.selectedProducts.length > 0
          ? this.filterData.selectedProducts.join(",")
          : undefined,
        country: this.filterData.selectedCountries.length > 0
          ? this.filterData.selectedCountries.join(",")
          : undefined,
        minProducts: formatValue(this.filterData.minProducts),
        maxProducts: formatValue(this.filterData.maxProducts),
        minOrders: formatValue(this.filterData.orderFrom),
        maxOrders: formatValue(this.filterData.maxOrders),
        is_active: this.filterData.selectedStatus.includes("active")
          ? true
          : this.filterData.selectedStatus.includes("deactivated")
            ? false
            : undefined
      };
      console.log('filters', filters)
      try {
        this.startLoading();
        this.getUsers(filters);
      } catch (error) {
        console.error("❌ Error fetching sellers:", error);
        this.$notify({
            title: this.$t("Failed to fetch filtered sellers data"),
            type: "error",
          });
      } finally {
        this.stopLoading();
      }

      this.dataFiltered = true;
      this.closeFilter();
    },

    async gotoAddUser() {
      this.showAddAppUser = true;
    },
    userAdded() {
      this.showAddAppUser = false;
      this.getUsers();
    },
    showActivateDeactivateModal(item) {
      this.selectedUser = item;
      this.showActivateDeactivate = true;
    },
    closeModel() {
      this.showFilters = false;
      this.showActivateDeactivate = false;
    },
    async editUser(user) {
      try {
        this.startLoading();
        await ProfileService.getUserData(user.connected_farmer_user_id).then((res) => {
          if (res.success) {
            this.editedUser = res.data;
            this.showEditAppUser = true;
          }
        });
      } catch (error) {
        console.error("❌ Error fetching user:", error);
        this.$notify({
            title: this.$t("Failed to fetch user data"),
            type: "error",
          });
      }finally {
        this.stopLoading();
      }
    },
    appUserUpdated(res) {
      if (res.success) {
        this.showEditAppUser = false;
        this.getUsers();
      }
    },
    editUserClosed() {
      this.editedUser = {};
      this.showEditAppUser = false;
    },
    confirmDeactivate(action, confirmData) {
      if (action) {
        // console.log('cnfDate', confirmData)
        this.startLoading();
        UserService.toggleUserStatus(confirmData.user.connected_farmer_user_id)
          .then((res) => {
            if (res.success) {
              this.getUsers();
              this.stopLoading();
              this.confirmDelete = false;
              this.$notify({
                title:
                  confirmData.status == "1"
                    ? this.$t("addEdituser.userActivated")
                    : this.$t("addEdituser.userDeactivated"),
                type: "success",
              });
            } else {
              this.stopLoading();
              this.confirmDelete = false;
              this.$notify({
                title: this.$t("addEdituser.userNotUpdated"),
                type: "error",
              });
            }
          })
          .catch(() => {
            // console.log(err)
            this.stopLoading();
            this.confirmDelete = false;
          });
      } else {
        this.confirmDelete = false;
      }
    },
    confirmDeleteModal(item) {
      this.confirmElements.confirmData = {
        user: item,
      };
      this.confirmDelete = true;
    },
    handleCancel() {
      this.confirmDelete = false;
    },
    userActivationResponse() {
      this.getUsers();
    },
  },
  data() {
    return {
      totalSellers: 0,
      dataFiltered: false,
      showFilters: false,
      tab: 0,
      from: 0,
      to: 0,
      totalPages: 1,

      tableOptions: {
        limit: 10,
      },
      search: "",
      selected: [],
      items: [],
      selectedItem: false,
      loading: false,
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: true,
          to: "/",
        },
        {
          text: this.$t('marketplace.sellers.sellers'),
          disabled: true,
          to: "#",
        },
      ],
      headers: [
        {
          text: this.$t("marketplace.sellers.tableHeaders.name"),
          align: "start",
          sortable: true,
          value: "full_name",
          class: "black--text  text-no-wrap",
          width: "300px",
        },
        {
          text: this.$t("marketplace.sellers.tableHeaders.noOfProducts"),
          value: "total_products",
          sortable: true,
          class: "black--text text-no-wrap"
        },
        {
          text: this.$t("marketplace.sellers.tableHeaders.noOfOrders"),
          value: "total_completed_orders",
          sortable: true,
          class: "black--text text-no-wrap"
        },
        {
          text: this.$t("marketplace.sellers.tableHeaders.email"),
          value: "email",
          sortable: true,
          class: "black--text text-no-wrap",
        },
        {
          text: this.$t("marketplace.sellers.tableHeaders.cityTown"),
          value: "city",
          sortable: true,
          class: "black--text  text-no-wrap",
        },
        {
          text: this.$t("marketplace.sellers.tableHeaders.country"),
          value: "country",
          sortable: true,
          class: "black--text",
          width: "10%",
        },
        {
          text: this.$t("marketplace.sellers.tableHeaders.status"),
          value: "is_active",
          align: "center",
          sortable: true,
          class: "black--text text-no-wrap",
          width: "10%",
        },
        {}
      ],
      panel: [0, 1, 2, 3, 4, 5],
      filterData: {
        selectedProducts: [],
        selectedCategories: [],
        selectedSubCategories: [],
        selectedCountries: [],
        selectedStatus: [],
        noOfProducts: {
          from: "",
          to: "",
        },
        noOfOrders: {
          from: "",
          to: "",
        },
      },
      showActivateDeactivate: false,
      selectedUser: {},
      debouncedSearchSeller: null,
      showAddAppUser: false,
      showEditAppUser: false,
      editedUser: {},
      confirmElements: {
        title: this.$t("addEdituser.deactivateUser"),
        message: this.$t("addEdituser.deactivateMsg"),
        confirmBtnText: this.$t("addEdituser.deactivateAct"),
        cancelBtnText: this.$t("cancel"),
        confirmData: {},
      },
      confirmDelete: false,
      tableLoading: false,
      searchLoading: false,
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

.no-data-found {
  color: #DA3D3D;
  font-size: 24px;
  font-weight: 500;
}

.empty-table {
  color: black;
  padding: 20vh;

  img {
    width: 121.61px;
    height: 115px;
    opacity: 0.44px;
  }
}

.filter-hr {
  margin: 0 15px 0 15px;
}

.list-countries {
  display: flex;
  flex-wrap: wrap;
  max-height: 200px;
  overflow-y: auto;
}

.chips-table {
  width: 120px;
  text-align: center;
  display: block;
}

.show-pointer {
  cursor: pointer !important;
}

.search-input {
  width: 300px !important;
}
</style>
