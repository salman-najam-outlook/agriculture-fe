<template>
   <apexchart ref="barChart" type="bar" :options="apexOptions" :series="series"></apexchart>
</template>
  
<script>
/* eslint-disable */
import moment from 'moment'
import VueApexCharts from 'vue-apexcharts'


export default {
  // mixins: [mixins.reactiveProp],
  components: {
    'apexcharts': VueApexCharts,
  },
  props: ['chartData', 'chartOptions'],
  data () {
    return {
      data: {},
      series: []
    }
  },
  computed: {
    downloadFileName() {
      if(this.chartOptions?.chart?.id) {
        return this.chartOptions.chart.id + '_' + moment().format('MM/DD/YYYY');
      }
      return undefined;
    },
    apexOptions() {
      if(!this.chartOptions) return {};
      return {
        ...this.chartOptions,
        chart: {
          ...(this.chartOptions.chart ?? {}),
          toolbar: {
            export: {
              csv: {
                filename: this.downloadFileName,
              },
              svg: {
                filename: this.downloadFileName,
              },
              png: {
                filename: this.downloadFileName,
              }
            }
          },

        },
        responsive: Array.isArray(this.chartOptions.responsive) ? this.chartOptions.responsive : [],
      }
    }
  },
  watch: {
    chartData: {
      handler(nV) {
        console.log(nV);
        this.$refs.barChart.updateOptions({
            series:  [{
              name: nV.datasets[0].label,
              data: nV.datasets[0].data
            }],
            xaxis: {
              categories: nV.labels
            },
            yaxis: {
              title: {
                text: nV.datasets[0].label
              }
            },
            colors : ['#7C4DFF', '#1ABC9C','#3498DB','#A7FFEB','#FFEB3B','#FF6E40','#E0D268','#FF9800','#F7D7D7','#B39DDB','#81D4FA']
          })
      },
      deep: true
    }
  },
  mounted () {
    let that = this
    this.$refs.barChart.updateOptions({
      series:  [{
        name: this.chartData.datasets[0].label,
        data: this.chartData.datasets[0].data
      }],
      xaxis: {
        categories: this.chartData.labels
      },
      yaxis: {
        title: {
          text: that.chartData.datasets[0].label
        }
      },
      colors : ['#7C4DFF', '#1ABC9C','#3498DB','#A7FFEB','#FFEB3B','#FF6E40','#E0D268','#FF9800','#F7D7D7','#B39DDB','#81D4FA']
    })
  }
}
</script>
