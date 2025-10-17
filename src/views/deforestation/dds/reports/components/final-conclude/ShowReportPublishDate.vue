<template>
    <v-card outlined class="pa-2 my-4" style="background-color: #fff8e1">
        <div class="pa-2">
          <h3 class="mr-b-10"> Edit Time Remaining </h3>
          <p> 
            <b> Close On: </b> {{ report.blockchainPublishDate ? getDateFormat(report.blockchainPublishDate):"" }}
            <b class="mrl-40"> Remaining Time: </b> {{ report.blockchainPublishDate ? humanizeDate(report.blockchainPublishDate):"" }}
          </p>
        </div>
    </v-card>
  </template>
  
  <script>
  import moment from 'moment';
  export default {
    props: {
      report:{
        type:Object || null,
        required:true
      } 
    },
    data() {
      return {
        isExpanded: false,
      };
    },

    methods: {
      getDateFormat(date) {
        return moment.utc(date).local().format("DD-MMM-YYYY");
      },
      humanizeDate(date){
       return moment.utc(date).local().fromNow();
      }
    },
  };
  </script>
  <style scoped lang="scss">
  .mrl-40{
    margin-left: 40px;
  }
  .pa{
    padding: 10px;
  }
  .mr-b-10{
    margin-bottom: 10px;
  }
  .warning-title {
    font-size: 16px;
    font-weight: 700;
    text-decoration: underline ;
    color: #00BD73;
    text-transform: capitalize;
    cursor: pointer;
  }
  .warning-header{
    font-weight: 600;
  }
  .info-icon{
    margin-left: 10px;
    margin-bottom: 10px;
  }
  </style>