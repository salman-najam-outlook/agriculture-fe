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
             @submit.prevent="updateTreeType"
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
                   <v-col cols="12" v-if="treeType == 'windBreaker' || treeType == 'horticultureInfo' || treeType == 'shadeTree'">
                       <label for="mobile">{{ $t('status') }}<span class="red--text">*</span></label>
                       <v-select
                           outlined
                           dense
                           v-model="status"
                           item-text="label"
                           item-value="val"
                           :items="statuses"
                       >
                       </v-select>
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
               >{{ $t("cancel") }}</v-btn>
               <v-btn
                   color="primary"
                   type="submit"
                   :disabled="editedData.name == name"
               >{{ $t("submit") }}</v-btn>
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
   mounted(){
       this.name = this.editedData.name
       this.specie = this.treeType=='cacaoVariety' ? this.editedData.CacaoSpecy.id: null
       this.status = this.editedData.status || null
   },
   async created(){
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
       },
       editedData: {
           required: true,
           type: Object
       }
   },
   data(){
       return {
           valid: true,
           name: null,
           status: null,
           species:[],
           statuses:[
            {label:this.$t('active'), val:'active'},
            {label:this.$t('inactive'), val:'inactive'},
           ],
           specie:'',
           rules: {
               name: [
                   v => !!v || this.$t("coffeeData.nameRequired"),
               ],
           }
       }
   },
   methods: {
        async fetchCacaoSpecies(){
            if(this.treeType=='cacaoVariety') {
                this.startLoading()
                CacaoDataService.getCacaoTreeData(`cacaoSpecies`).then(res => {
                    this.species = res.data.rows
                    this.stopLoading()
                }).catch(() => {
                    this.stopLoading()
            })  
            }
        },
       async updateTreeType(){
           if(!this.$refs.treeForm.validate()) return;
           this.startLoading()

           const reqPayload = {
              name:this.name,
              status:this.status
           }
           if(this.treeType=='cacaoVariety') {
             reqPayload.cacao_species = this.specie
           }

           CacaoDataService.updateCacaoTreeType(this.editedData.id,this.treeType,reqPayload).then(() => {
                this.$notify({
                       title: this.$t("coffeeData.treeTypeUpdateSuccess"),
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
