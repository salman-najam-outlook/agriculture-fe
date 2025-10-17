<template>
  <div class="eudr-bg">
   
    <v-container v-if="!userAlreadyVerified && !mixingIsLoading">
      <v-col cols="12" class="text-center">
        <img
          src="/img/eudr-dds/dimitra-eudr-logo.png"
          class="eudr-logo"
          alt="eudr logo"
        />
      </v-col>
      <v-card class="mx-auto px-10" max-width="900">
        <v-card-title class="text-center d-block my-5">
          <h4 class="font-weight-bold text-center">
            INVITATION TO CREATE ACCOUNT
          </h4>
        </v-card-title>
        <v-card-subtitle class="d-block text-center px-16">
          Welcome to the Dimitra EUDR Due Diligence Platform! You have received
          an invitation from <strong>{{ inviterName }}</strong> having
          <strong>EORI No. {{ euroNumber }}</strong
          >, to create an account as a product supplier. Please complete the
          registration process to ensure compliance with EUDR regulations and
          facilitate a smooth, transparent supply chain.
        </v-card-subtitle>
        <v-card-text>
          <v-form ref="invitationForm" v-model="valid" lazy-validation>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  label="First Name"
                  v-model="form.firstName"
                  outlined
                  :rules="rules.firstName"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  label="Last Name"
                  v-model="form.lastName"
                  outlined
                  :rules="rules.lastName"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  label="Email"
                  v-model="form.email"
                  outlined
                  :rules="rules.email"
                  required
                  disabled
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  label="Phone Number"
                  v-model="form.mobile"
                  outlined
                  :rules="rules.mobile"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  label="Address"
                  v-model="form.address"
                  outlined
                  :rules="rules.address"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-autocomplete
                  label="Country"
                  v-model="form.country"
                  :items="countries"
                  outlined
                  item-text="name"
                  item-value="name"
                  :rules="rules.country"
                  clearable
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  readonly
                  label="Organization Name"
                  v-model="form.organizationName"
                  outlined
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  label="License Number"
                  v-model="form.licenseNumber"
                  outlined
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  label="Password"
                  v-model="form.newPassword"
                  :type="showPassword ? 'text' : 'password'"
                  outlined
                  append-icon="mdi-eye"
                  @click:append="togglePasswordVisibility"
                  :rules="passwordRules"
                  required
                ></v-text-field>
                <v-progress-linear
                  :value="passwordStrength"
                  height="7"
                  :color="passwordStrengthColor"
                  class="mt-2"
                ></v-progress-linear>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  label="Confirm Password"
                  v-model="form.confirmPassword"
                  :type="showCPassword ? 'text' : 'password'"
                  outlined
                  append-icon="mdi-eye"
                  @click:append="toggleCPasswordVisibility"
                  :rules="[matchPasswordRule]"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-btn
            block
            large
            color="green"
            class="white--text font-weight-bold"
            @click="submitForm"
          >
            CREATE ACCOUNT
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
   
    <v-container v-if="userAlreadyVerified && !mixingIsLoading">
      <v-card>

        <v-row>
          <v-col cols="12" class="text-center">
            <img
              src="/img/eudr-dds/dimitra-eudr-logo.png"
              class="eudr-logo"
              alt="eudr logo"
            />
          </v-col>
          <v-col cols="12" class="text-center">
            <v-card>
  
              <h4 class="font-weight-bold">
                Your account has already been verified.
              </h4>
              <p>
                You have already verified your account. Please login to continue
                using the platform.</p>
              <v-btn
                block
                large
                color="green"
                class="white--text font-weight-bold"
                
                @click="goToSignInPage"
              >
                Go to Login Page
            </v-btn>
            </v-card>
          </v-col>
          
        </v-row>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import ProfileService from "@/_services/ProfileService";
import { getCountries } from "country-state-picker";
import loadingMixin from "@/mixins/LoadingMixin";

export default {
  async mounted() {
    this.startLoading();
    this.inviterId = this.$route.query.inviterId;
    this.inviteeId = this.$route.query.inviteeId;
    if (this.inviteeId) {
      try {
        const response = await ProfileService.getUserData(this.inviteeId);
        if(response.data.verified) {
          this.goToSignInPage();
        }
        const userData = response.data;
        if(userData.verified){
          this.userAlreadyVerified = true;
          this.stopLoading();          
        }

        this.form = {
          id: userData.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          mobile: userData.mobile,
          address: userData.address,
          organizationName: userData.user_organization?.name,
          country: userData.country,
          licenseNumber: userData.licenseNumber,
          verified: 1,
          newPassword: "",
          confirmPassword: "",
        };
      } catch (error) {
        console.log("Error fetching user details", error);
      }
    }

    if (this.inviterId) {
      const response = await ProfileService.getUserData(this.inviterId);
      
      const inviterId = response.data;

      
      

      this.inviterName = inviterId.firstName;
      this.eori_nubmer = inviterId.eori_nubmer;
    }
    this.stopLoading();
  },
  data() {
    return {
      inviterId: null,
      inviteeId: null,
      valid: false,
      showPassword: false,
      showCPassword: false,
      inviterName: "",
      euroNumber: "",
      form: {
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        address: "",
        organizationName: "",
        country: "",
        licenseNumber: "",
        newPassword: "",
        confirmPassword: "",
      },
      userAlreadyVerified: false,
      countries: [...getCountries()],
      rules: {
        firstName: [(v) => !!v || "First name is required"],
        lastName: [(v) => !!v || "Last name is required"],
        email: [(v) => !!v || "Email is required"],
        mobile: [(v) => !!v || "Phone number is required"],
        address: [(v) => !!v || "Address is required"],
        country: [(v) => !!v || "Country is required"],
      },
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) =>
          (v && v.length >= 6) || "Password must be at least 6 characters long",
        (v) =>
          /[A-Z]/.test(v) ||
          "Password must contain at least one uppercase letter",
        (v) =>
          /[a-z]/.test(v) ||
          "Password must contain at least one lowercase letter",
        (v) => /[0-9]/.test(v) || "Password must contain at least one digit",
        (v) =>
          /[@$!%*?&#]/.test(v) ||
          "Password must contain at least one special character",
      ],
    };
  },
  computed: {
    passwordStrength() {
      const length = this.form.newPassword.length;
      if (length > 6) {
        let strength = 0;
        if (/[A-Z]/.test(this.form.newPassword)) strength += 20;
        if (/[a-z]/.test(this.form.newPassword)) strength += 20;
        if (/[0-9]/.test(this.form.newPassword)) strength += 20;
        if (/[@$!%*?&#]/.test(this.form.newPassword)) strength += 20;
        if (length >= 8) strength += 20;
        return strength;
      }
      return 0;
    },
    passwordStrengthColor() {
      if (this.passwordStrength === 100) return "green";
      if (this.passwordStrength >= 60) return "yellow";
      return "red";
    },
    matchPasswordRule() {
      return (v) => v === this.form.newPassword || "Passwords do not match";
    },
    errorMessages() {
    const errorMessages = [];
    if (this.$refs.invitationForm) {
      for (const field in this.$refs.invitationForm.inputs) {
        const input = this.$refs.invitationForm.inputs[field];
        if (!input.isValid) {
          errorMessages.push(...input.errorBucket);
        }
      }
    }
    return errorMessages;
  }
  },
  methods: {
    goToSignInPage() {
      this.$router.push({
        name: "login",
      });
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    toggleCPasswordVisibility() {
      this.showCPassword = !this.showCPassword;
    },
    submitForm() {
      this.$refs.invitationForm.validate();
      if (this.$refs.invitationForm.validate()) {
        this.startLoading();
        const {
          id,
          firstName,
          lastName,
          email,
          mobile,
          address,
          country,
          newPassword,
          confirmPassword,
        } = this.form;

        ProfileService.updateProfileData({
          id,
          firstName,
          lastName,
          email,
          mobile,
          address,
          country,
          newPassword,
          confirmPassword,
          verified: 1,
        })
          .then((res) => {
            if(res?.data?.success){
              this.$notify({
                title: "Invitation Accepted Successfully",
                text: ``,
                type: "success",
              });
              this.$router.push({
                name: "login",
              });
            }else{
              this.$notify({
                title: res?.data?.message || "Something went wrong",
                text: ``,
                type: "error",
              });
            }
          })
          .catch(() => {
            this.$notify({
              title: this.$t("somethingWentWrong"),
              text: this.$t("pleaseTryAgainAfterSometime"),
              type: "error",
            });
          })
          .finally(() => {
            this.stopLoading();
          });
      }
      else{
        console.log("Form is invalid");
        this.$notify({
          title:this.errorMessages.join(', '),
          text: ``,
          type: "error",
        });
      }
    },
  },
  mixins: [loadingMixin],
};
</script>

<style scoped>
.eudr-bg {
  background: url("/img/eudr-dds/invitation-bg.png") no-repeat center / cover;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.eudr-logo {
  max-width: 20%;
  padding: 20px;
}
</style>
