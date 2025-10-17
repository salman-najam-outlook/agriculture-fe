<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div class="d-flex mb-4">
                <h2>{{ $t("marketplace.orders.orders") }}</h2>
                <v-spacer></v-spacer>
                <div class="d-flex mt-1">
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
                            <div class="d-flex align-center mt-5" style="gap: 20px;">
                                <v-text-field prepend-inner-icon="mdi-magnify" outlined style="margin-top: 20px;"
                                    :placeholder="$t('search')" dense v-model="search" @input="handleSearchByPhrase"
                                    class="shrink" clearable></v-text-field>
                                <div class="d-flex align-center">
                                    <span class="mr-2">{{ $t("marketplace.orders.ordersForAdmin") }}</span>
                                    <v-switch inset></v-switch>
                                </div>
                                <v-spacer></v-spacer>
                                <div class="py-1 title d-flex align-center">
                                    <span style="font-weight: bold">{{ $t("marketplace.orders.filterBy") }}</span>
                                    <v-icon class="filterIcon ml-2" @click="showModal">mdi-filter</v-icon>
                                    {{ from }} - {{ to }} {{ $t('of') }} {{ totalOrders }}
                                </div>
                                <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page <= 1"
                                    @click="pageChange(false)">
                                    <v-icon dark>mdi-chevron-left</v-icon>
                                </v-btn>
                                <v-btn class="mx-2" fab small outlined color="primary"
                                    :disabled="options.page >= totalPages" @click="pageChange(true)">
                                    <v-icon dark>mdi-chevron-right</v-icon>
                                </v-btn>
                            </div>
                        </template>
                        <template v-slot:no-data v-if="items.length < 1">
                            {{ $t("marketplace.orders.noOrdersFound") }}
                        </template>
                        <template v-if="items.length > 0" v-slot:body="{ items }">
                            <tbody>
                                <tr v-for="item in items" :key="item.id" style="position: relative; width: 0; height: 0"
                                    @click="goToOrderDetail(item.id)">
                                    <template v-for="h in headers">
                                        <td class="text-truncate" :key="h.value + '_id'" v-if="h.value == 'id'"> {{
                                            item.id }} </td>

                                        <v-tooltip bottom v-else-if="h.value == 'productName'"
                                            :key="h.value + '_productName'">
                                            <template v-slot:activator="{ on, attrs }">
                                                <td class="text-truncate" :style="{ maxWidth: '150px' }" v-bind="attrs"
                                                    v-on="on">
                                                    {{ Array.isArray(item.productName) ? item.productName.join(', ') :
                                                        item.productName }}
                                                </td>
                                            </template>
                                            <span>
                                                {{ Array.isArray(item.productName) ? item.productName.join(', ') :
                                                    item.productName
                                                }}
                                            </span> </v-tooltip>
                                        <td class="text-truncate" :key="h.value + '_sellerName'"
                                            v-else-if="h.value == 'sellerName'">
                                            {{ item.sellerName }}
                                        </td>
                                        <td class="text-truncate" :key="h.value + '_buyerName'"
                                            v-else-if="h.value == 'buyerName'"> {{
                                                item.buyerName }} </td>
                                        <td class="text-truncate" :key="h.value + '_quantity'"
                                            v-else-if="h.value == 'quantity'"> {{
                                                item.unit }} {{
                                                item.quantity }} </td>
                                        <td class="text-truncate" :key="h.value + '_price'"
                                            v-else-if="h.value == 'price'"> {{
                                                item.currency }} {{ item.price }}
                                        </td>
                                        <td class="text-truncate" :key="h.value + '_dateSold'"
                                            v-else-if="h.value == 'dateSold'"> {{
                                                item.dateSold ?
                                                    formatDate(item.dateSold) : "-" }} </td>
                                        <td class="text-truncate" :key="h.value + '_status'" v-if="h.value == 'status'">
                                            <v-btn small rounded min-width="200" depressed class="gray-button"
                                                height="40" v-if="item.status === 'PENDING'">
                                                {{ $t("marketplace.orders.pending") }}
                                            </v-btn>
                                            <v-btn small rounded min-width="200" depressed class="red-button"
                                                height="40" v-else-if="item.status === 'PROCESSING'">
                                                {{ $t("marketplace.orders.processing") }}
                                            </v-btn>
                                            <v-btn small rounded min-width="200" depressed class="red-button"
                                                height="40" v-else-if="item.status === 'PACKING'">
                                                {{ $t("marketplace.orders.packing") }}
                                            </v-btn>

                                            <v-btn small rounded min-width="200" depressed class="red-button"
                                                height="40" v-else-if="item.status === 'SHIPPED'">
                                                {{ $t("marketplace.orders.shipped") }}
                                            </v-btn>
                                            <v-btn small rounded min-width="200" depressed class="red-button"
                                                height="40" v-else-if="item.status === 'READYFORPICKUP'">
                                                {{ $t("marketplace.orders.readyForPickup") }}
                                            </v-btn>
                                            <v-btn small rounded min-width="200" depressed class="red-button"
                                                height="40" v-else-if="item.status === 'DELIVERED'">
                                                {{ $t("marketplace.orders.delivered") }}
                                            </v-btn>
                                            <v-btn small rounded min-width="200" depressed class="red-button"
                                                height="40" v-else-if="item.status === 'CANCELLED'">
                                                {{ $t("marketplace.orders.cancelled") }}
                                            </v-btn>
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
        </v-container>
    </div>
</template>

<script>
import DownloadMixin from "@/mixins/DownloadMixin";
import loadingMixin from "@/mixins/LoadingMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import FilterDialog from "@/views/marketplace/components/orders/filterDialog.vue";
import marketplaceService from "@/_services/MarketplaceService";
import _ from 'lodash'
export default {
    computed: {

    },
    created() {
        this.fetchData()
    },
    mounted() {
        this.loading = false;
    },

    components: {
        FilterDialog
    },
    watch: {
        options: {
            async handler() {
                await this.fetchData();
            },
            deep: true,
        },
    },
    methods: {
        handleFiltersUpdate(filters) {
            
            this.options.allow_quote = filters.allow_quote ? true : undefined;
            this.options.pre_order_available = filters.pre_order_available ? true : undefined;
            this.options.category_id = filters.category_ids
            this.options.subcategory_id = filters.subcategory_ids
            this.options.status = filters.status
            this.options.specific_date = filters.specific_date
            this.options.date_range = filters.date_range
        },


        handleSearchByPhrase: _.debounce(function () {
            this.options.searchPhrase = this.search
        }, 1000),

        showModal() {
            this.showFilterModal = true;
        },
        formatDateRange() {
            if (this.filters.date_range && this.filters.date_range.length === 2) {
                this.filters.date_range = this.filters.date_range.map((date) =>
                    new Date(date).toISOString().split('T')[0] // Convert to ISO 8601 date string
                );
            }
        },
        formatDate(datetime) {
            const date = new Date(datetime);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
            const day = String(date.getDate()).padStart(2, '0');
            return `${day}-${month}-${year}`;
        },
        async fetchData() {
            this.startLoading();
            try {
                // Step 1: Fetch orders with pagination parameters
                const response = await marketplaceService.getOrders({
                    page: this.options.page,
                    limit: this.options.limit,
                    search: this.options.searchPhrase,
                    specific_date: this.options.specific_date,


                });

                if (!response || !Array.isArray(response.items)) {
                    throw new Error('Invalid response format');
                }

                this.orders = response.items;
                this.totalOrders = response.totalItems || 0;
                this.totalPages = Math.ceil(this.totalOrders / this.options.limit);

                // Calculate pagination display values
                this.from = this.totalOrders > 0
                    ? (this.options.page - 1) * this.options.limit + 1
                    : 0;
                this.to = this.options.page * this.options.limit > this.totalOrders
                    ? this.totalOrders
                    : this.options.page * this.options.limit;

                // Map the orders with additional error handling
                this.items = this.orders.map((order) => {
                    if (!order) return this.getEmptyOrderItem();

                    return {
                        id: order?.id,
                        productName: Array.isArray(order?.products)
                            ? order.products.map(product => product?.name).filter(Boolean).join(", ")
                            : "-",
                        sellerName: Array.isArray(order?.products)
                            ? [...new Set(order.products.map(product =>
                                product?.seller?.full_name).filter(Boolean))].join(", ")
                            : "-",
                        buyerName: order?.buyer?.full_name ?? "-",
                        quantity: Array.isArray(order?.products)
                            ? order.products.reduce((sum, product) => sum + (product?.qty || 0), 0)
                            : 0,
                        price: order?.order_quote?.price ?? "0",
                        dateSold: order?.order_shipping?.created_at,
                        status: order?.current_status ?? "-",
                    };
                });

            } catch (error) {
                console.error("Error fetching data:", error);
                this.items = [];
                this.orders = [];
            } finally {
                this.stopLoading();
            }
        },

        // Helper method for empty order items
        getEmptyOrderItem() {
            return {
                id: null,
                productName: "-",
                sellerName: "-",
                buyerName: "-",
                quantity: "0",
                price: "0",
                dateSold: null,
                status: "-",
            };
        },

        resetSearchOnEmpty() {
            if (this.search != "") return;
            this.tableOptions.page = 1;
        },

        pageChange(t) {
            if (t) this.options.page = this.options.page + 1;
            else this.options.page = this.options.page - 1;
            this.fetchData()
        },
        closeFilter() {
            this.showFilters = false;
        },
        clearFilters() {
            this.dataFiltered = false;
            this.closeFilter();
        },
        goToOrderDetail(orderId) {
            this.$router.push(`orders/${orderId}`);
        }
    },
    data() {
        return {
            totalOrders: 0,
            dataFiltered: false,
            showFilters: false,
            tab: 0,
            from: 0,
            to: 0,
            totalCount: 0,
            totalPages: 1,

            options: {
                searchPhrase: '',
                limit: 10,
                page: 1,
                specific_date: '',
                date_range: '',
                product: '',
                status: '',
                product_price_quote: '',
                shipping_quote: '',
                pick_up: '',
                category_id: '',
                subcategory_id: '',
            },

            tableOptions: {
                limit: 10,
            },
            search: "",
            selected: [],
            showFilterModal: false,
            orders: [],
            orderPlaced: [],
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
                    text: this.$t("marketplace.orders.orders"),
                    disabled: true,
                    to: "breadcrumbs_link_1",
                },
            ],
            headers: [
                {
                    text: this.$t("marketplace.orders.orderId"),
                    align: "start",
                    sortable: true,
                    value: "id",
                    class: "black--text  text-no-wrap",
                    width: "10px"
                },
                {
                    text: this.$t("marketplace.orders.products"),
                    value: "productName",
                    sortable: true,
                    align: "start",
                    class: "black--text text-no-wrap"
                },
                {
                    text: this.$t("marketplace.orders.sellerName"),
                    value: "sellerName",
                    sortable: true,
                    align: "start",
                    class: "black--text text-no-wrap",
                },
                {
                    text: this.$t("marketplace.orders.buyerName"),
                    value: "buyerName",
                    align: "start",
                    sortable: true,
                    class: "black--text text-no-wrap",

                },
                {
                    text: this.$t("marketplace.orders.totalQuantity"),
                    value: "quantity",
                    align: "center",
                    sortable: true,
                    class: "black--text text-no-wrap",
                    width: "10%"
                },
                {
                    text: this.$t("marketplace.orders.totalPrice"),
                    value: "price",
                    align: "center",
                    sortable: true,
                    class: "black--text text-no-wrap",
                    width: "10%"
                },
                {
                    text: this.$t("marketplace.orders.dateSold"),
                    value: "dateSold",
                    align: "center",
                    sortable: true,
                    class: "black--text text-no-wrap",
                },
                {
                    text: this.$t("marketplace.orders.status"),
                    value: "status",
                    align: "center",
                    sortable: true,
                    class: "black--text text-no-wrap",
                },
            ]
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

.filterIcon {
    color: #0EBF67;
    height: 28px;
    width: 28px;
    margin-left: 5px;
    margin-right: 5px;
}
</style>