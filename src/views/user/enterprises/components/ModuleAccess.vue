<template>
    <v-card outlined>
      <v-card-title class="subtitle-1 font-weight-bold pa-4">
        {{ $t('Enterprises.ModuleAccess.Access_to_Modules_on_Admin_Panel') }}
        <!-- Access to Modules on Admin Panel -->
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col
            v-for="module in modules"
            :key="module.id"
            cols="12"
            sm="6"
            md="4"
          >
            <v-checkbox
              v-model="selectedModules"
              :label="module.name"
              :value="module.id"
              @change="updateModules"
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </template>
  
  <script>
  export default {
    name: 'ModuleAccess',
    data: () => ({
      selectedModules: [],
      modules: [
        { id: 'dashboard', name: this.$t('ModuleAccess.Dashboard') },
        { id: 'coffee-overview', name: this.$t('ModuleAccess.Coffee_Overview') },
        { id: 'farm-management', name: this.$t('ModuleAccess.Farm_Management') },
        { id: 'survey-builder', name: this.$t('ModuleAccess.Survey_Builder') },
        { id: 'deforestation', name: this.$t('ModuleAccess.Deforestation') },
        { id: 'user-management', name: this.$t('ModuleAccess.User_Management') },
        { id: 'faq', name: this.$t('ModuleAccess.FAQ') },
        { id: 'tickets', name: this.$t('ModuleAccess.Tickets') },
        { id: 'activity-log', name: this.$t('ModuleAccess.Activity_Log') },
        { id: 'settings', name: this.$t('ModuleAccess.Settings') },
        { id: 'member-data', name: this.$t('ModuleAccess.Member_Data') },
        { id: 'admin-roles', name: this.$t('ModuleAccess.Admin_Roles') }
      ]
    }),
    methods: {
      updateModules() {
        this.$emit('input', this.selectedModules)
      }
    }
  }
  </script>
  
  <style scoped>
  .v-input--checkbox {
    margin-top: 0;
    padding-top: 0;
  }
  </style>
  