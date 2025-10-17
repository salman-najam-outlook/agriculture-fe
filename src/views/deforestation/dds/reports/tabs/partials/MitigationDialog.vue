<template>
  <v-container>
    <template>
      <div class="text-center">
        <v-dialog v-model="dialog" width="800" @click:outside="closeModal">
          <v-card class="rounded-lg">
            <v-toolbar color="primary" class="white--text" flat :elevation="0">
              <v-toolbar-title class="font-weight-bold">{{
                $t("deforestation.riskMitigation")
                }}</v-toolbar-title>

              <v-spacer></v-spacer>

              <v-btn icon class="white--text" @click="closeModal">
                <v-icon style="color:white !important">mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <v-form ref="riskMitigation" lazy-validation autocomplete="off">
                <v-card class="custom-card py-10" rounded="0" flat>
                  <h3 class="pb-4">{{ $t("indigenousAndProtectedAreas.riskMitigationTitle") }}</h3>

                  <label class="py-5">{{ $t("indigenousAndProtectedAreas.interceptsProtectedArea") }}</label>
                  <v-select class="my-2" width="200" v-model="protectedArea" item-text="text"
                    :disabled="protectedArea === 'No invasion of protected areas'"
                    item-value="status" :items="getTranslatedStatus(protectedAreaStatus)" outlined dense
                    :rules="rules.protectedAreaStatus">

                  </v-select>
                  <label class="py-5">{{ $t("indigenousAndProtectedAreas.interceptsIndigenousArea") }}</label>
                  <v-select class="my-2" width="200" :disabled="indigenousArea === 'No invasion of protected areas'"
                    v-model="indigenousArea" item-text="text" item-value="status" :items="indigenousAreaStatus" outlined
                    dense :rules="rules.indigenousAreaStatus">
                  </v-select>
                  <h3 class="py-4">{{ $t("indigenousAndProtectedAreas.attachFile") }}</h3>
                  <div class="border-outline" @drop.prevent="onDrop($event)" @dragover.prevent="dragover = true"
                    @dragenter.prevent="dragover = true" @dragleave.prevent="dragover = false"
                    :class="{ 'grey lighten-2': dragover }">
                    <!-- New Addition -->
                    <v-row class="d-flex flex-column" dense align="center" justify="center">
                      <v-icon color="primary" :class="[dragover ? 'mt-2, mb-6' : 'mt-5']"
                        size="85">mdi-cloud-upload</v-icon>
                      <p class="font-weight-bold">
                        {{ $t("activationKey.dragDrop") }}
                        <input type="file" @change="fileData($event)" accept="application/pdf" capture ref="file"
                          style="display:none" /><b class="browse" @click="$refs.file.click()">
                          {{ $t("activationKey.browse") }}
                        </b>
                        {{ $t("activationKey.yourFile") }}.
                      </p>
                    </v-row>
                  </div>
                  <p class=" px-3 mt-2">
                    <strong>{{ $t('activationKey.note') }}:</strong> {{ $t('activationKey.pdfSupport') }}
                  </p>
                  <p v-if="fileRequired" style="color:#ff0000"> {{ $t('errors.required') }} </p>

                  <!-- Progress bar section -->
                  <v-row v-if="isUploading" align="center" justify="center">
                    <v-col cols="12" class="text-center">
                      <p>{{ $t('activationKey.pleaseWait') }}</p>
                      <v-progress-linear :value="uploadPercentage" height="7" color="primary" />
                      <p>{{ uploadPercentage }}%</p>
                    </v-col>
                  </v-row>

                  <v-row v-for="(file, index) in uploadedFileUrls" :key="index">
                    <v-col cols="2">
                      <div>
                        <v-sheet
                          style="border: 1px solid #ccc; border-radius: 0px; background-color: #fafafa; position: relative;"
                          class="d-flex align-center justify-center flex-wrap text-center px-4 mr-2" height="100"
                          width="100" :title="urlToFileName(file.file_path)">
                          <div v-if="file.id">
                            <v-icon style=" position: absolute; top:0; right:0;" @click="removeFile(file.id)">
                              mdi-trash-can-outline
                            </v-icon>
                          </div>
                          <v-icon dark style="color: green" @click="openFile(file.file_path)">
                            mdi-eye
                          </v-icon>

                          <div class="wrapped-text">{{ urlToFileName(file.file_path) }}</div>
                        </v-sheet>
                      </div>
                    </v-col>
                    <v-col>
                      <div style="width:80%">
                        <v-textarea class="px-4" v-model="comment[index]" :rows="3" outlined
                          :placeholder="$t('indigenousAndProtectedAreas.comments')"></v-textarea>
                      </div>
                    </v-col>
                  </v-row>
                  <v-divider class="my-5"></v-divider>
                  <div class="err" v-if="extenshionError">
                    {{ $t("activationKey.incorectFileType") }}.
                  </div>
                  <div class="err" v-if="errorUploading">
                    {{
                    $t(
                    !isInvalidData
                    ? "activationKey.somethingWentWrong"
                    : "activationKey.invalidFileData"
                    )
                    }}
                  </div>
                  <div class="successMsg" v-if="successUploaded">
                    {{ $t("activationKey.fileUploadedSuccess") }}
                  </div>
                  <div class="numRecords" v-if="uploadId">
                    {{ numRecords }} {{ $t("activationKey.countRecords") }}
                  </div>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" outlined medium class="mr-2" @click="closeModal()">
                      {{ $t("close") }}
                    </v-btn>
                    <v-btn color="primary" medium class="mr-2" @click="handleSubmit()">
                      {{ $t("submit") }}
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </template>
  </v-container>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";
import generalMixin from "@/mixins/GeneralMixin";
import PermissionsMixin from "@/mixins/PermissionsMixin";
import download from "@/mixins/DownloadMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import s3UploadService from "@/_services/S3UploadService";
import deforestationService from "@/_services/DeforestationService";

export default {
  computed: {
    dialog() {
      return this.dialogU;
    },
  },
  async mounted() {
    this.protectedArea = this.manualRiskMitigationData.protectedArea;
    this.indigenousArea = this.manualRiskMitigationData.indigenousArea;
    this.dueDiligenceProductionPlacesPyDataId = this.manualRiskMitigationData.dueDiligenceProductionPlacesPyDataId;
    this.protectedAreaStatus = [
      {  text: this.manualRiskMitigationData.protectedArea, status: this.manualRiskMitigationData.protectedArea }
    ];
    this.indigenousAreaStatus = [
      {  text: this.manualRiskMitigationData.indigenousArea, status: this.manualRiskMitigationData.indigenousArea }
    ];
    if(this.protectedArea !== 'No invasion of protected areas') {
      this.protectedAreaStatus.push({  text: this.$t('dueDiligence.manualMitigated'), status: 'Manually Mitigated' })
    }

    if(this.indigenousArea !== 'No invasion of protected areas') {
      this.indigenousAreaStatus.push({  text: this.$t('dueDiligence.manualMitigated'), status: 'Manually Mitigated' })
    }

    if(this.manualRiskMitigationData?.dueDiligenceProductionManuallyMitigated) {
      this.uploadedFileUrls = this.manualRiskMitigationData?.dueDiligenceProductionManuallyMitigated?.map((data, key) => {
        this.comment[key] = data.riskMitigationComment;
        return {
          id: data.id,
          file_path: data.riskMitigationFile,
        }
      });
    }
  },
  data() {
    return {
      protectedArea:'',
      dueDiligenceProductionPlacesPyDataId: '',
      indigenousArea: '',
      protectedAreaStatus: [],
      indigenousAreaStatus: [],
      extenshionError: false,
      select: null,
      dragover: false,
      errorUploading: false,
      successUploaded: false,
      isInvalidData: false,
      uploadedFiles: [],
      numRecords: 0,
      uploadId: null,
      isUploading: false,
      uploadPercentage: 0,
      loaded: 0,
      total: 0,
      fileName: "",
      valid: true,
      mailSent: false,
      roleLoading: false,
      error: false,
      fileRequired:false,
      jobId: null,
      fileDropped: false,
      fileUploadProgress: {},
      uploadedFileUrls: [],
      newUploadedFileUrls: [],
      uploadedFileName: "",
      fileError: "No error",
      s3key: "",
      uploadFileType: "",
      fileUploaded: false,
      comment: [],
      rules: {
        indigenousAreaStatus: [
          (v) => this.validateAreaStatus(v) || this.$t('indigenousAndProtectedAreas.pleaseSelectManually'),
        ],
        protectedAreaStatus: [
          (v) => this.validateAreaStatus(v) || this.$t('indigenousAndProtectedAreas.pleaseSelectManually'),
        ],
      },
    };
  },
  methods: {
    async openFile(url) {
        try {
            // Extract the file key from the URL (after bucket URL)
            const fileKey = url.split('.com/')[1];
            // Get the URL for viewing the file
            const viewUrl = await s3UploadService.getFileUrl(fileKey);
            window.open(viewUrl, "_blank");
        } catch (error) {
            console.error('Error opening file:', error);
        }
    },
    closeModal(submitted = false) {
      if (submitted) {
        this.$emit("mitigated");
      }
      this.$emit("closeBulkUpload");
    },
    urlToFileName(url) {
      return url.split("/").at(-1);
    },
    onDrop(e) {
      this.isInvalidData = false;
      this.dragover = false;
      this.errorUploading = false;
      this.successUploaded = false;
      if (this.uploadedFiles.length > 0) this.uploadedFiles = [];
      const files = e.dataTransfer.files;
      if (files.length === 0) return;
      const validFiles = [];
      for (let i = 0; i < files.length; i++) {
        if (files[i].type !== "application/pdf") {
          this.extenshionError = true;
          return;
        }
        validFiles.push(files[i]);
      }

      if (validFiles.length > 0) {
        this.uploadedFiles = validFiles;

        this.fileUploaded = true;
        this.extenshionError = false;
        this.fileDropped = true;
        this.validateFiles();
      }
    },
    fileData(e) {
      this.isInvalidData = false;
      this.errorUploading = false;
      this.successUploaded = false;
      if (this.uploadedFiles.length > 0) this.uploadedFiles = [];
      const files = e.target.files;
      if (files.length === 0) return;

      if (files[0].type !== "application/pdf") {
        this.extenshionError = true;
        this.uploadedFiles = [];
        return;
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type !== "application/pdf") {
          this.extenshionError = true;
          this.uploadedFiles = [];
          return;
        }
        this.uploadedFiles.push(file);
      }
      this.fileRequired =  false
      this.fileUploaded = true;
      this.extenshionError = false;
      this.fileDropped = true;
      this.validateFiles();
    },
    validateFiles() {
      this.extenshionError = false;
      this.uploadedFiles.forEach((file) => {
        if (file.type !== "application/pdf") {
          this.extenshionError = true;
        }
      });
      if (this.extenshionError) {
        this.uploadedFiles = [];
        return;
      }
      this.fileDropped = true;
      this.submitPdf();
    },
    async removeFile(fileId) {
      const confirmed = window.confirm("Are you sure you want to delete this file?");

      if (!confirmed) return;
      
      try {
        this.startLoading()
        await deforestationService.removeManuallyMitigatedFile({ fileId: parseInt(fileId) });
        await this.$parent.fetchData();
        console.log("File removed successfully from database");
        this.stopLoading();
        this.closeModal(true);
      } catch (error) {
        console.error("Error removing file from database:", error);
        this.stopLoading();
      }
    },

    async submitPdf() {
      if (this.extenshionError || this.uploadedFiles.length == 0) {
        this.fileRequired = true 
        return
      }
      // initial state for uploadingps3UploadService
      this.isUploading = true;
      this.uploadPercentage = 0;

      try {
        const folder = "risk_mitigation_files";
        const uploadPromises = this.uploadedFiles.map((file) => {
          console.dir(file);
          return s3UploadService.singleUpload(file, folder, (progress) => {
              this.uploadPercentage = progress;
            }).then((result) => {
              this.newUploadedFileUrls.push({file_path: result.fullPath});
            return result;
          });
        });
        const results = await Promise.all(uploadPromises);
        this.uploadedFileUrls = [...this.uploadedFileUrls, ...this.newUploadedFileUrls];
        console.dir(results);
        this.successUploaded = true;
        this.uploadedFiles = [];
        this.isUploading = false;
        console.log("Files uploaded successfully:", results);
      } catch (err) {
        this.errorUploading = true;
        this.isUploading = false;
        console.error("Error uploading files:", err);
      }
    },
    validateAreaStatus(val) {
      if(val === 'No invasion of protected areas') {
        return true;
      }

      return val === 'Manually Mitigated'
    },

    async handleSubmit() {
      if (!this.$refs.riskMitigation.validate()) return;

      
      if (this.uploadedFileUrls.length === 0){
        this.fileRequired = true 
        return
      }

      this.startLoading();
      try {
        await deforestationService.productionPlaceManuallyMitigated(
          this.uploadedFileUrls.map((file, index) => {
            return {
              riskMitigationComment: this.comment[index] || '',
              riskMitigationFile: file.file_path,
              id: Number(this.dueDiligenceProductionPlacesPyDataId)
            }
          })
       );
        await this.$parent.fetchData();
        this.stopLoading();
        this.closeModal(true);
      } catch (err) {
        console.error("GraphQL request error:", err);
        this.stopLoading();
      }
    },
    getTranslatedStatus(statusArray) {
      return statusArray.map(status => {
        switch (status.status) {
          case "No invasion of protected areas":
            return { text: this.$t("indigenousAndProtectedAreas.noInvasionOfProtectedAreas"), status: "No invasion of protected areas" };
          case "Manually Mitigated":
            return { text: this.$t("indigenousAndProtectedAreas.manuallyMitigated"), status: "Manually Mitigated" };
          default:
            return status;
        }
      });
    },
  },
  props: {
    dialogU: {
      type: Boolean,
      required: true,
    },
    productionPlaceId: null,
    manualRiskMitigationData: {
      type: Object,
      required: false,
    },
  },
  mixins: [
    loadingMixin,
    download,
    getPermittedActions,
    generalMixin,
    PermissionsMixin,
  ],
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
.wrapped-text {
  width: 80px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
