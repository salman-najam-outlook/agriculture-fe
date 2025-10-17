<template>
  <v-select
    ref="genderSelect"
    v-bind="$attrs"
    :items="items"
    item-text="text"
    clearable
    @click:clear="clearValue"
    item-value="value"
    :label="$t('reports.gen')"
    outlined
    dense
    class="genderFilterSelect"
    v-model="selectedGender"
  ></v-select>
</template>
<script>
export default {
  name: "GenderSelect",
  props: {
    gendersOptions: {
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
      selectedGender: this.value,
      defaultGendersOptions: [
        { text: this.$t("reports.male"), value: "male" },
        { text: this.$t("reports.female"), value: "female" },
        { text: this.$t("reports.other"), value: "other" },
      ],
    };
  },
  computed: {
    items() {
      return this.gendersOptions || this.defaultGendersOptions;
    },
  },
  watch: {
    selectedGender(newVal) {
      if (this.ignoreWatchers) return;
      if (newVal === null) {
        newVal = ""; // If selectedGender is null, set it to an empty string
      }
      this.$emit("input", newVal);
      this.$emit("change", newVal);
    },
    value(newVal, oldVal) {
      if (newVal != oldVal) {
        this.selectedGender = newVal;
      }
    },
  },
  methods: {
    clearValue() {
      this.ignoreWatchers = true; // Set flag to ignore watchers
      this.selectedGender = "";
      this.$emit("input", this.selectedGender);
      this.$emit("change", this.selectedGender);
      this.$nextTick(() => {
        this.ignoreWatchers = false; // Reset flag after watchers are ignored
      });
      this.$refs.genderSelect.blur();
    },
  },
};
</script>
