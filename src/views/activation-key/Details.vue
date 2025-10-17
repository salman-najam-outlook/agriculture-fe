<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div v-if="keyDate">
                <div class="d-flex mb-4">
                    <h2>{{ this.$t('activationKey.activationKey') }}</h2>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="primary"
                        depressed
                        dark
                        small
                        class="mr-3"
                        @click="$router.push({name: 'ActivationKeyList'})"
                    >
                    {{ this.$t('activationKey.viewActKey') }}
                    </v-btn>
                    <!-- <v-btn
                        color="primary"
                        dark
                        small
                        class="mr-3"
                        @click="editSettings = true"
                    >
                    {{ this.$t('GENERATE ACTIVATION KEYS') }}
                    </v-btn> -->
                </div>
                <v-card
                    elevation="0"
                    class="px-5 pb-10"
                >
                    <v-card-title>
                        <span class="text-h5 font-weight-bold">{{ this.$t('activationKey.actKeyQuota') }}</span>
                    </v-card-title>
                    <v-card-text>
                        <v-row class="mt-5" width="100%">
                            <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                                <v-card min-height="130" class="pa-2 green2 elevation-0">
                                    <v-list class="green2">
                                        <v-list-item three-line>
                                            <v-list-item-content>
                                            <v-list-item-subtitle>{{ this.$t('activationKey.actKeyQuota') }}
                                                <v-tooltip top color="black" max-width="350">
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-icon
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        >
                                                        mdi-information-outline
                                                        </v-icon>
                                                    </template>
                                                    <span>{{ this.$t('activationKey.actKeyQuota') }}</span>
                                                </v-tooltip>
                                            </v-list-item-subtitle>
                                            <v-list-item-title class="text-h6 mt-2">
                                                {{activationKeyData.noOfkeysAllowed}}
                                            </v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list>
                                </v-card>
                            </div>
                            <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                            <v-card  min-height="130" class="pa-2 green2 elevation-0">
                                <v-list class="green2">
                                    <v-list-item three-line>
                                        <v-list-item-content>
                                        <v-list-item-subtitle> {{ this.$t('activationKey.genActKey') }}
                                            <v-tooltip top color="black" max-width="350">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-icon
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    >
                                                    mdi-information-outline
                                                    </v-icon>
                                                </template>
                                                <span>{{ this.$t('activationKey.genActKey') }}</span>
                                            </v-tooltip>
                                        </v-list-item-subtitle>
                                        <v-list-item-title class="text-h6 mt-2">
                                            {{ activationKeyData.generatedActivationKeys }}
                                        </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-card>
                            </div>
                            <v-col lg="4" md="6" sm="6" xs="12">
                            <v-card  min-height="130" class="pa-2 green2 elevation-0">
                                <v-list class="green2">
                                    <v-list-item three-line>
                                        <v-list-item-content>
                                        <v-list-item-subtitle>{{ this.$t('activationKey.remActKey') }}
                                            <v-tooltip top color="black" max-width="350">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-icon
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    >
                                                    mdi-information-outline
                                                    </v-icon>
                                                </template>
                                                <span>{{ this.$t('activationKey.remActKey') }}</span>
                                            </v-tooltip>
                                        </v-list-item-subtitle>
                                        <v-list-item-title class="text-h6 mt-2">
                                            {{ (activationKeyData.noOfkeysAllowed - activationKeyData.generatedActivationKeys) }}
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
                    class="px-5 mt-5 pb-10"
                >
                    <v-card-title>
                        <span class="text-h5 font-weight-bold"> {{ this.$t('activationKey.penUsed') }}</span>
                    </v-card-title>
                    <v-card-text>
                        <v-row class="mt-5" width="100%">
                            <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                                <v-card   min-height="130" class="pa-2 green2 elevation-0">
                                    <v-list class="green2">
                                        <v-list-item three-line>
                                            <v-list-item-content>
                                            <v-list-item-subtitle>{{ this.$t('activationKey.activationKeyAss') }}
                                                <v-tooltip top color="black" max-width="350">
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-icon
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        >
                                                        mdi-information-outline
                                                        </v-icon>
                                                    </template>
                                                    <span>{{ this.$t('activationKey.activationKeyAss') }}</span>
                                                </v-tooltip>
                                            </v-list-item-subtitle>
                                            <v-list-item-title class="text-h6 mt-2">
                                                {{ activationKeyData.assignedKeys }}
                                            </v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list>
                                </v-card>
                            </div>
                            <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                            <v-card  min-height="130" class="pa-2 green2 elevation-0">
                                <v-list class="green2">
                                    <v-list-item three-line>
                                        <v-list-item-content>
                                        <v-list-item-subtitle>{{ this.$t('activationKey.activationKeyUnass') }}
                                            <v-tooltip top color="black" max-width="350">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-icon
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    >
                                                    mdi-information-outline
                                                    </v-icon>
                                                </template>
                                                <span>{{ this.$t('activationKey.activationKeyUnass') }}</span>
                                            </v-tooltip>
                                        </v-list-item-subtitle>
                                        <v-list-item-title class="text-h6 mt-2">
                                        {{ activationKeyData.unassignedKeys }}
                                        </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-card>
                            </div>
                            <v-col lg="4" md="6" sm="6" xs="12">
                            <v-card  min-height="130" class="pa-2 green2 elevation-0">
                                <v-list class="green2">
                                    <v-list-item three-line>
                                        <v-list-item-content>
                                        <v-list-item-subtitle> {{ this.$t('activationKey.keysAct') }}
                                            <v-tooltip top color="black" max-width="350">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-icon
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    >
                                                    mdi-information-outline
                                                    </v-icon>
                                                </template>
                                                <span>{{ this.$t('activationKey.keysAct') }}</span>
                                            </v-tooltip>
                                        </v-list-item-subtitle>
                                        <v-list-item-title class="text-h6 mt-2">
                                        {{ activationKeyData.activatedKeys }}
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
                    class="px-5 mt-5 pb-10"
                >
                    <v-card-title>
                        <span class="text-h5 font-weight-bold">{{ this.$t('activationKey.uploadedFiles') }}</span>
                    </v-card-title>
                    <v-card-text>
                        <v-row class="mt-5" width="100%">
                            <v-col lg="4" md="6" sm="6" xs="12">
                                <v-card min-height="130" class="pa-2 green2 elevation-0">
                                    <v-list class="green2">
                                        <v-list-item three-line>
                                            <v-list-item-content>
                                            <v-list-item-subtitle>{{ this.$t('activationKey.uploadedFiles') }}
                                                <v-tooltip top color="black" max-width="350">
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-icon
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        >
                                                        mdi-information-outline
                                                        </v-icon>
                                                    </template>
                                                    <span>{{ this.$t('activationKey.uploadedFiles') }}</span>
                                                </v-tooltip>
                                            </v-list-item-subtitle>
                                            <v-list-item-title class="text-h6 mt-2">
                                                {{ activationKeyData.uploadedFiles }}
                                            </v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </div>
            <div v-else>
                <div class="d-flex mb-4">
                    <h2>{{ this.$t('activationKey.activationKey') }}</h2>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="primary"
                        dark
                        small
                        class="mr-3"
                        @click="editSettings = true"
                    >
                    {{ this.$t('activationKey.generateActKey') }}
                    </v-btn>
                </div>
                <v-card min-height="80vh" class="text-center" style="padding-top:5%" flat>
                    <v-btn
                        color="primary"
                        @click="keyDate = !keyDate"
                        text
                    >{{ this.$t('activationKey.showData') }}</v-btn>
                      <v-row align="center"
                            justify="center">
                            <v-col>
                                <v-img
                                    max-height="300"
                                    max-width="300"
                                    src="/icons/nodata.svg"
                                    class="img-center"
                                ></v-img>
                            <h5 class="mt-4 red--text">{{ this.$t('activationKey.noDataFound') }}</h5> 
                                <p class="text-caption black--text">{{ this.$t('activationKey.noActKey') }}. <br/> {{ this.$t('activationKey.pleaseGenKey') }}<br/> {{ this.$t('activationKey.buttonAbv') }}.</p>

                            </v-col>
                        </v-row>
                </v-card>
            </div>
        </v-container>
        <GenerateKey v-if="editSettings" @settingsUpdated="settingsUpdated" @closeEditSettings="closeEditSettings" :settings="settings" :dialogU="editSettings"/>
    </div>
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin"
import GenerateKey from "./GenerateKey.vue"
// import PermissionsService from '@/_services/PermissionsService'

export default {
    mounted() {
        document.title = this.$t('activationKey.activationKey');
        const fetchData = async () => {
            await this.getActivationKeyDetails()
        }
        fetchData()
    },
    components: {
        GenerateKey,
    },
    data() {
        return {
            keyDate: true,
            settings: {},
            editSettings: false,
            editGlobalSettings: false,
            activationKeyData: {},
            breadcrumbs: [
                {
                    text: this.$t('dashboard'),
                    to: {name: 'Dashboard'},
                },
                {
                    text: this.$t('activationKey.activationKey'),
                    disabled: true,
                    to: 'breadcrumbs_link_1',
                },
            ]
        }
    },
    methods: {
        closeEditSettings() {
            this.editSettings = false;
        },
        closeEditGlobalSettings() {
            this.editGlobalSettings = false;
        },
        async getActivationKeyDetails(){
            this.startLoading()

            try{
                const {data} = await this.$http.get('user/activation/dashboard')
                this.activationKeyData = data.data;

            }catch(err){
                // console.log('eee', err)
            }
            
            this.stopLoading()
        },
    },
    mixins: [loadingMixin]
}
</script>

<style lang="scss" scoped>
::v-deep .img-center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 70%;
}
</style>