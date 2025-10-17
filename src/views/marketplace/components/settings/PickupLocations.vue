<template>
  <div>
    <v-dialog
      v-model="pickupLocationsDialog"
      width="90%"
      @click:outside="closeModal"
      :retain-focus="false"
    >
      <v-card class="custom-card" rounded="0">
        <v-toolbar color="primary" class="white--text">
          <v-toolbar-title class="font-weight-bold">
            {{ $t("marketplace.settings.pickupLocations") }}</v-toolbar-title
          >
          <v-spacer></v-spacer>
          <v-btn icon class="white--text" @click="closeModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card ref="addUser" lazy-validation autocomplete="off">
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <h2>{{ $t("marketplace.settings.pickupLocations") }}</h2>
              </v-col>
            </v-row>
            <v-expansion-panels focusable multiple>
              <v-expansion-panel
                class="mt-5"
                v-for="(location, index) in pickupLocations"
                :key="index"
              >
                <v-expansion-panel-header class="font-weight-bold">
                  <v-row class="mx-4">
                    <v-col>{{ location.name }}</v-col>
                    <v-spacer></v-spacer>
                    <v-btn class="px-8" icon @click.stop>
                      <v-icon
                        @mousedown.stop.prevent="
                          location.isActive = !location.isActive
                        "
                        :color="location.isActive ? 'primary' : 'grey--text'"
                      >
                        {{
                          location.isActive
                            ? "mdi-checkbox-marked-circle"
                            : "mdi-circle"
                        }}
                      </v-icon>
                    </v-btn>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content class="pt-5">
                  <v-row class="mx-4">
                    <v-col cols="4">
                      <div>{{ location.address }}</div>
                      <div>{{ location.city }}</div>
                      <div>{{ location.country }}</div>
                    </v-col>
                    <v-col cols="2">
                      <v-btn icon>
                        <v-icon color="green"> mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn icon>
                        <v-icon color="red">mdi-trash-can-outline</v-icon>
                      </v-btn>
                    </v-col>
                    <v-spacer></v-spacer>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
            <v-btn
              class="mt-5"
              height="44"
              width="180"
              color="primary"
              @click="pickupLocationsAddDialog = true"
            >
              {{ $t("marketplace.settings.addPickupLocationBtn") }}
            </v-btn>
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
              <v-btn right height="44" width="116" color="primary">
                {{ $t("save") }}
              </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-card>
    </v-dialog>
    <PickupLocationsForm
      v-if="pickupLocationsAddDialog"
      :pickupLocationsAddDialog="pickupLocationsAddDialog"
      @closeWithoutChange="pickupLocationsAddDialog = false"
    ></PickupLocationsForm>
  </div>
</template>
<script>
import PickupLocationsForm from "./PickupLocationForm.vue"
import { constants } from "../../constants/settings"
export default {
  props: {
    pickupLocationsDialog: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    PickupLocationsForm,
  },
  data() {
    return {
      pickupLocationsAddDialog: false,
      pickupLocations: constants.pickupLocations,
    }
  },
  methods: {
    closeModal() {
      this.$emit("closeModal")
    },
  },
}
</script>
