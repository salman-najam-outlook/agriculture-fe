<template>
    <v-container>
        <template>
            <div class="text-center">
                <v-dialog v-model="dialog" width="800" @click:outside="closeModal" :retain-focus="false">
                    <v-card class="custom-card" rounded="0">
                        <v-toolbar flat color="primary" class="white--text">
                            <v-toolbar-title class="font-weight-bold">{{
                                $t('memberDataSection.userInformation') }}</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-btn icon class="white--text" @click="closeModal">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </v-toolbar>
                        <v-form ref="userInformation" lazy-validation autocomplete="off">
                            <v-row class="mb-5">
                                <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10 py-0">
                                    <v-card-text class="black--text">
                                        Current Farm Limit : {{ userFarmInfo.currentFarmLimit }}
                                    </v-card-text>

                                    <v-card-text>
                                        <label for="name"> Enter new farm limit </label>
                                        <v-text-field type="number" v-model="farmLimit" class="mt-1" solo placeholder="| Enter farm limit"></v-text-field>
                                    </v-card-text>

                                    <div class="d-flex">
                                        <v-card-text class="pb-3 pt-3">
                                            <span class="font-weight-bold"> Farmer Name: </span>
                                           {{ userFarmInfo.farmerName }}
                                        </v-card-text>
                                        <v-card-text class="pb-3 pt-3">
                                            <span class="font-weight-bold"> Contact Information: </span>
                                            {{ userFarmInfo.contactInformation }}
                                        </v-card-text>
                                    </div>

                                    <v-card-text class="pt-3">
                                        <span class="font-weight-bold"> Requested Date: </span>
                                        {{ farm ? farm.createdAt: '' }}
                                    </v-card-text>
                                    </div>
                                </v-row>
                            <v-divider></v-divider>
                           <v-card-text class="pt-3 pb-2">
                                <h4 class="font-weight-bold"> Farm History: </h4>
                           </v-card-text>

                            <v-simple-table>
                                <template v-slot:default>
                                    <thead>
                                        <tr>
                                            <th class="text-left">
                                                Registered Farms(s)
                                            </th>
                                            <th class="text-left">
                                                Date of Registeration
                                            </th>
                                            <th class="text-left">
                                                Ownership Types
                                            </th>
                                            <th class="text-left">
                                                Location
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody v-if="userFarmInfo">
                                        <tr v-for="(farmHistory, key) in userFarmInfo.farmHistory" :key="key">
                                            <td> {{ farmHistory.registeredFarms }} </td>
                                            <td> {{ farmHistory.dateOfRegistration  }} </td>
                                            <td> {{ farmHistory.ownershipType }} </td>
                                            <td> {{ farmHistory.location }} </td>
                                        </tr>
                                    </tbody>
                                </template>
                            </v-simple-table>

                            <v-divider></v-divider>

                            <v-card-text class="black--text">
                                <v-card-actions class="mt-10">
                                    <v-spacer></v-spacer>
                                    <v-btn @click="closeModal" outlined right height="44" width="116"
                                        depressed color="primary">
                                        {{ $t('memberDataSection.cancel') }}
                                    </v-btn>
                                    <v-btn @click="handleUserFarmRequestApprove" right height="44" width="116" color="primary">
                                        {{ $t('memberDataSection.add') }}
                                    </v-btn>
                                </v-card-actions>
                            </v-card-text>

                        </v-form>
                    </v-card>
                </v-dialog>
            </div>
        </template>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import loadingMixin from "@/mixins/LoadingMixin";

export default {
    name: 'user-farm-request',
    props: {
        'dialogI': {
            type: Boolean,
            required: true
        },
        selectedFarmId:{
            type:Number,
            required:false
        }
    },
    data() {
        return {
            farmLimit:'',
        }
    },
    mounted(){
        this.startLoading()
        this.$store.dispatch('memberData/getFarmUserInfo', {
            userId:this.farm.user.id
        }).then(()=>this.stopLoading())
    },
    computed: {
        dialog() {
            return this.dialogI;
        },
        ...mapGetters({
            'farms': 'memberData/farms',
            'userFarmInfo': 'memberData/userFarmInfo'
        }),
        farm(){
            const farmData = this.farms.filter(item => item.id == this.selectedFarmId)
            return farmData.length ? farmData[0] : null
        }
    },
    methods: {
        closeModal() {
            this.$emit('closeUserInformation')
        },
        handleUserFarmRequestApprove() {
           if (!this.farmLimit) return
          this.$store.dispatch('memberData/handleChangeUserFarmLimit',{
              userId:this.farm.user.id,
              farm_limit:this.farmLimit
         })
         this.$store.dispatch('memberData/handleChangeFarmStatus', {
            status:'approved',
            farmId:this.selectedFarmId
          })
          this.farm.status = 'approved'
          this.farm.user.farm_limit = this.farmLimit
          this.$store.commit('memberData/UPDATE_FARM_DATA_ROW', this.farm)  
          this.closeModal() 
        }
    },
    mixins: [loadingMixin],
}

</script>