<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-8">
        <h2>{{ $t("dueDiligence.listOfOperators") }}</h2>
        <v-spacer></v-spacer>
        <div class="d-flex mt-1">
          <v-btn color="primary" dark class="mr-2" width="auto" @click="addNewOperator = true">
            {{ $t("dueDiligence.addNewOperator") }}
          </v-btn>
        </div>
      </div>
      <v-card elevation="0" class="px-5 mt-4">
        <div class="pa-4">
          <v-data-table :headers="filteredHeaders" :items="operators" :items-per-page="10" :footer-props="{
              'items-per-page-options': [10, 25, 50],
            }" hide-default-footer :loading="loading" :options.sync="options" :server-items-length="totalOperators"
            :loading-text="$t('loadingData')">
            <template v-slot:top="{}">
              <div class="d-flex mt-5">
                <div class="srch mr-2">
                  <label> {{ $t("search") }} </label> &nbsp;
                  <v-text-field prepend-inner-icon="mdi-magnify" outlined height="5px" :placeholder="$t('search')" dense
                    v-model="search" @keyup.enter="searchQuery" class="shrink">
                  </v-text-field>
                </div>

                <div>
                  <label> {{ $t("country") }} </label> &nbsp;
                  <v-select :items="countries" item-text="name" item-value="name"
                    :placeholder="$t('deforestation.allCountries')" dense outlined v-model="payload.countryId"
                    style="max-width:175px" class="mr-5" @input="onCountryInput"></v-select>
                </div>
                <div>
                  <label style="visibility: hidden;"> Refresh </label>
                  <div>
                    <v-btn @click="resetSearch" color="primary">
                      <v-icon style="cursor: pointer;color:white !important"> mdi-refresh</v-icon>
                    </v-btn>
                  </div>
                </div>
                <!--<v-select :items="allRegions" item-text="text" item-value="val" dense outlined
                        v-model="regionModel" style="max-width:175px" class="mr-5"
                        ></v-select>

                    <v-select :items="allFarms" item-text="text" item-value="val" dense outlined
                        v-model="farmModel" style="max-width:175px" class="mr-5"
                        ></v-select>

                    <v-select :items="allStatus" item-text="text" item-value="val" dense outlined
                        v-model="statusModel" style="max-width:175px" class="mr-5"
                   ></v-select> -->

                <v-spacer></v-spacer>
                <div class="py-1 title">
                  {{ options.page }} - {{ totalPages }} of {{ totalOperators }}
                </div>
                <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page <= 1"
                  @click="pageChange(false)">
                  <v-icon dark>
                    mdi-chevron-left
                  </v-icon>
                </v-btn>
                <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page >= totalPages"
                  @click="pageChange(true)">
                  <v-icon dark>
                    mdi-chevron-right
                  </v-icon>
                </v-btn>
                <v-btn class="mx-2" @click="exportToPDF" fab small outlined color="primary">
                  <v-icon dark>
                    mdi-tray-arrow-down
                  </v-icon>
                </v-btn>

                <v-menu v-model="document" :close-on-content-click="false" :nudge-width="200" left :min-width="417">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn class="mx-2" fab small outlined v-bind="attrs" v-on="on" color="primary">
                      <v-icon dark> mdi-cog-outline </v-icon>
                    </v-btn>
                  </template>

                  <v-card width="417">
                    <v-list>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>{{ $t("farm.customization") }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider></v-divider>
                      <div class="pl-3 pt-2 font-weight-normal">
                        {{ $t("farm.recordsPerpage") }}
                      </div>
                      <v-list-item>
                        <v-list-item-content>
                          <v-slider v-model="tempOptions.itemsPerPage" :tick-labels="[0,10,20,30,40,50]" :max="50"
                            step="10" ticks="always" tick-size="4"></v-slider>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider class="mt-n3"></v-divider>
                    </v-list>
                    <v-card-text>
                      <v-container fluid>
                        <v-row>
                          <v-col class="mt-n9" cols="6" v-for="header in headers" :key="header.value">
                            <v-checkbox v-if="header.text" v-model="selectedHeaders" :label="header.text"
                              color="primary" :value="header.value" hide-details
                              :disabled="header.value === 'ID'"></v-checkbox>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-layout justify-center>
                      <v-card-actions class="mb-5">
                        <v-spacer></v-spacer>

                        <v-btn outlined color="primary" @click="resetDefaut" width="190">
                          {{ $t("farm.restoreDefault") }}
                        </v-btn>
                        <v-btn color="primary" @click="resetTableStructure" width="190">
                          {{ $t("farm.apply") }}
                        </v-btn>
                      </v-card-actions>
                    </v-layout>
                  </v-card>
                </v-menu>


                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn class="mx-2" fab small outlined v-bind="attrs" v-on="on" color="primary"
                      @click="printContent">
                      <v-icon>print</v-icon>
                    </v-btn>
                  </template>
                  <span>Print</span>
                </v-tooltip>
              </div>
            </template>
            <template v-if="operators.length" v-slot:body="{ items }">
              <tbody>
                <tr v-for="item in items" :key="item.id">
                  <td v-for="header in filteredHeaders" :key="header.value" class="text-truncate">
                    <template v-if="header.value=='operatorName'">
                      {{ item.firstName || "" }} {{ item.lastName || "" }}
                    </template>
                    <template v-else-if="header.value=='status'">
                      <v-chip :color="item.active ? 'primary' : 'yellow'" variant="elevated" outlined>
                        {{ item.active ? $t('activated') : $t('deactivated') }}
                      </v-chip>
                    </template>
                    <template v-else-if="header.value=='actions'">
                      <div class="d-flex mt-2">
                        <div class="mr-2">
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn x-small fab v-bind="attrs" v-on="on" color="primary" outlined
                                @click="editOperator(item)">
                                <v-icon>mdi-pencil</v-icon>
                              </v-btn>
                            </template>
                            <span>{{ $t("edit") }}</span>
                          </v-tooltip>
                        </div>
                        <div>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn x-small fab v-bind="attrs" v-on="on" color="primary" outlined
                                @click="changeUserStatus(item.active ? 0 : 1, item)">
                                <v-icon>mdi-delete</v-icon>
                              </v-btn>
                            </template>
                            <span>{{ item.active ? $t("deactive") : $t("active") }}</span>
                          </v-tooltip>
                        </div>
                      </div>

                    </template>
                    <template v-else>
                      {{ item[header.value] || '' }}
                    </template>
                  </td>

                </tr>
              </tbody>
            </template>
            <template v-slot:footer></template>
          </v-data-table>
        </div>
      </v-card>
    </v-container>
    <add-new-operators v-if="addNewOperator" :dialogI="addNewOperator" @userAdded="savedOperators"
      @closeModal="addNewOperator = false" />
    <edit-operator v-if="editOperatorDialog" :dialogI="editOperatorDialog" :operatorData="selectedOperator"
      @operatorUpdate="updateOperator" @closeEditModal="editOperatorDialog = false" />
    <confirm-box :title="confirmElements.title" :message="confirmElements.message"
      :cancelBtnText="confirmElements.cancelBtnText" :confirmBtnText="confirmElements.confirmBtnText"
      :confirmData="confirmElements.confirmData" :dialog="confirm" @cancel:action="confirm = false"
      @continue:action="confirmDeactivate"></confirm-box>
    <PrintComponent ref="printComponent" filename="Operators.pdf" :config="printConfig" :printStyle="printStyle"
      v-show="0">
      <div class="pdf-header" style="
        display: flex;
        justify-content: space-between;
        align-items: center;
      ">
        <div class="pdf-header-logo" style="width: 50%">
          <img src="/img/Dimitra Powered by AI 2023.png" style="max-width: 100%; height: auto;" />
        </div>
        <h2 style="padding:1rem">{{ $t("dueDiligence.listOfOperators") }}</h2>
      </div>
      <table style="border: 1px solid black; border-collapse: collapse;">
        <thead>
          <tr>
            <th v-if="selectedHeaders.includes('operatorName')"
              style="border: 1px solid black; background-color: teal; color: white;">{{
                $t("dueDiligence.operatorName") }}</th>
            <th v-if="selectedHeaders.includes('email')"
              style="border: 1px solid black; background-color: teal; color: white;">{{ $t("email") }}</th>
            <th v-if="selectedHeaders.includes('mobile')"
              style="border: 1px solid black; background-color: teal; color: white;">{{
                $t("deforestation.phoneNumber") }}</th>
            <th v-if="selectedHeaders.includes('eori_number')"
              style="border: 1px solid black; background-color: teal; color: white;">{{ $t("dueDiligence.eoriNumber")
              }}</th>
            <th v-if="selectedHeaders.includes('country')"
              style="border: 1px solid black; background-color: teal; color: white;">{{ $t("country") }}</th>
            <th v-if="selectedHeaders.includes('countryIsoCode')"
              style="border: 1px solid black; background-color: teal; color: white;">{{ $t("dueDiligence.isoCode") }}
            </th>
            <th v-if="selectedHeaders.includes('status')"
              style="border: 1px solid black; background-color: teal; color: white;">{{ $t("status") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="operator in operators" :key="operator.id">
            <td
            v-if="selectedHeaders.includes('operatorName')"
            style="border: 1px solid black;">{{ operator.firstName || "" }} {{ operator.lastName || "" }}</td>
            <td
            v-if="selectedHeaders.includes('email')"
            style="border: 1px solid black;">{{ operator.email }}</td>
            <td
            v-if="selectedHeaders.includes('mobile')"
            style="border: 1px solid black;">{{ operator.mobile }}</td>
            <td
            v-if="selectedHeaders.includes('eori_number')"
            style="border: 1px solid black;">{{ operator.eori_number }}</td>
            <td
            v-if="selectedHeaders.includes('country')"
            style="border: 1px solid black;">{{ operator.country }}</td>
            <td
            v-if="selectedHeaders.includes('countryIsoCode')"
            style="border: 1px solid black;">{{ operator.countryIsoCode }}</td>
            <td
            v-if="selectedHeaders.includes('status')"
            style="border: 1px solid black;">{{ operator.status }}</td>
          </tr>
        </tbody>
      </table>
    </PrintComponent>
  </div>
</template>
<script>
import AddNewOperators from "./AddNewOperators.vue";
import DeforestationService from "@/_services/DeforestationService";
import loadingMixin from "@/mixins/LoadingMixin";
import download from "@/mixins/DownloadMixin";
import ConfirmBox from "@/components/ConfirmBox";
import EditOperator from  "./EditOperator.vue";
import UserService from "@/_services/UserService";
import { getCountries } from "country-state-picker";
import { debounce } from "lodash";
import PrintComponent from '@/components/PrintComponent.vue';
export default {
  components: { AddNewOperators, "confirm-box": ConfirmBox, "edit-operator": EditOperator, PrintComponent },
  async mounted() {
    this.getCountry();
    await this.fetchData();
  },
  computed: {
    filteredHeaders() {
      return this.headers.filter(header => this.selectedHeaders.includes(header.value));
    }
  },
  
  data() {
    return {
      addNewOperator: false,
      document: false,  
      totalOperators: 0,
      selectedItem: false,
      options: {
        itemsPerPage: 10,
        page: 1,
      },
      tempOptions: {
        itemsPerPage: 10,
      },
      countries: [],
      countryModel: "",
      totalPages: 1,
      loading: false,
      search: "",
      from: 0,
      to: 0,
      operators: [],
      headers: [
        {
          text: this.$t("dueDiligence.operatorName"),
          align: "start",
          value: "operatorName",
          class: "black--text",
          sortable: false,
        },
        {
          text: this.$t("email"),
          align: "start",
          value: "email",
          class: "black--text",
        },

        {
          text: this.$t("deforestation.phoneNumber"),
          align: "start",
          value: "mobile",
          class: "black--text",
          sortable: false,
        },
        {
          text: this.$t("dueDiligence.eoriNumber"),
          align: "start",
          value: "eori_number",
          class: "black--text",
        },
        {
          text: this.$t("country"),
          align: "start",
          value: "country",
          class: "black--text",
          sortable: false,
        },
        {
          text: this.$t("dueDiligence.isoCode"),
          align: "start",
          value: "countryIsoCode",
          class: "black--text",
          sortable: false,
        },
        {
          text: this.$t("status"),
          align: "start",
          value: "status",
          class: "black--text",
          sortable: false,
        },
        {
          text: this.$t("actions"),
          align: "start",
          value: "actions",
          class: "black--text",
          sortable: false,
        },
      
      ],
      selectedHeaders: ["operatorName", "email", "mobile", "eori_number", "country", "countryIsoCode", "status", "actions"],
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: true,
          to: "/",
        },
        {
          text: this.$t("dueDiligence.operators"),
          disabled: false,
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
      selectedOperator: {},
      editOperatorDialog:false,
      printConfig: {
        margin: [0.2, 0.2, 0.2, 0.2],
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
      },
      printStyle: {
        border: '1px solid black',
        borderCollapse: 'collapse',
        th: {
          border: '1px solid black',
          padding: '8px',
          textAlign: 'left',
          backgroundColor: 'teal',
          color: 'white',
        },
        td: {
          border: '1px solid black',
          padding: '8px',
          textAlign: 'left',
        },
      },
    };
  },
  methods: {
    async exportToPDF() {
        const token = this.$store.state.auth.token
        this.startLoading()
        const url = process.env.VUE_APP_DEFORESTRATION_API_BASE_URL  || "http://localhost:4043/api"
        this.downloadSourceFileWithTokenPost(`${url}/users/operator-pdf`, "application/pdf", {payload:this.operators}, token,"opperators.pdf")
            .then(() => {
            this.stopLoading()
            }).catch(() => {
            this.stopLoading()
        })
    },
    onCountryInput: debounce(function() {
      this.fetchData();
    }, 400),
    getCountry() {
      this.countries = getCountries();
    },
    resetSearch(){
      this.payload.countryId = null
      this.fetchData()
    },
    async fetchData() {
      this.startLoading();
      const payload = {
        ...this.payload,
        page: this.options.page,
        limit: this.options.itemsPerPage || 10,
      };

      try {
        const response = await DeforestationService.getRoleListData(
          payload,
          "operator"
        );
        this.operators = response.data.rows;
        this.totalOperators = response.data.count;
        this.totalPages = Math.ceil(
          this.totalOperators / this.options.itemsPerPage
        );
        this.from =
          this.totalOperators > 0
            ? (this.options.page - 1) * this.options.itemsPerPage + 1
            : 0;
        this.to =
          this.options.page * this.options.itemsPerPage > this.totalOperators
            ? this.totalOperators
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
    async savedOperators(data) {
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

    async updateOperator(data) {
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
    async editOperator(item) {
      this.selectedOperator = item;
      this.editOperatorDialog = true;
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
            this.confirm = false
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
    printContent() {
      this.$refs.printComponent.printContent();
    },
    resetDefaut() {
      this.selectedHeaders = ["operatorName", "email", "mobile", "eori_number", "country", "countryIsoCode", "status", "actions"]
    },
    resetTableStructure() {
     this.document = false
     if(this.tempOptions.itemsPerPage !== this.options.itemsPerPage){
       this.options.itemsPerPage = this.tempOptions.itemsPerPage
       this.fetchData()
     }
    },
  },
  mixins: [loadingMixin,download],
  
};
</script>
