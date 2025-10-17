<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-4">
        <h2>{{ $t("blends.blends") }}</h2>
        <v-spacer></v-spacer>
        <v-btn v-if="isOwner" color="primary" dark class="mr-2 mb-2" @click="handleBlendSettings">
          {{ $t("blends.blendSetting") }}
        </v-btn>

        <v-btn v-if="isOwner" color="primary" dark class="mr-2 mb-2" @click="handleCreateDds">
          {{ $t("blends.createBlendDds") }}
        </v-btn>
      </div>
      <v-card elevation="0" class="px-5 mt-7">
        <v-card-text>
          <v-row style="margin-left:-30px; margin-bottom: 20px; margin-top: 15px;">
            <v-col cols="12">
              <v-data-table :headers="tableHeaders" :items="blends" :items-per-page="10" :footer-props="{
                'items-per-page-options': [5, 10, 25, 50],
              }" item-key="id" hide-default-footer :loading="loading" :options.sync="options"
                :server-items-length="totalBlendsLists" :loading-text="$t('loadingData')
                  ">
                <template v-slot:top="{}">
                  <div class="d-flex mt-5">

                    <div class="ml-3" style="width: 220px;">
                      <label for="text" >&nbsp;</label>
                      <v-text-field style="width: 280px; margin-top: 3px; " prepend-inner-icon="mdi-magnify" outlined height="5px"
                        :placeholder="$t('blends.searchBlend')" dense v-model="search" @input="searchQuery"
                        class="shrink">
                      </v-text-field>
                    </div>

                    <div class="ml-3" style="width: 250px;">
                      <label for="text">{{ $t("blends.country") }}</label>
                      <v-tooltip top color="00BD73" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                            mdi-alert-circle
                          </v-icon>
                        </template>
                        <span>{{ $t("blends.countryTT") }}</span>
                      </v-tooltip>
                      <v-autocomplete style="width: 250px; " v-model="countryModel" item-text="name" item-value="name"
                        :items="countries" :placeholder="$t('blends.blendSettings.selectCountry')" @change="filterData"
                        outlined dense clearable>
                      </v-autocomplete>
                    </div>

                    <div class="ml-3" style="width: 250px;">
                      <label for="text">{{ $t('blends.edurDueDeligenceStatus') }}</label>
                      <v-tooltip top color="00BD73" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                            mdi-alert-circle
                          </v-icon>
                        </template>
                        <span>{{ $t("blends.EUDRDeforestationStatusTT") }}</span>
                      </v-tooltip>
                      <v-autocomplete clearable style="width: 250px;" :placeholder="$t('select')" v-model="blendStatus" item-text="name" item-value="value"
                        :items="allStatus" @change="filterData" outlined dense>
                      </v-autocomplete>
                    </div>

                    <v-spacer></v-spacer>
                    <div class="py-1 title">
                      {{ fromBlendsList }} -
                      {{ toBlendsList }} {{ $t('of') }}
                      {{ totalBlendsLists }}
                    </div>
                    <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page <= 1"
                      @click="reportPageChange(false)">
                      <v-icon dark>
                        mdi-chevron-left
                      </v-icon>
                    </v-btn>
                    <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page >= totalPages"
                      @click="reportPageChange(true)">
                      <v-icon dark>
                        mdi-chevron-right
                      </v-icon>
                    </v-btn>
                    <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" left :min-width="417">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn class="mx-2" fab small outlined color="primary" v-bind="attrs" v-on="on">
                          <v-icon dark>mdi-cog-outline </v-icon>
                        </v-btn>
                      </template>
                      <v-card width="417">
                        <v-list>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>{{ $t("deforestation.customization")
                                }}</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                          <v-divider></v-divider>
                          <div class="pl-3 pt-2 font-weight-normal">
                            {{ $t("deforestation.recordsPerpage") }}
                          </div>
                          <v-list-item>
                            <v-list-item-content>
                              <v-slider v-model="itemsPerPageSlider" :tick-labels="itemsPerPageOptions" :max="3"
                                step="1" ticks="always" tick-size="4"></v-slider>
                            </v-list-item-content>
                          </v-list-item>
                          <v-divider class="mt-n3"></v-divider>
                        </v-list>
                        <v-card-text>
                          <v-container fluid>
                            <v-row>
                              <v-col class="mt-n9" cols="6" v-for="header in headers" :key="header.value">
                                <v-checkbox v-if="header.text" v-model="selectedHeaders" :label="header.text"
                                  color="primary" :value="header.text" hide-details
                                  :disabled="header.text == 'ID'"></v-checkbox>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-card-text>
                        <v-layout justify-center>
                          <v-card-actions class="mb-5">
                            <v-spacer></v-spacer>

                            <v-btn outlined color="primary" @click="resetDefaut" width="190">
                              <span class="text-truncate" style="max-width:150px">{{ $t("deforestation.restoreDefault")
                                }}</span>
                            </v-btn>
                            <v-btn color="primary" @click="resetTableStructure" width="190">
                              {{ $t("deforestation.apply") }}
                            </v-btn>
                          </v-card-actions>
                        </v-layout>
                      </v-card>
                    </v-menu>

                    <v-tooltip top color="black" max-width="350">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn class="mx-2" fab small outlined color="primary" v-bind="attrs" v-on="on"
                          @click="exportToPDF">
                          <v-icon dark> mdi-download </v-icon>
                        </v-btn>
                      </template>

                      <span>
                        {{ $t("deforestation.download") }}
                      </span>
                    </v-tooltip>
                    <v-tooltip top color="black" max-width="350">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn class="mx-2" fab small outlined color="primary" v-bind="attrs" v-on="on"
                          @click="printPDF('document')">
                          <v-icon dark> mdi-printer </v-icon>
                        </v-btn>
                      </template>
                      <span>

                        {{ $t("deforestation.print") }}
                      </span>
                    </v-tooltip>
                  </div>
                </template>
                <template v-if="blends.length" v-slot:body="{ items }">
                  <tbody>
                    <tr v-for="item in items" :key="item.id" style="position: relative; width: 0; height: 0"
                      @mouseover="selectItem(item)" @mouseleave="selectItem(false)">
                      <template v-for="h in tableHeaders">

                        <td class="text-truncate" :key="h.value + '_eudrAndInternalRefNo'"
                          v-if="h.value == 'eudrAndInternalRefNo'">
                          {{ item?.eudrReferenceNumber ? item.eudrReferenceNumber : '-' }}
                          <br />
                          {{ item?.internalReferenceNumber ? item.internalReferenceNumber : '-' }}
                        </td>

                        <td class="text-truncate" :key="h.value + '_finalProduct'"
                          v-else-if="h.value == 'finalProduct'">
                          {{ item.name ? item.name : "-"  }} <br />
                          {{ item.blendLotId ? item.blendLotId : "-" }}
                        </td>

                        <td class="text-truncate" :key="h.value + '_noOfIngredients'"
                          v-else-if="h.value == 'noOfIngredients'">
                          {{ item.numberOfIngredients? item.numberOfIngredients : "-" }}
                        </td>

                        <td class="text-truncate" :key="h.value + '_productionPlaceCount'"
                          v-else-if="h.value == 'productionPlaceCount'">
                          {{ item?.totalFarmCount ? item.totalFarmCount : 0 }} {{ $t("blends.blendSettings.farms") }}
                          <br />
                          {{ !isNaN(item.totalNetMass) ? parseFloat(getConvertedMass(item.totalNetMass)) : 0 }} {{
                            eudrSettings?.product_mass_unit }}
                        </td>

                        <v-tooltip bottom v-else-if="h.value == 'countryOfEntry'" :key="h.value + '_countryOfEntry'">
                          <template v-slot:activator="{ on, attrs }">
                            <td class="text-truncate" :style="{ maxWidth: '300px' }" v-bind="attrs" v-on="on">
                              {{ Array.isArray(item.countryOfEntry) ? item.countryOfEntry.join(', ') :
                              item.countryOfEntry }}
                            </td>
                          </template>
                          <span>
                            {{ Array.isArray(item.countryOfEntry) ? item.countryOfEntry.join(', ') : item.countryOfEntry
                            }}
                          </span>
                        </v-tooltip>

                        <td class="text-truncate" :key="h.value + '_blendStatus'"
                          v-else-if="h.value == 'blendStatus'">
                          <v-btn small rounded min-width="200" depressed class="gray-button" height="40"
                              v-if="item.blendStatus === 'pending'">
                              {{ $t("blends.pending") }}
                          </v-btn>
                          <v-btn small rounded min-width="200" depressed class="green-button" height="40"
                              v-else-if="item.blendStatus === 'compliant'">
                              {{ $t("blends.compliant") }}
                          </v-btn>
                          <v-btn small rounded min-width="200" depressed class="red-button" height="40"
                              v-else-if="item.blendStatus === 'non-compliant'">
                              {{ $t("blends.nonCompliant") }}
                          </v-btn>
                          <v-btn small rounded min-width="200" depressed class="blue-button" height="40"
                              v-else-if="item.blendStatus === 'uploaded-to-eu-portal'">
                              {{ $t("blends.uploadedToEU") }}
                          </v-btn>
                        </td>
                        <td :key="h.value + '_action'" v-else-if="h.value == 'action'">
                          <div style="position: absolute; right: 10px; top:10px;">
                            <v-menu location="start">
                              <template v-slot:activator="{ on, attrs }">
                                <v-btn icon v-bind="attrs" v-on="on">
                                  <v-icon>mdi-dots-vertical</v-icon>
                                </v-btn>
                              </template>

                              <v-list>

                                <v-list-item @click="redirectToDDSSummary(item)">
                                  <v-list-item-title>{{ $t('blends.viewReport') }}</v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="duplicateBlend(item.id)">
                                  <v-list-item-title>{{ $t('blends.copyAndCreateNew') }}</v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="deleteBlends(item.id)">
                                  <v-list-item-title>{{ $t('blends.remove') }}</v-list-item-title>
                                </v-list-item>
                              </v-list>
                            </v-menu>
                          </div>
                        </td>
                      </template>
                    </tr>
                  </tbody>
                </template>

                <template v-slot:footer></template>
              </v-data-table>

            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>

    <ConfirmBox :title="confirmDelete.title" :message="confirmDelete.message"
      :cancelBtnText="confirmDelete.cancelBtnText" :confirmBtnText="confirmDelete.confirmBtnText"
      :confirmData="confirmDelete.confirmData" :dialog="confirmDeleteDialog"
      @cancel:action="confirmDeleteDialog = false" @continue:action="confirmDeleteBlend" />
  </div>


</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import download from "@/mixins/DownloadMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import DateMixin from "@/mixins/DateMixin";
import BlendService from "@/_services/BlendService";
import { getCountries } from "country-state-picker";
import html2pdf from "html2pdf.js";
import printJS from "print-js";
import ConfirmBox from "@/components/ConfirmBox";
import moment from 'moment';
import UnitService from "@/_services/UnitService";
import RoleMixin from "@/mixins/RoleMixin";
import { mapGetters } from "vuex";

export default {
  components: {
    ConfirmBox,
  },
  created() {
    this.getBlends();
  },
  async mounted() {
    this.tableHeaders = this.headers;
    this.selectedHeaders = this.allSelectedHeaders;
  },
  watch: {
    options: {
      handler(opt) {
        this.getBlends(opt);
      },
      deep: true,
    },
  },
  computed: {
    ...mapGetters("eudrSettings", ["get_EUDR_Settings"]),
    isOwner() {
      return this.getCurrentRoles.some(x => ["operator_owner", "supplier_owner"].includes(x))
    },
    getOrganizationId() {
      return this.$store.getters.getUser?.user_organization?.id;
    },
    reportHeaders() {
      return this.headers.filter(header => this.selectedHeaders.includes(header.text));
    },
    totalPages() {
      return parseInt(Math.ceil(this.totalBlendsLists / 10))
    },
    eudrSettings() {
      return this.get_EUDR_Settings;
    },
  },
  data() {
    return {
      debounceTimer: null,
      fromBlendsList: 0,
      toBlendsList: 0,
      search: "",
      countryModel: "",
      blendStatus: "",
      countries: [...getCountries()],
      copyReport: [],
      loading: true,
      selectedItem: false,
      options: {
        limit: 10,
        page: 1,
      },
      headers: [
        {
          text: this.$t("blends.eudrRefNo"),
          align: "start",
          value: "eudrAndInternalRefNo",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("blends.finalProduct"),
          align: "start",
          value: "finalProduct",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("blends.noOfIngredients"),
          align: "start",
          value: "noOfIngredients",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("blends.farmsAndQuantity"),
          align: "start",
          value: "productionPlaceCount",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("blends.country"),
          align: "start",
          value: "countryOfEntry",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("blends.createBlends.table.dueDiligenceStatus"),
          align: "start",
          value: "blendStatus",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("blends.actions"),
          align: "center",
          value: "action",
          class: "black--text",
          sortable: false,
        },
      ],
      allSelectedHeaders: [
        this.$t('blends.eudrRefNo'),
        this.$t('blends.finalProduct'),
        this.$t('blends.noOfIngredients'),
        this.$t("blends.farmsAndQuantity"),
        this.$t("blends.country"),
        this.$t("blends.createBlends.table.dueDiligenceStatus"),
        this.$t("blends.actions"),
      ],
      menu: false,
      breadcrumbs: [
        {
            text: this.$t("blends.eudrDueDiligence"),
            disabled: false,
            exact: true,
        },
        {
          text: this.$t("blends.blends"),
          disabled: true,
          href: "breadcrumbs_link_1",
        },
      ],
      blends: [],
      totalBlendsLists: 0,
      totalBlendPages: 0,
      showActionsColumn: true,
      customizeMenu: false,
      customizeMenuAll: false,
      itemsPerPageOptions: [5, 10, 25, 50],
      itemsPerPageSlider: 1,
      selectedHeaders: [],
      tableHeaders: [],
      hideOnPrint: false,
      confirmDeleteDialog: false,
      confirmDelete: {
        title: this.$t("blends.confirmDialog.delete.title"),
        message: this.$t("blends.confirmDialog.delete.message"),
        confirmBtnText: this.$t("blends.confirmDialog.delete.confirmBtn"),
        cancelBtnText: this.$t("cancel"),
        confirmData: {},
      },
      allStatus: [
         {
          name: this.$t("blends.uploadedToEU"),
          value: "uploaded-to-eu-portal",
        },
        { name: this.$t("blends.pending"), value: "pending" },
        { name: this.$t("blends.nonCompliant"), value: "non-compliant" },
        { name: this.$t("blends.compliant"), value: "compliant" },
      ],
    };
  },
  methods: {
    async exportToPDF() {
      const requestParams = {
        page: this.options.page,
        limit: this.options.limit,
        search: this.search,
        searchByCountry: this.countryModel,
      };
      const querys = new URLSearchParams(requestParams).toString();
      const token = this.$store.state.auth.token
      this.startLoading()
      const url = process.env.VUE_APP_DEFORESTRATION_API_BASE_URL || "https://cf-deforestation.dimitra.dev/graphql"
      this.downloadSourceFileWithToken(`${url}/blends/pdf?${querys}`, "application/pdf", token, "blends.pdf")
        .then(() => {
          this.stopLoading()
        }).catch(() => {
          this.stopLoading()
        })
    },
    getConvertedMass(value) {
      return this.eudrSettings && UnitService.fromBase.weight(this.eudrSettings.product_mass_unit, value)
    },

    async printPDF() {
      this.showActionsColumn = false;
      this.hideOnPrint = true;
      await this.$nextTick();
      const element = document.querySelector(".v-data-table__wrapper");
      let opt = {
        margin: 1,
        filename: "BlendList.pdf",
        image: { type: "jpeg", quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
      };

      let worker = await html2pdf()
        .set(opt)
        .from(element)
        .toCanvas()
        .outputPdf("blob", "Blend.pdf");
      let file = new File([worker], "Blend.pdf", {
        type: "application/pdf",
      });
      var pdfUrl = await URL.createObjectURL(file);
      await printJS({ printable: `${pdfUrl}`, type: "pdf", showModal: true });

      this.showActionsColumn = true; // restore the column;
      this.hideOnPrint = false;
    },
    async resetDefaut() {
      this.tableHeaders = this.headers;
      this.selectedHeaders = this.allSelectedHeaders;
      this.menu = false;
      await this.getBlends();
    },

    async resetTableStructure() {
      this.tableHeaders = this.headers.filter((header) =>
        this.selectedHeaders.includes(header.text)
      );
      this.options.limit = this.itemsPerPageOptions[
        this.itemsPerPageSlider
      ];
      await this.getBlends();
      (this.customizeMenu = false), (this.customizeMenuAll = false);
    },

    getDateFormat(date) {
      return moment(date).format("DD/MM/YYYY");
    },

    redirectToDDSSummary(item) {
      const { id, blendStatus } = item;

      if (blendStatus === 'pending') {
        this.$router.push({
          name: 'createBlend',
          params: { id },
        });
      } else {
        this.$router.push({
          name: 'finalReport',
          params: { id }, 
        });
      }
    },

    handleCreateDds() {
      this.$router.push({ name: 'createBlend' })
    },
    handleBlendSettings() {

      this.$router.push({ name: 'blendSettings' })
    },
    filterData() {
      this.options.page = 1;
      this.getBlends();
    },
    searchQuery() {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => {
        this.options.page = 1;
        this.getBlends();
      }, 500)
    },
    async getBlends(opt = null) {
      this.loading = true;
      const requestParams = {
        page: this.options.page || 1,
        limit: this.options.limit || 10,
        search: this.search || null,
        searchByCountry: this.countryModel || null,
        blendStatus: this.blendStatus || null,
      };

      if (opt?.sortBy?.length) {
        requestParams.orderField = opt.sortBy[0];
        requestParams.order = opt.sortDesc[0] ? "DESC" : "ASC";
      }

      BlendService.listBlends(requestParams)
        .then((res) => {
          this.blends = res.data.findAllBlends.rows;
          this.totalBlendsLists = res.data.findAllBlends.totalCount;
          this.totalBlendPages = Math.ceil(this.totalBlendsLists / this.options.limit)

          this.fromBlendsList = this.totalBlendsLists > 0
            ? (this.options.page - 1) * this.options.limit + 1
            : 0;
          this.toBlendsList = this.options.page * this.options.limit > this.totalBlendsLists
            ? this.totalBlendsLists
            : this.options.page * this.options.limit

          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          console.log("Error", err);
        });
    },
    async deleteBlends(id) {
      this.confirmDelete.confirmData = { id };
      this.confirmDeleteDialog = true;
    },
    async confirmDeleteBlend(action, confirmData) {
      this.loading = true;
      this.confirmDeleteDialog = false;
      BlendService.deleteBlend(parseInt(confirmData.id))
        .then(() => {
          this.getBlends();
          this.$notify({
            text: this.$t("blends.reportDeletedSuccessfully"),
            type: "success",
          });
          this.loading = false;

        })
        .catch((err) => {
          this.loading = false;
          this.$notify({
            text: err,
            type: "error",
          });
          console.log("Error", err);
        });
    },

    async duplicateBlend(id) {
      this.loading = true;
      BlendService.duplicateBlend(parseInt(id))
        .then(() => {
          this.loading = false;
          this.getBlends();
          this.$notify({
            text: this.$t("blends.blendDuplicatedSuccessfully"),
            type: "success",
          });
        })
        .catch((err) => {
          this.loading = false;
          this.$notify({
            text: err,
            type: "error",
          });
          console.log("Error", err);
        })
    },

    selectItem(item) {
      this.selectedItem = item;
    },
    resetSearchOnEmpty() {
      this.search = "";
      this.countryModel = "";
      this.options = {
        page: 1,
        limit: 10,
      };
      this.getBlends();
    },
    reportPageChange(t) {
      if (t) this.options.page = this.options.page + 1;
      else this.options.page = this.options.page - 1;
      this.getBlends();
    },
  },
  mixins: [loadingMixin, download, getPermittedActions, DateMixin, RoleMixin],
};
</script>


<style lang="scss" scoped>
.blue-button {
  background-color: #d0e6fe !important;
  /* Green background */
  border: 2px solid #002287 !important;
  /* Red border */
  color: #002287 !important;
}

.orange-button {
  background-color: #fff7ec !important;
  /* Green background */
  border: 2px solid #ffa826 !important;
  /* Red border */
  color: #ffa826 !important;
}

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

.gray-button {
  background-color: #e8e8e8 !important;
  /* Green background */
  border: 2px solid #000000 !important;
  /* Red border */
  color: #000000 !important;
}
</style>