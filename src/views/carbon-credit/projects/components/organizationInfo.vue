<template>
    <v-container>
      <template>
        <div>
          <v-dialog v-model="dialog" max-width="900" persistent>
            <v-card>
              <!-- Header -->
              <div class="project-info-header">
                <span>{{ $t('carbonCredit.projectInfo.organizationDetail') }}</span>
                <v-btn icon @click="close">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </div>
              <v-divider></v-divider>
              <!-- Organization Detail Section -->
              <v-card-text class="organization-detail-section pt-4">
                <v-row>
                  <!-- Left Column: Map -->
                  <v-col cols="12" md="5">
                    <div class="map-container">
                      <div class="static-map">
                        <div class="map-placeholder">
                          <div class="map-background">
                            <div class="map-grid"></div>
                            <div class="map-roads"></div>
                            <div class="map-marker">
                              <v-icon size="32" color="#e74c3c">mdi-map-marker</v-icon>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </v-col>
                  <!-- Right Column: Organization Details -->
                  <v-col cols="12" md="7">
                    <div class="organization-details">
                      <div class="detail-row" v-for="(value, label) in projectDetails" :key="label">
                        <div class="detail-label">{{ label }}</div>
                        <div class="detail-value">{{ value }}</div>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>

              <!-- Sub-Organizations Section -->
              <v-card-text class="sub-org-section">
                <div class="sub-org-header mt-4">
                  <span class="sub-org-title">{{ $t('carbonCredit.projectInfo.subOrganizations') }}</span>
                </div>
                
                <!-- Sub-Organizations Table -->
                <v-data-table
                  :headers="displayHeaders"
                  :items="subOrganizations"
                  :items-per-page="options.limit"
                  hide-default-footer
                  class="sub-org-table"
                  :loading="loading"
                  :options.sync="options"
                  :server-items-length="totalSubOrgs"
                  :loading-text="$t('loadingData')"
                >
                  <!-- Table Top Slot: Search, Pagination, and Actions -->
                  <template v-slot:top>
                    <div class="d-flex mt-5">
                      <!-- Search Field -->
                      <div class="ml-3" style="width: 280px;">
                        <label for="text"> </label>
                        <v-text-field
                          prepend-inner-icon="mdi-magnify"
                          outlined
                          :placeholder="$t('carbonCredit.search')"
                          dense
                          v-model="search"
                          @input="searchQuery"
                          class="shrink"
                        ></v-text-field>
                      </div>
                      <v-spacer></v-spacer>
                      <!-- Pagination Info -->
                      <div class="py-1 title">
                        {{ fromSubOrgs }} - {{ toSubOrgs }} {{ $t("of") }} {{ totalSubOrgs }}
                      </div>
                      <!-- Pagination Controls -->
                      <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page <= 1"
                        @click="pageChange(false)">
                        <v-icon dark>mdi-chevron-left</v-icon>
                      </v-btn>
                      <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page >= totalPages"
                        @click="pageChange(true)">
                        <v-icon dark>mdi-chevron-right</v-icon>
                      </v-btn>
                      <!-- Customization Menu -->
                      <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" left :min-width="417">
                        <template v-slot:activator="props">
                          <v-btn class="mx-2" fab small outlined color="primary" v-bind="props.attrs" v-on="props.on">
                            <v-icon dark>mdi-cog-outline</v-icon>
                          </v-btn>
                        </template>
                        <v-card width="417">
                          <v-list>
                            <v-list-item>
                              <v-list-item-title>{{ $t("customization") }}</v-list-item-title>
                            </v-list-item>
                            <v-divider></v-divider>
                            <div class="pl-3 pt-2 font-weight-normal">
                              {{ $t("recordsPerPage") }}
                            </div>
                            <v-list-item>
                              <v-slider v-model="itemsPerPageSlider" :tick-labels="itemsPerPageOptions" :max="3" step="1"
                                ticks="always" tick-size="4"></v-slider>
                            </v-list-item>
                            <v-divider class="mt-n3"></v-divider>
                          </v-list>
                          <v-card-text>
                            <v-container fluid>
                              <v-row>
                                <v-col class="mt-n9" cols="6" v-for="header in subOrgHeaders" :key="header.value">
                                  <v-checkbox v-if="header.text" v-model="selectedHeaders" :label="header.text"
                                    color="primary" :value="header.text" hide-details></v-checkbox>
                                </v-col>
                              </v-row>
                            </v-container>
                          </v-card-text>
                          <v-layout justify-center>
                            <v-card-actions class="mb-5">
                              <v-spacer></v-spacer>
                              <v-btn outlined color="primary" @click="resetDefault" width="190">
                                {{ $t("restoreDefault") }}
                              </v-btn>
                              <v-btn color="primary" @click="resetTableStructure" width="190">
                                {{ $t("apply") }}
                              </v-btn>
                            </v-card-actions>
                          </v-layout>
                        </v-card>
                      </v-menu>
                    </div>
                  </template>
                  <!-- Table Body: Custom Rendering of Rows -->
                  <template v-if="subOrganizations && subOrganizations.length" v-slot:body="{ items }">
                    <tbody>
                      <tr v-for="item in items" :key="item.id" style="position: relative; width: 0; height: 0">
                        <template v-for="h in displayHeaders">
                          <td class="text-truncate" :key="h.value + '_organizations'" v-if="h.value === 'organizations'">
                            <span class="sub-org-name">{{ item.name }}</span>
                          </td>
                          <td class="text-truncate" :key="h.value + '_users'" v-else-if="h.value === 'users'">
                            <span class="sub-org-users">{{ item.users ? item.users.length : 0 }}</span>
                          </td>
                          <td class="text-truncate" :key="h.value + '_registrationDate'" v-else-if="h.value === 'registrationDate'">
                            <span class="sub-org-date">{{ formatDate(item.registrationDate || item.createdAt) }}</span>
                          </td>
                        </template>
                      </tr>
                    </tbody>
                  </template>
                </v-data-table>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="close">{{ $t('carbonCredit.projectInfo.close') }}</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </template>
    </v-container>
  </template>
  <script>
  import loadingMixin from "@/mixins/LoadingMixin";
  import generalMixin from "@/mixins/GeneralMixin";
  import CarbonCreditService from "../../../../_services/CarbonCreditService";
  
  export default {
    data() {
      return {
        search: '',
        loading: false,
        menu: false,
        options: {
          limit: 2,
          page: 1,
        },
        itemsPerPageOptions: [2, 5, 10, 25],
        itemsPerPageSlider: 0, // 0 corresponds to 2 items per page
        selectedHeaders: [],
        tableHeaders: [],
        showActionsColumn: true,
        fromSubOrgs: 0,
        toSubOrgs: 0,
        totalSubOrgs: 0,
        subOrganizations: [],
        subOrgHeaders: [
          { text: this.$t('carbonCredit.projectInfo.organizations'), value: 'organizations', sortable: true },
          { text: this.$t('carbonCredit.projectInfo.users'), value: 'users', sortable: true },
          { text: this.$t('carbonCredit.projectInfo.registrationDate'), value: 'registrationDate', sortable: true },
        ],
      };
    },
    computed: {
      dialog() {
        return this.dialogI;
      },
      projectDetails() {
        // Test the translation methods
        const creditTypeTranslated = this.getCreditTypeLabel(this.project.creditType);
        const projectTypeTranslated = this.getProjectTypeLabel(this.project.projectType);
        return {
          [this.$t('carbonCredit.projectInfo.country')]: this.project.country || '-',
          [this.$t('carbonCredit.projectInfo.organizations')]: this.project.organization || '-',
          [this.$t('carbonCredit.projectInfo.organizationsAddress')]: this.project.address || '-',
          [this.$t('carbonCredit.projectInfo.blockchainAddress')]: this.project.blockchain || '-',
          [this.$t('carbonCredit.projectInfo.creditType')]: creditTypeTranslated,
          [this.$t('carbonCredit.projectInfo.projectType')]: projectTypeTranslated,
        };
      },

      totalPages() {
        return parseInt(Math.ceil(this.totalSubOrgs / this.options.limit));
      },
      displayHeaders() {
        return this.tableHeaders.filter((header) =>
          header.text && this.selectedHeaders.includes(header.text)
        );
      }
    },
    props: {
      dialogI: {
        type: Boolean,
        required: true,
      },
      organizationId: {
        type: Number,
        required: false,
        default: null,
      },
      project: {
        type: Object,
        default: () => ({
          country: '',
          organization: '',
          address: '',
          blockchain: '',
          creditType: '',
          projectType: '',
          subOrganizations: []
        })
      }
    },
    mounted() {
      this.selectedHeaders = this.subOrgHeaders.map(h => h.text).filter(Boolean);
      this.tableHeaders = this.subOrgHeaders;
      this.fetchSubOrganizations();
    },
    watch: {
      dialog(newVal) {
        if (newVal) {
          // Force recomputation of projectDetails when dialog opens
          this.$forceUpdate();
        }
      }
    },
    methods: {
      close() {
        this.$emit('update:dialog', false);
      },
      searchQuery() {
        this.options.page = 1;
        this.fetchSubOrganizations();
      },
      pageChange(next) {
        if (next) {
          this.options.page += 1;
        } else {
          this.options.page = Math.max(1, this.options.page - 1);
        }
        this.fetchSubOrganizations();
      },
      updatePagination() {
        this.fromSubOrgs = this.totalSubOrgs > 0 ? (this.options.page - 1) * this.options.limit + 1 : 0;
        this.toSubOrgs = this.options.page * this.options.limit > this.totalSubOrgs
          ? this.totalSubOrgs
          : this.options.page * this.options.limit;
      },
      resetDefault() {
        this.selectedHeaders = this.subOrgHeaders.map(h => h.text).filter(Boolean);
        this.tableHeaders = this.subOrgHeaders;
        this.options.limit = 2;
        this.menu = false;
        this.fetchSubOrganizations();
      },
      resetTableStructure() {
        this.tableHeaders = this.subOrgHeaders.filter((header) =>
          header.text && this.selectedHeaders.includes(header.text)
        );
        this.options.limit = this.itemsPerPageOptions[this.itemsPerPageSlider];
        this.options.page = 1; // Reset to first page when changing structure
        this.fetchSubOrganizations();
        this.menu = false;
      },
      async fetchSubOrganizations() {
        this.loading = true;
        try {
          const params = {
            page: this.options.page,
            limit: this.options.limit,
            search: this.search
          };
          const response = await CarbonCreditService.getSubOrganizations(params);
          if (response.success) {
            this.subOrganizations = response.data.rows || [];
            this.totalSubOrgs = response.data.total || 0;
            this.updatePagination();
          } else {
            console.error('API response not successful:', response);
            this.subOrganizations = [];
            this.totalSubOrgs = 0;
          }
        } catch (error) {
          console.error('Error fetching sub-organizations:', error);
          this.subOrganizations = [];
          this.totalSubOrgs = 0;
        } finally {
          this.loading = false;
        }
      },
      formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }).toUpperCase();
      },
      getProjectTypeLabel(value) {
        if (!value) return '-';
        const projectTypes = [
          { text: this.$t('carbonCredit.agroforestry'), value: "agroforestry" },
          { text: this.$t('carbonCredit.regenerative_agriculture'), value: "regenerative_agriculture" },
          { text: this.$t('carbonCredit.forestry'), value: "forestry" }
        ];
        const found = projectTypes.find(type => type.value === value);
        return found ? found.text : value;
      },
      getCreditTypeLabel(value) {
        if (!value) return '-';
        const creditTypes = [
          { text: this.$t('carbonCredit.register.removal'), value: "removal" },
          { text: this.$t('carbonCredit.register.avoided'), value: "avoided" }
        ];
        const found = creditTypes.find(type => type.value === value);
        return found ? found.text : value;
      }
    },
    mixins: [loadingMixin, generalMixin],
  };
  </script>
  
  <style scoped lang="scss">
  .question-label {
    position: relative;
    width: 90%;
  }
  
  .question-input {
    width: 100px;
    position: absolute;
    right: 0;
    top: -9px;
  }
  .project-info-header {
    background: #1abc5b;
    color: #fff;
    font-size: 1.3rem;
    font-weight: 700;
    padding: 18px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
  .organization-detail-section {
    padding-bottom: 0;
  }
  .map-container {
    border-radius: 8px;
    overflow: hidden;
    height: 100%;
  }
  .static-map {
    width: 100%;
    height: 240px;
    background: #f5f5f5;
    border-radius: 8px;
    border: 1px solid #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .map-placeholder {
    text-align: center;
    color: #666;
    position: relative;
    width: 100%;
    height: 100%;
  }
  .map-background {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #e8f4f8 0%, #d4e6f1 100%);
    border-radius: 8px;
    position: relative;
    overflow: hidden;
  }
  .map-grid {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
    background-size: 20px 20px;
  }
  .map-roads {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 2px;
    background: rgba(255,255,255,0.3);
    transform: translateY(-50%);
  }
  .map-roads::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 60%;
    height: 2px;
    background: rgba(255,255,255,0.3);
    transform: translate(-50%, -50%) rotate(90deg);
  }
  .map-marker {
    position: absolute;
    top: 40%;
    left: 60%;
    transform: translate(-50%, -50%);
  }
  .map-location {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255,255,255,0.9);
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 16px;
    font-weight: 600;
    color: #333;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  .organization-details {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 0;
    height: 240px;
    justify-content: flex-start;
  }
  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 8px;
    border-bottom: 1px solid #e0e0e0;
    width: 100%;
  }
  .detail-row:last-child {
    border-bottom: none;
  }
  .detail-label {
    color: #888;
    font-weight: 500;
    font-size: 14px;
    text-align: left;
    flex: 1;
  }
  .detail-value {
    color: #222;
    font-weight: 600;
    font-size: 14px;
    text-align: right;
    flex: 1;
  }
  .sub-org-section {
    padding-top: 24px;
    border-top: 1px solid #e0e0e0;
  }
  .sub-org-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  .sub-org-title {
    font-size: 1.2rem;
    font-weight: 700;
    color: #333;
  }
  .sub-org-search {
    max-width: 260px;
  }
  .sub-org-table {
    margin-top: 8px;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
  }
  .sub-org-table .v-data-table__wrapper table thead tr th {
    background: #117443 !important;
    color: #fff !important;
    font-weight: 600;
    font-size: 1rem;
    text-align: center;
  }
  .sub-org-table .v-data-table__wrapper table thead tr th:first-child {
    text-align: left;
  }
  .sub-org-name {
    padding-left: 16px;
    font-weight: 500;
    color: #333;
  }
  .sub-org-users {
    text-align: center;
    font-weight: 500;
  }
  .sub-org-date {
    text-align: center;
    font-weight: 500;
  }

  
  /* Table styling from List.vue */
  ::v-deep .v-data-table-header span {
    text-transform: uppercase !important;
    color: white;
  }
  
  .sub-org-table .v-data-table__wrapper table tbody tr:hover {
    background-color: #e8f5e8 !important;
  }
  </style>
  