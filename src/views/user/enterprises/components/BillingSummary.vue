<template>
    <v-card class="pa-6" flat>
      <!-- Previous template code remains the same until the button color changes -->
      <div class="text-h6 font-weight-bold mb-2">
        <!-- Billing Summary -->
      {{ $t('Enterprises.BillingSummary.Billing_Summary') }}
      </div>
      
      <div class="text-body-2 text-grey mb-8">
        {{ $t('Enterprises.BillingSummary.Update_Payment_Info') }}
        <!-- Update your payment information or switch plans according to your needs. -->
      </div>
  
      <v-row>
        <!-- Base Plan Package -->
        <v-col cols="4">
          <div class="text-subtitle-1 font-weight-medium mb-2">
          {{ $t('Enterprises.BillingSummary.Base_Plan_Package') }}
            <!-- Base Plan Package -->
          </div>
          <div class="text-body-2 text-grey mb-4">$160.00 USD / month</div>
          
          <div class="d-flex justify-space-between mb-1">
            <div class="text-body-2">
              <!-- Total Paid -->
            {{ $t('Enterprises.BillingSummary.Total_Paid') }}
            </div>
            <div class="text-body-2">$1000</div>
          </div>
          
          <div class="d-flex justify-space-between mb-4">
            <div class="text-body-2">
            {{ $t('Enterprises.BillingSummary.To_be_Paid') }}
              <!-- To be Paid -->
            </div>
            <div class="text-body-2">$0</div>
          </div>
          
          <v-btn
            color="#04bc74"
            class="text-none font-weight-medium white--text"
            flat
            block
            height="36"
          >
          {{ $t('Enterprises.BillingSummary.Manage_Plan') }}
            <!-- MANAGE PLAN -->
          </v-btn>
        </v-col>
  
        <v-col cols="4">
          <div class="text-subtitle-1 font-weight-medium mb-6">
          {{ $t('Enterprises.BillingSummary.Extra_Usage') }}
            <!-- Extra Usage -->
          </div>
          
          <div class="d-flex justify-space-between mb-1">
            <div class="text-body-2">
            {{ $t('Enterprises.BillingSummary.Total_Paid') }}
              <!-- Total Paid -->
            </div>
            <div class="text-body-2">$0</div>
          </div>
          
          <div class="d-flex justify-space-between mb-4">
            <div class="text-body-2">
              {{ $t('Enterprises.BillingSummary.To_be_Paid') }}
            
              <!-- To be Paid -->
            </div>
            <div class="text-body-2">$0</div>
          </div>
          
          <v-btn
            color="transparent"
            class="text-none font-weight-medium custom-outline-btn"
            outlined
            block
            height="36"
          >
          {{ $t('Enterprises.BillingSummary.Change_Billing_Period') }}
            <!-- CHANGE BILLING PERIOD -->
          </v-btn>
        </v-col>
  
        <v-col cols="4">
          <div class="text-subtitle-1 font-weight-medium mb-6">
          {{ $t('Enterprises.BillingSummary.Total_Amount_Due') }}
            <!-- Total Amount Due -->
          </div>
          <div class="text-h5 font-weight-medium">$0</div>
        </v-col>
      </v-row>
  
      <div class="text-subtitle-1 font-weight-medium mt-12 mb-6">
        {{ $t('Enterprises.BillingSummary.Billing_History') }}
        <!-- Billing History -->
      </div>
      
      <div class="d-flex align-center mb-4">
        <v-text-field
          v-model="search"
          placeholder="Search"
          prepend-inner-icon="mdi-magnify"
          dense
          outlined
          hide-details
          class="mr-4"
          style="max-width: 240px"
        ></v-text-field>
        
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateFormatted"
              placeholder="12/01/2021"
              prepend-inner-icon="mdi-calendar"
              readonly
              dense
              outlined
              hide-details
              style="max-width: 180px"
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date"
            no-title
            @input="menu = false"
          ></v-date-picker>
        </v-menu>
  
        <v-spacer></v-spacer>
  
        <div class="text-body-2 text-grey mr-4">1 of 1</div>
        
        <v-btn icon small class="mr-2">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        
        <v-btn icon small>
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>
  
      <v-simple-table class="billing-table">
        <template v-slot:default>
          <thead>
            <tr class="header-row">
              <th class="white--text text-left px-4">
                {{ $t('Enterprises.BillingSummary.Transaction_ID') }}
                <!-- Transaction ID  -->
                <v-icon small color="white">mdi-chevron-down</v-icon>
              </th>
              <th class="white--text text-left px-4">
                {{ $t('Enterprises.BillingSummary.Admin_User') }}
                <!-- Admin User  -->
                <v-icon small color="white">mdi-chevron-down</v-icon>
              </th>
              <th class="white--text text-left px-4">
                {{ $t('Enterprises.BillingSummary.Amount') }}
                <!-- Amount  -->
                <v-icon small color="white">mdi-chevron-down</v-icon>
              </th>
              <th class="white--text text-left px-4">
                {{ $t('Enterprises.BillingSummary.Mode_of_Payment') }}
                <!-- Mode of Payment  -->
                <v-icon small color="white">mdi-chevron-down</v-icon>
              </th>
              <th class="white--text text-left px-4">
                {{ $t('Enterprises.BillingSummary.Transaction_Date') }}
                <!-- Transaction Date  -->
                <v-icon small color="white">mdi-chevron-down</v-icon>
              </th>
              <th class="white--text text-left px-4">
                {{ $t('Enterprises.BillingSummary.Receipt') }}
                <!-- Receipt  -->
                <v-icon small color="white">mdi-chevron-down</v-icon>
              </th>
              <th class="white--text text-left px-4">
                Status <v-icon small color="white">mdi-chevron-down</v-icon>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredItems" :key="item.id">
              <td class="px-4">{{ item.id }}</td>
              <td class="px-4">{{ item.user }}</td>
              <td class="px-4">{{ item.amount }}</td>
              <td class="px-4">{{ item.mode }}</td>
              <td class="px-4">{{ item.date }}</td>
              <td class="px-4">
                <v-btn
                  x-small
                  text
                  class="text-none text-decoration-underline px-0"
                  color="#68C36C"
                >
                  View
                </v-btn>
              </td>
              <td class="px-4">
                <v-chip
                  small
                  label
                  class="text-none font-weight-medium"
                  :color="getStatusColor(item.status)"
                  :text-color="getStatusTextColor(item.status)"
                >
                  {{ item.status }}
                </v-chip>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </template>
  
  <script>
  export default {
    name: 'BillingSummary',
    data: () => ({
      search: '',
      date: null,
      menu: false,
      items: [
        {
          id: 'TXN-123456',
          user: 'John Smith',
          amount: 'USD 1000',
          mode: 'Bank Transfer',
          date: '20-04-2024',
          status: 'Paid',
        },
      ],
    }),
    computed: {
      dateFormatted() {
        if (!this.date) return ''
        const [year, month, day] = this.date.split('-')
        return `${month}/${day}/${year}`
      },
      filteredItems() {
        return this.items.filter(item => {
          const searchTerm = this.search.toLowerCase()
          return Object.values(item).some(value => 
            value.toString().toLowerCase().includes(searchTerm)
          )
        })
      }
    },
    methods: {
      getStatusColor(status) {
        return status === 'Paid' ? '#E8F5E9' : '#FFF3E0'
      },
      getStatusTextColor(status) {
        return status === 'Paid' ? '#68C36C' : '#FF9800'
      }
    }
  }
  </script>
  
  <style scoped>
  .billing-table {
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 4px;
  }
  
  .header-row {
    background-color: #04bc74 !important;
    height: 48px;
  }
  
  .header-row th {
    font-size: 14px !important;
    font-weight: 500 !important;
    border-bottom: none !important;
  }
  
  .billing-table ::v-deep tbody tr td {
    height: 48px !important;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
  }
  
  .billing-table ::v-deep tbody tr:last-child td {
    border-bottom: none !important;
  }
  
  .custom-outline-btn {
    border: 1px solid #04bc74 !important;
    color: #04bc74 !important;
  }
  
  .custom-outline-btn:hover {
    background-color: rgba(104, 195, 108, 0.04) !important;
  }
  </style>