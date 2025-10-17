<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="localFarms"
      hide-default-footer
      :server-items-length="totalFarms"
      @item-selected="handleSelect"
      @toggle-select-all="handleSelectAll"
    >
      <template v-slot:top="{}">
        <div class="d-flex">
          <v-text-field
            prepend-inner-icon="mdi-magnify"
            style="width: 150px"
            outlined
            height="5px"
            :placeholder="$t('search')"
            dense
            v-model="search"
            @input="handleSearchByPharse"
            class="shrink"
            clearable
          ></v-text-field>

          <div class="d-inline-flex ml-3">
            <v-autocomplete
              outlined
              dense
              v-model="options.country"
              :items="countries"
              item-value="name"
              item-text="name"
              :placeholder="$t('deforestation.allCountries')"
              class="mr-3"
              return-object
              @change="getState"
              clearable
              v-on:click:clear="handleClearCountry"
            >
            </v-autocomplete>
            <v-autocomplete
              v-if="toggleFilterState"
              outlined
              dense
              v-model="options.state"
              :items="states"
              :placeholder="$t('provinceState')"
              return-object
              @change="getStateData"
              v-on:click:clear="handleClearState"
            >
            </v-autocomplete>
          </div>
          <v-menu
            v-model="filterByDateMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                append-icon="mdi-calendar"
                style="width: 150px"
                v-model="dateRangeText"
                class="ml-2"
                outlined
                dense
                readonly
                v-bind="attrs"
                v-on="on"
                clearable
                v-on:click:clear="handleClearDate"
                v-on:click:append="filterByDateMenu = true"
                :placeholder="$t('oma.filterByDate')"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="options.date"
              range
              @change="handleChangeDate"
            ></v-date-picker>
          </v-menu>

          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            height="40"
            class="mr-4 px-4"
            outlined
            @click="downloadCsv"
            small
          >
            <v-img width="15px" src="/icons/pngfile.png"></v-img>
            <span class="ml-2">{{ $t("exportAsCSV") }}</span>
          </v-btn>
          <div class="py-1 title">
            {{ from }} - {{ to }} {{ $t("of") }}
            {{ totalFarms }}
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
            <v-icon dark> mdi-chevron-left </v-icon>
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
            <v-icon dark> mdi-chevron-right </v-icon>
          </v-btn>
        </div>
      </template>
      <template v-slot:item.farmName="{ item }">
        <div
          class="text-decoration-underline cursor-pointer primary--text"
          @click="viewFarm(item.id, 0)"
        >
          {{ item.farmName || "" }}
        </div>
      </template>
      <template v-slot:item.farmerName="{ item }">
        <div
          class="text-decoration-underline cursor-pointer primary--text"
          @click="
            $router.push({ name: 'farmers_view', params: { id: item.user.id } })
          "
        >
          {{
            item.user
              ? item.user.firstName +
                (item.user.middleName ? " " + item.user.middleName : "") +
                (item.user.lastName ? " " + item.user.lastName : "")
              : item.farmerFirstName
              ? item.farmerFirstName +
                (item.farmerMiddleName ? " " + item.farmerMiddleName : "") +
                (item.farmerLastName ? " " + item.farmerLastName : "")
              : ""
          }}
        </div>
      </template>
      <template v-slot:item.farmAddress="{ item }">
        {{ decodeHtmlEntities(item.address) || "N/A" }}
      </template>
      <template v-slot:item.region="{ item }">
        {{ item.region || "N/A" }}
      </template>
      <template v-slot:item.farmLocation="{ item }">
        {{ item.mainLocation?.state || "N/A" }}
      </template>
      <template v-slot:item.technicianName="{ item }">
        {{ item.technician ? item.technician.fullName : "N/A" }}
      </template>
      <template v-slot:item.size="{ item }">
        {{ item.area ? convertSizeIntoBaseUnit(item.area) : "N/A" }}
      </template>
      <template v-slot:item.date="{ item }">
        {{ formatDate(item.createdAt) }}
      </template>
      <template v-slot:item.regBy="{ item }">
        <v-tooltip bottom color="black" max-width="350">
          <template v-slot:activator="{ on, attrs }">
            <div
              v-bind="attrs"
              v-on="on"
              class="text-decoration-underline cursor-pointer primary--text"
            >
              {{
                (item.technician && item.technician.firstName ?  `${item.technician.firstName || ""} ${item.technician.lastName || ""}` : "") ||
                (item.adminTechnician && item.adminTechnician.firstName ?  `${item.adminTechnician.firstName || ""} ${item.adminTechnician.lastName || ""}`: "")  || 
                (item.user && item.user.firstName ? `${item.user.firstName || ""} ${item.user.lastName || ""}` : "")
                
              }}
            </div>
          </template>
          <div>
            <div>
              User Id: <b>{{   (item.technician ?  item.technician.id : "") || (item.adminTechnician ?  item.adminTechnician.id : "") || (item.user ? item.user.id : "")}}</b>
            </div>
            <div>
              User Name:
              <b>{{
                (item.technician ?  `${item.technician.firstName || ""}` + `${( item.technician.lastName || "")}` : "") ||
                (item.adminTechnician ?  `${item.adminTechnician.firstName || ""}` + `${item.adminTechnician.lastName || ""}`: "")  || 
                (item.user ? `${item.user.firstName || ""}` + `${item.user.lastName || ""}` : "")
              }}</b>
            </div>
            <div>
              User Role: <b>{{ item.user?.user_role[0]?.name || "N/A" }}</b>
            </div>
          </div>
        </v-tooltip>
        <!-- {{ item.user ? item.user.firstName + " " + item.user.lastName : "" }} -->
      </template>
      <template v-slot:item.status="{ item }">
        <div
          class="text-decoration-underline cursor-pointer primary--text"
          @click="viewFarm(item.id, 2)"
        >
          {{ $t('view') }}
        </div>
      </template>
      <template v-slot:item.action="{ item }">
        <div style="right: 10px; top: 10px">
          <v-menu location="start">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item :key="item.id" :disabled="!$can($permissions.can_update_farm.value)">
                <v-list-item-title
                  class="cursor-pointer"
                  @click="editFarm(item.id)"
                  :class="{'v-list-item--disabled': !$can($permissions.can_update_farm.value)}"
                  >{{ $t("edit") }}</v-list-item-title
                >
              </v-list-item>
              <v-list-item :disabled="!$can($permissions.can_delete_farm.value)">
                <v-list-item-title
                  class="cursor-pointer"
                  @click="changeFarmStatus(item.id)"
                  :class="{'v-list-item--disabled': !$can($permissions.can_delete_farm.value)}"
                  >{{ $t("delete") }}</v-list-item-title
                >
              </v-list-item>
              <!-- <v-list-item>
                <v-list-item-title>{{
                  $t("farm.generateReport")
                }}</v-list-item-title>
              </v-list-item> -->
            </v-list>
          </v-menu>
        </div>
      </template>
      <template v-slot:footer></template>
    </v-data-table>
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
import { getCountries, getStates } from "country-state-picker";
import loadingMixin from "@/mixins/LoadingMixin";
import DownloadMixin from "@/mixins/DownloadMixin";
import MemberDataService from "@/_services/MemberDataService";
import { convertSizeIntoBaseUnit, decodeHtmlEntities } from "@/utils.js";
import _ from "lodash";
import ConfirmBox from "../../../components/ConfirmBox.vue";
import FarmService from "../../../_services/FarmService";
import DateMixin from "../../../mixins/DateMixin";
export default {
  components: { ConfirmBox },
  props: {
    headers: {
      type: Array,
    },
    toggleSelection: {
      type: Boolean,
    },
    farms: {
      type: Array,
    },
    totalFarms: {
      type: Number,
    },
    toggleFilterState: {
      type: Boolean,
      default: false,
    }
  },
  watch: {
    farms(newFarm) {
      this.localFarms = newFarm;
    },
  },
  computed: {
    totalPages() {
      return this.totalFarms < this.options.limit
        ? 1
        : Math.ceil(this.totalFarms / this.options.limit);
    },
    dateRangeText() {
      return this.options.date.join(" - ");
    },
    from() {
      return ((this.options.page - 1) * this.options.limit) + 1;
    },
    to() {
      const calculatedTo = this.options.page * this.options.limit;
      return calculatedTo > this.totalFarms ? this.totalFarms : calculatedTo;
    },
  },
  data() {
    return {
      localFarms: [],
      search: "",
      options: {
        limit: 50,
        page: 1,
        searchPhrase: "",
        country: null,
        state: null,
        date: [],
        status: "",
        orderType: "DESC",
        areaUnitId: JSON.parse(localStorage.getItem("gs"))?.areaUnit.id,
      },
      countries: [],
      states: [],
      confirm: false,
      confirmElements: {
        title: this.$t("farm.deleteFarm"),
        message: this.$t("farm.confirmDeleteFarm"),
        confirmBtnText: this.$t("addEdituser.activateAct"),
        cancelBtnText: this.$t("cancel"),
        confirmData: {},
      },
      filterByDateMenu: false,
    };
  },
  created() {
    if(this.$route.params?.id) {
      this.options = {...this.options, userId: this.$route.params?.id}
    }
    this.$emit("fetchFarmData", this.options);
    this.getCountry();
  },
  methods: {
    decodeHtmlEntities,
    viewFarm(farmId, tabId) {
      this.$router.push({ name: "FarmInfo", params: { farmId, tabId } });
    },
    editFarm(farmId) {
      this.$router.push({ name: "EditFarms", params: { farmId } });
    },
    convertSizeIntoBaseUnit,
    handleSelect(item) {
      // TODO: Handle generate report when single selected
      console.log(item, "@@@@item");
    },
    handleSelectAll(item) {
      // TODO: Handle generate report when all selected
      console.log(item, "@@@@all selected");
    },
    getCountry() {
      this.countries = getCountries();
    },
    getState(val) {
      this.states = getStates(val.code);
      this.options.country = val.name;
      this.$emit("fetchFarmData", this.options);
    },
    getStateData(val) {
      this.options.state = val;
      this.$emit("fetchFarmData", this.options);
    },
    handleChangeDate() {
      this.$emit("fetchFarmData", this.options);
      this.filterByDateMenu = false
    },
    handleClearDate() {
      this.options.date = [];
      this.$emit("fetchFarmData", this.options);
    },
    handleClearCountry() {
      this.options.country = null;
      this.$emit("fetchFarmData", this.options);
    },
    handleClearState() {
      this.options.state = null;
      this.$emit("fetchFarmData", this.options);
    },
    pageChange(t) {
      if (t) {
        this.options.page = this.options.page + 1;
      } else {
        this.options.page = this.options.page - 1;
      }
      this.$emit("fetchFarmData", this.options);
    },
    handleSearchByPharse: _.debounce(function () {
      this.options.searchPhrase = this.search;
      this.$emit("fetchFarmData", this.options);
    }, 1000),
    downloadCsv() {
      const csvUrl = MemberDataService.DOWNLOAD_FARMS_CSV_URL;
      const appendedQueryParam = new URLSearchParams(this.options);
      const url = `${csvUrl}?${appendedQueryParam}`;
      this.startLoading();
      this.downloadSourceFile(url, "text/csv").then(() => {
        this.stopLoading();
      });
    },
    changeFarmStatus(id) {
      this.confirmElements.title = this.$t("farm.deleteFarm");
      (this.confirmElements.message = this.$t("farm.confirmDeleteFarm")),
        (this.confirmElements.confirmBtnText = this.$t("yes"));
      this.confirmElements.confirmData = { farmId: id };
      this.confirm = true;
    },
    async confirmDeactivate(action, confirmData) {
      if (action) {
        await this.startLoading();
        FarmService.deactiveFarm(confirmData.farmId)
          .then(async (res) => {
            if (res.success) {
              await this.stopLoading();
              this.$emit("fetchFarmData", this.options);
              
              this.confirm = false;
              this.$notify({
                title: this.$t("farm.deleted"),
                type: "success",
              });
            } else {
              await this.stopLoading();
              this.confirm = false;
              this.$notify({
                title: this.$t("farm.notDeleted"),
                type: "error",
              });
            }
          })
          .catch(async () => {
            // console.log(err)
            await this.stopLoading();

            this.confirm = false;
          });
      } else {
        this.confirm = false;
      }
    },
  },
  mixins: [loadingMixin, DownloadMixin, DateMixin],
};
</script>
