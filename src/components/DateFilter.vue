<template>
  <v-row justify="end">
    <v-col cols="auto">
      <!-- Month Filter Menu -->
      <v-menu
        v-model="menu1"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="auto"
        v-if="filterType === 'month'"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="filterDateMonth"
            readonly
            v-bind="attrs"
            v-on="on"
            outlined
            dense
            style="width: 220px"
            background-color="primary"
            color="white"
            :placeholder="$t('selectMonth')"
          ></v-text-field>
        </template>
        <v-date-picker
          :key="pickerKey.month"
          v-model="filterDateMonth"
          type="month"
          no-title
        >
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="monthFilter">
            {{ $t("confirm") }}
          </v-btn>
        </v-date-picker>
      </v-menu>

      <!-- Custom Range Filter Menu -->
      <v-menu
        v-model="menu2"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="auto"
        v-if="filterType === 'custom'"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="filterDateCustom"
            readonly
            v-bind="attrs"
            v-on="on"
            outlined
            dense
            style="width: 220px"
            background-color="primary"
            color="white"
            placeholder="Select Date Range"
          ></v-text-field>
        </template>
        <v-date-picker
          :key="pickerKey.custom"
          v-model="filterDateCustom"
          range
          no-title
        >
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="customFilter">
            {{ $t("confirm") }}
          </v-btn>
        </v-date-picker>
      </v-menu>

      <!-- Week Filter Menu -->
      <v-menu
        v-model="menu3"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="auto"
        v-if="filterType === 'week'"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="filterDateWeek"
            readonly
            v-bind="attrs"
            v-on="on"
            outlined
            dense
            style="width: 220px"
            background-color="primary"
            color="white"
            class="white--text"
            :placeholder="$t('selectWeek')"
          ></v-text-field>
        </template>
        <v-date-picker
          :key="pickerKey.week"
          v-model="filterDateWeek"
          @input="weekChange"
          no-title
          range
        >
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="weekFilter">
            {{ $t("confirm") }}
          </v-btn>
        </v-date-picker>
      </v-menu>

      <!-- Year Filter -->
      <v-select
        v-if="filterType === 'year'"
        :items="yearsOptions"
        item-text="name"
        item-value="value"
        outlined
        dense
        class="text-no-wrap"
        style="width: 140px"
        background-color="primary"
        v-model="filterDateYear"
        @change="getYearData"
        :placeholder="$t('reports.selectYear')"
      />
    </v-col>
    <v-col cols="auto">
      <!-- Filter Type Selector -->
      <v-select
        :items="filterOptions"
        item-text="name"
        item-value="value"
        outlined
        dense
        class="text-no-wrap"
        style="width: 140px"
        background-color="primary"
        v-if="switchableFilter"
        v-model="filterType"
        @change="handleFilterTypeChange"
      />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "DateFilter",
  props: {
    filterByYear: {
      type: Boolean,
      default: true,
    },
    filterByMonth: {
      type: Boolean,
      default: false,
    },
    filterByWeek: {
      type: Boolean,
      default: false,
    },
    filterRange: {
      type: Boolean,
      default: false,
    },
    yearsOptions: {
      type: Array,
      default: () =>
        Array.from({ length: 20 }, (v, k) => ({
          name: new Date().getFullYear() - k,
          value: `${new Date().getFullYear() - k}`,
        })),
    },
    switchableFilter: {
      type: Boolean,
      default: false,
    },
    // Props for initial filter values
    initialFilterDateYear: {
      type: String,
      default: "", //2024
    },
    initialFilterDateMonth: {
      type: String,
      default: "", //2024-01
    },
    initialFilterDateWeek: {
      type: Array,
      default: () => null, //["2024-01-01", "2024-01-07"]
    },
    initialFilterDateCustom: {
      type: Array,
      default: () => null, //["2024-01-01", "2024-01-31"]
    },
  },
  data() {
    return {
      menu1: false,
      menu2: false,
      menu3: false,
      filterDateMonth: this.initialFilterDateMonth || "", // Current month
      filterDateCustom: this.initialFilterDateCustom || null, // Default to empty array for range
      filterDateWeek: this.initialFilterDateWeek || null, // Default to empty array for range
      filterDateYear: "", // Current year
      filterType: "", // Default filter type, will be set in mounted()
      pickerKey: {
        month: "month",
        custom: "custom",
        week: "week",
      },
    };
  },
  computed: {
    filterOptions() {
      const options = [];

      if (this.filterByWeek) {
        options.push({ name: this.$t("byWeek"), value: "week" });
      }
      if (this.filterByMonth) {
        options.push({ name: this.$t("byMonth"), value: "month" });
      }
      if (this.filterByYear) {
        options.push({ name: this.$t("byYear"), value: "year" });
      }
      if (this.filterRange) {
        options.push({ name: this.$t("custom"), value: "custom" });
      }

      return options;
    },
  },
  methods: {
    monthFilter() {
      const date = new Date(`${this.filterDateMonth}-01`);
      const firstDay = `${this.filterDateMonth}-01`;
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
        .toISOString()
        .substr(0, 10);
      this.$emit("filter", {
        type: "month",
        startDate: firstDay,
        endDate: lastDay,
      });
      this.menu1 = false;
    },
    customFilter() {
      this.$emit("filter", {
        type: "custom",
        startDate: this.filterDateCustom[0],
        endDate: this.filterDateCustom[1],
      });
      this.menu2 = false;
    },
    weekFilter() {
      if (this.filterDateWeek && this.filterDateWeek.length === 2) {
        const [start, end] = this.filterDateWeek;
        if (this.isValidDate(start) && this.isValidDate(end)) {
          this.$emit("filter", {
            type: "week",
            startDate: start,
            endDate: end,
          });
        } else {
          console.error("Invalid week range");
        }
      }
      this.menu3 = false;
    },
    getYearData() {
      if (this.filterDateYear) {
        this.$emit("filter", {
          type: "year",
          startDate: `${this.filterDateYear}-01-01`,
          endDate: `${this.filterDateYear}-12-31`,
        });
      } else {
        console.error("Invalid year");
      }
    },
    weekChange() {
      // Optional: Implement week change logic if needed
    },
    handleFilterTypeChange() {
      // Update the picker keys to force re-rendering
      this.pickerKey = {
        month: `month_${Date.now()}`,
        custom: `custom_${Date.now()}`,
        week: `week_${Date.now()}`,
      };

      switch (this.filterType) {
        case "week":
          this.filterDateMonth = "";
          this.filterDateCustom = null;
          this.filterDateYear = "";
          this.resetWeekFilter();
          break;
        case "month":
          this.filterDateCustom = null;
          this.filterDateWeek = null;
          this.filterDateYear = "";
          break;
        case "custom":
          this.filterDateMonth = "";
          this.filterDateWeek = null;
          this.filterDateYear = "";
          break;
        case "year":
          this.filterDateWeek = null;
          this.filterDateMonth = "";
          this.filterDateCustom = null;
          break;
      }
    },
    resetWeekFilter() {
      if (this.initialFilterDateWeek) {
        this.filterDateWeek = [
          this.initialFilterDateWeek[0],
          this.initialFilterDateWeek[1],
        ];
      } else {
        this.filterDateWeek = null;
      }
    },
    isValidDate(dateString) {
      const date = new Date(dateString);
      return !isNaN(date.getTime());
    },
  },
  watch: {
    filterDateWeek(newVal) {
      if (newVal && newVal.length === 1) {
        const selectedDate = new Date(newVal[0]);
        const startDate = new Date(selectedDate);
        const endDate = new Date(selectedDate);
        endDate.setDate(startDate.getDate() + 6);
        this.filterDateWeek = [
          startDate.toISOString().substr(0, 10),
          endDate.toISOString().substr(0, 10),
        ];
      }
    },
  },
  mounted() {
    this.filterType =
      this.$props.initialFilterDateType ||
      (this.filterByYear
        ? "year"
        : this.filterByMonth
        ? "month"
        : this.filterByWeek
        ? "week"
        : "custom");
  },
};
</script>

<style scoped>
/* Add any necessary styles here */
</style>
