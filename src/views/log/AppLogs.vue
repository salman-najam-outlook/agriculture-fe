<template>
    <div>

        <v-data-table :headers="headers" :items="logs" :items-per-page="10" :loading="loading"
            loading-text="Loading Data..." :page.sync="page" :search="searchPhrase">
            <template v-slot:top="{}">
                <div class="d-flex alight-center mt-5">
                    <v-text-field prepend-inner-icon="mdi-magnify" v-model="searchPhrase" @input="getLogs" outlined
                        dense hide-details class="mr-4" style="max-width:250px"></v-text-field>


                    <!-- <div class="black--text text-no-wrap ml-4 mt-2">Membership</div>    -->
                    <v-select :items="membershipType" v-model="membershipTypeVal" item-text="label" item-value="val"
                        dense outlined class="shrink ml-2 wdt" placeholder="Select Membership" @change="getLogs">
                    </v-select>
                    <v-spacer></v-spacer>
                    <v-menu 
                        v-model="appDateMenu" 
                        :close-on-content-click="false"
                        transition="scale-transition" 
                        min-width="auto"
                        left 
                        origin="top right">
                        <template v-slot:activator="{ on, attrs }">
  
                             <v-btn
                                v-bind="attrs" 
                                v-on="on" 
                                icon
                            >
                                <v-icon size="40" color="primary">mdi-calendar-month</v-icon>
                            </v-btn>
                        </template>
                        <v-date-picker v-model="logDates" range @input="closeDateMenu" :min="logDate3" :max="today" @change="getLogs">
                        </v-date-picker>
                    </v-menu>
                    <div class="py-1 ml-5 title">{{ from }} - {{ to }} {{ $t('of') }} {{ totalLogs }}</div>
                    <v-btn class="mx-2" fab small outlined color="primary" :disabled="page <= 1"
                        @click="pageChange(false)">
                        <v-icon dark>
                            mdi-chevron-left
                        </v-icon>
                    </v-btn>
                    <v-btn class="mx-2" fab small outlined color="primary" @click="pageChange(true)"
                        :disabled="page >= totalPages">
                        <v-icon dark>
                            mdi-chevron-right
                        </v-icon>
                    </v-btn>
                </div>
            </template>
            <template v-if="logs.length > 0" v-slot:body="{ items }">
                <tbody>
                    <tr v-for="item in items" :key="item.roleNumber" style="position: relative; width: 0; height: 0"
                        @mouseover="selectItem(item)" @mouseleave="selectItem(false)"
                        @click="showSingleLogDetails(item)">
                        <td> {{ item.time }} </td>
                        <td> {{ item.userName }} </td>
                        <td> {{ item.membership[0] }} </td>
                        <td> {{ item['terminalId/IP'] }} </td>
                        <td> {{ item.moduleAccessed }} </td>
                        <td> {{ $t(`perrmissions.${item.typeOfAccess.toLowercase()}`) }}</td>
                        <template v-if="getModulePermittedActions.get">
                            <div style="position: absolute; right: 10px; top:5px;" v-if="item === selectedItem">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn x-small fab v-bind="attrs" v-on="on" class="green-shadow"
                                            @click="showSingleLogDetails(item)">
                                            <v-icon>mdi-eye</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>{{ $t('logs.view') }}</span>
                                </v-tooltip>
                            </div>
                        </template>
                    </tr>
                </tbody>
            </template>
            <template v-slot:no-data v-if="logs.length < 1">
                NO LOG AVAILABLE
            </template>
            <template v-slot:footer></template>
        </v-data-table>
        <single-log v-if="showSingleLog" :log="sLog" @closeLogModal="closeSingleLog" :dialogU="showSingleLog">
        </single-log>
    </div>
</template>
<script>
import moment from "moment";
import PermissionsMixin from "@/mixins/PermissionsMixin"
import getPermittedActions from "@/mixins/GetPermittedActions";
import loadingMixin from "@/mixins/LoadingMixin"
import LogsService from '@/_services/LogsService'
import SingleLog from "./SingleLog.vue"
import store from "../../store";

export default {
    components: {
        SingleLog,
    },
    async created() {
        let date = new Date();
        let firstDayYYYYMMDD = moment(new Date(date.getFullYear(), date.getMonth(), 1)).format("DD-MMM-YYYY")
        let todayYYYYMMDD = moment(date).format("DD-MMM-YYYY")
        this.logDates = [firstDayYYYYMMDD, todayYYYYMMDD]
        const fetchData = async () => {
            await this.getMembershipType()
            await this.getLogs()
        }
        await fetchData()
    },
    data() {
        return {
            loading: false,
            page: 1,
            logs: [],
            logDates: [],
            searchPhrase: '',
            appDateMenu: false,
            today: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
            logDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
            logDate3: new Date((Date.now() - new Date().getTimezoneOffset() * 60000) - 7889400000).toISOString().substr(0, 10),
            newLogDate: null,
            membershipTypeVal: null,
            membershipType: [],
            totalPages: 1,
            selectedItem: false,
            showSingleLog: false,
            sLog: {},
            from: 0,
            to: 0,
            totalLogs: 0,
            headers: [
                {
                    text: this.$t('logs.time'),
                    align: 'start',
                    value: 'message.time',
                    class: "black--text"
                },
                { text: this.$t('logs.username'), value: 'message.userName', class: "black--text" },
                { text: this.$t('logs.membershipType'), value: 'message.membership[0]', class: "black--text" },
                { text: this.$t('logs.terminalID'), sortable: false, align: 'start', value: 'status', class: "black--text" },
                { text: this.$t('logs.moduleAccessed'), align: 'start', value: 'message.moduleAccessed', class: "black--text" },
                { text: this.$t('logs.typeOfAccess'), align: 'start', value: 'message.typeOfAccess', class: "black--text" },
            ],
        }
    },
    methods: {
        closeDateMenu(ev) {
            if(ev.length == 2) {
                this.appDateMenu = false
            }
        },
        getLogs() {
            this.loading = true;
            console.log("logDates", this.logDates)
            const date1 = new Date(this.logDates[0]).getTime();
            const date2 = new Date(this.logDates[1]).getTime();
            let dateDiff = null;
            let date_1 = null;
            let date_2 = null;
            if(date1 > date2){
                dateDiff = date1 - date2;
                date_1 = this.logDates[1]
                date_2 = this.logDates[0]
            }else{
                dateDiff = date2 - date1
                date_2 = this.logDates[1]
                date_1 = this.logDates[0]
            }
            const daydiff = dateDiff / (1000 * 60 * 60 * 24);
            if (daydiff < 1) {
                this.$notify({
                    title: "select one day earlier logs",
                    type: "error",
                });
            }else if (daydiff > 92) {
                this.$notify({
                    title: "Cannot see logs before 3 months",
                    type: "error",
                });
            }else {
                // this.newLogDate = this.logDate+"_activity_log.log";
                this.newLogDate = date_1 + "/" + date_2
                //let user = localStorage.getItem('user')
                //let userData = JSON.parse(user)
                //let org_id = userData.user_organization.id
                let user = store.getters.getUser
                let org_id = user.user_organization.id
                LogsService.getLogs(this.newLogDate, this.selectedUserType, this.membershipTypeVal, this.searchPhrase, org_id)
                // LogsService.getLogs(this.newLogDate, this.searchPhrase, org_id)
                    .then(response => {
                        if (response.success) {
                            var logs = [];
                            if (response.data.response.userLogs.length > 0) {
                                response.data.response.userLogs.forEach(log => {
                                    logs.push(log);
                                })
                            }
                            this.logs = logs;
                            this.totalLogs = this.logs.length
                            this.totalPages = Math.ceil(this.totalLogs / 10)

                            this.setPages()
                        } else {
                            this.logs = [];
                        }

                        this.loading = false
                    })
                    .catch(error => {
                        console.log(error)
                        this.logs = [];
                        this.loading = false
                    })

            }
        },
        async getMembershipType() {
            const res = await this.getAllMembershipType()
            this.membershipType = res.map(item => ({
                'val': item.id,
                'label': item.membership_type
            }))
            if (this.membershipTypeVal == null)
                this.membershipTypeVal = this.membershipType[0]
        },
        selectItem(item) {
            this.selectedItem = item
        },
        pageChange(t) {
            if (this.page > this.totalPages) {
                this.page = this.totalPages
                return;
            }
            if (t)
                this.page = this.page + 1
            else
                this.page = this.page - 1

            this.setPages();

        },
        showSingleLogDetails(log) {
            this.sLog = log;
            this.showSingleLog = true;
        },
        closeSingleLog() {
            this.sLog = {}
            this.showSingleLog = false;
        },
        setPages() {
            if (this.totalLogs < 1) {
                this.from = 0;
                this.to = 0;
                return
            }
            var s = this.totalLogs % 10;
            var t = (this.page * 10)

            if (t > this.totalLogs) {
                this.to = this.totalLogs;
                this.from = this.to - (s - 1);
            } else {
                this.to = t;
                this.from = this.to - 9;
            }
        }
    },
    props: {
        selectedUserType: {
            required: true
        }
    },
    mixins: [PermissionsMixin, loadingMixin, getPermittedActions]
}
</script>

<style lang="scss" scoped>
::v-deep .theme--light.v-icon:focus::after {
    opacity: 0;
}
</style>
