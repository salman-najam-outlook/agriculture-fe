<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <v-card elevation="1" class="px-5 mt-7">
        <v-card-text>
          <v-row class="pt-10">
            <v-col cols="2" class="text-center">
              <div style="position: relative;">
                <v-avatar size="200" max-height="100%" max-width="100%">
                  <img
                    alt="user"
                    :src="
                      user.profilePicUrl
                        ? user.profilePicUrl
                        : '/img/NO_Image_Available.jpg'
                    "
                  />
                  <v-file-input
                    id="fileUpload"
                    accept="image/*"
                    hide-input
                    prepend-icon=""
                    @change="onFileChanged($event)"
                  />
                </v-avatar>
                <v-btn
                  style="position: absolute; bottom: 20%; right: 0%"
                  depressed
                  color="primary"
                  fab
                  @click="getFile"
                >
                  <v-icon>mdi-camera-account</v-icon>
                </v-btn>
              </div>
            </v-col>
            <v-col v-if="!isEditable" cols="10" class="pb-10">
              <v-row>
                <v-col cols="4">
                  <p class="text-h6 mb-2">
                    <strong>{{ $t("name") }}:</strong>
                    {{ user.fullName || "-" }}
                  </p>
                </v-col>
                <v-col cols="8">
                  <p class="text-h6 mb-2">
                    <strong>{{ $t("email") }}:</strong>
                    {{ user.email || "-" }}
                  </p>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4">
                  <p class="text-h6 mb-2">
                    <strong>{{ $t("deforestation.phoneNumber") }}: </strong
                    >{{ user.mobile || "-" }}
                  </p>
                </v-col>
                <v-col cols="8">
                  <p class="text-h6 mb-2">
                    <strong>{{ $t("address") }}:</strong>
                    {{ user.address || "-" }}
                  </p>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4">
                  <p class="text-h6 mb-2">
                    <strong>{{ $t("country") }}:</strong>
                    {{ user.country || "-" }}
                  </p>
                </v-col>
                <v-col cols="8">
                  <p class="text-h6 mb-2">
                    <strong>{{ $t("deforestation.type") }}:</strong>
                  </p>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4">
                  <p class="text-h6 mb-2">
                    <strong>{{ $t("profileSetting.organization") }}:</strong>
                    {{ user.organization || "-" }}
                  </p>
                </v-col>
                <v-col cols="8">
                  <p class="text-h6 mb-2">
                    <strong>{{ $t("farm.licenseNumber") }}:</strong>
                  </p>
                </v-col>
              </v-row>
            </v-col>
            <v-col v-else cols="10" class="pb-10">
              <v-row>
                <v-col cols="4">
                  <label>{{ $t("firstName") }}</label>
                  <v-text-field
                    v-model="user.firstName"
                    :placeholder="$t('firstName')"
                    outlined
                    dense
                    :error-messages="errors.firstName"
                    :rules="rules.firstName"
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <label>{{ $t("lastName") }}</label>
                  <v-text-field
                    v-model="user.lastName"
                    :placeholder="$t('lastName')"
                    outlined
                    dense
                    :error-messages="errors.lastName"
                    :rules="rules.lastName"
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <label>{{ $t("emailId") }}</label>
                  <v-text-field
                    v-model="user.email"
                    :placeholder="$t('emailId')"
                    outlined
                    dense
                    :error-messages="errors.email"
                    :rules="rules.email"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4">
                  <label>{{ $t("mobile") }}</label>
                  <v-text-field
                    v-model="user.mobile"
                    :placeholder="$t('mobile')"
                    outlined
                    dense
                    :error-messages="errors.mobile"
                    :rules="rules.mobile"
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <label>{{ $t("address") }}</label>
                  <v-text-field
                    v-model="user.address"
                    :placeholder="$t('address')"
                    outlined
                    dense
                    :error-messages="errors.address"
                    :rules="rules.address"
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <label>{{ $t("country") }}</label>
                  <v-autocomplete
                    outlined
                    dense
                    v-model="user.country"
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
              </v-row>
              <v-row>
                <v-col cols="4">
                  <label>{{ $t("profileSetting.organization") }}</label>
                  <v-text-field
                    disabled
                    :placeholder="$t('profileSetting.organization')"
                    outlined
                    dense
                    :error-messages="errors.department"
                    :rules="rules.department"
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <label>{{ $t("farm.licenseNumber") }}</label>
                  <v-text-field
                    disabled
                    :placeholder="$t('farm.licenseNumber')"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <p
                    class="primary--text text-decoration-underline cursor_pointer"
                    @click="dialog=true"
                  >
                    {{  $t('changePassword') }}
                  </p>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-divider class="mt-10 py-4" />

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              @click="isEditable = false"
              outlined
              right
              height="44"
              width="116"
              depressed
              color="primary"
            >
              {{ $t("cancel") }}
            </v-btn>
            <v-btn
              @click="handleClick"
              :type="isEditable ? 'submit' : 'button'"
              right
              height="44"
              width="116"
              color="primary"
            >
              {{ isEditable ? $t("update") : $t("edit") }}
            </v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-container>
    <v-dialog v-model="errorDialog" max-width="290">
      <v-card>
        <v-card-title class="text-h5"> Error </v-card-title>

        <v-card-text>
          {{ errorText }}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="grey darken-1" text @click="errorDialog = false">
            {{ $t("cancel") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5"> {{  $t('changePassword') }} </v-card-title>

        <v-card-text>
          <v-form @submit.prevent="updatePassword">
            <v-text-field
              v-model="newPassword"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              name="newPassword"
              :label="$t('newPsw')"
              outlined
              dense
              @click:append="showPassword = !showPassword"
            ></v-text-field>
            <v-text-field
              v-model="confirmPassword"
              :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showConfirmPassword ? 'text' : 'password'"
              name="confirmPassword"
              :label="$t('confPsw')"
              outlined
              dense
              @click:append="showConfirmPassword = !showConfirmPassword"
            ></v-text-field>

            <v-row>
              <v-col cols="6">
                <v-btn text @click="generateSecurePassword">{{ $t('generateSecurePassword')}}</v-btn>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="generatedPassword"
                  readonly
                  append-icon="mdi-content-copy"
                  outlined
                  dense
                  @click:append="copyToClipboard(generatedPassword)"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              outlined
              right
              height="44"
              width="116"
              depressed
              color="primary" @click="dialog = false">{{ $t("cancel") }}</v-btn>
          <v-btn 
              right
              height="44"
              width="116"
              depressed color="green white--text" @click="updatePassword">{{ $t("update") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
  </div>
</template>

<script>
import { getCountries } from "country-state-picker";
import ProfileService from "@/_services/ProfileService";
import loadingMixin from "@/mixins/LoadingMixin";

export default {
  created() {},
  mounted() {
    this.getCountry();
    this.getProfileData();
  },
  data() {
    return {
      errorText: "",
      errorDialog: false,
      isEditable: false,
      countries: [],
      breadcrumbs: [
        {
          text: this.$t('dashboard'),
          disabled: false,
          href: "/",
        },
        {
          text: this.$t('profile'),
          disabled: true,
          href: "breadcrumbs_link_1",
        },
      ],
      orgUser: {},
      user: {
        id: "",
        fullName: "",
        firstName: "",
        lastName: "",
        address: "",
        email: "",
        mobile: "",
        organization: "",
        profilePicUrl: "",
        country: "",
        dial_code: "",
      },
      email: "",
      editEmail: false,
      canUpdateEmail: false,
      verifyEmail: false,
      preferedLanguageId: "",
      selectedLangs: [],
      showOtp: false,
      otp: ["", "", "", "", "", ""],
      errors: {
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        password: "",
        department: "",
        role: "",
      },
      rules: {
        firstName: [
          (v) => !!v || this.$t("addEdituser.firstNameRequired"),
          (v) =>
            /^[a-z0-9\s]+$/i.test(v) ||
            this.$t("addEdituser.firstNameOllyAlpha"),
          (v) => (v && v.length <= 15) || this.$t("addEdituser.firstNameLimit"),
        ],
        lastName: [
          (v) => !!v || this.$t("addEdituser.lastNameRequired"),
          (v) =>
            /^[a-z0-9\s]+$/i.test(v) ||
            this.$t("addEdituser.lastNameOllyAlpha"),
          (v) => (v && v.length <= 15) || this.$t("addEdituser.lastNameLimit"),
        ],
        email: [
          (v) => !!v || this.$t("addEdituser.emailReuired"),
          (v) =>
            /^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(v) ||
            this.$t("addEdituser.emailInvalid"),
        ],
        mobile: [(v) => !!v || this.$t("addEdituser.mobileRequired")],
        password: [(v) => !!v || this.$t("addEdituser.pswRequired")],
        department: [(v) => !!v || this.$t("addEdituser.deptRequired")],
        role: [(v) => !!v || this.$t("addEdituser.roleRequired")],
        country: [(v) => !!v || this.$t("addEdituser.countryRequired")],
        state: [(v) => !!v || this.$t("stateIsReq")],
        city: [(v) => !!v || this.$t("cityIsReq")],
      },
      selectedFile: null,

      // change password
      dialog:false,
      newPassword: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      generatedPassword: '',
    };
  },
  methods: {
    async handleClick() {
      if (this.isEditable) {
        // update
        await this.updateProfile();
        this.isEditable = false;
      } else {
        this.isEditable = true;
      }
    },
    getProfileData() {
      this.startLoading();
      ProfileService.getProfileData()
        .then((res) => {
          if (res.success) {
            this.user = {
              ...res.data,
              organization: res.data?.user_organization?.name,
            };
          } else {
            console.error("Error fetching profile data:", res.message);
          }
        })
        .catch((e) => {
          console.error("Error fetching profile data:", e);
        })
        .finally(() => {
          this.stopLoading();
        });
    },
    async updateProfile() {
      console.log("payload", this.payload);
      if (this.user.email == "" && this.user.mobile == "") {
        this.$notify({
          title: this.$t("emailAndMobileCantbeEmpty"),
          text: ``,
          type: "error",
        });
        return;
      }
      this.startLoading();

      this.user.countryCode =
        typeof this.user.country == "object"
          ? this.user.country.dial_code
          : this.user.dial_code;

      this.user.countryId =
        typeof this.user.country == "object"
          ? this.user.country.code
          : this.user.countryId;

      this.user.country =
        typeof this.user.country == "object"
          ? this.user.country.name
          : this.user.country;

      const {
        id,
        firstName,
        lastName,
        email,
        mobile,
        address,
        countryCode,
        country,
        countryId,
      } = this.user;

      ProfileService.updateProfileData({
        id,
        firstName,
        lastName,
        email,
        mobile,
        address,
        countryCode,
        country,
        countryId,
      })
        .then((res) => {
          console.log(res);
          this.$notify({
            title: this.$t("user.profileUpdated"),
            text: ``,
            type: "success",
          });
          this.stopLoading();
          this.getProfileData();
        })
        .catch(() => {
          this.$notify({
            title: this.$t("somethingWentWrong"),
            text: this.$t("pleaseTryAgainAfterSometime"),
            type: "error",
          });
        })
        .finally(()=>{
          this.stopLoading();
        });
    },
    getCountry() {
      this.countries = getCountries();
    },
    getFile() {
      let fileUpload = document.getElementById("fileUpload");
      if (fileUpload != null) {
        fileUpload.click();
      }
    },
    onFileChanged(filename) {
      this.selectedFile = filename;
      if (this.selectedFile) {
        let size = this.selectedFile.size;
        console.log(size);
        if (!this.selectedFile.type.match("image.*")) {
          // check whether the upload is an image
          this.errorDialog = true;
          this.errorText = this.$t("pleaseChooseAnImageFile");
        } else if (size > 1000000) {
          // check whether the size is greater than the size limit
          this.errorDialog = true;
          this.errorText = this.$t("fileIsTooBigSelectUnder1MB");
        } else {
          // Append file into FormData & turn file into image URL
          let formData = new FormData();
          // let imageURL = URL.createObjectURL(this.selectedFile)
          // console.log("url",imageURL)
          formData.append("profilePic", this.selectedFile);
          formData.append("id", this.user.id);
          this.startLoading();
          ProfileService.imageUpdate(formData)
            .then((res) => {
              if (res.success) {
                this.user.profilePicUrl = res.data.profilePicUrl;
                this.$notify({
                  title: this.$t("Profile Updated"),
                  text: ``,
                  type: "success",
                });
              }
              // this.getProfileData()
              this.stopLoading();
            })
            .catch(() => {
              this.$notify({
                title: this.$t("somethingWentWrong"),
                text: this.$t("pleaseTryAgainAfterSometime"),
                type: "error",
              });
              this.stopLoading();
            });
        }
      }
    },
    updatePassword(){
      if (this.newPassword === this.confirmPassword) {
        this.startLoading();
        ProfileService.updatePassword({
        newPassword: this.newPassword,
        confirmPassword: this.confirmPassword,
      })
        .then((res) => {
          if (res.success) {
            this.$notify({
              title: this.$t("passwordChangedSuccesFully"),
              text: ``,
              type: "success",
            });
          } else {
            this.$notify({
              title: res.message,
              text: ``,
              type: "error",
            });
          }
          this.stopLoading();
          this.newPassword = "";
          this.confirmPassword = "";
          this.generatedPassword = "";
          this.dialog = false;
        })
        .catch((error) => {
          if (error.status == 422) {
            error.data.message.errors.forEach((err) => {
              this.errors[err.param] = err.msg;
            });
          }
          this.$notify({
            title: this.$t("somethingWentWrong"),
            text: this.$t("pleaseTryAgainAfterSometime"),
            type: "error",
          });
          this.stopLoading();
        });
      } else {
        this.$notify({
          type:"error",
          text: this.$t('passwordDoesNotMatch')
        })
      }
    },
    generateSecurePassword(){
      this.generatedPassword = Math.random().toString(36).slice(-8);
    },
    copyToClipboard(text){
      if(text.length > 0){
        navigator.clipboard.writeText(text).then(()=>{
        this.$notify({
          type:'success',
          title: this.$t('copyToCliped')
        })
      })
      }
    }
  },
  mixins: [loadingMixin],
};
</script>

<style scoped lang="scss">
.cursor_pointer {
  cursor: pointer !important;
}
</style>
