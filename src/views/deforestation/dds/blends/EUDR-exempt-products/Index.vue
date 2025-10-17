<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div class="d-flex mb-8">
                <h2>{{ $t('blends.exemptProducts.eudrExemptProducts') }}</h2>
                <v-spacer></v-spacer>
                <div class="d-flex mt-1">
                    <v-btn color="primary" dark class="mr-2" :to="{ name: 'AddEUDRExemptProduct' }">
                        {{ $t("blends.exemptProducts.addEUDRExemptProduct") }}
                    </v-btn>
                </div>
            </div>

            <v-card elevation="0" class="px-5 mt-4">
                <div class="pa-4">
                    <v-data-table :headers="tableHeaders" :items="formattedProducts" :items-per-page="10" :footer-props="{
                        'items-per-page-options': [10, 25, 50],
                    }" hide-default-footer :loading="expemptLoading" :options.sync="options"
                        :server-items-length="totalProducts" :loading-text="$t('loadingData')">
                        <template v-slot:top="{}">
                            <div class="d-flex mt-5">
                                <div class="srch mr-2">
                                    <v-text-field prepend-inner-icon="mdi-magnify" outlined height="5px"
                                        :placeholder="$t('search')" dense v-model="search" @change="searchQuery"
                                        class="shrink">
                                    </v-text-field>
                                </div>
                                <v-spacer></v-spacer>
                                <div class="py-1 title">
                                    {{ from }} - {{ to }} {{ $t('of') }} {{ totalProducts }}
                                </div>
                                <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page <= 1"
                                    @click="pageChange(false)">
                                    <v-icon dark>
                                        mdi-chevron-left
                                    </v-icon>
                                </v-btn>
                                <v-btn class="mx-2" fab small outlined color="primary"
                                    :disabled="to >= totalProducts" @click="pageChange(true)">
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
                                                    <span class="text-truncate" style="max-width:150px">{{ $t("deforestation.restoreDefault") }}</span>
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
                                            <v-img src="/icons/download.svg"></v-img>
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
                        <template v-slot:item.supplier="{ item }">
                            {{ getSupplierFullName(item) }}
                        </template>
                        <template v-slot:item.containerIds="{ item }">
                            {{ item.containerIds.length > 0 ? item.containerIds[0]?.containerId : '' }}
                        </template>
                        <template v-slot:item.product="{ item }">
                            {{ item.productDetail && item.productDetail.name || " " }}
                        </template>
                        <template v-slot:item.productDate="{ item }">
                            {{ item.productDate ? formatDate(item.productDate) : " " }}
                        </template>
                        <template v-slot:item.actions="{ item }">
                            <div>
                                <v-menu location="start">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn icon v-bind="attrs" v-on="on">
                                            <v-icon>mdi-dots-vertical</v-icon>
                                        </v-btn>
                                    </template>
                                    <v-list>
                                        <v-list-item @click="viewDetails(item)">
                                            <v-list-item-title class="cursor-pointer">{{ $t('view')
                                                }}</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item @click="handleAvailablity(item)">
                                            <v-list-item-title
                                                class="cursor-pointer">{{
                                                    item.availability ? $t('blends.exemptProducts.unAvailableForBlends') :
                                                        $t('blends.exemptProducts.availableForBlends')
                                                }}</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item @click="openConfirmDeleteDialog(item)">
                                            <v-list-item-title class="cursor-pointer">{{ $t('remove')
                                                }}</v-list-item-title>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </div>
                        </template>
                        <template v-slot:footer></template>
                    </v-data-table>
                </div>
            </v-card>
        </v-container>
        <confirm-box :title="$t('blends.manageProducts.deleteProduct')"
        :message="deleteMessage" :cancelBtnText="$t('blends.manageProducts.cancel')"
        :confirmBtnText="$t('blends.manageProducts.confirm')" :confirmData="confirmDeleteData"
        :dialog="confirmDeleteDialog" @cancel:action="confirmDeleteDialog = false"
        @continue:action="confirmRemoveProduct" />

    </div>
</template>
<script>
import BlendService from "@/_services/BlendService";
import loadingMixin from "@/mixins/LoadingMixin";
import dateMixin from "@/mixins/DateMixin";
import downloadMixin from "@/mixins/DownloadMixin";
import html2pdf from "html2pdf.js";
import ConfirmBox from "@/components/ConfirmBox.vue";
import UnitService from "@/_services/UnitService";
import { mapGetters } from 'vuex';
import printJS from "print-js";

export default {
    components: {
        ConfirmBox
    },
    async mounted() {
        this.startLoading();
        await this.fetchData();
        this.stopLoading();
        this.tableHeaders = this.headers;
        this.selectedHeaders = this.allSelectedHeaders;
    },
    computed: {
        ...mapGetters("eudrSettings", ["get_EUDR_Settings"]),
        eudrSettings() {
            return this.get_EUDR_Settings;
        },

        formattedProducts() {
        return this.products.map(product => {
            const mass = product.productNetMass 
            const unit = this.eudrSettings.product_mass_unit
            const convertedMass = UnitService.fromBase.weight(unit, mass);

            return {
                ...product,
                productNetMass: convertedMass, 
            };
        });
    },
        getSupplierFullName() {
            return (item) => {
                const firstName = item.supplier ? item.supplier?.firstName : '';
                const lastName = item.supplier ? item.supplier.lastName : '';
                return `${firstName} ${lastName}`.trim();
            };
        },
        filteredHeaders() {
            return this.headers.filter(header => this.selectedHeaders.includes(header.value));
        }
    },
    data() {
        return {
            loading: false,
            customizeMenu: false,
            customizeMenuAll: false,
            itemsPerPageOptions: [5, 10, 25, 50],
            itemsPerPageSlider: 1,
            selectedHeaders: [],
            totalProducts: 0,
            tableHeaders: [],
            allSelectedHeaders: [
                this.$t('blends.exemptProducts.internalRefNumber'),
                this.$t('blends.exemptProducts.supplier'),
                this.$t('blends.exemptProducts.containerID'),
                this.$t("blends.exemptProducts.product"),
                this.$t("blends.exemptProducts.quantity"),
                this.$t("blends.exemptProducts.dateAdded"),
                this.$t("blends.exemptProducts.actions"),
            ],
            menu: false,
            eudrSetting: {
            product_mass_unit: '', 
        },
            breadcrumbs: [
                {
                    text: this.$t("blends.eudrDueDiligence"),
                    disabled: false,
                    exact: true,
                },
                {
                    text: this.$t("blends.exemptProducts.eudrExemptProducts"),
                    disabled: true,
                    href: "breadcrumbs_link_1",
                },
            ],
            headers: [
                {
                    text: this.$t("blends.exemptProducts.internalRefNumber"),
                    align: "start",
                    class: "black--text",
                    value: 'internalReferenceNumber',
                    sortable: false,
                },
                {
                    text: this.$t("blends.exemptProducts.supplier"),
                    align: "start",
                    value: 'supplier',
                    class: "black--text",
                },

                {
                    text: this.$t("blends.exemptProducts.containerID"),
                    align: "start",
                    class: "black--text",
                    value: 'containerIds',
                    sortable: false,
                },
                {
                    text: this.$t("blends.exemptProducts.product"),
                    align: "start",
                    class: "black--text",
                    value: 'product',
                },
                {
                    text: "",
                    align: "start",
                    class: "black--text",
                    value: 'productNetMass',
                },
                {
                    text: this.$t("blends.exemptProducts.dateAdded"),
                    align: "start",
                    class: "black--text",
                    value: 'productDate',
                },
                {
                    text: this.$t("blends.exemptProducts.actions"),
                    align: "center",
                    value: "actions",
                    class: "black--text",
                    sortable: false,
                },
            ],
            products: [],
            options: {
                itemsPerPage: 10,
                page: 1,
            },
            search: null,
            from: 0,
            to: 0,
            payload: {
                searchPhrase: '',
                sortColumn: "createdAt",
                sortOrder: "DESC",
            },
            printConfig: {
                margin: [0.2, 0.2, 0.2, 0.2],
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
            },
            printStyle: {
                border: '1px solid black',
                borderCollapse: 'collapse',
                th: {
                    border: '1px solid black',
                    padding: '8px',
                    textAlign: 'left',
                    backgroundColor: 'teal',
                    color: 'white',
                },
                td: {
                    border: '1px solid black',
                    padding: '8px',
                    textAlign: 'left',
                },
            },
            deleteMessage: "",
            confirmDeleteDialog: false,
            confirmDeleteData: {},
            expemptLoading: true,
        }
    },

    watch: {
    'eudrSetting.product_mass_unit': {
        immediate: true, 
        handler() {
            const unit = this.eudrSettings.product_mass_unit; 
            this.headers = this.headers.map(header => {
                if (header.value === 'productNetMass') {
                    return {
                        ...header,
                        text: `${this.$t("blends.exemptProducts.quantity")} (${unit})`,
                    };
                }
                return header;
            });
        },
    },
},
    methods: {
        async fetchData() {
            this.expemptLoading = true;
            const payload = {
                ...this.payload,
                page: this.options.page,
                limit: this.options.itemsPerPage || 10,
            };
            try {
                const { data } = await BlendService.getExemptProducts(payload);

                if (data?.getExemptProducts) {
                    const result = data.getExemptProducts;
                    this.products = result.rows;
                    this.totalProducts = result.totalCount;
                    this.totalPages = Math.ceil(
                        this.totalProducts / this.options.itemsPerPage
                    );
                    this.from =
                        this.totalProducts > 0
                            ? (this.options.page - 1) * this.options.itemsPerPage + 1
                            : 0;
                    this.to =
                        this.options.page * this.options.itemsPerPage > this.totalProducts
                            ? this.totalProducts
                            : this.options.page * this.options.itemsPerPage;
                }
             
            }
            catch (error) {
                console.error(error);
                this.$notify({
                    title: this.$t("dueDiligence.unExpectedErrorMsg"),
                    type: "error",
                });
            }
            finally {
                this.expemptLoading = false;
            }

        },
        async searchQuery() {
            this.payload.searchPhrase = this.search;
            this.options.page = 1;
            await this.fetchData();
        },
        pageChange(t) {
            if (t) this.options.page = this.options.page + 1;
            else this.options.page = this.options.page - 1;
            this.fetchData();
        },
        async deleteExemptProduct(id) {
            this.loading = true;
            await BlendService.deleteExemptProduct(id);
            await this.fetchData()
            this.loading = false;
        },
        async exportToPDF() {
            const params = {
                page: this.options.page,
                search: this.search,
                limit: this.options.itemsPerPage
            }
            const querys = new URLSearchParams(params).toString();
            const token = this.$store.state.auth.token
            this.startLoading()
            const url = process.env.VUE_APP_DEFORESTRATION_API_BASE_URL || "https://cf-deforestation-dev.dimitra.dev/api"
            this.downloadSourceFileWithToken(`${url}/exempt-products/pdf?${querys}`, "application/pdf", token, "exempt_products.pdf")
                .then(() => {
                    this.stopLoading()
                }).catch(() => {
                    this.stopLoading()
                })
        },
        viewDetails(item) {
            this.$router.push({
                name: 'ViewEUDRExemptProduct',
                params: { id: item.id }
            })
        },

        async handleAvailablity(item) {
            this.startLoading();
            try {
                const res = await BlendService.updateAvailabilityExemptProduct(item.id, !item.availability);
                if (res.errors && res.errors.length > 0) {
                    const error = res.errors[0];
                    const errorMessage = error.message || this.$t("blends.exemptProducts.unExpectedErrorMsg");
                    this.$notify({
                        text: errorMessage,
                        type: "error",
                    });
                    return;
                }
                if (res.data?.updateAvailabilityExemptProduct) {
                    this.$notify({
                        text: this.$t("blends.exemptProducts.availabilityStatusMsg"),
                        type: "success",
                    });
                }
                await this.fetchData();
            }
            catch (error) {
                this.$notify({
                    text: this.$t("blends.exemptProducts.unExpectedErrorMsg"),
                    type: "error",
                });
            }
            finally {
                this.stopLoading();
            }
        },
        async printPDF() {
            const element = document.querySelector(".v-data-table__wrapper");
            let opt = {
                margin: 1,
                filename: "exemptProducts.pdf",
                image: { type: "jpeg", quality: 0.95 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
            };

            try {
                let worker = await html2pdf()
                    .set(opt)
                    .from(element)
                    .toCanvas()
                    .outputPdf("blob", "EUDR-Exempt-Products.pdf");
                let file = new File([worker], "EUDR-Exempt-Products.pdf", {
                    type: "application/pdf",
                });
                var pdfUrl = await URL.createObjectURL(file);
                await printJS({ printable: `${pdfUrl}`, type: "pdf", showModal: true });

                this.showActionsColumn = true; // restore the column;
                this.hideOnPrint = false;
            } catch (error) {
                console.error("Error generating PDF:", error);
            }
        },
        async resetDefaut() {
            this.tableHeaders = this.headers;
            this.selectedHeaders = this.allSelectedHeaders;
            this.menu = false;
            await this.fetchData()
        },
        async resetTableStructure() {
            this.tableHeaders = this.headers.filter((header) =>
                this.selectedHeaders.includes(header.text)
            );
            this.options.itemsPerPage = this.itemsPerPageOptions[
                this.itemsPerPageSlider
            ];
            await this.fetchData();
            (this.customizeMenu = false), (this.customizeMenuAll = false);
        },
        openConfirmDeleteDialog(product) {
            this.confirmDeleteData = product;
            this.confirmDeleteDialog = true;
            this.deleteMessage = this.$t('blends.manageProducts.deleteMessage')+ '?';
        },
        confirmRemoveProduct() {
            this.confirmDeleteDialog = false;
            this.deleteExemptProduct(this.confirmDeleteData.id);
        },
    },
    mixins: [loadingMixin, dateMixin, downloadMixin]
}

</script>