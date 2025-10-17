<template>
  <v-container>
    <template>
      <div>
        <v-dialog transition="dialog-top-transition" max-width="600" v-model="dialog" persistent>
          <v-card class="">
            <v-toolbar color="primary" dark flat dense>
              <v-toolbar-title class="font-weight-bold">{{ $t("carbonCredit.register.addNewDimitraOffice") }}
              </v-toolbar-title>

              <v-spacer></v-spacer>

              <v-btn icon class="white--text" @click="closeModal">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-form @submit.prevent="addNewOffice" ref="addNewOffice" lazy-validation>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">
                    <div>
                      <label class="label">
                        {{ $t("carbonCredit.register.officeName") }}
                      </label>
                      <v-text-field :rules="rules.officeName" type="text" outlined dense
                        :placeholder="$t('carbonCredit.register.officeName')" v-model="officeName"></v-text-field>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div>
                      <label class="label">
                        {{ $t("carbonCredit.register.contactPerson") }}
                      </label>
                      <v-text-field :rules="rules.contactPerson" type="text" outlined dense
                        :placeholder="$t('carbonCredit.register.contactPerson')" v-model="contactPerson"></v-text-field>
                    </div>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" md="6">
                    <div>
                      <label class="label">
                        {{ $t("carbonCredit.register.phoneNumber") }}
                      </label>
                      <v-text-field type="text" :rules="rules.mobile" outlined dense
                        :placeholder="$t('carbonCredit.register.phoneNumber')" v-model="phoneNumber"
                        :error-messages="verifyMobileError"></v-text-field>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div>
                      <label class="label">
                        {{ $t("carbonCredit.register.email") }}
                      </label>
                      <v-text-field type="text" :rules="rules.email" outlined dense
                        :placeholder="$t('carbonCredit.register.email')" v-model="email"
                        :error-messages="verifyEmailError"></v-text-field>
                    </div>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" md="6">
                    <div>
                      <label class="label">
                        {{ $t("carbonCredit.register.address") }}
                      </label>
                      <v-text-field v-model="address" dense outlined :placeholder="$t('carbonCredit.register.address')"
                        :rules="rules.address" />
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn outlined @click="closeModal" class="mr-2" depressed style="min-width: 150px;" color="primary">
                  {{ $t("cancel") }}
                </v-btn>
                <v-btn type="submit" color="primary" style="min-width: 150px;">
                  {{ $t("add") }}
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
import generalMixin from "@/mixins/GeneralMixin";
import CarbonCreditService from "../../../../_services/CarbonCreditService";

export default {
  data() {
    return {
      officeName: null,
      contactPerson: null,
      email: null,
      address: null,
      phoneNumber: null,
      verifyEmailError: '',
      verifyMobileError: '',
      rules: {
        officeName: [(v) => !!v || this.$t("carbonCredit.register.officeNameRequired")],
        contactPerson: [(v) => !!v || this.$t("carbonCredit.register.contactPersonRequired")],
        email: [
          (v) => !!v || this.$t("addEdituser.emailReuired"),
          (v) =>
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,6})+$/.test(v) ||
            this.$t("addEdituser.emailInvalid"),
        ],
        mobile: [
          (v) => !!v || this.$t("carbonCredit.register.phoneNumberRequired"),
          (v) =>
            this.validMobileNumber(v) || this.$t("carbonCredit.register.phoneNumberInvalid"),
          (v) => (v && v.length <= 15) || this.$t("carbonCredit.register.phoneNumberLength"),
        ],
        address: [(v) => !!v || this.$t("carbonCredit.register.addressRequired")],
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
    organizationId: {
      type: Number,
      required: true,
    },
  },
  mounted() {
  },
  methods: {
    async addNewOffice() {
      try {
        this.verifyEmailError = '';
        this.verifyMobileError = '';

        if (!this.$refs.addNewOffice.validate()) return;
        this.startLoading();

        const office = {
          officeName: this.officeName,
          contactPerson: this.contactPerson,
          email: this.email,
          address: this.address,
          phoneNumber: this.phoneNumber,
          organizationId: this.organizationId,
        };        
        const response = await CarbonCreditService.createDimitraOffice(office);
        
        if (response.success) {
          this.$notify({
            text: this.$t("carbonCredit.register.officeAddedSuccessfully"),
            type: "success",
          });
          this.$emit("officeCreated", response.data);
          this.closeModal();
        } else {
          this.$notify({ title: this.$t("carbonCredit.register.errorAddingOffice"),
            text: response.message || this.$t("carbonCredit.register.errorAddingOffice"),
            type: "error",
          });
        }
      }
      catch (error) {
        console.error("Error adding office:", error);
        this.$notify({
          text: this.$t("carbonCredit.register.errorAddingOffice"),
          type: "error",
        });
      }
      finally {
        this.stopLoading();
        this.clearAddOffice();
      }
    },
    clearAddOffice() {
      this.officeName = null;
      this.contactPerson = null;
      this.email = null;
      this.address = null;
      this.phoneNumber = null;
      this.$refs.addNewOffice.reset();
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
