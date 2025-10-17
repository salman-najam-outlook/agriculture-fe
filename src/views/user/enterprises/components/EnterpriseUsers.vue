<template>
  <v-card flat class="pa-6">
    <div class="text-h6 font-weight-bold mb-4">Enterprise Users</div>

    <div class="custom-tabs mb-8">
      <v-tabs
        v-model="activeTab"
        height="36"
      >
        <v-tab class="text-none px-3" v-for="tab in tabs" v-bind:key="tab.value">
          <span class="text-body-2">{{ tab.name }}</span>
        </v-tab>
      </v-tabs>
    </div>

    <div class="d-flex justify-space-between align-center mb-6">
      <div class="text-subtitle-1 font-weight-medium">Users</div>
      <v-btn
        color="#04bc74"
        height="36"
        class="text-none font-weight-medium text-white"
      >
        REGISTER USER(S)
        <v-icon right small>mdi-chevron-down</v-icon>
      </v-btn>
    </div>

    <div class="d-flex align-center mb-4">
      <v-text-field
        v-model="search"
        @keyup="searchUsers"
        placeholder="Search"
        prepend-inner-icon="mdi-magnify"
        dense
        outlined
        hide-details
        class="mr-4"
        style="max-width: 240px"
      ></v-text-field>

      <v-btn icon class="mr-4" @click="loadEnterpriseUsers">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>

      <v-select
        v-model="selectedCountry"
        :items="countries"
        placeholder="All Countries"
        dense
        outlined
        hide-details
        class="mr-4"
        style="max-width: 180px"
        @change="countrySelection"
      ></v-select>

      <!-- <v-select
        v-model="selectedRegion"
        :items="regions"
        placeholder="All Regions"
        dense
        outlined
        hide-details
        class="mr-4"
        style="max-width: 180px"
      ></v-select>

      <v-select
        v-model="selectedForms"
        :items="forms"
        placeholder="All Forms"
        dense
        outlined
        hide-details
        class="mr-4"
        style="max-width: 180px"
      ></v-select> -->

      <v-spacer></v-spacer>

      <div class="text-body-2 text-grey mr-4">{{ page }} of {{ totalPages }}</div>
      
      <v-btn icon small class="mr-2" @click="updatePage(false)">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      
      <v-btn icon small @click="updatePage">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </div>

    <v-simple-table class="users-table">
      <template v-slot:default>
        <thead>
          <tr class="header-row">
            <th class="white--text" width="40">
              <v-checkbox
                v-model="selectAll"
                hide-details
                class="mt-0"
                color="white"
              ></v-checkbox>
            </th>
            <th class="white--text">
              Activation Key
              <v-icon small color="white">mdi-chevron-down</v-icon>
              
            </th>
            <th class="white--text">
              User Name & ID
              <v-icon small color="white">mdi-chevron-down</v-icon>
            </th>
            <th class="white--text">
              Email
              <v-icon small color="white">mdi-chevron-down</v-icon>
            </th>
            <th class="white--text">
              User Role
              <v-icon small color="white">mdi-chevron-down</v-icon>
            </th>
            <th class="white--text">
              User Registration Date
              <v-icon small color="white">mdi-chevron-down</v-icon>
            </th>
            <th class="white--text">
              Status
              <v-icon small color="white">mdi-chevron-down</v-icon>
            </th>
            <th width="40"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in enterpriseUsers" :key="item.id">
            <td>
              <v-checkbox
                v-model="item.selected"
                hide-details
                class="mt-0"
              ></v-checkbox>
            </td>
            <td class="text-no-wrap">{{ fetchActivation(item) }}</td>
            <td>
              <div>{{ item.firstName }} {{ item.lastName }}</div>
              <div class="text-caption text-grey">{{ item.id }}</div>
            </td>
            <td>{{ item.email || 'N/A' }}</td>
            <td>{{ fetchRole(item) }}</td>
            <td>{{ item.createdAt.split("T")[0] }}</td>
            <td>
              <v-chip
                small
                label
                class="text-none"
                color="#E8F5E9"
                text-color="#4CAF50"
                :class="getStatusClass(item.active)"
              >
                {{ item.active ? "Active": "Inactive" }}
              </v-chip>
            </td>
            <td>
              <v-btn icon x-small>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-card>
</template>

<script>
import UserService from '../../../../_services/UserService';
import { getCountries } from 'country-state-picker';

export default {
  name: 'EnterpriseUsers',
  props: ['enterpriseId'],
  data: () => ({
    activeTab: 0,
    search: '',
    status: null,
    selectAll: false,
    selectedCountry: null,
    selectedRegion: null,
    selectedForms: null,
    countries: ['All Countries'],
    regions: ['All Regions'],
    forms: ['All Forms'],
    page: 1,
    limit: 3,
    totalPages: 0,
    options: {
      sortBy: [],
      sortDesc: [],
    },
    tabs: [
      {
        name: "All",
        value: null
      },
      {
        name: "Active Users",
        value: "active"
      },
      {
        name: "Offline Users",
        value: "offline"
      },
      {
        name: "Deactivated Users",
        value: "inactive"
      },
      {
        name: "App Users",
        value: "end_user"
      },
      {
        name: "Admin Users",
        value: "admin"
      }
    ],
    enterpriseUsers: [],
    defaultCountry: "All Countries"
  }),
  created() {
    this.countries = getCountries().map((country) => country.name);
    this.countries.unshift(this.defaultCountry);
    this.selectedCountry = this.defaultCountry;
  },
  async mounted() {
    await this.loadEnterpriseUsers();
  },
  watch: {
    async activeTab(newValue) {
      if (newValue > 0) {
        this.status = this.tabs[newValue].value;
      } else {
        this.status = null;
      }

      await this.loadEnterpriseUsers();
    }
  },
  methods:{
    fetchRole(user) {
      if (user.user_role.length === 0) {
        return 'N/A';
      }

      return user.user_role[0].name;
    },
    fetchActivation(user) {
      if (user.activation.length === 0) {
        return 'N/A';
      }

      return user.activation[0].license_key;
    },
    getStatusClass(active) {
      return active ? 'status-active': 'status-deactivated';
    },
    async updatePage(prev = true) {
      if (!prev) {
        this.page = this.page === 1 ? 1: this.page - 1;
      } else {
        this.page = this.page < this.totalPages ? this.page + 1: this.totalPages;
      }

      await this.loadEnterpriseUsers();
    },
    async searchUsers() {
      if (this.search.length < 3 && this.search.length !== 0) {
        return;
      }

      await this.loadEnterpriseUsers();
    },
    async countrySelection() {
      await this.loadEnterpriseUsers();
    },
    async loadEnterpriseUsers() {
      const sortBy = this.options.sortBy.length > 0 ? this.options.sortBy[0]: null;
      const sortDesc =  this.options.sortDesc.length > 0 ? this.options.sortDesc[0]: true;

      if (!this.$props.enterpriseId) {
        return;
      }

      const { data, success } = await UserService.getEnterpriseUsers(
        this.$props.enterpriseId,
        this.status,
        {
          page: this.page,
          limit: this.limit,
          country: this.selectedCountry === this.defaultCountry ? null: this.selectedCountry,
          searchParams: this.search,
          sortBy,
          sortType: sortDesc ? 'ASC': 'DESC' 
        }
      );

      if (!success) {
        this.$notify({
          title: "Failed to load enterprise users",
          type: "error",
        });
        return;
      }

      data.rows.forEach((row) => {
        if (row.user_role.length > 0) {
          console.log(row.id, row.firstName, row.user_role[0].id);
        }
      })

      this.enterpriseUsers = data.rows;
      this.totalPages = Math.ceil(data.count / this.limit);
    }
  }
}
</script>

<style scoped>
.custom-tabs ::v-deep .v-tabs-bar {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.custom-tabs ::v-deep .v-tab {
  text-transform: none;
  letter-spacing: normal;
  min-width: 0;
}

.custom-tabs ::v-deep .v-tab--active {
  color: #4CAF50 !important;
}

.custom-tabs ::v-deep .v-tabs-slider {
  background-color: #4CAF50;
}

.users-table {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
}

.header-row {
  background-color: #147444 !important;
  height: 48px;
}

.text-white {
  color: white !important;
}

.header-row th {
  font-size: 14px !important;
  font-weight: 500 !important;
  color: white !important;
  padding: 0 16px !important;
  white-space: nowrap;
}

.users-table ::v-deep tbody tr td {
  height: 64px !important;
  padding: 0 16px !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
}

.users-table ::v-deep tbody tr:last-child td {
  border-bottom: none !important;
}

.users-table ::v-deep .v-input--selection-controls {
  margin: 0;
  padding: 0;
}
.v-chip {
  padding: 4px 12px !important;
  height: 24px !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  border-radius: 16px !important;
  text-transform: capitalize !important;
}

.status-active {
  background-color: #E8F5E9 !important;
  color: #2E7D32 !important;
  border: 1px solid #2ecc71 !important;
}

.status-process {
  background-color: #FFF3E0 !important;
  color: #EF6C00 !important;
  border: 1px solid #f1c40f !important;
  
}

.status-deactivated {
  background-color: #FFEBEE !important;
  color: #D32F2F !important;
  border: 1px solid #e74c3c !important;
}
</style>