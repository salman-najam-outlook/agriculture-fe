<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-4">
        <h2>{{ $t("cacaoData.cacaoOverview") }}</h2>
      </div>
      <v-row justify="end">
        <v-col cols="auto">
          <date-filter
            filterByYear
            filterByMonth
            filterByWeek
            filterRange
            switchableFilter
            @filter="handleDateFilter"
          />
        </v-col>
        <v-col cols="auto">
          <GenderSelect v-model="filterParams.gender" color="teal" dense />
        </v-col>
        <v-col cols="auto">
          <CountrySelect v-model="filterParams.country" :list="countries" />
        </v-col>
      </v-row>
      <TransactionStatsSection :params="filterParams" />
      <BuySellListingTable :params="filterParams" />
    </v-container>
  </div>
</template>

<script>
import GenderSelect from "@/components/GenderSelect.vue";
import CountrySelect from "@/components/CountrySelect.vue";
import DateFilter from "@/components/DateFilter.vue";
import TransactionStatsSection from "./TransactionStatsSection.vue";
import BuySellListingTable from "./BuySellListingTable.vue";
import CacaoDataService from "@/_services/CacaoDataService";

export default {
  name: "BuySellOverview",
  data() {
    return {
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: true,
          to: "/",
        },
        {
          text: "Cacao",
          disabled: true,
          to: "/",
        },
        {
          text: this.$t("cacaoData.buysellOverview"),
          disabled: true,
          to: "breadcrumbs_link_1",
        },
      ],
      farmDetails: {
        load: false,
        farmId: "",
      },
      loadFarmsDetails: false,
      farm: {
        name: "Farm Name",
        location: "Farm Location",
        areaSize: "Area Size",
        registrationId: "Farm Registration ID",
      },
      filterParams: {
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
        country: "",
        gender: "",
      },
      countries: [],
    };
  },
  created() {
    this.getCountryList();
  },
  methods: {
    handleDateFilter(filter) {
      this.filterParams.startDate = filter.startDate;
      this.filterParams.endDate = filter.endDate;
    },

    handleGenderFilter(filter) {
      this.filterParams.gender = filter;
    },

    async getCountryList() {
      try {
        const response = await CacaoDataService.getFarmCountries();
        this.countries = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    loadFarmDetails(farm) {
      console.log("Farm selected: ", farm.id);
      this.farmDetails.load = true;
      this.farmDetails.farmId = farm.id;
      // You can call your API or handle the farm details display here
    },
  },
  components: {
    GenderSelect,
    CountrySelect,
    DateFilter,
    TransactionStatsSection,
    BuySellListingTable,
  },
};
</script>

<style scoped>
/* Your component's CSS styles go here */
</style>
