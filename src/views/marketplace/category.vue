<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-4">
        <h2>{{ $t('marketplace.category.categories') }}</h2>
        <v-spacer></v-spacer>
        <div class="d-flex mt-1">
          <v-btn color="primary" @click="displayAddModal" dark small class="mr-2">
            {{ $t('marketplace.category.requestNewCategory') }}
          </v-btn>
        </div>
      </div>
      <v-card elevation="0" class="px-5">
        <v-card-text>
          <v-data-table :headers="headers" :items="items" :items-per-page="10" v-model="selected" :loading="loading"
            :loading-text="$t('loading')" :footer-props="{
              'items-per-page-options': [10, 25, 50],
              'show-first-last-page': true,
              'show-current-page': true,
              'items-per-page-text': 'Seller per page',
            }" :server-items-length="20" hide-default-footer>
            <template v-slot:top>
              <div class="d-flex mt-5n al">
                <v-text-field prepend-inner-icon="mdi-magnify" outlined height="5px" :placeholder="$t('search')" dense
                  v-model="search" @click:append="searchQuery" @input="searchQuery" class="shrink"
                  clearable></v-text-field>

                <v-switch inset style="margin-left:20px;" v-model="createdByAdmin"
                  :label="$t('marketplace.category.createdByAdmin')"></v-switch>
                <v-spacer></v-spacer>
                <div class="py-1 title">
                  {{ from }} - {{ to }} {{ $t('of') }} {{ totalCategories }}
                </div>
                <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page <= 1"
                  @click="pageChange(false)">
                  <v-icon dark>
                    mdi-chevron-left
                  </v-icon>
                </v-btn>
                <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page >= totalPages"
                  @click="pageChange(true)">
                  <v-icon dark>
                    mdi-chevron-right
                  </v-icon>
                </v-btn>
              </div>
            </template>
            <template v-slot:no-data v-if="items.length < 1">
              {{ $t('marketplace.category.noCategoryFound') }}
            </template>
            <template v-if="items.length > 0" v-slot:body="{ items }">
              <tbody>
                <tr v-for="item in items" :key="item.id" @click="redirectToSubCategory(item.id)"
                  @mouseover="selectItem(item)" @mouseleave="unSelectItem()"
                  style="position: relative; width: 0; height: 0">
                  <template>

                    <td>
                      <div class="img-wrapper">
                        <img :src="item.image ?? '/img/marketplace/no_image.png'" />
                      </div>
                    </td>

                    <td> {{ item.name }} </td>

                    <td v-if="type === 'main'">{{ item.subcategories?.length ?? 0 }}</td>
                    <td v-else>{{ item.products?.length ?? 0 }}</td>

                    <td class="capitlize"> {{ formatDate(item.created_at) }} </td>

                    <td>
                      <v-btn small rounded min-width="200" depressed class="gray-button" height="40"
                        v-if="item.status?.toLowerCase() === 'pending'">
                        {{ $t("marketplace.common.pending") }}
                      </v-btn>
                      <v-btn small rounded min-width="200" depressed class="green-button" height="40"
                        v-else-if="item.status?.toLowerCase() === 'approved'">
                        {{ $t("marketplace.common.approved") }}
                      </v-btn>
                      <v-btn small rounded min-width="200" depressed class="red-button" height="40"
                        v-else-if="item.status?.toLowerCase() === 'rejected'">
                        {{ $t("marketplace.common.rejected") }}
                      </v-btn>
                    </td>
                  </template>
                </tr>
              </tbody>
            </template>
          </v-data-table>
          <CategoryAddModal :dialog="showAddModal" :categoryType="type" @closeCategoryModal="closeCategoryModalBox">
          </CategoryAddModal>

        </v-card-text>
      </v-card>

    </v-container>
  </div>
</template>

<script>
import DownloadMixin from "@/mixins/DownloadMixin";
import loadingMixin from "@/mixins/LoadingMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import marketplaceService from "@/_services/MarketplaceService";
import CategoryAddModal from "@/views/marketplace/components/category/categoryAddModal.vue";

export default {

  computed: {
    totalPage() {
      return this.totalCategories < this.options.limit ? 1 : Math.ceil(this.totalCategories / this.options.limit)
    },
    headers() {
      const baseHeaders = [
        {
          text: this.$t("marketplace.category.image"),
          align: "start",
          sortable: false,
          value: "image",
          class: "black--text text-no-wrap",
          width: "300px",
        },
        {
          text: this.$t("marketplace.common.category"),
          value: "category",
          sortable: true,
          class: "black--text text-no-wrap",
        },
        {
          text: this.$t("marketplace.category.subcategories"),
          value: "no_of_subcategories",
          sortable: true,
          class: "black--text text-no-wrap",
        },
        {
          text: this.$t("marketplace.category.dateAdded"),
          value: "dateAdded",
          align: "center",
          sortable: true,
          class: "black--text text-no-wrap",
          width: "10%",
        },
        {
          text: this.$t("status"),
          value: "status",
          align: "center",
          sortable: true,
          class: "black--text text-no-wrap",
          width: "10%",
        }
      ];
      return baseHeaders;
    }
  },

  created() {
    this.fetchCategoriesData();
  },

  watch: {
    'createdByAdmin'() {
      this.fetchCategoriesData();
    },
  },

  components: {
    CategoryAddModal
  },

  data() {
    return {
      debounceTimer: null,
      totalCategories: 0,
      dataFiltered: false,
      showFilters: false,
      tab: 0,
      from: 0,
      to: 0,
      totalPages: 1,
      showAddModal: false,
      type: 'main',
      createdByAdmin: 1,
      options: {
        limit: 10,
        page: 1,
        created_by_admin: 0,
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
          text: this.$t('marketplace.category.categories'),
          disabled: true,
          to: "breadcrumbs_link_1",
        },
      ],
    };
  },

  methods: {
    async fetchCategoriesData() {
      try {
        this.startLoading();
        this.options.created_by_admin = this.createdByAdmin ? 1 : 0;
        const response = await marketplaceService.getCategories(
          {
            ...this.options,
            search: this.search?.trim(),
            created_by_admin: this.options.created_by_admin,
          }
        );
        this.items = response.items
        this.totalCategories = response.totalItems
        this.from = ((this.options.page - 1) * this.options.limit) + 1
        this.to = Math.min(this.options.page * this.options.limit, response.totalCurrentItems + this.from - 1);
        this.totalPages = response.totalPages
        this.stopLoading();
      } catch (error) {
        this.stopLoading();
        console.error('Error fetching categories:', error);
      }
    },

    redirectToSubCategory(id) {
      this.$router.push({ name: "sub-category", params: { id } });
    },


    selectItem(item) {
      this.selectedItem = item;
    },
    unSelectItem() {
      this.selectedItem = false;
    },
    async getUsers() {
      this.loading = false;
    },

    searchQuery() {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => {
        this.options.page = 1;
        this.fetchCategoriesData();
      }, 500)
    },

    resetSearchOnEmpty() {
      if (this.search != "") return;
      this.tableOptions.page = 1;
      this.getUsers();
    },

    pageChange(t) {
      if (t) this.options.page = this.options.page + 1;
      else this.options.page = this.options.page - 1;
      this.fetchCategoriesData()
    },

    closeFilter() {
      this.showFilters = false;
    },

    clearFilters() {
      this.dataFiltered = false;
      this.closeFilter();
      this.getUsers();
    },

    displayAddModal() {
      this.showAddModal = true
    },

    formatDate(datetime) {
      const date = new Date(datetime);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const day = String(date.getDate()).padStart(2, '0');
      return `${day}-${month}-${year}`;
    },

    async closeCategoryModalBox() {
      this.options.page = 1;
      await this.fetchCategoriesData();
      this.showAddModal = false
    }
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

.status-pending {
  background-color: #E5F8F1 !important;
  color: #888888;
  border: 1px solid #888888
}

.status-merged {
  background-color: #E5F8F1 !important;
  color: #117443;
  border: 1px solid #117443
}

.status-approved {
  background-color: #E5F8F1 !important;
  color: #117443;
  border: 1px solid #117443
}

.status-rejected {
  background-color: #F8DEDE !important;
  color: #DA3D3D;
  border: 1px solid #DA3D3D
}

.status-moved {
  background-color: #E5F8F1 !important;
  color: #117443;
  border: 1px solid #117443
}

.v-input--selection-controls {
  margin-top: 6px;
}

.img-wrapper {
  height: 100px;
  width: 100px;
  margin: 10px 0;
}

.img-wrapper img {
  height: 100%;
  width: 100%;
}
</style>
