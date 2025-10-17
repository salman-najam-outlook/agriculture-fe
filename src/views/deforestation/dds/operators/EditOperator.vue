<template>
  <v-container>
    <template>
      <div>
        <v-dialog
          v-model="dialog"
          width="55%"
          @click:outside="closeModal"
          :retain-focus="false"
        >
          <v-card class="custom-card" rounded="0">
            <v-toolbar color="primary" class="white--text">
              <v-toolbar-title class="font-weight-bold">
                {{ $t("dueDiligence.editOperator") }}
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon class="white--text" @click="closeModal">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-form
              class="pa-4"
              ref="updateOperator"
              lazy-validation
              autocomplete="off"
            >
              <v-card-text class="black--text">
                <v-row>
                  <v-col :style="{ marginRight: '30px' }">
                    <label> {{ $t("firstName") }}</label>
                    <v-text-field
                      outlined
                      dense
                      :rules="rules.firstName"
                      id="dialog-link"
                      v-model="operator.firstName"
                      :placeholder="$t('dueDiligence.enterFirstName')"
                    >
                    </v-text-field>

                    <label>{{ $t("email") }}</label>
                    <v-text-field
                      outlined
                      dense
                      :rules="rules.email"
                      id="dialog-link"
                      v-model="operator.email"
                      :placeholder="$t('dueDiligence.enterEmailAddress')"
                    >
                    </v-text-field>

                    <label for="country">{{ $t("country") }}</label>
                    <v-autocomplete
                      outlined
                      dense
                      v-model="operator.countryId"
                      :items="countries"
                      item-value="name"
                      item-text="name"
                      :rules="rules.country"
                      :placeholder="$t('country')"
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
                  <v-col :style="{ marginLeft: '30px' }">
                    <label>{{ $t("lastName") }}</label>
                    <v-text-field
                      outlined
                      dense
                      :rules="rules.lastName"
                      id="dialog-link"
                      v-model="operator.lastName"
                      :placeholder="$t('dueDiligence.enterLastName')"
                    >
                    </v-text-field>
                    <label>{{ $t("memberDataSection.phoneNumber") }}</label>
                    <v-text-field
                      v-model="operator.mobile"
                      :placeholder="$t('mobile')"
                      outlined
                      dense
                      :rules="rules.mobile"
                    >
                    </v-text-field>
                    <label>{{ $t("addEdituser.eoriNumber") }}</label>
                    <v-text-field
                      outlined
                      dense
                      id="dialog-link"
                      v-model="operator.eori_number"
                      :placeholder="$t('dueDiligence.enterEORINumber')"
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

                  <v-btn
                    class="mr-2"
                    right
                    height="44"
                    width="116"
                    depressed
                    color="primary"
                    @click="updateOperator()"
                  >
                    {{ $t("continue") }}
                  </v-btn>
                </v-card-actions>
              </v-card-text>
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
      operator: {
        firstName: null,
        lastName: null,
        email: null,
        country: null,
        countryId: null,
        mobile: null,
        eori_number: null,
        role: "operator",
      },
      rules: {
        firstName: [
          (v) => !!v || this.$t("addEdituser.firstNameRequired"),
          (v) =>
            /^[a-z0-9\s]+$/i.test(v) ||
            this.$t("addEdituser.firstNameOllyAlpha"),
          (v) => (v && v.length <= 50) || this.$t("addEdituser.firstNameLimit"),
        ],
        lastName: [
          (v) => !!v || this.$t("addEdituser.lastNameRequired"),
          (v) =>
            /^[a-z0-9\s]+$/i.test(v) ||
            this.$t("addEdituser.lastNameOllyAlpha"),
          (v) => (v && v.length <= 50) || this.$t("addEdituser.lastNameLimit"),
        ],
        email: [
          (v) => !!v || this.$t("addEdituser.emailReuired"),
          (v) =>
            /^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(v) ||
            this.$t("addEdituser.emailInvalid"),
        ],
        mobile: [
          (v) => !!v || this.$t("addEdituser.mobileRequired"),
          (v) =>
            this.validMobileNumber(v) || this.$t("addEdituser.invalidMobile"),
        ],
        country: [(v) => !!v || this.$t("addEdituser.countryRequired")],
        // eori_number: [
        //   (v) => !!v || this.$t("addEdituser.eoriNumberRequired"),
        //   (v) => this.isNumeric(v) || this.$t("addEdituser.eoriIsNumber"),
        // ],
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
    operatorData: {
      type: Object,
      required: true,
    },
  },
  created() {},
  mounted() {
    this.getCountry();
    const {
      firstName,
      lastName,
      email,
      countryId,
      mobile,
      eori_number,
    } = this.operatorData;
    this.operator = {
      ...this.operator,
      firstName: firstName,
      lastName: lastName,
      email: email,
      country: countryId,
      countryId: countryId,
      eori_number: eori_number,
      mobile: mobile,
    };
  },
  methods: {
    updateOperator() {
      if (!this.$refs.updateOperator.validate()) return;
      this.startLoading();

      this.operator.country =
        typeof this.operator.countryId == "object"
          ? this.operator.countryId.name
          : this.operator.countryId;
      this.operator.countryCode =
        typeof this.operator.countryId == "object"
          ? this.operator.countryId.dial_code
          : this.operator.dial_code;
      delete this.operator.countryId;

      UserService.updateDdsUser(this.operatorData.id, this.operator)
        .then((data) => {
          if (data.success) {
            this.$emit("operatorUpdate", {
              success: true,
              message: data.message,
            });
          } else {
            this.$emit("operatorUpdate", {
              success: false,
              message: data.message,
            });
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
      this.operator.eori_number = null;
    },
    getCountry() {
      this.countries = getCountries();
    },
    closeModal() {
      this.$emit("closeEditModal");
      this.mode = "start";
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
