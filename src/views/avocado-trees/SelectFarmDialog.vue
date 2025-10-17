<template>
  <v-container>
    <template>
      <div>
        <v-dialog v-model="dialog" width="30%" @click:outside="closeModal" :retain-focus="false">
          <v-card class="custom-card" rounded="0">
            <v-toolbar color="primary" class="white--text">
              <v-toolbar-title v-if="survey.id" class="font-weight-bold">
                {{ $t("surveyBuilder.surveySettings") }}
              </v-toolbar-title>
              <v-toolbar-title v-else class="font-weight-bold">
                {{ $t("oma.addNewFarm") }}
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon class="white--text" @click="closeModal">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-form class="pa-4" ref="selectFarm" autocomplete="off">
              <v-card-text class="black--text">
                <v-row>
                  <v-col>
                    <label>{{ $t("oma.selectFarm") }}</label>
                    <v-autocomplete v-model="farm" :items="farms" outlined dense item-value="id" item-text="farmName"
                      :error-messages="errors.farm" :rules="rules.farm" @change="setZones" :loading="loading"
                      :placeholder="$t('oma.selectFarm')">
                    </v-autocomplete>
                    <div v-if="zones">
                      <label>{{ $t("oma.selectZone") }}</label>
                      <v-select v-model="zone" :items="zones" outlined dense item-value="id" item-text="geofenceName"
                        :error-messages="errors.zone" :rules="rules.zone" :loading="loading"
                        :placeholder="$t('oma.selectZone')">
                      </v-select>
                    </div>
                  </v-col>
                </v-row>
                <v-card-actions class="mt-10" style="padding-right: 0">
                  <v-spacer></v-spacer>
                  <v-btn outlined class="mr-2" right height="44" width="116" depressed color="primary"
                    @click="closeModal">
                    {{ $t("cancel") }}
                  </v-btn>

                  <v-btn right class="px-4" color="primary" @click="addTree">
                    {{ $t("Next") }}
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-form>
          </v-card>
        </v-dialog>
      </div>
    </template>
    <survey-date-selector :dialog="toggleDateSelector" :defaultDate="currentDate" :startDate="survey.scheduledDate"
      @closeDialog="toggleDateSelector = false" @setDate="setScheduleDate" />
    <SelectSurveyUsersDialog v-if="showSelectSurveyUsersDialog" :dialogI="showSelectSurveyUsersDialog"
      :preCondition="preCondition" :selectedUsers="survey.surveySelectedUsers"
      @closeDialog="showSelectSurveyUsersDialog = false" @userSelected="onUserSelected" />
  </v-container>
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import SurveyBuilderService from "@/_services/SurveyBuilderService";
import SelectSurveyUsersDialog from "./SelectSurveyUsersDialog.vue";
import SurveyDateSelector from './SurveyDateSelector.vue';
import moment from "moment";
import FarmService from "@/_services/FarmService";

export default {
  data() {
    return {
      showSelectSurveyUsersDialog: false,
      preCondition: {},
      farm: null,
      zone: null,
      zones: [],
      toggleDateSelector: false,
      mode: 'start',
      currentDate: '',
      loadingUsers: false,
      survey: {
        title: null,
        description: null,
        isScheduled: false,
        scheduledDate: null,
        scheduledEndDate: null,
        isMultistep: false,
        questionForEachStep: null,
        surveyStatus: false,
        isSelectedUsers: false,
        linkWithFarms: false,
        surveySelectedUsers: [],
        users: [],
        linkedWithFarms: false,
      },
      errors: {
      },
      rules: {
        title: [
          v => !!v || this.$t('errors.required'),
          v => (v && v.length < 100) || this.$t("surveyBuilder.surveyTitleLength"),
        ],
        description: [
          v => !!v || this.$t('errors.required')
        ],
        farm: [
          v => !!v || this.$t('errors.required')
        ],
        // zone: [
        //   v => !!v || this.$t('errors.required')
        // ],

      },
      loading: false
    };
  },
  components: {
    SelectSurveyUsersDialog,
    SurveyDateSelector,
  },
  computed: {
    dialog() {
      return this.dialogI;
    },
    disableStatus() {
      return !this.survey.id || this.survey.questions === 0 || this.survey.status === 'Completed';
    },
    disableUser() {
      return this.survey.status === 'Completed' || this.survey.status === 'Active';
    }
  },
  props: {
    dialogI: {
      type: Boolean,
      required: true,
    },
    farms: {
      type: Array,
      required: true
    },
    tree: {
      type: Object
    },

    updateData: {},
  },
  created() {},
  mounted() {
    if (this.$props.updateData) {
      this.survey = this.$props.updateData;
    }

    if (this.$props.tree) {
      this.farm = this.$props.tree.farmId;
      this.setZones()
      this.zone = this.$props.tree.zoneId;
    }
  },
  methods: {
    async saveNewTree() {
      if (!this.$refs.addNewSurvey.validate()) return;
      if (this.survey.isScheduled) {
        if (!this.survey.scheduledDate) {
          return this.$notify({
            title: "Start Date is Required",
            type: "error",
          });
        }
        if (this.survey.scheduledDate && !this.survey.scheduledEndDate) {
          return this.$notify({
            title: "End Date is Required",
            type: "error",
          });
        }
        if (moment(this.survey.scheduledDate, 'YYYY-MM-DD').isAfter(moment(this.survey.scheduledEndDate, 'YYYY-MM-DD'))) {
          this.$notify({
            title: "End Date must be larger than Start Date",
            type: "error",
          });
        }
      }
      this.startLoading();
      await SurveyBuilderService.createNewSurvey(this.survey)
        .then((res) => {
          if (res.success == true) {
            this.stopLoading();
            this.closeModal();
            this.$emit("emitNewSurvey");
          } else {
            this.stopLoading();
            this.$notify({
              title: res.message.errors[0].msg,
              type: "error",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.stopLoading();
          this.closeModal();
        });
    },
    async openUsersDialog() {
      try {
        this.loadingUsers = true;
        const res = await SurveyBuilderService.getSurveyUserAutoConditon();
        this.preCondition['id'] = res.data.id;
        this.preCondition['membership_type'] = res.data.membershipTypeId;
        this.preCondition['user_id'] = res.data.user_id;
        this.preCondition['membership_validity'] = res.data.membershipValidity;
        this.preCondition['account_progress'] = res.data.accountProgress;
        this.preCondition['membershipRemainingDays'] = res.data.remainingDays;
        this.preCondition['condtionStatus'] = res.data.condtionStatus;
        this.showSelectSurveyUsersDialog = true;
      } catch (err) {
        console.err(err)
      } finally {
        this.loadingUsers = false;
      }
    },
    addTree() {
      if (!this.$refs.selectFarm.validate()) return;
      this.$emit("onFarmSelection", { farm: this.farm, zone: this.zone });
    },
    onUserSelected(value) {
      this.showSelectSurveyUsersDialog = false;
      if (value != null) {
        const userIds = value.map((item) => item.id);
        this.survey.users = userIds;
        this.survey.surveySelectedUsers = value
      } else {
        this.survey.users = [];
      }
    },
    closeModal() {
      this.$emit("closeDialog");
      this.mode = "start";
    },
    openDateSelector(type) {
      if (type === 'start' && this.survey.scheduledDate) {
        this.currentDate = this.survey.scheduledDate;
      } else if (type === 'end' && this.survey.scheduledEndDate) {
        this.currentDate = this.survey.scheduledEndDate;
      } else {
        this.currentDate = '';
      }
      this.mode = type;
      this.toggleDateSelector = true;
    },
    setScheduleDate(a) {
      if (this.mode === 'start') {
        this.survey.scheduledDate = a;
      } else if (this.mode === 'end') {
        this.survey.scheduledEndDate = a;
      }
    },
    setZones() {
      if (!this.farm) return;
      this.loading = true
      this.startLoading(true);
      FarmService.getFarm(this.farm).then((data) => {
        this.farm = data;
        this.zones = this.farm.segments;
        this.zones =this.zones.map(zone => {
          if (zone.geofenceName === null) {
            zone.geofenceName = 'Zone-' + zone.id;
          }
          return zone;
        });
        this.zones = this.zones.filter(el => {
          return !el?.isPrimary
        })
        this.loading = false;
        this.stopLoading();
      }).catch(err=> {
        this.stopLoading();
        console.log(err, "setZones, err")

      });
    }
  },
  mixins: [loadingMixin],
};
</script>

<style></style>