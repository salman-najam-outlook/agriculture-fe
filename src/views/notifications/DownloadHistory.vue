<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div class="d-flex mb-4">
                <h2>{{ $t("dueDiligence.downloadHistory") }}</h2>
            </div>
            <v-card elevation="0" class="px-5 mt-7">
                <v-card-text>
                    <v-row>
                        <v-col cols="12">
                            <v-data-table :headers="headers" :items="history" :items-per-page="10" :footer-props="{
                                'items-per-page-options': [5, 10, 25, 50],
                            }" item-key="id" hide-default-footer :options.sync="options"
                                :server-items-length="totalDownloadHistory" :loading-text="$t('loadingData')
                                    ">
                                <template v-slot:top="{}">
                                    <div class="d-flex align-center">
                                        <div class="ml-3" style="width: 220px;">
                                            <label for="text">&nbsp;</label>
                                            <v-text-field style="width: 280px " prepend-inner-icon="mdi-magnify"
                                                outlined height="5px" :placeholder="$t('search')" dense v-model="search"
                                                @input="searchQuery" class="shrink" clearable>
                                            </v-text-field>
                                        </div>

                                        <v-spacer></v-spacer>

                                        <v-spacer></v-spacer>
                                        <div class="py-1 title">
                                            {{ from }} - {{ to }} of {{ totalDownloadHistory }}
                                        </div>
                                        <v-btn class="mx-2" fab small outlined color="primary"
                                            :disabled="options.page <= 1" @click="pageChange(false)">
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

                                <template v-slot:item.fileName="{ item }">
                                    <div class="d-flex align-center">
                                        <img src="img/eudr-dds/pdf-icon.svg" class="pr-2" width="30px" />
                                        <span>{{ item.fileName }}</span>
                                    </div>
                                </template>
                                <template v-slot:item.dateAndTime="{ item }">
                                    <span>{{ getLocalTimeSlashFormat(item.createdAt) }}</span>
                                </template>
                                <template v-slot:item.downloadProgressStatus="{ item }">
                                    <div>
                                        <!-- Downloaded Status -->
                                        <div v-if="item.downloadProgressStatus === 'COMPLETED'">
                                            <v-btn small rounded min-width="200" depressed class="green-button"
                                                height="40">
                                                {{ $t("dueDiligence.downloaded") }}
                                            </v-btn>
                                            <span class="ml-2">{{ $t('dueDiligence.fileIsReady') }}</span>
                                        </div>

                                        <!-- In-Progress Status -->
                                        <div v-else-if="item.downloadProgressStatus === 'INPROGRESS'">
                                            <v-btn small rounded min-width="200" depressed class="orange-button"
                                                height="40">
                                                {{ $t("dueDiligence.inProgress") }}
                                            </v-btn>
                                            <span class="ml-2">{{ $t("dueDiligence.estimatedTime") }}: {{
                                                item.estimatedTime }}</span>
                                        </div>

                                        <!-- Failed Status -->
                                        <div v-else-if="item.downloadProgressStatus === 'FAILED'">
                                            <v-btn small rounded min-width="200" depressed class="red-button"
                                                height="40">
                                                {{ $t("dueDiligence.failed") }}
                                            </v-btn>
                                        </div>
                                    </div>
                                </template>

                                <template v-slot:item.actions="{ item }">
                                    <v-btn @click="retryDownload(item)" color="primary" outlined v-if="item.status === 'FAILED'">
                                        <v-icon>mdi-refresh</v-icon>
                                        {{  $t('dueDiligence.tryAgain') }}
                                    </v-btn>
                                    <a :href="item.fileUrl" target="_blank">
                                        <v-icon color="black" class="cursor-pointer"
                                            v-if="item.status === 'COMPLETED'">mdi-download</v-icon> 
                                    </a>
                                    <v-icon color="red" class="ml-3 cursor-pointer"
                                        @click="removeItem(item)">mdi-trash-can</v-icon>
                                </template>


                                <template v-slot:footer></template>
                            </v-data-table>

                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-container>
    </div>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";
import downloadMixin from "@/mixins/DownloadMixin";
import dateMixin from "../../mixins/DateMixin";
import DeforestationService from "@/_services/DeforestationService";
import axios from 'axios';


export default {
    mounted() {
        this.fetchData();
    },
    data() {
        return {
            debounceTimer: null,
            breadcrumbs: [
                {
                    disabled: false,
                    exact: true,
                    text: this.$t('dueDiligence.dueDiligence'),
                    to: { name: 'dueDiligenceDashboard' },
                },
                {
                    disabled: true,
                    href: 'breadcrumbs_link_1',
                    text: this.$t('dueDiligence.downloadHistory'),
                },
            ],
            search: '',
            options: {
                sortBy: ['fileName'], // Default sort
                sortDesc: [false],
                page: 1,
                itemsPerPage: 10
            },
            totalPages: 1,
            headers: [
                {
                    text: this.$t("dueDiligence.fileName"),
                    align: "start",
                    value: "fileName",
                    class: "black--text",
                    sortable: true,
                },
                {
                    text: this.$t("dueDiligence.dateAndTime"),
                    align: "start",
                    value: "dateAndTime",
                    class: "black--text",
                    sortable: true,
                },
                {
                    text: this.$t("dueDiligence.downloadProgressStatus"),
                    align: "start",
                    value: "downloadProgressStatus",
                    class: "black--text",
                    sortable: false,
                },
                {
                    text: "",
                    align: "center",
                    value: "actions",
                    class: "black--text",
                    sortable: false,
                },
            ],
            history: [

            ],
            totalDownloadHistory: 0,
            from: 0,
            to: 0,
            loading: false
        }
    },
    watch: {
        options: {
            handler() {
                this.fetchSortedData();
            },
            deep: true,
        },
    },
    methods: {
        fetchSortedData() {
            const { sortBy, sortDesc } = this.options;
            this.history = this.history.sort((a, b) => {
                const field = sortBy[0];
                const order = sortDesc[0] ? -1 : 1;
                return (a[field] > b[field] ? 1 : -1) * order;
            });
        },
        searchQuery() {
            clearTimeout(this.debounceTimer)
            this.debounceTimer = setTimeout(() => {
                this.options.page = 1;
                this.fetchData();
            }, 500)
        },

        async fetchData() {
            this.startLoading();
            const payload = {
                search: this.search,
                page: this.options.page,
                limit: this.options.itemsPerPage
            }
            try {
                const response = await DeforestationService.getPdfDownloadHistory(payload);

                if (response?.data?.getHistory?.rows) {
                    this.history = response.data.getHistory.rows.map((item) => ({
                        ...item,
                        dateAndTime: item.completedAt,
                        downloadProgressStatus: item.status
                    }));

                    this.totalDownloadHistory = response.data.getHistory.totalCount;
                    this.totalPages = Math.ceil(
                        this.totalDownloadHistory / this.options.itemsPerPage
                    );
                    this.from =
                        this.totalDownloadHistory > 0
                            ? (this.options.page - 1) * this.options.itemsPerPage + 1
                            : 0;
                    this.to =
                        this.options.page * this.options.itemsPerPage > this.totalDownloadHistory
                            ? this.totalDownloadHistory
                            : this.options.page * this.options.itemsPerPage;

                }
            } catch (error) {
                console.error("Error fetching history data:", error);
            }
            finally {
                this.stopLoading()
            }
        },

        async retryDownload(item) {
            console.log({item})
            const { pdfType, dueDiligenceReportId, id: pdfHistoryId } = item;
            this.startLoading();

            //salman
            // const token = this.$store.state.auth.token;
            //salman
            const fileUrl = `${process.env.VUE_APP_DEFORESTRATION_REPORTING_API_BASE_URL}/diligence-report/final-report-pdf/${dueDiligenceReportId}/${pdfType}`;
            const retryUrl = `${fileUrl}?retry=true&pdfHistoryId=${pdfHistoryId || ''}`;
            axios
                .get(retryUrl, {
                    //salman
                    // headers: {
                    //     'oauth-token': token,
                    //     'Content-Type': 'application/json',
                    // },
                    //salman
                })
                .then(response => {
                    localStorage.removeItem('downloadPdfAlert');
                    const { estimatedTime, downloadId } = response.data;

                    const data = { estimatedTime, downloadId };
                    localStorage.setItem('downloadPdfAlert', JSON.stringify(data));

                    // Navigate to the due diligence dashboard
                    this.$router.push({
                        name: 'dueDiligenceDashboard',
                    });
                })
                .catch(error => {
                    console.error('Download failed:', error);
                })
                .finally(() => {
                    this.stopLoading();
                });
        },

        async downloadPdf(item) {
            if (!item?.fileUrl) {
                this.$notify({
                    type: 'error',
                    title: this.$t("dueDiligence.invalidFilePathOrUrl"),
                });

                return;
            }
            this.startLoading();
            try {
                const fileName = item?.fileName || `download_${new Date().getTime()}.pdf`;
                await this.downloadSourceFile(item.fileUrl, "application/pdf", fileName);
            } catch (error) {
                this.$notify({
                    type: "error",
                    title: this.$t("dueDiligence.errorDownloadingFile"),
                });
            } finally {
                this.stopLoading();
            }
        },

        async removeItem(item) {
            if (!item?.id) {
                this.$notify({
                    type: 'error',
                    title: this.$t("dueDiligence.invalidData")
                });

                return;
            }
            this.startLoading();
            try {
                const res = await DeforestationService.deleteDownloadHistory(item?.id);
                if (res) {
                    this.$notify({
                        type: "success",
                        title: this.$t("deforestation.itemDeletedSuccessfully"),
                    });
                    this.history = this.history.filter((i) => i.id !== item.id);
                } else {
                    this.$notify({
                        type: "error",
                        title: this.$t("dueDiligence.errorDeletingItem"),
                    });
                }
            } catch (error) {
                console.log(error)
                this.$notify({
                    type: "error",
                    title: this.$t('deforestation.anErrorOccuredPlsTryAgain')
                })
            }
            finally {
                this.stopLoading();
            }
        },

        pageChange(t) {
            if (t) this.options.page = this.options.page + 1;
            else this.options.page = this.options.page - 1;
            this.fetchData();
        },


    },

    mixins: [loadingMixin, downloadMixin, dateMixin],
}
</script>
