<template>
    <div class="mx-4">
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div class="d-flex mb-4">
                <h2 class="font-weight-black">{{ $t('blends.blends') }}</h2>
                <v-spacer></v-spacer>
                <div class="d-flex mt-1">
                    <v-select
                        v-if="blend.blendStatus"
                        :clearable="false"
                        v-model="reportStatus"
                        outlined
                        dense
                        :items="reportStatusOptions"
                        :item-text="item => item"
                        :label="$t('blends.finalReport.reportStatus')"
                        :item-value="item => item"
                        variant="outlined"
                        density="compact"
                        hide-details
                        class="mr-2"
                        style="background-color: #EDEDED; width: 220px;"
                        @change="onReportStatusChange"
                    ></v-select>
                       <v-select
                        :items="[{value:'', name:'Select Option'},{value:'pdf', name:'Download As PDF'},{value:'json', name:'Download As JSON'},]"
                        item-text="name"
                        item-value="value"
                        @change="downloadFinalReport"
                        class="selectbox mr-3"
                        outlined
                        dense
                        :placeholder="$t('memberDataSection.download')"
                        ></v-select>

                    <v-btn color="error" dark class="mr-2 font-weight-bold" @click="discard">
                        {{ $t('blends.finalReport.buttons.discard') }}
                    </v-btn>
                    <v-btn color="primary" dark class="mr-2 font-weight-bold" @click="triggerSubmit">
                        {{ $t('blends.finalReport.buttons.submit') }}
                    </v-btn>
                    <!-- <v-btn color="primary" dark class="mr-2 font-weight-bold" @click="triggerSubmit">
                        {{ $t('blends.finalReport.buttons.uploadToEuPortal') }}
                    </v-btn> -->
                </div>
            </div>


            <!-- 1st card  -->
            <v-card elevation="0" class="my-6 pa-6">
                <v-row>
                    <v-col cols="3">
                        <div class="d-flex align-center mb-2">
                            <span class="text-subtitle-2 font-weight-light mr-1">{{ $t('blends.finalReport.blendTitle')
                                }}</span>
                            <v-tooltip bottom color="00BD73" max-width="500">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                        mdi-alert-circle
                                    </v-icon>
                                </template>
                                <span>{{ $t("dueDiligence.supplierTooltip") }}</span>
                            </v-tooltip>
                        </div>
                        <div class="text-subtitle-1 font-weight-bold">{{ blend?.blendSetting?.blendTitle }}</div>
                    </v-col>
                    <v-col cols="3">
                        <div class="d-flex align-center mb-2">
                            <span class="text-subtitle-2 font-weight-light mr-1">{{ $t('blends.finalReport.blendCode')
                                }}</span>
                            <v-tooltip bottom color="00BD73" max-width="500">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                        mdi-alert-circle
                                    </v-icon>
                                </template>
                                <span>{{ $t("blends.finalReport.blendCode") }}</span>
                            </v-tooltip>
                        </div>
                        <div class="text-subtitle-1 font-weight-bold">{{ blend?.blendSetting?.blendCode }}</div>
                    </v-col>
                    <v-col cols="3">
                        <div class="d-flex align-center mb-2">
                            <span class="text-subtitle-2 font-weight-light mr-1">{{
                                $t('blends.finalReport.finalProduct') }}</span>
                            <v-tooltip bottom color="00BD73" max-width="500">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                        mdi-alert-circle
                                    </v-icon>
                                </template>
                                <span>{{ $t('blends.finalReport.finalProduct') }}</span>
                            </v-tooltip>
                        </div>
                        <div class="text-subtitle-1 font-weight-bold">{{ blend?.blendSetting?.finalProductName }}</div>
                    </v-col>
                    <v-col cols="3">
                        <div class="d-flex align-center mb-2">
                            <span class="text-subtitle-2 font-weight-light mr-1">{{
                                $t('blends.finalReport.finalProductCode') }}</span>
                            <v-tooltip bottom color="00BD73" max-width="500">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                        mdi-alert-circle
                                    </v-icon>
                                </template>
                                <span>{{ $t("blends.finalReport.finalProductCode") }}</span>
                            </v-tooltip>
                        </div>
                        <div class="text-subtitle-1 font-weight-bold">{{ blend?.blendSetting?.finalProductCode }}</div>
                    </v-col>
                </v-row>

                <v-row class="mt-4">
                    <v-col cols="6">
                        <div class="d-flex align-center mb-2">
                            <span class="text-subtitle-2 font-weight-light mr-1">{{
                                $t('blends.finalReport.blendDescription') }}</span>
                            <v-tooltip bottom color="00BD73" max-width="500">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                        mdi-alert-circle
                                    </v-icon>
                                </template>
                                <span>{{ $t("blends.finalReport.blendDescription") }}</span>
                            </v-tooltip>
                        </div>
                        <div class="text-subtitle-1 font-weight-bold">{{ blend?.blendSetting?.blendDescription }}</div>
                    </v-col>
                    <!-- <v-col cols="6">
                        <div class="d-flex align-center mb-2">
                            <span class="text-subtitle-2 font-weight-light mr-1">{{ $t('blends.finalReport.processType')
                                }}</span>
                        </div>
                        <div class="text-subtitle-2 font-weight-bold">{{ blend?.blendSetting?.processType }}</div>
                    </v-col> -->
                </v-row>

                <v-row class="mt-4">
                    <v-col cols="3">
                        <div class="d-flex align-center mb-2">
                            <span class="text-subtitle-2 font-weight-light mr-1">{{ $t('blends.finalReport.netMass')
                                }}</span>
                            <v-tooltip bottom color="00BD73" max-width="500">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                        mdi-alert-circle
                                    </v-icon>
                                </template>
                                <span>{{ $t("blends.finalReport.netMass") }}</span>
                            </v-tooltip>
                        </div>
                        <div class="text-subtitle-1 font-weight-bold">{{ blend?.netMass }} {{
                            eudrSettings?.product_mass_unit }}</div>
                    </v-col>
                    <v-col cols="3">
                        <div class="d-flex align-center mb-2">
                            <span class="text-subtitle-2 font-weight-light mr-1">{{ $t('blends.finalReport.volume')
                                }}</span>
                            <v-tooltip bottom color="00BD73" max-width="500">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                        mdi-alert-circle
                                    </v-icon>
                                </template>
                                <span>{{ $t("blends.finalReport.volume") }}</span>
                            </v-tooltip>
                        </div>
                        <div class="text-subtitle-2 font-weight-bold">{{ blend?.volume }} {{ eudrSettings?.volume_unit
                            }}</div>
                    </v-col>
                    <v-col cols="3">
                        <div class="d-flex align-center mb-2">
                            <span class="text-subtitle-2 font-weight-light mr-1">{{ $t('blends.finalReport.blendLotId')
                                }}</span>
                            <v-tooltip bottom color="00BD73" max-width="500">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                        mdi-alert-circle
                                    </v-icon>
                                </template>
                                <span>{{ $t("blends.finalReport.blendLotId") }}</span>
                            </v-tooltip>
                        </div>
                        <div class="text-subtitle-1 font-weight-bold">{{ blend?.blendLotId }}</div>
                    </v-col>
                    <v-col cols="3">
                        <div class="d-flex align-center mb-2">
                            <span class="text-subtitle-2 font-weight-light mr-1">{{
                                $t('blends.finalReport.finalProductLotId') }}</span>
                            <v-tooltip bottom color="00BD73" max-width="500">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                        mdi-alert-circle
                                    </v-icon>
                                </template>
                                <span>{{ $t("blends.finalReport.finalProductLotId") }}</span>
                            </v-tooltip>
                        </div>
                        <div class="text-subtitle-1 font-weight-bold">{{ blend?.finishedProductLotId }}</div>
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
                                    <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                        mdi-alert-circle
                                    </v-icon>
                                </template>
                                <span>{{ $t("blends.finalReport.internalReferenceNumber") }}</span>
                            </v-tooltip>
                        </div>
                        <div class="text-subtitle-1 font-weight-bold">{{ blend?.internalReferenceNumber || 'N/A' }}
                        </div>
                    </v-col>
                    <v-col cols="6" md="3">
                        <div class="d-flex align-center mb-2">
                            <span class="text-subtitle-2 font-weight-light mr-1">{{
                                $t('blends.finalReport.eudrReferenceNumber')
                                }}</span>
                            <v-tooltip bottom color="00BD73" max-width="500">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                        mdi-alert-circle
                                    </v-icon>
                                </template>
                                <span>{{ $t("blends.finalReport.eudrReferenceNumber") }}</span>
                            </v-tooltip>
                        </div>
                        <div class="text-subtitle-1 font-weight-bold">{{ blend?.eudrReferenceNumber || 'N/A' }}</div>
                    </v-col>
                    <v-col cols="6" md="3">
                        <div class="d-flex align-center mb-2">
                            <span class="text-subtitle-2 font-weight-light mr-1">{{ $t('blends.finalReport.activity')
                                }}</span>
                        </div>
                        <div class="text-subtitle-1 font-weight-bold">{{ blend?.activity }}</div>
                    </v-col>
                    <v-col cols="6" md="3">
                        <div class="d-flex align-center mb-2">
                            <span class="text-subtitle-2 font-weight-light mr-1">{{
                                $t('blends.createBlends.countryOfActivity')
                                }}</span>
                        </div>
                        <div class="text-subtitle-1 font-weight-bold">
                            {{ 
                                typeof blend?.countryOfActivity === 'string' || blend?.countryOfActivity instanceof String ?
                                  JSON.parse(blend?.countryOfActivity).join(', ')
                                : 'N/A'  
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
                        <div class="text-subtitle-1 font-weight-bold">{{ blend?.countryOfEntry?.join(", ") || "N/A" }}
                        </div>
                    </v-col>
                    <v-col cols="6" md="3">
                        <div class="d-flex align-center mb-2">
                            <span class="text-subtitle-2 font-weight-light mr-1">{{
                                $t('blends.finalReport.dueDiligenceReportStatus') }}</span>
                        </div>
                        <div>
                            <v-btn small rounded min-width="200" depressed class="gray-button" height="40"
                                v-if="blend.blendStatus == 'pending'">
                                {{ $t("blends.createBlends.status.pending") }}
                            </v-btn>
                            <v-btn small rounded min-width="200" depressed class="red-button" height="40"
                                v-else-if="blend.blendStatus == 'non-compliant'">
                                {{ $t("blends.createBlends.status.nonCompliant") }}
                            </v-btn>
                            <v-btn small rounded min-width="200" depressed class="green-button" height="40"
                                v-else-if="blend.blendStatus == 'compliant'">
                                {{ $t("blends.createBlends.status.compliant") }}
                            </v-btn>
                            <v-btn small rounded min-width="200" depressed class="green-button" height="40"
                                v-else>
                                {{ $t("blends.createBlends.status.uploadToEudr") }} 
                                  
                            </v-btn>
                        </div>
                    </v-col>
                    <v-col cols="6" md="6">
                        <div class="d-flex align-center mb-2">
                            <span class="text-subtitle-2 font-weight-light mr-1">{{ $t('blends.finalReport.containerId')
                                }}</span>
                        </div>

                        <div class="text-subtitle-1 font-weight-bold">
                            <h3 style="color:black" class="mr-3" v-for="containerId in blend.containerIds"
                                v-bind:key="containerId.containerId">{{ containerId?.containerId }}</h3>
                        </div>
                    </v-col>
                </v-row>

                <v-row class="mt-3">
                    <v-col cols="12">
                        <div class="d-flex align-center">
                            <span class="font-weight-bold">{{ $t('blends.finalReport.operatorData') }}</span>
                            <v-tooltip bottom color="00BD73" max-width="500">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
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
                        <div class="text-subtitle-1 font-weight-bold">{{ userInfo?.firstName + ' ' + userInfo?.lastName
                            }}</div>
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
            <v-card elevation="0" class="pa-6">
                <v-row>
                    <!-- Header -->
                    <v-col cols="12">
                        <div class="font-weight-bold d-flex align-center">
                            {{ $t('blends.finalReport.reportSummary.title') }}
                            <v-tooltip bottom max-width="500">
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
                                        <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                                            v-on="on">
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
                                        <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                                            v-on="on">
                                            mdi-alert-circle
                                        </v-icon>
                                    </template>
                                    <span>{{ $t("blends.finalReport.reportSummary.totalGeofencePolygons") }}</span>
                                </v-tooltip>
                            </div>
                            <div class="text-subtitle-1 font-weight-bold mt-2">{{
                                summaryReport?.totalPolygonProductionPlaces || 0 }}</div>
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
                                        <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                                            v-on="on">
                                            mdi-alert-circle
                                        </v-icon>
                                    </template>
                                    <span>{{ $t("blends.finalReport.reportSummary.totalGeofencePoints") }}</span>
                                </v-tooltip>
                            </div>
                            <div class="text-subtitle-1 font-weight-bold mt-2">{{
                                summaryReport?.totalPointProductionPlaces || 0
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
                                        <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                                            v-on="on">
                                            mdi-alert-circle
                                        </v-icon>
                                    </template>
                                    <span>{{ $t("blends.finalReport.reportSummary.totalDeforestationAssessments")
                                        }}</span>
                                </v-tooltip>
                            </div>
                            <div class="text-subtitle-1 font-weight-bold mt-2">{{
                                summaryReport?.totalDeforestationAssessments || 0}}</div>
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
                                        <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                                            v-on="on">
                                            mdi-alert-circle
                                        </v-icon>
                                    </template>
                                    <span>{{ $t("blends.finalReport.reportSummary.totalRiskAssessments") }}</span>
                                </v-tooltip>
                            </div>
                            <div class="text-subtitle-1 font-weight-bold mt-2">{{ summaryReport?.totalRiskAssessments || 0}}
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
                                        <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                                            v-on="on">
                                            mdi-alert-circle
                                        </v-icon>
                                    </template>
                                    <span>{{ $t("blends.finalReport.reportSummary.totalFarms") }}</span>
                                </v-tooltip>
                            </div>
                            <div class="text-subtitle-1 font-weight-bold mt-2">{{ summaryReport?.totalFarmCount || 0
                                }}</div>
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
                                        <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                                            v-on="on">
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
                                        <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                                            v-on="on">
                                            mdi-alert-circle
                                        </v-icon>
                                    </template>
                                    <span>{{ $t("blends.finalReport.reportSummary.totalLowZeroRiskFarms") }}</span>
                                </v-tooltip>
                            </div>
                            <div class="text-subtitle-1 font-weight-bold mt-2">{{
                                summaryReport?.totalLowAndZeroRiskFarms || 0
                                }}
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
                            <div class="text-subtitle-1 font-weight-bold mt-2">{{ summaryReport?.totalArea || 0 }}
                            </div>
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
                            <div class="text-subtitle-1 font-weight-bold mt-2">{{
                                summaryReport?.finalAverageGeofenceArea || 'N/A'
                                }}
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
                                        <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                                            v-on="on">
                                            mdi-alert-circle
                                        </v-icon>
                                    </template>
                                    <span>{{ $t("blends.finalReport.reportSummary.totalHighRiskFarmArea") }}</span>
                                </v-tooltip>
                            </div>
                            <div class="text-subtitle-1 font-weight-bold mt-2">{{ summaryReport?.totalAreaHighRiskFarms
                                || 0 }}
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
                                        <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                                            v-on="on">
                                            mdi-alert-circle
                                        </v-icon>
                                    </template>
                                    <span>{{ $t("blends.finalReport.reportSummary.totalLowZeroRiskFarmArea") }}</span>
                                </v-tooltip>
                            </div>
                            <div class="text-subtitle-1 font-weight-bold mt-2">{{
                                summaryReport?.totalAreaLowAndZeroRiskFarms || 0 }}</div>
                        </div>
                    </v-col>
                </v-row>
            </v-card>

            <!-- 4th card Blends Products -->
            <v-card class="pa-6 my-6" elevation="0">
                <div class="d-flex align-center mb-6">
                    <h2 class="text-h6">
                        {{ $t("blends.finalReport.blendProducts.title") }}
                    </h2>
                    <v-tooltip bottom color="00BD73" max-width="500">
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
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
                                            <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                                                v-on="on">
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
                                            <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                                                v-on="on">
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

                        <!-- <v-col cols="12" md="4" class="d-flex align-center">
                            <div>
                                <div class="text-subtitle-2 font-weight-light mr-1">
                                    {{ $t("blends.createBlends.country") }}
                                    <v-tooltip bottom color="00BD73" max-width="500">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                                                v-on="on">
                                                mdi-alert-circle
                                            </v-icon>
                                        </template>
                                        <span>{{ $t("blends.finalReport.reportSummary.totalLowZeroRiskFarmArea")
                                            }}</span>
                                    </v-tooltip>
                                </div>
                                <div class="d-flex align-center">
                                    <span>{{ product.country }}</span>
                                </div>
                            </div>
                        </v-col> -->
                    </v-row>

                    <v-data-table :headers="headers" :items="product.exemptProduct" hide-default-footer
                        disable-pagination class="elevation-1 rounded" color="primary" :item-class="getRowClass">
                        <!-- :class="{ 'eudr-exempt': product.details.status === 'EUDR Exempt' }" -->
                        <template v-slot:item.internalReferenceNumber="{ item }">
                            {{ item.internalReferenceNumber ? item.internalReferenceNumber : '-' }}
                        </template>

                        <!-- Slot for Farms & Quantity -->
                        <template v-slot:item.productNetMass="{ item }">
                            {{ item.productionPlaceCount ? `${item.productionPlaceCount} Farms` : "N/A"
                            }}<br>
                            {{ item.productNetMass ? `${item.productNetMass} kg` : "N/A" }}
                        </template>
                        <template v-slot:item.productType="{ item }">
                            <v-btn small rounded min-width="200" depressed class="gray-button" height="40"
                                v-if="item.status == 'exempt'">
                                {{ $t("blends.createBlends.status.eudrExempt") }}
                            </v-btn>

                            <template v-else>
                                <v-btn small rounded min-width="200" depressed class="green-button" height="40"
                                    v-if="item.status == 'Compliant'">
                                    {{ $t("blends.createBlends.status.compliant") }}
                                </v-btn>
                                <v-btn small rounded min-width="200" depressed class="red-button" height="40"
                                    v-else-if="item.status == 'Non-Compliant'">
                                    {{ $t("blends.createBlends.status.nonCompliant") }}
                                </v-btn>
                            </template>
                        </template>
                        <template v-slot:item.containerId="{ item }">
                            {{ (item?.containerId && item?.containerId?.length > 0) ? item?.containerId[0]?.containerId
                            : '-' }}
                        </template>
                        <template v-slot:item.createdAt="{ item }">
                            {{ getLocalTimeSlashFormat(item.createdAt) }}
                        </template>
                    </v-data-table>
                </div>
            </v-card>

            <!-- production places table and all -->


            <!-- <ProductionPlaceTable v-if="ddrId.length > 0" :ddsIds="ddrId" :productIds="productIds" /> -->


            <!-- 5th card Activity Log -->
            <!-- <v-card class="pa-6 my-6" elevation="1">
                <div class="d-flex align-center">
                    <h2 class="text-h6">
                        {{ $t("blends.finalReport.activityLog.title") }}
                    </h2>
                    <v-tooltip bottom color="primary" max-width="500">
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon class="ml-2" color="#0EBF67" small v-bind="attrs" v-on="on">
                                mdi-alert-circle
                            </v-icon>
                        </template>
                        <span>{{ $t("blends.finalReport.reportSummary.totalLowZeroRiskFarmArea") }}</span>
                    </v-tooltip>

                    <div class="ml-auto" @click="toggleActivityLog">
                        <v-btn v-if="showActivityLog" class="mx-2" fab small outlined color="primary">
                            <v-icon dark>
                                mdi-chevron-up
                            </v-icon>
                        </v-btn>
                        <v-btn v-else class="mx-2" fab small outlined color="primary">
                            <v-icon dark>
                                mdi-chevron-down
                            </v-icon>
                        </v-btn>
                    </div>
                </div>

                <v-data-table v-show="showActivityLog" :headers="activityLogHeaders" :items="activityLogs"
                    :items-per-page="5" class="elevation-1 rounded activity-log-table" single-expand height="20vh">
                </v-data-table>
            </v-card> -->

            <!-- 6th card section (Last section remaining)  -->
            <v-card class="px-4 py-3 my-6" elevation="0">
                <v-row>
                    <v-col cols="12" class="d-flex align-center">
                        <h2 class="text-h5 font-weight-medium">
                            {{ $t("blends.finalReport.reportSummary.declarationStatement") }}
                        </h2>
                        <!-- tooltip added -->
                        <v-tooltip bottom max-width="500">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon class="ml-2" color="#0EBF67" small v-bind="attrs" v-on="on">
                                    mdi-alert-circle
                                </v-icon>
                            </template>
                            <span>{{ $t("dueDiligence.supplierTooltip") }}</span>
                        </v-tooltip>
                    </v-col>
                </v-row>

                <v-row class="mt-2">
                    <v-col cols="12" md="4">
                        <v-card-text class="px-0 py-1">
                            <div class="text-caption">
                                {{ $t("blends.finalReport.declaration.name") }}
                            </div>
                            <div class="text-subtitle-2 font-weight-medium">{{ `${userInfo?.firstName}
                                ${userInfo?.lastName}` }}</div>
                        </v-card-text>
                    </v-col>

                    <v-col cols="12" md="4">
                        <v-card-text class="px-0 py-1">
                            <div class="text-caption">
                                {{ $t("blends.finalReport.declaration.address") }}
                            </div>
                            <div class="text-subtitle-2 font-weight-medium">{{ userInfo?.address || '-' }}</div>
                        </v-card-text>
                    </v-col>

                    <v-col cols="12" md="4">
                        <v-card-text class="px-0 py-1">
                            <div class="text-caption">
                                {{ $t("blends.finalReport.activityLog.dateTime") }}
                            </div>
                            <div class="text-subtitle-2 font-weight-medium">{{ createdDate || '-' }}</div>
                        </v-card-text>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="12">
                        <v-card-text class="px-0 py-1">
                            <v-card-text class="px-0 py-1">
                                <div class="item-box" v-for="declaration in eudrSettings?.declarations"
                                    :key="declaration.title">
                                    <span>{{ `${userInfo?.firstName} ${userInfo?.lastName}, ${declaration.description}`
                                        }}</span>
                                </div>
                            </v-card-text>
                        </v-card-text>
                    </v-col>
                </v-row>
            </v-card>
        </v-container>
        <DiscardDialog @close-modal="closeDiscardDialog" :dialog="discardDialog" />
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import BlendService from "@/_services/BlendService";
import loadingMixin from "@/mixins/LoadingMixin";
import DiscardDialog from "./components/DiscardDialog.vue";
//import ProductionPlaceTable from "./components/ProductionPlaceTable.vue";
import moment from "moment";
import { isNaN } from "lodash";
import UnitService from "@/_services/UnitService";
import dateMixin from "@/mixins/DateMixin";
import DownloadMixin from "@/mixins/DownloadMixin";

export default {
    computed: {
        ...mapGetters("eudrSettings", ["get_EUDR_Settings"]),
        eudrSettings() {
            return this.get_EUDR_Settings;
        },
        userInfo() {
            return this.blend?.userData;
        },
        createdDate() {
            return moment(this.blend?.createdAt).format('DD/MM/YYYY | h:mm A');
        },
    },
    components: {
        DiscardDialog,
        //ProductionPlaceTable
    },
    async mounted() {
        document.title = this.$t("dashboard");
        await this.fetchData();
        this.getSummary();
        const upperCaseStatus =
            this.blend.blendStatus === "compliant"
                ? this.$t("blends.createBlends.status.compliant")
                : this.blend.blendStatus === "non-compliant"
                    ? this.$t("blends.createBlends.status.nonCompliant")
                    : null;

        this.reportStatusOptions = [
            upperCaseStatus,
            ...this.reportStatusOptions,
        ];
        this.reportStatus = upperCaseStatus;
    },
    data() {
        return {
            blendId: this.$route.params.id || 0,
            blend: {
                blendLotId: null,
                finishedProductLotId: null,
                netMass: null,
                volume: null,
                blendProducts: [],
                containerIds: [],
                blendSetting: {
                    blendCode: null,
                    blendDescription: null,
                    blendTitle: null,
                    finalProductCode: null,
                    finalProductName: null,
                    processType: null,
                },
                blendStatus:'',
            },
            blendProducts: [],
            countries: [],
            containers: [{ id: '' }],
            selectedCountry: ["Nepal"],
            breadcrumbs: [
                {
                    text: this.$t("blends.createBlends.eudrDueDiligence"),
                    disabled: false,
                    to: '',
                    exact: true,
                },
                {
                    text: this.$t("blends.imports.blends"),
                    disabled: false,
                    to: { name: "Blends" },
                    exact: true,
                },
                {
                    text: this.$t("blends.createBlendDds"),
                    disabled: true,
                    to: "/",
                },
            ],
            reportStatusOptions: [this.$t("blends.createBlends.status.uploadToEudr")],
            reportStatus: '',
            headers: [
                { text: this.$t('blends.createBlends.table.eudrInternalRef'), value: 'internalReferenceNumber', sortable: true },
                { text: this.$t('blends.createBlends.table.containerId'), value: 'containerId', sortable: true },
                { text: this.$t('blends.createBlends.table.product'), value: 'productName', sortable: true },
                { text: this.$t('blends.createBlends.table.farmsQuantity'), value: 'productNetMass', sortable: false },
                { text: this.$t('blends.createBlends.table.submissionDate'), value: 'createdAt', sortable: false },
                { text: this.$t('blends.createBlends.table.dueDiligenceStatus'), value: 'productType', sortable: false },
            ],
            products: [
                {
                    product: '0902 - Coffee, whether or not',
                    subProduct: '090201 Coffee Roasted',
                    country: 'Brazil',
                    details: {
                        reference: 'DD-00452\nBL123456',
                        containerId: 'CTN-20240913-001',
                        product: 'Coffee',
                        farmsQuantity: '10 Farms\n15000 kg',
                        submissionDate: '10/01/2025',
                        status: 'Compliant'
                    }
                },
                {
                    product: '0902 - Coffee, whether or not',
                    subProduct: '090201 Coffee Roasted',
                    country: 'Peru',
                    details: {
                        reference: 'DD-00452\nBL123456',
                        containerId: 'CTN-20240913-001',
                        product: 'Coffee',
                        farmsQuantity: '10 Farms\n15000 kg',
                        submissionDate: '10/01/2025',
                        status: 'Compliant'
                    }
                },
                {
                    product: '0902 - Coffee, whether or not',
                    subProduct: '090201 Coffee Roasted',
                    country: 'Colombia',
                    details: {
                        reference: 'NL-009462',
                        containerId: 'CTN-20240913-001',
                        product: 'Coffee',
                        farmsQuantity: '15000 kg',
                        submissionDate: '20/10/2024',
                        status: 'EUDR Exempt'
                    }
                }
            ],
            activityLogHeaders: [
                {
                    text: this.$t('blends.finalReport.activityLog.user'),
                    align: 'start',
                    value: 'user',
                    class: 'secondary white--text'
                },
                {
                    text: this.$t('blends.finalReport.activityLog.userRole'),
                    value: 'userRole',
                    class: 'secondary white--text'
                },
                {
                    text: 'IP Address',
                    value: 'ipAddress',
                    class: 'secondary white--text'
                },
                {
                    text: 'Date & Time',
                    value: 'dateTime',
                    class: 'secondary white--text'
                },
                {
                    text: 'Segment',
                    value: 'segment',
                    class: 'secondary white--text'
                },
                {
                    text: 'Activity Description',
                    value: 'activityDescription',
                    class: 'secondary white--text'
                },
                {
                    text: '',
                    value: 'data-table-expand'
                }
            ],
            activityLogs: [
                {
                    user: 'John Doe',
                    userRole: 'Operator',
                    ipAddress: '192.168.32.15',
                    dateTime: '12/01/2024 | 05:00 PM',
                    segment: 'Edit Report',
                    activityDescription: '-',
                    additionalDetails: 'Modified report content',
                    changesMade: 'Updated farm details',
                    previousValue: '10 Farms',
                    newValue: '12 Farms'
                },
                {
                    user: 'Mathew Williams',
                    userRole: 'Operator',
                    ipAddress: '192.168.32.15',
                    dateTime: '12/01/2024 | 05:00 PM',
                    segment: 'Generate Report',
                    activityDescription: '-',
                    additionalDetails: 'Generated final report',
                    changesMade: 'Created new report version',
                    previousValue: 'v1.0',
                    newValue: 'v1.1'
                },
                {
                    user: 'John Doe',
                    userRole: 'Operator',
                    ipAddress: '192.168.32.15',
                    dateTime: '12/01/2024 | 05:00 PM',
                    segment: 'Edit Report',
                    activityDescription: '-',
                    additionalDetails: 'Modified report content',
                    changesMade: 'Updated farm details',
                    previousValue: '10 Farms',
                    newValue: '12 Farms'
                },
                {
                    user: 'Mathew Williams',
                    userRole: 'Operator',
                    ipAddress: '192.168.32.15',
                    dateTime: '12/01/2024 | 05:00 PM',
                    segment: 'Generate Report',
                    activityDescription: '-',
                    additionalDetails: 'Generated final report',
                    changesMade: 'Created new report version',
                    previousValue: 'v1.0',
                    newValue: 'v1.1'
                },
                {
                    user: 'John Doe',
                    userRole: 'Operator',
                    ipAddress: '192.168.32.15',
                    dateTime: '12/01/2024 | 05:00 PM',
                    segment: 'Edit Report',
                    activityDescription: '-',
                    additionalDetails: 'Modified report content',
                    changesMade: 'Updated farm details',
                    previousValue: '10 Farms',
                    newValue: '12 Farms'
                },
                {
                    user: 'Mathew Williams',
                    userRole: 'Operator',
                    ipAddress: '192.168.32.15',
                    dateTime: '12/01/2024 | 05:00 PM',
                    segment: 'Generate Report',
                    activityDescription: '-',
                    additionalDetails: 'Generated final report',
                    changesMade: 'Created new report version',
                    previousValue: 'v1.0',
                    newValue: 'v1.1'
                },
                {
                    user: 'John Doe',
                    userRole: 'Operator',
                    ipAddress: '192.168.32.15',
                    dateTime: '12/01/2024 | 05:00 PM',
                    segment: 'Edit Report',
                    activityDescription: '-',
                    additionalDetails: 'Modified report content',
                    changesMade: 'Updated farm details',
                    previousValue: '10 Farms',
                    newValue: '12 Farms'
                },
                {
                    user: 'Mathew Williams',
                    userRole: 'Operator',
                    ipAddress: '192.168.32.15',
                    dateTime: '12/01/2024 | 05:00 PM',
                    segment: 'Generate Report',
                    activityDescription: '-',
                    additionalDetails: 'Generated final report',
                    changesMade: 'Created new report version',
                    previousValue: 'v1.0',
                    newValue: 'v1.1'
                },
                // Add more activity log entries as needed
            ],
            showActivityLog: true,
            declarations: {
                accuracy: false,
                compliance: false,
            },
            discardDialog: false,
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
            ddrId: [],
            productIds: []
        }
    },
    methods: {
        async onReportStatusChange(selectedValue){
            let result
            if(selectedValue===this.$t('blends.createBlends.status.uploadToEudr')){
                this.reportStatusOptions = [
                    selectedValue,
                    ...this.reportStatusOptions,
                ];
                this.reportStatus = selectedValue;
                
                result = selectedValue.replace(/\s+/g, '-').toLowerCase();
                this.blend.blendStatus = result
            }else {
                this.reportStatusOptions = [
                selectedValue,
                    ...this.reportStatusOptions,
                ];
                result=selectedValue
                this.reportStatus = selectedValue;
                this.blend.blendStatus = selectedValue.toLowerCase()
                
            }
        },
        getRowClass(item) {
            return item.type === 'exempt' ? 'row-exempt' : 'row-default';
        },
        closeDiscardDialog() {
            this.discardDialog = false;
        },
        discard() {
            this.discardDialog = true;
        },
        async getListBlendProducts(filterData){
            const filter = {
                productId: filterData.productId,
                subProductId: filterData.subProductId,
            }
            const { data } = await BlendService.listBlendProducts({ filter });
            this.blendProducts.map((product) => {
                product.exemptProduct.map((exemptProduct) => {
                    const ddr = data?.blendProducts?.rows.find((row) => row.id === exemptProduct.id);
                    if (ddr) {
                        exemptProduct.productNetMass = UnitService.fromBase.weight(
                            this.eudrSettings.product_mass_unit,
                            parseFloat(ddr.productNetMass)
                        ), 
                        exemptProduct.productionPlaceCount = ddr.productionPlaceCount;
                    }
                });
            });
        },
        async fetchData() {
            if (!this.blendId) return;
            this.startLoading();
            try {
                const { data } = await BlendService.getBlendById(this.blendId);
                this.blendProducts = data.blend.blendProducts;
                this.blend = data.blend;
                this.productIds = [...new Set(this.blend.blendProducts.flatMap(product => product?.product?.id || []))];
                this.blend.netMass= parseFloat(UnitService.fromBase.weight(this.get_EUDR_Settings.product_mass_unit,this.blend.netMass));
                this.blend.volume= parseFloat(UnitService.fromBase.volume(this.get_EUDR_Settings.volume_unit,this.blend.volume));
                if (data?.blend?.blendProducts && Array.isArray(data.blend.blendProducts)) {
                    try {
                        this.blendProducts = Object.values(
                            data.blend.blendProducts.reduce((acc, item) => {
                                const productName = item?.product?.name;
                                const subProductName = item?.subProduct?.name;
                                if (!productName || !subProductName) {
                                    console.log("Invalid product or subProduct data found", item);
                                    return acc;
                                }
                                const key = `${productName}-${subProductName}-${item?.index}`;

                                if (!acc[key]) {
                                    acc[key] = {
                                        name: productName,
                                        productId: item?.product?.id,
                                        subProduct: subProductName,
                                        subProductId: item?.subProduct?.id,
                                        exemptProduct: []
                                    };
                                }
                                if (item?.ddr) {
                                    acc[key].exemptProduct.push({
                                        id: item?.ddr?.id,
                                        productName: item?.ddr?.product_detail?.name,
                                        internalReferenceNumber: item?.ddr?.internalReferenceNumber,
                                        containerId: null,
                                        productNetMass: '',
                                        productionPlaceCount: '',
                                        selected: true,
                                        status: item?.ddr?.status,
                                        type: 'dds',
                                        createdAt: item?.ddr?.createdAt
                                    });
                                }
                                if (item?.exemptProduct) {
                                    acc[key].exemptProduct.push({
                                        id: item?.exemptProduct?.id,
                                        productName: item?.exemptProduct?.productDetail?.name,
                                        internalReferenceNumber: item?.exemptProduct?.internalReferenceNumber,
                                        containerId: item?.exemptProduct?.containerIds,
                                        productNetMass: '',
                                        productionPlaceCount: '',
                                        selected: true,
                                        status: 'exempt',
                                        type: 'exempt',
                                        createdAt: item?.exemptProduct?.createdAt
                                    });
                                }
                                return acc;
                            }, {})
                        );
                        this.blendProducts.forEach(res=>{
                            this.getListBlendProducts(res)
                        })
                    } catch (error) {
                        console.error("Error processing blendProducts data:", error);
                        this.blendProducts = [];
                    }
                } else {
                    console.warn("Invalid or missing blendProducts data");
                    this.blendProducts = [];
                }
            }
            catch (error) {
                console.error(error);
                this.$notify({
                    title: this.$t("blends.exemptProducts.unExpectedErrorMsg"),
                    type: "error",
                });
            } finally {
                this.stopLoading();
            }
        },
        downloadFinalReport(downloadType) {
            if (downloadType == 'pdf') {
                this.startLoading()
                this.downloadSourceFile(`${process.env.VUE_APP_DEFORESTRATION_REPORTING_API_BASE_URL}/blend-report/blend-pdf/${this.blendId}`,"application/pdf", "dds-final-report.pdf")
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
            const data = await BlendService.getBlendFinalReportJson(this.blendId)
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
            const reportDownloadElement = document.createElement("a");
            reportDownloadElement.setAttribute("href", dataStr);
            reportDownloadElement.setAttribute("download", `blend-report-${this.blendId}.json`);
            document.body.appendChild(reportDownloadElement);
            reportDownloadElement.click();
            reportDownloadElement.remove();
        },
        redirectListPage() {
            this.$router.push({
                name: "Blends",
            });
        },
        rejectBlends() {
            // Add implementation
        },
        saveAndContinueLater() {
            // Add implementation
        },
        async triggerSubmit() {
            await BlendService.updatedBlendDds({id:parseInt(this.blendId, 10), blendStatus:this.blend.blendStatus});

            this.$notify({
                type: 'success',
                title: this.$t("blends.createBlends.blendSavedSuccessfully"),
            })
            this.$router.push({
                name: "Blends"
            })
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
            switch (status.toLowerCase()) {
                case 'compliant':
                    return '#0EBF67' // Green
                case 'non-compliant':
                    return '#FF5757' // Red
                case 'pending':
                    return '#FFA726' // Orange
                default:
                    return '#757575' // Grey
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
        editBlendsRedirect() {
            this.$router.push({
                name: "editBlends",
                params: { id: this.blendId },
            });
        },
        async getSummary() {
            this.ddrId = this.blend.blendProducts
                .map((product) =>
                    product.ddr !== null ? parseInt(product.ddr.id) : null
                )
                .filter((id) => id != null && !isNaN(id));

            if (!this.ddrId) return;

            try {
                const res = await BlendService.reportSummary(this.ddrId.flat());
                this.summaryReport = res?.data?.findReportByDdrId
            } catch (err) {
                console.error('Error fetching sub-products:', err);
            }
        },
    },
    mixins: [dateMixin, loadingMixin,DownloadMixin]
};
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

.icon-with-background primary--text {
    font-size: 18px;
}

.v-text-field {
    .v-input__control {
        min-height: 40px;
    }
}
</style>