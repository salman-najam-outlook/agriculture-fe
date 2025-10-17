<template>
    <div>
        <!-- TODO: delete this module -->
           <!-- <v-card
                elevation="0"
                class="px-5 pb-5"
            >
                <v-card-title>
                    <span class="text-h5 font-weight-bold">{{ $t('dashboardSection.allowances') }}</span>
                </v-card-title>
                <v-card-text>
                    <v-row class="" width="100%">
                        <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                            <v-card min-height="150" class="pa-2 green2 elevation-0">
                                <v-list class="green2">
                                    <v-list-item three-line>
                                        <v-list-item-content>
                                        <v-list-item-subtitle>{{ $t('dashboardSection.maxUserAllowed') }}
                                            <v-tooltip top color="black" max-width="350">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-icon
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    >
                                                    mdi-information-outline
                                                    </v-icon>
                                                </template>
                                                <span>{{ $t('dashboardSection.maxUserAllowed') }}</span>
                                            </v-tooltip>
                                        </v-list-item-subtitle>
                                        <v-list-item-title class="text-h6 mt-2">
                                            {{ dashboardData.allowances ? dashboardData.allowances.maxUserAllowed:'' }}
                                        </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-card>
                        </div>
                        <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                        <v-card  min-height="150" class="pa-2 green2 elevation-0">
                            <v-list class="green2">
                                <v-list-item three-line>
                                    <v-list-item-content>
                                    <v-list-item-subtitle> {{ $t('dashboardSection.satelliteReportsAllowed') }}
                                        <v-tooltip top color="black" max-width="350">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon
                                                v-bind="attrs"
                                                v-on="on"
                                                >
                                                mdi-information-outline
                                                </v-icon>
                                            </template>
                                            <span>{{ $t('dashboardSection.satelliteReportsAllowed') }}</span>
                                        </v-tooltip>
                                    </v-list-item-subtitle>
                                    <v-list-item-title class="text-h6 mt-2">
                                       {{ dashboardData.allowances ? dashboardData.allowances.sateliteReportsAllowed: '' }}
                                    </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-card>
                        </div>
                        <v-col lg="3" md="6" sm="6" xs="12">
                        <v-card  min-height="150" class="pa-2 green2 elevation-0">
                            <v-list class="green2">
                                <v-list-item three-line>
                                    <v-list-item-content>
                                    <v-list-item-subtitle>{{ $t('dashboardSection.advanceReport') }}
                                        <v-tooltip top color="black" max-width="350">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon
                                                v-bind="attrs"
                                                v-on="on"
                                                >
                                                mdi-information-outline
                                                </v-icon>
                                            </template>
                                            <span>{{ $t('dashboardSection.advanceReport') }}</span>
                                        </v-tooltip>
                                    </v-list-item-subtitle>
                                    <v-list-item-title class="text-h6 mt-2">
                                       {{ dashboardData.allowances ? dashboardData.allowances.advancedReportsAllowed : '' }}
                                    </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-card>
                        </v-col>
                          <v-col lg="3" md="6" sm="6" xs="12">
                            <v-card  min-height="150" class="pa-2 green2 elevation-0">
                                <v-list class="green2">
                                    <v-list-item three-line>
                                        <v-list-item-content>
                                        <v-list-item-subtitle>{{ $t('dashboardSection.subscriptionUpTo') }}
                                            <v-tooltip top color="black" max-width="350">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-icon
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    >
                                                    mdi-information-outline
                                                    </v-icon>
                                                </template>
                                                <span>{{ $t('dashboardSection.subscriptionUpTo') }}</span>
                                            </v-tooltip>
                                        </v-list-item-subtitle>
                                        <v-list-item-title class="text-h6 mt-2">
                                        {{ dashboardData.allowances ? dashboardData.allowances.subscriptionUpTo : '' }}
                                        </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-card>
                        </v-col>
                         <v-col lg="3" md="6" sm="6" xs="12">
                            <v-card  min-height="150" class="pa-2 green2 elevation-0">
                                <v-list class="green2">
                                    <v-list-item three-line>
                                        <v-list-item-content>
                                        <v-list-item-subtitle>{{ this.$t('dashboardSection.roleAllowed') }}
                                            <v-tooltip top color="black" max-width="350">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-icon
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    >
                                                    mdi-information-outline
                                                    </v-icon>
                                                </template>
                                                <span>{{ this.$t('dashboardSection.roleAllowed') }}</span>
                                            </v-tooltip>
                                        </v-list-item-subtitle>
                                        <v-list-item-title class="text-h6 mt-2">
                                        {{ this.$t('dashboardSection.roleList')}}
                                        </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-card>
                        </v-col>
                         <v-col lg="3" md="6" sm="6" xs="12">
                            <v-card  min-height="150" class="pa-2 green2 elevation-0">
                                <v-list class="green2">
                                    <v-list-item three-line>
                                        <v-list-item-content>
                                        <v-list-item-subtitle>{{ this.$t('dashboardSection.moduleAllowed') }}
                                            <v-tooltip top color="black" max-width="350">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-icon
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    >
                                                    mdi-information-outline
                                                    </v-icon>
                                                </template>
                                                <span>{{ this.$t('dashboardSection.moduleAllowed') }}</span>
                                            </v-tooltip>
                                        </v-list-item-subtitle>
                                        <v-list-item-title class="text-h6 mt-2">
                                        25
                                        </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card> -->
            <v-card
                elevation="0"
                class="px-5 pb-5 mt-5"
            >
                <v-card-title>
                    <span class="text-h5 font-weight-bold">{{ this.$t('users') }}</span>
                </v-card-title>
                <v-card-text>
                    <v-row class="" width="100%">
                        <v-col lg="3" md="6" sm="6" xs="12">
                            <v-card min-height="150" class="pa-2 green2 elevation-0">
                                <v-list class="green2">
                                    <v-list-item three-line>
                                        <v-list-item-content>
                                        <v-list-item-subtitle>{{ $t('dashboardSection.registeredUsers') }}
                                            <v-tooltip top color="black" max-width="350">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-icon
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    >
                                                    mdi-information-outline
                                                    </v-icon>
                                                </template>
                                                <span>{{ $t('dashboardSection.registeredUsers') }}</span>
                                            </v-tooltip>
                                        </v-list-item-subtitle>
                                        <v-list-item-title class="text-h6 mt-2">
                                            {{ dashboardData.users ? dashboardData.users.registeredUsers : '' }}
                                        </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-card>
                        </v-col>
                        <!-- <v-col lg="3" md="6" sm="6" xs="12">
                        <v-card  min-height="150" class="pa-2 green2 elevation-0">
                            <v-list class="green2">
                                <v-list-item three-line>
                                    <v-list-item-content>
                                    <v-list-item-subtitle> {{ this.$t('dashboardSection.validMemberships') }}
                                        <v-tooltip top color="black" max-width="350">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon
                                                v-bind="attrs"
                                                v-on="on"
                                                >
                                                mdi-information-outline
                                                </v-icon>
                                            </template>
                                            <span>{{ this.$t('dashboardSection.validMemberships') }}</span>
                                        </v-tooltip>
                                    </v-list-item-subtitle>
                                    <v-list-item-title class="text-h6 mt-2">
                                        {{ dashboardData.users ? dashboardData.users.vaildMemberships : '' }}
                                    </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-card>
                        </v-col> -->
                        <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                        <v-card  min-height="150" class="pa-2 green2 elevation-0">
                            <v-list class="green2">
                                <v-list-item three-line>
                                    <v-list-item-content>
                                    <v-list-item-subtitle>{{ $t('dashboardSection.activeUsers') }}
                                        <v-tooltip top color="black" max-width="350">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon
                                                v-bind="attrs"
                                                v-on="on"
                                                >
                                                mdi-information-outline
                                                </v-icon>
                                            </template>
                                            <span>{{ $t('dashboardSection.activeUsers') }}</span>
                                        </v-tooltip>
                                    </v-list-item-subtitle>
                                    <v-list-item-title class="text-h6 mt-2">
                                       {{ dashboardData.users ? dashboardData.users.activeUsers : '' }}
                                    </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-card>
                        </div>
                          <v-col lg="3" md="6" sm="6" xs="12">
                        <v-card  min-height="150" class="pa-2 green2 elevation-0">
                            <v-list class="green2">
                                <v-list-item three-line>
                                    <v-list-item-content>
                                    <v-list-item-subtitle>{{ $t('dashboardSection.deactivatedUsers') }}
                                        <v-tooltip top color="black" max-width="350">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon
                                                v-bind="attrs"
                                                v-on="on"
                                                >
                                                mdi-information-outline
                                                </v-icon>
                                            </template>
                                            <span>{{ $t('dashboardSection.deactivatedUsers') }}</span>
                                        </v-tooltip>
                                    </v-list-item-subtitle>
                                    <v-list-item-title class="text-h6 mt-2">
                                       {{ dashboardData.users ? dashboardData.users.deactivatedUsers : '' }}
                                    </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-card>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
            <v-card
                elevation="0"
                class="px-5 pb-5 mt-5"
            >
                <v-card-title>
                    <span class="text-h5 font-weight-bold">{{ this.$t('membershipPlans') }}</span>
                </v-card-title>
                <v-card-text>
                    <v-row class="" width="100%">
                        <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12" v-for="(plan, i) in dashboardData.membershipTypes" :key="i">
                            <v-card min-height="150" class="pa-2 green2 elevation-0">
                                <v-list class="green2">
                                    <v-list-item three-line>
                                        <v-list-item-content>
                                        <v-list-item-subtitle>{{ plan.membershipTypes }}
                                            <v-tooltip top color="black" max-width="350">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-icon
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    >
                                                    mdi-information-outline
                                                    </v-icon>
                                                </template>
                                                <span>{{ plan.membershipTypes }}</span>
                                            </v-tooltip>
                                        </v-list-item-subtitle>
                                            <v-list-item-title class="text-h6 mt-2">
                                                {{ plan.count }}
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-card>
                        </div>
                    </v-row>
                </v-card-text>
            </v-card>
            <v-card
                elevation="0"
                class="px-5 pb-5 mt-5"
            >
                <v-card-title>
                    <span class="text-h5 font-weight-bold">{{ this.$t('dashboardSection.membershipValidity') }}</span>
                </v-card-title>
                <v-card-text>
                    <v-row class="" width="100%">
                        <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                            <v-card min-height="150" class="pa-2 green2 elevation-0">
                                <v-list class="green2">
                                    <v-list-item three-line>
                                        <v-list-item-content>
                                        <v-list-item-subtitle>{{ $t('dashboardSection.lessThan1Month') }}
                                            <v-tooltip top color="black" max-width="350">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-icon
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    >
                                                    mdi-information-outline
                                                    </v-icon>
                                                </template>
                                                <span>{{ $t('dashboardSection.lessThan1Month') }}</span>
                                            </v-tooltip>
                                        </v-list-item-subtitle>
                                        <v-list-item-title class="text-h6 mt-2">
                                            {{ dashboardData.membershipDurations ? dashboardData.membershipDurations.lessThanMonth : '' }}
                                        </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-card>
                        </div>
                        <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                        <v-card  min-height="150" class="pa-2 green2 elevation-0">
                            <v-list class="green2">
                                <v-list-item three-line>
                                    <v-list-item-content>
                                    <v-list-item-subtitle> {{ $t('dashboardSection.months1to6') }}
                                        <v-tooltip top color="black" max-width="350">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon
                                                v-bind="attrs"
                                                v-on="on"
                                                >
                                                mdi-information-outline
                                                </v-icon>
                                            </template>
                                            <span>{{ $t('dashboardSection.months1to6') }}</span>
                                        </v-tooltip>
                                    </v-list-item-subtitle>
                                    <v-list-item-title class="text-h6 mt-2">
                                       {{ dashboardData.membershipDurations ? dashboardData.membershipDurations.omeToSixMonths : '' }}
                                    </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-card>
                        </div>
                        <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                        <v-card  min-height="150" class="pa-2 green2 elevation-0">
                            <v-list class="green2">
                                <v-list-item three-line>
                                    <v-list-item-content>
                                    <v-list-item-subtitle>{{ $t('dashboardSection.months6to12') }}
                                        <v-tooltip top color="black" max-width="350">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon
                                                v-bind="attrs"
                                                v-on="on"
                                                >
                                                mdi-information-outline
                                                </v-icon>
                                            </template>
                                            <span>{{ $t('dashboardSection.months6to12') }}</span>
                                        </v-tooltip>
                                    </v-list-item-subtitle>
                                    <v-list-item-title class="text-h6 mt-2">
                                       {{ dashboardData.membershipDurations ? dashboardData.membershipDurations.sixMonthsToOneYear :'' }}
                                    </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-card>
                        </div>
                          <v-col lg="3" md="6" sm="6" xs="12">
                        <v-card  min-height="150" class="pa-2 green2 elevation-0">
                            <v-list class="green2">
                                <v-list-item three-line>
                                    <v-list-item-content>
                                    <v-list-item-subtitle>{{ $t('dashboardSection.moreThan1Year') }}
                                        <v-tooltip top color="black" max-width="350">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon
                                                v-bind="attrs"
                                                v-on="on"
                                                >
                                                mdi-information-outline
                                                </v-icon>
                                            </template>
                                            <span>{{ $t('dashboardSection.moreThan1Year') }}</span>
                                        </v-tooltip>
                                    </v-list-item-subtitle>
                                    <v-list-item-title class="text-h6 mt-2">
                                       {{ dashboardData.membershipDurations ? dashboardData.membershipDurations.moreThanYear : '' }}
                                    </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-card>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
            <!-- Crop -->
            <!-- <v-card
                elevation="0"
                class="px-5 pb-5 mt-5"
            >
                <v-card-title>
                    <span class="text-h5 font-weight-bold">{{ $t('dashboardSection.cropOverview') }}</span>
                </v-card-title>
                <v-card-text>
                    <v-row class="" width="100%">
                        <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                            <v-card min-height="150" class="pa-2 green2 elevation-0">
                                <v-list class="green2">
                                    <v-list-item three-line>
                                        <v-list-item-content>
                                        <v-list-item-subtitle>{{ $t('dashboardSection.plantations') }}
                                            <v-tooltip top color="black" max-width="350">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-icon
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    >
                                                    mdi-information-outline
                                                    </v-icon>
                                                </template>
                                                <span>{{ $t('dashboardSection.plantations') }}</span>
                                            </v-tooltip>
                                        </v-list-item-subtitle>
                                        <v-list-item-title class="text-h6 mt-2">
                                            {{ dashboardData.cropOverview ? dashboardData.cropOverview.plantation : '' }}
                                        </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-card>
                        </div>
                        <v-col lg="3" md="6" sm="6" xs="12">
                        <v-card  min-height="150" class="pa-2 green2 elevation-0">
                            <v-list class="green2">
                                <v-list-item three-line>
                                    <v-list-item-content>
                                    <v-list-item-subtitle> {{ $t('dashboardSection.coffeeData') }}
                                        <v-tooltip top color="black" max-width="350">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon
                                                v-bind="attrs"
                                                v-on="on"
                                                >
                                                mdi-information-outline
                                                </v-icon>
                                            </template>
                                            <span>{{ $t('dashboardSection.coffeeData') }}</span>
                                        </v-tooltip>
                                    </v-list-item-subtitle>
                                    <v-list-item-title class="text-h6 mt-2">
                                       {{ dashboardData.cropOverview ? dashboardData.cropOverview.coffeeData : '' }}
                                    </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-card>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card> -->
    </div>
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin"

export default {
    async mounted(){
        const fetchData = async () => {
            await this.getDataboardData()
        }
        fetchData()
    },
    data(){
        return {
            dashboardData: {}
        }
    },
    methods: {
        async getDataboardData(){
            this.startLoading()
            try{
                const {data} = await this.$http.get('/dashboard');
                this.dashboardData = data.data;
                this.stopLoading()

            }catch(e){
                console.log(e)
                this.stopLoading()
            }
        }
    },
    mixins: [loadingMixin]
}
</script>