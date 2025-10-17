<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-4">
        <h2>{{ $t("approvalFlow.cooperative.listOfCooperatives") }}/{{ $t("approvalFlow.cooperative.exporter") }}</h2>
        <v-spacer></v-spacer>
        <v-btn color="primary" dark class="mr-2 mb-2" @click="handleCreateCooperative">
          {{ $t("approvalFlow.cooperative.addCooperatives") }}
        </v-btn>
      </div>
      <v-card elevation="0" class="px-5 mt-7">
        <v-card-text>
          <v-row style="margin-left:-30px; margin-bottom: 20px; margin-top: 15px;">
            <v-col cols="12">
              <v-data-table :headers="tableHeaders" :items="cooperatives" :items-per-page="options.limit" :footer-props="{
                'items-per-page-options': [5, 10, 25, 50],
              }" item-key="id" hide-default-footer :loading="loading" :options.sync="options"
                :server-items-length="totalCooperatives" :loading-text="$t('loadingData')
                  ">
                <template v-slot:top="{ }">
                  <div class="d-flex mt-5">

                    <div class="ml-3" style="width:180px;">
                      <label for="text">&nbsp;</label>
                      <v-text-field style="width: 180px; margin-top: 3px; " prepend-inner-icon="mdi-magnify" outlined
                        height="5px" :placeholder="$t('approvalFlow.cooperative.search')" dense v-model="search" @input="searchQuery"
                        class="shrink">
                      </v-text-field>
                    </div>

                    <div class="ml-3" style="width: 180px;">
                      <label for="text">{{ $t('approvalFlow.cooperative.type') }}</label>
                      <v-tooltip top color="00BD73" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                            v-on="on">
                            mdi-alert-circle
                          </v-icon>
                        </template>
                        <span>{{ $t("approvalFlow.cooperative.userTypeTT") }}</span>
                      </v-tooltip>
                      <v-autocomplete clearable style="width: 180px;" :placeholder="$t('approvalFlow.cooperative.all')" v-model="cooperativeType"
                        item-text="name" item-value="value" :items="allTypes" @change="filterData" outlined dense>
                      </v-autocomplete>
                    </div>

                    <div class="ml-3" style="width: 180px;">
                      <label for="text">{{ $t("approvalFlow.cooperative.location") }}</label>
                      <v-tooltip top color="00BD73" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                            v-on="on">
                            mdi-alert-circle
                          </v-icon>
                        </template>
                        <span>{{ $t("approvalFlow.cooperative.locationTT") }}</span>
                      </v-tooltip>
                      <v-text-field outlined
                        :placeholder="$t('approvalFlow.cooperative.search')" dense v-model="locationSearch"
                        class="shrink" @input="searchQueryLocation">
                      </v-text-field>
                    </div>


                    <v-spacer></v-spacer>
                    <div class="py-1 title">
                      {{ fromCooperativesList }} -
                      {{ toCooperativesList }} {{ $t('approvalFlow.cooperative.of') }}
                      {{ totalCooperatives }}
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
                  </div>
                </template>
                <template v-if="cooperatives.length" v-slot:body="{ items }">
                  <tbody>
                    <tr v-for="item in items" :key="item.id" style="position: relative; width: 0; height: 0"
                      @mouseover="selectItem(item)" @mouseleave="selectItem(false)">
                      <template v-for="h in tableHeaders">

                        <td class="text-truncate" :key="h.value + '_cooperative'" v-if="h.value == 'cooperative'">
                          <div class="d-flex align-center">
                            <v-avatar size="32" class="mr-3">
                              <v-img :src="item.logo" :alt="item.name"></v-img>
                            </v-avatar>
                            <div>
                              <div class="font-weight-medium">{{ item.name }}</div>
                              <div class="caption text-muted">{{ item.type }}</div>
                            </div>
                          </div>
                        </td>

                        <td class="text-truncate" :key="h.value + '_primaryContact'"
                          v-else-if="h.value == 'primaryContact'">
                          <div>
                            <div class="font-weight-medium">{{ item.primaryContact.name }}</div>
                            <div class="caption text-muted">{{ item.primaryContact.email }}</div>
                            <div class="caption text-muted">{{ item.primaryContact.phone }}</div>
                          </div>
                        </td>

                        <td class="text-truncate" :key="h.value + '_noOfFarms'" v-else-if="h.value == 'noOfFarms'">
                          {{ item.numberOfFarms }}
                        </td>

                        <td class="text-truncate" :key="h.value + '_cropsProducts'"
                          v-else-if="h.value == 'cropsProducts'">
                          {{ item.cropsProducts }}
                        </td>
                        <td class="text-truncate" :key="h.value + '_location'" v-else-if="h.value == 'location'">
                          {{ item.location.length > 30 ? item.location.substring(0, 30) + '...' : item.location }}
                        </td> 

                        <td class="text-truncate" :key="h.value + '_status'" v-else-if="h.value == 'status'">
                          <v-btn small rounded min-width="100" depressed class="green-button" height="32"
                            v-if="item.status === 'active'">
                            {{ $t("approvalFlow.cooperative.active") }}
                          </v-btn>
                          <v-btn small rounded min-width="100" depressed class="gray-button" height="32"
                            v-else-if="item.status === 'unregistered'">
                            {{ $t("approvalFlow.cooperative.unregistered") }}
                          </v-btn>
                          <v-btn small rounded min-width="100" depressed class="red-button" height="32"
                            v-else-if="item.status === 'deactivated'">
                            {{ $t("approvalFlow.cooperative.deactivated") }}
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
                              <v-list dense style="min-width: 150px;">

                                <v-list-item @click="viewCooperative(item)">
                                  <v-list-item-title>{{ $t('approvalFlow.cooperative.view') }}</v-list-item-title>
                                </v-list-item>
                                <!-- <v-list-item @click="editCooperative(item)">
                                  <v-list-item-title>{{ $t('approvalFlow.cooperative.edit') }}</v-list-item-title>
                                </v-list-item> -->
                                <v-list-item @click="deactivateCooperativeMethod(item.id,item.status)" color="red">
                                  <v-list-item-title :class="item.status === 'deactivate' ? 'black--text' : 'red--text'">{{ $t(item.status === 'active' ? 'Deactivate' : 'Activate') }}</v-list-item-title>
                                </v-list-item>
                                <!-- <v-list-item @click="deleteCooperative(item.id)">
                                  <v-list-item-title class="red--text">{{ $t('approvalFlow.cooperative.delete') }}</v-list-item-title>
                                </v-list-item> -->
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
      @cancel:action="confirmDeleteDialog = false" @continue:action="confirmDeleteCooperative" />

    <AddCooprateDialog :dialog="addEditDialog" :item="editingItem" @close="onCloseDialog" @save="onSaveCooperative" />
  </div>


</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import download from "@/mixins/DownloadMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import DateMixin from "@/mixins/DateMixin";
import ConfirmBox from "@/components/ConfirmBox";
import AddCooprateDialog from "@/views/deforestation/dds/approval-flow/cooperatives/components/AddCooprateDialog.vue";
import moment from 'moment';
import RoleMixin from "@/mixins/RoleMixin";
import { mapGetters } from "vuex";
import ApprovalFlowService from "@/_services/ApprovalFlowService";

export default {
  components: {
    ConfirmBox,
    AddCooprateDialog,
  },
  created() {
    this.getCooperatives();
  },
  async mounted() {
    this.tableHeaders = this.headers;
    this.selectedHeaders = this.allSelectedHeaders;
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
      const perPage = this.options.limit || 10;
      return Math.max(1, parseInt(Math.ceil(this.totalCooperatives / perPage)));
    },
    eudrSettings() {
      return this.get_EUDR_Settings;
    },
  },
  data() {
    return {
      debounceTimer: null,
      fromCooperativesList: 0,
      toCooperativesList: 0,
      search: "",
      locationSearch: "",
      cooperativeType: "",
      copyReport: [],
      loading: true,
      selectedItem: false,
      options: {
        limit: 10,
        page: 1,
      },
      headers: [
        {
          text: this.$t("approvalFlow.cooperative.cooperative"),
          align: "start",
          value: "cooperative",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("approvalFlow.cooperative.primaryContact"),
          align: "start",
          value: "primaryContact",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("approvalFlow.cooperative.noOfFarms"),
          align: "start",
          value: "noOfFarms",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("approvalFlow.cooperative.cropsProducts"),
          align: "start",
          value: "cropsProducts",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("approvalFlow.cooperative.location"),
          align: "start",
          value: "location",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("approvalFlow.cooperative.status"),
          align: "start",
          value: "status",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("approvalFlow.cooperative.actions"),
          align: "center",
          value: "action",
          class: "black--text",
          sortable: false,
        },
      ],
      allSelectedHeaders: [
        this.$t('approvalFlow.cooperative.cooperative'),
        this.$t('approvalFlow.cooperative.primaryContact'),
        this.$t('approvalFlow.cooperative.noOfFarms'),
        this.$t("approvalFlow.cooperative.cropsProducts"),
        this.$t("approvalFlow.cooperative.location"),
        this.$t("approvalFlow.cooperative.status"),
        this.$t("approvalFlow.cooperative.actions"),
      ],
      menu: false,
      breadcrumbs: [
        {
          text: this.$t("approvalFlow.cooperative.cooperative") + '/' + this.$t("approvalFlow.cooperative.exporter"),
          disabled: false,
          exact: true,
        }
      ],
      cooperatives: [],
      totalCooperatives: 0,
      totalCooperativePages: 0,
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
        title: this.$t("approvalFlow.cooperative.confirmDelete"),
        message: this.$t("approvalFlow.cooperative.areYouSureDeleteCooperative"),
        confirmBtnText: this.$t("approvalFlow.cooperative.delete"),
        cancelBtnText: this.$t("approvalFlow.cooperative.cancel"),
        confirmData: {},
      },
      allTypes: [
        {
          name: this.$t("approvalFlow.cooperative.all"),
          value: "",
        },
        { name: this.$t("approvalFlow.cooperative.cooperative"), value: "cooperative" },
        { name: this.$t("approvalFlow.cooperative.exporter"), value: "exporter" },
        { name: this.$t("approvalFlow.cooperative.cooperativeAndExporter"), value: "cooperative and exporter" },
      ],
      addEditDialog: false,
      editingItem: null,
      orderField: 'createdAt',
      order: 'DESC',
    };
  },
  methods: {
    async resetDefaut() {
      this.tableHeaders = this.headers;
      this.selectedHeaders = this.allSelectedHeaders;
      this.menu = false;
      await this.getCooperatives();
    },

    async resetTableStructure() {
      this.tableHeaders = this.headers.filter((header) =>
        this.selectedHeaders.includes(header.text)
      );
      this.options.limit = this.itemsPerPageOptions[
        this.itemsPerPageSlider
      ];
      await this.getCooperatives();
      (this.customizeMenu = false), (this.customizeMenuAll = false);
    },

    getDateFormat(date) {
      return moment(date).format("DD/MM/YYYY");
    },

    viewCooperative(item) {
      this.$router.push(`/approval-flow/cooperatives/view/${item.id}`);
    },

    async editCooperative(item) {
      try {
        this.startLoading();
        const response = await ApprovalFlowService.getCooperativeDetails(item.id);
        if (response.success && response.data) {
          this.editingItem = response.data;
          this.addEditDialog = true;
        } else {
          this.$notify({
            text: this.$t('approvalFlow.cooperative.errorFetchingCooperativeDetails'),
            type: 'error'
          });
        }
      } catch (error) {
        console.error('Error fetching cooperative details:', error);
        this.$notify({
          text: this.$t('approvalFlow.cooperative.errorFetchingCooperativeDetails'),
          type: 'error'
        });
      } finally {
        this.stopLoading();
      }
    },

    handleCreateCooperative() {
      this.editingItem = null;
      this.addEditDialog = true;
    },

    onCloseDialog() {
      this.addEditDialog = false;
      this.editingItem = null;
    },
    async onSaveCooperative(payload) {
      try {
        this.startLoading();
        let response;
        if (payload.id) {
          response = await ApprovalFlowService.updateCooperative(payload.id, payload);
        } else {
          response = await ApprovalFlowService.addCooperative(payload);
        }

        if (response.success) {
          this.$notify({
            text: payload.id ? this.$t('approvalFlow.cooperative.updatedSuccessfully') : this.$t('approvalFlow.cooperative.createdSuccessfully'),
            type: 'success'
          });

          await this.getCooperatives();
          this.onCloseDialog();
        } else {
          this.$notify({
            text: response.message || this.$t('approvalFlow.cooperative.errorSavingCooperative'),
            type: 'error'
          });
        }
      } catch (error) {
        this.$notify({
          text: `Try with Unique Email or ${error.message}` || this.$t('approvalFlow.cooperative.errorSavingCooperative'),
          type: 'error'
        });
      } finally {
        this.stopLoading();
      }
    },

    filterData() {
      this.options.page = 1;
      this.getCooperatives();
    },
    searchQuery() {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => {
        this.options.page = 1;
        this.getCooperatives();
      }, 500)
    },
    async getCooperatives() {
      this.loading = true;

      try {
        const params = {
          page: this.options.page,
          limit: this.options.limit,
          registrationType: this.cooperativeType,
          searchPhrase: this.search,
          address: this.locationSearch,
          orderField: this.orderField,
          order: this.order,
        };

        const response = await ApprovalFlowService.getCoorporativeLists(params);

        if (response.success) {
          // Map API response
          this.cooperatives = response.data.rows.map(item => ({
            id: item.id,
            name: item.subOrg?.name || item.fullName,
            type: item.translatedRegistrationType,
            logo:  item.subOrg?.logo || item.org?.logo,
            primaryContact: {
              name: item.fullName,
              email: item.email,
              phone: item.mobile || ''
            },
            numberOfFarms: item.NoOfFarmsPlanningtoonboard || 0,
            cropsProducts: item.subOrg?.products?.map(p => p.name).join(', ') || 'N/A',
            location: item.address || 'N/A',
            status: item.active ? 'active' : 'deactivated'
          }));

          this.totalCooperatives = response.data.totalCount;

          const perPage = this.options.limit;
          const currentPage = this.options.page;
          this.fromCooperativesList = this.totalCooperatives > 0
            ? (currentPage - 1) * perPage + 1
            : 0;
          this.toCooperativesList = currentPage * perPage > this.totalCooperatives
            ? this.totalCooperatives
            : currentPage * perPage;
        }
      } catch (error) {
        console.error('Error fetching cooperatives:', error);
        this.$notify({
          text: this.$t('approvalFlow.cooperative.errorFetchingCooperativesData'),
          type: 'error'
        });
      } finally {
        this.loading = false;
      }
    },
    getCooperativeType(userRoles) {
      if (!userRoles || userRoles.length === 0) return 'Cooperative';

      const roleIds = userRoles.map(role => role.id);

      if (roleIds.includes('supplier_owner') && roleIds.includes('indonesia_admin')) {
        return 'Cooperative + Exporter';
      } else if (roleIds.includes('supplier_owner')) {
        return 'Exporter';
      } else if (roleIds.includes('indonesia_admin')) {
        return 'Cooperative';
      }

      return 'Cooperative';
    },
    async deactivateCooperativeMethod(id, status) {
      this.status = status === 'active' ? 'deactivate' : 'activate';
      try {
        this.startLoading();
        const response = await ApprovalFlowService.deactivateCooperative(id, this.status);
        if (response.success) {
          this.$notify({
            text: this.$t('approvalFlow.cooperative.cooperativeDeactivatedSuccessfully'),
            type: 'success'
          });
        }
        await this.getCooperatives();
      } catch (error) {
        console.error('Error deactivating cooperative:', error);
        this.$notify({
          text: this.$t('approvalFlow.cooperative.errorDeactivatingCooperative'),
          type: 'error'
        });
      } finally {
        this.stopLoading();
      }
    },
    async deleteCooperative(id) {
      try {
        this.startLoading();
        const response = await ApprovalFlowService.deleteCooperative(id);
        if (response.success) {
          this.$notify({
            text: this.$t('approvalFlow.cooperative.cooperativeDeletedSuccessfully'),
            type: 'success'
          });
        }
        await this.getCooperatives();
      } catch (error) {
        console.error('Error deleting cooperative:', error);
        this.$notify({
          text: this.$t('approvalFlow.cooperative.errorDeletingCooperative'),
          type: 'error'
        });
      } finally {
        this.stopLoading();
      }
    },
    async confirmDeleteCooperative(action, confirmData) {
      this.startLoading();

      try {
        // TODO: Implement actual delete API call
        this.startLoading();
        await ApprovalFlowService.deleteCooperative(confirmData.id);

        // For now, just refresh the list
        await this.getCooperatives();

        this.$notify({
          text: this.$t("approvalFlow.cooperative.cooperativeDeletedSuccessfully"),
          type: "success",
        });
      } catch (error) {
        console.error('Error deleting cooperative:', error);
        this.$notify({
          text: this.$t('approvalFlow.cooperative.errorDeletingCooperative'),
          type: 'error'
        });
        } finally {
        this.stopLoading();
      }
    },

    selectItem(item) {
      this.selectedItem = item;
    },
    searchQueryLocation() {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => {
        this.options.page = 1;
        this.getCooperatives();
      }, 500)
    },
    resetSearchOnEmpty() {
      this.search = "";
      this.locationSearch = "";
      this.cooperativeType = "";
      this.options = {
        page: 1,
        limit: 10,
      };
      this.getCooperatives();
    },
    reportPageChange(t) {
      if (t) this.options.page = this.options.page + 1;
      else this.options.page = this.options.page - 1;
      this.getCooperatives();
    },
  },
  mixins: [loadingMixin, download, getPermittedActions, DateMixin, RoleMixin],
};
</script>


<style lang="scss" scoped>
.blue-button {
  background-color: #d0e6fe !important;
  /* Blue background */
  border: 2px solid #002287 !important;
  /* Blue border */
  color: #002287 !important;
}

.orange-button {
  background-color: #fff7ec !important;
  /* Orange background */
  border: 2px solid #ffa826 !important;
  /* Orange border */
  color: #ffa826 !important;
}

.green-button {
  background-color: #e8f5e8 !important;
  /* Green background */
  border: 2px solid #50b053 !important;
  /* Green border */
  color: #4caf50 !important;
}

.red-button {
  background-color: #ffeaea !important;
  /* Red background */
  border: 2px solid #f44336 !important;
  /* Red border */
  color: #f44336 !important;
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
  white-space: nowrap !important;
  overflow: hidden;
  text-overflow: ellipsis;
}

::v-deep .v-data-table-header th {
  white-space: nowrap !important;
  min-width: fit-content;
}

::v-deep .v-data-table-header th:nth-child(3) {
  min-width: 120px;
}

::v-deep .v-data-table-header th:nth-child(4) {
  min-width: 150px;
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
  /* Gray background */
  border: 2px solid #000000 !important;
  /* Black border */
  color: #000000 !important;
}
</style>