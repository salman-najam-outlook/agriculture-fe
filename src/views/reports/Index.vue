<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <v-card class="mb-5" flat>
                <v-card-text class="py-1">
                    <v-tabs v-model="tab">
                        <v-tab>{{ $t('farmer') }}</v-tab>
                        <v-tab>{{ $t("reports.buyingStation") }}</v-tab>
                        <v-tab>{{ $t("reports.dryMilling") }}</v-tab>
                    </v-tabs>
                </v-card-text>
            </v-card>



            <v-tabs-items v-model="tab">
                <v-tab-item>
                    <FarmerReport />
                </v-tab-item>
                <v-tab-item>
                    <BuyingStation />
                </v-tab-item>
                <v-tab-item>
                    <DryMilk />
                </v-tab-item>
            </v-tabs-items>



        </v-container>
    </div>
</template>
<script>

import loadingMixin from "@/mixins/LoadingMixin"

import FarmerReport from "./FarmerReport.vue"
import DryMilk from "./DryMilk.vue"
import BuyingStation from "./BuyingStation.vue"

export default {
    created() {

    },
    components: {
        FarmerReport,
        BuyingStation,
        DryMilk
    },
    watch: {
        tab: {
            handler(v) {
                if (v === 0) this.title = 'Farmer Report'
                if (v === 1) this.title = 'Buying Station Report'
                if (v === 2) this.title = 'Dry Milling Report'
            },
            deep: true
        }
    },
    data() {
        return {
            title: 'Farmer Report',
            tab: 0,
            loading: false,
            breadcrumbs: [
                {
                    text: this.$t('dashboard'),
                    disabled: false,
                    to: { name: 'Users' },
                    exact: true
                },
                {
                    text: this.$t('reports.reports'),
                    disabled: true,
                    href: 'breadcrumbs_link_1',
                },
            ],
        }
    },
    methods: {

    },
    mixins: [loadingMixin]
}
</script>
<style>
</style>

