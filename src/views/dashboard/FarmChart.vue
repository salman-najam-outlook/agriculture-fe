<script>
    import { Bar } from 'vue-chartjs'
    import DashService from "@/_services/DashService"
  export default {
    extends: Bar,
    data() {
      return {
        result:[],
        // newData:[],
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
                max:''
              },
              gridLines: {
                display: true
              },
              scaleLabel: {
                display: true,
                labelString: 'Total Reg. Animals'
              },
            }],
            xAxes: [{
              gridLines: {
                display: false
              },
               scaleLabel: {
                display: true,
                labelString: 'Total Farms'
              },
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
          console.log(res.data)
          this.options.scales.yAxes[0].ticks.max=res.data.animal.totalAnimalCount
          this.chartData.labels =res.data.farm.farmAnimal.map(item=>{
            return item.farmNumber
          })
        //  console.log(this.chartData.labels)
          this.chartData.datasets[0].data=res.data.farm.farmAnimal.map(item=>{
           return item.animalsCount
         })
        //  console.log(this.chartData.datasets[0].data)
        //   // this.chartData.datasets[0].data=this.result
        })
         .catch(err => {
                console.log(err)
        })
      },
    }
  }
</script>