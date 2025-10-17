<template>
  <div>
    <div class="d-flex mb-4">
      <v-spacer></v-spacer>
      <v-btn v-if="isOwner" color="primary" dark class="mr-2 mb-2" @click="handleCreateReport">
        {{ $t("deforestation.createNewReport") }}
      </v-btn>
    </div>
    <v-card elevation="0">
      <v-card-text>
        <v-row style="margin-left:0px; margin-bottom: 20px;">
          <v-col cols="12">
            <!-- Mobile card view for Due Diligence Reports -->
            <div v-if="$vuetify && $vuetify.breakpoint.smAndDown">
              <!-- Mobile Controls Bar -->
              <div class="mobile-controls-bar mb-4">
                <div class="mobile-controls-left">
                  <v-text-field prepend-inner-icon="mdi-magnify" outlined dense :placeholder="$t('search')"
                    v-model="reportSearch" @input="searchQuery" class="mobile-search" />
                  <!-- Country filter temporarily disabled -->
                  <!-- <v-select v-model="reportCountry" item-text="name" item-value="name" :items="countries"
                    :label="$t('deforestation.allCountries')" @change="filterData" outlined dense
                    class="mobile-filter" /> -->
                  <v-select v-model="selectedStatuses" multiple chips :label="$t('deforestation.dueDeligenceStatus')"
                    @change="filterData" outlined dense class="mobile-filter">
                    <template v-slot:prepend-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-bold text-uppercase">
                            {{ $t('deforestation.dueDeligenceStatus') }}
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider></v-divider>
                      <v-list-item v-for="status in dueDiligenceStatuses" :key="status.value">
                        <v-list-item-action>
                          <v-checkbox v-model="selectedStatuses" :value="status.value" color="primary"></v-checkbox>
                        </v-list-item-action>
                        <v-list-item-content>
                          <v-list-item-title>{{ status.name }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider></v-divider>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-bold text-uppercase">
                            {{ $t('deforestation.reportStatus') }}
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider></v-divider>
                      <v-list-item v-for="status in reportStatuses" :key="status.value">
                        <v-list-item-action>
                          <v-checkbox v-model="selectedLegendsStatuses" :value="status.value"
                            color="primary"></v-checkbox>
                        </v-list-item-action>
                        <v-list-item-content>
                          <v-list-item-title>{{ status.name }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                  </v-select>
                </div>
              </div>

              <!-- Mobile Cards -->
              <v-row>
                <v-col cols="12" v-for="item in diligenceReports" :key="item.id">
                  <v-card class="mb-3 pa-4 report-card">
                    <div class="d-flex align-center justify-space-between mb-2">
                      <div class="report-title">
                        <span class="font-weight-bold" style="font-size: 1.2rem;">Internal Reference #:</span>
                        <span class="font-weight-bold" style="font-size: 1.2rem;">{{ item.internalReferenceNumber
                        }}</span>
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
                    <v-divider class="mb-2" />
                    <div class="d-flex align-center justify-space-between py-1 report-row">
                      <span class="font-weight-medium">EUDR Reference #:</span>
                      <span>{{ item.EUDRReferenceNumber || 'N/A' }}</span>
                    </div>
                    <v-divider class="my-1" />
                    <div class="d-flex align-center justify-space-between py-1 report-row">
                      <span class="font-weight-medium">Supplier:</span>
                      <span>{{ getSupplierFullName(item) }}</span>
                    </div>
                    <v-divider class="my-1" />
                    <div class="d-flex align-center justify-space-between py-1 report-row">
                      <span class="font-weight-medium">Product:</span>
                      <span>{{ item.product_detail ? (item.product_detail.code ? item.product_detail.code + '-' : '') :
                        '' }}{{
                          item.product_detail ? item.product_detail.name : '' }}</span>
                    </div>
                    <v-divider class="my-1" />
                    <div class="d-flex align-center justify-space-between py-1 report-row">
                      <span class="font-weight-medium">Farms:</span>
                      <span>{{ item.productionPlaceCount }}</span>
                    </div>
                    <v-divider class="my-1" />
                    <div class="d-flex align-center justify-space-between py-1 report-row">
                      <span class="font-weight-medium">Quantity:</span>
                      <span>{{ !isNaN(item.productNetMass) ? parseFloat(getConvertedMass(item.productNetMass)) : 0 }} {{
                        eudrSettings?.product_mass_unit }}</span>
                    </div>
                    <v-divider class="my-1" />
                    <div class="d-flex align-center justify-space-between py-1 report-row">
                      <span class="font-weight-medium">Country:</span>
                      <span>{{ item.countryOfEntry }}</span>
                    </div>
                    <v-divider class="my-1" />
                    <div class="d-flex align-center justify-space-between py-1 report-row">
                      <span class="font-weight-medium">Submission Date:</span>
                      <div class="d-flex flex-column align-end">
                        <span>{{ getDateFormat(item.createdAt) }}</span>
                        <span class="text-caption" :class="item.statusLegends === 'overdue' ? 'orange--text' : 'grey--text'">
                          ({{ getDaysOld(item.createdAt) }} Days Old)
                        </span>
                      </div>
                    </div>
                    <v-divider class="my-1" />
                    <div class="d-flex align-center justify-space-between py-1 report-row">
                      <span class="font-weight-medium">Last Updated:</span>
                      <span>{{ formatDate(item.updatedAt) }}</span>
                    </div>
                    <v-divider class="my-1" />
                    <div class="d-flex align-center justify-space-between py-1 report-row">
                      <span class="font-weight-medium">Assign To:</span>
                      <span>{{ item.assignedToUser ? item.assignedToUser.firstName + ' ' + item.assignedToUser.lastName : '-' }}</span>
                    </div>
                    <v-divider class="my-1" />
                    <div class="d-flex align-center justify-space-between py-2 report-row">
                      <span class="font-weight-medium">Due Diligence Status:</span>
                      <v-btn small rounded min-width="160" depressed class="blue-button" height="34"
                        v-if="item.status == 'Uploaded to EU Portal'">
                        <!-- getModulePermittedActions.put -->
                        {{ $t("deforestation.uploadedToEU") }}
                      </v-btn>

                      <v-btn small rounded min-width="160" depressed class="gray-button" height="34"
                        v-if="item.status == 'Pending'">
                        <!-- getModulePermittedActions.put -->
                        {{ $t("deforestation.pending") }}
                      </v-btn>
                      <v-btn small rounded min-width="160" depressed class="orange-button" height="34"
                        v-if="item.status == 'Under Review'">
                        <!-- getModulePermittedActions.put -->
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

              <!-- Mobile Pagination -->
              <div class="mobile-pagination mt-4">
                <div class="d-flex justify-space-between align-center">
                  <span class="mobile-pagination-label">{{ toDiligenceReports }} of {{ totalDiligenceReports }}</span>
                  <div class="mobile-pagination-controls">
                    <v-btn fab small outlined color="primary" :disabled="reportOptions.page <= 1"
                      @click="reportPageChange(false)" class="mr-2">
                      <v-icon dark>mdi-chevron-left</v-icon>
                    </v-btn>
                    <v-btn fab small outlined color="primary" :disabled="reportOptions.page >= totalPages"
                      @click="reportPageChange(true)">
                      <v-icon dark>mdi-chevron-right</v-icon>
                    </v-btn>
                  </div>
                </div>
              </div>
            </div>

            <!-- Desktop table view -->
            <v-data-table v-else :headers="reportHeaders" :items="diligenceReports" :items-per-page="10" :footer-props="{
              'items-per-page-options': [10, 25, 50],
            }" item-key="id" hide-default-footer :loading="loading" :options.sync="reportOptions" :loading-text="$t('loadingData')
              " show-select v-model="selectedReports">
              <template v-slot:top="{ }">
                <div class="table-controls-container">
                  <div class="filters-row">
                    <v-row>
                      <v-col>
                        <div class="control search">
                          <label for="text">&nbsp;</label>
                          <v-text-field prepend-inner-icon="mdi-magnify" outlined height="5px" :placeholder="$t('search')"
                            dense v-model="reportSearch" @input="searchQuery"  />
                        </div>
                    </v-col>
                    <v-col v-if="!isWorkerOnly">
                    <div class="control filter">
                      <label for="text">{{ $t("country") }} </label>
                      <v-select v-model="reportCountry" item-text="name" item-value="name" :items="countries"
                        :label="$t('deforestation.allCountries')" @change="filterData" outlined dense />
                    </div> 
                    </v-col>

                    <v-col v-if="!isWorkerOnly">
                    <div class="control filter">
                      <label for="text">{{ $t("deforestation.exporter") }}</label>
                      <v-select v-model="selectedExporters" item-text="name" item-value="value" :items="filteredExporterOptions"
                        :label="$t('select')" @change="filterData" outlined dense clearable multiple chips no-filter>
                        <template v-slot:prepend-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-text-field v-model="exporterSearch" placeholder="Search"
                                prepend-inner-icon="mdi-magnify" dense outlined hide-details class="ma-2"
                                @keydown.stop @click.stop />
                            </v-list-item-content>
                          </v-list-item>
                          <v-divider></v-divider>
                          <v-list-item @click="selectAllExporters">
                            <v-list-item-action>
                              <v-checkbox v-model="allExportersSelected" color="primary"></v-checkbox>
                            </v-list-item-action>
                            <v-list-item-content>
                              <v-list-item-title>{{ $t('all') }}</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                        <template v-slot:selection="{ item, index }">
                          <v-chip v-if="allExportersSelected && index === 0" small>
                            ALL
                          </v-chip>
                          <v-chip v-else-if="!allExportersSelected" small>
                            {{ item.name }}
                          </v-chip>
                        </template>
                      </v-select>
                    </div>
                    </v-col>
                    <v-col>
                    <div class="control filter">
                      <label for="text">{{ $t("deforestation.supplier") }}</label>
                      <v-select v-model="selectedSuppliers" item-text="name" item-value="value" :items="filteredSupplierOptions"
                        :label="$t('select')" @change="filterData" outlined dense clearable multiple chips no-filter>
                        <template v-slot:prepend-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-text-field v-model="supplierSearch" placeholder="Search"
                                prepend-inner-icon="mdi-magnify" dense outlined hide-details class="ma-2"
                                @keydown.stop @click.stop />
                            </v-list-item-content>
                          </v-list-item>
                          <v-divider></v-divider>
                          <v-list-item @click="selectAllSuppliers">
                            <v-list-item-action>
                              <v-checkbox v-model="allSuppliersSelected" color="primary"></v-checkbox>
                            </v-list-item-action>
                            <v-list-item-content>
                              <v-list-item-title>{{ $t('all') }}</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                        <template v-slot:selection="{ item, index }">
                          <v-chip v-if="allSuppliersSelected && index === 0" small>
                            ALL
                          </v-chip>
                          <v-chip v-else-if="!allSuppliersSelected" small>
                            {{ item.name }}
                          </v-chip>
                        </template>
                      </v-select>
                    </div>
                    </v-col>
                    
                    <v-col v-if="!isWorkerOnly">
                    <div class="control filter">
                      <label for="text">{{ $t("deforestation.assignTo") }}</label>
                      <v-select v-model="selectedAssignedTo" item-text="name" item-value="value"
                        :items="filteredAssignedToOptions" :label="$t('select')" @change="filterData" outlined dense clearable multiple chips no-filter>
                        <template v-slot:prepend-item>
                          <v-list-item @click="toggleAssignedToMe">
                            <v-list-item-action>
                              <v-checkbox v-model="isAssignedToMeSelected" color="primary"></v-checkbox>
                            </v-list-item-action>
                            <v-list-item-content>
                              <v-list-item-title>Assigned to me</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                          <v-divider></v-divider>
                          <v-list-item>
                            <v-list-item-content>
                              <v-text-field v-model="assignedToSearch" placeholder="Search"
                                prepend-inner-icon="mdi-magnify" dense outlined hide-details class="ma-2"
                                @keydown.stop @click.stop />
                            </v-list-item-content>
                          </v-list-item>
                          <v-divider></v-divider>
                          <v-list-item @click="selectAllAssignedTo">
                            <v-list-item-action>
                              <v-checkbox v-model="allAssignedToSelected" color="primary"></v-checkbox>
                            </v-list-item-action>
                            <v-list-item-content>
                              <v-list-item-title>{{ $t('all') }}</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                        <template v-slot:selection="{ item, index }">
                          <v-chip v-if="allAssignedToSelected && index === 0" small>
                            ALL
                          </v-chip>
                          <v-chip v-else-if="!allAssignedToSelected" small>
                            {{ item.name }}
                          </v-chip>
                        </template>
                      </v-select>
                    </div>
                    </v-col>
                    
                    <v-col>
                      <div class="control filter">
                        <label for="text">{{ $t('status') }}</label>
                        <v-select v-model="selectedStatuses" multiple chips
                          :label="$t('deforestation.dueDeligenceStatus')" @change="filterData" outlined dense
                          no-data-text="No options available" @click:menu="onStatusMenuOpen">
                          <template v-slot:prepend-item>
                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-title class="font-weight-bold text-uppercase">
                                  {{ $t('deforestation.dueDeligenceStatus') }}
                                </v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                            <v-divider></v-divider>
                            <v-list-item v-for="status in dueDiligenceStatuses" :key="status.value">
                              <v-list-item-action>
                                <v-checkbox v-model="selectedStatuses" :value="status.value" color="primary"></v-checkbox>
                              </v-list-item-action>
                              <v-list-item-content>
                                <v-list-item-title>{{ status.name }}</v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                            <v-divider></v-divider>
                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-title class="font-weight-bold text-uppercase">
                                  {{ $t('dueDiligence.reportStatus') }}
                                </v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                            <v-divider></v-divider>
                            <v-list-item v-for="status in reportStatuses" :key="status.value">
                              <v-list-item-action>
                                <v-checkbox v-model="selectedLegendsStatuses" :value="status.value"
                                  color="primary"></v-checkbox>
                              </v-list-item-action>
                              <v-list-item-content>
                                <v-list-item-title>{{ status.name }}</v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                          </template>
                        </v-select>
                      </div>
                    </v-col>
                    <!-- <div class="control download-history">
                        <p class="text-decoration-underline cursor-pointer primary--text mb-0" @click="showAllDownloads">
                          {{ $t('dueDiligence.viewDownloadHistory') }}
                        </p>
                      </div> -->
                    </v-row>
                  </div>
                  <div class="buttons-row">
                    <div class="action-buttons" v-if="!isInModal">
                      <v-btn color="primary" v-if="$can($permissions.assign.value)" class="mr-2" @click="handleAssignReports">
                        {{ $t('dueDiligence.assignReports') }}
                      </v-btn>
                      <v-btn color="primary" v-if="$can($permissions.approve.value)" class="mr-2" @click="handleApproveReports">
                        {{ $t('dueDiligence.approveReports') }}
                      </v-btn>
                      <v-btn color="error" class="mr-2" @click="handleRejectReports">
                        {{ $t('dueDiligence.rejectReports') }}
                      </v-btn>
                      <div v-if="selectedReportsCount > 0" class="selection-indicator mr-3">
                        <span class="selection-text">{{ selectedReportsCount }} {{ $t('dueDiligence.reportsSelected') }}</span>
                        <v-btn icon small @click="clearSelection" class="ml-1">
                          <v-icon small>mdi-close</v-icon>
                        </v-btn>
                      </div>
                    </div>
                    <div class="pagination-controls">
                      <span class="pagination-label ml-4">{{ toDiligenceReports }} of {{ totalDiligenceReports }}</span>
                      <v-btn fab small outlined color="primary" :disabled="reportOptions.page <= 1"
                        @click="reportPageChange(false)" class="ml-2">
                        <v-icon dark>mdi-chevron-left</v-icon>
                      </v-btn>
                      <v-btn fab small outlined color="primary" :disabled="reportOptions.page >= totalPages"
                        @click="reportPageChange(true)">
                        <v-icon dark>mdi-chevron-right</v-icon>
                      </v-btn>
                      <!-- <v-btn fab small outlined color="primary" class="ml-2">
                        <v-icon dark>mdi-cog-outline</v-icon>
                      </v-btn>
                      <v-btn fab small outlined color="primary" @click="exportToPDF">
                        <v-icon dark>mdi-tray-arrow-down</v-icon>
                      </v-btn>
                      <v-btn fab small outlined color="primary" @click="printPDF">
                        <v-icon dark>mdi-printer</v-icon>
                      </v-btn> -->
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="diligenceReports.length" v-slot:item="{ item, isSelected, select }">
                <tr style="position: relative; width: 0; height: 0" @mouseover="selectItem(item)"
                  @mouseleave="selectItem(false)">
                  <!-- Selection checkbox column -->
                  <td>
                    <v-simple-checkbox :value="isSelected" @input="select($event)" color="primary"></v-simple-checkbox>
                  </td>
                  <template v-for="h in tableHeaders">

                    <td class="text-truncate" :key="h.value + '_eudrAndInternalRefNo'"
                      v-if="h.value == 'eudrAndInternalRefNo'">
                      {{ item.EUDRReferenceNumber + item.EUDRReferenceNumber ? '-' + item.internalReferenceNumber :
                        item.internalReferenceNumber }}
                    </td>

                    <td class="text-truncate" :key="h.value + '_supplier'" v-else-if="h.value == 'supplier.firstName'">
                      {{ getSupplierFullName(item) }}
                    </td>

                    <td class="text-truncate" :key="h.value + '_product'" v-else-if="h.value == 'product'">
                      {{ item.product_detail ? (item.product_detail.code ? item.product_detail.code + '-' : "") : '' }}
                      {{ item.product_detail ? item.product_detail.name : '' }}
                    </td>

                    <td class="text-truncate" :key="h.value + '_productionPlaceCount'"
                      v-else-if="h.value == 'productionPlaceCount'">
                      {{ item.productionPlaceCount }} <br />
                      {{ !isNaN(item.productNetMass) ? parseFloat(getConvertedMass(item.productNetMass)) : 0 }} {{
                        eudrSettings?.product_mass_unit }}
                    </td>

                    <td class="text-truncate" :key="h.value + '_countryOfEntry'"
                      v-else-if="h.value == 'countryOfEntry'">
                      {{ item.countryOfEntry }}
                    </td>

                    <td :key="h.value + '_createdAt'" v-else-if="h.value == 'createdAt'" class="text-truncate">
                      {{ getDateFormat(item.createdAt) }}<br>
                      <span :class="item.statusLegends === 'overdue' ? 'orange--text' : 'grey--text'" style="font-size: 12px;">
                        ({{ getDaysOld(item.createdAt) }} {{ $t('dueDiligence.daysOld') }})
                      </span>
                    </td>

                    <td :key="h.value + '_assignedTo'" v-else-if="h.value == 'assignedTo'" class="text-truncate">
                      {{ item.assignedToUser ? item.assignedToUser.firstName + ' ' + item.assignedToUser.lastName : '-' }}
                    </td>

                    <td :key="h.value + '_status'" v-else-if="h.value == 'status'">
                      <div class="d-flex">

                        <v-btn small rounded min-width="160" depressed class="blue-button" height="34"
                          v-if="item.status == 'Uploaded to EU Portal'">
                          <!-- getModulePermittedActions.put -->
                          {{ $t("deforestation.uploadedToEU") }}
                        </v-btn>

                        <v-btn small rounded min-width="160" depressed class="gray-button" height="34"
                          v-if="item.status == 'Pending'">
                          <!-- getModulePermittedActions.put -->
                          {{ $t("deforestation.pending") }}
                        </v-btn>
                        <v-btn small rounded min-width="160" depressed class="orange-button" height="34"
                          v-if="item.status == 'Under Review'">
                          <!-- getModulePermittedActions.put -->
                          {{ $t("deforestation.underReview") }}
                        </v-btn>

                        <v-btn small rounded min-width="160" depressed class="green-button" height="34"
                          v-if="item.status == 'Compliant'">
                          {{ $t("deforestation.compliant") }}
                        </v-btn>

                        <div class="status-with-action d-flex" v-if="item.status.toLowerCase() == 'processing farms'">
                          <v-btn small rounded min-width="160" depressed class="orange-button" height="34">
                            {{ $t("deforestation.processingFarm") }}
                          </v-btn>
                          &nbsp;
                          <v-btn v-on:click="handleRefreshDueDiligence" color="primary" fab outlined small>
                            <v-icon dark>mdi mdi-sync</v-icon>
                          </v-btn>
                        </div>

                        <div class="d-flex" v-if="item.status.toLowerCase() == 'analyzing deforestation'">
                          <v-btn small rounded min-width="160" depressed class="orange-button" height="34">
                            {{ $t("deforestation.analyzeDeforestation") }}
                          </v-btn>
                          &nbsp;
                          <v-btn v-on:click="handleRefreshDueDiligence" color="primary" fab outlined small>
                            <v-icon dark>mdi mdi-sync</v-icon>
                          </v-btn>
                        </div>

                        <v-btn small rounded min-width="160" depressed class="orange-button" height="34"
                          v-if="item.status.toLowerCase() == 'writing to blockchain'">
                          {{ $t("dueDiligence.writingToBlockchain") }}
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

                        <v-spacer></v-spacer>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <div v-bind="attrs" v-on="on">
                              <img class="ml-1"
                                :src="isIndonesianClient ? '/img/id/todo-list.svg' : isKenyaClient ? '/img/ke/todo-list.svg' : '/icons/todo-list.png'"
                                v-if="hideOnPrint === false"
                                style="width: 34px; height: 34px; border-radius: 50%;cursor:pointer"
                                @click="redirectToSummaryReport(item.id)" />
                            </div>
                          </template>
                          <span>{{ $t('dueDiligence.viewReport') }}</span>
                        </v-tooltip>

                        <template>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                              <div v-bind="attrs" v-on="on">
                                <img class="ml-1" :src="getStatusLegendIconWithRole(item.statusLegends, isDdsExporter)"
                                  style="width: 34px; height: 34px; border-radius: 50%;cursor:pointer" />
                              </div>
                            </template>
                            <span>{{ getStatusLegendTooltipWithRole(item.statusLegends, isDdsExporter) }}</span>
                          </v-tooltip>
                        </template>
                      </div>
                    </td>
                    <td :key="h.value + '_updatedAt'" v-else-if="h.value == 'updatedAt'" class="text-truncate">
                      {{ getDateFormat(item.updatedAt) }}
                    </td>
                    <td :key="h.value + '_action'" v-else-if="h.value == 'action'">
                      <div style="position: absolute; right: 50px; top:10px;">
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
                            <v-list-item
                              :disabled="!['Compliant', 'Non-Compliant', 'Processing  Farms'].includes(item.status)"
                              @click="redirectToDDSSUmmary(item.id)">
                              <v-list-item-title>{{ $t('dueDiligence.viewReportSummary') }}</v-list-item-title>
                            </v-list-item>
                            <!-- <v-list-item :disabled="item.status.startsWith('Processing')" @click="duplicateDiligenceReports(item.id)">
                                        <v-list-item-title>{{ $t('dueDiligence.copy') }}</v-list-item-title>
                                    </v-list-item> -->
                            <v-list-item
                              :disabled="item.status.startsWith('Processing') || getCurrentRoles.includes('supplier') || getCurrentRoles.includes('operator')"
                              @click="deleteDiligenceReports(item.id)">
                              <v-list-item-title>{{ $t('delete') }}</v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                        <!-- ### Commented by Kumar
                             <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                              <div v-bind="attrs" v-on="on">
                                <v-btn :disabled="item.status === 'Pending'" x-small fab color="primary" @click="
                                    $router.push({
                                      name: 'EudrAssessmentReport',
                                      params: { id: item.id, type: 'assignment' },
                                    })
                                    ">
                                    <v-icon>mdi-share</v-icon>
                                </v-btn>
                              </div>
                            </template>
                            <span>{{ $t('dueDiligence.share') }}</span>
                          </v-tooltip> -->
                      </div>
                    </td>
                  </template>
                </tr>
              </template>

              <template v-slot:footer></template>
            </v-data-table>

          </v-col>
        </v-row>
        <!-- Status Legend Section -->
        <StatusLegends :isDdsExporter="isDdsExporter" />
      </v-card-text>
    </v-card>

    <ConfirmBox :title="confirmDelete.title" :message="confirmDelete.message"
      :cancelBtnText="confirmDelete.cancelBtnText" :confirmBtnText="confirmDelete.confirmBtnText"
      :confirmData="confirmDelete.confirmData" :dialog="confirmDeleteDialog"
      @cancel:action="confirmDeleteDialog = false" @continue:action="confirmDeleteDiligenceReport" />

    <!-- Approval Confirmation Modal -->
    <ApprovalConfirmationModal :dialog="showApprovalModal" :selectedReportsCount="selectedReportsCount"
      :isTemporaryApproval="approvalModalData.isTemporaryApproval"
      :approvalExpirationValue="approvalModalData.approvalExpirationValue"
      :approvalExpirationUnit="approvalModalData.approvalExpirationUnit" @close="handleApprovalCancel"
      @confirm="handleApprovalConfirm" @update:isTemporaryApproval="approvalModalData.isTemporaryApproval = $event"
      @update:approvalExpirationValue="approvalModalData.approvalExpirationValue = $event"
      @update:approvalExpirationUnit="approvalModalData.approvalExpirationUnit = $event" />

    <!-- Rejection Confirmation Modal -->
    <RejectionConfirmationModal :dialog="showRejectionModal" :selectedReportsCount="selectedReportsCount"
      @close="handleRejectionCancel" @confirm="handleRejectionConfirm" />

    <!-- Assign Confirmation Modal -->
    <AssignConfirmationModal :dialog="showAssignModal" :selectedReportsCount="selectedReportsCount"
      :userOptions="assignedToOptions" @close="handleAssignCancel" @confirm="handleAssignConfirm" />

    <ProcessingModal :dialog="showPocessingModal" @close="showPocessingModal = false" />
  </div>
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import download from "@/mixins/DownloadMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import DateMixin from "@/mixins/DateMixin";
import DeforestationService from "@/_services/DeforestationService";
import UserListService from "@/_services/UserListService";
import ActivityLogService from "@/_services/ActivityLogService";
import { getCountries } from "country-state-picker";
import html2pdf from "html2pdf.js";
import printJS from "print-js";
import ConfirmBox from "@/components/ConfirmBox";
import moment from 'moment';
//import ProfileService from "@/_services/ProfileService";
import UnitService from "@/_services/UnitService";
import RoleMixin from "@/mixins/RoleMixin";
import { mapGetters } from "vuex";
import { currentRoles } from "@/utils";
import { isIndonesianClient, isDdsExporter, isKenyaClient } from "@/utils";
import ApprovalConfirmationModal from "./ApprovalConfirmationModal.vue";
import RejectionConfirmationModal from "./RejectionConfirmationModal.vue";
import ProcessingModal from "./modals/ProcessingModal.vue";
import AssignConfirmationModal from "./AssignConfirmationModal.vue";
import StatusLegends from "../../../components/StatusLegends.vue";
import { wait} from '@/utils.js';
import { PTSI_WORKER_ROLES, PTSI_ADMIN_ROLES, ALL_PTSI_ROLES } from "@/constants/roles";

export default {
  name: 'AdminDueDeligenceReportsComponent',
  props: {
    heroSearchData: {
      type: Object,
      default: () => ({})
    },
    cooperativeId: {
      type: [String, Number],
      default: null
    },
    isInModal: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ConfirmBox,
    ApprovalConfirmationModal,
    RejectionConfirmationModal,
    AssignConfirmationModal,
    StatusLegends,
    ProcessingModal,
  },
  created() {
    if (!this.isInModal) {
      this.getDeforestationEUDR();
    }
  },
  async mounted() {
    this.tableHeaders = this.reportHeaders;
    localStorage.removeItem('DDS_TAB_DATA');
    await this.getEudrSettings();
    await this.fetchAssignedToList();
    await this.fetchExporterList();
    await this.fetchSupplierList();
    
    // Only fetch initial data if not in modal context
    // Modal will trigger data fetch via handleDashboardCardClick
    if (!this.isInModal) {
      await this.getDeforestationEUDR();
    }
  },
  watch: {
    selectedStatuses: {
      handler() {
        // Optimized condition: Allow immediate filter calls unless we're in modal setup phase
        if (!this.isInModal || this.modalInitialized) {
          this.filterData();
        }
      },
      deep: true,
    },
    selectedLegendsStatuses: {
      handler() {
        // Optimized condition: Allow immediate filter calls unless we're in modal setup phase
        if (!this.isInModal || this.modalInitialized) {
          this.filterData();
        }
      },
      deep: true,
    },
    heroSearchData: {
      handler(newData) {
        if (newData.isReportId) {
          this.handleHeroSearch(newData);
        }
      },
      immediate: true
    },
    cooperativeId: {
      handler(newCooperativeId) {
        // Only fetch data if cooperativeId is valid and not null/undefined
        if (newCooperativeId && newCooperativeId !== null && newCooperativeId !== undefined) {
          this.getDeforestationEUDR();
        }
      },
      immediate: false
    }
  },
  computed: {
    ...mapGetters("eudrDDS", ["getDdsUserRole"]),
    isIndonesianClient() {
      return isIndonesianClient();
    },
    isKenyaClient() {
      return isKenyaClient();
    },
    isDdsExporter() {
      return isDdsExporter();
    },
    isSupplierOwner() {
      return ["supplier_owner", "owner"].includes(
        this.getDdsUserRole
      );
    },
    isOwner() {
      return this.getCurrentRoles.some(x => ["operator_owner", "supplier_owner"].includes(x))
    },
    getOrganizationId() {
      return this.$store.getters.getUser?.user_organization?.id;
    },
    isPtsiPanelOnly(){
      return this.currentRoles?.some(role => PTSI_ADMIN_ROLES.includes(role))
    },
    isWorkerOnly(){
     return this.currentRoles?.some(role => PTSI_WORKER_ROLES.includes(role))
    },
    isOperator() {
      return this.getCurrentRoles.includes("operator_owner")
    },
    isOperatorOnly() {
      return this.getCurrentRoles.includes("operator")
    },
    isSupplierOnly() {
      return this.getCurrentRoles.includes("supplier")
    },
    isSupplier() {
      return this.getCurrentRoles.some(x => ["supplier_owner", "supplier"].includes(x))
    },
    selectedReportsCount() {
      return this.selectedReports.length;
    },
    selectedReportIds() {
      return this.selectedReports.map(report => report.id);
    },
    reportHeaders() {
      return this.allReportHeaders.map(x => {
        if(x.value == 'eudrAndInternalRefNo'){
           return {
            text: this.isKenyaClient ? this.$t("deforestation.internalRefNoKenya") : this.$t("deforestation.eudrAndInternalRefNo"),
            align: "start",
            value: "eudrAndInternalRefNo",
            class: "black--text",
            sortable: true,
            roles: ["operator_owner","supplier_owner",'supplier','operator',"dds_exporter",...ALL_PTSI_ROLES]
           }
        }else{
          return x
        }
      }).filter(header => {
        return !header.roles ||  this.getCurrentRoles?.some(x => header.roles.includes(x))
      });
    },
    filteredHeaders() {
      return this.tableHeaders.filter((header) => this.showActionsColumn || header.value !== "actions")
    },
    getSupplierFullName() {
      return (item) => {
        if (this.isSupplier) {
          return `${this.$store.getters.getUser.firstName || ''} ${this.$store.getters.getUser.lastName || ''}`.trim();
        }
        const firstName = item.supplier ? item.supplier?.firstName : '';
        const lastName = item.supplier ? item.supplier.lastName : '';
        return `${firstName || ''} ${lastName || ''}`.trim();
      };
    },
    dueDiligenceStatuses() {
      // Filter out any empty or invalid status values
      return this.allStatus.filter(status =>
        status && status.value && status.value.trim() !== '' &&
        status.name && status.name.trim() !== ''
      );
    },
    reportStatuses() {
      const statuses = [
        { name: this.$t('deforestation.pending'), value: 'pending' },
        { name: this.$t('deforestation.overdue'), value: 'overdue' },
        { name: this.$t('deforestation.updateRequired'), value: 'update_required' },
        { name: this.$t('deforestation.pendingApproval'), value: 'pending_approval' },
        { name: this.$t('deforestation.approved'), value: 'approved' },
        { name: this.$t('deforestation.temporaryApproved'), value: 'temporary_approved' },
        { name: this.$t('deforestation.rejected'), value: 'rejected' }
      ];

      // Filter out any empty or invalid status values
      return statuses.filter(status =>
        status && status.value && status.value.trim() !== '' &&
        status.name && status.name.trim() !== ''
      );
    },
    filteredExporterOptions() {
      if (!this.exporterSearch) return this.exporterOptions;
      
      const searchTerm = this.normalizeText(this.exporterSearch.trim());
      
      return this.exporterOptions.filter(option => {
        if (!option || !option.name) return false;
        
        // Normalize both strings for comparison (case-insensitive, diacritic-insensitive)
        const optionName = this.normalizeText(option.name.trim());
        return optionName.includes(searchTerm);
      });
    },
    filteredSupplierOptions() {
      if (!this.supplierSearch) return this.supplierOptions;
      
      const searchTerm = this.normalizeText(this.supplierSearch.trim());
      
      return this.supplierOptions.filter(option => {
        if (!option || !option.name) return false;
        
        const optionName = this.normalizeText(option.name.trim());
        return optionName.includes(searchTerm);
      });
    },
    filteredAssignedToOptions() {
      if (!this.assignedToSearch) return this.assignedToOptions;
      
      const searchTerm = this.normalizeText(this.assignedToSearch.trim());
      
      return this.assignedToOptions.filter(option => {
        if (!option || !option.name) return false;
        
        const optionName = this.normalizeText(option.name.trim());
        return optionName.includes(searchTerm);
      });
    },
    allExportersSelected() {
      return this.filteredExporterOptions.length > 0 && 
             this.filteredExporterOptions.every(option => 
               this.selectedExporters.includes(option.value)
             );
    },
    allSuppliersSelected() {
      return this.filteredSupplierOptions.length > 0 && 
             this.filteredSupplierOptions.every(option => 
               this.selectedSuppliers.includes(option.value)
             );
    },
    allAssignedToSelected() {
      const currentUser = this.$store.getters.getUser;
      const hasCurrentUser = currentUser && this.selectedAssignedTo.includes(currentUser.id);
      const hasAllFilteredOptions = this.filteredAssignedToOptions.length > 0 && 
             this.filteredAssignedToOptions.every(option => 
               this.selectedAssignedTo.includes(option.value)
             );
      return hasCurrentUser && hasAllFilteredOptions;
    },
    isAssignedToMeSelected() {
      const currentUser = this.$store.getters.getUser;
      return currentUser && this.selectedAssignedTo.includes(currentUser.id);
    },

  },
  data() {
    return {
      modalInitialized: false,
      onStatusMenuOpen: false,
      fromDiligenceReports: 0,
      toDiligenceReports: 0,
      countryModel: "",
      statusModel: "",
      regionModel: "",
      reportSearch: "",
      reportCountry: "",
      reportStatus: "",
      selectedStatuses: [],
      selectedLegendsStatuses: [],
      countries: [{ name: "All Countries" }, ...getCountries()],
      exporterOptions: [],
      supplierOptions: [],
      exporterSearch: "",
      supplierSearch: "",
      assignedToSearch: "",
      selectedExporters: [],
      selectedSuppliers: [],
      selectedAssignedTo: [],
      selectedReports: [],
      showApprovalModal: false,
      approvalModalData: {
        isTemporaryApproval: false,
        approvalExpirationValue: 30,
        approvalExpirationUnit: 'Days'
      },
      showRejectionModal: false,
      showPocessingModal:false,
      showAssignModal: false,
      assignedToOptions: [],
      allStatus: [
        {
          name: this.$t("deforestation.uploadedToEU"),
          value: "Uploaded to EU Portal",
        },
        { name: this.$t("deforestation.pending"), value: "Pending" },
        { name: this.$t("deforestation.underReview"), value: "Under Review" },
        { name: this.$t("deforestation.nonCompliant"), value: "Non-Compliant" },
        { name: this.$t("deforestation.compliant"), value: "Compliant" },
        { 'name': this.$t("deforestation.mitigationRequired"), value: 'Mitigation Required' },
      ],
      allRegions: [{ text: this.$t("deforestation.allRegions"), val: "" }],

      deforestationComplianceReports: [],
      copyReport: [],
      loading: true,
      totalDeforestationComplianceReports: 0,
      tab: 0,
      selectedItem: false,
      reportOptions: {
        itemsPerPage: 10,
        page: 1,
      },
      totalPages: 1,
      search: "",
      from: 0,
      to: 0,
      allReportHeaders: [
        {
          text: this.$t("deforestation.eudrAndInternalRefNo"),
          align: "start",
          value: "eudrAndInternalRefNo",
          class: "black--text",
          sortable: true,
          roles: [...ALL_PTSI_ROLES]
        },
        {
          text: this.$t("deforestation.supplier"),
          align: "start",
          value: "supplier.firstName",
          class: "black--text",
          sortable: true,
          roles: [...ALL_PTSI_ROLES]
        },
        {
          text: this.$t("deforestation.product"),
          align: "start",
          value: "product",
          class: "black--text",
          sortable: true,
          roles: [...ALL_PTSI_ROLES]
        },
        {
          text: this.$t("deforestation.submissionDate"),
          align: "start",
          value: "createdAt",
          class: "black--text",
          sortable: true,
          roles: [...ALL_PTSI_ROLES]
        },
        {
          text: this.$t("deforestation.assignTo"),
          align: "start",
          value: "assignedTo",
          class: "black--text",
          sortable: true,
          roles: [...ALL_PTSI_ROLES]
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
          value: "status",
          class: "black--text",
          sortable: true,
          roles: [...ALL_PTSI_ROLES]
        },
        // {
        //   text: '',
        //   align: "center",
        //   value: "action",
        //   class: "black--text",
        //   sortable: false,
        //   width: "150px",
        //   roles: ["indonesia_ptsi"]
        // },
      ],
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: false,
          to: { name: "Users" },
          exact: true,
        },
        {
          text: this.$t("deforestation.eudrDueDeligenceReports"),
          disabled: true,
          href: "breadcrumbs_link_1",
        },
      ],
      diligenceReports: [],
      totalDiligenceReports: 0,
      totalDiligenceReportsPages: 0,
      showActionsColumn: true,
      selectedHeaders: [],
      tableHeaders: [],
      itemsPerPageOptions: [5, 10, 25, 50],
      itemsPerPageSlider: 10,
      customizeMenu: false,
      customizeMenuAll: false,
      hideOnPrint: false,
      confirmDeleteDialog: false,
      confirmDelete: {
        title: this.$t("confirmDialog.dueDiligenceReport.delete.title"),
        message: this.$t("confirmDialog.dueDiligenceReport.delete.message"),
        confirmBtnText: this.$t("confirmDialog.dueDiligenceReport.delete.confirmBtn"),
        cancelBtnText: this.$t("cancel"),
        confirmData: {},
      },
      allSelectedHeaders: [
        this.$t("deforestation.eudrAndInternalRefNo"),
        this.$t("deforestation.supplier"),
        this.$t("deforestation.product"),
        this.$t("deforestation.assignTo"),
      ],
      eudrSettings: {},
      
      // Additional filters from dashboard
      filterType: null, // 'today', 'week', 'month', 'year', 'all', or 'custom'
      startDate: null, // Start date for custom date range
      endDate: null, // End date for custom date range
      selectedProducts: [], // Selected product IDs
    };
  },
  methods: {
    clearReportsData() {
      // Clear all report-related data to prevent stale content
      this.diligenceReports = [];
      this.totalDiligenceReports = 0;
      this.totalDiligenceReportsPages = 0;
      this.deforestationComplianceReports = [];
      this.totalDeforestationComplianceReports = 0;
      this.fromDiligenceReports = 0;
      this.toDiligenceReports = 0;
      this.loading = true;
      
      // Clear additional filters
      this.filterType = null;
      this.startDate = null;
      this.endDate = null;
      this.selectedProducts = [];
    },
    handleDashboardCardClick(cardData) {
      // Clear existing data first to prevent stale content
      this.clearReportsData();
      
      // Handle dashboard card click to filter reports
      const { statuses, statusLegends, assignedToMe, cardTitle, filterType, startDate, endDate, products } = cardData;
      
      // Set due diligence status filters
      if (statuses && statuses.length > 0) {
        this.selectedStatuses = [...statuses];
      } else {
        this.selectedStatuses = [];
      }
      
      // Set report status legend filters
      if (statusLegends && statusLegends.length > 0) {
        this.selectedLegendsStatuses = [...statusLegends];
      } else {
        this.selectedLegendsStatuses = [];
      }
      
      // Handle "Assigned to Me" filter
      if (assignedToMe) {
        // Use the same logic as toggleAssignedToMe method
        const currentUser = this.$store.getters.getUser;
        if (currentUser && currentUser.id) {
          this.selectedAssignedTo = [currentUser.id];
        }
      } else {
        // Clear assigned to filter for other cards
        this.selectedAssignedTo = [];
      }
      
      // Set additional filters from dashboard
      this.filterType = filterType || null;
      this.startDate = startDate || null;
      this.endDate = endDate || null;
      this.selectedProducts = products ? [...products] : [];
      
      this.getDeforestationEUDR();
      this.modalInitialized = true;
      
      // Check if $toast is available before calling it
      if (this.$toast && this.$toast.info) {
        this.$toast.info(`Filtered by: ${cardTitle}`);
      } else {
        console.log(`Filtered by: ${cardTitle}`);
      }
    },
    getStatusLegendIcon(statusLegend) {
      const iconMap = {
        'pending': '/icons/dds/pending.svg',
        'overdue': '/icons/dds/overdue.svg',
        'update_required': '/icons/dds/updaterequired.svg',
        'pending_approval': '/icons/dds/pendingApproval.svg',
        'approved': '/icons/dds/ptsiapproved.svg',
        'temporary_approved': '/icons/dds/temporaryApproved.svg',
        'rejected': '/icons/dds/rejected.svg'
      };

      return iconMap[statusLegend] || iconMap[statusLegend?.toLowerCase()] || '/icons/dds/pending.svg';
    },
    getStatusLegendTooltip(statusLegend) {
      const tooltipMap = {
        'pending': this.$t("deforestation.pendingOrNewlyReceived"),
        'overdue': this.$t("deforestation.overdue"),
        'update_required': this.$t("deforestation.updateRequired"),
        'pending_approval': this.$t("deforestation.pendingApproval"),
        'approved': this.$t("deforestation.approved"),
        'temporary_approved': this.$t("deforestation.temporaryApproved"),
        'rejected': this.$t("deforestation.rejected")
      };

      return tooltipMap[statusLegend] || tooltipMap[statusLegend?.toLowerCase()] || this.$t("deforestation.pendingOrNewlyReceived");
    },
    getStatusLegendIconWithRole(statusLegend, isDdsExporter) {
      if (statusLegend && statusLegend.toLowerCase() === 'pending' && !isDdsExporter) {
        return '/icons/dds/sent.svg';
      }

      return this.getStatusLegendIcon(statusLegend);
    },
    getStatusLegendTooltipWithRole(statusLegend, isDdsExporter) {
      if (statusLegend && statusLegend.toLowerCase() === 'pending' && !isDdsExporter) {
        return this.$t("deforestation.sentToExporter");
      }
      return this.getStatusLegendTooltip(statusLegend);
    },
    showAllDownloads() {
      this.$router.push({ name: "DownloadHistory" });
    },
    async handleRefreshDueDiligence() {
      this.getDeforestationEUDR()
    },
    async exportToPDF() {
      const requestParams = {
        page: this.reportOptions.page,
        limit: this.reportOptions.itemsPerPage,
        searchPhrase: this.reportSearch,
        country: this.reportCountry,
      };
      const querys = new URLSearchParams(requestParams).toString();
      const token = this.$store.state.auth.token
      this.startLoading()
      const url = process.env.VUE_APP_DEFORESTRATION_API_BASE_URL || "http://localhost:4043/api"
      this.downloadSourceFileWithToken(`${url}/diligence-report/diligence-report-pdf?${querys}`, "application/pdf", token, "diligence-reports.pdf")
        .then(() => {
          this.stopLoading()
        }).catch(() => {
          this.stopLoading()
        })
    },
    getConvertedMass(value) {
      return this.eudrSettings && UnitService.fromBase.weight(this.eudrSettings.product_mass_unit, value)
    },
    async getEudrSettings() {
      try {
        const { data } = await DeforestationService.getEudrSettings();
        this.eudrSettings = data.eudrSetting;
      } catch (err) {
        this.$notify({
          text: this.$t('deforestation.failedToFetchSettings'),
          type: 'error'
        })
      }
    },
    async printPDF() {
      this.showActionsColumn = false;
      this.hideOnPrint = true;
      await this.$nextTick();
      const element = document.querySelector(".v-data-table__wrapper");
      let opt = {
        margin: 1,
        filename: "DiligenceReport.pdf",
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

      this.showActionsColumn = true; // restore the column;
      this.hideOnPrint = false;
    },
    async resetDefaut() {
      this.tableHeaders = this.reportHeaders;
      this.selectedHeaders = this.reportHeaders;
      this.menu = false;
      await this.getDeforestationEUDR();
    },

    getDateFormat(date) {
      return moment(date).format("DD-MMM-YYYY");
    },

    getDaysOld(date) {
      const now = moment();
      const createdDate = moment(date);
      const daysOld = now.diff(createdDate, 'days');
      return daysOld;
    },

    redirectToDDSSUmmary(reportId) {
      this.$router.push({
        name: 'ViewDDSSummary',
        params: { id: reportId }
      })
    },
    redirectToSummaryReport(reportId) {
      this.$router.push({
        name: 'viewSummaryReport',
        params: { id: reportId }
      })
    },
    handleCreateReport() {
      this.$store.dispatch('SET_DDS_TAB', {
        activeTab: 1
      }).then(() => {
        this.$router.push({ name: 'createDueDiligenceReports' })
      })
    },
    async filterData() {
      this.reportOptions.page = 1;
      
      this.getDeforestationEUDR();
      
      const userId = this.$store.getters.getUser?.id;
      if (userId) {
        const filterDetails = [];
        if (this.reportCountry) filterDetails.push(`Country: ${this.reportCountry}`);
        if (this.reportExporter) filterDetails.push(`Exporter: ${this.reportExporter}`);
        if (this.reportSupplier) filterDetails.push(`Supplier: ${this.reportSupplier}`);
        if (this.reportAssignedTo) filterDetails.push(`Assigned To: ${this.reportAssignedTo}`);
        if (this.selectedStatuses.length > 0) filterDetails.push(`Statuses: ${this.selectedStatuses.join(', ')}`);
        if (this.selectedLegendsStatuses.length > 0) filterDetails.push(`Legends: ${this.selectedLegendsStatuses.join(', ')}`);
        
        if (filterDetails.length > 0) {
          ActivityLogService.logDDSReportFilterApplied(
            'bulk', // Use 'bulk' for multiple reports
            userId,
            'Multiple Filters',
            filterDetails.join('; ')
          ).catch(error => {
            console.warn('Failed to log filter activity:', error);
          });
        }
      }
    },
    
    async searchQuery() {
      this.reportOptions.page = 1;
      
      this.getDeforestationEUDR();
      
      const userId = this.$store.getters.getUser?.id;
      if (userId && this.reportSearch) {
        ActivityLogService.logDDSReportSearchPerformed(
          'bulk', // Use 'bulk' for multiple reports
          userId,
          this.reportSearch
        ).catch(error => {
          console.warn('Failed to log search activity:', error);
        });
      }
    },
    // New filter methods for dropdowns
    filterByExporter() {
      this.reportOptions.page = 1;
      this.getDeforestationEUDR();
    },
    filterBySupplier() {
      this.reportOptions.page = 1;
      this.getDeforestationEUDR();
    },
    filterByAssignedTo() {
      this.reportOptions.page = 1;
      this.getDeforestationEUDR();
    },
    // New button action methods
    handleBulkActions() {
      if (this.selectedReportIds.length === 0) {
        this.$notify({
          text: 'Please select reports to perform bulk actions',
          type: 'warning'
        });
        return;
      }
    },
    handleAssignReports() {
      if (this.selectedReportIds.length === 0) {
        this.$notify({
          text: 'Please select reports to assign',
          type: 'warning'
        });
        return;
      }
      this.showAssignModal = true;
    },
    handleAssignCancel() {
      this.showAssignModal = false;
    },
    async handleAssignConfirm(assignData) {
      try {
        this.loading = true;

        const input = {
          reportIds: this.selectedReportIds.map(id => parseInt(id, 10)),
          assignedTo: parseInt(assignData.selectedUserId, 10)
        };

        const response = await DeforestationService.bulkAssignReports(input);


        if (response && response.data && response.data.bulkAssignReports) {
          if (response.data.bulkAssignReports.success) {
            // Log successful bulk assignment
            const userId = this.$store.getters.getUser?.id;
            if (userId) {
              await ActivityLogService.logDDSBulkReportsAssigned(
                this.selectedReportIds[0], // Use first report ID for logging
                userId,
                parseInt(assignData.selectedUserId, 10),
                assignData.selectedUserName || 'Unknown User',
                response.data.bulkAssignReports.processedCount
              );
            }

            this.$notify({
              text: response.data.bulkAssignReports.message || `Successfully assigned ${response.data.bulkAssignReports.processedCount} report(s)`,
              type: 'success'
            });

            if (response.data.bulkAssignReports.failedReportIds && response.data.bulkAssignReports.failedReportIds.length > 0) {
              this.$notify({
                text: `Failed to assign ${response.data.bulkAssignReports.failedReportIds.length} reports`,
                type: 'warning'
              });
            }

            // Clear selection and refresh the reports list
            this.clearSelection();
            this.getDeforestationEUDR();
          } else {
            // Log failed assignment
            const userId = this.$store.getters.getUser?.id;
            if (userId) {
              await ActivityLogService.logDDSReportAssignmentFailed(
                this.selectedReportIds[0], // Use first report ID for logging
                userId,
                parseInt(assignData.selectedUserId, 10),
                assignData.selectedUserName || 'Unknown User',
                response.data.bulkAssignReports.message || 'Unknown error'
              );
            }

            this.$notify({
              text: response.data.bulkAssignReports.message || 'Failed to assign reports',
              type: 'error'
            });
          }
        } else {
          console.error('Unexpected response structure:', response);
          this.$notify({
            text: 'Unexpected response from server',
            type: 'error'
          });
        }
      } catch (error) {
        console.error('Error assigning reports:', error);
        this.$notify({
          text: 'An error occurred while assigning reports',
          type: 'error'
        });
      } finally {
        this.loading = false;
        this.showAssignModal = false;
      }
    },
    handleApproveReports() {
      if (this.selectedReportIds.length === 0) {
        this.$notify({
          text: 'Please select reports to approve',
          type: 'warning'
        });
        return;
      }
      // Show the approval confirmation modal
      this.showApprovalModal = true;
    },
    handleApprovalCancel() {
      this.showApprovalModal = false;
      // Reset modal data to defaults
      this.approvalModalData = {
        isTemporaryApproval: false,
        approvalExpirationValue: 30,
        approvalExpirationUnit: 'Days'
      };
    },
    async handleApprovalConfirm(approvalData) {
      try {
        this.loading = true;
        const input = {
          reportIds: this.selectedReportIds.map(id => parseInt(id, 10)),
          isTemporaryApproval: approvalData.isTemporaryApproval
        };

        // Add expiration fields only if it's a temporary approval
        if (approvalData.isTemporaryApproval) {
          input.approvalExpirationValue = approvalData.approvalExpirationValue;
          input.approvalExpirationUnit = approvalData.approvalExpirationUnit;
        }
        const response = await DeforestationService.bulkApproveReports(input);
        const responseData = response?.data.bulkApproveReports
        console.log('Bulk approve response:', responseData);

        if (response && response.data && response.data.bulkApproveReports) {
          if (response.data.bulkApproveReports.success) {
            // Log successful bulk approval
            const userId = this.$store.getters.getUser?.id;
            if (userId) {
              await ActivityLogService.logDDSBulkReportsApproved(
                this.selectedReportIds[0], // Use first report ID for logging
                userId,
                approvalData.isTemporaryApproval ? 'temporary' : 'permanent',
                response.data.bulkApproveReports.processedCount
              );
            }
          }
        }
        if(responseData?.jobs){
          this.$notify({
            text: 'The approval has been successfully completed. Writing to blockchain may take a few minutes.',
            type: 'info'
          });
          await this.getDeforestationEUDR();
          this.loading = false;
        }

        let job = responseData.jobs;
        let stopWaiting = false;
        this.showPocessingModal = true;

        const timeout = setTimeout(() => {
          stopWaiting = true;
          this.showPocessingModal = false;
          this.$notify({
            text: 'Writing deforestation data to blockchain is taking longer than expected. You can continue working and check the status later in the Job History section.',
            type: 'warning'
          });
        }, 50000); // 80 seconds

        while (!stopWaiting && this.showPocessingModal) {
          await wait(8000);
          const jobIDS = job.map(j => parseInt(j.id)); 
          const response = await DeforestationService.getJobs(jobIDS);

          if (!response?.data?.getJobs?.length) {
            this.$notify({
              text: 'Failed to write deforestation data to blockchain, please try again.',
              type: 'error'
            });
          }

          const allCompleted = response.data.getJobs.every(j => j.status === 'Completed' || j.status === 'Failed');
          if (allCompleted) {
            clearTimeout(timeout);
            await wait(1500);
            this.showPocessingModal = false;
            await this.getDeforestationEUDR();
            this.$notify({
              text: 'Report Successfully Approved & Written to Blockchain',
              type: 'success'
            });
            break;
          }
          // if modal was closed manually during wait, stop the loop
          if (!this.showPocessingModal) break;
        }
        clearTimeout(timeout);
      } catch (error) {
        console.error('Error approving reports:', error);
        this.$notify({
          text: 'An error occurred while approving reports',
          type: 'error'
        });
      } finally {
        this.loading = false;
        // Close modal and clear selection
        this.showApprovalModal = false;
        this.selectedReports = [];
      }
    },
    handleRejectReports() {
      if (this.selectedReportIds.length === 0) {
        this.$notify({
          text: 'Please select reports to reject',
          type: 'warning'
        });
        return;
      }
      this.showRejectionModal = true;
    },
    handleApproveModal(){
       this.showPocessingModal = true;
    },
    handleRejectionCancel() {
      this.showRejectionModal = false;
    },
    async handleRejectionConfirm(rejectionData) {
      try {
        this.loading = true;

        const input = {
          reportIds: this.selectedReportIds.map(id => parseInt(id, 10)),
          reason: rejectionData.reason
        };

        const response = await DeforestationService.bulkRejectReports(input);


        if (response && response.data && response.data.bulkRejectReports) {
          if (response.data.bulkRejectReports.success) {
            // Log successful bulk rejection
            const userId = this.$store.getters.getUser?.id;
            if (userId) {
              await ActivityLogService.logDDSBulkReportsRejected(
                this.selectedReportIds[0], // Use first report ID for logging
                userId,
                rejectionData.reason,
                response.data.bulkRejectReports.processedCount
              );
            }

            this.$notify({
              text: response.data.bulkRejectReports.message || `Successfully rejected ${response.data.bulkRejectReports.processedCount} reports`,
              type: 'success'
            });

            if (response.data.bulkRejectReports.failedReportIds && response.data.bulkRejectReports.failedReportIds.length > 0) {
              this.$notify({
                text: `Failed to reject ${response.data.bulkRejectReports.failedReportIds.length} reports`,
                type: 'warning'
              });
            }

            // Clear selection and refresh the reports list
            this.clearSelection();
            this.getDeforestationEUDR();
          } else {
            // Log failed rejection
            const userId = this.$store.getters.getUser?.id;
            if (userId) {
              await ActivityLogService.logDDSReportRejectionFailed(
                this.selectedReportIds[0], // Use first report ID for logging
                userId,
                response.data.bulkRejectReports.message || 'Unknown error'
              );
            }

            this.$notify({
              text: response.data.bulkRejectReports.message || 'Failed to reject reports',
              type: 'error'
            });
          }
        } else {
          console.error('Unexpected response structure:', response);
          this.$notify({
            text: 'Unexpected response from server',
            type: 'error'
          });
        }
      } catch (error) {
        console.error('Error rejecting reports:', error);
        this.$notify({
          text: 'An error occurred while rejecting reports',
          type: 'error'
        });
      } finally {
        this.loading = false;
        this.showRejectionModal = false;
      }
    },
    clearSelection() {
      this.selectedReports = [];
    },
    handleCreateNewReport() {
      this.$router.push({ name: 'createDueDiligenceReports' });
    },
    selectAllExporters() {
      if (this.allExportersSelected) {
        // Remove all filtered exporter IDs from selection
        const filteredIds = this.filteredExporterOptions.map(item => item.value);
        this.selectedExporters = this.selectedExporters.filter(id => !filteredIds.includes(id));
      } else {
        // Add all filtered exporter IDs to selection
        const filteredIds = this.filteredExporterOptions.map(item => item.value).filter(v => v !== '');
        const uniqueIds = [...new Set([...this.selectedExporters, ...filteredIds])];
        this.selectedExporters = uniqueIds;
      }
      this.filterData();
    },
    selectAllSuppliers() {
      if (this.allSuppliersSelected) {
        // Remove all filtered supplier IDs from selection
        const filteredIds = this.filteredSupplierOptions.map(item => item.value);
        this.selectedSuppliers = this.selectedSuppliers.filter(id => !filteredIds.includes(id));
      } else {
        // Add all filtered supplier IDs to selection
        const filteredIds = this.filteredSupplierOptions.map(item => item.value).filter(v => v !== '');
        const uniqueIds = [...new Set([...this.selectedSuppliers, ...filteredIds])];
        this.selectedSuppliers = uniqueIds;
      }
      this.filterData();
    },
    selectAllAssignedTo() {
      const currentUser = this.$store.getters.getUser;
      
      if (this.allAssignedToSelected) {
        // Remove all filtered assigned-to IDs and current user from selection
        const filteredIds = this.filteredAssignedToOptions.map(item => item.value);
        const idsToRemove = currentUser ? [...filteredIds, currentUser.id] : filteredIds;
        this.selectedAssignedTo = this.selectedAssignedTo.filter(id => !idsToRemove.includes(id));
      } else {
        // Add all filtered assigned-to IDs and current user to selection
        const filteredIds = this.filteredAssignedToOptions.map(item => item.value).filter(v => v !== '');
        const idsToAdd = currentUser ? [...filteredIds, currentUser.id] : filteredIds;
        const uniqueIds = [...new Set([...this.selectedAssignedTo, ...idsToAdd])];
        this.selectedAssignedTo = uniqueIds;
      }
      this.filterData();
    },
    toggleAssignedToMe() {
      const currentUser = this.$store.getters.getUser;
      if (currentUser && currentUser.id) {
        if (this.selectedAssignedTo.includes(currentUser.id)) {
          // Remove current user from selection
          this.selectedAssignedTo = this.selectedAssignedTo.filter(id => id !== currentUser.id);
        } else {
          // Add current user to selection
          this.selectedAssignedTo = [...this.selectedAssignedTo, currentUser.id];
        }
        this.filterData();
      }
    },
    handleHeroSearch(searchData) {
      if (searchData.isReportId) {
        // For reports, search by internalReferenceNumber using searchPhrase
        this.reportSearch = searchData.value;
        this.searchPhrase = searchData.value; // Use searchPhrase for internalReferenceNumber search
      } else {
        // For general search, use searchPhrase
        this.searchPhrase = searchData.value;
      }
      this.reportOptions.page = 1;
      this.getDeforestationEUDR();
    },
    normalizeText(text) {
      if (!text) return '';
      // Convert to lowercase and remove diacritics/accents
      return text.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
    },
    async getDeforestationEUDR(opt = null) {
      this.loading = true;
      const requestParams = {
        page: this.reportOptions.page,
        limit: this.reportOptions.itemsPerPage,
        searchPhrase: this.reportSearch,
        country: this.reportCountry,
        cfroles: currentRoles(),
        statuses: this.selectedStatuses,
        statusLegendsArray: this.selectedLegendsStatuses,
        isPtsiApproval: true,
        cooperativeId: this.cooperativeId,
      };

      // Add additional filters from dashboard
      if (this.filterType) {
        requestParams.filterType = this.filterType;
      }
      if (this.startDate) {
        requestParams.startDate = this.startDate;
      }
      if (this.endDate) {
        requestParams.endDate = this.endDate;
      }
      if (this.selectedProducts && this.selectedProducts.length > 0) {
        requestParams.products = this.selectedProducts;
      }

      // Add exporter, supplier, and assignedTo filters
      if (this.selectedExporters && this.selectedExporters.length > 0) {
        const validExporterIds = this.selectedExporters.filter(id => id != null && id !== undefined && id !== '');
        if (validExporterIds.length > 0) {
          requestParams.exporterIds = validExporterIds;
        }
      }
      if (this.selectedSuppliers && this.selectedSuppliers.length > 0) {
        const validSupplierIds = this.selectedSuppliers.filter(id => id != null && id !== undefined && id !== '');
        if (validSupplierIds.length > 0) {
          requestParams.supplierIds = validSupplierIds;
        }
      }
      // Handle "Assigned to me" filter and user assignments
      if (this.allAssignedToSelected) {
        // When "All" is selected, send both assignedToMe: true and all user IDs
        requestParams.assignedToMe = true;
        const validAssignedToIds = this.selectedAssignedTo.filter(id => id != null && id !== undefined && id !== '');
        if (validAssignedToIds.length > 0) {
          requestParams.assignedToIds = validAssignedToIds;
        }
      } else {
        // Handle "Assigned to me" filter
        if (this.isAssignedToMeSelected) {
          requestParams.assignedToMe = true;
          // When assignedToMe is true, don't include assignedToIds
        } else {
          // Handle specific user assignments only when assignedToMe is not selected
          if (this.selectedAssignedTo && this.selectedAssignedTo.length > 0) {
            const currentUser = this.$store.getters.getUser;
            // Filter out current user ID from assignedToIds when assignedToMe is not selected
            const validAssignedToIds = this.selectedAssignedTo.filter(id => 
              id != null && id !== undefined && id !== '' && 
              (!currentUser || id !== currentUser.id)
            );
            if (validAssignedToIds.length > 0) {
              requestParams.assignedToIds = validAssignedToIds;
            }
          }
        }
      }
      if (this.searchPhrase) {
        requestParams.searchPhrase = this.searchPhrase;
      }

      // Add role-based filtering
      if (this.isOperatorOnly) {
        requestParams.operatorId = this.$store.getters.getUser.id;
      }
      if (this.isSupplierOnly) {
        requestParams.supplierId = this.$store.getters.getUser.id;
      }

      if (opt?.sortBy?.length) {
        requestParams.orderField = opt.sortBy[0];
        requestParams.order = opt.sortDesc[0] ? "DESC" : "ASC";
      }
      DeforestationService.getDiligenceReports(requestParams)
        .then((res) => {
          this.diligenceReports = res.data.diligenceReports.rows;
          this.totalDiligenceReports = res.data.diligenceReports.totalCount;
          this.totalPages = Math.ceil(this.totalDiligenceReports / this.reportOptions.itemsPerPage)

          this.fromDiligenceReports = (((this.reportOptions.page - 1) * this.reportOptions.itemsPerPage) + 1)
          this.toDiligenceReports = (this.reportOptions.page * this.reportOptions.itemsPerPage) - (this.reportOptions.itemsPerPage - res.data.diligenceReports.rows.length)

          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          console.log("Error", err);
        });
    },
    async deleteDiligenceReports(id) {
      this.confirmDelete.confirmData = { id };
      this.confirmDeleteDialog = true;
    },
    async confirmDeleteDiligenceReport(action, confirmData) {
      this.loading = true;

      DeforestationService.deleteDiligenceReport(parseInt(confirmData.id))
        .then(async () => {
          // Log successful report deletion
          const userId = this.$store.getters.getUser?.id;
          if (userId) {
            await ActivityLogService.logDDSReportDeleted(
              parseInt(confirmData.id),
              userId,
              `Report deleted by user`
            );
          }

          this.getDeforestationEUDR();
          this.$notify({
            text: this.$t("deforestation.reportDeletedSuccessfully"),
            type: "success",
          });
          this.loading = false;
          this.confirmDeleteDialog = false;

        })
        .catch(async (err) => {
          // Log failed report deletion
          const userId = this.$store.getters.getUser?.id;
          if (userId) {
            await ActivityLogService.logDDSReportDeleted(
              parseInt(confirmData.id),
              userId,
              `Failed to delete report: ${err}`
            );
          }

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
        .then(async () => {
          // Log successful report duplication
          const userId = this.$store.getters.getUser?.id;
          if (userId) {
            await ActivityLogService.logDDSReportDuplicated(
              parseInt(id),
              userId,
              parseInt(id)
            );
          }

          this.getDeforestationEUDR();
          this.loading = false;
        })
        .catch(async (err) => {
          this.loading = false;
          this.$notify({
            text: err,
            type: "error",
          });
          console.log("Error", err);
        });
    },

    selectItem(item) {
      this.selectedItem = item;
    },
    resetSearchOnEmpty() {
      this.search = "";
      this.countryModel = "";
      this.statusModel = "";
      this.regionModelregionModel = "";
      this.options = {
        page: 1,
        limit: 10,
      };
      this.getDeforestationEUDR();
    },
    async reportPageChange(t) {
      if (t) this.reportOptions.page = this.reportOptions.page + 1;
      else this.reportOptions.page = this.reportOptions.page - 1;
      this.getDeforestationEUDR();
    },
    navigateReportView(item) {
      let additionalInfoQuery = {};
      if (item?.requestAdditionalInformation) {
        if (this.$store.getters.getUser.id == item?.requestAdditionalInformation?.[0]?.cfUserId) {
          additionalInfoQuery = {
            ddrAdditionalInformationId: item.requestAdditionalInformation[0].id,
          };
          this.$store.dispatch('eudrDDS/setDdsAdditionalInformationData', {
            ddrId: item.id,
            ddrAdditionalInformationId: parseInt(item.requestAdditionalInformation[0].id)
          });
        }
      }

      const queryParams = additionalInfoQuery.ddrAdditionalInformationId ? { query: additionalInfoQuery } : {};

      if (item.status == 'Pending' || item.status.toLowerCase() == 'under review') {
        this.$router.push({
          name: 'createDueDiligenceReports',
          params: { id: item.id, show: 'show' },
          ...queryParams
        });
      } else if (item.status.toLowerCase() == 'ready to proceed') {
        const tabd = JSON.parse(localStorage.getItem('DDS_TAB_DATA'));
        const activeTb = tabd ? (tabd.activeTab == 2 ? 3 : 4) : Number(item.current_step) || 3;
        if (activeTb) {
          this.$store.dispatch('SET_DDS_TAB', { activeTab: activeTb }).then(() => {
            this.$router.push({
              name: 'createDueDiligenceReports',
              params: { id: item.id, show: 'show' },
              ...queryParams
            });
          });
        } else {
          this.$router.push({
            name: 'createDueDiligenceReports',
            params: { id: item.id, show: 'show' },
            ...queryParams
          });
        }
      } else if (item.status == 'Non-Compliant') {

        const finalReportTab = Number(localStorage.getItem('DDS_TAB_LENGTH')) || 6
        this.$store.dispatch('SET_DDS_TAB', { activeTab: finalReportTab }).then(() => {
          this.$router.push({
            name: 'createDueDiligenceReports',
            params: { id: item.id, show: 'non-complaint' },
            ...queryParams
          });
        });
      } else if (item.status == 'Compliant') {

        const finalReportTab = Number(localStorage.getItem('DDS_TAB_LENGTH')) || 6
        this.$store.dispatch('SET_DDS_TAB', { activeTab: finalReportTab }).then(() => {
          this.$router.push({
            name: 'createDueDiligenceReports',
            params: { id: item.id, show: 'complaint' },
            ...queryParams
          });
        });
      }
    },

    async fetchAssignedToList() {
      try {
        const response = await UserListService.getAssignedToList();
        const data = response?.data?.rows || [];
        if (data && Array.isArray(data)) {
          this.assignedToOptions = data.map(user => ({
            name: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            value: user.id
          }));
        }
      } catch (error) {
        console.error('Error fetching assigned to list:', error);
        this.$notify({
          text: 'Failed to fetch assigned users list',
          type: 'error'
        });
      }
    },

    async fetchExporterList() {
      try {
        const response = await UserListService.getExporterList();
        const data = response?.data?.rows || [];
        
        if (data && Array.isArray(data)) {
          this.exporterOptions = data
            .filter(user => user && user.id) // Filter out users with null/undefined IDs
            .map(user => {
              const name = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim();
              return {
                name: name,
                value: user.id
              };
            });
        }
      } catch (error) {
        console.error('Error fetching exporter list:', error);
        this.$notify({
          text: 'Failed to fetch exporters list',
          type: 'error'
        });
      }
    },

    async fetchSupplierList() {
      try {
        // Dynamic role checking - determine which roles to query based on user context
        const rolesToQuery = [];
        
        // Always include supplier_owner as it's the primary supplier role
        rolesToQuery.push('supplier_owner');
        
        // Check if we should include indonesia_admin based on user context
        // This could be based on user's organization, country, or other business logic
        const user = this.$store.getters.getUser;
        const userOrganization = user?.user_organization;
        
        // Add indonesia_admin if user is in Indonesian context or if it's needed for the current organization
        if (userOrganization?.country === 'Indonesia' || 
            userOrganization?.name?.toLowerCase().includes('indonesia') ||
            this.isIndonesianContext()) {
          rolesToQuery.push('indonesia_admin');
        }
        
        const requestParams = {
          page: 1,
          limit: 1000 // Get all suppliers
        };
        
        const response = await DeforestationService.getUserListByMultipleRoles(requestParams, rolesToQuery);
        const data = response?.data?.rows || [];
        
        if (data && Array.isArray(data)) {
          this.supplierOptions = data
            .filter(user => user && user.id) // Filter out users with null/undefined IDs
            .map(user => {
              const name = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim();
              return {
                name: name,
                value: user.id
              };
            });
        }
      } catch (error) {
        console.error('Error fetching supplier list:', error);
        this.$notify({
          text: 'Failed to fetch suppliers list',
          type: 'error'
        });
      }
    },

    // Helper method to determine if we're in Indonesian context
    isIndonesianContext() {
      const user = this.$store.getters.getUser;
      const userOrganization = user?.user_organization;
      
      // Check various indicators for Indonesian context
      return userOrganization?.country === 'Indonesia' ||
             userOrganization?.name?.toLowerCase().includes('indonesia') ||
             user?.country === 'Indonesia';
    }

  },
  mixins: [loadingMixin, download, getPermittedActions, DateMixin, RoleMixin],
};
</script>
<style lang="scss" scoped>
::v-deep .v-data-table__wrapper {
  margin-top: -16px !important;
}

.download-history {
  padding-bottom: 22px;
}

.blue-button {
  background-color: #d0e6fe !important;
  /* Green background */
  border: 2px solid #002287 !important;
  /* Red border */
  color: #002287 !important;
}

.orange-button {
  background-color: #fff7ec !important;
  /* Green background */
  border: 2px solid #ffa826 !important;
  /* Red border */
  color: #ffa826 !important;
}

::v-deep .wdt.v-text-field {
  width: 250px;
}

::v-deep .v-tab:hover {
  background-color: #caf1e2;
  color: $primary_color !important;
}

/* Dropdown search field styling */
::v-deep .v-list-item .v-text-field {
  width: 100% !important;
  margin: 8px 0 !important;
}

::v-deep .v-list-item .v-text-field .v-input__control {
  width: 100% !important;
}

::v-deep .v-list-item .v-text-field .v-input__slot {
  width: 100% !important;
  margin: 0 !important;
  background-color: #f8f9fa !important;
  border: 1px solid #e0e0e0 !important;
  border-radius: 6px !important;
}

::v-deep .v-list-item-content .v-text-field {
  width: 100% !important;
}

::v-deep .v-menu__content .v-list-item .v-text-field {
  max-width: none !important;
  flex: 1 !important;
}

::v-deep .v-data-table-header span {
  text-transform: uppercase !important;
  color: black;
}

::v-deep .center-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

::v-deep .img-center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 40%;
}

.gray-button {
  background-color: #e8e8e8 !important;
  /* Green background */
  border: 2px solid #000000 !important;
  /* Red border */
  color: #000000 !important;
}

.no-pointer {
  pointer-events: none;
  cursor: default;
}

.table-controls-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  padding: 0;
}

.filters-row {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  flex-wrap: wrap;
  width: 100%;
}

.buttons-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.control {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.control.search {
  flex: 1 1 200px;
}

.pagination-label {
  font-size: 14px;
  margin-right: 0.5rem;
  white-space: nowrap;
}

@media (max-width: 1400px) {
  .buttons-row {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .action-buttons {
    width: 100%;
    justify-content: flex-start;
  }

  .pagination-controls {
    width: 100%;
    justify-content: flex-end;
  }
}

@media (max-width: 768px) {
  .filters-row {
    flex-direction: column;
    align-items: stretch;
  }

  .control {
    max-width: none;
    width: 100%;
  }

  .buttons-row {
    flex-direction: column;
    align-items: stretch;
  }

  .action-buttons,
  .pagination-controls {
    justify-content: center;
  }
}

@media (max-width: 1100px) {
  .filters-row {
    gap: 8px;
  }

  .control {
    min-width: 120px;
    max-width: 160px;
    flex: 1 1 120px;
  }

  .control.search {
    min-width: 180px;
    max-width: 250px;
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
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
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

.red-button {
  background-color: #ffe6e6 !important;
  border: 2px solid #d32f2f !important;
  color: #d32f2f !important;
}

.green-button {
  background-color: #e8f5e8 !important;
  border: 2px solid #2e7d32 !important;
  color: #2e7d32 !important;
}


</style>