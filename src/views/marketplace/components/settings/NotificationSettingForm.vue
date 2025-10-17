<template>
  <v-dialog
    v-model="showNotificationSetting"
    width="50%"
    @click:outside="closeDialog"
    :retain-focus="false"
  >
    <v-card class="custom-card" rounded="0">
      <v-toolbar color="primary" class="white--text" flat>
        <v-toolbar-title class="font-weight-bold">
          {{ $t("marketplace.settings.notification") }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon class="white--text" @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-form ref="addUser" lazy-validation autocomplete="off">
        <v-card-text class="px-4">
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="notificationTitle"
                :items="notificationTitles"
                :label="$t('marketplace.settings.notificationTitle')"
                outlined
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="notificationFrequency"
                :items="notificationFrequencies"
                :label="$t('marketplace.settings.notificationFrequency')"
                outlined
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <label for="">{{
                $t("marketplace.settings.notificationMode")
              }}</label>
              <v-radio-group v-model="notificationMode" row>
                <v-radio
                  v-for="(mode, index) in notificationModes"
                  :key="index"
                  :label="mode.text"
                  :value="mode.value"
                ></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="mt-10 px-4" style="padding-right: 0">
          <v-spacer></v-spacer>
          <v-btn
            outlined
            class="mr-2"
            right
            height="44"
            width="116"
            depressed
            color="primary"
            @click="closeDialog"
          >
            {{ $t("cancel") }}
          </v-btn>

          <v-btn
            right
            height="44"
            width="116"
            color="primary"
            @click="onContinueClick()"
          >
            {{ $t("save") }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script>
import { constants } from "../../constants/settings"
export default {
  props: {
    showNotificationSetting: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      notificationTitle: null,
      notificationTitles: constants.notificationTitles,
      notificationFrequency: null,
      notificationFrequencies: constants.notificationFrequencies,
      notificationMode: "in_app",
      notificationModes: constants.notificationModes,
    }
  },
  methods: {
    closeDialog() {
      this.$emit("closeModal")
    },
    cancel() {
      this.$emit("closeModal")
    },
    onContinueClick() {
      this.$emit("closeModal")
    },
  },
}
</script>
<style scoped>
.custom-card {
  border-radius: 0;
}
</style>
