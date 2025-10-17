<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div class="d-flex mb-4">
                <h2>{{ $t('dashboardSection.coffeeData') }}</h2>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    dark
                    small
                    @click="$router.push({name: 'CoffeeData'})"
                     v-if="getModulePermittedActions.post"
                >
                    Back
                </v-btn>
            </div>
            
            <v-card
                elevation="0"
                class="px-5"
            >
                <v-card-text>
                    <div v-if="coffeeVariety">
                        <v-data-table
                            :headers="headers"
                            :items="coffeeVariety"
                            :items-per-page="10"
                            :footer-props="{
                                'items-per-page-options': [10,25,50]
                            }"
                            hide-default-footer
                            :loading="coffeeVarietyLoading"
                            :options.sync="options"
                            :server-items-length="totalCoffeeVariety"
                            loading-text="Loading coffeeVariety..."
                        >
                        <template v-slot:top="{}">
                            <div class="d-flex mt-5 mb-5">
                                <!-- <h5 class="mt-3 mr-1">Coffee Data</h5> -->
                                <!-- <v-select
                                    :items="trees"
                                    item-text="text"
                                    item-value="val"
                                    outlined
                                    dense
                                    class="shrink wdt"
                                    v-model="tree"
                                    @change="goToTree"
                                ></v-select> -->
                                <v-spacer></v-spacer>
                                <v-btn
                                    color="primary"
                                    depressed
                                    @click="openCreateVariety"
                                    class="mx-2"
                                >ADD NEW</v-btn>
                                <CreateCoffeeVariety v-if="createVarietyDialog" @close-modal="closeVarietyModal" :dialog="createVarietyDialog"/>
                                <div class="py-1 title">{{ from }} - {{ to }} {{ $t('of') }} {{ totalCoffeeVariety }}</div>
                                <v-btn
                                    class="mx-2"
                                    fab
                                    small
                                    outlined
                                    color="primary"
                                    :disabled="options.page<=1"
                                    @click="pageChange(false)"
                                >
                                    <v-icon dark>
                                        mdi-chevron-left
                                    </v-icon>
                                </v-btn>
                                <v-btn
                                    class="mx-2"
                                    fab
                                    small
                                    outlined
                                    color="primary"
                                    :disabled="options.page>=totalPages"
                                    @click="pageChange(true)"
                                >
                                    <v-icon dark>
                                        mdi-chevron-right
                                    </v-icon>
                                </v-btn>
                            </div>
                        </template>
                        <template v-if="coffeeVariety" v-slot:body="{ items }">
                                <tbody>
                                    <tr
                                        v-for="item in items"
                                        :key="item.id"
                                        style="position: relative; width: 0; height: 0"
                                        @mouseover="selectItem(item)"
                                        @mouseleave="selectItem(false)"
                                    >
                                        <td> {{ item.name}} </td>
                                        <td class="text-truncate"> {{ getDateFormat(item.createdAt) || 'N/A'}} </td>
                                        <td class="text-center">
                                            Active
                                        </td>
                                        <div style="position: absolute; right: 10px; top:5px;" v-if="item === selectedItem">  
                                            <v-tooltip bottom  v-if="getModulePermittedActions.put">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn 
                                                        x-small 
                                                        fab
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        @click="editVariety(item)"
                                                    >
                                                        <v-icon>mdi-pencil</v-icon> 
                                                    </v-btn>
                                                </template>
                                                <span>{{ $t("delete") }}</span>
                                            </v-tooltip>
                                            <v-tooltip bottom  v-if="getModulePermittedActions.delete">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn 
                                                        x-small 
                                                        fab
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        class="ml-2"
                                                        @click="deleteVariety(item)"
                                                    >
                                                        <v-icon>mdi-trash-can-outline</v-icon> 
                                                    </v-btn>
                                                </template>
                                                <span>{{ $t("delete") }}</span>
                                            </v-tooltip>
                                        </div>
                                    </tr>
                                </tbody>
                            </template>
                            <template v-slot:footer></template>
                        </v-data-table>
                    </div>
                    
                </v-card-text>
            </v-card>
        </v-container>
        <EditCoffeeVariety v-if="showEditVariety" :editedData="editedVariety" @close-modal="closeVarietyModal" :dialog="showEditVariety"/>
        <confirm-box
            :title="confirmElements.title"
            :message="confirmElements.message"
            :cancelBtnText="confirmElements.cancelBtnText"
            :confirmBtnText="confirmElements.confirmBtnText"
            :confirmData="confirmElements.confirmData"
            :dialog="confirm"
            @confirm:action="confirmDeactivate"
        ></confirm-box>
    </div>
</template>
<script>
import CreateCoffeeVariety from "./CreateCoffeeVariety.vue"
import loadingMixin from "@/mixins/LoadingMixin"
import ConfirmBox from "@/components/ConfirmBox";
import EditCoffeeVariety from "./EditCoffeeVariety.vue"
import moment from "moment";
import CoffeeService from "@/_services/CoffeeService.js"
import getPermittedActions from "@/mixins/GetPermittedActions";

export default {
    components:{
        CreateCoffeeVariety,
        EditCoffeeVariety,
        ConfirmBox,
    },
    watch: {
      options: {
        handler () {
          this.getCoffeeVariety()
        },
        deep: true,
      },
    },
    data() {
        return {
            createVarietyDialog: false,
            trees: [
                { text: this.$t("coffeeData.windBreaker"), val: 'windbreakertree'},
                { text: this.$t("coffeeData.horticultureInfo"), val: 'horticulturetree'},
            ],
            tree: null,
            confirm: false,
            confirmElements: {
                title: this.$t("coffeeData.deleteVarietyTitle"),
                message: this.$t("coffeedata.deleteVarietyMessage"),
                confirmBtnText: "Delete",
                cancelBtnText: "Cancel",
                confirmData: {},
            },
            editedVariety: {},
            showEditVariety: false,
            selectedItem: false,
            options: {},
            loading: false,
            coffeeVarietyLoading: false,
            // search: '',
            from: 0,
            to:0,
            totalPages: 1,
            coffeeVariety: [],
            totalCoffeeVariety: 0,
            headers: [
                {
                    text: this.$t("name"),
                    align: 'start',
                    value: 'name',
                    class: "black--text"
                },
                {   
                    text: this.$t("date"), 
                    value: 'createdAt', 
                    class: "black--text",
                },
                {   text: this.$t("status"), 
                    align: 'center',
                    value: 'status', 
                    class: "black--text",
                },
            ],
            breadcrumbs: [
            {
                text: this.$t('dashboard'),
                disabled: false,
                to: { name: 'Users'},
                exact: true 
            },
            {
                text: this.$t("dashboardSection.coffeeData"),
                disabled: true,
                href: 'breadcrumbs_link_1',
            },
        ],
        }
    },
    methods: {
        getDateFormat(date){
            return moment(date).format('DD-MMM-YYYY');
        },
        async confirmDeactivate(res, variety) {
            if(res){
                this.startLoading()
                const response = await CoffeeService.deleteCoffeeVariety(variety.id)
                if(response.code == 200){
                    this.$notify({
                        title: response.message,
                        type: 'success'
                    })
                    this.confirm = false;
                    this.getCoffeeVariety();
                    this.stopLoading()
                }else{
                    this.$notify({
                        title: response.message,
                        type: 'error'
                    })
                    this.stopLoading()
                }
            }else{
                this.confirm = false;
            }
        },
        deleteVariety(data) {
            this.confirmElements.confirmData = data;
            this.confirm = true;
        },
        async getCoffeeVariety() {
            this.coffeeVarietyLoading = true
            try {
                const d = await CoffeeService.getCoffeeVariety(this.options)
                if(d.code === 200){
                    this.coffeeVariety = d.data.rows;
                    this.totalCoffeeVariety = d.data.count;
                    this.totalPages = Math.ceil(this.totalCoffeeVariety/this.options.itemsPerPage)
                    this.from = (((this.options.page-1)*this.options.itemsPerPage)+1)
                    this.to = (this.options.page*this.options.itemsPerPage)-(this.options.itemsPerPage-d.data.rows.length)
                    this.coffeeVarietyLoading = false;
                }else{
                    this.coffeeVarietyLoading = false;
                }

            }catch(err) {
                console.log('e', err)
                this.coffeeVarietyLoading = false;
            }
        },
        selectItem (item) {
            this.selectedItem = item
        },
        // resetSearchOnEmpty() {
            // if(this.search != '') return;
            // this.options.page = 1;
            // this.getCoffeeVariety()
        // },
        pageChange(t){
            if(t)
                this.options.page = this.options.page+1
            else
                this.options.page = this.options.page-1

            this.getCoffeeVariety()
        },
        editVariety(variety) {
            this.editedVariety = variety;
            this.showEditVariety = true;
        },

        openCreateVariety(){
            this.createVarietyDialog = true;
        },

        closeVarietyModal(suc){
            if(suc === true) {
                this.getCoffeeVariety()
            }
                
            this.createVarietyDialog = false
            this.showEditVariety = false;
        }
    },
    mixins: [loadingMixin, getPermittedActions]
}
</script>
<style lang="scss" scoped>
::v-deep .wdt.v-text-field{
      width: 250px;
}
::v-deep .v-tab:hover {
  background-color: #caf1e2;
  color: $primary_color !important;
}
::v-deep .v-data-table-header span {
    text-transform: uppercase !important;
	color: black; 
}
::v-deep .center-content {
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep .img-center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 40%;
}
</style>