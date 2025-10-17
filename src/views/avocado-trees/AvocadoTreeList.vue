<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-8">
        <h2 class="text-capitalize">{{ $t("oma.avocadoTreesList") }}</h2>
        <v-autocomplete class="pl-5" style="max-width:250px" :items="farms" item-text="farmName" item-value="id"
          outlined dense :placeholder="$t('oma.selectFarm')" v-model="farm" @change="getTrees" return-object></v-autocomplete>
        <v-spacer></v-spacer>
        <v-btn depressed color="primary" class="mr-5" @click="addTreeManuallyClickHandler">
          {{ $t("oma.addTreesManually") }}
        </v-btn>
        <v-menu bottom origin="center center" transition="scale-transition">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" v-bind="attrs" v-on="on">
              {{ $t("oma.addTreesBulk") }}
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-title class="cursor-pointer"  @click="openImportDialog('csv')">
                {{ $t("oma.importCSVFormat") }}
              </v-list-item-title>
            </v-list-item>
            
             <!--<v-list-item>
              <v-list-item-title>
                {{ $t("oma.importShapeFilesFormat") }}
              </v-list-item-title>
            </v-list-item> -->

            <v-list-item>
              <v-list-item-title class="cursor-pointer" @click="openImportDialog('xlsx')">
                {{ $t("oma.importXLSFormat") }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title class="cursor-pointer"  @click="openImportDialog('geoJson')">
                {{ $t("oma.importGeoJsonFormat") }}
              </v-list-item-title>
            </v-list-item>

            <v-list-item>
              <v-list-item-title class="cursor-pointer"  @click="openImportDialog('topoJson')">
                {{ $t("oma.importTopoJsonFormat") }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title class="cursor-pointer"  @click="openImportDialog('geoPackage')">
                {{ $t("oma.importGeoPackageFormat") }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title class="cursor-pointer"  @click="openImportDialog('geobuf')">
                {{ $t("oma.importGeobufFormat") }}
              </v-list-item-title>
            </v-list-item>
            <!-- <v-list-item>
              <v-list-item-title>
                {{ $t("oma.importGeobufFormat") }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>
                {{ $t("oma.importGeoPackageFormat") }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>
                {{ $t("oma.topoJsonFormat") }}
              </v-list-item-title>
            </v-list-item> -->
            <!-- <v-list-item @click="uploadGenetic()" style="padding: 0">
             </v-list-item> -->
          </v-list>
        </v-menu>
      </div>
      <v-card flat class="mb-4">
        <div class="text-center">
          <v-row justify="center" align="center" v-if="!trees">
            <v-col cols="12" sm="4">
              <div class="py-16">
                <img src="/img/no-survey-list.svg" /><br />
                <strong class="red--text">{{ $t("noDataAvailable") }}</strong><br />
              </div>
            </v-col>
          </v-row>
          <div v-if="trees" class="pa-4">
            <v-data-table :headers="headers" :items="trees" :items-per-page="10" :footer-props="{
      'items-per-page-options': [10, 25, 50],
    }" :header-props="headerProps" hide-default-footer :loading="treesLoading" :options.sync="tableOptions"
              :server-items-length="totalTrees" loading-text="Loading Trees...">
              <template v-slot:top>
                <div class="d-flex mt-5">
                  <v-text-field prepend-inner-icon="mdi-magnify" outlined height="5px" :placeholder="$t('search')" dense
                    class="shrink" v-model="search" @input="searchTrees" @click:append="searchTrees"></v-text-field>
                  <v-btn :disabled="search.length < 1" color="primary" height="40" width="40" max-width="40" outlined
                    class="ml-8">
                    <v-icon>mdi-filter-outline</v-icon>
                  </v-btn>
                  <v-autocomplete class="pl-5" :items="countries" 
                  item-text="name" item-value="name" outlined dense
                    :placeholder="$t('oma.selectCountry')" 
                    v-model="country"
                    @change="getRegion" 
                    return-object
                    :no-data-text="$t('noDataAvailable')"
                    ></v-autocomplete>
                  <v-autocomplete class="pl-5 pr-16"
                   outlined 
                   dense 
                   v-model="region" 
                   @change="getTrees" 
                   :items="regions"
                    :placeholder="$t('oma.allRegions')" 
                    return-object
                    :no-data-text="$t('noDataAvailable')"
                    >
                  </v-autocomplete>

                  <v-select class="mx-3 mr-3" v-model="exportAs" 
                      :items="exportOptions" outlined dense item-value="id"
                      item-text="name" 
                      :placeholder="$t('exportAsCsv')" 
                      @change="exportReport">
                  </v-select>

                  <v-spacer></v-spacer>

                  <div class="py-1 title">{{ from }} - {{ to }} {{ $t('of') }} {{ totalTrees }}</div>
                  <v-btn class="mx-2" fab small outlined color="primary" :disabled="tableOptions.page <= 1"
                    @click="pageChange(false)">
                    <v-icon dark> mdi-chevron-left </v-icon>
                  </v-btn>
                  <v-btn class="mx-2" fab small outlined color="primary" :disabled="tableOptions.page >= totalPages"
                    @click="pageChange(true)">
                    <v-icon dark> mdi-chevron-right </v-icon>
                  </v-btn>
                </div>
              </template>
              <template v-if="trees.length > 0" v-slot:body="{ items }">
                <tbody>
                  <tr v-for="item in items" :key="item.id" @mouseover="selectItem(item)" @mouseleave="unSelectItem()"
                    style="position: relative; width: 0; height: 0">
                    <td class="text-left"> {{ item.clientTreeId }}</td>
                    <td class="text-left"> {{ item.treeName }}</td>
                    <td class="text-center"> {{ item.zoneId }}</td>
                    <td class="text-center"> {{ item.latitude }}</td>
                    <td class="text-center"> {{ item.longitude }}</td>
                    <td class="text-center"> {{ item.altitude }}</td>
                    <td class="text-center"> {{ formatDate(item.plantationDate) }}</td>
                    <td>
                      <template>
                        <div style="position: absolute; right: 10px; top:5px;" v-if="item === selectedItem">
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn x-small fab v-bind="attrs" v-on="on" class="mr-1 green-shadow"
                                @click="showTreeViewPage(item)">
                                <v-icon>mdi-eye</v-icon>
                              </v-btn>
                            </template>
                            <span>{{ $t('view') }}</span>
                          </v-tooltip>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn x-small fab v-bind="attrs" v-on="on" class="green-shadow" @click="editTree(item)">
                                <v-icon>mdi-pencil</v-icon>
                              </v-btn>
                            </template>
                            <span>{{ $t('edit') }}</span>
                          </v-tooltip>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn x-small fab v-bind="attrs" v-on="on" class="ml-1 green-shadow"
                                @click="deleteTree(item.id)">
                                <v-icon>mdi-trash-can</v-icon>
                              </v-btn>
                            </template>
                            <span>{{ $t('delete') }}</span>
                          </v-tooltip>
                        </div>
                      </template>
                    </td>
                  </tr>
                </tbody>
              </template>
              <template v-slot:footer></template>
            </v-data-table>
          </div>
        </div>
      </v-card>
    </v-container>
    <v-dialog v-model="showErrorModal" width="50%" @click:outside="showErrorModal = false" :retain-focus="false">
      <v-card class="custom-card" rounded="0">
        <v-toolbar dense color="red" class="white--text">
          <v-toolbar-title class="font-weight-bold">
            {{ $t("surveyBuilder.publishSurvey") }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon class="white--text" @click="showErrorModal = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="black--text">
          <div class="text-center mt-5">
            {{ $t("surveyBuilder.cannotPublish") }}
          </div>
          <v-divider class="mt-5"></v-divider>
          <v-card-actions class="mt-2" style="padding-right: 0">
            <v-spacer></v-spacer>
            <v-btn outlined class="px-4 mr-2" right depressed @click="showErrorModal = false">
              {{ $t("ok") }}
            </v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showDeleteSurveyDialog" width="50%" @click:outside="showDeleteSurveyDialog = false"
      :retain-focus="false">
      <v-card class="custom-card" rounded="0">
        <v-toolbar color="primary" class="white--text">
          <v-toolbar-title class="font-weight-bold">
            {{ $t("surveyBuilder.deleteSurvey") }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon class="white--text" @click="showDeleteSurveyDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-form ref="addNewSurvey" lazy-validation autocomplete="off">
          <v-card-text class="black--text">
            <div>
              {{ $t("surveyBuilder.deleteSurveyWarn") }}
            </div>

            <v-divider class="mt-5"></v-divider>
            <v-card-actions class="mt-10" style="padding-right: 0">
              <v-spacer></v-spacer>
              <v-btn outlined class="px-4 mr-2" right depressed @click="showDeleteSurveyDialog = false" color="primary">
                {{ $t("cancel") }}
              </v-btn>

              <v-btn right class="px-4" color="primary" @click="deleteSurvey()">
                {{ $t("surveyBuilder.deleteSurvey") }}
              </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-form>
      </v-card>
    </v-dialog>


    <v-dialog v-model="farmSelectDialog" width="30%" persistent :retain-focus="false">
      <v-card class="custom-card" rounded="0">
        <v-toolbar color="primary" class="white--text">
          <v-toolbar-title class="font-weight-bold">
            {{ $t("oma.selectFarm") }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon class="white--text" @click="closeFarmSelectModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-form class="pa-4" ref="addNewSurvey" lazy-validation autocomplete="off">
          <v-card-text class="black--text">
            <v-row>
              <v-col>
                <label>{{ $t("oma.selectFarm") }}</label>
                <v-autocomplete v-model="farmData" :items="farms" outlined dense item-value="id" item-text="farmName"
                  :error-messages="errors.farmData" :rules="rules.farm" @change="setZones" :loading="loading"
                  :placeholder="$t('oma.selectFarm')">
                </v-autocomplete>
                <div v-if="zones">
                  <label>{{ $t("oma.selectZone") }}</label>
                  <v-select v-model="zone" :items="zones" outlined dense item-value="id" item-text="geofenceName"
                    :error-messages="errors.zone" :rules="rules.zone" :loading="loading"
                    :placeholder="$t('oma.selectZone')">
                  </v-select>
                </div>
              </v-col>
            </v-row>
            <v-card-actions class="mt-10" style="padding-right: 0">
              <v-spacer></v-spacer>
              <v-btn outlined class="mr-2" right height="44" width="116" depressed color="primary"
                @click="closeFarmSelectModal">
                {{ $t("cancel") }}
              </v-btn>

              <v-btn right class="px-4" color="primary" @click="submitFarmSelection()">
                {{ $t("Submit") }}
              </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-form>
      </v-card>
    </v-dialog>

    <AddBulkUploadTreeImagesPopup :showDialog="showAddTreeImagesPopup" @closeModalAfterBulkImageUpload="showAddTreeImagesPopup = false">
    </AddBulkUploadTreeImagesPopup>

    <upload-trees :dialogI="showUploadTrees" @closeUploadTrees="closeUploadTrees"  @fileUploadedSuccess="fileUploadedSuccess" :farmId="farmId"
      :zoneId="zoneId" :importType="importType"></upload-trees>

    <upload-trees-detail v-if="showUploadTreesDetail" :dialogI="showUploadTreesDetail"
      @closeUploadTreesDetail="closeUploadTreesDetail" :uploadHistoryId="uploadHistoryId"></upload-trees-detail>

    <SelectFarmDialog v-if="showSelectFarmDialog" :dialogI="showSelectFarmDialog"
      @closeDialog="closeAddSingleTreeDialog" @onFarmSelection="onFarmSelection" @emitNewTree="getTrees"
      :tree="tree" :farms="farms" />

    <AddSingleTreeDialog v-if="showAddSingleTreeDialog" :dialogI="showAddSingleTreeDialog"
      @closeDialog="closeAddSingleTreeDialog"
      @emitNewTree="onNewTreeAdded" :farm="farmDetail" :zone="zone"
      :selectedTree="tree" />

    <survey-download :showDialog="showDownload" @closeDialog="showDownload = false" :selectedSurvey="selectedItem" />

    <confirm-box :title="confirmElements.title" :message="confirmElements.message"
      :cancelBtnText="confirmElements.cancelBtnText" :confirmBtnText="confirmElements.confirmBtnText"
      :confirmData="confirmElements.confirmData" :dialog="confirm" @continue:action="showSelectFarmDialog = true"
      @cancel:action="confirm = false"></confirm-box>

  </div>
</template>
<script>
import Breadcrumb from "@/components/core/Breadcrumb";
import loadingMixin from "@/mixins/LoadingMixin";
import SelectFarmDialog from "./SelectFarmDialog";
import AddSingleTreeDialog from "./AddSingleTreeDialog.vue";
import AvocadoTreesService from "@/_services/AvocadoTreesService";
import DashboardReportService from "@/_services/DashboardReportService";
import FarmService from "@/_services/FarmService";
import SurveyDownload from './SurveyDownload.vue';
import { getCountries, getStates } from 'country-state-picker'
import ConfirmBox from "@/components/ConfirmBox";
import moment from "moment"
import UploadTrees from "@/views/avocado-trees/UploadTrees";
import UploadTreesDetail from "@/views/avocado-trees/UploadTreesDetail";
import AddBulkUploadTreeImagesPopup from "./AddBulkUploadTreeImagesPopup.vue"
import DownloadMixin from "@/mixins/DownloadMixin";

export default {
  components: {
    breadcrumb: Breadcrumb,
    SelectFarmDialog,
    SurveyDownload,
    AddSingleTreeDialog,
    ConfirmBox,
    UploadTrees,
    UploadTreesDetail,
    AddBulkUploadTreeImagesPopup
    
  },
  computed: {},
  data() {
    return {
      exportOptions:[
          {id:'csv', name:this.$t('oma.Export CSV Format')},
          {id:'xlsx',name:this.$t('oma.Export XLSX Format')},
          {id:'pdf',name:this.$t('oma.Export PDF Format')}
      ],
      exportAs:'',
      showUploadTrees: false,
      showUploadTreesDetail: false,
      farmSelectDialog: false,
      
      loading: false,
      uploadHistoryId: null,
      
      errors: {},
      showAddTreeImagesPopup: false,
      trees: [],
      tree: {},
      search: '',

      farms: [],
      zones: [],
      zone: '',
      farm: '',
      farmData:'',
      farmDetail: '',
      zoneId: '',
      farmId: '',


      country: '',
      countries: [],
      region: '',
      regions: [],
      from: 0,
      to: 0,
      totalTrees: 0,
      tableOptions: {},
      totalPages: 1,
      treesLoading: false,
      showTreeDetailPopup: false,
      showSelectFarmDialog: false,
      showAddSingleTreeDialog: false,
      showDeleteSurveyDialog: false,
      showEditSurveyDialog: false,
      selectedItem: null,
      updateData: null,
      showErrorModal: false,
      publishingSurvey: false,
      confirm: false,
      confirmElements: {
        title: this.$t("oma.confirmationTitle"),
        message: this.$t("oma.confirmationMessage"),
        confirmBtnText: this.$t("Yes"),
        cancelBtnText: this.$t("Not Now"),
        confirmData: {},
      },
      headerProps: {
        'sort-icon': 'mdi-menu-up'
      },
      headers: [
        {
          text: this.$t("oma.treeId"),
          align: "start",
          value: "id",
          class: "black--text",
          width: 100
        },
        {
          text: this.$t("oma.treeName"),
          align: "start",
          value: "treeName",
          class: "black--text",
          width: 200
        },
        {
          text: this.$t("oma.zoneId"),
          align: "start",
          value: "zoneId",
          class: "black--text",
          width: 100
        },
        {
          text: this.$t("oma.latitude"),
          align: "start",
          value: "latitude",
          class: "black--text",
          width: 150
        },
        {
          text: this.$t("oma.longitude"),
          align: "start",
          value: "longitude",
          class: "black--text",
          width: 150
        },
        {
          text: this.$t("oma.altitude"),
          align: "start",
          value: "altitude",
          class: "black--text",
          width: 150
        },
        {
          text: this.$t("oma.timestamp"),
          align: "start",
          value: "createdAt",
          class: "black--text",
          width: 150
        }, {
          text: this.$t("oma.actions"),
          align: "start",
          value: "actions",
          class: "black--text",
          width: 100
        },
      ],
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: false,
          to: "/",
        },
        {
          text: this.$t("oma.avocadoTrees"),
          link: true,
          exact: true,
          disabled: true,
          to: { name: "AvocadoTrees" },
        },
      ],
      showDownload: false,
      importType:null,
      rules: {
        farm: [
          v => !!v || this.$t('errors.required')
        ]
      },
    };
  },
  watch: {
    tableOptions: {
      async handler() {
        await this.getTrees()
      },
      deep: true,
    },
  },
  async mounted() {
    this.getCountry()
    await this.getFarms()
  },

  methods: {
    formatDate(date) {
      return moment(date).format("DD-MMM-YYYY h:mm a");
    },
    closeAddSingleTreeDialog() {
      this.zone = '';
      this.farmDetail = '';
      this.showAddSingleTreeDialog = false;
      this.showSelectFarmDialog = false;
    },
    openImportDialog(importType){
      this.importType= importType;
      this.farmData = '';
      this.zone = '';
      this.farmSelectDialog = true
    },
    async onNewTreeAdded() {
      this.closeAddSingleTreeDialog();
      await this.getTrees();
      this.confirm = true;
    },
    addTreeManuallyClickHandler() {
      this.showSelectFarmDialog = true;
      this.tree = {};
    },
    async exportReport(){
        this.startLoading();
        const response = await AvocadoTreesService.exportReport(this.exportAs);
        this.downloadBlob(response.data,'avocado_trees.'+this.exportAs);
        this.stopLoading();
    },
    showTreeViewPage(treeItem) {
      this.$router.push({ name: "AvocadoTreeDetail", params: { id: treeItem.id } });
    },
    fileUploadedSuccess(data) {
      this.uploadHistoryId = data.data.uploadHistoryId;
      this.showUploadTreesDetail = true;
    },
    closeFarmSelectModal() {
      this.farmSelectDialog = false;
    },
    submitFarmSelection() {
      if (this.farmData.id) {
        this.zoneId = this.zone;
        this.farmId = this.farmData.id;
        this.showUploadTrees = true;
      }

    },
    setZones() {
      this.loading = true;
      this.startLoading(true);
      FarmService.getFarm(this.farmData).then(async (data) => {
        this.farmData = data;
        this.zones = this.farmData.segments;
        this.zones =this.zones.map(zone => {
          if (zone.geofenceName === null) {
            zone.geofenceName = 'Zone-' + zone.id;
          }
          return zone;
        });
        this.zones = this.zones.filter(el => !el.isPrimary)
        this.loading = false;
        this.stopLoading();
      });
    },
    async closeUploadTrees() {
      this.showUploadTrees = false;
      // this.farmSelectDialog = false;

      this.zone= '';
      this.farmData= '';
      this.farmDetail= '';
      this.zoneId= '';
      this.farmId= '';
      this.tableOptions.page = 1;
      await this.getTrees()
    },
    closeUploadTreesDetail(addImage) {
      this.showUploadTreesDetail = false;
      this.uploadHistoryId = null;
      if (addImage) {
        this.showAddTreeImagesPopup = true;
      }
    },
    uploadTree() {
      this.showUploadTrees = true;
    },

    async publishSurvey(survey, status) {
      if (!survey.surveyStatus) {
        this.showErrorModal = true;
        return;
      }
      this.publishingSurvey = true;
      await AvocadoTreesService.publishSurvey(survey.id, status)
        .then(() => {
          this.getTrees();
        })
        .catch((err) => {
          console.err(err);
        })
        .finally(() => {
          this.publishingSurvey = false;
        })
    },
    async getTrees() {
      this.trees = []
      this.treesLoading = true;
      console.log(this.tableOptions,"this.tableOptions")
      const canSort = this.tableOptions.sortBy.length === 1 && this.tableOptions.sortDesc.length === 1;
      const requestParams = {
        limit: this.tableOptions.itemsPerPage,
        page: this.tableOptions.page ?? 1,
        searchValue: this.search,
        farmId: this.farm ? this.farm.id : '',
        zoneId: this.zone,
        country: this.country ? this.country.name : '',
        region: this.region ?? '',
        sortColumn: canSort ? this.tableOptions.sortBy[0] : null,
        sortOrder: canSort ? this.tableOptions.sortDesc[0] ? 'ASC' : 'DESC' : null,
      };
      await AvocadoTreesService.getAllTrees(requestParams)
        .then((res) => {
          this.trees = res?.data?.rows;
          this.totalTrees = res?.data?.count
          this.totalPages = Math.ceil(this.totalTrees / this.tableOptions.itemsPerPage)
          this.from = (this.tableOptions.page - 1) * this.tableOptions.itemsPerPage + 1
          this.to = (this.tableOptions.page * this.tableOptions.itemsPerPage) - (this.tableOptions.itemsPerPage - res?.data?.rows.length)
          this.treesLoading = false;
        })
        .catch((err) => {
          console.err(err);
        }).finally(() => {
          this.treesLoading = false;
        })
    },
    searchTrees() {
      // if(this.search != '') return;
      this.tableOptions.page = 1;
      this.getTrees();
    },
    pageChange(t) {
      if (t) {
        this.tableOptions.page = this.tableOptions.page + 1
      } else {
        this.tableOptions.page = this.tableOptions.page - 1
      }
      // this.getSurveys();
    },
    async selectItem(item) {
      this.selectedItem = item;
    },
    async unSelectItem() {
      this.selectedItem = null;
    },
    async deleteSurvey() {
      await AvocadoTreesService.deleteSurvey(this.selectedItem)
        .then((res) => {
          if (res.code === 200) {
            this.showDeleteSurveyDialog = false;
            this.getSurveys();
          }
        })
        .catch((err) => {
          err && this.stopLoading();
        });
    },
    editSurvey(item) {
      this.updateData = item;
      this.showEditSurveyDialog = true;
    },
    async copySurvey(survey) {
      this.treesLoading = true;
      await AvocadoTreesService.copySurvey(survey).then(async () => {
        this.treesLoading = false;
        await this.getSurveys();
      }).catch((err) => {
        const { message } = err;
        console.err(message);
        this.treesLoading = false;
      })
    },
    gotoSingleSurvey(id) {
      this.$router.push({ name: "SingleSurveyList", params: { id: id } });
    },
    downloadCsv() {
      return;
    },
    getCountry() {
      this.countries = getCountries()
    },
    async getFarms() {
      await DashboardReportService.getUserFarmData().then((res) => {
        this.farms = res.data
      })
    },
    async getRegion(val) {
      this.regions = []
      await this.getTrees()
      this.regions = getStates(val.code)
    },
    async onFarmSelection(data) {
      this.zone = data.zone;
      this.farmDetail = data.farm;
      this.showSelectFarmDialog = false;
      this.showAddSingleTreeDialog = true;
    },
    fromattedDate(date) {
      return moment(date).format('MM-DD-YYYY');
    },
    viewTree(treeId) {
      this.$router.push('avocado-trees/' + treeId + '/detail')
      // this.showTreeDetailPopup = true
    },
    async editTree(tree) {
      this.startLoading();
      this.tree = tree;
      this.zone = tree.zoneId;
      this.farmDetail = await FarmService.getFarm(tree.farmId);
      this.showAddSingleTreeDialog = true;
      this.stopLoading();
    },
    async deleteTree(treeId) {
      try {
        this.startLoading()
        const data = await AvocadoTreesService.deleteTree(treeId);
        if(data.success) {
          this.$notify({
            title: this.$t("deleted"),
            type: "success",
          });
        } else {
          this.$notify({
            title: this.$t("failed"),
            type: "error",
          });
        }
      } catch (error) {
        this.$notify({
          title: this.$t("failed"),
          type: "error",
        });
        console.error('Delete Tree Error', error);
      } finally {
        await this.getTrees();
        this.stopLoading();
      }
    },
  },

  mixins: [loadingMixin,DownloadMixin],
};
</script>
<style lang="scss" scoped>
::v-deep .v-data-table-header__icon {
  color: white !important;
}

.text-truncate-title {
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.text-truncate-desc {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.col-question {
  width: 125px;
}

.col-response {
  width: 131px;
}

.cursor-pointer{
  cursor: pointer;
}
</style>
