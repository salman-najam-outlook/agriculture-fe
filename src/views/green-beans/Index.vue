<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-4">
        <h2>{{ $t('dashboardSection.greenBeansData') }}</h2>
        <v-spacer></v-spacer>

        <!-- <v-btn
          color="primary"
          dark
          small
          @click="$router.push({ name: 'CoffeeVariety' })"
          class="mr-2"
        >
          Coffee Varieties
        </v-btn> -->
        <!-- <v-btn
          color="primary"
          dark
          small
          @click="$router.push({ name: 'CoffeeSpecie' })"
        >
          Coffee Specie
        </v-btn> -->
      </div>

      <v-card elevation="0" class="px-5">
        <v-card-text>
          <div v-if="!greenBeansData" class="text-center" style="padding-top:5%">
            <v-row align="center" justify="center">
              <v-col>
                <v-img
                  max-height="190"
                  max-width="190"
                  src="/icons/nodata.svg"
                  class="img-center"
                ></v-img>
                <h5 class="mt-4 red--text">{{ $t("greenBeansData.notFound") }}</h5>
                <p class="text-caption black--text">
                  Please create coffee data using the <br />
                  button ”ADD NEW” above
                </p>
              </v-col>
            </v-row>
          </div>

          <div v-if="greenBeansData">
            <v-data-table
            @click:row="rowClicked"
              :headers="headers"
              :items="greenBeansData"
              :items-per-page="10"
              :footer-props="{
                'items-per-page-options': [10, 25, 50],
              }"
              hide-default-footer
              :loading="treeTypesLoading"
              :options.sync="options"
              loading-text="Loading greenBeansData..."
            >
              <template v-slot:top="{}">
                <div class="d-flex mt-5">
                  <h5 class="mt-3 mr-1">{{ $t('dashboardSection.dryMilling') }}</h5>
                  <v-select
                    :items="trees"
                    item-text="text"
                    item-value="val"
                    outlined
                    dense
                    class="shrink wdt"
                    v-model="tree"
                    @change="goToTree"
                  ></v-select>
                  <v-spacer></v-spacer>
                            <div class="py-1 title">{{ $t('filterBy') }}</div>
                            <v-btn
                                class="mx-2"
                                icon
                                color="primary"
                                @click="showFilters = true"
                            >
                                <v-icon dark large>
                                    mdi-filter
                                </v-icon>
                            </v-btn>
              
                  <div class="py-1 title">
                    {{ from }} - {{ to }} {{$t('of')}} {{ totalData}}
                  </div>
                  <v-btn
                    class="mx-2"
                    fab
                    small
                    outlined
                    color="primary"
                    :disabled="options.page <= 1"
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
                    :disabled="options.page >= totalPages"
                    @click="pageChange(true)"
                  >
                    <v-icon dark>
                      mdi-chevron-right
                    </v-icon>
                  </v-btn>
                </div>
              </template>

            </v-data-table>
          </div>
        </v-card-text>
      </v-card>
      <v-dialog
            v-model="showFilters"
            width="356"
            @click:outside="closeFilter"
            content-class="my-custom-dialog"
            transition="dialog-bottom-transition"
        >
            <v-card min-height="100vh" class="" rounded="0">
                <v-toolbar
                    color="primary"
                    class="white--text"
                    flat
                    :elevation="0"
                >

                    <v-toolbar-title class="font-weight-bold">{{ this.$t('filterBy') }}</v-toolbar-title>
                    <v-spacer></v-spacer>

                    <v-btn icon class="white--text" @click="closeFilter">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text class="pt-5">
                    <v-row no-gutters>
                        <v-col cols="12">
                            <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">{{ this.$t('membership.type') }}</label>
                            <v-select
                        
                                outlined
                                dense
                                :placeholder="$t('select')"
         
                                item-value="id"
   
                            ></v-select>
                        </v-col>
                        <v-col cols="12">
                            <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">{{ this.$t('membershipValidity') }}</label>
                            <v-select
                       
                                item-text="text"
                                item-value="value"
                                outlined
                                dense
                                :placeholder="$t('select')"
                    
                            ></v-select>
                        </v-col>

                        <v-col cols="12" >
                            <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">{{ this.$t('membership.remainingDays') }}</label>
                            <v-text-field
                                outlined
                                min="1"
                                dense
                                type="number"
                                value=""
      
                            >

                            </v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">{{ this.$t('regionState') }}</label>
                            <v-select
                                :items="['Colorado', '2', '3']"
                                outlined
                                dense
                                placeholder="Coming Soon"
                                disabled
                            ></v-select>
                        </v-col>
                        
                        <v-col cols="12">
                            <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">{{ this.$t('cityTown') }}</label>
                            <v-select
                                :items="['A City', 'B City', 'C City']"
                                outlined
                                dense
                                placeholder="Coming Soon"
                                disabled
                            ></v-select>
                        </v-col>
                        <v-col></v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" class="d-flex justify-space-around">
                            <v-btn outlined width="130" color="primary">
                                {{ this.$t('clearAll') }}
                            </v-btn>
                            <v-btn width="130" color="primary">
                                {{ this.$t('search') }}
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>

  </div>
</template>
<script>
/* eslint-disable */
import loadingMixin from "@/mixins/LoadingMixin";
import moment from "moment";

import GreenbeanService from "@/_services/GreenbeanService.js";

export default {
  async mounted() {
    console.log("asdasf")
      await this.getTreeTypes();
  },
  components: {

  },
  watch: {
    options: {
      handler(nV, oV) {
        console.log(JSON.stringify(nV), 'nv')
        console.log(JSON.stringify(oV), 'oV')
        // if(nV.page !=1 && nV.sortBy.length == 0) {
          this.getTreeTypes();
        // } else {
        //   nV.page = oV.page
        // }
      },
      deep: true,
    },
    "$route.params.tree": {
      handler(v) {
        this.tree = v;
      },
      deep: true,
    }
  },
  data() {
    return {
      showFilters: false,
      createSpeciesDialog: false,
      showEditSpecie: false,
      page: 1,
      createTreeDialog: false,
      trees: [
        { text: this.$t("coffeeData.windBreaker"), val: "windBreaker" },
        { text: this.$t("coffeeData.horticultureInfo"), val: "horticultureInfo" },
        { text: this.$t("coffeeData.shadeTree"), val: "shadeTree" },
        { text: this.$t("coffeeData.coffeeVariety"), val: "coffeeVariety" },
        { text: this.$t("coffeeData.coffeeSpecies"), val: "coffeeSpecies"}
      ],
      createTitle: "",
      tree: null,
      confirm: false,
      confirmElements: {
        title: this.$t("coffeeData.deleteCoffeeData"),
        message: this.$t("coffeeData.deleteCoffeeRecord"),
        confirmBtnText: this.$t("delete"),
        cancelBtnText: this.$t("cancel"),
        confirmData: {},
      },
      editedCoffeeData: {},
      showEditCoffeeData: false,
      tab: 0,
      selectedItem: false,
      options: {page: 1, itemsPerPage: 10, sortBy: []},
      loading: false,
      treeTypesLoading: false,
      search: "",
      from: 0,
      to: 0,
      totalPages: 1,
      greenBeansData: [],
      totalData: 0,
      headers: [
        {
          text: this.$t("id"),
          align: "start",
          value: "external_id",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("processor"),
          value: "dryMilling.fullName",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("type"),
          align: "center",
          value: "parchmentBatchMap[0].buyingStationProcessingBatch.processingType.name",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("cuppingScore"),
          align: "start",
          value: "cuppingData[0].final_score",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t('quantity'),
          align: "start",
          value: "greenBeansTotal",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("label"),
          value: "greenBeansLabel.title",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("expiry"),
          align: "center",
          value: "greenBeansExpiry",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("status"),
          align: "center",
          value: "status",
          class: "black--text",
          sortable: true,
        },
      ],
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: false,
          to: { name: "Users" },
          exact: true,
        },
        {
          text: this.$t("dashboardSection.cropOverview"),
          disabled: true,
          href: "breadcrumbs_link_1",
        },
        {
          text: this.$t("dashboardSection.greenBeansData"),
          disabled: true,
          href: "breadcrumbs_link_1",
        },
      ],
    };
  },
  methods: {
    rowClicked(item) {
      console.log(item, 'item')
      this.$router.push({ name: 'Green Bean Lot', params: { greenBeanId: item.id } })
    },
    closeFilter() {
      this.showFilters = false
    },
    getDateFormat(date) {
      return moment(date).format("DD-MMM-YYYY");
    },
    goToTree() {
      this.$router.push({ name: "CoffeeData", params: { tree: this.tree } });
    },
    async confirmDeactivate(res, data) {
      if (res) {
        console.log("resd", data);
        this.startLoading();
        let treeType = '';
        if (this.tree === 'coffeeSpecies') {
          treeType = 'coffeeVariety'
        } else if (this.tree === 'coffeeVariety') {
          treeType = 'coffeeSpecies'
        } else {
          treeType = this.tree
        }
        const response = await GreenbeanService.deleteTreeType(treeType, data.id);
        console.log("rrr", response);
        if (response.code == 200) {
          this.$notify({
            title: response.message,
            type: "success",
          });
          this.confirm = false;
          this.getTreeTypes();
          this.stopLoading();
        } else {
          this.$notify({
            title: response.message,
            type: "error",
          });
          this.stopLoading();
        }
      } else {
        this.confirm = false;
      }
    },
    deleteCoffeeData(data) {
      this.confirmElements.confirmData = data;
      this.confirm = true;
    },
    async getTreeTypes() {
      console.log("get tree types")
      this.treeTypesLoading = true;
      try {

        const d = await GreenbeanService.getAllGreenBeans(this.options);
        console.log(d, 'd')
        if (d.code === 200) {
          this.greenBeansData = d.data.rows.map(el => {
            if(el.greenBeansLabel && typeof el.greenBeansLabel == "string"){
              console.log(el.greenBeansLabel, 'el.greenBeansLabel')
              el.greenBeansLabel = JSON.parse(el.greenBeansLabel)
            }
            if(el.greenBeansExpiry && typeof el.greenBeansExpiry == "string"){
              el.greenBeansExpiry = moment(el.greenBeansExpiry).format("DD-MMM-YYYY")
            }
              return el
          });
          this.totalData = d.data.count;
          this.totalPages = Math.ceil(
            this.totalData / this.options.itemsPerPage
          );

          this.from = ((this.options.page-1)*this.options.itemsPerPage)+1
          this.to = (this.options.page*this.options.itemsPerPage)-(this.options.itemsPerPage-d.data.rows.length)
          this.treeTypesLoading = false;
        } else {
          this.treeTypesLoading = false;
        }
      } catch (err) {
        console.log(err, 'err')
        this.coffeeData = [];
        this.from = 0;
        this.to = 0;
        this.totalData = 0;
        this.treeTypesLoading = false;
      }
    },
    selectItem(item) {
      this.selectedItem = item;
    },


    pageChange(t) {
      if(t)
          this.options.page = this.options.page+1
      else
          this.options.page = this.options.page-1

      // this.getTreeTypes();

    },

    editCoffeeData(data) {
      this.createTitle = `Update ${this.trees.filter(item => item.val === this.tree)[0].text}`;
      this.editedCoffeeData = data;
      if(this.tree == "coffeeVariety")
        this.showEditSpecie = true;
      else
        this.showEditCoffeeData = true;
    },

    // roleUpdated(suc) {
    //   if (suc) this.getTreeTypes();
    // },

    openCreateTree() {
      this.createTitle = `Add New ${this.trees.filter(item => item.val === this.tree)[0].text}`;
      if(this.tree == "coffeeVariety")
        this.createSpeciesDialog  = true;
      else
        this.createTreeDialog = true;
    },
    closeTreeModal(suc) {
      if (suc === true) {
        this.getTreeTypes();
      }
      this.showEditCoffeeData = false;
      this.createTreeDialog = false;
    },

  closeSpeciesModal(suc){
      if(suc === true) {
          this.getTreeTypes()
      }
          
      this.createSpeciesDialog = false
      this.showEditSpecie = false
  }
  },
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
