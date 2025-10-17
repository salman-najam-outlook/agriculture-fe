<template>
    <div>
        <ShowReportPublishDate :report="report" v-if="report && report.blockchainPublishDate"/>
        {{report.blockchainPublishDate}}
        <v-container fluid>
            <div class="cmt-box">
                <v-card elevation="0">
                    <v-card class="mb-5" flat>
                        <v-card-text>
                            <v-row class="pl-3">
                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2">
                                          {{ isKenyaClient ? $t("deforestation.internalRefNoKenya"):  $t("deforestation.internalReferenceNumber")  }}
                                          <v-tooltip top color="00BD73" max-width="350">
                                            <template v-slot:activator="{ on, attrs }">
                                              <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                                mdi-alert-circle
                                              </v-icon>
                                            </template>
                                            <span>{{ $t('dueDiligence.fRinternalReferenceNumberTT') }}</span>
                                          </v-tooltip>
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold">{{
                                            this.report.internalReferenceNumber || '-' }}</p>

                                    </div>
                                </v-col>

                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2">
                                          {{ $t("deforestation.eudr_reference_number") }}
                                          <v-tooltip top color="00BD73" max-width="350">
                                            <template v-slot:activator="{ on, attrs }">
                                              <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                                mdi-alert-circle
                                              </v-icon>
                                            </template>
                                            <span>{{ $t('dueDiligence.eudrRefNoTT') }}</span>
                                          </v-tooltip>
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold">{{ this.report.EUDRReferenceNumber
                                            || '-' }}</p>
                                    </div>
                                </v-col>

                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2">  {{ $t('deforestation.activity')}}</p>
                                        <p class="text-subtitle-1 font-weight-bold">
                                            {{ this.report.activity == "Domestic" ? $t('dueDiligence.domestic') 
                                                : this.report.activity == "Import" ? $t('dueDiligence.import') 
                                                : this.report.activity == "Export" ? $t('dueDiligence.export') 
                                                : '-' }}
                                        </p>

                                    </div>
                                </v-col>

                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2">  {{ $t('deforestation.operatorCountryOfActivity')}}
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold">{{ $t(report?.countryOfActivity?.length ? report?.countryOfActivity?.join(', ') :
                                            '-') }}</p>

                                    </div>
                                </v-col>

                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2">  {{ $t('dueDiligence.countryOfProduction')}} 
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold">
                                            {{ $t(report?.countryOfProduction[0] || '-') }}
                                        </p>
                                    </div>
                                </v-col>

                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2">  {{ $t('deforestation.countryOfEntry')}} 
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold">{{ $t(this.report.countryOfEntry ||
                                            '-') }}</p>

                                    </div>
                                </v-col>

                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2">  {{ $t('dueDiligence.dueDiligenceReportStatus')}}
                                        </p>
                                        <v-chip variant="elevated" :color="getStatusColor" outlined>
                                            {{ getTranslatedStatus(this.diligenceStatus || this.report.status) }}
                                        </v-chip>
                                    </div>
                                </v-col>
                                <v-col sm="3">
                                <div class="item-box">
                                    <p class="text-subtitle-1 mb-2">
                                        {{ isKenyaClient ? $t('dueDiligence.lotId') :  $t('blends.createBlends.containerId')  }}
                                    </p>
                                    <p class="text-subtitle-1 font-weight-bold">

                                        {{ this.report?.containerId ? (this.report?.containerId?.length > 0 ? this.report?.containerId?.join(", ") : '-') : '-' }}
                                    </p>
                                </div>
                            </v-col>
                            </v-row>

                           <FinalReportOperatorSupplier v-bind:report="report"/>


                        </v-card-text>
                    </v-card>
                </v-card>

                <v-card elevation="0" class="mb-5" v-if="report.transactionHash">
                    <v-card-text>
                        <v-row class="my-5 pl-3">
                            <v-col cols="6" class="right-border-light">
                                <v-row>
                                    <v-col cols="12">
                                        <div class="item-box">
                                            <h2 class="font-weight-bold">
                                                {{$t('dueDiligence.blockchainVerification')}}
                                            <v-tooltip top color="00BD73" max-width="350">
                                                <template v-slot:activator="{ on, attrs }">
                                                <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                                    mdi-alert-circle
                                                </v-icon>
                                                </template>
                                                <span>{{$t('dueDiligence.blockchainVerification')}}</span>
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
                                                <v-icon color="primary">mdi-download</v-icon>&nbsp;<span>{{ $t('dueDiligence.downloadQrCode') }}</span>
                                            </a>
                                        </p>
                                        <p><a :href="report.blockchainLink">{{ $t('dueDiligence.viewReportOnBlockChain') }}</a></p>
                                        <p style="word-break: break-all">{{ report.transactionHash }}</p>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="6" class="pl-10">
                                <v-row>
                                    <v-col cols="12">
                                        <div class="item-box">
                                            <h2 class="font-weight-bold">
                                                {{ $t('dueDiligence.eudrPublicReport') }}
                                            <v-tooltip top color="00BD73" max-width="350">
                                                <template v-slot:activator="{ on, attrs }">
                                                <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                                    mdi-alert-circle
                                                </v-icon>
                                                </template>
                                                <span>{{ $t('dueDiligence.eudrPublicReport') }}</span>
                                            </v-tooltip>
                                            </h2>
                                        </div>
                                    </v-col>
                                    <v-col cols="12">
                                        <p>   {{ $t('dueDiligence.scanQrEudr') }}</p>
                                    </v-col>
                                    <v-col class="col-2" id="public-qr">
                                        <qrcode :text="publicLink" :size="128"></qrcode>
                                    </v-col>
                                    <v-col class="col-10 blockchain-text">
                                        <p>
                                            <a href="#" @click="downloadQR('public-qr')">
                                                <v-icon color="primary">mdi-download</v-icon>&nbsp;<span>{{ $t('dueDiligence.downloadQrCode') }}</span>
                                            </a>
                                        </p>
                                        <p><a :href="publicLink">   {{ $t('dueDiligence.viewReportForPublic') }}</a></p>
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
                                          <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
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
                                          <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
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
                                          <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
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
                                          <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
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
                                          <v-icon class="icon-with-background primary--text " style="color:#0EBF67" v-bind="attrs" v-on="on">
                                            mdi-alert-circle
                                          </v-icon>
                                        </template>
                                        <span>{{ $t('dueDiligence.totalAreaTT') }}</span>
                                      </v-tooltip> -->
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold"> {{ this.report.totalArea ? parseFloat(this.report.totalArea * 0.404686).toFixed(5) : '-' }}
                                        </p>
                                    </div>
                                </v-col>

                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2"> 
                                            {{ $t('dueDiligence.totalNoOfDeforestation') }}
                                            <v-tooltip top color="00BD73" max-width="350">
                                        <template v-slot:activator="{ on, attrs }">
                                          <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
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
                                          <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                            mdi-alert-circle
                                          </v-icon>
                                        </template>
                                        <span>{{ $t('dueDiligence.totalNoOfHighDeforestationTT') }}</span>
                                      </v-tooltip>
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold"> {{ this.report.totalHighDeforestationProductionPlaces }}
                                        </p>
                                    </div>
                                </v-col>

                                <v-col sm="3">
                                    <div class="item-box">

                                        <p class="text-subtitle-1 mb-2"> 
                                            {{ $t('dueDiligence.totalNoOfRiskAssessments') }}
                                            <v-tooltip top color="00BD73" max-width="350">
                                        <template v-slot:activator="{ on, attrs }">
                                          <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                            mdi-alert-circle
                                          </v-icon>
                                        </template>
                                        <span>{{ $t('dueDiligence.totalNoOfRiskAssessmentsTT') }}</span>
                                      </v-tooltip>
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold"> {{
                                            this.report.assessment.selectedAssessments.length   || '-' }}
                                        </p>
                                    </div>
                                </v-col>

                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-card>

                <v-card elevation="0">
                    <v-card class="mb-5" flat>
                        <v-card-text>
                            <v-row class="pl-2 mb-2">
                                <v-col sm="12">
                                    <v-toolbar-title class="font-weight-bold">
                                        {{ $t('dueDiligence.productDetail') }}
                                        <v-tooltip top color="00BD73" max-width="350">
                                        <template v-slot:activator="{ on, attrs }">
                                          <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                            mdi-alert-circle
                                          </v-icon>
                                        </template>
                                        <span>{{ $t('dueDiligence.productDetailTT') }}                                        </span>
                                      </v-tooltip>
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
                                          <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                            mdi-alert-circle
                                          </v-icon>
                                        </template>
                                        <span>{{ $t('dueDiligence.productTT') }}</span>
                                      </v-tooltip>
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold">
                                            {{ this.report.product }}
                                        </p>

                                    </div>
                                </v-col>

                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2">
                                            {{ $t('dueDiligence.productDescription') }}
                                            <v-tooltip top color="00BD73" max-width="350">
                                        <template v-slot:activator="{ on, attrs }">
                                          <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                            mdi-alert-circle
                                          </v-icon>
                                        </template>
                                        <span>{{ $t('dueDiligence.productDescriptionTT') }}</span>
                                      </v-tooltip>
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold">
                                            {{ this.report.productDescription  || '-' }}
                                        </p>
                                    </div>
                                </v-col>

                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2">
                                            {{ $t('dueDiligence.netMass') }} ({{ this.eudrSettings.product_mass_unit }})
                                            <v-tooltip top color="00BD73" max-width="350">
                                        <template v-slot:activator="{ on, attrs }">
                                          <v-icon class="icon-with-background primary--text " style="color:#0EBF67" v-bind="attrs" v-on="on">
                                            mdi-alert-circle
                                          </v-icon>
                                        </template>
                                        <span>{{ $t('dueDiligence.netMassTT') }}</span>
                                      </v-tooltip>
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold">
                                            {{ this.report.productNetMass || '-' }}
                                        </p>
                                    </div>
                                </v-col>

                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2">
                                            {{ $t('dueDiligence.volume') }} ({{ this.eudrSettings.volume_unit   || '-' }})
                                            <v-tooltip top color="00BD73" max-width="350">
                                        <template v-slot:activator="{ on, attrs }">
                                          <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                            mdi-alert-circle
                                          </v-icon>
                                        </template>
                                        <span>{{ $t('dueDiligence.volumeTT') }}</span>
                                      </v-tooltip>
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold">
                                            {{ this.report.productVolume || '-' }}
                                        </p>
                                    </div>
                                </v-col>

                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2">
                                            {{ $t('dueDiligence.scientificName') }}
                                            <v-tooltip top color="00BD73" max-width="350">
                                        <template v-slot:activator="{ on, attrs }">
                                          <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                            mdi-alert-circle
                                          </v-icon>
                                        </template>
                                        <span>{{ $t('dueDiligence.scientificNameTT') }}</span>
                                      </v-tooltip>
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold">
                                            {{ this.report.productScientificName || '-' }}
                                        </p>
                                    </div>
                                </v-col>

                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2">
                                            {{ $t('dueDiligence.commonName') }}
                                            <v-tooltip top color="00BD73" max-width="350">
                                        <template v-slot:activator="{ on, attrs }">
                                          <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                            mdi-alert-circle
                                          </v-icon>
                                        </template>
                                        <span>{{ $t('dueDiligence.commonNameTT') }}</span>
                                      </v-tooltip>
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold">
                                            {{ this.report.productCommonName || '-' }}
                                        </p>
                                    </div>
                                </v-col>

                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-card>

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
                            <div class="d-flex mt-5 justify-space-between filter-pro-places">
                                <div class="d-flex align-center">
                                    <v-text-field prepend-inner-icon="mdi-magnify" outlined height="5px"
                                        :placeholder="$t('search')" dense v-model="search" @input="debouncedGetProductionPlaces"
                                        class="shrink" clearable>
                                    </v-text-field>

                                    <v-autocomplete class="mx-2" v-model="countryModel" item-text="name" item-value="name"
                                        :items="countries" :label="$t('deforestation.allCountries')" @change="getProductionPlaces"
                                        clearable outlined dense>
                                    </v-autocomplete>

                                    <!-- <v-autocomplete class="mx-2" v-model="producerModel" item-text="text" item-value="val"
                                        :items="allProducers" :label="$t('deforestation.allProducer')" @change="getProductionPlaces"
                                        outlined dense clearable>
                                    </v-autocomplete> -->
                                    <v-autocomplete class="mx-2" v-model="statusModel" item-text="text" item-value="val"
                                        :items="allStatus" :label="$t('deforestation.EUDRDeforestationStatus')"
                                        @change="getProductionPlaces" outlined dense clearable>
                                    </v-autocomplete>
                                </div>
                                <div class="d-flex mb-5 pagination">
                                    <div class="py-1 title">
                                        {{ from }} - {{ to }} of {{ totalProductionPlaces }}
                                    </div>
                                    <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page <= 1"
                                        @click="pageChange(false)">
                                        <v-icon dark>
                                            mdi-chevron-left
                                        </v-icon>
                                    </v-btn>
                                    <v-btn class="mx-2" fab small outlined color="primary"
                                        :disabled="options.page >= totalPages" @click="pageChange(true)">
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
                                        {{ item.farmType== "Polygon" ? $t('deforestation.Polygon') : $t('deforestation.Circular') }}
                                    </td>

                                    <td>
                                        <v-tooltip top color="black" max-width="350">
                              <template v-slot:activator="{ on, attrs }">


                                  <v-btn       v-bind="attrs"
                                  v-on="on"  v-if="getEUDRDeforestationStatus(item.deforestationStatus || item.errorStatus).text !== 'N/A'" small rounded min-width="200" depressed 
                                  :class="[getEUDRDeforestationStatus(item.deforestationStatus || item.errorStatus).class, 'non-clickable']" height="34">
                        {{ getEUDRDeforestationStatus(item.deforestationStatus || item.errorStatus).text }}
                      </v-btn>
                      <span v-else>N/A</span>
                              </template>
                              <span>{{ getEUDRDeforestationStatus(item.deforestationStatus || `${item.errorStatus}_tt`).text}}</span>
                          </v-tooltip>
                                    </td>

                                    <td>
                                        <div class="d-flex">
                                            <v-menu>
                                                <template v-slot:activator="{ on: menu, attrs }">
                                                    <v-tooltip top color="00BD73" max-width="350">
                                                        <template v-slot:activator="{ on: tooltip }">
                                                            <v-btn x-small fab v-bind="attrs" v-on="{ ...menu, ...tooltip }" color="primary"
                                                                style="margin-left: 20px;"  @click="handleClick(item.deforestationStatus )">
                                                                <img :src="isIndonesianClient ? '/img/id/todo-list.svg' : isKenyaClient ? '/img/ke/todo-list.svg' : '/icons/todo-list.png'"
                                                                    style="width: 34px; height: 34px; border-radius: 50%;" />
                                                            </v-btn>

                                                        </template>
                                                        <span>{{ $t('dueDiligence.viewReport') }}</span>
                                                    </v-tooltip>
                                                </template>
                                                <!-- <template v-slot:activator="{ on, attrs }">
                                                    
                                                    <v-btn x-small fab v-bind="attrs" v-on="on" color="primary"
                                                        style="margin-left: 20px;">
                                                        <v-icon>mdi-file</v-icon>
                                                    </v-btn>
                                                </template> -->
                                                <!--                                                <span>{{ $t('deforestation.viewDetail') }}</span>-->
                                                <v-list  v-if="item.deforestationStatus">
                                                    <v-list-item v-for="(menu, i) in getMenusForReport(item.deforestationInfo?.deforestationReport)" :key="i" >
                                                        <v-list-item-title class="cursor-pointer" @click="showModel(menu.id, item)">
                                                            {{ menu.title }}
                                                            
                                                        </v-list-item-title>
                                                    </v-list-item>
                                                </v-list>
                                            </v-menu>

                                            <v-tooltip top color="00BD73" max-width="350">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-icon v-bind="attrs" v-on="on" class="ml-5 primary--text"
                                                        style="margin-left: 20px;"
                                                        @click="removeFarm(item.farm.id)">mdi-trash-can</v-icon>

                                                </template>
                                                <span>{{ $t('delete') }}</span>
                                            </v-tooltip>



                                            <!-- <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn x-small fab v-bind="attrs" v-on="on" color="primary"
                                                        @click="removeFarm(item.farm.id)" style="margin-left: 20px;">
                                                        <v-icon>mdi-delete</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>{{ $t("delete") }}</span>
                                            </v-tooltip> -->
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
                            <img :src="isIndonesianClient ? '/img/id/todo-list.svg' : isKenyaClient ? '/img/ke/todo-list.svg' : '/icons/todo-list.png'" style="width: 34px; height: 34px; border-radius: 50%;" />
                            <span class="ml-2">{{ $t("dueDiligence.viewReport") }}</span>
                            <v-icon class="ml-5 primary--text">mdi-trash-can</v-icon>
                            <span class="ml-2">{{ $t("delete") }}</span>
                        </div>
                    </template>
                    <!-- <v-row class="mt-10" v-if="productionPlaces.length">
                        <v-btn color="primary" dark class="mr-2 mb-2" @click="removeAllHighRiskFarm">
                            {{ $t("deforestation.removeAllHighRiskFarm") }}
                        </v-btn>
                        <v-btn color="primary" dark class="mr-2 mb-2" @click="removeAllLowRiskFarm">
                            {{ $t("deforestation.removeAllLowRiskFarm") }}
                        </v-btn>
                        <v-btn color="primary" dark class="mr-2 mb-2" @click="triggerFileInput">
                            {{ $t("deforestation.attachRiskMigrationDoc") }}
                        </v-btn>
                        <input type="file" ref="fileInput" accept="application/pdf" @change="handleFileChange"
                            style="display: none;" />
                    </v-row> -->
                    <v-row class="mt-10 d-flex mb-20" v-if="this.fileUploaded">
                        <div>
                            <v-sheet
                                style="border: 1px solid #ccc; border-radius: 10px; background: rgba(29, 232, 28, 0.2);"
                                class="d-flex align-center justify-center flex-wrap text-center mx-auto px-4" height="100"
                                width="100">
                                <v-icon dark style="color: green">
                                    mdi-eye
                                </v-icon>
                                {{ uploadFileType }}
                            </v-sheet>
                            <h3 style="color:green" class="pt-1 pb-10">
                                {{ uploadedFileName }}
                            </h3>
                        </div>
                        <div style="width:30%">
                            <v-textarea style="border-radius: 8px;" class="ml-4" outlined :rows="3"
                                v-model="highRiskComment" label="Comments"></v-textarea>
                        </div>
                        <div></div>
                    </v-row>
                </v-card-text>

                <v-card class="grey">
                    <h3 class="pt-5 ml-5">{{ $t("deforestation.removedFarms") }}</h3>
                    <v-card-text>
                        <v-data-table :headers="removedFarmHeader" :items="removedProductionPlaces" :items-per-page="10"
                            hide-default-footer :loading="loading" :options.sync="removedProductionPlaceOptions" :loading-text="$t('deforestation.loadingProductionPlaces')
                                ">
                            <template v-slot:top="{ }">
                                <div class="d-flex mt-5">
                                    <v-spacer></v-spacer>
                                    <div class="py-1 title">
                                        {{ removedFrom }} - {{ removedTo }} of
                                        {{ totalRemovedProductionPlaces }}
                                    </div>
                                    <v-btn class="mx-2" fab small outlined color="primary"
                                        :disabled="removedProductionPlaceOptions.page <= 1"
                                        @click="pageChangeRemovedProductionPlace(false)">
                                        <v-icon dark>
                                            mdi-chevron-left
                                        </v-icon>
                                    </v-btn>
                                    <v-btn class="mx-2" fab small outlined color="primary" :disabled="removedProductionPlaceOptions.page >= totalRemovedPages
                                        " @click="pageChangeRemovedProductionPlace(true)">
                                        <v-icon dark>
                                            mdi-chevron-right
                                        </v-icon>
                                    </v-btn>
                                </div>
                            </template>
                            <template v-if="removedProductionPlaces.length" v-slot:body="{ items }">
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
                                            {{ item.farmType== "Polygon" ? $t('deforestation.Polygon') : $t('deforestation.Circular') }}
                                        </td>

                                        <td>
                                            <v-tooltip top color="black" max-width="350">
                              <template v-slot:activator="{ on, attrs }">


                                  <v-btn       v-bind="attrs"
                                  v-on="on"  v-if="getEUDRDeforestationStatus(item.deforestationStatus || item.errorStatus).text !== 'N/A'" small rounded min-width="200" depressed :class="getEUDRDeforestationStatus(item.deforestationStatus || item.errorStatus).class" height="34"
                      >
                        {{ getEUDRDeforestationStatus(item.deforestationStatus || item.errorStatus).text }}
                      </v-btn>
                      <span v-else>N/A</span>
                              </template>
                              <span>{{ getEUDRDeforestationStatus(item.deforestationStatus || `${item.errorStatus}_tt`).text}}</span>
                          </v-tooltip>
                                        </td>

                                        <td>

                                            <div class="d-flex">
                                                <div v-if="!!(item.deforestationInfo && item.deforestationStatus)">

                                                    <v-tooltip top color="00BD73" max-width="350">
                                                        <template v-slot:activator="{ on, attrs }">

                                                            <img v-bind="attrs" v-on="on" @click="
                                                                $router.push({
                                                                    name: 'EudrAssessmentReport',
                                                                    params: { id: item.deforestationInfo.deforestationReportRequestId, type: 'assignment' },
                                                                })
                                                                " :src="isIndonesianClient ? '/img/id/todo-list.svg' : isKenyaClient ? '/img/ke/todo-list.svg' : '/icons/todo-list.png'"
                                                                style="width: 34px; height: 34px; border-radius: 50%;" />

                                                        </template>
                                                        <span>{{ $t('dueDiligence.viewReport') }}</span>
                                                    </v-tooltip>


                                                </div>
                                                <div style="margin-top: 5px;">
                                                    <v-tooltip top color="00BD73" max-width="350">
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <v-icon v-bind="attrs" v-on="on" class="ml-2 primary--text"
                                                                @click="restoreFarm(item.id)"
                                                                style="width: 24px; height: 24px; border-radius: 50%; margin-left: 20px;" />
                                                        </template>
                                                        <span>{{ $t("Undo delete") }}</span>
                                                    </v-tooltip>

                                                </div>
                                            </div>

                                            <!-- <div>
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-btn x-small fab v-bind="attrs" v-on="on" color="primary" @click="
                                                            $router.push({
                                                                name: 'EudrAssessmentReport',
                                                                params: { id: item.id, type: 'assignment' },
                                                            })
                                                            " style="margin-left: 20px;">
                                                            <v-icon>mdi-file</v-icon>
                                                        </v-btn>
                                                    </template>
                                                    <span>{{ $t("deforestation.delete") }}</span>
                                                </v-tooltip>
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-btn x-small fab v-bind="attrs" v-on="on" color="primary"
                                                            @click="restoreFarm(item.id)" style="margin-left: 20px;">
                                                            <v-icon>mdi-replay</v-icon>
                                                        </v-btn>
                                                    </template>
                                                    <span>{{ $t("delete") }}</span>
                                                </v-tooltip>
                                            </div> -->
                                        </td>
                                    </tr>
                                </tbody>

                            </template>
                            <template v-slot:footer></template>
                        </v-data-table>
                        <template>
                            <div class="d-flex mt-5" style="align-items: center;">
                                <v-spacer></v-spacer>
                                <!-- <img src="/icons/todo-list.png" style="width: 34px; height: 34px; border-radius: 50%;" /> -->
                                <!-- <span class="ml-2">{{ $t("dueDiligence.viewReport") }}</span> -->
                                <v-icon class="ml-5 primary--text">mdi-undo</v-icon>
                                <!-- <img class="ml-5" src="/icons/undo.png"
                                    style="width: 34px; height: 34px; border-radius: 50%;" /> -->
                                <span class="ml-2">{{ $t("dueDiligence.undoDelete") }}</span>
                            </div>
                        </template>
                    </v-card-text>
                </v-card>



                <ActivityLog ref="activityLogComponent" :loading="loading" :diligenceId="diligenceId" @select-item="selectItem" />

                <v-card class="mb-5" flat v-if="isDeclerationEnabled">
                    <v-card-text>
                        <v-row class="pl-2 mb-2">
                            <v-col sm="12">
                                <v-toolbar-title v-if="operator" class="font-weight-bold">
                                    {{ $t("dueDiligence.operatorDecleration") }}
                                  <v-tooltip top color="00BD73" max-width="350">
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-icon class="icon-with-background primary--text" v-bind="attrs" v-on="on">
                                        mdi-alert-circle
                                      </v-icon>
                                    </template>
                                    <span>{{ $t("dueDiligence.operatorDeclerationTT") }}</span>
                                  </v-tooltip>
                                </v-toolbar-title>
                                <v-toolbar-title v-if="supplier" class="font-weight-bold">
                                  {{ $t("dueDiligence.supplierDecleration") }}
                                  <v-tooltip top color="00BD73" max-width="350">
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                        mdi-alert-circle
                                      </v-icon>
                                    </template>
                                    <span>{{ $t("dueDiligence.supplierDeclerationTT") }}</span>
                                  </v-tooltip>
                                </v-toolbar-title>
                            </v-col>
                        </v-row>
                        <v-row class="pl-3">
                            <v-col sm="12">
                            <div
                            v-for="(declaration, i) in getNamedDeclaration(`${report.supplier.firstName} ${report.supplier.lastName}`)"
                            :key="i"
                            class="item-box"
                            >
                            <v-checkbox
                                v-model="declarationResponses[i]"
                                :label="`${declaration}`"
                                @change="updateDeclaration"
                            ></v-checkbox>
                            </div>
                        </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </div>

            <eu-upload :dialog="euUpload" @closeEuUpload="handleClose1">
            </eu-upload>
        </v-container>
        <DisputesDialog
            v-if="showDisputeModal"
            :dialogU="showDisputeModal"
            :reportRequestId="targetProductionPlaceDeforestationId"
            @closeDisputeDialog="showDisputeModal = false">
        </DisputesDialog>
        <MitigationDialog
            v-if="showMitigtionModal"
            :dialogU="showMitigtionModal"
            :productionPlaceId="targetedProductionPlaceId"
            @closeBulkUpload="showMitigtionModal = false"
            @mitigated="getProductionPlaces">
        </MitigationDialog>

        <confirm-box 
            :title="farmConfirmDelete.title"
            :message="farmConfirmDelete.message"
            :cancelBtnText="farmConfirmDelete.cancelBtnText" 
            :confirmBtnText="farmConfirmDelete.confirmBtnText"
            :confirmData="farmConfirmDelete.confirmData" 
            :dialog="farmConfirmDeleteDialog" 
            @cancel:action="farmConfirmDeleteDialog = false"
            @continue:action="confirmRemoveFarm" />
            
    </div>
</template>

<script>
import DownloadMixin from "@/mixins/DownloadMixin";
import loadingMixin from "@/mixins/LoadingMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import FinalReportOperatorSupplier from "./partials/FinalReportOperatorSupplier.vue";
import ActivityLog from "./partials/ActivityLog.vue";
//import EuUpload from './upload-eu-modal/EuUpload.vue'
//import Confirmation from './upload-eu-modal/Confirmation.vue'
//import ConfirmationWithList from './upload-eu-modal/ConfirmationWithList.vue'
//import DownloadEuModalConfirm from './upload-eu-modal/DownloadEuModalConfirm.vue'
import DownloadEuModalWarning from '../../upload-eu-modal/DownloadEuModalWarning.vue'
import ShowReportPublishDate from '../components/final-conclude/ShowReportPublishDate.vue'
import DeforestationService from "@/_services/DeforestationService";
import UnitService from "@/_services/UnitService";
import S3UploadService from "@/_services/S3UploadService";
import { getCountries } from "country-state-picker";
import DisputesDialog from '../components/eudr/DisputesDialog.vue';
import MitigationDialog from '../components/eudr/MitigationDialog.vue';
import ConfirmBox from "@/components/ConfirmBox";
import OrganizationService from "@/_services/OrganizationService";
import ActivityLogService from "@/_services/ActivityLogService";
import { mapGetters } from "vuex";
import {debounce} from 'lodash';
import { isDeforestationExpired,EventBus, isIndonesianClient, isKenyaClient } from '@/utils.js';
export default {
    computed: {

        ...mapGetters("eudrSettings", ["get_EUDR_Settings"]),
        isKenyaClient() {
            return isKenyaClient();
        },
        isIndonesianClient() {
        return isIndonesianClient();
        },
        targetProductionPlaceDeforestationId() {
            if(!this.targetProductionPlace) return null;
            return this.targetProductionPlace.diligenceReportProductionPlaceArray[0]?.productionPlaceDeforestationInfo?.deforestationReportRequestId;
        },
        eudrSetting() {
            return this.get_EUDR_Settings;
        },
        publicLink() {
            if (this.report.encId === '') {
                return '#';
            }
            return process.env.VUE_APP_FRONT_BASE_URL + '/public-dds/' + encodeURIComponent(this.report.encId) + '___' + this.logo?.replace(".", "_");
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
        menusWithoutReport() {
            return this.menus.filter(menu => menu.id !== 'assessment' && menu.id !== 'disputes');
        },
        menusWithoutCompliance() {
            return this.menus.filter(menu => menu.id !== 'compliance');
        },
        getStatusColor() {
            const reportStatus = this.$props.diligenceStatus || this.report.status;
            return reportStatus === 'Compliant' ? 'primary': 'red';
        },
        totalPages() {
            return parseInt(Math.ceil(this.totalProductionPlaces / this.options.limit));
        },
        totalRemovedPages() {
            return parseInt(Math.ceil(this.totalRemovedProductionPlaces / this.removedProductionPlaceOptions.limit));
        },
        getOrganizationId() {
            return this.$store.getters.getUser?.user_organization?.id;
        },
        isDeclerationEnabled() {
            return this.eudrSettings?.declarations?.some(declaration => declaration.isEnabled);
        },
        filterData() {
            if (
                (this.countryModel && this.countryModel !== "") ||
                (this.producerModel && this.producerModel !== "") ||
                (this.statusModel && this.statusModel !== "")
            ) {
                const list = this.productionPlaces.filter((item) => {
                    return (
                        (!this.countryModel[0] ||
                            item.farm.userDdsAssoc.countryId === this.countryModel[0]) &&
                        (!this.producerModel ||
                            item.farm.userDdsAssoc.firstName === this.producerModel) &&
                        (!this.statusModel ||
                            item.eudr_deforestation_status === this.statusModel)
                    );
                });
                return list;
            } else {
                return this.productionPlaces;
            }
        },

       
    },
    mounted() {
        this.loading = false;
    },
    async created() {
        this.startLoading();
        await this.fetchAllData();
        await this.handleEudrCompliantStatusUpdate()
        this.stopLoading();
        
        // Refresh activity logs after page is fully loaded
        this.$nextTick(async () => {
            if (this.$refs.activityLogComponent) {
                await this.$refs.activityLogComponent.refreshActivityLogs();
                console.log('Activity logs refreshed after page load');
            }
        });
        
        EventBus.$on('diligence-detail-load',async (payload) => {
            if(payload){
                await this.getDiligenceDetail(this.diligenceId);
                
                // Refresh activity logs after diligence details are updated
                this.$nextTick(async () => {
                    if (this.$refs.activityLogComponent) {
                        await this.$refs.activityLogComponent.refreshActivityLogs();
                        console.log('Activity logs refreshed after diligence details update');
                    }
                });
            }
        })
    },
    watch: {
        options: {
            handler(opt) {
                this.getProductionPlaces(opt);
            },
            deep: true,
        },
        removedProductionPlaceOptions: {
            handler(opt) {
                this.getRemovedProductionPlaces(opt);
            },
            deep: true,
        },
        eudrSettings: {
            handler(newVal) {
                this.initializeDeclarationResponses(newVal); // Reinitialize responses when eudrSettings changes
            },
            immediate: true,
            deep: true
        },
    },
    props: {
        diligenceId: {
            required: true
        },
        diligenceStatus: {
            required: false
        }
    },
    components: {
        'eu-upload': DownloadEuModalWarning,
        DisputesDialog,
        MitigationDialog,
        "confirm-box": ConfirmBox,
        ShowReportPublishDate,
        FinalReportOperatorSupplier,
        ActivityLog,
    },
    methods: {
        async handleUpdateStatus(complianceStatus) {
            try {
                const response = await DeforestationService.changeStatusOfDiligenceReport({
                    id: parseInt(this.diligenceId),
                    status: complianceStatus
                });
                
                // Log the status change
                try {
                    const userId = this.$store.getters.getUser?.id;
                    if (userId) {
                        await ActivityLogService.logStatusChange(
                            this.diligenceId, 
                            userId, 
                            this.report.status, 
                            complianceStatus
                        );
                    }
                } catch (error) {
                    console.error('Failed to log status change:', error);
                }
                
                console.log(response);
                return response;
            } catch (err) {
                console.log(err);
                throw err;
            }
        },
        async handleEudrCompliantStatusUpdate() {
            const isReportZeroWarnings = await this.getReportConcludeWarningsAndIsReportComplaint()
            const complianceStatus = isReportZeroWarnings ? 'Compliant': 'Non-Compliant';
            if (this.report.status.toLowerCase() === complianceStatus.toLowerCase()) {return }
            this.handleUpdateStatus(complianceStatus).then(async () => {
                this.getDiligenceDetail(this.diligenceId)
                this.$notify({
                    text: this.$t('dueDiligence.updatedDueDiligenceStatus'),
                    type: 'success'
                });
            });
        },
        async getReportConcludeWarningsAndIsReportComplaint() {
            const warnings  =  await DeforestationService.concludeDiligenceReportByStatusWarnings(this.diligenceId)
            const warningConclusion = Object.values(warnings.data.concludeDigilienceReportStatus)
            return warningConclusion.every(x => x ==0)
        },
        initializeDeclarationResponses() {
            // Map isEnabled values to declarationResponses based on eudrSettings.declarations
            this.declarationResponses = this.eudrSettings?.declarations?.map(declaration => declaration.isEnabled);
        },
        async getOrganizationLogo() {
            const { data } = await OrganizationService.getorganization();
            const logo = data?.data?.logo;
            const codeIndex = logo?.lastIndexOf('/');
            this.logo = logo?.slice(codeIndex + 1);
        },
        async fetchAllData() {
            await Promise.allSettled([this.getEudrSettings(), this.getProductList()]);
            await this.getOrganizationLogo();
            await this.getDiligenceDetail(this.diligenceId);
            await this.fetchData();
            // this.getActivityLog(this.diligenceId);
        },
        async exportToPDFForProductionPlaces() {
            const requestParams = {
                page: this.options.page,
                limit: this.options.limit,
                diligenceReportId: this.diligenceId,
                removed: false,
                searchPhrase: this.search,
                eudrDeforestationStatus:this.statusModel,
                farmCountry:this.countryModel,
                farmOwner:this.producerModel
            };
            const querys = new URLSearchParams(requestParams).toString();
            const token = this.$store.state.auth.token
            this.startLoading()
            const url = process.env.VUE_APP_DEFORESTRATION_API_BASE_URL  || "http://localhost:4043/api"
            this.downloadSourceFileWithToken(`${url}/production-place/production-place-with-status-pdf?${querys}`, "application/pdf", token,"production-places.pdf")
                .then(() => {
                this.stopLoading()
                }).catch(() => {
                this.stopLoading()
            })
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
        async downloadPDFFinalReport() {
            try {
                const res = await this.downloadSourceFile(`${process.env.VUE_APP_DEFORESTRATION_API_BASE_URL}/diligence-report/final-report-pdf/${this.diligenceId}`, "application/pdf", "final-report.pdf");
                
                // Log the report download
                try {
                    const userId = this.$store.getters.getUser?.id;
                    if (userId) {
                        await ActivityLogService.logReportDownload(this.diligenceId, userId, 'Final Report');
                    }
                } catch (error) {
                    console.error('Failed to log report download:', error);
                }
                
                console.log(res);
            } catch (error) {
                console.error('Failed to download report:', error);
            }
        },
        getMenusForReport(report) {
            return report?.transactionHash ? this.menus : this.menusWithoutCompliance;
        },
        getTranslatedStatus(status) {
            if (typeof status !== 'string') {
                return '-'; 
            }
            switch (status.toLowerCase()) {
                case 'uploaded to eu portal':
                    return this.$t('deforestation.uploadedToEU');
                case 'pending':
                    return this.$t('deforestation.pending');
                case 'under review':
                    return this.$t('deforestation.underReview');
                case 'compliant':
                    return this.$t('deforestation.compliant');
                case 'processing farms':
                    return this.$t('deforestation.processingFarm');
                case 'analyzing deforestation':
                    return this.$t('deforestation.analyzingDeforestation');
                case 'writing to blockchain':
                    return this.$t('dueDiligence.writingToBlockchain');
                case 'ready to proceed':
                    return this.$t('deforestation.readyToProceed');
                case 'non-compliant':
                    return this.$t('deforestation.nonCompliant');
                case 'mitigation required':
                    return this.$t('deforestation.mitigationRequired');
                default:
                    return '-';
            }
        },
        getEUDRDeforestationStatus(status) {
            switch (status) {
                case 'Zero/Negligible Deforestation Probability':
                case 'Zero/Negligible Probability':
                    return { class: 'green-button', text: this.$t("deforestation.zeroOrNegligibleProbability") };
                case 'Very High Deforestation Probability':
                case 'Very High Probability':
                    return { class: 'very-high-button', text:  this.$t("deforestation.veryHighProbability") };
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
        async triggerSubmit() {
            return await this.highRiskMitigation();
        },
        triggerFileInput() {
            this.$refs.fileInput.click();
        },
        async handleFileChange(event) {
            const file = event.target.files[0];
            if (file && file.type === "application/pdf") {
                this.uploadedFile = file;
                this.uploadedFileName = file.name;
                this.uploadFileType = file.name
                    .split(".")
                    .pop()
                    .toUpperCase();
                await this.uploadFile(file);
            } else {
                console.error("Invalid file type. Please select a PDF file.");
            }
        },

        async uploadFile(file) {
            this.uploadedFile = file;
            this.uploadedFileName = file.name;
            this.uploadFileType = file.name
                .split(".")
                .pop()
                .toUpperCase();
            this.fileUploaded = true;
            const result = await S3UploadService.singleUpload(file, "signatures");
            this.s3Location = result.fullPath;
            this.s3key = result.key;
            console.log("File uploaded successfully:", this.s3Location);
        },

        handleClick(eudrDeforestationStatus) {
        if (!eudrDeforestationStatus) {
            this.$notify({
                    text:this.$t('emptyDeforestationStatus'),
                    type: 'error'
                })
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
        getEudrSettings() {
            return DeforestationService.getEudrSettings().then(res => {
                this.eudrSettings = res.data.eudrSetting;
            }).catch(() => {
                this.$notify({
                    text:this.$t('Failed to fetch settings'),
                    type: 'error'
                })
            });
        },
        closeWithoutChange() {
            this.$emit("close-without-change");
        },

        closeModal(data = null) {
            //   this.polygon.setMap(null);
            //   this.parentPolygonCoords = [];
            this.$emit("close-location-modal", data);
        },
        getNamedDeclaration(name) {
            return this.eudrSettings.declarations?.map((declaration) => declaration.description.replace('[name]', name));
        },
        handleFinalReportDownload(dwId) {
            DeforestationService.downloadDueDeligenceFinalReport({ type: dwId }).then(response => {
                console.log(response);
                this.$notify({
                    text: this.$t("dueDiligence.reportDownloadedSuccessfully"),
                    type: "success",
                });
            }).catch(err => {
                this.$notify({
                    text: err,
                    type: "error",
                });
            })
        },
        handleEmptyUser(user) {
            return user ?? {
                firstName: 'N/A',
                lastName: 'N/A',
                countryId: 'N/A',
                mobile: 'N/A',
                email: 'N/A',
                isoCode: 'N/A',
                eori_number: 'N/A'
            };
        },
        getProductList() {
            return DeforestationService.getProductList().then(res => {
                const productList = res.data.deforestationProductList;
                this.productList = productList;
            }).catch(err => {
                //this.loading = false
                console.log('Error', err)
            })   
        },
        async getDiligenceDetail(diligenceId) {
            return DeforestationService.getDiligenceDetail(parseInt(diligenceId)).then(async res => {
                const report = res.data.getDiligenceDetail;
                
                // Note: Removed automatic view logging to avoid duplicate logs
                // View logging is now only done for meaningful actions, not page refreshes
                
                let selectedProduct = null;
                if (report.product) {
                    selectedProduct = this.productList.find(p => p.id == report.product);
                }

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
                    user:report.user,
                    status: report.status,
                    companyID: report.companyID,
                    EUDRReferenceNumber: report.EUDRReferenceNumber,
                    internalReferenceNumber: report.internalReferenceNumber,
                    activity: report.activity,
                    countryOfEntry: report.countryOfEntry,
                    countryOfActivity: report.countryOfActivity,
                    containerId: report.containerIds,
                    countryOfProduction: report.countryOfProduction,
                    product: (report.product) ? selectedProduct.name : 'N/A',
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
                    blockchainPublishDate:report.blockchainPublishDate,
                    is_report_concluded:report.is_report_concluded,
                    is_dds_status_update:report?.is_dds_status_update,
                    enableOnScreenRiskWarnings:report?.enableOnScreenRiskWarnings,
                    riskWarnings: report?.riskWarnings || [],
                    ddsReportExporter: report?.ddsReportExporter,
                };

                this.selectedAssessments = report.requiredAssessment;
                reportDetail.assessment.assessments = report.requiredAssessment;
                reportDetail.assessment.selectedAssessments = report.requiredAssessment.map(assessment => (assessment.assessment));

                reportDetail.assessment.selectedCountries = report.assessmentCountries;

                const updatedDiligenceDetail = Object.assign({}, this.report, reportDetail);
                this.report = updatedDiligenceDetail;
                this.$store.commit('eudrDDS/SET_DILIGENCE_DETAILS', this.report);
            }).catch(err => {
                this.loading = false
                this.$notify({
                    text: err,
                    type: "error",
                });
            });
        },
        // async getActivityLog(id) {
        //     try {
        //         this.startLoading()
        //         const logs = await DeforestationService.getDiligenceActivityLog(id);
        //         this.activityLogs = logs.data.diligenceActivityLog;
        //     } catch (err) {
        //         this.$notify({
        //             text: err,
        //             type: 'error'
        //         })
        //     } finally {
        //         this.stopLoading()
        //     }
        // },




        handleEuUpload() {
            this.euUpload = true
        },
        handleClose1(playload) {
            this.euUpload = playload
        },
        viewPdfFile() { },
        formatDateIntoIso(dt) {
            if (!dt) return ''
            return `${dt}T00:00:00.000Z`
        },
        createShipment() {
            if (!this.$refs.createShipment.validate()) return
        },
        handleStopAdd() {
            this.shipment.stops.push({
                model: ''
            })
        },

        handleClose(key) {
            this.shipment.stops.splice(key, 1)
        },

        selectItem(item) {
            this.selectedItem = item;
        },
        searchQuery() {

        },
        resetSearchOnEmpty() {
            this.search = ''
            this.countryModel = ''
            this.statusModel = ''
            this.regionModelregionModel = ''
            this.options = {
                page: 1,
                limit: 10
            }
        },
        pageChange(t) {
            if (t) this.options.page = this.options.page + 1;
            else this.options.page = this.options.page - 1;
        },
        pageChangeRemovedProductionPlace(t) {
            if (t) {
                this.removedProductionPlaceOptions.page = this.removedProductionPlaceOptions.page + 1;
            } else {
                this.removedProductionPlaceOptions.page = this.removedProductionPlaceOptions.page - 1;
            }
        },
        shouldShowWarningIcon(item) {
            return this.shouldShowEditButton(item);
        },
        shouldShowEditButton(item) {
            const { farm, farmType } = item;
            const areaInHa = farm && farm.area ? farm.area * 0.404686 : 0;
            return farmType.toUpperCase() === 'POINT' && areaInHa > 4;
        },
        getWarningMessage(item) {
            const { farm } = item;
            const areaInHa = farm && farm.area ? farm.area * 0.404686 : 0;
            if (areaInHa > 4) {
                return 'Farm is bigger than 4 hectares, it needs to be a polygon';
            } else {
                return '';
            }
        },
        async removeFarm(id){
            this.farmConfirmDelete.confirmData = { id };
            this.farmConfirmDeleteDialog = true;
        },
        async confirmRemoveFarm(action, confirmData) {
        this.startLoading();
            const params = {
                diligenceReportId: Number(this.diligenceId),
                farmId: Number(confirmData.id),
            };
            await DeforestationService.removeFarmFromProductionPlaceListById(params);
            
            // Log the production place deletion
            try {
                const userId = this.$store.getters.getUser?.id;
                if (userId) {
                    await ActivityLogService.logDDSProductionPlaceDeleted(
                        this.diligenceId,
                        userId,
                        confirmData.id,
                        '',
                        'Final report deletion'
                    );
                }
            } catch (logError) {
                console.error('Error logging production place deletion:', logError);
            }
            
            await this.fetchData();
            this.farmConfirmDeleteDialog = false;
            this.stopLoading();
        },

        async restoreFarm(id) {
            this.startLoading();
            const params = {
                diligenceReportId: this.diligenceId,
                farmId: id,
            };
            await DeforestationService.restoreProductionPlaceFarmById(params);
            await this.fetchData();
            this.stopLoading();
        },

        async removeAllHighRiskFarm() {
            this.startLoading();
            const params = {
                diligenceReportId: this.diligenceId,
                eudrDeforestationStatus: "High Probability",
            };
            const res = await DeforestationService.removeFarmFromProductionPlaceListByStatus(
                params
            );
            const { success, message } = res.data.removeFarmFromProductionPlaceList;
            if (success) {
                // Log the bulk high-risk production places deletion
                try {
                    const userId = this.$store.getters.getUser?.id;
                    if (userId) {
                        await ActivityLogService.logDDSMultipleProductionPlacesDeleted(
                            this.diligenceId,
                            userId,
                            'Bulk high-risk deletion',
                            'High risk deforestation status'
                        );
                    }
                } catch (logError) {
                    console.error('Error logging bulk high-risk production places deletion:', logError);
                }
                
                await this.getProductionPlaces();
                this.$notify({
                    title: message || "Item deleted successfully.",
                    type: 'success'
                })
            }
            else {
                this.$notify({
                    title: message || this.$t('somethingWentWrong'),
                    type: 'error'
                })
            }
            await this.fetchData();
            this.stopLoading();
        },

        async removeAllLowRiskFarm() {
            this.startLoading();
            const params = {
                diligenceReportId: this.diligenceId,
                eudrDeforestationStatus: "Low Probability",
            };
            const _res = await DeforestationService.removeFarmFromProductionPlaceListByStatus(
                params
            );
            
            // Log the bulk low-risk production places deletion
            try {
                const userId = this.$store.getters.getUser?.id;
                if (userId) {
                    await ActivityLogService.logDDSMultipleProductionPlaceBulkDeleted(
                        this.diligenceId,
                        userId,
                        'Bulk low-risk deletion',
                        'Low risk deforestation status'
                    );
                }
            } catch (logError) {
                console.error('Error logging bulk low-risk production places deletion:', logError);
            }
            
            await this.fetchData();
            this.stopLoading();
        },

        async fetchData() {
            // await this.getBulkDeforestationReport();
            await this.getProductionPlaces();
            await this.getRemovedProductionPlaces();
        },

        async highRiskMitigation() {
            this.startLoading();
            const params = {
                due_diligence_report_id: this.diligenceId,
                risk_mitigation_comment: this.highRiskComment,
                eudr_deforestation_status: "Manually Mitigated",
                file: this.s3Location,
            };
            try {
                const res = await DeforestationService.highRiskFarmRiskMitigation(params);
                const { success, message } = res.data.highRiskFarmRiskMitigation;
                
                if (success) {
                    this.$notify({
                        title: message || "Risk mitigated successfully.",
                        type: 'success'
                    })
                }
                else {
                    this.$notify({
                        title: message || this.$t('somethingWentWrong'),
                        type: 'error'
                    })
                }
                await this.fetchData();
            } catch (error) {
                this.$notify({
                    text: error.message || "An unexpected error occurred. Please try again later.",
                    type: 'error',
                });
            }
            finally {
                this.stopLoading();
            }
        },

        resetCounts() {
            this.totalFarmArea = 0;
            this.totalHighDeforestationCount = 0;
            this.geofenceCount.polygon = 0;
            this.geofenceCount.point = 0;
        },

        debouncedGetProductionPlaces: debounce(function(){
        // reset into first page.
            this.tableOptions = {
                page: 1,
                itemsPerPage: 10
            }
            this.getProductionPlaces();
        }, 1000), // debounce delay,

        async getProductionPlaces(opt = null) {
            this.loading = true;
            const requestParams = {
                page: this.options.page,
                limit: this.options.limit,
                diligenceReportId: this.diligenceId,
                removed: false,
                searchPhrase: this.search,
                eudrDeforestationStatus:this.statusModel,
                farmCountry:this.countryModel,
                farmOwner:this.producerModel
            };
            if (opt?.sortBy?.length) {
                requestParams.orderField = opt.sortBy[0];
                requestParams.order = opt.sortDesc[0] ? "DESC" : "ASC";
            }
            await DeforestationService.getProductionPlaces(requestParams)
                .then((res) => {
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
                        .filter((item) => {
                            return item.farm.userDdsAssoc.firstName;
                        })
                        .map((item) => {
                            const fullName = `${item.farm.userDdsAssoc.firstName
                                ? item.farm.userDdsAssoc.firstName
                                : ""
                                } ${item.farm.userDdsAssoc.lastName ? item.farm.userDdsAssoc.lastName : ""
                                }`;
                            return {
                                text: `${fullName}`,
                                val: `${item.farm.userDdsAssoc.firstName}`,
                            };
                        });
                    // this.countries = [...this.countries, ...countryLists];
                    this.allProducers = [...this.allProducers, ...producerList];
                    this.loading = false;
                })
                .catch((err) => {
                    this.loading = false;
                    console.log("Error", err);
                });
        },

        async getRemovedProductionPlaces(opt = null) {
            this.loading = true;
            const requestParams = {
                page: this.removedProductionPlaceOptions.page,
                limit: 10,
                diligenceReportId: this.diligenceId,
                removed: true,
                eudrDeforestationStatus:this.statusModel,
                farmCountry:this.countryModel,
                farmOwner:this.producerModel
            };
            if (opt?.sortBy?.length) {
                requestParams.orderField = opt.sortBy[0];
                requestParams.order = opt.sortDesc[0] ? "DESC" : "ASC";
            }

            await DeforestationService.getProductionPlaces(requestParams)
                .then((res) => {
                    this.removedProductionPlaces = res.data.productionPlaces.rows.map((item) => {
                        const deforestationInfo = item.diligenceReportProductionPlaceArray?.[0]?.productionPlaceDeforestationInfo;
                        return {
                        ...item,
                        deforestationInfo,
                        deforestationStatus: deforestationInfo?.deforestationStatus,
                        isExpired: isDeforestationExpired(deforestationInfo?.deforestationStatusDate, this.get_EUDR_Settings),
                        errorStatus: deforestationInfo?.deforestationReport?.errorStatus
                        };
                    });

                    this.totalRemovedProductionPlaces =
                        res.data.productionPlaces.totalCount;
                    this.removedFrom =
                        (this.removedProductionPlaceOptions.page - 1) *
                        this.removedProductionPlaceOptions.limit +
                        1;
                    this.removedTo =
                        this.removedProductionPlaceOptions.page *
                        this.removedProductionPlaceOptions.limit;

                    if (this.removedProductionPlaces.length > 0) {
                        this.removedTo -=
                            this.removedProductionPlaceOptions.limit -
                            this.removedProductionPlaces.length;
                    } else {
                        this.removedTo -= this.removedProductionPlaceOptions.limit;
                    }
                    this.loading = false;
                })
                .catch((err) => {
                    this.loading = false;
                    console.log("Error", err);
                });
        },

        async updateDeclaration() {
            const updatedEudrSettings = {
            declarations: this.eudrSettings.declarations.map((declaration, index) => ({
                ...declaration,
                isEnabled: this.declarationResponses[index],
            })),
       
    };
    
    console.log(updatedEudrSettings, 'updatedEudrSettings');

    try {
        this.startLoading();
        // Call the updateEudrSettings method with the correct parameters
        const response = await DeforestationService.updateEudrSettings(this.eudrSettings.id, updatedEudrSettings);
        this.isEnabled = response.data.updateEudrSetting.declarations[0].isEnabled;
        
        // console.log( response.data.updateEudrSetting.declarations[0].isEnabled, 'response from updateEudrSettings');
       this.stopLoading();

    } catch (error) {
        this.stopLoading();
        console.error(error, 'error updating EudrSettings');
    }
        },

    },
    data() {
        return {

            logo: '',
            countries: [...getCountries()],
            menus: [
                { title: this.$t('dueDiligence.viewDeforestationAssessment'), id: "assessment" },
                { title: this.$t('dueDiligence.viewDeforestationCertificate'), id: "compliance" },
            ],
            showDisputeModal: false,
            showMitigtionModal: false,
            progressValue: 0,
            eudrSettings: {},
            farm: {
                name: "",
                registrationNo: "",
                govRegistrationNo: "",
                farmType: "",
                farmOwner: null,
                lat: "",
                log: "",
                farmOwnershipType: "personal",
                country: "",
                state: "",
                city: "",
                countryId: null,
                stateId: null,
                cityId: null,
                address: "",
                area: "",
                areaUomId: 2,
                parameter: 0,
                parameterUomId: 0,
                street: "",
                farmSize: 0,
                farmSizeUomId: 0,
                farmPerimeter: 0,
                farmPerimeterUomId: 1,
                farmGeofence: [],
                farmingGoalOptId: null,
                productionType: "",
                certifications: [],
                farmingGoalsIds: [],
                farmerFirstName: "",
                farmerMiddleName: "",
                farmerLastName: "",
                isTechnician: false,
                technicianId: null,
                farmerId: "",
                userId: "",
                farmGeofenceName: "",
                farmGeofenceCategory: "",
                farmTitleDocument: "",
                farmTitleDocumentUrl: "",
            },
            countryModel: [],
            statusModel: "",
            producerModel: "",

            allStatus: [
                { text: this.$t("deforestation.allStatus"), val: ""},
                { text: this.$t("deforestation.veryHighDeforestationProbability"), val: "Very High Deforestation Probability"},
                { text: this.$t("deforestation.highDeforestationProbability"), val: "High Deforestation Probability" },
                { text: this.$t("deforestation.mediumDeforestationProbability"), val: "Medium Deforestation Probability" },
                { text: this.$t("deforestation.lowDeforestationProbability"), val: "Low Deforestation Probability" },
                { text: this.$t("deforestation.veryLowDeforestationProbability"), val: "Very Low Deforestation Probability" },
                { text: this.$t("deforestation.zeroNegligibleDeforestationProbability"), val: "Zero/Negligible Deforestation Probability"},
                { text: this.$t("deforestation.manuallyMitigated"), val: "Manually Mitigated" },
            ],
            allProducers: [{ text: this.$t("deforestation.allProducer"), val: "" }],
            productionPlaces: [],
            removedProductionPlaces: [],
            totalProductionPlaces: 0,
            totalRemovedProductionPlaces: 0,
            copyReport: [],
            loading: true,
            tab: 0,
            selectedItem: false,
            search: "",
            from: 0,
            to: 0,
            removedFrom: 0,
            removedTo: 0,
            items: [{ id: 'pdf', title: 'Download as PDF' }, { id: 'json', title: 'Download as JSON' }],
            euUpload: false,
            expectedArrivalDate: false,

            options: {
                page: 1,
                limit: 10,
            },
            optionsRemoved: {
                page: 1,
                limit: 10,
            },

            removedProductionPlaceOptions: {
                page: 1,
                limit: 10,
            },
            deforestationComplianceReports: [],
            totalDeforestationComplianceReports: 0,
            breadcrumbs: [
                {
                    text: this.$t("dashboard"),
                    disabled: true,
                    to: "/",
                },
                {
                    text: 'Due Diligence',
                    disabled: true,
                    to: "breadcrumbs_link_1",
                },
                {
                    text: 'Create New Report',
                    disabled: true,
                    to: "breadcrumbs_link_1",
                },
            ],
            shipment: {
                exporter: '',
                importer: '',
                shipmentRefrenceNumber: '',
                ownershipType: '',
                buyer: '',

                partOfOrigin: '',
                partOfDestination: '',
                stops: [{
                    model: ''
                }],

                shippingLine: '',

                expectedArrivalDate: '',
                containerId: '',
                containerType: ''
            },
            shipmentRules: {
                exporter: [],
                importer: [],
                shipmentRefrenceNumber: [],
                ownershipType: [],
                buyer: [],

                partOfOrigin: [],
                partOfDestination: [],
                shippingLine: [],
                expectedArrivalDate: [],
                containerId: [],
                containerType: []
            },

            removedFarmHeader: [
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
                    value: "farm.userDdsAssoc.fullName",
                    class: "black--text",
                    sortable: true,
                },

                {
                    text: this.$t("deforestation.addressOfProduction"),
                    align: "start",
                    value: "farm.address",
                    class: "black--text",
                    sortable: true
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
                    align: "start",
                    value: "farmType",
                    class: "black--text",
                    sortable: true,
                },
                {
                    text: this.$t("deforestation.EUDRDeforestationStatus"),
                    align: "start",
                    value: "eudr_deforestation_status",
                    class: "black--text",
                    sortable: true,
                },
                {
                    text: '',
                    align: "start",
                    value: "sts",
                    class: "black--text",
                    sortable: false,
                }
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
                    text: this.$t('dueDiligence.actions'),
                    align: "center",
                    value: "status",
                    class: "black--text",
                    sortable: false,
                },
            ],

            productionPlaceInput: {
                page: 1,
                limit: 10,
                searchPhrase: "",
                internalRefNum: "",
                farmCountry: "",
                eudrDeforestationStatus: "",
                farmOwner: "",
                filterByDateOfRegister: null,
                filterByDateOfLastReport: null
            },



            removedFarmList: [
                {
                    id: 1,
                    productionPlaceFarmID: 'Gold Farm',
                    producerName: 'Ava Gracia',
                    addressOfProduction: '49 Featherstone',
                    areaHA: '10',
                    type: 'Print',
                    eudrDeforestationStatus: 'High Probability',

                }
            ],
            totalReports: 2,
            report: {
                supplier: {},
                operator: {},
                whoAddPlaceData: 'operator',
                assessment: {
                    selectedCountries: [],
                    selectedAssessments: [],
                    assessments: [],
                },
                companyID: '',
                EUDRReferenceNumber: '',
                internalReferenceNumber: '',
                activity: 'Domestic',
                countryOfEntry: '',
                countryOfActivity: '',
                countryOfProduction: [],
                product: '',
                subProduct: '',
                productDescription: '',
                productNetMass: '',
                productVolume: '',
                productScientificName: '',
                productCommonName: '',
                encId: '',
                blockchainLink: ''
            },
            productList: [],
            producerLists: [],
            regionModel: '',
            allRegions: [
                { text: this.$t('deforestation.allRegions'), val: '' },
            ],
            geofenceCount: {
                point: 0,
                polygon: 0
            },
            totalFarmArea: 0,
            totalAssessmentCount: 0,
            totalHighDeforestationCount: 0,
            totalRiskAssessmentCount: 0,
            productionPlaceData: [],
            declarationResponses: [],
            uploadedFile: null,
            s3Location: "",
            uploadedFileName: "",
            fileError: "No error",
            s3key: "",
            uploadFileType: "",
            fileUploaded: false,
            targetedProductionPlaceId: null,
            targetProductionPlace: null,
            risk: false,
            reportLoading: true,
            highRiskComment: null,
            farmConfirmDeleteDialog : false,
            farmConfirmDelete: {
            title: this.$t("confirmDialog.farm.delete.title"),
            message: this.$t("confirmDialog.farm.delete.message"),
            confirmBtnText: this.$t("confirmDialog.farm.delete.confirmBtn"),
            cancelBtnText: this.$t("cancel"),
            confirmData: {},
      },
      isEnabled: false,

        };
    },
    mixins: [loadingMixin, getPermittedActions, DownloadMixin]
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
    color: #135B00;
}


.dropZone {
    width: 100%;
    height: 150px;
    position: relative;
    border: 2px dashed #97A8B8;
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
    color: #A8A8A8;
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
    background: #5C5C5C;
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
    color: #A8A8A8;
    position: absolute;
    top: 50%;
    width: 100%;
    transform: translate(0, -50%);
    text-align: center;
    overflow: clip;
}

.primary-color {
    color: #00BD73;
}

.gray-color {
    background: #DCDCDC80;
}

.removed-background {
    padding: 15px;
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

    & > p {
        margin-bottom: 16px;
    }
}

#blockchain-qr, #public-qr {
    min-width: 140px;
    margin-right: 1rem;
}

.blockchain-text {
    padding-left: 1rem;
}

::v-deep .right-border-light {
    border-right: 1px solid lightgray;
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
</style>