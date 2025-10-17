<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-8">
        <h2>{{ $t("dueDiligence.listOfSupplier") }}</h2>
        <v-spacer></v-spacer>
        <div class="d-flex mt-1">
          <v-btn
            color="primary"
            dark
            class="mr-2"
            @click="addNewSuppliers = true"
          >
            {{ $t("dueDiligence.addNewSupplier") }}
          </v-btn>
        </div>
      </div>
      <v-card elevation="0" class="px-5 mt-4">
        <div class="pa-4">
          <v-data-table
            :headers="filteredHeaders"
            :items="suppliers"
            item-key="id"
            :items-per-page="this.options.itemsPerPage"
            :footer-props="{
              'items-per-page-options':itemsPerPageOptions,
            }"
            hide-default-footer
            :loading="loading"
            :options.sync="options"
            :loading-text="$t('loadingData')"
          >
            <template v-slot:top="{}">
              <div class="d-flex mt-5">
                <div class="srch mr-2">
                  <label> {{ $t("search") }} </label> &nbsp;
                  <!-- <v-text-field
                    prepend-inner-icon="mdi-magnify"
                    outlined
                    height="5px"
                    :placeholder="$t('search')"
                    dense
                    v-model="search"
                    @keyup.enter="searchQuery"
                    class="shrink"
                  >
                  </v-text-field> -->
                   <v-text-field
      prepend-inner-icon="mdi-magnify"
      outlined
      height="5px"
      :placeholder="$t('search')"
      dense
      v-model="search"
      @input="debouncedSearchQuery"
      class="shrink"
    >
    </v-text-field>
                </div>

                <div>
                  <label> {{ $t("country") }} </label> &nbsp;
                  <v-autocomplete
                    :items="countries"
                    item-value="name"
                    item-text="name"
                    dense
                    outlined
                    :placeholder="$t('deforestation.allCountries')"
                    v-model="payload.countryId"
                    style="max-width:275px"
                    @input="onCountryInput"
                    class="mr-5"
                    clearable
                  ></v-autocomplete>
                </div>
                <v-spacer></v-spacer>
                <div class="py-1 title">
                  {{ from }} - {{ to }} {{ $t('of') }} {{ totalSuppliers }}
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

                <v-menu
                  v-model="document"
                  :close-on-content-click="false"
                  :nudge-width="200"
                  left
                  :min-width="417"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      class="mx-2"
                      fab
                      small
                      outlined
                      color="primary"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon dark> mdi-cog-outline </v-icon>
                    </v-btn>
                  </template>

                  <v-card width="417">
                    <v-list>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>{{
                            $t("deforestation.customization")
                          }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider></v-divider>
                      <div class="pl-3 pt-2 font-weight-normal">
                        {{ $t("deforestation.recordsPerpage") }}
                      </div>
                      <v-list-item>
                        <v-list-item-content>
                          <v-slider
                            v-model="itemsPerPageSlider"
                            :tick-labels="itemsPerPageOptions"
                            :max="3"
                            step="1"
                            ticks="always"
                            tick-size="4"
                          ></v-slider>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider class="mt-n3"></v-divider>
                    </v-list>
                    <v-card-text>
                      <v-container fluid>
                        <v-row>
                          <v-col
                            class="mt-n9"
                            cols="6"
                            v-for="header in headers"
                            :key="header.value"
                          >
                            <v-checkbox
                              v-if="header.text"
                              v-model="selectedHeaders"
                              :label="header.text"
                              color="primary"
                              :value="header.text"
                              hide-details
                              :disabled="header.text == 'ID'"
                            ></v-checkbox>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-layout justify-center>
                      <v-card-actions class="mb-5">
                        <v-spacer></v-spacer>

                        <v-btn
                          outlined
                          color="primary"
                          @click="resetDefaut"
                          width="190"
                        >
                          {{ $t("deforestation.restoreDefault") }}
                        </v-btn>
                        <v-btn
                          color="primary"
                          @click="resetTableStructure"
                          width="190"
                        >
                          {{ $t("deforestation.apply") }}
                        </v-btn>
                      </v-card-actions>
                    </v-layout>
                  </v-card>
                </v-menu>

                <v-tooltip top color="black" max-width="350">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      class="mx-2"
                      fab
                      small
                      outlined
                      color="primary"
                      v-bind="attrs"
                      v-on="on"
                      @click="exportToPDF('document')"
                    >
                      <v-img src="/icons/download.svg"></v-img>
                    </v-btn>
                  </template>

                  <span>Download</span>
                </v-tooltip>
                <v-tooltip top color="black" max-width="350">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      class="mx-2"
                      fab
                      small
                      outlined
                      color="primary"
                      v-bind="attrs"
                      v-on="on"
                      @click="printPDF('document')"
                    >
                      <v-icon dark> mdi-printer </v-icon>
                    </v-btn>
                  </template>
                  <span>Print</span>
                </v-tooltip>
              </div>
            </template>
            <template v-slot:item.status="{ item }">
              <v-chip
                v-if="item.active"
                variant="elevated"
                color="primary"
                outlined
              >
                {{ $t("active") }}
              </v-chip>

              <v-chip v-else variant="elevated" color="red" outlined>
                {{ $t("deactivated") }}
              </v-chip>
            </template>
            <template v-slot:item.actions="{ item }">
              <div class="d-flex">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      class="mr-2"
                      x-small
                      fab
                      v-bind="attrs"
                      v-on="on"
                      color="primary"
                      outlined
                      @click="editSupplier(item)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t("edit") }}</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      x-small
                      fab
                      v-bind="attrs"
                      v-on="on"
                      color="primary"
                      outlined
                      @click="changeUserStatus(item.active ? 0 : 1, item)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ item.active ? $t("deactive") : $t("active") }}</span>
                </v-tooltip>
              </div>
            </template>
            <template v-slot:footer></template>
          </v-data-table>
        </div>
      </v-card>
    </v-container>
    <add-new-suppliers
      v-if="addNewSuppliers"
      :dialogI="addNewSuppliers"
      @userAdded="savedSuppliers"
      @closeModal="addNewSuppliers = false"
    />
    <edit-suppliers
      v-if="editSupplierDialog"
      :dialogI="editSupplierDialog"
      :supplierData="selectedSupplier"
      @supplierUpdated="updateSupplier"
      @closeEditModal="editSupplierDialog = false"
    />
    <confirm-box
      :title="confirmElements.title"
      :message="confirmElements.message"
      :cancelBtnText="confirmElements.cancelBtnText"
      :confirmBtnText="confirmElements.confirmBtnText"
      :confirmData="confirmElements.confirmData"
      :dialog="confirm"
      @cancel:action="confirm = false"
      @continue:action="confirmDeactivate"
    ></confirm-box>
  </div>
</template>
<script>
import AddNewSuppliers from "./AddNewSuppliers.vue";
import EditSupplier from "./EditSupplier.vue";
import DeforestationService from "@/_services/DeforestationService";
import loadingMixin from "@/mixins/LoadingMixin";
import ConfirmBox from "@/components/ConfirmBox";
import UserService from "@/_services/UserService";
import { getCountries } from "country-state-picker";
import { debounce } from "lodash";
import html2pdf from "html2pdf.js";
import printJS from "print-js";
import download from "@/mixins/DownloadMixin";

export default {
  components: {
    AddNewSuppliers,
    "confirm-box": ConfirmBox,
    "edit-suppliers": EditSupplier,
  },
  async mounted() {
    this.getCountry();
    await this.fetchData();
    this.tableHeaders = this.headers;
    this.selectedHeaders = this.allSelectedHeaders;
  },
  data() {
    return {
      document:null,
      addNewSuppliers: false,
      editSupplierDialog: false,
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: true,
          to: "/",
        },
        {
          text: this.$t("dueDiligence.suppliers"),
          disabled: false,
        },
      ],
      totalSuppliers: 0,
      selectedItem: false,
      options: {
        itemsPerPage: 10,
        page: 1,
        sortBy: [],
        sortDesc: [],
      },
      countries: [],
      countryModel: "",
      totalPages: 1,
      loading: false,
      search: "",
      debounceTimeout: null,
      from: 0,
      to: 0,
      suppliers: [],
      headers: [
        {
          text: this.$t("dueDiligence.supplierName"),
          align: "start",
          value: "fullName",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("email"),
          align: "start",
          value: "email",
          class: "black--text",
          sortable: true,
        },

        {
          text: this.$t("deforestation.phoneNumber"),
          align: "start",
          value: "mobile",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("country"),
          align: "start",
          value: "countryId",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("status"),
          align: "start",
          value: "status",
          class: "black--text",
          sortable: false,
        },
        {
          text: "",
          align: "center",
          value: "actions",
          class: "black--text",
          sortable: false,
        },
      ],
      payload: {
        countryId: null,
        orderField: "createdAt",
        order: "DESC",
      },
      confirm: false,
      confirmElements: {
        title: this.$t("addEdituser.deactivateUser"),
        message: this.$t("addEdituser.deactivateMsg"),
        confirmBtnText: this.$t("addEdituser.activateAct"),
        cancelBtnText: this.$t("cancel"),
        confirmData: {},
      },
      selectedSupplier: {},
      customizeMenu: false,
      customizeMenuAll: false,
      itemsPerPageOptions: [5, 10, 25, 50],
      itemsPerPageSlider: 10,
      selectedHeaders: [],
      tableHeaders: [],
      allSelectedHeaders: [
        this.$t("dueDiligence.supplierName"),
        this.$t("email"),
        this.$t("deforestation.phoneNumber"),
        this.$t("country"),
        this.$t("status"),
      ],
      menu: false,
      showActionsColumn:true,
    };
  },
  computed:{
    filteredHeaders(){
      return this.tableHeaders.filter((header)=>this.showActionsColumn || header.value !== "actions")
    }
  },
  methods: {
    async exportToPDF() {
        const token = this.$store.state.auth.token
        this.startLoading()
        const url = process.env.VUE_APP_DEFORESTRATION_API_BASE_URL  || "http://localhost:4043/api"
        this.downloadSourceFileWithTokenPost(`${url}/users/supplier-pdf`, "application/pdf", {payload:this.suppliers}, token,"suppliers.pdf")
            .then(() => {
            this.stopLoading()
            }).catch(() => {
            this.stopLoading()
        })
    },
    async printPDF() {
      this.showActionsColumn = false;
      await this.$nextTick();
      const element = document.querySelector(".v-data-table__wrapper");
      let opt = {
        margin: 1,
        filename: "Suppliers.pdf",
        image: { type: "jpeg", quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
      };

      let worker = await html2pdf()
        .set(opt)
        .from(element)
        .toCanvas()
        .outputPdf("blob", "Suppliers.pdf");
      let file = new File([worker], "Suppliers.pdf", {
        type: "application/pdf",
      });
      var pdfUrl = await URL.createObjectURL(file);
      await printJS({ printable: `${pdfUrl}`, type: "pdf", showModal: true });

      this.showActionsColumn = true; // restore the column;
    },
    async resetDefaut() {
      this.tableHeaders = this.headers;
      this.selectedHeaders = this.allSelectedHeaders;
      this.menu = false;
      await this.fetchData()
    },
    async resetTableStructure() {
      this.tableHeaders = this.headers.filter((header) =>
        this.selectedHeaders.includes(header.text)
      );
      this.options.itemsPerPage = this.itemsPerPageOptions[
        this.itemsPerPageSlider
      ];
      await this.fetchData();
      (this.customizeMenu = false), (this.customizeMenuAll = false);
    },
    onCountryInput: debounce(function() {
      this.fetchData();
    }, 400),
    getCountry() {
      this.countries = getCountries();
    },
    async fetchData() {
      this.startLoading();
      const payload = {
        ...this.payload,
        page: this.options.page,
        limit: this.options.itemsPerPage,
      };

      try {
        const response = await DeforestationService.getRoleListData(
          payload,
          "supplier"
        );
        this.suppliers = response.data.rows;
        this.totalSuppliers = response.data.count;
        this.totalPages = Math.ceil(
          this.totalSuppliers / this.options.itemsPerPage
        );
        this.from =
          this.totalSuppliers > 0
            ? (this.options.page - 1) * this.options.itemsPerPage + 1
            : 0;
        this.to =
          this.options.page * this.options.itemsPerPage > this.totalSuppliers
            ? this.totalSuppliers
            : this.options.page * this.options.itemsPerPage;
      } catch (error) {
        console.error(error);
        this.$notify({
          title: this.$t("dueDiligence.unExpectedErrorMsg"),
          type: "error",
        });
      } finally {
        this.stopLoading();
      }
    },
    async savedSuppliers(data) {
      if (data && data.success) {
        await this.fetchData();
        this.$notify({
          type: "success",
          text: data.message,
        });
      } else {
        this.$notify({
          type: "error",
          text: data.message || this.$t("dueDiligence.unExpectedErrorMsg"),
        });
      }
    },

    async updateSupplier(data) {
      if (data && data.success) {
        await this.fetchData();
        this.$notify({
          type: "success",
          text: data.message,
        });
      } else {
        this.$notify({
          type: "error",
          text: data.message || this.$t("dueDiligence.unExpectedErrorMsg"),
        });
      }
    },
    async editSupplier(item) {
      this.selectedSupplier = item;
      this.editSupplierDialog = true;
    },
    changeUserStatus(status = 0, user) {
      console.log({ user });
      this.confirmElements.title =
        status == "1"
          ? this.$t("addEdituser.activateAct")
          : this.$t("addEdituser.deactivateAct");
      this.confirmElements.confirmBtnText =
        status == "1"
          ? this.$t("addEdituser.activateAct")
          : this.$t("addEdituser.deactivateAct");
      this.confirmElements.confirmData = { user: user, status: status };
      this.confirm = true;
    },

    async confirmDeactivate(action, confirmData) {
      console.log({confirmData})
      if (action) {
        this.startLoading();
        try {
          const res = await UserService.toggleDdsUserStatus(confirmData.user.id, confirmData.status);
          if (res.success) {
            this.stopLoading();
            await this.fetchData();
            this.$notify({
              title:
                confirmData.status == "1"
                  ? this.$t("addEdituser.userActivated")
                  : this.$t("addEdituser.userDeactivated"),
              type: "success",
            });
          } else {
            this.$notify({
              title: this.$t("addEdituser.userNotUpdated"),
              type: "error",
            });
          }
        } catch (error) {
          console.error(error);
          this.$notify({
            title: this.$t("addEdituser.userNotUpdated"),
            type: "error",
          });
        } finally {
          this.stopLoading();
          this.confirm = false;
        }
      } else {
        this.confirm = false;
      }
    },
    pageChange(t) {
      if (t) this.options.page = this.options.page + 1;
      else this.options.page = this.options.page - 1;

      this.fetchData();
    },
    async searchQuery() {
      this.payload.searchPhrase = this.search;
      this.options.page = 1;
      await this.fetchData();
    },
    debouncedSearchQuery() {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        this.searchQuery();
      }, 1000);
    },
    selectItem() {},
  },
  mixins: [loadingMixin,download],
};
</script>

<style lang="scss" scoped>
  ::v-deep .v-data-table-header {
    background-color: #FFB443 !important;
    color:#1E1E1E ;
  }

  ::v-deep .v-data-table-header span {
    color: #1E1E1E !important;
  }
</style>
