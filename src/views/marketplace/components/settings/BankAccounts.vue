<template>
  <div>
    <v-dialog
      v-model="bankAccountDialog"
      width="90%"
      @click:outside="closeModal"
      :retain-focus="false"
    >
      <v-card class="custom-card" rounded="0">
        <v-toolbar color="primary" class="white--text" flat>
          <v-toolbar-title class="font-weight-bold">
            {{ $t("marketplace.settings.editBankAccountBtn") }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon class="white--text" @click="closeModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-form ref="addUser" lazy-validation autocomplete="off">
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <h2>{{ $t("marketplace.settings.bankAccounts") }}</h2>
              </v-col>
            </v-row>
            <v-expansion-panels focusable multiple>
              <v-expansion-panel
                class="mt-5 custom-expansion-panel"
                v-for="(bank, index) in bankAccounts"
                :key="index"
              >
                <v-expansion-panel-header class="font-weight-bold">
                  <v-row class="mx-4">
                    <v-col cols="5">{{ bank.company }}</v-col>
                    <v-col cols="5"> {{ bank.bank }}</v-col>
                    <v-spacer></v-spacer>
                    <v-btn class="px-8" icon @click.stop>
                      <v-icon
                        @mousedown.stop.prevent="bank.isActive = !bank.isActive"
                        :color="bank.isActive ? 'primary' : 'grey--text'"
                      >
                        {{
                          bank.isActive
                            ? "mdi-checkbox-marked-circle"
                            : "mdi-circle"
                        }}
                      </v-icon>
                    </v-btn>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content class="pt-5">
                  <v-row>
                    <v-col cols="9">
                      <v-row>
                        <v-col cols="6"> IBAN: {{ bank.iban }}</v-col>
                        <v-col cols="6">
                          {{ $t("country") }}:
                          {{ bank.accountHolder.country }}</v-col
                        >
                        <v-col cols="6"> Bank Code: {{ bank.bankCode }}</v-col>
                        <v-col cols="6">
                          {{ $t("marketplace.settings.phoneMobile") }}
                          {{ bank.accountHolder.contact.mobile }}</v-col
                        >
                        <v-col cols="6">BIC Swift: {{ bank.bicSwift }}</v-col>
                        <v-col cols="6">
                          {{ $t("marketplace.settings.phoneHome") }}
                          {{ bank.accountHolder.contact.home }}</v-col
                        >
                        <v-col cols="6">
                          {{ $t("name") }} :{{ bank.accountHolder.name }}
                        </v-col>
                        <v-col cols="6">
                          {{ $t("address") }}: {{ bank.accountHolder.address }}
                        </v-col>
                        <v-col cols="6"
                          >{{ bank.accountHolder.contact.email }}
                        </v-col>
                        <v-col cols="6">
                          {{ $t("marketplce.settings.cityTown") }}:
                          {{ bank.accountHolder.city }}</v-col
                        >
                      </v-row>
                    </v-col>
                    <v-col cols="2">
                      <v-btn icon>
                        <v-icon color="red">mdi-trash-can-outline</v-icon>
                      </v-btn>
                      <v-btn icon>
                        <v-icon color="green"> mdi-pencil</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
            <v-btn
              class="mt-5"
              height="44"
              width="160"
              color="primary"
              @click="bankAccountAddDialog = true"
            >
              {{ $t("marketplace.settings.addBankAccountBtn") }}
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
              <v-btn right height="44" width="116" color="primary">
                {{ $t("save") }}
              </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-form>
      </v-card>
    </v-dialog>
    <BankAccountForm
      v-if="bankAccountAddDialog"
      :bank-account-add-dialog="bankAccountAddDialog"
      @closeModal="bankAccountAddDialog = false"
    ></BankAccountForm>
  </div>
</template>
<script>
import BankAccountForm from "./BankAccountForm.vue"
import { constants } from "../../constants/settings"

export default {
  props: {
    bankAccountDialog: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    BankAccountForm,
  },
  data() {
    return {
      bankAccountAddDialog: false,
      bankAccounts: constants.bankAccounts,
    }
  },
  methods: {
    closeModal() {
      this.$emit("closeModal")
    },
  },
}
</script>
<style lang="scss" scoped>
.custom-expansion-panel {
  border-radius: 4px;
  box-shadow: 0px 2px 8px 0px #837c7c40;
}
</style>
