<template>
	<v-container>
        <v-dialog
            v-model="dialog"
            width="609"
            @click:outside="closeModal"
        >
            <v-card class="custom-card" rounded="0">
                <v-toolbar
                    color="secondary"
                    class="white--text"
                    >

                    <v-toolbar-title class="font-weight-bold">Edit Department</v-toolbar-title>

                    <v-spacer></v-spacer>

                    <v-btn icon class="white--text" @click="closeModal">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                    <v-form 
                        autocomplete="off"
                        ref="form"
                        v-model="valid"
                        @submit.prevent="updateDepartment"
                    >
				        <v-card-text class="black--text">
                            <label class="title" for="name">Department Name</label>
                            <v-text-field
                                outlined
                                dense
                                v-model="editedDept.name"
                                :rules=nameRules
                                :error-messages="errors.name"
                            >
                            </v-text-field>
                        
                        <v-card-actions class="mt-10">
                            <v-spacer></v-spacer>
                            <v-btn
                                class=""
                                outlined
                                color="primary"
                                @click="closeModal"
                                width="112"
                                
                            >
                                Cancel
                            </v-btn>
                            <v-btn type="submit" width="112" color="primary" class="btn-11 btn-22">
                                Submit
                            </v-btn>
                        </v-card-actions>
                        </v-card-text>
                        </v-form>
				        
			        </v-card>
		        </v-dialog>
    </v-container>
</template>

<script>
import PermissionsService from '@/_services/PermissionsService'
import loading from "@/mixins/LoadingMixin";

export default {
        computed: {
            dialog : {
                get(){
                    return this.dialogU;
                },
                set(){
                    return this.dialogU;
                }
            }
        },
        data() {
            return {
                valid: true,
                errors: { name: ''},
                editedDept: {...this.department},
                nameRules: [
                    v => !!v || 'Name is required',
                    v => (v && v.length <= 15) || 'Name must be less than 15 characters',
                ],
            }
        },
        methods: {
            closeModal() {
                this.$emit('closeUpdateDept')
            },
            updateDepartment() {
                if(!this.$refs.form.validate()) return;
                this.startLoading()
                PermissionsService.updateDepartment(this.editedDept)
                .then( respose => {
                    this.stopLoading()
                    if(respose.success){
                        this.$notify({
                            title: 'Department Updated',
                            text: respose.message,
                            type: 'success'
                        });
                        this.$emit('department:updated', true)
                        this.closeModal();
                    }else{
                        if(respose.response.data.message.errors[0].msg)
                            this.errors.name = respose.response.data.message.errors[0].msg
                        else{
                            this.$notify({
                                title: 'Department not Updated',
                                text: 'server error',
                                type: 'error'
                            });
                            this.$emit('department:updated', false)
                            this.closeModal();
                        }
                    }
                })
                .catch(error => {
                    this.stopLoading()
                    console.log('err', error)
                })
            }
        },

        props: ['dialogU', 'department'],
        mixins: [loading]
}
</script>
<style lang="scss" scoped>

</style>