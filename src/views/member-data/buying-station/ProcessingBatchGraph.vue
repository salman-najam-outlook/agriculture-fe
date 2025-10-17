<template>
    <div id="chart">
      <apexchart
        type="line"
        height="600"
        :options="chartOptions"
        :series="series"
      ></apexchart>
    </div>
  </template>
  <script>
  export default {
    props: {
      data: {
        type: Array,
      },
      headerTop: {
        type: Array,
      },
      headerBottom: {
        type: Array,
      },
    },
    data() {
      return {
        chartOptions: {
          chart: {
            height: 750,
            type: "line",
            zoom: {
              enabled: false,
            },
            toolbar: {
              show: false,
            },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            curve: "smooth",
          },
          grid: {
            row: {
              colors: ["#f3f3f3", "transparent"],
              opacity: 0.5,
            },
          },
          xaxis: {
            categories: null,
          },
          yaxis: {
            title: {
              text: "KG",
            },
          },
        },
      };
    },
    watch: {
      headerBottom: {
        handler() {
          this.getCategories();
        }
      }
    },
    computed: {
      series() {
        const formattedData = this.data.map((d) => {
          return {
            name: d.farmer.fullName,
            data: d.selectedData,
          };
        });
        return formattedData;
      },
    },
    created() {
      this.getCategories();
    },
    mounted() {
      this.getCategories();
    },
    methods: {
      getCategories() {
        const newHeader = this.headerBottom?.map((m) => {
          return m.text;
        });
        this.chartOptions.xaxis.categories = newHeader.slice(
          1,
          this.headerBottom.length
        );
      },
    },
  };
  </script>
  