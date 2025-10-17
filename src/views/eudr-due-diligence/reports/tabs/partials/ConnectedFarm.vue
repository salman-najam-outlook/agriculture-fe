<template>
    <v-data-table :headers="headers" :items="farms" hide-default-footer v-model="selected" show-select :search="search"
        :server-items-length="totalFarms" :footer-props="{
            'items-per-page-options': [10, 25, 50],
        }" :options.sync="options" item-key="id" :loading="loading" :loading-text="$t('dueDiligence.loadingPleaseWait')">
        <template v-slot:top="{ }">
            <div class="d-flex mt-5">
                <div style="width: 290px;">
                    <v-text-field prepend-inner-icon="mdi-magnify" outlined height="5px" :placeholder="$t('farm.searchFarmName')"
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
                            {{ ((tableOptions.page - 1) * tableOptions.itemsPerPage) + 1 }} - {{ totalFarms > (tableOptions.page * tableOptions.itemsPerPage) ? tableOptions.page * tableOptions.itemsPerPage : totalFarms }} {{ $t('of') }} {{ totalFarms }}
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
            <template v-slot:item.data-table-select="{ item }">
                <v-checkbox
                    :disabled="(item.farmCoordinates.length || item.circularGeofence) ? false : true" 
                    :title="(item.farmCoordinates.length || item.circularGeofence) ? false : 'This farm may not have farm coordinate or circular geofence'"
                    color="green"
                    multiple
                    :value="item"
                    v-model="selected"
                    
                />
            </template>

            <!-- @change="handleCheckboxChange(item)" -->

            <template v-slot:item.area="{item}">
                {{ item.area ? (parseFloat(item.area/2.47)).toFixed(4):null }}
            </template>

            <template v-slot:item.farmType="{ item }">
                <span v-if="item.farmCoordinates.length"> Polygon  </span>
                <span v-if="item.circularGeofence"> Circular  </span>
            </template>

        
            <!-- <template v-slot:item.eudr_deforestation_status="{ item }">
                
            </template>

            <template v-slot:item.risk_assessment="{item}">
                
            </template> -->
        
        <template v-slot:footer></template>
    </v-data-table>
</template>

<script>
// import axios from 'axios'
import Deforestation from "@/_services/DeforestationService";
import _ from 'lodash'
export default {
    data() {
        return {
            selected: [],
            totalFarms:0,
            headers: [
                {
                    text: this.$t('dueDiligence.productionPlaceAndFarmID'),
                    align: 'start',
                    sortable: true,
                    value: 'farmName',
                    class: "black--text",
                    width: '150px'
                },
                {
                    text: this.$t('Producer'),
                    align: 'start',
                    sortable: true,
                    value: 'user.fullName',
                    class: "black--text",
                    width: '150px'
                },
                {
                    text: this.$t('deforestation.addressOfProduction'),
                    align: 'start',
                    sortable: true,
                    value: 'address',
                    class: "black--text",
                    width: '150px'
                },
                {
                    text: this.$t('country'),
                    value: 'country',
                    sortable: true,
                    class: "black--text",
                    width: '150px'
                },
                {
                    text: this.$t('Area(Ha)'),
                    value: 'area',
                    sortable: true,
                    class: "black--text",
                    width: '150px'
                },
                {
                    text: this.$t('Farm Type'),
                    value: 'farmType',
                    sortable: true,
                    class: "black--text",
                    width: '150px'
                },
                {
                    text: `${this.$t('EUDR Deforestation Status')}`,
                    value: 'eudr_deforestation_status',
                    sortable: true,
                    class: "black--text",
                    width: '150px'
                },
                {
                    text: `${this.$t('Risk Assessment')}`,
                    value: 'risk_assessment',
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
            totalPages: 0,
            farms:[],
            from: 0,
            to:0,
            tableOptions: {
              page:1,
              itemsPerPage:50,
              limit:50
            },
        }
    },
    watch:{
        selected(newItem){
            this.$emit('selected-farms', newItem);  
        }
    },
    created(){
        this.getFarms()
    },
    methods:{
      handleSearchByPharse:_.debounce(function(){
        this.tableOptions.page =1 
        this.getFarms()
    },2000),
      pageChange(t) {
        if (t){
          this.tableOptions.page = this.tableOptions.page + 1;
        } else {
          this.tableOptions.page = this.tableOptions.page - 1;
        }
        this.getFarms()
      },

      handleCheckboxChange(item) {
        const index = this.selected.findIndex(x => x.id == item.id)
        if(index != -1) {this.selected.splice(index,1)} 
        else {this.selected.push(item)}
      },


      async getFarms() {
        this.loading = true;
        try{
          const payload = {
            ...this.tableOptions,
            search:this.search || ''
          }
          const data = await Deforestation.fetchDDSFarms(payload);
          this.farms  = data.data.rows
          this.totalFarms = data.data.totalRows
          this.totalPages = Math.ceil(this.totalFarms/this.tableOptions.itemsPerPage)
          this.loading = false
        }catch(e){
          this.loading = false;
          this.items = []
        }
      },

    }
}
</script>
<style>
.theme--light.v-input--is-disabled{
    color: #ddd !important;
}
</style>