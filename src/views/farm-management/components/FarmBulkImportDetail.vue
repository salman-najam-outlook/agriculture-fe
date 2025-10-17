<template>
  <v-card elevation="0" class="px-4 py-4">
    <div>
      <span class="grey--text text-body-2">{{ $t('farm.importCompleted') }}</span>
    </div>
    <div class="d-flex align-center">
      <v-progress-linear rounded height="8" value="100" color="primary"></v-progress-linear>
      <span class="primary--text font-weight-bold ml-2">100%</span>
    </div>
    <div>
      <span class="grey--text text-body-2" style="text-transform: lowercase;">
        {{ successRecordsCount }} {{ $t('of') }} {{ detail.totalRecordsCount }} {{ $t('recordsImported') }}
      </span>
    </div>
    <div class="d-flex justify-space-between grey lighten-4 py-3 px-4 mt-4">
      <div class="d-flex align-center flex-column">
        <span class="text-h4">{{ detail.totalRecordsCount }}</span>
        <span class="text-body-2">{{ $t('totalRecords') }}</span>
      </div>
      <div class="d-flex align-center flex-column">
        <span class="text-h4 red--text">{{ detail.failedRecordsCount }}</span>
        <span class="text-body-2">{{ $t('failed') }}</span>
      </div>
      <div class="d-flex align-center flex-column">
        <span class="text-h4 primary--text">{{ successRecordsCount }}</span>
        <span class="text-body-2">{{ $t('success') }}</span>
      </div>
    </div>

    <v-card class="py-4 mt-4" elevation="1" style="max-height: 480px; overflow: auto;">
      <v-data-table disable-pagination :headers="tableHeaders" :items="detail.records" hide-default-footer>
        <template v-slot:item.payloadJsonData.farmName="{ item }">{{ getFarmName(item) }}</template>
        <template v-slot:item.payloadJsonData.farmerFirstName="{ item }">{{ getFarmerName(item) }}</template>
        <template v-slot:item.status="{ item }">
          <v-chip
            style="width: 100px;"
            class="justify-center"
            :color="item.status.toLowerCase() === 'success' ? 'primary' : 'error'"
            outlined
          >
            {{ item.status }}
          </v-chip>
        </template>
        <template v-slot:item.action="{ item }">
          <div v-if="item.status.toLowerCase() !== 'success'">
            <v-btn @click="retryRecord(item.id)" icon elevation="2" class="mr-2">
              <v-icon>mdi-sync</v-icon>
            </v-btn>
            <v-btn @click="deleteRecord(item.id)" icon elevation="2">
              <v-icon>mdi-trash-can-outline</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>
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
import axios from 'axios';
import loadingMixin from '@/mixins/LoadingMixin';

export default {
  mixins: [loadingMixin],
  props: {
    defaultDetail: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      detail: this.defaultDetail,
      tableHeaders: [
        {
          text: this.$t('farmName'),
          align: 'start',
          value: 'payloadJsonData.farmName',
          class: 'black--text',
        },
        {
          text: this.$t('memberDataSection.farmerName'),
          align: 'start',
          value: 'payloadJsonData.farmerFirstName',
          class: 'black--text',
        },
        {
          text: this.$t('memberDataSection.farmLocation'),
          align: 'start',
          value: 'payloadJsonData.address',
          class: 'black--text',
        },
        {
          text: this.$t('oma.status'),
          align: 'center',
          value: 'status',
          class: 'black--text',
        },
        {
          text: this.$t('oma.action'),
          align: 'center',
          value: 'action',
          class: 'black--text',
          width: '120px',
        },
      ],
    };
  },

  methods: {
    getFarmName(record) {
      if (record.payloadJsonData.farmName) return record.payloadJsonData.farmName;
      if (record.recordedJsonData) return `#${record.recordedJsonData.id}`;
      return '';
    },
    getFarmerName(record) {
      if (record.payloadJsonData.isTechnician) {
        return [
          record.payloadJsonData.farmerFirstName,
          record.payloadJsonData.farmerMiddleName,
          record.payloadJsonData.farmerLastName,
        ]
          .filter(Boolean)
          .join(' ');
      } else if (record.payloadJsonData.user) {
        return [record.payloadJsonData.user.firstName, record.payloadJsonData.user.lastName].filter(Boolean).join(' ');
      } else {
        return [record.payloadJsonData.existingUser?.firstName, record.payloadJsonData.existingUser?.lastName]
          .filter(Boolean)
          .join(' ');
      }
    },

    async retryRecord(recordId) {
      try {
        this.startLoading();
        const response = await axios.post(`/farm/bulk-upload/records/${recordId}/retry`);
        const data = response.data;
        if (data.success) {
          this.detail = Object.assign({}, this.detail, {
            ...data.data.farmBulkUpload,
            records: this.detail.records.map((record) => {
              if (record.id == recordId) {
                return {
                  ...data.data,
                };
              }
              return record;
            }),
          });
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error(error);
        this.$notify({
          type: 'error',
          title: this.$t('failed'),
        });
      } finally {
        this.stopLoading();
      }
    },

    async deleteRecord(recordId) {
      try {
        this.startLoading();
        const response = await axios.delete(`/farm/bulk-upload/records/${recordId}`);
        const data = response.data;
        if (data.success) {
          this.detail = Object.assign({}, this.detail, {
            ...data.data.farmBulkUpload,
            records: this.detail.records.filter((record) => record.id != recordId),
          });
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error(error);
        this.$notify({
          type: 'error',
          title: this.$t('failed'),
        });
      } finally {
        this.stopLoading();
      }
    },

    handleContinue() {
      this.$emit('completed', this.detail);
    },
  },
  computed: {
    successRecordsCount() {
      return this.detail.totalRecordsCount - this.detail.failedRecordsCount;
    },
  },
};
</script>
