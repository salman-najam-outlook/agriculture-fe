<template class = 'traceability'>
    <v-dialog transition="dialog-top-transition" max-width="800" v-model="dialog" @click:outside="closeModal">
        <v-card rounded="0">
            <v-toolbar color="primary" class="white--text" flat :elevation="0">
                <v-toolbar-title class="font-weight-bold">
                    Lot ID: {{item.batchCode}}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn  data-html2canvas-ignore="true" icon class="white--text" @click="closeModal">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text class="pt-5">
                <div class="main-content">
                    <h4 class="mb-4 primary-color"> Product Traceability </h4>
                    <div class="tbl-info mb-10">
                        <p> Lot (Farmers) </p>
                        <div class="table-design mb-5">
                            <v-data-table
                                :headers="farmersHeader"
                                :items="farmers"
                                item-value="name"
                                :hide-default-footer="true"
                            ></v-data-table>
                        </div>
                    </div>

                    <div class="tbl-info mb-10">
                        <p> Purchase Orders Lots (Buying Station) </p>
                        <div class="table-design mb-5">
                            <v-data-table
                                :headers="purchaseOrderHeaders"
                                :items="purchaseOrders"
                                item-value="name"
                                :hide-default-footer="true"
                            ></v-data-table>
                        </div>
                    </div>

                    <div class="tbl-info mb-10">
                        <p> Parchments Lots (Processor) </p>
                        <div class="table-design mb-5">
                            <v-data-table
                                :headers="parchementHeaders"
                                :items="parchments"
                                item-value="name"
                                :hide-default-footer="true"
                            ></v-data-table>
                        </div>
                    </div>

                    <div class="other-info">
                        <div class="d-flex mb-4">
                            <div class="flex-1">
                                <p class="font-weight-bold"> Parchment Quantity </p>
                                <p> {{parchmentQuantity}} </p>
                            </div>

                            <div class="flex-2">
                                <p class="font-weight-bold"> Air Humidity </p>
                                <p> {{item.humidity ? item.humidity + '%': 'N/A' }} </p>
                            </div>
                        </div>

                        <div class="d-flex mb-4">
                            <div class="flex-1">
                                <p class="font-weight-bold"> Density </p>
                                <p> {{item.density ? item.density: 'N/A' }} </p>
                            </div>

                            <div class="flex-2">
                                <p class="font-weight-bold"> Batch Production Density </p>
                                <p> {{batchProductionDensity}} {{ batchProductionDensityUnit }} </p>
                            </div>
                        </div>

                        <div class="d-flex mb-4">
                            <div class="flex-1">
                                <p class="font-weight-bold"> Kilogram Asian </p>
                                <p> {{totalBatchProductionKilogramAsalan}}KG </p>
                            </div>

                            <div class="flex-2">
                                <p class="font-weight-bold"> Quality Score </p>
                                <p> {{item.batchRating ? item.batchRating: 'N/A' }} </p>
                            </div>
                        </div>

                        <div class="d-flex mb-4">
                            <div class="flex-1">
                                <p class="font-weight-bold"> Percentage Primary Defect </p>
                                <p> {{ primaryDefect }}% </p>
                            </div>

                            <div class="flex-2">
                                <p class="font-weight-bold"> Percentage Secondary Defect </p>
                                <p> {{secondaryDefect}}% </p>
                            </div>
                        </div>

                        <div class="d-flex mb-4">
                            <div class="flex-1">
                                <p class="font-weight-bold">Total Green Beans </p>
                                <p> {{totalGreenBeans}}KG </p>
                            </div>

                            <div class="flex-2">
                                <p class="font-weight-bold"> Number of Bags </p>
                                <p> {{ totalGreenBeansBags }} </p>
                            </div>
                        </div>

                        <div class="d-flex mb-4">
                            <div class="flex-1">
                                <p class="font-weight-bold">Expiry Date</p>
                                <p> {{item.endDate}} </p>
                            </div>

                            <div class="flex-2">
                                <p class="font-weight-bold"> Quality Score </p>
                                <p> {{item.batchRating ? item.batchRating: 'N/A' }} </p>
                            </div>
                        </div>

                        <div class="d-flex mb-4">
                            <div>
                                <p class="font-weight-bold">Cupping Result</p>
                                <div v-for="c in cuppingResults" :key="c">
                                <div class="d-flex">
                                    <div class="flex-1">
                                        <p> {{c.cuppingDate}} </p>
                                        <p> {{ c.cuppingName }} </p>
                                    </div>
                                    <div class="flex-2">
                                        <p> {{c.roastingTemperature}} {{c.roastingTemperatureUnit}}/ {{c.roastingTime}} Min </p>
                                        <p> Dark Roast  </p>
                                    </div>
                                    <div class="flex-3">
                                        <p> {{ c.finalScore }} </p>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-5">
                    <h4 class="mb-4 primary-color"> Product Output </h4>
                    <p> Green Beans : {{totalGreenBeans}} KG </p>
                </div>
            </v-card-text>
            <v-card-actions>
                <!-- <v-btn outlined class="mr-2" depressed style="min-width: 150px;" @click="closeModal" color="primary">
                    {{ $t("cancel") }}
                </v-btn>
                <v-btn color="primary" style="min-width: 150px;" @click="confirmApprove">
                    {{ $t("confirm") }}
                </v-btn> -->
                <v-btn data-html2canvas-ignore="true" color="primary" style="min-width: 150px;" @click="exportToPDF">
                    Download PDF               
                 </v-btn>
            </v-card-actions>
        </v-card>

        <!-- </template> -->
    </v-dialog>
</template>
<script>
import loading from "@/mixins/LoadingMixin";
import html2pdf from "html2pdf.js";
export default {
    async mounted() { 
        if(this.item.type === 'coffee'){
        this.mapBuyingStationData()
   this.mapParchmentData()
        }
        else if(this.item.type === 'cacao'){
            console.log(this.item)
            this.mapCacaoBuyingStationData()

            this.item.batchCode = this.item.fermentationCode;
           // parchmentQuantity
//item.humidity
    //        totalBatchProductionKilogramAsalan
      //      primaryDefect
        //    secondaryDefect
          //  totalGreenBeans
            //totalGreenBeansBags
           // cuppingResults[{
            //    cuppingDate
              //  cuppingName
               // roastingTemperature
               // roastingTemperatureUnit
               // finalScore
              //  totalGreenBeans
          //  }]
        }
    },
    props: {
        dialog: {
            required: false,
            type: Boolean,
        },
        item: {
            required: true,
            type: Object
        },
    },

    data() {
       return {
        cuppingResults:[],
        totalGreenBeans: 0,
        totalGreenBeansBags: 0,
        totalBatchProductionKilogramAsalan:0,
        primaryDefect: 0,
        secondaryDefect: 0,
        greenBeanLabels: [],
        greenBeansExpiry: null,
        parchmentQualityScore: null,
        batchProductionDensity: 0,
        batchProductionDensityUnit: "kg/m3",
        parchmentQuantity: 0,
        farmersHeader:[
            {text:'Farmer', value:'farmer'},
            {text:'Lot', value:'lots'},
            {text:'Farm', value:'farm'},
            {text:'Quantity', value:'quantity'},
            {text:'Price', value:'price'},
            {text:'Date', value:'date'},
        ],
        purchaseOrderHeaders:[
            {text:'Purchaser', value:'purchaser'},
            {text:'Lot(s)', value:'lots'},
            {text:'Buying Station', value:'buyingStation'},
            {text:'Quantity', value:'quantity'},
            {text:'Price', value:'price'},
            {text:'Date', value:'Date'},
        ],
        parchementHeaders:[
            {text:'Purchaser', value:'purchaser'},
            {text:'Lot(s)', value:'lots'},
            {text:'Processor', value:'processor'},
            {text:'Quantity', value:'quantity'},
            {text:'Price', value:'price'},
            {text:'Date', value:'Date'},
        ],
        farmers:[],
        purchaseOrders:[],
        parchments:[],
       }
    },
    methods: {
        closeModal(suc = false) {
            this.$emit("closeCoffeeCacaoTraceability", suc);
        },
        confirmApprove() {
            this.$emit("confirm-approval");
        },
        mapCacaoBuyingStationData(){
            this.farmers= [];
            this.purchaseOrders= [];
             this.item.cacaoPurchaseOrder.forEach(b=>{
            this.farmers.push({
                id:b.farmer.id,
                farmer:b.farmer.fullName,
                lots:'',
                farm:b.userFarms.farmName,
                quantity:'',
                price:0,
                date:''
            });

            this.purchaseOrders.push({
            id: b.id,
            purchaser:b.farmer.fullName,
                lots:b.orderCode,
                buyingStation:b.buyingStation.fullName,
                quantity:b.availableWeight,
                price:b.perKgPrice,
                date:b.purchasedAt
                })
            })
        },
        mapBuyingStationData(){
            this.farmers= [];
            this.purchaseOrders= [];
             this.item.buyingStationOrder.forEach(b=>{
            this.farmers.push({
                id:b.farmer.id,
                farmer:b.farmer.fullName,
                lots:'',
                farm:b.userFarms.farmName,
                quantity:'',
                price:0,
                date:''
            });

            this.purchaseOrders.push(    {
            id: b.id,
            purchaser:b.farmer.fullName,
                lots:b.orderCode,
                buyingStation:b.buyingStation.fullName,
                quantity:b.coffeeCherryQty,
                price:b.perKgPrice,
                date:b.purchasedAt
                })
            })
        },
        mapParchmentData(){
        
            this.parchments = this.item.parchmentCoffeeProcessingBatches.map((p) => {

                this.totalGreenBeans = this.totalGreenBeans + p.parchmentCoffee.purchaseDate
                this.totalGreenBeansBags = this.totalGreenBeansBags + p.parchmentCoffee.totalGreenBeansBags
                this.totalBatchProductionKilogramAsalan = this.totalBatchProductionKilogramAsalan + p.parchmentCoffee.batchProductionKilogramAsalan
                this.primaryDefect = this.primaryDefect + p.parchmentCoffee.batchProductionPrimaryDefect
                this.secondaryDefect = this.secondaryDefect + p.parchmentCoffee.batchProductionSecondaryDefect
                this.parchmentQuantity = this.parchmentQuantity + p.quantity

                this.greenBeanLabels.push({ ...p.parchmentCoffee.greenBeansLabel, labelUrl: p.parchmentCoffee.labelUrl })
                this.greenBeansExpiry = p.parchmentCoffee.greenBeansExpiry
                this.parchmentQualityScore = p.parchmentCoffee.parchmentQualityScore
                this.batchProductionDensity = p.parchmentCoffee.batchProductionDensity
                this.batchProductionDensityUnit = p.parchmentCoffee.batchProductionDensityUnit
                this.cuppingResults = p.parchmentCoffee.cuppingData.map(c=>{
                    return {
                        cuppingDate: c.cupping_date,
                        roastingTime: c.roasting_time,
                        roastingTemperature: c.roasting_temperature,
                        roastingTemperatureUnit: c.roasting_temperature_unit,
                        finalScore: c.final_score,
                        cuppingName: c.cupping_name,
                    }
                })
                return {
                    id: p.id,
                    lots: p.huskCode,
                    purchaser: p.parchmentCoffee.dryMilling.fullName,
                    processor: "purchaser",
                    quantity: p.quantity,
                    price: 0,
                    date: p.parchmentCoffee.purchaseDate
                }
            })
        },
        async exportToPDF() {
      const element = document.querySelector(".v-dialog--active");
      html2pdf(element, {
        margin: 0.25,
        filename: "ProductTraceability.pdf" ,
        image: { type: "jpeg", quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: {
          unit: "in",
          format: "a4",
          compress: false,
          orientation: 'portrait'
        },
      })    },
      
    },
    mixins: [loading],
};
</script>

<style scoped>
.flex-1, .flex-2, .flex-3 {
    display: inline-block;
    vertical-align: top;
}

.flex-1 {
    width: 48%; /* Adjust the width as needed */
}
.flex-2 {
    width: 48%; /* Adjust the width as needed */
}
.flex-3 {
    width: 48%; /* Adjust the width as needed */
}

@media print {
    .flex-1, .flex-2, .flex-3{
        display: inline-block;
        width: 48%; /* Adjust as needed */
        margin-right: 3%;
    }
}

 .primary-color{
    color:#31bd73
 }
</style>