<template>
  <div>
    <v-container fluid>
      <v-card elevation="0" class="px-5">
        <v-card-text>
          <h2 style="color:black; margin-top: 10px;">
            {{ $t('dueDiligence.riskAssessmentAndMitigation') }}
            <v-tooltip top color="00BD73">
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  class="icon-with-background"
                  style="color:#0EBF67"
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-alert-circle
                  <!-- https://vuetifyjs.com/en/features/icon-fonts/#built-in-aliases -->
                </v-icon>
              </template>
              <span>{{ $t("Product Details") }}</span>
            </v-tooltip>
          </h2>

          <div
            v-if="
              reportRiskAssessmet &&
                reportRiskAssessmet.farm == 'One for Each Farm'
            "
          >
            <div class="d-flex mt-5">
              <h3 style="color:black">
                {{ $t('deforestation.productionPlaces')}}
                <v-tooltip top color="00BD73" max-width="350">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      class="icon-with-background"
                      style="color:#0EBF67"
                      v-bind="attrs"
                      v-on="on"
                    >
                      mdi-alert-circle
                      <!-- https://vuetifyjs.com/en/features/icon-fonts/#built-in-aliases -->
                    </v-icon>
                  </template>
                  <span>{{ $t("Product Details") }}</span>
                </v-tooltip>
              </h3>
            </div>

            <v-data-table
              :headers="placesHeaders"
              :items="productionPlaces"
              hide-default-footer
              :server-items-length="totalProductionPlaces"
              :loading-text="$t('deforestation.productionPlaces')"
            >
              <template v-slot:top="{}">
                <div class="d-flex mt-5">
                  <div style="width: 290px; margin-top: 22px;">
                    <v-text-field
                      prepend-inner-icon="mdi-magnify"
                      outlined
                      height="5px"
                      :placeholder="$t('search')"
                      dense
                      v-model="search"
                      @input="handleSearchByPharse"
                      class="shrink"
                      clearable
                    ></v-text-field>
                  </div>
                  <div class="ml-3" style="width: 290px;">
                    <label for="text">{{ $t("country") }}</label>
                    <v-select
                      :items="countries"
                      v-model="country"
                      item-text="name"
                      item-value="name"
                      dense
                      outlined
                      class="wdt"
                       :placeholder="$t('select')"
                      @change="handleSearchByCountry"
                    ></v-select>
                  </div>

                  <div class="ml-3" style="width: 290px;">
                    <label for="text">{{ $t("deforestation.supplier") }}</label>
                    <!-- {{JSON.stringify(formattedSupplier)}} -->
                    <v-select
                      :items="formattedSupplier"
                      v-model="suppplier"
                      item-text="fullName"
                      item-value="id"
                      dense
                      outlined
                      class="wdt"
                       :placeholder="$t('select')"
                      @change="handleSearchBySupplier"
                    ></v-select>
                  </div>

                  <div class="ml-3" style="width: 290px;">
                    <label for="text">{{ $t("dueDiligence.riskAssessmentStatus") }}</label>
                    <v-select
                      :items="riskAssessmentStatusList"
                      v-model="riskAssessmentStatus"
                      dense
                      outlined
                      class="wdt"
                      :placeholder="$t('select')"
                      @change="handleSearchByStatus"
                    ></v-select>
                  </div>

                  <v-spacer></v-spacer>
                  <div class="d-flex" style="margin-top: 15px;">
                    <div class="py-1 title">
                      {{ options.page }} - {{ totalPages }} of
                      {{ totalProductionPlaces }}
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
                </div>
              </template>
              <template v-slot:body="{ items }">
                <tbody>
                  <tr
                    v-for="(item, index) in items"
                    :key="
                      item.production_places_farm_id
                        ? index + item.production_places_farm_id
                        : index
                    "
                    style="position: relative; width: 0; height: 0"
                  >
                    <td>{{ item.farm.farmName }} {{ item.farm.farmNumber }}</td>
                    <td>
                      {{ item.farm.userAssoc.firstName }}
                      {{ item.farm.userAssoc.lastName }}
                    </td>
                    <td>{{ item.farm.address || "" }}</td>
                    <td>{{ acerToHectare(item.farm.area) }}</td>
                    <td>{{ item.farmType || "" }}</td>
                    <td>
                      <div class="d-flex">
                        <v-btn
                          small
                          rounded
                          min-width="175"
                          depressed
                          class="green-button"
                          height="34"
                          v-if="item.risk_assessment == 'Approved'"
                        >
                          <!-- getModulePermittedActions.put -->
                          {{ $t("memberDataSection.daproved") }}
                        </v-btn>

                        <v-btn
                          small
                          rounded
                          min-width="175"
                          depressed
                          class="red-button"
                          height="34"
                          v-if="item.risk_assessment == 'Rejected'"
                        >
                          <!-- getModulePermittedActions.put -->
                          {{ $t("memberDataSection.rejected") }}
                        </v-btn>

                        <v-btn
                          small
                          rounded
                          min-width="175"
                          depressed
                          class="orange-button"
                          height="34"
                          v-if="item.risk_assessment == 'Mitigation Required'"
                        >
                          <!-- getModulePermittedActions.put -->
                          {{ $t("Mitigation Required") }}
                        </v-btn>
                        <v-spacer></v-spacer>
                        <img
                          class="ml-1"
                          src="/icons/todo-list.png"
                          style="width: 34px; height: 34px; border-radius: 50%;"
                          @click="
                            handleProductionPlaceClick(
                              item.production_places_farm_id
                            )
                          "
                        />
                        <v-icon
                          style="cursor:pointer"
                          class="ml-1 green-shadow"
                          @click="removeFarm(item.id)"
                          >mdi-trash-can</v-icon
                        >
                      </div>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-data-table>
          </div>
        </v-card-text>
      </v-card>

      <v-card elevation="0" class="px-5 mt-5">
        <v-card-text>
          <v-form
            ref="surveyForm"
            @submit.prevent="addSurvey"
            autocomplete="off"
          >
            <v-row class="pl-3">
              <v-col cols="6" class="mb-10">
                <h2 class="mb-7">
                  {{ $t('dueDiligence.uploadRiskAssessment')}}
                  <span style="color: green">
                    <v-icon color="primary">info</v-icon>
                  </span>
                </h2>
                <div class="upload-document">
                  <div
                    style="overflow: clip"
                    :class="['dropZone', dragging ? 'dropZone-over' : '']"
                    @dragenter="dragging = true"
                    @dragleave="dragging = false"
                    @drop="handleDrop"
                  >
                    <div
                      class="dropZone-info d-flex justify-center align-center"
                      @dragover.prevent
                    >
                      <span class="fa fa-cloud-upload dropZone-title"></span>
                      <span class="dropZone-title">
                        <v-icon class="blue-color" size="50" color="gray"
                          >mdi-tray-arrow-up</v-icon
                        >
                      </span>
                      <div class="dropZone-upload-limit-info">
                        <h2 class="blue-color underline" color="primary">
                          {{ $t('dueDiligence.selectFileToUploadData')}}
                        </h2>
                        <p class="gray-color">{{ $t('oma.OrDragDrop')}}</p>
                      </div>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept=".pdf, .doc, .docx, .xls, .xlsx"
                      @change="additionalOnChange"
                    />
                  </div>
                  <span class="red--text" v-if="false">{{ $t('fileError') }}</span>
                </div>

                <div
                  class="pdf-docs mt-10 d-flex"
                  v-for="(docs, key) in documents"
                  :key="key"
                >
                  <div class="docs-box mr-4">
                    <div class="docs-preview">
                      <div class="img-item">
                        <div class="pdf-box">
                          <v-icon @click="removeFile(key)">
                            mdi-trash-can-outline
                          </v-icon>
                          <h1>{{ docs.extension }}</h1>
                        </div>
                        <span> {{ docs.name }} </span>
                      </div>
                    </div>
                  </div>

                  <div class="text-box mr-4">
                    <v-textarea
                      v-model="docs.comment"
                      placeholder="Comments"
                      outlined
                    ></v-textarea>
                  </div>

                  <div class="expiry-box">
                    <label class="expiration" for="name">Expiry Date </label>
                    <v-menu
                      v-model="docs.productExpirationMenu"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          append-icon="mdi-calendar"
                          outlined
                          dense
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          v-on:click:append="docs.productExpirationMenu = true"
                          v-model="docs.expiryDate"
                          placeholder="Select Date"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        placeholder="Select Date"
                        v-model="docs.expiryDate"
                        @input="docs.productExpirationMenu = false"
                      ></v-date-picker>
                    </v-menu>
                  </div>
                </div>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <div class="survey mt-8">
              <div class="ttl d-flex justify-space-between mb-8">
                <h2>
                  {{ $t('dueDiligence.manualFillOutAssessment')}} <v-icon> mdi-mdi-info </v-icon>
                </h2>
                <v-btn color="primary">{{ $t('dueDiligence.downloadAssessmentForm')}} </v-btn>
              </div>

              <Survey
                :surveyee="survey"
                @questionResponses="handleQuestionResponses"
              >
              </Survey>
            </div>

            <div class="signature mb-5">
              <v-btn color="primary" @click="handleOpenSignatureModel">
                {{  $t('dueDiligence.addSignature') }}
              </v-btn>
            </div>

            <div class="btn-div d-flex flex-row-reverse">
              <v-btn
                type="submit"
                color="primary"
                width="112"
                @click="submitAssessment()"
              >
                {{$t('submit')}}
              </v-btn>
              <v-btn outlined class="mr-2" color="primary" width="112">
                {{ $t("cancel") }}
              </v-btn>
              &nbsp; &nbsp;
            </div>
          </v-form>
        </v-card-text>
      </v-card>

      <signature
        @handleSignature="handleSignature"
        :dialog="openSignatureModel"
        @closeSignatureModel="openSignatureModel = false"
      >
      </signature>
    </v-container>
  </div>
</template>

<script>
import DownloadMixin from "@/mixins/DownloadMixin";
import loadingMixin from "@/mixins/LoadingMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import SignatureModal from "../../reports/components/risk-assessment/SignatureModal.vue";
import Survey from "../../survey/Survey.vue";
import DeforestationService from "@/_services/DeforestationService";
import { getCountries } from "country-state-picker";

import S3UploadService from "@/_services/S3UploadService";
import DeforestationSurveyBuilderService from "@/_services/DeforestationSurveyBuilderService";

export default {
  name: "RiskAssessment",
  created() {
    this.startLoading();

    //TODO :: Replace 8 with asessment id from route params
    this.findQuestionForSurvey(this.assessmentId);
  },
  computed: {
    getCurrentUser() {
      return this.$store.getters.getUser;
    },
    formattedSupplier() {
      return this.supplierList.map((person) => ({
        ...person,
        fullName: `${person.firstName} ${person.lastName}`,
      }));
    },
  },
  async mounted() {
    // this.loading = false;
    await this.getDiligenceDetail(this.diligenceId);
    await this.getSupplierList();
    this.getCountry();
  },
  components: {
    signature: SignatureModal,
    Survey: Survey,
  },
  methods: {
    async getDiligenceDetail(diligenceId) {
      this.loading = true;
      DeforestationService.getDiligenceDetail(parseInt(diligenceId))
        .then((res) => {
          const dueDiligence = res.data.getDiligenceDetail;

          const dummyRequiredAssessment = [
            {
              farm: "One for Each Farm",
              type: "Existing Report",
              assessment: "Farm Risk Assessment",
            },
            {
              farm: "One for All Farms",
              type: "Existing Report",
              assessment: "EUDR Deforestation Assessment",
            },
            {
              id: 5,
              farm: "One for All Farms",
              type: "Existing Report",
              assessment: "Legality Information",
            },
            {
              id: 6,
              farm: "One for All Farms",
              type: "Existing Report",
              assessment: "Compliance Assessment",
            },
          ];
          dueDiligence.requiredAssessment = dummyRequiredAssessment;

          const riskAssessment = dueDiligence.requiredAssessment.find(
            (assessment) => assessment.assessment == "Farm Risk Assessment"
          );

          console.log(riskAssessment, "riskAssessmentriskAssessment");
          console.log(riskAssessment, "this.riskAssessment===");

          this.reportRiskAssessmet = riskAssessment;

          if (riskAssessment.farm == "One for Each Farm") {
            this.isOneForEachFarm = true;
            this.getProductionPlaces();
          }

          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.$notify({
            text: err,
            type: "error",
          });
        });
    },
    acerToHectare(acer) {
      if (acer) {
        return (acer * 0.404686011).toFixed(4);
      }
      return "";
    },
    async removeFarm(id) {
      this.startLoading();
      const params = {
        diligenceReportId: this.diligenceId,
        farmId: id,
      };
      await DeforestationService.removeFarmFromProductionPlaceListById(params);
      await this.getProductionPlaces();
      this.stopLoading();
    },

    async getSupplierList() {
      this.loading = true;
      DeforestationService.getSupplierList()
        .then((res) => {
          this.supplierList = res.data.getSupplierList;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          console.log("Error", err);
        });
    },
    getCountry() {
      this.countriesOnly = [...getCountries()];
      this.countries = [{ name: "All Countries" }, ...getCountries()];
    },
    async getProductionPlaces(opt = null) {
      this.loading = true;
      const requestParams = {
        page: this.options.page,
        limit: this.options.itemsPerPage,
        diligenceReportId: this.diligenceId,
        farmOwner: this.suppplier ? this.suppplier : null,
        farmCountry: this.country,
        riskAssessmentStatus: this.riskAssessmentStatus,
        searchPhrase: this.search,
        removed: false,
      };

      if (opt?.sortBy?.length) {
        requestParams.orderField = opt.sortBy[0];
        requestParams.order = opt.sortDesc[0] ? "DESC" : "ASC";
      }
      DeforestationService.getProductionPlaces(requestParams)
        .then((res) => {
          this.productionPlaces = res.data.productionPlaces.rows;
          this.totalProductionPlaces = res.data.productionPlaces.totalCount;
          this.totalPages = Math.ceil(
            this.totalProductionPlaces / this.options.itemsPerPage
          );
          this.from = (this.options.page - 1) * this.options.itemsPerPage + 1;
          this.to =
            this.options.page * this.options.itemsPerPage -
            (this.options.itemsPerPage - res.data.productionPlaces.rows.length);
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          console.log("Error", err);
        });
    },
    handleSearchByCountry() {
      this.options.page = 1;
      this.getProductionPlaces();
    },
    handleSearchBySupplier() {
      this.options.page = 1;
      this.getProductionPlaces();
    },
    handleSearchByStatus() {
      this.options.page = 1;
      this.getProductionPlaces();
    },
    //
    handleSearchByPharse() {},
    pageChange(t) {
      if (t) this.options.page = this.options.page + 1;
      else this.options.page = this.options.page - 1;
      this.getProductionPlaces();
    },

    addSurvey() {
      if (!this.$refs.surveyForm.validate()) return;
      console.log("valid forms");
    },
    removeFile(key) {
      this.documents.splice(key, 1);
    },

    additionalOnChange(e) {
      const files = e.target.files;
      this.uploadFiles(files);
    },
    handleDrop(event) {
      event.preventDefault();
      this.dragging = false;
      const files = event.dataTransfer.files;
      this.uploadFiles(files);
    },
    async uploadFiles(files) {
      const validExtensions = ["pdf", "doc", "docx", "xls", "xlsx"];
      const fileArray = Array.from(files);

      // Filter out invalid files
      const validFiles = fileArray.filter((file) => {
        const extension = file.name
          .split(".")
          .pop()
          .toLowerCase();
        return validExtensions.includes(extension);
      });

      const invalidFiles = fileArray.filter((file) => {
        const extension = file.name
          .split(".")
          .pop()
          .toLowerCase();
        return !validExtensions.includes(extension);
      });

      if (invalidFiles.length > 0) {
        this.fileError = true;
      } else {
        this.fileError = false;
        this.documents = validFiles.map((x) => {
          return {
            file: x,
            extension: x.name
              .split(".")
              .pop()
              .toLowerCase(),
            name: x.name,
            comment: "",
            expiryDate: "",
            productExpirationMenu: false,
          };
        });
        this.documents.forEach(async (item) => {
          const result = await S3UploadService.singleUpload(
            item.file,
            "risk-assessment-docs"
          );
          const s3Result = {
            s3Location: result.fullPath,
            s3key: result.key,
          };
          this.s3FileUploadResult.push(s3Result);
        });
      }
    },
    findQuestionForSurvey(assessmentId) {
      console.log(assessmentId);
      DeforestationSurveyBuilderService.findQuestionForSurvey(
        parseInt(assessmentId)
      ).then((res) => {
        const noOfSteps = res.data.findQuestionForSurvey.count;
        this.totalSurveyStep = noOfSteps;
        this.stepWiseSurveyQuestions = this.survey =
          res.data.findQuestionForSurvey.rows;
        this.survey =
          res.data.findQuestionForSurvey.rows[0].assessmentQuestions;
        this.stopLoading();

        // this.survey = [
        //     {
        //         "id": 1,
        //         "userId": 1,
        //         "title": "How many hours per week do permanent work?",
        //         "assessmentQuestionType": "RADIO_BUTTON",
        //         "isMandatory": true,
        //         "isEnabled": true,
        //         "hasOptions": true,
        //         "isFileType": false,
        //         "fileTypeAdditionalSettings": null,
        //         "isDigitalSignatureType": false,
        //         "digitalSignatureTypeAdditionalSettings": null,
        //         "options": [
        //             {
        //                 "id": 4,
        //                 "label": "more than 10 years ago",
        //                 "value": "very high",
        //                 "checklists": [],
        //                 "subQuestions": []
        //             },
        //             {
        //                 "id": 3,
        //                 "label": "5-10 years ago",
        //                 "value": "high",
        //                 "checklists": [],
        //                 "subQuestions": []
        //             },
        //             {
        //                 "id": 2,
        //                 "label": "1-5 years ago",
        //                 "value": "medium",
        //                 "checklists": [],
        //                 "subQuestions": [
        //                 ]
        //             },
        //             {
        //                 "id": 1,
        //                 "label": "Less than 40 hours",
        //                 "value": "low",
        //                 "checklists": [
        //                     "Rotate tasks and responsibilities among workers to prevent.",
        //                     "Allocate land for reforestation efforts.",
        //                     "Protect remaining forested areas on the farm."
        //                 ],
        //                 "subQuestions": [
        //                     {
        //                         "id": 2,
        //                         "userId": 1,
        //                         "title": "This is a text field?",
        //                         "assessmentQuestionType": "TEXT_AREA",
        //                         "isMandatory": true,
        //                         "isEnabled": true,
        //                         "hasOptions": false,
        //                         "isFileType": false,
        //                         "fileTypeAdditionalSettings": null,
        //                         "isDigitalSignatureType": false,
        //                         "digitalSignatureTypeAdditionalSettings": null,
        //                     },
        //                 ]
        //             }
        //         ],
        //     },
        //     {
        //         "id": 6,
        //         "userId": 1,
        //         "title": "How many hours per week do permanent work?",
        //         "assessmentQuestionType": "DROPDOWN_OPTIONS",
        //         "isMandatory": true,
        //         "isEnabled": true,
        //         "hasOptions": true,
        //         "isFileType": false,
        //         "fileTypeAdditionalSettings": null,
        //         "isDigitalSignatureType": false,
        //         "digitalSignatureTypeAdditionalSettings": null,
        //         "options": [
        //             {
        //                 "id": 4,
        //                 "label": "more than 10 years ago",
        //                 "value": "very high",
        //                 "checklists": [],
        //                 "subQuestions": []
        //             },
        //             {
        //                 "id": 3,
        //                 "label": "5-10 years ago",
        //                 "value": "high",
        //                 "checklists": [],
        //                 "subQuestions": []
        //             },
        //             {
        //                 "id": 2,
        //                 "label": "1-5 years ago",
        //                 "value": "medium",
        //                 "checklists": [],
        //                 "subQuestions": [
        //                     {
        //                         "id": 1,
        //                         "userId": 1,
        //                         "title": "How many hours per week do permanent work?",
        //                         "assessmentQuestionType": "RADIO_BUTTON",
        //                         "isMandatory": true,
        //                         "isEnabled": true,
        //                         "hasOptions": true,
        //                         "isFileType": false,
        //                         "fileTypeAdditionalSettings": null,
        //                         "isDigitalSignatureType": false,
        //                         "digitalSignatureTypeAdditionalSettings": null,
        //                         "options": [
        //                             {
        //                                 "id": 4,
        //                                 "label": "more than 10 years ago",
        //                                 "value": "very high",
        //                                 "checklists": [],
        //                                 "subQuestions": []
        //                             },
        //                             {
        //                                 "id": 3,
        //                                 "label": "5-10 years ago",
        //                                 "value": "high",
        //                                 "checklists": [],
        //                                 "subQuestions": []
        //                             },
        //                             {
        //                                 "id": 2,
        //                                 "label": "1-5 years ago",
        //                                 "value": "medium",
        //                                 "checklists": [],

        //                             },
        //                             {
        //                                 "id": 1,
        //                                 "label": "Less than 40 hours",
        //                                 "value": "low",
        //                                 "checklists": [
        //                                     "Rotate tasks and responsibilities among workers to prevent.",
        //                                     "Allocate land for reforestation efforts.",
        //                                     "Protect remaining forested areas on the farm."
        //                                 ],

        //                             }
        //                         ],
        //                     },
        //                 ]
        //             },
        //             {
        //                 "id": 1,
        //                 "label": "Less than 40 hours",
        //                 "value": "low",
        //                 "checklists": [
        //                     "Rotate tasks and responsibilities among workers to prevent.",
        //                     "Allocate land for reforestation efforts.",
        //                     "Protect remaining forested areas on the farm."
        //                 ],
        //                 "subQuestions": [
        //                 ]
        //             }
        //         ],

        //     },
        //     {
        //         "id": 7,
        //         "userId": 1,
        //         "title": "How many hours per week do permanent work?",
        //         "assessmentQuestionType": "CHECK_BOXES",
        //         "isMandatory": true,
        //         "isEnabled": true,
        //         "hasOptions": true,
        //         "isFileType": false,
        //         "fileTypeAdditionalSettings": null,
        //         "isDigitalSignatureType": false,
        //         "digitalSignatureTypeAdditionalSettings": null,
        //         "options": [
        //             {
        //                 "id": 4,
        //                 "label": "more than 10 years ago",
        //                 "value": "very high",
        //                 "checklists": [],
        //                 "subQuestions": []
        //             },
        //             {
        //                 "id": 3,
        //                 "label": "5-10 years ago",
        //                 "value": "high",
        //                 "checklists": [],
        //                 "subQuestions": []
        //             },
        //             {
        //                 "id": 2,
        //                 "label": "1-5 years ago",
        //                 "value": "medium",
        //                 "checklists": [],
        //                 "subQuestions": [
        //                     {
        //                         "id": 3,
        //                         "userId": 1,
        //                         "title": "Signatuere",
        //                         "assessmentQuestionType": "DIGITAL_SIGNATURE",
        //                         "isMandatory": true,
        //                         "isEnabled": true,
        //                         "hasOptions": false,
        //                         "isFileType": false,
        //                         "fileTypeAdditionalSettings": null,
        //                         "isDigitalSignatureType": true,
        //                         "digitalSignatureTypeAdditionalSettings": {
        //                             "uploadSignatureFile": true,
        //                             "drawSignature": false
        //                         },
        //                         "options": []
        //                     }
        //                 ]
        //             },
        //             {
        //                 "id": 7,
        //                 "label": "Less than 40 hours",
        //                 "value": "low",
        //                 "checklists": [
        //                     "Rotate tasks and responsibilities among workers to prevent.",
        //                     "Allocate land for reforestation efforts.",
        //                     "Protect remaining forested areas on the farm."
        //                 ],
        //                 "subQuestions": [
        //                 ]
        //             }
        //         ],
        //     },
        //     {
        //         "id": 2,
        //         "userId": 1,
        //         "title": "This is a text field?",
        //         "assessmentQuestionType": "TEXT_FIELD",
        //         "isMandatory": true,
        //         "isEnabled": true,
        //         "hasOptions": false,
        //         "isFileType": false,
        //         "fileTypeAdditionalSettings": null,
        //         "isDigitalSignatureType": false,
        //         "digitalSignatureTypeAdditionalSettings": null,
        //     },
        //     {
        //         "id": 3,
        //         "userId": 1,
        //         "title": "This is a text area field?",
        //         "assessmentQuestionType": "TEXT_AREA",
        //         "isMandatory": true,
        //         "isEnabled": true,
        //         "hasOptions": false,
        //         "isFileType": false,
        //         "fileTypeAdditionalSettings": null,
        //         "isDigitalSignatureType": false,
        //         "digitalSignatureTypeAdditionalSettings": null,
        //     },
        //     {
        //         "id": 4,
        //         "userId": 1,
        //         "title": "This is a numeric text field?",
        //         "assessmentQuestionType": "TEXT_FIELD_NUMERIC",
        //         "isMandatory": true,
        //         "isEnabled": true,
        //         "hasOptions": false,
        //         "isFileType": false,
        //         "fileTypeAdditionalSettings": null,
        //         "isDigitalSignatureType": false,
        //         "digitalSignatureTypeAdditionalSettings": null,
        //     },
        //     {
        //         "id": 5,
        //         "userId": 1,
        //         "title": "This is a Date field?",
        //         "assessmentQuestionType": "DATE_FIELD",
        //         "isMandatory": true,
        //         "isEnabled": true,
        //         "hasOptions": false,
        //         "isFileType": false,
        //         "fileTypeAdditionalSettings": null,
        //         "isDigitalSignatureType": false,
        //         "digitalSignatureTypeAdditionalSettings": null,
        //     },
        //     {
        //         "id": 10,
        //         "userId": 1,
        //         "title": "Signatuere",
        //         "assessmentQuestionType": "DIGITAL_SIGNATURE",
        //         "isMandatory": true,
        //         "isEnabled": true,
        //         "hasOptions": false,
        //         "isFileType": false,
        //         "fileTypeAdditionalSettings": null,
        //         "isDigitalSignatureType": true,
        //         "digitalSignatureTypeAdditionalSettings": {
        //             "uploadSignatureFile": true,
        //             "drawSignature": false
        //         },
        //         "options": []
        //     },
        //     {
        //         "id": 2,
        //         "userId": 1,
        //         "title": "Files?",
        //         "assessmentQuestionType": "FILE_ATTACHMENT",
        //         "isMandatory": true,
        //         "isEnabled": true,
        //         "hasOptions": false,
        //         "isFileType": true,
        //         "fileTypeAdditionalSettings": {
        //             "allowedFileTypes": [
        //                 "PDF"
        //             ],
        //             "allowMultipleAttachments": true,
        //             "allowComments": true
        //         },
        //         "isDigitalSignatureType": false,
        //         "digitalSignatureTypeAdditionalSettings": null,
        //         "options": []
        //     }
        // ];
      });
    },

    handleOpenSignatureModel() {
      this.openSignatureModel = true;
    },
    handleSignature(payload) {
      console.log(payload);
    },
    handleQuestionResponses(payload) {
      const index = this.surveyResponses.findIndex(
        (s) => s.questionId === payload.questionId
      );
      if (index === -1) this.surveyResponses.push(payload);
      else this.surveyResponses[index] = payload;
      console.log("surveyResponse", this.surveyResponses);
    },
    submitSurveyAssessment(dueDiligenceId, assessmentId, userId) {
      this.startLoading();

      if (this.isOneForEachFarm) {
        const index = this.surveyResponseWithProductionPlaceFarmId.findIndex(
          (s) => s.farmId === parseInt(this.selectedProductionPlaceFarmId)
        );
        const productionPlaceFarmData = {
          farmId: parseInt(this.selectedProductionPlace),
          surveyResponses: this.surveyResponses,
        };
        if (index === -1)
          this.surveyResponseWithProductionPlaceFarmId.push(
            productionPlaceFarmData
          );
        else
          this.surveyResponseWithProductionPlaceFarmId[
            index
          ] = productionPlaceFarmData;
      }

      console.log("surveyResponse", this.surveyResponses);
      const payload = {
        dueDiligenceId: parseInt(dueDiligenceId),
        assessmentId: parseInt(assessmentId),
        userId,
        farmId: this.isOneForEachFarm
          ? parseInt(this.selectedProductionPlace)
          : null,
        surveyResponses: this.surveyResponses,
        status: 'COMPLETED'
      };
      DeforestationSurveyBuilderService.saveSurveyResponse(payload)
        .then((res) => {
          console.log(res);
          this.surveyResponses = [];
          this.$notify({
            text: "Survey saved successfully",
            type: "success",
          });
        })
        .catch((err) => {
          this.$notify({
            text: err,
            type: "error",
          });
          console.log(err);
        });

      this.stopLoading();
    },
    submitAssessment() {
      //TODO :: Replace 1, 8, 2 with duedillegice, assessment and user id from route params

      this.submitSurveyAssessment(
        this.diligenceId,
        this.assessmentId,
        this.getCurrentUser.id
      );
    },
    handleProductionPlaceClick(productionPlaceFarmId) {
      const index = this.surveyResponseWithProductionPlaceFarmId.findIndex(
        (s) => s.farmId === parseInt(this.selectedProductionPlaceFarmId)
      );
      const productionPlaceFarmData = {
        farmId: parseInt(this.selectedProductionPlace),
        surveyResponses: this.surveyResponses,
      };
      if (index === -1)
        this.surveyResponseWithProductionPlaceFarmId.push(
          productionPlaceFarmData
        );
      else
        this.surveyResponseWithProductionPlaceFarmId[
          index
        ] = productionPlaceFarmData;

      const isExisting = this.surveyResponseWithProductionPlaceFarmId.find(
        (s) => s.farmId === parseInt(productionPlaceFarmId)
      );

      this.surveyResponses = isExisting?.surveyResponses || [];
      this.selectedProductionPlaceFarmId = parseInt(productionPlaceFarmId);
    },
  },
  data() {
    return {
      assessmentId: this.$route.params.assessmentId || 8,
      reportRiskAssessmet: null,
      country: "",
      suppplier: "",
      riskAssessmentStatus: "",
      countriesOnly: [],
      countries: [],
      supplierList: [],
      riskAssessmentStatusList: ["Approved", "Mitigation Required"],

      diligenceId: parseInt(this.$route.params.id) || 2,
      search: "",
      farmStatus: "success",
      farmStatusList: [],
      totalProductionPlaces: 0,
      options: {
        page: 1,
        itemsPerPage: 2,
      },
      totalPages: 0,

      placesHeaders: [
        {
          text: this.$t("dueDiligence.productionPlaceAndFarmID"),
          align: "start",
          sortable: true,
          value: "user",
          class: "black--text",
          width: "150px",
        },

        {
          text: this.$t("deforestation.producer"),
          value: "plantation_name",
          sortable: true,
          class: "black--text",
          width: "150px",
        },
        {
          text: `${this.$t("deforestation.addressOfProduction")}`,
          value: "farm",
          sortable: true,
          class: "black--text",
          width: "150px",
        },
        {
          text: `${this.$t("deforestation.areaHa")}`,
          value: "farm",
          sortable: true,
          class: "black--text",
          width: "95px",
        },
        {
          text: `${this.$t("deforestation.type")}`,
          value: "farm",
          sortable: true,
          class: "black--text",
          width: "95px",
        },

        {
          text: `${this.$t("deforestation.riskAssessment")}`,
          value: "farm",
          sortable: true,
          class: "black--text",
          width: "225px",
        },
      ],
      productionPlaces: [],
      documents: [],
      s3FileUploadResult: [],
      productExpirationMenu: false,
      openSignatureModel: false,
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: true,
          to: "/",
        },
        {
          text: this.$t("deforestation.riskAssessment"),
          disabled: true,
          to: "breadcrumbs_link_1",
        },
      ],
      dragging: false,
      previewUrl: null,
      additionalFileOne: true,
      additionalPrevUrlOne: null,
      additionalPrevUrlTwo: null,
      openAddPricingSlab: false,
      stepWiseSurveyQuestions: [],
      currentSurveyStep: 1,
      totalSurveyStep: 1,
      survey: [],
      surveyResponses: [],
      isOneForEachFarm: false,
      selectedProductionPlaceFarmId: null,
      surveyResponseWithProductionPlaceFarmId: [],
    };
  },
  mixins: [loadingMixin, getPermittedActions, DownloadMixin],
};
</script>

<style lang="scss" scoped>
.img-preview {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

.img-item img {
  max-height: inherit;
}

.img-item button {
  position: absolute;
  right: 0;
  color: red;
  cursor: pointer;
}

.letterSpacing {
  letter-spacing: 0;
}

.my-awesome-table {
  table-layout: fixed;
}

::v-deep .v-tab:hover {
  background-color: #caf1e2;
  color: $primary_color !important;
}

// ::v-deep .green-shadow:hover {
//     background-color: $primary_color;
//     color: white;
// }

::v-deep .my-custom-dialog {
  position: absolute;
  top: 0;
  min-height: 100%;
  right: 0;
  margin-right: 0px;
  margin-top: 0px;
}

::v-deep .square {
  width: 1vw;
  height: 1vw;
}

::v-deep .xxxx {
  border: 2px solid black;
}

::v-deep .product-name-cl {
  padding: 5px;
}

::v-deep .product-name-cl .product-img {
  display: flex;
  align-items: center;
}

::v-deep .product-img p {
  margin-left: 5px;
}

.dropZone {
  width: 100%;
  height: 200px;
  position: relative;
  border: 2px dashed #97a8b8;
}

.upload-document {
  width: 100%;
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
  overflow: clip;
}

.dropZone-over {
  background: #5c5c5c;
  opacity: 0.8;
  overflow: clip;
}

.dropZone-uploaded {
  width: 100%;
  height: 450px;
  position: relative;
  border: 2px solid $primary-color;
  overflow: clip;
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
  overflow: clip;
}

.blue-color {
  color: #0057bd;
}

.underline {
  text-decoration: underline;
}

.gray-color {
  color: #979797;
}

.pdf-box {
  height: 75px;
  width: 75px;
  background-color: #e5f8f1;
  position: relative;
  line-height: 75px;
  text-align: center;
}

.pdf-box h1 {
  color: #135b00;
}

//
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
</style>
