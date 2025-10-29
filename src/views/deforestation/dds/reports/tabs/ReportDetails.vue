<template>
  <div v-if="isSupplier">
    <v-container fluid>
      <div class="cmt-box">
        <v-card elevation="0">
          <v-card class="mb-5" flat>
            <v-card-text>
              <v-row class="pl-3">
                <v-col sm="3">
                  <div class="item-box">
                    <p class="text-subtitle-1 mb-2">
                      {{ $t("dueDiligence.internalReferenceNumber") }}
                      <v-tooltip top color="00BD73" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon class="icon-with-background primary--text" v-bind="attrs" v-on="on">
                            mdi-alert-circle
                          </v-icon>
                        </template>
                        <span>{{ $t('dueDiligence.fRinternalReferenceNumberTT') }}</span>
                      </v-tooltip>
                    </p>
                    <p class="text-subtitle-1 font-weight-bold">{{ dueDiligence.internalReferenceNumber || '-'}}</p>
                  </div>
                </v-col>

                <v-col sm="3">
                  <div class="item-box">
                    <p class="text-subtitle-1 mb-2">
                      {{ $t("deforestation.eudrRefNo") }}
                      <v-tooltip top color="00BD73" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon class="icon-with-background primary--text" v-bind="attrs" v-on="on">
                            mdi-alert-circle
                          </v-icon>
                        </template>
                        <span>{{ $t('dueDiligence.eudrRefNoTT') }}</span>
                      </v-tooltip>
                    </p>
                    <p class="text-subtitle-1 font-weight-bold">{{ dueDiligence.EUDRReferenceNumber || '-'}}</p>
                  </div>
                </v-col>

                <v-col sm="3">
                  <div class="item-box">
                    <p class="text-subtitle-1 mb-2">
                      {{ $t("deforestation.activity") }}
                    </p>
                    <p class="text-subtitle-1 font-weight-bold">{{ dueDiligence.activity || '-'}}</p>
                  </div>
                </v-col>

                <v-col sm="3">
                  <div class="item-box">
                    <p class="text-subtitle-1 mb-2">
                      {{ $t("deforestation.countryOfActivity") }}
                    </p>
                    <p class="text-subtitle-1 font-weight-bold">
                      {{ dueDiligence.countryOfActivity &&  dueDiligence.countryOfActivity.length ? dueDiligence.countryOfActivity.join(',') : '-'}}
                    </p>
                  </div>
                </v-col>

                <v-col sm="3">
                  <div class="item-box">
                    <p class="text-subtitle-1 mb-2">
                      {{ $t("deforestation.countryOfEntry") }}
                    </p>
                    <p class="text-subtitle-1 font-weight-bold">{{ dueDiligence.countryOfEntry || '-'}}</p>
                  </div>
                </v-col>

                <v-col sm="3">
                  <div class="item-box">
                    <p class="text-subtitle-1 mb-2">
                      {{ $t("dueDiligence.dueDiligenceReportStatus") }}
                    </p>

                    <v-chip variant="elevated" v-if="dueDiligence.status=='Pending'" color="gray" outlined>
                      {{ dueDiligence.status || '-'}}
                    </v-chip>
                    <v-chip variant="elevated" v-else-if="dueDiligence.status=='Compliant'" color="green" outlined>
                      {{ dueDiligence.status || '-'}}
                    </v-chip>
                    <v-chip v-else variant="elevated" color="red" outlined>
                      {{ dueDiligence.status || '-'}}
                    </v-chip>
                  </div>
                </v-col>
              </v-row>

              <v-row class="pl-3">
                <v-col sm="12">
                  <div class="item-box">
                    <h2 class="font-weight-bold">
                      {{ $t("dueDiligence.operatorData") }}
                      <v-tooltip top color="00BD73" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon class="icon-with-background primary--text" v-bind="attrs" v-on="on">
                            mdi-alert-circle
                          </v-icon>
                        </template>
                        <span>{{ $t('dueDiligence.operatorDataTT') }}</span>
                      </v-tooltip>
                    </h2>
                  </div>
                </v-col>
                <v-col sm="3">
                  <div class="item-box">
                    <p class="text-subtitle-1 mb-2">{{ $t("name") }}</p>
                    <p class="text-subtitle-1 font-weight-bold">
                      {{ dueDiligence.operator?.firstName || ""}} {{ dueDiligence.operator?.lastName || ""}}
                    </p>
                  </div>
                </v-col>

                <v-col sm="3">
                  <div class="item-box">
                    <p class="text-subtitle-1 mb-2">{{ $t("country") }}</p>
                    <p class="text-subtitle-1 font-weight-bold">{{ dueDiligence.operator?.countryId || '-'}}</p>
                  </div>
                </v-col>

                <v-col sm="3">
                  <div class="item-box">
                    <p class="text-subtitle-1 mb-2">
                      {{ $t("dueDiligence.isoCode") }}
                    </p>
                    <p class="text-subtitle-1 font-weight-bold">-</p>
                  </div>
                </v-col>

                <v-col sm="3">
                  <div class="item-box">
                    <p class="text-subtitle-1 mb-2">
                      {{ $t("deforestation.eoriNumber") }}
                    </p>
                    <p class="text-subtitle-1 font-weight-bold">
                      {{ dueDiligence.operator?.eori_number || '-'}}
                    </p>
                  </div>
                </v-col>
              </v-row>

              <v-row class="pl-3">
                <v-col sm="12">
                  <div class="item-box">
                    <h2 class="font-weight-bold">
                      {{ $t("deforestation.productDetail") }}
                      <v-tooltip top color="00BD73" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon class="icon-with-background primary--text" v-bind="attrs" v-on="on">
                            mdi-alert-circle
                          </v-icon>
                        </template>
                        <span>{{ $t('dueDiligence.supplierDataTT') }}</span>
                      </v-tooltip>
                    </h2>
                  </div>
                </v-col>
                <v-col sm="3">
                  <div class="item-box">
                    <p class="text-subtitle-1 mb-2">
                      {{ $t("deforestation.product") }}
                      <v-tooltip top color="00BD73" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon class="icon-with-background primary--text" v-bind="attrs" v-on="on">
                            mdi-alert-circle
                          </v-icon>
                        </template>
                        <span>{{ $t('dueDiligence.productTT') }}</span>
                      </v-tooltip>
                    </p>
                    <p class="text-subtitle-1 font-weight-bold">
                      {{ dueDiligence?.product_detail?.name || '-'}}
                    </p>
                  </div>
                </v-col>

                <v-col sm="3">
                  <div class="item-box">
                    <p class="text-subtitle-1 mb-2">
                      {{ $t("deforestation.productionDescription") }}
                      <v-tooltip top color="00BD73" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon class="icon-with-background primary--text" v-bind="attrs" v-on="on">
                            mdi-alert-circle
                          </v-icon>
                        </template>
                        <span>{{ $t('dueDiligence.productDescriptionTT') }}</span>
                      </v-tooltip>
                    </p>
                    <p class="text-subtitle-1 font-weight-bold">
                      {{ dueDiligence.productDescription || '-'}}
                    </p>
                  </div>
                </v-col>

                <v-col sm="3">
                  <div class="item-box">
                    <p class="text-subtitle-1 mb-2">
                      {{ $t("deforestation.netMass") }} (kg)
                      <v-tooltip top color="00BD73" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon class="icon-with-background primary--text" v-bind="attrs" v-on="on">
                            mdi-alert-circle
                          </v-icon>
                        </template>
                        <span>{{ $t('dueDiligence.netMassTT') }}</span>
                      </v-tooltip>
                    </p>
                    <p class="text-subtitle-1 font-weight-bold">
                      {{ dueDiligence.productNetMass || '-'}}
                    </p>
                  </div>
                </v-col>

                <v-col sm="3">
                  <div class="item-box">
                    <p class="text-subtitle-1 mb-2">
                      {{ $t("deforestation.volume") }} (m3)
                      <v-tooltip top color="00BD73" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon class="icon-with-background primary--text" v-bind="attrs" v-on="on">
                            mdi-alert-circle
                          </v-icon>
                        </template>
                        <span>{{ $t('dueDiligence.volumeTT') }}</span>
                      </v-tooltip>
                    </p>
                    <p class="text-subtitle-1 font-weight-bold">{{ dueDiligence.productVolumn || '-'}}</p>
                  </div>
                </v-col>
                <v-col sm="3">
                  <div class="item-box">
                    <p class="text-subtitle-1 mb-2">
                      {{ $t("deforestation.scietificName") }}
                      <v-tooltip top color="00BD73" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon class="icon-with-background primary--text" v-bind="attrs" v-on="on">
                            mdi-alert-circle
                          </v-icon>
                        </template>
                        <span>{{ $t('dueDiligence.scientificNameTT') }}</span>
                      </v-tooltip>
                    </p>
                    <p class="text-subtitle-1 font-weight-bold">{{ dueDiligence.productScientificName || '-'}}</p>
                  </div>
                </v-col>
                <v-col sm="3">
                  <div class="item-box">
                    <p class="text-subtitle-1 mb-2">
                      {{ $t("deforestation.commonName") }}
                      <v-tooltip top color="00BD73" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon class="icon-with-background primary--text" v-bind="attrs" v-on="on">
                            mdi-alert-circle
                          </v-icon>
                        </template>
                        <span>{{ $t('dueDiligence.commonNameTT') }}</span>
                      </v-tooltip>
                    </p>
                    <p class="text-subtitle-1 font-weight-bold">{{ dueDiligence.productCommonName || '-'}}</p>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-card>
      </div>
    </v-container>
<div>
 
</div>
  </div>
 <div v-else>
    <v-form
      ref="addReportForm"
      v-model="addReportFormValid"
      lazy-validation
      @submit.prevent="saveFormData"
    >
    <v-card elevation="0" v-if="isIndonesianClient || isKenyaClient">
      <v-card-text>
        <!-- Share Report Section -->
        <v-row class="mb-4">
          <v-col cols="12">
            <div class="d-flex align-center justify-space-between">
              <h3 class="text-h6 font-weight-bold mb-0 d-flex align-center">
               {{ isKenyaClient ? $t('deforestation.shareReportKenya') :$t('deforestation.shareReport') }} <div class="text-body-1 mx-4 d-flex align-center mr-3">{{ $t('deforestation.enabled') }} <v-switch
                v-model="report.shareReportEnabled"
                color="primary"
                inset
                hide-details
                class="ma-0 ml-3"
                @change="handleShareReportToggle"
              ></v-switch></div>
              </h3>
            </div>
          </v-col>
        </v-row>

        <v-divider class=""></v-divider>

        <!-- Exporter Information Section -->
        <v-row v-if="report.shareReportEnabled" class="mt-6">
          <v-col cols="12">
            <h3 class="mb-4">
              {{ isKenyaClient ? $t('deforestation.exporterInformationKenya') : $t('deforestation.exporterInformation')  }}  
            </h3>
          </v-col>
        </v-row>

        <v-row v-if="report.shareReportEnabled" class="d-flex align-center">
          <v-col cols="6" md="4">
            <label for="text">
              {{ isKenyaClient ? $t('deforestation.enterExporterEmailKenya') : $t('deforestation.enterExporterEmail') }}
            </label>
            <v-text-field
              v-model="report.exporterEmail"
              v-bind="getTextFieldProps()"
              dense
              :placeholder="isKenyaClient ? $t('deforestation.enterExporterEmailKenya') :$t('deforestation.enterExporterEmail')"
              hide-details
              class="mb-4"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4" class="">
            <v-btn
              color="primary"
              class="mt-2"
              @click="searchExporter"
              :loading="searchingExporter"
            >
              {{ $t('search') }}
            </v-btn>
          </v-col>
        </v-row>

        <!-- Exporter Details Table -->
        <v-row v-if="exporterDetails && Object.keys(exporterDetails).length > 0 && report.shareReportEnabled">
          <v-col cols="12" sm="6" md="2">
            <div class="grey--text">
              {{ $t('deforestation.name')}}
            </div>
            <div class="text-body-1 font-weight-medium">
              {{ exporterDetails.name || '-' }}
            </div>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <div class="grey--text">
              {{ $t('deforestation.email')}}
            </div>
            <div class="text-body-1 font-weight-medium">
              {{ exporterDetails.email || '-' }}
            </div>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <div class="grey--text">
              {{ $t('deforestation.phoneNumber')}}
            </div>
            <div class="text-body-1 font-weight-medium">
              {{ exporterDetails.phoneNumber || '-' }}
            </div>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <div class="grey--text">
              {{ $t('deforestation.country')}}
            </div>
            <div class="text-body-1 font-weight-medium">
              {{ exporterDetails.country || '-' }}
            </div>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <div class="grey--text">
              {{ $t('deforestation.status')}}
            </div>
            <div class="text-body-1 font-weight-medium">
              {{ exporterDetails.status || '-' }}
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
      <v-card elevation="0" class="px-0">
        <v-card-text>
          <!-- operator owner module  -->
          <template v-if="isOperatorOwner">
            <v-row class="mt-5">
              <v-col cols="4">
                <h3 class="mb-5">
                  {{ $t("deforestation.supplierInformation") }}

                  <v-tooltip bottom color="00BD73" max-width="500">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      class="icon-with-background primary--text"
                      style="color:#0EBF67"
                      v-bind="attrs"
                      v-on="on"
                    >
                      mdi-alert-circle
                    </v-icon>
                  </template>
                  <p>
                    {{ $t("dueDiligence.supplierInformationTT") }}
                  </p>
                </v-tooltip>
                </h3>
         
                <label for="text">
                  {{ $t("deforestation.supplier") }}
                </label>
                <v-tooltip bottom color="00BD73" max-width="500">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      class="icon-with-background primary--text"
                      style="color:#0EBF67"
                      v-bind="attrs"
                      v-on="on"
                    >
                      mdi-alert-circle
                    </v-icon>
                  </template>
                      <span>{{ $t("dueDiligence.supplierTooltip") }}</span>
                </v-tooltip>
                <v-autocomplete
                  :rules="addReportFormRules.supplierId"
                  v-model="report.supplier"
                  item-text="fullName"
                  item-value="id"
                  :items="formattedSupplier"
                  dense
                  return-object
                  :placeholder="$t('select')"
                  v-bind="getSelectProps()"
                >
                  <!-- Add a footer slot -->
                  <template v-slot:append-item>
                    <div class="add-supplier">
                        <v-divider></v-divider>
                        <v-list-item @click="addNewSupplierDialog = true">
                            <v-list-item-content style="color:#0EBF67">
                                <v-list-item-title>
                                  <v-icon class="icon-with-background primary--text" style="color:#0EBF67">
                                      mdi-plus-circle
                                  </v-icon>
                                  <span class="ml-5">{{ $t('deforestation.addNewSupplier') }}</span>
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </div>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="8"> </v-col>
            </v-row>

            <v-row>
              <v-col cols="2">
                {{ $t("deforestation.name") }}
                <h3 style="color:black">{{ report?.supplier?.fullName }}</h3>
              </v-col>
              <v-col cols="2">
                {{ $t("deforestation.email") }}
                <h3 style="color:black">{{ report?.supplier?.email }}</h3>
              </v-col>
              <v-col cols="2">
                {{ $t("deforestation.phoneNumber") }}
                <!-- Block 3 content -->
                <h3 style="color:black">{{ report?.supplier?.mobile }}</h3>
              </v-col>
              <v-col cols="2">
                {{ $t("deforestation.country") }}
                <h3 style="color:black">{{ report?.supplier?.countryId }}</h3>
                <!-- Block 4 content -->
              </v-col>
              <v-col cols="2">
                {{ $t("deforestation.status") }}
                <h3
                  style="color:black"
                  v-if="
                    report.supplier &&
                      typeof report.supplier.verified !== 'undefined'
                  "
                >
                  {{
                    report.supplier.verified == 0
                      ? $t('deforestation.unregistered')
                      : $t('deforestation.registered')
                  }}
                </h3>
                <h3 style="color:black" v-else></h3>
                <!-- Block 5 content -->
              </v-col>
            </v-row>
          </template>

          <!-- supplier owner module -->
          <template v-else-if="isIndonesianClient || isKenyaClient  ? (isSupplierOwner && !report.shareReportEnabled) :  isSupplierOwner">
            <v-row class="">
              <v-col cols="4">
                <h3 class="mb-5">{{$t('deforestation.operatorInformation')}}

                  <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                        mdi-alert-circle
                      </v-icon>
                    </template>
                    <span>{{ $t("dueDiligence.supplierInformationTT") }}</span>
                  </v-tooltip>
                </h3>
                
                <label for="text">
                  {{$t('deforestation.operator')}}
                  <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon size="medium" class="icon-with-background primary--text " style="color:#0EBF67" v-bind="attrs" v-on="on">
                        mdi-alert-circle
                      </v-icon>
                    </template>
                    <span>{{ $t("dueDiligence.operatorTooltip") }}</span>
                  </v-tooltip>
                </label>
                <v-autocomplete
                  :loading="supplierOperatorLoading"
                  :rules="addReportFormRules.operatorId"
                  v-model="report.operator"
                  item-text="fullName"
                  item-value="id"
                  :items="formattedOperator"
                  dense
                  return-object
                  :placeholder="$t('select')"
                  v-bind="getSelectProps()"
                >
                  <!-- Add a footer slot -->
                  <template v-slot:append-item>

                    <div class="add-supplier">
                        <v-divider></v-divider>
                        <v-list-item @click="operatorCreateDialog = true">
                            <v-list-item-content style="color:#0EBF67">
                                <v-list-item-title> <v-icon :class="isIndonesianClient ? 'icon-with-background ptsi-brand' : isKenyaClient ? ' kenya-brand' :   'icon-with-background non-ptsi-brand'">
                                        mdi-plus-circle
                                    </v-icon><span :class="isIndonesianClient ? 'ml-5 ptsi-brand' : isKenyaClient ? 'ml-5 kenya-brand' : 'ml-5 non-ptsi-brand'">{{ $t('dueDiligence.addNewOperator')
                                    }}</span></v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </div>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="8"> </v-col>
            </v-row>
            <v-row>
              <v-col cols="2">
                {{ $t("deforestation.name") }}
                <h3 style="color:black">{{ report.operator?.fullName }}</h3>
              </v-col>
              <v-col cols="2">
                {{ $t("deforestation.email") }}
                <h3 style="color:black">{{ report.operator?.email }}</h3>
              </v-col>
              <v-col cols="2">
                {{ $t("deforestation.country") }}
                <h3 style="color:black">{{ report.operator?.countryId }}</h3>
              </v-col>
              <v-col cols="2">
                {{ $t("dueDiligence.isoCode") }}
                <h3 style="color:black">
                  {{ report.operator?.countryIsoCode }}
                </h3>
              </v-col>
              <v-col cols="2">
                {{ $t("deforestation.eoriNumber") }}
                <h3 style="color:black">{{ report.operator?.eori_number }}</h3>
              </v-col>
              <v-col cols="2">
                {{ $t("deforestation.status") }}
                <h3
                  style="color:black"
                  v-if="
                    report.operator &&
                      typeof report.operator?.verified !== 'undefined'
                  "
                >
                  {{
                    report.operator?.verified == 0
                      ? $t('deforestation.unregistered')
                      : $t('deforestation.registered')
                  }}
                </h3>
                <h3 style="color:black" v-else></h3>
                <!-- Block 5 content -->
              </v-col>
            </v-row>
          </template>



          <v-row class="" v-if="isOperatorOwner">
            <v-col cols="12">
              <v-divider class="mt-5 mb-5"></v-divider>
            </v-col>
            <v-col cols="12">
              <h3 style="color:black">
                {{ $t("deforestation.whoWillAddPlace") }}
                <v-tooltip bottom color="00BD73" max-width="500">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      class="icon-with-background primary--text "
                      style="color:#0EBF67"
                      v-bind="attrs"
                      v-on="on"
                    >
                      mdi-alert-circle
                    </v-icon>
                  </template>
                  <p>
                    <b>{{ $t("dueDiligence.selectWhoWillAddPlaceData") }}</b>
                  </p>
                  <ul>
                    <li>
                      <span>{{ $t("dueDiligence.operatorSelect") }}</span>
                    </li>
                    <li class="mt-5">
                      <span>{{ $t("dueDiligence.supplierSelect") }}</span>
                    </li>
                  </ul>
                </v-tooltip>
              </h3>
            </v-col>

            <v-col cols="12">
              <v-radio-group  :rules="addReportFormRules.whoAddPlaceData" v-model="report.whoAddPlaceData" v-bind="getRadioGroupProps()" row>
                <v-radio :label="$t('dueDiligence.operator')" value="operator"></v-radio>
                <v-radio :label="$t('dueDiligence.supplier')" value="supplier"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card elevation="0" class="px-0 pb-5">
        <v-card-text>
          <template>
            <v-row>
              <v-col cols="12" sm="6" md="3">
                <h3 style="color:black">
                  {{ isKenyaClient ? $t("deforestation.internalRefNoKenya"):  $t("deforestation.internalRefNo")  }}
                  <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        class="icon-with-background primary--text"
                        style="color:#0EBF67"
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-alert-circle
                      </v-icon>
                    </template>
                    <span>{{ $t("dueDiligence.internalRefNoTooltip") }}</span>
                  </v-tooltip>
                </h3>
                <v-text-field
                  :placeholder='isKenyaClient ?  $t("deforestation.internalRefNoKenya") :  $t("deforestation.internalRefNo")'
                  v-model="report.internalReferenceNumber"
                  v-bind="getTextFieldProps()"
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <h3 style="color:black">
                  {{ $t("deforestation.eudrRefNo") }}
                  <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        class="icon-with-background primary--text"
                        style="color:#0EBF67"
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-alert-circle
                      </v-icon>
                    </template>
                    <span>{{ $t("dueDiligence.eudrRefNoTooltip") }}</span>
                  </v-tooltip>
                </h3>
                <v-text-field
                  readonly
                  :placeholder="$t('dueDiligence.referenceNumber')"
                  v-model="report.EUDRReferenceNumber"
                  color="grey"
                  outlined
                  dense
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="3">
                <h3 style="color:black">
                  {{ $t("deforestation.eudrVerificationNo") }}
                  <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        class="icon-with-background primary--text"
                        style="color:#0EBF67"
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-alert-circle
                      </v-icon>
                    </template>
                    <span>{{ $t("deforestation.eudrVerificationNoTT") }}</span>
                  </v-tooltip>
                </h3>
                <v-text-field
                 :append-icon="showVerification ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showVerification ? 'text' : 'password'"
                  readonly
                  :placeholder="$t('deforestation.eudrVerificationNo')"
                  v-model="report.eudrVerificationNo"
                  color="grey"
                  outlined
                  dense
                     @click:append="showVerification = !showVerification"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="3">
                <!-- Block 3 content -->
                <h3 style="color:black">
                  {{ $t("deforestation.companyId") }}
                  <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        class="icon-with-background primary--text"
                        style="color:#0EBF67"
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-alert-circle
                      </v-icon>
                    </template>
                    <span>{{ $t("dueDiligence.companyIdTooltip") }}</span>
                  </v-tooltip>
                </h3>
                <v-text-field
                  readonly
                  :placeholder="'DC-000078625'"
                  color="grey"
                  v-model="report.companyID"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="">
              <v-col cols="12">
                <h3 style="color:black">{{ $t("deforestation.activity") }}</h3>
              </v-col>

              <v-col cols="12">
                <v-radio-group v-model="report.activity" v-bind="getRadioGroupProps()" row>
                  <v-radio
                    :label="$t('dueDiligence.domestic')"
                    value="Domestic"
                  ></v-radio>
                  <v-radio
                    :label="$t('dueDiligence.import')"
                    value="Import"
                  ></v-radio>
                  <v-radio
                    :label="$t('dueDiligence.export')"
                    value="Export"
                  ></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>

            <v-row class="">
              <v-col cols="12">
                <h3 style="color:black">
                  {{ $t("deforestation.operatorPlaceOfActivity") }}
                  <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        class="icon-with-background primary--text "
                        style="color:#0EBF67"
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-alert-circle
                      </v-icon>
                    </template>
                    <span>{{ $t("dueDiligence.placeOfActivityTooltip") }}</span>
                  </v-tooltip>
                </h3>
              </v-col>

              <v-col cols="4">
                <label for="text">
                  {{ $t("deforestation.operatorCountryOfActivity") }}
                </label>
                <!-- <v-autocomplete
                  :placeholder="'Select Country'"
                  outlined
                  v-model="report.countryOfActivity"
                  :items="countriesOnly"
                  item-text="name"
                  item-value="name"
                  dense
                  solo
                  flat
                >
                </v-autocomplete> -->
                <v-autocomplete                 
                :label="$t('profileSetting.selectCountry')"
                :placeholder="$t('profileSetting.selectCountry')"
                clearable
                v-model="report.countryOfActivity" :items="europeanCountriesOnly" item-text="translatedName"
                item-value="name" cache-items :search-input.sync="search" dense chips small-chips solo flat
                multiple
                v-bind="getSelectProps()"
                >
                <!-- :rules="[(v) => (Array.isArray(v) && v.length > 0) || $t('deforestation.thisFieldIsRequired')]" -->
                </v-autocomplete>
              </v-col>
              <v-col cols="4">
                <label for="text">
                  {{ $t("deforestation.countryOfEntry") }}
                </label>
                <v-autocomplete
                :label="$t('profileSetting.selectCountry')"
                :placeholder="$t('profileSetting.selectCountry')"
                  v-model="report.countryOfEntry"
                  :items="europeanCountriesOnly"
                  item-text="translatedName"
                  item-value="name"
                  dense
                  solo
                  flat
                  v-bind="getSelectProps()"
                >
                </v-autocomplete>
              </v-col>
            </v-row>
            
            <v-row class="">
              <v-col cols="12">
                <h3 style="color:black">
                  {{ $t("dueDiligence.comments") }}
                  <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        class="icon-with-background primary--text"
                        style="color:#0EBF67"
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-alert-circle
                      </v-icon>
                    </template>
                    <span>{{ $t("dueDiligence.comments") }}</span>
                  </v-tooltip>
                </h3>
              </v-col>
              <v-col cols="8">
                {{$t("dueDiligence.commentsRegardingStatement")	}}
              </v-col>
              <v-col cols="8">
                <v-textarea
                  name="input-7-2"
                  class="v-textarea--outlined"
                  auto-grow
                  v-model="report.comments"
                  v-bind="getTextareaProps()"
                ></v-textarea>
              </v-col>
            </v-row>

              <v-row class="w-33">
                <v-col cols="12">
                  <h3 style="color: #000;" class="font-weight-bold">
                    {{ $t('blends.createBlends.containerInformation') }}
                    <v-tooltip bottom color="00BD73" max-width="500">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                          mdi-alert-circle
                        </v-icon>
                      </template>
                      <span>{{ $t('blends.createBlends.containerInformationTT') }}</span>
                    </v-tooltip>
                  </h3>
                </v-col>

                <v-col cols="4" v-for="(containerId, index) in containers" :key="index">
                  <div class="d-flex justify-space-between mb-1">
                    <div class="text-subtitle-1">
                         {{ isKenyaClient ?  $t('dueDiligence.lotId') :  $t('blends.createBlends.containerId') }}
                      <v-tooltip bottom color="00BD73" max-width="500">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon small class="icon-with-background primary--text pr-2" style="color:#0EBF67" v-bind="attrs" v-on="on">
                            mdi-alert-circle
                          </v-icon>
                        </template>
                        <span>{{ $t('blends.createBlends.containerIdTT') }}</span>
                      </v-tooltip>
                    </div>
                  </div>
                  <div class="d-flex align-center">
                    <v-text-field
                      v-model="containers[index]"
                      v-bind="getTextFieldProps()"
                      dense
                      :placeholder="isKenyaClient ? $t('dueDiligence.lotId') :  $t('blends.createBlends.containerId')"
                      :error-messages="errors[index] ? [$t('blends.createBlends.uniqueContainerId')] : []"
                      hide-details="auto"
                      class="input-field"
                      @input="saveContainers"
                    ></v-text-field>
                    <v-btn v-if="index >= 1" color="red" icon class="ml-2" @click="removeContainer(index)">
                      <v-icon class="remove-icon" color="white">mdi-close</v-icon>
                    </v-btn>
                  </div>
                </v-col>

                <v-col cols="12">
                  <div
                  class="d-flex align-center"
                  style="cursor: pointer;"
                  @click="addContainer"
                >
                  <v-icon
                    color="white"
                    style="background-color: var(--primary-color); border-radius: 50%; padding: 4px; font-size: 18px; margin-right: 8px; color: #fff !important;"
                  >
                    mdi-plus
                  </v-icon>
                  <span style="color: #000; font-weight: 500;">
                    {{ $t('blends.createBlends.addContainer') }}
                  </span>
                </div>
                </v-col>
              </v-row>

            <v-divider class="mt-5 mb-5"></v-divider>
            <v-row class="">
              <v-col cols="12">
                <h3 style="color:black">
                  {{ $t("deforestation.productDetail") }}
                  <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        class="icon-with-background primary--text"
                        style="color:#0EBF67"
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-alert-circle
                      </v-icon>
                    </template>
                    <span>{{ $t("dueDiligence.productDetailToolTip") }}</span>
                  </v-tooltip>
                </h3>
              </v-col>

              <v-col cols="4">
                <label for="text">
                  {{ $t("deforestation.product") }}
                </label>
                <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        class="icon-with-background primary--text"
                        style="color:#0EBF67"
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-alert-circle
                      </v-icon>
                    </template>
                    <span>{{ $t("dueDiligence.productToolTip") }}</span>
                  </v-tooltip>
                <v-autocomplete
                  @change="onProductChange"
                  :rules="[(v) => !!v || this.$t('deforestation.thisFieldIsRequired')]"
                  :placeholder="$t('dueDiligence.selectProduct')"
                  v-model="report.product"
                  :items="productList"
                  item-text="name"
                  item-value="id"
                  dense
                  solo
                  flat
                  return-object
                  v-bind="getSelectProps()"
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="4">
                <label for="text">
                  {{ $t("deforestation.subProduct") }}
                </label>
                <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        class="icon-with-background primary--text"
                        style="color:#0EBF67"
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-alert-circle
                      </v-icon>
                    </template>
                    <span>{{ $t("dueDiligence.subProductToolTip") }}</span>
                  </v-tooltip>
                <v-autocomplete
                  :placeholder="$t('dueDiligence.selectSubProduct')"
                  v-model="report.subProduct"
                  :items="subProductList"
                  :disabled="report.product == '' ? true : false"
                  item-text="name"
                  item-value="id"
                  dense
                  solo
                  flat
                  return-object
                  v-bind="getSelectProps()"
                >
                </v-autocomplete>
              </v-col>
            </v-row>
            <v-row class="py-0">
              <v-col cols="8" class="py-0">
                <label for="text">
                  {{ $t("deforestation.productionDescription") }}
                </label>
                <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        class="icon-with-background primary--text"
                        style="color:#0EBF67"
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-alert-circle
                      </v-icon>
                    </template>
                    <span>{{ $t("dueDiligence.productDescToolTip") }}</span>
                  </v-tooltip>
                <v-textarea
                  name="input-7-1"
                  class="v-textarea--outlined"
                  auto-grow
                  v-model="report.productDescription"
                  v-bind="getTextareaProps()"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <label for="text">
                  {{ $t("deforestation.netMass") }}
                </label>
                <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        class="icon-with-background primary--text"
                        style="color:#0EBF67"
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-alert-circle
                      </v-icon>
                    </template>
                    <span>{{ $t("dueDiligence.netMassTooltTip") }}</span>
                  </v-tooltip>
                <v-text-field
                  :rules="addReportFormRules.netMass"
                  :placeholder="$t('deforestation.netMass')"
                  :suffix="eudrSettings.product_mass_unit"
                  v-model="report.productNetMass"
                  v-bind="getTextFieldProps()"
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <label for="text">
                  {{ $t("deforestation.volume") }}
                </label>
                <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        class="icon-with-background primary--text"
                        style="color:#0EBF67"
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-alert-circle
                      </v-icon>
                    </template>
                    <span>{{ $t("dueDiligence.volumeToolTip") }}</span>
                  </v-tooltip>
                <v-text-field
                  :rules="addReportFormRules.volume"
                  :placeholder="$t('deforestation.volume')"
                  :suffix="eudrSettings.volume_unit"
                  v-model="report.productVolume"
                  v-bind="getTextFieldProps()"
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <label for="text">
                  {{ $t("deforestation.scietificName") }}
                </label>
                <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        class="icon-with-background primary--text"
                        style="color:#0EBF67"
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-alert-circle
                      </v-icon>
                    </template>
                    <span>{{ $t("dueDiligence.scientificNameTT") }}</span>
                  </v-tooltip>
                <v-text-field
                  :placeholder="$t('deforestation.scietificName')"
                  v-model="report.productScientificName"
                  v-bind="getTextFieldProps()"
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <label for="text">
                  {{ $t("deforestation.commonName") }}
                </label>
                <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        class="icon-with-background primary--text"
                        style="color:#0EBF67"
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-alert-circle
                      </v-icon>
                    </template>
                    <span>{{ $t("dueDiligence.commonNameToolTip") }}</span>
                  </v-tooltip>
                <v-text-field
                  :placeholder="$t('deforestation.commonName')"
                  v-model="report.productCommonName"
                  v-bind="getTextFieldProps()"
                  dense
                ></v-text-field>
              </v-col>
            </v-row>
            <v-divider class="mt-5 mb-5"></v-divider>
            <v-row class="">
              <v-col cols="12">
                <h3 style="color:black">
                  {{ $t("dueDiligence.selectRequiredAssessment") }}
                  <v-tooltip top color="00BD73" max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        class="icon-with-background primary--text"
                        style="color:#0EBF67"
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-alert-circle
                      </v-icon>
                    </template>
                    <span>{{ $t("dueDiligence.requiredAssessmentTooltip") }}</span>
                  </v-tooltip>
                </h3>
              </v-col>

              <v-col cols="4">
                <div class="mb-2">
                    <label for="text">
                      {{ $t("dueDiligence.countryOfProduction") }}
                      <v-tooltip bottom color="00BD73" max-width="500">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon small class="icon-with-background primary--text pr-2" style="color:#0EBF67" v-bind="attrs" v-on="on">
                              mdi-alert-circle
                            </v-icon>
                          </template>
                          <span>{{ $t('dueDiligence.countryOfProductionTT') }}</span>
                        </v-tooltip>
                    </label>
                  </div>

                <v-autocomplete
                  :label="$t('profileSetting.selectCountry')"
                  :placeholder="$t('profileSetting.selectCountry')"
                  clearable
                  v-model="report.assessment.selectedCountries[0]"
                  :items="countriesOnly"
                  item-text="translatedName"
                  item-value="name"
                  cache-items
                  :search-input.sync="search"
                  dense
                  solo
                  flat
                  :rules="[(v) => !!v || $t('deforestation.thisFieldIsRequired')]"
                  return-object
                  @input="filterAssessment"
                  v-bind="getSelectProps()"
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="8"> </v-col>
            </v-row>

            <v-row
              class="align-baseline"
              v-for="(selectedAssessment, index) in selectedAssessments"
              :key="selectedAssessment.id"
            >
              <v-col cols="3">
                <v-checkbox
                  v-if="index == 0"
                  v-model="defaultAssessmentModel"
                  :label="$t('deforestation.EUDRDeforestationAssessment')"
                  color="primary"
                  :value="1"
                  hide-details
                  disabled
                  v-bind="getCheckboxProps()"
                ></v-checkbox>

                <v-checkbox
                  v-else
                  v-model="report.assessment.selectedAssessments"
                  :label="report.assessment.assessments[index].assessment"
                  color="primary"
                  :value="report.assessment.assessments[index].id"
                  hide-details
                  v-bind="getCheckboxProps()"
                ></v-checkbox>
              </v-col>

              <v-col cols="3">
                <v-select v-if="index ==0" item-value="value" item-text="title" :items="dimitraSelections"
                  v-model="defaultAssessmentType"
                  class="mr-1"
                  dense
                  v-bind="getSelectProps()"
                />
                <v-select
                  v-else
                  :items="
                    formatedAssessmentOptions(
                      report.assessment.assessments[index].assessment
                    )
                  "
                  v-model="report.assessment.assessments[index].type"
                  class="mr-1"
                  dense
                  item-text="name"
                  item-value="value"
                  v-bind="getSelectProps()"
                />
              </v-col>
              <v-col cols="3">
                <v-select
                  v-if="index == 0"
                  :items="farmEachs"
                  v-model="defaultAssessmentFarm"
                  class="mr-1"
                  dense
                  item-text="name"
                  item-value="value"
                  disabled
                  v-bind="getSelectProps()"
                />
                <v-select
                  v-else
                  :items="filteredFarmEachs(index)"
                  v-model="report.assessment.assessments[index].farm"
                  class="mr-1"
                  dense
                  item-text="name"
                  item-value="value"
                  v-bind="getSelectProps()"
                />
              </v-col>
            </v-row>

            <v-row
            class="align-baseline"
          >
            <v-col cols="3">
              <v-checkbox
                v-model="regionalRiskAssessment"
                :label="$t('deforestation.regionalRiskAssessment')"
                color="primary"
                :value="1"
                hide-details
                v-bind="getCheckboxProps()"
              ></v-checkbox>

              
            </v-col>

            </v-row>

            <v-btn
              color="primary"
              dark
              medium
              class="mr-3 mt-12"
              @click="addMoreAssessmentDialog = true"
            >
              {{ $t("dueDiligence.addMoreAssessments") }}
            </v-btn>

            <v-divider class="my-6"></v-divider>

            <v-row>
              <v-col cols="12">
                <h2 class="font-weight-bold">
                    {{ $t("deforestation.complianceRiskWarnings") }}
                      <v-tooltip top color="00BD73" max-width="350">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                            mdi-alert-circle
                          </v-icon>
                        </template>
                        <span>
                          {{ $t("deforestation.complianceRiskWarningsTT") }}
                        </span>
                      </v-tooltip>
                    </h2>
              </v-col>
              <v-col cols="12">
                <!-- TODO -->
                <!-- <v-checkbox
                  v-model="report.enableRiskWarningPopupNotifications"
                  label="Enable Risk Warning Popup Notifications"
                  color="success"
                ></v-checkbox> -->
                <v-checkbox
                  v-model="report.enableOnScreenRiskWarnings"
                  :label="$t('dueDiligence.enableRiskWarnings')"
                  color="primary"
                  v-bind="getCheckboxProps()"
                ></v-checkbox>
              </v-col>
            </v-row>
          </template>
        </v-card-text>
      </v-card>
    </v-form>

    <!-- SUPPLIER OR OPERATOR NOT REGISTERED DIALOG -->
    <SupplierOrOperatorNotRegistered
      :supplierId="selectedSupplierId"
      :operatorId="selectedOperatorId"
      @close-modal="closeSupplierOrOperatorNotRegisteredDialog"
      @confirm="confirmSendEmailToSupplierOperator"
      :dialog="supplierOrOperatorNotRegisteredDialog"
    />

    <!-- ADD MORE ASSESSMENT -->
    <AddMoreAssessment
      @close-modal="closeAddMoreAssessmentDialog"
      :dialog="addMoreAssessmentDialog"
      @selectedAssessments="handleSelectedAssessments"
      :assessments="assessmentsTypes"
      :selectedAssessmentsForPopUp="selectedAssessmentsForPopUp"
    />

    <!-- ADD OPERATOR DIALOG -->
    <AddNewOperator
      v-if="operatorCreateDialog"
      :dialogI="operatorCreateDialog"
      @operatorAdded="handleOperatorCreate"
      @closeModal="operatorCreateDialog = false"
    />

    <!-- ADD SUPPLIER DIALOG -->
    <AddNewSupplier
      v-if="addNewSupplierDialog"
      :dialogI="addNewSupplierDialog"
      @supplierAdded="handleSupplierCreate"
      @closeModal="addNewSupplierDialog = false"
    />
  </div>
</template>
<script>
import loading from "@/mixins/LoadingMixin";
import AddMoreAssessment from "../AddMoreAssessment.vue";
import DeforestationService from "@/_services/DeforestationService";
import UnitService from "@/_services/UnitService";
import SupplierOrOperatorNotRegistered from "../components/report-details/SupplierOrOperatorNotRegisteredDialog.vue";
import AddNewOperator from "../components/report-details/AddNewOperator.vue";
import AddNewSupplier from "../components/report-details/AddNewSupplier.vue";
import { mapGetters } from "vuex";
import { debounce, compact } from 'lodash';
import { getEuropeanCountries, getAllCountries,getSubProducts } from "../../../../../constants/countries";
import UserService from "@/_services/UserService";
import ActivityLogService from "@/_services/ActivityLogService";
import { isIndonesianClient, isKenyaClient } from "@/utils";
export default {
  components: {
    AddMoreAssessment,
    SupplierOrOperatorNotRegistered,
    AddNewOperator,
    AddNewSupplier,
  },
      async mounted() {
      this.startLoading();
      // this.loadContainers();
      await Promise.allSettled([
        this.getCountry(),
        this.getProductList(),
        this.getAssessmentList(),
        this.getReportDetails()
      ]);


      if (this.isSupplierOwner) {
        await this.getSupplierOrOperatorList(this.supplierId, "operator");
      } else if (this.isOperatorOwner) {
        await this.getSupplierOrOperatorList(this.operatorId, "supplier");
      }

      if(this.diligenceId){
        await this.fetchDiligenceDetail();
      }

      this.stopLoading();
      this.report.companyID = String(this.getOrganizationId);
    },
  props: {
    diligenceId: {
      required: true,
    },
  },
  watch: {
    'report.assessment.selectedCountries'(selectedCountry) {
          this.search = null;
          this.handleSelectionChange(selectedCountry);
          this.previousSelectedCountries = [...selectedCountry];
      },
      'report.whoAddPlaceData'(newVal, oldVal) {
       if(newVal !== oldVal && oldVal!=null) {
        this.$emit(
              "updateWhoWillAddPlaceData",
              newVal
          );
       }
      },
      'report.countryOfActivity'() {
          this.search = null;
      },
      getDiligenceDetails: {
          handler: function (newVal ) {
              if (newVal && this.diligenceId) {
                  this.fetchDiligenceDetail();
              }
          },
          deep: true,
      },
      containers: {
        handler() {
          this.errors = {}; 
          this.containers.forEach((containerId, index) =>
            this.validateContainerId(containerId, index)
          );
        },
        deep: true,
      },
  },
  
  computed: {
    isIndonesianClient() {
      return isIndonesianClient();
    },
    ...mapGetters("eudrDDS", ["getDiligenceDetails", "getDdsUserRole"]),
    ...mapGetters("eudrSettings", ["get_EUDR_Settings"]),
    isSupplierOwner() {
      return [ "supplier_owner", "owner"].includes(
        this.getDdsUserRole
      );
    },
    isOperatorOwner() {
      return ["operator_owner", "owner"].includes(
        this.getDdsUserRole
      );
    },
    isSupplier(){
      return this.getDdsUserRole === 'supplier';
    },
    getOrganizationId() {
      return this.$store.getters.getUser?.user_organization?.id;
    },
    getUserCountry() {
      return this.$store.getters.getUser?.countryId;
    },
    formattedSupplier() {
      return this.supplierList.map((person) => ({
        ...person,
        fullName: person.lastName ? `${person.firstName} ${person.lastName}` : person.firstName,
      }));
    },
    formattedOperator() {
      return this.operatorList.map((person) => ({
        ...person,
        fullName: person.lastName ? `${person.firstName} ${person.lastName}` : person.firstName,
      }));
    },
    eudrSettings() {
      return this.get_EUDR_Settings;
    },
    isKenyaClient() {
      return isKenyaClient();
    },
  },
  data() {
    return {
      showVerification: false,
      containers: [""],
      errors: {}, 
      operatorCreateDialog: false,
      supplierOperatorLoading: false,
      supplierOrOperatorNotRegisteredDialog: false,
      selectedSupplierId: null,
      selectedOperatorId: null,
      isbypassEmail: false,
      addSupplierFormValid: false,
      addReportFormValid: false,
      addReportFormRules: {
        internalReferenceNumber: [
          (v) =>
            !v ||
            /^[a-zA-Z0-9 ]+$/.test(v) ||
            this.$t("deforestation.internalReferenceNumberMustBeAlphanumeric"),
        ],
        supplierId: [() => this.validateSupplier()],

        operatorId: [() => this.validateOperator()],

        exporter_id :[() => this.validateExporterId()],

        netMass: [
            (v) => !!v || this.$t("deforestation.netMassIsRequired"),
            (v) => /^\d+(\.\d+)?([eE][+-]?\d+)?$/.test(v) ||  this.$t("deforestation.netMassMustBeValid"),
          ],
          whoAddPlaceData: [
            (v) => !!v || this.$t("deforestation.thisFieldIsRequired"),
          ],
        volume: [
            (v) => !v || /^\d+(\.\d+)?([eE][+-]?\d+)?$/.test(v) || this.$t("deforestation.volumeMustBeNumeric"),
          ]
      },
      supplierList: [],
      operatorList: [],
      addNewSupplierDialog: false,
      addNewOperatorDialog: false,
      addMoreAssessmentDialog: false,
      assessmentsTypes: [],
      selectedAssessments: [],
      selectedAssessmentsForPopUp: [],
      subProductList: [],
      report: {
        supplier: {},
        operator: {},
        whoAddPlaceData: this.isOperatorOwner ? "supplier" : null,
        assessment: {
          selectedCountries: [],
          selectedAssessments: [],
          assessments: [],
        },
        companyID: "",
        EUDRReferenceNumber: "",
        internalReferenceNumber: "",
        activity: "Domestic",
        countryOfEntry: "",
        countryOfActivity: [],
        product: "",
        subProduct: "",
        productDescription: "",
        productNetMass: "",
        productVolume: "",
        productScientificName: "",
        productCommonName: "",
        enableRiskWarningPopupNotifications: true,
        enableOnScreenRiskWarnings: true,
        shareReportEnabled: isIndonesianClient() ? true : false,
        exporterEmail: "",
      },
      selectedCountries: [],
      search: null,
      selectAllItem: { name: "All Countries" },
      countries: [],
      countriesOnly: [],
      europeanCountriesOnly: [],
      searchingExporter: false,
      exporterDetails: null,
      defaultAssessment: [
        {
          id: 0,
          assessment: this.$t("deforestation.EUDRDeforestationAssessment"),
          title: this.$t("deforestation.EUDRDeforestationAssessment"),
          farm: "One For Each Farm",
          type: "Dimitra Deforestation Report",
        },
      ],
      defaultAssessmentModel: 1,
      regionalRiskAssessment: 0,
      defaultAssessmentType: "Dimitra Deforestation Report",
      defaultAssessmentFarm: "One for Each Farm",
      dimitraSelections:[
        {value:'Existing Deforestation Report',title:this.$t('deforestation.existingReport')}, 
        {value:'Dimitra Deforestation Report', title:this.$t('deforestation.dimitraReport')}
      ],
      farmEachs:[{value:'One for Each Farm', name:this.$t('deforestation.oneForEachFarm')}, {value:'One for All Farms', name:this.$t('deforestation.oneForAllFarms')}],

      productList: [
      ],
      
      dueDiligence: [],
    };
  },
  methods: {
    addContainer() {
        this.containers.push("");
    },
         removeContainer(index) {
            this.containers.splice(index, 1);
            this.$nextTick(() => this.saveContainers());
    },
    loadContainers() {
      const savedContainers = localStorage.getItem("containers");
      this.containers = savedContainers ? JSON.parse(savedContainers) : [];
    },
    saveContainers() {
      localStorage.setItem('containers', JSON.stringify(this.containers));
    },
    validateContainerId(value, currentIndex) {
      if (!value || value.trim() === "") {
        this.$set(this.errors, currentIndex, false);
        return true;
      }
      const isUnique = !this.containers.some(
        (containerId, index) => containerId === value && index !== currentIndex
      );

      this.$set(this.errors, currentIndex, !isUnique);

      return isUnique || this.$t("blends.createBlends.uniqueContainerId");
    },
    async handleOperatorCreate({ success, data }) {
      this.operatorAdded = false;
      if (success) {
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 3 seconds
        await this.getSupplierOrOperatorList(data.id, "operator");
      }
    },
    async handleSupplierCreate({ success, data }) {
      this.addNewSupplierDialog = false;
      if (success) {
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 3 seconds
        await this.getSupplierOrOperatorList(data.id, "supplier");
      }
    },
    confirmSendEmailToSupplierOperator() {
      this.isbypassEmail = true;
      this.triggerSubmit();
      this.supplierOrOperatorNotRegisteredDialog = false;
    },
    closeSupplierOrOperatorNotRegisteredDialog() {
      this.supplierOrOperatorNotRegisteredDialog = false;
    },

    validateExporterId(){
      if(this.report.shareReportEnabled){
        if(this.exporterDetails?.id){
          return true;
        }else{
          return this.$t("deforestation.atLeastOneOfSupplierIdOrSupplierNameIsRequired"); 
        }
      }
      return true
    },

    validateSupplier() {
      if (this.report.supplier) {
        if (this.report.supplier.id) {
          return true;
        }
      }
      return this.$t("deforestation.atLeastOneOfSupplierIdOrSupplierNameIsRequired");
    },
    validateOperator() {
      return true
      // if (this.report.operator) {
      //   if (this.report.operator.id) {
      //     return true;
      //   }
      // }
      // return this.$t("deforestation.atLeastOneOfOperatorIdOrOperatorNameIsRequired");
    },

    formatedAssessmentOptions(assessment) {
            return [
              {value:`Existing ${assessment}`, name:this.$t('deforestation.uploadExistingAssessment')},
              {value:`${assessment} Survey`, name:this.$t('deforestation.completeDimitraAssessment')},
              {value:`Farmer ${assessment}`, name:this.$t('deforestation.assessmentByFarmer')}
            ];
    },

    isAssessmentByFarmerSelected(index) {
      const isFarmerSelected = this.report.assessment.assessments[index].type === `Farmer ${this.report.assessment.assessments[index].assessment}`;
      return isFarmerSelected;
    },
    filteredFarmEachs(index) {
      if (this.isAssessmentByFarmerSelected(index)) {
        return this.farmEachs.filter(item => item.value !== 'One for All Farms');
      }
      return this.farmEachs;
    },

    onProductChange() {
      this.subProductList = getSubProducts(localStorage.getItem("LANGUAGE"), this.report.product.subproducts);
      
    },
    handleSelectedAssessments(selectedAssessments) {
      this.report.assessment.selectedAssessments = [];
      const newAssessmentsOptions = selectedAssessments.map((assessment) => {
        this.report.assessment.selectedAssessments.push(assessment.id);
        return {
          assessment: assessment.title,
          type: this.formatedAssessmentOptions(assessment.title)[0].value,
          farm: "One for Each Farm",
          id: assessment.id,
        };
      });
      const newFilteredAssessmentsOptions = newAssessmentsOptions.map(assessment => {
        const found = this.selectedAssessmentsForPopUp.find(popup => popup.id === assessment.id);
        return found ? found : assessment;
      });
      this.selectedAssessments = [...newFilteredAssessmentsOptions];
      this.report.assessment.assessments = [...newFilteredAssessmentsOptions];
      this.selectedAssessmentsForPopUp = [...newFilteredAssessmentsOptions];
      this.addMoreAssessmentDialog = false;
    },
    async fetchDiligenceDetail() {
      this.loading = true;
      const diligenceDetails = this.dueDiligence;
      console.log("main loggg", diligenceDetails)
      if (diligenceDetails) {
        const report = diligenceDetails;
        this.defaultAssessmentType = report.eudrAssessmentType;
        let selectedProduct = null;
        let selectedSubProduct = null;
        if (report.product) {
          selectedProduct = this.productList.find(
            (p) => p.id == report.product
          );
          this.subProductList = selectedProduct?.subproducts || [];
          selectedSubProduct = this.subProductList.find(
            (p) => p.id == report.subProduct
          );
        }

        let reportDetail = {
          ...(this.isOperatorOwner
            ? { whoAddPlaceData: report.whoAddPlaceData }
            : {}),
          assessment: {
            selectedCountries: [],
            assessments: [],
          },

          supplier: report.supplierId,
          companyID: report.companyID,
          EUDRReferenceNumber: report.EUDRReferenceNumber,
          internalReferenceNumber: report.internalReferenceNumber,
          activity: report.activity,
          countryOfEntry: report.countryOfEntry,
          countryOfActivity: report.countryOfActivity,
          product: report.product ? selectedProduct : null,
          subProduct: report.subProduct ? selectedSubProduct : null,
          productDescription: report.productDescription,
          comments: report.comments,
          eudrVerificationNo: report.eudrVerificationNo,
          productNetMass: UnitService.fromBase.weight(
            this.eudrSettings.product_mass_unit,
            report.productNetMass
          ),
          productVolume: UnitService.fromBase.volume(
            this.eudrSettings.volume_unit,
            report.productVolume
          ),
          productScientificName: report.productScientificName,
          productCommonName: report.productCommonName,
          enableRiskWarningPopupNotifications:
            report.enableRiskWarningPopupNotifications,
          enableOnScreenRiskWarnings: report.enableOnScreenRiskWarnings,
          requestAdditionalInformation: report.requestAdditionalInformation || [],
        };
        this.regionalRiskAssessment = report.enableRegionalRiskAssessment?1:0;

        if (report.supplierId && this.supplierList.length > 0) {
          const selectedSupplier = this.supplierList.find(
            (p) => p.id == report.supplierId
          );
          reportDetail.supplier = {
            ...selectedSupplier,
            fullName:
              selectedSupplier.firstName + " " + selectedSupplier.lastName,
          };
        }
        if (report.operatorId && this.operatorList.length > 0) {
          const selectedOperator = this.operatorList.find(
            (p) => p.id == report?.operatorId
          );

          if(selectedOperator){
            reportDetail.operator = {
              ...selectedOperator,
              fullName:
                selectedOperator.firstName + " " + selectedOperator.lastName,
            };
          }
          else{
            reportDetail.operator = null;
          }
        
        }

        let assessments = report.requiredAssessment || [];
        assessments = assessments?.map((assmen) => ({
          ...assmen,
          id: parseInt(assmen.id),
        }));

        this.selectedAssessments = [...this.defaultAssessment, ...assessments];
        reportDetail.assessment.assessments = [
          ...this.defaultAssessment,
          ...assessments,
        ];
        reportDetail.assessment.selectedAssessments = [
          0,
          ...assessments.map((assessment) => assessment.id),
        ];

        this.selectedAssessmentsForPopUp = [
          ...this.defaultAssessment,
          ...assessments,
        ];
        if(report?.countryOfProduction?.length){
          const countryOfProduction = this.countriesOnly.filter(x => x.name == report.countryOfProduction[0])
          reportDetail.assessment.selectedCountries = countryOfProduction.length ? countryOfProduction: [];
        }else{
          reportDetail.assessment.selectedCountries = []
        }
        

        const updatedDiligenceDetail = Object.assign(
          {},
          this.report,
          reportDetail
        );

        this.report = updatedDiligenceDetail;
        this.loading = false;
      }
    },

    handleShareReportToggle() {
      this.report.shareReportEnabled = this.report.shareReportEnabled ? true : false;
      this.exporterDetails = null;
      this.report.exporterEmail = "";
    },

    async getProductList() {
      DeforestationService.getProductList()
        .then((res) => {
          const productList = res.data.deforestationProductList;
          this.productList = productList;
        })
        .catch((err) => {
          console.log("Error in product listing", err);
        });
    },

    async getSupplierOrOperatorList(id = null, role = "supplier") {
      this.supplierOperatorLoading = true;
      try {
        const res = await DeforestationService.getSupplierList(role);
        const dataList = res.data.findAllSuppliersOrOperators.map((ss) => ({
          ...ss,
          fullName: `${ss.firstName} ${ss.lastName}`,
        }));

        if (role === "supplier") {
          this.supplierList = dataList;
          if (id) {
            this.report.supplier = dataList.find(
              (supp) => supp.cf_userid === id
            );
          }
        } else if (role === "operator") {
          this.operatorList = dataList;
          if (id) {
            this.report.operator = dataList.find((opp) => opp.cf_userid === id);
          }
        }
      } catch (err) {
        console.error("Error", err);
      } finally {
        this.supplierOperatorLoading = false;
      }
    },

    filterAssessment: debounce(function () {
      this.getAssessmentList();
    }, 500),

    async getAssessmentList() {
      this.loading = true;

      const loggedInUser = localStorage.getItem("user");
      const user = JSON.parse(loggedInUser);
      let params = {
        page: 0,
        limit: 100000,
        orgId: user.user_organization.id,
        userId: user.id,
        assessmentType: "USER_CUSTOM",
      };
      return DeforestationService.getAllAssessment(params)
        .then((res) => {
          let assessments = res.data.findAllAssessmentList.rows;

          const selectedCountries = this.report.assessment.selectedCountries;
  
          const selectedCountryCodes = selectedCountries && selectedCountries.length > 0
            ? selectedCountries.map(country => country?.code || null).filter(Boolean)
            : [];

          if (selectedCountryCodes && selectedCountryCodes.length > 0) {
            assessments = assessments.filter((item) => {
              return item.isDefault || (item.countries && item.countries.includes("ALL")) || selectedCountryCodes.some(country => item.countries && item.countries.includes(country));
            });
          }
          
          assessments = assessments.filter(
            (asses) => asses.status == "active" || asses.status == "ACTIVE"
          );
          assessments = assessments.map((assmen) => ({
            ...assmen,
            id: parseInt(assmen.id),
          }));
          
          assessments.unshift(this.defaultAssessment[0]);
          this.assessmentsTypes = assessments;
          this.report.assessment.assessments = [...this.defaultAssessment];
          this.report.assessment.selectedAssessments = [
            this.defaultAssessment.id,
          ];
          this.selectedAssessments = [...this.defaultAssessment];
          this.selectedAssessmentsForPopUp = [...this.defaultAssessment];
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          console.log("Error", err);
        });
    },
    getCountry() {
      this.countriesOnly = [...getAllCountries(localStorage.getItem("LANGUAGE"))];
      this.countries = [{ name: "All Countries" }, ...getAllCountries(localStorage.getItem("LANGUAGE"))];
      this.europeanCountriesOnly = [...getEuropeanCountries(localStorage.getItem("LANGUAGE"))];
    },

    handleSelectionChange(selectedCountry) {
      if (selectedCountry[0] !== null || !selectedCountry) {
        if(selectedCountry.name === 'All Countries'){
          this.report.assessment.selectedCountries = [...this.countries, this.selectAllItem];
        }
        else if (selectedCountry.length === this.countries.length) {
          this.report.assessment.selectedCountries = [...this.countries, this.selectAllItem];
        }
      } else {
        this.report.assessment.selectedCountries = [];
      }
    },

    // handleSelectionChange(newVal, oldVal) {
    //   let addedItem, removedItem;

    //   // Determine the added or removed item by comparing old and new values
    //   if (newVal[0] !== null || oldVal[0] !== null) {
    //     addedItem = newVal.find((item) => oldVal.includes(item));
    //   } else {
    //     removedItem = oldVal.find((item) => !newVal.includes(item));
    //   }

    //   // addedItem = newVal.find((item) => oldVal.includes(item));
    //   // removedItem = newVal[0] === null && oldVal[0] === null

    //   console.log("===>",{addedItem, removedItem})

    //   if (addedItem) {
    //     if (addedItem.name === "All Countries") {
    //       this.report.assessment.selectedCountries = [
    //         ...this.countries,
    //         this.selectAllItem,
    //       ];
    //     } else if (
    //       this.report.assessment.selectedCountries.length ===
    //       this.countries.length
    //     ) {
    //       this.report.assessment.selectedCountries = [
    //         ...this.report.assessment.selectedCountries,
    //         this.selectAllItem,
    //       ];
    //     }
    //   }

    //   if (removedItem) {
    //     if (removedItem.name === "All Countries") {
    //       this.report.assessment.selectedCountries = [];
    //     } else if (
    //       this.report.assessment.selectedCountries.length ===
    //       this.countries.length
    //     ) {
    //       this.report.assessment.selectedCountries.push(this.selectAllItem);
    //     } else {
    //       this.report.assessment.selectedCountries = this.report.assessment.selectedCountries.filter(
    //         (item) => item.name !== "All Countries"
    //       );
    //     }
    //   }
    // },

    closeAddMoreAssessmentDialog() {
      this.addMoreAssessmentDialog = false;
    },

    async triggerSubmit(type) {

      // if user is supplier only then no need to validate the form
      const validated = this.$refs.addReportForm?.validate();
      if (this.isSupplier) {
        this.$emit("increaseStep");
        return;
      }
      else if (type!=='save'&&!validated) {
        this.$notify({
          text: this.$t("deforestation.thisFieldIsRequired"),
          type: "error",
        });
        return false;
      }

      if (
        type!=='save' &&
        this.report.whoAddPlaceData == "supplier" &&
        this.report.supplier &&
        this.report.supplier.id &&
        !this.isbypassEmail &&
        this.report.supplier.verified == 0
      ) {
        // if(!validated) return false;
        this.selectedSupplierId = parseInt(this.report.supplier.id);
        const confirmed = await this.showConfirmationDialog();
        if (!confirmed) return false;
      }

      if (
        type!=='save' &&
        this.report.operator &&
        this.report.operator.id &&
        !this.isbypassEmail &&
        this.report.operator.verified == 0
      ) {
        // if(!validated) return false;
        this.selectedOperatorId = parseInt(this.report.operator.id);
        const confirmed = await this.showConfirmationDialog();
        if (!confirmed) return false;
      }
      

      let assessments = this.report.assessment?.assessments;
      let selectedAssessments = this.report.assessment?.selectedAssessments;

      if (selectedAssessments) {
        assessments = assessments.filter((item) => {
          return selectedAssessments.includes(item.id);
        });

        assessments = assessments.map((item) => {
          return item.id ? { ...item, id: parseInt(item.id) } : item;
        });
        assessments = assessments.filter((item) => {
          return item.id != 0;
        });
      }

      const report = {
        ...(this.isOperatorOwner
          ? {
              supplier: {
                id: this.report.supplier.id
                  ? parseInt(this.report.supplier.id)
                  : null,
                fullName: this.report.supplier.fullName,
                email: this.report.supplier.email,
                mobile: this.report.supplier.mobile,
                country: this.report.supplier.countryId,
              },
            }
          : {}),
        ...(this.isSupplierOwner
          ? {
              operator: {
                id: this.report.operator.id
                  ? parseInt(this.report.operator.id)
                  : null,
                fullName: this.report.operator.fullName,
                email: this.report.operator.email,
                mobile: this.report.operator.mobile,
                country: this.report.operator.countryId,
                eori_number: this.report.operator.eori_number,
              },
            }
          : {}),
        ...(this.isOperatorOwner
          ? { whoAddPlaceData: this.report.whoAddPlaceData }
          : {}),
        countryOfProduction: compact(
    (this.report?.assessment?.selectedCountries || []).map(item => item?.name)
  ),    
        exporter_id:this.report?.shareReportEnabled ? this.exporterDetails?.id || null : null,
        ...(this.report?.shareReportEnabled && this.exporterDetails?.id
          ? { exporter_id: this.exporterDetails?.id  }
          : {}),

        requiredAssessment: assessments,
        internalReferenceNumber: this.report.internalReferenceNumber,
        EUDRReferenceNumber: this.report.EUDRReferenceNumber,
        companyID: this.report.companyID,
        activity: this.report.activity,
        countryOfActivity: this.report.countryOfActivity ? this.report.countryOfActivity.filter(x => x) : [],
        countryOfEntry: this.report.countryOfEntry,
        product: this.report.product?.id
          ? parseInt(this.report.product?.id)
          : null,
        subProduct: this.report.subProduct?.id
          ? parseInt(this.report.subProduct?.id)
          : null,
        productDescription: this.report.productDescription,
        comments: this.report.comments,
        productNetMass: UnitService.toBase.weight(
          this.eudrSettings.product_mass_unit,
          this.report.productNetMass
        ),
        productVolume: UnitService.toBase.volume(
          this.eudrSettings.volume_unit,
          this.report.productVolume
        ),
        productScientificName: this.report.productScientificName,
        productCommonName: this.report.productCommonName,
        eudrAssessmentType: this.defaultAssessmentType,
        enableRiskWarningPopupNotifications: this.report.enableRiskWarningPopupNotifications,
        enableOnScreenRiskWarnings: this.report.enableOnScreenRiskWarnings,
        enableRegionalRiskAssessment: this.regionalRiskAssessment ? true : false,
        containerIds: this.containers
      };
      this.startLoading();

      if (this.diligenceId) {
        report.id = parseInt(this.diligenceId);
        const currentStep = JSON.parse(localStorage.getItem("DDS_TAB_DATA"));
        report.current_step = currentStep.activeTab;

        const updateDiligenceService = this.isOperatorOwner
          ? DeforestationService.updateDiligenceReport
          : DeforestationService.updateDueDiligenceReportBySupplier;

        return updateDiligenceService(report)
          .then(async (res) => {
            if (res.errors && res.errors.length > 0) {
              const error = res.errors[0];
              const errorMessage = error.message || this.$t("dueDiligence.anErrorOccurred");
              this.$notify({
                text: errorMessage,
                type: "error",
              });
              this.stopLoading();
              return false;
            }

            this.$notify({
              text: this.$t("deforestation.reportUpdatedSuccessfully"),
              type: "success",
            });

            // Log the report details update
            try {
              const userId = this.$store.getters.getUser?.id;
              console.log('Logging report details update - User ID:', userId, 'Diligence ID:', this.diligenceId);
              
              if (userId) {
                const changes = this.getReportChangesSummary();
                console.log('Changes summary:', changes);
                
                const logResult = await ActivityLogService.logDDSReportDetailsUpdated(
                  this.diligenceId,
                  userId,
                  changes
                );
                console.log('Activity log result:', logResult);
              } else {
                console.warn('No user ID available for activity logging');
              }
            } catch (logError) {
              console.error('Error logging report details update:', logError);
            }


            // redirected to the listing page if placedata is supplier;
            if(this.report.whoAddPlaceData == "supplier"){
              if (this.$route.name !== "dueDiligenceReports") {
                this.$router.replace({ name: "dueDiligenceReports" });
              }
            }

         
            this.isbypassEmail = false;
            this.stopLoading();
            this.$emit("updateTabs", report.id);

            // handling for supplier owner;
            if(this.report.whoAddPlaceData === null){
              this.$emit("increaseStep");
              return;
            }
            else{
              return true;
            }
          })
          .catch((err) => {
            this.stopLoading();
            this.$notify({
              text: err,
              type: "error",
            });
            console.log("Error", err);
            return false;
          });
      } else {
        const createDiligenceService = this.isOperatorOwner
          ? DeforestationService.createDiligenceReport
          : DeforestationService.createDiligenceReportBySupplier;
        return createDiligenceService(report)
          .then(async (res) => {
            if (res.errors && res.errors.length > 0) {
              const error = res.errors[0];
              const errorMessage = error.message || this.$t("dueDiligence.anErrorOccurred");
              this.$notify({
                text: errorMessage,
                type: "error",
              });
              this.stopLoading();
              return false;
            }
            this.$notify({
              text: this.$t("deforestation.reportAddedSuccessfully"),
              type: "success",
            });

            if (this.report?.whoAddPlaceData === "supplier") {
              this.$nextTick(() => {
                if (this.$route.name !== "dueDiligenceReports") {
                  this.$router.replace({ name: "dueDiligenceReports" });
                }
              });
            }

            this.$emit(
              "updateDiligenceId",
              this.isOperatorOwner
                ? res.data.createDiligenceReport.id
                : res.data.createDiligenceReportBySupplier.id
            );
            this.isbypassEmail = false;
            this.$emit(
              "updateTabs",
              this.isOperatorOwner
                ? res.data.createDiligenceReport.id
                : res.data.createDiligenceReportBySupplier.id
            );

            // Log report creation
            try {
              const userId = this.$store.getters.getUser?.id;
              if (userId) {
                const newReportId = this.isOperatorOwner
                  ? res.data.createDiligenceReport.id
                  : res.data.createDiligenceReportBySupplier.id;
                await ActivityLogService.logDDSReportCreated(newReportId, userId, 'Due Diligence Report');
              }
            } catch (error) {
              console.error('Failed to log report creation:', error);
            }

            if(type==='save'){
              this.$nextTick(() => {
                this.$router.replace({ name: "dueDiligenceReports" });
              });
            }
            this.stopLoading();

            // handling for supplier owner;
            if(this.report.whoAddPlaceData === null){
              this.$emit("increaseStep");
              return;
            }
            else{
              return true;
            }
          })
          .catch((err) => {
            this.stopLoading();
            this.$notify({
              text: err,
              type: "error",
            });
            return false;
          });
      }
    },

    showConfirmationDialog() {
    return new Promise((resolve) => {
      this.supplierOrOperatorNotRegisteredDialog = true;
      this.$once("confirm", () => {
        this.supplierOrOperatorNotRegisteredDialog = false;
        resolve(true);
      });
      this.$once("cancel", () => {
        this.supplierOrOperatorNotRegisteredDialog = false;
        resolve(false);
      });
    });
  },
    async getReportDetails(){
      this.startLoading();
      if(!this.diligenceId){
        // this.report.countryOfActivity = [this.getUserCountry];
        return;
      }
      DeforestationService.getDiligenceDetail(this.diligenceId).then((res)=>{
        this.dueDiligence = res.data.getDiligenceDetail;
        if(res.data.getDiligenceDetail?.ddsReportExporter?.exporter_cf_id){
          this.getUserDetails(res.data.getDiligenceDetail?.ddsReportExporter?.exporter_cf_id)
          this.report.shareReportEnabled = true;
        }
        else{
          this.report.shareReportEnabled = false;
        }
      })
      .catch((err)=>{
        console.log(err)
      })
      .finally(()=>{
        this.stopLoading();
      })
    },

    async getUserDetails(userId) {
      try {
        const user = await UserService.getUserDetails(userId);
        if (user && user.data) {
          this.report.exporterEmail = user.data.email;
          this.exporterDetails = {
            id: user.data.id,
            name: user.data.firstName + " " + user.data.lastName,
            email: user.data.email,
            phoneNumber: user.data.mobile || user.data.phoneNumber,
            country: user.data.countryId,
            status: user.data.active ? "Registered" : "Unregistered"
          };
        } else {
          console.error("User details not found");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    },

    async searchExporter() {
       const message = this.isKenyaClient ? "This Agent is not registered in the system.Please ask your agent to visit https://lp.dimitra.io/naccu-registration to sign up on the platform" : "This exporter is not registered in the system. Please ask your exporter to visit https://dimitra.io/indonesia-registration/ to sign up on the platform";
      if (!this.report.exporterEmail) {
        this.$notify({
          text:  message,//this.$t('deforestation.pleaseEnterExporterEmail'),
          type: "warning",
        });
        return;
      }

      this.searchingExporter = true;
      
      try {
        const response = await UserService.getExporterDetails(this.report.exporterEmail);
        
        this.exporterDetails = {
          id: response.data.id,
          name: response.data.firstName + " " + response.data.lastName,
          email: response.data.email,
          phoneNumber: response.data.mobile || response.data.phoneNumber,
          country: response.data.countryId,
          status: response.data.active ? "Registered" : "Unregistered"
        };
        
        this.$notify({
          text: this.$t('deforestation.exporterFoundSuccessfully'),
          type: "success",
        });

        // Log exporter search success
        try {
          const userId = this.$store.getters.getUser?.id;
          if (userId) {
            await ActivityLogService.logDDSExporterSearched(
              this.diligenceId,
              userId,
              this.report.exporterEmail,
              'Found successfully'
            );
          }
        } catch (logError) {
          console.error('Error logging exporter search:', logError);
        }
      } catch (error) {
        this.exporterDetails = {};
        this.$notify({
          text: message, //this.$t('deforestation.noExporterFound'),
          type: "error",
        });
        console.error('Error searching exporter:', error);
      } finally {
        this.searchingExporter = false;
      }
    },

    getReportChangesSummary() {
      const changes = [];
      
      // Check for product changes
      if (this.report.product?.name) {
        changes.push(`Product: ${this.report.product.name}`);
      }
      
      // Check for assessment changes
      if (this.report.assessment?.assessments?.length > 0) {
        const assessmentNames = this.report.assessment.assessments.map(a => a.name || a.assessment).join(', ');
        changes.push(`Assessments: ${assessmentNames}`);
      }
      
      // Check for country changes
      if (this.report.countryOfActivity?.length > 0) {
        const countries = this.report.countryOfActivity.join(', ');
        changes.push(`Countries: ${countries}`);
      }
      
      // Check for supplier/operator changes
      if (this.report.supplier?.fullName) {
        changes.push(`Supplier: ${this.report.supplier.fullName}`);
      }
      if (this.report.operator?.fullName) {
        changes.push(`Operator: ${this.report.operator.fullName}`);
      }
      
      // Check for container changes
      if (this.containers?.length > 0) {
        changes.push(`Containers: ${this.containers.length} updated`);
      }
      
      return changes.length > 0 ? changes.join('; ') : 'General configuration updates';
    },
  },
  mixins: [loading],
};
</script>

<style lang="scss" scoped>
.v-autocomplete .v-list-item__title {
  text-align: center;
  padding: 16px;
}

.list-code-block {
  min-width: 45px;
  border: 1px solid black;
  padding-left: 10px;
  padding-right: 10px;
  margin-right: 15px;
  color: #135b00;
}

.add-supplier{
    position: sticky;
    bottom:0;
    background: #FFF;
    padding: 6px;
}

.list-text-block {
  max-width: 500px;
}
.remove-icon {
    background-color: #FF5757;
    border-radius: 50%;
    padding: 6px;
}

.v-switch {
  .v-input__slot {
    margin-bottom: 0;
  }
}

.exporter-details-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fafafa;
}

.text-caption.text-uppercase {
  letter-spacing: 0.5px;
}

.v-chip {
  font-size: 0.75rem;
  height: 20px;
}

.non-ptsi-brand{
  color: #0EBF67 !important;
}
.icon-with-background.kenya-brand {
  background-color: #A75300 !important;
}
.ptsi-brand{
  color: #194880 !important;
}

.kenya-brand{
  color: #A75300 !important;
}


</style>