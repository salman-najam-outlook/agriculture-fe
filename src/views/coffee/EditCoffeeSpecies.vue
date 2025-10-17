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
                
                <v-toolbar-title class="font-weight-bold"> {{ $t("coffeeData.updateCoffeeSpecie")}}</v-toolbar-title>

                <v-spacer></v-spacer>

                <v-btn icon class="white--text" @click="closeModal">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-form
              @submit.prevent="updateSpecies"
              ref="treeForm"
              v-model="valid"
            >
            <v-card-text>
                <v-row class="mt-5" no-gutters>
                    <v-col cols="12">
                        <label for="mobile">{{ $t("coffeeData.updateCoffeeSpecie")}} <span class="red--text">*</span></label>
                        <v-text-field
                            outlined
                            dense
                            class=""
                            v-model="name"
                            :rules="rules.name"
                        >

                        </v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <label for="mobile">{{ $t("coffeeData.selectVariety")}} <span class="red--text">*</span></label>
                        <v-select
                            :items="varieties"
                            item-value="id"
                            item-text="name"
                            outlined
                            dense
                            v-model="variety"
                        ></v-select>
                    </v-col>
                    <v-col cols="12">
                        <label for="mobile">Status <span class="red--text">*</span></label>
                        <v-select
                            :items="[$t('active'),$t('inactive')]"
                            outlined
                            dense
                            v-model="status"
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

    async mounted(){

        const fetchData = async () => {
            this.startLoading();
            const a = await CoffeeService.getCoffeeVariety({ page: 1, itemsPerPage: 1000, sortBy: [] });
            this.varieties = a.data.rows;
            this.variety = this.editedData.coffee_variety;
            this.status = this.editedData.status ? 'Active': 'Inactive';
            this.name = this.editedData.name;
            this.status = this.editedData.status === null ? 'Inactive' : this.editedData.status
            this.stopLoading();
        }
        fetchData()
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
            varieties: [],
            valid: true,
            variety: null,
            // status: null,
            name: "",
            rules: {
                name: [
                    v => !!v || this.$t("coffeeData.topicRequired"),
                ],
            }
        }
    },
    methods: {

        async updateSpecies(){
            if(!this.$refs.treeForm.validate()) return;

            this.startLoading()
            try {
                const d = await CoffeeService.updateCoffeeSpecies(this.editedData.id, {name: this.name, coffeeVarId: this.variety, status: this.status === 'Active'})
                if(d.code === 200){
                    this.$notify({
                        title: this.$t("coffeeData.coffeeSpecieSuccess"),
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
