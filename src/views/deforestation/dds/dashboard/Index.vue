<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid class="px-6 py-0">
      <div class="d-flex">
        <h2>{{ $t('dueDiligence.dueDiligenceReportCreation') }}</h2>
        <v-spacer></v-spacer>
      </div>

      <v-card elevation="0" class="px-5 mt-7">
        <v-card-text>
          <v-row style="margin-left:-30px; margin-bottom: 20px; margin-top: 15px;">
            <v-col v-if="!isOperator && !isSupplier && !isDdsExporter" cols="12" sm="6" md="4" lg="3">
              <v-card @click="redirectToCreateDueDiligence"
                class="mx-auto rounded-lg d-flex flex-column align-center justify-center dashboard-card"
                style="cursor: pointer;">
                <v-img max-height="100" max-width="95" :src="isIndonesianClient ? '/img/id/edit.svg' : isKenyaClient ? '/img/ke/edit.svg' : '/img/edit.png'" class="img-center mb-3"></v-img>
                <span class="card-title text-center">{{ $t('dueDiligence.createNewDueDiligenceProgress') }}</span>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="3">
              <v-card @click="redirectTodueDiligenceReports"
                class="mx-auto rounded-lg d-flex flex-column align-center justify-center dashboard-card"
                style="cursor: pointer;">
                <v-img max-height="100" max-width="95" :src="isIndonesianClient ? '/img/id/lists.svg' : isKenyaClient ? '/img/ke/lists.svg' : '/img/list.png'" class="img-center mb-3"></v-img>
                <span class="card-title text-center">{{ $t('dueDiligence.dueDiligenceReports') }}</span>
              </v-card>
            </v-col>
            <v-col v-if="!(isOperator || isSupplier) && !isDdsExporter" cols="12" sm="6" md="4" lg="3">
              <v-card @click="redirectToSettings" class="mx-auto rounded-lg d-flex flex-column align-center justify-center dashboard-card"
                style="cursor: pointer;">
                <v-img max-height="100" max-width="95" :src="isIndonesianClient ? '/img/id/settings.svg' : isKenyaClient ? '/img/ke/settings.svg' : '/img/setting.png'" class="img-center mb-3"></v-img>
                <span class="card-title text-center">{{ $t('deforestation.settings') }}</span>
              </v-card>
            </v-col>

            <v-col v-if="isSupplier" cols="12" sm="6" md="4" lg="3">
              <v-card @click="redirectToMyFarms" class="mx-auto rounded-lg d-flex flex-column align-center justify-center dashboard-card"
                style="cursor: pointer;">
                <v-img max-height="100" max-width="95" :src="isIndonesianClient ? '/img/farm-indonesia.png' : isKenyaClient ? '/img/ke/farm.png' : '/img/farm.png'" class="img-center mb-3"></v-img>
                <span class="card-title text-center">{{ $t('dueDiligence.myFarms') }}</span>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="4" lg="3" v-if="isSupplier">
              <v-card @click="redirectToProducer" class="mx-auto rounded-lg d-flex flex-column align-center justify-center dashboard-card"
                style="cursor: pointer;">
                <v-img max-height="100" max-width="95" :src="isIndonesianClient ? '/img/list-indonesia.png' : isKenyaClient ? '/img/ke/list.png' :  '/img/list.png'" class="img-center mb-3"></v-img>
                <span class="card-title text-center">{{ $t('dueDiligence.listOfProducers') }}</span>
              </v-card>
            </v-col>
          </v-row>

          <div v-if="!isOperator && !isSupplier">
              <div class="d-flex" style="margin-top: 60px;">
              <p class="heading-title">
                {{ $t('dueDiligence.dueDiligenceReports') }}
                <v-tooltip top color="00BD73" max-width="350">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon class="icon-with-background primary--text" v-bind="attrs" v-on="on">
                      mdi-alert-circle
                    </v-icon>
                  </template>
                  <span>{{ $t('dueDiligence.dueDiligenceReportsInfo') }}</span>
                </v-tooltip>
              </p>
              <v-spacer></v-spacer>
            </div>

            <div v-if="$vuetify && $vuetify.breakpoint.smAndDown">
              <div class="mobile-controls-bar mb-4">
                <div class="mobile-controls-left">
                  <v-text-field 
                    prepend-inner-icon="mdi-magnify" 
                    outlined 
                    dense
                    :placeholder="$t('search')" 
                    v-model="reportSearch" 
                    @input="searchQuery" 
                    class="mobile-search"
                  />
                  <v-select 
                    :items="countries"
                    v-model="reportCountry" 
                    item-text="name"
                    item-value="name" 
                    :label="$t('deforestation.allCountries')"
                    @change="getDeforestationEUDR" 
                    outlined 
                    dense
                    class="mobile-filter"
                  />
                  <v-select 
                    v-model="reportStatus" 
                    item-text="text"
                    item-value="val" 
                    :items="allStatus" 
                    :label="$t('deforestation.edurDueDeligenceStatus')" 
                    @change="getDeforestationEUDR"
                    outlined 
                    dense
                    class="mobile-filter"
                  />
                </div>
              </div>

              <v-row>
                <v-col cols="12" v-for="item in diligenceReports" :key="item.id">
                  <v-card class="mb-3 pa-4 report-card">
                    <div class="d-flex align-center justify-space-between mb-2">
                      <div class="report-title">
                        <span class="font-weight-bold" style="font-size: 1.2rem;">Internal Reference #:</span>
                        <span class="font-weight-bold" style="font-size: 1.2rem;">{{ item.internalReferenceNumber }}</span>
                      </div>
                      <v-menu location="end">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn icon v-bind="attrs" v-on="on">
                            <v-icon>mdi-dots-vertical</v-icon>
                          </v-btn>
                        </template>
                        <v-list>
                          <v-list-item @click="navigateReportView(item)">
                            <v-list-item-title>{{ $t('dueDiligence.viewReport') }}</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </div>
                    <v-divider class="mb-2"/>
                    <div class="d-flex align-center justify-space-between py-1 report-row">
                      <span class="font-weight-medium">EUDR Reference #:</span>
                      <span>{{ item.EUDRReferenceNumber  || 'N/A' }}</span>
                    </div>
                    <v-divider class="my-1" />
                    <div class="d-flex align-center justify-space-between py-1 report-row">
                      <span class="font-weight-medium">Supplier:</span>
                      <span>{{ getSupplierFullName(item) }}</span>
                    </div>
                    <v-divider class="my-1" />
                    <div class="d-flex align-center justify-space-between py-1 report-row">
                      <span class="font-weight-medium">Product:</span>
                      <span>{{ item.product_detail ? (item.product_detail.code ? item.product_detail.code + '-' : '') : '' }}{{ item.product_detail ? item.product_detail.name : '' }}</span>
                    </div>
                    <v-divider class="my-1" />
                    <div class="d-flex align-center justify-space-between py-1 report-row">
                      <span class="font-weight-medium">Farms:</span>
                      <span>{{ item.productionPlaceCount }}</span>
                    </div>
                    <v-divider class="my-1" />
                    <div class="d-flex align-center justify-space-between py-1 report-row">
                      <span class="font-weight-medium">Quantity:</span>
                      <span>{{ !isNaN(item.productNetMass) ? parseFloat(getConvertedMass(item.productNetMass)) : 0 }} {{ eudrSettings?.product_mass_unit }}</span>
                    </div>
                    <v-divider class="my-1" />
                    <div class="d-flex align-center justify-space-between py-1 report-row">
                      <span class="font-weight-medium">Country:</span>
                      <span>{{ item.countryOfEntry }}</span>
                    </div>
                    <v-divider class="my-1" />
                    <div class="d-flex align-center justify-space-between py-1 report-row">
                      <span class="font-weight-medium">Last Updated:</span>
                      <span>{{ formatDate(item.updatedAt) }}</span>
                    </div>
                    <v-divider class="my-1" />
                    <div class="d-flex align-center justify-space-between py-2 report-row">
                      <span class="font-weight-medium">Due Diligence Status:</span>
                      <v-btn small rounded min-width="160" depressed class="blue-button" height="34"
                        v-if="item.status == 'Uploaded to EU Portal'">
                        {{ $t("deforestation.uploadedToEU") }}
                      </v-btn>

                      <v-btn small rounded min-width="160" depressed class="gray-button" height="34"
                        v-if="item.status == 'Pending'">
                        {{ $t("deforestation.pending") }}
                      </v-btn>
                      <v-btn small rounded min-width="160" depressed class="orange-button" height="34"
                        v-if="item.status == 'Under Review'">
                        {{ $t("deforestation.underReview") }}
                      </v-btn>

                      <v-btn small rounded min-width="160" depressed class="green-button" height="34"
                        v-if="item.status == 'Compliant'">
                        {{ $t("deforestation.compliant") }}
                      </v-btn>

                      <v-btn small rounded min-width="160" depressed class="orange-button" height="34"
                        v-if="item.status.toLowerCase() == 'processing farms'">
                        {{ $t("deforestation.processingFarm") }}
                      </v-btn>

                      <v-btn small rounded min-width="160" depressed class="gray-button" height="34"
                        v-if="item.status.toLowerCase() == 'analyzing deforestation'">
                        {{ $t("deforestation.analyzeDeforestation") }}
                      </v-btn>

                      <v-btn small rounded min-width="160" depressed class="blue-button" height="34"
                        v-if="item.status.toLowerCase() == 'ready to proceed'">
                        {{ $t("deforestation.readyToProceed") }}
                      </v-btn>


                      <v-btn small rounded min-width="160" depressed class="red-button" height="34"
                        v-if="item.status == 'Non-Compliant'">
                        {{ $t("deforestation.nonCompliant") }}
                      </v-btn>

                      <v-btn small rounded min-width="160" depressed class="green-button" height="34"
                        v-if="item.status == 'Mitigation Required'">
                        {{ $t("deforestation.mitigationRequired") }}
                      </v-btn>
                    </div>
                  </v-card>
                </v-col>
              </v-row>

              <div class="mobile-pagination mt-4">
                <div class="d-flex justify-space-between align-center">
                  <span class="mobile-pagination-label">{{ toDiligenceReports }} of {{ totalDiligenceReports }}</span>
                  <div class="mobile-pagination-controls">
                    <v-btn 
                      fab 
                      small 
                      outlined 
                      color="primary" 
                      :disabled="reportOptions.page <= 1"
                      @click="reportPageChange(false)"
                      class="mr-2"
                    >
                      <v-icon dark>mdi-chevron-left</v-icon>
                    </v-btn>
                    <v-btn 
                      fab 
                      small 
                      outlined 
                      color="primary" 
                      :disabled="reportOptions.page >= reportTotalPages"
                      @click="reportPageChange(true)"
                    >
                      <v-icon dark>mdi-chevron-right</v-icon>
                    </v-btn>
                  </div>
                </div>
              </div>
            </div>

            <v-data-table v-else :headers="tableHeaders" :items="diligenceReports" :items-per-page="10" hide-default-footer
              :loading="loading" :options.sync="reportOptions" :loading-text="$t('loadingData')">

              <template v-slot:top="{ }">
                <div class="table-controls-bar">
                  <div class="controls-left">
                    <div class="control search">
                      <label>{{ $t('search') }}</label>
                      <v-text-field
                        prepend-inner-icon="mdi-magnify"
                        outlined
                        dense
                        :placeholder="$t('search')"
                        v-model="reportSearch"
                        @input="searchQuery"
                      />
                    </div>
                    <div class="control filter">
                      <label>{{ $t('country') }}  <v-tooltip top color="00BD73" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon size="16" class="icon-with-background primary--text" v-bind="attrs" v-on="on">
                              mdi-alert-circle
                            </v-icon>
                          </template>
                          <span>{{ $t("deforestation.EUDRcountry") }}</span>
                        </v-tooltip></label>
                      <v-select
                        :items="countries"
                        v-model="reportCountry"
                        item-text="name"
                        item-value="name"
                        dense
                        outlined
                        :placeholder="$t('deforestation.allCountries')"
                        @change="getDeforestationEUDR"
                      />
                    </div>
                    <div class="control filter">
                      <label>{{ $t('deforestation.edurDueDeligenceStatus') }}  <v-tooltip top color="00BD73" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon size="16" class="icon-with-background primary--text" v-bind="attrs" v-on="on">
                              mdi-alert-circle
                            </v-icon>
                          </template>
                          <span>{{ $t("deforestation.EUDRDeforestationStatusTT") }}</span>
                        </v-tooltip></label>
                      <v-select
                        v-model="reportStatus"
                        item-text="text"
                        item-value="val"
                        :items="allStatus"
                        @change="getDeforestationEUDR"
                        outlined
                        dense
                      />
                    </div>
                    </div>
                  <div class="controls-right">
                    <span class="pagination-label">{{ toDiligenceReports }} of {{ totalDiligenceReports }}</span>
                    <v-btn fab small outlined color="primary" :disabled="reportOptions.page <= 1" @click="reportPageChange(false)">
                      <v-icon dark>mdi-chevron-left</v-icon>
                    </v-btn>
                    <v-btn fab small outlined color="primary" :disabled="reportOptions.page >= reportTotalPages" @click="reportPageChange(true)">
                      <v-icon dark>mdi-chevron-right</v-icon>
                    </v-btn>
                    <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" left :min-width="417">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn fab small outlined color="primary" v-bind="attrs" v-on="on">
                                <v-icon dark>mdi-cog-outline</v-icon>
                            </v-btn>
                        </template>
                        <v-card width="417">
                            <v-list>
                                <v-list-item>
                                    <v-list-item-content>
                                        <v-list-item-title>{{ $t("deforestation.customization") }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-divider></v-divider>
                                <div class="pl-3 pt-2 font-weight-normal">
                                    {{ $t("deforestation.recordsPerpage") }}
                                </div>
                                <v-list-item>
                                    <v-list-item-content>
                                        <v-slider v-model="itemsPerPageSlider" :tick-labels="itemsPerPageOptions" :max="3" step="1" ticks="always" tick-size="4"></v-slider>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-divider class="mt-n3"></v-divider>
                            </v-list>
                            <v-card-text>
                                <v-container fluid>
                                    <v-row>
                                        <v-col class="mt-n9" cols="6" v-for="header in reportHeaders" :key="header.value">
                                            <v-checkbox v-if="header.text" v-model="selectedHeaders" :label="header.text" color="primary" :value="header.text" hide-details></v-checkbox>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>
                            <v-layout justify-center>
                                <v-card-actions class="mb-5">
                                    <v-spacer></v-spacer>
                                    <v-btn outlined color="primary" @click="resetDefaut" width="190">
                                        {{ $t("deforestation.restoreDefault") }}
                                    </v-btn>
                                    <v-btn color="primary" @click="resetTableStructure" width="190">
                                        {{ $t("deforestation.apply") }}
                                    </v-btn>
                                </v-card-actions>
                            </v-layout>
                        </v-card>
                    </v-menu>
                    <v-btn fab small outlined color="primary" @click="exportToPDF">
                      <v-icon dark>mdi-tray-arrow-down</v-icon>
                    </v-btn>
                    <v-btn fab small outlined color="primary" @click="printPDF('document')">
                      <v-icon dark>mdi-printer</v-icon>
                    </v-btn>
                  </div>
                </div>
              </template>

              <template v-slot:item.EUDRReferenceNumber="{ item }">
                {{ item.EUDRReferenceNumber + item.EUDRReferenceNumber?'-' + item.internalReferenceNumber: item.internalReferenceNumber }}
              </template>

              <template v-slot:item.supplier="{ item }">
                {{ getSupplierFullName(item) }}
              </template>

              <template v-slot:item.product="{ item }">
                {{ item.product_detail ? (item.product_detail.code ? item.product_detail.code +'-' : "") : '' }}
                {{ item.product_detail  ? item.product_detail.name  : '' }}
              </template>

              <template v-slot:item.productNetMass="{ item }">
                {{ item.productionPlaceCount }} <br />
                {{ !isNaN(item.productNetMass) ? parseFloat(getConvertedMass(item.productNetMass)) : 0 }} {{ eudrSettings?.product_mass_unit }}
              </template>

              <template v-slot:item.countryOfEntry="{ item }">
                {{ item.countryOfEntry }}
              </template>

              <template v-slot:item.createdAt="{ item }">
                {{ formatDate(item.createdAt) }}
              </template>

              <template v-slot:item.updatedAt="{ item }">
                {{ formatDate(item.updatedAt) }}
              </template>

              <template v-slot:item.dueDeligenceStatus="{ item }">
                <div class="d-flex">
                  <div class="no-pointer">
                  <v-btn small rounded min-width="160" depressed class="blue-button" height="34"
                    v-if="item.status == 'Uploaded to EU Portal'">
                    {{ $t("deforestation.uploadedToEU") }}
                  </v-btn>

                  <v-btn small rounded min-width="160" depressed class="gray-button" height="34"
                    v-if="item.status == 'Pending'">
                    {{ $t("deforestation.pending") }}
                  </v-btn>
                  <v-btn small rounded min-width="160" depressed class="orange-button" height="34"
                    v-if="item.status == 'Under Review'">
                    {{ $t("deforestation.underReview") }}
                  </v-btn>

                  <v-btn small rounded min-width="160" depressed class="green-button" height="34"
                    v-if="item.status == 'Compliant'">
                    {{ $t("deforestation.compliant") }}
                  </v-btn>

                  <v-btn small rounded min-width="160" depressed class="orange-button" height="34"
                    v-if="item.status.toLowerCase() == 'processing farms'">
                    {{ $t("deforestation.processingFarm") }}
                  </v-btn>

                  <v-btn small rounded min-width="160" depressed class="gray-button" height="34"
                    v-if="item.status.toLowerCase() == 'analyzing deforestation'">
                    {{ $t("deforestation.analyzeDeforestation") }}
                  </v-btn>

                  <v-btn small rounded min-width="160" depressed class="blue-button" height="34"
                    v-if="item.status.toLowerCase() == 'ready to proceed'">
                    {{ $t("deforestation.readyToProceed") }}
                  </v-btn>


                  <v-btn small rounded min-width="160" depressed class="red-button" height="34"
                    v-if="item.status == 'Non-Compliant'">
                    {{ $t("deforestation.nonCompliant") }}
                  </v-btn>

                  <v-btn small rounded min-width="160" depressed class="green-button" height="34"
                    v-if="item.status == 'Mitigation Required'">
                    {{ $t("deforestation.mitigationRequired") }}
                  </v-btn>
                  </div>

                  <v-spacer></v-spacer>
                  <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                      <img v-bind="attrs" v-on="on" class="ml-1" :src="isIndonesianClient ? '/img/id/todo-list.svg' : isKenyaClient ? '/img/ke/todo-list.svg' : '/icons/todo-list.png'"
                        style="width: 34px; height: 34px; border-radius: 50%;" @click="navigateReportView(item)" />

                    </template>
                    <span>{{ $t('dueDiligence.viewReport') }}</span>
                  </v-tooltip>
                </div>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-menu location="start">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>

                  <v-list>
                    <v-list-item @click="navigateReportView(item)">
                      <v-list-item-title>{{ $t('dueDiligence.viewReport') }}</v-list-item-title>
                    </v-list-item>
                    <v-list-item :disabled="item.status === 'Pending'" @click="
                      $router.push({
                        name: 'EudrAssessmentReport',
                        params: { id: item.id, type: 'assignment' },
                      })
                    ">
                      <v-list-item-title>{{ $t('dueDiligence.share') }}</v-list-item-title>
                    </v-list-item>
                    <v-list-item :disabled="!['Compliant', 'Non-Compliant', 'Processing  Farms'].includes(item.status)"
                      @click="redirectToDDSSUmmary(item.id)">
                      <v-list-item-title>{{ $t('dueDiligence.viewReportSummary') }}</v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      :disabled="item.status.toLowerCase().startsWith('processing') || item.status.toLowerCase().startsWith('analyzing')"
                      @click="deleteDiligenceReports(item.id)">
                      <v-list-item-title>{{ $t('delete') }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
              <template v-slot:footer></template>
            </v-data-table>


            <div v-if="isDdsExporter || isSupplierOwner" class="status-legend-section mt-6 mb-4 pa-4">
              <div class="legend-title font-weight-bold mr-3">
                {{ $t("deforestation.statusLegend") }}
                <v-tooltip top color="00BD73" max-width="350">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon size="16" class="icon-with-background primary--text" v-bind="attrs" v-on="on">
                      mdi-information
                    </v-icon>
                  </template>
                  <span>{{ $t("deforestation.statusLegendInfo") }}</span>
                </v-tooltip>
              </div>
              <div class="legend-item d-inline-flex align-center mr-4 mt-2">
                <span class="legend-item d-inline-flex align-center mr-4">
                <img src="/icons/dds/pending.svg" style="width: 20px; height: 20px; margin-right: 5px;" /> <span v-if="isDdsExporter"> {{ $t("deforestation.pendingOrNewlyReceived") }} </span> <span v-else> {{ $t("deforestation.sentToExporter") }} </span>
                </span>
                <span class="legend-item d-inline-flex align-center mr-4">
                  <img src="/icons/dds/approved.svg" style="width: 20px; height: 20px; margin-right: 5px;" /> {{ $t("deforestation.approved") }}
                </span>
                <span class="legend-item d-inline-flex align-center mr-4">
                  <img src="/icons/dds/updaterequired.svg" style="width: 20px; height: 20px; margin-right: 5px;" /> {{ $t("deforestation.updateRequired") }}
                </span>
                <span class="legend-item d-inline-flex align-center mr-4">
                  <img src="/icons/dds/rejected.svg" style="width: 20px; height: 20px; margin-right: 5px;" /> {{ $t("deforestation.rejected") }}
                </span>
              </div>
            </div>

            <div v-if="!isDdsExporter" class="d-flex" style="margin-top: 60px;">
              <p class="heading-title">
                {{ $t("dueDiligence.listOfFarms") }}
                <v-tooltip top color="00BD73" max-width="350">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon class="icon-with-background primary--text" v-bind="attrs" v-on="on">
                      mdi-alert-circle
                    </v-icon>
                  </template>
                  <span>{{ $t("dueDiligence.listOfFarmsInfo") }}</span>
                </v-tooltip>
              </p>
              <v-spacer></v-spacer>
            </div>

            <v-data-table v-if="!isDdsExporter" ref="list-of-farm" :headers="placesHeaders" :items="productionPlaces" :itemsPerPage="10"
              hide-default-footer :loading="listOfFarmloading" :options.sync="options"
              :loading-text="$t('loadingData')">

              <template v-slot:top="{ }">
                <div class="d-flex mt-5">
                  <div style="width: 280px;">
                    <label for="text">
                      {{ $t("search") }}
                    </label>
                    <v-text-field prepend-inner-icon="mdi-magnify" outlined height="5px" :placeholder="$t('search')"
                      dense v-model="placeSearch" @input="handleSearchByPharse" class="shrink" clearable></v-text-field>
                  </div>
                  <template v-if="isOperatorOwner">
                    <v-btn outlined class="mx-2 mt-5" color="grey" @click="showFilters= true"
                      style="min-width: 40px; padding: 0;">
                      <v-icon>mdi-filter-outline</v-icon>
                    </v-btn>
                  </template>
                  <template v-else>
                    <div class="ml-3" style="width: 280px;">
                      <label for="text">{{ $t("country") }}</label>
                      <v-select :items="countries" v-model="placeCountry" item-text="name" item-value="name" dense
                        outlined class="wdt" :placeholder="$t('deforestation.allCountries')"
                        @change="filterData"></v-select>
                    </div>

                    <div class="ml-3" style="width: 280px;">
                      <label for="text">{{ $t("deforestation.producer") }}</label>
                      <v-tooltip top color="00BD73" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon class="icon-with-background primary--text" v-bind="attrs" v-on="on">
                            mdi-alert-circle
                          </v-icon>
                        </template>
                        <span>{{ $t("dueDiligence.producerTT") }}</span>
                      </v-tooltip>
                      <v-select class="wdt" v-model="producerModel" item-text="text" item-value="val"
                        :items="allProducers" :placeholder="$t('deforestation.allProducer')" @change="filterData"
                        outlined dense>
                      </v-select>
                    </div>

                    <div class="ml-3" style="width: 280px;">
                      <label for="text">{{
                        $t("deforestation.EUDRDeforestationStatus")
                        }}</label>
                      <v-tooltip top color="00BD73" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon class="icon-with-background primary--text" v-bind="attrs" v-on="on">
                            mdi-alert-circle
                          </v-icon>
                        </template>
                        <span>{{ $t("deforestation.EUDRDeforestationStatusTT") }}</span>
                      </v-tooltip>
                      <v-select class="wdt" v-model="placeStatus" item-text="text" item-value="val"
                        :items="deforestationStatus" :placeholder="$t('deforestation.EUDRDeforestationStatus')"
                        @change="filterData" outlined dense>
                      </v-select>
                    </div>

                    <v-spacer></v-spacer>
                    <div class="d-flex" style="margin-top: 15px;">
                      <div class="py-1 title">
                        {{ fromProducer }} - {{ toProducer }} {{ $t('of') }} {{ totalProductionPlaces }}
                      </div>
                      <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page <= 1"
                        @click="pageChange(false)">
                        <v-icon dark>
                          mdi-chevron-left
                        </v-icon>
                      </v-btn>
                      <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page >= totalPages"
                        @click="pageChange(true)">
                        <v-icon dark>
                          mdi-chevron-right
                        </v-icon>
                      </v-btn>
                    </div>
                  </template>
                </div>
              </template>
              <template v-slot:body="{ items }">
                <tbody>
                  <tr v-for="(item, index) in items" :key="index"
                    style="position: relative; width: 0; height: 0">

                    <td class="text-truncate">
                      {{ item.farm?.farmName || "N/A" }}<br />
                      {{ item.farm?.id }}
                    </td>

                    <td class="text-truncate">
                      {{ item.farm?.userDdsAssoc?.firstName }}
                      {{ item.farm?.userDdsAssoc?.lastName }}
                    </td>
                    <td class="text-truncate">
                      {{ getFarmSupplierFullName(item) }}
                    </td>
                    <td class="text-truncate" style="max-width: 300px;">
                      {{ item?.farm?.address }}
                    </td>
                    <td>
                      <v-btn v-if="getEUDRDeforestationStatus(item.eudr_deforestation_status).text !== 'N/A'" small
                        rounded min-width="200" depressed
                        :class="[getEUDRDeforestationStatus(item.eudr_deforestation_status).class, 'non-clickable']" height="34">
                        {{ getEUDRDeforestationStatus(item.eudr_deforestation_status).text }}
                      </v-btn>
                      <span v-else>N/A</span>
                    </td>
                    <td>
                      <div class="d-flex">
                        <div class="d-flex" v-if="getRiskAssessmentStatus(item.risk_assessment_status).text !== 'N/A'">
                          <v-btn small rounded min-width="200" depressed
                            :class="getRiskAssessmentStatus(item.risk_assessment_status).class" height="34">
                            {{ getRiskAssessmentStatus(item.risk_assessment_status).text }}
                          </v-btn>
                          <v-tooltip top color="00BD73" max-width="350">
                            <template v-slot:activator="{ on, attrs }">
                              <img v-bind="attrs" v-on="on" class="ml-1" src="/icons/todo-list.png"
                                style="width: 34px; height: 34px; border-radius: 50%;" />
                            </template>
                            <span>{{ $t('dueDiligence.viewReport') }}</span>
                          </v-tooltip>

                        </div>
                        <span v-else>N/A</span>
                      </div>
                    </td>
                    <td>
                      <v-tooltip top color="00BD73" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn v-bind="attrs" v-on="on" x-small fab @click="removeFarm(item.farm.id)"
                              style="margin-left: 20px;">
                              <v-icon class="primary--text">mdi-trash-can</v-icon>
                            </v-btn>
                          </template>
                          <span>{{ $t('delete') }}</span>
                        </v-tooltip>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-data-table>
            <v-row>
              <v-col cols="col-12 mx-10">
                <v-alert
                  v-if="alertData.show"
                  type="dark"
                  class="white--text sticky-bottom-alert"
                  >
                  <div class="d-flex justify-space-between align-center">
                    <span>
                      <v-icon class="mr-2" color="white">mdi-check-circle</v-icon>
                      <strong>{{$t('dueDiligence.downloadInitiated')}}:</strong> {{ alertData.downloadId}} {{ $t("dueDiligence.beingDownloaded")}}: {{ alertData.estimatedTime }}
                    </span>

                    <div class="ml-4 d-flex cursor-pointer align-center">
                      <p
                        text
                        class="text-decoration-underline mb-0"
                        color="white"
                        @click="showAllDownloads"
                      >
                        {{ $t("dueDiligence.showAllDownloads" )}}
                      </p>
                      <v-icon
                        text
                        color="white"
                        @click="closeAlert"
                      >
                        mdi-close
                      </v-icon>
                    </div>
                  </div>
                </v-alert>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </v-card>
    </v-container>
    <v-dialog v-if="isOperatorOwner" v-model="showFilters" width="356" @click:outside="closeFilter" content-class="my-custom-dialog"
      max-height="100vh" transition="dialog-bottom-transition">
      <v-card min-height="100vh" class="" rounded="0">
        <v-toolbar color="primary" class="white--text" flat :elevation="0">
          <v-toolbar-title class="font-weight-bold">{{
            this.$t("filterBy")
            }}</v-toolbar-title>
          <v-spacer></v-spacer>

          <v-btn icon class="white--text" @click="closeFilter">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pt-5">
          <v-row no-gutters>
            <v-col cols="12">
              <label for="text">{{
                $t("deforestation.allProducer")
                }}</label>
              <v-select v-model="producerModel" item-text="text" item-value="val" :items="allProducers"
                :placeholder="$t('deforestation.allProducer')" outlined dense>
              </v-select>

            </v-col>
            <v-col cols="12">
              <label for="text">{{
                $t("dueDiligence.listOfSupplier")
              }}</label>
              <v-autocomplete v-model="supplierModel" :items="supplierList" item-text="label" item-value="val"
                :placeholder="$t('dueDiligence.listOfSupplier')" outlined dense />

            </v-col>
            <v-col cols="12">
              <label for="text">{{
                $t("deforestation.EUDRDeforestationStatus")
                }}</label>
              <v-select v-model="placeStatus" item-text="text" item-value="val" :items="deforestationStatus"
                :placeholder="$t('deforestation.EUDRDeforestationStatus')" outlined dense>
              </v-select>
            </v-col>

            <v-col cols="12">
              <label for="text">{{ $t("country") }}</label>
              <v-select :items="countries" v-model="placeCountry" item-text="name" item-value="name" dense outlined
                :placeholder="$t('deforestation.allCountries')"></v-select>
            </v-col>


          </v-row>
          <v-row>
            <v-col cols="12" class="d-flex justify-space-around">
              <v-btn outlined @click="clearFilters" width="130" color="primary">
                {{ this.$t("clearAll") }}
              </v-btn>
              <v-btn width="130" @click="getProductionPlaces" color="primary">
                {{ this.$t("search") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <confirm-box :title="confirmDelete.title" :message="confirmDelete.message"
      :cancelBtnText="confirmDelete.cancelBtnText" :confirmBtnText="confirmDelete.confirmBtnText"
      :confirmData="confirmDelete.confirmData" :dialog="confirmDeleteDialog"
      @cancel:action="confirmDeleteDialog = false" @continue:action="confirmDeleteDiligenceReport" />
    <confirm-box :title="farmConfirmDelete.title" :message="farmConfirmDelete.message"
      :cancelBtnText="farmConfirmDelete.cancelBtnText" :confirmBtnText="farmConfirmDelete.confirmBtnText"
      :confirmData="farmConfirmDelete.confirmData" :dialog="farmConfirmDeleteDialog"
      @cancel:action="farmConfirmDeleteDialog = false" @continue:action="confirmRemoveFarm" />
  </div>
</template>
  
  <script>
  import Breadcrumb from "@/components/core/Breadcrumb";
  // import VueApexCharts from "vue-apexcharts";
  import DeforestationService from "@/_services/DeforestationService";
  import ProfileService from "@/_services/ProfileService";
  import ActivityLogService from "@/_services/ActivityLogService";
  import loadingMixin from "@/mixins/LoadingMixin";
  import download from "@/mixins/DownloadMixin";
  import getPermittedActions from "@/mixins/GetPermittedActions";
  import DateMixin from "@/mixins/DateMixin";
  import { getCountries } from "country-state-picker";
  import html2pdf from "html2pdf.js";
  import printJS from "print-js";
  import { getRiskAssessmentStatus } from '@/utils';
  import UnitService from "@/_services/UnitService";
  import { mapGetters } from "vuex";
  import moment from 'moment';
  import tableCustomizationMixin from '@/mixins/tableCustomizationMixin';
  import { currentRoles } from "@/utils";
  import ConfirmBox from "@/components/ConfirmBox";
  import { isDdsExporter, isIndonesianClient, isKenyaClient } from "@/utils";
  export default {
    components: {
      breadcrumb: Breadcrumb,
      // apexchart: VueApexCharts,
      "confirm-box": ConfirmBox,
    },
  
    computed: {
    ...mapGetters("eudrDDS", ["getDdsUserRole"]),
    isIndonesianClient() {
      return isIndonesianClient();
    },
    isKenyaClient() {
      return isKenyaClient();
    },
    isSupplierOwner() {
        return [ "supplier_owner", "owner"].includes(
          this.getDdsUserRole
        );
      },
      isOperatorOwner() {
        return ["operator_owner", "owner"].includes(
          this.getDdsUserRole
        );
      },
      isOperator() {
        return ProfileService.checkRole("operator");
      },
      isSupplier() {
        return ProfileService.checkRole("supplier");
      },
      getOrganizationId() {
              return this.$store.getters.getUser?.user_organization?.id;
          },
      totalPages() {
        return parseInt(Math.ceil(this.totalProductionPlaces / 10));
      },
      currentUser() {
        return this.$store.getters.getUser;
      },
  
      reportTotalPages() {
        return parseInt(Math.ceil(this.totalDiligenceReports / 10))
      },
  
      getSupplierFullName() {
        return (item) => {
          const firstName = item.supplier?.firstName ?? '';
          const lastName = item.supplier?.lastName ?? '';
          return `${firstName} ${lastName}`.trim();
        };
      },
  
      getFarmSupplierFullName() {
        return (item) => {
          const firstName = item.diligenceReport?.supplier?.firstName ?? '';
          const lastName = item.diligenceReport?.supplier?.lastName ?? '';
          return `${firstName} ${lastName}`.trim();
        };
      }
    },
    async mounted() {
      if (this.isOperator) {
        return;
      }
      await Promise.allSettled([
        this.getEudrSettings(),
      ])
      this.fetchAllProducers(); // Fetch all producers once
      if(this.isOperatorOwner)this.getSupplierList();
      
      const data = JSON.parse(localStorage.getItem("downloadPdfAlert"));

      if (data) {
        const { estimatedTime, downloadId } = data;
        
        this.alertData = {
          show: true,
          downloadId: downloadId,
          estimatedTime: estimatedTime,
        };

        // remove alert after 10sec;
        setTimeout(() => {
          localStorage.removeItem("downloadPdfAlert");
          this.alertData.show = false;
        }, 10000);
      }
    },
  
    async created() {
      const prefs = this.getTablePrefs('DueDiligenceReportTable');
      if (prefs) {
        this.selectedHeaders = prefs.selectedHeaders;
        this.itemsPerPageSlider = this.itemsPerPageOptions.indexOf(prefs.itemsPerPage);
      } else {
        this.selectedHeaders = this.reportHeaders.map(h => h.text);
        this.itemsPerPageSlider = 1;
      }

      this.reportOptions.itemsPerPage = this.itemsPerPageOptions[this.itemsPerPageSlider];
      this.tableHeaders = this.reportHeaders.filter(header =>
        this.selectedHeaders.includes(header.text)
      );
      if (this.isOperator) {
        return;
      }
      this.orgId = this.currentUser.user_organization.id;
      await this.getCountry();
      await this.getDeforestationEUDR();
      await this.getUsageLimit(this.orgId).then(async () => {
        await this.processUsageLimits();
        await this.getProductionPlaces();
        setTimeout(() => {
          this.createDeligenceChart();
          this.createDeforestationChart()
          this.createRiskAssessmentChart()
        }, 100)
      });
    },
    watch: {
    // Watchers on filter fields to trigger getProductionPlaces() whenever any filter changes
    placeCountry() {
      this.fromProducer = 1;
      this.toProducer = 10;
      this.options.page = 1;
      this.getProductionPlaces();
    },
    producerModel() {
      this.fromProducer = 0;
      this.toProducer = 10;
      this.options.page = 1;
      this.getProductionPlaces();
    },
    placeStatus() {
      this.fromProducer = 0;
      this.toProducer = 10;
      this.options.page = 1;
      this.getProductionPlaces();
    },
  },
    data() {
      return {
        isDdsExporter: isDdsExporter(),
        alertData: {
          show: false,
          downloadId: '',
          estimatedTime: '',
        },
        orgId: undefined,
        document: '',
        loading: true,
        listOfFarmloading: true,
        countries: [{ text: this.$t("deforestation.allCountries"), val: "" }],
        allProducers: [{ text: this.$t("deforestation.allProducer"), val: "" }],
        options: {
          page: 1,
          limit: 10,
        },
        usageLimits: [],
        series: [80],
        responseData: null,
        dueDeligence: null,
        dueDeligenceSeries: [],
        eudrDeforestationAssessment: null,
        eudrDeforestationSeries: [],
        riskAssessment: null,
        riskAssessmentSeries: [],
        dueDiligenceChartOptions: undefined,
        deforestationChartOptions: undefined,
        riskAssessmentChartOptions: undefined,
        breadcrumbs: [
          {
            text: this.$t("dueDiligence.dueDiligenceNew"),
            disabled: true,
            to: "/",
          },
          {
            text: this.$t("dueDiligence.createNewReport"),
            disabled: true,
            to: "/",
          },
        ],
        selected: [],
        placesHeaders: [
          {
            text: this.$t("dueDiligence.productionPlaceAndFarmID"),
            align: "start",
            sortable: true,
            value: "farm.farmName",
            class: "black--text",
            width: "150px",
          },
          {
            text: this.$t("deforestation.producer"),
            align: "start",
            sortable: true,
            value: "farm.userDdsAssoc.fullName",
            class: "black--text",
            width: "150px",
          },
          {
            text: this.$t("deforestation.supplier"),
            align: "start",
            value: "supplier",
            class: "black--text",
            sortable: true,
          },
          {
            text: this.$t("deforestation.addressOfProduction"),
            align: "start",
            sortable: true,
            value: "farm.address",
            class: "black--text",
            width: "150px",
          },
          {
            text: `${this.$t("deforestation.EUDRDeforestationStatus")}`,
            value: "eudr_deforestation_status",
            sortable: true,
            class: "black--text",
            width: "95px",
          },
          {
            text: `${this.$t("deforestation.riskAssessment")}`,
            value: "risk_assessment",
            sortable: false,
            class: "black--text",
            width: "95px",
          },
          {
            text: this.$t('dueDiligence.actions'),
            align: "center",
            value: "actions",
            class: "black--text",
            sortable: false,
          },
        ],
        productionPlaces: [],
        totalProductionPlaces: 0,
        fromProducer: 0,
        toProducer: 0,
        farmStatus: "success",
        farmStatusList: [],
        placeSearch: "",
        placeCountry: "All Countries",
        placeStatus: "",
        producerModel: "",
  
        //due deligence
        reportCountry: "",
        reportStatus: "",
        reportSearch: "",
        //regionModel: '',
  
        allStatus: [
          { text: this.$t("deforestation.allStatus"), val: "" },
          {
            text: this.$t("deforestation.uploadedToEU"),
            val: "Uploaded to EU Portal",
          },
          { text: this.$t("deforestation.pending"), val: "Pending" },
          { text: this.$t("deforestation.underReview"), val: "Under Review" },
          { text: this.$t("deforestation.nonCompliant"), val: "Non-Compliant" },
          { text: this.$t("deforestation.compliant"), val: "Compliant" },
          { text: this.$t("deforestation.analyzeDeforestation"), val: "Analyzing Deforestation" },
          { text: this.$t("deforestation.readyToProceed"), val: "Ready To Proceed" },
        ],
        allRegions: [{ text: this.$t("deforestation.allRegions"), val: "" }],
  
        diligenceReports: [],
        //copyReport: [],
        totalDiligenceReports: 0,
        totalDiligenceReportsPages: 0,
        selectedItem: false,
        reportOptions: {
          itemsPerPage: 10,
          page: 1,
        },
  
        toDiligenceReports: 0,
        fromDiligenceReports: 0,
        reportHeaders: [
          {
            text: isKenyaClient ? this.$t("deforestation.internalRefNoKenya"):  this.$t("deforestation.eudrAndInternalRefNo"),
            align: "start",
            value: "EUDRReferenceNumber",
            class: "black--text",
            sortable: true,
            width: "150px",
          },
          {
            text: this.$t("deforestation.supplier"),
            align: "start",
            value: "supplier",
            class: "black--text",
            sortable: true,
          },
          {
            text: this.$t("deforestation.product"),
            align: "start",
            value: "product",
            class: "black--text",
            sortable: true,
          },
          {
            text: this.$t("deforestation.farmsAndQuantity"),
            align: "start",
            value: "productNetMass",
            class: "black--text",
            sortable: true,
          },
          {
            text: this.$t("deforestation.country"),
            align: "start",
            value: "countryOfEntry",
            class: "black--text",
            sortable: true,
          },
          {
            text: this.$t("deforestation.submissionDate"),
            align: "start",
            value: "createdAt",
            class: "black--text",
            sortable: true,
          },
          // {
          //   text: this.$t("deforestation.lastUpdated"),
          //   align: "start",
          //   value: "updatedAt",
          //   class: "black--text",
          //   sortable: true,
          //   roles: ["operator_owner","supplier_owner",'supplier','operator']
          // },
          {
            text: this.$t("deforestation.dueDeligenceStatus"),
            align: "start",
            value: "dueDeligenceStatus",
            class: "black--text",
            sortable: true,
          },
          {
            text: '',
            align: "center",
            value: "actions",
            class: "black--text",
            sortable: false,
          },
        ],
        menu: false,
        itemsPerPageOptions: [5, 10, 25, 50],
        itemsPerPageSlider: 1,
        selectedHeaders: [],
        tableHeaders: [],
        eudrSettings: {},
        confirmDeleteDialog : false,
        confirmDelete: {
          title: this.$t("confirmDialog.dueDiligenceReport.delete.title"),
          message: this.$t("confirmDialog.dueDiligenceReport.delete.message"),
          confirmBtnText: this.$t("confirmDialog.dueDiligenceReport.delete.confirmBtn"),
          cancelBtnText: this.$t("cancel"),
          confirmData: {},
        },
        farmConfirmDeleteDialog : false,
        farmConfirmDelete: {
          title: this.$t("confirmDialog.farm.delete.title"),
          message: this.$t("confirmDialog.farm.delete.message"),
          confirmBtnText: this.$t("confirmDialog.farm.delete.confirmBtn"),
          cancelBtnText: this.$t("cancel"),
          confirmData: {},
        },
        deforestationStatus:[
          { text: this.$t("deforestation.allStatus"), val: "" },
          { text: this.$t("deforestation.veryHighDeforestationProbability"), val: "Very High Deforestation Probability" },
          { text: this.$t("deforestation.highDeforestationProbability"), val: "High Deforestation Probability" },
          { text: this.$t("deforestation.mediumDeforestationProbability"), val: "Medium Deforestation Probability" },
          { text: this.$t("deforestation.lowDeforestationProbability"), val: "Low Deforestation Probability" },
          { text: this.$t("deforestation.veryLowDeforestationProbability"), val: "Very Low Deforestation Probability" },
          { text: this.$t("deforestation.zeroNegligibleDeforestationProbability"), val: "Zero/Negligible Deforestation Probability" },
          { text: this.$t("deforestation.manuallyMitigated"), val: "Manually Mitigated" },
        ],
        showFilters: false,
        supplierList: [],
        supplierModel: null,
      };
    },
    methods: {
      closeAlert() {
        this.alertData.show = false;
        localStorage.removeItem("downloadPdfAlert");
      },

      showAllDownloads() {
        this.$router.push({ name: "DownloadHistory" });
      },
      
      getDateFormat(date) {
        if(!date) return ''
        return moment(date).format("DD/MM/YYYY");
      },
      getEUDRDeforestationStatus(status) {
         switch (status) {
            case 'Zero/Negligible Deforestation Probability':
            case 'Zero/Negligible Probability':
                return { class: 'green-button', text: this.$t("deforestation.zeroOrNegligibleProbability") };
            case 'Very High Deforestation Probability':
            case 'Very High Probability':
                return { class: 'very-high-button', text:  this.$t("deforestation.veryHighProbability") };
            case 'Very Low Deforestation Probability':
            case 'Very Low Probability':
                return { class: 'very-low-button', text: this.$t("deforestation.veryLowProbability") };
            case 'High Deforestation Probability':
            case 'High Probability':
                return { class: 'red-button', text: this.$t("deforestation.highProbability") };
            case 'Low Deforestation Probability':
            case 'Low Probability':
                return { class: 'orange-button', text: this.$t("deforestation.lowProbability") };
            case 'Medium Deforestation Probability':
            case 'Medium Probability':
                return { class: 'medium-button', text: this.$t("deforestation.mediumProbability") };
            case 'Manually Deforestation Mitigated':
            case 'Manually Mitigated':
                return { class: 'manually-button', text: this.$t("dueDiligence.manualMitigated") };
            default:
                return { class: '', text: 'N/A' };
          }
      },
      getRiskAssessmentStatus,
      async exportToPDF() {
        const requestParams = {
          page: this.reportOptions.page,
          limit: this.reportOptions.itemsPerPage,
          searchPhrase: this.reportSearch,
          country: this.reportCountry,
          status: this.reportStatus,
        };
        const querys = new URLSearchParams(requestParams).toString();
        const token = this.$store.state.auth.token
        this.startLoading()
        const url = process.env.VUE_APP_DEFORESTRATION_API_BASE_URL  || "https://cf-deforestation.dimitra.dev/graphql"
        this.downloadSourceFileWithToken(`${url}/diligence-report/diligence-report-csv?${querys}`, "application/vnd.ms-excel", token,"diligence-reports.xls")
          .then(() => {
            this.stopLoading()
          }).catch(() => {
            this.stopLoading()
        })
      },
      async printPDF() {
        const element = document.querySelector(".v-data-table__wrapper");
        let opt = {
          margin: 1,
          filename: "Suppliers.pdf",
          image: { type: "jpeg", quality: 0.95 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
        };
  
        let worker = await html2pdf()
          .set(opt)
          .from(element)
          .toCanvas()
          .outputPdf("blob", "Suppliers.pdf");
        let file = new File([worker], "Suppliers.pdf", {
          type: "application/pdf",
        });
        var pdfUrl = await URL.createObjectURL(file);
        await printJS({ printable: `${pdfUrl}`, type: "pdf", showModal: true });
      },
      async resetDefaut() {
        this.selectedHeaders = this.reportHeaders.map(h => h.text);
        this.tableHeaders = this.reportHeaders;
        this.reportOptions.itemsPerPage = 10;
        this.itemsPerPageSlider = 1;

        this.clearTablePrefs('DueDiligenceReportTable');
        await this.getDeforestationEUDR();
        this.menu = false;
      },
      async resetTableStructure() {
        this.menu = false;
        this.document = false; 

        if (!this.selectedHeaders.length) {
          this.selectedHeaders = this.reportHeaders.map(h => h.text);
        }

        this.tableHeaders = this.reportHeaders.filter(header =>
          this.selectedHeaders.includes(header.text)
        );

        const selectedPerPage = this.itemsPerPageOptions[this.itemsPerPageSlider];
        this.reportOptions.itemsPerPage = selectedPerPage;

        this.setTablePrefs('DueDiligenceReportTable', {
          selectedHeaders: this.selectedHeaders,
          itemsPerPage: selectedPerPage
        });

        await this.getDeforestationEUDR();
      },
      async processUsageLimits() {
        this.usageLimits?.forEach((item) => {
          let percentage;
          switch (item.report_type.name) {
            case "Due Diligence Reports":
              this.dueDeligence = item;
              percentage = (this.dueDeligence.used / this.dueDeligence.limit) * 100;
              this.dueDeligenceSeries.push(percentage.toFixed(1));
              break;
            case "EUDR Deforestation Assessments":
              this.eudrDeforestationAssessment = item;
              percentage =
                (this.eudrDeforestationAssessment.used /
                  this.eudrDeforestationAssessment.limit) * 100;
              this.eudrDeforestationSeries.push(percentage.toFixed(1));
              break;
            case "Risk Assessments":
              this.riskAssessment = item;
              percentage = (this.riskAssessment.used / this.riskAssessment.limit) * 100;
              this.riskAssessmentSeries.push(percentage.toFixed(1));
              break;
            default:
              break;
          }
        });
      },
      redirectToProducer(){
        this.$router.push({
          name:'Producers'
        })
      },
      redirectToCreateDueDiligence() {
        this.$store.dispatch('SET_DDS_TAB', {
          activeTab: 1
        }).then(() => {
          this.$router.push({
            name: "createDueDiligenceReports"
          })
        })
      },
      redirectTodueDiligenceReports() {
        this.$router.push({
          name: "dueDiligenceReports"
        })
      },
      redirectToSettings() {
        this.$router.push({
          name: "EUDRSettings"
        })
      },
      redirectToMyFarms() {
        this.$router.push({
          name: "supplierFarms"
        })
      },
      async getUsageLimit(orgId) {
        this.startLoading();
        return new Promise((resolve, reject) => {
          const params = {
            organizationId: orgId,
          };
          DeforestationService.getUsesLimit(params).then(res => {
            this.usageLimits = res?.data?.usageLimits || [];
            this.stopLoading()
            resolve()
          }).catch(err => {
            reject(err)
          });
  
        })
      },
  
      createDeligenceChart() {
        let used = this.dueDeligence?.used
        this.dueDiligenceChartOptions = {
          chart: {
            height: 350,
            type: "radialBar",
          },
          plotOptions: {
            radialBar: {
              hollow: {
                size: "70%",
              },
              dataLabels: {
                name: {
                  offsetY: 20,
                  fontSize: "14px",
                  color: "#1E1E1E", // Green color for the label text
                  show: true,
                },
                value: {
                  fontSize: "36px",
                  show: true,
                  color: "#1E1E1E", // Green color for the value text
                  offsetY: -10,
                  formatter: function () {
                    return used
                  }
                },
              },
              track: {
                background: "#e0e0e0",
              },
            },
          },
          fill: {
            colors: ["#0EBF67"], // Green color for the chart
          },
  
          labels: [this.$t('used')],
  
        }
      },
  
      createDeforestationChart() {
        let used = this.eudrDeforestationAssessment?.used
        this.deforestationChartOptions = {
          chart: {
            height: 350,
            type: "radialBar",
          },
          plotOptions: {
            radialBar: {
              hollow: {
                size: "70%",
              },
              dataLabels: {
                name: {
                  offsetY: 20,
                  fontSize: "14px",
                  color: "#1E1E1E", // Green color for the label text
                  show: true,
                },
                value: {
                  fontSize: "36px",
                  show: true,
                  color: "#1E1E1E", // Green color for the value text
                  offsetY: -10,
                  formatter: function () {
                    return used
                  }
                },
              },
              track: {
                background: "#e0e0e0",
              },
            },
          },
          fill: {
            colors: ["#0EBF67"], // Green color for the chart
          },
  
          labels: [this.$t('used')],
  
        }
      },
  
      createRiskAssessmentChart() {
        let used = this.riskAssessment?.used
        this.riskAssessmentChartOptions = {
          chart: {
            height: 350,
            type: "radialBar",
          },
          plotOptions: {
            radialBar: {
              hollow: {
                size: "70%",
              },
              dataLabels: {
                name: {
                  offsetY: 20,
                  fontSize: "14px",
                  color: "#1E1E1E", // Green color for the label text
                  show: true,
                },
                value: {
                  fontSize: "36px",
                  show: true,
                  color: "#1E1E1E", // Green color for the value text
                  offsetY: -10,
                  formatter: function () {
                    return used
                  }
                },
              },
              track: {
                background: "#e0e0e0",
              },
            },
          },
          fill: {
            colors: ["#0EBF67"], // Green color for the chart
          },
  
          labels: [this.$t('used')],
  
        }
      },
      async fetchAllProducers() {
      try {
        const res = await DeforestationService.getProductionPlaces({
          page: 1,
          limit: 500, // Adjust limit as needed
          orgId: this.orgId,
          removed: false,
        });
        const producers = res.data?.productionPlaces?.rows
          .filter(item => item.farm?.userDdsAssoc?.firstName)
          .map(item => ({
            text: `${item.farm?.userDdsAssoc?.firstName || ''} ${item.farm?.userDdsAssoc?.lastName || ''}`.trim(),
            val: item.farm?.userDdsAssoc?.firstName
          }));
        this.allProducers = [...this.allProducers, ...producers];
      } catch (error) {
        console.error("Error fetching all producers:", error);
      }
    },
    async getSupplierList() {
        return DeforestationService.getSupplierList().then(res => {
            this.supplierList = res.data.findAllSuppliersOrOperators?.map((item)=>{
              return {
                label:item.firstName + ' ' + item.lastName,
                val:parseInt(item.id)
              }
            }) || [];
          if (this.isSupplierOwner) {
            const label = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
            this.supplierList.unshift({
              label: label,
              val: null
            });
          }
        }).catch(err => {
            console.log('Error', err)
        })
    },
      async getProductionPlaces(opt = null) {
        this.listOfFarmloading = true;
        
        
        const requestParams = {
          page: this.options.page,
          limit: this.options.limit,
          orgId: this.orgId,
          removed: false,
          searchPhrase: this.placeSearch,
          farmCountry: this.placeCountry,
          farmOwner: this.producerModel,
          eudrDeforestationStatus: this.placeStatus,
          supplierId: parseInt(this.supplierModel),
        };
        if (opt?.sortBy?.length) {
          requestParams.orderField = opt.sortBy[0];
          requestParams.order = opt.sortDesc[0] ? "DESC" : "ASC";
        }
        await DeforestationService.getProductionPlaces(requestParams)
          .then((res) => {
            this.productionPlaces = res.data.productionPlaces.rows;
            
            this.totalProductionPlaces = res.data.productionPlaces.totalCount;
            this.fromProducer = (this.options.page - 1) * this.options.limit + 1;
            this.toProducer = this.options.page * this.options.limit;
            if (this.productionPlaces.length > 0) {
              this.toProducer -= this.options.limit - this.productionPlaces.length;
            } else {
              this.toProducer -= this.options.limit;
            }
            if (this.totalProductionPlaces < 1) {
              this.toProducer = 0;
              this.fromProducer = 0;
              this.options.page = 1;
            }
            const countryLists = this.productionPlaces
              .filter((item) => item.farm.userDdsAssoc.countryId)
              .map((item) => {
                return {
                  text: item.farm.userDdsAssoc.countryId,
                  val: item.farm.userDdsAssoc.countryId,
                };
              });
            const producerList = this.productionPlaces
              .filter((item) => {
                return item.farm.userDdsAssoc.firstName;
              })
              .map((item) => {
                const fullName = `${item.farm.userDdsAssoc.firstName
                  ? item.farm.userDdsAssoc.firstName
                  : ""
                  } ${item.farm.userDdsAssoc.lastName ? item.farm.userDdsAssoc.lastName : ""
                  }`;
                return {
                  text: `${fullName}`,
                  val: `${item.farm.userDdsAssoc.firstName}`,
                };
              });
            this.countries = [...this.countries, ...countryLists];
            this.allProducers = [...this.allProducers, ...producerList];
          })
          .catch((err) => {
            this.listOfFarmloading = false;
            console.log("Error", err);
          })
          .finally(() => {
            this.listOfFarmloading = false;
          });
      },
   async removeFarm(id){
    this.farmConfirmDelete.confirmData = { id };
    this.farmConfirmDeleteDialog = true;
   },
      async confirmRemoveFarm(action, confirmData) {
        this.startLoading();
        const params = {
          farmId: parseInt(confirmData.id),
        };
        const res = await DeforestationService.removeProductionPlaceByFarmId(
          params
        );
  
        const { success, message } = res.data.removeFarmFromProductionPlaceList;
        this.stopLoading();
        if (success) {
          // Log the production place deletion
          try {
            const userId = this.$store.getters.getUser?.id;
            if (userId) {
              await ActivityLogService.logDDSProductionPlaceDeleted(
                null, // diligenceId not available in this context
                userId,
                confirmData.id,
                '',
                'Dashboard deletion'
              );
            }
          } catch (logError) {
            console.error('Error logging production place deletion:', logError);
          }
          
          await this.getProductionPlaces();
          this.farmConfirmDeleteDialog = false;
          this.$notify({
            title: message || this.$t("deforestation.itemDeletedSuccessfully"),
            type: "success",
          });
        }
      },
  
      handleSearchByPharse() {
      return this.getProductionPlaces()||"";
       },
      handleSearchByStatus() { },
  
      handleSearchOnEmpty() {
        this.placeCountry = "";
        this.options = {
          page: 1,
          limit: 10,
        };
        this.getProductionPlaces();
      },
      pageChange(t) {
        if (t) this.options.page = this.options.page + 1;
        else this.options.page = this.options.page - 1;
        this.getProductionPlaces();
      },
      getCountry() {
        this.countries = [{ name: this.$t("deforestation.allCountries") }, ...getCountries()];
      },
  
      async deleteDiligenceReports(id) {
       
        this.confirmDelete.confirmData = { id };
        this.confirmDeleteDialog = true;
      },
  
      async confirmDeleteDiligenceReport(action, confirmData){
        this.loading = true;
  
        DeforestationService.deleteDiligenceReport(parseInt(confirmData.id))
          .then(() => {
            this.getDeforestationEUDR();
            this.$notify({
              text: this.$t("deforestation.reportDeletedSuccessfully"),
              type: "success",
            });
            this.loading = false;
            this.confirmDeleteDialog = false;
  
          })
          .catch((err) => {
            this.loading = false;
            this.confirmDeleteDialog = false;
            this.$notify({
              text: err,
              type: "error",
            });
            console.log("Error", err);
          });
        },
      async duplicateDiligenceReports(id) {
        this.loading = true;
  
        DeforestationService.duplicateDiligenceReport(parseInt(id))
          .then(() => {
            this.getDeforestationEUDR();
            this.loading = false;
          })
          .catch((err) => {
            this.loading = false;
            this.$notify({
              text: err,
              type: "error",
            });
            console.log("Error", err);
          });
      },
  
      async getDeforestationEUDR(opt = null) {
        this.loading = true;
        const requestParams = {
          page: this.reportOptions.page,
          limit: this.reportOptions.itemsPerPage,
          searchPhrase: this.reportSearch,
          country: this.reportCountry,
          status: this.reportStatus,
          cfroles:currentRoles()
        };
  
        if (opt?.sortBy?.length) {
          requestParams.orderField = opt.sortBy[0];
          requestParams.order = opt.sortDesc[0] ? "DESC" : "ASC";
        }
        DeforestationService.getDiligenceReports(requestParams)
          .then((res) => {
            this.diligenceReports = res.data.diligenceReports.rows;
            
            //this.copyReport = JSON.parse(JSON.stringify(res.data.deforestationAdmin.rows))
            this.totalDiligenceReports = res.data.diligenceReports.totalCount;
  
            this.totalDiligenceReportsPages = Math.ceil(
              this.totalDiligenceReports / this.reportOptions.itemsPerPage
            );
            this.fromDiligenceReports = this.totalDiligenceReports > 0
              ? (this.reportOptions.page - 1) * this.reportOptions.itemsPerPage + 1
              : 0;
            this.toDiligenceReports = this.reportOptions.page * this.reportOptions.itemsPerPage > this.totalDiligenceReports
              ? this.totalDiligenceReports
              : this.reportOptions.page * this.reportOptions.itemsPerPage;
            this.loading = false;
          })
          .catch((err) => {
            this.loading = false;
            console.log("Error", err);
          });
      },
      selectItem(item) {
        this.selectedItem = item;
      },
      searchQuery() {
        this.getDeforestationEUDR();
      },
      resetSearchOnEmpty() {
        this.reportSearch = "";
        this.reportCountry = "";
        this.reportStatus = "";      
        //this.regionModelregionModel = ''
        this.reportOptions = {
          page: 1,
          limit: 10,
        };
  
        this.getDeforestationEUDR();
      },
      reportPageChange(t) {
        if (t) this.reportOptions.page = this.reportOptions.page + 1;
        else this.reportOptions.page = this.reportOptions.page - 1;
        this.getDeforestationEUDR();
      },
      navigateReportView(item) { 
        
        if (item.status == 'Pending') {
          this.$router.push({ name: 'createDueDiligenceReports', params: { id: item.id, show: 'show' } })
        }else if (item.status.toLowerCase() == 'under review') {
          this.$router.push({ name: 'createDueDiligenceReports', params: { id: item.id, show: 'show' } })
        }else if(item.status.toLowerCase()  == 'ready to proceed')  {
          const tabd  = JSON.parse(localStorage.getItem('DDS_TAB_DATA'))
          const activeTb =  tabd ? (tabd.activeTab == 2) ? 3 : 4 : 3
          this.$store.dispatch('SET_DDS_TAB', {
            activeTab:activeTb 
          }).then(() => {
            this.$router.push({ name: 'createDueDiligenceReports', params: { id: item.id, show: 'show' } })
          })
        }
         else if (item.status == 'Non-Compliant') {
          const finalReportTab = 5 + (item?.diligenceReportAssessment?.length || 0)
          this.$store.dispatch('SET_DDS_TAB', {
            activeTab: finalReportTab
          }).then(() => {
            this.$router.push({ name: 'createDueDiligenceReports', params: { id: item.id, show: 'non-complaint' } })
          })
        } else if (item.status == 'Compliant') {
          const finalReportTab = 5 + (item?.diligenceReportAssessment?.length || 0)
          
          this.$store.dispatch('SET_DDS_TAB', {
            activeTab: finalReportTab
          }).then(() => {
            this.$router.push({ name: 'createDueDiligenceReports', params: { id: item.id, show: 'complaint' } })
          })
        }
      },
      async getEudrSettings() {
          try {
              const { data } = await DeforestationService.getEudrSettings();
              this.eudrSettings = data.eudrSetting;
          } catch (err) {
              this.$notify({
                  text: this.$t('deforestation.failedToFetchSettings'),
                  type: 'error',
                  duration: 10000,
              })
          }
      },
      getConvertedMass(value){
        return this.eudrSettings && UnitService.fromBase.weight(this.eudrSettings.product_mass_unit, value)
      },
      closeFilter() {
        this.showFilters = false;
      },
      clearFilters() {
        this.producerModel = '';
        this.placeStatus = '';
        this.placeCountry = '';
      },
    },
  
    mixins: [tableCustomizationMixin, loadingMixin, download, getPermittedActions, DateMixin],
  };
  </script>
  
  <style scoped>
  ::v-deep .v-data-table__wrapper{
    margin-top: -16px !important;
  }
  .blue-button {
    background-color: #d0e6fe !important;
    /* Green background */
    border: 2px solid #002287 !important;
    /* Red border */
    color: #002287 !important;
  }
  
  .gray-button {
    background-color: #e8e8e8 !important;
    /* Green background */
    border: 2px solid #000000 !important;
    /* Red border */
    color: #000000 !important;
  }
  
  /* .orange-button {
    background-color: rgba(181, 109, 1, 0.2) !important;
    border: 2px solid #B56D01 !important;
    color: #B56D01 !important;
  } */
  
  .card-title {
    font-weight: 600;
    font-size: 18px;
    color: #1e1e1e;
  }
  
  .card-sub-title {
    margin-bottom: 10px;
    font-weight: 600;
    font-size: 16px;
    color: #787878;
  }
  
  .card-price {
    font-weight: 600;
    font-size: 60px;
    color: #2e2f31;
  }
  
  .card-sub-price {
    margin-left: 10px;
    font-weight: 600;
    font-size: 16px;
    color: #2e2f31;
  }
  
  .usage-limit-card {
    padding: 10px;
    height: auto;
    width: auto;
  }
  
  @media only screen and (max-width: 600px) {
    .usage-limit-card {
      min-height: 55vh !important;
    }
  }
  
  @media only screen and (min-width: 600px) and (max-width: 1080px) {
    .usage-limit-card {
      min-height: 30vh !important;
    }
  }
  
  @media only screen and (min-width: 1080px) {
    .usage-limit-card {
      min-height: 20vh !important;
    }
  }
  
  .radial-bar-chart {
    margin-top: -20px;
  }
  
  .heading-title {
    font-weight: 600;
    font-size: 22px;
    color: #1e1e1e;
  }
  
  .main-price {
    display: flex;
    align-items: center;
    margin-top: 25px;
  }
  
  .card-content {
    text-align: center;
  }
  
  .green-button {
    background-color: #c1ffe7 !important;
    /* Green background */
    border: 2px solid #489e16 !important;
    /* Red border */
    color: #489e16 !important;
  }
  
  .green-shadow {
    color: #00bd73 !important;
  }
  
  .red-button {
    background-color: #fdebeb !important;
    /* Green background */
    border: 2px solid #da3d3d !important;
    /* Red border */
    color: #da3d3d !important;
  }
  
  .orange-button {
    background-color: #fff7ec !important;
    /* Green background */
    border: 2px solid #ffa826 !important;
    /* Red border */
    color: #ffa826 !important;
  }
  
  ::v-deep .v-data-table-header span {
    text-transform: none !important;
  }
  ::v-deep .my-custom-dialog {
    position: absolute;
    top: 0;
    min-height: 100%;
    right: 0;
    margin-right: 0px;
    margin-top: 0px;
  }

  ::v-deep .sticky-bottom-alert{
    width: 74% !important;
    position:fixed;
    left: 20%;
    bottom: 0;
    opacity: 0.95;
    z-index: 999;

  }

  .no-pointer {
    pointer-events: none;
    cursor: default;
  }

  ::v-deep .non-clickable {
    pointer-events: none;
    cursor: default;
  }

  /* Responsive improvements for small desktop screens */
  @media (max-width: 1280px) {
    .usage-limit-card {
      min-height: 20vh !important;
      padding: 5px !important;
      width: 95% !important;
    }
    .card-title, .heading-title {
      font-size: 16px !important;
    }
    .card-price {
      font-size: 36px !important;
    }
    .main-price {
      margin-top: 10px !important;
    }
    .v-card {
      padding: 10px !important;
    }
    .v-data-table th, .v-data-table td {
      font-size: 13px !important;
      padding: 6px 4px !important;
      min-width: 80px !important;
      max-width: 180px !important;
      word-break: break-word;
    }
    .v-data-table {
      font-size: 13px !important;
    }
    .v-row, .v-col {
      margin-left: 0 !important;
      margin-right: 0 !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
    .v-card[style*="width: 300px"] {
      width: 90vw !important;
      min-width: 180px !important;
      max-width: 300px !important;
      padding: 20px !important;
      height: auto !important;
    }
    .d-flex[style*="margin-top: 60px;"] {
      margin-top: 20px !important;
    }
  }

  @media (max-width: 1024px) {
    .v-row {
      flex-direction: column !important;
    }
    .v-col, .v-card {
      width: 100% !important;
      max-width: 100% !important;
      min-width: 0 !important;
    }
    .v-data-table th, .v-data-table td {
      font-size: 12px !important;
      padding: 4px 2px !important;
      min-width: 60px !important;
      max-width: 120px !important;
    }
    .heading-title {
      font-size: 15px !important;
    }
  }

    /* Responsive, compact controls bar for table filters/actions */
  .table-controls-bar {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: nowrap; /* Prevent wrapping unless absolutely necessary */
    gap: 12px;
    margin-bottom: 12px;
  }
  .controls-left {
    display: flex;
    align-items: flex-end;
    gap: 12px;
    flex: 1 1 auto;
    min-width: 0;
  }
  .controls-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 0 0 auto;
    min-width: 0;
    padding-bottom: 22px;
  }
  .download-history{
    padding-bottom: 22px;
  }
  .control {
    min-width: 120px;
    max-width: 220px;
    flex: 1 1 160px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
  .pagination-label {
    font-size: 14px;
    margin-right: 0.5rem;
    white-space: nowrap;
  }
  @media (max-width: 1100px) {
    .table-controls-bar {
      flex-wrap: wrap;
    }
    .controls-left, .controls-right {
      flex-wrap: wrap;
      gap: 8px;
    }
    .control {
      max-width: 160px;
      flex: 1 1 120px;
    }
  }
  @media (max-width: 600px) {
    .v-card {
      padding: 12px !important;
      font-size: 15px;
    }
    .v-card strong {
      font-size: 15px;
    }
  }
  @media (max-width: 400px) {
    .v-card {
      font-size: 13px;
    }
  }
  .dashboard-card {
    min-height: 180px;
    padding: 32px 12px;
    width: 100%;
    max-width: 340px;
  }
  @media (max-width: 900px) {
    .dashboard-card {
      min-height: 140px;
      padding: 20px 8px;
      max-width: 100%;
    }
  }
  .report-card {
    border-radius: 18px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.07);
    font-size: 1rem;
  }
  .report-title {
    font-size: 1.2rem;
    font-weight: bold;
  }

  .report-row:last-child {
    border-bottom: none;
  }
  @media (max-width: 600px) {
    .report-card {
      padding: 12px !important;
      font-size: 15px;
    }
    .report-title {
      font-size: 1.1rem;
    }
  }

  /* Mobile Controls and Pagination Styles */
  .mobile-controls-bar {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
  }

  .mobile-controls-left {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .mobile-search {
    width: 100%;
  }

  .mobile-filter {
    width: 100%;
  }

  .mobile-pagination {
    padding: 16px 0;
    border-top: 1px solid #e0e0e0;
  }

  .mobile-pagination-label {
    font-size: 14px;
    font-weight: 500;
    color: #666;
  }

  .mobile-pagination-controls {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* Responsive adjustments for mobile */
  @media (max-width: 480px) {
    .mobile-controls-bar {
      gap: 8px;
    }
    
    .mobile-controls-left {
      gap: 8px;
    }
    
    .mobile-pagination {
      padding: 12px 0;
    }
    
    .mobile-pagination-label {
      font-size: 13px;
    }
  }

.status-legend-inline {
  font-size: 14px;
  flex-wrap: wrap;
}
.legend-label {
  color: #222;
}
.legend-item {
  white-space: nowrap;
  font-size: 14px;
}
.status-legend-section {
  background: #f8f9fa;
  border-radius: 10px;
  flex-wrap: wrap;
  font-size: 15px;
}
.legend-title {
  color: #222;
}
.legend-item {
  white-space: nowrap;
  font-size: 15px;
}
  </style>