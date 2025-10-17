<template>
    <v-card-text>
        <v-row class="pl-3">
            <v-col sm="6">
                <template>
                    <label for="name" class="title"> {{ $t("marketplace.products.price") }}<v-tooltip top color="00BD73"
                            max-width="350">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon class="icon-with-background" style="color:#0EBF67;font-size: 18px;"
                                    v-bind="attrs" v-on="on">
                                    mdi-alert-circle
                                </v-icon>
                            </template>
                            <span>{{ $t('marketplace.products.price') }}</span>
                        </v-tooltip></label>
                    <v-radio-group row v-model="product.allow_quote">
                        <v-radio :label="$t('marketplace.products.quoteRequest')" :value="true"></v-radio>
                        <v-radio :label="$t('marketplace.products.price')" :value="false"></v-radio>
                    </v-radio-group>
                </template>
                <template v-if="product.allow_quote === false">
                    <label for="name">{{ $t('marketplace.products.currency') }}<v-tooltip top color="00BD73"
                            max-width="350">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon class="icon-with-background" style="color:#0EBF67;font-size: 18px;"
                                    v-bind="attrs" v-on="on">
                                    mdi-alert-circle
                                </v-icon>
                            </template>
                            <span>{{ $t('marketplace.products.currency') }}</span>
                        </v-tooltip></label>
                    <v-autocomplete :items="currencies" v-model="product.currency" :rules="productRules.currency"
                        :placeholder="$t('marketplace.products.currency')" item-text="name" item-value="id" dense
                        outlined style="margin-left: -5px" class="rounded select-duration"
                        return-object></v-autocomplete>
                </template>
            </v-col>


            <v-col cols="6" v-if="product.allow_quote === false">
                <v-checkbox label="Promotion" v-model="product.promo_active"></v-checkbox>
                <v-btn class="mb-4" @click="openPricingSlab">
                    <v-icon>mdi mdi-plus</v-icon> {{ $t('marketplace.products.addMorePricingSlabs') }}
                </v-btn>
                <v-row class="text-center font-weight-bold">
                    <v-col cols="2">{{ $t('marketplace.products.qtyUpTo') }}</v-col>
                    <v-col cols="2">{{ $t('marketplace.products.unit') }}</v-col>
                    <v-col cols="2">{{ $t('marketplace.products.price') }}</v-col>
                    <v-col cols="1">{{ product.currency ? product.currency.symbol : '' }}</v-col>
                    <v-col cols="2" v-if="product.promo_active">{{ $t('marketplace.products.promotion') }}</v-col>
                </v-row>

                <v-row v-for="(row, index) in pricingSlabs" :key="index" class="mb-2">
                    <v-col cols="2">
                        <v-text-field v-model="row.qty" outlined dense></v-text-field>
                    </v-col>
                    <v-col cols="2">
                        <v-autocomplete item-text="code" item-value="id" v-model="product.unit_id" :items="units"
                            outlined dense></v-autocomplete>
                    </v-col>
                    <v-col cols="3">
                        <v-text-field v-model="row.price" outlined dense></v-text-field>
                    </v-col>

                    <v-col cols="2" v-if="product.promo_active">
                        <v-text-field v-model="row.promotion" outlined dense></v-text-field>
                    </v-col>
                    <v-col cols="1">
                        <v-btn icon @click="removeUnitSlab(index)" v-if="pricingSlabs.length > 1">
                            <v-icon color="red">mdi-delete</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-col>

        </v-row>

        <v-divider class="mb-5"></v-divider>
        <v-row>
            <v-col sm="6">
                <div class="group-1 ">
                    <label for="name" class="d-flex align-center">{{ $t('marketplace.products.packagingUnit')
                        }}<v-tooltip top color="00BD73" max-width="350">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon class="icon-with-background" style="color:#0EBF67;font-size: 18px;"
                                    v-bind="attrs" v-on="on">
                                    mdi-alert-circle
                                </v-icon>
                            </template>
                            <span>{{ $t('marketplace.products.packagingUnit') }}</span>
                        </v-tooltip> <v-switch inset class="ml-4" v-model="product.allow_packaging_unit"></v-switch></label>


                    <v-row v-if="product.allow_packaging_unit">
                        <v-col cols="6">
                            <v-radio-group class="d-flex align-center" row v-model="product.packaging_type">
                                <v-radio :label="$t('marketplace.products.bag')" value="bag"></v-radio>
                                <v-radio :label="$t('marketplace.products.case')" value="case"></v-radio>
                            </v-radio-group>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field v-model="product.packaging_qty" :rules="productRules.packagingQuantity"
                                outlined dense :placeholder="$t('marketplace.products.typeQuantity')"
                                class="rounded-r-0">
                            </v-text-field>
                        </v-col>
                    </v-row>
                </div>
                <div class="group-1" v-if="product.allow_packaging_unit">
                    <v-row align="center">
                        <v-col cols="8">
                            <label for="name font-weight-bold subtitle-2">{{ $t('marketplace.products.palletSize') }}
                                <v-tooltip top color="00BD73" max-width="350">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon class="icon-with-background" style="color:#0EBF67;font-size: 18px;"
                                            v-bind="attrs" v-on="on">
                                            mdi-alert-circle
                                        </v-icon>
                                    </template>
                                    <span>{{ $t('marketplace.products.palletSize') }}</span>
                                </v-tooltip></label>
                        </v-col>

                        <!-- Unit Display with Edit Option -->
                        <v-col cols="4" class="text-right">
                            {{ product.packaging_type }}
                        </v-col>
                    </v-row>

                    <v-text-field v-model="product.pallet_size" outlined dense
                        :placeholder="$t('marketplace.products.typeQuantity')" class="rounded-r-0">
                    </v-text-field>
                </div>
            </v-col>

        </v-row>
        <div class="d-flex justify-center py-5">
            <v-btn color="primary" outlined class="me-4 btn-cls" @click="triggerBackBtn">{{ $t('back')
                }}</v-btn>
            <v-btn color="primary" class="btn-cls" @click="triggerNextBtn">{{ $t('marketplace.common.next')
                }}</v-btn>
        </div>
    </v-card-text>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";
import { ProductSteps } from "../constants/enums";
import MarketplaceService from "../../../../_services/MarketplaceService";

export default {
    name: "Pricing",
    async mounted() {
        await this.getUnits();
        await this.getCurrencies();
        await this.getProductDetail();
    },
    data() {
        return {
            productId: this.$route.params.id || null,
            currentStep: ProductSteps.PRICING.name,
            pricingSlabs: [
                { id: "", qty: "", price: "", promotion: "" },
            ],
            units: [],
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
            product: {
                currency: null,
                allow_quote: false,
                currency_id: '',
                price: [],
                promo_active: false,
                pallet_size: '',
                allow_packaging_unit: 1,
                packaging_qty: '',
                packaging_type: 'case',
                unit_id: '',
            },
            productRules: {
                currency: [
                    (v) => !!v || 'Currency fields is required'
                ],

                packagingQuantity: [
                    (v) => !!v || 'Packaging Quantity fields is required'
                ],
                packagingQtyUnit: [
                    (v) => !!v || 'Packaging Quantity Unit fields is required'
                ],
                unitPacking: [
                    (v) => !!v || 'Unit Pricing field is required'
                ],
                paymentOptions: [
                    (v) => !!v || 'Payment option field is required'
                ],
                bankAccount: [
                    (v) => !!v || 'Bank account fieds is required'
                ],
                discount: [
                    (v) => !!v || 'Discount field is required'
                ],
                couponCode: [
                    (v) => !!v || 'Coupon field is required'
                ],
                usageLimit: [
                    (v) => !!v || 'Usage Limit field is required'
                ],
            },
            currencies: [],
        };
    },
    watch: {
        "$route.params.id": {
            immediate: true,
            handler(id) {
                if (id) {
                    this.productId = Number(id);
                }
                else {
                    this.productId = null;
                }
            }
        }
    },
    methods: {
        async getProductDetail() {
            this.startLoading();
            await MarketplaceService.getProduct(this.productId, this.currentStep).then((res) => {
                console.log(res)
                this.product = {
                    ...res,
                    currency: this.currencies.find((item) => item.id === res.currency_id),
                };

                // For pricing slab;
                this.pricingSlabs = res.pricingSlabs?.map((item) => ({
                    id: item.id,
                    qty: item.weight_upto,
                    price: item.price,
                    promotion: item.promotion_price,
                })) || [];

                if (this.pricingSlabs.length === 0) {
                    this.pricingSlabs.push({
                        id: "",
                        qty: "",
                        unit: "kg",
                        price: "",
                        promotion: "",
                    });
                }
            })
                .catch(error => {
                    console.log(error)
                })
                .finally(() => {
                    this.stopLoading();
                });
        },

        async getUnits() {
            const res = await MarketplaceService.getUnits();
            this.units = res?.data || [];
        },

        async getCurrencies() {
            await MarketplaceService.getCountries()
                .then((res) => {
                    this.currencies = res?.map((item) => ({
                        id: item.id,
                        name: item.currency,
                        code: item.currency_code,
                        symbol: item.currency_symbol
                    }));
                })
                .catch((err) => {
                    console.error("Error fetching currencies:", err);
                });
        },

        triggerBackBtn() {
            this.$router.push({
                name: "marketplaceProductsAdd",
                params: {
                    id: this.productId,
                    step: ProductSteps.CLASSIFICATION.id
                },
            });
        },

        async triggerNextBtn() {
            this.startLoading();
            try {
                const { productId, product, currentStep, pricingSlabs } = this;

                const payload = {
                    id: productId,
                    allow_quote: !!product.allow_quote,
                    allow_packaging_unit: !!product.allow_packaging_unit,
                    step: currentStep,
                    ...(product.allow_quote
                        ? { currency_id: null, promo_active: 0, pricingSlabs: [] }
                        : {
                            currency_id: product.currency?.id || null,
                            promo_active: !!product.promo_active,
                            pricingSlabs: Array.isArray(pricingSlabs)
                                ? pricingSlabs.map((item) => ({
                                    id: item.id ? Number(item.id) : null,
                                    weight_upto: Number(item.qty) || 0,
                                    price: Number(item.price) || 0,
                                    promotion_price: Number(item.promotion) || 0,
                                }))
                                : [],
                        }),
                    ...(product.allow_packaging_unit
                        ? {
                            pallet_size: Number(product.pallet_size) || 0,
                            packaging_type: product.packaging_type || null,
                            packaging_qty: Number(product.packaging_qty) || 0,
                        }
                        : {}),
                };

                await MarketplaceService.addProduct(payload);


                if (productId) {
                    this.$router.push({
                        name: 'marketplaceProductsAdd',
                        params: {
                            id: productId,
                            step: ProductSteps.SHIPPING.id
                        }
                    })
                }

                this.resetForm();
                this.$emit('nextStep');
                this.stopLoading();
            } catch (error) {
                console.error("Error adding shipping product:", error);
            }
            finally {
                this.stopLoading();
            }
        },

        resetForm() {
            this.product = {
                currency: '',
                allow_quote: "0",
                currency_id: '',
                price: [],
                promo_active: false,
                pallet_size: '',
                allow_packaging_unit: 1,
                packaging_qty: '',
            };
        },

        openPricingSlab() {
            this.pricingSlabs.push({ id: "", qty: "", unit: "kg", price: "", promotion: "" });
        },

        removeUnitSlab(index) {
            this.pricingSlabs.splice(index, 1);
        },
    },
    mixins: [loadingMixin]
}
</script>

<style lang="scss" scoped>
.btn-cls {
    width: 150px;
}

.text-black {
    color: black;
}
</style>