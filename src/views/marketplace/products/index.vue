<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div class="d-flex mb-4">
                <h2>{{ $t("marketplace.common.products") }}</h2>
                <v-spacer></v-spacer>
                <div class="d-flex mt-1">
                    <v-btn color="primary" :to="{ name: 'marketplaceProductsAdd' }" dark class="mr-2">
                        {{ $t("marketplace.products.addProduct") }}
                    </v-btn>
                </div>
            </div>
            <v-card elevation="0" class="px-5">
                <v-card-text>
                    <v-data-table class="my-awesome-table" :headers="headers" :items="items" :items-per-page="10"
                        v-model="selected" :loading="loading" :loading-text="'Seller loading'" :footer-props="{
                            'items-per-page-options': [10, 25, 50],
                            'show-first-last-page': true,
                            'show-current-page': true,
                            'items-per-page-text': 'Seller per page',
                        }" :options.sync="tableOptions" :server-items-length="20" hide-default-footer>
                        <template v-slot:top>
                            <div class="d-flex mt-5">
                                <v-text-field prepend-inner-icon="mdi-magnify" outlined height="5px"
                                    :placeholder="$t('search')" dense v-model="search" @input="handleSearchByPhrase"
                                    class="shrink" clearable></v-text-field>
                                <v-spacer></v-spacer>

                                <div class="py-1 title">
                                    <span style="font-weight: bold">
                                        {{ $t("marketplace.common.filterBy") }} </span><v-icon class="filterIcon"
                                        @click="showModal">mdi-filter</v-icon>
                                    {{ from }} - {{ to }} {{ $t("of") }} {{ totalProducts }}
                                </div>
                                <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page <= 1"
                                    @click="pageChange(false)">
                                    <v-icon dark> mdi-chevron-left </v-icon>
                                </v-btn>
                                <v-btn class="mx-2" fab small outlined color="primary"
                                    :disabled="options.page >= totalPages" @click="pageChange(true)">
                                    <v-icon dark> mdi-chevron-right </v-icon>
                                </v-btn>
                            </div>
                        </template>
                        <template v-slot:no-data v-if="items.length < 1">
                            {{ $t("marketplace.products.noProductFound") }}
                        </template>
                        <template v-if="items.length > 0" v-slot:body="{ items }">
                            <tbody>
                                <tr v-for="item in items" :key="item.id" @mouseover="selectItem(item)"
                                    @mouseleave="unSelectItem()" style="position: relative; width: 0; height: 0">
                                    <template>
                                        <td>
                                            <v-row align="center" dense>
                                                <!-- Product Image -->
                                                <div class="img-wrapper">
                                                    <img :src="item.image ?? '/img/marketplace/no_image.png'" />
                                                </div>

                                                <!-- Product Details -->
                                                <v-col class="ml-4">
                                                    <v-row class="d-flex flex-column">
                                                        <!-- Product Name -->
                                                        <v-col>
                                                            <p class="pb-0 font-weight-bold">{{ item.name }}</p>
                                                            <v-row dense>
                                                                <v-icon v-for="index in 5" :key="index"
                                                                    :color="index <= averageRating(item) ? 'green' : 'grey'">
                                                                    mdi-star
                                                                </v-icon>
                                                                <span class="ml-2">{{ averageRating(item).toFixed(1)
                                                                    }}</span>
                                                            </v-row>
                                                        </v-col>
                                                    </v-row>
                                                </v-col>
                                            </v-row>
                                        </td>

                                        <td>{{ item.category ? item.category.name : '-' }}</td>
                                        <td>{{ item.sku || '-' }}</td>
                                        <td class="capitlize">{{ item.seller ? item.seller.first_name : '-' }}</td>
                                        <td class="capitlize">{{ item.qty || '-' }}</td>
                                        <td class="capitlize">{{ item.min_order_qty || '-' }}</td>
                                        <td class="capitlize">{{ getPrice(item) }}</td>
                                        <td>
                                            <v-btn small rounded min-width="200" depressed class="green-button"
                                                height="40" v-if="item.disabled == 0">
                                                {{ $t("marketplace.common.enable") }}
                                            </v-btn>
                                            <v-btn small rounded min-width="200" depressed class="red-button"
                                                height="40" v-else>
                                                {{ $t("marketplace.common.disabled") }}
                                            </v-btn>
                                        </td>
                                        <td>
                                            <div style="position: absolute; right: 10px; top: 34px">
                                                <v-menu location="start">
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-btn icon v-bind="attrs" v-on="on">
                                                            <v-icon>mdi-dots-vertical</v-icon>
                                                        </v-btn>
                                                    </template>

                                                    <v-list>
                                                        <v-list-item @click="editProduct(item)">
                                                            <v-list-item-title>{{
                                                                $t("edit")
                                                                }}</v-list-item-title>
                                                        </v-list-item>
                                                        <v-list-item @click="changeProductStatus(item.id)">
                                                            <v-list-item-title>{{
                                                                $t("marketplace.products.changeStatus")
                                                                }}</v-list-item-title>
                                                        </v-list-item>
                                                        <v-list-item @click="removeProduct(item.id)">
                                                            <v-list-item-title>{{
                                                                $t("delete")
                                                                }}</v-list-item-title>
                                                        </v-list-item>
                                                    </v-list>
                                                </v-menu>
                                            </div>
                                        </td>
                                    </template>
                                </tr>
                            </tbody>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
            <FilterDialog :dialog="showFilterModal" @update:filters="handleFiltersUpdate"
                @closeFilterModal="showFilterModal = false">
            </FilterDialog>
            <!-- DELETE DIALOG BOX -->
            <ConfirmBox :title="confirmDelete.title" :message="confirmDelete.message"
                :cancelBtnText="confirmDelete.cancelBtnText" :confirmBtnText="confirmDelete.confirmBtnText"
                :confirmData="confirmDelete.confirmData" :dialog="confirmDeleteDialog"
                @cancel:action="confirmDeleteDialog = false" @continue:action="confirmDeleteProduct" />

            <!-- STATUS CHANGE BOX -->
            <ConfirmBox :title="confirmStatus.title" :message="confirmStatus.message"
                :cancelBtnText="confirmStatus.cancelBtnText" :confirmBtnText="confirmStatus.confirmBtnText"
                :confirmData="confirmStatus.confirmData" :dialog="confirmStatusDialog"
                @cancel:action="confirmStatusDialog = false" @continue:action="confirmStatusProduct" />
        </v-container>
    </div>
</template>

<script>
import DownloadMixin from "@/mixins/DownloadMixin";
import loadingMixin from "@/mixins/LoadingMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import FilterDialog from "@/views/marketplace/components/product/filterDialog.vue";
import MarketplaceService from "@/_services/MarketplaceService";
import _ from "lodash";
import ConfirmBox from "../../../components/ConfirmBox.vue";
import { ProductSteps } from "./constants/enums";

export default {
    computed: {
        getPrice() {
            return (item) => {
                return `${item?.currency?.currency_code || ''} ${item.maximum_price || '0'} ${item?.unit?.code || ''}`;
            };
        },
    },
    created() {
        this.fetchProductsData();
    },
    mounted() {
        this.loading = false;
    },

    components: {
        FilterDialog,
        ConfirmBox,
    },

    data() {
        return {
            totalProducts: 0,
            dataFiltered: false,
            showFilters: false,
            tab: 0,
            from: 0,
            to: 0,
            totalPages: 1,

            options: {
                search: "",
                limit: 10,
                page: 1,
                pre_order_available: undefined,
                allow_quote: undefined,
                category_id: undefined,
                subcategory_id: undefined,
                seller_countries: undefined,
            },

            tableOptions: {
                limit: 10,
            },
            search: "",
            selected: [],
            showFilterModal: false,
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
                    text: this.$t("marketplace.common.products"),
                    disabled: true,
                    to: "breadcrumbs_link_1",
                },
            ],
            headers: [
                {
                    text: this.$t("marketplace.products.productName"),
                    align: "start",
                    sortable: true,
                    value: "productName",
                    class: "black--text  text-no-wrap",
                    width: "400px",
                },
                {
                    text: this.$t("marketplace.products.mainCategory"),
                    value: "mainCategory",
                    sortable: true,
                    class: "black--text text-no-wrap",
                },
                {
                    text: this.$t("marketplace.products.skuCode"),
                    value: "skuCode",
                    sortable: true,
                    class: "black--text text-no-wrap",
                },
                {
                    text: this.$t("marketplace.products.createdBy"),
                    value: "createdBy",
                    sortable: true,
                    class: "black--text text-no-wrap",
                },
                {
                    text: this.$t("marketplace.products.quantity"),
                    value: "quantity",
                    sortable: true,
                    class: "black--text text-no-wrap",
                },
                {
                    text: this.$t("marketplace.products.orders"),
                    value: "orders",
                    align: "center",
                    sortable: true,
                    class: "black--text text-no-wrap",
                    width: "10%",
                },
                {
                    text: this.$t("marketplace.products.price"),
                    value: "price",
                    align: "center",
                    sortable: true,
                    class: "black--text text-no-wrap",
                    width: "10%",
                },
                {
                    text: this.$t("status"),
                    value: "status",
                    align: "center",
                    sortable: false,
                    class: "black--text text-no-wrap",
                    width: "10%",
                },
                {
                    text: "",
                    align: "center",
                    value: "action",
                    class: "black--text",
                    sortable: false,
                    width: "150px",
                },
            ],
            confirmDeleteDialog: false,
            confirmDelete: {
                title: this.$t("marketplace.common.delete"),
                message: this.$t("marketplace.common.deleteConfirmText"),
                confirmBtnText: this.$t("confirm"),
                cancelBtnText: this.$t("cancel"),
                confirmData: {},
            },
            confirmStatusDialog: false,
            confirmStatus: {
                title: this.$t("marketplace.common.changeStatus"),
                message: this.$t("marketplace.common.statusChangeText"),
                confirmBtnText: this.$t("confirm"),
                cancelBtnText: this.$t("cancel"),
                confirmData: {},
            },
        };
    },

    methods: {
        averageRating(item) {
            if (!item.reviews || item.reviews.length === 0) {
                return 0;
            }

            const total = item.reviews.reduce((sum, review) => sum + review.rating, 0);
            return total / item.reviews.length;
        },

        editProduct(item) {
            this.$router.push({
                name: "marketplaceProductsAdd",
                params: {
                    id: item.id,
                    step: ProductSteps.GENERAL_INFORMATION.id
                },
            });
        },

        removeProduct(id) {
            this.confirmDelete.confirmData = { id };
            this.confirmDeleteDialog = true;
        },

        changeProductStatus(id) {
            this.confirmStatus.confirmData = { id };
            this.confirmStatusDialog = true;
        },

        async confirmDeleteProduct(action, confirmData) {
            try {
                this.startLoading();
                this.confirmDeleteDialog = false;
                await MarketplaceService.removeProduct(parseInt(confirmData.id));
                this.fetchProductsData();
                this.$notify({
                    text: this.$t("marketplace.common.itemRemovedSuccessfully"),
                    type: "success",
                });
            } catch (err) {
                this.$notify({
                    text: err,
                    type: "error",
                });
                console.log("Error", err);
            } finally {
                this.stopLoading();
            }
        },

        async confirmStatusProduct(action, confirmData) {
            try {
                this.startLoading();
                this.confirmStatusDialog = false;
                await MarketplaceService.changeProductStatus(parseInt(confirmData.id));
                this.fetchProductsData();
                this.$notify({
                    text: this.$t("marketplace.common.statusUpdatedSuccessfully"),
                    type: "success",
                });
            } catch (err) {
                this.$notify({
                    text: err,
                    type: "error",
                });
                console.log("Error", err);
            } finally {
                this.stopLoading();
            }
        },

        handleFiltersUpdate(filters) {
            const {
                category_ids,
                subcategory_ids,
                search,
                country_ids,
                visibility,
                currency,
                min_price,
                max_price,
            } = filters;

            Object.assign(this.options, {
                category_ids,
                subcategory_ids,
                search,
                country_ids,
                visibility,
                currency,
                min_price,
                max_price,
            });

            this.fetchProductsData();
        },

        handleSearchByPhrase: _.debounce(function () {
            this.options.search = this.search;
            this.fetchProductsData();
        }, 1000),

        showModal() {
            this.showFilterModal = true;
        },
        async fetchProductsData() {
            try {
                this.startLoading();
                const response = await MarketplaceService.getProducts(this.options);
                this.items = response.items;
                this.totalProducts = response.totalItems;
                this.from = (this.options.page - 1) * this.options.limit + 1;
                this.to = Math.min(
                    this.options.page * this.options.limit,
                    response.totalCurrentItems + this.from - 1
                );
                this.totalPages = response.totalPages;
                this.stopLoading();
            } catch (error) {
                this.stopLoading();
                console.error("Error fetching categories:", error);
            }
        },

        selectItem(item) {
            this.selectedItem = item;
        },
        unSelectItem() {
            this.selectedItem = false;
        },

        pageChange(t) {
            if (t) this.options.page = this.options.page + 1;
            else this.options.page = this.options.page - 1;
            this.fetchProductsData();
        },
    },

    mixins: [loadingMixin, getPermittedActions, DownloadMixin],
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
    margin-right: 0;
    margin-top: 0;
}

::v-deep .square {
    width: 1vw;
    height: 1vw;
}

::v-deep .xxxx {
    border: 2px solid black;
}

::v-deep .product-name-cl {
    padding: 5px;
}

::v-deep .product-name-cl .product-img {
    display: flex;
    align-items: center;
}

::v-deep .product-img p {
    margin-left: 5px;
}

.filterIcon {
    color: #0ebf67;
    height: 28px;
    width: 28px;
    margin-left: 5px;
    margin-right: 5px;
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

.product-title {
    font-size: 20px;
    padding-bottom: 6px;
    display: inline-block;
    width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
