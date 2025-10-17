<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div class="d-flex mb-4">
                <h2>{{ title }} {{ $t('memberDataSection.processingBatch') }}</h2>
            </div>
            <v-card elevation="0" class="px-5">
                <v-card-text>

                    <div>
                        <v-data-table :headers="headers" :items="processingBatch" :items-per-page="10" hide-default-footer
                            :loading="loading" :options.sync="options" loading-text="Loading Data...">
                            <template v-slot:top>
                                <div class="d-flex mt-5">
                                    <v-text-field prepend-inner-icon="mdi-magnify" outlined height="5px"
                                        :placeholder="$t('search')" dense v-model="search" @input="resetSearchOnEmpty"
                                        class="shrink pr-5"></v-text-field>

                                    <v-menu v-model="customFilterMenu" :close-on-content-click="false" :nudge-right="40"
                                        transition="scale-transition" offset-y min-width="auto">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field v-model="filterDateCustom" readonly v-bind="attrs" v-on="on"
                                                outlined dense style="width:150px" background-color="white" color="black"
                                                append-inner-icon="mdi-calendar-month"
                                                :placeholder="$t('selectDateRange')"></v-text-field>
                                        </template>
                                        <v-date-picker v-model="filterDateCustom" range no-title>
                                            <v-spacer></v-spacer>
                                            <v-btn text color="primary" @click="customFilter">
                                                {{ $t('confirm') }}
                                            </v-btn>
                                        </v-date-picker>
                                    </v-menu>
                                    <v-spacer></v-spacer>
                                    <v-menu background-color="white" offset-y>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn outlined color="green" v-bind="attrs" v-on="on">
                                                <v-icon class="green--text">mdi-file-move-outline</v-icon>
                                                {{ $t('export') }}
                                                <v-icon class="green--text">mdi-chevron-down</v-icon>
                                            </v-btn>
                                        </template>
                                        <v-list>
                                            <v-list-item @click="downloadCsv">
                                                <v-btn icon dense>CSV</v-btn>
                                            </v-list-item>
                                            <v-list-item @click="download('xlsx')">
                                                <v-btn icon dense>Excel</v-btn>
                                            </v-list-item>
                                            <v-list-item @click="download('pdf')">
                                                <v-btn icon dense>Pdf</v-btn>
                                            </v-list-item>
                                        </v-list>
                                    </v-menu>
                                    <v-spacer></v-spacer>


                                    <div class="py-1 title">{{ from }} {{$t('of')}} {{ totalProcessingBatch }}</div>
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
                            <template v-if="processingBatch" v-slot:body="{ items }">
                                <tbody>
                                    <tr v-for="item in items" :key="item.id" style="position: relative; width: 0; height: 0"
                                        @mouseover="selectItem(item)" @mouseleave="selectItem(item)">
                                        <td>{{ item.batchCode }}</td>
                                        <td>{{ item.startDate }}</td>
                                        <td>{{ item.endDate }}</td>
                                        <td class="text-center">{{ item.totalCoffeeCherryQty }}</td>
                                        <td>{{ (item.processingType && item.processingType.name) || "N/A"}}</td>
                                        <td class="text-center">{{ item.batchRating }}</td>
                                        <div v-if="item.id === selectedItem.id"
                                            style="position: absolute; right: 10px; top: 5px">
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn x-small fab v-bind="attrs" v-on="on" class="ml-2"
                                                        @click="editProcessBatch(item)">
                                                        <v-icon>mdi-pencil</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>{{ $t("edit") }}</span>
                                            </v-tooltip>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn x-small fab v-bind="attrs" v-on="on" class="ml-2"
                                                        @click="deleteProcessBatch(item)">
                                                        <v-icon>mdi-trash-can</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>{{ $t("delete") }}</span>
                                            </v-tooltip>

                                        </div>
                                    </tr>
                                </tbody>
                            </template>
                            <template v-slot:footer></template>
                        </v-data-table>
                    </div>

                </v-card-text>
            </v-card>
        </v-container>
        <ProcessingBatchDialog v-if="showProcessingBatchDialog" :dialogI="showProcessingBatchDialog"
            @updateProcessingBatch="getBuyingStation" @closeProcessingBatchDialog="closeProcessingBatch"
            :batchItem="selectedItem" :purchaseOrders="purchaseOrders" :usedPurchaseOrders="usedPurchaseOrders" />

    </div>
</template>
<script>
import Breadcrumb from "@/components/core/Breadcrumb";
import ProcessingBatchDialog from "./ProcessingBatchDialog.vue";
import BuyingStationService from "@/_services/BuyingStationService";
import loadingMixin from "@/mixins/LoadingMixin";
import DownloadMixin from "@/mixins/DownloadMixin";

export default {
    components: {
        breadcrumb: Breadcrumb,
        ProcessingBatchDialog
    },
    watch: {
        options: {
            handler() {
                this.getBuyingStation();
                this.getPurchaseOrder();
            },
            deep: true
        }
    },
    data() {
        return {
            loading: false,
            showProcessingBatchDialog: false,
            totalProcessingBatch: 0,
            from: 0,
            to: 0,
            totalPages: 1,
            search: '',
            title: '',
            customFilterMenu: false,
            filterDateCustom: [],
            processingBatch: [],
            purchaseOrders: [],
            selectedItem: { id: 0 },
            options: {
                page: 1,
                itemsPerPage: 10
            },
            headers: [
                {
                    text: this.$t('batchCode'),
                    align: 'start',
                    value: 'orderCode',
                },
                {
                    text: this.$t('memberDataSection.startDate'),
                    align: 'start',
                    value: 'purchasedAt',
                },
                {
                    text: this.$t('memberDataSection.endDate'),
                    align: 'start',
                    value: 'firstName',
                },
                {
                    text: this.$t('memberDataSection.totalCoffeeCherry'),
                    align: 'center',
                    value: 'coffeeCherryQty',
                },
                {
                    text: this.$t('memberDataSection.processType'),
                    align: 'start',
                    value: 'coffeeCherryQlty',
                },
                {
                    text: this.$t('batchRating'),
                    align: 'center',
                    value: 'coffeeCherryQlty',
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
                    text: this.$t("memberDataSection.buyingStation"),
                    link: true,
                    exact: true,
                    disabled: false,
                    to: { name: "BuyingStation" },
                },
            ],
        }
    },
    methods: {
        closeProcessingBatch() {
            this.showProcessingBatchDialog = false
        },
        selectItem(item) {
            this.selectedItem = { ...item };
        },

        async getPurchaseOrder() {
            await BuyingStationService.getSingleBuyingStationPurchaseOrder(this.$route.params.id, { page: 1, itemsPerPage: 1000 }, null)
                .then((res) => {
                    this.purchaseOrders = res.data.rows
                })
        },

        async getBuyingStation() {
            this.loading = true
            await BuyingStationService.getSingleBuyingStationProcessingBatch(this.$route.params.id, this.options, this.search)
                .then((res) => {
                    this.title = res.data.buyingStation.fullName
                    this.processingBatch = res.data.rows
                    this.totalProcessingBatch = res.data.totalRows
                    this.totalPages = Math.ceil(this.totalProcessingBatch / this.options.itemsPerPage)
                    this.from = (this.options.page * this.options.itemsPerPage) - (this.options.itemsPerPage - this.processingBatch.length)
                    this.loading = false
                })
                .catch(() => {
                    this.loading = false;
                });

        },
        async customFilter() {
            this.customFilterMenu = false;
            this.options.startDate = this.filterDateCustom[0],
                this.options.endDate = this.filterDateCustom[1]
            await this.getBuyingStation();
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
        editProcessBatch(item) {
            this.selectedItem.id = item.batchCode
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
        async downloadCsv() {
            await BuyingStationService.getSingleBuyingStationProcessingBatchExport(this.$route.params.id, this.options, "csv").then((res) => {
                this.downloadBlobFile(res, "processingBatch.csv");
            })
        },
        async download(type) {
            this.$http.get(`/coffee/buying-station/processing-batch/list/${this.$route.params.id}/${type}`, {
                params: {
                    startDate: this.filterDateCustom[0],
                    endDate: this.filterDateCustom[1]
                },
                responseType: "arraybuffer",
                fileType: "pdf",
            }
            ).then(({ data }) => {
                this.downloadBlobFile(data, `processingBatch.${type}`);
            })
        },
    },
    computed: {
        usedPurchaseOrders() {
            const purchaseOrders = []
            this.processingBatch.map(item => {
                if (item.buyingStationOrder.length > 0) {
                    item.buyingStationOrder.map(j => {
                        purchaseOrders.push(j.orderCode)
                    })
                }
            })
            const uniquePurchaseOrders = [...new Set(purchaseOrders)]
            return uniquePurchaseOrders
        }
    },
    mixins: [loadingMixin, DownloadMixin],
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
</style>