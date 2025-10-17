<template>
    <v-dialog v-model="dialogI" width="500" @click:outside="closeModal" :retain-focus="false">
        <v-card class="custom-card" rounded="0">
            <v-toolbar flat color="primary" class="white--text">
                <v-toolbar-title class="font-weight-bold">{{ $t('deforestation.shareQRCode') }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon class="white--text" @click="closeModal">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text class="black--text">
                    <v-row>
                        <v-col sm="12">
                            <div class="qr-box" style="text-align: center;">
                                <div class="qr-code" v-if="detail.etherScanLink">
                                    <qr-code :text="detail.etherScanLink">  </qr-code>
                                </div>
                                <p class="mt-5"> {{ detail.reportGuid }} </p>
                            </div>
                            <div class="input-box" style="display: flex;">
                                <v-text-field v-model="link" outlined dense></v-text-field> 
                                <v-btn dark color="primary" class="ml-2" @click="copyLink"> {{  $t('deforestation.copy') }} </v-btn>
                            </div>
                            <!-- <div class="share-btn">
                                <v-btn x-medium outlined color="primary" style="text-align: center;"> {{  $t('deforestation.shareQRCode') }} </v-btn>
                            </div>    -->
                        </v-col>
                    </v-row>
                </v-card-text>
        </v-card>
    </v-dialog>
</template>
<style scoped>
.share-btn{
    display: flex;
    flex-direction: row;
    justify-content: center;
}
.qr-code{
    display: flex;
    justify-content: center;
    margin-top: 19px;
}
</style>
<script>
import VueQRCodeComponent from 'vue-qrcode-component'
export default {
    props:{
        dialogI:{
            required:true
        },
        detail:{
            required:true
        }
    },
    components:{
        ["qr-code"]: VueQRCodeComponent
    },
    computed:{
        link(){
            return this.detail.etherScanLink
        }
    },
    data() {
       return {}
    },
    methods:{
        closeModal(){
            this.$emit('closeEvent')
        },
        async copyLink(){
            await navigator.clipboard.writeText(this.link);
        }
    }
}
</script>