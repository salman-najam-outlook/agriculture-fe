<template>
  <v-container>
    <template>
      <div class="text-center">
        <v-dialog v-model="dialogI" width="800" persistent>
          <v-card class="custom-card" rounded="0">
            <v-toolbar color="secondary" class="white--text">
              <v-toolbar-title class="font-weight-bold">{{
                $t("oma.importTrees")
              }}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon class="white--text" @click="closeModal">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>

            <v-card class="my-4" elevation="0">
              <v-card-text class="pa-0">
                <v-tabs class="tabs-pill" v-model="tab">
                  <v-tab class="text-capitalize" @click="type = 'import'">{{ $t("oma.import") }}</v-tab>
                  <v-tab class="text-capitalize" @click="type = 'history'">{{ $t("oma.history") }}</v-tab>
                </v-tabs>
              </v-card-text>
            </v-card>
            <v-card elevation="0">
              <v-card-text>
                <v-tabs-items v-model="tab">
                  <v-tab-item>
                    <form autocomplete="off">
                      <v-card-text class="black--text">
                        {{ $t("oma.downloandimport") }}

                        <v-btn color="primary" class="my-3" v-if="importType == 'geojson'">
                          <a class="text-decoration-none black--text"  download href="/files/production-place-bulk-import/production-place-bulk-import-template.geojson">
                              {{ $t('dueDiligence.downloadGeoJsonFormat') }}
                            </a>
                          <v-icon small class="ml-2">mdi-tray-arrow-down</v-icon>
                        </v-btn>

                        <v-btn color="primary" class="my-3" v-if="importType == 'xml'">
                          <a class="text-decoration-none black--text"  download href="/files/production-place-bulk-import/production-place-bulk-import-template.xml">
                              {{ $t('dueDiligence.downloadXMLFormat') }}
                            </a>
                          <v-icon small class="ml-2">mdi-tray-arrow-down</v-icon>
                        </v-btn>


                        <!-- <v-menu bottom origin="center center" transition="scale-transition">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="primary" v-bind="attrs" v-on="on" dark class="mr-3">
                      <v-icon small class="mr-2">mdi-tray-arrow-down</v-icon>
                      {{ $t("dueDiligence.") }}
                      <v-icon>mdi-chevron-dodownloadXLSFordownloadXLSFormatmatwn</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item @click="toggleFarmBulkImportDialog('GeoJson')">
                          <v-list-item-title class="cursor-pointer">
                            <a class="text-decoration-none black--text"  download href="/files/production-place-bulk-import/production-place-bulk-import-template.geojson">
                              {{ $t('dueDiligence.downloadGeoJsonFormat') }}
                            </a>
                          </v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="toggleFarmBulkImportDialog('XLS')">
                          <v-list-item-title class="cursor-pointer">
                            <a class="text-decoration-none black--text"  download href="/files/production-place-bulk-import/production-place-bulk-import-template.xml">
                              {{ $t('dueDiligence.downloadXMLFormat') }}
                            </a>
                          </v-list-item-title>
                      </v-list-item>
                  </v-list>
                </v-menu> -->
                        
                        <!-- <v-btn color="primary" class="my-3" @click="downloadTemplate" v-if="importType == 'xlsx'">
                          {{ $t("oma.downloadXlsFormat") }}
                          <v-icon small class="ml-2">mdi-tray-arrow-down</v-icon>
                        </v-btn>
                        <v-btn color="primary" class="my-3" @click="downloadTemplate" v-if="importType == 'csv'">
                          {{ $t("oma.downloadCSVFormat") }}
                          <v-icon small class="ml-2">mdi-tray-arrow-down</v-icon>
                        </v-btn>
                        <v-btn color="primary" class="my-3" @click="downloadTemplate" v-if="importType == 'geoJson'">
                          {{ $t("oma.downloadGeoJSONFormat") }}
                          <v-icon small class="ml-2">mdi-tray-arrow-down</v-icon>
                        </v-btn>
                        <v-btn color="primary" class="my-3" @click="downloadTemplate" v-if="importType == 'topoJson'">
                          {{ $t("oma.downloadTopoJSONFormat") }}
                          <v-icon small class="ml-2">mdi-tray-arrow-down</v-icon>
                        </v-btn>
                        <v-btn color="primary" class="my-3" @click="downloadTemplate" v-if="importType == 'geoPackage'">
                          {{ $t("oma.downloadGeoPackageFormat") }}
                          <v-icon small class="ml-2">mdi-tray-arrow-down</v-icon>
                        </v-btn>
                        <v-btn color="primary" class="my-3" @click="downloadTemplate" v-if="importType == 'geobuf'">
                          {{ $t("oma.downloadGeobufFormat") }}
                          <v-icon small class="ml-2">mdi-tray-arrow-down</v-icon>
                        </v-btn> -->

                        <div class="form">
                          <div v-if="!file">
                            <div :class="['dropZone', dragging ? 'dropZone-over' : '']" @dragenter="dragging = true"
                              @dragleave="dragging = false">
                              <div class="dropZone-info" @drag="onChange">
                                <!-- <img width="50" v-if="importType == 'xlsx'" src="/img/xlsx-upload.svg">
                                <img width="50" v-else-if="importType == 'csv'" src="/img/csv-upload.svg">
                                <img width="50" v-else-if="importType == 'geoJson'" src="/img/geojson-upload.svg">
                                <img width="50" v-else-if="importType == 'topoJson'" src="/img/topojson-upload.svg">
                                <img width="50" v-else-if="importType == 'geoPackage'" src="/img/geoPackage-upload.png">
                                <img width="50" v-else-if="importType == 'geobuf'" src="/img/xlsx-upload.svg"> -->
                                <span class="fa fa-cloud-upload dropZone-title"></span>
                                <div class="d-flex-start">
                                  <div class="info--text" v-if="importType == 'xml'">{{ $t("Select XML file") }}</div>
                                  
                                  <div class="info--text" v-else-if="importType == 'geojson'">{{
                                    $t("Select geoJson file") }}</div>
                                    <!-- <div class="info--text" v-else-if="importType == 'csv'">{{ $t("oma.selectCSVFile") }}
                                  </div>
                                  <div class="info--text" v-else-if="importType == 'topoJson'">{{
                                    $t("oma.selectTopoJSONFile") }}</div>
                                  <div class="info--text" v-else-if="importType == 'geoPackage'">{{
                                    $t("oma.selectGeoPackageFile") }}</div>
                                  <div class="info--text" v-else-if="importType == 'geobuf'">{{ $t("oma.selectGeobufFile")
                                  }}</div> -->
                                </div>
                                <div class="dropZone-upload-limit-info">
                                  <div>{{ $t("oma.OrDragDrop") }}</div>
                                </div>
                              </div>

                              <input type="file" v-if="importType == 'xml'" accept=".xml" @change="onChange" />
                              <input type="file" v-if="importType == 'geojson'" accept=".geoJson" @change="onChange" />

<!--                               
                              <input type="file" v-if="importType == 'xml'" accept=".csv" @change="onChange" />
                              <input type="file" v-else-if="importType == 'xlsx'" accept=".xls, .xlsx"
                                @change="onChange" />

                              <input type="file" v-else-if="importType == 'geoJson'" accept=".geojson"
                                @change="onChange" />
                              <input type="file" v-else-if="importType == 'topoJson'" accept=".topojson"
                                @change="onChange" />
                              <input type="file" v-else-if="importType == 'geoPackage'" accept=".gpkg"
                                @change="onChange" />
                              <input type="file" v-else-if="importType == 'geobuf'" accept=".pbf" @change="onChange" /> -->

                            </div>
                            <span class="red--text">{{ fileError }}</span>
                          </div>
                          <div v-else class="dropZone-uploaded">
                            <div class="dropZone-uploaded-info">
                              <v-btn class="ma-2 white--text" @click="removeFile" color="info" outlined>
                                {{ $t("oma.removeFile") }}
                                <v-icon right dark> mdi-trash-can </v-icon>
                              </v-btn>
                            </div>
                          </div>
                          <v-chip v-if="file" label color="grey lighten-4" class=" mt-4 uploadedFile-info">
                            <v-icon left small>
                              mdi-file-check
                            </v-icon>
                            {{ file.name }}
                          </v-chip>
                          <div v-if="progress > 0" class="row mt-2">
                            <div class="col-11">
                              {{ progressText }}
                            </div>
                            <div class="col-1">
                              <v-icon :color="progressColor" dense>
                                {{ progressIcon }}
                              </v-icon>
                            </div>
                          </div>
                          <div class="row mt-0" v-if="progress > 0">
                            <div class="col-11 progress-bar">
                              <v-progress-linear :value="progress" :color="progressColor" rounded></v-progress-linear>
                            </div>
                            <div class="col-1 pl-0">
                              <small :class="'progress-num ' + progressColor + '--text'">{{ progress }} %</small>
                            </div>
                          </div>
                          <!-- <div class="row mt-0" v-if="responseMessage !== ''">
                            <small :class="progressColor + '--text'">{{ responseMessage }}</small>
                          </div> -->

                          <span class="red--text">{{ $t("oma.importantNote") }}</span>:
                          {{ $t("oma.importantNoteDetail") }}
                        </div>
                        <v-divider class="my-5 px-0"></v-divider>
                        <v-card-actions class="px-0">
                          <v-spacer></v-spacer>
                          <v-btn class="mr-2" outlined color="primary" @click="resetAndCloseDialog" width="112">
                            {{ $t("cancel") }}
                          </v-btn>
                          <v-btn v-if="progress < 100" :disabled="!file" width="112" color="primary" class="btn-11 btn-22"
                            @click="uploadFile">
                            {{ $t("oma.import") }}
                          </v-btn>
                          <v-btn v-else width="112" color="primary" class="btn-11 btn-22" @click="resetAndCloseDialog">
                            {{ $t("close") }}
                          </v-btn>
                        </v-card-actions>
                      </v-card-text>
                    </form>
                  </v-tab-item>
                  <v-tab-item>
                    <v-card flat>
                      <div class="text-center">
                        <div>
                          <v-data-table :headers="headers" :items="treeUploadHistories" :items-per-page="10"
                            :footer-props="{
                              'items-per-page-options': [10, 25, 50],
                            }" hide-default-footer :loading="treeUploadHistoriesLoading" :options.sync="options"
                            :server-items-length="totalHistories" loading-text="Loading Trees Upload History...">
                            <template v-slot:top>
                              <div class="d-flex">
                                <v-text-field prepend-inner-icon="mdi-magnify" outlined height="5px"
                                  :placeholder="$t('search')" dense class="shrink" v-model="search"
                                  @input="handleSearchInput" @click:append="handleSearchClick"></v-text-field>
                                <!-- <v-btn :disabled="search.length < 1" color="primary" height="40" width="40" max-width="40"
                                  outlined class="ml-8">
                                  <v-icon>mdi-filter-outline</v-icon>
                                </v-btn> -->
                                <v-spacer></v-spacer>
                                <div class="py-1 title">{{ from }} - {{ to }} of {{ totalHistories }}</div>
                                <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page <= 1"
                                  @click="pageChange(false)">
                                  <v-icon dark> mdi-chevron-left </v-icon>
                                </v-btn>
                                <v-btn class="mx-2" fab small outlined color="primary"
                                  :disabled="options.page >= totalPages" @click="pageChange(true)">
                                  <v-icon dark> mdi-chevron-right </v-icon>
                                </v-btn>
                              </div>
                            </template>
                            <template v-if="treeUploadHistories.length" v-slot:body="{ items }">
                              <tbody>
                                <tr v-for="item in items" :key="item.id" style="position: relative; width: 0; height: 0">
                                  <td>{{ item.fileName }}</td>
                                  <td>{{ getDateFormat(item.createdAt) || "N/A" }}</td>
                                  <td class="text-center">
                                    Success
                                  </td>
                                  <td class="text-center">
                                    <a href="javascript:void(0)" @click="downloadUploadedFile(item.location)">
                                      {{ $t("oma.download") }}
                                    </a>
                                  </td>
                                </tr>
                              </tbody>
                            </template>
                            <template v-slot:footer></template>
                          </v-data-table>
                        </div>
                      </div>
                    </v-card>
                  </v-tab-item>
                </v-tabs-items>
              </v-card-text>
            </v-card>
          </v-card>
        </v-dialog>
      </div>
    </template>
  </v-container>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";
import FileService from "@/_services/FileService";
// //import AvocadoTreesService from "@/_services/AvocadoTreesService";
import moment from "moment";
import DownloadMixin from "@/mixins/DownloadMixin";
import DeforestationService from "@/_services/DeforestationService";

// // import _ from "lodash";

export default {
  computed: {
    dialog: {
      get() {
        console.log(this.dialogI,'this.dialogI==')
        return this.dialogI;
      },
      set() {
        console.log(this.dialogI,'this.dialogI==')
        return this.dialogI;
      },
    },
  },
  data() {
    return {
      debounceTimeout: null,
      search: '',
      totalHistories: 0,
      from: 0,
      to: 0,
      options: {},
      totalPages: 1,

      tab: 0,
      treeUploadHistories: [],
      headerProps: {
        'sort-icon': 'mdi-menu-up'
      },
      treeUploadHistoriesLoading: false,
      headers: [
        {
          text: this.$t("oma.fileName"),
          align: "center",
          value: "fileName",
          class: "black--text",
        },
        {
          text: this.$t("oma.importedOn"),
          align: "center",
          value: "importedOn",
          class: "black--text",
        },
        {
          text: this.$t("oma.status"),
          align: "center",
          value: "status",
          class: "black--text",
        },
        {
          text: this.$t("oma.action"),
          align: "center",
          value: "action",
          class: "black--text",
        },
      ],


      file: "",
      fileError: "",
      progressText: 'Uploading...',
      progressColor: 'success',
      progressIcon: 'mdi-progress-upload',
      responseMessage: '',
      uploadError: false,
      progress: 0,
      link: "",
      linkError: false,
      dragging: false,
      loading: false,

    };
  },
  async created() {
    this.resetAndCloseDialog();
  },

  watch: {
    // options: {
    //   async handler() {
    //     await this.getTreesUploadHistory()
    //   },
    //   deep: true,
    // },
    tab: {
      handler(v) {
        if (v === 1) {
          this.getTreesUploadHistory()
        }
      },
      deep: true,
    },
    dialogI: {
      handler(v) {
        if (!v) this.resetAndCloseDialog();
      },
      deep: true,
    },
  },

  methods: {

    handleSearchInput() {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        this.searchHistory();
      }, 500); // Adjust debounce delay as needed
    },
    handleSearchClick() {
      clearTimeout(this.debounceTimeout);
      this.searchHistory();
    },
    searchHistory() {
      this.options.page = 1;
      this.getTreesUploadHistory();
    },

    pageChange(t) {
      if (t) {
        this.options.page = this.options.page + 1
      } else {
        this.options.page = this.options.page - 1
      }
      this.getTreesUploadHistory();
      // this.getSurveys();
    },

    getDateFormat(date) {
      return moment(date).format("MM/DD/YYYY");
    },
    closeModal() {
      //this.dialogI = false;
      this.$emit("closeUploadFarmDialog");
    },
    onChange(e) {
      var files = e.target.files || e.dataTransfer.files;

      if (!files.length) {
        this.dragging = false;
        return;
      }

      this.createFile(files[0]);
    },
    createFile(file) {
      // if (!['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(file.type)) {
      //   this.fileError = this.$t("Only XLSX files are allowed");
      //   this.dragging = false;
      //   return;
      // }

      // if (file.size > 5000000) {
      //     alert('please check file size no over 5 MB.')
      //     this.dragging = false;
      //     return;
      // }

      this.file = file;
      this.dragging = false;
    },
    removeFile() {
      this.file = "";
      this.progress = 0;
    },
    uploadFile() {
      this.startLoading();
      let formData = new FormData();
      formData.append('file',this.file);
      const reportId = Number(63);
      console.log(formData,'formDataformDataformData')
      DeforestationService.importProductionPlace(formData, reportId).then((res)=>{
        console.log(res)
        this.$notify({
            title: 'File uploaded successfully!',
            type: 'success',
        });
      })
      .catch((err)=>{
        this.$notify({
          title: err.message || 'Something went wrong.',
          type: "error",
        })
      })
      .finally(()=>{
        this.stopLoading();
      })
    },
    resetAndCloseDialog() {
      this.closeModal();
      this.file = "";
      this.progress = 0;
      this.progressColor = "success";
      this.progressIcon = "mdi-progress-upload";
      this.progressText = "Uploading...";
      this.responseMessage = "";
      this.tab = 0;
      this.uploadError = false;
    },
    async getTreesUploadHistory() {
      this.treeUploadHistories = []
      this.treeUploadHistoriesLoading = true;

      const requestParams = {
        limit: this.options.itemsPerPage,
        page: this.options.page ?? 1,
        searchValue: this.search
      };
      console.log(requestParams, "requestParams")
      // await AvocadoTreesService.getTreesUploadHistory(requestParams)
      //   .then((res) => {
      //     this.treeUploadHistories = res?.data?.rows;
      //     this.treeUploadHistoriesLoading = false;
      //     this.totalHistories = res?.data?.count
      //     this.totalPages = Math.ceil(this.totalHistories / this.options.itemsPerPage)
      //     this.from = (this.options.page - 1) * this.options.itemsPerPage + 1
      //     this.to = (this.options.page * this.options.itemsPerPage) - (this.options.itemsPerPage - res?.data?.rows.length)

      //   })
      //   .catch((err) => {
      //     console.err(err);
      //   }).finally(() => {
      //     this.treeUploadHistoriesLoading = false;
      //   })
    },

    downloadTemplate() {
      //this.startLoading();
      let templateFile = null;

      if (this.importType == 'xml') {
        templateFile = 'farm-template.xml';
      } else if (this.importType == 'geoJson') {
        templateFile = 'farm-template.geojson';
      }
      if (templateFile) {
        FileService.getFile(`/files/${templateFile}`)
          .then((resp) => {
            this.stopLoading();
            if (resp.success) {
              const resourceElement = document.createElement("a");
              resourceElement.download = templateFile;
              resourceElement.href = URL.createObjectURL(resp.blob);
              resourceElement.click();
            }
          })
          .catch((err) => {
            this.stopLoading();
            console.log(err)
          })
      }

    },

    async downloadUploadedFile(location) {
      console.log(location, "===")
      this.startLoading();
      // const response = await AvocadoTreesService.fetchUploadHistoryFile({ fileLocation: location })
      // const filename = location.split("/").pop();
      // const fileExtension = filename.split(".").pop();

      // let templateFile = null;
      // if (fileExtension == 'xlsx') {
      //   templateFile = 'upload_history.xlsx';
      // } else if (fileExtension == 'csv') {
      //   templateFile = 'upload_history.csv';
      // } else if (fileExtension == 'geojson') {
      //   templateFile = 'upload_history.geojson';
      // } else if (fileExtension == 'topojson') {
      //   templateFile = 'upload_history.topojson';
      // } else if (fileExtension == 'gpkg') {
      //   templateFile = 'upload_history.gpkg';
      // } else if (fileExtension == 'pbf') {
      //   templateFile = 'upload_history.pbf';
      // }

      // if (templateFile) {
      //   this.downloadBlob(response.data, templateFile);
      // }

      this.stopLoading();
    }
  },

  props: ["dialogI", "dueDiligenceReportId", "importType"],
  mixins: [loadingMixin, DownloadMixin],
};
</script>
<style lang="scss" scoped>
.progress-bar {
  display: flex;
  justify-content: center;
  align-items: center;
}

.progress-num {
  display: flex;
  justify-content: flex-end;
  font-weight: bold;
}

.uploadedFile-info {
  width: 100%;
  padding: 18px;
}

.dropZone {
  width: 100%;
  height: 150px;
  position: relative;
  border: 2px dashed #97a8b8;
  padding: 100px 0;
}

.dropZone:hover {
  border: 2px solid $primary-color;
}

.dropZone:hover .dropZone-title {
  color: $primary-color;
}

.dropZone-info {
  color: #a8a8a8;
  position: absolute;
  top: 50%;
  width: 100%;
  transform: translate(0, -50%);
  text-align: center;
}

.dropZone-title {
  color: #787878;
}

.dropZone input {
  position: absolute;
  cursor: pointer;
  top: 0px;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.dropZone-upload-limit-info {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
}

.dropZone-over {
  background: #5c5c5c;
  opacity: 0.8;
}

.dropZone-uploaded {
  width: 100%;
  height: 150px;
  position: relative;
  border: 2px solid $primary-color;
  // border-radius: 10px;
}

.dropZone-uploaded-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #a8a8a8;
  position: absolute;
  top: 50%;
  width: 100%;
  transform: translate(0, -50%);
  text-align: center;
}

.removeFile {
  width: 200px;
}

.link-input {
  border-radius: 8px;
  background-color: rgba(209, 209, 209, 0.15);
  padding: 8px;

  .link-text {
    background: none;
    border: none;
    padding: 8px;
    width: 80%;

    &:focus {
      outline: none;
    }
  }

  .link-btn {
    width: 20%;
    background-color: white;
  }
}
</style>
