<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-4">
        <h2>{{ productData.name }}</h2>
        <v-spacer></v-spacer>
        <v-btn outlined color="primary" class="mr-2 mb-2" @click="goBack">
          {{ $t('blends.manageProducts.back') }}
        </v-btn>
        <v-btn color="primary" dark class="mr-2 mb-2" @click="openSubProductDialog">
          {{ $t('blends.manageProducts.addNewSubProduct') }}
        </v-btn>
      </div>
      <v-card elevation="0" class="px-5 mt-7">
        <v-card-text>
          <v-row style="margin-left: -30px; margin-bottom: 20px; margin-top: 15px;">
            <v-col cols="12">
              <v-data-table :headers="subProductHeaders" :items="subProducts" :items-per-page="10"
                :footer-props="{ 'items-per-page-options': [10, 25, 50] }" item-key="id" hide-default-footer
                :loading="tableLoading" @update:options="onSortUpdate">
                <template v-slot:top="{}">
                  <div class="d-flex mt-5">
                    <v-text-field @input="onSearchInput" v-model="searchData" style="width: 290px; "
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
                <template v-if="subProducts && subProducts.length" v-slot:body="{ items }">
                  <tbody>
                    <tr v-for="item in items" :key="item.id">
                      <td>
                        <v-row align="center" no-gutters>
                          <v-col class="shrink">
                            <img v-if="item.s3Key" :src="item.s3Key" alt="Product Image"
                              style="width: 45px; height: 45px; border-radius: 0;" class="table-img" />
                          </v-col>
                          <v-col class="ml-4">
                            {{ item.name }}
                          </v-col>
                        </v-row>
                      </td>
                      <td>{{ item.hsCode }}</td>
                      <td>{{ item.eudrDocumentCode }}</td>
                      <td>{{ getDateFormat(item.createdAt) }}</td>
                      <td>
                        <v-menu location="start">
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn icon v-bind="attrs" v-on="on">
                              <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                          </template>
                          <v-list style="min-width: 150px; cursor: pointer;">
                            <v-list-item @click="openEditSubProductDialog(item)">
                              <v-list-item-title>{{ $t('blends.manageProducts.edit') }}</v-list-item-title>
                            </v-list-item>
                            <v-list-item v-if="item.subProductType !== 'global'" >
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
      <AddNewSubProduct v-if="showSubProductDialog" :dialog="showSubProductDialog" :productName="productData.name" :isEdit='isEdit'
        :subProductData="selectedSubProduct" @close="closeAddProductDialog" @save="handleSaveProduct" />
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
import AddNewSubProduct from "./components/NewSubProductForm.vue";
import ConfirmBox from "@/components/ConfirmBox";
import BlendService from "@/_services/BlendService";
import loadingMixin from "@/mixins/LoadingMixin";
import { get } from "lodash";
import { debounce } from 'lodash';

export default {
  mixins: [loadingMixin],
  components: {
    AddNewSubProduct,
    "confirm-box": ConfirmBox,
  },
  data() {
    return {
      showSubProductDialog: false,
      selectedSubProduct: null,
      confirmDeleteDialog: false,
      isEdit: false,
      confirmDeleteData: {},
      productId: parseInt(this.$route.params.productId),
      breadcrumbs: [
        { text: this.$t('blends.manageProducts.eudrDueDiligence'), disabled: false },
        { text: this.$t('blends.manageProducts.subProducts'), disabled: true },
      ],
      subProductHeaders: [
        { text: this.$t('blends.manageProducts.tableHeaders.productName'), align: "start", value: "name" },
        { text: this.$t('blends.manageProducts.tableHeaders.hsCode'), value: "hsCode" },
        { text: this.$t('blends.manageProducts.tableHeaders.eudrDocumentCode'), value: "eudrDocumentCode" },
        { text: this.$t('blends.manageProducts.tableHeaders.dateAdded'), value: "createdAt" },
        { text: this.$t('blends.manageProducts.tableHeaders.action'), value: "actions", sortable: false },
      ],
      subProducts: [],
      searchData: "",
      filterParams: {
        search: "",
        productId: "",
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
      productData: {},
      deleteMessage: "",
    };
  },
  created() {
    this.filterParams.productId = parseInt(this.$route.params.productId);
    this.debouncedUpdateFilterParams = debounce(this.updateFilterParams, 500);
  },
  async mounted() {
    this.startLoading();
    await this.fetchSingleProduct();
    await this.fetchSubProducts();
    this.stopLoading();
  },
  watch: {
    filterParams: {
      async handler() {
        await this.fetchSubProducts();
      },
      deep: true,
    },
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    openSubProductDialog() {
      this.selectedSubProduct = null;
      this.showSubProductDialog = true;
      this.isEdit = false;
    },
    openEditSubProductDialog(data) {
      this.selectedSubProduct = data;
      this.showSubProductDialog = true;
      this.isEdit = true;
    },
    closeAddProductDialog() {
      this.showSubProductDialog = false;
    },
    async handleSaveProduct(subProductData) {
      const subProductDataWithProductId = { ...subProductData, productId: this.productId }
      try {
        this.startLoading();
        if (!subProductData.id) {
          const res = await BlendService.createSubproduct(subProductDataWithProductId);
          if (res.data) {
            await this.fetchSubProducts();
            this.$notify({
              title: this.$t("blends.manageProducts.addNewSubProduct"),
              text: this.$t("blends.manageProducts.subProductAddedMessage"),
              type: "success",
            });
          }
        } else {
          const updatedResp = await BlendService.updateSubproduct(subProductDataWithProductId);
          if (updatedResp.data) {
            await this.fetchSubProducts();
            this.$notify({
              title: this.$t("blends.manageProducts.updateSubProduct"),
              text: this.$t("blends.manageProducts.subProductUpdateMessage"),
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
    openConfirmDeleteDialog(subProduct) {
      this.confirmDeleteData = subProduct;
      this.confirmDeleteDialog = true;
      this.deleteMessage = this.$t('blends.manageProducts.deleteMessage') + ` ${subProduct.name}?`;
    },
    async confirmRemoveProduct(action, confirmData) {
      const subProductWithProductId = { ...confirmData, productId: this.productId }
      try {
        this.startLoading();
        const resp = await BlendService.deleteSubproduct(subProductWithProductId.id);
        console.log(resp)
        if (resp.data.deleteManageSubproduct) {
          await this.fetchSubProducts();
          this.$notify({
            title: this.$t("blends.manageProducts.deleteSubProduct"),
            text: this.$t("blends.manageProducts.subProductDeleteMessage"),
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
    onSortUpdate(sort) {
      this.filterParams.sortBy = get(sort, "sortBy[0]", "createdAt");
      this.filterParams.sortOrder = get(sort, "sortDesc[0]", false) ? "desc" : "asc";
    },
    getDateFormat(date) {
      return moment(date).format("DD-MMM-YYYY");
    },
    async fetchSubProducts() {
      try {
        this.tableLoading = true
        await BlendService.getSubProduct(this.filterParams).then((res) => {
          if (res.data) {
            this.subProducts = get(res, 'data.manageSubProduct.rows', []);
            this.pagination.total = get(res, 'data.manageSubProduct.totalCount', 0);
            this.pagination.from = (this.filterParams.page - 1) * this.filterParams.limit + 1;
            this.pagination.to = this.filterParams.page * this.filterParams.limit - (this.filterParams.limit - this.subProducts?.length)
          }
        });
      } catch (err) {
        console.log(err);
      } finally {
        this.tableLoading = false
      }
    },
    async fetchSingleProduct() {
      try {
        const res = await BlendService.getProductById(this.filterParams.productId);
        if (res.data) {
          this.productData = get(res, 'data.manageProductById', {});
        }
      } catch (err) {
        console.log(err);
      }
    },
    pageChange(t) {
      if (t) this.filterParams.page = this.filterParams.page + 1;
      else this.filterParams.page = this.filterParams.page - 1;
    },
    updateFilterParams() {
      this.filterParams.search = this.searchData; // Update filterParams after debounce delay
    },
    onSearchInput() {
      this.searchData = this.searchData.trim();
      this.debouncedUpdateFilterParams();
    },
  }
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
