<script>
    import { Bar } from 'vue-chartjs'
    import DashService from "@/_services/DashService"
    import loadingMixin from "@/mixins/LoadingMixin"
  export default {
    extends: Bar,
    data() {
      return {
        result:[],
        totaluser:'',
        chartData: {
          labels: [],
          datasets: [{
            label: 'Chart Representation',
            borderWidth: 1,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
            ],
            borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
            ],
            pointBorderColor: '#2554FF',
            data: []
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                max: this.totaluser
              },
              gridLines: {
                display: true
              },
              scaleLabel: {
                display: true,
                labelString: 'Total Users'
              },
            }],
            xAxes: [{
              gridLines: {
                display: false
              }
            }]
          },
          legend: {
            display: true
          },
          responsive: true,
          maintainAspectRatio: false
        }
      }
    },
    async mounted() {
      await this.getdata()
      await this.renderChart(this.chartData, this.options)
    },
    methods:{
      async getdata(){
        await DashService.getData().then(res=>{
          this.options.scales.yAxes[0].ticks.max=res.data.user.totalUserCount
         this.chartData.labels =Object.keys(res.data.user.userStatus)
          this.chartData.datasets[0].data=Object.values(res.data.user.userStatus)
          // this.chartData.datasets[0].data=this.result
        })
         .catch(err => {
                console.log(err)
        })
      },
    },
    mixins: [loadingMixin],
  }
</script>