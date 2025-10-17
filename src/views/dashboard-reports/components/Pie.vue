<template>
  <apexcharts type="pie" width="380" :options="chartOptions" :series="series"></apexcharts>
</template>
  
  <script>

import VueApexCharts from 'vue-apexcharts'
export default {
 // mixins: [mixins.reactiveProp],
 components: {
   'apexcharts': VueApexCharts,
 },
 props: {
    chartOptions: {
      type: Object,
    },
    series: {
      type: Array,
    },
  },
  data() {
    return {
      // chartOptions: {
      //   responsive: true,
      //   maintainAspectRatio: false,
      // },
    };
  },
};
</script>
  