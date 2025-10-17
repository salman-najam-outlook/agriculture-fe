<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-4">
        <h2>{{ $t('dashboardSection.coffeeData') }}</h2>
        <v-spacer></v-spacer>
         <v-btn
            color="primary"
            depressed
            @click="openCreateTree"
            class="mx-2"
            v-if="getModulePermittedActions.post"
            >{{ $t('addNew') }}</v-btn
          >
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
          <div v-if="!coffeeData" class="text-center" style="padding-top:5%">
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

          <div v-if="coffeeData">
            <v-data-table
              :headers="tree == 'coffeeVariety'? speciesheaders : headers"
              :items="coffeeData"
              :items-per-page="10"
              :footer-props="{
                'items-per-page-options': [10, 25, 50],
              }"
              hide-default-footer
              :loading="treeTypesLoading"
              :page.sync="page" 
              loading-text="Loading coffeeData..."
            >
              <template v-slot:top="{}">
                <div class="d-flex mt-5">
                  <h5 class="mt-3 mr-1">{{ $t('dashboardSection.coffeeData') }}</h5>
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
                  <CreateCoffeeTree
                    :treeType="tree === 'coffeeSpecies' ? 'coffeeVariety' : tree"
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
              <template v-if="coffeeData" v-slot:body="{ items }">
                <tbody>
                  <tr
                    v-for="item in items"
                    :key="item.id"
                    style="position: relative; width: 0; height: 0"
                    @mouseover="selectItem(item)"
                    @mouseleave="selectItem(false)"
                  >
                    <td>{{ item.name }}</td>
                    <td v-if="tree == 'coffeeVariety'">{{ item.CoffeeVariety.name }}</td>
                    <td class="text-truncate">
                      {{ getDateFormat(item.createdAt) || "N/A" }}
                    </td>
                    <td class="text-center">
                      {{ item.status ? 'Active' : "Inactive" }}
                    </td>
                    <div
                      style="position: absolute; right: 10px; top:5px;"
                      v-if="item === selectedItem"
                    >
                      <v-tooltip bottom v-if="getModulePermittedActions.put">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            x-small
                            fab
                            v-bind="attrs"
                            v-on="on"
                            @click="editCoffeeData(item)"
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                        </template>
                        <span>{{ $t('edit') }}</span>
                      </v-tooltip>
                      <v-tooltip bottom  v-if="getModulePermittedActions.delete">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            x-small
                            fab
                            v-bind="attrs"
                            v-on="on"
                            class="ml-2"
                            @click="deleteCoffeeData(item)"
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
    <EditCoffeeTree
      v-if="showEditCoffeeData"
      :editedData="editedCoffeeData"
      :treeType="tree === 'coffeeSpecies' ? 'coffeeVariety' : tree"
      :title="createTitle"
      @close-modal="closeTreeModal"
      :dialog="showEditCoffeeData"
    />
    <CreateCoffeeSpecies v-if="createSpeciesDialog" @close-modal="closeSpeciesModal" :dialog="createSpeciesDialog"/>
    <EditCoffeeSpecies v-if="showEditSpecie" :editedData="editedCoffeeData" @close-modal="closeSpeciesModal" :dialog="showEditSpecie"/>
    <confirm-box
      :title="confirmElements.title"
      :message="confirmElements.message"
      :cancelBtnText="confirmElements.cancelBtnText"
      :confirmBtnText="confirmElements.confirmBtnText"
      :confirmData="confirmElements.confirmData"
      :dialog="confirm"
      @continue:action="confirmDeactivate"
    ></confirm-box>
  </div>
</template>
<script>
import CreateCoffeeTree from "./CreateCoffeeTree.vue";
import CreateCoffeeSpecies from "./CreateCoffeeSpecies.vue"
import loadingMixin from "@/mixins/LoadingMixin";
import moment from "moment";
import ConfirmBox from "@/components/ConfirmBox";
import EditCoffeeTree from "./EditCoffeeTree.vue";
import EditCoffeeSpecies from "./EditCoffeeSpecies.vue"
import getPermittedActions from "@/mixins/GetPermittedActions";
import { mapGetters } from "vuex";

import CoffeeService from "@/_services/CoffeeService.js";

export default {
  created() {
    if (!this.$route.params.tree)
      this.$router.push({
        name: "CoffeeData",
        params: { tree: this.trees[0].val },
      });
    else this.tree = this.$route.params.tree;

    const fetchData = async () => {
      await this.getTreeTypes();
    };
    fetchData();
  },
  components: {
    CreateCoffeeTree,
    EditCoffeeTree,
    ConfirmBox,
    CreateCoffeeSpecies,
    EditCoffeeSpecies
  },
  watch: {
    options: {
      handler() {
        this.getTreeTypes();
      },
      deep: true,
    },
    "$route.params.tree": {
      handler(v) {
        this.tree = v;
      },
      deep: true,
    },
    tree: {
      handler() {
        this.getTreeTypes();
      },
      deep: true,
    },
  },
  data() {
    return {
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
      options: {},
      loading: false,
      treeTypesLoading: false,
      search: "",
      from: 0,
      to: 0,
      totalPages: 1,
      coffeeData: [],
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
          text: this.$t("dashboardSection.coffeeData"),
          disabled: true,
          href: "breadcrumbs_link_1",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(['isSubEnterprise']),
    getOrganizationId() {
      return this.$store.getters.getUser?.user_organization?.id;
    },
    getSubOrganizationId() {
      return this.$store.getters.getUser?.user_organization?.subOrganizationId;
    },
  },
  methods: {
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
        const response = await CoffeeService.deleteTreeType(treeType, data.id);
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
      this.treeTypesLoading = true;
      try {
        let treeType = '';
        if (this.tree === 'coffeeSpecies') {
          treeType = 'coffeeVariety'
        } else if (this.tree === 'coffeeVariety') {
          treeType = 'coffeeSpecies'
        } else {
          treeType = this.tree
        }
        
        // Pass organization and sub-organization parameters for filtering
        const d = await CoffeeService.getTreeData(
          treeType, 
          this.getOrganizationId, 
          this.isSubEnterprise ? this.getSubOrganizationId : null
        );
        
        if (d.code === 200) {
          this.coffeeData = d.data.rows;
          this.totalTrees = d.data.count;
          // this.totalPages = Math.ceil(
          //   this.totalTrees / this.options.itemsPerPage
          // );
          this.totalPages = Math.ceil(this.totalTrees / 10)
          this.setPages()
          // this.from = (this.options.page - 1) * this.options.itemsPerPage + 1;
          // this.to =
          //   this.options.page * this.options.itemsPerPage -
          //   (this.options.itemsPerPage - d.data.length);
          this.treeTypesLoading = false;
        } else {
          this.treeTypesLoading = false;
        }
      } catch (err) {
        this.coffeeData = [];
        this.from = 0;
        this.to = 0;
        this.totalTrees = 0;
        this.treeTypesLoading = false;
      }
    },
    selectItem(item) {
      this.selectedItem = item;
    },

    // pageChange(t) {
    //   if (t) this.options.page += 1;
    //   else this.options.page -= 1;
    // this.getTreeTypes();
    // },
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

    editCoffeeData(data) {
      this.createTitle = `${this.$t("update")} ${this.trees.filter(item => item.val === this.tree)[0].text}`;
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
      this.createTitle = `${this.$t('addNewS')} ${this.trees.filter(item => item.val === this.tree)[0].text}`;
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
  closeSpeciesModal(suc){
      if(suc === true) {
          this.getTreeTypes()
      }
          
      this.createSpeciesDialog = false
      this.showEditSpecie = false
  }
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
