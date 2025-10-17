<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="cmt-box">
        <v-card elevation="0">
          <v-card elevation="0" v-if="report">
            <v-card class="mb-5" flat>
              <v-card-text>
                <v-row class="pl-3">
                  <v-col sm="3">
                    <div class="item-box">
                      <p class="text-subtitle-1 mb-2"> {{ $t('dueDiligence.internalReferenceNumber')
                        }}</p>
                      <p class="text-subtitle-1 font-weight-bold">{{
                          report.internalReferenceNumber || '-' }}</p>
                    </div>
                  </v-col>

                  <v-col sm="3">
                    <div class="item-box">
                      <p class="text-subtitle-1 mb-2"> EUDR Reference Number</p>
                      <p class="text-subtitle-1 font-weight-bold">{{ report.EUDRReferenceNumber || '-' }}</p>
                    </div>
                  </v-col>

                  <v-col sm="3">
                    <div class="item-box">
                      <p class="text-subtitle-1 mb-2"> Activity</p>
                      <p class="text-subtitle-1 font-weight-bold">{{ report.activity || '-' }}
                      </p>

                    </div>
                  </v-col>

                  <v-col sm="3">
                    <div class="item-box">
                      <p class="text-subtitle-1 mb-2"> Country of Activity
                      </p>
                      <p class="text-subtitle-1 font-weight-bold">{{ report.countryOfActivity.join(', ') || '-' }}</p>

                    </div>
                  </v-col>


                  <v-col sm="3">
                    <div class="item-box">
                      <p class="text-subtitle-1 mb-2"> Country of Entry
                      </p>
                      <p class="text-subtitle-1 font-weight-bold">{{ report.countryOfEntry || '-' }}</p>

                    </div>
                  </v-col>

                  <v-col sm="3">
                    <div class="item-box">
                      <p class="text-subtitle-1 mb-2"> Due Diligence Report Status
                      </p>
                      <v-chip variant="elevated" :color="getStatusColor" outlined>
                        {{ this.diligenceStatus || report.status }}
                      </v-chip>
                    </div>
                  </v-col>
                </v-row>

                <v-row class="pl-3">
                  <v-col sm="12">
                    <div class="item-box">
                      <h2 class="font-weight-bold"> Operator Data </h2>
                    </div>
                  </v-col>
                  <v-col sm="3">
                    <div class="item-box">
                      <p class="text-subtitle-1 mb-2">Name</p>
                      <p class="text-subtitle-1 font-weight-bold">
                        {{ `${report.operator.firstName || '-'} ${report.operator.lastName || ''}` }}
                      </p>

                    </div>
                  </v-col>

                  <v-col sm="3">
                    <div class="item-box">
                      <p class="text-subtitle-1 mb-2">Country
                      </p>
                      <p class="text-subtitle-1 font-weight-bold">
                        {{ report.operator.countryId || '-' }}
                      </p>

                    </div>
                  </v-col>

                  <v-col sm="3">
                    <div class="item-box">
                      <p class="text-subtitle-1 mb-2">ISO Code</p>
                      <p class="text-subtitle-1 font-weight-bold">
                        {{ report.operator.isoCode || '-' }}
                      </p>
                    </div>
                  </v-col>

                  <v-col sm="3">
                    <div class="item-box">
                      <p class="text-subtitle-1 mb-2"> EORI Number
                      </p>
                      <p class="text-subtitle-1 font-weight-bold">
                        {{ report.operator.eori_number || '-' }}
                      </p>
                    </div>
                  </v-col>

                </v-row>

                <v-row class="pl-3">
                  <v-col sm="12">
                    <div class="item-box">
                      <h2 class="font-weight-bold"> Supplier Data </h2>
                    </div>
                  </v-col>
                  <v-col sm="3">
                    <div class="item-box">
                      <p class="text-subtitle-1 mb-2"> Name
                      </p>
                      <p class="text-subtitle-1 font-weight-bold">
                        {{ `${report.supplier.firstName || '-'} ${report.supplier.lastName || ''}` }}
                      </p>

                    </div>
                  </v-col>

                  <v-col sm="3">
                    <div class="item-box">
                      <p class="text-subtitle-1 mb-2"> Email
                      </p>
                      <p class="text-subtitle-1 font-weight-bold">
                        {{ report.supplier.email || '-' }}
                      </p>

                    </div>
                  </v-col>

                  <v-col sm="3">
                    <div class="item-box">
                      <p class="text-subtitle-1 mb-2"> Phone Number
                      </p>
                      <p class="text-subtitle-1 font-weight-bold">
                        {{ report.supplier.mobile || '-' }}
                      </p>
                    </div>
                  </v-col>

                  <v-col sm="3">
                    <div class="item-box">
                      <p class="text-subtitle-1 mb-2"> Country
                      </p>
                      <p class="text-subtitle-1 font-weight-bold">
                        {{ report.supplier.countryId || '-' }}
                      </p>
                    </div>
                  </v-col>

                </v-row>
              </v-card-text>
            </v-card>
          </v-card>
          <v-card class="mb-5 mt-5" flat>
            <v-card-text>
              <v-row class="pl-2 mb-2">
                <v-col sm="12">
                  <v-toolbar-title class="font-weight-bold">
                    Report Summary
                  </v-toolbar-title>
                </v-col>
              </v-row>
              <v-row class="pl-3">
                <v-col sm="3">
                  <div class="item-box">
                    <p class="text-subtitle-1 mb-2">
                      Total Number of Geofence Polygons
                    </p>
                    <p class="text-subtitle-1 font-weight-bold">
                      {{ totalPolygon }}
                    </p>
                  </div>
                </v-col>

                <v-col sm="3">
                  <div class="item-box">
                    <p class="text-subtitle-1 mb-2">
                      Total Number of Geofence Points
                    </p>
                    <p class="text-subtitle-1 font-weight-bold">
                      {{ totalPoint }}
                    </p>
                  </div>
                </v-col>

                <v-col sm="3">
                  <div class="item-box">
                    <p class="text-subtitle-1 mb-2">Total Area (ha)</p>
                    <p class="text-subtitle-1 font-weight-bold">
                      {{ totalArea }}
                    </p>
                  </div>
                </v-col>

                <v-col sm="3">
                  <div class="item-box">
                    <p class="text-subtitle-1 mb-2">
                      Total Number of High Deforestation <br />
                      Farms
                    </p>
                    <p class="text-subtitle-1 font-weight-bold">
                      {{ totalHighDeforestationCount }}
                    </p>
                  </div>
                </v-col>

                <v-col sm="3">
                  <div class="item-box">
                    <p class="text-subtitle-1 mb-2">
                      Total Number of Deforestation Assessments
                    </p>
                    <p class="text-subtitle-1 font-weight-bold">
                      {{ diligenceReportAssessmentLength }}
                    </p>
                  </div>
                </v-col>

                <v-col sm="3">
                  <div class="item-box">
                    <p class="text-subtitle-1 mb-2">
                      Total Number Of Farms
                    </p>
                    <p class="text-subtitle-1 font-weight-bold">
                      {{ totalNumberOfFarms }}
                    </p>
                  </div>
                </v-col>

                <v-col sm="3">
                  <div class="item-box">
                    <p class="text-subtitle-1 mb-2">
                      Total Number of Low and Zero Risk Farms
                    </p>
                    <p class="text-subtitle-1 font-weight-bold">
                      {{ lowZeroRiskFarm }}
                    </p>
                  </div>
                </v-col>

                <v-col sm="3">
                  <div class="item-box">
                    <p class="text-subtitle-1 mb-2">
                      Total Area of High Risk Farm
                    </p>
                    <p class="text-subtitle-1 font-weight-bold">
                      {{ highRiskFarmArea }} ha
                    </p>
                  </div>
                </v-col>

                <v-col sm="3">
                  <div class="item-box">
                    <p class="text-subtitle-1 mb-2">
                      Total Area of Zero/Negligible Risk
                    </p>
                    <p class="text-subtitle-1 font-weight-bold">
                      {{ totalLowZeroFarmArea }} ha
                    </p>
                  </div>
                </v-col>

              </v-row>
            </v-card-text>
          </v-card>
        </v-card>
      </div>
    </v-container>
  </div>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";
import DeforestationService from "@/_services/DeforestationService";

export default {
  computed: {
    menusWithoutReport() {
      return this.menus.filter(
        (menu) => menu.id !== "assessment" && menu.id !== "disputes"
      );
    },
    getStatusColor() {
      const reportStatus = this.report.status;
      return reportStatus === "Compliant" ? "primary" : "red";
    },
  },
  mounted() {
    this.loading = false;
    this.getReportSummary();
  },
  async created() {
    this.startLoading();

    this.stopLoading();
  },
  watch: {},
  props: {
    diligenceStatus: {
      required: false,
    },
  },
  components: {},
  methods: {
    async getReportSummary() {
      this.startLoading();
      const {
        report,
        diligenceReportAssessmentLength,
        totalPolygon,
        totalArea,
        totalPoint,
        totalHighDeforestationCount,
        totalNumberOfFarms,
        lowZeroRiskFarm,
        highRiskFarmArea,
        totalLowZeroFarmArea,
      } = await DeforestationService.getSummaryDDS(this.$route.params.id);

      this.report = {
        ...report,
        supplier: this.handleEmptyUser(report.supplier),
        operator: this.handleEmptyUser(report.operator),
      };

      this.diligenceReportAssessmentLength = diligenceReportAssessmentLength;
      this.totalPolygon = totalPolygon;
      this.totalArea = totalArea;
      this.totalPoint = totalPoint;
      this.totalHighDeforestationCount = totalHighDeforestationCount;
      this.totalNumberOfFarms = totalNumberOfFarms,
      this.lowZeroRiskFarm = lowZeroRiskFarm,
      this.highRiskFarmArea = highRiskFarmArea,
      this.totalLowZeroFarmArea = totalLowZeroFarmArea,

      this.stopLoading();
    },
    handleEmptyUser(user) {
      return (
        user ?? {
          firstName: "N/A",
          lastName: "",
          countryId: "N/A",
          mobile: "N/A",
          email: "N/A",
          isoCode: "N/A",
          eori_number: "N/A",
        }
      );
    },
  },
  data() {
    return {
      report: {},
      totalProductionPlaces: 0,
      diligenceReportAssessmentLength: 0,
      totalPolygon: 0,
      totalArea: 0,
      totalPoint: 0,
      totalHighDeforestationCount: 0,
      totalNumberOfFarms: 0,
      lowZeroRiskFarm: 0,
      highRiskFarmArea: 0,
      totalLowZeroFarmArea: 0,
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: true,
          to: "/",
        },
        {
          text: 'Due Diligence...',
          disabled: true,
          to: "breadcrumbs_link_1",
        },
        {
          text: 'View summary',
          disabled: true,
          to: "breadcrumbs_link_1",
        },
      ],
    };
  },
  mixins: [loadingMixin],
};
</script>

<style lang="scss" scoped>
.font-weight-bold {
  font-weight: 900 !important;
}

.img-preview {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

.img-item {
  margin-left: 1px;
  max-height: 150px;
  position: relative;
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

.letterSpacing {
  letter-spacing: 0;
}

.my-awesome-table {
  table-layout: fixed;
}

::v-deep .v-tab:hover {
  background-color: #caf1e2;
  color: $primary_color !important;
}

::v-deep .green-shadow:hover {
  background-color: $primary_color;
  color: white;
}

::v-deep .my-custom-dialog {
  position: absolute;
  top: 0;
  min-height: 100%;
  right: 0;
  margin-right: 0px;
  margin-top: 0px;
}

::v-deep .square {
  width: 1vw;
  height: 1vw;
}

::v-deep .xxxx {
  border: 2px solid black;
}

::v-deep .product-name-cl {
  padding: 5px;
}

::v-deep .product-name-cl .product-img {
  display: flex;
  align-items: center;
}

::v-deep .product-img p {
  margin-left: 5px;
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

.dropZone {
  width: 100%;
  height: 150px;
  position: relative;
  border: 2px dashed #97a8b8;
}

.additional-logos-form {
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

.primary-color {
  color: #00bd73;
}

.gray-color {
  background: #dcdcdc80;
}

.removed-background {
  padding: 15px;
}
</style>
