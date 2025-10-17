<template>
  <div>
    <div class="d-flex mb-4">
        <h2 class="font-weight-black">{{ $t("blends.imports.importsBlends") }}</h2>
        <v-spacer></v-spacer>
        <div class="d-flex mt-1">
          <v-btn color="primary" outlined class="mr-2" @click="redirectListPage">
            {{ $t('cancel') }}
          </v-btn>
          <v-btn color="primary" dark class="mr-2" @click="createBlendSettings">
            {{ $t('blends.imports.createBlends') }}
          </v-btn>
        </div>

      </div>
    <v-card elevation="0">
      <v-card-text>
        <v-row>
          <v-col cols="12">
          
            <v-data-table :headers="headers" :items="historyItems" :items-per-page="10" :footer-props="{
              'items-per-page-options': [10, 25, 50],
            }" item-key="id" hide-default-footer :loading="tableLoading" @update:options="onSortUpdate">
              <template v-slot:top="{}">
                <div>
                  <p class="history-btn">
                    {{ $t("blends.history.history") }}
                  </p>
                </div>                  
                <div class="d-flex mt-5">
                  <v-text-field @input="onSearchInput" v-model="searchData" style="width: 290px; "
                    prepend-inner-icon="mdi-magnify" outlined height="5px"
                    :placeholder="$t('blends.manageProducts.search')" dense class="shrink">
                  </v-text-field>
                  <v-spacer></v-spacer>
                  <div class="py-1 title">
                    {{ pagination.from }} - {{ pagination.to }} {{ $t('of') }} {{ pagination.total }}
                  </div>
                  <v-btn class="mx-2" fab small outlined color="primary" :disabled="filterParams.page <= 1"
                    @click="pageChange(false)">
                    <v-icon dark>
                      mdi-chevron-left
                    </v-icon>
                  </v-btn>
                  <v-btn class="mx-2" fab small outlined color="primary" :disabled="pagination.to >= pagination.total"
                    @click="pageChange(true)">
                    <v-icon dark>
                      mdi-chevron-right
                    </v-icon>
                  </v-btn>
                </div>
              </template>
              <template v-slot:body="{ items }">
                <tbody v-if="items.length > 0">
                  <tr v-for="item in items" :key="item.id">
                    <td>{{ item.originalFileName }}</td>
                    <td>{{ getDateFormat(item.createdAt) }}</td>
                    <td>
                      <v-chip class="justify-center table-chip" :color="item.status.toLowerCase() === 'success' ? 'primary' : 'error'" outlined>
                        {{ item.status.toLowerCase() === 'success' ? $t('blends.history.success').toUpperCase() : $t('blends.history.failed').toUpperCase() }}
                      </v-chip>
                      </td>
                    <td>

                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              x-small
                              fab
                              color="white"
                              v-bind="attrs"
                              v-on="on"
                              class="ml-2"
                              @click="downloadFile(item.location)"
                            >
                              <v-icon color="primary">mdi-download</v-icon>
                            </v-btn>
                          </template>
                          <span>{{ $t("oma.download") }}</span>
                        </v-tooltip>

                    </td>
                  </tr>
                </tbody>
                <template v-else>
                  <tr>
                    <td class="text-center" :colspan="headers.length">{{ $t('noDataAvailable') }}</td>
                  </tr>
                </template>
              </template>
              <template v-slot:progress>
                <v-progress-linear color="primary" :height="6" indeterminate></v-progress-linear>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import moment from "moment";
import { get } from "lodash";
import { debounce } from 'lodash';
import BlendService from "@/_services/BlendService";

export default {
  created() {
    this.debouncedUpdateFilterParams = debounce(this.updateFilterParams, 500);
  },
  mounted() {
    this.fetchBlendHistoryData()
  },
  components: {
  },
  data() {
    return {
      tab: 'import',
      responseImport: null,
      isImportResponse: false,
    
      historyItems: [],
      headers: [
        {
          text: this.$t("blends.history.fileName"),
          align: "start",
          value: "originalFileName",
          class: "black--text",
        },
        {
          text: this.$t("blends.history.importedOn"),
          align: "start",
          value: "createdAt",
          class: "black--text",
        },
        {
          text: this.$t("blends.history.status"),
          align: "center",
          value: "status",
          class: "black--text",
        },
        {
          text: this.$t("blends.history.action"),
          align: "center",
          key: "action",
          value: "action",
          class: "black--text",
          width: '120px'
        },
      ],
      filterParams: {
        search: "",
        page: 1,
        limit: 10,
        sortBy: "createdAt",
        sortOrder: "asc"
      },
      pagination: {
        from: 1,
        to: 10,
        total: 0,
      },
      tableLoading: false,
      searchData: ""
    };
  },
  watch: {
    filterParams: {
      async handler() {
        await this.fetchBlendHistoryData();
      },
      deep: true,
    },
  },
  methods: {

    downloadFile(location) {
    window.open(location, '_blank');
  },
  importSuccessCallback(response) {
      this.responseImport = response;
      this.isImportResponse = !!response?.data;
    },
    createBlendSettings() {
      this.$router.push({ name: 'createBlendSettings' })      
    },
    redirectListPage() {
      this.$router.push({ name: 'blendSettings' })
    },
    async fetchBlendHistoryData() {
      try {
        this.tableLoading = true
        await BlendService.getAllUploadHistory(this.filterParams).then((res) => {
          if (res.data) {
            this.historyItems = get(res, 'data.getAllBulkUploadHistory.rows', []);
            this.pagination.total = get(res, 'data.getAllBulkUploadHistory.totalCount', 0);
            this.pagination.from = (this.filterParams.page - 1) * this.filterParams.limit + 1;
            this.pagination.to = this.filterParams.page * this.filterParams.limit - (this.filterParams.limit - this.historyItems?.length)
          } else {
            this.clearPaginationData();
          }
        });
      } catch (err) {
        console.log(err);
      } finally {
        this.tableLoading = false
      }
    },
    getDateFormat(date) {
      return moment(date).format("DD-MMM-YYYY");
    },
    onSortUpdate(sort) {
      this.filterParams.sortBy = get(sort, "sortBy[0]", "createdAt");
      this.filterParams.sortOrder = get(sort, "sortDesc[0]", false) ? "asc" : "desc";
      this.filterParams.page = 1;
    },
    updateFilterParams() {
      this.filterParams.search = this.searchData;
    },
    onSearchInput() {
      this.searchData = this.searchData.trim();
      this.debouncedUpdateFilterParams();
    },
    pageChange(t) {
      if (t) this.filterParams.page = this.filterParams.page + 1;
      else this.filterParams.page = this.filterParams.page - 1;
    },
    clearPaginationData() {
      this.historyItems = [];
      this.pagination.total = 0;
      this.pagination.from = 0;
      this.pagination.to = 0;
    },
  },
};
</script>
<style lang="scss">
.download-style{
  text-decoration: none;
  color: blue !important;
}
.history-btn{
  font-size: 18px;
  font-weight: 600
}
.v-btn.fab {
  box-shadow: none;
}
.v-data-table td:nth-child(3) { 
  text-align: center;
}
</style>
