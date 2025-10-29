<template>
    <div>
        <v-card elevation="0" class="px-5 mt-4">
            
            <div class="pa-4">
                <h3 class="mb-5">
                    {{ $t("indigenousAndProtectedAreas.title") }}
                    <v-tooltip bottom color="00BD73" max-width="500">
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon class="icon-with-background" style="color:#0EBF67"
                                v-bind="attrs" v-on="on">
                                mdi-alert-circle
                            </v-icon>
                        </template>
                        <p>
                            {{ $t("indigenousAndProtectedAreas.titleTT") }}
                        </p>
                    </v-tooltip>
                </h3>
                {{ $t("indigenousAndProtectedAreas.subTitle") }} {{ selectedCountry }}.
            </div>

            <div class="pa-4">
                <v-data-table :headers="tableHeaders" :items="products" :items-per-page="10" :footer-props="{
                    'items-per-page-options': [10, 25, 50],
                }" hide-default-footer :loading="productionPlaceLoading" :options.sync="options"
                    :server-items-length="totalProducts" :loading-text="$t('loadingData')">
                    <template v-slot:top="{}">
                        <div class="d-flex mt-5">
                            <div class="srch mr-2">
                                <v-text-field prepend-inner-icon="mdi-magnify" outlined height="5px"
                                    :placeholder="$t('search')" dense v-model="search" @change="searchQuery"
                                    class="shrink" v-bind="getTextFieldProps()">
                                </v-text-field>
                            </div>
                            <v-spacer></v-spacer>
                            <div class="py-1 title">
                                {{ from }} - {{ to }} {{ $t('of') }} {{ totalProducts }}
                            </div>
                            <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page <= 1"
                                @click="pageChange(false)" v-bind="getButtonProps()">
                                <v-icon dark>
                                    mdi-chevron-left
                                </v-icon>
                            </v-btn>
                            <v-btn class="mx-2" fab small outlined color="primary"
                                :disabled="to >= totalProducts" @click="pageChange(true)" v-bind="getButtonProps()">
                                <v-icon dark>
                                    mdi-chevron-right
                                </v-icon>                             
                            </v-btn>
                            <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" left
                                :min-width="417">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn class="mx-2" fab small outlined color="primary" v-bind="{...attrs, ...getButtonProps()}" v-on="on">
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

                                            <v-btn outlined color="primary" @click="resetDefaut" width="190" v-bind="getButtonProps()">
                                                <span class="text-truncate" style="max-width:150px">{{ $t("deforestation.restoreDefault") }}</span>
                                            </v-btn>
                                            <v-btn color="primary" @click="resetTableStructure" width="190" v-bind="getButtonProps()">
                                                {{ $t("deforestation.apply") }}
                                            </v-btn>
                                        </v-card-actions>
                                    </v-layout>
                                </v-card>
                            </v-menu>

                            <v-tooltip top color="black" max-width="350">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn class="mx-2" fab small outlined color="primary" v-bind="{...attrs, ...getButtonProps()}" v-on="on"
                                        @click="exportToPDF">
                                        <v-icon dark>mdi-download</v-icon>
                                    </v-btn>
                                </template>

                                <span>
                                    {{ $t("deforestation.download") }}
                                </span>
                            </v-tooltip>
                            <v-tooltip top color="black" max-width="350">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn class="mx-2" fab small outlined color="primary" v-bind="{...attrs, ...getButtonProps()}" v-on="on"
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
                    <template v-slot:item.productionPlaceAndFarmId="{ item }">
                        {{ item?.farm?.farmName }}
                        {{ item?.farmId }}
                    </template>
                    <template v-slot:item.producerName="{ item }">
                        {{ `${item?.farm?.userDdsAssoc?.firstName} ${item?.farm?.userDdsAssoc?.lastName}`.trim() }}
                    </template>
                    
                    <template v-slot:item.addressOfProduction="{ item }">
                        {{ item?.farm?.address }}
                    </template>
                    <template v-slot:item.area="{ item }">
                        {{ item.farm.area ? parseFloat(item.farm.area * 0.404686).toFixed(5) : '' }}
                    </template>
                    <template v-slot:item.protectedAreasAlerts="{ item }">
                        <v-chip
                            outlined
                            :style="checkStatus(item?.dueDiligenceProductionPlacesPyData?.protectedArea || 'NA')"
                            :color="checkStatus(item?.dueDiligenceProductionPlacesPyData?.protectedArea || 'NA').color"
                        >
                            {{ $t(item?.dueDiligenceProductionPlacesPyData?.protectedAreaTrans || 'NA') }}
                        </v-chip>
                    </template>
                    <template v-slot:item.indigenousLand="{ item }">
                        <v-chip
                           outlined
                            :style="checkStatus(item?.dueDiligenceProductionPlacesPyData?.indigenousArea || 'NA')"
                            :color="checkStatus(item?.dueDiligenceProductionPlacesPyData?.protectedArea || 'NA').color"
                        >
                            {{ $t(item?.dueDiligenceProductionPlacesPyData?.indigenousAreaTrans || 'NA') }}
                        </v-chip>
                    </template>

                    <template v-slot:item.actions="{ item }">
                        <div>
                            <v-menu location="start">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn icon v-bind="{...attrs, ...getButtonProps()}" v-on="on">
                                        <v-icon>mdi-dots-vertical</v-icon>
                                    </v-btn>
                                </template>
                                <v-list>
                                    <v-list-item 
                                    v-if="showRiskMitigationList(item)" 
                                    :disabled="isReadonlyMode"
                                    @click="!isReadonlyMode && showRiskMitigationModel(item)">
                                        <v-list-item-title class="cursor-pointer">{{ $t('deforestation.riskMitigation')
                                            }}</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item :disabled="isReadonlyMode" @click="!isReadonlyMode && removeFarm(item.farmId)">
                                        <v-list-item-title class="cursor-pointer">{{ $t('delete')
                                            }}</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </div>
                    </template>
                    <template v-slot:footer></template>
                </v-data-table>
            </div>
            <div class="pa-4">
                <v-btn color="primary" dark class="mr-2" @click="showOneRiskMitigationModel()" v-bind="getButtonProps()">
                    {{ $t("indigenousAndProtectedAreas.attachOneRiskMitigation") }}
                </v-btn>
                <v-btn color="primary" dark class="mr-2" @click="removeAllFarms" v-bind="getButtonProps()">
                    {{ $t("indigenousAndProtectedAreas.removeAllFlaggedFarms") }}
                </v-btn>
                <v-tooltip bottom color="00BD73" max-width="500">
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon class="icon-with-background" style="color:#0EBF67"
                            v-bind="attrs" v-on="on">
                            mdi-alert-circle
                        </v-icon>
                    </template>
                    <p>
                        {{ $t("indigenousAndProtectedAreas.removeAllFlaggedFarmsTT") }}
                    </p>
                </v-tooltip>
            </div>
        </v-card>
        <confirm-box 
        :title="farmConfirmDelete.title"
        :message="farmConfirmDelete.message"
        :cancelBtnText="farmConfirmDelete.cancelBtnText" 
        :confirmBtnText="farmConfirmDelete.confirmBtnText"
        :confirmData="farmConfirmDelete.confirmData" 
        :dialog="farmConfirmDeleteDialog" 
        @cancel:action="farmConfirmDeleteDialog = false"
        @continue:action="confirmRemoveFarm" />
        <MitigationDialog v-if="showMitigtionModal" :dialogU="showMitigtionModal"
        :manualRiskMitigationData="getManualRiskMitigationData" 
        :productionPlaceId="targetedProductionPlaceId" 
        :productionPlaceDetail="targetProductionPlace" 
        @closeBulkUpload="showMitigtionModal = false" 
        @mitigated="callbackMitigation" />
        <OneMitigationDialog v-if="showOneMitigtionModal" :dialogU="showOneMitigtionModal"
        :manualRiskMitigationData="getManualRiskMitigationData" 
        :productionPlaceId="targetedProductionPlaceId" 
        :productionPlaces="showOneMitigtionModalProducts"
        @closeBulkUpload="showOneMitigtionModal = false" 
        @mitigated="callbackMitigation" />
    </div>
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import dateMixin from "@/mixins/DateMixin";
import downloadMixin from "@/mixins/DownloadMixin";
import html2pdf from "html2pdf.js";
import ConfirmBox from "@/components/ConfirmBox.vue";

import printJS from "print-js";
import DeforestationService from "@/_services/DeforestationService";
import ActivityLogService from "@/_services/ActivityLogService";
import MitigationDialog from "./MitigationDialog.vue";
import OneMitigationDialog from "./OneMitigationDialog.vue"
import { mapGetters } from 'vuex';
import moment from "moment";
import tableCustomizationMixin from '@/mixins/tableCustomizationMixin';


export default {
    components: {
        ConfirmBox,
        MitigationDialog,
        OneMitigationDialog
    },
    async mounted() {
        this.startLoading();

        const prefs = this.getTablePrefs('IndigenousProtectedAreasTable');
        if (prefs) {
        this.selectedHeaders = prefs.selectedHeaders;
        this.itemsPerPageSlider = this.itemsPerPageOptions.indexOf(prefs.itemsPerPage);
        } else {
        this.selectedHeaders = this.allSelectedHeaders;
        this.itemsPerPageSlider = 1;
        }

        this.options.itemsPerPage = this.itemsPerPageOptions[this.itemsPerPageSlider];
        this.tableHeaders = this.headers.filter(h => this.selectedHeaders.includes(h.text));

        await this.fetchData();
        this.stopLoading();

        if (this.countryOfActivity && this.countryOfActivity.length > 0) {
        this.selectedCountry = this.countryOfActivity[0];
        }
    },
    computed: {
        ...mapGetters("eudrSettings", ["get_EUDR_Settings"]),
        eudrSettings() {
            return this.get_EUDR_Settings;
        },
        isReadonlyMode() {
            return !!this.readonly;
        },
        filteredHeaders() {
            return this.headers.filter(header => this.selectedHeaders.includes(header.value));
        },

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
            selectedCountry: '',
            allSelectedHeaders: [
                this.$t('indigenousAndProtectedAreas.productionPlaceAndFarmId'),
                this.$t('indigenousAndProtectedAreas.producerName'),
                this.$t('indigenousAndProtectedAreas.addressOfProduction'),
                this.$t("indigenousAndProtectedAreas.area"),
                this.$t("indigenousAndProtectedAreas.interceptsProtectedArea"),
                this.$t("indigenousAndProtectedAreas.interceptsIndigenousArea"),
                this.$t("regionalRiskAssessment.actions"),
            ],
            menu: false,
            headers: [
                {
                    text: this.$t("indigenousAndProtectedAreas.productionPlaceAndFarmId"),
                    align: "start",
                    class: "black--text",
                    value: 'productionPlaceAndFarmId',
                    sortable: false,
                },
                {
                    text: this.$t("indigenousAndProtectedAreas.producerName"),
                    align: "start",
                    value: 'producerName',
                    class: "black--text",
                },
                {
                    text: this.$t("indigenousAndProtectedAreas.addressOfProduction"),
                    align: "start",
                    class: "black--text",
                    value: 'addressOfProduction',
                    sortable: false,
                },
                {
                    text: this.$t("indigenousAndProtectedAreas.area"),
                    align: "start",
                    class: "black--text",
                    value: 'area',
                },
                {
                    text: this.$t("indigenousAndProtectedAreas.interceptsProtectedArea"),
                    align: "start",
                    class: "black--text",
                    value: 'protectedAreasAlerts',
                },
                {
                    text: this.$t("indigenousAndProtectedAreas.interceptsIndigenousArea"),
                    align: "start",
                    class: "black--text",
                    value: 'indigenousLand',
                },
                {
                    text: this.$t("regionalRiskAssessment.actions"),
                    align: "start",
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
            farmConfirmDeleteDialog : false,
            farmConfirmDelete: {
                title: this.$t("confirmDialog.farm.delete.title"),
                message: this.$t("confirmDialog.farm.delete.message"),
                confirmBtnText: this.$t("confirmDialog.farm.delete.confirmBtn"),
                cancelBtnText: this.$t("cancel"),
                confirmData: {},
            },
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
            getManualRiskMitigationData:{
                riskMitigationComment: "",
                riskMitigationFiles: null,
                protectedArea: "",
                indigenousArea: "",

            },
            productionPlaceLoading: true,
            targetProductionPlace: null,
            showMitigtionModal: false,
            showOneMitigtionModal: false,
            showOneMitigtionModalProducts: []
        }
    },
    props: {
        diligenceId: {
            required: true
        },
        countryOfActivity: {
          required: true
      },
      readonly: {
        type: Boolean,
        default: false
      }
    },
    methods: {
        showRiskMitigationModel(item) {
            this.getManualRiskMitigationData = {
                dueDiligenceProductionPlacesPyDataId: item?.dueDiligenceProductionPlacesPyData?.id,
                protectedArea : item?.dueDiligenceProductionPlacesPyData?.protectedArea,
                indigenousArea : item?.dueDiligenceProductionPlacesPyData?.indigenousArea,
                dueDiligenceProductionManuallyMitigated: item?.dueDiligenceProductionPlacesPyData?.dueDiligenceProductionManuallyMitigated
            }
            this.targetedProductionPlaceId = item.diligenceReportProductionPlaceArray[0]?.id;
            this.targetProductionPlace = item;
            this.showMitigtionModal = true;
        },
        async removeFarm(id) {
            this.farmConfirmDelete.confirmData = { id };
            this.farmConfirmDeleteDialog = true;
        },

        checkStatus(status) {
            if(status === 'No invasion of protected areas' || status === 'Manually Mitigated' || status === 'No invasion of indigenous areas' || status.includes('No invasion') || status.includes('Manually Mitigated') ) {
                return {color: 'green'};
            }

            if(['N/A', 'NA'].includes(status)) {
                return {color: 'black'};
            }

            return {color: 'error'};
        },

        showRiskMitigationList (item) {
            return !(
                ['No invasion of protected areas'].includes(item?.dueDiligenceProductionPlacesPyData?.indigenousArea) &&
                ['No invasion of protected areas'].includes(item?.dueDiligenceProductionPlacesPyData?.protectedArea)
            );
        },
        showOneRiskMitigationModel() {
            const filteredData =  this.products.filter((product) => {
                return !(
                    ['No invasion of protected areas', 'Manually Mitigated'].includes(product?.dueDiligenceProductionPlacesPyData?.indigenousArea) &&
                    ['No invasion of protected areas', 'Manually Mitigated'].includes(product?.dueDiligenceProductionPlacesPyData?.protectedArea)
                )
            })
            if(filteredData.length > 0) {
                this.showOneMitigtionModal = true;
                this.showOneMitigtionModalProducts = filteredData
            }
        },

        async removeAllFarms() {
           const filteredData =  this.products.filter((product) => {
                return !(
                    ['No invasion of protected areas', 'Manually Mitigated'].includes(product?.dueDiligenceProductionPlacesPyData?.indigenousArea) &&
                    ['No invasion of protected areas', 'Manually Mitigated'].includes(product?.dueDiligenceProductionPlacesPyData?.protectedArea)
                )
            })
            this.startLoading()
            await Promise.all(
                filteredData.map(
                    async (data) => {
                        await DeforestationService.removeFarmFromProductionPlaceListById({
                            diligenceReportId: this.diligenceId,
                            farmId: data?.farmId,
                        });
                    }
                )
            );
            
            // Log the bulk production places deletion
            try {
                const userId = this.$store.getters.getUser?.id;
                if (userId) {
                    await ActivityLogService.logDDSMultipleProductionPlacesDeleted(
                        this.diligenceId,
                        userId,
                        filteredData.length,
                        'Indigenous and protected areas criteria'
                    );
                }
            } catch (logError) {
                console.error('Error logging bulk production places deletion:', logError);
            }
            
            await this.fetchData();
            this.stopLoading()
        },

        async fetchData() {
            this.productionPlaceLoading = true;

            const payload = {
                ...this.payload,
                page: this.options.page,
                limit: this.options.itemsPerPage || 10,
                diligenceReportId: this.diligenceId,
            };

            try {
                const { data } = await DeforestationService.getProductionPlaces(payload);
                if (data?.productionPlaces) {
                    const result = data?.productionPlaces;
                    const updateAblePythonData = result?.rows.filter((filterRow) => {
                        const deforestationStatusDate = filterRow?.productionPlaceDeforestationInfo?.deforestationStatusDate;
                        const expiryTime = this.eudrSettings?.dynamicExpiryTime || 0;
                        const expiryDate = moment(deforestationStatusDate).add(expiryTime, 'months');
                        const isExpired = moment().isAfter(expiryDate);
                        return filterRow?.dueDiligenceProductionPlacesPyData === null || isExpired;
                    });
                    if (updateAblePythonData.length > 0 && this.eudrSettings?.toggleAutoRenewWhenReportAdded === "auto") {
                        const circularData = updateAblePythonData
                            .filter((rowData) => {
                                return rowData?.farm?.GeoFences?.filter((geoFenceData) => geoFenceData?.geofenceCenterLat != null).length > 0;
                            })
                            .map((rowData) => {
                                return {
                                    productionPlaceId: Number(rowData?.id),
                                    aoiId: Number(rowData?.farmId),
                                    name: rowData?.farm?.farmName,
                                    type: 'circular',
                                    coordinates: rowData?.farm?.GeoFences.map((geoFenceData) => {
                                        return {
                                            latitude: geoFenceData?.geofenceCenterLat,
                                            longitude: geoFenceData?.geofenceCenterLog,
                                        };
                                    }),
                                };
                            });

                        const polygonData = updateAblePythonData
                            .filter((rowData) => {
                                return rowData?.farm?.FarmCoordinates.length > 0;
                            })
                            .map((rowData) => {
                                return {
                                    productionPlaceId: Number(rowData?.id),
                                    aoiId: Number(rowData?.farmId),
                                    name: rowData?.farm?.farmName,
                                    type: 'polygon',
                                    coordinates: rowData?.farm?.FarmCoordinates.map((geoFenceData) => {
                                        return {
                                            latitude: geoFenceData?.lat,
                                            longitude: geoFenceData?.log,
                                        };
                                    }),
                                };
                            });

                        const detectDeforestationBulk = await DeforestationService.detectDeforestationBulk([
                            ...circularData,
                            ...polygonData,
                        ]);
                        const areaData = detectDeforestationBulk?.data?.detectDeforestationBulk;

                        this.products = result?.rows.map((row) => {
                            const [data] = areaData.filter((area) => area?.productionPlaceId == row?.id);
                            if (!data) {
                                return row;
                            }

                            return {
                                ...row,
                                dueDiligenceProductionPlacesPyData: {
                                    indigenousArea: data?.indigenousArea,
                                    indigenousAreaTrans: data?.indigenousArea,
                                    protectedArea: data?.protectedArea,
                                    protectedAreaTrans: data?.protectedArea,
                                },
                            };
                        });
                    } else {
                        this.products = result?.rows;
                    }

                    this.totalProducts = result.totalCount;
                    this.totalPages = Math.ceil(this.totalProducts / this.options.itemsPerPage);
                    this.from = this.totalProducts > 0 ? (this.options.page - 1) * this.options.itemsPerPage + 1 : 0;
                    this.to = this.options.page * this.options.itemsPerPage > this.totalProducts ? this.totalProducts : this.options.page * this.options.itemsPerPage;
                }
            } catch (error) {
                console.error(error);
                this.$notify({
                    title: this.$t("dueDiligence.unExpectedErrorMsg"),
                    type: "error",
                });
            } finally {
                this.productionPlaceLoading = false;
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
        async exportToPDF() {
            const params = {
                page: this.options.page,
                limit: this.options.itemsPerPage,
                diligenceReportId: this.diligenceId,
                searchPhrase:this.search || '',
                isRegionalRiskAssement: true
            }
            const querys = new URLSearchParams(params).toString();
            const token = this.$store.state.auth.token
            this.startLoading()
            const url = process.env.VUE_APP_DEFORESTRATION_API_BASE_URL || "https://cf-deforestation-dev.dimitra.dev/api"
            this.downloadSourceFileWithToken(`${url}/production-place/production-place-without-status-pdf?${querys}`, "application/pdf", token, "production-places.pdf")
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
        async printPDF() {
            const element = document.querySelectorAll(".v-data-table__wrapper")[1];
            let opt = {
                margin: 1,
                filename: "Indigenous.pdf",
                image: { type: "jpeg", quality: 0.95 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
            };

            try {
                let worker = await html2pdf()
                    .set(opt)
                    .from(element)
                    .toCanvas()
                    .outputPdf("blob", "Indigenous.pdf");
                let file = new File([worker], "Indigenous.pdf", {
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
            this.selectedHeaders = this.allSelectedHeaders;
            this.tableHeaders = this.headers;
            this.options.itemsPerPage = 10;
            this.itemsPerPageSlider = 1;

            this.clearTablePrefs('IndigenousProtectedAreasTable');
            await this.fetchData();
        },
        async resetTableStructure() {
            this.menu = false;
            this.customizeMenu = false;

            if (!this.selectedHeaders.length) {
                this.selectedHeaders = this.allSelectedHeaders;
            }

            this.tableHeaders = this.headers.filter(header =>
                this.selectedHeaders.includes(header.text)
            );

            const selectedPerPage = this.itemsPerPageOptions[this.itemsPerPageSlider];
            this.options.itemsPerPage = selectedPerPage;

            this.setTablePrefs('IndigenousProtectedAreasTable', {
                selectedHeaders: this.selectedHeaders,
                itemsPerPage: selectedPerPage
            });

            await this.fetchData();
        },
        async confirmRemoveFarm(action, confirmData) {
            this.startLoading()
            const params = {
                diligenceReportId: this.diligenceId,
                farmId: confirmData.id,
            };
            await DeforestationService.removeFarmFromProductionPlaceListById(params);
            await this.fetchData();
            this.stopLoading()
            this.farmConfirmDeleteDialog = false;
        },
    },
    mixins: [tableCustomizationMixin, loadingMixin, dateMixin, downloadMixin]
}

</script>