<template>
<div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid >
        <div class="pa-5">
            <div class="d-flex mb-4">
                <h2>{{ $t('dashboardSection.availableModules')}}</h2>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    dark
                    class="mr-2"
                    @click="$router.push({ name: 'Dashboard'})"
                >
                    {{ $t('back')}}
                </v-btn>
            </div>
        </div>
        <v-card flat min-height="700">
            <v-card-text>
                   <v-expansion-panels flat focusable v-model="panel" multiple>
                        <v-expansion-panel class="mt-5" v-for="item in dashboardData" :key="item.id">
                            <v-expansion-panel-header class="primary white--text text-h6 font-weight-bold outline borderi">{{ item.name }}</v-expansion-panel-header>
                            <v-expansion-panel-content class="pt-5">    
                                <v-row>
                                    <v-col lg="3" md="6" sm="6" xs="12" v-for="(subitem, i) in item.modules" :key="i">
                                        <v-list-item >
                                            <v-list-item-icon>
                                                <v-icon >mdi-checkbox-blank-circle</v-icon>
                                            </v-list-item-icon>
                                            <v-list-item-content>
                                                <v-list-item-title >{{ subitem.name }}</v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-col>
                                </v-row>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
            </v-card-text>
        </v-card>
    </v-container>
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
            panel:0,
            dashboardData: [],
            breadcrumbs: [
                {
                    text: this.$t('dashboard'),
                    disabled: false,
                    to: '/',
                },
                {
                    text: this.$t('dashboardSection.availableModules'),
                    disabled: true,
                    to: '/',
                }
            ],
        }
    },
    methods: {
        async getDataboardData(){
            this.startLoading()
            try{
                const {data} = await this.$http.get('/dashboard/modules');
                this.dashboardData = data.data.allModules;
                this.stopLoading()

            }catch(e){
                this.stopLoading()
            }
        }
    },
    mixins: [loadingMixin]
}
</script>
