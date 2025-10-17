<template>
    <div>
        <v-card elevation="0" class="px-5 mt-4" style="padding-top: 30px;">
            <div class="d-flex">
                <div>
                    <v-autocomplete item-text="translatedName" required
                            item-value="name" :items="translatedCountryList"
                            :placeholder="$t('regionalRiskAssessment.selectCountry')" outlined
                            v-model="selectedCountry" dense
                        />
                </div>
                <v-spacer></v-spacer>
                <div class="d-flex mt-1">
                    <v-btn color="primary" dark class="mr-2" @click="openDisregardDialogBox">
                        {{ (!disregardSegmentData[0].enableRiskAssessmentCriteria && !disregardSegmentData[1].enableProtectedAndIndigenousAreas)
                            ? $t("regionalRiskAssessment.addRegionalRiskAssessment") :
                            $t("regionalRiskAssessment.disregard")
                        }} </v-btn>
                </div>
            </div>

             <v-divider class="mb-3"></v-divider>

            <div v-if="enableRiskAssessmentCriteria">
                <div v-for="countryData in RiskAssessment" :key="countryData.country" class="mb-5">
                    <div>
                        <h3 class="mb-5">
                            {{ $t("regionalRiskAssessment.title") }} {{ 'for' }} {{ countryData.country }}
                            <v-tooltip bottom color="00BD73" max-width="500">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                        mdi-alert-circle
                                    </v-icon>
                                </template>
                                <p>
                                    {{ $t("regionalRiskAssessment.titleTT") }}
                                </p>
                            </v-tooltip>
                        </h3>
                    </div>
                   
                    <div>
                        <h3 class="mb-5" style="margin-top:20px ;">
                            {{ $t("regionalRiskAssessment.summary") }}
                            <v-tooltip bottom color="00BD73" max-width="500">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                        mdi-alert-circle
                                    </v-icon>
                                </template>
                                <p>
                                    {{ $t("regionalRiskAssessment.summaryTT") }}
                                </p>
                            </v-tooltip>
                        </h3>
                        <p>
                            {{ $t("regionalRiskAssessment.summaryText").replace("(country)", countryData.country) }}
                        </p>
                    </div>
                    <v-data-table class="custom-data-table mb-6" :headers="countryData.formatedHeaders" :items-per-page="-1"
                        :items="countryData.riskCriteria" hide-default-footer :loading="loading"
                        :loading-text="$t('loadingData')">
                        <template v-slot:item.description="{ item }">
                            <span>{{ item.description }}</span>
                        </template>
                        <template v-slot:item.level="{ item }">
                            <div class="item-box">
    
                                <v-btn small rounded min-width="200" depressed class="gray-button" height="40"
                                    v-if="item.level === 'Unassigned'">
                                    {{ getTranslatedStatus(item.level) }}
                                </v-btn>
                                <v-btn small rounded min-width="200" depressed class="green-button" height="40"
                                    v-if="item.level === 'Standard'">
                                    {{ getTranslatedStatus(item.level) }}
                                </v-btn>
                                <v-btn small rounded min-width="200" depressed class="orange-button" height="40"
                                    v-if="item.level === 'Standard to High'">
                                    {{ getTranslatedStatus(item.level) }}
                                </v-btn>
                                <v-btn small rounded min-width="200" depressed class="red-button" height="40"
                                    v-if="item.level === 'High'">
                                    {{ getTranslatedStatus(item.level) }}
                                </v-btn>
    
                            </div>
                        </template>
                    </v-data-table>
                <template>
                    <div v-if="countryData?.reportDetails && countryData.reportDetails.trim() !== ''">
                        <v-divider class="mt-3"></v-divider>
                            <v-expansion-panels flat>
                                <v-expansion-panel>
                                    <v-expansion-panel-header class="no-border">
                                        <div class="d-flex align-center">
                                            <span class="font-weight-bold mr-2">{{ $t("regionalRiskAssessment.details") }}</span>
                                            <v-tooltip bottom color="00BD73" max-width="500">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-icon class="icon-with-background" style="color:#0EBF67;" v-bind="attrs" v-on="on">
                                                        mdi-alert-circle
                                                    </v-icon>
                                                </template>
                                                <p>
                                                    {{ $t("regionalRiskAssessment.detailsTT") }}
                                                </p>
                                            </v-tooltip>
                                        </div>
                                        </v-expansion-panel-header>
                                        <v-expansion-panel-content class="no-border">
                                        <div v-html="countryData.reportDetails" />
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
                            </v-expansion-panels>
                        <v-divider></v-divider>
                    </div>
                </template>
                </div>
            </div>
        </v-card>
        <DisregardDiaglog v-if="openDisregardDialog" 
        :dialogI="openDisregardDialog" 
        @closeModal="closeModel" 
        :diligenceId="diligenceId"
        :disregardSegmentData="disregardSegmentData"
        @update-enable-criteria="emitEnableCriteria"
        @update-enable-protected="emitEnableProtected"
        />
    </div>
</template>
<script>

import loadingMixin from "@/mixins/LoadingMixin";
import dateMixin from "@/mixins/DateMixin";
import downloadMixin from "@/mixins/DownloadMixin";
import RegionalRiskService from "@/_services/RegionalRiskAssessmentService";
import DisregardDiaglog from "./DisregardSegment.vue";
import {  getAllCountries } from "../../../../../../constants/countries";

export default {
     props: {
      countryOfActivity: {
          required: true
      },
      disregardSegmentData: {
          required: true
      },
      enableRiskAssessmentCriteria: {
          required: true,
          type: Boolean
        },
      diligenceId: {
          required: true
      },
    },
    async mounted() {
        if (this.countryOfActivity && this.countryOfActivity.length > 0) {
            this.selectedCountry = this.countryOfActivity[0];
            this.translatedCountryList = getAllCountries(localStorage.getItem("LANGUAGE"), this.countryOfActivity)
        }
        this.getRegionalRisk();
    },
    components: {
        DisregardDiaglog,
    },
    watch: {
        selectedCountry(newCountry, oldCountry) {
            if (newCountry !== oldCountry) {
                this.getRegionalRisk();
            }
        },
    },
    computed: {
        getStatusColor() {
            return (level) => {
                if (typeof level !== 'string') {
                    return '#E8E8E8';
                }
                switch (level.toLowerCase()) {
                    case 'unassigned':
                        return '#E8E8E8';
                    case 'standard':
                        return '#00BD73';
                    case 'standard to high':
                        return '#9C521B';
                    case 'high':
                        return '#FFB6B6';
                    default:
                        return '#E8E8E8';
                }
            };
        },
        RiskAssessmentLength() {
            return this.RiskAssessment.length > 0;
        },
    },
    data() {
        return {
            translatedCountryList: [],
            loading: false,
            menu: false,
            headers: [
                {
                    text: this.$t("regionalRiskAssessment.riskAssessmentCriteria"),
                    align: "start",
                    class: "black--text",
                    value: 'description',
                    sortable: false,
                    width: "100%",
                },
                {
                    text: this.$t("regionalRiskAssessment.riskLevel"),
                    align: "center",
                    value: 'level',
                    class: "black--text",
                    sortable: false,
                    width: "250px",
                },
            ],
            formatedHeaders: [],
            RiskAssessment: [],
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
            openDisregardDialog: false,
            disregardMessage: "",
            confirmDeleteDialog: false,
            confirmDeleteData: {},
            selectedCountry: null,
        }
    },
    methods: {
        getTranslatedStatus(level) {
            if (typeof level !== 'string') {
                return '-';
            }
            switch (level.toLowerCase()) {
                case 'unassigned':
                    return this.$t('regionalRiskAssessment.unassigned');
                case 'standard':
                    return this.$t('regionalRiskAssessment.standard');
                case 'standard to high':
                    return this.$t('regionalRiskAssessment.standardToHigh');
                case 'high':
                    return this.$t('regionalRiskAssessment.high');
                default:
                    return '-';
            }
        },
        async getRegionalRisk(opt = null) {
            if (this.enableRiskAssessmentCriteria === false || this.enableRiskAssessmentCriteria === undefined) {
                return;
            }
            this.startLoading();
            try {
                const params = {
                    page: this.options.page,
                    limit: this.options.limit,
                    search: this.selectedCountry ? [this.selectedCountry] : [""],
                };

                if (opt?.sortBy?.length) {
                    params.orderField = opt.sortBy[0];
                    params.order = opt.sortDesc[0] ? 'desc' : 'asc';
                }
                await RegionalRiskService.getAllRegionalRisk(params).then((res) => {
                    const rows = res.data.getAllRegionalRiskAssessments.rows;

                    this.RiskAssessment = rows.map((row) => ({
                        country: row.country,
                        reportDetails: row.reportDetails,
                        formatedHeaders: [
                            {
                                text: this.$t("regionalRiskAssessment.riskAssessmentCriteria"),
                                align: "start",
                                value: "description",
                                class: "black--text",
                                sortable: false,
                                width: "100%",
                            },
                            {
                                text: `${row.country} ${this.$t("regionalRiskAssessment.riskLevel")}`,
                                align: "start",
                                value: "level",
                                class: "black--text",
                                sortable: false,
                                width: "250px",
                            },
                        ],
                        riskCriteria: row.riskCriteriaIdWithLevels.map((criteria) => ({
                            description: criteria.description,
                            level: criteria.level,
                        })),
                    }));
                });

            }
            catch (error) {
                console.error(error);
                this.$notify({
                    title: this.$t("dueDiligence.unExpectedErrorMsg"),
                    type: "error",
                });
            }
            finally {
                this.stopLoading();
            }

        },
        openDisregardDialogBox() {
            this.openDisregardDialog = true;
        },
        async closeModel() {
            this.openDisregardDialog = false;
        },
        confirmRemoveProduct() {
            this.confirmDeleteDialog = false;
            this.deleteExemptProduct(this.confirmDeleteData.id);
        },
        emitEnableCriteria(value) {
            this.$emit("update-enable-criteria", value);
        },
        emitEnableProtected(value) {
            this.$emit("update-enable-protected", value);
        },
    },
    mixins: [loadingMixin, dateMixin, downloadMixin]
}

</script>
<style scoped>
.custom-data-table {
    background-color: #F8F8F8 !important;
}

.v-data-table-header {
    background-color: #787878 !important;
}
.v-expansion-panels {
  box-shadow: none;
  border: none;
}

.v-expansion-panel {
  border: none;
  box-shadow: none;
  background-color: transparent;
}

.v-expansion-panel-header {
  border: none;
  padding: 10px 16px;
  background-color: transparent;
}

.v-expansion-panel-content {
  border: none;
  padding: 16px;
  background-color: transparent;
}

.no-border {
  border: none !important;
  box-shadow: none !important;
}
</style>
