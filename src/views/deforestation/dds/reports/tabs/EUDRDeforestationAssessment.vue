<template>
  <div>
    <v-container fluid>
      <v-card elevation="0">
        <template v-if="checkEUDRExisting">
          <div class="d-flex mb-4 pt-10">
            <h2>
              {{ $t("deforestation.AnalysisOfDeforestationStatus") }}
              <v-tooltip top color="00BD73" max-width="350">
                <template v-slot:activator="{ on, attrs }">
                   <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                          mdi-alert-circle
                    </v-icon>
                </template>
                <span>{{
                  $t("deforestation.AnalysisOfDeforestationStatusTT")
                }}</span>
              </v-tooltip>
            </h2>
            <v-spacer></v-spacer>
          </div>
          <v-row class="d-flex mb-4 mt-10">
            <v-sheet style="border: 1px solid #ccc; border-radius: 0px;"
              class="d-flex align-center justify-center flex-wrap text-center mx-auto px-4" height="200" width="100%"
              rounded>
              <v-progress-linear :indeterminate="reportLoading" v-model="progressValue" style="max-width: 90%;"
                class="mt-15" :color="progressColor" rounded :height="8"></v-progress-linear>
              <span v-if="!reportLoading" style="color: green;" class="ml-5 mt-15">{{ $t("deforestation.complete") }}</span>
              <h4 class="mb-15">
                {{
                  $t('dueDiligence.automatedDeforestationProgressText')
                }}
              </h4>
            </v-sheet>
          </v-row>
        </template>

        <v-row class="mt-10" v-if="risk">
          <h4 style="color: red; max-width: 60%;"
            class="d-flex align-center justify-center flex-wrap text-center mx-auto px-4">
            {{
              $t('dueDiligence.someRiskWereIdentifiedText')
            }}
          </h4>
        </v-row>

        <div class="d-flex mb-4 pt-10">
          <h2>
            {{ $t("deforestation.productionPlaces") }}
            <v-tooltip top color="00BD73" max-width="350">
              <template v-slot:activator="{ on, attrs }">
                <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                  v-on="on">
                  mdi-alert-circle
                </v-icon>
              </template>
              <span>{{ $t("deforestation.productionPlacesTTasd") }}</span>
            </v-tooltip>
          </h2>
          <v-spacer></v-spacer>
        </div>
        <v-data-table  :headers="tableHeaders" :items="filterData" :items-per-page="options.limit" hide-default-footer :loading="loading"
          :options.sync="options" :loading-text="$t('deforestation.loadingProductionPlaces')
            ">
          <template v-slot:top="{ }">
            <!-- Desktop Controls -->
            <div class="filter-controls-bar d-none d-lg-flex mt-5">
              <!-- Left side: Search and Filters -->
              <div class="filter-controls-left">
                <div class="filter-item">
                  <label for="text">&nbsp;</label>
                  <v-text-field 
                    prepend-inner-icon="mdi-magnify" 
                    height="5px" 
                    :placeholder="$t('search')" 
                    dense
                    v-model="search" 
                    @input="debouncedGetProductionPlaces" 
                    class="search-field"
                    v-bind="getTextFieldProps()">
                  </v-text-field>
                </div>

                <div class="filter-item">
                  <label for="text">{{ $t("country") }}</label>
                  <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                        mdi-alert-circle
                      </v-icon>
                    </template>
                    <span>{{ $t("deforestation.productionPlacesCountryInfo") }}</span>
                  </v-tooltip>
                  <v-autocomplete 
                    v-model="countryModel" 
                    item-text="text" 
                    item-value="val" 
                    :items="countries"
                    :label="$t('deforestation.allCountries')" 
                    @change="getProductionPlaces" 
                    dense
                    v-bind="getSelectProps()">
                  </v-autocomplete>
                </div>

                <div class="filter-item">
                  <label for="text">{{ $t('deforestation.EUDRDeforestationStatus') }}</label>
                  <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                        mdi-alert-circle
                      </v-icon>
                    </template>
                    <span>{{ $t("deforestation.EUDRDeforestationStatusTT") }}</span>
                  </v-tooltip>
                  <v-autocomplete  
                    v-model="statusModel" 
                    item-text="text" 
                    item-value="val" 
                    :items="allStatus"
                    @change="getProductionPlaces" 
                    dense
                    v-bind="getSelectProps()">
                  </v-autocomplete>
                </div>
              </div>

              <!-- Right side: Pagination and Actions -->
              <div class="filter-controls-right">
                <div class="pagination-info">
                  {{ from }} - {{ to }} of {{ totalProductionPlaces }}
                </div>
                <v-btn 
                  class="mx-2" 
                  fab 
                  small 
                  outlined 
                  color="primary" 
                  :disabled="options.page <= 1"
                  @click="pageChange(false)"
                  v-bind="getButtonProps()">
                  <v-icon dark>
                    mdi-chevron-left
                  </v-icon>
                </v-btn>
                <v-btn 
                  class="mx-2" 
                  fab 
                  small 
                  outlined 
                  color="primary" 
                  :disabled="options.page >= totalPages"
                  @click="pageChange(true)"
                  v-bind="getButtonProps()">
                  <v-icon dark>
                    mdi-chevron-right
                  </v-icon>
                </v-btn>
                <v-menu v-model="customizeMenu" :close-on-content-click="false" :nudge-width="200"
                  left :min-width="417">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn class="mx-2" fab small outlined color="primary" v-bind="{...attrs, ...getButtonProps()}" v-on="on">
                      <v-icon dark> mdi-cog-outline </v-icon>
                    </v-btn>
                  </template>

                  <v-card width="417">
                    <v-list>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>{{
                            $t("deforestation.customization")
                          }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider></v-divider>
                      <div class="pl-3 pt-2 font-weight-normal">
                        {{ $t("deforestation.recordsPerpage") }}
                      </div>
                      <v-list-item>
                        <v-list-item-content>
                          <v-slider v-model="itemsPerPageSlider"
                            :tick-labels="itemsPerPageOptions" :max="3" step="1"
                            ticks="always" tick-size="4"></v-slider>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider class="mt-n3"></v-divider>
                    </v-list>
                    <v-card-text>
                      <v-container fluid>
                        <v-row>
                          <v-col class="mt-n9" cols="6" v-for="header in headers" :key="header.value">
                            <v-checkbox v-if="header.text.length > 0" v-model="selectedHeaders" :label="header.text"
                              color="primary" :value="header.text" hide-details
                              :disabled="header.text == 'ID' || header.text == 'Tag'"></v-checkbox>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-layout justify-center>
                      <v-card-actions class="mb-5">
                        <v-spacer></v-spacer>
                        <v-btn outlined color="primary" @click="resetDefault" width="190">
                          {{ $t("deforestation.restoreDefault") }}
                        </v-btn>
                        <v-btn color="primary" @click="resetTableStructure" width="190">
                          {{ $t("deforestation.apply") }}
                        </v-btn>
                      </v-card-actions>
                    </v-layout>
                  </v-card>
                </v-menu>
                <v-btn class="mx-2" @click="exportToPDF" fab small outlined color="primary" v-bind="getButtonProps()">
                  <v-icon dark>
                    mdi-tray-arrow-down
                  </v-icon>
                </v-btn>
              </div>
            </div>

            <!-- Mobile Controls -->
            <div class="mobile-controls d-flex d-lg-none mt-5">
              <div class="mobile-search">
                <v-text-field 
                  prepend-inner-icon="mdi-magnify" 
                  dense
                  :placeholder="$t('search')" 
                  v-model="search" 
                  @input="debouncedGetProductionPlaces"
                  v-bind="getTextFieldProps()">
                </v-text-field>
              </div>
              <div class="mobile-filters">
                <v-autocomplete 
                  v-model="countryModel" 
                  item-text="text" 
                  item-value="val" 
                  :items="countries"
                  :label="$t('deforestation.allCountries')" 
                  @change="getProductionPlaces" 
                  dense
                  v-bind="getSelectProps()">
                </v-autocomplete>
                <v-autocomplete  
                  v-model="statusModel" 
                  item-text="text" 
                  item-value="val" 
                  :items="allStatus"
                  @change="getProductionPlaces" 
                  dense
                  v-bind="getSelectProps()">
                </v-autocomplete>
              </div>
            </div>

            <!-- Mobile Pagination -->
            <div class="mobile-pagination d-flex d-lg-none mt-3">
              <div class="mobile-pagination-info">
                {{ from }} - {{ to }} of {{ totalProductionPlaces }}
              </div>
              <div class="mobile-pagination-controls">
                <v-btn 
                  fab 
                  small 
                  outlined 
                  color="primary" 
                  :disabled="options.page <= 1"
                  @click="pageChange(false)"
                  v-bind="getButtonProps()">
                  <v-icon dark>
                    mdi-chevron-left
                  </v-icon>
                </v-btn>
                <v-btn 
                  fab 
                  small 
                  outlined 
                  color="primary" 
                  :disabled="options.page >= totalPages"
                  @click="pageChange(true)"
                  v-bind="getButtonProps()">
                  <v-icon dark>
                    mdi-chevron-right
                  </v-icon>
                </v-btn>
              </div>
            </div>
          </template>
            <template v-if="filterData.length" v-slot:body="{ items }">
              <tbody>
                <tr v-for="item in items" :key="item.id" style="position: relative; width: 0; height: 0"
                  @mouseover="selectItem(item)" @mouseleave="selectItem(false)">
                  <template v-for="h in tableHeaders">
                  <td v-if="h.value == 'farm.farmName'" :key="h.value" class="text-truncate">
                    {{ item.farm.farmName || "N/A" }}<br />
                    {{ item.farm.id }}
                  </td>

                  <td v-if="h.value == 'farm.userDdsAssoc.fullName'" :key="h.value"  class="text-truncate">
                    {{ item.farm.userDdsAssoc.firstName }}
                    {{ item.farm.userDdsAssoc.lastName }}
                  </td>

                  <td v-if="h.value == 'farm.address'" :key="h.value"  class="text-truncate" style="max-width: 300px;">
                    {{ item.farm.address }}
                  </td>

                  <td v-if="h.value == 'farm.area'" :key="h.value"  class="text-truncate">
                    {{ item.farm.area ? parseFloat(item.farm.area * 0.404686).toFixed(5) : '' }}
                  </td>

                  <td v-if="h.value == 'farmType'" :key="h.value"  class="text-truncate">
                    {{ item.farmType }}
                  </td>

                  <td v-if="h.value == 'eudr_deforestation_status'" :key="h.value" >
                    <div v-if="checkEUDRExisting" class="eudr_class">

                      <v-tooltip top color="black" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn v-bind="attrs" v-on="on"
                        
                            small rounded min-width="200" depressed
                            :class="[getEUDRDeforestationStatus(item.deforestationStatus || item.errorStatus).class, 'non-clickable']"
                            height="34">
                            {{ getEUDRDeforestationStatus(item.deforestationStatus || item.errorStatus).text }}
                          </v-btn>
          
                        </template>
                        <span>{{ getEUDRDeforestationStatus(item.deforestationStatus ||
                          `${item.errorStatus}_tt`).text}}</span>
                      </v-tooltip>

                    </div>
                    <template v-else>
                      <div class="d-flex" v-if="item.deforestationStatus && !item.isExpired">
                        <template v-if="getEUDRDeforestationStatus(item.deforestationStatus).text !== 'N/A'">
                          <v-btn class="mr-2" small rounded min-width="200" depressed :class="getEUDRDeforestationStatus(item.deforestationStatus).class" height="34"
                        v-bind="getButtonProps()">
                          {{ getEUDRDeforestationStatus(item.deforestationStatus).text }}
                        </v-btn>
                        <img class="mr-2"  @click="handleViewEudrAssessment(item)" :src="isIndonesianClient ? '/img/id/todo-list.svg' : isKenyaClient ? '/img/ke/todo-list.svg' : '/icons/todo-list.png'" style="width: 34px; height: 34px; border-radius: 50%;" />
                        
                          <v-tooltip top color="black" max-width="350">
                              <template v-slot:activator="{ on, attrs }">
                                  <v-icon 
                                  v-bind="attrs"
                                  v-on="on" 
                                  color="primary" 
                                  class="cursor-pointer" 
                                  @click="onClickRemoveDeforestationStatus(item.farm)">
                                  mdi-delete
                                  </v-icon>
                              </template>
                              <span>{{ $t('deforestation.removeEudrDeforestationStatus') }}</span>
                          </v-tooltip>
                        </template>
                      </div>
                      <span class="text-decoration-underline cursor-pointer" v-else
                        @click="handleUploadEudrAssessment(item)" v-bind="getButtonProps()">{{ $t('uploadAssessment') }}</span>
                    </template>
                  </td>

                  <td v-if="h.value == 'status'" :key="h.value" >
                    <div class="d-flex">
                      <v-menu v-if="checkEUDRExisting">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn x-small fab v-bind="{...attrs, ...getButtonProps()}" v-on="on" color="primary">
                            <img :src="isIndonesianClient ? '/img/id/todo-list.svg' : isKenyaClient ? '/img/ke/todo-list.svg' : '/icons/todo-list.png'" style="width: 34px; height: 34px; border-radius: 50%;" />
                          </v-btn>
                        </template>
                        <v-list>
                          <v-list-item v-for="(menu, i) in (item.deforestationInfo && item.deforestationInfo.deforestationStatus ? menus : menusWithoutReport)" :key="i">
                            <v-list-item-title class="cursor-pointer" @click="showModel(menu.id, item)">{{ menu.title }}</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                      <div>
                        <v-icon class="ml-5 primary--text" style="margin-left: 20px;"
                        @click="removeFarm(item.farmId)" v-bind="getButtonProps()">mdi-trash-can</v-icon>
                      </div>
                    </div>
                  </td>
                  </template>
                </tr>
              </tbody>
            </template>
            <template v-slot:footer></template>
          </v-data-table>

        <template>
          <div class="d-flex mt-5" style="align-items: center;">
            <v-spacer></v-spacer>
            <img :src="isIndonesianClient ? '/img/id/todo-list.svg' : isKenyaClient ? '/img/ke/todo-list.svg' : '/icons/todo-list.png'" style="width: 34px; height: 34px; border-radius: 50%;" />
            <span class="ml-2">{{ $t("dueDiligence.viewReport") }}</span>
            <v-icon class="ml-5 primary--text">mdi-trash-can</v-icon>
            <span class="ml-2">{{ $t("delete") }}</span>
          </div>
        </template>



        <v-row class="my-10 mx-2" v-if="productionPlaces.length">
          <template v-if="!checkEUDRExisting">
            <v-btn color="primary" dark class="mr-2 mb-2" @click="handleUploadEudrAssessment(productionPlaces)" v-bind="getButtonProps()">
              {{ $t("uploadOneDeforestationAssessmentForAllFarms") }}
            </v-btn>
          </template>
          <template v-else>
            <v-btn color="primary" dark class="mr-2 mb-2" @click="removeAllHighRiskFarm" v-bind="getButtonProps()">
              {{ $t("deforestation.removeAllHighRiskFarm") }}
            </v-btn>
            <v-btn color="primary" dark class="mr-2 mb-2" @click="removeAllLowRiskFarm" v-bind="getButtonProps()">
              {{ $t("deforestation.removeAllLowRiskFarm") }}
            </v-btn>
            <v-btn color="primary" dark class="mr-2 mb-2" @click="triggerFileInput" v-bind="getButtonProps()">
              {{ $t("deforestation.attachRiskMigrationDoc") }}
            </v-btn>           
            <v-tooltip top color="black" max-width="220">
              <template v-slot:activator="{ on, attrs }">
                  <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                    mdi-alert-circle
                  </v-icon>
              </template>
              <span>{{ $t("deforestation.attachRiskMigrationDocTT") }}</span>
            </v-tooltip>

            <!-- <input type="file" ref="fileInput" accept="application/pdf" @change="handleFileChange"
              style="display: none;" /> -->
               <input type="file" ref="fileInput" accept="application/pdf" @change="handleFileChange" style="display: none;" />
  
              <!-- Conditional rendering for file and comment section -->
              <div v-if="s3Location || highRiskComment">
                <!-- File input section -->
                <input type="file" ref="fileInput" accept="application/pdf" @change="handleFileChange" style="display: none;" />
                
                <!-- Comment section -->
                <!-- <div class="comment-section">
                  <p>{{ highRiskComment }}</p>
                </div> -->
  </div>
          </template>
        </v-row>
        <v-row class="mt-10 d-flex mb-20 ml-4" v-if="fileUploading || highRiskComment || s3Location">
          <div>
            <v-sheet style="border: 1px solid #ccc; border-radius: 0px;"
              class="d-flex align-center justify-center flex-wrap text-center px-4" height="100" width="100">
              <v-icon dark style="color: green" @click="openPdf">
                mdi-eye
              </v-icon>
              {{ uploadFileType }}
            </v-sheet>
            <h3 style="color:green" class="pt-1 pb-10">
              {{ uploadedFileName }}
            </h3>
          </div>
          <div style="width:30%">
            <v-textarea class="px-4" :rows="3" v-model="highRiskComment" :placeholder="$t('activationKey.comments')" @input="handleHightRiskMitigation" v-bind="getTextareaProps()"></v-textarea>
          </div>
          <div></div>
        </v-row>
      </v-card>
      <!-- removed farms table -->
      <v-card class="grey">
        <h3 class="pt-5 ml-5">{{ $t("deforestation.removedFarms") }}</h3>
        <v-card-text>
          <v-data-table :headers="headersRemoveFarm" :items="removedProductionPlaces" :items-per-page="options.limit"
            hide-default-footer :loading="loading" :options.sync="removedProductionPlaceOptions" :loading-text="$t('deforestation.loadingProductionPlaces')
              ">
            <template v-slot:top="{ }">
              <div class="d-flex mt-5">
                <v-spacer></v-spacer>
                <div class="py-1 title">
                  {{ removedFrom }} - {{ removedTo }} of
                  {{ totalRemovedProductionPlaces }}
                </div>
                <v-btn class="mx-2" fab small outlined color="primary" :disabled="removedProductionPlaceOptions.page <= 1"
                  @click="pageChangeRemovedProductionPlace(false)" v-bind="getButtonProps()">
                  <v-icon dark>
                    mdi-chevron-left
                  </v-icon>
                </v-btn>
                <v-btn class="mx-2" fab small outlined color="primary" :disabled="removedProductionPlaceOptions.page >= totalRemovedPages
                  " @click="pageChangeRemovedProductionPlace(true)" v-bind="getButtonProps()">
                  <v-icon dark>
                    mdi-chevron-right
                  </v-icon>
                </v-btn>
              </div>
            </template>
            <template v-if="removedProductionPlaces.length" v-slot:body="{ items }">
              <tbody>
                <tr v-for="item in items" :key="item.id" style="position: relative; width: 0; height: 0"
                  @mouseover="selectItem(item)" @mouseleave="selectItem(false)">
                  <td class="text-truncate">
                    {{ item.farm.farmName || "N/A" }}<br />
                    {{ item.farm.id }}
                  </td>

                  <td class="text-truncate">
                    {{ item.farm.userDdsAssoc.firstName }}
                    {{ item.farm.userDdsAssoc.lastName }}
                  </td>

                  <td class="text-truncate" style="max-width: 300px;">
                    {{ item.farm.address }}
                  </td>

                  <td class="text-truncate">
                    {{ item.farm.area ? parseFloat(item.farm.area * 0.404686).toFixed(5) : '' }}
                  </td>

                  <td class="text-truncate">
                    {{ item.farmType }}
                  </td>

                  <td>
                    <div  class="eudr_class">

                    <v-tooltip top color="black" max-width="350">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn       v-bind="attrs"
                                v-on="on"  v-if="getEUDRDeforestationStatus(item.deforestationStatus || item.errorStatus).text !== 'N/A'" small rounded min-width="200" depressed :class="getEUDRDeforestationStatus(item.deforestationStatus || item.errorStatus).class" height="34"
                    >
                      {{ getEUDRDeforestationStatus(item.deforestationStatus || item.errorStatus).text }}
                    </v-btn>
                    <span v-else>N/A</span>
                            </template>
                            <span>{{ getEUDRDeforestationStatus(item.deforestationStatus || `${item.errorStatus}_tt`).text}}</span>
                        </v-tooltip>

                    </div>
                  </td>

                  <td>
                    <div class="d-flex">
                      <div v-if="!!(item.deforestationInfo && item.deforestationInfo.deforestationStatus)">
                        <v-tooltip top color="00BD73" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <img v-bind="attrs" v-on="on" @click="
                              $router.push({
                                name: 'EudrAssessmentReport',
                                params: { id: item.deforestationInfo.deforestationReportRequestId, type: 'assignment' },
                              })
                              " :src="isIndonesianClient ? '/img/id/todo-list.svg' : '/icons/todo-list.png'" style="width: 34px; height: 34px; border-radius: 50%;" />

                          </template>
                          <span>{{ $t('dueDiligence.viewReport') }}</span>
                        </v-tooltip>

                      </div>
                      <div style="margin-top: 5px; cursor: pointer;">
                        <v-tooltip top color="00BD73" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <img v-bind="{...attrs, ...getButtonProps()}" v-on="on" @click="restoreFarm(item.id)" class="ml-2" src="/icons/undo.png"
                              style="width: 24px; height: 24px; border-radius: 50%; margin-left: 20px;" />
                          </template>
                          <span>{{ $t("deforestation.undoDelete") }}</span>
                        </v-tooltip>

                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </template>
            <template v-slot:footer></template>
          </v-data-table>
          <template>
            <div class="d-flex mt-5" style="align-items: center; justify-content: flex-end;">
              <v-spacer></v-spacer>
              <img :src="isIndonesianClient ? '/img/id/todo-list.svg' : isKenyaClient ? '/img/ke/todo-list.svg' : '/icons/todo-list.png'" style="width: 34px; height: 34px; border-radius: 50%;" />
              <span class="ml-2">{{ $t("dueDiligence.viewReport") }}</span>
              <v-icon class="ml-5 primary--text">mdi-undo</v-icon>
              <span class="ml-2">{{ $t("deforestation.undoDelete") }}</span>
            </div>
          </template>
        </v-card-text>
      </v-card>
    </v-container>
    <DisputesDialog v-if="showDisputeModal" :dialogU="showDisputeModal" :reportRequestId="targetProductionPlaceDeforestationId"
      @closeDisputeDialog="showDisputeModal = false"></DisputesDialog>
    <MitigationDialog v-if="showMitigtionModal" :dialogU="showMitigtionModal"
      :manualRiskMitigationData="getManualRiskMitigationData" :productionPlaceId="targetedProductionPlaceId" :productionPlaceDetail="targetProductionPlace" @closeBulkUpload="showMitigtionModal = false" @mitigated="callbackMitigation"></MitigationDialog>
    <UploadAssessment v-if="showUploadAssessment" :dialog="showUploadAssessment"
      :productionPlaceDetails="currentProductionDetails" :diligenceReportID="diligenceId"
      @closeUploadAssessmentModal="showUploadAssessment = false"
      @saveEudrAssessment="uploadedEudrDeforestations"></UploadAssessment>
    <ViewAssessment v-if="showViewAssessment" :dialog="showViewAssessment"
      :productionPlaceDetails="currentProductionDetails" :diligenceReportID="diligenceId"
      @closeViewAssessmentModal="showViewAssessment = false"
      @saveEudrAssessment="uploadedEudrDeforestations"></ViewAssessment>
      <confirm-box 
        ref="removeEudrDeforestationStatus"
        v-if="eudrDeforestationStatusConfirmDelete.dialog"
        v-bind="eudrDeforestationStatusConfirmDelete" 
        v-on="eventHandlersDeforestationStatus" 
        />
      <confirm-box 
      :title="farmConfirmDelete.title"
      :message="farmConfirmDelete.message"
      :cancelBtnText="farmConfirmDelete.cancelBtnText" 
      :confirmBtnText="farmConfirmDelete.confirmBtnText"
      :confirmData="farmConfirmDelete.confirmData" 
      :dialog="farmConfirmDeleteDialog" 
      @cancel:action="farmConfirmDeleteDialog = false"
      @continue:action="confirmRemoveFarm" />
      <ProcessingDialog
        :dialog="showProcessingDialog"
        @close="onProcessingDialogClose"
        :description="analyzingDeforestation.analyzingDesc"
        :heading="analyzingDeforestation.analyzingStatus"
        :startTimerModel="startTimer"
        :hasTimer="true"
      />
  </div>
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import download from "@/mixins/DownloadMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import DateMixin from "@/mixins/DateMixin";
import DeforestationService from "@/_services/DeforestationService";
import ActivityLogService from "@/_services/ActivityLogService";
import DisputesDialog from "../components/eudr/DisputesDialog.vue";
import MitigationDialog from "../components/eudr/MitigationDialog.vue";
import S3UploadService from "@/_services/S3UploadService";
import UploadAssessment from '../components/eudr/UploadAssessment.vue';
import ViewAssessment from '../components/eudr/ViewAssessment.vue';
import { mapGetters } from 'vuex'
import { debounce } from 'lodash'
import { isDeforestationExpired, isKenyaClient, wait } from '../../../../../utils';
import ConfirmBox from "@/components/ConfirmBox";
import ProcessingDialog from '../components/ProcessingDialog.vue';
import tableCustomizationMixin from "@/mixins/tableCustomizationMixin";
import { isIndonesianClient } from "@/utils";

export default {
  components: {
    MitigationDialog,
    DisputesDialog,
    UploadAssessment,
    ViewAssessment,
    ProcessingDialog,
    "confirm-box": ConfirmBox,

  },
  created() {
    const prefs = this.getTablePrefs('ProductionPlacesTable');
    if (prefs) {
      this.selectedHeaders = prefs.selectedHeaders;
      this.itemsPerPageSlider = this.itemsPerPageOptions.indexOf(prefs.itemsPerPage);
    } else {
      this.selectedHeaders = this.allSelectedHeaders;
      this.itemsPerPageSlider = 1;
    }
    this.options.limit = this.itemsPerPageOptions[this.itemsPerPageSlider];
    this.tableHeaders = this.headers.filter(h => this.selectedHeaders.includes(h.text));
    this.setEventHandlers();
  },

  async mounted() {
    this.startLoading();
    if (this.checkEUDRExisting) {
      await this.getBulkDeforestationReport();
    }
    await this.fetchData();
    this.$store.dispatch('eudrDDS/setDiligenceData', {
      diligenceId: this.diligenceId
    });
    this.$emit('calculateWarningsForDeforestationAssessment', this.diligenceId);
    this.stopLoading();
  },
  props: {
    diligenceId: {
      type: Number,
      required: true,
    },
    updatedProductionPlaces: {
      type: Array,
    },
  },
  computed: {
    isKenyaClient() {
      return isKenyaClient();
    },
    isIndonesianClient() {
      return isIndonesianClient();
    },
    ...mapGetters("eudrDDS", ["getDiligenceDetails", "getDdsUserRole"]),
    ...mapGetters("eudrSettings", ["get_EUDR_Settings"]),
    targetProductionPlaceDeforestationId() {
      if(!this.targetProductionPlace) return null;
      return this.targetProductionPlace.diligenceReportProductionPlaceArray[0]?.productionPlaceDeforestationInfo?.deforestationReportRequestId;
    },
    totalPages() {
      return parseInt(Math.ceil(this.totalProductionPlaces / 10));
    },
    totalRemovedPages() {
      return parseInt(Math.ceil(this.totalRemovedProductionPlaces / 10));
    },
    getCurrentUser() {
      return this.$store.getters.getUser;
    },
    filterData() {
      if (
        (this.countryModel && this.countryModel !== "") ||
        (this.producerModel && this.producerModel !== "") ||
        (this.statusModel && this.statusModel !== "")
      ) {
        const list = this.productionPlaces.filter((item) => {
          return (
            // (!this.countryModel[0] ||
            //   item.farm.userDdsAssoc.countryId === this.countryModel[0]) &&
            (!this.producerModel ||
            item.farm.userDdsAssoc.firstName === this.producerModel) &&
            (!this.statusModel ||
              item.eudr_deforestation_status === this.statusModel)
          );
        });
        return list;
      } else {
        return this.productionPlaces;
      }
    },
    checkEUDRExisting(){
      return this.updatedEUDRAssessmentType === 'Dimitra Deforestation Report' ? true : false;
    },
    menusWithoutReport() {
      return this.menus.filter(menu => menu.id !== 'assessment' && menu.id !== 'disputes');
    },
  },
 
  data() {
    return {
      startTimer: 0,
      customizeMenu:false,
      itemsPerPageSlider: 1,
      itemsPerPageOptions: [5, 10, 25, 50],
			customizeMenuAll: '',
      selectedHeaders: [
      ],
      tableHeaders:[

      ],
      allSelectedHeaders:[
        this.$t("deforestation.productionPlacesFarmAndFarmId"),
        this.$t("deforestation.producerName"),
        this.$t("deforestation.addressOfProduction"),
        this.$t("deforestation.areaHa"),
        this.$t("deforestation.type"),
        this.$t("deforestation.EUDRDeforestationStatus"),
        this.$t("dueDiligence.actions"),
      ],
      getManualRiskMitigationData:{
        riskMitigationComment: "",
        riskMitigationFiles: null
      },
      analyzingDeforestation:{
        analyzingStatus : this.$t('deforestation.processingDialog.modalHeader'),
        analyzingDesc: this.$t('deforestation.processingDialog.modalDescription_second')
      },
      showProcessingDialog: false,
      menus: [
        { title: this.$t('dueDiligence.viewAssessment'), id: "assessment" },
        { title: this.$t('dueDiligence.disputes'), id: "disputes" },
        { title: this.$t('dueDiligence.manualRiskMitigation'), id: "mitigation" },
      ],
      showDisputeModal: false,
      showMitigtionModal: false,
      progressValue: 0,
      progressColor: "green",
      farm: {
        name: "",
        registrationNo: "",
        govRegistrationNo: "",
        farmType: "",
        farmOwner: null,
        lat: "",
        log: "",
        farmOwnershipType: "personal",
        country: "",
        state: "",
        city: "",
        countryId: null,
        stateId: null,
        cityId: null,
        address: "",
        area: "",
        areaUomId: 2,
        parameter: 0,
        parameterUomId: 0,
        street: "",
        farmSize: 0,
        farmSizeUomId: 0,
        farmPerimeter: 0,
        farmPerimeterUomId: 1,
        farmGeofence: [],
        farmingGoalOptId: null,
        productionType: "",
        certifications: [],
        farmingGoalsIds: [],
        farmerFirstName: "",
        farmerMiddleName: "",
        farmerLastName: "",
        isTechnician: false,
        technicianId: null,
        farmerId: "",
        userId: "",
        farmGeofenceName: "",
        farmGeofenceCategory: "",
        farmTitleDocument: "",
        farmTitleDocumentUrl: "",
      },
      countryModel: [],
      statusModel: "",
      producerModel: "",

      countries: [{ text: this.$t("deforestation.allCountries"), val: null }],
      allStatus: [
                { text: this.$t("deforestation.allStatus"), val: ""},
                { text: this.$t("deforestation.veryHighProbability"), val: "Very High Deforestation Probability"},
                { text: this.$t("deforestation.highProbability"), val: "High Deforestation Probability" },
                { text: this.$t("deforestation.mediumProbability"), val: "Medium Deforestation Probability" },
                { text: this.$t("deforestation.lowProbability"), val: "Low Deforestation Probability" },
                { text: this.$t("deforestation.veryLowProbability"), val: "Very Low Deforestation Probability" },
                { text: this.$t("deforestation.zeroOrNegligibleProbability"), val: "Zero/Negligible Deforestation Probability"},
                { text: this.$t("dueDiligence.manualMitigated"), val: "Manually Mitigated" },
            ],
      allProducers: [{ text: this.$t("deforestation.allProducer"), val: "" }],
      productionPlaces: [],
      removedProductionPlaces: [],
      totalProductionPlaces: 0,
      totalRemovedProductionPlaces: 0,
      copyReport: [],
      loading: true,
      tab: 0,
      selectedItem: false,
      options: {
        page: 1,
        limit: 10,
        diligenceReportId: 1,
      },

      removedProductionPlaceOptions: {
        page: 1,
        limit: 10,
        diligenceReportId: 1,
      },
      search: "",
      from: 0,
      to: 0,
      removedFrom: 0,
      removedTo: 0,
      headers: [
        {
          text: this.$t("deforestation.productionPlacesFarmAndFarmId"),
          align: "start",
          value: "farm.farmName",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("deforestation.producerName"),
          align: "start",
          value: "farm.userDdsAssoc.fullName",
          class: "black--text",
          sortable: true,

        },

        {
          text: this.$t("deforestation.addressOfProduction"),
          align: "start",
          value: "farm.address",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("deforestation.areaHa"),
          align: "start",
          value: "farm.area",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("deforestation.type"),
          align: "center",
          value: "farmType",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("deforestation.EUDRDeforestationStatus"),
          align: "center",
          value: "eudr_deforestation_status",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("dueDiligence.actions"),
          align: "center",
          value: "status",
          class: "black--text",
          sortable: false,
        },
      ],
      headersRemoveFarm: [
        {
          text: this.$t("deforestation.productionPlacesFarmAndFarmId"),
          align: "start",
          value: "farm.farmName",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("deforestation.producerName"),
          align: "start",
          value: "farm.userDdsAssoc.fullName",
          class: "black--text",
          sortable: true,

        },

        {
          text: this.$t("deforestation.addressOfProduction"),
          align: "start",
          value: "farm.address",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("deforestation.areaHa"),
          align: "start",
          value: "farm.area",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("deforestation.type"),
          align: "center",
          value: "farmType",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("deforestation.EUDRDeforestationStatus"),
          align: "center",
          value: "eudr_deforestation_status",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("dueDiligence.actions"),
          align: "center",
          value: "status",
          class: "black--text",
          sortable: false,
        },
      ],
      breadcrumbs: [
        {
          text: this.$t("deforestation.dueDeligence"),
          disabled: false,
          to: { name: "CreateNewDueDeligenceReport" },
          exact: true,
        },
        {
          text: this.$t("deforestation.createNewReport"),
          disabled: true,
          href: "breadcrumbs_link_1",
        },
      ],
      uploadedFile: null,
      s3Location: "",
      uploadedFileName: "",
      fileError: "No error",
      s3key: "",
      uploadFileType: "",
      fileUploading: false,
      targetedProductionPlaceId: null,
      targetProductionPlace: null,
      risk: false,
      reportLoading: true,
      highRiskComment: null,
      showUploadAssessment: false,
      showViewAssessment: false,
      currentProductionDetails: null,
      updatedEUDRAssessmentType: "Dimitra Deforestation Report",
    
      farmConfirmDeleteDialog : false,
      farmConfirmDelete: {
        title: this.$t("confirmDialog.farm.delete.title"),
        message: this.$t("confirmDialog.farm.delete.message"),
        confirmBtnText: this.$t("confirmDialog.farm.delete.confirmBtn"),
        cancelBtnText: this.$t("cancel"),
        confirmData: {},
      },
      eudrDeforestationStatusConfirmDelete: {
        title: this.$t("confirmDialog.status.delete.title"),
        message: this.$t("confirmDialog.status.delete.message"),
        cancelBtnText: this.$t("cancel"),
        confirmBtnText: this.$t("confirmDialog.status.delete.confirmBtn"),
        confirmData: {}, 
        dialog: false,
      },
      eventHandlersDeforestationStatus: {}, 
    }
  },
  methods: {
    resetDefault() {
          this.selectedHeaders = this.allSelectedHeaders;
          this.tableHeaders = this.headers;
          this.options.limit = 10;
          this.itemsPerPageSlider = 1;
          this.clearTablePrefs('ProductionPlacesTable');
          this.getProductionPlaces();
        },
       async resetTableStructure() {
          this.customizeMenu = false;
          if (!this.selectedHeaders.length) {
            this.selectedHeaders = this.allSelectedHeaders;
          }
          this.tableHeaders = this.headers.filter(h => this.selectedHeaders.includes(h.text));
          const selectedPerPage = this.itemsPerPageOptions[this.itemsPerPageSlider];
          this.options.limit = selectedPerPage;
          this.options.itemsPerPage = selectedPerPage;

          console.log(selectedPerPage, "selectedPerPage")
          this.setTablePrefs('ProductionPlacesTable', {
            selectedHeaders: this.selectedHeaders,
            itemsPerPage: selectedPerPage
          });

          await this.getProductionPlaces();
        },
    setEventHandlers() {
      this.eventHandlersDeforestationStatus = {
        'cancel:action': () => this.clearEUDRDeforestationStatusCancel(),
        'continue:action': (action, farmDetails) => this.clearEUDRDeforestationStatus(farmDetails), // Receive farmDetails
      };
    },
    clearEUDRDeforestationStatusCancel(){
      this.eudrDeforestationStatusConfirmDelete.confirmData = {};
      this.eudrDeforestationStatusConfirmDelete.dialog = false;
    },
    callbackMitigation(){
      this.getProductionPlaces();
      this.$emit('calculateWarningsForDeforestationAssessment', this.diligenceId);
    },
    onProcessingDialogClose() {
      this.$router.push({ name:"dueDiligenceReports" });
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
          case 'unknown_error':
              return { class: 'deep-orange-darken-1-button', text: this.$t("dueDiligence.unknown_error") };
          case 'geo_location_error':
              return { class: 'deep-orange-darken-1-button', text: this.$t("dueDiligence.geo_location_error") };
          case 'region_not_available':
              return { class: 'deep-orange-darken-1-button', text: this.$t("dueDiligence.region_not_available") };
          case 'area_too_large':
              return { class: 'deep-orange-darken-1-button', text: this.$t("dueDiligence.area_too_large") };
          case 'area_too_small':
              return { class: 'deep-orange-darken-1-button', text: this.$t("dueDiligence.area_too_small") };
          case 'invalid_request_data':
              return { class: 'deep-orange-darken-1-button', text: this.$t("dueDiligence.invalid_request_data") };
          case 'unknown_error_tt':
              return { class: 'unknown_error', text: this.$t("dueDiligence.unknown_error_tt") };
          case 'geo_location_error_tt':
              return { class: 'geo_location_error', text: this.$t("dueDiligence.geo_location_error_tt") };
          case 'region_not_available_tt':
              return { class: 'region_not_available', text: this.$t("dueDiligence.region_not_available_tt") };
          case 'area_too_large_tt':
              return { class: 'area_too_large', text: this.$t("dueDiligence.area_too_large_tt") };
          case 'area_too_small_tt':
              return { class: 'area_too_small', text: this.$t("dueDiligence.area_too_small_tt") };
          case 'invalid_request_data_tt':
              return { class: 'invalid_request_data', text: this.$t("dueDiligence.invalid_request_data_tt") };
          default:
              return { class: '', text: 'N/A' };
          }
    },
    async triggerSubmit() {
      return true;
    },
    triggerFileInput() {
      this.fileUploading = true;
      this.$refs.fileInput.click();
    },
    openPdf(){
      window.open(this.s3Location);
    },
    async getDiligenceDetail() {
      const id = this.$route.params.id || null
      DeforestationService.getDiligenceDetail(parseInt(id)).then(res => {
        this.$store.commit('eudrDDS/SET_DILIGENCE_DETAILS', res.data.getDiligenceDetail);
      })
      const diligenceDetails = this.getDiligenceDetails;
      if (diligenceDetails) {
        this.updatedEUDRAssessmentType = diligenceDetails.eudrAssessmentType;
        this.risk = diligenceDetails.totalHighDeforestationProductionPlaces > 0;
      }
    },
    handleUploadEudrAssessment(item) {
      this.currentProductionDetails = item;
      this.showUploadAssessment = true;
    },

    handleViewEudrAssessment(item) {
      this.currentProductionDetails = item;
      this.showViewAssessment = true;
    },

    async uploadedEudrDeforestations() {
      this.showUploadAssessment = false;
      this.showViewAssessment = false;
      await this.getProductionPlaces();
    },
    onClickRemoveDeforestationStatus(data) {
      this.eudrDeforestationStatusConfirmDelete.confirmData = data;
      this.eudrDeforestationStatusConfirmDelete.dialog = true;
    },
    async clearEUDRDeforestationStatus(farmDetails) {
      this.startLoading();
      let payloadData = {
        farm_id: [parseInt(farmDetails.id)],
        diligence_report_id: parseInt(this.diligenceId),
        eudr_deforestation_status: null,
        eudr_s3_key: "",
        eudr_s3_location: "",
        eudr_comment: "",
      };
      DeforestationService.updateDeforestationStatus(payloadData)
        .then(async (res) => {
          if (res.errors && res.errors.length > 0) {
            this.stopLoading();
            const errorMessage =
              res.errors[0].message || "An unexpected error occurred.";
            this.$notify({
              type: "error",
              text: errorMessage,
            });
            return;
          }
          if (res.data) {
            const {
              success,
            } = res?.data?.updateManualEUDRDeforestationStatus;
            if (success) {
              this.$notify({
                title: "EUDR deforstation status removed successfully.",
                type: "success",
              });

              await this.getProductionPlaces();

            } else {
              this.$notify({
                title: this.$t('somethingWentWrong'),
                type: "error",
              });
            }
          }
        })
        .catch((err) => {
          this.$notify({
            title: err.message || this.$t('somethingWentWrong'),
            type: "error",
          });
        })
        .finally(() => {
          this.stopLoading();
        });
        this.clearEUDRDeforestationStatusCancel();
    },

    async handleFileChange(event) {
      const file = event.target.files[0];
      if (file && file.type === "application/pdf") {
        this.uploadedFile = file;
        this.uploadedFileName = file.name;
        this.uploadFileType = file.name
          .split(".")
          .pop()
          .toUpperCase();
        await this.uploadFile(file);
      } else {
        this.fileUploading = false;
        console.error("Invalid file type. Please select a PDF file.");
      }
    },

    async uploadFile(file) {
      this.startLoading();
      this.uploadedFile = file;
      this.uploadedFileName = file.name;
      this.uploadFileType = file.name
        .split(".")
        .pop()
        .toUpperCase();
        try{
          const result = await S3UploadService.singleUpload(file, "signatures");
          this.s3Location = result.fullPath;
          this.s3key = result.key;
          console.log("File uploaded successfully:", this.s3Location);
          
          // Log the file upload
          try {
            const userId = this.$store.getters.getUser?.id;
            if (userId) {
              await ActivityLogService.logDDSFileUploaded(
                this.diligenceId,
                userId,
                file.name,
                this.uploadFileType,
                'Risk mitigation signature'
              );
            }
          } catch (logError) {
            console.error('Error logging file upload:', logError);
          }
          
          await this.highRiskMitigation();
        } catch(err){
            this.$notify({
            type: 'error',
            title: 'Error',
            text: 'Error generating signed URL from S3'
          });
        }
        this.stopLoading();
    },

    showModel(modal, item) {
      switch (modal) {
        case "disputes":
          this.targetProductionPlace = item;
          this.showDisputeModal = true;

          break;
        case "assessment":
          this.$router.push({
            name: "EudrAssessmentReportDDS",
            params: { reportRequestId: item.deforestationInfo.deforestationReportRequestId, type: "assignment" },
          });

          break;
        case "mitigation":
          this.getManualRiskMitigationData = {
            riskMitigationComment : item.risk_mitigation_comment,
            riskMitigationFiles : item.risk_mitigation_files
          }
          this.targetedProductionPlaceId = item.diligenceReportProductionPlaceArray[0]?.id;
          this.targetProductionPlace = item;
          this.showMitigtionModal = true;
          break;

        default:
          break;
      }
    },
    closeWithoutChange() {
      this.$emit("close-without-change");
    },

    closeModal(data = null) {
      //   this.polygon.setMap(null);
      //   this.parentPolygonCoords = [];
      this.$emit("close-location-modal", data);
    },

    async fetchData() {
      try {
        await Promise.allSettled([
          this.getDiligenceDetail(this.diligenceId),
          this.getProductionPlaces(),
          this.getRemovedProductionPlaces()
        ]);
      } catch (error) {
        console.error(error)
      }
    },

    debouncedGetProductionPlaces: debounce(function(){
        // reset into first page.
            this.tableOptions = {
                page: 1,
                itemsPerPage: 10
            }
            this.getProductionPlaces();
        }, 1000), // debounce delay,

    async getBulkDeforestationReport() {
      this.reportLoading = true;
      try {
        if (this.updatedProductionPlaces.length) {
          const response = await DeforestationService.getBulkReportByDiligenceId(this.diligenceId);
          if(!response.data?.success) {
            throw new Error(response.data.message);
          }
          const job = response.data.data;
          let stopWaiting = false;
          let dialogTimeout;
          
          this.startTimer++;
          this.showProcessingDialog = true;
          this.stopLoading();
          
          // Set dialog timeout to close after 30 seconds and redirect
          dialogTimeout = setTimeout(() => {
            this.showProcessingDialog = false;
            this.$router.push({ name:"dueDiligenceReports" });
          }, 30000); // 30 seconds timeout for dialog
          
          while(!stopWaiting) {
            await wait(5000);
            const response = await DeforestationService.getJob(job.id);
            if(response.data?.job.status === 'Failed') {
              if (dialogTimeout) clearTimeout(dialogTimeout);
              this.showProcessingDialog = false;
              throw new Error('An error occurred while fetching the deforestation report.');
            }
            if(response?.data.job.status === 'Completed') {
              if (dialogTimeout) clearTimeout(dialogTimeout);
              this.showProcessingDialog = false;
              this.$notify({
                type: 'success',
                title: 'Success',
                text: this.$t("dueDiligence.successfullyGeneratedEUDRDeforestationStatus"),
              });
              this.progressValue = 100;
              await this.getDiligenceDetail(this.diligenceId);
              await this.getProductionPlaces();
              break;
            }
          }
        } else {
          this.progressValue = 100;
        }
      } catch (error) {
        this.progressValue = 0;
        this.progressColor = "red";
        this.$notify({
          type: 'error',
          title: 'Error',
          text: error.message || this.$t('deforestation.anErrorOccuredWhileFetchingTheDeforestationReport')
        });
      } finally {
        this.reportLoading = false;
      }
    },

    async removeFarm(id) {
      this.farmConfirmDelete.confirmData = { id };
      this.farmConfirmDeleteDialog = true;
    },

    async confirmRemoveFarm(action, confirmData) {
      this.startLoading();
      const params = {
        diligenceReportId: this.diligenceId,
        farmId: confirmData.id,
      };
      
      try {
        await DeforestationService.removeFarmFromProductionPlaceListById(params);
        
        // Log the farm removal
        try {
          const userId = this.$store.getters.getUser?.id;
          if (userId) {
            await ActivityLogService.logDDSProductionPlaceDeleted(
              this.diligenceId,
              userId,
              confirmData.id,
              '', // farmName not available in this context
              'EUDR assessment deletion'
            );
          }
        } catch (logError) {
          console.error('Error logging farm removal:', logError);
        }
        
        await this.fetchData();
        this.farmConfirmDeleteDialog = false;
      } catch (error) {
        console.error('Error removing farm:', error);
        this.$notify({
          title: this.$t('somethingWentWrong'),
          type: 'error'
        });
      } finally {
        this.stopLoading();
      }
    },
    async restoreFarm(id) {
      this.startLoading();
      const params = {
        diligenceReportId: this.diligenceId,
        farmId: id,
      };
      
      try {
        await DeforestationService.restoreProductionPlaceFarmById(params);
        
        // Log the farm restoration
        try {
          const userId = this.$store.getters.getUser?.id;
          if (userId) {
            await ActivityLogService.logDDSProductionPlaceRestored(
              this.diligenceId,
              userId,
              id,
              '' // farmName not available in this context
            );
          }
        } catch (logError) {
          console.error('Error logging farm restoration:', logError);
        }
        
        await this.fetchData();
      } catch (error) {
        console.error('Error restoring farm:', error);
        this.$notify({
          title: this.$t('somethingWentWrong'),
          type: 'error'
        });
      } finally {
        this.stopLoading();
      }
    },

    async removeAllHighRiskFarm() {
      this.startLoading();
      const params = {
        diligenceReportId: this.diligenceId,
        eudrDeforestationStatus: "High Deforestation Probability",
      };
      
      try {
        const res = await DeforestationService.removeFarmFromProductionPlaceListByStatus(params);
        const { success, message } = res.data.removeFarmFromProductionPlaceList;
        
        if (success) {
          // Log the bulk removal of high-risk farms
          try {
            const userId = this.$store.getters.getUser?.id;
            if (userId) {
              await ActivityLogService.logDDSProductionPlaceBulkDeleted(
                this.diligenceId,
                userId,
                'multiple', // count not available in response
                'High Deforestation Probability'
              );
            }
          } catch (logError) {
            console.error('Error logging bulk farm removal:', logError);
          }
          
          await this.getProductionPlaces();
          this.$notify({
            title: message || "Item deleted successfully.",
            type: 'success'
          })
        } else {
          this.$notify({
            title: message || this.$t('somethingWentWrong'),
            type: 'error'
          })
        }
        await this.fetchData();
      } catch (error) {
        console.error('Error removing high-risk farms:', error);
        this.$notify({
          title: this.$t('somethingWentWrong'),
          type: 'error'
        });
      } finally {
        this.stopLoading();
      }
    },

    async removeAllLowRiskFarm() {
      this.startLoading();
      const params = {
        diligenceReportId: this.diligenceId,
        eudrDeforestationStatus: "Low Deforestation Probability",
        // eudrDeforestationStatus: "Zero/Negligible Deforestation Probability",
      };
      
      try {
        const res = await DeforestationService.removeFarmFromProductionPlaceListByStatus(params);
        const { success, message } = res.data.removeFarmFromProductionPlaceList;
        
        if (success) {
          // Log the bulk removal of low-risk farms
          try {
            const userId = this.$store.getters.getUser?.id;
            if (userId) {
              await ActivityLogService.logDDSProductionPlaceBulkDeleted(
                this.diligenceId,
                userId,
                'multiple', // count not available in response
                'Low Deforestation Probability'
              );
            }
          } catch (logError) {
            console.error('Error logging bulk farm removal:', logError);
          }
          
          await this.getProductionPlaces();
          this.$notify({
            title: message || "Risk mitigated successfully.",
            type: 'success'
        })
        } else {
          this.$notify({
            title: message || this.$t('somethingWentWrong'),
            type: 'error'
          })
        }
        await this.fetchData();
      } catch (error) {
        console.error('Error removing low-risk farms:', error);
        this.$notify({
          title: this.$t('somethingWentWrong'),
          type: 'error'
        });
      } finally {
        this.stopLoading();
      }
    },

    handleHightRiskMitigation : debounce(function(){
      this.highRiskMitigation();
    }, 3000),

    async highRiskMitigation() {
      this.startLoading();
      const params = {
        due_diligence_report_id: this.diligenceId,
        risk_mitigation_comment: this.highRiskComment,
        eudr_deforestation_status: "Manually Mitigated",
        file: this.s3Location || '',
      };
      try {
        const res =await DeforestationService.highRiskFarmRiskMitigation(params);
        const {message, success} = res.data?.highRiskFarmsRiskMitigation
        if (success) {
          // Log the successful risk mitigation
          try {
            const userId = this.$store.getters.getUser?.id;
            if (userId) {
              await ActivityLogService.logDDSManualMitigationCompleted(
                this.diligenceId,
                userId,
                null, // farmId not available in this context
                '', // farmName not available in this context
                'High risk deforestation',
                'Successfully mitigated'
              );
            }
          } catch (logError) {
            console.error('Error logging risk mitigation:', logError);
          }

          this.$notify({
            title: message || "Item deleted successfully.",
            type: 'success'
          })
        }
        else {
          this.$notify({
            title: message || this.$t('somethingWentWrong'),
            type: 'error'
          })
        }
        await this.fetchData();
        this.$emit('calculateWarningsForDeforestationAssessment', this.diligenceId);
      } catch (error) {
        this.$notify({
          text: error.message || "An unexpected error occurred. Please try again later.",
          type: 'error',
        });
      }
      finally {
        this.stopLoading();
      }
    },
    async getProductionPlaces(opt = null) {
      this.loading = true;
      const requestParams = {
        page: this.options.page,
        limit: this.options.limit,
        diligenceReportId: this.diligenceId,
        removed: false,
        searchPhrase: this.search,
        eudrDeforestationStatus:this.statusModel,
        farmCountry:this.countryModel,
        farmOwner:this.producerModel
      };
  
      if (opt?.sortBy?.length) {
        requestParams.orderField = opt.sortBy[0];
        requestParams.order = opt.sortDesc[0] ? "DESC" : "ASC";
      }

      await DeforestationService.getProductionPlaces(requestParams)
        .then((res) => {
          this.productionPlaces = res.data.productionPlaces.rows.map((item) => {
            const deforestationInfo = item.diligenceReportProductionPlaceArray?.[0]?.productionPlaceDeforestationInfo;
            return {
              ...item,
              deforestationInfo,
              deforestationStatus: deforestationInfo?.deforestationStatus,
              isExpired: isDeforestationExpired(deforestationInfo?.deforestationStatusDate, this.get_EUDR_Settings),
              errorStatus: deforestationInfo?.deforestationReport?.errorStatus
            };
          });

          this.totalProductionPlaces = res.data.productionPlaces.totalCount;
          this.from = (this.options.page - 1) * this.options.limit + 1;
          this.to = this.options.page * this.options.limit;
          if (this.productionPlaces.length > 0) {
            this.to -= this.options.limit - this.productionPlaces.length;
          } else {
            this.to -= this.options.limit;
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

          if (this.productionPlaces.length > 0) {
            const productionPlacesWithRiskMitigation = this.productionPlaces.filter(place => {
              const reportPlace = place.diligenceReportProductionPlaceArray[0];
              return reportPlace?.productionPlaceDeforestationInfo?.deforestationMitigationComment && reportPlace?.riskMitigationFiles?.length;
            });
            if(productionPlacesWithRiskMitigation.length) {
              let firstData = productionPlacesWithRiskMitigation[0];
              this.highRiskComment = firstData.diligenceReportProductionPlaceArray[0].productionPlaceDeforestationInfo.deforestationMitigationComment;
              const file = firstData.diligenceReportProductionPlaceArray[0].riskMitigationFiles[0].file_path;
              this.s3Location = file;
              this.uploadFileType = file.split('.').pop();
              this.uploadedFileName = file.split('/').pop();
              const allSameData = productionPlacesWithRiskMitigation.every(place => {
                return place.diligenceReportProductionPlaceArray[0]?.productionPlaceDeforestationInfo?.deforestationMitigationComment === this.highRiskComment;
              });
              // this will work if all rows have the same risk_mitigation_comment but in our case that isn't so i added this condition in above firstly.
              if (!allSameData) {
                this.s3Location = null;
                this.uploadFileType = null;
                this.uploadedFileName = null;
              }
            }

          }
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          console.log("Error", err);
        });
    },

    async getRemovedProductionPlaces(opt = null) {
      this.loading = true;
      const requestParams = {
        page: this.removedProductionPlaceOptions.page,
        limit: 10,
        diligenceReportId: this.diligenceId,
        removed: true,
        eudrDeforestationStatus:this.statusModel,
        farmCountry:this.countryModel,
        farmOwner:this.producerModel
      };
      if (opt?.sortBy?.length) {
        requestParams.orderField = opt.sortBy[0];
        requestParams.order = opt.sortDesc[0] ? "DESC" : "ASC";
      }
      await DeforestationService.getProductionPlaces(requestParams)
        .then((res) => {
          this.removedProductionPlaces = res.data.productionPlaces.rows.map((item) => {
            const deforestationInfo = item.diligenceReportProductionPlaceArray?.[0]?.productionPlaceDeforestationInfo;
            return {
              ...item,
              deforestationInfo,
              deforestationStatus: deforestationInfo?.deforestationStatus,
              errorStatus: deforestationInfo?.deforestationReport?.errorStatus
            };
          });

          this.totalRemovedProductionPlaces =
            res.data.productionPlaces.totalCount;
          this.removedFrom =
            (this.removedProductionPlaceOptions.page - 1) *
            this.removedProductionPlaceOptions.limit +
            1;
          this.removedTo =
            this.removedProductionPlaceOptions.page *
            this.removedProductionPlaceOptions.limit;

          if (this.removedProductionPlaces.length > 0) {
            this.removedTo -=
              this.removedProductionPlaceOptions.limit -
              this.removedProductionPlaces.length;
          } else {
            this.removedTo -= this.removedProductionPlaceOptions.limit;
          }
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
      this.getProductionPlaces();
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
    pageChange(t) {
      if (t) this.options.page = this.options.page + 1;
      else this.options.page = this.options.page - 1;
      this.getProductionPlaces();
    },

    pageChangeRemovedProductionPlace(t) {
      if (t)
        this.removedProductionPlaceOptions.page =
          this.removedProductionPlaceOptions.page + 1;
      else
        this.removedProductionPlaceOptions.page =
          this.removedProductionPlaceOptions.page - 1;
      this.getRemovedProductionPlaces();
    },
    async exportToPDF() {
      const requestParams = {
        page: this.options.page,
        limit: this.options.limit,
        diligenceReportId: this.diligenceId,
        removed: false,
        searchPhrase: this.search,
        eudrDeforestationStatus:this.statusModel,
        farmCountry:this.countryModel,
        farmOwner:this.producerModel
      };
      const querys = new URLSearchParams(requestParams).toString();
      const token = this.$store.state.auth.token
      this.startLoading()
      const url = process.env.VUE_APP_DEFORESTRATION_API_BASE_URL  || "http://localhost:4043/api"
      this.downloadSourceFileWithToken(`${url}/production-place/production-place-with-status-pdf?${querys}`, "application/pdf", token,"production-places.pdf")
          .then(() => {
          this.stopLoading()
          }).catch(() => {
          this.stopLoading()
      })
    },
  },
  watch: {
  getDiligenceDetails: {
      handler(newDetails) {
        if (newDetails) {
          const diligenceDetails = this.getDiligenceDetails;
          console.log("eudrAssessmentType", this.getDiligenceDetails, diligenceDetails?.eudrAssessmentType);
          if (diligenceDetails) {
            this.updatedEUDRAssessmentType = diligenceDetails.eudrAssessmentType;
            this.risk = diligenceDetails.totalHighDeforestationProductionPlaces > 0;
          }
        }
      },
      immediate: true,
    },
  },
  mixins: [tableCustomizationMixin, loadingMixin, download, getPermittedActions, DateMixin],
};
</script>
<style lang="scss" scoped>
::v-deep .wdt.v-text-field {
  width: 250px;
}

::v-deep .v-tab:hover {
  background-color: #caf1e2;
  color: $primary_color !important;
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

::v-deep .v-list-item {
  cursor: pointer !important;

  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
}

::v-deep .eudr_class{
  display: flex;
  justify-content: left;
  align-items: center
}

::v-deep .non-clickable {
    pointer-events: none;
    cursor: default;
  }

/* Responsive Filter Controls */
.filter-controls-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
}

.filter-controls-left {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  flex: 1;
  min-width: 0;
}

.filter-item {
  min-width: 200px;
  flex-shrink: 0;
}

.search-field {
  min-width: 200px;
}

.filter-controls-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.pagination-info {
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.87);
  white-space: nowrap;
}

/* Mobile Controls */
.mobile-controls {
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.mobile-search {
  width: 100%;
}

.mobile-search .v-text-field {
  width: 100%;
}

.mobile-filters {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.mobile-pagination {
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-top: 1px solid #e0e0e0;
  width: 100%;
}

.mobile-pagination-info {
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.87);
}

.mobile-pagination-controls {
  display: flex;
  gap: 8px;
}

/* Responsive breakpoints */
@media (max-width: 1199px) {
  .filter-controls-left {
    flex-wrap: wrap;
  }
  
  .filter-item {
    min-width: 180px;
  }
  
  .mobile-controls {
    width: 100%;
  }
  
  .mobile-search {
    width: 100%;
  }
  
  .mobile-search .v-text-field {
    width: 100%;
  }
  
  .mobile-pagination {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 12px;
  }
  
  .mobile-pagination-controls {
    justify-content: flex-end;
  }
}

@media (max-width: 960px) {
  .filter-controls-bar {
    display: none;
  }
  
  .mobile-controls,
  .mobile-pagination {
    display: flex;
  }
  
  .mobile-controls {
    width: 100%;
  }
  
  .mobile-search {
    width: 100%;
  }
  
  .mobile-search .v-text-field {
    width: 100%;
  }
  
  .mobile-pagination {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 12px;
  }
  
  .mobile-pagination-controls {
    justify-content: flex-end;
  }
}

@media (max-width: 600px) {
  .filter-item {
    min-width: 100%;
  }
  
  .mobile-controls {
    width: 100%;
  }
  
  .mobile-search {
    width: 100%;
  }
  
  .mobile-pagination {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 12px;
  }
  
  .mobile-pagination-controls {
    justify-content: flex-end;
  }
}
</style>
