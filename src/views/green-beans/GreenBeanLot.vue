<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="row">
        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 mt-1 ml-3">
          <h2>
            Green Beans Lot Traceability
          </h2>
        </div>
      </div>

      <div class="row mt-3" v-if="greenBeanData">
        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 mt-n5 ml-3">
          <h4>
            <b>ID</b> : <span style="font-weight: 100;">{{greenBeanData.external_id}}</span>
          </h4>
        </div>

        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 mt-n5 ml-3">
          <h4>
            <b>Processor</b> : <span style="font-weight: 100;">{{ greenBeanData.dryMilling.fullName }}</span>
          </h4>
        </div>

        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 mt-n5 ml-3">
          <h4>
            <b>Type</b> : <span style="font-weight: 100;">{{ greenBeanData.parchmentBatchMap &&
      greenBeanData.parchmentBatchMap[0] && greenBeanData.parchmentBatchMap[0].buyingStationProcessingBatch.
        processingType.name }}</span>
          </h4>
        </div>

        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 mt-n5 ml-3">
          <h4>
            <b>Score</b> : <span style="font-weight: 100;">{{greenBeanData.cuppingData && greenBeanData.cuppingData[0] && greenBeanData.cuppingData[0].final_score  }}</span>
          </h4>
        </div>

        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 mt-n5 ml-3">
          <h4>
            <b>Quantity</b> : <span style="font-weight: 100;">{{ `${greenBeanData.greenBeansTotal} KG -
              ${greenBeanData.greenBeansBags} Bags`
              }}</span>
          </h4>
        </div>

        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 mt-n5 ml-3">
          <h4>
            <b>Label</b> : <span style="font-weight: 100;">{{ greenBeanData.greenBeansLabel &&
      greenBeanData.greenBeansLabel.title }}</span>
          </h4>
        </div>

        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 mt-n5 ml-3">
          <h4>
            <b>Expiry</b> : <span style="font-weight: 100;">{{ greenBeanData.greenBeansExpiry }}</span>
          </h4>
        </div>

        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 mt-n5 ml-3">
          <h4>
            <b>Status</b> : <span style="font-weight: 100;">{{ greenBeanData.status }}</span>
          </h4>
        </div>

      </div>

      <div class="mt-5">
        <v-data-table 
          :headers="farmerHeaders" 
          :items="farmerList"
        >

          <template v-slot:item.fullName="{ item }">

            <v-menu open-on-hover location="end">
              <template v-slot:activator="{ on, attrs }">
                <!-- <v-btn v-bind="attrs" v-on="on">Open Menu</v-btn> -->

                <v-btn class="ma-2" color="primary" fab v-bind="attrs" v-on="on">
                  <img src="/img/user.png" class="text-icon">
                </v-btn>
              </template>
              <v-card max-width="450" color="primary">
                <v-toolbar color="primary" class="white--text" elevation="0">Farmer Information</v-toolbar>
                <v-card-text class="white--text">
                  <div class="row">
                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 mt-n5 ml-3"> <span style="font-weight: bold">
                        Mobile
                        Number</span> <br> {{ item.mobile || "NA" }} </div>
                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 mt-n5 ml-3"> <span
                        style="font-weight: bold">City/Town </span>
                      <br> {{ item.city || "NA" }}
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 mt-n5 ml-3"> <span
                        style="font-weight: bold">Address </span> <br>
                      {{ item.address || "NA" }}</div>
                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 mt-n5 ml-3"> <span
                        style="font-weight: bold">Region/State</span>
                      <br> {{ item.stateId || "NA" }}
                    </div>
                  </div>
                </v-card-text>


              </v-card>
            </v-menu>


            {{ item.fullName }}
          </template>

          <template v-slot:item.varietyQuality="{ item }">
            <span>{{ item.coffeeVariety }}</span> <br>
            <span class="center-content">{{ item.coffeeCherryQlty }}</span>
          </template>

        </v-data-table>
      </div>

      <div class="mt-">
        <v-data-table 
          :items="buyingStationList"
          :headers="buyingHeaders"
        >


          <template v-slot:item.fullName="{ item }">

            <v-menu open-on-hover location="end">
              <template v-slot:activator="{ on, attrs }">
                <!-- <v-btn v-bind="attrs" v-on="on">Open Menu</v-btn> -->

                <v-btn class="ma-2" color="primary" fab v-bind="attrs" v-on="on">
                  <img src="/img/user.png" class="text-icon">
                </v-btn>
              </template>
              <v-card max-width="450" color="primary">
                <v-toolbar color="primary" class="white--text" elevation="0">Farmer Information</v-toolbar>
                <v-card-text class="white--text">
                  <div class="row">
                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 mt-n5 ml-3"> <span style="font-weight: bold">
                        Mobile
                        Number</span> <br> {{ item.mobile || "NA" }} </div>
                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 mt-n5 ml-3"> <span
                        style="font-weight: bold">City/Town
                      </span> <br> {{ item.city || "NA" }}</div>
                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 mt-n5 ml-3"> <span
                        style="font-weight: bold">Address </span>
                      <br> {{ item.address || "NA" }}
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 mt-n5 ml-3"> <span
                        style="font-weight: bold">Region/State</span> <br> {{ item.stateId || "NA" }}</div>
                  </div>
                </v-card-text>


              </v-card>
            </v-menu>


            {{ item.fullName }}
          </template>

          <template v-slot:item.varietyQuality="{ item }">
            <span>{{ item.coffeeVariety }}</span> <br>
            <span class="center-content">{{ item.coffeeCherryQlty }}</span>
          </template>

        </v-data-table>
      </div>

      <div class="mt-">
        <v-data-table 
          :items="greenbeanList"
          :headers="greenbeanHeaders"
        >


          <template v-slot:item.fullName="{ item }">

            <v-menu open-on-hover location="end">
              <template v-slot:activator="{ on, attrs }">
                <!-- <v-btn v-bind="attrs" v-on="on">Open Menu</v-btn> -->

                <v-btn class="ma-2" color="primary" fab v-bind="attrs" v-on="on">
                  <img src="/img/user.png" class="text-icon">
                </v-btn>
              </template>
              <v-card max-width="450" color="primary">
                <v-toolbar color="primary" class="white--text" elevation="0">Farmer Information</v-toolbar>
                <v-card-text class="white--text">
                  <div class="row">
                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 mt-n5 ml-3"> <span style="font-weight: bold">
                        Mobile
                        Number</span> <br> {{ item.mobile || "NA" }} </div>
                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 mt-n5 ml-3"> <span
                        style="font-weight: bold">City/Town
                      </span> <br> {{ item.city || "NA" }}</div>
                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 mt-n5 ml-3"> <span
                        style="font-weight: bold">Address </span>
                      <br> {{ item.address || "NA" }}
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 mt-n5 ml-3"> <span
                        style="font-weight: bold">Region/State</span> <br> {{ item.stateId || "NA" }}</div>
                  </div>
                </v-card-text>


              </v-card>
            </v-menu>


            {{ item.fullName }}
          </template>

          <template v-slot:item.varietyQuality="{ item }">
            <span>{{ item.coffeeVariety }}</span> <br>
            <span class="center-content">{{ item.coffeeCherryQlty }}</span>
          </template>

        </v-data-table>
      </div>

      <div>
        <v-card flat color="#f2f2f2" class="mt-5" text="">
          <v-card-text>
            <div class="row">
              <div class="col"><span style="font-weight: bold;">Total Supplied: </span> {{ `${(greenBeanData &&
      greenBeanData.usedForWarehouse || greenBeanData && greenBeanData.outboundSent) ?
      greenBeanData.greenBeansTotal
      + "Kg" : "N/A"}` }} </div>
              <div class="col"><span style="font-weight: bold;">Total Processed: </span> {{ parchmentQty }} </div>
              <div class="col"><span style="font-weight: bold;">Total Wastage: </span> {{ parchmentQty -( greenBeanData
                &&
                greenBeanData.greenBeansTotal) + " Kg" }} </div>
            </div>
          </v-card-text>
        </v-card>
      </div>


    </v-container>
  </div>
</template>
<script>
/* eslint-disable */
import loadingMixin from "@/mixins/LoadingMixin";

import GreenbeanService from "@/_services/GreenbeanService.js";
export default {
  async mounted() {

    try {
      this.startLoading();
      console.log('test')
      console.log(this.$route.params.greenBeanId, ';this.$route.params.greenBeanId')
      this.greenBeanData = (await GreenbeanService.getGreenBeansById(this.$route.params.greenBeanId)).data

      if (this.greenBeanData.greenBeansLabel && typeof this.greenBeanData.greenBeansLabel == "string") {

        this.greenBeanData.greenBeansLabel = JSON.parse(this.greenBeanData.greenBeansLabel)
      }

      this.greenBeanData.parchmentBatchMap.forEach(pbm => {
        pbm.buyingStationProcessingBatch.buyingStationOrder.forEach(bo => {
          let tempObj = {
            ...bo.farmer,
            processingType: pbm.buyingStationProcessingBatch.processingType.name,
            buyingStation: "Buying Station",
            orderCode: bo.orderCode,
            coffeeVariety: bo.coffeeVariety.name,
            coffeeCherryQlty: bo.coffeeCherryQlty,
            coffeeCherryQty: bo.coffeeCherryQty,
            otherLots: '----'
          }
          this.farmerList.push(tempObj)
        })
      })
      console.log(this.farmerList, "@@farmerList");


      this.greenBeanData.parchmentBatchMap.forEach(pbm => {
        pbm.buyingStationProcessingBatch.buyingStationOrder.forEach(bo => {
          console.log(bo)
          this.buyingStationList.push({
            ...bo.buyingStation,
            processingType: pbm.buyingStationProcessingBatch.processingType.name,
            buyingStation: "Processor",
            coffeeVariety: bo.coffeeVariety.name,
            coffeeCherryQlty: bo.coffeeCherryQlty,
            coffeeCherryQty: pbm.quantity,
            parchmentCode: `PC-${pbm.parchmentCoffeeId}`,
            otherLots: `${pbm.buyingStationParchmentId} (${pbm.quantity} Kg)`

          })
        })
      })
      console.log(this.buyingStationList, "@@buyingStationList");


      // this.greenBeanData.parchmentBatchMap.forEach(pbm => {
      //   pbm.buyingStationProcessingBatch.buyingStationOrder.forEach(bo => {
      //     this.greenbeanList.push({
      //       ...bo.buyingStation,
      //       greenBeansId: this.greenBeanData.greenBeansId,
      //       dryMillingUser: this.greenBeanData.dryMilling,
      //       processingType: pbm.buyingStationProcessingBatch.processingType.name,
      //       buyingStation: "Processor",
      //       orderCode: bo.orderCode,
      //       coffeeVariety: bo.coffeeVariety.name,
      //       coffeeCherryQlty: bo.coffeeCherryQlty,
      //       coffeeCherryQty: bo.coffeeCherryQty,
      //       parchmentCode: `PC-${pbm.parchmentCoffeeId}`

      //     })
      //   })
      // })

      this.greenbeanList.push({
        dryMillingUser: this.greenBeanData.dryMilling,
        processingType: this.greenBeanData.parchmentBatchMap && this.greenBeanData.parchmentBatchMap[0] && this.greenBeanData.parchmentBatchMap[0].buyingStationProcessingBatch.processingType.name,
        buyingStation: "----",
        greenBeansId: this.greenBeanData.greenBeansId,
        coffeeVariety: this.greenBeanData.parchmentBatchMap && this.greenBeanData.parchmentBatchMap[0] && this.greenBeanData.parchmentBatchMap[0].buyingStationProcessingBatch.buyingStationOrder[0].coffeeVariety[0] && this.greenBeanData.parchmentBatchMap[0].buyingStationProcessingBatch.buyingStationOrder[0].coffeeVariety[0].name,
        parchmentQualityScore: this.greenBeanData.parchmentQualityScore,
        greenBeansTotal: this.greenBeanData.greenBeansTotal,
        otherLots: `${this.greenBeanData.greenBeansId} (${this.greenBeanData.greenBeansTotal} Kg)`
      })


      this.greenBeanData.parchmentBatchMap.forEach(el => {
        this.parchmentQty += el.quantity
      })
      console.log(this.greenBeanData)
      this.stopLoading();
    } catch (error) {
      console.log(error, 'error')
      this.stopLoading();
    }
  },
  components: {

  },
  watch: {

  },
  data() {
    return {
      parchmentQty: 0,
      greenBeanData: null,
      farmerList: [],
      buyingStationList: [],
      greenbeanList: [],
      processorList: [],
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: false,
          to: { name: "Users" },
          exact: true,
        },
        {
          text: this.$t("Crops Overview"),
          disabled: true,
          href: "breadcrumbs_link_1",
        },
        {
          text: this.$t("Green Beans"),
          disabled: true,
          href: "breadcrumbs_link_1",
        },
      ],

      farmerHeaders: [
        {
          text: this.$t("Farmer Name"),
          align: "start",
          value: "fullName",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("Methods"),
          value: "processingType",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("Supplied To"),
          align: "center",
          value: "buyingStation",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("Lot ID"),
          align: "start",
          value: "orderCode",
          class: "black--text",
          sortable: true,
        },
        {
          text: "Variety / Quality",
          align: "start",
          value: "varietyQuality",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("Quantity (Kg)"),
          value: "coffeeCherryQty",
          class: "black--text",
          sortable: true,
        }
      ],
      buyingHeaders: [
        {
          text: this.$t("Buying Station Name"),
          align: "start",
          value: "fullName",
          class: "black--text",
          sortable: true,
          width: '20%'
        },
        {
          text: this.$t("Methods"),
          value: "processingType",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("Supplied To"),
          align: "center",
          value: "buyingStation",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("Lot ID"),
          align: "start",
          value: "parchmentCode",
          class: "black--text",
          sortable: true,
        },
        {
          text: "Variety / Quality",
          align: "start",
          value: "varietyQuality",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("Quantity (Kg)"),
          value: "coffeeCherryQty",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("Other Lots"),
          value: "otherLots",
          class: "black--text",
          sortable: true,
        }
      ],
      greenbeanHeaders: [
        {
          text: this.$t("Processor Name"),
          align: "start",
          value: "dryMillingUser.fullName",
          class: "black--text",
          sortable: true,
          width: '20%'
        },
        {
          text: this.$t("Methods"),
          value: "processingType",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("Supplied To"),
          align: "center",
          value: "buyingStation",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("Lot ID"),
          align: "start",
          value: "greenBeansId",
          class: "black--text",
          sortable: true,
        },
        {
          text: "Variety / Quality",
          align: "start",
          value: "coffeeVariety",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("Quantity (Kg)"),
          value: "greenBeansTotal",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("Other Lots"),
          value: "otherLots",
          class: "black--text",
          sortable: true,
        }
      ],
    }
  },
  methods: {},
  mixins: [loadingMixin],
};
</script>
<style lang="scss" scoped>
::v-deep .wdt.v-text-field {
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

::v-deep .my-custom-dialog {
  position: absolute;
  top: 0;
  min-height: 100%;
  right: 0;
  margin-right: 0px;
  margin-top: 0px;
}
</style>
