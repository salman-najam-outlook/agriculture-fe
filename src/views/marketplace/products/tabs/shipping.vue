<template>
    <v-card-text>
        <v-row>
            <v-col sm="6">
                <template>
                    <label for="name" class="font-weight-bold subtitle-1">{{
                        $t('marketplace.products.productVisibility') }} <v-tooltip top color="00BD73" max-width="350">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon class="icon-with-background" style="color:#0EBF67;font-size: 18px;"
                                    v-bind="attrs" v-on="on">
                                    mdi-alert-circle
                                </v-icon>
                            </template>
                            <span>{{ $t('marketplace.products.productVisibility') }}</span>
                        </v-tooltip></label>
                    <v-radio-group row v-model="product.visibility">
                        <v-radio :label="$t('marketplace.products.public')" value="Public"></v-radio>
                        <v-radio :label="$t('marketplace.products.private')" value="Private"></v-radio>
                    </v-radio-group>
                </template>
                <template>
                    <label for="name" class="font-weight-bold subtitle-1">{{ $t('marketplace.products.deliveryOptions')
                        }} <v-tooltip top color="00BD73" max-width="350">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon class="icon-with-background" style="color:#0EBF67;font-size: 18px;"
                                    v-bind="attrs" v-on="on">
                                    mdi-alert-circle
                                </v-icon>
                            </template>
                            <span>{{ $t('marketplace.products.deliveryOptions') }}</span>
                        </v-tooltip></label>
                    <v-checkbox v-model="product.delivery" :label="$t('marketplace.products.delivery')"></v-checkbox>

                    <template v-if="product.delivery">
                        <v-radio-group row v-model="product.delivery_options" :rules="productRules.deliveryOptionRadio">
                            <v-radio :label="$t('marketplace.products.local')" value="LOCAL"></v-radio>
                            <v-radio :label="$t('marketplace.products.worldwide')" value="WORLDWIDE"></v-radio>
                            <v-radio :label="$t('marketplace.products.selectedCountries')" value="SELECTION"></v-radio>
                        </v-radio-group>

                        <template v-if="product.delivery_options === 'SELECTION'">
                            <label for="name" class="font-weight-bold subtitle-1">{{
                                $t('marketplace.products.selectCountries') }}</label>
                            <v-autocomplete :items="countries" multiple v-model="product.country_ids"
                                :placeholder="$t('marketplace.products.country')" item-text="name" item-value="id" dense
                                outlined style="margin-left: -1px" class="rounded"></v-autocomplete>
                        </template>
                    </template>
                </template>
            </v-col>
            <v-col sm="6">
            </v-col>
        </v-row>
        <v-row>
            <v-col sm="6">
                <template v-if="product.delivery">
                    <label class="font-weight-bold subtitle-1"> {{ $t('marketplace.products.deliveryCharges') }}
                        <v-tooltip top color="00BD73" max-width="350">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon class="icon-with-background" style="color:#0EBF67;font-size: 18px;"
                                    v-bind="attrs" v-on="on">
                                    mdi-alert-circle
                                </v-icon>
                            </template>
                            <span>{{ $t('marketplace.products.deliveryCharges') }}</span>
                        </v-tooltip></label>
                    <v-radio-group v-model="product.delivery_charge_option" column>
                        <v-radio :label="$t('marketplace.products.freeDelivery')" value="FREE"></v-radio>
                        <v-radio :label="$t('marketplace.products.fullDeliveryCharge')" value="FULL"></v-radio>
                        <v-radio :label="$t('marketplace.products.partialDeliveryCharge')" value="PARTIAL"></v-radio>
                    </v-radio-group>
                </template>

                <template>
                    <v-checkbox v-model="product.pickup" :label="$t('marketplace.products.pickup')"></v-checkbox>

                    <v-row align="center">
                        <!-- Label with Info Icon -->
                        <v-col cols="8">
                            <label for="name" class="font-weight-bold subtitle-1">{{
                                $t('marketplace.products.productAvailableTime') }} <v-tooltip top color="00BD73"
                                    max-width="350">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon class="icon-with-background" style="color:#0EBF67;font-size: 18px;"
                                            v-bind="attrs" v-on="on">
                                            mdi-alert-circle
                                        </v-icon>
                                    </template>
                                    <span>{{ $t('marketplace.products.productAvailableTime') }}</span>
                                </v-tooltip>
                            </label>
                        </v-col>

                        <!-- Unit Display with Edit Option -->
                        <v-col cols="4" class="text-right">
                            <span v-if="!isEditing">{{ product.product_avail_time_unit }}</span>
                            <v-select v-else v-model="product.product_avail_time_unit" :items="units" dense solo
                                hide-details style="max-width: 100px; display: inline-block;" item-text="code"
                                item-value="id"></v-select>

                            <v-icon color="green" small @click="toggleEdit">{{ isEditing ? 'mdi-check' : 'mdi-pencil'
                                }}</v-icon>
                        </v-col>
                    </v-row>
                    <v-text-field v-model="product.product_avail_time" outlined dense
                        :placeholder="$t('marketplace.products.typeQuantity')" class="rounded">
                    </v-text-field>
                </template>
            </v-col>
            <v-col sm="6">
                <div class="discount-box" v-if="product.delivery && product.delivery_charge_option === 'PARTIAL'">
                    <v-row align="center">
                        <v-col cols="8">
                            <label for="name" class="font-weight-bold subtitle-1">{{
                                $t('marketplace.products.percentageDeliveryCharge') }} <v-tooltip top color="00BD73"
                                    max-width="350">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon class="icon-with-background" style="color:#0EBF67;font-size: 18px;"
                                            v-bind="attrs" v-on="on">
                                            mdi-alert-circle
                                        </v-icon>
                                    </template>
                                    <span>{{ $t('marketplace.products.percentageDeliveryCharge') }}</span>
                                </v-tooltip></label>
                        </v-col>

                        <!-- Unit Display with Edit Option -->
                        <v-col cols="4" class="text-right">
                            %
                        </v-col>
                    </v-row>
                    <div class="d-flex">
                        <v-text-field v-model="product.delivery_charge_percentage" outlined
                            :placeholder="$t('marketplace.products.typeQuantity')" dense class="rounded">
                        </v-text-field>
                    </div>
                </div>
            </v-col>
        </v-row>
        <div class="d-flex justify-center py-5">
            <v-btn color="primary" outlined class="me-4 btn-cls" @click="triggerBackBtn">{{ $t('back')
                }}</v-btn>
            <v-btn color="primary" class="btn-cls" @click="triggerNextBtn">{{ $t('submit') }}</v-btn>
        </div>
        <ConfirmProduct :dialogI="productSuccessBox" @closeDialog="closeConfirmBox" />
    </v-card-text>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";
import MarketplaceService from "../../../../_services/MarketplaceService";
import ConfirmProduct from "../components/ConfirmProduct.vue";
import { ProductSteps } from "../constants/enums";

export default {
    name: "Shipping",
    async mounted() {
        await this.getUnits();
        await this.getCountries();
        await this.getProductDetail();
    },
    components: {
        ConfirmProduct
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
    data() {
        return {
            productId: this.$route.params.id || null,
            currentStep: ProductSteps.SHIPPING.name,
            productSuccessBox: false,
            packagings: [],
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
            isEditing: false,
            product: {
                visibility: "Public",
                delivery: 1,
                pickup: 1,
                delivery_options: 'WORLDWIDE',
                pickupLocation: '',
                country_ids: [],
                delivery_charge_option: 'PARTIAL',
                delivery_charge_percentage: '',
                product_avail_time: '',
                product_avail_time_unit: "kg",
                shipping_options: '',
            },
            productRules: {

            },
            units: [],
            countries: [],
        };
    },
    methods: {
        async getProductDetail() {
            this.startLoading();
            await MarketplaceService.getProduct(this.productId, this.currentStep).then((res) => {
                console.log(res)
                this.product = {
                    ...res,
                    product_avail_time_unit: this.units.find((item) => item.id == res.product_avail_time_unit)?.code,
                    shipping_options: res.delivery && res.pickup ? "BOTH" : res.delivery ? "DELIVERY" : "PICKUP",
                    pickup: (res.shipping_options === 'PICKUP' || res.shipping_options === 'BOTH') ? 1 : 0,
                    delivery: (res.shipping_options === "DELIVERY" || res.shipping_options === 'BOTH') ? 1 : 0,
                    country_ids: res?.countries?.map(country => country.country_id) || [],
                };
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

        toggleEdit() {
            this.isEditing = !this.isEditing;
        },

        triggerBackBtn() {
            this.$router.push({
                name: "marketplaceProductsAdd",
                params: {
                    id: this.productId,
                    step: ProductSteps.PRICING.id
                },
            });
        },

        async triggerNextBtn() {
            this.startLoading();
            try {
                const { productId, product, currentStep } = this;
                const payload = {
                    id: productId,
                    visibility: product.visibility,
                    delivery_options: product.delivery_options,
                    country_ids: product.country_ids,
                    delivery_charge_option: product.delivery_charge_option,
                    delivery_charge_percentage: Number(product.delivery_charge_percentage),
                    product_avail_time: Number(product.product_avail_time),
                    product_avail_time_unit: product.product_avail_time_unit,
                    shipping_options: product.delivery && product.pickup ? "BOTH" : product.delivery ? "DELIVERY" : "PICKUP",
                    step: currentStep,
                };

                await MarketplaceService.addProduct(payload);

                this.productSuccessBox = true;
            } catch (error) {
                console.error("Error adding shipping product:", error);
            }
            finally {
                this.stopLoading();
            }
        },

        async getCountries() {
            MarketplaceService.getCountries()
                .then((res) => {
                    this.countries = res?.map((item) => ({
                        id: item.id,
                        name: item.name,
                        code: item.country_code
                    }));
                })
                .catch((err) => {
                    console.error("Error fetching countries:", err);
                });
        },

        closeConfirmBox() {
            this.productSuccessBox = false;
            this.$router.push({
                name: 'marketplaceProducts',
            })
        }


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