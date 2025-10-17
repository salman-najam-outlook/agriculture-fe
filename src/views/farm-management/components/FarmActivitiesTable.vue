<template>
  <div class="table-section">
    <v-data-table
      :headers="headers"
      :items="activities"
      :items-per-page="pagination.options.itemsPerPage"
      :page="pagination.options.page"
      :server-items-length="pagination.totalItems"
      :items-per-page-options="pagination.itemsPerPageOptions"
      :options.sync="pagination.options"
      :loading="loading"
      hide-default-footer
      class="elevation-1"
    >
      <template #top>
        <v-row class="px-4 pt-3" no-gutters>
          <v-col cols="12" md="3" class="px-1">
            <v-text-field
              prepend-inner-icon="mdi-magnify"
              @keyup.enter="searchQuery"
              outlined
              v-model="searchPhrase"
              dense
              clearable
              @click:clear="clearSearchValue"
              :placeholder="$t('farm.search')"
              class="shrink"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3" class="px-1">
            <CountrySelect
              v-model="filterParams.country"
              optionValue="country"
              optionText="country"
              outlined
              dense
              :list="countryList"
            />
          </v-col>

          <v-col cols="12" md="3" class="px-1">
            <v-autocomplete
              item-text="farmName"
              item-value="id"
              outlined
              dense
              clearable
              :items="farmNames"
              v-model="filterParams.farmName"
              :label="$t('farm.filterByFarmName')"
            ></v-autocomplete>
          </v-col>

          <v-col cols="12" md="3" class="px-1">
            <v-autocomplete
              :items="cropTypes"
              outlined
              dense
              item-text="name"
              item-value="id"
              v-model="filterParams.cropType"
              :label="$t('farm.filterByCropType')"
            ></v-autocomplete>
          </v-col>

          <v-col cols="12" md="3" class="px-1">
            <v-menu
              ref="dateMenu"
              v-model="dateMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="filterParams.startDate"
                  :label="$t('farm.filterByStartDate')"
                  readonly
                  outlined
                  dense
                  clearable
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="filterParams.startDate"
                no-title
                @input="dateMenu = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-row no-gutters class="px-4" justify="end">
          <v-col cols="12" md="4" class="d-flex mt-1 pl-3 justify-end">
            <v-btn
              class="mx-2 mb-2"
              fab
              color="green darken-1"
              outlined
              x-small
              :aria-label="$t('farm.download')"
              @click="download"
            >
              <v-icon>mdi-cloud-download</v-icon>
            </v-btn>
            <v-btn
              class="mx-2 mb-2"
              fab
              color="red darken-1"
              outlined
              x-small
              :aria-label="$t('farm.clearFilters')"
              @click="clearFilters"
            >
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
            <div class="title">
              {{ pagination.from }} - {{ pagination.to }} of
              {{ pagination.totalItems }}
            </div>
            <v-btn
              class="mx-1"
              fab
              x-small
              outlined
              color="primary"
              :disabled="pagination.options.page <= 1"
              @click="pageChange(false)"
              :aria-label="$t('farm.previousPage')"
            >
              <v-icon dark>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn
              class="mx-1"
              fab
              x-small
              outlined
              color="primary"
              :disabled="pagination.options.page >= pagination.totalPages"
              @click="pageChange(true)"
              :aria-label="$t('farm.nextPage')"
            >
              <v-icon dark>mdi-chevron-right</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </template>
      <template #item.startDateTime="{ item }">
        {{ formatDate(item.startDateTime) }}
      </template>
      <template #item.endDateTime="{ item }">
        {{ formatDate(item.endDateTime) }}
      </template>
      <template #item.activity_details="{ item }">
        <v-btn color="primary" @click="viewActivityDetails(item)" text>
          {{ $t('farm.view') }}
        </v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card class="modal-border">
        <v-card-title class="headline">{{$t('farm.activityDetails')}}</v-card-title>
        <v-card-text>
          <div v-if="selectedItem">
            <p><strong>{{ $t('farm.activity') }}:</strong> {{ selectedItem?.title }}</p>
            <p><strong>{{ $t('farm.farmerName') }}:</strong> {{ selectedItem?.user?.fullName }}</p>
            <p><strong>{{ $t('farm.farmName') }}:</strong> {{ selectedItem?.user_farm?.farmName }}</p>
            <p><strong>{{ $t('farm.cropType') }}:</strong> {{ selectedItem?.cropType?.name }}</p>
            <p><strong>{{ $t('farm.startDate') }}:</strong> {{ selectedItem?.startDateTime | formatDate }}</p>
            <p><strong>{{ $t('farm.endDate') }}:</strong> {{ selectedItem?.endDateTime | formatDate }}</p>
            <p><strong>{{ $t('farm.description') }}:</strong> {{ selectedItem?.description }}</p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog = false">
            {{ $t('farm.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import CountrySelect from "@/components/CountrySelect.vue";
import FarmService from "@/_services/FarmService";
import loadingMixin from "@/mixins/LoadingMixin";
import { debounce } from "lodash";
import DownloadMixin from "@/mixins/DownloadMixin";
import moment from "moment"
import DateMixin from "@/mixins/DateMixin";
export default {
  name: "FarmActivitiesTable",
  components: {
    CountrySelect,
  },
  props:{
    activity:{
      type: String,
      default: "scheduled"
    }
  },
  data() {
    return {
      title: "Farm Calender Activities",
      activeView: "list",
      dateMenu: false,
      dialog: false,
      scheduledActivity: "scheduled",
      
      searchPhrase: "",
      filterParams: {
        country: "",
        farmName: "",
        cropType: "",
        cropVariety: "",
        startDate: "",
      },
      pagination: {
        options: { page: 1 },
        totalItems: 0,
        itemsPerPage: 10,
        from: 0,
        to: 0,
        totalPages: 0,
      },
      loading: false,
      headers: [
        { text: this.$t('farmName'), value: "user_farm.farmName", sortable: true },
        { text: this.$t('farmerName'), value: "user.fullName", sortable: true },
        { text: this.$t("farm.cropName"), value: "cropType.name", sortable: true },
        { text: this.$t("farm.activities"), value: "title", sortable: true },
        { text: this.$t('farm.startDate'), value: "startDateTime", sortable: true },
        { text: this.$t('farm.endDate'), value: "endDateTime", sortable: true },
        { text: this.$t('farm.activityDetails'), value: "activity_details" },
        {},
      ],
      cropVarieties: [],
      cropTypes: [],
      farmNames: [],
      countryList: [],
      activities: [],
      selectedItem: null,
    };
  },
  methods: {
    async download(){
      try {
        this.startLoading();
        const response =await FarmService.downloadFarmCalenderActivitiesList(
          {
            country: this.filterParams.country,
            searchPhrase: this.searchPhrase,
            startDate: this.filterParams.startDate,
            scheduledActivity: this.activity,
          },
          this.$route.params.id
        );
        this.downloadBlob(response.data, "farm-activity-report.pdf");
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.stopLoading();
      }
    },
    handleDateFilter(filter) {
      this.filterParams.startDate = filter.startDate;
      this.filterParams.endDate = filter.endDate;
    },
    viewActivityDetails(item) {
      this.selectedItem = item;
      this.dialog = true;
    },
    async fetchData() {
      try {
        this.loading = true;
        const start =
          (this.pagination.options.page - 1) *
          this.pagination.options.itemsPerPage;
        const end = start + this.pagination.itemsPerPage;

        const { data } = await FarmService.getFarmCalenderActivities(
          {
            page: this.pagination.options.page,
            limit: this.pagination.options.itemsPerPage,
            country: this.filterParams.country,
            searchPhrase: this.searchPhrase,
            startDate: this.filterParams.startDate,
            scheduledActivity: this.activity,
            farmName:  this.filterParams.farmName, //farmname is id
            cropType:  this.filterParams.cropType, //farmname is id
            ...(this.activity == "completed" && {endDate: moment().format("DD-MMM-YYYY")})
            
          },
          this.$route.params.id
        );

        if (data.info.length) {
          this.activities = data["info"];
          Array.from(data["info"])
        } else {
          this.activities = [];
          this.pagination.totalPages = 0;
        }
        this.pagination.totalItems = data["pagination"].totalItems || 0;

        this.pagination.from = start + 1;
        this.pagination.to = Math.min(end, this.pagination.totalItems);
        this.pagination.totalPages = Math.ceil(
          this.pagination.totalItems / this.pagination.options.itemsPerPage
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.loading = false;
      }
    },
    async fetchOptions(){
      try {
        const { data } = await FarmService.getFarmCalenderActivitiesOptions();
        if (data) {
          this.cropTypes = data.cropTypeList;
          this.farmNames = data.farmNameList;
          this.countryList = Array.from(new Set(data.countryList));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    pageChange(next) {
      this.pagination.options.page += next ? 1 : -1;
      this.fetchData();
    },
    clearSearchValue() {
      this.searchPhrase = "";
      this.fetchData();
    },
    debouncedFetchData: debounce(function () {
      this.fetchData();
    }, 700),
    searchQuery() {
      this.pagination.options.page = 1;
      this.debouncedFetchData();
    },
    resetSearchOnEmpty() {
      if (!this.searchPhrase) {
        this.pagination.options.page = 1;
        this.fetchData();
      }
    },
    clearFilters() {
    this.filterParams.farmName = null;
    this.filterParams.cropType = null;
    this.filterParams.startDate = null;
    this.filterParams.country = null;
    this.searchPhrase = "";

  },
  },
  filters: {
    formatDate(value) {
      return moment(value).format("DD-MMM-YYYY");
    },
  },
  async mounted() {
    this.startLoading();
    await this.fetchOptions();
    await this.fetchData();
    this.stopLoading();
  },
  created() {
  },
  watch: {
    filterParams: {
      handler(nV) {
        this.$emit('setFarmId', nV.farmName);
        this.fetchData();
      },
      deep: true,
      immediate: false,
    },
    searchPhrase() {
      this.searchQuery(); // Trigger search when searchPhrase changes
    },
  },
  mixins: [loadingMixin,DownloadMixin, DateMixin],
};
</script>

<style lang="scss" scoped>

.modal-border {
  border: 2px solid teal;
  border-radius: 4px;
}
</style>
