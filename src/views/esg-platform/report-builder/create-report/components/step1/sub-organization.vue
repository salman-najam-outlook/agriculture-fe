<template>
    <div class="px-4">
        <v-card class="" elevation="0">
            <v-card-title>
                <span v-if="!isSubEnterprise">{{ this.getUser?.user_organization?.name }} Company </span>
                <span v-else>Overall Progress</span>
                <v-spacer></v-spacer>
                <v-btn v-if="!isSubEnterprise" color="primary" @click="navigateToProgressByGoals">{{
                    $t('esgPlatform.viewProgressByGoal') }}</v-btn>
            </v-card-title>

            <v-card-text>
                <v-row align="center">
                    <v-col cols="12" sm="3">
                        <v-text-field dense prepend-inner-icon="mdi-magnify" v-model="searchText"
                            @input="handleSearchText" outlined :placeholder="$t('search')"></v-text-field>
                    </v-col>
                    <v-col v-if="isSubEnterprise" cols="12" sm="2">
                        <v-select v-model="selectedType" :items="typeItems" outlined dense label="Type"></v-select>
                    </v-col>
                    <v-col :cols="12" :sm="isSubEnterprise ? 7 : 8" class="d-flex align-center justify-end gap-15">
                        <div>
                            <label class="font-weight-bold mr-2">Overall Progress</label>
                            <v-text-field dense outlined readonly class="mr-2" @click="openFilterDialog(0)"
                                :value="`${filterRanges[0].range[0]}% - ${filterRanges[0].range[1]}%`"></v-text-field>
                        </div>
                        <div>
                            <label class="font-weight-bold mr-2">Environmental Progress</label>
                            <v-text-field dense outlined readonly class="mr-2" @click="openFilterDialog(1)"
                                :value="`${filterRanges[1].range[0]}% - ${filterRanges[1].range[1]}%`"></v-text-field>
                        </div>
                        <div>
                            <label class="font-weight-bold mr-2">Social Progress</label>
                            <v-text-field dense outlined readonly @click="openFilterDialog(2)"
                                :value="`${filterRanges[2].range[0]}% - ${filterRanges[2].range[1]}%`"></v-text-field>
                        </div>

                        <div>
                            <label class="font-weight-bold mr-2">Governance Progress</label>
                            <v-text-field dense outlined readonly @click="openFilterDialog(3)"
                                :value="`${filterRanges[3].range[0]}% - ${filterRanges[3].range[1]}%`"></v-text-field>
                        </div>

                    </v-col>
                </v-row>

                <template v-if="isSubEnterprise">
                    <v-data-table :headers="subEnterpriseHeaders" :items="isSubEnterpriseItems" :items-per-page="5"
                        hide-default-footer>
                        <template v-slot:header.selected="">
                            <v-checkbox 
                                v-model="selectAll" 
                                @change="toggleSelectAll"
                                :indeterminate="isIndeterminate"
                                hide-details
                                class="mb-2 text-white"
                            ></v-checkbox>
                        </template>
                        <template v-slot:item.selected="{ item }">
                            <v-checkbox v-model="item.selected" @change="handleSelectionChange"></v-checkbox>
                        </template>
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
                                    <v-progress-linear :value="item.social" height="10"
                                        :color="getProgressColor(item.social)" rounded class="mr-2"></v-progress-linear>
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
                        <template v-slot:item.actions="{ item }">
                            <v-btn x-small fab color="primary" outlined
                                :to="{ name: 'ProtocolDetailsOfSubOrganization', params: { id: protocolId, subOrganizationId: item.id } }">
                                <v-icon>mdi-eye</v-icon>
                            </v-btn>
                        </template>
                    </v-data-table>
                </template>
                <template v-else>
                    <v-data-table :headers="headers" :items="items" :items-per-page="5"
                        :loading-text="$t('loadingData')" :loading="subOrgLoading" hide-default-footer>
                        <template v-slot:header.selected="" >
                            <v-checkbox 
                                v-model="selectAll" 
                                @change="toggleSelectAll"
                                :indeterminate="isIndeterminate"
                                hide-details
                                  class="pb-4 text-white"
                            ></v-checkbox>
                        </template>
                        <template v-slot:item.selected="{ item }">
                            <v-checkbox v-model="item.selected" @change="handleSelectionChange"></v-checkbox>
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
                                    <v-progress-linear :value="item.social" height="10"
                                        :color="getProgressColor(item.social)" rounded class="mr-2"></v-progress-linear>
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
                            <v-btn x-small fab color="primary" outlined
                                :to="{ name: 'ProtocolDetailsOfSubOrganization', params: { id: protocolId, subOrganizationId: item.id } }">
                                <v-icon>mdi-eye</v-icon>
                            </v-btn>
                        </template>
                    </v-data-table>
                </template>
                <FilterDialog :dialog="showFilterDialog" :filters="filterRanges" @apply="applyTableFilters"
                    @close="closeFilterDialog" />
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import FilterDialog from "@/views/esg-platform/dashboard/components/protocol/FilterDialog.vue";
import EsgService from "@/_services/EsgService";
import { mapGetters } from 'vuex';
import _ from 'lodash';
import LoadingMixin from "@/mixins/LoadingMixin";

export default {
    components: {
        FilterDialog
    },
    props: {
        subOrgs: {
            type: Array,
            default: () => []
        },
        protocolId: {
            type: [String, Number],
            default: null
        },
    },
    data() {
        return {
            searchText: '',
            originalItems: [],
            showFilterDialog: false,
            selectedFilterIndex: null,
            tempRange: [0, 100],
            subOrgLoading: true,
            protocol: {},
            filterRanges: [
                { labelName: 'ESG Progress', range: [0, 100], color: 'green' },
                { labelName: 'Environmental', range: [0, 100], color: 'green' },
                { labelName: 'Social', range: [0, 100], color: 'blue' },
                { labelName: 'Governance', range: [0, 100], color: 'amber' }
            ],
            headers: [
                { text: '', value: 'selected', sortable: false, width: '50px' },
                { text: 'Sub-Organization', value: 'name' },
                { text: 'Environmental', value: 'environmental' },
                { text: 'Social', value: 'social' },
                { text: 'Governance', value: 'governance' },
                { text: 'Overall Progress', value: 'overallProgress' },
                { text: 'Status', value: 'status', align: 'center', sortable: false },
                { text: 'Actions', value: 'actions', sortable: false, align: 'center' },
            ],
            subEnterpriseHeaders: [
                { text: '', value: 'selected', sortable: false, width: '50px' },
                { text: 'Name', value: 'name', align: 'start' },
                { text: 'Type', value: 'type' },
                { text: 'Environmental', value: 'environmental' },
                { text: 'Social', value: 'social' },
                { text: 'Governance', value: 'governance' },
                { text: 'Overall Progress', value: 'overallProgress' },
                { text: 'Actions', value: 'actions', sortable: false, align: 'end' }
            ],
            isSubEnterpriseItems: [],
            items: [],
            selectedType: 'All',
            typeItems: ['All', 'Own', 'Farmer', 'Supplier'],
            selectAll: false,
        };
    },
    watch: {
        protocolId: {
            handler(newId) {
                if (newId) {
                    this.getProtocolDetails();
                }
            },
            immediate: true
        }
    },
    computed: {
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
        selectedSubOrganizationIds() {
            const selectedItems = this.isSubEnterprise ? this.isSubEnterpriseItems : this.items;
            return selectedItems.filter(item => item.selected).map(item => item.id);
        },
        // Computed property to determine if checkbox should be in indeterminate state
        isIndeterminate() {
            const currentItems = this.isSubEnterprise ? this.isSubEnterpriseItems : this.items;
            const selectedCount = currentItems.filter(item => item.selected).length;
            return selectedCount > 0 && selectedCount < currentItems.length;
        },
        
        // Watch for changes in selection to update selectAll state
        allSelected() {
            const currentItems = this.isSubEnterprise ? this.isSubEnterpriseItems : this.items;
            return currentItems.length > 0 && currentItems.every(item => item.selected);
        },
        ...mapGetters(['isSubEnterprise', 'getUser']),
    },
    methods: {
        handleSelectionChange() {
            // Update the selectAll state based on current selections
            this.updateSelectAllState();

            // Emit the selected IDs to parent component
            this.$emit('update:sub-orgs', this.selectedSubOrganizationIds);
        },

        handleSearchText: _.debounce(function () {
            this.subOrgLoading = true;
            if (this.searchText === '') {
                this.items = [...this.originalItems];
                this.subOrgLoading = false;
                return;
            }
            this.items = this.originalItems.filter(item => {
                return item.name.toLowerCase().includes(this.searchText.toLowerCase());
            });
            this.subOrgLoading = false;
        }, 1000),

        async getProtocolDetails() {
            if (!this.protocolId) {
                console.log('No protocol ID provided');
                this.subOrgLoading = false;
                return;
            }

            this.subOrgLoading = true;
            try {
                const response = await EsgService.getEsgStandardDetails(this.protocolId);
                this.protocol = response.data;
                const orgIds = response?.data?.subOrganizations?.map(item => item.id);

                if (!this.isSubEnterprise) {
                    const response2 = await EsgService.getTypeWiseProgressBySubOrganizationId({
                        subOrganizationIds: orgIds,
                        esgProtocolId: this.protocol?.id
                    });

                    this.items = response?.data?.subOrganizations?.map((item) => {
                        const progressObj = response2?.data?.find(item2 => item2.subOrganizationId === item.id);
                        const typeWiseProgress = (type) => {
                            const a = progressObj?.progress.find(item => item.type === type);
                            return a ? a.progress : 0;
                        };
                        return {
                            id: item.id,
                            name: item.name,
                            environmental: typeWiseProgress('Environmental'),
                            social: typeWiseProgress('Social'),
                            governance: typeWiseProgress('Governance'),
                            overallProgress: typeWiseProgress('Overall'),
                            status: "Pending",
                            selected: false // Add checkbox state
                        }
                    });
                    this.originalItems = [...this.items];
                } else {
                    const response2 = await EsgService.getTypeWiseProgressBySubOrganizationId({
                        subOrganizationIds: orgIds,
                        esgProtocolId: this.protocol?.id
                    });

                    const progressObj = response2?.data?.[0];
                    if (progressObj) {
                        const userSubOrg = response?.data?.subOrganizations?.find(item => item.id === progressObj.subOrganizationId);
                        const typeWiseProgress = (type) => {
                            const a = progressObj?.progress.find(item => item.type === type);
                            return a ? a.progress : 0;
                        };
                        this.isSubEnterpriseItems = [{
                            id: progressObj.subOrganizationId,
                            name: userSubOrg ? userSubOrg.name : 'N/A',
                            environmental: typeWiseProgress('Environmental'),
                            social: typeWiseProgress('Social'),
                            governance: typeWiseProgress('Governance'),
                            overallProgress: typeWiseProgress('Overall'),
                            status: "Pending",
                            selected: false // Add checkbox state
                        }];
                    } else {
                        this.isSubEnterpriseItems = [];
                    }
                    this.originalItems = [...this.isSubEnterpriseItems];
                }
                
                // Reset selectAll state after loading data
                this.updateSelectAllState();
                
            } catch (error) {
                console.error("Error fetching Sustainability Guide details:", error);
            } finally {
                this.subOrgLoading = false;
            }
        },

        navigateToProgressByGoals() {
            if (this.protocolId) {
                this.$router.push({
                    name: 'ProgressByGoals',
                    params: { id: this.protocolId }
                });
            }
        },

        getProgressColor(value) {
            if (value >= 75) return 'success';
            if (value >= 50) return 'warning';
            return 'error';
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

        applyTableFilters(filters) {
            const sourceItems = this.isSubEnterprise ? this.originalItems : this.originalItems;
            const filteredItems = sourceItems.filter(item => {
                const environmental = item.environmental >= filters[1].range[0] && item.environmental <= filters[1].range[1];
                const social = item.social >= filters[2].range[0] && item.social <= filters[2].range[1];
                const governance = item.governance >= filters[3].range[0] && item.governance <= filters[3].range[1];
                const overallProgress = item.overallProgress >= filters[0].range[0] && item.overallProgress <= filters[0].range[1];

                return environmental && social && governance && overallProgress;
            });

            if (this.isSubEnterprise) {
                this.isSubEnterpriseItems = filteredItems;
            } else {
                this.items = filteredItems;
            }

            this.filterRanges = filters;
            this.showFilterDialog = false;
            
            // Update selectAll state after filtering
            this.updateSelectAllState();
        },

        toggleSelectAll() {
            const currentItems = this.isSubEnterprise ? this.isSubEnterpriseItems : this.items;
            
            // Set all items' selected state to match selectAll
            currentItems.forEach(item => {
                item.selected = this.selectAll;
            });
            
            // Emit the updated selection
            this.handleSelectionChange();
        },
        
        updateSelectAllState() {
            const currentItems = this.isSubEnterprise ? this.isSubEnterpriseItems : this.items;
            if (currentItems.length === 0) {
                this.selectAll = false;
                return;
            }
            
            const selectedCount = currentItems.filter(item => item.selected).length;
            this.selectAll = selectedCount === currentItems.length;
        },
        
        getSocialValue(item) {
            return item.social_na ? 'N/A' : `${item.social}%`;
        }
    },
    mixins: [LoadingMixin]
}
</script>

<style scoped>
.gap-15 {
    gap: 15px;
}

.v-text-field {
    cursor: pointer;
}

.v-text-field ::v-deep .v-input__slot {
    cursor: pointer;
}

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

.v-text-field ::v-deep .v-text-field__details {
    display: none;
}
</style>