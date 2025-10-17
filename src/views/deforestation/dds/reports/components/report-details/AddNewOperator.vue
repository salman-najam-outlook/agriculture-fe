<template>
  <v-container>
    <template>
      <div>
        <v-dialog
          transition="dialog-top-transition"
          max-width="600"
          v-model="dialog"
          persistent
        >
          <v-card class="">
            <v-toolbar color="primary" dark flat dense>
              <v-toolbar-title class="font-weight-bold"
                >{{ $t("deforestation.addNewOperator") }}
              </v-toolbar-title>

              <v-spacer></v-spacer>

              <v-btn icon class="white--text" @click="closeModal">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-form
              @submit.prevent="addNewOperator"
              ref="addNewOperator"
              lazy-validation
            >
              <v-card-text>
                <v-row class="">
                  <v-col cols="6">
                    <label class="label">
                      {{ $t("firstName") }}
                    </label>
                    <v-text-field
                      :rules="rules.firstName"
                      type="text"
                      outlined
                      dense
                      :placeholder="$t('dueDiligence.enterFirstName')"
                      v-model="operator.firstName"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <label class="label">
                      {{ $t("deforestation.lastName") }}
                    </label>
                    <v-text-field
                      :rules="rules.lastName"
                      type="text"
                      outlined
                      dense
                      :placeholder="$t('dueDiligence.enterLastName')"
                      v-model="operator.lastName"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="">
                  <v-col cols="6">
                    <label class="label">
                      {{ $t("deforestation.email") }}
                    </label>
                    <v-text-field
                      type="text"
                      :rules="rules.email"
                      outlined
                      dense
                      :placeholder="$t('deforestation.enterEmailAddress')"
                      v-model="operator.email"
                      :error-messages="verifyEmailError"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <label class="label">
                      {{ $t("deforestation.phoneNumber") }}
                    </label>
                    <v-text-field
                      type="text"
                      :rules="rules.mobile"
                      outlined
                      dense
                      :placeholder="$t('deforestation.enterPhoneNumber')"
                      v-model="operator.mobile"
                      :error-messages="verifyMobileError"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <label class="label">
                      {{ $t("deforestation.country") }}
                    </label>
                    <v-autocomplete
                      :items="countries"
                      v-model="operator.countryId"
                      class="mr-1"
                      dense
                      item-text="name"
                      item-value="name"
                      outlined
                      :placeholder="$t('profileSetting.selectCountry')"
                      :rules="rules.country"
                      return-object
                    >
                      <template v-slot:item="slotProps">
                        <i
                          :class="[
                            'mr-2',
                            'em',
                            `em-flag-${slotProps.item.code.toLowerCase()}`,
                          ]"
                        ></i>
                        {{ `${slotProps.item.name}` }}
                      </template>
                      <template slot="selection" slot-scope="data">
                        <i
                          :class="[
                            'mr-2',
                            'em',
                            `em-flag-${data.item.code.toLowerCase()}`,
                          ]"
                        ></i>
                        {{ `${data.item.name}` }}
                      </template>
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="6">
                    <label class="label">
                      {{ $t("dueDiligence.eoriNumber") }}
                    </label>
                    <v-text-field
                      type="text"
                      outlined
                      dense
                      :placeholder="$t('dueDiligence.enterEORINumber')"
                      v-model="operator.eori_number"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  outlined
                  @click="closeModal"
                  class="mr-2"
                  depressed
                  style="min-width: 150px;"
                  color="primary"
                >
                  {{ $t("cancel") }}
                </v-btn>
                <v-btn type="submit" color="primary" style="min-width: 150px;">
                  {{ $t("confirm") }}
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
          <!-- </template> -->
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
      verifyEmailError: '',
      verifyMobileError: '',
      countries: [],
      operator: {
        firstName: null,
        lastName: null,
        email: null,
        countryDetails: {},
        country: null,
        countryId: null,
        countryIsoCode: null,
        mobile: null,
        eori_number: null,
      },
      rules: {
        firstName: [(v) => !!v || this.$t("deforestation.firstNameIsRequired")],
        lastName: [(v) => !!v || this.$t("deforestation.lastNameIsRequired")],
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
    addNewOperator() {
      this.verifyEmailError = '';
      this.verifyMobileError = '';

      if (!this.$refs.addNewOperator.validate()) return;
      this.startLoading();

      this.operator.country =
        typeof this.operator.countryId == "object"
          ? this.operator.countryId.name
          : this.operator.countryId;

      this.operator.countryIsoCode =
        typeof this.operator.countryId == "object"
          ? this.operator.countryId.code
          : this.operator.countryId;
      delete this.operator.countryId;


      const operatorData = {
        firstName: this.operator.firstName,
        lastName: this.operator.lastName,
        email: this.operator.email,
        mobile: this.operator.mobile,
        country: this.operator.country,
        countryIsoCode: this.operator.countryIsoCode,
        verified: 0,
        eori_number: this.operator.eori_number,
        role: "operator",
      };

      UserService.addDdsUser(operatorData)
        .then((data) => {
          if (data.success) {
            this.$emit("operatorAdded", { success: true, data: data.data });
          } else {
            if(data) {
                if (data.emailError) {
                this.verifyEmailError = this.$t("addEdituser.emailExistAlready");
              } else if (data.mobileError) {
                this.verifyMobileError = this.$t("addEdituser.mobileExistAlready");
              }
              this.stopLoading();
              return;
            }
            this.$emit("operatorAdded", { success: false });
          }
          this.clearOperator();
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
    clearOperator() {
      this.operator.firstName = null;
      this.operator.lastName = null;
      this.operator.email = null;
      this.operator.mobile = null;
      this.operator.country = null;
      this.operator.countryId = null;
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