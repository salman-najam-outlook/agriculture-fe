<template>
    <div>
      <breadcrumb :items="breadcrumbs"></breadcrumb>
      <v-container fluid>
        <div class="d-flex mb-4">
          <h2>{{ $t('dashboardSection.cacaoData') }}</h2>
          <v-spacer></v-spacer>
           <v-btn
              color="primary"
              depressed
              @click="openCreateTree"
              class="mx-2"
              >{{ $t('addNew') }}</v-btn
            >
            <!-- v-if="getModulePermittedActions.post" -->
        </div>
  
        <v-card elevation="0" class="px-5">
          <v-card-text>
            <div v-if="!cacaoData" class="text-center" style="padding-top:5%">
              <v-row align="center" justify="center">
                <v-col>
                  <v-img
                    max-height="190"
                    max-width="190"
                    src="/icons/nodata.svg"
                    class="img-center"
                  ></v-img>
                  <h5 class="mt-4 red--text">{{ $t("coffeeData.notFound") }}</h5>
                  <p class="text-caption black--text">
                    Please create coffee data using the <br />
                    button ”ADD NEW” above
                  </p>
                </v-col>
              </v-row>
            </div>
  
            <div>
              <v-data-table
                :headers="tree == 'cacaoVariety'? speciesheaders : headers"
                :items="cacaoData"
                :items-per-page="10"
                :footer-props="{
                  'items-per-page-options': [10, 25, 50],
                }"
                hide-default-footer
                :loading="treeTypesLoading"
                :page.sync="page" 
                loading-text="Loading Cacao Data..."
              >
                <template v-slot:top="{}">
                  <div class="d-flex mt-5">
                    <h5 class="mt-3 mr-1">{{ $t('dashboardSection.cacaoData') }}</h5>
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
                    <!-- <v-btn
                      color="primary"
                      depressed
                      @click="openCreateTree"
                      class="mx-2"
                      >ADD NEW</v-btn
                    > -->
                    <CreateCacaoTree
                      :treeType="tree"
                      :title="createTitle"
                      v-if="createTreeDialog"
                      @close-modal="closeTreeModal"
                      :dialog="createTreeDialog"
                    />
                    <div class="py-1 title">
                      {{ from }} - {{ to }} {{ $t('of') }} {{ totalTrees}}
                    </div>
                    <v-btn
                      class="mx-2"
                      fab
                      small
                      outlined
                      color="primary"
                      :disabled="page <= 1"
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
                      :disabled="page >= totalPages"
                      @click="pageChange(true)"
                    >
                      <v-icon dark>
                        mdi-chevron-right
                      </v-icon>
                    </v-btn>
                  </div>
                </template>
                <template v-if="cacaoData.length" v-slot:body="{ items }">
                  <tbody>
                    <tr
                      v-for="item in items"
                      :key="item.id"
                      style="position: relative; width: 0; height: 0"
                      @mouseover="selectItem(item)"
                      @mouseleave="selectItem(false)"
                    >
                      <td>{{ item.name }}</td>
                       <td v-if="tree == 'cacaoVariety' && item.CacaoSpecy.name">
                        {{ item.CacaoSpecy.name }} 
                      </td> 
                      <td class="text-truncate">
                        {{ getDateFormat(item.createdAt) || "N/A" }}
                      </td>
                      <td class="text-center">
                        {{ item.status ? $t('active') : $t('inactive') }}
                      </td>
                      <div
                        style="position: absolute; right: 10px; top:5px;"
                        v-if="item === selectedItem"
                      >
                      <!-- v-if="getModulePermittedActions.put" -->
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              x-small
                              fab
                              v-bind="attrs"
                              v-on="on"
                              @click="editCacaoData(item)"
                            >
                              <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                          </template>
                          <span>{{ $t('edit') }}</span>
                        </v-tooltip>

                        <!-- v-if="getModulePermittedActions.delete" -->
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              x-small
                              fab
                              v-bind="attrs"
                              v-on="on"
                              class="ml-2"
                              @click="deleteCacaoData(item)"
                            >
                              <v-icon>mdi-trash-can-outline</v-icon>
                            </v-btn>
                          </template>
                          <span>{{ $t('delete') }}</span>
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

      <EditCacaoTreeData
        v-if="showEditCacaoData"
        :editedData="editedCacaoData"
        :treeType="tree"
        :title="createTitle"
        @close-modal="closeTreeModal"
        :dialog="showEditCacaoData"
      />

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
  import CreateCacaoTree from "./CreateCacaoTree.vue";
  import loadingMixin from "@/mixins/LoadingMixin";
  import moment from "moment";
  import ConfirmBox from "@/components/ConfirmBox";
  import EditCacaoTreeData from "./EditCacaoTreeData.vue"
  import getPermittedActions from "@/mixins/GetPermittedActions";
  import CacaoDataService from "@/_services/CacaoDataService.js";
  
  export default {
    created() {
      this.tree = this.trees[0].val  
      const fetchData = async () => {
        await this.getTreeTypes();
      };
      fetchData();
    },
    components: {
      ConfirmBox,
      CreateCacaoTree,
      EditCacaoTreeData
    },
    watch: {
      options: {
        handler() {
          this.getTreeTypes();
        },
        deep: true,
      },
    },
    data() {
      return {
        page: 1,
        createTreeDialog: false,
        trees: [
          { text: this.$t("coffeeData.windBreaker"), val: "windBreaker" },
          { text: this.$t("coffeeData.horticultureInfo"), val: "horticultureInfo" },
          { text: this.$t("coffeeData.shadeTree"), val: "shadeTree" },
          { text: this.$t("cacaoData.cacaoVariety"), val: "cacaoVariety" },
          { text: this.$t("cacaoData.cacaoSpecies"), val: "cacaoSpecies"}
        ],
        createTitle: "",
        tree: null,
        confirm: false,
        confirmElements: {
          title: this.$t("cacaoData.deleteCacaoData"),
          message: this.$t("coffeeData.deleteCoffeeRecord"),
          confirmBtnText: this.$t("delete"),
          cancelBtnText: this.$t("cancel"),
          confirmData: {},
        },
        editedCacaoData: {},
        showEditCacaoData: false,
        tab: 0,
        selectedItem: false,
        options: {},
        loading: false,
        treeTypesLoading: false,
        search: "",
        from: 0,
        to: 0,
        totalPages: 1,
        cacaoData: [],
        totalTrees: 0,
        headers: [
          {
            text: this.$t("name"),
            align: "start",
            value: "name",
            class: "black--text",
            sortable: true,
          },
          {
            text: this.$t("date"),
            value: "name",
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
        speciesheaders: [
          {
            text: this.$t("name"),
            align: "start",
            value: "name",
            class: "black--text",
            sortable: true,
          },
          {
            text: "Species",
            align: "start",
            value: "CoffeeVariety.name",
            class: "black--text",
            sortable: true,
          },
          {
            text: this.$t("date"),
            value: "name",
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
            text: this.$t("dashboardSection.cacaoData"),
            disabled: true,
            href: "breadcrumbs_link_1",
          },
        ],
      };
    },
    methods: {
      getDateFormat(date) {
        return moment(date).format("DD-MMM-YYYY");
      },
      async confirmDeactivate(res, data) {
        if (res) {
          this.startLoading();
          CacaoDataService.deleteCacaoTreeType(this.tree, data.id).then(() => {
            this.$notify({
              title: 'Tree data deleted successfully',
              type: "success",
            });
            this.confirm = false;
            this.getTreeTypes();
            this.stopLoading();
          }).catch(()=> {
            this.$notify({
              title: this.$t('errors.somethingWentWrong'),
              type: "success",
            });
            this.confirm = false;
            this.stopLoading();
          });
        } else {
          this.confirm = false;
        }
      },

      deleteCacaoData(data) {
        this.confirmElements.confirmData = data;
        this.confirm = true;
      },

      async getTreeTypes() {
        this.treeTypesLoading = true;
        try {
          const response = await CacaoDataService.getCacaoTreeData(this.tree);
          if (response.code === 200) {
            this.cacaoData = response.data.rows;
            this.totalTrees = response.data.count;
            this.totalPages = Math.ceil(this.totalTrees / 10)
            this.setPages()
            this.treeTypesLoading = false;
          } else {
            this.treeTypesLoading = false;
          }
        } catch (err) {
          this.cacaoData = [];
          this.from = 0;
          this.to = 0;
          this.totalTrees = 0;
          this.treeTypesLoading = false;
        }
      },
      selectItem(item) {
        this.selectedItem = item;
      },
      
      async goToTree(){
        this.cacaoData = []
        await this.getTreeTypes()
      },
      
      pageChange(t) {
        if (this.page > this.totalPages) {
            this.page = this.totalPages
            return;
        }
        if (t)
            this.page = this.page + 1
        else
            this.page = this.page - 1
        this.setPages();
      },
      editCacaoData(data) {
        this.createTitle = `Update ${this.trees.filter(item => item.val === this.tree)[0].text}`;
        this.editedCacaoData = data;
        this.showEditCacaoData = true;
      },
      openCreateTree() {
        this.createTitle = `${this.$t('addNewS')} ${this.trees.filter(item => item.val === this.tree)[0].text}`;
        this.createTreeDialog = true;  
      },
      closeTreeModal(suc) {
        if (suc === true) {
          this.getTreeTypes();
        }
        this.showEditCacaoData = false;
        this.createTreeDialog = false;
      },
      setPages() {
        if (this.totalTrees < 1) {
            this.from = 0;
            this.to = 0;
            return
        }
        var s = this.totalTrees % 10;
        var t = (this.page * 10)
  
        if (t > this.totalTrees) {
            this.to = this.totalTrees;
            this.from = this.to - (s - 1);
        } else {
            this.to = t;
            this.from = this.to - 9;
        }
      },
    },
    mixins: [loadingMixin, getPermittedActions],
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
  </style>
  