<template>
    <v-data-table :headers="headers" :items="cacao" hide-default-footer v-model="selected" show-select :search="search"
        :server-items-length="totalCacao" :footer-props="{
            'items-per-page-options': [10, 25, 50],
        }" :options.sync="options" :loading="loading" :loading-text="$t('dueDiligence.loadingPleaseWait')">
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
                            {{ ((tableOptions.page - 1) * tableOptions.itemsPerPage) + 1 }} - {{ totalCacao > (tableOptions.page * tableOptions.itemsPerPage) ? tableOptions.page * tableOptions.itemsPerPage : totalCacao }} of {{ totalCacao }}
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
        <template v-if="cacao.length" v-slot:body="{ items }">
            <tbody>
                <tr v-for="item in items" :key="item.id"
                    style="position: relative; width: 0; height: 0">
                    <td>
                        <v-checkbox multiple v-model="selected" :value="item" style="margin:0px;padding:0px"
                            hide-details @change="handleCheckboxChange"/>
                    </td>
                    <td> 
                        <span @click="handleShowDetail(item)">
                         {{ item.fermentationCode }} 
                        </span>
                    </td>
                    
                    <td> {{ getFarmLength(item) }} </td>

                    <td> Cacao  </td>
                    <td> {{ item.finalWeight }} </td>
                    <td> Fermentation  </td>
                    <td> {{ item.endDate }} </td>
                    <td> {{ item.cacaoPurchaseOrder[0].buyingStation.country }} </td>
                </tr>
            </tbody>
        </template>
        <template v-slot:footer></template>
    </v-data-table>
</template>

<script>
// import axios from 'axios'
import CacaoDataService from "@/_services/CacaoDataService";
import { debounce } from 'lodash';

export default {
    data() {
        return {
            selected: [],
            totalCacao:0,
            headers: [
                {
                    text: this.$t('dueDiligence.lotID'),
                    align: 'start',
                    sortable: true,
                    value: 'batchCode',
                    class: "black--text",
                    width: '150px'
                },
                {
                    text: this.$t('dueDiligence.noOfFarm'),
                    align: 'start',
                    sortable: true,
                    value: 'user',
                    class: "black--text",
                    width: '150px'
                },
                {
                    text: this.$t('deforestation.product'),
                    align: 'start',
                    sortable: true,
                    value: 'user',
                    class: "black--text",
                    width: '150px'
                },
                {
                    text: this.$t('deforestation.quantity'),
                    value: 'totalCoffeeCherryQty',
                    sortable: true,
                    class: "black--text",
                    width: '150px'
                },
                {
                    text: `${this.$t('processor')}`,
                    value: 'processor',
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
                    text: `${this.$t('dueDiligence.origin')}`,
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
            options: {
                page:1
            },
            cacao:[],
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
        this.getCacaoData()
    },
    methods:{
        getFarmLength(item){
            let count = 0
            item.cacaoPurchaseOrder.forEach(x => {
                if(x.cacaoPlantations && x.cacaoPlantations.userFarms.length){
                    count += x.cacaoPlantations.userFarms.length
                }else{
                count += 1
                } 
            })
            return count
        },

        handleSearchByPharse: debounce(function () {
            this.tableOptions.page = 1;
            this.getCacaoData();
        }, 1000),   


      pageChange(t) {
        if (t){
          this.tableOptions.page = this.tableOptions.page + 1;
        } else {
          this.tableOptions.page = this.tableOptions.page - 1;
        }
        this.getCacaoData()
      },

      handleCheckboxChange(item){
        this.$emit('selected-cacao', item);
      },

      handleShowDetail(payload){
        this.$emit('detailInfo', {...payload, type:'cacao'})
      },


      async getCacaoData() {
        this.loading = true;
        try{
          const data = await CacaoDataService.getCacaoData(this.tableOptions,this.search);
          if(data.code == 200){
            const startIndex  = (this.tableOptions.page - 1) * this.tableOptions.itemsPerPage;
            const endIndex = startIndex +  this.tableOptions.itemsPerPage;
            this.cacao = data.data.response.slice(startIndex, endIndex);
            this.totalCacao = data.data.count;
            this.totalPages = Math.ceil(this.totalCacao/this.tableOptions.itemsPerPage)
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

    }
}
</script>