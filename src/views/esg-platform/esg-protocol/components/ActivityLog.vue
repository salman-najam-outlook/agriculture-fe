<template>
  <v-dialog v-model="dialog" width="900">
    <v-card>
      <v-toolbar color="primary" dark>
        {{ $t('esgPlatform.activityLog') }}
        <v-spacer></v-spacer>
        <v-btn icon @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="pt-6">
        <h3 class="black--text pb-3">
          {{ $t('esgPlatform.activityLogFor') }} {{ activityData.title }}
        </h3>
        <p>
          {{ $t('esgPlatform.activityLogDesc') }}
        </p>
        <v-data-table 
          :headers="headers" 
          :items="activityLog" 
          :items-per-page="tableOptions.itemsPerPage"
          :server-items-length="totalItems"
          :loading="loading"
          hide-default-footer
          class="elevation-0 mt-4"
        >
          <template v-slot:top>
            <div class="d-flex mt-5 mb-2">
              <v-spacer></v-spacer>
              <div class="d-flex justify-center align-center">
                <div class="py-1 title">
                  {{ from }} - {{ to }} {{ $t('of') }} {{ totalItems }}
                </div>
                <v-btn 
                  class="mx-2" 
                  fab 
                  small 
                  outlined 
                  color="primary" 
                  :disabled="tableOptions.page <= 1"
                  @click="handlePageChange(tableOptions.page - 1)"
                >
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn 
                  class="mx-2" 
                  fab 
                  small 
                  outlined 
                  color="primary" 
                  :disabled="tableOptions.page >= totalPages"
                  @click="handlePageChange(tableOptions.page + 1)"
                >
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </div>
            </div>
          </template>
          <template v-slot:item.date="{ item }">
            {{ formatDateTime(item.date) }}
          </template>
          <template v-slot:item.description="{ item }">
            <span v-html="item.description"></span>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="closeModal">{{ $t('close') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

import ESGService from "@/_services/EsgService";
import loadingMixin from "@/mixins/LoadingMixin";

export default {
  props: {
    dialog: {
      type: Boolean,
      required: true
    },

    activityData: {
      type: Object,
      required: true
    }
  },
  async mounted() {
    await this.getActivity();
  },
  data() {
    return {
      headers: [
        { text: 'User', value: 'user' },
        { text: 'IP Address', value: 'ipAddress' },
        { text: 'Date & Time', value: 'date' },
        { text: 'Action', value: 'action' },
        { text: 'Activity Description', value: 'description' },
      ],
      activityLog: [],
      totalItems: 0,
      tableOptions: {
        page: 1,
        itemsPerPage: 10,
      },
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.tableOptions.itemsPerPage);
    },
    from() {
      return (this.tableOptions.page - 1) * this.tableOptions.itemsPerPage + 1;
    },
    to() {
      const to = this.tableOptions.page * this.tableOptions.itemsPerPage;
      return to > this.totalItems ? this.totalItems : to;
    },
  },
  methods: {
    closeModal() {
      this.$emit('closeModal');
    },
    formatDateTime(date) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
      return new Date(date).toLocaleDateString('en-GB', options);
    },

    async handlePageChange(newPage) {
      this.tableOptions.page = newPage;
      await this.getActivity();
    },

    async getActivity() {
      this.startLoading();
      try {
        const params = {
          taggedModel: 'EsgProtocol',
          taggedDocId: this.activityData?.id,
          page: this.tableOptions.page,
          limit: this.tableOptions.itemsPerPage,
        };

        const response = await ESGService.getUserActivity(params);
        
        if (response.success) {
          this.activityLog = response.data.rows.map((item) => ({
            user: item.user?.fullName || "",
            ipAddress: item.clientMetadata?.ipAddress || "",
            date: item.createdAt,
            action: item.action,
            description: this.getActivityDescription(item),
          }));
          
          // Update pagination data
          this.totalItems = response.data.totalItems;
        } else {
          console.error("Failed to fetch activity log:", response.message);
        }
      } catch (error) {
        console.error("Error fetching activity log:", error);
      } finally {
        this.stopLoading();
      }
    },

    getActivityDescription(item) {
      const parts = [];

      if (item.action) {
        switch (item.action.toLowerCase()) {
          case 'created':
            parts.push('<b>Created</b>');
            break;
          case 'updated':
            parts.push('<b>Updated</b>');
            break;
          case 'deleted':
            parts.push('<b>Deleted</b>');
            break;
          default:
            parts.push(`<b>${item.action}</b>`);
        }
      }

      if (item.docModel) {
        switch (item.docModel) {
          case 'EsgProtocol':
            parts.push('<b>Protocol</b>');
            break;
          case 'EsgGoal':
            parts.push('<b>Goal</b>');
            break;
          case 'EsgIssue':
            parts.push('<b>Issue</b>');
            break;
          default:
            parts.push(`<b>${item.docModel}</b>`);
        }
      }

      if (item.doc?.title) {
        parts.push(`"${item.doc.title}"`);
      }

      if (item.changes) {
        if (item.action === 'created') {
          parts.push(`by ${item.user?.fullName || 'Unknown User'}`);
        } else if (item.action === 'updated') {
          const changesList = Object.keys(item.changes)
            .filter(key => !['_id', 'createdAt', 'updatedAt', 'deleted', '__v'].includes(key))
            .join(', ');

          if (changesList) {
            parts.push(`(modified: ${changesList})`);
          }
        }
      }

      return parts.join(" ");
    },

    getOrganizationName(orgId) {
      return `Organization ${orgId}`;
    },

    getProtocolName(protocolId) {
      return `Protocol ${protocolId}`;
    },

    getUserName(userId) {
      return `User ${userId}`;
    }
  },
  mixins: [loadingMixin],
  watch: {
    dialog(newVal) {
      if (newVal) {
        this.tableOptions.page = 1;
        this.getActivity();
      }
    },
  },
};
</script>

<style scoped>
.v-data-table b {
  font-weight: 600;
  color: #000;
}
</style>