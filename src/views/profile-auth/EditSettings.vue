<template>
  <v-container>
    <template>
      <div class="text-center">
        <v-dialog v-model="dialog" width="800" @click:outside="closeModal">
          <v-card rounded="0">
            <v-toolbar color="primary" class="white--text" flat :elevation="0">
              <v-toolbar-title class="font-weight-bold">{{
                $t("profileSetting.profileAuthSettings")
              }}</v-toolbar-titLe>

              <v-spacer></v-spacer>

              <v-btn icon class="white--text" @click="closeModal">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text class="pt-5">
              <v-form
                ref="settingsEdit"
                v-model="valid"
                lazy-validation
                autocomplete="off"
              >
                <v-card flat :elevation="0">
                  <v-card-title class="primary--text pa-0 pb-2">
                    {{ $t("profileSetting.loginLogoutSettings") }}
                  </v-card-title>
                  <v-card-text>
                    <v-row width="100%">
                    <!-- <v-col cols="6">
                                        <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">{{ this.$t('profileSetting.autoLogout') }}</label>
                                        <v-row no-gutters class="d-flex">
                                            <v-col cols="8">
                                                <v-text-field
                                                    v-model="editedSettings.auto_log_off_value"
                                                    type="number"
                                                    placeholder="1"
                                                    outlined
                                                    dense
                                                    :error-messages="errors.name"
                                                    class="rounded-r-0"
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="4">
                                                <v-select
                                                    :items="[{id: 'mins', text: 'MIN'}, {id: 'hours', text: 'HOURS'}]"
                                                    item-text="text"
                                                    item-value="id"
                                                    dense
                                                    outlined
                                                    class="bg rounded-l-0 white-text"
                                                    v-model="editedSettings.auto_log_off_value_type"
                                                ></v-select>
                                            </v-col>
                                        </v-row>
                                    </v-col> -->
                    <v-col lg="6" md="6" sm="6" xs="12">
                      <label
                        for="name"
                        class="text-subtitle-1 font-weight-bold"
                        >{{ $t("profileSetting.unsuccAtmp") }}</label
                      >
                      <v-row no-gutters class="d-flex">
                        <v-col lg="8" md="8" sm="8" xs="6">
                          <v-text-field
                            v-model="
                              editedSettings.unsuccessful_login_attempts_value
                            "
                            type="number"
                            placeholder="1"
                            outlined
                            dense
                            :error-messages="errors.name"
                            class="rounded-r-0"
                          ></v-text-field>
                        </v-col>
                        <v-col lg="4" md="4" sm="4" xs="6">
                          <v-select
                            :items="[
                              { id: 'per_hour', text: $t('profileSetting.per_hour') },
                              { id: 'per_day', text: $t('profileSetting.per_day') },
                              { id: 'customized', text: $t('profileSetting.customized') },
                            ]"
                            item-text="text"
                            item-value="id"
                            dense
                            outlined
                            class="bg rounded-l-0 white--text"
                            v-model="
                              editedSettings.unsuccessful_login_attempts_value_type
                            "
                            hide-details
                          ></v-select>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col lg="6" md="6" sm="6" xs="12">
                      <label
                        for="name"
                        class="text-subtitle-1 font-weight-bold"
                        >{{ $t("profileSetting.unsuccLoginLock") }}</label
                      >
                      <v-row no-gutters class="d-flex">
                        <v-col lg="6" md="6" sm="6" xs="12">
                          <v-text-field
                            v-model="
                              editedSettings.unsuccessful_login_lockout_value
                            "
                            type="number"
                            placeholder="1"
                            outlined
                            dense
                            :error-messages="errors.name"
                            class="rounded-r-0"
                          ></v-text-field>
                        </v-col>
                        <v-col lg="6" md="6" sm="6" xs="12">
                          <v-select
                            :items="[
                              { id: 'mins', text: $t('profileSetting.mins') },
                              { id: 'hours', text: $t('profileSetting.hours') },
                              { id: 'days', text: $t('profileSetting.days') },
                            ]"
                            item-text="text"
                            item-value="id"
                            dense
                            outlined
                            class="bg"
                            v-model="
                              editedSettings.unsuccessful_login_lockout_value_type
                            "
                            hide-details
                          ></v-select>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  </v-card-text>
                </v-card>
                <v-card flat :elevation="0">
                  <v-card-title class="primary--text pa-0 pb-2">
                    {{ $t('profileSetting.defaultOtpOrganization') }}
                  </v-card-title>
                  <v-card-text>
                    <v-row style="width:100%">
                      <v-col lg="12" md="12" sm="12" xs="12" class="mt-3">
                        <label
                          for="name"
                          class="text-subtitle-1 font-weight-bold"
                          >OTP</label
                        >
                        <v-row no-gutters class="d-flex">
                          <v-col lg="7" md="7" sm="7" xs="6">
                            <v-text-field
                              v-model="custom_otp"
                              type="number"
                              :placeholder="$t('setting.otpPlaceholder')"
                              outlined
                              dense
                              readonly
                              class="rounded-r-0"
                            ></v-text-field>
                          </v-col>
                          <v-col lg="5" md="5" sm="5" xs="6">
                            <v-btn @click="generateOTP" color="primary" height="40">{{$t("setting.generateOTP")}}</v-btn>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card> 
                <v-card flat :elevation="0">
                  <v-card-title class="d-flex align-center justify-space-between primary--text pa-0 pb-2">
                    <div>{{ $t("profileSetting.cropsHarvestAlert") }}</div>
                    <v-btn x-small fab color="primary" elevation="0" @click="addAlert">
                      <v-icon size="24">mdi-plus</v-icon>
                    </v-btn>
                  </v-card-title>
                  <v-card v-for="(al, i) in alertArray" :key="i" outlined class="pa-4 mb-2">
                    <v-row style="width:100%">
                      <v-col lg="6" md="6" sm="6" xs="12" class="">
                        <label
                          for="name"
                          class="text-subtitle-1 font-weight-bold"
                          >{{ $t("profileSetting.selectCountry") }}</label
                        >
                        <v-select
                          v-model="al.country"
                          :items="countryOptions"
                          @change="(v) => updateCrops(v, i)"
                          item-text="country"
                          item-value="country"
                          :no-data-text="$t('profileSetting.selectCountryError')"
                          :rules="[
                            v => !!v || $t('profileSetting.selectCountryError')
                          ]"
                          clearable
                          dense
                          outlined
                          
                        >
                        <template v-slot:selection="{ item }">
                          <span>{{ item.country }}</span>
                        </template>
                        </v-select>
                      </v-col>
                      <v-col lg="6" md="6" sm="6" xs="12" class="">
                        <label
                          for="name"
                          class="text-subtitle-1 font-weight-bold"
                          >{{ $t("profileSetting.selectCrop") }}</label
                        >
                        <v-select
                          :disabled="!al.country"
                          v-model="al.cropId"
                          :items="cropOptions[i]"
                          item-text="cropName"
                          item-value="id"
                          :no-data-text="$t('profileSetting.selectCropError')"
                          dense
                          :rules="[
                            v => (al.cropId && !!v) || $t('profileSetting.selectCropError')
                          ]"
                          outlined
                        >
                        <template v-slot:selection="{ item }">
                          <span>{{ item.cropName }}</span>
                        </template>
                        </v-select>
                      </v-col>
                    </v-row>
                    <v-row style="width:100%">
                      <v-col lg="12" md="12" sm="12" xs="12" class="">
                        <label
                          for="name"
                          class="text-subtitle-1 font-weight-bold"
                          >{{ $t("profileSetting.maxProduction") }}</label
                        >
                        <v-row no-gutters class="d-flex">
                          <v-col lg="7" md="7" sm="7" xs="6">
                            <v-text-field
                              v-model="al.maxAllowed"
                              type="number"
                              placeholder="1000"
                              outlined
                              dense
                              class="rounded-r-0"
                              :rules="[
                            v => (+al.maxAllowed >= 0 && !!v) || $t('profileSetting.maxProductionError')
                          ]"
                            ></v-text-field>
                          </v-col>
                          <v-col lg="5" md="5" sm="5" xs="6">
                            <v-select
                              :items="getYieldUnits"
                              item-text="text"
                              item-value="value"
                              dense
                              outlined
                              clearable
                              :rules="[
                                v => (+al.maxAllowed > 0 && !!v) || $t('profileSetting.unitError'),
                              ]"
                              class="ag rounded-l-0 white--text"
                              v-model="al.unitId"
                              hide-details="auto"
                            ></v-select>
                          </v-col>
                        </v-row>
                        <label
                          for="name"
                          class="text-subtitle-1 font-weight-bold"
                          >{{ $t("profileSetting.alertFor") }}</label
                        >
                        <div class="row align-center justify-space-between ml-4">
                          <v-checkbox
                            v-model="al.alertAdmin"
                            color="primary"
                            class="mr-4"
                            :label="$t('profileSetting.alertAdmin')"
                          ></v-checkbox>
                          <v-checkbox
                            v-model="al.alertFarmer"
                            color="primary"
                            :label="$t('profileSetting.alertFarmer')"
                          ></v-checkbox>
                          <div>
                            <v-btn :loading="removingAlert" small outlined color="error" @click="removeAlert(i)" class="mr-2">{{$t("remove")}}</v-btn>
                            <v-btn :disabled="disableSave(al)" :loading="savingAlert" small elevation="0" color="primary" @click="saveAlert(i)">{{ $t("save") }}</v-btn>
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-card> 
                <v-card flat :elevation="0" class="mt-10">
                  <v-card-title class="primary--text pa-0 pb-2">
                    {{ $t("profileSetting.pswCrisetup") }}
                  </v-card-title>
                  <v-card-text>
                    <v-row style="width:100%">
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                      <label
                        for="name"
                        class="text-subtitle-1 font-weight-bold"
                        >{{ $t("profileSetting.pswLength") }}</label
                      >
                      <v-text-field
                        v-model="editedSettings.password_length"
                        max="15"
                        min="6"
                        step="1"
                        type="number"
                        placeholder="1"
                        outlined
                        dense
                        :error-messages="errors.name"
                      ></v-text-field>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                      <label
                        for="name"
                        class="text-subtitle-1 font-weight-bold"
                        >{{ $t("profileSetting.noOfUniquePsw") }}</label
                      >
                      <v-text-field
                        v-model="editedSettings.number_of_unique_passwords"
                        type="number"
                        placeholder="1"
                        outlined
                        dense
                        :error-messages="errors.name"
                      ></v-text-field>
                    </div>
                    <v-col lg="6" md="6" sm="6" xs="12" class="mt-n5">
                      <label
                        for="name"
                        class="text-subtitle-1 font-weight-bold"
                        >{{ $t("profileSetting.maxPswAge") }}</label
                      >
                      <v-row no-gutters class="d-flex">
                        <v-col lg="8" md="8" sm="8" xs="6">
                          <v-text-field
                            v-model="editedSettings.maximum_password_age_value"
                            type="number"
                            placeholder="1"
                            outlined
                            dense
                            :error-messages="errors.name"
                            class="rounded-r-0"
                          ></v-text-field>
                        </v-col>
                        <v-col lg="4" md="4" sm="4" xs="6">
                          <v-select
                            :items="[
                              { id: 'days', text: $t('profileSetting.days') },
                              { id: 'weeks', text: $t('profileSetting.weeks') },
                              { id: 'months', text: $t('profileSetting.months') },
                            ]"
                            item-text="text"
                            item-value="id"
                            dense
                            outlined
                            class="bg rounded-l-0 white--text"
                            v-model="
                              editedSettings.maximum_password_age_value_type
                            "
                            hide-details
                          ></v-select>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" class="mt-n5">
                      <label
                        for="name"
                        class="text-subtitle-1 font-weight-bold"
                        >{{ $t("profileSetting.AccRangeOfchars") }}</label
                      >
                      <v-row outline>
                        <v-col v-if="editedSettings.password_acceptable_characters" cols="12" sm="4" md="">
                          <v-checkbox
                            :label="`${$t('profileSetting.upperCase')}: A-Z`"
                            color="primary"
                            v-model="editedSettings.password_acceptable_characters.upper_case"
                            hide-details
                          ></v-checkbox>
                        </v-col>
                        <v-col v-else cols="12" sm="4" md="">
                          <v-checkbox
                            :label="`${$t('profileSetting.upperCase')}: A-Z`"
                            color="primary"
                            hide-details
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="12" sm="4" md="4" v-if="editedSettings.password_acceptable_characters">
                          <v-checkbox
                            :label="`${$t('profileSetting.lowerCase')}: a-z`"
                            color="primary"
                            v-model="editedSettings.password_acceptable_characters.lower_case"
                            hide-details
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="12" sm="4" md="4" v-else>
                          <v-checkbox
                            :label="`${$t('profileSetting.lowerCase')}: a-z`"
                            color="primary"
                            hide-details
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="12" sm="4" md="4" v-if="editedSettings.password_acceptable_characters">
                          <v-checkbox
                            :label="`${$t('profileSetting.numbers')}: 0-9`"
                            color="primary"
                            v-model="editedSettings.password_acceptable_characters.numbers"
                            hide-details
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="12" sm="4" md="4" v-else>
                          <v-checkbox
                            :label="`${$t('profileSetting.numbers')}: 0-9`"
                            color="primary"
                            hide-details
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="12" sm="12" md="12" v-if="editedSettings.password_acceptable_characters">
                          <v-checkbox
                            :label="
                              `${$t(
                                'profileSetting.specialChars'
                              )}: (~\`!@#$%^&*()_-+={[}]|\\:;'<,>.?/)`
                            "
                            color="primary"
                            v-model="editedSettings.password_acceptable_characters.special_characters"
                            hide-details
                            class="text-caption font-weight-regular"
                          ></v-checkbox>
                        </v-col>
                        
                        <!-- <v-col cols="12" sm="12" md="12" v-else>
                          <v-checkbox
                            :label="
                              `${$t(
                                'profileSetting.specialChars'
                              )}: (~\`!@#$%^&*()_-+={[}]|\\:;'<,>.?/)`
                            "
                            color="primary"
                            hide-details
                            class="text-caption font-weight-regular"
                          ></v-checkbox>
                        </v-col> -->

                        <!-- <v-col
                          cols="12"
                          sm="4"
                          md="4"
                          class="mt-n5"
                      >
                          <v-checkbox
                          label="Unique Symbols"
                          color="primary"
                          v-model="editedSettings.password_acceptable_characters.unique_symbols"
                          hide-details
                          ></v-checkbox>
                      </v-col> -->
                      </v-row>
                      
                    </v-col>
                    <v-col cols="12" class="mt-5">
                      <label
                        for="name"
                        class="text-subtitle-1 font-weight-bold"
                        >{{ $t("profileSetting.organizationLogo") }}</label
                      >
                      <v-row outline>
                        <v-col cols="6" sm="6" md="6">
                          <v-file-input
                            v-model="organizationLogo"
                            multiple
                            outlined
                            dense
                            single-line
                            hide-details="auto"
                            prepend-icon
                            :placeholder="$t('browse')"
                          />
                        </v-col>
                      </v-row>

                      <v-row outline>
                        <v-col cols="6" sm="6" md="6">
                          <v-checkbox :label="$t('hideLogo')" v-model="editedSettings.is_logo_hide">  </v-checkbox>
                        </v-col>
                      </v-row>
                    </v-col>

                    <v-col cols="12">
                      <label
                        for="name"
                        class="text-subtitle-1 font-weight-bold"
                        >{{ $t("profileSetting.organizationSplash") }}</label
                      >
                      <v-row outline>
                        <v-col cols="6" sm="6" md="6">
                          <v-file-input
                            v-model="organizationSplash"
                            multiple
                            outlined
                            dense
                            single-line
                            hide-details="auto"
                            prepend-icon
                            :placeholder="$t('browse')"
                          />
                        </v-col>
                      </v-row>
                      <v-row outline>
                        <v-col cols="6" sm="6" md="6">
                          <v-checkbox :label="$t('hideSplash')" v-model="editedSettings.is_splash_hide">  </v-checkbox>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  </v-card-text>
                </v-card>
                <v-card-actions class="mt-10">
                  <v-spacer></v-spacer>
                  <v-btn
                    @click="closeModal"
                    outlined
                    right
                    height="44"
                    width="116"
                    depressed
                    color="primary"
                  >
                    {{ $t("cancel") }}
                  </v-btn>
                  <v-btn
                    @click="updateSettings"
                    right
                    height="44"
                    width="116"
                    color="primary"
                  >
                    {{ $t("save") }}
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </template>
  </v-container>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";
import generalMixin from "@/mixins/GeneralMixin";
import PermissionsMixin from "@/mixins/PermissionsMixin";
import PermissionsService from "@/_services/PermissionsService";
import OrganizationService from "@/_services/OrganizationService";
import GeneralService from "@/_services/GeneralService";

export default {
  mounted() {
    if(this.editedSettings.password_acceptable_characters == null){
      this.editedSettings.password_acceptable_characters = {
            numbers: false,
            lower_case: false,
            upper_case: false,
            unique_symbols: false,
            special_characters: false
        };
    }
    this.getOrganizationData();
    this.getCountry();
    this.alertArray.map((a, index) => {
      this.cropOptions[index] = this.countryOptions.filter(crop => crop.country === a.country);
    })
  },
  created() {
    const fetchData = async () => {
      this.startLoading();

      this.stopLoading();
    };
    fetchData();
  },
  computed: {
    dialog() {
      return this.dialogU;
    },
    getYieldUnits() {
      return this.weightUnits.map((yUnit) => {
        let weightUnits = yUnit.units.map(unit => {
            return {
                text: unit.name,
                value: unit.id
            };
        });
        return weightUnits;
    }).flat();
    },
  },
  data() {
    return {
      savingAlert: false,
      removingAlert: false,
      alertArray: this.alert,
      countryOptions: [],
      cropOptions: [],
      maxProduction: this.alert ? this.alert.maxAllowed : '',
      productionUnit: this.alert && this.alert.unit ? this.alert.unit.id : '',
      valid: true,
      departmentList: [],
      rolesList: [],
      roleLoading: false,
      fieldType: { text: "text" },
      error: false,
      errors: {
        name: "",
        email: "",
        mobile: "",
        password: "",
        department: "",
        role: "",
      },
      editedSettings: { ...this.settings },
      password: "",
      custom_otp:"",
      organizationLogo:null,
      organizationSplash:null,
      rules: {
        name: [
          (v) => !!v || "Name is required",
          // (v) => this.onlyAlpha(v) || "Name can contain only alphbets",
        ],
        email: [
          (v) => !!v || "Email is required",
          (v) => this.validateEmail(v) || "Invalid email format.",
        ],
        mobile: [
          (v) => !!v || "Mobile number is required",
          (v) => this.validMobileNumber(v) || "Invalid mobile number format.",
        ],
        department: [(v) => !!v || "Department is required"],
        role: [(v) => !!v || "Role is required"],
      },
    };
  },
  methods: {
    disableSave(al) {
      if(al.country && al.cropId && al.maxAllowed && al.unitId) {
        return false;
      }
      return true;
    },
    addAlert() {
      this.alertArray.push({
        cropId: null,
        country: null,
        alertAdmin: false,
        alertFarmer: false,
        maxAllowed: 0,
        unitId: null,
      })
    },
    removeAlert(index) {
      if (this.alertArray[index].id) {
        this.removingAlert = true;
        GeneralService.deleteHarvestAlert(this.alertArray[index].id)
        .then(() => {
          this.$emit("settingsUpdated", {
              success: true,
              message: 'Deleted successfully',
          });
        })
        .catch((err) => {
          console.log(err);
          this.$notify({
              title: 'Error while deleting crop harvest alert',
              text: `${err.message}`,
              type: 'error'
          });
        })
        .finally(() => {
          this.removingAlert = false;
          this.closeModal();
        })
      } else {
        this.alertArray.splice(index, 1);
      }
    },
    saveAlert(index) {
      this.savingAlert = true;
      if (this.alertArray[index].id) {
        if (this.alertArray && +this.alertArray[index].maxAllowed > 0 ) {
          const payload = {
            country: this.alertArray[index].country,
            cropId: this.alertArray[index].cropId,
            alertAdmin: this.alertArray[index].alertAdmin, 
            alertFarmer: this.alertArray[index].alertFarmer,
            maxAllowed: +this.alertArray[index].maxAllowed, 
            unitId: this.alertArray[index].unitId
          }
          GeneralService.updateHarvestAlert(this.alertArray[index].id, payload)
          .then((data) => {
            if (!data.success) {
              this.$notify({
                text: data.message,
                success: 'false'
              });
            } else {
              this.$emit("settingsUpdated", {
                success: true,
                message: data.message,
              });
            }
            this.savingAlert = false;
          })
          .catch((err) => {
            this.savingAlert = false;
            console.log(err);
            this.$notify({
                title: 'Error while updating crop harvest alert',
                text: `${err.message}`,
                type: 'error'
            });
          })
          .finally(() => {
            this.closeModal();
          })
        }
      } else {
        if (this.alertArray && +this.alertArray[index].maxAllowed > 0 ) {
          const payload = {
            country: this.alertArray[index].country,
            cropId: this.alertArray[index].cropId,
            alertAdmin: this.alertArray[index].alertAdmin, 
            alertFarmer: this.alertArray[index].alertFarmer,
            maxAllowed: +this.alertArray[index].maxAllowed, 
            unitId: this.alertArray[index].unitId
          }
          GeneralService.createHarvestAlert(payload)
          .then((data) => {
            if (!data.success) {
              this.$notify({
                text: data.message,
                success: 'false'
              });
            } else {
              this.$emit("settingsUpdated", {
                success: true,
                message: data.message,
              });
            }
            this.savingAlert = false;
          })
          .catch((err) => {
            this.savingAlert = false;
            console.log(err);
            this.$notify({
                title: 'Error while creating crop harvest alert',
                text: `${err.message}`,
                type: 'error'
            });
          })
          .finally(() => {
            this.closeModal();
          })
        }
      }
    },
    generateOTP(){
      const newOTP = Math.floor(Math.random() * 900000 + 100000);
      this.custom_otp=newOTP;
    },
    closeModal() {
      this.$emit("closeEditSettings");
    },

    async getOrganizationData(){
      const {data} = await OrganizationService.getorganization();
      if(data.success){
        this.custom_otp=data.data?.custom_otp;
      }
    },

    updateCrops(v, index) {
      // Filter crops based on selected region
    this.cropOptions[index] = this.countryOptions.filter(crop => crop.country === v);
    },
    getCountry() {
      const newArray = this.cropList?.map((n) => {
        return {
          id: n.id,
          cropName: n.name,
          country: n.region,
        }
      })
      this.countryOptions = newArray;
      this.cropOptions[0] = newArray;
    },
    async toBase64(file) {
      let data = new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
      })
      return data;
    },
    async updateSettings() {
      if (!this.$refs.settingsEdit.validate()) return;
      this.startLoading();
      // upload organization logo
      if(this.organizationLogo){
        let file = await this.toBase64(this.organizationLogo[0]);
        OrganizationService.uploadOrganizationLogo(file)
        .then((data) => {
          if (!data.success) {
            this.$notify({
              text: "Successfully uploaded organization logo",
              success: 'false'
          });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$notify({
              title: 'Error uploding Organization Logo',
              text: `${err.message}`,
              type: 'error'
          });
        });
        
      }
      if(this.organizationSplash){
        let file = await this.toBase64(this.organizationSplash[0]);
        OrganizationService.uploadOrganizationSplash(file)
        .then((data) => {
          if (!data.success) {
            this.$notify({
              text: "Successfully uploaded organization splash screen",
              success: 'false'
          });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$notify({
              title: 'Error uploding Organization Splash Screen',
              text: `${err.message}`,
              type: 'error'
          });
        }); 
      }
      //update is_hide_logo and is_hide_splash
      await OrganizationService.updateHideShowLoginSplash({
        is_splash_hide:this.editedSettings.is_splash_hide,
        is_logo_hide:this.editedSettings.is_logo_hide
      })
      // update otp
      if(this.custom_otp){
        const otpRegex = /^\d{6}$/;
        if(!otpRegex.test(this.custom_otp)){
          this.$notify({
              text: `OTP must be a 6-digit number`,
              type: 'error'
          });
          this.stopLoading();
          return;
        } 

        OrganizationService.updateData({
          'custom_otp':this.custom_otp
        })
        .then(({data}) => {
          if (!data.success) {
            this.$notify({
              text: data.message,
              success: 'false'
          });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$notify({
              title: 'Error updating Organization data',
              text: `${err.message}`,
              type: 'error'
          });
        });
      }

      PermissionsService.updateAppSettings(this.editedSettings)
        .then((data) => {
          if (data.success) {
            this.$emit("settingsUpdated", {
              success: true,
              message: data.message,
            });
          } else {
            this.$emit("settingsUpdated", {
              success: false,
              message: data.message,
            });
          }
          this.closeModal();
          this.stopLoading();
        })
        .catch((err) => {
          // var errors = err.response.data.message.errors[0];
          console.log(err);
          // this.$notify({
          //     title: 'Unable to update',
          //     text: `${errors.msg} - ${errors.value} for ${errors.param}`,
          //     type: 'error'
          // });
          this.stopLoading();
        });
        this.stopLoading();
    },

    emptyErrors() {
      this.error = false;
      this.errors.name = "";
      this.errors.email = "";
      this.errors.mobile = "";
      this.errors.password = "";
      this.errors.department = "";
      this.errors.role = "";
    },
  },
  props: {
    dialogU: {
      type: Boolean,
      required: true,
    },
    settings: {
      required: true,
    },
    harvestAlertSettings: {
      required: true,
    },
    weightUnits: {
      required: true,
      type: Array,
    },
    cropList: {
      required: true,
      type: Array,
    },
    alert: {
      required: true,
      type: Array,
    },
  },
  mixins: [loadingMixin, generalMixin, PermissionsMixin],
};
</script>

<style lang="scss" scoped>
::v-deep .bg .v-input__slot {
  background-color: $primary-color;
  color: white;
}

::v-deep .ag .v-input__slot {
  background-color: $primary-color;
}

::v-deep .theme--light.v-select .v-select__selection--comma {
    color: white;
}

::v-deep .v-icon.v-icon {
    // color: white;
}
</style>
