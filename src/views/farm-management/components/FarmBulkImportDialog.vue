<template>
  <div>
    <v-dialog persistent width="900" v-model="importDialog">
      <v-card class="custom-card" rounded="0">
        <v-toolbar color="secondary" class="white--text">
          <v-toolbar-title class="font-weight-bold">{{ $t('farm.importFarms') }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon class="white--text" :disabled="importing" @click="toggleImportDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <div style="position: relative;">
          <div v-if="importing" class="d-flex align-center justify-center white flex-column px-4 py-5">
            <v-progress-circular :size="75" color="primary" indeterminate></v-progress-circular>
            <p class="mt-10 text-center">
              {{ $t('farm.importingNote') }}
            </p>
          </div>
          <div v-show="!importing">
            <div class="px-4 py-3" v-if="!bulkImportDetail">
              <v-card elevation="0">
                <v-tabs class="tabs-pill" background-color="grey lighten-3" v-model="tab">
                  <v-tab class="text-capitalize" @click="type = 'import'">{{ $t('oma.import') }}</v-tab>
                  <v-tab class="text-capitalize" @click="type = 'history'">{{ $t('oma.history') }}</v-tab>
                </v-tabs>
              </v-card>
              <v-tabs-items v-model="tab">
                <v-tab-item key="import">
                  <FarmBulkImportTab
                    :format="format"
                    @cancelImport="toggleImportDialog"
                    @importFile="handleBulkImport"
                  />
                </v-tab-item>
                <v-tab-item key="history">
                  <FarmBulkImportHistoryTab />
                </v-tab-item>
              </v-tabs-items>
            </div>
            <div v-else>
              <FarmBulkImportDetail :defaultDetail="bulkImportDetail" @completed="restartProcess" />
            </div>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import FarmBulkImportTab from './FarmBulkImportTab';
import FarmBulkImportHistoryTab from './FarmBulkImportHistoryTab';
import FarmBulkImportDetail from './FarmBulkImportDetail';
import axios from 'axios';

export default {
  components: {
    FarmBulkImportTab,
    FarmBulkImportHistoryTab,
    FarmBulkImportDetail,
  },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    format: {
      type: String,
      required: true,
    },
  },
  computed: {
    importDialog: {
      get() {
        return this.value;
      },
      set() {
        this.$emit('input', !this.value);
      },
    },
  },

  data() {
    return {
      importing: false,
      bulkImportDetail: null,
      tab: 'import',
      hasImported: false,
    };
  },

  methods: {
    toggleImportDialog() {
      if (!this.importing) {
        const isOpen = this.value;
        this.importDialog = !isOpen;
        if(isOpen) {
          if(this.hasImported) {
            this.hasImported = false;
            this.$emit('bulkImportedFarms');
          }
          this.restartProcess();
        }
      }
    },
    async handleBulkImport(file, callback) {
      try {
        this.importing = true;
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post('/farm/bulk-upload', formData);
        const data = response.data;
        if (data.success) {
          this.bulkImportDetail = data.data;
          this.hasImported = true;
          if (typeof callback === 'function') {
            callback();
          }
        } else {
          console.log('IMPORT ERROR', data);
          this.$notify({
            type: 'error',
            title: data.message || this.$t('serverError'),
          });
        }
      } catch (error) {
        console.error(error);
        this.$notify({
          type: 'error',
          title: this.$t('serverError'),
        });
      } finally {
        this.importing = false;
      }
    },
    restartProcess() {
      this.bulkImportDetail = null;
      this.importing = false;
      this.tab = 'import';
    },
  },
};
</script>
