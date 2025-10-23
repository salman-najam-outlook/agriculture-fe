<template>
    <div class="px-4">
        <breadcrumb :items="breadcrumbs"></breadcrumb> 
        <v-row class="align-center">
            <v-col cols="12" md="6" class="d-flex align-center">
                <h2 class="mb-0">{{ $t('dashboard') }}</h2>
            </v-col>
            <v-col cols="12" md="6" class="d-flex justify-end align-center gap-2">
                <v-menu
                    ref="datePickerMenu"
                    v-model="datePickerMenu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                    >
                    <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        append-icon="mdi-calendar"
                        :value="targetYears.join(' - ')"
                        placeholder="Select Year"
                        dense
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        outlined
                        hide-details="auto"
                        style="max-width: 160px; margin-right: 8px;"
                    ></v-text-field>
                    </template>
                    <v-date-picker
                        no-title
                        class="target-year-date-picker"
                        type="month"
                        ref="datePicker"
                        v-model="selectedYear"
                        :active-picker.sync="activePicker"
                        @change="changeSelectedYear"
                        range
                        @click:year="yearSelected"
                        :min="`${minTargetYear}-01-01`"
                        :max="`${maxTargetYear}-12-31`"
                    ></v-date-picker>
                </v-menu>
                <v-btn color="primary" @click="$router.push({ name: 'esgAccountDashboard' })">
                    {{ $t('back') }}
                </v-btn>
            </v-col>
        </v-row>
        <ProtocolCard v-if="protocol" :protocol="protocol" :progressData="progressData" />
        <EsgChart v-if="!isSubEnterprise" :targetYears="targetYears" />

        <v-card class="mt-4" elevation="0">
            <v-card-title>
                <span v-if="!isSubEnterprise">{{ this.getUser?.user_organization?.name }} Company </span> 
                <span v-else>Overall Progress</span>
                <v-spacer></v-spacer>
                <v-btn v-if="!isSubEnterprise" color="primary" @click="navigateToProgressByGoals">{{ $t('esgPlatform.viewProgressByGoal') }}</v-btn>
            </v-card-title>

            <v-card-text>
                <v-row align="center">
                    <v-col cols="12" sm="3">
                        <v-text-field dense prepend-inner-icon="mdi-magnify" v-model="searchText" @input="handleSearchText" outlined :placeholder="$t('search')"></v-text-field>
                    </v-col>
                    <v-col v-if="isSubEnterprise" cols="12" sm="2">
                        <v-select
                            v-model="selectedType"
                            :items="typeItems"
                            outlined
                            dense
                            label="Type"
                        ></v-select>
                    </v-col>
                    <v-col :cols="12" :sm="isSubEnterprise ? 7 : 8" class="d-flex align-center justify-end gap-15">
                        <div>
                           <label class="font-weight-bold mr-2">Overall Progress</label>
                            <v-text-field
                                dense
                                outlined
                                readonly
                                class="mr-2"
                                @click="openFilterDialog(0)"
                                :value="`${filterRanges[0].range[0]}% - ${filterRanges[0].range[1]}%`"
                             ></v-text-field>
                        </div>
                        <div>
                            <label class="font-weight-bold mr-2">Environmental Progress</label>
                            <v-text-field
                            dense
                            outlined
                            readonly
                            class="mr-2"
                            @click="openFilterDialog(1)"
                            :value="`${filterRanges[1].range[0]}% - ${filterRanges[1].range[1]}%`"
                            ></v-text-field>
                        </div>
                        <div>
                            <label class="font-weight-bold mr-2">Social Progress</label>
                                <v-text-field
                                dense
                                outlined
                                readonly
                                @click="openFilterDialog(2)"
                                :value="`${filterRanges[2].range[0]}% - ${filterRanges[2].range[1]}%`"
                            ></v-text-field>
                        </div>
                        
                        <div>
                            <label class="font-weight-bold mr-2">Governance Progress</label>
                            <v-text-field
                                dense
                                outlined
                                readonly
                                @click="openFilterDialog(3)"
                                :value="`${filterRanges[3].range[0]}% - ${filterRanges[3].range[1]}%`"
                             ></v-text-field>
                        </div>
                        
                    </v-col>
                </v-row>

                <template v-if="isSubEnterprise">
                    <v-data-table :headers="subEnterpriseHeaders" :items="isSubEnterpriseItems" :items-per-page="5" hide-default-footer>
                        <template v-slot:item.name="{ item }">
                            {{ item.name }}
                        </template>
                        <template v-slot:item.type="{ item }">
                            <span>{{ item.type }}</span>
                        </template>
                        <template v-slot:item.environmental="{ item }">
                            <div class="d-flex align-center">
                                <v-progress-linear :value="item.environmental" height="10" rounded
                                    :color="getProgressColor(item.environmental)" class="mr-2"></v-progress-linear>
                                <span>{{ item.environmental }}%</span>
                            </div>
                        </template>
                        <template v-slot:item.social="{ item }">
                            <div class="d-flex align-center">
                                <template v-if="!item.social_na">
                                    <v-progress-linear :value="item.social" height="10" :color="getProgressColor(item.social)"
                                        rounded class="mr-2"></v-progress-linear>
                                    <span>{{ item.social }}%</span>
                                </template>
                                <span v-else>N/A</span>
                            </div>
                        </template>
                        <template v-slot:item.governance="{ item }">
                            <div class="d-flex align-center">
                                <v-progress-linear :value="item.governance" height="10"
                                    :color="getProgressColor(item.governance)" class="mr-2" rounded></v-progress-linear>
                                <span>{{ item.governance }}%</span>
                            </div>
                        </template>
                        <template v-slot:item.overallProgress="{ item }">
                            <div class="d-flex align-center">
                                <v-progress-linear :value="item.overallProgress" height="10"
                                    :color="getProgressColor(item.overallProgress)" class="mr-2"
                                    rounded></v-progress-linear>
                                <span>{{ item.overallProgress }}%</span>
                            </div>
                        </template>
                        <template v-slot:item.status="{ item }">
                            <v-btn small rounded min-width="150" depressed class="gray-button" height="34"
                                v-if="item.status === 'Pending'">
                                {{ item.status }}
                            </v-btn>
                            <v-btn small rounded min-width="150" depressed class="green-button" height="34"
                                v-if="item.status === 'Approved'">
                                {{ item.status }}
                            </v-btn>
                        </template>
                        <template v-slot:item.actions="{ item }">
                            <v-btn
                            x-small
                            fab
                            v-bind="attrs"
                            v-on="on"
                            color="primary"
                            outlined
                            :to="{ name: 'ProtocolDetailsOfSubOrganization', params: { id: protocolId, subOrganizationId: item.id } }"
                            >
                                <v-icon>mdi-eye</v-icon>
                            </v-btn>
                        </template>
                    </v-data-table>
                </template>
                <template v-else>
                    <v-data-table 
                    :headers="headers" 
                    :items="items"
                    :items-per-page="5" 
                    :loading-text="$t('loadingData')"
                    :loading="subOrgLoading"
                    hide-default-footer>
                    <template v-slot:item.key="{ item }">
                        {{ item.key + 1 }}
                    </template>
                    <template v-slot:item.name="{ item }">
                        {{ item.name }}
                    </template>

                    <template v-slot:item.environmental="{ item }">
                        <div class="d-flex align-center">
                            <v-progress-linear :value="item.environmental" height="10" rounded
                                :color="getProgressColor(item.environmental)" class="mr-2"></v-progress-linear>
                            <span>{{ item.environmental }}%</span>
                        </div>
                    </template>
                    <template v-slot:item.social="{ item }">
                        <div class="d-flex align-center">
                            <template v-if="!item.social_na">
                                <v-progress-linear :value="item.social" height="10" :color="getProgressColor(item.social)"
                                    rounded class="mr-2"></v-progress-linear>
                                <span>{{ item.social }}%</span>
                            </template>
                            <span v-else>N/A</span>
                        </div>
                    </template>
                    <template v-slot:item.governance="{ item }">
                        <div class="d-flex align-center">
                            <v-progress-linear :value="item.governance" height="10"
                                :color="getProgressColor(item.governance)" class="mr-2" rounded></v-progress-linear>
                            <span>{{ item.governance }}%</span>
                        </div>
                    </template>
                    <template v-slot:item.overallProgress="{ item }">
                        <div class="d-flex align-center">
                            <v-progress-linear :value="item.overallProgress" height="10"
                                :color="getProgressColor(item.overallProgress)" class="mr-2"
                                rounded></v-progress-linear>
                            <span>{{ item.overallProgress }}%</span>
                        </div>
                    </template>
                    <template v-slot:item.status="{ item }">
                        <v-btn small rounded min-width="150" depressed class="gray-button" height="34"
                            v-if="item.status === 'Pending'">
                            {{ item.status }}
                        </v-btn>
                        <v-btn small rounded min-width="150" depressed class="green-button" height="34"
                            v-if="item.status === 'Approved'">
                            {{ item.status }}
                        </v-btn>
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-btn
                        x-small
                        fab
                        color="primary"
                        outlined
                        :to="{ name: 'ProtocolDetailsOfSubOrganization', params: { id: protocolId, subOrganizationId: item.id } }"
                        >
                            <v-icon>mdi-eye</v-icon>
                        </v-btn>
                    </template>
                </v-data-table>
                </template>
                <FilterDialog :dialog="showFilterDialog" :filters="filterRanges" @apply="applyTableFilters" @close="closeFilterDialog" />
                <UpdateStatus :dialog="false" />
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import ProtocolCard from "./ProtocolCard.vue";
import EsgChart from "./EsgChart.vue";
import FilterDialog from "./FilterDialog.vue";
import UpdateStatus from "./UpdateStatus.vue";
import EsgService from "@/_services/EsgService";
import { mapGetters } from 'vuex';
import _ from 'lodash';
import LoadingMixin from "@/mixins/LoadingMixin";
import moment from 'moment';

export default {
    components: {
        ProtocolCard,
        FilterDialog,
        EsgChart,
        UpdateStatus
    },
    data() {
        return {
            activePicker: 'YEAR',
            datePickerMenu: false,
            breadcrumbs: [
                { text: this.$t('esgPlatform.esgPlatform'), disabled: false },
                { text: this.$t('dashboard'), disabled: false },
                { text: this.$t('esgPlatform.protocolDetails'), disabled: false },
            ],
            searchText: '',
            originalItems: [],
            protocolId: this.$route.params.id,
            showFilterDialog: false,
            selectedFilterIndex: null,
            tempRange: [0, 100],
            subOrgLoading:true,
            protocol:{},
            filterRanges: [
                { labelName: 'ESG Progress', range: [0, 100], color: 'green' },
                { labelName: 'Environmental', range: [0, 100], color: 'green' },
                { labelName: 'Social', range: [0, 100], color: 'blue' },
                { labelName: 'Governance', range: [0, 100], color: 'amber' }
            ],
            headers: [
                {text: 'S.N.', value:'key'},
                { text: 'Sub-Organization', value: 'name' },
                { text: 'Environmental', value: 'environmental' },
                { text: 'Social', value: 'social' },
                { text: 'Governance', value: 'governance' },
                { text: 'Overall Progress', value: 'overallProgress' },
                { text: 'Status', value: 'status', align: 'center', sortable: false },
                { text: 'Actions', value: 'actions', sortable: false, align: 'center' },
            ],
            subEnterpriseHeaders: [
                { text: 'Name', value: 'name', align: 'start' },
                { text: 'Type', value: 'type' },
                { text: 'Environmental', value: 'environmental' },
                { text: 'Social', value: 'social' },
                { text: 'Governance', value: 'governance' },
                { text: 'Overall Progress', value: 'overallProgress' },
                { text: 'Actions', value: 'actions', sortable: false, align: 'end' }
            ],
            isSubEnterpriseItems: [
            ],
            items: [],
            selectedType: 'All',
            typeItems: ['All', 'Own', 'Farmer', 'Supplier'],
            progress: null,
            selectedYear: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
            progressData: {
                overallProgress: 0,
                environmentalProgress: 0,
                socialProgress: 0,
                governanceProgress: 0
            },
        };
    },
    async mounted() {
        await this.getProtocolDetails();
        await this.getProtocolProgress();
    },
    watch: {
        datePickerMenu(val) {
            val && setTimeout(() => (this.activePicker = 'YEAR'))
        },
    },
    computed: {
        targetYears() {
            return this.selectedYear.map(date => moment(date).year()).sort((a, b) => a - b);
        },
        getDialogTitle() {
            return this.selectedFilterIndex !== null 
                ? `Set ${this.filterRanges[this.selectedFilterIndex].labelName} Range`
                : 'Set Range';
        },

        getSliderColor() {
            return this.selectedFilterIndex !== null 
                ? this.filterRanges[this.selectedFilterIndex].color
                : 'primary';
        },
        minTargetYear() {
            if(!this.protocol) return moment().year();

            let minTargetYear = Infinity;
            this.protocol.esgIssues?.forEach(issue => {
                if(Array.isArray(issue.esgGoals)) {
                    issue.esgGoals.forEach(goal => {
                        minTargetYear = Math.min(minTargetYear, goal.targetYears);
                    });
                }
            });
            if(minTargetYear === Infinity) minTargetYear = moment().year();
            const protocolStartYear = this.protocol.startYear || minTargetYear;
            return Math.min(minTargetYear, protocolStartYear);
        },
        maxTargetYear() {
            if(!this.protocol) return moment().year();

            let maxTargetYear = -Infinity;
            this.protocol.esgIssues?.forEach(issue => {
                if(Array.isArray(issue.esgGoals)) {
                    issue.esgGoals.forEach(goal => {
                        maxTargetYear = Math.max(maxTargetYear, goal.targetYears);
                    });
                }
            });
            if(maxTargetYear === -Infinity) maxTargetYear = moment().year();
            const protocolDeadlineYear = this.protocol.deadlineYear || maxTargetYear;
            return Math.max(maxTargetYear, protocolDeadlineYear);
        },
        ...mapGetters(['isSubEnterprise','getUser']),
    },
    methods: {
        async changeSelectedYear(date) {
            this.$refs.datePickerMenu.save(date);
            await this.getProtocolDetails();
            await this.getProtocolProgress();
        },

        yearSelected(year) {
            setTimeout(() => {
                this.$refs.datePicker.monthClick(`${year}-01`);
                this.activePicker = 'YEAR';
            });
        },

        async getProtocolProgress(){
            this.startLoading();
            await EsgService.getProtocolProgress(this.protocolId, {
                startTargetYear: this.targetYears[0],
                endTargetYear: this.targetYears[1],
            }).then(response => {
                this.progressData = response.data ? response.data : {
                    overallProgress: response.data?.Overall || 0,
                    environmentalProgress: response.data?.Environmental || 0,
                    socialProgress: response.data?.Social || 0,
                    governanceProgress: response.data?.Governance || 0
                }
            }).catch(error => {
                console.error("Error fetching protocol progress:", error);
            }).finally(() => {
                this.stopLoading();
            });
        },

        handleSearchText:_.debounce(function() {
            this.subOrgLoading = true;
            if (this.searchText === '') {
                this.items = [...this.originalItems];
                return;
            }
            this.items = this.items.filter(item => {
                return item.name.toLowerCase().includes(this.searchText.toLowerCase());
            });
            this.subOrgLoading = false;
        }, 1000),
        
        getSubEnterpriseName() {
            // const user = JSON.parse(localStorage.getItem('user'));
            const user = this.getUser;
            return user?.user_organization?.name || '';
        },
        async getProtocolDetails() {
            EsgService.getEsgStandardDetails(this.protocolId).then(response => {
                this.protocol = response.data;
                const orgIds = response?.data?.subOrganizations?.map(item => item.id);

                if (!this.isSubEnterprise) {
                    EsgService.getTypeWiseProgressBySubOrganizationId({
                        subOrganizationIds: orgIds,
                        esgProtocolId: this.protocol?.id,
                        startTargetYear: this.targetYears[0],
                        endTargetYear: this.targetYears[1],
                    }).then(response2 => {
                        this.items = response?.data?.subOrganizations?.map((item, index) => {
                            const progressObj = response2?.data?.find(item2 => item2.subOrganizationId === item.id);
                            const typeWiseProgress = (type) => {
                                const a = progressObj?.progress.find(item => item.type === type);
                                return a ? a.progress : 0;
                            };
                            return {
                                key: index + 1,
                                id: item.id,
                                name: item.name,
                                environmental: typeWiseProgress('Environmental'),
                                social: typeWiseProgress('Social'),
                                governance: typeWiseProgress('Governance'),
                                overallProgress: typeWiseProgress('Overall'),
                                status: "Pending"
                            }
                        });
                        this.subOrgLoading = false;
                        this.originalItems = [...this.items];
                    });
                } else {
                    EsgService.getTypeWiseProgressBySubOrganizationId({
                        subOrganizationIds: orgIds,
                        esgProtocolId: this.protocol?.id,
                        startTargetYear: this.targetYears[0],
                        endTargetYear: this.targetYears[1],
                    }).then(response2 => {
                        const progressObj = response2?.data?.[0];
                        if (progressObj) {
                            const userSubOrg = response?.data?.subOrganizations?.find(item => item.id === progressObj.subOrganizationId);
                            const typeWiseProgress = (type) => {
                                const a = progressObj?.progress.find(item => item.type === type);
                                return a ? a.progress : 0;
                            };
                            this.isSubEnterpriseItems = [{
                                key: 1,
                                id: progressObj.subOrganizationId,
                                name: userSubOrg ? userSubOrg.name : 'N/A',
                                environmental: typeWiseProgress('Environmental'),
                                social: typeWiseProgress('Social'),
                                governance: typeWiseProgress('Governance'),
                                overallProgress: typeWiseProgress('Overall'),
                                status: "Pending"
                            }];
                        } else {
                            this.isSubEnterpriseItems = [];
                        }
                        this.subOrgLoading = false;
                        this.originalItems = [...this.isSubEnterpriseItems];
                    });
                }
            }).catch(error => {
                console.error("Error fetching Sustainability Guide details:", error);
            });
        },
        navigateToProgressByGoals() {
            this.$router.push({
                name: 'ProgressByGoals',
                params: { id: this.protocolId }
            });
        },
        getProgressColor(value) {
            if (value >= 75) return 'success';
            if (value >= 50) return 'warning';
            return 'error';
        },
        getStatusColor(status) {
            if (status === 'Pending') return 'orange';
            if (status === 'Approved') return 'green';
            return 'red';
        },
        openFilterDialog(index) {
            this.selectedFilterIndex = index;
            this.tempRange = [...this.filterRanges[index].range];
            this.showFilterDialog = true;
        },
        closeFilterDialog() {
            this.showFilterDialog = false;
            this.selectedFilterIndex = null;
            this.tempRange = [0, 100];
        },
        applyFilter() {
            if (this.selectedFilterIndex !== null) {
                const min = Math.max(0, Math.min(this.tempRange[0], 100));
                const max = Math.max(0, Math.min(this.tempRange[1], 100));
                
                this.filterRanges[this.selectedFilterIndex].range = [min, max];
                
                this.$emit('range-changed', {
                    index: this.selectedFilterIndex,
                    range: [min, max]
                });
            }
            this.closeFilterDialog();
        },
        applyTableFilters(filters) {
            this.items = this.originalItems.filter(item => {
                const environmental = item.environmental >= filters[1].range[0] && item.environmental <= filters[1].range[1];
                const social = item.social >= filters[2].range[0] && item.social <= filters[2].range[1];
                const governance = item.governance >= filters[3].range[0] && item.governance <= filters[3].range[1];
                const overallProgress = item.overallProgress >= filters[0].range[0] && item.overallProgress <= filters[0].range[1];

                return environmental && social && governance && overallProgress;
            });
            this.filterRanges = filters;
            this.showFilterDialog = false;
        },
        getSocialValue(item) {
            return item.social_na ? 'N/A' : `${item.social}%`;
        }
    },
    mixins: [LoadingMixin]
}
</script>

<style scoped>
.gap-15{
    gap: 15px;
}
.v-text-field {
    cursor: pointer;
}

.v-text-field ::v-deep .v-input__slot {
    cursor: pointer;
}

/* Optional: Disable text selection on the input */
.v-text-field ::v-deep input {
    cursor: pointer;
    user-select: none;
}

.v-data-table ::v-deep .v-data-table__wrapper {
    overflow-x: auto;
}

.v-progress-linear {
    min-width: 100px;
}

.v-text-field ::v-deep .v-text-field__details{
    display: none;
}
</style>

<style>
.target-year-date-picker .v-date-picker-years {
    height: auto;
}
.target-year-date-picker .v-picker__body {
    max-width: 160px;
}
.target-year-date-picker .v-date-picker-years li.active {
    font-size: 20px;
    font-weight: 700;
}
</style>