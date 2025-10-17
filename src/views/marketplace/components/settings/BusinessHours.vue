<template>
  <v-dialog
    v-model="showTimings"
    width="50%"
    @click:outside="closeModal"
    :retain-focus="false"
  >
    <v-card class="custom-card" rounded="0">
      <v-toolbar color="primary" class="white--text">
        <v-toolbar-title class="font-weight-bold">
          {{ $t("marketplace.settings.businessHours") }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon class="white--text" @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-form ref="businessHours" lazy-validation autocomplete="off">
        <v-card-text class="black--text px-5">
          <v-row dense>
            <v-col cols="12" class="my-2"
              ><h2>{{ $t("marketplace.settings.businessDays") }}</h2>
            </v-col>
            <v-col cols="12">
              <div class="d-flex justify-space-between">
                <label>{{ $t("marketplace.settings.timezone") }}</label>
              </div>
              <v-autocomplete
                v-model="timezone"
                :items="countries"
                item-value="UTC"
                :item-text="(item) => `${item.Timezone} (${item.UTC})`"
                outlined
                dense
                :placeholder="$t('marketplace.settings.selectTimezone')"
                clearable
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row
            v-for="(day, index) in businessDays"
            :key="index"
            align="center"
          >
            <v-col cols="3">
              <v-checkbox
                v-model="day.enabled"
                :label="day.name"
                dense
              ></v-checkbox>
            </v-col>
            <v-col cols="4">
              <v-menu
                v-if="day.enabled"
                ref="menu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="day.startTime"
                    label="Start Time"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker v-model="day.startTime"></v-time-picker>
              </v-menu>
            </v-col>
            <v-col cols="4">
              <v-menu
                v-if="day.enabled"
                ref="menu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="day.endTime"
                    label="End Time"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker v-model="day.endTime"></v-time-picker>
              </v-menu>
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
              right
              height="44"
              width="116"
              color="primary"
              @click="saveBusinessHours"
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
import { countries } from "@/constants/countries.js"
export default {
  props: {
    showTimings: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      countries: countries,
      timezone: "",
      businessDays: [
        {
          name: "Monday",
          enabled: false,
          startTime: "09:00",
          endTime: "17:00",
        },
        {
          name: "Tuesday",
          enabled: false,
          startTime: "09:00",
          endTime: "17:00",
        },
        {
          name: "Wednesday",
          enabled: false,
          startTime: "09:00",
          endTime: "17:00",
        },
        {
          name: "Thursday",
          enabled: false,
          startTime: "09:00",
          endTime: "17:00",
        },
        {
          name: "Friday",
          enabled: false,
          startTime: "09:00",
          endTime: "17:00",
        },
        {
          name: "Saturday",
          enabled: false,
          startTime: "09:00",
          endTime: "17:00",
        },
        {
          name: "Sunday",
          enabled: false,
          startTime: "09:00",
          endTime: "17:00",
        },
      ],
    }
  },
  methods: {
    closeModal() {
      this.$emit("closeModal")
    },
    saveBusinessHours() {
      const timings = {
        timezone: this.timezone,
        businessDays: this.businessDays,
      }
      this.$emit("saveBusinessHours", timings)
    },
  },
}
</script>
