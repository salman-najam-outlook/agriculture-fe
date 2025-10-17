<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div class="d-flex mb-4">
                <h2>{{ $t("farms") }} ({{ totalFarms }})</h2>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    class="mr-2 mb-2"
                    @click="$router.push({name:'FarmUploadValidations'})"
                    v-show="$can($permissions.can_create_farm.value)"
                >
                {{ $t("farm_upload_validation.Farm_Upload_Validation") }}   
                </v-btn>
                <v-btn
                    color="primary"
                    dark
                    class="mr-2 mb-2"
                    @click="$router.push({name:'FarmRegistartion'})"
                    v-show="$can($permissions.can_create_farm.value)"
                >
                {{ $t('farm.addFarm') }}
                </v-btn>
                <v-menu bottom origin="center center" transition="scale-transition" v-if="$can($permissions.can_create_farm.value)">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn color="primary" v-bind="attrs" v-on="on">
                        {{ $t("farm.importFarmsInBulk") }}
                        <v-icon>mdi-chevron-down</v-icon>
                        </v-btn>
                    </template>
                    <v-list>
                        <v-list-item @click="toggleFarmBulkImportDialog('CSV')">
                            <v-list-item-title class="cursor-pointer">
                                {{ $t("oma.importCSVFormat") }}
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="toggleFarmBulkImportDialog('GeoJson')">
                            <v-list-item-title class="cursor-pointer">
                                {{ $t("oma.importGeoJsonFormat") }}
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="toggleFarmBulkImportDialog('XLS')">
                            <v-list-item-title class="cursor-pointer">
                                {{ $t("oma.importXLSFormat") }}
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="toggleFarmBulkImportDialog('Geobuf')">
                            <v-list-item-title class="cursor-pointer">
                                {{ $t("oma.importGeobufFormat") }}
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="toggleFarmBulkImportDialog('GeoPackage')">
                            <v-list-item-title class="cursor-pointer">
                                {{ $t("oma.importGeoPackageFormat") }}
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="toggleFarmBulkImportDialog('TopoJson')">
                            <v-list-item-title class="cursor-pointer">
                                {{ $t("oma.importTopoJsonFormat") }}
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </div>
            <v-card elevation="0" class="px-5">
                <v-card-text>
                    <!-- <div v-if="!farms.length" class="text-center" style="padding-top:5%">
                        <v-row align="center" justify="center">
                            <v-col>
                                <v-img max-height="190" max-width="190" src="/icons/nodata.svg" class="img-center"></v-img>
                                <h5 class="mt-4 red--text">{{ $t("memberDataSection.noFarms") }}</h5>
                                <p class="text-caption black--text">
                                    {{ $t("memberDataSection.noFarms") }}
                                </p>
                            </v-col>
                        </v-row>
                    </div> -->
                    <div>
                      <farm-list
                        class="mt-4"
                        :headers="headers"
                        :farms="farms"
                        :totalFarms="totalFarms"
                        :toggleSelection="true"
                        @fetchFarmData="fetchFarmData"
                        :toggleFilterState="true"
                      />
                    </div>
                </v-card-text>
            </v-card>
        </v-container>

        <user-farm-request
            v-if="showFarmRequest"
            :dialogI="showFarmRequest"
            @closeUserFarmRequest="showFarmRequest = false"
            @popupUserFarmReject="popupUserFarmReject" 
            @popupUserFarmApprove="popupUserFarmApprove"
            :selectedFarmId="selectedFarmId"
        >
        </user-farm-request>
        <user-farm-reject
            v-if="showFarmReject"
            :dialogI="showFarmReject"
            @closeUserFarmReject="showFarmReject = false"
            :selectedFarmId="selectedFarmId"
        >
        </user-farm-reject>
        <user-information
            v-if="showUserInformation"
            :dialogI="showUserInformation"
            @closeUserInformation="showUserInformation = false"
            :selectedFarmId="selectedFarmId"
        >
        </user-information>

        <confirm-box :title="confirmElements.title"
            :cancelBtnText="confirmElements.cancelBtnText" :confirmBtnText="confirmElements.confirmBtnText"
            :confirmData="confirmElements.confirmData" :dialog="confirm" @cancel:action="confirmCancel" @continue:action="confirmDeactivate"></confirm-box>
        <FarmBulkImportDialog v-model="isFarmBulkImportDialogOpen" :format="farmBulkImportFormat" @bulkImportedFarms="fetchFarmData" />
    </div>
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import UserFarmRequest from "./components/UserFarmRequest.vue";
import UserFarmReject from "./components/UserFarmReject.vue";
import UserInformation from "./components/UserInformation.vue";
import DownloadMixin from "@/mixins/DownloadMixin"
import {mapGetters} from 'vuex'
import ConfirmBox from "@/components/ConfirmBox";
import FarmService from "../../_services/FarmService";
import {convertSizeIntoBaseUnit} from "@/utils.js"
import FarmBulkImportDialog from './components/FarmBulkImportDialog';
import FarmList from './components/FarmList.vue';


export default {
    created() {
       this.fetchFarmData()
    },
    components:{
        UserFarmRequest,
        UserFarmReject,
        UserInformation,
        "confirm-box": ConfirmBox,
        FarmBulkImportDialog,
        FarmList,
    },
    computed:{
        ...mapGetters({
            farms : 'memberData/farms',
            totalFarms:'memberData/farmsCount'
        }),
    },
    data() {
        return {
            isFarmBulkImportDialogOpen: false,
            farmBulkImportFormat: 'CSV',
            showFarmRequest:false,
            showFarmReject:false,
            showUserInformation:false,
            selectedFarmId: null,
            farmLoading: false,
            farmStatusList: [
                { val: '', label: this.$t('all') },
                { val: 'approved', label: this.$t('memberDataSection.approved')  },
                { val: 'rejected', label: this.$t('memberDataSection.rejected') },
                { val: 'pending', label: this.$t('pending') }
            ],
            farmStatus: '',
            headers: [
              {
                    text: this.$t("deforestation.dimitraFarmId"),
                    align: "start",
                    value: "dimitraFarmId",
                    class: "black--text",
                },
                {
                    text: this.$t("farm.farmId"),
                    align: "start",
                    value: "registrationNo",
                    class: "black--text",
                },
                {
                    text: this.$t("farmName"),
                    align: "start",
                    value: "farmName",
                    class: "black--text",
                },
                {
                    text: this.$t("farmerName"),
                    align: "start",
                    value: "farmerName",
                    class: "black--text",
                },
                {
                    text: this.$t("deforestation.farmAddress"),
                    align: "start",
                    value: "farmAddress",
                    class: "black--text",
               },
               {
                    text: this.$t("deforestation.farmLocation"),
                    align: "start",
                    value: "farmLocation",
                    class: "black--text",
               },
                {
                    text: this.$t("country"),
                    align: "start",
                    value: "country",
                    class: "black--text",
                },
                {
                    text: this.$t("farm.regDate"),
                    align: "start",
                    value: "date",
                    class: "black--text",
                },
               {
                    text: this.$t("farm.regBy"),
                    align: "start",
                    value: "regBy",
                    class: "black--text",
                },
                {
                    text: this.$t("farm.reports"),
                    align: "start",
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
            breadcrumbs: [
                {
                    text: this.$t("dashboard"),
                    disabled: false,
                    to: { name: "Users" },
                    exact: true,
                },
                {
                    text: this.$t("reports.regions.farms"),
                    disabled: true,
                    href: "breadcrumbs_link_1",
                },
            ],
            confirm: false,
            confirmElements: {
                title: this.$t("addEdituser.deactivateUser"),
                confirmBtnText: this.$t("addEdituser.activateAct"),
                cancelBtnText: this.$t("cancel"),
                confirmData: {},
            },
        };
    },
    methods: {
        toggleFarmBulkImportDialog(format) {
            this.farmBulkImportFormat = format;
            this.isFarmBulkImportDialogOpen = !this.isFarmBulkImportDialogOpen;
        },
        convertSizeIntoBaseUnit,
        fetchFarmData(options) {
            this.startLoading()
            this.$store.dispatch('memberData/getFarms', options)
            .then(()=>this.stopLoading()).catch(() => this.stopLoading())
        },
        
        handleApprovedRejectDialog(farmId){
            this.showFarmRequest = true
            this.selectedFarmId = farmId
        },
        popupUserFarmReject(){
            this.showFarmRequest = false
            this.showFarmReject = true
        }, 
        popupUserFarmApprove() {
            this.showFarmRequest = false
            this.showFarmReject = false
            this.showUserInformation=true
        },
        changeFarmStatus(id) {
            this.confirmElements.title =this.$t("farm.deleteFarm");
            this.confirmElements.confirmBtnText =this.$t("farm.deleteFarm");
            this.confirmElements.confirmData = { farmId: id};
            this.confirm = true;
        },
        confirmCancel() {this.confirm = false},
        async confirmDeactivate(action, confirmData) {
            if (action) {
                await this.startLoading();
                FarmService.deactiveFarm(confirmData.farmId)
                .then(async(res) => {
                    if (res.success) {
                        await this.stopLoading();
                        this.fetchFarmData()
                        this.confirm = false;
                        this.$notify({
                            title:this.$t("farm.deleted"),
                            type: "success",
                        });
                    } else {
                        await this.stopLoading();
                        this.confirm = false;
                        this.$notify({
                            title: this.$t("farm.notDeleted"),
                            type: "error",
                        });
                    }


                })
                .catch(async() => {
                    // console.log(err)
                    await this.stopLoading();

                    this.confirm = false;
                })
            } else {
                this.confirm = false;
            }
        },
        
    },
    mixins: [loadingMixin, getPermittedActions, DownloadMixin],
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

::v-deep .views-btn .v-btn__content {
    font-weight: 700 !important;
}

::v-deep .approved-text-color {
  color: #00BD73
}

::v-deep .reject-text-color {
  color: #F03737
}

::v-deep .v-data-table-header__icon {
    display: none;
}
</style>
  