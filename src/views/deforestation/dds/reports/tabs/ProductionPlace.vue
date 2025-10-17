<template>
  <div>
    <v-card elevation="0" class="px-5 mt-7">
      <v-card-text>
        <div class="d-flex">
          <h3 style="color:black">{{ $t('dueDiligence.addProductionPlaceData') }}
            <v-tooltip top color="00BD73" max-width="350">
              <template v-slot:activator="{ on, attrs }">
                <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                  mdi-alert-circle
                </v-icon>
              </template>
              <span>{{ $t('dueDiligence.addProductionPlaceDataTooltip') }}</span>
            </v-tooltip>
          </h3>
          <v-spacer></v-spacer>

          <v-menu bottom origin="center center" transition="scale-transition">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="grey" v-bind="attrs" v-on="on" dark small class="mr-3" @click="setActiveButton('dimitra')" :class="{'active-btn': activeButton ==='dimitra'}">
                {{ $t("dueDiligence.dimitraApps") }}
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-title class="cursor-pointer" @click="handleAddNewSection('coffee'); coffeeData = true;cacaoData = false">
                  {{ $t("dueDiligence.connectedFarmer") }}
                </v-list-item-title>
              </v-list-item>

              <v-list-item>
                <v-list-item-title class="cursor-pointer" @click="handleAddNewSection('cacao'); cacaoData = true; coffeeData = false">
                  {{ $t("dueDiligence.connectedCacao") }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-menu bottom origin="center center" transition="scale-transition">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="grey" v-bind="attrs" v-on="on" dark small class="mr-3" @click="setActiveButton('addNew')" :class="{'active-btn': activeButton ==='addNew'}">
                {{ $t("dueDiligence.addNew") }}
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-title class="cursor-pointer" @click="handleAddNewSection('manual')" >
                  {{ $t("dueDiligence.manualDataEntry") }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="cursor-pointer" @click="handleAddNewSection('import')" >
                  {{ $t("dueDiligence.importFile") }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-btn color="grey" dark small class="mr-3" type="button" @click="setActiveButton('existing')" :class="{'active-btn': activeButton ==='existing'}">
            {{ $t("dueDiligence.existingData") }}
          </v-btn>
        </div>

        <v-row>
          <v-col cols="6">
            {{ $t('dueDiligence.addProductionPlaceDataDesc') }}
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card v-if="addNewType ==='manual'" elevation="0" class="px-5 mt-7">
      <v-card-text>

        <div class="d-flex">
          <h3 style="color:black">{{ $t("dueDiligence.manaulProductionPlace") }}
            <v-tooltip top color="00BD73" max-width="350">
              <template v-slot:activator="{ on, attrs }">
                <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                  mdi-alert-circle
                </v-icon>
              </template>
              <span>{{ $t("dueDiligence.manaulProductionPlaceTooltip") }}</span>
            </v-tooltip>
          </h3>
          <v-spacer></v-spacer>
          <v-icon @click="removeProductionPlace" v-if="addProductionPlaces.length > 0" class="icon-with-background" style="color:red">
            mdi-close-circle
          </v-icon>
        </div>

        <v-row>
          <v-col cols="12" class="mt-3">
            <v-form ref="productionPlaceForm">
              <v-card v-for="(addProductionPlace, index) in addProductionPlaces" :key="index" elevation="0"
                style="background-color: rgba(243, 243, 243, 0.5);" class="mb-3">
                <v-card-text>
                  <v-row>
                    <v-col cols="12" v-if="index>0">
                      <label>
                        <v-btn elevation="0" class="mt-5" fab color="red" x-small @click="handleRemoveAddedProductionPlace(index)">
                          <v-icon style="color:#fff;">
                          mdi-minus
                          </v-icon>
                        </v-btn>
                      </label>
                    </v-col>
                    <v-col cols="3">
                      <label for="text">
                        {{ $t('dueDiligence.producerName') }}
                      </label>
                      <v-tooltip top color="00BD73" max-width="350">
              <template v-slot:activator="{ on, attrs }">
                <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                  mdi-alert-circle
                </v-icon>
              </template>
              <span>{{ $t("dueDiligence.producerNameTT") }}</span>
            </v-tooltip>
                      <v-text-field class="custom-input" :placeholder="$t('dueDiligence.producerName')"
                        v-model="addProductionPlaces[index].producerName" outlined dense :rules="[rules.required]"></v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <label for="text">
                        {{ $t('dueDiligence.producerCountry') }}
                      </label>
                      <v-tooltip top color="00BD73" max-width="350">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                          mdi-alert-circle
                        </v-icon>
                      </template>
                      <span>{{ $t("dueDiligence.producerCountryTT") }}</span>
                    </v-tooltip>
                        <v-autocomplete :items="countries" v-model="addProductionPlaces[index].producerCountry" item-text="name" item-value="name" dense outlined clearable
                        class="wdt" :placeholder="$t('deforestation.allCountries')" :rules="[rules.required]"></v-autocomplete>
                    </v-col>
                    <v-col cols="3">
                      <label for="text">
                        {{ $t('dueDiligence.totalArea') }}
                      </label>
                      <v-text-field class="custom-input" :value="calculateTotalArea(index)" :placeholder="'0'" disabled v-model="addProductionPlaces[index].totalArea"
                        outlined dense></v-text-field>
                    </v-col>

                  <v-col cols="3">
                    <v-btn elevation="0" class="mt-5" fab color="primary" small  @click="handleAddInput(index)">
                      <v-icon>
                      mdi-plus
                    </v-icon>
                    </v-btn>
                  </v-col>
                  </v-row>

                  <v-data-table :headers="headers" :items="addProductionPlaces[index].farms" :items-per-page="100"
                    :loading=loading :loading-text="$t('Loading...')" hide-default-footer>
                    <template v-if="addProductionPlaces[index].farms.length > 0" v-slot:body="{ items }">
                      <tbody style="background-color: #EEE;">
                        <tr v-for="(item, subIndex) in items" :key="item.id"
                          style="position: relative; width: 0; height: 0">

                          <td> {{ subIndex + 1 }}</td>
                          <td> <v-text-field class="mt-3" :placeholder="$t('farmName')"
                              v-model="addProductionPlaces[index].farms[subIndex].farmName" outlined
                              dense :rules="[rules.required]"></v-text-field>
                          </td>
                          <td> <v-text-field class="mt-3" :placeholder="$t('area')"
                              v-model="addProductionPlaces[index].farms[subIndex].area" @input="updateTotalArea(index)" outlined
                              dense :disabled="true"  :rules="[rules.required]"></v-text-field>
                          </td>
                          <td> <v-select class="mt-3" :items="farmGeofenceType" dense
                              v-model="addProductionPlaces[index].farms[subIndex].farmType" outlined item-text="label" item-value="value"
                              :placeholder="$t('dueDiligence.selectType')" :rules="[rules.required]"/></td>
                          <td>
                            <div class="d-flex" style="margin-top: -10px;cursor: pointer;">
                              <v-icon color="red" @click="handleRemoveInput(index,subIndex)">mdi-close-circle-outline</v-icon>
                              <img class="ml-2" src="/icons/marker-inside-circle.png"  @click="showGeofence(index,subIndex)"
                                style="width: 24px; height: 24px; border-radius: 50%;" />
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </v-form>
          </v-col>
          <v-col cols="12">
            <v-btn color="primary" dark medium class="mr-3" @click="handleAddProductionPlace">
              {{ $t("dueDiligence.addProductionPlace") }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>







    <v-card v-else-if="addNewType==='import'" elevation="0" class="px-5 mt-7">
      <v-card-text>
        <div class="d-flex">
          <h3 style="color:black">{{  $t('dueDiligence.importProductionPlace') }}
            <v-tooltip top color="00BD73" max-width="350">
              <template v-slot:activator="{ on, attrs }">
                <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                  mdi-alert-circle
                </v-icon>
              </template>
              <span>{{  $t('importProductionPlaceTT') }}</span>
            </v-tooltip>
          </h3>
          <v-spacer></v-spacer>
          <v-icon @click="removeSourceType" class="icon-with-background" style="color:red">
            mdi-close-circle
          </v-icon>
        </div>

        <v-row class="d-flex align-center mt-5 mb-1">
          <v-col>
          <h3 style="color:black">{{  $t('dueDiligence.areaForPointGeofence') }}
            <v-tooltip right  color="00BD73" max-width="350">
              <template v-slot:activator="{ on, attrs }">
                <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                  mdi-alert-circle
                </v-icon>
              </template>
              <span style="display: block" class="mb-2">{{  $t('dueDiligence.accordingToEUDRFarmsWithLessThan4HectaresDoNotRequireAPolygon') }}</span>
              <span style="display: block" class="mb-2">{{  $t('dueDiligence.circularAreaEquivalent') }}</span>
              <span style="display: block" class="mb-2">{{  $t('dueDiligence.ifTheFarmsAreSmallerPleaseEnterTheStandardSizeInTheFieldBelow') }}</span>
            </v-tooltip>
          </h3>
          </v-col>
        </v-row>

        <div v-if="!editDefaultArea">{{ $t('defaultCircularGeofence') }}</div>
        <div v-if="editDefaultArea">{{ $t('dueDiligence.defaultAreaValueSpecified') }}</div>
          <v-form ref="form" v-model="isAreaValid">
            <v-row class="d-flex align-center mt-2">
          <v-col cols="3">
            <div class="szi d-flex justify-space-between">
              <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">
                {{ $t('memberDataSection.area') }}
              </label>
              <label> ha </label>
            </div>
            <v-text-field dense required :disabled="!editDefaultArea" outlined v-model="pointFarmDefaultArea" :background-color="areaFieldColor" :rules="[rules.range]" ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-btn color="primary" class="px-2" @click="editArea" v-if="!editDefaultArea">
              {{ $t('edit') }}
            </v-btn>
            <v-btn color="primary" outlined class="px-2 ml-2" @click="cancelAreaEdit" v-if="editDefaultArea">
             {{ $t("cancel")}}
            </v-btn>
            <v-btn color="primary" @click="saveArea()" class="ml-2" v-if="editDefaultArea" :disabled="!isAreaValid">
              {{ $t("save")}}
            </v-btn>
          </v-col>
            </v-row>
          </v-form>








        <v-row>
          <v-col cols="6" class="my-5">
            <form autocomplete="off">
              <v-card-text class="black--text">
                <v-menu bottom origin="center center" transition="scale-transition">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="primary" v-bind="attrs" v-on="on" dark class="mr-3">
                      <v-icon small class="mr-2">mdi-tray-arrow-down</v-icon>
                      {{ $t("memberDataSection.download") }}
                      <v-icon>mdi-chevron-down</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item>
                          <v-list-item-title class="cursor-pointer">
                            <a class="text-decoration-none black--text"  download href="/files/production-place-bulk-import/production-place-bulk-import-template.geojson">
                              {{ $t('dueDiligence.downloadGeoJsonFormat') }}
                            </a>
                          </v-list-item-title>
                      </v-list-item>
                      <v-list-item>
                          <v-list-item-title class="cursor-pointer">
                            <a class="text-decoration-none black--text"  download href="/files/production-place-bulk-import/production-place-bulk-import-template.xml">
                              {{ $t('dueDiligence.downloadXMLFormat') }}
                            </a>
                          </v-list-item-title>
                      </v-list-item>
                      <v-list-item>
                          <v-list-item-title class="cursor-pointer">
                            <a class="text-decoration-none black--text"  download href="/files/production-place-bulk-import/production-place-bulk-import-template.csv">
                              {{ $t('dueDiligence.downloadCSVFormat') }}
                            </a>
                          </v-list-item-title>
                      </v-list-item>
                      <v-list-item>
                          <v-list-item-title class="cursor-pointer">
                            <a class="text-decoration-none black--text"  download href="/files/production-place-bulk-import/production-place-bulk-import-template.xlsx">
                              {{ $t('dueDiligence.downloadXLSorXLSXFormat') }}
                            </a>
                          </v-list-item-title>
                      </v-list-item>
                  </v-list>
                </v-menu>

                <span class="red--text ml-5">{{ $t("dueDiligence.importantNote") }}</span>:
                {{ $t("dueDiligence.downloadFileFormatTemplates") }}

                <div class="form mt-4">
                  <!-- <div v-if="!files || files.length === 0"> -->
                    <div :class="['dropZone', dragging ? 'dropZone-over' : '']" @dragenter="dragging = true"
                      @dragleave="dragging = false">
                      <div class="dropZone-info">
                        <v-icon size="40" color="info">mdi-cloud-upload</v-icon>
                        <span class="fa fa-cloud-upload dropZone-title"></span>
                        <div class="d-flex-start">
                          <div class="info--text">{{ $t("dueDiligence.selectFileToUploadData") }}</div>
                        </div>
                        <div class="dropZone-upload-limit-info">
                          <div>{{ $t("oma.OrDragDrop") }}</div>
                        </div>
                      </div>
                      <input
                        type="file"
                        accept=".geojson,.csv,.xlsx,.xls"
                        @change="onChange"
                        multiple
                      />
                    </div>
                    <span class="red--text">{{ fileError }}</span>
                  <!-- </div> -->
                  <!-- <div v-else class="dropZone-uploaded">
                    <div class="dropZone-uploaded-info">
                      <v-btn class="ma-2 white--text" @click="removeFiles" color="info" outlined>
                        {{ $t("oma.removeFile") }}
                        <v-icon right dark> mdi-trash-can </v-icon>
                      </v-btn>
                    </div>
                  </div> -->
                  <div    v-for="(file, index) in files"  :key="`${file.name}_${index}`">
                        <v-chip
                        label
                        color="grey lighten-4"
                        class="mt-4 uploadedFile-info"
                        close
                        @click:close="removeFile(file)"
                      >
                        <v-icon left small>
                          mdi-file-check
                        </v-icon>
                        {{ file.name.length > 30 ? file.name.substring(0, 50) + '...' : file.name }}
                        </v-chip>
                  </div>
                  <span class="red--text">{{ $t("dueDiligence.importantNote") }}</span>:
                  {{ $t("dueDiligence.pleaseProvideFollowing") }}
                </div>

              </v-card-text>
            </form>
          </v-col>
        </v-row>

        <!-- <v-row>
          <v-col cols="6" class="my-5">
            <div class="upload-info">
              <div v-if="file">
                <div :style="divStyle">
                  <span :style="spanStyle">{{ importTypeText }}</span>
                  <v-icon :style="iconStyle" class="cursor-pointer" @click="removeFile">mdi-trash-can-outline</v-icon>
                </div>
                <span :style="subtitle">Attachement1</span>
              </div>
              <v-textarea name="input-7-1" class="v-textarea--outlined" auto-grow outlined label="Comments"
                v-model="productDescription" :style="textareaStyle"></v-textarea>
            </div>
          </v-col>
        </v-row> -->
      </v-card-text>
    </v-card>
    <v-card v-else-if="addNewType==='existing'" elevation="0" class="px-5 mt-7">
      <v-card-text>

        <div class="d-flex">
          <h3 style="color:black">{{ $t('dueDiligence.existingProductionPlaces') }}
            <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon class="icon-with-background primary--text" style="color:#0EBF67;font-size: 18px;" v-bind="attrs" v-on="on">
                        mdi-alert-circle
                      </v-icon>
                    </template>
                    <span>{{ $t('dueDiligence.existingProductionPlacesTT') }}</span>
                  </v-tooltip>
          </h3>
          <v-spacer></v-spacer>
          <v-icon @click="removeSourceType" class="icon-with-background" style="color:red">
            mdi-close-circle
          </v-icon>
        </div>

        <v-data-table :headers="placesHeaders" :items="productionPlaces" hide-default-footer v-model="selected"
          show-select :loading-text="$t('loadingData')">
          <template v-slot:top="{ }">
            <div class="d-flex mt-5 flex-wrap">
              <div style="width: 290px;">
                <label for="text">
                  {{ $t("dueDiligence.internalReferenceNumber") }}
                  <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                        v-on="on">
                        mdi-alert-circle
                      </v-icon>
                    </template>
                    <span>{{ $t('dueDiligence.internalReferenceNumberTT') }}</span>
                  </v-tooltip>
                </label>
                <v-text-field prepend-inner-icon="mdi-magnify" outlined height="5px" :placeholder="$t('search')" dense
                  v-model="productionPlaceInput.internalRefNum" @input="debouncedGetProductionPlaces" class="shrink" clearable></v-text-field>
              </div>
              <div class="ml-3" style="width: 200px;">
                <label for="text">{{ $t('country') }}</label>
                <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon class="icon-with-background primary--text" style="color:#0EBF67;font-size: 18px;" v-bind="attrs" v-on="on">
                        mdi-alert-circle
                      </v-icon>
                    </template>
                    <span>{{ $t('country') }}</span>
                  </v-tooltip>
                <v-autocomplete :items="filterCountries" v-model="productionPlaceInput.farmCountry" item-text="name" item-value="name" dense outlined clearable
                  class="wdt" :placeholder="$t('select')" @change="debouncedGetProductionPlaces" multiple></v-autocomplete>
              </div>

              <div class="ml-3" style="width: 200px;">
                <label for="text">{{ $t('dueDiligence.supplier') }}</label>
                <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon class="icon-with-background primary--text" style="color:#0EBF67;font-size: 18px;" v-bind="attrs" v-on="on">
                        mdi-alert-circle
                      </v-icon>
                    </template>
                    <span>{{ $t('dueDiligence.supplierTT') }}</span>
                  </v-tooltip>
                <v-autocomplete :items="supplierList" v-model="productionPlaceInput.supplierId" item-text="label" item-value="val" dense outlined 
                :clearable="!isSupplierOwner"
                :disabled="isSupplierOwner"
                  class="wdt" :placeholder="$t('select')" @change="debouncedGetProductionPlaces"></v-autocomplete>
              </div>

              <div class="ml-3" style="width: 290px;">
                <label for="text">{{ $t('deforestation.EUDRDeforestationStatus') }}</label>
                <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon class="icon-with-background primary--text" style="color:#0EBF67;font-size: 18px;" v-bind="attrs" v-on="on">
                        mdi-alert-circle
                      </v-icon>
                    </template>
                    <span>{{ $t('deforestation.EUDRDeforestationStatusTT') }}</span>
                  </v-tooltip>
                <v-autocomplete :items="EUDRstatusList" v-model="productionPlaceInput.eudrDeforestationStatus" item-text="text" item-value="val" dense outlined clearable
                  class="wdt" :placeholder="$t('select')" @change="debouncedGetProductionPlaces"></v-autocomplete>
              </div>

              <v-spacer></v-spacer>
              <div class="d-flex" style="margin-top: 15px;">
                <div class="py-1 title">
                  {{ from }} - {{ to }} of {{ totalProductionPlaces }}
                </div>
                <v-btn class="mx-2" fab small outlined color="primary" :disabled="tableOptions.page <= 1"
                  @click="pageChange(false)">
                  <v-icon dark>
                    mdi-chevron-left
                  </v-icon>
                </v-btn>
                <v-btn class="mx-2" fab small outlined color="primary" :disabled="tableOptions.page >= totalPages"
                  @click="pageChange(true)">
                  <v-icon dark>
                    mdi-chevron-right
                  </v-icon>
                </v-btn>
              </div>
            </div>
          </template>
          <template v-slot:body="{ items }">
            <tbody>
              <tr v-for="(item, index) in items" :key="index"
                style="position: relative; width: 0; height: 0">
                <td>
                  <v-checkbox multiple :key="item.id"
                  :disabled="reportFarmIds.includes(item.farmId)"
                  v-model="selected" :value="item" style="margin:0px;padding:0px" hide-details @change="handleCheckboxChange"/>
                </td>
                <td>
                  {{ item.farm.farmName || '' }}<br>
                  {{ item.farmId || '' }}
                </td>
                <td> {{ item.diligenceReports.length ? item.diligenceReports[0].internalReferenceNumber : '' }} </td>
                <td> {{ isSupplierOwner? supplier: getSupplierFullName(item) }} </td>
                <td> {{ getProducerFullName(item) }} </td>

                <td> {{ getCountryName(item) }} </td>

                <td> {{ item.farm.address || '' }} </td>
                <td> {{ parseFloat(item.farm.area  * 0.404686).toFixed(4)|| '' }} </td>
                <td>
                  <v-btn v-if="getEUDRDeforestationStatus(item.deforestationStatus).text !== 'N/A'" small rounded min-width="200" depressed :class="[getEUDRDeforestationStatus(item.deforestationStatus).class, 'non-clickable']" height="34"
                     >
                      {{ getEUDRDeforestationStatus(item.deforestationStatus).text }}
                    </v-btn>
                    <span v-else>N/A</span>
                </td>
                <td>
                  <div class="d-flex">
                    <div class="d-flex" v-if="handleRiskAssessmentStatus(item?.all_risk_assessments)?.text !== 'N/A'">
                      <v-btn small rounded min-width="200" depressed :class="[handleRiskAssessmentStatus(item?.all_risk_assessments)?.class, 'non-clickable']" height="34"
                      >
                        {{ handleRiskAssessmentStatus(item?.all_risk_assessments)?.text }}
                      </v-btn>
                      <v-tooltip top color="00BD73" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                          <img v-bind="attrs" v-on="on" class="ml-1" src="/icons/todo-list.png" style="width: 34px; height: 34px; border-radius: 50%;" />
                        </template>
                        <span>{{ $t('dueDiligence.viewReport') }}</span>
                      </v-tooltip>
                    </div>
                    <span v-else>N/A</span>
                    <v-spacer></v-spacer>
                    <v-tooltip top color="00BD73" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on" class="ml-1 primary--text" @click="comfirmItemDelete(item)">mdi-trash-can</v-icon>
                        </template>
                        <span>{{ $t('delete') }}</span>
                      </v-tooltip>
                  </div>
                </td>
              </tr>
            </tbody>
          </template>

        </v-data-table>
        <template>
          <div class="d-flex mt-5" style="align-items: center;">
            <v-spacer></v-spacer>
            <!-- <img src="/icons/todo-list.png" style="width: 34px; height: 34px; border-radius: 50%;" /> -->
            <!-- <span class="ml-2">View Report</span> -->
            <v-icon class="ml-5 primary--text">mdi-trash-can</v-icon>
            <span class="ml-2">{{ $t('delete') }}</span>
          </div>
        </template>
      </v-card-text>
    </v-card>

    <v-card elevation="0" class="px-5 mt-5" v-if="coffeeData && addNewType=='coffee'">
        <div class="d-flex">
          <h3 style="color:black">{{ $t("dueDiligence.connectedFarmer") }}</h3>
          <v-spacer></v-spacer>
          <v-btn :color="cacaoCoffeeType =='lot' ? 'primary':'default'" @click="handleUsingLotOrFarm('lot')"> {{$t('dueDiligence.selectProductionPlacesUsingLots')}} </v-btn>  &nbsp;
          <v-btn :color="cacaoCoffeeType =='farm' ? 'primary':'default'" @click="handleUsingLotOrFarm('farm')">{{$t('dueDiligence.SelectProductionPlacesUsingFarms')}}</v-btn> &nbsp;
          <v-icon class="icon-with-background" @click="handleremoveDimitraApps" style="color:red; cursor:pointer">
            mdi-close-circle
          </v-icon>
        </div>
        <ConnectedCoffee  v-if="cacaoCoffeeType == 'lot'" @selected-coffee="handleSelectedItemsChanged" />
        <ConnectedFarm v-if="cacaoCoffeeType == 'farm'" @selected-farms="handleSelectedItemsChanged"/>
    </v-card>

    <v-card elevation="0" class="px-5 mt-5" v-if="addNewType==='cacao'">
        <div class="d-flex">
          <h3 style="color:black">{{ $t('dueDiligence.connectedCacao')}} </h3>
          <v-spacer></v-spacer>
          <v-btn :color="cacaoCoffeeType =='lot' ? 'primary':'default'" @click="handleUsingLotOrFarm('lot')"> {{$t('dueDiligence.selectProductionPlacesUsingLots')}}  </v-btn>  &nbsp;
          <v-btn :color="cacaoCoffeeType =='farm' ? 'primary':'default'" @click="handleUsingLotOrFarm('farm')"> {{$t('dueDiligence.SelectProductionPlacesUsingFarms')}} </v-btn> &nbsp;
          <v-icon class="icon-with-background" @click="handleremoveDimitraApps" style="color:red; cursor:pointer">
            mdi-close-circle
          </v-icon>
        </div>
        <ConnectedCacao v-if="cacaoCoffeeType == 'lot'" @selected-cacao="handleSelectedItemsChanged"/>
        <ConnectedFarm v-if="cacaoCoffeeType == 'farm'" @selected-farms="handleSelectedItemsChanged"/>
    </v-card>

      <ConfirmBox
        v-if="deleteconfirm"
        :dialog="deleteconfirm"
        :title="confirmElements.title"
        :message1="confirmElements.message1"
        :message2="confirmElements.message2"
        confirmBtnText="Delete"
        :confirmData="itemToDelete"
        @continue:action="deleteProductionPlace"
        @cancel:action="deleteconfirm = false"
      />

    <GeoLocation v-if="showGeofenceMap" :dialog="showGeofenceMap" :farmDetails="addProductionPlaces[currentIndex].farms[currentSubIndex]"  @closeGeoLocationModal="closeGeoLocationModal" @saveGeoLocationPoints="saveGeoLocationPoints"/>
    <TracebilityDialog v-if="showCoffeeCacaoTracebility" @closeCoffeeCacaoTraceability="showCoffeeCacaoTracebility=false"  :dialog="showCoffeeCacaoTracebility" :item="traceItem"/> 
    <ProcessingDialog
      :dialog="showProcessingDialog"
      @close="onProcessingDialogClose"
      :description="$t('dueDiligence.uploadFileBeingProcessed')"
      :heading="$t('dueDiligence.processingLocations')"
      :startTimerModel="startTimer"
      :hasTimer="true"
    />
  </div>
</template>
<script>
import loading from "@/mixins/LoadingMixin";
import GeoLocation from '../components/production-place/GeoLocation.vue'
import FarmService from "@/_services/FarmService";
import DeforestationService from "@/_services/DeforestationService";
import ActivityLogService from "@/_services/ActivityLogService";
import ConnectedCoffee from "./partials/ConnectedCoffee.vue";
import ConnectedCacao from "./partials/ConnectedCacao.vue";
import ConnectedFarm from "./partials/ConnectedFarm.vue"
import TracebilityDialog from "../components/TracebilityDialog.vue";
import ConfirmBox from "@/components/ConfirmBox";
import { debounce, get, isEmpty } from 'lodash';
import { getRiskAssessmentStatus} from '@/utils';
import { isDeforestationExpired } from '../../../../../utils';
import ProcessingDialog from '../components/ProcessingDialog.vue';
import generalMixin from "@/mixins/GeneralMixin";
import * as XLSX from 'xlsx';
export default {

  created(){
    this.orgId = this.currentUser.user_organization.id;
  },
  async mounted() {
    this.startLoading();
    if (this.diligenceId) {
      await this.getDiligenceDetail(this.diligenceId);
      this.$emit('calculateWarningsForDeforestationAssessment', this.diligenceId);
    }
    await Promise.allSettled([this.getCountries(), this.getSupplierList(), this.getProductionPlaces()]);
    const selectedSupplier =this.supplierList.filter(item => item.label === this.supplier)
    this.productionPlaceInput.supplierId = selectedSupplier[0].val
    // this.addProductionPlaces[0].producerCountry = null;
    this.stopLoading();
  },
  components:{
    GeoLocation,
    ConnectedCoffee,
    ConnectedCacao,
    ConnectedFarm,
    ConfirmBox,
    TracebilityDialog,
    ProcessingDialog
  },
  props: {
    diligenceId: {
      type: Number,
      required: true
    },
  },
  data() {
    return {
      startTimer:0,
      traceItem:{},
      countryOfProduction:'',
      showCoffeeCacaoTracebility:false,
      reportProductionPlaces:0,
      cacaoCoffeeType:'farm',
      showProcessingDialog: false,
      editDefaultArea: false,
      pointFarmDefaultArea:null,
      isAreaValid: false,
      pointFarmDefaultAreaOld:null,
      reportTotalProductionPlaces:0,
      orgId: null,
      deleteconfirm:false,
      showGeofenceMap:false,
      datepickerDialog: false,
      coffeeData:false,
      cacaoData:false,
      countries: [],
      filterCountries: [],
      startMenu: false,
      endMenu: false,
      startDate: null,
      endDate: null,
      countryOfActivity:null,

      customFilterMenu: false,
      filterDateCustom: [],
      productDescription: "",
      search: "",
      selected: [],

      placesHeaders: [
        {
          text: this.$t('dueDiligence.productionPlaceAndFarmID'),
          align: 'start',
          sortable: true,
          value: 'farm.farmName',
          class: "black--text",
          width: '150px'
        },
        {
          text: this.$t('dueDiligence.internalReferenceNumber'),
          align: 'start',
          sortable: true,
          value: 'diligenceReport.internalReferenceNumber',
          class: "black--text",
          width: '150px'
        },
        {
          text: this.$t('dueDiligence.supplier'),
          align: 'start',
          sortable: true,
          value: 'diligenceReport.supplier.firstName',
          class: "black--text",
          width: '150px'
        },
        {
          text: this.$t('deforestation.producer'),
          value: 'farm.userDdsAssoc.fullName',
          sortable: true,
          class: "black--text",
          width: '150px'
        },
        {
          text: this.$t('country'),
          value: 'farm.userDdsAssoc.countryId',
          sortable: true,
          class: "black--text",
          width: '150px'
        },
        {
          text: `${this.$t('deforestation.addressOfProduction')}`,
          value: 'farm.address',
          sortable: true,
          class: "black--text",
          width: '150px'
        },
        {
          text: `${this.$t('deforestation.areaHa')}`,
          value: 'farm.area',
          sortable: true,
          class: "black--text",
          width: '95px'
        },
        {
          text: `${this.$t('deforestation.EUDRDeforestationStatus')}`,
          value: 'eudr_deforestation_status',
          sortable: true,
          class: "black--text",
          width: '225px'
        },
        {
          text: `${this.$t('deforestation.riskAssessment')}`,
          value: 'risk_assessment_status',
          sortable: true,
          class: "black--text",
          width: '225px'
        },
      ],
      productionPlaces: [],
      totalProductionPlaces: 0,
      farmStatus: 'success',
      EUDRstatusList: [
          { text: this.$t("deforestation.allStatus"), val: "" },
          { text: this.$t("deforestation.veryHighProbability"), val: "Very High Deforestation Probability"},
          { text: this.$t("deforestation.highProbability"), val: "High Deforestation Probability" },
          { text: this.$t("deforestation.mediumProbability"), val: "Medium Deforestation Probability" },
          { text: this.$t("deforestation.lowProbability"), val: "Low Deforestation Probability" },
          { text: this.$t("deforestation.veryLowProbability"), val: "Very Low Deforestation Probability" },
          { text: this.$t("deforestation.zeroOrNegligibleProbability"), val: "Zero/Negligible Deforestation Probability"},
          { text: this.$t("dueDiligence.manualMitigated"), val: "Manually Mitigated" },
      ],
      farmStatusList: [],
      copyOfIds:[],
      from: 0,
      to: 0,
      tableOptions: {
          page: 1,
          itemsPerPage:10,
      },
      totalPages: 1,
      divStyle: {
        backgroundColor: '#E5F8F1',
        height: '111px',
        width: '111px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      },
      spanStyle: {
        zIndex: 1,
        fontSize: '24px', // Adjust the font size as needed
        fontWeight: 'bold', // Make the text bold
      },
      iconStyle: {
        position: 'absolute',
        top: '5px',
        right: '5px'
      },
      textareaStyle: {
        height: '111px',
        marginLeft: '10px' // Add margin to align with the div
      },
      subtitle: {
        color: '#135B00',
        fontSize: '12px', // Adjust the font size as needed
        fontWeight: 'bold',
      },
      internalReferenceNumber: "",
      addProductionPlaces: [
        {
          producerId:null,
          producerName: "",
          producerCountry: "",
          totalArea: "",
          farms: [
            {
              farmId:null,
              farmName: "",
              area: "",
              farmType: "",
            },
          ]
        },
      ],

      headers: [
        {
          text: this.$t('dueDiligence.number'),
          align: 'start',
          sortable: true,
          value: 'user',
          class: "black--text",
        },
        {
          text: this.$t('dueDiligence.productionPlaceDesc'),
          align: 'start',
          sortable: true,
          value: 'user',
          class: "black--text",
        },
        {
          text: this.$t('dueDiligence.area'),
          align: 'start',
          sortable: true,
          value: 'user',
          class: "black--text",
        },
        {
          text: this.$t('dueDiligence.type'),
          value: 'plantation_name',
          sortable: true,
          class: "black--text",
        },
        {
          text: `${this.$t('dueDiligence.actions')}`,
          value: 'farm',
          sortable: true,
          class: "black--text",
        },
      ],

      importType: "",
      files: [],
      fileError: "",
      progressText: 'Uploading...',
      progressColor: 'success',
      progressIcon: 'mdi-progress-upload',
      responseMessage: '',
      uploadError: false,
      progress: 0,
      link: "",
      linkError: false,
      dragging: false,
      loading: false,

      coordinates:[],

      farmGeofenceType: [
        {
          label: this.$t('deforestation.Circular'),
          value: 'POINT',
        },
        {
          label: this.$t('deforestation.Polygon'),
          value: 'POLYGON',
        },
      ],
      currentIndex: null,
      currentSubIndex: null,
      addNewType: null,
      supplier:null,
      activeButton: null,
      existingProductionPlaces:[],
      productionPlaceInput: {
        page: 1,
        limit: 10,
        searchPhrase: "",
        internalRefNum: "",
        supplierId:null,
        farmCountry: "",
        eudrDeforestationStatus: "",
        farmOwner: "",
        filterByDateOfRegister: null,
        filterByDateOfLastReport: null
      },
      supplierList:[],
      confirmElements: {
          title: this.$t('dueDiligence.deleteProductionPlaceData'),
          confirmBtnText: this.$t('dueDiligence.areYouSureYouWantToContinueThisAction'),
          cancelBtnText: this.$t("cancel"),
          confirmData: {},
      },
      itemToDelete:{
        digligenceReportId: null,
        farmId: null
      },
      rules: {
        required: value => !!value || this.$t('deforestation.thisFieldIsRequired'),
        range: value => (value >= 0.2 && value <= 4) || this.$t('deforestation.valueMustBeBetween02And4')
      },
      report: null,
      fileContent: null,
      validationResult: '',
      isValidFile: false,
      importResult: '',
    }
  },
  computed:{
    areaFieldColor(){
      return this.editDefaultArea? '' : '#E6E6E6'
    },
    importTypeText(){
      return this.getImportTypeText();
    },
    getSupplierFullName(){
      return (item) => {
        const firstName = item.diligenceReport?.supplier?.firstName ?? '';
        const lastName = item.diligenceReport?.supplier?.lastName ?? '';
        return `${firstName} ${lastName}`.trim();
      };
    },
    getProducerFullName(){
      return (item) => {
        const firstName = item.farm?.userDdsAssoc?.firstName ?? '';
        const lastName = item.farm?.userDdsAssoc?.lastName ?? '';
        return `${firstName} ${lastName}`.trim();
      };
    },
    getCountryName(){
      return (item) => {
        return item.farm.userDdsAssoc?.countryId || '';
      };
    },
    currentUser() {
      return this.$store.getters.getUser;
    },
    userRole() {
      return this.$store.getters["eudrDDS/getDdsUserRole"];
    },
    isSupplierOwner() {
      return this.userRole === "supplier_owner";
    },
    reportFarmIds() {
      if(Array.isArray(this.reportProductionPlaces)) {
        return this.reportProductionPlaces.map(place => place.farmId);
      }
      return [];
    },
  },
  methods: {
    handleSelectedItemsChanged(item){
      this.selected = item
    },
    removeFile(file) {
      this.files = this.files.filter(f => f !== file);
      this.fileError = '';
    },
    handleUsingLotOrFarm(type) {
      this.cacaoCoffeeType  = type 
    },
    onProcessingDialogClose() {
      this.$router.push({ name:"dueDiligenceReports" });
    },

    async saveArea(){
      const updatePointFarmDefaultAreaInput = {
        id: parseInt(this.diligenceId),
        pointFarmDefaultArea: parseFloat(this.pointFarmDefaultArea)
      }
      this.startLoading();
      await DeforestationService.updatePointFarmDefaultArea(updatePointFarmDefaultAreaInput)
          .then(async (res) => {
            if (res.errors && res.errors.length > 0) {
              const error = res.errors[0];
              const errorMessage = error.message || this.$t("dueDiligence.anErrorOccurred");

              this.$notify({
                text: errorMessage,
                type: "error",
              });
            }else{
              this.$notify({
                text: this.$t("dueDiligence.successfullyUpdatedDefaultFarmArea"),
                type: "success",
              });
            }
            this.editDefaultArea=false;
            this.stopLoading()
    }
    )},
    editArea(){
      this.editDefaultArea=true;
      this.pointFarmDefaultAreaOld = this.pointFarmDefaultArea
    },
    cancelAreaEdit(){
      this.editDefaultArea=false;
      this.pointFarmDefaultArea = this.pointFarmDefaultAreaOld
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
    handleRiskAssessmentStatus(allRiskAssessments){

      if (allRiskAssessments.length === 0) return { text: 'N/A'};

      const firstStatus = allRiskAssessments[0].riskAssessmentStatus;

      const allSameStatus = allRiskAssessments.every((item)=>item.riskAssessmentStatus === firstStatus);

      const riskStatus =  allSameStatus ? firstStatus : 'mitigation_required';

      return this.getRiskAssessmentStatus(riskStatus);
    },
    async triggerSubmit(){
      try {
        const sampleType = (['coffee','cacao'].includes(this.addNewType) && this.cacaoCoffeeType == 'farm') ? 'farms': this.addNewType 
        switch (sampleType) {
          case 'manual':
            return await this.saveProductionPlace();
          case 'import':
            return await this.uploadFile();
          case 'existing':
           return await this.saveBulkProductionPlace();
          case 'coffee':
           return await this.saveBulkCoffeeProductionPlace();
          case 'cacao':
           return await this.saveBulkCacaoProductionPlace();
          case 'farms':
           return await this.saveProductionPlaceForFarms();
          default:
            this.$notify({
              type: "error",
              text: this.$t('dueDiligence.pleaseSelectAtLeastOneSource') 
            });
          return false;
        }
      } catch (error) {
        this.$notify({
          type: "error",
          text: error.message || this.$t('somethingWentWrong'),
        });
        return false;
      }
    },

    async getDiligenceDetail(diligenceId) {
      await DeforestationService.getDiligenceDetail(parseInt(diligenceId))
        .then(async (res) => {
          if (res.errors && res.errors.length > 0) {
            const error = res.errors[0];
            const errorMessage = error.message || this.$t('dueDiligence.anErrorOccurred');

            this.$notify({
              text: errorMessage,
              type: "error",
            });
          }
          this.report = res.data.getDiligenceDetail;


          if(res.data.getDiligenceDetail){
            this.countryOfProduction = res.data?.getDiligenceDetail?.countryOfProduction[0];
            this.addNewType = res.data.getDiligenceDetail.productionPlaceSource;
            this.activeButton = res.data.getDiligenceDetail.productionPlaceSource;
            this.countryOfActivity = res.data.getDiligenceDetail.countryOfActivity?res.data.getDiligenceDetail.countryOfActivity:null;
            this.addProductionPlaces[0].producerCountry= this.countryOfProduction;
            this.productionPlaceInput.farmCountry = this.countryOfProduction
            this.supplier = res.data.getDiligenceDetail.supplier?res.data.getDiligenceDetail.supplier.firstName+ ' ' + res.data.getDiligenceDetail.supplier.lastName:null
            this.productionPlaceInput.supplierId = res.data.getDiligenceDetail?.supplierId ? Number(res.data.getDiligenceDetail.supplierId) : null;
            this.pointFarmDefaultArea=res.data.getDiligenceDetail.pointFarmDefaultArea;
            if(this.isSupplierOwner){
              this.supplier = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
            }
            await this.getProductionPlacesOfReport();
          }
          this.$store.commit('eudrDDS/SET_DILIGENCE_DETAILS', this.report);
          console.log(this.countryOfActivity,"country of actiview")

        })
        .catch((err) => {
          this.$notify({
            text: err,
            type: "error",
          });
        })

    },

    handleremoveDimitraApps(){
      this.coffeeData = false
      this.cacaoData = false
    },
    async getCountries() {
      const data = await FarmService.loadCountries();
      this.countries = data.data;
      this.filterCountries = [{ name: 'Unassigned', code: null } ,...data.data];
    },
    async getSupplierList() {
        return DeforestationService.getSupplierList().then(res => {
            this.supplierList = res.data.findAllSuppliersOrOperators?.map((item)=>{
              return {
               label: `${item.firstName || ''} ${item.lastName || ''}`.trim(), 
                val:parseInt(item.id)
              }
            }) || [];
          if (this.isSupplierOwner) {
            const label = `${this.currentUser.firstName || ''} ${this.currentUser.lastName || ''}`.trim();
            this.supplierList.unshift({
              label: label,
              val: null
            });
          }
        }).catch(err => {
            console.log('Error', err)
        })
    },

    debouncedGetProductionPlaces: debounce(function(){
      // reset into first page.
      this.tableOptions = {
        page: 1,
        itemsPerPage: 10
      }

      this.getProductionPlaces();
    }, 1000), // debounce delay

    clearDateFilter(){
      this.datepickerDialog = false;
      this.productionPlaceInput.filterByDateOfRegister = null;
      this.productionPlaceInput.filterByDateOfLastReport = null;
      this.getProductionPlaces();
    },

    applyDateFilter(){
      this.datepickerDialog = false;
      this.getProductionPlaces();
    },


    async getProductionPlacesOfReport() {
      try {
        const res = await DeforestationService.getProductionPlaces({diligenceReportId:this.diligenceId, page:0,limit:1});
        this.reportProductionPlaces = res.data.productionPlaces.rows;
        if(this.addNewType === 'manual'){
          const productionPlacesMap = {};

          this.reportProductionPlaces.forEach(pp => {
            const manualGeoFences = pp.farm.GeoFences.filter(
              geoFence => geoFence.generateMethod === 'MANUAL'
            );
            // Skip this farm if no manual GeoFences are found
            if (manualGeoFences.length === 0) return;

            const producerId = pp.farm.userDdsAssoc.id

            if (!productionPlacesMap[producerId]) {
              productionPlacesMap[producerId] = {
                producerId:producerId,
                producerName: `${pp.farm.userDdsAssoc.firstName} ${pp.farm.userDdsAssoc.lastName}`,
                producerCountry: `${pp.farm.userDdsAssoc.countryId}`,
                totalArea: 0,
                farms: [],
              };
            }
            const farmArea = parseFloat(pp.farm.area)/2.47105 || 0;
            productionPlacesMap[producerId].totalArea = parseFloat((productionPlacesMap[producerId].totalArea + farmArea).toFixed(4));

            const primaryGf = manualGeoFences[0];
            productionPlacesMap[producerId].farms.push({
              productionPlaceId: pp.id,
              geofenceId: primaryGf?.id ? Number(primaryGf.id) : null,
              farmId: pp.farm.id,
              farmName: pp.farm.farmName,
              area: (pp.farm.area/2.47105).toFixed(4),
              farmType: pp.farmType.toUpperCase(),
              address: pp.farm.address,
              pointCoordinates:{
                centerLatitude: primaryGf?.geofenceCenterLat ? parseFloat(primaryGf.geofenceCenterLat) : null,
                centerLongitude: primaryGf?.geofenceCenterLog ? parseFloat(primaryGf.geofenceCenterLog) : null,
                radius: primaryGf?.geofenceRadius ?? null
              },
              coordinates:(primaryGf?.geofenceCoordinates || []).map(coordinate =>({
                id: Number(coordinate.id),
                latitude: parseFloat(coordinate.lat),
                longitude: parseFloat(coordinate.log)
              }))
            });
          });
          this.addProductionPlaces = Object.values(productionPlacesMap);

        }
      } catch (err) {
        this.error = err.message || this.$t('somethingWentWrong');
        this.$notify({
          title: this.error,
          type: "error",
        });
      }
    },

    async getProductionPlaces() {
      try {
        this.startLoading();
        this.productionPlaceInput = { ...this.productionPlaceInput, page: this.tableOptions.page, limit : this.tableOptions.itemsPerPage, orgId: this.orgId }
        const res = await DeforestationService.getProductionPlaces(this.productionPlaceInput);
        this.productionPlaces = res.data.productionPlaces.rows.map((item) => {
            const deforestationInfo = item.productionPlaceDeforestationInfo;
            return {
              ...item,
              deforestationStatus: deforestationInfo?.deforestationStatus || item?.eudr_deforestation_status,
              isExpired: isDeforestationExpired(deforestationInfo?.deforestationStatusDate, this.get_EUDR_Settings),
              riskAssessmentStatus: deforestationInfo?.riskAssessmentStatus,
            };
          });

        for(const place of this.productionPlaces){
          const exists = place.diligenceReports?.find(report => report.id == this.diligenceId);
          if(exists) {
            this.selected.push(place);
          }
        }

        this.totalProductionPlaces = res.data.productionPlaces.totalCount;
        this.totalPages = Math.ceil(this.totalProductionPlaces/this.tableOptions.itemsPerPage)
        this.from = (((this.tableOptions.page-1)*this.tableOptions.itemsPerPage)+1)
        this.to = (this.tableOptions.page*this.tableOptions.itemsPerPage)-(this.tableOptions.itemsPerPage-res.data.productionPlaces.rows.length)
      } catch (err) {
        this.error = err.message || this.$t('somethingWentWrong');
        this.$notify({
          title: this.error,
          type: "error",
        });
      } finally {
        this.stopLoading();
      }
    },
    clearFilters() {
      this.productionPlaceInput.searchPhrase = "";
      this.productionPlaceInput.farmCountry = "";
      this.productionPlaceInput.eudrDeforestationStatus = "";
      this.productionPlaceInput.farmOwner = "";
      this.productionPlaceInput.dateOfRegister = null;
      this.productionPlaceInput.dateOfLastReport = null;
      this.productionPlaceInput.supplierId = null
      this.getProductionPlaces();
    },

    async comfirmItemDelete(item){
      this.itemToDelete = {
        digligenceReportId: item.dueDiligenceReportId,
        farmId:item.farmId
      }
      this.deleteconfirm=true;
    },

    async deleteProductionPlace(){
      this.startLoading();
      const deletedItem = this.itemToDelete;
      try {
        if(!deletedItem){
          this.$notify({
            title: this.$t('somethingWentWrong'),
            type: "error",
          });
        }
        const res = await DeforestationService.removeFarmFromProductionPlace(deletedItem.digligenceReportId,deletedItem.farmId);

        const { success, message } = res.data.removeFarmFromProductionPlaceList;
        this.stopLoading();
        if(success){
          // Log the production place deletion
          try {
            const userId = this.$store.getters.getUser?.id;
            if (userId) {
              await ActivityLogService.logDDSProductionPlaceDeleted(
                this.diligenceId,
                userId,
                deletedItem.farmId,
                deletedItem.farmName || '',
                'User initiated deletion'
              );
            }
          } catch (logError) {
            console.error('Error logging production place deletion:', logError);
          }

          await this.getProductionPlaces();
          this.$notify({
            title: message ||this.$t('dueDiligence.itemDeletedSuccessfully'),
            type:'success'
          })
        }
        else{
          this.$notify({
            title: message || this.$t('somethingWentWrong'),
            type:'error'
          })
        }
        this.deleteconfirm = false;
      } catch (err) {
        this.$notify({
          title: err.message || this.$t('somethingWentWrong'),
            type: "error",
        });
      }
      finally {
        this.stopLoading();
      }
    },

    handleCheckboxChange(item){
      console.log("Selected items:", item);
    },

    handleAddNewSection(type){
      this.addNewType = type;
    },
    async setActiveButton(buttonType){
      if(buttonType ==='existing'){
        await this.getProductionPlaces();
        this.addNewType = buttonType;
      }
      this.activeButton = buttonType;
    },
    updateTotalArea(index){
      this.addProductionPlaces[index].totalArea = this.calculateTotalArea(index);
    },

    calculateTotalArea(index){
      const totalArea = this.addProductionPlaces[index].farms.reduce((total, details) => {
        const area = parseFloat(details.area);
        return total + (isNaN(area) ? 0 : area);
      }, 0);

      return totalArea.toFixed(5); 
    },

    handleAddProductionPlace(){
      this.addProductionPlaces.push({
        producerName: "",
        producerCountry: this.countryOfProduction,
        totalArea: "",
        farms: [
          {
            farmName: "",
            area: "",
            farmType: "",
          }
        ]
      })
    },

    handleRemoveAddedProductionPlace(index){
      this.addProductionPlaces.splice(index,1)
      this.updateTotalArea(index)
    },

    handleAddInput(index){
      this.addProductionPlaces[index].farms.push({
        farmName: "",
        area: "",
        farmType: ""
      })
    },

    removeProductionPlace(){
      this.addProductionPlaces.pop();
    },

    removeSourceType(){
      this.addNewType = ""
    },

    handleRemoveInput(index,subIndex){
      this.addProductionPlaces[index].farms.splice(subIndex,1)
    },

    showGeofence(index, subIndex){
      this.currentIndex = index;
      this.currentSubIndex = subIndex;
      const farm = this.addProductionPlaces[this.currentIndex].farms[this.currentSubIndex];
      if(!farm.farmType){
        this.$notify({
          title: this.$t('farm.pleaseSelectFarmType'),
          type: "error",
        });

        return;
      }
      this.showGeofenceMap=true
    },

    saveGeoLocationPoints(gData){
      const { farmName, coordinates, pointCoordinates, farmType, location , area, generateMethod, dataEntryMethod} = gData;
      console.log({gData})
      const farm = {};
      const prevFarm = this.addProductionPlaces[this.currentIndex].farms[this.currentSubIndex] || {};
      farm.farmName = farmName;
      farm.farmType = farmType;
      farm.address = location;
      farm.area = (area / 2.471).toFixed(5);
      farm.generateMethod = this.addNewType === 'manual' ? 'MANUAL' : (generateMethod || null);
      farm.dataEntryMethod = dataEntryMethod;
      farm.productionPlaceId = prevFarm.productionPlaceId || null;
      farm.geofenceId = prevFarm.geofenceId || null;
      farm.farmId = prevFarm.farmId || null;

      if(farmType == "POLYGON"){
        farm.pointCoordinates = {};
        farm.coordinates = coordinates;
      }
      else{
        farm.coordinates = [];
        farm.pointCoordinates = pointCoordinates;
      }
      this.addProductionPlaces[this.currentIndex].farms[this.currentSubIndex] = farm
      this.updateTotalArea(this.currentIndex);

    },

    closeGeoLocationModal(){
      this.currentIndex = null;
      this.currentSubIndex = null;
      this.showGeofenceMap = false;
    },

    async saveProductionPlaceForFarms() {
      try {
        console.log(this.selected, "this.selected")
        if(this.selected.length < 1){
          this.$notify({
            title: this.$t('dueDiligence.pleaseSelectAtLeastOneItem'),
            type: "error",
          });
          return false;
        }
        let productionPlaces = this.selected.filter(x => x.farmCoordinates.length || x.circularGeofence || (x.lat && x.log)).map(farm => {
            let farmType
            const producerName = `${farm?.user?.firstName || ''} ${farm?.user?.lastName || ''}`;
            const producerCountry = farm?.user?.country || '';
            if(farm.farmCoordinates.length) {
              farmType = 'POLYGON'
            } else if(farm.lat && farm.log) {
              farmType = 'POINT'
            } else {
               farmType = 'POINT'
            }
            const transformedFarm = {
              farmId: Number(farm.id),
              farmName: farm.farmName,
              area: farm.area ? parseFloat(Number(farm.area)/2.47) : 0, //parseFloat(farm.area * 0.404686), // converted into ha backend will convert ha to acre;
              farmType,
              location: farm.address || '',
              registrationNo:farm?.registrationNo,
              farmerRegId:farm?.farmerId
            };
            if (farmType === 'POLYGON') {
              transformedFarm.coordinates = farm.farmCoordinates.map(coord => ({
                latitude: coord.lat.toString(),
                longitude: coord.log.toString(),
              }));
            } else if (farm.circularGeofence) {
              transformedFarm.pointCoordinates = {
                centerLatitude: farm.circularGeofence.geofenceCenterLat.toString(),
                centerLongitude: farm.circularGeofence.geofenceCenterLog.toString(),
                radius: farm.circularGeofence.geofenceRadius.toString(),
              };
            } else if(farm.lat && farm.log && !farm.circularGeofence && !farm.farmCoordinates.length) {
              console.log("default to 4ha circular polygon for farm with farm location coordiantes only")
              transformedFarm.pointCoordinates = {
                centerLatitude: farm.lat.toString(),
                centerLongitude: farm.log.toString(),
                radius: "112.84", // default to 4ha circular polygon for farm with farm location coordiantes only
              };
            }
            return {
              producerName,
              producerCountry,
              farms: [transformedFarm],
            };
          })
        await this.startLoading();
        const payloadData = {
          sourceType: this.addNewType,
          dueDiligenceReportId: Number(this.diligenceId),
          productionPlaces: productionPlaces
        };
        // Sending the payload to the service
        const response = await DeforestationService.saveProductionPlaces(
            payloadData
        );
        const { success, message } = response?.data?.createProductionPlaces;

        await this.stopLoading();

        await this.getProductionPlaces();
        // Handling the response
        if (success) {
          this.selected = [];
          this.$notify({
            title: message,
            type: "success",
          });
          return true;
        } else {
          this.$notify({
            title: this.$t('somethingWentWrong'),
            type: "error",
          });
          return false;
        }
      } catch (error) {
        // Error handling
        this.$notify({
          title: error.message || this.$t('somethingWentWrong'),
          type: "error",
        });
        return false;
      } finally {
        this.stopLoading();
      }
    },

    async saveProductionPlace(){

      if(!this.$refs.productionPlaceForm.validate()) return;

      try {
        this.startLoading();
        // 1) Update existing production places (manual edit) when productionPlaceId is present
        const updatePromises = [];
        this.addProductionPlaces.forEach((producer) => {
          producer.farms.forEach((farm) => {
            if (farm.productionPlaceId) {
              const farmPayload = {
                farmName: farm.farmName,
                area: parseFloat(farm.area),
                farmType: farm.farmType,
                location: farm.address,
                generateMethod: this.addNewType === 'manual' ? 'MANUAL' : (farm.generateMethod || null),
                ...(farm.geofenceId && { geofenceId: Number(farm.geofenceId) }),
              };
              if (farm.farmType === 'POLYGON') {
                if (!farm.coordinates || farm.coordinates.length === 0) throw new Error('Missing polygon coordinates');
                farmPayload.coordinates = farm.coordinates.map((coord) => ({
                  ...(coord.id && { id: Number(coord.id) }),
                  latitude: (coord.latitude || coord.lat).toString(),
                  longitude: (coord.longitude || coord.lng).toString(),
                }));
              } else if (farm.farmType === 'POINT') {
                if (!farm.pointCoordinates) throw new Error('Missing point coordinates');
                farmPayload.pointCoordinates = {
                  centerLatitude: farm.pointCoordinates.centerLatitude.toString(),
                  centerLongitude: farm.pointCoordinates.centerLongitude.toString(),
                  radius: farm.pointCoordinates.radius.toString(),
                };
              }
              const updateInput = {
                id: Number(farm.productionPlaceId),
                dueDiligenceReportId: Number(this.diligenceId),
                producerName: producer.producerName,
                producerCountry: producer.producerCountry,
                farms: farmPayload,
                isEdit: true,
              };
              updatePromises.push(DeforestationService.updateDueDiligenceReport(updateInput));
            }
          });
        });
        const updateResults = updatePromises.length ? await Promise.allSettled(updatePromises) : [];

        // 2) Create new production places only for farms without productionPlaceId
        const createPayload = this.addProductionPlaces
          .map((producer) => {
            const farms = producer.farms
              .filter((farm) => !farm.productionPlaceId)
              .map((farm) => {
                const transformedFarm = {
                  farmId: Number(farm.farmId),
                  farmName: farm.farmName,
                  area: parseFloat(farm.area),
                  farmType: farm.farmType,
                  location: farm.address,
                  generateMethod: this.addNewType === 'manual' ? 'MANUAL' : (farm.generateMethod || null),
                };
                if (farm.farmType === 'POLYGON') {
                  if (!farm.coordinates || farm.coordinates.length === 0) throw new Error('Missing polygon coordinates');
                  transformedFarm.coordinates = farm.coordinates.map((coord) => ({
                    latitude: (coord.latitude || coord.lat).toString(),
                    longitude: (coord.longitude || coord.lng).toString(),
                  }));
                } else if (farm.farmType === 'POINT') {
                  if (!farm.pointCoordinates) throw new Error('Missing point coordinates');
                  transformedFarm.pointCoordinates = {
                    centerLatitude: farm.pointCoordinates.centerLatitude.toString(),
                    centerLongitude: farm.pointCoordinates.centerLongitude.toString(),
                    radius: farm.pointCoordinates.radius.toString(),
                  };
                }
                return transformedFarm;
              });
            if (farms.length === 0) return null;
            return {
              producerName: producer.producerName,
              producerCountry: producer.producerCountry,
              farms,
            };
          })
          .filter(Boolean);

        let createOk = true;
        if (createPayload.length) {
          const payloadData = {
            sourceType: this.addNewType,
            dueDiligenceReportId: Number(this.diligenceId),
            productionPlaces: createPayload,
          };
          const response = await DeforestationService.saveProductionPlaces(payloadData);
          createOk = !!response?.data?.createProductionPlaces?.success;
        }

        await this.stopLoading();
        const anyUpdateFailed = updateResults.some((r) => r.status === 'rejected');
        if (!anyUpdateFailed && createOk) {
          this.$notify({ title: this.$t('dueDiligence.itemUpdatedSuccessfully') || 'Saved successfully', type: 'success' });
          return true;
        }
        this.$notify({ title: this.$t('somethingWentWrong'), type: 'error' });
        return false;
      } catch (error) {
         // Error handling
         this.$notify({
          title: error.message || this.$t('somethingWentWrong'),
          type: "error",
        });
        return false;
      }
      finally {
        this.stopLoading();
      }
    },

    async saveBulkCoffeeProductionPlace() {
      try {
        if(this.selected.length < 1){
          this.$notify({
            title: this.$t('dueDiligence.pleaseSelectAtLeastOneItem'), 
            type: "error",
          });
          return false;
        }
        await this.startLoading();
        const collectFarms = []
        this.selected.forEach(element => {
            element.buyingStationOrder.forEach(x => {
                if(x.plantations && x.plantations.userFarms.length){
                  collectFarms.push(...x.plantations.userFarms)
                }else{
                  collectFarms.push(x.userFarms)
                }
            })
        })

        const payloadData = {
          sourceType: this.addNewType,
          dueDiligenceReportId: Number(this.diligenceId),
          productionPlaces: collectFarms.filter(x => {
            return x?.farmCoordinates.length  || !isEmpty(x.circularGeofence)
          }).map(farm => {
            const producerName = `${farm?.user?.firstName || ''} ${farm?.user?.lastName || ''}`;
            const producerCountry = farm?.user?.country || '';
            const farmType = farm.farmCoordinates.length ? 'POLYGON' : 'POINT';
            const transformedFarm = {
              farmId: Number(farm.id),
              farmName: farm.farmName,
              area: parseFloat(farm.area * 0.404686), // converted into ha backend will convert ha to acre;
              farmType,
              location: farm.address || '',
              registrationNo:farm?.registrationNo,
              farmerRegId:farm?.farmerId
            };
            if (farmType === 'POLYGON') {
              transformedFarm.coordinates = farm.farmCoordinates.map(coord => ({
                latitude: coord.lat.toString(),
                longitude: coord.log.toString(),
              }));
            } else if (farm.circularGeofence) {
              transformedFarm.pointCoordinates = {
                centerLatitude: farm.circularGeofence.geofenceCenterLat.toString(),
                centerLongitude: farm.circularGeofence.geofenceCenterLog.toString(),
                radius: farm.circularGeofence.geofenceRadius.toString(),
              };
            }

            return {
              producerName,
              producerCountry,
              farms: [transformedFarm],
            };
          }),
        };



        // Sending the payload to the service
        const response = await DeforestationService.saveProductionPlaces(
            payloadData
        );
        const { success, message } = response?.data?.createProductionPlaces;

        await this.stopLoading();

        await this.getProductionPlaces();
        // Handling the response
        if (success) {
          this.selected = [];
          this.$notify({
            title: message,
            type: "success",
          });
          return true;
        } else {
          this.$notify({
            title: this.$t('somethingWentWrong'),
            type: "error",
          });
          return false;
        }
      } catch (error) {
        // Error handling
        this.$notify({
          title: error.message || this.$t('somethingWentWrong'),
          type: "error",
        });
        return false;
      } finally {
        this.stopLoading();
      }
    },

    async saveBulkCacaoProductionPlace() {
      try {

        if(this.selected.length < 1){
          this.$notify({
            title: this.$t('dueDiligence.pleaseSelectAtLeastOneItem'),
            type: "error",
          });
          return false;
        }
        await this.startLoading();

        let collectFarms = []
        this.selected.forEach(element => {
            element.cacaoPurchaseOrder.forEach(x => {
                if(x.cacaoPlantations && x.cacaoPlantations.userFarms.length){
                  collectFarms.push(...x.cacaoPlantations.userFarms)
                }else{
                  collectFarms.push(x.userFarms)
                }
            })
        })

        const payloadData = {
          sourceType: this.addNewType,
          dueDiligenceReportId: Number(this.diligenceId),
          productionPlaces: collectFarms.filter(x =>{
            return x.farmCoordinates.length || !isEmpty(x.circularGeofence)
          }).map(farm => {
            const producerName = `${farm.user?.firstName || ''} ${farm.user?.lastName || ''}`;
            const producerCountry = farm.user?.country || '';
            const farmType = farm.farmCoordinates.length ? 'POLYGON' : 'POINT';

            const transformedFarm = {
              farmId: Number(farm.id),
              farmName: farm.farmName,
              area: parseFloat(farm.area * 0.404686), // converted into ha backend will convert ha to acre;
              farmType,
              location: farm.address || '',
              registrationNo:farm?.registrationNo,
              farmerRegId:farm?.farmerId
            };
            if (farmType === 'POLYGON') {
              transformedFarm.coordinates = farm.farmCoordinates.map(coord => ({
                latitude: coord.lat.toString(),
                longitude: coord.log.toString(),
              }));
            } else if (farm.circularGeofence) {
              transformedFarm.pointCoordinates = {
                centerLatitude: farm.circularGeofence.geofenceCenterLat.toString(),
                centerLongitude: farm.circularGeofence.geofenceCenterLog.toString(),
                radius: farm.circularGeofence.geofenceRadius.toString(),
              };
            }
            return {
              producerName,
              producerCountry,
              farms: [transformedFarm],
            };
          }),
        };



        // Sending the payload to the service
        const response = await DeforestationService.saveProductionPlaces(
            payloadData
        );
        const { success, message } = response?.data?.createProductionPlaces;

        await this.stopLoading();

        await this.getProductionPlaces();
        // Handling the response
        if (success) {
          this.selected = [];
          this.$notify({
            title: message,
            type: "success",
          });
          return true;
        } else {
          this.$notify({
            title: this.$t('somethingWentWrong'),
            type: "error",
          });
          return false;
        }
      } catch (error) {
        // Error handling
        this.$notify({
          title: error.message || this.$t('somethingWentWrong'),
          type: "error",
        });
        return false;
      } finally {
        this.stopLoading();
      }
    },

    async saveBulkProductionPlace() {
      try {

        if(this.selected.length < 1){
          this.$notify({
            title: this.$t('dueDiligence.pleaseSelectAtLeastOneItem'),
            type: "error",
          });
          return false;
        }
        await this.startLoading();

        const payloadData = {
          sourceType: this.addNewType,
          dueDiligenceReportId: Number(this.diligenceId),
          productionPlaces: this.selected.map(producer => {
            const producerName = `${producer?.farm?.userDdsAssoc?.firstName || ''} ${producer?.farm?.userDdsAssoc?.lastName || ''}`;
            const producerCountry = producer?.farm?.userDdsAssoc?.countryId || '';

            const transformedFarm = {
              farmName: producer.farm.farmName,
              farmId:Number(producer?.farm?.id),
              area: parseFloat(producer.farm.area * 0.404686),
              farmType: producer.farmType.toLowerCase() === 'polygon' ? "POLYGON" : "POINT",
              location: producer.farm.address || '',
            };

            if (producer.farmType.toLowerCase() === 'polygon') {
              transformedFarm.coordinates = producer.farm.FarmCoordinates.map(coord => ({
                latitude: coord.lat.toString(),
                longitude: coord.log.toString(),
              }));
            } else if (producer.farmType.toLowerCase() === 'point' && producer.farm.GeoFences.length > 0) {
              const [geoFence] = producer.farm.GeoFences;
              transformedFarm.pointCoordinates = {
                centerLatitude: geoFence.geofenceCenterLat.toString(),
                centerLongitude: geoFence.geofenceCenterLog.toString(),
                radius: geoFence.geofenceRadius.toString(),
              };
            }

            return {
              copyOf: parseInt(producer.id),
              producerName,
              producerCountry,
              farms: [transformedFarm],
            };
          }),
        };


        // Sending the payload to the service
        const response = await DeforestationService.saveProductionPlaces(
          payloadData
        );
        const { success, message } = response?.data?.createProductionPlaces;

        await this.stopLoading();

        await this.getProductionPlaces();
        // Handling the response
        if (success) {
          this.selected = [];
          this.$notify({
            title: message,
            type: "success",
          });
          return true;
        } else {
          this.$notify({
            title: this.$t('somethingWentWrong'),
            type: "error",
          });
          return false;
        }
      } catch (error) {
        // Error handling
        this.$notify({
          title: error.message || this.$t('somethingWentWrong'),
          type: "error",
        });
        return false;
      } finally {
        this.stopLoading();
      }
    },

    pageChange(t) {
        if (t){
            this.tableOptions.page = this.tableOptions.page + 1;
        } else {
            this.tableOptions.page = this.tableOptions.page - 1;
        }
        this.getProductionPlaces()
    },
    async customDateFilterSelect() {
      this.customFilterMenu = false;

      //await this.getReports();
    },



    getImportTypeText() {
      if (this.importType == ".xml") {
        return "XML";
      } else if (this.importType == ".geojson") {
        return "GJ";
      }
      return "";

    },

    onChange(e) {
      let fileNameArr = this.files.map(file => file.name);
      // check if the file is already in the list
      if (fileNameArr.includes(e.target.files[0].name)) {
        this.$notify({
          title: this.$t("dueDiligence.fileAlreadyExists"),
          type: "error",
        });
        return;
      }
      var inputFiles = e.target.files || e.dataTransfer.files;
      if (!inputFiles.length) {
        this.dragging = false;
        return;
      }

      const processFiles = async () => {
        let validFiles = [];
        for (let i = 0; i < inputFiles.length; i++) {
          let file = inputFiles[i];
          let extensionStr = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
          if (
            extensionStr === ".xml" ||
            extensionStr === ".geojson" ||
            extensionStr === ".zip" ||
            extensionStr === ".kml" ||
            extensionStr === ".kmz"
          ) {
            validFiles.push(file);
          } else if (extensionStr === ".csv") {
            const isValid = await this.validateCSV(file);
            if (isValid) {
              validFiles.push(file);
            } else {
              // Optionally clear the file input if invalid
              e.target.value = '';
            }
          }
          else if (extensionStr === ".xlsx" || extensionStr === ".xls") {
            const isValid = await this.validateExcel(file);
            if (isValid){
              validFiles.push(file);
            } else {
              // Optionally clear the file input if invalid
              e.target.value = '';
            }
          }
           else {
            this.$notify({
              title: this.$t(
                "dueDiligence.invalidFileFormatPleaseUploadValidFile"
              ),
              type: "error",
            });
          }
        }
        this.files = this.files.concat(validFiles);
      };
      processFiles();
      this.dragging = false;
    },
    removeFiles() {
      this.files = [];
      this.progress = 0;
    },
    async uploadFile() {
      this.startTimer++;
      this.showProcessingDialog = true;
      try {
        if (!this.files || this.files.length === 0) {
          this.$notify({
            title: this.$t("dueDiligence.pleaseUploadAValidFile"),
            type: "error",
          });
          return false;
        }
        // If all files are Excel, use the Excel endpoint
        if (this.files.every(f => f.name.toLowerCase().endsWith('.xlsx') || f.name.toLowerCase().endsWith('.xls'))) {
          this.showProcessingDialog = false;
          return await this.uploadExcelFiles();
        }
        // If all files are CSV, use the CSV endpoint
        if (this.files.every(f => f.name.toLowerCase().endsWith('.csv'))) {
          this.showProcessingDialog = false;
          return await this.uploadCsvFiles();
        }
        // Validate all files (geojson and others)
        for (const file of this.files) {
          const fileExtension = this.getFileExtension(file.name);
          if (fileExtension === 'geojson') {
            await this.validateGeoJSON(file);
            if (!this.isValidFile) {
              this.$notify({
                title: this.$t("dueDiligence.pleaseUploadAValidFile"),
                type: "error",
              });
              return false;
            }
          } else if (fileExtension === 'csv') {
            const isValid = await this.validateCSV(file);
            if (!isValid) {
              this.$notify({
                title: this.$t("dueDiligence.pleaseUploadAValidFile"),
                type: "error",
              });
              return false;
            }
          }
        }
        let formData = new FormData();

        formData.append('sourceType', this.addNewType);
        for (const file of this.files) {
            formData.append(`files`, file);
        }
        
          const reportId = Number(this.diligenceId);
          const res = await DeforestationService.importProductionPlace(formData, reportId);
          if (res?.response?.status === 400) {
            this.$notify({
              title: get(res, 'response.data.message', this.$t('dueDiligence.invalidCoordinatesFormat')),
              type: "error",
            });
            this.stopLoading();
            return false;
          }
          // ...existing job polling logic...
          const job = res.job;

        // --- START FIX: Inlined Promise for Polling ---
        const jobResult = await new Promise((resolve, reject) => { // Capture the resolved value
          let intervalId;
          // Set the overall timeout for job processing
          const timeoutId = setTimeout(() => {
            clearInterval(intervalId); // Stop polling
            resolve('timedOut'); // Resolve with 'timedOut' status instead of rejecting
          }, 30000); // 30 seconds timeout

          // Start polling the job status at regular intervals
          intervalId = setInterval(async () => {
            try {
              const response = await DeforestationService.getJob(job.id);
              const jobStatus = response.data?.job.status;

              if (jobStatus === 'Failed') {
                clearTimeout(timeoutId); // Clear the overall timeout
                clearInterval(intervalId); // Stop polling
                reject(new Error('Failed to import production place, please try again.')); // Still reject on explicit failure
              } else if (jobStatus === 'Completed') {
                clearTimeout(timeoutId); // Clear the overall timeout
                clearInterval(intervalId); // Stop polling
                resolve('completed'); // Resolve with 'completed' status on success
              }
              // If status is still 'Processing', the interval continues
            } catch (error) {
              // Catch errors during the polling API call itself
              clearTimeout(timeoutId);
              clearInterval(intervalId);
              reject(error); // Propagate the error
            }
          }, 5000); // Poll every 5 seconds
        });
        // --- END FIX ---

        // Handle the result of the polling promise
        if (jobResult === 'completed') {
          // If the promise resolves with 'completed', it means the job finished successfully
          this.$emit("updateStep", 2);
          this.$notify({
            title: this.$t("dueDiligence.fileUploadedDuccessfully"),
            type: 'success',
          });
          this.showProcessingDialog = false;
          this.stopLoading();
          this.$router.push({ name: "dueDiligenceReports" });
        } else if (jobResult === 'timedOut') {
          // If the promise resolves with 'timedOut', it means the 30 seconds passed without completion
          this.stopLoading();
          this.showProcessingDialog = false;
          this.$router.push({ name: "dueDiligenceReports" });
          this.$notify({
            title: this.$t("dueDiligence.processingInBackground"),
            type: 'info',
          });
        }
     
        this.files = [];
        return true;
      } catch (err) {
        this.$notify({
          title: err.message || this.$t('somethingWentWrong'),
          type: "error",
        });
        this.stopLoading();
        return false;
      }
    },
    validateGeoJSON(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          let parsedJSON;
          this.fileContent = e.target.result;
          try {
            try {
              parsedJSON = JSON.parse(this.fileContent);
            } catch (error) {
              this.validationResult = '';
              this.isValidFile = false;
              reject(new Error("Invalid GeoJSON file. Please check the file and try again."));  // Reject with a more generic message
            }
            if (this.isValidGeoJSON(parsedJSON)) {
              this.validationResult = 'Valid GeoJSON file';
              this.isValidFile = true;
              resolve(this.isValidFile);
            } else {
              this.validationResult = 'Invalid GeoJSON file';
              this.isValidFile = false;
              resolve(this.isValidFile);
            }
          } catch (error) {
            this.validationResult = 'Invalid JSON file';
            this.isValidFile = false;
            reject(error);
          }
        };
        reader.onerror = reject;
        reader.readAsText(file);
      });
    },
    isValidGeoJSON(json) {
      // Basic GeoJSON validation
      if (!json.type) return false;
      if (!json.features && json.type !== 'Feature') return false;
      if (json.features && !Array.isArray(json.features)) return false;
      return true;
    },

    handleShowCoffeeCacaoTraceabilityDialog(item){
      this.traceItem = item
      this.showCoffeeCacaoTracebility = true
    },
    // Add CSV validation method
    validateCSV(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target.result;
          // Basic CSV validation: at least 2 lines (header + 1 row), comma-separated or tab-separated, header present
          const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
          if (lines.length < 2) {
            this.$notify({
              title: this.$t("dueDiligence.invalidCSVFile"),
              type: "error",
            });
            resolve(false);
            return;
          }
          // Try both comma and tab as delimiter
          let header = lines[0].split(',');
          if (header.length < 2) {
            header = lines[0].split('\t');
          }
          // Normalize header: trim and lowercase
          const normalizedHeader = header.map(h => h.trim().toLowerCase());
          // Required columns (strict template)
          const requiredHeaders = ["coordinates"];
          const missingHeaders = requiredHeaders.filter(h => !normalizedHeader.includes(h));
          if (missingHeaders.length > 0) {
            this.$notify({
              title: this.$t("dueDiligence.invalidCSVFile") + ': ' + this.$t('dueDiligence.missingColumnsExact', { columns: missingHeaders.join(', ') }),
              type: "error",
            });
            resolve(false);
            return;
          }
          this.$notify({
            title: this.$t("dueDiligence.validCSVFile"),
            type: "success",
          });
          resolve(true);
        };
        reader.onerror = () => {
          this.$notify({
            title: this.$t("dueDiligence.invalidCSVFile"),
            type: "error",
          });
          resolve(false);
        };
        reader.readAsText(file);
      });
    },
    async uploadCsvFiles() {
     
      this.showProcessingDialog = true;
      try {
        if (!this.files || this.files.length === 0) {
          this.$notify({
            title: this.$t("dueDiligence.pleaseUploadAValidFile"),
            type: "error",
          });
          this.showProcessingDialog = false;
          return false;
        }
        let formData = new FormData();
        for (const file of this.files) {
          if (file.name.toLowerCase().endsWith('.csv')) {
            formData.append('files', file);
          }
        }
        if (!formData.has('files')) {
          this.$notify({
            title: this.$t("dueDiligence.pleaseUploadAValidFile"),
            type: "error",
          });
          this.showProcessingDialog = false;
          return false;
        }
        const res = await DeforestationService.importCsvProductionPlace(formData, this.diligenceId);
        if (res?.response?.status === 400) {
          this.$notify({
            title: res?.response?.data?.message || this.$t('dueDiligence.invalidCoordinatesFormat'),
            type: "error",
          });
          this.showProcessingDialog = false;
          this.stopLoading();
          return false;
        }
        const job = res.job;
        if (job) {
          // --- START: Job Polling Logic (same as geojson) ---
          const jobResult = await new Promise((resolve, reject) => {
            let intervalId;
            const timeoutId = setTimeout(() => {
              clearInterval(intervalId);
              resolve('timedOut');
            }, 30000);
            intervalId = setInterval(async () => {
              try {
                const response = await DeforestationService.getJob(job.id);
                const jobStatus = response.data?.job.status;
                if (jobStatus === 'Failed') {
                  clearTimeout(timeoutId);
                  clearInterval(intervalId);
                  reject(new Error('Failed to import production place, please try again.'));
                } else if (jobStatus === 'Completed') {
                  clearTimeout(timeoutId);
                  clearInterval(intervalId);
                  resolve('completed');
                }
              } catch (error) {
                clearTimeout(timeoutId);
                clearInterval(intervalId);
                reject(error);
              }
            }, 5000);
          });
          if (jobResult === 'completed') {
            this.$emit("updateStep", 2);
            this.$notify({
              title: this.$t("dueDiligence.fileUploadedDuccessfully"),
              type: 'success',
            });
            this.showProcessingDialog = false;
            this.$router.push({ name: "dueDiligenceReports" });
          } else if (jobResult === 'timedOut') {
            this.showProcessingDialog = false;
            this.$router.push({ name: "dueDiligenceReports" });
            this.$notify({
              title: this.$t("dueDiligence.processingInBackground"),
              type: 'info',
            });
          }
        } else if (res?.success) {
          this.$notify({
            title: this.$t("File uploaded successfully!"),
            type: "success",
          });
          this.showProcessingDialog = false;
          this.$router.push({ name: "dueDiligenceReports" });
        } else {
          this.$notify({
            title: res?.message || this.$t("somethingWentWrong"),
            type: "error",
          });
          this.showProcessingDialog = false;
        }
        this.files = [];
        return true;
      } catch (err) {
        this.$notify({
          title: err.message || this.$t('somethingWentWrong'),
          type: "error",
        });
        this.showProcessingDialog = false;
        return false;
      } 
    },
    async uploadExcelFiles() {
      this.showProcessingDialog = true;
      try {
        if (!this.files || this.files.length === 0) {
          this.$notify({
            title: this.$t("dueDiligence.pleaseUploadAValidFile"),
            type: "error",
          });
          this.showProcessingDialog = false;
          return false;
        }
        let formData = new FormData();
        for (const file of this.files) {
          if (file.name.toLowerCase().endsWith('.xlsx') || file.name.toLowerCase().endsWith('.xls')) {
            formData.append('files', file);
          }
        }
        if (!formData.has('files')) {
          this.$notify({
            title: this.$t("dueDiligence.pleaseUploadAValidFile"),
            type: "error",
          });
          this.showProcessingDialog = false;
          return false;
        }
        const res = await DeforestationService.importExcelProductionPlace(formData, this.diligenceId);
        if (res?.response?.status === 400) {
          this.$notify({
            title: res?.response?.data?.message || this.$t('dueDiligence.invalidCoordinatesFormat'),
            type: "error",
          });
          this.showProcessingDialog = false;
          this.stopLoading();
          return false;
        }
        const job = res.job;
        if (job) {
          // --- START: Job Polling Logic (same as geojson/csv) ---
          const jobResult = await new Promise((resolve, reject) => {
            let intervalId;
            const timeoutId = setTimeout(() => {
              clearInterval(intervalId);
              resolve('timedOut');
            }, 30000);
            intervalId = setInterval(async () => {
              try {
                const response = await DeforestationService.getJob(job.id);
                const jobStatus = response.data?.job.status;
                if (jobStatus === 'Failed') {
                  clearTimeout(timeoutId);
                  clearInterval(intervalId);
                  reject(new Error('Failed to import production place, please try again.'));
                } else if (jobStatus === 'Completed') {
                  clearTimeout(timeoutId);
                  clearInterval(intervalId);
                  resolve('completed');
                }
              } catch (error) {
                clearTimeout(timeoutId);
                clearInterval(intervalId);
                reject(error);
              }
            }, 5000);
          });
          if (jobResult === 'completed') {
            this.$emit("updateStep", 2);
            this.$notify({
              title: this.$t("dueDiligence.fileUploadedDuccessfully"),
              type: 'success',
            });
            this.showProcessingDialog = false;
            this.$router.push({ name: "dueDiligenceReports" });
          } else if (jobResult === 'timedOut') {
            this.showProcessingDialog = false;
            this.$router.push({ name: "dueDiligenceReports" });
            this.$notify({
              title: this.$t("dueDiligence.processingInBackground"),
              type: 'info',
            });
          }
        } else if (res?.success) {
          this.$notify({
            title: this.$t("File uploaded successfully!"),
            type: "success",
          });
          this.showProcessingDialog = false;
          this.$router.push({ name: "dueDiligenceReports" });
        } else {
          this.$notify({
            title: res?.message || this.$t("somethingWentWrong"),
            type: "error",
          });
          this.showProcessingDialog = false;
        }
        this.files = [];
        return true;
      } catch (err) {
        this.$notify({
          title: err.message || this.$t('somethingWentWrong'),
          type: "error",
        });
        this.showProcessingDialog = false;
        return false;
      }
    },
    validateExcel(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const records = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            if (!records.length) {
              this.$notify({
                title: this.$t("dueDiligence.invalidFileFormatPleaseUploadValidFile"),
                type: "error",
              });
              resolve(false);
              return;
            }
            const headerRow = records[0].map(h => (h || '').toString().trim().toLowerCase());
            const requiredHeaders = ["member name", "member number", "coordinates"];
            const missingHeaders = requiredHeaders.filter(h => !headerRow.includes(h));
            if (missingHeaders.length > 0) {
              this.$notify({
                title: this.$t("dueDiligence.invalidExcelFile") + ': ' + this.$t('dueDiligence.missingColumnsExact', { columns: missingHeaders.join(', ') }),
                type: "error",
              });
              resolve(false);
              return;
            }
            this.$notify({
              title: this.$t("dueDiligence.validExcelFile"),
              type: "success",
            });
            resolve(true);
          } catch (err) {
            this.$notify({
              title: this.$t("dueDiligence.invalidFileFormatPleaseUploadValidFile"),
              type: "error",
            });
            resolve(false);
          }
        };
        reader.onerror = () => {
          this.$notify({
            title: this.$t("dueDiligence.invalidFileFormatPleaseUploadValidFile"),
            type: "error",
          });
          resolve(false);
        };
        reader.readAsArrayBuffer(file);
      });
    },
  },
  mixins: [loading, generalMixin]
}
</script>

<style lang="scss" scoped>
.v-input__slot {
  background-color: #f5f5f5;
}

::v-deep .v-data-table__wrapper {
  margin-top: 20px !important;
}


.progress-bar {
  display: flex;
  justify-content: center;
  align-items: center;
}

.progress-num {
  display: flex;
  justify-content: flex-end;
  font-weight: bold;
}

.uploadedFile-info {
  padding: 18px;
}

.dropZone {
  width: 100%;
  height: 150px;
  position: relative;
  border: 2px dashed #97a8b8;
  padding: 100px 0;
}

.dropZone:hover {
  border: 2px solid $primary-color;
}

.dropZone:hover .dropZone-title {
  color: $primary-color;
}

.dropZone-info {
  color: #a8a8a8;
  position: absolute;
  top: 50%;
  width: 100%;
  transform: translate(0, -50%);
  text-align: center;
}

.dropZone-title {
  color: #787878;
}

.dropZone input {
  position: absolute;
  cursor: pointer;
  top: 0px;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.dropZone-upload-limit-info {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
}

.dropZone-over {
  background: #5c5c5c;
  opacity: 0.8;
}

.dropZone-uploaded {
  width: 100%;
  height: 150px;
  position: relative;
  border: 2px solid $primary-color;
  // border-radius: 10px;
}

.dropZone-uploaded-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #a8a8a8;
  position: absolute;
  top: 50%;
  width: 100%;
  transform: translate(0, -50%);
  text-align: center;
}

.removeFile {
  width: 200px;
}

.link-input {
  border-radius: 8px;
  background-color: rgba(209, 209, 209, 0.15);
  padding: 8px;

  .link-text {
    background: none;
    border: none;
    padding: 8px;
    width: 80%;

    &:focus {
      outline: none;
    }
  }

  .link-btn {
    width: 20%;
    background-color: white;
  }


}

.upload-info {
  display: flex;
  align-items: flex-start;
  /* Align items to the top */
}

.close-icon-with-background primary--text {
  background-color: #f0f0f0;
  /* Adjust the background color as needed */
  border-radius: 50%;
  /* Make the background circular */
  padding: 8px;
  /* Adjust padding for appropriate sizing */
  display: flex;
  align-items: center;
  justify-content: center;
}
.cursor-pointer {
  cursor: pointer
}
.active-btn {
  background-color: var(--primary-color) !important;
  color: white !important;
}

::v-deep .non-clickable {
  pointer-events: none;
  cursor: default;
}
</style>