<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div class="d-flex mb-4">
                <h2>{{ $t("memberDataSection.farms") }}</h2>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    dark
                    class="mr-2 mb-2"
                    @click="$router.push({name:'FarmRegistartion'})"
                >
                {{ $t('farm.addFarm') }}
                </v-btn>
            </div>
            <v-card elevation="0" class="px-5">
                <v-card-text>
                    <div v-if="!farms.length" class="text-center" style="padding-top:5%">
                        <v-row align="center" justify="center">
                            <v-col>
                                <v-img max-height="190" max-width="190" src="/icons/nodata.svg" class="img-center"></v-img>
                                <h5 class="mt-4 red--text">{{ $t("memberDataSection.noFarms") }}</h5>
                                <p class="text-caption black--text">
                                    {{ $t("memberDataSection.noFarms") }}
                                </p>
                            </v-col>
                        </v-row>
                    </div>

                    <div v-if="farms.length">
                        <v-data-table :headers="headers" :items="farms" hide-default-footer
                            :server-items-length="totalFarms" loading-text="Loading Farms...">
                            <template v-slot:top="{}">
                                <div class="d-flex mt-5">
                                    <v-text-field prepend-inner-icon="mdi-magnify" outlined height="5px"
                                        :placeholder="$t('search')" dense v-model="search"  @input="handleSearchByPharse"
                                        class="shrink"></v-text-field>

                                    <div class="d-inline-flex ml-3">
                                        <span class="title black--text text-no-wrap">{{ $t('status') }}</span>
                                        <v-select :items="farmStatusList" v-model="farmStatus" item-text="label"
                                            item-value="val" dense outlined class="shrink ml-2 wdt"
                                            :placeholder="$t('memberData.selectStatus')"  @change="handleSearchByStatus"></v-select>
                                    </div>

                                    <v-spacer></v-spacer>
                                    <v-btn color="primary" height="40" width="140" max-width="140" outlined class="mx-8"
                                        @click="downloadCsv" small>
                                        <v-img width="15px" src="/icons/pngfile.png"></v-img>
                                        <span class="ml-2">{{ $t('exportAsCSV') }}</span>
                                    </v-btn>
                                    <div class="py-1 title">
                                        {{ options.page }} - {{ totalPages }} {{ $t('of') }} {{ totalFarms }}
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
                            <template v-if="farms.length" v-slot:body="{ items }">
                                <tbody>
                                    <tr v-for="item in items" :key="item.id" style="position: relative; width: 0; height: 0">
                                        <td>
                                            {{ item.user ? item.user.firstName : '' }} {{ item.user ? item.user.lastName : '' }}
                                           <p class="mb-2">Farm Limit: {{ item.user ? item.user.farm_limit : '' }}</p>
                                        </td>

                                        <td> {{ item.user ? item.user.farm_limit_used : '' }} </td>

                                        <td> {{ item.user ? item.user.mobile : '' }}</td>

                                        <td> {{ item.area }} Acre</td>

                                        <td> {{ item.address }}</td>

                                        <td> {{ item.createdAt }}</td>

                                        <td>
                                            <v-btn
                                             rounded 
                                             color="themeGrey"
                                             @click="editFarm(item.id)"
                                             >
                                                Edit
                                            </v-btn>
                                        </td>

                                        <!-- <td class="text-center" v-if="item.user && item.status == 'pending'">
                                            <v-btn
                                             x-small 
                                             min-width="120" 
                                             rounded 
                                             color="themeGrey"
                                             @click="handleApprovedRejectDialog(item.id)"
                                             >
                                                {{ $t("memberDataSection.approveReject") }}
                                            </v-btn>
                                        </td>

                                        <td v-else-if="item.status == 'rejected'" class="text-center">
                                            <span class="reject-text-color">
                                                {{ $t('memberDataSection.rejected') }}
                                            </span>
                                        </td>

                                        <td v-else class="text-center">
                                            <span class="approved-text-color">
                                                {{ $t('memberDataSection.approved') }}
                                            </span>
                                        </td> -->
                                    </tr>
                                </tbody>
                            </template>
                            <template v-slot:footer></template>
                        </v-data-table>
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
    </div>
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import UserFarmRequest from "./components/UserFarmRequest.vue";
import UserFarmReject from "./components/UserFarmReject.vue";
import UserInformation from "./components/UserInformation.vue";
import DownloadMixin from "@/mixins/DownloadMixin"
import MemberDataService from "@/_services/MemberDataService";
import {mapGetters} from 'vuex'
import _ from 'lodash'

export default {
    created() {
       this.fetchFarmData()
    },
    components:{
        UserFarmRequest,
        UserFarmReject,
        UserInformation
    },
    computed:{
        ...mapGetters({
            farms : 'memberData/farms',
            totalFarms:'memberData/farmsCount'
        }),
        totalPages() {
            return this.totalFarms < this.options.limit ? 1 : Math.ceil(this.totalFarms / this.options.limit)
        }
    },
    data() {
        return {
            showFarmRequest:false,
            showFarmReject:false,
            showUserInformation:false,
            selectedFarmId: null,
            options: {
                limit:50,
                page:1,
                searchPhrase:'',
                status:'',
                orderType:'DESC'
            },
            search:'',
            farmLoading: false,
            farmStatusList: [
                { val: '', label: 'All' },
                { val: 'approved', label: 'Approved' },
                { val: 'rejected', label: 'Rejected' },
                { val: 'pending', label: 'Pending' }
            ],
            farmStatus: '',
            headers: [
                {
                    text: this.$t("farmName"),
                    align: "start",
                    value: "farmName",
                    class: "black--text",
                },
                {
                    text: this.$t("memberDataSection.farmerName"),
                    align: "start",
                    value: "name",
                    class: "black--text",
                },
                {
                    text: this.$t("memberDataSection.farmLimitUsed"),
                    value: "name",
                    class: "black--text",
                    sortable: true,
                },
                {
                    text: this.$t("memberDataSection.phoneNumber"),
                    align: "start",
                    value: "status",
                    class: "black--text",
                },
                {
                    text: this.$t("memberDataSection.farmSize"),
                    align: "start",
                    value: "status",
                    class: "black--text",
                },
                {
                    text: this.$t("memberDataSection.farmLocation"),
                    align: "start",
                    value: "status",
                    class: "black--text",
               },
                {
                    text: this.$t("memberDataSection.date"),
                    align: "start",
                    value: "status",
                    class: "black--text",
                },
                {
                    text: this.$t("memberDataSection.status"),
                    align: "start",
                    value: "status",
                    class: "black--text",
                },
            ],
            breadcrumbs: [
                {
                    text: this.$t("dashboard"),
                    disabled: false,
                    to: { name: "Users" },
                    exact: true,
                },
                {
                    text: this.$t("memberDataSection.farms"),
                    disabled: true,
                    href: "breadcrumbs_link_1",
                },
            ],
        };
    },
    methods: {
        fetchFarmData() {
            this.startLoading()
            this.$store.dispatch('memberData/getFarms', this.options)
            .then(()=>this.stopLoading()).catch(() => this.stopLoading())
        },
        handleSearchByPharse:_.debounce(function(){
            this.options.searchPhrase = this.search
            this.fetchFarmData()
        },1000),

        handleSearchByStatus:_.debounce(function(){
            this.options.status = this.farmStatus
            this.fetchFarmData()
        },1000),
        
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

        editFarm(farmId){
            this.$router.push({name:'EditFarms',params:{farmId}})
        },

        downloadCsv() { 
            const csvUrl = MemberDataService.DOWNLOAD_FARMS_CSV_URL
            const appendedQueryParam = new URLSearchParams(this.options)
            const url = `${csvUrl}?${appendedQueryParam}`
            this.startLoading()
            this.downloadSourceFile(url, "text/csv")
            .then(()=> {this.stopLoading()})
        },

        pageChange(t) {
            if (t){
                this.options.page = this.options.page + 1;
            } else {
                this.options.page = this.options.page - 1;
            }
            this.fetchFarmData()
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
  