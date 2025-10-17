<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div class="d-flex mb-4">
                <h2>{{ $t("deforestation.shipmentList") }}</h2>
                <v-spacer></v-spacer>
                <v-btn class="primary" @click="createNewShipment">{{ $t('dueDiligence.createShipment') }}</v-btn>
            </div>

            <v-card elevation="0" class="px-5">
                <v-card-text>
                    <v-data-table :headers="tableHeaders" :items="shipments" :items-per-page="10" class="yellow-table"
                        :footer-props="{
                            'items-per-page-options': [10, 25, 50],
                        }" hide-default-footer :loading="loading" :options.sync="options"
                        :server-items-length="totalShipments" :loading-text="$t('deforestation.loading')">
                        <template v-slot:top="{}">
                            <div class="d-flex mt-5">
                                <div class="srch">
                                    <label> {{ $t('dueDiligence.shipmentID') }}</label> &nbsp;
                                    <v-text-field prepend-inner-icon="mdi-magnify" outlined height="5px"
                                        :placeholder="$t('search')" type="text" dense v-model="search"
                                        @input="searchQuery" class="shrink">
                                    </v-text-field>
                                </div>
                                <!-- <v-select :items="countries" item-text="text" item-value="val" dense outlined
                                    v-model="countryModel" style="max-width:175px" class="mr-5"
                                    ></v-select>

                                <v-select :items="allRegions" item-text="text" item-value="val" dense outlined
                                    v-model="regionModel" style="max-width:175px" class="mr-5"
                                   ></v-select>

                                <v-select :items="allFarms" item-text="text" item-value="val" dense outlined
                                    v-model="farmModel" style="max-width:175px" class="mr-5"
                                   ></v-select>

                                <v-select :items="allStatus" item-text="text" item-value="val" dense outlined
                                    v-model="statusModel" style="max-width:175px" class="mr-5"
                                    ></v-select> -->

                                <v-spacer></v-spacer>
                                <div class="py-1 title">
                                    {{ options.page }} - {{ totalShipmentPages }} {{ $t('of') }} {{ totalShipment }}
                                </div>
                                <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page <= 1"
                                    @click="pageChange(false)">
                                    <v-icon dark>
                                        mdi-chevron-left
                                    </v-icon>
                                </v-btn>
                                <v-btn class="mx-2" fab small outlined color="primary"
                                    :disabled="options.page >= totalShipmentPages" @click="pageChange(true)">
                                    <v-icon dark>
                                        mdi-chevron-right
                                    </v-icon>
                                </v-btn>
                                <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" left
                                    :min-width="417">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn class="mx-2" fab small outlined color="primary" v-bind="attrs" v-on="on">
                                            <v-icon dark>mdi-cog-outline </v-icon>
                                        </v-btn>
                                    </template>
                                    <v-card width="417">
                                        <v-list>
                                            <v-list-item>
                                                <v-list-item-content>
                                                    <v-list-item-title>{{ $t("deforestation.customization")
                                                        }}</v-list-item-title>
                                                </v-list-item-content>
                                            </v-list-item>
                                            <v-divider></v-divider>
                                            <div class="pl-3 pt-2 font-weight-normal">
                                                {{ $t("deforestation.recordsPerpage") }}
                                            </div>
                                            <v-list-item>
                                                <v-list-item-content>
                                                    <v-slider v-model="itemsPerPageSlider"
                                                        :tick-labels="itemsPerPageOptions" :max="3" step="1"
                                                        ticks="always" tick-size="4"></v-slider>
                                                </v-list-item-content>
                                            </v-list-item>
                                            <v-divider class="mt-n3"></v-divider>
                                        </v-list>
                                        <v-card-text>
                                            <v-container fluid>
                                                <v-row>
                                                    <v-col class="mt-n9" cols="6" v-for="header in headers"
                                                        :key="header.value">
                                                        <v-checkbox v-if="header.text" v-model="selectedHeaders"
                                                            :label="header.text" color="primary" :value="header.text"
                                                            hide-details :disabled="header.text == 'ID'"></v-checkbox>
                                                    </v-col>
                                                </v-row>
                                            </v-container>
                                        </v-card-text>
                                        <v-layout justify-center>
                                            <v-card-actions class="mb-5">
                                                <v-spacer></v-spacer>

                                                <v-btn outlined color="primary" @click="resetDefaut" width="190">
                                                    {{ $t("deforestation.restoreDefault") }}
                                                </v-btn>
                                                <v-btn color="primary" @click="resetTableStructure" width="190">
                                                    {{ $t("deforestation.apply") }}
                                                </v-btn>
                                            </v-card-actions>
                                        </v-layout>
                                    </v-card>
                                </v-menu>

                                <v-tooltip top color="black" max-width="350">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn class="mx-2" fab small outlined color="primary" v-bind="attrs" v-on="on"
                                            @click="exportToPDF">
                                            <v-icon dark> mdi-download </v-icon>
                                        </v-btn>
                                    </template>

                                    <span>
                                        {{ $t("deforestation.download") }}
                                    </span>
                                </v-tooltip>
                                <v-tooltip top color="black" max-width="350">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn class="mx-2" fab small outlined color="primary" v-bind="attrs" v-on="on"
                                            @click="printPDF('document')">
                                            <v-icon dark> mdi-printer </v-icon>
                                        </v-btn>
                                    </template>
                                    <span>

                                        {{ $t("deforestation.print") }}
                                    </span>
                                </v-tooltip>
                            </div>
                        </template>
                        <template v-if="shipments.length" v-slot:body="{ items }">
                            <tbody>
                                <tr v-for="item in items" :key="item.id"
                                    style="position: relative; width: 0; height: 0">
                                    <td v-if="appliedSelectedHeaders.includes($t('dueDiligence.shipmentID'))"> SH-{{
                                        item.id }} </td>
                                    <td v-if="appliedSelectedHeaders.includes($t('dueDiligence.noOfReports'))"> {{
                                        item.reportCount }} </td>
                                    <td v-if="appliedSelectedHeaders.includes($t('dueDiligence.noOfFarms'))"> {{
                                        item.farmCount }} </td>
                                    <td v-if="appliedSelectedHeaders.includes($t('deforestation.quantity'))"> {{
                                        item.weight }} </td>
                                    <td v-if="appliedSelectedHeaders.includes($t('deforestation.actions'))">
                                        <v-chip v-if="item.status == 'Delivered'" variant="elevated" color="primary"
                                            outlined>
                                            Delivered
                                        </v-chip>
                                        <v-chip v-if="item.status == 'En Route'" variant="elevated" color="yellow"
                                            outlined>
                                            En Route
                                        </v-chip>
                                    </td>
                                    <td class="d-flex justify-center align-center" v-if="appliedSelectedHeaders.includes($t('deforestation.actions'))">
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn x-small fab v-bind="attrs" v-on="on"
                                                    @click="viewShipment(item.id)" color="primary" outlined>
                                                    <v-icon>mdi-eye</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>
                                                {{ $t("deforestation.view") }}
                                            </span>
                                        </v-tooltip>
                                    </td>
                                </tr>
                            </tbody>
                        </template>
                        <template v-slot:footer></template>
                    </v-data-table>


                    <!-- Status Legend Section -->
                    <div class="status-legend-section mt-6 mb-4 pa-4">
                        <div class="legend-title font-weight-bold mr-3">
                        {{ $t("deforestation.statusLegend") }}
                        <v-tooltip top color="00BD73" max-width="350">
                            <template v-slot:activator="{ on, attrs }">
                            <v-icon size="16" class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                mdi-information
                            </v-icon>
                            </template>
                            <span>{{ $t("deforestation.statusLegendInfo") }}</span>
                        </v-tooltip>
                        </div>
                        <div class="legend-item d-inline-flex align-center mr-4 mt-2">
                        <span class="legend-item d-inline-flex align-center mr-4">
                        <img src="/icons/dds/pending.svg" style="width: 20px; height: 20px; margin-right: 5px;" /> {{ $t("deforestation.sentToExporter") }}
                        </span>
                        <span class="legend-item d-inline-flex align-center mr-4">
                            <img src="/icons/dds/approved.svg" style="width: 20px; height: 20px; margin-right: 5px;" /> {{ $t("deforestation.approved") }}
                        </span>
                        <span class="legend-item d-inline-flex align-center mr-4">
                            <img src="/icons/dds/updaterequired.svg" style="width: 20px; height: 20px; margin-right: 5px;" /> {{ $t("deforestation.updateRequired") }}
                        </span>
                        <span class="legend-item d-inline-flex align-center mr-4">
                            <img src="/icons/dds/rejected.svg" style="width: 20px; height: 20px; margin-right: 5px;" /> {{ $t("deforestation.rejected") }}
                        </span>
                        </div>
                    </div>
                </v-card-text>
            </v-card>
        </v-container>
    </div>
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import download from "@/mixins/DownloadMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import DateMixin from '@/mixins/DateMixin';
import DeforestationService from "@/_services/DeforestationService";
import html2pdf from "html2pdf.js";
import printJS from "print-js";
import { currentRoles } from "@/utils";
export default {
    created() {
        this.tableHeaders = this.headers;
        this.selectedHeaders = this.allSelectedHeaders;
        this.appliedSelectedHeaders = this.allSelectedHeaders;
        this.fetchData();
    },
    computed: {
        totalPages() {
            return 1
        },
        getCurrentUser() {
            return this.$store.getters.getUser
        },
    },
    watch: {
        options: {
            async handler() {
                await this.fetchData();
            },
            deep: true,
        },
    },
    data() {
        return {
            shipments: [],
            debounceTimer: null,
            totalShipmentPages: null,
            totalShipment: null,
            loading: false,
            totalShipments: 2,
            tab: 0,
            selectedItem: false,
            options: {
                itemsPerPage: 10,
                page: 1
            },
            search: "",
            validSearch: "",
            from: 0,
            document: "",
            to: 0,
            headers: [
                {
                    text: this.$t('dueDiligence.shipmentID'),
                    align: "start",
                    value: "shipmentID",
                    class: "black--text",
                    sortable: true,
                },
                {
                    text: this.$t('dueDiligence.noOfReports'),
                    align: "start",
                    value: "noOfReport",
                    class: "black--text",
                    sortable: false
                },

                {
                    text: this.$t('dueDiligence.noOfFarms'),
                    align: "start",
                    value: "noOfFarms",
                    class: "black--text",
                    sortable: false
                },
                {
                    text: this.$t("deforestation.quantity"),
                    align: "start",
                    value: "quanitity",
                    class: "black--text",
                    sortable: false,
                },
                {
                    text: this.$t('status'),
                    align: "start",
                    value: "status",
                    class: "black--text",
                    sortable: false,
                },
                {
                    text: this.$t('deforestation.actions'),
                    align: "center",
                    value: "actions",
                    class: "black--text",
                    sortable: false,
                },
            ],
            breadcrumbs: [
                {
                    text: this.$t("dashboard"),
                    disabled: false,
                    exact: true,
                },
                {
                    text: this.$t("deforestation.shipmentList"),
                    disabled: true,
                    href: "breadcrumbs_link_1",
                },
            ],
            customizeMenu: false,
            customizeMenuAll: false,
            itemsPerPageOptions: [5, 10, 25, 50],
            itemsPerPageSlider: 1,
            selectedHeaders: [],
            appliedSelectedHeaders: [],
            tableHeaders: [],
            allSelectedHeaders: [
                this.$t('dueDiligence.shipmentID'),
                this.$t('dueDiligence.noOfReports'),
                this.$t('dueDiligence.noOfFarms'),
                this.$t("deforestation.quantity"),
                this.$t("status"),
                this.$t('deforestation.actions')
            ],
            menu: false,
            shipmentsOrder: 'DESC'
        };
    },
    methods: {
        async exportToPDF() {
            const params = {
                page: this.options.page,
                search: this.search,
                limit: this.options.itemsPerPage
            }
            const querys = new URLSearchParams(params).toString();
            const token = this.$store.state.auth.token
            this.startLoading()
            const url = process.env.VUE_APP_DEFORESTRATION_API_BASE_URL || "http://localhost:4043/api"
            this.downloadSourceFileWithToken(`${url}/shipment/shipment-pdf?${querys}`, "application/pdf", token, "shipments.pdf")
                .then(() => {
                    this.stopLoading()
                }).catch(() => {
                    this.stopLoading()
                })
        },
        async printPDF() {
            const element = document.querySelector(".v-data-table__wrapper");
            let opt = {
                margin: 1,
                filename: "Shipments.pdf",
                image: { type: "jpeg", quality: 0.95 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
            };

            let worker = await html2pdf()
                .set(opt)
                .from(element)
                .toCanvas()
                .outputPdf("blob", "Shipments.pdf");
            let file = new File([worker], "Shipments.pdf", {
                type: "application/pdf",
            });
            var pdfUrl = await URL.createObjectURL(file);
            await printJS({ printable: `${pdfUrl}`, type: "pdf", showModal: true });
        },
        async resetDefaut() {
            this.tableHeaders = this.headers;
            this.selectedHeaders = this.allSelectedHeaders;
            this.appliedSelectedHeaders = this.allSelectedHeaders;
            this.itemsPerPageSlider = 1;
            this.options.itemsPerPage = 10;
            this.menu = false;
            await this.fetchData()
        },
        async resetTableStructure() {
            this.menu = false;
            this.tableHeaders = this.headers.filter((header) =>
                this.selectedHeaders.includes(header.text)
            );
            this.appliedSelectedHeaders = this.selectedHeaders

            this.options.itemsPerPage = this.itemsPerPageOptions[
                this.itemsPerPageSlider
            ];
            await this.fetchData();
            (this.customizeMenu = false), (this.customizeMenuAll = false);
        },
        viewShipment(id) {
            this.$router.push('shipment-detail/' + id)
        },
        createNewShipment() {
            this.$router.push({
                name: "shipmentCreate"
            })
        },
        selectItem(item) {
            this.selectedItem = item;
        },
        searchQuery() {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                const extractedNumber = this.search.match(/\d+/g)?.[0];
                this.validSearch = extractedNumber;
                if (this.validSearch || this.search) {
                    this.options.page = 1;
                    this.fetchData();
                } else {
                    console.warn('Invalid search query');
                }
            }, 500);
        },
        resetSearchOnEmpty() {
            this.search = ''
            this.countryModel = ''
            this.statusModel = ''
            this.regionModelregionModel = ''
            this.options = {
                page: 1,
                limit: 10,
            }
        },
        pageChange(t) {
            if (t) this.options.page = this.options.page + 1;
            else this.options.page = this.options.page - 1;
        },
        async fetchData() {
            const params = {
                page: this.options.page,
                search: this.validSearch,
                limit: this.options.itemsPerPage,
                cfroles: currentRoles()
            }
            if (this.options) {
                params.orderField = this.options.sortBy?.length ? this.options.sortBy[0] : "shipmentID";
                this.shipmentsOrder = this.shipmentsOrder === 'ASC' ? 'DESC' : 'ASC';
                params.order = this.shipmentsOrder;
            }
            this.loading = true
            const res = await DeforestationService.getShipments(params);

            this.shipments = await this.sanitizeShipmentResult(res.data.getShipmentList.rows)

            this.totalShipment = res.data.getShipmentList.count;

            this.totalShipmentPages = Math.ceil(
                this.totalShipment / this.options.itemsPerPage
            );
            this.loading = false;
        },
        async sanitizeShipmentResult(payload) {
            return payload.map(item => {
                return {
                    id: item.id,
                    status: item.status,
                    farmCount: item.shipmentReports.reduce((shipmentTotal, report) => {
                        if (report.dueDeligenceReport && report.dueDeligenceReport.dueDiligenceProductionPlaces) {
                            const count = report.dueDeligenceReport.dueDiligenceProductionPlaces.reduce(
                                (placeAcc, place) => place.removed === false ? placeAcc + 1 : placeAcc, 0);
                            return shipmentTotal + count;
                        }
                        return shipmentTotal;
                    }, 0),
                    reportCount: (item.shipmentReports).length,
                    weight: item.shipmentReports.reduce((a, b) => {
                        return a + parseFloat(b.dueDeligenceReport?.productNetMass || 0)
                    }, 0)
                }
            })
        }
    },
    mixins: [loadingMixin, download, getPermittedActions, DateMixin],
};
</script>
<style lang="scss" scoped>
::v-deep .wdt.v-text-field {
    width: 250px;
}

::v-deep .v-tab:hover {
    background-color: #caf1e2;
    color: $primary_color !important;
}

::v-deep .v-data-table-header span {
    text-transform: uppercase !important;
    color: black;
}

::v-deep .center-content {
    display: flex;
    justify-content: center;
    align-items: center;
}

::v-deep .img-center {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 40%;
}

// ::v-deep .v-data-table-header {
//     background-color: #FFB443 !important;
//     color: #1E1E1E;
// }

// ::v-deep .v-data-table-header span {
//     color: #1E1E1E !important;
// }

.status-legend-inline {
  font-size: 14px;
  flex-wrap: wrap;
}
.legend-label {
  color: #222;
}
.legend-item {
  white-space: nowrap;
  font-size: 14px;
}
.status-legend-section {
  background: #f8f9fa;
  border-radius: 10px;
  flex-wrap: wrap;
  font-size: 14px;
}
.legend-title {
  color: #222;
}
.legend-item {
  white-space: nowrap;
  font-size: 15px;
}
// ::v-deep .v-data-table-header span {
//     color: #1E1E1E !important;
// }

.status-legend-inline {
  font-size: 14px;
  flex-wrap: wrap;
}
.legend-label {
  color: #222;
}
.legend-item {
  white-space: nowrap;
  font-size: 14px;
}
.status-legend-section {
  background: #f8f9fa;
  border-radius: 10px;
  flex-wrap: wrap;
  font-size: 15px;
}
.legend-title {
  color: #222;
}
.legend-item {
  white-space: nowrap;
  font-size: 15px;
}
</style>