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
                
                <div style="padding: 20px;">
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

                        <!-- </template> -->
                    </v-dialog>
                    <v-btn @click="datepickerDialog = true" icon>
                        <v-icon size="60" color="primary">mdi-calendar-month</v-icon>
                    </v-btn>
                </div>

                <v-spacer></v-spacer>
                <div class="d-flex" style="margin-top: 15px;">
                    <div class="py-1 title">
                        {{ options.page }} - {{ totalPages }} of {{ totalCacao }}
                    </div>
                    <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page <= 1"
                        @click="pageChange(false)">
                        <v-icon dark>
                            mdi-chevron-left
                        </v-icon>
                    </v-btn>
                    <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page >= totalPages"
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
                            hide-details />
                    </td>
                    <td>  {{ item.fermentationCode }} </td>
                    
                    <td> {{ item.cacaoPurchaseOrder.length }} </td>

                    <td> Cacao  </td>
                    <td> {{ item.finalWeight }} </td>
                    <td> </td>
                    <td> Fermentation  </td>
                    <td> {{ item.endDate }} </td>
                    <td> {{ item.cacaoPurchaseOrder[0].farmer.country }} </td>
                </tr>
            </tbody>
        </template>
        <template v-slot:footer></template>
    </v-data-table>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            selected: [],
            totalCacao:0,
            headers: [
                {
                    text: this.$t('Lot ID'),
                    align: 'start',
                    sortable: true,
                    value: 'batchCode',
                    class: "black--text",
                    width: '150px'
                },
                {
                    text: this.$t('No. Of Farms'),
                    align: 'start',
                    sortable: true,
                    value: 'user',
                    class: "black--text",
                    width: '150px'
                },
                {
                    text: this.$t('Product'),
                    align: 'start',
                    sortable: true,
                    value: 'user',
                    class: "black--text",
                    width: '150px'
                },
                {
                    text: this.$t('Quantity'),
                    value: 'totalCoffeeCherryQty',
                    sortable: true,
                    class: "black--text",
                    width: '150px'
                },
                {
                    text: `${this.$t('Quality Grade')}`,
                    value: 'batchRating',
                    sortable: true,
                    class: "black--text",
                    width: '150px'
                },
                {
                    text: `${this.$t('Processor')}`,
                    value: 'processor',
                    sortable: true,
                    class: "black--text",
                    width: '150px'
                },
                {
                    text: `${this.$t('Processing Date')}`,
                    value: 'farm',
                    sortable: true,
                    class: "black--text",
                    width: '225px'
                },
                {
                    text: `${this.$t('Origin')}`,
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
            totalPages: 1,
            cacao:[]
        }
    },
    created(){
        this.getCacaoData()
    },
    methods:{
        getFarmLength(item){
            if('buyingStationOrder' in item && 'farms' in item.buyingStationOrder[0].buyingStation){
                return item.buyingStationOrder[0].buyingStation.farms.length
            }
            return 0
        },
       handleSearchByPharse(){},

       getCacaoData(){
          this.loading = true
          axios.get('/cacao/buying-station/cacao-fermentation-process').then(res => {
             this.cacao = res.data.data.rows
             this.totalCacao = res.data.data.numRows
             this.loading = false
          }).catch(err => {
            this.loading = false
            console.log(err)
          })
       },

    }
}
</script>