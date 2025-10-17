<template>
  <v-dialog v-model="dialog" persistent max-width="50vw">
    <v-card flat>
      <v-toolbar flat color="secondary">
        <v-toolbar-title class="white--text">
          View Deforestation Assessment
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon class="white--text" @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <div class="d-flex mt-6">
          <h2>{{ $t("deforestation.productionPlace") }}</h2>
        </div>

        <v-row>
          <v-col cols="6">
            <h4>{{ $t("deforestation.productionPlace") }}</h4>
            <p class="pt-3">{{ productionPlaceDetails.farm.farmName || "" }}</p>
          </v-col>
          <v-col cols="6">
            <h4>{{ $t("deforestation.producerName") }}</h4>
            <p class="pt-3">
              {{ productionPlaceDetails.farm.userDdsAssoc.firstName || "" }}
              {{ productionPlaceDetails.farm.userDdsAssoc.lastName || "" }}
            </p>
          </v-col>
          <v-col cols="6">
            <h4>{{ $t("deforestation.producerCountry") }}</h4>
            <p class="pt-3">{{ countryName }}</p>
          </v-col>
          <v-col cols="6">
            <h4>{{ $t("farm.area") }}(ha)</h4>
            <p class="pt-3">
              {{
                parseFloat(productionPlaceDetails.farm.area).toFixed(5) || ""
              }}
            </p>
          </v-col>
        </v-row>

        <v-divider></v-divider>

        <div class="d-flex mt-6">
          <h2>Upload Deforestation Assessment</h2>
          <v-spacer></v-spacer>
          <v-autocomplete
            :placeholder="$t('Select status')"
            outlined
            v-model="EUDRDeforestationStatusValue"
            :items="EUDRDeforestationStatus"
            dense
            item-text="text"
            item-value="value"
            style="max-width: 36%;"
          ></v-autocomplete>
        </div>

        <!-- Upload file section -->
        <v-row>
          <v-col cols="2">
            <div class="docs-box mr-4">
              <div class="docs-preview">
                <div class="img-item">
                  <div class="pdf-box">
                    <v-icon class="icon-class" @click="openFile"
                      >mdi-eye</v-icon
                    >
                    <h1>{{ s3Result.extension }}</h1>
                  </div>
                </div>
              </div>
            </div>
          </v-col>
          <v-col cols="10">
            <div
              class="text-box mr-4"
            >
              <v-textarea
                v-model="s3Result.eudr_comment"
                placeholder="Comments"
                outlined
              ></v-textarea>
            </div>
          </v-col>
        </v-row>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green" outlined @click="closeModal">{{
            $t("cancel")
          }}</v-btn>
          <v-btn color="green white--text" @click="handleClick">{{
            $t("save")
          }}</v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import generalMixin from "@/mixins/GeneralMixin";
import loading from "@/mixins/LoadingMixin";
import DeforestationService from "@/_services/DeforestationService";
import FarmService from "@/_services/FarmService";
import S3UploadService from "@/_services/S3UploadService";

export default {
  props: {
    dialog: {
      type: Boolean,
      required: true,
      searchLocation: "",
    },

    productionPlaceDetails: {
      type: Object,
      required: true,
    },

    diligenceReportID: {
      type: Number,
    },
  },
  components: {},
  data() {
    return {
      newproductionPlaceDetails: null,
      file: "",
      fileError: "",
      progressText: "Uploading...",
      progressColor: "success",
      progressIcon: "mdi-progress-upload",
      responseMessage: "",
      uploadError: false,
      progress: 0,
      link: "",
      linkError: false,
      dragging: false,
      loading: false,
      area: 0,
      extensionStr: null,
      EUDRDeforestationStatus: [
        {text: this.$t("deforestation.veryHighDeforestationProbability"), val: "Very High Probability"},
        { text: this.$t("deforestation.highDeforestationProbability"), val: "High Probability" },
        { text: this.$t("deforestation.mediumDeforestationProbability"), val: "Medium Probability" },
        { text: this.$t("deforestation.lowDeforestationProbability"), val: "Low Probability" },
        { text: this.$t("deforestation.veryLowDeforestationProbability"), val: "Very Low Probability" },
        {text: this.$t("deforestation.zeroNegligibleDeforestationProbability"), val: "Zero/Negligible Probability"},
        { text: this.$t("deforestation.manuallyMitigated"), val: "Manually Mitigated" },  
      ],
      EUDRDeforestationStatusValue: null,
      countries: [],
      s3Result: {
        s3key: null,
        s3Location: null,
      },
    };
  },

  async mounted() {
    await this.getCountries();
    this.EUDRDeforestationStatusValue =
      this.productionPlaceDetails.eudr_deforestation_status ?? "";

      this.s3Result = (({ eudr_s3_key, eudr_s3_location, eudr_comment }) => ({
        eudr_s3_key,
        eudr_s3_location,
        eudr_comment,
        extension: eudr_s3_key.split(".").pop(),
      }))(this.productionPlaceDetails);
  },
  watch: {},
  computed: {
    countryName() {
      const countryId = this.productionPlaceDetails.farm.userDdsAssoc.countryId;
      const country = this.countries.find(
        (country) => country.code === countryId
      );
      return country ? country.name : "";
    },
  },
  methods: {
    async getCountries() {
      const data = await FarmService.loadCountries();
      this.countries = data.data;
    },

    closeModal() {
      this.$emit("closeViewAssessmentModal");
    },

    onChange(e) {
      var files = e.target.files || e.dataTransfer.files;

      const file = e.target.files[0];

      //validate file by file name, shapefile doesnt give mimetype apparently
      let extensionStr = file.name.slice(file.name.lastIndexOf("."));
      if (
        extensionStr !== ".pdf" &&
        extensionStr !== ".csv" &&
        extensionStr !== "xlsx"
      ) {
        this.$notify({
          title: this.$t(
            "Invalid file format. Please upload a .pdf, .csv, or .xlsx file."
          ),
          type: "error",
        });
        return;
      }

      this.extensionStr = extensionStr;

      if (!files.length) {
        this.dragging = false;
        return;
      }
      this.file = files[0];
      this.uploadFile();
    },

    handleClick() {
      if (this.dataEntryMethod == "upload") {
        this.uploadFile();
      } else {
        this.save();
      }
    },

    removeFile() {
      this.file = "";
    },

    async uploadFile() {
      this.startLoading();
      try {
        const result = await S3UploadService.singleUpload(
          this.file,
          "eudr-deforestation-status"
        );
        this.s3Result = {
          eudr_s3_location: result.fullPath,
          eudr_s3_key: result.key,
        };
      } catch (error) {
        console.error("Upload File Error:", error);
      } finally {
        this.stopLoading();
      }
    },
    async openFile(){
      window.open(this.s3Result.eudr_s3_location,'_blank')
    },
    async save() {
      this.startLoading();
      let payloadData = {
        farm_id: [parseInt(this.productionPlaceDetails.farm.id)],
        diligence_report_id: parseInt(this.diligenceReportID),
        eudr_deforestation_status: this.EUDRDeforestationStatusValue,
        eudr_s3_key: this.s3Result.eudr_s3_key,
        eudr_s3_location: this.s3Result.eudr_s3_location,
        eudr_comment: this.s3Result.eudr_comment,
      };
      DeforestationService.updateDeforestationStatus(payloadData)
        .then((res) => {
          if (res.errors && res.errors.length > 0) {
            this.stopLoading();
            const errorMessage =
              res.errors[0].message || "An unexpected error occurred.";
            this.$notify({
              type: "error",
              text: errorMessage,
            });
            return;
          }
          if (res.data) {
            const {
              success,
              message,
            } = res?.data?.updateManualEUDRDeforestationStatus;
            if (success) {
              this.$notify({
                title: message,
                type: "success",
              });
            } else {
              this.$notify({
                title: this.$t('somethingWentWrong'),
                type: "error",
              });
            }
          }
        })
        .catch((err) => {
          this.$notify({
            title: err.message || this.$t('somethingWentWrong'),
            type: "error",
          });
        })
        .finally(() => {
          this.stopLoading();
          this.$emit("saveEudrAssessment");
        });
    },
  },
  mixins: [loading, generalMixin],
};
</script>

<style lang="scss" scoped>
.position-relative {
  position: relative;
}
  
::v-deep .pdf-box {
  height: 100px;
  width: 100px;
  background-color: #e5f8f1;
  position: relative;
  line-height: 75px;
  text-align: center;
}

::v-deep .pdf-box h1 {
  position:absolute;
  top:18%;
  left: 25%;
  color: #135b00;
}

::v-deep .pdf-box .icon-class{
  position:absolute;
  top: 8%;
  left: 67%;
}


::v-deep .search-container {
  position: absolute;
  top: 0;
  align-items: center;
  margin-top: 10px;
  width: 98%;
  left: 0;
  z-index: 9999 !important;
  left: 10px;
}

::v-deep .location-input {
  background-color: #fff;
  flex: 1;
  padding: 10px;
  border: none;
  outline: none;
  font-size: 16px;
  background: white;
  padding: 8px 20px;
  border-radius: 4px;
  width: 89%;
}
::v-deep .search-icon {
  position: absolute;
  right: 10px;
  pointer-events: none;
  color: #757575;
}

.fullscreen-icon {
  background-color: #fff;
  margin-left: 10px;
  height: 50px;
  width: 50px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

::v-deep
  .theme--light.v-data-table
  > .v-data-table__wrapper
  > table
  > tbody
  > tr
  > td {
  border: 0px !important;
}

.row {
  margin: 0px !important;
}
#dialog-link1 {
  cursor: pointer !important;
}

#dialog-link1::placeholder {
  color: #002287 !important;
  text-decoration: underline !important;
}
.form {
  width: 100%;
}
.progress-bar {
  display: flex;
  justify-content: center;
  align-items: center;
}

.progress-num {
  display: flex;
  justify-content: flex-end;
  font-weight: bold;
}

.uploadedFile-info {
  width: 100%;
  padding: 18px;
}

.dropZone {
  width: 100%;
  height: 150px;
  position: relative;
  border: 2px dashed #97a8b8;
  padding: 100px 0;
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
}

.dropZone-over {
  background: #5c5c5c;
  opacity: 0.8;
}

.dropZone-uploaded {
  width: 100%;
  height: 150px;
  position: relative;
  border: 2px solid $primary-color;
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
}

.removeFile {
  width: 200px;
}

.link-input {
  border-radius: 8px;
  background-color: rgba(209, 209, 209, 0.15);
  padding: 8px;

  .link-text {
    background: none;
    border: none;
    padding: 8px;
    width: 80%;

    &:focus {
      outline: none;
    }
  }

  .link-btn {
    width: 20%;
    background-color: white;
  }


}
</style>
