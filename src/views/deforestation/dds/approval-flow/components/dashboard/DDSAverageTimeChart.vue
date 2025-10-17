<template>
  <v-card class="dds-chart-card pa-4" elevation="2" outlined>
    <!-- Chart Header - Two Column Layout -->
    <div class="chart-header mb-4">
      <v-row align="center" no-gutters>
        <!-- First Column: Title and Average Time Display -->
        <v-col cols="12" md="6" class="d-flex align-center flex-wrap">
          <div class="d-flex align-center">
            <h3 class="chart-title mb-0">{{ $t('dueDiligence.averageTimeToProcessDdsReport') }}</h3>
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
            <span>{{ infoTooltip }}</span>
          </v-tooltip>
          </div>
          
          <!-- Average Time Display -->
          <div class="average-time-display ml-4">
            <div class="average-number">{{ averageTime }}</div>
            <div class="average-label">{{ $t('days') }}<br>{{ $t('averageTime') }}</div>
          </div>
        </v-col>
        
        <!-- Second Column: Chart Filters and Filter Button -->
        <v-col cols="12" md="6" class="d-flex align-center justify-end flex-wrap chart-controls-container">
          <!-- Chart Filters -->
          <div class="chart-filters chart-control-item">
              <div class="custom-period-selector chart-control-item">
            <div 
              v-for="period in periodOptions" 
              :key="period.value"
              class="custom-period-button"
              :class="{'custom-period-button-active': selectedPeriod === period.value}"
              @click="selectedPeriod = period.value"
              :style="selectedPeriod === period.value ? {
                backgroundColor: isIndonesianClient ? '#0170E5' : isKenyaClient ? '#944A00' : '#00bd73',
                color: 'white'
              } : {}"
              :disabled="hasCustomDateRange || loading"
            >
              {{ period.label }}
            </div>
          </div>
            
          
          </div>
            <!-- Date Range Display -->
            <div class="date-range-display ml-3 chart-control-item" @click="openDatePicker" style="cursor: pointer;">
              <v-icon small class="mr-1">mdi-calendar</v-icon>
              <span class="date-range-text">{{ formattedDateRange }}</span>
              <v-btn icon x-small class="ml-1" @click.stop="clearDateRange" v-if="selectedStartDate && selectedEndDate">
                <v-icon small>mdi-close</v-icon>
              </v-btn>
            </div>
          <!-- Filter Button -->
          <v-btn
            color="primary"
            outlined
            small
            @click="showFilterModal = true"
            class="filter-btn ml-3 py-4 chart-control-item"
          >
            <v-icon class="mr-1">mdi-filter</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <!-- Chart Container -->
    <div class="chart-container">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>{{ $t('dueDiligence.loadingChartData') }}</p>
      </div>
      <div v-else-if="chartData.employees.length === 0" class="no-data-available">
        <v-icon size="48" color="grey">mdi-chart-box-outline</v-icon>
        <p class="mt-2">{{ $t('dueDiligence.noDataAvailable') }}</p>
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

    <!-- Filter Modal -->
    <FilterModal
      :show="showFilterModal"
      @update:show="showFilterModal = $event"
      :selectedCountry="selectedCountry"
      :selectedRegion="selectedRegion"
      :selectedProduct="selectedProduct"
      :countryOptions="countryOptions"
      :regionOptions="regionOptions"
      :productOptions="productOptions"
      @filter-applied="onFilterApplied"
      @filters-cleared="onFiltersCleared"
    />

    <!-- Date Picker Modal -->
    <v-dialog v-model="showDatePicker" width="400" @click:outside="closeDatePicker">
      <v-card>
        <v-toolbar color="primary" class="white--text">
          <v-toolbar-title class="font-weight-bold">
            {{ $t('select') }} {{ datePickerMode === 'start' ? $t('dueDiligence.start') : $t('dueDiligence.end') }} {{ $t('date') }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon class="white--text" @click="closeDatePicker">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <div class="pa-4">
          <v-date-picker 
             :value="currentDateValue"
             no-title 
             show-adjacent-months
             :max="datePickerMode === 'start' ? selectedEndDate : undefined"
             :min="datePickerMode === 'end' ? selectedStartDate : undefined"
             @input="onDateSelected"
           ></v-date-picker>
          
          <div class="mt-4 d-flex justify-space-between">
            <v-btn 
              v-if="datePickerMode === 'start' && selectedStartDate"
              color="primary" 
              outlined
              @click="switchToEndDate"
            >
              {{ $t('dueDiligence.selectEndDate') }}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn 
              color="primary" 
              @click="applyDateSelection"
              :disabled="!selectedStartDate || !selectedEndDate"
            >
              {{ $t('dueDiligence.apply') }}
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import ApexChart from 'vue-apexcharts'
import DeforestationService from '@/_services/DeforestationService'
import FilterModal from '@/components/common/FilterModal.vue'
import {isIndonesianClient, isKenyaClient} from '@/utils';

export default {
  name: 'DDSAverageTimeChart',
  components: {
    'apexchart': ApexChart,
    FilterModal
  },
  data() {
    return {
      selectedPeriod: 'all',
      loading: false,
      showDatePicker: false,
      selectedStartDate: null,
      selectedEndDate: null,
      datePickerMode: 'start',
      showFilterModal: false,
      selectedCountry: 'indonesia',
      selectedRegion: null,
      selectedProduct: null,
      chartData: {
        employees: []
      },
      countryOptions: [
        { name: 'Indonesia', value: 'indonesia' },
      ],
      regionOptions: [],
      productOptions: [
        { name: 'Coffee', value: 2 },
        { name: 'Cocoa', value: 3 },
        { name: 'Rubber', value: 5 }
      ]
    };
  },
  computed: {
    periodOptions() {
      return [
        { value: 'today', label: this.$t('dueDiligence.today') },
        { value: 'week', label: this.$t('dueDiligence.week') },
        { value: 'month', label: this.$t('dueDiligence.month') },
        { value: 'year', label: this.$t('dueDiligence.year') },
        { value: 'all', label: this.$t('dueDiligence.all') }
      ];
    },
    currentDateValue() {
      return this.datePickerMode === 'start' ? this.selectedStartDate : this.selectedEndDate;
    },
    formattedDateRange() {
      if (!this.selectedStartDate || !this.selectedEndDate) {
        return this.$t('dueDiligence.selectDateRange');
      }
      const startDate = this.formatDate(this.selectedStartDate);
      const endDate = this.formatDate(this.selectedEndDate);
      return `${startDate} to ${endDate}`;
    },
    hasCustomDateRange() {
      return !!(this.selectedStartDate && this.selectedEndDate);
    },
    averageTime() {
      // Use the overall average from API if available, otherwise calculate from employees
      if (this.chartData.overallAverageTime !== undefined) {
        return Math.round(this.chartData.overallAverageTime * 10) / 10; // Round to 1 decimal place
      }
      
      if (!this.chartData.employees || this.chartData.employees.length === 0) {
        return 5;
      }
      const totalTime = this.chartData.employees.reduce((sum, emp) => sum + emp.averageTime, 0);
      const average = totalTime / this.chartData.employees.length;
      return Math.round(average * 10) / 10; // Round to 1 decimal place
    },
    chartSeries() {
      return [{
        name: this.$t('dueDiligence.averageProcessingTimeDays'),
        data: this.chartData.employees.map(employee => employee.averageTime),
        color: '#0170E5'
      }];
    },
    chartOptions() {
      // Calculate dynamic y-axis values based on data
      const employeeTimes = this.chartData.employees?.map(emp => emp.averageTime) || [0];
      const maxValue = Math.max(...employeeTimes, 1); // Ensure minimum of 1
      
      // Create dynamic y-axis with better scaling
      const yAxisMax = Math.ceil(maxValue * 1.1); // Add 10% padding
      const tickInterval = this.calculateTickInterval(yAxisMax);
      
      return {
        chart: {
          type: 'bar',
          height: 350,
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
            columnWidth: 35,
            borderRadius: 4,
            dataLabels: {
              position: 'top'
            }
          }
        },
        dataLabels: {
          enabled: true,
          offsetY: -20,
          style: {
            fontSize: '12px',
            colors: ['#374151'],
            fontWeight: 600
          },
          formatter: (val) => {
            return val + ' ' + this.$t('days');
          }
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: this.chartData.employees.map(employee => employee.name),
          title: {
            text: this.$t('dueDiligence.assignedEmployees'),
            style: {
              color: '#64748B',
              fontSize: '12px'
            }
          },
          labels: {
            style: {
              colors: '#6B7280',
              fontSize: '12px',
              fontWeight: 500
            },
            rotate: -45,
            maxHeight: 120
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
              text: this.$t('days'),
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
                return Math.floor(value);
              }
            },
            min: 0,
            max: yAxisMax,
            tickAmount: Math.min(Math.ceil(yAxisMax / tickInterval), 10), // Limit to max 10 ticks
            forceNiceScale: true
          },
        fill: {
          opacity: 1,
          colors: ['#4A90E2']
        },
        tooltip: {
          shared: false,
          intersect: true,
          custom: ({ dataPointIndex }) => {
            const employee = this.chartData.employees[dataPointIndex];
            if (!employee) return '';
            
            const averageTimeLabel = this.$t('dueDiligence.averageTime');
            const daysLabel = this.$t('days');
            const reportsProcessedLabel = this.$t('dueDiligence.reportsProcessed');
            
            return `
              <div style="padding: 12px; background: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-family: Roboto, sans-serif;">
                <div style="font-weight: 600; font-size: 14px; color: #1F2937; margin-bottom: 8px; border-bottom: 1px solid #E5E7EB; padding-bottom: 6px;">
                  ${employee.name}
                </div>
                <div style="display: flex; flex-direction: column; gap: 4px;">
                  <div style="display: flex; justify-space-between; align-items: center;">
                    <span style="font-size: 12px; color: #374151;">${averageTimeLabel}:</span>
                    <strong style="font-size: 12px; color: #0170E5;">${employee.averageTime} ${daysLabel}</strong>
                  </div>
                  <div style="display: flex; justify-space-between; align-items: center;">
                    <span style="font-size: 12px; color: #374151;">${reportsProcessedLabel}:</span>
                    <strong style="font-size: 12px; color: #374151;">${employee.reportsProcessed || 0}</strong>
                  </div>
                </div>
              </div>
            `;
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
        responsive: [
          {
            breakpoint: 768,
            options: {
              chart: {
                height: 300
              },
              plotOptions: {
                bar: {
                  columnWidth: 35
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
    isIndonesianClient() {
      return isIndonesianClient();
    },
    isKenyaClient() {
      return isKenyaClient();
    }
  },
  mounted() {
    this.fetchAverageTimeData();
  },
  watch: {
    selectedPeriod() {
      if (!this.hasCustomDateRange) {
        this.fetchAverageTimeData();
      }
    },
  },
  methods: {
    async fetchAverageTimeData() {
      this.loading = true;
      try {
        // Prepare input for API call using DateFilterInput structure
        const input = {};
        
        // Add date filtering
        if (this.selectedStartDate && this.selectedEndDate) {
          input.dateFilter = 'custom';
          input.startDate = this.selectedStartDate;
          input.endDate = this.selectedEndDate;
        } else {
          input.dateFilter = this.selectedPeriod;
        }
        
        // Add product filter if selected
        if (this.selectedProduct) {
          input.productId = this.selectedProduct;
        }
        
        // Call the API
        const response = await DeforestationService.averageProcessingTimeByEmployee(input);
        if (response && response.data && response.data.averageProcessingTimeByEmployee) {
          const apiData = response.data.averageProcessingTimeByEmployee;
          
          // Transform API response to match chart data structure
          this.chartData = {
            employees: apiData.employees.map(emp => ({
              name: emp.employeeName,
              averageTime: emp.averageProcessingTimeInDays,
              reportsProcessed: emp.totalReportsProcessed
            })),
            overallAverageTime: apiData.overallAverageProcessingTimeInDays,
            totalReportsProcessed: apiData.totalReportsProcessed
          };
        } else {
          // Show empty state when no data is available
          this.chartData = {
            employees: [],
            overallAverageTime: 0,
            totalReportsProcessed: 0
          };
        }
        
      } catch (error) {
        console.error('Error fetching average time data:', error);
        // Show empty state on error
        this.chartData = {
          employees: [],
          overallAverageTime: 0,
          totalReportsProcessed: 0
        };
      } finally {
        this.loading = false;
      }
    },
    
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      return `${d.getDate().toString().padStart(2, '0')}-${months[d.getMonth()]}-${d.getFullYear()}`;
    },
    
    // Date picker methods
    openDatePicker() {
      this.datePickerMode = 'start';
      this.showDatePicker = true;
    },
    closeDatePicker() {
      this.showDatePicker = false;
    },
    onDateSelected(date) {
      if (this.datePickerMode === 'start') {
        this.selectedStartDate = date;
        if (this.selectedEndDate && date > this.selectedEndDate) {
          this.selectedEndDate = null;
        }
      } else {
        this.selectedEndDate = date;
      }
    },
    switchToEndDate() {
      this.datePickerMode = 'end';
    },
    applyDateSelection() {
      this.showDatePicker = false;
      this.fetchAverageTimeData();
    },
    clearDateRange() {
      this.selectedStartDate = null;
      this.selectedEndDate = null;
      this.fetchAverageTimeData();
    },
    
    // Filter modal methods
    onFilterApplied(filters) {
      this.selectedCountry = filters.country;
      this.selectedRegion = filters.region;
      this.selectedProduct = filters.product;
      this.fetchAverageTimeData();
    },
    onFiltersCleared() {
      this.selectedCountry = 'indonesia';
      this.selectedRegion = null;
      this.selectedProduct = null;
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
  }
};
</script>

<style scoped>
.card-info-icon {
  color: v-bind('isIndonesianClient ? "#0170E5" : isKenyaClient ? "#944A00" : "#00bd73"');
}
.dds-chart-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
  margin: 0;
  
}

.chart-filters .v-btn-toggle {
  border-radius: 8px;
  overflow: hidden;
}

.chart-filters .v-btn {
  text-transform: none;
  font-weight: 500;
  border-radius: 0;
}

.chart-header {
  .v-row {
    @media (max-width: 960px) {
      .v-col:first-child {
        margin-bottom: 16px;
      }
      
      .v-col:last-child {
        justify-content: flex-start !important;
      }
    }
  }
}

/* Chart controls container for proper wrapping */
.chart-controls-container {
  gap: 8px;
}

/* Add margin-bottom to all chart control items for proper spacing when wrapped */
.chart-control-item {
  margin-bottom: 8px;
}

/* Remove margin-bottom on larger screens where wrapping is less likely */
@media (min-width: 1200px) {
  .chart-control-item {
    margin-bottom: 0;
  }
}

/* Responsive adjustments for better spacing */
@media (max-width: 960px) {
  .chart-controls-container {
    justify-content: flex-start !important;
    gap: 12px;
  }
  
  .chart-control-item {
    margin-bottom: 12px;
  }
  
  .chart-control-item:last-child {
    margin-bottom: 0;
  }
}

.chart-filters {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chart-filters .v-btn-toggle {
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  overflow: hidden;
}

.chart-filters .v-btn {
  border: none !important;
  text-transform: none;
  font-weight: 500;
  color: #6B7280;
}

.chart-filters .v-btn.primary {
  background-color: #0170E5 !important;
  color: white !important;
}


.custom-period-selector {
  display: flex;
  border: 1px solid v-bind('isIndonesianClient ? "#00559F" : isKenyaClient ? "#944A00" : "#00bd73"');
  border-radius: 8px;
  overflow: hidden;
}

.custom-period-button {
  padding: 6px 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease;
  user-select: none;
}

.custom-period-button:hover:not(.custom-period-button-active) {
  background-color: #f1f5f9;
}

.custom-period-button-active {
  background-color: v-bind('isIndonesianClient ? "#00559F" : isKenyaClient ? "#944A00" : "#00bd73"') !important;
  color: white !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.custom-period-button[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}


.date-range-display {
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 6px 8px;
  font-size: 0.875rem;
  color: #475569;
}

.date-range-text {
  font-weight: 500;
  white-space: nowrap;
}

.average-time-display {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.date-range-display .v-icon {
  color: v-bind('isIndonesianClient ? "#00559F" : isKenyaClient ? "#944A00" : "#00bd73"');
}

.average-number {
  font-size: 36px;
  font-weight: 700;
}

.average-label {
  font-size: 12px;
  color: #64748B;
  font-weight: 400;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 350px;
  color: #6B7280;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #E5E7EB;
  border-top: 4px solid v-bind('isIndonesianClient ? "#00559F" : isKenyaClient ? "#944A00" : "#00bd73"');
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.no-data-available {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 350px;
  color: #9CA3AF;
}

</style>