<template>
  <v-container>
    <template>
      <div class="text-center">
        <v-dialog v-model="dialog" width="800" @click:outside="closeModal">
          <v-card rounded="0">
            <v-toolbar color="primary" class="white--text" flat :elevation="0">
              <v-toolbar-title class="font-weight-bold">{{
                this.$t("activationKey.activationKey")
              }}</v-toolbar-title>

              <v-spacer></v-spacer>

              <v-btn icon class="white--text" @click="closeModal">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text class="pt-5">
              <v-form
                ref="generateKeys"
                v-model="valid"
                lazy-validation
                autocomplete="off"
              >
                <v-card flat :elevation="0">
                  <v-row>
                    <v-col cols="6">
                      <label
                        for="numberOfKeys"
                        class="text-subtitle-1 font-weight-bold"
                        >{{ this.$t("activationKey.numberOfActKey") }}
                        <span class="red--text">*</span>
                        </label
                      >
                      <v-text-field
                        type="number"
                        placeholder="0"
                        outlined
                        dense
                        v-model="numberOfKeys"
                        :error-messages="errors.numberOfKeys"
                        :rules="rules.numberOfKeys"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6" v-if="!fromAppUser">
                      <label
                        for="membershipRole"
                        class="text-subtitle-1 font-weight-bold"
                        >{{ this.$t("activationKey.membershipRoleFilter") }}
                        <v-tooltip top color="black" max-width="350">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon
                                v-bind="attrs"
                                v-on="on"
                                >
                                mdi-information-outline
                                </v-icon>
                            </template>
                            <span>{{ this.$t('activationKey.membershipRoleFilterDesc') }}</span>
                        </v-tooltip>
                        </label
                      >
                      <v-select
                        :items="allRoles"
                        :placeholder="$t('select')"
                        outlined
                        dense
                        v-model="membershipRole"
                        :error-messages="errors.role"
                        item-text="name"
                        item-value="id"
                        :rules="rules.role"
                        @change="getMembershipPlan"
                      ></v-select>
                    </v-col>
                    <v-col cols="6">
                      <label
                        for="membershipType"
                        class="text-subtitle-1 font-weight-bold"
                        >{{ this.$t("activationKey.membershipPlan") }}
                        <span class="red--text">*</span></label
                      >
                      <v-select
                        :items="membershipList"
                        :placeholder="$t('select')"
                        outlined
                        dense
                        v-model="membershipType"
                        :error-messages="errors.membershipType"
                        item-text="membership_type"
                        item-value="id"
                        :rules="rules.membershipType"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" class="mt-n5">
                      <label
                        for="name"
                        class="text-subtitle-1 font-weight-bold"
                        >{{ this.$t("activationKey.comments") }}</label
                      >
                      <v-text-field
                        :placeholder="$t('enterComment')"
                        outlined
                        rows="2"
                        v-model="comment"
                        :error-messages="errors.comment"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card>
                <v-card-actions class="mt-10">
                  <v-spacer></v-spacer>
                  <v-btn
                    @click="closeModal"
                    outlined
                    right
                    height="44"
                    width="116"
                    depressed
                    color="primary"
                  >
                    {{ this.$t("cancel") }}
                  </v-btn>
                  <v-btn
                    @click="generateKeys"
                    depressed
                    right
                    height="44"
                    width="220"
                    color="primary"
                  >
                    {{ this.$t("activationKey.genKeys") }}
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </template>
  </v-container>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";
import ActivationKeyService from "@/_services/ActivationService.js";

export default {
  async mounted() {
    const fetchData = async () => {
      this.startLoading();
      const res = await ActivationKeyService.getAllRoles();
      const memberships = await ActivationKeyService.getAllMemberships();
      this.allRoles = res.data.listRes;
      this.membershipList = memberships.data.listRes;
      // console.log('ssd', this.membershipList)
      this.stopLoading();
    };
    await fetchData();
  },
  computed: {
    dialog() {
      return this.dialogU;
    },
    fromAppUser() {
      return this.appUser;
    },
  },
  data() {
    return {
      valid: true,
      membershipList: [],
      allRoles: [],
      error: false,
      membershipType: null,
      membershipRole: "coffee_farmer",
      numberOfKeys: 10,
      comment: "",
      errors: { membershipType: "", numberOfKeys: "", comment: "", role: "" },
      rules: {
        membershipType: [(v) => !!v || this.$t('activationKey.memberRequired')],
        role: [(v) => !!v || this.$t('activationKey.memberRoleRequired')],
        numberOfKeys: [(v) => !!v || this.$t('activationKey.memberKeyRequired')],
      },
    };
  },
  methods: {
    closeModal() {
      this.$emit("closeGenerateKeys");
    },
    async generateKeys() {
      if (!this.$refs.generateKeys.validate()) return;
      this.startLoading();
      try {
        const { data } = await this.$http.post("/user/activation", {
          membershipType: this.membershipType,
          numberOfKeys: this.numberOfKeys,
          comment: this.comment,
        });
        if (data.code === 200) {
          this.stopLoading();
          const hasErrors = data.message && data.message.errors;

          this.$notify({
            title: hasErrors
              ? data.message.errors[0].msg
              : "Activation Key generated successfully.",
            type: hasErrors ? "error" : "success",
          });

          this.$emit("keysGenerated", true);
        } else {
          this.stopLoading();
          this.$notify({
            title: this.$t("somethingWentWrong."),
            type: "error",
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    async getMembershipPlan() {
      const { data } = await ActivationKeyService.getAllMemberships(
        this.membershipRole
      );
      this.membershipList = data.listRes;
    }
  },
  props: {
    dialogU: {
      type: Boolean,
      required: true,
    },
    appUser: {
      type: Boolean
    },
  },
  mixins: [loadingMixin],
};
</script>

<style lang="scss" scoped>
::v-deep .bg .v-input__slot {
  background-color: $primary-color;
  color: #ffffff;
}
</style>
