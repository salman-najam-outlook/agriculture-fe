<template>
  <v-container>
    <v-dialog v-model="dialog" width="1000" @click:outside="closeModal" v-if="!nextDialog">
      <v-card rounded="0">
        <v-toolbar color="primary" class="white--text" flat>
          <v-toolbar-title class="font-weight-bold"
            >{{ $t("membershipplanSection.editMembershipPlan") }}</v-toolbar-title
          >

          <v-spacer></v-spacer>

          <v-btn icon class="white--text" @click="closeModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-form
          autocomplete="off"
          @submit.prevent="updateMembership"
          ref="membershipform"
          v-model="valid"
        >
          <v-card-text class="black--text">
            <v-row>
              <v-col cols="6">
                <label class="title" for="name"
                  >{{ $t('membershipPlans') }}<span class="red--text">*</span></label
                >
                <v-text-field
                  outlined
                  dense
                  v-model.trim="editedMembership.membership_type"
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
                  v-model.trim="editedMembership.plan_type"
                  :placeholder="$t('membershipplanSection.selectPlan')"
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="10">
                <label class="title" for="name"
                  >{{ $t('userRole') }}<span class="red--text">*</span></label
                >
                <v-row class="pb-0 px-2" justify="center" align="center">
                  <v-col class="pa-1 mt-n2" v-for="item in roles" :key="item.label">
                    <v-checkbox class="text-no-wrap"  :label="item.name" :value="item.id" v-model="editedMembership.roles">
                    </v-checkbox>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" class="mt-n7">
                <label class="title" for="name"
                  >{{ $t('adminRoles.description') }}<span class="red--text">*</span></label
                >
                <v-textarea
                  v-model="editedMembership.description"
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
                  v-model.trim="editedMembership.allowed_users"
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
                  v-model.trim="editedMembership.allowed_farms"
                  :placeholder="$t('enterHere')"
                >
                </v-text-field>
              </v-col> -->

              <v-col cols="6" class="mt-n7">
                <label class="title" for="name"
                  >{{ $t('membershipplanSection.accessSetelite') }}<span
                    class="red--text"
                    >*</span
                  ></label
                >
                <v-row class="d-flex" no-gutters>
                  <v-col cols="8">
                    <v-text-field
                      type="number"
                      outlined
                      dense
                      v-model="editedMembership.satellite_report"
                      :placeholder="$t('enterHere')"
                      :rules="membershipRules.satelliteReport"
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
              </v-col>
              <!-- <v-col cols="6" class="mt-n7">
                <label class="title" for="name"
                  >{{ $t('membershipplanSection.accessSetelite') }}<span
                    class="red--text"
                    >*</span
                  ></label
                >
                <v-row class="d-flex" no-gutters>
                  <v-col cols="4">
                    <v-text-field
                      type="number"
                      outlined
                      dense
                      v-model="editedMembership.satellite_report"
                      :placeholder="$t('enterHere')"
                      :rules="membershipRules.satelliteReport"
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
                      v-model="editedMembership.satelliteReportTypeUnit"
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
              </v-col> -->

              <v-col cols="6" class="mt-n7">
                <label class="title" for="name"
                  >{{ $t('membershipplanSection.accessAdvanceReport') }}<span class="red--text"
                    >*</span
                  ></label
                >
                <v-text-field
                  type="number"
                  outlined
                  dense
                  v-model="editedMembership.advanced_report"
                  :rules="membershipRules.advancedReport"
                  :placeholder="$t('enterHere')"
                >
                </v-text-field>
              </v-col>
             
              <!-- <v-col cols="6" class="mt-n7">
                <label class="title" for="name"
                  >{{ $t('membershipplanSection.accessAdvanceReport') }}<span class="red--text"
                    >*</span
                  ></label
                >

                <v-row no-gutters>
                  <v-col cols="4">
                    <v-text-field
                        type="number"
                        outlined
                        dense
                        v-model="editedMembership.advanced_report"
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
                      v-model="editedMembership.advanceReportTypeUnit"
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
                      v-model="editedMembership.advancedReportUnit"
                    ></v-select>
                  </v-col>
              </v-row>
             
              </v-col> -->

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
                      v-model="editedMembership.deforestationReport"
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
                      v-model="editedMembership.deforestationReportTypeUnit"
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
                      v-model="editedMembership.deforestationReportUnit"
                    ></v-select>
                  </v-col>
                </v-row>
              </div>
              </v-row>
               
              <v-col cols="6" class="mt-n7">
                <label class="title" for="name"
                  >{{ $t('membershipplanSection.planDuration') }}<span class="red--text">*</span></label
                >
                <v-row class="d-flex" no-gutters>
                  <v-col cols="8">
                    <v-text-field
                      type="number"
                      outlined
                      dense
                      v-model="editedMembership.membership_duration"
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
                      v-model="editedMembership.membership_duration_unit"
                    >
                    </v-select>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="6" class="mt-n7">
                <label class="title" for="name"
                  >{{ $t('membershipplanSection.planFee') }}<span class="red--text">*</span></label
                >
                <v-text-field
                  type="text"
                  outlined
                  dense
                  v-model="editedMembership.membership_fee"
                  :rules="membershipRules.fee"
                  :placeholder="$t('enterHere')"
                >
                  <template v-slot:prepend-inner>
                    <v-icon>mdi-currency-usd</v-icon>
                  </template>
                </v-text-field>
              </v-col>

              <!-- <v-col cols="6" class="mt-n7">
                <label class="title" for="name"
                  >{{ $t('membershipplanSection.planFee') }}<span class="red--text">*</span></label
                >

                <v-row no-gutters>
                  <v-col cols="8">
                    <v-text-field
                      type="text"
                      outlined
                      dense
                      v-model="editedMembership.membership_fee"
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
                      v-model="editedMembership.feeUnitType"
                    ></v-select>
                  </v-col>
                </v-row>
                
              </v-col> -->
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
                  v-model.trim="editedMembership.basicFarmLevelReport"
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
                  v-model.trim="editedMembership.advancedFarmLevelReport"
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
                  v-model.trim="editedMembership.largeAreaReport"
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
    const fetchData = () => {
      this.loading = false;
      this.getMembershipRoles();
      this.editedMembership = {
        ...this.editedMembership,
        roles: this.editedMembership.userRoleMembershipMap.map(item => item.user_role.id),
      };
      // console.log("editedRole", this.editedMembership);
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
      statelliteReportDialog:false,
      loading: true,
      valid: true,
      departmentList: [],
      roles: [],
      department: "",
      rolename: "",
      selectedRoles: [],
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
      durations:[
        { name: this.$t('Day/s'), value: 'day(s)' },
        {name: this.$t('Week/s'), value: 'week(s)'},
        {name: this.$t('Month/s'), value: 'month(s)'},
        {name: this.$t('Year/s'), value: 'year(s)'},
      ],
      membershipPlanError: "",
      editedMembership: { ...this.membership },
      membershipRules: {
        type: [
          (v) => !!v.trim() || "Membership Plan is required",
          (v) =>
            (v && v.length <= 20) ||
            "Membership type must be less than 20 characters",
        ],
        description: [
          (v) => !!v || "Description is required",
          (v) =>
            (v && v.length <= 40) ||
            "Description must be less than 40 characters",
        ],
        satelliteReport: [
          (v) => !!v.toString() || "Satellite Report is required",
          (v) => v >= 0 || "Can't be less than 0",
        ],
        advancedReport: [
          (v) => !!v.toString() || "Advanced Report is required",
          (v) => v >= 0 || "Can't be less than 0",
        ],
        duration: [
          (v) => !!v.toString() || "Membership Duration is required",
          (v) => v >= 0 || "Can't be less than 0",
        ],
        fee: [
          (v) => !!v || "Membership Fee is required",
          (v) => v >= 0 || "Can't be less than 0",
        ],
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
    closeModal() {
      this.$emit("closeEditMembership");
    },
    async updateMembership() {
      if (!this.$refs.membershipform.validate()) return;
      this.startLoading();
      try {
        const { data } = await this.$http.put(
          `user/membership/${this.editedMembership.id}`,
          {
            membershipType: this.editedMembership.membership_type,
            description: this.editedMembership.description,
            membershipDuration: this.editedMembership.membership_duration,
            membershipDurationUnit:
              this.editedMembership.membership_duration_unit,
            membershipFee: this.editedMembership.membership_fee,
            satelliteReport: this.editedMembership.satellite_report,
            advancedReport: this.editedMembership.advanced_report,
            role: this.editedMembership.roles,

            plan_type:this.editedMembership.plan_type,
            feeUnitType:this.editedMembership.feeUnitType,
            allowed_users:this.editedMembership.allowed_users,
            allowed_farms:this.editedMembership.allowed_farms,
            advanceReportTypeUnit:this.editedMembership.advanceReportTypeUnit,
            advancedReportUnit:this.editedMembership.advancedReportUnit,
            satelliteReportTypeUnit:this.editedMembership.satelliteReportTypeUnit,
            deforestationReport:this.editedMembership.deforestationReport,
            deforestationReportTypeUnit:this.editedMembership.deforestationReportTypeUnit,
            deforestationReportUnit:this.editedMembership.deforestationReportUnit,
            basicFarmLevelReport:this.editedMembership.basicFarmLevelReport,
            advancedFarmLevelReport:this.editedMembership.advancedFarmLevelReport,
            largeAreaReport:this.editedMembership.largeAreaReport,
          }
        );
        if (data && data.code === 200) {
          this.$notify({
            title: "Membership updated successfully.",
            type: "success",
          });
          this.$emit("membership:updated", true);
          this.stopLoading();
        } else {
          this.$notify({
            title: this.$t('somethingWentWrong'),
            type: "error",
          });
          this.stopLoading();
        }
      } catch (err) {
        console.log("ERRR", err);
        this.stopLoading();
      }

      // PermissionsService.updateRole({ name: this.editedRole.name, departmentNumber: this.editedRole.department.departmentNumber, roleNumber: this.editedRole.roleNumber })
      // .than( respose => {
      //     this.stopLoading()
      //     if(respose.success){
      //         this.$notify({
      //             title: 'Membership Updated',
      //             text: respose.message,
      //             type: 'success'
      //         });
      //         this.$emit('membership:updated', true)
      //         this.closeModal();
      //     }else{
      //         if(respose.response.data.message.errors[0].msg)
      //             this.errors.name = respose.response.data.message.errors[0].msg
      //         else{
      //             this.$notify({
      //                 title: 'Membership not Updated',
      //                 text: 'server error',
      //                 type: 'error'
      //             });
      //             this.$emit('membership:updated', false)
      //             this.closeModal();
      //         }
      //     }
      // })
      // .catch(error => {
      //     this.stopLoading()
      //     console.log('err', error)
      // })
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
  },

  props: ["dialogI", "membership"],
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