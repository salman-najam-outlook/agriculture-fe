<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div class="d-flex mb-8">
                <h2>{{ $t('regionalRiskAssessment.title') }}</h2>
                <v-spacer></v-spacer>
                <div class="d-flex mt-1">
                    <v-btn color="primary" dark class="mr-2" :to="{ name: 'createRegionalRiskAssessment' }">
                        {{ $t("regionalRiskAssessment.createNewCountryReport") }}
                    </v-btn>
                </div>
            </div>

            <v-card elevation="0" class="px-5 mt-4">
                <div class="pa-4">
                    <v-data-table :headers="tableHeaders" :items="RiskAssessment" :items-per-page="10" :footer-props="{
                    }" hide-default-footer :loading="riskLoading" 
                         :loading-text="$t('loadingData')">
                        <template v-slot:top="{}">
                            <div class="d-flex mt-5">
                                <div class="srch mr-2">
                                    <v-text-field prepend-inner-icon="mdi-magnify" outlined height="5px"
                                        :placeholder="$t('search')" dense v-model="search" @input="searchQuery"
                                        class="shrink">
                                    </v-text-field>
                                </div>
                                <v-spacer></v-spacer>
                                <div class="py-1 title">
                                    {{ fromRiskAssessment }} - {{ toRiskAssessment }} {{ $t('of') }} {{
                                    totalRiskAssessment }}
                                </div>
                                <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page <= 1"
                                    @click="pageChange(false)">
                                    <v-icon dark>
                                        mdi-chevron-left
                                    </v-icon>
                                </v-btn>
                                <v-btn class="mx-2" fab small outlined color="primary"
                                    :disabled="options.page >= totalRiskAssessmentPages" @click="pageChange(true)">
                                    <v-icon dark>
                                        mdi-chevron-right
                                    </v-icon>
                                </v-btn>
                            </div>
                        </template>
                        <template v-if="RiskAssessment.length" v-slot:body="{ items }">
                            <tbody>
                                <tr v-for="item in items" :key="item.id" style="position: relative; width: 0; height: 0"
                                    @mouseover="selectItem(item)" @mouseleave="selectItem(false)">
                                    <template v-for="h in tableHeaders">
                                        <td class="text-truncate" :key="h.value + '_country'"
                                            v-if="h.value == 'country'">
                                            {{ item.country ? item.country : " " }}
                                        </td>
                                        <td class="text-truncate" :key="h.value + '_createdAt'"
                                            v-if="h.value == 'createdAt'">
                                            {{ item.createdAt ? getDateFormat(item.createdAt) : " " }}
                                        </td>
                                        <td :key="h.value + '_actions'" v-else-if="h.value == 'actions'">
                                            <div>
                                                <v-menu location="start">
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-btn icon v-bind="attrs" v-on="on">
                                                            <v-icon>mdi-dots-vertical</v-icon>
                                                        </v-btn>
                                                    </template>
                                                    <v-list>
                                                        <v-list-item @click="editRegionalRisk(item)">
                                                            <v-list-item-title class="cursor-pointer">{{
                                                                $t('regionalRiskAssessment.edit') }}</v-list-item-title>
                                                        </v-list-item>
                                                        <v-list-item @click="duplicateRegionalRisk(item)">
                                                            <v-list-item-title class="cursor-pointer">{{
                                                                $t('regionalRiskAssessment.duplicate')
                                                                }}</v-list-item-title>
                                                        </v-list-item>
                                                        <v-list-item @click="openConfirmDeleteDialog(item)">
                                                            <v-list-item-title class="cursor-pointer">{{
                                                                $t('regionalRiskAssessment.delete')
                                                                }}</v-list-item-title>
                                                        </v-list-item>
                                                    </v-list>
                                                </v-menu>
                                            </div>
                                        </td>
                                    </template>
                                </tr>
                            </tbody>
                        </template>
                        <template v-slot:footer></template>
                    </v-data-table>
                </div>
            </v-card>
        </v-container>
        <confirm-box :title="$t('regionalRiskAssessment.deleteRegionalRisk')" :message="deleteMessage"
            :cancelBtnText="$t('regionalRiskAssessment.cancel')" :confirmBtnText="$t('regionalRiskAssessment.confirm')"
            :confirmData="confirmDeleteData" :dialog="confirmDeleteDialog" @cancel:action="confirmDeleteDialog = false"
            @continue:action="confirmRemoveProduct" />
    </div>
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import dateMixin from "@/mixins/DateMixin";
import downloadMixin from "@/mixins/DownloadMixin";
import ConfirmBox from "@/components/ConfirmBox.vue";
import RegionalRiskService from "@/_services/RegionalRiskAssessmentService";
import moment from 'moment';
export default {
    components: {
        ConfirmBox,
    },
    async mounted() {
        await this.getRegionalRisk()
        this.tableHeaders = this.headers;
        this.selectedHeaders = this.allSelectedHeaders;
    },
    computed: {
       
        filteredHeaders() {
            return this.headers.filter(header => this.selectedHeaders.includes(header.value));
        }
    },
    data() {
        return {
            loading: false,
            selectedHeaders: [],
            tableHeaders: [],
            allSelectedHeaders: [
                this.$t('regionalRiskAssessment.country'),
                this.$t("regionalRiskAssessment.dateCreated"),
                this.$t("regionalRiskAssessment.actions"),
            ],
            menu: false,
            breadcrumbs: [
                {
                    text: this.$t("regionalRiskAssessment.eudrDueDiligence"),
                    disabled: false,
                    exact: true,
                },
                {
                    text: this.$t("regionalRiskAssessment.title"),
                    disabled: true,
                    href: "breadcrumbs_link_1",
                },

            ],
            headers: [
                {
                    text: this.$t("regionalRiskAssessment.country"),
                    align: "start",
                    class: "black--text",
                    value: 'country',
                    width: "50%",
                    sortable: true,
                },
                {
                    text: this.$t("regionalRiskAssessment.dateCreated"),
                    align: "start",
                    value: 'createdAt',
                    class: "black--text",
                    width: "50%",
                    sortable: true,
                },
                {
                    text: this.$t("regionalRiskAssessment.actions"),
                    align: "center",
                    value: "actions",
                    class: "black--text",
                    sortable: false,
                },
            ],
            options: {
                limit: 10,
                page: 1,
            },
            search: [],
            from: 0,
            to: 0,
            payload: {
                searchPhrase: '',
                sortColumn: "createdAt",
                sortOrder: "DESC",
            },
            deleteMessage: "",
            confirmDeleteDialog: false,
            confirmDeleteData: {},
            riskLoading: false,
            RiskAssessment: [],
            totalRiskAssessment: 0,
            totalRiskAssessmentPages: 0,
            fromRiskAssessment: 0,
            toRiskAssessment: 0,
        }
    },

    watch: {

    },
    methods: {
        async getRegionalRisk(opt = null) {
            this.riskLoading = true;
            try {
                const params = {
                    page: this.options.page,
                    limit: this.options.limit,
                    search: this.search,
                };

                if (opt?.sortBy?.length) {
                    params.orderField = opt.sortBy[0];
                    params.order = opt.sortDesc[0] ? 'desc' : 'asc';
                }
                await RegionalRiskService.getAllRegionalRisk(params).then((res) => {
                    this.RiskAssessment = res.data.getAllRegionalRiskAssessments.rows;
                    this.totalRiskAssessment = res.data.getAllRegionalRiskAssessments.totalCount;
                    this.totalRiskAssessmentPages = Math.ceil(this.totalRiskAssessment / this.options.limit);
                    this.fromRiskAssessment = (this.options.page - 1) * this.options.limit + 1;
                    this.toRiskAssessment = this.options.page * this.options.limit;
                    if (this.RiskAssessment.length > 0) {
                        this.toRiskAssessment -= this.options.limit - this.RiskAssessment.length;
                    }
                    else {
                        this.toRiskAssessment -= this.options.limit;
                    }
                    if (this.totalRiskAssessment < 1) {
                        this.toRiskAssessment = 0;
                        this.fromRiskAssessment = 0;
                        this.options.page = 1;
                    }
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
                this.riskLoading = false;
            }

        },
        async searchQuery() {
            clearTimeout(this.debounceTimer)
            this.debounceTimer = setTimeout(() => {
                this.options.page = 1;
                this.getRegionalRisk();
            }, 500)
            this.options.page = 1;
            await this.getAllRegionalRisk();
        },
        pageChange(t) {
            if (t) this.options.page = this.options.page + 1;
            else this.options.page = this.options.page - 1;
            this.getRegionalRisk();
        },
        async editRegionalRisk(item) {
            this.$router.push({ name: 'editRegionalRiskAssessment', params: { id: item.id } });
        },
        async duplicateRegionalRisk(item) {
            this.$router.push({ name: 'duplicateRegionalRiskAssessment', params: { id: item.id } });
        },
        async deleteRegionalRisk(id) {
            try {
                this.startLoading();
                await RegionalRiskService.deleteRegionalRisk(id);
                this.$notify({
                    title: this.$t("regionalRiskAssessment.deleteSuccess"),
                    type: "success",
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
                await this.getRegionalRisk()
                this.stopLoading();
            }
        },
        openConfirmDeleteDialog(id) {
            this.confirmDeleteData = id;
            this.confirmDeleteDialog = true;
            this.deleteMessage = this.$t('regionalRiskAssessment.confirmDelete') + '?';
        },
        confirmRemoveProduct() {
            this.confirmDeleteDialog = false;
            this.deleteRegionalRisk(parseInt(this.confirmDeleteData.id));
        },
        getDateFormat(date) {
          return moment(date).format("DD-MMM-YYYY");
      },
    },
    mixins: [loadingMixin, dateMixin, downloadMixin]
}

</script>