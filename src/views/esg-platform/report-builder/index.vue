<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div class="d-flex mb-4">
                <h2>{{ $t("ESG Report Builder") }}</h2>
                <v-spacer></v-spacer>
                <v-btn color="primary" class="mr-2 mb-2" @click="$router.push({ name: 'manageTemplate' })">
                    {{ $t("Manage Templates") }}
                </v-btn>
                <v-btn color="primary" dark class="mb-2" @click="$router.push({ name: 'createNewEsgReport' })">
                    {{ $t('Create New ESG Report') }}
                </v-btn>
            </div>

            <v-card elevation="0" class="px-5">
                <v-card-text>
                    <report-list class="mt-4" :toggleSelection="false" :toggleFilterState="false" />
                </v-card-text>
            </v-card>
        </v-container>
    </div>
</template>

<script>
import ReportList from './components/report-list.vue';

export default {
    components: {
        ReportList,
    },
    data() {
        return {
            esgReports: [
                {
                    reportId: 'ESG-001',
                    templateName: 'Deforestation Template',
                    access: 'Public',
                    dateGenerated: '2024-06-10',
                    status: 'Saved',
                },
                {
                    reportId: 'ESG-002',
                    templateName: 'Water Usage Template',
                    access: 'Private',
                    dateGenerated: '2024-06-12',
                    status: 'Publishing to Blockchain',
                },
                {
                    reportId: 'ESG-003',
                    templateName: 'Emission Template',
                    access: 'Public',
                    dateGenerated: '2024-06-15',
                    status: 'Published to Blockchain',
                },
                {
                    reportId: 'ESG-004',
                    templateName: 'Emission Template',
                    access: 'Public',
                    dateGenerated: '2024-06-15',
                    status: 'Published to Blockchain',
                },
                {
                    reportId: 'ESG-005',
                    templateName: 'Emission Template',
                    access: 'Public',
                    dateGenerated: '2024-06-15',
                    status: 'Published to Blockchain',
                },
            ],
            
            breadcrumbs: [
                {
                    text: this.$t("ESG Compliance"),
                    disabled: false,
                    to: { name: "Users" },
                    exact: true,
                },
                {
                    text: this.$t("dashboard"),
                    disabled: true,
                    href: "breadcrumbs_link_1",
                },
            ],
        };
    },
};
</script>

<style lang="scss" scoped>
::v-deep .v-data-table-header span {
    text-transform: uppercase !important;
    color: black;
}
</style>
