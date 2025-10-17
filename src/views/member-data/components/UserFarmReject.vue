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
                                <v-row>
                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 py-0">
                                        <label for="name" class="mb-1 danger"> You have Rejected User Farm Request Permission </label>
                                        <br>
                                        <label for="name">Reason For Rejection</label>
                                        <v-textarea
                                            solo
                                            name="input-7-4"
                                            class="mt-2"
                                            v-model="rejectMessage"
                                            label="Describe your reason here"
                                        ></v-textarea>
                                    </div>
                                </v-row>
                                <v-card-actions class="mt-10">
                                    <v-spacer></v-spacer>
                                    <v-btn @click="closeModal" outlined right height="44" width="116" depressed color="primary">
                                        {{ $t('memberDataSection.cancel') }}
                                    </v-btn>
                                    <v-btn @click="handleRejectFarmRequest"  right height="44" width="116" color="primary">
                                        {{ $t('memberDataSection.reject') }}
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
    name: 'user-farm-reject',
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
        }
    },
    data(){
        return{
            rejectMessage:''
        }
    },
    methods: {
        closeModal() {
            this.$emit('closeUserFarmReject')
        },
        handleRejectFarmRequest(){
          if(!this.rejectMessage) return
          this.$store.dispatch('memberData/handleChangeFarmStatus', {
            status:'rejected',
            rejectMessage:this.rejectMessage,
            farmId:this.selectedFarmId
          })
          this.farm.status = 'rejected'
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