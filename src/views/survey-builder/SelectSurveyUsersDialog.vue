<template>
  <v-container>
    <template>
      <div class="text-center">
        <v-dialog v-model="dialog" width="90%" @click:outside="closeModal" :retain-focus="false">
          <v-card class="custom-card" rounded="0">
            <v-toolbar color="primary" class="white--text">
              <v-toolbar-title class="font-weight-bold">
                {{ $t("surveyBuilder.selectSurveyUsers") }}
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon class="white--text" @click="closeModal">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-form ref="addUser" lazy-validation autocomplete="off">
              <v-card-text class="black--text">
                <h3>{{ $t("surveyBuilder.selectToProceed") }}</h3>
                <div class="d-flex align-center">
                  <div class="d-flex align-content-center">
                    <div class="user-selected">
                      <span class="white--text font-weight-bold">{{ (this.dataFiltered && this.selectFiltered ? getFilteredCount : selected.length || 0) }}</span>
                    </div>
                    <div class="title ml-3"> {{ $t("surveyBuilder.usersSelected") }} </div>
                  </div>
                  <v-spacer></v-spacer>
                  <v-btn v-if="dataFiltered && !loading" class="mr-2" small elevation="0" color="primary" @click="selectUser">{{ $t("surveyBuilder.selectAllFiltered") }}</v-btn>
                  <v-btn v-if="selected.length" outlined small elevation="0" color="primary" @click="clearUser">{{ $t("surveyBuilder.clearSelection") }}</v-btn>
                  <v-spacer></v-spacer>
                  <div class="py-1 title">{{ $t("surveyBuilder.conditional") }}</div>
                  <v-btn class="mx-2" icon color="primary" @click="openAutoCondtions">
                    <v-icon dark large>
                      mdi-cog
                    </v-icon>
                  </v-btn>
                  <div class="py-1 title">{{ $t("filterBy") }}</div>
                  <v-btn class="mx-2" icon color="primary" @click="showFilters = true">
                    <v-icon dark large>
                      mdi-filter
                    </v-icon>
                  </v-btn>

                </div>
                <v-data-table @click:row="rowClicked" @item-selected="toggleCheckBox"
                :footer-props="{
                  'items-per-page-options': itemsPerPageOptions,
                  'show-first-last-page': true,
                  'show-current-page': true,
                  'items-per-page-text': 'Users per page',
                }" :headers="headers" :loading="loading" :loading-text="'Loading Users...'" :items="users"
                  :items-per-page="itemsPerPage" :options.sync="tableOptions" :show-select="true" class="elevation-1"
                  hide-default-footer v-model="selected">
                  <template v-slot:top>
                    <div class="d-flex mt-5">
                      <v-text-field prepend-inner-icon="mdi-magnify" outlined :placeholder="$t('surveyBuilder.searchUsers')" dense
                        v-model="search" @click:append="searchUsers" @input="searchUsers" class="shrink">
                      </v-text-field>
                      <v-spacer></v-spacer>
                      <div class="py-3">
                        {{ (currentPage - 1) * 10 }} - {{ currentPage * 10 }} of
                        {{ totalCount }}
                      </div>
                      <v-btn class="mx-2" fab small outlined color="primary" :disabled="currentPage === 1"
                        @click="pageChangePrev(false)">
                        <v-icon dark> mdi-chevron-left </v-icon>
                      </v-btn>
                      <v-btn class="mx-2" fab small outlined color="primary"
                        :disabled="users.length < itemsPerPage" @click="pageChange(true)">
                        <v-icon dark> mdi-chevron-right </v-icon>
                      </v-btn>
                    </div>
                  </template>
                  <template v-slot:item.active="{ item }">
                    <div :class="item.active == 1 ? 'green-text' : 'red-text'">
                      {{ item.active == 1 ? "Active" : "Deactivated" }}
                    </div>
                  </template>

                  <template v-slot:item.fullName="{ item }">
                    {{ item.fullName }}
                  </template>

                  <template v-slot:item.email="{ item }">
                    {{ item.email }}
                  </template>

                  <template v-slot:item.membershipType="{ item }">
                    {{
                      (item.activation && item.activation.length)
                      ? item.activation[0].membership_assoc.membership_type
                      : "N/A"
                    }}
                  </template>

                  <template v-slot:item.membershipValidity="{ item }">
                    <div class="d-flex">
                      <div
                        :class="(item.activation && item.activation.length) && compareDate(item.activation[0].membershipValidity) ? 'green-box' : 'red-box'">
                      </div>
                      {{
                        (item.activation && item.activation.length)
                        ? formatDate(
                          item.activation[0].membershipValidity
                        )
                        : "N/A"
                      }}
                    </div>

                  </template>
                </v-data-table>
                <v-divider class="mt-5"></v-divider>
                <v-card-actions class="mt-10" style="padding-right: 0">
                  <v-spacer></v-spacer>
                  <v-btn outlined class="mr-2" right height="44" width="116" depressed color="primary"
                    @click="closeModal">
                    {{ $t("surveyBuilder.cancel") }}
                  </v-btn>

                  <v-btn right height="44" width="116" color="primary" :disabled="!selected.length" @click="onContinueClick()">
                    {{ $t("surveyBuilder.continue") }}
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-form>
          </v-card>
        </v-dialog>
      </div>
    </template>
    <v-dialog v-model="showFilters" width="356" @click:outside="closeFilter" content-class="my-custom-dialog"
      transition="dialog-bottom-transition">
      <v-card min-height="100vh" class="" rounded="0">
        <v-toolbar color="primary" class="white--text" flat :elevation="0">
          <v-toolbar-title class="font-weight-bold">{{
            showAutoCondtion ? this.$t("autoCondition") : this.$t("filterBy")
          }}</v-toolbar-title>
          <v-spacer></v-spacer>

          <v-btn icon class="white--text" @click="closeFilter">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pt-5">
          <v-row no-gutters>
            <v-col cols="12">
              <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">{{
                this.$t("surveyBuilder.membershipType")
              }}</label>
              <v-select :items="membershipList" item-text="membership_type" item-value="id" outlined dense
                placeholder="Select" v-model="filterParam.membership_type" @change="memberRoles"></v-select>
            </v-col>
            <!-- ROLE FIELD -->
            <v-col cols="12" v-if="!showAutoCondtion">
              <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">{{
                this.$t("surveyBuilder.membershipRole")
              }}</label>
              <v-select :items="membershipRoles" item-text="name" item-value="id" outlined dense placeholder="Select"
                v-model="filterParam.membership_role" :loading="memberRolesLoading"></v-select>
            </v-col>
            <!-- GENDER FIELD -->
            <v-col cols="12"  v-if="!showAutoCondtion">
              <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">{{
                this.$t("reports.gen")
              }}</label>
              <v-select :items="genderList" item-text="text" item-value="value" outlined dense
                placeholder="Select" v-model="filterParam.gender"></v-select>
            </v-col>
            <!-- COUNTRY FIELD -->
            <v-col cols="12"  v-if="!showAutoCondtion">
              <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">{{
                this.$t("country")
              }}</label>
              <v-autocomplete :items="countries" item-text="name" item-value="name" outlined dense
                placeholder="Select" v-model="filterParam.country" @change="getState" return-object></v-autocomplete>
            </v-col>

            <!-- REGION FIELD -->
            <v-col cols="12"  v-if="!showAutoCondtion">
              <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">{{
                this.$t("userslist.regionState")
              }}</label>
               <!-- <v-text-field
                  v-model="filterParam.stateId"
                  :placeholder="$t('provinceState')"
                  outlined
                  dense
                ></v-text-field> -->
                <v-autocomplete outlined dense v-model="filterParam.stateId" :items="states"
                :placeholder="$t('provinceState')"
                return-object
                >
                </v-autocomplete>
            </v-col>

            <v-col cols="12" v-if="filterParam.membership_validity == 'custom'">
              <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">{{
                this.$t("surveyBuilder.membershipRemainingDays")
              }}</label>
              <v-text-field outlined min="1" dense type="number" value="" v-model="filterParam.membershipRemainingDays">
              </v-text-field>
            </v-col>


            <v-col cols="12">
              <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">{{
                this.$t("surveyBuilder.accountProgress")
              }}</label>
              <v-select :items="accountProgress" item-text="text" item-value="value" outlined dense placeholder="Select"
                v-model="filterParam.account_progress"></v-select>
            </v-col>

            <v-col cols="12" v-if="!showAutoCondtion">
              <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">{{
                this.$t("userslist.registrationDate")
              }}</label>
              <v-menu v-model="openStartDate" :close-on-content-click="false" :nudge-right="40"
                transition="slide-y-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field append-icon="mdi-calendar" outlined v-model="filterParam.startDate"
                    dense readonly v-bind="attrs" v-on="on" v-on:click:append="openStartDate = true"
                    :placeholder="$t('surveyBuilder.startDate')" clearable></v-text-field>
                </template>
                <v-date-picker v-model="filterParam.startDate"  @input="openStartDate = false"></v-date-picker>
              </v-menu>
              <v-menu v-model="openEndDate" :close-on-content-click="false" :nudge-right="40"
                transition="slide-y-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field append-icon="mdi-calendar" outlined v-model="filterParam.endDate"
                    dense readonly v-bind="attrs" v-on="on" v-on:click:append="openEndDate = true"
                    :placeholder="$t('surveyBuilder.endDate')" clearable></v-text-field>
                </template>
                <v-date-picker v-model="filterParam.endDate"  @input="openEndDate = false"></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" v-if="showAutoCondtion">
              <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">{{
                this.$t("surveyBuilder.conditionStatus")
              }}</label>
              <div>
                {{ this.$t("surveyBuilder.conditionStatusDesc") }}
              </div>
              <div class="d-flex align-center justify-space-around">
                <span class="active-label">Active</span>
                <v-switch inset v-model="filterParam.condtionStatus"></v-switch>
              </div>

            </v-col>
          </v-row>
          <v-row class="mt-5" v-if="!showAutoCondtion">
            <v-col cols="12" class="d-flex justify-space-around">
              <v-btn outlined @click="clearFilters" width="130" color="primary">
                {{ this.$t("clearAll") }}
              </v-btn>
              <v-btn width="130" @click="searchWithFilter" color="primary">
                {{ this.$t("search") }}
              </v-btn>
            </v-col>
          </v-row>
          <v-row class="mt-5" v-if="showAutoCondtion">
            <v-col cols="12" class="d-flex justify-space-around">
              <v-btn outlined @click="clearFilters" width="130" color="primary">
                {{ this.$t("clearAll") }}
              </v-btn>
              <v-btn width="130" @click="saveAutoCondition" :loading="filterLoading" color="primary">
                {{ this.$t("save") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import SurveyBuilderService from "@/_services/SurveyBuilderService";
import ActivationKeyService from "@/_services/ActivationService.js";
import moment from "moment";
import UserService from "@/_services/UserService";
// import { countries } from "@/constants/countries.js";
import { getCountries, getStates } from 'country-state-picker'

export default {
  data() {
    return {
      openStartDate: false,
      openEndDate: false,
      countries:[],
      states: [],
      showFilters: false,
      showAutoCondtion: false,
      loading: false,
      filterLoading: false,
      menu: false,
      debounce: null,
      membershipList: [],
      membershipRoles:[],
      memberRolesLoading: false,
      filterParam: {
        membership_type: "",
        membership_role: "",
        membership_validity: "",
        membershipRemainingDays: 0,
        account_progress: "",
        condtionStatus: false,
        country:"",
        stateId:"",
        startDate: "",
        endDate: "",
      },
      surveys: [],
      users: [],
      currentPage: 1,
      pageLimit: 10,
      selected: [],
      membershipValidity: [
        { text: "Less Then 1 Month", value: "lessThen1Month" },
        { text: "1-8 Months", value: "1-8Months" },
        { text: "6-12 Months", value: "6-12Months" },
        { text: "More Than 1 Year", value: "moreThan1Year" },
        { text: "Expired", value: "expired" },
        { text: "Custom", value: "custom" },
      ],
      accountProgress: [
        { text: '25%', value: 25 },
        { text: '30%', value: 30 },
        { text: '45%', value: 45 },
        { text: '60%', value: 60 },
        { text: '75%', value: 75 },
        { text: '80%', value: 80 },
        { text: '100%', value: 100 },
      ],
      genderList: [
        { text: 'Male', value: 'male' },
        { text: 'Female', value: 'female' },
        { text: 'Other', value: 'other' },
      ],
      headers: [
        {
          text: this.$t("surveyBuilder.userName"),
          align: "start",
          sortable: true,
          value: "fullName",
        },
        {
          text: this.$t("surveyBuilder.email"),
          align: "start",
          sortable: true,
          value: "email",
        },
        {
          text: this.$t("surveyBuilder.membershipType"),
          align: "start",
          sortable: true,
          value: "membershipType",
        },
        {
          text: this.$t("surveyBuilder.membershipValidity"),
          align: "start",
          sortable: true,
          value: "membershipValidity",
        },
        {
          text: this.$t("surveyBuilder.status"),
          align: "center",
          sortable: true,
          value: "active",
        },
      ],
      count: 0,
      from: 0,
      to: 0,
      totalCount: 0,
      totalPages: 1,
      pageCount: 0,
      itemsPerPage: 10,
      search: "",
      tableOptions: {},
      active: false,
      itemsPerPageOptions: [5, 10, 25, 50],
      dataFiltered: false,
      selectFiltered: false,
      unselectedFilteredUser: [],
    };
  },
  computed: {
    dialog() {
      return this.dialogI;
    },
    getFilteredCount() {
      let intCount = parseInt(this.totalCount);
      let unselectedUser = parseInt(this.unselectedFilteredUser.length);
      return intCount - unselectedUser
    }
  },
  props: {
    dialogI: {
      type: Boolean,
      required: true,
    },
    preCondition: {
      type: Object,
    },
    selectedUsers: {
      type: Array,
    }
  },
  async created() {
    if (this.preCondition.condtionStatus) {
      this.filterParam.id = this.preCondition.id;
      this.filterParam.user_id = this.preCondition.user_id;
      this.filterParam.membership_type = this.preCondition.membership_type;
      this.filterParam.membership_validity = this.preCondition.membership_validity;
      this.filterParam.account_progress = this.preCondition.account_progress;
      this.filterParam.membershipRemainingDays = this.preCondition.membershipRemainingDays;
      this.filterParam.condtionStatus = this.preCondition.condtionStatus;
    }
  },
  async mounted() {
    this.getCountry();
    this.getUsers();
    const fetchData = async () => {
      const [mt] = await Promise.all([
        ActivationKeyService.getAllMemberships(),
      ]);
      this.membershipList = mt.data.listRes;
    };
    fetchData();
    if (this.$props.selectedUsers) {
      this.selected = this.$props.selectedUsers ? this.$props.selectedUsers?.map(item => item?.users || item) : []
    }
    this.getUserAutoCondition();

    this.memberRoles();
  },
  methods: {
    getCountry() {
        this.countries = getCountries()
    },
    getState(val) {
      console.log({val})
        this.states = getStates(val.code)
    },
    async getUsers(isAutoConfition) {
      this.loading = true;
      let params = this.filterParam;
      if (isAutoConfition && isAutoConfition === 'disabled') {
        params = {
          ...this.filterParam,
          membership_type : "",
          membership_validity : "",
          account_progress : "",
          membershipRemainingDays : null,
        }
      }
      await SurveyBuilderService.getSurveyUsers(this.currentPage, this.search, params)
        .then((res) => {
          this.users = res.data.rows;
          if (this.dataFiltered && this.selectFiltered) {
            this.selected = [...this.selected, ...this.users] 

            // removing dupicate users
            const uniqueMap = this.selected.reduce((acc, obj) => {
              acc[obj.id] = obj;
              return acc;
            }, {});
            this.selected = Object.values(uniqueMap);
          }
          this.totalCount = res.data.count;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        })
        .finally(() => {
          this.loading = false;
        })
    },
    async getUserAutoCondition() {
      await SurveyBuilderService.getSurveyUserAutoConditon()
        .then((res) => {
          this.filterParam.id = res.data.id;
          this.filterParam.user_id = res.data.user_id;
          this.filterParam.membership_type = res.data.membershipTypeId === 0 ? '' : res.data.membershipTypeId;
          this.filterParam.membership_validity = res.data.membershipValidity;
          this.filterParam.account_progress = res.data.accountProgress;
          this.filterParam.membershipRemainingDays = res.data.remainingDays;
          this.filterParam.condtionStatus = res.data.condtionStatus;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    clearUser() {
      this.selected = [];
      this.dataFiltered = false;
      this.selectFiltered = false;
    },
    toggleCheckBox({item, value}) {
      if (!value && this.selectFiltered) {
        this.selected = this.selected.filter((user) => user.id !== item.id)
        this.unselectedFilteredUser.push(item.id)
      } else {
        this.unselectedFilteredUser = this.unselectedFilteredUser.filter((user) => user !== item.id)
      }
    },
    selectUser() {
      this.selectFiltered = true;
      this.selected = this.users;
    },
    closeFilter() {
      this.showFilters = false;
      this.showAutoCondtion = false;
    },
    openAutoCondtions() {
      this.showFilters = true;
      this.showAutoCondtion = true;
    },
    closeModal() {
      this.$emit("closeDialog");
      this.resetGoalSubjectForm("all");
    },
    rowClicked(item) {
      console.log(item);
    },
    onContinueClick() {
      this.$emit("userSelected", 
        this.selected,
        this.selectFiltered,
        this.unselectedFilteredUser,
        this.filterParam
      );
    },
    pageChange() {
      this.currentPage++;
      this.getUsers();
    },
    pageChangePrev() {
      this.currentPage--;
      this.getUsers();
    },
    formatDate(date) {
      return moment(date).format("DD-MMM-YYYY");
    },
    compareDate(date) {
      return moment().isBefore(date)
    },
    searchUsers(val) {
      this.currentPage = 1;
      clearTimeout(this.debounce);
      this.debounce = setTimeout(async () => {
        let isAutoConfition;
        if (!this.filterParam.condtionStatus) {
          isAutoConfition = "disabled";
        }
        this.search = val;
        this.getUsers(isAutoConfition);
      }, 700)
    },
    searchWithFilter() {
      this.currentPage = 1;
      this.dataFiltered = true;
      this.closeFilter();
      this.getUsers();
    },
    clearFilters() {
      this.dataFiltered = false;
      this.filterParam.membership_type = "";
      this.filterParam.membership_validity = "";
      this.filterParam.membership_role = "";
      this.filterParam.account_progress = "";
      this.filterParam.membershipRemainingDays = null;
      this.filterParam.gender = "";
      this.filterParam.country = "";
      this.filterParam.stateId = "";
      this.filterParam.startDate = "";
      this.filterParam.endDate = "";
      this.selectFiltered = false;
      this.closeFilter();
      this.getUsers();
    },
    cancelAutoCondition() {
      this.closeFilter();
    },
    async saveAutoCondition() {
      this.currentPage = 1;
      try {
        this.filterLoading = true;
        let payload = {
          membershipTypeId: this.filterParam.membership_type,
          membershipValidity: this.filterParam.membership_validity,
          remainingDays: this.filterParam.membershipRemainingDays,
          condtionStatus: this.filterParam.condtionStatus,
          accountProgress: parseInt(this.filterParam.account_progress)
        }
        if (this.filterParam.id) {
          payload.id = this.filterParam.id
          payload.user_id = this.filterParam.user_id
          const { data } = await this.$http.put("/surveys/auto-condition", payload)
          if (data && data.code === 200) {
            this.$notify({
              title: "User Auto Condtion updated successfully.",
              type: "success",
            });
          }
        } else {
          const { data } = await this.$http.post("/surveys/auto-condition", payload)
          if (data && data.code === 200) {
            this.$notify({
              title: "User Auto Condtion added successfully.",
              type: "success",
            });
          }
        }
      } catch (error) {
        console.log(error)
        this.$notify({
          title: "Auto Condtion Error.",
          type: "error",
        });
      }
      this.getUsers()
      this.filterLoading = false;
      this.closeFilter();
    },
    memberRoles(){
      this.memberRolesLoading = true
      UserService.getAppUsersRoles(this.filterParam.membership_type).then((data)=>{
        this.memberRolesLoading = false;
        console.log(data);
        this.membershipRoles = data;
      })
    }
  },
};
</script>
  
<style>
.my-custom-dialog {
  position: absolute;
  top: 0;
  min-height: 100%;
  right: 0;
  margin-right: 0px;
  margin-top: 0px;
}

.green-text {
  color: #006400;
}

.red-text {
  color: #FF0000;
}

.red-box {
  background: #FF0000;
  border-radius: 2px;
  width: 17px;
  height: 16px;
  margin-right: 10px;
}

.green-box {
  border-radius: 2px;
  width: 17px;
  height: 16px;
  background: #006400;
  margin-right: 10px;
}

.user-selected {
  width: 31px;
  height: 31px;
  background: #00BD73;
  display: flex;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
}

.active-label {
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: 0.67px;
  color: #000000;
}
</style>
  