<template>
  <v-container fluid>
    <v-row justify="center">
      <!-- Card 1: Total Number of Transactions -->
      <v-col cols="12" md="6" lg="3">
        <v-card class="pa-3">
          <div class="d-flex align-center justify-space-between">
            <div>
              <div class="title">
                {{ $t("buySell.totalNumberOfTransactions") }}
                <!-- Total # of Transactions -->
              </div>
             
              <div class="data" :class="`title-${transactionsArrowColor}`">
                {{ totalTransaction }}
              </div>
            </div>
            <div class="icon-container">
              <v-icon :color="transactionsArrowColor">{{
                transactionsArrow
              }}</v-icon>
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- Card 2: Total Weight of Transactions -->
      <v-col cols="12" md="6" lg="3">
        <v-card class="pa-3">
          <div class="d-flex align-center justify-space-between">
            <div>
              <div class="title">
                {{ $t("buySell.totalWeightOfTransactions") }}
                <!-- Total Weight of Transactions -->
               
              </div>
              <div class="data" :class="`title-${weightArrowColor}`">
                {{ totalWeight  }} kg
              </div>
            </div>
            <div class="icon-container">
              <v-icon :color="weightArrowColor">{{ weightArrow }}</v-icon>
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- Card 3: Total Monetary Value of Transactions -->
      <v-col cols="12" md="6" lg="3">
        <v-card class="pa-3">
          <div class="d-flex align-center justify-space-between">
            <div>
              <div class="title">
                <!-- Total Monetary Value -->
                {{ $t("buySell.totalMonetaryValue") }}
              </div>
              <div class="data" :class="`title-${monetaryValueArrowColor}`">
                {{ totalMonetaryTransaction }} 
              </div>
            </div>
            <div class="icon-container">
              <v-icon :color="monetaryValueArrowColor">{{
                monetaryValueArrow
              }}</v-icon>
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- Card 4: Average Price -->
      <v-col cols="12" md="6" lg="3">
        <v-card class="pa-3">
          <div class="d-flex align-center justify-space-between">
            <div>
              <div class="title">
                <!-- Average Price -->
                {{ $t("buySell.averagePriceperKg") }}
              </div>
              <div class="data" :class="`title-${averagePriceArrowColor}`">
                {{ avgPrice }} 
              </div>
            </div>
            <div class="icon-container">
              <v-icon :color="averagePriceArrowColor">{{
                averagePriceArrow
              }}</v-icon>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CacaoDataService from "@/_services/CacaoDataService";
import {convertWeightIntoBaseUnitNumberOnly, convertWeightIntoBaseUnit} from "@/utils.js"
export default {
  name: "TransactionStats",
  data() {
    return {
      totalTransaction: 0,
      totalWeight: 0,
      totalMonetaryTransaction: 0,
      avgPrice: 0,
    };
  },
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  filters:{
    convertWeightNumber(value){
      return convertWeightIntoBaseUnitNumberOnly(value)
    },
    convertWeight(value){
      return convertWeightIntoBaseUnit(value)
    }
  },
  watch: {
    params: {
      handler: async function () {
        await this.fetchData();
      },
      deep: true,
    },
  },
  async mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      console.log("........", this.params);
      const {
        data: { info },
      } = await CacaoDataService.getCacaoBuySellOverview(this.params);
      this.totalTransaction = +info.totalTransaction;
      this.totalWeight = +info.totalWeight;
      this.totalMonetaryTransaction = +info.totalMonetaryTransaction;
      this.avgPrice = +info.avgPrice;
    },
  },
  computed: {
    transactionsArrow() {
      return this.totalTransaction >= 0
        ? "mdi-arrow-up-bold"
        : "mdi-arrow-down-bold";
    },
    transactionsArrowColor() {
      return this.totalTransaction >= 0 ? "green" : "red";
    },
    weightArrow() {
      return this.totalWeight >= 0
        ? "mdi-arrow-up-bold"
        : "mdi-arrow-down-bold";
    },
    weightArrowColor() {
      return this.totalWeight >= 0 ? "green" : "red";
    },
    monetaryValueArrow() {
      return this.totalMonetaryTransaction >= 0
        ? "mdi-arrow-up-bold"
        : "mdi-arrow-down-bold";
    },
    monetaryValueArrowColor() {
      return this.totalMonetaryTransaction >= 0 ? "green" : "red";
    },
    averagePriceArrow() {
      return this.avgPrice >= 0 ? "mdi-arrow-up-bold" : "mdi-arrow-down-bold";
    },
    averagePriceArrowColor() {
      return this.avgPrice >= 0 ? "green" : "red";
    },
  },
};
</script>

<style scoped>
.title {
  font-size: 1rem !important;
  font-weight: 300;
  margin-bottom: 0.5rem;
}

.title-green {
  color: #117443 !important;
}
.title-red {
  color: red;
}

.data {
  font-size: 1.5rem;
  font-weight: bold;
}

.icon-container {
  font-size: 2rem;
}
</style>
