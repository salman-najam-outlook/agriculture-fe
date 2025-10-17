<template>
    <div>
      <breadcrumb :items="breadcrumbs"></breadcrumb>
      <v-container fluid>
        <div class="d-flex mb-4">
          <h2>{{ $t("blends.blendSettings.blendSettings") }}</h2>
          <v-spacer></v-spacer>
          <v-btn v-if="isOwner" color="primary" dark class="mr-2 mb-2" @click="redirectToDDSSUmmary">
            {{ $t("blends.blendSettings.importBlends") }}
          </v-btn>
          <v-btn v-if="isOwner" color="primary" dark class="mr-2 mb-2" @click="handleCreateBlendSettings">
            {{ $t("blends.blendSettings.addNewBlend") }}
          </v-btn>
        </div>
        <v-card elevation="0" class="px-5 mt-7">
          <v-card-text>
            <v-row style="margin-left:-30px; margin-bottom: 20px; margin-top: 15px;">
              <v-col cols="12">
                <v-data-table :headers="tableHeaders" :loading="listofBlendLoading" :items="blendSettings" :items-per-page="10" item-key="id" :footer-props="{
                        'items-per-page-options': [10, 25, 50],
                    }" hide-default-footer :options.sync="options" 
                      :server-items-length="totalBlendSettings" :loading-text="$t('loadingData')
                  ">
                  <template v-slot:top="{ }">
                    <div class="d-flex mt-5">
  
                      <div class="ml-3" style="width: 280px;">
                        <label for="text">&nbsp;</label>
                        <v-text-field style="width: 290px; " prepend-inner-icon="mdi-magnify" outlined height="5px"
                          :placeholder="$t('blends.blendSettings.searchTitle')" dense v-model="search" @input="searchQuery" class="shrink">
                        </v-text-field>
                      </div>
                      <v-spacer></v-spacer>
                      <div class="py-1 title">
                        {{ fromBlendSettings }} -
                        {{ toBlendSettings }} {{ $t('of') }}
                        {{ totalBlendSettings }}
                      </div>
                      <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page <= 1"
                        @click="reportPageChange(false)">
                        <v-icon dark>
                          mdi-chevron-left
                        </v-icon>
                      </v-btn>
                      <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page >= totalBlendSettingsPages"
                        @click="reportPageChange(true)">
                        <v-icon dark>
                          mdi-chevron-right
                        </v-icon>
                      </v-btn>
                      <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" left
                                    :min-width="417">
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
                                                    <v-slider v-model="itemsPerPageSlider"
                                                        :tick-labels="itemsPerPageOptions" :max="3" step="1"
                                                        ticks="always" tick-size="4"></v-slider>
                                                </v-list-item-content>
                                            </v-list-item>
                                            <v-divider class="mt-n3"></v-divider>
                                        </v-list>
                                        <v-card-text>
                                            <v-container fluid>
                                                <v-row>
                                                    <v-col class="mt-n9" cols="6" v-for="header in reportHeaders"
                                                        :key="header.value">
                                                        <v-checkbox v-if="header.text" v-model="selectedHeaders"
                                                            :label="header.text" color="primary" :value="header.text"
                                                            hide-details :disabled="header.text == 'ID'"></v-checkbox>
                                                    </v-col>
                                                </v-row>
                                            </v-container>
                                        </v-card-text>
                                        <v-layout justify-center>
                                            <v-card-actions class="mb-5">
                                                <v-spacer></v-spacer>

                                                <v-btn outlined color="primary" @click="resetDefaut" width="190">
                                                    <span class="text-truncate" style="max-width:150px">{{ $t("deforestation.restoreDefault") }}</span>
                                                </v-btn>
                                                <v-btn color="primary" @click="resetTableStructure" width="190">
                                                    {{ $t("deforestation.apply") }}
                                                </v-btn>
                                            </v-card-actions>
                                        </v-layout>
                                    </v-card>
                                </v-menu>

                                <v-tooltip top color="black" max-width="350">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn class="mx-2" fab small outlined color="primary" v-bind="attrs" v-on="on"
                                            @click="exportToPDF">
                                            <v-img src="/icons/download.svg"></v-img>
                                        </v-btn>
                                    </template>

                                    <span>
                                        {{ $t("deforestation.download") }}
                                    </span>
                                </v-tooltip>
                                <v-tooltip top color="black" max-width="350">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn class="mx-2" fab small outlined color="primary" v-bind="attrs" v-on="on"
                                            @click="printPDF('document')">
                                            <v-icon dark> mdi-printer </v-icon>
                                        </v-btn>
                                    </template>
                                    <span>

                                        {{ $t("deforestation.print") }}
                                    </span>
                                </v-tooltip>
                    </div>
                  </template>
                  <template v-if="blendSettings.length" v-slot:body="{ items }">
                    <tbody>
                      <tr v-for="item in items" :key="item.id" style="position: relative; width: 0; height: 0"
                        @mouseover="selectItem(item)" @mouseleave="selectItem(false)">
                        <template v-for="h in tableHeaders">
  
                        <td class="text-truncate" :key="h.value + '_blendCode'" v-if="h.value == 'blendCode'">
                          {{ item.blendCode  }}
                        </td>
                       
                        <td class="text-truncate" :key="h.value + '_blendTitle'" v-else-if="h.value == 'blendTitle'">
                          {{item.blendTitle }}
                        </td>
  
                        <td class="text-truncate" :key="h.value + '_blendDescription'" v-else-if="h.value == 'blendDescription'">
                          {{ item.blendDescription }}
                        </td>
  
                        <td class="text-truncate" :key="h.value + '_finalProductName'" v-else-if="h.value == 'finalProductName'">
                      {{ item.finalProductName}}-{{ item.finalProductCode}}
                        
                        </td>
                       
                        <td class="text-truncate" :key="h.value + '_dateAdded'" v-else-if="h.value == 'dateAdded'">
                            {{ getDateFormat(item.createdAt) }}
                        </td>
                        <td :key="h.value + '_action'" v-else-if="h.value == 'action'">
                          <div style="position: absolute; right: 10px; top:10px;">
                              <v-menu location="start">
                                  <template v-slot:activator="{ on, attrs }">
                                  <v-btn
                                      icon
                                      v-bind="attrs"
                                      v-on="on"
                                  >
                                      <v-icon>mdi-dots-vertical</v-icon>
                                  </v-btn>
                                  </template>
  
                                  <v-list>
                                      <v-list-item @click="editBlendSettings(item.id)">
                                          <v-list-item-title>{{ $t('blends.blendSettings.edit') }}</v-list-item-title>
                                      </v-list-item>
                                      <v-list-item 
                                      @click="deleteBlendSetting(item.id)">
                                        <v-list-item-title>{{ $t('blends.blendSettings.remove') }}</v-list-item-title>
                                    </v-list-item>
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
      <confirm-box :title="blendSettingsConfirmDelete.title" :message="blendSettingsConfirmDelete.message"
      :cancelBtnText="blendSettingsConfirmDelete.cancelBtnText" :confirmBtnText="blendSettingsConfirmDelete.confirmBtnText"
      :confirmData="blendSettingsConfirmDelete.confirmData" :dialog="blendSettingsConfirmDeleteDialog"
      @cancel:action="blendSettingsConfirmDeleteDialog = false" @continue:action="confirmRemoveBlendSetting" />
    </div>
  </template>
  <script>
  import BlendService from "@/_services/BlendService";
  import moment from 'moment';
  import RoleMixin from "@/mixins/RoleMixin";
  import loadingMixin from "@/mixins/LoadingMixin";
  import downloadMixin from "@/mixins/DownloadMixin";
  import ConfirmBox from "@/components/ConfirmBox";
  import html2pdf from "html2pdf.js";
  import printJS from "print-js";

  export default {
    components: {
      "confirm-box": ConfirmBox,
    },
    async mounted() {
      this.tableHeaders = this.reportHeaders;
      this.selectedHeaders = this.allSelectedHeaders
      await this.getBlendSettings()
    },

    computed: {
      isOwner() {
        return  this.getCurrentRoles.some(x => ["operator_owner","supplier_owner"].includes(x))
      },
      getOrganizationId() {
          return this.$store.getters.getUser?.user_organization?.id;
      },
      reportHeaders(){
        return this.allReportHeaders.filter(header => {
          return !header.roles ||  this.getCurrentRoles.some(x => header.roles.includes(x))
        });
      },
      filteredHeaders(){
        return this.tableHeaders.filter((header)=>this.showActionsColumn || header.value !== "actions")
      },
    },
    data() {
      return {
        debounceTimer: null,
        fromBlendSettings: 0,
        toBlendSettings: 0,
        loading: true,
        selectedItem: false,
        search: "",
        reportOptions: {
          page: 1,
          limit: 10,
        },
        menu: false,
        listofBlendLoading: false,
        itemsPerPageSlider: 1,
        itemsPerPageOptions: [5, 10, 25, 50],
        allSelectedHeaders: [
                this.$t('blends.blendSettings.blendCode'),
                this.$t('blends.blendSettings.blendTitle'),
                this.$t('blends.blendSettings.blendDescription'),
                this.$t("blends.blendSettings.finalProductName&Code"),
                this.$t("blends.blendSettings.dateAdded"),
                this.$t('blends.blendSettings.actions')
        ],
        allReportHeaders: [
          {
            text: this.$t("blends.blendSettings.blendCode"),
            align: "start",
            value: "blendCode",
            class: "black--text",
            sortable: true,
          },
          {
            text: this.$t("blends.blendSettings.blendTitle"),
            align: "start",
            value: "blendTitle",
            class: "black--text",
            sortable: true,
          },
          {
            text: this.$t("blends.blendSettings.blendDescription"),
            align: "start",
            value: "blendDescription",
            class: "black--text",
            sortable: true,
          },
          {
            text: this.$t("blends.blendSettings.finalProductName&Code"),
            align: "start",
            value: "finalProductName",  
            class: "black--text",
            sortable: true,
          },
          {
            text: this.$t("blends.blendSettings.dateAdded"),
            align: "start",
            value: "dateAdded",
            class: "black--text",
            sortable: true,
          },
          {
            text: this.$t('dueDiligence.actions'),
            align: "center",
            value: "action",
            class: "black--text",
            sortable: false,
            width: "150px",
          },
        ],
        breadcrumbs: [
          {
            text: this.$t("blends.eudrDueDiligence"),
            disabled: false,
            exact: true,
          },
          {
            text: this.$t("blends.blends"),
            disabled: false,
            to: { name: "Blends" },
            exact: true,
          },
          {
            text: this.$t("blends.blendSettings.blendSettings"),
            disabled: true,
            href: "breadcrumbs_link_1",
          },
        ],
        totalBlendSettings: 0,
        totalBlendSettingsPages: 0,
        showActionsColumn:true,
        selectedHeaders: [],
        tableHeaders: [],
        hideOnPrint:false,
        options: {
          page: 1,
          limit:10
        },
 
        blendSettings: [],
        blendSettingsConfirmDeleteDialog : false,
        blendSettingsConfirmDelete: {
          title: this.$t("blends.blendSettings.confirmDiaglog.delete.title"),
          message: this.$t("blends.blendSettings.confirmDiaglog.delete.message"),
          confirmBtnText: this.$t("blends.blendSettings.confirmDiaglog.delete.confirmBtn"),
          cancelBtnText: this.$t("blends.blendSettings.confirmDiaglog.delete.cancelBtn"),
          confirmData: {},
        },

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

    watch: {
          pagination(){
            this.options.page = 1;
            this.getBlendSettings();
          }
        },
    methods: {
      async exportToPDF() {
            const params = {
                page: this.reportOptions.page,
                search: this.search,
                limit: this.reportOptions.limit
            }
            const querys = new URLSearchParams(params).toString();
            const token = this.$store.state.auth.token
      
            this.startLoading()
            const url = process.env.VUE_APP_DEFORESTRATION_API_BASE_URL || "https://cf-deforestation-dev.dimitra.dev/api"
            this.downloadSourceFileWithToken(`${url}/blend-settings/pdf?${querys}`, "application/pdf", token, "blend_settings.pdf")
                .then(() => {
                    this.stopLoading()
                }).catch(() => {
                    this.stopLoading()
                })
        },

      async printPDF() {
        const element = document.querySelector(".v-data-table__wrapper");
        let opt = {
          margin: 1,
          filename: "BlendSettings.pdf",
          image: { type: "jpeg", quality: 0.95 },
          html2canvas: { scale: 2, useCORS: true, logging: true },
          jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
        };

        try {
          let worker = await html2pdf()
            .set(opt)
            .from(element)
            .toCanvas()
            .outputPdf("blob", "BlendSettings.pdf");
          let file = new File([worker], "BlendSettings.pdf", {
            type: "application/pdf",
          });
          var pdfUrl = await URL.createObjectURL(file);
          await printJS({ printable: `${pdfUrl}`, type: "pdf", showModal: true });

          this.showActionsColumn = true; // restore the column;
          this.hideOnPrint = false;
        } catch (error) {
          console.error("Error generating PDF:", error);
        }
      },

      async getBlendSettings(opt=null) {
        this.listofBlendLoading = true;
          try {
            const params = {
              page: this.options.page,
              limit: this.options.limit,
              blendTitle: this.search,
            }

            if(opt?.sortBy?.length){
              params.orderField = opt.sortBy[0];
              params.order = opt.sortDesc[0] ? 'desc' : 'asc';
            }
            await BlendService.listBlendSettings(params).then((res) => {
              this.blendSettings= res.data.listBlendSettings.rows;
              this.totalBlendSettings = res.data.listBlendSettings.count;
              this.totalBlendSettingsPages = Math.ceil(this.totalBlendSettings / this.options.limit);
              this.fromBlendSettings = (this.options.page - 1) * this.options.limit + 1;
              this.toBlendSettings = this.options.page * this.options.limit;
              if(this.blendSettings.length > 0){
                this.toBlendSettings -= this.options.limit - this.blendSettings.length;
              }
              else{
                this.toBlendSettings -= this.options.limit;
              }
              if (this.totalBlendSettings < 1) {
                this.toBlendSettings = 0;
                this.fromBlendSettings = 0;
                this.options.page = 1;
              }
            });
          
      }catch (error) {
        console.log(error);
      } finally {
        this.listofBlendLoading = false;
      }},

      async editBlendSettings(id) {
        this.$router.push({ name: 'editBlendSettings', params: { id } })
      },

      async deleteBlendSetting(id) {
        this.blendSettingsConfirmDelete.confirmData = { id };
        this.blendSettingsConfirmDeleteDialog = true;
      },

      reportPageChange(t) {
        if (t) this.options.page = this.options.page + 1;
        else this.options.page = this.options.page - 1;
        this.getBlendSettings();
      },

      async resetDefaut() {
        this.tableHeaders = this.reportHeaders;
        this.selectedHeaders = this.allSelectedHeaders;
        this.menu = false;
        this.options = {
          page: 1,
          limit: 10,
        };
        await this.getBlendSettings();
      },

      async resetTableStructure() {
        this.tableHeaders = this.reportHeaders.filter((header) => 
        this.selectedHeaders.includes(header.text));
        this.options.limit = this.itemsPerPageOptions[
          this.itemsPerPageSlider];
        await this.getBlendSettings();
        (this.customizeMenu = false), (this.customizeMenuAll = false);
      },
  
      getDateFormat(date) {
          return moment(date).format("DD/MM/YYYY");
      },
  
      redirectToDDSSUmmary(){
        this.$router.push({
          name: 'importBlends',
        })
      },
      handleCreateBlendSettings() {
          this.$router.push({ name: 'createBlendSettings' })
        },
     
      searchQuery() {
        clearTimeout(this.debounceTimer)
        this.debounceTimer = setTimeout(() => {
          this.options.page = 1;
          this.getBlendSettings();
        }, 500)
      },

      async deleteBlendSettings(id) {
        this.confirmDelete.confirmData = { id };
        this.confirmDeleteDialog = true;
      },

      async confirmRemoveBlendSetting(action, confirmData) {
        this.startLoading();
        const params = {
          id: parseInt(confirmData.id),
        };
        const res = await BlendService.deleteBlendSettings(
          params
        );
  
        const { deleteBlendSettings } = res.data;
        this.stopLoading();
        if (deleteBlendSettings) {
          await this.getBlendSettings();
          this.blendSettingsConfirmDeleteDialog = false;
          this.$notify({
            title: this.$t("blends.blendSettings.itemDeletedSuccessfully"),
            type: "success",
          });
        }
      },

      selectItem(item) {
        this.selectedItem = item;
      },
      resetSearchOnEmpty() {
        this.search = "";
        this.options = {
          page: 1,
          limit: 10,
        };
      },
     
    },
    mixins: [ loadingMixin, RoleMixin, downloadMixin],
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
  