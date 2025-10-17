<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-4">
        <h2>{{ $t("esgPlatform.progress.esgProgress") }}</h2>
      </div>
      <v-card elevation="0" class="px-5 mt-7">
        <v-card-text>
          <v-row style="margin-left:-30px; margin-bottom: 20px; margin-top: 15px;">
            <v-col cols="12">
              <v-data-table :headers="tableHeaders" :items="companies" :items-per-page="10" :footer-props="{
                'items-per-page-options': [5, 10, 25, 50],
              }" item-key="id" hide-default-footer :loading="loading" :options.sync="options"
                :server-items-length="totalProgressList" :loading-text="$t('loadingData')
                  ">
                <template v-slot:top="{ }">
                  <div class="d-flex mt-5">

                    <div class="ml-3" style="width: 220px;">
                      <label for="text">{{ $t("esgPlatform.progress.companyName") }}</label>
                      <v-text-field style="width: 280px; margin-top: 3px; " prepend-inner-icon="mdi-magnify" outlined
                        height="5px" :placeholder="$t('esgPlatform.progress.search')" dense v-model="search"
                        @input="searchQuery" class="shrink">
                      </v-text-field>
                    </div>

                    <div class="ml-3" style="width: 250px;">
                      <label for="text">{{ $t("esgPlatform.progress.country") }}</label>
                      <v-autocomplete style="width: 250px; " v-model="countryModel" item-text="name" item-value="name"
                        :items="countries" :placeholder="$t('esgPlatform.progress.select')" @change="filterData"
                        outlined dense clearable>
                      </v-autocomplete>
                    </div>

                    <div class="ml-3" style="width: 250px;">
                      <label for="text">{{ $t('esgPlatform.progress.standard') }}</label>
                      <v-autocomplete clearable style="width: 250px;" :placeholder="$t('esgPlatform.progress.select')"
                        v-model="selectedStandard" item-text="title" item-value="title" :items="standards"
                        @change="filterData" outlined dense>
                      </v-autocomplete>
                    </div>

                    <v-spacer></v-spacer>
                    <div class="py-1 title">
                      {{ fromProgressList }} -
                      {{ toProgressList }} {{ $t('of') }}
                      {{ totalProgressList }}
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
                <template v-if="companies.length" v-slot:body="{ items }">
                  <tbody>
                    <tr v-for="item in items" :key="item.id" style="position: relative; width: 0; height: 0"
                      @mouseover="selectItem(item)" @mouseleave="selectItem(false)">
                      <template v-for="h in tableHeaders">

                        <td class="text-truncate" :key="h.value + '_name'" v-if="h.value == 'name'">
                          {{ item.name ? item.name : "-" }}
                        </td>

                        <td class="text-truncate" :key="h.value + '_country'" v-else-if="h.value == 'country'">
                          {{ item.country ? item.country : "-" }}
                        </td>

                        <td class="text-truncate" :key="h.value + '_subOrganizations'"
                          v-else-if="h.value == 'subOrganizations'">
                          {{ item.subOrganizations ? item.subOrganizations : "-" }}
                        </td>

                        <td class="text-truncate" :key="h.value + '_protocolDetails'" v-else-if="h.value == 'protocolDetails'">
                          {{ item?.protocolDetails?.length }}
                        </td>
                        <td class="text-truncate" :key="h.value + '_data-table-expand'"
                          v-else-if="h.value == 'data-table-expand'">
                          <v-icon @click="toggleExpand(item)">
                            {{ item.expanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                          </v-icon>
                        </td>
                      </template>
                      <!-- <template v-if="item.expanded">
  <tr>
    <td :colspan="tableHeaders.length">
      <v-container fluid>
        <v-row v-for="protocol in item.protocolDetails" :key="protocol.title" class="my-3">
          <v-col cols="12" sm="6" md="4" lg="3" class="text-center">
            <v-img class="img-center" :src="protocol.image" width="100" height="100"></v-img>
          </v-col>

          <v-col cols="12" sm="6" md="8" lg="9">
            <h3>{{ protocol.title }}</h3>
            <p>{{ protocol.standard }}</p>
            <p>{{ protocol.subOrganizations }} {{ $t('esgPlatform.progress.subOrganizations') }}</p>
            <v-progress-linear :value="protocol.progress" height="10" color="primary"></v-progress-linear>
          </v-col>
        </v-row>
      </v-container>
    </td>
  </tr>
</template> -->
                    </tr>
                  </tbody>
                </template>

                <template v-slot:footer></template>
              </v-data-table>


              <!-- Show empty state -->
              <template v-slot:no-data>
                <v-alert type="info">{{ $t("noDataAvailable") }}</v-alert>
              </template>

            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
  </div>


</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import download from "@/mixins/DownloadMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import DateMixin from "@/mixins/DateMixin";
import { getCountries } from "country-state-picker";
import moment from 'moment';
import RoleMixin from "@/mixins/RoleMixin";
import { mapGetters } from "vuex";

export default {
  components: {
  },
  created() {
  },
  async mounted() {
    this.tableHeaders = this.headers;
    this.selectedHeaders = this.allSelectedHeaders;
    this.totalProgressList = this.companies.length;
    this.loading = false;
  },
  watch: {

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
      return parseInt(Math.ceil(this.totalProgressList / 10))
    },
    eudrSettings() {
      return this.get_EUDR_Settings;
    },
    tableHeaders() {
    return this.headers.map(header => ({
      ...header,
      text: this.$t(header.text) 
    }));
  },
  },
  data() {
    return {
      debounceTimer: null,
      fromProgressList: 0,
      toProgressList: 0,
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
          text: this.$t("esgPlatform.progress.companyName"),
          align: "start",
          value: "name",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("esgPlatform.progress.country"),
          align: "start",
          value: "country",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("esgPlatform.progress.subOrganization"),
          align: "start",
          value: "subOrganizations",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("esgPlatform.progress.protocols"),
          align: "start",
          value: "protocolDetails",
          class: "black--text",
          sortable: true,
        },
        { text: "", value: "data-table-expand", sortable: false, },
      ],
      allSelectedHeaders: [
        this.$t('esgPlatform.progress.companyName'),
        this.$t('esgPlatform.progress.country'),
        this.$t('esgPlatform.progress.subOrganization'),
        this.$t("esgPlatform.progress.protocols"),
      ],
      menu: false,
      breadcrumbs: [
        {
          text: this.$t("esgPlatform.title"),
          disabled: false,
          exact: true,
        },
        {
          text: this.$t("esgPlatform.esgProgress"),
          disabled: true,
          href: "breadcrumbs_link_1",
        },
      ],
      companies: [
      {
        name: "Agrofresh",
        country: "Brazil",
        subOrganizations: 20,
        protocols: 2,
        expanded: false, // Controls row expansion
        protocolDetails: []
      },
      {
        name: "ABRAFRUTAS",
        country: "Brazil",
        subOrganizations: 20,
        protocols: 2,
        expanded: false,
        protocolDetails: [
          {
            title: "ABRAFRUTAS Protocol/Fruit Growers",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMxf2BEvMkM2jyV4p9Vri8A2WMGkv-ypH9uA&s",
            standard: "ESRS",
            standardIcon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMxf2BEvMkM2jyV4p9Vri8A2WMGkv-ypH9uA&s",
            subOrganizations: 14,
            progress: 75
          },
          {
            title: "ABRAFRUTAS Protocol/Service Providers",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMxf2BEvMkM2jyV4p9Vri8A2WMGkv-ypH9uA&s",
            standard: "ESRS",
            standardIcon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMxf2BEvMkM2jyV4p9Vri8A2WMGkv-ypH9uA&s",
            subOrganizations: 6,
            progress: 75
          }
        ]
      },
      {
        name: "United Fresh Produce Association",
        country: "United States",
        subOrganizations: 20,
        protocols: 2,
        expanded: false,
        protocolDetails: []
      },
      {
        name: "Farm Fresh Produce",
        country: "United States",
        subOrganizations: 20,
        protocols: 2,
        expanded: false,
        protocolDetails: []
      }
    ],
      totalProgressList: 0,
      totalProgressPages: 0,
      showActionsColumn: true,
      customizeMenu: false,
      customizeMenuAll: false,
      itemsPerPageOptions: [5, 10, 25, 50],
      itemsPerPageSlider: 1,
      selectedHeaders: [],
      selectedStandard: '',
      standards: [
        {
          id: 1,
          title: "European Sustainability Reporting Standards",
          description: "By choosing to align with the ESRS ESG Sustainability Plan, your organization commits to a comprehensive approach for monitoring and improving sustainability performance. This standard supports the integration of ESG practices across all operations, providing a structured pathway for reporting on key sustainability areas such as carbon footprint, resource management, labor practices, and governance policies.",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMxf2BEvMkM2jyV4p9Vri8A2WMGkv-ypH9uA&s", // Replace with actual image URL
          status: "ACTIVE",
          isDefault: false
        },
        {
          id: 2,
          title: "Corporate Sustainability Reporting Directive",
          description: "By choosing to align with the CSRD (Corporate Sustainability Reporting Directive), your organization commits to a rigorous framework for enhancing and reporting on sustainability performance. This directive establishes a robust structure for embedding ESG (Environmental, Social, and Governance) practices throughout operations, ensuring transparency and accountability across all sustainability dimensions.",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMxf2BEvMkM2jyV4p9Vri8A2WMGkv-ypH9uA&s", // Replace with actual image URL
          status: "INACTIVE",
          isDefault: false
        },
      ],
    };
  },
  methods: {

    async resetDefaut() {
      this.tableHeaders = this.headers;
      this.selectedHeaders = this.allSelectedHeaders;
      this.menu = false;
      // await this.getBlends();
    },

    async resetTableStructure() {
      this.tableHeaders = this.headers.filter((header) =>
        this.selectedHeaders.includes(header.text)
      );
      this.options.limit = this.itemsPerPageOptions[
        this.itemsPerPageSlider
      ];
      // await this.getBlends();
      (this.customizeMenu = false), (this.customizeMenuAll = false);
    },

    getDateFormat(date) {
      return moment(date).format("DD/MM/YYYY");
    },

    filterData() {
      this.options.page = 1;
      // this.getBlends();
    },
    searchQuery() {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => {
        this.options.page = 1;
        // this.getBlends();
      }, 500)
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
      // this.getBlends();
    },
    reportPageChange(t) {
      if (t) this.options.page = this.options.page + 1;
      else this.options.page = this.options.page - 1;
      // this.getBlends();  
    },
    toggleExpand(item) {
      item.expanded = !item.expanded;
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