<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-4" v-if="getModulePermittedActions.put">
        <h2>{{ this.$t("setting.profileAuthSetting") }}</h2>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          dark
          small
          class="mr-3"
          @click="editSettings = true"
        >
          {{ this.$t("profileSetting.changeSettings") }}
        </v-btn>
      </div>
      <v-card elevation="0" class="px-5 pb-10">
        <v-card-title>
          <span class="text-h5 font-weight-bold">{{
            this.$t("profileSetting.loginLogoutSettings")
          }}</span>
        </v-card-title>
        <v-card-text>
          <v-row class="mt-5" width="100%">
            <!-- <v-col cols="4">
                            <v-card height="150" class="pa-2 green2 elevation-0">
                                <v-list class="green2">
                                    <v-list-item three-line>
                                        <v-list-item-content>
                                        <v-list-item-subtitle>{{ this.$t('profileSetting.autoLogout') }}
                                            <v-tooltip top color="black" max-width="350">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-icon
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    >
                                                    mdi-information-outline
                                                    </v-icon>
                                                </template>
                                                <span>{{ this.$t('profileSetting.autoLogout') }}</span>
                                            </v-tooltip>
                                        </v-list-item-subtitle>
                                        <v-list-item-title class="text-h6 mt-2">
                                            {{ `${settings.auto_log_off_value} ${settings.auto_log_off_value_type}` }}
                                        </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-card>
                        </v-col> -->
            <v-col lg="4" md="6" sm="6" xs="12">
              <v-card min-height="150" class="pa-2 green2 elevation-0">
                <v-list class="green2">
                  <v-list-item three-line>
                    <v-list-item-content>
                      <v-list-item-subtitle>
                        {{ this.$t("profileSetting.unsuccAtmp") }}
                        <v-tooltip top color="black" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                              mdi-information-outline
                            </v-icon>
                          </template>
                          <span>{{
                            this.$t("profileSetting.unsuccAtmp")
                          }}</span>
                        </v-tooltip>
                      </v-list-item-subtitle>
                      <v-list-item-title v-if="settings.unsuccessful_login_attempts_value" class="text-h6 mt-2">
                        {{
                          `${
                            settings.unsuccessful_login_attempts_value
                              ? settings.unsuccessful_login_attempts_value
                              : ""
                          } ${
                            settings.unsuccessful_login_attempts_value_type
                              ? $t(`profileSetting.${settings.unsuccessful_login_attempts_value_type}`)
                              : ""
                          }`
                        }}
                      </v-list-item-title>
                      <v-list-item-title v-else class="text-h6 mt-2">
                        {{
                          `${
                             ""
                          } ${
                             ""
                          }`
                        }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            <v-col lg="4" md="6" sm="6" xs="12">
              <v-card min-height="150" class="pa-2 green2 elevation-0">
                <v-list class="green2">
                  <v-list-item three-line>
                    <v-list-item-content>
                      <v-list-item-subtitle
                        >{{ this.$t("profileSetting.unsuccLoginLock") }}
                        <v-tooltip top color="black" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                              mdi-information-outline
                            </v-icon>
                          </template>
                          <span>{{
                            this.$t("profileSetting.unsuccLoginLock")
                          }}</span>
                        </v-tooltip>
                      </v-list-item-subtitle>
                      <v-list-item-title class="text-h6 mt-2">
                        {{
                          `${
                            settings.unsuccessful_login_lockout_value
                              ? settings.unsuccessful_login_lockout_value
                              : ""
                          } ${
                            settings.unsuccessful_login_lockout_value_type
                              ? $t(`profileSetting.${settings.unsuccessful_login_lockout_value_type}`)
                              : ""
                          }`
                        }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-card elevation="0" class="px-5 mt-5 pb-10">
        <v-card-title>
          <span class="text-h5 font-weight-bold">
            {{ this.$t("profileSetting.pswCrisetup") }}</span
          >
        </v-card-title>
        <v-card-text>
          <v-row class="mt-5" width="100%">
            <v-col lg="12" md="12" sm="12" xs="12">
              <v-card min-height="150" class="pa-2 green2 elevation-0">
                <v-list class="green2">
                  <v-list-item three-line>
                    <v-list-item-content>
                      <v-list-item-subtitle
                        >{{ this.$t("profileSetting.pswLength") }}
                        <v-tooltip top color="black" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                              mdi-information-outline
                            </v-icon>
                          </template>
                          <span>{{ $t('setting.minimumPwdLen') }}</span>
                        </v-tooltip>
                      </v-list-item-subtitle>
                      <v-list-item-title class="text-h6 mt-2">
                        {{
                          `${
                            settings.password_length
                              ? settings.password_length
                              : ""
                          }`
                        }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            <v-col lg="4" md="6" sm="6" xs="12">
              <v-card min-height="150" class="pa-2 green2 elevation-0">
                <v-list class="green2">
                  <v-list-item three-line>
                    <v-list-item-content>
                      <v-list-item-subtitle
                        >{{ this.$t("profileSetting.noOfUniquePsw") }}
                        <v-tooltip top color="black" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                              mdi-information-outline
                            </v-icon>
                          </template>
                          <span>{{
                            this.$t("profileSetting.noOfUniquePsw")
                          }}</span>
                        </v-tooltip>
                      </v-list-item-subtitle>
                      <v-list-item-title class="text-h6 mt-2">
                        {{
                          `${
                            settings.number_of_unique_passwords
                              ? settings.number_of_unique_passwords
                              : ""
                          }`
                        }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            <v-col lg="4" md="6" sm="6" xs="12">
              <v-card min-height="150" class="pa-2 green2 elevation-0">
                <v-list class="green2">
                  <v-list-item three-line>
                    <v-list-item-content>
                      <v-list-item-subtitle>
                        {{ this.$t("profileSetting.maxPswAge") }}
                        <v-tooltip top color="black" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                              mdi-information-outline
                            </v-icon>
                          </template>
                          <span>{{ this.$t("profileSetting.maxPswAge") }}</span>
                        </v-tooltip>
                      </v-list-item-subtitle>
                      <v-list-item-title class="text-h6 mt-2">
                        {{
                          `${
                            settings.maximum_password_age_value
                              ? settings.maximum_password_age_value
                              : ""
                          } ${
                            settings.maximum_password_age_value_type
                              ? $t(`profileSetting.${settings.maximum_password_age_value_type}`)
                              : ""
                          }`
                        }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            <v-col lg="4" md="6" sm="6" xs="12">
              <v-card min-height="150" class="pa-2 = elevation-0">
                <v-list class="green2">
                  <v-list-item three-line>
                    <v-list-item-content>
                      <v-list-item-subtitle>
                        {{ this.$t("profileSetting.AccRangeOfchars") }}
                        <v-tooltip top color="black" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                              mdi-information-outline
                            </v-icon>
                          </template>
                          <span
                            >{{
                              this.$t("profileSetting.AccRangeOfchars")
                            }}.</span
                          >
                        </v-tooltip>
                      </v-list-item-subtitle>
                      <v-list-item-title
                        class="subtitle-2 font-weight-bold mt-2 text-wrap"
                      >
                        {{
                          aceptablePasswordCriteria
                            ? aceptablePasswordCriteria
                            : ""
                        }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-title>
          <span class="text-h5 font-weight-bold">
            {{ this.$t("profileSetting.cropsHarvestAlert") }}</span
          >
        </v-card-title>
        <v-card-text>
          <v-row v-if="alerts.length > 0" class="mt-5" width="100%">
            <v-col v-for="(alert, i) in alerts" :key="i" lg="4" md="4" sm="6" xs="12">
              <v-card min-height="150" class="pa-2 green2 elevation-0">
                <v-list class="green2">
                   <v-list-item three-line>
                    <v-list-item-content>
                      <v-list-item-subtitle class="text-h6">
                        {{ $t("profileSetting.alert") }} {{ i + 1 }}
                      </v-list-item-subtitle>
                      <v-list-item-title  class="">
                        <b>{{ $t("country") }} :</b> {{ alert.country }}
                      </v-list-item-title>
                      <v-list-item-title  class="">
                        <b>{{ $t("profileSetting.crop")}} :</b> {{ alert.crop ? alert.crop.name: ''  }}
                      </v-list-item-title>
                      <v-list-item-title class="text-wrap">
                        <b>{{ $t("profileSetting.maxAllowed")}} :</b> {{ alert.maxAllowed }} {{ alert.unit ? alert.unit.abbvr : '' }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>

      </v-card>
      <v-card elevation="0" class="px-5 pb-10">
        <v-card-title>
          <span class="text-h5 font-weight-bold">{{
            this.$t("profileSetting.organization")
          }}</span>
        </v-card-title>
        <v-card-text>
          <v-row class="mt-5" width="100%">
           
            <v-col lg="4" md="6" sm="6" xs="12">
              <v-card min-height="150" class="pa-2 green2 elevation-0">
                <v-list class="green2">
                  <v-list-item three-line>
                    <v-list-item-content>
                      <v-list-item-subtitle>
                        {{ this.$t("profileSetting.organizationLogo") }}
                        <v-tooltip top color="black" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                              mdi-information-outline
                            </v-icon>
                          </template>
                          <span>{{
                            this.$t("profileSetting.organizationLogo")
                          }}</span>
                        </v-tooltip>
                      </v-list-item-subtitle>
                      <v-list-item-title v-if="settings.unsuccessful_login_attempts_value" class="text-h6 mt-2">
                        <img width="100%" :src="organization.logo" />
                      </v-list-item-title>
                      <v-list-item-title v-else class="text-h6 mt-2">
                        {{
                          `${
                             ""
                          } ${
                             ""
                          }`
                        }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            <v-col lg="4" md="6" sm="6" xs="12">
              <v-card min-height="150" class="pa-2 green2 elevation-0">
                <v-list class="green2">
                  <v-list-item three-line>
                    <v-list-item-content>
                      <v-list-item-subtitle>
                        {{ this.$t("profileSetting.organizationSplash") }}
                        <v-tooltip top color="black" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                              mdi-information-outline
                            </v-icon>
                          </template>
                          <span>{{
                            this.$t("profileSetting.organizationSplash")
                          }}</span>
                        </v-tooltip>
                      </v-list-item-subtitle>
                      <v-list-item-title v-if="settings.unsuccessful_login_attempts_value" class="text-h6 mt-2">
                        <img width="100%" :src="organization.splashScreen" />
                      </v-list-item-title>
                      <v-list-item-title v-else class="text-h6 mt-2">
                        {{
                          `${
                             ""
                          } ${
                             ""
                          }`
                        }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            
          </v-row>
        </v-card-text>
      </v-card>
      <div class="d-flex mt-10 mb-4" v-if="getModulePermittedActions.put">
        <h2>{{ this.$t("setting.globalSetting") }}</h2>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          dark
          small
          class="mr-3"
          @click="editGlobalSettings = true"
        >
          {{ this.$t("setting.changeGlobalSetting") }}
        </v-btn>
      </div>
      <v-card elevation="0" class="px-5 pb-10">
        <v-card-title>
          <span class="text-h5 font-weight-bold">{{
            this.$t("setting.generalSetting")
          }}</span>
        </v-card-title>
        <v-card-text>
          <v-row class="mt-5" width="100%">
            <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <v-card min-height="150" class="pa-2 green2 elevation-0">
                <v-list class="green2">
                  <v-list-item three-line>
                    <v-list-item-content>
                      <v-list-item-subtitle
                        >{{ this.$t("setting.currency") }}
                        <v-tooltip top color="black" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                              mdi-information-outline
                            </v-icon>
                          </template>
                          <span>{{ this.$t("setting.currency") }}</span>
                        </v-tooltip>
                      </v-list-item-subtitle>
                      <v-list-item-title class="text-h6 mt-2">
                        {{
                          globalSettings.currency
                            ? globalSettings.currency.symbol
                            : ""
                        }}
                        {{
                          globalSettings.currency
                            ? "(" + globalSettings.currency.abbreviation + ")"
                            : ""
                        }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </div>
            <v-col class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <v-card min-height="150" class="pa-2 green2 elevation-0">
                <v-list class="green2">
                  <v-list-item three-line>
                    <v-list-item-content>
                      <v-list-item-subtitle>
                        {{ this.$t("setting.codeActivationTime") }}
                        <v-tooltip top color="black" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                              mdi-information-outline
                            </v-icon>
                          </template>
                          <span>{{
                            this.$t("setting.codeActivationTime")
                          }}</span>
                        </v-tooltip>
                      </v-list-item-subtitle>
                      <v-list-item-title class="text-h6 mt-2">
                        {{ globalSettings.codeActivationTimeQty }}
                        {{ globalSettings.codeActivationTimeUom }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            <v-col class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <v-card min-height="150" class="pa-2 green2 elevation-0">
                <v-list class="green2">
                  <v-list-item three-line>
                    <v-list-item-content>
                      <v-list-item-subtitle>
                        {{ this.$t("setting.areaUnit") }}
                        <v-tooltip top color="black" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                              mdi-information-outline
                            </v-icon>
                          </template>
                          <span>{{
                            this.$t("setting.areaUnit")
                          }}</span>
                        </v-tooltip>
                      </v-list-item-subtitle>
                      <v-list-item-title class="text-h6 mt-2">
                        {{ globalSettings.areaUnit ? globalSettings.areaUnit.name : '' }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            <v-col class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <v-card min-height="150" class="pa-2 green2 elevation-0">
                <v-list class="green2">
                  <v-list-item three-line>
                    <v-list-item-content>
                      <v-list-item-subtitle>
                        {{ this.$t("setting.weightUnit") }}
                        <v-tooltip top color="black" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                              mdi-information-outline
                            </v-icon>
                          </template>
                          <span>{{
                            this.$t("setting.weightUnit")
                          }}</span>
                        </v-tooltip>
                      </v-list-item-subtitle>
                      <v-list-item-title class="text-h6 mt-2">
                        {{ globalSettings.weightUnit ? globalSettings.weightUnit.name : '' }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
    <EditSettings
      v-if="editSettings"
      @settingsUpdated="settingsUpdated"
      @closeEditSettings="closeEditSettings"
      :settings="settings"
      :harvestAlertSettings="harvestAlertSettings"
      :dialogU="editSettings"
      :weightUnits="weightUnits"
      :alert="alerts"
      :cropList="cropList"
    />
    <EditGlobalSettings
      @closeEditSettings="closeEditGlobalSettings"
      @settingsUpdated="settingsUpdated"
      :currencies="currencies"
      :areaUnits="areaUnits"
      :weightUnits="weightUnits"
      :dialogU="editGlobalSettings"
      :settings="globalSettings"
      v-if="editGlobalSettings"
    />
  </div>
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import EditSettings from "./EditSettings.vue";
import EditGlobalSettings from "./EditGlobalSettings.vue";
import GeneralService from "@/_services/GeneralService";
import PermissionsService from "@/_services/PermissionsService";
import OrganizationService from "../../_services/OrganizationService";

export default {
  mounted() {
    document.title = this.$t("profileSetting.profileAuthSettings");
    const fetchData = async () => {
      await this.getSettings();
      await this.getAcceptablePassword();
      await this.getOrganization();
    };
    fetchData();
    this.fetchCurrencies();
    this.fetchAreaUnits();
    this.fetchWeightUnits();
    this.fetchYieldUnitList();
    this.fetchHarvestCropList();
    this.fetchHarvestAlert();
  },
  components: {
    EditSettings,
    EditGlobalSettings,
  },
  data() {
    return {
      harvestAlertSettings: {},
      organization:{},
      breadcrumbs: [
        {
          disabled: true,
          text: this.$t("dashboard"),
          to: "/",
        },
        {
          disabled: true,
          text: this.$t("profileSetting.profileAuthSettings"),
          to: "breadcrumbs_link_1",
        },
      ],
      currencies: [],
      areaUnits: [],
      weightUnits: [],
      yieldUnits: [],
      cropList: [],
      alerts: [],
      editGlobalSettings: false,
      editSettings: false,
      globalSettings: {},
      settings: {
        auto_log_off_value: null,
        auto_log_off_value_type: "mins",
        unsuccessful_login_attempts_value: 10,
        unsuccessful_login_attempts_value_type: "per_hour",
        unsuccessful_login_lockout_value: 15,
        unsuccessful_login_lockout_value_type: "mins",
        password_length: 8,
        number_of_unique_passwords: 5,
        maximum_password_age_value: 10000,
        maximum_password_age_value_type: "days",
        password_acceptable_characters: {
            numbers: false,
            lower_case: false,
            upper_case: false,
            unique_symbols: false,
            special_characters: false
        },
        is_splash_hide:false,
        is_logo_hide:false
      },
      acceptablePasswords: {},
      aceptablePasswordCriteria: "",
    };
  },
  methods: {
    // allowedPassword() {
    //   const set = this.settings.password_acceptable_characters;
    //   // console.log('sss', set)
    //   let str = ``;
    //   if (set && set.upper_case == true)
    //     str = `${str}${this.$t("profileSetting.upperCase")}`;
    //   if (set && set.lower_case == true)
    //     str = `${str}, ${this.$t("profileSetting.lowerCase")}`;
    //   // if(set && set.unique_symbols == true)
    //   //     str = `${str}, Symbols`
    //   if (set && set.special_characters == true)
    //     str = `${str}, ${this.$t("profileSetting.specialChars")}`;
    //   if (set && set.numbers == true)
    //     str = `${str}, ${this.$t("profileSetting.numbers")}`;
    //   return str;
    // },

    async getAcceptablePassword() {
      const settings = await PermissionsService.getAppSettings();
      if(settings.data){
        this.acceptablePasswords = settings.data.profileAuthenticationSettings;
        const set = this.acceptablePasswords.password_acceptable_characters;
        let str = ``;
        if (set && set.upper_case == true)
          str = `${str}${this.$t("profileSetting.upperCase")}`;
        if (set && set.lower_case == true)
          str = `${str}, ${this.$t("profileSetting.lowerCase")}`;
        // if(set && set.unique_symbols == true)
        //     str = `${str}, Symbols`
        if (set && set.special_characters == true)
          str = `${str}, ${this.$t("profileSetting.specialChars")}`;
        if (set && set.numbers == true)
          str = `${str}, ${this.$t("profileSetting.numbers")}`;
        this.aceptablePasswordCriteria = str;
        // return str;
                
      }
    },

    closeEditGlobalSettings() {
      this.editGlobalSettings = false;
    },
    closeEditSettings() {
      this.editSettings = false;
    },
    async getSettings() {
      this.startLoading();
      const globalSettings = await PermissionsService.getGlobalSettings();
      const settings = await PermissionsService.getAppSettings();
      if(settings.data){
      this.settings = settings.data.profileAuthenticationSettings;
      this.harvestAlertSettings = settings.data.harvestAlertSettings;
      }
      if(globalSettings.data.globalSetting){
        this.globalSettings = globalSettings.data.globalSetting;
      }
      // console.log('stt',this.settings)
      this.stopLoading();
    },
    fetchCurrencies() {
      GeneralService.getCurrencies()
        .then((response) => {
          this.currencies = response.data;
        })
        .catch((e) => {
          console.log("error while fetching currencies", e);
        });
    },
    fetchAreaUnits() {
      GeneralService.getAreaUnitList()
        .then((response) => {
          this.areaUnits = response.data;
        })
        .catch((e) => {
          console.log("error while fetching area units", e);
        });
    },
    fetchWeightUnits() {
      GeneralService.getWeightUnitList()
        .then((response) => {
          this.weightUnits = response.data;
        })
        .catch((e) => {
          console.log("error while fetching weight units", e);
        });
    },
    fetchYieldUnitList() {
      GeneralService.getYieldUnitList()
        .then((response) => {
          this.yieldUnits = response.data;
        })
        .catch((e) => {
          console.log("error while fetching yield units", e);
        });
    },
    fetchHarvestCropList() {
      GeneralService.getHarvestCropList()
      .then((response) => {
        const { data } = response;
        this.cropList = data.rows
      })
      .catch((e) => {
          console.log("error while fetching crops list", e);
      })
    },
    fetchHarvestAlert() {
      GeneralService.getHarvestAlert()
      .then((response) => {
        const { data } = response;
        this.alerts = data
      })
      .catch((e) => {
          console.log("error while fetching alert list", e);
      })
    },
    async settingsUpdated(res) {
      if (res.success) {
        await Promise.all([
          await this.getSettings(),
          await this.getOrganization(),
          await this.getAcceptablePassword(),
          await this.fetchHarvestAlert(),
        ])
        this.$notify({
          title: this.$t("profileSetting.settingsUpdated"),
          type: "success",
        });
      } else {
        this.$notify({
          title: this.$t("profileSetting.settingsNotUpdated"),
          type: "error",
        });
      }
    },
    async getOrganization() {
        let {data} = await OrganizationService.getorganization();
        this.organization = data?data.data:{};
        this.settings.is_logo_hide = data.data.is_logo_hide
        this.settings.is_splash_hide = data.data.is_splash_hide
    },
  },
  mixins: [loadingMixin, getPermittedActions],
};
</script>
