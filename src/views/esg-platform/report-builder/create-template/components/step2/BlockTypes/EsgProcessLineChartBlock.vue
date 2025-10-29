<template>
    <div class="esg-progress-block">
        <div v-if="!preview">
        <div class="d-flex justify-space-between align-center mb-2">
            <span class="block-title">ESG Progress Line Graph</span>
            <div class="d-flex align-center">
                <v-btn icon color="primary" class="mr-2" @click="showSettings = true">
                    <v-icon>mdi-cog</v-icon>
                </v-btn>
                <v-btn icon color="error" @click="$emit('delete')">
                    <v-icon>mdi-trash-can</v-icon>
                </v-btn>
            </div>
        </div>
        <div class="block-content">
            <div class="mb-2 block-label">Select ESG Components to show on graph:</div>
            <v-checkbox v-for="item in components" :key="item.value" v-model="block.selected" :label="item.label"
                :value="item.value" color="primary" hide-details class="mb-0" />
        </div>
        </div>

        <div v-else>
            <span class="block-title">ESG Progress Line Graph</span>
            <div class="d-flex justify-end mt-4 mb-2">
                <div v-if="block.selected.includes('environmental')" class="d-flex align-center mr-4">
                    <div class="rounded-circle mr-2" style="width: 10px; height: 10px; background-color: #4CAF50;">
                    </div>
                    Environmental
                </div>
                <div v-if="block.selected.includes('social')" class="d-flex align-center mr-4">
                    <div class="rounded-circle mr-2" style="width: 10px; height: 10px; background-color: #2196F3;">
                    </div>
                    Social
                </div>
                <div v-if="block.selected.includes('governance')" class="d-flex align-center">
                    <div class="rounded-circle mr-2" style="width: 10px; height: 10px; background-color: #FFC107;">
                    </div>
                    Governance
                </div>
            </div>
            <apexchart type="line" :options="chartOptions" :series="filteredSeries" width="100%" height="300">
            </apexchart>
        </div>
        <ComponentSettingsDialog v-model="showSettings" :settings.sync="block.settings" />
    </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import ComponentSettingsDialog from '../ComponentSettingDialog.vue';

export default {
    name: 'EsgProcessLineChartBlock',
    components: {
        ComponentSettingsDialog,
        apexchart: VueApexCharts,
    },
    props: {
        block: {
            type: Object,
            required: true
        },
        preview: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            components: [
                { label: 'Environmental', value: 'environmental' },
                { label: 'Social', value: 'social' },
                { label: 'Governance', value: 'governance' }
            ],
            showSettings: false,
            dummyData: {
                environmental: [20, 40, 60, 80, 60, 70, 90, 80, 70, 60, 50, 40],
                social: [10, 30, 50, 70, 60, 50, 40, 30, 20, 10, 20, 30],
                governance: [30, 50, 70, 60, 50, 40, 30, 20, 30, 40, 50, 60]
            },
            chartOptions: {
                chart: {
                    type: 'line',
                    height: 400,
                    toolbar: { show: false },
                    zoom: { enabled: false }
                },
                stroke: { curve: 'smooth', width: 3 },
                markers: {
                    size: 5,
                    colors: ['#4CAF50', '#2196F3', '#FFC107'],
                    strokeColors: '#fff',
                    strokeWidth: 2,
                    hover: { size: 7 }
                },
                xaxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    labels: { style: { colors: '#666', fontSize: '12px' } }
                },
                yaxis: {
                    min: 0,
                    max: 100,
                    tickAmount: 5,
                    labels: {
                        formatter: value => value + '%',
                        style: { colors: '#666', fontSize: '12px' }
                    }
                },
                colors: ['#4CAF50', '#2196F3', '#FFC107'],
                grid: { borderColor: '#f1f1f1' },
                legend: { show: false },
                tooltip: {
                    enabled: true,
                    y: { formatter: val => val + '%' }
                },
                dataLabels: { enabled: false }
            }
        }
    },
    computed: {
        filteredSeries() {
            // Only include selected ESG components
            const map = {
                environmental: {
                    name: 'Environmental',
                    data: this.dummyData.environmental
                },
                social: {
                    name: 'Social',
                    data: this.dummyData.social
                },
                governance: {
                    name: 'Governance',
                    data: this.dummyData.governance
                }
            };
            return (this.block.selected || []).map(key => map[key]);
        }
    },
    created() {
        if (!this.block.selected) {
            this.$set(this.block, 'selected', ['environmental', 'social', 'governance']);
        }
    }
}
</script>

<style scoped>
.esg-progress-block {
    background: #fafbfc;
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 16px;
    position: relative;
}

.block-title {
    font-size: 20px;
    font-weight: 700;
    color: #222;
}

.block-label {
    font-size: 15px;
    font-weight: 500;
    color: #222;
    margin-bottom: 8px;
}
</style>