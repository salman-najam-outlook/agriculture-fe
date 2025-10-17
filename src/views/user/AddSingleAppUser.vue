<template>
  <v-container>
    <template>
      <div class="text-center">
        <v-dialog
          v-model="dialog"
          width="800"
          @click:outside="closeModal"
          :retain-focus="false"
        >
          <v-card class="custom-card" rounded="0">
            <v-toolbar flat color="primary" class="white--text">
              <v-toolbar-title class="font-weight-bold">{{
                $t("newUser")
              }}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon class="white--text" @click="closeModal">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <div v-if="isDeactivated" class="deactivated-user">
              Deactivated User - {{ new Date().toISOString().substring(0, 10) }}
            </div>
            <v-form
              ref="addUser"
              v-model="valid"
              lazy-validation
              autocomplete="off"
            >
              <v-card-text class="black--text">
                <v-row>
                  <v-col cols="12">
                    <v-row class="grouping">
                      <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                        <label for="membershipPlan">{{
                          $t("activationKey.membershipPlan")
                        }}</label>
                        <v-select
                          v-model="user.membershipPlan"
                          :items="[{ name: 'Test', id: 153435 }]"
                          item-text="name"
                          item-value="id"
                          outlined
                          dense
                          :error-messages="errors.membershipPlan"
                          :loading="membershipLoading"
                          :rules="rules.membershipPlan"
                          :placeholder="$t('userslist.selectMembership')"
                        ></v-select>
                        <v-card-actions>
                          <div v-if="activationConfirmed">
                            <div v-if="toggleUpdateKey">
                              <v-btn
                                outlined
                                right
                                depressed
                                color="primary"
                                class="mr-4"
                              >
                                {{ $t("cancel") }}
                              </v-btn>
                              <v-btn
                                right
                                depressed
                                color="primary"
                                @click="toggleUpdateKey = false"
                              >
                                {{ $t("update") }}
                              </v-btn>
                            </div>
                            <v-btn
                              v-else
                              outlined
                              right
                              depressed
                              color="primary"
                              @click="updateKey"
                            >
                              {{ $t("userslist.updateKey") }}
                            </v-btn>
                          </div>
                          <v-spacer></v-spacer>
                        </v-card-actions>
                      </div>
                      <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                        <label for="membershipPlan">{{
                          $t("activationKey.activationKey")
                        }}</label>
                        <v-autocomplete
                          outlined
                          dense
                          v-model="user.activationKey"
                          :items="['ajhkiay89r789er7g87er987g98ar']"
                          :rules="rules.activationKey"
                          :placeholder="$t('userslist.selectActivationKey')"
                        >
                        </v-autocomplete>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn
                            v-if="user.membershipPlan && !user.activationKey"
                            left
                            color="primary"
                          >
                            {{ $t("userslist.generateKey") }}
                          </v-btn>
                          <div
                            v-if="user.activationKey && !activationConfirmed"
                          >
                            <v-btn
                              outlined
                              right
                              depressed
                              color="primary"
                              class="mr-4"
                            >
                              {{ $t("cancel") }}
                            </v-btn>
                            <v-btn
                              left
                              depressed
                              color="primary"
                              @click="confirmActivation"
                            >
                              {{ $t("confirm") }}
                            </v-btn>
                          </div>
                        </v-card-actions>
                      </div>
                    </v-row>
                  </v-col>
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
                        <span
                          >To regiser the app, at least one detail must be
                          provided either mobile number or email.</span
                        >
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
                        <span
                          >To regiser the app, at least one detail must be
                          provided either mobile number or email.</span
                        >
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
                  <!-- country starts -->
                  <v-col cols="6" class="py-0">
                    <label for="country">{{ $t("country") }}</label>
                    <v-autocomplete
                      outlined
                      dense
                      v-model="user.countryId"
                      :items="countries"
                      item-value="name"
                      item-text="name"
                      :rules="rules.country"
                      :placeholder="$t('country')"
                      return-object
                      @change="getState"
                    >
                      <template v-slot:item="slotProps">
                        <i
                          :class="[
                            'mr-2',
                            'em',
                            `em-flag-${slotProps.item.code.toLowerCase()}`,
                          ]"
                        ></i>
                        {{ `${slotProps.item.name}` }}
                      </template>
                      <template slot="selection" slot-scope="data">
                        <i
                          :class="[
                            'mr-2',
                            'em',
                            `em-flag-${data.item.code.toLowerCase()}`,
                          ]"
                        ></i>
                        {{ `${data.item.name}` }}
                      </template>
                    </v-autocomplete>
                  </v-col>
                  <!-- country ends -->
                  <!-- state starts -->
                  <v-col cols="6" class="py-0">
                    <label for="state"
                      >{{ $t("provinceState")
                      }}<span class="red--text">*</span></label
                    >
                    <v-autocomplete
                      outlined
                      dense
                      v-model="user.stateId"
                      :items="states"
                      :filter="filterState"
                      item-value="name"
                      item-text="name"
                      :error-messages="errors.state"
                      :rules="rules.state"
                      :placeholder="$t('provinceState')"
                      return-object
                    >
                    </v-autocomplete>
                  </v-col>
                  <!-- state ends -->
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
                      :placeholder="$t('Enter your family tribe')"
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
                      :placeholder="$t('Enter website')"
                      outlined
                      dense
                      :error-messages="errors.website"
                      :rules="rules.userTribe"
                    ></v-text-field>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                    <label for="validity">{{
                      $t("addEdituser.validityUpTo")
                    }}</label>
                    <v-text-field
                      v-model="user.validityUpTo"
                      outlined
                      disabled
                      dense
                      :error-messages="errors.validityUpTo"
                      :rules="rules.membershipValidity"
                    ></v-text-field>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                    <label for="status"
                      >{{ $t("status") }}<span class="red--text">*</span></label
                    >
                    <v-radio-group
                      v-model="user.status"
                      :error-messages="errors.status"
                      row
                      @change="onStatusChange"
                    >
                      <v-radio label="Active" :value="1"></v-radio>
                      <v-radio label="Deactivated" :value="0"></v-radio>
                    </v-radio-group>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                    <label for="role">{{ $t("userslist.role") }}</label>
                    <v-select
                      v-model="user.role"
                      :items="rolesList"
                      item-text="name"
                      item-value="id"
                      outlined
                      dense
                      id="role"
                      multiple
                      :error-messages="errors.role"
                      :loading="roleLoading"
                      :rules="rules.role"
                      :placeholder="$t('selectRole')"
                      :disabled="rolesList.length < 1"
                      :menu-props="{ closeOnContentClick: true }"
                    >
                      <template v-slot:item="{ item, props }">
                        <v-list-item v-bind="props">
                          <div class="selection-list">
                            <v-checkbox
                              v-model="user.role"
                              :value="item.id"
                              :label="item.name"
                            ></v-checkbox>
                            <div
                              class="text-decoration-underline"
                              style="paddingBottom: 22px"
                              @click="openPermissions(item.id)"
                            >
                              see permissions
                            </div>
                          </div>
                        </v-list-item>
                      </template>
                    </v-select>
                    <span class="error">{{ errors.role }}</span>
                  </div>
                </v-row>
                <v-card-actions class="mt-10">
                  <v-spacer></v-spacer>
                  <v-btn
                    @click="activationKeySet = false"
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
                    @click="saveUser"
                    right
                    height="44"
                    width="116"
                    color="primary"
                  >
                    {{ $t("submit") }}
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-form>
          </v-card>
        </v-dialog>
      </div>
    </template>
    <v-dialog
      v-model="showWarningDeactivate"
      width="500"
      @click:outside="showWarningDeactivate = false"
      :retain-focus="false"
    >
      <v-card class="" rounded="0">
        <v-toolbar flat color="primary" class="white--text">
          <v-toolbar-title class="font-weight-bold">{{
            $t("userslist.deactivateUser")
          }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon class="white--text" @click="closeModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="text-center font-weight-bold pa-6">
          Are you sure you want to deactivate this user? <br />
          <br />
          Deactivated users will be able to access their previous records but
          will not be able to perform any new activites in the app
        </v-card-text>
        <v-card-actions class="pb-6">
          <v-spacer></v-spacer>
          <v-btn outlined right width="116" depressed color="primary">
            {{ $t("cancel") }}
          </v-btn>
          <v-btn
            right
            width="116"
            color="primary"
            @click="
              isDeactivated = true;
              showWarningDeactivate = false;
            "
          >
            {{ $t("confirm") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <farmer-role-permission :dialogI="showPermissions" @closeModal="showPermissions = false"/>
  </v-container>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";
import generalMixin from "@/mixins/GeneralMixin";
import PermissionsMixin from "@/mixins/PermissionsMixin";
import { getCountries, getStates } from "country-state-picker";
import UserService from "@/_services/UserService";
import FarmerRolePermission from './FarmerRolePermission.vue';
// import { countries } from "@/constants/countries.js"
// import GenerateKey from "../activation-key/GenerateKey.vue";

export default {
  created() {
    this.getCountry();
    const fetchData = async () => {
      this.startLoading();
      this.departmentList = await this.getDepartments();
      await this.getRoles();
      this.stopLoading();
    };
    fetchData();
  },
  components: {
    FarmerRolePermission
    // GenerateKey
  },
  computed: {
    dialog() {
      return this.dialogI;
    },
  },
  data() {
    return {
      activationConfirmed: false,
      toggleUpdateKey: false,
      show: true,
      country: "",
      countries: [],
      states: [],
      valid: true,
      departmentList: [],
      rolesList: [],
      roleLoading: false,
      membershipLoading: false,
      activationKeyLoading: false,
      fieldType: { text: "text" },
      error: false,
      createUserType: "Single",
      nextDialog: false,
      activationKeySet: false,
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
      errors: { firstName: "", lastName: "", email: "" },
      user: {
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        countryCode: "",
        activationKey: "",
        membershipPlan: "",
        membershipRole: "",
        validityUpTo: "",
        status: 1,
        role: [],
      },
      preview: "",
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
        activationKey: [
          (v) => !!v || this.$t("activationKey.activationKeyRequired"),
          (v) =>
            (v && v.length >= 15) ||
            this.$t("activationKey.activationKeyLimit"),
        ],
      },
      select: null,
      userTypeArray: [
        {
          label: this.$t("userslist.single"),
          value: "Single",
        },
        {
          label: this.$t("userslist.multiple"),
          value: "Multiple",
        },
      ],
      isDeactivated: false,
      showWarningDeactivate: false,
      showPermissions: false,
    };
  },
  methods: {
    openPermissions(roleID) {
      // use the roleID to see the permissions of the roles
      console.log(roleID)
      this.showPermissions = true;
    },
    confirmActivation() {
      this.activationConfirmed = true;
    },
    updateKey() {
      this.toggleUpdateKey = true;
    },
    onStatusChange(val) {
      if (!val) {
        this.showWarningDeactivate = true;
      }
    },
    countryMatch(x) {
      if (!this.user.countryCode) return false;
      if (x.MobileCode == this.user.countryCode) return true;

      return false;
    },
    getCountry() {
      this.countries = getCountries();
    },
    getState(val) {
      this.states = getStates(val.code);
      this.country = val;
    },
    formatRole(userRole) {
      let string = userRole.split("_").join(" ");
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    filterCountry(item, queryText) {
      const byName = item?.Name.toLowerCase();
      const searchText = queryText.toLowerCase();
      return byName.indexOf(searchText) > -1;
    },
    onFilter(item, queryText) {
      return (
        item.Name.toLocaleLowerCase().includes(queryText.toLocaleLowerCase()) ||
        item.MobileCode.toLocaleLowerCase().includes(
          queryText.toLocaleLowerCase()
        )
      );
    },
    handleChange(file) {
      this.preview = file ? URL.createObjectURL(file) : "";
    },
    closeModal() {
      this.nextDialog = false;
      this.$emit("closeAddUser");
    },
    saveUser() {
      this.emptyErrors();
      if (this.user.email.trim() == "" && this.user.mobile.trim() == "") {
        this.errors.email = "Email or mobile number is required.";
        this.errors.mobile = "Email or mobile number is required.";
        this.error = true;
      }
      if (this.error) return;
      if (!this.$refs.addUser.validate()) return;
      this.startLoading();
      const data = this.user;
      delete data.membershipPlan;
      delete data.membershipRole;
      delete data.validityUpTo;
      data.activationKey;
      let countryObj = this.user.countryId;
      data.country = countryObj.name;
      data.countryId = countryObj.name;
      data.stateId = this.user.stateId;
      data.countryIsoCode = countryObj.code;
      data.countryCode = countryObj.dial_code;
      data.active = parseInt(this.user.status);
      let formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      UserService.addAppUser(formData)
        .then((data) => {
          if (data.success) {
            this.$emit("userAdded", { success: true, message: data.message });
          } else {
            this.$emit("userAdded", { success: false, message: data.message });
          }
          this.stopLoading();
        })
        .catch((err) => {
          if (err.response.data.message) {
            this.$notify({
              title: err.response.data.message,
              type: "error",
            });
          } else {
            this.$notify({
              title: "User creation unsuccessful, please revisit the form",
              type: "error",
            });
          }
          this.stopLoading();
        });
    },

    emptyErrors() {
      this.error = false;
      this.errors.email = "";
      this.errors.mobile = "";
    },
    async getRoles() {
      this.rolesList = [];
      this.roleLoading = true;
      this.rolesList = await this.getRolesList();
      this.roleLoading = false;
    },
    async generateKey() {
      if (!this.$refs.activationKey.validate()) return;
      this.startLoading();
      console.log(this.user, "this user");
      UserService.getKeyDetail(this.user.activationKey)
        .then((data) => {
          if (data.success) {
            this.stopLoading();
            this.user.membershipPlan =
              data.data?.membership_assoc?.membership_type;
            this.user.membershipRole =
              data.data?.membership_assoc?.userRoleMembershipMap;
            this.user.validityUpTo = data.data?.membershipValidity;
            this.activationKeySet = true;
          } else {
            this.stopLoading();
            this.$notify({
              title: data.msg,
              type: "error",
            });
          }
        })
        .catch((err) => {
          console.log("error", err);
          this.$notify({
            title: "Invalid activation key",
            type: "error",
          });
          this.stopLoading();
        });
    },
    keysGenerated() {
      this.$router.push("/activation-key/list?app_user=true");
    },
  },
  props: {
    dialogI: {
      type: Boolean,
      required: true,
    },
  },
  mixins: [loadingMixin, generalMixin, PermissionsMixin],
};
</script>

<style>
.deactivated-user {
  background: red;
  color: #ffffff;
  padding: 8px;
  text-align: center;
}
.grouping {
  border: 1px solid rgb(163, 163, 163);
  padding-top: 15px;
  margin-bottom: 15px;
}

.v-dialog::-webkit-scrollbar {
  width: 0px;
}

.v-dialog::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;
}

.v-dialog::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

.v-input--selection-controls {
  padding-top: 0;
  margin-top: 8px;
}

.custom-card {
  background: #ffffff !important;
  box-shadow: 0px 30px 30px rgb(106 119 132 / 41%) !important;
  border-radius: 23px !important;
}

.custom-card .v-card__text {
  width: 100%;
  padding: 37px 40px !important;
}

.card-heading-1 {
  margin-bottom: 28px;
}

.custom-card .v-card__text .card-heading-1 h2 {
  font-size: 30px;
  font-weight: 700;
}

.form label {
  display: inline-block;
  max-width: 100%;
  margin-bottom: 5px;
  font-size: 15px;
  font-family: Poppins-Medium;
}

.v-input__prepend-outer {
  display: none;
}

.selection-list {
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}
</style>
