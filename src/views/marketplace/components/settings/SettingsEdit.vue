<template>
  <div>
    <v-dialog
      v-model="generalSettingDialog"
      width="90%"
      @click:outside="closeModal"
      :retain-focus="false"
    >
      <v-card class="custom-card" rounded="0">
        <v-toolbar color="primary" class="white--text">
          <v-toolbar-title class="font-weight-bold"> Settings </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon class="white--text" @click="closeModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-form ref="addUser" lazy-validation autocomplete="off">
          <v-card-text class="black--text">
            <v-row>
              <v-col cols="12">
                <h2>{{ $t("marketplace.settings.generalSettingHeader") }}</h2>
              </v-col>

              <v-col cols="3">
                <div class="d-flex justify-space-between">
                  <label>{{
                    $t("marketplace.settings.phoneNumberLabel")
                  }}</label>
                  <span class="add-more" @click="addMoreField('phone')">
                    {{ $t("marketplace.settings.addMoreLabel") }}
                  </span>
                </div>
                <div
                  v-for="(phone, index) in formData.phone"
                  :key="index"
                  class="d-flex"
                >
                  <v-text-field
                    v-model="formData.phone[index]"
                    outlined
                    dense
                    :placeholder="
                      $t('marketplace.settings.phoneNumberPlaceHolder')
                    "
                    clearable
                    class="flex-grow-1"
                  ></v-text-field>
                  <!-- Show delete icon only if there is more than one phone number -->
                  <v-btn
                    v-if="formData.phone.length > 1"
                    icon
                    color="red"
                    @click="deleteField('phone', index)"
                    class="ml-2"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </div>
              </v-col>

              <v-col cols="3">
                <div class="d-flex justify-space-between">
                  <label>{{ $t("email") }}</label>
                  <span class="add-more" @click="addMoreField('email')">
                    {{ $t("marketplace.settings.addMoreLabel") }}
                  </span>
                </div>
                <div
                  v-for="(email, index) in formData.email"
                  :key="index"
                  class="d-flex"
                >
                  <v-text-field
                    v-model="formData.email[index]"
                    outlined
                    dense
                    :placeholder="$t('marketplace.settings.emailPlaceHolder')"
                    clearable
                    class="flex-grow-1"
                  ></v-text-field>
                  <v-btn
                    v-if="formData.email.length > 1"
                    icon
                    color="red"
                    @click="deleteField('email', index)"
                    class="ml-2"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </div>
              </v-col>

              <v-col cols="3">
                <div class="d-flex justify-space-between">
                  <label>{{
                    $t("marketplace.settings.defaultCurrencyLabel")
                  }}</label>
                </div>
                <v-autocomplete
                  v-model="formData.default_currency"
                  :items="currencies"
                  item-value="currency"
                  :item-text="(item) => `${item.currency} (${item.code})`"
                  outlined
                  dense
                  :placeholder="$t('marketplace.settings.currencyPlaceHolder')"
                  clearable
                ></v-autocomplete>
              </v-col>
              <v-col cols="3">
                <div class="d-flex justify-space-between">
                  <label>{{ $t("marketplace.settings.timingLabel") }}</label>
                </div>
                <v-text-field
                  v-model="formData.timing"
                  readonly
                  dense
                  outlined
                  clearable
                  :label="
                    formData.timing
                      ? ''
                      : $t('marketplace.settings.selectTiming')
                  "
                >
                  <template v-slot:append>
                    <v-icon @mousedown.stop.prevent="handleWorkingHour">
                      mdi-pencil
                    </v-icon>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12"
                ><h2>
                  {{ $t("marketplace.settings.notificationSettingsHeader") }}
                </h2>
              </v-col>
              <v-col
                cols="3"
                v-for="(notification, index) in notificationSettings"
                :key="index"
              >
                <v-card outlined class="order-card">
                  <v-list>
                    <v-list-item>
                      <v-list-item-content class="pa-0 ma-0">
                        <div
                          class="d-flex pa-0 ma-0 align-center custom-checkbox"
                        >
                          <v-checkbox
                            v-model="notification.enabled"
                            color="success"
                            hide-details
                          ></v-checkbox>
                          <div>{{ notification.text }}</div>
                          <v-spacer></v-spacer>
                          <div>
                            <v-icon
                              @click="openNotificationModal"
                              color="success"
                              >mdi-pencil</v-icon
                            >
                          </div>
                        </div>
                      </v-list-item-content>
                    </v-list-item>

                    <v-divider></v-divider>

                    <v-card-text>
                      {{ notification.frequency }}, {{ notification.channels }}
                    </v-card-text>
                  </v-list>
                </v-card>
              </v-col>
            </v-row>
            <v-card-actions class="mt-10" style="padding-right: 0">
              <v-spacer></v-spacer>
              <v-btn
                outlined
                class="mr-2"
                right
                height="44"
                width="116"
                depressed
                color="primary"
                @click="closeModal"
              >
                {{ $t("cancel") }}
              </v-btn>

              <v-btn
                right
                height="44"
                width="116"
                color="primary"
                @click="onSubmitForm"
              >
                {{ $t("save") }}
              </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-form>
      </v-card>
    </v-dialog>
    <BusinessHours
      v-if="showTimings"
      :show-timings="showTimings"
      @saveBusinessHours="saveBusinessHours"
      @closeModal="showTimings = false"
    />
    <NotificationSettingForm
      v-if="showNotificationSetting"
      :show-notification-setting="showNotificationSetting"
      @closeModal="showNotificationSetting = false"
    />
  </div>
</template>
<script>
import { currencies } from "../../constants/currency"
import { constants } from "../../constants/settings"
import BusinessHours from "./BusinessHours.vue"
import NotificationSettingForm from "./NotificationSettingForm.vue"
export default {
  components: {
    BusinessHours,
    NotificationSettingForm,
  },
  props: {
    generalSettingDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: {
        name: "",
        phone: [""],
        email: [""],
        default_currency: "",
        timing: "",
      },
      notificationSettings: constants.notificationSettings,
      currencies: currencies,
      businessHours: constants.businessHours,
      showTimings: false,
      showNotificationSetting: false,
    }
  },
  methods: {
    closeModal() {
      this.$emit("closeModal")
    },
    addMoreField(field) {
      this.formData[field].push("")
    },
    deleteField(field, index) {
      this.formData[field].splice(index, 1)
    },
    onSubmitForm() {
      this.$emit("successResponse")
    },
    handleWorkingHour() {
      this.showTimings = true
    },
    saveBusinessHours(timings) {
      if (!timings) {
        return
      }
      this.showTimings = false
      this.formData.timing = timings.businessDays
        .filter((timing) => timing.enabled)
        .map((timing) => timing.name)
    },
    openNotificationModal() {
      this.showNotificationSetting = true
    },
  },
}
</script>
<style lang="scss" scoped>
.add-more {
  cursor: pointer;
  text-decoration: underline;
  color: #117443;
}

.custom-checkbox {
  ::v-deep .v-input--selection-controls {
    margin: 0;
    padding: 0;
  }
}
</style>
