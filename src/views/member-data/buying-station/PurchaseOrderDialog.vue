<template>
    <v-container>
        <v-dialog v-model="dialog" width="800" @click:outside="closeModal">
            <v-card rounded="0" style="position: relative;">
                <v-overlay :value="loading" absolute>
                    <v-progress-circular indeterminate size="64"></v-progress-circular>
                </v-overlay>
                <v-toolbar color="primary" class="white--text" flat>
                    <v-toolbar-title class="font-weight-bold">{{ $t('memberDataSection.purchaseOrder')
                    }}</v-toolbar-title>
                    <v-spacer></v-spacer>

                    <v-btn icon class="white--text" @click="closeModal">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-form autocomplete="off" ref="purchaseOrderForm" @submit.prevent="submitPurchaseOrder"
                    v-model="valid">
                    <v-card-text class="black--text">
                        <v-row class="mb-3">
                            <v-col cols="6" class="py-0 px-4">
                                <label>{{ $t('memberDataSection.purchaseDate') }}<span
                                        class="red--text">*</span></label>
                                <v-menu v-model="purchaseDateMenu" :close-on-content-click="false" :nudge-right="40"
                                    transition="scale-transition" offset-y min-width="auto">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field v-model="purchaseOrder.purchasedAt" append-icon="mdi-calendar"
                                            outlined dense readonly v-bind="attrs" v-on="on"
                                            v-on:click:append="purchaseDateMenu = true" :rules="purchaseOrderRules.purchaseDate"
                                            :placeholder="$t('memberDataSection.pOrder.selectDate')"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="purchaseOrder.purchasedAt" placeholder="Select Date"
                                        @input="purchaseDateMenu = false"></v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="6" class="py-0 px-4">
                                <label>{{ $t('memberDataSection.selectFarmer') }}<span
                                        class="red--text">*</span></label>
                                <v-select @input="onFarmerSelect()" v-model="purchaseOrder.farmerId" :items="farmers" outlined dense :rules="purchaseOrderRules.farmer" item-value="id" :item-text="getFieldText"
                                    :placeholder="$t('memberDataSection.pOrder.makeSelection')">
                                </v-select>
                            </v-col>
                            <v-col cols="6" class="py-0 px-4">
                                <label>{{ $t('memberDataSection.selectFarm') }}</label>
                                <v-select v-model="purchaseOrder.farmId" :items="farms" outlined dense item-value="id" item-text="farmName" :loading="loading"
                                    :placeholder="$t('memberDataSection.pOrder.makeSelection')">
                                </v-select>
                            </v-col>
                            <v-col cols="6" class="py-0 px-4">
                                <label>{{ $t('memberDataSection.selectPlantation') }}</label>
                                <v-select v-model="purchaseOrder.plantationId" :items="plantation" item-text="plantation_name" item-value="id" outlined dense :loading="loading"
                                    :placeholder="$t('memberDataSection.pOrder.makeSelection')">
                                </v-select>
                            </v-col>
                            <v-col cols="6" class="py-0 px-4">
                                <label>{{ $t('memberDataSection.coffeeSpecies') }}</label>
                                <v-select v-model="purchaseOrder.speciesId" :items="coffeeSpecies" @change="getCoffeeVariety" outlined dense item-value="id" item-text="name"
                                    :placeholder="$t('memberDataSection.pOrder.makeSelection')">
                                </v-select>
                            </v-col>
                            <v-col cols="6" class="py-0 px-4">
                                <label>{{ $t('memberDataSection.coffeeVariety') }}</label>
                                <v-select v-model="purchaseOrder.varietyId" :items="coffeeVariety" outlined dense item-value="id" item-text="name" :loading="loading"
                                    :placeholder="$t('memberDataSection.pOrder.makeSelection')">
                                </v-select>
                            </v-col>
                            <v-col cols="6" class="py-0 px-4">
                                <label>{{ $t('memberDataSection.coffeeType') }}</label>
                                <v-select
                                    v-model="purchaseOrder.coffeeTypeId"
                                    :items="coffeeTypes"
                                    outlined
                                    dense
                                    item-value="id"
                                    item-text="name"
                                    :placeholder="$t('memberDataSection.pOrder.makeSelection')"
                                >
                                </v-select>
                            </v-col>
                            <v-col cols="6" class="py-0 px-4">
                                <div class="d-flex justify-space-between align-end">
                                    <label>{{ $t('memberDataSection.coffeeCherryQuantity') }}<span
                                            class="red--text">*</span></label>
                                    <label>KG</label>
                                </div>

                                <v-text-field type="number" outlined dense v-model="purchaseOrder.coffeeCherryQty" :rules="purchaseOrderRules.coffeeCherryQnt"
                                    :placeholder="$t('memberDataSection.pOrder.coffeeType')">
                                </v-text-field>
                            </v-col>
                            <v-col cols="6" class="py-0 px-4">
                                <label>{{ $t('memberDataSection.coffeeCherryQuality') }}<span
                                        class="red--text">*</span></label>
                                <v-select v-model="purchaseOrder.coffeeCherryQlty" :items="['A', 'B', 'C', 'D', 'E']" outlined dense :rules="purchaseOrderRules.coffeeCherryQlty"
                                    :placeholder="$t('memberDataSection.pOrder.makeSelection')">
                                </v-select>
                            </v-col>
                            <v-col cols="6" class="py-0 px-4">
                                <label>{{ $t('memberDataSection.pricePerKg') }}<span class="red--text">*</span></label>

                                <v-text-field type="number" outlined dense v-model="purchaseOrder.perKgPrice" :rules="purchaseOrderRules.perKgPrice"
                                    :placeholder="$t('memberDataSection.pOrder.enterPrice')">
                                </v-text-field>
                            </v-col>


                        </v-row>
                        <v-divider></v-divider>
                        <div class="pay-now-section my-4">
                            <!-- <v-btn width="112" color="primary" type="submit" class="btn-11 btn-22">
                                Pay Now
                            </v-btn> -->
                            <div class="total-section">
                                <span class="total">
                                    USD {{ isNaN((Number(purchaseOrder.coffeeCherryQty) * Number(purchaseOrder.perKgPrice)).toFixed(2)) ? 0 :
                                    ((Number(purchaseOrder.coffeeCherryQty) * Number(purchaseOrder.perKgPrice)).toFixed(2))
                                    }}
                                </span>
                                <span class="total-title">
                                  {{ $t('memberDataSection.pOrder.grandTotal')}}
                                </span>

                            </div>

                        </div>
                        <v-card-actions class="mt-10">
                            <v-spacer></v-spacer>
                            <v-btn class="" outlined color="primary" @click="closeModal" width="112">
                                {{ $t('cancel') }}
                            </v-btn>
                            <v-btn width="112" color="primary" type="submit" class="btn-11 btn-22">
                                {{ $t('submit') }}
                            </v-btn>
                        </v-card-actions>
                    </v-card-text>
                </v-form>

            </v-card>
        </v-dialog>
    </v-container>

</template>
<script>
import loading from "@/mixins/LoadingMixin";
import CoffeeService from "@/_services/CoffeeService.js"
import PlantationService from "@/_services/PlantationService.js"
import BuyingStationService from "@/_services/BuyingStationService";
import moment from "moment";

export default {
    data() {
        return {
            valid: true,
            purchaseDateMenu: false,
            purchaseOrder: {},
            coffeeVariety: [],
            coffeeSpecies: [],
            coffeeTypes: [],
            plantation: [],
            loading: false,
            farms: [],
            farmers: [],
            purchaseOrderRules: {
                purchaseDate: [
                    (v) => !!v || this.$t('memberDataSection.pOrder.reqPurchaseDate')
                ],
                farmer: [(v) => !!v || this.$t('memberDataSection.pOrder.reqFarmer')],
                coffeeCherryQnt: [(v) => !!v || this.$t('memberDataSection.pOrder.reqCoffeeQnty')],
                coffeeCherryQlty: [(v) => !!v || this.$t('memberDataSection.pOrder.reqCoffeeQnty')],
                perKgPrice: [(v) => !!v || this.$t('memberDataSection.pOrder.reqPrice')],
            }
        }
    },
    computed: {
        dialog: {
            get() {
                return this.dialogI;
            },
            set(value) {
                if (!value) {
                    this.closeModal();
                }
            },
        },
    },
    methods: {
        getFieldText(item) {return `${item.firstName} ${item?.lastName || ''} ${item?.userType === 'offline' ? '(O)' : ''}` },
        closeModal() {
            this.$emit("closepurchaseOrderDialog");
        },
        async submitPurchaseOrder() {
            if (!this.$refs.purchaseOrderForm.validate()) return;
            
            // Final check to ensure buyingStationId is set
            if (!this.purchaseOrder.buyingStationId && this.purchaseItem && this.purchaseItem.buyingStationId) {
                this.purchaseOrder.buyingStationId = this.purchaseItem.buyingStationId;
                console.log('Final check: Setting buyingStationId:', this.purchaseItem.buyingStationId);
            }
            
            this.startLoading();
            try {
                console.log('Purchase Order Data:', this.purchaseOrder)
                console.log('buyingStationId:', this.purchaseOrder.buyingStationId)
                if (this.purchaseOrder.id) {
                    const { data } = await this.$http.put("coffee/buying-station/purchase-order", {
                        orderId: this.purchaseOrder.id,
                        farmerId: this.purchaseOrder.farmerId,
                        buyingStationId: this.purchaseOrder.buyingStationId,
                        farmId: this.purchaseOrder.farmId,
                        plantationId: this.purchaseOrder.plantationId,
                        speciesId: this.purchaseOrder.speciesId,
                        varietyId: this.purchaseOrder.varietyId,
                        coffeeTypeId: this.purchaseOrder.coffeeTypeId,
                        coffeeCherryQty: this.purchaseOrder.coffeeCherryQty,
                        coffeeCherryQlty: this.purchaseOrder.coffeeCherryQlty,
                        perKgPrice: this.purchaseOrder.perKgPrice,
                        grandTotal: parseInt(this.purchaseOrder.coffeeCherryQty) * parseInt(this.purchaseOrder.perKgPrice),
                        isPaid: "1",
                        purchasedAt: this.purchaseOrder.purchasedAt ? moment(this.purchaseOrder.purchasedAt).format('MM/DD/YYYY') : null,
                    })
                    if (data && data.code === 200) {
                        this.$notify({
                            title: "Purchase Order Initiated successfully.",
                            type: "success",
                        });
                    }
                } else {
                    const { data } = await this.$http.post("coffee/buying-station/purchase-order", {
                        farmerId: this.purchaseOrder.farmerId,
                        buyingStationId: this.purchaseOrder.buyingStationId,
                        farmId: this.purchaseOrder.farmId,
                        plantationId: this.purchaseOrder.plantationId,
                        speciesId: this.purchaseOrder.speciesId,
                        varietyId: this.purchaseOrder.varietyId,
                        coffeeTypeId: this.purchaseOrder.coffeeTypeId,
                        coffeeCherryQty: this.purchaseOrder.coffeeCherryQty,
                        coffeeCherryQlty: this.purchaseOrder.coffeeCherryQlty,
                        perKgPrice: this.purchaseOrder.perKgPrice,
                        grandTotal: parseInt(this.purchaseOrder.coffeeCherryQty) * parseInt(this.purchaseOrder.perKgPrice),
                        isPaid: "1",
                        purchasedAt: this.purchaseOrder.purchasedAt ? moment(this.purchaseOrder.purchasedAt).format('MM/DD/YYYY') : null,
                    })
                    if (data && data.code === 200) {
                        this.$notify({
                            title: "Purchase Order Initiated successfully.",
                            type: "success",
                        });
                    }
                }
                this.$emit('updatePurchaseOrder')
                this.closeModal()
            } catch (err) {
                console.log(err)
            }
            this.stopLoading();
        },
        batchRatingItem(item) {
            this.purchaseOrder.batchRating = item
        },
        async getCoffeeVariety() {
            this.startLoading();
            try {
                const d = await CoffeeService.getMemberDataCoffeeVariety({ page: 1, itemsPerPage: 100, sortBy: [], coffeeSpecies: this.purchaseOrder.speciesId })
                if (d.code === 200) {
                    this.coffeeVariety = d.data.rows;
                }
            } catch (err) {
                console.log('e', err)
            } finally {
                this.stopLoading();
            }
        },
        async getCoffeeSpecies() {
            try {
                const d = await CoffeeService.getMemberDataCoffeeSpecies({ page: 1, itemsPerPage: 100, sortBy: [] })
                if (d.code === 200) {
                    this.coffeeSpecies = d.data.rows;
                }
            } catch (err) {
                console.log('e', err)
            }
        },
        async getCoffeeTypes() {
            try {
                const res = await CoffeeService.getCoffeeTypes();
                if (res.code === 200) {
                    this.coffeeTypes = res.data;
                }
            } catch (err) {
                console.log('Coffee Types FETCH Error', err);
            }
        },
        async getPlantation() {
            try {
                const data = await PlantationService.getPlantationData({ page: 1, itemsPerPage: 100, sortBy: [] }, '', '', this.purchaseOrder.farmerId)
                if (data.code === 200) {
                    this.plantation = data.data.response;
                }
            } catch (err) {
                console.log('e', err)
            }
        },
        async getFarms() {
            try {
                const data = await BuyingStationService.getFarms(this.purchaseOrder.farmerId)
                if (data.code === 200) {
                    this.farms = data.data.info;
                }
            } catch (err) {
                console.log('e', err)
            }
        },
        async getFarmers() {
            try {
                const data = await BuyingStationService.getFarmers();
                console.log('farmers', data);

                if (data.code === 200) {
                    this.farmers = data.data.farmers;
                }
            } catch (err) {
                console.log('e', err)
            }
        },
        async getPurchaseOrder(id) {
            this.startLoading();
            try {
                const data = await BuyingStationService.getPurchaseOrder(id)
                if (data.code === 200) {
                    this.purchaseOrder = data.data
                    this.purchaseOrder.purchasedAt = data.data.purchasedAt ? moment(data.data.purchasedAt).format('DD-MMM-YYYY') : ''
                    
                    // Fetch dependent data based on the farmer ID
                    if (this.purchaseOrder.farmerId) {
                        console.log('Fetching dependent data for farmer ID:', this.purchaseOrder.farmerId);
                        await this.getFarms();
                        await this.getPlantation();
                    }
                    
                    // Fetch coffee variety based on the species ID
                    if (this.purchaseOrder.speciesId) {
                        console.log('Fetching coffee variety for species ID:', this.purchaseOrder.speciesId);
                        await this.getCoffeeVariety();
                    }
                }
            } catch (error) {
                console.log('e', error)
            } finally {
                this.stopLoading();
            }
        },
        async onFarmerSelect() {
            this.startLoading();
            await this.getFarms();
            await this.getPlantation();
            this.stopLoading();
        },
    },
    async mounted() {
        this.startLoading();
        await Promise.all([
           this.getFarmers(),
        //    this.getCoffeeVariety(),
           this.getCoffeeSpecies(),
           this.getCoffeeTypes(),
        ]);
        if (this.purchaseItem) {
            if (this.purchaseItem.id) {
                await this.getPurchaseOrder(this.purchaseItem.id)
            } else {
                this.purchaseOrder.buyingStationId = this.purchaseItem.buyingStationId
                console.log('Setting buyingStationId:', this.purchaseItem.buyingStationId)
                console.log('Purchase Order after setting:', this.purchaseOrder)
            }
        }
        
        // Ensure buyingStationId is always set if not already set
        if (!this.purchaseOrder.buyingStationId && this.purchaseItem && this.purchaseItem.buyingStationId) {
            this.purchaseOrder.buyingStationId = this.purchaseItem.buyingStationId
            console.log('Fallback: Setting buyingStationId:', this.purchaseItem.buyingStationId)
        }
        await this.getFarms()
        this.stopLoading();
    },
    props: ["dialogI", "purchaseItem"],
    watch: {
        purchaseItem: {
            async handler(newVal) {
                if (newVal) {
                    if (newVal.id) {
                        // For editing existing purchase order
                        console.log('Watcher: Editing purchase order with ID:', newVal.id);
                        await this.getPurchaseOrder(newVal.id);
                    } else if (newVal.buyingStationId) {
                        // For creating new purchase order
                        this.purchaseOrder.buyingStationId = newVal.buyingStationId;
                        console.log('Watcher: Setting buyingStationId:', newVal.buyingStationId);
                    }
                }
            },
            immediate: true,
            deep: true
        }
    },
    mixins: [loading],
}
</script>
<style>
.pay-now-section {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.total-section {
    display: flex;
    flex-flow: column;
    margin-left: 25px;
}

.total {
    font-weight: 400;
    font-size: 32px;
    line-height: 38px;
    text-align: right;
    color: #3E3E3E;
    transform: rotate(0.26deg);
}

.total-title {
    font-weight: 400;
    font-size: 18px;
    line-height: 21px;
    text-align: right;
    color: #3E3E3E;
    transform: rotate(0.26deg);
}
</style>