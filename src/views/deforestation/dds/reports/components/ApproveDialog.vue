<template>
    

    <v-dialog  transition="dialog-top-transition" max-width="600" v-model="dialog" @click:outside="closeModal">
        <div v-if="isDeclared"> <v-card rounded="0">
            
            <v-toolbar color="primary" class="white--text" flat :elevation="0">
                <v-toolbar-title class="font-weight-bold">
                    {{ $t('dueDiligence.confirmation') }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon class="white--text" @click="closeModal">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text class="pt-5">
                <div>
                  
                    <h3 style="color:black">
                        {{ $t('deforestation.approveMessage') }}
                    </h3>
                </div>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn outlined class="mr-2" depressed style="min-width: 150px;" @click="closeModal" color="primary">
                    {{ $t("cancel") }}
                </v-btn>
                <v-btn color="primary" style="min-width: 150px;" @click="confirmApprove">
                    {{ $t("confirm") }}
                </v-btn>
            </v-card-actions>
        </v-card></div>
        <div v-if="!isDeclared" > 
            <v-card rounded="0">
            <v-toolbar color="primary" class="white--text" flat :elevation="0">
                <v-toolbar-title class="font-weight-bold">
                    {{ $t('dueDiligence.declarationMissing') }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon class="white--text" @click="closeModal">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text class="pt-5">
                <div>
                  
                    <h3 style="color:black">
                        {{ $t('pleaseAgreeToDeclaration') }}
                    </h3>
                </div>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn outlined class="mr-2" depressed style="min-width: 150px;" @click="closeModal" color="primary">
                    {{ $t("cancel") }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </div>
       

        <!-- </template> -->
    </v-dialog>
</template>
<script>
import loading from "@/mixins/LoadingMixin";
import { mapGetters } from "vuex";
export default {
   
    // async mounted() { 
    //     console.log("EUDR Settings:", this.eudrSettings.declarations[0].isEnabled);
    //     this.isDeclared = this.eudrSettings.declarations[0].isEnabled;
    // },

    computed:{
        ...mapGetters("eudrSettings", ["get_EUDR_Settings"]),
        eudrSettings() {
            return this.get_EUDR_Settings;
        },
        isDeclared() {
            // Directly return the reactive value from eudrSettings
            return this.eudrSettings.declarations?.[0]?.isEnabled || false;
        }
    },
    watch: {
        eudrSettings: {
            handler(newVal) {
                console.log(newVal.declarations[0].isEnabled);
            },
            deep: true
        }
    },


    props: {
        dialog: {
            required: false,
            type: Boolean,
        },
    },

    data() {
        return {
            diligenceId: this.$route.params.id || null,
            isDelcared: '',
        };
    },
   
    methods: {
        closeModal(suc = false) {
            this.$emit("close-modal", suc);
        },
        confirmApprove() {
            this.$emit("confirm-approval");
        },

      
    },
    mixins: [loading],
};
</script>