<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-4">
        <h2> {{ $t("activationKey.activationKey")}} >> {{ $t("activationKey.uploadedFiles")}}</h2>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          dark
          class="mr-3"
          outlined
          @click="$router.push({ name: 'ActivationKeyList' })"
        >
          {{ $t("back") }}
        </v-btn>
      </div>
      <v-card elevation="0" class="px-5">
        <v-card-text>
          <div class="d-flex mt-5">
            <v-text-field
              prepend-inner-icon="mdi-magnify"
              outlined
              height="5px"
              :placeholder="$t('search')"
              dense
              v-model="search"
              @input="resetSearchOnEmpty"
              class="shrink"
            ></v-text-field>
            <v-spacer></v-spacer>
            <div class="py-1 title">
              {{ from }} - {{ to }} of {{ totalFiles }}
            </div>
            <v-btn
              class="mx-2"
              fab
              small
              outlined
              color="primary"
              :disabled="options.page <= 1"
              @click="pageChange(false)"
            >
              <v-icon dark>
                mdi-chevron-left
              </v-icon>
            </v-btn>
            <v-btn
              class="mx-2"
              fab
              small
              outlined
              color="primary"
              :disabled="options.page >= totalPages"
              @click="pageChange(true)"
            >
              <v-icon dark>
                mdi-chevron-right
              </v-icon>
            </v-btn>
          </div>
          <v-row>
            <v-col lg="4" md="6" sm="6" xs="12" v-for="(n, i) in files" :key="i">
              <v-card class="pa-2 green2 elevation-0">
                <v-list-item>
                  <v-list-item-avatar tile class="pa-1" size="50">
                    <v-img src="/icons/pngfile.png"></v-img>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title v-text="n.file_name"></v-list-item-title>

                    <v-list-item-subtitle
                      v-text="getLocalTimeFromUTC(n.createdAt)"
                    ></v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-menu
                      transition="slide-x-transition"
                      left
                      absolute
                      offset-x
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn x-small plain v-bind="attrs" v-on="on">
                          <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                      </template>

                      <v-list>
                        <v-list-item @click="shareViaEmail(n.csv_url)">
                          <v-list-item-title>{{ $t("activationKey.shareViaEmail") }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="downloadFile(n.csv_url)">
                          <v-list-item-title>{{ $t("activationKey.donwload") }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="deleteFile(n.s3_key)" v-if="(getModulePermittedActions.delete)">
                          <v-list-item-title>{{ $t("activationKey.deleteFile") }}</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-list-item-action>
                </v-list-item>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
    <send-mail
      v-if="showSendEmail"
      :csvFileUrl="csvFileUrl"
      :generatedKey="null"
      :dialogU="showSendEmail"
      @closeSendEmail="closeSendEmail"
    ></send-mail>
  </div>
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import download from "@/mixins/DownloadMixin";
import SendMail from "./SendMail.vue";
import getPermittedActions from "@/mixins/GetPermittedActions";
import DateMixin from "@/mixins/DateMixin";

export default {
  components: {
    SendMail,
  },
  async mounted() {
    const fetchData = async () => {
      await this.getAllUploadedFiles();
    };

    await fetchData();
  },
  data() {
    return {
      options: {},
      filesLoading: false,
      search: "",
      from: 0,
      to: 0,
      totalPages: 1,
      totalFiles: 1,
      selectedItem: false,
      files: [],
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: false,
          to: { name: "Users" },
          exact: true,
        },
        {
          text: this.$t("activationKey.activationKey"),
          disabled: true,
          href: "breadcrumbs_link_1",
        },
      ],
      showSendEmail: false,
      csvFileUrl: null,
    };
  },
  methods: {
    resetSearchOnEmpty() {},
    selectItem(item) {
      this.selectedItem = item;
    },
    async getAllUploadedFiles() {
      try {
        const { data } = await this.$http.get("/user/activation/csv/files");
        this.files = data.data;
      } catch (err) {
        console.log("file error", err);
      }
    },

    downloadFile(fileUrl) {
      this.startLoading();
      this.downloadSourceFile(fileUrl, "text/csv", "uploaded-csv")
        .then(() => {
          this.stopLoading();
        })
        .catch((err) => {
          console.log(err);
          this.stopLoading();
        });
      // this.$http.get(fileUrl, { responseType: 'blob' })
      // .then(response => {
      //     const blob = new Blob([response.data], { type: 'text/csv' })
      //     const link = document.createElement('a')
      //     link.href = URL.createObjectURL(blob)
      //     link.download = 'files download'
      //     link.click()
      //     URL.revokeObjectURL(link.href)
      //     this.stopLoading()
      // }).catch(ee => {
      //     console.log(ee)
      //     this.stopLoading()
      // })
    },

    async deleteFile(s3Key) {
      this.startLoading();
      try {
        const { data } = await this.$http.delete(
          `/user/activation/csv/${s3Key}`
        );
        if (data.code === 200) {
          this.stopLoading();
          this.$notify({
            title: "Uploaded file deleted successfully.",
            type: "success",
          });
          this.getAllUploadedFiles();
        } else {
          this.stopLoading();
          this.$notify({
            title: this.$t("somethingWentWrong."),
            type: "error",
          });
        }
      } catch (err) {
        console.log(err);
        this.stopLoading();
        this.$notify({
          title: this.$t("somethingWentWrong."),
          type: "error",
        });
      }
    },

    shareViaEmail(fileUrl) {
      this.csvFileUrl = fileUrl;
      this.showSendEmail = true;
    },

    closeSendEmail() {
      this.csvFileUrl = null;
      this.showSendEmail = false;
    },
  },
  mixins: [loadingMixin, download, getPermittedActions, DateMixin],
};
</script>
<style lang="scss" scoped></style>
