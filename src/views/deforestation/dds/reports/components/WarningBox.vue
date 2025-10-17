<template>
  <v-card outlined class="pa-2 my-4" style="background-color: #fff8e1" v-if="warnings.length">
    <v-row align="center">
      <v-col cols="auto" class="mx-3">
        <strong>{{$t("deforestation.complianceRiskWarnings")}} ({{ warnings.length }})</strong>
       
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            color="green"
            v-bind="attrs"
            v-on="on"
          >
            mdi-alert-circle
          </v-icon>
        </template>
        <span>{{
          $t("deforestation.complianceRiskWarningsInfo")
        }}</span>
      </v-tooltip>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="auto">
        <v-btn icon @click="toggleExpand">
          <v-icon>{{ isExpanded ? "mdi-menu-up" : "mdi-menu-down" }}</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-expand-transition>
      <div v-show="isExpanded">
        <ul class="ma-3">
          <li v-for="(warning, index) in warnings" :key="index">
            <p>{{ getWarningMessage(warning) }}</p>
          </li>
        </ul>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>
export default {
  props: {
    warnings: {
      type: Array,
      required: true,
    },
    diligenceId: {
      required: false,
      type: Number,
    }
  },

  data() {
    return {
      isExpanded: false,
    };
  },

  watch: {
    warnings: {
      immediate: true,
      handler(newWarnings) {
        const key = `warnings_${this.diligenceId}`;
        // Store in localStorage
        localStorage.setItem(key, JSON.stringify(newWarnings));
      },
    },
  },

  methods: {
    toggleExpand() {
      this.isExpanded = !this.isExpanded;
    },

    getWarningMessage(warning) {
      if(typeof warning === 'object') return warning.message;
      return warning;
    },
  },
};
</script>