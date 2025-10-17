<template>
  <v-dialog
    v-model="bankAccountAddDialog"
    width="80%"
    @click:outside="closeModal"
    :retain-focus="false"
  >
    <v-card class="custom-card" rounded="0">
      <v-toolbar color="primary" class="white--text">
        <v-toolbar-title class="font-weight-bold">{{
          $t("marketplace.settings.addBankAccountBtn")
        }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon class="white--text" @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-form ref="bankAccountForm" lazy-validation autocomplete="off">
        <v-card-text class="black--text">
          <v-row>
            <v-col cols="12"
              ><h2>
                {{ $t("marketplace.settings.addBankAccountBtn") }}
              </h2></v-col
            >
            <v-col cols="3">
              <label>{{ $t("marketplace.settings.accountTitle") }}</label>
              <v-text-field
                v-model="formData.title"
                outlined
                dense
                placeholder="Type here"
                clearable
              >
              </v-text-field>
            </v-col>
            <v-col cols="3">
              <label>IBAN</label>
              <v-text-field
                v-model="formData.iban"
                outlined
                dense
                :placeholder="$t('marketplace.settings.typeHere')"
                clearable
              >
              </v-text-field>
            </v-col>
            <v-col cols="3">
              <label>{{ $t("marketplace.settings.bankLabel") }}</label>
              <v-text-field
                v-model="formData.bank"
                outlined
                dense
                :placeholder="$t('marketplace.settings.typeHere')"
                clearable
              >
              </v-text-field>
            </v-col>
            <v-col cols="3">
              <label>Bank Code</label>
              <v-text-field
                v-model="formData.bankCode"
                outlined
                dense
                :placeholder="$t('marketplace.settings.typeHere')"
                clearable
              >
              </v-text-field>
            </v-col>
            <v-col cols="3">
              <label>BIC / SWIFT</label>
              <v-text-field
                v-model="formData.bicSwift"
                outlined
                dense
                :placeholder="$t('marketplace.settings.typeHere')"
                clearable
              >
              </v-text-field>
            </v-col>
            <v-col cols="3">
              <label>{{ $t("name") }}</label>
              <v-text-field
                v-model="formData.accountHolder.name"
                outlined
                dense
                :placeholder="$t('marketplace.settings.typeHere')"
                clearable
              >
              </v-text-field>
            </v-col>
            <v-col cols="3">
              <label>{{ $t("address") }}</label>
              <v-text-field
                v-model="formData.accountHolder.address"
                outlined
                dense
                :placeholder="$t('marketplace.settings.typeHere')"
                clearable
              >
              </v-text-field>
            </v-col>
            <v-col cols="3">
              <label>{{ $t("marketplace.settings.cityTown") }}</label>
              <v-text-field
                v-model="formData.accountHolder.contact.city"
                outlined
                dense
                :placeholder="$t('marketplace.settings.typeHere')"
                clearable
              >
              </v-text-field>
            </v-col>
            <v-col cols="3">
              <label>{{ $t("country") }}</label>
              <v-text-field
                v-model="formData.accountHolder.contact.country"
                outlined
                dense
                :placeholder="$t('marketplace.settings.typeHere')"
                clearable
              >
              </v-text-field>
            </v-col>
            <v-col cols="3">
              <label>{{ $t("marketplace.settings.phoneNumberLabel") }}</label>
              <v-text-field
                v-model="formData.accountHolder.contact.mobile"
                outlined
                dense
                :placeholder="$t('marketplace.settings.typeHere')"
                clearable
              >
              </v-text-field>
            </v-col>
            <v-col cols="3">
              <label>Email</label>
              <v-text-field
                v-model="formData.accountHolder.contact.email"
                outlined
                dense
                :placeholder="$t('marketplace.settings.typeHere')"
                clearable
              >
              </v-text-field>
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

            <v-btn right height="44" width="116" color="primary">
              {{ $t("save") }}
            </v-btn>
          </v-card-actions>
        </v-card-text>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    bankAccountAddDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: {
        title: "",
        company: "",
        bank: "",
        iban: "",
        bankCode: "",
        bicSwift: "",
        accountHolder: {
          name: "",
          address: "",
          city: "",
          country: "",
          contact: {
            mobile: "",
            home: "",
            email: "",
          },
        },
      },
    }
  },
  methods: {
    closeModal() {
      this.$emit("closeModal")
    },
  },
}
</script>
