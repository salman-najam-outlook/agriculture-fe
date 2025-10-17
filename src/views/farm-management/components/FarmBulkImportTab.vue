<template>
  <v-card elevation="0" flat>
    <v-card-text style="padding: 0!important" class="mt-3">
      {{ $t('farm.bulkImportNote') }}
    </v-card-text>
    <v-btn download :href="CSVFileDownloadLink" color="primary" class="my-3" v-if="format == 'CSV'" encoding="UTF-8">
      {{ $t('oma.downloadCSVFormat') }}
      <v-icon small class="ml-2">mdi-tray-arrow-down</v-icon>
    </v-btn>
    <v-btn download href="/files/farm-bulk-import/farm-bulk-import-template.geojson" color="primary" class="my-3" v-if="format == 'GeoJson'">
      {{ $t('oma.downloadGeoJSONFormat') }}
      <v-icon small class="ml-2">mdi-tray-arrow-down</v-icon>
    </v-btn>
    <v-btn download :href="XLSXDownloadLink" color="primary" class="my-3" v-if="format == 'XLS'">
      {{ $t('oma.downloadXlsFormat') }}
      <v-icon small class="ml-2">mdi-tray-arrow-down</v-icon>
    </v-btn>
    <v-btn download href="/files/farm-bulk-import/farm-bulk-import-template.pbf" color="primary" class="my-3" v-if="format == 'Geobuf'">
      {{ $t('oma.downloadGeobufFormat') }}
      <v-icon small class="ml-2">mdi-tray-arrow-down</v-icon>
    </v-btn>
    <v-btn download href="/files/farm-bulk-import/farm-bulk-import-template.gpkg" color="primary" class="my-3" v-if="format == 'GeoPackage'">
      {{ $t('oma.downloadGeoPackageFormat') }}
      <v-icon small class="ml-2">mdi-tray-arrow-down</v-icon>
    </v-btn>
    <v-btn download href="/files/farm-bulk-import/farm-bulk-import-template.topojson" color="primary" class="my-3" v-if="format == 'TopoJson'">
      {{ $t('oma.downloadTopoJSONFormat') }}
      <v-icon small class="ml-2">mdi-tray-arrow-down</v-icon>
    </v-btn>
    <div class="dropzone">
      <label
        v-if="!file"
        class="d-flex flex-column align-center justify-center px-3 py-3"
        :class="{ active: dragging }"
        @dragenter="dragging = true"
        @dragleave="dragging = false"
        @drop.prevent="handleFileChangeEvent"
        @dragover.prevent=""
      >
        <img width="50" v-if="format === 'XLS'" src="/img/xlsx-upload.svg">
        <img width="50" v-else-if="format === 'CSV'" src="/img/csv-upload.svg">
        <img width="50" v-else-if="format === 'GeoJson'" src="/img/geojson-upload.svg">
        <img width="50" v-else-if="format === 'TopoJson'" src="/img/topojson-upload.svg">
        <img width="50" v-else-if="format === 'GeoPackage'" src="/img/geoPackage-upload.png">
        <img width="50" v-else-if="format === 'Geobuf'" src="/img/file.svg">
        <input class="d-none" type="file" @change="handleFileChangeEvent" :accept="acceptAttribute" />
        <span class="font-weight-medium pt-2 text-decoration-underline blue--text darken-4">
          {{ $t('farm.selectFileToUpload') }}
        </span>
        <span>
          {{ $t('farm.dropHere') }}
        </span>
      </label>
      <div
        v-else
        class="d-flex flex-column justify-center align-center"
        style="position: relative; width: 100%; height: 100%;"
      >
        <img width="50" v-if="format === 'XLS'" src="/img/xlsx-upload.svg">
        <img width="50" v-else-if="format === 'CSV'" src="/img/csv-upload.svg">
        <img width="50" v-else-if="format === 'GeoJson'" src="/img/geojson-upload.svg">
        <img width="50" v-else-if="format === 'TopoJson'" src="/img/topojson-upload.svg">
        <img width="50" v-else-if="format === 'GeoPackage'" src="/img/geoPackage-upload.png">
        <img width="50" v-else-if="format === 'Geobuf'" src="/img/file.svg">
        <div class="mt-1">
          <span class="text-body-1">
            {{ file.name }}
          </span>
        </div>
        <v-alert dense type="error" class="mt-4" style="min-width: 70%;" outlined v-show="fileError">
          {{ fileError }}
        </v-alert>
        <v-btn @click="removeFile" icon text class="ma-2" style="position: absolute; top: 0; right: 0;">
          <v-icon dark>mdi-close</v-icon>
        </v-btn>
      </div>
    </div>
    <p class="pt-3 text-body-2">
      <span class="red--text"> {{ $t('farm.importantNote') }} </span>: {{ $t('farm.importantNoteDetail') }}
    </p>
    <v-divider class="my-5 px-0"></v-divider>
    <v-card-actions class="px-0">
      <v-spacer></v-spacer>
      <v-btn class="mr-2" outlined @click="cancelImport" color="primary" width="112">
        {{ $t('cancel') }}
      </v-btn>
      <v-btn :disabled="!canImportFile" @click="importFile" width="112" color="primary" class="btn-11 btn-22">
        {{ $t('oma.import') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    format: {
      required: true,
      type: String,
    },
  },
  computed: {
    language() {
      return localStorage.getItem("LANGUAGE") ?? 'en';
    },
    CSVFileDownloadLink() {
      if (this.language === 'en') {
        return `/files/farm-bulk-import/farm-bulk-import-template.csv`;
      }
      return `/files/farm-bulk-import/farm-bulk-import-template_${this.language}.csv`;
    },
    XLSXDownloadLink() {
      if (this.language === 'en') {
        return `/files/farm-bulk-import/farm-bulk-import-template.xlsx`;
      }
      return `/files/farm-bulk-import/farm-bulk-import-template_${this.language}.xlsx`;
    },
    acceptedFileExtensions() {
      switch (this.format) {
        case 'CSV':
          return ['.csv'];
        case 'GeoJson':
          return ['.geojson'];
        case 'XLS':
          return ['.xls', '.xlsx'];
        case 'Geobuf':
          return ['.pbf'];
        case 'GeoPackage':
          return ['.gpkg'];
        case 'TopoJson':
          return ['.topojson'];
        default:
          return [];
      }
    },
    acceptAttribute() {
      return this.acceptedFileExtensions.join(',');
    },
    canImportFile() {
      return this.file && !this.fileError;
    },
  },
  data() {
    return {
      dragging: false,
      file: null,
      fileError: null,
    };
  },
  methods: {
    handleFileChangeEvent(event) {
      this.dragging = false;
      let files;
      if (event instanceof DragEvent) {
        files = event.dataTransfer.files;
      } else {
        files = event.target?.files;
      }
      if (files instanceof FileList) {
        let file;
        for (let i = 0; i < files.length; i++) {
          const currentFileExtension = files
            .item(i)
            .name.split('.')
            .pop();
          if (this.acceptedFileExtensions.includes(`.${currentFileExtension}`)) {
            file = files.item(i);
            break;
          }
        }
        if (file) {
          this.file = file;
        } else {
          this.file = files.item(0);
          this.fileError = this.$t('activationKey.incorectFileType');
        }
      }
    },
    removeFile() {
      this.file = null;
      this.fileError = '';
    },
    cancelImport() {
      this.removeFile();
      this.$emit('cancelImport');
    },
    importFile() {
      this.$emit('importFile', this.file, this.removeFile);
    },
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
</style>
