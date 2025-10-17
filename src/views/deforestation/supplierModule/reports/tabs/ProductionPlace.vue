<template>
  <div>
    <v-card elevation="0" class="px-5 mt-7">
      <v-card-text>
        <div class="d-flex">
          <h3 style="color:black">{{ $t('dueDiligence.addProductionPlaceData') }}
            <v-tooltip top color="00BD73" max-width="350">
              <template v-slot:activator="{ on, attrs }">
                <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
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
                <v-list-item-title class="cursor-pointer" @click="coffeeData = true;cacaoData = false">
                  {{ $t("dueDiligence.connectedCoffee") }}
                </v-list-item-title>
              </v-list-item>

              <v-list-item>
                <v-list-item-title class="cursor-pointer" @click="cacaoData = true; coffeeData = false">
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
                <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                  mdi-alert-circle
                </v-icon>
              </template>
              <span>{{ $t('Product Details') }}</span>
            </v-tooltip>
          </h3>
          <v-spacer></v-spacer>
          <v-icon @click="removeProductionPlace" v-if="addProductionPlaces.length > 0" class="icon-with-background" style="color:red">
            mdi-close-circle
          </v-icon>
        </div>

        <v-row>
          <v-col cols="12" class="mt-5">
            <v-btn color="primary" dark medium class="mr-3" @click="handleAddProductionPlace">
              {{ $t("dueDiligence.addProductionPlace") }}
            </v-btn>
          </v-col>

          <v-col cols="12">
            <v-card v-for="(addProductionPlace, index) in addProductionPlaces" :key="index" elevation="0"
              style="background-color: rgba(243, 243, 243, 0.5);">
              <v-card-text>
                <v-row>
                  <v-col cols="3">
                    <label for="text">
                      {{ $t('dueDiligence.producerName') }}
                    </label>
                    <v-text-field class="custom-input" :placeholder="$t('dueDiligence.producerName')"
                      v-model="addProductionPlaces[index].producerName" outlined dense></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <label for="text">
                      {{ $t('dueDiligence.producerCountry') }}
                    </label>
                      <v-autocomplete :items="countries" v-model="addProductionPlaces[index].producerCountry" item-text="name" item-value="code" dense outlined clearable
                      class="wdt" :placeholder="$t('deforestation.allCountries')" @change="getProductionPlaces"></v-autocomplete>
                  </v-col>
                  <v-col cols="3">
                    <label for="text">
                      {{ $t('dueDiligence.totalArea') }}
                    </label>
                    <v-text-field class="custom-input" :value="calculateTotalArea(index)" :placeholder="'34'" disabled v-model="addProductionPlaces[index].totalArea"
                      outlined dense></v-text-field>
                  </v-col>

                 <v-col cols="3">
                  <v-btn elevation="0" class="mt-5" fab color="success" small  @click="handleAddInput(index)">
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
                            dense></v-text-field>
                        </td>
                        <td> <v-text-field class="mt-3" :placeholder="$t('area')"
                            v-model="addProductionPlaces[index].farms[subIndex].area" @input="updateTotalArea(index)" outlined
                            dense></v-text-field>
                        </td>
                        <td> <v-select class="mt-3" :items="farmGeofenceType" dense
                            v-model="addProductionPlaces[index].farms[subIndex].farmType" outlined item-text="label" item-value="value" 
                            :placeholder="$t('dueDiligence.selectType')" /></td>
                        <td>
                          <div class="d-flex" style="margin-top: -10px;cursor: pointer;">
                            <v-icon style="color:#0FA958" @click="handleRemoveInput(index,subIndex)">mdi-close-circle-outline</v-icon>
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
                <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                  mdi-alert-circle
                </v-icon>
              </template>
              <span>{{  $t('dueDiligence.importProductionPlace') }}</span>
            </v-tooltip>
          </h3>
          <v-spacer></v-spacer>
          <v-icon class="icon-with-background" style="color:red">
            mdi-close-circle
          </v-icon>
        </div>
        <v-row>
          <v-col cols="6" class="my-5">
            <form autocomplete="off">
              <v-card-text class="black--text">
                <v-menu bottom origin="center center" transition="scale-transition">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="primary" v-bind="attrs" v-on="on" dark class="mr-3">
                      <v-icon small class="mr-2">mdi-tray-arrow-down</v-icon>
                      {{ $t("dueDiligence.downloadXLSFormat") }}
                      <v-icon>mdi-chevron-down</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item @click="toggleFarmBulkImportDialog('GeoJson')">
                          <v-list-item-title class="cursor-pointer">
                            <a class="text-decoration-none black--text"  download href="/files/production-place-bulk-import/production-place-bulk-import-template.geojson">
                              {{ $t('dueDiligence.downloadGeoJsonFormat') }}
                            </a>
                          </v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="toggleFarmBulkImportDialog('XLS')">
                          <v-list-item-title class="cursor-pointer">
                            <a class="text-decoration-none black--text"  download href="/files/production-place-bulk-import/production-place-bulk-import-template.xml">
                              {{ $t('dueDiligence.downloadXMLFormat') }}
                            </a>
                          </v-list-item-title>
                      </v-list-item>
                  </v-list>
                </v-menu>
            
                <span class="red--text ml-5">{{ $t("dueDiligence.importantNote") }}</span>:
                {{ $t("dueDiligence.downloadFileFormatTemplates") }}

                <div class="form mt-4">
                  <div v-if="!file">
                    <div :class="['dropZone', dragging ? 'dropZone-over' : '']" @dragenter="dragging = true"
                      @dragleave="dragging = false">
                      <div class="dropZone-info" @drag="onChange">
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
                        accept=".geoJson,.xml"
                        @change="onChange"
                      />
                    </div>
                    <span class="red--text">{{ fileError }}</span>
                  </div>
                  <div v-else class="dropZone-uploaded">
                    <div class="dropZone-uploaded-info">
                      <v-btn class="ma-2 white--text" @click="removeFile" color="info" outlined>
                        {{ $t("oma.removeFile") }}
                        <v-icon right dark> mdi-trash-can </v-icon>
                      </v-btn>
                    </div>
                  </div>
                  <v-chip v-if="file" label color="grey lighten-4" class=" mt-4 uploadedFile-info">
                    <v-icon left small>
                      mdi-file-check
                    </v-icon>
                    {{ file.name }}
                  </v-chip>
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
          <h3 style="color:black">{{ $t('dueDiligence.existingProductionPlaces') }}</h3>
          <v-spacer></v-spacer>
          <v-icon class="icon-with-background" style="color:red">
            mdi-close-circle
          </v-icon>
        </div>

        <v-data-table :headers="placesHeaders" :items="productionPlaces" hide-default-footer v-model="selected"
          show-select :server-items-length="totalProductionPlaces" loading-text="Production Places...">
          <template v-slot:top="{ }">
            <div class="d-flex mt-5">
              <div style="width: 290px;">
                <label for="text">
                  {{ $t("dueDiligence.internalReferenceNumber") }}
                  <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                        mdi-alert-circle
                      </v-icon>
                    </template>
                    <span>{{ $t('dueDiligence.internalReferenceNumber') }}</span>
                  </v-tooltip>
                </label>
                <v-text-field prepend-inner-icon="mdi-magnify" outlined height="5px" :placeholder="$t('search')" dense
                  v-model="productionPlaceInput.internalRefNum" @input="debouncedGetProductionPlaces" class="shrink" clearable></v-text-field>
              </div>
              <div class="ml-3" style="width: 290px;">
                <label for="text">{{ $t('country') }}</label>
                <v-autocomplete :items="countries" v-model="productionPlaceInput.farmCountry" item-text="name" item-value="code" dense outlined clearable
                  class="wdt" :placeholder="$t('select')" @change="getProductionPlaces"></v-autocomplete>
              </div>

              <div class="ml-3" style="width: 290px;">
                <label for="text">{{ $t('dueDiligence.supplier') }}</label>
                <v-autocomplete :items="supplierList" v-model="productionPlaceInput.supplierId" item-text="label" item-value="val" dense outlined clearable
                  class="wdt" :placeholder="$t('select')" @change="getProductionPlaces"></v-autocomplete> 
              </div>

              <div class="ml-3" style="width: 290px;">
                <label for="text">{{ $t('deforestation.EUDRDeforestationStatus') }}</label>
                <v-autocomplete :items="EUDRstatusList" v-model="productionPlaceInput.eudrDeforestationStatus" item-text="label" item-value="val" dense outlined clearable
                  class="wdt" :placeholder="$t('select')" @change="getProductionPlaces"></v-autocomplete>
              </div>

              <div style="padding: 20px;">
                <v-dialog transition="dialog-top-transition" max-width="350" v-model="datepickerDialog"
                  @click:outside="datepickerDialog = false">
                  <v-card rounded="0">
                    <v-toolbar color="primary" class="white--text" flat :elevation="0">
                      <v-toolbar-title class="font-weight-bold">
                        {{ $t('dueDiligence.filterByDate')}}
                      </v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-btn icon class="white--text" @click="datepickerDialog = false">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </v-toolbar>
                    <v-card-text class="pt-5">
                      <div>
                        <h3 style="color:black">{{ $t('dueDiligence.dateOfRegister') }}</h3>
                        <v-date-picker no-title range v-model="productionPlaceInput.filterByDateOfRegister">
                        </v-date-picker>

                        <h3 style="color:black">{{ $t('dueDiligence.dateOfLastReport') }}</h3>
                        <v-date-picker no-title range v-model="productionPlaceInput.filterByDateOfLastReport">
                        </v-date-picker>
                      </div>
                    </v-card-text>
                    <v-divider class="mt-5"></v-divider>
                    <v-card-actions>
                      <v-btn outlined class="mr-2" depressed style="min-width: 150px;" color="primary" @click="clearDateFilter">
                        {{ $t("dueDiligence.clearAll") }}
                      </v-btn>

                      <v-btn color="primary" style="min-width: 150px;" @click="applyDateFilter">
                        {{ $t("search") }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>

                  <!-- </template> -->
                </v-dialog>
                <v-btn @click="datepickerDialog = true" icon>
                  <v-icon size="60" color="primary">mdi-calendar-month</v-icon>
                </v-btn>
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
              <tr v-for="(item, index) in items" :key="index + item.production_places_farm_id"
                style="position: relative; width: 0; height: 0">
                <td>
                  <v-checkbox multiple v-model="selected" :value="item" style="margin:0px;padding:0px" hide-details @change="handleCheckboxChange"/>
                </td>
                <td> 
                  {{ item.farm.farmName || '' }}<br>
                  {{ item.farmId || '' }}
                </td>
                <td> {{ item.diligenceReport.internalReferenceNumber || '' }} </td>
                <td> {{ item.diligenceReport.supplier.firstName || '' }}  {{ item.diligenceReport.supplier.lastName || '' }} </td>
                <td> {{ item.farm.userAssoc.firstName || '' }} {{ item.farm.userAssoc.lastName || '' }} </td>
                <td> {{ item.farm.address || '' }} </td>
                <td> {{ parseFloat(item.farm.area  * 0.404686).toFixed(4)|| '' }} </td> 
                <td>
                  <div class="d-flex justify-center">
                    <v-btn small rounded min-width="200" depressed class="green-button" height="34"
                      v-if="item.eudr_deforestation_status == 'Zero/Negligible Probability'">
                      {{ $t('Zero/Negligible Probability') }}

                    </v-btn>

                    <v-btn small rounded min-width="200" depressed class="very-high-button" height="34"
                      v-else-if="item.eudr_deforestation_status == 'Very High Probability'">
                      {{ $t('Very High Probability') }}
                    </v-btn>

                    <v-btn small rounded min-width="200" depressed class="very-low-button" height="34"
                      v-else-if="item.eudr_deforestation_status == 'Very Low Probability'">
                      {{ $t('Very Low Probability') }}
                    </v-btn>

                    <v-btn small rounded min-width="200" depressed class="red-button" height="34"
                      v-else-if="item.eudr_deforestation_status == 'High Probability'">
                      {{ $t('High Probability') }}

                    </v-btn>

                    <v-btn small rounded min-width="200" depressed class="orange-button" height="34"
                      v-else-if="item.eudr_deforestation_status == 'Low Probability'">
                      {{ $t('Low Probability') }}

                    </v-btn>

                    <v-btn small rounded min-width="200" depressed class="medium-button" height="34"
                      v-else-if="item.eudr_deforestation_status == 'Medium Probability'">
                      {{ $t('Medium Probability') }}

                    </v-btn>
                    <v-btn small rounded min-width="200" depressed class="manually-button" height="34"
                      v-else-if="item.eudr_deforestation_status == 'Manually Mitigated'">
                      {{ $t('Manually Mitigated') }}
                    </v-btn>

                    <span v-else>N/A</span>
                    <!-- <v-spacer></v-spacer>
                    <img class="ml-1" src="/icons/todo-list.png" style="width: 34px; height: 34px; border-radius: 50%;" /> -->
                  </div>
                </td>
                <td>
                  <div class="d-flex">
                    <v-btn small rounded min-width="175" depressed class="green-button" height="34"
                      v-if="true">
                      <!-- getModulePermittedActions.put -->
                      {{ $t('memberDataSection.approved') }}
                    </v-btn>

                    <v-btn small rounded min-width="175" depressed class="red-button" height="34"
                      v-if="item.risk_assessment == 'Rejected'">
                      <!-- getModulePermittedActions.put -->
                      {{ $t('memberDataSection.rejected') }}
                    </v-btn>

                    <v-btn small rounded min-width="175" depressed class="orange-button" height="34"
                      v-if="item.risk_assessment == 'Mitigation Required'">
                      <!-- getModulePermittedActions.put -->
                      {{ $t('deforestation.mitigationRequired') }}
                    </v-btn>
                    <v-spacer></v-spacer>
                    <!-- <img class="ml-1" src="/icons/todo-list.png" style="width: 34px; height: 34px; border-radius: 50%;" /> -->
                    <v-icon class="ml-1 green-shadow" @click="comfirmItemDelete(item)">mdi-trash-can</v-icon>

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
            <v-icon class="ml-5 green-shadow">mdi-trash-can</v-icon>
            <span class="ml-2">Delete</span>
          </div>
        </template>
      </v-card-text>
    </v-card>

    <v-card elevation="0" class="px-5 mt-5" v-if="coffeeData">
        <div class="d-flex">
          <h3 style="color:black">Connected Coffee</h3>
          <v-spacer></v-spacer>
          <v-icon class="icon-with-background" @click="handleremoveDimitraApps" style="color:red; cursor:pointer">
            mdi-close-circle
          </v-icon>
        </div>
        <ConnectedCoffee /> 
    </v-card>

    <v-card elevation="0" class="px-5 mt-5" v-if="cacaoData">
        <div class="d-flex">
          <h3 style="color:black">Connected Cacao</h3>
          <v-spacer></v-spacer>
          <v-icon class="icon-with-background" @click="handleremoveDimitraApps" style="color:red; cursor:pointer">
            mdi-close-circle
          </v-icon>
        </div>
        <ConnectedCacao /> 
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
  </div>
</template>
<script>
import loading from "@/mixins/LoadingMixin";
import GeoLocation from '../components/production-place/GeoLocation.vue'
import FarmService from "@/_services/FarmService";
import DeforestationService from "@/_services/DeforestationService";
import ConnectedCoffee from "./partials/ConnectedCoffee.vue";
import ConnectedCacao from "./partials/ConnectedCacao.vue";

import ConfirmBox from "@/components/ConfirmBox";
import { debounce } from 'lodash';
export default {

  async mounted() {
    await this.getCountries();
    await this.getSupplierList();
    await this.getProductionPlaces();
  },
  components:{
    GeoLocation,
    ConnectedCoffee,
    ConnectedCacao,
    ConfirmBox
  },
  props: {
    diligenceId: {
      type:Number,
      required: true
    },
  },
  data() {
    return {
      deleteconfirm:false,
      showGeofenceMap:false,
      datepickerDialog: false,
      coffeeData:false,
      cacaoData:false,
      countries: [],
      startMenu: false,
      endMenu: false,
      startDate: null,
      endDate: null,

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
          value: 'user',
          class: "black--text",
          width: '150px'
        },
        {
          text: this.$t('dueDiligence.internalReferenceNumber'),
          align: 'start',
          sortable: true,
          value: 'user',
          class: "black--text",
          width: '150px'
        },
        {
          text: this.$t('dueDiligence.supplier'),
          align: 'start',
          sortable: true,
          value: 'user',
          class: "black--text",
          width: '150px'
        },
        {
          text: this.$t('deforestation.producer'),
          value: 'plantation_name',
          sortable: true,
          class: "black--text",
          width: '150px'
        },
        {
          text: `${this.$t('deforestation.addressOfProduction')}`,
          value: 'farm',
          sortable: true,
          class: "black--text",
          width: '150px'
        },
        {
          text: `${this.$t('deforestation.areaHa')}`,
          value: 'farm',
          sortable: true,
          class: "black--text",
          width: '95px'
        },
        {
          text: `${this.$t('deforestation.EUDRDeforestationStatus')}`,
          value: 'farm',
          sortable: true,
          class: "black--text",
          width: '225px'
        },
        {
          text: `${this.$t('deforestation.riskAssessment')}`,
          value: 'farm',
          sortable: true,
          class: "black--text",
          width: '225px'
        },
      ],
      productionPlaces: [
        {
          "production_places_farm_id": "Gold Farm FR652189",
          "internal_reference_number": "BL12345623, CD34... ",
          "supplier": "Mathew Charles",
          "producer": "Ava Gracia",
          "address_of_production": "49 Featherstone Street Peru",
          "area": "10",
          "EUDR_deforestation_status": "Zero/Negligible Probability",
          "risk_assessment": "Approved"
        }, {
          "production_places_farm_id": "Gold Farm FR652189",
          "internal_reference_number": "BL12345623, CD34... ",
          "supplier": "Mathew Charles",
          "producer": "Joseph Harris",
          "address_of_production": "49 Featherstone Street Peru",
          "area": "15",
          "EUDR_deforestation_status": "High Probability",
          "risk_assessment": "Rejected"
        },
        {
          "production_places_farm_id": "Gold Farm FR652189",
          "internal_reference_number": "BL12345623, CD34... ",
          "supplier": "Mathew Charles",
          "producer": "Joseph Harris",
          "address_of_production": "49 Featherstone Street Peru",
          "area": "15",
          "EUDR_deforestation_status": "Low Probability",
          "risk_assessment": "Mitigation Required"
        },
      ],
      totalProductionPlaces: 0,
      farmStatus: 'success',
      EUDRstatusList:[
        {
          label: "Very High Probability",
          value: 'Very High Probability',
        },
        {
          label: "High Probability",
          value: 'High Probability',
        },
        {
          label: "Very Low Probability",
          value: 'Very Low Probability',
        },
        {
          label: "Low Probability",
          value: 'Low Probability',
        },
        {
          label: "Medium Probability",
          value: 'Medium Probability',
        },
        {
          label: "Zero/Negligible Probability",
          value: 'Zero/Negligible Probability',
        },
        {
          label: "Manually Mitigated",
          value: 'Manually Mitigated',
        },
      ],
      farmStatusList: [],
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
          producerName: "",
          producerCountry: "",
          totalArea: "",
          farms: [
            {
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
      file: "",
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
          label: "Point",
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
      activeButton: null,
      existingProductionPlaces:[],
      productionPlaceInput: {
        page: 1,
        limit: 10,
        searchPhrase: "",
        internalRefNum: "",
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
      }
    }
  },
  computed:{
    importTypeText(){
      return this.getImportTypeText();
    },
  
  },
  methods: {
    async triggerSubmit(){
      if(this.addNewType === 'manual'){
        await this.saveProductionPlace();
      }
      else if(this.addNewType === 'import'){
        await this.uploadFile();
      }
      else if(this.addNewType === 'existing'){
        await this.saveBulkProductionPlace();
      }
      else{
        this.$notify({
          type:"error",
          text:"Please select at least one source."
        });
        return false;
      }
    },

    handleremoveDimitraApps(){
      this.coffeeData = false
      this.cacaoData = false
    },
    async getCountries() {
      const data = await FarmService.loadCountries();
      this.countries = data.data;
    },
    async getSupplierList() {
        DeforestationService.getSupplierList().then(res => {
            this.supplierList = res.data.getSupplierList?.map((item)=>{
              return {
                label:item.firstName + ' ' + item.lastName,
                val:parseInt(item.id)
              }
            });
        }).catch(err => {
            console.log('Error', err)
        })
    },

    debouncedGetProductionPlaces: debounce(function(){
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
    
    async getProductionPlaces() {
      try {
        this.startLoading();
        this.productionPlaceInput = { ...this.productionPlaceInput, page: this.tableOptions.page, limit : this.tableOptions.itemsPerPage}
        const res = await DeforestationService.getProductionPlaces(this.productionPlaceInput);
        this.productionPlaces = res.data.productionPlaces.rows;
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
          await this.getProductionPlaces();
          this.$notify({
            title: message ||"Item deleted successfully.",
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
      return this.addProductionPlaces[index].farms.reduce((total,details)=>{
        const area = parseFloat(details.area);
        return total+ (isNaN(area) ? 0 : area);
      }, 0)
    },

    handleAddProductionPlace(){
      this.addProductionPlaces.push({
        producerName: "",
        producerCountry: "",
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
      const { coordinates, pointCoordinates, farmType, location , area } = gData;
      const farm = this.addProductionPlaces[this.currentIndex].farms[this.currentSubIndex];

      farm.farmType = farmType;
      farm.address = location;
      farm.area = area;

      this.updateTotalArea(this.currentIndex);

      if(farmType == "POLYGON"){
        farm.pointCoordinates = {};
        farm.coordinates = coordinates;
      }
      else{
        farm.coordinates = [];
        farm.pointCoordinates = pointCoordinates;
      }
    },
    
    closeGeoLocationModal(){
      this.currentIndex = null;
      this.currentSubIndex = null;
      this.showGeofenceMap = false;
    },

    async saveProductionPlace(){
      this.startLoading();
      const payloadData = {
        "productionPlaces": this.addProductionPlaces.map(producer=>{
          return {
            producerName: producer.producerName,
            producerCountry: producer.producerCountry,
            dueDiligenceReportId: Number(this.diligenceId),
            farms: producer.farms.map(farm => {
              const transformedFarm = {
                farmName: farm.farmName,
                area: parseFloat(farm.area),
                farmType: farm.farmType,
                location: farm.address
              };
              if (farm.farmType === "POLYGON") {
                transformedFarm.coordinates = farm.coordinates.map(coord => ({
                  latitude: coord.latitude.toString(),
                  longitude: coord.longitude.toString()
                }));
              } else if (farm.farmType === "POINT") {
                transformedFarm.pointCoordinates = {
                  centerLatitude: farm.pointCoordinates.centerLatitude.toString(),
                  centerLongitude: farm.pointCoordinates.centerLongitude.toString(),
                  radius: farm.pointCoordinates.radius.toString()
                };
              }
              return transformedFarm;
            })
          }
        })
      }
      DeforestationService.saveProductionPlaces(payloadData).then((res)=>{
        const { success, message } = res?.data?.createProductionPlaces;
        if(success){
          this.addProductionPlaces = [];
          this.$notify({
            title: message,
            type: "success",
          });
        }
        else{
          this.$notify({
            title: 'Something went wrong.',
            type: "error",
          });
        }
        
      })
      .catch((err)=>{
        this.$notify({
          title: err.message || 'Something went wrong.',
          type: "error",
        });
      })
      .finally(()=>{
        this.stopLoading();
      })
    },

    async saveBulkProductionPlace() {
      try {
        await this.startLoading();

        const payloadData = {
          productionPlaces: this.selected.map(producer => {
            const producerName = `${producer?.farm?.userAssoc?.firstName || ''} ${producer?.farm?.userAssoc?.lastName || ''}`;
            const producerCountry = producer?.farm?.userAssoc?.countryId || '';

            const transformedFarm = {
              farmName: producer.farm.farmName,
              area: parseFloat(producer.farm.area * 0.404686), // converted into ha backend will convert ha to acre;
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
              producerName,
              producerCountry,
              dueDiligenceReportId: Number(this.diligenceId),
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
        } else {
          this.$notify({
            title: this.$t('somethingWentWrong'),
            type: "error",
          });
        }
      } catch (error) {
        // Error handling
        this.$notify({
          title: error.message || this.$t('somethingWentWrong'),
          type: "error",
        });
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
      var files = e.target.files || e.dataTransfer.files;

      const file = e.target.files[0];

      //validate file by file name, shapefile doesnt give mimetype apparently
      let extensionStr = file.name.slice(file.name.lastIndexOf('.'));
      if (extensionStr !== ".xml" &&
        extensionStr !== ".geojson") {
        this.$notify({
          title: this.$t(
            "Invalid file format. Please upload a .xml, or .geojson file."
          ),
          type: "error",
        });
        return;
      }

      this.importType = extensionStr;

      if (!files.length) {
        this.dragging = false;
        return;
      }
      this.createFile(files[0]);
    },
    resetAndCloseDialog() {
      this.closeModal(!this.uploadError);
      this.file = "";
      this.progress = 0;
      this.progressColor = "success";
      this.progressIcon = "mdi-progress-upload";
      this.progressText = "Uploading...";
      this.responseMessage = "";
      this.tab = 0;
      this.uploadError = false;
    },
    createFile(file) {
      // if (!['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(file.type)) {
      //   this.fileError = this.$t("Only XLSX files are allowed");
      //   this.dragging = false;
      //   return;
      // }

      // if (file.size > 5000000) {
      //     alert('please check file size no over 5 MB.')
      //     this.dragging = false;
      //     return;
      // }

      this.file = file;
      this.dragging = false;
    },
    removeFile() {
      this.file = "";
      this.progress = 0;
    },
    uploadFile() {
      this.startLoading();
      let formData = new FormData();
      formData.append('file',this.file);
      const reportId = Number(this.diligenceId);
      DeforestationService.importProductionPlace(formData, reportId).then((res)=>{
        console.log(res)
        this.$notify({
            title: 'File uploaded successfully!',
            type: 'success',
        });
      })
      .catch((err)=>{
        this.$notify({
          title: err.message || 'Something went wrong.',
          type: "error",
        })
      })
      .finally(()=>{
        this.stopLoading();
      })
    },

  },
  mixins: [loading]
}
</script>

<style lang="scss" scoped>
.v-input__slot {
  background-color: #f5f5f5;
}

.v-data-table__wrapper {
  background-color: #b60d0d !important;
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
  width: 100%;
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

.green-button {
  background-color: #C1FFE7 !important;
  /* Green background */
  border: 2px solid #489E16 !important;
  /* Red border */
  color: #489E16 !important;
}

.green-shadow {
  color: #00BD73 !important;
}

.red-button {
  background-color: #FDEBEB !important;
  /* Green background */
  border: 2px solid #DA3D3D !important;
  /* Red border */
  color: #DA3D3D !important;

}

.orange-button {
  background-color: #FFF7EC !important;
  /* Green background */
  border: 2px solid #FFA826 !important;
  /* Red border */
  color: #FFA826 !important;

}

.medium-button{
  background-color: #FFCEB3 !important;
  border: 2px solid #F06B20 !important;
  color: #F06B20 !important;
}

.very-high-button{
  background-color: #FF8F8F !important;
  border: 2px solid #8B0000 !important;
  color: #8B0000 !important;
}

.very-low-button{
  background-color: #FFFCEC !important;
  border: 2px solid #F49238 !important;
  color: #F49238 !important;
}

.manually-button{
  background-color: #E2FFF4 !important;
  border: 2px solid #00BD73 !important;
  color: #00BD73 !important;
}


.close-icon-with-background {
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
</style>
