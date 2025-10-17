<template>
  <v-dialog v-model="dialog" persistent max-width="50vw">
    <v-card flat>
      <v-toolbar flat color="secondary">
        <v-toolbar-title class="white--text">
          Upload Deforestation Assessment
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon class="white--text" @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form
                ref="saveUploadAssessment"
                v-model="valid"
                lazy-validation
                autocomplete="off"
              >
        <template v-if="!Array.isArray(this.productionPlaceDetails)">
          <div class="d-flex mt-6">
            <h2>{{ $t("deforestation.productionPlace") }}</h2>
          </div>
          <v-row>
            <v-col cols="6">
              <h4>{{ $t("deforestation.productionPlace") }}</h4>
              <p class="pt-3">
                {{ productionPlaceDetails.farm.farmName || "" }}
              </p>
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
        </template>
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
            :rules="[(v) => !!v || 'Status is required']"
          ></v-autocomplete>
        </div>

        <!-- Upload file section -->
        <v-row>
          <div class="form pb-4">
            <div v-if="!file">
              <div
                :class="['dropZone', dragging ? 'dropZone-over' : '']"
                @dragenter="dragging = true"
                @dragleave="dragging = false"
              >
                <div class="dropZone-info" @drag="onChange">
                  <v-icon size="40" color="info">mdi-cloud-upload</v-icon>
                  <span class="fa fa-cloud-upload dropZone-title"></span>
                  <div class="d-flex-start">
                    <div class="info--text text-decoration-underline">
                      {{ $t("deforestation.selectFileToUploadData") }}
                    </div>
                  </div>
                  <div class="dropZone-upload-limit-info">
                    <div>{{ $t("oma.OrDragDrop") }}</div>
                  </div>
                </div>
                <input
                  type="file"
                  accept=".csv,.pdf,.xlsx"
                  @change="onChange"
                />
              </div>
              <span v-if="fileError" class="red--text">File is required.</span>
            </div>
            <div v-else class="dropZone-uploaded">
              <div class="dropZone-uploaded-info">
                <v-btn
                  class="ma-2 white--text"
                  @click="removeFile"
                  color="red"
                  outlined
                >
                  {{ $t("oma.removeFile") }}
                  <v-icon right dark> mdi-trash-can </v-icon>
                </v-btn>
              </div>
            </div>
            <v-chip
              v-if="file"
              label
              color="grey lighten-4"
              class=" mt-4 uploadedFile-info"
            >
              <v-icon left small>
                mdi-file-check
              </v-icon>
              {{ file.name }}
            </v-chip>
          </div>
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
      </v-form>
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
      type: [Object, Array],
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
      fileError: false,
      selectedFile: null,
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
      valid: true,
    };
  },

  async mounted() {
    await this.getCountries();
    this.EUDRDeforestationStatusValue =
      this.productionPlaceDetails.eudr_deforestation_status ?? null;
  },
  watch: {},
  computed: {
    countryName() {
      const countryId = this.productionPlaceDetails.farm.userDdsAssoc.countryId;
      const country = this.countries.find(
        (country) => country.name === countryId
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
      this.$emit("closeUploadAssessmentModal");
    },

    onChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (files.length > 0) {
        this.selectedFile = files[0];
        this.fileError = false; // Reset the error if a file is selected
      } else {
        this.selectedFile = null;
      }
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
      if (!this.$refs.saveUploadAssessment.validate()) return;
      if (!this.selectedFile) {
        this.fileError = true;
        return;
      }
      if (this.dataEntryMethod == "upload") {
        this.uploadFile();
      } else {
        this.save();
      }
    },

    removeFile() {
      this.file = "";
      this.selectedFile = ""
    },

    async uploadFile() {
      this.startLoading();
      try {
        const result = await S3UploadService.singleUpload(
          this.file,
          "eudr-deforestation-status"
        );
        this.s3Result = {
          s3Location: result.fullPath,
          s3key: result.key,
        };
      } catch (error) {
        console.error("Upload File Error:", error);
      } finally {
        this.stopLoading();
      }
    },

    cancel() {
      this.$emit("closeGeoLocationModal");
    },

    async save() {
      this.startLoading();
      const farmIds = Array.isArray(this.productionPlaceDetails) ? this.productionPlaceDetails.map((item)=>parseInt(item.farm.id)) : [parseInt(this.productionPlaceDetails.farm.id)];
      let payloadData = {
        farm_id: farmIds,
        diligence_report_id: parseInt(this.diligenceReportID),
        eudr_deforestation_status: this.EUDRDeforestationStatusValue ?? null,
        eudr_s3_key: this.s3Result.s3key,
        eudr_s3_location: this.s3Result.s3Location,
        eudr_comment: "",
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
