<template>
  <div>
    <apexchart
        ref="barChart"
        type="bar"
        :options="apexoptions"
        :series="series"
    />
    <div class="bar-graph-bottom-text">{{bottomText || ''}}</div>
  </div>
</template>
   
<script>
/* eslint-disable */
import VueApexCharts from 'vue-apexcharts'
import {ChartDownloadIcon} from "@/views/dashboard/components/ChartDownloadIcon.ts";


export default {
  components: {
    'apexcharts': VueApexCharts,
  },
  props: ['chartData', 'options', 'isHorizontal', 'showLable','bottomText'],
  data() {
    let extra = {
      distributed: this.showLable || false,
    };
    if(!this.showLable) {
      extra['colors'] = {
              ranges: [
                {
                  from: 0,
                  to: 30,
                  color: '#D17171',
                },
                {
                  from: 30,
                  to: 60,
                  color: '#EDA579',
                },
                {
                  from: 60,
                  color: '#3CC7DA',
                },
              ],
            }
    }
    return {
      data: {},
      apexoptions: {
        plotOptions: {
          bar: {
            horizontal: this.isHorizontal,
            distributed: this.showLable || false,
            columnWidth: '50%',
            ...extra
          }
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
        },
        chart: {
          toolbar: {
            show: true,
            tools: {
              download: ChartDownloadIcon,
            },
          },
        },
      },
      series: []
    }
  },
  watch: {
    chartData: {
      handler(nV) {
        this.$refs.barChart.updateOptions({
          series: [{
            name: 'Value',
            data: nV.datasets[0].data
          }],
          xaxis: {
            categories: nV.labels
          },
          yaxis: {
            title: {
              text: nV.datasets[0].label
            }
          }
        })

      },
      deep: true
    }
  }
}
</script>
 <style>
  .bar-graph-bottom-text {
    display: inline-block;
    position: relative;
    top: -45px;
  }
</style>