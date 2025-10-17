<template>
    <v-data-table :headers="headers" :items="coffees" hide-default-footer v-model="selected" show-select :search="search"
        :server-items-length="totalCoffee" :footer-props="{
            'items-per-page-options': [10, 25, 50],
        }" :options.sync="tableOptions" :loading="loading" :loading-text="$t('dueDiligence.loadingPleaseWait')">
        <template v-slot:top="{ }">
            <div class="d-flex mt-5">
                <div style="width: 290px;">
                    <v-text-field prepend-inner-icon="mdi-magnify" outlined height="5px" :placeholder="$t('search')"
                        dense v-model="search" @input="handleSearchByPharse" class="shrink" clearable></v-text-field>
                </div>
                
                <!-- <div style="padding:0 20px;">
                    <v-dialog transition="dialog-top-transition" max-width="350" v-model="datepickerDialog"
                        @click:outside="datepickerDialog = false">
                        <v-card rounded="0">
                            <v-toolbar color="primary" class="white--text" flat :elevation="0">
                                <v-toolbar-title class="font-weight-bold">
                                    Filter By Date
                                </v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-btn icon class="white--text" @click="datepickerDialog = false">
                                    <v-icon>mdi-close</v-icon>
                                </v-btn>
                            </v-toolbar>
                            <v-card-text class="pt-5">
                                <div>
                                    <h3 style="color:black">Date of Register</h3>
                                    <v-date-picker no-title range v-model="filterDateCustom">
                                    </v-date-picker>

                                    <h3 style="color:black">Date of Last Report</h3>
                                    <v-date-picker no-title range v-model="filterDateCustom">
                                    </v-date-picker>
                                </div>
                            </v-card-text>
                            <v-divider class="mt-5"></v-divider>
                            <v-card-actions>
                                <v-btn outlined class="mr-2" depressed style="min-width: 150px;" color="primary">
                                    {{ $t("clear all") }}
                                </v-btn>

                                <v-btn color="primary" style="min-width: 150px;">
                                    {{ $t("search") }}
                                </v-btn>
                            </v-card-actions>
                        </v-card>

                    </v-dialog>
                    <v-btn @click="datepickerDialog = true" icon>
                        <v-icon size="60" color="primary">mdi-calendar-month</v-icon>
                    </v-btn>
                </div> -->

                <v-spacer></v-spacer>
                <div class="d-flex" style="margin-top: 15px;">
                    <div class="py-1 title">
                        {{ ((tableOptions.page - 1) * tableOptions.itemsPerPage) + 1 }} - {{ totalCoffee > (tableOptions.page * tableOptions.itemsPerPage) ? tableOptions.page * tableOptions.itemsPerPage : totalCoffee }} of {{ totalCoffee }}
                    </div>
                    <v-btn class="mx-2" fab small outlined color="primary" :disabled="tableOptions.page <= 1"
                        @click="pageChange(false)">
                        <v-icon dark>
                            mdi-chevron-left
                        </v-icon>
                    </v-btn>
                    <v-btn class="mx-2" fab small outlined color="primary" :disabled="tableOptions.page >= totalPages"
                        @click="pageChange(true)">
                        <v-icon dark>
                            mdi-chevron-right
                        </v-icon>
                    </v-btn>
                </div>
            </div>
        </template>
        <template v-if="coffees.length" v-slot:body="{ items }">
            <tbody>
                <tr v-for="item in items" :key="item.id"
                    style="position: relative; width: 0; height: 0">
                    <td>
                        <v-checkbox multiple v-model="selected" :value="item" style="margin:0px;padding:0px"
                            hide-details  @change="handleCheckboxChange"/>
                    </td>
                    <td> 
                        <span @click="handleShowDetail(item)">
                            {{ item.batchCode }} 
                        </span>
                    </td>
                        
                    <td> {{ getFarmLength(item) }} </td>

                    <td> Coffee  </td>
                    <td> {{ item.totalCoffeeCherryQty }} </td>
                    <td> {{ (item.processingBatch && item.processingBatch.length) ? item.processingBatch[0].batchRating : ''  }} </td>
                    
                    <td> {{ item.endDate  }}</td>
                    <td> {{ item.buyingStationOrder[0].buyingStation.country }} </td>

                </tr>
            </tbody>
        </template>
        <template v-slot:footer></template>
    </v-data-table>
</template>

<script>
import CoffeeService from "@/_services/CoffeeService";
import {debounce} from 'lodash';
// import axios from "axios";
export default {
    data() {
        return {
            selected: [],
            totalCoffee:0,
            headers: [
                {
                    text: this.$t('dueDiligence.lotId'),
                    align: 'start',
                    sortable: true,
                    value: 'batchCode',
                    class: "black--text",
                    width: '150px'
                },
                {
                    text: this.$t('deforestation.noOfFarms'),
                    align: 'start',
                    sortable: true,
                    value: 'user',
                    class: "black--text",
                    width: '150px'
                },
                {
                    text: this.$t('dueDiligence.product'),
                    align: 'start',
                    sortable: true,
                    value: 'user',
                    class: "black--text",
                    width: '150px'
                },
                {
                    text: this.$t('quantity'),
                    value: 'totalCoffeeCherryQty',
                    sortable: true,
                    class: "black--text",
                    width: '150px'
                },
                {
                    text: `${this.$t('dueDiligence.qualityGade')}`,
                    value: 'batchRating',
                    sortable: true,
                    class: "black--text",
                    width: '150px'
                },
                {
                    text: `${this.$t('dueDiligence.processingDate')}`,
                    value: 'farm',
                    sortable: true,
                    class: "black--text",
                    width: '225px'
                },
                {
                    text: `${this.$t('traceability.origin')}`,
                    value: 'farm',
                    sortable: true,
                    class: "black--text",
                    width: '225px'
                },
            ],
            loading:true,
            search:'',
            datepickerDialog:false,
            filterDateCustom:'',

            totalPages: 0,
            coffees:[],
            from: 0,
            to:0,
            tableOptions: {
              page:1,
              itemsPerPage:10
            },
        }
    },
    created(){
        this.getCoffeeData()
    },
    methods:{
        getFarmLength(item){
            let count = 0
            item.buyingStationOrder.forEach(x => {
                if(x.plantations && x.plantations.userFarms.length){
                    count += x.plantations.userFarms.length
                }else{
                count += 1
                } 
            })
            return count
        },
        handleSearchByPharse: debounce(function () {
            this.tableOptions.page = 1;
            this.getCoffeeData();
        }, 1000), 



      async getCoffeeData() {
        this.loading = true;
        try{
          let data = await CoffeeService.getCoffeeData(this.tableOptions,this.search);
          if(data.code == 200){
            const startIndex  = (this.tableOptions.page - 1) * this.tableOptions.itemsPerPage;
            const endIndex = startIndex +  this.tableOptions.itemsPerPage;
            this.coffees = data.data.response.slice(startIndex, endIndex);
            this.totalCoffee = data.data.count;
            this.totalPages = Math.ceil(this.totalCoffee/this.tableOptions.itemsPerPage)
            this.loading = false;
          }else{
            this.loading = false;
            this.items = []
          }
        }catch(e){
          console.log(e)
          this.loading = false;
          this.items = []
        }
      },

      pageChange(t) {
        if (t){
          this.tableOptions.page = this.tableOptions.page + 1;
        } else {
          this.tableOptions.page = this.tableOptions.page - 1;
        }
        this.getCoffeeData()
      },

      handleShowDetail(payload){
        this.$emit('detailInfo', {...payload, type: 'coffee'})
      },

      handleCheckboxChange(item){
        this.$emit('selected-coffee', item);
      },


    }
}
</script>