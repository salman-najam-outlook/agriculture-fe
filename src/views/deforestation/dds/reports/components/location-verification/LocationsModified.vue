<template>
  <v-dialog v-model="dialog" persistent max-width="80vw">
    <v-card flat>
      <v-toolbar flat color="secondary">
        <v-toolbar-title class="white--text">{{
          $t("deforestation.locationModified.headerTitle")
        }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon class="white--text" @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-data-table
        hide-default-footer
        :headers="headers"
        :items="locations"
        :options.sync="options"
        class="elevation-1 mx-8"
        :loading="loading"
        :loading-text="$t('loadingData')"
      >
        <template v-slot:header.action="{ header }">
          <span v-if="header.value == 'action' && !isReportVerified">{{
            header.text
          }}</span>
        </template>
        <template v-slot:top>
          <p>
            {{ $t("deforestation.locationModified.headerDescription") }}
          </p>
          <v-toolbar flat>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Search"
                  single-line
                  hide-details
                  outlined
                  dense
                  class="search-field"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-spacer></v-spacer>
            <div class="d-flex mb-6">
              <div class="py-1 title">
                {{ from }} - {{ to }} of {{ totalProductionPlaces }}
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
                <v-icon dark>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page >= totalPages"
                @click="pageChange(true)">
                <v-icon dark>mdi-chevron-right</v-icon>
              </v-btn>
            </div>
          </v-toolbar>
        </template>
        <template v-slot:item.farmName="{ item }">
          <div>{{ item.farm.farmName }}</div>
          <div>{{ item.farmId }}</div>
        </template>
        <template v-slot:item.eudr_deforestation_status="{ item }">
          <v-btn v-if="getEUDRDeforestationStatus(item.deforestationStatus).text !== 'N/A'" small rounded
            min-width="200" depressed :class="getEUDRDeforestationStatus(item.deforestationStatus).class"
            height="34">{{ getEUDRDeforestationStatus(item.deforestationStatus).text }}</v-btn>
          <span v-else>N/A</span>
        </template>
        <template v-slot:item.action="{ item }">
          <div v-if="!isReportVerified">
            <a
              @click="$emit('viewGeofenceMap', item)"
              class="text-decoration-underline"
            >
              {{ $t("View Geolocation") }}
            </a>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn x-small fab v-bind="attrs" v-on="on" color="primary" @click="$emit('comfirmItemDelete', item)"
                  style="margin-left: 20px;">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>{{ $t("delete") }}</span>
            </v-tooltip>
          </div>
          <div class="d-flex" v-else>
            <v-menu v-if="checkEUDRExisting">
              <template v-slot:activator="{ on, attrs }">
                <v-btn x-small fab v-bind="attrs" v-on="on" color="primary">
                  <img src="/icons/todo-list.png" style="width: 34px; height: 34px; border-radius: 50%;" />
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(menu, i) in (item.deforestationInfo && item.deforestationInfo.deforestationStatus ? menus : menusWithoutReport)"
                  :key="i">
                  <v-list-item-title class="cursor-pointer" @click="showModel(menu.id, item)">{{ menu.title
                    }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </template>
      </v-data-table>
      <v-card-text class="mt-4">
        <div class="text-right">
          <v-btn color="primary" dark medium class="mr-3" outlined @click="closeModal">{{ $t('cancel') }}</v-btn>
          <v-btn v-if="!isReportVerified" color="primary" dark medium class="mr-3" @click="verifyLocation">{{
            $t('verify')
            }}</v-btn>
          <v-btn v-else color="primary" dark medium @click="confirmLocation">{{ $t('confirm') }}</v-btn>
        </div>
      </v-card-text>
    </v-card>
    <ProcessingDialog :dialog="showProcessingDialog" @close="onProcessingDialogClose"
      :description="description"
      :heading="$t('deforestation.processingDialog.modalHeader')" />
    <MitigationDialog v-if="showMitigtionModal" :dialogU="showMitigtionModal"
      :manualRiskMitigationData="getManualRiskMitigationData" :productionPlaceId="targetedProductionPlaceId"
      :productionPlaceDetail="targetProductionPlace" @closeBulkUpload="showMitigtionModal = false"
      @mitigated="getBulkDeforestationReport" />
  </v-dialog>
</template>

<script>
import { getEUDRDeforestationStatus, wait } from "@/utils";
import DeforestationService from "@/_services/DeforestationService";
import ProcessingDialog from "../ProcessingDialog.vue";
import loadingMixin from "@/mixins/LoadingMixin";
import MitigationDialog from "../eudr/MitigationDialog.vue";
import { debounce } from "lodash";
import { isDeforestationExpired } from '../../../../../../utils';
export default {
  name: "LocationsModified",
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
    diligenceId: {
      type: Number,
      required: true,
    }
  },
  mixins: [loadingMixin],
  components: {
    ProcessingDialog,
    MitigationDialog,
  },
  data() {
    return {
      search: "",
      headers: [
        {
          text: this.$t("deforestation.productionPlacesFarmAndFarmId"),
          align: "start",
          value: "farmName",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("deforestation.producerName"),
          align: "start",
          value: "farm.userDdsAssoc.fullName",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("deforestation.addressOfProduction"),
          align: "start",
          value: "farm.address",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("deforestation.areaHa"),
          align: "start",
          value: "farm.area",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("deforestation.type"),
          align: "center",
          value: "farmType",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("deforestation.EUDRDeforestationStatus"),
          align: "center",
          value: "eudr_deforestation_status",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("deforestation.geofence"),
          align: "center",
          value: "action",
          class: "black--text",
          sortable: false,
        },
      ],
      options: {
        itemsPerPage: 20,
        page: 1,
      },
      from: 0,
      to: 0,
      totalPages: 0,
      totalProductionPlaces: 0,
      isReportVerified: false,
      reportLoading: false,
      updatedProductionPlaces: [],
      showProcessingDialog: false,
      progressValue: 0,
      progressColor: "blue",
      updatedEUDRAssessmentType: "Dimitra Deforestation Report",
      menus: [
        { title: "View Assessment", id: "assessment" },
        { title: "Disputes", id: "disputes" },
        { title: "Manual Risk Mitigation", id: "mitigation" },
      ],
      getManualRiskMitigationData: {
        riskMitigationComment: "",
        riskMitigationFiles: null,
      },
      targetedProductionPlaceId: null,
      targetProductionPlace: null,
      showMitigtionModal: false,
      locations: [],
      itemsPerPageOptions: [5, 10, 20, 50, 100],
      loading: true,
      isInitialLoad: true,
      description: this.$t(
        "deforestation.processingDialog.modalDescription_first"
      ),
    };
  },
  watch: {
    options: {
      async handler() {
        if (!this.isInitialLoad) {
          await this.fetchProductionPlaces();
        }
      },
    },
    search: {
      handler() {
        this.debouncedFetchProductionPlaces();
      },
      immediate: false,
    },
    showProcessingDialog(newVal) {
      if (newVal) {
        this.description = this.$t(
          "deforestation.processingDialog.modalDescription_first"
        );
        setTimeout(() => {
          this.description = this.$t(
            "deforestation.processingDialog.modalDescription_second"
          );
        }, 3000);
      }
    },
  },
  async mounted() {
    await this.startLoading();
    await this.fetchProductionPlaces();
    await this.stopLoading();
    this.isInitialLoad = false;
    this.debouncedFetchProductionPlaces = debounce(
      this.fetchProductionPlaces,
      500
    );
  },
  computed: {
    checkEUDRExisting() {
      return this.updatedEUDRAssessmentType === "Dimitra Deforestation Report";
    },
    menusWithoutReport() {
      return this.menus.filter(
        (menu) => menu.id !== "assessment" && menu.id !== "disputes"
      );
    },
  },
  methods: {
    getEUDRDeforestationStatus,
    updatePagination() {
      this.from = (this.options.page - 1) * this.options.itemsPerPage + 1;
      this.to = Math.min(
        this.options.page * this.options.itemsPerPage,
        this.totalProductionPlaces
      );
      this.totalPages = Math.ceil(
        this.totalProductionPlaces / this.options.itemsPerPage
      );
    },
    closeModal() {
      this.$emit("closeLocationModifiedModal");
    },
    confirmLocation() {
      this.$emit("confirmLocation", true);
      this.$emit("confirmProceed", true);
    },
    verifyLocation() {
      this.startLoading();
      this.isReportVerified = true;
      this.getBulkDeforestationReport();
      this.$emit("confirmLocation", false);
    },
    onProcessingDialogClose() {
      this.$router.push({ name: "dueDiligenceReports" });
    },
    async getBulkDeforestationReport() {
      this.reportLoading = true;
      try {
        if (this.locations.length) {
          const response =
            await DeforestationService.getBulkReportByDiligenceId(
              this.diligenceId
            );
          if (!response.data?.success) {
            throw new Error(response.data.message);
          }
          const job = response.data.data;
          let stopWaiting = false;
          const timeout = setTimeout(() => {
            stopWaiting = true;
            this.showProcessingDialog = true;
            this.stopLoading();
          }, 30000); // 30 seconds to wait before showing loading screen
          while (!stopWaiting) {
            if (stopWaiting) break;
            await wait(5000);
            const response = await DeforestationService.getJob(job.id);
            if (response.data?.job.status === "Failed") {
              clearTimeout(timeout);
              this.showProcessingDialog = false;
              throw new Error(
                "An error occurred while fetching the deforestation report."
              );
            }
            if (response?.data.job.status === "Completed") {
              this.fetchProductionPlaces();
              this.stopLoading();
              clearTimeout(timeout);
              this.showProcessingDialog = false;
              this.$notify({
                type: "success",
                title: "Success",
                text: this.$t("dueDiligence.successfullyGeneratedEUDRDeforestationStatus"),
              });
              this.progressValue = 100;
              break;
            }
          }
        } else {
          this.progressValue = 100;
        }
      } catch (error) {
        this.progressValue = 0;
        this.progressColor = "red";
        this.$notify({
          type: "error",
          title: "Error",
          text:
            error.message ||
            "An error occurred while fetching the deforestation report.",
        });
      } finally {
        this.reportLoading = false;
      }
    },
    showModel(modal, item) {
      switch (modal) {
        case "disputes":
          this.targetProductionPlace = item;
          this.showDisputeModal = true;
          break;
        case "assessment":
          this.$router.push({
            name: "EudrAssessmentReportDDS",
            params: {
              reportRequestId: item.deforestationInfo.deforestationReportRequestId,
              type: "assignment",
            },
          });
          break;
        case "mitigation":
          this.getManualRiskMitigationData = {
            riskMitigationComment: item.risk_mitigation_comment,
            riskMitigationFiles: item.risk_mitigation_files,
          };
          this.targetedProductionPlaceId = item.diligenceReportProductionPlaceArray[0]?.id;
          this.targetProductionPlace = item;
          this.showMitigtionModal = true;
          break;
        default:
          break;
      }
    },
    async fetchProductionPlaces() {
      this.loading = true;
      this.productionPlaceInput = {
        diligenceReportId: parseInt(this.diligenceId),
        removed: false,
        isEdit: !this.isReportVerified,
        isVerified: this.isReportVerified,
        page: this.options.page,
        limit: this.options.itemsPerPage,
        searchPhrase: this.search,
      };
      await DeforestationService.getProductionPlaces(this.productionPlaceInput)
        .then((response) => {
          this.locations = response.data.productionPlaces.rows.map((item) => {
            const deforestationInfo = item.diligenceReportProductionPlaceArray?.[0]?.productionPlaceDeforestationInfo;
            return {
              ...item,
              deforestationInfo,
              deforestationStatus: deforestationInfo?.deforestationStatus,
              isExpired: isDeforestationExpired(deforestationInfo?.deforestationStatusDate, this.get_EUDR_Settings),
            };
          });
          this.totalProductionPlaces =
            response.data.productionPlaces.totalCount;
          this.updatePagination();
        })
        .catch((error) => {
          this.$notify({
            type: "error",
            title: "Error",
            text:
              error.message ||
              "An error occurred while fetching production places.",
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    pageChange(t) {
      if (t) this.options.page = this.options.page + 1;
      else this.options.page = this.options.page - 1;
      this.fetchProductionPlaces();
    },
  },
};
</script>

