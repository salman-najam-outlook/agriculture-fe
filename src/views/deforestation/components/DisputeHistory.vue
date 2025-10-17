<template>
  <v-card elevation="0" class="pa-5">
    <v-sheet class="dispute-box mx-auto pa-5 mb-4 rounded-xl" height="auto" width="100%">
      <div>
        <v-row>
          <v-col>
            <p class="mb-2 pl-5">{{ dispute.creating_user.firstName }} {{ dispute.creating_user.lastName }}</p>
          </v-col>
          <v-spacer></v-spacer>
          <v-col class="text-right">
            <v-btn color="#D32F2F" text @click="deleteResolution(dispute)" class="reply-button">Delete</v-btn>
            <v-btn color="primary" text @click="toggleReply" class="reply-button">Reply</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-badge color="warning" :content="disputeIndex" inline
            v-if="dispute.creating_user.role === 'admin'"></v-badge>
          <v-badge color="primary" :content="disputeIndex" inline v-else></v-badge>
          <p class="mb-2 ml-1" style="font-weight: bold;">{{ dispute.title }}</p>
        </v-row>
        <v-row class="ml-2">
          <v-col>
            <p>{{ dispute.description }}</p>
          </v-col>
          <v-spacer></v-spacer>
          <v-col>
            <p class="grey--text text-right">{{ formatDate(dispute.createdAt) }}</p>
          </v-col>
        </v-row>

        <DisputeAttachment :s3Key="dispute.s3Key" :s3Location="dispute.s3Location" />

        <div v-for="(comment, index) in dispute.comments" :key="comment.id" class="py-2">
          <v-row class="mt-4 comment-row">
            <v-col>
              <v-row>
                <v-badge :color="comment.commenting_user.role === 'admin' ? 'warning' : 'success'"
                  :content="`${disputeIndex}.${index + 1}`" inline></v-badge>
                <span class="ml-1">{{ comment.comment }}</span>
              </v-row>
            </v-col>
            <v-col>
              <p class="grey--text text-right">{{ formatDate(comment.createdAt) }}</p>
            </v-col>
          </v-row>

          <DisputeAttachment v-if="comment.s3Key" :s3Key="comment.s3Key" :s3Location="comment.s3Location" />
        </div>

        <v-row align="center" v-if="showInput">
          <v-col class=" pl-7 pt-10" cols="4">
            <v-text-field v-model="message" min-width="1000px" placeholder="Type here" class="custom-text-field"
              outlined>
              <template v-slot:append>
                <v-btn icon @click="attachFile">
                  <v-icon>mdi-paperclip</v-icon>
                </v-btn>
                <input ref="fileInput" type="file" accept="image/*,.pdf" style="display: none"
                  @change="handleFileUpload" />
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="auto">
            <v-btn color="primary" @click="commentDispute" class="rounded-button">
              <v-icon style="font-size: 16px">mdi-send</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row v-if="uploadedFile">
          <v-sheet style="border: 1px solid #ccc; border-radius: 5px;background: #0EBF671A;"
            class="px-4 ml-7 pt-2 align-center" height="auto" max-width="100%">
            <p>{{ this.uploadedFileName }}</p>
          </v-sheet>
        </v-row>
      </div>
    </v-sheet>
    <ConfirmBax
      v-if="deleteconfirm"
      :dialog="deleteconfirm"
      :title="confirmboxinfo.title"
      :message="confirmboxinfo.message"
      confirmBtnText="CONFIRM"
      cancelBtnText="CANCEL"
      :confirmData="itemToDelete"
      @continue:action="deleteConfirmed"
      @cancel:action="deleteconfirm = false"
      cancelBtnOutlined
    />
  </v-card>
</template>

<script>
import DeforestationService from "@/_services/DeforestationService";
import loadingMixin from "@/mixins/LoadingMixin";
import download from "@/mixins/DownloadMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import DateMixin from "@/mixins/DateMixin";
import moment from "moment";
import S3UploadService from "@/_services/S3UploadService";
import DisputeAttachment from "./DisputeAttachment.vue";
import ConfirmBax from "@/components/ConfirmBox.vue";

export default {
  data() {
    return {
      message: '',
      showInput: false,
      uploadedFile: undefined,
      uploadedFileName: null,
      s3Key: null,
      s3Location: null,
      deleteconfirm: false,
      confirmboxinfo: {
        title: "",
        message: "",
      },
      itemToDelete:{}
    };
  },
  props: {
    dispute: {
      type: Object,
      required: true,
    },
    disputeIndex: {
      type: Number,
      required: true
    },
  },
  components: {
    DisputeAttachment: DisputeAttachment,
    ConfirmBax
  },
  computed: {
    getCurrentUser() {
      return this.$store.getters.getUser
    },
  },
  methods: {
    async uploadAttachment() {
      const uploadResponse = await S3UploadService.singleUpload(this.uploadedFile, 'dispute_resolution_comment_attachments')
      return uploadResponse;
    },
    async commentDispute() {
      this.startLoading()
      try {
        if (this.uploadedFile) {
          const result = await this.uploadAttachment();
          this.s3Location = result.fullPath;
          this.s3Key = result.key;
        }

        const params = {
          disputeId: parseInt(this.dispute.id),
          comment: this.message,
          s3Key: this.s3Key,
          s3Location: this.s3Location
        };

        DeforestationService.createDisputeComment(params).then(res => {
          const disputeComment = res.data.createDisputeComment;
          this.clearCommentData();
          this.$emit('comment-added', this.$props.disputeIndex - 1, disputeComment);
        });

        this.stopLoading()
      } catch (error) {
        console.log(error)
        this.$notify({
          'text': error,
          'type': 'error'
        })
        this.stopLoading();
      }
    },
    async clearCommentData() {
      this.uploadedFile = undefined;
      this.uploadedFileName = null;
      this.message = null;
      this.s3key = null;
      this.s3Location = null;
    },

    toggleReply() {
      this.showInput = !this.showInput
    },
    attachFile() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.uploadedFile = file;
        this.uploadedFileName = file.name;
        this.fileError = '';
      } else {
        this.fileError = 'Invalid file format. Please upload a PDF or Image file.';
      }
    },

    formatDate(date) {
      return moment(date).format("DD-MMM-YYYY h:mm a");
    },
    deleteResolution(dispute) {
      this.itemToDelete = { id: dispute?.id, type: "location" };
      this.deleteconfirm = true;
      this.confirmboxinfo.title = "Confirmation";
      this.confirmboxinfo.message =
        "Are you sure you want to delete this polygon? It will also remove  any information and files attached with it.";
    },
    async deleteConfirmed(action, data) {
      if (action) {
        await DeforestationService.deleteDisputeHistory(data.id);
      }
      this.itemToDelete = { id: null, type: null };
      this.deleteconfirm = false;
      this.$emit('refresh-get-disputes')
    },
  },
  mixins: [loadingMixin, download, getPermittedActions, DateMixin],
};
</script>

<style lang="scss" scoped>
.reply-button {
  text-transform: none;
  text-decoration: underline;
}

.rounded-button {
  border-radius: 50%;
  min-width: 45px !important;
  height: 45px !important;
}

.dispute-box {
  border: 1px solid #ccc;
  border-radius: 12px;
  background-color: #fafafa;
}

.custom-text-field .v-text-field__slot {
  height: 30px !important;
}

::v-deep .v-application--is-ltr .v-text-field .v-input__append-inner {
  margin: auto !important;
}

::v-deep .v-text-field--enclosed .v-input__append-inner {
  margin-top: 10px !important;
}

::v-deep .comment-row > .col {
  max-height: 36px;
}
</style>
