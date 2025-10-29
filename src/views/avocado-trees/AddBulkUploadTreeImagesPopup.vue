<template>
  <v-dialog v-model="showDialog" max-width="1000" persistent>
    <v-card>
      <v-card-title class="primary">
        <span class="white--text">{{$t("oma.addNewTreeImage")}}</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="mt-5">
        <v-textarea
          v-model="notes"
          label="Notes"
          rows="5"
          placeholder="Enter your notes here"
          outlined
        ></v-textarea>

        <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"
          v-on:vdropzone-file-added="fileAdded"
          v-on:vdropzone-success="fileSuccess"
          v-on:vdropzone-removed-file="fileRemovedHandler"
        ></vue-dropzone>
        
        
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="closeModal">{{$t("cancel")}}</v-btn>
        <v-btn color="primary" @click="submitTreeHistory">{{$t("submit")}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>



<script>
import loadingMixin from "@/mixins/LoadingMixin";
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import AvocadoTreesService from "@/_services/AvocadoTreesService";
export default {
mixins: [loadingMixin],
  components: {
      vueDropzone: vue2Dropzone,
  },
  data() {
      return {
        dropzoneOptions: {
          url: process.env.VUE_APP_BASE_URL.replace("/admin", "") + '/tree-management/uploadSingleTreeImage',
          thumbnailWidth: 200,
          addRemoveLinks: true,
          autoProcessQueue: true,
          paramName: 'treesFile',
          // headers: {
          //   'oauth-token': this.$store.getters.getAuthToken,
          // }
        },
        notes:"",
        treeImage: "",
        treeImagesArr: [],
      }
  },
  props: {
      showDialog:{
          type: Boolean, 
      }
  },
  watch: {
    updateCounter: {
      handler() {
        this.$nextTick(() => {
          try {
            if(this.isEdit) {
              this.notes = this.treeItem.notes
              this.treeItem.images?.forEach((element) => {
                let file = { size: 1000, location: element.location, timestamp: element.timestamp, name: element.imageName, key: element.key, type: "image/png", isUploaded: true };
                this.$refs.myVueDropzone.manuallyAddFile(file, element.location)
              });
            }
          } catch (error) {
            console.log(error, "error")
          }
        });
      },
      deep: true,
    }
  },
  methods: {
      fileRemovedHandler(file) {
        if(file?.key) {
          this.treeImagesArr = this.treeImagesArr.filter(image => image.key !== file.key);
        }
      },
      cleanFiles() {
        this.$refs.myVueDropzone.removeAllFiles();
      },
      closeModal() {
          this.cleanFiles();
          this.notes = "";
          this.$emit("closeModalAfterBulkImageUpload")
      },
      async fileAdded(file){
        try {
          if(file.isUploaded) {
            this.treeImagesArr.push({
              key: file.key,
              location: file.location,
              imageName: file.name,
              timestamp: file.timestamp,
            })
          }
        } catch (error) {
          console.log(error);
          this.stopLoading();
        }
      },

      async addTreeHistory() {
        let payLoad = {
            notes: this.notes,
            imageArr: this.treeImagesArr
        }
        await AvocadoTreesService.bulkUploadUploadTreeUpdateImage(payLoad)
      },

      async submitTreeHistory(){
        this.startLoading();
        window.a = this.$refs.myVueDropzone;
        const queuedFiles = this.$refs.myVueDropzone.getQueuedFiles();
        const uploadingFiles = this.$refs.myVueDropzone.getUploadingFiles();
        if(!queuedFiles.length && !uploadingFiles.length) {
          await this.addTreeHistory();
          this.$emit("closeModalAfterBulkImageUpload")
          this.cleanFiles();
          this.notes = "";
        } else {
          this.$notify({
            title: this.$t("File is still uploading, please wait"),
            type: "error",
          });
        }
        this.stopLoading();
      },
      fileSuccess(file, response) {
        this.treeImagesArr.push({
          "key": response.data.key,
          "location": response.data.Location,
          "imageName": file.name,
          "timestamp": new Date() //todo exif reader, get timestamp of the image uploaded
        });
      }
  },

}
</script>

<style>

</style>