<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div class="d-flex mb-4">
                <h2>{{ isNaccuUser ? $t('memberDataSection.societies') : $t('memberDataSection.buyingStation') }}</h2> 
            </div>
            <v-card elevation="0" class="px-5">
                <v-card-text>

                    <div>
                        <v-data-table :headers="dynamicHeaders" :items="buyingStation" :items-per-page="10" hide-default-footer
                            :loading="loading" :options.sync="options" loading-text="Loading Data...">
                            <template v-slot:top>
                                <div class="d-flex mt-5">
                                    <v-text-field prepend-inner-icon="mdi-magnify" outlined height="5px"
                                        :placeholder="$t('search')" dense v-model="search" @input="resetSearchOnEmpty"
                                        class="shrink"></v-text-field>
                                    <v-spacer></v-spacer>
                                    <div class="py-1 title">{{ from }} - {{ to }} {{$t('of')}} {{ totalBuyingStation }}</div>
                                    <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page <= 1"
                                        @click="pageChange(false)">
                                        <v-icon dark>
                                            mdi-chevron-left
                                        </v-icon>
                                    </v-btn>
                                    <v-btn class="mx-2" fab small outlined color="primary"
                                        :disabled="options.page >= totalPages" @click="pageChange(true)">
                                        <v-icon dark>
                                            mdi-chevron-right
                                        </v-icon>
                                    </v-btn>
                                </div>
                            </template>
                            <template #item.firstName="{item}">
                                <span>
                                    <span>{{ `${item.firstName}  ${item.lastName}` }}</span><br/>
                                    <span>{{ item.id_number ? item.id_number : 'N/A' }}</span><br/>
                                   <b>{{ $t('address') }}:</b>  <span>{{ item.address ? item.address : 'N/A' }}</span>
                                </span>
                            </template>
                            <template #item.buyingStationPurchaseOrders="{ item }">
                                <div v-if="item.buyingStationPurchaseOrders.length !== 0">
                                    <v-text-field prepend-inner-icon="mdi-magnify" outlined height="5px"
                                        :placeholder="$t('search')" dense
                                        @change="buyingStationPurchaseOrderSearchInput($event, item)"
                                        class="shrink mt-5"></v-text-field>
                                    <div class="list">
                                        <div v-for="purchaseOrder in item.buyingStationPurchaseOrders"
                                            :key="purchaseOrder.id" class="list-items">
                                            <div>{{ $t('lotNo') }}:{{ purchaseOrder.orderCode }}</div>
                                            <div class="d-flex">
                                                <v-btn x-small fab class="ml-2"
                                                    @click="editPurchaseOrder(purchaseOrder)">
                                                    <v-icon x-small>mdi-pencil</v-icon>
                                                </v-btn>
                                                <v-btn x-small fab class="ml-2"
                                                    @click="deletePurchaseOrder(purchaseOrder)">
                                                    <v-icon x-small>mdi-delete</v-icon>
                                                </v-btn>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex justify-space-between">
                                    <div class="my-5 add-new" @click="addPurchaseOrder(item)">
                                        <v-icon class="dynamic-icon-color">mdi-plus-circle</v-icon>
                                        {{ $t('addNewS') }}
                                    </div>
                                    <div class="my-5 add-new" @click="viewPurchaseOrder(item.id)">
                                        <v-icon class="dynamic-icon-color">mdi-eye-circle</v-icon>
                                        {{ $t('viewAll') }}
                                    </div>
                                </div>

                            </template>
                            <template #item.buyingStationProcessingBatches="{ item }">
                                <div v-if="item.buyingStationProcessingBatches.length !== 0">
                                    <v-text-field prepend-inner-icon="mdi-magnify" outlined height="5px"
                                        :placeholder="$t('search')" dense
                                        @change="buyingStationProcessingBatcheSearchInput($event, item)"
                                        class="shrink mt-5"></v-text-field>
                                    <div class="list">
                                        <div v-for="batchCode in item.buyingStationProcessingBatches" :key="batchCode.id"
                                            class="list-items">
                                            <div>{{ $t('lotNo') }}:{{ batchCode.batchCode }}</div>
                                            <div v-show="batchCode.parchmentOut"> {{ $t('parchmentOut') }}: {{ batchCode.parchmentOut }} kg</div>
                                            <div class="d-flex">
                                                <v-btn rounded color="primary" dark
                                                    @click="processingDoneDialogOpen(batchCode)"
                                                    v-if="isProcessingDone(batchCode.parchmentOut, batchCode.startDate, batchCode.endDate)">
                                                    {{ $t('processingDone') }}
                                                </v-btn>
                                                <v-btn x-small fab class="ml-2"
                                                    @click="editProcessBatch(batchCode, item.buyingStationPurchaseOrders)">
                                                    <v-icon x-small>mdi-pencil</v-icon>
                                                </v-btn>
                                                <v-btn x-small fab class="ml-2" @click="deleteProcessBatch(batchCode)">
                                                    <v-icon x-small>mdi-delete</v-icon>
                                                </v-btn>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex justify-space-between">
                                    <div class="my-5 add-new" @click="addProcessBatch(item)">
                                    <v-icon class="dynamic-icon-color">mdi-plus-circle</v-icon>
                                    {{ $t('addNewS') }}
                                </div> 
                                <div class="my-5 add-new" @click="viewProcessBatch(item.id)">
                                        <v-icon class="dynamic-icon-color">mdi-eye-circle</v-icon>
                                        {{ $t('viewAll') }}
                                    </div>
                                </div>

                            </template>
                            <template v-slot:footer></template>
                        </v-data-table>
                    </div>

                </v-card-text>
            </v-card>
        </v-container>
        <ProcessingBatchDialog v-if="showProcessingBatchDialog" :dialogI="showProcessingBatchDialog"
            @updateProcessingBatch="getBuyingStation" @closeProcessingBatchDialog="closeProcessingBatch"
            :batchItem="processingBatchDialogItem" :purchaseOrders="purchaseOrders"
            :usedPurchaseOrders="usedPurchaseOrders" />
        <PurchaseOrderDialog v-if="showPurchaseOrderDialog" :dialogI="showPurchaseOrderDialog"
            @updatePurchaseOrder="getBuyingStation" @closepurchaseOrderDialog="closePurchaseOrder"
            :purchaseItem="purchaseOrderDialogItem" />

        <v-dialog v-model="processingDoneDialog" width="800" @click:outside="processingDoneDialog = false">
            <v-card rounded="0">
                <v-toolbar color="primary" class="white--text" flat>
                    <v-toolbar-title class="font-weight-bold">{{ $t('memberDataSection.processingDone')
                    }}</v-toolbar-title>
                    <v-spacer></v-spacer>

                    <v-btn icon class="white--text" @click="processingDoneDialog = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>

                <v-card-text class="black--text mt-8">
                    <v-form autocomplete="off" ref="processedCoffeeOutForm" @submit.prevent="updateParchmentOut">
                        <v-row>
                            <v-col cols="6" class="py-0 px-4">
                                <label>{{ $t('memberDataSection.processedCoffeeOut') }} <span
                                        class="float-right">KG</span></label>
                                <v-text-field outlined dense type="number" v-model="processedCoffeeOut"
                                    placeholder="Type quantity" :rules="processedCoffeeOutRule">
                                </v-text-field>
                            </v-col>
                        </v-row>

                        <v-card-actions class="mt-10">
                            <v-spacer></v-spacer>
                            <v-btn class="" outlined color="primary" @click="processingDoneDialog = false" width="112">
                                {{ $t('cancel') }}
                            </v-btn>
                            <v-btn width="112" color="primary" type="submit" class="btn-11 btn-22">
                                {{ $t('submit') }}
                            </v-btn>
                        </v-card-actions>
                    </v-form>
                </v-card-text>

            </v-card>
        </v-dialog>

    </div>
</template>
<script>
import Breadcrumb from "@/components/core/Breadcrumb";
import ProcessingBatchDialog from "./ProcessingBatchDialog.vue";
import PurchaseOrderDialog from "./PurchaseOrderDialog.vue";
import BuyingStationService from "@/_services/BuyingStationService";
import loadingMixin from "@/mixins/LoadingMixin";
import moment from "moment";
import axios from "axios";
import { isKenyaClient } from "@/utils";

export default {
    components: {
        breadcrumb: Breadcrumb,
        ProcessingBatchDialog,
        PurchaseOrderDialog,
    },
    watch: {
        options: {
            handler() {
                this.getBuyingStation();
            },
            deep: true
        }
    },
    data() {
        return {
            loading: false,
            showProcessingBatchDialog: false,
            showPurchaseOrderDialog: false,
            totalBuyingStation: 0,
            from: 0,
            to: 0,
            totalPages: 1,
            search: '',
            buyingStation: [],
            options: {
                itemsPerPage: 10
            },
            processingBatchDialogItem: {},
            purchaseOrderDialogItem: {},
            purchaseOrders: [],
            headers: [
                {
                    text: this.$t('stationInfo'),
                    align: 'start',
                    value: 'firstName',
                },
                {
                    text: this.$t('purchaseOrders'),
                    align: 'start',
                    value: 'buyingStationPurchaseOrders',
                    sortable: false
                },
                {
                    text: this.$t('processingBatch'),
                    align: 'start',
                    value: 'buyingStationProcessingBatches',
                    sortable: false
                },
            ],
            breadcrumbs: [
                {
                    text: this.$t("dashboard"),
                    disabled: false,
                    to: "/",
                },
                {
                    text: this.$t("dashboardSection.memberData"),
                    disabled: false,
                    to: "/",
                },
                {
                    text: this.isNaccuUser ? this.$t("memberDataSection.societies") : this.$t("memberDataSection.buyingStation"),
                    link: true,
                    exact: true,
                    disabled: true,
                    to: { name: "BuyingStation" },
                },
            ],
            processingDoneDialog: false,
            processedCoffeeOut: '',
            selectedProcessingBatch: [],
            processedCoffeeOutRule: [(v) => !!v || this.$t('processedCoffeeOutRequired'), (v) => v <= this.selectedProcessingBatch.totalCoffeeCherryQty || 'Processed Coffee Out value cannot be greater than total coffee quantity.']
        }
    },
    methods: {
        closePurchaseOrder() {
            this.showPurchaseOrderDialog = false
            this.purchaseOrderDialogItem = {}
        },
        closeProcessingBatch() {
            this.showProcessingBatchDialog = false
            this.processingBatchDialogItem = {}
            this.purchaseOrders = []
        },
        async getBuyingStation() {
            this.loading = true
            await BuyingStationService.getBuyingStationData(this.options, this.search)
                .then((res) => {
                    this.buyingStation = res.data.rows
                    this.totalBuyingStation = res.data.totalRows
                    this.totalPages = Math.ceil(this.totalBuyingStation/this.options.itemsPerPage)
                    this.from = (((this.options.page-1)*this.options.itemsPerPage)+1)
                    this.to = (this.options.page*this.options.itemsPerPage)-(this.options.itemsPerPage-this.buyingStation.length)
                    this.loading = false
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        async buyingStationPurchaseOrderSearchInput(e, item) {
            await this.getBuyingStation()
            const keyword = e.toLowerCase()
            const _data = this.buyingStation
            let data = _data.find(x => x.id === item.id)
            const filteredData = data.buyingStationPurchaseOrders.filter(x => x.orderCode.toLowerCase().includes(keyword))
            data.buyingStationPurchaseOrders = filteredData
        },
        async buyingStationProcessingBatcheSearchInput(e, item) {
            await this.getBuyingStation()
            const keyword = e.toLowerCase()
            const _data = this.buyingStation
            let data = _data.find(x => x.id === item.id)
            const filteredData = data.buyingStationProcessingBatches.filter(x => x.orderCode.toLowerCase().includes(keyword))
            data.buyingStationProcessingBatches = filteredData

        },
        resetSearchOnEmpty() {
            this.options.page = 1;
            this.getBuyingStation();
        },
        pageChange(t) {
            if (t) {
                this.options.page = this.options.page + 1;
            }
            else {
                this.options.page = this.options.page - 1;
            }
            this.getBuyingStation();
        },
        addPurchaseOrder(item) {
            this.purchaseOrderDialogItem.buyingStationId = item.id
            this.showPurchaseOrderDialog = true
        },
        editPurchaseOrder(item) {
            this.purchaseOrderDialogItem.id = item.orderCode
            this.showPurchaseOrderDialog = true
        },
        async deletePurchaseOrder(item) {
            await BuyingStationService.deletePurchaseOrder(item.id)
                .then(() => {
                    this.$notify({
                        title: "Purchase Order Deleted successfully.",
                        type: "success",
                    });
                    this.getBuyingStation()
                })
                .catch((err) => {
                    console.log(err)
                    this.$notify({
                        title: "Purchase Order Delete Failed.",
                        type: "error",
                    });
                });
        },
        viewPurchaseOrder(id) {
            this.$router.push({ name: "PurchaseOrderList", params: {id: id } })
        },
        viewProcessBatch(id) {
            this.$router.push({ name: "ProcessingBatchList", params: {id: id } })
        },
        addProcessBatch(item) {
            this.processingBatchDialogItem.buyingStationId = item.id
            this.purchaseOrders = item.buyingStationPurchaseOrders
            this.showProcessingBatchDialog = true
        },
        editProcessBatch(item, orders) {
            this.processingBatchDialogItem.id = item.batchCode
            this.purchaseOrders = orders
            this.showProcessingBatchDialog = true
        },
        async deleteProcessBatch(item) {
            await BuyingStationService.deleteProcessBatch(item.id)
                .then(() => {
                    this.$notify({
                        title: "Processing Batch Deleted successfully.",
                        type: "success",
                    });
                    this.getBuyingStation()
                })
                .catch((err) => {
                    console.log(err)
                    this.$notify({
                        title: "Processing Batch Delete Failed.",
                        type: "error",
                    });
                });
        },
        isProcessingDone(parchmentOut, startDate, endDate) {
            // console.log(batchCode, startDate, endDate)
            if (parchmentOut != null) {
                return false
            }
            const now = new Date();
            const today = moment(now).format('MM/DD/YYYY');
          
            if (moment(today).isAfter(startDate)
                && moment(today).isAfter(endDate)) {
                return true
            }
            return false
        },
        processingDoneDialogOpen(item) {
            this.processingDoneDialog = true
            this.selectedProcessingBatch = item
            this.processedCoffeeOut = ''
        },
        async updateParchmentOut() {
            if (!this.$refs.processedCoffeeOutForm.validate()) return;
            const res = await axios.put(`/coffee/buying-station/processing-batch/${this.selectedProcessingBatch.id}`, {
                parchmentOut: this.processedCoffeeOut
            })
            // console.log(res)
            if (res.data.success) {
                this.$notify({
                    title: "Processed Coffee Out updated successfully.",
                    type: "success",
                });
                this.processingDoneDialog = false
                this.selectedProcessingBatch = []
                this.getBuyingStation()
            } else {
                this.$notify({
                    title: "Processed Coffee Out not updated successfully.",
                    type: "error",
                });
            }
        }
    },
    computed: {
        isNaccuUser() {
            return isKenyaClient();
        },
        dynamicHeaders() {
            return [
                {
                    text: this.isNaccuUser ? this.$t('memberDataSection.societyInfo') : this.$t('stationInfo'),
                    align: 'start',
                    value: 'firstName',
                },
                {
                    text: this.$t('purchaseOrders'),
                    align: 'start',
                    value: 'buyingStationPurchaseOrders',
                    sortable: false
                },
                {
                    text: this.$t('processingBatch'),
                    align: 'start',
                    value: 'buyingStationProcessingBatches',
                    sortable: false
                },
            ];
        },
        usedPurchaseOrders() {
            const purchaseOrders = []
            this.buyingStation.map(item => {
                if (item.buyingStationProcessingBatches.length > 0) {
                    item.buyingStationProcessingBatches.map(i => {
                        if (i.buyingStationOrder.length > 0) {
                            i.buyingStationOrder.map(j => {
                                purchaseOrders.push(j.orderCode)
                            })
                        }
                    })
                }
            })
            const uniquePurchaseOrders = [...new Set(purchaseOrders)]
            return uniquePurchaseOrders
        }
    },
    mixins: [loadingMixin],
}
</script>
<style>
.list {
    max-height: 150px;
    min-height: 150px;
    overflow: auto;
}

.list-items {
    display: flex;
    align-content: center;
    align-items: center;
    margin: 10px;
    justify-content: space-between;
}

.add-new {
    cursor: pointer;
}

.theme--dark.v-btn.v-btn--disabled.v-btn--has-bg {
    background-color: #4CAF4F !important;
    color: #ffffff !important;
}

.v-messages__message {
    hyphens: none !important;
}

/* Dynamic icon colors for rebranding */
.dynamic-icon-color {
    color: var(--primary-color, #00BD73) !important;
}

/* Indonesian client specific icon color */
[data-theme="indonesian"] .dynamic-icon-color {
    color: #184980 !important;
}

/* Kenya client specific icon color */
[data-theme="kenya"] .dynamic-icon-color {
    color: #A75300 !important;
}

/* Default client icon color */
.dynamic-icon-color {
    color: var(--primary-color, #00BD73) !important;
}
</style>