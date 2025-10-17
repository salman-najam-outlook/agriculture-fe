<template>
    <v-card elevation="0">
        <v-card-title>{{ $t('esgPlatform.esgProgress')}}</v-card-title>


        <v-card-text>
            <div class="d-flex justify-end mt-4">
                <div class="d-flex align-center mr-4">
                    <div class="rounded-circle mr-2" style="width: 10px; height: 10px; background-color: #4CAF50;">
                    </div>
                    {{ $t('esgPlatform.environmental')}}
                </div>
                <div class="d-flex align-center mr-4">
                    <div class="rounded-circle mr-2" style="width: 10px; height: 10px; background-color: #2196F3;">
                    </div>
                    {{ $t('esgPlatform.social')}}
                </div>
                <div class="d-flex align-center">
                    <div class="rounded-circle mr-2" style="width: 10px; height: 10px; background-color: #FFC107;">
                    </div>
                    {{ $t('esgPlatform.governance')}}
                </div>
            </div>
            <apexchart type="line" :options="chartOptions" :series="series" width="100%" height="400"></apexchart>

        </v-card-text>
    </v-card>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import EsgService from '@/_services/EsgService';
export default {
    components: {
        apexchart: VueApexCharts,
    },
    props: {
        targetYears: {
            type: Array,
            required: true,
        },
    },
    watch: {
        targetYears: {
            immediate: true,
            handler() {
                this.getEsgProgressChart();
            },
        },
    },
    mounted() {
        this.getEsgProgressChart();
    },
    data() {
        return {
            protocolId: this.$route.params.id,
            series: [
                {
                    name: this.$t('esgPlatform.environmental'),
                    data: Array(12).fill(0),
                },
                {
                    name: this.$t('esgPlatform.social'),
                    data: Array(12).fill(0),
                },
                {
                    name: this.$t('esgPlatform.governance'),
                    data: Array(12).fill(0),
                },
            ],
            chartOptions: {
                chart: {
                    type: 'line',
                    height: 400,
                    toolbar: {
                        show: false,
                    },
                    zoom: {
                        enabled: false,
                    },
                },
                stroke: {
                    curve: 'smooth',
                    width: 3,
                },
                markers: {
                    size: 5,
                    colors: ['#4CAF50', '#2196F3', '#FFC107'],
                    strokeColors: '#fff',
                    strokeWidth: 2,
                    hover: {
                        size: 7,
                    },
                },
                xaxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    labels: {
                        style: {
                            colors: '#666',
                            fontSize: '12px',
                        },
                    },
                },
                yaxis: {
                    min: 0,
                    max: 100,
                    tickAmount: 5,
                    labels: {
                        formatter: (value) => {
                            return value + '%';
                        },
                        style: {
                            colors: '#666',
                            fontSize: '12px',
                        },
                    },
                },
                colors: ['#4CAF50', '#2196F3', '#FFC107'],
                grid: {
                    borderColor: '#f1f1f1',
                },
                legend: {
                    show: false,
                },
                tooltip: {
                    enabled: true,
                    y: {
                        formatter: function (val) {
                            return val + '%';
                        },
                    },
                },
                dataLabels: {
                    enabled: false,
                },
            },
        };
    },
    methods: {
        async getEsgProgressChart() {
            try {
                const queryParams = {
                    startTargetYear: this.targetYears[0],
                    endTargetYear: this.targetYears[1],
                };
                const response = await EsgService.getEsgProgressChart(this.protocolId, queryParams);
                if (response.data.success) {
                    const { progress } = response.data.data;
                    this.series = [
                        {
                            name: this.$t('esgPlatform.environmental'),
                            data: Object.values(progress.Environmental),
                        },
                        {
                            name: this.$t('esgPlatform.social'),
                            data: Object.values(progress.Social),
                        },
                        {
                            name: this.$t('esgPlatform.governance'),
                            data: Object.values(progress.Governance),
                        },
                    ];

                    this.chartOptions = {
                        ...this.chartOptions,
                        xaxis: {
                            ...this.chartOptions.xaxis,
                            categories: Object.keys(progress.Environmental),
                        }
                    };
                }
            } catch (error) {
                console.error('Error fetching ESG progress chart:', error);
            }
        }
    }
};
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>