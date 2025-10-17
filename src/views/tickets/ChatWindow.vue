<template name="ChatWindow">
  <div class="chat-container mx-4" ref="chatWindowRef">
    <div class="d-flex mb-4 mx-4">
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title>
            <h3>
              {{ selectedItemData.requestorName }}
              <span>#{{ selectedItemData.id }}</span>
              <span class="ml-4 primary--text">{{
                selectedItemData.status
              }}</span>
            </h3>
          </v-list-item-title>
          <v-list-item-subtitle class="mt-2 description-header" v-html="formatDescriptionWithLinks(selectedItemData.description)"></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        outlined
        dark
        small
        class="mr-2"
        @click="onBackButtonClick"
      >
        {{ $t("back") }}
      </v-btn>
    </div>
    <v-card elevation="0" class="pa-5 chat-box">
      <v-list three-line>
        <v-list-item
          @click="showImagePop(item.fileName)"
          v-for="(item, index) in selectedItemData.ticketMedia"
          :key="`${index}_img`"
        >
          <div class="d-flex">
            <v-list-item-avatar>
              <v-img :src="item.avatar"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-img
                max-height="100"
                max-width="200"
                :src="item.fileName"
              ></v-img>
            </v-list-item-content>
          </div>
        </v-list-item>
        <v-list-item
          v-for="(item, index) in messages"
          :key="index"
          :class="item.sent ? 'justify-end text-right' : ''"
        >
          <div v-if="!item.sent" class="d-flex">
            <v-list-item-avatar>
              <v-img :src="item.avatar"></v-img>
            </v-list-item-avatar>

            <v-list-item-content style="background-color: 'CCF2E3'">
              <v-list-item-subtitle
                v-if="item.comment"
                v-text="formatDateTime(item.createdAt)"
              >
              </v-list-item-subtitle>
              <v-list-item-subtitle
                v-html="item.comment"
                class="message-received"
              >
              </v-list-item-subtitle>
              <v-list-item-subtitle
                v-if="item.file_url"
                v-text="formatTime(item.createdAt)"
              ></v-list-item-subtitle>
              <v-img
                @click="showImagePop(item.file_url)"
                max-height="100"
                max-width="200"
                :src="item.file_url"
              ></v-img>
            </v-list-item-content>
          </div>
          <div v-else class="d-flex float-right">
            <v-list-item-content class="justify-end">
              <v-list-item-subtitle
                v-if="item.comment"
                v-text="formatDateTime(item.createdAt)"
              >
              </v-list-item-subtitle>
              <v-list-item-subtitle
                v-html="item.comment"
                class="message-sent"
                v-if="item.comment"
              >
              </v-list-item-subtitle>
              <v-list-item-subtitle
                v-if="item.file_url"
                v-text="formatTime(item.createdAt)"
              ></v-list-item-subtitle>
              <v-img
                class="img1"
                max-height="100"
                max-width="150"
                @click="showImagePop(item.file_url)"
                v-if="item.file_url"
                :src="item.file_url"
              ></v-img>
            </v-list-item-content>
          </div>
        </v-list-item>
      </v-list>

      <v-text-field
        :placeholder="$t('typeMsg')"
        v-model="chatMessage"
        outlined
        dense
        single-line
        hide-details="auto"
        filled
        append-outer-icon="mdi-send"
        @click:append-outer="sendMessage"
      >
        <!-- append-icon="mdi-paperclip" -->
        <!-- @click:append="attachFile" -->
        <template #append>
          <div style="width: 30px">
            <label style="white-space: nowrap" for="file-input">
              <v-icon>mdi-paperclip</v-icon>
            </label>

            <input
              type="file"
              id="file-input"
              name="file-input"
              accept="image/*"
              style="display: none"
              @change="onFileChanged"
            />
          </div>
          {{ selectedFile ? selectedFile.name : "" }}
        </template>
      </v-text-field>
    </v-card>
    <v-dialog max-width="900" v-model="showImage">
      <img :src="imageUrl" class="responsive-image-pop" />
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import LoadingMixin from "@/mixins/LoadingMixin";

export default {
  mixins: [LoadingMixin],
  props: ["selectedItemData"],
  data() {
    return {
      imageUrl: "",
      showImage: false,
      chatMessage: "",
      messages: [],
      selectedFile: null,
    };
  },
  methods: {
    formatDescriptionWithLinks(text) {
      if (!text) return '';
      
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      
      return text.replace(urlRegex, (url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #1976d2; text-decoration: underline;">${url}</a>`;
      });
    },
    showImagePop(imageUrl) {
      this.showImage = true;
      this.imageUrl = imageUrl;
    },
    async getComments() {
      const res = await axios.get(
        `ticket/comments/${this.selectedItemData.id}`
      );
      if (res.data.success) {
        this.messages = res.data.data.sort(function (a, b) {
          var keyA = new Date(a.id),
            keyB = new Date(b.id);
          // Compare the 2 ids
          if (keyA < keyB) return -1;
          if (keyA > keyB) return 1;
          return 0;
        });
      }
      // console.log("messages --> ", this.messages);
    },
    async sendMessage() {
      let commentType = "string";
      if (this.chatMessage !== "" || this.selectedFile) {
        let formData = new FormData();

        formData.append("requesterId", this.selectedItemData.requesterId);

        if (this.selectedFile) {
          const fileType = this.selectedFile.type;
          if (["image/jpeg", "image/jpg", "image/png"].includes(fileType)) {
            formData.append("file", this.selectedFile);
          } else {
            console.error("Unsupported file type");
            return;
          }
        }

        this.startLoading();
        try {
          const res = await axios.post(
            `ticket/comments?ticketId=${this.selectedItemData.id}&comment_type=${commentType}&comment=${this.chatMessage}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (res.data.success) {
            this.getComments();
            this.selectedFile = null;
            this.chatMessage = "";
            this.stopLoading();
          } else {
            console.error("Failed to send comment", res.data);
          }
        } catch (error) {
          console.error("Error sending comment", error);
          this.stopLoading();
        }
      } else {
        console.error("No message or file to send");
      }
    },
    onFileChanged(e) {
      this.selectedFile = e.target.files[0] || e.dataTransfer.files;

      if (
        !this.selectedFile ||
        this.selectedFile.type === "application/x-zip-compressed"
      )
        return;
      console.log(this.selectedFile);
    },
    formatTime(date) {
      const d = moment.utc(date).local().toDate();
      let month = "" + (d.getMonth() + 1);
      let day = "" + d.getDate();
      // const year = d.getFullYear();

      if (month.length < 2) {
        month = "0" + month;
      }
      if (day.length < 2) {
        day = "0" + day;
      }

      const hours = d.getHours();
      let minutes = d.getMinutes();
      minutes = minutes < 10 ? "0" + minutes : minutes;
      const strTime = hours + ":" + minutes;

      return strTime;
    },
    formatDateTime(date) {
      const d = moment.utc(date).local().toDate();
      let month = "" + (d.getMonth() + 1);
      let day = "" + d.getDate();
      const year = d.getFullYear();

      if (month.length < 2) {
        month = "0" + month;
      }
      if (day.length < 2) {
        day = "0" + day;
      }

      const hours = d.getHours();
      let minutes = d.getMinutes();
      minutes = minutes < 10 ? "0" + minutes : minutes;
      const strTime = hours + ":" + minutes;

      return [year, month, day].join("-") + " " + strTime;
    },
    onBackButtonClick() {
      this.$emit("onBackButtonClick");
    },
  },
  created() {
    this.getComments();
  },
};
</script>

<style>
.responsive-image-pop {
  width: 100%;
  height: auto;
}

.description-header a {
  color: #1976d2;
  text-decoration: underline;
}

.description-header a:hover {
  color: #1565c0;
  text-decoration: none;
}
</style>
