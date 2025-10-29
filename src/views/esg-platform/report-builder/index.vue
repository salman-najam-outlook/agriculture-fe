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
            esgReports: [],
            breadcrumbs: [
                {
                    text: this.$t("ESG Platform"),
                    disabled: false,
                    to: { name: "esg-dashboard" },
                    exact: true,
                },
                {
                    text: this.$t("ESG Report Builder"),
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
