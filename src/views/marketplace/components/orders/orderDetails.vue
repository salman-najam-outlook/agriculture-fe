<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div class="d-flex mb-4 ml-4">
                <h2>{{ $t("marketplace.orders.orderId") }}: {{ orderDetails.id }}</h2>
                <v-spacer></v-spacer>
                <div class="d-flex mt-1">
                    <v-btn color="primary" :to="{ name: 'marketplaceOrders' }" dark
                        class="mr-2 px-2 py-1 text-xs custom-hover" small>
                        {{ $t("marketplace.orders.allOrders") }}
                    </v-btn>
                    <v-btn color="primary" @click="displayCancelOrderModal" dark
                        class="mr-2 px-2 py-1 text-xs custom-hover" small>
                        {{ $t("marketplace.orders.cancelOrder") }}
                    </v-btn>
                    <v-btn color="primary" @click="displayProcessOrderModal" dark
                        class="mr-2 px-2 py-1 text-xs custom-hover" small>
                        {{ $t("marketplace.orders.processOrder") }}
                    </v-btn>
                    <v-btn color="primary" :to="{ name: 'marketplaceOrders' }" dark
                        class="mr-2 px-2 py-1 text-xs custom-hover" small>
                        {{ $t("marketplace.orders.messages") }}
                    </v-btn>
                    <v-btn color="primary" :to="{ name: 'marketplaceOrders' }" dark
                        class="mr-2 px-2 py-1 text-xs custom-hover" small>
                        {{ $t("marketplace.orders.packingSlip") }}
                    </v-btn>
                    <v-btn color="primary" :to="{ name: 'marketplaceOrders' }" dark
                        class="mr-2 px-2 py-1 text-xs custom-hover" small>
                        {{ $t("marketplace.orders.addShippingCost") }}
                    </v-btn>
                </div>
            </div>
            <div class="custom-div">
                <v-container fluid>
                    <v-row>

                        <v-col cols="8">
                            <v-card elevation="0" class="pa-1 mb-4">
                                <v-simple-table class="transparent-table first-table">
                                    <template v-slot:default>
                                        <thead>
                                            <tr>
                                                <th class="product-header" style="width:30%;">
                                                    <h3 class="header-text"> {{ $t("marketplace.orders.product") }}
                                                    </h3>
                                                </th>
                                                <th style="width:20%;">
                                                    <h3 class="header-text"> {{ $t("marketplace.orders.qty") }}
                                                    </h3>
                                                </th>
                                                <th style="width:50%;">
                                                    <h3 class="header-text"> {{ $t("marketplace.orders.price") }}
                                                    </h3>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="product in products" :key="product.id">
                                                <td class="d-flex align-center product-column mb-8"
                                                    style="max-width: 50%;">
                                                    <v-img :src="product.image" max-height="65px" max-width="66px"
                                                        style="border-radius: 15px; object-fit: cover;" />
                                                    <span class="ml-2 text-truncat"
                                                        style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><strong>{{
                                                            product.name }}</strong></span>
                                                </td>
                                                <td style="text-align: start;"><span>{{ product.quantity }}</span>
                                                    <span>{{ product.unit }}</span>
                                                </td>
                                                <td class="price-column" style="text-align: start;"><span>{{
                                                    product.currency }}</span> <span>{{
                                                            product.price }}</span></td>
                                            </tr>
                                        </tbody>
                                    </template>
                                </v-simple-table>

                                <v-divider class="ma-4" />

                                <v-simple-table class="transparent-table second-table">
                                    <template v-slot:default>
                                        <tbody>
                                            <tr>
                                                <td class="d-flex align-start">
                                                    <span class="ml-4"><strong>{{
                                                        $t("marketplace.orders.discountCoupon") }}</strong></span>
                                                </td>

                                                <td class="value-column"><span>{{
                                                    orderDetails.products[0]?.coupon?.price }}%</span></td>
                                            </tr>
                                            <tr>
                                                <td class="d-flex align-start">
                                                    <span class="ml-4"><strong>{{
                                                        $t("marketplace.orders.shippingCharges") }}</strong></span>
                                                </td>

                                                <td class="value-column"><span>{{ orderDetails.order_shipping.cost
                                                        }}</span></td>
                                            </tr>
                                            <tr>
                                                <td class="d-flex align-start">
                                                    <span class="ml-4"><strong>{{ $t("marketplace.orders.totalPrice")
                                                            }}</strong></span>
                                                </td>

                                                <td class="value-column"><span>{{ orderDetails.order_quote?.currency_id
                                                        }} {{ orderDetails.order_quote?.price }}</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </template>
                                </v-simple-table>
                            </v-card>
                            <v-card elevation="0" class="pa-8 mb-4">

                                <h4>{{ $t("marketplace.orders.generalInformation") }}</h4>

                                <v-row class="mt-4" style="font-size: small;">
                                    <v-col cols="12">
                                        <v-row align="start">
                                            <v-col cols="4" class="pb-0"><strong> {{ $t("marketplace.orders.orderDate")
                                                    }}</strong></v-col>
                                            <v-col cols="8" class="text-left pb-0">
                                                <span>{{ this.formatDate(orderDetails.created_at) }}</span>
                                            </v-col>
                                        </v-row>
                                        <v-row align="start">
                                            <v-col cols="4" class="pb-0"><strong> {{
                                                    $t("marketplace.orders.paymentOption") }}</strong></v-col>
                                            <v-col cols="8" class="text-left pb-0">
                                                <span>{{ orderDetails.payment_type }}</span>
                                            </v-col>
                                        </v-row>
                                        <v-row align="start">
                                            <v-col cols="4" class="pb-0"><strong> {{
                                                    $t("marketplace.orders.orderStatus") }}</strong></v-col>
                                            <v-col cols="8" class="text-left pb-0">
                                                <span
                                                    :style="{ color: this.getStatusColor(orderDetails.current_status) }">
                                                    {{ this.getStatus(orderDetails.current_status) }}
                                                </span>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-row>

                            </v-card>
                            <v-card elevation="0" class="pa-8">
                                <h4> {{ $t("marketplace.orders.buyerDetail") }}</h4>
                                <v-row class="mt-4" style="font-size: small;">
                                    <v-col cols="12">
                                        <v-row align="start">
                                            <v-col cols="4" class="pb-0"><strong>{{ $t("marketplace.orders.buyerName")
                                                    }}</strong></v-col>
                                            <v-col cols="8" class="text-left pb-0"><span>{{ orderDetails.buyer?.full_name
                                                    }}</span></v-col>
                                        </v-row>
                                        <v-row align="start">
                                            <v-col cols="4" class="pb-0"><strong>{{
                                                $t("marketplace.orders.deliveryAddress") }}</strong></v-col>
                                            <v-col cols="8" class="text-left pb-0"><span>{{
                                                orderDetails.delivery_location
                                                    }}</span></v-col>
                                        </v-row>
                                        <v-row align="start">
                                            <v-col cols="4" class="pb-0"><strong>{{
                                                $t("marketplace.orders.contactNumber") }}</strong></v-col>
                                            <v-col cols="8" class="text-left pb-0"><span>{{ orderDetails.buyer?.mobile
                                                    }}</span></v-col>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-col>
                        <v-col cols="4">

                            <v-card elevation="0" class="pa-8" style="height: 100%;">

                                <v-row class="text-h6 mb-4 text-start">
                                    <v-col cols="12"><strong> {{ $t("marketplace.orders.orderStatusHistory")
                                            }}</strong></v-col>
                                </v-row>
                                <v-row v-for="status in orderDetails.order_history" :key="status.date" class="mt-3"
                                    align="center">
                                    <v-col cols="12" class="d-flex align-center">
                                        <div
                                            style="width: 50px; height: 50px; border-radius: 50%; background-color: gray; display: flex; align-items: center; justify-content: center; overflow: hidden; margin-right: 12px;">
                                            <v-img :src="getIcon(status.status)" style="object-fit: cover;" width="60px"
                                                height="60px" />
                                        </div>
                                        <div :style="{ color: getStatusColor(status.label) }">
                                            <div>{{ getStatus(status.status) }}</div>
                                            <small>{{ formatDate(status.updated_at) }}</small>
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-col>
                    </v-row>
                    <CancelOrderDialog :dialog="showCancelOrderModal" :order-id="orderDetails.id"
                        :user-id="orderDetails.user_id" @closeOrderCancelModal="closeOrderCancelModalBox">
                    </CancelOrderDialog>
                    <ProcessOrderDialog :dialog="showProcessOrderModal" :order-id="orderDetails.id"
                        @closeProcessOrderModal="closeOrderProcessModalBox">
                    </ProcessOrderDialog>
                </v-container>
            </div>

        </v-container>
    </div>

</template>

<script>
import DownloadMixin from "@/mixins/DownloadMixin";
import loadingMixin from "@/mixins/LoadingMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import marketplaceService from "@/_services/MarketplaceService";
import CancelOrderDialog from "./cancelOrderDialog.vue";
import ProcessOrderDialog from "./processOrderDialog.vue";

export default {
    computed: {


    },
    mounted() {
        this.loading = false;
        this.fetchOrderDetails();
    },
    created() {

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
        CancelOrderDialog,
        ProcessOrderDialog
    },
    methods: {
        getIcon(status) {
            return this.icons[status] || '';
        },
        getStatusColor(status) {
            return status === "DELIVERED" ? "green" : "black";
        },
        getStatus(status) {
            switch (status) {
                case "PENDING":
                    return "Order Placed";
                case "PROCESSING":
                    return "Processing";
                case "PACKING":
                    return "Packing";
                case "SHIPPED":
                    return "Out for Delivery";
                case "READY_FOR_PICKUP":
                    return "Ready for Pick-Up";
                case "CANCELLED":
                    return "Cancelled";
                case "DELIVERED":
                    return "Deilvered";
                default:
                    return "Order Placed";
            }
        },
        formatDate(datetime) {
            const date = new Date(datetime);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
            const day = String(date.getDate()).padStart(2, '0');
            return `${day}-${month}-${year}`;
        },

        async fetchOrderDetails() {
            this.loading = true;
            try {
                const response = await marketplaceService.getOrderById(this.$route.params.id);
                this.orderDetails = response;
                this.user_id = response.user_id;
                this.products = response.products.map(product => ({
                    id: product.id,
                    name: product.name,
                    quantity: product.OrderProduct?.qty,
                    price: product.pricing_slabs[0]?.price,
                    unit: product.unit?.code,
                    currency: product.currency?.currency_symbol,
                    image: product.product_files[0]?.url || null
                }));

            } catch (error) {
                this.$toast.error(error.response.data.message);
            } finally {
                this.loading = false;
            }
        },
        displayCancelOrderModal() {
            this.showCancelOrderModal = true
        },
        async closeOrderCancelModalBox() {
            this.fetchOrderDetails();
            this.showCancelOrderModal = false
        },
        displayProcessOrderModal() {
            this.showProcessOrderModal = true
        },
        async closeOrderProcessModalBox() {
            this.fetchOrderDetails();
            this.showProcessOrderModal = false
        }
    },
    data() {
        return {
            icons: {
                "PENDING": require("../../../../assets/icons/order.png"),
                "PROCESSING": require("../../../../assets/icons/processing.png"),
                "PACKING": require("../../../../assets/icons/packing.png"),
                "SHIPPED": require("../../../../assets/icons/shipped.png"),
                "DELIVERED": require("../../../../assets/icons/delivered.png")
            },
            breadcrumbs: [
                {
                    text: this.$t("dashboard"),
                    disabled: true,
                    to: "/",
                },
                {
                    text: this.$t("marketplace.orders.orders"),
                    disabled: false,
                    to: "/marketplace/orders",
                },
                {
                    text: this.$t("marketplace.orders.orderDetails"),
                    disabled: true,
                    to: "breadcrumbs_link_1",
                },
            ],
            orderDetails: {},
            products: [],
            orderHistory: [],
            showCancelOrderModal: false,
            showProcessOrderModal: false,
            cancelData: {
                id: this.$route.params.id,
                user_id: null,
            },
        };
    },

    mixins: [loadingMixin, getPermittedActions, DownloadMixin]
};
</script>

<style lang="scss" scoped>
.letterSpacing {
    letter-spacing: 0;
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

.custom-hover:hover {
    background-color: #8F8F8F !important;
    color: white !important;
    transition: background-color 0.2s ease;
}

.custom-div {
    background-color: rgb(255 255 255 / 66%);
    padding: 12px;
}


.header-text {
    color: black;
    margin: 0;
    padding: 0;

}

.transparent-table th,
.transparent-table td {
    border: none !important;

}

.transparent-table tbody tr:hover {
    background-color: inherit !important;
    pointer-events: none;
}

.first-table .product-column {
    max-width: 400px !important;
    overflow-wrap: break-word;
    white-space: normal;
}


.first-table .price-column,
.second-table .value-column {
    width: 20%;
    text-align: start;
}


.second-table td:nth-child(2) {
    width: 40%;
}


.first-table td,
.second-table td {
    padding: 8px;
}
</style>
