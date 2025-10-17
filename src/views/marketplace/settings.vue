<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-4">
        <h2>{{ $t("marketplace.settings.settingHeader") }}</h2>
        <v-spacer></v-spacer>
        <div class="d-flex mt-1">
          <v-btn
            color="primary"
            dark
            class="mr-2"
            @click="generalSettingDialog = true"
          >
            {{ $t("marketplace.settings.editSettingsBtn") }}
          </v-btn>
        </div>
      </div>
      <v-card elevation="0" class="px-5 pb-10">
        <v-card-title>
          <span class="text-h5 font-weight-bold">General Settings</span>
        </v-card-title>
        <v-card-text>
          <v-row class="mt-5" width="100%">
            <v-col lg="3" md="6" sm="6" xs="12">
              <v-card min-height="150" class="pa-2 green2 elevation-0">
                <v-list class="green2">
                  <v-list-item three-line>
                    <v-list-item-content>
                      <v-list-item-subtitle>
                        {{ $t("marketplace.settings.phoneNumberLabel") }}
                        <v-tooltip top color="black" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                              mdi-information-outline
                            </v-icon>
                          </template>
                          <span
                            >{{ $t("marketplace.settings.phoneNumberLabel") }}
                          </span>
                        </v-tooltip>
                      </v-list-item-subtitle>
                      <v-list-item-title class="text-h6 mt-2">
                        {{ generalSettings.phoneNumber }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            <v-col lg="3" md="6" sm="6" xs="12">
              <v-card min-height="150" class="pa-2 green2 elevation-0">
                <v-list class="green2">
                  <v-list-item three-line>
                    <v-list-item-content>
                      <v-list-item-subtitle>
                        {{ $t("emailid") }}
                        <v-tooltip top color="black" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                              mdi-information-outline
                            </v-icon>
                          </template>
                          <span>{{ $t("emailid") }}</span>
                        </v-tooltip>
                      </v-list-item-subtitle>
                      <v-list-item-title class="text-h6 mt-2">
                        {{ generalSettings.email }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            <v-col lg="3" md="6" sm="6" xs="12">
              <v-card min-height="150" class="pa-2 green2 elevation-0">
                <v-list class="green2">
                  <v-list-item three-line>
                    <v-list-item-content>
                      <v-list-item-subtitle>
                        {{ $t("marketplace.settings.defaultCurrencyLabel") }}
                        <v-tooltip top color="black" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                              mdi-information-outline
                            </v-icon>
                          </template>
                          <span>
                            {{
                              $t("marketplace.settings.defaultCurrencyLabel")
                            }}
                          </span>
                        </v-tooltip>
                      </v-list-item-subtitle>
                      <v-list-item-title class="text-h6 mt-2">
                        {{ generalSettings.defaultCurrency }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            <v-col lg="3" md="6" sm="6" xs="12">
              <v-card min-height="150" class="pa-2 green2 elevation-0">
                <v-list class="green2">
                  <v-list-item three-line>
                    <v-list-item-content>
                      <v-list-item-subtitle>
                        {{ $t("marketplace.settings.businessHoursLabel") }}
                        <v-tooltip top color="black" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                              mdi-information-outline
                            </v-icon>
                          </template>
                          <span>Business hours</span>
                        </v-tooltip>
                      </v-list-item-subtitle>
                      <v-list-item-title class="text-h6 mt-2">
                        {{ generalSettings.businessHours }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-card elevation="0" class="mt-5 px-5 pb-10">
        <v-card-title>
          <span class="text-h5 font-weight-bold">{{
            $t("marketplace.settings.numberOfProductHeading")
          }}</span>
        </v-card-title>
        <v-card-text>
          <v-row class="mt-5" width="100%">
            <v-col lg="3" md="6" sm="6" xs="12">
              <v-card min-height="150" class="pa-2 green2 elevation-0">
                <v-list class="green2">
                  <v-list-item three-line>
                    <v-list-item-content>
                      <v-list-item-subtitle>
                        {{ $t("marketplace.settings.numberOfProduct") }}
                        <v-tooltip top color="black" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                              mdi-information-outline
                            </v-icon>
                          </template>
                          <span>
                            {{ $t("marketplace.settings.numberOfProduct") }}
                          </span>
                        </v-tooltip>
                      </v-list-item-subtitle>
                      <v-list-item-title class="text-h6 mt-2">
                        {{ generalSettings.numberOfProducts }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-card elevation="0" class="mt-5 px-5 pb-10">
        <v-card-title>
          <span class="text-h5 font-weight-bold">{{
            $t("marketplace.settings.notificationSettingsHeader")
          }}</span>
        </v-card-title>
        <v-card-text>
          <v-row class="mt-5" width="100%">
            <v-col
              v-for="(notification, index) in notificationSettings"
              :key="index"
              lg="3"
              md="6"
              sm="6"
              xs="12"
            >
              <v-card min-height="150" class="pa-2 green2 elevation-0">
                <v-list class="green2">
                  <v-list-item three-line>
                    <v-list-item-content>
                      <v-list-item-subtitle>
                        {{ notification.text }}
                        <v-tooltip top color="black" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                              mdi-information-outline
                            </v-icon>
                          </template>
                          <span>{{ notification.text }}</span>
                        </v-tooltip>
                      </v-list-item-subtitle>
                      <v-list-item-title class="text-h6 mt-2">
                        {{
                          notification.enabled
                            ? $t("marketplace.common.enable")
                            : $t("marketplace.common.disable")
                        }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <div class="d-flex my-10">
        <h2>{{ $t("marketplace.settings.settingHeader") }}</h2>
      </div>
      <v-card elevation="0" class="mt-5 px-5 pb-10">
        <v-card-title>
          <span class="text-h5 font-weight-bold">
            {{ $t("marketplace.settings.bankAccountHeading") }}
          </span>
        </v-card-title>
        <v-card-text>
          <v-row class="mt-5" width="100%">
            <v-col
              v-for="(account, index) in bankAccounts"
              lg="3"
              md="6"
              sm="6"
              xs="12"
              :key="index"
            >
              <v-card min-height="150" class="pa-2 green2 elevation-0">
                <v-list class="green2">
                  <v-list-item three-line>
                    <v-list-item-content>
                      <v-list-item-subtitle>
                        {{ account["company"] }}
                        <v-tooltip top color="black" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                              mdi-information-outline
                            </v-icon>
                          </template>
                          <span>{{ account["company"] }}</span>
                        </v-tooltip>
                      </v-list-item-subtitle>
                      <v-list-item-title class="text-h6 mt-2">
                        {{ account["bankCode"] }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            <v-col lg="3" md="6" sm="6" xs="12" class="d-flex align-center">
              <v-btn
                color="primary"
                dark
                class="mr-2"
                @click="bankAccountDialog = true"
              >
                Manage Bank Account
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-card elevation="0" class="mt-5 px-5 pb-10">
        <v-card-title>
          <span class="text-h5 font-weight-bold">{{
            $t("marketplace.settings.paypalAccountHeading")
          }}</span>
        </v-card-title>
        <v-card-text>
          <v-row class="mt-5" width="100%">
            <v-col
              v-for="(account, index) in paypalAccounts"
              :key="index"
              lg="3"
              md="6"
              sm="6"
              xs="12"
            >
              <v-card min-height="150" class="pa-2 green2 elevation-0">
                <v-list class="green2">
                  <v-list-item three-line>
                    <v-list-item-content>
                      <v-list-item-subtitle>
                        {{ account["accountTitle"] }}
                        <v-tooltip top color="black" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                              mdi-information-outline
                            </v-icon>
                          </template>
                          <span>{{ account["accountTitle"] }}</span>
                        </v-tooltip>
                      </v-list-item-subtitle>
                      <v-list-item-title class="text-h6 mt-2">
                        {{ account["email"] }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            <v-col lg="3" md="6" sm="6" xs="12" class="d-flex align-center">
              <v-btn
                color="primary"
                dark
                class="mr-2"
                @click="paypalAccountsDialog = true"
              >
                {{ $t("marketplace.settings.editPaypalAccountBtn") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-card elevation="0" class="mt-5 px-5 pb-10">
        <v-card-title>
          <span class="text-h5 font-weight-bold">
            {{ $t("marketplace.settings.pickupLocationsHeading") }}
          </span>
        </v-card-title>
        <v-card-text>
          <v-row class="mt-5" width="100%">
            <v-col
              v-for="(location, index) in pickupLocations"
              :key="index"
              lg="3"
              md="6"
              sm="6"
              xs="12"
            >
              <v-card min-height="150" class="pa-2 green2 elevation-0">
                <v-list class="green2">
                  <v-list-item three-line>
                    <v-list-item-content>
                      <v-list-item-subtitle>
                        {{ location["name"] }}
                        <v-tooltip top color="black" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                              mdi-information-outline
                            </v-icon>
                          </template>
                          <span>{{ location["name"] }}</span>
                        </v-tooltip>
                      </v-list-item-subtitle>
                      <v-list-item-title class="text-h6 mt-2">
                        {{ location["address"] }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            <v-col lg="3" md="6" sm="6" xs="12" class="d-flex align-center">
              <v-btn
                color="primary"
                dark
                class="mr-2"
                @click="pickupLocationsDialog = true"
              >
                {{ $t("marketplace.settings.editPickupLocationBtn") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <BankAccounts
        v-if="bankAccountDialog"
        :bankAccountDialog="bankAccountDialog"
        @closeModal="closeModal"
        @successResponse="successResponse"
      />
      <SettingsEdit
        v-if="generalSettingDialog"
        :generalSettingDialog="generalSettingDialog"
        @closeModal="closeModal"
        @successResponse="successResponse"
      />
      <PickupLocations
        v-if="pickupLocationsDialog"
        :pickup-locations-dialog="pickupLocationsDialog"
        @closeWithoutChange="closeModal"
        @closeModal="closeModal"
      />
      <PaypalAccounts
        v-if="paypalAccountsDialog"
        :paypal-accounts-dialog="paypalAccountsDialog"
        @closeModal="closeModal"
      />
    </v-container>
  </div>
</template>

<script>
import BankAccounts from "./components/settings/BankAccounts.vue"
import SettingsEdit from "./components/settings/SettingsEdit.vue"
import PickupLocations from "./components/settings/PickupLocations.vue"
import PaypalAccounts from "./components/settings/PaypalAccounts.vue"
import { constants } from "./constants/settings"
export default {
  computed: {},
  components: { BankAccounts, SettingsEdit, PickupLocations, PaypalAccounts },
  methods: {
    closeModal() {
      this.generalSettingDialog = false
      this.pickupLocationsDialog = false
      this.bankAccountDialog = false
      this.paypalAccountsDialog = false
    },
    successResponse() {
      this.closeModal()
    },
  },
  data() {
    return {
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: true,
          to: "/",
        },
        {
          text: this.$t("marketplace.settings.header"),
          disabled: true,
          to: "breadcrumbs_link_1",
        },
      ],
      generalSettings: constants.generalSettings,
      notificationSettings: constants.notificationSettings,
      bankAccounts: constants.bankAccounts,
      paypalAccounts: constants.paypalAccounts,
      pickupLocations: constants.pickupLocations,
      generalSettingDialog: false,
      pickupLocationsDialog: false,
      bankAccountDialog: false,
      paypalAccountsDialog: false,
    }
  },
}
</script>
