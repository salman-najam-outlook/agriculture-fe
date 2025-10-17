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

                            <v-toolbar-title class="font-weight-bold">{{ $t('activationKey.uploadData') }}</v-toolbar-title>

                            <v-spacer></v-spacer>

                            <v-btn icon class="white--text" @click="closeModal">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </v-toolbar>
                        <v-card-text>
                            <v-card
                                class="custom-card"
                                rounded="0"
                                flat
                                v-if="!fileDropped"
                            >
                                
                                <div class="d-flex justify-space-between text-subtitle-2 pa-4 font-weight-bold">
                                    <div>
                                        {{ $t('activationKey.uploadUserData') }}. <br/>({{ $t('activationKey.downloadCsv') }})
                                    </div>   
              
                                    <div class="d-flex align-center">
                                        <v-img style="cursor: pointer;" @click="downloadFile" max-width="40" src="/icons/pngfile.png"></v-img> <div style="cursor: pointer;" @click="downloadFile" class="ml-2 primary--text">{{ $t('activationKey.downloadSample') }}</div>
                                    </div>
                  
                                </div>

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
                                            accept=".csv"
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
                                    v-if="successUploaded"
                                    height="35"
                                    width="126"
                                    color="primary"
                                    @click="sendActivationKeys()"
                                >
                                    {{ $t("done") }}
                                </v-btn>
                                </v-card-actions>
                            </v-card>
                            <v-card
                                flat
                                v-else
                            >
                                <v-card-text class="px-0">
                                    <div class="text-title black-text font-weight-bold mb-2">{{ $t('activationKey.uploadUserData') }}.</div>
                                    <div
                                        class="border-outline-success px-10"
                                    >
                                        <v-row class="px-3" no-gutters>
                                            <v-col cols="12">
                                                <v-row no-gutters class="d-flex align-center">
                                                    <v-col cols="2">
                                                        <v-img max-width="50" src="/icons/pngfile.png"></v-img>
                                                    </v-col>
                                                    <v-col cols="10" class="ml-n10">
                                                        <v-subheader class="ml-n4 mb-n2">{{ $t('activationKey.fileName') }}: {{ fileName }}</v-subheader>
                                                        <v-progress-linear
                                                            rounded
                                                            height="15"
                                                            :value="uploadPercentage"
                                                        ></v-progress-linear>
                                                        <v-subheader class="ml-n4 primary--text text-h6">{{ $t("activationKey.fileUploadedSuccess") }}.</v-subheader>
                                                    </v-col>
                                                </v-row>
                                            </v-col>
                                             <v-divider class="mt-10"></v-divider>
                                            <v-col cols="12">
                                                <v-row no-gutters class="d-flex align-center">
                                                    <v-col cols="2">
                                                        <v-img max-width="50" src="/icons/pngfile.png"></v-img>
                                                    </v-col>
                                                    <v-col cols="10" class="ml-n10">
                                                        <v-subheader class="ml-n4 mb-n2">{{ $t("activationKey.assignActKey") }}</v-subheader>
                                                        <v-progress-linear
                                                            rounded
                                                            height="15"
                                                            :value="keyAssignProgress"
                                                        ></v-progress-linear>
                                                        <v-subheader class="ml-n4 mt-n2 primary--text text-h6">{{ $t("activationKey.actKeyAssSucc") }}.</v-subheader>
                                                    </v-col>
                                                </v-row>
                                            </v-col>
                                        </v-row>

                                    </div>
                                </v-card-text>
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
                                        v-if="successUploaded"
                                        height="35"
                                        width="126"
                                        color="primary"
                                        @click="sendActivationKeys()"
                                    >
                                        {{ $t("done") }}
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
// import PermissionsService from '@/_services/PermissionsService'

	export default {
        mounted(){
            this.mailSent = false;
        },
        created() {
            const fetchData = async () => {
                this.startLoading()
 
                this.stopLoading()
            }
            fetchData()
        },
        computed: {
            dialog()  {
                return this.dialogU;
            }
        },
        data() {
            return {
                keyAssignProgress: 0,
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
            }
        },
        methods: {
            closeModal() {
                this.$emit('closeBulkUpload')
            },


            csvUploaded(data) {
                if (this.uploadedFiles.length > 0) this.uploadedFiles = [];
                this.successUploaded = true;
                this.numRecords = data.data.numRecords;
                this.uploadId = data.data.uploadId;
            },

            onDrop(e) {
                this.isInvalidData = false;
                this.dragover = false;
                this.errorUploading = false;
                this.successUploaded = false;
                if (this.uploadedFiles.length > 0) this.uploadedFiles = [];
                e.dataTransfer.files.forEach((element) =>
                    this.uploadedFiles.push(element)
                );
                if (this.uploadedFiles[0].type !== "text/csv") {
                    this.extenshionError = true;
                    this.uploadedFiles = [];
                    return;
                }
                this.fileName = this.uploadedFiles[0].name;
                this.extenshionError = false;
                this.fileDropped = true;
                this.submitCsv();
            },

            fileData(e) {
                this.isInvalidData = false;
                this.errorUploading = false;
                this.successUploaded = false;
                if (this.uploadedFiles.length > 0) this.uploadedFiles = [];
                if (e.target.files[0].type !== "text/csv") {
                    this.extenshionError = true;
                    this.uploadedFiles = [];
                    return;
                }
                this.fileName = e.target.files[0].name;
                this.extenshionError = false;
                this.uploadedFiles.push(e.target.files[0]);
                this.fileDropped = true;
                this.submitCsv();
            },

            submitCsv() {
                if (this.extenshionError || this.uploadedFiles.length < 1) return;
                this.uploadCsv(this.uploadedFiles[0]).then((data) => {
                    this.keyAssignProgress = 100
                    if (data.success) {
                        this.csvUploaded(data);
                    } else {
                        this.keyAssignProgress = 100
                        this.$notify({
                            title: this.$t("activationKey.invalidFileData"),
                            type: "error",
                        });
                        this.errorUploading = true;
                        this.fileDropped = false;
                        this.isInvalidData = true;
                    }
                });
            },

            sendActivationKeys() {
                //TODO send activation key to users task
                this.closeModal();
                return
            //   ActivationKeyService.sendKeys({ uploadId: this.uploadId }).then(
            //     (data) => {
            //       if (data.success) {
            //         this.$emit("keysSent", { success: true, message: data.message });
            //       } else {
            //         this.$emit("keysSent", { success: false, message: data.message });
            //       }
            //       this.closeModal();
            //       this.stopLoading();
            //     }
            //   );
            },

            async uploadCsv(file) {
                let formData = new FormData();
                formData.append("activationCsv", file);
                return await this.$http
                    .post("/user/activation/csv", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    onUploadProgress: (progressEvent) => {
                        this.loaded = progressEvent.loaded;
                        this.total = progressEvent.total;
                        this.uploadPercentage = parseInt(
                        Math.round((progressEvent.loaded / progressEvent.total) * 100)
                        );
                    },
                    })
                    .then(({ data }) => {
                        if(data.success) {
                            this.jobId = data.data
                            this.getKeyAssignStatus()
                        }
                        return data;
                    })
                    .catch((error) => {
                        this.errorUploading = true;
                        this.fileDropped = false;
                        return Promise.reject(error)
                    });
            },

            getKeyAssignStatus(){
                console.log('jobid', this.jobId)
                const int = setInterval(async ()=>{
                    const {data} = await this.$http.get(`/user/activation/csv/job/${this.jobId}`)
                    console.log('res', data)
                    console.log('data.data.progress', data.data.progress)
                    // if(data.data.progress == "100" || data.data.progress == "fail"){
                        clearInterval(int);
                    // }
                }, 5000)
            },

            async downloadFile() {
                const {data} = await this.$http.get('/user/activation/download-sample-csv');
                if(!data.data || !data.data.url) return ;
                // console.log('dd', data.data.url);
                // let csv = 'Sample,Csv,File,Here\n';
                const anchor = document.createElement('a');
                anchor.href = data.data.url; //'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
                anchor.target = '_blank';
                anchor.download = 'sample.csv';
                anchor.click();    
            },
        },
        props: {
            'dialogU': {
                type: Boolean,
                required: true
            },
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

