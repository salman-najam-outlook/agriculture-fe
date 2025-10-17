<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-8">
        <h2>{{ $t("dueDiligence.listOfProducers") }}</h2>
        <v-spacer></v-spacer>
        <div class="d-flex mt-1">
          <v-btn
            color="primary"
            dark
            class="mr-2"
            width="200"
            @click="addNewProducer = true"
          >
            {{ $t("dueDiligence.addNewProducer") }}
          </v-btn>
        </div>
      </div>
      <v-card elevation="0" class="px-5 mt-4">
        <div class="pa-4">
          <v-data-table
            :headers="headers"
            :items="suppliers"
            :items-per-page="10"
            :footer-props="{
              'items-per-page-options': [10, 25, 50],
            }"
            hide-default-footer
            :loading="loading"
            :options.sync="options"
            :server-items-length="totalSuppliers"
            :loading-text="$t('loadingData')"
            :single-expand="singleExpand"
            show-expand
            item-key="id"
          >
            <!-- Top slot for filters and pagination controls -->
            <template v-slot:top="{}">
              <div class="d-flex mt-5">
                <div class="srch mr-2">
                  <label> {{ $t("search") }} </label> &nbsp;
                  <v-text-field
                    prepend-inner-icon="mdi-magnify"
                    outlined
                    height="5px"
                    :placeholder="$t('search')"
                    dense
                    v-model="search"
                    @keyup.enter="searchQuery"
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
                    style="max-width:175px"
                    @input="onCountryInput"
                    class="mr-5"
                  ></v-autocomplete>
                </div>

                <v-spacer></v-spacer>
                <div class="py-1 title">
                  {{ from }} - {{ to }} of {{ totalSuppliers }}
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
                  <v-icon dark>mdi-chevron-left</v-icon>
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
                  <v-icon dark>mdi-chevron-right</v-icon>
                </v-btn>
              </div>
            </template>
            <template v-slot:progress>
              <v-progress-linear
                color="primary"
                :height="8"
                indeterminate
              ></v-progress-linear>
            </template>
            <template v-slot:item.active="{ item }">
              <div class="mr-2 d-flex">
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
                <div>
                  <v-btn
                    x-small
                    fab
                    v-bind="attrs"
                    v-on="on"
                    color="primary"
                    outlined
                    @click="changeUserStatus(0, item)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </div>
              </div>
            </template>
            <!-- Expanded content row -->
            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length" style="padding: 0">
                <v-data-table
                  :headers="farmHeaders"
                  :items="item.farms"
                  class="elevation-1 subHeader"
                  hide-default-footer
                  :single-expand="singleExpand"
                  :expanded.sync="expanded"
                >
                  <template v-slot:item.area="{ item }">
                    <td class="text-uppercase">{{ item.area }}</td>
                  </template>
                </v-data-table>
              </td>
            </template>
            <!-- Empty footer slot to avoid default footer rendering -->
            <template v-slot:footer></template>
          </v-data-table>
        </div>
      </v-card>
    </v-container>
    <add-new-producer
      v-if="addNewProducer"
      :dialogI="addNewProducer"
      @userAdded="savedSuppliers"
      @closeModal="addNewProducer = false"
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
import AddNewProducer from "./AddNewProducer.vue";
import EditSupplier from "./EditSupplier.vue";
import DeforestationService from "@/_services/DeforestationService";
import loadingMixin from "@/mixins/LoadingMixin";
import ConfirmBox from "@/components/ConfirmBox";
import UserService from "@/_services/UserService";
import { getCountries } from "country-state-picker";
import { debounce } from "lodash";
export default {
  components: {
    AddNewProducer,
    "confirm-box": ConfirmBox,
    "edit-suppliers": EditSupplier,
  },
  async mounted() {
    this.getCountry();
    await this.fetchData();
  },
  data() {
    return {
      addNewProducer: false,
      editSupplierDialog: false,
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: true,
          to: "/",
        },
        {
          text: this.$t("dueDiligence.producers"),
          disabled: false,
        },
      ],
      totalSuppliers: 0,
      selectedItem: false,
      options: {
        itemsPerPage: 10,
        page: 1,
      },
      countries: [],
      countryModel: "",
      totalPages: 1,
      loading: false,
      search: "",
      from: 0,
      to: 0,
      suppliers: [
        {
          id: 1,
          fullName: "Prajwal Rai",
          farms: [
            {
              id: 101,
              productionPlaceDescription: "Farm 1A",
              area: 100,
              type: "Type A",
              lastAssessment: "2024-01-01",
              eudrDeforestationStatus: "Compliant",
              riskAssessment: "Low",
            },
            {
              id: 102,
              productionPlaceDescription: "Farm 1B",
              area: 150,
              type: "Type B",
              lastAssessment: "2024-01-02",
              eudrDeforestationStatus: "Non-Compliant",
              riskAssessment: "High",
            },
          ],
        },
      ],
      headers: [
        {
          text: this.$t("dueDiligence.producerName"),
          align: "start",
          value: "fullName",
          class: "black--text",
          sortable: false,
        },
        {
          text: this.$t("country"),
          align: "country",
          value: "email",
          class: "black--text",
        },

        {
          text: this.$t("dueDiligence.lastAssessment"),
          align: "start",
          value: "last_assessment",
          class: "black--text",
          sortable: false,
        },
        {
          text: this.$t("country"),
          align: "start",
          value: "country",
          class: "black--text",
          sortable: false,
        },
        {
          text: this.$t("status"),
          align: "start",
          value: "active",
          class: "black--text",
          sortable: false,
        },
        {
          text: "",
          align: "center",
          value: "status",
          class: "black--text",
          sortable: false,
        },
      ],
      farmHeaders: [
        { text: "ID", value: "id" },
        { text: "Description", value: "productionPlaceDescription" },
        { text: "Area", value: "area" },
        { text: "Type", value: "type" },
        { text: "Last Assessment", value: "lastAssessment" },
        { text: "EUDR Deforestation Status", value: "eudrDeforestationStatus" },
        { text: "Risk Assessment", value: "riskAssessment" },
      ],
      expanded: [],
      singleExpand: false,
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
    };
  },
  methods: {
    toggleExpand(item) {
      item.expanded = !item.expanded;
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
        item: this.options.itemsPerPage,
      };

      try {
        const response = await DeforestationService.getRoleListData(
          payload,
          "supplier"
        );
        this.suppliers = response.data.rows.map((item) => ({
          ...item,
          expanded: false,
          farms: [
            {
              id: 101,
              productionPlaceDescription: "Farm 1A",
              area: 100,
              type: "Type A",
              lastAssessment: "2024-01-01",
              eudrDeforestationStatus: "Compliant",
              riskAssessment: "Low",
            },
            {
              id: 102,
              productionPlaceDescription: "Farm 1B",
              area: 150,
              type: "Type B",
              lastAssessment: "2024-01-02",
              eudrDeforestationStatus: "Non-Compliant",
              riskAssessment: "High",
            },
          ],
        }));
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
      if (action) {
        this.startLoading();
        try {
          const res = await UserService.toggleUserStatus(confirmData.user.id);
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
    selectItem() {},
  },
  mixins: [loadingMixin],
};
</script>
