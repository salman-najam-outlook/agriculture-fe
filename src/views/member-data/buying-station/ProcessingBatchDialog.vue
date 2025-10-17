<template>
    <v-container>
        <v-dialog v-model="dialog" width="900" @click:outside="closeModal">
            <v-card rounded="0">
                <v-toolbar color="primary" class="white--text" flat>
                    <v-toolbar-title class="font-weight-bold">{{ $t('memberDataSection.processingBatch')
                    }}</v-toolbar-title>
                    <v-spacer></v-spacer>

                    <v-btn icon class="white--text" @click="closeModal">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-form autocomplete="off" ref="processingBatchForm" @submit.prevent="submitProcessingBatch"
                    v-model="valid">
                    <v-card-text class="black--text">
                        <v-row>
                            <v-col cols="6" class="py-0 px-4">
                                <label>{{ $t('memberDataSection.startDate') }}<span class="red--text">*</span></label>
                                <v-menu v-model="startDateMenu" :close-on-content-click="false" :nudge-right="40"
                                    transition="scale-transition" offset-y min-width="auto">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field v-model="processingBatch.startDate" append-icon="mdi-calendar"
                                            outlined dense readonly v-bind="attrs" v-on="on"
                                            v-on:click:append="startDateMenu = true"
                                            :rules="processingBatchRules.startDate"
                                            :placeholder="$t('memberDataSection.startDate')"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="processingBatch.startDate" :placeholder="$t('memberDataSection.startDate')"
                                        @input="startDateMenu = false"></v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="6" class="py-0 px-4">
                                <label>{{ $t('memberDataSection.endDate') }}<span class="red--text">*</span></label>
                                <v-menu v-model="endDateMenu" :close-on-content-click="false" :nudge-right="40"
                                    transition="scale-transition" offset-y min-width="auto">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field v-model="processingBatch.endDate" append-icon="mdi-calendar"
                                            outlined dense readonly v-bind="attrs" v-on="on"
                                            v-on:click:append="endDateMenu = true" :rules="processingBatchRules.endDate"
                                            :placeholder="$t('memberDataSection.startDate')"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="processingBatch.endDate" :placeholder="$t('memberDataSection.startDate')"
                                        @input="endDateMenu = false"></v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="6" class="py-0 px-4">
                                <label>{{ $t('memberDataSection.purchasingOrder') }}<span class="red--text">*</span></label>
                                <v-select
                                    v-model="processingBatch.buyingStationOrder" multiple
                                    :items="purchaseOrder"
                                    item-value="id" item-text="orderCode" return-object outlined dense
                                    :placeholder="$t('MakeASelection')"
                                    :rules="processingBatchRules.buyingStationOrder"
                                    :disabled="!!(this.batchItem && this.batchItem.id)"
                                >
                                </v-select>
                               <v-simple-table v-if="processingBatch.buyingStationOrder && processingBatch.buyingStationOrder.length !== 0">
                                <template v:slot:default>
                                    <thead>
                                        <tr>
                                            <th class="text-left">{{ $t('farmerLotID') }}</th>
                                            <th class="text-left">{{ $t('weight') }}</th>
                                            <th class="text-left">{{ $t('price') }}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="item in processingBatch.buyingStationOrder" :key="item.id" >
                                            <td>
                                                <div>
                                                    {{ item.farmer ? item.farmer.firstName : item.buyingStation.firstName }} {{ item.farmer ? item.farmer.lastName  : item.buyingStation.lastName}}
                                                </div>
                                            <div>
                                                {{ item.orderCode}}
                                            </div>
                                            </td>
                                            <td>{{ item.coffeeCherryQty }} KG</td>
                                            <td>$ {{ item.grandTotal }}</td>
                                        </tr>
                                    </tbody>
                                </template>
                               </v-simple-table>
                            </v-col>
                            <v-col cols="6" class="py-0 px-4">
                                <div class="d-flex justify-space-between align-end">
                                    <label>{{ $t('memberDataSection.totalCoffeeCherry') }}<span
                                            class="red--text">*</span></label>
                                    <label>KG</label>
                                </div>

                                <v-text-field outlined dense type="number" min="0"
                                    :value="totalCoffeeCherryWeight"
                                    :rules="processingBatchRules.totalCoffeeCherryQty"
                                    :placeholder="$t('typeTotalCoffeeQuantity')">
                                </v-text-field>
                            </v-col>
                            <v-col cols="6" class="py-0 px-4">
                                <div class="d-flex justify-space-between align-end">
                                    <label>{{ $t('memberDataSection.airHumidity') }}</label>
                                    <label>{{ $t('valueInPercent') }}</label>
                                </div>
                                <v-text-field outlined dense type="number" min="0" v-model="processingBatch.humidity"
                                    :placeholder="$t('typeHumidity')">
                                </v-text-field>
                            </v-col>
                            <v-col cols="6" class="py-0 px-4">
                                <div class="d-flex justify-space-between align-end">
                                    <label>{{ $t('memberDataSection.density') }}</label>
                                    <label>KG/cm3</label>
                                </div>
                                <v-text-field outlined dense type="number" min="0" v-model="processingBatch.density"
                                    :placeholder="$t('memberDataSection.pOrder.typeDensity')">
                                </v-text-field>
                            </v-col>
                            <v-col cols="6" class="py-0 px-4">
                                <label>{{ $t('memberDataSection.temperature') }}</label>
                                <v-text-field outlined dense type="number" min="0" v-model="processingBatch.temperature"
                                    :placeholder="$t('memberDataSection.pOrder.typeTemperature')">
                                </v-text-field>
                            </v-col>
                            <v-col cols="6" class="py-0 px-4">
                                <div class="d-flex justify-space-between align-end">
                                    <label>{{ $t('memberDataSection.beanMoistureContent')
                                    }}</label> <label>{{ $t('valueInPercent') }}</label>
                                </div>

                                <v-text-field outlined dense type="number" min="0"
                                    v-model="processingBatch.waterContent" :placeholder="$t('memberDataSection.pOrder.typeWaterContent')">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <label>{{ $t('memberDataSection.processType') }}<span class="red--text">*</span></label>
                                <v-radio-group v-model="processingBatch.processingTypeId" row
                                    :rules="processingBatchRules.processType">
                                    <v-radio :key="index" :label="$t(item.label)" :value="item.id"
                                        v-for="(item, index) in processTypes"></v-radio>
                                </v-radio-group>
                            </v-col>
                            <v-col cols="12">
                                <div class="d-flex justify-space-around">
                                    <v-btn-toggle v-model="processingBatch.batchRating"
                                        active-class="batch-button-primary" color="primary" dense group>
                                        <v-btn depressed class="batch-button" value="A">
                                            A
                                        </v-btn>
                                        <v-btn depressed class="batch-button" value="B">
                                            B
                                        </v-btn>
                                        <v-btn depressed class="batch-button" value="C">
                                            C
                                        </v-btn>
                                        <v-btn depressed class="batch-button" value="D">
                                            D
                                        </v-btn>
                                        <v-btn depressed class="batch-button" value="E">
                                            E
                                        </v-btn>
                                    </v-btn-toggle>

                                </div>
                                <div
                                    style="text-align: center; padding-top: 10px; font-size: 16px; font-weight: 700; color: #3e3e3e; ">
                                    {{ $t('memberDataSection.batchRating') }}
                                </div>
                            </v-col>
                        </v-row>
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
import BuyingStationService from "@/_services/BuyingStationService";
import moment from "moment";

export default {
    data() {
        return {
            valid: true,
            startDateMenu: false,
            endDateMenu: false,
            processingBatch: {},
            purchaseOrder: [],
            processTypes: [
                {
                    id: 1,
                    label: this.$t('honey'),
                    value: "honey"
                },
                {
                    id: 2,
                    label: this.$t('naturalDry'),
                    value: "natural"
                },
                {
                    id: 3,
                    label: this.$t('wine'),
                    value: "wine"
                },
                {
                    id: 4,
                    label: this.$t('SemiWashed'),
                    value: "semiWashed"
                },
                {
                    id: 5,
                    label: this.$t('fullWashed'),
                    value: "fullWashed"
                },
            ],
            processingBatchRules: {
                startDate: [
                    (v) => !!v || this.$t('startDateRequired')
                ],
                endDate: [
                    (v) => !!v || this.$t('endDateRequired')
                ],
                buyingStationOrder: [(v) => v.length !== 0 || this.$t('purchaseOrderRequired')],
                totalCoffeeCherryQty: [(v) => !!v || this.$t('totalCoffeeCherryRequired')],
                processType: [(v) => !!v || this.$t('processTypeRequired')],
            },
            ratingMapping: {
              Platinum: 'A',
              Gold: 'B',
              Silver: 'C',
              Bronze: 'D',
              A: 'A',
              B: 'B',
              C: 'C',
              D: 'D',
              E: 'E',
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
        totalCoffeeCherryWeight () {
            if (this.processingBatch.buyingStationOrder) {
                const qty = this.processingBatch.buyingStationOrder.reduce((prev, next) => {
                    return Number(prev) + Number(next.coffeeCherryQty)
                }, [])
                return qty
            }
            return 0
        }
    },
    methods: {
        closeModal() {
            this.$emit("closeProcessingBatchDialog");
        },
        formateDate(date) {
            return moment(date).format('DD-MMM-YYYY')
        },
        async submitProcessingBatch() {
            if(moment(this.processingBatch.startDate, "YYYY-MM-DD").isAfter(moment(this.processingBatch.endDate, "YYYY-MM-DD"))) {
                this.$notify({
                    title: "End Date can't be before Start Date",
                    type: "error"
                });
                return
            }
            if (!this.$refs.processingBatchForm.validate()) return;
            this.startLoading();
            try {
                let payload = {
                    startDate: this.processingBatch.startDate,
                    endDate: this.processingBatch.endDate,
                    totalCoffeeCherryQty: this.totalCoffeeCherryWeight,
                    humidity: parseFloat(this.processingBatch.humidity),
                    temperature: parseFloat(this.processingBatch.temperature),
                    waterContent: parseFloat(this.processingBatch.waterContent),
                    processingTypeId: this.processingBatch.processingTypeId,
                    batchRating: this.processingBatch.batchRating,
                    purchasingNum: this.processingBatch.buyingStationOrder.map(item => item.id ),
                    density: parseFloat(this.processingBatch.density),
                    buyingStationId: this.processingBatch.buyingStationId
                }
                if (this.processingBatch.id) {
                    payload.batchId = this.processingBatch.id
                    const { data } = await this.$http.put("coffee/buying-station/processing-batch", payload)
                    if (data && data.code === 200) {
                        this.$notify({
                            title: "Process Batch Updated successfully.",
                            type: "success",
                        });
                    }
                } else {
                    const { data } = await this.$http.post("coffee/buying-station/processing-batch", payload)
                    if (data && data.code === 200) {
                        this.$notify({
                            title: "Process Batch Added successfully.",
                            type: "success",
                        });
                    }
                }
                this.$emit('updateProcessingBatch')
                this.closeModal();
            } catch (error) {
                this.$notify({
                    title: "Process Batch Error.",
                    type: "error",
                });
            }
            this.stopLoading();
        },
        async getProcessBatch(id) {
            try {
                const data = await BuyingStationService.getProcessBatch(id)
                if (data.code === 200) {
                    this.processingBatch = data.data
                    this.processingBatch.batchRating = this.ratingMapping[data.data.batchRating]
                    this.processingBatch.startDate = data.data.startDate ? moment(new Date(data.data.startDate)).format('DD-MMM-YYYY') : ''
                    this.processingBatch.endDate = data.data.endDate ? moment(new Date(data.data.endDate)).format('DD-MMM-YYYY') : ''
                }
            } catch (error) {
                console.log('e', error)
            }
        },
        filterPurchaseOrdersByDateRange() {
            if (!this.processingBatch.startDate || !this.processingBatch.endDate) {
                return;
            }
            
            const startDate = moment(this.processingBatch.startDate);
            const endDate = moment(this.processingBatch.endDate);
            
            // Filter purchase orders that fall within the date range
            this.purchaseOrder = this.purchaseOrders.filter(item => {
                if (!item.purchasedAt) return false;
                
                const purchaseDate = moment(item.purchasedAt, 'MM/DD/YYYY');
                return purchaseDate.isBetween(startDate, endDate, 'day', '[]') && 
                       !this.usedPurchaseOrders.includes(item.orderCode);
            });
        }
    },
    mounted() {
        // this.purchaseOrder = this.purchaseOrders
        
        if (this.batchItem) {
            if (this.batchItem.id) {
                this.getProcessBatch(this.batchItem.id)
                this.purchaseOrder = this.purchaseOrders
            } else {
                this.processingBatch.buyingStationId = this.batchItem.buyingStationId

                this.purchaseOrder = this.purchaseOrders.map(item => {
                if (!this.usedPurchaseOrders.includes(item.orderCode)) {
                    return item
                }
                })
                this.purchaseOrder = this.purchaseOrder.filter(item => item)
            }
        }
    },
    watch: {
        batchItem: {
            handler(newVal) {
                if (newVal) {
                    if (newVal.id) {
                        // Editing existing processing batch
                        this.getProcessBatch(newVal.id);
                        this.purchaseOrder = this.purchaseOrders;
                    } else if (newVal.buyingStationId) {
                        // Creating new processing batch
                        this.processingBatch.buyingStationId = parseInt(newVal.buyingStationId);
                        this.purchaseOrder = this.purchaseOrders.map(item => {
                            if (!this.usedPurchaseOrders.includes(item.orderCode)) {
                                return item;
                            }
                        });
                        this.purchaseOrder = this.purchaseOrder.filter(item => item);
                    }
                }
            },
            immediate: true
        },
        'processingBatch.startDate': {
            handler(newVal) {
                if (newVal && this.processingBatch.endDate) {
                    this.filterPurchaseOrdersByDateRange();
                }
            }
        },
        'processingBatch.endDate': {
            handler(newVal) {
                if (newVal && this.processingBatch.startDate) {
                    this.filterPurchaseOrdersByDateRange();
                }
            }
        }
    },
    props: ["dialogI", "batchItem", "purchaseOrders", "usedPurchaseOrders"],
    mixins: [loading],
}
</script>
<style scoped>
.batch-button {
    width: 117.7px !important;
    height: 51.81px !important;
    border-radius: 8px;
}

.batch-button-primary {
    background-color: #0EBF67 !important;
}
.v-btn-toggle--group > .v-btn.v-btn{
    background-color: #787878 !important;
    border-radius: 5px !important;
    color: #ffffff
}
button.batch-button.v-btn.batch-button-primary.v-btn--active.v-btn--has-bg.theme--light.v-size--default{
    background-color: #0EBF67 !important;
}
</style>