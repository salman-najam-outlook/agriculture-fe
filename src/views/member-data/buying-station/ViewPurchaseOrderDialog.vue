<template>
    <v-container>
        <v-dialog v-model="dialog" width="800" @click:outside="closeModal">
            <v-card rounded="0">
                <v-toolbar color="primary" class="white--text" flat>
                    <v-toolbar-title class="font-weight-bold">{{ $t('memberDataSection.purchaseOrder')
                    }}: {{ purchaseOrder.orderCode }}</v-toolbar-title>
                    <v-spacer></v-spacer>

                    <v-btn icon class="white--text" @click="closeModal">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text class="black--text pt-5">
                    <v-row class="mb-3" v-if="purchaseOrder">
                        <v-col cols="6" class="py-0 px-4 my-4 d-flex flex-column">
                            <label class="font-weight-bold">{{ $t('memberDataSection.purchaseDate') }}<span
                                    class="red--text">*</span></label>
                            <span>{{ purchaseOrder.purchasedAt || '' }}</span>

                        </v-col>
                        <v-col cols="6" class="py-0 px-4 my-4 d-flex flex-column" v-if="purchaseOrder.farmer">
                            <label class="font-weight-bold">{{ $t('memberDataSection.farmer') }}<span
                                    class="red--text">*</span></label>
                            <span>{{ purchaseOrder.farmer.firstName || '' }} {{ purchaseOrder.farmer.lastName || ''
                            }}</span>

                        </v-col>
                        <v-col cols="6" class="py-0 px-4 my-4 d-flex flex-column">
                            <label class="font-weight-bold">{{ $t('memberDataSection.farm') }}<span
                                    class="red--text">*</span></label>
                            <span>{{ purchaseOrder.userFarms.farmName || '' }}</span>
                        </v-col>
                        <v-col cols="6" class="py-0 px-4 my-4 d-flex flex-column">
                            <label class="font-weight-bold">{{ $t('memberDataSection.pricePerKg') }}<span
                                    class="red--text">*</span></label>

                            <span>{{ purchaseOrder.userFarms.perKgPrice || 0 }}</span>
                        </v-col>
                        <v-col cols="6" class="py-0 px-4 my-4 d-flex flex-column">
                            <label class="font-weight-bold">{{ $t('memberDataSection.plantation') }}</label>
                            <span>{{ purchaseOrder.plantationId ? purchaseOrder.plantations.plantation_name : '' }}</span>

                        </v-col>
                        <v-col cols="6" class="py-0 px-4 my-4 d-flex flex-column">
                            <label class="font-weight-bold">{{ $t('memberDataSection.coffeeSpecies') }}<span
                                    class="red--text">*</span></label>
                            <span>{{ purchaseOrder.coffeeSpecies.name || '' }}</span>
                        </v-col>
                        <v-col cols="6" class="py-0 px-4 my-4 d-flex flex-column">
                            <label class="font-weight-bold">{{ $t('memberDataSection.coffeeVariety') }}<span
                                    class="red--text">*</span></label>
                            <span>{{ purchaseOrder.coffeeVariety.name || '' }}</span>
                        </v-col>
                        <v-col cols="6" class="py-0 px-4 my-4 d-flex flex-column">
                            <div class="d-flex justify-space-between align-end">
                                <label class="font-weight-bold">{{ $t('memberDataSection.coffeeCherryQuantity') }}<span
                                        class="red--text">*</span></label>
                            </div>
                            <span>{{ purchaseOrder.coffeeCherryQty || '' }}</span>

                        </v-col>
                        <v-col cols="6" class="py-0 px-4 my-4 d-flex flex-column">
                            <label class="font-weight-bold">{{ $t('memberDataSection.coffeeCherryQuality') }}<span
                                    class="red--text">*</span></label>
                            <span>{{ purchaseOrder.coffeeCherryQlty || '' }}</span>
                        </v-col>
                    </v-row>
                </v-card-text>

            </v-card>
        </v-dialog>
    </v-container>
</template>
<script>
import loading from "@/mixins/LoadingMixin";
import BuyingStationService from "@/_services/BuyingStationService";
import moment from "moment";

export default {
    data() {
        return {
            purchaseOrder: {},
        }
    },
    computed: {
        dialog: {
            get() {
                return this.dialogI;
            },
            set() {
                return this.dialogI;
            },
        },
    },
    methods: {
        getFieldText(item) { return `${item.firstName} ${item.lastName}` },
        closeModal() {
            this.$emit("closepurchaseOrderDialog");
        },
        async getPurchaseOrder(id) {
            try {
                const data = await BuyingStationService.getPurchaseOrder(id)
                if (data.code === 200) {
                    this.purchaseOrder = data.data
                    this.purchaseOrder.purchasedAt = data.data.purchasedAt ? moment(data.data.purchasedAt).format('DD-MMM-YYYY') : ''
                    console.log(data)
                }
            } catch (error) {
                console.log('e', error)
            }
        },

    },
    async mounted() {
        this.startLoading();
        if (this.purchaseItem.id) {
            console.log(this.purchaseItem)
            await this.getPurchaseOrder(this.purchaseItem.orderCode)
        }
        this.stopLoading();
    },
    props: ["dialogI", "purchaseItem"],
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