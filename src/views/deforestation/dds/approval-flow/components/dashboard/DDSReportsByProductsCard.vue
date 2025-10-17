<template>
  <v-card class="dds-chart-card pa-4" elevation="2" outlined>
    <!-- Chart Header -->
    <div class="chart-header mb-4">
      <h3 class="chart-title mb-2 border-bottom pb-2">{{ $t('dueDiligence.ddsReportsByProducts') }}
         <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                color="#1976D2"
                v-bind="attrs"
                v-on="on"
                size="20"
                class="ml-2 brand-color"
              >
                mdi-information
              </v-icon>
            </template>
            <span>{{ $t('dueDiligence.ddsReportsByProducts') }}</span>
          </v-tooltip>
      </h3>
      <div class="d-flex align-center justify-space-between chart-controls-wrapper">
        
        <!-- Filter Controls -->
        <div class="chart-filters chart-controls-container">
          <!-- Custom period selector -->
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
        </div>
      </div>
    </div>

    <!-- Chart Container -->
    <div class="chart-container">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>{{ $t('dueDiligence.loadingChartData') }}</p>
      </div>
      <apexchart
        v-else
        ref="chart"
        type="bar"
        height="300"
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
import { isIndonesianClient, isKenyaClient } from '@/utils.js'
import FilterModal from '@/components/common/FilterModal.vue'

export default {
  name: 'DDSReportsByProductsCard',
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
        products: [
        ]
      },
      countryOptions: [
        { name: 'Indonesia', value: 'indonesia' },
      ],
      regionOptions: [
      ],
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
    chartSeries() {
      return [{
        name: this.$t('dueDiligence.noOfReports'),
        data: this.chartData.products.map(product => product.value),
        color: '#0170E5'
      }];
    },
    chartOptions() {
      const maxValue = Math.max(...this.chartData.products.map(p => p.value));
      
      return {
        chart: {
          type: 'bar',
          height: 300,
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
            columnWidth: '20%',
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
            colors: ['#374151']
          },
          formatter: function (val) {
            return val;
          }
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: this.chartData.products.map(product => product.name),
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
              return Math.floor(value);
            }
          },
          min: 0,
          max: Math.ceil(maxValue * 1.2)
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + " " + this.$t('dueDiligence.reports');
            }
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
        colors: ['#0170E5'],
        responsive: [
          {
            breakpoint: 768,
            options: {
              chart: {
                height: 300
              },
              plotOptions: {
                bar: {
                  columnWidth: '50%'
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
  methods: {
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      return `${d.getDate().toString().padStart(2, '0')}-${months[d.getMonth()]}-${d.getFullYear()}`;
    },
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
      } else {
        this.selectedEndDate = date;
      }
    },
    switchToEndDate() {
      this.datePickerMode = 'end';
    },
    applyDateSelection() {
      this.closeDatePicker();
      this.fetchChartData();
    },
    clearDateRange() {
      this.selectedStartDate = null;
      this.selectedEndDate = null;
      this.selectedPeriod = 'all';
      this.fetchChartData();
    },
    
    // Filter modal methods
    onFilterApplied(filters) {
      this.selectedCountry = filters.country;
      this.selectedRegion = filters.region;
      this.selectedProduct = filters.product;
      this.fetchChartData();
    },
    onFiltersCleared() {
      this.selectedCountry = 'indonesia';
      this.selectedRegion = null;
      this.selectedProduct = null;
    },

    async fetchChartData() {
      this.loading = true;
      try {
        const input = {};
        
        if (this.selectedStartDate && this.selectedEndDate) {
          input.dateFilter = 'custom';
          input.startDate = this.selectedStartDate;
          input.endDate = this.selectedEndDate;
        } else {
          input.dateFilter = this.selectedPeriod;
        }
        
        if (this.selectedProduct) {
          input.productId = this.selectedProduct;
        }
        
        const response = await DeforestationService.getDDSReportByProducts(input);
        
        if (response && response.data && response.data.diligenceReportsByProductAndDate) {
          this.chartData = {
            products: response.data.diligenceReportsByProductAndDate.map(item => ({
              name: item.productName,
              value: item.count
            }))
          };
        } else {
          this.chartData = {
            products: []
          };
        }
        
      } catch (error) {
        console.error('Error fetching chart data:', error);
        this.chartData = {
          products: []
        };
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.fetchChartData();
  },
  watch: {
    selectedPeriod() {
      if (this.selectedPeriod && (this.selectedStartDate || this.selectedEndDate)) {
        this.selectedStartDate = null;
        this.selectedEndDate = null;
      }
      this.fetchChartData();
    }
  }
};
</script>

<style scoped>
.brand-color {
  color: v-bind('isIndonesianClient ? "#00559F" : isKenyaClient ? "#944A00" : "#00bd73"') !important;
}
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

/* Chart controls wrapper for responsive behavior */
.chart-controls-wrapper {
  flex-wrap: wrap;
  gap: 8px;
}

/* Chart controls container for proper wrapping */
.chart-controls-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
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

.date-range-display .v-icon {
  color: v-bind('isIndonesianClient ? "#00559F" : isKenyaClient ? "#944A00" : "#00bd73"');
}

.chart-container {
  width: 100%;
  overflow-x: auto;
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
  border-top: 4px solid v-bind('isIndonesianClient ? "#0170E5" : isKenyaClient ? "#944A00" : "#00bd73"');
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

@media (max-width: 768px) {
  .chart-header {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 12px;
  }
  
  .chart-filters {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  
  .chart-title {
    font-size: 1rem;
  }
  
  .date-range-display {
    margin-left: 0 !important;
    margin-top: 8px;
  }
}

@media (max-width: 600px) {
  .chart-header .d-flex {
    flex-direction: column;
    align-items: flex-start !important;
  }
  
  .chart-filters {
    margin-top: 8px;
    width: 100%;
  }
  
  .custom-period-selector {
    flex: 1;
  }
  
  .date-range-display {
    width: 100%;
    margin-left: 0 !important;
    margin-top: 8px;
    justify-content: center;
  }
}
</style>
