<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-8">
        <h2>{{  $t('dueDiligence.listOfProducers') }}</h2>
        <v-spacer></v-spacer>
        <div class="d-flex mt-1">
          <v-btn
            color="primary"
            dark
            class="mr-2"
            width="auto"
            @click="addNewProducers = true"
          >
            {{ $t("deforestation.producerData.addProducers") }}
          </v-btn>
        </div>
      </div>
      <v-card elevation="0" class="px-5 mt-4">
        <div class="pa-4">
          <v-data-table
            :headers="headers"
            :items="producers"
            :items-per-page="10"
            :footer-props="{
              'items-per-page-options': [10, 25, 50],
            }"
            hide-default-footer
            :loading="loading"
            :options.sync="options"
            :server-items-length="totalProducers"
            :loading-text="$t('loadingData')"
          >
            <template v-slot:top="{}">
              <div class="d-flex mt-5">
                <div class="srch mr-2">
                  <label> {{ $t("search") }} </label> &nbsp;
                  <v-text-field
                    prepend-inner-icon="mdi-magnify"
                    outlined
                    height="5px"
                    :placeholder="$t('searchByProducerName')"
                    dense
                    v-model="search"
                    @keyup.enter="searchQuery"
                    class="shrink"
                  >
                  </v-text-field>
                </div>

                <div>
                  <label> {{ $t("country") }} </label>
                  <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                        mdi-alert-circle
                      </v-icon>
                    </template>
                    <span>{{ $t("deforestation.producerData.countryInfo") }}</span>
                  </v-tooltip>
                  <v-select
                    :items="countries"
                    item-text="name"
                    item-value="name"
                    :placeholder="$t('deforestation.allCountries')"
                    dense
                    outlined
                    v-model="country"
                    style="max-width:175px"
                    class="mr-5"
                    @input="onCountryInput"
                  ></v-select>
                </div>
                <div>
                  <label style="visibility: hidden;"> Refresh </label> 
                  <div>
                    <v-btn @click="resetSearch" color="primary">
                      <v-icon style="cursor: pointer; color: #fff !important;"> mdi-refresh</v-icon>
                    </v-btn>
                  </div>
                </div>

                <v-spacer></v-spacer>
                <div class="py-1 title">
                  {{ from }} - {{ to }} {{ $t('of') }} {{ totalProducers }} (Pg. {{ options.page }} / {{ totalPages }})
                </div>
                <v-btn
                  class="mx-2"
                  fab
                  small
                  outlined
                  color="primary"
                  :disabled="options.page <= 1"
                  @click="pageChange(false)"
                >
                  <v-icon dark>
                    mdi-chevron-left
                  </v-icon>
                </v-btn>
                <v-btn
                  class="mx-2"
                  fab
                  small
                  outlined
                  color="primary"
                  :disabled="options.page >= totalPages"
                  @click="pageChange(true)"
                >
                  <v-icon dark>
                    mdi-chevron-right
                  </v-icon>
                </v-btn>
                <!-- <v-btn class="mx-2" fab small outlined color="primary">
                  <v-icon dark>
                      mdi-tray-arrow-down
                  </v-icon>
                </v-btn> -->
                <!-- <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn class="mx-2" fab small outlined v-bind="attrs" v-on="on" color="primary">
                      <v-icon>settings</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('deforestation.settings') }}</span>
                </v-tooltip> -->
                <!-- <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn class="mx-2" fab small outlined v-bind="attrs" v-on="on" color="primary">
                      <v-icon>download</v-icon>
                    </v-btn>
                  </template>
                  <span>Download</span>
                </v-tooltip> -->
                <!-- <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn class="mx-2" fab small outlined v-bind="attrs" v-on="on" color="primary">
                      <v-icon>print</v-icon>
                    </v-btn>
                  </template>
                  <span>Print</span>
                </v-tooltip> -->
              </div>
            </template>
            <template v-if="producers.length" v-slot:body="{ items }">
              <tbody>
                <tr
                  v-for="item in items"
                  :key="item.id"
                  style="position: relative; width: 0; height: 0"
                >
                  <td class="text-truncate">
                    {{ item.firstName || "" }} {{ item.lastName || "" }}
                  </td>

                  <td class="text-truncate">
                    {{ item.countryId }}
                  </td>

                  <td class="text-truncate" style="max-width: 300px;">
                    {{ getDateFormat(item.createdAt) }}
                  </td>

                  <td>
                    <v-chip 
                      :color="getRiskAssessmentColor(getSummaryRisk(item))" 
                      variant="elevated" 
                      outlined
                    >
                      {{ getRiskAssessmentText(getSummaryRisk(item)) }}
                    </v-chip>
                  </td>
                  
                  <!-- Action Buttons Column -->
                  <td class="text-center">
                    <v-menu offset-y>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          x-small
                          v-bind="attrs"
                          v-on="on"
                          color="primary"
                        >
                          <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                      </template>
                      <v-list dense>
                        <v-list-item @click="editProducer(item)">
                          <v-list-item-title>{{ $t("edit") }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="confirmedDelete(item)">
                          <v-list-item-title class="text--red">{{ $t("delete") }}</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </td>
                  
                  <!-- Expand/Collapse Column -->
                  <td class="text-center">
                    <v-btn
                      icon
                      x-small
                      @click="toggleExpand(item)"
                      color="primary"
                    >
                      <v-icon>
                        {{ isExpanded(item) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                      </v-icon>
                    </v-btn>
                  </td>
                </tr>
                
                <!-- Expanded Row Content -->
                <tr 
                  v-for="item in expandedItems" 
                  :key="`expanded-${item.id}`"
                >
                  <td :colspan="headers.length" class="pa-0">
                    <div class="production-places-container">
                      <v-data-table
                        :headers="productionPlaceHeaders"
                        :items="getProductionPlaces(item)"
                        :items-per-page="-1"
                        hide-default-footer
                        class="nested-table"
                        dense
                      >
                        <template v-slot:body="{ items }">
                          <tbody>
                            <tr v-for="place in items" :key="place.id">
                              <td class="text-truncate">
                                {{ place.description || 'N/A' }}
                              </td>
                              <td class="text-truncate">
                                {{ place.area || 'N/A' }} ha
                              </td>
                              <td class="text-truncate">
                                {{ place.type || 'N/A' }}
                              </td>
                              <td class="text-truncate">
                                {{ getDateFormat(place.lastAssessment) }}
                              </td>
                              <td>
                                <div class="d-flex align-center">
                                  <v-chip 
                                    :color="getDeforestationStatusColor(place.deforestationStatus)" 
                                    variant="elevated" 
                                    outlined
                                    small
                                  >
                                    {{ getDeforestationStatusText(place.deforestationStatus) }}
                                  </v-chip>
                                  <v-btn
                                    icon
                                    x-small
                                    class="ml-2"
                                    @click="viewDeforestationReport(place)"
                                  >
                                    <v-icon small>mdi-file-document-outline</v-icon>
                                  </v-btn>
                                </div>
                              </td>
                              <td>
                                <div class="d-flex align-center">
                                  <v-chip 
                                    :color="getRiskAssessmentColor(place.riskAssessment)" 
                                    variant="elevated" 
                                    outlined
                                    small
                                  >
                                    {{ getRiskAssessmentText(place.riskAssessment) }}
                                  </v-chip>
                                  <v-btn
                                    icon
                                    x-small
                                    class="ml-2"
                                    @click="viewRiskAssessmentReport(place)"
                                  >
                                    <v-icon small>mdi-file-document-outline</v-icon>
                                  </v-btn>
                                </div>
                              </td>
                              <td>
                                <v-menu offset-y>
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                      icon
                                      x-small
                                      v-bind="attrs"
                                      v-on="on"
                                    >
                                      <v-icon>mdi-dots-vertical</v-icon>
                                    </v-btn>
                                  </template>
                                  <v-list dense>
                                    <v-list-item @click="viewProductionPlace(place)">
                                      <v-list-item-icon>
                                        <v-icon small>mdi-eye</v-icon>
                                      </v-list-item-icon>
                                      <v-list-item-title>View Details</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item @click="editProductionPlace(place)">
                                      <v-list-item-icon>
                                        <v-icon small>mdi-pencil</v-icon>
                                      </v-list-item-icon>
                                      <v-list-item-title>Edit</v-list-item-title>
                                    </v-list-item>
                                  </v-list>
                                </v-menu>
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-data-table>
                    </div>
                  </td>
                </tr>
              </tbody>
            </template>

            <template v-slot:footer></template>
          </v-data-table>
        </div>
      </v-card>
    </v-container>
    <add-new-producers 
      :dialogI="addNewProducers" v-if="addNewProducers"
      @closeModal="addNewProducers = false" @userAdded="toastMessageForAdd"
    />
    <edit-producer v-if="editProducerD"
      :dialogI="editProducerD"
      :item="selectedProducer"
      @closeModal="editProducerD = false"
      @userEdited="toastMessageForEdit"
    />
    <confirm-box  v-if="confirm" :title="confirmElements.title" :message="confirmElements.message"
      :cancelBtnText="confirmElements.cancelBtnText" :confirmBtnText="confirmElements.confirmBtnText"
      :confirmData="selectedProducer" :dialog="confirm" @cancel:action="confirm = false"
      @continue:action="deleteProducer"></confirm-box>
  </div>
</template>
<script>
import AddNewProducers from './AddNewProducers.vue'
import EditProducer from './EditProducer.vue'
import loadingMixin from "@/mixins/LoadingMixin";
import { getCountries } from "country-state-picker";
import { debounce } from "lodash";
import ConfirmBox from "@/components/ConfirmBox";
import { getRiskAssessmentStatus, currentUser } from '@/utils';
import RoleMixin from "@/mixins/RoleMixin";
import moment from 'moment';
import DeforestationService from "@/_services/DeforestationService";
export default {
  components: { AddNewProducers, EditProducer,"confirm-box": ConfirmBox },
  data() {
    return {
      addNewProducers: false,
      confirm:false,
      editProducerD:false,
      selectedProducer:{},
      totalProducers: 0,
      totalPages: 1,
      producers: [],
      countries: [],
      expanded: [],
      singleExpand: true,
      loading: false,
      breadcrumbs: [
        {
          text: 'Producers',
          disabled: false,
        },
      ],
      confirmElements: {
        title: this.$t("addEdituser.deactivateUser"),
        message: this.$t("addEdituser.deactivateMsg"),
        confirmBtnText: this.$t("addEdituser.activateAct"),
        cancelBtnText: this.$t("cancel"),
        confirmData: {},
      },
      headers: [
        {
          text: this.$t("Producer Name"),
          align: "start",
          class: "black--text",
          sortable: false,
        },
        {
          text: this.$t("country"),
          align: "start",
          class: "black--text",
        },
        {
          text: this.$t("Last Assessment"),
          align: "start",
          class: "black--text",
          sortable: false,
        },
        {
          text: this.$t("Risk Assessment"),
          align: "start",
          class: "black--text",
          sortable: false,
        },
        {
          text: "",
          align: "center",
          value: "actions",
          class: "black--text",
          sortable: false,
          width: "120px"
        },
        {
          text: "",
          align: "center",
          value: "expand",
          class: "black--text",
          sortable: false,
          width: "50px"
        }
      ],
      productionPlaceHeaders: [
        {
          text: "Production Place Description",
          align: "start",
          class: "grey lighten-3 black--text",
          sortable: false,
        },
        {
          text: "Area (ha)",
          align: "start",
          class: "grey lighten-3 black--text",
          sortable: false,
        },
        {
          text: "Type",
          align: "start",
          class: "grey lighten-3 black--text",
          sortable: false,
        },
        {
          text: "Last Assessment",
          align: "start",
          class: "grey lighten-3 black--text",
          sortable: false,
        },
        {
          text: "EUDR Deforestation Status",
          align: "start",
          class: "grey lighten-3 black--text",
          sortable: false,
        },
        {
          text: "Risk Assessment",
          align: "start",
          class: "grey lighten-3 black--text",
          sortable: false,
        },
        {
          text: "",
          align: "center",
          class: "grey lighten-3 black--text",
          sortable: false,
        },
      ],
      options: {
        itemsPerPage: 10,
        page: 1,
      },
      country: null,
      search: null,
      from: 0,
      to: 0
    }
  },
  computed:{
    isOperatorOnly(){
      return  this.getCurrentRoles.includes("operator")
    },
    isSupplierOnly(){
      return  this.getCurrentRoles.includes("supplier")
    },
    expandedItems() {
      return this.producers.filter(item => this.isExpanded(item));
    },
    currentUser(){
      return currentUser()
    }
  },
  methods: {
    getDateFormat(date) {
        return moment(date).format("DD/MM/YYYY");
    },
    
    // Production places methods
    getProductionPlaces() {
      // Mock data for demonstration - replace with actual API call
      return [
        {
          id: 1,
          description: 'Farm 1',
          area: 10,
          type: 'Circular',
          lastAssessment: '2023-12-02',
          deforestationStatus: 'medium_probability',
          riskAssessment: 'approved'
        },
        {
          id: 2,
          description: 'Farm 2',
          area: 8,
          type: 'Circular',
          lastAssessment: '2023-12-02',
          deforestationStatus: 'zero_negligible_probability',
          riskAssessment: 'mitigation_required'
        },
        {
          id: 3,
          description: 'Farm 3',
          area: 6,
          type: 'Circular',
          lastAssessment: '2023-12-02',
          deforestationStatus: 'high_probability',
          riskAssessment: 'rejected'
        }
      ];
    },

    getDeforestationStatusColor(status) {
      const colors = {
        'zero_negligible_probability': 'light-green',
        'low_probability': 'green',
        'medium_probability': 'orange',
        'high_probability': 'red'
      };
      return colors[status] || 'grey';
    },

    getDeforestationStatusText(status) {
      const texts = {
        'zero_negligible_probability': 'Zero/Negligible Probability',
        'low_probability': 'Low Probability',
        'medium_probability': 'Medium Probability',
        'high_probability': 'High Probability'
      };
      return texts[status] || 'N/A';
    },

    getRiskAssessmentColor(status) {
      const colors = {
        'approved': 'green',
        'mitigation_required': 'orange',
        'rejected': 'red'
      };
      return colors[status] || 'grey';
    },

    getRiskAssessmentText(status) {
      const texts = {
        'approved': 'Approved',
        'mitigation_required': 'Mitigation Required',
        'rejected': 'Rejected'
      };
      return texts[status] || 'N/A';
    },

    viewProductionPlace(place) {
      console.log('View production place:', place);
      // Implement view functionality
    },

    editProductionPlace(place) {
      console.log('Edit production place:', place);
      // Implement edit functionality
    },

    viewDeforestationReport(place) {
      console.log('View deforestation report for:', place);
      // Implement deforestation report view
    },

    viewRiskAssessmentReport(place) {
      console.log('View risk assessment report for:', place);
      // Implement risk assessment report view
    },

    toggleExpand(item) {
      const index = this.expanded.indexOf(item.id);
      if (index > -1) {
        this.expanded.splice(index, 1);
      } else {
        if (this.singleExpand) {
          this.expanded = [item.id];
        } else {
          this.expanded.push(item.id);
        }
      }
    },

    isExpanded(item) {
      return this.expanded.includes(item.id);
    },

    toastMessageForEdit(data){
      if (data && data.success) {
        this.$notify({
          type: "success",
          text: data.message,
        });
      } else {
        this.$notify({
          type: "error",
          text: data.message || this.$t("dueDiligence.unExpectedErrorMsg"),
        });
      }
      this.fetchData()
    },
    toastMessageForAdd(){
      this.$notify({
          title: "User has successfully added.",
          text: "User Added !",
          type: "success",
      });
      this.fetchData()
    },
    onCountryInput: debounce(function() {
      this.fetchData();
    }, 400),
    getRiskAssessmentStatus,
    editProducer(item) {
      this.selectedProducer = item
      this.editProducerD = true
    },

    confirmedDelete(item){
      this.selectedProducer = item
      const status = item.active;
      
      this.confirmElements.title =
        status == 0
          ? this.$t("addEdituser.activateAct")
          : this.$t("addEdituser.deactivateAct");
      this.confirmElements.confirmBtnText =
        status == 0
          ? this.$t("addEdituser.activateAct")
          : this.$t("addEdituser.deactivateAct");
      this.confirmElements.confirmData = { user: item, status: status };
      this.confirm = true;
    },

    async deleteProducer(action, item) {
      this.startLoading()
      DeforestationService.deleteProducer({
        id:Number(item.id)
      }).then(async (res) => {
        if(res?.errors?.length > 0){
          const errorMessage =
          res?.errors?.[0]?.message || this.$t("dueDiligence.unExpectedErrorMsg");
            this.$notify({
              type: "error",
              text: errorMessage,
            });
          this.confirm = false
          this.stopLoading()
          return;
        }
        
        console.log(res)
        this.$notify({
          title:
          item.active == 0
              ? this.$t("addEdituser.userActivated")
              : this.$t("addEdituser.userDeactivated"),
          type: "success",
        });
        this.confirm = false
        await this.fetchData()
        this.stopLoading()
      }).catch(err => {
        this.confirm = false
        console.log(err)
        this.stopLoading()
      })
      console.log(item);
    },
    handleRiskAssessmentStatus(item){
      const allRiskAssessments = item?.farms[0]?.productionPlaces[0]?.all_risk_assessments || [];

      if (allRiskAssessments.length === 0) return { text: 'N/A'};

      const firstStatus = allRiskAssessments[0].riskAssessmentStatus;

      const allSameStatus = allRiskAssessments.every((item)=>item.riskAssessmentStatus === firstStatus);

      const riskStatus =  allSameStatus ? firstStatus : 'mitigation_required';

      return this.getRiskAssessmentStatus(riskStatus);
    },
    getSummaryRisk(item) {
      const statuses = item?.farms[0]?.productionPlaces?.map((pp) => pp.risk_assessment_status);

      if (statuses && statuses.includes("mitigation_required")) {
        return "mitigation_required";
      }

      for(let s of ["approved", "rejected"]){
        if (statuses && statuses.every((v) => v === s)) {
          return s;
        }
      }
      
      return "";
    },
    getLatestDate(item) {
      let latest;
      let latestStr;

      item?.farms[0]?.productionPlaces.forEach((pp) => {
        const tz = new Date(pp.updatedAt);

        if (!latest || latest < tz) {
          latest = tz;
          latestStr = pp.updatedAt;
        }

      });

      return latestStr ? latestStr.split('T')[0] : null;
    },
    async fetchData() {
      this.startLoading();
      let payload = {
        search: this.search,
        country: this.country,
        page: this.options.page,
        item: this.options.itemsPerPage,
        limit:10
      };

      if(this.isOperatorOnly){
        payload.operatorId = this.$store.getters.getUser.id
      }

      if(this.isSupplierOnly){
        payload.supplierId = this.$store.getters.getUser.id
      }

      try {
        const response = await DeforestationService.getProducers(
          payload
        );
       
        this.producers = response.data.getProducers.rows;
        this.totalProducers = response.data.getProducers.totalCount;
        this.totalPages = Math.ceil(
          this.totalProducers / this.options.itemsPerPage
        );
        this.from =
          this.totalProducers > 0
            ? (this.options.page - 1) * this.options.itemsPerPage + 1
            : 0;
        this.to =
          this.options.page * this.options.itemsPerPage > this.totalProducers
            ? this.totalProducers
            : this.options.page * this.options.itemsPerPage;
      } catch (error) { 
        console.error(error);
        this.$notify({
          title: this.$t("dueDiligence.unExpectedErrorMsg"),
          type: "error",
        });
      } finally {
        this.stopLoading();
      }
    },
    pageChange(t) {
      if (t) this.options.page = this.options.page + 1;
      else this.options.page = this.options.page - 1;

      this.fetchData();
    },
    getCountry() {
      this.countries = getCountries();
    },
    resetSearch(){
      this.country = null;
      this.search = null
      this.fetchData();
    },
    async searchQuery() {
      if (this.search.length > 3) {
        this.options.page = 1;
        await this.fetchData();
      }
    },
  },
  async mounted() {
    this.getCountry();
    await this.fetchData();
    this.country = this.currentUser?.user_organization?.country || null
  },
  mixins: [loadingMixin, RoleMixin],
}
</script>

<style scoped>
.production-places-container {
  background-color: #f5f5f5;
  padding: 16px;
  margin: 8px;
  border-radius: 4px;
}

.nested-table {
  background-color: white;
  border-radius: 4px;
  overflow: hidden;
}

.nested-table ::v-deep .v-data-table__wrapper {
  border-radius: 4px;
}

.nested-table ::v-deep .v-data-table thead th {
  background-color: #e0e0e0 !important;
  color: #000 !important;
  font-weight: 600;
  border-bottom: 1px solid #d0d0d0;
}

.nested-table ::v-deep .v-data-table tbody tr:hover {
  background-color: #f8f9fa;
}

.nested-table ::v-deep .v-data-table tbody td {
  border-bottom: 1px solid #e0e0e0;
  padding: 8px 16px;
}

.v-data-table ::v-deep .v-data-table__expand-icon {
  color: #1976d2;
}

.v-data-table ::v-deep .v-data-table__expand-icon:hover {
  color: #1565c0;
}

/* Chip styling for status indicators */
.v-chip {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Action buttons styling */
.v-btn--fab.v-size--x-small {
  width: 28px;
  height: 28px;
}

/* Search and filter styling */
.srch {
  min-width: 200px;
}

.shrink {
  max-width: 200px;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .production-places-container {
    padding: 8px;
    margin: 4px;
  }
  
  .nested-table ::v-deep .v-data-table tbody td {
    padding: 4px 8px;
    font-size: 0.875rem;
  }
}
</style>