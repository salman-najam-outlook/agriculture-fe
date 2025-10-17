<template>
  <v-container>
    <v-dialog v-model="dialog" width="900" @click:outside="closeModal" v-if="!nextDialog">
      <v-card rounded="0">
        <v-toolbar color="primary" class="white--text" flat>
          <v-toolbar-title class="font-weight-bold"
            >{{ $t('membershipplanSection.addMembershipPlan') }}</v-toolbar-title
          >

          <v-spacer></v-spacer>

          <v-btn icon class="white--text" @click="closeModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-form
          autocomplete="off"
          @submit.prevent="addMembership"
          ref="membershipform"
          v-model="valid"
        >
          <v-card-text class="black--text">
            <v-row>
              <v-col cols="6">
                <label class="title" for="name"
                  >{{ $t('activationKey.membershipPlan') }}<span class="red--text">*</span></label
                >
                <v-text-field
                  outlined
                  dense
                  v-model.trim="membership.type"
                  :rules="membershipRules.type"
                  :error-messages="membershipPlanError"
                  :placeholder="$t('enterHere')"
                >
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <label class="title" for="plantype"
                  >{{ $t('membershipplanSection.planType') }}</label
                >
                <v-autocomplete
                  outlined
                  :items="planTypes" item-text="label" item-value="value"
                  dense
                  v-model.trim="membership.plan_type"
                  :placeholder="$t('membershipplanSection.selectPlan')"
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="10">
                <label class="title" for="name"
                  >{{$t('userRole')}}<span class="red--text">*</span></label
                >
                <v-row class="pa-3" justify="center" align="center">
                  <v-col class="pa-1 mt-n2" v-for="item in roles" :key="item.label">
                    <v-checkbox 
                      class="text-no-wrap" 
                      :label="item.name" 
                      :value="item.id" 
                      v-model="selectedRoles">
                    </v-checkbox>
                  </v-col>
                </v-row>
                <!-- <v-select
                  :items="roles"
                  item-value="id"
                  item-text="name"
                  outlined
                  dense
                  v-model="membership.userRoleId"
                  :rules="membershipRules.role"
                  :error-messages="descriptionError"
                  placeholder="Select here"
                >
                </v-select> -->
              </v-col>
              <v-col cols="12" class="mt-n7">
                <label class="title" for="name"
                  >{{ $t('adminRoles.description')}}<span class="red--text">*</span></label
                >
                <v-textarea
                  v-model.trim="membership.description"
                  :placeholder="$t('adminRoles.enterDesHere')"
                  outlined
                  rows="3"
                  counter="40"
                  :rules="membershipRules.description"
                  class="description-text"
                ></v-textarea>
              </v-col>

              <!-- <v-col cols="6">
                <label class="title" for="name"
                  >{{ $t('membershipplanSection.noOfUsersAllowed') }}</label
                >
                <v-text-field
                  outlined
                  dense
                  v-model.trim="membership.allowed_users"
                  :placeholder="$t('enterHere')"
                >
                </v-text-field>
              </v-col>

              <v-col cols="6">
                <label class="title" for="name"
                  >{{ $t('membershipplanSection.noOfFarms') }}</label
                >
                <v-text-field
                  outlined
                  dense
                  v-model.trim="membership.allowed_farms"
                  :placeholder="$t('enterHere')"
                >
                </v-text-field>
              </v-col> -->

              <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 mt-n7">
                <label class="title" for="name"
                  >{{ $t('membershipplanSection.accessSetelite')}}</label
                >
                <v-row class="d-flex" no-gutters>
                  <v-col cols="8">
                    <v-text-field
                      outlined
                      dense
                      v-model="membership.satelliteReport"
                      :rules="membershipRules.satelliteReport"
                      :placeholder="$t('enterHere')"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <v-btn
                      elevation="0"
                      dense
                      block
                      style="margin-left: -1px"
                      class="rounded-l-0 report-btn"
                      >{{ $t("set") }}</v-btn
                    >
                  </v-col>
                </v-row>
              </div>
              <!-- <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 mt-n7">
                <label class="title" for="name"
                  >{{ $t('membershipplanSection.accessSetelite')}}</label
                >
                <v-row class="d-flex" no-gutters>
                  <v-col cols="4">
                    <v-text-field
                      outlined
                      dense
                      v-model="membership.satelliteReport"
                      :rules="membershipRules.satelliteReport"
                      :placeholder="$t('enterHere')"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <v-autocomplete
                      :items="reportTypes"
                      item-text="label"
                      item-value="value"
                      dense
                      outlined
                      style="margin-left: -1px;border-left: 0 !important;"
                      class="rounded-r-0"
                      v-model="membership.satelliteReportTypeUnit"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="4">
                    <v-btn
                      @click="showSatelliteReportDialog"
                      elevation="0"
                      dense
                      block
                      style="margin-left: -1px"
                      class="rounded-l-0 report-btn"
                      >{{ $t("set") }}</v-btn
                    >
                  </v-col>
                </v-row>
              </div> -->

              <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 mt-n7">
                <label class="title" for="name"
                  >{{ $t('membershipplanSection.accessAdvanceReport')}}</label
                >
                <v-text-field
                  outlined
                  dense
                  v-model="membership.advancedReport"
                  :rules="membershipRules.advancedReport"
                  :placeholder="$t('enterHere')"
                >
                </v-text-field>
              </div>

              <!-- <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 mt-n7">
                <label class="title" for="name"
                  >{{ $t('membershipplanSection.accessAdvanceReport')}}</label
                >
                <v-row no-gutters>
                  <v-col cols="4">
                    <v-text-field
                      outlined
                      dense
                      class="rounded-r-0"
                      v-model="membership.advancedReport"
                      :rules="membershipRules.advancedReport"
                      :placeholder="$t('enterHere')"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <v-autocomplete
                      :items="reportTypes"
                      item-text="label"
                      item-value="value"
                      dense
                      outlined
                      style="margin-left: -1px;border-left: 0 !important;"
                      class="rounded-r-0"
                      v-model="membership.advanceReportTypeUnit"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="4">
                    <v-select
                      :items="durations"
                      item-text="name"
                      item-value="value"
                      dense
                      outlined
                      style="margin-left: -1px"
                      class="rounded-l-0 select-duration"
                      v-model="membership.advancedReportUnit"
                    ></v-select>
                  </v-col>
                </v-row>
              </div> -->
              <v-row class="px-3 py-2">
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 mt-n7">
                <label class="title" for="name"
                  >{{ $t('membershipplanSection.accessToDeforestationReport')}}</label
                >
                <v-row class="d-flex" no-gutters>
                  <v-col cols="4">
                    <v-text-field
                      outlined
                      dense
                      v-model="membership.deforestationReport"
                      :placeholder="$t('enterHere')"
                      class="rounded-r-0"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <v-autocomplete
                      :items="reportTypes"
                      item-text="label"
                      item-value="value"
                      dense
                      outlined
                      style="margin-left: -1px;border-left: 0 !important;"
                      class="rounded-r-0"
                      v-model="membership.deforestationReportTypeUnit"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="4">
                    <v-select
                      :items="durations"
                      item-text="name"
                      item-value="value"
                      dense
                      outlined
                      style="margin-left: -1px"
                      class="rounded-l-0 select-duration"
                      v-model="membership.deforestationReportUnit"
                    ></v-select>
                  </v-col>
                </v-row>
              </div>
              </v-row>
              <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 mt-n7">
                <label class="title" for="name"
                  >{{ $t('membershipplanSection.planDuration')}}<span class="red--text">*</span></label
                >
                <v-row class="d-flex" no-gutters>
                  <v-col cols="8">
                    <v-text-field
                      outlined
                      dense
                      v-model="membership.duration"
                      :rules="membershipRules.duration"
                      :placeholder="$t('enterHere')"
                      class="rounded-r-0"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <v-select
                      :items="durations"
                      item-text="name"
                      item-value="value"
                      dense
                      outlined
                      style="margin-left: -1px"
                      class="rounded-l-0 select-duration"
                      v-model="membership.durationUnit"
                    ></v-select>
                  </v-col>
                </v-row>
              </div>

              <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 mt-n7">
                <label class="title" for="name"
                  >{{ $t('membershipplanSection.planFee')}}<span class="red--text">*</span></label
                >
                <v-text-field
                  type="number"
                  outlined
                  dense
                  v-model="membership.fee"
                  :rules="membershipRules.fee"
                  :placeholder="$t('enterHere')"
                >
                  <template v-slot:prepend-inner>
                    <v-icon>mdi-currency-usd</v-icon>
                  </template>
                </v-text-field>
              </div>
              <!-- <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 mt-n7">
                <label class="title" for="name"
                  >{{ $t('membershipplanSection.planFee')}}<span class="red--text">*</span></label
                >

                <v-row class="d-flex" no-gutters>
                  <v-col cols="8">
                    <v-text-field
                      type="number"
                      outlined
                      dense
                      v-model="membership.fee"
                      :rules="membershipRules.fee"
                      :placeholder="$t('enterHere')"
                    >
                      <template v-slot:prepend-inner>
                        <v-icon>mdi-currency-usd</v-icon>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <v-select
                      :items="durations"
                      item-text="name"
                      item-value="value"
                      dense
                      outlined
                      style="margin-left: -1px"
                      class="rounded-l-0 select-duration"
                      v-model="membership.feeUnitType"
                    ></v-select>
                  </v-col>
                </v-row>
              </div> -->
            </v-row>

            <hr class="mt-4" />

            <v-card-actions class="mt-10">
              <v-spacer></v-spacer>
              <v-btn
                class=""
                outlined
                color="primary"
                @click="closeModal"
                width="112"
              >
                {{ $t('cancel') }}
              </v-btn>
              <v-btn
                width="112"
                color="primary"
                type="submit"
                class="btn-11 btn-22"
              >
                {{ $t('submit') }}
              </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog v-model="satelliteReportDialog" width="900" v-if="nextDialog">
      <v-card rounded="0">
        <v-toolbar color="primary" class="white--text" flat>
          <v-toolbar-title class="font-weight-bold"
            >{{ $t('membershipplanSection.satelliteReportPackage') }}</v-toolbar-title
          >

          <v-spacer></v-spacer>

          <v-btn icon class="white--text" @click="closeSatelliteReportDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="black--text">
            <v-row>
              <v-col cols="6">
                <label class="title" for="name"
                  >{{ $t('membershipplanSection.basicFarmLevelReports') }}</label
                >
                <v-text-field
                  outlined
                  dense
                  v-model.trim="membership.basicFarmLevelReport"
                  :placeholder="$t('enterHere')"
                >
                </v-text-field>
              </v-col>
             
              <v-col cols="6">
                <label class="title" for="name"
                  >{{ $t('membershipplanSection.advancedFarmLevelReports') }}</label
                >
                <v-text-field
                  outlined
                  dense
                  v-model.trim="membership.advancedFarmLevelReport"
                  :placeholder="$t('enterHere')"
                >
                </v-text-field>
              </v-col>

              <v-col cols="6">
                <label class="title" for="name"
                  >{{ $t('membershipplanSection.largeAreaReports') }}</label
                >
                <v-text-field
                  outlined
                  dense
                  v-model.trim="membership.largeAreaReport"
                  :placeholder="$t('enterHere')"
                >
                </v-text-field>
              </v-col>
            </v-row>

            <hr class="mt-4" />

            <v-card-actions class="mt-10">
              <v-spacer></v-spacer>
              <v-btn
                class=""
                outlined
                color="primary"
                @click="closeSatelliteReportDialog"
                width="112"
              >
                {{ $t('cancel') }}
              </v-btn>
              <v-btn
                @click="closeSatelliteReportDialog"
                width="112"
                color="primary"
                class="btn-11 btn-22"
              >
                {{ $t('continue') }}
              </v-btn>
            </v-card-actions>
          </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import loading from "@/mixins/LoadingMixin";

export default {
  created() {
    const fetchData = async () => {
      await this.getMembershipRoles();
    };
    fetchData();
  },
  computed: {
    dialog: {
      get() {
        return this.dialogI;
      },
      set() {
        return this.dialogI;
      },
    },
    userStoreRole(){
      return this.$store.state.auth.user.user_role_assoc
    }
  },
  data() {
    return {
      nextDialog: false,
      roles: [],
      userRoles: [
        {
          label: this.$t('farmer'),
          value: false,
        },
        {
          label: this.$t('warehouse'),
          value: false,
        },
        {
          label: this.$t('buyingStation'),
          value: false,
        },
        {
          label: this.$t("dryMillingStation"),
          value: false,
        },
      ],
      planTypes:[
        {
          label:this.$t("membershipplanSection.enterprise"),
          value:"enterprise"
        },
        {
          label:this.$t("global"),
          value:"global"
        },
      ],
      reportTypes:[
        {
          label:this.$t("membershipplanSection.perUser"),
          value:"per_user"
        },
        {
          label:this.$t("membershipplanSection.perFarm"),
          value:"per_farm"
        },
      ],
      selectedRoles: [],
      valid: true,
      durations: [
        { name: this.$t("Day/s") , value: "day(s)" },
        { name: this.$t("Week/s") , value: "week(s)" },
        { name: this.$t("Month/s") , value: "month(s)" },
        { name: this.$t("Year/s") , value: "year(s)" },
      ],
      reportSets: [{ name: "Set", value: "Set" }],
      membership: {
        type: "",
        description: "",
        satelliteReport: "0",
        advancedReport: "0",
        duration: "0",
        durationUnit: "day(s)",
        fee: "0",
        userRoleId: null,
        plan_type:"enterprise",
        feeUnitType:"day(s)",
        allowed_users:0,
        allowed_farms:0,
        advanceReportTypeUnit:"per_user",
        advancedReportUnit:"day(s)",
        satelliteReportTypeUnit:"per_user",
        deforestationReport:0,
        deforestationReportTypeUnit:"per_user",
        deforestationReportUnit:"day(s)",
        basicFarmLevelReport:0,
        advancedFarmLevelReport:0,
        largeAreaReport:0,
      },
      satelliteReportDialog: false,
      membershipPlanError: "",
      descriptionError: "",
      membershipRules: {
        type: [
          (v) => !!v.trim() || this.$t('membershipplanSection.memPlanReq'),
          (v) =>
            (v && v.length <= 20) ||
            this.$t('membershipplanSection.memPlanReqLimit'),
        ],
        description: [
          (v) => !!v || this.$t('adminRoles.desReq'),
          (v) =>
            (v && v.length <= 40) ||
            this.$t('adminRoles.desLimit'),
        ],
        satelliteReport: [
          (v) => !!v || this.$t('membershipplanSection.SatelliteReq'),
          (v) => v >= 0 || this.$t('membershipplanSection.cantLesThenZero'),
        ],
        advancedReport: [
          (v) => !!v || this.$t('membershipplanSection.advancedReportReq'),
          (v) => v >= 0 || this.$t('membershipplanSection.cantLesThenZero'),
        ],
        duration: [
          (v) => !!v || this.$t('membershipplanSection.durationReq'),
          (v) => v >= 0 || this.$t('membershipplanSection.cantLesThenZero'),
        ],
        fee: [
          (v) => !!v || this.$t('membershipplanSection.feeReq'),
          (v) => v >= 0 || this.$t('membershipplanSection.cantLesThenZero'),
        ],
        role: [(v) => !!v || this.$t('membershipplanSection.roleReq')],
      },
    };
  },
  methods: {
    showSatelliteReportDialog(){
      this.nextDialog=true;
      this.satelliteReportDialog=true;
    },
    closeSatelliteReportDialog(){
      this.nextDialog=false;
      this.satelliteReportDialog = false;
    },
    async getMembershipRoles() {
      this.startLoading();
      try {
        const { data } = await this.$http.get("/user/membership/user-role");
        this.roles = data.data.listRes.filter(x => {
           if(this.userStoreRole[0].id  == 'oma_oma_admin' ){
             return true
           }else{
            if(x.id == 'avocado_farmer'){
              return false
            }
            return true
           }
        });
        this.stopLoading();
      } catch (e) {
        console.log(e);
        this.stopLoading();
      }
    },
    closeModal() {
      this.$emit("closeAddMembership");
    },
    async addMembership() {
      if (!this.$refs.membershipform.validate()) return;
      this.startLoading();

      try {
        const { data } = await this.$http.post("user/membership", {
          membershipType: this.membership.type,
          description: this.membership.description,
          membershipDuration: this.membership.duration,
          membershipDurationUnit: this.membership.durationUnit,
          membershipFee: this.membership.fee,
          satelliteReport: this.membership.satelliteReport,
          advancedReport: this.membership.advancedReport,
          userRoleId: this.selectedRoles,

          plan_type:this.membership.plan_type,
          feeUnitType:this.membership.feeUnitType,
          allowed_users:this.membership.allowed_users,
          allowed_farms:this.membership.allowed_farms,
          advanceReportTypeUnit:this.membership.advanceReportTypeUnit,
          advancedReportUnit:this.membership.advancedReportUnit,
          satelliteReportTypeUnit:this.membership.satelliteReportTypeUnit,
          deforestationReport:this.membership.deforestationReport,
          deforestationReportTypeUnit:this.membership.deforestationReportTypeUnit,
          deforestationReportUnit:this.membership.deforestationReportUnit,
          basicFarmLevelReport:this.membership.basicFarmLevelReport,
          advancedFarmLevelReport:this.membership.advancedFarmLevelReport,
          largeAreaReport:this.membership.largeAreaReport,
        });
        if (data && data.code === 200) {
          this.$notify({
            title: "Membership Added successfully.",
            type: "success",
          });
          this.$emit("membership:added", true);
          this.stopLoading();
        } else {
          this.$notify({
            title: this.$t('somethingWentWrong'),
            type: "error",
          });
          this.stopLoading();
        }
        this.stopLoading();
      } catch (err) {
        console.log("ERR", err);
        this.$notify({
          title: this.$t('somethingWentWrong'),
          type: "error",
        });
        this.stopLoading();
      }
    },
  },

  props: ["dialogI"],
  mixins: [loading],
};
</script>
<style lang="scss" scoped>
::v-deep .select-duration .v-input__control .v-input__slot {
  background-color: $primary-color;
  border-color: $primary-color;

  .v-select__slot {
    .v-input__append-inner {
      .v-input__icon {
        .v-icon {
          color: white;
        }
      }
    }
  }
}
::v-deep
  .select-duration
  .v-input__control
  .v-input__slot
  .v-select__slot
  .v-select__selection {
  color: white;
}

.row .col .report-btn {
  margin-left: -3px !important;
  margin-top: -1px;
  background: $primary-color;
  color: white;
  height: 41px;
}

::v-deep
  .description-text
  .v-input__control
  .v-input__slot
  .v-text-field__slot
  textarea {
  resize: none;
}
</style>