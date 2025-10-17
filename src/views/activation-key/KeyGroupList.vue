<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-4">
        <h2>{{ $t("activationKey.activationKey") }} >> {{ $t("activationKey.ActivationKeysList") }}</h2>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          dark
          class="mr-3"
          outlined
          @click="$router.push({ name: 'ActivationKeyList' })"
        >
          {{ $t("activationKey.back") }}
        </v-btn>
      </div>

      <v-card elevation="0" class="px-5">
        <v-card-text>
          <div
            v-if="!activationKeys"
            class="text-center"
            style="padding-top:5%"
          >
            <v-row align="center" justify="center">
              <v-col>
                <v-img
                  max-height="190"
                  max-width="190"
                  src="/icons/nodata.svg"
                  class="img-center"
                ></v-img>
                <h5 class="mt-4 red--text">{{ $t("activationKey.noData") }}</h5>
                <p class="text-caption black--text">
                  {{ $t("activationKey.noActKey") }}.<br />
                  {{ $t("activationKey.pleaseGenActKeyss") }} <br />
                  {{ $t("activationKey.usingActKeys") }} <br />
                  {{ $t("activationKey.buttonAbv") }}.
                </p>
              </v-col>
            </v-row>
          </div>

          <div v-if="activationKeys">
            <v-data-table
              :headers="headers"
              :items="activationKeys"
              :items-per-page="10"
              :footer-props="{
                'items-per-page-options': [10, 25, 50],
              }"
              hide-default-footer
              :loading="keysLoading"
              :options.sync="options"
              :server-items-length="totalKeys"
              loading-text="Loading activationKeys..."
            >
              <template v-slot:top="{}">
                <div class="d-flex mt-5">
                  <v-text-field
                    prepend-inner-icon="mdi-magnify"
                    outlined
                    height="5px"
                    :placeholder="$t('search')"
                    dense
                    v-model="search"
                    @input="resetSearchOnEmpty"
                    class="shrink"
                  ></v-text-field>
                  <v-spacer></v-spacer>
                  <div class="py-1 title">{{ $t("activationKey.filterBy") }}</div>
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
                  <v-btn
                    class="mx-2"
                    color="primary"
                    outlined
                    @click="clearAllFilters"
                    v-if="filteredData"
                  >
                    {{ $t("activationKey.clearAllFilters") }}
                  </v-btn>
                  <div class="ml-4 py-1 title">
                    {{ from }} - {{ to }} {{ $t('of') }} {{ totalKeys }}
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
              <template v-if="activationKeys.length" v-slot:body="{ items }">
                <tbody>
                  <tr
                    v-for="item in items"
                    :key="item.id"
                    style="position: relative; width: 0; height: 0"
                    @mouseover="selectItem(item)"
                    @mouseleave="selectItem(false)"
                  >
                    <td>{{ item.license_key }}</td>
                    <td class="text-truncate">
                      <v-icon @click="showQrr(item.license_key)">mdi-qrcode</v-icon>
                      <!-- <div @click="showQrr(item.license_key)">
                        <v-img
                          max-height="50"
                          max-width="50"
                          :src="item.qrCodeUrl"
                        ></v-img>
                      </div> -->
                    </td>
                    <td class="text-truncate">{{ (item.user_assoc && item.user_assoc.fullName )|| "N/A" }}</td>
                    <!-- <td class="text-truncate">{{ item.user_id || "N/A" }}</td> -->
                    <td class="text-truncate">
                      {{ item.user_assoc && item.user_assoc.email || "N/A" }}
                    </td>
                    <td class="text-truncate">{{ item.user_assoc && item.user_assoc.mobile || "N/A" }}</td>
                    <td class="text-truncate">
                      {{ item.membership_assoc ? item.membership_assoc.membership_type : "N/A" }}
                    </td>
                    <td
                      class="text-capitalize font-weight-bold"
                      :class="{
                        'primary--text': item.status == 'activated',
                        'third--text': item.status == 'assigned',
                      }"
                    >
                      {{ $t(item.status) }}
                    </td>
                    <!-- <div style="position: absolute; right: 10px; top:5px;" v-if="item === selectedItem">  
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn 
                                                    x-small 
                                                    fab
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    @click="editRole(item)"
                                                >
                                                    <v-icon>mdi-pencil</v-icon> 
                                                </v-btn>
                                            </template>
                                            <span>Edit</span>
                                        </v-tooltip>
                                            <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn 
                                                    x-small 
                                                    fab
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    class="ml-2"
                                                    @click="deleteRole(item)"
                                                >
                                                    <v-icon>mdi-trash-can-outline</v-icon> 
                                                </v-btn>
                                            </template>
                                            <span>Delete</span>
                                        </v-tooltip>
                                    </div> -->
                  </tr>
                </tbody>
              </template>
              <template v-slot:footer></template>
            </v-data-table>
          </div>
        </v-card-text>
      </v-card>
    </v-container>
    <send-mail
      v-on:mail:sent="mailSent"
      v-if="showSendMail"
      :dialogU="showSendMail"
      @closeSendEmail="showSendMail = false"
    ></send-mail>
    <assign-manager
      v-on:mail:sent="mailSent"
      v-if="showAssignManager"
      :dialogU="showAssignManager"
      @closeSendEmail="showAssignManager = false"
    ></assign-manager>
    <!-- Filters Start -->

    <v-dialog
      v-model="showFilters"
      width="356"
      @click:outside="closeFilter"
      content-class="my-custom-dialog"
      transition="dialog-bottom-transition"
    >
      <v-card min-height="100vh" class="" rounded="0">
        <v-toolbar color="primary" class="white--text" flat :elevation="0">
          <v-toolbar-title class="font-weight-bold">{{
            $t("filterBy")
          }}</v-toolbar-title>
          <v-spacer></v-spacer>

          <v-btn icon class="white--text" @click="closeFilter">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pt-5">
          <v-row no-gutters>
            <v-col cols="12">
              <label
                for="autoLogOff"
                class="text-subtitle-1 font-weight-bold"
                >{{ $t("activationKey.keysStatus") }}</label
              >
              <v-select
                :items="[
                  { text: 'Assigned', value: 'assigned' },
                  { text: 'Unassigned', value: 'unassigned' },
                  { text: 'Activated', value: 'activated' },
                ]"
                outlined
                dense
                placeholder="Select"
                item-text="text"
                item-value="value"
                v-model="filterParam.status"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <label
                for="autoLogOff"
                class="text-subtitle-1 font-weight-bold"
                >{{ $t("activationKey.membershipPlan") }}</label
              >
              <v-select
                :items="membershipList"
                outlined
                dense
                item-text="membership_type"
                item-value="id"
                v-model="filterParam.membership_type"
                placeholder="Not Available"
                disabled
              ></v-select>
            </v-col>
            <v-col cols="12">
              <label
                for="autoLogOff"
                class="text-subtitle-1 font-weight-bold"
                >{{ $t("activationKey.salesManager") }}</label
              >
              <v-select
                :items="salesManager"
                item-text="user_role.fullName"
                item-value="user_id"
                outlined
                dense
                placeholder="Not Available"
                disabled
                v-model="filterParam.sales_manager"
              ></v-select>
            </v-col>
            <v-col></v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="d-flex justify-space-around">
              <v-btn
                outlined
                @click="clearAllFilters"
                width="130"
                color="primary"
              >
                {{ $t("activationKey.clearAll") }}
              </v-btn>
              <v-btn
                :disabled="!canSearch"
                width="130"
                @click="searchWithFilter"
                color="primary"
              >
                {{ $t("search") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>


    <v-dialog
      v-model="showQr"
      width="500"
      height="500"
      @click:outside="closeFilter"
    >
      <v-card class="" rounded="0">
        <v-toolbar color="primary" class="white--text" flat :elevation="0">
          <v-toolbar-title class="font-weight-bold">{{
            $t("qrcode")
          }}</v-toolbar-title>
          <v-spacer></v-spacer>

          <v-btn icon class="white--text" @click="showQr = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pt-5 text-center">
          <b class="black--text ">{{$t("activationKey.activationKey")}}</b><br/>
          <label class="black--text ">{{ licenseKey }}</label>
            <!-- <v-img
              class="mx-auto"
              max-height="325"
              max-width="325"
              :src="qrImg"
            ></v-img> -->
            <div class="d-flex justify-center">
              <qr-code :text="licenseKey"></qr-code>
            </div>

        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Filters End -->
  </div>
</template>
<script>
import SendMail from "./SendMail.vue";
import AssignManager from "./AssignManager.vue";
import loadingMixin from "@/mixins/LoadingMixin";
import ActivationKeyService from "@/_services/ActivationService.js";
import VueQRCodeComponent from 'vue-qrcode-component'

export default {
  created() {
    this.groupId = this.$route.params.groupId;
    // console.log('ttt', this.groupId)
    const fetchData = async () => {
      const [sm, mt] = await Promise.all([
        ActivationKeyService.getSalesManagers(),
        ActivationKeyService.getAllMemberships(),
      ]);
      this.salesManager = sm.data;
      this.membershipList = mt.data.listRes;
    };
    fetchData();
  },
  components: {
    SendMail,
    AssignManager,
    ["qr-code"]: VueQRCodeComponent
  },
  watch: {
    // options: {
    //   handler() {
    //     this.getActivationKeys();
    //   },
    //   deep: true,
    // },
    "$route.params.groupId": {
      handler(groupId) {
        this.groupId = groupId;
      },
      deep: true,
      immediate: true,
    },
    filterParam: {
      handler(v) {
        // console.log('filterParam',v.status)
        if (v.status != "") this.canSearch = true;
        else this.canSearch = false;
      },
      deep: true,
    },
  },
  data() {
    return {
      filterParam: {
        status: "",
        membership_type: "",
        sales_manager: "",
      },
      qrImg: "",
      licenseKey: "",
      showQr: false,
      filteredData: false,
      canSearch: false,
      membershipList: [],
      salesManager: null,
      groupId: null,
      showFilters: false,
      confirm: false,
      confirmElements: {
        title: this.$t('adminRoles.deleteRole'),
        message: "Are you sure you want to delete Supervisor role?",
        confirmBtnText: this.$t('adminRoles.deleteRole'),
        cancelBtnText: this.$t('cancel'),
        confirmData: {},
      },
      editedRole: {},
      showEditRole: false,
      tab: 0,
      tabs: ["Active", "Deactive"],
      selectedItem: false,
      options: {},
      loading: false,
      keysLoading: false,
      showSendMail: false,
      showAssignManager: false,
      department: "",
      departmentList: [],
      search: "",
      from: 0,
      to: 0,
      totalPages: 1,
      activationKeys: [],
      totalKeys: 0,
      headers: [
        {
          text: this.$t('activationKey.keysNum'),
          align: "start",
          value: "id",
          class: "black--text",
          sortable: false,
        },
        {
          text: this.$t('qrcode'),
          value: "name",
          class: "black--text",
          sortable: false,
        },
        {
          text: this.$t('logs.username'),
          value: "id",
          class: "black--text",
          sortable: false,
        },
        {
          text: this.$t('activationKey.email'),
          value: "user_email",
          class: "black--text",
          sortable: false,
        },
        {
          text: this.$t('activationKey.phoneNumber'),
          value: "phone_no",
          class: "black--text",
          sortable: false,
        },
        {
          text: this.$t('activationKey.membershipPlan'),
          value: "membership_assoc.membership_type",
          class: "black--text",
          sortable: false,
        },
        {
          text: this.$t('activationKey.keysStatus'),
          value: "status",
          class: "black--text",
          sortable: false,
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
          text: this.$t("activationKey.activationKey"),
          disabled: true,
          href: "breadcrumbs_link_1",
        },
      ],
    };
  },
  methods: {
    getStatusClass() {
      return "primary--text";
    },
    async confirmDeactivate(res, role) {
      if (res) {
        this.startLoading();
        const response = await this.$http.delete(`roles/${role.id}`);
        if (response.data.code == 200) {
          this.$notify({
            title: response.data.message,
            type: "error",
          });
          this.confirm = false;
          this.getActivationKeys();
          this.stopLoading();
        } else {
          this.$notify({
            title: response.data.message,
            type: "error",
          });
          this.stopLoading();
        }
        // console.log('d-res', response)
      } else {
        this.confirm = false;
      }
    },
    deleteRole(role) {
      this.confirmElements.confirmData = role;
      this.confirm = true;
    },
    async getActivationKeys() {
      this.keysLoading = true;
      try {
        // const {data} = await this.$http.get(`/user/activation/activationKeys/${this.groupId}?page=${this.options.page}&limit=${this.options.itemsPerPage}&searchPhrase=${this.search}`)
        const requestParams = {
          page: this.options.page,
          limit: this.options.itemsPerPage,
          searchPhrase: this.search,
          filterParam: "",
        };
        if (this.filterParam.status != "") {
          requestParams.filterParam = { status: this.filterParam.status };
        }

        const { data } = await this.$http.get(
          `/user/activation/activationKeys/${this.groupId}`,
          {
            params: requestParams,
          }
        );
        if (data.code === 200) {
          this.activationKeys = data.data.listRes.rows;
          this.totalKeys = data.data.listRes.count;
          this.totalPages = Math.ceil(
            this.totalKeys / this.options.itemsPerPage
          );
          this.from = (this.options.page - 1) * this.options.itemsPerPage + 1;
          //   this.to = (this.options.page*this.options.itemsPerPage)-(this.options.itemsPerPage-response.data.data.listRes.rows.length)
          this.to =
            this.options.page * this.options.itemsPerPage -
            (this.options.itemsPerPage - this.activationKeys.length);

          this.keysLoading = false;
        } else {
          console.log(123);
          this.keysLoading = false;
        }
      } catch (err) {
        console.log("e", err);
        this.keysLoading = false;
      }
    },
    showQrr(id){
      this.showQr = true
      this.licenseKey = id
      this.activationKeys.forEach(element => {
        // console.log("===> ", element, id)
        if(id == element.license_key){
          this.qrImg = element.qrCodeUrl
        }
      })
    },
    selectItem(item) {
      this.selectedItem = item;
    },
    resetSearchOnEmpty() {
      // if(this.search != '') return;
      // this.options.page = 1;
      this.getActivationKeys();
    },
    pageChange(t) {
      if (t) this.options.page = this.options.page + 1;
      else this.options.page = this.options.page - 1;

      this.getActivationKeys();
    },
    editRole(role) {
      this.editedRole = role;
      this.showEditRole = true;
    },
    mailSent() {
      this.showSendMail = false;
    },
    managerAssigned() {
      this.showAssignManager = false;
    },
    closeFilter() {
      this.showFilters = false;
    },
    searchWithFilter() {
      // console.log(this.filterParam)
      this.filteredData = true;
      this.showFilters = false;
      this.getActivationKeys();
    },

    clearAllFilters() {
      this.filterParam.status = "";
      this.filteredData = false;
      this.showFilters = false;
      this.getActivationKeys();
    },
  },
  async mounted() {
     this.startLoading();
    await this.getActivationKeys()
      this.stopLoading();
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
