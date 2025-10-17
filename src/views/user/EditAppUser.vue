<template>
  <v-container>
    <template>
      <div class="text-center">
        <v-dialog v-model="dialog" width="800" @click:outside="closeModal">
          <v-card class="custom-card pb-120" rounded="0">
            <v-toolbar color="primary" class="white--text" flat>
              <v-toolbar-title class="font-weight-bold">{{
                $t("addEdituser.editAppUser")
              }}</v-toolbar-title>

              <v-spacer></v-spacer>

              <v-btn icon class="white--text" @click="closeModal">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-form ref="userEdit" v-model="valid" lazy-validation autocomplete="off">
              <v-card-text class="black--text">
                <v-row>
                  <v-col cols="6" class="py-0">
                    <label for="name">{{
                      $t("firstName")
                    }}<span class="red--text">*</span></label>
                    <v-text-field v-model="editedUser.firstName" :placeholder="$t('firstName')" outlined dense
                      :error-messages="errors.firstName" :rules="rules.firstName"></v-text-field>
                  </v-col>
                  <v-col cols="6" class="py-0">
                    <label for="name">{{
                      $t("lastName")
                    }}<span class="red--text">*</span></label>
                    <v-text-field v-model="editedUser.lastName" :placeholder="$t('lastName')" outlined dense
                      :error-messages="errors.lastName" :rules="rules.lastName"></v-text-field>
                  </v-col>
                  <v-col cols="6" class="py-0">
                    <label for="email">{{
                      $t("emailId")
                    }}</label>
                    <v-text-field :rules="[
                          v => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$|^$/.test(v) || $t('addEdituser.emailInvalid'),
                        ]" v-model="editedUser.email" :placeholder="$t('emailId')" outlined dense></v-text-field>
                  </v-col>
                  <v-col cols="6" class="py-0">
                    <label for="mobile">{{
                      $t("mobileNumber")
                    }}</label>
                    <v-text-field type="number" v-model="editedUser.mobile" :placeholder="$t('mobile')" outlined
                      dense></v-text-field>
                  </v-col>
                  <!-- <v-col cols="6" class="py-0">
                    <label for="role">
                      {{ $t("userRole") }}
                      <span class="red--text">*</span></label
                    >
                    <v-select
                      v-model="editedUser.userRole"
                      :items="[
                        { name: 'Farmer', val: 'farmer' },
                        { name: 'Warehouse', val: 'warehouse' },
                        { name: 'Buying Station', val: 'buyingStation' },
                        { name: 'Dry Milking Station', val: 'dryMilking' },
                      ]"
                      item-text="name"
                      item-value="val"
                      outlined
                      dense
                      :rules="rules.role"
                      :error-messages="errors.userRole"
                    ></v-select>
                  </v-col> -->
                  <v-col cols="6" class="py-0">
                    <label for="country">{{
                      $t("country")
                    }}</label>
                    <!-- <v-text-field
                      type="text"
                      v-model="editedUser.country"
                      :placeholder="$t('country')"
                      outlined
                      dense
                      :error-messages="errors.country"
                      :rules="rules.country"
                    ></v-text-field> -->
                    <v-autocomplete outlined dense v-model="editedUser.countryId" :items="countries" item-value="name"
                      item-text="name" :rules="rules.country" :placeholder="$t('country')"
                      return-object @change="getState">
                      <template v-slot:item="slotProps">
                        <i :class="[
                          'mr-2',
                          'em',
                          `em-flag-${slotProps.item.code.toLowerCase()}`,
                        ]"></i>
                        {{
                          `${slotProps.item.name}`
                        }}
                      </template>
                      <template slot="selection" slot-scope="data">
                        <i :class="[
                              'mr-2',
                              'em',
                              `em-flag-${data.item.code.toLowerCase()}`,
                            ]"></i>
                        {{ `${data.item.name}` }}
                      </template>
                    </v-autocomplete>
                    <!-- <v-select
                                        v-model="editedUser.department_id"
                                        item-text="name"
                                        item-value="id"
                                        outlined
                                        dense
                                        disabled
                                        :error-messages="errors.department"
                                        @change="getRoles"
                                        :placeholder="$t('Select Country')" 
                                ></v-select>-->
                  </v-col>
                  <v-col cols="6" class="py-0">
                    <label for="state">{{
                      $t("provinceState")
                    }}<span class="red--text">*</span></label>
                    <v-autocomplete outlined dense v-model="editedUser.stateId" :items="states" :filter="filterState"
                      :error-messages="errors.state" :rules="rules.state" :placeholder="$t('provinceState')"
                      return-object>
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="6" class="py-0">
                    <label for="state">{{
                      $t("regionDistrict")
                    }}</label>
                    <v-text-field type="text" v-model="editedUser.district" :placeholder="$t('state')" outlined dense
                      :error-messages="errors.district" :rules="rules.district"></v-text-field>
                  </v-col>
                  <v-col cols="6" class="py-0">
                    <label for="mobile">{{
                      $t("cityTown")
                    }}</label>
                    <v-text-field type="text" v-model="editedUser.village" :placeholder="$t('cityTown')" outlined dense
                     ></v-text-field>
                    <!-- <v-select
                                        v-model="editedUser.department_id"
                                        :items="departmentList"
                                        item-text="name"
                                        item-value="id"
                                        outlined
                                        dense
                                        disabled
                                        :error-messages="errors.department"
                                        :placeholder="$t('Select City/Town')"
                                    ></v-select> -->
                  </v-col>
                  <v-col cols="6" class="py-0">
                    <label for="mobile">{{
                      $t("address")
                    }}</label>
                    <v-text-field type="text" v-model="editedUser.address" :placeholder="$t('address')" outlined dense
                      :error-messages="errors.address" :rules="rules.address"></v-text-field>
                  </v-col>
                  <v-col cols="6" class="py-0">
                    <label for="mobile">{{
                      $t("familyTribe")
                    }}</label>
                    <v-text-field type="text" v-model="editedUser.userTribe" :placeholder="$t('familyTribe')" outlined
                      dense :error-messages="errors.familyTribe" :rules="rules.familyTribe"></v-text-field>
                  </v-col>
                  <v-col cols="6" class="py-0">
                    <label for="mobile">{{
                      $t("website")
                    }}</label>
                    <v-text-field type="text" v-model="editedUser.website" :placeholder="$t('website')" outlined dense
                      :error-messages="errors.website" :rules="rules.website"></v-text-field>
                  </v-col>

                  <v-col cols="6" class="py-0">
                    <label for="mobile">{{
                      $t("membershipPlans")
                    }}<span class="red--text">*</span></label>
                    <v-autocomplete v-model="extendPlan" :items="membershipList" item-text="membership_type"
                      item-value="id" outlined dense :rules="rules.membershipPlan" return-object
                      :error-messages="errors.membershipType" :placeholder="$t('membershipPlans')"
                      @change="changeExtendedPlan"></v-autocomplete>
                    <div v-if="extendPlan">Roles: {{ userRoles }}</div>
                  </v-col>
                  <v-col cols="6" class="py-0">
                    <label for="mobile">{{ $t("status") }}<span class="red--text">*</span></label>
                    <v-radio-group row class="pa-0" v-model="editedUser.active">
                      <v-radio :label="$t('active')" :value="true"></v-radio>
                      <v-radio :label="$t('deactivated')" :value="false"></v-radio>
                    </v-radio-group>
                  </v-col>
                  <v-col cols="12" class="d-flex align-center">
                    <div>
                      {{ $t("membershipValidity") }}:
                      <!-- {{ editedUser }} -->
                      {{
                        editedUser.activation != null
                        ? editedUser.activation[0] && editedUser.activation[0].membershipValidity
                        : "NA"
                      }}
                    </div>
                    <!-- <v-btn x-small color="primary" class="ml-2">
                      {{ $t('userslist.extendVal') }}
                    </v-btn> -->
                  </v-col>
                </v-row>
                <v-row class="mt-10 blue-grey lighten-5">
                  <v-col cols="6">
                    <label for="mobile">{{
                      $t("membership.remainingDays")
                    }}</label>
                    <v-text-field type="number" @input="calcExtendedDate" v-model="extendDays" :placeholder="$t('50')"
                      outlined></v-text-field>
                    <span>{{ $t("extendedMembershipValidity") }}:
                      {{
                        this.finalDate
                      }}
                    </span>
                  </v-col>
                  <v-col cols="6">
                    <label for="mobile">{{
                      $t("userslist.extendReason")
                    }}</label>
                    <v-text-field type="text" v-model="extendReason" :placeholder="$t('userslist.extendReasonMsg')
                      " outlined></v-text-field>
                  </v-col>
                </v-row>
                <!-- <div class="form">
                                <label for="mobile">{{ $t('countryCode')}}<span class="red--text">*</span></label>
                                <v-autocomplete
                                    outlined
                                    dense
                                    v-model="editedUser.countryCode"
                                    :items="countries"
                                    item-value="MobileCode"
                                    :filter="filterCountry"
                                    :rules="rules.country"
                                    :placeholder=" $t('countryCode')"
                                >
                                    <template v-slot:item="slotProps" >
                                        <i :class="['mr-2', 'em', `em-flag-${slotProps.item.Code.toLowerCase()}`]"></i>
                                        {{`${slotProps.item.Name} (+${slotProps.item.MobileCode})` }}
                                    </template>
                                    <template slot="selection" slot-scope="data">
                                        <i :class="['mr-2', 'em', `em-flag-${data.item.Code.toLowerCase()}`]"></i>
                                        {{`${data.item.Name} (+${data.item.MobileCode})` }}
                                    </template>
                                </v-autocomplete>
                            </div> -->
                <v-card-actions class="mt-10">
                  <v-spacer></v-spacer>
                  <v-btn @click="closeModal" outlined right height="44" width="116" depressed color="primary">
                    {{ $t("cancel") }}
                  </v-btn>
                  <v-btn @click="updateUser" right height="44" width="116" color="primary">
                    {{ $t("submit") }}
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-form>
          </v-card>
        </v-dialog>
      </div>
    </template>
  </v-container>
</template>

<script>
import moment from "moment"
import loadingMixin from "@/mixins/LoadingMixin";
import generalMixin from "@/mixins/GeneralMixin";
import PermissionsMixin from "@/mixins/PermissionsMixin";

import UserService from "@/_services/UserService";
import ActivationKeyService from "@/_services/ActivationService.js";
import { getCountries, getStates } from 'country-state-picker'
import _ from "lodash";

export default {
  mounted() {
    const fetchData = async () => {
      this.startLoading();
      this.getCountry();
 
      const [mt] = await Promise.all([
        ActivationKeyService.getAllMemberships(),
      ]);
      this.membershipList = mt.data.listRes;
      // this.departmentList = await this.getDepartments()
      // this.getRoles(this.editedUser.department)
      await this.setEditeduser();
      this.$nextTick(() => {
        if (this.$refs.userEdit) {
          this.$refs.userEdit.validate();
        }
      });
      this.stopLoading();
    };
    fetchData();
  },
  computed: {
    dialog() {
      return this.dialogU;
    },
  },
  data() {
    return {
      finalDate: '',
      extendDays: 0,
      extendReason: "",
      extendPlan: "",
      userRoles: "",
      membershipList: [],
      countries: [],
      states: [],
      valid: true,
      departmentList: [],
      rolesList: [],
      roleLoading: false,
      fieldType: { text: "text" },
      error: false,
      errors: {
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        department: "",
        role: "",
        country: "",
        state: "",
        city: "",
      },
      editedUser: {},
      rules: {
        firstName: [
          (v) =>
            !!v ||
            v != "" ||
            v != null ||
            this.$t("addEdituser.firstNameRequired"),
          (v) => (v && v.length <= 15) || this.$t("addEdituser.firstNameLimit"),
        ],
        lastName: [
          (v) => !!v || this.$t("addEdituser.lastNameRequired"),
          // (v) => this.onlyAlpha(v) || this.$t("addEdituser.lastNameOllyAlpha"),
          (v) => (v && v.length <= 15) || this.$t("addEdituser.lastNameLimit"),
        ],
        department: [(v) => !!v || this.$t("addEdituser.deptRequired")],
        role: [(v) => !!v || this.$t("addEdituser.roleRequired")],
        country: [(v) => !!v || this.$t("addEdituser.countryRequired")],
        state: [(v) => !!v || this.$t("stateIsReq")],
        city: [(v) => !!v || this.$t("cityIsReq")],
        membershipPlan: [
          v => !!v || this.$t('membershipTypeReq'),
        ],
        extendReason: [
          v => !!v || this.$t('extendedReasonReq'),
        ],
        numberOfDays: [
          v => !!v || this.$t('numberOfDaysReq'),
        ],
      },
    };
  },
  methods: {
    filterCountry(item, queryText) {
      const byName = item?.Name.toLowerCase()
      const searchText = queryText.toLowerCase()
      return byName.indexOf(searchText) > -1
    },
    calcExtendedDate() {
      let todayFormatted = moment(new Date()).format('MM-DD-YYYY');
      this.finalDate = moment((this.editedUser.activation && this.editedUser.activation[0] && this.editedUser.activation[0].membershipValidity) || todayFormatted, "MM-DD-YYYY").add(this.extendDays, 'days').format("MM/DD/YYYY");
      console.log(this.finalDate, 'extendedDate')
    },
    closeModal() {
      this.$emit("closeUpdateUser");
    },
    getCountry() {
      this.countries = getCountries()
    },
    getState(val) {
      this.states = getStates(val.code)
      this.country = val
    },
    changeExtendedPlan(val) {
      this.userRoles = val.userRoleMembershipMap.map(item => item.user_role_id).join(', ')
    },
    async setEditeduser() {
      this.editedUser = await _.clone(this.user, true);
      this.finalDate = moment(this.editedUser.activation && this.editedUser.activation[0] && this.editedUser.activation[0].membershipValidity, "MM-DD-YYYY").add(this.editedUser.activation && this.editedUser.activation[0] && this.editedUser.activation[0].membershipExtendedDays, 'days').format("MM/DD/YYYY");

      if (this.finalDate == "Invalid date") {
        this.finalDate = ''
      }
      const _country = this.countries.find(item => item.name === this.editedUser.countryId)
      if (_country) {
        this.getState(_country)
      }

      if (this.editedUser.activation?.[0]) {
        // console.log("i am here")
        this.extendDays = this.editedUser.activation[0].membershipExtendedDays
        this.extendReason = this.editedUser.activation[0].membershipExtensionReason
        this.extendPlan = this.editedUser.activation[0].membership_type
        console.log("-----> ", this.extendDays)

        let currentMembership = this.membershipList.filter(el => {
          if(el.id == this.extendPlan)
            return true
        })

        if(currentMembership.length > 0) {
          this.userRoles = currentMembership[0]?.userRoleMembershipMap.map(item => item.user_role_id).join(', ')
        }
      }

      if (this.editedUser.user_membership?.[0]) {
        // When membership comes from user_membership, set extendPlan and userRoles accordingly
        this.extendPlan = this.editedUser.user_membership[0].id
        let currentMembership = this.membershipList.filter(el => el.id == this.extendPlan)
        if(currentMembership.length > 0) {
          this.userRoles = currentMembership[0]?.userRoleMembershipMap.map(item => item.user_role_id).join(', ')
        }
        console.log("-----> ", this.extendDays)
      }

    },
    updateUser() {
      if (!(this.editedUser.email || this.editedUser.mobile)) {
        this.$notify({
          title: "Please provided either email or mobile",
          type: "error"
        });
        return
      }
      console.log('edited user', this.editedUser)
      if (!this.$refs.userEdit.validate()) return;

      const user = {
        firstName: this.editedUser.firstName,
        lastName: this.editedUser.lastName,
        email: this.editedUser.email,
        countryCode: this.editedUser.countryId.dial_code
          ? this.editedUser.countryId.dial_code
          : "00",
        mobile: this.editedUser.mobile,
        country: typeof this.editedUser.countryId == "object" ? this.editedUser.countryId.name : this.editedUser.countryId,
        state: this.editedUser.stateId,
        district: this.editedUser.district,
        city: this.editedUser.city,
        address: this.editedUser.address,
        status: this.editedUser.active ? 1 : 0,
        userTribe: this.editedUser.userTribe,
        website: this.editedUser.website,
        membershipTypeId: JSON.stringify(this.extendPlan) || JSON.stringify(this.editedUser.activation[0].membership_type),
        membershipExtendedDays: this.extendDays,
        membershipExtensionReason: this.extendReason,
        isMarketPlaceUser: this.isMarketPlaceUser,
      };
      // console.log('userData', user)
      this.startLoading();
      UserService.updateAppUser(this.editedUser.id, user)
        .then((data) => {
          console.log("updatedata", data);
          if (data.success) {
            this.$emit("appUserUpdated", {
              success: true,
              message: data.message,
            });
            this.closeModal()
          }
          else {
            this.$emit('appUserUpdated', { success: false, message: data.message });
          }
          // this.closeModal();
          this.stopLoading();
        })
        .catch((err) => {
          var errors = err.response.data.message.errors[0];
          console.log("err ---> ", err)
          this.$notify({
            title: this.$t("unableToUpdate"),
            text: `${errors.msg} - ${errors.value} for ${errors.param}`,
            type: "error",
          });
          this.stopLoading();
        });
    },

    emptyErrors() {
      this.error = false;
      this.errors.name = "";
      this.errors.email = "";
      this.errors.mobile = "";
      this.errors.department = "";
      this.errors.role = "";
    },
    async getRoles() {
      this.rolesList = [];
      this.roleLoading = true;
      this.rolesList = await this.getRolesList();
      this.roleLoading = false;
    },
    countryMatch(x) {
      // console.log('xx', x.MobileCode, this.editedUser.countryCode)
      if (!this.editedUser.countryCode) return false;
      if (x.MobileCode == this.editedUser.countryCode) return true;

      return false;
    },
  },
  props: {
    dialogU: {
      type: Boolean,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
    isMarketPlaceUser: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  mixins: [loadingMixin, generalMixin, PermissionsMixin],
};
</script>

<style lang="scss">
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

.custom-card {
  background: #ffffff !important;
  box-shadow: 0px 30px 30px rgb(106 119 132 / 41%) !important;
  border-radius: 23px !important;
}

.custom-card .v-card__text {
  width: 100%;
  padding: 37px 60px !important;
}

.card-heading-1 {
  margin-bottom: 28px;
}

.custom-card .v-card__text .card-heading-1 h2 {
  font-size: 30px;
  font-weight: 700;
}

// .custom-card .form {
// 	margin-bottom: 22px;
// }
</style>