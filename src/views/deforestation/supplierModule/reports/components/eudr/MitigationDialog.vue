<template>
	<v-container>
		<template>
			<div class="text-center">
				<v-dialog
				    v-model="dialog"
				    width="800"
                    @click:outside="closeModal"
                >
			        <v-card class="rounded-lg">
                        <v-toolbar
                            color="primary"
                            class="white--text"
                            flat
                            :elevation="0"
                            >

                            <v-toolbar-title class="font-weight-bold">{{ $t('activationKey.mitigation') }}</v-toolbar-title>

                            <v-spacer></v-spacer>

                            <v-btn icon class="white--text" @click="closeModal">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </v-toolbar>
                        <v-card-text>
                            <v-card
                                class="custom-card py-10"
                                rounded="0"
                                flat
                            >
                                <label class="py-5">{{'Status'}}</label>
                                <v-select class="mx-2"  width="200" v-model="statusModel" item-text="status" item-value="status"
                                    :items="allStatus" :label="$t('deforestation.status')"
                                    outlined dense>
                                </v-select>
                                <h3 class="py-7">{{'Attach File'}}</h3>
                                <div
                                    class="border-outline mx-4"
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
                                        <v-icon color="primary" :class="[dragover ? 'mt-2, mb-6' : 'mt-5']" size="85"
                                        >mdi-cloud-upload</v-icon
                                        >
                                        <p class="font-weight-bold">
                                        {{ $t('activationKey.dragDrop') }}
                                        <input
                                            type="file"
                                            @change="fileData($event)"
                                            accept="application/pdf"
                                            multiple
                                            capture
                                            ref="file"
                                            style="display:none"
                                        /><b class="browse" @click="$refs.file.click()">
                                            {{ $t('activationKey.browse') }}
                                        </b>
                                        {{ $t('activationKey.yourFile') }}.
                                        </p>
                                    </v-row>
                                </div>
                                <v-row class="mt-10 d-flex mb-20" v-if="fileUploaded">
                                  <v-col cols="auto" class="align-start">
                                        <div>
                                        <v-sheet style="border: 1px solid #ccc; border-radius: 0px; background-color: #fafafa;"
                                            class="d-flex align-center justify-center flex-wrap text-center mx-auto px-4" height="100"
                                            width="100">
                                            <v-icon dark style="color: green">
                                                            mdi-eye
                                            </v-icon>
                                        {{uploadFileType }}
                                    </v-sheet>
                                        <h3 style="color:green" class="pt-1 pb-10">{{ fileName }}</h3>
                                        
                                    </div>
                                  </v-col>
                                  <v-col >
                                    <div style="width:80%">
                                        <v-textarea class="px-4" v-model="comment" :rows="3" placeholder="comments"></v-textarea>
                                    </div>
                                  </v-col>
                                </v-row>
                                
                                
                                <!-- <v-row height="500px" class="my-5 mx-1 d-flex align-center">
                                    <v-col cols="1">
                                        <v-icon color="primary" size="50">mdi-file-excel</v-icon>
                                    </v-col>
                                    <v-col cols="11" class="text-subtitle-2">
                                        {{ fileName }}
                                        <v-progress-linear
                                        rounded
                                        height="10"
                                        :value="uploadPercentage"
                                        ></v-progress-linear>
                                        {{ loaded }} of {{ total }}
                                    </v-col>
                                </v-row> -->
                                <v-divider class="my-5"></v-divider>
                                <div class="err" v-if="extenshionError">
                                {{ $t("activationKey.incorectFileType") }}.
                                </div>
                                <div class="err" v-if="errorUploading">
                                {{ $t(!isInvalidData ? "activationKey.somethingWentWrong" : "activationKey.invalidFileData") }}
                                </div>
                                <div class="successMsg" v-if="successUploaded">
                                {{ $t("activationKey.fileUploadedSuccess") }}
                                </div>
                                <div class="numRecords" v-if="uploadId">
                                {{ numRecords }} {{ $t("activationKey.countRecords") }}
                                </div>
                                
                                <!-- <v-card-text v-if="uploadedFiles.length > 0">
                                {{ uploadedFiles[0].name }}
                                </v-card-text> -->
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
                                    color="success"
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
import loadingMixin from "@/mixins/LoadingMixin"
import generalMixin from "@/mixins/GeneralMixin";
import PermissionsMixin from "@/mixins/PermissionsMixin"
import download from "@/mixins/DownloadMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import s3UploadService from "@/_services/S3UploadService";
import deforestationService from "@/_services/DeforestationService";
// import PermissionsService from '@/_services/PermissionsService'

	export default {
        computed: {
            dialog()  {
                return this.dialogU;
            }
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
                uploadPercentage: 0,
                loaded: 0,
                total: 0,
                fileName: "",
                valid: true,
                mailSent: false,
                roleLoading: false,
                error: false,
                jobId: null,
                fileDropped: false,
              fileUploadProgress: {},
              uploadedFileUrls:[],
              uploadedFileName: '',
              fileError: 'No error',
              s3key: '',
              uploadFileType: '',
              fileUploaded:false,
              comment: null,
              allStatus: [
                { status: 'Very High Probability' },
                { status: 'High Probability' },
                { status: 'Medium Probability' },
                { status: 'Low Probability' },
                { status: 'Zero/Negligible Probability' },
                { status: 'Manually Mitigated' }
              ],
              statusModel:'Manually Mitigated',
            }
        },
        methods: {
          closeModal() {
            this.$emit('closeBulkUpload')
          },

          onDrop(e) {
            this.isInvalidData = false;
            this.dragover = false;
            this.errorUploading = false;
            this.successUploaded = false;
            if (this.uploadedFiles.length > 0) this.uploadedFiles = [];
            const files = e.dataTransfer.files;
            if (files.length === 0) return;
            for (let i = 0; i < files.length; i++) {
              if (files[i].type !== "application/pdf") {
                this.extenshionError = true;
                this.uploadedFiles = [];
                return;
              }
              this.uploadedFiles.push(files[i]);
            }

            const file = this.uploadedFiles[0];
            this.fileName = file.name;
            this.uploadedFile = file;
            this.uploadFileType = file.name.split('.').pop().toUpperCase();
            this.fileUploaded = true;
            this.extenshionError = false;
            this.fileDropped = true;
            this.validateFiles();
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
            const file = files[0];
            this.fileName = file.name;
            this.uploadedFile = file;
            this.uploadFileType = file.name.split('.').pop().toUpperCase();
            this.fileUploaded = true;
            this.extenshionError = false;
            this.uploadedFiles.push(file);
            this.fileDropped = true;
            this.validateFiles();
          },

          validateFiles() {
            this.extenshionError = false;
            this.uploadedFiles.forEach(file => {
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

          async submitPdf() {
            if (this.extenshionError || this.uploadedFiles.length < 1) return;
            try {
              const folder = 'risk_mitigation_files';
              const uploadPromises = this.uploadedFiles.map(file => {
                console.dir(file);
                return s3UploadService.singleUpload(file, folder).then(result => {
                  this.uploadedFileUrls.push(result.fullPath);
                  return result;
                });
              });
              const results = await Promise.all(uploadPromises);
              console.dir(results);
              this.successUploaded = true;
              this.uploadedFiles = [];
              console.log('Files uploaded successfully:', results);
            } catch (err) {
              this.errorUploading = true;
              console.error('Error uploading files:', err);
            }
          },

          async handleSubmit() {
            if (this.uploadedFileUrls.length === 0) return;
            this.startLoading();
            const input = {
              id: this.productionPlaceId,
              eudr_deforestation_status: this.statusModel,
              risk_mitigation_comment: this.comment,
              files: this.uploadedFileUrls,
            };
            try {
              await deforestationService.productionPlaceRiskMitigation(input);
              this.stopLoading();
              this.closeModal();
            } catch (err) {
              console.error('GraphQL request error:', err);
              this.stopLoading();
            }
          },
        },
        props: {
            'dialogU': {
                type: Boolean,
                required: true
            },
          'productionPlaceId':null
        },
        mixins: [loadingMixin, download, getPermittedActions, generalMixin, PermissionsMixin]
    };
</script>

<style lang="scss" scoped>
::v-deep .bg .v-input__slot{
    background-color: $primary-color;
    color: #FFFFFF;
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
</style>

