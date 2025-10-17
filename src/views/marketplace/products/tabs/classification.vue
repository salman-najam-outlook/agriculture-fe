<template>
    <v-form ref="classificationForm" autocomplete="off" v-model="valid">
        <v-card class="mb-5" flat>
            <v-card-text>
                <v-row class="pl-3">
                    <v-col cols="6">
                        <label for="name">{{ $t('marketplace.products.productCategory') }}
                            <v-tooltip top color="00BD73" max-width="350">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon class="icon-with-background" style="color:#0EBF67;font-size: 18px;"
                                        v-bind="attrs" v-on="on">
                                        mdi-alert-circle
                                    </v-icon>
                                </template>
                                <span>{{ $t('marketplace.products.productCategory') }}</span>
                            </v-tooltip></label>
                        <v-autocomplete :items="productCategories" @change="handleProductCategoryChange"
                            v-model="product.category" :rules="productRules.productCategory"
                            :placeholder="$t('marketplace.products.selectProductCategory')" item-text="name"
                            item-value="id" dense outlined style="margin-left: -1px" class="rounded select-duration"
                            return-object></v-autocomplete>
                    </v-col>
                    <v-col sm="6">
                        <label for="name">{{ $t('marketplace.products.productSubcategory') }} <v-tooltip top
                                color="00BD73" max-width="350">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon class="icon-with-background" style="color:#0EBF67;font-size: 18px;"
                                        v-bind="attrs" v-on="on">
                                        mdi-alert-circle
                                    </v-icon>
                                </template>
                                <span>{{ $t('marketplace.products.productSubcategory') }}</span>
                            </v-tooltip></label>
                        <v-autocomplete :items="productSubCategories" v-model="product.subcategory_id"
                            :placeholder="$t('marketplace.products.makeASelection')" item-text="name" item-value="id"
                            dense outlined style="margin-left: -1px" class="rounded select-duration"></v-autocomplete>
                    </v-col>
                    <v-col sm="6">
                        <label for="name">{{ $t('marketplace.products.productFarm') }}
                            <v-tooltip top color="00BD73" max-width="350">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon class="icon-with-background" style="color:#0EBF67;font-size: 18px;"
                                        v-bind="attrs" v-on="on">
                                        mdi-alert-circle
                                    </v-icon>
                                </template>
                                <span>{{ $t('marketplace.products.productFarm') }}</span>
                            </v-tooltip></label>
                        <v-autocomplete :items="farms" v-model="product.farm_id" :rules="productRules.farm"
                            :placeholder="$t('marketplace.products.makeASelection')" item-text="farmName" :loading="farmLoading"
                            item-value="id" dense outlined style="margin-left: -1px"
                            class="rounded select-duration"></v-autocomplete>
                    </v-col>
                    <v-col sm="6">
                        <label class="expiration" for="name">{{ $t('marketplace.products.productExpiration')
                            }}<v-tooltip top color="00BD73" max-width="350">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon class="icon-with-background" style="color:#0EBF67;font-size: 18px;"
                                        v-bind="attrs" v-on="on">
                                        mdi-alert-circle
                                    </v-icon>
                                </template>
                                <span>{{ $t('marketplace.products.productExpiration') }}</span>
                            </v-tooltip></label>
                        <v-menu v-model="productExpirationMenu" :close-on-content-click="false" :nudge-right="40"
                            transition="scale-transition" offset-y min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field append-icon="mdi-calendar" :rules="productRules.productExpiration"
                                    v-model="product.expiry_date" outlined dense readonly v-bind="attrs" v-on="on"
                                    v-on:click:append="productExpirationMenu = true"
                                    :placeholder="$t('marketplace.products.makeASelection')"></v-text-field>
                            </template>
                            <v-date-picker v-model="product.expiry_date"
                                :placeholder="$t('marketplace.products.makeASelection')"
                                @input="productExpirationMenu = false"></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col sm="6">
                        <label for="name">{{ $t('marketplace.products.quantityAvailable') }}
                            <v-tooltip top color="00BD73" max-width="350">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon class="icon-with-background" style="color:#0EBF67;font-size: 18px;"
                                        v-bind="attrs" v-on="on">
                                        mdi-alert-circle
                                    </v-icon>
                                </template>
                                <span>{{ $t('marketplace.products.quantityAvailable') }}</span>
                            </v-tooltip></label>
                        <v-radio-group row v-model="product.preOrderWarehouseRadio"
                            :rules="productRules.preOrderWarehouseRadio">
                            <v-radio label="Quantity" value="quantity"></v-radio>
                            <v-radio disabled label="Warehouse" value="warehouse"></v-radio>
                            <v-radio label="Pre Order" value="pre_order"></v-radio>
                        </v-radio-group>
                        <div class="dynamic-label" v-if="product.preOrderWarehouseRadio == 'quantity'">

                            <v-row class="d-flex" no-gutters>
                                <v-col cols="8">
                                    <v-text-field v-model="product.qty" :rules="productRules.quantityAvailable" outlined
                                        dense :placeholder="$t('marketplace.products.typeQuantity')"
                                        class="rounded-r-0">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="4">
                                    <v-autocomplete :items="units" v-model="product.unit_id"
                                        :rules="productRules.quantityAvailableUnit" placeholder="Unit" item-text="code"
                                        item-value="id" dense outlined style="margin-left: -1px"
                                        class="rounded-l-0 select-duration"></v-autocomplete>
                                </v-col>
                            </v-row>
                        </div>

                        <div class="dynamic-label" v-if="product.preOrderWarehouseRadio == 'warehouse'">
                            <v-menu v-model="avalibilityDate" :close-on-content-click="false" :nudge-right="40"
                                transition="scale-transition" offset-y min-width="auto">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-model="product.avalibilityDate"
                                        :rules="productRules.avalibilityDate" append-icon="mdi-caret-down" outlined
                                        dense readonly v-bind="attrs" v-on="on"
                                        v-on:click:append="avalibilityDate = true"
                                        :placeholder="$t('marketplace.products.selectProductFromWarehouse')"></v-text-field>
                                </template>

                            </v-menu>
                        </div>

                        <div class="dynamic-label" v-if="product.preOrderWarehouseRadio == 'pre_order'">
                            <v-menu v-model="avalibilityDate" :close-on-content-click="false" :nudge-right="40"
                                transition="scale-transition" offset-y min-width="auto">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-model="product.pre_order_available_date"
                                        :rules="productRules.avalibilityDate" append-icon="mdi-calendar" outlined dense
                                        readonly v-bind="attrs" v-on="on" v-on:click:append="avalibilityDate = true"
                                        :placeholder="$t('marketplace.products.selectProductAvailabilityDate')"></v-text-field>
                                </template>
                                <v-date-picker v-model="product.pre_order_available_date"
                                    :placeholder="$t('marketplace.product.selectProductAvailabilityDate')"
                                    @input="avalibilityDate = false"></v-date-picker>
                            </v-menu>
                        </div>
                    </v-col>
                    <v-col sm="6">
                        <label for="name">{{ $t('marketplace.products.minimumOrderQuantity') }}<v-tooltip top
                                color="00BD73" max-width="350">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon class="icon-with-background" style="color:#0EBF67;font-size: 18px;"
                                        v-bind="attrs" v-on="on">
                                        mdi-alert-circle
                                    </v-icon>
                                </template>
                                <span>{{ $t('marketplace.products.minimumOrderQuantity') }}</span>
                            </v-tooltip></label>
                        <v-row class="d-flex" no-gutters>
                            <v-col cols="8">
                                <v-text-field v-model="product.min_order_qty" :rules="productRules.minimumOrderQuantity"
                                    outlined dense :placeholder="$t('marketplace.products.typeQuantity')"
                                    class="rounded-r-0">
                                </v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-autocomplete :items="units" v-model="product.unit_id"
                                    :rules="productRules.minimumOrderQuantityUnit" placeholder="Unit" item-text="code"
                                    item-value="id" dense outlined style="margin-left: -1px"
                                    class="rounded-l-0 select-duration"></v-autocomplete>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
                <div class="d-flex justify-center py-5">
                    <v-btn color="primary" outlined class="me-4 btn-cls" @click="triggerBackBtn">{{ $t('back')
                        }}</v-btn>
                    <v-btn color="primary" class="btn-cls" @click="triggerNextBtn">{{ $t('marketplace.common.next')
                        }}</v-btn>
                </div>
            </v-card-text>
        </v-card>
    </v-form>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";
import DateMixin from '@/mixins/DateMixin';
import MarketplaceService from '@/_services/MarketplaceService';
import MemberDataService from '@/_services/MemberDataService'
import { ProductSteps } from "../constants/enums";


export default {
    name: "Classification",
    async mounted() {
        this.getUserFarms();
        await this.getUnits();
        await this.getProductCategories();
        await this.getProductDetail();
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
            farmLoading: false,
            productId: this.$route.params.id || null,
            currentStep: ProductSteps.CLASSIFICATION.name,
            valid: true,
            productExpirationMenu: false,
            avalibilityDate: false,
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
                category: null,
                category_id: '',
                subcategory_id: '',
                farm_id: '',
                expiry_date: '',
                quantityAvailable: '',
                preOrderWarehouseRadio: 'quantity',
                pre_order_available_date: '',
                min_order_qty: '',
                qty: '',
                unit_id: '',
                user_id: 294,
            },
            productRules: {
                //classification
                productCategory: [
                    (v) => !!v || 'Product category field is required'
                ],
                productExpiration: [
                    (v) => !!v || 'Product expiration field is required'
                ],
                quantityAvailable: [
                    (v) => !!v || 'Quanitity available field is required'
                ],
                quantityAvailableUnit: [
                    (v) => !!v || 'Quantity available unit fields is required'
                ],
                preOrderWarehouseRadio: [
                    (v) => !!v || 'Please select pre-order or warehouse'
                ],
                avalibilityDate: [
                    (v) => !!v || 'Avalibility date field is required'
                ],
                minimumOrderQuantity: [
                    (v) => !!v || 'Minimum order quanitity field is required'
                ],
                minimumOrderQuantityUnit: [
                    (v) => !!v || 'Minimum order quanitity unit field is required'
                ],
            },
            units: [
            ],
            productCategories: [
            ],
            productSubCategories: [],
            farms: [],
        };
    },
    methods: {
        async getProductDetail() {
            MarketplaceService.getProduct(this.productId, this.currentStep).then((res) => {
                const category = this.productCategories.find((item) => item.id === res.category_id);
                this.productSubCategories = category.subcategories || [];
                this.product = {
                    ...res,
                    expiry_date: this.getLocalTimeDashFormat(res.expiry_date),
                    pre_order_available_date: res.pre_order_available_date ? this.getLocalTimeDashFormat(res.pre_order_available_date) : null,
                    category,
                    preOrderWarehouseRadio: res.pre_order_available ? 'pre_order' : 'quantity',
                };
            })
                .catch(error => {
                    console.log(error)
                });
        },

        getUserFarms() {
            this.farmLoading = true;
            MemberDataService.getFarms().then(res => {
                this.farms = res.data.response
            }).catch(err => {
                console.log(err)
            })
            .finally(()=>{
                this.farmLoading = false;
            })
        },

        async triggerNextBtn() {
            if (!this.$refs.classificationForm.validate()) return;
            this.startLoading();
            try {
                const { productId, product, currentStep } = this;
                const payload = {
                    id: productId,
                    category_id: product.category.id,
                    subcategory_id: product.subcategory_id,
                    farm_id: product.farm_id,
                    expiry_date: product.expiry_date,
                    unit_id: product.unit_id,
                    min_order_qty: Number(product.min_order_qty),
                    step: currentStep,
                    ...(product.preOrderWarehouseRadio == 'pre_order' ? {
                        pre_order_available: 1,
                        pre_order_available_date: product.pre_order_available_date,
                        qty: null,
                    } : {
                        pre_order_available: 0,
                        pre_order_available_date: null,
                        qty: Number(product.qty),
                    })
                };
                const headers = {
                    headers: { "Content-Type": "application/json" },
                }

                await MarketplaceService.addProduct(payload, headers);

                if (productId) {
                    this.$router.push({
                        name: 'marketplaceProductsAdd',
                        params: {
                            id: productId,
                            step: ProductSteps.PRICING.id
                        }
                    })
                }

                this.$notify({
                    type: "success",
                    title: "Information saved successfully.",
                });

                // Reset product form
                this.resetForm();
                this.$emit('nextStep');
                this.stopLoading();


            } catch (error) {
                this.stopLoading();
                this.$notify({
                    type: "error",
                    title: "Failed to submit the product.",
                    text: error.response?.data?.message || "An error occurred while submitting the product.",
                });
            }
        },

        triggerBackBtn() {
            this.$router.push({
                name: "marketplaceProductsAdd",
                params: {
                    id: this.productId,
                    step: ProductSteps.GENERAL_INFORMATION.id
                },
            });
        },

        resetForm() {
            this.product = {
                category: null,
                category_id: '',
                subcategory_id: '',
                farm_id: '',
                expiry_date: '',
                quantityAvailable: '',
                quantityAvailableUnit: '',
                preOrderWarehouseRadio: 'quantity',
                pre_order_available_date: '',
                min_order_qty: '',
                qty: '',
                unit_id: '',
                user_id: 294,
            };
            this.$refs.classificationForm.reset();
        },

        async getProductCategories() {
            await MarketplaceService.getProductCategories().then(res => {
                this.productCategories = res.items;
            }).catch(() => { })
        },

        async getUnits() {
            const res = await MarketplaceService.getUnits();
            this.units = res?.data || [];
        },

        handleProductCategoryChange() {
            this.productSubCategories = this.product.category.subcategories;
        },
    },
    mixins: [loadingMixin, DateMixin]
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