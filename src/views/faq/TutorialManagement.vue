<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-4">
        <h2>{{ $t("tutorials.title") }}</h2>
        <v-spacer></v-spacer>
        <v-btn color="primary" dark class="mr-2 mb-2" @click="openCreateDialog">
          {{ $t("tutorials.createTutorial") }}
        </v-btn>
      </div>


      <!-- Tutorials List -->
      <v-card elevation="0" class="px-5 mt-7">
        <v-card-text>
          <v-row style="margin-left:-30px; margin-bottom: 20px; margin-top: 15px;">
            <v-col cols="12">
              <v-data-table :headers="tableHeaders" :items="tutorials" :items-per-page="10" :footer-props="{
                'items-per-page-options': [5, 10, 25, 50],
              }" item-key="id" hide-default-footer :loading="loading" :options.sync="options"
                :server-items-length="pagination.total_items" :loading-text="$t('loadingData')
                  ">
                <template v-slot:top="{}">
                  <div class="d-flex mt-5 align-end">

                    <div class="ml-3" style="width: 250px;">
                      <label for="text">{{ $t("tutorials.organization") }}</label>
                      <v-autocomplete ref="organizationAutocomplete" style="width: 250px; " v-model="filters.organization_id" item-text="name" item-value="id"
                        :items="organizations" :placeholder="$t('tutorials.selectOrganization')" @change="onOrganizationFilterChange"
                        @input="onOrganizationInput" @click:clear="onOrganizationClear" outlined dense clearable>
                      </v-autocomplete>
                    </div>

                    <div class="ml-3" style="width: 250px;">
                      <label for="text">{{ $t('tutorials.userType') }}</label>
                      <v-autocomplete clearable style="width: 250px;" :placeholder="$t('select')" v-model="filters.user_type" item-text="text" item-value="value"
                        :items="userTypeFilterOptions" @change="filterData" outlined dense>
                      </v-autocomplete>
                    </div>

                    <v-spacer></v-spacer>
                    <div class="d-flex align-center mb-5">
                      <div class="py-1 title mr-4">
                        {{ fromTutorialsList }} -
                        {{ toTutorialsList }} {{ $t('of') }}
                        {{ pagination.total_items }}
                      </div>
                      <v-btn class="mx-1" fab small outlined color="primary" :disabled="options.page <= 1"
                        @click="reportPageChange(false)">
                        <v-icon dark>
                          mdi-chevron-left
                        </v-icon>
                      </v-btn>
                      <v-btn class="mx-1" fab small outlined color="primary" :disabled="options.page >= totalPages"
                        @click="reportPageChange(true)">
                        <v-icon dark>
                          mdi-chevron-right
                        </v-icon>
                      </v-btn>
                      <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" left :min-width="417">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn class="mx-1" fab small outlined color="primary" v-bind="attrs" v-on="on">
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
                  </div>
                </template>
                <template v-if="tutorials.length" v-slot:body="{ items }">
                  <tbody>
                    <tr v-for="item in items" :key="item.id" style="position: relative; width: 0; height: 0"
                      @mouseover="selectItem(item)" @mouseleave="selectItem(false)">
                      <template v-for="h in tableHeaders">

                        <td class="text-truncate" :key="h.value + '_title'"
                          v-if="h.value == 'title'">
                          {{ item.title }}
                        </td>

                        <td class="text-truncate" :key="h.value + '_organization'"
                          v-else-if="h.value == 'organization'">
                          <span v-if="item.organization">
                            {{ item.organization.name }}
                          </span>
                          <span v-else>
                            {{ $t('tutorials.global') }}
                          </span>
                        </td>

                        <td class="text-truncate" :key="h.value + '_userType'"
                          v-else-if="h.value == 'user_type'">
                          {{ getUserTypeText(item.user_type) }}
                        </td>

                        <td class="text-truncate" :key="h.value + '_status'"
                          v-else-if="h.value == 'is_active'">
                          <v-btn small rounded min-width="120" depressed class="green-button" height="40"
                              v-if="item.is_active">
                              {{ $t("tutorials.active") }}
                          </v-btn>
                          <v-btn small rounded min-width="120" depressed class="red-button" height="40"
                              v-else>
                              {{ $t("tutorials.inactive") }}
                          </v-btn>
                        </td>
                      </template>
                      <!-- Always render actions column -->
                      <td style="position: absolute; right: 10px; top:10px;">
                        <v-menu location="start">
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn icon v-bind="attrs" v-on="on">
                              <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                          </template>

                            <v-list>
                              <v-list-item @click="openEditDialog(item)">
                                <v-list-item-title>{{ $t('edit') }}</v-list-item-title>
                              </v-list-item>
                              <v-list-item @click="openDeleteDialog(item)">
                                <v-list-item-title class="red--text">{{ $t('delete') }}</v-list-item-title>
                              </v-list-item>
                            </v-list>
                        </v-menu>
                      </td>
                    </tr>
                  </tbody>
                </template>

                <template v-slot:footer></template>
              </v-data-table>

            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Create/Edit Dialog -->
      <v-dialog transition="dialog-top-transition" max-width="800" v-model="dialog" @click:outside="closeDialog">
        <v-card class="">
          <v-toolbar color="primary" class="sticky" dark flat dense>
            <v-toolbar-title class="font-weight-bold">
              {{ isEdit ? $t('tutorials.editTutorial') : $t('tutorials.createTutorial') }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon class="white--text" @click="closeDialog">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-form @submit.prevent="saveTutorial" ref="form" v-model="valid">
            <v-card-text>
              <v-row class="mt-5" no-gutters>
                <v-col cols="12">
                  <label for="title">{{ $t('tutorials.title') }}<span class="red--text">*</span></label>
                  <v-text-field 
                    outlined 
                    dense 
                    v-model="formData.title" 
                    :rules="titleRules"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <label for="description">{{ $t('tutorials.description') }}</label>
                  <v-textarea 
                    outlined 
                    name="description" 
                    v-model="formData.description"
                    rows="3"
                  ></v-textarea>
                </v-col>
                <v-col cols="12">
                  <label for="url">{{ $t('tutorials.url') }}<span class="red--text">*</span></label>
                  <v-text-field 
                    outlined 
                    dense 
                    v-model="formData.url" 
                    :rules="urlRules"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <label for="organization">{{ $t('tutorials.organization') }}</label>
                  <v-autocomplete
                    outlined
                    dense
                    v-model="formData.organization_id"
                    :items="organizations"
                    item-text="name"
                    item-value="id"
                    :hint="$t('tutorials.organizationHint')"
                    persistent-hint
                    clearable
                    :search-input.sync="organizationSearch"
                    :filter="filterOrganizations"
                    :no-data-text="$t('tutorials.noOrganizationsFound')"
                    :placeholder="$t('tutorials.searchOrganizations')"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <label for="user_type">{{ $t('tutorials.userType') }}<span class="red--text">*</span></label>
                  <v-select
                    outlined
                    dense
                    v-model="formData.user_type"
                    :items="userTypeOptions"
                    item-text="text"
                    item-value="value"
                    :hint="$t('tutorials.userTypeHint')"
                    persistent-hint
                    required
                  ></v-select>
                </v-col>
                <v-col cols="12" v-if="isEdit" class="pt-0 d-flex align-center">
                  <v-checkbox color="primary" v-model="formData.is_active"></v-checkbox>
                  <div class="ml-2">{{ $t('tutorials.isActive') }}</div>
                </v-col>
              </v-row>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="justify-end py-5">
              <v-btn outlined color="primary" @click="closeDialog">{{ $t('cancel') }}</v-btn>
              <v-btn color="primary" type="submit">{{ $t('submit') }}</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>

      <!-- Delete Confirmation Dialog -->
      <v-dialog transition="dialog-top-transition" max-width="400px" v-model="deleteDialog" @click:outside="deleteDialog = false">
        <v-card class="">
          <v-toolbar color="error" class="sticky" dark flat dense>
            <v-toolbar-title class="font-weight-bold">{{ $t('tutorials.deleteTutorial') }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon class="white--text" @click="deleteDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text class="pt-5">
            {{ $t('tutorials.deleteConfirmation', { title: selectedTutorial?.title }) }}
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="justify-end py-5">
            <v-btn outlined color="primary" @click="deleteDialog = false">{{ $t('cancel') }}</v-btn>
            <v-btn color="error" @click="confirmDelete">{{ $t('delete') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import TutorialService from '../../_services/TutorialService'
export default {
  name: 'TutorialManagement',
  data() {
    return {
      fromTutorialsList: 0,
      toTutorialsList: 0,
      loading: false,
      tutorials: [],
      organizations: [],
      organizationSearch: '',
      filterOrganizationSearch: '',
      dialog: false,
      deleteDialog: false,
      isEdit: false,
      valid: false,
      selectedTutorial: null,
      selectedItem: false,
      options: {
        limit: 10,
        page: 1,
      },
      formData: {
        title: '',
        description: '',
        url: '',
        organization_id: null,
        user_type: 'app',
        is_active: true
      },
      userTypeOptions: [
        { text: this.$t('tutorials.appUsers'), value: 'app' },
        { text: this.$t('tutorials.adminUsers'), value: 'admin' }
      ],
      userTypeFilterOptions: [
        { text: this.$t('tutorials.appUsers'), value: 'app' },
        { text: this.$t('tutorials.adminUsers'), value: 'admin' }
      ],
      filters: {
        organization_id: undefined,
        user_type: null,
        is_active: null
      },
      pagination: {
        current_page: 1,
        total_pages: 1,
        total_items: 0,
        items_per_page: 10
      },
      headers: [
        { text: this.$t('tutorials.title'), value: 'title', sortable: false },
        { text: this.$t('tutorials.organization'), value: 'organization', sortable: false },
        { text: this.$t('tutorials.userType'), value: 'user_type', sortable: false },
        { text: this.$t('tutorials.status'), value: 'is_active', sortable: false }
      ],
      allSelectedHeaders: [
        this.$t('tutorials.title'),
        this.$t('tutorials.organization'),
        this.$t('tutorials.userType'),
        this.$t('tutorials.status')
      ],
      menu: false,
      tableHeaders: [],
      selectedHeaders: [],
      itemsPerPageOptions: [5, 10, 25, 50],
      itemsPerPageSlider: 1,
      statusOptions: [
        { text: this.$t('tutorials.active'), value: true },
        { text: this.$t('tutorials.inactive'), value: false }
      ],
      titleRules: [
        v => !!v || this.$t('tutorials.titleRequired'),
        v => (v && v.length >= 3) || this.$t('tutorials.titleMinLength')
      ],
      urlRules: [
        v => !!v || this.$t('tutorials.urlRequired'),
        v => this.isValidUrl(v) || this.$t('tutorials.urlInvalid')
      ]
    }
  },
  computed: {
    breadcrumbs() {
      return [
        {
          text: this.$t('dashboard'),
          to: '/',
        },
        {
          text: this.$t('tutorials.title'),
          disabled: true
        },
      ];
    },
    totalPages() {
      return parseInt(Math.ceil(this.pagination.total_items / this.options.limit))
    }
  },
  mounted() {
    this.tableHeaders = this.headers;
    this.selectedHeaders = this.allSelectedHeaders;
    this.loadTutorials()
    this.loadOrganizations()
  },
  watch: {
    options: {
      handler(opt) {
        this.loadTutorials(opt);
      },
      deep: true,
    },
    'filters.organization_id': {
      handler(newValue, oldValue) {
        // Watch for changes in organization filter and trigger data reload
        // Only trigger if it's not already undefined (to avoid double triggering on clear)
        if (newValue !== oldValue && newValue !== undefined) {
          this.filterData();
        }
      }
    }
  },
  methods: {
    async loadTutorials(opt = null) {
      this.loading = true
      try {
        const requestParams = {
          page: this.options.page || 1,
          limit: this.options.limit || 10,
          user_type: this.filters.user_type || null,
          is_active: this.filters.is_active || null,
        };
        
        // Include organization_id if it's defined (null for global, number for specific org)
        if (this.filters.organization_id !== undefined) {
          // Convert null to string 'null' for proper URL encoding
          requestParams.organization_id = this.filters.organization_id === null ? 'null' : this.filters.organization_id;
        }

        if (opt?.sortBy?.length) {
          requestParams.orderField = opt.sortBy[0];
          requestParams.order = opt.sortDesc[0] ? "DESC" : "ASC";
        }

        const response = await TutorialService.getAllTutorials(requestParams)
        this.tutorials = response.data.tutorials
        this.pagination = response.data.pagination

        this.fromTutorialsList = this.pagination.total_items > 0
          ? (this.options.page - 1) * this.options.limit + 1
          : 0;
        this.toTutorialsList = this.options.page * this.options.limit > this.pagination.total_items
          ? this.pagination.total_items
          : this.options.page * this.options.limit

        this.loading = false
      } catch (error) {
        console.error('Error loading tutorials:', error)
        this.$notify({
          title: this.$t('tutorials.loadError'),
          type: 'error'
        })
        this.loading = false
      }
    },
    async loadOrganizations() {
      try {
        // Fetch all organizations from the admin API
        const response = await this.$http.get('/organization/all')
        const orgs = response.data.data || []
        
        // Add Global option at the beginning
        this.organizations = [
          { id: null, name: this.$t('tutorials.global') },
          ...orgs.map(org => ({
            id: org.id,
            name: org.name
          }))
        ]
      } catch (error) {
        console.error('Error loading organizations:', error)
        // Fallback to hardcoded organizations if API fails
        this.organizations = [
          { id: null, name: this.$t('tutorials.global') },
          { id: 1, name: 'PT Surveyor Indonesia' },
          { id: 2, name: 'National Coffee Cooperative Union' }
        ]
      }
    },
    openCreateDialog() {
      this.isEdit = false
      this.formData = {
        title: '',
        description: '',
        url: '',
        organization_id: null,
        user_type: 'app',
        is_active: true
      }
      this.dialog = true
    },
    openEditDialog(tutorial) {
      this.isEdit = true
      this.selectedTutorial = tutorial
      this.formData = { 
        title: tutorial.title,
        description: tutorial.description,
        url: tutorial.url,
        organization_id: tutorial.organization_id,
        user_type: tutorial.user_type || 'app',
        is_active: tutorial.is_active
      }
      this.dialog = true
    },
    openDeleteDialog(tutorial) {
      this.selectedTutorial = tutorial
      this.deleteDialog = true
    },
    closeDialog() {
      this.dialog = false
      this.isEdit = false
      this.selectedTutorial = null
      this.$refs.form?.reset()
    },
    async saveTutorial() {
      if (!this.$refs.form.validate()) return
      
      try {
        if (this.isEdit) {
          await TutorialService.updateTutorial(this.selectedTutorial.id, this.formData)
          this.$notify({
            title: this.$t('tutorials.updateSuccess'),
            type: 'success'
          })
        } else {
          await TutorialService.createTutorial(this.formData)
          this.$notify({
            title: this.$t('tutorials.createSuccess'),
            type: 'success'
          })
        }
        this.closeDialog()
        this.loadTutorials()
      } catch (error) {
        console.error('Error saving tutorial:', error)
        this.$notify({
          title: this.$t('tutorials.saveError'),
          type: 'error'
        })
      }
    },
    async confirmDelete() {
      try {
        await TutorialService.deleteTutorial(this.selectedTutorial.id)
        this.$notify({
          title: this.$t('tutorials.deleteSuccess'),
          type: 'success'
        })
        this.deleteDialog = false
        this.loadTutorials()
      } catch (error) {
        console.error('Error deleting tutorial:', error)
        this.$notify({
          title: this.$t('tutorials.deleteError'),
          type: 'error'
        })
      }
    },
    onPageChange(page) {
      this.pagination.current_page = page
      this.loadTutorials()
    },
    onItemsPerPageChange(itemsPerPage) {
      this.pagination.items_per_page = itemsPerPage
      this.pagination.current_page = 1
      this.loadTutorials()
    },
    isValidUrl(string) {
      try {
        new URL(string)
        return true
      } catch (_) {
        return false
      }
    },
    filterOrganizations(item, queryText) {
      // Custom filter function for organization search
      const searchText = queryText.toLowerCase()
      const organizationName = item.name.toLowerCase()
      
      // Always show Global option
      if (item.id === null) {
        return true
      }
      
      // Filter other organizations by name
      return organizationName.includes(searchText)
    },
    // New methods from BlendList design
    filterData() {
      this.options.page = 1;
      this.loadTutorials();
    },
    onOrganizationClear() {
      // Handle clear button click - explicitly clear the filter
      this.filters.organization_id = undefined;
      // Force clear the autocomplete input
      if (this.$refs.organizationAutocomplete) {
        this.$refs.organizationAutocomplete.$refs.input.value = '';
      }
      this.filterData();
    },
    onOrganizationInput(value) {
      // Handle input event - this fires when the field is cleared or typed in
      if (value === '' || value === undefined) {
        this.filters.organization_id = undefined;
        this.filterData();
      }
    },
    onOrganizationFilterChange(value) {
      // Handle the organization filter change
      // If value is empty string, undefined, or null (when clearing), set it to undefined (no filter)
      // If value is explicitly null (Global selected), keep it as null (global filter)
      // Otherwise, keep the value as is
      if (value === '' || value === undefined) {
        this.filters.organization_id = undefined;
      } else {
        this.filters.organization_id = value;
      }
      this.filterData();
    },
    reportPageChange(t) {
      if (t) this.options.page = this.options.page + 1;
      else this.options.page = this.options.page - 1;
      this.loadTutorials();
    },
    async resetDefaut() {
      this.tableHeaders = this.headers;
      this.selectedHeaders = this.allSelectedHeaders;
      this.menu = false;
      await this.loadTutorials();
    },
    async resetTableStructure() {
      this.tableHeaders = this.headers.filter((header) =>
        this.selectedHeaders.includes(header.text)
      );
      this.options.limit = this.itemsPerPageOptions[
        this.itemsPerPageSlider
      ];
      await this.loadTutorials();
      this.menu = false;
    },
    selectItem(item) {
      this.selectedItem = item;
    },
    getUserTypeText(userType) {
      switch (userType) {
        case 'app': return this.$t('tutorials.appUsers')
        case 'admin': return this.$t('tutorials.adminUsers')
        default: return 'Unknown'
      }
    },
  }
}
</script>

<style lang="scss" scoped>
::v-deep .sticky {
  position: sticky;
  top: 0;
  z-index: 10000 !important;
  opacity: 1 !important;
}
.v-data-table {
  border-radius: 12px;
}

.green-button {
  background-color: #e8f5e8 !important;
  border: 2px solid #4caf50 !important;
  color: #4caf50 !important;
}

.red-button {
  background-color: #ffebee !important;
  border: 2px solid #f44336 !important;
  color: #f44336 !important;
}


.gray-button {
  background-color: #e8e8e8 !important;
  border: 2px solid #000000 !important;
  color: #000000 !important;
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
</style>

