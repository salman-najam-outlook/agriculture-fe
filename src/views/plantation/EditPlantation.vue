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
                
                <v-toolbar-title class="font-weight-bold">{{ $t('plantation.updatePlantationStatus')}}</v-toolbar-title>

                <v-spacer></v-spacer>

                <v-btn icon class="white--text" @click="closeModal">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-form
              @submit.prevent="updatePlantation"
              ref="treeForm"
              v-model="valid"
            >
            <v-card-text>
                <v-row class="mt-5" no-gutters>
                    <v-col cols="12">
                        <label for="mobile">{{ $t('status')}} <span class="red--text">*</span></label>
                        <v-select
                            :items="statuses"
                            item-text="text"
                            item-value="val"
                            outlined
                            dense
                            v-model="status"
                            :rules="rules.status"
                        ></v-select>
                    </v-col>
                    <v-col cols="6"></v-col>
                    <v-col cols="12" v-if="status =='rejected'">
                        <label for="mobile">{{ $t('roleRequest.message')}} <span class="red--text">*</span></label>
                        <v-textarea
                            outlined
                            dense
                            class=""
                            v-model="name"
                            :rules="rules.name"
                        >

                        </v-textarea>
                    </v-col>
                </v-row>
            </v-card-text>

            <v-divider></v-divider>
            <v-card-actions class="justify-end py-5">
                <v-btn
                    outlined
                    color="primary"
                    @click="closeModal"
                >{{ $t('close')}}</v-btn>
                <v-btn
                    color="primary"
                    type="submit"
                    :disabled="status==''"
                >{{ $t('update')}}</v-btn>
            </v-card-actions>
            </v-form>
          </v-card>
        <!-- </template> -->
      </v-dialog>
</template>
<script>
import PlantationService from "@/_services/PlantationService.js"
import loading from "@/mixins/LoadingMixin";

export default {

    mounted(){
     
    },
    props: {
        dialog: {
            required: false,
            type: Boolean
        },
        editedData: {
            required: true,
            type: Object
        }
    },
    data(){
        return {
            valid: true,
            name: "",
            status: '',
            statuses: [
                { text: this.$t('memberDataSection.approve'), val: 'approved'},
                { text: this.$t('memberDataSection.reject'), val: 'rejected'}
            ],
            rules: {
                status: [
                    v => !!v || 'Status is required',
                ],
                name: [
                    v => !!v || 'Rejection message is required',
                ],
            }
        }
    },
    methods: {

        async updatePlantation(){
            if(!this.$refs.treeForm.validate()) return;

            this.startLoading()
            try {
                const d = await PlantationService.updatePlantation(this.editedData.id, {
                    status: this.status,
                    rejectionReason: this.name
                })
                if(d.code === 200){
                    this.$notify({
                        title: 'Plantation Status updated successfully.',
                        type: 'success'
                    });
                    this.closeModal(true)
                    this.stopLoading()
                }else{
                    this.$notify({
                        title: 'Something went wrong.',
                        type: 'error'
                    });
                    this.closeModal()
                    this.stopLoading()
                }
                
            } catch (error) {
                // console.log(error)
                this.$notify({
                    title: 'Something went wrong.',
                    type: 'error'
                });
                this.closeModal()
                this.stopLoading()
            }
            
        },

        closeModal(suc = false){
            this.name= ""
            this.status= ''
            this.$emit('close-modal', suc)
        }
    },
    mixins: [loading]
}
</script>
