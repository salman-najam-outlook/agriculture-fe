<template>
  <div class="enterprise-list">
    <div class="d-flex align-center px-6 pt-6">
      <div class="d-flex align-center" style="flex: 0 0 300px">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          :placeholder="$t('search')"
          outlined
          dense
          hide-details
          class="search-field mr-4"
          style="max-width: 300px"
          @model="search"
          @keyup="searchEnterprises"
        ></v-text-field>
       </div>

       <div class="flex-grow-1 d-flex justify-center">
        <v-btn color="primary" height="40" class="px-4" outlined small @click="exportToCSV">
          <v-img width="15px" src="/icons/pngfile.png"></v-img>
          <span class="ml-2"><strong>{{ $t('exportAsCSV') }}</strong></span>
        </v-btn>
      </div>

      <div class="d-flex align-center">
        <span class="grey--text text--darken-1">{{ fromItem }} of {{ totalItems }}</span>
        <div class="ml-4">
          <v-btn 
            icon
            small
            class="mx-1"
            :disabled="page <= 1"
            @click="updatePage(false)"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn 
            icon
            small
            :disabled="page >= totalPages"
            @click="updatePage"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
      </div>
    </div>

    <div v-if="selected.length" class="px-6 pt-4">
      <div class="d-flex align-center">
        <span class="grey--text text--darken-1 mr-4">{{ selected.length }} {{$t('Enterprises.ListingEnterprises.Records_Selected')}}</span>
        <v-btn
          color="primary"
          class="text-none mr-4"
          height="36"
          @click="queueActivation"
        >
        {{$t('Enterprises.ListingEnterprises.Create_Admin_Environment')}}
          <!-- CREATE ADMIN ENVIRONMENT -->
        </v-btn>
        <v-btn
          outlined
          color="error"
          class="text-none"
          height="36"
          @click="queueActivation(false)"
        >
          {{$t('Enterprises.ListingEnterprises.Deactivate')}}
          <!-- DEACTIVATE -->
        </v-btn>
      </div>
    </div>

    <div v-if="type == 'list'">
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="enterprises"
        :loading="loading"
        show-select
        hide-default-footer
        class="enterprise-table mt-6"
        :options.sync="enterprisesOptions"
      >
        <template v-slot:header.enterprise>
          <span class="table-header">Enterprise</span>
        </template>

        <template v-slot:item.registrationDate="{ item }">
          {{ item.registrationDate.split("T")[0] }}
        </template>

        <template v-slot:item.status="{ item }">
          <v-chip
            small
            label
            class="status-chip font-weight-medium"
            :class="getStatusClass(item.status)"
          >
            {{ item.status }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-menu bottom left offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                small
                v-bind="attrs"
                v-on="on"
              >
                <v-icon size="20">mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item @click="viewEnterprise(item)">
                <v-list-item-title>
                {{ $t('Enterprises.ListingEnterprises.View') }}  
                  <!-- View -->
                </v-list-item-title>
              </v-list-item>
              <!-- <v-list-item @click="editEnterprise(item)">
                <v-list-item-title>
                {{ $t('Enterprises.ListingEnterprises.Edit') }}
                  Edit
                </v-list-item-title>
              </v-list-item> -->
              <!-- <v-list-item @click="requestReports(item)" :disabled="true">
                <v-list-item-title>Request Extra Reports</v-list-item-title>
              </v-list-item>
              <v-list-item @click="activation(item.id, true)" :disabled="item.status==='active'">
                <v-list-item-title>Create Admin Environment</v-list-item-title>
              </v-list-item> -->
              <v-divider></v-divider>
              <v-list-item @click="activation(item.id, false)" :disabled="item.status==='deactivated'">
                <v-list-item-title class="error--text">Deactivate</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </div>
    <div v-else>
      <v-row class="mx-3 mt-5">
        <v-col cols="3" v-for="enterprise in enterprises" v-bind:key="enterprise.id">
          <v-card elevation="2">
            <v-card-title>
              <v-list-item class="px-0">
                <v-list-item-avatar
                  tile
                  size="50"
                >
                  <v-img :src="enterprise.logo || defaultLogo"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="mb-1">
                    <v-row>
                      <v-col cols="10">
                        <p class="title-box text-h6 mb-0">{{ enterprise.name }}</p>
                      </v-col>
                      <v-col class="status-container" cols="2">
                        <span :class="'status-dot ' + enterprise.status"></span>
                      </v-col>
                    </v-row>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="6">
                  <p class="text-title mb-2">{{$t('Enterprises.Registration_Date')}}</p>
                  <p class="mb-0">{{ enterprise.registrationDate.split("T")[0] }}</p>
                </v-col>
                <v-col cols="6">
                  <p class="text-title mb-2">{{$t('Enterprises.Activation_Keys')}}</p>
                  <p class="mb-0">{{ enterprise.activationKeysAllowed }}</p>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <v-dialog
        v-model="dialog"
        persistent
        max-width="500"
    >
        <v-card>
            <v-toolbar
                color="primary"
                elevation="0"
            >
                <v-toolbar-title class="white--text">{{$t('Enterprises.AdminEnvironmentDialog.Create_Admin_Environment')}}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn
                    color="white"
                    icon
                    @click="dialog = false"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text class="pt-5 black--text text-center">
              <img src="/img/progress.svg" class="progress-img" alt="">
              <p class="text-center title-text mt-5">{{ queueAction }} Admin Environment<br>Please Wait</p>
            </v-card-text>
        </v-card>
    </v-dialog>
  </div>
</template>

<script>
import UserService from '../../../../_services/UserService';
import loadingMixin from "@/mixins/LoadingMixin";

export default {
  name: 'ListingEnterprises',
  props: ['type'],
  mixins: [loadingMixin],
  data() {
    return {
      defaultLogo: '/img/logo2.png',
      search: '',
      selected: [],
      loading: false,
      page: 1,
      itemsPerPage: 8,
      totalItems: 0,
      queryLoading: false,
      dialog: false,
      headers: [
        {
          text: this.$t('Enterprises.ListingEnterprises.Enterprise'),
          align: 'start',
          value: 'name',
          sortable: true,
        },
        // { 
        //   text: 'License ID', 
        //   value: 'licenseId',
        //   sortable: true,
        // },
        // { 
        //   text: 'Membership Plan', 
        //   value: 'membershipPlan',
        //   sortable: true,
        // },
        // { 
        //   text: 'Membership Expiry', 
        //   value: 'membershipExpiry',
        //   sortable: true,
        // },
        {
          // text: 'Registration Date',
          text: this.$t('Enterprises.ListingEnterprises.Registration_Date'),
          value: 'registrationDate',
          sortable: true,
        },
        {
          // text: 'Activation Keys',
          text: this.$t('Enterprises.ListingEnterprises.Activation_Keys'),
          value: 'activationKeysAllowed',
          sortable: true,
        },
        {
          // text: 'Status', 
          text: this.$t('Enterprises.ListingEnterprises.Status'),
          value: 'status',
          sortable: false,
        },
        { 
          // text: 'Actions', 
          text: this.$t('Enterprises.ListingEnterprises.Actions'),
          value: 'actions', 
          sortable: false,
          align: 'center'
        },
      ],
      enterprisesOptions: {},
      enterprises: [],
      queueAction: ''
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage)
    },
    fromItem() {
      return ((this.page - 1) * this.itemsPerPage) + 1
    },
  },
  async mounted() {
    await this.loadEnterprises();
  },
  watch: {
    enterprisesOptions: {
      handler() {
        this.loadEnterprises();
      },
      deep: true,
    },
  },
  methods: {
    getStatusClass(status) {
      switch (status.toLowerCase()) {
        case 'active':
          return 'status-active'
        case 'deactivated':
          return 'status-deactivated'
        default:
          return ''
      }
    },
    async updatePage(increment=true) {
      if (this.queryLoading) return;
      this.queryLoading = true;
      this.page = increment ? this.page + 1: this.page - 1;
      await this.loadEnterprises();
      this.queryLoading = false;
    },
    async loadEnterprises() {
      const sortBy = this.enterprisesOptions.sortBy.length > 0 ? this.enterprisesOptions.sortBy[0]: null;
      const sortDesc =  this.enterprisesOptions.sortDesc.length > 0 ? this.enterprisesOptions.sortDesc[0]: true;

      const { data, success } = await UserService.getEnterprises({
        page: this.page,
        limit: this.itemsPerPage,
        searchParams: this.search,
        sortBy: sortBy,
        sortType: sortDesc ? 'ASC': 'DESC'
      });

      if (!success) {
        this.$notify({
          title: "Failed to load enterprises",
          type: "error",
        });
        return;
      }

      this.enterprises = data.rows;
      this.totalItems = data.count;
    },
    async searchEnterprises() {
      if (this.search.length > 2 || this.search.length === 0) {
        if (this.queryLoading) return;
        this.queryLoading = true;
        await this.loadEnterprises();
        this.queryLoading = false;
      }
    },
    async exportToCSV() {
      // Implement CSV export logic
      const { data, success } = await UserService.exportEnterprises();

      if (!success) {
        this.$notify({
          title: "Failed to load enterprises",
          type: "error",
        });
        return;
      }

      const exportData = `data:text/csv;charset=utf-8,${encodeURIComponent(data)}`;
      const downloadElement = document.createElement("a");
      downloadElement.setAttribute("href", exportData);
      downloadElement.setAttribute("download", `enterprises-${Date.now()}.csv`);
      downloadElement.click();
    },
    viewEnterprise(item) {
      this.$router.push(`/enterprises/${item.id}`)
    },
    async queueActivation(activation) {
      this.dialog = true;
      const status = activation ? 'active': 'deactivated';
      this.queueAction = activation ? 'Creating': 'Deactivating';

      const { success } = await UserService.queueEnterpriseActivations({
        enterprises: this.selected.map((org) => org.id),
        status
      });

      if (!success) {
        this.$notify({
          title: `Failed to activate enterprises`,
          type: "error",
        });
        this.dialog = false;
        return;
      }

      this.dialog = false;
      this.selected = [];
      this.$notify({
        title: "Environment creation scheduled",
        type: "success",
      });
    },
    editEnterprise() {
      // Implement edit logic
    },
    requestReports() {
      // Implement request reports logic
    },
    createAdmin() {
      // Implement create admin logic
    },
    async activation(id, activation) {
      this.startLoading();
      const status = activation ? 'active': 'deactivated';

      const { success } = await UserService.activateEnterprise(id, { status });

      if (!success) {
        this.$notify({
          title: `Failed to activate enterprise: ${id}`,
          type: "error",
        });
        this.stopLoading();
      }

      this.enterprises.forEach((enterprise, i) => {
        if (enterprise.id === id) {
          this.enterprises[i].status = status;
        }
      });
      this.stopLoading();
    },
  },
}
</script>

<style scoped>
.enterprise-list {
  background-color: white;
  border-radius: 8px;
}

.title-box {
  width: 12vw;
  overflow: hidden;
  text-wrap: nowrap;
  text-overflow: ellipsis;
  overflow-wrap: break-word;
}

.text-title {
  font-size: 1.1em;
  color: black;
  font-weight: bold;
}

.search-field ::v-deep .v-input__control {
  min-height: 40px;
}

.search-field ::v-deep .v-input__slot {
  min-height: 40px !important;
}

.export-btn {
  height: 40px !important;
}

.enterprise-table {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  overflow: hidden;
}

.enterprise-table ::v-deep .v-data-table-header {
  background-color:primary !important;
}

.enterprise-table ::v-deep .v-data-table-header th {
  color: white !important;
  font-weight: 500 !important;
  font-size: 0.875rem !important;
  padding: 0 16px !important;
  height: 48px !important;
  border-bottom: none !important;
}


.enterprise-table ::v-deep .v-data-table__wrapper tbody tr {
  cursor: pointer;
}

.enterprise-table ::v-deep .v-data-table__wrapper tbody td {
  padding: 12px 16px !important;
  height: 52px !important;
  font-size: 0.875rem !important;
}


.status-chip {
  padding: 0 12px !important;
  height: 24px !important;
  font-size: 0.75rem !important;
}



.enterprise-table ::v-deep .v-input--selection-controls__input {
  margin-right: 0;
}

.enterprise-table ::v-deep .v-data-table__checkbox {
  padding: 0 12px !important;
}
.status-chip {
  padding: 4px 12px !important;
  height: 24px !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  border-radius: 16px !important;
  text-transform: capitalize !important;
}

.status-active {
  background-color: rgba(46, 204, 113, 0.1) !important;
  color: #2ecc71 !important;
  border: 1px solid #2ecc71 !important;
}


.status-deactivated {
  background-color: rgba(231, 76, 60, 0.1) !important;
  color: #e74c3c !important;
  border: 1px solid #e74c3c !important;
}

.status-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.status-dot {
  display: inline-block;
  border-radius: 50%;
  height: 15px !important;
  width: 15px !important;
  background-color: grey;
}

.status-dot.active {
  background-color: green;
}

.status-dot.deactivated {
  background-color: red;
}

.progress-img {
  -webkit-animation:spin 2s linear infinite;
    -moz-animation:spin 2s linear infinite;
    animation:spin 2s linear infinite;
}

@-moz-keyframes spin { 
    100% { -moz-transform: rotate(360deg); } 
}
@-webkit-keyframes spin { 
    100% { -webkit-transform: rotate(360deg); } 
}
@keyframes spin { 
    100% { 
        -webkit-transform: rotate(360deg); 
        transform:rotate(360deg); 
    } 
}
</style>