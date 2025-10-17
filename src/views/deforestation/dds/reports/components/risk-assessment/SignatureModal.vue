<template>
  <v-container>
    <v-dialog v-model="dialog" width="800" @click:outside="closeModal">
      <v-card rounded="0">
        <v-toolbar color="primary" class="white--text" flat>
          <v-toolbar-title class="font-weight-bold">
           {{ $t("dueDiligence.addSignature") }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon class="white--text" @click="closeModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="pa-10 mb-5">
          <div class="signature-controls">
            <v-radio-group v-model="controlOpt" mandatory row @change="handleTabSwitch">
              <v-radio :label="$t('dueDiligence.drawSignature')" value="signature"></v-radio>
              <v-radio :label="$t('dueDiligence.uploadImage')" value="upload_image"></v-radio>
            </v-radio-group>
            <hr />
          </div>
          <div class="signatur" v-if="controlOpt == 'signature'">
            <h2 class="mt-4 mb-4 text-center">{{$t('signHere')}}</h2>
            <div class="draw-signature">
              <template>
                <VueSignaturePad
                  id="signature"
                  :options="options"
                  width="500px"
                  height="400px"
                  ref="signaturePad"
                  :key="signaturePadKey"
                />
              </template>
            </div>
          </div>

          <div class="upload-signature mt-4" v-else>
            <div class="upload-document">
              <div
                style="overflow: clip"
                :class="['dropZone', dragging ? 'dropZone-over' : '']"
                @dragenter="dragging = true"
                @dragleave="dragging = false"
                @drop="handleDrop($event)"
              >
                <div
                  class="dropZone-info d-flex justify-center align-center"
                  @drag="additionalOnChange"
                >
                  <span class="fa fa-cloud-upload dropZone-title"></span>
                  <span class="dropZone-title">
                    <v-icon class="blue-color" size="50" color="gray"
                      >mdi-tray-arrow-up</v-icon
                    >
                  </span>
                  <div class="dropZone-upload-limit-info">
                    <h2 class="blue-color underline" color="primary">
                      {{ $t("dueDiligence.addSignature") }}

                    </h2>
                    <p class="gray-color">{{ $t('farm.dropHere') }}</p>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/png, image/gif, image/jpeg"
                  @change="handleFileChange"
                />
              </div>
              <span class="red--text" v-if="false">{{ fileError }}</span>
            </div>
            <p class="mt-3">
              {{ $t("ProvideFileFormat") }}
            </p>

            <div class="docs-box mr-4" v-if="uploadedFileName">
              <div class="docs-preview">
                <div class="img-item">
                  <div class="pdf-box">
                    <v-icon @click="removeSignature()">
                      mdi-trash-can-outline
                    </v-icon>
                    <h1>{{ uploadFileType }}</h1>
                  </div>
                  <span>{{ uploadedFileName }} </span>
                </div>
              </div>
            </div>
          </div>
          <v-card-text class="black--text">
            <v-card-actions class="mt-10">
              <v-spacer></v-spacer>
              <v-btn
                class=""
                outlined
                color="primary"
                @click="closeModal"
                width="112"
              >
                {{ $t("cancel") }}
              </v-btn>
              <v-btn
                width="112"
                color="primary"
                type="submit"
                class="btn-11 btn-22"
                @click="handleSubmit"
              >
                {{ $t("submit") }}
              </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import S3UploadService from "@/_services/S3UploadService";
import loadingMixin from "@/mixins/LoadingMixin";

export default {
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      valid: true,
      controlOpt: "signature",
      options: {
        penColor: "black",
      },
      dragging: false,
      uploadedFile: null,
      s3Location: "",
      uploadedFileName: "",
      fileError: "",
      s3key: "",
      uploadFileType: "",
      signaturePadKey: 0,
    };
  },

  watch: {
    dialog(val) {
      if (val && this.controlOpt === 'signature') {
        this.$nextTick(() => {
          this.signaturePadKey += 1;
        });
      }
    }
  },

  methods: {
    closeModal() {
      this.clearPad();
      this.$emit("closeSignatureModel");
    },
    clearPad() {
      if (this.controlOpt === "signature") {
        this.$refs.signaturePad.clearSignature();
      }
      (this.uploadedFile = null),
        (this.s3Location = ""),
        (this.uploadedFileName = ""),
        (this.fileError = ""),
        (this.uploadFileType = "");
    },
    handleTabSwitch() {
      // Force re-render of the signature pad when switching tabs
      if (this.controlOpt === "signature") {
        this.$nextTick(() => {
          this.signaturePadKey += 1;
        });
      }
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (
        file &&
        (file.type === "image/png" ||
          file.type === "image/jpeg" ||
          file.type === "image/gif")
      ) {
        this.uploadedFile = file;
        this.uploadedFileName = file.name;
        this.uploadFileType = file.name
          .split(".")
          .pop()
          .toUpperCase();
        this.fileError = "";
      } else {
        this.fileError =
          "Invalid file format. Please upload a PNG, JPEG, or GIF image.";
      }
    },

    async handleSubmit() {
      this.startLoading();
      try {
        if (this.controlOpt === "upload_image" && this.uploadedFile) {
          const result = await S3UploadService.singleUpload(
            this.uploadedFile,
            "signatures"
          );
          this.s3Location = result.fullPath;
          this.s3key = result.key;
          // Use s3Location/s3key while submitting manual assessment form
        } else if (this.controlOpt === "signature") {
          const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
          if (!isEmpty) {
            let imageData = null;
            if (data.startsWith("data:image/png;base64,")) {
              imageData = data.replace("data:image/png;base64,", "");
            }

            // Decode base64 string to binary data
            const binaryData = atob(imageData);
            const arrayBuffer = new ArrayBuffer(binaryData.length);
            const uint8Array = new Uint8Array(arrayBuffer);
            for (let i = 0; i < binaryData.length; i++) {
              uint8Array[i] = binaryData.charCodeAt(i);
            }
            // Create a Blob from the binary data
            const blob = new Blob([uint8Array], { type: "image/png" });
            // Upload signature image
            const result = await S3UploadService.bolbImageUpload(
              blob,
              "signatures"
            );
            this.s3Location = result.fullPath;
            this.s3key = result.key;
            // Use s3Location/s3key while submitting manual assessment form
          }
        }
        this.$emit("handleSignature", {
          attachmentLink: this.s3Location,
          s3key: this.s3key,
        });
      } catch (error) {
        console.error("Upload error:", error.message);
        this.fileError = "Error uploading file. Please try again.";
      }
      this.stopLoading();
      this.closeModal();
    },

    handleDrop(event) {
      this.dragging = false;
      this.handleFileChange({ target: { files: event.dataTransfer.files } });
    },
    additionalOnChange() {},
    removeSignature() {
      const confirmed = confirm(this.$t('dueDiligence.areYouSureYouWantToContinueThisAction'));
      if (!confirmed) return;
      this.uploadedFile = null;
      this.uploadedFileName = "";
      this.uploadFileType = "";
      this.s3Location = "";
      this.s3key = "";
    },
  },
  mixins: [loadingMixin],
};
</script>

<style lang="scss" scoped>
.draw-signature {
  border: double 3px transparent;
  border-radius: 5px;
  background-image: linear-gradient(white, white),
    radial-gradient(circle at top left, #4bc5e8, #9e3bec);
  background-origin: border-box;
  background-clip: content-box, border-box;
  text-align: center;
}

::v-deep #signature{
  margin:auto !important;
}

.dropZone {
  width: 100%;
  height: 200px;
  position: relative;
  border: 2px dashed #97a8b8;
}

.upload-document {
  width: 100%;
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
  overflow: clip;
}

.dropZone-over {
  background: #5c5c5c;
  opacity: 0.8;
  overflow: clip;
}

.dropZone-uploaded {
  width: 100%;
  height: 450px;
  position: relative;
  border: 2px solid $primary-color;
  overflow: clip;
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
  overflow: clip;
}

.blue-color {
  color: #0057bd;
}
</style>
