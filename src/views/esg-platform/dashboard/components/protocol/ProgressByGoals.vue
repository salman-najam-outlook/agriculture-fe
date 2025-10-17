<template>
    <v-container>
        <v-card elevation="0" class="px-2">
            <v-card-text>
                <div class="d-flex mb-8">
                    <h2>{{ $t('Goal Progress') }}</h2>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" dark @click="navigateToProtocolDetails">
                        {{ $t('back') }}
                    </v-btn>
                </div>

                <v-row align="center">
                    <v-col cols="12" sm="4">
                        <v-select 
                            v-model="selectedSegment"
                            dense 
                            label="Select Segment" 
                            :items="segments"
                            outlined
                            clearable
                            @change="handleFiltersChange"
                        ></v-select>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-select 
                            v-model="selectedIssue"
                            dense 
                            label="Select Topics" 
                            :items="filteredIssues"
                            item-text="text"
                            item-value="id"
                            outlined
                            clearable
                            :disabled="!selectedSegment"
                            @change="handleFiltersChange"
                        ></v-select>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-select 
                            v-model="selectedGoal"
                            dense 
                            label="Select Goal" 
                            :items="filteredGoals"
                            item-text="text"
                            item-value="id"
                            outlined
                            clearable
                            :disabled="!selectedIssue"
                            @change="handleFiltersChange"
                        ></v-select>
                    </v-col>
                </v-row>

                <div class="mt-4" v-if="selectedGoal">
                    <p class="font-weight-bold">
                        Selected Goal: {{ goals.find(g => g.id === selectedGoal)?.text || 'No goal selected' }}
                    </p>
                </div>

                <v-row align="center" class="mt-4">
                    <v-col cols="3">
                        <v-text-field 
                            v-model="searchQuery"
                            dense 
                            label="Search Sub-Organization" 
                            prepend-inner-icon="mdi-magnify"
                            outlined
                            clearable
                            @input="handleSearch"
                            @click:clear="clearSearch"
                        ></v-text-field>
                    </v-col>
                </v-row>

                <v-data-table 
                    :headers="headers" 
                    :items="organizations" 
                    :loading="loading"
                    :server-items-length="totalItems"
                    :options.sync="options"
                    hide-default-footer
                    :footer-props="{
                        'items-per-page-options': [10, 20, 50],
                        'items-per-page-text': 'Rows per page'
                    }"
                >
                    <template v-slot:item.progress="{ item }">
                        <div class="d-flex align-center">
                            <v-progress-linear 
                                :value="item.progress" 
                                height="10" 
                                rounded
                                :color="getProgressColor(item.progress)" 
                                class="mr-2"
                            ></v-progress-linear>
                            <span>{{ item.progress }}%</span>
                        </div>
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-btn 
                            v-if="selectedGoal"
                            x-small 
                            fab 
                            color="primary" 
                            outlined
                            @click="viewSurveyResponse(item)"
                        >
                            <v-icon>mdi-eye</v-icon>
                        </v-btn>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import EsgService from "@/_services/EsgService";
import { debounce } from 'lodash';

export default {
    data() {
        return {
            protocolId: this.$route.params.id,
            loading: false,
            searchQuery: '',
            selectedSegment: null,
            selectedIssue: null,
            selectedGoal: null,
            segments: [],
            issues: [],
            goals: [],
            headers: [
                { text: 'Sub-Organization', value: 'name' },
                { text: 'Progress', value: 'progress' },
                { text: 'Actions', value: 'actions', sortable: false },
            ],
            organizations: [],
            totalItems: 0,
            options: {
                page: 1,
                itemsPerPage: 10,
                sortBy: [],
                sortDesc: [],
            },
        };
    },

    watch: {
        options: {
            handler() {
                if (this.selectedGoal) {
                    this.getGoalProgress();
                }
            },
            deep: true,
        }
    },

    async mounted() {
        await this.getProtocolDetails();
        await this.getGoalProgress(); // Get initial list without goal
    },

    computed: {
        filteredIssues() {
            if (!this.selectedSegment) return [];
            return this.issues.filter(issue => issue.type === this.selectedSegment);
        },

        filteredGoals() {
            if (!this.selectedIssue) return [];
            return this.goals.filter(goal => goal.issueId === this.selectedIssue);
        }
    },

    methods: {
        async getProtocolDetails() {
            try {
                const response = await EsgService.getEsgStandardDetails(this.protocolId);
                
                if (response.success && response.data) {
                    this.segments = [...new Set(
                        response.data.esgIssues.map(issue => issue.type)
                    )];

                    this.issues = response.data.esgIssues.map(issue => ({
                        id: issue._id,
                        text: issue.title, 
                        type: issue.type
                    }));

                    this.goals = response.data.esgIssues.flatMap(issue => 
                        issue.esgGoals.map(goal => ({
                            id: goal._id,
                            text: goal.title,
                            issueId: issue._id
                        }))
                    );
                }
            } catch (error) {
                console.error('Error fetching Sustainability Guide details:', error);
                this.$notify({
                    type: 'error',
                    text: 'Failed to load Sustainability Guide details'
                });
            }
        },

        handleFiltersChange() {
            if (this.selectedSegment === null) {
                this.selectedIssue = null;
                this.selectedGoal = null;
            } else if (this.selectedIssue === null) {
                this.selectedGoal = null;
            }
            
            if (this.selectedGoal) {
                this.options.page = 1;
                this.getGoalProgress();
            }
        },

        async getGoalProgress() {
            try {
                this.loading = true;
                const { page, itemsPerPage } = this.options;
                
                const params = {
                    page,
                    limit: itemsPerPage,
                    ...(this.searchQuery && { search: this.searchQuery.trim() }),
                    goalId: this.selectedGoal // This will be null initially and will change when goal is selected
                };

                const response = await EsgService.getGoalProgressByProtocolId(this.protocolId, params);
                
                if (response.success) {
                    this.organizations = response.data.rows;
                    this.totalItems = response.data.pagination.totalItems;
                }
            } catch (error) {
                console.error('Error fetching goal progress:', error);
                this.$notify({ 
                    type: 'error', 
                    text: 'Failed to load organization progress' 
                });
            } finally {
                this.loading = false;
            }
        },

        handleSearch: debounce(function() {
            this.options.page = 1;
            this.getGoalProgress();
        }, 500),

        clearSearch() {
            this.searchQuery = '';
            this.options.page = 1;
            this.getGoalProgress();
        },

        getProgressColor(value) {
            if (value < 30) return 'red';
            if (value < 70) return 'orange';
            return 'green';
        },

        navigateToProtocolDetails() {
            this.$router.push({
                name: 'ProtocolDetails',
                params: { id: this.protocolId }
            });
        },

        viewSurveyResponse(item) {
            this.$router.push({
                name: 'SurveyResponse',
                params: {
                    goalId: this.selectedGoal
                },
                query: {
                    organizationId: item._id,
                    protocolId: this.protocolId
                }
            });
        }
    }
};
</script>

<style scoped>
.v-data-table ::v-deep .v-data-table__wrapper {
    overflow-x: auto;
}

.v-progress-linear {
    min-width: 100px;
}

.float-right {
    float: right;
}

.v-text-field ::v-deep .v-input__icon--clear {
    margin-top: -4px;
}

.v-text-field ::v-deep .v-input__slot {
    min-height: 40px !important;
}
</style>