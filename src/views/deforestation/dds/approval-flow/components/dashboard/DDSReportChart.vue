<template>
  <v-card class="dds-chart-card pa-4" elevation="2" outlined>
    <div class="chart-header mb-4">
      <div class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <h3 class="chart-title">{{ $t('dueDiligence.ddsReportSubmissions') }}</h3>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
                size="20"
                class="ml-2 brand-color"
              >
                mdi-information
              </v-icon>
            </template>
            <span>{{ $t('dueDiligence.monthlyBreakdownOfDdsReportSubmissionsByStatus') }}</span>
          </v-tooltip>
        </div>
        <div class="year-selector">
          <!-- Previous Year Button -->
          <v-btn
            icon
            small
            @click="previousYear"
            class="year-nav-btn"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          
          <!-- Year Display/Dropdown -->
          <div class="custom-dropdown-container">
            <div 
              class="year-display"
              @click="showYearDropdown = !showYearDropdown"
            >
              <span class="year-text">{{ selectedYear }}</span>
              <v-icon small class="ml-1">mdi-chevron-down</v-icon>
            </div>
            
            <div v-if="showYearDropdown" class="custom-dropdown">
              <div 
                v-for="year in availableYears" 
                :key="year"
                @click="selectYear(year)"
                class="custom-dropdown-item"
                :class="{ 'custom-dropdown-item-active': year === selectedYear }"
              >
                {{ year }}
              </div>
            </div>
          </div>
          
          <!-- Next Year Button -->
          <v-btn
            icon
            small
            @click="nextYear"
            class="year-nav-btn"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
      </div>
    </div>

    <div class="chart-container">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>{{ $t('dueDiligence.loadingChartData') }}</p>
      </div>
      <apexchart
        v-else
        ref="chart"
        type="bar"
        height="350"
        :options="chartOptions"
        :series="chartSeries"
      />
    </div>

    <div class="chart-legend mt-4">
      <div class="d-flex flex-wrap justify-center gap-4">
        <div 
          v-for="legend in legendItems" 
          :key="legend.name"
          class="legend-item d-flex align-center"
        >
          <div 
            class="legend-color"
            :style="{ backgroundColor: legend.color }"
          ></div>
          <span class="legend-text ml-2">{{ legend.name }}</span>
          <span class="legend-value ml-1">{{ legend.value }}</span>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
import ApexChart from 'vue-apexcharts'
import DeforestationService from '@/_services/DeforestationService'
import { isIndonesianClient, isKenyaClient, currentRoles } from '@/utils.js';
export default {
  name: 'DDSReportChart',
  components: {
    'apexchart': ApexChart
  },
  props: {
    chartData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      selectedYear: new Date().getFullYear(),
      showYearDropdown: false,
      availableYears: this.generateYearRange(),
      loading: false,
      apiData: {
        totalCount: 0,
        statusCounts: [],
        monthlyStatusCounts: []
      }
    };
  },
  computed: {
    chartSeries() {
      if (!this.apiData.monthlyStatusCounts || this.apiData.monthlyStatusCounts.length === 0) {
        return [
          { name: this.$t('dueDiligence.ddsReportsApproved'), data: [], color: '#0170E5' },
          { name: this.$t('dueDiligence.pendingDdsReports'), data: [], color: '#969696' },
          { name: this.$t('dueDiligence.overdueDdsReports'), data: [], color: '#F97316' },
          { name: this.$t('dueDiligence.rejectedDdsReports'), data: [], color: '#F03737' }
        ]
      }

      const approvedData = []
      const pendingData = []
      const overdueData = []
      const rejectedData = []

      this.apiData.monthlyStatusCounts.forEach(monthData => {
        const statusMap = {}
        monthData.statusCounts.forEach(statusCount => {
          statusMap[statusCount.status] = statusCount.count
        })
        
        approvedData.push(statusMap.approved || 0)
        pendingData.push(statusMap.pending || 0)
        overdueData.push(statusMap.overdue || 0)
        rejectedData.push(statusMap.rejected || 0)
      })

      return [
        {
          name: this.$t('dueDiligence.ddsReportsApproved'),
          data: approvedData,
          color: '#0170E5'
        },
        {
          name: this.$t('dueDiligence.pendingDdsReports'),
          data: pendingData,
          color: '#969696'
        },
        {
          name: this.$t('dueDiligence.overdueDdsReports'),
          data: overdueData,
          color: '#F97316'
        },
        {
          name: this.$t('dueDiligence.rejectedDdsReports'),
          data: rejectedData,
          color: '#F03737'
        }
      ]
    },
    chartOptions() {
      const maxValue = this.calculateMaxYAxisValue();
      const tickInterval = this.calculateTickInterval(maxValue);
      
      return {
        chart: {
          type: 'bar',
          height: 350,
          stacked: false,
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          },
          fontFamily: 'Roboto, sans-serif'
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: 12,
            borderRadius: 4,
            dataLabels: {
              position: 'top'
            }
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: this.apiData.monthlyStatusCounts?.map(monthData => monthData.month) || [],
          labels: {
            style: {
              colors: '#6B7280',
              fontSize: '12px',
              fontWeight: 500
            }
          },
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          }
        },
        yaxis: {
            title: {
              text: this.$t('dueDiligence.noOfReports'),
              style: {
                color: '#64748B',
                fontSize: '12px'
              }
            },
            labels: {
              style: {
                colors: '#64748B',
                fontSize: '12px'
              },
              formatter: function (value) {
                return Math.floor(value)
              }
            },
            min: 0,
            max: maxValue,
            tickAmount: Math.min(Math.ceil(maxValue / tickInterval), 10), // Limit to max 10 ticks
            forceNiceScale: true
          },
        fill: {
          opacity: 1
        },
        tooltip: {
          shared: true,
          intersect: false,
          custom: ({ dataPointIndex }) => {
            const monthData = this.apiData.monthlyStatusCounts[dataPointIndex];
            if (!monthData) return '';
            
            const month = monthData.month;
            const statusMap = {};
            monthData.statusCounts.forEach(statusCount => {
              statusMap[statusCount.status] = statusCount.count;
            });
            
            const approved = statusMap.approved || 0;
            const pending = statusMap.pending || 0;
            const overdue = statusMap.overdue || 0;
            const rejected = statusMap.rejected || 0;
            const total = approved + pending + overdue + rejected;
            
            return `
              <div style="padding: 12px; background: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-family: Roboto, sans-serif;">
                <div style="font-weight: 600; font-size: 14px; color: #1F2937; margin-bottom: 8px; border-bottom: 1px solid #E5E7EB; padding-bottom: 6px;">
                  ${month} - ${this.$t('total')}: ${total} ${this.$t('dueDiligence.totalReports')}
                </div>
                <div style="display: flex; flex-direction: column; gap: 4px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 12px; height: 12px; background: #0170E5; border-radius: 2px;"></div>
                    <span style="font-size: 12px; color: #374151;">${this.$t('approved')}: <strong>${approved}</strong></span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 12px; height: 12px; background: #969696; border-radius: 2px;"></div>
                    <span style="font-size: 12px; color: #374151;">Pending: <strong>${pending}</strong></span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 12px; height: 12px; background: #F97316; border-radius: 2px;"></div>
                    <span style="font-size: 12px; color: #374151;">Overdue: <strong>${overdue}</strong></span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 12px; height: 12px; background: #F03737; border-radius: 2px;"></div>
                    <span style="font-size: 12px; color: #374151;">Rejected: <strong>${rejected}</strong></span>
                  </div>
                </div>
              </div>
            `;
          },
          style: {
            fontSize: '12px'
          }
        },
        legend: {
          show: false
        },
        grid: {
          borderColor: '#E5E7EB',
          strokeDashArray: 3,
          xaxis: {
            lines: {
              show: false
            }
          },
          yaxis: {
            lines: {
              show: true
            }
          }
        },
        colors: ['#0170E5', '#969696', '#F97316', '#F03737'],
        responsive: [
          {
            breakpoint: 768,
            options: {
              chart: {
                height: 300
              },
              plotOptions: {
                bar: {
                  columnWidth: 12
                }
              },
              xaxis: {
                labels: {
                  style: {
                    fontSize: '10px'
                  }
                }
              }
            }
          }
        ]
      };
    },
    legendItems() {
      if (!this.apiData.statusCounts || this.apiData.statusCounts.length === 0) {
        return [
          { name: this.$t('dueDiligence.ddsReportsApproved'), value: 0, color: '#0170E5' },
          { name: this.$t('dueDiligence.pendingDdsReports'), value: 0, color: '#969696' },
          { name: this.$t('dueDiligence.overdueDdsReports'), value: 0, color: '#F97316' },
          { name: this.$t('dueDiligence.rejectedDdsReports'), value: 0, color: '#F03737' }
        ]
      }

      const statusMap = {}
      this.apiData.statusCounts.forEach(statusCount => {
        statusMap[statusCount.status] = statusCount.count
      })

      return [
        {
          name: this.$t('dueDiligence.ddsReportsApproved'),
          value: statusMap.approved || 0,
          color: '#0170E5'
        },
        {
          name: this.$t('dueDiligence.pendingDdsReports'),
          value: statusMap.pending || 0,
          color: '#969696'
        },
        {
          name: this.$t('dueDiligence.overdueDdsReports'),
          value: statusMap.overdue || 0,
          color: '#F97316'
        },
        {
          name: this.$t('dueDiligence.rejectedDdsReports'),
          value: statusMap.rejected || 0,
          color: '#F03737'
        }
      ]
    },
    isIndonesianClient() {
      return isIndonesianClient()
    },
    isKenyaClient() {
      return isKenyaClient()
    },
  },
  methods: {
    async fetchDdsReportData() {
      try {
        this.loading = true
        const response = await DeforestationService.getDdsReportSubmissionCounts({
          year: this.selectedYear,
          cfRoles: currentRoles()
        })
        
        if (response && response.data && response.data.ddsReportSubmissionCounts) {
          this.apiData = response.data.ddsReportSubmissionCounts
        }
      } catch (error) {
        console.error('Error fetching DDS report data:', error)
        // Reset to empty data on error
        this.apiData = {
          totalCount: 0,
          statusCounts: [],
          monthlyStatusCounts: []
        }
      } finally {
        this.loading = false
      }
    },
    generateYearRange() {
      const currentYear = new Date().getFullYear();
      const years = [];
      // Generate years from 2020 to current year only (no future years)
      for (let year = 2020; year <= currentYear; year++) {
        years.push(year);
      }
      return years.reverse(); // Show newest years first
    },
    previousYear() {
      if (this.selectedYear > Math.min(...this.availableYears)) {
        this.selectedYear--;
        this.onYearChange();
      }
    },
    nextYear() {
      if (this.selectedYear < Math.max(...this.availableYears)) {
        this.selectedYear++;
        this.onYearChange();
      }
    },
    selectYear(year) {
      this.selectedYear = year;
      this.showYearDropdown = false;
      this.onYearChange();
    },
    onYearChange() {
      this.fetchDdsReportData()
      this.$emit('year-changed', {
        year: this.selectedYear
      });
    },
    calculateMaxYAxisValue() {
       if (!this.apiData.monthlyStatusCounts || this.apiData.monthlyStatusCounts.length === 0) {
         return 80; // Default fallback
       }
       
       let maxValue = 0;
       this.apiData.monthlyStatusCounts.forEach(monthData => {
         const monthTotal = monthData.statusCounts.reduce((sum, statusCount) => sum + statusCount.count, 0);
         if (monthTotal > maxValue) {
           maxValue = monthTotal;
         }
       });
       
       // Ensure minimum scale for small values to make bars visible
       const minScale = 10;
       const calculatedMax = Math.ceil(maxValue * 1.2);
       
       return Math.max(calculatedMax, minScale);
     },
    getTotalValue(data) {
      return data.reduce((sum, value) => sum + value, 0);
    },
    updateChart() {
      if (this.$refs.chart) {
        this.$refs.chart.updateSeries(this.chartSeries);
      }
    },
    
    // Calculate appropriate tick interval for y-axis
    calculateTickInterval(maxValue) {
      if (maxValue <= 5) return 1;
      if (maxValue <= 10) return 2;
      if (maxValue <= 20) return 5;
      if (maxValue <= 50) return 10;
      if (maxValue <= 100) return 20;
      return Math.ceil(maxValue / 10);
    }
  },
  mounted() {
    this.fetchDdsReportData()
  },
  watch: {
    selectedYear() {
      this.fetchDdsReportData()
    },
    chartData: {
      handler() {
        this.$nextTick(() => {
          this.updateChart();
        });
      },
      deep: true
    }
  }
};
</script>

<style scoped>
.brand-color {
  color: v-bind('isIndonesianClient ? "#00559F" : isKenyaClient ? "#944A00" : "#00bd73"') !important;
}
</style>



<style scoped>
.dds-chart-card {
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #E5E7EB;
}

.chart-title {
  color: #1F2937;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
}

.year-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.year-nav-btn {
  border: 1px solid #E5E7EB !important;
  border-radius: 6px !important;
  background-color: #ffffff !important;
  color: #6B7280 !important;
}

.year-nav-btn:hover {
  background-color: #F9FAFB !important;
  border-color: #D1D5DB !important;
}

.year-display {
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  min-width: 80px;
  justify-content: center;
  transition: all 0.2s ease;
}

.year-display:hover {
  background-color: #F9FAFB;
  border-color: #D1D5DB;
}

.year-text {
  font-weight: 600;
  color: #1F2937;
  font-size: 0.875rem;
}

.year-dropdown {
  max-height: 200px;
  overflow-y: auto;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.year-dropdown .v-list-item {
  min-height: 36px;
}

/* Custom dropdown styles */
.custom-dropdown-container {
  position: relative;
}

.custom-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 6px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 4px;
}

.custom-dropdown-item {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 0.875rem;
  color: #1F2937;
  transition: background-color 0.2s ease;
}

.custom-dropdown-item:hover {
  background-color: #F3F4F6;
}

.custom-dropdown-item-active {
  background-color: v-bind('isIndonesianClient ? "#00559F" : isKenyaClient ? "#944A00" : "#00bd73"') !important;
  color: white !important;
}

.chart-container {
  width: 100%;
  overflow-x: auto;
}

.legend-item {
  margin: 4px 8px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  flex-shrink: 0;
}

.legend-text {
  color: #6B7280;
  font-size: 0.875rem;
  font-weight: 500;
}

.legend-value {
  color: #1F2937;
  font-size: 0.875rem;
  font-weight: 600;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 350px;
  gap: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid v-bind('isIndonesianClient ? "#00559F" : isKenyaClient ? "#944A00" : "#00bd73"');
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  color: #64748B;
  font-size: 14px;
  margin: 0;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .chart-header {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 12px;
  }
  
  .year-selector {
    width: 100%;
    justify-content: center;
  }
  
  .chart-title {
    font-size: 1rem;
  }
  
  .legend-item {
    margin: 2px 4px;
  }
  
  .legend-text,
  .legend-value {
    font-size: 0.75rem;
  }
}

@media (max-width: 600px) {
  .chart-header .d-flex {
    flex-direction: column;
    align-items: flex-start !important;
  }
  
  .year-selector {
    margin-top: 8px;
  }
}
</style>