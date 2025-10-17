<template>
  <div>
    <v-dialog
      v-model="paypalAccountsDialog"
      width="90%"
      @click:outside="closeModal"
      :retain-focus="false"
    >
      <v-card class="custom-card" rounded="0">
        <v-toolbar color="primary" class="white--text">
          <v-toolbar-title class="font-weight-bold">
            {{ $t("marketplace.settings.paypalAccounts") }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon class="white--text" @click="closeModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-row class="mt-5">
            <v-col cols="12">
              <h2>
                {{ $t("marketplace.settings.paypalAccounts") }}
              </h2>
            </v-col>
          </v-row>
          <v-card
            class="pa-5 ma-5"
            v-for="(paypal, index) in paypalAccounts"
            :key="index"
          >
            <v-row>
              <v-col cols="3">{{ paypal.accountTitle }}</v-col>
              <v-col cols="3"> {{ paypal.email }}</v-col>
              <v-spacer></v-spacer>

              <v-col cols="1">
                <v-btn class="px-8" icon @click.stop>
                  <v-icon
                    @mousedown.stop.prevent="paypal.isActive = !paypal.isActive"
                    :color="paypal.isActive ? 'primary' : 'grey--text'"
                  >
                    {{
                      paypal.isActive
                        ? "mdi-checkbox-marked-circle"
                        : "mdi-circle"
                    }}
                  </v-icon>
                </v-btn>
              </v-col>
              <v-col cols="1">
                <v-btn icon>
                  <v-icon color="red">mdi-trash-can-outline</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon color="green"> mdi-pencil</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
          <v-btn
            class="mt-5"
            height="44"
            width="160"
            color="primary"
            small
            @click="paypalAccountAddDialog = true"
            >{{ $t("marketplace.settings.addPaypalAccountBtn") }}
          </v-btn>
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
              @click="onContinueClick()"
            >
              {{ $t("save") }}
            </v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
    <PaypalAccountForm
      v-if="paypalAccountAddDialog"
      :paypal-account-add-dialog="paypalAccountAddDialog"
      @closeModal="closeModal"
    >
    </PaypalAccountForm>
  </div>
</template>
<script>
import PaypalAccountForm from "./PaypalAccountForm.vue"
import { constants } from "../../constants/settings"
export default {
  props: {
    paypalAccountsDialog: {
      type: Boolean,
      default: false,
    },
  },
  components: { PaypalAccountForm },
  data() {
    return {
      paypalAccounts: constants.paypalAccounts,
      paypalAccountAddDialog: false,
    }
  },
  methods: {
    closeModal() {
      this.$emit("closeModal")
    },
  },
}
</script>
