<template>
    <v-container>
        <v-row class="plr-25 px-5 pt-5">
            <div class="text-h6">{{$t('farm.locationZone')}} ({{ zoneList.length }})</div>
            <v-spacer></v-spacer>
            <v-btn depressed color="primary" dark @click="handleAddZone(true)">
                {{ $t("farm.addNewZone") }}
            </v-btn>
        </v-row>

        <div v-if="zoneList.length > 0 || searched">
            <v-card-text>
                <v-data-table :footer-props="{
                    'items-per-page-options': itemsPerPageOptions,
                    'show-first-last-page': true,
                    'show-current-page': true,
                }" :headers="headers" :loading="loading" :loading-text="$t('animal.loadingAnimals')" :items="zoneList"
                    :items-per-page="itemsPerPage" :options.sync="tableOptions" class="elevation-1"
                    :server-items-length="zoneList.length">
                    <template v-slot:top>
                        <div class="d-flex mt-5">
                            <v-text-field prepend-inner-icon="mdi-magnify" outlined :placeholder="$t('search')" dense
                                v-model="search" @input="resetSearchOnEmpty" class="shrink">
                            </v-text-field>
                            <v-spacer></v-spacer>
                            <div class="py-3">
                                {{
                                (tableOptions.page - 1) * tableOptions.itemsPerPage + 1
                                }}
                                -
                                {{
                                tableOptions.page * tableOptions.itemsPerPage -
                                (tableOptions.itemsPerPage - count)
                                }}
                                of {{ totalCount }}
                            </div>
                            <v-btn class="mx-2" fab small outlined color="primary" :disabled="tableOptions.page == 1"
                                @click="pageChange(false)">
                                <v-icon dark> mdi-chevron-left </v-icon>
                            </v-btn>
                            <v-btn class="mx-2" fab small outlined color="primary" :disabled="(tableOptions.page - 1) * tableOptions.itemsPerPage +
                                count >=
                                totalCount
                                " @click="pageChange(true)">
                                <v-icon dark> mdi-chevron-right </v-icon>
                            </v-btn>
                            <v-btn class="mx-2" fab small outlined color="primary" @click="exportToPDF">
                                <v-icon dark> mdi-download </v-icon>
                            </v-btn>
                            <v-btn class="mx-2" fab small outlined color="primary" @click="printPDF">
                                <v-icon dark> mdi-printer </v-icon>
                            </v-btn>
                        </div>
                    </template>
                    <template v-slot:progress>
                        <v-progress-linear color="primary" :height="8" indeterminate></v-progress-linear>
                    </template>
                    <template v-slot:no-data v-if="loading">
                        <v-progress-linear indeterminate color="green"></v-progress-linear>
                    </template>
                    <template v-slot:item.geofenceName="{ item }">
                        <span>{{ item.geofenceName }}</span>
                    </template>
                    <template v-slot:item.geofenceParameter="{ item }">
                        {{ item.geofenceParameter }}
                    </template>
                    <template v-slot:item.geofenceArea="{ item }">
                        <span>{{ convertSizeIntoBaseUnit(item.geofenceArea) }}</span>
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-btn depressed plain color="blue" @click="editZone(item, true)" x-small style="height: 100%">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn plain color="red" @click="deleteZone(item, true)" x-small style="height: 100%">
                            <v-icon>mdi-trash-can</v-icon>
                        </v-btn>
                        <v-btn plain color="red" @click="rowClicked(item, true)" x-small style="height: 100%">
                            <v-icon>mdi-eye</v-icon>
                        </v-btn>
                    </template>
                </v-data-table>
            </v-card-text>
        </div>
        <v-card v-else flat color="transparent" class="px-10 mt-5">
            <div class="text-center white" style="min-height: 20vh">
                <v-row justify="center" align="center">
                    <v-col cols="12" sm="4">
                        <div class="py-16">
                            <img src="/img/Notes.svg" /><br />
                            <div class="pb-4">
                                <small>{{$t('farm.noZoneMessage')}}
                                    <br />
                                    {{$t('farm.noZoneRequest')}}</small>
                            </div>
                            <v-btn depressed color="primary" dark small @click="handleAddZone(true)">
                                {{ $t("farm.addNewZone") }}
                            </v-btn>
                        </div>
                    </v-col>
                </v-row>
            </div>
        </v-card>
        <ConfirmBax v-if="deleteconfirm" :dialog="deleteconfirm" :title="confirmBoxInfo.title"
            :message1="confirmBoxInfo.message1" :message2="confirmBoxInfo.message2" confirmBtnText="Delete"
            :confirmData="itemToDelete" @continue:action="deleteConfirmed" @cancel:action="closeConfirmed" />
        <v-dialog v-if="showAddZone" v-model="showAddZone" persistent max-width="75vw">
            <v-card>
                <add-zone @closeAddZone="closeAddZone" @handleAddZone="handleAddZone" :popup="showAddZone" :farm-id="farmId"
                    :location-id="locationId" :locationObj="locationObj" :zoneList="zoneList"></add-zone>
            </v-card>
        </v-dialog>
        <zone-detail v-if="showZoneDetail" :dialog="showZoneDetail" :farm-id="farmId" :location-id="locationId" :zone-id="selectedZone.id" :zone-detail="selectedZone" :zoneList="zoneList"
                     :locationObj="locationObj" @rowClicked="rowClicked" @deleteZone="deleteZone" @editZoneFromDetail="editZoneFromDetail"></zone-detail>
        <zone-edit v-if="showZoneEdit" :popup="true" :dialog="showZoneEdit" :zone-id="selectedZoneId" :location-id="locationId" :farm-id="farmId" @editZone="editZone"></zone-edit>
    </v-container>
</template>

<script>

// let removeSegment
import ConfirmBax from "@/components/ConfirmBox.vue";
import ZoneDetails from "../components/LocationZoneDetails.vue";
import ZoneEdit from "../components/LocationZoneEdit.vue";
import FarmGeofenceZone from "../zone/FarmGeofenceZone.vue";
import html2pdf from "html2pdf.js";
import printJS from "print-js";
import loadingMixin from "@/mixins/LoadingMixin";
import FarmService from "@/_services/FarmService";
import {convertSizeIntoBaseUnit} from "@/utils.js"
export default {
    components: {
        ConfirmBax,
        "add-zone": FarmGeofenceZone,
        "zone-detail": ZoneDetails,
        "zone-edit": ZoneEdit,
    },
    apollo: {

  },
    props: {
        locationId: {
            type: Number,
            require: true,
        },
        farmId: {
            type: Number,
            require: true
        },
        locationObj: {
            type:Object
        }
    },
    async mounted() {
      await this.fetchZones()
 
    },
    watch: {
        search: {
            handler(data){
                if(data) this.searched = true;
            }
        }
    },
    data() {
        return {
            currentLocation: null,
            zoneCount: 0,
            totalCount: 0,
            zoneList: [],
            loading: false,
            search: "",
            searched: false,
            page: 1,
            limit: 10,
            tableOptions: {},
            itemsPerPage: 5,
            itemsPerPageOptions:[10, 25, 50, 100],
            tabletTableOptions: { itemsPerPage: 10, page: 1, sortBy: [] },
            deleteconfirm: false,
            itemToDelete: null,
            confirmBoxInfo: {
                title: "Delete zone",
                message1: null,
                message2: null,
            },
            showZoneEdit: false,
            showAddZone: false,
            showZoneDetail: false,
            selectedZoneId: 0,
            selectedZone: null,

            headers: [
                {
                    text: this.$t("farm.zoneName"),
                    align: "start",
                    value: "geofenceName",
                    class: "black--text",
                },
                // {
                //     text: this.$t("# of Animal Groups"),
                //     align: "start",
                //     value: "animalGroups",
                //     class: "black--text",
                // },
                {
                    text: this.$t("farm.perimeter"),
                    align: "start",
                    value: "geofenceParameter",
                    class: "black--text",
                },
                {
                    text: this.$t("farm.area"),
                    value: "geofenceArea",
                    class: "black--text",
                },
                {
                    text: this.$t("farm.actions"),
                    value: "actions",
                    class: "black--text",
                    align: "center center",
                    sortable: false,
                },
            ],

        };
    },
    methods: {
        convertSizeIntoBaseUnit,
        async fetchZones() {
            this.startLoading();
            try {
                let zoneListRes = await FarmService.getFarmZoneByLocationId(this.locationId, this.page, this.limit, this.search);
                this.zoneList = zoneListRes.rows.filter((row) => !row.isPrimary);
                console.log(this.zoneList)
                this.tableOptions.page = 1;   
                this.totalCount = zoneListRes.totalCount;
                this.count = zoneListRes.count;
                this.stopLoading();
            } catch (error) {
                this.stopLoading()
            }
        },

        async fetchZoneDetail(){
            this.startLoading();
            try{
                this.selectedZone = await FarmService.getZoneGeofence(+this.selectedZone.id);
                this.stopLoading()
            }
            catch(error){
                this.stopLoading()
            }
        },

        async closeAddZone(){
            this.showAddZone = false
            await this.fetchZones()
        },

        async handleAddZone(status) {
            this.showAddZone = status;
            if (!status && this.$apollo) {
                this.$apollo.queries.zoneList.refetch();   
            }
        },

        async editZone(item, action) {
            this.selectedZoneId = (item?.id);
            this.showZoneEdit = action;
            await this.fetchZones()
        },
        
        async editZoneFromDetail(item,action){
            // alert(JSON.stringify(item))
            this.selectedZoneId = (item?.id);
            this.showZoneDetail = action;
            this.showZoneEdit=true;
        },

        deleteZone(item) {
            this.itemToDelete = item;
            this.deleteconfirm = true;
            this.showZoneDetail = false;
        },
        
        deleteConfirmed(actionConfirmed) {
            if(actionConfirmed) {
                this.removeZone(this.itemToDelete.id);
                this.itemToDelete = { };
            }
            this.deleteconfirm = false;
        },

        closeConfirmed() {
            this.deleteconfirm = false;
        },
        async rowClicked(item, action) {
            await this.fetchZoneDetail()

            this.selectedZone = item;
            this.showZoneDetail = action;
            
        },
        async removeZone(item) {
            console.log({ item });

            this.startLoading();

            try {
                const res = await FarmService.deleteSegment(item);
                
                this.stopLoading();

                await this.fetchZones();

                this.$notify({
                    title: res.message,
                    type: "success",
                });
            } catch (error) {
                console.log('error', error);

                this.$notify({
                    title: "Something went wrong. Please try again later",
                    type: "error",
                });
            } finally {
                this.stopLoading();
            }
        },
      
        resetSearchOnEmpty() {
            if (this.search == "") return;
            if (this.checkBreakPoints) {
                this.tabletTableOptions.page = 1;
            } else {
                this.tableOptions.page = 1;
            }
        },

        async searchZone() {
            this.startLoading();
            this.searched = true;
            await this.$apollo.queries.zoneList.refetch();
            this.stopLoading();
        },

        async exportToPDF() {
            const element = document.querySelector(".v-data-table__wrapper");

            html2pdf(element, {
                margin: 1,
                filename: "ZoneList.pdf",
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { dpi: 200, letterRendering: true },
                jsPDF: {
                unit: "in",
                format: "letter",
                orientation: "landscape",
                compress: false,
                },
            });
        },

        async printPDF() {
            const element = document.querySelector(".v-data-table__wrapper");

            let opt = {
                margin: 1,
                filename: "ZoneList.pdf",
                image: { type: "jpeg", quality: 0.95 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
            };

            let worker = await html2pdf()
                .set(opt)
                .from(element)
                .toCanvas()
                .outputPdf("blob", "ZoneList.pdf");
            let file = new File([worker], "ZoneList.pdf", {
                type: "application/pdf",
            });

            var pdfUrl = URL.createObjectURL(file);
            printJS({ printable: `${pdfUrl}`, type: "pdf", showModal: true });
        },
        async pageChange(t) {
            if (t) this.tableOptions.page = this.tableOptions.page + 1;
            else this.tableOptions.page = this.tableOptions.page - 1;     
        },
    },
    mixins: [loadingMixin]
};
</script>