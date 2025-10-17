<template>
    <div>
      <breadcrumb :items="breadcrumbs"></breadcrumb>
      <v-container fluid class="pt-0">
        <h2 class="mb-4">{{ $t('dashboard') }}</h2>

        <DDSDashboard @card-clicked="handleCardClick" />

        <AdminDueDiligenceReportsComponent ref="reportsComponent" />

        </v-container>
    </div>
</template>

<script>
import AdminDueDiligenceReportsComponent from './components/AdminDueDiligenceReportsComponent.vue';
import DDSDashboard from './components/dashboard/DDSDashboardCards.vue';
export default {
    components: {
        DDSDashboard,
        AdminDueDiligenceReportsComponent
    },
    data() {
        return {
            breadcrumbs: [{ text: 'dashboard' }]
        }
    },
    methods: {
        handleCardClick(cardData) {
            // Pass the card click data to the reports component for filtering
            if (this.$refs.reportsComponent) {
                this.$refs.reportsComponent.handleDashboardCardClick(cardData);
            }
        }
    }
}
</script>
