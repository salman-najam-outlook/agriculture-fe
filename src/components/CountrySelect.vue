<template>
  <v-autocomplete
    :items="displayedOptions"
    ref="countrySelect"
    clearable
    @click:clear="clearValue"
    :label="$t('profileSetting.selectCountry')"
    :item-value="optionValue"
    :item-text="optionText"
    hide-details
    outlined
    dense
    v-model="selectedCountry"
    class="countryFilterSelect"
  ></v-autocomplete>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "CountrySelect",
  props: {
    value: {
      type: [String, Number],
      default: "",
    },
    list: {
      type: Array,
      default: () => [],
    },
    optionValue: {
      type: String,
      default: "countryIsoCode",
    },
    optionText: {
      type: String,
      default: "country",
    },
  },
  data() {
    return {
      ignoreWatchers: false,
      selectedCountry: this.value,
    };
  },
  computed: {
    ...mapGetters("filterParams", ["countriesFilterOptions"]),
    displayedOptions() {
      return this.list.length > 0 ? this.list : this.countriesFilterOptions;
    },
  },
  watch: {
    selectedCountry(newVal) {
      if (this.ignoreWatchers) return;
      if (newVal === null) {
        newVal = ""; // If selectedCountry is null, set it to an empty string
      }
      this.$emit("input", newVal);
      this.$emit("change", newVal);
    },
    value(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.selectedCountry = newVal;
      }
    },
  },
  methods: {
    ...mapActions("filterParams", ["fetchCountriesFilterOptions"]),
    clearValue() {
      this.ignoreWatchers = true; // Set flag to ignore watchers
      this.selectedCountry = "";
      this.$emit("input", this.selectedCountry);
      this.$emit("change", this.selectedCountry);
      this.$nextTick(() => {
        this.ignoreWatchers = false; // Reset flag after watchers are ignored
      });
      this.$refs.countrySelect.blur();
    },
  },
  mounted() {
    if (this.list.length === 0) {
      this.fetchCountriesFilterOptions();
    }
  },
};
</script>
