<template>
  <v-card class="my-4" elevation="1">
    <v-card-title class="px-0">
      <form class="d-flex align-stretch" @submit.prevent="onSearch">
        <v-text-field
          v-model="searchInput"
          outlined
          dense
          elevation="0"
          prepend-inner-icon="mdi-magnify"
          :placeholder="$t('oma.search')"
          hide-details
        ></v-text-field>
        <v-btn :disabled="loading" icon dense outlined type="submit" class="rounded ml-2" style="height: auto;">
          <v-icon>mdi-filter-outline</v-icon>
        </v-btn>
      </form>
      <div class="d-flex align-center ml-auto">
        <span class="text-body-2 mr-2" v-if="total"> {{ rangeStart }} - {{ rangeEnd }} {{ $t('of') }} {{ total }} </span>
        <v-btn @click="handlePrev" :disabled="!hasPrevPage || loading" icon dense outlined color="primary" class="mr-2">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn @click="handleNext" :disabled="!hasNextPage || loading" icon dense outlined color="primary">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>
    </v-card-title>
    <v-data-table
      :options.sync="options"
      :server-items-length="total"
      :items="histories"
      :loading="loading"
      :headers="headers"
      hide-default-footer
    >
      <template v-slot:item.createdAt="{ item }">
        <span>{{ formatDate(item.createdAt) }}</span>
      </template>
      <template v-slot:item.status="{ item }">
        <v-chip :color="item.status.toLowerCase() === 'success' ? 'primary' : 'warning'" outlined>{{
          item.status
        }}</v-chip>
      </template>
      <template v-slot:item.action="{ item }">
        <v-btn text dense  color="blue"><a style="text-decoration: none;" :href=item.location>{{
          $t('oma.download')
        }}</a> </v-btn>
        <!-- <v-btn text dense @click="downloadFile(item.location, item.originalFileName)" color="blue">{{
          $t('oma.download')
        }}</v-btn> -->
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import loadingMixin from '@/mixins/LoadingMixin';

export default {
  mixins: [loadingMixin],
  data() {
    return {
      searchInput: '',
      total: 0,
      options: {
        sortBy: [],
        sortDesc: [],
        page: 1,
        itemsPerPage: 10,
        search: '',
      },
      loading: true,
      histories: [],
      headers: [
        {
          text: this.$t('oma.fileName'),
          align: 'center',
          value: 'originalFileName',
          class: 'black--text',
        },
        {
          text: this.$t('oma.importedOn'),
          align: 'center',
          value: 'createdAt',
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
        },
      ],
    };
  },

  watch: {
    options: {
      handler() {
        this.fetchFarmBulkUploadHistory();
      },
      deep: true,
    },
  },

  methods: {
    async fetchFarmBulkUploadHistory() {
      try {
        this.loading = true;
        const { search, sortBy, sortDesc, page, itemsPerPage } = this.options;
        const response = await axios.get('/farm/bulk-upload', {
          params: {
            page,
            search,
            limit: itemsPerPage,
            orderBy: sortBy.length ? sortBy[0] : '',
            order: sortDesc.length ? (sortDesc[0] ? 'DESC' : 'ASC') : 'DESC',
          },
        });
        const data = response.data;
        if (data.success) {
          this.total = data.data.count;
          this.histories = data.data.rows;
        } else {
          throw new Error(data?.message);
        }
      } catch (error) {
        console.error(error);
        this.$notify({
          type: 'error',
          title: this.$t('serverError'),
        });
      } finally {
        this.loading = false;
      }
    },
    onSearch() {
      this.options = Object.assign({}, this.options, {
        search: this.searchInput?.trim() || '',
        page: 1,
      });
    },
    handlePrev() {
      if (this.hasPrevPage) {
        this.options.page = this.options.page - 1;
      }
    },
    handleNext() {
      if (this.hasNextPage) {
        this.options.page = this.options.page + 1;
      }
    },
    formatDate(date) {
      return moment(date).format('DD-MMM-YYYY');
    },
    async downloadFile(fileLocation, fileName) {
      this.startLoading();
      try {
        const response = await axios.get(fileLocation, { responseType: 'blob' });
        const href = window.URL.createObjectURL(response.data);
        const linkEl = document.createElement('a');
        linkEl.href = href;
        linkEl.setAttribute('download', fileName || fileLocation.split('/').pop());
        linkEl.click();
        window.URL.revokeObjectURL(href);
      } catch (error) {
        console.error('error');
        this.$notify({
          type: 'error',
          title: this.$t('failed'),
        });
      } finally {
        this.stopLoading();
      }
    },
  },

  computed: {
    rangeStart() {
      return (this.options.page - 1) * this.options.itemsPerPage + 1;
    },
    rangeEnd() {
      return Math.min(this.options.page * this.options.itemsPerPage, this.total);
    },
    hasNextPage() {
      return this.total > this.options.page * this.options.itemsPerPage;
    },
    hasPrevPage() {
      return this.options.page != 1;
    },
  },
};
</script>
