<template>
  <div class="text-f my-4 mb-8">
    <div class="item-box">
      <v-row class="px-3">
        <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">
          {{ question.title }}
        </label>
        <div class="upload-document pt-2">
          <div style="overflow: clip" :class="['dropZone', dragging ? 'dropZone-over' : '']"
            @dragenter="dragging = true" @dragleave="dragging = false" @drop="handleDrop">
            <div class="dropZone-info d-flex justify-center align-center" @dragover.prevent>
              <span class="fa fa-cloud-upload dropZone-title"></span>
              <span class="dropZone-title">
                <v-icon class="blue-color" size="50" color="gray">mdi-tray-arrow-up</v-icon>
              </span>
              <div class="dropZone-upload-limit-info px-3">
                <h3 class="blue-color underline" color="primary">
                  {{ $t('deforestation.selectFileToUpload') }}
                </h3>
                <p class="gray-color">{{ $t('farm.dropHere') }}</p>
              </div>
            </div>
            <input type="file" :multiple="allowMultiple" :accept="acceptExtensions" @change="additionalOnChange" />
          </div>
          <span class="red--text" v-if="fileError">File err</span>
        </div>
        <div class="pdf-docs mt-10 d-flex" v-for="(doc, key) in s3FileUploadResult" :key="key">
          <div >
            <div class="docs-box mr-4">
              <div class="docs-preview">
                <v-sheet elevation="2"
                  class="pdf-box d-flex align-center justify-center flex-column text-center mx-auto" style="
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                padding: 16px;
                position: relative;
                width: 120px;
                height: 120px;
              ">
                  <v-icon @click="removeFile(key)" class="delete-icon" style="
                  position: absolute;
                  top: 4px;
                  right: 4px;
                  color: #f44336;
                  cursor: pointer;
                " title="Remove file">
                    mdi-trash-can-outline
                  </v-icon>

                  <div class="justify-center" style="display:ruby">
                    <v-icon dark @click="openFile(doc?.attachmentLink)" style="color: green;cursor: pointer;"
                      title="View file">
                      mdi-eye
                    </v-icon>
                    <br />

                    <h2 class="file-extension mt-2" style="font-size: 14px; color: #607d8b;">
                      {{ doc.extension }}
                    </h2>
                  </div>
                </v-sheet>
                <span class="file-name mt-2"
                  style="display: block; font-size: 14px; text-align: center; color: #424242;">
                  {{ doc.name }}
                </span>
              </div>
            </div>
            <div class="text-box mr-4" v-if="
              question.fileTypeAdditionalSettings &&
              question.fileTypeAdditionalSettings.allowComments
            ">
              <v-textarea v-model="doc.comment" placeholder="Comments" outlined @input="saveComment"></v-textarea>
            </div>
          </div>
        </div>
      </v-row>
    </div>
  </div>
</template>

<script>
import S3UploadService from "@/_services/S3UploadService";
export default {
  props: {
    question: {
      type: Object,
      required: true,
    },
    answer: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  computed: {
    acceptExtensions() {
      return this.question.fileTypeAdditionalSettings?.allowedFileTypes ? this.question.fileTypeAdditionalSettings?.allowedFileTypes
        .map((v) => "." + v.toLowerCase())
        .join(", ") : [];
    },
    allowMultiple() {
      return this.question.fileTypeAdditionalSettings?.allowMultipleAttachments;
    },
  },
  mounted() {
    this.initializeFieldValue();
  },
  methods: {
    async openFile(url) {
      window.open(url, "_blank");
    },
    getRules() {
      const rules = [];
      if (this.question.isMandatory) {
        rules.push((v) => !!v || "This field is required");
      }
      return rules;
    },
    removeFile(key) {
      const confirmed = confirm(this.$t('dueDiligence.areYouSureYouWantToContinueThisAction'));
      if (!confirmed) return;
      this.documents.splice(key, 1);
      this.s3FileUploadResult.splice(key, 1);
      this.s3FileUploadResult = this.s3FileUploadResult.filter(
        (s) => s.s3key !== key
      );
      const questionResponse = {
        questionId: this.question.id,
        questionDetail: this.question,
        response: {
          questionId: this.question.id,
          assessmentQuestionType: this.question.assessmentQuestionType,
          questionHasOptions: false,
          fileAndDigitalSignatureFieldAnswer: this.s3FileUploadResult,
        },
      };
      this.$emit("handleTextValue", questionResponse);
    },
    saveComment() {
      const questionResponse = {
        questionId: this.question.id,
        questionDetail: this.question,
        response: {
          questionId: this.question.id,
          assessmentQuestionType: this.question.assessmentQuestionType,
          questionHasOptions: false,
          fileAndDigitalSignatureFieldAnswer: this.s3FileUploadResult,
        },
      };
      this.$emit("handleTextValue", questionResponse);
    },
    async uploadFiles(files) {
      const validExtensions =
        this.question.fileTypeAdditionalSettings?.allowedFileTypes?.map((v) =>
          v.toLowerCase()
        ) || [];
      const fileArray = Array.from(files);

      const validFiles = fileArray.filter((file) => {
        const extension = file.name
          .split(".")
          .pop()
          .toLowerCase();
        return validExtensions.includes(extension);
      });

      const invalidFiles = fileArray.filter((file) => {
        const extension = file.name
          .split(".")
          .pop()
          .toLowerCase();
        return !validExtensions.includes(extension);
      });

      if (invalidFiles.length > 0) {
        const invalidFileNames = invalidFiles.map((file) => file.name).join(", ");
        const allowedExtensionsMessage = validExtensions
          .map((ext) => `.${ext}`)
          .join(", ");

        this.$notify({
          type: "error",
          text: `The following files have invalid types: ${invalidFileNames}. Allowed file types are: ${allowedExtensionsMessage}.`,
        });
      } else {
        this.fileError = false;
        const newDocuments = await Promise.all(
          validFiles.map(async (file) => {
            const url = URL.createObjectURL(file);
            const result = await S3UploadService.singleUpload(
              file,
              "risk-assessment-docs"
            );
            const s3Result = {
              questionID: this.question?.id,
              attachmentLink: result.fullPath,
              s3key: result.key,
              name: file.name,
              extension:  file.name
                .split(".")
                .pop()
                .toLowerCase(),

            };
            this.s3FileUploadResult.push(s3Result);
            return {
              file,
              extension: file.name
                .split(".")
                .pop()
                .toLowerCase(),
              name: file.name,
              comment: "",
              url,
              s3Result,
            };
          })
        );

        this.documents.push(...newDocuments);

        if (this.s3FileUploadResult.length) {
          const questionResponse = {
            questionId: this.question.id,
            questionDetail: this.question,
            response: {
              questionId: this.question.id,
              assessmentQuestionType: this.question.assessmentQuestionType,
              questionHasOptions: false,
              fileAndDigitalSignatureFieldAnswer: this.documents,
            },
          };
          this.$emit("handleTextValue", questionResponse);
        }
      }
    },
    additionalOnChange(e) {
      const files = e.target.files;
      this.uploadFiles(files);
    },
    handleDrop(event) {
      event.preventDefault();
      this.dragging = false;
      const files = event.dataTransfer.files;
      this.uploadFiles(files);
    },
    initializeFieldValue() {
      if (this.answer && this.answer.fileAndDigitalSignatureFieldAnswer) {
        this.documents = this.answer.fileAndDigitalSignatureFieldAnswer.map((item) => ({
          ...item,
          extension: item?.s3Result?.s3key ? item.s3Result.s3key.split(".").pop() : item?.s3key ? item.s3key.split(".").pop() : "",
          name: item?.s3Result?.s3key ? item.s3Result.s3key.split("risk-assessment-docs/").pop() : item?.s3key ? item.s3key.split("risk-assessment-docs/").pop() : ""
        })) || [];
      }
    },
  },
  watch: {
    answer: {
      handler() {
        this.initializeFieldValue();
      },
      deep: true,
      immediate: true,
    },
    fieldValue(old, newv) {
      this.$emit("handleTextValue", newv);
    },
  },
  data() {
    return {
      rules: {
        fieldValue: "",
      },
      documents: [],
      dragging: false,
      fileError: false,
      s3FileUploadResult: [],
    };
  },
};
</script>

<style lang="scss" scoped>
.img-preview {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

.img-item img {
  max-height: inherit;
}

.img-item button {
  position: absolute;
  right: 0;
  color: red;
  cursor: pointer;
}

.underline {
  text-decoration: underline;
}

.gray-color {
  color: #979797;
}

.pdf-box {
  height: 75px;
  width: 75px;
  background-color: #e5f8f1;
  position: relative;
  line-height: 75px;
  text-align: center;
}

.pdf-box h1 {
  color: #135b00;
}

.preview-icon-class {
  position: absolute;
  top: -8px;
  left: -5px;
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
