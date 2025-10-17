<template>
  <v-container>
    <template>
      <div class="text-center">
        <v-dialog v-model="dialog" width="800" @click:outside="closeModal">
          <v-card rounded="0">
            <v-toolbar color="primary" class="white--text" flat :elevation="0">
              <v-toolbar-title class="font-weight-bold">{{
                this.$t("Share via Email")
              }}</v-toolbar-title>

              <v-spacer></v-spacer>

              <v-btn icon class="white--text" @click="closeModal">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text class="pt-5">
              <div v-if="!mailSent">
                <v-form
                  ref="sendEmail"
                  v-model="valid"
                  lazy-validation
                  autocomplete="off"
                >
                  <v-card flat :elevation="0">
                    <v-row class="d-flex align-center">
                      <v-col cols="10">
                        <label
                          for="autoLogOff"
                          class="text-subtitle-1 font-weight-bold"
                          >{{ this.$t("email") }}</label
                        >
                        <v-text-field
                          placeholder="Enter Email"
                          outlined
                          :error-messages="errors.name"
                          :rules="rules.email"
                          v-model="email"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="2" class="">
                        <v-btn
                          @click="sendEmail"
                          right
                          height="50"
                          width="112"
                          color="primary"
                        >
                          {{ this.$t("SEND EMAIL") }}
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-form>
              </div>
              <div v-else class="d-flex align-center py-5">
                <v-img max-width="45" src="/icons/mail.png"></v-img>
                <span class="black--text ml-3 text-h5"
                  >EMAIL SENT SUCCESSFULLY</span
                >
              </div>
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
// import PermissionsService from '@/_services/PermissionsService'

export default {
  mounted() {
    this.mailSent = false;
  },
  created() {
    const fetchData = async () => {};
    fetchData();
  },
  computed: {
    dialog() {
      return this.dialogU;
    },
  },
  data() {
    return {
      email: "",
      valid: true,
      mailSent: false,
      error: false,
      errors: { email: "" },
      rules: {
        email: [
          (v) => !!v || "Email is required",
          (v) => this.validateEmail(v) || "Invalid email format.",
        ],
      },
    };
  },
  methods: {
    closeModal() {
      this.$emit("closeSendEmail");
    },
    async sendEmail() {
      if (!this.$refs.sendEmail.validate()) return;
      this.startLoading();
      //POST /api/admin/user/activation/generatedKeys/sendMail
      try {
        const { data } = await this.$http.post(
          `/user/activation/generatedKeys/sendMail`,
          {
            email: this.email,
            csvUrl: this.csvFileUrl ? this.csvFileUrl : null,
            generatedKeyId: this.generatedKey ? this.generatedKey : null,
          }
        );
        this.stopLoading();
        if (data.code == 200) {
          this.mailSent = true;
        } else {
          this.$notify({
            title: "Unable to send email.",
            type: "error",
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
  props: {
    dialogU: {
      type: Boolean,
      required: true,
    },
    generatedKey: {
      require: false,
    },
    csvFileUrl: {
      require: false,
    },
  },
  mixins: [loadingMixin, generalMixin, PermissionsMixin],
};
</script>

<style lang="scss" scoped>
::v-deep .bg .v-input__slot {
  background-color: $primary-color;
  color: #ffffff;
}
</style>
