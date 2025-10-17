<template>
    <v-container>
        <template>
            <div class="text-center">
                <v-dialog v-model="dialog" width="500" @click:outside="closeModal" :retain-focus="false">
                    <v-card class="custom-card" rounded="0">
                        <v-toolbar flat color="primary" class="white--text">
                            <v-toolbar-title class="font-weight-bold">{{
                                $t('memberDataSection.userFarmRequest') }}</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-btn icon class="white--text" @click="closeModal">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </v-toolbar>
                        <v-form ref="userFarmRequest" lazy-validation autocomplete="off">
                            <v-card-text class="black--text">
                                <p class="danger mb-1" v-if="farm.user.farm_limit_used > farm.user.farm_limit"> User Farm Limit is exceeded </p>
                                User has requested special permission to register more farms.
                                Please review user's request and take an action.
                            </v-card-text>
                            <v-card-text>
                                User Information :
                                <v-btn @click="handleUserFarmRequestApprove" color="primary" text>
                                    Views
                                </v-btn>
                            </v-card-text>
                            <v-divider></v-divider>

                            <v-card-text class="black--text">
                                <v-card-actions class="mt-10">
                                    <v-spacer></v-spacer>
                                    <v-btn @click="handleUserFarmRequestReject" outlined right height="44" width="116" depressed color="primary">
                                        {{ $t('memberDataSection.reject') }}
                                    </v-btn>
                                    <v-btn @click="handleApproveAction" right height="44" width="116" color="primary">
                                        {{ $t('memberDataSection.approve') }}
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
import {mapGetters} from 'vuex'
export default {
    name: 'user-farm-request',
    props: {
        'dialogI': {
            type: Boolean,
            required: true
        },
        'selectedFarmId':{
            type:Number,
            required:false
        }
    },
    computed: {
        dialog() {
            return this.dialogI;
        },
        ...mapGetters({'farms': 'memberData/farms'}),
        farm(){
            const farmData = this.farms.filter(item => item.id == this.selectedFarmId)
            return farmData.length ? farmData[0] : null
        },
    },
    methods: {
        closeModal() {
            this.$emit('closeUserFarmRequest')
        },

        handleUserFarmRequestReject(){
            this.$emit('popupUserFarmReject')
        },
        handleUserFarmRequestApprove() {
            this.$emit('popupUserFarmApprove')
        },
        handleApproveAction(){
          this.$store.dispatch('memberData/handleChangeFarmStatus', {
            status:'approved',
            farmId:this.selectedFarmId
          })
          this.farm.status = 'approved'
          this.$store.commit('memberData/UPDATE_FARM_DATA_ROW', this.farm)  
          this.closeModal() 
        }
    }
}

</script>
<style scoped lang="scss">
::v-deep .danger{
    color:#F03737;
}
</style>