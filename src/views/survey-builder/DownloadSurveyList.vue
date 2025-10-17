<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div class="d-flex mb-4">
                <h2>Survey Downloads</h2>
                <v-spacer></v-spacer>
                <v-btn color="primary"  @click="$router.push({name:'SurveyBuilder'})"  dark class="mr-3" outlined>
                    {{ $t("activationKey.back") }}
                </v-btn>
            </div>

            <v-card v-if="!errorCode || mixingIsLoading" elevation="0" class="px-5">
                <v-card-text>
                    <div v-if="!surveyDownloads" class="text-center" style="padding-top:5%">
                        <v-row align="center" justify="center">
                            <v-col>
                                <v-img max-height="190" max-width="190" src="/icons/nodata.svg"
                                    class="img-center"></v-img>
                                <h5 class="mt-4 red--text">{{ $t("activationKey.noData") }}</h5>
                                <p class="text-caption black--text">
                                    {{ $t("activationKey.noActKey") }}.<br />
                                    {{ $t("activationKey.pleaseGenActKeyss") }} <br />
                                    {{ $t("activationKey.usingActKeys") }} <br />
                                    {{ $t("activationKey.buttonAbv") }}.
                                </p>
                            </v-col>
                        </v-row>
                    </div>

                    <div v-if="surveyDownloads">
                        <v-data-table :headers="headers" :items="surveyDownloads" :items-per-page="10" :footer-props="{
            'items-per-page-options': [10, 25, 50],
        }" hide-default-footer :loading="loading" :options.sync="options"
                            :server-items-length="totalSurveyDownloads" loading-text="Loading download's survey...">
                            <template v-slot:top="{ }">
                                <div class="d-flex mt-5">
                                    <!-- <v-text-field prepend-inner-icon="mdi-magnify" outlined height="5px"
                                        :placeholder="$t('search')" dense v-model="search" @input="resetSearchOnEmpty"
                                        class="shrink"></v-text-field> -->
                                    <v-spacer></v-spacer> 
                                    <v-btn @click="getSurveyDownloadHistory">
                                        <v-icon size="20" color="primary">mdi-refresh</v-icon>
                                    </v-btn>
                                    <div class="ml-4 py-1 title mb-4">
                                        {{ from }} - {{ to }} {{ $t('of') }} {{ totalSurveyDownloads }}
                                    </div>
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
                            <template v-if="surveyDownloads.length" v-slot:body="{ items }">
                                <tbody>
                                    <tr v-for="item in items" :key="item.id" 
                                        style="position: relative; width: 0; height: 0" @mouseover="selectItem(item)"
                                        @mouseleave="selectItem(false)">
                                        <td width="20%"> {{ item.fileName }} </td>
                                        <td width="20%" class="text-truncate">
                                            <v-chip v-if="item.status =='started'" color="primary">
                                                Started 
                                            </v-chip>
                                            <v-chip v-else-if="item.status == 'fail'" color="red">
                                                Failed 
                                            </v-chip>
                                            <v-chip v-else-if="item.status == 'done'" color="themeGrey">
                                                Done 
                                            </v-chip>
                                            <v-chip v-else color="green2">
                                                Success 
                                            </v-chip>
                                        </td>
                                        <td class="text-truncate">
                                            {{ formatDate(item.createdAt) }}
                                        </td>
                                        
                                        <td class="text-truncate">
                                            {{ formatDate(item.updatedAt) }}
                                        </td>

                                        <td>
                                            <v-tooltip bottom v-if="item.status =='done'">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn x-small fab v-bind="attrs" v-on="on" @click="downloadReport(item)" class="ml-2">
                                                        <v-icon>mdi-download</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>Download</span>
                                            </v-tooltip>
                                        </td>
                                    </tr>
                                </tbody>
                            </template>
                            <template v-slot:footer></template>
                        </v-data-table>
                    </div>
                </v-card-text>
            </v-card>
            <v-card v-else>
                <div class="py-16 text-center">
                    <img src="/icons/nodata.svg" /><br />
                    <strong class="red--text" v-if="errorCode === 404">
                        {{ $t("noRecordFound") }}
                    </strong>
                    <strong class="red--text" v-else>
                        {{ $t('failed') }}
                    </strong>
                </div>
            </v-card>
        </v-container>
        <!-- Filters End -->
    </div>
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import SurveyBuilderService from "@/_services/SurveyBuilderService";
import DateMixin from '@/mixins/DateMixin'
import DownloadMixin from '@/mixins/DownloadMixin'

export default {
    created() {
        const fetchData = async () => {
            this.getSurveyDownloadHistory()
        };
        fetchData()
    },
    data() {
        return {
            errorCode: null,
            filterParam: {
                status: "",
                membership_type: "",
                sales_manager: "",
            },
            filteredData: false,
            canSearch: false,
            showFilters: false,
            confirm: false,
            selectedItem: false,
            options: {
                itemsPerPage:10
            },
            loading: false,
            search: "",
            from: 0,
            to: 0,
            totalPages: 1,
            surveyDownloads: [],
            totalSurveyDownloads:0,
            headers: [
                {
                    text: 'File Name',
                    align: "start",
                    value: "id",
                    class: "black--text",
                    sortable: false,
                },
                {
                    text: 'Status',
                    value: "name",
                    class: "black--text",
                    sortable: false,
                },
                {
                    text: 'Requested Date',
                    value: "id",
                    class: "black--text",
                    sortable: false,
                },
                {
                    text: 'Completion Date',
                    value: "user_email",
                    class: "black--text",
                    sortable: false,
                },
                {
                    text: 'Action',
                    value: "action",
                    class: "black--text",
                    sortable: false,
                }
            ],
            breadcrumbs: [
                {
                    text: this.$t("dashboard"),
                    disabled: false,
                    to: { name: "Users" },
                    exact: true,
                },
                {
                    text: 'Survey Builder',
                    disabled: true,
                    href: "breadcrumbs_link_1",
                },
                {
                    text: 'Survey Downloads',
                    disabled: true,
                    href: "breadcrumbs_link_1",
                },
            ],
        };
    },
    methods: {
        getSurveyDownloadHistory(){
            this.startLoading()
            this.loading = true
            const requestParams = {
                limit: this.options.itemsPerPage,
                page: this.options.page ?? 1,
                searchPhrase: this.search,
                id:this.$route.params.id
            };
            SurveyBuilderService.getDownloadSurveyHistories(requestParams).then(res => {
                if(res.success) {
                    this.surveyDownloads = res.data.rows
                    this.totalSurveyDownloads = res.data.count
                    this.totalPages = Math.ceil(this.totalSurveyDownloads/this.options.itemsPerPage)
                    this.from = (this.options.page-1)*this.options.itemsPerPage+1
                    this.to = (this.options.page*this.options.itemsPerPage)-(this.options.itemsPerPage-res.data.rows.length)
                } else {
                    this.errorCode = res.code;
                }
                this.loading = false;
                this.stopLoading()
            }).catch(() => {
                this.errorCode = 500;
                this.loading = false;
                this.stopLoading()
            }) 
        },
        getStatusClass() {
            return "primary--text";
        },
        selectItem(item) {
            this.selectedItem = item;
        },
        resetSearchOnEmpty() {
            if(this.search != '') return;
            this.options.page = 1;
            this.getSurveyDownloadHistory();
        },
        pageChange(t) {
            if (t) this.options.page = this.options.page + 1;
            else this.options.page = this.options.page - 1;

            this.getSurveyDownloadHistory();
        },
        async downloadReport(item){
           window.location.href = item.fileUrl
        }
    },
    async mounted() {
        // this.startLoading();
        // await this.getActivationKeys()
        // this.stopLoading();
    },
    mixins: [loadingMixin,DateMixin,DownloadMixin],
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

::v-deep .my-custom-dialog {
    position: absolute;
    top: 0;
    min-height: 100%;
    right: 0;
    margin-right: 0px;
    margin-top: 0px;
}
</style>