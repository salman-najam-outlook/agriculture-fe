<template>
    <!-- 4th card Blends Products -->
    <v-card elevation="0" class="pa-6 my-6">
      <div class="d-flex align-center mb-6">
        <h2 class="text-h6">
          {{ $t("blends.finalReport.reportSummary.productionPlaces") }}
        </h2>
        <v-tooltip bottom color="00BD73" max-width="500">
          <template v-slot:activator="{ on, attrs }">
            <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
              mdi-alert-circle
            </v-icon>
          </template>
          <span>{{ $t("blends.finalReport.reportSummary.totalLowZeroRiskFarmArea") }}</span>
        </v-tooltip>
      </div>

      <div  class="mb-8">
        <v-data-table :headers="headers" :items="productionPlaces" hide-default-footer disable-pagination
          :loading="loading" :loading-text="$t('loadingData')"
          class="elevation-1 rounded" color="primary"
          >
          <template v-slot:top="{}">
            <div class="d-flex align-center my-5">
                
                <div style="width: 290px;">
                  <label for="text">
                    &nbsp;
                  </label>
                  <v-text-field prepend-inner-icon="mdi-magnify" outlined height="5px" :placeholder="$t('search')" dense
                    v-model="payload.searchPhrase" @input="debouncedGetProductionPlaces" class="shrink" clearable></v-text-field>
                </div>

                <div class="ml-3"  style="width: 290px;">
                  <label for="text">
                    {{ $t("blends.exemptProducts.product") }}
                    <v-tooltip top color="00BD73" max-width="350">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon class="icon-with-background" style="color:#0EBF67;font-size: 18px;" v-bind="attrs" v-on="on">
                          mdi-alert-circle
                        </v-icon>
                      </template>
                      <span>{{ $t("blends.exemptProducts.product") }}</span>
                    </v-tooltip>
                  </label>
                  <v-autocomplete :placeholder="$t('dueDiligence.selectProduct')" :items="productList" v-model="payload.productIds" item-text="name" item-value="id" dense outlined clearable
                    class="wdt" @change="debouncedGetProductionPlaces" multiple>
                                        </v-autocomplete>
                </div>

                <div class="ml-3" style="width: 200px;">
                  <label for="text">{{ $t('country') }}</label>
                  <v-tooltip top color="00BD73" max-width="350">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon class="icon-with-background" style="color:#0EBF67;font-size: 18px;" v-bind="attrs" v-on="on">
                          mdi-alert-circle
                        </v-icon>
                      </template>
                      <span>{{ $t('country') }}</span>
                    </v-tooltip>
                  <v-autocomplete :items="filterCountries" v-model="payload.farmCountry" item-text="name" item-value="name" dense outlined clearable
                    class="wdt" :placeholder="$t('select')" @change="debouncedGetProductionPlaces" multiple></v-autocomplete>
                </div>

                <div class="ml-3" style="width: 290px;">
                  <label for="text">{{ $t('deforestation.EUDRDeforestationStatus') }}</label>
                  <v-tooltip top color="00BD73" max-width="350">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon class="icon-with-background" style="color:#0EBF67;font-size: 18px;" v-bind="attrs" v-on="on">
                          mdi-alert-circle
                        </v-icon>
                      </template>
                      <span>{{ $t('deforestation.EUDRDeforestationStatusTT') }}</span>
                    </v-tooltip>
                  <v-autocomplete :items="EUDRstatusList" v-model="payload.eudrDeforestationStatus" item-text="text" item-value="val" dense outlined clearable
                    class="wdt" :placeholder="$t('select')" @change="debouncedGetProductionPlaces"></v-autocomplete>
                </div>

                <v-spacer></v-spacer>
                <div class="py-1 title">
                        {{ from }} - {{ to }} {{ $t('of') }} {{ totalProductionPlace }}
                </div>
                <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page <= 1"
                    @click="pageChange(false)">
                    <v-icon dark>
                        mdi-chevron-left
                    </v-icon>
                </v-btn>
                <v-btn class="mx-2" fab small outlined color="primary"
                    :disabled="to >= totalProductionPlace" @click="pageChange(true)">
                    <v-icon dark>
                        mdi-chevron-right
                    </v-icon>                             
                </v-btn>
            </div>
        </template>

          <template v-slot:item.productionPlaceAndFarmId="{ item }">
            {{ item?.farm?.farmName }} {{ item?.farmId }}
          </template>
          <template v-slot:item.addressOfProduction="{ item }">
            {{ item?.farm?.address }}
          </template>
          <template v-slot:item.product="{ item }">
            {{ item?.diligenceReport?.product_detail?.name }}
          </template>

          <template v-slot:item.status="{ item }">
            <v-btn v-if="getEUDRDeforestationStatus(item.eudr_deforestation_status).text !== 'N/A'" small rounded min-width="200" depressed :class="[getEUDRDeforestationStatus(item.eudr_deforestation_status).class, 'non-clickable']" height="34"
            >
             {{ getEUDRDeforestationStatus(item.eudr_deforestation_status).text }}
           </v-btn>
           <span v-else>N/A</span>
          </template>

          <template v-slot:item.riskAssessment="{ item }">
            <div class="d-flex">
              <div class="d-flex" v-if="handleRiskAssessmentStatus(item?.all_risk_assessments)?.text !== 'N/A'">
                <v-btn small rounded min-width="200" depressed :class="handleRiskAssessmentStatus(item?.all_risk_assessments)?.class" height="34"
                >
                  {{ handleRiskAssessmentStatus(item?.all_risk_assessments)?.text }}
                </v-btn>
                <v-tooltip top color="00BD73" max-width="350">
                  <template v-slot:activator="{ on, attrs }">
                    <img v-bind="attrs" v-on="on" class="ml-1" src="/icons/todo-list.png" style="width: 34px; height: 34px; border-radius: 50%;" />
                  </template>
                  <span>{{ $t('dueDiligence.viewReport') }}</span>
                </v-tooltip>
              </div>
              <span v-else>N/A</span>
            </div>
          </template>

          <template v-slot:item.producerName="{ item }">
            {{ item?.farm?.userDdsAssoc?.firstName }} {{ item?.farm?.userDdsAssoc?.lastName }}
          </template>
        </v-data-table>
      </div>
    </v-card>
<!-- Data Table -->

</template>

<script>

import BlendService from "@/_services/BlendService";
import { getRiskAssessmentStatus} from '@/utils';
import { debounce } from 'lodash';
import FarmService from "@/_services/FarmService";


export default {
  mounted() {
    this.fetchProductionPlaces();
    this.getCountries()
    this.getProductList();
  },
  props: {
    ddsIds: {
      type: Array,
      required: true
    },
    productIds: {
      type: Array,
      default: () => [],   
    }
  },
  data() {
    return {
      from: 0,
      to: 0,
      loading: false,
      totalProductionPlace: 0,
      productionPlaces: [],
      options: {
          itemsPerPage: 10,
          page: 1,
      },
      productList: [],
      filterCountries: [],
      EUDRstatusList: [
          { text: this.$t("deforestation.allStatus"), val: "" },
          { text: this.$t("deforestation.veryHighProbability"), val: "Very High Deforestation Probability"},
          { text: this.$t("deforestation.highProbability"), val: "High Deforestation Probability" },
          { text: this.$t("deforestation.mediumProbability"), val: "Medium Deforestation Probability" },
          { text: this.$t("deforestation.lowProbability"), val: "Low Deforestation Probability" },
          { text: this.$t("deforestation.veryLowProbability"), val: "Very Low Deforestation Probability" },
          { text: this.$t("deforestation.zeroOrNegligibleProbability"), val: "Zero/Negligible Deforestation Probability"},
          { text: this.$t("dueDiligence.manualMitigated"), val: "Manually Mitigated" },
      ],
      payload: {
          searchPhrase: '',
          eudrDeforestationStatus: '',
          farmCountry: [],
          productIds: []
      },
      headers: [
          { text: this.$t('blends.createBlends.productionPlaceTable.productionPlaceAndFarmId'), value: 'productionPlaceAndFarmId', sortable: true },
          { text: this.$t('blends.createBlends.productionPlaceTable.product'), value: 'product', sortable: true },
          { text: this.$t('blends.createBlends.productionPlaceTable.producerName'), value: 'producerName', sortable: true },
          { text: this.$t('blends.createBlends.productionPlaceTable.addressOfProduction'), value: 'addressOfProduction', sortable: false },
          { text: this.$t('blends.createBlends.productionPlaceTable.status'), value: 'status', sortable: false },
          { text: this.$t('blends.createBlends.productionPlaceTable.riskAssessment'), value: 'riskAssessment', sortable: false },
      ],
      
    }
  },
  methods: {
    async getProductList() {
      BlendService.getProducts({hasSubproducts: true})
          .then((res) => {
            const productList = res.data.manageProduct.rows;
            this.productList = productList;
          })
          .catch((err) => {
              console.log("Error in product listing", err);
          });
    },
    async getCountries() {
      const data = await FarmService.loadCountries();
      this.countries = data.data;
      this.filterCountries = [{ name: 'Unassigned', code: null } ,...data.data];
    },
    async fetchProductionPlaces() {
      this.loading = true;
      if(this.productIds.length > 0){
        this.payload.productIds = this.productIds;
      }
      const payload = {
          ...this.payload,
          page: this.options.page,
          limit: this.options.itemsPerPage || 10,
      };
      if(this.ddsIds.length === 0) {
        this.productionPlaces = [];
        return;
      }

      const { data } = await BlendService.getProductionPlace({ filter: {
        diligenceReportIds: this.ddsIds,
        ...payload
      } });
      this.loading = false;

      this.productionPlaces = data?.productionPlaces?.rows;
      this.totalProductionPlace = data?.productionPlaces.totalCount;
      
      this.from =
          this.totalProductionPlace > 0
              ? (this.options.page - 1) * this.options.itemsPerPage + 1
              : 0;
      this.to =
          this.options.page * this.options.itemsPerPage > this.totalProductionPlace
              ? this.totalProductionPlace
              : this.options.page * this.options.itemsPerPage;
    },
    debouncedGetProductionPlaces: debounce(function(){
      // reset into first page.
      this.tableOptions = {
        page: 1,
        itemsPerPage: 10
      }

      this.fetchProductionPlaces();
    }, 1000), // debounce delay
    async searchQuery() {
     //   this.payload.searchPhrase = this.search;
        this.options.page = 1;
        await this.fetchProductionPlaces();
    },
    pageChange(t) {
        if (t) this.options.page = this.options.page + 1;
        else this.options.page = this.options.page - 1;
        this.fetchProductionPlaces();
    },
    getEUDRDeforestationStatus(status) {
      switch (status) {
          case 'Zero/Negligible Deforestation Probability':
          case 'Zero/Negligible Probability':
              return { class: 'green-button', text: this.$t("deforestation.zeroOrNegligibleProbability") };
          case 'Very High Deforestation Probability':
          case 'Very High Probability':
              return { class: 'very-high-button', text:  this.$t("deforestation.veryHighProbability") };
          case 'Very Low Deforestation Probability':
          case 'Very Low Probability':
              return { class: 'very-low-button', text: this.$t("deforestation.veryLowProbability") };
          case 'High Deforestation Probability':
          case 'High Probability':
              return { class: 'red-button', text: this.$t("deforestation.highProbability") };
          case 'Low Deforestation Probability':
          case 'Low Probability':
              return { class: 'orange-button', text: this.$t("deforestation.lowProbability") };
          case 'Medium Deforestation Probability':
          case 'Medium Probability':
              return { class: 'medium-button', text: this.$t("deforestation.mediumProbability") };
          case 'Manually Deforestation Mitigated':
          case 'Manually Mitigated':
              return { class: 'manually-button', text: this.$t("dueDiligence.manualMitigated") };
          default:
              return { class: '', text: 'N/A' };
          }
    },
    getRiskAssessmentStatus,
    handleRiskAssessmentStatus(allRiskAssessments){

      if (allRiskAssessments.length === 0) return { text: 'N/A'};

      const firstStatus = allRiskAssessments[0].riskAssessmentStatus;

      const allSameStatus = allRiskAssessments.every((item)=>item.riskAssessmentStatus === firstStatus);

      const riskStatus =  allSameStatus ? firstStatus : 'mitigation_required';

      return this.getRiskAssessmentStatus(riskStatus);
    },

  }
}
</script>

<style lang="scss" scoped>

.v-data-table ::v-deep .v-data-table__wrapper>table>thead>tr>th {
  color: white !important;
  font-weight: 500;
}


.v-data-table ::v-deep td {
  white-space: pre-line;
}

.v-data-table {
  max-height: 500px;
  overflow-y: auto;
}


.icon-with-background {
  font-size: 18px;
}

.v-text-field {
  .v-input__control {
    min-height: 40px;
  }
}
::v-deep .non-clickable {
  pointer-events: none;
  cursor: default;
}
</style>