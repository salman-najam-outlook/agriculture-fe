<template>
  <v-container>
    <template>
      <div class="text-center">
        <v-dialog v-model="dialog" width="800" @click:outside="closeModal">
          <v-card class="rounded-lg">
            <v-toolbar color="primary" class="white--text" flat :elevation="0">
              <v-toolbar-title class="font-weight-bold">{{
                $t("activationKey.mitigation")
              }}</v-toolbar-title>

              <v-spacer></v-spacer>

              <v-btn icon class="white--text" @click="closeModal">
                <v-icon style="color:white !important">mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <v-card class="custom-card py-10" rounded="0" flat>
                <label class="py-5">{{ $t("deforestation.status") }}</label>
                <v-select
                  readonly
                  class="my-2"
                  width="200"
                  v-model="statusModel"
                  item-text="text"
                  item-value="value"
                  :items="allStatus"
                  outlined
                  dense
                >
                </v-select>
                <h3 class="py-4">{{ "Attach File" }}</h3>
                <div
                  class="border-outline"
                  @drop.prevent="onDrop($event)"
                  @dragover.prevent="dragover = true"
                  @dragenter.prevent="dragover = true"
                  @dragleave.prevent="dragover = false"
                  :class="{ 'grey lighten-2': dragover }"
                >
                  <!-- New Addition -->
                  <v-row
                    class="d-flex flex-column"
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
                        accept="application/pdf"
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

                <v-row
                  class="mt-10 d-flex mb-20"
                  v-if="fileUploaded || uploadedFileUrls.length > 0"
                >
                  <v-col
                    cols="auto"
                    class="align-start d-flex justify-start flex-wrap"
                    style="gap:10px;"
                  >
                    <div v-for="(file, index) in uploadedFileUrls" :key="index">
                      <v-sheet
                        style="border: 1px solid #ccc; border-radius: 0px; background-color: #fafafa; position: relative;"
                        class="d-flex align-center justify-center flex-wrap text-center px-4 mr-2"
                        height="100"
                        width="100"
                        :title="urlToFileName(file.file_path)"
                      >
                        <div v-if="file.id">
                          <v-icon style=" position: absolute; top:0; right:0;" @click="removeFile(file.id)">
                          mdi-trash-can-outline
                          </v-icon>
                        </div>
                        <v-icon
                          dark
                          style="color: green"
                          @click="openFile(file.file_path)"
                        >
                          mdi-eye
                        </v-icon>
                        
                        <div class="wrapped-text">{{ urlToFileName(file.file_path) }}</div>
                      </v-sheet>
                    </div>
                  </v-col>
                  <v-col cols="auto">
                    <div style="width:80%">
                      <v-textarea
                        class="px-4"
                        v-model="comment"
                        :rows="3"
                        outlined
                        placeholder="comments"
                      ></v-textarea>
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
                  <v-btn
                    color="primary"
                    outlined
                    medium
                    class="mr-2"
                    @click="closeModal()"
                  >
                    {{ $t("close") }}
                  </v-btn>
                  <v-btn
                    color="primary"
                    medium
                    class="mr-2"
                    @click="handleSubmit()"
                  >
                    {{ $t("submit") }}
                  </v-btn>
                </v-card-actions>
              </v-card>
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
// import PermissionsService from '@/_services/PermissionsService'

export default {
  computed: {
    dialog() {
      return this.dialogU;
    },
  },
  async mounted() {
    this.comment = this.manualRiskMitigationData.riskMitigationComment || "";
    this.uploadedFileUrls = this.manualRiskMitigationData.riskMitigationFiles;

    await this.populateExistingMitigation();

  },
  data() {
    return {
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
      comment: null,
      allStatus: [
                {  text: this.$t('deforestation.veryHighProbability'), status: 'Very High Deforestation Probability' },
                {  text: this.$t('deforestation.highProbability'), status: 'High Deforestation Probability' },
                {  text: this.$t('deforestation.mediumProbability'), status: 'Medium Deforestation Probability' },
                {  text: this.$t('deforestation.lowProbability'), status: 'Low Deforestation Probability' },
                {  text: this.$t('deforestation.zeroOrNegligibleProbability'), status: 'Zero/Negligible Deforestation Probability' },
                {  text: this.$t('dueDiligence.manualMitigated'), status: 'Manually Mitigated' }
              ],
      statusModel: "Manually Mitigated",
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
        await deforestationService.removeRiskMitigationFile({
          productionPlaceId: this.productionPlaceId,
           fileId: parseInt(fileId),
        });
        console.log("File removed successfully from database");
        this.stopLoading();
        this.closeModal(true);
      } catch (error) {
        console.error("Error removing file from database:", error);
        this.stopLoading();
      }
    },

    async submitPdf() {
      if (this.extenshionError || this.uploadedFiles.length == 0){
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

    async handleSubmit() {
      if (this.newUploadedFileUrls.length === 0){
        this.fileRequired = true 
        return
      }
      this.startLoading();
      const input = {
        id: this.productionPlaceId,
        eudr_deforestation_status: this.statusModel,
        risk_mitigation_comment: this.comment,
        files: this.newUploadedFileUrls.map((f)=>f.file_path),
      };
      try {
        await deforestationService.productionPlaceRiskMitigation(input);
        this.stopLoading();
        this.closeModal(true);
      } catch (err) {
        console.error("GraphQL request error:", err);
        this.stopLoading();
      }
    },
    async populateExistingMitigation(){
      if(this.productionPlaceDetail?.eudr_deforestation_status){
        this.statusModel = this.productionPlaceDetail.eudr_deforestation_status        
      }
      if(this.productionPlaceDetail?.risk_mitigation_comment){
        this.comment = this.productionPlaceDetail.risk_mitigation_comment        
      }
      if(this.productionPlaceDetail?.risk_mitigation_files ){
        const files =this.productionPlaceDetail.risk_mitigation_files.map(f=> f.file_path)
      if (files.length) {
        // Extract file name with extension
        const fileNameWithExtension =    files[0].split('/').pop();

        this.fileName = fileNameWithExtension.split('.').slice(0, -1).join('.');
        this.uploadFileType = fileNameWithExtension.split('.').pop().toUpperCase();
        this.fileUploaded = true
      }

      }
    }
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
