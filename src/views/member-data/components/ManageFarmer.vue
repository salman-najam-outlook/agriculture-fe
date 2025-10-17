<template>
  <v-dialog v-model="openManageFarmer" width="600" @click:outside="closeModal">
    <v-card class="pa-0" rounded="0">
      <v-toolbar color="primary" class="white--text" flat :elevation="0">
        <v-toolbar-title class="font-weight-bold">
          {{ $t("manageFarmer") }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon class="white--text" @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-form ref="addOfflineUser" lazy-validation autocomplete="off">
        <v-card-text class="black--text">
          <v-radio-group v-model="radioGroup">
            <v-radio
              class="my-2"
              :label="$t('offlineFarmerForByingStationOnly')"
              value="local"
            ></v-radio>
            <div v-if="radioGroup === 'local'">
              <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 ">
                <label>{{ $t("buyingStation") }}<span class="red--text">*</span></label>
                <v-autocomplete
                  v-model="selectedStation"
                  :loading="loadingBuyingStation"
                  :items="buyingStations"
                  item-text="fullName"
                  item-value="id"
                  cache-items
                  :search-input.sync="searchStation"
                  dense
                  hide-no-data
                  hide-selected
                  class="mt-1"
                  :placeholder="$t('select')"
                  outlined
                  return-object
                >
                </v-autocomplete>
              </div>
            </div>
            <v-divider></v-divider>
            <v-radio
              class="my-2"
              :label="$t('offlineFarmerForAllByingStations')"
              value="global"
            ></v-radio>
            <v-divider></v-divider>
            <v-radio
              class="my-2"
              :label="$t('mergeWithExistingAccount')"
              value="merged"
            ></v-radio>
            <div v-if="radioGroup === 'merged'">
              <v-text-field
                prepend-inner-icon="mdi-magnify"
                outlined
                :placeholder="$t('search')"
                dense
                v-model="search"
                @click:append="searchUsers"
                @input="searchUsers"
              ></v-text-field>
              <v-data-table
                :headers="headers"
                :loading="userLoading"
                :loading-text="$t('userslist.userLoading')"
                :items-per-page="4"
                :items="items"
                single-select
                show-select
                v-model="selected"
                hide-default-footer
              >
              </v-data-table>
            </div>
            <v-divider></v-divider>
            <v-radio
              class="my-2"
              :label="$t('createNewAccount')"
              value="new_user"
            ></v-radio>
            <v-form
              v-if="radioGroup === 'new_user'"
              ref="addUser"
              v-model="valid"
              lazy-validation
              autocomplete="off"
            >
              <v-card-text class="black--text">
                <v-row>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                    <label for="name"
                      >{{ $t("firstName")
                      }}<span class="red--text">*</span></label
                    >
                    <v-text-field
                      v-model="user.firstName"
                      :placeholder="$t('firstName')"
                      outlined
                      dense
                      :error-messages="errors.firstName"
                      :rules="rules.firstName"
                    ></v-text-field>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                    <label for="name"
                      >{{ $t("lastName")
                      }}<span class="red--text">*</span></label
                    >
                    <v-text-field
                      v-model="user.lastName"
                      :placeholder="$t('lastName')"
                      outlined
                      dense
                      :error-messages="errors.lastName"
                      :rules="rules.lastName"
                    >
                    </v-text-field>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                    <label for="email"
                      >{{ $t("emailId") }}
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn icon v-bind="attrs" v-on="on">
                            <v-icon color="green lighten-1" dense size="12">
                              mdi-help
                            </v-icon>
                          </v-btn>
                        </template>
                        <span>
                          {{ $t('mobileOrEmailRequiredForRegister') }}
                        </span>
                      </v-tooltip>
                    </label>
                    <v-text-field
                      v-model="user.email"
                      :placeholder="$t('emailId')"
                      outlined
                      dense
                      :error-messages="errors.email"
                      :rules="rules.email"
                    ></v-text-field>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                    <label for="mobile"
                      >{{ $t("mobileNumber") }}
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn icon v-bind="attrs" v-on="on">
                            <v-icon color="green lighten-1" dense size="12">
                              mdi-help
                            </v-icon>
                          </v-btn>
                        </template>
                        <span>
                          {{ $t('mobileOrEmailRequiredForRegister') }}
                        </span>
                      </v-tooltip>
                    </label>
                    <v-text-field
                      v-model="user.mobile"
                      :placeholder="$t('mobile')"
                      outlined
                      dense
                      :error-messages="errors.mobile"
                      :rules="rules.mobile"
                    ></v-text-field>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                    <label for="language">{{ $t("language") }}</label>
                    <v-select
                      :items="languages"
                      item-text="title"
                      item-value="language"
                      :placeholder="$t('selectLanguage')"
                      outlined
                      v-model="user.language"
                      dense
                      width="11"
                      class="shrink wdt"
                    >
                    </v-select>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                    <label for="role">{{ $t("roleRequest.userRole") }}</label>
                    <v-row class="pl-2">
                      <v-checkbox
                        class="text-no-wrap"
                        disabled
                        :label="$t('farmer')"
                        v-model="user.isFarmer"
                      >
                      </v-checkbox>
                    </v-row>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                    <label for="countryCode">
                      {{ $t("country") }}
                      <span class="red--text">*</span>
                    </label>
                    <v-autocomplete
                      outlined
                      dense
                      v-model="user.countryId"
                      :items="countries"
                      item-text="Name"
                      item-value="MobileCode"
                      :rules="rules.countryId"
                      :placeholder="$t('country')"
                      :search-input.sync="searchPhone"
                    >
                      <template v-slot:item="slotProps">
                        <i
                          :class="[
                            'mr-2',
                            'em',
                            `em-flag-${slotProps.item.Code.toLowerCase()}`,
                          ]"
                        ></i>
                        {{
                          `${slotProps.item.Name} (+${slotProps.item.MobileCode})`
                        }}
                      </template>
                      <template slot="selection" slot-scope="data">
                        <i
                          :class="[
                            'mr-2',
                            'em',
                            `em-flag-${data.item.Code.toLowerCase()}`,
                          ]"
                        ></i>
                        {{ `${data.item.Name} (+${data.item.MobileCode})` }}
                      </template>
                    </v-autocomplete>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                    <label for="provinceState">{{ $t("provinceState") }}</label>
                    <v-text-field
                      v-model="user.stateId"
                      :placeholder="$t('provinceState')"
                      outlined
                      dense
                      :error-messages="errors.state"
                      :rules="rules.state"
                    ></v-text-field>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                    <label for="regionDistrict">{{
                      $t("regionDistrict")
                    }}</label>
                    <v-text-field
                      v-model="user.district"
                      :placeholder="$t('regionDistrict')"
                      outlined
                      dense
                      :error-messages="errors.district"
                      :rules="rules.district"
                    ></v-text-field>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                    <label for="cityTown">{{ $t("cityTown") }}</label>
                    <v-text-field
                      v-model="user.village"
                      :placeholder="$t('cityTown')"
                      outlined
                      dense
                      :error-messages="errors.village"
                      :rules="rules.village"
                    ></v-text-field>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                    <label for="address">{{ $t("address") }}</label>
                    <v-text-field
                      v-model="user.address"
                      :placeholder="$t('address')"
                      outlined
                      dense
                      :error-messages="errors.address"
                      :rules="rules.address"
                    ></v-text-field>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                    <label for="familyTribe">{{ $t("familyTribe") }}</label>
                    <v-text-field
                      v-model="user.userTribe"
                      :placeholder="$t('userslist.familyTribe')"
                      outlined
                      dense
                      :error-messages="errors.userTribe"
                      :rules="rules.userTribe"
                    ></v-text-field>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                    <label for="website">{{ $t("website") }}</label>
                    <v-text-field
                      v-model="user.website"
                      :placeholder="$t('userslist.enterWebsite')"
                      outlined
                      dense
                      :error-messages="errors.website"
                      :rules="rules.userTribe"
                    ></v-text-field>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0"></div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 py-0">
                    <label for="website">{{
                      $t("addEdituser.facilityPicture")
                    }}</label>
                    <v-file-input
                      v-model="user.facilityPicUrl"
                      :placeholder="$t('browse')"
                      outlined
                      type="file"
                      @change="handleChange"
                      dense
                      :error-messages="errors.facilityPicUrl"
                      :rules="rules.facilityPicUrl"
                    ></v-file-input>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 py-0">
                    <div v-if="preview">
                      <img :src="preview" width="50%" />
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                    <label for="membershipPlan">{{
                      $t("activationKey.membershipPlan")
                    }}</label>
                    <v-text-field
                      v-model="user.membershipPlan"
                      outlined
                      dense
                      disabled
                      :error-messages="errors.membershipPlan"
                      :rules="rules.membershipPlan"
                    ></v-text-field>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                    <label for="validity">{{
                      $t("addEdituser.validityUpTo")
                    }}</label>
                    <v-text-field
                      v-model="user.validityUpTo"
                      outlined
                      dense
                      disabled
                      :error-messages="errors.validityUpTo"
                      :rules="rules.membershipValidity"
                    ></v-text-field>
                  </div>
                </v-row>
              </v-card-text>
            </v-form>
          </v-radio-group>
          <v-card-actions class="">
            <v-spacer></v-spacer>
            <v-btn
              @click="closeModal"
              outlined
              right
              width="116"
              depressed
              color="primary"
              :disabled="loading"
            >
              {{ $t("cancel") }}
            </v-btn>
            <v-btn
              @click="manageUser"
              right
              width="110"
              color="primary"
              :loading="loading"
            >
              {{ $t("save") }}
            </v-btn>
          </v-card-actions>
        </v-card-text>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import UserService from "@/_services/UserService";
import BuyingStationService from "@/_services/BuyingStationService";
import generalMixin from "@/mixins/GeneralMixin";
import { countries } from "@/constants/countries.js";
import moment from "moment";

export default {
  props: {
    openManageFarmer: {
      type: Boolean,
      required: true,
    },
    selectedBuyingStation: {
      type: Number,
      required: false,
    },
    selectedData: {
      type: Object,
      required: false,
    },
  },
  watch: {
    async searchStation(val) {
      this.searchStation = val;
      await this.getBuyingStation();
    },
  },
  mounted() {
    this.getUsers();
    this.getBuyingStation();
  },
  methods: {
    closeModal() {
      (this.radioGroup = "global"),
        (this.search = ""),
        (this.offlineUser = {
          name: "",
          address: "",
        });
      (this.user = {
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        isFarmer: true,
        countryCode: "",
        membershipPlan: this.$t('basicPlan'),
        membershipRole: "",
        validityUpTo: moment(new Date())
          .add(1, "M")
          .format("YYYY-MM-DD"),
      }),
        (this.selected = []),
        (this.selectedStation = null),
        (this.searchStation = ""),
        this.$emit("closeManageFarmer");
    },
    async getBuyingStation() {
      this.loadingBuyingStation = true;
      let pagination = {
        page: 1,
        itemsPerPage: 100,
      };
      await BuyingStationService.getBuyingStationData(
        pagination,
        this.searchStation
      )
        .then(({ data }) => {
          this.buyingStations = data.rows;
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          this.loadingBuyingStation = false;
        });
    },
    async manageUser() {
      try {
        this.loading = true;
        if (this.radioGroup === "local") {
          let payload = {
            buyingStation: this.selectedBuyingStation, // id of selected station data
            status: this.radioGroup,
            buyingStationId: this.selectedData.farmerId, // id of selected buying station farmer
            parentAccount: this.selectedStation.id, // id of intended buying station to merge locally
          };
          await BuyingStationService.updateBuyingStation(payload).then(
            (data) => {
              if (data.success) {
                this.$notify({
                  title: this.$t("addEdituser.userUpdated"),
                  type: "success",
                });
              } else {
                this.$notify({
                  title: this.$t("addEdituser.userNotUpdated"),
                  type: "error",
                });
              }
            }
          );
        } else if (this.radioGroup === "global") {
          let payload = {
            buyingStation: this.selectedBuyingStation, // id of selected station data
            status: this.radioGroup,
          };
          await BuyingStationService.updateBuyingStation(payload).then(
            (data) => {
              if (data.success) {
                this.$notify({
                  title: this.$t("addEdituser.userUpdated"),
                  type: "success",
                });
              } else {
                this.$notify({
                  title: this.$t("addEdituser.userNotUpdated"),
                  type: "error",
                });
              }
            }
          );
        } else if (this.radioGroup === "merged") {
          let payload = {
            buyingStation: this.selectedBuyingStation, // id of selected station data
            status: this.radioGroup,
            buyingStationId: this.selectedData.buyingStationId, // id of selected buying station
            farmerId: this.selectedData.farmerId, // id of selected buying station farmer
            parentAccount: this.selected[0].id, // id of intended buying station to merge with
          };
          await BuyingStationService.updateBuyingStation(payload).then(
            (data) => {
              if (data.success) {
                this.$notify({
                  title: this.$t("addEdituser.userUpdated"),
                  type: "success",
                });
              } else {
                this.$notify({
                  title: this.$t("addEdituser.userNotUpdated"),
                  type: "error",
                });
              }
            }
          );
        } else if (this.radioGroup === "new_user") {
          let formData = new FormData();
          let countryObj = this.countries.filter((el) => {
            if (el.MobileCode == this.user.countryId) {
              return el;
            }
          });
          this.user.countryId = countryObj[0].Code;
          this.user.countryCode = countryObj[0].MobileCode;
          formData.append("firstName", this.user.firstName);
          formData.append("lastName", this.user.lastName);
          formData.append("email", this.user.email);
          formData.append("isFarmer", this.user.isFarmer);
          formData.append("facilityPicUrl", this.user.facilityPicUrl);
          formData.append("countryCode", this.user.countryCode);
          formData.append("countryId", this.user.countryId);
          formData.append("active", true);
          formData.append("membershipPlan", this.user.membershipPlan);
          formData.append("membershipRole", this.user.membershipRole);
          formData.append("validityUpto", this.user.validityUpTo);
          formData.append("password", this.user.password);
          formData.append("buyingStationId", this.selectedBuyingStation);
          await UserService.addAppUserBuyingStation(formData).then((data) => {
            if (data.success) {
              this.$notify({
                title: this.$t("addEdituser.userAdded"),
                type: "success",
              });
            } else {
              this.$notify({
                title: this.$t("addEdituser.userNotAdded"),
                type: "error",
              });
            }
          });
        }
      } catch (err) {
        this.loading = false;
        console.error(err.message);
      } finally {
        this.loading = false;
        this.$emit("getUsers");
        this.closeModal();
      }
    },
    async getUsers() {
      this.userLoading = true;
      await UserService.getUsers(
        this.tableOptions,
        this.showStatusType,
        this.search,
        this.filterParam
      )
        .then((res) => {
          if (res.success) {
            this.items = res.data.rows;
          }
          this.userLoading = false;
        })
        .catch((err) => {
          this.items = [];
          console.log(err);
          this.userLoading = false;
        });
    },
    searchUsers(val) {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(async () => {
        this.search = val;
        this.getUsers();
      }, 700);
    },
    handleChange(file) {
      this.preview = file ? URL.createObjectURL(file) : "";
    },
  },
  data() {
    return {
      countries,
      valid: true,
      errors: { firstName: "", lastName: "", email: "" },
      selectedStation: null,
      loadingBuyingStation: false,
      searchStation: "",
      buyingStations: [],
      show: false,
      preview: "",
      user: {
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        isFarmer: true,
        facilityPicUrl: null,
        countryId: "",
        countryCode: "",
        membershipPlan: this.$t('basicPlan'),
        membershipRole: "",
        password: "Dimitra@123",
        validityUpTo: moment(new Date())
          .add(1, "M")
          .format("YYYY-MM-DD"),
      },
      rules: {
        firstName: [
          (v) => !!v || this.$t("addEdituser.firstNameRequired"),
          (v) => this.onlyAlpha(v) || this.$t("addEdituser.firstNameOllyAlpha"),
          (v) => (v && v.length <= 15) || this.$t("addEdituser.firstNameLimit"),
        ],
        lastName: [
          (v) => !!v || this.$t("addEdituser.lastNameRequired"),
          (v) => this.onlyAlpha(v) || this.$t("addEdituser.lastNameOllyAlpha"),
          (v) => (v && v.length <= 15) || this.$t("addEdituser.lastNameLimit"),
        ],
        countryId: [(v) => !!v || this.$t("activationKey.countryRequired")],
      },
      languages: [
        { flag: "us", language: "en", title: "English" },
        { flag: "in", language: "hi", title: "हिन्दी" },
        { flag: "in", language: "mr", title: "मराठी" },
        { flag: "es", language: "es", title: "Spanish" },
        { flag: "np", language: "ne", title: "Nepali" },
        { flag: "id", language: "id", title: "Indonesia" },
        { flag: "pt", language: "pt", title: "Portuguese" },
        { flag: "gr", language: "el", title: "Greek" },
        { flag: "tr", language: "tr", title: "Turkish" },
      ],
      userLoading: false,
      items: [],
      debounce: null,
      search: "",
      searchPhone: "",
      radioGroup: "global",
      loading: false,
      offlineUser: {
        name: "",
        address: "",
      },
      filterParam: {
        membership_type: "",
        membership_validity: "",
        membershipRemainingDays: 0,
      },
      tableOptions: {
        page: 1,
        itemsPerPage: 100,
        sortBy: [],
      },
      showStatusType: "end_user",
      selected: [],
      headers: [
        {
          text: this.$t("name"),
          align: "start",
          value: "fullName",
          class: "black--text  text-no-wrap",
        },
        {
          text: this.$t("id"),
          value: "id",
          class: "black--text text-no-wrap",
        },
        {
          text: this.$t("address"),
          value: "address",
          class: "black--text text-no-wrap",
        },
      ],
    };
  },
  mixins: [generalMixin],
};
</script>
