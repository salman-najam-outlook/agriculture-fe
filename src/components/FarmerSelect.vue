<template>
  <v-autocomplete
    :items="farmersFilterOptions"
    ref="select"
    clearable
    @click:clear="clearValue"
    item-text="fullName"
    item-value="id"
    :label="$t('selectFarmers')"
    outlined
    dense
    class="farmerFilterSelect"
    v-model="selectedFarmer"
  ></v-autocomplete>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "FarmerSelect",
  props: {
    value: {
      type: [String, Number],
      default: "",
    },
  },
  data() {
    return {
      ignoreWatchers: false,
      selectedFarmer: this.value,
    };
  },
  computed: {
    ...mapGetters({
      farmersFilterOptions: "filterParams/farmersFilterOptions",
    }),
  },
  watch: {
    selectedFarmer(newVal) {
      if (this.ignoreWatchers) return;
      if (newVal === null) {
        newVal = ""; // If selectFarmer is null, set it to an empty string
      }
      this.$emit("input", newVal);
      this.$emit("change", newVal);
    },
    value(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.selectedFarmer = newVal;
      }
    },
  },
  methods: {
    ...mapActions({
      fetchFarmersFilterOptions: "filterParams/fetchFarmersFilterOptions",
    }),
    clearValue() {
      this.ignoreWatchers = true; // Set flag to ignore watchers
      this.selectedFarmer = "";
      this.$emit("input", this.selectedFarmer);
      this.$emit("change", this.selectedFarmer);
      this.$nextTick(() => {
        this.ignoreWatchers = false; // Reset flag after watchers are ignored
      });
      this.$refs.select.blur();
    },
  },
  created() {
    this.fetchFarmersFilterOptions();
  },
};
</script>
