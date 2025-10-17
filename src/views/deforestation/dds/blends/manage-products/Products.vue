<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-4">
        <h2>{{ $t('blends.manageProducts.products') }}</h2>
        <v-spacer></v-spacer>
        <v-btn color="primary" dark class="mr-2 mb-2" @click="openAddProductDialog">
          {{ $t('blends.manageProducts.addNewProduct') }}
        </v-btn>
      </div>
      <v-card elevation="0" class="px-5 mt-7">
        <v-card-text>
          <v-row style="margin-left:-30px; margin-bottom: 20px; margin-top: 15px;">
            <v-col cols="12">
              <v-data-table :headers="productHeaders" :items="products" :items-per-page="10" :footer-props="{
                'items-per-page-options': [10, 25, 50],
              }" item-key="id" hide-default-footer :loading="tableLoading" @update:options="onSortUpdate">
                <template v-slot:top="{}">
                  <div class="d-flex mt-5">
                    <v-text-field @change="onSearchInput" v-model="searchData" style="width: 290px; "
                      prepend-inner-icon="mdi-magnify" outlined height="5px"
                      :placeholder="$t('blends.manageProducts.searchByProductName')" dense class="shrink">
                    </v-text-field>
                    <v-spacer></v-spacer>
                    <div class="py-1 title">
                      {{ pagination.from }} - {{ pagination.to }} {{ $t('of') }} {{ pagination.total }}
                    </div>
                    <v-btn class="mx-2" fab small outlined color="primary" :disabled="filterParams.page <= 1"
                      @click="pageChange(false)">
                      <v-icon dark>
                        mdi-chevron-left
                      </v-icon>
                    </v-btn>
                    <v-btn class="mx-2" fab small outlined color="primary" :disabled="pagination.to >= pagination.total"
                      @click="pageChange(true)">
                      <v-icon dark>
                        mdi-chevron-right
                      </v-icon>
                    </v-btn>
                  </div>
                </template>
                <template v-if="products && products.length" v-slot:body="{ items }">
                  <tbody>
                    <tr v-for="item in items" :key="item.id"
                      style="cursor: pointer;">
                      <td>
                        <v-row align="center" no-gutters>
                          <v-col class="shrink">
                            <img v-if="item.s3Key" :src="item.s3Key" alt="Product Image"
                              style="max-width:100px; border-radius: 0;" class="py-2 table-img"/>
                          </v-col>
                          <v-col class="ml-4">
                            {{ item.name }}
                          </v-col>
                        </v-row>
                      </td>
                      <td>{{ item.hsCode }}</td>
                      <td>{{ item.eudrDocumentCode }}</td>
                      <td>{{ item.subproductCount }}</td>
                      <td>{{ getDateFormat(item.createdAt) }}</td>
                      <td @click.stop>
                        <v-menu location="start">
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn icon v-bind="attrs" v-on="on" @click.stop>
                              <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                          </template>
                          <v-list style="min-width: 150px; cursor: pointer;">
                            <v-list-item @click="goToSubProducts(item.id, item.productName)">
                              <v-list-item-title>{{ $t('blends.manageProducts.view') }}</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="openEditProductDialog(item)">
                              <v-list-item-title>{{ $t('blends.manageProducts.edit') }}</v-list-item-title>
                            </v-list-item>
                            <v-list-item v-if="item.productType !== 'global'">
                              <v-list-item-title @click="openConfirmDeleteDialog(item)">{{
                                $t('blends.manageProducts.remove')
                              }}</v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <AddNewProduct v-if="showAddProductDialog" :dialog="showAddProductDialog" :productData="selectedProduct"
        @close="closeAddProductDialog" @save="handleSaveProduct" />
      <confirm-box :title="$t('blends.manageProducts.deleteProduct')"
        :message="deleteMessage" :cancelBtnText="$t('blends.manageProducts.cancel')"
        :confirmBtnText="$t('blends.manageProducts.confirm')" :confirmData="confirmDeleteData"
        :dialog="confirmDeleteDialog" @cancel:action="confirmDeleteDialog = false"
        @continue:action="confirmRemoveProduct" />
    </v-container>
  </div>
</template>

<script>
import moment from "moment";
import AddNewProduct from "./components/NewProductForm.vue";
import ConfirmBox from "@/components/ConfirmBox";
import BlendService from "@/_services/BlendService";
import loadingMixin from "@/mixins/LoadingMixin";
import { get } from "lodash";
import { debounce } from 'lodash';

export default {
  mixins: [loadingMixin],
  components: {
    AddNewProduct,
    "confirm-box": ConfirmBox,
  },
  data() {
    return {
      showAddProductDialog: false,
      selectedProduct: null,
      breadcrumbs: [
        { text: this.$t('blends.manageProducts.eudrDueDiligence'), disabled: false },
        { text: this.$t('blends.manageProducts.products'), disabled: true },
      ],
      productHeaders: [
        { text: this.$t('blends.manageProducts.tableHeaders.productName'), align: "start", value: "name" },
        { text: this.$t('blends.manageProducts.tableHeaders.hsCode'), value: "hsCode" },
        { text: this.$t('blends.manageProducts.tableHeaders.eudrDocumentCode'), value: "eudrDocumentCode" },
        { text: this.$t('blends.manageProducts.tableHeaders.subProduct'), value: "subProducts", sortable: false },
        { text: this.$t('blends.manageProducts.tableHeaders.dateAdded'), value: "createdAt" },
        { text: this.$t('blends.manageProducts.tableHeaders.action'), value: "actions", sortable: false },
      ],
      products: [],
      confirmDeleteDialog: false,
      confirmDeleteData: {},
      searchData: "",
      filterParams: {
        search: "",
        page: 1,
        limit: 10,
        sortBy: "createdAt",
        sortOrder: "asc"
      },
      pagination: {
        from: 1,
        to: 10,
        total: 0,
      },
      tableLoading: false,
      deleteMessage: "",
    };
  },
  created() {
    this.debouncedUpdateFilterParams = debounce(this.updateFilterParams, 500);
  },
  async mounted() {
    this.startLoading();
    await this.fetchProducts();
    this.stopLoading();
  },
  watch: {
    filterParams: {
      async handler() {
        await this.fetchProducts();
      },
      deep: true,
    },
  },
  methods: {
    onSortUpdate(sort) {
      this.filterParams.sortBy = get(sort, "sortBy[0]", "createdAt");
      this.filterParams.sortOrder = get(sort, "sortDesc[0]", false) ? "desc" : "asc";
    },
    getDateFormat(date) {
      return moment(date).format("DD-MMM-YYYY");
    },
    goToSubProducts(productId, productName) {
      this.$router.push({ name: "ManageSubProducts", params: { productId, productName } });
    },
    openAddProductDialog() {
      this.selectedProduct = null;
      this.showAddProductDialog = true;
    },
    closeAddProductDialog() {
      this.showAddProductDialog = false;
    },
    async fetchProducts() {
      try {
        this.tableLoading = true
        await BlendService.getProducts(this.filterParams).then((res) => {
          if (res.data) {
            this.products = get(res, 'data.manageProduct.rows', []);
            this.pagination.total = get(res, 'data.manageProduct.totalCount', 0);
            this.pagination.from = (this.filterParams.page - 1) * this.filterParams.limit + 1;
            this.pagination.to = this.filterParams.page * this.filterParams.limit - (this.filterParams.limit - this.products?.length)
          }
        });
      } catch (err) {
        console.log(err);
      } finally {
        this.tableLoading = false
      }
    },
    async handleSaveProduct(productData) {
      try {
        this.startLoading();
        if (!productData.id) {
          const res = await BlendService.createProduct(productData);
          if (res.data) {
            await this.fetchProducts();
            this.$notify({
              title: this.$t("blends.manageProducts.addNewProduct"),
              text: this.$t("blends.manageProducts.productAddedMessage"),
              type: "success",
            });
          }
        } else {
          const updatedResp = await BlendService.updateProduct(productData);
          if (updatedResp.data) {
            await this.fetchProducts();
            this.$notify({
              title: this.$t("blends.manageProducts.updateProduct"),
              text: this.$t("blends.manageProducts.productUpdateMessage"),
              type: "success",
            });
          }
        }
      } catch (err) {
        this.$notify({
          title: this.$t("blends.manageProducts.deleteSubProduct"),
          text: this.$t("blends.manageProducts.pleaseTryAgain"),
          type: "error",
        });
      } finally {
        this.stopLoading();
        this.closeAddProductDialog();
      }
    },
    openEditProductDialog(data) {
      this.selectedProduct = data;
      this.showAddProductDialog = true;
    },
    openConfirmDeleteDialog(product) {
      this.confirmDeleteData = product;
      this.confirmDeleteDialog = true;
      this.deleteMessage = this.$t('blends.manageProducts.deleteMessage') + ` ${product.name}?`;
    },
    async confirmRemoveProduct(action, confirmData) {
      try {
        this.startLoading();
        const resp = await BlendService.deleteProduct(confirmData.id);
        if (resp.data.deleteManageProduct) {
          await this.fetchProducts();
          this.$notify({
            title: this.$t("blends.manageProducts.deleteProduct"),
            text: this.$t("blends.manageProducts.productDeleteMessage"),
            type: "success",
          });
        }
      } catch (err) {
        this.$notify({
          title: this.$t("blends.manageProducts.deleteSubProduct"),
          text: this.$t("blends.manageProducts.pleaseTryAgain"),
          type: "error",
        });
      } finally {
        this.stopLoading();
        this.confirmDeleteDialog = false;
      }
    },
    pageChange(t) {
      if (t) this.filterParams.page = this.filterParams.page + 1;
      else this.filterParams.page = this.filterParams.page - 1;
    },
    updateFilterParams() {
      this.filterParams.search = this.searchData;
    },
    onSearchInput() {
      this.searchData = this.searchData.trim();
      this.debouncedUpdateFilterParams();
    },
  },
};
</script>

<style scoped>
.title {
  font-weight: bold;
}
.table-img{
  width: 45px;
  height: 45px;
}
</style>
