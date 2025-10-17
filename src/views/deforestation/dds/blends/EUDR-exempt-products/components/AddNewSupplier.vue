<template>
  <v-container>
    <template>
      <div>
        <v-dialog transition="dialog-top-transition" max-width="600" v-model="dialog" persistent>
          <v-card class="">
            <v-toolbar color="primary" dark flat dense>
              <v-toolbar-title class="font-weight-bold">{{ $t("blends.exemptProducts.addNewSupplier") }}
              </v-toolbar-title>

              <v-spacer></v-spacer>

              <v-btn icon class="white--text" @click="closeModal">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-form @submit.prevent="addNewSupplier" ref="addNewSupplier" lazy-validation>
              <v-card-text>
                <v-row class="">
                  <v-col cols="6">
                    <label class="label">
                      {{ $t("firstName") }}
                    </label>
                    <v-text-field :rules="rules.name" type="text" outlined dense
                      :placeholder="$t('blends.exemptProducts.enterSupplierFirstName')" v-model="supplier.name"></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <label class="label">
                      {{ $t("lastName") }}
                    </label>
                    <v-text-field :rules="rules.lastName" type="text" outlined dense
                      :placeholder="$t('blends.exemptProducts.enterSupplierLastName')"
                      v-model="supplier.lastName"></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <label class="label">
                      {{ $t("blends.exemptProducts.email") }}
                    </label>
                    <v-text-field type="text" :rules="rules.email" outlined dense
                      :placeholder="$t('blends.exemptProducts.enterEmailAddress')" v-model="supplier.email"
                      :error-messages="verifyEmailError"></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <label class="label">
                      {{ $t("blends.exemptProducts.phoneNumber") }}
                    </label>
                    <v-text-field type="text" :rules="rules.mobile" outlined dense
                      :placeholder="$t('blends.exemptProducts.enterPhoneNumber')" v-model="supplier.mobile"
                      :error-messages="verifyMobileError"></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <label class="label">
                      {{ $t("blends.exemptProducts.country") }}
                    </label>
                    <v-autocomplete :items="countries" v-model="supplier.country" class="mr-1" dense item-text="name"
                      item-value="name" outlined :placeholder="$t('blends.exemptProducts.selectCountry')"
                      :rules="rules.country" />
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn outlined @click="closeModal" class="mr-2" depressed style="min-width: 150px;" color="primary">
                  {{ $t("cancel") }}
                </v-btn>
                <v-btn type="submit" color="primary" style="min-width: 150px;">
                  {{ $t("confirm") }}
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
      </div>
    </template>
  </v-container>
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import { getCountries } from "country-state-picker";
import generalMixin from "@/mixins/GeneralMixin";
import UserService from "@/_services/UserService";

export default {
  data() {
    return {
      countries: [],
      supplier: {
        name: null,
        email: null,
        country: null,
        countryId: null,
        mobile: null,
        eori_number: null,
        lastName: null,
      },
      verifyEmailError: '',
      verifyMobileError: '',
      rules: {
        name: [(v) => !!v || this.$t("blends.exemptProducts.firstNameIsRequired")],
        lastName: [(v) => !!v || this.$t("blends.exemptProducts.lastNameIsRequired")],
        email: [
          (v) => !!v || this.$t("addEdituser.emailReuired"),
          (v) =>
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,6})+$/.test(v) ||
            this.$t("addEdituser.emailInvalid"),
        ],
        mobile: [
          (v) => !!v || this.$t("addEdituser.mobileRequired"),
          (v) =>
            this.validMobileNumber(v) || this.$t("addEdituser.invalidMobile"),
          (v) => (v && v.length <= 15) || this.$t("addEdituser.mobileLimit"),
        ],
        country: [(v) => !!v || this.$t("dueDiligence.countryIsRequired")],
      },
    };
  },
  computed: {
    dialog() {
      return this.dialogI;
    },
  },
  props: {
    dialogI: {
      type: Boolean,
      required: true,
    },
  },
  mounted() {
    this.getCountry();
  },
  methods: {
    addNewSupplier() {
      this.verifyEmailError = '';
      this.verifyMobileError = '';

      if (!this.$refs.addNewSupplier.validate()) return;
      this.startLoading();

      const supplier = {
        firstName: this.supplier.name,
        lastName: this.supplier.lastName || "",
        email: this.supplier.email,
        mobile: this.supplier.mobile,
        country: this.supplier.country,
        verified: 0,
        role: "supplier",
      };

      UserService.addDdsUser(supplier)
        .then((data) => {
          if (data.success) {
            this.$emit("supplierAdded", { success: true, data: data.data });
          } else {
            if (data) {
              if (data.emailError) {
                this.verifyEmailError = this.$t("addEdituser.emailExistAlready");
              } else if (data.mobileError) {
                this.verifyMobileError = this.$t("addEdituser.mobileExistAlready");
              }
              this.stopLoading();
              return;
            }

            this.$emit("supplierAdded", { success: false });
          }
          this.clearSupplier();
          this.closeModal();
          this.stopLoading();
        })
        .catch((err) => {
          if (err.response.data.message.errors.length > 0) {
            err.response.data.message.errors.forEach((e) => {
              this.errors[e.param] = e.msg;
            });
          }
          this.stopLoading();
        });
    },
    clearSupplier() {
      this.supplier.firstName = null;
      this.supplier.lastName = null;
      this.supplier.email = null;
      this.supplier.mobile = null;
      this.supplier.country = null;
      this.supplier.countryId = null;
    },
    getCountry() {
      this.countries = getCountries();
    },
    closeModal() {
      this.$emit("closeModal");
    },
  },
  mixins: [loadingMixin, generalMixin],
};
</script>

<style scoped lang="scss">
.question-label {
  position: relative;
  width: 90%;
}

.question-input {
  width: 100px;
  position: absolute;
  right: 0;
  top: -9px;
}
</style>
