<template>
    <v-card class="mb-5" flat>
        <v-card-text class="pa-0">
            <v-expansion-panels flat>
                <v-expansion-panel>
                    <v-expansion-panel-header>
                        <div class="d-flex align-center">
                            <span class="v-toolbar__title font-weight-bold grey--text text--darken-2">{{ $t('dueDiligence.activityLog') }}</span>
                            <v-tooltip top color="00BD73" max-width="350">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon class="icon-with-background primary--text ml-2" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                        mdi-alert-circle
                                    </v-icon>
                                </template>
                                <span>{{ $t('dueDiligence.activityLogTT') }}</span>
                            </v-tooltip>
                        </div>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content class="pa-0">
                        <v-row class="ma-0 pt-4 pr-4" justify="start">
                            <v-col cols="12" sm="6" md="auto" class="py-0 mr-4 pl-0">
                                <v-text-field
                                    prepend-inner-icon="mdi-magnify"
                                    outlined
                                    dense
                                    :placeholder="$t('search')"
                                    v-model="activitySearch"
                                    clearable
                                    :disabled="isLoading"
                                    @input="handleSearch"
                                    style="width: 200px;"
                                ></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="4" md="auto" class="py-0 mr-4">
                                <v-autocomplete
                                    outlined
                                    dense
                                    clearable
                                    :items="activityRoleItems"
                                    v-model="activityUserRole"
                                    :label="$t('dueDiligence.userRole')"
                                    :disabled="isLoading"
                                    @change="handleFilterChange"
                                    style="width: 180px;"
                                ></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="4" md="auto" class="py-0 mr-4">
                                <v-autocomplete
                                    outlined
                                    dense
                                    clearable
                                    :items="activitySegmentItems"
                                    v-model="activitySegment"
                                    :label="$t('dueDiligence.segment')"
                                    :disabled="isLoading"
                                    @change="handleFilterChange"
                                    style="width: 180px;"
                                ></v-autocomplete>
                            </v-col>

                            <v-spacer></v-spacer>
                            
                            <div class="py-1 title">
                                {{ fromActivityLogs }} -
                                {{ toActivityLogs }} {{ $t('of') }}
                                {{ totalActivityLogs }}
                            </div>
                            <v-btn class="mx-2" fab small outlined color="primary" :disabled="activityOptions.page <= 1 || isLoading"
                                @click="pageChange(false)">
                                <v-icon dark>
                                    mdi-chevron-left
                                </v-icon>
                            </v-btn>
                            <v-btn class="mx-2" fab small outlined color="primary" :disabled="activityOptions.page >= totalPages || isLoading"
                                @click="pageChange(true)">
                                <v-icon dark>
                                    mdi-chevron-right
                                </v-icon>
                            </v-btn>
                            <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" left :min-width="417">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn class="mx-2" fab small outlined color="primary" v-bind="attrs" v-on="on">
                                        <v-icon dark>mdi-cog-outline </v-icon>
                                    </v-btn>
                                </template>
                                <v-card width="417">
                                    <v-list>
                                        <v-list-item>
                                            <v-list-item-content>
                                                <v-list-item-title>{{ $t("deforestation.customization")
                                                    }}</v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                        <v-divider></v-divider>
                                        <div class="pl-3 pt-2 font-weight-normal">
                                            {{ $t("deforestation.recordsPerpage") }}
                                        </div>
                                        <v-list-item>
                                            <v-list-item-content>
                                                <v-slider v-model="itemsPerPageSlider" :tick-labels="itemsPerPageOptions" :max="3"
                                                    step="1" ticks="always" tick-size="4"></v-slider>
                                            </v-list-item-content>
                                        </v-list-item>
                                        <v-divider class="mt-n3"></v-divider>
                                    </v-list>
                                    <v-card-text>
                                        <v-container fluid>
                                            <v-row>
                                                <v-col class="mt-n9" cols="6" v-for="header in headers" :key="header.value">
                                                    <v-checkbox v-if="header.text" v-model="selectedHeaders" :label="header.text"
                                                        color="primary" :value="header.text" hide-details
                                                        :disabled="header.text == 'ID'"></v-checkbox>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-card-text>
                                    <v-layout justify-center>
                                        <v-card-actions class="mb-5">
                                            <v-spacer></v-spacer>

                                            <v-btn outlined color="primary" @click="resetDefault" width="190">
                                                <span class="text-truncate" style="max-width:150px">{{ $t("deforestation.restoreDefault")
                                                    }}</span>
                                            </v-btn>
                                            <v-btn color="primary" @click="resetTableStructure" width="190">
                                                {{ $t("deforestation.apply") }}
                                            </v-btn>
                                        </v-card-actions>
                                    </v-layout>
                                </v-card>
                            </v-menu>
                        </v-row>
                        <v-row class="ma-0">
                            <v-col sm="12" class="pa-0">
                                <v-data-table 
                                    :headers="tableHeaders" 
                                    :items="activityLogs" 
                                    :items-per-page="activityOptions.itemsPerPage"
                                    :footer-props="{
                                        'items-per-page-options': [5, 10, 25, 50],
                                    }" 
                                    item-key="id"
                                    hide-default-footer
                                    :loading="isLoading" 
                                    :options.sync="activityOptions"
                                    :server-items-length="totalActivityLogs" 
                                    :loading-text="$t('loadingData')"
                                    @update:options="handleOptionsUpdate">
                                    <template v-if="activityLogs.length" v-slot:body="{ items }">
                                        <tbody>
                                            <tr v-for="item in items" :key="item.id"
                                                style="position: relative; width: 0; height: 0"
                                                @mouseover="selectItem(item)" @mouseleave="selectItem(false)">
                                                <template v-for="h in tableHeaders">
                                                    <td class="text-truncate" :key="h.value + '_user'"
                                                        v-if="h.value == 'user'">
                                                        {{ item.user?.firstName }} {{ item.user?.lastName }}
                                                    </td>

                                                    <td class="text-truncate" :key="h.value + '_userRole'"
                                                        v-else-if="h.value == 'userRole'">
                                                        {{ item.user?.role }}
                                                    </td>

                                                    <td class="text-truncate" :key="h.value + '_ipAddress'"
                                                        v-else-if="h.value == 'ipAddress'">
                                                        {{ item.ipAddress || '-' }}
                                                    </td>

                                                    <td class="text-truncate" :key="h.value + '_dateTime'"
                                                        v-else-if="h.value == 'dateTime'">
                                                        {{ formatDateTime(item.createdAt) }}
                                                    </td>

                                                    <td class="text-truncate" :key="h.value + '_activity'"
                                                        v-else-if="h.value == 'activity'">
                                                        {{ item.activity }}
                                                    </td>

                                                    <td class="text-truncate" :key="h.value + '_description'"
                                                        v-else-if="h.value == 'description'">
                                                        {{ item.description }}
                                                    </td>
                                                </template>
                                            </tr>
                                        </tbody>
                                    </template>
                                    <template v-slot:footer></template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-card-text>
    </v-card>
</template>

<script>
import DeforestationService from "@/_services/DeforestationService";

export default {
    name: 'ActivityLog',
    props: {
        loading: {
            type: Boolean,
            default: false
        },
        diligenceId: {
            type: [Number, String],
            required: true
        }
    },
    data() {
        return {
            activitySearch: '',
            activityUserRole: null,
            activitySegment: null,
            activityRoleItems: [],
            activitySegmentItems: [],
            totalActivityLogs: 0,
            activityOptions: {
                itemsPerPage: 10,
                page: 1
            },
            isLoading: false,
            headersActivityLog: [
                {
                    text: this.$t('dueDiligence.user'),
                    align: "start",
                    value: "user",
                    class: "black--text",
                    sortable: false,
                },
                {
                    text: this.$t('dueDiligence.userRole'),
                    align: "start",
                    value: "user-role",
                    class: "black--text",
                },
                {
                    text: this.$t('dueDiligence.ipAddress'),
                    align: "start",
                    value: "ipAddress",
                    class: "black--text",
                    sortable: false,
                },
                {
                    text: this.$t('dueDiligence.dateAndTime'),
                    align: "start",
                    value: "date_time",
                    class: "black--text",
                    sortable: false
                },
                {
                    text: this.$t('dueDiligence.segment'),
                    align: "start",
                    value: "area",
                    class: "black--text",
                    sortable: false,
                },
                {
                    text: this.$t('dueDiligence.activityDescription'),
                    align: "start",
                    value: "description",
                    class: "black--text",
                    sortable: false,
                }
            ],
            activityLogs: [],
            tableHeaders: [
                { text: this.$t('dueDiligence.user'), value: 'user', class: 'black--text' },
                { text: this.$t('dueDiligence.userRole'), value: 'userRole', class: 'black--text' },
                { text: this.$t('dueDiligence.ipAddress'), value: 'ipAddress', class: 'black--text' },
                { text: this.$t('dueDiligence.dateAndTime'), value: 'dateTime', class: 'black--text' },
                { text: this.$t('dueDiligence.segment'), value: 'activity', class: 'black--text' },
                { text: this.$t('dueDiligence.activityDescription'), value: 'description', class: 'black--text' }
            ],
            selectedHeaders: [],
            allSelectedHeaders: [],
            itemsPerPageSlider: 1,
            itemsPerPageOptions: [5, 10, 25, 50],
            menu: false,
            fromActivityLogs: 0,
            toActivityLogs: 0,
            searchTimeout: null,
            headers: [
                { text: this.$t('dueDiligence.user'), value: 'user' },
                { text: this.$t('dueDiligence.userRole'), value: 'userRole' },
                { text: this.$t('dueDiligence.ipAddress'), value: 'ipAddress' },
                { text: this.$t('dueDiligence.dateAndTime'), value: 'dateTime' },
                { text: this.$t('dueDiligence.segment'), value: 'activity' },
                { text: this.$t('dueDiligence.activityDescription'), value: 'description' }
            ]
        };
    },
    computed: {
        totalPages() {
            return Math.ceil(this.totalActivityLogs / this.activityOptions.itemsPerPage);
        },
        filteredActivityLogs() {
            const text = (this.activitySearch || '').toLowerCase();
            return (this.activityLogs || []).filter((log) => {
                const matchesText = !text ||
                    `${log.user?.firstName || ''} ${log.user?.lastName || ''}`.toLowerCase().includes(text) ||
                    (log.activity || '').toLowerCase().includes(text) ||
                    (log.description || '').toLowerCase().includes(text) ||
                    (log.user?.role || '').toLowerCase().includes(text);
                const matchesRole = !this.activityUserRole || log.user?.role === this.activityUserRole;
                const matchesSegment = !this.activitySegment || log.activity === this.activitySegment;
                return matchesText && matchesRole && matchesSegment;
            });
        }
    },
    watch: {
        diligenceId: {
            immediate: true,
            handler(newId) {
                if (newId) {
                    this.loadActivityLogs();
                }
            }
        }
    },
    mounted() {
        this.tableHeaders = this.headers;
        // Initialize all headers as selected by default
        this.allSelectedHeaders = this.headers.map(header => header.text);
        this.selectedHeaders = [...this.allSelectedHeaders];
        if (this.diligenceId) {
            this.loadActivityLogs();
        }
    },
    methods: {
        formatDateTime(dateTimeString) {
            if (!dateTimeString) return '-';
            const date = new Date(dateTimeString);
            const day = date.getDate().toString().padStart(2, '0');
            const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
            const year = date.getFullYear();
            let hours = date.getHours();
            const minutes = date.getMinutes();
            const period = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            const formattedDateTime = `${day}-${month}-${year} | ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
            return formattedDateTime;
        },
        async loadActivityLogs() {
            if (!this.diligenceId) return;
            
            try {
                this.isLoading = true;
                this.$emit('update:loading', true);
                
                // Build filter object
                const filter = {
                    page: this.activityOptions.page,
                    limit: this.activityOptions.itemsPerPage,
                    searchPhrase: this.activitySearch || undefined,
                    userRole: this.activityUserRole || undefined,
                    activity: this.activitySegment || undefined,
                    orderField: 'createdAt',
                    order: 'DESC'
                };

                const response = await DeforestationService.getDiligenceActivityLogPaginated(this.diligenceId, filter);
                
                if (response.data?.diligenceActivityLogPaginated) {
                    const data = response.data.diligenceActivityLogPaginated;
                    this.activityLogs = data.rows.map(log => ({
                        ...log,
                        ipAddress: log.ip_address || log.ipAddress || '-' // Map from ip_address (GraphQL) to ipAddress (frontend)
                    }));
                    this.totalActivityLogs = data.totalCount;
                    
                    // Update pagination info
                    this.fromActivityLogs = this.totalActivityLogs > 0
                        ? (this.activityOptions.page - 1) * this.activityOptions.itemsPerPage + 1
                        : 0;
                    this.toActivityLogs = this.activityOptions.page * this.activityOptions.itemsPerPage > this.totalActivityLogs
                        ? this.totalActivityLogs
                        : this.activityOptions.page * this.activityOptions.itemsPerPage;
                    
                                         // Populate filter options from all logs (client-side pagination)
                     if (this.activityOptions.page === 1) {
                         const roles = new Set();
                         const segments = new Set();
                         // Get all logs from the service to populate filter options
                         const allLogsResponse = await DeforestationService.getDiligenceActivityLog(this.diligenceId);
                         if (allLogsResponse.data?.diligenceActivityLog) {
                             allLogsResponse.data.diligenceActivityLog.forEach((log) => {
                                 if (log.user?.role) roles.add(log.user.role);
                                 if (log.activity) segments.add(log.activity);
                             });
                             this.activityRoleItems = Array.from(roles);
                             this.activitySegmentItems = Array.from(segments);
                         }
                     }
                } else {
                    this.activityLogs = [];
                    this.totalActivityLogs = 0;
                    this.fromActivityLogs = 0;
                    this.toActivityLogs = 0;
                }
            } catch (error) {
                console.error('Error loading activity logs:', error);
                this.activityLogs = [];
                this.totalActivityLogs = 0;
                this.fromActivityLogs = 0;
                this.toActivityLogs = 0;
                
                // Show error notification
                this.$notify({
                    text: 'Failed to load activity logs. Please try again.',
                    type: 'error',
                });
            } finally {
                this.isLoading = false;
                this.$emit('update:loading', false);
            }
        },
        selectItem(item) {
            this.$emit('select-item', item);
        },

        // Public method to refresh activity logs (can be called from parent)
        async refreshActivityLogs() {
            console.log('Refreshing activity logs...');
            await this.loadActivityLogs();
        },
        handleSearch() {
            // Debounce search to avoid too many API calls
            if (this.searchTimeout) {
                clearTimeout(this.searchTimeout);
            }
            this.searchTimeout = setTimeout(() => {
                this.activityOptions.page = 1; // Reset to first page
                this.loadActivityLogs();
            }, 500);
        },
        handleFilterChange() {
            this.activityOptions.page = 1; // Reset to first page
            this.loadActivityLogs();
        },
        handleOptionsUpdate(options) {
            this.activityOptions = options;
            this.loadActivityLogs();
        },
        pageChange(next) {
            if (next) {
                this.activityOptions.page++;
            } else {
                this.activityOptions.page--;
            }
            this.loadActivityLogs();
        },
        resetDefault() {
            this.tableHeaders = [...this.headers];
            this.allSelectedHeaders = this.headers.map(header => header.text);
            this.selectedHeaders = [...this.allSelectedHeaders];
            this.itemsPerPageSlider = 1;
            this.menu = false;
        },
        resetTableStructure() {
            this.tableHeaders = this.headers.filter(header => this.selectedHeaders.includes(header.text));
            this.activityOptions.itemsPerPage = this.itemsPerPageOptions[this.itemsPerPageSlider];
            this.menu = false;
            this.loadActivityLogs();
        }
    }
};
</script>

<style lang="scss" scoped>
.font-weight-bold {
    font-weight: 900 !important;
}
</style>
