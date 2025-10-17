<template>
    <div class="wrapper">
        <template>
            <div class="operator-wraper pb-10" v-if="exporterDetails && Object.keys(exporterDetails).length">
                <v-row class="pl-3">
                    <v-col sm="12">
                        <div class="item-box">
                            <h2 class="font-weight-bold">
                                {{ isKenyaClient ? $t('deforestation.exporterInformationKenya') : $t('deforestation.exporterInformation')  }} 
                                <v-tooltip top color="00BD73" max-width="350">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                            mdi-alert-circle
                                        </v-icon>
                                    </template>
                                    <span>{{ $t('dueDiligence.operatorDataTT') }}</span>
                                </v-tooltip>
                            </h2>
                        </div>
                    </v-col>
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

                </v-row>
            </div>
            
            <div v-if="!Object.keys(exporterDetails).length && isOperatorData" class="operator-wraper">
                <v-row class="pl-3">
                    <v-col sm="12">
                        <div class="item-box">
                            <h2 class="font-weight-bold">
                                {{ $t('dueDiligence.operatorData') }}
                                <v-tooltip top color="00BD73" max-width="350">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
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
                            <p class="text-subtitle-1 mb-2">{{ $t('deforestation.name') }}</p>
                            <p class="text-subtitle-1 font-weight-bold">
                                {{ `${report.operator?.firstName || '-'} ${report.operator.lastName || ''}` }}
                            </p>

                        </div>
                    </v-col>

                    <v-col sm="3">
                        <div class="item-box">
                            <p class="text-subtitle-1 mb-2"> {{ $t('country') }}
                            </p>
                            <p class="text-subtitle-1 font-weight-bold">
                                {{ $t(report.operator?.countryId || '-' )}}
                            </p>

                        </div>
                    </v-col>

                    <v-col sm="3">
                        <div class="item-box">
                            <p class="text-subtitle-1 mb-2"> {{ $t('dueDiligence.isoCode') }}</p>
                            <p class="text-subtitle-1 font-weight-bold">
                                {{ report.operator?.countryIsoCode || '-' }}
                            </p>
                        </div>
                    </v-col>

                    <v-col sm="3">
                        <div class="item-box">
                            <p class="text-subtitle-1 mb-2"> {{ $t('dueDiligence.eoriNumber') }}
                            </p>
                            <p class="text-subtitle-1 font-weight-bold">
                                {{ report.operator?.eori_number || '-' }}
                            </p>
                        </div>
                    </v-col>
                </v-row>
            </div>
        </template>



        <div class="supplier-wraper">
            <v-row class="pl-3" v-if="isSupplierData">
                <v-col sm="12">
                    <div class="item-box">
                        <h2 class="font-weight-bold">
                            {{ $t('dueDiligence.supplierData') }}
                            <v-tooltip top color="00BD73" max-width="350">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
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
                        <p class="text-subtitle-1 mb-2"> {{ $t('deforestation.name') }}
                        </p>
                        <p class="text-subtitle-1 font-weight-bold">
                            {{ `${report.supplier?.firstName || '-'} ${report.supplier?.lastName || ''}` }}
                        </p>

                    </div>
                </v-col>

                <v-col sm="3">
                    <div class="item-box">
                        <p class="text-subtitle-1 mb-2"> {{ $t('deforestation.email') }}
                        </p>
                        <p class="text-subtitle-1 font-weight-bold">
                            {{ report.supplier?.email || '-' }}
                        </p>

                    </div>
                </v-col>

                <v-col sm="3">
                    <div class="item-box">
                        <p class="text-subtitle-1 mb-2"> {{ $t('deforestation.phoneNumber') }}
                        </p>
                        <p class="text-subtitle-1 font-weight-bold">
                            {{ report.supplier?.mobile || '-' }}
                        </p>
                    </div>
                </v-col>

                <v-col sm="3">
                    <div class="item-box">
                        <p class="text-subtitle-1 mb-2"> {{ $t('country') }}
                        </p>
                        <p class="text-subtitle-1 font-weight-bold">
                            {{ report.supplier?.countryId || '-' }}
                        </p>
                    </div>
                </v-col>

            </v-row>
            <v-row class="pl-3" v-else>
                <v-col sm="12">
                    <div class="item-box">
                        <h2 class="font-weight-bold">
                            {{ $t('dueDiligence.supplierData') }}
                            <v-tooltip top color="00BD73" max-width="350">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
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
                        <p class="text-subtitle-1 mb-2"> {{ $t('deforestation.name') }}
                        </p>
                        <p class="text-subtitle-1 font-weight-bold">
                            {{ `${report.user?.firstName || '-'} ${report.user?.lastName || ''}` }}
                        </p>

                    </div>
                </v-col>

                <v-col sm="3">
                    <div class="item-box">
                        <p class="text-subtitle-1 mb-2"> {{ $t('deforestation.email') }}
                        </p>
                        <p class="text-subtitle-1 font-weight-bold">
                            {{ report.user?.email || '-' }}
                        </p>

                    </div>
                </v-col>

                <v-col sm="3">
                    <div class="item-box">
                        <p class="text-subtitle-1 mb-2"> {{ $t('deforestation.phoneNumber') }}
                        </p>
                        <p class="text-subtitle-1 font-weight-bold">
                            {{ report.user?.mobile || '-' }}
                        </p>
                    </div>
                </v-col>

                <v-col sm="3">
                    <div class="item-box">
                        <p class="text-subtitle-1 mb-2"> {{ $t('country') }}
                        </p>
                        <p class="text-subtitle-1 font-weight-bold">
                            {{ report.user?.countryId || '-' }}
                        </p>
                    </div>
                </v-col>

            </v-row>
        </div>
    </div>
</template>

<script>
import { isIndonesianClient, isKenyaClient } from '@/utils.js';
import UserService from "@/_services/UserService";

export default {
    data(){
        return {
            exporterDetails: {}
        }
    },
    props:{
      report:{
        type:Object,
        required: true
      }
    },
    computed:{
        isIndonesianClient(){
            return isIndonesianClient() && this.report?.ddsReportExporter?.exporter_cf_id;
        },
        isOperatorData(){
            return !Object.values(this.report.operator).every(x => x == 'N/A')
        },
        isSupplierData(){
            return !Object.values(this.report.supplier).every(x => x == 'N/A') 
        },
        isKenyaClient(){
            return isKenyaClient()
        }
    },
    mounted(){
        if (this.report?.ddsReportExporter?.exporter_cf_id) {
            this.getExporterDetailsById(this.report.ddsReportExporter.exporter_cf_id);
        }
    },
    watch: {
        'report.ddsReportExporter.exporter_cf_id': {
            handler(newExporterId) {
                if (newExporterId) {
                    this.getExporterDetailsById(newExporterId);
                }
            },
            immediate: true
        }
    },
    methods: {
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

    }
}
</script>