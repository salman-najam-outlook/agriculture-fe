<template>
    <v-dialog
       transition="dialog-top-transition"
       max-width="600"
       v-model="dialog"
       @click:outside="closeModal"
     >
         <v-card class="">
           <v-toolbar
             color="primary"
             dark
             flat
             dense
           >
               <v-toolbar-title class="font-weight-bold">{{ title }}</v-toolbar-title>
               <v-spacer></v-spacer>
               <v-btn icon class="white--text" @click="closeModal">
                   <v-icon>mdi-close</v-icon>
               </v-btn>
           </v-toolbar>
           <v-form
             @submit.prevent="createTreeType"
             ref="treeForm"
             v-model="valid"
           >
           <v-card-text>
               <v-row class="mt-5" no-gutters>
                   <v-col cols="12">
                       <label for="mobile">{{ title }}<span class="red--text">*</span></label>
                       <v-text-field
                           outlined
                           dense
                           class=""
                           v-model="name"
                           :rules="rules.name"
                       >

                       </v-text-field>
                   </v-col>
                   <v-col cols="12" v-if="treeType =='cacaoVariety'">
                       <label for="mobile">{{ $t("coffeeData.selectVariety")}} <span class="red--text">*</span></label>
                       <v-select
                           :items="species"
                           item-value="id"
                           item-text="name"
                           outlined
                           dense
                           v-model="specie"
                       ></v-select>
                   </v-col>
               </v-row>
           </v-card-text>

           <v-divider></v-divider>
           <v-card-actions class="justify-end py-5">
               <v-btn
                   outlined
                   color="primary"
                   @click="closeModal"
               >{{ $t("cancel")}}</v-btn>
               <v-btn
                   color="primary"
                   type="submit"
               >{{ $t("submit")}}</v-btn>
           </v-card-actions>
           </v-form>
         </v-card>
       <!-- </template> -->
     </v-dialog>
</template>
<script>
import CacaoDataService from "@/_services/CacaoDataService.js"
import loading from "@/mixins/LoadingMixin";

export default {
   created() {
      this.fetchCacaoSpecies()
   },
   props: {
       dialog: {
           required: false,
           type: Boolean
       },
       title: {
           required: true,
           type: String
       },
       treeType: {
           required: true,
           type: String
       }
   },
   data(){
       return {
           valid: true,
           name: "",
           rules: {
               name: [
                   v => !!v || this.$t("coffeeData.topicRequired"),
               ],
           },
           species:[],
           specie:''
       }
   },
   methods: {
      async fetchCacaoSpecies(){
        if(this.treeType=='cacaoVariety') {
            this.startLoading()
            CacaoDataService.getCacaoTreeData(`cacaoSpecies`).then(res => {
                this.species = res.data.rows
                if(res.data.rows.length){
                    this.specie = res.data.rows[0].id
                }
                this.stopLoading()
            }).catch(() => {
                this.stopLoading()
          })  
        }
      },
      createTreeType(){
           if(!this.$refs.treeForm.validate()) return;
           const reqPayload = {
            name:this.name,
           }
           if(this.treeType == 'cacaoVariety') {
             reqPayload.cacao_species = this.specie
           }
           this.startLoading()
           console.log("Res")
            CacaoDataService.createCacaoTreeType(this.treeType,reqPayload).then(() => {
                   this.$notify({
                       title: this.$t("coffeeData.treeTypeSuccess"),
                       type: 'success'
                   });
                this.closeModal(true)
                this.stopLoading()
               }).catch(() => {
                    this.$notify({
                       title: this.$t("serverError"),
                       type: 'error'
                   });
                this.closeModal()
                this.stopLoading()
            })
       },

       closeModal(suc = false){
           this.$emit('close-modal', suc)
       }
   },
   mixins: [loading]
}
</script>
