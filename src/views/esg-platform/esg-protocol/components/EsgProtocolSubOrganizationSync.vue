<template>
  <div class="wrapper mb-5 pa-5">
    <h2 class="pb-5 pt-4"> {{ $t('esgPlatform.selectSubOrg')}} </h2>
    <p> {{ $t('esgPlatform.selectSubOrgMsg') }} </p>
    <div class="filter-section">
      
    </div>
    <div class="data-table mb-10">
      <v-data-table item-key="id" show-select v-model="selectFromTableSubOrganization" :headers="organizationHeaders"
        :items="subOrganizations" :items-per-page="10" hide-default-footer :loading="loading"
        :options.sync="tableOptions" :loading-text="$t('loadingData')
          ">
        <template v-slot:top="{ }">
          <div class="d-flex mt-5 mb-2">
            <v-spacer></v-spacer>
            <div class="d-flex justify-center align-center">
              <div class="py-1 title">
                {{ from }} - {{ to }} {{ $t('of') }}
                {{ totalSubOrganization }}
              </div>
              <v-btn class="mx-2" fab small outlined color="primary" :disabled="tableOptions.page <= 1"
                @click="pageChange(false)">
                <v-icon dark>
                  mdi-chevron-left
                </v-icon>
              </v-btn>
              <v-btn class="mx-2" fab small outlined color="primary" :disabled="tableOptions.page >= totalPages"
                @click="pageChange(true)">
                <v-icon dark>
                  mdi-chevron-right
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
                        <v-list-item-title>{{
                          $t("farm.customization") }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider></v-divider>
                    <div class="pl-3 pt-2 font-weight-normal">
                      {{ $t("farm.recordsPerpage") }}
                    </div>
                    <v-list-item>
                      <v-list-item-content>
                        <v-slider v-model="itemsPerPageSlider" :tick-labels="itemsPerPageOptions" :max="6" step="1"
                          ticks="always" tick-size="4"></v-slider>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider class="mt-n3"></v-divider>
                  </v-list>
                  <v-card-text>
                    <v-container fluid>
                      <v-row>
                        <v-col class="mt-n9" cols="6" v-for="header in organizationHeaders" :key="header.value">
                          <v-checkbox v-if="header.text" v-model="selectedHeaders" :label="header.text" color="primary"
                            :value="header.text" hide-details :disabled="header.text == 'ID'"></v-checkbox>
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
            </div>
          </div>
        </template>
        <template v-slot:item.product="{ item }">
           {{ item?.product?.length ? item?.product?.map(x => x.name).join(', ') : '' }}
        </template>
        <template v-slot:item.status="{ item }">
          <v-btn small rounded min-width="200" depressed class="green-button"
              height="40" v-if="item.status">
              {{ $t("esgPlatform.common.active") }}
          </v-btn>
          <v-btn small rounded min-width="200" depressed class="red-button"
              height="40" v-else>
              {{ $t("esgPlatform.common.deactivated") }}
          </v-btn>
        </template>
        <template v-slot:footer></template>
      </v-data-table>
    </div>

    <div>
      <h2 class="mb-5"> {{ $t('esgPlatform.selectedSubOrg') }} </h2>
      <div class="selected-sub-organization">
        <div class="sub-organization" v-if="selectFromTableSubOrganization.length">
          <p v-for="(item, key) in selectFromTableSubOrganization" :key="key">
            {{ item.name }}
            <v-icon color="red" aria-hidden="false" @click.prevent="removeSubOrganization(item._id)">
              mdi-close
            </v-icon>
          </p>

        </div>
      </div>
    </div>

    <div class="d-flex flex-end mt-5">
      <v-btn class="mr-2" @click="cancel">
        {{ $t('cancel') }}
      </v-btn>
      <v-btn color="primary" dark class="mr-2" @click="assignProtocolToSubOrganization">
        {{ $t("esgPlatform.next") }}
      </v-btn>
    </div>
  </div>
</template>
<script>
import EsgService from '@/_services/EsgService';
import loadingMixin from "@/mixins/LoadingMixin";

export default {
  data() {
    return {
      protocolId: this.$route.params.id || null,
      document: null,
      selectFromTableSubOrganization: [],
      organizationHeaders: [
        {
          text: 'Sub-Organization',
          align: "start",
          value: "name",
          class: "black--text",
          width: "200px",
        },
        {
          text: 'Lincense ID',
          align: "start",
          value: "lincense_id",
          class: "black--text",
        },
        // {
        //   text: this.$t('esgPlatform.dashboard.membershipPlan'),
        //   align: "start",
        //   value: "planId",
        //   class: "black--text",
        //   sortable: true,
        // },
        {
          text:  this.$t('esgPlatform.dashboard.country'),
          align: "start",
          value: "country",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t('esgPlatform.dashboard.products'),
          align: "start",
          value: "product",
          class: "black--text",
        },
        {
          text: this.$t('status'),
          align: "start",
          value: "status",
          class: "black--text",
        },
      ],
      totalPages: null,
      totalSubOrganization: 0,
      from: 0,
      to: 0,


      loading: false,
      tableOptions: {
        itemsPerPage: 10,
        limit: 10,
        page: 1,
      },
      itemsPerPageSlider: 5,
      itemsPerPageOptions: [5, 10, 25, 50],
      tableHeaders: [],
      selectedHeaders: [],
      allSelectedHeaders: [
        'Sub-Organization',
        'Tax ID',
        'Membership Plan',
        'Country',
        'Product',
        'Status'
      ],
      subOrganizations: [],
    }
  },
  mounted() {
    this.getSubOrganizations();
    this.getSelectedSubOrganizations();
  },
  methods: {
    async getSubOrganizations() {
      this.loading = true;
      const params = {
        page: this.tableOptions.page,
        limit: this.tableOptions.limit,
        search: '',
      };
      try {
        const response = await EsgService.getMongoSubEntepriseDetail(params);
        this.loading = false;
        this.subOrganizations = response.data.rows;
        this.totalSubOrganization = response.data.count;
        this.totalPages = Math.ceil(this.totalSubOrganization / this.tableOptions.itemsPerPage);

        this.from = (this.tableOptions.page - 1) * this.tableOptions.itemsPerPage + 1;
        this.to = Math.min(
          this.tableOptions.page * this.tableOptions.itemsPerPage,
          this.totalSubOrganization
        );
        this.syncSelectedSubOrganizations();
      } catch (error) {
        this.loading = false;
        console.error('Error fetching sub-organizations:', error);
      } finally {
        this.loading = false;
      }
    },

    async getSelectedSubOrganizations() {
      try {
        const response = await EsgService.getSelectedSubOrganization(this.protocolId);
        this.selectFromTableSubOrganization = response.data;
      } catch (error) {
        console.error('Error fetching selected sub-organizations:', error);
      }
    },

    syncSelectedSubOrganizations() {
      this.selectFromTableSubOrganization = this.subOrganizations.filter((org) =>
        this.selectFromTableSubOrganization.some((selectedOrg) => selectedOrg._id === org._id)
      );
    },

    removeSubOrganization(_id) {
      this.selectFromTableSubOrganization = this.selectFromTableSubOrganization.filter(
        (item) => item._id !== _id
      );
    },

    async assignProtocolToSubOrganization() {
      if (!this.selectFromTableSubOrganization.length) {
        this.$notify({
          title: 'Select Sub-Organization',
          text: 'Please select at least one sub-organization.',
          type: 'error',
        });
        return;
      }

      this.startLoading();
      const subOrganizationIds = this.selectFromTableSubOrganization.map((x) => x._id);

      try {
        await EsgService.assignSubOrganizationToProtocol(this.protocolId, {
          subOrganizations: subOrganizationIds,
        });

        this.$notify({
          title: 'Sub-Organization Successfully Assigned',
          text: '',
          type: 'success',
        });

        // Emit the selected sub-organizations to the parent component
        this.$emit('next', this.selectFromTableSubOrganization);
      } catch (error) {
        this.$notify({
          title: 'Unable to Assign Sub-Organization',
          text: '',
          type: 'error',
        });
      } finally {
        this.stopLoading();
      }
    },

    pageChange(isChange) {
      if (isChange) this.tableOptions.page = this.tableOptions.page + 1;
      else this.tableOptions.page = this.tableOptions.page - 1;
      this.getSubOrganizations();
    },
    async resetDefaut() {
      this.tableHeaders = this.organizationHeaders;
      this.selectedHeaders = this.allSelectedHeaders;
    },
    async resetTableStructure() {
      this.tableHeaders = this.organizationHeaders.filter((header) =>
        this.selectedHeaders.includes(header.text)
      );
      this.reportOptions.itemsPerPage = this.itemsPerPageOptions[
        this.itemsPerPageSlider
      ];
    },
    cancel() {
      this.$emit('cancel');
    },
  },
  mixins: [loadingMixin]
}
</script>

<style scoped>
::v-deep .selected-sub-organization {
  background: #ececee;
  padding: 11px;
}

::v-deep .selected-sub-organization p {
  background: #fff;
  padding: 4px;
  margin: 6px 0px;
}

::v-deep .sub-organization {
  display: flex;
  gap: 10px;
}

::v-deep .flex-end {
  justify-content: flex-end;
}
</style>