<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid class="mb-8">
            <div class="d-flex mb-8">
                <h2 class="text-capitalize">{{ $t("oma.avocadoTreeDetailHeader") }}</h2>
                <v-spacer></v-spacer>
                <v-btn depressed color="primary" class="mr-5" outlined @click="$router.back()">
                    {{ $t("back") }}
                </v-btn>
                <v-btn depressed color="primary" @click="showAddSingleTreeDialog = true">
                    {{ $t("edit") }}
                </v-btn>
            </div>
            <v-card v-if="treeDetails" elevation="0" class="px-5 pb-8 pb-10">
                <v-card-text>
                    <v-row class="mt-5" width="100%">
                        <v-col lg="3" md="4" sm="6" xs="12" v-for="(item, index) in cardItems" :key="index">
                            <v-card class="green2 elevation-0">
                                <v-list class="green2">
                                    <v-list-item three-line>
                                        <v-list-item-content>
                                            <v-list-item-subtitle>{{ $t(item.label) }}
                                                <v-tooltip top color="black" max-width="350">
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-icon v-bind="attrs" v-on="on">
                                                            mdi-information-outline
                                                        </v-icon>
                                                    </template>
                                                    <span>{{ $t(item.label) }}</span>
                                                </v-tooltip>
                                            </v-list-item-subtitle>
                                            <v-list-item-title class="text-h6 mt-2">
                                                {{ item.value }}
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-container>
        <v-container fluid>
            <v-card flat class="mb-4">
                <div class="text-center">
                    <div class="pa-4">
                        <div class="d-flex my-5">
                            <h3>{{ $t("oma.avocadoTreeUpdates") }}</h3>

                            <v-spacer></v-spacer>

                            <v-btn depressed color="primary mr-5" @click="showAddTreeImagesPopup = true">
                                {{ $t("oma.avocadoAddImages") }}
                            </v-btn>
                            <template v-if="updateHistoryArr.length > 0">
                                <div class="py-1 title">{{ from }} - {{ to }} {{ $t('of') }} {{ totalUpdates }}</div>
                                <v-btn class="mx-2" fab small outlined color="primary" :disabled="tableOptions.page <= 1"
                                    @click="pageChange(false)">
                                    <v-icon dark> mdi-chevron-left </v-icon>
                                </v-btn>
                                <v-btn class="mx-2" fab small outlined color="primary"
                                    :disabled="tableOptions.page >= totalPages" @click="pageChange(true)">
                                    <v-icon dark> mdi-chevron-right </v-icon>
                                </v-btn>
                            </template>
                        </div>
                        <v-data-table v-if="updateHistoryArr.length > 0" :headers="headers" :items="updateHistoryArr"
                            :items-per-page="10" :footer-props="{
                                'items-per-page-options': [10, 25, 50],
                            }" hide-default-footer :loading="updatesLoading" :options.sync="tableOptions"
                            :server-items-length="totalUpdates" color="yellow-darken-2" loading-text="Loading Trees...">
                            <template v-slot:body="{ items }">
                                <tbody>
                                    <tr v-for="(item, index) in items" :key="index">
                                        <td class="text-start">{{ getLocalTimeFromUTC(item.createdAt) }} </td>
                                        <!-- should be created at imo because, 
                                            image creation date makes more sense, because the user is tracking how the tree looks chronologically through images-->
                                        <td class="text-start">{{ item.lastUpdatedBy.fullName }}</td>
                                        <td class="text-start text-overflow">{{ item.notes }}</td>
                                        <td class="text-start">{{ item.images.length }}</td>
                                        <td class="d-flex text-start">
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn x-small fab v-bind="attrs" v-on="on" class="green-shadow"
                                                        @click="startEdit(item)">
                                                        <v-icon>mdi-pencil</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>{{ $t("edit") }}</span>
                                            </v-tooltip>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn x-small fab v-bind="attrs" v-on="on" class="ml-1 green-shadow"
                                                        @click="deleteUpdateHistory(item.id)">
                                                        <v-icon>mdi-trash-can</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>{{ $t("delete") }}</span>
                                            </v-tooltip>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn x-small fab v-bind="attrs" v-on="on" class="ml-1 green-shadow"
                                                        @click="showDetail(item)">
                                                        <v-icon>mdi-eye</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>{{ $t("view") }}</span>
                                            </v-tooltip>
                                        </td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-data-table>
                    </div>
                </div>
            </v-card>
        </v-container>
        <AddTreeImagesPopup :showDialog="showAddTreeImagesPopup" @closeModal="closeAddTreePopup"
            @closeModalAfterSubmit="closeModalAfterSubmit" :treeId="$route.params.id" :isEdit="popupEdit"
            :treeItem="treeItem" :updateCounter="updateCounter">
        </AddTreeImagesPopup>
        <AvacadoTreeDetailPopup v-if="showTreeDetailPopup" @editBtnClick="startEdit(treeItem)"
            @deleteBtnClick="deleteUpdateHistory(treeItem.id)" :showPopup="showTreeDetailPopup" :tree="treeItem"
            @close="closeAvocadoTreeDetailPopup" />
        <AddSingleTreeDialog v-if="showAddSingleTreeDialog" :dialogI="showAddSingleTreeDialog"
            @closeDialog="showAddSingleTreeDialog = false"
            @emitNewTree="() => { showAddSingleTreeDialog = false; fetchTreeData() }" :farm="farm"
            :zone="treeDetails.zoneId" :selectedTree="treeDetails" />
    </div>
</template>
<script>
import Breadcrumb from "@/components/core/Breadcrumb";
import loadingMixin from "@/mixins/LoadingMixin";
import DateMixin from "@/mixins/DateMixin";
import AvocadoTreesService from "@/_services/AvocadoTreesService";
import FarmService from "@/_services/FarmService";
import AddTreeImagesPopup from "./AddTreeImagesPopup.vue"
import AvacadoTreeDetailPopup from "./AvacadoTreeDetailPopup.vue";
import AddSingleTreeDialog from "./AddSingleTreeDialog.vue";
import moment from "moment"

export default {
    components: {
        breadcrumb: Breadcrumb,
        AddTreeImagesPopup,
        AvacadoTreeDetailPopup,
        AddSingleTreeDialog,
    },
    computed: {},
    data() {
        return {
            farm: {},
            showAddSingleTreeDialog: false,
            updateCounter: 0,
            treeItem: {},
            popupEdit: false,
            showAddTreeImagesPopup: false,
            cardItems: null,
            treeDetails: null,
            treeVisibleDetails: {
                clientTreeId: "",
                treeName: "",
                latitude: "",
                longitude: "",
                altitude: "",
                zoneId: "",
                // createdAt: new Date(),
                plantationDate: new Date(),
                updatedAt: new Date(),
            },
            showTreeDetailPopup: false,
            updatesLoading: false,
            updateHistoryArr: [],
            headers: [
                {
                    text: this.$t("oma.avocadoTreeDetailsTableHeader.updatedOn"),
                    align: "start",
                    value: "updatedOn",
                    class: "black--text"
                },
                {
                    text: this.$t("oma.avocadoTreeDetailsTableHeader.updatedBy"),
                    align: "start",
                    value: "updatedBy",
                    class: "black--text"
                },
                {
                    text: this.$t("oma.avocadoTreeDetailsTableHeader.notes"),
                    align: "start",
                    value: "notes",
                    class: "black--text",
                },
                {
                    text: this.$t("oma.avocadoTreeDetailsTableHeader.noOfImages"),
                    align: "start",
                    value: "",
                    class: "black--text"
                },
                {
                    text: this.$t("oma.avocadoTreeDetailsTableHeader.actions"),
                    align: "left",
                    value: "longitude",
                    class: "black--text"
                }
            ],
            from: 1,
            to: 10,
            limit: 10,
            totalUpdates: 10,
            tableOptions: {
                page: 1
            },
            totalPages: 1,
            breadcrumbs: [
                {
                    text: this.$t("dashboard"),
                    disabled: false,
                    to: "/",
                },
                {
                    text: this.$t("oma.avocadoTrees"),
                    link: true,
                    exact: true,
                    disabled: false,
                    to: { name: "AvocadoTrees" },
                },
                {
                    text: this.$t("oma.avocadoTreeDetail"),
                    link: false,
                    exact: true,
                    disabled: true
                }
            ],
        };
    },
    watch: {
    },
    async mounted() {
        await this.fetchTreeData();
        await this.getFarm();
    },

    methods: {
        formatDate1(date) {
            console.log(date,"datedatedate")
            return moment(date).format("MM/DD/YYYY h:mm a");
        },
        closeAddTreePopup() {
            this.showAddTreeImagesPopup = false;
            this.treeItem = {};
        },
        async fetchTreeData() {
            this.startLoading();
            await Promise.all([
                this.getSingleTree(),
                this.updateHistory(),
            ]);
            this.stopLoading();
        },
        startEdit(treeItem) {
            this.updateCounter++
            this.showTreeDetailPopup = false;
            this.popupEdit = true
            this.treeItem = treeItem
            this.showAddTreeImagesPopup = true
        },
        async closeModalAfterSubmit() {
            this.closeAddTreePopup();
            this.startLoading()
            await this.updateHistory()
            await this.getSingleTree();
            this.stopLoading()

        },
        async getSingleTree() {
            let singleTreeRes = await AvocadoTreesService.getSingleTree(this.$route.params.id)
            this.treeDetails = singleTreeRes.data
            this.cardItems = Object.entries(this.treeVisibleDetails).map(([label, value]) => {
                if (value instanceof Date) {
                    if (label == "updatedAt") {
                        return {
                            label: this.$t(`oma.avocadoDetailCard.${label}`),
                            value: `Date: ${this.formatDate(this.treeDetails[label])}   By:${this.treeDetails?.lastUpdatedBy?.fullName}
                            `
                        }
                    } else if(label == "plantationDate") {
                        return {
                            label: this.$t(`oma.avocadoDetailCard.${label}`),
                            value: this.formatDate1(this.treeDetails[label])
                        }
                    }else  {
                        return {
                            label: this.$t(`oma.avocadoDetailCard.${label}`),
                            value: this.formatDate1(this.treeDetails[label])
                        }
                    }
                }

                return {
                    label: `oma.avocadoDetailCard.${label}`,
                    value: this.treeDetails[label]
                }
            });
        },

        async updateHistory() {
            let historyRes = await AvocadoTreesService.getTreeUpdateHistory(this.$route.params.id)
            this.updateHistoryArr = historyRes?.data?.rows;
            this.totalUpdates = historyRes?.data?.count;
            this.from = ((this.tableOptions.page - 1) * this.limit) + 1;
            this.to = this.tableOptions.page * this.limit;
            if (this.to > this.totalUpdates) {
                this.to = this.totalUpdates;
            }
            this.totalPages = Math.ceil(this.totalUpdates / this.limit);
        },
        async deleteUpdateHistory(historyId) {
            this.startLoading();
            try {
                await AvocadoTreesService.deleteTreeUpdateHistory(historyId);
                await this.getSingleTree();
                await this.updateHistory();
                this.showTreeDetailPopup = false;
                this.$notify({
                    title: this.$t("deleted"),
                    type: "success",
                });
            } catch (error) {
                this.$notify({
                    title: this.$t("failed"),
                    type: "error",
                });
            } finally {
                this.stopLoading();
            }
        },
        pageChange(t) {
            if (t) {
                this.tableOptions.page = this.tableOptions.page + 1
            } else {
                this.tableOptions.page = this.tableOptions.page - 1
            }
            // this.getSurveys();
        },
        showDetail(treeItem) {
            this.treeItem = treeItem;
            this.showTreeDetailPopup = true
        },
        closeAvocadoTreeDetailPopup() {
            this.showTreeDetailPopup = false;
            this.treeItem = {};
        },
        async getFarm() {
            this.farm = await FarmService.getFarm(this.treeDetails.farmId);
        },
    },

    mixins: [loadingMixin, DateMixin],
};
</script>
<style lang="scss" scoped>
::v-deep .v-data-table-header__icon {
    color: white !important;
}

::v-deep .v-data-table-header {
    background-color: #FFB443 !important;
}

::v-deep .v-data-table-header span {
    color: black !important;
    font-weight: bold !important;
}

.text-truncate-title {
    max-width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.text-truncate-desc {
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.text-overflow {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.col-question {
    width: 125px;
}

.col-response {
    width: 131px;
}
</style>