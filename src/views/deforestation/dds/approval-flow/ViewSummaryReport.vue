<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="cmt-box">
        <!-- Header with action buttons -->
        <v-row align="center" class="mb-4">
          <v-col sm="4">
            <h3 class="text-h4 font-weight-bold text-dark">{{ $t('dueDiligence.dueDiligenceReport') }}</h3>
          </v-col>
          <v-col sm="8" class="text-right">
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" class="mr-2" v-bind="attrs" v-on="on">
                  <v-icon style="color: white !important;" left>mdi-download</v-icon>
                  {{ $t('download') }}
                  <v-icon right style="color: white !important;">mdi-chevron-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="downloadFinalReport('pdf')">
                  <v-list-item-title>{{ $t('dueDiligence.downloadAsPDF') }}</v-list-item-title>
                </v-list-item>
                <v-list-item @click="downloadFinalReport('json')">
                  <v-list-item-title>{{ $t('dueDiligence.downloadAsJSON') }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-btn color="primary" dark medium class="mr-3" @click="requestAdditionalInformation">
              {{ $t('deforestation.requestAdditionalInformation')}}
            </v-btn>
           
            <v-btn color="error" v-if="!isWorkerOnly" dark medium class="mr-3" @click="handleRejectReport">
              {{ $t('deforestation.reject') }}
            </v-btn>

            <v-btn color="primary" v-if="$can($permissions.approve.value)" dark medium class="mr-3" @click="handleApproveReport">
              {{ $t('deforestation.approve') }}
            </v-btn>

          </v-col>
        </v-row>
        <v-card elevation="0">
          <v-card elevation="0" v-if="report">
            <v-card class="mb-5" flat>
              <v-card-text>
                <v-row class="pl-3">
                  <v-col sm="3">
                    <div class="item-box">
                      <p class="text-subtitle-1 mb-2"> {{ isKenyaClient ? $t("deforestation.internalRefNoKenya") :  $t('dueDiligence.internalReferenceNumber')
                        }}</p>
                      <p class="text-subtitle-1 font-weight-bold">{{
                        report.internalReferenceNumber || '-' }}</p>
                    </div>
                  </v-col>

                  <v-col sm="3">
                    <div class="item-box">
                      <p class="text-subtitle-1 mb-2">
                        {{ 
                          $t("dueDiligence.eudrRefNo")
                        }}
                      </p>
                      <p class="text-subtitle-1 font-weight-bold">{{ report.EUDRReferenceNumber || '-' }}</p>
                    </div>
                  </v-col>

                  <v-col sm="3">
                    <div class="item-box">
                      <p class="text-subtitle-1 mb-2"> {{ $t('dueDiligence.verificationNumber') }}</p>
                      <p class="text-subtitle-1 font-weight-bold">{{ report.verificationNumber || '-' }}</p>
                    </div>
                  </v-col>

                  <v-col sm="3">
                    <div class="item-box">
                      <p class="text-subtitle-1 mb-2"> {{ $t('deforestation.activity') }}</p>
                      <p class="text-subtitle-1 font-weight-bold">{{ report.activity || '-' }}
                      </p>

                    </div>
                  </v-col>

                  <v-col sm="3">
                    <div class="item-box">
                      <p class="text-subtitle-1 mb-2"> {{ $t('dueDiligence.dueDiligenceReportStatus') }}
                      </p>
                      <v-chip variant="elevated" :color="getStatusColor" outlined>
                        {{ this.diligenceStatus || report.status }}
                      </v-chip>
                    </div>
                  </v-col>

                  <v-col sm="3">
                    <div class="item-box">
                      <p class="text-subtitle-1 mb-2"> {{ $t('dueDiligence.eudrDocumentCodes') }}
                      </p>
                      <p class="text-subtitle-1 font-weight-bold">{{ report.EUDRDocumentCode || '-' }}</p>
                    </div>
                  </v-col>

                  <v-col sm="3">
                    <div class="item-box">
                      <p class="text-subtitle-1 mb-2"> {{ $t('dueDiligence.referenceNumberForC717') }}
                      </p>
                      <p class="text-subtitle-1 font-weight-bold">{{ report.referenceNumberForC717 || '-' }}</p>
                    </div>
                  </v-col>

                  <v-col v-if="$can($permissions.assign.value)">
                    <div class="control filter">
                      <label for="text">{{ $t('dueDiligence.assignedTo') }}</label>
                      <v-select v-model="reportAssignedTo" item-text="name" item-value="value"
                        :items="assignedToOptions" @change="handleAssignUserChange" outlined dense clearable
                        :placeholder="currentAssignedUserName || $t('deforestation.selectUserToAssign')">
                        <template v-slot:prepend-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-text-field v-model="assignedToSearch" :placeholder="$t('search')"
                                prepend-inner-icon="mdi-magnify" dense outlined hide-details class="ma-2" />
                            </v-list-item-content>
                          </v-list-item>
                          <v-divider></v-divider>
                        </template>
                        <template v-slot:item="{ item }">
                          <v-list-item @click="selectAssignUserFromDropdown(item)">
                            <v-list-item-content>
                              <v-list-item-title>{{ item.name }}</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                      </v-select>
                    </div>
                  </v-col>

                  <v-col sm="12">
                    <div class="item-box">
                      <p class="text-subtitle-1 mb-2">
                        {{ isKenyaClient ? $t('dueDiligence.containerId') + ' / ' + $t('dueDiligence.lotId') :
                          $t('blends.createBlends.containerId') }}
                      </p>
                      <p class="text-subtitle-1 font-weight-bold">
                        {{ report.containerIds?.join(', ') || '-' }}
                      </p>
                    </div>
                  </v-col>

                </v-row>

                <template>
                  <v-row class="pl-3" v-if="isExporterExist">
                    <v-col sm="12">
                      <div class="item-box">
                        <h2 class="font-weight-bold">
                          {{ isKenyaClient ? $t('deforestation.exporterInformationKenya') :
                            $t('deforestation.exporterInformation') }}
                        </h2>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="6" md="2">
                      <div class="grey--text">
                        {{ $t('deforestation.name') }}
                      </div>
                      <div class="text-body-1 font-weight-medium">
                        {{ exporterDetails.name || '-' }}
                      </div>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <div class="grey--text">
                        {{ $t('deforestation.email') }}
                      </div>
                      <div class="text-body-1 font-weight-medium">
                        {{ exporterDetails.email || '-' }}
                      </div>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <div class="grey--text">
                        {{ $t('deforestation.phoneNumber') }}
                      </div>
                      <div class="text-body-1 font-weight-medium">
                        {{ exporterDetails.phoneNumber || '-' }}
                      </div>
                    </v-col>
                    <v-col cols="12" sm="6" md="2">
                      <div class="grey--text">
                        {{ $t('deforestation.country') }}
                      </div>
                      <div class="text-body-1 font-weight-medium">
                        {{ exporterDetails.country || '-' }}
                      </div>
                    </v-col>
                  </v-row>

                  <v-row class="pl-3" v-if="report?.operator">
                    <v-col sm="12">
                      <div class="item-box">
                        <h2 class="font-weight-bold"> {{ $t('dueDiligence.operatorData') }} </h2>
                      </div>
                    </v-col>
                    <v-col sm="3">
                      <div class="item-box">
                        <p class="text-subtitle-1 mb-2"> {{ $t('deforestation.name') }}</p>
                        <p class="text-subtitle-1 font-weight-bold">
                          {{ `${report?.operator?.firstName || '-'} ${report?.operator?.lastName || ''}` }}
                        </p>

                      </div>
                    </v-col>

                    <v-col sm="3">
                      <div class="item-box">
                        <p class="text-subtitle-1 mb-2"> {{ $t('deforestation.email') }}
                        </p>
                        <p class="text-subtitle-1 font-weight-bold">
                          {{ report.operator.email || '-' }}
                        </p>

                      </div>
                    </v-col>

                    <v-col sm="3">
                      <div class="item-box">
                        <p class="text-subtitle-1 mb-2"> {{ $t('deforestation.phoneNumber') }} </p>
                        <p class="text-subtitle-1 font-weight-bold">
                          {{ report.operator.mobile || '-' }}
                        </p>
                      </div>
                    </v-col>

                    <v-col sm="3">
                      <div class="item-box">
                        <p class="text-subtitle-1 mb-2"> {{ $t('deforestation.country') }}
                        </p>
                        <p class="text-subtitle-1 font-weight-bold">
                          {{ report.operator.countryId || '-' }}
                        </p>
                      </div>
                    </v-col>

                  </v-row>
                </template>

                <!-- <v-row class="pl-3">
                  <v-col sm="12">
                    <div class="item-box">
                      <h2 class="font-weight-bold"> {{ $t('dueDiligence.supplierData') }} </h2>
                    </div>
                  </v-col>
                  <v-col sm="3">
                    <div class="item-box">
                      <p class="text-subtitle-1 mb-2"> {{ $t('deforestation.name') }}
                      </p>
                      <p class="text-subtitle-1 font-weight-bold">
                        {{ `${report.supplier.firstName || '-'} ${report.supplier.lastName || ''}` }}
                      </p>

                    </div>
                  </v-col>

                  <v-col sm="3">
                    <div class="item-box">
                      <p class="text-subtitle-1 mb-2"> {{ $t('deforestation.email') }}
                      </p>
                      <p class="text-subtitle-1 font-weight-bold">
                        {{ report.supplier.email || '-' }}
                      </p>

                    </div>
                  </v-col>

                  <v-col sm="3">
                    <div class="item-box">
                      <p class="text-subtitle-1 mb-2"> {{ $t('deforestation.phoneNumber') }}
                      </p>
                      <p class="text-subtitle-1 font-weight-bold">
                        {{ report.supplier.mobile || '-' }}
                      </p>
                    </div>
                  </v-col>

                  <v-col sm="3">
                    <div class="item-box">
                      <p class="text-subtitle-1 mb-2"> {{ $t('deforestation.country') }}
                      </p>
                      <p class="text-subtitle-1 font-weight-bold">
                        {{ report.supplier.countryId || '-' }}
                      </p>
                    </div>
                  </v-col>

                </v-row> -->
              </v-card-text>
            </v-card>
          </v-card>

          <!-- Blockchain Verification Section -->
          <v-card elevation="0" class="mb-5" v-if="report?.transactionHash">
            <v-card-text>
              <v-row class="my-5 pl-3">
                <v-col cols="6" class="right-border-light">
                  <v-row>
                    <v-col cols="12">
                      <div class="item-box">
                        <h2 class="font-weight-bold">
                          {{ $t('dueDiligence.blockchainVerification') }}
                          <v-tooltip top color="00BD73" max-width="350">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                                v-on="on">
                                mdi-alert-circle
                              </v-icon>
                            </template>
                            <span>{{ $t('dueDiligence.blockchainVerification') }}</span>
                          </v-tooltip>
                        </h2>
                      </div>
                    </v-col>
                    <v-col cols="12">
                      <p>{{ $t('dueDiligence.scanQrBlockchain') }}</p>
                    </v-col>
                    <v-col class="col-2" id="blockchain-qr">
                      <qrcode :text="report.blockchainLink" :size="128"></qrcode>
                    </v-col>
                    <v-col class="col-10 blockchain-text">
                      <p>
                        <a href="#" @click="downloadQR('blockchain-qr')">
                          <v-icon>mdi-download</v-icon>&nbsp;<span>{{ $t('dueDiligence.downloadQrCode') }}</span>
                        </a>
                      </p>
                      <p><a :href="report.blockchainLink">{{ $t('dueDiligence.viewReportOnBlockChain') }}</a></p>
                      <p style="word-break: break-all">{{ report.transactionHash }}</p>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="6" class="pl-10" v-if="isShowPublicLink">
                  <v-row>
                    <v-col cols="12">
                      <div class="item-box">
                        <h2 class="font-weight-bold">
                          {{ $t('dueDiligence.eudrPublicReport') }}
                          <v-tooltip top color="00BD73" max-width="350">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                                v-on="on">
                                mdi-alert-circle
                              </v-icon>
                            </template>
                            <span>{{ $t('dueDiligence.eudrPublicReport') }}</span>
                          </v-tooltip>
                        </h2>
                      </div>
                    </v-col>
                    <v-col cols="12">
                      <p>{{ $t('dueDiligence.scanQrEudr') }}</p>
                    </v-col>
                    <v-col class="col-2" id="public-qr">
                      <qrcode :text="publicLink" :size="128"></qrcode>
                    </v-col>
                    <v-col class="col-10 blockchain-text">
                      <p>
                        <a href="#" @click="downloadQR('public-qr')">
                          <v-icon>mdi-download</v-icon>&nbsp;<span>{{ $t('dueDiligence.downloadQrCode') }}</span>
                        </a>
                      </p>
                      <p><a :href="publicLink">{{ $t('dueDiligence.viewReportForPublic') }}</a></p>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card elevation="0">
            <v-card class="mb-5" flat>
              <v-card-text>
                <v-row class="pl-2 mb-2">
                  <v-col sm="12">
                    <v-toolbar-title class="font-weight-bold">
                      {{ $t('dueDiligence.reportSummary') }}
                      <v-tooltip top color="00BD73" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                            v-on="on">
                            mdi-alert-circle
                          </v-icon>
                        </template>
                        <span>{{ $t('dueDiligence.reportSummaryTT') }}</span>
                      </v-tooltip>
                    </v-toolbar-title>
                  </v-col>
                </v-row>
                <v-row class="pl-3">
                  <v-col sm="3">
                    <div class="item-box">
                      <p class="text-subtitle-1 mb-2">
                        {{ $t('dueDiligence.totalNoOfGeofencePolygon') }}
                        <v-tooltip top color="00BD73" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                              v-on="on">
                              mdi-alert-circle
                            </v-icon>
                          </template>
                          <span>{{ $t('dueDiligence.totalNoOfGeofencePolygonTT') }}</span>
                        </v-tooltip>
                      </p>
                      <p class="text-subtitle-1 font-weight-bold"> {{ this.report.polygonProductionPlaces }}
                      </p>

                    </div>
                  </v-col>

                  <v-col sm="3">
                    <div class="item-box">

                      <p class="text-subtitle-1 mb-2">
                        {{ $t('dueDiligence.totalNoOfGeofencePoint') }}
                        <v-tooltip top color="00BD73" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                              v-on="on">
                              mdi-alert-circle
                            </v-icon>
                          </template>
                          <span>{{ $t('dueDiligence.totalNoOfGeofencePointTT') }}</span>
                        </v-tooltip>
                      </p>
                      <p class="text-subtitle-1 font-weight-bold"> {{ this.report.pointProductionPlaces }}
                      </p>
                    </div>
                  </v-col>

                  <v-col sm="3">
                    <div class="item-box">
                      <p class="text-subtitle-1 mb-2">
                        {{ $t('dueDiligence.totalNoOfFarms') }}
                        <v-tooltip top color="00BD73" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                              v-on="on">
                              mdi-alert-circle
                            </v-icon>
                          </template>
                          <span>{{ $t('dueDiligence.totalNoOfFarmsTT') }}</span>
                        </v-tooltip>
                      </p>
                      <p class="text-subtitle-1 font-weight-bold"> {{ this.report.totalProductionPlaces }}
                      </p>
                    </div>
                  </v-col>

                  <v-col sm="3">
                    <div class="item-box">

                      <p class="text-subtitle-1 mb-2">
                        {{ $t('dueDiligence.totalAreaFinalReport') }}
                        <!-- <v-tooltip top color="00BD73" max-width="350">
                                        <template v-slot:activator="{ on, attrs }">
                                          <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                            mdi-alert-circle
                                          </v-icon>
                                        </template>
                                        <span>{{ $t('dueDiligence.totalAreaTT') }}</span>
                                      </v-tooltip> -->
                      </p>
                      <p class="text-subtitle-1 font-weight-bold"> {{ this.report.totalArea ?
                        parseFloat(this.report.totalArea *
                          0.404686).toFixed(5) : '-' }}
                      </p>
                    </div>
                  </v-col>

                  <v-col sm="3">
                    <div class="item-box">
                      <p class="text-subtitle-1 mb-2">
                        {{ $t('dueDiligence.totalNoOfDeforestation') }}
                        <v-tooltip top color="00BD73" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                              v-on="on">
                              mdi-alert-circle
                            </v-icon>
                          </template>
                          <span>{{ $t('dueDiligence.totalNoOfDeforestationTT') }}</span>
                        </v-tooltip>
                      </p>
                      <p class="text-subtitle-1 font-weight-bold"> {{ this.report.totalDeforestationAssessments }}
                      </p>
                    </div>
                  </v-col>

                  <v-col sm="3">
                    <div class="item-box">
                      <p class="text-subtitle-1 mb-2">
                        {{ $t('dueDiligence.totalNoOfHighDeforestation') }}
                        <v-tooltip top color="00BD73" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                              v-on="on">
                              mdi-alert-circle
                            </v-icon>
                          </template>
                          <span>{{ $t('dueDiligence.totalNoOfHighDeforestationTT') }}</span>
                        </v-tooltip>
                      </p>
                      <p class="text-subtitle-1 font-weight-bold"> {{ this.report.totalHighDeforestationProductionPlaces
                      }}
                      </p>
                    </div>
                  </v-col>

                  <v-col sm="3">
                    <div class="item-box">

                      <p class="text-subtitle-1 mb-2">
                        {{ $t('dueDiligence.totalNoOfRiskAssessments') }}
                        <v-tooltip top color="00BD73" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                              v-on="on">
                              mdi-alert-circle
                            </v-icon>
                          </template>
                          <span>{{ $t('dueDiligence.totalNoOfRiskAssessmentsTT') }}</span>
                        </v-tooltip>
                      </p>
                      <p class="text-subtitle-1 font-weight-bold"> {{
                        this.report.assessment?.selectedAssessments?.length || '-' }}
                      </p>
                    </div>
                  </v-col>

                </v-row>
              </v-card-text>
            </v-card>
          </v-card>
        </v-card>

        <v-card class="mb-5 mt-5" flat>
          <v-card-text>
            <v-row class="pl-2 mb-2">
              <v-col sm="12">
                <v-toolbar-title class="font-weight-bold">
                  {{ $t('dueDiligence.productDetails') }}
                </v-toolbar-title>
              </v-col>
            </v-row>
            <v-row class="pl-3">
              <v-col sm="3">
                <div class="item-box">
                  <p class="text-subtitle-1 mb-2">
                    {{ $t('dueDiligence.product') }}
                    <v-tooltip top color="00BD73" max-width="350">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                          v-on="on">
                          mdi-alert-circle
                        </v-icon>
                      </template>
                      <span>{{ $t('dueDiligence.productTT') }}</span>
                    </v-tooltip>
                  </p>
                  <p class="text-subtitle-1 font-weight-bold">
                    {{ report.product || '-' }}
                  </p>
                </div>
              </v-col>
              <v-col sm="3">
                <div class="item-box">
                  <p class="text-subtitle-1 mb-2">
                    {{ $t('dueDiligence.productDescription') }}
                    <v-tooltip top color="00BD73" max-width="350">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                          v-on="on">
                          mdi-alert-circle
                        </v-icon>
                      </template>
                      <span>{{ $t('dueDiligence.productDescriptionTT') }}</span>
                    </v-tooltip>
                  </p>
                  <p class="text-subtitle-1 font-weight-bold">
                    {{ report.productDescription || '-' }}
                  </p>
                </div>
              </v-col>
              <v-col sm="3">
                <div class="item-box">
                  <p class="text-subtitle-1 mb-2">
                    {{ $t('dueDiligence.netMass') }} ({{ eudrSettings.product_mass_unit }})
                    <v-tooltip top color="00BD73" max-width="350">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                          v-on="on">
                          mdi-alert-circle
                        </v-icon>
                      </template>
                      <span>{{ $t('dueDiligence.netMassTT') }}</span>
                    </v-tooltip>
                  </p>
                  <p class="text-subtitle-1 font-weight-bold">
                    {{ report.productNetMass || '-' }}
                  </p>
                </div>
              </v-col>
              <v-col sm="3">
                <div class="item-box">
                  <p class="text-subtitle-1 mb-2">
                    {{ $t('dueDiligence.volume') }} ({{ eudrSettings.volume_unit || '-' }})
                    <v-tooltip top color="00BD73" max-width="350">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                          v-on="on">
                          mdi-alert-circle
                        </v-icon>
                      </template>
                      <span>{{ $t('dueDiligence.volumeTT') }}</span>
                    </v-tooltip>
                  </p>
                  <p class="text-subtitle-1 font-weight-bold">
                    {{ report.productVolume || '-' }}
                  </p>
                </div>
              </v-col>
              <v-col sm="3">
                <div class="item-box">
                  <p class="text-subtitle-1 mb-2">
                    {{ $t('dueDiligence.scientificName') }}
                    <v-tooltip top color="00BD73" max-width="350">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                          v-on="on">
                          mdi-alert-circle
                        </v-icon>
                      </template>
                      <span>{{ $t('dueDiligence.scientificNameTT') }}</span>
                    </v-tooltip>
                  </p>
                  <p class="text-subtitle-1 font-weight-bold">
                    {{ report.productScientificName || '-' }}
                  </p>
                </div>
              </v-col>
              <v-col sm="3">
                <div class="item-box">
                  <p class="text-subtitle-1 mb-2">
                    {{ $t('dueDiligence.commonName') }}
                    <v-tooltip top color="00BD73" max-width="350">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                          v-on="on">
                          mdi-alert-circle
                        </v-icon>
                      </template>
                      <span>{{ $t('dueDiligence.commonNameTT') }}</span>
                    </v-tooltip>
                  </p>
                  <p class="text-subtitle-1 font-weight-bold">
                    {{ report.productCommonName || '-' }}
                  </p>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-card class="mb-5 mt-5" flat>
          <v-card-text>
            <v-row class="pl-2 mb-2">
              <v-col sm="12">
                <v-toolbar-title class="font-weight-bold">
                  {{ $t('deforestation.productionPlaces') }}
                  <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                        mdi-alert-circle
                      </v-icon>
                    </template>
                    <span>{{ $t('dueDiligence.productionPlacesTT') }}</span>
                  </v-tooltip>
                </v-toolbar-title>
              </v-col>
            </v-row>
            <v-data-table :headers="headers" :items="productionPlaces" :items-per-page="10" hide-default-footer
              :loading="loading" :options.sync="options" :loading-text="$t('deforestation.loadingProductionPlaces')
                ">
              <template v-slot:top="{ }">
                <div class="d-flex mt-5 justify-space-between">
                  <div class="d-flex align-center">
                    <v-text-field prepend-inner-icon="mdi-magnify" outlined height="5px" :placeholder="$t('search')"
                      dense v-model="search" @input="debouncedGetProductionPlaces" class="shrink" clearable>
                    </v-text-field>
                  </div>
                  <div class="d-flex mb-5">
                    <div class="py-1 title">
                      {{ from }} - {{ to }} of {{ totalProductionPlaces }}
                    </div>
                    <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page <= 1"
                      @click="pageChange(false)">
                      <v-icon dark>
                        mdi-chevron-left
                      </v-icon>
                    </v-btn>
                    <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page >= totalPages"
                      @click="pageChange(true)">
                      <v-icon dark>
                        mdi-chevron-right
                      </v-icon>
                    </v-btn>
                    <v-btn class="mx-2" @click="exportToPDFForProductionPlaces" fab small outlined color="primary">
                      <v-icon dark>
                        mdi-tray-arrow-down
                      </v-icon>
                    </v-btn>
                  </div>
                </div>
              </template>
              <template v-if="productionPlaces.length" v-slot:body="{ items }">
                <tbody>
                  <tr v-for="item in items" :key="item.id" style="position: relative; width: 0; height: 0"
                    @mouseover="selectItem(item)" @mouseleave="selectItem(false)">
                    <td class="text-truncate">
                      {{ item.farm.farmName || "N/A" }}<br />
                      {{ item.farm.id }}
                    </td>

                    <td class="text-truncate">
                      {{ item.farm.userDdsAssoc.firstName }}
                      {{ item.farm.userDdsAssoc.lastName }}
                    </td>

                    <td class="text-truncate" style="max-width: 300px;">
                      {{ item.farm.address }}
                    </td>

                    <td class="text-truncate">
                      {{ item.farm.area ? parseFloat(item.farm.area * 0.404686).toFixed(5) : 'N/A' }}
                    </td>

                    <td class="text-truncate">
                      {{ item.farmType == "Polygon" ? $t('deforestation.Polygon') : $t('deforestation.Circular') }}
                    </td>

                    <td>
                      <v-tooltip top color="black" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn v-bind="attrs" v-on="on"
                            v-if="getEUDRDeforestationStatus(item.deforestationStatus || item.errorStatus).text !== 'N/A'"
                            small rounded min-width="200" depressed
                            :class="[getEUDRDeforestationStatus(item.deforestationStatus || item.errorStatus).class, 'non-clickable']"
                            height="34">
                            {{ getEUDRDeforestationStatus(item.deforestationStatus || item.errorStatus).text }}
                          </v-btn>
                          <span v-else>N/A</span>
                        </template>
                        <span>{{ getEUDRDeforestationStatus(item.deforestationStatus ||
                          `${item.errorStatus}_tt`).text }}</span>
                      </v-tooltip>
                    </td>

                    <td>
                      <div class="d-flex">
                        <v-menu>
                          <template v-slot:activator="{ on: menu, attrs }">
                            <v-tooltip top color="00BD73" max-width="350">
                              <template v-slot:activator="{ on: tooltip }">
                                <v-btn x-small fab v-bind="attrs" v-on="{ ...menu, ...tooltip }" color="primary"
                                  style="margin-left: 20px;" @click="handleClick(item.deforestationStatus)">
                                  <img
                                    :src="isIndonesianClient ? '/img/id/todo-list.svg' : isKenyaClient ? '/img/ke/todo-list.svg' : '/icons/todo-list.png'"
                                    style="width: 34px; height: 34px; border-radius: 50%;" />
                                </v-btn>

                              </template>
                              <span>{{ $t('dueDiligence.viewReport') }}</span>
                            </v-tooltip>
                          </template>
                          <v-list v-if="item.deforestationStatus">
                            <v-list-item
                              v-for="(menu, i) in getMenusForReport(item.deforestationInfo?.deforestationReport)"
                              :key="i">
                              <v-list-item-title class="cursor-pointer" @click="showModel(menu.id, item)">
                                {{ menu.title }}

                              </v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </div>
                    </td>
                  </tr>
                </tbody>

              </template>
              <template v-slot:footer></template>
            </v-data-table>
            <template>
              <div class="d-flex mt-5" style="align-items: center;">
                <v-spacer></v-spacer>
                <img
                  :src="isIndonesianClient ? '/img/id/todo-list.svg' : isKenyaClient ? '/img/ke/todo-list.svg' : '/icons/todo-list.png'"
                  style="width: 34px; height: 34px; border-radius: 50%;" />
                <span class="ml-2">{{ $t("dueDiligence.viewReport") }}</span>
                <v-icon class="ml-5 primary--text">mdi-trash-can</v-icon>
                <span class="ml-2">{{ $t("delete") }}</span>
              </div>
            </template>
          </v-card-text>
        </v-card>
      </div>
    </v-container>
    <!-- Send Report To Operator Dialog -->
    <v-dialog v-model="showSendToOperatorDialog" max-width="700">
      <v-card>
        <v-card-title class="primary white--text">
          {{ $t('dueDiligence.shareReportToOperator') }}
          <v-spacer></v-spacer>
          <v-btn icon dark @click="closeSendToOperatorDialog">
            <v-icon style="color: white !important;">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pt-4">

          <label for="text">
            {{ $t('deforestation.operator') }}
            <v-tooltip top color="00BD73" max-width="350">
              <template v-slot:activator="{ on, attrs }">
                <v-icon size="medium" class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                  v-on="on">
                  mdi-alert-circle
                </v-icon>
              </template>
              <span>{{ $t("dueDiligence.operatorTooltip") }}</span>
            </v-tooltip>
          </label>
          <v-autocomplete :loading="supplierOperatorLoading" outlined v-model="operatorId" item-text="fullName"
            item-value="id" :items="formattedOperator" variant="outlined" dense return-object
            :placeholder="$t('select')" @change="getInlineOperatorDetails()">
            <!-- Add a footer slot -->
            <template v-slot:append-item>

              <div class="add-supplier">
                <v-divider></v-divider>
                <v-list-item @click="operatorCreateDialog = true">
                  <v-list-item-content style="color:#0EBF67">
                    <v-list-item-title> <v-icon
                        :class="isIndonesianClient ? 'icon-with-background primary--text ptsi-brand' : isKenyaClient ? 'primary--text kenya-brand' : 'icon-with-background primary--text non-ptsi-brand'">
                        mdi-plus-circle
                      </v-icon><span
                        :class="isIndonesianClient ? 'ml-5 ptsi-brand' : isKenyaClient ? 'ml-5 kenya-brand' : 'ml-5 non-ptsi-brand'">{{
                          $t('dueDiligence.addNewOperator')
                        }}</span></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </div>
            </template>
          </v-autocomplete>

          <!-- Show operator details if found -->
          <div v-if="operatorDetails" class="mt-4 pa-3">
            <v-row class="text-body-2">
              <v-col sm="3">
                <p>{{ $t('deforestation.name') }}</p>
                <strong>{{ operatorDetails?.fullName }} </strong>
              </v-col>
              <v-col sm="3">
                <p>{{ $t('deforestation.email') }}</p>
                <strong>{{ operatorDetails?.email || "-" }}</strong>
              </v-col>
              <v-col sm="3">
                <p>{{ $t('deforestation.phoneNumber') }}</p>
                <strong>{{ operatorDetails?.mobile || "-" }}</strong>
              </v-col>
              <v-col sm="3">
                <p>{{ $t('deforestation.country') }}</p>
                <strong>{{ operatorDetails?.countryId || "-" }}</strong>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="primary" outlined @click="closeSendToOperatorDialog">
            {{ $t('cancel') }}
          </v-btn>
          <v-btn color="primary" @click="sendToOperator" :disabled="!operatorDetails">
            {{ $t('confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <ConfirmBox :title="$t('confirmationTitle')" :message="$t('operatorRegisterConfirmation')"
      :cancelBtnText="$t('dueDiligence.createWithoutRiskAssessment.cancelBtnText')"
      :confirmBtnText="$t('dueDiligence.createWithoutRiskAssessment.confirmBtnText')" :dialog="confirmDialog"
      @cancel:action="confirmDialog = false" @continue:action="handleSendToOperator" />
    
    <!-- Assign User Confirmation Dialog -->
    <ConfirmBox :title="$t('dueDiligence.assignReport')" :message="assignConfirmationMessage"
      :cancelBtnText="$t('cancel')" :confirmBtnText="$t('dueDiligence.assignButton')" :dialog="showAssignConfirmationDialog"
      @cancel:action="cancelAssignUser" @continue:action="confirmAssignUser" />
    
    <!-- Approval Confirmation Modal -->
    <ApprovalConfirmationModal :dialog="showApprovalModal" :selectedReportsCount="1"
      @close="handleApprovalCancel" @confirm="handleApprovalConfirm" />
    
    <!-- Rejection Confirmation Modal -->
    <RejectionConfirmationModal :dialog="showRejectionModal" :selectedReportsCount="1"
      @close="handleRejectionCancel" @confirm="handleRejectionConfirm" />

      <!-- Request Additional Information Modal -->
    <RequestAdditionalInformation @close-modal="closeRequestAdditionalInformationDialog" v-if="requestAdditionalInformationDialog" :dialog="requestAdditionalInformationDialog" :supplierId="report?.userId" :visibleSelectedTabs="visibleSelectedTabs"/>

    <ProcessingModal :dialog="showPocessingModal" @close="showPocessingModal = false" />
  </div>

</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";
import DeforestationService from "@/_services/DeforestationService";
import ActivityLogService from "@/_services/ActivityLogService";
import { getCountries } from "country-state-picker";
import { debounce } from 'lodash';
import { isDeforestationExpired, isIndonesianClient, isKenyaClient } from '@/utils.js';
import DownloadMixin from "@/mixins/DownloadMixin";
import OrganizationService from "@/_services/OrganizationService";
import UnitService from "@/_services/UnitService";
import UserService from "@/_services/UserService";
import UserListService from "@/_services/UserListService";
import ConfirmBox from "@/components/ConfirmBox";
import RequestAdditionalInformation from "./components/RequestAdditionalInformation.vue";
import ApprovalConfirmationModal from "./components/ApprovalConfirmationModal.vue";
import RejectionConfirmationModal from "./components/RejectionConfirmationModal.vue";
import { currentRoles } from "@/utils";
import ProcessingModal from "./components/modals/ProcessingModal.vue";
import { wait} from '@/utils.js';
import { PTSI_WORKER_ROLES, PTSI_ADMIN_ROLES } from "@/constants/roles";
export default {
  computed: {
    menusWithoutReport() {
      return this.menus.filter(
        (menu) => menu.id !== "assessment" && menu.id !== "disputes"
      );
    },
    isShowPublicLink() {
      return  ['temporary_approved','approved'].includes(this.report?.statusLegends)
    },
    currentRoles(){
      return currentRoles()
    },
    menusWithoutCompliance() {
      return this.menus.filter(menu => menu.id !== 'compliance');
    },
    getStatusColor() {
      const reportStatus = this.report.status;
      return reportStatus === "Compliant" ? "primary" : "red";
    },
    totalPages() {
      return parseInt(Math.ceil(this.totalProductionPlaces / this.options.limit));
    },
    isIndonesianClient() {
      return isIndonesianClient();
    },
     isPtsiPanelOnly(){
      return this.currentRoles?.some(role => PTSI_ADMIN_ROLES.includes(role))
    },
    isWorkerOnly(){
      //return this.currentRoles.includes("indonesia_ptsi_worker")
      return this.currentRoles?.some(role => PTSI_WORKER_ROLES.includes(role))
    },
    isKenyaClient() {
      return isKenyaClient();
    },
    publicLink() {
      if (this.report.encId === '') {
        return '#';
      }
      return process.env.VUE_APP_FRONT_BASE_URL + '/public-dds/' + encodeURIComponent(this.report.encId) + '___' + this.logo?.replace(".", "_");
    },
    operatorsList() {
      return [
        {
          id: 1,
          name: this.report?.operator?.firstName && this.report?.operator?.lastName
            ? `${this.report.operator.firstName} ${this.report.operator.lastName}`
            : 'Mathew Charles',
          country: this.report?.operator?.countryId || 'Indonesia',
          isoCode: this.report?.operator?.isoCode || 'ID',
          eoriNumber: this.report?.operator?.eori_number || 'DE123456789012'
        },
        {
          id: 2,
          name: 'William Smith',
          country: 'Indonesia',
          isoCode: 'ID',
          eoriNumber: 'DE987654321098'
        },
        {
          id: 3,
          name: 'John Doe',
          country: 'Malaysia',
          isoCode: 'MY',
          eoriNumber: 'DE111222333444'
        },
      ];
    },
    eudrSetting() {
      return this.eudrSettings;
    },
    isExporterExist() {
      return this.report?.ddsReportExporter?.exporter_cf_id && isIndonesianClient();
    },
    
    // Get current assigned user name for display
    currentAssignedUserName() {
      if (this.report.assignedToCfId && this.assignedToOptions.length > 0) {
        const currentUser = this.assignedToOptions.find(user => user.value === this.report.assignedToCfId);
        return currentUser ? currentUser.name : '';
      }
      return '';
    },
    

  },
  beforeDestroy() {
    this.stopLoading();
  },
  mounted() {
    this.getReportSummary();
  },
  async created() {
    this.startLoading();
    await this.fetchAllData();
  },
      watch: {
      options: {
        handler(opt) {
          this.getProductionPlaces(opt);
        },
        deep: true,
      },
    },
  props: {
    diligenceStatus: {
      required: false,
    },
  },
  components: {
    ConfirmBox,
    ApprovalConfirmationModal,
    RejectionConfirmationModal,
    RequestAdditionalInformation,
    ProcessingModal
  },
  methods: {
    getInlineOperatorDetails() {
      console.log("selected operator", this.operatorId);
      if (this.operatorId) {
        this.operatorDetails = this.operatorId;
      } else {
        this.operatorDetails = null;
      }
    },
    async getSupplierOrOperatorList(id = null, role = "operator") {
      console.log(id)
      this.supplierOperatorLoading = true;
      try {
        const res = await DeforestationService.getSupplierList(role);
        const dataList = res.data.findAllSuppliersOrOperators.map((ss) => ({
          ...ss,
          fullName: `${ss?.firstName} ${ss?.lastName}`,
        }));
        if (role === "operator") {
          this.formattedOperator = dataList
        }
        if (this.report?.operator) {
          const dtl = {
            ...this.report?.operator,
            fullName: `${this.report?.operator?.firstName} ${this.report?.operator?.lastName}`,
          };
          this.operatorDetails = dtl;
          this.operatorId = dtl;
          console.log("operatorDetails", this.operatorId, "operatorID");
        }
      } catch (err) {
        console.error("Error", err);
      } finally {
        this.supplierOperatorLoading = false;
      }
    },
    downloadQR(id) {
      try {
        const qrContainer = document.querySelector(`#${id}`);
        const qrImage = qrContainer?.querySelector('img');

        if (!qrImage) {
          this.$notify({
            text: this.$t('Failed to find QR code'),
            type: 'error'
          });
          return;
        }

        // Create a canvas to draw the QR code
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = qrImage.naturalWidth || 128;
        canvas.height = qrImage.naturalHeight || 128;

        // Draw the QR code image on canvas
        ctx.drawImage(qrImage, 0, 0);

        // Convert canvas to blob and download
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${id}-qr-code.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          this.$notify({
            text: this.$t('QR code downloaded successfully'),
            type: 'success'
          });
        }, 'image/png');

      } catch (error) {
        console.error('Error downloading QR code:', error);
        this.$notify({
          text: this.$t('Failed to download QR code'),
          type: 'error'
        });
      }
    },
    async getReportSummary() {
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
      } = await DeforestationService.getSummaryDDS(parseInt(this.$route.params.id));

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
      this.totalNumberOfFarms = totalNumberOfFarms;
      this.lowZeroRiskFarm = lowZeroRiskFarm;
      this.highRiskFarmArea = highRiskFarmArea;
      this.totalLowZeroFarmArea = totalLowZeroFarmArea;
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
    async fetchAllData() {
      try {
        await Promise.allSettled([
          this.getEudrSettings(),
          this.getProductList(),
          this.getOrganizationLogo(),
          this.fetchAssignedToList(),
          this.getDiligenceDetail(this.$route.params.id),
          this.getProductionPlaces()
        ]);
      } catch (error) {
        this.$notify({
          text: this.$t('Failed to load report data'),
          type: 'error'
        });
      } finally {
        this.stopLoading();
      }
    },
    async getEudrSettings() {
      return DeforestationService.getEudrSettings().then(res => {
        this.eudrSettings = res.data.eudrSetting;
      }).catch(() => {
        this.$notify({
          text: this.$t('Failed to fetch settings'),
          type: 'error'
        });
      });
    },
    async getProductList() {
      return DeforestationService.getProductList().then(res => {
        const productList = res.data.deforestationProductList;
        this.productList = productList;
      }).catch(err => {
        console.log('Error', err);
      });
    },
    async getOrganizationLogo() {
      const { data } = await OrganizationService.getorganization();
      const logo = data?.data?.logo;
      const codeIndex = logo?.lastIndexOf('/');
      this.logo = logo?.slice(codeIndex + 1);
    },
    async getDiligenceDetail(diligenceId) {
      try {
        const res = await DeforestationService.getDiligenceDetail(parseInt(diligenceId));
        const report = res.data.getDiligenceDetail;
        let selectedProduct = null;
        if (report.product) {
          selectedProduct = this.productList.find(p => p.id == report.product);
        }

        // Prepare report detail object
        let reportDetail = {
          whoAddPlaceData: report.whoAddPlaceData,
          assessment: {
            selectedCountries: [],
            assessments: [],
          },
          encId: report.encId,
          transactionHash: report.transaction?.transactionHash,
          blockchainLink: report.blockchainLink,
          supplier: this.handleEmptyUser(report.supplier),
          operator: this.handleEmptyUser(report.operator),
          user: report.user,
          status: report.status,
          companyID: report.companyID,
          EUDRReferenceNumber: report.EUDRReferenceNumber,
          internalReferenceNumber: report.internalReferenceNumber,
          activity: report.activity,
          countryOfEntry: report.countryOfEntry,
          countryOfActivity: report.countryOfActivity,
          containerId: report.containerIds,
          countryOfProduction: report.countryOfProduction,
          product: (report.product) ? selectedProduct?.name : 'N/A',
          productDescription: report.productDescription,
          productNetMass: UnitService.fromBase.weight(this.eudrSettings.product_mass_unit, report.productNetMass),
          productVolume: UnitService.fromBase.volume(this.eudrSettings.volume_unit, report.productVolume),
          productScientificName: report.productScientificName,
          productCommonName: report.productCommonName,
          polygonProductionPlaces: report.polygonProductionPlaces,
          pointProductionPlaces: report.pointProductionPlaces,
          totalArea: report.totalArea,
          totalProductionPlaces: report.totalProductionPlaces,
          totalHighDeforestationProductionPlaces: report.totalHighDeforestationProductionPlaces,
          totalDeforestationAssessments: report.totalDeforestationAssessments,
          blockchainPublishDate: report.blockchainPublishDate,
          is_report_concluded: report.is_report_concluded,
          is_dds_status_update: report?.is_dds_status_update,
          enableOnScreenRiskWarnings: report?.enableOnScreenRiskWarnings,
          riskWarnings: report?.riskWarnings || [],
          ddsReportExporter: report?.ddsReportExporter,
          assignedTo: report.assignedTo,
          assignedToCfId: report.assignedToCfId,
          userId: report.userId,
          requestAdditionalInformation: report?.requestAdditionalInformation || [],
          statusLegends: report?.statusLegends,
        };

        this.selectedAssessments = report.requiredAssessment;
        reportDetail.assessment.assessments = report.requiredAssessment;
        reportDetail.assessment.selectedAssessments = report.requiredAssessment.map(assessment => (assessment.assessment));
        reportDetail.assessment.selectedCountries = report.assessmentCountries;

        const updatedDiligenceDetail = Object.assign({}, this.report, reportDetail);
        this.report = updatedDiligenceDetail;
        this.$store.commit('eudrDDS/SET_DILIGENCE_DETAILS', this.report);
        
        // Set the current assigned user in the dropdown if exists
        if (this.report.assignedToCfId && this.assignedToOptions.length > 0) {
          const currentAssignedUser = this.assignedToOptions.find(user => user.value === this.report.assignedToCfId);
          if (currentAssignedUser) {
            this.reportAssignedTo = currentAssignedUser.value;
          }
        }

        // Fetch exporter details in parallel if needed (non-blocking)
        if (report?.ddsReportExporter?.exporter_cf_id) {
          this.getExporterDetailsById(report?.ddsReportExporter?.exporter_cf_id).catch(err => {
            console.error('Failed to fetch exporter details:', err);
          });
        }

      } catch (err) {
        console.error('Error fetching diligence detail:', err);
        this.$notify({
          text: err.message || this.$t('Failed to load diligence detail'),
          type: "error",
        });
        throw err; 
      }
    },
    async exportToPDFForProductionPlaces() {
      try {
        this.startLoading();
        const diligenceReportId = parseInt(this.$route.params.id);

        const requestParams = {
          page: this.options.page,
          limit: this.options.limit,
          diligenceReportId: diligenceReportId,
          removed: false,
          searchPhrase: this.search,
          eudrDeforestationStatus: this.statusModel,
          farmCountry: this.countryModel,
          farmOwner: this.producerModel
        };

        const querys = new URLSearchParams(requestParams).toString();
        const token = this.$store.state.auth.token;
        const url = process.env.VUE_APP_DEFORESTRATION_API_BASE_URL || "http://localhost:4043/api";

        await this.downloadSourceFileWithToken(
          `${url}/production-place/production-place-with-status-pdf?${querys}`,
          "application/pdf",
          token,
          "production-places.pdf"
        );

        this.$notify({
          text: this.$t("dueDiligence.productionPlacesExportedSuccessfully"),
          type: "success",
        });
      } catch (error) {
        this.$notify({
          text: error.message || this.$t("somethingWentWrong"),
          type: "error",
        });
      } finally {
        this.stopLoading();
      }
    },
    getMenusForReport(report) {
      return report?.transactionHash ? this.menus : this.menusWithoutCompliance;
    },
    getEUDRDeforestationStatus(status) {
      switch (status) {
        case 'Zero/Negligible Deforestation Probability':
        case 'Zero/Negligible Probability':
          return { class: 'green-button', text: this.$t("deforestation.zeroOrNegligibleProbability") };
        case 'Very High Deforestation Probability':
        case 'Very High Probability':
          return { class: 'very-high-button', text: this.$t("deforestation.veryHighProbability") };
        case 'Very Low Deforestation Probability':
        case 'Very Low Probability':
          return { class: 'very-low-button', text: this.$t("deforestation.veryLowProbability") };
        case 'High Deforestation Probability':
        case 'High Probability':
          return { class: 'red-button', text: this.$t("deforestation.highProbability") };
        case 'Low Deforestation Probability':
        case 'Low Probability':
          return { class: 'orange-button', text: this.$t("deforestation.lowProbability") };
        case 'Medium Deforestation Probability':
        case 'Medium Probability':
          return { class: 'medium-button', text: this.$t("deforestation.mediumProbability") };
        case 'Manually Deforestation Mitigated':
        case 'Manually Mitigated':
          return { class: 'manually-button', text: this.$t("dueDiligence.manualMitigated") };
        case 'unknown_error':
          return { class: 'deep-orange-darken-1-button', text: this.$t("dueDiligence.unknown_error") };
        case 'geo_location_error':
          return { class: 'deep-orange-darken-1-button', text: this.$t("dueDiligence.geo_location_error") };
        case 'region_not_available':
          return { class: 'deep-orange-darken-1-button', text: this.$t("dueDiligence.region_not_available") };
        case 'area_too_large':
          return { class: 'deep-orange-darken-1-button', text: this.$t("dueDiligence.area_too_large") };
        case 'area_too_small':
          return { class: 'deep-orange-darken-1-button', text: this.$t("dueDiligence.area_too_small") };
        case 'invalid_request_data':
          return { class: 'deep-orange-darken-1-button', text: this.$t("dueDiligence.invalid_request_data") };
        case 'unknown_error_tt':
          return { class: 'unknown_error', text: this.$t("dueDiligence.unknown_error_tt") };
        case 'geo_location_error_tt':
          return { class: 'geo_location_error', text: this.$t("dueDiligence.geo_location_error_tt") };
        case 'region_not_available_tt':
          return { class: 'region_not_available', text: this.$t("dueDiligence.region_not_available_tt") };
        case 'area_too_large_tt':
          return { class: 'area_too_large', text: this.$t("dueDiligence.area_too_large_tt") };
        case 'area_too_small_tt':
          return { class: 'area_too_small', text: this.$t("dueDiligence.area_too_small_tt") };
        case 'invalid_request_data_tt':
          return { class: 'invalid_request_data', text: this.$t("dueDiligence.invalid_request_data_tt") };
        default:
          return { class: '', text: 'N/A' };
      }
    },
    handleClick(eudrDeforestationStatus) {
      if (!eudrDeforestationStatus) {
        this.$notify({
          text: this.$t('emptyDeforestationStatus'),
          type: 'error'
        });
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
            params: { reportRequestId: item.deforestationInfo.deforestationReportRequestId, type: item.deforestationInfo?.deforestationReport?.transactionHash ? "certificate" : "assignment" },
          });
          break;
        case "compliance":
          this.$router.push({
            name: "ComplianceCertificationEudrAssessment",
            params: { id: item.deforestationInfo.deforestationReportRequestId },
          });
          break;
        case "mitigation":
          this.targetedProductionPlaceId = item.diligenceReportProductionPlaceArray[0]?.id;
          this.showMitigtionModal = true;
          break;
        default:
          break;
      }
    },
    selectItem(item) {
      this.selectedItem = item;
    },
    pageChange(t) {
      if (t) this.options.page = this.options.page + 1;
      else this.options.page = this.options.page - 1;
    },
    async removeFarm(id) {
      this.farmConfirmDelete.confirmData = { id };
      this.farmConfirmDeleteDialog = true;
    },
    async confirmRemoveFarm(action, confirmData) {
      this.startLoading();
      try {
        const params = {
          diligenceReportId: parseInt(this.$route.params.id),
          farmId: parseInt(confirmData.id),
        };
        await DeforestationService.removeFarmFromProductionPlaceListById(params);
        
        // Log the production place deletion
        try {
          const userId = this.$store.getters.getUser?.id;
          if (userId) {
            await ActivityLogService.logDDSProductionPlaceDeleted(
              parseInt(this.$route.params.id),
              userId,
              confirmData.id,
              '',
              'Approval flow deletion'
            );
          }
        } catch (logError) {
          console.error('Error logging production place deletion:', logError);
        }
        
        await this.fetchAllData();
        this.farmConfirmDeleteDialog = false;
      } catch (error) {
        this.$notify({
          text: this.$t('Failed to remove farm'),
          type: 'error'
        });
      } finally {
        this.stopLoading();
      }
    },
    debouncedGetProductionPlaces: debounce(function () {
      this.options = {
        page: 1,
        limit: 10
      };
      this.getProductionPlaces();
    }, 1000),
    async getProductionPlaces(opt = null) {
      // Only set loading to true if this is the initial load
      const isInitialLoad = !this.productionPlaces.length;
      if (isInitialLoad) {
        this.loading = true;
      }
      
      const requestParams = {
        page: this.options.page,
        limit: this.options.limit,
        diligenceReportId: parseInt(this.$route.params.id),
        removed: false,
        searchPhrase: this.search,
        eudrDeforestationStatus: this.statusModel,
        farmCountry: this.countryModel,
        farmOwner: this.producerModel
      };
      if (opt?.sortBy?.length) {
        requestParams.orderField = opt.sortBy[0];
        requestParams.order = opt.sortDesc[0] ? "DESC" : "ASC";
      }
      try {
        const res = await DeforestationService.getProductionPlaces(requestParams);
        this.productionPlaces = res.data.productionPlaces.rows.map((item) => {
          const deforestationInfo = item.diligenceReportProductionPlaceArray?.[0]?.productionPlaceDeforestationInfo;
          return {
            ...item,
            deforestationInfo,
            deforestationStatus: deforestationInfo?.deforestationStatus,
            isExpired: isDeforestationExpired(deforestationInfo?.deforestationStatusDate, this.get_EUDR_Settings),
            errorStatus: deforestationInfo?.deforestationReport?.errorStatus
          };
        });
        this.totalProductionPlaces = res.data.productionPlaces.totalCount;

        this.from = (this.options.page - 1) * this.options.limit + 1;
        this.to = this.options.page * this.options.limit;

        if (this.productionPlaces.length > 0) {
          this.to -= this.options.limit - this.productionPlaces.length;
        } else {
          this.to -= this.options.limit;
        }
        const producerList = this.productionPlaces
          .filter((item) => item.farm.userDdsAssoc.firstName)
          .map((item) => {
            const fullName = `${item.farm.userDdsAssoc.firstName || ""} ${item.farm.userDdsAssoc.lastName || ""}`.trim();
            return {
              text: fullName,
              val: item.farm.userDdsAssoc.firstName || "",
            };
          });
          
        this.allProducers = [...this.allProducers, ...producerList];
        
      } catch (err) {
        console.error("Error loading production places:", err);
        this.$notify({
          text: this.$t('Failed to load production places'),
          type: 'error'
        });
        throw err; // Re-throw to be caught by Promise.allSettled
      } finally {
        if (isInitialLoad) {
          this.loading = false;
        }
      }
    },
    downloadFinalReport(downloadType) {
      const isPtsiRole = isIndonesianClient() ? "ptsi" : isKenyaClient() ? "naccu" : "non-ptsi";
      if (downloadType == 'pdf') {
        this.startLoading()
        this.downloadSourceFile(`${process.env.VUE_APP_DEFORESTRATION_REPORTING_API_BASE_URL}/diligence-report/final-report-pdf/${this.$route.params.id}/basic/${isPtsiRole}`, "application/pdf", "dds-final-report.pdf")
          .then(() => {
            this.stopLoading()
          }).catch(() => {
            this.stopLoading()
          })
      }

      if (downloadType == 'json') {
        this.startLoading()
        this.getFormattedJSON()
          .then(() => {
            this.stopLoading()
          }).catch(() => {
            this.stopLoading()
          })
      }
    },


    async getFormattedJSON() {
      try {
        const diligenceReportId = parseInt(this.$route.params.id);

        const {
          totalPolygon,
          totalArea,
          totalPoint,
          totalHighDeforestationCount,
          totalNumberOfFarms,
          lowZeroRiskFarm,
          highRiskFarmArea,
          totalLowZeroFarmArea,
          productionPlaces
        } = await DeforestationService.getSummaryDDS(diligenceReportId);

        // Get the report details from the current component state
        const {
          product,
          productCommonName,
          productScientificName,
          productVolume,
          productNetMass,
          supplier,
          operator,
          activity,
          EUDRReferenceNumber,
          countryOfEntry,
          countryOfActivity,
          status
        } = this.report;

        const report_summary = {
          total_no_of_polygons: totalPolygon,
          total_no_of_points: totalPoint,
          total_no_of_deforestation_assessments: this.diligenceReportAssessmentLength,
          total_no_of_risk_assessments: this.selectedAssessments?.length || 0,
          total_no_of_farms: totalNumberOfFarms,
          total_no_of_high_deforestation_assessments: totalHighDeforestationCount,
          total_no_of_low_and_zero_risk_farms: lowZeroRiskFarm,
          total_area: totalArea,
          average_geofence_area: 'N/A',
          total_area_of_high_risk_farm: highRiskFarmArea,
          total_area_of_low_and_zero_risk_farm: totalLowZeroFarmArea
        };

        const product_details = {
          product_name: product,
          net_mass: productNetMass,
          volume: productVolume,
          common_name: productCommonName,
          scientific_name: productScientificName
        };

        const formattedJSONReport = {
          document_id: 'N/A',
          eudr_reference_number: EUDRReferenceNumber || 'N/A',
          activity: activity || 'N/A',
          country_of_activity: countryOfActivity || 'N/A',
          country_of_entry: countryOfEntry || 'N/A',
          due_diligence_report_status: status || 'N/A',
          container_id: this.report.containerId || 'N/A',
          supplier_data: supplier || {},
          operator_data: operator || {},
          report_summary,
          product_details,
          production_places: productionPlaces || []
        };

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(formattedJSONReport));
        const reportDownloadElement = document.createElement("a");
        reportDownloadElement.setAttribute("href", dataStr);
        reportDownloadElement.setAttribute("download", `diligence-report-${diligenceReportId}.json`);
        document.body.appendChild(reportDownloadElement);
        reportDownloadElement.click();
        document.body.removeChild(reportDownloadElement);
      } catch (error) {
        console.error('Error generating JSON report:', error);
        throw error;
      }
    },

    async getExporterDetailsById(exporterId) {
      if (!exporterId) {
        console.warn("No exporter ID provided");
        return;
      }
      try {
        const user = await UserService.getUserDetails(exporterId);
        if (user && user.data) {
          this.exporterDetails = {
            id: user.data.id,
            name: user.data.firstName + " " + user.data.lastName,
            email: user.data.email,
            phoneNumber: user.data.mobile || user.data.phoneNumber,
            country: user.data.countryId,
            status: user.data.active ? "Registered" : "Unregistered"
          };
        } else {
          console.error("Exporter details not found");
          this.exporterDetails = {};
        }
      } catch (error) {
        console.error("Error fetching exporter details:", error);
        this.exporterDetails = {};
        this.$notify({
          text: this.$t('deforestation.errorFetchingExporterDetails'),
          type: "error",
        });
      }
    },
    openSendToOperatorDialog() {
      this.showSendToOperatorDialog = true;
      this.getSupplierOrOperatorList(null, "operator");
    },
    closeSendToOperatorDialog() {
      this.showSendToOperatorDialog = false;
      this.operatorEmail = '';
      this.operatorDetails = null;
      this.operatorId = null;
      this.searchingOperator = false;
    },
    async makeHttpRequestForoperatorAssignment() {
      this.startLoading()
      try {
        const params = {
          diligenceReportId: parseInt(this.$route.params.id),
          operatorId: parseInt(this.operatorDetails?.id),
        };
        await DeforestationService.shareReportToOperator(params);
        this.$notify({
          text: this.$t('dueDiligence.updatedDueDiligenceReport'),
          type: 'success'
        });
        this.closeSendToOperatorDialog();
        await this.fetchAllData();
      } catch (error) {
        this.$notify({
          text: this.$t('Failed to share report to operator'),
          type: 'error'
        });
      } finally {
        this.stopLoading()
      }
    },
    async handleSendToOperator() {
      await this.makeHttpRequestForoperatorAssignment()
      this.confirmDialog = false
    },
    async sendToOperator() {
      if (!this?.operatorDetails?.verified) {
        this.confirmDialog = true
        return
      }
      await this.makeHttpRequestForoperatorAssignment()
    },

    
    // Assign User Methods
    handleAssignUserChange() {
      // This method is called when the dropdown value changes
      // We don't need to do anything here as the actual assignment is handled in selectAssignUserFromDropdown
    },
    
    selectAssignUserFromDropdown(user) {
      this.selectedUserForAssignment = user;
      this.assignConfirmationMessage = this.$t('dueDiligence.assignReportConfirmation', { 
        userName: user?.name,
        reportId: this.report?.internalReferenceNumber || this.$route.params.id 
      });
      this.showAssignConfirmationDialog = true;
    },
    
    cancelAssignUser() {
      this.showAssignConfirmationDialog = false;
      this.selectedUserForAssignment = null;
      this.reportAssignedTo = null; // Reset the dropdown
    },
    
    async confirmAssignUser() {
      if (!this.selectedUserForAssignment) {
        this.$notify({
          text: this.$t('No user selected for assignment'),
          type: 'warning'
        });
        return;
      }
      
      this.startLoading();
      try {
        const input = {
          reportIds: [parseInt(this.$route.params.id)],
          assignedTo: parseInt(this.selectedUserForAssignment.value, 10)
        };
        
        const response = await DeforestationService.bulkAssignReports(input);
        
        if (response && response.data && response.data.bulkAssignReports) {
          if (response.data.bulkAssignReports.success) {
            this.$notify({
              text: this.$t('Report assigned successfully'),
              type: 'success'
            });
            
            // Refresh the report data to show updated assignment
            await this.fetchAllData();
          } else {
            this.$notify({
              text: response.data.bulkAssignReports.message || this.$t('Failed to assign report'),
              type: 'error'
            });
            this.reportAssignedTo = null; // Reset on failure
          }
        } else {
          this.$notify({
            text: this.$t('Unexpected response from server'),
            type: 'error'
          });
          this.reportAssignedTo = null; // Reset on failure
        }
      } catch (error) {
        console.error('Error assigning report:', error);
        this.$notify({
          text: this.$t('An error occurred while assigning report'),
          type: 'error'
        });
        this.reportAssignedTo = null; // Reset on failure
      } finally {
        this.stopLoading();
        this.showAssignConfirmationDialog = false;
        this.selectedUserForAssignment = null;
      }
    },
    
    async fetchAssignedToList() {
      try {
        const response = await UserListService.getAssignedToList();
        const data = response?.data?.rows || [];
        if (data && Array.isArray(data)) {
          this.assignedToOptions = data.map(user => ({
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            value: user.cf_userid || user.id // Use cf_userid to match with assignedToCfId
          }));
        }
      } catch (error) {
        console.error('Error fetching assigned to list:', error);
        this.$notify({
          text: this.$t('Failed to fetch assigned users list'),
          type: 'error'
        });
      }
    },
    
    // Approval Methods
    handleApproveReport() {
      // Show the approval confirmation modal
      this.showApprovalModal = true;
    },
    
    handleApprovalCancel() {
      this.showApprovalModal = false;
    },
    
    async handleApprovalConfirm(approvalData) {
      try {
        this.loading = true;
        const input = {
          reportIds: [parseInt(this.$route.params.id, 10)],
          isTemporaryApproval: approvalData.isTemporaryApproval
        };

        // Add expiration fields only if it's a temporary approval
        if (approvalData.isTemporaryApproval) {
          input.approvalExpirationValue = approvalData.approvalExpirationValue;
          input.approvalExpirationUnit = approvalData.approvalExpirationUnit;
        }
        this.showPocessingModal = true;
        const response = await DeforestationService.bulkApproveReports(input);
        const responseData = response?.data.bulkApproveReports

        if (response && response.data && response.data.bulkApproveReports) {
          if (response.data.bulkApproveReports.success) {
            // Log successful bulk approval
            const userId = this.$store.getters.getUser?.id;
            if (userId) {
              await ActivityLogService.logDDSBulkReportsApproved(
                parseInt(this.$route.params.id, 10),
                userId,
                approvalData.isTemporaryApproval ? 'temporary' : 'permanent',
                response.data.bulkApproveReports.processedCount
              );
            }
          }
        }
        if(responseData?.jobs){
          this.$notify({
            text: 'The approval has been successfully completed. Writing to blockchain may take a few minutes.',
            type: 'info'
          });
          await this.getDiligenceDetail(this.$route.params.id),
          this.loading = false;
        }

        let job = responseData.jobs;
        let stopWaiting = false;

        const timeout = setTimeout(() => {
          stopWaiting = true;
          this.showPocessingModal = false;
          this.$notify({
            text: 'Writing deforestation data to blockchain is taking longer than expected. You can continue working and check the status later in the Job History section.',
            type: 'warning'
          });
        }, 50000); // 80 seconds

        while (!stopWaiting && this.showPocessingModal) {
          await wait(8000);
          const jobIDS = job.map(j => parseInt(j.id)); 
          const response = await DeforestationService.getJobs(jobIDS);

          if (!response?.data?.getJobs?.length) {
            this.$notify({
              text: 'Failed to write deforestation data to blockchain, please try again.',
              type: 'error'
            });
          }

          const allCompleted = response.data.getJobs.every(j => j.status === 'Completed' || j.status === 'Failed');
          if (allCompleted) {
            clearTimeout(timeout);
            await wait(1500);
            this.showPocessingModal = false;
            await this.getDiligenceDetail(this.$route.params.id),
            this.$notify({
              text: 'Report Successfully Approved & Written to Blockchain',
              type: 'success'
            });
            break;
          }
          // if modal was closed manually during wait, stop the loop
          if (!this.showPocessingModal) break;
        }
        clearTimeout(timeout);
      } catch (error) {
        console.error('Error approving reports:', error);
        this.$notify({
          text: 'An error occurred while approving reports',
          type: 'error'
        });
      } finally {
        this.loading = false;
        // Close modal and clear selection
        this.showApprovalModal = false;
        this.selectedReports = [];
      }
    },
    
    // Rejection Methods
    handleRejectReport() {
      // Show the rejection confirmation modal
      this.showRejectionModal = true;
    },
    
    handleRejectionCancel() {
      this.showRejectionModal = false;
    },
    
    async handleRejectionConfirm(rejectionData) {
      try {
        this.startLoading();

        const input = {
          reportIds: [parseInt(this.$route.params.id, 10)],
          reason: rejectionData.reason
        };

        const response = await DeforestationService.bulkRejectReports(input);

        console.log('Reject response:', response);

        if (response && response.data && response.data.bulkRejectReports) {
          if (response.data.bulkRejectReports.success) {
            // Log successful rejection
            const userId = this.$store.getters.getUser?.id;
            if (userId) {
              await ActivityLogService.logDDSReportRejected(
                parseInt(this.$route.params.id, 10),
                userId,
                rejectionData.reason
              );
            }

            this.$notify({
              text: response.data.bulkRejectReports.message || this.$t('Report rejected successfully'),
              type: 'success'
            });

            this.$router.push({ name: 'dds_root_due_diligence_report' });
          } else {
            // Log failed rejection
            const userId = this.$store.getters.getUser?.id;
            if (userId) {
              await ActivityLogService.logDDSReportRejectionFailed(
                parseInt(this.$route.params.id, 10),
                userId,
                response.data.bulkRejectReports.message || 'Unknown error'
              );
            }

            this.$notify({
              text: response.data.bulkRejectReports.message || this.$t('Failed to reject report'),
              type: 'error'
            });
          }
        } else {
          console.error('Unexpected response structure:', response);
          this.$notify({
            text: this.$t('Unexpected response from server'),
            type: 'error'
          });
        }
      } catch (error) {
        console.error('Error rejecting report:', error);
        this.$notify({
          text: this.$t('An error occurred while rejecting report'),
          type: 'error'
        });
      } finally {
        this.stopLoading();
        // Close modal
        this.showRejectionModal = false;
      }
    },
    
    requestAdditionalInformation() {
      this.requestAdditionalInformationDialog = true;
    },
    
    closeRequestAdditionalInformationDialog() {
      this.requestAdditionalInformationDialog = false;
    },
  },
  data() {
    return {
      reportAssignedTo: null,
      showPocessingModal: false,
      loading: true, // Start with loading true
      confirmDialog: false,
      report: {
        assessment: {
          selectedAssessments: [],
          assessments: [],
          selectedCountries: []
        }
      },
      totalProductionPlaces: 0,
      diligenceReportAssessmentLength: 0,
      supplierOperatorLoading: false,
      formattedOperator: [],
      operatorId: null,
      operatorCreateDialog: false,

      totalPolygon: 0,
      totalArea: 0,
      totalPoint: 0,
      totalHighDeforestationCount: 0,
      totalNumberOfFarms: 0,
      lowZeroRiskFarm: 0,
      highRiskFarmArea: 0,
      totalLowZeroFarmArea: 0,
      countries: [...getCountries()],
      menus: [
        { title: this.$t('dueDiligence.viewDeforestationAssessment'), id: "assessment" },
        { title: this.$t('dueDiligence.viewDeforestationCertificate'), id: "compliance" },
      ],
      showDisputeModal: false,
      showMitigtionModal: false,
      targetedProductionPlaceId: null,
      targetProductionPlace: null,
      selectedItem: false,
      search: "",
      from: 0,
      to: 0,
      options: {
        page: 1,
        limit: 10,
      },
      productionPlaces: [],
      allProducers: [{ text: this.$t("deforestation.allProducer"), val: "" }],
      countryModel: [],
      statusModel: "",
      producerModel: "",
      allStatus: [
        { text: this.$t("deforestation.allStatus"), val: "" },
        { text: this.$t("deforestation.veryHighDeforestationProbability"), val: "Very High Deforestation Probability" },
        { text: this.$t("deforestation.highDeforestationProbability"), val: "High Deforestation Probability" },
        { text: this.$t("deforestation.mediumDeforestationProbability"), val: "Medium Deforestation Probability" },
        { text: this.$t("deforestation.lowDeforestationProbability"), val: "Low Deforestation Probability" },
        { text: this.$t("deforestation.veryLowDeforestationProbability"), val: "Very Low Deforestation Probability" },
        { text: this.$t("deforestation.zeroNegligibleDeforestationProbability"), val: "Zero/Negligible Deforestation Probability" },
        { text: this.$t("deforestation.manuallyMitigated"), val: "Manually Mitigated" },
      ],
      farmConfirmDeleteDialog: false,
      farmConfirmDelete: {
        title: this.$t("confirmDialog.farm.delete.title"),
        message: this.$t("confirmDialog.farm.delete.message"),
        confirmBtnText: this.$t("confirmDialog.farm.delete.confirmBtn"),
        cancelBtnText: this.$t("cancel"),
        confirmData: {},
      },
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: true,
          to: "/",
        },
        {
          text: this.$t('dueDiligence.dueDiligence'),
          disabled: true,
          to: "breadcrumbs_link_1",
        },
        {
          text: this.$t('dueDiligence.viewSummary'),
          disabled: true,
          to: "breadcrumbs_link_1",
        },
      ],
      headers: [
        {
          text: this.$t("deforestation.productionPlacesFarmAndFarmId"),
          align: "start",
          value: "farm.farmName",
          class: "black--text",
          sortable: true,
        },
        {
          text: this.$t("deforestation.producerName"),
          align: "start",
          value: "farm.userDdsAssoc.firstName",
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
          text: this.$t('dueDiligence.actions'),
          align: "center",
          value: "status",
          class: "black--text",
          sortable: false,
        },
      ],
      showSendToOperatorDialog: false,
      operatorEmail: '',
      operatorDetails: null,
      searchingOperator: false,
      eudrSettings: {},
      productList: [],
      selectedAssessments: [],
      logo: '',
      exporterDetails: null,
      // Assigned To dropdown properties
      assignedToSearch: "",
      assignedToOptions: [],
      
      // Assign User Confirmation Data
      showAssignConfirmationDialog: false,
      selectedUserForAssignment: null,
      assignConfirmationMessage: '',
      
      // Approval Data
      showApprovalModal: false,
      
      // Rejection Data
      showRejectionModal: false,
      
      // Request Additional Information Data
      requestAdditionalInformationDialog: false,
      supplierId: null,
    };
  },
  mixins: [loadingMixin, DownloadMixin],
};
</script>

<style lang="scss" scoped>
.font-weight-bold {
  font-weight: 900 !important;
}

// Reduce spacing within dropdown lists
::v-deep .v-list-item {
  padding: 4px 8px !important;
  min-height: 32px !important;
}

::v-deep .v-list-item-action {
  margin: 0 4px 0 0 !important;
}

::v-deep .v-list-item-content {
  padding: 0 !important;
}

::v-deep .v-list-item-title {
  font-size: 14px !important;
  line-height: 1.2 !important;
}

::v-deep .v-checkbox {
  margin: 0 !important;
}

::v-deep .v-input--selection-controls {
  margin-top: 0 !important;
  padding-top: 0 !important;
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
  background-color: $primary-color;
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

.filter-pro-places {
  flex-direction: column;

  @media (min-width: 1689px) {
    flex-direction: row;
  }
}

.pagination {
  align-self: flex-end;

  @media (min-width: 1689px) {
    align-self: center;
  }
}

::v-deep .non-clickable {
  pointer-events: none;
  cursor: default;
}

::v-deep .blockchain-text {
  font-weight: bolder;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;

  i {
    color: #00BD73 !important;
  }

  a {
    text-decoration: none;
  }

  &>p {
    margin-bottom: 16px;
  }
}

#blockchain-qr,
#public-qr {
  min-width: 140px;
  margin-right: 1rem;
}

.blockchain-text {
  padding-left: 1rem;
}

::v-deep .right-border-light {
  border-right: 1px solid lightgray;
}

.non-ptsi-brand {
  color: #0EBF67 !important;
}

.ptsi-brand {
  color: #194880 !important;
}
</style>
