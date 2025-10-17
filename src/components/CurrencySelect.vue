<template>
  <v-autocomplete
    :items="currenciesFilterOptions"
    ref="currencySelect"
    clearable
    @click:clear="clearValue"
    :label="$t('Currency')"
    item-value="abbreviation"
    item-text="name"
    hide-details
    outlined
    dense
    v-model="selectedCurrency"
    class="currencyFilterSelect"
  ></v-autocomplete>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "CurrencySelect",
  props: {
    value: {
      type: [String, Number],
      default: "",
    },
  },
  data() {
    return {
      ignoreWatchers: false,
      selectedCurrency: this.value,
    };
  },
  computed: {
    ...mapGetters("filterParams", ["currenciesFilterOptions"]),
  },
  watch: {
    selectedCurrency(newVal) {
      if (this.ignoreWatchers) return;
      if (newVal === null) {
        newVal = ""; // If selectedCurrency is null, set it to an empty string
      }
      this.$emit("input", newVal);
      this.$emit("change", newVal);
    },
    value(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.selectedCurrency = newVal;
      }
    },
  },
  methods: {
    ...mapActions("filterParams", ["fetchCurrenciesFilterOptions"]),
    clearValue() {
      this.ignoreWatchers = true; // Set flag to ignore watchers
      this.selectedCurrency = "";
      this.$emit("input", this.selectedCurrency);
      this.$emit("change", this.selectedCurrency);
      this.$nextTick(() => {
        this.ignoreWatchers = false; // Reset flag after watchers are ignored
      });
      this.$refs.currencySelect.blur();
    },
  },
  created() {
    this.fetchCurrenciesFilterOptions();
  },
};
</script>
