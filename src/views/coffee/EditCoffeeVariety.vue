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
                
                <v-toolbar-title class="font-weight-bold">{{ $t("coffeeData.updateCoffeeVariety") }} </v-toolbar-title>

                <v-spacer></v-spacer>

                <v-btn icon class="white--text" @click="closeModal">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-form
              @submit.prevent="updateVariety"
              ref="treeForm"
              v-model="valid"
            >
            <v-card-text>
                <v-row class="mt-5" no-gutters>
                    <v-col cols="12">
                        <label for="mobile">{{ $t("coffeeData.updateCoffeeVariety") }} <span class="red--text">*</span></label>
                        <v-text-field
                            outlined
                            dense
                            class=""
                            v-model="name"
                            :rules="rules.name"
                        >

                        </v-text-field>
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
                    :disabled="name == editedData.name"
                >{{ $t("update") }}</v-btn>
            </v-card-actions>
            </v-form>
          </v-card>
        <!-- </template> -->
      </v-dialog>
</template>
<script>
import CoffeeService from "@/_services/CoffeeService.js"
import loading from "@/mixins/LoadingMixin";

export default {

    mounted(){
        this.name = this.editedData.name
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
            rules: {
                name: [
                    v => !!v || this.$t("coffeeData.topicRequired"),
                ],
            }
        }
    },
    methods: {

        async updateVariety(){
            if(!this.$refs.treeForm.validate()) return;

            this.startLoading()
            try {
                const d = await CoffeeService.updateCoffeeVariety(this.editedData.id, {name: this.name})
                if(d.code === 200){
                    this.$notify({
                        title: this.$t("coffeeData.coffeeVarietySuccess"),
                        type: 'success'
                    });
                    this.closeModal(true)
                    this.stopLoading()
                }else{
                    this.$notify({
                        title: this.$t("serverError"),
                        type: 'error'
                    });
                    this.closeModal()
                    this.stopLoading()
                }
                
            } catch (error) {
                console.log(error)
                this.$notify({
                    title: this.$t("serverError"),
                    type: 'error'
                });
                this.closeModal()
                this.stopLoading()
            }
            
        },

        closeModal(suc = false){
            this.$emit('close-modal', suc)
        }
    },
    mixins: [loading]
}
</script>
