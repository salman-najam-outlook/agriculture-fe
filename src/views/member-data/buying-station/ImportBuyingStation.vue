<template>
  <v-dialog
    v-model="showImport"
    :width="showPreview ? 1200 : 800"
    @click:outside="closeModal"
  >
    <v-card elevation="0" rounded="0" flat>
      <v-toolbar color="primary" class="white--text" flat>
        <v-toolbar-title class="font-weight-bold">{{
          $t("memberDataSection.import")
        }}</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-btn icon class="white--text" @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text v-if="showPreview">
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="csvData"
          item-key="FarmerID"
          :items-per-page="itemsPerPage"
          :options.sync="tableOptions"
          show-select
          class="elevation-1"
          hide-default-footer
          :search="search"
        >
          <template v-slot:top>
            <div class="d-flex mt-5">
              <v-text-field
                prepend-inner-icon="mdi-magnify"
                outlined
                :placeholder="$t('memberDataSection.pOrder.searchUser')"
                dense
                v-model="search"
                class="shrink"
              >
              </v-text-field>
              <v-spacer></v-spacer>
              <div class="py-3">
                {{ (currentPage - 1) * 10 }} - {{ currentPage * 10 }} of
                {{ totalCount }}
              </div>
              <v-btn
                class="mx-2"
                fab
                small
                outlined
                color="primary"
                :disabled="currentPage === 1"
                @click="currentPage++"
              >
                <v-icon dark> mdi-chevron-left </v-icon>
              </v-btn>
              <v-btn
                class="mx-2"
                fab
                small
                outlined
                color="primary"
                :disabled="csvData.length < itemsPerPage"
                @click="currentPage--"
              >
                <v-icon dark> mdi-chevron-right </v-icon>
              </v-btn>
            </div>
          </template>
          <template v-slot:item.FarmerName="{ item }">
            {{ item.FarmerName }}
            <v-icon x-small style="cursor: pointer">
              mdi-pencil
            </v-icon>
          </template>
        </v-data-table>
        <v-card-actions class="justify-center">
          <v-btn color="primary" outlined class="mr-2" @click="closeModal()">
            {{ $t("cancel") }}
          </v-btn>
          <v-btn
            class="mr-2"
            color="primary"
            @click="importAll"
            :disabled="importingAll || importingSelected"
            :loading="importingAll"
          >
            {{ $t("memberDataSection.importAll") }}
          </v-btn>
          <v-btn
            class="mr-2"
            color="primary"
            @click="importSelected"
            :disabled="importingSelected || importingAll"
            :loading="importingSelected"
          >
            {{ $t("memberDataSection.importSelected") }}
          </v-btn>
        </v-card-actions>
      </v-card-text>

      <v-card-text v-else>
        <div class="mt-5 mx-4">
          <label>{{ $t('memberDataSection.pOrder.selectBuyingStation') }}<span class="red--text">*</span></label>
          <v-autocomplete 
            v-model="selectedBuyingStation"
            :loading="loadingBuyingStation"
            :items="buyingStations"
            item-text="fullName"
            item-value="id"
            cache-items
            :search-input.sync="searchBuyingStation"
            dense
            full-width
            class="mt-1"
            :placeholder="$t('select')"
            outlined
            return-object
          ></v-autocomplete >
        </div>
        <v-card class="custom-card" rounded="0" flat v-if="!fileDropped">
          <div
            class="border-outline mx-4"
            @drop.prevent="onDrop($event)"
            @dragover.prevent="dragover = true"
            @dragenter.prevent="dragover = true"
            @dragleave.prevent="dragover = false"
            :class="{ 'grey lighten-2': dragover }"
          >
            <v-row
              class="d-flex flex-column mt-4"
              dense
              align="center"
              justify="center"
            >
              <v-icon
                color="primary"
                :class="[dragover ? 'mt-2, mb-6' : 'mt-5']"
                size="85"
                >mdi-cloud-upload</v-icon
              >
              <p class="font-weight-bold">
                {{ $t("activationKey.dragDrop") }}
                <input
                  type="file"
                  @change="fileData($event)"
                  accept=".csv"
                  capture
                  ref="file"
                  style="display:none"
                /><b class="browse" @click="$refs.file.click()">
                  {{ $t("activationKey.browse") }}
                </b>
                {{ $t("activationKey.yourFile") }}.
              </p>
            </v-row>
          </div>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              v-if="this.uploadedFiles.length"
              color="primary"
              outlined
              medium
              class="mr-2"
              @click="closeModal()"
            >
              {{ $t("cancel") }}
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-card class="custom-card" rounded="0" flat v-else>
          <v-card-text class="px-0">
            <div class="border-outline-success px-10 relative">
              <v-icon
                style="position: absolute; top: 24px; right: 7px;"
                @click="removeCsv"
                >mdi-close</v-icon
              >
              <v-row class="px-3" no-gutters>
                <v-col cols="12">
                  <v-row no-gutters class="d-flex align-center">
                    <v-col cols="2">
                      <v-img max-width="50" src="/icons/pngfile.png"></v-img>
                    </v-col>
                    <v-col cols="10" class="ml-n10 mt-4">
                      <div class="mb-2 subtitle-1 text--black">
                        {{ fileName }}
                      </div>
                      <v-progress-linear
                        rounded
                        height="15"
                        :value="uploadPercentage"
                      ></v-progress-linear>
                      <v-subheader class="ml-n4 primary--text text-h6"
                        >{{ $t("memberDataSection.fileLoaded") }}
                      </v-subheader>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
          <v-divider class="my-5"></v-divider>
          <v-card-actions>
            <div class="err" v-if="extensionError">
              {{ $t("activationKey.incorectFileType") }}.
            </div>
            <div class="err" v-if="errorUploading">
              {{ $t("memberDataSection.incorrectHeaders") }}
            </div>
            <v-spacer></v-spacer>
            <v-btn color="primary" outlined medium @click="closeModal()">
              {{ $t("cancel") }}
            </v-btn>
            <v-btn
              v-if="successLoaded"
              height="35"
              class="ml-2"
              width="126"
              color="primary"
              @click="getPreview()"
            >
              {{ $t("memberDataSection.continue") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import Papa from "papaparse";
import BuyingStationService from "@/_services/BuyingStationService";

export default {
  props: {
    showImport: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {
      dragover: false,
      errorUploading: false,
      successLoaded: false,
      uploadedFiles: [],
      extensionError: false,
      fileDropped: false,
      fileName: "",
      uploadPercentage: 0,
      csvData: [],
      showPreview: false,
      selected: [],
      currentPage: 1,
      from: 0,
      to: 0,
      totalCount: 0,
      totalPages: 1,
      pageCount: 0,
      itemsPerPage: 10,
      search: "",
      searchBuyingStation: "",
      loadingBuyingStation: false,
      tableOptions: {},
      itemsPerPageOptions: [5, 10, 25, 50],
      buyingStations: [],
      selectedBuyingStation: {},
      importingAll: false,
      importingSelected: false,
      headers: [
        {
          text: this.$t("memberDataSection.farmerId"),
          align: "start",
          sortable: true,
          value: "FarmerID",
        },
        {
          text: this.$t("memberDataSection.purchaseDate"),
          align: "start",
          sortable: true,
          value: "PurchaseDate",
        },
        {
          text: this.$t("memberDataSection.farmerName"),
          align: "start",
          sortable: true,
          value: "FarmerName",
        },
        {
          text: this.$t("memberDataSection.farmerAddress"),
          align: "start",
          sortable: true,
          value: "FarmerAddress",
        },
        {
          text: this.$t("memberDataSection.quality"),
          align: "start",
          sortable: true,
          value: "Quality",
        },
        {
          text: this.$t("memberDataSection.quantity"),
          align: "start",
          sortable: true,
          value: "Quantity",
        },
        {
          text: this.$t("memberDataSection.pricePerKg"),
          align: "start",
          sortable: true,
          value: "PricePerKG",
        },
      ],
    };
  },
  watch: {
    async searchBuyingStation(val){
      if (val) {
        await this.getBuyingStation();
      } 
    },
  },
  mounted() {
    this.getBuyingStation();
  },
  methods: {
    onDrop(e) {
      this.dragover = false;
      this.errorUploading = false;
      this.successLoaded = false;
      if (this.uploadedFiles.length > 0) this.uploadedFiles = [];
      e.dataTransfer.files.forEach((element) =>
        this.uploadedFiles.push(element)
      );
      if (this.uploadedFiles[0].type !== "text/csv") {
        this.extensionError = true;
        this.uploadedFiles = [];
        return;
      }
      this.fileName = this.uploadedFiles[0].name;
      this.extensionError = false;
      this.fileDropped = true;
      this.submitCsv();
    },
    parseCsv(file, callback) {
      Papa.parse(file, {
        header: true,
        transformHeader: function(h) {
          return h.replace(/\s/g, "");
        },
        complete: function(results) {
          let firstRow = results.data[0];
          if (
            "FarmerID" in firstRow &&
            "PurchaseDate" in firstRow &&
            "FarmerName" in firstRow &&
            "FarmerAddress" in firstRow &&
            "Quality" in firstRow &&
            "Quantity" in firstRow &&
            "PricePerKG" in firstRow
          ) {
            callback(results.data, false);
          } else {
            callback([], true);
          }
        },
      });
    },
    fileData(e) {
      this.errorUploading = false;
      this.successLoaded = false;
      if (this.uploadedFiles.length > 0) this.uploadedFiles = [];
      if (e.target.files[0].type !== "text/csv") {
        this.extensionError = true;
        this.uploadedFiles = [];
        return;
      }
      this.fileName = e.target.files[0].name;
      this.extensionError = false;
      this.uploadedFiles.push(e.target.files[0]);
      this.fileDropped = true;
      this.submitCsv();
    },
    async submitCsv() {
      if (this.extenshionError || this.uploadedFiles.length < 1) return;
      this.parseCsv(this.uploadedFiles[0], this.setCsv);
      setTimeout(() => {
        this.uploadPercentage = 100;
      }, 1000);
    },
    setCsv(data, error) {
      if (error) {
        this.errorUploading = error;
        return;
      }
      this.successLoaded = true;
      this.csvData = data;
    },
    getPreview() {
      this.showPreview = true;
    },
    async getBuyingStation() {
      this.loadingBuyingStation = true;
      await BuyingStationService.getBuyingStationData({
        page: 1,
        itemsPerPage: 100,
      }, this.searchBuyingStation)
        .then(({ data }) => {
          this.buyingStations = data.rows;
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          this.loadingBuyingStation = false;
        })
    },
    async importAll() {
      try {
        this.importingAll = true;
        await BuyingStationService.importBuyingStationData({
          buyingStationId: this.selectedBuyingStation.id,
          data: this.csvData,
        });
        this.importingAll = false;
      } catch (err) {
        console.error(err);
      } finally {
        this.closeModal();
      }
    },
    async importSelected() {
      try {
        this.importingSelected = true;
        await BuyingStationService.importBuyingStationData({
          buyingStationId: this.selectedBuyingStation.id,
          data: this.selected,
        });
        this.importingSelected = false;
      } catch (err) {
        console.error(err)
      } finally {
        this.closeModal();
      }
    },
    reset() {
      (this.dragover = false),
        (this.errorUploading = false),
        (this.successLoaded = false),
        (this.uploadedFiles = []),
        (this.extensionError = false),
        (this.fileDropped = false),
        (this.fileName = ""),
        (this.uploadPercentage = 0),
        (this.csvData = []),
        (this.currentPage = 1),
        (this.selectedBuyingStation = {}),
        (this.selected = []),
        (this.showPreview = false);
    },
    removeCsv() {
      this.reset();
    },
    closeModal() {
      this.reset();
      this.$emit("closeDialog");
      this.$emit("getBuyingStation");
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .bg .v-input__slot {
  background-color: $primary-color;
  color: #ffffff;
}

.border-outline {
  background-color: #ffffff !important;
  border: 5px dotted #aaaaaa !important;
  height: 200px;
}

.border-outline-success {
  height: 125px;
  background-color: #ffffff !important;
  border: 5px dotted #aaaaaa !important;
}

.green-txt {
  color: #00bd73;
  margin-bottom: 34px;
  font-size: 20px;
}
.browse {
  cursor: pointer;
  color: blue;
}
.err {
  color: red;
  padding-left: 40px;
}
.successMsg {
  color: #00bd73;
  padding-left: 40px;
}
.numRecords {
  padding-left: 40px;
  font-size: 12px;
}
</style>
