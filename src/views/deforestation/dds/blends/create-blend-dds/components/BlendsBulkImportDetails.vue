<template>
  <v-card elevation="0" class="px-4 py-4">
    <div>
      <span class="grey--text text-body-2">{{ $t('blends.imports.importCompleted') }}</span>
    </div>
    <div class="d-flex align-center">
      <v-progress-linear rounded height="8" value="100" color="primary"></v-progress-linear>
      <span class="primary--text font-weight-bold ml-2">{{ successFailedRatioPercentage }}%</span>
    </div>
    <div>
      <span class="grey--text text-body-2 records-status">
        {{ successRecordsCount }} {{ $t('of') }} {{ totalRecordsCount }} {{ $t('recordsImported') }}
      </span>
    </div>
    <div class="d-flex justify-space-between grey lighten-4 py-3 px-4 mt-4">
      <div @click="getFilteredData('all')" class="d-flex align-center flex-column cursor-pointer">
        <span class="text-h4">{{ totalRecordsCount }}</span>
        <span class="text-body-2">{{ $t('totalRecords') }}</span>
      </div>
      <div @click="getFilteredData('failed')" class="d-flex align-center flex-column cursor-pointer">
        <span class="text-h4 red--text">{{ failedRecordsCount }}</span>
        <span class="text-body-2">{{ $t('failed') }}</span>
      </div>
      <div @click="getFilteredData('success')" class="d-flex align-center flex-column cursor-pointer">
        <span class="text-h4 primary--text">{{ successRecordsCount }}</span>
        <span class="text-body-2">{{ $t('success') }}</span>
      </div>
    </div>

    <v-card class="py-4 mt-4 table-card" elevation="1">
      <v-data-table fixed-header height="400px" :headers="headers" hide-default-footer :items="filteredData">

        <template v-slot:item.blendTitle="{ item }">
          <div class="d-flex align-center">
            <span :class="item.blendTitle ? 'text-body-2' : 'text-body-2 red--text'">
              {{ item.blendTitle || 'N/A' }}
            </span>
          </div>
        </template>

        <template v-slot:item.blendCode="{ item }">
          <div class="d-flex align-center">
            <span :class="item.blendCode ? 'text-body-2' : 'text-body-2 red--text'">
              {{ item.blendCode || 'N/A' }}
            </span>
          </div>
        </template>
        <template v-slot:item.finalProductName="{ item }">
          <div class="d-flex align-center">
            <span :class="item.finalProductName ? 'text-body-2' : 'text-body-2 red--text'">
              {{ item.finalProductName || 'N/A' }}
            </span>
          </div>
        </template>
        <template v-slot:item.status="{ item }">
          <div>
            <v-tooltip v-if="item.status.toLowerCase() === 'failed'" bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-chip class="justify-center table-chip"
                  :color="item.status.toLowerCase() === 'success' ? 'primary' : 'error'" outlined v-bind="attrs"
                  v-on="on">
                  {{ capitalizeStatus(item.status) }}
                </v-chip>
              </template>
              <div>
                <ul class="tooltip-messages">
                  <li v-for="(message, index) in item.messages" :key="index">
                    {{ message }}
                  </li>
                </ul>
              </div>
            </v-tooltip>
            <v-chip v-else class="justify-center table-chip"
              :color="item.status.toLowerCase() === 'success' ? 'primary' : 'error'" outlined>
              {{ capitalizeStatus(item.status)  }}
            </v-chip>
          </div>
        </template>
      </v-data-table>
    </v-card>
    <div v-if="hasFailedRecords" class="mt-4 mx-3 text-caption">
  <span class="error--text font-weight-bold">
    {{ $t('blends.imports.importantNote') }}:
  </span>
  <span class="font-weight-normal normal--text">
    {{ $t('blends.imports.importData') }}
  </span>
</div>
    <v-divider class="my-5 px-0"></v-divider>
    <v-card-actions class="px-0">
      <v-spacer></v-spacer>
      <v-btn @click="handleContinue" width="112" color="primary" class="btn-11 btn-22">
        {{ $t('continue') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import loadingMixin from '@/mixins/LoadingMixin';

export default {
  mixins: [loadingMixin],
  props: {
    responseImport: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {

    hasFailedRecords() {
    return this.filteredData.some(
      (item) => item.status.toLowerCase() === "failed"
    );
  },
    successFailedRatioPercentage() {
      return this.totalRecordsCount
        ? ((this.successRecordsCount / this.totalRecordsCount) * 100).toFixed(2)
        : 0;
    },
  },
  data() {
    return {
      successRecordsCount: 0,
      totalRecordsCount: 0,
      failedRecordsCount: 0,
      importItems: [],
      filteredData: [],
      headers: [
        {
          text: this.$t("blends.imports.blendTitle"),
          align: "start",
          value: "blendTitle",
          class: "black--text",
        },
        {
          text: this.$t("blends.imports.blendCode"),
          align: "start",
          value: "blendCode",
          class: "black--text",
        },
        {
          text: this.$t("blends.imports.finalProductName"),
          align: "start",
          value: "finalProductName",
          class: "black--text",
        },
        {
          text: this.$t("blends.imports.status"),
          align: "center",
          value: "status",
          class: "black--text",
        },
      ],
    };
  },
  created() {
    this.fetchImportItems();
  },
  methods: {
    fetchImportItems() {
      // Normalize and populate data
      this.importItems = this.responseImport || {};
      this.filteredData = this.normalizeData(this.importItems?.data || []);
      this.totalRecordsCount = this.importItems?.totalRecords || 0;
      this.failedRecordsCount = this.importItems?.failedRecords || 0;
      this.successRecordsCount = this.totalRecordsCount - this.failedRecordsCount;
    },
    normalizeData(data) {
      return data.map((item) => ({
        blendTitle: item["Blend Title"] || item.blendTitle,
        blendCode: item["Blend Code"] || item.blendCode,
        finalProductName:
          item["Final Product Name"] || item.finalProductName,
        status: item.status,
        messages: item.messages || [],
      }));
    },
    capitalizeStatus(status) {
    if (!status) return '';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  },
    handleContinue() {
      this.$router.push({ name: 'blendSettings' })
    },
    getFilteredData(type) {
      if (type === "all") {
        this.filteredData = [...this.importItems?.data];
      } else {
        const filtered = this.importItems?.data?.filter(
      (item) => item.status.toLowerCase() === type.toLowerCase()
    );
    this.filteredData = this.normalizeData(filtered || []);

      }
    },
  },
};

</script>
<style lang="css">

.record-status {
  text-transform: lowercase;
}
.v-data-table-header th{
 background: #117443 !important;
}
.table-chip {
  width: 100px;
}
.cursor-pointer {
  cursor: pointer;
}
</style>