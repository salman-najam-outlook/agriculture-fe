<template>
    <div>
      <breadcrumb :items="breadcrumbs"></breadcrumb>
      <v-container fluid class="pt-0">
        <h2 class="mb-4">{{ $t('deforestation.eudrDueDeligenceReports') }}</h2>
        <HeroSection :currentTab="currentTab" @searchReport="handleHeroSearch" @searchShipment="handleShipmentSearch" />
  
        <v-card class="mt-4" elevation="0">
          <v-card-text>
            <v-tabs v-model="currentTab">
              <v-tab href="#tab-reports" class="text-capitalize font-weight-bold">
                {{ $t('dueDiligence.dueDiligenceReports') }}
              </v-tab>
              <v-tab href="#tab-shipments" class="text-capitalize font-weight-bold">
                {{ $t('dueDiligence.shipments') }}
              </v-tab>
            </v-tabs>
            <v-tabs-items v-model="currentTab" class="black--text">
              <v-tab-item value="tab-reports">
                <div class="px-4 py-6">
                  <div class="d-flex align-center mb-2">
                    <h3 class="font-weight-bold mr-2">{{ $t('dueDiligence.dueDiligenceReports') }}</h3>
                    <v-icon color="primary">mdi-information</v-icon>
                  </div>
                  <AdminDueDiligenceReports :heroSearchData="heroSearchData" />
                </div>
              </v-tab-item>
              <v-tab-item value="tab-shipments">
                <div class="px-4 py-6">
                  <div class="d-flex align-center mb-2">
                    <h3 class="font-weight-bold mr-2">{{ $t('dueDiligence.shipments') }}</h3>
                    <v-icon color="primary">mdi-information</v-icon>
                  </div>
                  <Shipments :heroSearchData="shipmentSearchData" />
                </div>
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </v-card>
      </v-container>
    </div>
  </template>
  
  <script>
  import AdminDueDiligenceReports from './components/AdminDueDiligenceReportsComponent.vue';
  import HeroSection from './components/HeroSection.vue';
  import Shipments from './components/Shipments.vue';

  export default {
    components: {
      HeroSection,
      AdminDueDiligenceReports,
      Shipments,
    },
    data() {
      return {
        currentTab: 'tab-reports',
        breadcrumbs: [
          {
            text: this.$t('deforestation.dueDeligence'),
            disabled: true,
          },
          {
            text: this.$t('dueDiligence.dueDiligenceReports'),
            disabled: true,
          },
        ],
        heroSearchData: {},
        shipmentSearchData: {},
      };
    },
    watch: {
      currentTab() {
        this.heroSearchData = {};
        this.shipmentSearchData = {};
      }
    },
    methods: {
      handleHeroSearch(data) {
          if (this.currentTab === 'tab-shipments') {
            this.shipmentSearchData = data;
            this.heroSearchData = {};
          } else {
            this.heroSearchData = data;
            this.shipmentSearchData = {};
          }
      },
      handleShipmentSearch(data) {
        console.log('Parent handleShipmentSearch called with:', data);
        this.shipmentSearchData = data;
        this.heroSearchData = {};
      }
    },
  };
  </script>