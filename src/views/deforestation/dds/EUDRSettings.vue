<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-8">
        <div>
          <h2 class="text-capitalize">{{ $t("surveyBuilder.settings") }}</h2>
        </div>
      </div>
      <v-card elevation="0" class="px-5 mt-4">
        <v-form ref="settings">
          <div class="pa-4">
            <div v-if="!isOperator">
              <h3 class="font-weight-bold mb-2">
                {{ $t('deforestation.selectDefaultMeasurementUnit') }}
                <v-tooltip top color="00BD73" max-width="350">
                  <template v-slot:activator="{ on, attrs }">
                      <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                      mdi-alert-circle
                      </v-icon>
                  </template>
                  <span>{{ $t("deforestation.selectDefaultMeasurementUnitInfo") }}</span>
                </v-tooltip>
              </h3>
              
              <h4 class="font-weight-bold mb-2">{{ $t("farm.radius") }}
                <v-tooltip top color="00BD73" max-width="350">
                  <template v-slot:activator="{ on, attrs }">
                      <v-icon size="medium" class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                      mdi-alert-circle
                      </v-icon>
                  </template>
                  <span>{{ $t("farm.radiusInfo") }}</span>
                </v-tooltip>
              </h4>
              <v-row justify="center" align="center">
                <v-col cols="3" sm="4">
                  <label>{{ $t('unit') }}</label>
                  <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon size="medium" class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                        mdi-alert-circle
                        </v-icon>
                    </template>
                    <span>{{ $t("farm.radiusUnitInfo") }}</span>
                  </v-tooltip>
                  <v-select :items="lengthUnits" v-model="radius.unit" item-text="label" item-value="value" dense
                    outlined :rules="[rules.required]">
                  </v-select>
                </v-col>
                <v-col cols="3" sm="4">
                  <label>{{ $t('deforestation.maxLimit') }}</label>
                  <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon size="medium" class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                        mdi-alert-circle
                        </v-icon>
                    </template>
                    <span>{{ $t("deforestation.maxLimitInfo") }}</span>
                  </v-tooltip>
                  <v-text-field v-model="radius.maxLimit" outlined dense
                    :rules="[rules.required, rules.maxLimit]"></v-text-field>
                </v-col>
                <v-col cols="3" sm="4">
                  <v-checkbox v-model="radius.isDefault" :label="$t('deforestation.asDefault')"></v-checkbox>
                </v-col>
              </v-row>

              <h3 class="font-weight-bold mb-2">{{ $t('deforestation.productMass') }}</h3>
              
              <v-row justify="center" align="center">
                <v-col cols="3" sm="4">
                  <label>{{ $t('deforestation.unit') }}</label>
                  <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon size="medium" class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                        mdi-alert-circle
                        </v-icon>
                    </template>
                    <span>{{ $t("deforestation.productMassUnitInfo") }}</span>
                  </v-tooltip>
                  <v-select :items="weightUnits" v-model="prodMassUnit" item-text="label" item-value="value" dense
                    outlined :rules="[rules.required]">
                  </v-select>
                </v-col>
                <v-col cols="3" sm="4"> </v-col>
                <v-col cols="3" sm="4"> </v-col>
              </v-row>

              <h3 class="font-weight-bold mb-2">{{ $t('deforestation.volume') }}</h3>
              <v-row justify="center" align="center">
                <v-col cols="3" sm="4">
                  <label>{{ $t('deforestation.unit') }}</label>
                  <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon size="medium" class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                        mdi-alert-circle
                        </v-icon>
                    </template>
                    <span>{{ $t("deforestation.volumeUnitInfo") }}</span>
                  </v-tooltip>
                  <v-select :items="volumeUnits" v-model="volumeUnit" item-text="label" item-value="value" dense
                    outlined :rules="[rules.required]">
                  </v-select>
                </v-col>
                <v-col cols="3" sm="4"> </v-col>
                <v-col cols="3" sm="4"> </v-col>
              </v-row>
              
              <h3 class="font-weight-bold">{{ $t('deforestation.userType') }}
                <v-tooltip top color="00BD73" max-width="350">
                  <template v-slot:activator="{ on, attrs }">
                      <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                      mdi-alert-circle
                      </v-icon>
                  </template>
                  <span>{{ $t("deforestation.userTypeInfo") }}</span>
                </v-tooltip>
              </h3>
              <v-row justify="center" align="center">
                <v-col cols="3" sm="4">
                  <v-radio-group v-model="userType" :readonly="operatorOwner || supplierOwner">
                    <div class="d-flex" v-if="operatorOwner">
                      <v-radio  value="operator" :label="$t('deforestation.operator')"></v-radio>
                      <v-tooltip top color="00BD73" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon size="medium" class="icon-with-background primary--text" style="color:#0EBF67; padding-bottom:9px; padding-left:4px" v-bind="attrs" v-on="on">
                            mdi-alert-circle
                            </v-icon>
                        </template>
                        <span>{{ $t("deforestation.operatorInfo") }}</span>
                      </v-tooltip>
                    </div>
                    <div class="d-flex" v-else-if="supplierOwner">
                      <v-radio  value="supplier" :label="$t('deforestation.supplier')"></v-radio>
                      <v-tooltip top color="00BD73" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon size="medium" class="icon-with-background primary--text" style="color:#0EBF67; padding-bottom:9px; padding-left:4px" v-bind="attrs" v-on="on">
                            mdi-alert-circle
                            </v-icon>
                        </template>
                        <span>{{ $t("deforestation.supplierInfo") }}</span>
                      </v-tooltip>
                    </div>
                  
                    <template v-else>
                      <div class="d-flex">
                        <v-radio value="operator" :label="$t('deforestation.operator')"></v-radio>
                        <v-tooltip top color="00BD73" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                              <v-icon size="medium" class="icon-with-background primary--text" style="color:#0EBF67; padding-bottom:9px; padding-left:4px" v-bind="attrs" v-on="on">
                              mdi-alert-circle
                              </v-icon>
                          </template>
                          <span>{{ $t("deforestation.operatorInfo") }}</span>
                        </v-tooltip>
                      </div>
                      <div class="d-flex">
                        <v-radio value="supplier" :label="$t('deforestation.supplier')"></v-radio>
                        <v-tooltip top color="00BD73" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                              <v-icon size="medium" class="icon-with-background primary--text" style="color:#0EBF67; padding-bottom:9px; padding-left:4px" v-bind="attrs" v-on="on">
                              mdi-alert-circle
                              </v-icon>
                          </template>
                          <span>{{ $t("deforestation.supplierInfo") }}</span>
                        </v-tooltip>
                      </div>
                    </template>
                  </v-radio-group>
                </v-col>
                <v-col cols="3" sm="4"> </v-col>
                <v-col cols="3" sm="4"> </v-col>
              </v-row>
            </div>
          </div>

          <div v-if="!isOperator">
            <h3 class="font-weight-bold mb-2">
              {{ $t('deforestation.assessmentRiskMitigationLvl') }}
              <v-tooltip top color="00BD73" max-width="350">
                <template v-slot:activator="{ on, attrs }">
                    <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                    mdi-alert-circle
                    </v-icon>
                </template>
                <span>{{ $t("deforestation.assessmentRiskMitigationLvlInfo") }}</span>
              </v-tooltip>
            </h3>
            <v-row class="mb-5">
              <div class="ml-4">
                <v-checkbox v-model="riskLevel.very_high" :label="$t('deforestation.veryHigh')"
                  hide-details></v-checkbox>
                <v-checkbox v-model="riskLevel.high" :label="$t('deforestation.high')" hide-details></v-checkbox>
                <v-checkbox v-model="riskLevel.medium" :label="$t('deforestation.medium')" hide-details></v-checkbox>
                <v-checkbox v-model="riskLevel.low" :label="$t('deforestation.low')" hide-details></v-checkbox>
                <v-checkbox v-model="riskLevel.very_low" :label="$t('deforestation.very_low')"
                  hide-details></v-checkbox>
                <v-checkbox v-model="riskLevel.zero" :label="$t('deforestation.zeroOrNeglegible')"
                  hide-details></v-checkbox>
              </div>
            </v-row>

            <h3 class="font-weight-bold mb-2">
              {{ $t('deforestation.deforestationAssessmentRiskToleranceLevel') }}
              <v-tooltip right max-width="350">
                <template v-slot:activator="{ on, attrs }">
                    <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                        mdi-alert-circle
                    </v-icon>
                 </template>
                <span>{{ $t('deforestation.deforestationAssessmentRiskToleranceLevelInfo')}}</span>
              </v-tooltip>
            </h3>
            <v-row justify="center" align="center">
              <v-col cols="3">
                <div class="szi d-flex justify-space-between">
                  <label for="autoLogOff">
                    {{ $t('deforestation.veryHigh') }}
                  </label>
                  <label> % </label>
                </div>
                <v-text-field v-model="riskToleranceLevels.very_high" outlined dense
                  :rules="[rules.range, rules.required]"></v-text-field>
              </v-col>
              <v-col cols="3">
                <div class="szi d-flex justify-space-between">
                  <label for="autoLogOff">
                    {{ $t('deforestation.high') }}
                  </label>
                  <label> % </label>
                </div>
                <v-text-field v-model="riskToleranceLevels.high" outlined dense
                  :rules="[rules.range, rules.required]"></v-text-field>
              </v-col>
              <v-col cols="3">
                <div class="szi d-flex justify-space-between">
                  <label for="autoLogOff">
                    {{ $t('deforestation.medium') }}
                  </label>
                  <label> % </label>
                </div>
                <v-text-field v-model="riskToleranceLevels.medium" outlined dense
                  :rules="[rules.range, rules.required]"></v-text-field>
              </v-col>
              <v-col cols="3"> </v-col>
            </v-row>

            <v-row justify="center" align="center">
              <v-col cols="3">
                <div class="szi d-flex justify-space-between">
                  <label for="autoLogOff">
                    {{ $t('deforestation.low') }}
                  </label>
                  <label> % </label>
                </div>
                <v-text-field v-model="riskToleranceLevels.low" outlined dense
                  :rules="[rules.range, rules.required]"></v-text-field>
              </v-col>
              <v-col cols="3">
                <div class="szi d-flex justify-space-between">
                  <label for="autoLogOff">
                    {{ $t('deforestation.very_low') }}
                  </label>
                  <label> % </label>
                </div>
                <v-text-field v-model="riskToleranceLevels.very_low" outlined dense
                  :rules="[rules.range, rules.required]"></v-text-field>
              </v-col>
              <v-col cols="3"> </v-col>
              <v-col cols="3"> </v-col>
            </v-row>

            <h3 class="font-weight-bold mt-6 mb-2">{{ $t('deforestation.dynamicExpiryTime') }}
              <v-tooltip top color="00BD73" max-width="350">
                <template v-slot:activator="{ on, attrs }">
                    <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                    mdi-alert-circle
                    </v-icon>
                </template>
                <span>{{ $t("deforestation.dynamicExpiryTimeInfo") }}</span>
              </v-tooltip>
            </h3>
            <v-row justify="center" align="center">
              <v-col cols="3" sm="4">
                <label>{{ $t('deforestation.eudrDeforestationAssessment') }}</label>
                <v-row no-gutters class="d-flex">
                  <v-col lg="8" md="8" sm="8" xs="6">
                    <v-text-field v-model="dynamicExpire.time" type="number" placeholder="1" outlined dense
                      class="rounded-r-0"></v-text-field>
                  </v-col>
                  <v-col lg="4" md="4" sm="4" xs="6">
                    <v-select :items="[
                      { id: 'month', text: $t('months') },
                    ]" item-text="text" item-value="id" dense outlined class="bg rounded-l-0 white--text"
                      v-model="dynamicExpire.period" hide-details hide-dropdown-icon>
                    </v-select>
                  </v-col>
                  <v-row>
                    <!-- Error message below v-row -->
                    <div v-if="dynamicExpireError" class="error-message">
                      {{ dynamicExpireError }}
                    </div>
                  </v-row>
                </v-row>
                <!-- commented as requested -->
                <v-radio-group v-model="dynamicExpire.renewalProcess">
                  <v-radio value="auto" :label="$t('deforestation.autoRenewal')"></v-radio>
                  <v-radio value="autoWhenAdded" :label="$t('deforestation.autoRenewalIf')"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="3" sm="4"> </v-col>
              <v-col cols="3" sm="4"> </v-col>
            </v-row>

            <h3 class="font-weight-bold mt-6 mb-2">
              {{ $t('deforestation.dueDeligenceReport') }}
              <v-tooltip right max-width="350">
                <template v-slot:activator="{ on, attrs }">
                    <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                      mdi-alert-circle
                    </v-icon>
                </template>
                <span> {{ $t('deforestation.dueDeligenceReport') }}</span>
              </v-tooltip>
            </h3>
            <v-row class="mb-5">
              <div class="ml-4">
                <v-checkbox v-model="public_geofence_download" :label="$t('deforestation.allowPublicDownload')"
                  hide-details></v-checkbox>
                <v-checkbox v-model="public_deforestation_summary" :label="$t('deforestation.showDeforestationSummary')"
                  hide-details></v-checkbox>
              </div>
            </v-row>

            <h3 class="font-weight-bold mt-6 mb-2">
              {{ $t('deforestation.declarationStatements') }}
              <v-tooltip top color="00BD73" max-width="350">
                <template v-slot:activator="{ on, attrs }">
                    <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                    mdi-alert-circle
                    </v-icon>
                </template>
                <span>{{ $t("deforestation.declarationStatementsInfo") }}</span>
              </v-tooltip>
            </h3>
            <v-row justify="center" align="center">
              <v-col cols="3">
                <label>{{ $t('deforestation.filterDeclaration') }}</label>
                <v-select :items="countryOptions" v-model="declarationStatements.filterStatementByCountry"
                  item-text="name" item-value="code" dense outlined clearable :placeholder="$t('showingAll')">
                </v-select>
              </v-col>
              <v-col> </v-col>
            </v-row>

            <div v-for="(dec, i) in filteredDeclaration" :key="i">
              <br>
              <hr />
              <v-row justify="center" align="center" class="mt-5">
                <v-col>
                  <label>{{ $t('deforestation.declarationTitle') }}</label>
                  <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                        mdi-alert-circle
                        </v-icon>
                    </template>
                    <span>{{ $t("deforestation.declarationTitleInfo") }}</span>
                  </v-tooltip>
                  <v-text-field v-model="dec.title" dense outlined>
                  </v-text-field>
                </v-col>
                <v-col>
                  <label>{{ $t('deforestation.applicableCountry') }}</label>
                  <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon small class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                        mdi-alert-circle
                        </v-icon>
                    </template>
                    <span>{{ $t("deforestation.applicableCountryInfo") }}</span>
                  </v-tooltip>
                  <v-select :items="countryOptions" v-model="dec.country" item-text="name" item-value="code" dense
                    outlined>
                  </v-select>
                </v-col>
                <v-col> </v-col>
                <v-col> </v-col>
              </v-row>
              <v-row justify="center" align="center">
                <v-col cols="6">
                  <v-textarea name="input-7-1" v-model="dec.description" dense outlined></v-textarea>
                </v-col>
                <v-col> </v-col>
              </v-row>
              <v-row justify="center" align="center">
                <v-col cols="6">
                  <div class="d-flex align-start">
                    <span class="mr-3">{{
                      dec.isEnabled ? $t('deforestation.enabled') : $t('deforestation.disabled')
                      }}</span>
                    <v-switch inset dense style="margin: 0px; padding: 0px;" v-model="dec.isEnabled">
                    </v-switch>
                  </div>
                </v-col>
                <v-col> </v-col>
              </v-row>
              <v-btn color="primary" @click="addStatements()">{{ $t('deforestation.addMore') }}</v-btn> &nbsp;
              <v-btn color="error" v-if="i > 0" @click="removedStatement(i)">{{ $t('deforestation.remove') }}</v-btn>
            </div>
          </div>
          <v-card-actions class="" style="padding-right: 0">
            <v-spacer></v-spacer>
            <v-btn outlined class="mr-2" right height="44" width="116" depressed color="primary" @click="onCancel">
              {{ $t("cancel") }}
            </v-btn>

            <v-btn class="mr-2" right height="44" width="116" depressed color="primary" @click="saveEudrSettings()"
              :disabled="dynamicExpireError !== ''">
              {{ $t("save") }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import Breadcrumb from "../../../components/core/Breadcrumb.vue";
import { getCountries } from "country-state-picker";
import DeforestationService from "@/_services/DeforestationService";
import ProfileService from "@/_services/ProfileService";

const rulesMessage = {
  range: 'Value must be between 0 and 100.',
}
export default {
  components: { Breadcrumb },
  data() {
    return {
      public_deforestation_summary:'',
      public_geofence_download:'',
      authUser: null,
      rules: {
        required: value => (value !== null && value !== undefined && value !== '') || this.$t('errors.required'),
        range: value => (value >= 0 && value <= 100) || rulesMessage.range,
        maxLimit: value =>
          !isNaN(value) && value <= 999999 || this.$t('maxLimit'),
      },
      valid: false,
      countryOptions: [],
      eudrSetting: {},
      declarationStatements: {
        filterStatementByCountry: "",
      },
      declarations: [
        {
          title: "",
          country: "",
          description: "",
          isEnabled: false,
        },
      ],
      radius: {
        unit: "",
        maxLimit: "",
        isDefault: false,
      },
      prodMassUnit: "",
      volumeUnit: "",
      userType: "operator",
      eudrKeys: {
        apiKey: "",
        apiSec: "",
      },
      dynamicExpire: {
        period: "",
        time: "month",
        renewalProcess: "auto",
      },
      country: "",
      riskLevel: {
        very_high: false,
        high: false,
        medium: false,
        low: false,
        very_low: false,
        zero: false,
      },
      riskToleranceLevels: {
        very_high: 0,
        high: 0,
        medium: 0,
        low: 0,
        very_low: 0,
      },
      org_id: null,
      lengthUnits: [
        {
          value: "m",
          label: this.$t('meter'),
        },
        {
          value: "km",
          label: this.$t('kiloMeter'),
        },
        {
          value: "mi",
          label: this.$t('mile'),
        },
      ],
      weightUnits: [
        {
          value: "gm",
          label: this.$t('gram'),
        },
        {
          value: "kg",
          label: this.$t('kilogram'),
        },
        {
          value: "lbs",
          label: this.$t('pound'),
        },
      ],
      volumeUnits: [
        {
          value: "km3",
          label: this.$t('cubicKilo'),
        },
        {
          value: "m3",
          label: this.$t('cubicMeter'),
        },
        {
          value: "cm3",
          label: this.$t('cubicCentimeter'),
        },
        {
          value: "mm3",
          label: this.$t('cubicMilimeter'),
        },
      ],
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: false,
          to: { name: "eudrDashboard" },
        },
        {
          text: this.$t("deforestation.settings"),
          link: true,
          exact: true,
          disabled: false,
          to: { name: "AssessmentList" },
        },
      ],
    };
  },
  computed: {
    dynamicExpireError() {
      const value = Number(this.dynamicExpire.time); // Convert to a number
      if (value === null || value === '') return this.$t('fieldRequired');
      if (value <= 0) return this.$t('valueMustBeGreaterThanZero');
      if (value > 12) return this.$t('valueExceedsLimit');
      if (!Number.isInteger(value)) return this.$t('valueMustBeInteger');
      return '';
  },
    isOperator() {
      return ProfileService.checkRole("operator");
    },
    filteredDeclaration() {
      if (!this.declarationStatements.filterStatementByCountry) {
        return this.declarations;
      }
      return this.declarations.filter(
        (d) => d.country === this.declarationStatements.filterStatementByCountry
      );
    },
    supplierOwner() {
      return ProfileService.checkRole("supplier_owner");
    },

    operatorOwner() {
      return ProfileService.checkRole("operator_owner");
    },
  },
  created() {
    this.authUser = this.$store.state.auth.user
  },
  mounted() {
    this.org_id = this.authUser.user_organization.id;
    this.getCountry();
    this.getSettings();
  },
  methods: {
    getUserType() {
      if (this.isOperator || this.isSupplier) {
        return  this.eudrSetting.user_type;
      } else if (this.operatorOwner) {
        return 'operator';
      } else if (this.supplierOwner) {
        return'supplier';
      }
    },
    async setData() {
      this.radius = {
        unit: this.eudrSetting.radius_unit,
        maxLimit: this.eudrSetting.radius_max_limit,
        isDefault: this.eudrSetting.isDefault,
      };
      this.prodMassUnit = this.eudrSetting.product_mass_unit;
      this.volumeUnit = this.eudrSetting.volume_unit;
      this.userType = this.getUserType(); 
      this.eudrKeys = {
        apiKey: this.eudrSetting.eudr_api_key,
        apiSec: this.eudrSetting.eudr_api_secret,
      };
      this.riskLevel = {
        very_high: this.eudrSetting.riskLevel.very_high,
        high: this.eudrSetting.riskLevel.high,
        medium: this.eudrSetting.riskLevel.medium,
        low: this.eudrSetting.riskLevel.low,
        very_low: this.eudrSetting.riskLevel.very_low,
        zero: this.eudrSetting.riskLevel.zero,
      };
      this.riskToleranceLevels = {
        very_high: this.eudrSetting.riskToleranceLevels.very_high,
        high: this.eudrSetting.riskToleranceLevels.high,
        medium: this.eudrSetting.riskToleranceLevels.medium,
        low: this.eudrSetting.riskToleranceLevels.low,
        very_low: this.eudrSetting.riskToleranceLevels.very_low,
      };
      this.dynamicExpire = {
        period: this.eudrSetting.dynamicExpiryTimePeriod,
        time: this.eudrSetting.dynamicExpiryTime,
        renewalProcess: this.eudrSetting.toggleAutoRenewWhenReportAdded,
      };
      this.declarationStatements.filterStatementByCountry = this.eudrSetting.declarationStatementCountry || "";
      
      // Set public settings
      this.public_geofence_download = this.eudrSetting.public_geofence_download || false;
      this.public_deforestation_summary = this.eudrSetting.public_deforestation_summary || false;
      
      if (this.eudrSetting.declarations && this.eudrSetting.declarations.length) {
        this.declarations = this.eudrSetting.declarations;
      } else {
        this.declarationStatements.filterStatementByCountry = "";
        this.declarations = [
          {
            title: "",
            country: "",
            description: "",
            isEnabled: false,
          },
        ];
      }
    },
    async getSettings() {
      try {
        this.startLoading();
        const { data } = await DeforestationService.getEudrSettings();
        let result = data.eudrSetting;
        this.eudrSetting = result;
        this.setData();
        this.stopLoading();
      } catch (err) {
        this.stopLoading();
      }
    },
    async saveEudrSettings() {
      if (!this.$refs.settings.validate()) return;
      this.startLoading();
      try {
        let finalPayload = {
          radius_unit: this.radius.unit,
          radius_max_limit: +this.radius.maxLimit,
          isDefault: this.radius.isDefault,
          product_mass_unit: this.prodMassUnit,
          volume_unit: this.volumeUnit,
          user_type: this.userType,
          eudr_api_key: this.eudrKeys.apiKey,
          eudr_api_secret: this.eudrKeys.apiSec,
          risk_level: this.riskLevel,
          riskToleranceLevels: {
            very_high: parseFloat(this.riskToleranceLevels.very_high),
            high: parseFloat(this.riskToleranceLevels.high),
            medium: parseFloat(this.riskToleranceLevels.medium),
            low: parseFloat(this.riskToleranceLevels.low),
            very_low: parseFloat(this.riskToleranceLevels.very_low),
          },
          dynamicExpiryTime: +this.dynamicExpire.time,
          dynamicExpiryTimePeriod: this.dynamicExpire.period,
          toggleAutoRenewWhenReportAdded: this.dynamicExpire.renewalProcess,
          declarationStatementCountry: "", // no longer required in BE
          declarations: this.declarations,
          public_geofence_download: this.public_geofence_download,
          public_deforestation_summary: this.public_deforestation_summary,
        };
        const res = await DeforestationService.createEudrSettings(finalPayload);
        if (res && res.data && res.data.createEudrSetting) {
          this.$notify({
            type: 'success',
            title: "Settings saved successfully."
          })
        }
        this.stopLoading();
      } catch (err) {
        this.$notify({
          type: 'error',
          title: err.message || "this.$t('somethingWentWrong')."
        })
        console.error(err);
        this.stopLoading();
      } finally {
        this.getSettings();
      }
    },
    addStatements() {
      this.declarations.push({
        title: "",
        country: "",
        description: "",
        isEnabled: false,
      });
    },
    removedStatement(key) {
      this.declarations.splice(key, 1)
    },
    getCountry() {
      this.countryOptions = getCountries();
    },
    onCancel() {
      this.setData();
    },
  },
  mixins: [loadingMixin],
};
</script>

<style scoped>
.error-message {
  color: red;
  font-size: 14px;
  padding-left: 14px;
  margin-top: -5px;
}
</style>