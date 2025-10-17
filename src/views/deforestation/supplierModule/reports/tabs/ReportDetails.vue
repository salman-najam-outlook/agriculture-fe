<template>
  <div>
    <v-form
      ref="addReportForm"
      v-model="addReportFormValid"
      lazy-validation
      @submit.prevent="saveFormData"
    >
      <v-card elevation="0" class="px-5">
        <v-card-text>
          <v-row class="mt-5">
            <v-col cols="4"
              ><h3>{{ $t("deforestation.supplierInformation") }}</h3>
              <label for="text">
                {{ $t("deforestation.supplier") }}
              </label>
              <v-autocomplete
                dense
                :rules="addReportFormRules.supplierId"
                outlined
                v-model="report.supplier"
                item-text="fullName"
                item-value="id"
                :items="formattedSupplier"
                variant="outlined"
                return-object
                :placeholder="$t('select')"
              >
                <!-- Add a footer slot -->
                <template v-slot:append-item>
                  <v-divider></v-divider>
                  <v-list-item @click="addNewSupplierDialog = true">
                    <v-list-item-content style="color:#0EBF67">
                      <v-list-item-title>
                        <v-icon
                          class="icon-with-background"
                          style="color:#0EBF67"
                        >
                          mdi-plus-circle </v-icon
                        ><span class="ml-5">{{
                          $t("deforestation.addNewSupplier")
                        }}</span></v-list-item-title
                      >
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="8"> </v-col>
          </v-row>

          <v-row>
            <v-col cols="2">
              {{ $t("deforestation.name") }}
              <h3 style="color:black">{{ report.supplier.fullName }}</h3>
            </v-col>
            <v-col cols="2">
              {{ $t("deforestation.email") }}
              <h3 style="color:black">{{ report.supplier.email }}</h3>
            </v-col>
            <v-col cols="2">
              {{ $t("deforestation.phoneNumber") }}
              <!-- Block 3 content -->
              <h3 style="color:black">{{ report.supplier.mobile }}</h3>
            </v-col>
            <v-col cols="2">
              {{ $t("deforestation.country") }}
              <h3 style="color:black">{{ report.supplier.countryId }}</h3>
              <!-- Block 4 content -->
            </v-col>
            <v-col cols="2">
              {{ $t("deforestation.status") }}
              <h3
                style="color:black"
                v-if="
                  report.supplier &&
                    typeof report.supplier.verified !== 'undefined'
                "
              >
                {{
                  report.supplier.verified == 0 ? "Unregistered" : "Registered"
                }}
              </h3>
              <h3 style="color:black" v-else></h3>
              <!-- Block 5 content -->
            </v-col>
          </v-row>
          <v-divider class="mt-5 mb-5"></v-divider>
          <v-row class="">
            <v-col cols="12">
              <h3 style="color:black">
                {{ $t("deforestation.whoWillAddPlace") }}
                <v-tooltip top color="00BD73" max-width="500">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      class="icon-with-background"
                      style="color:#0EBF67"
                      v-bind="attrs"
                      v-on="on"
                    >
                      mdi-alert-circle
                    </v-icon>
                  </template>
                  <p>
                    <b>{{ $t("diligence.selectWhoWillAddPlaceData") }}</b>
                  </p>
                  <ul>
                    <li>
                      <span>{{ $t("diligence.operatorSelect") }}</span>
                    </li>
                    <li>
                      <span>{{ $t("diligence.supplierSelect") }}</span>
                    </li>
                  </ul>
                </v-tooltip>
              </h3>
            </v-col>

            <v-col cols="12">
              <v-radio-group v-model="report.whoAddPlaceData" row>
                <v-radio
                  :label="$t('dueDiligence.operator')"
                  value="operator"
                ></v-radio>
                <v-radio
                  :label="$t('dueDiligence.supplier')"
                  value="supplier"
                ></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>

          <v-divider class="mt-5 mb-5"></v-divider>
          <v-row class="">
            <v-col cols="12">
              <h3 style="color:black">
                {{ $t("dueDiligence.selectRequiredAssessment") }}
                <v-tooltip top color="00BD73" max-width="350">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      class="icon-with-background"
                      style="color:#0EBF67"
                      v-bind="attrs"
                      v-on="on"
                    >
                      mdi-alert-circle
                    </v-icon>
                  </template>
                  <span>{{ $t("dueDiligence.selectRequiredAssessment") }}</span>
                </v-tooltip>
              </h3>
            </v-col>

            <v-col cols="4">
              <label for="text">
                {{ $t("dueDiligence.filterAssessments") }}
              </label>

              <v-autocomplete
                :label="$t('deforestation.allCountries')"
                clearable
                outlined
                v-model="report.assessment.selectedCountries"
                :items="[selectAllItem, ...countries]"
                item-text="name"
                item-value="name"
                cache-items
                :search-input.sync="search"
                dense
                chips
                small-chips
                solo
                flat
                multiple
              >
              </v-autocomplete>
            </v-col>
            <v-col cols="8"> </v-col>
          </v-row>

          <!-- <v-row>
                        <v-col cols="3">
                            <v-checkbox v-model="report.assessment.assessments[0].assessment"
                                label="Farm Deforestation Report" color="success" value="Farm Deforestation Report"
                                hide-details></v-checkbox>
                        </v-col>

                        <v-col cols="3">
                            <v-select :items="['Existing Report', 'Dimitra Report']"
                                v-model="report.assessment.assessments[0].type" class="mr-1" dense item-text="name"
                                item-value="value" outlined />
                        </v-col>
                        <v-col cols="3">
                            <v-select :items="['One for All Farms', 'One for Each Farm']"
                                v-model="report.assessment.assessments[0].farm" class="mr-1" dense item-text="name"
                                item-value="value" outlined />
                        </v-col>
                    </v-row> -->

          <v-row
            v-for="(selectedAssessment, index) in selectedAssessments"
            :key="selectedAssessment.id"
          >
            <v-col cols="3">
              <v-checkbox
                v-if="index == 0"
                v-model="report.assessment.selectedAssessments"
                readonly
                :label="report.assessment.assessments[index].assessment"
                color="success"
                :value="report.assessment.assessments[index].assessment"
                hide-details
              ></v-checkbox>
              <v-checkbox
                v-else
                v-model="report.assessment.selectedAssessments"
                :label="report.assessment.assessments[index].assessment"
                color="success"
                :value="report.assessment.assessments[index].assessment"
                hide-details
              ></v-checkbox>
            </v-col>

            <v-col cols="3">
              <!-- :items="['Existing Report', 'Dimitra Report']" -->
              <v-select
                :items="
                  formatedAssessmentOptions(
                    report.assessment.assessments[index].assessment
                  )
                "
                v-model="report.assessment.assessments[index].type"
                class="mr-1"
                dense
                item-text="name"
                item-value="value"
                outlined
              />
            </v-col>
            <v-col cols="3">
              <v-select
                :items="['One for All Farms', 'One for Each Farm']"
                v-model="report.assessment.assessments[index].farm"
                class="mr-1"
                dense
                item-text="name"
                item-value="value"
                outlined
              />
            </v-col>
          </v-row>

          <!-- <v-row>
                        <v-col cols="3">
                            <v-checkbox v-model="report.assessment.types" label="Farm Risk Assessment" color="success"
                                value="Farm Risk Assessment" hide-details></v-checkbox>
                        </v-col>

                        <v-col cols="3">
                            <v-select :items="['Existing Assessment Files', 'Assessment Survey']"
                                v-model="report.assessment['Farm Risk Assessment'].type" class="mr-1" dense item-text="name"
                                item-value="value" outlined />
                        </v-col>
                        <v-col cols="3">
                            <v-select :items="['One for All Farms', 'One for Each Farm']"
                                v-model="report.assessment['Farm Risk Assessment'].farm" class="mr-1" dense item-text="name"
                                item-value="value" outlined />
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="3">
                            <v-checkbox v-model="report.assessment.types" label="Legal Information" color="success"
                                value="Legal Information" hide-details></v-checkbox>
                        </v-col>

                        <v-col cols="3">
                            <v-select :items="['Existing Legal Files', 'Legal Survey']"
                                v-model="report.assessment['Legal Information'].type" class="mr-1" dense item-text="name"
                                item-value="value" outlined />

                        </v-col>
                        <v-col cols="3">
                            <v-select :items="['One for All Farms', 'One for Each Farm']"
                                v-model="report.assessment['Legal Information'].farm" class="mr-1" dense item-text="name"
                                item-value="value" outlined />
                        </v-col>
                    </v-row> -->

          <v-btn
            color="primary"
            dark
            medium
            class="mr-3"
            @click="addMoreAssessmentDialog = true"
          >
            {{ $t("dueDiligence.addMoreAssessments") }}
          </v-btn>
        </v-card-text>
      </v-card>

      <v-card elevation="0" class="px-5 py-5 mt-7">
        <v-card-text>
          <template>
            <v-row>
              <v-col cols="3">
                <h3 style="color:black">
                  {{ $t("dueDiligence.internalReferenceNumber") }}
                  <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        class="icon-with-background"
                        style="color:#0EBF67"
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-alert-circle
                      </v-icon>
                    </template>
                    <span>{{ $t("deforestation.internalRefNo") }}</span>
                  </v-tooltip>
                </h3>
                <v-text-field
                  :rules="addReportFormRules.internalReferenceNumber"
                  :placeholder="$t('dueDiligence.internalReferenceNumber')"
                  v-model="report.internalReferenceNumber"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <h3 style="color:black">
                  {{ $t("deforestation.eudr_reference_number") }}
                  <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        class="icon-with-background"
                        style="color:#0EBF67"
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-alert-circle
                      </v-icon>
                    </template>
                    <span>{{ $t("deforestation.eudrRefNo") }}</span>
                  </v-tooltip>
                </h3>
                <v-text-field
                  readonly
                  :placeholder="$t('dueDiligence.referenceNumber')"
                  v-model="report.EUDRReferenceNumber"
                  outlined
                  dense
                ></v-text-field>
              </v-col>

              <v-col cols="3">
                <!-- Block 3 content -->
                <h3 style="color:black">
                  {{ $t("deforestation.eudrRefNo") }}
                  <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        class="icon-with-background"
                        style="color:#0EBF67"
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-alert-circle
                      </v-icon>
                    </template>
                    <span>{{ $t("deforestation.eudrRefNo") }}</span>
                  </v-tooltip>
                </h3>
                <v-text-field
                  readonly
                  :placeholder="'DC-000078625'"
                  v-model="report.companyID"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
            </v-row>

            <v-divider class="mt-5 mb-5"></v-divider>
            <v-row class="">
              <v-col cols="12">
                <h3 style="color:black">{{ $t("deforestation.activity") }}</h3>
              </v-col>

              <v-col cols="12">
                <v-radio-group v-model="report.activity" row>
                  <v-radio
                    :label="$t('dueDiligence.domestic')"
                    value="Domestic"
                  ></v-radio>
                  <v-radio
                    :label="$t('dueDiligence.import')"
                    value="Import"
                  ></v-radio>
                  <v-radio
                    :label="$t('dueDiligence.export')"
                    value="Export"
                  ></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>

            <v-divider class="mt-5 mb-5"></v-divider>
            <v-row class="">
              <v-col cols="12">
                <h3 style="color:black">
                  {{ $t("deforestation.placeOfActivity") }}
                  <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        class="icon-with-background"
                        style="color:#0EBF67"
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-alert-circle
                      </v-icon>
                    </template>
                    <span>{{ $t("deforestation.placeOfActivity") }}</span>
                  </v-tooltip>
                </h3>
              </v-col>

              <v-col cols="4">
                <label for="text">
                  {{ $t("deforestation.countryOfActivity") }}
                </label>
                <v-select
                  :items="countriesOnly"
                  v-model="report.countryOfActivity"
                  class="mr-1"
                  dense
                  item-text="name"
                  item-value="name"
                  outlined
                  :placeholder="$t('dueDiligence.selectCountry')"
                />
              </v-col>
              <v-col cols="4">
                <label for="text">
                  {{ $t("deforestation.countryOfEntry") }}
                </label>
                <v-select
                  :items="countriesOnly"
                  v-model="report.countryOfEntry"
                  class="mr-1"
                  dense
                  item-text="name"
                  item-value="name"
                  outlined
                  :placeholder="$t('dueDiligence.selectCountry')"
                />
              </v-col>
            </v-row>

            <v-divider class="mt-5 mb-5"></v-divider>
            <v-row class="">
              <v-col cols="12">
                <h3 style="color:black">
                  {{ $t("deforestation.countryOfEntry") }}
                  <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        class="icon-with-background"
                        style="color:#0EBF67"
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-alert-circle
                      </v-icon>
                    </template>
                    <span>{{ $t("deforestation.countryOfEntry") }}</span>
                  </v-tooltip>
                </h3>
              </v-col>

              <v-col cols="4">
                <label for="text">
                  {{ $t("deforestation.product") }}
                </label>
                <v-autocomplete
                  @change="onProductChange"
                  :rules="[(v) => !!v || 'This field is required.']"
                  :placeholder="$t('dueDiligence.selectProduct')"
                  outlined
                  v-model="report.product"
                  :items="productList"
                  item-text="name"
                  item-value="id"
                  dense
                  solo
                  flat
                  return-object
                >
                  <!-- <template v-slot:item="slotProps">
                                        <span class="list-code-block">{{ slotProps.item.code }}</span> {{
                                            slotProps.item.name }}
                                    </template> -->
                </v-autocomplete>
              </v-col>
              <v-col cols="4">
                <label for="text">
                  {{ $t("deforestation.subProduct") }}
                </label>
                <v-autocomplete
                  :placeholder="$t('dueDiligence.selectSubProduct')"
                  outlined
                  v-model="report.subProduct"
                  :items="subProductList"
                  item-text="name"
                  item-value="id"
                  dense
                  solo
                  flat
                  return-object
                >
                  <!-- <template v-slot:item="slotProps">
                                        <span class="list-code-block">{{ slotProps.item.code }}</span> <span
                                            class="list-text-block">{{ slotProps.item.name }}</span>
                                    </template> -->
                </v-autocomplete>
              </v-col>
            </v-row>
            <v-row class="py-0">
              <v-col cols="8" class="py-0">
                <label for="text">
                  {{ $t("deforestation.productionDescription") }}
                </label>
                <v-textarea
                  name="input-7-1"
                  :rules="[(v) => !!v || 'This field is required.']"
                  class="v-textarea--outlined"
                  auto-grow
                  outlined
                  :label="$t('description')"
                  v-model="report.productDescription"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <label for="text">
                  {{ $t("deforestation.netMass") }}
                </label>
                <v-text-field
                  :rules="addReportFormRules.netMass"
                  :placeholder="$t('deforestation.netMass')"
                  suffix="kg"
                  v-model="report.productNetMass"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <label for="text">
                  {{ $t("deforestation.volume") }}
                </label>
                <v-text-field
                  :rules="addReportFormRules.volume"
                  :placeholder="$t('deforestation.volume')"
                  suffix="m3"
                  v-model="report.productVolume"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <label for="text">
                  {{ $t("deforestation.scietificName") }}
                </label>
                <v-text-field
                  :placeholder="$t('deforestation.scietificName')"
                  v-model="report.productScientificName"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <label for="text">
                  {{ $t("deforestation.commonName") }}
                </label>
                <v-text-field
                  :placeholder="$t('deforestation.commonName')"
                  v-model="report.productCommonName"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
            </v-row>
          </template>
        </v-card-text>
      </v-card>
    </v-form>

    <v-dialog
      transition="dialog-top-transition"
      max-width="600"
      v-model="addNewSupplierDialog"
      @click:outside="addNewSupplierDialog = false"
    >
      <v-card class="">
        <v-toolbar color="primary" dark flat dense>
          <v-toolbar-title class="font-weight-bold"
            >{{ $t("dueDiligence.addnewSupplier") }}
          </v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn icon class="white--text" @click="addNewSupplierDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-form
          @submit.prevent="addSupplier"
          ref="addSupplierForm"
          lazy-validation
          v-model="addSupplierFormValid"
        >
          <v-card-text>
            <v-row class="">
              <v-col cols="6">
                <label class="label">
                  {{ $t("deforestation.name") }}
                </label>
                <v-text-field
                  :rules="[(v) => !!v || 'This field is required.']"
                  type="text"
                  outlined
                  dense
                  :placeholder="$t('deforestation.enterSupplierName')"
                  v-model="newSupplier.name"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <label class="label">
                  {{ $t("Email") }}
                </label>
                <v-text-field
                  type="text"
                  :rules="supplierFormRules.email"
                  outlined
                  dense
                  :placeholder="$t('deforestation.enterEmailAddress')"
                  v-model="newSupplier.email"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="">
              <v-col cols="6">
                <label class="label">
                  {{ $t("Phone Number") }}
                </label>
                <v-text-field
                  type="text"
                  :rules="supplierFormRules.mobile"
                  outlined
                  dense
                  :placeholder="$t('deforestation.enterPhoneNumber')"
                  v-model="newSupplier.mobile"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <label class="label">
                  {{ $t("deforestation.country") }}
                </label>
                <v-select
                  :items="countriesOnly"
                  v-model="newSupplier.country"
                  class="mr-1"
                  dense
                  item-text="name"
                  item-value="name"
                  outlined
                  placeholder="Select Country"
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              outlined
              @click="addNewSupplierDialog = false"
              class="mr-2"
              depressed
              style="min-width: 150px;"
              color="primary"
            >
              {{ $t("cancel") }}
            </v-btn>
            <v-btn type="submit" color="primary" style="min-width: 150px;">
              {{ $t("confirm") }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>

      <!-- </template> -->
    </v-dialog>

    <AddMoreAssessment
      @close-modal="closeAddMoreAssessmentDialog"
      :dialog="addMoreAssessmentDialog"
      @selectedAssessments="handleSelectedAssessments"
      :assessments="assessmentsTypes"
    />
  </div>
</template>
<script>
import loading from "@/mixins/LoadingMixin";
import { getCountries } from "country-state-picker";
import AddMoreAssessment from "../components/AddMoreAssessment.vue";
import DeforestationService from "@/_services/DeforestationService";

export default {
  components: {
    AddMoreAssessment,
  },
  async mounted() {
    await this.getCountry();
    await this.getProductList();
    await this.getSupplierList();
    await this.getAssessmentList();
    if (this.diligenceId) {
      setTimeout(() => this.getDiligenceDetail(this.diligenceId), 3000);
    }
  },
  props: {
    diligenceId: {
      required: false,
    },
  },
  watch: {
    "report.assessment.selectedCountries"(newVal, oldVal) {
      this.handleSelectionChange(newVal, oldVal);
      this.previousSelectedCountries = [...newVal];
    },
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
    autocompleteRules() {
      return [(v) => !!v || "Item selection is required"];
    },
  },
  data() {
    return {
      addSupplierFormValid: false,
      addReportFormValid: false,
      supplierFormRules: {
        email: [(v) => !v || /.+@.+\..+/.test(v) || "E-mail must be valid"],
        mobile: [
          (v) =>
            !v ||
            /^[0-9 ]+$/.test(v) ||
            "Phone number must be numeric and can contain spaces",
        ],
      },

      addReportFormRules: {
        internalReferenceNumber: [
          (v) =>
            !v ||
            /^[a-zA-Z0-9 ]+$/.test(v) ||
            "Internal reference number must be alphanumeric",
        ],
        supplierId: [() => this.validateSupplier()],

        netMass: [
          (v) => !!v || "Net mass is required",
          (v) => /^\d+(\.\d+)?$/.test(v) || "Net mass must be valid",
        ],
        volume: [
          (v) => !v || /^\d+(\.\d+)?$/.test(v) || "Volume must be numeric",
        ],
      },
      supplierList: [],
      addNewSupplierDialog: false,
      addMoreAssessmentDialog: false,
      newSupplier: {
        name: "",
        email: "",
        mobile: "",
        country: "",
      },
      assessmentsTypes: [],
      selectedAssessments: [
        {
          assessment: "Farm Deforestation Report",
          type: "Existing Report",
          farm: "One for All Farms",
        },
      ],
      productList: [],
      subProductList: [],

      report: {
        supplier: {},
        whoAddPlaceData: "operator",
        assessment: {
          selectedCountries: [],
          selectedAssessments: ["Farm Deforestation Report"],
          assessments: [
            {
              assessment: "Farm Deforestation Report",
              type: "Existing Report",
              farm: "One for All Farms",
            },
          ],
        },

        companyID: "",
        EUDRReferenceNumber: "",
        internalReferenceNumber: "",
        activity: "Domestic",
        countryOfEntry: "",
        countryOfActivity: "",
        product: "",
        subProduct: "",
        productDescription: "",
        productNetMass: "",
        productVolume: "",
        productScientificName: "",
        productCommonName: "",
      },
      selectedCountries: [],
      search: null,
      selectAllItem: { name: "All Countries" },
      countries: [],
      countriesOnly: [],
    };
  },
  methods: {
    validateSupplier() {
      if (this.report.supplier) {
        if (this.report.supplier.id || this.report.supplier.fullName) {
          return true;
        }
      }
      return "At least one of Supplier ID or Supplier Name is required";
    },
    formatedAssessmentOptions(assessment) {
      //if(assessment == )
      if (assessment == "Farm Deforestation Report") {
        return ["Existing Report", "Report Survey"];
      } else if (assessment == "Farm Risk Assessment") {
        return ["Existing Risk Assessment", "Risk Assessment Survey"];
      } else if (assessment == "Legal Information") {
        return ["Existing Legal Information", "Legal Information Survey"];
      }

      return ["Existing Report", "Dimitra Report"];
    },

    onProductChange() {
      this.subProductList = this.report.product.subProducts;
    },
    handleSelectedAssessments(selectedAssessments) {
      const assessmentsOption = {
        assessment: "Farm Deforestation Report",
        type: "Existing Report",
        farm: "One for All Farms",
      };
      const newAssessmentsOptions = selectedAssessments.map((assessment) => ({
        assessment: assessment.title,
        type: this.formatedAssessmentOptions(assessment.title)[0],
        farm: "One for All Farms",
        id: assessment.id,
      }));
      this.selectedAssessments = [assessmentsOption, ...newAssessmentsOptions];
      this.report.assessment.assessments = [
        assessmentsOption,
        ...newAssessmentsOptions,
      ];

      this.addMoreAssessmentDialog = false;
    },

    async getDiligenceDetail(diligenceId) {
      this.startLoading();
      // if (opt?.sortBy?.length) {
      //     requestParams.orderField = opt.sortBy[0]
      //     requestParams.order = opt.sortDesc[0] ? 'DESC' : 'ASC'
      // }
      DeforestationService.getDiligenceDetail(parseInt(diligenceId))
        .then((res) => {
          if (res.errors && res.errors.length > 0) {
            const error = res.errors[0];
            const errorMessage = error.message ||this.$t("dueDiligence.anErrorOccurred");

            this.$notify({
              text: errorMessage,
              type: "error",
            });
          }
          const report = res.data.getDiligenceDetail;
          let selectedProduct = null;
          let selectedSubProduct = null;
          if (report.product) {
            selectedProduct = this.productList.find(
              (p) => p.id == report.product
            );
            this.subProductList = selectedProduct.subProducts;
            selectedSubProduct = this.subProductList.find(
              (p) => p.id == report.subProduct
            );
          }

          let reportDetail = {
            //supplier: {},
            whoAddPlaceData: report.whoAddPlaceData,
            assessment: {
              selectedCountries: [],
              assessments: [],
            },

            supplier: report.supplierId,
            companyID: report.companyID,
            EUDRReferenceNumber: report.EUDRReferenceNumber,
            internalReferenceNumber: report.internalReferenceNumber,
            activity: report.activity,
            countryOfEntry: report.countryOfEntry,
            countryOfActivity: report.countryOfActivity,

            product: report.product ? selectedProduct : null,
            subProduct: report.subProduct ? selectedSubProduct : null,
            productDescription: report.productDescription,
            productNetMass: report.productNetMass,
            productVolume: report.productVolume,
            productScientificName: report.productScientificName,
            productCommonName: report.productCommonName,
          };

          if (report.supplierId) {
            const selectedSupplier = this.supplierList.find(
              (p) => p.id == report.supplierId
            );
            if (selectedSupplier) {
              reportDetail.supplier = {
                ...selectedSupplier,
                fullName: `${selectedSupplier.firstName ||
                  ""} ${selectedSupplier.lastName || ""}`.trim(),
              };
            } else {
              this.$notify({
                text: `Supplier with ID ${report.supplierId} not found.`,
                type: "error",
              });
            }
          }

          this.selectedAssessments = report.requiredAssessment;
          reportDetail.assessment.assessments = report.requiredAssessment;
          reportDetail.assessment.selectedAssessments = report.requiredAssessment.map(
            (assessment) => assessment.assessment
          );

          reportDetail.assessment.selectedCountries =
            report.assessmentCountries;

          const updatedDiligenceDetail = Object.assign(
            {},
            this.report,
            reportDetail
          );

          this.report = updatedDiligenceDetail;
        })
        .catch((err) => {
          this.$notify({
            text: err,
            type: "error",
          });
        })
        .finally(() => {
          this.stopLoading();
        });
    },

    async getProductList() {
      this.loading = true;
      // if (opt?.sortBy?.length) {
      //     requestParams.orderField = opt.sortBy[0]
      //     requestParams.order = opt.sortDesc[0] ? 'DESC' : 'ASC'
      // }
      DeforestationService.getProductList()
        .then((res) => {
          const productList = res.data.deforestationProductList;
          this.productList = productList;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          console.log("Error", err);
        });
    },

    async getSupplierList() {
      this.loading = true;
      // if (opt?.sortBy?.length) {
      //     requestParams.orderField = opt.sortBy[0]
      //     requestParams.order = opt.sortDesc[0] ? 'DESC' : 'ASC'
      // }
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

    async getAssessmentList() {
      this.loading = true;
      DeforestationService.getAssessmentList()
        .then((res) => {
          this.assessmentsTypes = res.data.getAssessmentList;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          console.log("Error", err);
        });
    },

    addSupplier() {
      if (!this.$refs.addSupplierForm.validate()) {
        console.log("Opps error");
        return false;
      }

      this.report.supplier = {
        fullName: this.newSupplier.name,
        email: this.newSupplier.email,
        phoneNumber: this.newSupplier.mobile,
        countryId: this.newSupplier.country,
        status: "Unregistered",
      };
      this.addNewSupplierDialog = false;
    },
    getCountry() {
      this.countriesOnly = [...getCountries()];
      this.countries = [{ name: "All Countries" }, ...getCountries()];
    },

    handleSelectionChange(newVal, oldVal) {
      let addedItem, removedItem;

      // Determine the added or removed item by comparing old and new values
      if (newVal.length > oldVal.length) {
        addedItem = newVal.find((item) => !oldVal.includes(item));
      } else {
        removedItem = oldVal.find((item) => !newVal.includes(item));
      }

      if (addedItem) {
        if (addedItem.name === "All Countries") {
          this.report.assessment.selectedCountries = [
            ...this.countries,
            this.selectAllItem,
          ];
        } else if (
          this.report.assessment.selectedCountries.length ===
          this.countries.length
        ) {
          this.report.assessment.selectedCountries = [
            ...this.report.assessment.selectedCountries,
            this.selectAllItem,
          ];
        }
      }

      if (removedItem) {
        if (removedItem.name === "All Countries") {
          this.report.assessment.selectedCountries = [];
        } else if (
          this.report.assessment.selectedCountries.length ===
          this.countries.length
        ) {
          this.report.assessment.selectedCountries.push(this.selectAllItem);
        } else {
          this.report.assessment.selectedCountries = this.report.assessment.selectedCountries.filter(
            (item) => item.name !== "All Countries"
          );
        }
      }
    },
    saveFormData() {},

    closeAddMoreAssessmentDialog() {
      this.addMoreAssessmentDialog = false;
    },

    async triggerSubmit() {
      if (!this.$refs.addReportForm.validate()) {
        console.log("Opps error");
        return false;
      }

      let assessments = this.report.assessment?.assessments;
      let selectedAssessments = this.report.assessment?.selectedAssessments;

      if (selectedAssessments) {
        assessments = assessments.filter((item) => {
          return selectedAssessments.includes(item.assessment);
        });

        assessments = assessments.map((item) => {
          return item.id ? { ...item, id: parseInt(item.id) } : item;
        });
      }

      const report = {
        supplier: {
          id: this.report.supplier.id
            ? parseInt(this.report.supplier.id)
            : null,
          fullName: this.report.supplier.fullName,
          email: this.report.supplier.email,
          mobile: this.report.supplier.mobile,
          country: this.report.supplier.countryId,
        },
        whoAddPlaceData: this.report.whoAddPlaceData,
        assessmentCountries: this.report.assessment.selectedCountries,
        requiredAssessment: assessments,
        internalReferenceNumber: this.report.internalReferenceNumber,
        EUDRReferenceNumber: this.report.EUDRReferenceNumber,
        companyID: this.report.companyID,
        activity: this.report.activity,
        countryOfActivity: this.report.countryOfActivity,
        countryOfEntry: this.report.countryOfEntry,
        product: this.report.product?.id
          ? parseInt(this.report.product?.id)
          : null,
        subProduct: this.report.subProduct?.id
          ? parseInt(this.report.subProduct?.id)
          : null,
        productDescription: this.report.productDescription,
        productNetMass: this.report.productNetMass,
        productVolume: this.report.productVolume,
        productScientificName: this.report.productScientificName,
        productCommonName: this.report.productCommonName,
      };

      this.startLoading();

      try {
        let response;
        if (this.diligenceId) {
          report.id = parseInt(this.diligenceId);
          response = await DeforestationService.updateDiligenceReport(report);
          this.$notify({
            text: "Report updated successfully",
            type: "success",
          });
        } else {
          response = await DeforestationService.createDiligenceReport(report);
          console.log(response);
          this.$emit(
            "updateDiligenceId",
            response.data.createDiligenceReport.id
          );
          this.$notify({
            text: "Report added successfully",
            type: "success",
          });
        }
        this.stopLoading();
        return true;
      } catch (err) {
        this.stopLoading();
        this.$notify({
          text: err.message || this.$t("dueDiligence.anErrorOccurred"),
          type: "error",
        });
        return false;
      }
    },
  },
  mixins: [loading],
};
</script>

<style lang="scss" scoped>
.v-autocomplete .v-list-item__title {
  text-align: center;
  padding: 16px;
}

.list-code-block {
  min-width: 45px;
  border: 1px solid black;
  padding-left: 10px;
  padding-right: 10px;
  margin-right: 15px;
  color: #135b00;
}

.list-text-block {
  max-width: 500px;
}
</style>
