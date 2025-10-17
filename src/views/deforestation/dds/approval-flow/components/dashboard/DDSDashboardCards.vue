<template>
  <div class="dds-dashboard">
    <!-- Filter Bar -->
    <div class="filter-header mb-4">
      <div class="d-flex align-center justify-space-between flex-wrap filter-bar">
        <!-- Left Side: Period Toggle -->
        <div class="chart-filters">
          <!-- Custom period selector -->
          <div class="custom-period-selector">
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
          <div class="date-range-display ml-3" @click="openDatePicker" style="cursor: pointer;">
            <v-icon small class="mr-1">mdi-calendar</v-icon>
            <span class="date-range-text">{{ formattedDateRange }}</span>
            <v-btn icon x-small class="ml-1" @click.stop="clearDateRange" v-if="selectedStartDate && selectedEndDate">
              <v-icon small>mdi-close</v-icon>
            </v-btn>
          </div>
        </div>
        
        <!-- Right Side: Dropdowns and Action Buttons -->
        <div class="d-flex align-center gap-3 flex-wrap">
          <!-- Region Filter -->
          <!-- <v-select
            v-model="selectedRegion"
            :items="regionOptions"
            :label="$t('dueDiligence.selectRegion')"
            item-text="name"
            item-value="value"
            dense
            outlined
            clearable
            class="filter-select"
            style="min-width: 140px;"
            :disabled="loading"
            :loading="loading"
          ></v-select> -->
          
          <!-- Product Filter -->
          <v-select
            v-model="selectedProduct"
            :items="productOptions"
            :label="$t('dueDiligence.selectProduct')"
            item-text="name"
            item-value="value"
            dense
            outlined
            clearable
            class="filter-select"
            style="min-width: 140px;"
            :disabled="loading"
            :loading="loading"
          ></v-select>
          
          <!-- Action Buttons -->
          <v-btn
            small
            color="primary"
            class="reset-btn"
            @click="resetFilters"
            :loading="loading"
            :disabled="loading"
          >
            {{ $t('dueDiligence.resetFilters') }}
          </v-btn>
          
          <v-btn
            small
            color="primary"
            class="apply-btn"
            @click="applyFilters"
            :loading="loading"
            :disabled="loading"
          >
            {{ $t('dueDiligence.apply') }}
          </v-btn>
        </div>
      </div>
    </div>
    
    <!-- Loading Overlay -->
    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
      size="64"
      class="loading-overlay"
    ></v-progress-circular>

    <!-- Dashboard Cards Grid -->
    <v-container fluid class="pa-0" :class="{ 'loading-blur': loading }">
      <v-row class="dashboard-cards-row">

         <!-- Active Cooperatives -->
        <v-col cols="12" sm="6" lg="4" class="dashboard-card-col" v-if="!isWorker">
          <DDSCard
            :title="$t('dueDiligence.activeCooperatives')"
            :value="statisticsData.activeCooperatives"
            icon="activeCooperatives"
            color="#10B981"
            :trend="parseTrendValue(statisticsData.activeCooperativesChange)"
            :info-tooltip="$t('dueDiligence.numberActiveCooperatives')"
            @card-click="handleCardClick"
          />
        </v-col>

        <!-- Active Exporters -->
        <v-col cols="12" sm="6" lg="4" class="dashboard-card-col" v-if="!isWorker">
          <DDSCard
            :title="$t('dueDiligence.activeExporters')"
            :value="statisticsData.activeExporters"
            icon="activeExporters"
            color="#0170E5"
            :trend="parseTrendValue(statisticsData.activeExportersChange)"
            :info-tooltip="$t('dueDiligence.numberActiveExporters')"
          />
        </v-col>

        <!-- Registered Farms -->
        <v-col cols="12" sm="6" lg="4" class="dashboard-card-col" v-if="!isWorker">
          <DDSCard
            :title="$t('dueDiligence.registeredFarms')"
            :value="statisticsData.registeredFarms"
            icon="registeredFarms"
            color="#6B7280"
            :trend="parseTrendValue(statisticsData.registeredFarmsChange)"
            :info-tooltip="$t('dueDiligence.totalNumberRegisteredFarms')"
          />
        </v-col>

        <!-- DDS Compliant -->
        <v-col cols="12" sm="6" lg="4" class="dashboard-card-col">
          <DDSCard
            :title="$t('dueDiligence.ddsCompliant')"
            :value="statisticsData.ddsCompliant"
            icon="ddsCompliant"
            color="#10B981"
            :trend="parseTrendValue(statisticsData.ddsCompliantChange)"
            :info-tooltip="$t('dueDiligence.numberDdsReportsCompliant')"
            @card-click="handleCardClick"
          />
        </v-col>

        <!-- DDS Approved -->
        <v-col cols="12" sm="6" lg="4" class="dashboard-card-col" v-if="!isWorker">
          <DDSCard
            :title="$t('dueDiligence.ddsApproved')"
            :value="statisticsData.ddsApproved"
            icon="ddsApproved"
            color="#0170E5"
            :trend="parseTrendValue(statisticsData.ddsApprovedChange)"
            :info-tooltip="$t('dueDiligence.numberDdsReportsApproved')"
            @card-click="handleCardClick"
          />
        </v-col>

        <!-- DDS Assigned to Me -->
        <v-col cols="12" sm="6" lg="4" class="dashboard-card-col">
          <DDSCard
            :title="$t('dueDiligence.ddsAssignedToMe')"
            :value="statisticsData.ddsAssignedToMe"
            icon="activeDDSAssigned"
            color="#10B981"
            :trend="parseTrendValue(statisticsData.ddsAssignedToMeChange)"
            :info-tooltip="$t('dueDiligence.numberDdsReportsAssignedToMe')"
            @card-click="handleCardClick"
          />
        </v-col>

        <!-- DDS Overdue -->
        <v-col cols="12" sm="6" lg="4" class="dashboard-card-col">
          <DDSCard
            :title="$t('dueDiligence.ddsOverdue')"
            :value="statisticsData.ddsOverdue"
            icon="ddsOverdue"
            color="#F97316"
            :trend="parseTrendValue(statisticsData.ddsOverdueChange)"
            :info-tooltip="$t('dueDiligence.numberDdsReportsOverdue')"
            @card-click="handleCardClick"
          />
        </v-col>

        <!-- DDS Non-Compliant -->
        <v-col cols="12" sm="6" lg="4" class="dashboard-card-col">
          <DDSCard
            :title="$t('dueDiligence.ddsNonCompliant')"
            :value="statisticsData.ddsNonCompliant"
            icon="ddsNonCompliant"
            color="#F03737"
            :trend="parseTrendValue(statisticsData.ddsNonCompliantChange)"
            :info-tooltip="$t('dueDiligence.numberDdsReportsNonCompliant')"
            @card-click="handleCardClick"
          />
        </v-col>
      </v-row>
    </v-container>
    
    <!-- Date Picker Modal -->
    <v-dialog v-model="showDatePicker" width="400" @click:outside="closeDatePicker">
      <v-card>
        <v-toolbar color="primary" class="white--text">
          <v-toolbar-title class="font-weight-bold">
            {{ $t('select')}} {{ datePickerMode === 'start' ? $t('dueDiligence.start') : $t('dueDiligence.end') }} {{ $t('date')}}
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

    <!-- DDS Card Modal -->
    <DDSCardModal
      :is-open="showModal"
      :card-data="selectedCardData"
      :filter-data="selectedFilterData"
      @close="closeModal"
      @view-reports="handleViewReports"
      @export-data="handleExportData"
      @view-details="handleViewDetails"
    />
  </div>
</template>

<script>
import DDSCard from './DDSCard.vue';
import DDSCardModal from './DDSCardModal.vue';
import DeforestationService from '@/_services/DeforestationService';
import { currentRoles, isIndonesianClient, isKenyaClient } from '@/utils';

export default {
  name: 'DDSDashboard',
  components: {
    DDSCard,
    DDSCardModal
  },
  props: {
    dashboardData: {
      type: Object,
      default: () => ({
        totalAssigned: 0,
        compliant: 0,
        approved: 0,
        activeAssigned: 0,
        overdue: 0,
        nonCompliant: 0,
        activeCooperatives: 0,
        activeExporters: 0,
        registeredFarms: 0
      })
    }
  },
  data() {
    return {
      selectedPeriod: 'all',
      selectedRegion: null,
      selectedProduct: null,
      loading: true,
      statisticsData: {
        activeCooperatives: 0,
        activeExporters: 0,
        registeredFarms: 0,
        ddsCompliant: 0,
        ddsApproved: 0,
        ddsNonCompliant: 0,
        ddsAssignedToMe: 0,
        ddsOverdue: 0,
        activeCooperativesChange: null,
        ddsCompliantChange: null,
        ddsNonCompliantChange: null,
        ddsApprovedChange: null,
        ddsOverdueChange: null,
        ddsAssignedToMeChange: null,
        registeredFarmsChange: null,
        activeExportersChange: null
      },
      // Date picker state
      showDatePicker: false,
      selectedStartDate: null,
      selectedEndDate: null,
      datePickerMode: 'start', // 'start' or 'end'
      // Modal state
      showModal: false,
      selectedCardData: null,
      selectedFilterData: null,
      regionOptions: [],
      productOptions: []
    };
  },
  computed: {
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
    periodOptions() {
      return [
        { value: 'today', label: this.$t('dueDiligence.today') },
        { value: 'week', label: this.$t('dueDiligence.week') },
        { value: 'month', label: this.$t('dueDiligence.month') },
        { value: 'year', label: this.$t('dueDiligence.year') },
        { value: 'all', label: this.$t('dueDiligence.all') }
      ];
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
    async loadProductOptions() {
      try {
        const response = await DeforestationService.getProductList();
        
        if (response && response.data && response.data.deforestationProductList) {
          // Filter for target products (handling both English and Indonesian names)
          const targetProducts = ['Cocoa', 'Coffee', 'Rubber', 'Kakao', 'Kopi', 'Karet'];
          const filteredProducts = response.data.deforestationProductList
            .filter(product => targetProducts.includes(product.name))
            .map(product => {
              // Map Indonesian names to English for display
              let displayName = product.name;
              if (product.name === 'Kakao') displayName = 'Cocoa';
              if (product.name === 'Kopi') displayName = 'Coffee';
              if (product.name === 'Karet') displayName = 'Rubber';
              
              return {
                name: displayName,
                value: parseInt(product.id)
              };
            });
          
          // Add "All Products" option at the beginning
          this.productOptions = [
            { name: this.$t('dueDiligence.allProducts'), value: null },
            ...filteredProducts
          ];
        } else {
          // Fallback to static options if API response is empty
          this.productOptions = [
            { name: this.$t('dueDiligence.allProducts'), value: null },
            { name: 'Coffee', value: 2 },
            { name: 'Cocoa', value: 3 },
            { name: 'Rubber', value: 5 }
          ];
        }
      } catch (error) {
        console.error('Error loading product options:', error);
        
        // Fallback to static options if API fails
        this.productOptions = [
          { name: this.$t('dueDiligence.allProducts'), value: null },
          { name: 'Coffee', value: 2 },
          { name: 'Cocoa', value: 3 },
          { name: 'Rubber', value: 5 }
        ];
        
        // Show user-friendly message
        this.$toast.warning('Unable to load products from server. Using default options.');
      }
    },
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
    },
    clearDateRange() {
      this.selectedStartDate = null;
      this.selectedEndDate = null;
      this.selectedPeriod = 'all';
    },
    async fetchDashboardStatistics() {
      this.loading = true;
      try {
        const input = {
          cfRoles: currentRoles()
        };
        
        // Only send filterType if no custom dates are selected
        if (this.selectedStartDate && this.selectedEndDate) {
          input.startDate = this.selectedStartDate;
          input.endDate = this.selectedEndDate;
        } else {
          input.filterType = this.selectedPeriod;
        }
        
        // Add product filter - if no specific product selected, pass all product IDs
        if (this.selectedProduct) {
          input.products = [this.selectedProduct];
        } else {
          // Pass all available product IDs when no specific product is selected
          const allProductIds = this.productOptions
            .filter(option => option.value !== null)
            .map(option => option.value);
          if (allProductIds.length > 0) {
            input.products = allProductIds;
          }
        }
        
        // Add region filter if selected
        if (this.selectedRegion) {
          input.regions = [this.selectedRegion];
        }
        
        const response = await DeforestationService.getDashboardStatistics(input);
        if (response.data && response.data.dashboardStatistics) {
          this.statisticsData = response.data.dashboardStatistics;
        }
      } catch (error) {
        console.error('Error fetching dashboard statistics:', error);
      } finally {
        this.loading = false;
      }
    },

    applyFilters() {
       // Emit filter change event to parent component
       this.$emit('filters-changed', {
         period: this.selectedPeriod,
         region: this.selectedRegion,
         product: this.selectedProduct,
         startDate: this.selectedStartDate,
         endDate: this.selectedEndDate
       });
       
       // Fetch filtered data
       this.fetchDashboardStatistics();
     },
    resetFilters() {
       this.selectedPeriod = 'all';
       this.selectedRegion = null;
       this.selectedProduct = null;
       this.selectedStartDate = null;
       this.selectedEndDate = null;
       // Apply the reset filters immediately
       this.fetchDashboardStatistics();
       this.$emit('filters-reset');
     },
    parseTrendValue(changeValue) {
      // Hide trends when filterType is 'all'
      if (this.selectedPeriod === 'all') return null;
      
      if (!changeValue) return null;
      // If it's already a number, return it
      if (typeof changeValue === 'number') return changeValue;
      // If it's a string with %, parse it
      if (typeof changeValue === 'string') {
        const numericValue = parseFloat(changeValue.replace('%', ''));
        return isNaN(numericValue) ? null : numericValue;
      }
      return null;
    },
    handleCardClick(cardData) {
      // Special handling for Active Cooperatives card - route to cooperatives page
      if (cardData.title === this.$t('dueDiligence.activeCooperatives')) {
        this.$router.push({ name: 'root_cooperatives' });
        return;
      }
      
      // Get both status types for the card
      const cardStatuses = this.getStatusFromTitle(cardData.title); // Due diligence statuses
      const cardStatusLegends = this.getStatusLegendsForCard(cardData.title); // Report status legends
      
      this.selectedCardData = {
        ...cardData,
        category: 'DDS Reports',
        description: cardData.infoTooltip,
        subtitle: `${cardData.title} Details`
      };
      
      // Store filter data for the modal - match the logic from fetchDashboardStatistics
      let productsToPass;
      if (this.selectedProduct) {
        productsToPass = [this.selectedProduct];
      } else {
        // Pass all available product IDs when no specific product is selected
        const allProductIds = this.productOptions
          .filter(option => option.value !== null) // Exclude "All Products" option
          .map(option => option.value);
        productsToPass = allProductIds.length > 0 ? allProductIds : null;
      }
      
      this.selectedFilterData = {
        statuses: cardStatuses, // Maps to selectedStatuses (due diligence statuses)
        statusLegends: cardStatusLegends, // Maps to selectedLegendsStatuses (report status legends)
        assignedToMe: cardData.title === 'DDS Assigned to Me', // Exact match for "DDS Assigned to Me" card
        cardTitle: cardData.title,
        // Additional filters from dashboard - match fetchDashboardStatistics logic
        filterType: (this.selectedStartDate && this.selectedEndDate) ? null : this.selectedPeriod,
        startDate: this.selectedStartDate, // Start date for custom date range
        endDate: this.selectedEndDate, // End date for custom date range
        products: productsToPass, // Selected product IDs or all available products
        region: this.selectedRegion // Include region filter
      };
      
      // Emit event to parent with filter data
      this.$emit('card-clicked', this.selectedFilterData);
      
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedCardData = null;
      this.selectedFilterData = null;
    },
    handleViewReports(cardData) {
      this.$router.push({
        name: 'DDSReports',
        query: {
          status: this.getStatusFromTitle(cardData.title),
          // Add other relevant filters
        }
      });
    },
    handleExportData() {
      // Implement export functionality
      // This could trigger a download or open export options
    },
    handleViewDetails() {
      this.closeModal();
      // Additional navigation logic here
    },
    getStatusFromTitle(title) {
      const titleLower = title.toLowerCase();
      if (titleLower.includes('compliant') && !titleLower.includes('non')) {
        return ['Compliant'];
      }
      if (titleLower.includes('non-compliant')) {
        return ['Non-Compliant']; 
      }
      return [];
    },
    
    getStatusLegendsForCard(title) {
      // Map dashboard card titles to exact report status legends (selectedLegendsStatuses)
      const titleLower = title.toLowerCase();
      if (titleLower.includes('approved')) {
        return ['approved']; // Use exact "approved" status only
      }
      if (titleLower.includes('overdue')) {
        return ['overdue']; // Use exact "overdue" status
      }
      return [];
    }
  },
  async mounted() {
    await this.loadProductOptions();
    await this.fetchDashboardStatistics();
  },

  watch: {
    selectedPeriod() {
      if (this.selectedPeriod && (this.selectedStartDate || this.selectedEndDate)) {
        this.selectedStartDate = null;
        this.selectedEndDate = null;
      }
    }
  }
};
</script>

<style scoped>
.brand-color {
  color: v-bind('isIndonesianClient ? "#00559F" : isKenyaClient ? "#944A00" : "#00bd73"') !important;
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

.dds-dashboard {
  width: 100%;
  padding: 0;
}

/* Filter Header Styles */
.filter-header {
  background: #ffffff;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-filters {
   display: flex;
   align-items: center;
   gap: 8px;
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

/* Loading Overlay Styles */
.loading-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading-text {
  color: #475569;
  font-weight: 500;
  font-size: 0.875rem;
  margin: 0;
}

.loading-blur {
  filter: blur(2px);
  pointer-events: none;
  transition: filter 0.3s ease;
}

.dds-dashboard {
  position: relative;
}

.dashboard-title {
  color: #1f2937;
  font-weight: 600;
  margin: 0;
}

.period-toggle {
  border-radius: 6px;
  overflow: hidden;
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

.filter-select {
  max-width: 200px;
  margin-right: 8px;
}

.filter-select ::v-deep .v-select__selection {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
}

.filter-select ::v-deep .v-select__slot > input {
  font-size: 0.875rem;
}

.filter-select ::v-deep .v-input__control {
  min-height: 36px !important;
}

.filter-select ::v-deep .v-input__slot {
  padding: 0 12px !important;
  min-height: 36px !important;
}

.filter-select ::v-deep .v-text-field__details {
  display: none;
}

.filter-select ::v-deep fieldset {
  border-color: #d1d5db !important;
  border-radius: 6px !important;
}

.filter-select ::v-deep .v-input--is-focused fieldset {
  border-color: #0170E5 !important;
  border-width: 2px !important;
}

.reset-btn {
  text-transform: none !important;
  font-weight: 500;
  height: 36px !important;
  border-radius: 6px !important;
  padding: 0 16px !important;
  font-size: 0.875rem !important;
  background-color: v-bind('isIndonesianClient ? "#0170E5" : isKenyaClient ? "#944A00" : "#00bd73"');
  color: white !important;
  margin-right: 8px;
}

.reset-btn:hover {
  background-color: v-bind('isIndonesianClient ? "#0170E5" : isKenyaClient ? "#944A00" : "#00bd73"');
}

.apply-btn {
  text-transform: none !important;
  font-weight: 500;
  height: 36px !important;
  border-radius: 6px !important;
  padding: 0 20px !important;
  font-size: 0.875rem !important;
  background-color: v-bind('isIndonesianClient ? "#0170E5" : isKenyaClient ? "#944A00" : "#00bd73"');
  color: white !important;
}

.apply-btn:hover {
  background-color: v-bind('isIndonesianClient ? "#0170E5" : isKenyaClient ? "#944A00" : "#00bd73"');
}

.dashboard-cards-row {
  margin: 0;
  padding: 0;
}

.dashboard-card-col {
  padding: 8px;
}

/* Mobile Responsive Styles */
 @media (max-width: 1200px) {
   .filter-header .d-flex {
     flex-direction: column;
     align-items: flex-start !important;
     gap: 16px;
   }
   
   .chart-filters {
     width: 100%;
     justify-content: flex-start;
     flex-wrap: wrap;
   }
   
   .date-range-display {
     margin-left: 0 !important;
   }
   
   .filter-header .d-flex > div:last-child {
     width: 100%;
     justify-content: flex-start;
   }
 }
 
 @media (max-width: 768px) {
   .filter-header {
     padding: 16px;
   }
   
   .chart-filters .v-btn-toggle {
     flex: 1;
   }
   
   .date-range-display {
     width: 100%;
     margin-left: 0 !important;
     margin-top: 8px;
     justify-content: center;
   }
   
   .filter-select {
     min-width: 120px !important;
     flex: 1;
   }
   
   .reset-btn {
     min-width: 100px;
     height: 32px !important;
     font-size: 0.8125rem !important;
   }
   
   .apply-btn {
     min-width: 80px;
     height: 32px !important;
     font-size: 0.8125rem !important;
   }
 }
 
 @media (max-width: 600px) {
   .filter-header .d-flex > div:last-child {
     flex-direction: column;
     align-items: stretch;
     gap: 12px;
   }
   
   .filter-select {
     min-width: auto !important;
     width: 100%;
   }
   
   .filter-select ::v-deep .v-input__control {
     min-height: 40px !important;
   }
   
   .filter-select ::v-deep .v-input__slot {
     min-height: 40px !important;
   }
   
   .reset-btn {
     width: 100%;
     height: 40px !important;
     font-size: 0.875rem !important;
   }
   
   .apply-btn {
     width: 100%;
     height: 40px !important;
     font-size: 0.875rem !important;
   }
 }

/* Large screens: 3 columns */
@media (min-width: 1264px) {
  .dashboard-card-col {
    flex: 0 0 33.333333%;
    max-width: 33.333333%;
  }
}

/* Medium screens: 2 columns */
@media (min-width: 960px) and (max-width: 1263px) {
  .dashboard-card-col {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

/* Small screens: 2 columns */
@media (min-width: 600px) and (max-width: 959px) {
  .dashboard-card-col {
    flex: 0 0 50%;
    max-width: 50%;
    padding: 6px;
  }
}

/* Extra small screens: 1 column */
@media (max-width: 599px) {
  .dashboard-card-col {
    flex: 0 0 100%;
    max-width: 100%;
    padding: 4px;
  }
}

/* Ensure proper spacing */
.v-container {
  max-width: 100%;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .dashboard-cards-row {
    margin: 0 -4px;
  }
  
  .dashboard-card-col {
    padding: 4px;
  }
}

@media (max-width: 480px) {
  .dashboard-card-col {
    padding: 2px;
  }
}
.filter-bar {
  /* adds spacing between items and rows when wrapping */
  gap: 12px;
  row-gap: 12px;
  /* Fallback for browsers without flex gap support */
  .filter-bar > * {
    margin-block: 6px;
  }
}
</style>