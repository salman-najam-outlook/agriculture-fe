<template>
  <v-select
    ref="weightUnitSelect"
    v-bind="$attrs"
    :items="items"
    item-text="text"
    clearable
    @click:clear="clearValue"
    item-value="value"
    :label="$t('setting.weightUnit')"
    outlined
    dense
    class="weightUnitFilterSelect"
    v-model="selectedWeightUnit"
  ></v-select>
</template>
<script>
export default {
  name: "WeightUnitSelect",
  props: {
    weightUnitsOptions: {
      type: Array,
      default: null,
    },
    value: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      ignoreWatchers: false,
      selectedWeightUnit: this.value,
      defaultWeightUnitsOptions: [
        { text: "kg", value: "" },
        { text: "lbs", value: "lbs" },
        { text: "g", value: "g" },
      ],
    };
  },
  computed: {
    items() {
      return this.weightUnitsOptions || this.defaultWeightUnitsOptions;
    },
  },
  watch: {
    selectedWeightUnit(newVal) {
      if (this.ignoreWatchers) return;
      if (newVal === null) {
        newVal = ""; // If selectedWeightUnit is null, set it to an empty string
      }
      this.$emit("input", newVal);
      this.$emit("change", newVal);
    },
    value(newVal, oldVal) {
      if (newVal != oldVal) {
        this.selectedWeightUnit = newVal;
      }
    },
  },
  methods: {
    clearValue() {
      this.ignoreWatchers = true; // Set flag to ignore watchers
      this.selectedWeightUnit = "";
      this.$emit("input", this.selectedWeightUnit);
      this.$emit("change", this.selectedWeightUnit);
      this.$nextTick(() => {
        this.ignoreWatchers = false; // Reset flag after watchers are ignored
      });
      this.$refs.weightUnitSelect.blur();
    },
  },
};
</script>
