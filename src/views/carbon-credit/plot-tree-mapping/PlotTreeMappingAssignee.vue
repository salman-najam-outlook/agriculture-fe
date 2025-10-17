<template>
  <v-container fluid>
    <!-- Header and Breadcrumbs -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
        <div class="d-flex align-center justify-space-between px-5">
          <div>
            <h2 class="mb-0">John Smith <span class="primary--text" style="font-size: 0.8rem;">#00012</span></h2>
          </div>
          <v-btn color="primary" @click="back">{{ $t('back') }}</v-btn>
        </div>
      </v-col>
    </v-row>

   <v-card class="pa-4 mb-6 mx-4" elevation="0">
     <!-- User Info Cards -->
     <v-row class="my-2 px-2" dense>
      <v-col cols="12" md="3" v-for="(info, i) in userInfo" :key="i">
        <v-card class="pa-4 ma-1" color="primary-lighten1" elevation="0">
          <p class="font-weight-bold">{{ info.label }} <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on" size="16">mdi-information-outline</v-icon>
              </template>
              <span>{{ info.value }}</span>
            </v-tooltip></p>
          <p class="">{{ info.value }}</p>
        </v-card>
      </v-col>
    </v-row>
   </v-card>

    <!-- Task Activity History -->
    <v-card class="mb-6 mx-4 pa-4" outlined>
      <v-card-title class="px-0 mx-0">
        <h4>Task Activity History</h4>
      </v-card-title>
      <!-- Search/Filter Bar -->
      <v-row class="pt-4 pb-2" align="center" no-gutters>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="taskSearch"
            label="Search by name"
            dense
            hide-details
            solo
            prepend-inner-icon="mdi-magnify"
            class="search-bar"
          />
        </v-col>
        <v-col cols="12" md="3" class="pr-2">
          <v-select
            :items="dateFilters"
            v-model="taskDateFilter"
            label="Filter By Date"
            dense
            hide-details
            solo
            class="search-bar"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            :items="assignedFilters"
            v-model="taskAssignedFilter"
            label="Assigned To"
            dense
            hide-details
            solo
            class="search-bar"
          />
        </v-col>
      </v-row>
      <v-data-table :headers="taskHeaders" :items="taskItems" class="elevation-0" hide-default-footer>
        <template #item.status="{ item }">
          <v-chip :color="statusColor(item.status)" small>{{ item.status }}</v-chip>
        </template>
        <template #item.actions>
          <v-btn icon size="small"><v-icon>mdi-dots-vertical</v-icon></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Payment History -->
    <v-card outlined class="mx-4 pa-4">
      <v-card-title class="px-0 mx-0">
        <h4 >Payment History</h4>
      </v-card-title>
      <!-- Search/Filter Bar -->
      <v-row class="pt-4 pb-2" align="center" no-gutters>
        <v-col cols="12" md="3" class="pr-2">
          <v-text-field
            v-model="paymentSearch"
            label="Search by name"
            dense
            hide-details
            solo
            prepend-inner-icon="mdi-magnify"
            class="search-bar"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            :items="dateFilters"
            v-model="paymentDateFilter"
            label="Filter By Date"
            dense
            hide-details
            solo
            class="search-bar"
          />
        </v-col>
      </v-row>
      <v-data-table :headers="paymentHeaders" :items="paymentItems" class="elevation-0" hide-default-footer />
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      breadcrumbs: [
        { text: 'Dashboard', disabled: false },
        { text: 'Carbon Credit', disabled: false },
        { text: 'Plot Tree Mapping', disabled: false },
        { text: 'Assignee Details', disabled: true },
      ],
      userInfo: [
        { label: 'Email', value: 'johndoe@gmail.com' },
        { label: 'Role', value: 'Manager' },
        { label: 'Employment Type', value: 'Contractor' },
        { label: 'Total Hours Worked', value: '20 Hours' },
        { label: 'Hourly Rate', value: '$10' },
        { label: 'Total # of Tasks', value: '10' },
        { label: 'In-Progress Tasks', value: '04' },
        { label: 'Completed Tasks', value: '04' },
        { label: 'Late Tasks', value: '02' },
      ],
      taskSearch: '',
      dateFilters: ['All Dates', '12-SEP-2024'],
      taskDateFilter: 'All Dates',
      assignedFilters: ['All', 'John Smith', 'Jones Williams', 'Kate William', 'John Doe', 'Smith Johnson'],
      taskAssignedFilter: 'All',
      taskHeaders: [
        { text: 'Request Title', value: 'title' },
        { text: 'Assigned To', value: 'assigned' },
        { text: 'Task Details', value: 'details' },
        { text: 'Farmer', value: 'farmer' },
        { text: 'Farm', value: 'farm' },
        { text: 'Due Date', value: 'due' },
        { text: 'Task Status', value: 'status' },
        { text: '', value: 'actions', sortable: false },
      ],
      taskItems: [
        {
          title: 'Request Title',
          assigned: 'John Smith, 2 more',
          details: 'Task details will be here',
          farmer: 'James Anderson',
          farm: 'James Farm',
          due: '12-SEP-2024',
          status: 'Completed',
        },
        {
          title: 'Request Title',
          assigned: 'Jones Williams, 2 more',
          details: 'Task details will be here',
          farmer: 'Emily Adams',
          farm: 'Emily Farm',
          due: '12-SEP-2024',
          status: 'In Progress',
        },
        {
          title: 'Request Title',
          assigned: 'Kate William',
          details: 'Task details will be here',
          farmer: 'John Carter',
          farm: 'John Farm',
          due: '12-SEP-2024',
          status: 'To do',
        },
        {
          title: 'Request Title',
          assigned: 'John Doe',
          details: 'Task details will be here',
          farmer: 'Robert Davis',
          farm: 'Robert Farm',
          due: '12-SEP-2024',
          status: 'Completed',
        },
        {
          title: 'Request Title',
          assigned: 'Smith Johnson, 2 more',
          details: 'Task details will be here',
          farmer: 'Michael Evans',
          farm: 'Johnathan Farm',
          due: '12-SEP-2024',
          status: 'In Progress',
        },
      ],
      paymentSearch: '',
      paymentDateFilter: 'All Dates',
      paymentHeaders: [
        { text: 'Transaction Date', value: 'date' },
        { text: 'Billing Rate', value: 'rate' },
        { text: 'Hours Worked', value: 'hours' },
        { text: 'Total Amount', value: 'amount' },
      ],
      paymentItems: [
        { date: '12-SEP-2024', rate: 'Hourly | $10', hours: '20 Hours', amount: '$200' },
        { date: '12-SEP-2024', rate: 'Hourly | $10', hours: '20 Hours', amount: '$200' },
        { date: '12-SEP-2024', rate: 'Hourly | $10', hours: '20 Hours', amount: '$200' },
        { date: '12-SEP-2024', rate: 'Hourly | $10', hours: '20 Hours', amount: '$200' },
        { date: '12-SEP-2024', rate: 'Hourly | $10', hours: '20 Hours', amount: '$200' },
      ],
    };
  },
  methods: {
    statusColor(status) {
      switch (status) {
        case 'Completed':
          return 'success';
        case 'In Progress':
          return 'orange';
        case 'To do':
          return 'grey';
        default:
          return 'grey';
      }
    },
    back() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.v-card {
    background: #f9fdfb;
}

.v-card-title {
    font-weight: bold;
    font-size: 16px;
}

.v-text-field,
.v-textarea {
    background: #eafaf3 !important;
}

.v-chip {
    font-weight: 500;
    font-size: 13px;
    text-transform: none;
}

.primary-lighten1 {
    background-color: #eafaf3;
}

.search-bar {
  background: #fff !important;
  margin-right: 10px !important;
  margin-bottom: 10px !important;
  box-shadow: none !important;
}
</style>