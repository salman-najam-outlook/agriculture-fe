<template>
    <div class="px-4">
        <breadcrumb :items="breadcrumbs"></breadcrumb>

        <div class="wrapper">
            <v-row>
                <v-col cols="12">
                    <h1>{{ $t("dueDiligence.disputeResolution") }}</h1>
                </v-col>
            </v-row>

            <v-card elevation="0" class="px-5 mt-7">
                <v-card-text>
                    <v-row style="margin-left:-30px; margin-bottom: 20px; margin-top: 15px;">
                        <v-col cols="12">
                            <v-data-table
                                ref="tableWrapper" 
                                :headers="tableHeaders" 
                                :items="disputes" 
                                :items-per-page="10"
                                :footer-props="{
                                    'items-per-page-options': [10, 25, 50],
                                }" 
                                item-key="id" 
                                hide-default-footer 
                                :loading="loading" 
                                :options.sync="options"
                                :loading-text="$t('deforestation.loading')"
                                v-model="selected" 
                                show-select 
                                :server-items-length="totalDisputes"
                            >
                                <template v-slot:top="{ }">
                                    <div class="d-flex mt-5">
                                        <v-text-field style="width: 290px; " prepend-inner-icon="mdi-magnify" outlined
                                            height="5px" :placeholder="$t('search')" dense v-model="search"
                                            @input="filterData" class="shrink">
                                        </v-text-field>

                                        <v-select style="max-width: 260px; " class="mx-2" v-model="disputeStatus"
                                            item-text="text" item-value="val" :items="allStatus"
                                            :label="$t('deforestation.disputeStatus')" @change="filterData" outlined dense>
                                        </v-select>

                                        <v-spacer></v-spacer>
                                        <div class="py-1 title">
                                            {{ options.page }} -
                                            {{ totalDisputePages }} {{ $t('of') }}
                                            {{ totalDispute }}
                                        </div>
                                        <v-btn class="mx-2" fab small outlined color="primary"
                                            :disabled="options.page <= 1" @click="pageChange(false)">
                                            <v-icon dark>
                                                mdi-chevron-left
                                            </v-icon>
                                        </v-btn>
                                        <v-btn class="mx-2" fab small outlined color="primary"
                                            :disabled="options.page >= totalDisputePages"
                                            @click="pageChange(true)">
                                            <v-icon dark>
                                                mdi-chevron-right
                                            </v-icon>
                                        </v-btn>


                                        <!-- <v-btn class="mx-2" fab small outlined color="primary">
                                            <v-icon dark>
                                                mdi-cog-outline
                                            </v-icon>
                                        </v-btn> -->

                                        <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" left
                                            :min-width="417">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn class="mx-2" fab small outlined color="primary" v-bind="attrs"
                                                    v-on="on">
                                                    <v-icon dark> mdi-cog-outline</v-icon>
                                                </v-btn>
                                            </template>
                                            <v-card width="417">
                                                <v-list>
                                                    <v-list-item>
                                                        <v-list-item-content>
                                                            <v-list-item-title>{{
                                                                $t("deforestation.customization")
                                                            }}
                                                            </v-list-item-title>
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
                                                                    :label="header.text" color="primary"
                                                                    :value="header.text" hide-details
                                                                    :disabled="header.text == 'ID'"></v-checkbox>
                                                            </v-col>
                                                        </v-row>
                                                    </v-container>
                                                </v-card-text>
                                                <v-layout justify-center>
                                                    <v-card-actions class="mb-5">
                                                        <v-spacer></v-spacer>

                                                        <v-btn outlined color="primary" @click="resetDefaut"
                                                            width="190">
                                                            {{ $t("deforestation.restoreDefault") }}
                                                        </v-btn>
                                                        <v-btn color="primary" @click="resetTableStructure" width="190">
                                                            {{ $t("deforestation.apply") }}
                                                        </v-btn>
                                                    </v-card-actions>
                                                </v-layout>
                                            </v-card>
                                        </v-menu>

                                        <v-btn class="mx-2" @click="exportToPDF" fab small outlined color="primary">
                                            <v-icon dark>
                                                mdi-tray-arrow-down
                                            </v-icon>
                                        </v-btn>
                                        <v-btn class="mx-2" fab small outlined color="primary" @click="printTable">
                                            <v-icon dark>
                                                mdi-printer-outline
                                            </v-icon>
                                        </v-btn>
                                    </div>
                                </template>

                                <template v-if="disputes.length" v-slot:body="{ items }">
                                    <tbody>
                                        <tr v-for="item in items" :key="item.id"
                                            style="position: relative; width: 0; height: 0">
                                            <td v-if="appliedSelectedHeaders.includes($t('deforestation.disputeId'))">
                                                <v-checkbox v-model="selected" :value="item.id" hide-details
                                                    class="ma-0"></v-checkbox>
                                            </td>
                                            <td v-if="appliedSelectedHeaders.includes($t('deforestation.disputeId'))">
                                                {{ item.id }}
                                            </td>
                                            <td v-if="appliedSelectedHeaders.includes($t('deforestation.disputeReason'))">
                                                <span class="wraptext">
                                                    {{ item.title }}
                                                </span>
                                            </td>
                                            <td v-if="appliedSelectedHeaders.includes($t('deforestation.farmName'))">
                                                <span class="truncate">
                                                    {{ item.production_place.farm.farmName }}
                                                </span>
                                            </td>
                                            <td v-if="appliedSelectedHeaders.includes($t('deforestation.farmLocation'))">
                                                <span class="wraptext">
                                                    {{ item.production_place.farm.address }}
                                                </span>
                                            </td>
                                            <td v-if="appliedSelectedHeaders.includes($t('deforestation.disputeArea'))">
                                                {{ item.geofence.geofenceArea }}
                                            </td>
                                            <td v-if="appliedSelectedHeaders.includes($t('deforestation.dateOfRequest'))">
                                                {{ formatDate(item.createdAt) }}
                                            </td>
                                            <td v-if="appliedSelectedHeaders.includes($t('deforestation.status'))">
                                                <div class="d-flex">
                                                    <v-btn small rounded min-width="200" depressed class="green-button"
                                                        height="34" v-if="item.status == 'OPEN'">
                                                        {{ $t("open") }}
                                                    </v-btn>

                                                <v-btn small rounded min-width="200" depressed class="orange-button"
                                                    height="34" v-if="item.status == 'INFO_REQ'">
                                                    {{ $t("moreInfoRequired") }}
                                                </v-btn>

                                                    <v-btn small rounded min-width="200" depressed class="red-button"
                                                        height="34" v-if="item.status == 'CLOSED'">
                                                        {{ $t("closed") }}
                                                    </v-btn>
                                                </div>
                                            </td>
                                            <td v-if="appliedSelectedHeaders.includes($t('deforestation.actions'))">
                                                <div class="d-flex">
                                                    <v-btn class="mx-2" fab small outlined color="primary"
                                                        @click="openReportPage(item)">
                                                        <v-icon dark>
                                                            mdi-file-document-outline
                                                        </v-icon>
                                                    </v-btn>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </template>
                                <template v-slot:footer></template>
                            </v-data-table>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </div>
    </div>
</template>

<script>
import DateMixin from "@/mixins/DateMixin";
import loadingMixin from "@/mixins/LoadingMixin";
import DeforestationService from "@/_services/DeforestationService";
import download from "@/mixins/DownloadMixin";
import html2pdf from "html2pdf.js";
import printJS from "print-js";

export default {
    created() {
        this.tableHeaders = this.headers;
        this.selectedHeaders = this.allSelectedHeaders;
        this.appliedSelectedHeaders = this.allSelectedHeaders
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
            breadcrumbs: [
                {
                    text: this.$t("dashboard"),
                    disabled: true,
                    to: "/",
                },
                {
                    text: this.$t("dueDiligence.disputeResolution"),
                    disabled: true,
                    to: "breadcrumbs_link_1",
                },
            ],
            options: {
                itemsPerPage: 10,
                page: 1,
                limit: 10
            },
            loading: false,
            search: "",
            from: 0,
            to: 0,
            totalDisputes: 2,
            totalDispute:null,
            totalDisputePages: null,
            itemsPerPageOptions: [5, 10, 25, 50],
            itemsPerPageSlider: 1,
            allStatus: [
                {
                    text: this.$t('all'),
                    val: null
                },
                {
                    text: this.$t('statusItems.open'),
                    val: 'OPEN'
                },
                {
                    text: this.$t('statusItems.closed'),
                    val: 'CLOSED'
                },
                {
                    text: this.$t('statusItems.moreInfoReq'),
                    val: 'INFO_REQ'
                }
            ],
            disputeStatus: null,
            tableHeaders: [],
            appliedSelectedHeaders: [],
            allSelectedHeaders: [
                this.$t("deforestation.disputeId"),
                this.$t("deforestation.disputeReason"),
                this.$t("deforestation.farmName"),
                this.$t("deforestation.farmLocation"),
                this.$t("deforestation.disputeArea"),
                this.$t("deforestation.dateOfRequest"),
                this.$t("deforestation.status"),
                this.$t("deforestation.actions")
            ],
            headers: [
                {
                    text: this.$t("deforestation.disputeId"),
                    align: "start",
                    value: "id",
                    class: "black--text",
                    width: "130px",
                    sortable: true,
                    fixed: true,
                },
                {
                    text: this.$t("deforestation.disputeReason"),
                    align: "start",
                    value: "title",
                    class: "black--text",
                    width: "200px",
                    sortable: true,
                },
                {
                    text: this.$t("deforestation.farmName"),
                    align: "start",
                    width: "150px",
                    value: "production_place.farm.farmName",
                    class: "black--text",
                    sortable: true,
                },
                {
                    text: this.$t("deforestation.farmLocation"),
                    align: "start",
                    value: "production_place.farm.address",
                    class: "black--text",
                    width: "200px",
                    sortable: true,
                },
                {
                    text: this.$t("deforestation.disputeArea"),
                    align: "start",
                    value: "geofence.geofenceArea",
                    width: "140px",
                    class: "black--text",
                    sortable: true,
                },
                {
                    text: this.$t("deforestation.dateOfRequest"),
                    align: "start",
                    value: "createAt",
                    width: "200px",
                    class: "black--text",
                    sortable: true,
                },
                {
                    text: this.$t("deforestation.status"),
                    align: "center",
                    value: "status",
                    width: "200px",
                    class: "black--text",
                    sortable: true,
                },
                {
                    text: this.$t("deforestation.actions"),
                    align: "center",
                    value: "actions",
                    width: "100px",
                    class: "black--text",
                    sortable: false,
                }
            ],
            disputes: [],
            selected: [], // Stores selected items
            menu: false,
            selectedHeaders: [],
        };
    },
    methods: {
        async printTable() {
            const element = document.querySelector(".v-data-table__wrapper");
            let opt = {
                margin: 1,
                filename: "Suppliers.pdf",
                image: { type: "jpeg", quality: 0.95 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: "px", format: [element.clientWidth, element.scrollHeight], orientation: "landscape" },
            };

            let worker = await html2pdf()
                .set(opt)
                .from(element)
                .toCanvas()
                .outputPdf("blob", "Suppliers.pdf");
            let file = new File([worker], "Suppliers.pdf", {
                type: "application/pdf",
            });
            var pdfUrl = await URL.createObjectURL(file);
            await printJS({ printable: `${pdfUrl}`, type: "pdf", showModal: true });

        },
        async fetchData() {
            const params = {
                page: this.options.page,
                limit: this.options.limit,
                searchPhrase: this.search,
                disputeStatus: this.disputeStatus
            };

            this.loading = true;
            try {
                const res = await DeforestationService.findDisputesByQuery(params);
                const results = res.data.findProductionPlaceDisputes;

                if (results.errors && results.errors.length > 0) {
                    this.$notify({
                        title: "Error fetching dispute",
                        text: `${results.errors[0].message} and ${results.errors.length - 1} more...`,
                        type: 'error'
                    });
                    return;
                }

                this.disputes = results.rows;
                this.totalDispute = results.totalCount;
                this.totalDisputePages = Math.ceil(this.totalDispute / this.options.limit);
            } catch (e) {
                this.$notify({
                    title: "Error fetching dispute",
                    text: e,
                    type: 'error'
                });
            } finally {
                this.loading = false;
            }
        },
        async exportToPDF() {
            
            // const disputeIds = this.selected.map(s=> s.productionPlaceId);

            const options = {
                // page: this.options.page,
                // limit: this.options.limit,
                // searchPhrase: this.search,
                // disputeStatus: this.disputeStatus, 
                disputeIds : this.selected || [],
            };

            const querys = new URLSearchParams(options).toString();

            this.downloadSourceFile(`${process.env.VUE_APP_DEFORESTRATION_REPORTING_API_BASE_URL}/production-place/dispute/pdf?${querys}`,"application/zip", "dispute-report.zip")
            .then(() => {
            this.stopLoading();
            })
            .catch((err) => {
            console.log(err);
            this.stopLoading();
            });


            // const token = this.$store.state.auth.token
            // this.startLoading()
            // const url = process.env.VUE_APP_DEFORESTRATION_API_BASE_URL  || "http://localhost:4043/api"
            // this.downloadSourceFileWithToken(`${url}/production-place/dispute-pdf?${querys}`, "application/pdf", token,"dispute-resolution.pdf")
            //     .then(() => {
            //     this.stopLoading()
            //     }).catch(() => {
            //     this.stopLoading()
            // })
        },
        filterData() {
            this.options.page = 1;
            this.fetchData();
        },
        pageChange(t) {
            if (t) this.options.page = this.options.page + 1;
            else this.options.page = this.options.page - 1;
            this.fetchData();
        },
        openReportPage(item) {
            this.$router.push({
                name: 'EudrAssessmentReportDDS',
                params: {
                    reportRequestId: item.deforestationReportRequestId,
                    type: 'assignment',
                }
            });
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
    },
    mixins: [loadingMixin, download, DateMixin]
}
</script>

<style lang="scss" scoped>
.wrapper {
    padding: 0px 12px !important;
}

::v-deep .v-btn__content {
    text-transform: capitalize !important;
}

.wraptext {
    display: inline-block;
    max-width: 300px;
    white-space: wrap;
}

.truncate {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.v-data-table__wrapper {
  overflow: visible !important;
}

// Fix table header alignment
::v-deep .v-data-table thead th {
    white-space: nowrap;
    vertical-align: middle;
    text-align: left;
    padding: 12px 16px;
}

</style>