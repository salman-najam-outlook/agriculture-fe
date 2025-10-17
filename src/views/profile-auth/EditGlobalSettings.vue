<template>
  <v-container>
    <template>
      <div class="text-center">
        <v-dialog v-model="dialog" width="800" @click:outside="closeModal">
          <v-card rounded="0">
            <v-toolbar color="primary" class="white--text" flat :elevation="0">
              <v-toolbar-title class="font-weight-bold">{{
                  this.$t("setting.globalSetting")
                }}
              </v-toolbar-title>

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
                    {{ this.$t("setting.generalSetting") }}
                  </v-card-title>
                  <v-card-text>
                    <v-row style="width:100%">
                      <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <label
                            for="name"
                            class="text-subtitle-1 font-weight-bold"
                        >
                          {{ this.$t("setting.currency") }}
                        </label
                        >
                        <v-select
                            :items="getCurrencies"
                            class="rounded-l-1 white-text"
                            dense
                            background-color="#fff"
                            item-text="text"
                            item-value="value"
                            outlined
                            style="margin-left:-1px"
                            v-model="editedSettings.currencyId"
                        />
                      </div>
                      <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <label
                            for="autoLogOff"
                            class="text-subtitle-1 font-weight-bold"
                        >
                          {{ this.$t("setting.codeActivationTime") }}
                        </label
                        >
                        <v-row no-gutters class="d-flex">
                          <v-col cols="6">
                            <v-text-field
                                v-model="editedSettings.codeActivationTimeQty"
                                type="number"
                                placeholder="1"
                                outlined
                                dense
                                :error-messages="errors.name"
                                class="rounded-r-0"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="6">
                            <v-select
                                background-color="primary"
                                style="margin-left:-1px; color: white"
                                :items="[
                                { id: 'hours', text: 'HOURS' },
                                { id: 'days', text: 'DAYS' },
                                { id: 'weeks', text: 'WEEKS' },
                              ]"
                                item-text="text"
                                item-value="id"
                                dense
                                outlined
                                class="rounded-l-0 white-text"
                                v-model="editedSettings.codeActivationTimeUom"
                            ></v-select>
                          </v-col>
                        </v-row>
                      </div>
                      <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <label
                            for="name"
                            class="text-subtitle-1 font-weight-bold"
                        >
                          {{ this.$t("setting.areaUnit") }}
                        </label
                        >
                        <v-select
                            :items="getAreaUnits"
                            class="rounded-l-1 white-text"
                            dense
                            background-color="#fff"
                            item-text="text"
                            item-value="value"
                            outlined
                            style="margin-left:-1px"
                            v-model="editedSettings.areaUnitId"
                        />
                      </div>
                      <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <label
                            for="name"
                            class="text-subtitle-1 font-weight-bold"
                        >
                          {{ this.$t("setting.weightUnit") }}
                        </label
                        >
                        <v-select
                            :items="getWeightUnits"
                            class="rounded-l-1 white-text"
                            dense
                            background-color="#fff"
                            item-text="text"
                            item-value="value"
                            outlined
                            style="margin-left:-1px"
                            v-model="editedSettings.weightUnitId"
                        />
                      </div>

                      <div class="col-12 mb-2">
                        <div class="d-flex flex-wrap justify-space-between align-center ga-2 mb-2">
                          <label
                              for="smallFarmFrom"
                              class="text-subtitle-1 font-weight-bold"
                          >
                            {{ this.$t("setting.smallFarm") }}
                          </label>
                          <v-checkbox
                              v-model="editedSettings.smallFarm.isInclusive"
                              :label="this.$t('setting.inclusive')"
                              dense
                              class="mt-0"
                              hide-details="auto"
                          />
                        </div>
                        <div class="d-flex flex-wrap justify-space-between align-center ga-2">
                          <v-text-field
                              v-model="editedSettings.smallFarm.from"
                              type="number"
                              outlined
                              dense
                              hide-details="auto"
                              :rules="rules.smallFarm.from"
                          />
                          <div>to</div>
                          <v-text-field
                              v-model="editedSettings.smallFarm.to"
                              type="number"
                              outlined
                              dense
                              hide-details="auto"
                              :rules="rules.smallFarm.to"
                          />
                        </div>
                      </div>

                      <div class="col-12 mb-2">
                        <div class="d-flex flex-wrap justify-space-between align-center ga-2 mb-2">
                          <label
                              for="mediumFarmFrom"
                              class="text-subtitle-1 font-weight-bold"
                          >
                            {{ this.$t("setting.mediumFarm") }}
                          </label>
                          <v-checkbox
                              v-model="editedSettings.mediumFarm.isInclusive"
                              :label="this.$t('setting.inclusive')"
                              dense
                              class="mt-0"
                              hide-details="auto"
                          />
                        </div>
                        <div class="d-flex flex-wrap justify-space-between align-center ga-2">
                          <v-text-field
                              v-model="editedSettings.mediumFarm.from"
                              type="number"
                              outlined
                              dense
                              hide-details="auto"
                              :rules="rules.mediumFarm.from"
                          />
                          <div>to</div>
                          <v-text-field
                              v-model="editedSettings.mediumFarm.to"
                              type="number"
                              outlined
                              dense
                              hide-details="auto"
                              :rules="rules.mediumFarm.to"
                          />
                        </div>
                      </div>

                      <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <label
                            for="largeFarm"
                            class="text-subtitle-1 font-weight-bold"
                        >
                          {{ this.$t("setting.largeFarm") }}
                        </label>
                        <v-text-field
                            v-model="editedSettings.largeFarm"
                            type="number"
                            outlined
                            dense
                            hide-details="auto"
                            :rules="rules.largeFarm"
                            append-icon="mdi-plus"
                        />
                      </div>
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
                    {{ this.$t("cancel") }}
                  </v-btn>
                  <v-btn
                      @click="updateSettings"
                      right
                      height="44"
                      width="116"
                      color="primary"
                  >
                    {{ this.$t("permissions.update") }}
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

export default {
  mounted() {
    // console.log('set', this.editedSettings)
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
    getCurrencies() {
      return this.currencies.map((currency) => {
        return {
          text: `${currency.symbol} (${currency.abbreviation})`,
          value: currency.id,
        };
      });
    },
    getAreaUnits() {
      return this.areaUnits.map((areaUnit) => {
        let areaUnits = areaUnit.units.map(unit => {
          return {
            text: unit.name,
            value: unit.id
          };
        });
        return areaUnits;
      }).flat();
    },
    getWeightUnits() {
      return this.weightUnits.map((weightUnit) => {
        let weightUnits = weightUnit.units.map(unit => {
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
      valid: true,
      error: false,
      errors: {
        smallFarm: {
          to: "",
          from: ""
        },
        mediumFarm: {
          to: "",
          from: "",
        },
        largeFarm: ""
      },
      editedSettings: {
        ...this.settings,
        smallFarm: this.settings.smallFarm || {
          to: 0,
          from: 0,
          isInclusive: false
        },
        mediumFarm: this.settings.mediumFarm || {
          to: 0,
          from: 0,
          isInclusive: false
        },
        largeFarm: this.settings.largeFarm || 0
      },

      requiredMessage: this.$t("setting.requiredMessage"),
      nonNegativeMessage: this.$t("setting.nonNegativeMessage"),
      wholeNumMessage: this.$t("setting.wholeNumMessage"),
      fieldToGreaterThanFrom: this.$t("setting.fieldToGreaterThanFrom"),
      fieldToGreaterThanFromMedium: this.$t("setting.fieldToGreaterThanFromMedium"),
      fieldToGreaterThanMediumTo: this.$t("setting.fieldToGreaterThanMediumTo"),

      rules: {
        smallFarm: {
          from: [
            (v) => !!v || this.requiredMessage,
            (v) => Number(v) >= 0 || this.nonNegativeMessage,
            (v) => /^\d+$/.test(v) || this.wholeNumMessage
          ],
          to: [
            (v) => !!v || this.requiredMessage,
            (v) => Number(v) >= 0 || this.nonNegativeMessage,
            (v) => Number(v) > Number(this.editedSettings.smallFarm.from) || this.fieldToGreaterThanFrom,
            (v) => /^\d+$/.test(v) || this.wholeNumMessage
          ],
        },
        mediumFarm: {
          from: [
            (v) => !!v || this.requiredMessage,
            (v) => Number(v) >= 0 || this.nonNegativeMessage,
            (v) => Number(v) > Number(this.editedSettings.smallFarm.to) || this.fieldToGreaterThanFromMedium,
             (v) => /^\d+$/.test(v) || this.wholeNumMessage
          ],
          to: [
            (v) => !!v || this.requiredMessage,
            (v) => Number(v) >= 0 || this.nonNegativeMessage,
            (v) => Number(v) > Number(this.editedSettings.mediumFarm.from) || this.fieldToGreaterThanFrom,
             (v) => /^\d+$/.test(v) || this.wholeNumMessage
          ],
        },
        largeFarm: [
          (v) => !!v || this.requiredMessage,
          (v) => Number(v) >= 0 || this.nonNegativeMessage,
          (v) => v > Number(this.editedSettings.mediumFarm.to) || this.fieldToGreaterThanMediumTo,
          (v) => /^\d+$/.test(v) || this.wholeNumMessage
        ],
      },
    };
  },
  methods: {
    closeModal() {
      this.$emit("closeEditSettings");
    },
    updateSettings() {
      if (!this.$refs.settingsEdit.validate()) return;
      this.startLoading();
      delete this.editedSettings.currency;

      this.editedSettings.smallFarm.from = Number(this.editedSettings.smallFarm.from)
      this.editedSettings.smallFarm.to = Number(this.editedSettings.smallFarm.to)
      this.editedSettings.mediumFarm.from = Number(this.editedSettings.mediumFarm.from)
      this.editedSettings.mediumFarm.to = Number(this.editedSettings.mediumFarm.to)
      this.editedSettings.largeFarm = Number(this.editedSettings.largeFarm)

      PermissionsService.updateGlobalSettings(this.editedSettings)
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
          console.log(err);
          this.stopLoading();
        });
    },

    emptyErrors() {
      this.error = false;
      this.errors = {
        smallFarm: {
          to: "",
          from: ""
        },
        mediumFarm: {
          to: "",
          from: "",
        },
        largeFarm: ""
      }
    },
  },
  props: {
    currencies: {
      required: true,
      type: Array,
    },
    areaUnits: {
      required: true,
      type: Array,
    },
    weightUnits: {
      required: true,
      type: Array,
    },
    dialogU: {
      required: true,
      type: Boolean,
    },
    settings: {
      required: true,
    },
  },
  mixins: [loadingMixin, generalMixin, PermissionsMixin],
};
</script>

<style lang="scss" scoped>
// ::v-deep .bg .v-input__slot {
//   background-color: $primary-color;
//   color: #ffffff;
// }
.ga-2 {
  gap: 1rem;
}

::v-deep .v-messages__message {
  line-height: 14px;
}
</style>
