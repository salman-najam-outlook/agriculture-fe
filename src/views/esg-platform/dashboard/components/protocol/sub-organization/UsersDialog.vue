<template>
  <v-dialog
    :value="value"
    @input="$emit('input', $event)"
    @click:outside="$emit('input', false)"
    @keydown.esc="$emit('input', false)"
    max-width="960px"
  >
    <v-card>
      <v-card-title style="background-color: #117443; font-size: 0.875rem" class="white--text font-weight-bold">
        {{ $t('esgPlatform.listOfUsers') }}
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('input', false)" class="white--text">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="py-6 black--text">
        <div class="text-h6 font-weight-bold">{{ $t('esgPlatform.totalUsers') }}: {{ total }}</div>
        <v-row justify="space-between" class="mt-1" align="center">
          <v-col cols="auto" style="max-width: 320px">
            <v-text-field
              :value="options.search"
              @input="debounceSearch"
              :label="$t('search')"
              append-icon="mdi-magnify"
              outlined
              dense
              single-line
              hide-details
              class="w-100"
            ></v-text-field>
          </v-col>
          <v-col cols="auto">
            <v-row align="center">
              <v-col cols="auto">{{ options.page }} {{ $t('of') }} {{ totalPages }}</v-col>
              <v-col cols="auto">
                <v-btn color="primary" :disabled="options.page <= 1" @click="onPageUpdate(options.page - 1)" outlined icon>
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn color="primary" class="ml-2" outlined icon :disabled="options.page >= totalPages" @click="onPageUpdate(options.page + 1)">
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-data-table :loading="loading" class="mt-4" :headers="tableHeaders" :items="items" :items-per-page="options.limit" hide-default-footer>
          <template v-slot:item.fullName="{ item }">
            <span style="color: #117443; text-decoration: underline">{{ item.fullName }}</span>
          </template>
        </v-data-table>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" outlined @click="$emit('input', false)">{{ $t('cancel') }}</v-btn>
        <v-btn color="primary" @click="$emit('input', false)">{{ $t('close') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import _ from 'lodash';
import EsgService from '../../../../../../_services/EsgService';

export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    totalUsers: {
      type: Number,
      default: 0,
    },
    optionId: {
      type: String,
      default: null,
    },
    protocolId: {
      type: String,
      required: true,
    },
    subOrganizationId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      total: this.$props.totalUsers,
      options: {
        search: '',
        page: 1,
        limit: 10,
      },
      loading: true,
      tableHeaders: [
        { text: this.$t('name'), value: 'fullName', sortable: false },
        { text: this.$t('type'), value: 'typeFormatted', sortable: false },
      ],
      items: [],
    };
  },

  computed: {
    totalPages() {
      return Math.ceil(this.total / this.options.limit);
    },
  },

  watch: {
    options: {
      handler() {
        this.fetchUsers();
      },
      deep: true,
    },

    value(newValue) {
      if (newValue) {
        this.total = this.totalUsers;
        this.fetchUsers();
      } else {
        this.items = [];
        this.options.page = 1;
        this.options.search = '';
      }
    },
  },

  methods: {
    async fetchUsers() {
      if(!this.value) return;
      this.loading = true;
      try {
        const response = await EsgService.getRecommendedUsersOfSubOrganizationForOption(
          this.protocolId,
          this.subOrganizationId,
          this.optionId,
          this.options
        );
        this.items = response.data.users;
        this.total = response.data.total;
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        this.loading = false;
      }
    },

    debounceSearch: _.debounce(function (search) {
      if(search !== this.options.search) {
        this.options.search = search;
        this.options.page = 1;
      }
    }, 1000),

    onPageUpdate(page) {
      const _page = isNaN(parseInt(page)) ? 1 : parseInt(page);
      this.options.page = _page > 0 ? _page : 1;
    }
  },
};
</script>
