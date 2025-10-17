<template>
  <v-dialog transition="dialog-top-transition" max-width="800" v-model="dialog" @click:outside="closeModal">
      <v-card rounded="0">
          <v-toolbar color="primary" class="white--text" flat :elevation="0">
              <v-toolbar-title class="font-weight-bold">
                Compliance Risk Warning
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn color="white" icon  @click="closeModal">
                  <v-icon>mdi-close</v-icon>
              </v-btn>
          </v-toolbar>
          <v-card-text class="pt-5">
             <p> Report Issues Identified: </p>
             <ul class="ma-3">
                <li v-for="(warning, index) in warnings" :key="index">
                    <p> <span class="warning-title" @click="gotoTab(warning.assessmentName)">{{ warning.assessmentName }}
                        :</span> <span>{{ warning.count }}</span> <span>{{ $t("deforestation.issueFound") }}</span></p>
                </li>
             </ul>
              <p> Please mitigate the risks or remove the farms from the shipment in order to proceed.  </p>
          </v-card-text>
          <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn outlined class="mr-2 tall" color="primary" depressed @click="closeModal">
                  {{ $t("cancel") }}
              </v-btn>
              <v-btn  medium class="mr-2 tall" dark color="primary">
                 Removed Farms
              </v-btn>
              <v-btn color="primary" medium elevation="0" dark class="mr-1 tall">
                 Attach Risk Mitigation
              </v-btn>
              <v-btn @click="finilizeWithWarning"  color="primary" medium dark elevation="0" class="tall">
                  Finalize
              </v-btn>
          </v-card-actions>
      </v-card>

  </v-dialog>
</template>
<script>
import loading from "@/mixins/LoadingMixin";
import DeforestationService from "@/_services/DeforestationService";
import { EventBus } from '@/utils.js'

export default {
  async mounted() { },
  props: {
      dialog: {
          required: false,
          type: Boolean,
      },
      warnings: {
          required: true,
          type: Array
      },
      hideAdditionalActions: {
          required: false,
          type: Boolean,
          default: false,
      },
  },
  data() {
      return {
          diligenceId: this.$route.params.id || null,
          updatedStatus:''
      };
  },
  methods: {
    closeModal(suc = false) {
        this.$emit("close-modal", suc);
    },
    edit() {
        this.$emit("edit-report");
    },
    requestAdditionalInformation() {
        this.$emit("request-additional-info");
    },
    download() {
        this.$emit("download-report", "pdf");
    },
    gotoTab(tabName) {
        this.closeModal()
        this.$emit('gotoTab', tabName);
    }, //blockchainPublishDate
    finilizeWithWarning(complianceStatus) {
      return new Promise((resolve, reject) => {
        this.startLoading()
        DeforestationService.changeStatusOfDiligenceReport({
        id: parseInt(this.diligenceId),
        status:'Non-Compliant'//'Pending' // //
        }).then(async () => {
          try {
            const cleanupResponse = await DeforestationService.removeRequestAdditionalInformationByDiligenceId(parseInt(this.diligenceId));
            console.log('Request additional information cleanup:', cleanupResponse);
          } catch (cleanupError) {
            console.error('Failed to cleanup request additional information:', cleanupError);
          }
          this.$emit('handle-finilize',true)
          this.updatedStatus = complianceStatus;
          EventBus.$emit('diligence-detail-load',true)
          this.startLoading()
          DeforestationService.updateDiligenceReportStage({
            current_stage:4,
            reportId:parseInt(this.diligenceId)
          }).then(() => {
            resolve(complianceStatus)
            this.stopLoading()
            this.$notify({
              text: this.$t('dueDiligence.updatedDueDiligenceStatus'),
              type: 'success'
            });
          }).catch(() => {
            this.stopLoading()
          })
        }).catch(err => {
          reject(err)
        }).finally(() => {
          this.stopLoading()
        });
      })
    },
  },
  mixins: [loading],
};
</script>

<style lang="scss" scoped>
::v-deep .v-text-field.v-text-field--enclosed .v-text-field__details {
  display: none !important;
}
.tall {
  height: 40px !important;
  min-width: 150px;
}
.select {
  transform: translateY(2px);
  max-width: 200px;
}
::v-deep .v-text-field--outlined.v-input--dense .v-label {
  color: #fb8c00 !important;
}
::v-deep .v-text-field--outlined fieldset {
  border-color: #fb8c00 !important;
}
::v-deep .theme--light.v-icon {
  color: #fb8c00 !important;
}
.warning-title {
  font-size: 16px;
  font-weight: 700;
  text-decoration: underline ;
  color: #00BD73;
  text-transform: capitalize;
  cursor: pointer;
}
.warning-header{
  font-weight: 600;
}
.info-icon{
  margin-left: 10px;
  margin-bottom: 10px;
}
</style>