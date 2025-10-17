<template>
  <div v-if="!loading">
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-8">
        <h2 class="text-capitalize">
          {{ $t("dashboardReports.appDataReports") }}
        </h2>
        <v-spacer></v-spacer>
        <v-btn small fab color="primary" @click="showConfigureSetting = true">
          <v-icon style="color: white !important;">mdi-cog</v-icon>
        </v-btn>
      </div>
      <v-card flat class="mt-4">
        <v-card-text>
          <div class="row">
            <div class="col-md-6">
              <div class="d-flex justify-space-around">
                <div class="text-h5">{{ $t('reports.dashboard.topCharts') }}</div>
                <v-btn-toggle dense class="" borderless color="primary" background-color="white" @change="dateFilter"
                  v-model="filterTopChartDateBy">
                    <v-btn :value="0">{{ $t('reports.today') }}</v-btn>
                    <v-btn :value="1">{{ $t('reports.week') }}</v-btn>
                    <v-btn :value="2">{{ $t('reports.month') }}</v-btn>
                    <v-btn :value="3">{{ $t('reports.year') }}</v-btn>
                    <v-btn :value="4">{{ $t('reports.all') }}</v-btn>
                  <v-btn>
                    <v-menu v-model="customFilterMenu" :close-on-content-click="false" transition="scale-transition"
                      min-width="auto" left origin="top right">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn v-bind="attrs" v-on="on" icon>
                          <v-icon size="20" color="primary">mdi-calendar-month</v-icon>
                        </v-btn>
                      </template>
                      <v-date-picker v-model="filterDateCustom" range>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="customDateFilterSelect">
                          {{ $t('confirm') }}
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-btn>
                </v-btn-toggle>
              </div>
            </div>
            <div class="col-md-4">
              <div class="d-flex justify-space-around">
                <v-text-field color="primary" outlined readonly dense :placeholder="$t('reports.selectRegion')"
                  :items="regionsBarChartData.labels" v-model="topChartSelectedCountry"
                  @click="handleTopRegionFilter"></v-text-field>

                <v-text-field class="mx-2" color="primary" outlined dense readonly :placeholder="$t('reports.selectCrop')"
                  v-model="cropFilterModel" @click="cropFilterMethod"></v-text-field>

                  <v-text-field class="mx-2" color="primary" outlined dense readonly :placeholder="$t('reports.dashboard.selectFarm')"
                  v-model="mapFarmFilterModel" @click="mapFarmFilterMethod"></v-text-field>
                  <!-- REFACTOR:if 14922 doesn't work use below or else delete
                   <v-autocomplete outlined v-model="selectedFarms" multiple
                    item-text="farmName" item-value="id" :items="farms" variant="outlined" dense
                    :placeholder="$t('reports.dashboard.selectFarm')"> 
                    <template v-slot:selection="{ item, index }">
                      <span v-if="index < 1">{{ item.farmName }}&nbsp;</span>
                      <span v-if="index === 1">  +{{ selectedFarms.length - 1 }} more</span>
                    </template>
                    <template v-slot:append-item>
                      <div class="apply-farm-filter">
                          <div class="d-flex justify-space-between">
                            <v-btn outlined width="100" color="primary" @click="clearFarmMap" small>
                              {{ $t("clearAll") }}
                            </v-btn>
                            <v-btn width="100" color="primary" @click="filterFarmMap" small>
                              {{ $t("done") }}
                            </v-btn>
                          </div>
                      </div>
                    </template>
                  </v-autocomplete> -->


              </div>
            </div>
          </div>
          <!-- Map card -->
          <v-row>
            <v-col>
              <GmapMap :center="getBigMapCenter" :zoom="4" map-type-id="satellite"
                style="width: 100%; height: 500px">
                />
                <GmapCluster>
                  <GmapMarker :icon="{ url: '/icons/map-marker.png' }" :key="m.id" v-for="(m,indexMap) in mapRegion" :position="{ lat: m.lat, lng: m.log }" 
                    @mouseover="mouseHoverMap(indexMap)"
                    @mouseout="showByIndex = null">
                    <gmap-info-window :opened="showByIndex === indexMap">
                      <p><span class="label">Farm Name :</span> {{ m.farmName }}</p>
                      <p><span class="label">Farmer Name :</span> {{ m.farmerName }}</p>
                    </gmap-info-window>
                  </GmapMarker>
                </GmapCluster>
              </GmapMap>
            </v-col>
          </v-row>
          <!-- Map card end -->

          <div class="row">
            <!-- Regions pie chart -->
            <div v-show="showHideConfig.regions.show" class="col-md-6">
              <v-card>
                <v-card-text>
                  <v-row>
                    <v-col>
                      <div class="d-flex">
                        <v-img left src="/img/reports/regions.svg" max-height="50" max-width="50" />
                        <div class="ml-2">
                          <span class="text-h5"> {{ $t('reports.dashboard.regions') }} </span>
                          <br />
                          <span class="font-weight-thin">
                            {{ $t('reports.dashboard.noOfFarms') }}
                          </span>
                        </div>
                          <v-spacer></v-spacer>
                          <v-menu offset-y>
                              <template v-slot:activator="{ on, attrs }">
                                <v-btn outlined color="indigo" class="goal-achive-dw-btn" v-bind="attrs" v-on="on">
                                  {{ $t('reports.export') }}
                                  <v-icon class="gray--text">mdi-chevron-down</v-icon>
                                </v-btn>
                              </template>
                                <v-list>
                              <!-- <v-list-item @click="$router.replace({name: 'profile'});">Profile</v-list-item>
                                <v-divider></v-divider> -->
                              <v-list-item @click="regionDownloadCsv">
                                <v-btn icon dense><v-img src="/img/reports/csv-file.svg" /></v-btn>
                              </v-list-item>
                              <v-list-item @click="regionDownloadExcel">
                                <v-btn icon dense><v-img src="/img/reports/excel-file.svg" /></v-btn>
                              </v-list-item>
                              <v-list-item @click="regionDownloadPdf">
                                <v-btn icon dense><v-img src="/img/reports/pdf-file.svg" /></v-btn>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                      </div>
                    </v-col>
                    <v-col>
                      <div class="d-flex justify-space-between">
                        <div>
                          <v-card-title>
                            <span class="text-h5 font-weight-black">{{
                              reportsData && reportsData.regionalStat && reportsData.regionalStat.country
                            }}</span></v-card-title>
                          <v-card-subtitle>{{ $t('reports.regions.countries') }}</v-card-subtitle>
                        </div>
                        <div>
                          <v-card-title>
                            <span class="text-h5 font-weight-black">{{
                              reportsData && reportsData.regionalStat && reportsData.regionalStat.state
                            }}</span></v-card-title>
                          <v-card-subtitle>{{ $t('reports.dashboard.provinces') }}</v-card-subtitle>
                        </div>
                        <div>
                          <v-card-title>
                            <span class="text-h5 font-weight-black">{{
                              reportsData && reportsData.regionalStat &&  reportsData.regionalStat.city
                            }}</span></v-card-title>
                          <v-card-subtitle>{{ $t('reports.regions.city') }}</v-card-subtitle>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <BarChart v-if="regionsBarChartData.labels.length > 0" :chartData="regionsBarChartData"
                        :options="options" />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="text-center">
                      <v-btn color="primary" :to="{
                        name: 'ReportDetail',
                        params: { type: 'regions' },
                      }">{{ $t('reports.dashboard.viewAll') }}</v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </div>
            <!-- Regions pie chart end -->

            <!-- Farmers pie chart -->
            <div class="col-md-6">
              <v-card v-show="showHideConfig.farmers.show">
                <v-card-text>
                  <v-row>
                    <v-col lg="4">
                      <div class="d-flex">
                        <v-img left src="/img/reports/farmers.svg" max-height="50" max-width="50" />
                        <div class="ml-2">
                          <span class="text-h5"> {{ $t('reports.regions.farmers') }} </span>
                          <br />
                          <span class="font-weight-thin"> {{ $t('reports.dashboard.landArea') }} </span>
                        </div>
                      </div>
                    </v-col>
                    <v-col lg="5">
                      <div class="d-flex justify-space-between">
                        <div>
                          <v-card-title>
                            <span class="text-h5 font-weight-black">{{
                              farmersData && farmersData.farmerCount
                            }}</span></v-card-title>
                          <v-card-subtitle>{{ $t('reports.regions.farmers') }}</v-card-subtitle>
                        </div>
                        <div>
                          <v-card-title>
                            <span class="text-h5 font-weight-black">
                               {{ getArea(farmersData && farmersData?.avgFarmLand && parseFloat(farmersData?.avgFarmLand)?.toFixed(2)) }}</span></v-card-title>
                          <v-card-subtitle>{{ $t('reports.dashboard.avgFarmerLand') }}</v-card-subtitle>
                        </div>
                      </div>
                    </v-col>
                    <v-col  lg="2">
                      <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn outlined color="indigo" class="goal-achive-dw-btn" v-bind="attrs" v-on="on">
                            {{ $t('reports.export') }}
                            <v-icon class="gray--text">mdi-chevron-down</v-icon>
                          </v-btn>
                        </template>
                        <v-list>
                          <!-- <v-list-item @click="$router.replace({name: 'profile'});">Profile</v-list-item>
                            <v-divider></v-divider> -->
                          <v-list-item @click="farmerDownloadCsv">
                            <v-btn icon dense><v-img src="/img/reports/csv-file.svg" /></v-btn>
                          </v-list-item>
                          <v-list-item @click="farmerDownloadExcel">
                            <v-btn icon dense><v-img src="/img/reports/excel-file.svg" /></v-btn>
                          </v-list-item>
                          <v-list-item @click="farmerDownloadPdf">
                            <v-btn icon dense><v-img src="/img/reports/pdf-file.svg" /></v-btn>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <BarChart v-if="farmersBarChartData.labels.length > 0" :chartData="farmersBarChartData" />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="text-center">
                      <v-btn :to="{
                        name: 'ReportDetail',
                        params: { type: 'farmers' },
                      }" color="primary">{{ $t('reports.dashboard.viewAll') }}</v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </div>
            <!-- Farmers pie chart end -->
          </div>
          <div class="row">
            <!-- Crops (planted Area/Crop) chart-->
            <div class="col-md-6" v-show="showHideConfig.crops.show">
              <v-card>
                <v-card-text>
                  <v-row>
                    <v-col lg="4">
                      <div class="d-flex">
                        <v-img left src="/img/reports/crops.svg" max-height="50" max-width="50" />
                        <div class="ml-2">
                          <span class="text-h5">{{ $t('reports.dashboard.crops') }}</span>
                          <br />
                          <span class="font-weight-thin">{{ $t('reports.dashboard.plantedAreaCrop') }}</span>
                        </div>
                      </div>
                    </v-col>
                    <v-col lg="5">
                      <div class="d-flex justify-space-between">
                        <div>
                          <v-card-title>
                            <span class="text-h5 font-weight-black">{{
                              cropsData && cropsData.cropStat.cropsCount
                            }}</span></v-card-title>
                          <v-card-subtitle>{{ $t('reports.dashboard.crops') }}</v-card-subtitle>
                        </div>
                        <div>
                          <v-card-title>
                            <span class="text-h5 font-weight-black">{{ cropsData && cropsData.cropStat.plantedArea }}</span></v-card-title>
                          <v-card-subtitle>{{ $t('reports.dashboard.plantedArea') }}</v-card-subtitle>
                        </div>
                      </div>
                    </v-col>
                    <v-col lg="2">
                      <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn outlined color="indigo" class="goal-achive-dw-btn" v-bind="attrs" v-on="on">
                            {{ $t('reports.export') }}
                            <v-icon class="gray--text">mdi-chevron-down</v-icon>
                          </v-btn>
                        </template>
                        <v-list>
                          <!-- <v-list-item @click="$router.replace({name: 'profile'});">Profile</v-list-item>
                            <v-divider></v-divider> -->
                          <v-list-item @click="cropDownloadCsv">
                            <v-btn icon dense><v-img src="/img/reports/csv-file.svg" /></v-btn>
                          </v-list-item>
                          <v-list-item @click="cropDownloadExcel">
                            <v-btn icon dense><v-img src="/img/reports/excel-file.svg" /></v-btn>
                          </v-list-item>
                          <v-list-item @click="cropDownloadPdf">
                            <v-btn icon dense><v-img src="/img/reports/pdf-file.svg" /></v-btn>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <BarChart v-if="cropsAreaBarChartData.labels.length > 0" :chartData="cropsAreaBarChartData" />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="text-center">
                      <v-btn color="primary">{{ $t('reports.dashboard.viewAll') }}</v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </div>
            <!-- Crops (planted Area/Crop) chart end-->

            <!-- Crops (Avg. Yield/Crop) chart-->
            <div class="col-md-6" v-show="showHideConfig.crops.show">
              <v-card>
                <v-card-text>
                  <v-row>
                    <v-col lg="4">
                      <div class="d-flex">
                        <v-img left src="/img/reports/crops.svg" max-height="50" max-width="50" />
                        <div class="ml-2">
                          <span class="text-h5">{{ $t('reports.dashboard.crops') }}</span>
                          <br />
                          <span class="font-weight-thin">{{ $t('reports.dashboard.avgYieldCrop') }}</span>
                        </div>
                      </div>
                    </v-col>
                    <v-col lg="5">
                      <div class="d-flex justify-space-between">
                        <div>
                          <v-card-title>
                            <span class="text-h5 font-weight-black">{{
                              cropsData && cropsData.cropStat.cropsCount
                            }}</span></v-card-title>
                          <v-card-subtitle>{{ $t('reports.dashboard.crops') }}</v-card-subtitle>
                        </div>
                        <div>
                          <v-card-title>
                            <span class="text-h5 font-weight-black">{{
                              getYieldPerBaseSettingUnit( cropsData ? (cropsData && cropsData?.cropStat?.totalYield && parseFloat(cropsData.cropStat.totalYield).toFixed(2)) : cropsData && cropsData.cropStat.totalYield)
                            }}
                              </span></v-card-title>
                          <v-card-subtitle>{{ $t('reports.dashboard.averageYield') }}</v-card-subtitle>
                        </div>
                      </div>
                    </v-col>
                    <v-col  lg="3">
                      <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn outlined color="indigo" class="goal-achive-dw-btn" v-bind="attrs" v-on="on">
                            {{ $t('reports.export') }}
                            <v-icon class="gray--text">mdi-chevron-down</v-icon>
                          </v-btn>
                        </template>
                        <v-list>
                          <!-- <v-list-item @click="$router.replace({name: 'profile'});">Profile</v-list-item>
                            <v-divider></v-divider> -->
                          <v-list-item @click="cropDownloadCsv">
                            <v-btn icon dense><v-img src="/img/reports/csv-file.svg" /></v-btn>
                          </v-list-item>
                          <v-list-item @click="cropDownloadExcel">
                            <v-btn icon dense><v-img src="/img/reports/excel-file.svg" /></v-btn>
                          </v-list-item>
                          <v-list-item @click="cropDownloadPdf">
                            <v-btn icon dense><v-img src="/img/reports/pdf-file.svg" /></v-btn>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <BarChart v-if="cropsYieldBarChartData.labels.length > 0" :chartData="cropsYieldBarChartData" />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="text-center">
                      <v-btn color="primary">{{ $t('reports.dashboard.viewAll') }}</v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </div>
            <!-- Crops (Avg. Yield/Crop) chart end-->
          </div>

          <div class="row">

            <!-- Pests chart-->
            <div v-show="showHideConfig.pests.show" class="col-md-6">
              <v-card>
                <v-card-text>
                  <v-row>
                    <v-col>
                      <div class="d-flex">
                        <v-img left src="/img/reports/crops.svg" max-height="50" max-width="50" />
                        <div class="ml-2">
                          <span class="text-h5">{{ $t('reports.dashboard.pests') }}</span>
                          <br />
                        </div>
                      </div>
                    </v-col>
                    <v-col>
                      <div class="d-flex justify-space-between">
                        <div>
                          <v-card-title>
                            <span class="text-h5 font-weight-black">{{
                              pestData? pestData.stats.regions : ''
                            }}</span></v-card-title>
                          <v-card-subtitle>{{ $t('reports.dashboard.regions') }}</v-card-subtitle>
                        </div>
                        <div>
                          <v-card-title>
                            <span class="text-h5 font-weight-black">{{
                              pestData? pestData.stats.occurrences : ''
                            }}
                            </span></v-card-title>
                          <v-card-subtitle>{{ $t('reports.dashboard.occurrences') }}</v-card-subtitle>
                        </div>
                      </div>
                    </v-col>
                    <v-col class="goal-achivem">
                      <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn outlined color="indigo" class="goal-achive-dw-btn" v-bind="attrs" v-on="on">
                            {{ $t('reports.export') }}
                            <v-icon class="gray--text">mdi-chevron-down</v-icon>
                          </v-btn>
                        </template>
                        <v-list>
                          <!-- <v-list-item @click="$router.replace({name: 'profile'});">Profile</v-list-item>
                            <v-divider></v-divider> -->
                          <v-list-item @click="pestDownloadCsv">
                            <v-btn icon dense><v-img src="/img/reports/csv-file.svg" /></v-btn>
                          </v-list-item>
                          <v-list-item @click="pestDownloadExcel">
                            <v-btn icon dense><v-img src="/img/reports/excel-file.svg" /></v-btn>
                          </v-list-item>
                          <v-list-item @click="pestDownloadPdf">
                            <v-btn icon dense><v-img src="/img/reports/pdf-file.svg" /></v-btn>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <BarChart v-if="pestChartData.labels.length" :chartData="pestChartData"
                        :chartOptions="pestChartOptions" />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="text-center">
                      <v-btn :to="{
                        name: 'ReportDetail',
                        params: { type: 'pests' },
                      }" color="primary">{{ $t('reports.dashboard.viewAll') }}</v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </div>
            <!-- Pests chart end-->
            <!-- Equipment chart-->
            <div v-show="showHideConfig.equipment.show" class="col-md-6">
              <v-card>
                <v-card-text>
                  <v-row>
                    <v-col>
                      <div class="d-flex">
                        <v-img left src="/img/reports/crops.svg" max-height="50" max-width="50" />
                        <div class="ml-2">
                          <span class="text-h5">{{ $t('reports.dashboard.equipments') }}</span>
                          <br />
                        </div>
                      </div>
                    </v-col>
                    <v-col class="goal-achivem">
                      <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn outlined color="indigo" class="goal-achive-dw-btn" v-bind="attrs" v-on="on">
                            {{ $t('reports.export') }}
                            <v-icon class="gray--text">mdi-chevron-down</v-icon>
                          </v-btn>
                        </template>
                        <v-list>
                          <!-- <v-list-item @click="$router.replace({name: 'profile'});">Profile</v-list-item>
                            <v-divider></v-divider> -->
                          <v-list-item @click="equipmentDownloadCsv">
                            <v-btn icon dense><v-img src="/img/reports/csv-file.svg" /></v-btn>
                          </v-list-item>
                          <v-list-item @click="equipmentDownloadExcel">
                            <v-btn icon dense><v-img src="/img/reports/excel-file.svg" /></v-btn>
                          </v-list-item>
                          <v-list-item @click="equipmentDownloadPdf">
                            <v-btn icon dense><v-img src="/img/reports/pdf-file.svg" /></v-btn>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-col>
                    <!-- <v-col>
                    <div class="d-flex justify-space-between">
                      <div>
                        <v-card-title>
                          <span class="text-h5 font-weight-black">{{
                            equipmentData ? equipmentData.stats.farmers : ''
                          }}</span></v-card-title>
                          <v-card-subtitle>Farmers</v-card-subtitle>
                      </div>
                      <div>
                        <v-card-title>
                          <span class="text-h5 font-weight-black">{{
                            equipmentData ? equipmentData.stats.equipments : ''
                          }}
                          </span></v-card-title>
                        <v-card-subtitle>equipments</v-card-subtitle>
                      </div>
                    </div>
                  </v-col> -->
                  </v-row>
                  <v-row>
                    <v-col>
                      <BarChart v-if="equipmentChartData.labels.length" :chartData="equipmentChartData"
                        :chartOptions="equipmentChartOptions" />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="text-center">
                      <v-btn :to="{
                        name: 'ReportDetail',
                        params: { type: 'equipment' },
                      }" color="primary">{{ $t('reports.dashboard.viewAll') }}</v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </div>
            <!-- Equipment end-->
          </div>
          <div class="row">
            <!-- Gaols Achieved chart-->
            <div class="col-md-12" v-show="showHideConfig.goals.show">
              <v-card>
                <v-card-text>
                  <v-row>
                    <v-col>
                      <div class="d-flex">
                        <v-img left src="/img/reports/crops.svg" max-height="50" max-width="50" />
                        <div class="ml-2">
                          <span class="text-h5">{{ $t('reports.dashboard.goalAchievedChart') }}</span>
                          <br />
                        </div>
                      </div>
                    </v-col>
                    <v-col class="goal-achivem">
                    <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn outlined color="indigo" class="goal-achive-dw-btn" v-bind="attrs" v-on="on">
                            {{ $t('reports.export') }}
                            <v-icon class="gray--text">mdi-chevron-down</v-icon>
                          </v-btn>
                        </template>
                        <v-list>
                          <!-- <v-list-item @click="$router.replace({name: 'profile'});">Profile</v-list-item>
                            <v-divider></v-divider> -->
                          <v-list-item @click="goalAchiveDownloadCsv">
                            <v-btn icon dense><v-img src="/img/reports/csv-file.svg" /></v-btn>
                          </v-list-item>
                          <v-list-item @click="goalAchiveDownloadExcel">
                            <v-btn icon dense><v-img src="/img/reports/excel-file.svg" /></v-btn>
                          </v-list-item>
                          <v-list-item @click="goalAchiveDownloadPdf">
                            <v-btn icon dense><v-img src="/img/reports/pdf-file.svg" /></v-btn>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    <!-- <v-col>
                    <div class="d-flex justify-space-between">
                      <div>
                        <v-card-title>
                          <span class="text-h5 font-weight-black">{{
                            equipmentData ? equipmentData.stats.farmers : ''
                          }}</span></v-card-title>
                          <v-card-subtitle>Farmers</v-card-subtitle>
                      </div>
                      <div>
                        <v-card-title>
                          <span class="text-h5 font-weight-black">{{
                            equipmentData ? equipmentData.stats.equipments : ''
                          }}
                          </span></v-card-title>
                        <v-card-subtitle>equipments</v-card-subtitle>
                      </div>
                    </div>
                  </v-col> -->
                  </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <BarChart v-if="goalsAchievedChartData.labels.length" :chartData="goalsAchievedChartData"
                        :chartOptions="goalsAchievedChartOptions" />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="text-center">
                      <v-btn :to="{
                        name: 'ReportDetail',
                        params: { type: 'goals' },
                      }" color="primary">{{ $t('reports.dashboard.viewAll') }}</v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </div>
            <!-- Goals Achieved end-->
          </div>
          <!-- Yield chart filter -->
          <div class="row mt-6" v-show="showHideConfig.yield.show">
            <div class="col-md-12">
              <div class="d-flex justify-space-around">
                <div class="text-h6">{{ $t('reports.dashboard.yieldChart') }}</div>
                <v-btn-toggle dense class="" borderless color="primary" background-color="white"
                  @change="getYieldReport" v-model="filterYieldChartDateBy">
                    <v-btn :value="0">{{ $t('reports.today') }}</v-btn>
                    <v-btn :value="1">{{ $t('reports.week') }}</v-btn>
                    <v-btn :value="2">{{ $t('reports.month') }}</v-btn>
                    <v-btn :value="3">{{ $t('reports.year') }}</v-btn>
                    <v-btn :value="4">{{ $t('reports.all') }}</v-btn>
                  <v-btn>
                    <v-menu v-model="yieldFilterMenu" :close-on-content-click="false" transition="scale-transition"
                      min-width="auto" left origin="top right">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn v-bind="attrs" v-on="on" icon>
                          <v-icon size="20" color="primary">mdi-calendar-month</v-icon>
                        </v-btn>
                      </template>
                      <v-date-picker v-model="filterDateYield" range>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="yieldDateFilterSelect">
                          {{ $t('confirm') }}
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-btn>
                </v-btn-toggle>
                <v-text-field color="primary" outlined dense readonly :placeholder="$t('reports.selectRegion')" 
                  :items="regionsBarChartData.labels" v-model="topChartSelectedCountry"
                  @click="handleYieldRegionFilter"></v-text-field>
                <v-text-field class="mx-2" color="primary" outlined dense readonly :placeholder="$t('reports.dashboard.selectFarm')"
                  v-model="yieldFarmFilterModel" @click="yieldFarmFilterMethod"></v-text-field>
                <v-text-field class="mx-2" color="primary" outlined dense readonly :placeholder="$t('reports.selectCrop')" 
                  v-model="yieldCropFilter" @click="yieldCropFilterMethod"></v-text-field>
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn outlined color="indigo" v-bind="attrs" v-on="on">
                      {{ $t('reports.export') }}
                      <v-icon class="gray--text">mdi-chevron-down</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <!-- <v-list-item @click="$router.replace({name: 'profile'});">Profile</v-list-item>
                      <v-divider></v-divider> -->
                    <v-list-item @click="downloadYieldCsv">
                      <v-btn icon dense><v-img src="/img/reports/csv-file.svg" /></v-btn>
                    </v-list-item>
                    <v-list-item @click="downloadYieldExcel">
                      <v-btn icon dense><v-img src="/img/reports/excel-file.svg" /></v-btn>
                    </v-list-item>
                    <v-list-item @click="downloadYieldPdf">
                      <v-btn icon dense><v-img src="/img/reports/pdf-file.svg" /></v-btn>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </div>
          </div>
          <!-- Yield chart filter end -->
          <v-row v-show="showHideConfig.yield.show">
            <v-col>
              <apexchart type="line" :options="yieldChartOptions" :series="yieldChartData"></apexchart>
            </v-col>
          </v-row>

          <!-- Soli Quality chart filter -->
          <div class="row mt-6" v-show="showHideConfig.soil.show">
            <div class="col-md-12">
              <div class="d-flex justify-space-around">
                <div class="text-h6">{{ $t('reports.dashboard.soilQuality') }}</div>
                <v-btn-toggle dense class="" borderless color="primary" background-color="white" @change="getSoilReport"
                  v-model="filterSoilQualityDateBy">
                    <v-btn :value="0">{{ $t('reports.today') }}</v-btn>
                      <v-btn :value="1">{{ $t('reports.week') }}</v-btn>
                      <v-btn :value="2">{{ $t('reports.month') }}</v-btn>
                      <v-btn :value="3">{{ $t('reports.year') }}</v-btn>
                      <v-btn :value="4">{{ $t('reports.all') }}</v-btn>
                    <v-btn>
                    <v-menu v-model="soilFilterMenu" :close-on-content-click="false" transition="scale-transition"
                      min-width="auto" left origin="top right">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn v-bind="attrs" v-on="on" icon>
                          <v-icon size="20" color="primary">mdi-calendar-month</v-icon>
                        </v-btn>
                      </template>
                      <v-date-picker v-model="filterDateSoil" range>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="soilDateFilterSelect">
                          {{ $t('confirm') }}
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-btn>
                </v-btn-toggle>
                <v-select color="primary" multiple :items="soilValues" outlined readonly dense v-model="selectedSoil"
                 :placeholder="$t('reports.dashboard.soilValues')" @change="getSoilData"></v-select>
                <v-text-field color="primary" outlined dense :placeholder="$t('reports.selectRegion')"
                  :items="regionsBarChartData.labels" v-model="topChartSelectedCountry"
                  @click="handleSoilRegionFilter"></v-text-field>
                <v-text-field class="mx-2" color="primary" outlined dense readonly :placeholder="$t('reports.dashboard.selectFarm')"
                  v-model="soilFarmFilterModel" @click="soilFarmFilterMethod"></v-text-field>
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn outlined color="indigo" v-bind="attrs" v-on="on">
                      {{ $t('reports.export') }}
                      <v-icon class="gray--text">mdi-chevron-down</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <!-- <v-list-item @click="$router.replace({name: 'profile'});">Profile</v-list-item>
                      <v-divider></v-divider> -->
                    <v-list-item @click="downloadSoilCsv">
                      <v-btn icon dense><v-img src="/img/reports/csv-file.svg" /></v-btn>
                    </v-list-item>
                    <v-list-item @click="downloadSoilQualityExcel">
                      <v-btn icon dense><v-img src="/img/reports/excel-file.svg" /></v-btn>
                    </v-list-item>
                    <v-list-item @click="downloadSoilPdf">
                      <v-btn icon dense><v-img src="/img/reports/pdf-file.svg" /></v-btn>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </div>
          </div>
          <!-- Soil Quality chart filter end -->
          <v-row v-show="showHideConfig.soil.show">
            <v-col>
              <!-- <LineChart :chartData="soilChartData" :chartOptions="soilChartOptions" /> -->
              <apexchart type="line" :options="soilChartOptions" :series="soilChartData"></apexchart>

            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <ConfigureSettingDialog v-if="showConfigureSetting" :showHideConfig="showHideConfig"
        :dialogI="showConfigureSetting" @closeDialog="showConfigureSetting = false" @configureDone="showHideCharts" />

      <CropFilterDialog v-if="showCropFilter" :dialogI="showCropFilter" :cropTypesList="cropTypes"
        @closeDialog="showCropFilter = false" :currentId="currentCropFilterId" @cropFilterDone="cropFilterDone" />

      <RegionFilterDialog v-if="showRegionFilter" :dialogI="showRegionFilter" @closeDialog="handleCloseRegionFilter"
        @regionFilterDone="regionFilterDone" :currentCountry="currentCountry" :currentState="currentState" />

      <FarmFilterDialog v-if="showFarmFilter" :dialogI="showFarmFilter" :farmList="farms" :preSelectedFarm="preSelectedFarmTopChart"
        @closeDialog="showFarmFilter = false" @farmFilterDone="farmFilterDone" />
        <FarmFilterDialog v-if="showYieldFilter" :dialogI="showYieldFilter" :farmList="farms" :preSelectedFarm="preSelectedFarmYieldChart"
        @closeDialog="showYieldFilter = false" @farmFilterDone="farmFilterDone" />
         <FarmFilterDialog v-if="showSoilFilter" :dialogI="showSoilFilter" :farmList="farms" :preSelectedFarm="preSelectedFarmSoilChart"
        @closeDialog="showSoilFilter = false" @farmFilterDone="farmFilterDone" />
    </v-container>
  </div>
</template>
<script>
/* eslint-disable */
import Breadcrumb from "@/components/core/Breadcrumb";
import loadingMixin from "@/mixins/LoadingMixin";
import DashboardReportMixin from "@/mixins/DashboardReportMixin";
import DownloadMixin from "@/mixins/DownloadMixin";
import moment from "moment";
import DashboardReportService from "@/_services/DashboardReportService";
// import PieChart from "./components/Pie.vue";
import BarChart from "./components/Bar.vue";
import LineChart from "./components/Line.vue";
import ConfigureSettingDialog from "./components/ConfigureSettingDialog.vue";
import CropFilterDialog from "./components/CropFilterDialog.vue";
import RegionFilterDialog from "./components/RegionFilterDialog.vue";
import FarmFilterDialog from "./components/FarmFilterDialog.vue";
import VueApexCharts from 'vue-apexcharts'
import PermissionsService from "@/_services/PermissionsService";
import GmapCluster from 'vue2-google-maps/dist/components/cluster';
import DeforestationService from "@/_services/DeforestationService";
import { isIndonesianClient } from "@/utils";

export default {
  components: {
    BarChart,
    GmapCluster,
    breadcrumb: Breadcrumb,
    // PieChart,
    LineChart,
    ConfigureSettingDialog,
    CropFilterDialog,
    RegionFilterDialog,
    FarmFilterDialog,
    apexchart: VueApexCharts,
  },
  computed: {
    topChartStartDate() {
      if (this.filterTopChartDateBy === 0) {
        return moment(new Date()).format("DD-MMM-YYYY");
      } else if (this.filterTopChartDateBy === 1) {
        return moment().startOf('week').format("DD-MMM-YYYY");
      } else if (this.filterTopChartDateBy === 2) {
        return moment().startOf('month').format("DD-MMM-YYYY");
      }
      else if (this.filterTopChartDateBy === 3) {
        return moment().startOf('year').format("DD-MMM-YYYY");
      }
      else if (this.filterTopChartDateBy === 4) {
        return null
      }
      else if (this.filterTopChartDateBy > 3 && this.filterDateCustom.length == 2) {
        return moment(new Date(this.filterDateCustom[0]).getTime()).format("DD-MMM-YYYY");
      }
      else {
        return moment(new Date()).format("DD-MMM-YYYY");
      }
    },
    getBigMapCenter(){
       if(isIndonesianClient()){
        return { lat: -6.201965, lng: 106.817811 }
       }
       return { lat: this.mapRegion[0]?this.mapRegion[0].lat:-6.201965, lng: this.mapRegion[0]?this.mapRegion[0].log:106.817811 }
    },
    topChartEndDate() {
      if (this.filterTopChartDateBy === 1) {
        return moment().endOf('week').format("DD-MMM-YYYY");
      } else if (this.filterTopChartDateBy === 2) {
        return moment().endOf('month').format("DD-MMM-YYYY");
      } else if (this.filterTopChartDateBy === 3) {
        return moment().endOf('year').format("DD-MMM-YYYY");
      }
      else if (this.filterTopChartDateBy === 4) {
        return null
      }
      else if (this.filterTopChartDateBy > 3 && this.filterDateCustom.length == 2) {
        return moment(new Date(this.filterDateCustom[1]).getTime()).format("DD-MMM-YYYY");
      }
      else {
        return moment(new Date()).format("DD-MMM-YYYY");
      }
    },
    yieldStartDate() {
      if (this.filterYieldChartDateBy === 0) {
        return moment(new Date()).format("DD-MMM-YYYY");
      } else if (this.filterYieldChartDateBy === 1) {
        return moment().startOf('week').format("DD-MMM-YYYY");
      } else if (this.filterYieldChartDateBy === 2) {
        return moment().startOf('month').format("DD-MMM-YYYY");
      }
      else if (this.filterYieldChartDateBy === 3) {
        return moment().startOf('year').format("DD-MMM-YYYY");
      }
      else if (this.filterYieldChartDateBy === 4) {
        return null;
      }
      else if (this.filterYieldChartDateBy > 3 && this.filterDateYield.length == 2) {
        return moment(new Date(this.filterDateYield[0]).getTime()).format("DD-MMM-YYYY");
      }
      else {
        return moment(new Date()).format("DD-MMM-YYYY");
      }
    },
    yiledEndDate() {
      if (this.filterYieldChartDateBy === 1) {
        return moment().endOf('week').format("DD-MMM-YYYY");
      } else if (this.filterYieldChartDateBy === 2) {
        return moment().endOf('month').format("DD-MMM-YYYY");
      } else if (this.filterYieldChartDateBy === 3) {
        return moment().endOf('year').format("DD-MMM-YYYY");
      }
      else if (this.filterYieldChartDateBy === 4) {
        return null
      }
      else if (this.filterYieldChartDateBy > 3 && this.filterDateSoil.length == 2) {
        return moment(new Date(this.filterDateSoil[1]).getTime()).format("DD-MMM-YYYY");
      }
      else {
        return moment(new Date()).format("DD-MMM-YYYY");
      }
    },
    soilStartDate() {
      if (this.filterSoilQualityDateBy === 0) {
        return moment(new Date()).format("DD-MMM-YYYY");
      } else if (this.filterSoilQualityDateBy === 1) {
        return moment().startOf('week').format("DD-MMM-YYYY");
      } else if (this.filterSoilQualityDateBy === 2) {
        return moment().startOf('month').format("DD-MMM-YYYY");
      }
      else if (this.filterSoilQualityDateBy === 3) {
        return moment().startOf('year').format("DD-MMM-YYYY");
      }
      else if (this.filterSoilQualityDateBy === 4) {
        return null
      }
      else if (this.filterSoilQualityDateBy > 3 && this.filterDateSoil.length == 2) {
        return moment(new Date(this.filterDateSoil[0]).getTime()).format("DD-MMM-YYYY");
      }
      else {
        return moment(new Date()).format("DD-MMM-YYYY");
      }
    },
    soilEndDate() {
      if (this.filterSoilQualityDateBy === 1) {
        return moment().endOf('week').format("DD-MMM-YYYY");
      } else if (this.filterSoilQualityDateBy === 2) {
        return moment().endOf('month').format("DD-MMM-YYYY");
      } else if (this.filterSoilQualityDateBy === 3) {
        return moment().endOf('year').format("DD-MMM-YYYY");
      }
      else if (this.filterSoilQualityDateBy > 3 && this.filterDateYield.length == 2) {
        return moment(new Date(this.filterDateYield[1]).getTime()).format("DD-MMM-YYYY");
      }
      else {
        return moment(new Date()).format("DD-MMM-YYYY");
      }
    },
  },
  data() {
    return {
      selectedFarms: [],
      preSelectedFarmTopChart: [],
      preSelectedFarmYieldChart: [],
      preSelectedFarmSoilChart: [],
      mapFarmIds: [],
      mapFarmFilterModel: "",
      showByIndex:null,
      showHideConfig: {
        regions: {label: this.$t("region"), show: true},
        farmers: {label: this.$t("farmers"), show: true},
        crops: {label: this.$t("crops"), show: true},
        yield: {label: this.$t("reports.yield"), show: true},
        soil: {label: this.$t("reports.dashboard.soil"), show: true},
        pests: {label: this.$t("pests"), show: false},
        equipment: {label: this.$t("equipment"), show: false},
        goals: {label: this.$t("goalsAchieved"), show: false}
      },
      globalSettings: "",
      loading: false,
      currentCropFilterId: null,
      currentCountry: null,
      currentState: null,
      cropIdToName: {},
      cropFilterModel: '',
      updateChart: 0,
      cropTypes: null,
      equipmentChartData: {},
      yieldCropFilter: '',
      yieldFarmFilterModel: '',
      soilFarmFilterModel: '',
      goalsAchievedChartData: {},
      chartData: {
        type: 'bar',
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'My First dataset',
            backgroundColor: '#f87979',
            data: [40, 39, 10, 40, 39, 80, 40]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      },
      showConfigureSetting: false,
      showCropFilter: false,
      showCropFilterYield: false,
      showRegionFilter: false,
      showFarmFilter: false,
      showYieldFilter: false,
      showSoilFilter: false,
      showFarmFilterYield: false,
      showFarmFilterSoil: false,
      showFarmFilterMap: false,
      showRegionFilterSoil: false,
      showRegionFilterYield: false,
      showRegionFilterTop: false,
      reportsData: null,
      farmersData: null,
      cropsData: null,
      filterTopChartDateBy: 4, //default '4 - all'
      filterYieldChartDateBy: 4,
      filterSoilQualityDateBy: 4,
      topChartSelectedCountry: null,
      yieldChartSelectedCountry: null,
      soilQualitySelectedCountry: null,
      topChartSelectedState: null,
      yieldChartSelectedState: null,
      soilQualitySelectedState: null,
      filterDateCustom: [],
      filterDateYield: [],
      filterDateSoil: [],
      customFilterMenu: false,
      yieldFilterMenu: false,
      soilFilterMenu: false,
      yieldCropType: null,
      yieldFarmIds: [],
      soilFarmIds: [],
      farms: [],
      today: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
      logDate3: new Date((Date.now() - new Date().getTimezoneOffset() * 60000) - 7889400000).toISOString().substr(0, 10),
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: true,
          to: "/",
        },
      ],
      soilValues: [
        { text:  this.$t("Carbon"), value: 'carbon' },
        { text:  this.$t("Potassium"), value: 'potassium' },
        { text:  this.$t("Phosphorus"), value: 'phosphorus' },
        { text:  this.$t("Nitrogen"), value: 'nitrogen' },
        { text:  this.$t("Sulfur"), value: 'sulfur' },
      ],
      selectedSoil: ['carbon', 'nitrogen', 'sulfur', 'phosphorus', 'potassium'],
      regionsBarChartData: {
        labels: [],
        datasets: [
          {
            label: this.$t('farms'),
            backgroundColor: "#f87979",
            data: [],
          },
        ],
      },
      farmersBarChartData: {
        labels: [],
        datasets: [
          {
            label: this.$t("farmers"),
            backgroundColor: "#f87979",
            data: [],
          },
        ],
      },
      cropsAreaBarChartData: {
        labels: [],
        datasets: [
          {
            label:  this.$t('acres'),
            backgroundColor: "#f87979",
            data: [],
          },
        ],
      },
      cropsYieldBarChartData: {
        labels: [],
        datasets: [
          {
            label: "KG",
            backgroundColor: "#f87979",
            data: [],
          },
        ],
      },
      pestData: null,
      pestChartData: {
        labels: [],
        datasets: [
          {
            label: "",
            backgroundColor: "#f87979",
            data: [],
          },
        ],
      },
      pestChartOptions: {
        responsive: true,
        interaction: {
          mode: "index",
          intersect: true,
        },
        stacked: false,
        plugins: {
          title: {
            display: true,
            text: "Pests Chart",
          },
        },
      },
      equipmentChartData: {
        labels: [],
        datasets: [
          {
            label: "",
            backgroundColor: "#f87979",
            data: [],
          },
        ],
      },
      equipmentChartOptions: {
        responsive: true,
        interaction: {
          mode: "index",
          intersect: true,
        },
        stacked: false,
        plugins: {
          title: {
            display: true,
            text: "Equipments Chart",
          },
        },
      },
      goalsAchievedChartData: {
        labels: [],
        datasets: [
          {
            label: "",
            backgroundColor: "#f87979",
            data: [],
          },
        ],
      },
      goalsAchievedChartOptions: {
        responsive: true,
        interaction: {
          mode: "index",
          intersect: true,
        },
        stacked: false,
        plugins: {
          title: {
            display: true,
            text: "Goals Achieved Chart",
          },
        },
      },
      yieldChartData: [],
      yieldChartOptions: {
        xaxis:{
          categories: [
            'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' 
          ]
        },
      },
      soilChartData: [],
      soilChartOptions: {},
      soil: [],
      yield: [],
      mapRegion: [],
      regionalList:[],
      farmerList:[],
      months:[
        this.$t('jan'),
        this.$t('feb'),
        this.$t('mar'),
        this.$t('apr'),
        this.$t('may'),
        this.$t('jun'),
        this.$t('jul'),
        this.$t('aug'),
        this.$t('sep'),
        this.$t('oct'),
        this.$t('nov'),
        this.$t('dec')
      ],
      monthLookup:{
        january:this.$t('jan'),
        february:this.$t('feb'),
        march:this.$t('mar'),
        april:this.$t('apr'),
        may:this.$t('may'),
        june:this.$t('jun'),
        july:this.$t('jul'),
        august:this.$t('aug'),
        september:this.$t('sep'),
        october:this.$t('oct'),
        november:this.$t('nov'),
        december:this.$t('dec')

      }
    };
  },
  watch: {
    regionsBarChartData: {
      handler(nV) {
        this.updateChart++
      },
      deep: true
    }
  },

  async mounted() {
    // await this.getReportData();
      await Promise.all([
      this.getReports(),
        this.getYieldData(),
        this.getSoilData(),
        this.getSettings(),
        this.getEUDRSettings()
      ])
},

  methods: {
    async getEUDRSettings() {
      await DeforestationService.getEudrSettings();
    },
    mouseHoverMap(indexMap){
      this.showByIndex = indexMap;
    },
    // async getReports(){

    //   this.stopLoading();
    //   if(this.filterTopChartDateBy < 4 || this.filterDateCustom.length == 2){
    // async getReportData() {
    //   this.startLoading();
    //   await DashboardReportService.getReportData(this.topChartSelectedCountry)
    //     .then((res) => {
    //       this.reportsData = res.data.regions;
    //       const countries = res.data.regions.regionalChart
    //         .filter((item) => item.country != null)
    //         .map((item) => item.country);
    //       this.regionsBarChartData.labels = countries;

    //       const farmCounts = res.data.regions.regionalChart
    //         .filter((item) => item.country != null)
    //         .map((item) => item.farmCount);
    //       this.regionsBarChartData.datasets[0].data = farmCounts;
    //       this.stopLoading();
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //       this.stopLoading();
    //     });
    // },
    async getSettings() {
      const globalSettings = await PermissionsService.getGlobalSettings();
      if(globalSettings.data.globalSetting){
        this.globalSettings = globalSettings.data.globalSetting;
      }
    },
    getArea(baseArea) {
      const factor = this.globalSettings?.areaUnit?.factor ?? 1;
      return `${(baseArea / factor).toFixed(2)} ${
        this.globalSettings?.areaUnit?.abbvr ?? "ac"
      }`;
    },
    getYieldPerBaseSettingUnit(baseYield) {
      const factor = this.globalSettings?.areaUnit?.factor ?? 1;
      return `${(baseYield / factor).toFixed(2)} kg/ ${
        this.globalSettings?.areaUnit?.abbvr ?? "ac"
      }`;
    },
    showHideCharts(val) {
      this.showConfigureSetting = false
      this.showHideConfig = val
    },
    handleTopRegionFilter() {
      this.showRegionFilter = true
      this.showRegionFilterTop = true
    },
    handleYieldRegionFilter() {
      this.showRegionFilter = true
      this.showRegionFilterYield = true
    },
    handleSoilRegionFilter() {
      this.showRegionFilter = true
      this.showRegionFilterSoil = true
    },
    handleCloseRegionFilter() {
      this.showRegionFilter = false
      this.showRegionFilterTop = false
      this.showRegionFilterSoil = false
      this.showRegionFilterYield = false
    },
    async dateFilter() {
      if (this.filterTopChartDateBy < 4) {
        await this.getReports();
      }
    },
    async getReports() {
      if (this.filterTopChartDateBy < 5 || this.filterDateCustom.length == 2) {
        this.startLoading();
        await Promise.all([
          this.getMapData(),
          this.getFarmerData(),
          this.getCropsData(),
          this.getRegionsReport(),
          this.getFarmUserData(),
          this.getPestReport(),
          this.getEquipmentReport(),
          this.getGoalsAchievedReport(),
        ])
        this.stopLoading();
      }

    },
    async regionFilterDone(country, state) {
      this.startLoading();
      if (this.showRegionFilterTop) {
        this.topChartSelectedCountry = country ? country.name : null
        this.topChartSelectedState = state
        Promise.all([
          this.getMapData(),
          this.getFarmerData(),
          this.getCropsData(),
          this.getRegionsReport(),
          this.getPestReport(),
          this.getEquipmentReport(),
          this.getGoalsAchievedReport(),

        ])
      }
      else if (this.showRegionFilterYield) {
        this.yieldChartSelectedCountry = country ? country.name : null
        this.yieldChartSelectedState = state
        await this.getYieldData();
      } else {
        this.soilQualitySelectedCountry = country ? country.name : null
        this.soilQualitySelectedState = state
        await this.getSoilData();
      }
      this.showRegionFilter = false
      this.showRegionFilterSoil = false
      this.showRegionFilterYield = false
      this.showRegionFilterTop = false
      this.currentCountry = country
      this.currentState = state
      this.stopLoading();
    },
    async cropFilterDone(val) {
      try {
        console.log('crop filter val', val);
        if (this.showCropFilterYield) {
          this.yieldCropFilter = this.cropIdToName[val];
          console.log('inside yield', this.yieldCropFilter);
        }
        else {
          console.log('inside main crop filter');
          this.cropFilterModel = this.cropIdToName[val];
        }
        this.showCropFilter = false;
        this.showCropFilterYield = false;
        this.currentCropFilterId = val;

        await Promise.all([
          this.getFarmerData({ cropType: val }),
          this.getMapData({ cropType: val }),
          this.getCropsData({ cropType: val }),
          this.getRegionsReport({ cropType: val }),
          this.getPestReport({ cropId: val }),
          this.getGoalsAchievedReport({ cropId: val }),
        ])
        // await this.getEquipmentReport({ cropId: val });
        console.log(val, 'crop id')
      } catch (error) {

      }

    },
    async farmFilterDone(val) {
      console.log(val, "farm filter", this.showFarmFilterMap)
      try {
        if (this.showFarmFilterYield) {
          this.showYieldFilter = false
          this.showFarmFilterYield = false
          this.yieldFarmIds = val
          this.preSelectedFarmYieldChart = val;
          this.yieldFarmFilterModel = this.farms.filter(f => val.includes(f.id)).map(f => f.farmName).join(",")
          this.getYieldData()
          return
        }
        if (this.showFarmFilterSoil) {
          this.showSoilFilter = false
          this.showFarmFilterSoil = false
          this.soilFarmIds = val
          this.preSelectedFarmSoilChart = val
          this.soilFarmFilterModel = this.farms.filter(f => val.includes(f.id)).map(f => f.farmName).join(",")
          this.getSoilData()
          return
        }
        if (this.showFarmFilterMap) {
          this.showFarmFilter = false
          this.showFarmFilterMap = false
          this.mapFarmIds = val
          this.preSelectedFarmTopChart = val
          this.mapFarmFilterModel = this.farms.filter(f => val.includes(f.id)).map(f => f.farmName).join(",")
          this.getMapData()
          return
        }
        this.showCropFilter = false
      } catch (error) {
        console.log(error, "err")
      }
    },
    async cropFilterMethod() {
      // this.startLoading();
      if (!this.cropTypes) {
        let res = await DashboardReportService.getCropTypes()
        this.cropTypes = res.data
        res.data.forEach(cropEl => {
          this.cropIdToName[cropEl.id] = cropEl.name

        })
      }
      this.showCropFilter = true
      // this.stopLoading();
    },
    async yieldCropFilterMethod() {
      if (!this.cropTypes) {
        let res = await DashboardReportService.getCropTypes()
        this.cropTypes = res.data
        res.data.forEach(cropEl => {
          this.cropIdToName[cropEl.id] = cropEl.name

        })
      }
      this.showCropFilter = true
      this.showCropFilterYield = true
    },
    async yieldFarmFilterMethod() {
      this.showYieldFilter = true
      this.showFarmFilterYield = true
    },
    async soilFarmFilterMethod() {
      this.showSoilFilter = true
      this.showFarmFilterSoil = true
    },
    async mapFarmFilterMethod() {
      this.showFarmFilter = true
      this.showFarmFilterMap = true
    },
    // REFACTOR:if 14922 doesn't work use below or else delete
    // async filterFarmMap() {
    //   this.showFarmFilterMap = true
    //   this.farmFilterDone(this.selectedFarms)
    // },
    // async clearFarmMap() {
    //   this.showFarmFilterMap = true
    //   this.selectedFarms = [];
    //   this.farmFilterDone('')
    // },
    async getRegionsReport(queryParams) {


      const data = { sDate: this.topChartStartDate, eDate: this.topChartEndDate, ...queryParams, cropType: this.currentCropFilterId, country: this.topChartSelectedCountry, state: this.topChartSelectedState };
      await DashboardReportService.getRegionsReport(data)
        .then((res) => {
          this.reportsData = res.data.regionalStat;
          this.regionalList = res.data.regionalList;
          const countries = res.data.regionalChart
            .filter((item) => item.country != null)
            .map((item) => item.country);
          this.regionsBarChartData.labels = countries;

          const farmCounts = res.data.regionalChart
            .filter((item) => item.country != null)
            .map((item) => item.farmCount);
          this.regionsBarChartData.datasets[0].data = farmCounts;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async getFarmerData(queryParams) {


      const data = { sDate: this.topChartStartDate, eDate: this.topChartEndDate, ...queryParams, cropType: this.currentCropFilterId, country: this.topChartSelectedCountry, state: this.topChartSelectedState };
      console.log(data, 'in getfarmerdata')
      await DashboardReportService.getFarmersReport(data)
        .then((res) => {
          this.farmersData = res.data.farmerStat;
          this.farmerList =  res.data.farmerList.map(el => {
            el.farmArea = parseFloat(el.farmArea).toFixed(2)
            return el
          })
          // const farms = res.data.farmerChart
          //   .filter((item) => item.farmerName != null)
          //   .map((item) => item.farmerName);
          this.farmersBarChartData.labels = [
            this.$t('large'),
            this.$t('medium'),
            this.$t('small'),
          ];

          this.farmersBarChartData.datasets[0].data = []
          this.farmersBarChartData.datasets[0].data.push(
            res.data.farmerStat.largeFarmerCount,
            res.data.farmerStat.mediumFarmerCount,
            res.data.farmerStat.smallFarmerCount,
          );
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async getCropsData(queryParams) {


      const data = { sDate: this.topChartStartDate, eDate: this.topChartEndDate, ...queryParams, cropType: this.currentCropFilterId, country: this.topChartSelectedCountry, state: this.topChartSelectedState };
      await DashboardReportService.getCropsReport(data)
        .then((res) => {
          this.cropsData = res.data;

          const crops = res.data.cropChart.map((item) => item.cropName);
          const areas = res.data.cropChart.map((item) => item.plantedArea);
          const yields = res.data.cropChart.map((item) => item.yield);

          this.cropsAreaBarChartData.labels = crops;
          this.cropsAreaBarChartData.datasets[0].data = areas.map(el => parseFloat(el).toFixed(2));
          this.cropsYieldBarChartData.labels = crops;
          this.cropsYieldBarChartData.datasets[0].data = yields;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getPestReport(queryParams) {
      // this.startLoading();
      let data = { cropId: queryParams?.id, country: this.topChartSelectedCountry, state: this.topChartSelectedState };

      const res = await DashboardReportService.getPestReport(data);
      // .then((res) => {
      this.pestData = { ...res.data.data };

      const pests = res.data.data.pestsChart
        .filter((item) => item.name != null)
        .map((item) => item.name);
      this.pestChartData.labels = pests;
      const counts = res.data.data.pestsChart
        .filter((item) => item.totalArea != null)
        .map((item) => item.totalArea);
      this.pestChartData.datasets[0].data = counts;
      // })
      // .catch((err) => {
      //   console.log(err);
      // })
      // .finally(() => {
      //   this.stopLoading();
      // });
    },
    async getEquipmentReport(queryParams) {
      let data = { sDate: this.topChartStartDate, eDate: this.topChartEndDate, country: this.topChartSelectedCountry, state: this.topChartSelectedState, ...queryParams,};
      await DashboardReportService.getEquipmentReport(data)
        .then((res) => {
          this.equipmentData = res.data.data;
          const equipments = res.data.data.equipmentCount
            .filter((item) => item.name != null)
            .map((item) => item.name);
          this.equipmentChartData.labels = equipments.slice(0, 5);

          const counts = res.data.data.equipmentCount
            .filter((item) => item.count != null)
            .map((item) => item.count);
          this.equipmentChartData.datasets[0].data = counts.slice(0, 5);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getGoalsAchievedReport(cropId = '') {
      let data = { sDate: this.topChartStartDate, eDate: this.topChartEndDate, country: this.topChartSelectedCountry, state: this.topChartSelectedState };

      if (cropId) {
        data.cropId = cropId;
        data.filterBy = 'crop';
      }
      return await DashboardReportService.getGoalsReport(data)
        .then((res) => {
          this.goalsAchievedData = res.data.data;
          const goals = res.data.data.goalsAchievedChart
            .filter((item) => item.name != null)
            .map((item) => item.name);
          this.goalsAchievedChartData.labels = goals.slice(0, 5);

          const counts = res.data.data.goalsAchievedChart
            .filter((item) => item.count != null)
            .map((item) => item.count);
          this.goalsAchievedChartData.datasets[0].data = counts.slice(0, 5);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async customDateFilterSelect() {
      this.customFilterMenu = false;

      await this.getReports();
    },
    async yieldDateFilterSelect() {
      this.yieldFilterMenu = false;
      this.getYieldData();
    },
    async getYieldReport() {
      if (this.filterYieldChartDateBy > 4) return
      this.getYieldData()
    },
    async getYieldData() {

      await DashboardReportService.getYieldChart({
        startDate: this.yieldStartDate,
        endDate: this.yiledEndDate,
        cropTypeId: this.yieldCropType?.id,
        farmIds: this.yieldFarmIds,
        country: this.yieldChartSelectedCountry,
        state: this.yieldChartSelectedState
      })
        .then((res) => {
          this.yieldChartOptions = {...this.yieldChartOptions, ...res.data.info.chartOptions  }
          this.yieldChartData = res.data.info.series
          this.yield = res.data.info.yield
          const translatedMonths = this.yield.map((item) =>
            this.monthLookup[item.month.toLowerCase()]
        );
        res.data.info.series.map((series,index) => {
          this.yieldChartData[index].name = this.$t(series.name)
        })
        this.yieldChartOptions.xaxis.categories = translatedMonths;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async soilDateFilterSelect() {
      this.soilFilterMenu = false;
      this.getSoilData();
    },
    async getSoilReport() {
      if (this.filterSoilQualityDateBy > 4) return
      this.getSoilData()
    },
    async getSoilData() {

      await DashboardReportService.getSoilChart({
        startDate: this.soilStartDate,
        endDate: this.soilEndDate,
        soilValue: this.selectedSoil,
        farmIds: this.soilFarmIds,
        country: this.soilQualitySelectedCountry,
        state: this.soilQualitySelectedState
      })
        .then((res) => {
          this.soilChartOptions = res.data.info.chartOptions
          this.soilChartData = res.data.info.series
          res.data.info.series.map((series,index) => {
            this.soilChartData[index].name = this.$t(series.name)
          })
          this.soil = res.data.info.soil
        })
        .catch((err) => {
          console.log(err);
        });
    },
   
    async getMapData(page = 1, limit = process.env.VUE_APP_ENV === "pre_prod" ? 3 : 1000, delay = 5000) { 
        const payload = {
            sDate: this?.topChartStartDate,
            eDate: this?.topChartEndDate,
            cropType: this?.currentCropFilterId,
            country: this.topChartSelectedCountry,
            state: this.topChartSelectedState,
            farmIds: this.mapFarmIds,
        };

        try {
    
            const res = await DashboardReportService.getMapRegion(payload, page, limit);

            console.log(`Fetched page ${page}:`, res.data);

            if (page === 1) {
                this.mapRegion = res.data;
            } else {
                // Append new data to the existing array
                this.mapRegion = [...this.mapRegion, ...res.data];
            }

            // if the number of items fetched is equal to the limit, there might be more data
            const hasMoreData = res.data.length === limit;


            if (hasMoreData) {
                console.log(`Scheduling next fetch in ${delay / 1000} seconds...`);
                setTimeout(() => {
                    this.getMapData(page + 1, limit, delay); // Recursive call for the next page
                }, delay);
            } else {
                console.log("All map data has been fetched.");
            }

        } catch (err) {
      
            console.error(`Failed to fetch map data for page ${page}:`, err);
        }
    },
  async getFarmUserData(page = 1, limit = process.env.VUE_APP_ENV == "pre_prod" ? 3 : 1000,  delay = 70000) {
    await DashboardReportService.getUserFarmData(page, limit)
      .then((res) => {
        if (page === 1) {
          this.farms = res.data;
        } else {
          this.farms = [...this.farms, ...res.data];
        }
        if (res.data.length === limit && (process.env.VUE_APP_ENV == "prod")) {
          setTimeout(() => {
            this.getFarmUserData(page + 1, limit, delay); // Load next page with delay
          }, delay);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },

    //goal achive report download
    

    //yield download
    async downloadYieldExcel() {
      this.startLoading();
      try {
        const data = this.yield.filter(row => row.month !== 'Invalid date');
        const sheetData = data.map(row => ({
          'Month': row.month,
          'Toal Dry Yield (Kgs)': row.total_dry_yield,
          'Total Fresh Yield (Kgs)': row.total_fresh_yield,
        }));
        const { data: blob } = await this.$http.post('/reports/generate-excel', {
          data: sheetData,
        }, { responseType: 'blob' });
        this.downloadBlob(blob, 'yield.xlsx');
        this.stopLoading();
      } catch (error) {
        console.error(error);
        this.stopLoading();
      }
    },
    async downloadYieldCsv() {
      // this.startLoading()
      try {
        const csvData = this.yield.filter(row => row.month !== 'Invalid date')
        let csv = 'Month, Total Dry Yield (Kgs), Total Fresh Yield (Kgs)\n';
        csvData.forEach((row) => {
          csv += [row.month, row.total_dry_yield, row.total_fresh_yield].join(',');
          csv += "\n";
        });

        const anchor = document.createElement('a');
        anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
        anchor.target = '_blank';
        anchor.download = 'yield.csv';
        anchor.click();
        // this.stopLoading()
      } catch (err) {
        console.log(err)
        // this.stopLoading()
      }
    },
    async downloadYieldPdf() {
      this.startLoading()
      try {
        const data = this.yield.filter(row => row.month !== 'Invalid date').map(x => {
          return {
            month:x.month,
            'total_dry_yield_(kgs)' : x.total_dry_yield,
            'total_fresh_yield_(kgs)': x.total_fresh_yield
          }
        })
        await this.$http.post(`/reports/pdfs`, {
          title: 'Yield Report',
          list: data,
          startDate: this.yieldStartDate,
          endDate: this.yiledEndDate,
        },
          {
            responseType: "arraybuffer",
          }
        ).then(({ data }) => {
          console.log(data)
          this.downloadBlobFile(data, "yieldReport.pdf");
          this.stopLoading()
        })
      } catch (err) {
        console.log(err)
        this.stopLoading()
      }
    },

    //soild quality report
    async downloadSoilQualityExcel() {
      this.startLoading();
      try {
        const data = this.soil.filter(row => row.month !== 'Invalid date');
        const sheetData = data.map(row => ({
          'Month': row.month,
          'Carbon': row.carbon || 'NA',
          'Sulfur': row.sulfur || 'NA',
          'Nitrogen': row.nitrogen || 'NA',
          'Phosphorus': row.phosphorus || 'NA',
          'Potassium': row.potassium || 'NA',
        }));
        const { data: blob } = await this.$http.post('/reports/generate-excel', {
          data: sheetData,
        }, { responseType: 'blob' });
        this.downloadBlob(blob, 'soil.xlsx');
        this.stopLoading();
      } catch (error) {
        console.error(error);
        this.stopLoading();
      }
    },
    async downloadSoilCsv() {
      // this.startLoading()
      try {
        const csvData = this.soil.filter(row => row.month !== 'Invalid date')
        let csv = 'Month, Carbon, Sulfur, Nitrogen, Phosphorus, Potassium\n';
        csvData.forEach((row) => {
          csv += [row.month, row.carbon || 'NA', row.sulfur || 'NA', row.nitrogen || 'NA', row.phosphorus || 'NA', row.potassium || 'NA'].join(',');
          csv += "\n";
        });

        const anchor = document.createElement('a');
        anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
        anchor.target = '_blank';
        anchor.download = 'soil.csv';
        anchor.click();
        // this.stopLoading()
      } catch (err) {
        console.log(err)
        // this.stopLoading()
      }
    },
    async downloadSoilPdf() {
      this.startLoading()
      try {
        const data = this.soil.filter(row => row.month !== 'Invalid date');
        this.$http.post(`/reports/pdfs`, {
          title: 'Soil Report',
          list: data.map(x => {
            return {
              month: x.month,
              carbon: x.carbon,
              sulfur:x.sulfur,
              nitrogen: x.nitrogen,
              phosphorus:x.phosphorus,
              potassium:x.potassium,
            }
          }),
          startDate: this.yieldStartDate,
          endDate: this.yiledEndDate,
        },
          {
            responseType: "arraybuffer",
          }
        ).then(({ data }) => {
          this.downloadBlobFile(data, "soilReport.pdf");
          this.stopLoading()
        })
         this.stopLoading()
      } catch (err) {
        console.log(err)
        this.stopLoading()
      }
    },
  },
  mixins: [loadingMixin, DownloadMixin, DashboardReportMixin],
};
</script>

<style scoped>
.v-item-group {
  border: 1px solid #00bd73 !important;
  height: 38px;
}
.goal-achive-dw-btn{
  margin-right: 22px;
  margin-top: 8px;
}
.goal-achivem{
  display: flex;
  justify-content: right;
}
.apply-farm-filter{
    position: sticky;
    bottom:0;
    background: #FFF;
    padding: 6px;
    padding-top: 10px;
}
</style>