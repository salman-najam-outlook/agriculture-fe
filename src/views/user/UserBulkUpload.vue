<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-4">
        <h2>1000 records found</h2>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="goBack" dark class="mr-2" outlined>
          {{ $t("cancel") }}
        </v-btn>
        <v-btn color="primary" dark class="mr-2" @click="confirmBulkUpload">
          {{ $t("confirm") }}
        </v-btn>
      </div>
      <v-card class="pa-4 mb-5">
        <v-data-table
          :headers="headers"
          :items="tableData"
          v-model="selected"
          :items-per-page="10"
          hide-default-footer
          show-select
            @click:row="rowClicked" 
            @item-selected="toggleCheckBox"
             item-key="index"
             :item-class="getRowClass"
        >
          <template v-slot:top>
            <div class="d-flex mt-5">
              <v-text-field
                prepend-inner-icon="mdi-magnify"
                outlined
                height="5px"
                :placeholder="$t('search')"
                dense
                class="shrink mr-4"
              ></v-text-field>
              <v-text-field
                dense
                :label="membershipTypeVal.label"
                outlined
                :disabled="true"
                class="shrink wdt"
                :placeholder="$t('permissions.texMembership')"
              ></v-text-field>
              <v-spacer></v-spacer>
              <div class="py-1 title">
                {{ from }} - {{ to }} {{ $t("of") }} {{ totalUsers }}
              </div>
              <v-btn
                class="mx-2"
                fab
                small
                outlined
                color="primary"
                :disabled="tableOptions.page <= 1"
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
                :disabled="tableOptions.page >= totalPages"
                @click="pageChange(true)"
              >
                <v-icon dark> mdi-chevron-right </v-icon>
              </v-btn>
            </div>
            <v-row class="mb-6">
              <v-col>
                <v-expansion-panels v-model="openStats" multiple>
                  <v-expansion-panel>
                    <v-expansion-panel-header
                      color="#117443"
                      style="color: white; minHeight: 10px"
                    >
                      File-Name: Bulk-Upload-User.csv
                      <template v-slot:actions>
                        <v-icon color="white"> $expand </v-icon>
                      </template>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-row class="pt-4">
                        <v-col lg="3" md="6" sm="6" xs="12">
                          <v-card min-height="70" class="pa-2" flat outlined>
                            <div class="text-subtitle-2">Total Records</div>
                            <div class="font-weight-bold black--text">{{bulkStageList.stagedData.length}}</div>
                          </v-card>
                        </v-col>
                        <v-col lg="3" md="6" sm="6" xs="12">
                          <v-card min-height="70" class="pa-2" flat outlined>
                            <div class="text-subtitle-2">Success Records</div>
                            <div class="font-weight-bold green--text">{{bulkStageList.noOfNewActivatedKeys + bulkStageList.noOfUsedExstingKeys}}</div>
                          </v-card>
                        </v-col>
                        <v-col lg="3" md="6" sm="6" xs="12">
                          <v-card min-height="70" class="pa-2" flat outlined>
                            <div class="text-subtitle-2">Failed Records</div>
                            <div class="font-weight-bold red--text">{{bulkStageList.stagedData.length - (bulkStageList.noOfNewActivatedKeys + bulkStageList.noOfUsedExstingKeys)}}</div>
                          </v-card>
                        </v-col>
                        <v-col lg="3" md="6" sm="6" xs="12">
                          <v-card min-height="70" class="pa-2" flat outlined>
                            <div class="text-subtitle-2">Removed Records</div>
                            <div class="font-weight-bold red--text">0</div>
                          </v-card>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
              <v-col>
                <v-expansion-panels v-model="openStats" multiple>
                  <v-expansion-panel>
                    <v-expansion-panel-header
                      color="#117443"
                      style="color: white; minHeight: 10px"
                    >
                      Activation Keys Quota
                      <template v-slot:actions>
                        <v-icon color="white"> $expand </v-icon>
                      </template>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-row class="pt-4">
                        <v-col lg="3" md="6" sm="6" xs="12">
                          <v-card min-height="70" class="pa-2" flat outlined>
                            <div class="text-subtitle-2">Generated Keys</div>
                            <div class="font-weight-bold black--text">{{bulkStageList.noOfNewActivatedKeys }}</div>
                          </v-card>
                        </v-col>
                        <v-col lg="3" md="6" sm="6" xs="12">
                          <v-card min-height="70" class="pa-2" flat outlined>
                            <div class="text-subtitle-2">Saved Keys</div>
                            <div class="font-weight-bold black--text">{{ bulkStageList.noOfUsedExstingKeys}}</div>
                          </v-card>
                        </v-col>
                        <v-col lg="3" md="6" sm="6" xs="12">
                          <v-card min-height="70" class="pa-2" flat outlined>
                            <div class="text-subtitle-2">Remaining Keys</div>
                            <div class="font-weight-bold black--text">
                              {{activationKeyData.noOfkeysAllowed - activationKeyData.generatedActivationKeys}}
                            </div>
                          </v-card>
                        </v-col>
                        <v-col lg="3" md="6" sm="6" xs="12">
                          <v-card min-height="70" class="pa-2" flat outlined>
                            <div class="text-subtitle-2">Total Keys Quoata</div>
                            <div class="font-weight-bold black--text">
                              {{activationKeyData.noOfkeysAllowed}}
                            </div>
                          </v-card>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
            </v-row>
            <v-row class="mb-6" :style="{opacity: `${selected.length > 0? '100' : '0'}`}">
              <div class="font-weight-bold mx-4">
                {{ selected.length }} records selected
              </div>
              <v-btn
                right
                height="37"
                width="250"
                depressed
                color="primary"
                class="mr-4"
                @click="showUnassigned = true"
              >
                Unassign activation key
              </v-btn>
              <v-btn
                outlined
                right
                height="37"
                width="200"
                depressed
                color="primary"
                class="mr-4"
                @click="selected = bulkStageList.stagedData"
              >
                select all records
              </v-btn>
              <v-btn
                outlined
                right
                height="37"
                width="136"
                depressed
                color="primary"
                class="mr-4"
                @click="selected = []"
              >
                Deseclect All
              </v-btn>
              <v-btn
                outlined
                right
                height="37"
                width="216"
                depressed
                color="error"
                class="mr-4"
                @click="showRemoveRecords = true"
              >
                Remove Records
              </v-btn>
            </v-row>
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

                  <v-list-item :key="item.index">
                    <v-list-item-title class="cursor-pointer" @click="singleRemove(item.index)">
                      Remove
                    </v-list-item-title>
                  </v-list-item>
    
                </v-list>
              </v-menu>
            </div>
          </template>
          <template v-slot:footer></template>
        </v-data-table>
      </v-card>

      <v-dialog
        v-model="showRemoveRecords"
        width="500"
        @click:outside="showRemoveRecords = false"
        :retain-focus="false"
      >
        <v-card class="" rounded="0">
          <v-toolbar flat color="primary" class="white--text">
            <v-toolbar-title class="font-weight-bold">{{
              $t("userslist.deactivateUser")
            }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon class="white--text" @click="showRemoveRecords = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text class="text-center font-weight-bold pa-6">
            Are you sure you want to remove {{ selected.length }} record(s)?
            <br />
            <br />
            Activation keys attached to these records will be discarded and
            restored in the overal subscription quota.
          </v-card-text>
          <v-card-actions class="pb-6">
            <v-spacer></v-spacer>
            <v-btn  @click="showRemoveRecords = false" outlined right width="116" depressed color="primary">
              {{ $t("cancel") }}
            </v-btn>
            <v-btn
              right
              width="116"
              color="primary"
              @click="removeRecordsFromTable"
            >
              {{ $t("confirm") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="showUnassigned"
        width="500"
        @click:outside="showUnassigned = false"
        :retain-focus="false"
      >
        <v-card class="" rounded="0">
          <v-toolbar flat color="primary" class="white--text">
            <v-toolbar-title class="font-weight-bold">{{
              $t("userslist.deactivateUser")
            }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon class="white--text" @click="showUnassigned = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text class="text-center font-weight-bold pa-6">
            Are you sure you want to unassigns activation key for
            {{ selected.length }} record(s)? <br />
            <br />
            Activation keys associated with these records will be saved, and can
            be used later
          </v-card-text>
          <v-card-actions class="pb-6">
            <v-spacer></v-spacer>
            <v-btn  @click="showUnassigned = false" outlined right width="116" depressed color="primary">
              {{ $t("cancel") }}
            </v-btn>
            <v-btn
              right
              width="116"
              color="primary"
              @click="confirmUnassign"
            >
              {{ $t("confirm") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import DownloadMixin from "@/mixins/DownloadMixin";
import loadingMixin from "@/mixins/LoadingMixin";
import PermissionsMixin from "@/mixins/PermissionsMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";

export default {
  created() {
  },
  props: ['bulkStageList', 'membershipTypeVal'],
  computed: {},
  async mounted() {
    const {data} = await this.$http.get('user/activation/dashboard')
    this.activationKeyData = data.data;
    this.tableData = this.bulkStageList.stagedData
  },
  watch: {
    tableOptions: {
      async handler() {
        // call api to fetch
      },
      deep: true,
    },
  },
  components: {},
  methods: {
    singleRemove(itemId) {
      this.tableData = this.tableData.filter(el => {
      if(el.index!== itemId) {
        return true
      }
      })
    },
    removeRecordsFromTable() {
      let keyArr = []
      keyArr = this.selected.map(el => el.index)
      this.tableData = this.tableData.filter(el => {
        if(keyArr.includes(el.index)) {
          return false
        } else {
          return true
        }
      })
      this.selected = []
      this.showRemoveRecords = false
    },
    confirmUnassign() {
      let keyArr = []
      keyArr = this.selected.filter(el => {
          if(el.license_key) {
              return el.license_key
          }
      }).map(el => el.license_key)

      if(keyArr.length > 0) {
        this.tableData = this.tableData.map(el => {
          if(keyArr.includes(el.license_key)){
            el.license_key = null
          }
          return el
        })
      } 
      this.showUnassigned = false
    },
    goBack() {
        this.$router.go(-1);
    },
    getRowClass(item) {
      console.log(item, "item")
      if(!item.success) {
        return "row-red-border"
      }
    },
    rowClicked(e) {
        console.log(e, "asdasd")
    },
    toggleCheckBox(e) {
        console.log(e, "asdasd")
    },
    async confirmBulkUpload() {


      let finalData = this.bulkStageList.stagedData.filter(el => el.license_key)
      await this.$http
            .post("/user/activation/csv/v2", {stagedData: finalData}, {

            })

      this.$router.push({ name: "Users" })
    },
    pageChange(t) {
      if (t) {
        this.tableOptions.page = this.tableOptions.page + 1;
      } else {
        this.tableOptions.page = this.tableOptions.page - 1;
      }
    }
  },
  data() {
    return {
      tableData: [],
      activationKeyData: {},
      showRemoveRecords: false,
      showUnassigned: false,
      selected: [],
      usersList: [
    {
        "index": 0,
        "first_name": "login revamp5",
        "last_name": "doe",
        "email": "dsgdsg@outlook.com",
        "country_code": 62,
        "country": "Indonesia",
        "mobile": "",
        "activation_key": "qVtAVNcHiwz28zASqzhBK8",
        "validation_code": 104,
        "license_key": null,
        "success": false
    },
    {
        "index": 1,
        "first_name": "login revamp6",
        "last_name": "doe",
        "email": "dsgdgdgl@outlook.com",
        "country_code": 351,
        "country": "Portugal",
        "mobile": 54341231,
        "activation_key": "sxWgaxgEZapoTK8DRQsga1",
        "validation_code": 104,
        "license_key": null,
        "success": false
    },
    {
        "index": 2,
        "first_name": "login revamp7",
        "last_name": "doe",
        "country_code": 91,
        "country": "India",
        "mobile": 9826137937,
        "activation_key": "n1o6e6tu5ziaVPnxKQBKhe",
        "validation_code": 103,
        "license_key": "5swP1Y7X1oTMXdwhEsrhiN",
        "success": true
    }
],
      openStats: [0, 1],

      membershipType: [],
      search: "",
      from: 0,
      to: 0,
      totalUsers: 0,
      tableOptions: {
        page: 1,
        sortBy: [],
        sortDesc: [],
      },
      totalPages: 1,
      headers: [
        {
          text: "Activation Key",
          align: "start",
          value: "license_key",
          class: "black--text",
        },
        {
          text: "First Name",
          align: "start",
          value: "first_name",
          class: "black--text",
        },
        {
          text: "Last Name",
          align: "center",
          value: "last_name",
          class: "black--text",
          sortable: false,
        },
        {
          text: "Email",
          align: "center",
          value: "email",
          class: "black--text",
          sortable: false,
        },
        {
          text: "Mobile Number",
          align: "center",
          value: "mobile",
          class: "black--text",
          sortable: false,
        },
        {
          text: "",
          align: "center",
          value: "action",
          class: "black--text",
          sortable: false,
        },
        {
          text: "index",
          value: "index",
          align: 'd-none',
          class: 'd-none'
        },
      ],
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: true,
          to: "/",
        },
        {
          text: this.$t("userslist.bulkUploadUser"),
          disabled: true,
          to: "breadcrumbs_link_1",
        },
      ],
    };
  },
  mixins: [loadingMixin, getPermittedActions, DownloadMixin, PermissionsMixin],
};
</script>

<style lang="scss" >
table {
  border-collapse: collapse;
}
.row-red-border {
  border: 2px solid red;
}
.text-d-none {
  display: none;
}
.letterSpacing {
  letter-spacing: 0;
}

.my-awesome-table {
  table-layout: fixed;
}

::v-deep .v-tab:hover {
  background-color: #caf1e2;
  color: $primary_color !important;
}

::v-deep .green-shadow:hover {
  background-color: $primary_color;
  color: white;
}

::v-deep .my-custom-dialog {
  position: absolute;
  top: 0;
  min-height: 100%;
  right: 0;
  margin-right: 0px;
  margin-top: 0px;
}

::v-deep .square {
  width: 1vw;
  height: 1vw;
}

::v-deep .xxxx {
  border: 2px solid black;
}
</style>
