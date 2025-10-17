<template>
  <div>
    <v-container fluid>
      <v-card elevation="0" class="px-5">
        <div class="d-flex mb-4 pt-10">
          <h2>
            {{ $t("deforestation.AnalysisOfDeforestationStatus") }}
            <v-tooltip top color="black" max-width="220">
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon
                      color="green lighten-1"
                      style="top:-4px"
                      dense
                      size="16px"
                  >
                    mdi-alert-circle
                  </v-icon>
                </v-btn>
              </template>
              <span>{{
                  $t("deforestation.AnalysisOfDeforestationStatus")
                }}</span>
            </v-tooltip>
          </h2>
          <v-spacer></v-spacer>
        </div>
        <v-row class="d-flex mb-4 mt-10">
          <v-sheet
              style="border: 1px solid #ccc; border-radius: 0px;"
              class="d-flex align-center justify-center flex-wrap text-center mx-auto px-4"
              height="200"
              width="100%"
              rounded
          >
            <v-progress-linear
                :indeterminate="reportLoading"
                v-model="progressValue"
                style="max-width: 90%;"
                class="mt-15"
                color="green"
                rounded
                :height="8"
            ></v-progress-linear>
            <span
                v-if="!reportLoading"
                style="color: green;"
                class="ml-5 mt-15"
            >{{ "Complete" }}</span
            >
            <h4 class="mb-15">
              {{
                $t('dueDiligence.automatedDeforestationProgressText')
              }}
            </h4>
          </v-sheet>
        </v-row>
        <v-row class="mt-10" v-if="risk">
          <h4
              style="color: red; max-width: 60%;"
              class="d-flex align-center justify-center flex-wrap text-center mx-auto px-4"
          >
            {{
              $t('dueDiligence.someRiskWereIdentifiedText')
            }}
          </h4>
        </v-row>

        <div class="d-flex mb-4 pt-10">
          <h2>
            {{ $t("deforestation.productionPlaces") }}
            <v-tooltip top color="black" max-width="220">
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon
                      color="green lighten-1"
                      style="top:-4px"
                      dense
                      size="16px"
                  >
                    mdi-alert-circle
                  </v-icon>
                </v-btn>
              </template>
              <span>{{ $t("deforestation.productionPlaces") }}</span>
            </v-tooltip>
          </h2>
          <v-spacer></v-spacer>
        </div>
        <v-card-text>
          <v-data-table
              :headers="headers"
              :items="filterData"
              :items-per-page="10"
              :footer-props="{
              'items-per-page-options': [10, 25, 50],
            }"
              hide-default-footer
              :loading="loading"
              :options.sync="options"
              :server-items-length="totalProductionPlaces"
              :loading-text="
              $t('deforestation.loadingProductionPlaces')
            "
          >
            <template v-slot:top="{}">
              <div class="d-flex mt-5">
                <v-text-field
                    prepend-inner-icon="mdi-magnify"
                    outlined
                    height="5px"
                    :placeholder="$t('search')"
                    dense
                    v-model="search"
                    @keyup.enter="searchQuery"
                    class="shrink"
                >
                </v-text-field>

                <v-select
                    class="mx-2"
                    v-model="countryModel"
                    item-text="text"
                    item-value="val"
                    :items="countries"
                    :label="$t('deforestation.allCountries')"
                    @change="filterData"
                    outlined
                    dense
                >
                </v-select>

                <v-select
                    class="mx-2"
                    v-model="producerModel"
                    item-text="text"
                    item-value="val"
                    :items="allProducers"
                    :label="$t('deforestation.allProducer')"
                    @change="filterData"
                    outlined
                    dense
                >
                </v-select>
                <v-select
                    class="mx-2"
                    v-model="statusModel"
                    item-text="text"
                    item-value="val"
                    :items="allStatus"
                    :label="$t('deforestation.EUDRDeforestationStatus')"
                    @change="filterData"
                    outlined
                    dense
                >
                </v-select>
                <v-spacer></v-spacer>

                <div class="py-1 title">
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
                >
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
                >
                  <v-icon dark>
                    mdi-chevron-right
                  </v-icon>
                </v-btn>
              </div>
            </template>
            <template v-if="filterData.length" v-slot:body="{ items }">
              <tbody>
              <tr
                  v-for="item in items"
                  :key="item.id"
                  style="position: relative; width: 0; height: 0"
                  @mouseover="selectItem(item)"
                  @mouseleave="selectItem(false)"
              >
                <td class="text-truncate">
                  {{ item.farm.farmName || "N/A" }}<br />
                  {{ item.farm.id }}
                </td>

                <td class="text-truncate">
                  {{ item.farm.userAssoc.firstName }}
                  {{ item.farm.userAssoc.lastName }}
                </td>

                <td class="text-truncate" style="max-width: 300px;">
                  {{ item.farm.address }}
                </td>

                <td class="text-truncate">
                  {{ item.farm.area || "N/A" }}
                </td>

                <td class="text-truncate">
                  {{ item.farmType }}
                </td>

                <td>
                  <template>
                    <v-chip :class="statusColor(item.eudr_deforestation_status)" style="width: 210px; justify-content: center" flat>
                      {{ item.eudr_deforestation_status || 'N/A' }}
                    </v-chip>
                  </template>
                </td>

                <td>
                  <div>
                    <v-menu>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            x-small
                            fab
                            v-bind="attrs"
                            v-on="on"
                            color="primary"
                            style="margin-left: 20px;"
                        >
                          <img
                              src="/icons/todo-list.png"
                              style="width: 34px; height: 34px; border-radius: 50%;"
                          />
                        </v-btn>
                      </template>
                      <!--                        <span>{{ $t("dueDiligence.viewReport") }}</span>-->
                      <v-list>
                        <v-list-item v-for="(menu, i) in menus" :key="i">
                          <v-list-item-title
                              @click="showModel(menu.id, item)"
                          >{{ menu.title }}</v-list-item-title
                          >
                        </v-list-item>
                      </v-list>
                    </v-menu>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            x-small
                            fab
                            v-bind="attrs"
                            v-on="on"
                            @click="removeFarm(item.farm.id)"
                            style="margin-left: 20px;"
                        >
                          <!-- @click="$router.push({name: 'ActivationKeyGroupList',params: { groupId: item.id },})" -->
                          <v-icon class="green-shadow">mdi-trash-can</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t("deforestation.remove") }}</span>
                    </v-tooltip>
                  </div>
                </td>
              </tr>
              </tbody>
            </template>
            <template v-slot:footer></template>
          </v-data-table>
          <template>
            <div class="d-flex mt-5" style="align-items: center;" v-if="productionPlaces.length">
              <v-spacer></v-spacer>
              <img
                  src="/icons/todo-list.png"
                  style="width: 34px; height: 34px; border-radius: 50%;"
              />
              <span class="ml-2">{{ $t('dueDiligence.viewReport')}}</span>


              <v-icon class="ml-5 green-shadow">mdi-trash-can</v-icon>
              <span class="ml-2">{{ $t('deforestation.remove')}}</span>
            </div>
          </template>
          <v-row  v-if="productionPlaces.length">
            <v-btn
                color="primary"
                dark
                class="mr-2 mb-2"
                @click="removeAllHighRiskFarm"
            >
              {{ $t("deforestation.removeAllHighRiskFarm") }}
            </v-btn>
            <v-btn
                color="primary"
                dark
                class="mr-2 mb-2"
                @click="removeAllLowRiskFarm"
            >
              {{ $t("deforestation.removeAllLowRiskFarm") }}
            </v-btn>
            <v-btn
                color="primary"
                dark
                class="mr-2 mb-2"
                @click="triggerFileInput"
            >
              {{ $t("deforestation.attachRiskMigrationDoc") }}
            </v-btn>
            <input
                type="file"
                ref="fileInput"
                accept="application/pdf"
                @change="handleFileChange"
                style="display: none;"
            />
          </v-row>
          <v-row class="mt-10 d-flex mb-20" v-if="this.fileUploaded">
            <div>
              <v-sheet
                  style="border: 1px solid #ccc; border-radius: 0px;"
                  class="d-flex align-center justify-center flex-wrap text-center mx-auto px-4"
                  height="100"
                  width="100"
              >
                <v-icon dark style="color: green">
                  mdi-eye
                </v-icon>
                {{ uploadFileType }}
              </v-sheet>
              <h3 style="color:green" class="pt-1 pb-10">
                {{ uploadedFileName }}
              </h3>
            </div>
            <div style="width:30%">
              <v-textarea
                  class="px-4"
                  :rows="3"
                  v-model="highRiskComment"
                  placeholder="comments"
              ></v-textarea>
            </div>
            <div></div>
          </v-row>
        </v-card-text>
      </v-card>
      <!-- removed farms table -->
      <v-card class="grey">
        <h3 class="pt-5 ml-5">{{ $t("deforestation.removedFarms") }}</h3>
        <v-card-text>
          <v-data-table
              :headers="headers"
              :items="removedProductionPlaces"
              :items-per-page="10"
              :footer-props="{
              'items-per-page-options': [10, 25, 50],
            }"
              hide-default-footer
              :loading="loading"
              :options.sync="options"
              :server-items-length="totalRemovedProductionPlaces"
              :loading-text="
              $t('deforestation.loadingProductionPlaces')
            "
          >
            <template v-slot:top="{}">
              <div class="d-flex mt-5">
                <v-spacer></v-spacer>
                <div class="py-1 title">
                  {{ removedFrom }} - {{ removedTo }} of
                  {{ totalRemovedProductionPlaces }}
                </div>
                <v-btn
                    class="mx-2"
                    fab
                    small
                    outlined
                    color="primary"
                    :disabled="removedProductionPlaceOptions.page <= 1"
                    @click="pageChangeRemovedProductionPlace(false)"
                >
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
                    :disabled="
                    removedProductionPlaceOptions.page >= totalRemovedPages
                  "
                    @click="pageChangeRemovedProductionPlace(true)"
                >
                  <v-icon dark>
                    mdi-chevron-right
                  </v-icon>
                </v-btn>
              </div>
            </template>
            <template
                v-if="removedProductionPlaces.length"
                v-slot:body="{ items }"
            >
              <tbody>
              <tr
                  v-for="item in items"
                  :key="item.id"
                  style="position: relative; width: 0; height: 0"
                  @mouseover="selectItem(item)"
                  @mouseleave="selectItem(false)"
              >
                <td class="text-truncate">
                  {{ item.farm.farmName || "N/A" }}<br />
                  {{ item.farm.id }}
                </td>

                <td class="text-truncate">
                  {{ item.farm.userAssoc.firstName }}
                  {{ item.farm.userAssoc.lastName }}
                </td>

                <td class="text-truncate" style="max-width: 300px;">
                  {{ item.farm.address }}
                </td>

                <td class="text-truncate">
                  {{ item.farm.area || "N/A" }}
                </td>

                <td class="text-truncate">
                  {{ item.farmType }}
                </td>

                <td>
                  <template>
                    <v-chip :class="statusColor(item.eudr_deforestation_status)" style="width: 210px; justify-content: center" flat>
                      {{ item.eudr_deforestation_status || 'N/A' }}
                    </v-chip>
                  </template>
                </td>

                <td>
                  <div>
                    <v-menu>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            x-small
                            fab
                            v-bind="attrs"
                            v-on="on"
                            color="primary"
                            style="margin-left: 20px;"
                        >
                          <img
                              src="/icons/todo-list.png"
                              style="width: 34px; height: 34px; border-radius: 50%;"
                          />
                        </v-btn>
                      </template>
                      <!--                        <span>{{ $t("dueDiligence.viewReport") }}</span>-->
                      <v-list>
                        <v-list-item v-for="(menu, i) in menus" :key="i">
                          <v-list-item-title
                              @click="showModel(menu.id, item)"
                          >{{ menu.title }}</v-list-item-title
                          >
                        </v-list-item>
                      </v-list>
                    </v-menu>

                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            x-small
                            fab
                            v-bind="attrs"
                            v-on="on"
                            @click="restoreFarm(item.id)"
                            style="margin-left: 20px;"
                        >
                          <!-- @click="$router.push({name: 'ActivationKeyGroupList',params: { groupId: item.id },})" -->
                          <v-icon class="green-shadow">mdi-replay</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t("deforestation.restore") }}</span>
                    </v-tooltip>
                  </div>
                </td>
              </tr>
              </tbody>
            </template>
            <template v-slot:footer></template>
          </v-data-table>

          <template>
            <div class="d-flex mt-5" style="align-items: center;" v-if="removedProductionPlaces.length">
              <v-spacer></v-spacer>
              <img
                  src="/icons/todo-list.png"
                  style="width: 34px; height: 34px; border-radius: 50%;"
              />
              <span class="ml-2">{{ $t('dueDiligence.viewReport')}}</span>


              <v-icon class="ml-5 green-shadow">mdi-replay</v-icon>
              <span class="ml-2">{{ $t('deforestation.restore')}}</span>
            </div>
          </template>
        </v-card-text>
      </v-card>
    </v-container>
    <DisputesDialog
        v-if="showDisputeModal"
        :dialogU="showDisputeModal"
        :reportRequestId="targetProductionPlaceDeforestationId"
        @closeBulkUpload="showDisputeModal = false"
    ></DisputesDialog>
    <MitigationDialog
        v-if="showMitigtionModal"
        :dialogU="showMitigtionModal"
        :productionPlaceId="targetedProductionPlaceId"
        @closeBulkUpload="showMitigtionModal = false"
    ></MitigationDialog>
  </div>
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import download from "@/mixins/DownloadMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import DateMixin from "@/mixins/DateMixin";
import DeforestationService from "@/_services/DeforestationService";
import DisputesDialog from "../components/eudr/DisputesDialog.vue";
import MitigationDialog from "../components/eudr/MitigationDialog.vue";
import S3UploadService from "@/_services/S3UploadService";

export default {
  components: {
    MitigationDialog,
    DisputesDialog,
  },
  created() {
    this.fetchData();
  },
  props: {
    diligenceId: {
      type: Number,
      required: true,
    },
    updatedProductionPlaces:{
      type: Array,
    }
  },
  computed: {
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
              (!this.countryModel ||
                  item.farm.userAssoc.countryId === this.countryModel) &&
              (!this.producerModel ||
                  item.farm.userAssoc.firstName === this.producerModel) &&
              (!this.statusModel ||
                  item.eudr_deforestation_status === this.statusModel)
          );
        });
        return list;
      } else {
        return this.productionPlaces;
      }
    },
  },
  data() {
    return {
      menus: [
        { title: this.$t('dueDiligence.viewAssessment'), id: "assessment" },
        { title: this.$t('dueDiligence.disputes'), id: "disputes" },
        { title: this.$t('dueDiligence.manualRiskMitigation'), id: "mitigation" },
      ],
      showDisputeModal: false,
      showMitigtionModal: false,
      progressValue: 0,
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
      countryModel: "",
      statusModel: "",
      producerModel: "",

      countries: [{ text: this.$t("deforestation.allCountries"), val: "" }],
      allStatus: [
          { text: this.$t("deforestation.allStatus"), val: "" },
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
          value: "farmerName",
          class: "black--text",
          sortable: false,
        },
        {
          text: this.$t("deforestation.producerName"),
          align: "start",
          value: "farmName",
          class: "black--text",
        },

        {
          text: this.$t("deforestation.addressOfProduction"),
          align: "start",
          value: "farmLocation",
          class: "black--text",
          sortable: false,
        },
        {
          text: this.$t("deforestation.areaHa"),
          align: "start",
          value: "area",
          class: "black--text",
          sortable: false,
        },
        {
          text: this.$t("deforestation.type"),
          align: "center",
          value: "type",
          class: "black--text",
          sortable: false,
        },
        {
          text: this.$t("deforestation.EUDRDeforestationStatus"),
          align: "center",
          value: "status",
          class: "black--text",
          sortable: false,
        },
        {
          text: "Actions",
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
      fileUploaded: false,
      targetedProductionPlaceId: null,
      targetProductionPlace: null,
      risk: false,
      reportLoading: true,
      highRiskComment: null,
    };
  },
  methods: {
    async triggerSubmit(){
      return await this.highRiskMitigation();
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
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
        console.error("Invalid file type. Please select a PDF file.");
      }
    },

    async uploadFile(file) {
      this.uploadedFile = file;
      this.uploadedFileName = file.name;
      this.uploadFileType = file.name
          .split(".")
          .pop()
          .toUpperCase();
      this.fileUploaded = true;
      const result = await S3UploadService.singleUpload(file, "signatures");
      this.s3Location = result.fullPath;
      this.s3key = result.key;
      console.log("File uploaded successfully:", this.s3Location);
    },

    showModel(modal, item) {
      switch (modal) {
        case "disputes":
          this.targetProductionPlace = item;
          this.showDisputeModal = true;

          break;
        case "assessment":
          console.log("QA Merge.. ");
          
          
          this.$router.push({
            name: "EudrAssessmentReportDDS",
            params: { type: 'assignment', reportRequestId: item.productionPlaceDeforestationInfo.deforestationReportRequestId },
          });

          break;
        case "mitigation":
          this.targetedProductionPlaceId = item.diligenceReportProductionPlaceArray[0]?.id;
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
      await this.getBulkDeforestationReport();
      await this.getProductionPlaces();
      await this.getRemovedProductionPlaces();
    },
    async getBulkDeforestationReport() {
      this.reportLoading = true;
      //TODO:: add input from previous state
      // let input = {
      //   items: [
      //     {
      //       userId: 2446,
      //       aoiId: 5335,
      //       latitude: 8.072054918276129,
      //       longitude: 36.89202828694285,
      //       radius: 0.934423,
      //     },
      //     {
      //       userId: 2446,
      //       aoiId: 5336,
      //       coordinates: [
      //         {
      //           latitude: 8.072054918276129,
      //           longitude: 36.89202828694285,
      //         },
      //         {
      //           latitude: 8.071775954308206,
      //           longitude: 36.89131420161602,
      //         },
      //         {
      //           latitude: 8.071202941889345,
      //           longitude: 36.88989531112534,
      //         },
      //         {
      //           latitude: 8.070527763387219,
      //           longitude: 36.88913568328447,
      //         },
      //         {
      //           latitude: 8.069350193151303,
      //           longitude: 36.88871205023371,
      //         },
      //         {
      //           latitude: 8.072054918276129,
      //           longitude: 36.89202828694285,
      //         },
      //       ],
      //     },
      //   ],
      // };

      const { status, data } = await DeforestationService.getBulkReport({items:this.updatedProductionPlaces});
      if (
          status && data && data.length > 0 &&
          data
              .map((d) => d.result)
              .filter((f) => f.highProb > 0 || f.veryHighProb > 0).length
      ) {
        this.risk = true;
      }
      console.log("deforestation report", this.deforestationReport);
      this.progressValue = 100;
      this.reportLoading = false;
    },
    async removeFarm(id) {
      this.startLoading();
      const params = {
        diligenceReportId: this.diligenceId,
        farmId: parseInt(id),
      };
      await DeforestationService.removeFarmFromProductionPlaceListById(params);
      await this.fetchData();
      this.stopLoading();
    },

    async restoreFarm(id) {
      this.startLoading();
      const params = {
        diligenceReportId: this.diligenceId,
        farmId: id,
      };
      await DeforestationService.restoreProductionPlaceFarmById(params);
      await this.fetchData();
      this.stopLoading();
    },

    async removeAllHighRiskFarm() {
      this.startLoading();
      const params = {
        diligenceReportId: this.diligenceId,
        eudrDeforestationStatus: "High Probability",
      };
      const res = await DeforestationService.removeFarmFromProductionPlaceListByStatus(
          params
      );
      console.log({res})
      const { success, message } = res.data.removeFarmFromProductionPlaceList;
      if(success){
        await this.getProductionPlaces();
        this.$notify({
          title: message ||this.$t('itemDeletedSuccessfully'),
          type:'success'
        })
      }
      else{
        this.$notify({
          title: message || this.$t('somethingWentWrong'),
          type:'error'
        })
      }
      await this.fetchData();
      this.stopLoading();
    },

    async removeAllLowRiskFarm() {
      this.startLoading();
      const params = {
        diligenceReportId: this.diligenceId,
        eudrDeforestationStatus: "Low Probability",
      };
      await DeforestationService.removeFarmFromProductionPlaceListByStatus(
          params
      );
      await this.fetchData();
      this.stopLoading();
    },

    async highRiskMitigation() {
      this.startLoading();
      const params = {
        due_diligence_report_id: this.diligenceId,
        risk_mitigation_comment: this.highRiskComment,
        eudr_deforestation_status: "Manually Mitigated",
        file: this.s3Location,
      };
      try {
        await DeforestationService.highRiskFarmRiskMitigation(params);
        await this.fetchData();
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
      };
      if (opt?.sortBy?.length) {
        requestParams.orderField = opt.sortBy[0];
        requestParams.order = opt.sortDesc[0] ? "DESC" : "ASC";
      }
      DeforestationService.getProductionPlaces(requestParams)
          .then((res) => {
            this.productionPlaces = res.data?.productionPlaces?.rows || [];
            this.totalProductionPlaces = res.data.productionPlaces?.totalCount;
            this.from = (this.options.page - 1) * this.options.limit + 1;
            this.to = this.options.page * this.options.limit;
            if (this.productionPlaces.length > 0) {
              this.to -= this.options.limit - this.productionPlaces.length;
            } else {
              this.to -= this.options.limit;
            }
            const countryLists = this.productionPlaces
                .filter((item) => item.farm.userAssoc.countryId)
                .map((item) => {
                  return {
                    text: item.farm.userAssoc.countryId,
                    val: item.farm.userAssoc.countryId,
                  };
                });
            const producerList = this.productionPlaces
                .filter((item) => {
                  return item.farm.userAssoc.firstName;
                })
                .map((item) => {
                  const fullName = `${
                      item.farm.userAssoc.firstName
                          ? item.farm.userAssoc.firstName
                          : ""
                  } ${
                      item.farm.userAssoc.lastName ? item.farm.userAssoc.lastName : ""
                  }`;
                  return {
                    text: `${fullName}`,
                    val: `${item.farm.userAssoc.firstName}`,
                  };
                });
            this.countries = [...this.countries, ...countryLists];
            this.allProducers = [...this.allProducers, ...producerList];
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
      };
      if (opt?.sortBy?.length) {
        requestParams.orderField = opt.sortBy[0];
        requestParams.order = opt.sortDesc[0] ? "DESC" : "ASC";
      }
      DeforestationService.getProductionPlaces(requestParams)
          .then((res) => {
            this.removedProductionPlaces = res.data.productionPlaces.rows;

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

    statusColor(status) {
      switch (status) {
        case 'Very High Probability':
          return 'very-high-status';
        case 'Medium Probability':
          return 'medium-status';
        case 'Manually Mitigated':
          return 'manual-status';
        case 'High Probability':
          return 'high-status';
        case 'Zero/Negligible Probability':
          return 'negligible-status';
        case 'Very Low Probability':
          return 'very-low-status';
        case 'Low Probability':
          return 'low-status';
        default:
          return '';
      }
    },
  },
  mixins: [loadingMixin, download, getPermittedActions, DateMixin],
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

.green-shadow {
  color: #00bd73 !important;
}

.very-high-status {
  background-color: #FF8F8F !important;
  color: #2B0001 !important;

}

.high-status {
  background-color: #FFB6B6;
  color: #850003 !important;

}

.medium-status {
  background-color: #FFCEB3 !important;
  color : #A13C03 !important;
;
}

.low-status {
  background-color: #FFE8C5 !important;
  color: #9C521B !important; ;

}

.very-low-status {
  background-color: #FFFCEC !important;
  color: #A15E05 !important;
}

.negligible-status {
  background-color: #E2FFF4 !important;
  color: #58651B !important;
}
.manual-status {
  background-color: #E2FFF4 !important;
  color: #58651B !important;
}
</style>
