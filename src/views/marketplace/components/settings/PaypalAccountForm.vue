<template>
  <v-dialog
    v-model="paypalAccountAddDialog"
    width="80%"
    @click:outside="closeModal"
    :retain-focus="false"
  >
    <v-card class="custom-card" rounded="0">
      <!-- Toolbar -->
      <v-toolbar color="#00BD73" class="white--text">
        <v-toolbar-title class="font-weight-bold">{{
          $t("marketplace.settings.addPaypalAccountBtn")
        }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon class="white--text" @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <!-- Form -->
      <v-form ref="paypalAccountForm" lazy-validation autocomplete="off">
        <v-card-text class="black--text">
          <v-row>
            <v-col cols="12" class="mt-5">
              <h2 class="font-weight-bold">
                {{ $t("marketplace.settings.addPaypalAccountBtn") }}
              </h2>
            </v-col>

            <!-- Account Title -->
            <v-col cols="6">
              <label class="font-weight-bold">Account Title</label>
              <v-text-field
                v-model="formData.accountTitle"
                outlined
                :placeholder="$t('marketplace.settings.typeHere')"
                clearable
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- PayPal Account -->
          <v-col cols="6">
            <v-row>
              <v-col cols="12">
                <label class="font-weight-bold">{{
                  $t("marketplace.settings.paypalAccount")
                }}</label>
              </v-col>

              <!-- Email Option -->
              <v-col cols="12">
                <v-radio-group v-model="radios" row>
                  <v-radio value="email" label="Email" color="green"></v-radio>
                  <v-text-field
                    v-model="formData.email"
                    outlined
                    :placeholder="$t('marketplace.settings.typeHere')"
                    clearable
                    hide-details
                  ></v-text-field>
                </v-radio-group>
              </v-col>

              <!-- Phone Option -->
              <v-col cols="12">
                <v-radio-group v-model="radios" row>
                  <v-radio value="phone" label="Phone" color="green"></v-radio>
                  <v-text-field
                    v-model="formData.phone"
                    outlined
                    :placeholder="$t('marketplace.settings.typeHere')"
                    clearable
                    hide-details
                  ></v-text-field>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-col>
          <!-- Actions -->
          <v-card-actions class="mt-10" style="padding-right: 0">
            <v-spacer></v-spacer>
            <v-btn
              outlined
              class="mr-2"
              height="44"
              width="116"
              depressed
              color="green"
              @click="closeModal"
            >
              {{ $t("cancel") }}
            </v-btn>
            <v-btn
              right
              height="44"
              width="116"
              color="primary"
              @click="save()"
            >
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
    paypalAccountAddDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: {
        accountTitle: "",
        email: "",
        phone: "",
      },
      radios: "",
    }
  },
  methods: {
    closeModal() {
      this.$emit("closeModal")
    },
    save() {
      // Add save logic here
    },
  },
}
</script>

<style scoped>
.custom-card {
  border-radius: 8px;
}
</style>
