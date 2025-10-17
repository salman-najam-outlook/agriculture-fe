<template>
  <v-dialog v-model="dialog" width="356" @click:outside="closeModal" content-class="my-custom-dialog"
    transition="dialog-bottom-transition">
    <v-card min-height="100vh" class="" rounded="0">
      <v-toolbar color="primary" class="white--text" flat :elevation="0">
        <v-toolbar-title class="font-weight-bold">
          {{ $t('filterByRegion') }}
        </v-toolbar-title>
        <v-spacer></v-spacer>

        <v-btn icon class="white--text" @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="pt-5">
        <v-row no-gutters>
          <v-col cols="12">
            <strong>{{ $t('country') }}</strong>
          </v-col>
          <v-select
          :items="countries"
          item-text="name"
          item-value="name"
          outlined
          v-model="country"
          return-object
          @change="getState"
          >

          </v-select>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12">
            <strong>{{$t('state')}}</strong>
          </v-col>
          <v-select
          :items="states"
          outlined
          v-model="state"
          ></v-select>
        </v-row>
        <v-row>
          <v-col cols="12" class="d-flex justify-space-around">
            <v-btn outlined @click="clearAll" width="130" color="primary">
              {{ this.$t("clearAll") }}
            </v-btn>
            <v-btn @click="emitDone" width="130" color="primary">
              {{ this.$t("search") }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
    
<script>
import { getCountries, getStates } from 'country-state-picker'
export default {
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
  },
  data(){
    return {
      countries: [],
      states: [],
      country: null,
      state: null
    }
  },
  methods: {
    closeModal() {
      this.$emit("closeDialog");
    },
    getCountry() {
      this.countries = getCountries()
    },
    getState(val) {
      this.states = getStates(val.code)
      this.country = val
    },
    emitDone() {
      this.$emit("regionFilterDone", this.country, this.state)
    },
    clearAll() {
      this.$emit("regionFilterDone", null, null)
    }
  },

  mounted() {
    this.getCountry()
  }
};
</script>
    
<style scoped>
::v-deep .my-custom-dialog {
  position: absolute;
  top: 0;
  min-height: 100%;
  right: 0;
  margin-right: 0px;
  margin-top: 0px;
}
</style>