<template>
  <v-card elevation="0" flat>
    <v-col class="d-flex" cols="12" sm="4">
      <v-select v-model="format" :items="templateOptions" item-text="text" item-value="value"
        :label="$t('blends.imports.selectTemplate')" outlined dense></v-select>
    </v-col>
    <v-card-text>
      {{ $t('farm.bulkImportNote') }}
    </v-card-text>
    <div class="d-flex mb-10 mx-3">
      <v-btn color="primary" class="mr-6" :href="hrefLink" download dense>
        {{ hrefLinkText }}
        <v-icon left class="ml-2">mdi-download</v-icon>
      </v-btn>
    </div>
    <div class="dropzone">
      <label v-if="!file" class="d-flex flex-column align-center justify-center px-3 py-3" :class="{ active: dragging }"
        @dragenter="dragging = true" @dragleave="dragging = false" @drop.prevent="handleFileChangeEvent"
        @dragover.prevent="">
        <img :src="uploadIcon" width="50" />
        <input class="d-none" type="file" @change="handleFileChangeEvent" :accept="acceptAttribute" />
        <span class="font-weight-medium pt-2 text-decoration-underline blue--text darken-4">
          {{ $t('blends.imports.selectFileToUpload') }}
        </span>
        <span>
          {{ $t('blends.imports.dropHere') }}
        </span>
      </label>
      <div v-else class="d-flex flex-column justify-center align-center dropzone-content">
        <img :src="uploadIcon" width="50" />
        <div class="mt-1">
          <span class="text-body-1">{{ file.name }}</span>
        </div>
        <!-- <v-alert dense :type="fileResponse.type" class="mt-4" outlined v-show="file">
          {{ fileResponse.message }}
        </v-alert> -->
        <v-btn @click="removeFile" icon text class="ma-2 close-btn">
          <v-icon dark>mdi-close</v-icon>
        </v-btn>
      </div>
    </div>
    <div class="mt-4 mx-3 text-caption">
      <span class="error--text font-weight-bold">
        {{ $t('blends.imports.importantNote') }}:
      </span>
      <span class="font-weight-normal normal--text">
        {{ $t('blends.imports.templateNote') }}
      </span>
    </div>
    <v-divider class="my-5 px-0"></v-divider>
    <v-card-actions class="px-0">
      <v-spacer></v-spacer>
      <v-btn outlined @click="cancelImport" color="primary" width="112">
        {{ $t('cancel') }}
      </v-btn>
      <v-btn :disabled="!canImportFile" @click="importFile" width="112" color="primary" class="btn-11 btn-22">
        {{ $t('oma.import') }}
      </v-btn>
    </v-card-actions>
    <LoadingModal :title="$t('blends.imports.Importing')" :message="$t('blends.imports.modalMessage')"
      :visible="importing" v-if="importing" @close="modelClose" />
  </v-card>
</template>

<script>
import BlendService from "@/_services/BlendService";
import LoadingModal from "./LoadingModal.vue";
import * as XLSX from "xlsx";

export default {
  components: {
    LoadingModal,
  },
  data() {
    return {
      dragging: false,
      file: null,
      fileError: null,
      format: 'XLS',
      templateOptions: [
        { text: this.$t('blends.imports.importXLSFormat'), value: 'XLS' },
        { text: this.$t('blends.imports.importCSVFormat'), value: 'CSV' },
      ],
      fileResponse: {},
      importing: false,
    };
  },
  computed: {
    acceptedFileExtensions() {
      const extensions = {
        CSV: ['.csv','.xls', '.xlsx'],
        GeoJson: ['.geojson'],
        XLS: ['.csv','.xls', '.xlsx'],
        Geobuf: ['.pbf'],
        GeoPackage: ['.gpkg'],
        TopoJson: ['.topojson'],
      };
      return extensions[this.format] || [];
    },
    acceptAttribute() {
      return this.acceptedFileExtensions.join(',');
    },
    canImportFile() {
      return this.file && !this.fileError;
    },
    getOrganizationId() {
      return this.$store.getters.getUser?.user_organization?.id;
    },
    getUserId() {
      return this.$store.getters.getUser?.id;
    },
    hrefLinkText() {
      return this.format === 'XLS'
        ? this.$t('blends.imports.downloadXlsTemplate')
        : this.$t('blends.imports.downloadCsvTemplate');
    },
    hrefLink() {
      return this.format === 'CSV'
        ? '/files/blend-bulk-import/blend-bulk-import-template.csv'
        : '/files/blend-bulk-import/blend-bulk-import-template.xlsx';
    },
    uploadIcon() {
      const icons = {
        XLS: '/img/file.svg',
        CSV: '/img/file.svg',
        GeoJson: '/img/geojson-upload.svg',
        TopoJson: '/img/topojson-upload.svg',
        GeoPackage: '/img/geoPackage-upload.png',
        Geobuf: '/img/file.svg',
      };
      return icons[this.format] || '/img/file.svg';
    }
  },
  methods: {
    async validateFileHeaders(file) {
      try {
        let headers = [];
        if (file.name.endsWith(".csv")) {
          const text = await file.text();
          headers = text.split("\n")[0].split(",").map(h => h.trim());
        } else if (file.name.endsWith(".xls") || file.name.endsWith(".xlsx")) {
          const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          headers = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0].map(h => h.trim());
        }

        const expectedHeaders = [
          "Blend Title",
          "Blend Code",
          "Blend Description",
          "Final Product Name",
          "Final Product Code",
        ];

        const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
        const additionalHeaders = headers.filter(h => !expectedHeaders.includes(h));

        if (missingHeaders.length || additionalHeaders.length) {
          let errorMessage = this.$t('blends.imports.headerMismatchError', {
            expectedHeaders: expectedHeaders.join(", "),
          });

          if (missingHeaders.length) {
            errorMessage += `\n${this.$t('blends.imports.missingHeaders')}: ${missingHeaders.join(", ")}`;
          }
          if (additionalHeaders.length) {
            errorMessage += `\n${this.$t('blends.imports.additionalHeaders')}: ${additionalHeaders.join(", ")}`;
          }

          this.file = null;
          this.fileError = this.$t('blends.imports.invalidHeaders');
          this.$notify({
            type: 'error',
            title: this.$t('blends.imports.invalidHeaders'),
            text: errorMessage,
            duration: 5000
          });
          return false;
        }
        return true;
      } catch (error) {
        console.error("Error validating file headers:", error);
        return false;
      }
    },
    async handleFileChangeEvent(event) {
      this.dragging = false;
      const files = event instanceof DragEvent ? event.dataTransfer.files : event.target?.files;
      if (files instanceof FileList) {
        const file = Array.from(files).find(file =>
          this.acceptedFileExtensions.includes(`.${file.name.split('.').pop()}`)
        );
        if (file) {
          const isValidHeaders = await this.validateFileHeaders(file);
          if (isValidHeaders) {
            this.file = file;
            this.fileError = null;
            this.fileResponse = { type: 'success', message: this.$t('blends.imports.fileSelected') };
          }
        } else {
          this.file = null;
          this.fileError = this.$t('blends.imports.invalidFileFormat');
          this.fileResponse = { type: 'error', message: this.fileError };
          this.$notify({ type: 'error', title: this.fileError });
        }
      }
    },
    removeFile() {
      this.file = null;
      this.fileResponse = {};
    },
    cancelImport() {
      this.removeFile();
      this.$emit('cancelImport');
    },
    async importFile() {
      this.importing = true;
      try {
        const data = {
          organizationId: this.getOrganizationId,
          userId: this.getUserId,
          token: this.$store.getters.getAuthToken,
        };
        const response = await BlendService.postBlendsBulkUpload(this.file, data);
        this.$notify({ type: 'success', title: this.$t('blends.imports.success') });
        this.$emit('importSuccess', response);
      } catch (error) {
        console.error(error);
        this.$notify({ type: 'error', title: this.$t('serverError') });
      } finally {
        this.importing = false;
      }
    },
    modelClose() {
      this.importing = false;
      this.$router.push({ name: 'blendSettings' });
    }
  },
};
</script>

<style scoped lang="scss">
.dropzone {
  height: 280px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed $gray;
  border-radius: 8px;
}

.dropzone label {
  cursor: pointer;
  width: 100%;
  height: 100%;
}

.dropzone label:hover,
.dropzone label.active {
  background-color: #f5f5f5;
}

.dropzone-content {
  position: relative;
  width: 100%;
  height: 100%;
}

.close-btn {
  position: absolute;
  top: 0;
  right: 0;
}
</style>