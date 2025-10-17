<template>
  <v-container>
    <template>
      <div class="text-center">
        <!-- select dialot -->
        <v-dialog
          v-model="dialog"
          width="800"
          @click:outside="closeModal"
          :retain-focus="false"
        >
          <v-card class="custom-card" rounded="0">
            <v-toolbar flat color="primary" class="white--text">
              <v-toolbar-title class="font-weight-bold">{{
                $t("userslist.bulkUploadUser")
              }}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon class="white--text" @click="closeModal">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <v-row class="mb-1">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                  <label for="membershipPlan">{{
                    $t("membershipPlans")
                  }}</label>
                  <v-select
                    :items="membershipType"
                    v-model="membershipTypeVal"
                    item-text="label"
                    item-value="val"
                    dense
                    outlined
                    required
                    return-object
                    class="shrink wdt"
                    @input="membershipSelectChange($event)"
                    :placeholder="$t('permissions.selectMembership')"
                  ></v-select>
                </div>
                <div
                  class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0 font-weight-bold"
                  style="alignContent: center"
                >
                  <v-icon color="primary">mdi-key</v-icon> {{activationKeysCount}} {{ $t("keysAvailable") }}
                </div>
              </v-row>
              <hr />
              <v-row class="mt-4">
                <div v-if="file" class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                  <div class="font-weight-bold black--text">
                    {{$t('pressImportToProceed')}}
                  </div>
                </div>
                <div v-else class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                  <div class="font-weight-bold black--text">
                    {{$t('pleaseUploadTheUserDataFile')}}
                  </div>
                  <div>
                    {{$t('downloadTheSampleCsvFileToFollowTheStructure')}}
                  </div>
                </div>
                <div
                  class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0 pb-4"
                  style="justifyItems: end"
                >
                  <div class="font-weight-bold">{{$t('remainingQuota')}}</div>
                  <h2 class="font-weight-bold black--text">{{activationKeyData.noOfkeysAllowed - activationKeyData.generatedActivationKeys + "/" + activationKeyData.noOfkeysAllowed}}</h2>
                </div>
                <div @click="downloadFile"  v-if="!file" class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0 pt-4 mb-4" style="display: flex; alignItems: center; cursor: pointer;">
                  <img width="30" src="/img/csv-upload.svg" class="mr-4" /> 
                  <div class="font-weight-bold primary--text">{{$t('downloadTemplate')}}</div>
                </div>
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
                    <img width="50" src="/img/icons/cloud-upload.png">
                    <input class="d-none" type="file" @change="handleFileChangeEvent" />
                    <span class="font-weight-bold pt-2 darken-4">
                      {{$t('dragAndDropOrBrowseYourFile')}}
                    </span>
                  </label>
                  <div
                    v-else
                    class="d-flex flex-column justify-center align-center"
                    style="position: relative; width: 100%; height: 100%;"
                  >
                    <img width="50" src="/img/csv-upload.svg">
                    <div class="mt-1">
                      <span class="text-body-1">
                        {{ file.name }}
                      </span>
                    </div >
                    <div   class="d-flex flex-column justify-center align-center" v-if="mixingIsLoading || uploadDone">
                      <v-progress-linear v-if="mixingIsLoading" indeterminate style="height: 10px;width: 600px;" ></v-progress-linear>
                      <v-progress-linear  v-if="!mixingIsLoading"  value="100" style="height: 10px;width: 600px;" ></v-progress-linear>
                        <div   v-if="uploadDone && !mixingIsLoading" class="font-weight-bold primary--text">{{$t('fileUploadedSuccessfully')}}</div>
                        <div   v-if="uploadDone && !mixingIsLoading" class="font-weight-bold black--text mt-4">{{   this.stageResponseObj.stagedData.length }} {{$t('recordsFound')}}</div>
                        <v-chip  v-if="uploadDone && !mixingIsLoading" 
                          class="ma-2"
                          color="success"
                          outlined
                          label
                        >
                        {{this.stageResponseObj.noOfUsedExstingKeys}} {{$t('savedKeys')}}, and {{this.stageResponseObj.noOfNewActivatedKeys}} {{$t('generatedActivationKeysAssignedSuccessfully')}}
                        </v-chip>
                        <v-progress-linear v-if="mixingIsLoading" indeterminate style="height: 10px;width: 600px;" ></v-progress-linear>
                        <v-progress-linear   v-if="!mixingIsLoading" value="100" style="height: 10px;width: 600px;" ></v-progress-linear>
                    </div>
      
                    <v-alert dense type="error" class="mt-4" style="min-width: 70%;" outlined v-show="fileError">
                      {{ fileError }}
                    </v-alert>
                    <v-btn @click="removeFile" icon text class="ma-2" style="position: absolute; top: 0; right: 0;">
                      <v-icon dark>mdi-close</v-icon>
                    </v-btn>
                  </div>
                </div>
              </v-row>
            </v-card-text>
            <v-card-actions class="pb-6">
              <v-spacer></v-spacer>
              <v-btn
                outlined
                right
                height="44"
                width="116"
                depressed
                color="primary"
                @click="closeModal" v-if="!uploadDone"
              >
                {{ $t("cancel") }}
              </v-btn>
              <v-btn right height="44" width="116" color="primary" @click="startUpload" v-if="!uploadDone" >
                {{ $t("import") }}
              </v-btn>
              <v-btn v-if="uploadDone" right height="44" width="116" color="primary" @click="initiateUpload">
                {{ $t("done") }}
              </v-btn>
            </v-card-actions>
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
import UserService from "@/_services/UserService.js";
export default {
  created() {
    this.getMembershipType();
  },
  components: {},
  computed: {
    dialog() {
      return this.dialogI;
    },
  },
  data() {
    return {
      membershipTypeVal: "",
      membershipType: [],
      dragging: false,
      file: null,
      fileError: null,
      activationKeysCount: 0,
      activationKeyData: {},
      uploadDone: false,
      stageResponseObj: {}
    };
  },
  methods: {
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
    async startUpload() {
      try {
    
        if(this.file == null)
        {
          this.$notify({
              title: "File is required",
              type: "error",
            });
            return
        }
        if(!this.membershipTypeVal)
        {
          this.$notify({
              title: "Membership Type is required",
              type: "error",
            });
            return
        }

        this.mixingIsLoading = true

        let formData = new FormData();
        formData.append("userUploadStage", this.file);
        formData.append('membershipId', this.membershipTypeVal.val);

       let dataStageRes = await UserService.stageUserBulkUpload(formData)
       this.stageResponseObj = dataStageRes.data


      } catch (error) {
        this.mixingIsLoading = false
        this.uploadDone = true
      }
   
      this.mixingIsLoading = false
      this.uploadDone = true

    },
    membershipSelectChange(event) {
      console.log(event, "member")
      this.activationKeysCount = event.activationKeysCount
    },
    initiateUpload() {
      this.$router.push({ name: 'UserUpload', params: { bulkStageList: this.stageResponseObj, membershipTypeVal: this.membershipTypeVal } })
    },
    closeModal() {
      this.uploadDone = false
      this.$emit("closeAddUser");
    },
    async getMembershipType() {
      const res = await UserService.getBulkUploadOptions();
      const {data} = await this.$http.get('user/activation/dashboard')
      this.activationKeyData = data.data;
      this.membershipType = res.data.membershipRes.map((item) => ({
        val: item.id,
        label: item.membership_type,
        activationKeysCount: item.activationKeysCount
      }));
    },
    handleFileChangeEvent(event) {
      this.dragging = false;
      let files;
      if (event instanceof DragEvent) {
        files = event.dataTransfer.files;
      } else {
        files = event.target?.files;
      }
      this.file = files[0]
    },
        removeFile() {
      this.file = null;
      this.fileError = '';
      this.uploadDone = false
    },
  },
  props: {
    dialogI: {
      type: Boolean,
      required: true,
    },
  },
  mixins: [loadingMixin, generalMixin, PermissionsMixin],
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
.v-dialog::-webkit-scrollbar {
  width: 0px;
}

.v-dialog::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;
}

.v-dialog::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

.custom-card {
  background: #ffffff !important;
  box-shadow: 0px 30px 30px rgb(106 119 132 / 41%) !important;
}

.custom-card .v-card__text {
  width: 100%;
  padding: 37px 30px !important;
}

.card-heading-1 {
  margin-bottom: 28px;
}

.custom-card .v-card__text .card-heading-1 h2 {
  font-size: 30px;
  font-weight: 700;
}

.form label {
  display: inline-block;
  max-width: 100%;
  margin-bottom: 5px;
  font-size: 15px;
  font-family: Poppins-Medium;
}

.v-input__prepend-outer {
  display: none;
}
</style>
