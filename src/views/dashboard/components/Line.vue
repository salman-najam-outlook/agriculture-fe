<template>
  <apexchart
    ref="barChart"
    type="bar"
    :options="apexoptions"
    :series="series"
  ></apexchart>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import { ChartDownloadIcon } from "@/views/dashboard/components/ChartDownloadIcon.ts";

export default {
  components: {
    apexchart: VueApexCharts,
  },
  props: ["chartData", "options"],
  data() {
    return {
      apexoptions: {
        chart: {
          height: 350,
          type: "bar",
          zoom: {
            enabled: false,
          },
          toolbar: {
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
          },
        },
        plotOptions: {
          bar: {
            horizontal: false, // Vertical bars
            columnWidth: "50%",
            endingShape: "rounded",
          },
        },
        dataLabels: {
          enabled: false,
        },
        colors: [
          "#FB896B",
          "#00E396",
          "#FEB019",
          "#FF4560",
          "#775DD0",
          "#546E7A",
          "#26a69a",
        ],
        xaxis: {
          categories: [], // Will be populated dynamically
        },
        yaxis: {
          title: {
            text: "", // Will be set dynamically
          },
          labels: {
            formatter: function (value) {
              return value.toFixed(0);
            },
          },
        },
        annotations:
          this.options && this.options.annotations
            ? this.options.annotations
            : {},
      },
      series: [],
    };
  },
  watch: {
    chartData: {
      handler(newVal) {
        this.updateChart(newVal);
      },
      deep: true,
    },
  },
  mounted() {
    this.updateChart(this.chartData);
  },
  methods: {
    updateChart(data) {
      this.$refs.barChart.updateOptions({
        series: [
          {
            name: "Count",
            data: data.datasets[0].data,
          },
        ],
        xaxis: {
          categories: data.labels,
        },
        yaxis: {
          title: {
            text: data.datasets[0].label,
          },
        },
        colors: [
          "#FB896B",
          "#1ABC9C",
          "#3498DB",
          "#A7FFEB",
          "#FFEB3B",
          "#FF6E40",
          "#E0D268",
          "#FF9800",
          "#F7D7D7",
          "#B39DDB",
          "#81D4FA",
        ],
      });
    },
  },
};
</script>
