<template>
    <apexchart ref="barChart" type="bar" :options="apexoptions" :series="series"></apexchart>
  </template>
     
  <script>
  /* eslint-disable */
  import VueApexCharts from 'vue-apexcharts'
  import {ChartDownloadIcon} from "@/views/dashboard/components/ChartDownloadIcon.ts";

  const chartToolbarOptions = {
    show: true,
    tools: {
      zoom: false,
      selection: false,
      zoomin: false,
      zoomout: false,
      reset: false,
      pan: false,
      download: ChartDownloadIcon,
    },
  }
  
  export default {
    // mixins: [mixins.reactiveProp],
    components: {
      'apexcharts': VueApexCharts,
    },
    props: ['chartData', 'isHorizontal', 'showLable'],
    data() {
      return {
        data: {},
        apexoptions: {
          plotOptions: {
            bar: {
              horizontal: false,
              grouped: true,
              columnWidth: '50%'
            }
          },
          colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#546E7A', '#26a69a'],
          xaxis: {
            categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
          },
          chart: {
            toolbar: chartToolbarOptions
          },
        },
        series: []
      }
    },
    watch: {
      chartData: {
        handler(nV) {
          this.$refs.barChart.updateOptions({
            series: nV.datasets,
            xaxis: {
              categories: nV.labels
            },
            yaxis: {
              title: {
                text: nV.label
              }
            },
            chart: {
              toolbar: chartToolbarOptions
            }
          })
  
        },
        deep: true
      }
    }
  }
  </script>
   