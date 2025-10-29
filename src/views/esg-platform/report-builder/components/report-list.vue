<template>
    <div>
        <v-data-table :headers="headers" :items="visibleReports" hide-default-footer :server-items-length="totalReports"
            @item-selected="handleSelect" @toggle-select-all="handleSelectAll" :loading-text="$t('loadingData')" :loading="reportsLoading">
            <template v-slot:top="{ }">
                <!-- title  -->
                <h3 class="text-h6 mb-4">
                    {{ $t("List of Reports") }}
                </h3>
                <div class="d-flex">
                    <v-text-field prepend-inner-icon="mdi-magnify" style="width: 300px" outlined height="5px"
                        :placeholder="$t('search')" dense v-model="options.searchPhrase" @input="handleSearch" class="shrink"
                        clearable></v-text-field>

                    <v-spacer></v-spacer>
                    <div class="py-1 title">
                        {{ options.page }} - {{ totalPages }} {{ $t("of") }}
                        {{ totalReports }}
                    </div>
                    <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page <= 1"
                        @click="pageChange(false)">
                        <v-icon dark> mdi-chevron-left </v-icon>
                    </v-btn>
                    <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page >= totalPages"
                        @click="pageChange(true)">
                        <v-icon dark> mdi-chevron-right </v-icon>
                    </v-btn>
                    <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" left :min-width="417">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn class="mx-2" fab small outlined color="primary" v-bind="attrs" v-on="on">
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
                                        <v-slider v-model="itemsPerPage" :tick-labels="itemsPerPageOptions"
                                            :max="3" step="1" ticks="always" tick-size="4" @change="updateLimit"></v-slider>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-divider class="mt-n3"></v-divider>
                            </v-list>
                            <v-card-text>
                                <v-container fluid>
                                    <v-row>
                                        <v-col class="mt-n9" cols="6" v-for="header in headers" :key="header.value">
                                            <v-checkbox v-if="header.text" v-model="selectedHeaders"
                                                :label="header.text" color="primary" :value="header.text" hide-details
                                                :disabled="header.text == 'ID'"></v-checkbox>
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

                </div>

            </template>
            <!-- Report Columns -->
            <template v-slot:item.reportId="{ item }">
                <span class="font-weight-medium">{{ item.reportId || "N/A" }}</span>
            </template>
            <template v-slot:item.template="{ item }">
                {{ item.reportId }}
            </template>
            <template v-slot:item.reportType="{ item }">
                <span class="text-capitalize">{{ item.reportType || "N/A" }}</span>
            </template>
            <template v-slot:item.dateGenerated="{ item }">
                {{ item.dateGenerated.split("T")[0] || "N/A" }}
            </template>
            <template v-slot:item.status="{ item }">
                <div class="d-flex justify-start align-center" style="width: 100%;">
                    <v-chip :color="statusColor(item.status)" outlined class="d-flex justify-center align-center w-100 text-capitalize"
                        style="width: 100%;">
                        {{ item.status }}
                    </v-chip>
                </div>
            </template>
            <template v-slot:item.action="{ item }">
                <v-menu location="start">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn icon v-bind="attrs" v-on="on">
                            <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                    </template>
                    <v-list>
                        <v-list-item>
                            <v-list-item-title class="cursor-pointer" @click="viewReport(item.reportId)">
                                {{ $t("View") }}
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-title class="cursor-pointer" @click="openDownloadDialog(item)">{{
                                $t("Download")
                                }}</v-list-item-title>
                        </v-list-item>
                        <!-- copy and create   new report -->
                        <v-list-item>
                            <v-list-item-title class="cursor-pointer" @click="changeFarmStatus(item.id)">{{
                                $t("Copy and Create New")
                                }}</v-list-item-title>
                        </v-list-item>
                        <!-- delete  -->
                        <v-list-item>
                            <v-list-item-title class="cursor-pointer red--text"
                                @click="confirm = true; confirmElements.confirmData = item">
                                {{ $t("Delete") }}
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </template>
            <template v-slot:footer></template>
        </v-data-table>
        <confirm-box :title="confirmElements.title" :message="confirmElements.message"
            :cancelBtnText="confirmElements.cancelBtnText" :confirmBtnText="confirmElements.confirmBtnText"
            :confirmData="confirmElements.confirmData" :dialog="confirm" @cancel:action="confirm = false"
            @continue:action="confirmDeactivate"></confirm-box>
        <DownloadConfirmDialog v-model="showDownloadDialog" :item="selectedItem" @download="handleDownload" />
    </div>
</template>
<script>
import _ from "lodash";
import ConfirmBox from "@/components/ConfirmBox.vue";
import DownloadConfirmDialog from '../components/download-confirm.vue';
import EsgService from "../../../../_services/EsgService";

export default {
    components: { ConfirmBox, DownloadConfirmDialog },
    props: {
        toggleSelection: {
            type: Boolean,
        },
        toggleFilterState: {
            type: Boolean,
            default: false,
        },
    },
    watch: {
        reports(newReports) {
            this.localReports = newReports;
        },
    },
    computed: {
        totalPages() {
            return this.totalReports < this.options.limit
                ? 1
                : Math.ceil(this.totalReports / this.options.limit);
        },
        dateRangeText() {
            return this.options.date.join(" - ");
        },
    },
    data() {
        return {
            visibleReports: [],
            allReports: [],
            usableReports: [],
            reportsLoading: true,
            totalReports: 0,
            itemsPerPage: 0,
            itemsPerPageOptions: [10, 25, 50, 75, 100],
            selected: [],
            menu: false,
            selectedHeaders: [],
            search: "",
            options: {
                limit: 10,
                page: 1,
                searchPhrase: "",
                date: [],
                status: "",
                orderType: "DESC",
            },
            countries: [],
            states: [],
            confirm: false,
            confirmElements: {
                title: this.$t("farm.deleteFarm"),
                message: this.$t("farm.confirmDeleteFarm"),
                confirmBtnText: this.$t("addEdituser.activateAct"),
                cancelBtnText: this.$t("cancel"),
                confirmData: {},
            },
            filterByDateMenu: false,
            showDownloadDialog: false,
            selectedItem: {},
            headers: [
                {
                    text: this.$t("Report ID"),
                    align: "start",
                    value: "reportId",
                    class: "black--text",
                },
                {
                    text: this.$t("Template"),
                    align: "start",
                    value: "templateId.templateName",
                    class: "black--text",
                },
                {
                    text: this.$t("Access"),
                    align: "start",
                    value: "reportType",
                    class: "black--text",
                },
                {
                    text: this.$t("Date Generated"),
                    align: "start",
                    value: "dateGenerated",
                    class: "black--text",
                },
                {
                    text: this.$t("Status"),
                    align: "center",
                    value: "status",
                    class: "black--text",
                },
                {
                    text: '',
                    align: "start",
                    value: "action",
                    class: "black--text",
                }
            ],
        };
    },
    async created() {
        try {
            const { data } = await EsgService.getEsgReports();
            this.allReports = data.reverse();
            this.usableReports = this.allReports;
            this.initializeData();
        } catch(e) {
            this.$notify({
                type: "error",
                text: "Failed to load ESG Reports"
            });
        } finally {
            this.reportsLoading = false;
        }
    },
    methods: {
        initializeData() {
            this.totalReports = this.usableReports.length;
            this.visibleReports = this.usableReports.slice(0, this.options.limit);
            this.selectedHeaders = this.headers.map(header => header.text).filter(text => text !== 'ID');
        },
        handleSearch() {
            console.log(this.options.searchPhrase);
            this.usableReports = this.allReports.filter((item) => item.reportId.toLowerCase().includes(this.options.searchPhrase.toLowerCase()));
            this.initializeData();
        },
        updateLimit() {
            this.options.limit = this.itemsPerPage === 0 ? 10: this.itemsPerPage * 25;
            this.options.page = 1;
            this.visibleReports = this.usableReports.slice(0, this.options.limit);
        },
        viewReport(reportId) {
             this.$router.push({
                name: 'createNewEsgReport', 
                query: { reportId: reportId, dummyData: true } 
            });
        },
        statusColor(status) {
            if (status === "Saved") return "grey";
            if (status === "Publishing to Blockchain") return "orange";
            if (status === "Published to Blockchain") return "green";
            return "grey";
        },

        pageChange(t) {
            if (t) {
                this.options.page = this.options.page + 1;
            } else {
                this.options.page = this.options.page - 1;
            }
            const currentStartIndex = (this.options.page - 1) * this.options.limit;
            this.visibleReports = this.usableReports.slice(currentStartIndex, currentStartIndex + this.options.limit);
        },
        openDownloadDialog(item) {
            this.selectedItem = item
            this.showDownloadDialog = true
        },
        handleDownload(downloadData) {
            // Handle the download logic here
            console.log('Download format:', downloadData.format)
            console.log('Item to download:', downloadData.item)

            // Implement your download logic based on format
            if (downloadData.format === 'pdf') {
                this.downloadAsPDF(downloadData.item)
            } else if (downloadData.format === 'xls') {
                this.downloadAsExcel(downloadData.item)
            }
        },
        downloadAsPDF(item) {
            // Your PDF download logic
            console.log('Downloading as PDF for item:', item);
        },
        downloadAsExcel(item) {
            // Your Excel download logic
            console.log('Downloading as Excel for item:', item);
        },
        handleSelect(item) {
            this.$emit("select-report", item);
        },
        handleSelectAll(items) {
            this.$emit("select-all-reports", items);
        },
        resetDefaut() {
            this.selectedHeaders = this.headers.map(header => header.text).filter(text => text !== 'ID');
        },
        resetTableStructure() {
            this.$emit("reset-table-structure", this.selectedHeaders);
        },
        confirmDeactivate() {
            this.$emit("delete-report", this.confirmElements.confirmData);
            this.confirm = false;
        }
    },
    // mixins: [loadingMixin, DownloadMixin],
};
</script>
