<template>
  <v-dialog
    v-model="showDialog"
    width="50%"
    @click:outside="closeDialog"
    :retain-focus="false"
  >
    <v-card class="custom-card" rounded="0">
      <v-toolbar color="primary" class="white--text">
        <v-toolbar-title class="font-weight-bold">
          {{ $t("surveyBuilder.downloadSurvey") }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon class="white--text" @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="black--text">
        <v-row class="mb-0">
          <v-radio-group v-model="downloadType">
            <v-col>
              <v-radio
                class="font-weight-bold mb-3"
                :label="$t('surveyBuilder.downloadQuestion')"
                value="question"
                @change="onDownloadTypeChange('question')"
              ></v-radio>
              <v-radio
                class="font-weight-bold"
                :label="$t('surveyBuilder.downloadResponse')"
                value="response"
                @change="onDownloadTypeChange('response')"
              ></v-radio>
            </v-col>
          </v-radio-group>
        </v-row>
        <div class="font-weight-bold">
          {{ $t("surveyBuilder.chooseFileFormat") }}
        </div>
        <v-radio-group v-model="downloadFormat" row>
            <v-radio
              label="PDF"
              value="pdf"
              class="mr-4"
              :disabled="disableFormatSelection"
            ></v-radio>
            <v-radio
              label="XLS"
              value="xls"
              class="mr-4"
              :disabled="disableFormatSelection"
            ></v-radio>
            <v-radio
              label="CSV"
              value="csv"
              class="mr-4"
              :disabled="disableFormatSelection"
            ></v-radio>
        </v-radio-group>

        <v-card-actions class="mt-5" style="padding-right: 0">
          <v-spacer></v-spacer>
          <v-btn
            outlined
            class="px-4 mr-2"
            right
            depressed
            @click="closeDialog"
            color="primary"
          >
            {{ $t("cancel") }}
          </v-btn>

          <v-btn
            right
            class="px-4"
            :loading="downloadingSurvey"
            color="primary"
            @click="download()"
          >
            {{ $t("surveyBuilder.downloadSurvey") }}
          </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import SurveyBuilderService from "@/_services/SurveyBuilderService";
import DownloadMixin from "@/mixins/DownloadMixin";

export default {
  data() {
    return {
      downloadType: "question",
      downloadFormat: "pdf",
      disableFormatSelection: true,
      downloadingSurvey: false,
    };
  },
  props: {
    showDialog: {
      type: Boolean,
      require: true,
    },
    selectedSurvey: {
      type: Object,
      require: true,
    }
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    onDownloadTypeChange(type) {
      if (type === "question") {
        this.disableFormatSelection = true;
        this.downloadFormat = "pdf"
      }
      if (type === "response") {
        this.disableFormatSelection = false;
      }
    },
    async download() {
      this.downloadingSurvey = true;
      const requestParams = {
        download: this.downloadType, // response || question
        type: this.downloadFormat, // 'pdf', 'xls', 'csv'
        surveyId: this.selectedSurvey.id,
      }
      if (this.downloadType === "question") {
        await SurveyBuilderService.downloadSurvey(requestParams)
        .then((res) => {
          if(res) {
            this.$notify({
            title: "The download has been processed To queue",
            type: "success",
            position: "top right",
          });
          }
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          this.downloadingSurvey = false;
        })
      } else if (this.downloadType === "response") {
        await SurveyBuilderService.downloadSurvey(requestParams)
        .then((res) => {
          if(res) {
            this.$notify({
            title: "The download has been processed to queue",
            type: "success",
            position: "top right",
          });
          }
        })
        .catch((err) => {
          console.error(err);
        }).finally(() => {
          this.downloadingSurvey = false;
        })
      }
      this.closeDialog();
    },
  },
  mixins: [DownloadMixin],
};
</script>
<style scoped>
.format-line {
  margin-left: 0px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  /* width: 400px; */
}
</style>
