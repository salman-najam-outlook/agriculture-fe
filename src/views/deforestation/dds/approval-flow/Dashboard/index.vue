<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div>
        <h2 class="mb-4">{{ $t('dashboard') }}</h2>
        <!-- DDS Dashboard Cards Section -->
        <DDSDashboardCards 
          :dashboardData="filteredDashboardData"
          @filters-changed="handleFiltersChanged"
          class="mb-6"
        />
        
        <!-- DDS Specific Charts and Content -->
        <div class="dashboard_charts">
          <v-row class="" width="100%">
            <v-col cols="12">
              <DDSReportChart 
                :chartData="mockChartData"
              />
            </v-col>
          </v-row>
        </div>

        <!-- Average Time to Process DDS Report Chart -->
        <v-row class="my-4" v-if="!isWorker">
          <v-col cols="12">
            <DDSAverageTimeChart />
          </v-col>
        </v-row>

        <v-row class="my-4">
          <v-col cols="12" md="6">
            <DDSReportsByProductsCard />
          </v-col>
          <v-col cols="12" md="6">
            <DDSReportsByStatusCard />
          </v-col>
        </v-row>

        <!-- Admin Due Diligence Reports Component -->
        <div class="admin-reports-section mt-6">
          <v-card class="dds-reports-card pa-4" elevation="2" outlined>
            <div class="reports-header">
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center">
                  <h3 class="reports-title">{{ $t('dueDiligence.dueDiligenceReports') }}</h3>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        v-bind="attrs"
                        v-on="on"
                        size="20"
                        class="card-info-icon ml-2"
                      >
                        mdi-information
                      </v-icon>
                    </template>
                    <span>{{ $t('dueDiligence.comprehensiveViewOfAllDueDiligenceReportsAndTheirStatus') }}</span>
                  </v-tooltip>
                </div>
              </div>
            </div>
            <AdminDueDiligenceReportsComponent />
          </v-card>
        </div>
      </div>
    </v-container>
    

  </div>
</template>

<script>
import Breadcrumb from "@/components/core/Breadcrumb.vue";
import DDSDashboardCards from "../components/dashboard/DDSDashboardCards.vue";
import DDSReportChart from "../components/dashboard/DDSReportChart.vue";
import AdminDueDiligenceReportsComponent from "../components/AdminDueDiligenceReportsComponent.vue";
import DDSReportsByProductsCard from "../components/dashboard/DDSReportsByProductsCard.vue";
import DDSReportsByStatusCard from "../components/dashboard/DDSReportsByStatusCard.vue";
import { isIndonesianClient,currentRoles, isKenyaClient } from "@/utils";
import DDSAverageTimeChart from "../components/dashboard/DDSAverageTimeChart.vue";

export default {
  name: "Dashboard",
  components: {
    Breadcrumb,
    DDSDashboardCards,
    DDSReportChart,
    AdminDueDiligenceReportsComponent,
    DDSReportsByProductsCard,
    DDSReportsByStatusCard,
    DDSAverageTimeChart
  },
  data() {
    return {
      loading: true,
      currentFilters: {
        period: 'year',
        region: null,
        product: null
      },
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: false,
          to: "/dashboard",
        },
      ],
      mockDashboardData: {
         totalAssigned: 200,
         compliant: 132,
         approved: 160,
         activeAssigned: 6,
         overdue: 2,
         nonCompliant: 40,
         activeCooperatives: 20,
         activeExporters: 1500,
         registeredFarms: 20000
       },
       mockChartData: {
         categories: ['Jan-24', 'Feb-24', 'Mar-24', 'Apr-24', 'May-24', 'Jun-24', 'Jul-24', 'Aug-24', 'Sep-24', 'Oct-24', 'Nov-24', 'Dec-24'],
         approved: [43, 26, 16, 45, 38, 65, 42, 63, 45, 25, 23, 38],
         pending: [26, 15, 8, 12, 14, 32, 20, 35, 22, 15, 12, 15],
         overdue: [19, 8, 2, 18, 12, 19, 18, 12, 18, 15, 12, 15],
         rejected: [6, 10, 2, 8, 18, 24, 8, 18, 18, 18, 12, 18]
       }
    };
  },
  computed: {
    filteredDashboardData() {
      // Apply filters to dashboard data
      // In a real application, this would filter based on API data
      let data = { ...this.mockDashboardData };
      
      // Apply period filter (simulate data changes based on period)
      if (this.currentFilters.period === 'today') {
        // Simulate today's data (lower numbers)
        data = {
          ...data,
          totalAssigned: Math.floor(data.totalAssigned * 0.1),
          compliant: Math.floor(data.compliant * 0.1),
          approved: Math.floor(data.approved * 0.1),
          activeAssigned: Math.floor(data.activeAssigned * 0.5),
          overdue: Math.floor(data.overdue * 0.3),
          nonCompliant: Math.floor(data.nonCompliant * 0.1)
        };
      } else if (this.currentFilters.period === 'week') {
        // Simulate week's data
        data = {
          ...data,
          totalAssigned: Math.floor(data.totalAssigned * 0.3),
          compliant: Math.floor(data.compliant * 0.3),
          approved: Math.floor(data.approved * 0.3),
          activeAssigned: Math.floor(data.activeAssigned * 0.7),
          overdue: Math.floor(data.overdue * 0.5),
          nonCompliant: Math.floor(data.nonCompliant * 0.3)
        };
      } else if (this.currentFilters.period === 'month') {
        // Simulate month's data
        data = {
          ...data,
          totalAssigned: Math.floor(data.totalAssigned * 0.6),
          compliant: Math.floor(data.compliant * 0.6),
          approved: Math.floor(data.approved * 0.6),
          activeAssigned: Math.floor(data.activeAssigned * 0.8),
          overdue: Math.floor(data.overdue * 0.7),
          nonCompliant: Math.floor(data.nonCompliant * 0.6)
        };
      }
      
      // Apply region filter (simulate regional variations)
      if (this.currentFilters.region) {
        const regionMultiplier = this.getRegionMultiplier(this.currentFilters.region);
        Object.keys(data).forEach(key => {
          if (typeof data[key] === 'number') {
            data[key] = Math.floor(data[key] * regionMultiplier);
          }
        });
      }
      
      // Apply product filter (simulate product-specific data)
      if (this.currentFilters.product) {
        const productMultiplier = this.getProductMultiplier(this.currentFilters.product);
        Object.keys(data).forEach(key => {
          if (typeof data[key] === 'number') {
            data[key] = Math.floor(data[key] * productMultiplier);
          }
        });
      }
      
      return data;
    },
    isIndonesianClient() {
      return isIndonesianClient();
    },
    isKenyaClient() {
      return isKenyaClient();
    },
    isWorker() {
      const roles = currentRoles();
      return roles?.length == 1 && roles.includes('indonesia_ptsi_worker');
    }
  },
  methods: {
    handleFiltersChanged(filters) {
      this.currentFilters = { ...filters };
      console.log('Filters changed:', filters);
      
      // In a real application, you would make API calls here
      this.fetchDashboardData();
    },
    
    fetchDashboardData() {
      // Simulate API call with current filters
      this.loading = true;
      
      // Simulate API delay
      setTimeout(() => {
        console.log('Dashboard data refreshed with filters:', this.currentFilters);
        this.loading = false;
      }, 500);
    },
    
    getRegionMultiplier(region) {
      const multipliers = {
        'north_america': 1.2,
        'south_america': 0.8,
        'europe': 1.1,
        'africa': 0.6,
        'asia': 1.3,
        'oceania': 0.4
      };
      return multipliers[region] || 1;
    },
    
    getProductMultiplier(product) {
      const multipliers = {
        'coffee': 1.5,
        'cocoa': 1.2,
        'palm_oil': 0.9,
        'soy': 1.1,
        'cattle': 0.7,
        'wood_products': 0.8,
        'rubber': 0.6
      };
      return multipliers[product] || 1;
    }
  },
  mounted() {
    this.loading = false;
  },
};
</script>

<style scoped>
.card-info-icon {
  color: v-bind('isIndonesianClient ? "#0170E5" : isKenyaClient ? "#944A00" : "#00bd73"');
}
.dashboard-container {
  padding: 20px;
}

.dashboard-row {
  margin: 0;
  padding: 16px;
  gap: 16px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-controls {
  display: flex;
  gap: 10px;
}

.dashboard-content {
  width: 100%;
}

.dashboard_charts {
  margin-top: 20px;
}

.dds-reports-card {
  border-radius: 12px;
}

.reports-header {
  padding-bottom: 0px;
}

.reports-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

</style>