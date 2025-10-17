<template>
  <div class="mx-4">
    <v-container fluid>
      <v-card elevation="0" class="px-4 py-3 mb-6 justify-center items-center">
        <div class="d-flex my-3">
          <h2 class="font-weight-black">{{ $t('blends.createBlends.blend') }}</h2>
          <v-spacer></v-spacer>

          <v-spacer></v-spacer>
          <div class="d-flex">
            <v-btn v-show="blendId" color="error" dark class="mr-2 font-weight-bold" @click="discard">
              {{ $t('blends.finalReport.buttons.discard') }}
            </v-btn>
            <v-btn color="yellow" dark class="mr-2 font-weight-bold" @click="rejectBlends">
              {{ $t('blends.finalReport.buttons.reject') }}
            </v-btn>
            <v-btn color="primary" dark class="mr-2 font-weight-bold" @click="$emit('closePreview')">
              {{ $t('blends.finalReport.buttons.edit') }}
            </v-btn>
            <v-btn color="primary" dark class="mr-2 font-weight-bold" @click="handleFinalize(isUpdate)">
              {{ $t('blends.finalReport.buttons.finalize') }}
            </v-btn>
          </div>
        </div>
      </v-card>


      <!-- 1st card  -->
      <v-card elevation="0" class="my-6 pa-6">
        <v-row>
          <v-col cols="3">
            <div class="d-flex align-center mb-2">
              <span class="text-subtitle-2 font-weight-light mr-1">{{ $t('blends.finalReport.blendTitle')
                }}</span>
              <v-tooltip bottom color="00BD73" max-width="500">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                    mdi-alert-circle
                  </v-icon>
                </template>
                <span>{{ $t("dueDiligence.supplierTooltip") }}</span>
              </v-tooltip>
            </div>
            <div class="text-subtitle-1 font-weight-bold">{{ formData?.blendSetting?.blendTitle || 'N/A' }}</div>
          </v-col>
          <v-col cols="3">
            <div class="d-flex align-center mb-2">
              <span class="text-subtitle-2 font-weight-light mr-1">{{ $t('blends.finalReport.blendCode')
                }}</span>
              <v-tooltip bottom color="00BD73" max-width="500">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                    mdi-alert-circle
                  </v-icon>
                </template>
                <span>{{ $t("blends.finalReport.blendCode") }}</span>
              </v-tooltip>
            </div>
            <div class="text-subtitle-1 font-weight-bold">{{ formData?.blendSetting?.blendCode || 'N/A' }}</div>
          </v-col>
          <v-col cols="3">
            <div class="d-flex align-center mb-2">
              <span class="text-subtitle-2 font-weight-light mr-1">{{
                $t('blends.finalReport.finalProduct') }}</span>
              <v-tooltip bottom color="00BD73" max-width="500">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                    mdi-alert-circle
                  </v-icon>
                </template>
                <span>{{ $t('blends.finalReport.finalProduct') }}</span>
              </v-tooltip>
            </div>
            <div class="text-subtitle-1 font-weight-bold">{{ formData?.blendSetting?.finalProductName || 'N/A' }}</div>
          </v-col>
          <v-col cols="3">
            <div class="d-flex align-center mb-2">
              <span class="text-subtitle-2 font-weight-light mr-1">{{
                $t('blends.finalReport.finalProductCode') }}</span>
              <v-tooltip bottom color="00BD73" max-width="500">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                    mdi-alert-circle
                  </v-icon>
                </template>
                <span>{{ $t("blends.finalReport.finalProductCode") }}</span>
              </v-tooltip>
            </div>
            <div class="text-subtitle-1 font-weight-bold">{{ formData?.blendSetting?.finalProductCode || 'N/A' }}</div>
          </v-col>
        </v-row>

        <v-row class="mt-4">
          <v-col cols="6">
            <div class="d-flex align-center mb-2">
              <span class="text-subtitle-2 font-weight-light mr-1">{{
                $t('blends.finalReport.blendDescription') }}</span>
              <v-tooltip bottom color="00BD73" max-width="500">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                    mdi-alert-circle
                  </v-icon>
                </template>
                <span>{{ $t("blends.finalReport.blendDescription") }}</span>
              </v-tooltip>
            </div>
            <div class="text-subtitle-1 font-weight-bold">{{ formData?.blendSetting?.blendDescription || 'N/A' }}</div>
          </v-col>
          <!-- <v-col cols="6">
            <div class="d-flex align-center mb-2">
              <span class="text-subtitle-2 font-weight-light mr-1">{{ $t('blends.finalReport.processType')
                }}</span>
            </div>
            <div class="text-subtitle-2 font-weight-bold">{{ formData?.blendSetting?.processType || 'N/A' }}</div>
          </v-col> -->
        </v-row>

        <v-row class="mt-4">
          <v-col cols="3">
            <div class="d-flex align-center mb-2">
              <span class="text-subtitle-2 font-weight-light mr-1">{{ $t('blends.finalReport.netMass')
                }}</span>
              <v-tooltip bottom color="00BD73" max-width="500">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                    mdi-alert-circle
                  </v-icon>
                </template>
                <span>{{ $t("blends.finalReport.netMass") }}</span>
              </v-tooltip>
            </div>
            <div class="text-subtitle-1 font-weight-bold">{{ formData?.netMass || 'N/A' }} {{ get_EUDR_Settings?.product_mass_unit}}</div>
          </v-col>
          <v-col cols="3">
            <div class="d-flex align-center mb-2">
              <span class="text-subtitle-2 font-weight-light mr-1">{{ $t('blends.finalReport.volume')
                }}</span>
              <v-tooltip bottom color="00BD73" max-width="500">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                    mdi-alert-circle
                  </v-icon>
                </template>
                <span>{{ $t("blends.finalReport.volume") }}</span>
              </v-tooltip>
            </div>
            <div class="text-subtitle-1 font-weight-bold">{{ formData?.volume || 'N/A' }} {{get_EUDR_Settings?.volume_unit}}</div>
          </v-col>
          <v-col cols="3">
            <div class="d-flex align-center mb-2">
              <span class="text-subtitle-2 font-weight-light mr-1">{{ $t('blends.finalReport.blendLotId')
                }}</span>
              <v-tooltip bottom color="00BD73" max-width="500">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                    mdi-alert-circle
                  </v-icon>
                </template>
                <span>{{ $t("blends.finalReport.blendLotId") }}</span>
              </v-tooltip>
            </div>
            <div class="text-subtitle-1 font-weight-bold">{{ formData?.blendLotId || 'N/A' }}</div>
          </v-col>
          <v-col cols="3">
            <div class="d-flex align-center mb-2">
              <span class="text-subtitle-2 font-weight-light mr-1">{{
                $t('blends.finalReport.finalProductLotId') }}</span>
              <v-tooltip bottom color="00BD73" max-width="500">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                    mdi-alert-circle
                  </v-icon>
                </template>
                <span>{{ $t("blends.finalReport.finalProductLotId") }}</span>
              </v-tooltip>
            </div>
            <div class="text-subtitle-1 font-weight-bold">
              {{ formData?.finishedProductLotId || 'N/A' }}
            </div>
          </v-col>
        </v-row>
      </v-card>
      <!-- 2nd card  -->
      <v-card elevation="0" class="my-6 pa-6">
        <v-row>
          <v-col cols="6" md="3">
            <div class="d-flex align-center mb-2">
              <span class="text-subtitle-2 font-weight-light mr-1">{{
                $t('blends.finalReport.internalReferenceNumber')
              }}</span>
              <v-tooltip bottom color="00BD73" max-width="500">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                    mdi-alert-circle
                  </v-icon>
                </template>
                <span>{{ $t("blends.finalReport.internalReferenceNumber") }}</span>
              </v-tooltip>
            </div>
            <div class="text-subtitle-1 font-weight-bold"> {{ formData?.internalReferenceNumber || 'N/A' }} </div>
          </v-col>
          <v-col cols="6" md="3">
            <div class="d-flex align-center mb-2">
              <span class="text-subtitle-2 font-weight-light mr-1">{{
                $t('blends.finalReport.eudrReferenceNumber')
              }}</span>
              <v-tooltip bottom color="00BD73" max-width="500">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                    mdi-alert-circle
                  </v-icon>
                </template>
                <span>{{ $t("blends.finalReport.eudrReferenceNumber") }}</span>
              </v-tooltip>
            </div>
            <div class="text-subtitle-1 font-weight-bold">
              {{ formData?.eudrReferenceNumber || 'N/A' }}
            </div>
          </v-col>
          <v-col cols="6" md="3">
            <div class="d-flex align-center mb-2">
              <span class="text-subtitle-2 font-weight-light mr-1">{{ $t('blends.finalReport.activity')
                }}</span>
            </div>
            <div class="text-subtitle-1 font-weight-bold">{{ formData?.activity || 'N/A' }}</div>
          </v-col>
          <v-col cols="6" md="3">
            <div class="d-flex align-center mb-2">
              <span class="text-subtitle-2 font-weight-light mr-1">{{
                $t('blends.createBlends.countryOfActivity')
              }}</span>
            </div>
            <div v-if="formData?.countryOfEntry" class="text-subtitle-1 font-weight-bold">
              {{ Array.isArray(formData?.countryOfActivity)
                ? formData.countryOfActivity.join(', ')
                : formData?.countryOfActivity
                  ? Object.values(formData.countryOfActivity).join(', ')
                  : '' }}
                {{ 
                  typeof formData?.countryOfActivity === 'string' || formData?.countryOfActivity instanceof String ?
                    JSON.parse(formData?.countryOfActivity).join(', ')
                  : ''  
                }}
            </div>
          </v-col>
        </v-row>

        <v-row class="mt-4">
          <v-col cols="6" md="3">
            <div class="d-flex align-center mb-2">
              <span class="text-subtitle-2 font-weight-light mr-1">{{
                $t('blends.finalReport.countryOfEntry')
              }}</span>
            </div>
            <div class="text-subtitle-1 font-weight-bold">
              {{ Array.isArray(formData?.countryOfEntry)
                ? formData.countryOfEntry.join(', ')
                : formData?.countryOfEntry
                  ? Object.values(formData.countryOfEntry).join(', ')
                  : 'N/A' }}
            </div>
          </v-col>
          <v-col cols="6" md="3">
            <div class="d-flex align-center mb-2">
              <span class="text-subtitle-2 font-weight-light mr-1">{{
                $t('blends.finalReport.dueDiligenceReportStatus') }}</span>
            </div>
            <div>
                <v-btn small rounded min-width="200" depressed class="gray-button"
                  height="40" v-if="blendStatus == 'pending'">
                {{ $t("blends.createBlends.status.pending") }}
                </v-btn>
                <v-btn small rounded min-width="200" depressed class="red-button"
                    height="40" v-else-if="blendStatus == 'non-compliant'">
                    {{ $t("blends.createBlends.status.nonCompliant") }}
                </v-btn>
                <v-btn small rounded min-width="200" depressed class="green-button" height="40"
                v-else-if="blendStatus == 'compliant'">
                {{ $t("blends.createBlends.status.compliant") }}
              </v-btn>
              <v-btn small rounded min-width="200" depressed class="green-button" height="40"
                v-else-if="blendStatus == 'uploaded-to-eu-portal'">
                {{ $t("blends.createBlends.status.uploadToEudr") }}
              </v-btn>
            </div>
          </v-col>
          <v-col cols="6" md="6">
            <div class="d-flex align-center mb-2">
              <span class="text-subtitle-2 font-weight-light mr-1">{{ $t('blends.finalReport.containerId')
                }}</span>
            </div>
            <div class="text-subtitle-1 font-weight-bold">{{ containerData || 'N/A' }}</div>
          </v-col>
        </v-row>

        <v-row class="mt-3">
          <v-col cols="12">
            <div class="d-flex align-center">
              <span class="font-weight-bold">{{ $t('blends.finalReport.operatorData') }}</span>
              <v-tooltip bottom color="00BD73" max-width="500">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                    mdi-alert-circle
                  </v-icon>
                </template>
                <span>{{ $t("blends.finalReport.operatorData") }}</span>
              </v-tooltip>
            </div>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="6" md="3">
            <div class="d-flex align-center mb-2">
              <span class="text-subtitle-2 font-weight-light mr-1">{{ $t('blends.finalReport.name')
                }}</span>
            </div>
            <div class="text-subtitle-1 font-weight-bold">{{ userInfo?.firstName + ' ' + userInfo?.lastName }}</div>
          </v-col>
          <v-col cols="6" md="3">
            <div class="d-flex align-center mb-2">
              <span class="text-subtitle-2 font-weight-light mr-1">{{ $t('blends.finalReport.country')
                }}</span>
            </div>
            <div class="text-subtitle-1 font-weight-bold">{{ userInfo?.countryIsoCode || 'N/A' }}</div>
          </v-col>
          <v-col cols="6" md="3">
            <div class="d-flex align-center mb-2">
              <span class="text-subtitle-2 font-weight-light mr-1">{{ $t('blends.finalReport.isoCode')
                }}</span>
            </div>
            <div class="text-subtitle-1 font-weight-bold">{{ userInfo?.countryIsoCode || 'N/A' }}</div>
          </v-col>
          <v-col cols="6" md="3">
            <div class="d-flex align-center mb-2">
              <span class="text-subtitle-2 font-weight-light mr-1">{{ $t('blends.finalReport.eoriNumber')
                }}</span>
            </div>
            <div class="text-subtitle-1 font-weight-bold">{{ userInfo?.eori_number || 'N/A' }}</div>
          </v-col>
        </v-row>
      </v-card>
      <!-- 3rd card Report Summary -->
      <!-- 3rd card Report Summary -->
      <v-card elevation="0" class="pa-6">
        <v-row>
          <!-- Header -->
          <v-col cols="12">
            <div class="font-weight-bold d-flex align-center">
              {{ $t('blends.finalReport.reportSummary.title') }}
              <v-tooltip bottom color="#00BD73" max-width="500">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon class="ml-2" color="#0EBF67" v-bind="attrs" v-on="on">
                    mdi-alert-circle
                  </v-icon>
                </template>
                <span>{{ $t("blends.finalReport.reportSummary.title") }}</span>
              </v-tooltip>
            </div>
          </v-col>

          <!-- DDS Reports -->
          <v-col cols="12" sm="6" md="3">
            <div class="stat-container">
              <div class="d-flex align-center">
                <span class="text-subtitle-2 font-weight-light mr-1">
                  {{ $t("blends.finalReport.reportSummary.totalDdsReports") }}
                </span>
                <v-tooltip bottom color="00BD73" max-width="500">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                      mdi-alert-circle
                    </v-icon>
                  </template>
                  <span>{{ $t("blends.finalReport.reportSummary.totalDdsReports") }}</span>
                </v-tooltip>
              </div>
              <div class="text-subtitle-1 font-weight-bold mt-2">{{ summaryReport?.totalDDSReports || 0 }}</div>
            </div>
          </v-col>

          <!-- Geofence Polygons -->
          <v-col cols="12" sm="6" md="3">
            <div class="stat-container">
              <div class="d-flex align-center">
                <span class="text-subtitle-2 font-weight-light mr-1">
                  {{ $t("blends.finalReport.reportSummary.totalGeofencePolygons") }}
                </span>
                <v-tooltip bottom color="00BD73" max-width="500">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                      mdi-alert-circle
                    </v-icon>
                  </template>
                  <span>{{ $t("blends.finalReport.reportSummary.totalGeofencePolygons") }}</span>
                </v-tooltip>
              </div>
              <div class="text-subtitle-1 font-weight-bold mt-2">{{ summaryReport?.totalPolygonProductionPlaces || 0
                }}</div>
            </div>
          </v-col>

          <!-- Geofence Points -->
          <v-col cols="12" sm="6" md="3">
            <div class="stat-container">
              <div class="d-flex align-center">
                <span class="text-subtitle-2 font-weight-light mr-1">
                  {{ $t("blends.finalReport.reportSummary.totalGeofencePoints") }}
                </span>
                <v-tooltip bottom color="00BD73" max-width="500">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                      mdi-alert-circle
                    </v-icon>
                  </template>
                  <span>{{ $t("blends.finalReport.reportSummary.totalGeofencePoints") }}</span>
                </v-tooltip>
              </div>
              <div class="text-subtitle-1 font-weight-bold mt-2">{{ summaryReport?.totalPointProductionPlaces || 0
                }}
              </div>
            </div>
          </v-col>

          <!-- Deforestation Assessments -->
          <v-col cols="12" sm="6" md="3">
            <div class="stat-container">
              <div class="d-flex align-center">
                <span class="text-subtitle-2 font-weight-light mr-1">
                  {{ $t("blends.finalReport.reportSummary.totalDeforestationAssessments") }}
                </span>
                <v-tooltip bottom color="00BD73" max-width="500">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                      mdi-alert-circle
                    </v-icon>
                  </template>
                  <span>{{ $t("blends.finalReport.reportSummary.totalDeforestationAssessments")
                    }}</span>
                </v-tooltip>
              </div>
              <div class="text-subtitle-1 font-weight-bold mt-2">{{ summaryReport?.totalDeforestationAssessments ||
                0
                }}</div>
            </div>
          </v-col>

          <!-- Risk Assessments -->
          <v-col cols="12" sm="6" md="3">
            <div class="stat-container">
              <div class="d-flex align-center">
                <span class="text-subtitle-2 font-weight-light mr-1">
                  {{ $t("blends.finalReport.reportSummary.totalRiskAssessments") }}
                </span>
                <v-tooltip bottom color="00BD73" max-width="500">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                      mdi-alert-circle
                    </v-icon>
                  </template>
                  <span>{{ $t("blends.finalReport.reportSummary.totalRiskAssessments") }}</span>
                </v-tooltip>
              </div>
              <div class="text-subtitle-1 font-weight-bold mt-2">{{ summaryReport?.totalRiskAssessments || 0 }}
              </div>
            </div>
          </v-col>

          <!-- Farms -->
          <v-col cols="12" sm="6" md="3">
            <div class="stat-container">
              <div class="d-flex align-center">
                <span class="text-subtitle-2 font-weight-light mr-1">
                  {{ $t("blends.finalReport.reportSummary.totalFarms") }}
                </span>
                <v-tooltip bottom color="00BD73" max-width="500">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                      mdi-alert-circle
                    </v-icon>
                  </template>
                  <span>{{ $t("blends.finalReport.reportSummary.totalFarms") }}</span>
                </v-tooltip>
              </div>
              <div class="text-subtitle-1 font-weight-bold mt-2">{{ summaryReport?.totalFarmCount || 0 }}</div>
            </div>
          </v-col>

          <!-- High Deforestation Farms -->
          <v-col cols="12" sm="6" md="3">
            <div class="stat-container">
              <div class="d-flex align-center">
                <span class="text-subtitle-2 font-weight-light mr-1">
                  {{ $t("blends.finalReport.reportSummary.totalHighDeforestationFarms") }}
                </span>
                <v-tooltip bottom color="00BD73" max-width="500">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                      mdi-alert-circle
                    </v-icon>
                  </template>
                  <span>{{ $t("blends.finalReport.reportSummary.totalHighDeforestationFarms")
                    }}</span>
                </v-tooltip>
              </div>
              <div class="text-subtitle-1 font-weight-bold mt-2">{{
                summaryReport?.totalHighDeforestationProductionPlaces
                || 0 }}</div>
            </div>
          </v-col>

          <!-- Low and Zero Risk Farms -->
          <v-col cols="12" sm="6" md="3">
            <div class="stat-container">
              <div class="d-flex align-center">
                <span class="text-subtitle-2 font-weight-light mr-1">
                  {{ $t("blends.finalReport.reportSummary.totalLowZeroRiskFarms") }}
                </span>
                <v-tooltip bottom color="00BD73" max-width="500">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                      mdi-alert-circle
                    </v-icon>
                  </template>
                  <span>{{ $t("blends.finalReport.reportSummary.totalLowZeroRiskFarms") }}</span>
                </v-tooltip>
              </div>
              <div class="text-subtitle-1 font-weight-bold mt-2">{{ summaryReport?.totalLowAndZeroRiskFarms || 0 }}
              </div>
            </div>
          </v-col>

          <!-- Total Area -->
          <v-col cols="12" sm="6" md="3">
            <div class="stat-container">
              <div class="d-flex align-center">
                <span class="text-subtitle-2 font-weight-light mr-1">
                  {{ $t("blends.finalReport.reportSummary.totalArea") }}
                </span>
              </div>
              <div class="text-subtitle-1 font-weight-bold mt-2">{{ summaryReport?.totalArea || 0 }}</div>
            </div>
          </v-col>

          <!-- Average Geofence Area -->
          <v-col cols="12" sm="6" md="3">
            <div class="stat-container">
              <div class="d-flex align-center">
                <span class="text-subtitle-2 font-weight-light mr-1">
                  {{ $t("blends.finalReport.reportSummary.averageGeofenceArea") }}
                </span>
              </div>
              <div class="text-subtitle-1 font-weight-bold mt-2">{{ summaryReport?.finalAverageGeofenceArea || 0 }}
              </div>
            </div>
          </v-col>

          <!-- High Risk Farm Area -->
          <v-col cols="12" sm="6" md="3">
            <div class="stat-container">
              <div class="d-flex align-center">
                <span class="text-subtitle-2 font-weight-light mr-1">
                  {{ $t("blends.finalReport.reportSummary.totalHighRiskFarmArea") }}
                </span>
                <v-tooltip bottom color="00BD73" max-width="500">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                      mdi-alert-circle
                    </v-icon>
                  </template>
                  <span>{{ $t("blends.finalReport.reportSummary.totalHighRiskFarmArea") }}</span>
                </v-tooltip>
              </div>
              <div class="text-subtitle-1 font-weight-bold mt-2">{{ summaryReport?.totalAreaHighRiskFarms || 0 }}
              </div>
            </div>
          </v-col>

          <!-- Low and Zero Risk Farm Area -->
          <v-col cols="12" sm="6" md="3">
            <div class="stat-container">
              <div class="d-flex align-center">
                <span class="text-subtitle-2 font-weight-light mr-1">
                  {{ $t("blends.finalReport.reportSummary.totalLowZeroRiskFarmArea") }}
                </span>
                <v-tooltip bottom color="00BD73" max-width="500">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                      mdi-alert-circle
                    </v-icon>
                  </template>
                  <span>{{ $t("blends.finalReport.reportSummary.totalLowZeroRiskFarmArea") }}</span>
                </v-tooltip>
              </div>
              <div class="text-subtitle-1 font-weight-bold mt-2">{{ summaryReport?.totalAreaLowAndZeroRiskFarms || 0
                }}</div>
            </div>
          </v-col>
        </v-row>
      </v-card>

      <!-- 4th card Blends Products -->
      <v-card elevation="0" class="pa-6 my-6">
        <div class="d-flex align-center mb-6">
          <h2 class="text-h6">
            {{ $t("blends.finalReport.blendProducts.title") }}
          </h2>
          <v-tooltip bottom color="00BD73" max-width="500">
            <template v-slot:activator="{ on, attrs }">
              <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                mdi-alert-circle
              </v-icon>
            </template>
            <span>{{ $t("blends.finalReport.reportSummary.totalLowZeroRiskFarmArea") }}</span>
          </v-tooltip>
        </div>

        <div v-for="(product, index) in blendProducts" :key="index" class="mb-8">
          <v-row class="mb-4">
            <v-col cols="12" md="4" class="d-flex align-center">
              <div>
                <div class="text-subtitle-2 font-weight-light mr-1">
                  {{ $t("blends.exemptProducts.product") }}
                  <v-tooltip bottom color="00BD73" max-width="500">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                        mdi-alert-circle
                      </v-icon>
                    </template>
                    <span>{{ $t("blends.finalReport.reportSummary.totalLowZeroRiskFarmArea")
                      }}</span>
                  </v-tooltip>
                </div>
                <div class="d-flex align-center">
                  <span>{{ product.name }}</span>
                </div>
              </div>
            </v-col>

            <v-col cols="12" md="4" class="d-flex align-center">
              <div>
                <div class="text-subtitle-2 font-weight-light mr-1">
                  {{ $t("blends.exemptProducts.subProduct") }}
                  <v-tooltip bottom color="00BD73" max-width="500">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                        mdi-alert-circle
                      </v-icon>
                    </template>
                    <span>{{ $t("blends.finalReport.reportSummary.totalLowZeroRiskFarmArea")
                      }}</span>
                  </v-tooltip>
                </div>
                <div class="d-flex align-center">
                  <span>{{ product.subProduct }}</span>
                </div>
              </div>
            </v-col>
          </v-row>

          <v-data-table :headers="headers" :items="product.products" hide-default-footer disable-pagination
            class="elevation-1 rounded" color="primary" :item-class="getRowClass">
            <!-- :class="{ 'eudr-exempt': product.details.status === 'EUDR Exempt' }" -->

            <template v-slot:item.internalReferenceNumber="{ item }">
                    {{ item.internalReferenceNumber ? item.internalReferenceNumber : '-' }}
            </template>
             <!-- Slot for Farms & Quantity -->
             <template v-slot:item.productNetMass="{ item }">
              {{ item.productionPlaceCount ? `${item.productionPlaceCount} Farms` : "N/A"
              }}<br>
              {{ item.productNetMass ? `${item.productNetMass +" "+ get_EUDR_Settings?.product_mass_unit} ` : "N/A" }}
          </template>
            <template v-slot:item.productType="{ item }">
              <v-btn small rounded min-width="200" depressed class="gray-button"
                  height="40" v-if="item.status == 'exempt'">
                  {{ $t("blends.createBlends.status.eudrExempt") }}
              </v-btn>

              <template v-else>
                  <v-btn small rounded min-width="200" depressed class="green-button"
                      height="40" v-if="item.status == 'Compliant'">
                      {{ $t("blends.createBlends.status.compliant") }}
                  </v-btn>
                  <v-btn small rounded min-width="200" depressed class="red-button"
                      height="40" v-else-if="item.status == 'Non-Compliant'">
                      {{ $t("blends.createBlends.status.nonCompliant") }}
                  </v-btn>
              </template>
          </template>
            <template v-slot:item.containerIds="{ item }">
              {{ (item?.containerIds && item?.containerIds.length > 0) ? item.containerIds[0] : '-' }}
            </template>
            <template v-slot:item.createdAt="{ item }">
              {{ getLocalTimeSlashFormat(item.createdAt) }}
            </template>
            <template v-slot:item.productDetail="{ item }">
              {{ item?.productDetail?.name }}
            </template>
          </v-data-table>
        </div>
      </v-card>

      <!-- <ProductionPlaceTable v-if="selectedDdsIds.length > 0 && productIds.length > 0" :ddsIds="selectedDdsIds" :productIds="productIds" /> -->

      <!-- container Id -->
      <v-card elevation="0" class="pa-6 my-6">
        <v-row>
          <v-col cols="12">
            <h3 class="font-weight-bold mb-2">
              {{ $t('blends.createBlends.containerInformation') }}
              <v-tooltip bottom color="00BD73" max-width="500">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                    mdi-alert-circle
                  </v-icon>
                </template>
                <span>{{ $t('blends.createBlends.containerInformation') }}</span>
              </v-tooltip>
            </h3>
          </v-col>

          <v-col cols="4">
            <div class="d-flex flex-column">
              <div class="d-flex align-center mb-2">
                <span class="text-subtitle-2 font-weight-bold">{{
                  $t('blends.createBlends.containerId')
                }}</span>
                <v-tooltip bottom color="00BD73" max-width="500">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon class="icon-with-background ml-1" style="color:#0EBF67" v-bind="attrs" v-on="on">
                      mdi-alert-circle
                    </v-icon>
                  </template>
                  <span>{{
                    $t('blends.createBlends.containerId')
                  }}</span>
                </v-tooltip>
              </div>

              <div class="d-flex">
                <p v-for="(container, index) in cotainerIds" :key="index">
                  <strong>{{ container.id }}</strong> &nbsp;
                </p>
              </div>

            </div>
          </v-col>
        </v-row>
      </v-card>


      <!-- 6th card section (Last section remaining)  -->
      <v-card class="px-4 py-3" elevation="0">
        <v-row>
          <v-col cols="12" class="d-flex align-center">
            <h2 class="text-h5 font-weight-medium">
              {{ $t("blends.finalReport.reportSummary.declarationStatement") }}
            </h2>
            <v-tooltip bottom color="primary" max-width="500">
              <template v-slot:activator="{ on, attrs }">
                <v-icon class="ml-2" color="#0EBF67" small v-bind="attrs" v-on="on">
                  mdi-alert-circle
                </v-icon>
              </template>
              <span>{{ $t("blends.finalReport.reportSummary.totalLowZeroRiskFarmArea") }}</span>
            </v-tooltip>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-card-text class="px-0 py-1">
              <div class="item-box" v-for="(declaration, i) in eudrSetting.declarations" :key="declaration.title">
                <span v-if="blendId">{{ `${userInfo?.firstName} ${userInfo?.lastName}, ${declaration.description}`
                  }}</span>
                <v-checkbox v-else v-model="declarationResponses[i].checked"
                  :label="`${userInfo?.firstName} ${userInfo?.lastName}, ${declaration.description}`"></v-checkbox>
              </div>
            </v-card-text>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
    <v-card elevation="0" class="px-4 py-3 mx-4 mb-6 justify-center items-center">
      <div class="d-flex my-3">
        <v-spacer></v-spacer>
        <div class="d-flex mt-1">
          <v-btn color="error" dark class="mr-2 font-weight-bold" @click="discard">
            {{ $t('blends.finalReport.buttons.discard') }}
          </v-btn>
          <v-btn color="yellow" dark class="mr-2 font-weight-bold" @click="rejectBlends">
            {{ $t('blends.finalReport.buttons.reject') }}
          </v-btn>
          <v-btn color="primary" dark class="mr-2 font-weight-bold" @click="$emit('closePreview')">
            {{ $t('blends.finalReport.buttons.edit') }}
          </v-btn>
          <v-btn v-if="isUpdate" color="primary" dark class="mr-2 font-weight-bold"
            @click="$emit('triggerSubmitUpdate')">
            {{ $t('blends.finalReport.buttons.update') }}
          </v-btn>
          <v-btn v-else color="primary" dark class="mr-2 font-weight-bold" @click="$emit('triggerSubmit')">
            {{ $t('blends.finalReport.buttons.finalize') }}
          </v-btn>
        </div>
      </div>
    </v-card>
    <DiscardDialog @close-modal="closeDiscardDialog" :dialog="discardDialog" />
  </div>
</template>

<script>

import { mapGetters } from "vuex";
import BlendService from '@/_services/BlendService'
import dateMixin from "@/mixins/DateMixin";
import loadingMixin from "@/mixins/LoadingMixin";
import { isEmpty } from "lodash";
import Vue from "vue";
import DiscardDialog from "./DiscardDialog.vue";
//import ProductionPlaceTable from "./ProductionPlaceTable.vue";

export default {
  components: {
    DiscardDialog,
   // ProductionPlaceTable
  },
  computed: {
    ...mapGetters("eudrSettings", ["get_EUDR_Settings"]),
    eudrSetting() {
      return this.get_EUDR_Settings;
    },
    userRole() {
      return this.$store.getters["eudrDDS/getDdsUserRole"];
    },
    supplier() {
      return this.userRole === "supplier_owner";
    },
    operator() {
      return this.userRole === "operator_owner";
    },
    userInfo() {
      return this.formData.userData;
    },
    containerData() {
      return this.cotainerIds?.map(res => res.id)?.join(', ')
    }
  },

  async mounted() {
    document.title = this.$t("dashboard");
    this.startLoading();
    this.loadResponsesFromLocalStorage();
  },
  props: {
    propFormData: {
      type: Object,
      required: true,
    },
    isUpdate: {
      type: Boolean,
      default: false,
    },
    cotainerIds: {
      type: Array,
      required: true
    },
    selectedDdsIds: {
      type: Array,
      required: true
    },
    blendStatus: {
      type: String,
      default: ''
    },
    blendProductsCreatePreview: {
      type: Array,
      default: () => []
    },
  },
  watch: {
    declarationResponses: {
      deep: true,
      handler() {
        this.saveResponsesToLocalStorage();
      },
    },
    propFormData: {
      async handler(newVal) {
        if (!isEmpty(newVal.blendSetting?.blendTitle)) {
          try{
            this.deepCloneReactive(this.formData, newVal);
          if (this.selectedDdsIds && this.selectedDdsIds.length > 0) {
            this.productIds = [
              ...new Set(
                (this.blendProductsCreatePreview || []).flatMap(product => product?.productId?.toString() || [])
              )
            ];
            await this.getSummary();
            this.setBlendProducts();
          }
          } catch (error) {
            console.log('Error in fetching summary report', error);
          } finally {
            this.stopLoading();
          }
        }
      },
      immediate: true,
      deep: true,
    },
  },

  data() {
    return {
      name: "Preview",
      reportStatus: null,
      reportStatusOptions: [],
      dueDiligenceReportStatus: '',
      containers: [],
      showActivityLog: false,
      declarations: {
        accuracy: false,
        compliance: false,
      },
      activityLogs: [],
      activityLogHeaders: [],
      headers: [
        { text: this.$t('blends.createBlends.table.eudrInternalRef'), value: 'internalReferenceNumber', sortable: true },
        { text: this.$t('blends.createBlends.table.containerId'), value: 'containerId', sortable: true },
        { text: this.$t('blends.createBlends.table.product'), value: 'productName', sortable: true },
        { text: this.$t('blends.createBlends.table.farmsQuantity'), value: 'productNetMass', sortable: false },
        { text: this.$t('blends.createBlends.table.submissionDate'), value: 'createdAt', sortable: false },
        { text: this.$t('blends.createBlends.table.dueDiligenceStatus'), value: 'productType', sortable: false },
      ],
      products: [],
      eudrSettings: {},
      isEnabled: false,
      declarationResponses: [
        {
          text: "[Name], hereby declare that all data submitted with this shipment is accurate to the best of my knowledge and belief.",
          checked: false,
        },
        {
          text: "I, [Name], affirm that I have visited the farms associated with this shipment and confirm their compliance with local laws and regulations regarding deforestation.",
          checked: false,
        },
      ],

      summaryReport: {
        totalFarmCount: '',
        totalDDSReports: '',
        totalPolygonProductionPlaces: '',
        totalPointProductionPlaces: '',
        totalArea: '',
        totalDeforestationAssessments: '',
        totalHighDeforestationProductionPlaces: '',
        totalLowAndZeroRiskFarms: '',
        totalAreaLowAndZeroRiskFarms: '',
        totalUnknownDeforestationProductionPlaces: '',
        totalRiskAssessments: '',
        finalAverageGeofenceArea: '',
        totalAreaHighRiskFarms: ''
      },
      blendId: this.$route.params.id,
      declearationFirstCheckbox: false,
      declearationSecondCheckbox: false,
      formData: {
        blendLotId: null,
        finishedProductLotId: null,
        netMass: null,
        volume: null,
        blendProducts: [],
        containerIds: [],
        countryOfEntry: '',
        blendSetting: {
          blendCode: null,
          blendDescription: null,
          blendTitle: null,
          finalProductCode: null,
          finalProductName: null,
          processType: null,
        }
      },
      previewReportData: {
        blendSetting: {
          blendTitle: '',
        },
      },
      blendProducts: [],
      discardDialog: false,
      productIds: []
    }
  },
  methods: {
    getRowClass(item) {
            return item.status === 'exempt' ? 'row-exempt' : 'row-default';
        },
    closeDiscardDialog() {
            this.discardDialog = false;
        },
    discard() {
            this.discardDialog = true;
        },
    deepCloneReactive(target, source) {
      Object.keys(source).forEach((key) => {
        if (typeof source[key] === 'object' && source[key] !== null) {
          if (!target[key]) Vue.set(target, key, {}); // Ensure target[key] exists reactively
          this.deepCloneReactive(target[key], source[key]); // Recursively clone
        } else {
          Vue.set(target, key, source[key]); // Set primitive values reactively
        }
      });
    },
    handleFinalize(isUpdate) {
      if (isUpdate) {
        this.$emit('triggerSubmitUpdate')
      }
      else {
        this.$emit('triggerSubmit')
      }
    },

    redirectListPage() {
      this.$router.push({
        name: "Blends",
      });
    },
    rejectBlends() {
     this.$router.push({
        name: "Blends",
      });
    },
    addContainer() {
      if (this.containers.length < 5) {
        this.containers.push({ id: '' });
      }
    },
    removeContainer(index) {
      if (this.containers.length > 1) {
        this.containers.splice(index, 1);
      }
    },
    getStatusColor(status) {
      switch (status?.toLowerCase()) {
        case 'Compliant':
          return '#b6e0c1' // or '#0EBF67'
        case 'non-compliant':
          return 'error' // or '#FF5252'
        default:
          return 'success'
      }
    },
    toggleActivityLog() {
      this.showActivityLog = !this.showActivityLog;
    },
    getStatusClass(status) {
      return {
        'status-chip--compliant': status.toLowerCase() === 'compliant',
        'status-chip--non-compliant': status.toLowerCase() === 'non-compliant',
        'status-chip--pending': status.toLowerCase() === 'pending'
      }
    },
    getNamedDeclaration(name) {
      return this.declarationResponses.map((declarationObj) =>
        declarationObj.text.replace('[Name]', name)
      );
    },

    async getSummary() {
      const ddrId = this.selectedDdsIds;
      if (!ddrId) return;

      try {
        const res = await BlendService.reportSummary(ddrId);
        this.summaryReport = res?.data?.findReportByDdrId
      } catch (err) {
        console.error('Error fetching sub-products:', err);
      }
    },

    loadResponsesFromLocalStorage() {
      const savedResponses = localStorage.getItem("declarationResponses");
      if (savedResponses) {
        try {
          this.declarationResponses = JSON.parse(savedResponses);
        } catch (error) {
          console.error("Failed to parse saved responses:", error);
        }
      }
    },
    saveResponsesToLocalStorage() {
      localStorage.setItem(
        "declarationResponses",
        JSON.stringify(this.declarationResponses)
      );
    },
    setBlendProducts() {
      this.blendProducts = this.blendProductsCreatePreview;
    },
  },
  mixins: [dateMixin, loadingMixin]
}
</script>

<style lang="scss" scoped>
::v-deep .row-exempt {
    background-color: #FFE8C5 !important;
}
.row-default {
    background-color: #ffffff;
}

.status-chip {
  min-width: 120px;
  justify-content: center;
  text-transform: capitalize;
}

.eudr-exempt {
  background-color: #FFF8E1 !important;
}

.v-data-table ::v-deep .v-data-table__wrapper>table>thead>tr>th {
  color: white !important;
  font-weight: 500;
}

.caption {
  font-size: 0.75rem;
}

.v-data-table ::v-deep td {
  white-space: pre-line;
}

.v-data-table {
  max-height: 500px;
  overflow-y: auto;
}

.activity-log-table {
  ::v-deep {
    .v-data-table__wrapper {
      overflow-y: auto;
      max-height: 20vh;
    }

    thead th {
      position: sticky !important;
      top: 0;
      z-index: 1;
      background-color: #007a4b !important;
      color: white !important;
      font-weight: 500;
    }

    tbody {
      tr {
        height: 48px !important;
      }

      tr:hover {
        cursor: pointer;
        background: rgba(0, 0, 0, 0.03);
      }
    }
  }
}

.icon-with-background {
  font-size: 18px;
}

.v-text-field {
  .v-input__control {
    min-height: 40px;
  }
}
</style>